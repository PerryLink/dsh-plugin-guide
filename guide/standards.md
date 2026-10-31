# DSH plugin adoption levels: ENTRY, FLOW, BOOST

> **Status: community draft, non-official.** This chapter explains the three-level model maintained in the `dsh-standards` project (a private draft at the time of writing; ask the maintainer for access). It is teaching material, not a certificate, ranking, security audit, or official DeepSeek position. If your copy of the canonical clause text or `spec/levels.json` disagrees with this summary, the canonical files win. Chinese version: [standards.zh-CN.md](standards.zh-CN.md).

## Three levels, three different questions

In the DSH plugin ecosystem, "qualified" is at least three questions, and they are not three marks on one ruler. **DSH-ENTRY** asks whether an existing plugin can be recognized, installed, and booted on a target DSH line with little or no code change — the compatibility baseline ("装完能跑"). **DSH-FLOW** asks whether a user can then install, configure, use, recover, upgrade, and uninstall it without surprises — the recommended adoption experience ("用起来顺"). **DSH-BOOST** asks whether the plugin uses Cordis primitives (effects, inject, volatile, events, seams, jobs, bounded parallelism) to make development and use measurably cheaper — guiding practice recorded as evidence cards, not a badge ("用 Cordis 做得更省").

A plugin can be `ENTRY=runtime` and `FLOW=not-run`; a `BOOST`-measured plugin can still fail `ENTRY`. That is why the three levels are judged, cited, and expired **separately**. Never collapse them into one score, never use `BOOST` to infer `ENTRY`, and never call the result a "level" without naming its evidence state.

## The GB analogy (analogy only, not a standard)

> **Analogy only — non-official.** The GB / GB∕T / GB∕Z columns borrow the *intuition* of a baseline / recommended / guidance layering. This project has no standards-issuing body, no standard number, no accreditation, no legal effect, and no DeepSeek endorsement. `DSH` is an abbreviation; DeepSeek Harness is a DeepSeek trademark. Do not describe a plugin as "GB compliant", "nationally certified", "officially certified", or "ranked" on the basis of this model.

| Dimension | GB (analogy) | GB∕T (analogy) | GB∕Z (analogy) |
|---|---|---|---|
| What it stands for | mandatory national standard | recommended national standard | guiding technical document |
| This project | **DSH-ENTRY** | **DSH-FLOW** | **DSH-BOOST** |
| Question | can it be installed and run? | is it smooth after install? | is Cordis used efficiently? |
| Adoption | self-adopted; must pass if you claim it | recommended; not adopting is not "nonconforming" | guidance; register practices and evidence |
| If it fails | cannot claim compatibility | not recommended for broad adoption | cannot claim a speed-up |
| Evidence | G0–G5 + static/runtime state | J1–J8 + journey records | LEV-1–8 + evidence cards |
| Force in this project | none; only self-consistency when cited | none | none |

## Two axes: adoption depth and evidence state

Depth and evidence are independent coordinates. `ENTRY` is not "bronze", `FLOW` is not "silver", and `BOOST` is not "gold": the depth says **what was judged**, the evidence state says **how strongly**. Always write both, for example `ENTRY=runtime, FLOW=manual(J1–J8), BOOST=not-measured`.

| Depth ↓ / evidence → | `not-run` | `recognized` / `static` | `runtime` | `manual` | `measured` | `blocked` / `failed` |
|---|---|---|---|---|---|---|
| **DSH-ENTRY** | untested; no claim | manifest, entry, patch recognized; no boot | real boot; target rows ACTIVE or disabled | — (not a substitute for boot) | — | host/fixture blocked, or plugin-attributable failure |
| **DSH-FLOW** | journey not run; no claim | static prep only (manifest, README); not a journey | automated journey passed on a recorded host | a person ran the journey and recorded steps/logs | — (use runtime/manual per journey) | environment blocked, or journey failure |
| **DSH-BOOST** | not measured; no claim | pattern present in code; not evidence of benefit | — (execution alone is not a measurement) | — | evidence card reproduces on the recorded anchor | benchmark blocked, or claimed gain contradicted |

Cells marked "—" are category errors, not passes. The evidence words mean:

| State | What it supports | What it never means |
|---|---|---|
| `not-run` / `not-measured` | "this was not tested" | a pass, or "should work" |
| `recognized` / `static` | structural recognition: manifest, entry, patch, client export | a running process or a rendered UI |
| `runtime` | a real boot or real execution on a recorded host version/commit | UI correctness, production readiness, security |
| `manual` | a human walked the journey with steps and logs recorded | automation, or a claim that covers other platforms |
| `measured` | a reproducible evidence card with environment, input, command, control, result | a production benchmark or a billing claim |
| `blocked` | the host or fixture prevented judgment | a plugin failure, or a pass |
| `failed` | a reproducible failure attributable to the plugin | "environment issue" without evidence |
| `stale` | past its expiry window | current evidence; quote it only as stale |

Three misreadings this table exists to stop:

- **`runtime` is not UI-rendered.** A booted server-side row, or a client module that loaded, does not prove the slot renders correctly. `client-module-loaded` ≠ `UI-rendered`; render correctness needs its own observation (slot output, console errors, a screenshot).
- **`static` is not `runtime`.** Parsing and recognition say the artifact is structurally plausible. They do not say a process booted it, or that a dependency resolved at boot.
- **`not-measured` is not a pass.** Absence of evidence is a third state with its own label. Write "not tested", not "passes" or "should work".

## DSH-ENTRY: compatibility baseline

**What it answers.** Can an existing plugin be recognized, installed, and booted on the target DSH line without changing its code?

**Required evidence.** Four static gates plus one runtime gate and one process gate:

| Gate | Check | Owner |
|---|---|---|
| G0 | `dsh.bundle.patch` parses | plugin |
| G1 | base + sample compose; inserted row names resolve | plugin |
| G2 | `evaluatePluginCompatibility` admits, or an explicit exact-version exemption applies | host |
| G3 | real `boot()` leaves every target row `ACTIVE` or `disabled` | plugin/host/fixture |
| G4 | when `dsh.client` exists: `exports["./client"]` and a package-root row (static) | plugin |
| G5 | report carries host version/commit and artifact mtime; expired evidence is `stale` | process |

G0–G2 and G4 pass in static inspection, which supports `recognized`; `runtime` requires G3 on a recorded host. `blocked` and `failed` are different outcomes and must be reported with their cause.

**What it does not claim.** Security, UI correctness, production readiness, full feature correctness, official endorsement, or that the plugin will work on an untested DSH line.

**How to self-check.** Record `dsh --version`, the host commit, and the artifact mtime. Run `dsh-plugin-dev check --json` for the 16 local static checks (a subset of `dsh-plugin-doctor`'s 33 — see [family-toolchain.md](family-toolchain.md)), then the standards repo's entry checker (commands below). For bundles, also run `dsh --profile <name> --dump-config` and look for `patch: entry <id> not found`, then boot and read the row states. Write the claim as `DSH-ENTRY: runtime (dsh 0.2.1-rc.2, commit <sha>, 2026-11-01)`.

## DSH-FLOW: adoption experience

**What it answers.** Once installed, can a user install it, configure it, use it, recover from errors, upgrade, and uninstall it without surprises?

**Required evidence.** The eight user journeys J1–J8: install/remove; enable/disable; configuration and validation; first success (quickstart and error triad); permissions and disclosure; upgrade/rollback/uninstall; observability and diagnostics; and client/server shapes (headless, web, client-off). Each journey records the command, environment, result, log path, and time. A manual journey is valid evidence when it says `manual`; a journey that was not run is `not-run`, not a pass.

**What it does not claim.** Certification, ranking, security review, every UI layout, every platform, or that a journey tested on one host generalizes to another.

**How to self-check.** Use a throwaway `DSH_HOME`: `add` → `--dump-config` shows the layer → `remove` → the layer and dependencies are gone. Boot with `{}` and with an invalid value (it must fail loudly with a field path). Follow the README as a new user with a five-minute timer; check the error triad (cause, next command, doc anchor). Test upgrade then rollback, and for client plugins test headless, web, and client-off. Start from [plugin-dev-guide.md](plugin-dev-guide.md) §7 and the release checklist in [release-engineering.md](release-engineering.md).

## DSH-BOOST: guiding practice

**What it answers.** Does the plugin use Cordis primitives to make development and use measurably cheaper, and is the claimed saving reproducible?

**Required evidence.** LEV-1–8: effects are reversible and return to baseline; required services are injected and polling is absent; hot config uses `volatile()` without remounting; event modes match and waterfall observers call `next()`; seams/isolate/group are used only when needed; tool and prompt prefixes stay byte-stable with volatile data in `systemPrompt.context`; long work uses jobs and bounded parallelism with cancellation; and bundle/preset composition is expressed in patches, with an evidence card per practice. Each card records environment, input scale, command, a **negative control**, result, version anchor, and limitations.

**What it does not claim.** A production benchmark, a billing or cache-hit rate, a total score, a ranking, or that one fixture generalizes to another workload. LEV-6 prefix stability is the one practice directly priced in tokens; the others still need a card.

**How to self-check.** Pick one LEV and write the card before optimizing the next. Run the negative control (for example, a normal config field that *does* remount, or a volatile nonce that *does* break the prefix). Record `dsh`, `cordis`, Node, and the commit; a number without an anchor is not evidence. Link the code path to [plugin-dev-guide.md](plugin-dev-guide.md) §3.3 (effects), §3.6 (config), §4.3 (jobs), and §5 (seams).

## How to move up

**ENTRY → FLOW.** First get a real `runtime` claim: boot the bundle and record the host version/commit. Then make the first five minutes work: a quickstart, a working `add`/`remove` in a temporary `DSH_HOME`, empty-config boot, loud invalid-config errors with a field path, and an error triad in every failure message. Test one upgrade and one rollback, and check that uninstall leaves no layer or dependency behind. For client plugins, test headless, web, and client-off before claiming a UI. Relevant chapters: [plugin-dev-guide.md](plugin-dev-guide.md) §7 (packaging, install, and pitfalls), [release-engineering.md](release-engineering.md) §7 (pre-tag gate), and [quick-reference.md](quick-reference.md).

**FLOW → BOOST.** Move timers, listeners, connections, watchers, and subprocesses into `ctx.effect()` with labels, then measure that reloads return to baseline. Declare required services in `inject`, use `ctx.get()` only for optional ones, and remove polling. Make adjustable fields `volatile()` and measure zero remounts on change. Keep tool and prompt prefixes stable; put volatile data in `systemPrompt.context`. Move long work to `ctx.jobs` and bound parallel calls, then verify cancellation. Start with LEV-6 and LEV-3 — the draft already carries measured examples for both, and each has a clean negative control. Relevant chapters: [plugin-dev-guide.md](plugin-dev-guide.md) §3.3, §3.6, §4.3, §4.8; [references/official-plugin-dev-skill.md](../references/official-plugin-dev-skill.md); and the official extension cookbook in [references/official-docs/docs/cookbook/extension-cookbook.md](../references/official-docs/docs/cookbook/extension-cookbook.md).

**Do not move up for its own sake.** A frozen or retiring plugin should not buy a `BOOST` card; check [when-to-retire-a-plugin.md](when-to-retire-a-plugin.md) first. A plugin whose capability is better served by another implementation should be retired, not polished.

## Certification grades are orthogonal

Certification grades A–D describe quality and evidence depth; ENTRY/FLOW/BOOST describe adoption depth. They are orthogonal: `A` is not "ENTRY level", `D` is not "BOOST failed". A certified plugin can still be `ENTRY=blocked`, and a `BOOST=measured` plugin can still have a supply-chain problem. State each scope separately; never compute a total from grade plus level.

## Canonical source and checker commands

- Canonical repository (private draft): `PerryLink/dsh-standards` — clauses `31` (ENTRY), `32` (FLOW), `33` (BOOST), `34` (the GB analogy), and `spec/levels.json`. Ask the maintainer for access.
- Audit tool in that repository: `40-checker/scripts/level-audit.mjs`. It is not bundled with this guide; if your checkout does not have it, use `spec/levels.json` for definitions and the entry checker below.
- Existing entry checker: `40-checker/bin/dsh-plugin-verify.mjs`.

```sh
git clone <your-access-url-for-PerryLink/dsh-standards>
cd dsh-standards
# entry, static only (does not claim runtime)
node 40-checker/bin/dsh-plugin-verify.mjs <plugin-dir> --scope entry --entry-claim static
# audit (run only if the file exists in your checkout)
node 40-checker/scripts/level-audit.mjs <plugin-dir>
```

`dsh-plugin-dev check` is a static assistance tool, not a level audit; `dsh-plugin-doctor` maps its R/K/D/X results to an ENTRY status and does not cover FLOW or BOOST. Neither tool can issue a level by itself.

## For reviewers: a short checklist

- [ ] The claim names **both** a level and an evidence state, not just "compatible".
- [ ] Evidence carries the DSH version, host commit, Cordis version, date, and scope.
- [ ] `runtime` was observed, not inferred from `static`; static is labelled `recognized`.
- [ ] No `not-run`, `not-measured`, or `blocked` was rewritten as a pass.
- [ ] UI claims have a render observation; `client-module-loaded` is not called rendered.
- [ ] FLOW claims list which journeys ran, who ran them, the command, result, and log path.
- [ ] BOOST claims have a card with a negative control and a limitation, and no production percentage is inferred from one fixture.
- [ ] Grades A–D are stated separately and are not used as a level.
- [ ] No "official", "certified", "national standard", "GB compliant", or "ranked" wording.
- [ ] Evidence is inside its expiry window; expired evidence is labelled `stale`.

---

*Canonical model: the private `dsh-standards` project. This chapter is non-official and grants no certification. Corrections should go to the canonical repo first, then be mirrored here.*
