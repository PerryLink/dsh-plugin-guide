---
name: dsh-plugin-guide
description: Use when developing, reviewing, packaging, debugging, or answering questions about DeepSeek Harness (DSH) plugins — the plugin-based agent harness on vendored Cordis. Applies the official plugin-development constraints (plugin contract, cordis.yml layers, services/events/effects, tool DSL, bundles/profiles) backed by the dsh-plugin-guide knowledge base.
---

# DeepSeek Harness 插件开发（dsh-plugin-guide）

依据官方资料开发 DeepSeek Harness 插件。本技能是**工作流与约束清单**；事实细节一律引用知识库原文，不凭记忆编造。所有"必须/不得"条款来自官方仓库 `AGENTS.md`、`docs/` 与文档站，冲突时以官方原文为准。

## 知识库位置（按顺序找，用第一个存在的）

本技能与知识库随同一目录分发（本 SKILL.md 所在目录即知识库根），路径均为相对路径；单独复制本文件而不带 `guide/`、`references/` 时按回退路径找：

1. **本文件同目录**：`./guide/`（综合指南+速查表）、`./references/`（调研报告与官方文档全文副本 `references/official-docs/docs/`）、`./downloads/`（原始下载物，可选）
2. 本机主副本：`D:\deepseek-harness\Project\Plugins\dsh-plugin-guide\`
3. 官方仓库 checkout：`D:\deepseek-harness\`（`docs/`、`vendor/cordis/`、`packages/`、`examples/`）
4. 线上：https://github.com/deepseek-ai/deepseek-harness 、 https://deepseek-harness.github.io/deepseek-harness/develop/basic/ 、 https://github.com/cordiverse/cordis

下文相对路径默认相对上述第 1 条（本技能文件所在目录）。

## 开发前置（第一步必做）

1. 若未读过 Cordis 概念：读 `references/official-docs/docs/cordis-primer.md`（5 个概念，5 分钟）；需要动手跟练时跑 `references/official-docs/docs/cordis-tutorial/` 01-07（无 API key 可跑）。
2. 打开 `guide/quick-reference.md`（契约速查）+ `guide/plugin-dev-guide.md`（完整路径）。
3. 确认目标扩展点：读 `references/official-docs/docs/architecture.md` 的「Where new behavior goes」表与 `references/official-docs/docs/cookbook/extension-cookbook.md` 的 feature→mechanism 表——**新行为必须挂到已文档化扩展点，不得改 agent-loop**。

## 必须遵守的插件契约（官方红线，逐条核对）

- 插件 = 模块导出 `name` + `apply(ctx, config)`（+可选 `inject: string[]`）；依赖的服务在 `apply` 前就绪；依赖服务消失会自动卸载、恢复后自动重载。
- **注册即 effect**：一切贡献走 `ctx.effect()` / `ctx.on()` / 服务 `register()`（返回 disposer）；绝不手动 removeListener/clearInterval 式收尾。
- **waterfall 监听器必须调用 `next()`**；不调=故意短路（拦截语义）。`emit/waterfall/parallel/serial/bail` 语义见速查表。
- **模型可见 ⟺ 已记录**：进入模型请求的一切必须能从会话日志重建；新增模型可见输入必须新增 `SessionEventMap` 会话事件。
- 类型安全事件/服务用 declaration merging（`declare module '@deepseek-ai/cordis'`）；事件文档标注 `@mode`。
- 配置用 Schemastery `Schema<Config>`（禁止普通对象）；非法配置加载期响亮失败；**不得硬编码可调参数**（判断：cordis.yml 能否改）。
- 工具走 `defineTool`：`execute` 只返回 `output.schema` 声明的规范 JSON 值；尊重 `exec.signal`；人类可读内容放 `output.render`；UI 卡片 presenter 是**纯函数**（禁 I/O/时钟/随机）。
- 可替换能力按三层接缝设计：Service Definition / Provider / Consumer；不提前拆。
- 打包：bundle 清单 `"dsh":{"bundle":{"patch":"..."}}`；覆盖按 `id` 整行替换 config；`!!js`（双感叹号）；git 安装需要 `prepare` 脚本与用户侧 `allowBuilds`，发布 npm/tarball 免构建许可。

## 按任务类型的开发路径

（以下路径均在 `references/official-docs/` 下，为官方文档全文副本）

- **新工具**：`docs/user/develop/basic/tool.md`（教程）→ `docs/cookbook/adding-a-tool.md`（完整契约：参数校验、规范值、后台任务 `ctx.jobs`、策略钩子、Code Mode、UI 卡片）→ 参考实现 `packages/shell/tool-bash`（本地 checkout）。
- **新服务/能力**：`docs/user/develop/framework/service.md` + `docs/user/develop/practice/`（三层拆分完整代码）。
- **拦截/策略/hook**：`docs/cookbook/extension-cookbook.md`（permission-gate 范例）+ `docs/event-producer-consumer.md`（全事件矩阵）。
- **新 LLM 提供商**：`docs/user/develop/practice/llm-adapter.md`（StreamChunk 协议）。
- **UI/会话节点**：`docs/cookbook/adding-a-conversation-node.md` + `docs/subsystems/session.md`、`client-modules.md`。
- **打包/发布**：`docs/user/develop/basic/publish.md`（bundle/profile、层顺序、git 安装坑）。
- **查服务/事件精确签名**：`docs/subsystems/*.md` 生成式 Cordis API 区 + `docs/cordis-api/*`；**不要自造第二份静态清单**。
- **参考社区实现与实测坑**：`references/community-ecosystem.md`、`references/community-repo-deep-dive.md`（15 个开发仓库深读）、`downloads/community-repos/`（完整源码副本，需先跑 `scripts/download-community-repos.ps1` 生成）。社区已确认的机制变化（如 repository-plugin 0811 移除、bundle vs 纯 cordis 双通道）与 20 个实测坑（cordis 双副本/tsconfig 三件套/多帧 zstd/Windows junction 等）在 `guide/plugin-dev-guide.md` §7。

## 验证（交付前）

- 加载验证：`dsh --profile <name> --dump-config` 检查 patch 行是否生效；启动日志无 FAILED。
- 行为验证：Web UI 或 `dsh --profile headless "…"` 实测；工具返回/模型可见文本即行为，改动必须重测。
- 仓库内改动额外走：类型检查、目标包测试、keyless snapshot（模型/产品可见行为必须有组装后转录快照）、双语文档成对、Agent Note（非平凡变更同 PR）。
- 独立插件包：`pnpm pack` 后试装到干净 profile 验证（含 `lib/` 构建产物）。

## 知识库维护（需要时）

- 刷新线上资料：`pwsh -File ./scripts/download-sources.ps1`；刷新社区仓库：`pwsh -File ./scripts/download-community-repos.ps1`（两个脚本幂等，产出进 `./downloads/`）。
- 同步官方文档副本：`Copy-Item -Recurse <checkout>\docs .\references\official-docs\docs`。
- 冲突裁决：与官方文档冲突时以 `references/official-docs/`（官方仓库原文）为准。

## 边界

- 本技能是"指引 + 约束 + 资料索引"，不是脚本/清单的机械执行；精确 API 以生成式参考为准。
- 不得修改知识库外的 harness 仓库文件，除非用户明确要求；vendor/ 与 `.agents/notes/archived/` 只读。
- 引用 `downloads/` 内容前先确认其存在（该目录不入 git，需按上文脚本生成）；`awesome-dsh-plugins` 的归档仅供本地参考，**不得随仓库再分发**（其上游声明内部使用约束，见 NOTICE.md）。
