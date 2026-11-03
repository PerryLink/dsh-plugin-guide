# FLOW: can a user actually use it?

FLOW is the user-journey layer. ENTRY gets the plugin in; FLOW decides whether
the first run, configuration, upgrade, and removal are understandable.

## The eight journeys

| ID | Journey | Minimum evidence |
|---|---|---|
| J1 | install / remove | add → dump config → remove; no hand-edited profile |
| J2 | enable / disable | stable id; the change is visible in the composed config |
| J3 | configuration | empty config boots; invalid config fails loudly with a field path; volatile changes restart 0 times |
| J4 | first success | a five-minute quickstart and an error with cause, next command, and doc anchor |
| J5 | permissions | capabilities/labels/commitments/disclosure match the README and contain no forbidden claims |
| J6 | upgrade / rollback / uninstall | upgrade, rollback, and uninstall preserve data and leave no residue |
| J7 | observability | normal, missing-service, and port-conflict cases are diagnosable |
| J8 | client / server | headless, web, and client-disabled modes work or are explicitly rejected |

The canonical text is
[`32-DSH-FLOW`](https://github.com/PerryLink/dsh-standards/blob/main/32-DSH-FLOW%E9%A1%BA%E7%95%85%E8%A7%84%E8%8C%83.md).

## Status, not a score

| Status | Meaning |
|---|---|
| `runtime` | all eight journeys have pass evidence |
| `failed` | at least one journey has an attributable FAIL |
| `not-run` | no evidence, or fewer than eight journeys have pass evidence |

Each journey is recorded as `pass` / `fail` / `not-run` / `manual`. There is no
`flow-warn` status — a partial run is `not-run`, not a soft pass.

`not-run` is never a pass. Do not publish a pass rate or a grade from FLOW.

## Current limit

The runtime harness is still a draft. J1/J2/J4/J6 have runtime evidence on
fixtures; J3/J7 have fixture-level runtime; J5/J8 have static preflight; browser
rendering is not yet covered. The guide must state which journey was actually
run.

The source harness lives in
[`40-checker/scripts/journey.mjs`](https://github.com/PerryLink/dsh-standards/blob/main/40-checker/scripts/journey.mjs)
and
[`journey-runtime.mjs`](https://github.com/PerryLink/dsh-standards/blob/main/40-checker/scripts/journey-runtime.mjs).
The three-layer audit reads FLOW evidence through `--flow-evidence`:

```sh
npx -p dsh-standards dsh-levels ./my-plugin --flow-evidence flow.json --format json
```

## Author checklist

- README has Quickstart, Permissions, Config, Upgrade/Uninstall, and
  Troubleshooting.
- Errors say what happened, what to run next, and where the doc is.
- Permissions say what the plugin can/cannot do and how to turn it off.
- Upgrade and uninstall are tested against real data, not only a clean install.
- No “certified”, “official”, or “secure” wording.
