# DSH API notes (0.2.1-rc.5 / 0.2.2-rc.1)

Verified against locally installed published packages, with real Host execution.

| Public surface | Use |
| --- | --- |
| `dsh.bundle.patch` | Insert the Host plugin into a Desktop or Web profile |
| `dsh.client`, `window.__ModuleLoader__.load` | Register a CJS closure-factory client; React is provided by DSH |
| `slots`: `main`, `sidebar.panellist` | Native sidebar entry and main panel |
| `uiWorkspace.openSession`, `sessions.refresh` | Navigate to the member's ordinary native Session |
| `webServer.register` | Same-origin `/agentroom/api` routes, effect-scoped |
| `connection.requestRejection` | Native browser authentication, Host/Origin fence and Desktop IPC trust |
| `sessionController.create`, `resolveAgent`, `rename`, `prompt`, `cancel`, `modelCatalog` | Session lifecycle, execution, cold-safe recovery and model discovery |
| `sessionQuery.readSession` | Cross-version, non-activating full log reads for initial cursors and recovery |
| `agent.model.select` (0.2.2) | Native member-local model selection without saving the default |
| `session/event` | Durable `assistant/message`, `tool/call`, `turn/end` observations |
| `agent/assistant-stream` | Transient `text-delta` display, replaced by committed messages |
| `api-session/error` | Out-of-turn failures |
| `agent.ctx.on`: `system-prompt/assemble`, `agent/request` | Member-local model configuration through public waterfalls |
| `llm.resolveCallConfig`, `agentDefaultModel.currentSelection` | Validate member routes or read the current default |
| `agent.session.append('model/selection', ...)` | Persist the model selected for this member |

`sessionController.create` reuses only a blank Session and can mint a new ID when the named Session has already run. Agentroom therefore calls `resolveAgent` to continue existing sessions and calls `create` only for a missing ID. It records the returned ID instead of assuming creation kept the requested one.

`sessionController.selectModel` also writes the global default. Agentroom deliberately does not use it. On 0.2.2 it uses `agent.model.select`. On 0.2.1, two agent-local public waterfalls apply a validated model snapshot to prompt variables and request routing, without saving global preferences. They run as outer/prepended waterfalls so their result also applies when a native conversation has already installed its own model selector. Model hooks are removed on plugin disposal or Agent disposal.

The Host imports no private DSH implementation path and bundles no duplicate Cordis runtime. Host service references are structural TypeScript interfaces; the only runtime libraries shipped as dependencies are Schemastery and Zod. The native client bundles no platform service and shares the host's React runtime.

Room metadata is plugin-specific and persisted separately because native Sessions do not provide a shared room timeline or per-room member routing. Tool execution, approvals, session history and model providers remain native DSH responsibilities.
