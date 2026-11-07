import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { Store } from '../src/store.ts';
import { Runtime, type Host } from '../src/runtime.ts';
import { mentions, handoffMentions, markdown } from '../src/model.ts';
import type { CliRunner, CliRequest } from '../src/cli.ts';

class FakeHost implements Host {
  configureModel = async (_id: string, _model?: any) => {};
  readSession = async (id: string) => { if (!this.sessions.has(id)) throw new Error('not found'); return { events: this.sessions.get(id)! }; };
  listeners = new Map<string, Set<Function>>();
  sessions = new Map<string, any[]>(); prompts: any[] = []; canceled: string[] = [];
  rejectPrompt = false;
  logger = { error: (..._args: any[]) => {} };
  on(name: string, fn: Function) { const set = this.listeners.get(name) || new Set(); set.add(fn); this.listeners.set(name, set); return () => { set.delete(fn); }; }
  emit(name: string, ...args: any[]) { for (const fn of this.listeners.get(name) || []) fn(...args); }
  event(id: string, type: string, data: any) { const events = this.sessions.get(id)!; const event = { seq: events.length, time: Date.now(), type, data }; events.push(event); this.emit('session/event', { id }, event); }
  sessionController = {
    create: async (input: any) => { this.sessions.set(input.sessionId, []); return { sessionId: input.sessionId }; },
    resolveAgent: async (id: string) => this.sessions.has(id) ? { agent: {} } : { error: { code: 'session/not-found' } },
    rename: async (_input: any) => {}, selectModel: async (_input: any) => {},
    prompt: async (input: any) => { if (this.rejectPrompt) throw new Error('quota exhausted'); this.prompts.push(input); },
    cancel: (input: any) => { this.canceled.push(input.sessionId); },
    inspect: async (id: string) => { if (!this.sessions.has(id)) throw new Error('not found'); return { events: this.sessions.get(id) }; },
    modelCatalog: async () => ({ groups: [] }),
  };
}
const until = async (predicate: () => boolean) => { for (let n = 0; n < 100; n++) { if (predicate()) return; await new Promise(r => setTimeout(r, 10)); } assert.ok(predicate(), 'condition did not settle'); };
async function fixture(t: any, maxHandoffs = 2, cli?: CliRunner) {
  const dir = await mkdtemp(join(tmpdir(), 'agentroom-test-')); const host = new FakeHost(); const runtime = await new Runtime(host, new Store(dir), maxHandoffs, cli).start();
  t.after(async () => { await runtime.close(); await rm(dir, { recursive: true, force: true }); });
  const room = await runtime.create({ title: 'Integration room', cwd: dir, members: ['planner', 'coder', 'reviewer'] });
  return { dir, host, runtime, room };
}
test('mentions route exact members, @all and punctuation without waking email/code', () => {
  const members = ['planner', 'coder'];
  assert.deepEqual(mentions('@planner 请 @coder 修复', members), members);
  assert.deepEqual(mentions('(@all) hello', members), members);
  assert.deepEqual(mentions('a@coder.com `@planner` ```\n@coder\n``` @coder-extra', members), []);
});
test('automatic handoffs require explicit requests, not progress reports or incidental mentions', () => {
  const members = ['coder', 'reviewer'];
  assert.deepEqual(handoffMentions('7 + 5 = 12\n\n@reviewer 请确认等式正确', members), ['reviewer']);
  assert.deepEqual(handoffMentions('@coder implement this', members), ['coder']);
  assert.deepEqual(handoffMentions('- 证据核验：@coder 转述正确。\n@coder completed the task.\n`@reviewer 请检查`', members), []);
});
test('parallel native sessions, shared context, deduplication, busy refusal and persistent continuation', async t => {
  const { host, runtime, room } = await fixture(t);
  const id = randomUUID(); await runtime.send(room.id, { id, text: '@planner @coder compare', attachments: [{ name: 'spec.txt', text: 'The shared specification' }] });
  await until(() => host.prompts.length === 2);
  assert.notEqual(host.prompts[0].sessionId, host.prompts[1].sessionId);
  assert.ok(host.prompts.every(p => p.content[0].text.includes('The shared specification')));
  await runtime.send(room.id, { id, text: '@planner duplicate' }); assert.equal(host.prompts.length, 2);
  await assert.rejects(runtime.send(room.id, { id: randomUUID(), text: '@coder again' }), /busy/);
  const original = host.prompts[0].sessionId;
  host.event(original, 'assistant/message', { message: { content: [{ type: 'text', text: 'Plan ready' }] } });
  host.event(original, 'turn/end', { reason: { kind: 'completed' } });
  await runtime.send(room.id, { id: randomUUID(), text: '@planner continue' });
  await until(() => host.prompts.length === 3); assert.equal(host.prompts[2].sessionId, original);
  assert.equal(room.messages.filter(m => m.kind === 'agent').length, 1);
  assert.match(markdown(room), /Plan ready/);
});
test('explicit cross-member handoffs share a bounded root allowance', async t => {
  const { host, runtime, room } = await fixture(t, 1);
  await runtime.send(room.id, { id: randomUUID(), text: '@planner start' }); await until(() => host.prompts.length === 1);
  host.event(host.prompts[0].sessionId, 'assistant/message', { message: { content: [{ type: 'text', text: '@coder implement this' }] } });
  host.event(host.prompts[0].sessionId, 'turn/end', { reason: { kind: 'completed' } }); await until(() => host.prompts.length === 2);
  host.event(host.prompts[1].sessionId, 'assistant/message', { message: { content: [{ type: 'text', text: '@reviewer inspect this' }] } });
  host.event(host.prompts[1].sessionId, 'turn/end', { reason: { kind: 'completed' } });
  await until(() => room.messages.some(m => m.kind === 'system')); assert.equal(host.prompts.length, 2);
  assert.equal(room.runs.filter(r => r.status === 'preparing' || r.status === 'running').length, 0);
});
test('stop prevents relays, archive blocks sends, errors retain actual cause', async t => {
  const { host, runtime, room } = await fixture(t);
  await runtime.send(room.id, { id: randomUUID(), text: '@planner wait' }); await until(() => host.prompts.length === 1);
  await runtime.stop(room.id, 'planner');
  host.event(host.prompts[0].sessionId, 'assistant/message', { message: { content: [{ type: 'text', text: '@coder should not run' }] } });
  host.event(host.prompts[0].sessionId, 'turn/end', { reason: { kind: 'completed' } });
  assert.equal(host.prompts.length, 1); assert.equal(host.canceled.length, 1);
  await runtime.edit(room.id, { archived: true });
  await assert.rejects(runtime.send(room.id, { id: randomUUID(), text: '@coder hello' }), /Restore/);
  await runtime.edit(room.id, { archived: false }); host.rejectPrompt = true;
  await runtime.send(room.id, { id: randomUUID(), text: '@coder hello' }); await until(() => room.runs.at(-1)?.status === 'error');
  assert.equal(room.runs.at(-1)?.detail, 'quota exhausted');
});
test('import strips execution identities and starts archived; malformed imports leave state alone', async t => {
  const { runtime, room } = await fixture(t);
  const imported = await runtime.importRoom({ format: 'dsh-agentroom/1', agents: runtime.store.state.agents, room });
  assert.notEqual(imported.id, room.id); assert.equal(imported.archived, true); assert.deepEqual(imported.sessions, {}); assert.deepEqual(imported.runs, []);
  const count = runtime.store.state.rooms.length;
  await assert.rejects(runtime.importRoom({ format: 'bad' })); assert.equal(runtime.store.state.rooms.length, count);
});
test('atomic persistence, single writer lock, invalid file preserved', async t => {
  const dir = await mkdtemp(join(tmpdir(), 'agentroom-store-')); t.after(() => rm(dir, { recursive: true, force: true }));
  const store = await new Store(dir).load();
  await assert.rejects(new Store(dir).load(), /already in use/);
  await Promise.all([store.save(), store.save()]); await store.close();
  const restored = await new Store(dir).load(); assert.equal(restored.state.agents.length, 3); await restored.close();
  await writeFile(join(dir, 'state.json'), '{broken');
  await assert.rejects(new Store(dir).load(), /preserve/); assert.equal(await readFile(join(dir, 'state.json'), 'utf8'), '{broken');
});
test('restart recovers committed response without dispatching an uncertain turn again', async t => {
  const dir = await mkdtemp(join(tmpdir(), 'agentroom-recovery-')); const host = new FakeHost(); const first = await new Runtime(host, new Store(dir)).start();
  const room = await first.create({ title: 'Recovery', cwd: dir, members: ['planner'] }); await first.send(room.id, { id: randomUUID(), text: '@planner start' }); await until(() => host.prompts.length === 1);
  // Simulate abrupt process death: release the disk lock, without graceful stop.
  await first.store.save(); await first.store.close(); host.listeners.clear();
  const id = host.prompts[0].sessionId;
  host.event(id, 'assistant/message', { message: { content: [{ type: 'text', text: 'Committed just before crash' }] } });
  host.event(id, 'turn/end', { reason: { kind: 'completed' } });
  const second = await new Runtime(host, new Store(dir)).start();
  assert.equal(second.room(room.id).runs[0].status, 'completed'); assert.equal(second.room(room.id).messages.at(-1)?.text, 'Committed just before crash'); assert.equal(host.prompts.length, 1);
  await second.close(); await rm(dir, { recursive: true, force: true });
});

test('CLI sessions persist per backend and room; mixed handoffs preserve native routing', async t => {
  const calls: CliRequest[] = [];
  const { runtime, room, host } = await fixture(t, 1, async request => {
    calls.push(request); request.onSession(request.session || randomUUID()); return calls.length === 1 ? '@coder 请检查这个方案' : 'continued';
  });
  await runtime.saveAgent({ ...runtime.store.state.agents[0], backend: 'codex' });
  await runtime.send(room.id, { id: randomUUID(), text: '@planner start' });
  await until(() => host.prompts.length === 1);
  assert.equal(room.runs[0].status, 'completed'); assert.equal(room.runs[0].backend, 'codex');
  const session = room.sessions['codex:planner']; assert.ok(session);
  await runtime.send(room.id, { id: randomUUID(), text: '@planner again' });
  await until(() => calls.length === 2 && room.runs.at(-1)?.status === 'completed');
  assert.equal(calls[1].session, session);
  await runtime.saveAgent({ ...runtime.store.state.agents[0], backend: 'claude' });
  await runtime.send(room.id, { id: randomUUID(), text: '@planner changed backend' });
  await until(() => calls.length === 3 && room.runs.at(-1)?.status === 'completed');
  assert.equal(calls[2].session, undefined); assert.equal(calls[2].backend, 'claude');
  const second = await runtime.create({ title: 'Separate', cwd: room.cwd, members: ['planner'] });
  await runtime.send(second.id, { id: randomUUID(), text: '@planner separate room' });
  await until(() => calls.length === 4); assert.equal(calls[3].session, undefined);
});

test('stopping CLI aborts its process and cannot publish late text or trigger a relay', async t => {
  let request: CliRequest | undefined;
  let finish!: (text: string) => void;
  const { runtime, room, host } = await fixture(t, 2, input => { request = input; return new Promise(resolve => { finish = resolve; }); });
  await runtime.saveAgent({ ...runtime.store.state.agents[0], backend: 'codex' });
  await runtime.send(room.id, { id: randomUUID(), text: '@planner start' });
  await until(() => !!request);
  await runtime.stop(room.id); assert.equal(request!.signal.aborted, true);
  finish('@coder 请不要启动'); await new Promise(r => setTimeout(r, 20));
  assert.equal(room.runs[0].status, 'stopped'); assert.equal(room.messages.length, 1); assert.equal(host.prompts.length, 0);
});

test('CLI auth failures remain errors and imported CLI rooms lose all execution identities', async t => {
  const { runtime, room } = await fixture(t, 1, async () => { throw new Error('Not logged in'); });
  await runtime.saveAgent({ ...runtime.store.state.agents[0], backend: 'claude' });
  await runtime.send(room.id, { id: randomUUID(), text: '@planner start' });
  await until(() => room.runs[0].status === 'error'); assert.equal(room.runs[0].detail, 'Not logged in');
  const imported = await runtime.importRoom({ format: 'dsh-agentroom/1', agents: runtime.store.state.agents, room });
  assert.deepEqual(imported.sessions, {}); assert.deepEqual(imported.runs, []); assert.equal(imported.archived, true);
});

test('restart marks unfinished CLI requests interrupted without replaying or inspecting native sessions', async t => {
  const dir = await mkdtemp(join(tmpdir(), 'agentroom-cli-restart-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const store = await new Store(dir).load();
  store.state.rooms.push({ id: randomUUID(), title: 'Interrupted CLI', cwd: dir, members: ['planner'], archived: false, collaboration: true, createdAt: 1, updatedAt: 1, messages: [], budgets: {}, sessions: { 'codex:planner': 'external-session' }, runs: [{ id: randomUUID(), rootId: randomUUID(), memberId: 'planner', backend: 'codex', sessionId: 'external-session', status: 'running', at: 1, lastSeq: -1, tools: [] }] });
  await store.save(); await store.close();
  const host = new FakeHost(); let inspections = 0; host.readSession = async () => { inspections++; return { events: [] }; };
  let calls = 0;
  const runtime = await new Runtime(host, new Store(dir), 4, async () => { calls++; return 'unexpected'; }).start();
  assert.equal(runtime.store.state.rooms[0].runs[0].status, 'interrupted');
  assert.equal(inspections, 0); assert.equal(calls, 0);
  assert.equal(runtime.store.state.rooms[0].sessions['codex:planner'], 'external-session');
  await runtime.close();
});
