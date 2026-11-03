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

An evidence card is per practice, per plugin, with a baseline and an after
measurement. Example shape:

```yaml
subject: "@acme/dsh-hello@0.1.0"          # what was measured
host: "dsh 0.2.2-alpha.2 / cordis 4.0.6-alpha.1 / node 24"
method: "bench: startup ms and tokens per turn"
scope: "single machine, 5 runs, synthetic prompt"
command: "node bench/hello.mjs"
result: "startup 180→150 ms; tokens 1200→900"
negativeControl: "same bench with the plugin disabled"
generatedAt: "2026-11-03"
expiresAt: "2027-05-03"
recordHash: "sha256:<64 hex of this record>"
claimLevel: "self-assessed"               # self-reported | self-assessed | host-reviewed | independent | reference
issuer: "author"
selfAssessed: true
```

All thirteen fields are required. A missing or malformed field makes the card
`not-measured`; a status word alone is not evidence.

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

Without evidence, the result is `not-measured`, not a pass. See
[`40-checker`](https://github.com/PerryLink/dsh-standards/tree/main/40-checker)
for the evidence schema and examples.

## Author checklist

- Every timer/listener/connection has a disposer owned by the plugin.
- Required services are declared; optional services use `ctx.get()`.
- User-tunable fields are volatile, not hard-coded.
- Waterfall listeners either call `next()` or deliberately short-circuit.
- Tool/prompt prefixes are stable; volatile text is outside the prefix.
- Long work is cancellable and does not block a turn.
- Each claimed improvement has a command, environment, and raw artifact.
