# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[0.1.2]: https://github.com/PerryLink/dsh-plugin-guide/releases/tag/v0.1.2
[0.1.1]: https://github.com/PerryLink/dsh-plugin-guide/releases/tag/v0.1.1
[0.1.0]: https://github.com/PerryLink/dsh-plugin-guide/releases/tag/v0.1.0
