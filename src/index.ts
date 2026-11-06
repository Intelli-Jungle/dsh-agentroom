import { join, isAbsolute } from 'node:path';
import { homedir } from 'node:os';
import schema from '@deepseek-ai/schemastery';
import { Store } from './store.ts';
import { Runtime } from './runtime.ts';
import { handler } from './http.ts';
import { modelSelector } from './models.ts';
export const name = 'dsh-agentroom';
export const inject = ['webServer', 'connection', 'sessionController', 'sessionQuery', 'llm', 'agentDefaultModel'];
export const Config = schema.object({
  dataDir: schema.string().description('Absolute data directory; one running host per directory.').default(join(process.env.DSH_HOME?.trim() || join(homedir(), '.dsh'), 'dsh-agentroom')),
  maxHandoffs: schema.number().step(1).min(0).max(16).default(4).description('Maximum automatic member handoffs per human message.'),
});
export async function apply(ctx: any, config: { dataDir: string; maxHandoffs: number }) {
  if (!isAbsolute(config.dataDir)) throw new Error('Agentroom dataDir must be an absolute path');
  const runtime = new Runtime({ sessionController: ctx.sessionController, readSession: (id: string) => ctx.sessionQuery.readSession(id), on: ctx.on.bind(ctx), logger: ctx.logger, configureModel: modelSelector(ctx) }, new Store(config.dataDir), config.maxHandoffs);
  try { await runtime.start(); } catch (error) { await runtime.store.close(); throw error; }
  ctx.effect(() => () => runtime.close());
  ctx.effect(() => ctx.webServer.register({ kind: 'prefix', path: '/agentroom/api', handler: handler(ctx, runtime) }));
  ctx.logger.info('Agentroom ready. Open Agentroom from the DSH sidebar.');
}
