# DeepSeek Harness 插件开发速查表

> 一页式速查。细节回到 [plugin-dev-guide.md](plugin-dev-guide.md) 与 [references](../references/)。

## 插件骨架

```ts
import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'
import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'my-plugin'          // 必须
export const inject = ['tools']          // 依赖的服务; 无依赖可省略

export interface Config { limit: number }
export const Config: Schema<Config> = Schema.object({
  limit: Schema.number().default(10),    // Schemastery schema, 不是普通对象
})

export function apply(ctx: Context, config: Config) {
  ctx.effect(() => {                     // 注册=effect, 卸载自动撤销
    const timer = setInterval(() => {}, 1000)
    return () => clearInterval(timer)
  })
  ctx.on('tools/result', (exec, result) => { /* ... */ })
  ctx.tools.register(defineTool({
    name: 'my_tool',
    description: '…',
    parameters: { x: { type: 'string', required: true } },
    output: { schema: { type: 'string' }, render: (_a, v) => [{ type: 'text', text: v }] },
    async execute(args, exec) { return `hi ${args.x}` },  // 尊重 exec.signal
  }))
}
```

其他形态：对象 `export default { name, inject, apply }`；类 `class X extends Service { static inject=[...]; constructor(ctx){ super(ctx,'key') } }`（提供服务时用）。

## ctx 核心 API（Cordis）

| 用途 | API |
|---|---|
| 注册自定义资源+清理 | `ctx.effect(() => disposer)` |
| 监听事件 | `ctx.on(name, handler)`（自动清理） |
| 广播 / 无返回值 | `ctx.emit(name, payload)` |
| 短路取值 | `ctx.bail(name, input)`（首个非 null/false/undefined 即止） |
| 顺序取值 | `await ctx.serial(name, input)` |
| 管线 | `await ctx.waterfall(name, input, init)`；监听器**必须 `next()`** |
| 子上下文 | `ctx.extend(meta)` / `ctx.isolate(name, label?)` / `ctx.intercept(name, config)` |
| 挂子插件 | `ctx.plugin(plugin)` → Fiber；`await fiber.dispose()` |
| 可选服务查询 | `ctx.get('metrics')?.x()` |
| 日志 | `ctx.logger(name)` |

生命周期：`PENDING → LOADING → ACTIVE`（apply 抛错 → FAILED）；`ACTIVE → UNLOADING → DISPOSED`。依赖服务消失 → 自动卸载，恢复 → 自动重载。

## 事件派发四模式 + bail

| 模式 | await | 顺序 | 返回值 |
|---|---|---|---|
| emit | 否 | 注册序 | 无 |
| waterfall | 否 | 注册序 | 有（**不调 next() 即短路**） |
| parallel | 是 | 并行 | 无 |
| serial | 是 | 注册序 | 有（首个非空即止） |

类型声明（declaration merging）：

```ts
declare module '@deepseek-ai/cordis' {
  interface Events { 'my/event': (p: { id: string }) => void }
  interface Context { myService: MyService }   // 提供服务时
}
```

## cordis.yml / 分层

```yaml
# scratch-plugin/cordis.yml (--patch 覆盖层)
- insert:
    - id: hello
      name: '/absolute/path/to/scratch-plugin/src/my-plugin.ts'
      config: { greeting: 'Hi' }

# bundle: package.json 的 "dsh": {"bundle":{"patch":"./cordis.patch.yml"}}
# profile: "dsh": {"profile":{"bundles":["@deepseek-ai/dsh-base","my-bundle"]}}
# 生效顺序: bundles → profile cordis.patch.yml → $DSH_HOME/cordis.patch.yml → --patch
# 按 id 覆盖, 整行 config 替换(非深合并); 覆盖方必须重述全部键
# !!js 表达式(双感叹号)在注入服务就绪后求值; disabled 每次挂载时求值
```

命令：`dsh --profile web` · `dsh --profile headless "task"` · `dsh --profile X --dump-config` · `dsh plugin --profile X add/remove <pkg>` · `pnpm dsh web --patch ./scratch-plugin/cordis.yml`

安装形态（0811 起 repository-plugin 机制已移除，只剩两条通道）：
- **bundle 插件**（`"dsh":{"bundle":{"patch":"..."}}`）→ `dsh plugin add <pkg>` 进 `dsh.profile.bundles` 层栈，重启生效。
- **纯 cordis 插件**（无 `dsh.bundle`）→ `dsh plugin add <pkg>` 装依赖 + profile `cordis.patch.yml` 加 insert 行，**配置 HMR 实时生效**。
- git 源：`dsh plugin add "github:owner/repo#<sha>&path:<subdir>"`（pin commit；`prepare` 自包含构建 + profile `pnpm-workspace.yaml` allowBuilds；npm/tarball 免构建许可）。

## 常用内建服务（ctx 键）

`sessions` 会话日志/内存库 · `systemPrompt` 提示词组装 · `tools` 工具注册与受控执行管线 · `agents` Agent 注册表 · `agentLoop` 循环驱动器 · `llm` 模型适配器注册表 · `skills` 技能注册表 · `commands` 人类斜杠命令 · `approval` 一次性审批 · `jobs` 后台任务 · `fs` 文件系统缝 · `shell` bash 执行缝 · `subprocess` 子进程缝 · `terminals` PTY · `sandbox` 进程限制缝 · `codeRuntime` 代码执行 · `sessionPersistence` 持久化 · `settings` / `credentials` / `workspaceRegistry` / `goals` / `planMode` / `subagents` / `workflowEngine` / `storage`。
完整清单与每个方法的精确签名 → `references/official-docs/docs/capability-seams.md` + `docs/subsystems/*.md`（生成式 Cordis API 区）。

## 工具策略管线（执行顺序）

```
tools/pre-execute (waterfall, allow|deny|ask) → ctx.tools.guard() (单调 deny)
→ tools/execute (包裹, 仅可换 exec.signal) → execute(args, exec)
→ tools/post-execute (换 content/value/阻断/附上下文) → finalizeContent
→ tools/result (只读观察) → 持久化 tool/result (会话事件)
```

选择规则：策略门用 pre-execute；不可翻案的 deny 用 guard；超时/重试/指标用 execute；改结果用 post-execute；审计/采集用 result。
Code Mode：`await tools.<name>(args)` 免费获得；成功=最终规范 JSON 值；失败=`ToolCallError(name, toolName, message)`。

## UI 卡片（纯函数！只依赖 args(+result)，禁止 I/O/时钟/随机）

- `presentCall(args)` → `{card:'generic',title,kind?,rawInput?,content?,locations?}` | `{card:'terminal',title,description?,cwd?}` | `{card:'diff',title,diffs,locations?}`
- `presentResult(args,{content,isError,meta?})` → generic / terminal / diff / search(`shape:'matches'|'paths'`) / read / web(`kind:'search'|'fetch'`)
- 回放元数据：`output.presentationMeta(args, value)` → 持久化 `tool/result.meta`

## 三层能力缝（seam）模板

Definition（`dsh-my-cap`）：`export abstract class MyCapService extends Service { constructor(ctx){super(ctx,'myCap')} abstract execute(req): Promise<res> }` + Context 声明合并。
Provider（`dsh-my-cap-local`）：`export function apply(ctx){ ctx.plugin(class MyCapLocal extends MyCapService {...}) }`。
Consumer（`dsh-tool-my-cap`）：`inject = ['tools','myCap']`，`ctx.tools.register(defineTool({... execute: args => ctx.myCap.execute(...)}))`。
规则：不提前拆；Provider 与 Consumer 互不依赖；默认值走显式 `resolve(request): Spec`。

## LLM 适配器要点

`class MyAdapter extends LlmAdapter { async *stream(options): AsyncIterable<StreamChunk> }` → `ctx.llm.registerAdapter(['provider'], adapter)`。
Chunk 协议：`block-start` → `text-delta*` → `block-end`（完整块）→ … → `usage`（在 finish 前）→ `finish`（最后；`reason: {kind:'stop'|'tool-calls'}`）。无法满足的字段抛带稳定 code 的 `LlmError`。

## 红线（违反=挂门禁/错误行为）

1. 注册必须走 `ctx.effect()`/`ctx.on()`/服务 `register()`（返回 disposer）。注册在别的 ctx（如 `agent.ctx`）上的有**两个拥有者**——disposer 也要留在自己插件的 effect 里。
2. waterfall 监听器必须调 `next()`；不调=故意短路。改写 `agent/pre-step` 决策要**展开**（`{ ...decision, messages }`），否则 `startsRequestSeries` 之类字段会丢。
3. **用最弱的够用机制**：`ctx.tools.restrict()`（只移除）< `ctx.tools.guard()`（只拒绝）< waterfall 改写（依赖顺序）< `system-prompt/assemble`（整段替换）。最终结果只看 `tools/result`；只有要变换结果才用 `tools/post-execute`。
4. 模型可见 ⟺ 已记录：新模型可见输入必须新增会话事件（`SessionEventMap`）——**由宿主侧新增**，不是插件自己写（见第 10 条）。
5. 不得硬编码可调参数（判断：cordis.yml 能否改）；misconfig fail loud。要暴露给用户的实时字段用 `Volatile<T>` + `loader/volatile-update`（表单命名空间=profile 条目 id）。
6. 独立插件包：cordis 是 peerDependency（与宿主同身份：scoped `@deepseek-ai/cordis` 与 unscoped 混用会"双 Cordis 分裂"）；ESM；`dsh.bundle` 清单（`patch` **可为有序数组**）；git 安装配 `prepare` + `allowBuilds`；发布带 `lib/` 或 tarball。**共享实例的 dsh 包只放 peer + dev，绝不放 dependencies**（profile 内副本会静默遮蔽运行时；且 DSH **不校验** peer 范围）。
7. 必须交展示元数据：`locale/*.json` 的 `meta.title`/`meta.description` + 导出的 `./icon`（SVG/PNG/JPEG/WebP，≤256 KiB，必须在包内）。子路径插件**不读**自己的 `package.json`。
8. 文档双语成对；工具描述/提示词即行为；非平凡变更加 Agent Note；提交前跑最小检查集（dsh-pre-push-checks）。
9. 跨边界 opaque id 用 branded（`Branded<B>` from `dsh-brand`），从不裸 `string`。
10. **绝不要用新的 `type` 追加会话事件**：`SessionEventMap` 成员默认 required-on-read——不认识该事件类型的 build 会拒绝整份日志，除非该事件带上信封的 `ignorable: true` 标记；而运行时 `Session.append()` **无法**写这个标记（其第三参仅为 surface 事件的 `SurfaceIntent`）。插件状态要从既有事件推导，或用 inspection 找到的 storage 服务自持。只有结构格式变更才 bump `SESSION_FORMAT_VERSION`（当前 `4`；V3→V4 迁移把 tool 结果提升为 tool-role 消息、把消息 source 换成生产者自有的 `source.kind`）。对 `SessionEvent` 的 switch 仍落入文档化 `default`——**禁用 `assertNever`**（merge-extensible union）。
11. `agent.inject()` 的 `source` **不再接受**退役的 `{ kind: 'plugin', plugin: '<name>' }` 包装——先用 `MessageSourceMap` 声明合并自己的 kind。`inject` 不唤醒 agent（要唤醒用 `followup()`/`steer()`）。
12. **绝不在会话运行期间写 profile 的 `cordis.patch.yml`**（HMR 会重载：会话内工具会消失、在途 turn 被杀、最坏重建 `session-controller` 失败并永久失效，只能整进程重启）。不要手写 profile 的 `package.json`，不要在 profile 目录里跑 pnpm。
13. UI 插件：只渲染 slot 里的 React 组件（禁止 iframe 托管页面）；样式只用 `--dsw-alias-*` 主题 token；不 `require` 任何 Harness Client 包（抛错组件会把 slot 搞白）；`dsh.client.inject` **必须是静态数组**。
14. 性能：per-session 状态放 `ctx.sessionProjections`（纯同步 `apply`、忽略即同引用、纯 JSON + `stateVersion`）；等持久事件（`turn/end`/`assistant/message`/`tool/result`），实时 token 读 `agent/assistant-stream`；**不轮询 `agent/status`**。

## 社区实测坑速查（详见 guide §7.3 / community-repo-deep-dive.md）

- tsconfig 三件套：`moduleResolution: bundler` + `allowImportingTsExtensions` + `rewriteRelativeImportExtensions`（+ `lib:["ES2024"]`、显式 `types:["node"]`）。
- `tsc` 报错仍 emit → `tsc || exit 1` / `--noEmitOnError`；发布前 grep 产物无 `.ts` 残留。
- Windows junction 用 PowerShell `New-Item -ItemType Junction`；vitest 盘符大写 `C:/`。
- `DSH_PERMISSION_MODE=danger-full-access` 高风险（Windows 无沙箱后端、禁用审批）；`DSH_*` 放 `~/.dsh/.env` 会报错。
- 会话文件多帧 zstd：用 `scanZstdFrames`/`createZstdFrameDecoder`（`@deepseek-ai/dsh-session-persistence-jsonl/src/zstd.ts`）。
- npm：无作用域 `dsh` 是无关项目 node-dsh（shell）——官方包是 `@deepseek-ai/dsh`（`latest`=`next`=0.2.0-rc.2、`alpha`=0.2.1-alpha.1）；`@deepseek-ai/dsh-tools`、`@deepseek-ai/dsh-base`、`@deepseek-ai/dsh-headless`、`@deepseek-ai/dsh-session-persistence-jsonl` 的 `latest` 仍是过期版本（0.0.1-rc.1），要钉 `next`（0.2.0-rc.2）或 `alpha`（0.2.1-alpha.1）；`create-dsh-plugin` latest=0.2.3；`@deepseek-ai/cordis` latest=4.0.4，另有新标签 `dsh-0-2-1-alpha-1`=4.0.5-alpha.1；dsh-core/dsh-sdk 仍未发布（2026-10-06 复核）。
- 路径比较前两侧都 `resolve()`（Windows 反斜杠陷阱）。

## 文档链接

官方开发文档——站点基址 <https://deepseek-harness.github.io/deepseek-harness>（根路由中文，`en/` 前缀英文；逐字副本在 `references/official-docs/docs/`）：

- 入门：[develop/basic/](https://deepseek-harness.github.io/deepseek-harness/develop/basic/) → [tool](https://deepseek-harness.github.io/deepseek-harness/develop/basic/tool) · [config](https://deepseek-harness.github.io/deepseek-harness/develop/basic/config) · [publish](https://deepseek-harness.github.io/deepseek-harness/develop/basic/publish)
- 框架与实践：[develop/framework/](https://deepseek-harness.github.io/deepseek-harness/develop/framework/)（[service](https://deepseek-harness.github.io/deepseek-harness/develop/framework/service)、[events](https://deepseek-harness.github.io/deepseek-harness/develop/framework/events)）· [develop/practice/](https://deepseek-harness.github.io/deepseek-harness/develop/practice/)（[LLM adapter](https://deepseek-harness.github.io/deepseek-harness/develop/practice/llm-adapter)）
- 用户指南：[quickstart](https://deepseek-harness.github.io/deepseek-harness/guide/quickstart) · [providers](https://deepseek-harness.github.io/deepseek-harness/guide/providers) · [python-sdk](https://deepseek-harness.github.io/deepseek-harness/guide/python-sdk)
- Cordis：[primer](https://deepseek-harness.github.io/deepseek-harness/reference/cordis-primer) · [tutorial](https://deepseek-harness.github.io/deepseek-harness/develop/cordis-tutorial/) · [core API](https://deepseek-harness.github.io/deepseek-harness/reference/cordis-api/context)
- 参考：[architecture](https://deepseek-harness.github.io/deepseek-harness/reference/) · [cookbook/adding-a-tool](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/adding-a-tool) · [cookbook/extension-cookbook](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/extension-cookbook) · [subsystems](https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/)
- 完整 URL ↔ 本地副本对照：[guide/links.md](links.md)

社区开发文档——模板/教程/踩坑，完整清单见 [references/community-ecosystem.md](../references/community-ecosystem.md)：[plugin-template](https://github.com/omdsh-dev/plugin-template) · [dsh-plugin-dev pitfalls](https://github.com/omdsh-dev/dsh-plugin-dev) · [from-scratch tutorial](https://github.com/Opr4Mp3r/deepseek-harness-plugin-from-scratch) · [dsh-plugin-check](https://github.com/omdsh-dev/dsh-plugin-check)

## 关键源索引

- 本地官方文档全文：`references/official-docs/docs/**`（369 篇，含全部 182 个 `.zh.md`）；**没上文档站**的那些页（session-format-status、`upgrade-guide/**`、`persistence-changes/**`、ui-radius、web-styling、module-graph）见 [links.md](links.md) §2.1
- 迁移清单：[migration-0.2.md](migration-0.2.md)（0.1.6-alpha.2 → 0.2.1-alpha.1 的全部破坏性变更，逐条附官方 upgrade-guide 出处）
- 官方自带插件开发技能：[references/official-plugin-dev-skill.md](../references/official-plugin-dev-skill.md)
- 仓库根约束：`references/official-docs/AGENTS.md`、`references/official-docs/packages/AGENTS.md`、`references/official-docs/vendor/README.md`；同步状态见 `references/official-docs/SNAPSHOT.md`
- 站点爬取 HTML：`downloads/web/site/**`（中英双语全站）+ `downloads/manifest.tsv`（下载清单）
- 上游 Cordis：`downloads/github/cordis/**` + 调研 `references/upstream-cordis.md`
- Cordis 论文：`downloads/github/paper/**` + 调研 `references/cordis-paper-and-community.md`
- 网站/官网调研：`references/website-pages.md`
- 仓库调研：`references/harness-repo.md`
- 社区/生态：`references/community-ecosystem.md` + 工作区 `dsh-plugin-topic-2026-08-13/`
- 全部 URL 清单：`references/sources.md`
