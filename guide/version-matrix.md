# DSH 版本适配矩阵（version-matrix.md）

> **这份文件回答一个问题**：我的插件要跑在哪个 DSH 上，那个版本有什么、没有什么、
> 哪一版开始行为变了。
>
> **测量时间**：2026-10-09（官方版本线）／2026-10-13（生态数字）。
> **数据来源**：npm registry `@deepseek-ai/dsh`、GitHub REST API（tags/commits/releases）、
> 官方 `docs/upgrade-guide/**`、官方 `docs/persistence-changes/**`。逐条可复现命令见 §7。
>
> **口径**：本文件只写**有出处**的数字。取不到的一律写 `未核`，不写推测值。
> 官方说法与社区实测冲突时分别标注。

---

## 1. 先认版本：五个"最新"不是同一个东西

这是插件作者**第一个**要做的判断。五个数可以不相等，而 peer 范围按线分叉：

| # | 说法 | 值（2026-10-09） | 怎么查 | 性质 |
|---|---|---|---|---|
| 1 | npm `latest` | `0.2.0-rc.2` | `npm view @deepseek-ai/dsh dist-tags` | 默认装的就是这个 |
| 2 | npm `next` | `0.2.0-rc.2` | 同上 | 与 latest 同值 |
| 3 | npm `alpha` | `0.2.1-alpha.2` | 同上 | 最新发布 |
| 4 | master 最新 tag | `dsh-v0.2.1-alpha.2` | GitHub `/tags` | 源码线的名字；**等于 master HEAD** |
| 5 | **本机实际** | — | `dsh --version` | **唯一真正要紧的数** |

### 1.1 没有"稳定版"这回事

- **全部 31 个 npm 版本都带 `-alpha.N` / `-rc.N` 后缀；全部 26 个 GitHub Release 都是 `prerelease: true`。**
- 所以 npm 的 `latest` 标签在这里**不代表稳定**——它只是"默认安装会拿到的那一个"。
- 给作者的有效读法：**最新 = `0.2.1-alpha.2`（npm `alpha`）；默认安装 = `0.2.0-rc.2`（npm `latest`/`next`）**。
- 官方 `CONTRIBUTING.md` 明确**不接受外部 PR**，`AGENTS.md` 声明 API 处于 pre-stable。
  插件作者无法"等它稳定"，只能**钉版本 + 声明区间**。

### 1.2 ★ 陷阱：子包的 `latest` 是冻住的

主包 `@deepseek-ai/dsh` 每次发版都会重发全部子包到 `alpha`/`next`，但**每个子包的 `latest`
标签停在它第一次被设置的那个版本，永不前进**。裸装子包会装到远古版本：

| 包 | `latest`（冻住的值） | `next` | `alpha` |
|---|---|---|---|
| `@deepseek-ai/dsh` | `0.2.0-rc.2` | `0.2.0-rc.2` | `0.2.1-alpha.2` |
| `@deepseek-ai/dsh-base` | **`0.0.1-rc.1`** | `0.2.0-rc.2` | `0.2.1-alpha.2` |
| `@deepseek-ai/dsh-session` | **`0.0.1-rc.1`** | `0.2.0-rc.2` | `0.2.1-alpha.2` |
| `@deepseek-ai/dsh-tools` | **`0.0.1-rc.1`** | `0.2.0-rc.2` | `0.2.1-alpha.2` |
| `@deepseek-ai/dsh-subagent` | **`0.0.1-rc.1`** | `0.2.0-rc.2` | `0.2.1-alpha.2` |
| `@deepseek-ai/dsh-home-paths` | `0.0.1-rc.3` | `0.2.0-rc.2` | `0.2.1-alpha.2` |
| `@deepseek-ai/dsh-client-ui-primitives` | **`0.0.1-rc.1`** | `0.2.0-rc.2` | `0.2.1-alpha.2` |
| `@deepseek-ai/dsh-agent` | `0.1.0-rc.6` | `0.2.0-rc.2` | `0.2.1-alpha.2` |
| `@deepseek-ai/dsh-typert-protocol` | `0.1.0-rc.6` | `0.2.0-rc.2` | `0.2.1-alpha.2` |
| `@deepseek-ai/dsh-package-manifest` | `0.1.3-alpha.2` | `0.2.0-rc.2` | `0.2.1-alpha.2` |
| `@deepseek-ai/dsh-plugin-manager` | `0.1.6-alpha.2` | `0.2.0-rc.2` | `0.2.1-alpha.2` |
| `@deepseek-ai/dsh-experimental-ptc-runtime-python` | `0.1.6-alpha.1` | `0.2.0-rc.2` | `0.2.1-alpha.2` |
| `@deepseek-ai/dsh-otel` | `0.2.0-rc.1` | `0.2.0-rc.2` | `0.2.1-alpha.2` |

**结论三条**：

1. 永远不要写 `"@deepseek-ai/dsh-tools": "latest"` 或裸 `pnpm add @deepseek-ai/dsh-session`。
2. **不要依赖子包版本号判断宿主代次**——`dsh-agent` 的 `latest` 停在 `0.1.0-rc.6`，
   而它可能正跟着 `0.2.1-alpha.2` 运行。判断代次只认 `dsh --version`。
3. 共享实例的 dsh 包一律 `peerDependencies` + `devDependencies`（**绝不 `dependencies`**），
   按 §4 选区间。

---

## 2. 破坏性变更断层（只列"哪一版开始不一样"）

流水账在 §8；这里只列作者真正会撞上的断层。**官方 `docs/upgrade-guide/v<X>/` 的目录名
`X` 是"变更被引入的版本"，描述的是从 X 升到**下一个** release 的变更**——
原文措辞是 *"In vX, … was so; the next release no longer…"*。别把目录名当目标版本。

| 断层 | 引入版本（目录名） | 落到哪一版 | 影响面 |
|---|---|---|---|
| **即插即拔基础设施** | `0.1.6-alpha.2` | 同版 | `dsh-hmr` / `dsh-plugin-manager` / `ui-plugin-manager` 三包一次性出现；新增 `ctx.hmr` / `ctx.pluginManager` / `ctx.profileContext` |
| **peer 从"声明"变"运行时门禁"** | `0.1.7-rc.1` | 同版 | `plugin-compatibility.ts` 三文件首次出现；不匹配的行被直接 `disabled`，模块永不导入 |
| **会话格式 V4 + 本世代破坏性变更** | `0.1.7-alpha.1` | 同版 | `SESSION_FORMAT_VERSION` 3→4、settings 重写、`readBytes`、Messages-only 适配器 |
| **0.2.0 世代清理** | `0.2.0-rc.2` | 下一版 | 移除 runtime invariants、schedule bundle 退役、子路径插件不再读 `package.json`、新增 `no-response` 错误码 |
| **0.2.1-alpha.2 大批变更** | `0.2.1-alpha.1` | `0.2.1-alpha.2` | **19 条**破坏性变更（见 §3） |

> ⚠ **两个断层不属于同一层面，别混**：`0.1.6-alpha.2` 解决"能不能热插拔"，
> `0.1.7-rc.1` 才解决"版本不匹配时会不会被拦"。`0.1.6-alpha.2` 上的
> `dsh-plugin-manager` **没有** peer 预检。

> ⚠ **`0.1.5-rc.3` 是时间线上的陷阱**：它在 `0.1.6-alpha.2` **之后**发布（2026-09-22），
> 是给留在 0.1.5 线用户的**回补版本**，也是唯一**没有 GitHub Release** 的 tag。
> 它的依赖写成精确版本、没有 `exports`、没有 `dsh-hmr`/`dsh-plugin-manager`。
> **任何"按发布时间排序推断版本新旧"的脚本都会在这里出错——必须按 semver 比较。**

---

## 3. `0.2.1-alpha.1 → 0.2.1-alpha.2`：19 条破坏性变更

如果你在 `0.2.0-rc.2` 或更早的线上，**这 19 条与你无关**；如果你跟的是 master/alpha 线，
**逐条核对**。官方 release notes 也列了这 5 条为 "other changes"：Python PTC 沙箱、
`both` 模式移除、`dshHome` 移除、子代理执行统一、Agent Team 直投收件箱。

| # | 变更 | 破坏了什么 | 你要做什么 |
|---|---|---|---|
| 1 | `subagent-activations` | `backgroundMode`/`enableRunInBackground`/`run_in_background` 全部移除；`@deepseek-ai/dsh-subagent-in-process-driver` 包被删；`ctx.subagents.start()`→`startActivation()` | 删两个配置键与工具参数；宿主代码换 `startActivation({ …, delivery: 'caller' })`；自定义本地 provider 要实现 `prepareContinuable()` |
| 2 | `tool-presentation-mode` | `mode` 只接受 `native`/`ptc`，**`both` 被拒绝**；含环境变量 `DSH_TOOLS_MODE=both` 与 `ctx.tools.presentAs('both')` | 改成 `native` 或 `ptc` |
| 3 | `web-listener-trust-config` | **`webRuntime` 服务被移除**，改 `webStartup`（行 `web-startup`）；`ctx.webRuntime.lanAddresses` 没了；**通配 host（`0.0.0.0`/`::`）在加载期被拒** | `inject: [webRuntime]`→`[webStartup]`；`trustedHosts` 换服务；通配 host 换具体 IP 字面量 |
| 4 | `working-directory` | 内置 `{{cwd}}` 提示变量被移除；`cwd` 配置从 ACP / DSH-SDK 子代理移除；**保留 `{{cwd}}` 的自定义模板在模型请求前就失败** | 删提示里的目录子句；`cwd` 改由子请求传或先调 `working_directory({ cd })` |
| 5 | `session-title-provider-strategy` | `dsh-session-title-llm` 移除 3 个导出符号（`registerSessionTitleLlmProvider` / `generateSessionTitleWithLlm` / `SessionTitleLlmMessageSelector`）；`targetWords`/`targetCjkCharacters` 移到各 provider 自己的 Config | 改用 `ctx.sessionTitle.register({ id, automatic, generate })`，自己搭 system/input |
| 6 | `session-title-adapters` | 标题请求改走 `ctx.llm.prepareCall()`；只挂 `llm/stream` 中间件的组合需另注册 adapter；自定义 adapter 的 `reasoning.efforts` **必须从低到高排** | 用 `ctx.llm.registerAdapter()` 注册标题路由 |
| 7 | `ssh-helper-launch` | `dsh-ssh` 用单一 `launch` 键取代 `node`/`bootstrapPath`/`bootstrapHash`；**要求 SSH protocol 2**；`dsh-ptc-runtime-node` 的 `nodeExecutable`/`bootstrapPath`→`launch` | `launch: { kind: 'node-script' }` 或 `{ kind: 'executable' }`；helper 与 hash 必须同改 |
| 8 | `team-direct-inbox` | Agent Teams 消息直投目标 inbox，独立 mailbox 消失；`send_message` 只返回 `{"sent":true}`；`maxPendingMessagesPerMember` 移除；**未投递的排队消息永不派发 = 数据丢失** | **升级前**让待发消息跑完；升级后必需的显式重发 |
| 9 | `instruction-home-override` | `dsh-agent-instructions` 移除 `dshHome` 配置字段，改用 `@deepseek-ai/dsh-home-paths` 的 `resolveDshHome()`；**残留键被静默忽略** | 删 `dshHome`；改用进程环境变量 `DSH_HOME` |
| 10 | `experimental-package-composition` | CLI 与 Python runtime 的安装依赖**不再包含 hook 桥**；安装与组合分离（装了不等于挂上）；只"启用"被删行的 patch 不会把它插回来 | 显式装 peer；选 bundle **先于**覆盖其行；用完整 `insert` 替代对已删行的 override |
| 11 | `native-subagent-bundle-tools` | 选中 bundle 会**额外注册 Host 全局工具**（`tool-subagent-claude-code`/`-codex`），对最小预设也可见；**插件构造或严格校验 `BundleInfo` 必须补两个必填字段 `official`/`availability`**；`PluginPackageRef` 同理 | 补必填字段；删同名冗余 Host 行（会被遮蔽） |
| 12 | `python-ptc-sandbox` | Python PTC runtime **要求 `sandbox` + `sandboxPolicy` 服务**；默认 `read-only`；受限运行会以 `sandbox-unavailable` 失败 | 挂 `dsh-sandbox-local` + `dsh-sandbox-policy`；设 `sandbox-policy` 行的 `mode`/`workspaceRoot` |
| 13 | `python-optional-resources` | Python wheels **不再内置** Office sidecar 与 authoring 解释器；SDK 启动不再下载 | 用前显式 `download_office()` / `download_primary_runtime()`；离线部署预置 `DSH_RESOURCE_CACHE` |
| 14 | `plugin-option-placement` | `dsh plugin` 只认**转发给 pnpm 的参数之前**的 `--profile`；**`dsh plugin add <pkg> --profile <name>` 现在直接失败** | 改成 `dsh plugin --profile <name> add <package>` |
| 15 | `terminal-command-labels` | `TerminalBlockLabels`（`dsh-client-ui-primitives`）新增**必填** `commandLine(line: number): string` | 给每个 labels 对象补 `commandLine` |
| 16 | `deepseek-model-discovery` | `deepseek-official` 路由**无 key 时返回空目录**，Desktop/Web 隐藏 DeepSeek 组 | 配 key 或用 `apiKeyEnv` 指定的环境变量；自定义消费方要处理空目录 |
| 17 | `new-session-generations` | Web/Desktop 新建会话会**同时新建 Agent**，不再复用空会话 | 改过预设定义后用 New Session；要复用用 `openWorkspace`/`connectWorkspace` |
| 18 | `mock-messages-events` | `dsh-llm-mock-server` 会在结构化 SSE 负载旁**同时发 Messages 事件名** | 消费具名事件，别只筛匿名消息 |
| 19 | `desktop-test-auth-popup` | Desktop **测试**认证弹窗默认关闭 | 需要时设 `updates.allowTestAuthPopupWindow: true` 并完全重启 |

另有一条**回填**在 `v0.2.0-rc.2/` 目录里、但我们基线之后才加入的：
`bundled-python-tests`（打包的 NumPy/pandas **测试目录**被移除；要跑上游测试套件请另建
Python 环境）。它放在旧目录属于例外——上游自己的规则是"版本号 bump 后旧目录冻结"。

**出处**：每条对应
`docs/upgrade-guide/v0.2.1-alpha.1/<item>/guide.md`（官方仓库 master）；
发布说明 `releases/tag/dsh-v0.2.1-alpha.2`。

---

## 4. 我该声明什么 peer 区间

两条硬事实：

1. **peer 是运行时门禁，不是声明。** 从 `0.1.7-rc.1` 起，`app-boot/src/plugin-compatibility.ts`
   在插件被 import **之前**校验 `peerDependencies` 里的 `@deepseek-ai/dsh` / `@deepseek-ai/dsh-*`；
   不匹配的行被**直接置为 `disabled`**，模块永不导入。
2. **门禁语义是 `includePrerelease: true`**（`plugin-compatibility.ts:77`），比裸 semver **宽松**。
   `engines.dsh` 与 `dsh.manifestVersion` 则是**纯声明、零强制**——写了不生效。

### 4.1 家族内当前使用的规范区间

```
>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0 || >=0.2.0-0 <0.3.0 || >=0.2.1-0 <0.3.0
```

这是 `dsh-plugin-kit` 的 `data/peer-range.json`（`canonicalRange`，2026-09-26 更新）所记录的
规范值，六个子句按线枚举。**本仓库 `src/cli/templates.ts` 生成的区间与它逐字节一致**，
是仓库内唯一副本。

### 4.2 选区间的判断法

| 你的插件用了什么 | 下界至少要到 |
|---|---|
| 只用 Cordis 基础能力（tools/events/services/effects） | `0.1.2-rc.1`（最早） |
| 用了 `ctx.hmr` / `ctx.pluginManager` | `>=0.1.6-0` |
| 依赖 peer 门禁本身、或 0.1.7 的 API | `>=0.1.7-0` |
| 用了 0.2.0 世代接口（settings 重写后） | `>=0.2.0-0` |
| 用了 §3 里任何一条新形态（如 `webStartup`、`BundleInfo.official`） | `>=0.2.1-0` |

**不要**写开区间上界（如 `>=0.1.2-rc.1 <0.3.0`）：它跨过了整代破坏性变更，
门禁放行但运行时会炸。**上界必须按世代切**（`<0.2.0` / `<0.3.0`）。

---

## 5. 会话格式（persistence）版本谱系

插件若读写会话日志，必须认这个表。

| 格式 | 首次写入的版本 | 规模（root/type） | 说明 |
|---|---|---|---|
| V0 | `0.1.2-rc.1` | 54 / 415 | 历史 **V0 参考快照**取自这个 tag |
| **V1** | **从未发布** | — | 没有 tag 的 writer version 是 1（来源 PR #3349） |
| V2 | `0.1.3-alpha.2` | 56 / 435 | — |
| V3 | `0.1.5-alpha.1` | 60 / 467 | 源码 PR #4320 |
| **V4** | `0.1.7-alpha.1` | 63 / 597 | 当前；`SESSION_FORMAT_VERSION` 3→4 的提交是 `c36a83ff…` |

**官方权威记录**：`docs/session-format-status.md` 现在写
`latestReleasedVersion: 4` / `evidenceTag: dsh-v0.2.0-rc.2`。
（我们镜像快照早于该更正，曾把它记为"未解决的矛盾"——**以 live 为准**。）

**三个读数陷阱**：

1. **逐版本持久化档案冻结在 `0.1.5-rc.2`**（2026-09-12 采集，26 tag / 25 次转换）。
   `0.1.6-alpha.1` 之后**没有任何持久化记录**。所以新版本的唯一官方历史是 **upgrade-guide**。
2. **V4 之后仍有 `same-version` 记录**（不改格式号也能加类型）。基线后有
   `2026-09-13-working-directory` 等 5 条，其中 `event:working-directory/change` 是
   **required-on-read**——**旧构建拒绝打开含该事件的日志**。
3. **多帧 zstd**：`session.jsonl.zstd` **每次写入追加一个 zstd frame**，
   `zstdDecompressSync` 一次只解出第一帧（137 行会话可能只得到 1 行）。
   必须按魔数 `28 B5 2F FD` 切分。

---

## 6. 能力 × 版本（22 个原生能力面）

**这一节的"引入版本"是怎么算出来的**（决定了它能怎么用）：
对每个能力面取"**首个包含该路径新增提交的 tag**"——`git log --diff-filter=A --reverse -- <path>`
配 `git tag --contains`，再按 tag 创建时间取最早的一个。**这是包/路径层面的引入，不是 API 层面的精确引入**：
一个能力面内部的某个具体函数、配置键、服务键可能比整面晚若干版本。
**要精确到 API 就查 `references/official-docs/docs/subsystems/*.md` 与 `docs/capability-seams.md`**，
不要拿这张表当 API 级答案。

**口径警告（必须连带引用）**：本 checkout 里**最早的 tag 是 `dsh-v0.1.0-rc.7`（2026-08-17）**。
更早的 `dsh-v0.0.1-rc.1` … `dsh-v0.1.0-rc.6` **只在 `docs/persistence-changes/releases/` 里有文档、没有 tag**。
所以表里的 **`≤ rc.7` 意思是"在最老的 tag 上就已经存在"，不是"rc.7 引入"**——
真正的引入时间只能靠首提交日期或 Agent Note 日期（表里给了）。

| # | 能力面 | 引入版本 | 更细的时间锚（原文） |
|---|---|---|---|
| A1 | **Subagents** | **≤ `dsh-v0.1.0-rc.7`** | seam ≤ rc.7（note 2026-06-21）；continuable note 2026-07-28；控制工具首提交 2026-08-02 |
| A2 | **Agent Teams**（实验） | **`dsh-v0.1.0-rc.8`** | note 2026-08-05；包首提交 2026-08-19 → `rc.8`；profile bundle 2026-09-04 → `0.1.3-alpha.1` |
| A3 | **Workflow 编排** | **`dsh-v0.1.6-alpha.1`** | note/`tool-workflow` 2026-07-05、`tool-ralph` 2026-07-20（均 ≤ rc.7）；`workflow-ptc` 2026-09-13 → 本版 |
| A4 | **后台作业**（jobs） | **≤ `dsh-v0.1.0-rc.7`** | 首提交 2026-08-13；整合 note 2026-09-03 |
| A5 | **定时 / cron** | **`dsh-v0.2.1-alpha.1`** | `after` 2026-08-05、定频 + cron 2026-08-06（`31c0c6a9f6`）→ ≤ rc.7；**工具包改为 preset 作用域** 2026-09-24 → 本版 |
| A6 | **目标追踪**（goal） | **≤ `dsh-v0.1.0-rc.7`** | 2026-07-19（三份 note） |
| A7 | **Plan mode** | **≤ `dsh-v0.1.0-rc.7`** | 2026-07-22（note `2026-07-07-plan-mode`） |
| A8 | **Todo** | **≤ `dsh-v0.1.0-rc.7`** | 2026-06-29 |
| A9 | **LSP 导航** | **`dsh-v0.1.3-alpha.1`** | seam 2026-07-16；`lsp-stdio` 2026-08-13（≤ rc.7）；`tool-lsp` 2026-09-04 → 本版 |
| A10 | **浏览器自动化** | **`dsh-v0.1.6-alpha.1`** | 2026-09-12/13（note 2026-09-12）；**seam 原生、provider 实验性** |
| A11 | **Computer use** | **`dsh-v0.1.6-alpha.1`** | 2026-09-12；**seam 原生、provider 实验性** |
| A12 | **MCP client** | **`dsh-v0.1.3-alpha.1`** | client note 2026-07-07；成组首 tag 2026-09-04 |
| A13 | **可观测 / OpenTelemetry** | **`dsh-v0.2.0-rc.1`** | otel 包 2026-09-25 → 本版；product adapter 2026-09-21 → `0.1.7-alpha.2`；session adapter 2026-09-04 → `0.1.3-alpha.1` |
| A14 | **交付物 / 文档 / 附件** | **`dsh-v0.1.6-alpha.2`** | deliverables 2026-09-14、office-to-pdf 2026-09-16 → 本版；attachment seam 2026-09-04 → `0.1.3-alpha.1` |
| A15 | **会话存储 / 持久化检查点 / 搜索 / fork-resume-export** | **`dsh-v0.1.3-alpha.1`** | session/llm 2026-06-11；检查点策略 2026-08-09（≤ rc.7）；session-query-sqlite 等 2026-09-04 → 本版；**V4 格式 2026-09-16** |
| A16 | **Web 访问**（search/fetch） | **`dsh-v0.1.3-alpha.1`** | seam note 2026-06-24；成组首 tag 2026-09-04 |
| A17 | **出站 webhook** | **`dsh-v0.1.2-alpha.1`** | 成组 2026-08-23 → 本版；GitHub 适配器 2026-09-04 → `0.1.3-alpha.1` |
| A18 | **终端 / SSH / shell** | **`dsh-v0.1.6-alpha.1`** | shell/terminal 2026-08-13（≤ rc.7）；**SSH 2026-09-12 → 本版**；终端权限 note 2026-09-16 |
| A19 | **权限 / 审批 / 沙箱** | **`dsh-v0.1.3-alpha.1`** | sandbox/permission/user-approval/commands 2026-09-04 → 本版；Windows ACL note 2026-08-08、guards 2026-07-08（均 ≤ rc.7） |
| A20 | **扩展点：skills / 动态插件 / hooks / presets** | **`dsh-v0.1.6-alpha.2`** | skill 2026-07-10、hooks 2026-07-01（≤ rc.7）；**plugin-manager 工具 2026-09-14 → 本版**；preset registry 2026-09-21 → `0.1.7-alpha.2`；cordis runners 2026-09-04 → `0.1.3-alpha.1` |
| A21 | **上下文管理：compaction / spill / 观察策略** | **`dsh-v0.1.3-alpha.1`** | compaction seam 2026-06-18、成组 2026-08-13（≤ rc.7）；spill 成组 2026-09-04 → 本版；图片 offload 2026-09-08 → `0.1.6-alpha.1` |
| A22 | **插件 / API 面：Remote 控制器 / Typert / SDK / ACP / bundle** | **`dsh-v0.1.2-alpha.1`** | acp 2026-06-16、sdk 2026-07-15、api/typert 2026-07-29–08-07（≤ rc.7）；sdk-minimal 2026-08-24 → 本版 |

### 6.1 只在该特写表里的能力（§1–§5 未收）

前几节只列了"会破坏插件"的项；下表补**新增即用得上**的接缝，出处同样是官方 `docs/`：

| 接缝 / 机制 | 引入 | 出处 |
|---|---|---|
| `ctx.hmr`、`ctx.pluginManager`、`ctx.profileContext` | `0.1.6-alpha.2` | 三包同版首次出现（逐 tag `git cat-file -e` 验证） |
| peer 兼容性运行时门禁 | `0.1.7-rc.1` | `plugin-compatibility.ts` 等三文件首次出现 |
| 会话格式 V4 | `0.1.7-alpha.1` | `SESSION_FORMAT_VERSION` 提交 `c36a83ff…` |
| `ctx.mcpResources`、`ctx.browserUse`、`ctx.computerUse`、`ctx.ssh`、`ctx.inspector`、`ctx.dynamicCordisRunner` + `ctx.cordisInspect` | `0.2.1-alpha.1` | 见 A10/A11/A12/A18/A20 行；归档调研与官方 `docs/capability-seams.md` |
| 新 slot `conversation.input.permission`、`sidebar.right.tab.guide.entry` | `0.2.1-alpha.1` | 官方 slot 文档 |
| `webStartup`（取代 `webRuntime`） | `0.2.1-alpha.2` | `upgrade-guide/v0.2.1-alpha.1/web-listener-trust-config` |
| `BundleInfo.official` / `.availability`（**必填**） | `0.2.1-alpha.2` | `upgrade-guide/v0.2.1-alpha.1/native-subagent-bundle-tools` |
| `working_directory` 工具、`create_worktree` | `0.2.1-alpha.2` 前 | live `docs/tool-catalog.md` |
| `@deepseek-ai/dsh-invariants` | ≤`0.2.0-rc.2` 存在 → `0.2.1-alpha.1` **移除** | `upgrade-guide/v0.2.0-rc.2/remove-runtime-invariants` |
| `@deepseek-ai/dsh-experimental-schedule-bundle` | `0.2.0-rc.2` 退役 | `upgrade-guide/v0.2.0-rc.2/schedule-bundle-retired` |
| 子路径插件读自己的 `package.json` 取展示文案 | ≤`0.2.0-rc.2` → `0.2.1-alpha.1` **不再读** | `upgrade-guide/v0.2.0-rc.2/subpath-plugin-display-manifest` |
| `repository-plugin`（`.dsh-plugin`） | 2026-08-09 推出 → **08-11 移除** | 社区实测（`vlln/plugin-registry` 档案，**该仓 2026-10-03 已归档**） |

> 22 面全表连同每面的**工具名、API 名、配置键与逐条出处行号**，来自一次
> read-only 清点。**清点时 checkout 在 `dsh-v0.2.1-alpha.1` / `5badb15`；本库镜像现已同步到 `dsh-v0.2.1-alpha.2` / `d743267`**，
> 本文只摘"引入版本"一列；**要完整清单请按上文口径重跑**，或读官方
> `docs/subsystems/*.md` + `docs/capability-seams.md` + `docs/tool-catalog.md`。

---

## 7. 自检与复现

```powershell
# 五个"最新"里的前四个
npm view @deepseek-ai/dsh dist-tags
# { latest: '0.2.0-rc.2', next: '0.2.0-rc.2', alpha: '0.2.1-alpha.2' }

# 子包 latest 是否冻结（换包名即可）
npm view @deepseek-ai/dsh-tools dist-tags
# { latest: '0.0.1-rc.1', next: '0.2.0-rc.2', alpha: '0.2.1-alpha.2' }

# master 最新 tag 与 HEAD
Invoke-RestMethod -Headers @{'User-Agent'='x'} `
  https://api.github.com/repos/deepseek-ai/deepseek-harness/tags | Select-Object -First 3 name

# 官方 upgrade-guide 目录（新断层会新增一个版本目录）
Invoke-RestMethod -Headers @{'User-Agent'='x'} `
  https://api.github.com/repos/deepseek-ai/deepseek-harness/contents/docs/upgrade-guide

# 本机实际版本 —— 唯一真正要紧的那个
dsh --version
```

**维护节奏**：官方 3 周内发过 9 个 prerelease。每次官方发版后按
`docs/upgrade-guide/**`（**无 index、无入链，必须主动看**）+ `docs/persistence-changes/**`
+ GitHub Releases 三处增量更新本文件与 `guide/migration-0.2.md`。

---

## 8. 与 `guide/migration-0.2.md` 的分工

| 文件 | 回答什么 | 形态 |
|---|---|---|
| **本文件** | 「哪个版本有/没有什么」「我该声明什么区间」 | **速查表 + 版本锚点** |
| `guide/migration-0.2.md` | 「从 0.1.6 升到 0.2 世代要改什么」 | **迁移叙事 + 逐条清单** |

两者双向互链。**冲突时官方原文优先**（`references/official-docs/`）；官方文档与代码冲突时
以代码/产物为准，并**显式标注分歧**。

---

## 9. 未核事项（不要当成已知）

- §6 的"引入版本"是**包/路径层面**的（首含该路径的 tag），**不是 API 层面**；面内某个具体
  函数/配置键/服务键可能更晚。精确到 API 请查官方 `docs/subsystems/*.md` 与 `docs/capability-seams.md`。
- §6 的 `≤ rc.7` 是**下限**不是引入点：本 checkout 最老的 tag 是 `dsh-v0.1.0-rc.7`，更早只有文档没有 tag。
- `0.1.2-alpha.2` 首次出现 `dsh.configTrees`，`0.1.7-alpha.1` 又移除它——**中间是否还有变更未逐版核对**。
- 子包 `latest` 冻结的**原因**未确认（值已实测，机制未证）。
- `0.1.0-rc.3` / `-rc.4` 在持久化档案的 tag 清单里存在，但 live tag 列表与 npm 都没有——**原因未知**。
- 24 个基线之前版本的 release note **正文**未逐条读取（正文存在，`0.1.7-rc.1` 有 19,003 字符）。
  写权威的逐版本历史前必须读。
- `dsh-v0.1.2-alpha.1`、`dsh-v0.1.3-alpha.1` 是 **GitHub-only** 版本（有 release，npm 上没有）。
