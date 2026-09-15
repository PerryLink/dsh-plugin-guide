# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.13] - 2026-09-15

### Added

- `guide/unfixed-issues.md` grows from 26+4 to 31+7 items with the third verification batch (all parent-verified against `c291e7961a`): #27 history read path defaults to `recoverable` and silently truncates seq-gapped/corrupt rows (`session-persistence-jsonl/src/index.ts:915`, `format.ts:401-410`; #6562 #3631); #28 unguarded projection reads after v0→v3 migration (`session-turn-outline:110,113,119`, `session-stats:174`, `session-telemetry/coordinator.ts:270`; #6686); #29 http-proxy leaks undici's `[::1]` into child `no_proxy` env, crashing httpx MCP servers (`policy.ts:33`, `install.ts:79-92`; #6655); #30 pasted images hold a lazy File snapshot that dies under cross-device clipboard sync (`service.ts:73-80,124-135`; #6673); #31 web-fetch NAT64 discovery is unguarded when no DNS64 exists (`network.ts:90-93,113-134`; #6664). #14 now carries the 0.1.2→0.1.5 inject regression bisect (tags `dsh-v0.1.2-rc.1`/`dsh-v0.1.5-rc.2`; #6681); #22/#23 gain the #6671/#6672 discussions. Secondary S5–S7: stale `cordis_mount/inspect/unmount` skill names (#6679), no SIGTERM drain / 5s hardcoded grace / no `dsh restart` (#6665), unmerged LLM egress-timeout fix with http-proxy-owned global dispatcher (#5673).
- `guide/unfixed-issues.md` §4 design/misconception table gains 9 rows: required `description` on bash/run_code (#3874), session-local GUI token accounting with separate subagent logs and no cost fuse (#6688), existing-but-undocumented `skill-filesystem` `watch: false` (#6674), headless one-shot with no resume (#6677), fork-not-rewind semantics (#6652), `reasoningEfforts`→`thinkingLevelMap` for custom providers (#1058), stale-artifact rebuild diagnosis (#5622), and the lifecycle-first compaction node model with a render-only visibility gap (#6675).

## [0.3.12] - 2026-09-13

### Added

- `guide/unfixed-issues.md` grows from 20 to 26 primary items with the second community batch, all parent-verified against `c291e7961a` and mirrored in [discussion #6520](https://github.com/deepseek-ai/deepseek-harness/discussions/6520): #21 todo panel lost after an interrupted turn (`tool-todo/src/index.ts:134-145`, stateVersion 2→3); #22 compaction threshold computed over the full window (`compaction-basic/src/config.ts:20,144`); #23 overflow compaction retains zero tokens (`compaction-basic/src/index.ts:284-292`); #24 tool-result pruning runs before range selection (`index.ts:285-289,309-317`); #25 pre-compaction reasoning is not re-sent (measured evidence); #26 token-meter CJK underestimate (`llm/token-meter/src/estimate.ts:13`).

## [0.3.11] - 2026-09-13

### Added

- New `guide/unfixed-issues.md`: source-verified index of bugs still unfixed on the official master baseline `c291e7961a` (0.1.5-rc.2 era) — 20 primary + 4 secondary items, each with `path:line`, workaround, and links to the original discussions; plus a "fixed on master" section (with fixing commits) and a "by-design / common misconceptions" quick table. Companion to the public summary post [deepseek-ai/deepseek-harness discussion #6520](https://github.com/deepseek-ai/deepseek-harness/discussions/6520).
- `SKILL.md` development prerequisites and `guide/links.md` §5 now point to the new index and the #6520 summary post.

## [0.3.10] - 2026-09-12

### Fixed

- The scaffold skeletons now ship `README-<lang>.md` like the rest of the family. Their translations live under `templates/js/` and `templates/ts/` rather than at the package root, so the rename that moved the references did not move the files, and two assertions that spelled the old set with a regex (`/^README(\.\w{2})?\.md$/`) counted one README instead of five — `tests/new.test.ts` and `verify:artifacts` both went red. Both now match the hyphen form, which also makes them a tripwire against a dotted regression. A generated plugin starts out in the layout npm serves correctly.

### Changed

- Rename the four translated READMEs to `README-<lang>.md`. npm selects the package-page readme as the first markdown file matching its `{README,README.*}` glob (`@npmcli/package-json`, publish path), and that glob order puts `README.<lang>.md` ahead of `README.md` — so npm was serving the Simplified-Chinese file for this package too (measured on 15/15 sampled packages of the family). The new names sit outside the glob, so the English source is served again. No content changed apart from the language-switcher link each translation holds to its siblings, and the repo readme gate still passes. Takes effect with the next release; an already-published version cannot gain a corrected readme retroactively.
- Pin the `@deepseek-ai/dsh-*` dev/test dependencies to the published `0.1.5-rc.2` line and record `0.1.5-rc.2` in `dshWorkshop.compatibility.dshVersions`; the monthly Compat workflow now runs against `0.1.5-rc.2`. The peer range `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0` is unchanged, so no supported host line is dropped.

## [0.3.9] - 2026-09-10

### Changed

- `guide/release-engineering.md` (+ `.zh-CN`) section 4 now requires the **tag workflow itself** to create the GitHub Release, not a human: it spells out the idempotent guard, the `contents: write` permission, why the step belongs in a job that `needs:` the publish job, and why a missing CHANGELOG section must degrade to generated notes rather than turn a successful publish red. The pre-tag checklist carries the matching item, and the table row no longer offers "manual" as an option.
- New section 9, **Local tooling that fakes a result**, records four traps that return a confident wrong answer instead of an error: multi-field `npm view` reporting a field that exists as empty, ignore-aware content searches returning false negatives, Windows PowerShell 5.1 writing a BOM from `Set-Content -Encoding utf8`, and `rd /s /q` silently failing to remove a tree that contains a reserved device name. The former section 9 is renumbered to 10; no other section changed.

### Fixed

- The Compat workflow never installed dependencies: both jobs ran `pnpm pack` with no `pnpm install` first, so pack failed with `sh: 1: tsdown: not found` (reported as "node_modules missing") on every run. An `Install` step now precedes `Pack` in both jobs.

## [0.3.8] - 2026-09-10

### Changed

- Pin the `@deepseek-ai/dsh-*` dev/test dependencies to the published `0.1.5-rc.1` line and record `0.1.5-rc.1` in `dshWorkshop.compatibility.dshVersions`; the monthly Compat workflow now runs against `0.1.5-rc.1`. The peer range `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0` is unchanged, so no supported host line is dropped.

### Docs

- Refresh the five-language README compatibility baseline to `dsh-v0.1.5-rc.1` (verified 2026-09-10).

## [0.3.7] - 2026-09-09

### Changed

- Align the `@deepseek-ai/dsh-*` peer ranges to `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0` and pin the dev/test dependencies to the published `0.1.5-alpha.1` line: adaptation to DeepSeek Harness `dsh-v0.1.5-alpha.1` (session format V3, `ctx.agent` removal, `Inbox` type-only interface); runtime behavior is unchanged for every supported host line.
- Record `0.1.5-alpha.1` in `dshWorkshop.compatibility.dshVersions`.

### Docs

- Refresh the five-language README compatibility baseline to `dsh-v0.1.5-alpha.1` (verified 2026-09-09).

## [0.3.6] - 2026-09-07

### Docs

- Fix the DSH plugin badge URL: shields.io rejects the four-segment static badge form with "404 badge not found"; the label now uses the documented double-dash form (`dsh--plugin`), rendering identically; no behavior change.


## [0.3.5] - 2026-09-07

### Fixed

- Align the `@deepseek-ai/dsh-*` peer ranges to `>=0.1.2-rc.1 <0.2.0`: the older `>=0.1.0-rc.8 <0.2.0` band resolved to only the `0.1.0-rc.8` prerelease under registry-driven resolution and broke fresh tarball installs; no behavior change.

### Docs

- Refresh the five-language README support-version wording: the verified GitHub tag `dsh-v0.1.3-alpha.1` now leads the compatibility claim, while npm `0.1.2-rc.1` stays the published dependency-pin line (peers `>=0.1.2-rc.1 <0.2.0`); no behavior change.


## [0.3.4] - 2026-09-04

### Changed

- Align the devDependency pins to the published dsh `0.1.2-rc.1` line and re-sync the official-docs snapshot to the `dsh-v0.1.3-alpha.1` master commit (`d347e703908d0406b7a7ef80e3a0e594d86b2215`, 74-file delta over the previous snapshot); the five-language READMEs and the guide record the rc.1 facts. The shipped verify/check faces keep working against the 0.1.3-alpha.1 checkout (the four smoke surfaces the CLI verifies are unchanged).

## [0.3.3] - 2026-09-02

### Changed

- Align the devDependency pins to the published dsh 0.1.2-alpha.5 line and re-verify the adaptation claims; no behavior change.

## [0.3.2] - 2026-09-01

### Changed

- Upgrade the harness pin to `0.1.2-alpha.3`: the `dsh-attachment` dev dependency and `dshWorkshop.compatibility.dshVersions` move to `0.1.2-alpha.3` (peer range unchanged at `>=0.1.0-rc.8 <0.2.0`), the compat workflow and the CLI verify defaults repoint to the alpha.3 CLI/base/headless, the CLI checker expects `cordis ^4.0.2` / `schemastery ^3.18.2` (both skeletons and the check/template tests updated), the five-language READMEs and guides carry the alpha.3 narrative, and the official-docs snapshot re-syncs to `dd6322d604`.

## [0.3.1] - 2026-08-30

### Changed

- Session-event vocabulary narrative refreshed to the 0.1.2-alpha.1 reality: the `ignorable` envelope is removed and the read path fails closed on unknown event types, so plugin appends of custom events ride an adaptive gate that stops writing on envelope-less hosts. Updated across the five-language quick references, `guide/plugin-dev-guide.md`, `references/harness-repo.md`, and the `references/official-docs` mirror (`AGENTS.md`, `persistence-catalog`, `subsystems/persistence`, `subsystems/session`) to match the host checkout at `cd5ef81481`.

## [0.3.0] - 2026-08-26

### Added

- CI official docs drift probe with SHA-locked freshness check.

## [0.2.0] - 2026-08-23

### Added

- `dsh-plugin-dev` CLI toolchain (`bin/dsh-plugin-dev.js` + tsdown-bundled `dist/`): three mechanical layers over the
  knowledge base.
  - `dsh-plugin-dev new <name>` — parameterized TS/JS plugin repo scaffolder (src/index.ts contract template, Schemastery
    Config, tests, tsdown/vitest, commented cordis.patch.yml, five-language READMEs) kept in sync with `references/official-docs`.
  - `dsh-plugin-dev check` — static checks (cordis.patch.yml validity, package.json metadata incl. `dsh.bundle.patch`
    pointer/peer deps/engines/files whitelist, five-language README consistency, engineering red-line patterns) with
    structured JSON output; every check cites its knowledge-base section (skill linkage).
  - `dsh-plugin-dev verify` — `pnpm pack` then install/start/uninstall the bundle in a clean mkdtemp `DSH_HOME` profile
    (aligned with the official verify:self-contained approach); failures report the log tail plus suggestions.
- Zero-runtime-dependency CLI: only Node builtins; subprocess calls respect timeout + AbortSignal; all temp work happens in
  mkdtemp sandboxes that the CLI cleans exclusively.
- Build/test toolchain: TypeScript (`tsc --noEmit`) + tsdown bundle + vitest (36 tests) + `verify:artifacts` (dogfood
  self-check + scaffold smoke) and `verify:self-contained` (pack → clean-profile smoke) gates.
- `pnpm-workspace.yaml` (single-package root) to isolate this repo from the parent harness checkout.

### Changed

- `package.json`: add `bin`, `exports`, `engines.node` (`^22.19.0 || >=24.0.0`), `packageManager` (`pnpm@11.7.0`), build/test
  scripts, and the `dist`/`bin`/`templates` files-whitelist entries. `typescript` + `tsdown` move into `dependencies` so the
  git-install `prepare` builds the CLI self-contained.
- `cordis.patch.yml`: document every key (`id`, `name`) with comments.

## [0.1.2] - 2026-08-22

DSH 0.1.1-rc.2 compatibility release.

### Changed

- Bump `dshWorkshop.compatibility.dshVersions` to `0.1.1-rc.2`. The `@deepseek-ai/dsh` peer range stays
  `>=0.1.0-rc.8 <0.2.0` because the bundle consumes no rc2-only API.
- Sync the README compatibility tables (five languages) and the CI compat workflow pins to DSH 0.1.1-rc.2.

### Added

- Tag-triggered release workflow (`release.yml`): gate + idempotent npm publish + GitHub Release.

## [0.1.1] - 2026-08-21

DSH rc8 compatibility release.

### Changed

- Bump the `@deepseek-ai/dsh` peer dependency from `0.1.0-rc.6` to `>=0.1.0-rc.8 <0.2.0` and the
  `dshWorkshop.compatibility.dshVersions` entry to `0.1.0-rc.8`.
- Sync the README compatibility tables (five languages) and the CI compat workflow pins to DSH rc8.

## [0.1.0] - 2026-08-15

Initial bundle release.

### Added

- Installable DSH bundle: `package.json#dsh.bundle` (`cordis.patch.yml`) + plain-ESM entry point (`index.js`)
  that registers the knowledge base as the `dsh-plugin-guide` agent skill (directory `resourceBase`, progressive
  disclosure through `./guide/` and `./references/`).
- `package.json#dshWorkshop` (`omdsh-workshop-package/v1`) manifest for DSH Hub Workshop intake.
- Official docs archive (EN/ZH), Cordis primer, 10-chapter development guide, 5-language quick reference,
  community ecosystem reports, and 114-repo community archive scripts.

[0.2.0]: https://github.com/PerryLink/dsh-plugin-guide/releases/tag/v0.2.0
[0.1.2]: https://github.com/PerryLink/dsh-plugin-guide/releases/tag/v0.1.2
[0.1.1]: https://github.com/PerryLink/dsh-plugin-guide/releases/tag/v0.1.1
[0.1.0]: https://github.com/PerryLink/dsh-plugin-guide/releases/tag/v0.1.0
