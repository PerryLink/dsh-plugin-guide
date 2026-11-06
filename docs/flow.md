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

<a id="evidence-file"></a>
## The evidence file: `dsh-flow-evidence/2`

A journey row without a command, exit code, log hash, and timestamp is a claim,
not evidence. The shape below is the evidence-file contract this guide
recommends: one subject, one host, one entry per journey, and a chain pointer so
a rewrite is detectable.

```json
{
  "schema": "dsh-flow-evidence/2",
  "evidenceId": "01JCM8Z6R4W1V2K3N4P5Q6R7S8",
  "generatedAt": "2026-11-06T12:00:00Z",
  "producer": {
    "command": [
      "node",
      "40-checker/bin/dsh-flow-collect.mjs",
      "--package",
      "."
    ],
    "at": "2026-11-06T12:00:00Z",
    "kind": "local",
    "runner": "flow-collect 0.1.0",
    "actor": "author"
  },
  "subject": {
    "name": "@acme/dsh-hello",
    "version": "0.1.0",
    "source": "npm",
    "integrity": "sha512-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
    "tarballSha256": "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "commit": "ce7073d51254c26cd63b22a60835b8f948deb447",
    "treeSha256": "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "treeStable": true
  },
  "host": {
    "dsh": "0.2.2-alpha.2",
    "dshCommit": null,
    "cordis": "4.0.6-alpha.1",
    "node": "v24.11.0",
    "platform": "linux-x64"
  },
  "journeys": {
    "J1": {
      "status": "pass",
      "limitations": [],
      "checks": [
        {
          "id": "J1.install",
          "kind": "observed",
          "command": [
            "dsh",
            "plugin",
            "add",
            "."
          ],
          "exitCode": 0,
          "startedAt": "2026-11-06T11:00:01Z",
          "endedAt": "2026-11-06T11:00:09Z",
          "stdout": {
            "path": "logs/J1.install.out",
            "sha256": "sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc"
          },
          "assertions": [
            {
              "claim": "row visible in dump",
              "observed": true
            }
          ],
          "durationMs": 8000
        }
      ]
    },
    "J2": {
      "status": "not-run",
      "reason": "not collected in this example",
      "checks": []
    },
    "J3": {
      "status": "not-run",
      "reason": "not collected in this example",
      "checks": []
    },
    "J4": {
      "status": "not-run",
      "reason": "not collected in this example",
      "checks": []
    },
    "J5": {
      "status": "not-run",
      "reason": "not collected in this example",
      "checks": []
    },
    "J6": {
      "status": "not-run",
      "reason": "not collected in this example",
      "checks": []
    },
    "J7": {
      "status": "not-run",
      "reason": "not collected in this example",
      "checks": []
    },
    "J8": {
      "status": "na",
      "reason": "no dsh.client",
      "checks": []
    }
  },
  "claims": {
    "claimLevel": "self-attested",
    "notClaimed": [
      "certification",
      "security audit"
    ],
    "method": "structural example: one observed J1 run; J2-J8 not collected"
  },
  "conclusion": "flow-warn",
  "chain": {
    "evidenceHash": "sha256:ee0364bfd26362dca8265c04b7609f6d489c100826c4778e46a1f9f56f3aa138"
  }
}
```

| Field | Required | What belongs there |
|---|---|---|
| `schema`, `evidenceId`, `generatedAt` | yes | the version, a unique id, an ISO timestamp |
| `producer` | yes | `kind` = `sandbox` / `ci` / `local`, the `runner`, a `runUrl` for CI, the `actor` |
| `subject` | yes | `name@version` plus `integrity`, `tarballSha256`, `commit`, `treeSha256` — binds evidence to one artifact, so a copied file for another version is `stale` |
| `host` | yes | `dsh`, `dshCommit`, `cordis`, `node`, `platform` — a pass on another host does not transfer |
| `journeys.Jn` | yes, per run journey | `status` (`pass` / `fail` / `not-run` / `na`), `kind` (`observed` / `static` / `manual`), `checks[]`, `limitations[]`, and `reason` for a skip |
| `journeys.Jn.checks[]` | yes, per check | `id` (`J1.install`), `command[]`, `exitCode`, `startedAt`, `endedAt`, `stdout.path` + `stdout.sha256`, `assertions[]` |
| `totals`, `conclusion` | yes | counts and `flow-pass` / `flow-fail` / `flow-blocked` / `flow-warn` |
| `claims` | yes | `claimLevel` (`self-attested`, `sandbox-attested`, …) and what is explicitly **not** claimed |
| `chain` | when chained | `seq`, `prev`, `entrySha256` from the append-only evidence chain |
| `signature` | optional | `null` unless you actually sign |

Honesty rules for the file itself:

- `kind: "static"` never counts as a FLOW pass. J5 and a client-only J8 are
  static preflight; label them that way.
- `na` is a skip with a reason (`no dsh.client`), not a pass.
- A missing `command[]`, `exitCode`, or log hash means the row is not evidence.
  Put the limitation in `limitations[]` instead of dropping the row.

<a id="what-the-checker-reads"></a>
### What reads this file

`dsh-levels --flow-evidence` reads this nested shape directly since
`dsh-standards` 1.3.0. The flat `{ "J1": { "status": "pass" } }` map and the
older `dsh-flow-journey/1` / `dsh-flow-runtime/1` files are `deprecated` and
never count as a pass.

- Every journey claimed as `pass` needs at least one `checks[]` entry with
  `exitCode: 0`, an observed (non-`static`) kind, and a log hash.
- `na` is a skip with a reason, not a pass. A package with no client ends at
  7/8 and `not-run` — that is the honest answer.
- `runtime` is reserved for `sandbox-attested` evidence (`producer.kind =
  "sandbox"` or `claims.claimLevel = "sandbox-attested"`). Self-attested or CI
  evidence keeps its pass count but lands on `not-run`.
- The file binds subject, host, and a recomputable `chain.evidenceHash`; a
  hand-written flat 8-pass file no longer passes.

<a id="minimum-evidence-per-journey"></a>
## Minimum evidence per journey

| Journey | Run and record | The row is a pass only when |
|---|---|---|
| **J1** install / remove | `dsh plugin add .` → config dump → `dsh plugin remove` → dump | the row appears and then disappears, with no hand-edited profile; record both dumps and their hashes |
| **J2** enable / disable | disable and enable the same row id, dumping after each | the change is visible in the composed config under the same stable id |
| **J3** configuration | boot with an empty config; boot with an invalid field; change a `volatile()` field | empty config boots; the invalid value fails loudly with a field path; the volatile change restarts 0 times |
| **J4** first success | follow the README quickstart on a clean profile; also start with no credential | a five-minute first success, and the error names the cause, the next command, and the doc anchor; a no-key start stops at a clear credential boundary |
| **J5** permissions | compare `capabilities`/`labels`/commitments/disclosure with the README | every declaration matches the README and no endorsement claim appears; static only, so `kind:"static"` and **not** counted as pass |
| **J6** upgrade / rollback / uninstall | install `--previous`, upgrade, roll back, uninstall | the installed version changes and comes back, data survives, and no files or rows are left behind |
| **J7** observability | boot normally, with a missing service, and with a port conflict | the startup line prints `name@version`, and each of the three cases is diagnosable from the log |
| **J8** client / server | headless run, web run, client-disabled run | each mode works or is explicitly rejected; with no `dsh.client` the row is `na` with that reason; browser rendering goes in `limitations[]` |

When a journey fails, quote the five things a reader needs: `Jn.<subcheck>`,
the original `command[]`, `exitCode`, the last 20 lines of stderr, and the
absolute log path. Then attach the clause anchor the journey maps to (for
example `J2.toggle → 32-DSH-FLOW #R2`).

<a id="security-boundary"></a>
## Security boundary

J5 checks that permissions are declared consistently; it is static preflight,
not a security test. The proposed `DSC-15`–`DSC-22` live behind a separate
`--scope security` that `dsh-standards` 1.4.x does not ship yet, and they never
turn a FLOW journey into a security pass. Outside that scope a security finding
is advisory: it is capped at WARN and cannot change the FLOW verdict.

Static checks also cannot observe what a plugin does at runtime — which URLs it
reaches, which files it reads, or whether a prompt was corrupted. Those answers
need a sandbox with a network policy plus capture, and a sandbox that only
limits subprocess file writes is not that boundary. So do not write “FLOW
passes, therefore it is safe”; write what was observed, and keep the security
claim `not-run` until it was actually run. Details:
[security.md](security.md#scope).

## Status, not a score

| Status | Meaning |
|---|---|
| `runtime` | all eight journeys have pass evidence |
| `failed` | at least one journey has an attributable FAIL |
| `not-run` | no evidence, or fewer than eight journeys have pass evidence |

Each journey is recorded as `pass` / `fail` / `not-run` / `manual`; the v2 file
adds `na` for a justified skip, and the flat reader downgrades `na` (and `warn`)
to `not-run`. There is no `flow-warn` **FLOW state** — a partial run is
`not-run`, not a soft pass. The journey harness may print `flow-warn` or
`flow-blocked` in its own `dsh-flow-runtime/1` conclusion; neither is `runtime`.

`not-run` is never a pass. Do not publish a pass rate or a grade from FLOW.

## Current limit

The harness is a draft, and this document is deliberately ahead of it:

- The v2 shape above is the contract to record against. The audit's
  `--flow-evidence` reader still consumes the flat map, so project v2 → flat
  before you run it (see above). A v2 file fed to the audit directly reads as
  `0/8` and `not-run`.
- There is no shipped command that collects all eight journeys for you. J1 has
  a runtime fixture (`journey-runtime.mjs`); the other journeys are recorded by
  hand or by a fixture-level run. Browser rendering has no probe.
- `na`, `manual`, and `static` rows cannot become `runtime`. If one journey is
  `na`, FLOW stays `not-run` — write that, not a pass.

The source harness lives in
[`40-checker/scripts/journey.mjs`](https://github.com/PerryLink/dsh-standards/blob/main/40-checker/scripts/journey.mjs)
and
[`journey-runtime.mjs`](https://github.com/PerryLink/dsh-standards/blob/main/40-checker/scripts/journey-runtime.mjs);
the audit is
[`40-checker/scripts/level-audit.mjs`](https://github.com/PerryLink/dsh-standards/blob/main/40-checker/scripts/level-audit.mjs).
The three-layer audit reads FLOW evidence through `--flow-evidence`:

```sh
npx -p dsh-standards dsh-levels ./my-plugin --flow-evidence flow-evidence.json --format json
```

## Author checklist

- README has Quickstart, Permissions, Config, Upgrade/Uninstall, and
  Troubleshooting.
- Errors say what happened, what to run next, and where the doc is.
- Permissions say what the plugin can/cannot do and how to turn it off.
- Upgrade and uninstall are tested against real data, not only a clean install.
- No “certified”, “verified”, “audited”, “official”, “secure”, or “ranked” wording.
