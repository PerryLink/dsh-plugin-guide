// Tests for the seam index and its lookup.
//
// The load-bearing property is the THIRD STATE. A lookup the knowledge base
// cannot answer must report `unknown` and exit non-zero, never "absent" — the
// same discipline `guide/family-toolchain.md` §2.1 states for check verdicts,
// where an unevaluated check must never be rendered as a pass. The second
// property is that a change which only breaks at runtime is recorded as
// undetectable, so nothing built on this data can quietly call it a pass.

import { describe, expect, it } from 'vitest'

import { loadSeamIndex, lookupSeam, seamsAfter } from '../src/cli/lib/seams'

const index = loadSeamIndex()

describe('seam index integrity', () => {
  it('parses and declares its provenance', () => {
    expect(index.schema).toBe('dsh-plugin-guide/seam-index/v1')
    expect(index.measuredAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(index.hostBaseline).toMatch(/^dsh-v/)
    expect(index.notes.length).toBeGreaterThan(0)
  })

  it('has unique ids across seams and capabilities', () => {
    const ids = [...index.seams.map((s) => s.id), ...index.capabilities.map((c) => c.id)]
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('documents every seam with a target, a replacement, and evidence', () => {
    for (const s of index.seams) {
      expect(s.target, `${s.id} target`).toBeTruthy()
      expect(s.replacement, `${s.id} replacement`).toBeTruthy()
      expect(s.doc, `${s.id} doc`).toBeTruthy()
      expect(['documented', 'inferred', 'unknown']).toContain(s.confidence)
      // An inferred record must say what it was inferred from.
      if (s.confidence === 'inferred') expect(s.inferredFrom, `${s.id} inferredFrom`).toBeTruthy()
    }
  })

  it('gives every undetectable seam a stated reason', () => {
    for (const s of index.seams.filter((x) => !x.detectable)) {
      expect(s.undetectableReason, `${s.id} must explain why it cannot be detected`).toBeTruthy()
      expect(s.undetectableReason!.length).toBeGreaterThan(40)
    }
  })

  it('gives every detectable seam a corpus to inspect', () => {
    for (const s of index.seams.filter((x) => x.detectable)) {
      expect(s.targets.length, `${s.id} needs at least one target`).toBeGreaterThan(0)
    }
  })

  it('carries the 0.2.1-alpha.2 corridor as L1-L19', () => {
    const l = index.seams.filter((s) => /^L\d+$/.test(s.id)).map((s) => s.id)
    expect(l).toHaveLength(19)
    for (let i = 1; i <= 19; i++) expect(l).toContain(`L${i}`)
  })

  it('carries the documented capability areas', () => {
    expect(index.capabilities.filter((c) => /^A\d+$/.test(c.id)).length).toBe(22)
  })
})

describe('lookupSeam', () => {
  it('resolves an exact seam id', () => {
    const r = lookupSeam(index, 'L3')
    expect(r.state).toBe('found')
    expect(r.seams).toHaveLength(1)
    expect(r.seams[0].title).toMatch(/webRuntime/)
  })

  it('resolves an exact capability id', () => {
    const r = lookupSeam(index, 'A20')
    expect(r.state).toBe('found')
    expect(r.capabilities[0].area).toMatch(/skills/)
  })

  it('is case-insensitive', () => {
    expect(lookupSeam(index, 'l3').state).toBe('found')
  })

  it('finds seams by removed symbol and by target version', () => {
    expect(lookupSeam(index, 'webRuntime').seams.map((s) => s.id)).toContain('L3')
    expect(lookupSeam(index, '0.2.1-alpha.2').seams.length).toBeGreaterThan(5)
  })

  // The property that matters: no answer is reported as an answer.
  it('reports unknown rather than absent for an unmatched query', () => {
    const r = lookupSeam(index, 'zzz-no-such-thing')
    expect(r.state).toBe('unknown')
    expect(r.seams).toEqual([])
    expect(r.capabilities).toEqual([])
    expect(r.reason).toMatch(/absence of evidence/i)
    // It must not claim the API is absent.
    expect(r.reason).not.toMatch(/does not exist/i)
  })
})

describe('seamsAfter', () => {
  it('returns changes landing after the given version, newest host first', () => {
    const hits = seamsAfter(index, '0.2.0-rc.2')
    const ids = hits.map((s) => s.id)
    expect(ids).toContain('L3') // lands in 0.2.1-alpha.2
    expect(ids).toContain('S3') // removed in 0.2.1-alpha.1
  })

  it('returns nothing for a version at or beyond the baseline', () => {
    const hits = seamsAfter(index, '0.2.1-alpha.2')
    const landing = hits.filter((s) => s.target === '0.2.1-alpha.2')
    expect(landing).toEqual([])
  })

  it('is ordered by version, so an older target yields more results', () => {
    const old = seamsAfter(index, '0.1.5-rc.2').length
    const recent = seamsAfter(index, '0.2.0-rc.2').length
    expect(old).toBeGreaterThan(recent)
  })

  it('always reports how many changes static inspection cannot see', () => {
    const hits = seamsAfter(index, '0.1.5-rc.2')
    const undetectable = hits.filter((s) => !s.detectable)
    // The corridor includes at least one data-loss hazard that is not detectable.
    expect(undetectable.length).toBeGreaterThan(0)
    expect(undetectable.map((s) => s.id)).toContain('L8')
  })
})
