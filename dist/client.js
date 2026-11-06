window.__ModuleLoader__.load({id:"dsh-agentroom",factory(require){var module={exports:{}};var exports=module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.tsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// src/client/app.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var active = (run) => run.status === "preparing" || run.status === "running";
var words = {
  zh: { tagline: "\u4EBA\u4E0E Agent\uFF0C\u5728\u4E00\u4E2A\u623F\u95F4\u91CC\u534F\u4F5C", sessions: "\u4F1A\u8BDD", new: "\u65B0\u5EFA\u4F1A\u8BDD", agents: "\u56E2\u961F\u6210\u5458", addAgent: "\u6DFB\u52A0\u6210\u5458", search: "\u641C\u7D22\u4F1A\u8BDD\u2026", online: "\u5DF2\u8FDE\u63A5 DSH", connecting: "\u6B63\u5728\u8FDE\u63A5\u2026", archived: "\u5DF2\u5F52\u6863", showArchive: "\u663E\u793A\u5F52\u6863", hideArchive: "\u9690\u85CF\u5F52\u6863", empty: "\u7ED9\u4F60\u7684 Agent \u56E2\u961F\u4E00\u4E2A\u623F\u95F4", intro: "\u5728\u540C\u4E00\u6761\u65F6\u95F4\u7EBF\u91CC\u5206\u914D\u4EFB\u52A1\u3001\u8BA8\u8BBA\u65B9\u6848\u3001\u4EA4\u4ED8\u7ED3\u679C\u3002", start: "\u521B\u5EFA\u7B2C\u4E00\u4E2A\u4F1A\u8BDD", emptyRoom: "\u4ECE\u4E00\u6B21\u63D0\u53CA\u5F00\u59CB\u534F\u4F5C", roomIntro: "\u4F8B\u5982 @planner \u5148\u5206\u6790\u4EFB\u52A1\uFF0C\u6216 @all \u8BF7\u5404\u81EA\u7ED9\u51FA\u5EFA\u8BAE\u3002", manage: "\u7BA1\u7406\u4F1A\u8BDD", send: "\u53D1\u9001\u6D88\u606F", placeholder: "\u5199\u4E0B\u6D88\u606F\uFF0C@ \u63D0\u53CA\u6210\u5458\u6765\u5206\u914D\u4EFB\u52A1\u2026", hint: "Enter \u53D1\u9001 \xB7 Shift + Enter \u6362\u884C", mentionHint: "\u4EC5 @ \u63D0\u53CA\u89E6\u53D1 \xB7 @all \u901A\u77E5\u6240\u6709\u6210\u5458", archive: "\u5F52\u6863\u4F1A\u8BDD", restore: "\u6062\u590D\u4F1A\u8BDD", exportMd: "\u5BFC\u51FA Markdown", exportJson: "\u5BFC\u51FA JSON", import: "\u5BFC\u5165\u4F1A\u8BDD", stop: "\u505C\u6B62\u5168\u90E8", stopMember: "\u505C\u6B62\u6210\u5458", native: "\u67E5\u770B\u539F\u751F\u4F1A\u8BDD", execution: "\u6267\u884C\u8BB0\u5F55", running: "\u6267\u884C\u4E2D", preparing: "\u51C6\u5907\u4E2D", completed: "\u5DF2\u5B8C\u6210", stopped: "\u5DF2\u505C\u6B62", error: "\u5931\u8D25", interrupted: "\u5DF2\u4E2D\u65AD", title: "\u4F1A\u8BDD\u540D\u79F0", cwd: "\u5DE5\u4F5C\u76EE\u5F55\uFF08\u7EDD\u5BF9\u8DEF\u5F84\uFF09", members: "\u53C2\u4E0E\u6210\u5458", collab: "\u5141\u8BB8 Agent \u901A\u8FC7 @ \u63D0\u53CA\u63A5\u529B", collabHelp: "\u6BCF\u6761\u4EBA\u5DE5\u6D88\u606F\u6700\u591A\u81EA\u52A8\u63A5\u529B {n} \u6B21\u3002\u53EF\u968F\u65F6\u505C\u6B62\u3002", create: "\u521B\u5EFA\u4F1A\u8BDD", save: "\u4FDD\u5B58", cancel: "\u53D6\u6D88", agentTitle: "\u6210\u5458\u8BBE\u7F6E", agentId: "\u63D0\u53CA ID", agentName: "\u663E\u793A\u540D\u79F0", role: "\u89D2\u8272\u6307\u4EE4", model: "\u6A21\u578B", hostModel: "\u4F7F\u7528 DSH \u9ED8\u8BA4\u6A21\u578B", color: "\u5934\u50CF\u989C\u8272", files: "\u6DFB\u52A0\u6587\u672C\u9644\u4EF6", remove: "\u79FB\u9664", attachment: "\u9644\u4EF6", readOnly: "\u6B64\u4F1A\u8BDD\u5DF2\u5F52\u6863\uFF0C\u6062\u590D\u540E\u53EF\u7EE7\u7EED\u3002", menu: "\u4F1A\u8BDD\u64CD\u4F5C", rename: "\u7BA1\u7406", loading: "\u52A0\u8F7D\u4E2D\u2026", noResults: "\u6CA1\u6709\u5339\u914D\u7684\u4F1A\u8BDD", team: "\u56E2\u961F", you: "\u4F60", system: "\u7CFB\u7EDF", modelError: "\u6A21\u578B\u76EE\u5F55\u4E0D\u53EF\u7528", noMessages: "\u6682\u65E0\u6D88\u606F", failed: "\u64CD\u4F5C\u5931\u8D25", textFiles: "\u652F\u6301\u6587\u672C\u3001Markdown\u3001JSON\u3001\u4EE3\u7801\uFF1B\u6700\u591A 4 \u4E2A\uFF0C\u6BCF\u4E2A 100 KB\u3002", working: "\u6B63\u5728\u601D\u8003\u4E0E\u6267\u884C", jump: "\u56DE\u5230\u6700\u65B0\u6D88\u606F", settings: "\u5207\u6362\u4E3B\u9898", language: "Switch to English", back: "\u4F1A\u8BDD\u5217\u8868", overview: "\u5171\u4EAB\u804A\u5929\u8BB0\u5F55 \xB7 DSH \u539F\u751F\u6267\u884C", humanOnly: "\u4EC5\u4EBA\u5DE5\u89E6\u53D1", auto: "\u81EA\u52A8\u63A5\u529B\u5DF2\u5F00\u542F", chooseDir: "/\u7EDD\u5BF9\u8DEF\u5F84/\u4F60\u7684\u9879\u76EE", nativeDescription: "\u5DE5\u5177\u6267\u884C\u4E0E\u5BA1\u6279\u5728 DSH \u539F\u751F\u4F1A\u8BDD\u4E2D\u67E5\u770B", importNotice: "\u5DF2\u5BFC\u5165\u4E3A\u5F52\u6863\u4F1A\u8BDD\uFF0C\u6062\u590D\u540E\u53EF\u7EE7\u7EED\u3002" },
  en: { tagline: "People and agents, working together", sessions: "Sessions", new: "New session", agents: "Team members", addAgent: "Add member", search: "Search sessions\u2026", online: "Connected to DSH", connecting: "Connecting\u2026", archived: "Archived", showArchive: "Show archived", hideArchive: "Hide archived", empty: "A room for your agent team", intro: "Assign tasks, discuss ideas, and deliver work in one shared timeline.", start: "Create your first session", emptyRoom: "Start with a mention", roomIntro: "Try @planner to break down a task, or @all to hear from everyone.", manage: "Manage session", send: "Send message", placeholder: "Write a message, @ mention a member to assign work\u2026", hint: "Enter to send \xB7 Shift + Enter for a new line", mentionHint: "Only @ mentions trigger work \xB7 @all reaches everyone", archive: "Archive session", restore: "Restore session", exportMd: "Export Markdown", exportJson: "Export JSON", import: "Import session", stop: "Stop all", stopMember: "Stop member", native: "Open native session", execution: "Execution details", running: "Running", preparing: "Preparing", completed: "Completed", stopped: "Stopped", error: "Failed", interrupted: "Interrupted", title: "Session name", cwd: "Working directory (absolute path)", members: "Members", collab: "Allow agents to hand work off with @ mentions", collabHelp: "At most {n} automatic handoffs per human message. Stop at any time.", create: "Create session", save: "Save", cancel: "Cancel", agentTitle: "Member settings", agentId: "Mention ID", agentName: "Display name", role: "Role instructions", model: "Model", hostModel: "Use DSH default model", color: "Avatar color", files: "Attach text files", remove: "Remove", attachment: "Attachment", readOnly: "This session is archived. Restore it to continue.", menu: "Session actions", rename: "Manage", loading: "Loading\u2026", noResults: "No matching sessions", team: "Team", you: "You", system: "System", modelError: "Model catalog unavailable", noMessages: "No messages yet", failed: "Operation failed", textFiles: "Text, Markdown, JSON, or code; up to 4 files, 100 KB each.", working: "Thinking and working", jump: "Jump to latest", settings: "Toggle theme", language: "\u5207\u6362\u4E2D\u6587", back: "Session list", overview: "Shared conversation \xB7 Native DSH execution", humanOnly: "Human mentions only", auto: "Automatic handoffs on", chooseDir: "/absolute/path/to/your/project", nativeDescription: "Inspect tools and approvals in the native DSH session", importNotice: "Imported as an archived session. Restore it to continue." }
};
async function api(path, input, signal) {
  const res = await fetch(`/agentroom/api/${path}`, { signal, method: input === void 0 ? "GET" : "POST", headers: { "x-agentroom-request": "1", ...input === void 0 ? {} : { "content-type": "application/json" } }, ...input === void 0 ? {} : { body: JSON.stringify(input) } });
  let value;
  try {
    value = await res.json();
  } catch {
    throw new Error(`Agentroom ${res.status}: reload DSH after enabling the plugin.`);
  }
  if (!res.ok) throw new Error(value.error || `HTTP ${res.status}`);
  return value;
}
var paths = {
  room: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 4h16v12H10l-5 4v-4H4z" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 8h8M8 12h5" })
  ] }),
  plus: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 5v14M5 12h14" }),
  search: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "10.5", cy: "10.5", r: "6.5" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m16 16 4 4" })
  ] }),
  sun: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "4" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" })
  ] }),
  moon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13z" }),
  send: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m21 3-6 18-4-8-8-4 18-6zM11 13 21 3" }) }),
  more: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "5", cy: "12", r: "1" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "1" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "19", cy: "12", r: "1" })
  ] }),
  close: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m6 6 12 12M6 18 18 6" }),
  folder: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 7V5h7l2 2h9v13H3z" }),
  file: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h6" }) }),
  attach: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m8 13 7-7a3 3 0 0 1 4 4L9 20a5 5 0 0 1-7-7L13 2" }),
  chevron: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m9 5 7 7-7 7" }),
  down: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m5 9 7 7 7-7" }),
  check: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m5 12 4 4L19 6" }),
  stop: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "6", y: "6", width: "12", height: "12", rx: "2" }),
  archive: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 8h16v13H4zM3 3h18v5H3zM10 12h4" }) }),
  upload: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6" }) }),
  download: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4" }) }),
  users: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "9", cy: "8", r: "3" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M18 15a5 5 0 0 1 3 5" })
  ] }),
  arrow: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m14 5-7 7 7 7" }),
  external: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M14 3h7v7M21 3l-9 9M10 5H3v16h16v-7" }) }),
  hash: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m10 3-4 18M18 3l-4 18M3 9h18M2 15h18" }),
  clock: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "9" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 6v6l4 2" })
  ] }),
  globe: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "9" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 12h18M12 3a19 19 0 0 1 0 18 19 19 0 0 1 0-18" })
  ] })
};
function Icon({ name, size = 16 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: paths[name] || paths.room });
}
function Avatar({ member, small }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `ar-avatar ${small ? "ar-small" : ""}`, style: { background: member.color }, children: member.name.slice(0, 1).toUpperCase() });
}
function RichText({ text }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: text.split(/(```[\s\S]*?```)/g).map((block, i) => block.startsWith("```") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: block.slice(3, -3).replace(/^\w*\n/, "") }) }, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ar-prose", children: block.split(/(`[^`\n]+`|\*\*[^*\n]+\*\*|@[a-z][a-z0-9-]*)/g).map((part, j) => part.startsWith("`") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: part.slice(1, -1) }, j) : part.startsWith("**") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: part.slice(2, -2) }, j) : part.startsWith("@") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ar-mention", children: part }, j) : part) }, i)) });
}
function download(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
function App({ openSession }) {
  const [lang, setLang] = (0, import_react.useState)(() => localStorage.getItem("dsh-agentroom.language") === "en" ? "en" : "zh");
  const [theme, setTheme] = (0, import_react.useState)(() => localStorage.getItem("dsh-agentroom.theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  const t = (key) => words[lang][key];
  const [data, setData] = (0, import_react.useState)();
  const [roomId, setRoomId] = (0, import_react.useState)();
  const [error, setError] = (0, import_react.useState)("");
  const [pollError, setPollError] = (0, import_react.useState)("");
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [search, setSearch] = (0, import_react.useState)("");
  const [showArchived, setShowArchived] = (0, import_react.useState)(false);
  const [menu, setMenu] = (0, import_react.useState)(false);
  const [mobileList, setMobileList] = (0, import_react.useState)(false);
  const [modal, setModal] = (0, import_react.useState)();
  const [editing, setEditing] = (0, import_react.useState)();
  const [text, setText] = (0, import_react.useState)("");
  const [files, setFiles] = (0, import_react.useState)([]);
  const [suggest, setSuggest] = (0, import_react.useState)(false);
  const [catalog, setCatalog] = (0, import_react.useState)();
  const timeline = (0, import_react.useRef)(null);
  const composer = (0, import_react.useRef)(null);
  const fileInput = (0, import_react.useRef)(null);
  const importInput = (0, import_react.useRef)(null);
  const nearBottom = (0, import_react.useRef)(true);
  const room = data?.room;
  const refresh = async (id = roomId) => {
    const fresh = await api(`state${id ? "?room=" + encodeURIComponent(id) : ""}`);
    setData(fresh);
    setError("");
    return fresh;
  };
  (0, import_react.useEffect)(() => {
    let alive = true;
    let timer;
    const abort = new AbortController();
    const poll = async () => {
      try {
        const fresh = await api(`state${roomId ? "?room=" + encodeURIComponent(roomId) : ""}`, void 0, abort.signal);
        if (alive) {
          setData(fresh);
          setPollError("");
        }
      } catch (e) {
        if (alive) setPollError(e.message);
      } finally {
        if (alive) timer = setTimeout(poll, document.hidden ? 5e3 : 900);
      }
    };
    void poll();
    return () => {
      alive = false;
      clearTimeout(timer);
      abort.abort();
    };
  }, [roomId]);
  (0, import_react.useEffect)(() => {
    localStorage.setItem("dsh-agentroom.language", lang);
  }, [lang]);
  (0, import_react.useEffect)(() => {
    localStorage.setItem("dsh-agentroom.theme", theme);
  }, [theme]);
  (0, import_react.useEffect)(() => {
    if (nearBottom.current) timeline.current?.scrollTo({ top: timeline.current.scrollHeight });
  }, [room?.messages.length, JSON.stringify(data?.drafts), JSON.stringify(room?.runs)]);
  (0, import_react.useEffect)(() => {
    if (!modal) return;
    const onKey = (e) => {
      if (e.key === "Escape") setModal(void 0);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modal]);
  const act = async (fn) => {
    if (busy) return;
    setBusy(true);
    try {
      await fn();
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const selectRoom = (id) => {
    setRoomId(id);
    setText("");
    setFiles([]);
    nearBottom.current = true;
    setMenu(false);
    setMobileList(false);
  };
  const editAgent = (member) => {
    setEditing(member);
    setModal("agent");
    void api("models").then(setCatalog).catch((e) => setError(`${t("modelError")}: ${e.message}`));
  };
  const send = async () => {
    if (!room || !text.trim() || busy) return;
    const original = text;
    const attachments = files;
    await act(async () => {
      await api(`rooms/${room.id}/send`, { id: crypto.randomUUID(), text: original, attachments });
      setText("");
      setFiles([]);
      setSuggest(false);
      nearBottom.current = true;
      await refresh();
      composer.current?.focus();
    });
  };
  const addMention = (id) => {
    setText((old) => /@[a-z0-9-]*$/i.test(old) ? old.replace(/@[a-z0-9-]*$/i, "@" + id + " ") : old + (old && !old.endsWith(" ") ? " " : "") + "@" + id + " ");
    setSuggest(false);
    composer.current?.focus();
  };
  const exportRoom = async (format) => {
    if (!room) return;
    const value = await api(`export/${room.id}?format=${format}`);
    download(room.title.replace(/[/\\:*?"<>|]/g, "_") + "." + format, format === "md" ? value.text : JSON.stringify(value, null, 2), format === "md" ? "text/markdown" : "application/json");
    setMenu(false);
  };
  const running = room?.runs.filter(active) || [];
  const summaries = data?.rooms.filter((r) => (showArchived || !r.archived) && r.title.toLowerCase().includes(search.toLowerCase())) || [];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `ar-root ${mobileList ? "ar-show-list" : ""}`, "data-theme": theme, lang: lang === "zh" ? "zh-CN" : "en", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { className: "ar-sidebar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { className: "ar-brand", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ar-brand-icon", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "room", size: 23 }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Agentroom" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: t("tagline") })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "ar-icon", title: t("settings"), "aria-label": t("settings"), onClick: () => setTheme(theme === "dark" ? "light" : "dark"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: theme === "dark" ? "sun" : "moon" }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-search", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "search" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { "aria-label": t("search"), placeholder: t("search"), value: search, onChange: (e) => setSearch(e.target.value) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-section-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
          t("sessions"),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: data?.rooms.filter((r) => !r.archived).length || 0 })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "ar-icon", "aria-label": t("new"), title: t("new"), onClick: () => setModal("new"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "plus" }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", { className: "ar-sessions", "aria-label": t("sessions"), children: [
        summaries.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => selectRoom(r.id), className: `ar-session ${roomId === r.id ? "ar-selected" : ""}`, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: r.archived ? "archive" : "hash" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: r.title }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: r.members.map((id) => "@" + id).join(" \xB7 ") })
          ] }),
          r.running > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ar-live" }),
          r.archived && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ar-archive-label", children: t("archived") })
        ] }, r.id)),
        data && !summaries.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "ar-no-results", children: t("noResults") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: "ar-subtle ar-archive-toggle", onClick: () => setShowArchived(!showArchived), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "archive", size: 13 }),
        showArchived ? t("hideArchive") : t("showArchive")
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-section-head ar-team-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("agents") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "ar-icon", "aria-label": t("addAgent"), title: t("addAgent"), onClick: () => editAgent(), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "plus" }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ar-agent-list", children: data?.agents.map((member) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: "ar-agent-row", onClick: () => editAgent(member), title: t("agentTitle"), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { member, small: true }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: member.name }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
            "@",
            member.id
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `ar-presence ${running.some((r) => r.memberId === member.id) ? "ar-pulsing" : ""}` })
      ] }, member.id)) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", { className: "ar-sidebar-footer", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "ar-connection", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: data && !pollError ? "ar-ok" : "" }),
          data && !pollError ? t("online") : t("connecting")
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { title: t("language"), onClick: () => setLang(lang === "zh" ? "en" : "zh"), children: lang === "zh" ? "EN" : "\u4E2D\u6587" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { className: "ar-main", children: [
      (error || pollError) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-error", role: "alert", children: [
        error || pollError,
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { "aria-label": t("remove"), onClick: () => setError(""), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "close" }) })
      ] }),
      !room ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-welcome", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: "ar-mobile-back ar-subtle", onClick: () => setMobileList(true), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow" }),
          t("back")
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ar-welcome-symbol", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "room", size: 44 }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ar-eyebrow", children: "DSH AGENTROOM" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: t("empty") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("intro") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: "ar-primary", onClick: () => setModal("new"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "plus" }),
          t("start")
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-welcome-steps", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "01" }),
            " ",
            t("create")
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "02" }),
            " @Agent"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "03" }),
            " ",
            t("overview").split(" \xB7 ")[0]
          ] })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { className: "ar-room-header", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "ar-icon ar-mobile-back", title: t("back"), onClick: () => setMobileList(true), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ar-channel-icon", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "hash", size: 22 }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-room-heading", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: "ar-title-button", onClick: () => setModal("room"), children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: room.title }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "down", size: 13 })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-room-path", title: room.cwd, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "folder", size: 12 }),
              room.cwd
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ar-header-members", children: data?.agents.filter((a) => room.members.includes(a.id)).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { title: a.name, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { member: a, small: true }) }, a.id)) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: "ar-ghost ar-manage", onClick: () => setModal("room"), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "users" }),
            t("manage")
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-menu-wrap", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "ar-icon", "aria-label": t("menu"), title: t("menu"), onClick: () => setMenu(!menu), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "more" }) }),
            menu && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "ar-menu-dismiss", "aria-label": t("cancel"), onClick: () => setMenu(false) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-menu", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => {
                  setModal("room");
                  setMenu(false);
                }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "users" }),
                  t("manage")
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => act(() => exportRoom("md")), children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "download" }),
                  t("exportMd")
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => act(() => exportRoom("json")), children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "download" }),
                  t("exportJson")
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => {
                  importInput.current?.click();
                  setMenu(false);
                }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "upload" }),
                  t("import")
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", {}),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => act(async () => {
                  await api(`rooms/${room.id}/edit`, { archived: !room.archived });
                  setMenu(false);
                  setShowArchived(true);
                  await refresh();
                }), children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "archive" }),
                  room.archived ? t("restore") : t("archive")
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-room-subhead", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ar-tiny-dot" }),
            room.members.length,
            " ",
            t("members"),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ar-divider", children: "/" }),
            room.collaboration ? t("auto") : t("humanOnly")
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "DSH" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-timeline", ref: timeline, onScroll: () => {
          const el = timeline.current;
          nearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-room-start", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ar-start-hash", children: "#" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: room.title }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("roomIntro") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ar-start-members", children: data?.agents.filter((a) => room.members.includes(a.id)).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => addMention(a.id), children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { background: a.color } }),
              "@",
              a.id
            ] }, a.id)) })
          ] }),
          !!room.messages.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ar-date-line", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: new Date(room.createdAt).toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", { month: "long", day: "numeric" }) }) }),
          room.messages.map((message) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageRow, { message, runs: room.runs, t, lang, openSession: (id) => act(() => openSession(id)) }, message.id)),
          running.map((run) => {
            const member = data.agents.find((a) => a.id === run.memberId);
            return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-message ar-stream", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { member }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-message-body", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-message-byline", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: member.name }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ar-agent-badge", children: "AGENT" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: t(run.status) })
                ] }),
                data?.drafts[run.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichText, { text: data.drafts[run.id] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-thinking", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("working") })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ar-running-tools", children: run.tools.slice(-3).join(" \u2192 ") }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-run-actions", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => act(() => openSession(run.sessionId)), children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "external", size: 12 }),
                    t("native")
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => act(async () => {
                    await api(`rooms/${room.id}/stop`, { memberId: run.memberId });
                    await refresh();
                  }), children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "stop", size: 12 }),
                    t("stopMember")
                  ] })
                ] })
              ] })
            ] }, run.id);
          }),
          room.runs.filter((r) => ["error", "interrupted", "stopped"].includes(r.status)).slice(-6).map((run) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `ar-run-notice ar-run-${run.status}`, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: run.status === "stopped" ? "stop" : "clock", size: 14 }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
                "@",
                run.memberId,
                " \xB7 ",
                t(run.status)
              ] }),
              run.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: run.detail })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => act(() => openSession(run.sessionId)), children: [
              t("native"),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "external", size: 12 })
            ] })
          ] }, "status-" + run.id))
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "ar-composer-area", children: [
          !!running.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-working-bar", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ar-live" }),
              running.map((r) => "@" + r.memberId).join(", "),
              " \xB7 ",
              t("running")
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => act(async () => {
              await api(`rooms/${room.id}/stop`, {});
              await refresh();
            }), children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "stop", size: 12 }),
              t("stop")
            ] })
          ] }),
          room.archived ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-archived-notice", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "archive" }),
            t("readOnly"),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => act(async () => {
              await api(`rooms/${room.id}/edit`, { archived: false });
              await refresh();
            }), children: t("restore") })
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            suggest && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ar-suggestions", children: [...data.agents.filter((a) => room.members.includes(a.id)), { id: "all", name: lang === "zh" ? "\u6240\u6709\u6210\u5458" : "Everyone", color: "#64748b" }].filter((a) => a.id.startsWith(text.match(/@([a-z0-9-]*)$/i)?.[1]?.toLowerCase() || "")).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => addMention(a.id), children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { member: a, small: true }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
                "@",
                a.id
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: a.name })
            ] }, a.id)) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-composer", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { ref: composer, "aria-label": t("placeholder"), placeholder: t("placeholder"), value: text, maxLength: 1e5, onChange: (e) => {
                setText(e.target.value);
                setSuggest(/(?:^|\s)@[a-z0-9-]*$/i.test(e.target.value));
              }, onKeyDown: (e) => {
                if (e.key === "Escape") setSuggest(false);
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  void send();
                }
              } }),
              !!files.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ar-file-chips", children: files.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "file", size: 13 }),
                f.name,
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { "aria-label": t("remove") + " " + f.name, onClick: () => setFiles(files.filter((_, j) => j !== i)), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "close", size: 12 }) })
              ] }, i)) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-composer-toolbar", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "ar-icon", title: t("files"), "aria-label": t("files"), onClick: () => fileInput.current?.click(), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "attach" }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "ar-icon ar-at", title: "@Agent", onClick: () => {
                    setText(text + (text && !text.endsWith(" ") ? " " : "") + "@");
                    setSuggest(true);
                    composer.current?.focus();
                  }, children: "@" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("mentionHint") })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "ar-send", "aria-label": t("send"), title: t("send"), disabled: busy || !text.trim(), onClick: () => void send(), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "send", size: 17 }) })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-composer-hint", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("hint") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("overview") })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", { className: "ar-footer", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
          "v0.1.0 ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\xA9 Intelli-Jungle" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: "ar-subtle", onClick: () => importInput.current?.click(), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "upload", size: 12 }),
          t("import")
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "file", hidden: true, multiple: true, ref: fileInput, accept: "text/*,.md,.json,.csv,.ts,.tsx,.js,.py,.yaml,.yml,.log", onChange: (e) => {
      const picked = [...e.target.files || []];
      e.target.value = "";
      void act(async () => {
        if (files.length + picked.length > 4 || picked.some((f) => f.size > 1e5)) throw new Error(t("textFiles"));
        const loaded = await Promise.all(picked.map(async (f) => {
          const text2 = await f.text();
          if (text2.includes("\0")) throw new Error(t("textFiles"));
          return { name: f.name, text: text2 };
        }));
        setFiles([...files, ...loaded]);
      });
    } }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "file", hidden: true, ref: importInput, accept: ".json,application/json", onChange: (e) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (file) void act(async () => {
        if (file.size > 8 * 1024 * 1024) throw new Error("8 MB limit");
        const imported = await api("import", JSON.parse(await file.text()));
        setShowArchived(true);
        selectRoom(imported.id);
      });
    } }),
    modal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, { error, title: modal === "agent" ? t("agentTitle") : modal === "new" ? t("new") : t("manage"), close: () => setModal(void 0), t, children: modal === "agent" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentForm, { editing, catalog, t, busy, onSave: (member) => act(async () => {
      await api("agents", member);
      setModal(void 0);
      await refresh();
    }) }, editing?.id || "new") : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoomForm, { room: modal === "room" ? room : void 0, agents: data?.agents || [], maxHandoffs: data?.maxHandoffs || 0, t, busy, onSave: (input) => act(async () => {
      const saved = await api(modal === "new" ? "rooms" : `rooms/${room.id}/edit`, input);
      setModal(void 0);
      selectRoom(saved.id);
      await refresh(saved.id);
    }) }, modal + (room?.id || "")) })
  ] });
}
function MessageRow({ message, runs, t, lang, openSession }) {
  if (message.kind === "system") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-system-message", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "clock", size: 13 }),
    message.text
  ] });
  const run = runs.find((r) => r.id === message.runId);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { className: "ar-message", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { member: message }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-message-body", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-message-byline", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: message.kind === "human" ? t("you") : message.name }),
        message.kind === "agent" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ar-agent-badge", children: "AGENT" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: new Date(message.at).toLocaleTimeString(lang === "zh" ? "zh-CN" : "en-US", { hour: "2-digit", minute: "2-digit", hour12: false }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichText, { text: message.text }),
      message.attachments?.map((file, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { className: "ar-attachment", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "file", size: 14 }),
          file.name
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { children: file.text })
      ] }, i)),
      run && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { className: "ar-execution", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "chevron", size: 11 }),
          t("execution"),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `ar-status-${run.status}`, children: t(run.status) }),
          run.endedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
            Math.max(1, Math.round((run.endedAt - run.at) / 1e3)),
            "s"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          run.tools.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: run.tools.join(" \u2192 ") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("nativeDescription") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => openSession(run.sessionId), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "external", size: 12 }),
            t("native")
          ] })
        ] })
      ] })
    ] })
  ] });
}
function Modal({ title, close, t, children, error }) {
  const ref = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    const previous = document.activeElement;
    ref.current?.querySelector("input")?.focus();
    return () => previous?.focus();
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ar-overlay", onMouseDown: (e) => {
    if (e.target === e.currentTarget) close();
  }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-modal", role: "dialog", "aria-modal": "true", "aria-label": title, ref, onKeyDown: (e) => {
    if (e.key !== "Tab") return;
    const els = [...ref.current.querySelectorAll("button:not(:disabled),input:not(:disabled),textarea,select")];
    const index = els.indexOf(document.activeElement);
    if (e.shiftKey && index === 0) {
      e.preventDefault();
      els.at(-1)?.focus();
    } else if (!e.shiftKey && index === els.length - 1) {
      e.preventDefault();
      els[0]?.focus();
    }
  }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: title }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "ar-icon", "aria-label": t("cancel"), onClick: close, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "close" }) })
    ] }),
    error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ar-dialog-error", role: "alert", children: error }),
    children
  ] }) });
}
function RoomForm({ room, agents, t, busy, onSave, maxHandoffs }) {
  const [title, setTitle] = (0, import_react.useState)(room?.title || "");
  const [cwd, setCwd] = (0, import_react.useState)(room?.cwd || "");
  const [members, setMembers] = (0, import_react.useState)(room?.members || agents.map((a) => a.id));
  const [collaboration, setCollaboration] = (0, import_react.useState)(room?.collaboration ?? true);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", { onSubmit: (e) => {
    e.preventDefault();
    onSave({ title, ...room ? {} : { cwd }, members, collaboration });
  }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
      t("title"),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { required: true, maxLength: 80, value: title, onChange: (e) => setTitle(e.target.value) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
      t("cwd"),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { required: true, disabled: !!room, value: cwd, placeholder: t("chooseDir"), onChange: (e) => setCwd(e.target.value) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", { children: t("members") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ar-member-picker", children: agents.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", checked: members.includes(a.id), onChange: (e) => setMembers(e.target.checked ? [...members, a.id] : members.filter((id) => id !== a.id)) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { member: a, small: true }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
          a.name,
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
            "@",
            a.id
          ] })
        ] })
      ] }, a.id)) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "ar-checkbox", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", checked: collaboration, onChange: (e) => setCollaboration(e.target.checked) }),
      t("collab")
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "ar-field-help", children: t("collabHelp").replace("{n}", String(maxHandoffs)) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: "ar-primary", type: "submit", disabled: busy || !members.length || members.length > 8 || !title.trim() || !cwd.trim(), children: [
      busy ? t("loading") : room ? t("save") : t("create"),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "chevron", size: 14 })
    ] }) })
  ] });
}
function AgentForm({ editing, catalog, t, busy, onSave }) {
  const [id, setId] = (0, import_react.useState)(editing?.id || "");
  const [name, setName] = (0, import_react.useState)(editing?.name || "");
  const [role, setRole] = (0, import_react.useState)(editing?.role || "");
  const [color, setColor] = (0, import_react.useState)(editing?.color || "#4f46e5");
  const [model, setModel] = (0, import_react.useState)(editing?.model ? JSON.stringify(editing.model) : "");
  const options = catalog?.groups.flatMap((g) => g.models.map((m) => ({ value: JSON.stringify({ provider: g.id, model: m.id }), name: `${g.name} / ${m.name}` }))) || [];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", { onSubmit: (e) => {
    e.preventDefault();
    onSave({ id, name, role, color, ...model ? { model: JSON.parse(model) } : {} });
  }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ar-field-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
        t("agentId"),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { required: true, pattern: "[a-z][a-z0-9-]{0,31}", maxLength: 32, disabled: !!editing, value: id, onChange: (e) => setId(e.target.value.toLowerCase()) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
        t("agentName"),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { required: true, maxLength: 48, value: name, onChange: (e) => setName(e.target.value) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
      t("role"),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { required: true, rows: 5, maxLength: 8e3, value: role, onChange: (e) => setRole(e.target.value) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
      t("model"),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { value: model, onChange: (e) => setModel(e.target.value), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", { value: "", children: [
          t("hostModel"),
          catalog?.default ? ` (${catalog.default.model})` : ""
        ] }),
        model && !options.some((o) => o.value === model) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: model, children: JSON.parse(model).model }),
        options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: o.value, children: o.name }, o.value))
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "ar-color-label", children: [
      t("color"),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "color", value: color, onChange: (e) => setColor(e.target.value) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { member: { name: name || id || "A", color } })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: "ar-primary", type: "submit", disabled: busy || !id || !name.trim() || !role.trim(), children: [
      busy ? t("loading") : t("save"),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "check", size: 15 })
    ] }) })
  ] });
}

// src/client/index.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var inject = ["slots", "uiWorkspace", "sessions"];
function apply(ctx) {
  ctx.effect(() => {
    const style = document.createElement("style");
    style.dataset.agentroom = "true";
    style.textContent = `/* Agent Teamroom's indigo / paper / Slack-dark palette, scoped to our panel. */
.ar-root{--ar-accent:#4f46e5;--ar-accent-soft:rgba(79,70,229,.09);--ar-bg:#fff;--ar-sidebar:#f8f9fb;--ar-elevated:#fff;--ar-hover:rgba(0,0,0,.035);--ar-code:#f3f4f6;--ar-line:#e5e7eb;--ar-line-strong:#d1d5db;--ar-text:#1f2329;--ar-secondary:#6b7280;--ar-faint:#9299a5;--ar-danger:#c63636;--ar-success:#16a34a;--ar-shadow:0 12px 40px #0002;display:grid;grid-template-columns:272px minmax(0,1fr);width:100%;height:100%;min-height:0;overflow:hidden;color:var(--ar-text);background:var(--ar-bg);font:14px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;position:relative;text-align:left;isolation:isolate}
.ar-root[data-theme=dark]{--ar-accent:#a0a8ff;--ar-accent-soft:rgba(129,140,248,.14);--ar-bg:#1a1d21;--ar-sidebar:#19171d;--ar-elevated:#22252b;--ar-hover:rgba(255,255,255,.045);--ar-code:#26292f;--ar-line:#2e3138;--ar-line-strong:#3c4048;--ar-text:#e8eaed;--ar-secondary:#9aa0a6;--ar-faint:#7f8896;--ar-danger:#f88989;--ar-success:#4ade80;--ar-shadow:0 12px 40px #0008}
.ar-root *{box-sizing:border-box}.ar-root button,.ar-root input,.ar-root textarea,.ar-root select{font:inherit;color:inherit}.ar-root button{background:none;border:0;cursor:pointer;padding:0;display:inline-flex;align-items:center;justify-content:center;gap:7px}.ar-root button:disabled{opacity:.4;cursor:not-allowed}.ar-root button:focus-visible,.ar-root summary:focus-visible{outline:2px solid var(--ar-accent);outline-offset:2px}.ar-root input:not([type=checkbox]):not([type=color]),.ar-root select,.ar-root textarea{border:1px solid var(--ar-line-strong);background:var(--ar-elevated);border-radius:6px;padding:9px 11px;outline:none;min-width:0}.ar-root input:focus,.ar-root select:focus,.ar-root textarea:focus{border-color:var(--ar-accent);box-shadow:0 0 0 2px var(--ar-accent-soft)}.ar-root input[type=checkbox]{accent-color:var(--ar-accent);width:15px;height:15px;flex-shrink:0}.ar-root h1,.ar-root h2,.ar-root p{margin:0}.ar-root svg{flex-shrink:0}.ar-root .ar-icon{width:28px;height:28px;border-radius:6px;color:var(--ar-secondary);flex-shrink:0}.ar-root .ar-icon:hover{background:var(--ar-hover);color:var(--ar-text)}.ar-root .ar-subtle{color:var(--ar-secondary);font-size:11px}.ar-root .ar-primary{border-radius:7px;background:#4f46e5;color:#fff;padding:9px 14px;font-weight:600;font-size:13px}.ar-root .ar-primary:hover{background:#4338ca}.ar-root .ar-ghost{border:1px solid var(--ar-line);border-radius:6px;padding:6px 10px;font-size:12px;color:var(--ar-secondary);white-space:nowrap}.ar-root .ar-ghost:hover{background:var(--ar-hover)}
.ar-sidebar{display:flex;flex-direction:column;min-height:0;min-width:0;border-right:1px solid var(--ar-line);background:var(--ar-sidebar)}.ar-brand{display:flex;align-items:center;gap:10px;padding:23px 17px 20px}.ar-brand>div{flex:1;min-width:0}.ar-brand strong{display:block;font-size:17px;letter-spacing:-.5px;font-weight:700}.ar-brand small{display:block;font-size:10px;color:var(--ar-faint);white-space:nowrap;margin-top:2px}.ar-brand-icon{display:flex;color:var(--ar-accent)}.ar-search{margin:0 15px 22px;display:flex;align-items:center;padding:0 9px;border:1px solid var(--ar-line);border-radius:6px;color:var(--ar-faint);background:var(--ar-bg);height:32px}.ar-root .ar-search input{background:transparent;border:0;padding:4px 6px;font-size:12px;box-shadow:none;width:100%}.ar-search input::placeholder{color:var(--ar-faint)}.ar-section-head{display:flex;align-items:center;justify-content:space-between;padding:0 15px 6px;color:var(--ar-secondary);font-size:11px;font-weight:600;letter-spacing:.03em}.ar-section-head b{font-size:10px;display:inline-block;margin-left:4px;border-radius:4px;padding:0 5px;background:var(--ar-hover);font-weight:400}.ar-sessions{flex:1;min-height:70px;overflow-y:auto;padding:0 8px}.ar-root .ar-session{width:100%;text-align:left;justify-content:flex-start;padding:10px 10px;border-radius:7px;margin-bottom:3px;gap:9px;min-width:0;color:var(--ar-secondary)}.ar-session>span:first-of-type{min-width:0;flex:1}.ar-session strong{display:block;font-size:12px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ar-session small{display:block;color:var(--ar-faint);font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:2px}.ar-root .ar-session:hover{background:var(--ar-hover)}.ar-root .ar-session.ar-selected{background:var(--ar-accent-soft);color:var(--ar-accent)}.ar-session.ar-selected strong{font-weight:600}.ar-session.ar-selected small{color:var(--ar-accent);opacity:.7}.ar-archive-label{font-size:9px;color:var(--ar-faint)}.ar-no-results{font-size:12px;color:var(--ar-faint);padding:10px}.ar-root .ar-archive-toggle{justify-content:flex-start;margin:12px 18px 18px}.ar-team-head{border-top:1px solid var(--ar-line);padding-top:14px}.ar-agent-list{padding:0 13px 15px;max-height:32%;overflow-y:auto}.ar-root .ar-agent-row{width:100%;gap:9px;justify-content:flex-start;text-align:left;border-radius:6px;padding:6px 4px}.ar-agent-row:hover{background:var(--ar-hover)}.ar-agent-row>span:nth-child(2){flex:1}.ar-agent-row strong{display:block;font-size:12px;font-weight:500}.ar-agent-row small{display:block;color:var(--ar-faint);font-size:10px;line-height:1.2}.ar-avatar{width:34px;height:34px;border-radius:9px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;color:#fff;font-size:15px;font-weight:600;line-height:1}.ar-avatar.ar-small{width:26px;height:26px;font-size:12px;border-radius:7px}.ar-presence,.ar-live,.ar-tiny-dot{width:6px;height:6px;border-radius:50%;background:var(--ar-success);display:inline-block;flex-shrink:0}.ar-agent-row .ar-presence{margin-right:5px;width:5px;height:5px;opacity:.6}.ar-pulsing,.ar-live{animation:ar-pulse 1.6s ease-in-out infinite}.ar-sidebar-footer{display:flex;justify-content:space-between;align-items:center;padding:13px 17px;border-top:1px solid var(--ar-line);font-size:10px;color:var(--ar-faint);gap:8px}.ar-connection{display:flex;align-items:center;gap:5px;white-space:nowrap}.ar-connection i{width:5px;height:5px;background:var(--ar-faint);border-radius:50%}.ar-connection i.ar-ok{background:var(--ar-success)}.ar-sidebar-footer button{font-size:11px}
.ar-main{display:flex;flex-direction:column;min-height:0;min-width:0;position:relative}.ar-room-header{display:flex;align-items:center;gap:12px;min-height:77px;padding:15px 27px;border-bottom:1px solid var(--ar-line);flex-shrink:0}.ar-channel-icon{color:var(--ar-secondary);display:flex}.ar-room-heading{flex:1;min-width:0}.ar-title-button{max-width:100%;justify-content:flex-start!important;gap:6px!important}.ar-title-button h1{font-size:16px;font-weight:650;letter-spacing:-.2px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.ar-room-path{color:var(--ar-faint);display:flex;align-items:center;gap:5px;font:10px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}.ar-header-members{display:flex;flex-shrink:0;margin-right:5px}.ar-header-members>span{margin-left:-5px;box-shadow:0 0 0 2px var(--ar-bg);border-radius:7px}.ar-room-subhead{display:flex;justify-content:space-between;align-items:center;gap:10px;min-height:33px;padding:0 28px;font-size:10px;color:var(--ar-faint);border-bottom:1px solid var(--ar-line);flex-shrink:0}.ar-room-subhead>span:first-child{display:flex;align-items:center;gap:6px}.ar-room-subhead>span:last-child{font:9px ui-monospace,SFMono-Regular,monospace;letter-spacing:1px}.ar-divider{opacity:.45;margin:0 4px}.ar-timeline{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;scrollbar-gutter:stable;padding:0 0 16px;overscroll-behavior:contain}.ar-room-start{padding:35px 31px 25px}.ar-start-hash{width:43px;height:43px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:var(--ar-code);font-weight:400;font-size:27px;color:var(--ar-secondary);margin-bottom:12px}.ar-room-start h2{font-size:23px;letter-spacing:-.7px;font-weight:700}.ar-room-start p{font-size:12px;color:var(--ar-secondary);margin-top:6px}.ar-start-members{display:flex;gap:7px;flex-wrap:wrap;margin-top:14px}.ar-root .ar-start-members button{font-size:11px;border:1px solid var(--ar-line);padding:3px 7px;border-radius:5px;color:var(--ar-secondary)}.ar-start-members button>span{width:5px;height:5px;border-radius:50%}.ar-start-members button:hover{background:var(--ar-hover)}.ar-date-line{display:flex;align-items:center;gap:12px;font-size:10px;margin:0 28px 17px;color:var(--ar-secondary)}.ar-date-line:before,.ar-date-line:after{content:"";height:1px;background:var(--ar-line);flex:1}.ar-date-line>span{border:1px solid var(--ar-line);border-radius:20px;padding:2px 10px}.ar-message{display:flex;align-items:flex-start;gap:12px;padding:10px 31px 12px}.ar-message:hover{background:var(--ar-hover)}.ar-message-body{min-width:0;flex:1}.ar-message-byline{display:flex;align-items:center;gap:7px;min-height:22px;margin-bottom:3px}.ar-message-byline strong{font-size:13px;font-weight:650}.ar-message-byline time,.ar-message-byline small{color:var(--ar-faint);font-size:10px}.ar-agent-badge{font-size:8px;color:var(--ar-secondary);background:var(--ar-code);padding:0 4px;border-radius:3px;letter-spacing:.5px;line-height:15px}.ar-prose{white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px;line-height:1.8}.ar-prose:empty{display:none}.ar-prose code{padding:1px 4px;border:1px solid var(--ar-line);border-radius:4px;font:11px ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--ar-code)}.ar-mention{color:var(--ar-accent);background:var(--ar-accent-soft);border-radius:3px;padding:1px 2px}.ar-message pre{background:var(--ar-code);border:1px solid var(--ar-line);padding:12px 14px;border-radius:7px;font:11px/1.7 ui-monospace,SFMono-Regular,Menlo,monospace;overflow:auto;max-width:100%;margin:8px 0}.ar-execution{margin-top:9px;color:var(--ar-faint);font-size:10px}.ar-execution summary{display:flex;align-items:center;gap:7px;cursor:pointer;list-style:none;width:fit-content}.ar-execution summary::-webkit-details-marker{display:none}.ar-execution[open] summary>svg{transform:rotate(90deg)}.ar-execution summary>span{font-size:9px}.ar-execution>div{border-left:2px solid var(--ar-line);margin:9px 0 4px 4px;padding:0 10px;font-size:11px;overflow-wrap:anywhere}.ar-execution button{color:var(--ar-accent);font-size:10px;margin-top:7px}.ar-status-completed{color:var(--ar-success)}.ar-status-error,.ar-status-interrupted{color:var(--ar-danger)}.ar-attachment{margin-top:7px;color:var(--ar-secondary);font-size:11px;border:1px solid var(--ar-line);border-radius:6px;padding:6px 10px}.ar-attachment summary{display:flex;align-items:center;gap:7px;cursor:pointer}.ar-system-message{font-size:11px;color:var(--ar-secondary);padding:7px 30px;display:flex;align-items:center;gap:7px;white-space:pre-wrap}.ar-thinking{display:flex;align-items:center;gap:3px;color:var(--ar-faint);height:30px}.ar-thinking i{width:4px;height:4px;border-radius:50%;background:var(--ar-accent);animation:ar-pulse 1s infinite}.ar-thinking i:nth-child(2){animation-delay:.15s}.ar-thinking i:nth-child(3){animation-delay:.3s}.ar-thinking span{font-size:11px;margin-left:7px}.ar-run-actions{display:flex;gap:16px;margin-top:8px}.ar-run-actions button{font-size:10px;color:var(--ar-secondary)}.ar-running-tools{font:10px ui-monospace,monospace;color:var(--ar-faint);overflow-wrap:anywhere}.ar-run-notice{display:flex;align-items:center;gap:8px;border:1px solid var(--ar-line);border-radius:6px;padding:8px 10px;margin:8px 31px;font-size:10px;color:var(--ar-secondary)}.ar-run-notice>span{flex:1;min-width:0}.ar-run-notice strong{font-weight:500}.ar-run-notice small{display:block;overflow-wrap:anywhere}.ar-run-notice button{font-size:10px;flex-shrink:0}.ar-run-error{color:var(--ar-danger)}
.ar-composer-area{padding:6px 28px 10px;flex-shrink:0;position:relative}.ar-composer{border:1px solid var(--ar-line-strong);border-radius:9px;background:var(--ar-elevated);overflow:hidden;transition:border-color .15s,box-shadow .15s}.ar-composer:focus-within{border-color:var(--ar-accent);box-shadow:0 0 0 2px var(--ar-accent-soft)}.ar-root .ar-composer textarea{display:block;width:100%;min-height:62px;max-height:180px;resize:vertical;border:0;border-radius:0;background:transparent;padding:12px 14px;font-size:12px;line-height:1.7;box-shadow:none}.ar-composer textarea::placeholder{color:var(--ar-faint)}.ar-composer-toolbar{display:flex;justify-content:space-between;align-items:center;padding:3px 8px 7px}.ar-composer-toolbar>div{display:flex;align-items:center}.ar-composer-toolbar>div>span{color:var(--ar-faint);font-size:9px;margin-left:8px}.ar-root .ar-at{font-size:17px}.ar-root .ar-send{width:29px;height:27px;background:#4f46e5;color:#fff;border-radius:5px}.ar-root .ar-send:disabled{background:var(--ar-code);color:var(--ar-faint);opacity:1}.ar-composer-hint{font-size:9px;color:var(--ar-faint);display:flex;justify-content:space-between;margin-top:7px;gap:10px}.ar-working-bar{display:flex;justify-content:space-between;align-items:center;font-size:10px;color:var(--ar-secondary);margin:0 1px 8px;gap:10px}.ar-working-bar>span{display:flex;gap:7px;align-items:center}.ar-working-bar button{font-size:10px;color:var(--ar-danger)}.ar-suggestions{position:absolute;bottom:100%;left:28px;width:310px;max-width:calc(100% - 56px);max-height:240px;overflow-y:auto;z-index:5;background:var(--ar-elevated);border:1px solid var(--ar-line);box-shadow:var(--ar-shadow);border-radius:8px;padding:5px}.ar-root .ar-suggestions button{display:flex;width:100%;justify-content:flex-start;padding:7px 9px;gap:10px;border-radius:4px;font-size:12px}.ar-suggestions button:hover{background:var(--ar-accent-soft)}.ar-suggestions button>span:last-child{font-size:11px;color:var(--ar-faint);margin-left:auto}.ar-file-chips{display:flex;gap:6px;padding:0 12px 8px;flex-wrap:wrap}.ar-file-chips>span{display:flex;gap:6px;align-items:center;font-size:10px;border:1px solid var(--ar-line);border-radius:5px;padding:4px 7px;color:var(--ar-secondary)}.ar-archived-notice{display:flex;align-items:center;gap:9px;font-size:12px;border:1px solid var(--ar-line);background:var(--ar-code);padding:12px;border-radius:6px}.ar-archived-notice button{margin-left:auto;color:var(--ar-accent)}.ar-footer{display:flex;align-items:center;justify-content:space-between;padding:8px 28px;border-top:1px solid var(--ar-line);font:9px/1.5 ui-monospace,SFMono-Regular,monospace;color:var(--ar-faint);flex-shrink:0}.ar-footer>span>span{opacity:.7;margin-left:7px}.ar-footer button{font:10px -apple-system,BlinkMacSystemFont,sans-serif!important}
.ar-welcome{flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:35px;position:relative}.ar-welcome-symbol{color:var(--ar-accent);width:90px;height:90px;display:flex;align-items:center;justify-content:center;border:1px solid var(--ar-line);border-radius:25px;background:var(--ar-sidebar);margin-bottom:28px;box-shadow:0 7px 18px #00000004}.ar-eyebrow{color:var(--ar-faint);font:9px ui-monospace,SFMono-Regular,monospace;letter-spacing:2.5px;margin-bottom:12px}.ar-welcome h1{font-size:25px;font-weight:650;letter-spacing:-.8px}.ar-welcome p{font-size:12px;color:var(--ar-secondary);margin:10px 0 25px;max-width:400px;line-height:1.9}.ar-welcome-steps{display:flex;align-items:center;gap:20px;color:var(--ar-faint);font-size:10px;margin-top:48px}.ar-welcome-steps b{font:9px ui-monospace,SFMono-Regular,monospace;display:block;color:var(--ar-accent);margin-bottom:5px}.ar-menu-wrap{position:relative}.ar-menu{position:absolute;right:0;top:36px;width:190px;padding:5px;border-radius:7px;background:var(--ar-elevated);border:1px solid var(--ar-line);box-shadow:var(--ar-shadow);z-index:13}.ar-menu button{width:100%;justify-content:flex-start;padding:8px;border-radius:4px;font-size:12px;color:var(--ar-secondary)}.ar-menu button:hover{background:var(--ar-hover)}.ar-menu hr{border:0;border-top:1px solid var(--ar-line);margin:4px}.ar-menu-dismiss{position:fixed;inset:0;z-index:12;cursor:default!important}.ar-error{background:var(--ar-elevated);color:var(--ar-danger);border-bottom:1px solid var(--ar-line);padding:10px 14px;font-size:12px;display:flex;align-items:center;justify-content:space-between;gap:10px;overflow-wrap:anywhere;flex-shrink:0}.ar-error>button{flex-shrink:0}
.ar-overlay{position:absolute;inset:0;background:#0005;backdrop-filter:blur(2px);z-index:30;display:flex;align-items:center;justify-content:center;padding:22px}.ar-modal{background:var(--ar-elevated);width:490px;max-width:100%;max-height:100%;overflow-y:auto;border-radius:12px;border:1px solid var(--ar-line);box-shadow:var(--ar-shadow);padding:22px 24px}.ar-modal>header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}.ar-modal h2{font-size:17px;font-weight:650;letter-spacing:-.3px}.ar-modal form{display:flex;flex-direction:column;gap:15px}.ar-modal form>label,.ar-modal .ar-field-row>label{display:flex;flex-direction:column;gap:6px;font-size:12px;color:var(--ar-secondary);font-weight:500}.ar-modal input,.ar-modal textarea,.ar-modal select{width:100%;font-size:12px!important;font-weight:400}.ar-modal textarea{resize:vertical;min-height:100px}.ar-modal input:disabled{opacity:.65}.ar-modal fieldset{border:0;padding:0;margin:0;min-width:0}.ar-modal legend{font-size:12px;color:var(--ar-secondary);margin-bottom:8px}.ar-member-picker{display:grid;grid-template-columns:1fr 1fr;gap:7px;max-height:180px;overflow-y:auto}.ar-member-picker label{border:1px solid var(--ar-line);padding:8px;border-radius:6px;display:flex;align-items:center;gap:7px;cursor:pointer;font-size:11px}.ar-member-picker label:has(input:checked){border-color:var(--ar-accent);background:var(--ar-accent-soft)}.ar-member-picker small{display:block;color:var(--ar-faint);font-size:9px}.ar-root .ar-checkbox{flex-direction:row!important;align-items:center;gap:8px!important;font-size:12px}.ar-field-help{font-size:10px;color:var(--ar-faint);margin-top:-10px!important}.ar-modal form>footer{display:flex;justify-content:flex-end;border-top:1px solid var(--ar-line);padding-top:17px;margin-top:2px}.ar-field-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ar-root .ar-color-label{flex-direction:row;align-items:center;gap:12px}.ar-root .ar-color-label input{width:35px;height:26px;border:0;padding:0;background:none;margin-left:auto}.ar-mobile-back{display:none!important}
@keyframes ar-pulse{0%,100%{opacity:.35}50%{opacity:1}}@media(prefers-reduced-motion:reduce){.ar-root *{animation:none!important;transition:none!important}}
@container (max-width:800px){.ar-header-members{display:none}.ar-manage{display:none!important}}
@media(max-width:1050px){.ar-root{grid-template-columns:235px minmax(0,1fr)}.ar-brand{padding-left:13px;padding-right:10px}.ar-brand small{font-size:9px}.ar-room-header{padding-left:20px;padding-right:20px}.ar-manage{display:none!important}.ar-message{padding-left:22px;padding-right:22px}.ar-room-start{padding-left:22px}.ar-composer-area{padding-left:20px;padding-right:20px}.ar-composer-toolbar>div>span{display:none}.ar-composer-hint>span:last-child{display:none}.ar-run-notice{margin-left:22px;margin-right:22px}}
@media(max-width:720px){.ar-root{grid-template-columns:190px minmax(0,1fr)}.ar-brand{gap:7px}.ar-brand strong{font-size:15px}.ar-brand small{display:none}.ar-brand-icon svg{width:20px}.ar-header-members{display:none}.ar-room-header{gap:7px;padding-left:15px;padding-right:12px}.ar-room-subhead{padding-left:16px}.ar-room-subhead>span:last-child{display:none}.ar-composer-hint{font-size:8px}.ar-welcome h1{font-size:21px}.ar-welcome-steps{gap:12px}.ar-run-notice{flex-wrap:wrap}.ar-run-notice>span{min-width:70%}.ar-modal{padding:18px}.ar-member-picker{grid-template-columns:1fr}}
@media(max-width:520px){.ar-root{display:block}.ar-sidebar{display:none;height:100%;border-right:0}.ar-main{height:100%}.ar-show-list .ar-sidebar{display:flex}.ar-show-list .ar-main{display:none}.ar-mobile-back{display:inline-flex!important}.ar-welcome>.ar-mobile-back{position:absolute;left:15px;top:15px}.ar-room-heading{min-width:0}.ar-room-header{min-height:66px}.ar-channel-icon{display:none}.ar-room-subhead{font-size:9px}.ar-message{gap:9px;padding-left:16px;padding-right:16px}.ar-message>.ar-avatar{width:28px;height:28px;border-radius:7px;font-size:12px}.ar-message-byline strong{font-size:12px}.ar-prose{font-size:12px}.ar-composer-area{padding-left:12px;padding-right:12px}.ar-welcome{padding:24px}.ar-welcome h1{font-size:22px}.ar-welcome-steps{flex-wrap:wrap;justify-content:center}.ar-room-start{padding:25px 16px}.ar-room-start h2{font-size:21px}.ar-modal{padding:16px}.ar-overlay{padding:12px}.ar-member-picker{grid-template-columns:1fr 1fr}.ar-footer{padding-left:15px;padding-right:15px}.ar-date-line{margin-left:16px;margin-right:16px}.ar-archived-notice{flex-wrap:wrap;font-size:11px}.ar-root .ar-modal .ar-color-label input{margin-left:0}}

.ar-root .ar-search input{border:0!important;background:transparent!important;box-shadow:none!important;border-radius:0!important;padding:4px 6px!important}.ar-dialog-error{font-size:12px;color:var(--ar-danger);border:1px solid var(--ar-line);border-radius:5px;padding:9px;margin-bottom:15px;overflow-wrap:anywhere}.ar-root{container-type:inline-size}
@container(max-width:800px){.ar-composer-toolbar>div>span{display:none}.ar-composer-hint>span:last-child{display:none}}
@container(max-width:520px){.ar-sidebar{display:none}.ar-main{grid-column:1/-1;height:100%}.ar-show-list .ar-sidebar{display:flex;grid-column:1/-1}.ar-show-list .ar-main{display:none}.ar-mobile-back{display:inline-flex!important}.ar-header-members,.ar-manage{display:none!important}.ar-room-heading{min-width:0}.ar-run-notice{flex-wrap:wrap}.ar-welcome h1{font-size:21px}.ar-welcome-steps{gap:12px}.ar-welcome>.ar-mobile-back{position:absolute;left:15px;top:15px}}
`;
    document.head.append(style);
    return () => style.remove();
  });
  const openSession = async (sessionId) => {
    await ctx.sessions.refresh();
    const list = ctx.sessions.list.getSnapshot();
    if (list.phase !== "ready" || !list.byId[sessionId]) throw new Error("\u539F\u751F\u4F1A\u8BDD\u5C1A\u4E0D\u53EF\u7528\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5 / Native session is not listed yet");
    ctx.uiWorkspace.openSession(sessionId);
  };
  ctx.effect(() => ctx.slots.inject("main", () => ctx.slots.register({ name: "main", key: "dsh-agentroom", inject: () => ({}) }, () => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(App, { openSession }))));
  ctx.effect(() => ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({ name: "sidebar.panellist", id: "dsh-agentroom", order: 12, label: () => "Agentroom" }, ({ size = 20 }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M4 4h16v12H10l-5 4v-4H4z" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M8 8h8M8 12h5" })
  ] }))));
}

return module.exports;}});
