// src/index.ts
import { join as join2, isAbsolute as isAbsolute2 } from "node:path";
import { homedir } from "node:os";
import schema from "@deepseek-ai/schemastery";

// src/store.ts
import { mkdir, readFile, rename, writeFile, open, unlink } from "node:fs/promises";
import { join } from "node:path";

// src/model.ts
import { z } from "zod";
var agentSchema = z.object({
  backend: z.enum(["dsh", "codex", "claude"]).optional(),
  cliModel: z.string().trim().regex(/^[a-zA-Z0-9][a-zA-Z0-9._:/-]{0,149}$/).optional(),
  id: z.string().regex(/^[a-z][a-z0-9-]{0,31}$/).refine((id) => !["all", "you", "system"].includes(id), "Reserved mention ID"),
  name: z.string().trim().min(1).max(48),
  role: z.string().trim().min(1).max(8e3),
  color: z.string().regex(/^#[0-9a-f]{6}$/i),
  model: z.object({ provider: z.string().min(1).max(150), model: z.string().min(1).max(150) }).optional()
});
var attachmentSchema = z.object({ name: z.string().max(150), text: z.string().max(1e5) });
var messageSchema = z.object({
  id: z.string(),
  author: z.string(),
  name: z.string(),
  color: z.string().regex(/^#[0-9a-f]{6}$/i),
  text: z.string().max(2e6),
  at: z.number(),
  kind: z.enum(["human", "agent", "system"]),
  runId: z.string().optional(),
  sessionId: z.string().optional(),
  attachments: z.array(attachmentSchema).max(4).optional()
});
var runSchema = z.object({
  backend: z.enum(["dsh", "codex", "claude"]).optional(),
  id: z.string(),
  memberId: z.string(),
  sessionId: z.string(),
  rootId: z.string(),
  lastSeq: z.number().default(-1),
  status: z.enum(["preparing", "running", "completed", "stopped", "error", "interrupted"]),
  at: z.number(),
  endedAt: z.number().optional(),
  detail: z.string().optional(),
  tools: z.array(z.string()).default([])
});
var roomSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1).max(80),
  cwd: z.string().min(1),
  members: z.array(z.string()).min(1).max(8).refine((ids) => new Set(ids).size === ids.length, "Duplicate members"),
  archived: z.boolean(),
  collaboration: z.boolean().default(true),
  createdAt: z.number(),
  updatedAt: z.number(),
  messages: z.array(messageSchema),
  runs: z.array(runSchema),
  sessions: z.record(z.string(), z.string()),
  budgets: z.record(z.string(), z.number()).default({})
});
var stateSchema = z.object({ version: z.literal(1), agents: z.array(agentSchema).min(1).max(32), rooms: z.array(roomSchema).max(1e3) });
var active = (run) => run.status === "preparing" || run.status === "running";
function initialState() {
  return { version: 1, rooms: [], agents: [
    { id: "planner", name: "Planner", role: "\u4F60\u662F\u89C4\u5212\u5E08\u3002\u6F84\u6E05\u76EE\u6807\u3001\u62C6\u89E3\u4EFB\u52A1\u5E76\u7ED9\u51FA\u53EF\u6267\u884C\u65B9\u6848\u3002\u9700\u8981\u5B9E\u73B0\u65F6\u53EF\u660E\u786E @coder \u59D4\u6D3E\uFF0C\u9700\u8981\u590D\u6838\u65F6 @reviewer\u3002\u7B80\u6D01\u56DE\u7B54\u3002", color: "#8b5cf6" },
    { id: "coder", name: "Coder", role: "\u4F60\u662F\u5DE5\u7A0B\u5E08\u3002\u6839\u636E\u4EFB\u52A1\u8BFB\u53D6\u5DE5\u4F5C\u76EE\u5F55\u3001\u5B9E\u73B0\u5E76\u9A8C\u8BC1\u4FEE\u6539\u3002\u9075\u5B88 DSH \u539F\u751F\u6743\u9650\u3002\u9700\u8981\u590D\u6838\u65F6\u660E\u786E @reviewer \u8BF7\u6C42\u68C0\u67E5\uFF0C\u5E76\u63CF\u8FF0\u6539\u52A8\u548C\u9A8C\u8BC1\u65B9\u6CD5\u3002", color: "#3b82f6" },
    { id: "reviewer", name: "Reviewer", role: "\u4F60\u662F\u5BA1\u67E5\u5458\u3002\u68C0\u67E5\u6B63\u786E\u6027\u3001\u8FB9\u754C\u6761\u4EF6\u548C\u53EF\u9A8C\u8BC1\u8BC1\u636E\uFF0C\u6309\u4E25\u91CD\u7A0B\u5EA6\u62A5\u544A\u95EE\u9898\u3002\u6CA1\u6709\u95EE\u9898\u5C31\u660E\u786E\u8BF4\u660E\u3002\u53EA\u5728\u786E\u9700\u8FD4\u5DE5\u65F6 @coder\u3002", color: "#16a34a" }
  ] };
}
function mentions(text, members) {
  const plain = text.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
  const hits = [...plain.matchAll(/(?:^|[\s(（,，:：])@([a-z][a-z0-9-]*)(?![a-z0-9-])/gi)].map((m) => m[1].toLowerCase());
  return members.filter((id) => hits.includes(id) || hits.includes("all"));
}
function handoffMentions(text, members) {
  const plain = text.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
  const hits = plain.split("\n").flatMap((line) => {
    const match = line.match(/^\s*(?:[-*]\s+|\d+[.)]\s+)?@([a-z][a-z0-9-]*)(?![a-z0-9-])[\s,:，：]*(请|麻烦|帮忙|需要你|继续|实现|检查|修复|验证|please\b|can you\b|could you\b|implement\b|review\b|check\b|fix\b|verify\b|take\b|continue\b|build\b|test\b|confirm\b|inspect\b)/i);
    return match ? [match[1].toLowerCase()] : [];
  });
  return members.filter((id) => hits.includes(id) || hits.includes("all"));
}
function transcript(room, count = 40) {
  return room.messages.filter((m) => m.kind !== "system").slice(-count).map((m) => `[${m.name} @${m.author}] ${m.text}${m.attachments?.map((a) => `
[\u9644\u4EF6 ${a.name}]
${a.text}`).join("") || ""}`).join("\n\n").slice(-8e4);
}
function markdown(room) {
  return `# ${room.title}

${room.cwd}

` + room.messages.map((m) => `## ${m.name} \xB7 ${new Date(m.at).toISOString()}

${m.text}${m.attachments?.map((a) => `

### ${a.name}

${a.text}`).join("") || ""}
`).join("\n");
}

// src/store.ts
var Store = class {
  constructor(dir) {
    this.dir = dir;
    this.lockPath = join(dir, "writer.lock");
  }
  state = initialState();
  queue = Promise.resolve();
  lockPath;
  owned = false;
  async load() {
    await mkdir(this.dir, { recursive: true, mode: 448 });
    try {
      const lock = await open(this.lockPath, "wx", 384);
      this.owned = true;
      await lock.writeFile(String(process.pid));
      await lock.close();
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      const pid = Number(await readFile(this.lockPath, "utf8"));
      let live = true;
      try {
        process.kill(pid, 0);
      } catch (e) {
        if (e.code === "ESRCH") live = false;
      }
      if (!Number.isSafeInteger(pid) || pid <= 0 || live) throw new Error("Agentroom data is already in use; choose another dataDir.");
      await unlink(this.lockPath);
      return this.load();
    }
    try {
      this.state = stateSchema.parse(JSON.parse(await readFile(join(this.dir, "state.json"), "utf8")));
    } catch (error) {
      if (error.code !== "ENOENT") {
        await this.close();
        throw new Error("Cannot read Agentroom state; preserve the file and restore a backup.", { cause: error });
      }
    }
    return this;
  }
  save() {
    const snapshot = JSON.stringify(this.state);
    const next = this.queue.then(async () => {
      const tmp = join(this.dir, "state.json.tmp");
      await writeFile(tmp, snapshot, { mode: 384 });
      await rename(tmp, join(this.dir, "state.json"));
    });
    this.queue = next.catch(() => {
    });
    return next;
  }
  async close() {
    await this.queue;
    if (this.owned) {
      this.owned = false;
      await unlink(this.lockPath);
    }
  }
};

// src/runtime.ts
import { randomUUID } from "node:crypto";
import { stat } from "node:fs/promises";
import { isAbsolute } from "node:path";
import { z as z2 } from "zod";

// src/cli.ts
import { spawn } from "node:child_process";
var backendOf = (member) => member.backend || "dsh";
function cliRunner(paths = {}, timeoutMs = 3e5) {
  return (request) => new Promise((resolve, reject) => {
    if (request.signal.aborted) {
      reject(new Error("CLI stopped"));
      return;
    }
    const { backend, session, model } = request;
    const args = backend === "codex" ? ["exec", ...session ? ["resume", session] : [], "--json", "--skip-git-repo-check", "-c", 'sandbox_mode="read-only"', "-c", 'approval_policy="never"', "-c", "model_providers.openai.supports_websockets=false", ...model ? ["--model", model] : [], "-"] : ["-p", "--output-format", "stream-json", "--verbose", "--tools", "", "--strict-mcp-config", "--permission-mode", "dontAsk", ...session ? ["--resume", session] : [], ...model ? ["--model", model] : []];
    const child = spawn(paths[backend] || backend, args, { cwd: request.cwd, shell: false, detached: process.platform !== "win32", stdio: ["pipe", "pipe", "pipe"] });
    let buffer = "", stderr = "", text = "", failure = "", completed = false, bytes = 0;
    let killTimer;
    const kill = (signal) => {
      try {
        if (child.pid && process.platform !== "win32") process.kill(-child.pid, signal);
        else child.kill(signal);
      } catch {
      }
    };
    const stop = () => {
      kill("SIGTERM");
      killTimer ||= setTimeout(() => kill("SIGKILL"), 1500);
    };
    const timeout = setTimeout(() => {
      failure = "CLI timed out after 5 minutes";
      stop();
    }, timeoutMs);
    request.signal.addEventListener("abort", stop, { once: true });
    const clean = () => {
      clearTimeout(timeout);
      if (killTimer) clearTimeout(killTimer);
      request.signal.removeEventListener("abort", stop);
    };
    const consume = (line) => {
      if (!line.trim()) return;
      let event;
      try {
        event = JSON.parse(line);
      } catch {
        return;
      }
      if (backend === "codex") {
        if (event.type === "thread.started" && typeof event.thread_id === "string") request.onSession(event.thread_id);
        if (event.type === "item.completed" && event.item?.type === "agent_message") {
          text = event.item.text;
          request.onText(text);
        }
        if (event.type === "turn.completed") {
          completed = true;
          failure = "";
        }
        if (event.type === "turn.failed" || event.type === "error") failure = event.error?.message || event.message || "Codex request failed";
      } else {
        if (event.type === "system" && event.subtype === "init" && typeof event.session_id === "string") request.onSession(event.session_id);
        if (event.type === "assistant" && !event.is_api_error_message) {
          text = (event.message?.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
          request.onText(text);
        }
        if (event.type === "result") {
          if (event.is_error) failure = event.result || event.errors?.join("; ") || "Claude request failed";
          else {
            completed = true;
            if (typeof event.result === "string") text = event.result;
          }
        }
      }
    };
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      bytes += Buffer.byteLength(chunk);
      if (bytes > 8 * 1024 * 1024) {
        failure = "CLI output exceeded 8 MB";
        stop();
        return;
      }
      buffer += chunk;
      let end;
      while ((end = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, end);
        buffer = buffer.slice(end + 1);
        consume(line);
      }
    });
    child.stderr.on("data", (chunk) => {
      stderr = (stderr + chunk).slice(-3e3);
    });
    child.stdin.on("error", () => {
    });
    child.once("error", (error) => {
      clean();
      reject(new Error(`${backend}: ${error.message}. Install and log in to this CLI first.`));
    });
    child.once("close", (code) => {
      clean();
      consume(buffer);
      if (request.signal.aborted) reject(new Error("CLI stopped"));
      else if (failure || code !== 0 || !completed || !text.trim()) reject(new Error(failure || `${backend} exited (${code}): ${stderr || "No completed response"}`));
      else resolve(text);
    });
    child.stdin.end(request.prompt);
  });
}

// src/runtime.ts
var RoomError = class extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
};
var textOf = (data) => (data?.message?.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
var roomInput = z2.object({ title: z2.string().trim().min(1).max(80), cwd: z2.string().min(1), members: z2.array(z2.string()).min(1).max(8), collaboration: z2.boolean().default(true) });
var Runtime = class {
  constructor(host, store, maxHandoffs = 4, runCli = cliRunner()) {
    this.host = host;
    this.store = store;
    this.maxHandoffs = maxHandoffs;
    this.runCli = runCli;
  }
  drafts = /* @__PURE__ */ new Map();
  closing = false;
  disposers = [];
  lifetime = new AbortController();
  mutations = Promise.resolve();
  jobs = /* @__PURE__ */ new Set();
  cliJobs = /* @__PURE__ */ new Map();
  async start() {
    await this.store.load();
    for (const room of this.store.state.rooms) for (const run of room.runs.filter(active)) {
      try {
        if (run.backend && run.backend !== "dsh") throw new Error("CLI turn interrupted");
        const inspection = await this.host.readSession(run.sessionId);
        const events = inspection.events;
        for (const event of events) if (event.seq > run.lastSeq) this.observe(room, run, event, false);
      } catch {
      }
      if (active(run)) {
        run.status = "interrupted";
        run.endedAt = Date.now();
        run.detail = "Host restarted; inspect the session before retrying.";
      }
    }
    await this.store.save();
    this.disposers.push(this.host.on("session/event", (session, event) => {
      const found = this.findRun(session.id);
      if (found) {
        this.observe(found.room, found.run, event, true);
        this.persist();
      }
    }));
    this.disposers.push(this.host.on("agent/assistant-stream", ({ agent, frame }) => {
      const found = this.findRun(agent.id);
      if (!found) return;
      if (frame.type === "start") this.drafts.delete(found.run.id);
      if (frame.type === "chunk" && frame.chunk?.type === "text-delta") this.drafts.set(found.run.id, (this.drafts.get(found.run.id) || "") + frame.chunk.text);
      if (frame.type === "end") this.drafts.delete(found.run.id);
    }));
    this.disposers.push(this.host.on("api-session/error", (id, message) => {
      const found = this.findRun(id);
      if (found) this.fail(found.run, message);
    }));
    return this;
  }
  persist() {
    this.store.save().catch((e) => this.host.logger.error("Agentroom save failed: %s", String(e)));
  }
  findRun(sessionId) {
    for (const room of this.store.state.rooms) {
      const run = room.runs.findLast((r) => r.sessionId === sessionId && active(r));
      if (run) return { room, run };
    }
  }
  fail(run, message) {
    run.status = "error";
    run.detail = message;
    run.endedAt = Date.now();
    this.drafts.delete(run.id);
    this.persist();
  }
  observe(room, run, event, handoff) {
    if (event.seq <= run.lastSeq) return;
    run.lastSeq = event.seq;
    if (event.type === "assistant/message") {
      this.drafts.delete(run.id);
      const text = textOf(event.data);
      if (text) {
        const member = this.store.state.agents.find((a) => a.id === run.memberId);
        const id = `${run.sessionId}:${event.seq}`;
        if (!room.messages.some((m) => m.id === id)) room.messages.push({ id, kind: "agent", author: member.id, name: member.name, color: member.color, text, at: event.time || Date.now(), runId: run.id, sessionId: run.sessionId });
      }
    }
    if (event.type === "tool/call") {
      run.tools.push(event.data.name);
      if (run.tools.length > 100) run.tools.shift();
    }
    if (event.type === "turn/end") {
      const reason = event.data.reason;
      run.status = reason.kind === "completed" ? "completed" : reason.kind === "aborted" ? "stopped" : reason.kind === "interrupted" ? "interrupted" : "error";
      run.endedAt = Date.now();
      this.drafts.delete(run.id);
      if (run.status === "error") run.detail = reason.error?.message || reason.kind;
      if (handoff && run.status === "completed" && room.collaboration && !room.archived && !this.closing) {
        const last = room.messages.findLast((m) => m.runId === run.id && m.kind === "agent");
        const targets = last ? handoffMentions(last.text, room.members).filter((id) => id !== run.memberId) : [];
        if (targets.length) this.track(this.handoff(room, run, targets));
      }
    }
    room.updatedAt = Date.now();
  }
  track(job) {
    this.jobs.add(job);
    job.catch((e) => this.host.logger.error(String(e))).finally(() => this.jobs.delete(job));
  }
  note(room, text) {
    room.messages.push({ id: randomUUID(), author: "system", name: "Agentroom", color: "#9ca3af", kind: "system", text, at: Date.now() });
  }
  async handoff(room, from, targets) {
    const runs = [];
    for (const target of targets) {
      if ((room.budgets[from.rootId] || 0) <= 0) {
        this.note(room, "\u81EA\u52A8\u63A5\u529B\u5DF2\u8FBE\u5230\u4E0A\u9650\u3002\u53EF\u7531\u4F60\u518D\u6B21 @Agent \u7EE7\u7EED\u3002");
        break;
      }
      if (room.runs.some((r) => r.memberId === target && active(r))) {
        this.note(room, `@${target} \u6B63\u5FD9\uFF0C\u672C\u6B21\u63A5\u529B\u672A\u542F\u52A8\uFF1B\u5B8C\u6210\u540E\u53EF\u518D\u6B21\u63D0\u53CA\u3002`);
        continue;
      }
      room.budgets[from.rootId]--;
      runs.push(this.reserve(room, target, from.rootId));
    }
    await this.store.save();
    await Promise.all(runs.map((run) => this.launch(room, run)));
  }
  snapshot(roomId) {
    return {
      agents: this.store.state.agents,
      rooms: this.store.state.rooms.map(({ messages, runs, sessions, budgets, ...r }) => ({ ...r, messageCount: messages.length, running: runs.filter(active).length })),
      room: roomId ? this.room(roomId) : void 0,
      drafts: Object.fromEntries(this.drafts),
      maxHandoffs: this.maxHandoffs
    };
  }
  room(id) {
    const room = this.store.state.rooms.find((r) => r.id === id);
    if (!room) throw new RoomError(404, "\u4F1A\u8BDD\u4E0D\u5B58\u5728 / Room not found");
    return room;
  }
  writable(room) {
    if (room.archived) throw new RoomError(409, "\u8BF7\u5148\u6062\u590D\u6B64\u5F52\u6863\u4F1A\u8BDD / Restore this room first");
  }
  idle(room) {
    if (room.runs.some(active)) throw new RoomError(409, "\u8BF7\u5148\u505C\u6B62\u6216\u7B49\u5F85\u6B63\u5728\u8FD0\u884C\u7684\u6210\u5458 / Stop or wait for active members");
  }
  /** Serialize user mutations; model execution itself remains concurrent. */
  mutate(fn) {
    const result = this.mutations.then(() => {
      if (this.closing) throw new RoomError(503, "Host is stopping");
      return fn();
    });
    this.mutations = result.then(() => {
    }, () => {
    });
    return result;
  }
  async create(input) {
    const data = roomInput.parse(input);
    if (!isAbsolute(data.cwd) || !(await stat(data.cwd)).isDirectory()) throw new RoomError(400, "\u5DE5\u4F5C\u76EE\u5F55\u5FC5\u987B\u662F\u5DF2\u5B58\u5728\u7684\u7EDD\u5BF9\u8DEF\u5F84 / Choose an existing absolute directory");
    if (new Set(data.members).size !== data.members.length || data.members.some((id) => !this.store.state.agents.some((a) => a.id === id))) throw new RoomError(400, "Unknown or duplicate member");
    if (this.store.state.rooms.length >= 1e3) throw new RoomError(400, "Room limit reached");
    const now = Date.now();
    const room = { ...data, id: randomUUID(), archived: false, createdAt: now, updatedAt: now, messages: [], runs: [], sessions: {}, budgets: {} };
    this.store.state.rooms.unshift(room);
    await this.store.save();
    return room;
  }
  async edit(id, input) {
    const room = this.room(id);
    this.idle(room);
    const patch = z2.object({ title: z2.string().trim().min(1).max(80).optional(), archived: z2.boolean().optional(), members: z2.array(z2.string()).min(1).max(8).optional(), collaboration: z2.boolean().optional() }).parse(input);
    if (patch.archived === false && (!isAbsolute(room.cwd) || !(await stat(room.cwd)).isDirectory())) throw new RoomError(400, "\u5BFC\u5165\u4F1A\u8BDD\u7684\u5DE5\u4F5C\u76EE\u5F55\u4E0D\u5B58\u5728 / Imported working directory does not exist");
    if (patch.members && (new Set(patch.members).size !== patch.members.length || patch.members.some((id2) => !this.store.state.agents.some((a) => a.id === id2)))) throw new RoomError(400, "Unknown or duplicate member");
    Object.assign(room, patch, { updatedAt: Date.now() });
    await this.store.save();
    return room;
  }
  async saveAgent(input) {
    const agent = agentSchema.parse(input);
    if (this.store.state.rooms.some((r) => r.runs.some((run) => run.memberId === agent.id && active(run)))) throw new RoomError(409, "\u8BE5\u6210\u5458\u6B63\u5728\u8FD0\u884C\uFF0C\u5B8C\u6210\u540E\u53EF\u7F16\u8F91 / Member is busy");
    const index = this.store.state.agents.findIndex((a) => a.id === agent.id);
    if (index >= 0) this.store.state.agents[index] = agent;
    else {
      if (this.store.state.agents.length >= 32) throw new RoomError(400, "Member limit reached");
      this.store.state.agents.push(agent);
    }
    await this.store.save();
    return agent;
  }
  reserve(room, memberId, rootId) {
    const backend = backendOf(this.store.state.agents.find((a) => a.id === memberId));
    const key = backend === "dsh" ? memberId : `${backend}:${memberId}`;
    const sessionId = room.sessions[key] || randomUUID();
    if (backend === "dsh") room.sessions[key] = sessionId;
    const run = { id: randomUUID(), memberId, backend, sessionId, rootId, lastSeq: -1, status: "preparing", at: Date.now(), tools: [] };
    room.runs.push(run);
    return run;
  }
  async send(id, input) {
    const room = this.room(id);
    this.writable(room);
    const data = z2.object({ id: z2.string().uuid(), text: z2.string().trim().min(1).max(1e5), attachments: z2.array(attachmentSchema).max(4).default([]) }).parse(input);
    if (room.messages.some((m) => m.id === data.id)) return { accepted: true, duplicate: true };
    const targets = mentions(data.text, room.members);
    if (targets.some((target) => room.runs.some((r) => r.memberId === target && active(r)))) throw new RoomError(409, "\u63D0\u53CA\u7684\u6210\u5458\u6B63\u5728\u8FD0\u884C\uFF0C\u53EF\u5148\u505C\u6B62\u6216\u7B49\u5F85 / A mentioned member is busy");
    room.messages.push({ ...data, author: "you", name: "You", color: "#64748b", kind: "human", at: Date.now() });
    room.updatedAt = Date.now();
    room.budgets[data.id] = this.maxHandoffs;
    const runs = targets.map((target) => this.reserve(room, target, data.id));
    await this.store.save();
    for (const run of runs) this.track(this.launch(room, run));
    return { accepted: true, targets };
  }
  async launch(room, run) {
    try {
      const member = this.store.state.agents.find((a) => a.id === run.memberId);
      if (run.backend && run.backend !== "dsh") {
        await this.launchCli(room, run, member);
        return;
      }
      const existing = await this.host.sessionController.resolveAgent(run.sessionId);
      let created;
      if ("error" in existing) {
        if (existing.error.code !== "session/not-found") throw existing.error;
        created = await this.host.sessionController.create({ sessionId: run.sessionId, cwd: room.cwd, agentPreset: "standard" });
      } else created = { sessionId: run.sessionId };
      if (!active(run) || this.closing) return;
      run.sessionId = created.sessionId;
      room.sessions[member.id] = created.sessionId;
      const inspection = await this.host.readSession(run.sessionId);
      run.lastSeq = inspection.events.at(-1)?.seq ?? -1;
      await this.host.sessionController.rename({ sessionId: run.sessionId, title: `${room.title} \xB7 ${member.name}` });
      await this.host.configureModel(run.sessionId, member.model);
      if (!active(run) || this.closing) return;
      run.status = "running";
      await this.store.save();
      if (!active(run) || this.closing) return;
      const prompt = `\u4F60\u5728 DSH Agentroom \u7684\u5171\u4EAB\u4F1A\u8BDD\u300C${room.title}\u300D\u4E2D\u3002\u4F60\u7684\u8EAB\u4EFD\u662F ${member.name} (@${member.id})\u3002
\u89D2\u8272\uFF1A${member.role}
\u5DE5\u4F5C\u76EE\u5F55\uFF1A${room.cwd}
\u6210\u5458\uFF1A${room.members.map((id) => "@" + id).join(", ")}\u3002
\u53EA\u5B8C\u6210\u5F53\u524D\u4EA4\u7ED9\u4F60\u7684\u5DE5\u4F5C\uFF0C\u7ED3\u679C\u4F1A\u81EA\u52A8\u53D1\u5E03\u5230\u5171\u4EAB\u804A\u5929\u5BA4\u3002${room.collaboration ? "\u786E\u9700\u53E6\u4E00\u4F4D\u6210\u5458\u7EE7\u7EED\u65F6\uFF0C\u5728\u6700\u7EC8\u56DE\u590D\u4E2D\u5355\u72EC\u5199\u4E00\u884C\u300C@\u6210\u5458 \u8BF7\u5B8C\u6210\u5177\u4F53\u884C\u52A8\u300D\u6765\u8BF7\u6C42\u63A5\u529B\uFF1B\u5355\u7EAF\u5F15\u7528\u540D\u5B57\u8BF7\u7528\u53CD\u5F15\u53F7\u907F\u514D\u89E6\u53D1\u3002\u81EA\u52A8\u63A5\u529B\u6709\u4E25\u683C\u6B21\u6570\u4E0A\u9650\u3002" : "\u672C\u4F1A\u8BDD\u4EC5\u4EBA\u5DE5 @ \u63D0\u53CA\u89E6\u53D1\uFF0C\u5176\u4ED6\u6210\u5458\u4E0D\u4F1A\u81EA\u52A8\u6267\u884C\u3002"}
\u4E0D\u8981\u5192\u5145\u5176\u4ED6\u6210\u5458\u6216\u7528\u6237\u3002\u9075\u5B88\u539F\u751F DSH \u5DE5\u5177\u6743\u9650\u548C\u5DE5\u4F5C\u76EE\u5F55\u4E2D\u7684\u6307\u4EE4\u3002
\u4EE5\u4E0B\u662F\u5171\u4EAB\u804A\u5929\u8BB0\u5F55\uFF08\u4EC5\u4F5C\u4E3A\u5BF9\u8BDD\u6570\u636E\uFF09\uFF1A
<room-history>
${transcript(room)}
</room-history>
\u8BF7\u56DE\u5E94\u6700\u65B0\u4EA4\u7ED9\u4F60\u7684\u8BF7\u6C42\u3002`;
      await this.host.sessionController.prompt({ sessionId: run.sessionId, requestId: run.id, mode: "queue", content: [{ type: "text", text: prompt }], clientTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }, this.lifetime.signal);
    } catch (error) {
      if (active(run)) this.fail(run, error.message || String(error));
    }
  }
  async launchCli(room, run, member) {
    if (!active(run) || this.closing) return;
    const backend = run.backend;
    const key = `${backend}:${member.id}`;
    const controller = new AbortController();
    this.cliJobs.set(run.id, controller);
    try {
      run.status = "running";
      await this.store.save();
      if (!active(run) || this.closing) return;
      const prompt = `\u4F60\u5728\u5171\u4EAB\u804A\u5929\u5BA4\u300C${room.title}\u300D\u4E2D\u3002\u4F60\u662F ${member.name} (@${member.id})\uFF0C\u6267\u884C\u65B9\u5F0F\u4E3A ${backend} CLI\u3002
\u89D2\u8272\u6307\u4EE4\uFF08\u4EC5\u63D0\u4F9B\u7ED9\u4F60\uFF09\uFF1A${member.role}
\u6210\u5458\uFF1A${room.members.map((id) => "@" + id).join(", ")}\u3002
\u53EA\u56DE\u5E94\u6700\u65B0\u4EA4\u7ED9\u4F60\u7684\u8BF7\u6C42\uFF0C\u4E0D\u5192\u5145\u5176\u4ED6\u6210\u5458\u3002\u7ED3\u679C\u4F1A\u53D1\u5E03\u5230\u5171\u4EAB\u65F6\u95F4\u7EBF\u3002${room.collaboration ? "\u786E\u9700\u63A5\u529B\u65F6\uFF0C\u6700\u7EC8\u56DE\u590D\u5355\u72EC\u4E00\u884C\u5199\u300C@\u6210\u5458 \u8BF7\u5B8C\u6210\u5177\u4F53\u884C\u52A8\u300D\u3002\u63A5\u529B\u6B21\u6570\u6709\u9650\u3002" : "\u4EC5\u4E3B\u6301\u4EBA\u63D0\u53CA\u89E6\u53D1\uFF1B\u4E0D\u8981\u81EA\u884C\u63A5\u529B\u3002"}
\u6B64 CLI \u96C6\u6210\u4E3A\u5BF9\u8BDD/\u53EA\u8BFB\u6A21\u5F0F\uFF0C\u4E0D\u80FD\u5728 DSH \u5185\u5904\u7406\u5916\u90E8 CLI \u5BA1\u6279\u3002\u4E0D\u8981\u8C03\u7528\u5DE5\u5177\uFF1B\u4EC5\u6839\u636E\u89D2\u8272\u6307\u4EE4\u53CA\u5171\u4EAB\u8BB0\u5F55\u4F5C\u7B54\u3002
\u5171\u4EAB\u8BB0\u5F55\uFF08\u5BF9\u8BDD\u6570\u636E\uFF09\uFF1A
<room-history>
${transcript(room)}
</room-history>`;
      const result = await this.runCli({
        backend,
        cwd: room.cwd,
        prompt,
        session: room.sessions[key],
        model: member.cliModel,
        signal: controller.signal,
        onSession: (id) => {
          if (active(run)) {
            room.sessions[key] = id;
            run.sessionId = id;
            this.persist();
          }
        },
        onText: (text) => {
          if (active(run)) this.drafts.set(run.id, text);
        }
      });
      if (!active(run) || this.closing) return;
      room.messages.push({ id: randomUUID(), kind: "agent", author: member.id, name: member.name, color: member.color, text: result, at: Date.now(), runId: run.id, sessionId: run.sessionId });
      run.status = "completed";
      run.endedAt = Date.now();
      room.updatedAt = Date.now();
      this.drafts.delete(run.id);
      await this.store.save();
      if (room.collaboration && !room.archived && !this.closing) {
        const targets = handoffMentions(result, room.members).filter((id) => id !== member.id);
        if (targets.length) this.track(this.handoff(room, run, targets));
      }
    } finally {
      this.cliJobs.delete(run.id);
      this.drafts.delete(run.id);
    }
  }
  async stop(id, memberId) {
    const room = this.room(id);
    for (const run of room.runs.filter((r) => active(r) && (!memberId || r.memberId === memberId))) {
      run.status = "stopped";
      run.endedAt = Date.now();
      this.drafts.delete(run.id);
      if (run.backend && run.backend !== "dsh") this.cliJobs.get(run.id)?.abort();
      else this.host.sessionController.cancel({ sessionId: run.sessionId });
    }
    await this.store.save();
    return { stopped: true };
  }
  async importRoom(input) {
    const archive = z2.object({ format: z2.literal("dsh-agentroom/1"), agents: z2.array(agentSchema).min(1).max(32), room: roomSchema }).parse(input);
    const ids = new Set(archive.agents.map((a) => a.id));
    if (archive.room.members.some((id) => !ids.has(id))) throw new RoomError(400, "Import is missing members");
    const room = { ...archive.room, id: randomUUID(), archived: true, sessions: {}, runs: [], budgets: {}, messages: archive.room.messages.map((m) => ({ ...m, id: randomUUID(), runId: void 0, sessionId: void 0 })) };
    if (this.store.state.rooms.length >= 1e3) throw new RoomError(400, "Room limit reached");
    const missing = archive.agents.filter((a) => !this.store.state.agents.some((existing) => existing.id === a.id));
    if (this.store.state.agents.length + missing.length > 32 || ids.size !== archive.agents.length) throw new RoomError(400, "Too many or duplicate imported members");
    this.store.state.agents.push(...missing);
    this.store.state.rooms.unshift(room);
    await this.store.save();
    return room;
  }
  async close() {
    this.closing = true;
    this.lifetime.abort();
    this.disposers.splice(0).forEach((fn) => fn());
    for (const room of this.store.state.rooms) await this.stop(room.id);
    await Promise.allSettled(this.jobs);
    await this.store.close();
  }
};

// src/http.ts
import { z as z3 } from "zod";
var json = (res, status, value) => {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" });
  res.end(JSON.stringify(value));
};
async function body(req) {
  if (!req.headers["content-type"]?.startsWith("application/json")) throw new RoomError(415, "Expected application/json");
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 8 * 1024 * 1024) throw new RoomError(413, "Request too large");
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new RoomError(400, "Invalid JSON");
  }
}
function handler(ctx, runtime) {
  return async (req, res) => {
    const rejection = ctx.connection.requestRejection(req);
    if (rejection !== void 0) {
      json(res, rejection, { error: "DSH authentication required" });
      return;
    }
    if (req.headers["x-agentroom-request"] !== "1") {
      json(res, 403, { error: "Agentroom request header required" });
      return;
    }
    try {
      const url = new URL(req.url || "/", "http://localhost");
      const path = url.pathname.slice("/agentroom/api/".length).split("/").map(decodeURIComponent);
      const method = req.method;
      if (method === "GET" && path[0] === "state") {
        json(res, 200, runtime.snapshot(url.searchParams.get("room") || void 0));
        return;
      }
      if (method === "GET" && path[0] === "models") {
        json(res, 200, await runtime.host.sessionController.modelCatalog());
        return;
      }
      if (method === "GET" && path[0] === "export" && path[1]) {
        const room = runtime.room(path[1]);
        json(res, 200, url.searchParams.get("format") === "md" ? { text: markdown(room) } : { format: "dsh-agentroom/1", agents: runtime.store.state.agents.filter((a) => room.members.includes(a.id)), room });
        return;
      }
      if (method !== "POST") throw new RoomError(405, "Method not allowed");
      const input = await body(req);
      const value = await runtime.mutate(async () => {
        if (path[0] === "rooms" && !path[1]) return runtime.create(input);
        if (path[0] === "agents") return runtime.saveAgent(input);
        if (path[0] === "import") return runtime.importRoom(input);
        if (path[0] === "rooms" && path[1]) {
          if (path[2] === "edit") return runtime.edit(path[1], input);
          if (path[2] === "send") return runtime.send(path[1], input);
          if (path[2] === "stop") return runtime.stop(path[1], z3.object({ memberId: z3.string().optional() }).parse(input).memberId);
        }
        throw new RoomError(404, "Unknown Agentroom operation");
      });
      json(res, 200, value);
    } catch (error) {
      json(res, error instanceof RoomError ? error.status : error instanceof z3.ZodError || error.code === "ENOENT" ? 400 : 500, { error: error instanceof z3.ZodError ? error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") : error.message || String(error) });
    }
  };
}

// src/models.ts
function modelSelector(ctx) {
  const bindings = /* @__PURE__ */ new Map();
  const forget = ctx.on("agent/disposed", ({ agent }) => {
    bindings.get(agent)?.dispose();
    bindings.delete(agent);
  });
  ctx.effect(() => () => {
    forget();
    for (const value of bindings.values()) value.dispose();
    bindings.clear();
  });
  return async (sessionId, model) => {
    const result = await ctx.sessionController.resolveAgent(sessionId);
    if ("error" in result) throw result.error;
    const agent = result.agent;
    const configured = model || ctx.agentDefaultModel.currentSelection();
    const resolved = await ctx.llm.resolveCallConfig(configured);
    const selected = { provider: resolved.provider, model: resolved.model, ...resolved.reasoningEffort ? { reasoningEffort: resolved.reasoningEffort } : {} };
    if (typeof agent.model?.select === "function") {
      agent.model.select(selected);
      return;
    }
    let binding = bindings.get(agent);
    if (!binding) {
      const value = { selected, assembled: void 0, dispose: () => {
      } };
      const a = agent.ctx.on("system-prompt/assemble", async (_assembly, _context, next) => {
        const snapshot = value.selected;
        const result2 = await next();
        value.assembled = snapshot;
        return { ...result2, variables: { ...result2.variables, provider: snapshot.provider, model: snapshot.model } };
      }, { prepend: true });
      const b = agent.ctx.on("agent/request", async (_payload, next) => {
        const result2 = await next();
        const { reasoningEffort: _old, ...rest } = result2;
        return { ...rest, ...value.assembled };
      }, { prepend: true });
      value.dispose = () => {
        a();
        b();
      };
      binding = value;
      bindings.set(agent, value);
    }
    binding.selected = selected;
    agent.session.append("model/selection", selected);
  };
}

// src/index.ts
var name = "dsh-agentroom";
var inject = ["webServer", "connection", "sessionController", "sessionQuery", "llm", "agentDefaultModel"];
var Config = schema.object({
  dataDir: schema.string().description("Absolute data directory; one running host per directory.").default(join2(process.env.DSH_HOME?.trim() || join2(homedir(), ".dsh"), "dsh-agentroom")),
  maxHandoffs: schema.number().step(1).min(0).max(16).default(4).description("Maximum automatic member handoffs per human message."),
  codexPath: schema.string().default("codex").description("Codex executable name or absolute path. No shell arguments."),
  claudePath: schema.string().default("claude").description("Claude Code executable name or absolute path. No shell arguments.")
});
async function apply(ctx, config) {
  if (!isAbsolute2(config.dataDir)) throw new Error("Agentroom dataDir must be an absolute path");
  const runtime = new Runtime({ sessionController: ctx.sessionController, readSession: (id) => ctx.sessionQuery.readSession(id), on: ctx.on.bind(ctx), logger: ctx.logger, configureModel: modelSelector(ctx) }, new Store(config.dataDir), config.maxHandoffs, cliRunner({ codex: config.codexPath, claude: config.claudePath }));
  try {
    await runtime.start();
  } catch (error) {
    await runtime.store.close();
    throw error;
  }
  ctx.effect(() => () => runtime.close());
  ctx.effect(() => ctx.webServer.register({ kind: "prefix", path: "/agentroom/api", handler: handler(ctx, runtime) }));
  ctx.logger.info("Agentroom ready. Open Agentroom from the DSH sidebar.");
}
export {
  Config,
  apply,
  inject,
  name
};
//# sourceMappingURL=index.mjs.map
