# DeepSeek Harness 仓库文档调研

> 调研对象：本地完整 checkout `D:\deepseek-harness`（只读）+ 公开仓库 `https://github.com/deepseek-ai/deepseek-harness`。
> 结论来源以本地仓库文档为准；每条事实标注具体文件路径或 URL。本地 checkout 未覆盖或无法核实的内容标注 `[unverified]`。

DeepSeek Harness（DSH）是一个**基于 vendored Cordis 框架的插件式 agent harness**，公开宣传语为 **"Everything is a Plugin"（一切都是插件）**（见 GitHub 仓库标题 `deepseek-ai/deepseek-harness: DeepSeek Harness: Everything is a Plugin.`）。模型适配器、工具注册表、会话日志、甚至 agent loop 本身都是插件，因此每一部分都能从配置替换。

---

## 1. 整体架构：一切皆插件

### 1.1 核心主张

`docs/architecture.md` §Cordis 开门见山：

> [Cordis](official-docs/docs/cordis-primer.md) is the framework under dsh: plugins contribute services, typed events, and reversible effects to a shared context. Every part of the product is a plugin, including the model adapter, the tool registry, the session log, and the agent loop itself, so every part is replaceable from configuration.

> There is no privileged core to patch: you extend dsh by mounting a plugin beside the others, and registrations are effects that unwind when their plugin unloads.

来源：`D:\deepseek-harness\docs\architecture.md`（L11–L13）。

### 1.2 框架层：vendored Cordis

Cordis 框架以**源码 vendored（拷贝）**方式进入 monorepo，而非 npm 依赖，目的是让 harness 完全拥有自己的框架层（可审计、可补丁、可固定版本）。所有 vendored 包被重命名为 `@deepseek-ai` scope（`cordis` → `@deepseek-ai/cordis`，`@cordisjs/plugin-<x>` → `@deepseek-ai/cordis-plugin-<x>`）。

来源：`D:\deepseek-harness\vendor\README.md`（L1–L7）。

vendored 清单（`vendor/README.md` §Manifest，L13–L24）：

| 目录 | npm 名 | 上游名 | 版本 | 上游仓库 |
|---|---|---|---|---|
| `cosmokit/` | `@deepseek-ai/cosmokit` | cosmokit | 1.8.1 | github.com/deepseek-harness/cosmokit |
| `schemastery/` | `@deepseek-ai/schemastery` | schemastery | 3.18.0 | github.com/deepseek-harness/schemastery |
| `cordis/` | `@deepseek-ai/cordis` | cordis | 4.0.0-rc.7 | github.com/cordiverse/cordis |
| `loader/` | `@deepseek-ai/cordis-plugin-loader` | @cordisjs/plugin-loader | 1.0.0-rc.5 | github.com/cordiverse/cordis |
| `include/` | `@deepseek-ai/cordis-plugin-include` | @cordisjs/plugin-include | 1.0.4 | github.com/deepseek-harness/cordis |
| `group/` | `@deepseek-ai/cordis-plugin-group` | @cordisjs/plugin-group | 1.0.0 | github.com/deepseek-harness/cordis |
| `timer/` | `@deepseek-ai/cordis-plugin-timer` | @cordisjs/plugin-timer | 1.1.2 | github.com/deepseek-harness/cordis |
| `hmr/` | `@deepseek-ai/cordis-plugin-hmr` | @cordisjs/plugin-hmr | 1.0.15 | github.com/deepseek-harness/cordis |
| `logger-console/` | `@deepseek-ai/cordis-plugin-logger-console` | @cordisjs/plugin-logger-console | 1.0.0 | github.com/deepseek-harness/cordis |

（08-14 核查：`deepseek-harness/cordis` 已 404，`deepseek-harness` org 的 fork 仓库不再公开可访问；其源码以 harness 仓库 `vendor/` 内的 vendored 副本为准。）

`vendor/README.md` 还记录了一份 exhaustive 的**本地修改日志（18 条）**，其中对插件作者最重要的是：
- `cordis/src/fiber.ts` lifecycle hardening（effect 创建在 owner 处于 `UNLOADING` 时被拒绝；`PENDING`/`LOADING` 时合法）（L38，条目 6）。
- Loader/Include 事务化配置调和、`!!js` 延迟解析（L40 条目 8、L47 条目 15）。
- `include` 的 `applyEntryPatches(data, patches, warn)` 与 `entryListSchema` 被导出，供 `dsh --dump-config` 精确重放 patch 算法（L43 条目 11）。
- `disabled` 字段插值（L50 条目 18）。

### 1.3 仓库布局

根 `AGENTS.md` §Repository layout（工作区 `D:\deepseek-harness\Project\Plugins` 之外只读）给出了完整布局。要点：

```
vendor/      Vendored Cordis 源码
packages/    @deepseek-ai/dsh-<pkg> workspaces，位于 packages/<group>/<pkg>/
  core/        session, system-prompt, tools, agent, agent-loop（产品 API 主干）
  api/         远程 BFF 组装 + Typert RPC 网关
  typert/      类型图生成器/加载器/运行时注册表
  llm/         LLM 能力：Service Definition/Consumer + DeepSeek providers
  shell/       bash 能力：Service Definition + local/pwsh providers + shell Consumers
  subprocess/  subprocess 能力 + local 进程树 provider
  fs/          filesystem 能力 + policy
  lsp/         language-server 能力
  skill/       skill provider registry + local 实现 + catalog/loader tool
  web/         web 能力：Service Definition + search/fetch providers + tool Consumer
  compaction/  compaction 能力 + basic provider
  context/     请求上下文插件
  subagent/    subagent 能力 + providers + delegation Consumers
  bundle/      可安装的 dsh --profile patch-layer 包（base/web-app/headless）
  workflow/    workflow 能力 + worker-thread provider + tool Consumer
  todo/        todo_write tool
  plan/        plan mode（logged state）
  preset/      从 preset cordis.yml 做每会话 agent 组装
  guard/       loop-hygiene + tool-timeout 插件
  self-modification/  agent 检查/挂载自己的插件
  hooks/       Claude Code/Codex hook 桥 + wire 协议库
  session/     持久会话数据：persistence/projection/titles/telemetry
  identity/    匿名身份
  settings/    用户设置能力 + file provider
  credentials/ credential-reference 能力 + env/.env provider
  acp/         automation-only Agent Client Protocol server
  interaction/ approval/interaction 能力、permission、commands、ask-user
  boot/        共享 app-bin glue
  sdk/         JSON-RPC 协议、server、TypeScript client
  examples/    demo bundles（agent-spine + CLI/ACP/JSON-RPC bins）
  support/     dev/test 基础设施
  util/        零依赖工具
python/      Python SDK + bundled runtime（见 python/README.md）
native/      @deepseek-ai/node-addon-landlock-run 源码来源（见 native/README.md）
examples/    可运行的 cordis.yml leaves（挂载在 packages/examples bundles 上）
.agents/     Agent workflows 与 Agent Notes（notes/）
docs/        architecture、generated catalogs、postmortems、cookbook
scripts/     仓库门禁与生成器
website/     VitePress 投影选中的双语 docs/ 源
```

来源：`D:\deepseek-harness\AGENTS.md` §Repository layout（也见 `D:\deepseek-harness\CLAUDE.md` 的 symlink 说明：`CLAUDE.md` 是 `AGENTS.md` 的软链接）。

### 1.4 用户插件放在哪里

三类"叶子"（leaf）都在 `examples/` 下，是**可运行的 Cordis 组装**，不是 build target：

- `examples/headless-agent/` — 一次性 headless coding agent（挂 `@deepseek-ai/dsh-agent-spine-demo`）
- `examples/acp-agent/` — ACP 自动化 server（挂 `@deepseek-ai/dsh-acp-demo`）
- `examples/jsonrpc-agent/` — JSON-RPC（挂 `@deepseek-ai/dsh-sdk-jsonrpc-demo`）
- `examples/mcp-memory/`、`examples/web-cordis/`、`examples/web-schedule/` — 其它演示叶子

来源：`D:\deepseek-harness\docs\cookbook\extension-cookbook.md` §Runnable wirings（L91–L93）、`D:\deepseek-harness\examples\AGENTS.md`。

`examples/AGENTS.md`（L1–L5）规定：
- `examples/` 是一个 workspace 成员，是**可运行/测试 Cordis 配置的模块解析根**，不是 build target。
- `examples/package.json` 声明这些配置加载的包；每个 leaf 自己的 `package.json` 只是元数据。
- 可复用逻辑抽到 `packages/`（那里有 per-file coverage 和 README 门禁）；examples 只保留 `cordis.yml` 布线、demo 产物、e2e/snapshot 场景。

**用户自建插件**的推荐路径见 `docs/user/develop/basic/` 教程序列：`index.md`（第一个插件）→ `tool.md`（建工具）→ `config.md`（配置）→ `publish.md`（打包成 bundle 安装进 profile）。用户本地插件通过 `--patch ./scratch-plugin/cordis.yml` overlay 挂载（`docs/user/develop/basic/tool.md` L43 的 `pnpm dsh web --patch ./scratch-plugin/cordis.yml`）。

### 1.5 Profiles 与 bundles

`docs/architecture.md` §Profiles and bundles（L15–L37）是权威定义：

- **profile**：命名组装，存于 Harness home（`$DSH_HOME/profiles/<name>`）。它列出自己堆叠的 bundles、持有的 out-of-tree 插件，以及用户自己的 `cordis.patch.yml`。`web` 与 `headless` 是内置模板。
- **bundle**：Cordis 配置行及其挂载代码的**分发格式**；它插入的内容能被其上方的层继续 patch。
- 两者都在自己的 `package.json` 里通过 `dsh` 字段自声明：`dsh.profile` 列出 profile 的 bundles，`dsh.bundle` 指向 bundle 的 patch 文件。

内置 bundle（`docs/architecture.md` L25）：
- [`dsh-base`](../packages/bundle/base/README.md) — 每个 profile 的第一层：模型适配器、工具、持久化、sandbox/approval 策略、settings、credentials、telemetry。
- [`dsh-web-app`](../packages/bundle/web-app/README.md) — 加浏览器应用。
- [`dsh-headless`](../packages/bundle/headless/README.md) — 加一次性 runner（无 server）。

**层应用顺序**（`docs/architecture.md` L27）：每个 profile 按列出顺序的 bundle → profile 的 `cordis.patch.yml` → home 级 `$DSH_HOME/cordis.patch.yml` → 每个 `--patch` overlay。patch 按 `id` 定位一行并**整体替换其 config**，或插入新行。

查看实际启动树：`dsh --profile web --dump-config`（L33）。

`docs/user/develop/basic/publish.md` 用可运行例子补齐了两个 manifest 的具体形状：

bundle manifest（`dsh.bundle`）：
```json
{ "name": "dsh-hello-plugin", "version": "0.1.0", "type": "module",
  "main": "index.js", "files": ["index.js", "cordis.patch.yml"],
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } } }
```
profile manifest（`dsh.profile`）：
```json
{ "name": "dsh-profile-demo", "private": true,
  "dependencies": { "dsh-hello-plugin": "link:/path/to/hello-plugin" },
  "dsh": { "profile": { "bundles": ["@deepseek-ai/dsh-base", "dsh-hello-plugin"] } } }
```

关键语义（`publish.md` L112–L128）：层顺序 = ①profile `dsh.profile.bundles` 列表顺序（`@deepseek-ai/dsh-base` 第一）→ ②profile 自身 `cordis.patch.yml` → ③home 级 `$DSH_HOME/cordis.patch.yml` → ④每个 `--patch <path>`（按 argv 顺序）。**靠后的层按行取胜；patch 替换整行 config 而非深合并 key**。安装命令 `dsh plugin --profile <name> add <package>` 转发给 pnpm（L77–L101）。

### 1.6 核心包（`ctx` 键）

`docs/architecture.md` §Core packages（L43–L51）：

| Package | Owns | `ctx` key |
|---|---|---|
| `core/session` | append-only `SessionEvent` log + 内存 store | `ctx.sessions` |
| `core/system-prompt` | prompt-section 与 tool-schema 组装 | `ctx.systemPrompt` |
| `core/tools` | scoped tool registry + guarded 执行管线 | `ctx.tools` |
| `core/agent` | `Agent` 接口、live registry、`agent/*` events | `ctx.agents` |
| `core/agent-loop` | 实现该接口的默认 driver | `ctx.agentLoop` |
| `core/scope` | per-agent scoped-registration primitive | library，无 key |
| `llm/llm` | message/stream 词汇 + adapter seam | `ctx.llm` |

完整的能力 seam / 服务图（每个 `ctx.<key>` 的 role=seam/core/bundle、owner 包、实现包、直接消费者）由生成器生成在 `docs/capability-seams.md`（含 mermaid 图 + 表格，L1–L471）。它把服务分三类：**core spine service**（如 `ctx.sessions`/`ctx.tools`）、**swappable capability seam**（如 `ctx.shell`/`ctx.fs`/`ctx.subprocess`/`ctx.llm`/`ctx.skills`）、**bundle/composition point**（如 `ctx.agentLoop`）。

---

## 2. 插件契约（plugin contract）

### 2.1 三种插件形态

`docs/cordis-tutorial/01-first-plugin.md`（L53–L77）+ `docs/cordis-primer.md`：

1. **函数插件**（最常见）：module 导出 `apply(ctx)`，可选 `inject`/`Config`/`name`。
2. **对象插件**：导出含 `apply(ctx)` 方法的对象。
3. **类插件**：`Service` 子类（`class MyService extends Service { constructor(ctx){ super(ctx,'key') } }`）。

`packages/AGENTS.md` §Plugin exports（L5）约定：
> service packages default-export their service class; function plugins named-export `name` / `inject` / `Config` / `apply` and have no default export.

**混合两种形式会让 Loader 丢弃函数插件的 namespace**（postmortem `docs/postmortem/0001-acp-default-export-drops-inject.md`）。

`01-first-plugin.md` 关键事实：
- `apply` 抛错 = loud failure（进程崩），不是跳过条目（L81–L89）。
- module 无法解析（拼错路径/包名）时通过 Cordis logger service 报告而非崩进程，boot 时可能被吞（L91）。
- `name` 导出是可选的诊断标签。

### 2.2 注册即 effect，disposer 语义

`docs/cordis-tutorial/02-lifecycle-and-effects.md` 是权威：

- 插件可因配置编辑、HMR、显式 dispose、或**失去 required service** 而卸载。通过 Cordis API 做的注册是 effect，卸载时自动撤销；Cordis 不管的资源须用 `ctx.effect()` 包裹并返回 disposer（L5）。
- `ctx.effect(() => { ...; return () => cleanup() })` — effect body 在加载时运行，disposer 在卸载时运行（L65）。
- **已经是 effect 的内建 API**（L84–L92）：`ctx.on(event, listener)`（卸载时移除 listener）、`ctx.plugin(child)`（随父卸载）、service 注册、harness registry 的 `register()`（返回的 disposer 自动挂到调用插件）。
- disposer **按注册逆序启动，但多个 async disposer 并发运行**；若 teardown 必须有序，放进一个 disposer 内依次 await（L94）。
- `ctx.plugin(heartbeat)` 返回 **fiber**（一个已加载插件实例的运行时句柄）；`fiber.dispose()` resolve 于所有清理（含 async disposer）完成后，并递归卸载子插件（L62–L66）。

**Fiber 状态机**（L68–L82）：
```
PENDING → LOADING → ACTIVE → UNLOADING → DISPOSED
                 ↘ FAILED
```
- `PENDING`：已声明，但 required service 尚不可用。
- `LOADING/ACTIVE`：`apply` 运行中 / 已完成。
- `FAILED`：`apply` 或 config 校验抛错。
- `UNLOADING/DISPOSED`：disposers 运行中 / 全部拆除。

`docs/cordis-primer.md` §Practical Rules（L44）：每个注册都应有 disposer（`ctx.effect()` 返回一个，或用 Cordis helper）；teardown 顺序相关时放进一个 effect。

### 2.3 Service：注入依赖与声明合并

`docs/cordis-tutorial/03-services.md` + `docs/user/develop/framework/service.md`：

- **提供 service**：`super(ctx, 'greeter')` 在运行时把实例注册到 `ctx.greeter`；注册本身是 effect（卸载 provider 即移除 service）。编译期靠 TypeScript **declaration merging**：
```ts
declare module '@deepseek-ai/cordis' {
  interface Context { greeter: GreeterService }
}
```
（`03-services.md` L14–L18、L39–L40）。不写这段，运行时仍工作，但消费者失去类型安全。

- **消费 service**：`export const inject = ['greeter']`。Cordis 让插件停在 `PENDING` 直到所有 listed service 存在，`apply` 内 `ctx.greeter` 保证就绪。**加载顺序由依赖而非文件顺序决定**（`03-services.md` L59）。

- **依赖在加载后仍被追踪**：required service 消失（provider 卸载/hot-replace）→ 依赖插件也卸载，service 回来后再加载（L76–L78）。这就是配置里换 provider 能工作的原因。

- **可选依赖**：不加 `inject`，用 `ctx.get('greeter')` 在使用点探测（返回 `undefined` 时插件仍运行）（L80–L90）。`packages/AGENTS.md` L6 强调：`ctx.get(name)` 读全局 service store，`ctx.<name>` property proxy 是拓扑敏感的，只用于 declared injection。

- `Service` 子类自身就是插件（类形态），`ctx.plugin(GreeterService)` 像普通插件一样挂载。

- service 名是**每应用一个扁平命名空间**；自建服务要加前缀（harness 已占用 `tools`/`llm` 等 plain names）（`03-services.md` L92–L94）。

### 2.4 Typed events + declaration merging + dispatch modes

`docs/cordis-tutorial/04-events.md` + `docs/cordis-primer.md` §Dispatch Modes：

**声明**（`04-events.md` L14–L21）：
```ts
declare module '@deepseek-ai/cordis' {
  interface Context { stats: StatsService }
  interface Events { 'stats/report'(name: string, count: number): void }
}
```
`interface Events` 合并是 event 系统的类型安全机制；`namespace/action` 命名约定让扁平 event 命名空间可读。

**五个 dispatch mode**（`04-events.md` L84–L91；`cordis-primer.md` L19–L24 的表格）：

| Mode | 调用 | 语义 | Awaited? | 有返回值? |
|---|---|---|---|---|
| `emit` | `ctx.emit(name, ...args)` | 同步广播；返回值/ promise 不 await 不收集 | No | No |
| `parallel` | `await ctx.parallel(...)` | 全部并发执行，一起 await | Yes | No |
| `serial` | `await ctx.serial(...)` | 顺序 await；首个非 null/false/undefined 返回值胜出并停 | Yes | Yes |
| `bail` | `ctx.bail(...)` | serial 的同步版 | No | Yes |
| `waterfall` | `ctx.waterfall(name, ...args, next)` | around-middleware | No | Yes |

**dispatch mode 是 event 公共契约的一部分**。harness 新 event 用 `@mode` 标签文档化，供生成 catalog 检查声明与 dispatch 点一致（`cordis-primer.md` L26）。

**Waterfall 语义**（`cordis-primer.md` L28–L34、`04-events.md` L94–L140）：listener 收到 `(...args, next)`。调用 `next()` 把（可能被包装的）结果委派给下一个服务；不调用就短路（veto）。值通过 `next()` 的返回值传播。**只观察/注解的 waterfall listener 必须调用 `next()`**；返回而不调用是刻意的短路。忘掉 `next()` 会静默吞掉下游默认行为。`prepend: true` 只在 listener 必须跑在普通注册之前时用。

harness 的 waterfall 例子：`agent/request`、`approval/request`、`tools/pre-execute`、`tools/execute`、`tools/post-execute`。

### 2.5 Capability seam：Service Definition / Provider / Consumer

`docs/glossary.md` §capability-seam（L7–L9）定义：

- **seam** — 一个 *swappable capability*，含三个角色：一个 **Service Definition**（拥有 `ctx.<key>` 和词汇类型的 Cordis `Service` — 抽象类如 `ShellExecutor`，或具体 registry 如 `WebRuntime`，**绝不是 TypeScript `interface`**）、一个或多个 **Service Provider**、一个或多个注入该 service 的 **Consumer**。
- 权威例子（`glossary.md` L9、`docs/user/develop/practice/index.md` §Bash example）：`packages/shell` — `dsh-shell`（Service Definition）、`dsh-bash-local`/`dsh-bash-sandbox`（providers）、`dsh-tool-bash`（Consumer）。
- 角色通常在独立演化时分属独立包，但一个包可拥有多个角色（`dsh-llm` 同时拥有 Service Definition 与 Consumer）。
- **seam 是完整能力，绝不是单一角色**；称呼构成部分时用角色/类/service/contract/extension point 词。

`docs/architecture.md` §Capability seams（L98–L102）：一个 provider 替换就能改变整个产品——filesystem 与 subprocess providers 共享同一个 execution world，指向远程 sandbox 可让 Bash、PTY、LSP 一起迁移，无需 provider 分支。

三包拓扑的落地模板是 `docs/cookbook/adding-a-package.md` §3 Decide the package topology 的"Name the role that exists"（L45–L71），给出一张角色命名词表（`Controller`/`Store`/`Directory`/`Presenter`/`Registry`/`Runtime`/`Resolver`/`Binder`/`Engine`/`Policy`/`Executor`/`Gateway`/`Provider`/`Backend`/`Handle`/`Config`/`Service`），并规定：
- 单数 `ctx` key 用于一个 engine/runtime/policy/controller/resolver/store/current config；复数 key 用于 registry 或拥有多个命名成员的服务。类角色与 key 数必须一致。
- 不要用一个 Cordis `Context` key 承载互不兼容的 host/client 声明（declaration merging 两边都会看到）。
- `SDK` 只用于 JSON-RPC client/server 协议；产品拼写是 `Typert`（不是 `TypeRT`/`typeRT`）。

### 2.6 Config schema（Schemastery / Standard Schema）

`docs/cordis-tutorial/05-config.md` + `docs/user/develop/basic/config.md`：

- 导出同名 `Config` 接口 + Schemastery schema：
```ts
export interface Config { greeting: string; targets: string[] }
export const Config: Schema<Config> = Schema.object({
  greeting: Schema.string().default('Hello'),
  targets: Schema.array(String).default(['world']),
})
export function apply(ctx: Context, config: Config) { ... }
```
（`05-config.md` L11–L31）。
- 本仓库用 **Schemastery**（vendored `@deepseek-ai/schemastery` 3.18.0）做 schema；Cordis 本身接受任何 [Standard Schema](https://standardschema.dev/) validator，**导出普通对象作为 `Config` 不行**（`05-config.md` L34、`config.md` L45）。
- 校验在加载时运行；无效配置 `ValidationError` 使 fiber 进 `FAILED`（`05-config.md` L63–L68）。default 会填充，`apply` 收到完整、已验证的 config。
- schema 可表达的更严格校验：`Schema.string().required()`、`Schema.union(['fast','accurate']).default('fast')`（`config.md` L51–L72）。
- **原则**（`config.md` §Design principles、`AGENTS.md` §Conventions）：不要硬编码 tunable——**两个部署可能想设不同值的东西都必须是 config 字段**（检验标准：`cordis.yml` 能否不改代码就改它）；self-contained 约束写进 schema 让它在加载时 fail loud；引用 service/注册资源的约束用 dependency injection。
- HMR：配置编辑会 hot-replace 插件（卸载旧实例、加载新实例），因注册是 effect 而不会残留旧注册（`config.md` L98–L100）。

### 2.7 `!!js` 配置、`disabled`、overlays

`docs/cordis-primer.md` §Loader Configuration（L36–L38）+ `05-config.md` §Computed config values（L70–L80）：

- `!!js` tag 只允许在 `config` 内、以及 entry 的 `disabled` 字段里（**是 `!!js` 不是 `!js`**，见根 `AGENTS.md` §Secrets/.env）。
- `disabled: !!js ...` 在每次 mount 决策时针对 loader context 求值（本仓库扩展），可让行按平台/环境自门控。
- 其它 metadata（`name`/`id`/`inject`/…）保持静态，表达式在那里只是 truthy 数据。
- `@deepseek-ai/cordis-plugin-include` 把 `!!js` 解析成表达式节点；Loader 在 declared injections 激活后、针对该插件 context（`ctx.serviceName`）插值 entry 的 `config`，在每次 mount 决策时插值 `disabled`；Include 保留嵌套行表达式直到目标激活；其余 metadata 保持字面量。
- 环境选择插件时用 **overlays**。

真实例子（`packages/bundle/base/cordis.patch.yml`）：
- `bash-sandbox`: `disabled: !!js process.platform === 'win32'`（L180）
- `sandbox-policy.config.mode`: `!!js process.env.DSH_PERMISSION_MODE ?? 'workspace-write'`（L175）
- `session-telemetry-otel.config.mode`: `!!js process.env.DSH_TELEMETRY_MODE || 'DISABLED'`（L151）
- `session-persistence-jsonl.config.root`: `!!js dshHomePath('sessions')`（L101）

### 2.8 `verify-cordis-config` 强制门禁

`scripts/verify-cordis-config.ts`（L1–L497）是 `doc-sync` 的一部分，强制以下约束（`AGENTS.md` §Conventions 也引用："Raw/Web `cordis.yml` bare plugins must appear in their resolver manifest's `dependencies`; `verify-cordis-config` enforces it"）：

1. **metadata 插值约束**（`metadataFields = ['id','name','group','inject','intercept','isolate']`，L41；`metadataExpressionErrors` L431–L453）：`disabled` 是唯一可插值的 metadata 字段——它的 `!!js` 表达式节点合法且必须可解析（用 `new Function` 只编译不执行，L462–L472），嵌套在它下面的表达式是 truthy 数据；**其余每个 metadata 字段必须完全静态**，出现 `!!js` 报 `!!js is not interpolated here`。
2. **依赖解析**（`missingPluginDependencies` L342–L364）：每个裸插件 specifier 的包名必须出现在对应 resolver manifest（`examples/package.json`、`apps/cli/package.json` 或某个 bundle manifest）的 `dependencies` 中。
3. **source plane 解析**（`validateSourcePlaneResolution` L300–L340）：本地 workspace 包的每个 specifier 必须通过 `tsconfig.base.json` 的 `paths` 解析到 `.ts`/`.tsx` 源文件，否则 tsx source launch 在干净 checkout 会失败。
4. **preset 平面分离**（`validatePresetPlaneSeparation` L147–L171）：shipped agent preset 不得重复 host composition 仍在运行的行（一行属于恰好一个 plane）。
5. **client halves 声明**（`validateClientHalvesDeclared` L115–L128）：`packages/client` 包导出 `./client` 就必须声明 `dsh.client`（反之亦然）。
6. 目录选择器 chooser 的隐式 backend/surface 包依赖也强制解析（L44–L58）。

配套 spec：`scripts/verify-cordis-config.spec.ts`。

### 2.9 Group / isolate（服务隔离）

`docs/cordis-tutorial/06-composition-and-hmr.md` L21 + `docs/user/develop/framework/service.md` §Service isolation（L111–L139）：

- `id` 给 entry 稳定身份（loader 借此区分"编辑已有条目"vs"删了再加"）。
- `disabled: true` 卸载插件但保留条目。
- **Groups** 把子列表嵌套为一单元加载/卸载；**`isolate`** 给 group 自己的 service 名实例——两个 group 各见不同配置的 `shell` provider 互不影响。
- 例子（`service.md` L115–L137）用 `@deepseek-ai/cordis-plugin-group` + `isolate: { shell: true }` + `config:` 子列表。
- 没有 `id` 的 entry 每次读取都生成 id，配置文件一改就算 removed-plus-added 并 remount（`06` L59）。

---

## 3. 插件生命周期与扩展点

### 3.1 Agent loop 与 turn flow

`docs/architecture.md` §Turn flow（L63–L90）给出 step/turn 定义与流程：

- **step** = 一次模型请求 + 它调用的工具。**turn** = 零或多个 step。
- 流程（L67–L82）：
```
turn/start
  claim next-step input plus one queued message
  assemble prompt sections + tool schemas
  -> agent/pre-step                   reject | enter(messages)
     reject, or a first enter rewritten empty -> close the turn with no step
     step/start
     append entered messages as user/message
     derive model history from the log
     agent/request -> llm/stream -> assistant/chunk* -> assistant/message
     tool/call* -> tools/pre-execute -> tools/execute -> tools/post-execute -> tool/result*
     step/end
     tools owe another request, or next-step input arrived -> claim -> next step
  -> agent/turn-stopping
turn/end
```
- `turn/*`、`step/*`、`user/message`、`assistant/*`、`tool/*` 是**持久 session event**；其余是三个域里的 live 扩展点。`agent/pre-step`、`agent/request`、`llm/stream`、三个 `tools/*` 事件是 waterfall（listener 必须调 `next()`）；`agent/turn-stopping` 是 serial 且无 `next()`（L84）。

### 3.2 扩展点地图（新行为放哪）

`docs/architecture.md` §Where new behavior goes（L104–L127）给了"目标 → 机制"表，例如：

| 目标 | 机制 |
|---|---|
| 加模型 provider | 在 `ctx.llm` 注册 adapter |
| 加模型能力 | 在 `ctx.tools` 注册；schema 自动进入 prompt 组装 |
| 给单会话不同能力集 | 组合 agent preset；那里的 service 行需要 `isolate` realm |
| 加 shell 执行 | 注册 `ctx.shell` backend；local 经 `ctx.subprocess` spawn |
| 加人命令 | 注册 `ctx.commands`；不经模型 turn 分发 |
| 加后台工作 | 注册 `ctx.jobs`；`job_*` tools 收集/停止 |
| 拦截请求/工具/turn | 用 `agent/*` 或 `tools/*` event |
| 加模型上下文 | 调 `agent.inject()`；落在下一次 admitted request |
| 加持久会话状态 | 扩展 `SessionEventMap`；从 log 渲染/replay |
| 同一会话目标 | 用 `ctx.goals`；经 `agent/*` 继续 |
| fork 会话 | `ctx.sessions.fork(source, boundary?, childSessionId?)` |
| 把注册限定到一个 agent | 用该 agent 的 `agent.ctx` |

`docs/cookbook/extension-cookbook.md` §The feature → mechanism map（L95–L129）把每个产品 feature 映射到 listener，并给出五种插件骨架示例代码：
1. **A tool plugin**（`ctx.tools.register(defineTool(...))`）
2. **A hook plugin (permission-gate)**（`ctx.on('tools/pre-execute', async (exec, next) => { if(!isAllowed) return {kind:'deny', reason}; return next() })`，返回 `PreToolDecision`）
3. **A UI plugin**（监听 `session/event` 渲染 `assistant/chunk`，用 `agent.followup()`/`agent.steer()` 回输）
4. **An external protocol driver**（adapt wire peer 到 `ctx.agents`，`AgentHandle.dispose()` 达 quiescence；`packages/acp/acp` 是 worked example）
5. **Runnable wirings**（`examples/*/cordis.yml`）

### 3.3 Tool 注册配方（cookbook: adding-a-tool.md）

`docs/cookbook/adding-a-tool.md` 是**模型可见工具契约的权威参考**。最小形态（L9–L38）：

```ts
import { defineTool } from '@deepseek-ai/dsh-tools'
export const name = 'my-tool'
export const inject = ['tools']
export function apply(ctx: Context) {
  ctx.tools.register(defineTool({
    name: 'read_file',
    description: 'Read a file from disk.',
    parameters: {
      path: { type: 'string', required: true, description: 'Absolute path' },
      limit: { type: 'number' },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute(args, exec) {
      return readFile(args.path, { encoding: 'utf8', signal: exec.signal })
    },
  }))
}
```

`execute()` 契约要点（L40–L56）：
- **args 已为你校验**：`defineTool` 在 `execute` 前用 `ParameterSchemaSpec` 校验 model 生成的 `arguments`（类型、required key、literal 约束、exact-one union、嵌套值）。`args` 匹配 `InferArgs`。仍需手查 DSL 不表达的约束（非空字符串、正数、跨字段）。
- **注册借用你的 readonly definition**：不 mutate schema/替换 callback；热换工具 = dispose owning effect 再注册新实例。
- **执行身份受保护**：registry 一次性递归 materialize 无损 JSON arguments、在策略开始前 freeze、分配不透明 `exec.token`；`callId`/`name`/`arguments`/`agent`/`token`/必需 caller-owned `signal`/可选 `parent` 在 dispatch 中不可变。
- **声明并返回一个 canonical JSON 值**：`output.schema` 用 `ValueSchemaSpec`（object/array/scalar/null root）；`execute` 只返回推断值，registry 快照/校验/freeze 后交给 `output.render(args, value)`。
- **throw 或返回无效值 = `isError`**。throw 用于基础设施失败。
- **遵守 `exec.signal`**（取消在途工作）。
- 可选 `output.presentationMeta(args, value)` 派生可回放的 JSON（持久到 `tool/result`）。
- 可选 `exec.agent` 用于异步通知：`agent.inject({ content, source: { kind: 'plugin', plugin: '<name>' } })` 是下一次请求看到的持久上下文，不是唤醒（idle agent 保持 idle）。
- 后台工作：`run_in_background` 用 producer config 门控，经 `ctx.jobs.start({ kind, label, owner: exec.agent, run })` 注册。

**执行策略与观察**（L57–L59）：`tools/pre-execute`（可扩展 allow/deny/ask）、`ctx.tools.guard()`（最终单调 deny）、`tools/execute`（包裹 dispatch 加 deadline/retry/metrics）、`tools/post-execute`（替换呈现/值、block、附加上下文）、`tools/result`（观察不可变最终结果）。

**Code Mode 免费获得工具**（L61–L65）：每个可见注册工具可作为 `await tools.<name>(args)`；生成的 `ToolArgsMap`/`ToolOutputMap` 从同一 schema 推导精确类型；失败 reject 真实 `ToolCallError`（只暴露 `name`/`toolName`/`message`）。

**UI 呈现**（L67–L90）：`output.render` 是模型内容；UI card 由纯函数 `presentCall`/`presentResult` 声明，返回 `card`-tagged render intent（`generic`/`terminal`/`diff`/`search`/`read`/`web`）。硬规则：**纯度**（live streaming 与 REPLAY 都要跑，必须只是 `args`(+result) 的纯函数，无 I/O/session state/clock/random）；UI-only 格式不进 model result；`defineTool` 对显示路径软校验（malformed args 返回 `undefined` 走 generic fallback 而非 throw）。

`packages/core/tools/README.md` 给出 `ctx.tools` 服务（`ToolRuntime`）的完整 API：`register`/`presentAs`/`restrict`/`get`/`schemas`/`guard`/`execute`/`executionMode`，以及 config `mode: native | code | both`、`defineTool` schema DSL（`ParameterSchemaSpec`/`ValueSchemaSpec`、`oneOf`、`additionalProperties`）、Code Mode 的 `run_code` 保留 transport、并行执行、`ToolDefinition`/`ToolExecution`/`PreToolDecision`/`PostToolDecision`/`ToolGuard` 等关键类型（L1–L198）。

### 3.4 Skill 插件机制（packages/skill）

`packages/skill/skill/README.md` 定义 `ctx.skills`（`SkillRegistry`）：

- **纯 agent skill provider registry**，不知道 skill 来自本地文件/插件数据/HTTP（`registerProvider` 注册来源）。shipped local 实现是 `@deepseek-ai/dsh-skill-filesystem`。
- host+per-scope 分层，套在 `@deepseek-ai/dsh-scope` 上：注册落到调用 context 的 scope layer；读取合并 global layer + viewing scope chain，最近层同名胜出。
- 公共 API：`registerProvider(create)`、`snapshot({cwd,signal,scope})`、`list(...)`、`get(name,...)`、`register(skill)`（runtime embedded skill，rank 250）。
- 事件 `skills/change`（unfiltered invalidation notification，不带 catalog，消费者自己 `snapshot()` 重取）。
- config `collectCacheMaxEntries`（默认 128）。
- **Invocation policy**：`SkillSummary.invocation` 是必需 typed policy（`modelInvocable`/`userInvocable` 两个独立布尔，四种组合）。
- `renderSkillContent(skill)` 渲染 canonical `<skill_content>` block（`dsh-tool-skill` 与用户显式注入共用同一形状）。
- 消费者边界：registry 不渲染模型引导也不注册工具；`@deepseek-ai/dsh-tool-skill` 消费 `ctx.skills`（durable session catalogs + `skill` tool）。

skill 目录结构：`packages/skill/` 下有 `skill`（registry/Service Definition）、`skill-filesystem`（本地 provider）、`skill-badge`（provider，默认 `disabled: true`）、`tool-skill`（Consumer）。

`capability-seams.md` 对应行：`ctx.skills` = seam，owner `skill`，实现 `skill-badge`/`skill-filesystem`，消费者 `tool-skill`。

### 3.5 Bundle / profile 系统 + preset

- **bundle**（`packages/bundle/README.md`）：`packages/bundle/base/`（patch only，第一层）、`web-app/`（web patch + runtime glue）、`headless/`（挂 `headless-runner`）。`packages/bundle/base/cordis.patch.yml`（L1–L451）是实际的第一层 patch，列出全部 base 行（`llm`、`session`、`typert*`、`agent`、`agent-loop`、`tools`、`system-prompt`、`fs-sandbox`、`llm-deepseek`、`skill*`、`subagent*`、`workflow*`、`tool-*`、`plan-mode`、`goal*` 等），是看真实配置行形状的最佳示例。
- **profile**：`dsh.profile.bundles` 列表；`web`/`headless` 模板。
- **preset**（`packages/preset/agent-presets/README.md`）：一个 **preset** 是持有一份 `agent.cordis.yml` 的目录；roster 在每进程**只挂载一次**到一个 standing scope，每个命名它的会话通过 `dsh-scope` 的 parent chain 让 agent scope key 父级化到该 mount。视图解析 `agent → preset → global`（近者遮蔽远者）。
  - Service `AgentPresets`（`ctx.agentPresets`）API：`defaultId`/`list()`/`resolve(id?)`/`mount(agentCtx,id?)`/`composeFrom(agentCtx,parentCtx)`/`composedPreset`/`recompose`/`standingKeyFor`/`roots`/`authorable`/`read`/`copy`/`remove`。
  - `mount()` 唯一受支持调用点是 agent factory 的 `setup(agentCtx)` hook。
  - preset 行解析：**包名从 host composition 解析**（本地 preset 在用户 home 下，Node 向上走 `node_modules` 找不到 harness）；相对路径从 preset 自身目录解析；绝对路径转 `file:` URL。
  - 显示元数据在可选 `preset.yml`（`name`/`description`）。
  - config：`default`（必填）、`roots`（默认 `[]`）、`includeUserRoot`（默认 `true`，追加 `<dshHome>/.agent-presets`）。
  - mount 拒绝三类：unscoped target、never-usable row、publishes-into-root-realm row（service 要放 `isolate` realm）。
  - preset 文件是 input，不是持久化目标（mounted subtree 覆盖 `write()` 为 no-op）。
  - 切换 = `agent-preset/selected` session event（model-visible ⟺ logged 规则）。

---

## 4. 插件作者必须满足的约定与门禁

根 `AGENTS.md` §Conventions + §Commands + `packages/AGENTS.md` + `docs/testing.md` + `docs/development.md` 是权威来源。

### 4.1 包命名与 manifest 不变式

- 每个 npm 包是 `@deepseek-ai/dsh-<name>`；vendored 包 rescope（映射在 `docs/rescope.md`）且 `private: true`。`@deepseek-ai/cordis` 是每个 harness 包的 peerDependency（+ dev）。
- `packages/AGENTS.md` §Adding a package（`docs/cookbook/adding-a-package.md` L25）的 `package.json` 不变式（`pnpm run constraints` / `scripts/check-workspace-constraints.ts` 强制）：`private: true`、`version` 匹配 root、`type: module`、`main: "lib/index.js"`、`types: "lib/types/index.d.ts"`、`exports["."].types: "./lib/types/index.d.ts"`、`exports["."].default: "./lib/index.js"`、`@deepseek-ai/cordis` 同时在 peerDependencies 和 devDependencies（同 range）、每个 dsh peer dep 镜像进 devDependencies、`@deepseek-ai/schemastery` 进 `dependencies`（运行时 validator）、`files` 列表精确为 `lib/index.js`、`lib/invariant.js`、`lib/types/**/*.d.ts` + 包特定 runtime 产物。
- 包内相对 import 用显式 `.ts` 说明符（`export * from './types.ts'`），编译期改写为 `.js`，声明保留 `.ts`，NodeNext 消费者能解析到 sibling `.d.ts`。

### 4.2 ESM 与 source/artifact 平面

- **ESM everywhere**（`"type": "module"`）。跨包用包名，包内相对 import 用 `.ts`。
- 配置子进程跑 built `lib/`（plain Node）；source 回归用声明的 launcher。`dsh` CLI source launch 经 tsx 的 ESM-only hook（`node --import tsx/esm`）；它触及的模块必须保持 ESM（无 CJS-only exports）。
- **Source plane vs artifact plane，永不混用**：静态门禁和测试经 tsconfig `paths` 把 workspace import 解析到 `src`，在干净树上通过；消费 built `lib/` 的门禁要显式声明该依赖（`docs/development.md` §TypeScript project layout）。

### 4.3 类型安全与文档门禁

- `strict: true` + `noImplicitAny`；每个残留 `any` 解释为何无法收窄。
- 每个 module/export 有简洁 JSDoc（`@param`/`@returns`），由 `verify-export-jsdoc` 强制。
- typed events 用 declaration merging + merge-extensible maps；event JSDoc 需 `@mode` 和 payload `@param`；scoped keys 缺 payload 需 `@dshScopeScan unsupported`。
- `SessionEventMap` 成员默认 required-on-read，无信封豁免：不认其类型的 build 一律拒绝该 log；只有结构格式变更才 bump `SESSION_FORMAT_VERSION`。
- switch 用 discriminant tags：closed union 结尾 `assertNever`；merge-extensible union 走文档化 default。
- opaque 跨边界 id 用 branded（`Branded<B>` from `dsh-brand`），从不裸 `string`。
- 每个包拥有 `./invariant`（注册 manifest 名；检查 event/data 关系或给空 installer 一个包特定 `No runtime invariant:` 理由），由 `verify-package-invariants` 强制（`packages/AGENTS.md` L18）。
- package README 的 Model Experience 格式（canonical Model Experience format，`docs/cookbook/adding-a-package.md` §4）+ `Known Limitations and Deferred Work` 段落由 `verify-package-readme-model-experience.ts` / `verify-package-readme-limitations.ts` 门禁。

### 4.4 双语文档

- 人类文档须中英双语，`.zh.md` 配对；契约在 `docs/i18n/README.md`（pairing contract）。routine 双语工作按 `docs/AGENTS.md`；`dsh-translate-docs` 只在用户显式调用时运行。
- 文档分层（tier taxonomy，`docs/AGENTS.md` L15–L34）：一个事实一个 home。生成的英文源（`cordis-surface` 区域、`tool-catalog`、`config-catalog`、`persistence-catalog`、`module-graph`）从源生成且 freshness-gated；中文对照经 pairing workflow。
- `doc-sync` 聚合所有文档门禁：`verify-md-links`（死链/死锚点）、`verify-type-equiv`（`ts type-equiv`/`ts public-api` 粘贴不漂移）、`verify-doc-budgets`（词数上限）、`verify-agent-note-format`、`verify-archived-agent-notes`、`verify-config-catalog`、`doc-typecheck`（fenced `ts` block 必须编译）等。leaf 列表在 `scripts/run-gates.ts`。

### 4.5 测试与快照门禁

`docs/testing.md` 分层：
- **Unit**（`pnpm run test`）：vitest。每个 registry 要有 HMR-safety 测试（dispose contributing fiber，断言清理）。
- **Coverage gate**（`pnpm run test:coverage`）：CI 覆盖门禁 = `packages/*/*/src` 每文件 100%（`test:coverage` 而非 `test` 是门禁）。
- **Real-API e2e**（`pnpm run test:e2e`）：with-key；无 key 自跳过。
- **Snapshot**（`pnpm run test:snapshot`）：keyless 期望输出覆盖外部行为（transport contract + presentation；持久 log pin assembled backend behavior）。ACP boots 真实 automation-server example，replay 录制 session，diff normalized JSON-RPC + 重持久化 log。record 用 `pnpm run test:snapshot:record`。
- **Web browser snapshot**（`pnpm run test:web`；Linux PR gate）。

关键政策（`testing.md` L33、L47–L49）：**product-visible 插件要求 non-unit REAL-composition 测试**（手搭 `ctx.plugin(...)` 套件不够，须 boot 测试专用 `cordis.yml` 经 Loader 和 app/process）。**每个非平凡 model-/protocol-/human-visible 变更在同一 PR 里通过可运行 example 的 snapshot suite 增/改一个 keyless scenario**；包测试、e2e-only 断言、mock-only fixture 不能替代 assembled application transcript。

`examples/AGENTS.md` §E2E smokes：每个 example 都要有 keyless（boot 真实 cordis.yml 经 Loader）和 with-key（真实模型 prompt）两个 smoke。

### 4.6 其它门禁与命令

`AGENTS.md` §Commands + `docs/development.md`：
```sh
pnpm install              # node ^22.19 || >=24（pnpm@11.7.0 pinned）
pnpm run clean
pnpm run test             # vitest unit
pnpm run test:coverage    # CI coverage gate：packages/*/*/src 每文件 100%
pnpm run test:e2e         # real-API；无 DEEPSEEK_API_KEY 自跳过
pnpm run test:snapshot    # keyless ACP/headless replay
pnpm run test:snapshot:record
pnpm run typecheck        # strict；Host lib phase 先于 Client
pnpm run lint             # oxlint
pnpm run duplication      # 跨文件 TS clone 检测
pnpm run build            # tsc 出 lib/types，tsdown 打包 runtime
pnpm run hygiene          # knip + publint + workspace constraints + NodeNext consumer check
pnpm run check:windows-wine  # 仅诊断已知 Windows 失败（需 wine）
pnpm run doc-sync         # 所有文档门禁
pnpm run website:build    # VitePress build（兼死链检查）
pnpm dsh --profile headless "task"   # 从源跑一任务（需 key）
```

`pnpm run hygiene` 含 `publint`（验证 package entrypoint 对 built `lib/*.js`）+ `verify-node-next-types`（对临时 NodeNext consumer 验证 built declarations）——需要先 `pnpm run build`。

### 4.7 仓库级约定（作者必须遵守的行为规则）

根 `AGENTS.md` §Conventions 的 standing rules（与插件开发直接相关者）：

- **Registrations are effects**：每个贡献经 `ctx.effect()`/`ctx.on()`；registry 的 `register()` 返回 disposer。
- **Model-visible ⟺ logged**：任何到达模型请求的东西必须能从 session log 重建；新的 model-visible input 需要新 session event。
- **Plugins, not loop changes**：新行为放在文档化扩展点上；改 `agent-loop` 需更新 `docs/architecture.md`。
- **A capability seam 由 Service Definition / Service Provider / Consumer 组成**；完整，绝不一角色；只在角色独立演化时拆分。
- **No hardcoded tunables in plugins**：部署差异是 validated `Config` 字段，可从 cordis.yml 改；`DEFAULT_*` 常量或 test hook 不算可配置性。
- **Misconfiguration fails loud**：load 时 self-contained 就 load 时失败，否则最早可解析点失败；绝不静默跳过缺失 referent。
- **Explicit > implicit at package boundaries**：defaulting 是 owning 实现里的显式 `resolve(request): Spec` 步骤，不是 `run()` 里隐藏的 `?? default`（`dsh-shell` 的 request/spec 拆分是模板）。
- **Waterfall listeners MUST call `next()`**。
- **Trust TypeScript at typed same-process boundaries**：只在 parser/config、queued、model/tool JSON、durable/file、worker、process、wire 边界做运行时校验。
- **一个 async 操作 = 一个 lifecycle controller 或 transaction**。
- **非平凡变更必须同 PR 加 Agent Note**（`.agents/notes/README.md` §When to write one；`docs/AGENTS.md` L39）。
- TODO markers：`FIXME`/`TODO`/`XXX` 按紧急度。
- 文件以恰好一个 trailing newline 结尾（`git diff --cached --check` 在 pre-commit 门禁）。

Agent Notes 的生命周期/分类/格式见 `.agents/notes/README.md`：路径 `{lifecycle}/{class}/yyyy-mm-dd-topic-title.md`，lifecycle ∈ `proposed`/`implemented`/`rejected`（+ frozen `archived/{class}/`），class ∈ `feature`/`bug-fix`/`simplification`/`architecture`/`process`/`testing`；头部三行固定 `# Agent Note: <title>` + 空行 + `Status: <status>`；强制 `## Alternatives considered`。

---

## 5. 每个事实的路径/URL 索引（摘要）

本地 checkout 权威文件（全部已 `read` 核实）：

| 事实 | 文件 |
|---|---|
| 整体架构 / 一切皆插件 / profile+bundle / 扩展点地图 | `D:\deepseek-harness\docs\architecture.md` |
| 术语：capability-seam、agent-scope、goal、human command、loop hierarchy、Ralph | `D:\deepseek-harness\docs\glossary.md` |
| Cordis 五思想 / dispatch modes / waterfall / loader config | `D:\deepseek-harness\docs\cordis-primer.md` |
| 插件三形态 / 生命周期 / effect / fiber 状态机 / service / events / config / HMR | `D:\deepseek-harness\docs\cordis-tutorial\01~07-*.md` |
| Cordis 核心 API + inherited tier | `D:\deepseek-harness\docs\cordis-api\{context,events,fiber,service,registry,inherited}.md` |
| 工具契约（defineTool/execute/output/UI card） | `D:\deepseek-harness\docs\cookbook\adding-a-tool.md` |
| 加包 checklist / 命名词表 / package README 格式 | `D:\deepseek-harness\docs\cookbook\adding-a-package.md` |
| 扩展插件骨架 / feature→mechanism map | `D:\deepseek-harness\docs\cookbook\extension-cookbook.md` |
| LLM adapter 契约 | `D:\deepseek-harness\docs\cookbook\adding-an-llm-adapter.md` |
| vendored 包 manifest + 本地修改日志 + sync 程序 | `D:\deepseek-harness\vendor\README.md` |
| Agent Notes 布局/分类/格式 | `D:\deepseek-harness\.agents\notes\README.md` |
| 包级规则 | `D:\deepseek-harness\packages\AGENTS.md` |
| examples 规则 | `D:\deepseek-harness\examples\AGENTS.md` |
| 能力 seam 图 + 服务表 | `D:\deepseek-harness\docs\capability-seams.md` |
| 配置目录（每包 config 声明） | `D:\deepseek-harness\docs\config-catalog.md`（generated，3151 行） |
| 测试政策 / snapshot / coverage | `D:\deepseek-harness\docs\testing.md` |
| 开发指南 / TS project layout / CI | `D:\deepseek-harness\docs\development.md` |
| 文档标准 / tier taxonomy / 双语 | `D:\deepseek-harness\docs\AGENTS.md` |
| `ctx.tools` 服务 + Code Mode + 并行 | `D:\deepseek-harness\packages\core\tools\README.md` |
| `ctx.skills` 服务 | `D:\deepseek-harness\packages\skill\skill\README.md` |
| `ctx.agentPresets` 服务 | `D:\deepseek-harness\packages\preset\agent-presets\README.md` |
| bundle 包 | `D:\deepseek-harness\packages\bundle\README.md` + `packages\bundle\{base,web-app,headless}\cordis.patch.yml` |
| base 层实际配置行 | `D:\deepseek-harness\packages\bundle\base\cordis.patch.yml` |
| headless 示例组装 | `D:\deepseek-harness\examples\headless-agent\cordis.yml` |
| 用户教程（建插件/工具/配置/发布） | `D:\deepseek-harness\docs\user\develop\basic\{index,tool,config,publish}.md` |
| 框架教程（service/events/三角色能力） | `D:\deepseek-harness\docs\user\develop\framework\{service,events}.md` + `docs\user\develop\practice\index.md` |
| `verify-cordis-config` 强制门禁 | `D:\deepseek-harness\scripts\verify-cordis-config.ts` + `scripts\verify-cordis-config.spec.ts` |
| 根约定 + 命令 | `D:\deepseek-harness\AGENTS.md`（`CLAUDE.md` 是软链接） |

公开仓库 URL（经 web_search 核实存在）：

- 仓库首页：https://github.com/deepseek-ai/deepseek-harness （标题 "DeepSeek Harness: Everything is a Plugin."）
- README：https://github.com/deepseek-ai/deepseek-harness/blob/master/README.md 与 `README.zh.md`
- 架构文档：https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md （及 `.zh.md`）
- 配置目录：https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/config-catalog.md
- 发布教程：https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.md
- Cordis primer：https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md
- 能力 seam：https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/glossary.md
- npm 包示例：https://www.npmjs.com/package/@deepseek-ai/dsh-settings-file

> 公开仓库 master 分支的文档结构与本地 checkout 一致（architecture.md、config-catalog.md、cordis-primer.md、glossary.md、publish.md 等在 master 均可访问）。公开 issues/discussions 中"专门讨论插件开发契约"的**独立线程内容未在本次检索中抓到**——本次 web_search 返回的源主要是文档镜像（README/docs/cookbook/cordis-tutorial），因此"公开 issue/discussion 里的额外插件开发约定"视为 `[unverified]`；其余所有事实均已本地读档核实。

---

## 全部来源

**本地（只读 checkout `D:\deepseek-harness`，全部 `read` 核实）：**
1. `docs/architecture.md`
2. `docs/glossary.md`
3. `docs/cordis-primer.md`
4. `docs/cordis-tutorial/01-first-plugin.md` ~ `07-into-the-harness.md`
5. `docs/cookbook/adding-a-tool.md`
6. `docs/cookbook/adding-a-package.md`
7. `docs/cookbook/extension-cookbook.md`
8. `docs/cookbook/adding-an-llm-adapter.md`
9. `docs/capability-seams.md`
10. `docs/config-catalog.md`
11. `docs/testing.md`
12. `docs/development.md`
13. `docs/AGENTS.md`
14. `docs/user/develop/basic/{index,tool,config,publish}.md`
15. `docs/user/develop/framework/{service,events}.md`
16. `docs/user/develop/practice/index.md`
17. `packages/AGENTS.md`
18. `examples/AGENTS.md`
19. `vendor/README.md`
20. `.agents/notes/README.md`
21. `packages/bundle/README.md` + `packages/bundle/base/cordis.patch.yml` + `packages/bundle/{web-app,headless}/cordis.patch.yml`
22. `packages/skill/skill/README.md`
23. `packages/preset/agent-presets/README.md`
24. `packages/core/tools/README.md`
25. `examples/headless-agent/cordis.yml`
26. `scripts/verify-cordis-config.ts` + `scripts/verify-cordis-config.spec.ts`
27. 根 `AGENTS.md` / `CLAUDE.md`

**Web（web_search）：**
- https://github.com/deepseek-ai/deepseek-harness
- https://github.com/deepseek-ai/deepseek-harness/blob/master/README.md
- https://github.com/deepseek-ai/deepseek-harness/blob/master/README.zh.md
- https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md
- https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/config-catalog.md
- https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.md
- https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md
- https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/glossary.md
- https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/capability-seams.md
- https://www.npmjs.com/package/@deepseek-ai/dsh-settings-file
