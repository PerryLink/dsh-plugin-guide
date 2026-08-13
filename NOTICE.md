# NOTICE — 第三方内容归属与许可说明

本仓库（dsh-plugin-guide）是对 DeepSeek Harness 插件开发资料的研究归档。**本仓库自有文本**（`SKILL.md`、`guide/`、`references/` 下的调研报告与汇总、`scripts/`、`README.md`）以 **Apache License 2.0** 许可发布（见 [LICENSE](LICENSE)）。

## 归档的第三方内容及其许可

| 归档位置 | 来源 | 上游许可 | 说明 |
|---|---|---|---|
| `references/official-docs/docs/**` | [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 的 `docs/`（含全部中英双语文档） | MIT | 官方文档全文副本，用于离线阅读 |
| `references/official-docs/AGENTS.md` 等 | 同上仓库根/子目录文档 | MIT | 同上 |
| `downloads/github/cordis/**` | [cordiverse/cordis](https://github.com/cordiverse/cordis) | MIT | 上游 README/文档快照（`downloads/` 不入 git，脚本再生） |
| `downloads/github/paper/**` | [cordiverse/paper](https://github.com/cordiverse/paper) | MIT | 论文 README 与 paper.pdf（不入 git，脚本再生） |
| `downloads/community-repos/**` | 15 个社区仓库（omdsh-dev/*、vlln/* 等） | 各异（MIT / BSD-3-Clause / Apache-2.0 等，以各仓库 LICENSE 为准） | 完整源码快照，仅供本地研究（不入 git，脚本再生） |
| `downloads/web/**` | deepseek-harness.github.io、deepseek.com | 站点所有权利归原作者 | 页面 HTML 快照（不入 git，脚本再生） |

## 分发边界（重要）

- **`downloads/` 目录整体不进入版本库、不随本仓库再分发**：其内容为可再生的第三方快照（由 `scripts/download-sources.ps1` 与 `scripts/download-community-repos.ps1` 生成），其中部分内容上游带私有/内部使用约束或需要原许可授权。
- **`downloads/community-repos/awesome-dsh-plugins/`（AdamPlatin123/awesome-dsh-plugins）**：其仓库内 AGENTS.md 声明内容源自私有组织调研、**仅限内部使用、不得公开分发**。本仓库仅在本机留存其公开可下载内容作参考，**严禁将其内容随本仓库或任何形式再分发**；如需公开引用，仅引用其公开 URL 与公开目录信息。
- 各社区仓库的许可以其自带 LICENSE 为准；再分发任何社区代码前请逐仓核对其许可与约束。
- 本知识库不构成 DeepSeek 或任何上游项目的官方背书；所有结论请对照官方原文使用。

## 更新与维护

- 首次使用/刷新归档：运行 `scripts/download-sources.ps1` 与 `scripts/download-community-repos.ps1`（需网络）。
- 同步官方文档：`Copy-Item -Recurse <deepseek-harness-checkout>\docs references\official-docs\docs`。
