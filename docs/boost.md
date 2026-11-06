# BOOST: use Cordis well

BOOST is a **practice library**, not a plugin grade. It records practices and
evidence; it does not attach a “Boost level” to a plugin.

The canonical text is
[`33-DSH-BOOST`](https://github.com/PerryLink/dsh-standards/blob/main/33-DSH-BOOST%E5%8A%A0%E9%80%9F%E5%AE%9E%E8%B7%B5.md).

## The eight practices

| ID | Practice | Evidence to look for |
|---|---|---|
| LEV-1 | reversible effects | timers, connections, watchers, and subprocesses are in `ctx.effect()` with a label; restart returns to baseline |
| LEV-2 | waiting correctly | required services in `inject`; `ctx.inject()` for waits; `ctx.get()` for optional; no polling |
| LEV-3 | hot configuration | adjustable fields use `volatile()` + `.get()`; a config change does not restart the plugin |
| LEV-4 | event discipline | event name/`@mode` match; waterfall observers call `next()`; serial/bail/parallel for waits; emit for observation |
| LEV-5 | seams and isolation | consumers use seams; no implementation imports; isolate/group only when multiple instances need it; per-agent `agent.ctx` |
| LEV-6 | stable prefix / assembly | tool and prompt declarations are byte-stable; volatile text goes through `systemPrompt.context`; assembly is reused |
| LEV-7 | bounded parallel / long work | independent calls are bounded-parallel; long work uses jobs; cancellation propagates |
| LEV-8 | composition / evidence cards | bundle patches and presets express differences; each practice has a reproducible evidence card |

## Evidence, not a badge

<a id="thirteen-fields"></a>
An evidence card is per practice, per plugin, with a baseline and an after
measurement. The audit is strict about the field names, so use exactly these
thirteen:

```json
{
  "LEV-1": {
    "status": "measured",
    "evidenceCard": {
      "subject": "@acme/dsh-hello@0.1.0",
      "host": "dsh 0.2.2-alpha.2 / cordis 4.0.6-alpha.1 / node 24.9.0 / linux-x64",
      "method": "count timers and listeners before and after dispose; 20 runs",
      "scope": "LEV-1 reversible effects — timer and watcher in apply()",
      "command": "node bench/effects.mjs",
      "result": "effects 3 → 0 after dispose; effect count 3 → 3 after restart",
      "negativeControl": "the same bench with the plugin disabled",
      "generatedAt": "2026-11-06",
      "expiresAt": "2027-05-06",
      "recordHash": "sha256:<64 lowercase hex over this card>",
      "claimLevel": "self-assessed",
      "issuer": "author",
      "selfAssessed": true
    }
  }
}
```

| Field | Validator | What to put there |
|---|---|---|
| `subject` | non-empty string | what was measured, `name@version` — not the repo name |
| `host` | non-empty string | DSH / Cordis / Node versions and the platform |
| `method` | non-empty string | how it was measured, including the run count or comparator |
| `scope` | non-empty string | which LEV practice and which part of the plugin |
| `command` | non-empty string | the exact command that produced the result |
| `result` | non-empty string | numbers, `before → after`; no adjectives |
| `negativeControl` | non-empty string | the same measurement with the plugin disabled |
| `generatedAt` | `YYYY-MM-DD` | the day it was run |
| `expiresAt` | `YYYY-MM-DD`, not before `generatedAt` | when the measurement stops being current (180 days is a reasonable cap) |
| `recordHash` | `sha256:` + 64 lowercase hex | sha256 over the card JSON without this field; the validator checks the shape, a reviewer recomputes it |
| `claimLevel` | `self-reported` \| `self-assessed` \| `host-reviewed` \| `independent` \| `reference` | be honest; anything stronger is not self-declared |
| `issuer` | non-empty string | who ran it (`author`, an org, a CI job) |
| `selfAssessed` | boolean | `true` only when the author ran and judged it |

How the audit treats a card:

- Missing or malformed field → the practice is `not-measured`; a `status` word
  alone is not evidence.
- `expiresAt` before `generatedAt` → invalid card, `not-measured`.
- `expiresAt` in the past (compared to today) → `stale`, and the whole BOOST
  result is `stale`; refresh the card.
- A `claimLevel` outside the five values → invalid card.
- All eight practices need a valid card for `measured`; one card is
  `1/8 practices have valid measured evidence cards`, not a pass.
- `status: "failed"` is `failed` whether or not a card exists.
- The card may also sit directly under `evidence` as an object, but
  `evidenceCard` is unambiguous; a string `evidence` is only a note.

If an effect cannot be measured (developer hours, maintenance cost, “fewer
pitfalls”), record it as a WARN or a note. Do not invent a number.

## Current limits

- The measured examples are fixture-level, provider-capture, or synthetic timer
  results. They are not production baselines.
- LEV-3, LEV-6, and LEV-7 have the strongest current evidence; the others have
  loader/context-level fixtures.
- BOOST is not a market gate and must not become a certification.

## Run the audit

```sh
npx -p dsh-standards dsh-levels ./my-plugin \
  --boost-evidence boost.json --format json
```

Without evidence, the result is `not-measured`, not a pass. The card is
validated by
[`40-checker/scripts/level-audit.mjs`](https://github.com/PerryLink/dsh-standards/blob/main/40-checker/scripts/level-audit.mjs);
keep the raw logs next to the card so a reviewer can re-run `command` and
recompute `recordHash`.

## Author checklist

- Every timer/listener/connection has a disposer owned by the plugin.
- Required services are declared; optional services use `ctx.get()`.
- User-tunable fields are volatile, not hard-coded.
- Waterfall listeners either call `next()` or deliberately short-circuit.
- Tool/prompt prefixes are stable; volatile text is outside the prefix.
- Long work is cancellable and does not block a turn.
- Each claimed improvement has a command, environment, and raw artifact.
