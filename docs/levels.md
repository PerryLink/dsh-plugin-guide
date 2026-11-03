# The three DSH layers

> Three tracks, not three grades. The layers answer different questions and do
> not add up to a score, certificate, or ranking.

| Layer | Question | What it is | Can it produce a verdict? |
|---|---|---|---|
| **ENTRY** | Can the plugin be recognized, installed, and started? | Compatibility gate | Yes: recognized / runtime / failed / incomplete / unavailable |
| **FLOW** | Can a user install, configure, use, upgrade, and remove it without fighting it? | J1–J8 user-journey checks | Yes, where runtime evidence exists; otherwise `not-run` |
| **BOOST** | Does it use Cordis well? | LEV-1–8 practice library and evidence cards | No plugin-level pass/fail; evidence is per practice |

## ENTRY

ENTRY is the compatibility floor. It checks the package shape, entry points,
bundle patch, version/peer range, metadata, labels, and — when a runtime claim is
made — an actual start.

- `recognized` means the package can be identified. It is **not** a runtime
  pass.
- `runtime` requires an actual plugin start or bundle boot (G0–G3).
- `static` is not a pass. `not-run` is not a pass.

Start here: [ENTRY guide](entry.md) and the canonical
[31-DSH-ENTRY](https://github.com/PerryLink/dsh-standards/blob/main/31-DSH-ENTRY%E5%85%A5%E9%97%A8%E8%A7%84%E8%8C%83.md).

## FLOW

FLOW is the user journey: install/remove, enable/disable, configuration,
first success, permissions, upgrade/rollback, observability, and client/server
modes.

- The current FLOW harness is a draft. Some J1–J8 checks have runtime evidence;
  others are static preflight or `not-run`.
- `flow-warn`, `flow-fail`, and `flow-not-run` are real outcomes. Do not turn a
  missing run into a pass.

Start here: [FLOW guide](flow.md) and the canonical
[32-DSH-FLOW](https://github.com/PerryLink/dsh-standards/blob/main/32-DSH-FLOW%E9%A1%BA%E7%95%85%E8%A7%84%E8%8C%83.md).

## BOOST

BOOST is a practice library for using Cordis well: effects, inject/get,
volatile configuration, event modes, seams, stable prompt prefixes, bounded
parallel/jobs, and composition.

- A practice can be evidenced; a plugin does not get a “BOOST level”.
- The measured examples are fixtures or synthetic captures, not production
  baselines.
- It is not a certification, score, or market gate.

Start here: [BOOST guide](boost.md) and the canonical
[33-DSH-BOOST](https://github.com/PerryLink/dsh-standards/blob/main/33-DSH-BOOST%E5%8A%A0%E9%80%9F%E5%AE%9E%E8%B7%B5.md).

## Run the checks

```sh
# ENTRY recognition (no runtime claim)
npx dsh-standards ./my-plugin --scope entry --entry-claim static

# Three-layer audit; FLOW/BOOST are only reported when evidence is supplied
npx -p dsh-standards dsh-levels ./my-plugin --format json
```

The checker and level audit ship in
[`dsh-standards`](https://www.npmjs.com/package/dsh-standards). The rule text
lives in [`dsh-plugin-spec`](https://github.com/PerryLink/dsh-plugin-spec).
The legacy build skill/CLI is [`dsh-primer`](https://github.com/PerryLink/dsh-primer).

## Vocabulary that must not be inflated

- `recognized` ≠ `runtime`
- `static` ≠ `runtime`
- `not-run` ≠ `pass`
- `boost-evidenced` ≠ plugin grade
- `A–D` grades (where they exist) are orthogonal to ENTRY/FLOW/BOOST
- No official, certified, secure, recommended, or ranked claim
