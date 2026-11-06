# ENTRY: can it be recognized, installed, and started?

ENTRY is a compatibility gate, not a full quality audit. It is the first thing a
market, index, or user hits.

## What it covers

- package manifest: name, version, license, entry, `dsh.bundle.patch`
- engines/peer range for the DSH and Cordis generation being claimed
- Node `>=24.9.0` for the 0.2.2 line; `engines.dsh`, when declared, decides alone since 0.2.1-alpha.4 (prereleases participate)
- the declared entry point actually resolves
- the bundle patch parses and its target row resolves
- display metadata, labels, and forbidden-claim checks
- a runtime claim: plugin start or bundle G0–G3, when evidence is supplied

The exact rule IDs and evidence rules are in
[`31-DSH-ENTRY`](https://github.com/PerryLink/dsh-standards/blob/main/31-DSH-ENTRY%E5%85%A5%E9%97%A8%E8%A7%84%E8%8C%83.md)
and [`40-checker`](https://github.com/PerryLink/dsh-standards/tree/main/40-checker).
Every ID is also listed in [rules.md](rules.md); the copy-paste shapes are in
[recipes.md](recipes.md).

<a id="package-shape"></a>
## Package shape (DSC-01, DSC-02, DSC-03)

`DSC-01` is one report line but six subitems; the detail lines say which one
failed. `DSC-03` runs only in the listing profile — in the package profile it is
`NA` with `install spec not supplied (package profile)`, which is allowed.

| Detail | What the report says | Fix |
|---|---|---|
| `C-1.1` | `name must be a valid npm package name` / `version must be an exact SemVer version` | use a lowercase npm name and an exact `1.2.3` (or `1.2.3-beta.1`); a tag or range is not a version |
| `C-1.2` | `no resolvable runtime entry` / `entry escapes the package` | point `exports["."]` or `main` at a file that exists inside the package; no `../` target |
| `C-1.2` | `exports["."] points to a missing file` vs `entry not present in checkout; source/build hint exists` (WARN) | shipped packages need the built file; if the checker sees `src/index.ts` or a `build`/`prepare` script it downgrades to WARN, do not rely on that |
| `C-1.2` | `patch-only bundle; no runtime entry by design` (`NA`) | fine: a package that only ships `dsh.bundle.patch` has no runtime entry and is not charged for it |
| `C-1.3` | `no apply/default-class shape found by static scan` (WARN) | export `apply` (function plugin) or a default class (service plugin), not both; L1 is authoritative |
| `C-1.4` | `patch path escapes the package` / `patch file is missing` | keep the patch inside the package and reference it relatively, e.g. `"./cordis.patch.yml"` |
| `C-1.5` | `license is missing` (WARN) | add `"license": "MIT"` or another SPDX id |
| `C-1.6` | `private:true; not publishable` (`NA`) | expected for a local profile package, not for a marketplace entry |
| `G4` | `dsh.client exists but exports["./client"] is missing; a package-root row cannot resolve it` | add `exports["./client"]` and the package-root row — see [recipes.md](recipes.md#client-entry-and-root-row) |
| `C-2.1` | `neither engines.dsh nor a @deepseek-ai/dsh* peer range is declared` | declare `"engines": { "dsh": ">=0.2.2-0 <0.3.0" }` |
| `C-2.2` | `engines.dsh <range> does not satisfy runtime <v>` | widen the range to the host you target, or run the checker with `--runtime-version <v>` to judge against the right one |
| `C-2.3` | `engines.dsh must not be a workspace: range` | publish a real SemVer range; `workspace:` must not reach a tarball |
| `C-2.4` | `peer <name> range <range> conflicts with engines.dsh` (WARN) | the host decides on `engines.dsh` alone; align the peer anyway |
| `C-3.1`/`C-3.2`/`C-3.5` | `install spec` / `source is pinned` / market entry | listing only: exact version or verifiable tag, `#<40-hex>` for git, and a `format:1` index entry with pinned versions |
| `C-3.3`/`C-3.4` | `non-registry dependency` / `install-time build script present` (WARN) | pin git/url/file dependencies and declare what install scripts build |

## The two claims

| Claim | Meaning | What it needs |
|---|---|---|
| `static` / `recognized` | the package shape can be identified | manifest/entry inspection only |
| `runtime` | it actually starts or boots | plugin L1, or bundle G0–G3 |

`recognized` is not a pass. A bundle is not proven by importing its server
entry; it needs G0–G3. A client-only package is build-only unless a browser
probe exists.

<a id="runtime-surface"></a>
## Runtime surface (DSC-04 to DSC-09, DSC-14)

These are the L1–L3 checks: load, provide, effects, unload, restart, and
declared-vs-measured. They apply to `kind=plugin`; a `bundle` is verified by
`--scope entry` G0–G3 instead (in `--scope ds-c` it is `NA`), and a client,
preset, skill, theme, or MCP config is `NA` and must not claim runtime. `DSC-14`
is the ENTRY run gate: for a plugin it mirrors L1, for a bundle it is G0–G3 and
needs `--host`, and under `--entry-claim static` it is `NA`
(`entry static claim: no runtime evidence`).

| Detail | What the report says | Fix |
|---|---|---|
| `C-4.1`/`C-4.2` | `entry import failed: …` / `load failed: …` / `fiber state <n> is not ACTIVE (2)` | the entry must import and `apply()` without throwing; move timers, watchers, I/O, and subprocesses into `apply()` |
| `C-4.3` | `plugin load timed out` / `killed after <n>ms; plugin blocked the event loop` | do not block on module-scope work or a top-level `await`; the L1 child is hard-killed |
| — | `blocked by missing host dependency` (ERROR, `not-run`) | environment, not code: the plugin imports a bare package the fixture does not have. Install it or point `--runtime` at a complete host |
| `C-5.1`/`C-5.2` | `no provide declaration` (`NA`) / `declared provide <x> was not registered` / `owned by another fiber` | register the service from this plugin's own fiber: `ctx.provide(name, impl)` or a `Service` |
| `C-6.1` | `direct write to a Cordis private registration surface` | never assign into `ctx.events._hooks`, `ctx.reflect.store`, `ctx.registry._internal`, or `fiber._disposables` |
| `C-6.2` | `no registered effects observed` / `all effects are anonymous` (WARN) | give every effect a label: `ctx.effect(fn, 'my-plugin.timer')` |
| `C-7.1`–`C-7.3` | `getEffects().length=<n>` / `service store returned to baseline` / `registry.size <a> -> <b>` | every effect returns a disposer; `dispose()` must reach zero effects and restore the store and registry |
| `C-7.5` | `dispose failed: …` | await quiescence; do not fire-and-forget cleanup |
| `C-8.1`–`C-8.3` | `state after restart=<n>` / `effect count <a> -> <b>` / `revision … -> …` | `restart()` must re-enter `ACTIVE`, keep the effect count, advance revision/epoch, and work from a fresh `Context` |
| `C-9.1`–`C-9.3` | `declared provide <x> is missing from measured services` / `measured service <x> is not declared` / `inject declares <x> but no static ctx.<x> read was found` | declarations must equal reality: provide ⊆ measured, measured ⊆ declared, and each `inject` is read |

The runner stubs the services you declare in `inject` before it calls
`ctx.plugin()`, so a plugin that only needs declared services can reach `ACTIVE`.
Anything it cannot stub is reported as `ERROR`/`not-run`; that is not your
defect and must not be written as a pass.

```js
export const name = 'hello'
export const inject = ['tools']            // only what you read
export const provide = ['hello']           // only what you register

export function apply(ctx) {
  ctx.provide('hello', { greet: () => 'hello' })   // C-5
  ctx.effect(() => {                                // C-6, C-7
    const timer = setInterval(poll, 60_000)
    return () => clearInterval(timer)               // dispose → 0 effects
  }, 'hello.timer')
}
```

A bundle is verified by G0–G3, not by L1: G0 parses the patch, G1 composes the
rows, G2 runs the host compatibility gate, G3 boots the target rows. A `partial`
G3 is `ERROR`/`not-run`; only `G0-G3 verified; rows=<n>/<n>` with
`DSC-14 PASS` is a runtime claim. G4 is a composition property: with
`dsh.client`, the composed layer must contain a row whose `name` is the package
name and `exports["./client"]` must resolve.

<a id="client-files"></a>
## Client files (G4)

A client package is dual-face: the server half is loaded as a row, the browser
half is a prebuilt file at `exports["./client"]`.

- `dsh.client` must be a non-empty object; the host's Web consumer selects it
  with `platform: "web"`.
- `exports["./client"]` must be present. The host accepts a string, or an object
  with a string `default`; the checker only fails when it is missing.
- The composed config needs a **package-root row**: a patch `insert` whose
  `name` equals `manifest.name`. Without an active row the client scanner never
  sees the package, even though the export exists.
- The client file must be a built artifact and must be included in `files`, or
  the tarball ships a manifest that points at nothing.
- G4 is static. It does not prove the browser bundle renders; that is a
  build/browser probe and belongs in `limitations`, not in a runtime claim.

The copy-paste client manifest and patch row are in
[recipes.md](recipes.md#client-entry-and-root-row). A missing export or row is
reported as `G4: FAIL` under `DSC-01` (or as `DSC-14` with `--host`), never as a
pass.

## Run it

```sh
# Recognition only
npx dsh-standards ./my-plugin --scope entry --entry-claim static

# Runtime claim: provide the real host/runtime, not a stub
npx dsh-standards ./my-bundle --scope entry \
  --host /path/to/@deepseek-ai/dsh-app-boot/lib/index.js

# Machine-readable output
npx dsh-standards ./my-plugin --scope entry --entry-claim static --format json
```

Exit codes: `0` completed, `1` attributable FAIL, `2` incomplete/not-run,
`3` usage error. A `not-run` or `incomplete` result must not be written as a
pass.

## Author checklist

- `package.json` has a resolvable entry and, for bundles, a `dsh.bundle.patch`.
- The patch target row exists; ordered patch arrays are allowed.
- `engines.dsh` or an `@deepseek-ai/dsh*` peer range is declared. For 0.2.2, prefer `>=0.2.2-0 <0.3.0`; npm default semver needs an explicit `^0.2.2-alpha.3` union arm.
- `dsh.capabilities` lists every host surface the plugin touches (see below).
- `dsh.labels` is declared when the plugin modifies prompts, runs red-team
  workloads, adds a model provider, exposes remote access, or mirrors another
  project.
- The license is present; a missing license is advisory, not a fabricated pass.
- Module scope stays side-effect free: no top-level `await`, timer, `process.on`,
  fs write, or subprocess spawn. Do that work in `apply()` and clean up with
  `ctx.effect()`.
- README says how to install and what it needs.
- No “official”, “certified”, “secure”, or ranking claim.

## Declaration fields

<a id="declaration-fields"></a>
Two optional fields become checks `DSC-11` and `DSC-13` once they exist:

```json
{
  "dsh": {
    "capabilities": ["fs:read", "network:egress"],
    "labels": ["remote-access"]
  }
}
```

Both are **standard extensions**: this host does not read them yet. They are
declarations plus UI disclosure, not a sandbox and not enforcement. Declaring
`[]` and importing `node:fs` directly still passes `DSC-11`; the check only
compares declarations with static triggers.

Allowed `capabilities`: `fs:read`, `fs:write`, `shell`, `subprocess`,
`network:egress`, `network:ingress`, `credentials:read`, `credentials:list`,
`credentials:provider`, `llm:adapter`, `sessions:read`, `system-prompt:write`,
`tools:register`, `remote:expose`, `plugin:install`.

Allowed `labels`: `prompt-modification`, `red-team`,
`third-party-model-provider`, `remote-access`, `mirror`.

<a id="capability-triggers"></a>
## Capability triggers (DSC-11)

`C-11.2` is the check authors hit most: if `dsh.capabilities` exists, every
static trigger below must have its capability in the array, or the check FAILs
with `static trigger <cap> is not declared in dsh.capabilities`.

| Static trigger (source shape) | Declare |
|---|---|
| `ctx.webServer` / `ctx.webhookRuntime` | `network:ingress` |
| `installBundle(` / `removeBundle(` | `plugin:install` |
| `registerAdapter(` / `ctx.llm.register` | `llm:adapter` |
| `ctx.systemPrompt.section(` / `.context(` / `.variable(` | `system-prompt:write` |
| `ctx.tools.register(` | `tools:register` |
| `@Remote(` / `@RemoteScope(` | `remote:expose` |
| `.listRecords(` | `credentials:list` |
| `ctx.sessions` / `ctx.sessionQuery` | `sessions:read` |
| `ctx.shell` / `ctx.bash` | `shell` |
| `ctx.subprocess` | `subprocess` |
| `ctx.fs` | `fs:read` (a declared `fs:write` satisfies it) |
| `ctx.web` / a bare `fetch(` | `network:egress` |

Reading the other subitems:

- `C-11.1`: an unknown capability id is a FAIL; an empty array is a WARN. A
  missing field is a transitional WARN, and `C-11.2` is then **not evaluated** —
  so an undeclared array hides the very failure you want to see.
- `C-11.3`: a bundle patch that enables `@deepseek-ai/dsh-plugin-manager/tools`
  without `disabled: true` is a FAIL.
- `C-11.4`: a string literal that is exactly `danger-full-access` is a WARN; a
  mention in a comment or a `console.log` description is not.
- `C-11.5`: a declared capability with no matching trigger is a WARN (over-
  declaration). Keep declarations to what the scan can see; a dynamic call may
  not match.

The scan covers `.js`, `.mjs`, `.cjs`, `.ts`, `.tsx`, and `.jsx` files in the
package, and skips `tests`, `docs`, `scripts`, `examples`, `fixtures`, `bench`,
`tools`, and dot-directories, plus the other build and asset directories the
walker ignores. A `fetch(` in `tests/` does not require `network:egress`; the
same call in `lib/client.js` does.

<a id="credentials-and-seams"></a>
## Credentials and seams (DSC-12)

`DSC-12` is a declaration-consistency check, not a security audit. It looks for
direct access to the credential backing file and for global seam registration.

| Detail | What the report says | Fix |
|---|---|---|
| `C-12.1` | `credential backing-file access near a file-read API without credentials:provider` (a path in text or UI is PASS) | read through `ctx.credentials`; if you really are a provider, declare `credentials:provider` |
| `C-12.2` | `listRecords() used without credentials:list` | declare `credentials:list`, or stop enumerating records |
| `C-12.3` | `global seam provider registration detected` (WARN) | do not provide `shell`/`credentials`/`sandboxPolicy`/`sandbox`/`deepSeekAccount` unless that is the plugin's purpose |
| `C-12.4` | `danger-full-access/--add-dir literal` (WARN) | do not hard-code a sandbox bypass in a command or policy value |
| `C-12.6` | `dsh.commitments` missing (`NA`) or `missing commitment: <id>` (WARN) | optional: a boolean for each of `no-session-upload`, `no-third-party-proxy`, `no-credential-enumeration`, `no-silent-prompt-rewrite`, `no-adapter-bypass`, `no-webhook-auto-session`, `no-security-seam-replacement`, `third-party-endpoint-disclosure`, `no-danger-full-access` |
| `C-12.7` | `dsh.disclosure` missing (`NA`) or a shape WARN | optional: `endpoints` (https URLs), `retention` (string), `systemPrompt` (string) |

```js
// prefer: go through the seam
export function apply(ctx) {
  ctx.credentials.resolve('acme/api-key')
}

// avoid: the backing file is an implementation detail
// readFileSync(join(process.env.DSH_HOME, '.credentials.yaml'))
```

<a id="labels-and-mirror"></a>
## Labels and mirror (DSC-13)

A label is a declaration, not an endorsement. `C-13.2` maps a **declared
capability** to a required label:

| Declared capability | Required label |
|---|---|
| `system-prompt:write` | `prompt-modification` |
| `llm:adapter` **and** `network:egress` | `third-party-model-provider` |
| `network:ingress` | `remote-access` |
| `dsh.upstream` declared | `mirror` |

- `C-13.1`: an unknown label is a FAIL; a missing `dsh.labels` is a transitional
  WARN.
- `C-13.3`: `dsh.upstream` must be an `https://` URL and must not point at this
  package's own `repository`; a mirror also needs the `mirror` label.
- `C-13.4`: `official`, `verified`, `certified`, `secure`, `audited` in
  `dsh.labels` is a FAIL. The prose ban is separate: the checker does not scan
  README or `description`, so keeping those words out is on you.
- `C-13.5`: the `red-team` label should come with `dsh.usageScope`; without it
  the check only WARNs.

Do not label a plugin `official`, `verified`, `certified`, `secure`, or
`audited` — those words are treated as an endorsement claim and fail `DSC-13`.

## Import-time side effects

`DSC-10` is advisory — it never changes the verdict — but it records module-scope
work that runs before `apply()`: top-level `await`, timers, `process.on`, fs
writes, and subprocess spawns. The check is scoped to the entry module; the same
line in a shipped helper script that the entry does not import is not a hit.
Move the work inside
`apply()` and tie cleanup to `ctx.effect()`.

```js
// avoid: this runs when the package is imported, before the host can inject
writeFileSync(cacheFile, '')

export function apply(ctx) {
  // prefer: runs when the plugin is applied, with a cleanup hook
  ctx.effect(() => {
    mkdirSync(dir, { recursive: true })
    return () => rmSync(dir, { recursive: true, force: true })
  })
}
```

## What ENTRY does not do

It is not a security audit, sandbox, full contract audit, market gate, score, or
ranking. Those are separate concerns; do not borrow their authority.
