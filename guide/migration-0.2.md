# 迁移到 0.2 世代（migration-0.2.md）

> **适用对象**：所有针对 DeepSeek Harness `0.1.6-alpha.2` 及更早版本开发的第三方插件（bundle / 纯 cordis 插件 / UI 插件 / MCP 配置包）。
> **基线**：本文件对照 `5badb15009ae1756c3afe0ae0cef1faafc290ccc`（tag `dsh-v0.2.1-alpha.1`，2026-10-03，master 最新）核验；区间起点为 `ddefc45fbc7f8e46dd73185e68295696d1297887`（tag `dsh-v0.1.6-alpha.2`，2026-09-17）。
> **权威优先级**：官方 `docs/upgrade-guide/**`（原文副本 `references/official-docs/docs/upgrade-guide/`）> 本文件 > 社区文章。官方每一条"next release removes X"都对应本文件的一节。
> 事实核实方式：源码 `path:line` + 提交号，全部可在 `D:\deepseek-harness`（或你的 checkout）复核；无法核实的项已标注 `UNVERIFIED`。

## 0. 先做这三件事

1. **确认你的宿主版本**。`dsh --version`；`0.1.6-alpha.2` 及以前 = 旧基线，`0.1.7-alpha.1` 起 = 已含本文件全部破坏性变更（会话格式 V4 从 `c36a83ff6b` 即 `dsh-v0.1.7-alpha.1` 起）。
2. **跑一次 `dsh --profile <name> --dump-config`**，看有没有 `patch: entry <id> not found` 警告——这是本世代最容易踩的静默失效（插件行被上游删掉/改名后，你的 override 不再命中任何行，且**不报错**）。
3. **按下面的表逐项对照**。破坏性变更集中在四块：会话格式 V4、settings 重写、invariants 删除、客户端 slot / Remote API 改名。

## 1. 版本与发布线（先认清"最新"是哪一个）

| 问题 | 答案（2026-10-06 核验） |
|---|---|
| master 最新 tag | `dsh-v0.2.1-alpha.1`（2026-10-03，`5badb15`） |
| npm `latest` dist-tag | `0.2.0-rc.2`（**不是** master 最新 tag） |
| npm `alpha` / `next` | `alpha`=`0.2.1-alpha.1`、`next`=`0.2.0-rc.2` |
| 区间内发布线（9 个） | `0.1.6-alpha.2`(09-17) → `0.1.7-alpha.1`(09-22) → `0.1.5-rc.3`(09-22) → `0.1.7-alpha.2`(09-22) → `0.1.7-rc.1`(09-23) → `0.1.7-rc.2`(09-24) → `0.2.0-rc.1`(09-28) → `0.2.0-rc.2`(09-29) → `0.2.1-alpha.1`(10-03) |
| Node 门槛 | `^22.19.0 \|\| >=24.0.0`，**区间内未变**（无 `.nvmrc`/`.node-version` 文件） |
| `dsh.version` 字段 | **不存在**。DSH 的包清单只有 `dsh.bundle` / `dsh.profile` / `dsh.client` 三组键 |
| 官方发布说明在哪 | 仓库里**没有 `CHANGELOG.md`**、也没有 `docs/persistence-changes/releases/*` 新条目，所以逐版本说明只在 GitHub **Releases** 的 body 里（`gh release view <tag>` 或 Releases API）。本文件的每一条都对照过 tag `dsh-v0.1.7-alpha.1` / `dsh-v0.2.0-rc.2` / `dsh-v0.2.1-alpha.1` 的发布说明 |

**官方 0.1.7-alpha.1 发布说明里点名的四条插件必改**（原文"其他变更"段）：Session 日志升级 V4、工作区文件读取统一为 `readBytes`（旧接口必须迁移）、官方 DeepSeek 适配器**只用 Messages API**（移除 Chat Completions 与 `protocol` 选项）、设置改由当前 Profile 的插件配置保存（旧 `settings.yaml` 只尝试导入一次）。同版本还改了：Agent 预设改由插件组合包声明/安装（旧目录预设需迁移）、组合包支持按序多 patch、插件可声明"无需重载的配置字段"、新增 `--dump-config-schema`、插件可用 locale 声明多语言标题描述 + `package.json` 图标。

**官方 0.2.1-alpha.1 的两条破坏性变更**（原文）：移除运行时 invariant 插件及各包的 `./invariant` 导出；输入区统计扩展拆为 `activity` 与 `usage` 两个独立入口（**覆盖旧 `stats` 整行的插件必须改注册 ID**）。同版本：子路径插件不再读独立 `package.json`；插件管理页新增「让 Agent 创建插件」；实验性 Claude Code Mods 兼容层。

**npm 陷阱（最贵的一条）**：库包（`dsh-tools`、`dsh-base`、`dsh-headless`、`dsh-session-persistence-jsonl`、`dsh-session`、`dsh-settings`、`dsh-workflow` …）的 `latest` 至今钉在 **`0.0.1-rc.1`**。写 `"@deepseek-ai/dsh-session": "latest"` 会装到远古版本；必须写死版本或钉 `next`/`alpha`。唯一的例外是 CLI 包 `@deepseek-ai/dsh`（`latest`=`0.2.0-rc.2`）。

**跨线 peer 范围**：`^0.1.x` 与 `^0.2.x` 互不覆盖，要同时支持两条线必须写两侧范围。⚠️ **peer 范围会被安装期强制**（本节早期版本写成"DSH 不校验范围"，已更正）：`dsh plugin add` 会拿运行时的版本去比插件声明的 peer 范围，不匹配就**拒绝安装**并把声明的范围原样打印出来。跨线支持因此必须**在范围里同时列出两侧的 prerelease 元组**（每个元组一个 clause），否则 0.2.x 宿主装不上——详见 [plugin-dev-guide.md](plugin-dev-guide.md) §7.3 的 `dsh-plugin` 段。范围之外仍要配**运行时特性探测**，因为范围只能表达"能不能装"，表达不了"某个 API 在不在"。

## 2. 会话格式 V3 → V4（影响最深，涉及历史日志）

| 事实 | 值 |
|---|---|
| `SESSION_FORMAT_VERSION`（旧基线 `ddefc45`） | `3` |
| `SESSION_FORMAT_VERSION`（`c36a83ff6b` = `dsh-v0.1.7-alpha.1` 及之后） | **`4`**（`packages/core/session/src/types.ts`） |
| 首次写入 V4 的 tag | `dsh-v0.1.7-alpha.1`（2026-09-22）——**你本机装的 0.1.7-alpha.2 CLI 已经在写 V4** |
| 转换包 | `@deepseek-ai/dsh-session-format-v3-to-v4`（npm 自 `0.1.7-alpha.1` 起） |
| 官方 `docs/session-format-status.md` 的记录 | `latestFinalizedVersion: 4` 但 `latestReleasedVersion: 3`（evidenceTag `dsh-v0.1.5-alpha.1`）——**与代码和 npm 不一致**；官方文档自己写明"缺少发布记录不等于未发布"，按 **V4 已发布** 处理 |

对插件作者的后果：

- **V3 读方拒绝 V4 日志**。任何自己解析 `session.v*.jsonl.zstd` 的插件，遇到 0.1.7+ 写的日志必须先经 V3→V4 转换，不能"读到就 fold"。
- **tool 结果不再是 content block**：V4 把 user-role 里的 `tool-result` 提升为 **tool-role 消息**（必填 `toolCallId`，可选 `isError`），并从 content-block union 中移除。同时新增 `developer/message` 事件、`turn/end.reason: 'forked'`、`request/header.system` 键被**禁止**（旧日志里的该键会被读方拒绝）。
- **message source 改为生产者自有**：旧的 plugin wrapper 被 producer-owned `source.kind` 取代（含冻结的改名表与冲突规则；PTC 生产者写 `source.kind: 'ptc-mode'`）。迁移保留每个已准入事件与坐标，未知生产者归属**保留全部自有 JSON 属性**。
- 迁移是**非破坏性**的：写打开会在不改动前代文件的前提下发布当前后继；已存在的 V4 文件不会重跑该转换边。V4 内部的兼容性变更只能通过新的 acknowledgement 记录，**破坏性变更必须再 bump 写入版本**，不能复用 3→4 这条边。
- 只读用法：`docs/persistence-changes/2026-09-16-session-format-v4.md`（原文副本）、`docs/session-format-status.md`、`packages/session/session-format-v3-to-v4/README.md`。

**插件实践**：要同时支持两条线，就要能处理**两种事件形态**（V3 的 user-role tool result + V4 的 tool-role 消息）；更稳的做法是**别自己解析日志**——用 `ctx.sessionPersistence` / session projection / `session/event` 监听，把版本差异留给宿主。

## 3. Settings 全面重写（第三方插件最大的破坏点）

`packages/settings/settings-file` 被**整体删除**（36 文件、+1203/−4107），`ctx.settings` 换了类型。

| 旧（≤ `0.1.6-alpha.2`） | 新（≥ `0.1.7-alpha.1`） |
|---|---|
| `@deepseek-ai/dsh-settings` + `@deepseek-ai/dsh-settings-file`（文档 provider，`$DSH_HOME/settings.yaml`） | `@deepseek-ai/dsh-settings` + **`@deepseek-ai/dsh-config-editor`**（直接编辑 Cordis patch） |
| `ctx.settings` = 用户文档注册表 | `ctx.settings` = `SettingsForms extends Service`（`static inject = ['configEditor','profileContext']`） |
| `register(ns, schema, opts)` / `installSection(...)` | **已删除**——表单由 profile 条目的 `Config` schema **自动派生** |
| `SettingsScope<T> = { get, watch, update, replace }` | **已删除** |
| `SettingsRegisterOptions = { base, applies: 'live'\|'restart', validate }` | **已删除**，`applies` 恒为 `'live'` |
| — | `configure({ auto? }, owner?)`、`describe(options?)`、`update(ns, patch, expectedRevision?)`、`replace(ns, section, expectedRevision?)`、`mutate(ns, ops, expectedRevision?)`、`writable`、`documentPath`、`prepareDocument()` |
| — | 事件 `settings/document-updated`；错误 `SettingsConflictError`（`code: 'SETTINGS_CONFLICT'`） |
| 客户端 `ctx.settingsScope`、slot `settings.plugin.item` | **删除** → slot `settings.plugins.tab` |

新机制要点：

- **表单命名空间 = profile 条目 id**（不是插件名）：同一插件挂两行、id 不同 → 两张表单。
- **普通（非 volatile）字段不进表单**，只有 `Volatile<T>` 字段会。`Volatile<T>` 来自 `@deepseek-ai/cordis`，schema 写法 `z.<type>().volatile()`；读用 `.get()`，跨字段校验用 `.check()`，变更监听 `loader/volatile-update`。
- 旧 `$DSH_HOME/settings.yaml` 会**一次性导入**当前 profile，然后重命名为 `settings.yaml.imported`；被当前组合拒绝的 section 只留在那个改名文件里。
- 只读用法：`docs/subsystems/settings.md`（已改名 "Plugin Configuration Forms"）、`docs/cookbook/adding-a-settings-card.md`（已重写，标题 "Cookbook: live configuration forms"）。

## 4. 运行时 invariants 全部删除

- `@deepseek-ai/dsh-invariants` 包、`ctx.invariants` 服务、`InvariantRegistry` / `InvariantInstaller` / `InvariantFailure` / `InvariantError`、以及**每个 `<package>/invariant` 子路径导出**都已不存在；整棵 `packages/runtime-diagnostics/` 被删。
- `sdk-minimal` profile 里五行（`invariants`、`session-invariant`、`agent-invariant`、`scope-invariant`、`agent-loop-invariant`）消失：**仍指向这些 id 的 patch 会打印 `patch: entry <id> not found`**（不报错，只是不生效）。
- 四个 emitter 从"重抛"改为"记录并继续"：`credentials/reference-updated`、`credentials/record-updated`、`authorization/settled`、`llm/adapters-updated`。**靠 `INVARIANT` 异常做失败传播的插件必须换成自己的通道。**
- `docs/subsystems/invariants.md` 是区间内**唯一被删除的官方文档**，动作内容搬到了 `docs/upgrade-guide/v0.2.0-rc.2/remove-runtime-invariants/guide.md`。

## 5. Bundle / 清单格式

- `dsh.bundle.patch` 现在接受**有序数组**：`{ "patch": ["./base.patch.yml", "./web.patch.yml"] }`，按序作为同一层应用，且每个文件里的相对插件路径**相对该文件所在目录**解析。校验失败信息：`dsh.bundle.patch must be a file path or a list of file paths`。
- 层顺序未变：`dsh.profile.bundles` 顺序 → profile 自己的 `cordis.patch.yml` → `$DSH_HOME/cordis.patch.yml` → 各 `--patch`（argv 顺序）。**按 id 覆盖时整段 `config` 被替换，不做深合并。**
- 包清单还可以声明 `dsh.manifestVersion`（格式标识，当前 `1`，与 npm 版本、会话格式版本无关）与 `engines.dsh`（作者声明的兼容范围，**当前安装器/加载器都不强制**——真正会被强制的是 `@deepseek-ai/dsh-*` 的 **peerDependencies**，安装期即拒绝不匹配者，见 [plugin-dev-guide.md](plugin-dev-guide.md) §7.3）。类型定义见 `@deepseek-ai/dsh-package-manifest`。
- 展示元数据契约（Plugin Manager / Settings 在**不激活插件**的前提下读取）：包根读 `package.json` 的 `name`/`description`/`icon`，或导出 `./locale/*.json` 的 `meta.title`/`meta.description` 与 `./icon`；图标支持 SVG/PNG/JPEG/WebP，**≤ 256 KiB 且必须落在包内**（绝对路径、URL、指向包外的 symlink 都被拒）。子路径插件**永远不读** `<subpath>/package.json`——标题/描述走 `locale/*.json` 的 `meta.*`，图片走导出的 `<subpath>/icon`。
- `dsh.client` 键**未变**：`platform`（web）、`inject`（仅排序，不是 cordis 服务注入）、`immediately`（一阶段预取）、`external`（基线与注入边之外的精确模块请求）。但客户端半侧只挂在**说明符恰为裸包名**的那一行上：把一个包拆成多行的组合包，其 UI 只随根行启停。

## 6. 组合行变化（会让旧 override 打空）

`packages/bundle/base/cordis.patch.yml` 本次删/增的行：

| 删除的行 `name` | 新增的行 `name` |
|---|---|
| `@deepseek-ai/dsh-llm-deepseek` | `@deepseek-ai/dsh-llm-deepseek-api-key` |
| `@deepseek-ai/dsh-settings-file` | `@deepseek-ai/dsh-llm-deepseek-account` |
| | `@deepseek-ai/dsh-authorization` |
| | `@deepseek-ai/dsh-deepseek-account-platform` |
| | `@deepseek-ai/dsh-config-editor` |
| | `@deepseek-ai/dsh-settings` |
| | `@deepseek-ai/dsh-otel` |

**Web 组合新增 preset 分叉**：`packages/bundle/web-app/presets/{standard,minimal,ptc,cordis}.patch.yml`。行集**因 preset 而异**——`standard`/`cordis`/`ptc` 声明时钟读取与四个 `schedule_*` 工具，`minimal` **两者都没有**。假设"Web 组合行集固定"的插件要改成按 preset 探测。

**可选用 bundle 的两次反向变动**（都在本区间）：

1. `v0.1.7-rc.2`：`web-app` 曾带 `time-context`/`schedule`/`ui-schedule`（`disabled: true`），"Automation tasks" 可选 bundle `@deepseek-ai/dsh-experimental-schedule-bundle` 负责插入它们。
2. `v0.2.0-rc.2`：该 bundle **又被撤掉**；`web-app` 自己挂 `schedule` + `ui-schedule`，时钟行归 preset。加载 profile 时会自动把该 bundle 从 `dsh.profile.bundles` 移除并重写 `package.json`；**针对 `time-context` 的顶层 override 不再命中任何行**。

## 7. 客户端（UI 插件）破坏点

**Slot 变化**：新增 `plugins.bundle.config`、`plugins.bundle.activation`、`plugins.add.actions`、`plugins.detail.actions`、`plugins.detail.badge`、`plugins.detail.section`、`conversation.input.activity`、`conversation.header`、`conversation.header.leading`、`shell.bottom`、`shell.leading`、`shell.quota-notice`、`sidebar.workspaces.session.menu.item`、`sidebar.workspaces.session.row.action`；**删除** `conversation.session.header.leading`（位置由 `conversation.header.leading` 接管）、`settings.plugin.item`（→ `settings.plugins.tab`）。

**workspace-files Remote（UI 插件直接受影响）**：

| 旧 | 新 |
|---|---|
| `readAll` / `readRelated`（RPC 回调，返回解码后的字节结果） | **`readBytes(path, { range?, baseFile? })`**，经 Connection 二进制 RPC 返回原生 `Uint8Array` |
| `read(path, { offset?, limit? })` | 未变 |
| `changes()`（工作区级） | **`changes(path)`**（单目标；目录被限制在工作区内） |
| `list(path)` | 未变 |

`DocumentPreviewProps` 相应新增 `addResource` / `setResources` 依赖回调；`baseFile` 用于从另一文件目录解析相对目标。

**右侧栏（sidebar-right）新增**：`keepMounted`（跨隐藏/切会话/停靠惰性保留已访问 body）、`tab.actions.bindCommands(commands)` / `SidebarRightTabCommands`（目前是可选 `refresh`）、`tab.refreshShortcut`、`focusedTarget(element?)`、`commandTarget(element?)`、`SidebarRightTarget` + `isTargetCurrent(target)`。保留语义也变了：根作用域的 `rightbar` 为当前会话与已初始化 `keepMounted` 的后台会话**各留独立座位**，重载会恢复保存的布局（旧行为是全部回到折叠默认）。

**其它客户端新增**：客户端服务 `ctx.jobs`（`IJobs`，基于 `ClientJobsModel`）+ `ctx.jobController` + `remote.job.{list,follow,kill}`；workspaces follow 流新增 `pinned` 增量，已归档会话设置页被侧栏 `ArchivedFilter` 取代。

**输入区统计的注册 ID 变化（0.2.1-alpha.1 官方破坏性变更）**：原来一个 `stats` 入口被拆成 **`activity`** 与 **`usage`** 两个独立扩展入口。任何"整行覆盖旧 `stats`"的插件必须改成分别注册/覆盖这两个 ID，否则统计区无声消失。

**客户端条目的激活语义（血泪案例）**：`dsh.client` 的 `inject` **必须是静态数组**——cordis 不接受函数形式的 `inject`。曾有一个 0.2.0 插件把 `inject` 导出成函数，结果声明为零依赖 → `apply()` 抛 `cannot get property "sidebarRightTabs" without inject` → 日志只留一行 `web boot: 1 entry did not activate` → **插件自愈机制把整个 bundle 禁用了**（快照落在 `.dsh/recovery/`），这才让桌面端下次能启动。教训：单测要断言"`inject` 是数组且覆盖 `apply()` 触及的每个服务"，并对着一个 cordis 等价语义的严格 `ctx` 跑。

**另一个高频坑**：`apply()` 里往 `ctx` 上写**未声明**的属性会抛错，并可能静默杀掉整个插件的激活；可选服务一律用 `ctx.get(name)`，**不要**用 `ctx.<name>`（`ctx.<service>` 只对你自己 `inject` 里声明过的服务合法）。Remote 服务调用是**位置参数**不是对象参数（`get()` 能用，最有欺骗性）；工具 `parameters` 是 DSH 自己的方言，**不是 JSON Schema**。

## 8. 工具 DSL 的新增项（无改名）

| 符号 | 变化 |
|---|---|
| `ToolDefinition.projectContent?(exec, result): ContentBlock[] \| undefined` | **新增**：在 `tools/post-execute` 策略**之前**安装执行期准备好的内容；策略的替换仍然权威；绕过 post-execute 的管线失败不会调用它 |
| `ToolSchema.deferLoading?: true` | **新增**标记，会经 `schemaOf()` 进入模型可见 schema |
| `PreToolDecision` 的 `ask` 变体 | **变化**：`{ kind:'ask'; reason?: string }` → `{ kind:'ask'; reason?: string; displayReason?: { readonly en: string; readonly [locale: string]: string } }`。`reason` 是审计用的批准理由，`displayReason` 是本地化的提示文案 |
| `MessageSourceMap` 增强点 | **新增**（`@deepseek-ai/llm`）；tool registry 声明 `'tool-registry': { kind: 'tool-registry' }` |

### 8.1 `agent.inject()` 的 source 包装被退役（V4 拒绝）

```ts
// ❌ 旧写法：`kind: 'plugin'` 这个 catch-all 已被删除
agent.inject({ content, source: { kind: 'plugin', plugin: 'my-plugin' } })

// ✅ 新写法：先声明合并自己的 kind，再用它
declare module '@deepseek-ai/dsh-llm' {
  interface MessageSourceMap { 'my-plugin': { kind: 'my-plugin' } }
}
agent.inject({ content, source: { kind: 'my-plugin' } })
```

`MessageSourceMap` 现在只有 `user` / `model` / `tool` / `system-prompt` 四个内建成员（`packages/llm/llm/src/message.ts:110-115`），插件 kind 靠声明合并加入；V4 在消息准入处拒绝旧的 `{ kind: 'plugin', plugin: … }` 包装（官方 `docs/cookbook/adding-a-tool.md:49` 原文警告）。`agent.inject()` 本身只是 `send(input, 'next-step', false)`（`packages/core/agent-loop/src/agent.ts:171`）——不唤醒；要唤醒用 `followup()`（下一回合）或 `steer()`（下一步）。

## 9. 官方新增的插件可挂能力

| 能力 | 一句话 | 挂点 |
|---|---|---|
| OTel 上报（`docs/subsystems/otel.md`） | 普通事件与 Session 日志通道的共享工厂；自带传输与 SDK 批处理，未使用时**不分配** provider/transport，通道之间不共享队列 | `ctx.otel`：`createEventReporter(options)` / `createSessionLogReporter(options)`；**消费者必须在自己 fiber 释放时 drain 通道**。包 `packages/telemetry/otel`（`packages/telemetry` 为新区） |
| 产品遥测（`docs/subsystems/product-telemetry.md`） | 只发显式选定的分析事件，**不自动采集** Session 数据或标识 | `ctx.productAnalytics`（`ProductTelemetry`）；Desktop 消费者在 `packages/client/product-analytics`，普通 Web 客户端不采集 |
| 语音输入（`docs/subsystems/voice-input.md`，实验） | 三角色（Definition / SenseVoice Provider / Remote Consumer）+ 可选 bundle | Host 侧 `SpeechProvider` / `SpeechProviderId` / `SpeechSpec` / `transcribe()`；浏览器侧 `TranscriptionRequest`，并挂新 slot `conversation.input.activity` 与 `plugins.bundle.activation` |
| Claude Code mods（`docs/subsystems/claude-code-mods.md`） | 让 Claude Code mod 以 DSH 插件形式运行，并逐条列出与 Claude Code 2.1.287 的差异 | `defineMod({ name, version, root, userConfig, register })`，作为 `cordis.yml` 一行挂在 bridge 之后；类型从 `@deepseek-ai/dsh-experimental-claude-code-mods` 导入。**官方原文安全提示：mod 不加沙箱，只挂你愿意当插件运行的 mod**（hooks 模块拥有 Node 全局与进程全部权限） |
| 插件配置表单（`docs/subsystems/settings.md`） | 见 §3 | `ctx.settings` + `Volatile<T>` + `loader/volatile-update` |
| 圆角规范（`docs/ui-radius.md`） | 按组件角色/尺寸取统一圆角的样式契约 | 无代码缝，UI 插件照做 |
| 反向代理部署（`docs/user/guide/public-deployments.md`） | `dsh --profile web --public-url … --trusted-host …` | 不是插件挂点，但决定客户端插件里的 URL 怎么写 |

## 10. 官方新增的"插件开发"一等公民资料（务必先读）

DSH 自带的 preset 里有一整套**官方插件开发技能**，这是本世代最重要的新增资料：

| 文件 | 内容 |
|---|---|
| `packages/preset/agent-preset/skills/cordis-plugin-development/SKILL.md` | 官方权威流程：在工作区写 bundle → `plugin_manager` `install_bundle`（传绝对目录）→ 用 `cordis_inspect_query` 查精确 API。**明确禁止**手写 profile 的 `package.json`/`cordis.patch.yml`、禁止在 profile 目录里跑 pnpm |
| `.../references/host-plugin.md` | bundle 清单、展示元数据与图标清单、Host 导出形态、安装/启用/观察 |
| `.../references/ui-plugin.md` | `dsh.client`（`platform`/`immediately`/`inject`）、客户端懒工厂、slot 注册、主题与本地化 |
| `.../references/practices.md` | **插件实践总纲**：会话日志唯一真源、注册即 effect 的所有权、扩展点"用最弱的机制"排序、稳定性、性能（session projections）、UI 规则 |
| `.../references/mcp-bundle.md` | 纯配置 bundle 接 MCP server（`streamable-http` / `stdio`，`failOnStartupError: true`） |
| `.../references/user-actions.md` | 同一操作双调用方（UI 动作 + agent 工具）；授权类动作必须**仅限用户** |
| `.../references/verification.md` | 无浏览器控制时的页面/面板设计核查 |
| `.../templates/{decoration,mcp}/**` | 可直接复制的 UI 插件与 MCP bundle 模板（含 locale 与 icon） |
| `.../skills/cordis-composition-reference/SKILL.md` | Loader patch 方言 + 可安装插件包清单 |
| `.../skills/editing-cordis-compositions/SKILL.md` | agent preset 组合的编辑流程 |

会话内可直接用 `cordis_inspect_list` / `cordis_inspect_query` 查**精确**服务方法、事件 `@mode`、已挂插件的 `Config` JSON Schema、可用 Tool、实时 Client Slot 树与主题 token——比读文档更权威。

## 11. 升级检查单

- [ ] `dsh --version` ≥ `0.1.7-alpha.1`（要 V4），或明确停留在 `0.1.6-alpha.2` 及以前并锁死。
- [ ] `dsh --profile <name> --dump-config` 无 `patch: entry … not found`。
- [ ] 删掉所有 `@deepseek-ai/dsh-invariants` / `<pkg>/invariant` 的 import 与行；失败传播换成自己的通道。
- [ ] `ctx.settings.register/installSection`、`SettingsScope`、`applies: 'restart'` 全部替换为 `SettingsForms` + `Volatile<T>`；把要暴露的字段标成 volatile。
- [ ] UI：`settings.plugin.item` → `settings.plugins.tab`；`conversation.session.header.leading` → `conversation.header.leading`；`readAll`/`readRelated` → `readBytes`；`changes()` → `changes(path)`。
- [ ] 自己解析会话日志的代码：处理 V4 tool-role 消息、`developer/message`、`turn/end.reason: 'forked'`；或改为消费 `session/event` / projection。
- [ ] 不再用新 `type` 追加会话事件（见 §2 与 `guide/plugin-dev-guide.md` §3.5 红线）。
- [ ] 补展示元数据：`locale/*.json` 的 `meta.title`/`meta.description` + 导出的 `./icon`（≤ 256 KiB、包内），并核 `files` 白名单。
- [ ] 若把 patch 拆成多文件：改成 `dsh.bundle.patch` 数组，确认每个文件里的相对路径按各自目录解析。
- [ ] 若覆盖 `schedule` / `time-context` / `ui-schedule` / `schedule_*`：按 §6 核对 preset 分叉与 bundle 撤并。
- [ ] 依赖里没有 `"latest"` 形式的 `@deepseek-ai/*`（库包 `latest` 仍是 `0.0.1-rc.1`）。
- [ ] peer 范围覆盖两条线（如 `>=0.1.2-rc.1 <0.3.0`），并知道它**不被校验**——关键兼容靠自己探测。
- [ ] `pnpm pack` 后装进干净 `DSH_HOME` profile 冒烟（`dsh-plugin-dev verify` 已对此对齐）。

## 12. 已知分歧与未核实项（诚实标注）

1. **官方会话格式发布记录与代码/npm 矛盾**：`docs/session-format-status.md` 写 `latestReleasedVersion: 3`，而 `SESSION_FORMAT_VERSION` 自 `dsh-v0.1.7-alpha.1` 起为 4 且转换包已上 npm。按 V4 已发布处理（代码与 npm 一致），但记录本身未更新。
2. `UNVERIFIED`：未解包已发布的 npm tarball 逐字节确认产物与 tag 一致。
3. `UNVERIFIED`：仓库内无 `CHANGELOG.md`、无 `docs/persistence-changes/releases/*` 新条目，因此**没有官方逐版本 release notes 可引**；tag 对应的提交主题是唯一线索。
4. `ctx.agent` 在两个基线都**不存在**（不是"被移除"）。
5. 官方 `docs/upgrade-guide/` **没有 index、也没有任何入链**（`docs/AGENTS.md`、README、脚本都不引用）——靠本文件与 `SKILL.md` 做入口。
6. `packages/` 的改名检测在大 diff 下会被 git 跳过，因此"新增包"清单可能把改名当成新增。

---

*维护：官方每次发版后重跑 `pwsh -File scripts/sync-official-docs.ps1`，再按 `references/official-docs/docs/upgrade-guide/**` 与 `docs/persistence-changes/**` 增量更新本文件；行号与提交号引用 `references/official-docs/SNAPSHOT.md` 的基线。*
