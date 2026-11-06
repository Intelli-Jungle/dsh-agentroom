import type { Member } from './model.ts';

/** Session-local selection using public Agent waterfalls. sessionController.selectModel
 * also saves the global default, which is inappropriate for independent members. */
export function modelSelector(ctx: any) {
  const bindings = new Map<object, { selected: any; assembled: any; dispose(): void }>();
  const forget = ctx.on('agent/disposed', ({ agent }: any) => { bindings.get(agent)?.dispose(); bindings.delete(agent); });
  ctx.effect(() => () => { forget(); for (const value of bindings.values()) value.dispose(); bindings.clear(); });
  return async (sessionId: string, model?: Member['model']) => {
    const result = await ctx.sessionController.resolveAgent(sessionId);
    if ('error' in result) throw result.error;
    const agent = result.agent;
    const configured = model || ctx.agentDefaultModel.currentSelection();
    const resolved = await ctx.llm.resolveCallConfig(configured);
    const selected = { provider: resolved.provider, model: resolved.model, ...(resolved.reasoningEffort ? { reasoningEffort: resolved.reasoningEffort } : {}) };
    // DSH 0.2.2 moved session-local selection into the public Agent model API.
    if (typeof agent.model?.select === 'function') { agent.model.select(selected); return; }
    let binding = bindings.get(agent);
    if (!binding) {
      const value = { selected, assembled: undefined as any, dispose: () => {} };
      // Prepend makes this outer waterfall apply the member's selection after
      // the host's own model-selection contribution finishes, including native
      // sessions that were already opened in the regular conversation view.
      const a = agent.ctx.on('system-prompt/assemble', async (_assembly: any, _context: any, next: any) => {
        const snapshot = value.selected; const result = await next(); value.assembled = snapshot;
        return { ...result, variables: { ...result.variables, provider: snapshot.provider, model: snapshot.model } };
      }, { prepend: true });
      const b = agent.ctx.on('agent/request', async (_payload: any, next: any) => {
        const result = await next(); const { reasoningEffort: _old, ...rest } = result;
        return { ...rest, ...value.assembled };
      }, { prepend: true });
      value.dispose = () => { a(); b(); }; binding = value; bindings.set(agent, value);
    }
    binding.selected = selected;
    agent.session.append('model/selection', selected);
  };
}
