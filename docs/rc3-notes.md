# Host notes for DSH `0.2.2-rc.3`

> Short index of the plugin-facing host changes that are already in effect on
> `0.2.2-rc.3`. These are the `v0.2.2-rc.1` upgrade guides that still apply to
> rc3; they are not a full migration manual, and nothing here is a verdict or a
> certification.

**Baseline.** DSH `0.2.2-rc.3` — npm `next` (`latest` is still `0.2.2-rc.1`),
tag `dsh-v0.2.2-rc.3` = commit `38a6a5c9…`, Cordis `4.1.0` (vendored upstream
baseline `4.0.0-rc.11`), Node `>=24.9.0`.

**Not rc3.** The `v0.2.2-rc.2` guide set — the `ctx.root` removal,
`Service.metadata`, the default WebServer auth — belongs to the release **after**
rc3. Do not apply it while you target rc3, and do not attribute it to rc3.

These notes map to the layers: the bundle update API to FLOW **J6**
(upgrade/rollback), the `Session.append` overloads to a BOOST practice (event
handling and test doubles), and window regions to FLOW **J8** (client/server).
They change host APIs, not the guide's counts: a journey or practice still needs
its own evidence.

## `BundleInfo.update` replaces `BundleInfo.updatable` (FLOW J6)

`pluginManager.listBundles()` no longer returns `updatable: boolean`. It returns
an optional `update`:

- `update: 'registry'` — `listVersions` can read newer versions; this is what
  `updatable: true` used to mark;
- `update: 'git'` — the bundle came from a Git spec pinned to a full commit, and
  `updateBundle` can replace it when `options.spec` names a newer commit of the
  same repository directory;
- absent — `updateBundle` cannot replace the bundle.

`ManagementError['code']` also gains `unexpected-package`: an installation run
with `InstallBundleOptions.expected` (which `updateBundle` always passes) fails
with it when the spec installs another package or version.

Who is affected: code that reads `listBundles()` through the Host API,
`@deepseek-ai/dsh-plugin-manager/types`, or the remote client
`@deepseek-ai/dsh-api-remotes/client`, and code that switches exhaustively over
`ManagementError['code']`. The `plugin_manager` tool never returned the field and
is unchanged.

Migration: replace each `updatable` read — test `bundle.update === 'registry'`
to decide whether `listVersions` can list versions, and
`bundle.update !== undefined` to decide whether `updateBundle` can replace it at
all; handle `unexpected-package` in an exhaustive code switch; then run the type
check. For J6 evidence, record the upgrade and the rollback against the current
host, not a fixture.

Guide:
[`plugin-update-method`](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.2-rc.3/docs/upgrade-guide/v0.2.2-rc.1/plugin-update-method/guide.md)

## `Session.append` keeps both overloads (wrapper and test-double rule)

Since `v0.2.2-rc.1`, `Session.append` accepts either one typed event call or an
array of event tuples. Ordinary single-event calls still compile. Anything
assigned to `Session['append']` — a wrapper, a test double — must support both
overloads.

Migration: wrap a real `Session.append` with a `Proxy` and forward from its
`apply` trap with `Reflect.apply`, preserving both overloads. A test double that
accepts only one event should expose the single-event helper separately and call
that from the test. Type-check every assignment to `Session['append']`, and call
replacements with both `append('turn/start', { turn: 1 })` (one event) and
`append([['turn/start', { turn: 1 }]])` (an array) to confirm the return shape.

Guide:
[`session-append-overloads`](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.2-rc.3/docs/upgrade-guide/v0.2.2-rc.1/session-append-overloads/guide.md)

## Explicit window regions for custom client overlays (FLOW J8)

On macOS Desktop after rc.1, interactive controls are automatically excluded
from window dragging only inside `data-window-drag` rows or
`data-window-drag-controls` scopes. Previously, matching controls and ARIA roles
anywhere in the application received `no-drag`. A custom client plugin whose
content covers a draggable header must now declare an exclusion; ordinary
scrollable content without an explicit region contributes no region, so clipped
content no longer blocks header dragging.

This applies only to macOS Desktop — plain Web and Windows behavior is unchanged.
Controls already inside a marked row, overlays built on shared primitives with
their own exclusions, and components with explicit `no-drag` declarations need
no migration.

Migration: inspect the overlay's JSX/CSS modules; put
`data-window-drag-exclude` on the visible viewport element of an interactive view
without nested drag rows, or `data-window-drag-controls` on the containing
element whose controls need separate exclusions. Overlays with nested drag rows
declare their regions separately. Keep exclusions on visible owners, not on every
focusable descendant; a body portal with no layout box needs the exclusion on its
visible content. Verify on macOS Desktop: open the overlay over a header and
confirm its controls act without dragging the window, close it and confirm the
blank header area still drags, then scroll the content out of view and confirm
the clipped content does not block the header.

Guide:
[`window-drag-regions`](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.2-rc.3/docs/upgrade-guide/v0.2.2-rc.1/window-drag-regions/guide.md)
