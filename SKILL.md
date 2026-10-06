---
name: dsh-plugin-guide
description: Use when developing, reviewing, packaging, debugging, or answering questions about DeepSeek Harness (DSH) plugins — the plugin-based agent harness on vendored Cordis. Applies the official plugin-development constraints (plugin contract, cordis.yml layers, services/events/effects, tool DSL, bundles/profiles) backed by the dsh-plugin-guide knowledge base.
---

# DeepSeek Harness 插件开发（dsh-plugin-guide）

依据官方资料开发 DeepSeek Harness 插件。本技能是**工作流与约束清单**；事实细节一律引用知识库原文，不凭记忆编造。所有"必须/不得"条款来自官方仓库 `AGENTS.md`、`docs/` 与文档站，冲突时以官方原文为准。

## 知识库位置（按顺序找，用第一个存在的）

本技能与知识库随同一目录分发（本 SKILL.md 所在目录即知识库根），路径均为相对路径；单独复制本文件而不带 `guide/`、`references/` 时按回退路径找。以 `dsh-plugin-guide` 插件（bundle）安装时，技能 resourceBase 即包目录，下文的 `./guide/`、`./references/` 相对路径由 DSH 的 `skill` 工具按此目录解析：

1. **本文件同目录**（= 插件包目录 `dsh-plugin-guide`，或 `scripts/install-skill.ps1` 安装的独立技能目录）：`./guide/`（综合指南+速查表+文档链接索引）、`./references/`（调研报告与官方文档全文副本 `references/official-docs/docs/`）、`./downloads/`（原始下载物，可选，需按 §知识库维护 的脚本生成）
2. 官方仓库 checkout：`D:\deepseek-harness\`（示例路径，按本机实际安装位置调整；`docs/`、`vendor/cordis/`、`packages/`、`examples/`）
3. 线上：https://github.com/deepseek-ai/deepseek-harness 、 https://deepseek-harness.github.io/deepseek-harness/develop/basic/ 、 https://github.com/cordiverse/cordis

下文相对路径默认相对上述第 1 条（本技能文件所在目录）。

## 开发前置（第一步必做）

0. **先认版本**：`dsh --version`。`0.1.7-alpha.1`（2026-09-22）起包含本世代全部破坏性变更（会话格式 V4、settings 重写、`readBytes`、Messages-only 适配器）；npm `latest`=`0.2.0-rc.2`、`alpha`=`0.2.1-alpha.1`，master 最新 tag 是 `dsh-v0.2.1-alpha.1`——**这三个"最新"不是同一个东西**。目标宿主不是最新线时，**先读 `guide/migration-0.2.md`** 按条目对照。
1. 若未读过 Cordis 概念：读 `references/official-docs/docs/cordis-primer.md`（5 个概念，5 分钟）；需要动手跟练时跑 `references/official-docs/docs/cordis-tutorial/` 01-07（无 API key 可跑）。
2. 打开 `guide/quick-reference.md`（契约速查）+ `guide/plugin-dev-guide.md`（完整路径）。官方/社区文档 URL 对照见 `guide/links.md`。排查官方运行时行为/未修复 bug 时查 `guide/unfixed-issues.md`（master 基线源码核实的问题清单 + 已修复提交号 + 设计行为对照 + 本世代新核实的 T1–T11）。决定一个插件**该不该继续维护**（官方已进内核 / 第三方采用度显著更高）时查 `guide/when-to-retire-a-plugin.md`（判据 + 实测倍数表）；判断某个能力面谁领先时查 `guide/choosing-a-plugin.md`。
3. 确认目标扩展点：读 `references/official-docs/docs/architecture.md` 的「Where new behavior goes」表与 `references/official-docs/docs/cookbook/extension-cookbook.md` 的 feature→mechanism 表——**新行为必须挂到已文档化扩展点，不得改 agent-loop**；**用最弱的够用机制**（restrict < guard < waterfall 改写 < system-prompt/assemble）。
4. 要写 UI / 要让 agent 自己装插件时，读 `references/official-plugin-dev-skill.md`（官方自带技能的要点与硬性规定）。

## 必须遵守的插件契约（官方红线，逐条核对）

- 插件 = 模块导出 `name` + `apply(ctx, config)`（+可选 `inject: string[]`）；依赖的服务在 `apply` 前就绪；依赖服务消失会自动卸载、恢复后自动重载。
- **注册即 effect**：一切贡献走 `ctx.effect()` / `ctx.on()` / 服务 `register()`（返回 disposer）；绝不手动 removeListener/clearInterval 式收尾。注册在别的 ctx 上（如 `agent.ctx`）的，**两个拥有者都要留 disposer**。
- **waterfall 监听器必须调用 `next()`**；不调=故意短路（拦截语义）。改写 `agent/pre-step` 决策要**展开**（`{ ...decision, messages }`），否则 `startsRequestSeries` 之类字段会丢。`emit/waterfall/parallel/serial/bail` 语义见速查表。
- **扩展点用"最弱的够用机制"**：`ctx.tools.restrict()`（只移除）< `ctx.tools.guard()`（只拒绝）< waterfall 改写（依赖顺序）< `system-prompt/assemble`（整段替换）。机制越强，越要替其他插件保留贡献。结果只看 `tools/result`；只有要变换结果才用 `tools/post-execute`。
- **模型可见 ⟺ 已记录**：进入模型请求的一切必须能从会话日志重建；新增模型可见输入必须新增 `SessionEventMap` 会话事件（**由宿主侧新增**，见下一条）。
- **绝不要用新的 `type` 追加会话事件**：读方只在事件带信封 `ignorable: true` 时接受未知类型，而运行时 `Session.append()` 写不了该标记——写了会让**整个会话打不开**。插件状态从既有事件推导，或放进 inspection 找到的 storage 服务。
- **`agent.inject()` 的 `source` 不再接受 `{ kind: 'plugin', plugin: '<name>' }`**（会话格式 V4 在消息准入处拒绝）：先 `declare module '@deepseek-ai/dsh-llm' { interface MessageSourceMap { '<your-kind>': { kind: '<your-kind>' } } }` 再用；`inject` 不唤醒（要唤醒用 `followup()` / `steer()`）。
- 类型安全事件/服务用 declaration merging（`declare module '@deepseek-ai/cordis'`）；事件文档标注 `@mode`。
- 配置用 Schemastery `Schema<Config>`（禁止普通对象）；非法配置加载期响亮失败；**不得硬编码可调参数**（判断：cordis.yml 能否改）。要暴露给用户的实时字段用 `Volatile<T>` + `loader/volatile-update`（表单命名空间 = profile 条目 id；settings 已在 0.2 世代重写）。
- 工具走 `defineTool`：`execute` 只返回 `output.schema` 声明的规范 JSON 值；尊重 `exec.signal`；人类可读内容放 `output.render`；UI 卡片 presenter 是**纯函数**（禁 I/O/时钟/随机）。工具 `parameters` 是 **DSH 自己的方言，不是 JSON Schema**；可选钩子 `projectContent()`、`ToolSchema.deferLoading`、`ask.displayReason`。
- **可选服务用 `ctx.get(name)`**；`ctx.<service>` 只对你自己 `inject` 里声明过的服务合法（写未声明的 `ctx` 属性会抛错并可能静默杀掉整个插件的激活）。
- 可替换能力按三层接缝设计：Service Definition / Provider / Consumer；不提前拆。
- 打包：bundle 清单 `"dsh":{"bundle":{"patch":"..."}}`（`patch` **可为有序数组**，每个文件的相对路径按各自目录解析）；覆盖按 `id` 整行替换 config（上游删行后 override **静默失效**，升级后跑 `--dump-config` 查 `patch: entry not found`）；`!!js`（双感叹号）；git 安装需要 `prepare` 脚本与用户侧 `allowBuilds`，发布 npm/tarball 免构建许可。
- **交付必须补展示元数据**：`locale/*.json` 的 `meta.title`/`meta.description` + 导出的 `./icon`（≤256 KiB、realpath 后必须在包内）；子路径插件**不读** `package.json`。
- **共享实例的 dsh 包只放 peerDependencies + devDependencies**，绝不放 dependencies（profile 内副本会静默遮蔽运行时版本，核心服务注册失败）。DSH **不校验** peer 范围，兼容性靠运行时探测。
- **UI 插件**：只渲染 slot 里的 React 组件（禁止 iframe 托管页面）；样式只用 `--dsw-alias-*` 主题 token；不 `require` 任何 Harness Client 包（抛错组件会把整个 slot 搞白）；`dsh.client.inject` **必须是静态数组**；不在组件外写 DOM、不往 `document.body` 追加。
- **性能**：per-session 状态放 `ctx.sessionProjections`（纯同步 apply、忽略即同引用、纯 JSON + `stateVersion`）；等持久事件（`turn/end`/`assistant/message`/`tool/result`），实时 token 读 `agent/assistant-stream`；**不轮询 `agent/status`**。
- **禁止**：在会话运行期间改 profile 的 `cordis.patch.yml`（HMR 会重载，实测丢光 preset 工具、杀掉在途 turn、最坏永久废掉 `sessionController`）；手写 profile 的 `package.json`；在 profile 目录里跑 pnpm。

## 按任务类型的开发路径

（以下路径均在 `references/official-docs/` 下，为官方文档全文副本）

- **新工具**：`docs/user/develop/basic/tool.md`（教程）→ `docs/cookbook/adding-a-tool.md`（完整契约：参数校验、规范值、后台任务 `ctx.jobs`、策略钩子、Code Mode、UI 卡片、`MessageSourceMap` 归属）→ 参考实现 `packages/shell/tool-bash`（本地 checkout）。
- **新服务/能力**：`docs/user/develop/framework/service.md` + `docs/user/develop/practice/`（三层拆分完整代码）。
- **拦截/策略/hook**：`docs/cookbook/extension-cookbook.md`（permission-gate 范例）+ `docs/event-producer-consumer.md`（全事件矩阵）。
- **新 LLM 提供商**：`docs/user/develop/practice/llm-adapter.md`（StreamChunk 协议）。
- **UI 插件（Web）**：`references/official-plugin-dev-skill.md` §3.2 + `docs/subsystems/slots.md`、`sidebar-right.md`、`client-modules.md`、`web-client.md`、`ui-radius.md`；Chat 行业务节点用 `ctx.uiConversation.events.register()` + `conversation.chat.node` slot。
- **插件配置表单**：`docs/subsystems/settings.md`（已改名 "Plugin Configuration Forms"）+ `docs/cookbook/adding-a-settings-card.md`（已重写）。
- **打包/发布**：`docs/user/develop/basic/publish.md`（bundle/profile、层顺序、多 patch 数组、peer 解析、git 安装坑）。
- **升级/迁移**：`guide/migration-0.2.md`（本库综述）→ `docs/upgrade-guide/**`（官方逐版本迁移指南）+ `docs/persistence-changes/**`（持久化类型变更记录）+ `docs/session-format-status.md`（会话格式版本权威）。
- **查服务/事件精确签名**：**优先用会话内 inspection**（`cordis_inspect_list` / `cordis_inspect_query`：Service / Event / Config / Tool / Slots / Theme），其次 `docs/subsystems/*.md` 生成式 Cordis API 区 + `docs/cordis-api/*`；**不要自造第二份静态清单**。站点 URL ↔ 本地副本对照见 `guide/links.md`，社区链接完整清单见 `references/community-ecosystem.md`。
- **官方自带插件开发技能（0.2 世代新增，先读）**：`references/official-plugin-dev-skill.md`（主流程 + 六份分面参考要点 + 模板定位）；上游在 `packages/preset/agent-preset/skills/cordis-plugin-development/**`。它规定的官方路径是：工作区写 bundle → `plugin_manager` `install_bundle`（绝对目录）→ `cordis_inspect_query` 核对，**禁止**手写 profile 的 `package.json`/`cordis.patch.yml`、禁止在 profile 目录跑 pnpm。
- **参考社区实现与实测坑**：`references/community-ecosystem.md`、`references/community-repo-deep-dive.md`（首批 15 个开发仓库深读）、`downloads/community-repos/`（**114 个仓库完整源码副本**，需先跑 `scripts/download-community-repos.ps1` 生成）。社区已确认的机制变化（repository-plugin 0811 移除、bundle vs 纯 cordis 双通道）与实测坑清单在 `guide/plugin-dev-guide.md` §7，源码级问题索引在 `guide/unfixed-issues.md`（含本世代新核实的 T1–T11）。官方 Discussions 全量归档（**2026-10-06 刷新**，含 #1629 官方插件脚手架 RFC）与 npm 全家桶元数据分别在 `downloads/github/harness/discussions/` 与 `downloads/npm/`；中英文社区文章 HTML 快照在 `downloads/web/community-articles/`。

## 验证（交付前）

- 加载验证：**免审批**用 `cordis_inspect_list` / `cordis_inspect_query` 确认新行真的挂上（比 `list_plugins` 快且不需要审批）；同时跑 `dsh --profile <name> --dump-config` 看有没有 `patch: entry <id> not found`。
- **读安装结果**：`plugin_manager` 的 `application` 与 `warnings` 决定改动是否生效——不是日志、进程列表或页面 boot payload。`failed` 要诊断，`overridden` 表示更高优先层胜出，`restart-required` 表示**尚未生效**；**替换**已安装包需要重启才能载入新的 JS 模块代。
- 行为验证：Web UI 或 `dsh --profile headless "…"` 实测；工具返回/模型可见文本即行为，改动必须重测。**安装成功 ≠ 用户看得见**：展示元数据（标题/描述/图标）要按 `references/official-plugin-dev-skill.md` §3.1 的清单核对，无浏览器控制时如实报告"渲染未验证"。
- 仓库内改动额外走：类型检查、目标包测试、keyless snapshot（模型/产品可见行为必须有组装后转录快照）、双语文档成对、Agent Note（非平凡变更同 PR）。
- 独立插件包：`pnpm pack` 后试装到干净 profile 验证（含 `lib/` 构建产物）；本库的 `dsh-plugin-dev verify` 已对齐这条。
- **排障提示**：宿主插件 `apply()` 抛错在 `dsh web` 下**可能完全不可见**（无日志 sink），只表现为工具/监听器静默缺失（见 `guide/unfixed-issues.md` T3）；遇到"装了但没反应"先换 headless 或有日志的 profile 复现。

## 知识库维护（需要时）

- 同步官方文档副本：`pwsh -File ./scripts/sync-official-docs.ps1 [-Checkout <deepseek-harness checkout>]`——只同步 git 已跟踪文件（未跟踪草稿与未推送提交不会进来），并刷新 `references/official-docs/SNAPSHOT.md`；README 的"最后核验"日期与提交号引用 SNAPSHOT.md，不要手改。漂移校验：`pwsh -File ./scripts/check-docs-drift.ps1 -Checkout <checkout>`（快速）或 `pwsh -File ./scripts/verify-kit.ps1 -Checkout <checkout>`（全量）。
- 刷新线上资料：`pwsh -File ./scripts/download-sources.ps1`；刷新社区仓库：`pwsh -File ./scripts/download-community-repos.ps1`；刷新社区文章快照：`pwsh -File ./scripts/download-community-articles.ps1`（三个脚本幂等，产出进 `./downloads/`）。刷新官方 Discussions 归档：`$env:GH_TOKEN=<token>; pwsh -File ./scripts/archive-discussions.ps1`（list.json + 精选线程评论，防缩水保护；**2026-10-06 期：list=5000、精选 1648**）。**注意 REST 分页天花板**：`/discussions` 列表最多翻到 5000 条，而仓库实际 total_count≈8850（GraphQL 口径）——需要更全的历史时按 GraphQL `UPDATED_AT DESC` 补抓。话题清单计数重核：`pwsh -File ./scripts/gen-topic-snapshot.ps1 -OutDir <dir> -MaxPages 10`。
- **维护节奏建议**：官方 3 周内发了 9 个 prerelease，所以"最后核验"日期要跟 tag 走；每次官方发版后按 `references/official-docs/docs/upgrade-guide/**`（**无 index、无入链**，必须主动看）+ `docs/persistence-changes/**` + GitHub Releases 说明三处增量更新 `guide/migration-0.2.md` 与 `guide/unfixed-issues.md`。
- 安装/刷新 agent 技能副本：`pwsh -File ./scripts/install-skill.ps1 -Target <skill目录>`（跳过 downloads/ 与 .github/，逐字节校验）。
- 冲突裁决：与官方文档冲突时以 `references/official-docs/`（官方仓库原文）为准；官方文档与**代码**冲突时以代码/产物为准并**明确标注分歧**（本轮已发现一例：`session-format-status.md` 的发布记录落后于代码与 npm）。

## CLI 工具链（dsh-plugin-dev）

本仓库随 bundle 附带零依赖 CLI `dsh-plugin-dev`，把机械检查自动化（知识库仍是认知层，CLI 是机械层）：

- `dsh-plugin-dev new <name>`：参数化脚手架，生成 TS 或 JS 插件仓库骨架（`src/index.ts` 契约模板、Schemastery Config、tests、tsdown/vitest、注释齐全的 `cordis.patch.yml`、五语 README），模板与 `references/official-docs` 同步更新。
- `dsh-plugin-dev check [--json] [--strict]`：静态检查（`cordis.patch.yml` 合法性、`package.json` 元数据（`dsh.bundle.patch` 指向/peer 依赖/engines/files 白名单）、五语 README 一致性、工程红线模式），输出 CI 可消费的结构化 JSON；每个检查项在输出里引用本知识库对应章节（skill 联动），agent 可继续人工审计。
- `dsh-plugin-dev verify`：`pnpm pack` 后装入干净临时 `DSH_HOME` profile 做安装+启动+卸载冒烟（对齐官方 verify:self-contained）；失败给出日志尾部与建议。

三个子命令均可逆/幂等；网络/子进程尊重超时与 AbortSignal；只清理自己 mkdtemp 的目录。CLI 零运行时依赖，构建产物经 tsdown 打包为单文件 `dist/dsh-plugin-dev.js`。

## 边界

- 本技能是"指引 + 约束 + 资料索引"；机械检查由 `dsh-plugin-dev check` 承担，精确 API 以生成式参考为准。
- 不得修改知识库外的 harness 仓库文件，除非用户明确要求；vendor/ 与 `.agents/notes/archived/` 只读。
- 引用 `downloads/` 内容前先确认其存在（该目录不入 git，需按上文脚本生成）；`awesome-dsh-plugins` 的归档仅供本地参考，**不得随仓库再分发**（其上游声明内部使用约束，见 NOTICE.md）。
