# Rules: decode a check report in one table

<a id="how-to-read"></a>
## How to read one report line

A DS-C report has one line per check: `id`, `result`, `clause`, `layer`,
`reason`. The detail lines under it (`C-1.2`, `C-11.5`, `G4`) are what you
actually fix.

| Result | Meaning | What it does to the verdict |
|---|---|---|
| `PASS` | the check ran and found nothing | counts as pass |
| `WARN` | ran, found something worth fixing | does not fail the run; `status` becomes `warn` (advisory checks excepted) |
| `FAIL` | ran, found an attributable defect | `status=fail`, exit `1` |
| `NA` | the check does not apply (wrong `dsh.kind`, no field, package profile) | allowed; not a pass |
| `ERROR` | the check could not run (`coverage: not-run`, e.g. no `--runtime`/`--host`) | `status=incomplete`, exit `2` |

Exit codes: `0` completed (pass or warn), `1` attributable FAIL, `2`
incomplete/not-run, `3` usage error. `WARN` is not a clean pass and
`incomplete` is not a pass — both are printed as such on purpose.

The JSON report also carries a sibling `advice[]` array: one entry per live
detail, with `title`, `why`, `fix`, `docsUrl`, `severity`, and `evidence`. It is
additive and never changes the verdict (turn it off with `--no-advice`). The
`docsUrl` follows the checker's `DOCS_BASE`: 1.6.1 pins `v0.4.6`, and the 1.6.2
release moves it to guide `v0.5.0`. The `docs/security.md` anchors used by the
`C-15`–`C-22` advice exist in 0.5.0; if a link points at an older page, this
table is the current mapping.

<a id="scope-matrix"></a>
## Which checks run in which scope

| Scope / profile | Mandatory checks | Notes |
|---|---|---|
| `--scope ds-c` (default), `package` | 01, 02, 04–09, 11, 12, 13 | 03 is `NA`, 10 is advisory, 14 is not run |
| `--scope ds-c`, `listing` | + 03 | install spec / market index are now judged |
| `--scope entry --entry-claim static` | 01, 02, 11, 12, 13 (+ 03 for listing) | 04–09 are attempted and printed (usually `ERROR`/`NA`), 14 is `NA`; a `DSC-11`/`DSC-12`/`DSC-13` FAIL is downgraded to `WARN` |
| `--scope entry --entry-claim runtime` | + 14 | 14 carries the runtime verdict, not 04–09 |
| `--scope mvp` | 01, 02, 04–09 | the MVP subset, labelled `MVP-13` |
| `--scope security` (1.6.0+) | + 15, 16, 17, 21; 18/19/20/22 advisory | `checks[]` becomes 22 (14 + 8); DS-C 01–14 are unchanged and the report gains an additive `security` block. `15`/`16`/`17` blocking, `21` mandatory but WARN-only |

<a id="table"></a>
## The check table

| Check | Clause | Blocking or advice | One-line fix | Guide |
|---|---|---|---|---|
| **DSC-01** | C-1 manifest + entry | Blocking (ds-c, entry). C-1.3/C-1.5/C-1.6 are WARN/NA. A `G4` detail is reported here. | Exact `name`/`version`, `exports["."]` or `main` resolving to a file inside the package, in-package `dsh.bundle.patch` paths, and a `license`. | [entry.md § package shape](entry.md#package-shape) · [recipes](recipes.md#minimal-packagejson) |
| **DSC-02** | C-2 version range | Blocking (ds-c). In ENTRY, a static claim downgrades the whole check to WARN; a runtime claim keeps `C-2.2`/`C-2.3` blocking. | Declare `engines.dsh` as a range that contains the host you target (`>=0.2.2-0 <0.3.0`); never publish `workspace:`. | [entry.md § package shape](entry.md#package-shape) |
| **DSC-03** | C-3 install source | Blocking (listing only); `NA` in package profile. | Pin the source: exact version or verifiable tag, `#<40-hex>` for git, an in-package path, and a `format:1` market entry with pinned versions. | [entry.md § package shape](entry.md#package-shape) |
| **DSC-04** | C-4 load to ACTIVE | Blocking (ds-c, when a runtime runs). | Make the entry import cleanly and reach `ACTIVE`: no throw at import, no module-scope work, declare `inject` or read `ctx.get()`, move work into `apply()`. | [entry.md § runtime surface](entry.md#runtime-surface) |
| **DSC-05** | C-5 declared provide | Blocking (ds-c). | Every name in `export const provide` must be registered by this plugin's own fiber via `ctx.provide(name, impl)`. | [entry.md § runtime surface](entry.md#runtime-surface) |
| **DSC-06** | C-6 effects | Blocking (ds-c); anonymous effects are WARN. | Wrap timers, watchers, sockets, and subprocesses in `ctx.effect(fn, 'label')`; never write `ctx.reflect.store` or `ctx.events._hooks`. | [entry.md § runtime surface](entry.md#runtime-surface) |
| **DSC-07** | C-7 unload residue | Blocking (ds-c). | Return a disposer from every effect so `dispose()` leaves `getEffects()===0`, the service store at baseline, and `registry.size` unchanged. | [entry.md § runtime surface](entry.md#runtime-surface) |
| **DSC-08** | C-8 restart idempotence | Blocking (ds-c). | Make `restart()` re-enter `ACTIVE`, keep the effect count, advance revision/epoch, and succeed from a fresh `Context`. | [entry.md § runtime surface](entry.md#runtime-surface) |
| **DSC-09** | C-9 declared vs measured | Blocking (ds-c) for `C-9.1`; `C-9.2`/`C-9.3` are WARN. | Keep declarations equal to reality: provided ⊆ measured, measured ⊆ declared, and each declared `inject` is really read as `ctx.<service>`. | [entry.md § runtime surface](entry.md#runtime-surface) |
| **DSC-10** | C-10 import-time work | Advice only; never changes the verdict. | Move module-scope `await`, timers, `process.on`, fs writes, and spawns into `apply()` and clean up with `ctx.effect()`. | [entry.md § import-time side effects](entry.md#import-time-side-effects) |
| **DSC-11** | C-11 capabilities | Blocking (ds-c); `WARN` in ENTRY, and a `WARN` here is advisory even in ds-c. | Declare `dsh.capabilities` from the closed set, add one entry per static trigger, and never enable `@deepseek-ai/dsh-plugin-manager/tools` in a patch. | [entry.md § capability triggers](entry.md#capability-triggers) |
| **DSC-12** | C-12 credentials + seams | Blocking (ds-c); `WARN` in ENTRY. | Read credentials through `ctx.credentials`, declare `credentials:list` for `listRecords()` and `credentials:provider` for a provider, and never read the backing file. | [entry.md § credentials and seams](entry.md#credentials-and-seams) |
| **DSC-13** | C-13 labels + mirror | Blocking (ds-c); `WARN` in ENTRY, advisory as a WARN. | Use only the five labels, add the label each capability requires, point `dsh.upstream` at an https URL that is not this package **and** add `mirror`, and drop endorsement words. | [entry.md § labels and mirror](entry.md#labels-and-mirror) |
| **DSC-14** | C-14 entry run | Blocking only for a runtime claim (`--scope entry`). | Supply the real host: `--host` for a bundle (G0–G3) or `--runtime` for a plugin (L1); a client or preset cannot claim runtime. | [entry.md § runtime surface](entry.md#runtime-surface) |
| **DSC-15** | C-15 lifecycle scripts | **Blocking only under `--scope security`** (1.6.0+); not run in the default scopes. It reads the referenced in-package script body (≤512 KB) as well as the command string. | Ship no `preinstall`/`install`/`postinstall`/`prepare`; if one is unavoidable, no download-to-shell, `base64 -d`, or `node -e`. | [security.md § author 4](security.md#author-files) |
| **DSC-16** | C-16 dynamic execution | **Blocking only under `--scope security`**. `eval`/`Function`/`vm`/`_compile`/`process.binding` FAIL; a bare `child_process` import is WARN in 1.6.1, and the dangerous-subprocess FAIL is 1.6.2. | Remove `eval`, `new Function`, `vm.runIn*`, `module._compile`, and `process.binding`; dynamic `import()` takes a static path only. | [security.md § author 4](security.md#author-files) |
| **DSC-17** | C-17 sensitive files | **Blocking only under `--scope security`**. | Read credentials through `ctx.credentials`; never read `~/.ssh`, `~/.aws`, `.npmrc`, `.netrc`, or a credential backing file. | [security.md § author 2](security.md#author-credentials) |
| **DSC-18** | C-18 egress endpoints | **WARN** under `--scope security` (clue, not blocking). | Use a constant `https` allowlist, `redirect: 'manual'`, no credentials across origins, and disclose third-party endpoints. | [security.md § author 3](security.md#author-egress) |
| **DSC-19** | C-19 obfuscation/binary | **Advisory** under `--scope security`. | No minified blobs or binary-only code; ship wasm/native with source, build method, and `sha256`. | [security.md § author 4](security.md#author-files) |
| **DSC-20** | C-20 prompt injection | **Advisory**: static v1 (external text into `systemPrompt`, instruction-like literals) plus a runtime hook in v2; never blocking. | Treat tool/web/file/session text as untrusted, validate `output.schema`, and wrap external text before it reaches a prompt. | [security.md § author 5](security.md#author-prompt) |
| **DSC-21** | C-21 supply chain | **Mandatory under `--scope security`, but WARN-only and never blocking** (listing included). | Commit the lockfile, pin dependencies, reject typosquat/lookalike scopes, and treat an unpinned or script-bearing dependency as `not-run`. | [security.md § author 6](security.md#author-publish) |
| **DSC-22** | C-22 provenance/integrity | **Advisory**, never blocking. | Publish with provenance/attestations; `dist.integrity` only binds the tarball to the registry, not the code to a source. | [security.md § author 6](security.md#author-publish) |

`DSC-14` has no `C-14` in the clause text; it is the ENTRY run-set gate
(`ENT-14` in 31-DSH-ENTRY). Treat it as "did the thing actually start".

`DSC-15`–`DSC-22` shipped in `dsh-standards` 1.6.0; 1.5.x and earlier treat
`--scope security` as an unknown scope and exit `3`. Only `--scope security`
makes `15`/`16`/`17` blocking; `21` is mandatory but WARN-only and never blocks
(listing included). In every other scope the eight stay out of `checks[]`; their
FAILs are capped to WARN in the separate `security` block and never change the
DS-C verdict. They are static evidence: three can fail mechanically, one only
warns, four only return clues, and no PASS proves a plugin safe. The
author/user/market checklists are in [security.md](security.md).

<a id="warn"></a>
## Two things that look like passes but are not

**Advisory WARN.** `DSC-10` is always advisory. `DSC-11` and `DSC-13` become
advisory whenever the check itself returns `WARN`, because the host does not
read those fields yet. The effect is visible: this guide's own report prints
`DSC-11 WARN`, `DSC-13 WARN`, yet `coverage.warn=0` and
`reason: advisory: DSC-11, DSC-13`. Read the reason line, not only the coverage
counts. A `FAIL` that ENTRY downgrades to `WARN` is a plain WARN and does stay
in the counts.

**`incomplete`.** If a mandatory check has `coverage: not-run` (no runtime, no
host, a killed child, a partial AST parse), the status is `incomplete` and the
exit code is `2`. The report prints `NOT A DS-C PASS`. Do not paste a
`not-run` row into a README as a pass; write `not-run` or run the check.

<a id="not-checked"></a>
## What the checker does not check

These are good practice but **not** evidence of a pass, because no check reads
them:

- `engines.node` (the 24.9 line is a guide recommendation; `DSC-02` looks at
  `engines.dsh` and `@deepseek-ai/dsh*` peers only)
- README install instructions, display metadata, keywords, `icon`
- endorsement words in prose, `description`, or README — `C-13.4` scans only
  the `dsh.labels` array
- whether a `red-team` label was actually used for red-team work (`C-13.5`
  only asks for `dsh.usageScope`)
- browser rendering of a client bundle (`G4` is a static shape check)
- runtime network egress, file reads, or prompt corruption — `DSC-18`/`DSC-20`
  are static clues; observing the behavior needs a sandbox with a network policy
  and capture (see [security.md](security.md#scope))
- whether a dependency's own install script ran, or whether a package is
  malicious. `DSC-15`/`DSC-21` cover known shapes, not intent.

In `dsh-standards` 1.6.10+ the `check` subcommand never runs the PATH `dsh` by
itself. It resolves the C-2 anchor in this order: `--host-version` →
`DSH_HOST_VERSION` → the opt-in `--allow-host-probe` (which resolves the `dsh`
JS entry and runs `node <entry> --version`) → unknown. With no source the anchor
records the fallback version with `source=default` and `suspect=true`, and
`C-2.1`/`C-2.2` are **NA — compatibility not judged**; they are neither PASS nor
FAIL, and the command still exits `0`. Exit `0` therefore does not mean the
range was judged.

Pass the host you actually target — for the current line that is
`0.2.2-rc.3`:

```sh
npx -y dsh-standards@1.6.11 check . --scope entry --entry-claim static --no-exec \
  --host-version 0.2.2-rc.3
```

The raw checker (`dsh-plugin-verify`) differs: with neither `--host-version` nor
`--runtime-version` it tries `dsh --version` from `PATH`; if that fails it also
falls back to the constant and reports C-2 as NA. `--host-version` is the
explicit anchor and skips the probe; `--runtime-version` is the older name for
the same anchor, so prefer `--host-version` in the `check` path.

If a report FAILs and you cannot find the ID here, open
[`docs/recipes.md`](recipes.md) for the copy-paste shape, then re-run the same
command and compare the detail lines.
