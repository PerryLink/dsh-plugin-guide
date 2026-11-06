# Recipes: copy these, then re-run the checker

<a id="before-you-copy"></a>
## Before you copy

Every block below was run against `dsh-standards` `40-checker` (`0.1.0`,
anchor `ce7073d51254`, default runtime `0.2.2-alpha.2`). The package name
`@acme/dsh-hello` is a placeholder — replace it everywhere, including the patch
row. The numbers in the verify sections are what the checker printed here; if
your output differs, the diff line is your fix.

<a id="minimal-packagejson"></a>
## Minimal `package.json`

A plugin that exports `apply`, registers one tool, and can also be composed as
a bundle row.

```json
{
  "name": "@acme/dsh-hello",
  "version": "0.1.0",
  "description": "Minimal DSH plugin that registers one tool.",
  "license": "MIT",
  "type": "module",
  "main": "./index.js",
  "exports": {
    ".": "./index.js"
  },
  "files": ["index.js", "cordis.patch.yml"],
  "engines": {
    "node": ">=24.9.0",
    "dsh": ">=0.2.2-0 <0.3.0"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh": ">=0.2.2-0 <0.3.0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh": { "optional": true }
  },
  "dsh": {
    "manifestVersion": 1,
    "kind": "plugin",
    "bundle": { "patch": "./cordis.patch.yml" },
    "capabilities": ["tools:register"],
    "labels": []
  }
}
```

| Field | What it buys | Check |
|---|---|---|
| `name` + exact `version` | a resolvable identity; a range or tag here is a FAIL | `C-1.1` |
| `exports["."]` (or `main`) | the entry must resolve to a file inside the package | `C-1.2` |
| `files` including the entry and patch | not checked, but `npm pack` can otherwise ship a manifest whose entry is absent | — |
| `engines.dsh` | the only declaration that decides compatibility alone; `workspace:` is a FAIL | `C-2.1`/`C-2.3` |
| `license` | avoids the `C-1.5` WARN; SPDX string | `C-1.5` |
| `dsh.bundle.patch` | the file a bundle layer composes; in-package relative path | `C-1.4` |
| `dsh.capabilities` | declares the host surfaces you touch; closed set of 15 | `C-11.1` |
| `dsh.labels` | declares high-risk categories; closed set of 5; `[]` is allowed | `C-13.1` |
| `dsh.kind` | `plugin` gets L1; `bundle` gets G0–G3; a client is static-only | `DSC-14` |

Notes that come from the checker, not taste:

- `dsh.capabilities` and `dsh.labels` are **standard extensions**: this host
  does not read them. They are declarations, not enforcement. Declaring them
  does not make the plugin safe, and omitting them is a WARN today.
- `dsh.manifestVersion`, `dsh.bundle`, `dsh.client` are host fields; keep
  `manifestVersion: 1`.
- `engines.node` is **not** checked by the checker. Keep it for humans, but do
  not expect a check to fail without it.

<a id="entry-module"></a>
## The entry module

`C-1.2` resolves the entry, so the file must exist. `DSC-10` and `DSC-06` both
look at what runs when and how it is cleaned up.

```js
export const name = 'dsh-hello'
export const inject = []

export function apply(ctx) {
  ctx.effect(() => {
    const timer = setInterval(() => {}, 60_000)
    return () => clearInterval(timer)
  }, 'dsh-hello.timer')

  ctx.tools.register({
    name: 'hello',
    description: 'Say hello.',
    async run() {
      return 'hello'
    },
  })
}
```

- `inject` lists only services you read; the runner stubs them for L1.
- `ctx.effect(fn, 'label')` gives the disposer a label, so `dispose()` can go
  back to zero (`C-6.2`, `C-7.1`).
- `ctx.tools.register(...)` is the static trigger that requires
  `capabilities: ["tools:register"]`.

<a id="cordispatchyml-insert"></a>
## `cordis.patch.yml`: the insert row

```yaml
- insert:
    - id: dsh-hello
      name: '@acme/dsh-hello'
```

Rules the checker and the host care about:

- `id` is the stable row identifier later layers use to override this row. Keep
  it short and unique.
- `name` is the module the loader imports. For the **package-root row** it must
  be the package name exactly (`@acme/dsh-hello`), because G4 looks for a
  composed row whose `name` equals `manifest.name`. An `id` alone is not a row.
- An insert is required. An `override`-only patch adds nothing to the profile;
  the plugin is never loaded (G1 reports no target rows, G3 reports no active
  rows).
- The patch file stays inside the package and uses a relative path; `..`,
  absolute paths, `~`, and `$VAR` are rejected (`C-1.4`).
- Do not enable `@deepseek-ai/dsh-plugin-manager/tools` in a patch unless you
  mean to hand every session the ability to install code (`C-11.3`).
- G0 parses, G1 composes rows, G2 runs the compatibility gate, G3 boots the
  target rows. Only G3 `verified` is a start; a `partial` result is
  `ERROR`/`not-run`, not a pass.

<a id="client-entry-and-root-row"></a>
## Client entry and the package-root row

A client is a dual-face package: a server/`dsh` half that is loaded as a row,
and a prebuilt browser bundle at `exports["./client"]`.

```json
{
  "name": "@acme/dsh-panel",
  "version": "0.1.0",
  "license": "MIT",
  "type": "module",
  "exports": {
    ".": "./index.js",
    "./client": "./lib/client.js"
  },
  "files": ["index.js", "lib", "cordis.patch.yml"],
  "engines": { "dsh": ">=0.2.2-0 <0.3.0" },
  "dsh": {
    "manifestVersion": 1,
    "kind": "client",
    "client": { "platform": "web" },
    "bundle": { "patch": "./cordis.patch.yml" },
    "capabilities": [],
    "labels": []
  }
}
```

```yaml
# cordis.patch.yml — the same package name as the manifest
- insert:
    - id: dsh-panel
      name: '@acme/dsh-panel'
```

The server half only has to load as a row; the browser half is the built file:

```js
// index.js — the server half; lib/client.js is the browser half
export const name = 'dsh-panel'
export const inject = []

export function apply() {}
```

What each piece is for:

| Piece | Why it is required | Where it shows up |
|---|---|---|
| `dsh.client` (non-empty) | marks the package as having a browser face | `G4`, `C-1` |
| `dsh.client.platform` | the host selects the Web consumer with `"web"`; the checker only requires `dsh.client` to be non-empty | host manifest type |
| `exports["./client"]` | a string path, or an object with a string `default`; must point at a **built** file (the checker only fails when it is absent) | `G4` → `DSC-01` FAIL if missing |
| root row (`name` = package name) | the client scanner reads the loader's rows; no active row means the bundle is never discovered | `G4` in the bundle smoke |
| `dsh.client.inject` | informational package names, not Cordis injection | host only |
| `dsh.client.external` | extra module-table requests; omit unless you need them | host build |

`"capabilities": []` says the server half touches no host surface. The checker
still WARNs (`C-11.1: dsh.capabilities is empty`) and the report's reason line
says `advisory: DSC-11`; in ENTRY that WARN is advisory, so the status stays
`pass`. If the server half does touch something, fill the array from the trigger
table in [entry.md](entry.md#capability-triggers) — an empty array is not a
substitute for the capabilities you actually use.

Two failure shapes you will see, and how to tell them apart:

```text
G4: FAIL dsh.client exists but exports["./client"] is missing; a package-root row cannot resolve it
```

The message names both causes. Add `exports["./client"]` first; if the export
already exists, the bundle smoke is telling you the composed root row is
missing — check that the patch `name` equals `manifest.name` and that the row is
`insert`ed.

```text
DSC-14  FAIL  C-14  L1  G4 failed: dsh.client has no package-root row or missing client export
```

That is the same condition on a runtime claim. Without `--host`, a client is
`DSH-ENTRY recognized` at best, and `DSC-14` is `NA`: build-only is not runtime.

<a id="verify"></a>
## Verify what you copied

```sh
# recognition only (no runtime claim): expect status=pass, exit=0
npx dsh-standards . --scope entry --entry-claim static

# plugin runtime: expect DSC-14 PASS and level "DSH-ENTRY runtime"
npx dsh-standards . --scope entry \
  --runtime /path/to/cordis/lib/index.js

# bundle: expect "G0-G3 verified; rows=1/1"
npx dsh-standards . --scope entry \
  --host /path/to/@deepseek-ai/dsh-app-boot/lib/index.js

# machine-readable: read .conclusion.level and .g4
npx dsh-standards . --format json
```

For the plugin recipe above, the static run prints:

```text
DSC-01  PASS  C-1    L0
DSC-02  PASS  C-2    L0
DSC-11  PASS  C-11   L0
DSC-12  PASS  C-12   L0
DSC-13  PASS  C-13   L0
level: DSH-ENTRY recognized
```

For the client recipe, the same run ends `status=pass`, prints
`level: DSH-ENTRY recognized`, and still shows
`C-11.1: dsh.capabilities is empty` with `reason: advisory: DSC-11`. That is the
transitional empty-array WARN, not a G4 failure. A `kind: client` package is
static-only: `DSC-14` is `NA`, so `--host` cannot turn it into
`DSH-ENTRY runtime`. Only a package installed as a bundle (`kind: bundle`)
reaches runtime through G0–G3, and its G4 needs both the client export and the
root row. If `G4` fails you get `exit=1` and no level — add the missing export
or row, do not reword the report.
