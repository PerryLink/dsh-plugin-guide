# Changelog

## [0.3.39] - 2026-10-19

### Fixed

- README now has 24 sections after the license heading normalization; update `data/facts.json` so `check-facts` is green.

## [0.3.38] - 2026-10-19

### Fixed

- Refresh `data/facts.json` to the 2026-10-18 official-docs snapshot (687f282, 481 md, 238 zh pairs), README sections 23, and the 0.2.1-rc.2 host tags; `check-facts` is green again.

## [0.3.37] - 2026-10-19

### Fixed

- **`verify` defaults now target the current `0.2.1-rc.2` harness line (issue #14).** `VERIFY_BASE_SPEC` / `VERIFY_HEADLESS_SPEC` and the compat workflow were still pinned to `0.2.1-alpha.2`; the smoke gate already accepts `TRANSPORT:` and `MISSING_CREDENTIAL`. The defaults and compat pin are now `0.2.1-rc.2`.

## [0.3.36] - 2026-10-19

### Docs

- Refresh `references/official-docs` to deepseek-harness `master` `687f282e8625c6b8d11ff58211a90524be2e4317` (docs/: 481 md, 238 .zh.md pairs). The powershell sync script was replicated with `git archive` because pwsh is unavailable on this host; `check-docs-drift-detail.mjs --checkout /home/yy/deepseek-harness` reports FRESH. Closes the docs-drift reports #12/#13/#15.

## [0.3.35] - 2026-10-18

### Changed

- Add a 1280×720 hero and a 960×540, 4-second terminal GIF rendered from the test run; `screenshots.json` is an object array and `capture.json` records the command.

## [0.3.34] - 2026-10-18

### Changed

- Compatibility: declare `engines.dsh` `>=0.2.1-0 <0.3.0`; devDependencies to `0.2.1-rc.2`; add `@deepseek-ai/dsh-working-directory`; `dshVersions` includes `0.2.1-rc.2`.

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.33] - 2026-10-13

Closes the last of the audit backlog: the version-adaptivity gap, a drift probe that says *what* changed, a single home for the numbers this project states about itself, and the CLI positioning question the audits raised but left open.

### Added

- **`dsh-plugin-dev seams` — a machine-readable answer to "does this API exist in my target host?"** `guide/version-matrix.md` gives capability introductions at package/path granularity and says so, which is honest but does not answer the question authors actually ask. `seams <query>` resolves a seam id (`L3`), a capability id (`A20`), a version, or any word against `data/seams/index.json` (19 `L` corridor seams, 6 mechanism seams, 22 capability areas, each with its official source); `seams --since <version>` lists every recorded breaking change landing after a version you target and marks which ones static inspection cannot see.
  - **The third state is mandatory.** An unmatched query exits **3** and states that this is an absence of evidence in the knowledge base, *not* evidence the API is absent from the host. Nine of the nineteen corridor seams are recorded `detectable: false` with the reason (data loss, runtime state, deployment-dependent behaviour), so nothing built on this data can report them as passing. This mirrors the verdict discipline in `guide/family-toolchain.md` §2.1.
  - A version-comparison bug found while testing would have made `--since <anything>` return the **entire** index — the most dangerous possible failure for this command, because it reads as "everything changed for you". The pre-release pattern required a dot inside the counter, so `0.2.1-alpha.2` ranked as `NaN`, every comparison against `NaN` is false, and the filter passed everything. An unparseable target now returns an empty list rather than everything.
- **`scripts/check-docs-drift-detail.mjs`** — answers *what* changed, which `check-docs-drift.ps1` never did. It compares the pinned commit's tree against the upstream head's tree and lists added, removed, and modified paths inside the mirror's exact scope. A drift report that names no file is why the weekly job could sit red without action; the workflow now opens an issue containing the file list.
- **`scripts/check-facts.mjs` and `data/facts.json`** — one home for the numbers this project states about itself, with 13 machine-checked assertions (mirror page and zh-pair counts counted independently, README section and bullet counts, `guide/` and `references/` inventories, CLI check count, corridor seam and capability counts, and that a CHANGELOG section exists for the shipped version). This is the defect class the audits kept finding: the roster was written four ways, the pitfall list was "30+" in English and "20+" in three translations, and the mirror was "215 pages" long after it reached 429.
- **`references/cli-positioning-decision.md`** — the audits asked whether the 16-check CLI is a weaker duplicate of the 33-check `dsh-plugin-doctor` and should be cut. It records the measured facts on both sides, why the answer is "keep, with a fixed division of labour", and the three conditions that would reverse it.

### Fixed

- **A shipped file that no gate would have caught.** `data/seams/index.json` was missing from `package.json` `files[]` while the new `seams` command already read it at runtime: the command worked from the source tree and would have failed for every installed user. `verify-artifacts.mjs` now asserts that every runtime input is declared in `files[]`, and exercises the built bundle rather than the source tree.
- **Two audit figures were wrong and are corrected.** The audit claimed 14 of 19 corridor seams are statically detectable; counting the records gives **10 detectable and 9 advisory-only**, and `references/` holds **10** documents rather than 9. Both were written into `data/facts.json` from the audit before `check-facts.mjs` caught them — which is the point of having it.

### Changed

- Attach the packed tarball to each GitHub Release. npm reports downloads only as a rolling total through the registry API, so a release asset is the only public per-release download figure this package can show.
- `check:readmes`, `check:parity`, `check:facts` and `check:ps1-bom` are documented in the Development block of all five READMEs.

### Verification

typecheck 0 errors · **80 tests** (was 64) · `verify:artifacts` OK including four new shipped-surface assertions · readme-sync OK · translation parity 0 drift · `check-facts` 13 assertions OK · dogfood `check` 14 passed / 0 warned · `verify-kit.ps1` `VERIFY-OK` on PowerShell 5.1 · `seams --since` ordering verified (25 / 22 / 0 changes for three targets, unparseable → 0).

## [0.3.32] - 2026-10-13

Publishes the evidence behind the mirror-scope decision, and corrects two numbers in it.

### Added

- **`scripts/measure-mirror-references.mjs`** — the measurement that `references/mirror-scope-decision.md` cites, shipped with the package so the conclusion is reproducible by anyone who reads it rather than resting on a one-off script. It reports how many offline-mirror files are reached by an exact path, by a declared directory glob, by basename, or by nothing at all.

### Fixed

- **Two figures in the mirror-scope decision were from an ad-hoc run and did not match the shipped script.** Re-measured: 79 files (2.29 MB) are named by exact path, 617 (20.10 MB) are reached only through a directory glob the knowledge base declares, 5 (0.04 MB) by basename, and **3 (≈4 KB) by nothing** — the last figure is the one that matters, because it is the entire set a "drop the unreferenced content" policy could safely remove. The document now also states the matching rule that produced the original audit's wrong "~80% unreferenced" figure: a glob only covers a path when the glob directory is a **prefix** of it. Matching a directory name appearing anywhere inflated the unreferenced set enormously.

### Verification

typecheck 0 errors · 64 tests · readme-sync OK · translation parity 0 drift · dogfood `check` 14 passed / 0 warned · `measure-mirror-references.mjs` reproduces the numbers in the decision document.

## [0.3.31] - 2026-10-13

Works through the rest of the backlog the eight audits produced. Two of these are corrections to claims this repository makes about other people's projects, which is the category where being wrong matters most.

### Added

- **`guide/plugin-dev-guide.md` §4.9 — how a plugin ships a skill.** This was a genuine capability hole: the guide named the wrong mechanism for it (a systemPrompt section plus a tool registration), while this package's own `index.js` is a working implementation of the real one. The section now gives the contract (`ctx.skills.register()` with a `SkillRegistration`, registered synchronously inside `apply`, returning a Cordis disposer, plus a directory `resourceBase` so relative paths resolve), a copy-pasteable implementation, and the four measured traps — including the CRLF one that silently replaced the trigger description. It also states when to prefer a skill over a tool: a tool costs tokens on every request, a skill only when the model selects it.
- **`references/mirror-scope-decision.md`.** Records that the audits' headline recommendation — drop unreferenced mirror content to save ~80% of the package — **does not survive measurement**. Re-measured properly: of 708 mirror files, 73 are named by exact path, **623 are covered by directory globs this repository itself declares** in `SKILL.md` and the guides, and exactly **3** (≈4 KB) are genuinely unreferenced. The 14 MB of historical `*.schema.json` that looked like the biggest win sits under `docs/persistence-changes/**`, a glob the KB advertises. Deleting them would silently narrow a promise the KB makes, which is the same class of defect the audits were about. The document gives the two real alternatives (ship the mirror outside npm, or fetch on demand) and notes both require changing `SKILL.md`'s stated guarantee first.
- **`scripts/check-readme-parity.mjs`** — a block-level translation gate. `check-readme-sync.mjs` only compared `## ` headings, which is why four translation families had drifted unnoticed: es/pt/hi were missing four "What you get" entries (including the flagship version-adaptivity document) and four "Knowledge base" rows, and their quick references still said "215 pages" against an actual 429. The new gate compares section count and the number of bullets/table rows/code blocks per section, keyed by ordinal so translated headings are not reported as drift. **All eight translation files now report zero drift** (131 entries before).
- `tests/skill-sections.test.ts` asserts every CLI check's knowledge-base citation resolves to a heading that actually exists and carries the cited text.

### Fixed

- **Two CLI checks enforced rules the knowledge base never stated.** `redline-persona-role` cited `SKILL.md §边界` and `redline-async-apply-registration` cited a §3.3 that said nothing about it — the "every check links back to a readable section" promise was partly vacuous. Both rules are now written where they belong: the async-`apply` registration ordering (`§3.3.1`, with the failure mode spelled out — registering after the first `await` lands in an unload window, so the contribution is neither recorded nor reported) and the injected-prompt paragraph rule (`§3.7` item 6, explicitly labelled engineering hygiene rather than an official gate, because the official docs have no such rule). Eleven further citations were corrected: `manifest-files` pointed at §7.1 whose heading had become a different topic, and six more cited heading text that no longer existed.
- **Two shipped research reports taught removed mechanisms as current**, because they are point-in-time snapshots with no baseline header. `harness-repo.md` presented `source: { kind: 'plugin' }` (rejected at message admission since session format V4), config `mode: native | code | both` (`both` is now refused), and per-package `./invariant` (the whole runtime-invariants mechanism was removed) as live API; `website-pages.md` advertised `DSH_TOOLS_MODE=both`. Both files now carry a baseline declaration with a row per removed mechanism, and each of the four sites is marked in place so a reader who jumps straight there is warned. The guide's own red-line #3 also claimed "runtime invariants assert this" — enforcement that no longer exists.
- **Two deep-dived repositories are unlicensed, and were quoted and reproduced in full.** `omdsh-dev/dsh-plugin-dev` and `omdsh-dev/fabric` (which now redirects to `stent`) both have `license: null`; §1.2 and §1.8 reproduced their package manifests, source snippets and verbatim prose, and shipped an install command for a repository that no longer exists under that name. Both sections are rewritten as attribution-safe summaries that keep the technical findings and link upstream, with an explicit licence banner. `community-repo-deep-dive.md` carries the same banner, listing the three removed mechanisms its examples still use.
- **Task routes for three topics that were named but not actionable.** Slash commands, permissions/approval/sandbox, and context/compaction/performance now point at their exact official pages. Every documentation path referenced by `SKILL.md` is verified to resolve (26 paths); one earlier draft of this change cited `docs/subsystems/context.md`, which does not exist — the page is `docs/cordis-api/context.md`.
- **`check-readme-sync.mjs` compared heading text**, so it would have rejected any translation that localised a heading while ignoring exactly the drift that had occurred. It now owns section count and configuration keys; structure is the parity gate's job.

### Changed

- **The README first screen now leads with what the plugin does and how to install it.** It previously opened with a third-party 1024-store wrapper command and put the real `dsh plugin --profile web add dsh-plugin-guide` 137 lines down. It now opens with the positioning ("Your agent stops inventing DSH plugin APIs"), the install command, and a "Why not just read the official docs?" table naming the three gaps — which version you target, what a release breaks, and whether your plugin is correct.
- **The Quick start leads with the npm channel.** It previously led with the git channel, whose install cannot work on a first try: `dist/` is not committed, so pnpm must run `prepare` and pnpm 10+ blocks that until the build is allowlisted. The npm channel ships `dist/` and needs no build. The git channel now documents the block instead of hiding it.
- The four translated READMEs gained the missing "What you get" and "Knowledge base" entries, the new first-screen section, and the install fence, in their own languages. They keep English `## ` headings, matching the existing convention.

### Verification

typecheck 0 errors · **64 tests** (was 61) · `verify:artifacts` OK · readme-sync OK · **translation parity 0 drift** · ps1-bom OK · dogfood `check` 14 passed / 0 failed / 0 warned · `verify-kit.ps1` `VERIFY-OK` on PowerShell 5.1 · all 26 documentation paths in `SKILL.md` resolve.

## [Unreleased]

### Changed

- **The Contributors section of all five READMEs now credits the product manager.** [@Yisa-yi](https://github.com/Yisa-yi) is listed as **product manager**, with the shape of the product rather than its code: the installable-bundle + on-demand-agent-skill form (with the docs site rendering the same sources rather than a separate content set), the 10-chapter information architecture, the "every fact links to its origin" rule, the split between the cognitive layer (`SKILL.md` + `guide/`) and the mechanical layer (`dsh-plugin-dev new / check / verify`), the evidence standard behind `guide/unfixed-issues.md` (`path:line` against a named host commit, a design-vs-bug table, an explicit unreproducible section), the freeze/retire criteria in `guide/when-to-retire-a-plugin.md`, the scope line (read-only, no network, no model calls, no tunable keys), and the five-language README parity requirement. One bullet was added to each of the five files, so `check:readmes`, the block-level `check:parity` gate and the `data/facts.json` README assertions are all unaffected. `llms-full.txt` regenerated, as `scripts/build-llms-full.mjs` requires after any edit to a source document.

### Fixed

- **The publish-verification step added in 0.3.30 failed every release, so the GitHub Release was never created — while npm published correctly.** The step read its expected version from a `github.*` expression, `VERSION: ${{ github.ref_type == 'tag' && github.ref_name || '' }}`. GitHub evaluates that to the boolean `false` and renders it as an empty string, so the check compared the served version against `''` and reported `version 0.3.30 != ` after the poll had already succeeded. Both the version and the commit under test are now read from files the step already has (`package.json` and `git rev-parse HEAD`), and the dist-tag step derives the package name from `package.json` instead of hardcoding it. Re-verified against the real published `0.3.30` manifest (passes, and a deliberately wrong expected version is still rejected).

  This is worth recording because of how it failed: it is a false *negative* introduced by the very check meant to prevent false *positives*. The 0.3.30 publish itself was completely successful — `dsh-plugin-guide@0.3.30` is served with SLSA provenance and `gitHead` matching `2e6cc49` — but the run went red and `release` was skipped, so no GitHub Release exists for 0.3.30. It is also a reminder that `npm publish`'s own success is the only signal that matters here: the pink run did not mean the package was missing. Nothing in the published artifact is affected; `.github/workflows/` is not shipped.

## [0.3.30] - 2026-10-13

Eight parallel audits of this plugin's own design — runtime/agent integration, token and install footprint, content consistency, CLI hardening, release durability, forward compatibility, mirror cost/benefit and licensing, and adoption — converged on one root cause: **this pipeline had several places where the local checkout and the published artifact disagree, and no gate checked any of them.** Three instances were shipping defects; all are fixed here, each with the test or gate whose absence allowed it.

### Fixed

- **A CRLF checkout silently downgraded the skill.** `index.js` guarded its YAML frontmatter parse with an exact `startsWith('---\n')`, but the repository had **no `.gitattributes`** and inherited `core.autocrlf=true`, so a Windows checkout delivered CRLF while CI and the npm tarball delivered LF. On CRLF the guard failed and the plugin registered (a) its **generic fallback description** instead of the 355-character frontmatter text that decides when the host loads the skill, and (b) the **raw file including the YAML frontmatter** as the skill body. Measured: working tree 97 CRLF → fallback; git blob and published tarball 97 LF → correct. The same guard was duplicated in `src/cli/commands/check.ts`, where it made `redline-persona-role` judge the frontmatter's `name:` line as the opening paragraph — the persistent false warning that every local `check` run had been printing. Both parsers are now line-ending-agnostic, `.gitattributes` pins `eol=lf`, and `tests/entry.test.ts` exercises the entry point under both endings. That file is the first test `index.js` has ever had: `verify-artifacts.mjs` only ever exercised `dist/`, `bin/` and the scaffold, which is why a defect in the shipped entry point could survive. A hand-written `index.d.ts` brings `index.js` into the type program so `tsc` sees it too.
- **`verify-kit.ps1` could not run on Windows PowerShell, and it is the release gate.** Of nine scripts under `scripts/`, eight carried a UTF-8 BOM and parsed with zero errors under the 5.1 parser; `verify-kit.ps1` was the only one without a BOM and the only one failing — **5 parse errors at HEAD** (`Missing ')' in method call`), because 5.1 decodes a BOM-less script as ANSI and its ~1.6 KB of Chinese comments corrupt the source. CI never noticed because it runs the script under `pwsh`, where the BOM is irrelevant. This also settles a recorded contradiction: `references/sources.md` says `scripts/*.ps1` **must** keep a BOM, and a prior audit read the file's missing BOM as evidence for the opposite convention. The file now has it and **runs on 5.1 with `VERIFY-OK`, exit 0 (82 critical paths)**. A new portable guard, `pnpm run check:ps1-bom`, fails CI if any non-ASCII script loses its BOM again.
- **`new --lang js` failed this tool's own `check`.** `manifest-files` demanded that `files` contain a `lib` or `dist` directory unconditionally, but a plain-JavaScript plugin ships its entry at the package root and has no build step at all — so the scaffolder and the checker disagreed on the golden path, and `new --lang js && dsh-plugin-dev check` exited 1. The rule now requires an artifact directory only when `main` actually points into one. `verify-artifacts.mjs` previously scaffolded each language and checked the files existed, but never ran `check` against them; it now round-trips both, which is the assertion whose absence allowed this.
- **A mistyped flag turned the checker into a no-op that still reported success.** `parseArgs` accepted any `--whatever` and ignored it, so `dsh-plugin-dev check --stirct` skipped the strict pass and exited 0 — a CI gate that a spelling mistake can disable while staying green is worse than no gate. Every subcommand's flags are now declared as a single allowlist, an unrecognised flag is a `UsageError`, and `main()` maps that to exit code 2 per the documented contract. `tests/args.test.ts` covers the typo, the `--key=value` form, unknown short flags, and the unnamed error message.
- **The npm `description` was truncated mid-word.** It was 272 characters and npm's metadata limit is 255, so every scraper and catalog card inherited `…pack verifier for buil`. Now 189 characters, benefit-first.
- **`README.md`'s compatibility row contradicted itself**, calling the harness pin `dsh-v0.2.1-alpha.2` and the mirror pin `dsh-v0.2.1-alpha.1` in the same sentence — stale after 0.3.29 resynced the mirror. `check:readmes` compares section structure only, so nothing caught it.

### Changed

- **The published package now has zero runtime dependencies.** `tsdown` and `typescript` were in `dependencies` although nothing loads them at runtime (`dist/` is prepacked), which cost every global install 33 packages / ~70 MB / ~198 s, contradicted the README's "zero-runtime-dependency" claim, and made the package ineligible for the store whose auto-admission requires no runtime dependencies. Both moved to `devDependencies`.
- **`SKILL.md` routing corrections.** The UI route named `docs/subsystems/ui-radius.md`, which does not exist — the file is at `docs/ui-radius.md` (the repository's own `guide/links.md` had it right). The CLI section told the agent to run bare `dsh-plugin-dev`, which is not on `PATH` for a bundle install; it now gives the `resourceBase`-relative invocation and the full flag list. The version gate was one-sided (it warned only for hosts *newer* than the mirror) although npm's default install is `0.2.0-rc.2`; it is now a four-row decision table keyed on the `dsh --version` that step 0 itself mandates.
- **Release pipeline: two holes closed.** Nothing asserted that the pushed tag matches `package.json`, so a `v0.3.30` tag on an unbumped tree used to pass the changelog gate, skip the publish as "already published", and open a GitHub Release for a version npm never received — on an immutable tag. And nothing verified the publish afterwards, although the registry answers `PUT` with `202 Accepted`: for 0.3.29 the publish step went green at 13:20:11Z while the version was not readable until 13:22:01Z, a **110-second window** in which the Release page already existed. The job now asserts tag/version agreement, then polls the registry and verifies the served version, `gitHead` against the tag commit, the SLSA provenance attestation, and that `dist-tags.latest` advanced.
- `tests/entry.test.ts` added (8 tests) and `tests/args.test.ts` extended (6 more; suite 47 → 61). `llms-full.txt` regenerated.

### Known gaps (from the same audits, not yet addressed)

- **The mirror is 96.8% of the published package** (717 files / 22.91 MB of 23.66 MB unpacked). Measured: only **71 of 441** mirror pages are named by a resolvable path in the authored docs, **1 of 47** JSON files is ever named, and **0** of the 214 `.i18n.yaml` companions and 4 PNGs are referenced. Dropping only the unreferenced `.i18n.yaml`, the historical `*.schema.json` and the PNGs would save ~80% of the bytes without losing a routed page. Not done here because it trades against the plugin's offline self-sufficiency promise and needs the maintainer to make that call.
- `guide/quick-reference.{zh-CN,es,pt,hi}.md` are read by **no agent path and no CLI path**, and three of them have drifted (missing the flagship version-adaptivity entry; still saying "215 pages" against an actual 429). No workflow gates them.
- `references/*.md` still present two **removed** mechanisms as current (`harness-repo.md:436`, `website-pages.md:538`, and an `invariants` code block in `community-repo-deep-dive.md`), because those research reports carry no "as of `<host line>`" header even though `guide/` cites them as its evidence base.
- Two deep-dived repositories in `community-repo-deep-dive.md` are **unlicensed** (`omdsh-dev/dsh-plugin-dev`, and `omdsh-dev/fabric`, which now redirects to `stent`), yet are quoted at length with reproduced code. Attribution-safe rewriting is pending.
- `guide/plugin-dev-guide.md:359` names the wrong mechanism for shipping a skill inside a plugin, while this package's own `index.js` is the correct reference implementation.

## [0.3.29] - 2026-10-13

Closes the three "Known gaps" recorded in 0.3.28 — and the version-adaptivity layer shipped there now actually reaches the material it points at. 0.3.28 could say *"the 19 breaking changes in `0.2.1-alpha.2` are documented in `version-matrix.md` §3"* while the **official guides for them were still absent from the mirror**, because the mirror was pinned one release back. This release re-syncs the mirror, so every "see the official source" pointer in the knowledge base now resolves against a file that is actually in the package.

### Added

- **`guide/migration-0.2.md` §13 — the `0.2.1-alpha.1` → `0.2.1-alpha.2` corridor as 19 citable seams (`L1`–`L19`).** This was the single biggest structural gap: `dsh-plugin-upgrade`'s corridors stop at `legC` (`0.1.5-rc.2` → `0.1.6-alpha.2`), and the migration guide was the only document covering anything after that — as prose, with no stable seam IDs, so no scanner could reference it. Each row now gives the official item name, the affected surface, **the symptom if you do not fix it**, and the migration step, with the official guide path. Two of them are worth singling out for anyone upgrading: `L8` (`team-direct-inbox`) is a **data-loss** hazard — queued Team messages are never dispatched after the upgrade, so pending sends must be drained *before* it — and `L4` (`working-directory`) makes custom prompts retaining `{{cwd}}` fail *before* a model request is even built. The official directory-name trap is stated in the section header: `v0.2.1-alpha.1/` names the version at which the break was authored, not the version it lands in.
- **`guide/version-matrix.md` §6 — all 22 native capability areas with their introducing release.** Replaces the deliberately-partial table from 0.3.28 with the full set (A1–A22), each with the finer-grained time anchor (first commit / Agent Note date) behind the tag. The method and its limits are stated in the section rather than buried: the "introduced" value is **package/path-level** — the first tag containing the commit that added that path, via `git log --diff-filter=A --reverse` plus `git tag --contains` — so a specific function, config key or service key inside an area may be later. A second sub-table carries the seams that only create rather than break (`ctx.hmr`, `ctx.mcpResources`, `ctx.browserUse`, the new slots, …). The `≤ rc.7` caveat is now explicit: the oldest tag in the checkout is `dsh-v0.1.0-rc.7`, so that value means *"present at the oldest tag"*, **not** *"introduced there"*.

### Changed

- **`references/official-docs/` re-synced from `dsh-v0.2.1-alpha.1` to `dsh-v0.2.1-alpha.2` (`d743267388641bc76f17c45ce8b4c231aed1d32c`).** The mirror moved from 369 to **429** markdown files (212 `.zh.md` pairs, up from 182) and closes the 30 logical pages the 0.3.28 audit found absent — including the whole `docs/upgrade-guide/v0.2.1-alpha.1/` directory whose 19 guides §13 is built from, the late `v0.2.0-rc.2/bundled-python-tests` backfill, `docs/cli-help.md`, five `docs/persistence-changes/` records, and `docs/subsystems/{working-directory,worktrees,translation}.md`. `scripts/check-docs-drift.ps1` now reports `FRESH`. This also removes the last internal contradiction in the knowledge base: the mirror's `docs/session-format-status.md` now reads `latestReleasedVersion: 4` / `evidenceTag: dsh-v0.2.0-rc.2`, matching the resolution 0.3.28 could only describe.
- **The mirror baseline is now stated as a deliberate two-baseline design, not as drift.** `guide/unfixed-issues.md`'s entries pin `path:line` to the *verification* baseline (`5badb15`, `dsh-v0.2.1-alpha.1`), while the mirror tracks *upstream byte-fidelity* (`d743267`). The file's header now says so, tells the reader to check out `5badb15` when re-verifying a line number, and asks that "unfixed" be read as "**unfixed as of 2026-10-03**" until the next full re-verification. A reader hitting a stale line number otherwise has no way to tell a moved line from a wrong claim.
- Doc counts and baseline SHAs refreshed across the five READMEs, all five cheat sheets, `guide/links.md` (whose session-format-status row still advertised the superseded `latestReleasedVersion: 3`), `references/sources.md`, and `references/official-plugin-dev-skill.md`.
- `llms-full.txt` regenerated (712 KB) and the CLI rebuilt.

### Verification

`pnpm run typecheck` clean · 47/47 tests · `verify-artifacts.mjs` OK (including the scaffold assertions for the `{{dshPeerRange}}` and `{{dshBaseline}}` placeholders) · five-README sync check OK · `dsh-plugin-dev check` exit 0 (13 passed, 1 warned, 2 skipped) · `check-docs-drift.ps1` reports the mirror FRESH against `origin/master`.

## [0.3.28] - 2026-10-13

Seven parallel deep-dives into every competing and adjacent DSH plugin-development resource (the `omdsh-dev` organisation, both large handbooks, the authoring-tutorial set, the PerryLink family toolchain, the discovery/marketplace surfaces, the official version line, and this repository's own knowledge base) produced one structural gap and a set of stale claims. The gap: **the knowledge base had no version-adaptivity layer.** The stale claims: the repository's own central correction about peer-range enforcement had been applied to the guide but not to the skill or any of the five cheat sheets, so `SKILL.md`'s "official red lines" block contradicted the CLI's own `manifest-peers` check.

### Added

- **`guide/version-matrix.md` — the version-adaptivity layer the knowledge base was missing.** It answers the four questions a plugin author actually has, of which only the first was previously covered: *which DSH am I targeting*, *what changed and when*, *does this API exist in my target*, and *what peer range should I declare*. Contents: the five different values that all call themselves "latest" (npm `latest` = `next` = `0.2.0-rc.2`, npm `alpha` = `0.2.1-alpha.2`, newest master tag = `dsh-v0.2.1-alpha.2` = master HEAD, and the only one that matters, `dsh --version`); the finding that **there is no stable line** (all 31 npm versions and all 26 GitHub Releases are prereleases, so npm's `latest` tag is not a stability signal); the frozen sub-package `latest` tag trap with a 13-package matrix (`@deepseek-ai/dsh-tools`'s `latest` is still `0.0.1-rc.1`, so a bare install gets an ancient version); the four breaking-change seams rather than a flat chronology; the canonical six-clause peer range and how to pick one per capability used; the session-format lineage V0→V4 (including that **V1 was never released** and that the per-release persistence archive is frozen at `0.1.5-rc.2`, so upgrade guides are the only official history after that); and the **19 breaking changes that landed in `0.2.1-alpha.2`** — `webRuntime`→`webStartup`, `mode: both` now rejected, `backgroundMode`/`run_in_background` removed, `{{cwd}}` removed, two new required `BundleInfo` fields, `dsh plugin --profile` position now enforced, and a Team-mail data-loss hazard on upgrade.
- **`guide/family-toolchain.md` — a router, not more prose.** The repository had grown siblings (`dsh-plugin-doctor`, `dsh-test-drive`, `dsh-score`, `dsh-plugin-kit`, `dsh-plugin-upgrade`, `dsh-plugin-certification`, `dsh-cert-mcp`) without a document saying which one owns which question. It now carries a question → owner → citable-artifact table, the **full 33-check `dsh-plugin-doctor` catalog** (R0–R8, K1–K14, D0–D3/D9, CC1–CC5) with verdict semantics, the degradation and exit-code contracts, the five `dshWorkshop` activation values and the 23-value category enum that no family member publishes, and a crosswalk against this repository's 16 checks. The crosswalk records both directions: five of our checks have no doctor equivalent (`manifest-package-manager`, `display-meta`, `readme-consistency`, `redline-persona-role`, `redline-async-apply-registration`), and `redline-async-apply-registration` is the family's **only** detector for its defect — `dsh-plugin-upgrade`'s `legC` card already names it as the prevention gate for seam E2.
- **`references/dev-resource-landscape.md`** — the competitive map: four similarity tiers (same knowledge base / same agent-skill delivery / same audience toolchain / adjacent), with measured stars and npm weekly downloads, a position diagram, this project's moat list, and an explicit uncertainties section. It records that the six other plugin-development knowledge bases in this tier (top rival 4★) are one to two orders of magnitude behind on usage, and that the real competition is the human-facing tier (`dsh-handbook` 863★) and the directory tier (`awesome-dsh-plugin` 18,588★).

### Fixed

- **"DSH does not validate peer ranges" survived in seven places and is the opposite of the truth.** `CHANGELOG` 0.3.25 corrected the guide (`guide/plugin-dev-guide.md` §7.3) and stated the fix covered six places, but `SKILL.md`, all five `guide/quick-reference.*.md`, and `guide/migration-0.2.md`'s own checklist still carried it — leaving the skill's red-line block contradicting the CLI's `manifest-peers` check. All seven now state the measured behaviour (`dsh plugin add` refuses the install and prints the declared range) while keeping the genuinely declarative part correct (`engines.dsh` is unenforced), and each points at the new version matrix for range selection.
- **`guide/release-engineering.md` taught the peer-range shape its own next paragraph calls wrong.** The example was `">=0.1.2-rc.1 <0.3.0"` — an open range spanning an entire breaking-change generation, which `dsh-plugin-doctor` R8 flags and which installs happily on a 0.2.x host before breaking at runtime. Both language versions now show the canonical six-clause range, with the counter-example called out explicitly.
- **The event dispatch table listed four modes where upstream defines five.** `guide/plugin-dev-guide.md` and all five cheat sheets omitted `bail`, which `references/official-docs/docs/cordis-api/events.md` lists alongside `emit`/`parallel`/`serial`/`waterfall`. The row is added in all six places, with the `serial`-vs-`bail` distinction stated (both short-circuit; `bail` carries the reject semantics of `ctx.bail`).
- **`guide/migration-0.2.md` reported an "open contradiction" upstream had already resolved, and quoted superseded wording.** It presented `docs/session-format-status.md` as still recording `latestReleasedVersion: 3` against a code value of 4; upstream has since updated that file to `latestReleasedVersion: 4` / `evidenceTag: dsh-v0.2.0-rc.2`. The item is now marked resolved, the stale mirror is called out as the thing needing a re-sync, and the version anchors in §1 are re-measured (master tag `dsh-v0.2.1-alpha.2`, npm `alpha` `0.2.1-alpha.2`, and an explicit "no stable line" row).
- **Every `vlln/plugin-registry` citation pointed at an archived repository.** It was archived 2026-10-03, frozen at a 0.1.5 baseline, with its `make-dsh-plugin` skill moved to `vlln/dsh-skills` (0.2.0-rc.2 baseline, 22.7 KB `gotchas.md`). The live-facing citations in `guide/links.md`, `guide/plugin-dev-guide.md`, and `references/community-ecosystem.md` now lead with the successor and keep the archived repo only for the historical mechanism timeline it remains the authority on.
- **All ten scaffold READMEs advertised `Harness | DeepSeek Harness 0.1.7-rc.2`** — two generations stale, with the CLI generator writing the same literal. The version is now a `{{dshBaseline}}` placeholder resolved from a single exported `DSH_BASELINE` constant in `src/cli/templates.ts`, next to the existing `DSH_PEER_RANGE` single-source, so the scaffold baseline can no longer drift from the knowledge base independently.

### Changed

- **`llms-full.txt` now carries the files an LLM reader most needs, which it previously excluded entirely.** The source list omitted `SKILL.md` itself (the contract red lines), `guide/migration-0.2.md`, `guide/version-matrix.md`, `guide/family-toolchain.md`, `references/official-plugin-dev-skill.md`, and `references/dev-resource-landscape.md`. The list is now 21 sources (was 15) and the artifact is 698 KB. `llms.txt`, the hand-maintained index, gains the same entries.
- **`scripts/verify-kit.ps1` now gates the files whose staleness the audit found.** Its `$critical` list omitted eight existing documents, including `guide/migration-0.2.md`, `guide/unfixed-issues.md`, both `release-engineering` variants, and the two `when-to-retire-a-plugin` / `choosing-a-plugin` pairs — so an accidental deletion of any of them would have passed the gate. The new documents and `references/dev-resource-landscape.md` are gated from the start.
- The READMEs' compatibility tables now name `dsh-v0.2.1-alpha.2` as the measured master baseline, state that the official-docs mirror is deliberately pinned one release back at `dsh-v0.2.1-alpha.1`, and point at the version matrix for the 20 breaking-change guides added since.
- `_analysis/` is gitignored: it holds the seven deep-dive reports and their third-party quotations, which are working notes rather than distributable content.

### Known gaps

- `guide/migration-0.2.md` covers `0.1.6-alpha.2` → `0.2.1-alpha.1` and **does not yet absorb the 19 changes in `0.2.1-alpha.2`**; they are documented in `guide/version-matrix.md` §3 and cross-linked from the migration guide's header, but the migration guide is the wrong shape for them (it has no stable seam IDs for that span, and no scanner — the family's `dsh-plugin-upgrade` covers `legAB` and `legC` but nothing after `0.1.6-alpha.2`).
- `references/official-docs/` is one release behind live master (453 of 613 mirrored files byte-identical, 158 stale, 95 live files absent across 30 logical pages). `scripts/sync-official-docs.ps1` closes it; it was not run here because it requires the local `deepseek-harness` checkout.
- The capability-by-version table in `guide/version-matrix.md` §6 is deliberately partial: it lists only rows with a first-party source. The workspace's archived native-capability inventory (~50 seams) is the obvious completion source and is flagged as such in the document.
## [0.3.27] - 2026-10-10

### Changed

- The README now carries the terminal demo and an animated version of it: the same
  real run, shown assembling line by line. The static image stays as the primary
  one, because a crawler or an assistant can read a PNG and cannot read a GIF.

  Both frames are that plugin's own output — the card is generated by running its
  code over its own fixture, not drawn by hand.


## [0.3.26] - 2026-10-06

### Fixed

- **`dshWorkshop.compatibility.dshVersions` omitted `0.2.0-rc.2`, the version npm publishes as `latest`.** 0.3.25 opened the `>=0.2.0-0 <0.3.0` clause in the peer range and the package is installable on that line, but the declared compatibility list still jumped from `0.1.7-rc.2` to `0.2.1-alpha.1` — so a reader on the `latest` line saw itself listed as unsupported by a package that supports it. `0.2.0-rc.2` is now listed; the list is what the market surface reads, so it has to agree with the peer range.

## [0.3.25] - 2026-10-06

Found by scaffolding a real plugin and installing it on a real `0.2.1-alpha.1` host. **Two defects made every TypeScript scaffold unusable, and neither one raised an error anywhere.** 0.3.23 claimed the peer range "already admits the `0.1.7` and `0.2.x` lines"; that was true of this package's own `package.json` and false of `src/cli/templates.ts`, so the scaffolded range stopped at 0.1.x. Both are now fixed and both have a regression guard.

### Fixed

- **The TypeScript scaffold built an entry point its own manifest did not declare, so the plugin installed and then silently never loaded.** `templates/ts/tsdown.config.mjs` ran tsdown with `platform: 'node'`, which forces `.mjs`/`.cjs` extensions, so the build emitted `lib/index.mjs` + `lib/index.d.mts` while the scaffolded `package.json` declared `main: lib/index.js` + `types: lib/index.d.ts`. Nothing failed: the build succeeded, install succeeded, and the loader simply resolved `main` to a path that did not exist. Fixed by adding `fixedExtension: false` to the template config — the same flag, with the same reasoning, that this repository's own `tsdown.config.ts` already carried. Guarded by a new offline check in `verify-artifacts.mjs`, which asserts the flag rather than running an install and build (the artifact gate stays network-free).
- **The canonical peer range stopped at 0.1.x, which made the plugin uninstallable on a 0.2.x host.** `DSH_PEER_RANGE` in `src/cli/templates.ts` was `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0`, so the four-clause form's newest comparator sat on the 0.1.7 tuple and semver's prerelease rule rejected every 0.2.x version. Because semver keys that rule on the exact `[major, minor, patch]` tuple, admitting the line needs **one clause per tuple**: the range now ends `|| >=0.2.0-0 <0.3.0 || >=0.2.1-0 <0.3.0`, matching `dsh-plugin-kit/data/peer-range.json`. The same stale constant also generated the checker's *expected* value, so `dsh-plugin-dev check` reported a **correctly widened** plugin as a failure — the checker and the runtime disagreed, and only the runtime was right.
- **`dsh-plugin-dev verify` pinned a harness line the compat workflow had already left.** Its `--base`/`--headless` defaults were `@deepseek-ai/dsh-base@0.1.7-rc.2` and `@deepseek-ai/dsh-headless@0.1.7-rc.2` while `.github/workflows/compat.yml` installs `0.2.1-alpha.1`. Since `dsh` enforces compatibility at install time, `verify` failed on every newer host with an error naming the *base bundle* instead of the plugin under test. Both defaults are now exported constants pinned to `0.2.1-alpha.1` and asserted against `compat.yml` in `tests/verify.test.ts`, so the two cannot drift apart silently again.
- **The keyless headless smoke asserted an isolation it does not have.** `verify` sets `DSH_HOME` to a mkdtemp directory and treats `MISSING_CREDENTIAL` as proof the tree loaded, but credentials are not resolved per `DSH_HOME` — they come from the OS credential store. On a keyed host the run therefore reaches the provider and dies there, and the step failed even though the tree had loaded and the turn had dispatched. `isSmokeOk` now also accepts the provider-layer failures that only occur *after* dispatch (`TRANSPORT:`, `UNAUTHORIZED`, invalid-key). A plugin that never mounted still produces no provider traffic, so it still fails.

### Changed

- **Corrected the guide's central claim about peer-range enforcement, which was wrong in six places.** `guide/migration-0.2.md` and `guide/plugin-dev-guide.md` stated that DSH does not validate peer version ranges and that a declared range "is documentation intent, not a load-time gate". Measured on `0.2.1-alpha.1`, the opposite holds at install time: `dsh plugin add` compares the runtime version against the declared `@deepseek-ai/dsh-*` range and **refuses the installation** with `installation rejected: Plugin <pkg> is incompatible with dsh <version>`. The passages now distinguish the two mechanisms — `engines.dsh` really is declarative and unenforced, `peerDependencies` are enforced at install time — and each points at §7.3.
- **Documented the version-exemption mechanism, which the KB did not mention at all.** `dsh plugin --profile <p> version-exemptions` / `allow-version <pkg@version> --dsh-version <runtime> --accept-risk` / `revoke-version`, with the fact that an exemption is an **exact `<package@version> × <host version>` pair** rather than a range, so it must be re-granted after a host upgrade. `guide/plugin-dev-guide.md` §7.3 now carries all three commands, the verbatim rejection message, and the advice to put them in a README troubleshooting section: it is the only way a user can recover from a refused install.
- `llms-full.txt` regenerated, as `scripts/build-llms-full.mjs` requires after any edit to a source document.

## [0.3.24] - 2026-10-06

### Added

- The five READMEs gain a **Release channels** section: which surface is the source of truth for each distribution channel and how it updates. It records that npm is published by `.github/workflows/release.yml` on a `v*` tag (verify-kit gate → CHANGELOG section check → `npm publish --provenance`, skipped when the version exists), that the GitHub Release comes from the same idempotent workflow, that the discovery badges are live lookups needing no publication, that **Gitee is a read-only scheduled mirror** which is force-aligned to the GitHub tip by the family's `gitee-sync` workflow and never receives a tag from this repository, and that the Desktop Market and the 1024 store install from npm so a published version needs no per-version submission.

### Changed

- Published to make the section above part of the artifact: `README*.md` are inside the npm `files` whitelist, and npm metadata is immutable, so documenting the release channels in the repository alone would leave the shipped copy and the repository disagreeing.

## [0.3.23] - 2026-10-06

Re-verified against the newest official master `5badb15009ae1756c3afe0ae0cef1faafc290ccc` (`dsh-v0.2.1-alpha.1`, 2026-10-03; +2300 commits over the previous baseline `ddefc45`, 8763 changed files). This release closes the 0.1.6-alpha.2 → 0.2.1-alpha.1 gap: the **whole 0.1.7 and 0.2.x lines were undocumented** in the knowledge base before it.

### Added

- **`guide/migration-0.2.md` — the migration guide for plugin authors.** Every breaking change between `dsh-v0.1.6-alpha.2` (the old baseline) and `dsh-v0.2.1-alpha.1`, each with its official source: session format V3→V4 (tool-role messages, producer-owned `source.kind`, `developer/message`, `turn/end.reason: forked`, forbidden `request/header.system`; writer bumped at `c36a83ff6b` = `dsh-v0.1.7-alpha.1`), the settings rebuild (`dsh-settings-file` deleted, `ctx.settings` = `SettingsForms`, `Volatile<T>` + `loader/volatile-update`, `settings.plugin.item` → `settings.plugins.tab`), runtime invariants removed everywhere, `messageSource` losing the catch-all `plugin` kind, `readBytes` replacing `readAll`/`readRelated`, the new client slots, the `plugins.bundle.*` / preset forking, `dsh.bundle.patch` accepting an ordered array, and the 0.2.1 breaking pair (invariants + composer `stats` split into `activity`/`usage`). Includes a 12-item upgrade checklist and an explicit conflicts/unverified section.
- **`references/official-plugin-dev-skill.md` — the official in-repo plugin-development skill, distilled.** DSH now ships `cordis-plugin-development` (+ five references, two templates) inside `packages/preset/agent-preset/skills/`. The file captures the official workflow (author a bundle in the workspace → `plugin_manager install_bundle` with an absolute directory → `cordis_inspect_query`), the explicit prohibitions (never hand-write the profile `package.json`/`cordis.patch.yml`, never run pnpm in a profile), the display-metadata checklist, the extension-point strength ordering, the six practice principles, the performance rules (session projections, durable events, no `agent.status` polling), the UI rules (no iframe, theme tokens only, never `require` Harness Client packages), and the `app.asar` reading limits on Desktop.
- **Display metadata is now a first-class deliverable.** `templates/ts` and `templates/js` scaffolds ship `locale/en.json` + `locale/zh.json` (`meta.title`/`meta.description`), an `icon.svg`, matching `exports` (`./locale/*.json`, `./icon`) and a widened `files` list; the bundles themselves (this package included) gain `locale/*.json` + `icon.svg`. `dsh-plugin-dev check` gains a `display-meta` check (locale export + English fallback + `meta.title`/`meta.description` + icon format/size/containment), and `dsh-plugin-dev check` now accepts an **ordered `dsh.bundle.patch` array** and reports each missing member.
- `guide/plugin-dev-guide.md` §4.7 (new tool hooks: `projectContent`, `deferLoading`, `ask.displayReason`), §4.8 (plugin UI and performance hard rules), §7.0.1 (display metadata and icons), §9.1 (version compatibility and migration), plus new §2.1 channel 3 (the in-session `plugin_manager` install path) and the `dsh-hmr` patch-write hazard.
- `guide/links.md` §2.1: the pages that exist **only** in the repository and never reach the documentation site — `session-format-status.md`, the index-less `upgrade-guide/**`, `persistence-changes/**`, `ui-radius.md`, `web-styling.md`, `module-graph.md`, and the in-repo plugin-development skill.
- `guide/unfixed-issues.md` §3: eleven newly verified community issues (T1–T11) with source or shipped-artifact anchors — including the destructive live `cordis.patch.yml` rewrite, `plugin add` never backfilling bundle-layer rows, invisible host-plugin `apply()` failures under `dsh web`, profile-local `@deepseek-ai/*` shadowing the runtime, and the non-unique tool-call id that permanently stalls the Web Chat assembler.

### Changed

- **`references/official-docs/` re-synced** to `5badb15` (369 md files / 182 `.zh.md` pairs; 338 modified, 3 removed, 15 pruned). `check-docs-drift.ps1` reports `FRESH`. The only removed document is `docs/subsystems/invariants.md`, consistent with the invariant removal.
- **`guide/unfixed-issues.md` re-verified end to end** (#1–#32 and S1–S7), every line number re-derived on the new baseline: 5 items moved to the fixed list (**#2** — the old chat-completions half is gone by removal, and its successor #8836 is recorded as the new primary entry; **#5** and **#10**, whose fixes actually pre-dated the old baseline; **#22** — `555b664b08` rewrote the compaction threshold with `headroomTokens`; **#29** — `f4a32dbd0a` flattened the telemetry read and validates migrated artifacts pre-hydrate), **#4** moved to a new "unreproducible" section (the real spec passes 41/41 on the new baseline, so the claim looks like a misdiagnosis rather than a fix), **#13** correctly re-attributed (the cited `apps/cli/src/plugin.ts` body was deleted *before* the old baseline; execa supplies `windowsHide`, the self-heal half persists), **#19** and **S5** reduced to their real residue, and **S1** downgraded to a manifest-consistency observation after `verify-runtime-closure` passed. Counts are now 22 unfixed + 2 partial + 1 residual face + 11 new (T1–T11) + 6 secondary. Upstream's #33 (the stale `settings.plugin.item` slot in the official cookbook) and S8 (the retired `cordis_define`/`cordis_run` dynamic tools) are preserved in place.
- **Compatibility baseline** across the five READMEs: `dsh-v0.2.1-alpha.1` (`5badb15009`, newest master tag, 2026-10-03), npm `latest` = `0.2.0-rc.2`, `alpha` = `0.2.1-alpha.1`, re-verified 2026-10-06. Upstream's site/`llms.txt` banner, star-CTA block, family roster and the `when-to-retire-a-plugin` / `choosing-a-plugin` rows are kept.
- **Peer range** left as the upstream single-sourced `DSH_PEER_RANGE` in `src/cli/templates.ts` and its explicit six-clause union in `package.json` (`… || >=0.2.0-0 <0.3.0 || >=0.2.1-0 <0.3.0`), both of which already admit the `0.1.7` and `0.2.x` lines. The earlier two-clause form could not admit `0.2.x` at all; note that **DSH does not validate peer ranges**, so the declaration is intent, not enforcement, and neither shape substitutes for runtime probing.
- `guide/quick-reference*` (five languages): the hard-rules block is regrouped to 14 rules covering effect ownership on borrowed contexts, `agent/pre-step` spread, the weakest-mechanism ordering, host-owned session events, `Volatile<T>`, peer+dev-only for shared dsh packages, display metadata, the retired `MessageSourceMap` plugin kind, the live patch-write hazard, UI rules, and the projection/durable-event performance rules. Also fixes the corrupted Chinese cheat-sheet title and the stale npm dist-tag guidance (`latest` is `0.0.1-rc.1` for every library package; only the CLI has a current `latest`).
- `SKILL.md`: contract red lines expanded (session-event write ban, `MessageSourceMap`, `ctx.get` for optional services, display metadata, peer+dev-only, UI and performance rules, the patch-write prohibition), development prerequisites gain a version check step, and the task paths point at the official skill, the migration guide, and `cordis_inspect_query` as the authority for exact signatures.
- `references/sources.md`: the Discussions archive, repo metadata (`has_issues=false`, ★≈244k), and the window's highest-value threads; the docs mirror count corrected to 369 md / 182 pairs; the "not on the site" document list; and the finding that **no maintainer confirmed any fix or design decision** in the 3,100 threads read — Releases are the only authority.
- `.github/workflows/compat.yml` now pins `@deepseek-ai/dsh`, `dsh-base` and `dsh-headless` at `0.2.0-rc.2`.

### Fixed

- **`scripts/archive-discussions.ps1`, `check-docs-drift.ps1` and `sync-official-docs.ps1` had no UTF-8 BOM**, so Windows PowerShell 5.1 decoded their Chinese comments as ANSI: `Parser::ParseFile` reported 17 cascading syntax errors, and the scripts only survived because the mangled byte sequences happened to terminate before each real code line. The encoding convention recorded in `references/sources.md` §I ("`scripts/*.ps1` must keep UTF-8 with BOM") was never applied to these three. BOMs added; all three now parse cleanly, and `check-docs-drift.ps1` / `verify-kit.ps1` still report `FRESH` / `VERIFY-OK`. The Discussions archiver also reports explicitly when it stops at the REST 5000-row ceiling instead of truncating silently.
- `guide/quick-reference.zh-CN.md` had a corrupted H1: a changelog sentence had been glued onto the title line, so the page rendered as "# DeepSeek Harness <changelog fragment> 插件开发速查表". Restored to "# DeepSeek Harness 插件开发速查表".

## [0.3.22] - 2026-10-05

### Changed

- Correct the release date in the previous section, which was stamped with the literal string `undefined` by the release stamper. No content or behaviour change; the version is bumped only because npm will not republish an existing version.


## [Unreleased]

## [0.3.21] - 2026-10-04

undefined

## [0.3.20] - 2026-10-04


### Changed

- Host pins move to `0.2.1-alpha.1`; re-verified against that host line. Every `@deepseek-ai/dsh-*` dev/test dependency now pins `0.2.1-alpha.1`, the `dshWorkshop.compatibility.dshVersions` timeline appends `0.2.1-alpha.1`, and the compatibility baseline in every README records the `dsh-v0.2.1-alpha.1` host. The declared host ranges (`engines.dsh` and the `peerDependencies` union) gain the `|| >=0.2.0-0 <0.3.0 || >=0.2.1-0 <0.3.0` clauses: the previous upper bound was `<0.2.0`, which under semver rejects every 0.2.x host, so the probe host itself was not installable. Nothing was narrowed — the `0.1.x` clauses are unchanged, in place and in order.

## [0.3.19] - 2026-09-25

### Changed

- Host pins move to `0.1.7-rc.2`; re-verified against that host line. Every `@deepseek-ai/dsh-*` dev/test dependency now pins `0.1.7-rc.2`, the `dshWorkshop.compatibility.dshVersions` timeline appends `0.1.7-rc.2`, and the compatibility baseline in every README records the `dsh-v0.1.7-rc.2` host. The declared host ranges (`engines.dsh` and the `peerDependencies` union) are deliberately **unchanged** — they already admit `0.1.7-rc.2`, and a range is what the manifest accepts, not what has been tested.

## [0.3.18] - 2026-09-24
### Changed

- The host pins move to `0.1.7-rc.1`: every `@deepseek-ai/dsh-*` dev/test pin moves from `0.1.7-alpha.2`, and `dshWorkshop.compatibility.dshVersions` records `0.1.7-rc.1` (appended — the timeline stays append-only). Re-verified against that host line. The declared peer ranges and `engines.dsh` are deliberately **unchanged**: `0.1.7-rc.1` already satisfies their `>=0.1.7-0 <0.2.0` clause, and the family keeps peer ranges wider than the verified line rather than narrowing them to it.


## [0.3.17] - 2026-09-23

### Added

- `dsh-plugin-dev check` grew a fifth red line: **`async apply` functions that register after their first `await`** (`ctx.effect` / `ctx.on` / `ctx.provide` / `ctx.plugin` / `*.register()`) now fail the check. Registrations made after the first top-level `await` land in the unload window and throw `INACTIVE_EFFECT`, while the old closure keeps running; the fix is to register through an effect created before any `await`. Covered by `tests/check.test.ts`, and the same shape is the `E2` seam in `dsh-plugin-upgrade`'s `0.1.5-rc.2` → `0.1.6-alpha.2` card.

### Changed

- The canonical `@deepseek-ai/dsh-*` peer range is now **single-sourced** (`DSH_PEER_RANGE` in `src/cli/templates.ts`) and substituted into both scaffold templates through `{{dshPeerRange}}`; the hardcoded `>=0.1.0-rc.8 <0.2.0` those templates shipped is gone. The range gains the `0.1.6` tuple's own clause (`|| >=0.1.6-0 <0.2.0`, never the bare `>=0.1.6` form, so every `0.1.6` prerelease is admitted), and this package's own peer declaration is re-pinned to match.
- `README.md` (+ zh/es/pt/hi) states the current baseline: DeepSeek Harness `0.1.6-alpha.2` (`ddefc45`), the three-clause peer range, and the async-apply red line.
- `guide/release-engineering.md` (+ `.zh-CN.md`) documents the `0.1.6-alpha.2` window and why the `-0` floor is the shape to use; `guide/plugin-dev-guide.md`'s hook row names `agent/created` (serial) instead of the removed `agent/session-start`; `guide/unfixed-issues.md` gains item 33 (the official `adding-a-settings-card` cookbook still teaches the deleted `settings.plugin.item` keyed slot) and records the retirement of the Creator-mode `cordis_define`/`cordis_run` dynamic tools.
- The official `adding-a-settings-card` cookbook (EN + ZH) in `references/official-docs/` is corrected locally to the `plugins.item` list slot (`id`/`order`/`label`, `props.view: 'summary' | 'page'`); item 33 in `guide/unfixed-issues.md` records the upstream bug and notes that a re-sync reverts the correction, so it must be re-applied from that entry.
- The published line this package checks against moves to `0.1.7-alpha.2`: the `@deepseek-ai/dsh-attachment` devDependency moves from `0.1.5-rc.2`, `DSH_PEER_RANGE` gains the `0.1.7` tuple's own clause (`|| >=0.1.7-0 <0.2.0`, never the bare `>=0.1.7` form) so the canonical range is four clauses, `dshWorkshop.compatibility.dshVersions` records `0.1.7-alpha.2`, and the `compat.yml` profile smoke installs the `0.1.7-alpha.2` CLI and bundle. This is a correctness fix, not a tightening: under npm semver's prerelease rule a comparator set whose only prerelease comparators sit on earlier `[major, minor, patch]` tuples cannot admit a later alpha, so the three-clause range the scaffold shipped could not admit the very line this workspace targets. The three existing clauses are unchanged, in place and in order, and nothing was narrowed.
- New `typecheck:checkout` (`tsc -p tsconfig.checkout.json --noEmit`) compiles the TypeScript scaffold this package ships (`templates/ts/src`, `templates/ts/tests`) against the local harness checkout's built types, aliasing the three `@deepseek-ai/*` specifiers those templates import. `--traceResolution` confirms all three resolve to the checkout, and a scratch negative control fails, so the alias table is not vacuous. `tests/check.test.ts` now imports `DSH_PEER_RANGE` instead of duplicating the canonical string, and grew a third sandbox asserting that the pre-0.1.7 three-clause range **fails** the checker — under semver's prerelease rule it excludes every `0.1.7` prerelease, so rejecting it is the correct verdict. No assertion was deleted or weakened and the test count is unchanged.
- The five README compatibility rows move to `dsh-v0.1.7-alpha.2` and their peer-range prose becomes four-clause with the new segment spelled out. This supersedes the `0.1.6-alpha.2` baseline recorded above.

### Fixed

- The scaffolder and the knowledge base taught a host line seven releases old. `dsh-plugin-dev init` installed `@deepseek-ai/dsh-base@0.1.5-rc.1` and `@deepseek-ai/dsh-headless@0.1.5-rc.1` (the `--base` / `--headless` defaults in `src/cli/main.ts`, four occurrences), and every scaffolded project's README shipped a compatibility row reading `DeepSeek Harness \`0.1.5-rc.1\`` — so a freshly created plugin announced, in five languages, that it targeted a line seven releases behind the one this workspace runs, and its own profile pointed there too. `src/cli/commands/verify.ts`'s failure remedy named the same old line. All three move to `0.1.7-alpha.2`, including the ten `templates/{js,ts}/README{,-zh,-es,-pt,-hi}.md` compatibility rows. Only the version token changed in the templates; their existing row shape (no `dsh-v` prefix, unlike the migrated plugin repos) was left alone rather than normalised. `verify:artifacts` asserts the JS scaffold still produces all five README languages.


## [0.3.16] - 2026-09-19

### Fixed

- `scripts/sync-official-docs.ps1` could no longer run: upstream renamed the root Chinese README from `README-zh.md` to `README.zh.md`, so the `git archive` pathspec `:(top)README-zh.md` matched no files and the sync aborted with `fatal: pathspec ... did not match any files`. Updated the pathspec, the scope comment, and the `$rootKeep` allowlist. This was the root cause behind the stale mirror reported in [#8](https://github.com/PerryLink/dsh-plugin-guide/issues/8) — not a missing sync run.

### Changed

- `references/official-docs/` re-synced from `origin/master` at `ddefc45fbc7f8e46dd73185e68295696d1297887` (`dsh-v0.1.6-alpha.2`, 2026-09-19): 240 tracked files changed, 42 added, 3 removed. `references/official-docs/SNAPSHOT.md` now pins the alpha.2 commit, replacing the 2026-09-04 `d347e703908` snapshot that 0.3.15 shipped. Verified with `scripts/check-docs-drift.ps1` (`FRESH: references/official-docs matches the upstream branch tip`) and `scripts/verify-kit.ps1` (`VERIFY-OK`; 555 blobs compared, 0 drift). The drift issue [#8](https://github.com/PerryLink/dsh-plugin-guide/issues/8) is closed.

## [0.3.15] - 2026-09-19

### Changed

- `guide/unfixed-issues.md` re-verified against `ddefc45fbc7f8e46dd73185e68295696d1297887` (`dsh-v0.1.6-alpha.2`, 2026-09-19; +882 commits over the previous baseline `0d1f5000`). Counts move to **29 unfixed + 2 partial + 1 fixed + 6 secondary**: **#27** (desktop `prepare:dsh` fs-ext payload smoke) is **fixed** by `6b05ed53e9`, contained only in `dsh-v0.1.6-alpha.2`; **#1** (same/narrower `sandbox_permissions`) becomes **partial** — `61c548e200` ("fix(sandbox): accept repeated effective permission modes", PR #4326) short-circuits a repeated mode at `escalation.ts:155` and moves the "not strictly wider" throw to `:160`, with the spec now asserting same-mode success (`tests/escalation.spec.ts:84`), while narrower/unsupported targets still throw. Refreshed positions include `bundle/base/cordis.patch.yml:226` -> `:234`, and the discussion link title in the header now names the alpha.2 baseline. Mirrored in the public [discussion #6520](https://github.com/deepseek-ai/deepseek-harness/discussions/6520).

## [0.3.14] - 2026-09-15

### Changed

- `guide/unfixed-issues.md` re-verified against the newest official master `0d1f50007f9bca3f52b06e1c3074fa14d5fb0720` (2026-09-15, `dsh-v0.1.6-alpha.1` generation; interval = 666 commits / 3123 changed files). The table now counts **31 unfixed + 1 partial + 6 secondary**: #2 (reasoning-only turns) becomes PARTIAL — DeepSeek now defaults to the Messages protocol (`llm-deepseek/src/config.ts:81,207`), so the empty-content 400 needs a real-run retest on both protocols; the old `src/serialize.ts` path moved to `protocols/chat-completions/serialize.ts:196-229`. Secondary #6129 (trajectory-panel first-token time) is **fixed on master** (`e779831f40` via `a85778448a`; `ui-trajectory/src/client/trajectory-assistant-definition.ts:195-203`) and moved into the fixed-on-master section. ~26 positions refreshed for the three big renames/refactors in the interval: the `llm-deepseek` protocol split (`common/request-extensions.ts:20-24`, `common/defaults.ts:6,8`), the `code-runtime-worker-thread` → `ptc-runtime/ptc-runtime-node` package rename (`bootstrap.ts:326-335`, `json-wire.ts`), and in-file shifts (`session/src/index.ts:719-770`, `rpc-host.ts:79-84,178-179`, `fsio.ts:633-638`, `migration.ts:354-357,366-368,390-395`, `format.ts:403,482-484,497-514`, `generation.ts:583/597`, `install.ts:208-220`, `cordis.patch.yml:432-439`, …). #14 now records "still unfixed as of `dsh-v0.1.6-alpha.1`"; the headless misconception row now documents the new `--session-id <id>` resume (`bundle/headless/src/index.ts:279,342`). Mirrored in the public [discussion #6520](https://github.com/deepseek-ai/deepseek-harness/discussions/6520) fifth batch.

## [0.3.13] - 2026-09-15

### Added

- `guide/unfixed-issues.md` grows from 26+4 to 32+7 items with the third verification batch (all parent-verified against `c291e7961a`): #27 desktop `prepare:dsh` smoke still requires removed `fs-ext` (`apps/desktop/scripts/prepare-dsh.ts:142`; #6589 #6612, adopted from the #6520 post); #28 history read path defaults to `recoverable` and silently truncates seq-gapped/corrupt rows (`session-persistence-jsonl/src/index.ts:915`, `format.ts:401-410`; #6562 #3631); #29 unguarded projection reads after v0→v3 migration (`session-turn-outline:110,113,119`, `session-stats:174`, `session-telemetry/coordinator.ts:270`; #6686); #30 http-proxy leaks undici's `[::1]` into child `no_proxy` env, crashing httpx MCP servers (`policy.ts:33`, `install.ts:79-92`; #6655); #31 pasted images hold a lazy File snapshot that dies under cross-device clipboard sync (`service.ts:73-80,124-135`; #6673); #32 web-fetch NAT64 discovery is unguarded when no DNS64 exists (`network.ts:90-93,113-134`; #6664). #14 now carries the 0.1.2→0.1.5 inject regression bisect (tags `dsh-v0.1.2-rc.1`/`dsh-v0.1.5-rc.2`; #6681); #22/#23 gain the #6671/#6672 discussions. Secondary S5–S7: stale `cordis_mount/inspect/unmount` skill names (#6679), no SIGTERM drain / 5s hardcoded grace / no `dsh restart` (#6665), unmerged LLM egress-timeout fix with http-proxy-owned global dispatcher (#5673).
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
