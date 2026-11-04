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

## The two claims

| Claim | Meaning | What it needs |
|---|---|---|
| `static` / `recognized` | the package shape can be identified | manifest/entry inspection only |
| `runtime` | it actually starts or boots | plugin L1, or bundle G0–G3 |

`recognized` is not a pass. A bundle is not proven by importing its server
entry; it needs G0–G3. A client-only package is build-only unless a browser
probe exists.

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

Two optional fields become checks `DSC-11` and `DSC-13` once they exist:

```json
{
  "dsh": {
    "capabilities": ["fs:read", "network:egress"],
    "labels": ["remote-access"]
  }
}
```

Allowed `capabilities`: `fs:read`, `fs:write`, `shell`, `subprocess`,
`network:egress`, `network:ingress`, `credentials:read`, `credentials:list`,
`credentials:provider`, `llm:adapter`, `sessions:read`, `system-prompt:write`,
`tools:register`, `remote:expose`, `plugin:install`.

Allowed `labels`: `prompt-modification`, `red-team`,
`third-party-model-provider`, `remote-access`, `mirror`.

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
