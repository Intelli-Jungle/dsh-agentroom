import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { cliRunner } from '../src/cli.ts';

async function executable(t: any, source: string) {
  const dir = await mkdtemp(join(tmpdir(), 'agentroom-cli-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const path = join(dir, 'fixture');
  await writeFile(path, `#!${process.execPath}\n${source}`, { mode: 0o700 });
  return { path, dir };
}
test('JSONL handles split chunks, transient transport retries and final completion', async t => {
  const { path, dir } = await executable(t, `process.stdin.resume(); process.stdin.on('end', () => { process.stdout.write('{"type":"thread.'); setTimeout(() => { process.stdout.write('started","thread_id":"session-one"}\\n'); for (const e of [{type:'error',message:'Reconnecting'}, {type:'item.completed',item:{type:'agent_message',text:'A real response'}},{type:'turn.completed'}]) console.log(JSON.stringify(e)); }, 5); });`);
  let session = '';
  const value = await cliRunner({ codex: path })({ backend: 'codex', cwd: dir, prompt: 'untrusted $(command)', signal: new AbortController().signal, onSession: id => { session = id; }, onText: () => {} });
  assert.equal(value, 'A real response'); assert.equal(session, 'session-one');
});
test('Claude result is_error rejects even when process exits successfully', async t => {
  const { path, dir } = await executable(t, `process.stdin.resume(); process.stdin.on('end', () => console.log(JSON.stringify({type:'result',is_error:true,result:'Not logged in'})));`);
  await assert.rejects(cliRunner({ claude: path })({ backend: 'claude', cwd: dir, prompt: 'test', signal: new AbortController().signal, onSession: () => {}, onText: () => {} }), /Not logged in/);
});
test('CLI cancellation settles and missing executables produce actionable errors', async t => {
  const { path, dir } = await executable(t, 'process.stdin.resume(); setInterval(() => {}, 1000);');
  const controller = new AbortController();
  const request = { backend: 'codex' as const, cwd: dir, prompt: 'test', signal: controller.signal, onSession: () => {}, onText: () => {} };
  const running = cliRunner({ codex: path })(request); setTimeout(() => controller.abort(), 50);
  await assert.rejects(running, /stopped/);
  await assert.rejects(cliRunner({ codex: join(dir, 'missing') })({ ...request, signal: new AbortController().signal }), /Install and log in/);
});
