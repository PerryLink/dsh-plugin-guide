# DeepSeek Harness 插件开发综合指南

> 本文档是 `dsh-plugin-guide` 的核心成果之一：把官方文档、上游 Cordis 资料与社区经验汇总成一条完整的插件开发路径。
> 事实来源全部记录在 [sources.md](../references/sources.md)；官方原文全文副本在 [references/official-docs/](../references/official-docs/)。
> 本文档为"指引"，不是"替代品"：开发中遇到精确签名/字段，永远以官方文档副本与生成式参考（subsystems 页、cordis-api 页）为准。

---

## 0. 一分钟心智模型

DeepSeek Harness（DSH）是一个**以插件组成的代理框架**（"Everything is a Plugin"），底层是 vendored 的 [Cordis](https://github.com/cordiverse/cordis) 插件运行时。

- **插件 = 一个模块**：导出 `name`、可选的 `inject`（依赖的服务名数组）、`apply(ctx, config)` 函数（或对象/类形态）。
- **上下文 `ctx` = 服务仓库**：`ctx.tools`、`ctx.llm`、`ctx.agents` 等都是"服务"；插件通过键名找服务，而不是 import 具体实现。
- **注册 = 可逆副作用（effect）**：事件监听、工具注册、定时器等一律经 `ctx.on()` / `ctx.effect()` / 各服务的 `register()` 挂接；插件卸载时框架自动全部撤销 —— 这是 HMR 与热插拔成立的基础。
- **事件 = 扩展点**：`emit`（广播）/ `waterfall`（可短路管线，必须调 `next()`）/ `parallel` / `serial` 四种派发模式；类型经 TypeScript 声明合并（declaration merging）保证类型安全。
- **能力 = 三层接缝（seam）**：Service Definition（声明接口）→ Service Provider（实现）→ Consumer（消费，通常是工具）。
- **配置 = cordis.yml 分层补丁**：bundle（`dsh.bundle`）→ profile（`dsh.profile`）→ 用户/机器层 patch → `--patch` 覆盖层，后者逐行覆盖前者。

最小插件：

```ts
import type { Context } from '@deepseek-ai/cordis'

export const name = 'hello-plugin'
export const inject = ['tools']   // 需要 ctx.tools 时声明；无依赖可省略

export function apply(ctx: Context) {
  // 需要的服务此时已就绪；注册你的能力。
}
```

---

## 1. 官方资料地图（先读哪个）

| 层级 | 文档 | 位置 |
|---|---|---|
| 官网入口 | [deepseek.com/harness](https://www.deepseek.com/harness/) | 在线快照 downloads/web/deepseek-com-harness.html |
| 文档站（用户向，中/英双语） | [develop/basic 系列](https://deepseek-harness.github.io/deepseek-harness/develop/basic/) | 本地副本 references/official-docs/docs/user/develop/basic/ |
| 框架概念 5 分钟版 | [Cordis Primer](https://deepseek-harness.github.io/deepseek-harness/reference/cordis-primer)（`docs/cordis-primer.md`，有 `.zh.md`） | 本地副本 references/official-docs/docs/cordis-primer.md |
| 框架 7 章动手教程 | [Cordis tutorial 01-07](https://deepseek-harness.github.io/deepseek-harness/develop/cordis-tutorial/)（均双语） | references/official-docs/docs/cordis-tutorial/ |
| 插件开发四步教程 | [第一个插件 → 工具 → 配置 → 打包安装](https://deepseek-harness.github.io/deepseek-harness/develop/basic/) | references/official-docs/docs/user/develop/basic/ |
| 框架能力三篇 | [生命周期 / 服务与依赖 / 事件系统](https://deepseek-harness.github.io/deepseek-harness/develop/framework/) | references/official-docs/docs/user/develop/framework/ |
| 实战两篇 | [三层能力拆分 / LLM 适配器](https://deepseek-harness.github.io/deepseek-harness/develop/practice/) | references/official-docs/docs/user/develop/practice/ |
| 用户指南 | [快速开始 / 模型配置 / Python SDK](https://deepseek-harness.github.io/deepseek-harness/guide/quickstart)（含 [python-sdk](https://deepseek-harness.github.io/deepseek-harness/guide/python-sdk)） | references/official-docs/docs/user/guide/ |
| 架构总纲 | [architecture.md](https://deepseek-harness.github.io/deepseek-harness/reference/)（改 `packages/` 前必读） | references/official-docs/docs/architecture.md |
| 扩展点全景 | [extension-cookbook.md](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/extension-cookbook)（feature → mechanism 表） | references/official-docs/docs/cookbook/extension-cookbook.md |
| 工具契约权威参考 | [adding-a-tool.md](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/adding-a-tool) + `dsh-tools` README | references/official-docs/docs/cookbook/adding-a-tool.md |
| 事件生产/消费矩阵 | [event-producer-consumer.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/event-producer-consumer.md)（生成式，全事件表；未上站） | references/official-docs/docs/event-producer-consumer.md |
| 每个子系统的服务/事件 API | [subsystems/*.md](https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/) 的生成式 Cordis API 区 | references/official-docs/docs/subsystems/ |
| Cordis 核心 API 参考 | [cordis-api/*](https://deepseek-harness.github.io/deepseek-harness/reference/cordis-api/context)（context、events、fiber、registry、service） | references/official-docs/docs/cordis-api/ |
| 上游 Cordis 框架 | [cordiverse/cordis](https://github.com/cordiverse/cordis)（README/docs 已下载） | downloads/github/cordis/ + references/upstream-cordis.md |
| Cordis 论文 | [cordiverse/paper](https://github.com/cordiverse/paper) | downloads/github/paper/ + references/cordis-paper-and-community.md |
| 生态/社区 | [社区开发文档与生态链接](../references/community-ecosystem.md)（topic 清单、awesome 列表、注册中心） | references/community-ecosystem.md + downloads/community/ |

网站与本地文档是同源的：GitHub Pages 站点由 `website/docs.ts`（副本在 references/official-docs/website-docs.ts）把仓库 `docs/` 投影成中/英两棵路由树；`develop/basic/` 页面 = `docs/user/develop/basic/index.zh.md`。**想"离线全量"看官方文档，读 references/official-docs/docs/ 即可。** 线上 URL 与本地副本的**完整对照**（含 `en/` 英文投影、全部 reference/cookbook/cordis-api/subsystems 路由与 GitHub 直链）见 [links.md](links.md)。

---

## 2. 工程形态与开发环境

### 2.1 两种开发方式

1. **仓库内开发（scratch 目录）**：clone `deepseek-ai/deepseek-harness`，`pnpm install` 后建 `scratch-plugin/`，用 `--patch` 覆盖层挂载本地插件（`pnpm dsh web --patch ./scratch-plugin/cordis.yml`）。适合学教程、改核心。
2. **独立插件包（发布形态）**：一个 npm 包 + `cordis.patch.yml`，经 `dsh plugin --profile <name> add <包>` 装入 profile。适合对外发布。

### 2.2 两个概念、两种清单（package.json 的 `dsh` 键）

- **bundle（分发层）**：npm 包，`package.json` 声明 `"dsh": { "bundle": { "patch": "./cordis.patch.yml" } }`；patch 里是"插入/覆盖插件行"的 YAML 数组。
- **profile（可运行组合）**：`$DSH_HOME/profiles/<name>/`，`package.json` 声明 `"dsh": { "profile": { "bundles": [...] } }`；由 `dsh plugin` 命令自动维护，手写不允许。

bundle 最小结构：

```
hello-plugin/
├── package.json       # dsh.bundle → cordis.patch.yml
├── cordis.patch.yml   # - insert: [{ id, name: 'dsh-hello-plugin' }]
└── index.js           # export const name / export function apply
```

### 2.3 配置分层顺序（后层覆盖前层，逐行按 `id` 整段替换 config）

1. profile 的 `dsh.profile.bundles` 列表顺序（`@deepseek-ai/dsh-base` 永远第一层）
2. profile 自己的 `cordis.patch.yml`
3. 机器级 `$DSH_HOME/cordis.patch.yml`
4. 命令行 `--patch <path>`（argv 顺序）

patch 覆盖某行时**整行 config 被替换而非深合并**——覆盖方必须重述该行需要的全部键。验证实际组合：`dsh --profile <name> --dump-config`。

### 2.4 常用命令

```sh
dsh --profile web                       # 启动 Web UI
dsh --profile headless "任务文本"        # 一次性无界面执行
dsh --profile <name> --dump-config      # 打印实际生效的插件树
dsh plugin --profile <name> add <pkg>   # 安装 bundle（转发给 pnpm）
dsh plugin --profile <name> remove <pkg>
pnpm dsh web --patch ./scratch-plugin/cordis.yml   # 仓库内开发调试
```

---

## 3. 插件契约（必守规则）

### 3.1 三种插件形态

- **函数形态**（最常用）：`export const name`、`export const inject`、`export function apply(ctx, config)`。
- **对象形态**：`export default { name, inject, apply(ctx) {} }`。
- **类形态**（提供服务时用）：`export default class X extends Service { static inject = [...]; constructor(ctx) { super(ctx, '服务名') } }`。

### 3.2 生命周期状态机（Fiber）

```
PENDING → LOADING → ACTIVE
                 ↘ FAILED
ACTIVE → UNLOADING → DISPOSED
```

- `inject` 声明的服务未就绪 → 停在 PENDING；就绪才执行 `apply`。
- 依赖的服务消失（provider 被换掉）→ 插件自动卸载，服务恢复后自动重载。
- `apply` 抛错 → FAILED。
- 手动停用：`const fiber = ctx.plugin(plugin); await fiber.dispose()`（保证所有注册撤销、子插件递归卸载、异步清理完成后才 resolve）。
- 卸载时 disposer **逆注册序**触发，但多个异步 disposer 并发执行、无串行完成保证 → 有顺序依赖的清理放进**同一个** `ctx.effect()` 返回的单个 disposer 里串行 await。

### 3.3 注册即 effect

```ts
ctx.on('some-event', handler)          // 监听器：卸载自动移除
ctx.tools.register(tool)               // 工具：卸载自动撤销
ctx.llm.registerAdapter(names, adapter) // 适配器
ctx.effect(() => { const t = setInterval(...); return () => clearInterval(t) })  // 自定义资源
```

框架代管：`ctx.on` / 服务 `register()` / `ctx.effect()`。`HMR`（`@deepseek-ai/cordis-plugin-hmr`）正因注册全部可逆而成立。

### 3.4 服务（Service）

- **消费**：`export const inject = ['tools']` → `apply` 里 `ctx.tools` 已就绪。可选依赖：不写 inject，用 `ctx.get('metrics')?.method()`。
- **提供**：`class MetricsService extends Service { constructor(ctx) { super(ctx, 'metrics') } }` + 声明合并 `declare module '@deepseek-ai/cordis' { interface Context { metrics: MetricsService } }`；消费方 `inject = ['metrics']`。
- **隔离**：cordis.yml 用 `@deepseek-ai/cordis-plugin-group` + `isolate: { shell: true }` 让不同插件组各见各的服务实例（如不同 timeout 的 bash）。
- 内建服务一览（`ctx` 键）：`sessions`、`systemPrompt`、`tools`、`agents`、`agentLoop`、`llm`、`skills`、`commands`、`approval`、`jobs`、`fs`、`shell`、`subprocess`、`terminals`、`sandbox`、`codeRuntime`、`sessionPersistence`、`settings`、`credentials`、`workspaceRegistry`、`goals`、`planMode`…… 完整清单与每个服务的公开方法见 `docs/capability-seams.md`（图谱）与 `docs/subsystems/*.md`（生成式 API）。**不要维护第二份静态清单，以生成式区域为准。**

### 3.5 事件（Events）

派发模式（事件契约的一部分，新事件必须用 `@mode` 标注）：

| 模式 | await？ | 顺序 | 返回值 |
|---|---|---|---|
| `emit` | 否 | 注册序 | 无 |
| `waterfall` | 否 | 注册序 | 有（管线结果） |
| `parallel` | 是 | 并行 | 无 |
| `serial` | 是 | 注册序 | 有（首个非空即止） |

- `ctx.bail`：首个非 `null/false/undefined` 结果即短路返回。
- **waterfall 铁律**：监听器签名 `(payload, next)`，**必须调 `next()` 才能下传**；不调即短路（这正是拦截/网关的语义）。协作式监听器改共享对象后 `next()`；替换结果的监听器负责让下游只看到替换后的结果。仅在"必须最先执行"时才用 `prepend: true`。
- **类型安全**：`declare module '@deepseek-ai/cordis' { interface Events { 'my-plugin/ready': (p: {id: string}) => void } }`。
- **命名空间**：`namespace/action`（`agent/step`、`tools/result`、`session/event`……）。
- **注意区分**：`turn/*`、`step/*`、`tool/call`、`tool/result`、`compaction/*` 是**持久化会话事件类型**（在 `session/event` 里以 `event.type` 出现），不是同名 Cordis 事件。
- **SessionEvent switch 规则**：`SessionEventMap` 是 merge-extensible union，对 `SessionEvent` 的 switch **禁用 `assertNever`**（插件新增的 variant 是合法未知值）——处理已知 case 后落入文档化 `default` 放行；closed union（如 `StreamChunk`）才以 `assertNever` 收尾。
- 全量"谁发谁听"矩阵：`docs/event-producer-consumer.md`（副本在 references/official-docs/docs/）。

### 3.6 配置（Config）

```ts
import Schema from '@deepseek-ai/schemastery'

export interface Config { greeting: string; maxRetries: number }
export const Config: Schema<Config> = Schema.object({
  greeting: Schema.string().default('Hello'),
  maxRetries: Schema.number().default(3),
})
export function apply(ctx: Context, config: Config) { /* config 已校验+补默认 */ }
```

- **不能用普通对象当 `Config`**——必须是 Schemastery schema（实现 Standard Schema）。
- 校验发生在加载期；非法配置**响亮失败**（fail loud），绝不明吞。
- **红线：插件里不得硬编码可调参数**。判断标准：能否只改 cordis.yml 而不用改代码。协议常量、外部规范、安全不变式除外。
- 引用表达式 `!!js`（注意双感叹号）在**该插件的注入服务就绪后**才求值；其余元数据保持字面量。
- 配置热更新 = 卸载旧实例 + 装载新实例（effect 保证不残留旧注册）。

### 3.7 仓库级红线（写进 AGENTS.md，违反会挂门禁）

1. **注册即 effect**：所有贡献走 `ctx.effect()` / `ctx.on()`；registry 的 `register()` 返回 disposer。
2. **waterfall 监听器必须调 `next()`**。
3. **模型可见 ⟺ 已记录**（Model-visible ⟺ logged）：任何进入模型请求的内容必须能从会话日志重建；新增模型可见输入必须新增会话事件。运行时不变式会断言这一点。
4. **跨边界 opaque id 用 branded**：`Branded<B>`（`dsh-brand`，纯类型、零运行时依赖），从不裸 `string`；构造走 per-type factory（`SessionId` / `CallId` / `JobId` / `GoalId` 等），防止不同 id 在类型层互换。
5. **会话事件版本规则**：`SessionEventMap` 成员默认 required-on-read——不认识该事件类型的 build 拒绝日志，除非事件信封带 `ignorable: true`；只有结构格式变更才 bump `SESSION_FORMAT_VERSION`。插件新增会话事件时按此契约设计（新增模型可见输入见红线 3）。

---

## 4. 开发一个工具（最常用路径）

教程路径：docs/user/develop/basic/tool.md；权威参考：docs/cookbook/adding-a-tool.md；生产级范例：`packages/shell/tool-bash`（三层包结构）。

### 4.1 最小形态

```ts
import { readFile } from 'node:fs/promises'
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'my-tool'
export const inject = ['tools']

export function apply(ctx: Context) {
  ctx.tools.register(defineTool({
    name: 'read_file',
    description: 'Read a file from disk.',       // 模型看到的内容
    parameters: {
      path: { type: 'string', required: true, description: 'Absolute path' },
      limit: { type: 'number' },                 // 缺省即可选
    },
    output: {
      schema: { type: 'string' },                // 规范值(canonical value)的 schema
      render: (_args, value) => [{ type: 'text', text: value }],  // 模型面向内容
    },
    async execute(args, exec) {
      return readFile(args.path, { encoding: 'utf8', signal: exec.signal })
    },
  }))
}
```

schema 自动汇入系统提示词组装；模型可用原生函数调用或 Code Mode 直接 `await tools.read_file(...)`。

### 4.2 execute() 契约硬规则

1. **参数已被校验**：`defineTool` 在执行前按统一 `ParameterSchemaSpec` 校验（类型/必填/字面量/exact-one/嵌套）；`execute` 内 `args` 即 `InferArgs` 类型。DSL 表达不了的约束（非空串、正数、跨字段规则）仍需自检。裸 JSON-Schema 工具（如 MCP 来源）自管输入校验。
2. **注册借用你的只读定义**：注册后不得改 schema 或换回调；热换工具 = 释放旧 effect + 注册新工具。
3. **执行身份不可变**：`arguments` 在策略开始前被一次性无损 JSON 快照并冻结；`exec.token` 为不透明 token；`callId/name/arguments/agent/token/signal/parent` 全程不可变。`args` 视为只读。只有 `tools/execute` 包装层可临时替换 `exec.signal`（且不能删除）。
4. **声明并返回一个规范 JSON 值**：`output.schema`（`ValueSchemaSpec`）可为对象/数组/标量/null 根；`execute` 只返回推导值；不要返回内容块、不要让调用方从散文里解析 id。
5. **抛错或返回非法值 ⇒ `isError`**：基础设施故障用 throw；成功的领域结果放进规范值（即使渲染层解释一个"不理想"状态，如非零退出码）。
6. **尊重 `exec.signal`**：触发时取消在途工作（前台工作与其绑定；后台任务改用任务自带取消信号）。
7. **`presentationMeta(args, value)`（可选）**：从同一规范值导出可回放的 JSON 持久化到 `tool/result`，供 UI 卡片回放。
8. **异步通知用 `exec.agent`**：`agent.inject({ content, source: { kind: 'plugin', plugin: '<name>' } })` 把上下文注入**下一条**模型请求（不是唤醒；空闲 agent 保持空闲）。对已释放的 agent 要 try/catch。

### 4.3 后台任务（长任务）

`run_in_background` 由生产者配置门控，然后 `ctx.jobs.start({ kind, label, owner: exec.agent, run })` 注册。成功分支返回类型化句柄（如 `{ kind: 'background', jobId }`）——**Code Mode 永远不得解析人类散文去恢复 id**。`ctx.jobs.start()` 发布 id 后改用任务自有取消信号：外层调用取消只停止等待、不杀已发布任务；`job_kill`、owner 释放、服务卸载负责其生命周期。参考 `dsh-tool-bash`。

### 4.4 策略钩子（按需选择）

- `tools/pre-execute`：可重排的 allow/deny/ask 门（permission-gate 范例见 extension-cookbook）；返回 `PreToolDecision`（`allow | deny | ask`）。不能改写 `exec.arguments`。
- `ctx.tools.guard()`：pre-execute 之后的**单调最终 deny**（后注册的 waterfall 监听器无法翻转）。
- `tools/execute`：包裹实际派发生命周期（超时/重试/指标），仅可换 `exec.signal`。
- `tools/post-execute`：替换展示内容或值、阻断结果、附加模型上下文（改值会重新校验重渲染）。
- `tools/result`：只读观察不可变最终结果（审计/指标/采集用这个；要改结果才用 post-execute）。
- 沙箱化可放进工具执行器实现内；权限系统/AskUserQuestion 经 `tools/pre-execute` 返回 `ask` + `ctx.approval`。

### 4.5 Code Mode（免费获得）

每个可见工具自动成为 `await tools.<name>(args)`，参数/返回类型从同一 schema 推导（`ToolArgsMap`/`ToolOutputMap`）。成功 resolve 到**策略后的最终规范 JSON 值**；失败 reject 真实的 `ToolCallError`（只有 `name/toolName/message` 可查）。设计 `output.schema` 时要当作编程 API 设计：直接返回句柄与字段；人类解释放 `output.render`。

### 4.6 UI 卡片（presentCall/presentResult）

- 卡片类型：`generic`（默认）/ `terminal` / `diff` / `search` / `read` / `web`（`kind: search|fetch`）。
- **纯函数硬规则**：卡片方法在实时流与日志回放都会执行 ⇒ 只能依赖 `args`（+ 结果），**禁止 I/O、会话状态、时钟/随机**。diff 由 args 推导；需要旧文件内容/工作目录时——放进持久化结果元数据或 UI 适配器，而不是 presenter。
- UI 专属格式不进模型结果；`defineTool` 对展示路径软校验（老日志参数不崩溃，回退 generic）。
- 中性词表在 `dsh-tools`；工具永不 import UI/传输类型。

---

## 5. 能力分层：Service Definition / Provider / Consumer

通用可替换能力（如 bash）拆三层：

- **Service Definition**（如 `dsh-shell`）：声明 Cordis 服务（`ctx` 键）+ 请求/结果类型（抽象类，不是 TS interface）。
- **Service Provider**（如 `dsh-bash-local` / `dsh-bash-sandbox`）：实现。
- **Consumer**（如 `dsh-tool-bash`）：消费（`inject: ['shell']`），通常注册为工具。

规则：**不提前拆**（只有角色需要独立演化才分包）；Provider 与 Consumer 互不依赖，都只依赖 Definition；默认值在显式 `resolve(request): Spec` 步骤解决（显式 > 隐式）。一个缝（seam）= 三个角色的完整能力，缺一个角色不叫缝。完整示例见 docs/user/develop/practice/（三步代码齐全）。

LLM 适配器同理：继承 `LlmAdapter` 实现 `stream(options)`，`ctx.llm.registerAdapter(providers, adapter)`；`StreamChunk` 协议要点：`block-start/text-delta/block-end/tool-call-delta/usage/finish`，`usage` 在 `finish` 前，`finish` 是最后一块；无法满足的字段抛带稳定 code 的 `LlmError` 而不是静默丢弃。完整见 docs/user/develop/practice/llm-adapter.md。

---

## 6. 扩展点全景（feature → mechanism）

新行为挂到已文档化的扩展点；**改 agent-loop 本身必须同步更新 architecture.md**（插件开发几乎永远不需要改 loop）。来源：architecture.md「Where new behavior goes」+ extension-cookbook「feature → mechanism map」。

| 想做什么 | 机制 |
|---|---|
| 加模型提供商 | `ctx.llm.registerAdapter` |
| 加模型可调能力 | `ctx.tools.register`（schema 自动进提示词组装） |
| 给某个会话换能力集 | agent preset 组合；服务行配 `isolate` realm |
| 加 shell 执行 | 注册 `ctx.shell` 后端（本地实现经 `ctx.subprocess` spawn） |
| 加持久终端 | 注册 `ctx.terminals` 后端 + `dsh-tool-terminal` |
| 加人类命令（斜杠命令） | `ctx.commands` 注册；不经模型回合直接派发 |
| 加后台任务 | `ctx.jobs` 注册；`job_*` 工具收集/停止 |
| 加文件访问/策略 | 注册 `ctx.fs` provider 或监听 `fs/*` 事件 |
| 限制进程 | `ctx.sandbox` 后端；消费者 spawn 前包 argv |
| 拦截请求/工具/回合 | `agent/*`、`tools/*` 事件；`agent/turn-stopping` 停回合 |
| 注入模型上下文 | `agent.inject()`；进入下一条被采纳的请求 |
| UI/编辑器集成 | 驱动 `ctx.agents`；从 `session/event` 渲染 |
| Web 会话业务节点 | 注册 `ConversationNodeDefinition` + keyed 渲染器 |
| 持久会话状态 | 扩展 `SessionEventMap`；从日志渲染与回放 |
| 会话标题 | 注册唯一的 `ctx.sessionTitle` provider |
| 同会话目标 | `ctx.goals`；经 `agent/*` 继续 |
| fork 活跃会话 | `ctx.sessions.fork(source, boundary?, childSessionId?)` |
| 只对一个 agent 注册 | 用该 agent 的 `agent.ctx`（作用域注册） |
| Hook 系统（用户/项目级） | `agent/session-start`、`agent/pre-step`、`agent/request`、`tools/pre-execute`、`tools/post-execute`、`agent/turn-stopping` 监听器 |
| 上下文压缩 | `ctx.compaction` 缝 + `dsh-compaction-basic`；自动压力走 serial `agent/pre-step`，溢出恢复走 `agent/request-error` |
| 系统提示词配置 | `ctx.systemPrompt.section()`（带排序与作用域内遮蔽） |
| 计划模式 | `@deepseek-ai/dsh-plan-mode`（`plan/mode` 日志态、`/plan`、`exit_plan_mode` 工具） |
| 会话预设组合 | preset 层：per-session agent composition from preset cordis.yml（`dsh-preset`） |
| 待办列表 | `dsh-todo` 的 `todo_write` 工具（状态进会话日志，可作参考实现） |
| 循环卫生/工具超时 | `dsh-guard`：重复调用提醒 + `tools/execute` 截止时间强制 |
| 子代理委派 | `ctx.subagents` provider 注册表 + `dsh-tool-subagent` |
| 多代理编排 | `ctx.workflow` 缝（Definition/Provider/Consumer）+ `workflow`/`ralph` 工具 Consumer |
| MCP | 每服务器一个插件：发现工具 → `ctx.tools.register()` |
| Skills | section + 工具注册；调用时 `inject()` 技能内容 |
| 定时任务 | 注册模型可调的调度工具；定时器 → 空闲 `followup(source:{kind:'cron'})` / 忙碌 `inject()` |
| 遥测/回放 | `session/event` → JSONL；回放 = `sessions.create(id, {seed})` |
| 热重载 | 所有注册是 effect → vendored HMR 天然可用 |

Hook 的"原生 hook"就是挂在拦截点上的普通 Cordis 插件，不需要外部协议；`dsh-hooks-claude-code`/`dsh-hooks-codex` 是把 Claude Code/Codex hook 配置映射到这些扩展点的桥。

---

## 7. 打包、安装与分发（踩坑重点）

### 7.0 插件形态选型：bundle vs 纯 cordis（两条官方安装通道）

> 时间线（社区实测记录，vlln/plugin-registry）：官方 0809 推出 repository-plugin 机制（`.dsh-plugin`），**0811 已从 `vendor/loader/src/repository.ts` 移除**（−258 行，`plugin_search/install/uninstall/status` 四个工具随之不复存在）。此后外部插件只有 web profile 一条官方路径，按是否声明 `dsh.bundle` 分两类。
> **预览期漂移提示**：官方文档里可能仍有残留旧表述（如 `docs/subsystems/skills.md` 的 "repository plugins land in the global layer"），且服务名在快照间会改名（0812 批量重命名：`httpServer→webServer`、`tasks→jobs`、`bash→shell`、`compact→compaction` 等 17 项）——遇到矛盾以**当前宿主的生成式参考**（subsystems 页 Cordis API 区）与社区事实源（`references/community-repo-deep-dive.md` §1.5）为准。

| 需求 | 类型 | 安装通道 | 生效 |
|---|---|---|---|
| 带组合层（多个 insert/config/disabled 行随包分发、官方 `dsh.client` UI 组件） | **bundle 插件**（`"dsh":{"bundle":{"patch":"./cordis.patch.yml"}}`） | `dsh plugin --profile <name> add <pkg>` → 进 `dsh.profile.bundles` 层栈 | **重启生效** |
| 单个 Cordis 插件（Node 工具 / 服务 / 自渲染 UI） | **纯 cordis 插件**（无 `dsh.bundle`，`main` 指向 Cordis entry） | `dsh plugin add` 装依赖 + 在 profile `cordis.patch.yml` 加 insert 行 | **配置 HMR 实时生效** |

安装状态管理文件：profile 的 `package.json`（`dsh.profile.bundles` 层栈）+ `cordis.patch.yml`（insert 行与 disabled 启停，HMR watched）。
Git 源安装支持子路径选择器：`dsh plugin --profile demo add "github:owner/repo#<ref>&path:<subdir>"`（构建产物已入库时可免构建直接装）。

### 7.1 从 GitHub 安装的 build-script 坑

`dsh plugin add github:you/hello-plugin` 拉的是**源码不是构建产物**：不会跑 `build`，TS 包没有 `lib/` 会加载失败。双方配合：

- **作者**：写 `prepare` 脚本（git 安装后 pnpm 会执行）自包含地构建发布入口——不得假设 monorepo 兄弟目录等 dev-only 上下文。官方范例见 [publish.md](../references/official-docs/docs/user/develop/basic/publish.md)（其引用的 turtle-ui 仓库 08-14 核查已 404）；活范例参考 [plugin-template](https://github.com/omdsh-dev/plugin-template) 的 `scripts/prepare.mjs`：`prepare` 用专用 tsdown 配置转译 `src/`，无 project references、无类型检查。
- **用户**：pnpm ≥10 默认拒绝运行 git 依赖的 `prepare`，第一次 `add` 会失败并在 profile 的 `pnpm-workspace.yaml` 加：

```yaml
allowBuilds:
  dsh-hello-plugin: true
```

- 该 allowlist 本质是"**允许该包在安装时于沙箱外执行你的机器代码**"：只放行可信源，并 pin commit（`github:you/hello-plugin#<sha>`）。
- 不想让用户放行 → 发布构建产物：npm 发布带 `lib/`，或 `pnpm pack` 出 tarball（`dsh plugin add ./xxx.tgz`）。

### 7.2 给 bundle 自己的命令行

bundle 挂一个普通 provider 插件：`inject = ['cmdlineArgs']`，用 `@deepseek-ai/dsh-cmdline` 的 `parseCmdline` 解析自己的 commander program，从 action 提供 app 自有服务；其余行经 `!!js ctx.myAppStartup.port ?? 8080` 读取（部署值作回退）。`--help` 时 provider 不提供服务 → 依赖它的行不激活。

### 7.3 常见坑清单（社区踩坑档案 omdsh-dev/dsh-plugin-dev + plugin-registry + 官方 postmortem，全部实测）

**身份与依赖（最致命）**
- **cordis 双副本 / 双 Cordis 分裂**：插件构建时若从 `.pnpm` 副本解析 cordis，与 harness 的 vendored 副本是"两个模块"，`declare module` 增强合并不了 → 报 `Property 'tools' does not exist on type 'Context'`。构建期把 cordis 解析到 harness 的 `vendor/cordis`；npm 安装路径下 peer 必须与宿主同一身份——**scoped `@deepseek-ai/cordis` 与 unscoped `cordis` 混用同样分裂**（dsh-tools 的类型只增强 scoped 版本）。独立包把 cordis 设为 peerDependency（+ dev），版本对齐宿主。
- **官方 `@deepseek-ai/*` 包曾未发布公共 npm**（rc 早期）：社区 bundle 的 `dependencies` 留空，靠 profile 的 pnpm 闭包 flat fallback（`$DSH_HOME/profiles/node_modules`）注入；声明了反而解析失败。rc.6 起公开包可用（from-scratch 教程锁 `0.1.0-rc.6`、cordis `4.0.1`），两条时间线的资料都要知道，按当时宿主版本取舍。
- **npm `latest` 标签是过期版本**：`@deepseek-ai/dsh-tools` 的 `latest` 停在陈旧 0.0.1-rc.1——脚手架（create-dsh-plugin）显式钉 `next` 标签版本；裸跑 `npm i @deepseek-ai/dsh-tools` 会踩旧版。2026-08-14 复核：dsh-tools 与 `@deepseek-ai/dsh-session-persistence-jsonl` 的 `latest` 均为 0.0.1-rc.1、`next` 为 0.1.0-rc.6；`@deepseek-ai/dsh` latest=next=0.1.0-rc.6、`@deepseek-ai/cordis` latest=4.0.1（另有 `next`=4.0.1-rc.4）；create-dsh-plugin 已发布 latest=0.1.1（2026-08-13T15:15Z）；dsh-core、dsh-sdk 仍未发布（404）。**无作用域 `dsh` 包是无关项目 node-dsh**（"A shell written in JavaScript"）——官方 CLI 包是 `@deepseek-ai/dsh`，别装错。

**tsconfig 三件套 + 构建陷阱**
- 独立 TS 插件包实测可用形态：`module: esnext` + `moduleResolution: bundler` + `allowImportingTsExtensions: true`（否则 TS5097）+ `rewriteRelativeImportExtensions: true`（否则产物残留 `./x.ts` 导入 → 运行时 ESM 崩溃）+ `lib: ["ES2024"]` + `outDir: lib` + `declarationDir: lib/types`。用 `Buffer`/`node:` 时显式 `"types": ["node"]`（不写 `types` 字段会隐式包含全部 @types，脆弱）。
- **`tsc` 报错仍会 emit 产物**（`noEmitOnError` 默认 false）——构建脚本必须 `tsc ... || exit 1` 或加 `--noEmitOnError`；发布前 `grep -rE "from './[^']+\.ts'" lib/` 验证产物无 `.ts` 残留。
- `main`/`types` 声明 `lib/...` 但 tsconfig 无 `outDir` → 产物落到 src 旁，运行时找不到入口（坑 4）。
- git 安装跑 `prepare` 要**自包含**：不假设 monorepo 兄弟目录、不跑类型检查，用专用 tsdown 配置转译 `src/`（模板 `scripts/prepare.mjs`）；`pnpm pack --dry-run --json` 检查最终文件清单。

**Windows 实测**
- junction 创建：`ln -s` 与 `cmd mklink /J`（MSYS 参数转换）都失败，**PowerShell `New-Item -ItemType Junction` 稳定可用**；`@types` 不能整体 junction（内部是 pnpm 符号链接，tsc 无法穿透），要直达 `.pnpm/@types+node@<ver>/node_modules/@types/node` 真实路径。
- `path.resolve()` 返回反斜杠，与外部正斜杠路径比较恒 false（路径逃逸误报）；比较前两侧都 `resolve()` 或统一 `replace(/\//g,'/')`。
- vitest：盘符必须大写（`C:/`，小写 `c:/` 报 "Tests no tests"）；`| tail` 会截掉汇总行，用 `grep -E 'Test Files|Tests '` 取结果。
- **`DSH_PERMISSION_MODE=danger-full-access` 是高风险模式**（Windows 无沙箱后端时仅此可启动，且禁用审批提示）——只用于可信本地开发机，不要写进模板/CI/共享机器。
- `DSH_*` 特殊环境变量必须由启动环境传入，放 `~/.dsh/.env` 会启动报错；凭据在 `$DSH_HOME/.credentials.yaml`（LLM 配置只存引用）。

**运行时/数据**
- **多帧 zstd 会话文件**：会话按 200ms 窗口每批追加一个 zstd frame（19MB 会话 ≈ 12 万帧），单帧解压 API 会误判"只有 header"。逐帧扫描用 `scanZstdFrames`/`createZstdFrameDecoder`（真实导入路径 `@deepseek-ai/dsh-session-persistence-jsonl/src/zstd.ts`；npm 包无 `src/` 时 deep 模式降级 decoder-unavailable，帧级扫描不受影响）。
- worker 内跑 `.ts`（Node ≥23.6 原生 strip-types）：worker URL 按源码/产物自适应——`new URL(import.meta.url.endsWith('.ts') ? './worker.ts' : './worker.js', import.meta.url)`。
- 批量 sed 替换后必须 grep 验证命中数（静默失效案例）；计数矩阵（工具数等）改动后全局复查引用。
- `!!js` 不是 `!js`；`disabled` 字段在每次挂载决策时对 loader 上下文求值；裸 `cordis.yml` 插件必须出现在解析器 manifest 的 `dependencies`（`verify-cordis-config` 强制）。

---

## 8. 规范与质量门禁（对插件作者的实际影响）

- 包命名 `@deepseek-ai/dsh-<name>`；vendored 包改前缀且 `private: true`；`@deepseek-ai/cordis` 是每个 harness 包的 peerDependency（+dev）。
- ESM 全仓库；跨包用包名、包内相对导入用 `.ts`。
- 文档双语：README/文档有 `.zh.md` 成对；工具描述等模型可见文本即行为。
- 测试：包测试 + keyless snapshot（模型/产品可见行为必须有组装后应用级转录快照）+ CI 100% per-file coverage；fixtures 必须可跨平台回放。
- 门禁：`pnpm run typecheck / lint / build / hygiene / doc-sync`；提交前按 dsh-pre-push-checks 技能选最小检查集。
- Agent Note：非平凡变更必须在同 PR 加 Agent Note。
- 事件 JSDoc 需要 `@mode` 与 payload `@param`；公开服务方法文档化参数与非 void 返回值。
- **跨边界 opaque id 用 branded**（`Branded<B>` from `dsh-brand`）：会话/任务/审批等 id 从不裸 `string`（红线 4）。
- **同进程 typed 边界信任 TypeScript**：不要为静态接口已保证的值加运行时校验/兜底；在 parser/config、queued、模型/工具 JSON、durable/file、worker、process、wire 边界必须运行时校验。
- **switch 按 discriminant tags**：closed union 以 `assertNever` 收尾；merge-extensible union 落入文档化 default（`SessionEvent` 是后者，见 §3.5）。
- **独立插件包测试路径**：包级 vitest（fixtures 跨平台回放）+ keyless snapshot（模型/产品可见行为必须有组装后转录快照）+ `pnpm pack` 后装进干净 profile 冒烟（含 `lib/` 构建产物）；社区现成的健康检查见 omdsh-dev/dsh-plugin-check，测试结构范例见 plugin-template 的 `tests/`。

---

## 9. 生态与社区（找参考实现、发插件）

- **官方社群**：[Discord](https://discord.gg/Ycq5dCaS4) · [GitHub Discussions](https://github.com/deepseek-ai/deepseek-harness/discussions) · 发布插件时给仓库加 [`dsh-plugin` topic](https://github.com/topics/dsh-plugin) 提升可见度。
- **话题清单**：[GitHub topic `dsh-plugin`](https://github.com/topics/dsh-plugin)（三期早期快照 304/550/993 供续期对比；**08-15 第四期快照** `downloads/topic-snapshots/dsh-plugin-topic-2026-08-15/`：去重 998 个、抓取期间 API total_count 2668→2671 持续增长——search API 分页上限 1000 条）。
- **精选列表**：[awesome-dsh-plugins](https://github.com/AdamPlatin123/awesome-dsh-plugins)（每日兼容性追踪）、[awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness)、[Alex-Yanggg/awesome-DSH-plugin](https://github.com/Alex-Yanggg/awesome-DSH-plugin)、[bruc3van/awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin)；08-14 新增 [walkinglabs](https://github.com/walkinglabs/awesome-deepseek-harness-plugins)、[vvlife](https://github.com/vvlife/awesome-deepseek-harness-plugins) 的 awesome-deepseek-harness-plugins 与 [cccakeee/awesome-dsh-plugins](https://github.com/cccakeee/awesome-dsh-plugins)（完整清单见 community-ecosystem.md §5）。
- **插件注册/分发中心**：[vlln/plugin-registry](https://github.com/vlln/plugin-registry)（薄控制台 + `make-dsh-plugin` skill；注意其记录的机制时间线：repository-plugin 0809 推出、0811 移除）、[omdsh-dev/dsh-hub-workshop](https://github.com/omdsh-dev/dsh-hub-workshop)（插件市场/注册 workshop；dsh-external/hub 08-14 核查已 404）；08-14 另出现多个 Web GUI 内插件市场（[DSH-Plugins-Marketplace](https://github.com/bradeGithub/DSH-Plugins-Marketplace)、[dsh-plugin-installer](https://github.com/Toukaiteio/dsh-plugin-installer)、[dsh-plugin-marketplace](https://github.com/Scorp1o117/dsh-plugin-marketplace)，未深读，信任边界同 dsh-hub-workshop"发现 ≠ 安装权限"）。
- **模板与脚手架**：[omdsh-dev/plugin-template](https://github.com/omdsh-dev/plugin-template)（完整生产模板：src 四文件结构 + 7 个开发 skill + tsdown 自包含 prepare + 契约文档 docs/dsh-plugin-contracts.md）、[`npm create dsh-plugin@latest`](https://github.com/whyihaveyou/dsh-suite)（whyihaveyou/dsh-suite 的脚手架，tool/events/webui 三模板）、[omdsh-dev/dsh-plugin-skills](https://github.com/omdsh-dev/dsh-plugin-skills)、[omdsh-dev/dsh-plugin-dev](https://github.com/omdsh-dev/dsh-plugin-dev)（踩坑档案 skill+文档，20 个实测坑）。
- **教程与最小模板**：[Opr4Mp3r/deepseek-harness-plugin-from-scratch](https://github.com/Opr4Mp3r/deepseek-harness-plugin-from-scratch)（代码审计式渐进教程：checkpoint + 反模式 17 坑 + 交付检查单，锁 harness@47f9438/npm rc.6）、[randerous/dsh-turn-meta](https://github.com/randerous/dsh-turn-meta)（最小首插件：agent/pre-step + prepend:true + source 归属注入范例）、[omdsh-dev/fabric](https://github.com/omdsh-dev/fabric)（类 MC Fabric 的 hook 处理器）、[omdsh-dev/dsh-plugin-check](https://github.com/omdsh-dev/dsh-plugin-check)（插件健康检查：清单协议/patch 格式/构建陷阱）、[bobleer/deepseek-harness-plugin-mcp](https://github.com/bobleer/deepseek-harness-plugin-mcp)（经 MCP 发现/安装/运行插件）、[Nagi-ovo/dsh-find-plugins](https://github.com/Nagi-ovo/dsh-find-plugins)、[omdsh-dev/dsh-hub-workshop](https://github.com/omdsh-dev/dsh-hub-workshop)（插件市场/注册 workshop）。
- **兼容性追踪**：[whyihaveyou/dsh-suite](https://github.com/whyihaveyou/dsh-suite)（双语目录 + 每日兼容性 CI，167+ 插件带 🟢/⚪ 徽章）、[AdamPlatin123/awesome-dsh-plugins](https://github.com/AdamPlatin123/awesome-dsh-plugins)（每日兼容性追踪）。
- **社区/学习**：[hikariming/dshfind](https://github.com/hikariming/dshfind)（DSH 学习与分享社区，MDX）。
- **教程与文档型仓库（08-14 晚扫描新增归档）**：[flaqai/deepeseek-harness-guide](https://github.com/flaqai/deepeseek-harness-guide)（15 语言指南）、[Electricitysheep/dsh-handbook](https://github.com/Electricitysheep/dsh-handbook)（14 章双语手册 + PDF）、[flysheep-ai/learn_deepseek_harness](https://github.com/flysheep-ai/learn_deepseek_harness)（s01–s23 渐进课程）、[pingfanfan/hello-dsh](https://github.com/pingfanfan/hello-dsh)（零基础 22 技能实例）、[LaplaceYoung/dsh-book-deepseek-harness](https://github.com/LaplaceYoung/dsh-book-deepseek-harness)（源码拆解书）、[curtiseng/cordis-course](https://github.com/curtiseng/cordis-course)（Cordis 论文中文课程）、[NanmiCoder/dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams)（英文插件开发教程 developing-dsh-plugins.md）；**08-15 第七批（14 个）**：桌面壳（[anywhere-labs](https://github.com/anywhere-labs/deepseek-harness-desktop)、[cc1252](https://github.com/cc1252/deepseek-harness-desktop)、[ChisaAlter](https://github.com/ChisaAlter/Deepseek-Harness-Desktop) 等 7 个）、[banana770/dsh-qq-bridge](https://github.com/banana770/dsh-qq-bridge)（QQ 桥接）、[zzszmyf/dsh-security-pocs](https://github.com/zzszmyf/dsh-security-pocs)（安全 PoC）、[HenryZ838978/deepseek-harness](https://github.com/HenryZ838978/deepseek-harness)（Python 移植）、[Vengisk/deepseek-harness-termux](https://github.com/Vengisk/deepseek-harness-termux)（Termux）；第八批 3 个：[orxz/deepseek-harness-themes](https://github.com/orxz/deepseek-harness-themes)（主题）、[vvlife/whalehub-dsh](https://github.com/vvlife/whalehub-dsh)（WhaleHub 市场）、[dsh-market/dsh-market](https://github.com/dsh-market/dsh-market)……完整 114 仓清单见 [community-ecosystem.md](../references/community-ecosystem.md) §4。
- **本工作区已有实例可参考**：`dsh-chat-import`（JS + cordis.patch.yml）、`dsh-resume-plugin`（多 skill 插件）、`dsh-plugin-claude-bridge`（TS + src/ + tsconfig）；114 个社区仓库的**完整源码副本**在 `downloads/community-repos/`（首批 15 个深读报告见 [references/community-repo-deep-dive.md](../references/community-repo-deep-dive.md)）。
- **官方 Discussions 最新动态**：官方 [RFC #1629](https://github.com/deepseek-ai/deepseek-harness/discussions/1629)（2026-08-15，官方插件脚手架 template repo + `pnpm create dsh-plugin` 提案，直指 dsh-tools `latest` 版本火车混淆问题）——全量 1654 条讨论归档于 `downloads/github/harness/discussions/`。
- 完整信息与更多链接见 [references/community-ecosystem.md](../references/community-ecosystem.md)；官方文档 URL 对照见 [guide/links.md](links.md)。

---

## 10. 从零到发布的标准路径（总结清单）

1. 读 Cordis Primer（5 个概念）→ 跑 Cordis tutorial 01-07（无 key）。
2. 按 docs/user/develop/basic 四步做第一个插件（scratch-plugin + `--patch`）。
3. 需要新能力时：先查 architecture「Where new behavior goes」与 extension-cookbook 表选扩展点；tool 类需求读 adding-a-tool.md 全文。
4. 需要可替换能力 → 三层拆分（practice 教程）；需要接模型商 → LLM adapter 指南。
5. 配置全部 Schema 化、fail loud；不硬编码可调值。
6. 打包：bundle manifest + cordis.patch.yml；git 安装配 `prepare`；npm/tarball 分发免 allowBuilds。
7. 发布前：包级测试 + 关键 snapshot + typecheck/build/hygiene；README 双语并写明扩展点与模型可见效果。
8. 发布到 dsh-plugin topic / hub / awesome 列表，社区可见。

---

*本指南由 dsh-plugin-guide 维护；与官方文档冲突时以官方文档（references/official-docs/）为准。*
