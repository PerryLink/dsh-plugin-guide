<div align="center">

# 🐳 dsh-plugin-guide

**构建 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 插件所需的一切。**

*官方文档档案 · Cordis 入门 · 社区深读 · 实战踩坑 · agent 技能 · CLI 工具链*

> **官方仓库。** 本仓库是 dsh-plugin-guide 的唯一官方仓库，由 PerryLink 维护。其他账号下的同名仓库与本项目无关。


```sh
dsh plugin --profile web add dsh-plugin-guide
```
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Gitee](https://img.shields.io/badge/Gitee-mirror-c71d23?logo=gitee)](https://gitee.com/perrylink/dsh-plugin-guide)
[![DSH plugin](https://img.shields.io/badge/dsh--plugin-✅-green)](https://github.com/topics/dsh-plugin)
[![dsh-doctor](https://raw.githubusercontent.com/PerryLink/dsh-plugin-doctor/main/badges/PerryLink__dsh-plugin-guide.svg)](https://github.com/PerryLink/dsh-plugin-doctor#verified-徽章)
[![DSH Market](https://raw.githubusercontent.com/2BingLing/dsh-market/master/assets/readme/badge-top-rated.svg)](https://dsh.market/)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-plugin-guide/verify.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-plugin-guide/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-plugin-guide?label=version)](https://github.com/PerryLink/dsh-plugin-guide/releases)
[![npm version](https://img.shields.io/npm/v/dsh-plugin-guide)](https://www.npmjs.com/package/dsh-plugin-guide)
[![npm downloads](https://img.shields.io/npm/dm/dsh-plugin-guide)](https://www.npmjs.com/package/dsh-plugin-guide)
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-plugin-guide?metric=downloads&lang=zh)](https://dshfind.com/zh/plugins/PerryLink/dsh-plugin-guide?ref=badge)

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

```sh
dsh plugin --profile <name> add dsh-plugin-guide
```


</div>

---

**📖 想在网页上读？** [perrylink.github.io/dsh-plugin-guide](https://perrylink.github.io/dsh-plugin-guide/) —— 每章独立成页，另有给助手用的机器可读 [llms.txt](https://perrylink.github.io/dsh-plugin-guide/llms.txt)。

## Install & uninstall

- **git channel**（最新 `main`）：`dsh plugin --profile web add github:PerryLink/dsh-plugin-guide#<sha>` —— 固定提交以可复现；入口是纯 ESM JS，无构建步骤。
- **npm channel**（发布版本）：`dsh plugin --profile web add dsh-plugin-guide`。
- **tarball channel**：在本仓库执行 `pnpm pack`，然后 `dsh plugin --profile web add ./dsh-plugin-guide-<version>.tgz`。
- **uninstall**：`dsh plugin --profile web remove dsh-plugin-guide`。

## Why not just read the official docs?

因为官方文档是写给"已经知道该翻哪一页"的人的，而 DSH **每 1.7–2.8 天发一个 prerelease**，且带破坏性变更。本插件补的正是最耗时间的三处缺口：

| 缺口 | 本插件补什么 |
|---|---|
| **"我到底在对着哪一版开发？"** | [版本矩阵](guide/version-matrix.md)：四个都自称"最新"的值、子包 `latest` 冻结陷阱、破坏性变更断层，以及 `peerDependencies` 区间怎么选。**不存在稳定版**——所有已发布版本都是 prerelease。 |
| **"这一版破坏了什么？"** | [迁移指南](guide/migration-0.2.md)：把 `0.1.6-alpha.2` → `0.2.1-alpha.2` 整理成**可引用的 seam**，每条含症状*与*修法并附官方出处——其中包括一处数据丢失风险和一处"模型请求还没发出就失败"的变更。 |
| **"我的插件真的对吗？"** | [零依赖 CLI](SKILL.md)（`dsh-plugin-dev new / check / verify`）+ [官方文档逐字离线镜像](references/official-docs/)，让 agent 能引确切页面而不是靠猜。 |

**60 秒自证：**

```sh
dsh plugin --profile web add dsh-plugin-guide
```

<!-- star-cta -->
## ⭐ 如果它帮到了你

这个插件是 [DSH 插件家族](https://github.com/PerryLink)的一员（40+ 个，全部 Apache-2.0）。如果你在用，**给个 star** —— 它不会解锁任何功能，但会让下一个人在搜索里更容易找到它。

*English:* part of a 40+ plugin family for DeepSeek Harness. If it is useful, **a star helps the next person find it** — nothing is gated behind it.

## What is dsh-plugin-guide?

构建 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 插件所需的一切。

官方文档档案 · Cordis 入门 · 社区深读 · 实战踩坑 · agent 技能 · CLI 工具链

![dsh-plugin-guide 终端演示：dsh-plugin-guide — install the bundle, then run the checker](https://raw.githubusercontent.com/PerryLink/dsh-plugin-guide/main/docs/assets/dsh-plugin-guide-hero.png)

![Animated terminal demo of dsh-plugin-guide](https://raw.githubusercontent.com/PerryLink/dsh-plugin-guide/main/docs/assets/dsh-plugin-guide-demo.gif)

*同一次运行，动图版。*

## Comparison

![dsh-plugin-guide 的实测对比柱状图](https://raw.githubusercontent.com/PerryLink/dsh-plugin-guide/main/docs/assets/dsh-plugin-guide-evidence.png)

content counts as stated in the README (What you get)

## Compatibility

| Surface | Status |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.2.1-alpha.2`（`d743267388641bc76f17c45ce8b4c231aed1d32c`，master 最新 tag **且** = master HEAD，2026-10-09）；npm `latest`=`next`=`0.2.0-rc.2`、`alpha`=`0.2.1-alpha.2`。**不存在稳定版**——全部 31 个 npm 版本与 26 个 GitHub Release 都是 prerelease。官方文档副本与 [guide/migration-0.2.md](guide/migration-0.2.md) 钉在上一版 `dsh-v0.2.1-alpha.1`（`5badb15009`，2026-10-03）；此后新增的 20 份破坏性变更指南收录于 [guide/version-matrix.md](guide/version-matrix.md) §3。 |
| Node | `^22.19.0 || >=24.0.0`（DeepSeek Harness 运行时） |
| Platforms | 全部（纯 ESM bundle；无原生代码、无网络） |
| Model | 任意（无模型交互） |

## What you get

`dsh-plugin-guide` 是 DSH 插件开发知识库加 CLI 工具链，打包为一个可安装 bundle。知识库注册为 `dsh-plugin-guide` agent 技能（在每个会话目录可见，按需加载工作流步骤、官方文档与社区深读）；`dsh-plugin-dev` CLI 在其之上提供三个机械层。

- **插件契约与红线** —— effect/disposer、waterfall `next()`、模型可见 ⟺ 已记录、Schemastery 配置。
- **版本适配** —— [guide/version-matrix.md](guide/version-matrix.md)：五个"最新"的区别、子包 `latest` 冻结陷阱、四个破坏性变更断层、peer 区间怎么选、会话格式 V0→V4 谱系，以及 `0.2.1-alpha.2` 落的 19 条破坏性变更。
- **官方文档档案** —— 官方仓库文档（英 + 中）逐字副本，在最近核验快照处与上游逐字节一致。
- **Cordis 入门** —— 五个概念与机制时间线（repository-plugin 0809 引入、0811 移除；两条安装通道）。
- **20+ 个实战踩坑** —— 附根因 + 修法（cordis 双副本、tsconfig 三件套、多帧 zstd 会话、Windows junction、过期 npm `latest`…）。
- **社区深读** —— 归档 114 个社区仓库（15 个深读），外加每条事实都链回出处的完整来源索引。
- **CLI 工具链** —— `dsh-plugin-dev new / check / verify`：脚手架、静态检查、打包验证 DSH 插件；每个检查项都链回它强制执行的技能章节。

- **家族工具链路由** —— [guide/family-toolchain.md](guide/family-toolchain.md)：哪个工具负责哪个问题、`dsh-plugin-doctor` 33 项检查全表，以及与本库 16 项检查的交叉对照。
- **镜像范围决策** —— [references/mirror-scope-decision.md](references/mirror-scope-decision.md)：为什么"删掉零引用内容以省 80% 体积"经复测**不成立**（它们被本库自己声明的宽 glob 覆盖）。
- **官方自带技能要点** —— [references/official-plugin-dev-skill.md](references/official-plugin-dev-skill.md)：官方 `cordis-plugin-development` 技能的禁则、展示元数据清单与 UI/性能规则。
## Knowledge base

| Path | 是什么 |
|---|---|
| `SKILL.md` | `dsh-plugin-guide` agent 技能：红线 + 按任务类型的开发路径 |
| `package.json` · `cordis.patch.yml` · `index.js` | 可安装 DSH bundle：`dsh.bundle.patch` 清单 + 注册技能的入口 |
| `guide/plugin-dev-guide.md` | 完整开发指南（10 章） |
| `guide/version-matrix.md` | **版本适配矩阵**：五个"最新"的区别、子包 `latest` 冻结、破坏性变更断层、peer 区间选择、会话格式谱系、`0.2.1-alpha.2` 的 19 条变更 |
| `guide/quick-reference.md` | 一页速查表（5 语言） |
| `guide/links.md` | 精选 URL 索引：官方开发文档（站点 ↔ 本地副本）+ 社区文档链接 |
| `guide/when-to-retire-a-plugin.md` | 插件退役与冻结：一次组合审计的判据与实测数据（中英双语） |
| `guide/choosing-a-plugin.md` | 插件选型：每个能力面该用哪个，含实测数字与核验警示（中英双语） |
| `references/official-docs/` | 官方仓库文档逐字副本（英 + 中） |
| `references/*.md` | 调研报告：仓库文档、网站、Cordis、论文、社区生态、114 仓库归档（15 个深读） |
| `scripts/` | 幂等下载脚本 + 完整性检查器 + 话题快照生成器 |
| `bin/` · `src/cli/` · `dist/` | `dsh-plugin-dev` CLI：脚手架、检查器、验证器（TypeScript，tsdown 打包） |
| `templates/` | TS + JS 脚手架骨架：契约模板、Config、tests、cordis.patch.yml、五语 README |
| `downloads/` | 原始快照 —— 由 `scripts/` 生成、不入库 |
| `guide/family-toolchain.md` | **家族工具链路由**：问题→所有者→可引用产物；`dsh-plugin-doctor` 33 项检查全表与裁定语义；本库 16 项检查的交叉对照 |
| `guide/migration-0.2.md` | 0.2 世代破坏性变更迁移指南（§0–§12 覆盖到 `0.2.1-alpha.1`，**§13 覆盖 `0.2.1-alpha.2` 的 19 个 seam**） |
| `references/mirror-scope-decision.md` | 镜像范围决策记录：为什么不按"零引用"裁剪（附可复跑的测量脚本） |

## CLI toolchain

bundle 附带零运行时依赖的 `dsh-plugin-dev` CLI（`bin/` → tsdown 打包的 `dist/dsh-plugin-dev.js`）。每个检查项都引用它强制执行的技能章节，agent 可继续人工审计。

```sh
dsh-plugin-dev new <name> [--lang ts|js] [--dir <path>] [--force] [--git]
dsh-plugin-dev check [--cwd <dir>] [--json] [--strict]
dsh-plugin-dev verify [--cwd <dir>] [--dsh <bin>] [--pnpm <bin>]
dsh-plugin-dev seams <query> | --since <version>   # 这个 API 在我目标宿主里存在吗？
```

| 子命令 | 作用 |
|---|---|
| `new <name>` | 脚手架生成 TS 或 JS 插件仓库：`src/index.ts` 契约模板、Schemastery Config、tests、tsdown/vitest、注释齐全的 `cordis.patch.yml`、五语 README。幂等；无 `--force` 时拒绝覆盖非空目录。 |
| `check` | 静态检查：`cordis.patch.yml` 合法性、`package.json` 元数据（`dsh.bundle.patch` 指向、peer 依赖、engines、files 白名单）、五语 README 一致性、工程红线模式。输出 CI 可消费的 JSON。 |
| `verify` | `pnpm pack` 后装入干净 mkdtemp `DSH_HOME` profile 做安装/启动/卸载冒烟（对齐 `verify:self-contained`）。失败给出日志尾部与建议。 |

### CLI configuration

CLI 无硬编码可调参数——每个都是 flag 或环境变量。

| 可调项 | Flag | 环境变量 | 默认 |
|---|---|---|---|
| 模板目录 | — | `DSH_PLUGIN_DEV_TEMPLATES` | `<package>/templates` |
| dsh 二进制 | `--dsh` | `DSH_PLUGIN_DEV_DSH` | `dsh` |
| pnpm 二进制 | `--pnpm` | `DSH_PLUGIN_DEV_PNPM` | `pnpm` |
| 安装/打包超时 | `--timeout` | `DSH_PLUGIN_DEV_TIMEOUT` | `300000` ms |
| headless 冒烟超时 | `--smoke-timeout` | `DSH_PLUGIN_DEV_SMOKE_TIMEOUT` | `120000` ms |

### Upstream roadmap

`dsh-plugin-dev` 是官方插件开发 CLI（规划项 C12）的上游候选：脚手架/检查器/验证器是机械层，`SKILL.md` + `guide/` 仍是认知层。

## Quick start

```sh
# 1. install the bundle into your profile
dsh plugin --profile web add github:PerryLink/dsh-plugin-guide

# or from npm (published releases)
dsh plugin --profile web add dsh-plugin-guide

# 2. restart and verify the row
dsh --profile web --dump-config | grep -A3 'id: dsh-plugin-guide'
```

然后直接问你的 agent：*"用 dsh-plugin-guide 技能帮我构建一个 … 插件。"*

或者直接驱动 CLI：

```sh
npx dsh-plugin-guide new hello-plugin            # 脚手架生成 TS 插件仓库
npx dsh-plugin-guide check --json                # 静态检查
npx dsh-plugin-guide verify                      # 打包 + 干净 profile 冒烟
```

## Copy as a plain agent skill

你也可以把整个文件夹复制到 agent 的技能目录（相对路径保持完好）：

```powershell
# Windows (PowerShell)
pwsh -File scripts/install-skill.ps1 `
  -Target "$env:USERPROFILE\.deepseek\skills\dsh-plugin-guide"   # 或 <project>\.agents\skills\dsh-plugin-guide
```

```bash
# macOS / Linux
pwsh -File scripts/install-skill.ps1 -Target ~/.deepseek/skills/dsh-plugin-guide   # 或 <project>/.agents/skills/dsh-plugin-guide
```

安装器跳过 `downloads/`（生成的）与 `.github/`，然后逐字节校验每个复制的文件。手动 `Copy-Item -Recurse` 整个文件夹也可以。

## Configuration

技能 bundle 不暴露任何 Schemastery `Config` —— 它把知识库注册为 agent 技能，无可调键。`dsh-plugin-dev` CLI 从 flag 与 `DSH_PLUGIN_DEV_*` 环境变量读取可调项（见 [CLI toolchain](#cli-toolchain)）。

## Tools & surfaces

| Surface | Kind | Notes |
|---|---|---|
| `dsh-plugin-guide` | skill | 经 `ctx.skills` 注册；按需加载 `SKILL.md` + `./guide/` + `./references/` |
| `dsh-plugin-dev` | bin (CLI) | `new` / `check` / `verify` 子命令；非 DSH 插件行 |

## Permissions & data

- **Permissions**：workshop 清单声明 `filesystem:read`。
- **Data**：只读 —— 仅读取自身打包的 `guide/` 与 `references/` 文件。无网络请求、无写入、无模型调用。

## Security boundaries

- **只读知识库。** bundle 只读取自身文件；绝不写入、绝不联网、绝不调用模型。
- **官方文档是逐字副本。** `references/official-docs/` 从不在本仓库修改；问题反馈给上游，且只经 `scripts/sync-official-docs.ps1` 重新同步。
- **分发边界。** 打包的第三方内容保留其上游许可；见 [NOTICE.md](NOTICE.md)（如 `downloads/` 仅本地、`awesome-dsh-plugins` 不得再分发）。

## Known limitations

- **官方文档是快照。** 上游变化时用 `scripts/sync-official-docs.ps1` 重新同步；新鲜度戳与提交号引用 `references/official-docs/SNAPSHOT.md`。
- **`downloads/` 由脚本生成、不入库。** 原始快照（社区仓库归档、Discussions、文章）使用前需用脚本生成。
- **`awesome-dsh-plugins` 内容仅本地。** 其上游声明内部使用约束，故不随仓库再分发。

## Release channels

所有渠道都从本仓库或 npm 解析，因此**推一个 tag 就能到所有渠道**；只有 Gitee 镜像是定时拷贝：

| 渠道 | 真源 | 更新方式 |
|---|---|---|
| npm（`dsh-plugin-guide`） | 本仓库的 `package.json` | `v*` tag 触发 `.github/workflows/release.yml`：`verify-kit` 门禁 → 校验 CHANGELOG 有该版本段 → `npm publish --provenance`（版本已存在则跳过） |
| GitHub Release | 同一个 tag | 同一 workflow 幂等创建 |
| 展示徽章（npm 版本、GitHub tag、DSH Market、dsh-doctor） | 实时查询 | 无需发布——每次渲染都读 npm/registry |
| Gitee 镜像 | 本仓库 | **只读定时镜像**，不是发布目标：由家族仓的 `gitee-sync` workflow 用 `--force-with-lease` 强制对齐 GitHub tip，所以 `main` 通常落后一次定时运行。**这里从不对 Gitee 推 tag**；报"镜像过期"前先用 `git ls-remote` 与 GitHub 对比 |
| DSH Desktop Market / dsh1024 | npm | 市场装的就是 npm 包，发布即可安装，无需逐版本投稿 |
## Keeping it fresh

```sh
pwsh -File scripts/sync-official-docs.ps1                     # 从本地 checkout 取逐字文档副本
pwsh -File scripts/download-sources.ps1                       # 官方站点/文档、Cordis、论文
pwsh -File scripts/download-community-repos.ps1               # 社区仓库（codeload tarballs）
pwsh -File scripts/download-community-articles.ps1            # zh/en/HN 社区文章
pwsh -File scripts/archive-discussions.ps1                    # 官方 Discussions（需 $env:GH_TOKEN）
pwsh -File scripts/gen-topic-snapshot.ps1 -OutDir <dir>       # dsh-plugin 话题普查
pwsh -File scripts/verify-kit.ps1 -Checkout <checkout>        # 关键路径 + 链接扫描 + 文档漂移
```

## Development

技能 bundle（`index.js`）是纯 ESM、无构建步骤；`dsh-plugin-dev` CLI 是 TypeScript，经 tsdown 构建。门禁：

```sh
pnpm install --frozen-lockfile
pnpm run typecheck && pnpm run typecheck:ci
pnpm test
pnpm run build
pnpm run verify:artifacts        # 自检 + 脚手架冒烟（无网络）
pnpm run verify:self-contained   # 打包 + 干净 profile 安装/启动/卸载冒烟
pnpm run check:readmes           # five READMEs share section structure
pnpm run check:parity            # translations have identical block counts
pnpm run check:facts             # self-stated numbers match data/facts.json
pnpm run check:ps1-bom           # PowerShell scripts keep their UTF-8 BOM
pnpm pack
pwsh -File scripts/verify-kit.ps1   # 关键路径 + 链接扫描（加 -Checkout <checkout> 做文档漂移）
```

## Topics

`dsh`, `deepseek-harness`, `dsh-plugin`, `cordis`, `agent-skill`, `plugin-development`, `knowledge-base`, `cli`, `scaffold`, `checker`

## Contributors

- [PerryLink](https://github.com/PerryLink) —— 创建者与维护者：知识库内容、可安装 bundle 改造、生态提交与社区工程。
- [@Yisa-yi](https://github.com/Yisa-yi) —— **产品经理**。全流程参与项目设计，从最初的大纲到最终发布的 bundle，负责的是产品形态而非代码：确定它以「可安装 bundle + 按需注册 agent skill」的形态交付（文档站只渲染同一批源文件，不另立一套内容）；确定 10 章开发指南的信息架构；确立「每条事实必须链接出处」的纪律；以及把认知层（`SKILL.md` + `guide/`）与机械层（`dsh-plugin-dev new / check / verify`）分开的分层设计。也确定了 `guide/unfixed-issues.md` 的证据标准——每条都带针对指定宿主提交的 `path:line`、设计取舍与真 bug 对照表，以及明确的「无法复现」小节——以及 `guide/when-to-retire-a-plugin.md` 的冻结/退役判据。守住范围边界（只读、不联网、不调用模型、无配置项）与五语 README 同步的要求。
- 日常维护由 DeepSeek Harness agents 辅助（它们无 GitHub 账号，为透明起见列于此，不作贡献者）。

## PerryLink DSH Plugin Family

本项目是 [PerryLink](https://github.com/PerryLink) 维护的 DeepSeek Harness 插件家族成员：**87 个活跃维护**，名册共 **95** 个，其中 **5 个已冻结**、**3 个已退役**。完整名单默认折叠，避免每个 README 的首屏被长表淹没；点击展开可查看每一行，原因见「状态」列。

<details>
<summary>展开全部 95 个插件</summary>

| 插件 | 一句话 | 状态 |
|---|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** | 水产养殖投入品记录核对（按投入品用量、休药期与起捕间隔核对记录自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** | 档案归档完整性与保管期限核对（依据《档案法》及配套规定，仅提示差异，不作出定性结论） |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** | Second-model auto-review on the approval chain, fail-closed by default |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | Automatic strong/cheap model-tier routing with deterministic risk guards and a `/tier` command |  |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | Durable background child agents with a Web UI sidebar, messaging and interrupt | 🚫 已退役 — 见仓库 README |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** | 投标文件符合性预检（按招标文件逐条核对响应情况，仅提示差异，不作出定性结论） |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** | 投标人资格条件核对（按资格条件与证明材料核对逐条响应，仅提示差异，不作出定性结论） |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | Cost governance for DeepSeek Harness: budgets, carbon, and latency in one panel. | 🧊 已冻结 — 见仓库 README |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | Read-only MCP server exposing the certification registry: grades, snapshots and five-dimension evidence |  |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** | Claude Code /rewind-equivalent: snapshots, session forks, one-shot restore |  |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | Migrate Claude Code sessions, memory, skills and CLAUDE.md into DSH | 🧊 已冻结 — 见仓库 README |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** | Cross-platform native desktop control for DeepSeek Harness — Windows first. |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** | Terminal-style input history for the web composer: arrows, Ctrl+R search |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** | 合同条款立场台账核对（按立场、风险等级与退让底线核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** | 报关单证一致性核对（按公开的报关单填制规范核对单证间字段一致性，仅提示差异，不作出定性结论） |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** | Dataset quality checks and citation cross-checks (the optional numeric bridge consumed here) |  |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | Prompt-injection, jailbreak, and secret-leak defense for DeepSeek Harness. | 🧊 已冻结 — 见仓库 README |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** | 滞箱费台账核对（按免箱期与费率核对超期天数与金额的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** | Engineering-discipline guard: requirements grill, test gates, adversary review |  |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | Unified static-image generation routing for DeepSeek Harness. | 🧊 已冻结 — 见仓库 README |
| **[dsh-drill-script-check](https://github.com/PerryLink/dsh-drill-script-check)** | 应急演练脚本核对（按阶段、响应分级、指挥与资源要素核对脚本齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-eia-guide-check](https://github.com/PerryLink/dsh-eia-guide-check)** | 环评导则适用性核对（按要素、导则名称与执行标准核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-emergency-plan](https://github.com/PerryLink/dsh-emergency-plan)** | 应急预案要素齐备性与条款级页码定位（依据 GB/T 29639-2020 等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-essay-rubric-check](https://github.com/PerryLink/dsh-essay-rubric-check)** | 作文量表评分核对（按评分项、原文定位与分值算术核对评分自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-evidence-check](https://github.com/PerryLink/dsh-evidence-check)** | 证据清单齐备性核对（按待证事实与证据要素核对清单自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-export-ctl-check](https://github.com/PerryLink/dsh-export-ctl-check)** | 出口管制物项核对（按管制清单、最终用途与许可证核对台账齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-fast](https://github.com/PerryLink/dsh-fast)** | Read-only performance diagnostics for DeepSeek Harness. |  |
| **[dsh-fmea-table-check](https://github.com/PerryLink/dsh-fmea-table-check)** | FMEA 分析表要素齐备性与风险顺序数一致性核对（按公开的 FMEA 方法标准核对表内自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-forecast-penalty](https://github.com/PerryLink/dsh-forecast-penalty)** | 预测准确率考核核对（按准确率、门槛与考核单价核对考核费用的算术自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-fund-research](https://github.com/PerryLink/dsh-fund-research)** | Deterministic research reports for Chinese public mutual funds |  |
| **[dsh-github](https://github.com/PerryLink/dsh-github)** | GitHub PR/issues integration for DSH, every write gated by approval |  |
| **[dsh-gongwen-flow-check](https://github.com/PerryLink/dsh-gongwen-flow-check)** | 公文流转与办理时限核对（按公开的公文处理规范核对环节完整性与时限，仅提示差异，不作出定性结论） |  |
| **[dsh-gongwen-word-check](https://github.com/PerryLink/dsh-gongwen-word-check)** | 公文格式要素核对（按公开的党政机关公文格式标准核对版头与主体要素，仅提示差异，不作出定性结论） |  |
| **[dsh-guard-plan-qc](https://github.com/PerryLink/dsh-guard-plan-qc)** | 劳动保护与安全防护用品配置表核对（按公开的配备标准核对品名规格与配置数量，仅提示差异，不作出定性结论） |  |
| **[dsh-hazchem-check](https://github.com/PerryLink/dsh-hazchem-check)** | 危险化学品临界量与重大危险源辨识核对（按储存量与临界量核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-hazplan-check](https://github.com/PerryLink/dsh-hazplan-check)** | HAZOP 分析表要素齐备性与偏差推导一致性核对（依据公开的危险与可操作性分析标准，仅提示差异，不作出定性结论） |  |
| **[dsh-hidden-risk-map](https://github.com/PerryLink/dsh-hidden-risk-map)** | 安全隐患台账→《工贸企业重大事故隐患判定标准》（应急管理部令第10号）条款映射提示（仅提示差异，不作出定性结论） |  |
| **[dsh-hs-classify](https://github.com/PerryLink/dsh-hs-classify)** | 商品归类层级一致性核对（按章、品目、子目与商品编号的层级关系核对自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-icd-rule-check](https://github.com/PerryLink/dsh-icd-rule-check)** | ICD 合并编码与星剑号配对提示（依据 GB/T 14396-2016 与公开的 ICD 使用说明，仅提示差异，不作出定性结论） |  |
| **[dsh-industry-research](https://github.com/PerryLink/dsh-industry-research)** | Industry research orchestration that seals its deliverables through this plugin's `ctx.researchReport.assemble` |  |
| **[dsh-lawcite-adapter](https://github.com/PerryLink/dsh-lawcite-adapter)** | 法条引用与文书要素核对（按名称、条号、原文与效力状态核对引用可核验性，仅提示差异，不作出定性结论） |  |
| **[dsh-laya](https://github.com/PerryLink/dsh-laya)** | Laya typed decisions (`noul`/`choice`/`score`) as a first-class Cordis service and model-visible tools |  |
| **[dsh-lc-doc-check](https://github.com/PerryLink/dsh-lc-doc-check)** | 信用证单据条款核对（按单据种类、份数、期限与不符点核对交单自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-learning-gap-check](https://github.com/PerryLink/dsh-learning-gap-check)** | 能力差距与培养计划核对（按能力等级差、培养措施与完成期限核对台账闭环，仅提示差异，不作出定性结论） |  |
| **[dsh-library](https://github.com/PerryLink/dsh-library)** | Local document knowledge base for DeepSeek Harness. |  |
| **[dsh-local-ai](https://github.com/PerryLink/dsh-local-ai)** | Local-model (Ollama) integration for DeepSeek Harness. |  |
| **[dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions)** | LSP diagnostics, formatting, completion, code actions and rename over language servers |  |
| **[dsh-mask](https://github.com/PerryLink/dsh-mask)** | PII masking middleware: anonymize at the model boundary, restore at the display layer |  |
| **[dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel)** | Read-only MCP runtime panel: /mcp command + Settings tab with status, tools and errors |  |
| **[dsh-medrec-qc](https://github.com/PerryLink/dsh-medrec-qc)** | 病案首页形式质控与逻辑矛盾提示（依据国卫办医发〔2016〕24号等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** | Approval-gated cross-session memory: ctx.memory seam + SQLite + memory tool |  |
| **[dsh-nsfc-form-check](https://github.com/PerryLink/dsh-nsfc-form-check)** | 国家自然科学基金申请书形式审查与匿名化提示（依据《国家自然科学基金条例》与申请人导入的当年指南，仅提示差异，不作出定性结论） |  |
| **[dsh-nurse-record-check](https://github.com/PerryLink/dsh-nurse-record-check)** | 护理记录时限、签名与评估表完整性校验（依据《病历书写基本规范》等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-observe](https://github.com/PerryLink/dsh-observe)** | OpenTelemetry and Langfuse observability exporter for DeepSeek Harness. |  |
| **[dsh-origin-rvc-check](https://github.com/PerryLink/dsh-origin-rvc-check)** | 原产地区域价值成分核对（按 RVC 定义式与门槛核对原产地判定自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-ota-review-check](https://github.com/PerryLink/dsh-ota-review-check)** | 在线点评回复台账核对（按回复时限、问题分类与整改状态核对台账闭环，仅提示差异，不作出定性结论） |  |
| **[dsh-output-styles](https://github.com/PerryLink/dsh-output-styles)** | Claude Code outputStyles-equivalent runtime style switching |  |
| **[dsh-paper-doc-adapter](https://github.com/PerryLink/dsh-paper-doc-adapter)** | 试卷解析结构核对（按题型、答案、分值与 yotta 标识核对试卷结构自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** | Claude Code-style declarative allow/deny/ask permission rules with audit |  |
| **[dsh-permit-report-check](https://github.com/PerryLink/dsh-permit-report-check)** | 行政许可办理核对（按申请材料、法定时限与决定记录核对台账闭环，仅提示差异，不作出定性结论） |  |
| **[dsh-pipeline-check](https://github.com/PerryLink/dsh-pipeline-check)** | 项目全流程文件链条核对（按环节先后与金额口径核对链条自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-pleading-draft](https://github.com/PerryLink/dsh-pleading-draft)** | 起诉状要素齐备性核对（按诉请、事实、证据、法条四要素核对文书齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-plugin-doctor](https://github.com/PerryLink/dsh-plugin-doctor)** | Zero-dependency static + sandbox smoke detector for DSH plugins |  |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** | Plugin-development knowledge base as an on-demand agent skill |  |
| **[dsh-plugin-kit](https://github.com/PerryLink/dsh-plugin-kit)** | Shared zero-runtime-dependency toolkit for the PerryLink DSH plugins |  |
| **[dsh-plugin-upgrade](https://github.com/PerryLink/dsh-plugin-upgrade)** | One-package, one-corridor-index plugin upgrade skill: routes a repository to the matching closed corridor card |  |
| **[dsh-policy-brief-draft](https://github.com/PerryLink/dsh-policy-brief-draft)** | 政策专报要素核对（按观点、依据、出处与建议核对专报齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-power-loss-split](https://github.com/PerryLink/dsh-power-loss-split)** | 线损电量拆分与考核表核对（依据公开的线损计算口径，仅提示差异，不作出定性结论） |  |
| **[dsh-power-ticket-check](https://github.com/PerryLink/dsh-power-ticket-check)** | 电力工作票要素齐备性与签发许可顺序核对（依据现行电力安全工作规程，仅提示差异，不作出定性结论） |  |
| **[dsh-ppap-check](https://github.com/PerryLink/dsh-ppap-check)** | PPAP 提交要素齐备性核对（按公开的 PPAP 手册与提交等级核对要素齐备与版本填写，仅提示差异，不作出定性结论） |  |
| **[dsh-protest-deadline](https://github.com/PerryLink/dsh-protest-deadline)** | 质疑与投诉期限核对（按公开的政府采购质疑投诉规定核对期限与台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-railway-window](https://github.com/PerryLink/dsh-railway-window)** | 铁路施工天窗台账核对（按时间窗、时长算术与命令号核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | Multi-channel approval/question bridge: WeChat/Telegram/Feishu, session console | 🧊 已冻结 — 见仓库 README |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** | 维修工单结算核对（按项目金额、配件工时合计与结算总额核对算术自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** | Verifiable research-report engine: content-addressed evidence ledger and sealed versions |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** | 审稿意见逐条回应覆盖核对（按意见与回应一一对应核对覆盖完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** | 规则库文件自检核对（按条款引用纪律与效力上限核对规则库自身合规，仅提示差异，不作出定性结论） |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** | 安全技术交底记录要素齐备性与签字闭环核对（依据公开的安全生产法规与检查标准，仅提示差异，不作出定性结论） |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** | Multi-dimensional quality scoring for DeepSeek Harness plugins. |  |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | Pin sessions in the Web sidebar with durable ordering | 🚫 已退役 — 见仓库 README |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** | Cross-device session sync for DeepSeek Harness — a dedicated git mirror of your session store. |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** | 监理日志跨日连续性与旁站覆盖提示（依据 GB/T 50319-2013 等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** | Security-audit skill pack: secret scan, dependency and supply-chain review |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** | 三重一大决策台账核对（按前置研究、会议审议与决议记录核对程序留痕，仅提示差异，不作出定性结论） |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** | 土壤与地下水监测台账核对（按点位、监测项目、限值与超标判定核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** | 作业规程与 FMEA／控制计划一致性核对（按编号与版本核对三份文件是否同步，仅提示差异，不作出定性结论） |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** | 控制图常数与过程能力指数核对（按 GB/T 4091 的常规控制图常数表核对控制限与 Cp/Cpk 的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** | Voice-first session loop for DeepSeek Harness: talk to it, hear it answer. |  |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | Cross-session team rooms: shared message bus, task board and timeline | 🚫 已退役 — 见仓库 README |
| **[dsh-tender-extract](https://github.com/PerryLink/dsh-tender-extract)** | 招标文件条款摘录核对（按出处与原文逐字核对摘录完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-tender-matrix](https://github.com/PerryLink/dsh-tender-matrix)** | 评标因素评分矩阵核对（按分值上限与合计核对矩阵自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** | Isolated install-and-smoke test drives for DeepSeek Harness plugins. |  |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** | TickTick/Dida365 task bridge: session-header panel + 11 tools |  |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** | Vendor parameter translation and deterministic JSON repair for DeepSeek Harness. |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** | 质保期与索赔金额核对（按质保期月数与里程、索赔金额算式核对自洽，仅提示差异，不作出定性结论） |  |

</details>

</details>

</details>## Disclaimer

社区维护，**非** DeepSeek 官方产品。DeepSeek Harness 处于开发者预览期并发布破坏性变更；有疑问时，以 `references/official-docs/` 中的官方文档为准。

## License

[Apache License 2.0](LICENSE) © 2026 dsh-plugin-guide contributors —— 自有文本（`SKILL.md`、`guide/`、`references/`、`scripts/`、本 README）按 Apache-2.0；打包的第三方内容见 [NOTICE.md](NOTICE.md)。

### 从 DSH Desktop 市场安装

所有 PerryLink 插件均可在 DSH Desktop 内置市场中浏览：**市场 → 来源 → 添加来源 → 粘贴** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ 选中**。安装仍需通过市场的 npm 身份校验与你的确认。
