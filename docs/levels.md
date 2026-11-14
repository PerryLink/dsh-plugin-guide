# The three DSH layers

> Three tracks, not three grades. The layers answer different questions and do
> not add up to a score, certificate, or ranking.

| Layer | Question | What it is | Can it produce a verdict? |
|---|---|---|---|
| **ENTRY** | Can the plugin be recognized, installed, and started? | Compatibility gate | Yes: recognized / runtime / failed / incomplete / unavailable |
| **FLOW** | Can a user install, configure, use, upgrade, and remove it without fighting it? | J1–J8 user-journey checks | Yes, where runtime evidence exists; otherwise `not-run` |
| **BOOST** | Does it use Cordis well? | LEV-1–8 practice library and evidence cards | No plugin-level pass/fail; evidence is per practice |

> **Current baseline (2026-11-14):** DSH `0.2.2-rc.3` (npm `next`; `latest` is still `0.2.2-rc.1`), tag commit `38a6a5c9`; Node `>=24.9.0`; Cordis `4.1.0` (vendored upstream baseline `4.0.0-rc.11`). `engines.dsh`, when declared, decides alone since 0.2.1-alpha.4; `ctx.menus` is gone in 0.2.2-alpha.3; Typert codecs use `create()` since 0.1.6-alpha.2; `@deepseek-ai/dsh-client-runtime` was removed in 0.1.2-alpha.1 and has no 0.2.x.
>
> History and boundaries: the 2026-11-04 baseline was DSH `0.2.2-alpha.3` / Cordis `4.0.6-alpha.2`. The `v0.2.2-rc.2` changes (for example the `ctx.root` removal, `Service.metadata`, and the default WebServer auth) belong to the **next** release after rc3, not to rc3. The rc.1-line host guides that touch plugins are indexed in [rc3-notes.md](rc3-notes.md).

## Where to go next

| You have | Read |
|---|---|
| a report line with a `DSC-nn` or `C-n.m` ID | [rules.md](rules.md) — every check, whether it blocks, and the one-line fix |
| a FAIL to fix right now | [recipes.md](recipes.md) — copy-paste `package.json`, `cordis.patch.yml`, and client entry |
| an ENTRY question | [entry.md](entry.md) — package shape, runtime surface, declarations |
| a FLOW journey to record | [flow.md](flow.md) — the `dsh-flow-evidence/2` file and J1–J8 evidence |
| a BOOST practice to evidence | [boost.md](boost.md) — the thirteen-field evidence card |
| a DSH `0.2.2-rc.3` host-API question | [rc3-notes.md](rc3-notes.md) — the rc.1-line notes for bundle updates, `Session.append` overloads, and window regions |
| a security question — what can a plugin do, is this safe to install, what must a market disclose | [security.md](security.md) — author/user/market checklists and the `DSC-15`–`DSC-22` boundary |

The two reference docs exist because a report ID alone does not tell you what to
change: [rules.md](rules.md) maps IDs to fixes, and [recipes.md](recipes.md)
holds the shapes those fixes need.

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
Then fix by ID: [rules.md `DSC-01`–`DSC-14`](rules.md#table) and
[recipes.md](recipes.md).

## FLOW

FLOW is the user journey: install/remove, enable/disable, configuration,
first success, permissions, upgrade/rollback, observability, and client/server
modes.

- The current FLOW harness is a draft. Some J1–J8 checks have runtime evidence;
  others are static preflight or `not-run`.
- `runtime`, `failed`, and `not-run` are the FLOW statuses. A partial run is
  `not-run`, never a soft pass.

Start here: [FLOW guide](flow.md) and the canonical
[32-DSH-FLOW](https://github.com/PerryLink/dsh-standards/blob/main/32-DSH-FLOW%E9%A1%BA%E7%95%85%E8%A7%84%E8%8C%83.md).
The evidence file shape and the J1–J8 minimum are in
[flow.md § the evidence file](flow.md#evidence-file).

## BOOST

BOOST is a practice library for using Cordis well: effects, inject/get,
volatile configuration, event modes, seams, stable prompt prefixes, bounded
parallel/jobs, and composition.

- A practice can be evidenced; a plugin does not get a “BOOST level”.
- The measured examples are fixtures or synthetic captures, not production
  baselines, plus one real-provider LEV-6 re-run (constructed arms; see
  [boost.md § real-provider evidence](boost.md#lev6-real-provider)).
- It is not a certification, score, or market gate.

Start here: [BOOST guide](boost.md) and the canonical
[33-DSH-BOOST](https://github.com/PerryLink/dsh-standards/blob/main/33-DSH-BOOST%E5%8A%A0%E9%80%9F%E5%AE%9E%E8%B7%B5.md).
The card fields are in
[boost.md § evidence, not a badge](boost.md#thirteen-fields).

## Security is not a fourth layer

Security checks are a **scope**, not a level, and they ship in `dsh-standards`
1.6.0+ (1.5.x and earlier exit `3` for the unknown scope): `DSC-15`–`DSC-22`
sit behind `--scope security`. They never change an ENTRY, FLOW, or BOOST
verdict. Outside that scope a security `FAIL` is capped to WARN in the separate
`security` block and does not enter `buckets.blocking`; under it only
`DSC-15`/`16`/`17` can block, and `DSC-21` is WARN-only.

- Static checks only match known source shapes; they cannot see runtime egress,
  file reads, or prompt corruption. Runtime security needs a sandbox with a
  network policy and capture.
- No security `PASS` means “safe”. It means “no known pattern matched in this
  static pass”.
- The three layers stay about compatibility, user journeys, and Cordis practice.
  Do not turn them into a security certification, and do not add a “security
  level” to the vocabulary.

Read [security.md](security.md) for the author, user, and market checklists.

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
- security check ≠ security audit
- `A–D` grades (where they exist) are orthogonal to ENTRY/FLOW/BOOST
- No official, certified, verified, audited, secure, recommended, or ranked claim
