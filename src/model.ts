import { z } from 'zod';
export const agentSchema = z.object({
  backend: z.enum(['dsh', 'codex', 'claude']).optional(),
  cliModel: z.string().trim().regex(/^[a-zA-Z0-9][a-zA-Z0-9._:/-]{0,149}$/).optional(),
  id: z.string().regex(/^[a-z][a-z0-9-]{0,31}$/).refine(id => !['all', 'you', 'system'].includes(id), 'Reserved mention ID'), name: z.string().trim().min(1).max(48),
  role: z.string().trim().min(1).max(8000), color: z.string().regex(/^#[0-9a-f]{6}$/i),
  model: z.object({ provider: z.string().min(1).max(150), model: z.string().min(1).max(150) }).optional(),
});
export type Member = z.infer<typeof agentSchema>;
export const attachmentSchema = z.object({ name: z.string().max(150), text: z.string().max(100_000) });
export const messageSchema = z.object({
  id: z.string(), author: z.string(), name: z.string(), color: z.string().regex(/^#[0-9a-f]{6}$/i), text: z.string().max(2_000_000), at: z.number(),
  kind: z.enum(['human', 'agent', 'system']), runId: z.string().optional(), sessionId: z.string().optional(),
  attachments: z.array(attachmentSchema).max(4).optional(),
});
export type Message = z.infer<typeof messageSchema>;
export const runSchema = z.object({
  backend: z.enum(['dsh', 'codex', 'claude']).optional(),
  id: z.string(), memberId: z.string(), sessionId: z.string(), rootId: z.string(), lastSeq: z.number().default(-1),
  status: z.enum(['preparing', 'running', 'completed', 'stopped', 'error', 'interrupted']),
  at: z.number(), endedAt: z.number().optional(), detail: z.string().optional(), tools: z.array(z.string()).default([]),
});
export type Run = z.infer<typeof runSchema>;
export const roomSchema = z.object({
  id: z.string(), title: z.string().trim().min(1).max(80), cwd: z.string().min(1), members: z.array(z.string()).min(1).max(8).refine(ids => new Set(ids).size === ids.length, 'Duplicate members'),
  archived: z.boolean(), collaboration: z.boolean().default(true), createdAt: z.number(), updatedAt: z.number(),
  messages: z.array(messageSchema), runs: z.array(runSchema), sessions: z.record(z.string(), z.string()),
  budgets: z.record(z.string(), z.number()).default({}),
});
export type Room = z.infer<typeof roomSchema>;
export const stateSchema = z.object({ version: z.literal(1), agents: z.array(agentSchema).min(1).max(32), rooms: z.array(roomSchema).max(1000) });
export type State = z.infer<typeof stateSchema>;
export const active = (run: Run) => run.status === 'preparing' || run.status === 'running';
export function initialState(): State {
  return { version: 1, rooms: [], agents: [
    { id: 'planner', name: 'Planner', role: '你是规划师。澄清目标、拆解任务并给出可执行方案。需要实现时可明确 @coder 委派，需要复核时 @reviewer。简洁回答。', color: '#8b5cf6' },
    { id: 'coder', name: 'Coder', role: '你是工程师。根据任务读取工作目录、实现并验证修改。遵守 DSH 原生权限。需要复核时明确 @reviewer 请求检查，并描述改动和验证方法。', color: '#3b82f6' },
    { id: 'reviewer', name: 'Reviewer', role: '你是审查员。检查正确性、边界条件和可验证证据，按严重程度报告问题。没有问题就明确说明。只在确需返工时 @coder。', color: '#16a34a' },
  ] };
}
/** Whole-token routing; email addresses and code fences do not wake members. */
export function mentions(text: string, members: string[]): string[] {
  const plain = text.replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '');
  const hits = [...plain.matchAll(/(?:^|[\s(（,，:：])@([a-z][a-z0-9-]*)(?![a-z0-9-])/gi)].map(m => m[1].toLowerCase());
  return members.filter(id => hits.includes(id) || hits.includes('all'));
}
/** Automatic work requires a dedicated actionable handoff line; reporting
 * that another member did something must never wake that member. */
export function handoffMentions(text: string, members: string[]): string[] {
  const plain = text.replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '');
  const hits = plain.split('\n').flatMap(line => {
    const match = line.match(/^\s*(?:[-*]\s+|\d+[.)]\s+)?@([a-z][a-z0-9-]*)(?![a-z0-9-])[\s,:，：]*(请|麻烦|帮忙|需要你|继续|实现|检查|修复|验证|please\b|can you\b|could you\b|implement\b|review\b|check\b|fix\b|verify\b|take\b|continue\b|build\b|test\b|confirm\b|inspect\b)/i);
    return match ? [match[1].toLowerCase()] : [];
  });
  return members.filter(id => hits.includes(id) || hits.includes('all'));
}
export function transcript(room: Room, count = 40): string {
  return room.messages.filter(m => m.kind !== 'system').slice(-count).map(m => `[${m.name} @${m.author}] ${m.text}${m.attachments?.map(a => `\n[附件 ${a.name}]\n${a.text}`).join('') || ''}`).join('\n\n').slice(-80_000);
}
export function markdown(room: Room): string {
  return `# ${room.title}\n\n${room.cwd}\n\n` + room.messages.map(m => `## ${m.name} · ${new Date(m.at).toISOString()}\n\n${m.text}${m.attachments?.map(a => `\n\n### ${a.name}\n\n${a.text}`).join('') || ''}\n`).join('\n');
}
