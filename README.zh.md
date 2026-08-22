<div align="center">

# 🐳 dsh-plugin-guide

**构建 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 插件所需的一切。**

*官方文档档案 · Cordis 入门 · 社区深读 · 实战踩坑 · agent 技能*

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
| Harness | DeepSeek Harness `0.1.1-rc.2` |
| Node | `^22.19.0 || >=24.0.0`（DeepSeek Harness 运行时） |
| Platforms | 全部（纯 ESM bundle；无原生代码、无网络） |
| Model | 任意（无模型交互） |

## What you get

`dsh-plugin-guide` 是 DSH 插件开发知识库，打包为可安装 bundle，把整份内容注册为 `dsh-plugin-guide` agent 技能。该技能在每个会话目录中都可见，并按需加载其工作流步骤、官方文档与社区深读。

- **插件契约与红线** —— effect/disposer、waterfall `next()`、模型可见 ⟺ 已记录、Schemastery 配置。
- **官方文档档案** —— 官方仓库文档（英 + 中）逐字副本，在最近核验快照处与上游逐字节一致。
- **Cordis 入门** —— 五个概念与机制时间线（repository-plugin 0809 引入、0811 移除；两条安装通道）。
- **20+ 个实战踩坑** —— 附根因 + 修法（cordis 双副本、tsconfig 三件套、多帧 zstd 会话、Windows junction、过期 npm `latest`…）。
- **社区深读** —— 归档 114 个社区仓库（15 个深读），外加每条事实都链回出处的完整来源索引。

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
| `downloads/` | 原始快照 —— 由 `scripts/` 生成、不入库 |

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

`dsh-plugin-guide` 不暴露任何 Schemastery `Config` —— 它把知识库注册为 agent 技能，无可调键。

## Tools & surfaces

| Surface | Kind | Notes |
|---|---|---|
| `dsh-plugin-guide` | skill | 经 `ctx.skills` 注册；按需加载 `SKILL.md` + `./guide/` + `./references/` |

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

bundle 是纯 ESM —— 无构建步骤。CI 在每次 push 与 pull request 运行完整性门禁：

```sh
pwsh -File scripts/verify-kit.ps1   # 关键路径 + 链接扫描（加 -Checkout <checkout> 做文档漂移）
```

## Topics

`dsh`, `deepseek-harness`, `dsh-plugin`, `cordis`, `agent-skill`, `plugin-development`, `knowledge-base`

## Contributors

- [PerryLink](https://github.com/PerryLink) —— 创建者与维护者：知识库内容、可安装 bundle 改造、生态提交与社区工程。
- 日常维护由 DeepSeek Harness agents 辅助（它们无 GitHub 账号，为透明起见列于此，不作贡献者）。

## PerryLink DSH Plugin Family

本项目是 [PerryLink](https://github.com/PerryLink) 维护的 [15 个 DeepSeek Harness 插件](https://github.com/PerryLink) 之一。如果这个对你有用，其他插件多半也有用：

| Plugin | One-liner |
|---|---|
| [dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel) | Read-only MCP runtime panel: /mcp command + Settings tab with status, tools and errors |
| [dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck) | Engineering-discipline guard: requirements grill, test gates, adversary review |
| [dsh-background-agents](https://github.com/PerryLink/dsh-background-agents) | Durable background child agents with a Web UI sidebar, messaging and interrupt |
| [dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions) | LSP diagnostics, formatting, completion, code actions and rename over language servers |
| [dsh-output-styles](https://github.com/PerryLink/dsh-output-styles) | Claude Code outputStyles-equivalent runtime style switching |
| [dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind) | Claude Code /rewind-equivalent: snapshots, session forks, one-shot restore |
| [dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules) | Claude Code-style declarative allow/deny/ask permission rules with audit |
| [dsh-auto-review](https://github.com/PerryLink/dsh-auto-review) | Second-model auto-review on the approval chain, fail-closed by default |
| [dsh-memento](https://github.com/PerryLink/dsh-memento) | Approval-gated cross-session memory: ctx.memory seam + SQLite + memory tool |
| [dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security) | Security-audit skill pack: secret scan, dependency and supply-chain review |
| [dsh-session-pin](https://github.com/PerryLink/dsh-session-pin) | Pin sessions in the Web sidebar with durable ordering |
| [dsh-composer-history](https://github.com/PerryLink/dsh-composer-history) | Terminal-style input history for the web composer: arrows, Ctrl+R search |
| [dsh-github](https://github.com/PerryLink/dsh-github) | GitHub PR/issues integration for DSH, every write gated by approval |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** | Plugin-development knowledge base as an on-demand agent skill |
| [dsh-claude-move](https://github.com/PerryLink/dsh-claude-move) | Migrate Claude Code sessions, memory, skills and CLAUDE.md into DSH |

## Disclaimer

社区维护，**非** DeepSeek 官方产品。DeepSeek Harness 处于开发者预览期并发布破坏性变更；有疑问时，以 `references/official-docs/` 中的官方文档为准。

## License

[Apache License 2.0](LICENSE) © 2026 dsh-plugin-guide contributors —— 自有文本（`SKILL.md`、`guide/`、`references/`、`scripts/`、本 README）按 Apache-2.0；打包的第三方内容见 [NOTICE.md](NOTICE.md)。
