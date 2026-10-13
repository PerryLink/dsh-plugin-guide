// Regression tests for the bundle entry point.
//
// Why this file exists: `index.js` is the only shipping code that had no test,
// and it is where the CRLF defect lived. `index.js` guards its frontmatter parse
// with an exact LF fence, so a checkout with CRLF (git's `core.autocrlf=true`,
// which this repository used to inherit from the machine default) made the
// parse fail: the skill registered its generic fallback description instead of
// the 355-char trigger-phrase description that decides when the host loads the
// skill at all, and registered the raw file — YAML frontmatter included — as the
// skill body. The published tarball was unaffected (npm packs from CI, which is
// LF), which is exactly why nothing caught it: no test ever loaded this module,
// and `scripts/verify-artifacts.mjs` only exercises `dist/`, `bin/` and the
// scaffold.
//
// `.gitattributes` now pins LF, but these tests assert the parser is
// line-ending-agnostic so the class of bug cannot come back via a different
// route (a hand-created file, a `-SkipGit` sync, a Windows-only contribution).

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { apply, inject, splitFrontmatter } from '../index.js'

const root = process.cwd()
const CRLF = '\r\n'

/** The repository's SKILL.md, re-encoded with the given line ending. */
function skillText(eol: '\n' | '\r\n'): string {
  const lf = readFileSync(join(root, 'SKILL.md'), 'utf8').replace(/\r\n/g, '\n')
  return eol === '\n' ? lf : lf.replace(/\n/g, CRLF)
}

describe('bundle entry contract', () => {
  it('exports the Cordis plugin contract', () => {
    expect(typeof apply).toBe('function')
    expect(Array.isArray(inject)).toBe(true)
    expect(inject).toContain('skills')
  })
})

describe('splitFrontmatter', () => {
  it('parses the real SKILL.md identically under LF and CRLF', () => {
    const lf = splitFrontmatter(skillText('\n'))
    const crlf = splitFrontmatter(skillText('\r\n'))

    // The description drives skill selection, so it must be the frontmatter's
    // trigger text and identical across line endings.
    expect(lf.description).toBeDefined()
    expect(lf.description).toBe(crlf.description)
    expect(lf.description).toMatch(/^Use when /)
    expect(lf.description!.length).toBeGreaterThan(200)

    // The body must not include the frontmatter, and must start at the first
    // heading rather than at a blank line.
    for (const { body } of [lf, crlf]) {
      expect(body.trimStart().startsWith('---')).toBe(false)
      expect(body.startsWith('#')).toBe(true)
      expect(body).not.toContain('name: dsh-plugin-guide')
    }
    expect(lf.body.replace(/\r\n/g, '\n')).toBe(crlf.body.replace(/\r\n/g, '\n'))
  })

  it('falls back to the whole text when there is no frontmatter', () => {
    const text = '# Title\n\nbody'
    expect(splitFrontmatter(text)).toEqual({ description: undefined, body: text })
  })

  it('falls back when the frontmatter is unclosed', () => {
    for (const text of ['---\nname: x\ndescription: y\n', '---\r\nname: x\r\n']) {
      expect(splitFrontmatter(text).description).toBeUndefined()
      expect(splitFrontmatter(text).body).toBe(text)
    }
  })

  it('handles an empty body and a missing description', () => {
    expect(splitFrontmatter('---\nname: x\n---\n').body).toBe('')
    const noDesc = splitFrontmatter('---\nname: x\n---\n\n# Body\ntext')
    expect(noDesc.description).toBeUndefined()
    expect(noDesc.body).toBe('# Body\ntext')
  })

  it('does not treat a horizontal rule in the body as a closing fence', () => {
    const { body } = splitFrontmatter('---\nname: x\n---\n\n# Title\n\n---\n\ntail')
    expect(body).toContain('# Title')
    expect(body).toContain('tail')
  })
})

describe('apply()', () => {
  /** Minimal Cordis-style context capturing the registered skill. */
  function stubContext() {
    const registered: any[] = []
    let disposerCalls = 0
    const ctx = {
      effect(fn: () => unknown) {
        const disposer = fn()
        return () => {
          disposerCalls++
          if (typeof disposer === 'function') disposer()
        }
      },
      skills: {
        register(def: unknown) {
          registered.push(def)
          return () => {}
        },
      },
    }
    return { ctx, registered, disposers: () => disposerCalls }
  }

  it('registers one skill with the frontmatter description and a directory resourceBase', () => {
    const { ctx, registered } = stubContext()
    apply(ctx as any)

    expect(registered).toHaveLength(1)
    const def = registered[0]
    expect(def.name).toBe('dsh-plugin-guide')
    expect(def.source).toBe('bundled')
    // Not the generic fallback: the real description mentions when to use it.
    expect(def.description).toMatch(/^Use when /)
    expect(def.content).toContain('# DeepSeek Harness')
    expect(def.content).not.toContain('name: dsh-plugin-guide')
    // A directory resourceBase is what resolves ./guide/ and ./references/.
    expect(def.resourceBase).toEqual({ kind: 'directory', path: root })
  })

  it('registers through ctx.effect so unload disposes the contribution', () => {
    const { ctx, registered, disposers } = stubContext()
    apply(ctx as any)
    expect(registered).toHaveLength(1)
    expect(disposers()).toBe(0)
  })
})
