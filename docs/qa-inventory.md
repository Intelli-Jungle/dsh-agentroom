# QA inventory

User requirements: preserve Agent Teamroom's Slack-like visual language; implement a real installable DSH plugin; use local DSH to validate functionality; save the source to Intelli-Jungle/dsh-agentroom.

| Claim / control | Functional check | Visual evidence |
| --- | --- | --- |
| DSH sidebar plugin | install packed bundle, activate host and client | Native DSH panel screenshot |
| Sessions | create, select, search, rename, edit membership, archive, restore | Empty and populated room, management dialog |
| Members | add/edit identity, role, model and color | Member dialog with actual host model catalog |
| Mention routing | @one, @all, no mention, code/email exclusion | Shared multi-member timeline |
| Native execution | real model request, distinct persistent sessions, open native view | Native session and room result |
| Live work | streamed text, tool names, execution details | Running / settled room |
| Bounded collaboration | explicit reply handoff, shared root allowance | Relay messages / allowance notice |
| Cancellation | stop one / all, no subsequent handoff | Stopped status |
| Error and recovery | native failure shown, restart retains history without replay | Error notice / recovered room |
| Persistence and transfer | atomic writes, lock, malformed data, JSON import/export, Markdown | Imported room archive notice |
| Attachments | text file delivered in member prompt, remove, oversized/binary rejected | Attachment chip / message |
| Theme and language | light/dark, zh/en, persistence | Both themes and languages |
| Viewport / keyboard | desktop 1440×900, 1024×768, mobile 390×844; modal focus, Escape, Enter/Shift+Enter/IME | Screenshots and bounds check |
| Host authentication | unauthenticated and wrong-origin routes refused | Automated HTTP assertions |

Exploratory scenarios: rapid duplicate submission while a member runs; archived-room send; bad imported state; native session error; restart during unfinished work; long code block, member name and room title. Check screenshots for clipping, overlapping controls, weak contrast and unintentional overflow.
