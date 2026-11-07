import { spawn } from 'node:child_process';
import type { Member } from './model.ts';

export type CliBackend = 'codex' | 'claude';
export interface CliRequest {
  backend: CliBackend; cwd: string; prompt: string; session?: string;
  model?: string; signal: AbortSignal;
  onSession(id: string): void; onText(text: string): void;
}
export type CliRunner = (request: CliRequest) => Promise<string>;
export const backendOf = (member: Member) => member.backend || 'dsh';

/** Fixed executables/argv, never a shell command. Credentials stay with each CLI. */
export function cliRunner(paths: Partial<Record<CliBackend, string>> = {}, timeoutMs = 300_000): CliRunner {
  return request => new Promise((resolve, reject) => {
    if (request.signal.aborted) { reject(new Error('CLI stopped')); return; }
    const { backend, session, model } = request;
    const args = backend === 'codex'
      ? ['exec', ...(session ? ['resume', session] : []), '--json', '--skip-git-repo-check', '-c', 'sandbox_mode="read-only"', '-c', 'approval_policy="never"', '-c', 'model_providers.openai.supports_websockets=false', ...(model ? ['--model', model] : []), '-']
      : ['-p', '--output-format', 'stream-json', '--verbose', '--tools', '', '--strict-mcp-config', '--permission-mode', 'dontAsk', ...(session ? ['--resume', session] : []), ...(model ? ['--model', model] : [])];
    const child = spawn(paths[backend] || backend, args, { cwd: request.cwd, shell: false, detached: process.platform !== 'win32', stdio: ['pipe', 'pipe', 'pipe'] });
    let buffer = '', stderr = '', text = '', failure = '', completed = false, bytes = 0;
    let killTimer: ReturnType<typeof setTimeout> | undefined;
    const kill = (signal: NodeJS.Signals) => { try { if (child.pid && process.platform !== 'win32') process.kill(-child.pid, signal); else child.kill(signal); } catch { /* already exited */ } };
    const stop = () => { kill('SIGTERM'); killTimer ||= setTimeout(() => kill('SIGKILL'), 1500); };
    const timeout = setTimeout(() => { failure = 'CLI timed out after 5 minutes'; stop(); }, timeoutMs);
    request.signal.addEventListener('abort', stop, { once: true });
    const clean = () => { clearTimeout(timeout); if (killTimer) clearTimeout(killTimer); request.signal.removeEventListener('abort', stop); };
    const consume = (line: string) => {
      if (!line.trim()) return;
      let event: any; try { event = JSON.parse(line); } catch { return; }
      if (backend === 'codex') {
        if (event.type === 'thread.started' && typeof event.thread_id === 'string') request.onSession(event.thread_id);
        if (event.type === 'item.completed' && event.item?.type === 'agent_message') { text = event.item.text; request.onText(text); }
        if (event.type === 'turn.completed') { completed = true; failure = ''; }
        if (event.type === 'turn.failed' || event.type === 'error') failure = event.error?.message || event.message || 'Codex request failed';
      } else {
        if (event.type === 'system' && event.subtype === 'init' && typeof event.session_id === 'string') request.onSession(event.session_id);
        if (event.type === 'assistant' && !event.is_api_error_message) {
          text = (event.message?.content || []).filter((b: any) => b.type === 'text').map((b: any) => b.text).join('');
          request.onText(text);
        }
        if (event.type === 'result') {
          if (event.is_error) failure = event.result || event.errors?.join('; ') || 'Claude request failed';
          else { completed = true; if (typeof event.result === 'string') text = event.result; }
        }
      }
    };
    child.stdout.setEncoding('utf8'); child.stderr.setEncoding('utf8');
    child.stdout.on('data', chunk => {
      bytes += Buffer.byteLength(chunk);
      if (bytes > 8 * 1024 * 1024) { failure = 'CLI output exceeded 8 MB'; stop(); return; }
      buffer += chunk; let end: number;
      while ((end = buffer.indexOf('\n')) >= 0) { const line = buffer.slice(0, end); buffer = buffer.slice(end + 1); consume(line); }
    });
    child.stderr.on('data', chunk => { stderr = (stderr + chunk).slice(-3000); });
    child.stdin.on('error', () => { /* early process exit is reported below */ });
    child.once('error', error => { clean(); reject(new Error(`${backend}: ${error.message}. Install and log in to this CLI first.`)); });
    child.once('close', code => {
      clean(); consume(buffer);
      if (request.signal.aborted) reject(new Error('CLI stopped'));
      else if (failure || code !== 0 || !completed || !text.trim()) reject(new Error(failure || `${backend} exited (${code}): ${stderr || 'No completed response'}`));
      else resolve(text);
    });
    child.stdin.end(request.prompt);
  });
}
