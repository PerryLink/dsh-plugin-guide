# ENTRY: can it be recognized, installed, and started?

ENTRY is a compatibility gate, not a full quality audit. It is the first thing a
market, index, or user hits.

## What it covers

- package manifest: name, version, license, entry, `dsh.bundle.patch`
- engines/peer range for the DSH and Cordis generation being claimed
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
- `engines.dsh` or an `@deepseek-ai/dsh*` peer range is declared.
- The license is present; a missing license is advisory, not a fabricated pass.
- README says how to install and what it needs.
- No “official”, “certified”, “secure”, or ranking claim.

## What ENTRY does not do

It is not a security audit, sandbox, full contract audit, market gate, score, or
ranking. Those are separate concerns; do not borrow their authority.
