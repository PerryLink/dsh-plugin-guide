# 官方自带插件开发技能（references/official-plugin-dev-skill.md）

> **这是什么**：DeepSeek Harness 自带的 preset（`packages/preset/agent-preset/`）里有一整套**官方插件开发技能**，是 0.2 世代最重要的新增资料——它描述的正是"在当前 Harness 里、由 agent 自己写并安装插件"的官方流程。
> **本文件性质**：**要点摘录 + 原文定位**（不是逐字全文；逐字全文随官方文档副本一起在 `references/official-docs/` 之外的仓库路径，需 checkout 才能读）。凡写"官方明确"的地方都能在上游文件里逐字查到。
> **基线**：`5badb15009ae1756c3afe0ae0cef1faafc290ccc`（`dsh-v0.2.1-alpha.1`，2026-10-03）。升级宿主后若与上游冲突，以上游为准。
> **上游路径**（在 checkout 里，如 `D:\deepseek-harness`）：`packages/preset/agent-preset/skills/`

## 1. 四个技能与各自职责

| 技能 | 职责 |
|---|---|
| `cordis-plugin-development/SKILL.md` | 主流程：设计/评审/启用/安装/配置/调试插件、bundle、页面、面板、工具、MCP 连接 |
| `cordis-plugin-development/references/{host-plugin,ui-plugin,mcp-bundle,practices,user-actions,verification}.md` | 六份分面参考（见 §3） |
| `cordis-plugin-development/templates/{decoration,mcp}/**` | 可直接复制的 UI 插件模板与 MCP bundle 模板（含 locale 与 icon） |
| `cordis-composition-reference/SKILL.md` | Loader patch 方言 + 可安装插件包清单 |
| `editing-cordis-compositions/SKILL.md` | agent preset 组合的编辑流程 |
| `agent-experience/SKILL.md` | 面向"模型体验"的写作/设计约束 |

## 2. 主流程（`cordis-plugin-development/SKILL.md` 的硬性规定）

**安装方式（官方唯一推荐）**：在工作区用普通文件写 bundle，然后用 **`plugin_manager` 工具的 `install_bundle`**，`target` 传**绝对包目录**装进当前 profile。改动对该 profile 的**所有会话**生效并跨重启保留。

**官方明确禁止**（原文禁止项，逐条）：
- 不写 profile 的 `package.json`；
- 不写 profile 的 `cordis.patch.yml`；
- **不在 profile 目录里跑 pnpm**；
- 不在 `$DSH_HOME` 下创建包。

理由：`install_bundle` 会做这些步骤，而"profile 之外的每一次手写都需要单独审批"。另外 `plugin_manager` 的每个动作（**包括 `list_plugins` / `list_bundles`**）在没有 Full access 时也需要审批，所以**只在结果决定下一步时才调**。

**"先交付能跑的插件"五步**：
1. 先定结果与落点。未指定的可视落点＝当前 Harness Web UI；独立图片文件或 HTML **不算**完成。先实现一个小的第一版并**先装上**，再做视觉打磨。
2. **只查这一版需要的 API**：先 `cordis_inspect_list`，再有针对性地 `cordis_inspect_query`。UI 类要查 Client 的 `Slots.listSubTree` 与目标 slot 的注册选项/props；超出静态装饰（工具策略、agent 上下文、会话派生状态、Chat 行）要先读 `references/practices.md`；涉及用户动作再读 `references/user-actions.md`。**选定 slot 与注册 API 之后才开始写代码。**
3. 复制匹配的模板文件到一个工作区目录，或直接在工作区写包/patch/必需的 Host·Client 文件。装之前**完成 `references/host-plugin.md` 的展示清单**（本地化标题/描述、原创或有许可的图标、按需导出资源与分发校验）——Host-only 与纯配置 bundle 同样适用。然后检查 JS 语法与清单，安装。**不要先做预览 HTML、mock 壳、design 变体、截图脚本或栅格化工具**。
4. 读安装结果：**`application` 与 `warnings` 决定改动是否生效**——不是日志、进程列表，也不是页面的 boot payload。用**免审批**的 `cordis_inspect_query` 确认新行，而不是 `list_plugins`。`application: applied` 之后，实际用一下能力，或检查实时 Client 注册。
5. 在同一插件里修掉观察到的缺陷；请求的结果能用就收尾，报告位置、验证状态与任何展示资源例外的理由。**不要继续做投机变体、可选功能或 mock 预览。**

**知识来源的优先级（官方顺序）**：
1. **inspection**——`cordis_inspect_query` 回答精确的 Service 方法、Event 模式（`Service`/`Event`）、已挂插件的 Config JSON Schema（`Config.listConfigs`：先按 `name` 过滤分页目录，再查 `entry` id）、本 Agent 可调用的 Tool（`Tool`）、实时 Client Slots 与主题 token（`Slots`/`Theme`）。
2. **包文档**——`Config.listConfigs` 带 `name` 找到该包的 entry，查一个 `entry` 会返回 `packageDir`；读 `<packageDir>/README.md`。bundle 包从 dsh 安装位置解析、profile 安装的 bundle 从 profile 解析，**不要**从 `$DSH_PROFILE_DIR` 猜路径。
3. **源码**——已安装包只带构建后的 `lib/index.js` 与 `lib/types/**/*.d.ts`（含 JSDoc），**没有 `src/`**；源码 checkout 才有 `packages/<group>/<name>/src`。先看 inspection 与 README，再从具体的安装/运行失败出发做源码级诊断。

**环境变量**：profile 启动的 Harness 在每次 shell 调用里都设置 `DSH_PROFILE`（profile 名）与 `DSH_PROFILE_DIR`（其目录，`node_modules` 只含 profile 安装的 bundle）；**不以 profile 启动时不设置**。Bash 读 `$DSH_PROFILE`，Windows preset 用的 PowerShell 读 `$env:DSH_PROFILE`。`dsh --profile "$DSH_PROFILE" --dump-config` 打印组合后的 profile。

**Desktop 下的读取限制（官方警告）**：Desktop 里该技能目录位于 `app.asar` 内，**只有 Host 进程自己的文件读取**能打开它；shell 命令（`ls`/`cat`/`cp`/`cmp`）、glob 与搜索工具（走原生 ripgrep 进程）、`node`、pnpm **全部失败**。**永远不要就地安装或语法检查模板**——先把模板内容复制到工作区。

**启用随包发布但默认关闭的插件**：行 id 与原因写在随包 patch（源码 checkout 的 `packages/bundle/*/cordis.patch.yml`）里。写一个工作区 bundle，用 patch 覆盖该行为 `disabled: false`，并把它依赖的 Host 行一起插入；源码 checkout 的 `apps/cli/config/examples/<feature>/cordis.yml` 会列出这些行。**随 dsh 发布的包从 dsh 安装位置解析，所以这种 bundle 不声明对它们的依赖。**

## 3. 六份分面参考的要点

### 3.1 `host-plugin.md` — bundle 与 Host 插件

- 最小 Host-only bundle **不需要依赖、安装脚本或构建步骤**：
  ```json
  { "name": "@local/my-plugin", "version": "1.0.0", "private": true, "type": "module",
    "exports": { ".": "./index.js" }, "dsh": { "bundle": { "patch": "./cordis.patch.yml" } } }
  ```
- **展示元数据与图标清单**（Plugin Manager / Settings 在**不激活**插件的前提下读取）：`locale/en.json` 里写 `meta.title`/`meta.description`，并按用户语言补 `locale/zh.json` 等；图标须原创或有再分发许可、保留署名；导出 `./locale/*.json` 与 `./icon`，并把 patch、locale、图标与**每个运行时文件**都放进 `files`。**本地目录安装链接的是 checkout，`files` 不过滤链接目录**——要直接检查文件。图标支持 SVG/PNG/JPEG/WebP，**≤ 256 KiB**，且 realpath 之后必须仍在包内（绝对路径、URL、指向包外的 symlink 都被拒）。**文件名合规不等于字节能渲染。**
- 包根插件也可以在 `package.json` 顶层写 `icon`（优先于 `./icon`，路径相对清单目录）。**子路径插件（如 `my-plugins/search`）不是包，永远不读 `package.json`**——它导出 `./search/locale/*.json` 与 `./search/icon`。
- Host 插件导出形态（**不要混用**）：`export function apply(ctx, config) {}` + 可选 `export const inject = ['tools']` + `export const Config`；或者一个 **service class 作为 default export**。所有资源都在 `apply` 里用 `ctx.effect`/`ctx.on` 注册并返回清理函数。声明了 `Config` 的插件会在激活时校验该行的 `config`——**写 config 之前先查 `Config.listConfigs` 拿 schema，并跟进返回文档里的 `$defs` 引用**。
- 安装/启用/观察：`install_bundle` 负责包安装与 bundle 选择，**不要用 shell 复现**；只有用户明确批准了报告出来的 pending build 脚本后才传 `approvedBuilds`。`list_plugins`/`list_bundles` 给出精确标识符，`set_plugin`/`set_bundle` 开关，`remove_bundle` 移除。**分开看"保存状态"与"激活结果"**：`failed` 要诊断，`overridden` 表示更高优先层胜出，`restart-required` 表示**未生效**。新装 bundle 可以经 HMR 激活；**替换已安装包需要重启**才能载入新的 JS 模块代。

### 3.2 `ui-plugin.md` — Web 页里的 UI 插件

- 读 `templates/decoration/` 并把文件写进你的 bundle 目录：它的 `package.json` 在 bundle patch 之外加 **`dsh.client` 段**（`platform`/`immediately`/`inject`）与 **`./client` 导出**。`index.js` 导出 `export function apply() {}`；patch 插入一行，行名即包名。
- 简单绘图优先选**已分配空间**的 slot，如 `conversation.composer.dock`；第一版就留在这个 slot 的流内，**不要**围绕宿主控件规划运动轨迹。只有需要覆盖层且落点已知时才用 `shell.overlay`。
- 浏览器产物注册一个**懒工厂，其 id 等于包名**。React 来自浏览器模块表——**不需要**第二份 React、CDN script 或 UMD 查找。编译型源码用部署自带的 Client 构建工具产出该格式；非基线运行时 import 在 `dsh.client.external` 里声明。
- `templates/decoration/client.js` 通过 `ctx.slots.inject` + `ctx.slots.register` 把懒工厂注册进 `conversation.composer.dock`；换 slot 时按 `Slots.listSubTree` 给出的 props/options 来写。
- **工厂保持无副作用**：样式、定时器、监听器等资源在 `apply` 里用 `ctx.effect`/`ctx.on` 注册并返回清理函数；组件局部样式渲染成 React 元素，卸载即移除。容器与控件继承宿主主题；只有 artwork 可以用自己的配色。**可见文案走 Client locale 服务。不要替换 app root，也不要往 `document.body` 追加第二个应用。不要读别的插件的 DOM、样式表或组件源码去猜位置——选一个已经分配好空间的 slot。**

### 3.3 `mcp-bundle.md` — 接一个 MCP server

- 纯配置 bundle：清单只要有唯一 name、version 与 `dsh.bundle.patch`，**不需要** Host/Client 入口文件。patch 插入**已安装的** `@deepseek-ai/dsh-mcp-client`，配 `serverName`、`transport: streamable-http`、`url`、`failOnStartupError: true`。
- 换掉 endpoint、经 `plugin_manager` 装好，然后调 `mcp__demo__ping` 之类新出现的 `mcp__<serverName>__<tool>` 验证。
- stdio 用 `transport: stdio` + `command` + 可选 `args`/`env`/`cwd`；`Config.listConfigs` 查已装行会返回完整 client schema。**环境凭据会被清洗**：用 Loader 的 `!!js` 引用已有凭据，**不要把密钥粘进对话文本**。失败时**修同一个 bundle，不要造重复的**。

### 3.4 `practices.md` — 插件实践总纲（最值得先读的一份）

**六条原则**
1. **会话日志是唯一真源**：模型看到的一切都必须能从已提交的会话事件重建；fork/resume/replay 都从日志派生。**插件内存只是派生缓存。**
2. **注册是被 ctx 拥有的 effect**：插件卸载、agent 释放、slot 折叠、profile patch 都会撤销对应 ctx 上注册的东西。**要选对拥有者 ctx**；注册在别的 ctx 上（如 `agent.ctx`）的注册有**两个**拥有者——必须把它的 disposer 也留在自己插件的 effect 里，这样任一侧 teardown 都能移除。
3. **框架负责驱动，插件只负责计算**：session projection、Conversation 组装、slot 渲染已经替你订阅、缓存、发布。自己去订阅/重扫/写 DOM 就是绕过这套增量机制。
4. **扩展点是共享的：用最弱的够用机制**。由弱到强：`ctx.tools.restrict()`（只能移除工具）→ `ctx.tools.guard()`（只能拒绝）→ waterfall 监听器（可改写、依赖注册顺序）→ `system-prompt/assemble`（替换整个组装结果）。机制越强，你要替其他插件保留的东西越多。
5. **别的插件、别的 Harness 版本会读你写的数据**：未知事件类型、更老的读方、更老的缓存状态都会遇到你写的东西——按 Harness 提供的信封字段与版本声明兼容性。
6. **插件 UI 就是 Harness UI 的一部分**：用户看到的是一个应用，所以插件要用宿主的主题 token、locale 与布局模式，并匹配宿主组件的外观与行为。**能不能做到由"在哪渲染"决定——先选渲染面再写视图**；后面在错误的面里做样式救不回来。

**稳定性（逐条可执行）**
- 不拥有该决策的 waterfall 监听器（`agent/pre-step`、`agent/request`、`llm/stream`、`tools/pre-execute`、`tools/execute`、`tools/post-execute`）**必须返回 `next()`**。改写 `agent/pre-step` 决策时要**展开**它（`{ ...decision, messages }`），否则 `startsRequestSeries` 之类字段会丢。
- 必须与顺序无关地成立的拒绝用 `ctx.tools.guard()`（同步）；需要 await（比如问用户）的决策从 `tools/pre-execute` 返回 `ask`。只对某个 agent 隐藏工具＝在那个 agent 的 ctx 上 `ctx.tools.restrict()`（它让 schema 展示、查找、执行保持一致）。**最终结果只看 `tools/result`**；只有要变换结果才用 `tools/post-execute`。**不要监听 `system-prompt/assemble` 来增删工具或文本。**
- 加提示词文本用 `ctx.systemPrompt.section()`。加 per-agent 上下文用 `agent.inject()`——它在调用时记为 `agent/inbox/spliced`，进入下一次获准的 step。**`agent/request` 监听器不能改请求消息。**
- per-agent 行为注册在 `agent.ctx` 上（在 `agent/created` 监听器里拿到），这样该 agent 释放时一起移除。**把它包在一个 `agent.ctx.effect()` 里，并且把这个 disposer 按 agent 记在自己插件的 effect 里**——卸载插件本身**不会**释放 `agent.ctx` 的注册。
- 可选服务放进 `inject` 或 `ctx.inject([...], ...)`，这样在没有它们的 profile 里插件保持不激活，而不是抛错。
- **绝不要用新的 `type` 追加会话事件**：读方只在事件带信封 `ignorable: true` 时接受未知类型，而运行时 `Session.append()` 写不了这个标记，于是**会话会拒绝重新打开**。插件状态从既有事件推导，或放进 inspection 找到的 storage 服务。
- 可调值放进插件的 `Config`，让用户在 `cordis.patch.yml` 里改——**用户的 patch 层能跨升级保留**。

**性能**
- per-session 状态放进 `ctx.sessionProjections` 单元，**不要**订阅 `session/event` 再重扫 `session.events`。`apply(state, event)` 是**纯同步**的，对它忽略的事件**返回同一个引用**，所以未变状态在下游零成本；读取用 `stateOf()`。`view()` 在值未变时返回同一引用，从而抑制发布。
- projection 状态保持**纯 JSON**，字段或 fold 语义变化时 bump `stateVersion`：投影缓存会 checkpoint 它，冷读只回放尾巴，过期 checkpoint 被丢弃。
- **等持久事件**（`turn/end`、`assistant/message`、`tool/result`），实时 token 从 `agent/assistant-stream` 渲染。**不要轮询 `agent/status`。** `whenIdle()` **不**代表"一次 followup 结束了"——多个输入可以共享同一个运行区间。
- 会启动工作的定时器调用 `agent.followup()`（它**唤醒** agent）；`agent.inject()` **不唤醒**，所以注入的上下文可能在 inbox 里等到别的输入才被采纳。定时器要在拥有它的 effect 里清除。

**UI**
- 插件页面渲染成 slot 里的 React 组件。**不要**从 Host 提供一个 HTML 页面再 iframe 嵌进去：iframe 文档拿不到宿主主题 token、明暗切换和 `ctx.locale`。
- 用 `cordis_inspect_query` 的 `Theme` 列出的主题 token（`--dsw-alias-*`）做样式；字面颜色只用于 artwork。token 是最低风险的匹配方式：token 改名只会让外观退化，**永远不会弄坏渲染**。间距/字号/行模式照抄同类宿主页面（管理类列表的参照是 Plugin Manager 页）。
- **不要** `require('@deepseek-ai/dsh-client-ui-primitives')` 或把任何 Harness Client 包当模块加载；`dsh.client.inject` 只做激活排序、保持允许即可。它们会不打招呼地变化，纯 JS 插件没有类型检查，而**抛错的组件会把你的 slot 条目整块搞白**（console 里是 `slot entry crashed in '<slot>'`）。**自己写控件并对齐宿主**：从 primitive 里把标记、CSS 与行为抄进插件（DSH 源码 checkout 的 `src/*.tsx` 与 `*.module.css`，或已安装包的 `lib/index.js` 与 `lib/**/*.css`），或在连着的页面里观察渲染出来的宿主控件。抄来的 class 要改到你自己插件的前缀下，只保留 `--dsw-alias-*` token 引用，并保留用户依赖的行为（Modal 焦点与 Escape、`role="switch"` + `aria-checked`、Tooltip 落位）。这样 token 就是唯一的共享样式依赖。
- 只通过 slot 贡献：`ctx.slots.inject(ownerKey, () => ctx.slots.register(...))`——回调里的注册在拥有它的声明折叠时释放、恢复时重新安装。会话数据经 slot props 的 selector hook 读取，订阅**最小切片**。**不要**在组件外写 DOM，也不要往 `document.body` 追加。
- 加 Chat 行：用 `ctx.uiConversation.events.register()` 注册事件定义，并在 `conversation.chat.node` slot 下按该定义的 `kind`（即渲染键）注册视图；分页、Turn/Step 落位与增量组装由 Conversation 层负责。
- Client 需要会话派生值时，在 Host projection 上声明 **`wire.view`**——值算好了再送到 Client，**Client 不自己 fold 会话事件**。

### 3.5 `user-actions.md` — 用户动作与 agent 工具

- **一个操作，两个调用方**：① 实现成一次 Host 服务方法（返回结果或显式状态，失败带原因）；② UI 动作经 inspection 找到的 Client 可调 Host 入口（如 `ctx.remote.commands.execute()` 跑的会话命令）调用它并显示失败；③ 用参数与语义一致的 agent 工具暴露同一操作（相关操作可用一个 `action` 参数共用工具），工具调同一个方法并把结果作为工具结果返回。
- **授权/确认类动作仅限用户**（批准工具调用、回答 agent 的提问、放宽策略）。**不要在 UI 与工具两条路径里各维护一份操作逻辑。**
- 验证：双调用方的操作**只用工具**跑一遍，比较状态变化、返回值与失败是否与 UI 动作一致；用户专属动作要验证 agent **无法**执行或授权。

### 3.6 `verification.md`

无浏览器控制时的页面/面板设计核查流程（配合 §2 第 4-5 步使用）。

## 4. 与本知识库的关系

- 本文件是**索引与摘录**；机制细节（精确签名、事件 `@mode`、Config schema）永远以 **inspection** 与 `references/official-docs/docs/**` 为准。
- 官方这份技能覆盖"在会话里让 agent 写并安装插件"；本知识库另外覆盖**对外发布**（npm/tarball/git 通道、`prepare` + `allowBuilds`、五语 README、质量门禁）与**版本迁移**（[migration-0.2.md](../guide/migration-0.2.md)）。
- 上游路径随宿主版本变化（本文件基线 `5badb15009`）；`preset/agent-presets` → `preset/agent-preset` 的改名发生在 `d1e22a7e24`。
