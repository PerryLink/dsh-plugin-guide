// Seam and capability lookup over `data/seams/index.json`.
//
// Why a lookup rather than more prose: `guide/version-matrix.md` gives
// capability introductions at package/path granularity and says so. The question
// an author actually asks is narrower — "is this API present in the version I am
// targeting?" — and that is a lookup, not a document.
//
// The third state is mandatory. A record whose evidence the knowledge base does
// not establish reports `unknown`, never "no", mirroring the verdict discipline
// in `guide/family-toolchain.md` §2.1 where an unevaluated check must never be
// rendered as a pass. The same applies per-target: a change that only breaks at
// runtime for a given configuration is recorded `detectable: false`, so a scanner
// built on this data cannot silently upgrade it to a pass.
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/** One breaking-change or mechanism record. */
export interface SeamRecord {
  id: string
  title: string
  kind: string
  /** The release in which the change LANDS. */
  target: string
  doc: string
  removed: string[]
  replacement: string
  /** Corpus a scanner must inspect; empty when nothing can be inspected. */
  targets: string[]
  detectable: boolean
  undetectableReason?: string
  confidence: 'documented' | 'inferred' | 'unknown'
  inferredFrom?: string
  ids?: string[]
}

/** One capability-introduction record. */
export interface CapabilityRecord {
  id: string
  area: string
  introducedIn: string
  anchor: string
  confidence: 'documented' | 'inferred' | 'unknown'
  inferredFrom?: string
}

/** The parsed index. */
export interface SeamIndex {
  schema: string
  measuredAt: string
  hostBaseline: string
  notes: string[]
  seams: SeamRecord[]
  capabilities: CapabilityRecord[]
}

/** Resolve the index path, tolerating the source tree and the bundled dist. */
export function resolveSeamIndexPath(): string {
  const here = dirname(fileURLToPath(import.meta.url))
  const candidates = [
    join(here, '..', '..', '..', 'data', 'seams', 'index.json'), // source: src/cli/lib -> <pkg>/data
    join(here, '..', '..', 'data', 'seams', 'index.json'), // source: src/cli -> <pkg>/data
    join(here, '..', 'data', 'seams', 'index.json'), // bundled: dist -> <pkg>/data
    join(here, 'data', 'seams', 'index.json'),
  ]
  for (const c of candidates) {
    try {
      readFileSync(c)
      return c
    } catch {
      /* try the next candidate */
    }
  }
  throw new Error('seam index not found; expected data/seams/index.json next to the package root')
}

/** Load and parse the seam index. */
export function loadSeamIndex(path = resolveSeamIndexPath()): SeamIndex {
  return JSON.parse(readFileSync(path, 'utf8')) as SeamIndex
}

/** How a lookup resolved. `unknown` is never a negative answer. */
export type LookupState = 'found' | 'unknown'

/** The outcome of asking about one name. */
export interface SeamLookup {
  query: string
  state: LookupState
  seams: SeamRecord[]
  capabilities: CapabilityRecord[]
  /** Populated when state is `unknown`. */
  reason?: string
}

/**
 * Look up a seam or capability by id, area, or a free-text substring.
 *
 * @param index - parsed seam index.
 * @param query - id (`L3`, `A20`), area substring, or any word in a title.
 * @returns matches, or `state: 'unknown'` with a reason when nothing matches.
 */
export function lookupSeam(index: SeamIndex, query: string): SeamLookup {
  const q = query.trim().toLowerCase()
  const exactSeam = index.seams.filter((s) => s.id.toLowerCase() === q)
  const exactCap = index.capabilities.filter((c) => c.id.toLowerCase() === q)
  if (exactSeam.length || exactCap.length) {
    return { query, state: 'found', seams: exactSeam, capabilities: exactCap }
  }

  const seams = index.seams.filter(
    (s) =>
      s.title.toLowerCase().includes(q)
      || s.kind.toLowerCase().includes(q)
      || s.target.toLowerCase().includes(q)
      || s.removed.some((r) => r.toLowerCase().includes(q))
      || (s.ids ?? []).some((i) => i.toLowerCase().includes(q)),
  )
  const capabilities = index.capabilities.filter(
    (c) => c.area.toLowerCase().includes(q) || c.introducedIn.toLowerCase().includes(q),
  )

  if (!seams.length && !capabilities.length) {
    return {
      query,
      state: 'unknown',
      seams: [],
      capabilities: [],
      reason: `no seam or capability matches "${query}". This is an absence of evidence in the knowledge base, not evidence that the API is absent from your target host — check references/official-docs/ before concluding either way.`,
    }
  }
  return { query, state: 'found', seams, capabilities }
}

/** Total order over DSH version strings. */
function rank(v: string): number[] {
  // Accepts `0.2.1-alpha.2`, `dsh-v0.2.1-alpha.2`, `0.2.0-rc.2`, `0.1.0-rc.8`.
  // The separator before the prerelease counter may be `.` or nothing, which an
  // earlier version of this function got wrong: a pattern requiring `-alpha.2`
  // to carry a dot inside the counter returned NaN, every comparison against NaN
  // is false, and `seamsAfter` therefore reported the ENTIRE index as landing
  // after any target — the most dangerous possible failure for this command,
  // because it reads as "everything changed for you".
  const m = /^(?:dsh-v)?(\d+)\.(\d+)\.(\d+)(?:-([a-z]+)(?:\.(\d+))?)?$/i.exec(v.trim())
  if (!m) return [Number.NaN, 0, 0, 0, 0]
  const channel = m[4] === 'alpha' ? 1 : m[4] === 'rc' ? 2 : m[4] === undefined ? 3 : 0
  return [Number(m[1]), Number(m[2]), Number(m[3]), channel, Number(m[5] ?? 0)]
}

/** Compare two ranks; a NaN on either side compares as "unknown", never "after". */
function cmp(a: number[], b: number[]): number {
  if (Number.isNaN(a[0]) || Number.isNaN(b[0])) return Number.NaN
  for (let i = 0; i < 5; i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1
  }
  return 0
}

/**
 * Every recorded change that lands AFTER the given target version.
 *
 * A target this build cannot parse yields an empty list rather than everything:
 * reporting the whole index for an unparseable query would read as "all of this
 * changed for you", which is worse than reporting nothing.
 *
 * @param index - parsed seam index.
 * @param target - the version the plugin targets.
 * @returns matching seam records.
 */
export function seamsAfter(index: SeamIndex, target: string): SeamRecord[] {
  const want = rank(target)
  if (Number.isNaN(want[0])) return []
  return index.seams.filter((s) => {
    const bare = s.target.replace(/^(?:removed|retired) in /, '')
    const got = cmp(rank(bare), want)
    return !Number.isNaN(got) && got > 0
  })
}
