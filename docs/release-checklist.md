# Release checklist

A short, copy-pasteable pre-publish pass for a DSH plugin. It is a self-check,
not a certification, review, or ranking. Run it before `npm publish` and again
before submitting to a catalog.

## 1. Manifest

- [ ] top-level `engines.dsh` names the DSH line you support, for example
      `"engines": { "dsh": ">=0.2.2 <0.3.0" }`. Since 0.2.1-alpha.4 the host
      reads this field alone when it is present; without it, the host falls
      back to the `@deepseek-ai/dsh*` peer dependency ranges.
- [ ] `peerDependencies["@deepseek-ai/dsh"]` still matches the same line, for
      tooling that reads peers rather than `engines.dsh`.
- [ ] `dsh.manifestVersion`, `dsh.bundle.patch`, and — when used —
      `dsh.capabilities` / `dsh.labels` are present. Declare only the
      capabilities the code actually uses; an empty array means "uses none".
- [ ] `repository`, `homepage`, and the `dsh-plugin` GitHub topic are set, so a
      catalog can attribute the package to a repository.

## 2. Package contents

```sh
npm pack --dry-run
```

Read the file list: the entry point(s), the patch file, `package.json`, the
license, and the README must be there. Remove anything that is not part of the
published package (fixtures, local profiles, secrets, build caches).

## 3. Static ENTRY check

Node >= 24.9 is required for the 0.2.2 line.

```sh
npx -y dsh-standards@1.6.9 check . --scope entry --entry-claim static --no-exec
```

Read the report in this order:

1. `blocking` / FAIL items — fix these first;
2. `hygiene` WARN items — judgment calls, not automatic failures;
3. `partial` / `not checked` — the static pass did not cover them.

`--no-exec` means the checker never runs the plugin. The report covers the
ENTRY layer only: it says nothing about FLOW (does it behave well at runtime)
or BOOST (does it make the host faster), and it is not a security audit.

## 4. Install smoke

Static checks cannot tell you whether the host loads the package. Link the
checkout into a throwaway profile and start the host once:

```sh
dsh plugin --profile demo add .
dsh --profile demo
```

Confirm the plugin appears/loads, then remove the temporary profile. This is a
runtime observation, not something the static report can certify. When the
plugin is already published, repeat against the tarball from the registry
instead of the checkout.

## 5. Optional CI

The action is advisory by default; it posts no required check unless you ask
for `fail-on`. Keep the token read-only.

```yaml
name: entry-check
on: [pull_request]
permissions:
  contents: read
jobs:
  entry:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: PerryLink/dsh-check-action@v1
        with:
          path: .
          comment: false
          fail-on: none
```

## 6. What this checklist does not do

- it does not install or execute the package during the static step;
- it does not audit security, permissions, or supply-chain provenance;
- it does not rank, score, certify, or endorse the plugin;
- a clean static report is not a runtime result, and a runtime pass is not a
  security review.

For the full clause text and evidence rules, see
[`entry.md`](entry.md) and the
[`31-DSH-ENTRY`](https://github.com/PerryLink/dsh-standards/blob/main/31-DSH-ENTRY%E5%85%A5%E9%97%A8%E8%A7%84%E8%8C%83.md)
specification.
