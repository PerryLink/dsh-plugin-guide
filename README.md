<div align="center">

# 🐳 dsh-plugin-guide

**Your agent stops inventing DSH plugin APIs.**

The DeepSeek Harness plugin-development knowledge base, installed *as an agent skill* — official docs, a version-compatibility matrix, migration seams and battle-tested pitfalls, plus a scaffolder/checker CLI.

```sh
dsh plugin --profile web add dsh-plugin-guide
```

Then just ask: *"Use the dsh-plugin-guide skill to build me a … plugin."*

[![Gitee](https://img.shields.io/badge/Gitee-mirror-c71d23?logo=gitee)](https://gitee.com/perrylink/dsh-plugin-guide)
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-plugin-guide?metric=downloads)](https://dshfind.com/plugins/PerryLink/dsh-plugin-guide?ref=badge)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/PerryLink/dsh-plugin-guide/badge)](https://api.securityscorecards.dev/projects/github.com/PerryLink/dsh-plugin-guide)

> **Official repository.** This is the only official repository of dsh-plugin-guide, maintained by PerryLink. Same-name repositories under other accounts are not affiliated.

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![DSH plugin](https://img.shields.io/badge/dsh--plugin-✅-green)](https://github.com/topics/dsh-plugin)
[![dsh-doctor](https://raw.githubusercontent.com/PerryLink/dsh-plugin-doctor/main/badges/PerryLink__dsh-plugin-guide.svg)](https://github.com/PerryLink/dsh-plugin-doctor#verified-徽章)
[![DSH Market](https://raw.githubusercontent.com/2BingLing/dsh-market/master/assets/readme/badge-top-rated.svg)](https://dsh.market/)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-plugin-guide/verify.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-plugin-guide/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-plugin-guide?label=version)](https://github.com/PerryLink/dsh-plugin-guide/releases)
[![npm version](https://img.shields.io/npm/v/dsh-plugin-guide)](https://www.npmjs.com/package/dsh-plugin-guide)
[![npm downloads](https://img.shields.io/npm/dm/dsh-plugin-guide)](https://www.npmjs.com/package/dsh-plugin-guide)

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

```sh
dsh plugin --profile <name> add dsh-plugin-guide
```


</div>

---

## Install & uninstall

- **npm channel** (published releases — **the default; start here**): `dsh plugin --profile web add dsh-plugin-guide`. The published tarball already contains `dist/`, so no build step runs.
- **git channel** (latest `main`, or an unreleased commit): `dsh plugin --profile web add github:PerryLink/dsh-plugin-guide#<sha>` — pin a commit for reproducibility. ⚠️ `dist/` is not committed, so pnpm must run this package's `prepare` and will refuse until the build is allowlisted; add it to the profile's `allowBuilds` (see [publish.md](references/official-docs/docs/user/develop/basic/publish.md)).
- **tarball channel**: `pnpm pack` in this repo, then `dsh plugin --profile web add ./dsh-plugin-guide-<version>.tgz`.
- **uninstall**: `dsh plugin --profile web remove dsh-plugin-guide`.

## Why not just read the official docs?

Because the official docs are written for someone who already knows which page to open, and DSH ships a **prerelease every 1.7–2.8 days** with breaking changes. This plugin closes the three gaps that costs authors the most time:

| Gap | What this plugin adds |
|---|---|
| **"Which DSH am I even targeting?"** | A [version matrix](guide/version-matrix.md): the four different values that all call themselves "latest", the frozen sub-package `latest` tags, the breaking-change seams, and how to pick a `peerDependencies` range. **There is no stable line** — every published version is a prerelease. |
| **"What does this break?"** | A [migration guide](guide/migration-0.2.md) covering `0.1.6-alpha.2` → `0.2.1-alpha.2` as **citable seams** with symptom *and* fix, each with its official source — including a data-loss hazard and a change that makes prompts fail before a model request is built. |
| **"Is my plugin actually correct?"** | A [zero-dependency CLI](SKILL.md) (`dsh-plugin-dev new / check / verify`) plus an [offline verbatim mirror](references/official-docs/) of the official docs, so your agent can cite the exact page instead of guessing. |

**Prove it works in 60 seconds:**

```sh
dsh plugin --profile web add dsh-plugin-guide
npx dsh-plugin-guide new hello-plugin      # scaffold a plugin
cd hello-plugin && npx dsh-plugin-guide check --json   # 16 static checks
```

**📖 Prefer reading it as a site?** [perrylink.github.io/dsh-plugin-guide](https://perrylink.github.io/dsh-plugin-guide/) — every chapter as its own page, plus a machine-readable [llms.txt](https://perrylink.github.io/dsh-plugin-guide/llms.txt) for assistants.

**Also on the 1024 store channel:** `npm i -g dsh1024`, then `dsh1024 plugin --profile web add dsh-plugin-guide` (counts toward the [deepseek1024.com](https://deepseek1024.com) install ranking).

<!-- star-cta -->
## ⭐ 如果它帮到了你

这个插件是 [DSH 插件家族](https://github.com/PerryLink)的一员（95 个，全部 Apache-2.0）。如果你在用，**给个 star** —— 它不会解锁任何功能，但会让下一个人在搜索里更容易找到它。

*English:* part of a 95 plugin family for DeepSeek Harness. If it is useful, **a star helps the next person find it** — nothing is gated behind it.


## What is dsh-plugin-guide?

Everything you need to build [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) plugins.

Official docs archive · Cordis primer · community deep-dives · battle-tested pitfalls · agent skill · CLI toolchain


![Terminal demo of dsh-plugin-guide: dsh-plugin-guide — install the bundle, then run the checker](https://raw.githubusercontent.com/PerryLink/dsh-plugin-guide/main/docs/assets/dsh-plugin-guide-hero.png)

![Animated terminal demo of dsh-plugin-guide](https://raw.githubusercontent.com/PerryLink/dsh-plugin-guide/main/docs/assets/dsh-plugin-guide-demo.gif)

*The same run, animated.*

## Comparison

![Measured comparison chart for dsh-plugin-guide](https://raw.githubusercontent.com/PerryLink/dsh-plugin-guide/main/docs/assets/dsh-plugin-guide-evidence.png)

content counts as stated in the README (What you get)

## Compatibility

| Surface | Status |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.2.1-alpha.2` (`d743267388641bc76f17c45ce8b4c231aed1d32c`, the newest master tag **and** master HEAD, 2026-10-09); npm `latest` = `next` = `0.2.0-rc.2`, `alpha` = `0.2.1-alpha.2`. **There is no stable line** — all 31 npm versions and all 26 GitHub Releases are prereleases. The official-docs mirror is pinned to that same commit (429 md pages, re-synced 2026-10-13; see [references/official-docs/SNAPSHOT.md](references/official-docs/SNAPSHOT.md)). `guide/migration-0.2.md` covers `0.1.6-alpha.2` → `0.2.1-alpha.1` in §0–§12 and `0.2.1-alpha.1` → `0.2.1-alpha.2` as 19 citable seams in §13; the 20 breaking-change guides added since the previous baseline (19 under `v0.2.1-alpha.1` plus one backfilled into `v0.2.0-rc.2`) are all in the mirror. |
| Node | `^22.19.0 || >=24.0.0` (DeepSeek Harness runtime) |
| Platforms | All (plain ESM bundle; no native code, no network) |
| Model | Any (no model interaction) |

## What you get

`dsh-plugin-guide` is the DSH plugin-development knowledge base plus a CLI toolchain, packaged as one installable bundle. The knowledge base registers as the `dsh-plugin-guide` agent skill (visible in every session catalog, loading workflow steps, official docs, and community deep-dives on demand); the `dsh-plugin-dev` CLI adds three mechanical layers on top of it.

- **Plugin contract & hard rules** — effects/disposers, waterfall `next()`, host-owned session events, `MessageSourceMap`, the weakest-mechanism ordering, Schemastery config, UI and performance rules.
- **Official docs archive** — a verbatim copy of the official repo docs (EN + ZH), byte-identical to upstream at the last verified snapshot, including the pages that never reach the documentation site.
- **Version adaptivity** — [guide/version-matrix.md](guide/version-matrix.md): the five different "latest" values, the frozen sub-package `latest` tags, the four breaking-change seams, the canonical peer range and how to pick one, the session-format lineage V0→V4, and the 19 breaking changes that landed in `0.2.1-alpha.2`.
- **Migration guide** — [guide/migration-0.2.md](guide/migration-0.2.md): every breaking change from `0.1.6-alpha.2` to `0.2.1-alpha.1` (session format V4, the settings rebuild, invariant removal, `readBytes`, new slots, retired `plugin` message source), each with its official source and a 12-item checklist.
- **Official in-repo skill, distilled** — [references/official-plugin-dev-skill.md](references/official-plugin-dev-skill.md): the harness's own `cordis-plugin-development` workflow, prohibitions, display-metadata checklist, practices, and UI/performance rules.
- **Cordis primer** — the five concepts and the mechanism timeline (repository-plugin introduced 0809, removed 0811; the two install channels).
- **Verified issue index** — [guide/unfixed-issues.md](guide/unfixed-issues.md): 22 unfixed + 11 newly verified items with `path:line`, workarounds, fixing commits, design-vs-bug table, and an explicit "unreproducible" section.
- **30+ real-world pitfalls** with root cause + fix (cordis dual copies, tsconfig trio, multi-frame zstd sessions, Windows junctions, stale npm `latest`, `file:` installs loading a copy, live patch writes, …).
- **Community deep-dives** — 114 community repositories archived (15 deep-dived), plus a full source index where every fact links to its origin.
- **CLI toolchain** — `dsh-plugin-dev new / check / verify`: scaffold, static-check (including display metadata and multi-patch manifests), and pack-verify DSH plugins; every check links back to the skill section it enforces.

## Knowledge base

| Path | What it is |
|---|---|
| `SKILL.md` | The `dsh-plugin-guide` agent skill: hard rules + task-based development paths |
| `package.json` · `cordis.patch.yml` · `index.js` · `locale/` · `icon.svg` | The installable DSH bundle: `dsh.bundle.patch` manifest, entry point that registers the skill, and the display metadata Plugin Manager reads |
| `guide/plugin-dev-guide.md` | The complete development guide (10 chapters) |
| `guide/version-matrix.md` | **Version adaptivity matrix**: the five "latest" values, frozen sub-package `latest` tags, breaking-change seams, peer-range selection, session-format lineage, and the 19 changes in `0.2.1-alpha.2` |
| `guide/migration-0.2.md` | Breaking-change migration guide for the 0.2 generation |
| `guide/unfixed-issues.md` | Source-verified bug index + fixed-on-master list + design-vs-bug table |
| `guide/quick-reference.md` | One-page cheat sheet (5 languages) |
| `guide/links.md` | Curated URL index: official dev docs (site ↔ local copies) + community doc links + repo-only pages |
| `guide/when-to-retire-a-plugin.md` | Retiring and freezing plugins: the criteria and the measured data behind a portfolio audit (EN + ZH) |
| `guide/choosing-a-plugin.md` | Choosing a plugin: who leads each capability surface, with the measured numbers and the verification caveats (EN + ZH) |
| `references/official-docs/` | Verbatim copy of the official repo docs (EN + ZH) |
| `references/official-plugin-dev-skill.md` | Distilled official in-repo plugin-development skill |
| `references/*.md` | Research reports: repo docs, website, Cordis, the paper, community ecosystem, 114-repo archive (15 deep-dived) |
| `scripts/` | Idempotent download scripts + integrity checker + topic snapshot generator |
| `bin/` · `src/cli/` · `dist/` | The `dsh-plugin-dev` CLI: scaffolder, checker, verifier (TypeScript, tsdown-bundled) |
| `templates/` | TS + JS scaffold skeletons: contract template, Config, tests, cordis.patch.yml, locale metadata, icon, five-language READMEs |
| `downloads/` | Raw snapshots — generated by `scripts/`, not committed |

## CLI toolchain

The bundle ships the zero-runtime-dependency `dsh-plugin-dev` CLI (`bin/` → tsdown-bundled `dist/dsh-plugin-dev.js`). Each check cites the skill section it enforces, so an agent can keep auditing manually.

```sh
dsh-plugin-dev new <name> [--lang ts|js] [--dir <path>] [--force] [--git]
dsh-plugin-dev check [--cwd <dir>] [--json] [--strict]
dsh-plugin-dev verify [--cwd <dir>] [--dsh <bin>] [--pnpm <bin>]
dsh-plugin-dev seams <query> | --since <version>   # is this API in my target host?
```

| Subcommand | What it does |
|---|---|
| `new <name>` | Scaffolds a TS or JS plugin repo: `src/index.ts` contract template, Schemastery Config, tests, tsdown/vitest, commented `cordis.patch.yml`, five-language READMEs. Idempotent; refuses non-empty targets without `--force`. |
| `check` | Static checks: `cordis.patch.yml` validity, `package.json` metadata (`dsh.bundle.patch` pointer, peer deps, engines, files whitelist), five-language README consistency, engineering red-line patterns. Emits CI-consumable JSON. |
| `verify` | `pnpm pack`, then install/start/uninstall the bundle in a clean mkdtemp `DSH_HOME` profile (aligned with `verify:self-contained`). Failures report the log tail plus suggestions. |

### CLI configuration

The CLI has no hardcoded tunables — each is a flag or an environment variable.

| Tunable | Flag | Env | Default |
|---|---|---|---|
| Templates directory | — | `DSH_PLUGIN_DEV_TEMPLATES` | `<package>/templates` |
| dsh binary | `--dsh` | `DSH_PLUGIN_DEV_DSH` | `dsh` |
| pnpm binary | `--pnpm` | `DSH_PLUGIN_DEV_PNPM` | `pnpm` |
| Install/pack timeout | `--timeout` | `DSH_PLUGIN_DEV_TIMEOUT` | `300000` ms |
| Headless smoke timeout | `--smoke-timeout` | `DSH_PLUGIN_DEV_SMOKE_TIMEOUT` | `120000` ms |

### Upstream roadmap

`dsh-plugin-dev` is an upstream candidate for the official plugin-development CLI (planned item C12): the scaffolder/checker/verifier are the mechanical layers, while `SKILL.md` + `guide/` stay the cognitive layer.

## Quick start

```sh
# 1. install the bundle into your profile — npm first
dsh plugin --profile web add dsh-plugin-guide

# 2. restart and verify the row
dsh --profile web --dump-config | grep -A3 'id: dsh-plugin-guide'
```

⚠️ **Use the npm channel, not the git channel, for a first install.** The git channel pulls source, and
`dist/` is not committed, so pnpm has to run this package's `prepare` build script — which pnpm 10+ blocks
until you explicitly allowlist it (`allowBuilds`). That is a documented pitfall of git installs, not a
defect, but it makes the git channel a poor first experience. See [Install & uninstall](#install--uninstall)
for the git and tarball channels when you specifically want an unreleased commit.

Then just ask your agent: *"Use the dsh-plugin-guide skill to build me a … plugin."*

Or drive the CLI directly:

```sh
npx dsh-plugin-guide new hello-plugin            # scaffold a TS plugin repo
npx dsh-plugin-guide check --json                # static-check it
npx dsh-plugin-guide verify                      # pack + clean-profile smoke
```

## Copy as a plain agent skill

You can also copy the whole folder into your agent's skill directory (relative paths stay intact):

```powershell
# Windows (PowerShell)
pwsh -File scripts/install-skill.ps1 `
  -Target "$env:USERPROFILE\.deepseek\skills\dsh-plugin-guide"   # or <project>\.agents\skills\dsh-plugin-guide
```

```bash
# macOS / Linux
pwsh -File scripts/install-skill.ps1 -Target ~/.deepseek/skills/dsh-plugin-guide   # or <project>/.agents/skills/dsh-plugin-guide
```

The installer skips `downloads/` (generated) and `.github/`, then verifies every copied file byte-for-byte. A manual `Copy-Item -Recurse` of the whole folder also works.

## Configuration

The skill bundle exposes no Schemastery `Config` — it registers the knowledge base as an agent skill with no tunable keys. The `dsh-plugin-dev` CLI reads its tunables from flags and `DSH_PLUGIN_DEV_*` environment variables (see [CLI toolchain](#cli-toolchain)).

## Tools & surfaces

| Surface | Kind | Notes |
|---|---|---|
| `dsh-plugin-guide` | skill | Registered via `ctx.skills`; loads `SKILL.md` + `./guide/` + `./references/` on demand |
| `dsh-plugin-dev` | bin (CLI) | `new` / `check` / `verify` subcommands; not a DSH plugin row |

## Permissions & data

- **Permissions**: declares `filesystem:read` in its workshop manifest.
- **Data**: read-only — reads its own bundled `guide/` and `references/` files. No network requests, no writes, no model calls.

## Security boundaries

- **Read-only knowledge base.** The bundle only reads its own files; it never writes, never calls the network, and never invokes a model.
- **Official docs are verbatim copies.** `references/official-docs/` is never edited here; report issues upstream and re-sync only with `scripts/sync-official-docs.ps1`.
- **Distribution boundaries.** Bundled third-party content keeps its upstream license; see [NOTICE.md](NOTICE.md) (e.g. `downloads/` is local-only; `awesome-dsh-plugins` must not be redistributed).

## Known limitations

- **Official docs are a snapshot.** Re-sync with `scripts/sync-official-docs.ps1` when upstream moves; the freshness stamp and commit hash reference `references/official-docs/SNAPSHOT.md`.
- **`downloads/` is generated, not committed.** Raw snapshots (community repo archives, Discussions, articles) must be generated with the scripts before use.
- **`awesome-dsh-plugins` content is local-only.** Its upstream declares an internal-use constraint, so it is not redistributed with the repo.

## Release channels

Every channel resolves from this repository or from npm, so one tag reaches all of them; only the Gitee mirror is a scheduled copy:

| Channel | Source of truth | How it updates |
|---|---|---|
| npm (`dsh-plugin-guide`) | this repo's `package.json` | `.github/workflows/release.yml` on a `v*` tag: `verify-kit` gate → CHANGELOG section check → `npm publish --provenance` (skipped when the version already exists) |
| GitHub Release | the same tag | the same workflow creates it idempotently from the tag |
| Discovery badges (npm version, GitHub tag, DSH Market, dsh-doctor) | live lookups | nothing to publish — they read npm/the registry on each render |
| Gitee mirror | this repo | a **read-only scheduled mirror**, not a publish target: it is force-aligned to the GitHub tip (`--force-with-lease`) by the family's `gitee-sync` workflow, so `main` is normally one scheduled run behind. Gitee never receives a tag push from here; compare `git ls-remote` against GitHub before reporting the mirror stale |
| DSH Desktop Market / dsh1024 | npm | the market installs the npm package, so a published version is immediately installable; no per-version submission |

## Keeping it fresh

```sh
pwsh -File scripts/sync-official-docs.ps1                     # verbatim docs copy from a local checkout
pwsh -File scripts/download-sources.ps1                       # official site/docs, Cordis, paper
pwsh -File scripts/download-community-repos.ps1               # community repositories (codeload tarballs)
pwsh -File scripts/download-community-articles.ps1            # zh/en/HN community articles
pwsh -File scripts/archive-discussions.ps1                    # official Discussions (needs $env:GH_TOKEN)
pwsh -File scripts/gen-topic-snapshot.ps1 -OutDir <dir>       # dsh-plugin topic census
pwsh -File scripts/verify-kit.ps1 -Checkout <checkout>        # critical paths + link scan + docs drift
```

## Development

The skill bundle (`index.js`) is plain ESM with no build step; the `dsh-plugin-dev` CLI is TypeScript built by tsdown. Gates:

```sh
pnpm install --frozen-lockfile
pnpm run typecheck && pnpm run typecheck:ci
pnpm test
pnpm run build
pnpm run verify:artifacts        # dogfood self-check + scaffold smoke (no network)
pnpm run verify:self-contained   # pack + clean-profile install/start/uninstall smoke
pnpm run check:readmes           # five READMEs share section structure
pnpm run check:parity            # translations have identical block counts
pnpm run check:facts             # self-stated numbers match data/facts.json
pnpm run check:ps1-bom           # PowerShell scripts keep their UTF-8 BOM
pnpm pack
pwsh -File scripts/verify-kit.ps1   # critical paths + link scan (+ docs drift with -Checkout <checkout>)
```

## Topics

`dsh`, `deepseek-harness`, `dsh-plugin`, `cordis`, `agent-skill`, `plugin-development`, `knowledge-base`, `cli`, `scaffold`, `checker`

## Contributors

- [PerryLink](https://github.com/PerryLink) — creator and maintainer: knowledge-base content, the installable-bundle transformation, ecosystem submissions, and community engineering.
- [@Yisa-yi](https://github.com/Yisa-yi) — **product manager**. Took part in the whole design arc, from the first outline to the shipped bundle, and owned the shape of the product rather than its code: the call to ship it as an installable bundle that registers an on-demand agent skill (the docs site renders those same sources rather than carrying a separate content set), the information architecture of the 10-chapter guide, the "every fact links to its origin" rule, and the split between the cognitive layer (`SKILL.md` + `guide/`) and the mechanical layer (`dsh-plugin-dev new / check / verify`). Set the evidence standard behind `guide/unfixed-issues.md` — `path:line` against a named host commit, a design-vs-bug table, and an explicit unreproducible section — and the freeze/retire criteria in `guide/when-to-retire-a-plugin.md`. Held the scope line (read-only, no network, no model calls, no tunable keys) and the five-language README parity requirement.
- Day-to-day maintenance is assisted by DeepSeek Harness agents (they hold no GitHub account and are listed here for transparency, not as contributors).

## PerryLink DSH Plugin Family

This project is one of the **87 actively maintained** DeepSeek Harness plugins from [PerryLink](https://github.com/PerryLink). The family roster is **95** plugins in total — **5 frozen**, **3 retired** — and stays collapsed below so every README keeps a short first screen. Expand it to see every row, with the reason in the Status column.

<details>
<summary>Expand all 95 plugins</summary>

| Plugin | One-liner | Status |
|---|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** | 水产养殖投入品记录核对（按投入品用量、休药期与起捕间隔核对记录自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** | 档案归档完整性与保管期限核对（依据《档案法》及配套规定，仅提示差异，不作出定性结论） |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** | Second-model auto-review on the approval chain, fail-closed by default |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | Automatic strong/cheap model-tier routing with deterministic risk guards and a `/tier` command |  |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | Durable background child agents with a Web UI sidebar, messaging and interrupt | 🚫 RETIRED — see the repo README |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** | 投标文件符合性预检（按招标文件逐条核对响应情况，仅提示差异，不作出定性结论） |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** | 投标人资格条件核对（按资格条件与证明材料核对逐条响应，仅提示差异，不作出定性结论） |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | Cost governance for DeepSeek Harness: budgets, carbon, and latency in one panel. | 🧊 FROZEN — see the repo README |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | Read-only MCP server exposing the certification registry: grades, snapshots and five-dimension evidence |  |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** | Claude Code /rewind-equivalent: snapshots, session forks, one-shot restore |  |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | Migrate Claude Code sessions, memory, skills and CLAUDE.md into DSH | 🧊 FROZEN — see the repo README |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** | Cross-platform native desktop control for DeepSeek Harness — Windows first. |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** | Terminal-style input history for the web composer: arrows, Ctrl+R search |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** | 合同条款立场台账核对（按立场、风险等级与退让底线核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** | 报关单证一致性核对（按公开的报关单填制规范核对单证间字段一致性，仅提示差异，不作出定性结论） |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** | Dataset quality checks and citation cross-checks (the optional numeric bridge consumed here) |  |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | Prompt-injection, jailbreak, and secret-leak defense for DeepSeek Harness. | 🧊 FROZEN — see the repo README |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** | 滞箱费台账核对（按免箱期与费率核对超期天数与金额的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** | Engineering-discipline guard: requirements grill, test gates, adversary review |  |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | Unified static-image generation routing for DeepSeek Harness. | 🧊 FROZEN — see the repo README |
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
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | Multi-channel approval/question bridge: WeChat/Telegram/Feishu, session console | 🧊 FROZEN — see the repo README |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** | 维修工单结算核对（按项目金额、配件工时合计与结算总额核对算术自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** | Verifiable research-report engine: content-addressed evidence ledger and sealed versions |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** | 审稿意见逐条回应覆盖核对（按意见与回应一一对应核对覆盖完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** | 规则库文件自检核对（按条款引用纪律与效力上限核对规则库自身合规，仅提示差异，不作出定性结论） |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** | 安全技术交底记录要素齐备性与签字闭环核对（依据公开的安全生产法规与检查标准，仅提示差异，不作出定性结论） |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** | Multi-dimensional quality scoring for DeepSeek Harness plugins. |  |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | Pin sessions in the Web sidebar with durable ordering | 🚫 RETIRED — see the repo README |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** | Cross-device session sync for DeepSeek Harness — a dedicated git mirror of your session store. |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** | 监理日志跨日连续性与旁站覆盖提示（依据 GB/T 50319-2013 等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** | Security-audit skill pack: secret scan, dependency and supply-chain review |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** | 三重一大决策台账核对（按前置研究、会议审议与决议记录核对程序留痕，仅提示差异，不作出定性结论） |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** | 土壤与地下水监测台账核对（按点位、监测项目、限值与超标判定核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** | 作业规程与 FMEA／控制计划一致性核对（按编号与版本核对三份文件是否同步，仅提示差异，不作出定性结论） |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** | 控制图常数与过程能力指数核对（按 GB/T 4091 的常规控制图常数表核对控制限与 Cp/Cpk 的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** | Voice-first session loop for DeepSeek Harness: talk to it, hear it answer. |  |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | Cross-session team rooms: shared message bus, task board and timeline | 🚫 RETIRED — see the repo README |
| **[dsh-tender-extract](https://github.com/PerryLink/dsh-tender-extract)** | 招标文件条款摘录核对（按出处与原文逐字核对摘录完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-tender-matrix](https://github.com/PerryLink/dsh-tender-matrix)** | 评标因素评分矩阵核对（按分值上限与合计核对矩阵自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** | Isolated install-and-smoke test drives for DeepSeek Harness plugins. |  |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** | TickTick/Dida365 task bridge: session-header panel + 11 tools |  |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** | Vendor parameter translation and deterministic JSON repair for DeepSeek Harness. |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** | 质保期与索赔金额核对（按质保期月数与里程、索赔金额算式核对自洽，仅提示差异，不作出定性结论） |  |

</details>

</details>

</details>

## Disclaimer

Community-maintained, **not** an official DeepSeek product. DeepSeek Harness is in developer preview and ships breaking changes; when in doubt, the official docs in `references/official-docs/` are the source of truth.

### Install from the DSH Desktop Market

All PerryLink plugins are browsable in the built-in DSH Desktop Market: **Market → Sources → add source → paste** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ select it**. Installation still goes through the Market's npm-identity verification and your confirmation.

## License

[Apache License 2.0](LICENSE) © 2026 dsh-plugin-guide contributors — our own text (`SKILL.md`, `guide/`, `references/`, `scripts/`, this README) is Apache-2.0; bundled third-party content is documented in [NOTICE.md](NOTICE.md).
