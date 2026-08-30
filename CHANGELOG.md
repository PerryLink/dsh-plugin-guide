# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
