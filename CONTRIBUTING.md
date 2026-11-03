# Contributing to dsh-plugin-guide

Thanks for helping. This repository is the guide layer; checks and rule text
belong in `dsh-standards` and `dsh-plugin-spec`.

## Before you open an issue

- Read the README, `docs/levels.md`, and `PRIVACY.md`.
- Include the package version, DSH host version, OS/Node version, and the exact
  command or skill request.
- Never paste credentials, tokens, personal data, or private plugin code.

## Pull requests

- Keep the change focused; explain the user-visible effect.
- Run `npm test` and `npm pack --dry-run` before pushing.
- Update `CHANGELOG.md` when behavior, routing, or boundaries change.
- Do not add a checker or a second rule source to this package; link to
  `dsh-standards` or `dsh-plugin-spec` instead.
- CI must be green; a maintainer reviews before merge.

## License

By contributing, you agree that your contribution is licensed under Apache-2.0.
See `LICENSE` for the authoritative text.
