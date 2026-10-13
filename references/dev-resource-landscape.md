# DSH「插件开发」类资源全景与同类对照（dev-resource-landscape.md）

> **本文是什么**：把围着「**怎么开发 DSH 插件 / 怎么学 DSH**」这件事的同类项目梳理成一张图，
> 说清 `dsh-plugin-guide` 与它们各自占哪个格子、谁真有使用量、谁只是存在。
>
> **测量时间**：2026-10-13。GitHub 数字取 `api.github.com/repos/<owner>/<repo>`，npm 数字取
> `api.npmjs.org/downloads/point/last-week/`（窗口 2026-10-05 → 2026-10-11）。
> 凡未实测的格子一律写 `未测`，不填推测值。
>
> **口径提醒**：`★` 是 GitHub 星数，`npm/wk` 是 npm 周下载。**两者不可互换**——
> 文档型项目靠星数传播，可安装插件靠 npm 传播；本生态里同一个项目常常只有其中一个是真的。

---

## 0. 一句话结论

`dsh-plugin-guide` 占的格子是「**给 agent 读的插件开发知识库 + 机检 CLI**」。
这一格**有 7 个同类**（见 §2），但**没有体量相当的对手**：第二名 `Pasumao/dsh-plugin-dev-kb`
4★、其余全在 0–1★，而它是 **50★ / 2,520 npm 周下载**——同一设计意图，差一个数量级。

**真正的竞争不在这个格子里，而在它外面两格**：

| 格子 | 代表 | 规模 | 对 `dsh-plugin-guide` 的含义 |
|---|---|---|---|
| 入门手册（面向人） | `Electricitysheep/dsh-handbook` | **863★** | 它吃掉了「第一次学 DSH」的人群，`dsh-plugin-guide` 不该去抢 |
| 生态目录（面向人） | `awesome-dsh-plugin` 18,588★、`imsai-sh` 目录 282★ | 千–万级★ | 它们吃掉了「找插件」的流量，而这是发现插件作者的主入口 |
| **插件开发知识库（面向 agent）** | **`dsh-plugin-guide` 50★ / 2,520 npm-wk** | **本格第一** | 护城河是「给 agent 用 + 有 CLI 能验」，不是「文档多」 |

---

## 1. 判同维度（什么样的项目算「和 dsh-plugin-guide 相类似」）

不能只按名字里的 `guide` 找。按**交付形态**分，相似度分四档：

| 档位 | 判据 | 与 `dsh-plugin-guide` 的重合度 |
|---|---|---|
| **A 同类** | 插件开发知识库，**装载成 agent skill**，agent 自己查 | 高——同一个产品定义 |
| **B 同模式** | 打包成 agent skill 的「开发方法论」，但主题不同（写 skill、发布、测试） | 中——同一交付机制，互补 |
| **C 同人群** | 面向插件作者的工具链：脚手架 / 静态检查 / 沙箱冒烟 / 评分 / 迁移 | 中——它查资料，这些做事 |
| **D 邻接** | 面向人的教程 / 手册 / 目录 / 市场 | 低——抢的是同一批「新来的人」，不抢同一功能 |

---

## 2. A 档：同类（插件开发知识库，给 agent 用）

| 项目 | 交付形态 | ★ | 最近推送 | 与 `dsh-plugin-guide` 的差异 |
|---|---|---:|---|---|
| **[PerryLink/dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** | skill + 官方文档全文副本 + 10 章指南 + `dsh-plugin-dev` CLI（new/check/verify） | **50** | 2026-10-12 | **本格基线**。唯一同时有「知识库」和「机检 CLI」的 |
| [Pasumao/dsh-plugin-dev-kb](https://github.com/Pasumao/dsh-plugin-dev-kb) | skill：官方文档离线镜像（站点中英 168 页 + 仓库补充 52 篇）+ 主题导航 + 全文检索 | 4 | 2026-10-09 | **最直接的同类**。差异：只有检索，没有开发指南正文、没有踩坑档案、没有 CLI |
| [Wenaixi/dsh-plugin-dev](https://github.com/Wenaixi/dsh-plugin-dev) | 中文「权威规范 + 开发者 skill」纯文本规范，两条不可谈判规则（源优先、隔离实例验收） | 1 | **2026-10-11** | **在版本上最新**：明确写 DSH `0.2.0-rc.2`。无 CLI、无文档副本 |
| [RayYeung1989/dsh-plugin-development](https://github.com/RayYeung1989/dsh-plugin-development) | 与 agent 无关的通用 `SKILL.md` + `references/` + `templates/{server,client,dual-half}-plugin` | 1 | 2026-08-14 | 停在 `0.1.0-rc.6`，已过两代 |
| [lansi-ai/dsh-plugin-starter](https://github.com/lansi-ai/dsh-plugin-starter) | 可加载 `SKILL.md` + 双半（Host+Client）插件模板 | 1 | 2026-08-25 | 更偏模板而非知识库 |
| [gezi-wen/dsh-plugin-development](https://github.com/gezi-wen/dsh-plugin-development) | skill：怎么开发 / 调试 / 发布（host+client 双半包骨架、丢弃式 profile、发 npm 的坑） | 0 | 2026-09-20 | 同一产品定义，但停在 9 月、无 CLI、无文档副本 |
| [w2112515/dsh-plugin-development](https://github.com/w2112515/dsh-plugin-development) | 可移植的插件开发 / 审计 agent skill（`未测`） | 未测 | 未测 | 同类但更薄 |

**读法**：A 档一共 7 个，全是「把插件开发资料打包给 agent」这一件事的不同完成度。
`dsh-plugin-guide` 的 50★ 在本档是压倒性的（第二名 4★），npm 周下载 **2,520** 已超过
`dsh-plugin-doctor`（2,469），说明它是靠**真实安装**而不是靠 star 在跑的。

> ⚠️ **本档唯一需要盯的动向**：`Wenaixi/dsh-plugin-dev`（2026-10-11 推送）明确对齐
> DSH `0.2.0-rc.2`，而 `dsh-plugin-guide` 的基线是 `0.2.1-alpha.1`（见根 README 兼容表）。
> 版本对齐是这一档的**唯一硬指标**——DSH 是 developer preview，协议会破。
> `RayYeung1989`（0.1.0-rc.6）和 `lansi-ai`（8 月）就是没跟上的例子。

---

## 3. B 档：同模式（打包成 skill 的开发方法论，主题相邻）

这几个和 `dsh-plugin-guide` 是**互补而非竞争**——同一个坑，不同侧面。

| 项目 | skill 讲什么 | ★ | npm/wk | 最近推送 |
|---|---|---:|---:|---|
| [omdsh-dev/dsh-plugin-skills](https://github.com/omdsh-dev/dsh-plugin-skills) | 从脚手架到分层测试的 skill 集 | 13 | 50 | 2026-08-11 |
| [gezi-wen/dsh-skill-authoring](https://github.com/gezi-wen/dsh-skill-authoring) | **怎么写 DSH skill**：frontmatter、description 触发、篇幅拆分、A/B 验证 | 1 | 332 | 2026-09-20 |
| [vlln/plugin-registry](https://github.com/vlln/plugin-registry) | `make-dsh-plugin` 引导 skill + 薄控制台；**repository-plugin 0809→0811 机制时间线的权威记录**。⚠️ **2026-10-03 已 archive**，skill 迁到 [vlln/dsh-skills](https://github.com/vlln/dsh-skills) | 58 | 31 | 2026-10-03（归档） |
| [omdsh-dev/dsh-plugin-check](https://github.com/omdsh-dev/dsh-plugin-check) | 插件健康检查：**33 项**清单协议 / patch 格式 / 构建陷阱 / hub 收录状态，注册 `plugin_check` 工具 | **25** | 52 | 2026-09-10 |
| [wingsky-1/dsh-plugin-hub](https://github.com/wingsky-1/dsh-plugin-hub) · `dsh-verify-isolated` | 隔离环境浏览器验证 skill（临时 DSH_HOME、独立 profile、raw-CDP 驱动） | 未测 | 368 | 未测 |

> `vlln/plugin-registry` 的 58★ 是 B 档最高，值得单独注意：它记录的是**机制演变**
> （`.dsh-plugin` 格式 0809 上线、0811 移除），这类「历史事实源」是 `dsh-plugin-guide`
> `guide/plugin-dev-guide.md` 已经引用并依赖的东西。**它现在归档了——即本档唯一的知识资产
> 停更，`make-dsh-plugin` 的维护责任转移到了 `vlln/dsh-skills`。**
> `dsh-plugin-guide` 里凡是引用 `plugin-registry` 的地方，都应改指 `vlln/dsh-skills`
> 或标注「已归档，冻结在 0.1.5 基线」。

---

## 4. C 档：同人群（插件作者工具链）

面向的是同一个用户（插件作者），做的是 `dsh-plugin-guide` 里 `dsh-plugin-dev` CLI 之外的事。
**PerryLink 自家在这个档位有 7 个仓库**——这是 `dsh-plugin-guide` 真正的护城河所在。

### 4.1 PerryLink 家族工具链（同作者，天然互操作）

| 项目 | 干什么 | ★ | npm/wk |
|---|---|---:|---:|
| [PerryLink/dsh-plugin-doctor](https://github.com/PerryLink/dsh-plugin-doctor) | 零依赖静态 + 沙箱冒烟检测器：结构 R / Cordis 契约 K / 无密钥 headless D / 目录收录 CC | 4 | **2,469** |
| [PerryLink/dsh-test-drive](https://github.com/PerryLink/dsh-test-drive) | 一次性 profile 里做安装 + 冒烟，产出 pass/fail 矩阵 | 12 | 872 |
| [PerryLink/dsh-score](https://github.com/PerryLink/dsh-score) | 五维质量评分 + 排行榜（消费 test-drive 的结果） | 12 | 1,125 |
| [PerryLink/dsh-plugin-kit](https://github.com/PerryLink/dsh-plugin-kit) | 共享零依赖工具箱：Provider seam、审批闸、新插件骨架 | 1 | 907 |
| [PerryLink/dsh-plugin-upgrade](https://github.com/PerryLink/dsh-plugin-upgrade) | 插件作者升级 skill：按 peer band 路由到对应走廊（legAB / legC） | 2 | 914 |
| [PerryLink/dsh-plugin-certification](https://github.com/PerryLink/dsh-plugin-certification) | 社区认证规范 + 五维机检评分 + 注册表（数据仓库，不可安装） | 0 | 未发布 |
| [PerryLink/dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp) | 只读 MCP server，把认证注册表暴露给任意 agent（`dsh-cert-mcp` 1,160 npm/wk） | 0 | 1,160 |

### 4.2 第三方同档工具

| 项目 | 干什么 | ★ | npm/wk |
|---|---|---:|---:|
| [BiBoyang/dsh-eval-harness](https://github.com/BiBoyang/dsh-eval-harness) | YAML 用例驱动真实 agent 回归评测 + baseline PASS/WARN/FAIL 门禁 + F0–F5 混沌包。⚠️ README 声明 **npm 渠道已弃用，改为 GitHub-only**（npm 上最新 0.3.1 / 2026-08-24） | 14 | 24（已弃用渠道） |
| [MicroMilo/upstream-radar](https://github.com/MicroMilo/upstream-radar) | 常驻**兼容性**测试与依赖监控：盯精确版本、在一次性 CI 里装并跑、产出 `compatible/incompatible/unknown/blocked` 报告（npm 关键词含 supply-chain，但主职是兼容性不是安全扫描） | 11 | 411 |
| [goatliamia/dsh-plugin-maker](https://github.com/goatliamia/dsh-plugin-maker) | 骨架生成 + 契约检查 + 插件体检 + 影响面分析 + 上游兼容追踪 | 2 | 未发布 |
| [CMSKL/dsh-plugin-observatory](https://github.com/CMSKL/dsh-plugin-observatory) | 本地清单 / bundle patch 的有界静态兼容审计（`plugin_audit`）+ 进程内 Loader 生命周期观察（`plugin_observe`）。仅覆盖到 DSH 0.1.0-rc.6，**可能已停更** | 1 | 133 |
| [Jesse-njx/dsh-plugin-manager](https://github.com/Jesse-njx/dsh-plugin-manager) | `dsh pm`：多源搜索（awesome + GitHub + npm）、按 profile 装卸更新、只读 `dsh pm doctor` 审计。⚠️ `@dsh-pm/cli` **从未发布到 npm**，仓库自 2026-08-28 无推送 | 0 | 186（非本包） |
| [f-infinite-z/dsh-plugin-ops](https://github.com/f-infinite-z/dsh-plugin-ops) | 启动前健康闸 + 故障归因 + 白名单可逆修复 + 插件行管理面板 | 0 | 未测 |

**读法**：C 档的 `npm/wk` 明显比 ★ 更"真"。
`dsh-plugin-doctor` 4★却有 2,469 周下载，`dsh-cert-mcp` 0★却有 1,160——
**这一档是靠命令被跑起来的，不是靠 star 被看见的。**

---

## 5. D 档：邻接（面向人的教程 / 手册 / 目录）

这一档**不与 `dsh-plugin-guide` 争功能，但与它争"新来的人"**。

### 5.1 手册 / 教程（人读）

| 项目 | 定位 | ★ | npm/wk | 最近推送 |
|---|---|---:|---:|---|
| [Electricitysheep/dsh-handbook](https://github.com/Electricitysheep/dsh-handbook) | 从 0 到 1 深度手册：安装/插件开发/性能调优/实测案例 + 中英 PDF —— **本档体量第一** | **863** | 263 | 2026-10-04 |
| [sandbaseai/deepseek-harness-handbook](https://github.com/sandbaseai/deepseek-harness-handbook) | Agent-first 多语手册：173 篇有源码出处的运行时/插件/MCP/沙箱指南 | **235** | 未发布 | 2026-08-31 |
| [bugmaker2/dsh-plugin-template](https://github.com/bugmaker2/dsh-plugin-template) | 最小 Hello World 插件模板 | **110** | 未测 | 2026-08-27 |
| [pingfanfan/hello-dsh](https://github.com/pingfanfan/hello-dsh) | 零基础插件开发教程（22 个中文技能实例） | **98** | 未发布 | 2026-09-14 |
| [whyihaveyou/dsh-suite](https://github.com/whyihaveyou/dsh-suite) | 活插件目录（每小时刷新、每日兼容测试）+ `npm create dsh-plugin` 脚手架 | 59 | 71（create-dsh-plugin） | 2026-10-13 |
| [omdsh-dev/plugin-template](https://github.com/omdsh-dev/plugin-template) | 基于 turtle-ui 官方仓库的插件模板 | 13 | 未测 | 2026-09-16 |
| [BiBoyang/dsh-eval-harness](https://github.com/BiBoyang/dsh-eval-harness) | 见 C 档 | 14 | 24 | 2026-10-04 |
| [flaqai/deepeseek-harness-guide](https://github.com/flaqai/deepeseek-harness-guide) | 15 语言开发与插件构建指南（53 md + 4 SKILL） | 14 | 未测 | 2026-08-14 |
| [Hubert-hwk/dsh-for-humans](https://github.com/Hubert-hwk/dsh-for-humans) | 费曼学习法通俗教程（12 章 + 图解 + 测验） | 7 | 未测 | 2026-08-14 |
| [kitimzhe/dsh-plugin-authoring-guide](https://github.com/kittimzhe/dsh-plugin-authoring-guide) | 手把手：从 0 到 1 造一个插件（双语 + 两个已发布插件复盘） | 0 | 未发布 | 2026-09-07 |
| [LaplaceYoung/dsh-book-deepseek-harness](https://github.com/LaplaceYoung/dsh-book-deepseek-harness) | 《深入理解 DeepSeek Harness》源码级拆解书（37 章 + PDF） | 20 | 未测 | 2026-08-14 |
| [AgriciDaniel/deepseek-harness-brain](https://github.com/AgriciDaniel/deepseek-harness-brain) | 证据闸门式「第二大脑」可视化指南 | 11 | 未测 | 2026-08-21 |

同档还有大量 1–3★ 的项目（`anweat/dsh-plugin-dev-guide` 3★、
`whyihaveyou/dsh-plugin-tutorial` 2★、`DumplingHuman/dsh-plugin-tutorial` 2★、
`Opr4Mp3r/deepseek-harness-plugin-from-scratch` 1★、
`dnegxuantian/deepseek-harness-book` 2★、`flysheep-ai/learn_deepseek_harness` 6★、
`SIMON-WORLD/dsh-toolkit` 0★、`863683348/dsh-starter-zh` 0★），
完整清单见本目录 [`community-ecosystem.md`](community-ecosystem.md) §4.2。

### 5.2 目录 / 市场（找插件）

| 项目 | 定位 | ★ | 备注 |
|---|---|---:|---|
| [awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) | **生态正典清单** + 网站（每插件页含 star 与安装命令），CC0-1.0 | **18,588** | 2026-10-13 推送。**这是 D 档真正的流量入口** |
| [0xsline/awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness) | 第二份精选清单（插件 / 工具 / 基建） | **1,174** | 2026-10-10 推送 |
| [imsai-sh/awesome-deepseek-harness-plugins](https://github.com/imsai-sh/awesome-deepseek-harness-plugins) | 1024Store：11,000+ 插件的目录 + 市场 + 查询 API | **282** | 本地归档在 `awesome-deepseek-harness-plugins/`（648 条 JSON 目录） |
| [awesome-deepseekharness/awesome-deepseek-harness](https://github.com/awesome-deepseekharness/awesome-deepseek-harness) | 精选 awesome 清单 | 21 | 本地归档 `awesome-deepseek-harness-awe/` |
| `awesome-dsh-plugins-kejixiaoliang` | 306+ 插件、14 个手编分类、双语 | — | 本地归档，见 `docs/taxonomy.md` |
| [ylwl1997/dshbase](https://github.com/ylwl1997/dshbase) → dshbase.com | 社区指南 + 插件目录，标注「干净 profile 装得上且能启动」的实测结果 | 1 | 站长 youliqn，声明与 DeepSeek 无关；"122 个插件实测"是自述 |
| `dshplugin.online` / `dsh.market` / `www.dsh-marketplace.com` | 纯网站目录 | — | 无对应主仓库，收录标准自述 |

---

## 6. 位置图：`dsh-plugin-guide` 站在哪

```
                        面向人  ←──────────────────────→  面向 agent
                          │                                  │
  「学 DSH」             │  dsh-handbook          863★      │
                          │  deepseek-harness-handbook 235★  │
                          │  dsh-for-humans          7★      │
                          │                                  │
  「写插件」             │  hello-dsh              98★      │ ★ dsh-plugin-guide  50★
                          │  anweat/dev-guide        3★      │     2,520 npm/wk
                          │  authoring-guide         0★      │   ├ dsh-plugin-dev-kb  4★
                          │                                  │   └ 其余 5 个        0–1★
                          │                                  │
  「验插件」             │                                  │ dsh-plugin-doctor 2,469 npm/wk
                          │                                  │ dsh-score 1,125 · dsh-test-drive 872
                          │                                  │ dsh-eval-harness         24 npm/wk
                          │                                  │
  「找插件」             │  awesome-dsh-plugin  18,588★     │ dsh-find-plugin   4,168 npm/wk
                          │  0xsline/awesome     1,174★      │   （183★，同组织下）
                          │  dsh-suite 59★ · imsai-sh 282★   │
                          │  dshbase / dshplugin.online      │
```

**四个可读出的结论**：

1. **右上格（面向 agent 的写插件知识库）只有它一个站住了。** 50★ 在绝对量上很小，
   但在这一格里是第二名的 12 倍，且是唯一带 CLI 的。
2. **周下载比 star 诚实。** `dsh-plugin-guide` 2,520 npm/wk 是 `dsh-handbook`（263）的近 10 倍，
   尽管后者 star 是它的 17 倍——**手册被人 star，知识库被人安装。**
   这两个数字测的是两件不同的事，不该放在同一张榜上比。
3. **`dsh-find-plugin`（4,168 npm/wk，183★）比 `dsh-plugin-guide` 更高**，且这一生态里
   「找插件」的流量一直大于「写插件」的流量。**插件作者是 `dsh-plugin-guide` 的用户，
   而找到这些作者要靠目录**——这是它目前最明显的分发缺口。
4. **D 档的量级和 A 档差三个数量级**（18,588★ vs 50★）。这不是质量问题，
   是**受众数量**问题：读手册的人比写插件的人多两个数量级。
   拿 A 档的 star 去比 D 档没有意义——**要比的是同一格里的相对位置。**

---

## 7. 与 `dsh-plugin-guide` 的差异点（护城河清单）

把上面 A/B/C 三档逐项对照，`dsh-plugin-guide` **独有**的能力：

| 能力 | 同类有吗 | 说明 |
|---|---|---|
| 官方文档**逐字节副本** + 完整性校验 | `dsh-plugin-dev-kb` 有镜像，但无校验脚本 | 见 `references/official-docs/`、`scripts/` |
| 10 章**开发指南正文**（心智模型 → 契约 → 打包 → 发布） | 无。同类只做检索，不做成文 | `guide/plugin-dev-guide.md` |
| **踩坑档案**（30+ 条，含根因与修复） | `omdsh-dev/dsh-plugin-dev` 有 20 条，但已停更 | `guide/unfixed-issues.md` |
| **迁移指南**（0.1.6 → 0.2.1 全部破坏性变更 + 12 项清单） | `dsh-plugin-upgrade` 覆盖升级走廊，但不含文档层对照 | `guide/migration-0.2.md` |
| **机检 CLI**（`dsh-plugin-dev new/check/verify`） | `dsh-plugin-doctor` 更强，但它是**独立工具**不是知识库的一部分 | `bin/dsh-plugin-dev.js` |
| **按需加载**（skill + 目录 resourceBase，渐进披露） | 同类多数是把全文塞进 skill | `SKILL.md` |
| 多语言 README（en/zh/es/pt/hi）+ `llms.txt` | `flaqai` 有 15 语言，但只是 README 层 | 对 agent 消费友好 |

**反过来，它明显缺的两块**：

- **没有面向人的入口页**。`dsh-handbook` 863★ 靠的是"给新手的 PDF + 在线站"。
  `dsh-plugin-guide` 有站点（`perrylink.github.io/dsh-plugin-guide`）但定位是"章节页"，
  不是"第一次来该看什么"。
- **没有进入主流目录的显眼位置**。在本地 648 条档案目录里它被归到 `skill` 类
  （`catalog/plugins/perrylink--dsh-plugin-guide.json`，2026-09-13 收录），
  而 D 档的目录项目 star 是它的 5 倍以上。

---

## 8. 复现方式

```powershell
# GitHub 星数与最近推送
Invoke-RestMethod -Headers @{'User-Agent'='x'} https://api.github.com/repos/PerryLink/dsh-plugin-guide |
  Select-Object stargazers_count, pushed_at, archived

# npm 周下载（窗口由 end 决定）
Invoke-RestMethod https://api.npmjs.org/downloads/point/last-week/dsh-plugin-guide
```

**本次测量的原始数据**：
- GitHub 元数据：`D:\Projects\_archive\_devkb-gh-metadata.csv`（46 仓）
  与 `_devkb-gh-metadata-2.csv`（20 仓）
- npm 下载：本文表格内联，窗口 2026-10-05 → 2026-10-11
- 生态对话档案：`downloads/github/harness/discussions/list.json`（官方 Discussions 归档）

## 9. 官方面（比对基准，不是同类）

同类对照必须先把**官方自己**那一格说清——它是所有人的上游，也定义了「什么算插件开发资料」。

| 官方资产 | 内容 | 出处 |
|---|---|---|
| 开发文档树 `docs/user/develop/` | 只有 `basic/`、`framework/`、`practice/` 三支；**没有 `develop/index.md`**（该 URL 404） | GitHub contents API |
| `docs/user/develop/basic/` | `index`《Your first plugin》、`tool`《Build a tool》、`config`《Plugin configuration》、`publish`《打包与安装》 | 逐一核验 |
| `docs/user/develop/framework/service.md` | 服务与依赖 | — |
| `docs/cordis-tutorial/` | 7 章：first-plugin / lifecycle-and-effects / services / events / config / composition-and-hmr / into-the-harness；另引 `docs/cordis-primer.md` | 索引页已取 |
| 内置 skill `cordis-plugin-development` | 位于 `packages/preset/agent-preset/skills/cordis-plugin-development/SKILL.md`，附 `references/{host-plugin,ui-plugin,mcp-bundle,verification,practices,user-actions}.md` 与 `templates/{decoration,mcp}/`；同级 skill 还有 `cordis-composition-reference`、`editing-cordis-compositions` | 已取全文 |
| 官方 npm 版本锚点 | `@deepseek-ai/dsh` latest = **0.2.0-rc.2**（2026-09-29 发布） | npm registry |

> **这就是 `dsh-plugin-guide` 的存在理由**：官方只有 4 篇 basic + 7 章 Cordis 教程，
> 没有迁移指南、没有踩坑档案、没有可执行的检查器，且**文档站上不出现的仓库内页面
> （如 `publish.zh.md`、persistence 历史格式）只能靠镜像拿到**。
> 对照见 `references/official-plugin-dev-skill.md` 与 `references/official-docs/`。

---

## 10. 未测 / 存疑项（不要当成已知）

**A. 本轮**（GitHub API 限流 403，未取到星数）：
`yanhua1010/dsh-harness-tutorial`、`dshworks/howto-dsh`、`omdsh-dev/dsh-plugin-dev`、
`Nagi-ovo/dsh-find-plugins`、`curtiseng/cordis-course`、`qomob/DSHwiki`、
`JingHao-Leon/deepseek-harness-guide`、`bobleer/deepseek-harness-plugin-mcp` 等 12 仓。
**本文标 `未测` 的都属此类。**

**B. 单源数据**：星数主要来自 `ungh.cc`（2026-10-13），仅 `dsh-plugin-doctor` 用 GitHub API 复核；
`deepseek-harness` 的 248,670★ 未做第二源交叉验证，当近似值看。

**C. 自述未复核**：
- `dshbase.com` 的「122 个插件实测」是自述，未见目录条目逐条复核。
- `SIMON-WORLD/dsh-toolkit`（0★）自述「基于 173 条痛点调研」的中文知识库，
  仓库无描述、未见更新，未深读。
- `wingsky-1/dsh-plugin-hub`、`f-infinite-z/dsh-plugin-ops` 只有片段信息，未整仓核对。

**D. 上游仓库自身的 README 不可信处**（引用前必查）：
- `dsh-plugin-doctor` README 戳的是 `0.4.6`（2026-10-04），npm latest 已是 **0.7.0**（2026-10-10），
  其 `npx` 示例还写着 `@0.5.0`。**该仓库的版本号一律以 npm 为准。**
- `dsh-handbook` README 写「280+ Stars」，实测 **863**——README 陈旧，计数为准。
- PerryLink 家族花名册自相矛盾：doctor README 说 42 / 34 活跃，
  certification README 说 94 / 86 活跃 / 1 已认证。**两处都是取到的原文，它们互相冲突。**
- `omdsh-dev/dsh-plugin-check` 的 npm 发布**未证实**，README 只给 `github:` 装法。
- `ret-c1` 与 `retc1`：GitHub 元数据规范化为 `retc1/harness-plugin-tutorial`，`ret-c1` 靠重定向解析。

**E. 已确认失效的引用**：`vlln/plugin-registry` 于 **2026-10-03 归档**。
本项目 `guide/plugin-dev-guide.md`、`references/community-ecosystem.md` 中引用它的地方
需改指 `vlln/dsh-skills`，否则会指向一个冻结在 0.1.5 基线的归档仓库。
