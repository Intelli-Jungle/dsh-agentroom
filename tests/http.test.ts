import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { handler } from '../src/http.ts';
test('all HTTP routes honor native DSH authentication and require the custom header', async t => {
  let rejection: number | undefined = 401; let called = false;
  const runtime: any = { snapshot: () => { called = true; return { agents: [], rooms: [] }; } };
  const server = createServer(handler({ connection: { requestRejection: () => rejection } }, runtime));
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve)); t.after(() => { server.closeAllConnections(); server.close(); });
  const base = `http://127.0.0.1:${(server.address() as any).port}/agentroom/api/state`;
  assert.equal((await fetch(base, { headers: { 'x-agentroom-request': '1' } })).status, 401); assert.equal(called, false);
  rejection = 403; assert.equal((await fetch(base)).status, 403); assert.equal(called, false);
  rejection = undefined; assert.equal((await fetch(base)).status, 403); assert.equal(called, false);
  assert.equal((await fetch(base, { headers: { 'x-agentroom-request': '1' } })).status, 200); assert.equal(called, true);
});
