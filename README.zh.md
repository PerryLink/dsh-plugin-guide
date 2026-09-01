<div align="center">

# 🐳 dsh-plugin-guide
- **1024 商店渠道**：先 `npm i -g dsh1024`，再 `dsh1024 plugin --profile web add dsh-plugin-guide`（计入 [deepseek1024.com](https://deepseek1024.com) 安装排行）。

**构建 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 插件所需的一切。**

*官方文档档案 · Cordis 入门 · 社区深读 · 实战踩坑 · agent 技能 · CLI 工具链*

> **官方仓库。** 本仓库是 dsh-plugin-guide 的唯一官方仓库，由 PerryLink 维护。其他账号下的同名仓库与本项目无关。

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![DSH plugin](https://img.shields.io/badge/dsh-plugin-✅-green)](https://github.com/topics/dsh-plugin)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-plugin-guide/verify.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-plugin-guide/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-plugin-guide?label=version)](https://github.com/PerryLink/dsh-plugin-guide/releases)
[![npm version](https://img.shields.io/npm/v/dsh-plugin-guide)](https://www.npmjs.com/package/dsh-plugin-guide)
[![npm downloads](https://img.shields.io/npm/dm/dsh-plugin-guide)](https://www.npmjs.com/package/dsh-plugin-guide)

[English](README.md) · [简体中文](README.zh.md) · [Español](README.es.md) · [Português](README.pt.md) · [हिन्दी](README.hi.md)

</div>

---

## Compatibility

| Surface | Status |
|---|---|
| Harness | DeepSeek Harness `0.1.2-alpha.3`（2026-09-01 已适配）：会话信封保留 ignorable 字段但仅用于存量日志读取兼容——Session.append 仍无法盖章，门控行为不变。 |
| Node | `^22.19.0 || >=24.0.0`（DeepSeek Harness 运行时） |
| Platforms | 全部（纯 ESM bundle；无原生代码、无网络） |
| Model | 任意（无模型交互） |

## What you get

`dsh-plugin-guide` 是 DSH 插件开发知识库加 CLI 工具链，打包为一个可安装 bundle。知识库注册为 `dsh-plugin-guide` agent 技能（在每个会话目录可见，按需加载工作流步骤、官方文档与社区深读）；`dsh-plugin-dev` CLI 在其之上提供三个机械层。

- **插件契约与红线** —— effect/disposer、waterfall `next()`、模型可见 ⟺ 已记录、Schemastery 配置。
- **官方文档档案** —— 官方仓库文档（英 + 中）逐字副本，在最近核验快照处与上游逐字节一致。
- **Cordis 入门** —— 五个概念与机制时间线（repository-plugin 0809 引入、0811 移除；两条安装通道）。
- **20+ 个实战踩坑** —— 附根因 + 修法（cordis 双副本、tsconfig 三件套、多帧 zstd 会话、Windows junction、过期 npm `latest`…）。
- **社区深读** —— 归档 114 个社区仓库（15 个深读），外加每条事实都链回出处的完整来源索引。
- **CLI 工具链** —— `dsh-plugin-dev new / check / verify`：脚手架、静态检查、打包验证 DSH 插件；每个检查项都链回它强制执行的技能章节。

## Knowledge base

| Path | 是什么 |
|---|---|
| `SKILL.md` | `dsh-plugin-guide` agent 技能：红线 + 按任务类型的开发路径 |
| `package.json` · `cordis.patch.yml` · `index.js` | 可安装 DSH bundle：`dsh.bundle.patch` 清单 + 注册技能的入口 |
| `guide/plugin-dev-guide.md` | 完整开发指南（10 章） |
| `guide/quick-reference.md` | 一页速查表（5 语言） |
| `guide/links.md` | 精选 URL 索引：官方开发文档（站点 ↔ 本地副本）+ 社区文档链接 |
| `references/official-docs/` | 官方仓库文档逐字副本（英 + 中） |
| `references/*.md` | 调研报告：仓库文档、网站、Cordis、论文、社区生态、114 仓库归档（15 个深读） |
| `scripts/` | 幂等下载脚本 + 完整性检查器 + 话题快照生成器 |
| `bin/` · `src/cli/` · `dist/` | `dsh-plugin-dev` CLI：脚手架、检查器、验证器（TypeScript，tsdown 打包） |
| `templates/` | TS + JS 脚手架骨架：契约模板、Config、tests、cordis.patch.yml、五语 README |
| `downloads/` | 原始快照 —— 由 `scripts/` 生成、不入库 |

## CLI toolchain

bundle 附带零运行时依赖的 `dsh-plugin-dev` CLI（`bin/` → tsdown 打包的 `dist/dsh-plugin-dev.js`）。每个检查项都引用它强制执行的技能章节，agent 可继续人工审计。

```sh
dsh-plugin-dev new <name> [--lang ts|js] [--dir <path>] [--force] [--git]
dsh-plugin-dev check [--cwd <dir>] [--json] [--strict]
dsh-plugin-dev verify [--cwd <dir>] [--dsh <bin>] [--pnpm <bin>]
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
dsh plugin --profile web add "github:PerryLink/dsh-plugin-guide#main"

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

## Install & uninstall

- **git channel**（最新 `main`）：`dsh plugin --profile web add github:PerryLink/dsh-plugin-guide#<sha>` —— 固定提交以可复现；入口是纯 ESM JS，无构建步骤。
- **npm channel**（发布版本）：`dsh plugin --profile web add dsh-plugin-guide`。
- **tarball channel**：在本仓库执行 `pnpm pack`，然后 `dsh plugin --profile web add ./dsh-plugin-guide-<version>.tgz`。
- **uninstall**：`dsh plugin --profile web remove dsh-plugin-guide`。

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
pnpm pack
pwsh -File scripts/verify-kit.ps1   # 关键路径 + 链接扫描（加 -Checkout <checkout> 做文档漂移）
```

## Topics

`dsh`, `deepseek-harness`, `dsh-plugin`, `cordis`, `agent-skill`, `plugin-development`, `knowledge-base`, `cli`, `scaffold`, `checker`

## Contributors

- [PerryLink](https://github.com/PerryLink) —— 创建者与维护者：知识库内容、可安装 bundle 改造、生态提交与社区工程。
- 日常维护由 DeepSeek Harness agents 辅助（它们无 GitHub 账号，为透明起见列于此，不作贡献者）。

## PerryLink DSH Plugin Family

这是 [PerryLink](https://github.com/PerryLink) 维护的 [33 个 DeepSeek Harness 插件](https://github.com/PerryLink) 之一。如果它能帮到你，其他的也会：

| Plugin | One-liner |
|---|---|
| **[dsh-dsh-auto-review](https://github.com/PerryLink/dsh-dsh-auto-review)** | 审批链上的第二模型自动审查，默认失败关闭 | |
| **[dsh-dsh-background-agents](https://github.com/PerryLink/dsh-dsh-background-agents)** | 带 Web UI 侧栏、消息与中断的持久后台子代理 | |
| **[dsh-dsh-budget](https://github.com/PerryLink/dsh-dsh-budget)** | DeepSeek Harness 的成本治理：预算、碳排与延迟一屏呈现。 | |
| **[dsh-dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-dsh-checkpoint-rewind)** | Claude Code /rewind 等价：快照、会话 fork、一次性恢复 | |
| **[dsh-dsh-claude-move](https://github.com/PerryLink/dsh-dsh-claude-move)** | 把 Claude Code 会话、记忆、技能与 CLAUDE.md 迁入 DSH | |
| **[dsh-dsh-click](https://github.com/PerryLink/dsh-dsh-click)** | 跨平台原生桌面控制（DeepSeek Harness），Windows 优先。 | |
| **[dsh-dsh-composer-history](https://github.com/PerryLink/dsh-dsh-composer-history)** | Web 输入框的终端式历史：方向键、Ctrl+R 搜索 | |
| **[dsh-dsh-data-quality](https://github.com/PerryLink/dsh-dsh-data-quality)** | 数据集质量检查与引文核查（本插件可选消费的数字核查桥） | |
| **[dsh-dsh-defend](https://github.com/PerryLink/dsh-dsh-defend)** | DeepSeek Harness 的提示注入、越狱与密钥泄露防护。 | |
| **[dsh-dsh-doublecheck](https://github.com/PerryLink/dsh-dsh-doublecheck)** | 工程纪律守卫：需求质询、测试门禁、对手评审 | |
| **[dsh-dsh-draw](https://github.com/PerryLink/dsh-dsh-draw)** | DeepSeek Harness 的统一静态图像生成路由。 | |
| **[dsh-dsh-fast](https://github.com/PerryLink/dsh-dsh-fast)** | DeepSeek Harness 只读性能诊断。 | |
| **[dsh-dsh-fund-research](https://github.com/PerryLink/dsh-dsh-fund-research)** | 面向中国公募基金的确定性研究报告 | |
| **[dsh-dsh-github](https://github.com/PerryLink/dsh-dsh-github)** | 面向 DSH 的 GitHub PR/issues 集成，每次写入经审批门控 | |
| **[dsh-dsh-industry-research](https://github.com/PerryLink/dsh-dsh-industry-research)** | 行业研究编排，经本插件的 `ctx.researchReport.assemble` 封存交付物 | |
| **[dsh-dsh-library](https://github.com/PerryLink/dsh-dsh-library)** | DeepSeek Harness 的本地文档知识库。 | |
| **[dsh-dsh-local-ai](https://github.com/PerryLink/dsh-dsh-local-ai)** | DeepSeek Harness 的本地模型（Ollama）接入。 | |
| **[dsh-dsh-lsp-actions](https://github.com/PerryLink/dsh-dsh-lsp-actions)** | 通过语言服务器的 LSP 诊断、格式化、补全、代码操作与重命名 | |
| **[dsh-dsh-mask](https://github.com/PerryLink/dsh-dsh-mask)** | PII 脱敏中间件：模型边界匿名化、展示层还原 | |
| **[dsh-dsh-mcp-panel](https://github.com/PerryLink/dsh-dsh-mcp-panel)** | 只读 MCP 运行时面板：/mcp 命令 + 带状态、工具与错误的 Settings 标签页 | |
| **[dsh-dsh-memento](https://github.com/PerryLink/dsh-dsh-memento)** | 审批门控的跨会话记忆：ctx.memory 接缝 + SQLite + 记忆工具 | |
| **[dsh-dsh-observe](https://github.com/PerryLink/dsh-dsh-observe)** | DeepSeek Harness 的 OpenTelemetry 与 Langfuse 可观测导出器。 | |
| **[dsh-dsh-output-styles](https://github.com/PerryLink/dsh-dsh-output-styles)** | Claude Code outputStyles 等价的运行时风格切换 | |
| **[dsh-dsh-permission-rules](https://github.com/PerryLink/dsh-dsh-permission-rules)** | Claude Code 风格声明式 allow/deny/ask 权限规则，带审计 | |
| **[dsh-dsh-research-report](https://github.com/PerryLink/dsh-dsh-research-report)** | 可验证研究报告引擎：内容寻址证据账本与封存版本 | |
| **[dsh-dsh-score](https://github.com/PerryLink/dsh-dsh-score)** | DeepSeek Harness 插件的多维质量评分。 | |
| **[dsh-dsh-session-pin](https://github.com/PerryLink/dsh-dsh-session-pin)** | 在 Web 侧栏置顶会话，带持久排序 | |
| **[dsh-dsh-session-sync](https://github.com/PerryLink/dsh-dsh-session-sync)** | DeepSeek Harness 的跨设备会话同步——会话存储的专用 git 镜像。 | |
| **[dsh-dsh-skill-pack-security](https://github.com/PerryLink/dsh-dsh-skill-pack-security)** | 安全审计技能包：密钥扫描、依赖与供应链审查 | |
| **[dsh-dsh-talk](https://github.com/PerryLink/dsh-dsh-talk)** | DeepSeek Harness 的语音优先会话闭环：对它说，听它答。 | |
| **[dsh-dsh-test-drive](https://github.com/PerryLink/dsh-dsh-test-drive)** | DeepSeek Harness 插件的隔离试装冒烟。 | |
| **[dsh-dsh-translate](https://github.com/PerryLink/dsh-dsh-translate)** | DeepSeek Harness 的厂商参数翻译与确定性 JSON 修复。 | |

## Disclaimer

社区维护，**非** DeepSeek 官方产品。DeepSeek Harness 处于开发者预览期并发布破坏性变更；有疑问时，以 `references/official-docs/` 中的官方文档为准。

## License

[Apache License 2.0](LICENSE) © 2026 dsh-plugin-guide contributors —— 自有文本（`SKILL.md`、`guide/`、`references/`、`scripts/`、本 README）按 Apache-2.0；打包的第三方内容见 [NOTICE.md](NOTICE.md)。
