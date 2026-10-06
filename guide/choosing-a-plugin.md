# Choosing a DSH plugin: who leads each capability surface, measured

> Chinese: [choosing-a-plugin.zh-CN.md](choosing-a-plugin.zh-CN.md)

## 1. How to read this guide

This guide answers one question: **for a specific job, which plugin should you install right now?** It is not organised by catalog category. The catalog's 11 categories are machine-assigned labels, not user problems, and the candidates for a single job are often scattered across several of them. Below, the guide is organised by *what you want to do*. Each surface gives the leader, the measured numbers, one line on what it is good at, and an install command you can run as-is.

Only two fields drive the judgement, both from the 1024Store public API:

- **Installs** (`installs`, cumulative install count recorded by 1024Store)
- **npm weekly downloads** (`npm7d`)

**Stars are not used.** The reason is in section 2, and it is the single most important convention in this article.

Limitations, stated up front:

1. **⚠️ The most important one: the "install count" is a 1024Store-channel figure, not total adoption.** 1024Store's install count **only records installs performed through its own wrapper `dsh1024`**; installs done with the official `dsh plugin` command **are not counted**. The store's own README states it plainly: *"using the official `dsh plugin` command still works, but it will not be counted in DSH 1024Store install statistics."* Supporting evidence: `dsh1024` itself has only **355** weekly downloads. So **"3 installs" does not mean "only 3 people use it."** Throughout this article, install-count rankings should be read as **install activity through the 1024Store channel**, **not total adoption** — a limitation that applies to every install-based comparison and ranking below.
2. **Stars are not a quality signal, and in this dataset they are barely a signal at all.** The catalog lists monorepo sub-packages as separate entries, and every entry inherits its parent repository's star count. In the official star-descending Top 60, a single repository — `zhu1090093659/dsh-web` — occupies **27 slots** (all its entries show 8,400 stars), and those 60 rows come from only **27 distinct parent repositories**. A plainer counter-example: `reactive-resume`, a resume builder, has 43,851 stars, yet its catalog entry shows **66** installs and **223** weekly downloads; `omdsh-dev/DSH-better-sidebar` has only 4,006 stars but **127** installs and **57,806** weekly downloads. **Stars and real usage can point in opposite directions here.**
3. **Install counts include failed retries.** The data carries a `fail` field: the DSH entry for `volcengine/OpenViking` shows **401** installs against **448** failures; `omdsh-dev/DSH-better-sidebar` shows **127** installs against **333** failures. Install count is therefore not successful-install count, and certainly not user count.
4. **npm weekly downloads include CI and mirror traffic, and mislead on their own — but do not let that turn a real plugin into a fake one.** The extreme case: `MichengAI/dsh-codex-ui` shows **86,997** weekly downloads — the highest in the sample — with only **3** installs. Independent verification found it to be **a real, active community web-UI plugin compatible with the current host** (`@michengai/dsh-codex-ui` v1.1.28 / Apache-2.0 / 92 versions / repository created 2026-08-14 / a Host compatibility section covering `0.2.0-rc.1` and `rc.2` / 0 open issues). The 86,997 is a genuine download figure: it is not a name collision (there is no bare `dsh-codex-ui` on npm) and not its own CI (four workflows, no cron). **The problem is not that it is fake, but that a download figure cannot be read directly as adoption** — its daily curve is step-shaped (a steady 24,648–24,968 for five consecutive days, 9/21–9/25), which is why the shape of the curve matters as much as the number. The reverse also occurs: entries with real installs and no npm figure at all.
5. **Category labels are machine-assigned and can be wrong.** In this sample, a balance widget is filed under "fun" and a context-insight panel under "ui". Hence this guide is organised by need, not by category.
6. **The sample is not the whole catalog.** The analysis covers **2,200 entries** — the top 200 of each of 11 categories, de-duplicated by entry id — not all 13,760 catalog rows. Entries with roughly 2 installs still appear at the tail, so full long-tail coverage cannot be guaranteed.

7. **Check whether the plugin you pick has moved recently.** Across the top 200 entries by installs, last push was within **7 days** for **152** entries, **8–30 days** for **25**, **31–60 days** for **23**, and **over 60 days** for **0**. The set as a whole is active, but two of the leaders named below have gone noticeably quiet and are flagged at the relevant surfaces in section 3.

**Verification note**: every leader named in this article was independently verified — its README and package.json were read, its peer range against the current host `@deepseek-ai/dsh@0.2.0-rc.2` was tested with semver, and its open issues were checked. **The compatibility and licensing warnings throughout section 3 are the outcome of that verification.** Verification date: 2026-10-06.

## 2. The ten plugins most people want

One thing first: **the highest-install entry overall (818 installs) is `imsai-sh/awesome-deepseek-harness-plugins`, but it is not a plugin at all — it is 1024Store's catalog/data repository and cannot be installed** (its README states it is generated from the API by `scripts/build-readme.mjs` and lists 13,759 entries; its package.json is `"private": true` with **no bin, no dependencies and no `dsh` field**, and the client lives in a different repository, `dsh1024`). The table below excludes it and lists community plugins only.

| # | Plugin | Installs | Installers | 30d | Fail | npm 7d | Last push (UTC) | What it is good at |
|---:|---|---:|---:|---:|---:|---:|---|---|
| 1 | `volcengine/OpenViking` memory plugin | 401 | 363 | 131 | 448 | 10,160 | 2026-10-06 (0d) | Long-term memory, knowledge retrieval and skills; first on both installs and 30-day growth |
| 2 | `tt-a1i/archify` | 268 | 244 | 115 | 145 | 7,702 | 2026-10-05 (0d) | Architecture, flow, sequence and data-flow diagrams packaged as a skill, exported as self-contained HTML |
| 3 | `liustack/modlens` | 173 | 154 | 37 | 123 | 16,691 | 2026-10-04 (2d) | A vision bridge for text-only models: paste an image, get structured JSON evidence |
| 4 | `vectorize-io/hindsight` | 169 | 148 | 73 | 145 | 19,056 | 2026-10-05 (0d) | Learnable project memory with automatic recall, retention and per-repo isolation |
| 5 | `omdsh-dev/DSH-better-sidebar` | 127 | 99 | 38 | 333 | 57,806 | 2026-10-05 (0d) | A full sidebar workbench: file editing, terminal, Git, subagents, plus third-party tabs |
| 6 | `NanmiCoder/dsh-agent-teams` | 109 | 97 | 38 | 38 | 13,890 | 2026-10-05 (1d) | Multi-agent teams that split long tasks across cooperating agents |
| 7 | `MeteorNOX/DeepSeek-Balance-Whale-Widget` | 108 | 93 | 44 | 60 | 57,320 | 2026-10-05 (1d) | A persistent balance widget in the corner that keeps your account balance in view |
| 8 | `Tencent/BrowserSkill` | 95 | 83 | 51 | 27 | 7,455 | 2026-09-30 (6d) | Lets the agent drive a real, logged-in browser; 30-day growth of 51 is the top band |
| 9 | `bowenliang123/dsh-context` | 50 | 46 | 10 | 19 | 38,839 | 2026-10-05 (1d) | A context-insight panel: what the window holds now, how it evolved, compaction and injection events |
| 10 | `Han-1413141/dsh-cost-meter` | 72 | 65 | 24 | 43 | 31,807 | 2026-10-05 (0d) | Session and daily cost stats, budget gauge, balance, peak/off-peak pricing with one-click sync |

A note on row 9: `bowenliang123/dsh-context` and `Han-1413141/dsh-cost-meter` (row 10) are different things — the former shows the **context window**, the latter shows **money** — but most people want both, so both are listed. Strictly by installs, row 9 would be `Tencent/WeKnora` at 75 installs, but its scope is a document knowledge base with a much narrower audience, so it was left out.

## 3. Surface-by-surface selection

Each surface below gives the leader, the measured numbers, one line on its strength, and a ready-to-run install command. **Where no clear leader exists, this section says so and lists the measured values of the top two or three candidates instead.**

### A. Cross-session memory

**Leader: the DSH memory plugin from `volcengine/OpenViking`** — **401** installs / 363 installers / **131** in 30 days / 448 failures / **10,160** weekly downloads. It is first on installs, installers and 30-day growth, and the only memory entry above 400 installs.

**Three things to know before using it:** ① **License = AGPL-3.0** (most entries here are MIT/Apache, so the licensing difference deserves separate attention); ② its DSH entry is **a client bundle that talks to a server** (auto-recall, session capture, `viking://` URI protection, an MCP tool surface) — **it implements neither the memory store nor retrieval itself**, so the description above can mislead you into thinking it is a complete memory system; ③ "self-evolving" appears only in the `## Research` section of that repository's README, where the subject is **a different research system, VikingMem**, and it is not a product promise — so this section does not use that wording.

The second tier is `vectorize-io/hindsight` (169 installs / 19,056 weekly downloads) and `omdsh-dev/dsh-mnemon` (12 installs but **13,825** weekly downloads).

```bash
dsh plugin --profile web add @openviking/dsh-memory-plugin
```

### B. Cost and usage

This surface is really two different jobs; do not conflate them.

**Leader for money: `Han-1413141/dsh-cost-meter`** — **72** installs / 65 installers / 24 in 30 days / 43 failures / **31,807** weekly downloads. Session and daily cost statistics, a budget gauge, the official balance, a history board, and peak/off-peak pricing with one-click price sync. **Note: "170+ model price entries" and "11 Coding Plan providers" currently rest on the author's own claim only** — the files behind them (`lib/provider-prices.js`, `lib/coding-plans.js`) do exist, but the entries were not counted one by one.

```bash
dsh plugin --profile web add dsh-cost-meter
```

**Leader for the context window: `bowenliang123/dsh-context`** — **50** installs / 46 installers / **38,839** weekly downloads (highest on this surface). It draws the composition and evolution of the context window: share against window size, per-request history, compaction and injection events, and message-level token counts. **Compatibility note (a declaration-layer fact, not proof it fails to run): its `peerDependencies` say `>=0.1.5-rc.1`, and under semver prerelease rules `satisfies("0.2.0-rc.2")` returns `false`.** This is a **declaration-layer** phenomenon — the author's intent is plainly unbounded (the README says 0.1.5-rc.1 and up) and the repository was still receiving commits on the verification date — but it means the automated compatibility check may warn before install, so judge by what actually installs.

```bash
dsh plugin --profile web add dsh-context
```

**Candidates for tokens and balance (no clear leader)**: `Ychris12138/dsh-usage-stats` (20 installs / 2,226 weekly downloads), `zh667/TokenLedger` (13 installs / 258 weekly downloads), `feibi-mochi/deepseek-harness-wallet`. Each does one thing, all under 20 installs, and the gaps are too small to declare a leader.

```bash
dsh plugin --profile web add @ychris12138/dsh-usage-stats
```

### C. IM and remote access

**IM bridge leader: `xmanrui/dsh-im`** — **73** installs / 69 installers / 25 in 30 days / 23 failures / **17,384** weekly downloads. It actually covers **12 IM channels**: Feishu, WeChat, DingTalk, WeCom, **WeCom apps**, QQ, **Slack**, Telegram, **Discord**, WhatsApp, **iMessage** and **Matrix** (plus one AI Office connector). **⚠️ Known failure: issue #299 reports "connection timeouts on desktop 0.2.0-rc.2" — the only failure report in this article that lands directly on the current host**, so desktop users should check that issue's status first.

```bash
dsh plugin --profile web add @xmanrui/dsh-im
```

**Mobile and remote access leader: `shaobeichen/dsh-pocket`** — **30** installs / 26 installers / 11 in 30 days / 3,753 weekly downloads. Run `dsh web` on the desktop and scan a QR code to reach it from a phone over LAN or public network, mirrored live. **⚠️ ① Compatibility unknown: it declares no `dsh-*` peer range at all** (only cordis `^4.0.1`), so there is **no declaration-layer guarantee** for the current host; **② License = GPL-2.0**, unlike the MIT/Apache of most entries; **③ Maintenance: its last push was 2026-09-16, so it has been quiet for 19 days**, making it one of the slower-updating candidates on this surface.

```bash
dsh plugin --profile web add dsh-pocket
```

**Candidates for multi-host remote workspaces (no clear leader)**: `wenbin-wb/dsh-bridge` (2 installs / 5,543 weekly downloads; LAN QR, Cloudflare tunnel or self-hosted WebSocket tunnel), `flymysql/dsh-remote` (1 install / 5,212 weekly downloads; multi-host SSH workspaces), `summer1238/dsh-remote-web-gateway` (1 install). All at 2 installs or fewer, yet none with a low npm figure — no leader can be determined.

### D. Injection and permission safety

**No clear leader on this surface.** Measured values, with gaps inside the noise band:

| Candidate | Installs | Installers | 30d | Fail | npm 7d | Scope |
|---|---:|---:|---:|---:|---:|---|
| `NanmiCoder/dsh-auto-mode` | 13 | 9 | 7 | 0 | 991 | Safe automatic permission handling that keeps controls while allowing automation |
| `PerryLink/dsh-defend` | 3 | 2 | 3 | 0 | 937 | Detects injection, jailbreak and secret leakage at three seams; allow/ask/block tiers |
| `PerryLink/dsh-permission-rules` | 2 | — | — | — | 1,965 | Declarative allow/deny/ask rules plus process-level network policy |
| `moon09300731/dsh-approval-gate` | 5 | 4 | 2 | 1 | 1,083 | Predicts irreversible operations; safe ones auto-approve, dangerous ones go to a human |

`NanmiCoder/dsh-auto-mode` has the most installs and zero failures; `PerryLink/dsh-permission-rules` has the highest weekly downloads (1,965). **This data cannot say which is the better tool.**

**⚠️ Read before using: the repository behind `NanmiCoder/dsh-auto-mode` has been archived (`archived: true`, read-only).** It no longer accepts issues or pull requests, so nothing will be fixed. Its security-policy description was verified as accurate, but **the archived state means this line of work has stopped evolving** — factor that in when treating it as a candidate.

```bash
dsh plugin --profile web add @nanmicoder/dsh-auto-mode
```

### E. MCP management

**No clear leader on this surface**; the two candidates take entirely different routes:

- `duhu2000/dsh-mcp-connector` — **5** installs / 5 installers / **7,150** weekly downloads (highest here). A general-purpose MCP connector, connection manager and extension marketplace: connect MCP servers, discover tools and prompts, with OAuth/PKCE and API-key support and JSON import.
- `PerryLink/dsh-mcp-panel` — **13** installs / 13 installers / 9 in 30 days / 2 failures / 2,472 weekly downloads. A read-only runtime management panel: an `/mcp` command and a settings page showing connection state, registered tools, errors and reconnect counts.

By installs the latter is ahead; by npm the former is nearly 2.9× the latter. **One leans toward connecting and onboarding, the other toward observing and diagnosing — they are not two implementations of the same job.**

```bash
dsh plugin --profile web add dsh-mcp-connector
```

### F. Vision and image understanding

**Leader: `liustack/modlens`** — **173** installs / 154 installers / 37 in 30 days / 123 failures / **16,691** weekly downloads. A vision bridge for text-only models: paste an image and get structured JSON evidence (OCR, layout, semantics). It leads on both installs and npm, and is the only vision entry above 150 installs.

```bash
dsh plugin --profile web add @liustack/modlens
```

Second tier: `ysr666/dsh-vision-router` (48 installs / 10,168 weekly downloads; a built-in keyless vision chain plus pixel-level tools) and `Anionex/dsh-vision-toolkit` (35 installs / 3,652 weekly downloads; image Q&A, multi-image comparison, long-screenshot OCR, screenshot-to-UI). Both overlap with modlens but each has its own emphasis.

### G. Sidebar and UI foundation

**Leader: `omdsh-dev/DSH-better-sidebar`** — **127** installs / 99 installers / 38 in 30 days / **57,806** weekly downloads (second highest in the whole sample). A full sidebar workbench: built-in file rendering and editing, Git and subagent views, and third-party plugins can register new tabs. **Note: the terminal is not something it provides** — its README states that the terminal and its `node-pty` were **handed back to DSH's built-in `ui-sidebar-terminal`**, and its own npm description deliberately omits the terminal.

```bash
dsh plugin --profile web add dsh-better-sidebar
```

Other parts of the same surface (they do not conflict and can be installed separately):

| Part | Installs | npm 7d | Note |
|---|---:|---:|---|
| `omdsh-dev/dsh-genui` | 26 | 9,982 | Renders interactive UI inside assistant replies: layout, charts, forms, quizzes, mermaid, 3D scenes |
| `omdsh-dev/dsh-at-file` | 26 | — | Codex-style `@file` references: search and reference workspace files in the composer |
| `zhu1090093659/dsh-web` `dsh-doctor` | 36 | — | Task board, git graph, right panel, remote mobile UI, pet, token stats and skin center |
| `zhu1090093659/dsh-web` `dsh-plugin-manager` | 59 | 27,649 | Client-side plugin management: install, enable, remove |

```bash
dsh plugin --profile web add @changfenhuang/dsh-genui
```

### H. TUI

**Leader: `ccch1mneyyy/dsh-TUI`** — **42** installs / 34 installers / 10 in 30 days / 92 failures / **16,008** weekly downloads (highest here). A Claude Code-style full-screen terminal UI: pixel-whale header, live status line, streaming thought expansion.

```bash
dsh plugin --profile web add @deepseek-harness-tui/dsh-tui
```

The second candidate on this surface is `huiliyi37/dsh-tianshu-tui` at 3 installs / 544 weekly downloads — an order of magnitude smaller.

### I. Plugin marketplace and distribution

**No clear leader on this surface**; the two routes differ enormously in scale and in kind:

| Candidate | Installs | Installers | npm 7d | Scope |
|---|---:|---:|---:|---|
| `imsai-sh/awesome-deepseek-harness-plugins` | 818 | 763 | — | **1024Store catalog/data repository** (not a plugin; cannot be installed) |
| `dsh-market/dsh-market` | 53 | 43 | — | Browse the whole community catalog inside DSH, filter by category, one-click install |
| `dshplugin/dsh-plugin-hub` | 5 | 5 | **6,198** | Community in-app marketplace; the entry claims 4,000+ curated plugins, updated daily |
| `zhu1090093659/dsh-web` `dsh-market` | 33 | 25 | — | A workshop UI for discovering and installing community plugins |
| `kingOfSoySauce/dsh-skin-market` | 26 | 24 | 2,761 | A skin marketplace (themes only, not general plugins) |

The highest install count belongs to `imsai-sh/awesome-deepseek-harness-plugins`, which is a catalog/data repository and **not an installable plugin**; among third parties, `dsh-market` leads on installs (53) while `dsh-plugin-hub` leads on npm (6,198, with just 5 installs). **The two figures point to different conclusions, so this surface gets no verdict.**

```bash
dsh plugin --profile web add github:dsh-market/dsh-market
```

### J. Desktop shell

**No clear leader on this surface**; the three candidates have different trajectories:

- `anywhere-labs/dsh-desktop` `dsh-plugin-desktop` — **79** installs / 63 installers / **7** in 30 days / **363** failures / 129 weekly downloads. A modern desktop shell that treats the desktop itself as a plugin container. Highest installs, but only 7 in the last 30 days and 363 failures.
- The `zhu1090093659/dsh-web` aggregate package — **55** installs / **24** in 30 days / only **3** failures. Its 30-day growth is the highest of the three.
- `dsh-tauri-desk/deepseek-harness-desktop` `dsh-tauri` — 1 install; the Tauri desktop shell.

```bash
dsh plugin --profile web add dsh-plugin-desktop
```

### K. Browser control

**Leader: `Tencent/BrowserSkill`** — **95** installs / 83 installers / **51** in 30 days / **27** failures / 7,455 weekly downloads. A CLI plus extension that lets the agent drive a real, logged-in browser and automate tasks without disturbing you. Its 30-day growth of 51 is in the top band, and its failure count is the lowest in that band. **⚠️ Known security issue: issue #402 reports "an unauthenticated loopback daemon able to drive the browser extension"**, meaning a local process can drive the browser without authorization — assess that exposure before deploying.

```bash
dsh plugin --profile web add @wxg-prc-cpg/browser-skill-dsh-plugin
```

Other routes, each with single-digit installs: `Lum1104/dsh-browser` (5 installs; a Chrome sidebar extension needing no vision), `Fisfzy/ego-browser` (9 installs; 13 structured tools and a bundled runtime), `wqty123/dsh-browser` (5 installs / 5,515 weekly downloads).

### L. Plugin development toolchain

**No clear leader on this surface.** `PerryLink/dsh-mcp-panel` ranks 4th in this sample's `dev` category with **13** installs; `PerryLink/dsh-plugin-guide` has 6 installs / 1,012 weekly downloads. Everything else on the surface sits at 1–2 installs: `MicroMilo/upstream-radar` (2 installs / 484 weekly downloads; dependency security monitoring), `Airmetro/dsh-update-checker` (8 installs / 2,819 weekly downloads; host version detection), plus a group of candidates with real npm volume but zero installs.

**Measured values across this surface are uniformly low — not enough to support a "leader" claim.**

```bash
dsh plugin --profile web add dsh-mcp-panel
```

### M. Agent teams and orchestration

**Leader: `NanmiCoder/dsh-agent-teams`** — **109** installs / 97 installers / 38 in 30 days / **38** failures / **13,890** weekly downloads. It is first on installs, installers, 30-day growth and npm, and leads the runner-up by a wide margin.

```bash
dsh plugin --profile web add @nanmicoder/dsh-agent-teams
```

Second tier: `Q00/ouroboros` (8 installs; staged evaluation with budget control) and `MichengAI/dsh-automation` (7 installs / 4,003 weekly downloads; scheduled and automated tasks).

### N. Web search

**No clear leader on this surface**; two candidates are tied on installs:

| Candidate | Installs | Installers | 30d | Fail | npm 7d | Scope |
|---|---:|---:|---:|---:|---:|---|
| `liustack/modsearch` | 30 | 25 | 12 | 16 | 7,347 | Search the web and X, returning structured JSON evidence (search/fetch/citations) |
| `anysearch-team/anysearch-dsh` | 30 | 30 | 13 | 35 | 1,749 | Web search and advanced search tools |
| `DDDMUC/dsh-free-search` | 18 | 16 | 6 | 4 | 14,568 | Keyless free web search (DuckDuckGo) |

Installs are tied at 30 apiece; `dsh-free-search` has the highest npm figure (14,568) but only 18 installs. **Each leads on one metric, so no leader is declared.**

```bash
dsh plugin --profile web add @liustack/modsearch
```

### O. Office documents and deliverables

**No clear leader on this surface**; the candidates trade wins across dimensions:

| Candidate | Installs | npm 7d | Scope |
|---|---:|---:|---|
| `dream-num/dsh-univer-office` | 19 | **12,227** | Spreadsheets, documents, presentations, multi-dimensional tables, canvas, with live preview and worktree review |
| `Tencent/WeKnora` `dsh-weknora` | **75** | 1,217 | Turns raw documents into a queryable RAG, an autonomous reasoning agent and a self-maintaining wiki |
| `Devin-AXIS/iPolloWork` `ppt-studio` | 24 | 443 | Presentation authoring and editing |

The highest install count is `dsh-weknora` (75) while the highest npm figure is `dsh-univer-office` (12,227) — nearly 10× apart. They do not solve the same problem (knowledge base versus document output), **so they are not comparable on one surface.**

```bash
dsh plugin --profile web add dsh-univer-office
```

### P. Image generation

**No clear leader, and overall volume on this surface is clearly low.** The highest-install image-generation entry in the sample is `shanliuling/dsh-image-gen` (**8** installs / 7 installers / **7,216** weekly downloads; multi-vendor support for Gemini, OpenAI and Seedream), followed by `dickpy/dsh-imagegen` (4 installs / 2,661 weekly downloads). **Installs are in the single digits — real adoption for this surface inside the catalog is still very low.**

```bash
dsh plugin --profile web add dsh-image-gen
```

### Q. Session rewind and archiving

**Rewind leader: `Anionex/dsh-turn-rewind`** — **24** installs / 17 installers / 5 in 30 days / **4** failures / 1,504 weekly downloads. It rolls back session and workspace state on a persistent Change Ledger, with the lowest failure count among its peers. **⚠️ Positioning correction: it is really "message-anchored project-file recovery, with optional conversation rewind", and it does modify project files on disk** — do not assume it only rolls back the conversation and leaves your workspace untouched. Confirm the scope you want restored before using it.

```bash
dsh plugin --profile web add @anionex/dsh-turn-rewind
```

**Archive and session-management leader: `dream12347/dsh-session-manager`** — **20** installs / 17 installers / **9** in 30 days / **3** failures. Delete with trash/restore/purge, statistics, continue/pause, open the log folder, workspace grouping and sorting, and a context-compaction threshold. **⚠️ Note the maintenance state, though: its last push was 2026-08-27, so it has been quiet for 39 days — the quietest of any leader named in this article. With only 20 installs and 9 in 30 days the sample is small to begin with, so check whether the repository is still responsive before adopting it.**

```bash
dsh plugin --profile web add dsh-session-manager
```

Other candidates: `zhu1090093659/dsh-web` `dsh-session-archive` (19 installs / **25,779** weekly downloads; archives and stores whole sessions), `z953218350/dsh-archive-manager` (16 installs / 2,351 weekly downloads), `SiriLee/dsh-rewind` (11 installs / 8,546 weekly downloads). Note that `dsh-session-archive` has the surface's highest npm figure but only the third-highest install count — **where the two metrics disagree, this guide ranks by installs first, npm second, and shows the disagreement.**

### R. Skins and themes

**Leader: the skin center from `zhu1090093659/dsh-web` (`skin-center`)** — **75** installs / 67 installers / 26 in 30 days / 55 failures. It browses and applies themes in one place and has the highest install count on the theme surface.

```bash
dsh plugin --profile web add @linxin666/dsh-client-ui-skin-center
```

Behind it: `Small-tailqwq/dsh-deep-whale` (31 installs), `kingOfSoySauce/dsh-skin-market` (26 installs / 2,761 weekly downloads), `elysia395/dsh-wallpaper-engine` (23 installs / **13,004** weekly downloads, the highest npm figure on the surface).

### S. Fun and companions

**Leader: `MeteorNOX/DeepSeek-Balance-Whale-Widget`** — **108** installs / 93 installers / 44 in 30 days / **57,320** weekly downloads. A balance widget that lives in the corner of the interface, with drag-to-snap and rolling-number animation. It is first on both installs and npm for this surface.

```bash
dsh plugin --profile web add dsh-whale-widget
```

Behind it: `zhu1090093659/dsh-web` `dsh-liangshen` (18 installs), `dsh-pet` (14 installs), `vlln/whale-girl` (13 installs / 1,044 weekly downloads), `PC2005-cloud/dsh-pet` (8 installs).

### T. Finding evidence beyond the page (search and fetch)

See surface N above; not repeated here.

## 4. The surfaces where he is not first (an honest list)

This section is the load-bearing wall of the article's credibility. It is not softened.

**The author's entries number just six in the top 200 by installs:**

| Entry | Installs | Installers | 30d | Fail | npm 7d |
|---|---:|---:|---:|---:|---:|
| `PerryLink/dsh-mcp-panel` | 13 | 13 | 9 | 2 | 2,472 |
| `PerryLink/dsh-plugin-guide` | 6 | 6 | 5 | 1 | 1,012 |
| `PerryLink/dsh-local-ai` | 4 | 4 | 3 | 3 | 900 |
| `PerryLink/dsh-defend` | 3 | 2 | 3 | 0 | 937 |
| `PerryLink/dsh-claude-move` | 3 | 3 | 3 | 0 | 843 |
| `PerryLink/dsh-output-styles` | 3 | 1 | 3 | 0 | 826 |

**For comparison: the top community plugin in this article has 401 installs.** That gap needs no commentary.

Surface by surface — **on all of the following he is not first:**

| Surface | Leader (measured) | The author's entry (measured) |
|---|---|---|
| Cross-session memory | `OpenViking` memory plugin 401 / npm 10,160 | `dsh-memento` did not reach the top 200; the 20th-place threshold on the memory surface is **1** install, and its npm figure is 1,202 |
| Cost and usage | `dsh-cost-meter` 72 / npm 31,807 | no entry on this surface |
| IM and remote | `xmanrui/dsh-im` 73 / npm 17,384 | no entry on this surface |
| Injection and permission safety | see surface D: **no clear leader** | `dsh-defend` 3 installs; `dsh-permission-rules` 2 installs / npm 1,965 |
| Image generation | surface maximum is 8 installs (`dsh-image-gen` / npm 7,216) | `dsh-draw` does not appear in this sample's top 200 |
| MCP management | **no clear leader**; `dsh-mcp-connector` 5 installs / npm 7,150 | `dsh-mcp-panel` 13 installs / npm 2,472 |
| Session migration | `Nwflower/dsh-chat-import` 10 installs / npm 5,111 | `dsh-claude-move` 3 installs / npm 843 |
| Output styles | no strong entry inside this sample | `dsh-output-styles` 3 installs / npm 826 |
| Plugin marketplace | **no clear leader** (best third party: 53 installs) | his marketplace entries are not in this list |
| Context insight | `bowenliang123/dsh-context` 50 installs / npm 38,839 | no entry on this surface |
| Plugin development knowledge | no strong entry inside this sample | `dsh-plugin-guide` 6 installs / npm 1,012 |

**Two asymmetries must be spelled out rather than glossed over.**

1. For `dsh-claude-move` and `dsh-output-styles`, the comparison target — "the strongest third party on the same surface" — **cannot be found in this sample's top 200**. That is not the same as the author being first; it means the surface is thin in the catalog data.
2. `dsh-memento` did not reach the top 200 by installs, but the 20th-place threshold on the memory surface is only 1 install. "Not in the top 200" and "zero installs" are different claims, and the latter cannot be inferred.

**Separately, an earlier independent adoption survey by the author (2026-10-05, npm registry) reached the same conclusion in a harsher form.** Those weekly download figures **are not part of this article's data source, so they appear only as background**:

- Cost: his 1,079 ← third party **33,526**
- Memory: his 1,202 ← third party **10,160**
- IM: his 752 ← third party **17,384**
- Safety: his 937 ← third party **13,087**
- Image generation: his 973 ← third party **7,216**

In that same survey `dsh-mcp-panel` at 2,472 was first within his own family, yet a stronger third party existed on the surface (`dsh-mcp-connector` at 7,556). **In this sample that comparison still holds** — 7,150 against 2,472, about 2.9×.

**In one line:** the author's only foothold in the first tier is `dsh-mcp-panel`, which barely reaches this sample's top 5 in the `dev` category; the other five entries are in single-digit installs. **For the question "who is first", the answer is almost never him.**

## 5. Common traps when choosing a plugin

1. **Do not sort by stars to pick a plugin.** The catalog treats monorepo sub-packages as separate entries and each inherits the parent's star count — one repository holds 27 of the official star Top 60. A reproducible check is in section 6.
2. **What you see are entries, not plugins.** The same repository appears many times (`zhu1090093659/dsh-web` occupies 27 star-ranking slots). **When one repository name repeats through a leaderboard, that is parent-repo spill, not 27 popular plugins.** Every leaderboard referenced here has been de-duplicated by parent repo.
3. **Install counts contain failed retries.** 401 installs against 448 failures, and 127 installs against 333 failures, are both real readings. When an entry looks popular, glance at its `fail`.
4. **Failures can exceed installs by more than tenfold.** `nexu-io/open-design` `dsh-runtime`: **73** installs against **1,103** failures. **A high failure count does not automatically mean poor quality** — it can simply reflect heavy environment dependencies or many build steps — but it is a risk signal you should have before choosing.
5. **npm weekly downloads and install counts can diverge sharply; read both.** The extreme case: `MichengAI/dsh-codex-ui` at **86,997** weekly downloads (highest in the sample) with **3** installs; `omdsh-dev/dsh-mnemon`'s `dsh-mnemon-strategy-scoped` at **7,627** weekly downloads with **0** installs. **Zero installs with real npm volume usually means CI, mirrors, or a sub-package pulled in by its parent — not users — but confirm the package is a real plugin before concluding that: `dsh-codex-ui` is the case where that inference went wrong (real, active and compatible with the current host; see section 1, item 4).**
6. **Category labels are not trustworthy.** A balance widget is filed under "fun", a context panel under "ui", and the "tools" category mixes knowledge bases, vision, presentations and marketplaces. **Search by need, not by category.**
7. **30-day growth reflects the present better than total installs.** `anywhere-labs/dsh-desktop`'s desktop plugin has 79 total installs but only **7** in 30 days and 363 failures, while the `zhu1090093659/dsh-web` aggregate has 55 installs, **24** in 30 days and only 3 failures. **Totals are history; 30-day growth is now.**
8. **Do not treat "highest install count" as a recommendation — or as a plugin.** The highest-install entry, `imsai-sh/awesome-deepseek-harness-plugins`, is 1024Store's **catalog/data repository and cannot be installed**; it is not a community plugin, and it has been excluded from the recommendation table.

## 6. Data sources and how to reproduce

**Source and conventions**

- Endpoint: `deepseek1024.com/api/v2/plugins` (DSH 1024Store)
- Catalog total: **13,760** entries (the `catalogTotal` key in the v2 JSON)
- API generated at `2026-10-06T04:31:08.815Z`; locally normalised at `2026-10-06T06:43:06.608Z`
- Sample analysed here: **2,200 entries** (top 200 of each of 11 categories, de-duplicated by entry id) — **not the full catalog**
- Sort fields: `installs` (raw `installCount`), `npm7d` (raw `npmDownloads7d`)
- Supporting fields: `installers` (`installerCount`), `installs30d`, `fail` (`failureCount`), `pushedAt` (last push to the default branch), `latestReleaseAt` (may be null)

**Reproducing the star-spill finding**

1. Take the official Top 60 sorted by stars descending.
2. Group by `repo` and count how many slots each repository occupies.
3. Result: those 60 rows come from only **27 distinct parent repositories**, and `zhu1090093659/dsh-web` alone occupies **27 slots** with an identical star count (8,400) — direct evidence that sub-packages inherit the parent's stars.
4. Cross-check: `nexu-io/open-design` 99,560★, `tt-a1i/archify` 78,074★, `vectorize-io/hindsight` 45,905★, `reactive-resume` 43,851★ — all **parent-repository** star counts, not the DSH entry's own.

**Reproducing "stars and usage can be inverted"**

Read the `stars`, `installs` and `npm7d` columns for any two entries. The comparison used here is `reactive-resume` (43,851★ / 66 installs / 223 weekly downloads) against `omdsh-dev/DSH-better-sidebar` (4,006★ / 127 installs / 57,806 weekly downloads).

**Data files used**

- `00-live/_tmp-research/selection-dataset-2026-10-06-v2.md` (human-readable: A = top 100 de-duplicated by installs, B = top 100 by weekly downloads, C = top 20 per category by installs)
- `00-live/_tmp-research/selection-dataset-2026-10-06-v2.json` (exact values; keys `byInstalls` / `byNpm7d` / `dedupByRepoTop100` / `starSpillEvidence` / `sampledEntries`)
- `D:\Projects\dsh-plugin-supersession-review-20261005.md` (used only for one background survey in section 4, where the different convention is stated explicitly)

**Known gaps**

- Feature-level comparison: the body of this article compares adoption only; apart from the compatibility, licensing and failure warnings flagged in section 3, the "what it is good at" lines still rest on each entry's own stated scope and were not comprehensively verified. (Those section-3 warnings come from independent verification of the leaders: reading their README and package.json, testing peer ranges with semver, and checking open issues, on 2026-10-06.)
- Long tail: the sample is the top 200 per category, so coverage below roughly 2 installs is not guaranteed to be complete.
- Five third-party rivals from the author's earlier survey (including `cc-safety-net`) **are not in this article's data source**, so they appear as background only and are never used as selection evidence.

***

**Conclusion**: what this guide can tell you is which entries people actually install, how many installs they have, and how many failures. What it cannot tell you is which plugin is better written. **The former is what this data is good at; the latter requires reading the README and trying it yourself.** Every surface where the data cannot support a verdict is labelled "no clear leader" with the candidates' measured values listed — no winner was manufactured.
