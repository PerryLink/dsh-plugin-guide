// dsh-plugin-guide bundle entry point.
//
// Registers the packaged plugin-development knowledge base as one on-demand
// agent skill named `dsh-plugin-guide`. The skill body is the repository's
// SKILL.md; its relative references (`./guide/...`, `./references/...`) resolve
// against the package directory through the directory resourceBase, so the
// agent loads workflow steps, official docs, and community deep-dives only
// when a task needs them (progressive disclosure).
//
// The package imports nothing from the harness: it only consumes the `skills`
// service at apply time, so no cordis copy is brought in and the peer
// dependency on `@deepseek-ai/dsh` is metadata-only (optional).
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'dsh-plugin-guide'
export const inject = ['skills']

const packageRoot = dirname(fileURLToPath(import.meta.url))

/**
 * Strip the YAML frontmatter block from SKILL.md and return the description
 * plus the instruction body. A malformed or missing block falls back to the
 * full text as the body.
 *
 * CRLF tolerance is deliberate and load-bearing, not cosmetic. Without
 * `.gitattributes`, git's `core.autocrlf=true` checks this repository out with
 * CRLF while the published tarball and every CI checkout use LF. An exact
 * `startsWith('---\n')` guard therefore took a different branch on a Windows
 * working tree and the skill silently registered its generic fallback
 * description instead of the trigger-phrase description from the frontmatter —
 * the text that decides when the host loads the skill at all. `.gitattributes`
 * now pins LF; this function no longer depends on that being true.
 *
 * @param text - raw SKILL.md content.
 * @returns parsed description (when the frontmatter carries one) and body.
 */
export function splitFrontmatter(text) {
  // Match the opening fence with either ending, then find the closing fence.
  const open = /^---\r?\n/.exec(text)
  if (!open) return { description: undefined, body: text }
  const rest = text.slice(open[0].length)
  const close = /\r?\n---[ \t]*(?:\r?\n|$)/.exec(rest)
  if (!close) return { description: undefined, body: text }
  const meta = rest.slice(0, close.index)
  // Trim the separating blank lines so the body starts at the first heading,
  // matching the host provider's own body trimming.
  const body = rest.slice(close.index + close[0].length).replace(/^(?:[ \t]*\r?\n)+/, '')
  const match = /^description:[ \t]*(.+?)[ \t]*$/m.exec(meta)
  return { description: match?.[1]?.trim(), body }
}

/**
 * Register the knowledge-base skill. Registration is an effect: the disposer
 * returned by `ctx.skills.register()` removes the contribution on unload.
 * @param ctx - Cordis context with the injected `skills` service.
 */
export function apply(ctx) {
  const skillPath = join(packageRoot, 'SKILL.md')
  const { description, body } = splitFrontmatter(readFileSync(skillPath, 'utf8'))
  ctx.effect(() =>
    ctx.skills.register({
      name: 'dsh-plugin-guide',
      source: 'bundled',
      description:
        description
        ?? 'DeepSeek Harness (DSH) plugin development knowledge base: official constraints, task-based workflows, exact service/event references, and community pitfalls.',
      content: body,
      resourceBase: { kind: 'directory', path: packageRoot },
    }),
  )
}
