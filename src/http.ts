import type { IncomingMessage, ServerResponse } from 'node:http';
import { z } from 'zod';
import { Runtime, RoomError } from './runtime.ts';
import { markdown } from './model.ts';
const json = (res: ServerResponse, status: number, value: unknown) => { res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' }); res.end(JSON.stringify(value)); };
async function body(req: IncomingMessage) {
  if (!req.headers['content-type']?.startsWith('application/json')) throw new RoomError(415, 'Expected application/json');
  let size = 0; const chunks: Buffer[] = [];
  for await (const chunk of req) { size += chunk.length; if (size > 8 * 1024 * 1024) throw new RoomError(413, 'Request too large'); chunks.push(chunk); }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw new RoomError(400, 'Invalid JSON'); }
}
export function handler(ctx: any, runtime: Runtime) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    // Reuse the native host/origin and login-cookie fence, including Desktop IPC.
    const rejection = ctx.connection.requestRejection(req);
    if (rejection !== undefined) { json(res, rejection, { error: 'DSH authentication required' }); return; }
    if (req.headers['x-agentroom-request'] !== '1') { json(res, 403, { error: 'Agentroom request header required' }); return; }
    try {
      const url = new URL(req.url || '/', 'http://localhost');
      const path = url.pathname.slice('/agentroom/api/'.length).split('/').map(decodeURIComponent);
      const method = req.method;
      if (method === 'GET' && path[0] === 'state') { json(res, 200, runtime.snapshot(url.searchParams.get('room') || undefined)); return; }
      if (method === 'GET' && path[0] === 'models') { json(res, 200, await runtime.host.sessionController.modelCatalog()); return; }
      if (method === 'GET' && path[0] === 'export' && path[1]) {
        const room = runtime.room(path[1]);
        json(res, 200, url.searchParams.get('format') === 'md' ? { text: markdown(room) } : { format: 'dsh-agentroom/1', agents: runtime.store.state.agents.filter(a => room.members.includes(a.id)), room }); return;
      }
      if (method !== 'POST') throw new RoomError(405, 'Method not allowed');
      const input = await body(req);
      const value = await runtime.mutate(async () => {
        if (path[0] === 'rooms' && !path[1]) return runtime.create(input);
        if (path[0] === 'agents') return runtime.saveAgent(input);
        if (path[0] === 'import') return runtime.importRoom(input);
        if (path[0] === 'rooms' && path[1]) {
          if (path[2] === 'edit') return runtime.edit(path[1], input);
          if (path[2] === 'send') return runtime.send(path[1], input);
          if (path[2] === 'stop') return runtime.stop(path[1], z.object({ memberId: z.string().optional() }).parse(input).memberId);
        }
        throw new RoomError(404, 'Unknown Agentroom operation');
      });
      json(res, 200, value);
    } catch (error: any) {
      json(res, error instanceof RoomError ? error.status : error instanceof z.ZodError || error.code === 'ENOENT' ? 400 : 500, { error: error instanceof z.ZodError ? error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ') : error.message || String(error) });
    }
  };
}
