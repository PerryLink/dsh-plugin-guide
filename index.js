// dsh-plugin-guide bundle entry point.
//
// Registers the packaged guide as one on-demand agent skill. The skill body is
// SKILL.md; its relative references (./docs/...) resolve against the package
// directory through the directory resourceBase. The guide does not import the
// harness: it only consumes the `skills` service at apply time, so the peer
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
 * @param text - raw SKILL.md content.
 * @returns parsed description (when the frontmatter carries one) and body.
 */
export function splitFrontmatter(text) {
  const open = /^---\r?\n/.exec(text)
  if (!open) return { description: undefined, body: text }
  const rest = text.slice(open[0].length)
  const close = /\r?\n---[ \t]*(?:\r?\n|$)/.exec(rest)
  if (!close) return { description: undefined, body: text }
  const meta = rest.slice(0, close.index)
  const body = rest.slice(close.index + close[0].length).replace(/^(?:[ \t]*\r?\n)+/, '')
  const match = /^description:[ \t]*(.+?)[ \t]*$/m.exec(meta)
  return { description: match?.[1]?.trim(), body }
}

/**
 * Register the guide skill. Registration is an effect: the disposer returned
 * by `ctx.skills.register()` removes the contribution on unload.
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
        ?? 'DSH plugin quality guide: ENTRY, FLOW, and BOOST layers, with check routing and evidence rules.',
      content: body,
      resourceBase: { kind: 'directory', path: packageRoot },
    }),
  )
}
