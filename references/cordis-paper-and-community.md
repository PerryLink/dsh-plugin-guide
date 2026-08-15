# Cordis 论文与社区调研

> **归档备注（2026-08-13 下载复核）**：
> cordiverse/paper 仓库经 GitHub API 仓库树核实**仅含 3 个文件**：`README.md`、`.gitattributes`、**`paper.pdf`（论文全文）**——PDF 已归档于 `downloads/github/paper/repo/paper.pdf`，无 `main.tex`；arXiv/DOI 未发现，与正文一致。

> 调研日期：2026-08。覆盖 (1) [cordiverse/paper](https://github.com/cordiverse/paper) 白皮书与 Cordis 框架设计；(2) DeepSeek Harness（DSH）插件开发社区与第三方知识。
> 方法论说明：本环境沙箱禁止直连外网（`Invoke-WebRequest`/`curl` 均被 TLS/SChannel 拒绝），因此论文 `README.md` 原文无法直接抓取。论文的实质内容通过以下三个强证据来源交叉重建：(a) DSH 仓库内 vendored 的 Cordis 源码（`vendor/cordis/src/`），(b) 官方文档 `docs/cordis-primer.md` 与 `docs/architecture.md`（DSH README 明确说明其由 Cordis 驱动、设计见该论文），(c) web_search 返回的第三方解读。凡无法从这些来源直接核实、需依赖论文原文的表述，均标注 **[unverified]**。

---

## Part 1 — Cordis 论文（cordiverse/paper）

### 1.1 出版物 / 载体（publication venue）

| 项目 | 内容 |
|---|---|
| 论文标题 | **A Programming Paradigm for Spatiotemporal Composability**（一种时空可组合性的编程范式） |
| 论文仓库 | https://github.com/cordiverse/paper |
| 仓库描述 | A Programming Paradigm for Spatiotemporal Composability |
| 框架仓库 | https://github.com/cordiverse/cordis —— 描述为 **"Meta-Framework of Spatiotemporal Composability"**（时空可组合性元框架） |
| 所属组织 | [cordiverse](https://github.com/cordiverse)（另含 [webui](https://github.com/cordiverse/webui) 等） |
| 论文源文件 | 定位到 https://raw.githubusercontent.com/cordiverse/paper/main/README.md（`main` 与 `HEAD` 分支同文）。是否另有 `main.tex` / 渲染 PDF 无法确认 **[unverified]** |
| arXiv / DOI | **未发现** arXiv 预印本或 DOI；论文目前以 GitHub 仓库 README 形式发布。是否另有正式投稿渠道 **[unverified]** |

> 背景：Cordis 是 Koishi（TypeScript 聊天机器人框架）插件体系演化出的独立元框架（见 [Koishi 4.17.0-alpha.0 讨论](https://github.com/koishijs/koishi/discussions/1361) 及 [Koishi v4.7 发布说明](https://koishi.chat/en-US/about/releases/v4.7.html) 中 cordis 相关条目）。DeepSeek Harness 的 README 明确写"由 [Cordis](https://github.com/cordiverse/cordis) 驱动，其设计参见论文 [_A Programming Paradigm for Spatiotemporal Composability_](https://github.com/cordiverse/paper)"，因此该论文即 Cordis 的设计论文。

### 1.2 摘要（abstract）

论文原始 abstract 原文无法直接读取 **[unverified]**。依据仓库标题、框架自述与 vendored 源码，可还原其核心主张：

> Cordis 提出一种以 **"时空可组合性"（spatiotemporal composability）** 为核心的编程范式——"空间"维度指**服务作用域**（service scope，同一服务名在不同 context/隔离域内解析到不同实现），"时间"维度指**生命周期**（lifecycle，插件的加载/卸载与副作用随 fiber 随时序可逆地建立与撤销）。框架把应用建模为一棵由**插件（plugin）**构成的树：每个插件是 `Service` 的实现，向共享 **context** 贡献**服务**、**类型化事件**与**可逆副作用**，通过 **inject** 声明依赖而非手动编排启动顺序。

### 1.3 它解决的问题（problem it solves）

vendored `cordis` README 开宗明义：

> *Cordis is a TypeScript plugin framework for applications that need **explicit dependency injection**, **scoped services**, **lifecycle-managed cleanup**, and optional **configuration-driven loading**.*

论文要解决的核心问题可归纳为：

1. **没有特权核心的可替换组装**：大型应用（尤其是 agent harness）的每一部分——模型适配器、工具注册表、会话日志、agent 循环本身——都应可独立开发、独立替换，而不是围绕一个"核心"打补丁。
2. **显式依赖注入而非手工启动顺序**：组件间的加载依赖通过 `inject` 声明，运行时自动等待，避免脆弱的手工编排。
3. **作用域隔离**：同名服务可在不同作用域（不同会话、不同 agent、不同隔离域）解析到不同实现，互不污染。
4. **生命周期安全的清理**：注册、监听、定时器、副作用都必须在其 owner 卸载时被可靠回收（dispose），支持 reload/HMR。
5. **配置驱动的组合**：通过 YAML/`cordis.yml`、`!!js` 表达式、patch/overlay 层层覆盖，按环境选择插件。

### 1.4 核心设计思想（core design ideas）

以下均来自 vendored 源码与官方 primer（`docs/cordis-primer.md` 的 "Cordis In Five Ideas"），即论文描述对象的直接实现：

#### (a) 插件优先架构（plugin-first architecture）
- **一个插件就是一个实现 `Service` 的对象**：可以是带可选 `inject` 与 `apply(ctx)` 字段的函数，也可以是 `Service` 子类，其生命周期由 Cordis 挂载到当前 context。
- "一切皆插件"：DSH 中连 model adapter、tool registry、session log、agent loop 本身都是插件（`docs/architecture.md`）。
- **没有特权核心**：通过把插件挂载到其他插件旁边来扩展应用；"Registrations are effects that unwind when their plugin unloads"。

#### (b) Context / Service / Event 模型
- **Context 是服务仓库（repository of services）**：`new Context()` 创建根依赖容器；运行时是一个 **Proxy**（见 `context.ts`），普通属性读取走服务解析器。服务占据稳定 key，如 `ctx.tools`、`ctx.llm`、`ctx.sessions`、`ctx.agents`；其他插件按 key 查找服务而非导入具体实现。
- **Service 是挂在 ctx 上的具名 API**：`super(ctx, name)` 立即注册（`ctx.reflect.provide(name, ...)`），随 owner fiber 卸载自动移除；可含 `[Service.invoke]` 使其可调用（如 `ctx.logger()`）。
- **事件是类型化通信**：服务经 TypeScript 声明合并声明事件名，再以不同分发模式派发。

#### (c) 作用域与生命周期（scope & lifecycle）
- **Fiber** 是生命周期单元：`ctx.plugin()` 启动插件并返回 `Fiber`；fiber 负责 load/unload/dispose，收集该插件建立的所有 effect/listener/service。
- **作用域原语**（`context.ts`）：
  - `extend(meta)` — 原型继承父 context，不改动父。
  - `isolate(name, label)` — 为服务 `name` 建立独立作用域；同名 label 可 join 作用域（DSH 用它做 per-agent 隔离，`agent.ctx`）。
  - `intercept(name, config)` — 为某服务叠加配置拦截（per-plugin config 合并）。
- **可逆副作用**：提示词片段、工具 schema、适配器、provider、监听器都经 `ctx.effect()` / `ctx.on()` 安装，并返回 disposer；reload/teardown 时按序撤销。DSH 约定 "Registrations are effects"。

#### (d) 类型安全（type safety）
- **TypeScript 声明合并**（declaration merging）：`Context` 接口与 `Events` 接口通过 `declare module` 扩展，使 `ctx.<key>` 与事件名/payload 全程静态类型化（`context.ts`、`events.ts` 中的 `declare module './context.ts'`）。
- **Schemastery**（vendored `schemastery`，基于 standard-schema）：插件 `Config` 模式做运行时校验与类型推导；DSH 仓库以 `strict: true` + `noImplicitAny` 全量编译，所有 `any` 需说明理由。
- **分发模式是事件公开契约的一部分**：`@mode` JSDoc 标注 `emit/waterfall/parallel/serial`，生成目录交叉校验声明与派发点。

#### (e) 性能 / 沙箱（performance / sandboxing）
- **性能**：论文原文是否有专门讨论 **[unverified]**。实现层面可观察到：事件派发区分同步（`emit`/`waterfall`/`bail`）与异步（`parallel`/`serial`）；context 用 Proxy 惰性解析服务，服务用 `Symbol.for('cordis.is')` 做跨 realm 判定；源码属 ESM-first、无重量运行时抽象。
- **沙箱**：Cordis 本身不提供代码执行沙箱（它是组合层）。沙箱能力在 DSH 层由独立 capability 提供（`ctx.sandbox` / e2b / Landlock native addon），属于 harness 的 provider seam 而非框架核心。论文若讨论 sandboxing，属 **[unverified]**。

### 1.5 关键定义（key definitions）

| 术语 | 定义 |
|---|---|
| Plugin（插件） | 实现 `Service` 的对象：带 `inject`/`apply(ctx)` 的函数，或 `Service` 子类 |
| Context（上下文） | 服务的仓库/依赖容器；运行时为 Proxy，通过 `extend/isolate/intercept` 创建作用域子 context |
| Service（服务） | 挂载在 `ctx.<key>` 上的具名 API，构造即注册、随 owner fiber 卸载 |
| inject（注入） | 声明式服务依赖；插件等所依赖服务就绪后才启动 |
| Event（事件） | 经声明合并注册的具名通信通道，按分发模式派发 |
| Dispatch mode（分发模式） | `emit`（同步观察/无返回）、`waterfall`（环绕中间件/有返回）、`parallel`（并行扇出）、`serial`（按序短路）、`bail`（首个真值即停） |
| Effect / disposer（副作用/释放器） | `ctx.effect()` 或 `ctx.on()` 返回的可逆注册，卸载时撤销 |
| Fiber（纤程/生命周期单元） | 插件的一次装载实例，持有其 effect 集合，负责 load/unload/dispose |
| Scope（作用域） | 服务名在同一 label 内解析一致、跨 label 隔离的机制（`isolate`） |
| Seam（能力接缝，DSH 术语） | 可替换能力的三元组：Service Definition / Service Provider / Consumer |
| Profile / Bundle（DSH 术语） | profile = 命名组合 + 用户 patch；bundle = 可被上层 patch 的配置行与代码分发格式 |

### 1.6 设计原则（design principles）

- **可逆注册（reversible effects）**：一切贡献都走 `ctx.effect()`/`ctx.on()`，注册即副作用，卸载即撤销。
- **依赖声明优于启动顺序**：加载顺序由 `inject` 表达，不手工编排。
- **事件用于拦截与策略，服务方法用于直接能力调用**。
- **单决策事件短路即设计意图**：waterfall 监听器不调 `next()` 即拥有决策；仅标注/观察者必须 `next()`。
- **配置显式化、误配大声失败**（DSH 约定）：无硬编码 tunable，缺失 referent 在最早可解析点报错，不静默跳过。
- **类型边界显式**：跨进程/模型/持久化边界才做运行时校验，同进程类型边界信任 TypeScript。

### 1.7 与其他框架的比较（comparisons）

论文原文的显式比较段落无法直接读取 **[unverified]**，但可从标题与实现确定其对照系：

- **依赖注入（Dependency Injection，DI）**：Cordis 的核心即显式 DI + 服务容器（context/service/registry/reflect），但 DI 是"依赖可声明解析"，Cordis 更进一步要求**生命周期可逆**与**作用域可隔离**。
- **中间件（middleware）**：`waterfall` 语义是**环绕中间件**（listener 收到 `(...args, next)`，`next()` 委托下游、返回值向上游传播、不调 `next()` 短路）——这是 Koa 式中间件思想在事件系统上的泛化；`serial`/`bail` 则是"责任链"式短路。
- **微服务（microservices）**：论文标题用"时空"类比服务发现（空间=作用域/寻址）与进程生命周期（时间=启停/可逆），可能对照微服务以论证"同一进程内的可组合性"价值；具体措辞 **[unverified]**。
- **Actor 模型（actor model）**：事件派发（`parallel` 扇出、`emit` 观察者）在形态上与 actor 消息有可比性，但 Cordis 是同步组合而非隔离进程/邮箱；论文是否显式对比 **[unverified]**。
- **社区批评对照**：第三方评论文章 [*A plugin architecture is not a unified agent logic*](https://www.hotmolts.com/post/a-plugin-architecture-is-not-a-unified-agent-logic-6388f344-3f84-405a-8235-28fcb4e58ebf) 直接质疑"插件架构 ≠ 统一 agent 逻辑"——这是对"一切皆插件"范式最尖锐的外部批评，可作为反面参照。中文媒体 [律动 BlockBeats：DeepSeek 把 Agent 拆成「可进化机器」，Cordis 为递归自我改进铺路](https://www.theblockbeats.info/flash/361476) 则把论文思想解读为"为递归自我改进铺路"。

---

## Part 2 — 社区调研：DeepSeek Harness 插件开发

> **2026-08-14 晚补录（2026-08-15 二次修订）**：本 Part 所列 84 条 URL 的实体内存在此轮调研中已按需归档——中英文教程/实测文章**145 篇**（zh 94/en 41/hn 10）进 `downloads/web/community-articles/`（含本 Part 之外的新线索，摘要见 `downloads/_research/{chinese,english}-community-scan.md`，刷新脚本 `scripts/download-community-articles.ps1`）；GitHub 文档型仓库 **111 个**进 `downloads/community-repos/`（清单见 community-ecosystem.md §4，含 08-15 第七批 14 个）；官方 Discussions **1654 条**进 `downloads/github/harness/discussions/`（`scripts/archive-discussions.ps1` 刷新）。以下表格保留为原始调研记录。

### 2.1 官方渠道

| 渠道 | 内容 | URL |
|---|---|---|
| GitHub 主仓库 | `deepseek-ai/deepseek-harness`，"Everything is a Plugin" | https://github.com/deepseek-ai/deepseek-harness |
| **GitHub Discussions** | 官方反馈/bug 渠道（README 明示） | https://github.com/deepseek-ai/deepseek-harness/discussions |
| **企微群（WeCom）** | 扫码加企微小助手 + 填问卷入群；官方插件开发交流主阵地 | 见 README 内二维码（`assets/community-wecom-assistant.png`） |
| 入群问卷（飞书表单） | 入群前置问卷 | https://trtgsjkv6r.feishu.cn/share/base/form/shrcnIt5twSVdLGD52KJBckGCgg |
| 微信公众号 | DeepSeek Harness 团队公众号（黑鲸头像） | README 内二维码 |
| `dsh-plugin` Topic | 插件仓库打此 topic 便于被发现 | https://github.com/topics/dsh-plugin |
| `dsh-external/hub` | 社区聚合目录引用的官方/外部 hub（**08-14 核查：仓库 404**） | 见 2.2 |

> **Discord**：官方仓库 README 明文链接 https://discord.gg/Ycq5dCaS4（"DeepSeek Harness Discord community"，08-14 复核仍在）。官方社区 = Discord + GitHub Discussions + 企微群 + 微信公众号。

### 2.2 官方插件开发文档（仓库内，权威一手资料）

- 架构总览（中/英）：`docs/architecture.md` / `architecture.zh.md` — 插件树、profile/bundle、turn flow、capability seam、事件地图、"新行为往哪挂"速查表。https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md
- Cordis 入门（中/英）：`docs/cordis-primer.md` / `.zh.md` — 五个核心概念、分发模式、waterfall 语义、loader 配置。https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md
- Cordis 教程（7 课，中英双语）：`01-first-plugin` → `02-lifecycle-and-effects` → `03-services` → `04-events` → `05-config` → `06-composition-and-hmr` → `07-into-the-harness`。https://github.com/deepseek-ai/deepseek-harness/tree/master/docs/cordis-tutorial
- Cookbook（如何加功能）：`adding-a-package` / `adding-a-tool` / `adding-an-llm-adapter` / `adding-a-conversation-node` / `adding-a-vendored-package` / `extension-cookbook`。https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cookbook/adding-a-package.md 、https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cookbook/adding-a-tool.md
- 用户开发指引：`docs/user/develop/basic/index.md`。https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/index.md

### 2.3 第三方聚合目录（awesome lists）

| 目录 | 内容 | URL |
|---|---|---|
| `0xsline/awesome-deepseek-harness` | DSH 生态精选：插件、工具、基础设施；来源 `dsh-external/hub` 与公开 `dsh-plugin` topic | https://github.com/0xsline/awesome-deepseek-harness |
| `AdamPlatin123/awesome-dsh-plugins` | DSH 插件目录，含**每日兼容性追踪** | https://github.com/AdamPlatin123/awesome-dsh-plugins |

### 2.4 第三方插件 / 项目（plugin 案例）

| 项目 | 功能 | URL |
|---|---|---|
| `zhu1090093659/dsh-web-ui` | Web UI 插件与皮肤合集：task board、git graph、右侧面板、远程移动 UI、宠物、token 实时统计、皮肤中心 | https://github.com/zhu1090093659/dsh-web-ui |
| `Nagi-ovo/dsh-visualize` | 对话内生成式 UI：模型把交互式 HTML 卡片直接画进会话流（visualize 工具 + skill + 沙箱渲染） | https://github.com/Nagi-ovo/dsh-visualize |
| `NanmiCoder/dsh-agent-teams` | AgentTeams（多 agent 协作）插件 | https://github.com/NanmiCoder/dsh-agent-teams |
| `vibeinging/dsh-tool-search` | per-agent 按需工具发现与渐进式 schema 披露 | https://github.com/vibeinging/dsh-tool-search |
| `hust-open-atom-club/oh-dsh-desktop` | 可扩展 macOS 工作台：原生 PTY、workspace 工具、双语插件、隔离预览插件市场 | https://github.com/hust-open-atom-club/oh-dsh-desktop |
| `@linxin666/dsh-remote-web-ui` | 远程 Web UI（npm 包） | https://www.npmjs.com/package/@linxin666/dsh-remote-web-ui |

### 2.5 论坛 / 社区（forums & threads）

**locdd.com（大佬说，中文 AI 论坛）** — 多个高讨论度主题：
- 疑似发布预热：https://locdd.com/t/topic/79817
- "仓库居然不开放 issue？"：https://locdd.com/t/topic/80225/10
- 内测评价、测评汇总：https://locdd.com/t/topic/79436/8 、https://locdd.com/t/topic/79826/7 、https://locdd.com/t/topic/79576/5
- agent 壳对比：https://locdd.com/t/topic/79991/14
- 离线环境实践分享：https://locdd.com/t/topic/79752
- "dsh 也有官网了"：https://locdd.com/t/topic/80237

**V2EX**：
- "DeepSeek Harness 来了，一切皆插件的 Agent 框架"：https://global.v2ex.co/t/1234203
- "实测对比：DeepSeek Harness (dsh) vs BitFun"：https://global.v2ex.co/t/1234212

**cocoloop.cn（中文开发者社区）**：
- cc cli + DeepSeek 搞 AutoCAD 插件开发踩坑：https://www.cocoloop.cn/t/topic/11516/10 、https://www.cocoloop.cn/t/topic/11800/8 、https://www.cocoloop.cn/t/topic/12106/3
- harness 优化讨论：https://www.cocoloop.cn/t/topic/12011/6

**Hacker News**：DeepSeek Harness 发布讨论（item 49285244）：https://hn.edgecompute.app/item/49285244

### 2.6 博客 / 媒体（plugin development 相关内容）

**最实质的第三方插件开发教程**：
- 《DeepSeek Harness 2026：一切皆插件 — 开发者预览版完全指南》（cnblogs/sing1ee）：https://www.cnblogs.com/sing1ee/p/22455466
- 《DeepSeek 把 Harness 开源了：一切皆插件，但真正的差距在局部》（cnblogs/weiwuji，批评视角）：https://www.cnblogs.com/weiwuji/p/22456195
- 《如何安装使用 deepseek harness 智能体开发套件》（cnblogs/difs）：https://www.cnblogs.com/difs/p/22456170
- CSDN《基于 DeepSeek 构建 AI Agent：从 ReAct 模式到 LangGraph 工程化实践》：https://blog.csdn.net/weixin_29051193/article/details/163463927

**发布/生态解读**：
- 对标 Claude Cowork，公测并开放 npm 插件生态（ithome）：https://www.ithome.com/0/989/446.htm 、https://m.ithome.com/html/989446.htm
- 首发体验（ifanr）：https://www.ifanr.com/1675083
- 不选万星"花瓶"，死磕 Agent 基建（雷峰网）：https://www.leiphone.com/category/yanxishe/RZ78QNjvboOQZhCS.html
- "居然没 CLI？"（eet-china）：https://www.eet-china.com/mp/a516864.html
- 最大规模开源 Agent 路演（oschina）：https://www.oschina.net/news/487110
- Cordis 为递归自我改进铺路（BlockBeats）：https://www.theblockbeats.info/flash/361476
- 18k 星背后杀进 Claude Code 地盘（ic.work）：https://www.ic.work/article/deepseek-releases-dsh-agent-harness
- **插件架构 ≠ 统一 agent 逻辑（英文批评，hotmolts）**：https://www.hotmolts.com/post/a-plugin-architecture-is-not-a-unified-agent-logic-6388f344-3f84-405a-8235-28fcb4e58ebf
- 开发者预览版：一切皆插件（uied）：https://www.uied.cn/posts/921608
- 开源 dsh 框架解读（80aj）：https://www.80aj.com/2026/08/13/deepseek-agent-framework-plugins/ 、https://www.80aj.com/2026/08/13/deepseek-harness-ai-ecosystem/
- 详解 Harness 到底是什么（界面新闻）：https://www.jiemian.com/article/14868365.html
- DeepSeek 为什么必须做 Harness（网易）：https://m.163.com/news/article/L4727P0I00097U7T.html
- 为何是一头黑色鲸鱼（腾讯新闻）：https://news.qq.com/rain/a/20260813A0EP6V00
- 把 Agent 能力全部做成插件（凤凰科技）：https://tech.ifeng.com/c/8vZ0azYi0Sf
- 开发者预览版上线（新浪财经）：https://finance.sina.com.cn/roll/2026-08-13/doc-inineuqe4560769.shtml
- 黑鲸出水（东方财富）：https://finance.eastmoney.com/a/202608133840736098.html
- 面向全球开发者开放测试（今日头条）：https://www.toutiao.com/article/7673501112862851634/
- 给 AI 编程套上缰绳（今日头条）：https://www.toutiao.com/article/7669260499564888639/
- 内测评价刷屏（微博汇总）：https://weibo.com/2/detail/5331565122952928
- 英文泄露/发布解读（orcarouter）：https://www.orcarouter.ai/blog/deepseek-harness-leak
- Web UI 截图流传（digg）：https://digg.com/tech/7fx4ofvh
- 公众号注册传闻（新浪新闻）：https://www.sina.cn/news/detail/5331415036067930.html
- 技术人员主导的产品灾难（AIHOT 批评）：https://aihot.virxact.com/items/cmsrl8f51050qro46qcp6wp2y
- 金十数据、中华网、TechFlow：https://xnews.jin10.com/details/flash/102843417 、https://news.china.com/socialgd/10000169/20260813/49673635.html 、https://www.techflowpost.com/newsletter/131938
- 搜狐、百家号转载：https://www.sohu.com/a/1062513068_100106801 、https://baijiahao.baidu.com/s?id=1873414954887611344

### 2.7 视频（B 站）

- 《DeepSeek Harness 重磅发布！一切皆插件！万物皆可 DIY》：https://www.bilibili.com/video/BV17fgn6SEYh/
- 《计划有变、准备黑化 | DeepSeek Harness 来袭！》：https://www.bilibili.com/video/BV1CjuC6XEWt/
- 《Harness 实践：让 Agent 全自动制作知识讲解视频》：https://www.bilibili.com/video/BV1ypdgBCE9B/

### 2.8 社区知识要点小结（关于插件开发）

1. **官方推荐路径**：插件作者先读 `docs/cordis-primer.md`（五概念）→ `docs/architecture.md`（事件/接缝/速查表）→ `docs/cordis-tutorial`（7 课）→ cookbook（加 tool/package/LLM adapter/Chat node）。
2. **核心心智模型**：一切皆插件；服务靠 `ctx.<key>` 查找、依赖靠 `inject` 声明、通信靠类型化事件（emit/waterfall/parallel/serial）、注册靠 `ctx.effect()`/`ctx.on()` 且必须可逆；行为挂到既有扩展点（`agent/*`、`tools/*`、`fs/*`、`llm`、`shell`、`terminals`、`commands`、`jobs`、`sandbox` 等）。
3. **分发/发现**：插件仓库打 `dsh-plugin` topic 上 GitHub；社区目录 `awesome-deepseek-harness` / `awesome-dsh-plugins` 聚合；DSH 包均 `@deepseek-ai/dsh-*`，插件经 profile/bundle/cordis.yml 挂载。
4. **批评与争议**：无 CLI（eet-china）、issue 未开放（locdd）、"插件架构 ≠ 统一 agent 逻辑"（hotmolts）、"真正的差距在局部"（cnblogs/weiwuji）、"技术人员主导的产品灾难"（AIHOT）。
5. **未发现**：官方 Discord、arXiv/DOI、掘金/知乎的深度插件开发专栏（搜索未命中实质长文，相关信号 **[unverified]**）。

---

## 全部 URL 清单

### 论文 / Cordis 框架
1. https://github.com/cordiverse/paper
2. https://raw.githubusercontent.com/cordiverse/paper/main/README.md
3. https://github.com/cordiverse/cordis
4. https://github.com/cordiverse/cordis/pull/41
5. https://github.com/cordiverse
6. https://github.com/cordiverse/webui
7. https://github.com/koishijs/koishi/discussions/1361
8. https://koishi.chat/en-US/about/releases/v4.7.html
9. https://www.npmjs.com/package/cordis
10. https://socket.dev/npm/package/cordis2
11. https://socket.dev/npm/package/@cordisjs/core/overview/3.17.7
12. https://repos.ecosyste.ms/usage/npm/@cordisjs/loader
13. https://www.jsdelivr.com/package/npm/@cordisjs/loader
14. https://www.npmjs.com/package/cordis2

### DeepSeek Harness 官方
15. https://github.com/deepseek-ai/deepseek-harness
16. https://github.com/deepseek-ai/deepseek-harness/discussions
17. https://github.com/topics/dsh-plugin
18. https://trtgsjkv6r.feishu.cn/share/base/form/shrcnIt5twSVdLGD52KJBckGCgg
19. https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md
20. https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md
21. https://github.com/deepseek-ai/deepseek-harness/tree/master/docs/cordis-tutorial
22. https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cookbook/adding-a-package.md
23. https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cookbook/adding-a-tool.md
24. https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/index.md

### 聚合目录 / 第三方插件
25. https://github.com/0xsline/awesome-deepseek-harness
26. https://github.com/AdamPlatin123/awesome-dsh-plugins
27. https://github.com/zhu1090093659/dsh-web-ui
28. https://github.com/Nagi-ovo/dsh-visualize
29. https://github.com/NanmiCoder/dsh-agent-teams
30. https://github.com/vibeinging/dsh-tool-search
31. https://github.com/hust-open-atom-club/oh-dsh-desktop
32. https://www.npmjs.com/package/@linxin666/dsh-remote-web-ui

### 论坛
33. https://locdd.com/t/topic/79817
34. https://locdd.com/t/topic/80225/10
35. https://locdd.com/t/topic/79436/8
36. https://locdd.com/t/topic/79826/7
37. https://locdd.com/t/topic/79576/5
38. https://locdd.com/t/topic/79991/14
39. https://locdd.com/t/topic/79752
40. https://locdd.com/t/topic/80237
41. https://global.v2ex.co/t/1234203
42. https://global.v2ex.co/t/1234212
43. https://www.cocoloop.cn/t/topic/11516/10
44. https://www.cocoloop.cn/t/topic/11800/8
45. https://www.cocoloop.cn/t/topic/12106/3
46. https://www.cocoloop.cn/t/topic/12011/6
47. https://hn.edgecompute.app/item/49285244

### 博客 / 媒体
48. https://www.cnblogs.com/sing1ee/p/22455466
49. https://www.cnblogs.com/weiwuji/p/22456195
50. https://www.cnblogs.com/difs/p/22456170
51. https://blog.csdn.net/weixin_29051193/article/details/163463927
52. https://www.ithome.com/0/989/446.htm
53. https://m.ithome.com/html/989446.htm
54. https://www.ifanr.com/1675083
55. https://www.leiphone.com/category/yanxishe/RZ78QNjvboOQZhCS.html
56. https://www.eet-china.com/mp/a516864.html
57. https://www.oschina.net/news/487110
58. https://www.theblockbeats.info/flash/361476
59. https://www.ic.work/article/deepseek-releases-dsh-agent-harness
60. https://www.hotmolts.com/post/a-plugin-architecture-is-not-a-unified-agent-logic-6388f344-3f84-405a-8235-28fcb4e58ebf
61. https://www.uied.cn/posts/921608
62. https://www.80aj.com/2026/08/13/deepseek-agent-framework-plugins/
63. https://www.80aj.com/2026/08/13/deepseek-harness-ai-ecosystem/
64. https://www.jiemian.com/article/14868365.html
65. https://m.163.com/news/article/L4727P0I00097U7T.html
66. https://news.qq.com/rain/a/20260813A0EP6V00
67. https://tech.ifeng.com/c/8vZ0azYi0Sf
68. https://finance.sina.com.cn/roll/2026-08-13/doc-inineuqe4560769.shtml
69. https://finance.eastmoney.com/a/202608133840736098.html
70. https://www.toutiao.com/article/7673501112862851634/
71. https://www.toutiao.com/article/7669260499564888639/
72. https://weibo.com/2/detail/5331565122952928
73. https://www.orcarouter.ai/blog/deepseek-harness-leak
74. https://digg.com/tech/7fx4ofvh
75. https://www.sina.cn/news/detail/5331415036067930.html
76. https://aihot.virxact.com/items/cmsrl8f51050qro46qcp6wp2y
77. https://xnews.jin10.com/details/flash/102843417
78. https://news.china.com/socialgd/10000169/20260813/49673635.html
79. https://www.techflowpost.com/newsletter/131938
80. https://www.sohu.com/a/1062513068_100106801
81. https://baijiahao.baidu.com/s?id=1873414954887611344

### 视频
82. https://www.bilibili.com/video/BV17fgn6SEYh/
83. https://www.bilibili.com/video/BV1CjuC6XEWt/
84. https://www.bilibili.com/video/BV1ypdgBCE9B/
