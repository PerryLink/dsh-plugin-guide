# Cordis 框架调研

> **归档更正（2026-08-13 下载复核）**：本报告撰写时子代理沙箱禁网，未验证 cordis.io。知识库下载脚本实测：`https://cordis.io/` 返回 **308 永久重定向到自身**（curl 跟随即死循环；`www.`/`http` 变体亦不可达）——该站点当前无法访问或已改址。上游权威以 **GitHub 仓库**（`downloads/github/cordis/`：README、package.json、仓库树、全部 md 文档）+ **DSH vendored 源码**（`vendor/cordis/src/*`）为准；cordis.js.org 是否 301 至 cordis.io 仍标 [unverified]。

> 目标读者：DeepSeek Harness 插件开发者。本文为 Cordis 插件框架（https://github.com/cordiverse/cordis）的基础知识调研，作为 DSH 插件开发的知识底座。
>
> 语言约定：中文叙述，保留英文技术术语（`ctx.effect`、`Service`、`Fiber`、`waterfall`、`inject` 等）。
>
> 标注约定：每条事实尽量给出**精确 URL**。凡无法通过一手来源（源码 / 官方文档 / 仓库元数据）核实的论断，标注 **[unverified]**。

---

## 0. 关键结论先行（务必先读）

Cordis 存在**两个明显不同的 API 谱系**，调研时必须区分，否则会混淆：

| 谱系 | 版本 | 代表 API | 状态 |
|---|---|---|---|
| **经典 Cordis**（Koishi 时代） | `cordis` v1–v3，`@cordisjs/core` v3 | `ctx.scope`、`ctx.select`、`ctx.using`、`ctx.provide/inject/get/set`、`ctx.effect/on/root/plugin`；`ctx.loader`（`@koishijs/loader`）、`ctx.registry`（`@koishijs/registry`） | 历史版本，npm 上仍可查（`cordis` 1.5.2 / 2.1.1 / 2.3.1，`@cordisjs/core` 3.17.7） |
| **Cordis v4（重写版）** | `cordis` 4.x，即 DSH 所 vendored 的版本 | `ctx.effect/on/root/plugin/inject`、`ctx.get/set/provide`、`ctx.extend/isolate/intercept`（取代 `scope/select`）、`ctx.registry`（内置）、`ctx.reflect/fiber/events/logger`、`ctx.mixin/accessor`；`ctx.loader` 来自 `@cordisjs/plugin-loader`（loader 本身已是插件） | 当前上游 master 与 DSH 使用 |

**这是本调研最重要的一个事实**：用户问题清单里的 `ctx.scope` 与 `ctx.select/selector` 属于**经典谱系**；DSH 所 vendored 的 v4 已经用 `ctx.extend()` / `ctx.isolate()` / `ctx.intercept()` 取代了它们。`ctx.loader` 在 v4 不再是核心内置，而是 `@cordisjs/plugin-loader` 提供的一个 **Service**（见 §5）。`ctx.registry` 在 v4 变为核心内置（`ctx.registry` 永远存在），不再需要单独安装 registry 包。

- 上游仓库：https://github.com/cordiverse/cordis ，仓库描述为 "Meta-Framework of Spatiotemporal Composability"（时空可组合性的元框架）。作者为 Shigma（Koishi 作者）。
- 上游论文仓库：https://github.com/cordiverse/paper —— "A Programming Paradigm for Spatiotemporal Composability"（《一种时空可组合性的编程范式》）。
- 官方文档站：https://cordis.io/ （当前，v4 API；例如 https://cordis.io/zh-CN/api/core/context.html 、https://cordis.io/zh-CN/api/std/loader.html 、https://cordis.io/zh-CN/guide/starter/config.html ）。经典文档站为 https://koishi.js.org/ （Koishi 文档中的 Context 页，如 https://koishi.js.org/api/core/context.html ）以及更早的 cordis.js.org。
- DSH 对 Cordis 的 vendored 快照与本地文档（一手、权威）：
  - vendor 源码与同步清单：https://github.com/deepseek-ai/deepseek-harness/blob/master/vendor/README.md
  - 概念入门：https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md
  - API 参考（生成式）：`docs/cordis-api/{context,events,fiber,registry,service,inherited}.md`
  - 动手教程：`docs/cordis-tutorial/01…07`
  - 术语表：https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/glossary.md

---

## 1. 核心插件范式：一切皆插件（Everything is a Plugin）

### 1.1 为什么“一切皆插件”

Cordis 的定义性观点是：**应用完全由插件组合而成**。DSH 的 `AGENTS.md` 第一句即是 "DeepSeek Harness is a plugin-based agent harness on vendored Cordis: **everything is a plugin**"。上游将其提炼为“时空可组合性（Spatiotemporal Composability）”：一个应用 = 若干插件（空间维度，谁和谁并存）在时间轴上的挂载/卸载（时间维度，何时生效）。

由此得到三个推论（见 DSH `docs/cordis-primer.md` 的 “Cordis In Five Ideas”）：

1. **插件是一个实现 Service 的对象**：可以是带 `inject` / `apply(ctx)` 字段的函数，也可以是 `Service` 子类（其生命周期由 Cordis 挂载进当前 context）。
2. **context 是服务的仓库**：服务通过稳定键 `ctx.<key>`（如 `ctx.tools`、`ctx.llm`、`ctx.sessions`）被声明；其它插件**通过键名而非 import 具体实现**来获取服务。
3. **依赖通过 `inject` 声明**：插件列出所需服务，并在这些服务存在前一直等待，因此**加载顺序由服务依赖表达，而非手工 boot 序列**。

这意味着：没有“框架引导代码（bootstrap glue）”——插件只描述它贡献什么，`cordis.yml` 负责组合出整个应用。DSH 教程第一章的表述：“There is no framework bootstrap code in your file: a plugin describes what it contributes, and `cordis.yml` composes the application.”（https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-tutorial/01-first-plugin.md）

### 1.2 插件 = 函数（或类 / 对象），可返回 disposer

`ctx.plugin()` 接受三种插件形态（vendored 源码 `vendor/cordis/src/registry.ts`，`Plugin` 类型）：

```ts
// 1. 函数插件：直接调用 callback(ctx, config)
export function apply(ctx: Context, config: Config) { /* ... */ }

// 2. 对象插件：带 apply(ctx, config) 方法
export const objectPlugin = {
  name: 'object-plugin',
  apply(ctx: Context, config: Config) { /* ... */ },
}

// 3. 类插件：Service 子类，用 new (ctx, config) 构造
export class MyService extends Service {
  constructor(ctx: Context) { super(ctx, 'myService') }
}
```

- 函数插件最常见的形态是**具名导出 `apply`**（loader 从模块读取 `apply`），但 `ctx.plugin(fn)` 直接接受函数本身。
- 插件可以返回一个 **disposer**（或 disposer 的数组/迭代器/async 迭代器，见 §2.1 的 `Effect`），在插件卸载时释放资源——这正是“插件 = `function(ctx) → disposer`”这一经典表述的准确含义。注意：v4 中 disposer 的登记被统一收敛进 `ctx.effect()`（见 §2.1），插件主体（`apply`）的返回值与 `ctx.effect` 的执行体共享同一套 `Effect` 形状处理逻辑（`vendor/cordis/src/fiber.ts` 的 `Effect` 类型与 `_execute`）。

### 1.3 Fiber：一个已加载插件实例的运行时句柄

`ctx.plugin()` 返回一个 **Fiber**（同时是 thenable，`await fiber` 等待其完成加载）：

- 状态机（`vendor/cordis/src/fiber.ts` 的 `FiberState`）：`PENDING → LOADING → ACTIVE → UNLOADING → DISPOSED`，旁路 `FAILED`。
  - `PENDING`：已声明，但某个 `inject` 的服务尚不可用。
  - `LOADING / ACTIVE`：`apply` 正在执行 / 已执行完成。
  - `FAILED`：`apply` 或 config 校验抛错。
  - `UNLOADING / DISPOSED`：disposer 正在运行 / 全部拆除。
- `fiber.uid`：registry 内唯一 id，根 fiber 为 `0`，dispose 后为 `null`。
- `fiber.dispose()`：卸载插件，resolve 时全部清理（含 async disposer）已结束，并**递归卸载其挂载的子插件**。
- `fiber.restart()` / `fiber.update(config)`：按当前/新 config 重载。
- `fiber.getEffects()`：返回当前效果的 `EffectMeta` 诊断树。
- `fiber.name`：展示名，取自最近的具名祖先，否则 `'root'`。

教程第二章（https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-tutorial/02-lifecycle-and-effects.md ）给出完整状态机与示例。

---

## 2. Context API

`Context` 是核心对象：一切 service / event / 生命周期 API 都经 `ctx` 到达。运行时 `Context` 是一个 **Proxy**：普通属性读取走 service 解析器（`ReflectService.handler`），而 `extend()` / `isolate()` / `intercept()` 派生作用域子 context，**不修改父 context**（`vendor/cordis/src/context.ts`）。

### 2.1 生命周期与 effect

- `ctx.effect(execute, label?)`：登记一个带清理语义的副作用。`execute` 立即执行，产生的 disposer 被收集，并在「返回的 disposer 被调用」或「所属 fiber 卸载」二者先发生时运行。**disposer 以注册逆序运行**；可以是 async（卸载时 await 它们）。执行体返回形状 `Effect`：
  - 单个 disposer `() => T`
  - 一个 disposer 的 `Promise`
  - （async）可迭代的多个 disposer——**generator effect 每 yield 一个 disposer 就立即登记一个**
  - 在已 dispose 的 fiber 上调用会抛 `CordisError('INACTIVE_EFFECT')`；返回非法形状抛 `TypeError`。
- `ctx.fiber`：当前 fiber（拥有此 context 的插件实例）。`ctx.effect()` 委托给它。
- **disposer 逆序执行、多个 async disposer 并发**：教程第二章明确提醒“如果拆除步骤必须顺序执行，把它们放进同一个 disposer 并在此 await”（https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-tutorial/02-lifecycle-and-effects.md ）。

> **经典谱系对照**：`ctx.effect()` 在经典 Cordis 中即存在，语义一致（“返回 disposer，随插件卸载而回收”）。v4 额外把 `ctx.on()`、`ctx.plugin()`、`ctx.provide()` 等全部实现为 effect（见下），即 AGENTS.md 的 “**Registrations are effects**”。

### 2.2 作用域派生（v4 取代 scope/select 的机制）

- `ctx.extend(meta?)`：创建继承当前 scope 的子 context，叠加额外元数据；子 context 原型继承父的所有属性，`meta` 自有属性遮蔽继承项；**父不受影响**。
- `ctx.isolate(name, label?)`：为服务 `name` 创建独立服务作用域的子 context。在该子 context 之下，对服务 `name` 的读写解析到新 label 而非父的 label，因此可在不影响父作用域的前提下提供不同实现。传相同 `label` 给两次 `isolate()` 会**合并这两个作用域**（默认 label 是全新 symbol）。
- `ctx.intercept(name, config)`：为在其下启动的插件追加服务专属 intercept config（见 §3.3）。该 config 会被 merge 进服务的解析后 config（祖先条目优先，见 `Service[symbols.resolveConfig]`）；父 context 不受影响。

> **`ctx.scope` / `ctx.select` 的说明**：这是**经典 Cordis（v2/v3）**的作用域 API——`ctx.scope` 派生隔离作用域、`ctx.select(name)` 创建在所选服务作用域中运行的选择器。它们在 v4 被 `extend/isolate/intercept` 取代。本文在 vendored v4 源码（`vendor/cordis/src/context.ts`）中**未找到** `scope`/`select` 属性（grep 仅命中注释里的普通英文 “scope”），因此 DSH 实际使用的 v4 无此二者。经典 API 的精确语义请以 Koishi 文档为准（https://koishi.js.org/api/core/context.html 、https://deepwiki.com/koishijs/koishi/2.1-context ）；下文对该二 API 的转述标注 **[unverified]**：`ctx.scope` 创建隔离作用域（服务提供在作用域内隔离），`ctx.select(name)` 返回一个可在选中服务作用域中消费/提供该服务的 `Selection` 对象（用于隔离多个同名服务的实例）。另有提交 `feat: support ctx.inject(), deprecate ctx.using()`（https://github.com/cordiverse/cordis/commit/b5cd65aa27a18b90aeb6c8f036570cf1a374277a ）表明经典 `ctx.using()` 被 `ctx.inject()` 取代。**[unverified 部分如上]**

### 2.3 环境句柄与混合成员

`ctx` 上的环境句柄（`vendor/cordis/src/context.ts` 的 `Context` 接口）：

- `ctx.root`：应用根 context（每个子 context 共享它）。标注 `@experimental`。
- `ctx.events`：事件总线 `EventsService`，其方法也 mixin 到 `ctx`（`ctx.on/emit/…`）。
- `ctx.logger`：日志服务 `LoggerService`，可 `ctx.logger(name)` 生成具名 logger，也可直接 `ctx.logger.info(...)`。
- `ctx.registry`：插件注册表 `RegistryService`，其方法 mixin 到 `ctx`（`ctx.plugin/inject`）。
- `ctx.reflect`：反射层 `ReflectService`，支撑 context proxy 与 `ctx.get/provide/…`。
- `ctx.baseUrl?`：解析相对插件/模块 specifier 的 base URL（运行时设定）。
- 静态符号：`Context.effect / filter / isolate / intercept`（对应 `symbols.effect/filter/isolate/intercept`，键为 `Symbol.for('cordis.*')`）。`Context.is(value)` 跨 realm/多份 cordis 判定是否为 context（以全局 symbol 品牌，而非 `instanceof`）。

`ctx` 上由 `ReflectService` mixin 出的方法（`vendor/cordis/src/reflect.ts` 构造器）：

```ts
this.mixin('reflect', ['get', 'set', 'provide', 'accessor', 'mixin'])
this.mixin('fiber', ['runtime', 'effect'])
this.mixin('registry', ['inject', 'plugin'])
this.mixin('events', ['on', 'once', 'parallel', 'emit', 'serial', 'bail', 'waterfall'])
```

- `ctx.get(name, strict?)`：无需 inject 直接从 store 读服务；`strict=true`（默认）只返回 provider fiber 当前 ACTIVE 的实现，否则可能返回 `undefined`。这是“可选依赖”的读取方式。
- `ctx.set(name, value)`：覆写某已提供服务的值；**只有提供该服务的 fiber 才能 set**，set 未提供名抛错。
- `ctx.provide(name, value)`：以当前 fiber 为所有者登记一个服务实现；fiber ACTIVE 后对同 isolation 作用域的依赖方可见；disposer 运行或 fiber 卸载时注销（唤醒依赖方）。同作用域重名抛错。
- `ctx.accessor(name, { get, set? })`：定义由 get/set 钩子支撑的计算型 context 属性；随 fiber 卸载移除。
- `ctx.mixin(name, keys)` / `ctx.mixin(source, keys)`：把服务成员直接暴露到 `ctx`（如 `ctx.on` 转发到 `ctx.events.on`，方法绑定到该服务）；随 fiber 卸载移除。

> 来源（一手）：https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-api/context.md 与 `vendor/cordis/src/{context,reflect}.ts`。

### 2.4 scope forking 与 dispose 语义小结

- “作用域分叉（scope forking）”在 v4 = `extend()` 派生原型子 context；服务隔离 = `isolate()`；配置拦截 = `intercept()`。三者都不改动父 context（copy-on-write 原型链）。
- 事件监听过滤也通过 context 实现：每个 context 可携带一个 **listener filter**（`Context.filter` symbol，`ctx[Context.filter]`），每次事件分发都会查询它（见 §4.4）。
- dispose 语义：所有注册都是 effect；卸载按 fiber 为单位，disposer 逆序、async 并发；子插件随父插件递归卸载。

---

## 3. Services（服务）

### 3.1 服务定义与提供

- 基类 `Service`（`vendor/cordis/src/service.ts`）：在 `ctx` 上暴露具名 API 的抽象基类。子类在构造器调用 `super(ctx, name)`——服务**立即注册**，并随所属 fiber 自动移除。
- `super(ctx, name)` 内部调用 `ctx.reflect.provide(name, this, this[Service.check])`（`service.ts` 构造器），等价于 `ctx.provide(name, value)`。
- `name ??= this.constructor['provide']`：服务名默认取静态 `provide` 字段。
- 若服务带 `[Service.invoke]` 执行体，则实例变为**可调用对象**（如 `ctx.logger()`）。
- 消费方通过 `inject` 或 `ctx.get(name)` 获取；类型上通过 `declare module '@deepseek-ai/cordis' { interface Context { <key>: <Type> } }` 的 **declaration merging** 把键加进 `Context` 接口（编译期，无运行时代码）。

DSH 教程第三章的完整例子（https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-tutorial/03-services.md ）：

```ts
import { Service, type Context } from '@deepseek-ai/cordis'

declare module '@deepseek-ai/cordis' {
  interface Context { greeter: GreeterService }
}

export class GreeterService extends Service {
  constructor(ctx: Context) { super(ctx, 'greeter') }
  greet(who: string) { return `Hello, ${who}!` }
}

export const name = 'greeter'
export function apply(ctx: Context) { ctx.plugin(GreeterService) }
```

消费方：

```ts
export const name = 'consumer'
export const inject = ['greeter']
export function apply(ctx: Context) { console.log(ctx.greeter.greet('world')) }
```

### 3.2 `inject`：声明依赖

- `inject` 有数组/对象两种形式（`Inject` 类型，`vendor/cordis/src/registry.ts`）：数组形式仅请求服务；对象形式把每个服务名映射到可选 intercept config。
- `ctx.inject(deps, callback)` 是 `ctx.plugin({ inject, apply: callback })` 的简写：当所需服务可用时执行 callback，且**每当所需服务变化时卸载并重跑**。
- **依赖在加载后仍被跟踪**：若所需服务在运行中消失（其 provider 被卸载或被热替换），所有依赖方插件也会被卸载，并在服务恢复时重新加载——从而避免运行中的消费者持有不可用服务的引用。这也是“服务替换”可配置化的基础。
- 可选依赖：不用 `inject`，在 `apply` 内部用 `ctx.get(name)`（返回 `undefined` 表示未提供）。

### 3.3 intercept（配置拦截 / provider 无关的服务配置）

- `inject` 的对象形式 / `ctx.intercept(name, config)` / loader entry 的 `intercept` 字段，都会把一段 config 合并进该服务在插件 context 下的“解析后 config”。
- 合并规则（`Service[symbols.resolveConfig]`）：祖先条目优先（更靠近根的条目先合并），`base` 前置、`head` 后置；服务若声明 `Config.merge` 则用其合并，否则浅 `Object.assign`。
- 典型用途：loader 服务自身声明 `Loader.Intercept = { await?: boolean }`，让依赖 `loader` 的插件在 loader entries 尚在加载时保持 PENDING（`vendor/loader/src/index.ts` 的 `[Service.check]`）。

### 3.4 隔离状态 vs 共享状态

- 默认：同一服务名在一个作用域内**唯一**（同作用域重名 `provide` 抛错 `service "x" has been registered at <fiber>`）。
- 隔离通过 `ctx.isolate(name)` 或 loader 的 `isolate` entry 字段实现：不同 label 各持一份实现。
- Loader 层有 `LocalRealm`（entry 本地隔离，label 后缀 `#<id>`）与 `GlobalRealm`（具名共享隔离，label 后缀 `@<label>`）两种 realm（`vendor/loader/src/config/isolate.ts`）。`isolate: { shell: true }` = 每个 entry 本地隔离；`isolate: { shell: 'shared-label' }` = 同一 label 的 entry 共享同一隔离实例。
- DSH 文档的服务隔离示例（https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/framework/service.md#service-isolation ）：两个 group 各自 `isolate: { shell: true }`，则 `plugin-a` 与 `plugin-b` 各看到自己组的 Bash 实例（如 `timeoutMs` 5000 vs 60000），互不影响。

### 3.5 `Service` 的静态符号（扩展点）

`vendor/cordis/src/service.ts` 定义：`Service.init`（类插件构造后运行实例方法）、`Service.check`（传给 `ctx.provide` 的可用性谓词）、`Service.config`（phantom intercept-config 类型参数）、`Service.invoke`（使服务可调用的调用体，如 `ctx.logger()`）、`Service.extend`（派生扩展服务实例）、`Service.tracker`（context 追踪元数据）、`Service.resolveConfig`（上文 intercept 解析）。这些符号键均为 `Symbol.for('cordis.*')`（`vendor/cordis/src/utils.ts`）。

---

## 4. Events（事件）

### 4.1 五种 dispatch mode

`vendor/cordis/src/events.ts` 定义 `DispatchMode` 与五个方法（也 mixin 到 `ctx`）：

| Mode | 调用 | 语义 |
|---|---|---|
| `emit` | `ctx.emit(name, ...args)` | 同步广播；忽略返回值，不 await 返回的 promise |
| `parallel` | `await ctx.parallel(name, ...args)` | 所有监听器并发执行，一起 await（`Promise.allSettled`，有错抛 `AggregateError`） |
| `serial` | `await ctx.serial(name, ...args)` | 按注册顺序 await；第一个非 `null/false/undefined`（bail）返回并停止后续 |
| `bail` | `ctx.bail(name, ...args)` | `serial` 的同步版 |
| `waterfall` | `ctx.waterfall(name, ...args, next)` | around-middleware，见 §4.3 |

dispatch mode 是事件公开契约的一部分。DSH 约定新事件用 `@mode` JSDoc 标签标注，供生成目录核对声明与分发点（`docs/cordis-primer.md`）。

### 4.2 类型化事件（declaration merging）

- 事件名经 TypeScript **declaration merging** 声明：`declare module '@deepseek-ai/cordis' { interface Events { 'stats/report'(name: string, count: number): void } }`。
- 然后 `ctx.emit('stats/report', ...)`、`ctx.on('stats/report', (name, count) => ...)` 全类型化。
- 命名约定 `namespace/action`（教程第四章，https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-tutorial/04-events.md ）。DSH 的 AGENTS.md 进一步要求：事件 JSDoc 需 `@mode` 与 payload `@param`；作用域键缺 payload 时需 `@dshScopeScan unsupported`。

### 4.3 waterfall 语义（拦截与短路的机制）

`ctx.waterfall(name, ...args, next)`：每个监听器收到 `(...args, next)`。调用 `next()` 委派给下一个监听器（最终是内置行为）；不调用 `next()` 即**否决（veto）短路**剩余链条。`next()` 的返回值沿链回传，监听器可包装/替换它。

纪律（DSH `docs/cordis-primer.md` 与 AGENTS.md）：**只观察/注解的 waterfall 监听器必须调用 `next()`**；不调用即刻意短路。DSH 用 waterfall 实现可包装/回答的决策点（如 `agent/request` 替换模型调用配置、`approval/request` 由策略代为回答）。

### 4.4 hooks 与过滤（topic selection / event bus 语义）

- `ctx.on(name, listener, options?)`：登记监听器，返回 disposer；`options` 可为布尔（`prepend` 简写）或 `EventOptions { prepend?, global? }`。
- `ctx.once(name, listener, options?)`：首调后自 dispose。
- `prepend: true`：把监听器插入到同事件已有监听器之前。
- `global: true`：忽略 context filter 检查（见下）。
- **过滤（topic selection）**：`EventsService.dispatch()` 在解析监听器时执行过滤——`const filter = thisArg?.[Context.filter]`，然后 `.filter(hook => hook.global || !filter || filter.call(thisArg, hook.ctx))`。即：
  - 分发方法的第一个参数可以是显式 `thisArg`（作为监听器的 `this`，同时用于过滤）。
  - 若 `thisArg` 携带 `[Context.filter]`（一个 `(listenerCtx) => boolean`），则只有 `global` 监听器或通过 filter 的监听器收到事件。
  - 这就是 DSH 的“作用域过滤分发（scoped dispatch）”在 Cordis 层的机制底座：事件针对某 agent 活动时，以该 agent 的 scope carrier 作为 `thisArg` 分发，filter 只放行无标签监听器与主题自身监听器（见 `docs/glossary.md` 的 `agent-scope`）。
- **事件总线语义**：监听器随所属 fiber 自动 dispose（`register()` 内部就是 `ctx.fiber.effect(...)`，返回 `() => this.unregister(...)`）。`internal/` 前缀事件为框架内部事件。

### 4.5 内置框架事件（`internal/*`）

`vendor/cordis/src/events.ts` 的 `Events` 接口：`internal/plugin`（fiber 创建 / uid 清除）、`internal/status`（fiber 状态变化）、`internal/config`（waterfall，注入激活后解析原始 config）、`internal/service`（服务绑定拦截钩子，无核心 producer）、`internal/update`（waterfall，应用 fiber config 更新，跳过 `next()` 否决）、`internal/get`（waterfall，经 context proxy 读服务）、`internal/set`（waterfall，写服务）、`internal/listener`（bail，监听器注册拦截，非空返回替代注册）、`internal/dispatch`（非 internal 事件分发前的诊断）。

DSH 的 `docs/cordis-api/inherited.md` 还列出 loader/hmr 增补事件：`exit`、`loader/config-update`、`loader/entry-init`、`loader/partial-dispose`、`loader/patch-context`、`hmr/change`、`hmr/reload`。

---

## 5. Loader 与配置（cordis.yml）

### 5.1 Loader 是插件，提供 `ctx.loader` 服务

关键提交：`feat(loader): loader as a cordis plugin`（https://github.com/cordiverse/cordis/commit/fd408a422375972b4ff02a9647063919d055b133 ）。v4 中 loader 是 `@cordisjs/plugin-loader`（DSH 里为 `@deepseek-ai/cordis-plugin-loader`），一个 `Service`，通过 `declare module` 增补 `interface Context { loader: Loader }`（`vendor/loader/src/index.ts`）。挂载方式：

```ts
import { Context } from 'cordis'
import Loader from '@cordisjs/plugin-loader'
const root = new Context()
await root.plugin(Loader, { baseUrl: import.meta.url })
```

Loader 核心 API（`vendor/loader/README.md`）：

| API | 作用 |
|---|---|
| `loader.create(options, parent?, position?)` | 新增并启动 entry |
| `loader.update(id, options, parent?, position?)` | 更新/移动/重启 entry |
| `loader.remove(id)` | 停止并删除 entry |
| `loader.resolve(id)` | 按 id（含嵌套 `a:b`）解析 entry |
| `loader.resolveGroup(id)` | 解析根组或嵌套组 |
| `loader.await()` | 等待挂起的 import 与 fiber 重载 |
| `loader.locate(fiber?)` | 返回拥有某 fiber 的 entry id |

`@cordisjs/plugin-include` 提供文件后端的 loader tree（读写 YAML/JSON），是 `cordis.yml` 的落地实现。

### 5.2 cordis.yml 的 schema（entry list）

`cordis.yml` 是**顶层数组**，每个元素是一个 entry（`EntryOptions`，`vendor/loader/src/config/entry.ts`）：

| 字段 | 说明 |
|---|---|
| `id` | 所在 entry tree 内的稳定 id（用于 diff/更新/删除） |
| `name` | 被 import 的模块 specifier（相对路径或 npm 包名） |
| `config` | 传给插件的配置 |
| `group` | 标记为嵌套组，其 `config` 是子 entry 列表 |
| `disabled` | 停止该 entry 及其后代，但不删除 |
| `inject` | 为该 entry 追加所需服务或 intercept config |
| `intercept` / `isolate` | 服务配置拦截 / 服务隔离（由 loader 的 isolate 子插件增补，`vendor/loader/src/config/isolate.ts`） |

最小示例（`vendor/include/README.md`）：

```yaml
- id: timer
  name: '@cordisjs/plugin-timer'
- id: app
  name: ./plugins/app
  config:
    message: hello
```

Include 插件 config：`path`（YAML/JSON 路径，相对 `ctx.baseUrl` 解析）、`initial`（文件缺失时写入的初始列表）、`patches`（读后应用的运行时补丁）、`enableLogs`（loader 日志开关）。文件缺失且无 `initial` 时抛错；有 `initial` 则写出后回读。

### 5.3 插件解析（plugin resolution）

`EntryTree.import(name)`（`vendor/loader/src/config/tree.ts`）：

1. `name` 以 `cordis:` 开头 → 读 `ctx.loader.builtins[name.slice(7)]`（内置）。
2. 否则，若存在 Node 内部模块 loader（`ModuleLoader.fromInternal()`，经 `node-addon-require-builtin` 或 `--expose-internals` 取得，兼容 Node 22/23 v1 与 Node 24+ v2 形状），用 `internal.import(name, baseUrl, {})`。
3. 否则，`name` 以 `.` 开头 → `import(new URL(name, baseUrl).href)`（相对 base URL）；否则 `import(name)`（裸包名）。

模块导出经 `Loader.unwrapExports()` 归一化 ESM/CJS/default 导出形状（`exports.default ?? exports`，处理 `__esModule`）。DSH 约定 Raw/Web `cordis.yml` 裸插件必须出现在其 resolver manifest 的 `dependencies` 中（由 `verify-cordis-config` 强制）。

### 5.4 `!!js` 计算表达式

- `@cordisjs/plugin-include` 用 js-yaml 的 `Type('tag:yaml.org,2002:js')` 把 `!!js` 标量解析为 `{ __jsExpr: '<expr>' }`（`vendor/include/src/index.ts` 的 `JsExpr` / `entryListSchema`）。
- Loader 在 entry 激活、声明注入已激活之后，对 entry 的 `config` 做 `interpolate(ctx, config)`——递归把 `__jsExpr` 节点替换为 `evaluate(ctx, expr)`（`new Function('ctx','expr','with(ctx){ return eval(expr) }')`，`vendor/loader/src/config/utils.ts`）。
- 用法（DSH 教程第五章，https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-tutorial/05-config.md ）：

  ```yaml
  - name: './config-demo.ts'
    config:
      greeting: !!js process.env.DEMO_GREETING ?? 'Hello'
  ```

- **DSH 扩展**：`disabled: !!js ...` 在每次挂载决策时对 loader context 求值（原始节点留在 options 里，写回保持 `!!js` 形式）；`disabled` 是唯一被插值的元数据字段，其余元数据（`name/id/inject/…`）保持字面量。`!!js` 只作用于 `config` 与 entry 的 `disabled` 字段（DSH `docs/cordis-primer.md` “Loader Configuration”）。注意 `!!js`（双感叹号）而非 `!js`（AGENTS.md 强调 "allows `!!js` (never `!js`)"）。
- Group/Include 作为“tree carrier”（声明 `EntryGroup.key`）保持自身 config 字面量，以便其嵌套行里的 `!!js` 在各行自己的 fiber 中惰性求值（`vendor/loader/src/index.ts` 的 `internal/config` 钩子）。

### 5.5 filters / patches（过滤与补丁）

- `@cordisjs/plugin-include` 的 `patches` 是对 entry 列表应用的**运行时补丁**（`PatchOptions`，`vendor/include/src/index.ts`）：每个 patch 可 `id` 定位目标、`name` 校验（不匹配则警告跳过）、覆盖任意字段，或 `insert`（无 `id` 时追加到顶层；有 `id` 且目标是 group 时插入其子列表）。
- `applyEntryPatches(data, patches, warn)` 是导出的纯函数（DSH 本地修改 #11），供 `dsh --dump-config` 与挂载共用同一 patch 语义；输入永不被原地修改，结果为 detached clone；插入的行会被立即索引，以便**同一列表里后出现的 patch 可配置/禁用先前插入的行**。
- **排序/顺序**：entry **并发启动**，列表位置不保证加载顺序；顺序由服务依赖（`inject`）决定（教程第一章明确：“Entries start concurrently, so list position guarantees nothing… ordering comes from service dependencies, not from position in the file.”）。这对应 §6 的依赖解析。

### 5.6 groups（分组）

`@cordisjs/plugin-group`（DSH `@deepseek-ai/cordis-plugin-group`，默认导出 loader 的 `Group`）：

```yaml
- id: tools
  name: '@cordisjs/plugin-group'
  group: true
  config:
    - id: logger
      name: '@cordisjs/plugin-logger-console'
```

- 组自身永远视为启用；禁用组 entry 会阻止其子 entry 运行。
- 嵌套 entry id 用 `:` 分隔（`EntryTree.sep = ':'`），如上例为 `tools:logger`。
- 组作为**一个单元**加载/卸载；可 `isolate` 服务（§3.4）。
- 组更新是事务性的（DSH 本地修改 #8）：候选并发启动、收集全部结果、失败时撤销新增并恢复旧条目。

### 5.7 config 校验

插件导出 `Config` 作为 **Standard Schema** 校验器（`@standard-schema/spec`），`RegistryService.plugin()` 在启动前用 `runtime.Config['~standard'].validate(config)` 校验，失败抛 `ValidationError`（`vendor/cordis/src/fiber.ts`）。DSH 用 Schemastery（`Schema.object(...)`）产出 schema。坏 config 使 fiber 进入 `FAILED`、加载失败，**绝不半配置启动**（"fail loud"）。同步校验仅支持（async 校验抛 `TypeError('Async config validation is not supported')`）。插件 `Config` 也可以是 `Transform`（`schema: true` + `Config: (S) => T`，把用户 config 转运行时 config）。

---

## 6. Registry 与发现（Registry & discovery）

### 6.1 RegistryService（内置 `ctx.registry`）

`vendor/cordis/src/registry.ts`：`ctx.registry` 是核心内置（不再需要单独的 registry 包）。它规范化插件形态、跟踪插件 runtime、启动 fiber、提供对活跃插件 callback 的 map 式遍历：

- `registry.resolve(plugin)`：把三种形态解析为可执行 callback（`typeof plugin === 'function'` 直接返回；对象取其 `apply`）。
- `registry.get/has/delete(plugin)`：查/删 runtime；`delete` 会 dispose 该插件的所有 fiber 并移除 runtime（对应提交 `feat: use ctx.registry.delete() when removing plugins`，https://github.com/cordiverse/cordis/commit/99a7cc6f91c408d18e9165215f7d3afa052f5d1a ）。
- `registry.size / keys() / values() / entries() / forEach()`：Map 式遍历已注册 runtime。
- `registry.plugin(plugin, config, getOuterStack?)`：创建（或复用）runtime，再在当前 context 启动新 fiber；非法形态或当前 fiber 已 dispose 抛错。
- 每个 `Plugin.Runtime` 记录：`name`、`fibers`（`DisposableList<Fiber>`）、`callback`（registry 身份键）、`Config`。一个插件 callback 的所有 fiber 共享一个 runtime。

### 6.2 插件名 / 身份

- 插件展示名 `name`（`Plugin.Base.name`，即 `export const name = ...` 或函数名），用于 fiber 诊断与 logger 名。`fiber.name` 继承最近具名祖先，否则 `'root'`。
- 提供名 `provide`（`Plugin.Base.provide`，字符串或数组）供 `Service` 与 loader 读取（声明“我提供哪些服务”）。
- 依赖声明 `inject`、intercept 消费声明 `intercept`（`Dict<boolean>`）。
- `@Inject(name, config?)` 装饰器：类上并入静态 `inject`；方法上延迟到服务可用时再调用。

### 6.3 依赖解析（dependency resolution）

`Fiber` 的依赖状态机（`vendor/cordis/src/fiber.ts`）：

- 构造时把 `inject` 解析为 map（`Inject.resolve`），并为每条带 intercept config 的依赖挂到子 context 的 intercept。
- 发布 `internal/plugin` 通知**之后**才解析依赖（loader 可能在该通知中扩展 `inject`），对每个注入名 `_checkImpl(name)`（取当前 isolation label 下的 `Impl`，有 `check` 谓词则执行）。
- `_refresh()` 计算 epoch：所有注入服务的 `fiber.uid` 拼接；只要缺一个实现，epoch = `INACTIVE` → fiber 保持 `PENDING`。
- 服务变化经 `ReflectService.notify(names)` 广播：遍历 registry 所有 runtime/fiber，对注入这些名字的 fiber 重查实现并 `_refresh()`（触发 load/unload），并 emit `internal/service`（带 filter 限定作用域）。这正是“依赖方随服务增删自动重载”的机制。
- `ctx.get(name, strict=false)` 可绕过 inject 直接读（严格模式要求 provider ACTIVE）。

### 6.4 discovery（发现）

- 服务发现：消费者**不 import 具体实现**，通过 `ctx.<key>`（proxy 经 `internal/get` waterfall + 沿 fiber 链向上查 `fiber.store`）或 `ctx.get(name)` 解析。
- 插件发现：`ctx.registry.values()` 枚举所有 runtime/fiber（教程第六章用其诊断 PENDING 状态，https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-tutorial/06-composition-and-hmr.md ）。
- 模块发现：loader 按 specifier 解析（§5.3），支持 `cordis:` 内置、Node 内部 loader、相对/裸 specifier。

---

## 7. 典型示例（canonical code shapes）

以下均为 DSH 教程/源码中的规范形态（每段已在正文给出出处）。

### 7.1 最小函数插件 + cordis.yml

```ts
import type { Context } from '@deepseek-ai/cordis'
export const name = 'hello'
export function apply(ctx: Context) { console.log('hello from my first plugin') }
```

```yaml
- name: './hello.ts'
```

### 7.2 带 effect 的资源与子插件

```ts
export function apply(ctx: Context) {
  const fiber = ctx.plugin(heartbeat)          // 从代码挂载子插件，返回 Fiber
  ctx.effect(() => {                            // 外部资源包成 effect
    const timer = setTimeout(async () => { await fiber.dispose(); process.exit(0) }, 700)
    return () => clearTimeout(timer)            // disposer：卸载时运行
  })
}
```

### 7.3 服务定义 + 消费者

见 §3.1（`GreeterService` / `consumer` 例子）。

### 7.4 类型化事件 + waterfall 短路

```ts
declare module '@deepseek-ai/cordis' {
  interface Events { 'demo/transform'(input: string, next: () => Promise<string>): Promise<string> }
}
export function apply(ctx: Context) {
  ctx.on('demo/transform', async (input, next) => (await next()).toUpperCase())   // 包装下游结果
  ctx.on('demo/transform', async (input, next) => {                               // 决策短路
    if (input.includes('blocked')) return '** blocked **'
    return next()
  })
}
```

### 7.5 带 schema 的配置插件

```ts
import Schema from '@deepseek-ai/schemastery'
export interface Config { greeting: string; targets: string[] }
export const Config: Schema<Config> = Schema.object({
  greeting: Schema.string().default('Hello'),
  targets: Schema.array(String).default(['world']),
})
export function apply(ctx: Context, config: Config) { /* config 已完整校验 */ }
```

### 7.6 上游 README 快速上手（vendored `vendor/cordis/README.md`）

```ts
import { Context, Service } from 'cordis'
declare module 'cordis' {
  interface Context { counter: Counter }
  interface Events { 'app/ready'(message: string): void }
}
class Counter extends Service {
  value = 0
  constructor(ctx: Context) { super(ctx, 'counter') }
  next() { return ++this.value }
}
const greeter = Object.assign((ctx: Context) => {
  ctx.on('app/ready', (message) => ctx.logger.info('%s #%d', message, ctx.counter.next()))
}, { inject: ['counter'] })
const root = new Context()
await root.plugin(Counter)
await root.plugin(greeter)
root.emit('app/ready', 'started')
await root.fiber.dispose()
```

### 7.7 HMR 组合

```yaml
- id: logger
  name: '@deepseek-ai/cordis-plugin-logger-console'
- id: timer
  name: '@deepseek-ai/cordis-plugin-timer'
- id: hmr
  name: '@deepseek-ai/cordis-plugin-hmr'
  config:
    root: ['.']
- id: hello
  name: './hello.ts'
```

---

## 8. Cordis → DeepSeek Harness 概念映射

DSH 是“vendored Cordis 上的、基于插件的 agent harness”，因此 Cordis 概念被大量直接复用并加了领域约定。

### 8.1 vendoring 与 rescope

- DSH 将 Cordis 及其基础库**源码 vendored** 进 `vendor/`（不再依赖 npm），以便“完全拥有框架层（可审计、可打补丁、可钉版本）”（https://github.com/deepseek-ai/deepseek-harness/blob/master/vendor/README.md ）。
- 全部改名为 `@deepseek-ai` scope：`cordis` → `@deepseek-ai/cordis`；`@cordisjs/plugin-<x>` → `@deepseek-ai/cordis-plugin-<x>`。目录名与版本号不变。
- 上游 SHA（manifest）：`cordis` 4.0.0-rc.7（package.json 显示 4.0.1）、`@cordisjs/plugin-loader` 1.0.0-rc.5 来自 https://github.com/cordiverse/cordis @ `56b3d4f725681cf4556c1a8695a709cc3b6eed74`；`include` 1.0.4 / `group` 1.0.0 / `timer` 1.1.2 / `hmr` 1.0.15 / `logger-console` 1.0.0 来自 https://github.com/deepseek-harness/cordis @ `abb0a307cb1d3b0947f455d590cf5ba922d4caa4`；`cosmokit` 1.8.1、`schemastery` 3.18.0。→ 注意：include/group/timer/hmr/logger-console 来自 **DSH 自己的 cordis fork**，core 与 loader 来自上游 cordiverse。
- 18 条本地修改记录在 `vendor/README.md`（生命周期加固、事务化 loader/include、`!!js`/`disabled` 插值、`@deepseek-ai` rescope 等）。

### 8.2 capability seam（能力接缝）＝ Service Definition / Provider / Consumer

DSH 把“可替换能力”建模为三角色（`docs/glossary.md` 的 `capability-seam`）：

- **Service Definition**：拥有 `ctx.<key>` 与词汇类型的 Cordis `Service`（抽象类如 `ShellExecutor`，或具体 registry 如 `WebRuntime`，**从不是 TS `interface`**）。
- **Service Providers**：提供该服务的一个或多个实现。
- **Consumers**：`inject` 该服务的消费方。

典型：`packages/shell` = `dsh-shell`（Service Definition）、`dsh-bash-local` / `dsh-bash-sandbox`（providers）、`dsh-tool-bash`（Consumer）。一个包可同时拥有多个角色（`dsh-llm` 同时拥有 Service Definition 与 Consumer）。AGENTS.md 强调：“能力接缝 = Service Definition / Service Provider / Consumer 三角色，**永远完整、绝不止一个角色**；仅当角色独立演化时才拆分”。这直接落地了 Cordis 的 §3（服务）与 §1（一切皆插件）。

### 8.3 “scope”一词的两义（易混淆）

DSH 在 Cordis 之上复用“scope”但含义不同（`docs/glossary.md` 的 `agent-scope`）：

- Cordis v4 的 `ctx.isolate`/作用域 = 服务实例隔离（§2.2、§3.4）。
- DSH 的 **agent-scope** = 按 agent 的注册可见性（全局 vs 归属某 scope key），其分发过滤机制正是 Cordis 事件系统的 `thisArg` + `Context.filter`（§4.4），与经典 Cordis 的 `ctx.scope`（隔离作用域）**不是一回事**。DSH 的 `ctx.fiber`/`ctx.isolate` 才是 Cordis 原生隔离，agent-scope 是 DSH 自建概念。

### 8.4 事件与注册约定（AGENTS.md 落地 Cordis）

- “**Registrations are effects**”：一切贡献都经 `ctx.effect()` / `ctx.on()`；registry 的 `register()` 返回 disposer。
- “**Waterfall listeners MUST call `next()`**”：来自 Cordis 的 waterfall 语义（§4.3）。
- 类型化事件用 declaration merging + 可合并扩展的 map；事件 JSDoc 需 `@mode` 与 payload `@param`。
- “**Switch on discriminant tags**”：闭包联合用 `assertNever`，可合并扩展联合落入文档化默认分支。
- “**Model-visible ⟺ logged**”：凡到达模型请求的内容必须可由 session log 重建——这是 DSH 在 Cordis 事件系统之上的持久化不变量。
- 服务方法公开文档化参数与返回值；`SessionEventMap` 成员默认 required-on-read。

### 8.5 DSH 直接复用 Cordis 的位置

- `docs/cordis-primer.md`：DSH 自己的“Cordis 五条理念”浓缩。
- `docs/cordis-api/*`：由 `scripts/gen-cordis-catalog.ts` 从 vendored 源码生成、`verify-cordis-catalog` 校验的 API 参考。
- `docs/cordis-tutorial/01…07`：逐步教程，第 7 章把 Cordis 范式接到真实 harness 服务（`ctx.tools.register(defineTool(...))`、`tools/result` 事件、`inject: ['tools']`）。
- 启动器 `vendor/cordis/bin.js`：创建 root `Context` + 挂载 Loader + 读 `./cordis.yml`。
- 示例叶子 `examples/**/cordis.yml`（如 `examples/headless-agent/cordis.yml`）即完整应用组合。

---

## 9. 来源列表（Source list）

### 上游（cordiverse）

1. cordiverse/cordis 仓库：https://github.com/cordiverse/cordis
2. cordiverse/paper（《一种时空可组合性的编程范式》）：https://github.com/cordiverse/paper
3. Cordis 文档站（当前 v4 API）：https://cordis.io/ ；Context API：https://cordis.io/zh-CN/api/core/context.html ；Loader（实验性）：https://cordis.io/zh-CN/api/std/loader.html ；配置：https://cordis.io/zh-CN/guide/starter/config.html
4. 关键提交：loader 变为插件 https://github.com/cordiverse/cordis/commit/fd408a422375972b4ff02a9647063919d055b133 ；`ctx.inject()` 取代 `ctx.using()` https://github.com/cordiverse/cordis/commit/b5cd65aa27a18b90aeb6c8f036570cf1a374277a ；`ctx.registry.delete()` 移除插件 https://github.com/cordiverse/cordis/commit/99a7cc6f91c408d18e9165215f7d3afa052f5d1a ；`ctx.collect()` https://github.com/cordiverse/cordis/commit/3649a2a51815c359521bdc7037142d84f7e6f021 ；events `this` 参数 https://github.com/cordiverse/cordis/commit/e99a3444884eaa3722543d7af105fe9090b6b41a ；services and mixins https://github.com/cordiverse/cordis/commit/86ea62d5b9e4ead60175ee2b7b6409ffb24e8361 ；lifecycle→events 重命名 https://github.com/cordiverse/cordis/commit/15a8c3de50f9e8dcec24074a12a4980591dcbd80 ；traceable object https://github.com/cordiverse/cordis/commit/90257b25bedb88cb9db94c8b005b0737f01a7f8c
5. cordiverse/webui（Cordis App 的 WebUI）：https://github.com/cordiverse/webui

### 经典 Cordis / Koishi（用于谱系对照）

6. Koishi Context API（含经典 `ctx.scope`/`ctx.select` 语义）：https://koishi.js.org/api/core/context.html ；raw：https://raw.githubusercontent.com/koishijs/koishi/15bb8ba9d48aea26dfd4b4d559322c6bc0d4755d/docs/api/core/context.md
7. DeepWiki 对 Koishi Context 的梳理：https://deepwiki.com/koishijs/koishi/2.1-context
8. Koishi 论坛“关于服务与依赖”：https://forum.koishi.xyz/t/topic/3246/2
9. npm 版本线索：`cordis` https://socket.dev/npm/package/cordis/overview/2.3.1 （及 1.5.2 / 2.1.1）、`@cordisjs/core` https://socket.dev/npm/package/@cordisjs/core/overview/3.17.7

### DeepSeek Harness（vendored 源码 + 本地文档，一手权威）

10. vendoring 清单与 SHA：https://github.com/deepseek-ai/deepseek-harness/blob/master/vendor/README.md
11. 概念入门：https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md （中文版 cordis-primer.zh.md）
12. API 参考：https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-api/context.md 、.../events.md 、.../fiber.md 、.../registry.md 、.../service.md 、.../inherited.md
13. 教程：https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-tutorial/01-first-plugin.md （02-lifecycle-and-effects / 03-services / 04-events / 05-config / 06-composition-and-hmr / 07-into-the-harness）
14. 服务与依赖（含服务隔离）：https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/framework/service.md
15. 术语表：https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/glossary.md
16. vendored 源码（本地读，路径即 GitHub 对应路径）：`vendor/cordis/src/{context,events,fiber,logger,reflect,registry,service,utils,index}.ts`、`vendor/loader/src/{index,internal}.ts`、`vendor/loader/src/config/{entry,group,isolate,tree,utils}.ts`、`vendor/include/src/index.ts`、`vendor/group/src/index.ts`、`vendor/{cordis,loader,include,group}/README.md`

### 其它

17. Standard Schema 规范：https://standardschema.dev/
18. Schemastery：https://github.com/shigma/schemastery
19. 社区综述（DSH 第三方文章，非官方）：https://www.cnblogs.com/sing1ee/p/22455466

---

## 附：无法核实项清单

- **经典 Cordis `ctx.scope` / `ctx.select` / `ctx.using` 的精确签名与语义**：未能抓取 koishi.js.org 原文（沙箱禁网），仅能据 Koishi Context 页标题与历史提交推断其存在与被取代关系；具体签名与行为标注 **[unverified]**。
- **cordis.js.org 是否仍在线 / 是否 301 至 cordis.io**：未能访问验证，**[unverified]**（搜索仅返回 cordis.io 与 koishi.js.org 两处当前在线文档）。
- **上游 master 的 README 与 docs 目录结构**：以 vendored 快照（pin 于上述 SHA）为准；上游 master 可能已继续演进，**[unverified]**。
