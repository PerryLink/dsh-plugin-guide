# Release Engineering for a DSH Plugin Portfolio

> Chinese: [release-engineering.zh-CN.md](release-engineering.zh-CN.md)

The official documentation teaches you how to build **one** plugin. It does not cover how to keep **dozens** of them installable, publishable, and upgradeable across a harness that ships compatibility-breaking changes by design. This chapter is that missing part, written from a live portfolio of 38 bundle plugins, 39 npm packages and 500+ published versions.

---

## 0. The contract you are actually maintaining

A plugin is not "a TypeScript package". It is four contracts, and a portfolio breaks whenever one of them drifts:

| Contract | Where it lives | Breaks when |
|---|---|---|
| Bundle manifest | `package.json` -> `dsh.bundle.patch` | the patch file is renamed or the key is dropped |
| Install surface | npm package name + `dist-tags` | a publish lands on the wrong tag, or never happens |
| Compatibility window | `peerDependencies` on `@deepseek-ai/*` | the harness moves an alpha/rc line and the range no longer admits it |
| Discoverability | GitHub topic `dsh-plugin` + package `keywords` | the repo is renamed, or a fork is created without topics |

Everything below is about keeping those four in sync at portfolio scale, cheaply.

---

## 1. Layout and naming that scale

Two habits separate 5 plugins from 50:

1. **One repository per plugin**, each independently releasable. A monorepo makes one failing gate block every plugin's release.
2. **A predictable name**: `dsh-<capability>` for the package, the repository named identically. Scoped names (`@you/dsh-x`) are fine; keep the repository name stable, because the discovery mechanism is a GitHub topic and a rename silently drops you out of search.

Keep a per-repo `AGENTS.md` stating that repository's own rules. As a portfolio grows, the repository file becomes the authority for that repo, and cross-repo conventions live in one shared document (this one).

---

## 2. The version-line matrix

During developer preview the harness publishes several lines at once, for example `0.1.2-rc.1`, `0.1.5-alpha.1`, `0.1.5-rc.1`. A portfolio pinned to one line breaks the moment a user installs from another.

The pattern that admits both windows:

```jsonc
{
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.2",
    "@deepseek-ai/dsh-tools": ">=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0"
  },
  "devDependencies": {
    "@deepseek-ai/dsh-tools": "0.1.5-rc.1"
  }
}
```

Rules that follow:

- **`devDependencies` pin the newest published line.** Your typecheck must fail before your users do.
- **`dependencies` pin the stable/rc line; `peerDependencies` admit both windows.** Never narrow a peer range just to make your own CI green - you will silently uninstall yourself from users on the other line.
- **Never re-pin 30 repositories by hand.** A scripted wave (patch bump, pin update, gate, publish) is the only sustainable path; run it as one atomic batch with a rollback note.

---

## 3. The release pipeline

Per repository the release is a tag push that triggers a workflow:

```yaml
on:
  push:
    tags: ['v*']
jobs:
  publish:
    steps:
      - run: pnpm install --frozen-lockfile
      - run: pnpm run build
      - run: npm publish --provenance --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Five things that cost real time to learn:

1. **`--frozen-lockfile` is a gate, and it is right.** A release commit that forgets `pnpm-lock.yaml` fails here. Never release from a dirty lockfile state.
2. **Publish with `--provenance`.** One flag produces a signed supply-chain attestation - the cheapest trust signal you can give a reviewer.
3. **Secrets are per repository.** `NPM_TOKEN` must exist in every repository that publishes. When a token is rotated, reseed all of them, or the failure appears much later, one repo at a time.
4. **A pushed tag cannot be re-published.** If the artifact was wrong: fix the commit, force-move the tag, re-run, and accept that the first attempt is public history.
5. **Know the registry replication delay.** A verification job running immediately after a publish can still resolve the previous version ("The latest release is X"). Re-run after `latest` settles instead of "fixing" a package that was never broken.

---

## 4. One version, three surfaces

Publish once, mirror everywhere, make the mirror idempotent:

| Surface | Mechanism | Failure mode to watch |
|---|---|---|
| npm | tag-triggered workflow | dist-tag lands on the wrong line |
| GitHub Release | the same tag-triggered workflow (idempotent) | release notes drift from CHANGELOG |
| Gitee (mirror) | scheduled sync workflow | mirror HEAD behind upstream after a force-move |

Verify all three before calling a release done. A release that exists on npm but not in the mirror is a half release, and mirror users will report a bug you already fixed.

The GitHub Release is created by the **same tag workflow** that publishes to npm - never by hand. Manual creation is exactly how release notes drift from `CHANGELOG.md`, and the gap is invisible from the registry: a version that exists on npm but has no Release page looks complete to `npm view` and incomplete to anyone reading the repository. Keep the step idempotent, so a re-run, a backfilled tag, or an already-existing Release page cannot fail the job:

```sh
if gh release view "$TAG" >/dev/null 2>&1; then
  echo "release $TAG already exists; skipping"
  exit 0
fi
node scripts/changelog-section.mjs "$VERSION" > release-notes.md || true
if [ -s release-notes.md ]; then
  gh release create "$TAG" --title "$TAG" --notes-file release-notes.md
else
  gh release create "$TAG" --generate-notes
fi
```

Three details carry the weight. The job needs `permissions: contents: write` (the publish job's `contents: read` is not enough, and job-level permissions override the workflow's). It belongs in a **separate job that `needs:` the publish job**, so a tag whose `CHANGELOG.md` lacks that section cannot turn a successful npm publish into a red release. And the `|| true` plus the `-s` test is what makes the missing-section case degrade to generated notes instead of failing - a release page with generated notes beats no release page at all.

---

## 5. README parity is part of the build

If the portfolio ships READMEs in several languages, treat them as build artifacts:

- The language set is fixed and checked. Adding a section to one language and not the others must fail CI.
- Enforce encoding discipline before tagging: UTF-8 without BOM, no mojibake, no replacement characters. A published README cannot be repaired - npm metadata is immutable, and the registry may not even display your corrected file.
- When scripting anchors, remember word boundaries do not behave as expected after CJK characters.

---

## 6. Migration waves when the harness breaks compatibility

The harness states plainly that compatibility-breaking changes will happen. Plan for waves, not for stability:

1. **Detect.** Run a typecheck matrix against the newest published line before users hit it. A removed event type or a changed signature surfaces as a compile error in one repository, which tells you the blast radius for all of them.
2. **Triage.** Separate pin updates, mechanical code changes, and semantic redesigns. Only the first two belong in a wave; the third gets its own release and its own changelog entry.
3. **Execute atomically.** One batch of patch bumps, one gate run, one publish wave, and a rollback note per repository (previous tag plus the exact pin to restore).
4. **Record the incident.** Two examples worth writing down, because both were self-inflicted and both cost a release cycle:
   - A release commit without the lockfile turned CI red; fixed by amending the commit and force-moving the tag.
   - A lockfile generated by a different package manager contained workspace-link entries that a clean install could not reproduce; fixed by deleting it, reinstalling in isolation, and regenerating.

**Rule of thumb**: if a wave touches more than about four repositories at once, the CI queue saturates and runs settle out of order. Batch accordingly.

---

## 7. The pre-tag gate

Before every tag push:

- [ ] `pnpm install --frozen-lockfile` clean
- [ ] typecheck against the newest published line, not the one you developed on
- [ ] unit tests green
- [ ] package invariants: the `files` whitelist contains the built entry, and the entry exists
- [ ] README language parity plus encoding audit (no BOM, no mojibake, no replacement characters)
- [ ] `CHANGELOG.md` has a section for the version you are about to tag
- [ ] the tag workflow creates the GitHub Release itself, idempotently, from that section (section 4)
- [ ] the version bump matches intent (patch = wave, minor = feature, major = breaking)
- [ ] the tag does not already exist on the remote

After the tag:

- [ ] npm `dist-tags.latest` equals the new version
- [ ] the GitHub Release exists with notes
- [ ] the mirror is synced
- [ ] every consumer repository that vendor-pins this package was bumped in the same batch

---

## 8. Registry behaviours that look like your bug but are not

Document these once so nobody debugs them twice:

- **`versions[].readme` can be empty** for every published version of a package even though the tarball README is byte-identical to your repository. The package page then shows a stale README. It is a registry-side presentation behaviour, reproducible through both the CLI and CI channels - do not "fix" it by re-publishing.
- **`description` is truncated** at roughly 255 characters in package metadata. Compare a truncated form, not the full string, when verifying a publish.
- **Scoped packages** may return placeholder values on some download-count endpoints. Use the range endpoint rather than the point endpoint.
- **Published does not mean visible.** See item 5 in section 3.

---

## 9. Local tooling that fakes a result

Each of these returns a confident wrong answer rather than an error, and each one cost a real debugging cycle. Written down so the next person recognises the shape:

- **`npm view <pkg>@<ver> A B --json` invents absences.** Asking for two fields at once can report a field that exists as empty, which reads as "the published package lost its `peerDependencies`". Query one field per call; when it matters, unpack the published tarball and read its `package.json` - that is the ground truth. An audit that flagged eight packages this way was wrong about all eight.
- **A content search that honours `.gitignore` returns false negatives.** Where the workspace root ignores everything (`*` plus a single negation), a search across it finds nothing, and "nothing" reads as proof of absence. Before concluding a pattern is absent, confirm it with a scan that does not consult ignore rules.
- **Windows PowerShell 5.1's `Set-Content -Encoding utf8` writes a BOM.** A JSON request body beginning `EF BB BF` fails to parse, and the error blames the payload's contents rather than its encoding. Write machine-read files through an explicit encoder: `[System.IO.File]::WriteAllText($path, $text, (New-Object System.Text.UTF8Encoding($false)))`.
- **On Windows, `rd /s /q` cannot remove a tree containing a reserved device name** (`NUL`, `CON`, `AUX`, `PRN`, `COM1`-`COM9`, `LPT1`-`LPT9`). It reports success and leaves the entire ancestor chain in place. Delete that entry through a `\\?\`-prefixed long path, then assert the directory is actually gone - a zero exit code is not evidence that the tree disappeared.

---

## 10. What this buys you

A portfolio maintained this way behaves like a product: users on any harness line can install any plugin, every version is attested, mirrors agree, and a breaking upstream change costs one wave instead of an outage. It is also the strongest form of ecosystem contribution - the official project asks for exactly this, and explicitly does not rank official packages above community ones.

Corrections and additions are welcome; the practical entry points are listed in [links.md](links.md).
