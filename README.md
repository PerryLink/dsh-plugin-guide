<div align="center">

# dsh-plugin-guide

**A practical guide to DSH plugin quality: ENTRY, FLOW, BOOST.**

Community guide. Not official, not a certification, not a ranking.

[![npm](https://img.shields.io/npm/v/dsh-plugin-guide)](https://www.npmjs.com/package/dsh-plugin-guide)
[![CI](https://github.com/PerryLink/dsh-plugin-guide/actions/workflows/verify.yml/badge.svg)](https://github.com/PerryLink/dsh-plugin-guide/actions/workflows/verify.yml)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

[English](README.md) · [简体中文](README-zh.md)

</div>

---

## What this is

`dsh-plugin-guide` is the **guide layer** for DSH plugins. It explains what to
check, why it matters, and which tool owns the verdict. It does not certify,
score, or rank plugins.

| Package | Role |
|---|---|
| **`dsh-plugin-guide`** | This package: the prose guide, the three-layer map, and the agent skill |
| **`dsh-standards`** | The execution umbrella: ENTRY/FLOW checks, level audit, and spec files |
| **`dsh-plugin-spec`** | The low-level rule text and clause source |
| **`dsh-primer`** | The legacy build/scaffold skill and CLI (formerly `dsh-plugin-guide` 0.3.x) |

## The three layers

| Layer | Question | Verdict? |
|---|---|---|
| **ENTRY** | Can it be recognized, installed, and started? | Yes: recognized / runtime / failed / incomplete / unavailable |
| **FLOW** | Can a user install, configure, use, upgrade, and remove it? | Yes, only where runtime evidence exists; otherwise `not-run` |
| **BOOST** | Does it use Cordis well? | No plugin-level verdict; per-practice evidence |

Three tracks, not three grades. They do not add up to a score or a certificate.

Read the one-page map: [docs/levels.md](docs/levels.md).

## Install

```sh
dsh plugin --profile web add dsh-plugin-guide
```

Then ask the agent to use the `dsh-plugin-guide` skill when reviewing a plugin.
The skill routes checks to `dsh-standards` and points build work at
`dsh-primer`.

## Check a plugin

```sh
# ENTRY recognition only (no runtime claim)
npx dsh-standards ./my-plugin --scope entry --entry-claim static

# Three-layer audit; unrun layers stay not-run / not-measured
npx -p dsh-standards dsh-levels ./my-plugin --format json
```

A `recognized` result is not a pass. A `static` result is not a pass. A
`not-run` result is not a pass.

## What changed in 0.4.0

- The previous agent skill and `dsh-plugin-dev` CLI moved to
  [`dsh-primer`](https://github.com/PerryLink/dsh-primer).
- This package is now the **guide** layer: three-layer map, check routing, and
  evidence rules.
- The old 0.3.x npm versions are deprecated and remain available for existing
  installs. The 0.4.0 line is a breaking product change; users pinned to `^0.3`
  will not auto-upgrade.
- Checks live in [`dsh-standards`](https://github.com/PerryLink/dsh-standards),
  not in this package.

## Boundary

- No official endorsement, certification, accreditation, or security audit.
- No score, ranking, or market gate.
- No fabricated runtime evidence: `static` ≠ `runtime`, `not-run` ≠ `pass`.
- BOOST is advice and evidence, never a plugin grade.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE.md](NOTICE.md).
