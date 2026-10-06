# DSH 插件生态实测：我怎么判断一个插件该不该继续做

> English: [when-to-retire-a-plugin.md](when-to-retire-a-plugin.md)

## 0. 我做了什么，为什么公开

2026-10-05，我把 npm 上的 DSH 生态全量拉了一遍（324 个真插件），把自己每个插件与同赛道对手比了周下载量：**3 个退役、7 个冻结、1 个改判**。公开判据，是因为「该不该继续维护」人人都会遇到，却大多无数据可依。

## 1. 判据

先讲清楚一件事：**这不是一次清理门户，是一次自我审计。** 官方没有要淘汰第三方插件——宿主 `CONTRIBUTING.md:19` 说，官方仓里的包并不天然比社区包更重要；官方展示的作用是「一个想法、一次官方展示、一种灵感来源，但不是来自我们的命令」。压力来自第三方作者。这一点在第 3 节用数据说。

**两条硬标准。**

**硬标准 A：同一能力已被官方做进内核。** 措辞很重要。不是「官方有一个同名包」，而是「官方**默认挂载**」或「官方已把它做成**一等子系统**」。这两者的差别，是这次审查里最容易搞错的地方。

**硬标准 B：同能力面上，第三方存在采用度显著更高的实现。** 「显著」量级定为「高出一个数量级」。判据只用同生态内的**相对**量级，不用绝对值。

**一条软标准。**

**软标准 C：维护成本 vs 真实使用者数。** 这条最容易被误用。我现在自己的 Web profile 跑的是 stock 组合，一个家族插件都不装。所以「我还用不用」不能当判据——这批仓对我来说是**发布物**，不是**自用工具**。能当判据的是两句话：**对外是否还有人需要**，和**这份维护成本是否还值**。

**一条元规则。**

**只承认文件级证据。** 任何结论必须能指到具体文件、具体行，或具体的 npm / GitHub API 读数；指不到的一律标「未证实」，不进决策。这条规则在本轮纠正了 4 处我原本的前提，其中两处直接关于「官方到底有没有这个能力」——一处是官方做了、只是没挂载，另一处是官方挂了、而我原以为没有。

**三档处置。**

| 档位 | 数量 | 包 | 含义 |
|---|---|---|---|
| 🪦 **退役** | 3 | `dsh-background-agents`、`dsh-session-pin`、`dsh-team-rooms` | **停止兼容性更新**：README 顶部 RETIRED 横幅、npm 已 `deprecate`、GitHub 仓已归档（只读） |
| 🧊 **冻结** | 7 | `dsh-budget`、`dsh-memento`、`dsh-draw`、`dsh-claude-move`、`dsh-reach`、`dsh-wechat`、`dsh-defend` | **不发新功能；但仍然可用、没有废弃**，只有真实故障才修 |
| ✅ **改判** | 1 | `dsh-catalog` | 原本判退役，复核后改判：它是家族内部工具，不与第三方目录竞争，**继续维护** |

另有两支早期走廊线 `dsh-plugin-upgrade-015`（停在 npm `0.1.1`）与 `dsh-plugin-upgrade-016`（从未发布）已退役；插件升级由 `dsh-plugin-upgrade` 一条线独家继续。

## 2. 数据（一）：3 个退役

这一档基本只用了硬标准 A。

| 包 | 官方对应物 | 判定依据 |
|---|---|---|
| `dsh-background-agents` | `tool-subagent`（`backgroundMode: continuable`）+ `tool-subagent-control` + `tool-jobs` | 官方**默认挂载**。而且这个包**自己的 README 已经写了**：后台代理那一半 *superseded by DSH's native continuable subagents* |
| `dsh-session-pin` | `client-ui-workspace` 的 pin action | 官方**默认挂载**：会话右键菜单有 `Pin session`、行悬停有 pin 按钮、支持在置顶块内拖拽排序、宿主侧持久化 `pinnedSessionIds` 并广播 `pinned` 增量帧。插件这边剩下的只有行颜色 / 置顶面板 / 头部总开关这类外观增强 |
| `dsh-team-rooms` | `dsh-experimental-agent-team` | 官方把「团队」做成**一等子系统**：隐式根 roster、持久邮箱（离线成员恢复后收信、去重）、共享任务 DAG（CAS 防覆盖、依赖解锁、文件写冲突告警）、`wait_agent`。**同时**满足硬标准 B：自身周下载 **589（家族最低）**，第三方 `@nanmicoder/dsh-agent-teams` **13,273（22×）** |

关于 `dsh-team-rooms` 有一处必须说清楚：官方那个 `dsh-experimental-agent-team` 是**可选项**，base 里默认 `disabled`，而且启用时**要求禁用** `send_message` / `interrupt_agent` / `list_agents`。所以它不是「默认挂载式」的覆盖。它进内核、加上第三方 22× 的采用度，两条合起来才是这条判据成立的原因。

一处不好看的数据我照实写：`dsh-session-pin` 在官方内置 pin 之后**仍有 1,015 周下载**。报告给了两种解释——外观增强确实有真实需求，或者下载量口径本身有噪声。我无法从现有数据里区分这两者，所以按判据退役，但把这个数字留在这里。

## 3. 数据（二）：7 个冻结 —— 倍数表

采集时间 2026-10-05，来源 npm registry API。**先说口径**：npm 周下载量**不等于用户数**（含 CI、镜像、重复安装），所以下表只用**包与包之间的相对量级**，不用绝对值。

| 能力面 | 我的包（周下载） | 同赛道第三方（周下载） | 倍数 | 对手强在哪 |
|---|---|---|---|---|
| 成本 / 用量计费 | `dsh-budget` 1,079 | **`dsh-cost-meter` 33,526** | **31×** | 170+ 模型价目、11 家 Coding Plan 额度查询 |
| 跨会话记忆 | `dsh-memento` 1,202 | **`@openviking/dsh-memory-plugin` 10,160** | **8×** | 字节跳动 volcengine 官方组织仓，有公司级资源投入 |
| IM 桥接 | `dsh-reach` ~0.6k ／ `dsh-wechat` 752 | **`@xmanrui/dsh-im` 17,384** | **23×** | 一个包覆盖 10 个通道（微信 / 飞书 / 企微 / 钉钉 / QQ / TG / WA / Slack / Discord / Matrix） |
| 注入与破坏性命令防护 | `dsh-defend` 937 | **`cc-safety-net` 13,087** | **14×** | 作为 coding-agent CLI hook 直接拦破坏性命令与密钥文件访问，接入路径短、覆盖人群广 |
| 图像生成 | `dsh-draw` 973 | **`dsh-image-gen` 7,216** | **7×** | 多供应商 |
| 会话 / 配置迁移 | `dsh-claude-move` 843 | **`dsh-chat-import` 5,111** | **6×** | 覆盖 25+ 个 AI coding agent |

**补四条背景读数。**

- **生态盘子。** 两个关键词交叉取并集：8,620 条命中、772 个候选，逐个核对 `dsh` 字段确认真插件 **324 个**。（口径说明：这个数**只算 npm 上声明了 `dsh` 清单、真的能被 `dsh plugin add` 装上的包**。社区目录站公布的条目数会高得多——它们把 GitHub 仓、子目录、未发布的候选都计进去，所以两个数字不该互相引用，也不该相加。）
- **不是个别现象。** **16 个能力面里，我的包在 14 个面上不是第一**，多数落后 **3–31 倍**；差距最大的一处在上下文洞察面：`dsh-fast` 917 对 `dsh-context` 38,999（**43×**）。
- **家族内第一不等于赛道第一。** `dsh-mcp-panel` 2,472 是家族内第一，但同赛道 `dsh-mcp-connector` 是 7,556（3×）。
- **没有一个是放任不管的仓。** 在这份报告之前，全部相关仓在 2026-10-05 当天都还有推送。退役和冻结是一次**主动判断**，不是清理死项目。

**为什么是这 7 个？** 它们同时满足两件事：对手不只是下载量更高，而是**在能力面上做得更宽**（多供应商 / 多通道 / 多 agent / 官方组织资源）；而我在这些面上继续投入，已经不太可能产出「只有我能给」的东西。

也有两个反例必须一起说，否则判据会变成「落后就退」：

- **`dsh-fast`（917 对 `dsh-context` 38,999，43×）留在现状。** 它是轻量包，维护成本本就低，冻结省不下多少力气。**落后不是判据。**
- **硬标准 A 不成立、只成立硬标准 B，也足以冻结。** `dsh-draw` 这类包，官方对应物是**零**（`text-to-image` / `image_gen` / `txt2img` 在宿主全仓 0 命中），`dsh-memento` 也一样（官方 `capability-seams.md` 里没有 memory seam，`docs/user/guide/mcp-memory.md:5,31` 明写 shipped composition 里**没有** memory server）。**「官方没做」不等于「我该继续重投」**——记忆赛道至少有 10 个对手，`dsh-memento` 大概排在第 8 位。

## 4. 我在哪些面仍然第一

只列输的那一半，是误导。这一节是同时期的「仍然只有我」清单（2026-10-05）：

| 能力面 | 我的包（周下载） | 状态 |
|---|---|---|
| LSP 动作面 | `dsh-lsp-actions` **1,170** | **全生态无强力对手**。官方 LSP **刻意排除** rename / formatting / diagnostics / symbol 列表 |
| 插件认证 / 体检 / 评分 | `dsh-plugin-doctor` 218、`dsh-score`、`dsh-test-drive`、`dsh-plugin-certification` | **无对手**。生态里只有 `dsh-why`（137）、`dsh-fix`（1,503）这类「修坏插件」，不是评分体系 |
| 研究 / 报告引擎 | `dsh-research-report` 1,019、`dsh-industry-research` 926、`dsh-fund-research` 802 | **基本无对手**（垂直领域） |
| 数据质量 | `dsh-data-quality` 769 | 接近的只有 `dsh-data-cleaning-agent` |
| 声明式权限 + 网络策略 | `dsh-permission-rules` **1,459** | 下载量上 `dsh-perm-gate` 1,851 **略高**（报告原文标注为「对手略高」）；但**进程级 HTTP / CONNECT 代理网络策略**无人复制 |
| GitHub CI 自动化 | `dsh-github` 359 | 无对手（也是最低的一个，但确实没人在做） |

两条交叉验证：

- **star 冠军不是旗舰安全插件，是研究线。** `dsh-research-report` 215★ 与 `dsh-industry-research` 212★ 都高于 `dsh-memento` 139★、`dsh-permission-rules` 118★、`dsh-mcp-panel` 75★。
- **「官方没有」和「第三方没做」是两件独立的事。** 报告确认官方至今为零的面至少有 8 个（`dsh-defend`、`dsh-mask`、`dsh-budget`、`dsh-draw`、`dsh-translate`、`dsh-library`、`dsh-autotier`、`dsh-plugin-*` 工具链）——其中一部分被第三方占了，一部分还空着。**空缺本身不是护城河；没人在做、且我做得动，才是。**

## 5. 「冻结」不等于「废弃」

这一节是写给使用者的。

| 状态 | 会删包 / 撤版吗 | 还会修 bug 吗 | npm 状态 | 仓库状态 |
|---|---|---|---|---|
| 🪦 **退役**（3 个） | 不会 | **不会**（含兼容性更新） | 已 `deprecate` | 已归档，只读 |
| 🧊 **冻结**（7 个） | 不会 | **会**——但只有当宿主破坏性变更让它完全不可用时，才做最小兼容修复 | 正常，**没有** deprecated | 正常，**未归档** |
| 其余 | 不会 | 会 | 正常 | 正常 |

**已安装的用户该怎么做：什么都不用做。** 冻结的 7 个照常安装、照常运行，接口不变、版本不撤。只有当某次宿主升级真的把它弄坏了才需要动作——那种情况请开 issue，我会修。**如果你要的是新功能，请去用第 3 节表里那些对手**——它们在各自赛道上的采用度都明显更高，这也是我冻结自己这几个包的原因。

**为什么不用「删包」表达态度？** 因为删了之后，下一个人搜不到这个包，也看不到退役原因。所以家族表**行不删、只加状态备注**：退役与冻结的仓全部保留在每一张家族表里，用状态列标注 `🚫 已退役` / `🧊 已冻结`，描述原文照旧。

## 6. 给其他插件作者的 8 个自查问题

1. **官方是「有这个包」，还是「默认挂载」？** 官方 `experimental/*`、`computer-use`、`browser-use`、`lsp`、`speech-to-text` **都不在 stock 组合里**。「官方有包」不等于「用户装完就有」。
2. **`base` 里有这一行，等于用户有这个能力吗？** 不一定。Web 补丁会把 base 进程级挂载的模型面向工具行**逐条 disable**，再交给每个 agent preset 重新挂载。只查 `base/cordis.patch.yml` 会得出偏乐观的结论。
3. **你搜对手时用的是能力关键词，还是包名？** 只比包名会漏掉全部对手：`dsh-cost-meter` 与 `dsh-budget` 名字完全不同，`cc-safety-net` 与 `dsh-defend` 也是。
4. **同名等于同一件事吗？** 官方 `dsh-experimental-auto-review` 与 `dsh-auto-review` 同名，但安全模型相反：官方用当前 agent 自己的 provider / model，并自述 *can allow unsafe actions, deny useful work, and spend additional tokens*，没有确定性豁免、没有持久授权；我的是独立只读的第二模型 reviewer，失败即 **fail-closed**。这不算被替代。
5. **你的下载量能被第二个信号验证吗？** `dsh-budget` 周下载 1,079，star 只有 **10**——高下载更像 CI / 镜像噪声，低 star 才是真实吸引力。反过来 `dsh-auto-review` 有 **10 个 open issue**，那是真有人在用、在报障。单看下载量会骗人。
6. **「我还在用吗」是不是你的判据？** 如果不用了，它不该当判据（我的 Web profile 现在就跑 stock 组合）。换成这两句：**对外是否还有人需要？维护成本是否还值？**
7. **落后多少倍才该退？** 没有阈值。`dsh-fast` 落后 43× 留在现状，`dsh-defend` 落后 14× 被冻结。冻结要付的代价是「承认自己不再是这条赛道最好的选择」，所以只值得对「继续投入也不会产出独特东西」的包付这个代价。
8. **你的决定写进 README 了吗？** 只写在脑子里、或只写在一份内部报告里，等于没写。冻结的 7 个各自有 `## Maintenance status: 🧊 FROZEN` 一节，含实测对比表与「对手强在哪」的说明；退役的 3 个 README 顶部有 RETIRED 横幅。**使用者至少应该能从 README 里知道你为什么不做了。**

## 7. 事实陈述

- **家族现状**：家族表现在列 **44 个插件仓**（含 `dsh-plugin-upgrade-015` 的表为 45 行），其中 🚫 **已退役 3 个**、🧊 **已冻结 7 个**，其余按活跃仓维护。许可以 Apache-2.0 为主。
- **仓库位置**：https://github.com/PerryLink
- **数据采集时间**：2026-10-05。来源为那份自查报告——npm registry API 全量拉取、GitHub REST API 实测、宿主源码逐文件取证。**结论是可复核的**：每一条都能指到具体文件或具体 API 读数，指不到的一律标「未证实」。

最后一句，说给可能想接手的人：**`dsh-reach` 与 `dsh-wechat` 这两条 IM 桥接线，欢迎接手维护。** 它们被冻结的理由很具体——`@xmanrui/dsh-im` 在一个包里覆盖了 10 个通道，那是一件比我做得好的事。如果这两条线对你有用，而你想让它们继续长下去，两个仓都是宽松许可（`dsh-reach` 为 Apache-2.0、`dsh-wechat` 为 MIT），欢迎开 issue 谈接手。
