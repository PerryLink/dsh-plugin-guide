# DeepSeek Harness Plugin Cheat Sheet

> One-page quick reference. Full details: [plugin-dev-guide.md](plugin-dev-guide.md) (Chinese) and [references](../references/).
> Other languages: [中文](quick-reference.zh-CN.md) · [Español](quick-reference.es.md) · [Português](quick-reference.pt.md) · [हिन्दी](quick-reference.hi.md)

## Plugin skeleton

```ts
import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'
import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'my-plugin'          // required
export const inject = ['tools']          // required services; omit if none

export interface Config { limit: number }
export const Config: Schema<Config> = Schema.object({
  limit: Schema.number().default(10),    // Schemastery schema, not a plain object
})

export function apply(ctx: Context, config: Config) {
  ctx.effect(() => {                     // registration = effect, undone on unload
    const timer = setInterval(() => {}, 1000)
    return () => clearInterval(timer)
  })
  ctx.on('tools/result', (exec, result) => { /* ... */ })
  ctx.tools.register(defineTool({
    name: 'my_tool',
    description: '…',
    parameters: { x: { type: 'string', required: true } },
    output: { schema: { type: 'string' }, render: (_a, v) => [{ type: 'text', text: v }] },
    async execute(args, exec) { return `hi ${args.x}` },  // honor exec.signal
  }))
}
```

Other forms: object `export default { name, inject, apply }`; class `class X extends Service { static inject=[...]; constructor(ctx){ super(ctx,'key') } }` (use when providing a service).

## Core ctx API (Cordis)

| Purpose | API |
|---|---|
| Register resource + cleanup | `ctx.effect(() => disposer)` |
| Listen to events | `ctx.on(name, handler)` (auto-cleaned) |
| Broadcast / no return | `ctx.emit(name, payload)` |
| Short-circuit value | `ctx.bail(name, input)` (first non-null/false/undefined wins) |
| Ordered value | `await ctx.serial(name, input)` |
| Pipeline | `await ctx.waterfall(name, input, init)`; listeners **must call `next()`** |
| Child contexts | `ctx.extend(meta)` / `ctx.isolate(name, label?)` / `ctx.intercept(name, config)` |
| Mount child plugin | `ctx.plugin(plugin)` → Fiber; `await fiber.dispose()` |
| Optional service lookup | `ctx.get('metrics')?.x()` |
| Logging | `ctx.logger(name)` |

Lifecycle: `PENDING → LOADING → ACTIVE` (apply throws → FAILED); `ACTIVE → UNLOADING → DISPOSED`. A required service disappearing unloads the plugin; it reloads when the service returns.

## Event dispatch modes + bail

| Mode | awaited | Order | Return value |
|---|---|---|---|
| emit | no | registration order | none |
| waterfall | no | registration order | yes (**not calling next() short-circuits**) |
| parallel | yes | parallel | none |
| serial | yes | registration order | yes (first non-empty stops) |

Typed events (declaration merging):

```ts
declare module '@deepseek-ai/cordis' {
  interface Events { 'my/event': (p: { id: string }) => void }
  interface Context { myService: MyService }   // when providing a service
}
```

## cordis.yml / layering

```yaml
# scratch-plugin/cordis.yml (--patch overlay)
- insert:
    - id: hello
      name: '/absolute/path/to/scratch-plugin/src/my-plugin.ts'
      config: { greeting: 'Hi' }

# bundle: "dsh": {"bundle":{"patch":"./cordis.patch.yml"}} in package.json
# profile: "dsh": {"profile":{"bundles":["@deepseek-ai/dsh-base","my-bundle"]}}
# effective order: bundles → profile cordis.patch.yml → $DSH_HOME/cordis.patch.yml → --patch
# override by id; the whole config row is replaced (no deep merge) — restate every key
# !!js expressions evaluate after injected services activate; disabled is evaluated on every mount
```

Commands: `dsh --profile web` · `dsh --profile headless "task"` · `dsh --profile X --dump-config` · `dsh plugin --profile X add/remove <pkg>` · `pnpm dsh web --patch ./scratch-plugin/cordis.yml`

Install channels (repository-plugin removed 0811 — only two remain):
- **bundle plugin** (`"dsh":{"bundle":{"patch":"..."}}`) → `dsh plugin add <pkg>` enters the `dsh.profile.bundles` stack; takes effect on restart.
- **plain cordis plugin** (no `dsh.bundle`) → `dsh plugin add <pkg>` installs the dependency + an insert row in the profile `cordis.patch.yml`; **config HMR applies live**.
- git source: `dsh plugin add "github:owner/repo#<sha>&path:<subdir>"` (pin the commit; self-contained `prepare` build + profile `pnpm-workspace.yaml` allowBuilds; npm/tarball needs no build permission).

## Common built-in services (ctx keys)

`sessions` session log/in-memory store · `systemPrompt` prompt assembly · `tools` tool registry + guarded pipeline · `agents` agent registry · `agentLoop` loop driver · `llm` model adapter registry · `skills` skill registry · `commands` human slash commands · `approval` one-shot approval · `jobs` background jobs · `fs` filesystem seam · `shell` bash execution seam · `subprocess` subprocess seam · `terminals` PTY · `sandbox` process confinement seam · `codeRuntime` code execution · `sessionPersistence` persistence · `settings` / `credentials` / `workspaceRegistry` / `goals` / `planMode` / `subagents` / `workflowEngine` / `storage`.
Full list + exact signatures → `references/official-docs/docs/capability-seams.md` + `docs/subsystems/*.md` (generated Cordis API regions).

## Tool policy pipeline (execution order)

```
tools/pre-execute (waterfall, allow|deny|ask) → ctx.tools.guard() (monotonic deny)
→ tools/execute (wrapper; only exec.signal replaceable) → execute(args, exec)
→ tools/post-execute (replace content/value, block, attach context) → finalizeContent
→ tools/result (observe-only) → durable tool/result (session event)
```

Selection: policy gates → pre-execute; non-appealable deny → guard; timeout/retry/metrics → execute; transforming results → post-execute; audit/collection → result.
Code Mode: `await tools.<name>(args)` comes free; success = final canonical JSON value; failure = `ToolCallError(name, toolName, message)`.

## UI cards (pure functions! args(+result) only — no I/O/clock/random)

- `presentCall(args)` → `{card:'generic',title,kind?,rawInput?,content?,locations?}` | `{card:'terminal',title,description?,cwd?}` | `{card:'diff',title,diffs,locations?}`
- `presentResult(args,{content,isError,meta?})` → generic / terminal / diff / search(`shape:'matches'|'paths'`) / read / web(`kind:'search'|'fetch'`)
- Replay metadata: `output.presentationMeta(args, value)` → persisted in `tool/result.meta`

## Three-role capability seam template

Definition (`dsh-my-cap`): `export abstract class MyCapService extends Service { constructor(ctx){super(ctx,'myCap')} abstract execute(req): Promise<res> }` + Context declaration merging.
Provider (`dsh-my-cap-local`): `export function apply(ctx){ ctx.plugin(class MyCapLocal extends MyCapService {...}) }`.
Consumer (`dsh-tool-my-cap`): `inject = ['tools','myCap']`, `ctx.tools.register(defineTool({... execute: args => ctx.myCap.execute(...)}))`.
Rules: don't split preemptively; Provider and Consumer never depend on each other; defaults resolve explicitly via `resolve(request): Spec`.

## LLM adapter essentials

`class MyAdapter extends LlmAdapter { async *stream(options): AsyncIterable<StreamChunk> }` → `ctx.llm.registerAdapter(['provider'], adapter)`.
Chunk protocol: `block-start` → `text-delta*` → `block-end` (complete block) → … → `usage` (before finish) → `finish` (last; `reason: {kind:'stop'|'tool-calls'}`). Throw `LlmError` with a stable code for fields you cannot honor.

## Hard rules (violations = gate failures / wrong behavior)

1. Every registration goes through `ctx.effect()` / `ctx.on()` / a service `register()` (returns a disposer). A registration on another context (e.g. `agent.ctx`) has two owners — keep its disposer in your own effect too.
2. Waterfall listeners must call `next()`; not calling it short-circuits by design. When rewriting an `agent/pre-step` decision, **spread it** (`{ ...decision, messages }`) so fields like `startsRequestSeries` survive.
3. Weakest mechanism that suffices: `ctx.tools.restrict()` (remove only) < `ctx.tools.guard()` (deny only) < waterfall rewrite (order-dependent) < `system-prompt/assemble` (replaces everything). Observe final outcomes on `tools/result`; use `tools/post-execute` only to transform.
4. Model-visible ⇔ logged: new model-visible input requires a new session event (`SessionEventMap`) — added by the host, never by appending a new `type` yourself (see rule 8).
5. Never hardcode tunables (test: can cordis.yml change it?); misconfiguration fails loud. Live-editable user fields use `Volatile<T>` + `loader/volatile-update` (the form namespace is the profile entry id).
6. Standalone plugin packages: cordis is a peerDependency matching the host identity (mixing scoped `@deepseek-ai/cordis` and unscoped splits identities); ESM; `dsh.bundle` manifest (`patch` may be an ordered array); git installs need `prepare` + `allowBuilds`; ship `lib/` or a tarball. Shared-instance dsh packages go in **peerDependencies + devDependencies only** — never `dependencies` (a profile copy silently shadows the runtime, and DSH does not validate peer ranges).
7. Ship display metadata: `locale/*.json` `meta.title`/`meta.description` plus an exported `./icon` (SVG/PNG/JPEG/WebP, ≤256 KiB, inside the package). Subpath plugins never read their own `package.json`.
8. Bilingual docs in pairs; tool descriptions/prompts are behavior; non-trivial changes need an Agent Note; run the minimal check set before pushing (dsh-pre-push-checks).
9. Opaque cross-boundary ids are branded (`Branded<B>` from `dsh-brand`), never bare `string`.
10. **Never append a session event with a new `type`.** `SessionEventMap` members are required-on-read: a reader that does not know a type refuses the whole log unless the event carries the envelope's `ignorable: true` marker, and live `Session.append()` cannot set that marker (its third argument is a `SurfaceIntent` for surface events only). Derive your state from existing events, or keep plugin-owned data in a storage service found through inspection. Only structural format changes bump `SESSION_FORMAT_VERSION` (currently `4`; the V3→V4 migration lifts tool results into tool-role messages and moves message sources to producer-owned `source.kind`). Switch over `SessionEvent` still falls through a documented `default` — no `assertNever` (merge-extensible union).
11. `agent.inject()`'s `source` no longer accepts the retired `{ kind: 'plugin', plugin: '<name>' }` wrapper — declare your own kind through `MessageSourceMap` first. `inject` does not wake the agent (`followup()`/`steer()` do).
12. Never write a profile `cordis.patch.yml` while sessions run (HMR reloads it: tools vanish from live sessions, in-flight turns die, and a rebuild of `session-controller` can kill it until a full restart). Never hand-write a profile `package.json`; never run pnpm inside the profile directory.
13. UI plugins: render React in a slot (never an iframe-hosted page); style with `--dsw-alias-*` theme tokens only; never `require` a Harness Client package (a throwing component blanks the slot); `dsh.client.inject` must be a **static array**.
14. Performance: keep per-session state in `ctx.sessionProjections` (pure synchronous `apply`, same reference when ignored, plain JSON + `stateVersion`); wait on durable events (`turn/end`, `assistant/message`, `tool/result`) and render live tokens from `agent/assistant-stream`; never poll `agent/status`.

## Community pitfalls quick list (details: guide §7.3 / community-repo-deep-dive.md)

- tsconfig trio: `moduleResolution: bundler` + `allowImportingTsExtensions` + `rewriteRelativeImportExtensions` (+ `lib:["ES2024"]`, explicit `types:["node"]`).
- `tsc` emits despite errors → `tsc || exit 1` / `--noEmitOnError`; grep the build for leftover `.ts` imports before shipping.
- Windows junctions via PowerShell `New-Item -ItemType Junction`; vitest drive letter must be uppercase `C:/`.
- `DSH_PERMISSION_MODE=danger-full-access` is high-risk (no sandbox backend on Windows, approvals disabled); `DSH_*` vars in `~/.dsh/.env` break startup.
- Session files are multi-frame zstd: use `scanZstdFrames`/`createZstdFrameDecoder` (`@deepseek-ai/dsh-session-persistence-jsonl/src/zstd.ts`).
- npm: unscoped `dsh` is the unrelated node-dsh shell — install `@deepseek-ai/dsh` (`latest`=`next`=0.2.0-rc.2, `alpha`=0.2.1-alpha.1); `@deepseek-ai/dsh-tools`, `@deepseek-ai/dsh-base`, `@deepseek-ai/dsh-headless` and `@deepseek-ai/dsh-session-persistence-jsonl` still ship a stale `latest` (0.0.1-rc.1), so pin `next` (0.2.0-rc.2) or `alpha` (0.2.1-alpha.1); `create-dsh-plugin` latest=0.2.3; `@deepseek-ai/cordis` latest=4.0.4 with a new `dsh-0-2-1-alpha-1` tag at 4.0.5-alpha.1; dsh-core/dsh-sdk still unpublished (verified 2026-10-06).
- `resolve()` both sides before path comparisons (Windows backslash trap).

## Documentation links

Official dev docs — site base <https://deepseek-harness.github.io/deepseek-harness> (root = Chinese, `en/` = English; verbatim local copies under `references/official-docs/docs/`):

- Basics: [develop/basic/](https://deepseek-harness.github.io/deepseek-harness/develop/basic/) → [tool](https://deepseek-harness.github.io/deepseek-harness/develop/basic/tool) · [config](https://deepseek-harness.github.io/deepseek-harness/develop/basic/config) · [publish](https://deepseek-harness.github.io/deepseek-harness/develop/basic/publish)
- Framework: [develop/framework/](https://deepseek-harness.github.io/deepseek-harness/develop/framework/) ([service](https://deepseek-harness.github.io/deepseek-harness/develop/framework/service), [events](https://deepseek-harness.github.io/deepseek-harness/develop/framework/events)) · Practice: [develop/practice/](https://deepseek-harness.github.io/deepseek-harness/develop/practice/) ([LLM adapter](https://deepseek-harness.github.io/deepseek-harness/develop/practice/llm-adapter))
- Guides: [quickstart](https://deepseek-harness.github.io/deepseek-harness/guide/quickstart) · [providers](https://deepseek-harness.github.io/deepseek-harness/guide/providers) · [python-sdk](https://deepseek-harness.github.io/deepseek-harness/guide/python-sdk)
- Cordis: [primer](https://deepseek-harness.github.io/deepseek-harness/reference/cordis-primer) · [tutorial](https://deepseek-harness.github.io/deepseek-harness/develop/cordis-tutorial/) · [core API](https://deepseek-harness.github.io/deepseek-harness/reference/cordis-api/context)
- Reference: [architecture](https://deepseek-harness.github.io/deepseek-harness/reference/) · [cookbook/adding-a-tool](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/adding-a-tool) · [cookbook/extension-cookbook](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/extension-cookbook) · [subsystems](https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/)
- Full URL ↔ local-copy index: [guide/links.md](links.md)

Community dev docs — templates/tutorials/pitfalls, full list in [references/community-ecosystem.md](../references/community-ecosystem.md): [plugin-template](https://github.com/omdsh-dev/plugin-template) · [dsh-plugin-dev pitfalls](https://github.com/omdsh-dev/dsh-plugin-dev) · [from-scratch tutorial](https://github.com/Opr4Mp3r/deepseek-harness-plugin-from-scratch) · [dsh-plugin-check](https://github.com/omdsh-dev/dsh-plugin-check)

## Key source index

- Official docs verbatim: `references/official-docs/docs/**` (369 md pages, all 182 `.zh.md` pairs included); the pages **not on the documentation site** (session-format-status, `upgrade-guide/**`, `persistence-changes/**`, ui-radius, web-styling, module-graph) are listed in [links.md](links.md) §2.1
- Migration checklist: [migration-0.2.md](migration-0.2.md) (every breaking change from 0.1.6-alpha.2 → 0.2.1-alpha.1, with the official upgrade-guide source for each)
- The official in-repo plugin-development skill: [references/official-plugin-dev-skill.md](../references/official-plugin-dev-skill.md)
- Repo-root constraints: `references/official-docs/AGENTS.md`, `references/official-docs/packages/AGENTS.md`, `references/official-docs/vendor/README.md`; sync state in `references/official-docs/SNAPSHOT.md`
- Site crawl HTML: `downloads/web/site/**` (EN+ZH full site) + `downloads/manifest.tsv` (download ledger)
- Upstream Cordis: `downloads/github/cordis/**` + research `references/upstream-cordis.md`
- Cordis paper: `downloads/github/paper/**` + research `references/cordis-paper-and-community.md`
- Website research: `references/website-pages.md`
- Repo research: `references/harness-repo.md`
- Community/ecosystem: `references/community-ecosystem.md` + `references/community-repo-deep-dive.md`
- All source URLs: `references/sources.md`
