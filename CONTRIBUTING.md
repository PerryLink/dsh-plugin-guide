# Contributing to dsh-plugin-guide

Thanks for helping improve this knowledge base! English guide below, followed by a 中文指南.

## What we welcome

- **Corrections** — wrong facts, outdated mechanisms, broken links (also run `pwsh -File scripts/verify-kit.ps1`).
- **New pitfalls** — real problems you hit while developing DSH plugins, with root cause + fix.
- **New deep-dives** — community repositories worth analyzing (see `references/community-repo-deep-dive.md` for the format).
- **Translation fixes** — README / quick-reference exist in EN · 中文 · Español · Português · हिन्दी.
- **Docs** — clearer wording anywhere in `guide/` or `references/`.

## Ground rules

1. Every fact must link to its origin (official docs, upstream repo file, or community repo file).
2. The official docs in `references/official-docs/` are a **verbatim copy** — never edit them here; report upstream instead. Sync them only with `pwsh -File scripts/sync-official-docs.ps1` (never hand-copy).
3. `downloads/` is generated, not committed. Do not add files under it.
4. Keep the five READMEs and the five quick-references in sync when changing facts.
5. Respect the distribution boundaries in [NOTICE.md](NOTICE.md) (e.g. `awesome-dsh-plugins` content must not be redistributed).

## Workflow

1. Fork → branch → change → `pwsh -File scripts/verify-kit.ps1` → PR (with a local harness checkout, add `-Checkout <path>` for the docs-drift report).
2. Keep PRs small and scoped; one topic per PR.
3. We follow Apache-2.0 for our own text; third-party content keeps its upstream license.

---

# 贡献指南（中文）

欢迎为知识库做贡献！

## 欢迎的内容

- **纠错**：错误事实、过时机制、断链（可先跑 `pwsh -File scripts/verify-kit.ps1`）。
- **新踩坑**：你在 DSH 插件开发中真实遇到的问题，附根因 + 修法。
- **新深读**：值得分析的社区仓库（格式见 `references/community-repo-deep-dive.md`）。
- **翻译修正**：README 与速查表现有 英 · 中 · 西 · 葡 · 印地 五种语言。
- **文档改进**：`guide/` 与 `references/` 的任何表述。

## 基本规则

1. 每条事实必须链接出处（官方文档、上游仓库文件或社区仓库文件）。
2. `references/official-docs/` 是官方文档**逐字副本**——不要在这里改，问题应反馈给上游；同步只能用 `pwsh -File scripts/sync-official-docs.ps1`（不要手工复制）。
3. `downloads/` 由脚本生成、不入库，不要往里加文件。
4. 改动事实时保持五语 README 与五语速查表同步。
5. 遵守 [NOTICE.md](NOTICE.md) 的分发边界（如 `awesome-dsh-plugins` 内容不得再分发）。

## 流程

1. Fork → 分支 → 修改 → 跑 `pwsh -File scripts/verify-kit.ps1` → 提 PR（本地有 harness checkout 时加 `-Checkout <路径>` 跑官方文档漂移校验）。
2. PR 小而聚焦，一个 PR 一个主题。
3. 自有文本按 Apache-2.0 许可；第三方内容保留其上游许可。
