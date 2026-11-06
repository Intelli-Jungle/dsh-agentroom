# 发布方式

本插件采用 DSH 的组合包（bundle）格式，发布预构建代码。`package.json` 声明 `dsh.bundle.patch`、Web 客户端、入口和 `engines.dsh`；`cordis.patch.yml` 插入 `dsh-agentroom`。没有额外的全局服务或安装期脚本。

## 分发

- GitHub 公共仓库与版本标签提供源码和提交的 `dist/`，支持固定标签 / 提交安装。
- GitHub Release 提供由 `npm pack` 生成的版本化 `.tgz` 和 SHA-256 文件；同时提供内容相同的 `dsh-agentroom.tgz` 与对应校验文件，供社区市场使用稳定的 `latest/download/` 地址。支持 Desktop 原生管理器和 CLI Web profile。
- `market/index.json` 遵循 DSH 官方 format 1，使用中英标题与描述、分类、图标、兼容范围，以及固定到发布提交的 Git 来源。用户可主动把该 HTTPS URL 添加为原生“发现”页的索引源。
- `screenshots.json` 在仓库中声明真实运行截图；`assets/icon.png` 用于社区市场卡片。仓库带有 `dsh-plugin` 与 `deepseek-harness` topics。
- Awesome DSH Plugin 的收录通过独立条目 YAML 投稿；其审核与合并由社区维护者决定。新仓库须创建满一天，时间门槛未满足时自动检查会等待后续重跑。

npm 注册表发布不是 DSH 或该社区目录的必需条件。本机 npm 未登录，因此本次使用 GitHub 与预构建 tarball 分发，不声称已发布 npm 包。

## 验证发布物

```bash
npm ci
npm run check
npm pack --ignore-scripts
shasum -a 256 dsh-agentroom-0.1.1.tgz
```

解包后核对 `main`、`exports`、`dsh.bundle.patch`、图标与截图路径存在；从 Release 重新下载并校验，再在独立 `DSH_HOME` 从 tarball 安装、启动和执行真实模型任务。

创建版本标签后运行 `npm run market:index -- <完整发布提交 SHA>` 可重建索引。生成脚本会核对提交中的包名、版本与预构建入口，避免索引安装到错误提交。发布前使用宿主随附的 `@deepseek-ai/dsh-plugin-market-index` 校验索引格式。

## 规范来源

- [DSH 打包与安装插件](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.zh.md)
- [DSH 插件索引与 format 1](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/plugin-market.zh.md)
- [Awesome DSH Plugin 贡献指南](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/main/contributing.md)
