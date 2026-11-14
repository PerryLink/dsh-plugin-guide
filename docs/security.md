# Security: what a plugin can do, and what the checks cannot prove

> **Read this first.** A DSH plugin runs in the host's process, as the same
> user, with the host's full permissions. The host does not sandbox a loaded
> plugin: the sandbox only restricts file writes made by tool subprocesses, and
> network/process visibility is outside its vocabulary. `dsh.capabilities` is a
> declaration the host does not read or enforce. So a plugin can open and write
> files, spawn processes, reach the network, and read the credential store
> whether or not it declares that it does.

`DSC-15`–`DSC-22` are the **static security checks** shipped in
`dsh-standards` **1.6.0**; `--scope security` is a released flag
from 1.6.0 on (1.5.x and earlier treat `security` as an unknown scope and exit
`3`; 1.6.4 supports it).
With `--scope security`, `checks[]` carries all **22** checks (`DSC-01`–`DSC-14`
plus `DSC-15`–`DSC-22`); the default `ds-c` run still carries 14 and reports the
eight in the additive `security` block. Three can block (`15`, `16`, `17`), one
is mandatory but **WARN-only and never blocks** (`21`, listing included), and
four only produce clues (`18`, `19`, `20`, `22`); all eight reduce risk, and
**none of them proves a plugin is safe**.

The `security` block is a **separate view**, a scope, not a fourth layer. In the default
scope a security `FAIL` is capped to `WARN` inside `security.checks[]`; it is
listed only in `security.warn[]` (`security.blocking[]` stays empty), does not
enter `buckets.blocking` or `conclusion.headline`, and changes neither `status`
nor the exit code. Only `--scope security` puts `15`/`16`/`17` into `checks[]`,
where a `FAIL` enters `buckets.blocking`, the headline, `status=fail` and exit
`1`. `DSC-21` never FAILs, so it never blocks in either profile. Read the scope,
and read the block's `checks[]`, not just its four arrays — see
[Reading the `security` block](#security-block).

## The trust boundary in one table

| Fact | What follows |
|---|---|
| plugin and host share a process | `import node:fs`, `fetch`, `child_process`, and `process.env` are always reachable |
| `dsh.capabilities` is a declaration | declaring `[]` does not remove a capability; under-declaring is a static FAIL, and a declaration the static scan cannot observe is a WARN |
| the sandbox covers tool subprocess file writes only | it is not a boundary around plugin code, and not a network policy |
| the checker executes the plugin | `--runtime`/C-4/C-14 import it; the check path has no sandbox and inherits `HOME` |
| static checks see known source shapes | they cannot see runtime egress, dynamic URLs, or whether a prompt was really corrupted |
| runtime safety needs containment | a network-policy sandbox plus capture/audit is the only way to observe what code actually does |

<a id="author"></a>
## Author guide

<a id="author-least-privilege"></a>
### 1. Least privilege and the capability declaration (DSC-16, DSC-18)

Declare only the closed-set IDs the plugin really touches. Every static trigger
needs its entry (`C-11.2`). A declared capability that the static scan did not
observe is a WARN (`C-11.5`: "not observed statically") — that is not proof it
is unused, because direct `node:fs` use is observation evidence while dynamic
calls and scan truncation stay outside the trigger surface; since 1.6.10 the
clause is `NA` (not WARN) when nothing was scanned or the capability has no
static observation surface (`credentials:provider`). Do not delete a real
declaration just because the scan cannot see it.

There are 15 IDs: `fs:read`, `fs:write`, `shell`, `subprocess`,
`network:egress`, `network:ingress`, `credentials:read`, `credentials:list`,
`credentials:provider`, `llm:adapter`, `sessions:read`, `system-prompt:write`,
`tools:register`, `remote:expose`, `plugin:install`.

Since `dsh-standards` 1.6.12 the standard also accepts 16 **reserved** IDs
(11 DSH `0.2.2-rc.3` host seams plus 5 pre-existing): `C-11.1` does not FAIL on
a reserved ID and `C-11.5` records `NA`, while the `C-11.2` FAIL surface is
**unchanged** — a reserved ID never satisfies a judged trigger. See the tables
in [`31-DS-C` §8.1](https://github.com/PerryLink/dsh-standards/blob/main/31-DS-C%E6%9D%A1%E6%AC%BE.md)
and [`60` §2.2](https://github.com/PerryLink/dsh-standards/blob/main/60-%E6%9D%83%E9%99%90%E4%B8%8E%E6%A0%87%E6%B3%A8%E8%A7%84%E8%8C%83.md),
and [entry.md § capability triggers](entry.md#capability-triggers) for the ID
list.

```json
{
  "dsh": {
    "capabilities": ["tools:register"]
  },
  "security": {
    "status": "draft",
    "note": "non-host disclosure only; not read, not enforced",
    "permissions": {
      "files": [],
      "network": [],
      "credentials": [],
      "shell": false,
      "subprocess": false
    }
  }
}
```

`dsh.permissions` and `security.permissions` are **not host fields**. The
standard is not fixed, so this guide prints a `security.permissions` block
marked `draft`: it is disclosure for a human or a market, never enforcement.
If you do not want to make the disclosure claim, delete the block — an absent
field means "not declared", not "no permissions". `dsh.commitments` and
`dsh.disclosure` are the same kind of optional disclosure: `false` means "no
promise", absent means "not declared". Do not fill every commitment `true`; an
unsupported claim is worse than a missing one.

<a id="author-credentials"></a>
<a id="2-credentials-and-sensitive-files-dsc-17"></a>
### 2. Credentials and sensitive files (DSC-17)

Resolve a reference per operation, through the seam, and never print, log,
persist, or put a value in `argv`. `describe()` is the only shape a UI should
see. Do not read `$DSH_HOME/.credentials.yaml`, `~/.ssh`, `~/.aws`, `~/.netrc`,
`.npmrc`, or any other backing file, and do not enumerate unrelated records.

```ts
import { credentialRef } from '@deepseek-ai/dsh-credentials'

const ref = credentialRef('MY_API_KEY')
const resolved = await ctx.credentials.resolve(ref) // re-resolve per operation
if (!resolved) throw new Error('MY_API_KEY is not configured') // never print resolved.value

// configuration UI: presence and writability only
const info = await ctx.credentials.describe(ref)
```

Environment scrubbing applies to `ctx.subprocess`: the child gets a scrubbed
parent environment, and an explicit `env` entry is a deliberate opt-in. Do not
forward a token "just in case".

<a id="author-egress"></a>
<a id="3-egress-endpoints-dsc-18"></a>
### 3. Egress endpoints (DSC-18)

Use a constant allowlist of exact hostnames and `https` only. Never fetch a URL
that came from a model, a tool result, or a user message; use
`redirect: 'manual'` and refuse a redirect unless every `Location` hop passes the
same allowlist (bounded), and never send a credential across an origin. Disclose
third-party endpoints, what is retained, and whether session text is forwarded.

```ts
const ALLOW = new Set(['api.example.com'])

export function checkedUrl(raw: string): URL {
  const url = new URL(raw)
  if (url.protocol !== 'https:' || !ALLOW.has(url.hostname)) {
    throw new Error('blocked endpoint')
  }
  return url
}

const res = await fetch(checkedUrl('https://api.example.com/v1/x'), {
  redirect: 'manual',
})
```

The host has no egress policy and `web_fetch` can reach private addresses. This
allowlist is the plugin's own discipline, not a sandbox. If you must call a
third party, say so in `dsh.disclosure.endpoints` (when that field exists) and
in the README.

<a id="author-files"></a>
<a id="4-files-subprocesses-and-dynamic-execution-dsc-15-dsc-16-dsc-17-dsc-19"></a>
### 4. Files, subprocesses, and dynamic execution (DSC-15, DSC-16, DSC-17, DSC-19)

- Use `ctx.fs`: `resolve()` the target, then `contains(workspace, target)`.
  Reject `..`, absolute paths, and symlinks (check with `lstat` first), bound the
  size, and keep temp files at `0700`/`0600` (ACL on Windows).
- Do not start a subprocess by default. When you must, use
  `ctx.subprocess.spawn` with an `argv` array, an absolute executable, `cwd`
  inside the workspace, the scrubbed environment, a timeout/abort, and bounded
  output. Never build a shell command string.
- Never use `eval`, `new Function`, `vm.runIn*`, `module._compile`, or
  `process.binding`. Dynamic `import()` takes a static path only. Do not publish
  minified blobs or binary-only code; if you ship wasm/native, ship the source,
  the build method, and a `sha256`.
- Lifecycle scripts are the install-time RCE surface (`DSC-15`): ship none. If a
  build truly needs one, never pipe a download into a shell, and never hide it
  behind `base64 -d` or `node -e`.

```ts
const workspace = await ctx.fs.resolve(process.cwd())
const target = await ctx.fs.resolve(userPath)
if (!ctx.fs.contains(workspace, target)) throw new Error('path escapes the workspace')

const child = ctx.subprocess.spawn({
  argv: ['/usr/bin/git', 'status'],
  cwd: process.cwd(),
  stdio: { stdin: 'ignore', stdout: { maxBytes: 64_000 }, stderr: { maxBytes: 64_000 } },
  graceMs: 5_000,
  signal,
})
const outcome = await child.done
```

The sandbox still only covers subprocess file writes; a plugin's own `fetch` and
`node:fs` bypass every seam. Do not read a declaration as isolation.

<a id="author-prompt"></a>
<a id="5-tool-output-and-prompt-injection-dsc-20"></a>
### 5. Tool output and prompt injection (DSC-20)

Tool results, web pages, files, and session text are **untrusted data**. Validate
them against the tool's `output.schema` (a mismatch is `INVALID_TOOL_OUTPUT`),
and wrap external text with a fixed untrusted prefix, a per-call random boundary,
and JSON escaping before it reaches a prompt. Never put external text in the
system prompt or turn it into instructions. Instruction hierarchy belongs in
code: system > user > external data. Model output stays data; validate it, do
not shell it, and do not let it choose an arbitrary URL.

```ts
import { randomUUID } from 'node:crypto'

const wrap = (s: string) => {
  const id = randomUUID() // per call, so reused wrappers get a fresh boundary
  return `<untrusted-${id}>\n${JSON.stringify(s).replaceAll('<', '\\u003c')}\n</untrusted-${id}>`
}
```

Rendering is part of the same boundary: use `textContent`/React escaping, never
`innerHTML`, and escape log and error text too. Wrapping lowers the success rate
of injection; it is not isolation.

<a id="author-publish"></a>
<a id="6-dependencies-build-and-publish-dsc-15-dsc-21-dsc-22"></a>
### 6. Dependencies, build, and publish (DSC-15, DSC-21, DSC-22)

Commit the lockfile and install with `npm ci --ignore-scripts` (or
`--frozen-lockfile`). Keep dependencies minimal and check for typosquats —
lookalike scopes and edit-distance names around `dsh`/`@deepseek-ai/dsh`. Use a
`files` allowlist, publish the build output, pin Node and the package manager,
and make a tag rebuild reproducibly.

```sh
npm ci --ignore-scripts && npm test && npm pack --dry-run
npm audit --omit=dev && npm audit signatures
# CI only: trusted publishing, provenance, no long-lived token
npm publish --access public --provenance
```

Publish with npm trusted publishing (OIDC) and `--provenance`; keep 2FA on,
protect tags, require review, and never reuse a version (deprecate a bad one).
Check that `package.json` has no `preinstall`/`install`/`postinstall`/`prepare`:

```sh
node -e "const s=require('./package.json').scripts||{}; if(s.preinstall||s.install||s.postinstall||s.prepare) process.exit(1)"
```

`dist.integrity` only proves the tarball matches the registry, and an
attestation needs signature verification plus a bound build source. Neither is
a code-safety proof.

<a id="author-response"></a>
### 7. Vulnerability response (process, not a DSC)

Ship a `SECURITY.md` with a private channel (GitHub Security Advisories), the
supported versions, a 7-day first response, and 90-day coordinated disclosure.
Do not take vulnerability reports in public issues. After a fix, publish a
patch release, an advisory, and credit; revoke and rotate leaked tokens; for a
malicious version, deprecate it, ask the market to delist, and keep the
evidence.

```md
# Security Policy

## Supported versions
| Version | Supported |
|---|---|
| 0.1.x | yes |

## Reporting
Use <repo>/security/advisories/new; do not open a public issue.
Include the version, DSH version, impact, and a minimal repro. First response within 7 days.
```

<a id="user"></a>
## User guide

The checks tell you what a package declares; they do not tell you what it does.
Assume a loaded plugin can do anything the user can. The static checks that
touch this path are `DSC-15` (lifecycle scripts), `DSC-17` (credential files),
`DSC-21` (typosquat/lookalike names, WARN-only) and `DSC-22`
(integrity/provenance) before install; `DSC-18` only ever produces a static clue
about egress. Under `--scope security`, `DSC-15`/`DSC-16`/`DSC-17` can block;
outside it every security finding is capped to WARN in the separate `security`
block.

**Before installing.** Read the manifest: `dsh.capabilities`, `dsh.labels`,
`scripts`, `files`, `engines.dsh`, and the source pin. Then look at the source
and the publisher: an exact npm version with `dist.integrity`, or a git
40-hex commit; how recent the release is; whether `dist.signatures` /
`dist.attestations` exist; and whether an install script is present. An empty
capabilities list means **not declared**, not "no capabilities". A label such as
`prompt-modification`, `third-party-model-provider`, `remote-access`,
`red-team`, or `mirror` is the author telling you which risk to check, not a
clearance.

```sh
npm view pkg@1.2.3 version dsh scripts dist.integrity dist.signatures dist.attestations repository.url time.modified --json

# the released static security scope (1.6.0+; does not run the plugin)
npx dsh-standards check ./pkg --scope security --json
```

**During install.** Start from a throwaway profile (`dsh plugin --profile lab
...` initializes it), add `--ignore-scripts`, and understand that it stops
install scripts only, not the code the host loads. The GUI build approval runs
a script with your permissions, but the approval list shows only the package
name, not the script body: inspect the referenced script first (`npm pack`, then
read `scripts/*`). The CLI inherits your whole environment, so launch it from a
clean shell with no tokens. A new session defaults to `workspace-write` + `ask`;
do not switch to `danger-full-access` with `never`.
`DSH_PERMISSION_MODE=read-only` constrains tool subprocesses, not plugins.

```sh
dsh plugin --profile lab add pkg@1.2.3 --ignore-scripts
dsh --profile lab --dump-config
dsh plugin --profile lab remove pkg
```

**After install.** Return to `workspace-write`, watch the install log and the
session's tool calls, and remove the package when you no longer need it. Check
the profile's `package.json`/lockfile and the credential records. If something
looks wrong, disable it, keep the logs and the package hash, and report through
its `SECURITY.md` (for a malicious npm package, also npm support). Do not
publish the details first.

<a id="market"></a>
## Market / repository guide

**Record facts before listing.** `name@version`; source (npm integrity or git
40-hex plus subdir); `dsh.bundle.patch` (no `!!js`), `files`, `engines.dsh`, and
whether `scripts` contains an install hook; publisher vs `repository`;
`SECURITY.md`, 2FA, protected tags; publish time; provenance/attestations;
capability/label validity; license (advisory). Do not install or execute the
package to fill the row, and do not grade, score, or rank it. These facts map
to `DSC-15`–`DSC-22`: a row records them, it does not certify them.

```sh
npm view pkg@1.2.3 --json
mkdir -p inspect && npm pack pkg@1.2.3 --ignore-scripts --pack-destination ./inspect && tar -tzf inspect/*.tgz
git clone --filter=blob:none --no-checkout <url> r && git -C r archive <40hex> | tar -t
```

**Show risk, not a badge.** Put capabilities in the same view as labels and mark
them "author declaration, not enforced"; mark unknowns "not declared / not
checked / not run". The index's only risk field is labels; capabilities must be
read from the manifest. Missing data is never a pass. State that static checks
cover known patterns and are not a security audit. The checker can import the
plugin, so do not run it against an untrusted package on a host you care about.

**Disputes and delisting.** Hard-reject only four cases, each with its reason
code: `not-a-plugin`, `source-not-pinnable`, `impersonation-or-infringement`,
and `security-hold` (manual review with an appeal). List everything else with
the finding attached. Market actions are not label fields: every listing and
rejection is one row of `market-actions.jsonl`
(`ts/subject/action/reasonCode/evidenceUrls/actor/signature/appealUrl`); a
rejection carries one of the four reason codes above, and the authoritative
fields, acting roles, and appeal link are in
`00-live/market-contract/DECISION-TABLE.md` §2 and
`00-live/market-contract/CONTRACT.md` §7. The author can withdraw at any time
(`lifecycle` becomes `withdrawn` at `withdrawnAt`); a 90-day expiry counts from
the record's `checkedAt` (rev1 records: from `generatedAt` to `expiresAt`) and
removes only the label; a project-initiated withdrawal must carry a reason and
evidence and opens a 14-day appeal window counted from `withdrawnAt` (shown as
`under-review` while open). Keep record history for at least two years.

**Wording ban.** Never write "secure", "certified", "official", "audited", or
"100% risk-free", and never imply certification with a shield or a checkmark.
Use the fixed disclaimer: "unofficial · not certified · not security-audited ·
not endorsed · no warranty".

<a id="template"></a>
## Template: minimal low-risk defaults

The smallest honest starting point is: no lifecycle scripts, empty
capabilities, a permissions disclosure marked draft, and a `SECURITY.md` in the
tarball. The `dsh-scaffold` template ships these defaults.

```json
{
  "name": "@acme/dsh-hello",
  "version": "0.1.0",
  "license": "Apache-2.0",
  "files": ["lib", "cordis.patch.yml", "SECURITY.md", "LICENSE"],
  "scripts": { "test": "vitest run" },
  "dsh": {
    "capabilities": [],
    "labels": []
  },
  "security": {
    "status": "draft",
    "note": "non-host disclosure only; not read, not enforced",
    "permissions": { "files": [], "network": [], "credentials": [], "shell": false, "subprocess": false }
  }
}
```

`SECURITY.md` must name the private channel, the supported versions, and the
response window — see the author section above. Verify the shape before publish:

```sh
node -e "const s=require('./package.json').scripts||{}; if(s.preinstall||s.install||s.postinstall||s.prepare) process.exit(1)"
npm pack --dry-run   # SECURITY.md must be in the file list
```

This shape is the starting point for `DSC-15` (no lifecycle scripts), `DSC-21`
(no typosquat dependency), and `DSC-22` (provenance publishing); it also gives
`DSC-17` and `DSC-18` a truthful empty disclosure to read. An empty
`capabilities` array is correct only while the plugin touches no host surface.
Once it registers a tool or reads `ctx.fs`, add the ID; a copied template with a
stale empty array hides the very `C-11.2` failure the check is for.

<a id="scope"></a>
## Where the security checks sit

| Scope | What runs | Verdict |
|---|---|---|
| `--scope ds-c` (default) / `entry` / `flow` / `boost` | `DSC-01`–`DSC-14`: only the scope's mandatory subset counts (`DSC-10` is advisory; `03`/`14` can be NA/not-run). `DSC-15`–`DSC-22` run in the separate `security` block (`scope=advisory`) | a security `FAIL` is capped to `WARN` in that block; it is not in `checks[]`/`buckets.blocking` and cannot change `status`/exit |
| `--scope security` (1.6.0+) | all 22 checks in `checks[]`: DSC-01–14 plus DSC-15–22 | `15`/`16`/`17` blocking (FAIL → exit 1); `21` mandatory **WARN-only**, never blocking (listing too); `18` WARN; `19`/`20`/`22` advisory |
| runtime observation | sandbox with a network policy + capture | the only evidence that code actually egressed, read a file, or rewrote a prompt |

`DSC-16` blocks on `eval`/`new Function`/`vm`/`module._compile`/`process.binding`.
A bare `child_process` import is WARN in 1.6.4; the FAIL for a statically
dangerous subprocess command is scoped to 1.6.2.

The JSON report carries an additive top-level `security` block; the DS-C verdicts
stay unchanged. A PASS in that block means "no blocking FAIL, no WARN, and the
mandatory `15`/`16`/`17`/`21` all produced a result", not "safe".

<a id="security-block"></a>
### Reading the `security` block

- `conclusion.headline`'s `blocking N` and `buckets.blocking[]` are
  **report-level**: they only count `checks[]` FAILs. `security.blocking[]` is
  the block's own list and can only ever hold `DSC-15`/`DSC-16`/`DSC-17`.
- **Default scope:** the eight run in `security.checks[]` with
  `security.scope="advisory"`. A `FAIL` is capped to `WARN` (listed in
  `security.warn[]`), `security.blocking=[]`, no security row appears in
  `buckets.blocking`, the headline is unchanged, and `status`/exit stay the same.
- **`--scope security`:** the eight join `checks[]`. A `15`/`16`/`17` FAIL →
  `security.blocking=[...]` plus `buckets.blocking=[...]`, headline `blocking N`,
  `status=fail`, exit `1`. `DSC-21` findings are WARN-only and never block;
  `18`/`19`/`20`/`22` are advisory. A mandatory check with no result makes
  `security.status=incomplete`.
- **Partial:** 1.6.4+ reports `security.partial[]`; a partly-run check is
  `security.checks[].coverage === "partial"` (and top-level `coverage.partial` /
  `buckets.partial`); `security.notRun[]` only carries `NA`/`ERROR`/full
  `not-run`. Do not read the four arrays as complete coverage.

<a id="limits"></a>
## What no static check can tell you

- whether a URL was really fetched, or where a redirect went;
- whether a file outside the package was read or written;
- whether a dependency's own install script ran;
- whether a model was actually steered by injected text;
- whether the author is trustworthy — signatures are self-asserted evidence
  until the key chain and build provenance are verified by a human.

Runtime security needs a sandbox with an egress policy and an audit trail.
Windows has no `unshare`, so the containment story is weaker there, and a
sandbox that only limits writes is not a network boundary. Until you have that
evidence, write `not-run` or `not-measured` — never "secure".
