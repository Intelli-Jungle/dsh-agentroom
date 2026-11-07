# 视频制作与验证记录

## 安装与上手

- 成片：`getting-started.mp4`，1920 × 1080，30 fps，H.264 / AAC，约 2 分 20 秒。
- 界面：真实 DSH Web 0.2.1-rc.5，隔离数据目录，Agentroom 0.2.0。
- CLI：本机 Codex CLI 0.167.0-alpha.3.2。聊天、持续会话和三个成员的并行回复均来自真实请求，没有预写模型回复。
- 安装画面为说明卡；后续画面为实际浏览器操作录屏。等待已剪辑；配置镜头适度放慢。
- 旁白使用 macOS Tingting 中文系统语音合成；字幕、封面和编排由本次制作生成。没有背景音乐或第三方素材授权依赖。
- 按章节抽取帧检查文字、裁切和布局；整片执行解码检查。
- CLI 集成提供 DSH、Codex、Claude Code 三种成员执行方式。Codex 使用只读沙箱；Claude 禁用工具及外部 MCP。Claude 的成功调用尚待本机登录后复验；不能将其协议测试当作真实模型验证。

## 本地复用

- `getting-started.zh-CN.srt`：时间轴字幕。
- `getting-started-cover.png`：文章与 README 封面。
- `getting-started-timeline.json`：章节、旁白、字幕及原始录屏剪辑时间点。
- `scripts/videos/render.py`：本次视频的本地合成脚本，依赖 Python Pillow、imageio-ffmpeg，以及 macOS `say` / `afinfo`。源录屏位于制作机器的忽略目录 `work/recordings/`，未随 npm 插件分发。
- MP4 文件保存在 Git 仓库中，npm 插件包排除 MP4，避免安装时携带宣传视频。

## 功能验证

`npm run check` 通过 TypeScript、18 项测试和生产构建。新增测试覆盖 JSONL 分块解析、重连后成功、Claude 认证错误、取消、缺少可执行文件、跨后端与跨房间会话隔离、混合接力、导入去除执行身份、重启后不重放 CLI 请求。

实际 Codex 测试：首次请求记住“蓝鲸”，续接同一 CLI Session 后正确回答暗号；DSH 插件内的 Planner 单独回复、Planner / Coder / Reviewer 并行回复均完成。

协议参考：[Codex 非交互模式](https://learn.chatgpt.com/docs/non-interactive-mode)。实际参数另外以本机 `codex exec --help`、`codex exec resume --help`、`claude --help` 核对。
