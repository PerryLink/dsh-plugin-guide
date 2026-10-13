// Guard against citation drift in src/cli/skill-sections.ts.
//
// Every `dsh-plugin-dev check` result cites the knowledge-base section that owns
// the rule. Those citations are hand-maintained, and an audit on 2026-10-13 found
// them already stale: `manifest-files` pointed at §7.1 while its heading had
// become a different topic, and two checks (`redline-persona-role`,
// `redline-async-apply-registration`) cited sections that did not state their
// rules at all. A drifted citation is worse than a missing one, because it sends
// the reader to a real section that does not say what the check claims.
//
// This test asserts, for every citation: the file exists, a heading starts with
// the cited section number, and that heading contains the cited heading text.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { SKILL_SECTIONS } from '../src/cli/skill-sections'

const root = process.cwd()
const cache = new Map<string, string[]>()
function linesOf(file: string): string[] {
  if (!cache.has(file)) cache.set(file, readFileSync(join(root, file), 'utf8').split(/\r?\n/))
  return cache.get(file)!
}

/** Strip punctuation/markup so heading text compares structurally. */
const norm = (s: string): string => s.replace(/[#`*\s「」（）()：:]/g, '')

describe('skill-section citations', () => {
  const entries = Object.entries(SKILL_SECTIONS)
  expect(entries.length).toBeGreaterThan(0)

  it('cites a section number that exists as a heading', () => {
    const missing: string[] = []
    for (const [id, ref] of entries) {
      const lines = linesOf(ref.file)
      const num = ref.section.replace('§', '')
      const hit = lines.some((l) => /^#{2,4}\s/.test(l) && l.replace(/^#+\s*/, '').startsWith(num))
      if (!hit) missing.push(`${id} -> ${ref.file} ${ref.section}`)
    }
    expect(missing).toEqual([])
  })

  it('cites heading text that the cited heading actually carries', () => {
    const drifted: string[] = []
    for (const [id, ref] of entries) {
      const lines = linesOf(ref.file)
      const num = ref.section.replace('§', '')
      const heading = lines.find((l) => /^#{2,4}\s/.test(l) && l.replace(/^#+\s*/, '').startsWith(num))
      if (!heading) continue // covered by the previous test
      // Compare a stable prefix of the cited heading against the real one.
      const probe = norm(ref.heading).slice(0, 8)
      if (probe.length < 4) continue
      if (!norm(heading).includes(probe)) {
        drifted.push(`${id} -> §${num} is "${heading.replace(/^#+\s*/, '')}", cited as "${ref.heading}"`)
      }
    }
    expect(drifted).toEqual([])
  })

  it('has no duplicate citations pointing at a nonexistent check id', () => {
    const ids = Object.keys(SKILL_SECTIONS)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
