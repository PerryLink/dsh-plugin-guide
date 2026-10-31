# DSH 插件三层采用标准：ENTRY、FLOW、BOOST

> **状态：社区草案，非官方。** 本章解释 `dsh-standards` 项目（写作时为私有草案，向维护者申请访问）维护的三层模型。它是教学材料，不是认证、排名、安全审计，也不代表 DeepSeek 官方立场。如果你手上的条款原文或 `spec/levels.json` 与本摘要冲突，以原文和该文件为准。英文版：[standards.md](standards.md)。

## 三层，三个不同的问题

在 DSH 插件生态里，"合格"至少是三个问题，而不是同一把尺子上的三个刻度。**DSH-ENTRY** 问：现有插件几乎不改，能不能在目标 DSH 线上被识别、安装并跑起来——这是兼容底线（"装完能跑"）。**DSH-FLOW** 问：装好之后，用户能不能装得上、配得动、用得顺、出错能恢复、能升级、能卸干净——这是推荐采用体验（"用起来顺"）。**DSH-BOOST** 问：插件有没有用 Cordis 原生能力（effect、inject、volatile、事件、seam、jobs、有界并行）把开发和使用做得可测量地更省——这是指导性实践，以证据卡登记，不是徽章（"用 Cordis 做得更省"）。

一个插件可以 `ENTRY=runtime`、`FLOW=not-run`；一个 `BOOST` 已 measured 的插件仍可能 `ENTRY` 失败。所以三层必须**分开判定、分开引用、分开过期**。不要把三层折成一个分数，不要用 `BOOST` 反推 `ENTRY`，也不要在不写证据状态的情况下只说"它是某一级"。

## GB 类比（仅为类比，不是标准）

> **仅为类比——非官方。** GB / GB∕T / GB∕Z 三列只借用"基线 / 推荐 / 指导"的**分层直觉**。本项目没有标准化主管机构、没有标准号、没有认可资质、没有法律效力，也没有 DeepSeek 背书。`DSH` 是缩写；DeepSeek Harness 是 DeepSeek 的商标。不要据此把插件写成"符合 GB""国家认证""官方认证"或"排名第几"。

| 维度 | GB（类比） | GB∕T（类比） | GB∕Z（类比） |
|---|---|---|---|
| 在类比中代表 | 强制性国家标准 | 推荐性国家标准 | 国家标准化指导性技术文件 |
| 本项目 | **DSH-ENTRY** | **DSH-FLOW** | **DSH-BOOST** |
| 回答 | 能不能装、能不能跑 | 装完之后顺不顺 | Cordis 有没有被用出效率 |
| 采用方式 | 自选采用；声称通过就必须过 | 推荐采用；不采用不构成"不合格" | 指导性；只登记做法与证据 |
| 失败的说法 | 不能声称兼容 | 不推荐大规模采用 | 不能声称增效 |
| 证据 | G0–G5 + 静态/运行时状态 | J1–J8 + 旅程记录 | LEV-1–8 + 证据卡 |
| 本项目强制力 | 无；只有引用时的自洽要求 | 无 | 无 |

## 两轴：采用深度 × 证据状态

深度与证据是两个独立坐标。`ENTRY` 不是"铜牌"，`FLOW` 不是"银牌"，`BOOST` 不是"金牌"：深度说明**判了什么**，证据状态说明**判得有多硬**。两者必须一起写，例如 `ENTRY=runtime, FLOW=manual(J1–J8), BOOST=not-measured`。

| 深度 ↓ / 证据 → | `not-run` | `recognized` / `static` | `runtime` | `manual` | `measured` | `blocked` / `failed` |
|---|---|---|---|---|---|---|
| **DSH-ENTRY** | 未测；无声明 | 识别到清单/入口/patch；未 boot | 真实 boot；目标行 ACTIVE 或 disabled | —（不能替代 boot） | — | 宿主/夹具 blocked，或可归因于插件的失败 |
| **DSH-FLOW** | 旅程未跑；无声明 | 仅静态准备（清单、README）；不算旅程 | 在记录的宿主上自动旅程通过 | 真人走完旅程并记录步骤/日志 | —（按旅程用 runtime/manual） | 环境 blocked，或旅程失败 |
| **DSH-BOOST** | 未测量；无声明 | 代码里有该模式；不能证明收益 | —（只执行不等于测量） | — | 证据卡在记录的锚点上可复跑 | 基准 blocked，或声称的收益被反证 |

标"—"的格子是类别错误，不是通过。各证据词的含义：

| 状态 | 它能支持什么 | 它永远不意味着什么 |
|---|---|---|
| `not-run` / `not-measured` | "这项没有测" | 通过，或"应该能跑" |
| `recognized` / `static` | 结构识别：清单、入口、patch、client 导出 | 进程已运行，或 UI 已渲染 |
| `runtime` | 在记录的宿主版本/commit 上真实 boot 或真实执行 | UI 正确、生产可用、安全 |
| `manual` | 真人走完旅程并记录了步骤和日志 | 自动化，或覆盖其他平台 |
| `measured` | 带环境、输入、命令、对照、结果的可复跑证据卡 | 生产基准，或计费口径 |
| `blocked` | 宿主或夹具导致判不了 | 插件失败，或通过 |
| `failed` | 可复现、可归因于插件的失败 | 没有证据的"环境问题" |
| `stale` | 已过有效期 | 当前证据；只能当 stale 引用 |

这张表专门拦三种误读：

- **`runtime` 不是 UI 已渲染。** 服务端行 boot 起来、或 client 模块加载成功，都不能证明 slot 渲染正确。`client-module-loaded` ≠ `UI-rendered`；渲染正确要单独观察（slot 输出、console 错误、截图）。
- **`static` 不是 `runtime`。** 解析和识别只说明产物结构上像那么回事，不说明进程真的 boot 了，也不说明依赖在 boot 时解析成功。
- **`not-measured` 不是通过。** 没有证据是第三种状态，要写"未测"，不能写"通过"或"应该能跑"。

## DSH-ENTRY：兼容底线

**回答什么。** 现有插件几乎不改，能不能在目标 DSH 线上被识别、安装并跑起来？

**需要什么证据。** 四个静态门 + 一个运行时门 + 一个流程门：

| 门 | 检查 | 归因 |
|---|---|---|
| G0 | `dsh.bundle.patch` 可解析 | 插件 |
| G1 | base + 样本可组合；插入行 name 可解析 | 插件 |
| G2 | `evaluatePluginCompatibility` 放行，或存在显式的精确版本豁免 | 宿主 |
| G3 | 真实 `boot()` 后每个目标行是 `ACTIVE` 或 `disabled` | 插件/宿主/夹具 |
| G4 | 有 `dsh.client` 时：`exports["./client"]` + 包根行（静态） | 插件 |
| G5 | 报告带宿主版本/commit 与产物 mtime；过期证据标 `stale` | 流程 |

G0–G2 与 G4 在静态检查里通过，支持 `recognized`；`runtime` 需要在记录的宿主上过 G3。`blocked` 与 `failed` 是不同结论，必须带原因分别报告。

**不声称什么。** 不声称安全、UI 正确、生产可用、功能完整、官方背书，也不声称在未测过的 DSH 线上可用。

**怎么自检。** 记录 `dsh --version`、宿主 commit、产物 mtime。先跑 `dsh-plugin-dev check --json` 的 16 项本地静态检查（它是 `dsh-plugin-doctor` 33 项的子集，见 [family-toolchain.md](family-toolchain.md)）；再跑标准仓的 entry 检查器（命令见下）。bundle 还要跑 `dsh --profile <name> --dump-config`，确认没有 `patch: entry <id> not found`，然后真实 boot 并读行状态。声明写成 `DSH-ENTRY: runtime (dsh 0.2.1-rc.2, commit <sha>, 2026-11-01)`。

## DSH-FLOW：采用体验

**回答什么。** 装好之后，用户能不能装得上、配得动、用得顺、出错能恢复、能升级、能卸干净，而不会踩到意外？

**需要什么证据。** 八条用户旅程 J1–J8：安装/移除；启用/停用；配置与校验；首次成功（quickstart 与错误三要素）；权限与披露；升级/回滚/卸载；可观测与诊断；client/server 形态（headless、web、client-off）。每条旅程记录命令、环境、结果、日志路径和时间。人工旅程只要标 `manual` 就是有效证据；没跑的旅程是 `not-run`，不是通过。

**不声称什么。** 不声称认证、排名、安全审计、覆盖所有 UI 布局与平台，也不声称在一台宿主上跑通的旅程能自动推广到另一台。

**怎么自检。** 用临时 `DSH_HOME`：`add` → `--dump-config` 能看到层 → `remove` → 层和依赖都消失。分别用 `{}` 和非法值 boot（非法值必须带字段路径响亮失败）。以新用户身份按 README 走五分钟计时；检查错误三要素（原因、下一条命令、文档锚点）。测一次升级再回滚；client 插件测 headless、web、client-off 三态。起点见 [plugin-dev-guide.md](plugin-dev-guide.md) §7 与 [release-engineering.md](release-engineering.md) 的发布检查单。

## DSH-BOOST：指导性实践

**回答什么。** 插件有没有用 Cordis 原生能力把开发和使用做得可测量地更省，且声称的收益可复跑？

**需要什么证据。** LEV-1–8：effect 可逆且回到基线；必需服务走 `inject` 且不轮询；热配置用 `volatile()` 且不 remount；事件 mode 一致、waterfall 观察者调 `next()`；seam/isolate/group 只在需要时用；工具与提示前缀逐字节稳定，易变数据走 `systemPrompt.context`；长任务走 jobs、并行有界、取消贯穿；bundle/preset 组合差异用 patch 表达，且每条实践一张证据卡。每张卡记录环境、输入规模、命令、**负向对照**、结果、版本锚和限制。

**不声称什么。** 不声称生产基准、计费或缓存命中率、总分、排名，也不声称一个夹具能推广到另一种负载。LEV-6 的前缀稳定性是唯一能直接用 token 计价的实践；其余实践仍然需要证据卡。

**怎么自检。** 一次只挑一条 LEV，先写卡再优化下一条。跑负向对照（例如一个普通配置字段**确实** remount，或一个易变 nonce **确实**打断前缀）。记录 `dsh`、`cordis`、Node 和 commit；没有锚点的数字不是证据。代码路径对照 [plugin-dev-guide.md](plugin-dev-guide.md) §3.3（effect）、§3.6（配置）、§4.3（jobs）、§5（seam）。

## 怎么往上升

**ENTRY → FLOW。** 先拿到真实的 `runtime` 声明：boot bundle，记录宿主版本/commit。再把"前五分钟"做顺：quickstart、在临时 `DSH_HOME` 里可用的 `add`/`remove`、空配置能 boot、非法配置带字段路径响亮失败、每条失败信息都有错误三要素。测一次升级和一次回滚，确认卸载不残留层或依赖。client 插件在声称 UI 之前，先测 headless、web、client-off。相关章节：[plugin-dev-guide.md](plugin-dev-guide.md) §7（打包、安装与踩坑）、[release-engineering.md](release-engineering.md) §7（发布前门禁）、[quick-reference.md](quick-reference.md)。

**FLOW → BOOST。** 把定时器、监听器、连接、watcher、子进程收进带 label 的 `ctx.effect()`，再测量 reload 是否回到基线。必需服务写进 `inject`，可选服务才用 `ctx.get()`，去掉轮询。可调字段改 `volatile()`，测量配置变更 0 remount。工具与提示前缀保持稳定；易变数据放 `systemPrompt.context`。长任务移到 `ctx.jobs`，并行调用加上界，再验证取消。先做 LEV-6 和 LEV-3——草案对两者都已有 measured 示例，且各自都有干净的负向对照。相关章节：[plugin-dev-guide.md](plugin-dev-guide.md) §3.3、§3.6、§4.3、§4.8；[references/official-plugin-dev-skill.md](../references/official-plugin-dev-skill.md)；官方扩展点手册 [references/official-docs/docs/cookbook/extension-cookbook.md](../references/official-docs/docs/cookbook/extension-cookbook.md)。

**不要为了升级而升级。** 已冻结或准备退役的插件不该再买 `BOOST` 卡；先看 [when-to-retire-a-plugin.md](when-to-retire-a-plugin.md)。如果某个能力已经由更强的实现接管，应该退役，而不是抛光。

## 认证 A–D 与三层正交

认证等级 A–D 描述质量与证据深度；ENTRY/FLOW/BOOST 描述采用深度。两者正交：`A` 不是"ENTRY 级"，`D` 不是"BOOST 不合格"。认证过的插件仍可能 `ENTRY=blocked`；`BOOST=measured` 的插件仍可能有供应链问题。两个 scope 分开写，永远不要把认证等级和层数算成一个总分。

## 标准来源与检查器命令

- 标准仓（私有草案）：`PerryLink/dsh-standards` —— 条款 `31`（ENTRY）、`32`（FLOW）、`33`（BOOST）、`34`（GB 类比），以及 `spec/levels.json`。向维护者申请访问。
- 该仓的审计工具：`40-checker/scripts/level-audit.mjs`。它不随本指南分发；如果你的 checkout 没有，先用 `spec/levels.json` 读定义，再用下面已有的检查器。
- 已有的 entry 检查器：`40-checker/bin/dsh-plugin-verify.mjs`。

```sh
git clone <your-access-url-for-PerryLink/dsh-standards>
cd dsh-standards
# entry，仅静态（不声明 runtime）
node 40-checker/bin/dsh-plugin-verify.mjs <plugin-dir> --scope entry --entry-claim static
# 计划中的审计（只有你 checkout 里存在该文件时才运行）
node 40-checker/scripts/level-audit.mjs <plugin-dir>
```

`dsh-plugin-dev check` 是静态辅助工具，不是分级审计；`dsh-plugin-doctor` 把 R/K/D/X 结果映射成 ENTRY 状态，不覆盖 FLOW 或 BOOST。两者都不能单独给出级别。

## 评审者清单

- [ ] 声明同时写了**层**和**证据状态**，不是只写"兼容"。
- [ ] 证据带 DSH 版本、宿主 commit、Cordis 版本、日期和 scope。
- [ ] `runtime` 是观察到的，不是从 `static` 推出来的；静态结果标 `recognized`。
- [ ] 没有把 `not-run`、`not-measured`、`blocked` 改写成通过。
- [ ] UI 声明有渲染观察；没有把 `client-module-loaded` 说成已渲染。
- [ ] FLOW 声明列清跑了哪些旅程、谁跑的、命令、结果和日志路径。
- [ ] BOOST 声明有带负向对照和限制的证据卡；没有从一个夹具推出生产百分比。
- [ ] A–D 认证等级单独写，没有被当成级别使用。
- [ ] 没有"官方""认证""国家标准""符合 GB""排名"这类措辞。
- [ ] 证据在有效期内；过期证据标 `stale`。

---

*标准模型：私有的 `dsh-standards` 项目。本章非官方，不授予任何认证。修正应先提到标准仓，再同步回本库。*
