---
name: dsh-plugin-guide
description: Use when designing, reviewing, or improving a DeepSeek Harness (DSH) plugin and you need the ENTRY / FLOW / BOOST quality layers, check routing, or evidence rules. Routes conformance checks to dsh-standards and the legacy build workflow to dsh-primer.
---

# DSH Plugin Guide

This skill is a **guide**, not a judge. It explains the three DSH layers and
routes work to the tool that owns the verdict.

## Read first

Read `docs/levels.md` before answering a “which level / is this good?” question.
Before a plugin is published, walk `docs/release-checklist.md`.
It defines the three layers and the difference between a check and advice.

## The three layers

1. **ENTRY — can it be recognized, installed, and started?**
   - Checkable compatibility gate.
   - Use `dsh-standards`; do not infer a pass from the manifest alone.
   - `recognized` is not the same as `runtime`; `static` is not a pass.

2. **FLOW — can a user install, configure, use, upgrade, and remove it without
   fighting it?**
   - J1–J8 user journeys.
   - Runtime evidence is required for a runtime claim; `not-run` is not a pass.
   - The flow harness is still a draft; report its limits honestly.

3. **BOOST — does it use Cordis well?**
   - LEV-1–8 practices: effects, inject/get, volatile config, event modes,
     seams, stable prompt prefixes, bounded parallel/jobs, composition.
   - This is a **practice library**, not a grade. It has evidence cards, not a
     plugin-level pass/fail.
   - Never turn BOOST into a certification or a score.

## Route the work

- **Run a check:** `npx dsh-standards <plugin-dir> --scope entry --entry-claim static`
  for recognition; add a host/runtime when claiming runtime.
- **Three-layer self-check:** `npx -p dsh-standards dsh-levels <plugin-dir> --format json`.
- **Build or scaffold a plugin:** use the `dsh-primer` skill/CLI. The old
  `dsh-plugin-dev` command belongs to `dsh-primer`, not to this guide.
- **Read the rules:** `dsh-plugin-spec`; **read the guide:** this package;
  **run the checks:** `dsh-standards`.

## Evidence rules

- `static` ≠ `runtime`; `recognized` ≠ `pass`; `not-run` ≠ `pass`.
- A PASS needs a command, artifact, environment, and date.
- BOOST evidence is per practice, not per plugin.
- If evidence is missing, write `not-run`, `not-measured`, or `incomplete`.
- Do not say “official”, “certified”, “secure”, “recommended”, or “ranked”.

## Boundary

This project is non-official and has no certification, accreditation, security
audit, or market gate. It does not score or rank plugins. When in doubt, link to
the source document and state what was not run.

For plugin security — capabilities, credentials, egress, install scripts, and
supply chain — read `docs/security.md`. The security scope is static and shipped
in `dsh-standards` 1.6.0+; `DSC-15`/`DSC-16`/`DSC-17` can block only under
`--scope security`, `DSC-21` is WARN-only, and runtime security needs a sandbox,
not a checker.
