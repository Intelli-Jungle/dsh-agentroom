import React from 'react';
import { App } from './app.tsx';
declare const __AGENTROOM_CSS__: string;
export const inject = ['slots', 'uiWorkspace', 'sessions'];
export function apply(ctx: any) {
  ctx.effect(() => {
    const style = document.createElement('style'); style.dataset.agentroom = 'true'; style.textContent = __AGENTROOM_CSS__;
    document.head.append(style); return () => style.remove();
  });
  const openSession = async (sessionId: string) => {
    await ctx.sessions.refresh();
    const list = ctx.sessions.list.getSnapshot();
    if (list.phase !== 'ready' || !list.byId[sessionId]) throw new Error('原生会话尚不可用，请稍后重试 / Native session is not listed yet');
    ctx.uiWorkspace.openSession(sessionId);
  };
  ctx.effect(() => ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: 'dsh-agentroom', inject: () => ({}) }, () => <App openSession={openSession} />)));
  ctx.effect(() => ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({ name: 'sidebar.panellist', id: 'dsh-agentroom', order: 12, label: () => 'Agentroom' }, ({ size = 20 }: { size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v12H10l-5 4v-4H4z"/><path d="M8 8h8M8 12h5"/></svg>)));
}
