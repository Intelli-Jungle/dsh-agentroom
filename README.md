# DSH Agentroom

在 DeepSeek Harness 里，与多个 Agent 共用一间 Slack 风格的聊天室。

沿用 [Intelli-Jungle/agent-teamroom](https://github.com/Intelli-Jungle/agent-teamroom) 的会话列表、共享消息时间线、`@Agent` 路由、靛蓝强调色和深浅主题，作为 **DSH 原生插件**运行。每个成员在每个房间都有独立、可持续的 DSH Session；模型、工具、权限与审批使用本机 DSH 的配置。

![DSH 原生界面](docs/screenshots/agentroom-light.png)

## 安装

要求：DSH **0.2.1-rc.5（CLI/Web）**或 **0.2.2-rc.1（Desktop）**，已配置可用模型。其他 DSH 版本尚未验证。

从本仓库 [Releases](https://github.com/Intelli-Jungle/dsh-agentroom/releases/latest) 下载 `dsh-agentroom-0.1.1.tgz` 与校验文件，在下载目录执行：

```bash
shasum -a 256 -c dsh-agentroom-0.1.1.tgz.sha256
```

Desktop：打开“插件 → 添加插件”，填入 `.tgz` 的绝对路径，安装并点击“立即启用”。按提示完整退出并重新打开 DSH，然后在左侧选择 **Agentroom**。Desktop profile 由桌面应用管理，不能通过 CLI 修改。

Web 实例请将 profile 换成 `web`，安装后重启该实例：

```bash
dsh plugin --profile web add /绝对路径/dsh-agentroom-0.1.1.tgz
dsh web
```

仓库与 Release 公开，无需 GitHub 登录。也可以使用 Git 来源安装：Desktop 的“添加插件”中输入 `github:Intelli-Jungle/dsh-agentroom#v0.1.1`；Web profile 使用：

```bash
dsh plugin --profile web add github:Intelli-Jungle/dsh-agentroom#v0.1.1
```

仓库提交了预构建的 `dist/`，Git 安装与 `.tgz` 均不需要执行安装期构建脚本。GitHub 访问不稳定时优先下载 Release 安装包后通过本地路径安装。

如需在原生“发现”页浏览：在插件页的实验性插件列表中开启“自定义插件索引”（0.2.1 称“自定义插件市场”），选择“发现 → 添加索引源”，填入：

```text
https://raw.githubusercontent.com/Intelli-Jungle/dsh-agentroom/main/market/index.json
```

索引遵循 DSH format 1，Git 来源固定到发布提交。此索引由 Intelli-Jungle 维护；DSH 不内置任何默认索引源。

从源码开发：

```bash
gh repo clone Intelli-Jungle/dsh-agentroom
cd dsh-agentroom
npm ci
npm run check
npm pack
```

更新 Desktop 上已有版本时，若管理器提示同名包已存在，先卸载旧插件，再安装新版并启用；房间数据保留在独立数据目录。完整重启后确认界面底部版本号为 `v0.1.1`。

## 使用

1. 新建会话，填写名称、已有项目的绝对路径和参与成员。
2. 默认提供 `@planner`、`@coder`、`@reviewer`。点击侧栏成员可以修改角色、模型和头像颜色，也可以添加成员。
3. 输入 `@planner 请拆解这个任务` 分配工作；`@all 请各自评估这个方案` 会并行唤醒所有成员。普通消息只进入共享记录；代码块和行内代码中的提及不触发执行。
4. 成员完成后，文本进入共享时间线。“执行记录”列出工具名，并可打开对应的 DSH 原生会话查看工具详情与审批。
5. 开启“允许 Agent 通过 @ 提及接力”后，成员最终回复里单独一行的明确请求（例如 `@coder 请实现这个方案`）可以启动另一成员；普通进展或引用名字不触发。每条人工消息默认最多 **4 次**自动接力；忙碌成员不会重复启动，跳过与额度耗尽都会显示提示。
6. 可停止单个成员或全部成员，编辑会话、搜索、归档和恢复。会话菜单提供 Markdown / JSON 导出，底部提供 JSON 导入。

文本附件支持文本、Markdown、JSON 与代码文件，最多 4 个、每个 100 KB；内容随当前消息提供给执行成员。图片与二进制附件尚未实现。

导入会话会获得新 ID，清除原生执行关联并以归档状态打开。恢复前会检查本机工作目录存在。已有同 ID 的成员保留本机角色配置，避免导入文件覆盖当前团队。

## 行为与数据

- 同一房间内每名成员每次只执行一个任务；不同成员可以并行。同一成员在不同房间拥有不同的 Session。
- 每次分配会提供近期共享聊天记录。成员的原生 Session 保存自己的持续上下文。
- 角色级模型仅影响该成员的原生 Session，不改写 DSH 全局默认模型；选择“使用 DSH 默认模型”会在下次执行时重新读取默认值。
- 默认数据位于 `$DSH_HOME/dsh-agentroom/state.json`（未设置时为 `~/.dsh/dsh-agentroom/state.json`）。原生工具历史仍由 DSH 保存。
- 状态通过序列化、临时文件和原子重命名保存，并限制一个数据目录同时只能有一个宿主写入。损坏文件不会被自动清空。
- 重启时补读原生会话里已提交的回复；不自动重放结果不确定的模型或工具请求，未完成任务显示“已中断”。
- 接口复用 DSH 的 `connection.requestRejection`，沿用宿主的来源检查和认证；插件没有独立的公开服务端口。
- 权限沿用 DSH `standard` Agent preset，不自动提升权限。遇到工具审批，在对应原生会话中处理。

如需 Desktop 与 Web 同时运行，请给其中一个实例设置不同的 `dataDir`，防止两个进程写同一份文件：

```yaml
# 相应 profile 的 cordis.patch.yml
- id: dsh-agentroom
  config:
    dataDir: /绝对路径/agentroom-web-data
    maxHandoffs: 4   # 0–16；0 关闭自动接力额度
```

本插件使用 DSH 原生会话与模型，不启动外部 CLI/tmux/MCP 桥。独立 CLI Agent 适配、定时消息、长期记忆和后台常驻调度不在本版范围内。原生审批、模型可用性与费用依赖本机 DSH 配置；任务运行依赖宿主进程。

## 开发与验证

```bash
npm ci
npm run check        # TypeScript + integration tests + production bundles
npm pack             # 可安装的预构建插件
```

开发安装请使用独立 DSH_HOME，不把测试记录混入日常会话：

```bash
DSH_HOME="$PWD/work/dsh-dev" dsh plugin --profile web add "$PWD"
DSH_HOME="$PWD/work/dsh-dev" dsh web --no-open --port 3095
```

测试项、实际模型验证和截图见 [验证报告](docs/verification.md)；实现使用的公开服务见 [DSH API 说明](docs/dsh-api.md)。不将单元测试或脚本模型冒充真实模型质量验证。

Apache-2.0。视觉与交互参考 Agent Teamroom；DSH-Bot 仅作为插件结构的参考，未复制其源码。见 [NOTICE](NOTICE)。
