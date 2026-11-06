# 验证记录 · 2026-11-06

## 环境

- macOS / Apple Silicon。
- 已安装 CLI：`@deepseek-ai/dsh 0.2.1-rc.5`，在独立 `DSH_HOME` 的 Web profile 验证，未导入用户原有会话。
- 已安装 DeepSeek Harness Desktop：内置 DSH 运行时 `0.2.2-rc.1`。通过原生插件管理器安装 `.tgz`、启用并完整重启。
- 插件：首轮 `dsh-agentroom 0.1.0`；第二轮为发布版 `0.1.1`。使用真实 DeepSeek 模型配置，没有脚本模型替代实际模型请求。

## 自动化检查

`npm run check`：TypeScript、**11 项测试**与生产构建全部通过。

覆盖：鉴权、完整提及路由、代码和邮件排除、普通进展不触发自动接力、并行独立 Session、同成员持续会话、重复提交、忙碌拒绝、接力共享额度、停止后不再接力、归档拒绝发送、错误原因保留、导入去除执行身份、单写入锁、原子保存、损坏数据保留、崩溃后的已提交回复恢复，以及两个版本的成员模型选择。

## 实际 DSH 验证

| 项目 | 结果与证据 |
| --- | --- |
| Web 原生插件加载 | PASS：DSH 侧栏出现 Agentroom；原生主面板加载，浏览器无 pageerror |
| 双成员并行 | PASS：Planner / Reviewer 分别在独立 Session 回复“Agentroom 连接成功” |
| 原生文件工具 | PASS：Coder 调用 `read` 读取测试工作区中的文件，得到 `7 + 5 = 12` |
| 自动接力 | PASS：Coder 的独立请求行 `@reviewer 请确认等式正确` 唤醒 Reviewer；Reviewer 核验后回复等式正确 |
| 三成员与附件 | PASS：`@all` 加真实文本附件触发三个成员，各自给出职责说明；附件进入原生提示词 |
| 持续上下文与成员模型 | PASS：同一 Planner Session 从 V4-Pro 切换到 V4.1-Flash 后回复成功；核对原生 `request/header` 分别为 `deepseek-v4-pro` 与 `deepseek-flash`，宿主模型目录的默认值仍为 V4-Pro |
| 原生会话导航 | PASS：展开执行记录后可打开对应 Session，显示提示词、真实回复及所用模型；Web 与 Desktop 均验证 |
| Desktop 安装 / 启用 / 重启 | PASS：使用原生插件管理器完成；CLI 明确拒绝直接修改 Desktop profile，因此文档采用桌面安装流程 |
| Desktop 替换与数据保留 | PASS：卸载旧构建、安装修复构建并重启后，原房间和记录保留；已安装 Host / Client 文件 SHA-256 与本仓库 `dist/` 一致 |
| Desktop 双成员真实请求 | PASS：修复构建上的 Planner / Reviewer 均回复“DSH Desktop 协作验证成功”，均显示完成 |
| Desktop 原生工具与接力 | PASS：最终“协作演示”房间内，Coder 使用 `read` 读取同一测试文件并输出 `7 + 5 = 12`，随后 Reviewer 自动接力并确认正确；两名成员均显示完成 |

Desktop 首次运行发现其内置版本高于 CLI：0.2.2 删除了 `sessionController.inspect`。最终实现统一采用公开 `sessionQuery.readSession`；0.2.2 使用公开 `agent.model.select`，0.2.1 使用会话级公开 waterfall。另修正了原生 `openSession` 参数应为 Session ID 字符串的兼容问题。问题均在真实运行后复验。

## 界面与异常路径

通过 Playwright 驱动真实 DSH Web，验证了 **15 组交互**：搜索；会话设置；JSON 导出；Markdown 导出；归档与恢复；导入后保持归档；成员创建；Escape 取消编辑；非法 JSON 导入拒绝；原生任务停止；手机会话导航；Shift+Enter、IME 输入保护及普通消息不触发模型；过大附件拒绝；不存在的目录在对话框中显示错误；真实 DSH 来源鉴权拒绝跨源请求。

亮 / 暗色、中文 / 英文均检查；语言和主题选择会持久保存。检查了 1440×900、1024×768、390×844。插件无横向溢出；会话标题、主要操作、编辑器和发送按钮均在可视区域。聊天历史使用内部滚动，不会把输入区挤出窗口。未发现插件区域的控件重叠、文字遮挡或页面级横向滚动。Desktop 上其他已安装插件的悬浮宠物仍可能遮盖内容，属于宿主现有的浮层行为。

- [亮色实际界面](screenshots/agentroom-light.png)
- [深色与英文](screenshots/agentroom-dark.png)
- [1024 像素窗口](screenshots/agentroom-1024.png)
- [手机布局](screenshots/agentroom-mobile.png)

这些检查证明已列功能在上述本机环境可运行，不代表所有模型、所有任务质量、其他版本或其他平台都已验证。外部 CLI Agent、图片附件、定时任务和长期记忆未实现。

## 发布前第二轮验证

1. 从 GitHub Release 重新下载 `0.1.0` 的 tarball 与校验文件，SHA-256 通过。在全新独立 `DSH_HOME` 中从该 tarball 安装，原生侧栏与主面板加载正常。
2. 人工消息只提及 Coder。Coder 使用原生 `read` 读取验收文件，回复 `7 + 5 = 12` 和 `RELEASE-VERIFY-PASS`，再通过独立请求行自动交接 Reviewer；Reviewer 也使用原生 `read` 后回复 `REVIEW-VERIFY-PASS`。两个执行均完成，无浏览器运行错误。
3. 将同一隔离环境升级至 `0.1.1` 并重启，房间与之前的回复保留。通过界面发送 `@all`，Planner、Coder、Reviewer 三个原生 Session 分别完成并回复 `AGENTROOM-0.1.1-PASS`，没有额外接力。
4. 实际 Desktop 卸载旧包、安装 `0.1.1`、启用、完整退出后重新打开。原房间与对话保留，Planner 的真实请求完成并回复 `DESKTOP-0.1.1-PASS`。
5. `npm run check` 再次通过全部 11 项测试与生产构建。Zod 升级至 `4.6.7` 后重新检查，`npm audit` 与生产依赖检查均为零已知告警。
6. 解包 `0.1.1` 发布物，核对主入口、全部 exports、bundle patch、图标、截图声明对应文件存在；没有 `preinstall`、`install`、`postinstall` 或 `prepare` 安装钩子。

发布与社区收录方式见 [发布说明](publication.md)。

正式 Release 重新下载、全新安装、原生发现页和社区投稿的结果见 [v0.1.1 发布后复验](release-verification-0.1.1.md)。
