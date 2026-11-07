# 视频制作与验证记录

提交位置：[zhangyanan110199-art/dsh-agentroom](https://github.com/zhangyanan110199-art/dsh-agentroom)。fork 仅用于提交权限；视频、README 和包元数据中的安装来源保持 Intelli-Jungle 原仓库。v0.2.0 CLI 增强等待上游合并，未宣称上游已发布该版本。

## 安装与上手

- 成片：女声 `getting-started.mp4`（2 分 20 秒），男声 `getting-started-male.mp4`（2 分 14 秒）。均为 1920 × 1080、30 fps、H.264 / AAC。
- 界面：真实 DSH Web 0.2.1-rc.5，隔离数据目录，Agentroom 0.2.0。
- CLI：本机 Codex CLI 0.167.0-alpha.3.2。聊天、持续会话和三个成员的并行回复均来自真实请求，没有预写模型回复。
- 安装画面为说明卡；后续画面为实际浏览器操作录屏。等待已剪辑；配置镜头适度放慢。
- 旁白提供 Microsoft Edge 的 `zh-CN-XiaoxiaoNeural` 女声与 `zh-CN-YunxiNeural` 男声，通过 [edge-tts](https://github.com/rany2/edge-tts) 合成，替换初版 macOS Tingting 系统语音。两版脚本相同，均为 AI 合成配音。
- 两种音色均使用 +6% 合成语速与口语化讲解。每片一次合成完整旁白，音轨连续播放；根据逐句时间戳安排切镜头，不在每个小步骤之间插入额外静音或黑场。全片音轨使用两遍响度归一化，目标 -16 LUFS。
- 上手片沿着一次产品发布讨论展开；狼人杀片沿着身份、冲突、追问与投票展开，并各自以用途回顾收尾。画面使用本次实际录屏，按旁白适度调整播放速度。
- 发音与字幕分开处理：`@` 合成为英文 `at`；`Agentroom` 按 `Agent room` 两个词合成；`JSON` 通过 `Jason` 按 /ˈdʒeɪsən/ 合成。字幕保留 `@planner` / `@all`、Agentroom 和 JSON 的原拼写，不直接使用发音替换后的文本。
- 烧录字幕与独立 SRT 均改为逐句旁白，由语音时间戳对齐；封面和画面沿用实际录屏，没有加入背景音乐。
- 按章节抽取帧检查文字、裁切和布局；整片执行解码检查。上手片另按每个操作镜头的 20%、50%、80% 位置检查界面亮度，确认没有切到深色主题。
- CLI 集成提供 DSH、Codex、Claude Code 三种成员执行方式。Codex 使用只读沙箱；Claude 禁用工具及外部 MCP。Claude Code 2.1.319 已通过真实回复、同一 Session 续接与四人混合局验证。

## 本地复用

- 对外视频始终面向最终用户，讲安装、角色分工、共享讨论和结果复用；制作过程、提交权限与合并进度留在开发文档中。安装卡使用项目安装入口，避免在自制片头和说明卡上固定发布版本号。
- Codex、Claude Code 用作演示选取的 Agent 示例。长期使用的视频围绕协作方式展开，可变化的接入清单由项目文档维护。
- 上手视频独立讲解安装与协作，不交叉预告狼人杀。操作界面始终使用浅色主题；接力设置与导出使用同一真实会话重新录制的浅色镜头，录制时过滤掉其他房间。片头、片尾及字幕外框沿用品牌配色。
- `getting-started.zh-CN.srt` / `getting-started-male.zh-CN.srt`：两种音色各自的时间轴字幕；狼人杀同样分别提供。
- `getting-started-cover.png`：文章与 README 封面。
- `getting-started-timeline.json` / `getting-started-male-timeline.json`：女声与男声的章节、旁白、音色、语速及原始录屏剪辑时间点；狼人杀同样分别提供。原有无后缀 MP4 链接继续指向女声版。
- `scripts/videos/narrate.py`：生成神经网络配音及逐句时间戳，按整片文本与音色参数缓存到 `work/narration/`，可读取 `HTTPS_PROXY` / `HTTP_PROXY`。仅发送公开旁白文本。
- `scripts/videos/render.py`：本次视频的本地合成脚本，读取整片配音及逐句时间戳，处理全片响度、镜头衔接、烧录字幕及 SRT；依赖见 `scripts/videos/requirements.txt`。字体沿用 macOS Hiragino Sans GB / Avenir Next。源录屏位于制作机器的忽略目录 `work/recordings/`，未随 npm 插件分发。
- MP4 文件保存在 Git 仓库中，npm 插件包排除 MP4，避免安装时携带宣传视频。

在制作机器上重配与合成（需要原始录屏）：

```bash
python3 -m pip install -r scripts/videos/requirements.txt
python3 scripts/videos/narrate.py docs/videos/*-timeline.json
for timeline in docs/videos/*-timeline.json; do
  python3 scripts/videos/render.py "$timeline"
done
```

## 功能验证

`npm run check` 通过 TypeScript、18 项测试和生产构建。新增测试覆盖 JSONL 分块解析、重连后成功、Claude 认证错误、取消、缺少可执行文件、跨后端与跨房间会话隔离、混合接力、导入去除执行身份、重启后不重放 CLI 请求。

实际 Codex 测试：首次请求记住“蓝鲸”，续接同一 CLI Session 后正确回答暗号；DSH 插件内的 Planner 单独回复、Planner / Coder / Reviewer 并行回复均完成。

协议参考：[Codex 非交互模式](https://learn.chatgpt.com/docs/non-interactive-mode)。实际参数另外以本机 `codex exec --help`、`codex exec resume --help`、`claude --help` 核对。

## Codex × Claude 狼人杀

- 成片：女声 `werewolf.mp4`（2 分 05 秒），男声 `werewolf-male.mp4`（2 分 00 秒），围绕设置、矛盾、追问、投票和结果连续讲解。
- 四名玩家、两种 CLI：P1 / P3 使用 Claude Code，P2 / P4 使用 Codex CLI。每名玩家有独立持续会话。
- 简化的一夜规则：一狼、一预言家、两村民；不设夜间击杀；预言家在自己的角色指令中获得“P3 为好人”的查验结果。两轮公开讨论后投票，最高票出局，平票则并列最高票者全部出局，出局者含狼人则好人获胜。
- 角色分配与规则由主持人设定；各 CLI 的公开发言和投票由模型真实生成，没有预写回复或指定胜负。共享时间线不提供所有人的角色指令；这是一场角色扮演演示，不是对抗性隐藏信息安全实验。
- 实际剧情：P1（Claude 狼人）悍跳预言家，声称 P3 是狼；P2（Codex 真预言家）指出 P3 是好人；P4 追问相互矛盾的身份解释。
- 实际投票：P1→P2，P2→P1，P3→P1，P4→P1。P1 以 3 票出局，好人获胜。
- `werewolf-transcript.md` 与 `werewolf-session.json` 保留完整公开对话、角色配置和执行记录，可用于文章引用与复盘。导入 JSON 会清除旧执行关联并以归档状态打开；导入前若 `/tmp/agentroom-demo` 在本机不存在，请先在 JSON 中把 `room.cwd` 改为已存在的绝对路径，再导入并恢复。
- 成片剪掉模型等待时间，保留创建 Room、规则、两轮发言、投票和揭晓。封面、字幕、旁白与剪辑时间点一并保存。
- 本机浏览器使用系统代理而 CLI 未继承代理，最初导致登录 403。给登录进程及 DSH 宿主提供现有 `HTTPS_PROXY` / `HTTP_PROXY` 后，官方登录与真实请求成功；没有修改认证机制或复用网页登录 cookie。
