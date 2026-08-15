<div align="center">

# 🐳 dsh-plugin-guide

**开发 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 插件所需的一切。**

官方文档存档 · Cordis 入门 · 社区深读 · 实测踩坑 · 智能体技能

[English](README.md) · [中文](README.zh-CN.md) · [Español](README.es.md) · [Português](README.pt.md) · [हिन्दी](README.hi.md)

[![GitHub stars](https://img.shields.io/github/stars/PerryLink/dsh-plugin-guide?style=for-the-badge&color=yellow&label=%E2%AD%90%20Stars)](https://github.com/PerryLink/dsh-plugin-guide/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/PerryLink/dsh-plugin-guide?style=for-the-badge&color=blue&label=Forks)](https://github.com/PerryLink/dsh-plugin-guide/network/members)
[![verify-kit CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-plugin-guide/verify.yml?branch=main&style=for-the-badge&label=CI)](https://github.com/PerryLink/dsh-plugin-guide/actions/workflows/verify.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue?style=for-the-badge)](LICENSE)
[![Topic: dsh](https://img.shields.io/badge/Topic-dsh-4D6BFE?style=for-the-badge)](https://github.com/topics/dsh)
[![Topic: dsh-plugin](https://img.shields.io/badge/Topic-dsh--plugin-8257D0?style=for-the-badge)](https://github.com/topics/dsh-plugin)
[![Docs: EN/ZH](https://img.shields.io/badge/Docs-EN%2FZH-8257D0?style=for-the-badge)](references/official-docs/)

</div>

> 🗺️ **每条事实都链接到出处**——官方文档、上游仓库或社区仓库。有疑问时以官方原文副本为准。
>
> ⏱️ **最后核验 2026-08-15**——官方文档与上游 `master`（47f9438，见 [SNAPSHOT.md](references/official-docs/SNAPSHOT.md)）逐字节一致；npm 标签与 `dsh-plugin` 话题（08-15 快照抓取期间 API total_count **2668 → 2671 持续增长**，分页快照收录 998 个仓库，见 [sources.md](references/sources.md) §D.2）已实时重核；上游 HEAD 与 npm `@deepseek-ai/dsh`（0.1.0-rc.6）无变化。

## 📊 一览

| 官方文档 | 社区深读 | 实测踩坑 | `dsh-plugin` 话题 | 语言 | 智能体技能 |
|---|---|---|---|---|---|
| 215 篇（中英） | 111 个仓库 | 20+ | 998 快照（API ≈2670） | EN · 中文 · ES · PT · HI | `dsh-plugin-guide` |

## 🚀 快速开始

### 🤖 作为智能体技能使用

把整个目录复制进你的 agent 技能目录（相对路径保持不变）：

**Windows（PowerShell）**

```powershell
pwsh -File scripts/install-skill.ps1 `
  -Target "$env:USERPROFILE\.deepseek\skills\dsh-plugin-guide"   # 或 <项目>\.agents\skills\dsh-plugin-guide
```

**macOS / Linux**

```bash
pwsh -File scripts/install-skill.ps1 -Target ~/.deepseek/skills/dsh-plugin-guide   # 或 <项目>/.agents/skills/dsh-plugin-guide
```

安装脚本会跳过 `downloads/`（脚本生成）与 `.github/`，并对每个复制的文件做逐字节校验；手工 `Copy-Item -Recurse` 整个目录也可以。

然后对智能体说：*"用 dsh-plugin-guide 技能帮我开发一个 XX 插件。"*

### 📖 或者直接阅读

| 想要什么 | 读哪里 |
|---|---|
| 一页速查表 | [`guide/quick-reference.md`](guide/quick-reference.md) |
| 完整 10 章路径 | [`guide/plugin-dev-guide.md`](guide/plugin-dev-guide.md) |
| 官方与社区文档链接 | [`guide/links.md`](guide/links.md) · [`references/community-ecosystem.md`](references/community-ecosystem.md) |
| 服务/事件精确 API | `references/official-docs/docs/subsystems/` 与 `docs/cordis-api/` |

## 🧭 目录结构

| 路径 | 内容 |
|---|---|
| `SKILL.md` | `dsh-plugin-guide` 技能：硬性红线 + 按任务类型的开发路径 |
| `guide/plugin-dev-guide.md` | 完整开发指南（10 章） |
| `guide/quick-reference.md` | 一页速查表（5 语种） |
| `guide/links.md` | 精选 URL 索引：官方开发文档（线上 ↔ 本地副本）+ 社区开发文档链接 |
| `references/official-docs/` | 官方文档逐字副本（中英双语） |
| `references/*.md` | 调研报告：仓库文档、文档站、Cordis、论文、社区生态、111 仓库归档（15 个深读） |
| `scripts/` | 幂等下载脚本 + 完整性检查器 + 话题快照生成器 |
| `downloads/` | 原始下载物——由 `scripts/` 生成，不入版本库 |

## ✨ 亮点

- 📜 **插件契约与红线**——注册即 effect、waterfall 必须 `next()`、模型可见⟺已记录、Schemastery 配置。
- 🕰️ **机制时间线**——repository-plugin 机制 0809 推出、0811 移除；bundle 与纯 cordis 两条安装通道。
- 🕳️ **20+ 个实测坑**（根因+修法）：cordis 双副本、tsconfig 三件套、`tsc` 报错仍产出、Windows junction、多帧 zstd 会话、`DSH_*` 环境变量、npm `latest` 过期……
- 🔬 **111 个社区仓库归档**（15 个深读）——模板、脚手架、踩坑档案、plugin-check 规则、Fabric 层、MCP 桥，另有 15 语言指南、s01–s23 课程、深度手册、TS/Rust SDK 等 26 个文档型仓库与 08-15 第七批 14 个仓库（桌面端/QQ 桥接/安全 PoC/Python 移植）。
- 🔗 **全量来源索引**——每条结论都链接到出处（官方文档、上游仓库、社区仓库）。
- 🗃️ **官方 Discussions 全量归档（1654 条，含精选线程评论）+ 中英文社区文章快照 100+ 篇**——用 `scripts/archive-discussions.ps1` / `scripts/download-community-articles.ps1` 一键刷新。
- 🆕 **新鲜度印章**——2026-08-15 对照上游 `master`、npm 与实时 `dsh-plugin` 话题复核。

## 🔄 保持新鲜

```sh
pwsh -File scripts/sync-official-docs.ps1                     # 从本地 checkout 同步官方文档逐字副本（只取 origin/master）
pwsh -File scripts/download-sources.ps1                       # 官网/文档站、Cordis、论文
pwsh -File scripts/download-community-repos.ps1               # 111 个社区仓库（codeload tarball，ETag 增量刷新）
pwsh -File scripts/download-community-articles.ps1            # 中/英/HN 社区文章 HTML 快照
pwsh -File scripts/archive-discussions.ps1                    # 官方 Discussions（需 $env:GH_TOKEN）
pwsh -File scripts/gen-topic-snapshot.ps1 -OutDir <目录>      # dsh-plugin 话题普查
pwsh -File scripts/verify-kit.ps1 -Checkout <checkout>        # 关键路径 + 断链扫描 + 官方文档漂移报告
```

每次 push 与 PR 都会由 CI 运行 `verify-kit`。

## 🏷️ 话题

本仓库以 GitHub 话题 **[`dsh`](https://github.com/topics/dsh)** 与 **[`dsh-plugin`](https://github.com/topics/dsh-plugin)** 对外可见——逛这两个话题页可以发现数百个插件与开发资源。

## 🤝 参与共建

- ⭐ **给仓库点 Star**——帮助更多 DSH 插件开发者发现它。
- 发现错误、新坑或值得深读的仓库？提 [issue](https://github.com/PerryLink/dsh-plugin-guide/issues) 或 Pull Request——见 [CONTRIBUTING.md](CONTRIBUTING.md)。
- 加入社区：[DeepSeek Harness Discord](https://discord.gg/Ycq5dCaS4) · [官方讨论区](https://github.com/deepseek-ai/deepseek-harness/discussions) · [`dsh-plugin` 话题页](https://github.com/topics/dsh-plugin)。

## 📄 许可与归属

- 自有文本（`SKILL.md`、`guide/`、`references/` 报告、`scripts/`、本 README）：**Apache-2.0**——见 [LICENSE](LICENSE)。
- 收录的第三方内容及其分发边界见 [NOTICE.md](NOTICE.md)（例如 `downloads/` 仅限本地、`awesome-dsh-plugins` 禁止再分发）。

## ⚖️ 免责声明

社区维护，**不是** DeepSeek 官方产品。DeepSeek Harness 处于开发者预览期、会发布破坏性变更；有疑问时以
`references/official-docs/` 中的官方文档为准。
