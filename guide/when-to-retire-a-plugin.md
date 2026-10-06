# How I decide whether a DSH plugin should keep being maintained

> Chinese: [when-to-retire-a-plugin.zh-CN.md](when-to-retire-a-plugin.zh-CN.md)

## 0. What I did, and why it is public

On 2026-10-05 I pulled the whole DSH plugin ecosystem from npm — **324 real plugins** — and benchmarked every plugin I publish against its rivals on the same capability surface, by weekly downloads. The outcome: **3 retired, 7 frozen, 1 reclassified**. I am publishing the criteria because "should this keep going" is a question every plugin author meets, and most meet it without data.

## 1. The criteria

One thing first: **this is not a purge, it is a self-audit.** The official project is not eliminating third-party plugins — `CONTRIBUTING.md:19` says plainly that packages in the official repository are not inherently more important than community packages, and that the official showcase is "an idea, an official showcase, and a source of inspiration, but **not a mandate from us**". The pressure comes from other third-party authors. Section 3 shows the data.

**Two hard criteria.**

**Hard criterion A: the same capability has been taken into the host's core.** Wording matters. Not "the official repo has a package with a similar name", but "the official composition **mounts it by default**", or "the official project has made it a **first-class subsystem**". The gap between those two readings is the single easiest mistake to make in this kind of review.

**Hard criterion B: on the same capability surface, a third party has a significantly better-adopted implementation.** "Significantly" means one order of magnitude. Any such comparison is only valid as a **relative** magnitude inside one ecosystem, never as an absolute number.

**One soft criterion.**

**Soft criterion C: maintenance cost versus real usage.** This one is easy to misuse. My own Web profile now runs the stock bundle set and installs none of the family's plugins. So "do I still use it" cannot be the criterion — for me these repositories are **published artifacts**, not **personal tools**. The two questions that can be criteria are: **does anyone out there still need this**, and **is this maintenance cost still worth paying**.

**One meta-rule.**

**Only file-level evidence counts.** Every conclusion has to point at a specific file, a specific line, or a specific npm / GitHub API reading. Anything that cannot is marked "unverified" and stays out of the decision. This rule corrected four of my own starting premises this round, two of them directly about whether the official project has a capability at all — one where it does and simply does not mount it, and one where it does mount it and I had assumed otherwise.

**Three dispositions.**

| Disposition | Count | Packages | Meaning |
|---|---|---|---|
| 🪦 **Retired** | 3 | `dsh-background-agents`, `dsh-session-pin`, `dsh-team-rooms` | **Compatibility updates stop**: RETIRED banner at the top of the README, npm `deprecate` applied, GitHub repository archived (read-only) |
| 🧊 **Frozen** | 7 | `dsh-budget`, `dsh-memento`, `dsh-draw`, `dsh-claude-move`, `dsh-reach`, `dsh-wechat`, `dsh-defend` | **No new features — but still working and not deprecated**; only genuine breakage gets fixed |
| ✅ **Reclassified** | 1 | `dsh-catalog` | First judged as a retirement; after review, kept: it is an internal family tool and does not compete with third-party catalogs. **Still maintained** |

Two earlier corridor packages, `dsh-plugin-upgrade-015` (stopped at npm `0.1.1`) and `dsh-plugin-upgrade-016` (never published), are also retired; plugin upgrades continue through the single `dsh-plugin-upgrade` line.

## 2. The data, part one: the 3 retirements

This tier used hard criterion A almost exclusively.

| Package | Official counterpart | Why it was judged retired |
|---|---|---|
| `dsh-background-agents` | `tool-subagent` (`backgroundMode: continuable`) + `tool-subagent-control` + `tool-jobs` | The official composition **mounts it by default**. And the package's **own README already said so**: the background-agent half is *superseded by DSH's native continuable subagents* |
| `dsh-session-pin` | the `client-ui-workspace` pin action | Mounted **by default**: the session context menu has `Pin session`, rows have a hover pin button, pins can be reordered by dragging inside the pinned block, and the host persists `pinnedSessionIds` and broadcasts `pinned` delta frames. What is left for the plugin is appearance work — row colours, a pinned panel, a header toggle |
| `dsh-team-rooms` | `dsh-experimental-agent-team` | The official project turned "teams" into a **first-class subsystem**: an implicit root roster, a persistent mailbox (offline members receive mail on return, with de-duplication), a shared task DAG (compare-and-swap against overwrites, dependency unlocking, file-write conflict warnings), `wait_agent`. It **also** satisfies hard criterion B: its own weekly downloads are **589 — the lowest in the family**, while `@nanmicoder/dsh-agent-teams` sits at **13,273 (22×)** |

One honest qualification on `dsh-team-rooms`: the official `dsh-experimental-agent-team` is **optional**, `disabled` by default in base, and enabling it **requires disabling** `send_message` / `interrupt_agent` / `list_agents`. So this is not a "mounted by default" supersession. It entering the core, plus the third-party 22× adoption, is what makes the case.

One unflattering number I am leaving in: after the host shipped a built-in pin, `dsh-session-pin` **still had 1,015 weekly downloads**. The report offers two readings — appearance enhancements are genuinely wanted, or the download metric carries noise. I cannot separate the two with the data I have, so I retired it on the criteria and left the number standing here.

## 3. The data, part two: the 7 freezes — the multiplier table

Measured 2026-10-05 from the npm registry API. **On method first**: npm weekly downloads are **not** user counts (they include CI, mirrors and repeated installs), so the table below is used purely for the **relative** magnitude between packages, never as an absolute figure.

| Capability surface | My package (weekly downloads) | Third-party rival on the same surface (weekly downloads) | Multiplier | Where the rival is stronger |
|---|---|---|---|---|
| Cost / usage metering | `dsh-budget` 1,079 | **`dsh-cost-meter` 33,526** | **31×** | 170+ model price entries and quota lookups for 11 coding plans |
| Cross-session memory | `dsh-memento` 1,202 | **`@openviking/dsh-memory-plugin` 10,160** | **8×** | An official organisation repository from ByteDance volcengine — company-level resourcing |
| IM bridging | `dsh-reach` ~0.6k / `dsh-wechat` 752 | **`@xmanrui/dsh-im` 17,384** | **23×** | One package covers 10 channels (WeChat / Feishu / WeCom / DingTalk / QQ / Telegram / WhatsApp / Slack / Discord / Matrix) |
| Injection and destructive-command defence | `dsh-defend` 937 | **`cc-safety-net` 13,087** | **14×** | Blocks destructive commands and secret-file access directly as a coding-agent CLI hook — a short adoption path and a wide audience |
| Image generation | `dsh-draw` 973 | **`dsh-image-gen` 7,216** | **7×** | Multi-provider |
| Session / configuration migration | `dsh-claude-move` 843 | **`dsh-chat-import` 5,111** | **6×** | Covers 25+ AI coding agents |

**Four background readings.**

- **The size of the field.** Two keywords intersected: 8,620 hits, 772 candidates, and after checking the `dsh` field package by package, **324 genuine plugins**. (A note on scope: this counts **only packages on npm that declare a `dsh` manifest and can actually be installed with `dsh plugin add`**. Community directory sites publish much larger entry counts, because they also count GitHub repositories, sub-directories and unpublished candidates. The two figures should not be quoted against each other, and must not be added together.)
- **This is not an isolated case.** **Of 16 capability surfaces, my packages are not first on 14**, most of them behind by **3–31×**. The widest gap is on context insight: `dsh-fast` 917 against `dsh-context` 38,999 (**43×**).
- **First in the family is not first on the surface.** `dsh-mcp-panel` at 2,472 is the family's top package, but `dsh-mcp-connector` on the same surface is 7,556 (3×).
- **Nothing here was abandoned.** Before this review, every affected repository had been pushed on 2026-10-05 itself. The retirements and freezes are a **deliberate judgement**, not a cleanup of dead projects.

**Why these seven?** They satisfy two things at once: the rival is not merely better-adopted but **broader in capability** (multi-provider, multi-channel, multi-agent, or organisation-backed); and further investment from me on that surface is unlikely to produce something only I can provide.

Two counter-examples have to travel with the criteria, or they collapse into "behind means retire":

- **`dsh-fast` (917 against `dsh-context` 38,999, 43×) stays as it is.** It is a lightweight package with a low maintenance cost; freezing it would save very little. **Being behind is not a criterion.**
- **Hard criterion B alone can be enough, with hard criterion A failing.** For `dsh-draw` the official counterpart is **zero** (`text-to-image` / `image_gen` / `txt2img` have 0 hits across the host repository), and the same is true for `dsh-memento` (there is no memory seam in the official `capability-seams.md`, and `docs/user/guide/mcp-memory.md:5,31` states outright that **no memory server is present in the shipped composition**). **"The official project does not do this" does not mean "I should keep investing"** — the memory surface has at least 10 rivals, and `dsh-memento` sits around 8th.

## 4. Where I am still first

Listing only the losing half would be misleading. This is the contemporaneous "still only me" list (2026-10-05):

| Capability surface | My packages (weekly downloads) | Status |
|---|---|---|
| LSP action surface | `dsh-lsp-actions` **1,170** | **No strong rival anywhere in the ecosystem.** The official LSP **deliberately excludes** rename / formatting / diagnostics / symbol lists |
| Plugin certification, health checks, scoring | `dsh-plugin-doctor` 218, `dsh-score`, `dsh-test-drive`, `dsh-plugin-certification` | **No rival.** The ecosystem only has `dsh-why` (137) and `dsh-fix` (1,503) — tools that repair a broken plugin, not a scoring system |
| Research / report engines | `dsh-research-report` 1,019, `dsh-industry-research` 926, `dsh-fund-research` 802 | **Essentially unrivaled** (vertical domains) |
| Data quality | `dsh-data-quality` 769 | Only `dsh-data-cleaning-agent` comes close |
| Declarative permissions + network policy | `dsh-permission-rules` **1,459** | `dsh-perm-gate` is **slightly higher** at 1,851 (the report marks this row "rival marginally ahead"), but its **process-level HTTP / CONNECT proxy network policy** has not been replicated by anyone |
| GitHub CI automation | `dsh-github` 359 | No rival (also the lowest, but genuinely nobody else is doing it) |

Two cross-checks:

- **The star leader is not the flagship security plugin — it is the research line.** `dsh-research-report` (215★) and `dsh-industry-research` (212★) are both above `dsh-memento` (139★), `dsh-permission-rules` (118★) and `dsh-mcp-panel` (75★).
- **"The official project lacks it" and "a third party has not built it" are two independent facts.** The report confirms at least eight surfaces where the official project is still at zero (`dsh-defend`, `dsh-mask`, `dsh-budget`, `dsh-draw`, `dsh-translate`, `dsh-library`, `dsh-autotier`, the `dsh-plugin-*` toolchain). Some of those have been taken by third parties; some are still empty. **An empty space is not a moat. Nobody doing it, and me being able to do it well, is a moat.**

## 5. "Frozen" does not mean "deprecated"

This section is for users.

| Status | Will the package be deleted or unpublished? | Will bugs still be fixed? | npm state | Repository state |
|---|---|---|---|---|
| 🪦 **Retired** (3) | No | **No** — including compatibility updates | `deprecate` applied | Archived, read-only |
| 🧊 **Frozen** (7) | No | **Yes** — but only a minimal compatibility fix, and only when a breaking host change makes the package completely unusable | Normal, **not** deprecated | Normal, **not** archived |
| Everything else | No | Yes | Normal | Normal |

**If you have one installed, there is nothing you need to do.** The seven frozen packages install and run exactly as before: no interface changes, no versions pulled. The only thing that would require action is a host upgrade that actually breaks one — in that case, please open an issue and I will fix it. **If what you want is new features, please use the rivals named in the section 3 table.** Every one of them is significantly better adopted on its surface, and that is precisely why the package is frozen.

**Why not express this by deleting packages?** Because deleting them means the next person cannot find the package, and cannot find the reason it was retired either. So the family tables **keep every row and only add a status note**: retired and frozen repositories stay listed in every family table with a `🚫 RETIRED` / `🧊 FROZEN` status column, and their original descriptions are left untouched.

## 6. Eight self-check questions for other plugin authors

1. **Does the official project "have a package", or "mount it by default"?** The official `experimental/*`, `computer-use`, `browser-use`, `lsp` and `speech-to-text` packages are **not in the stock composition**. "The official project has a package" is not "the user gets the capability on install".
2. **Does a line in `base` mean the user has the capability?** Not necessarily. The Web patch **disables the base process-level model-facing tool rows one by one** and hands them to each agent preset to remount. Reading only `base/cordis.patch.yml` produces a systematically over-optimistic answer.
3. **Did you search for rivals by capability keyword, or by package name?** Comparing names alone misses every rival: `dsh-cost-meter` and `dsh-budget` share no name at all, and neither do `cc-safety-net` and `dsh-defend`.
4. **Does the same name mean the same thing?** The official `dsh-experimental-auto-review` and `dsh-auto-review` share a name but invert the security model: the official one reviews with the current agent's own provider/model and says of itself that it *can allow unsafe actions, deny useful work, and spend additional tokens*, with no deterministic exemptions and no persistent grants; mine is an independent read-only second-model reviewer that **fails closed**. That is not a supersession.
5. **Can a second signal corroborate your download count?** `dsh-budget` has 1,079 weekly downloads and **10 stars** — high downloads look like CI and mirror noise, while low stars look like real appeal. In the other direction, `dsh-auto-review` carries **10 open issues**, which is what real use and real bug reports look like. Download counts alone mislead.
6. **Is "do I still use it" your criterion?** If you no longer use it, it should not be (my own Web profile runs the stock bundle set today). Replace it with two questions: **does anyone out there still need this, and is the maintenance cost still worth it?**
7. **How far behind do you have to be?** There is no threshold. `dsh-fast` is 43× behind and stays as it is; `dsh-defend` is 14× behind and is frozen. The price of freezing is admitting you are no longer the best choice on that surface, so it is only worth paying for packages where further investment will not produce anything distinctive.
8. **Is your decision written into the README?** A decision that lives only in your head, or only in an internal report, does not exist. Each of the seven frozen packages carries a `## Maintenance status: 🧊 FROZEN` section with the measured comparison table and a note on where the rival is stronger; each of the three retired packages carries a RETIRED banner at the top of its README. **At a minimum, users should be able to learn from the README why you stopped.**

## 7. Statement of fact

- **The family today**: the family tables list **44 plugin repositories** (45 rows in the tables that include `dsh-plugin-upgrade-015`), of which 🚫 **3 are retired** and 🧊 **7 are frozen**; the rest are maintained as active repositories. Licensing is predominantly Apache-2.0.
- **Where the repositories are**: https://github.com/PerryLink
- **Measurement date**: 2026-10-05, from that self-audit — a full npm registry pull, live GitHub REST API measurements, and file-by-file evidence from the host source tree. **The conclusions are checkable**: each one points at a specific file or a specific API reading, and anything that could not was marked "unverified".

One last line, for anyone who might want to take something over: **`dsh-reach` and `dsh-wechat`, the two IM bridging lines, are open for a new maintainer.** The reason they are frozen is specific — `@xmanrui/dsh-im` covers 10 channels in a single package, and that is a better job than mine. If those two lines are useful to you and you want them to keep growing, both repositories carry permissive licences (`dsh-reach` is Apache-2.0, `dsh-wechat` is MIT); please open an issue and we can talk about the handover.
