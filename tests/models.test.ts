import { test } from 'node:test';
import assert from 'node:assert/strict';
import { modelSelector } from '../src/models.ts';
test('member model wins over native selection, resets to host default, never saves global preferences', async () => {
  const hooks = new Map<string, Function[]>(); const logged: any[] = []; const cleanups: Function[] = [];
  const on = (name: string, fn: Function, options?: any) => { const list = hooks.get(name) || []; options?.prepend ? list.unshift(fn) : list.push(fn); hooks.set(name, list); return () => { list.splice(list.indexOf(fn), 1); }; };
  const agent = { ctx: { on }, session: { append: (...args: any[]) => logged.push(args) } };
  const originalDefault = { provider: 'host', model: 'default', reasoningEffort: 'high' };
  let saves = 0;
  const ctx = { on: () => () => {}, effect: (fn: Function) => cleanups.push(fn()), sessionController: { resolveAgent: async () => ({ agent }) }, llm: { resolveCallConfig: async (value: any) => ({ ...value }) }, agentDefaultModel: { currentSelection: () => ({ ...originalDefault }), saveSelection: () => { saves++; } } };
  const select = modelSelector(ctx);
  // Simulate a regular native conversation having installed its own waterfalls.
  on('system-prompt/assemble', async (_a: any, _b: any, next: any) => ({ ...await next(), variables: { model: 'native' } }));
  on('agent/request', async (_p: any, next: any) => ({ ...await next(), provider: 'native', model: 'native', reasoningEffort: 'old' }));
  const cascade = async (name: string, args: unknown[], base: any) => { const fns = hooks.get(name) || []; const next = (i: number): Promise<any> => i === fns.length ? Promise.resolve(base) : fns[i](...args, () => next(i + 1)); return next(0); };
  await select('session', { provider: 'member', model: 'fast' });
  const assembly = await cascade('system-prompt/assemble', [{}, {}], { variables: {} });
  assert.equal(assembly.variables.model, 'fast');
  const request = await cascade('agent/request', [{}], {});
  assert.equal(request.provider, 'member'); assert.equal(request.model, 'fast'); assert.equal(request.reasoningEffort, undefined);
  await select('session'); await cascade('system-prompt/assemble', [{}, {}], { variables: {} });
  assert.deepEqual(await cascade('agent/request', [{}], {}), originalDefault); assert.equal(saves, 0); assert.equal(logged.length, 2);
  cleanups.forEach(fn => fn());
});
test('DSH 0.2.2 uses the public Agent model API without legacy waterfalls', async () => {
  const choices: any[] = []; let hooks = 0;
  const agent = { model: { select: (value: any) => choices.push(value) }, ctx: { on: () => { hooks++; } } };
  const ctx = { on: () => () => {}, effect: (fn: Function) => fn(), sessionController: { resolveAgent: async () => ({ agent }) }, llm: { resolveCallConfig: async (value: any) => value }, agentDefaultModel: { currentSelection: () => ({ provider: 'host', model: 'default' }) } };
  const select = modelSelector(ctx); await select('new-api', { provider: 'member', model: 'fast' }); await select('new-api');
  assert.deepEqual(choices, [{ provider: 'member', model: 'fast' }, { provider: 'host', model: 'default' }]); assert.equal(hooks, 0);
});
