// `dsh-plugin-dev seams` — answer "does this API exist in my target host?"
//
// Two modes:
//   seams <query>            look up a seam or capability by id, area, or word
//   seams --since <version>  every change landing AFTER a version you target
//
// Both are backed by `data/seams/index.json`, which carries a mandatory third
// state: a record the knowledge base does not establish reports `unknown`, and a
// change that only breaks at runtime reports `detectable: false` with its reason.
// A consumer must never read either as a pass.
import { lookupSeam, seamsAfter, type SeamIndex } from '../lib/seams'

/** Render one seam record as human-readable text. */
function renderSeam(s: SeamIndex['seams'][number], out: string[]): void {
  out.push(`${s.id}  ${s.title}`)
  out.push(`    kind        ${s.kind}`)
  out.push(`    lands in    ${s.target}`)
  out.push(`    confidence  ${s.confidence}${s.inferredFrom ? ` (${s.inferredFrom})` : ''}`)
  out.push(`    official    ${s.doc}`)
  if (s.removed.length) out.push(`    removed     ${s.removed.join('; ')}`)
  out.push(`    instead     ${s.replacement}`)
  out.push(s.detectable
    ? `    detectable  yes — inspect: ${s.targets.join(', ')}`
    : `    detectable  NO — ${s.undetectableReason ?? 'no reason recorded'}`)
  out.push('')
}

/** Render one capability record. */
function renderCapability(c: SeamIndex['capabilities'][number], out: string[]): void {
  out.push(`${c.id}  ${c.area}`)
  out.push(`    introduced  ${c.introducedIn}`)
  out.push(`    anchor      ${c.anchor}`)
  out.push(`    confidence  ${c.confidence}${c.inferredFrom ? ` (${c.inferredFrom})` : ''}`)
  out.push('')
}

/** Options for the seams command. */
export interface SeamsOptions {
  /** Free-text query, or undefined for the --since listing. */
  query?: string
  /** List changes landing after this version. */
  since?: string
  /** Emit JSON. */
  json: boolean
}

/**
 * Run the seams command.
 *
 * @param index - parsed seam index.
 * @param options - query, since, json.
 * @returns exit code: 0 when answered, 2 for a usage problem, 3 for unknown.
 */
export function runSeams(index: SeamIndex, options: SeamsOptions): number {
  if (options.since !== undefined) {
    const hits = seamsAfter(index, options.since)
    if (options.json) {
      process.stdout.write(`${JSON.stringify({ since: options.since, count: hits.length, seams: hits }, null, 2)}\n`)
      return 0
    }
    if (hits.length === 0) {
      process.stdout.write(
        `No recorded change lands after ${options.since}.\n`
        + `That is bounded by this index's coverage (${index.seams.length} records, measured ${index.measuredAt}, `
        + `baseline ${index.hostBaseline}) — not a guarantee about releases newer than the baseline.\n`,
      )
      return 0
    }
    const out: string[] = [`${hits.length} change(s) land after ${options.since}:`, '']
    for (const s of hits) renderSeam(s, out)
    const undetectable = hits.filter((s) => !s.detectable).length
    out.push(`Note: ${undetectable} of ${hits.length} cannot be detected by static inspection; `
      + 'they are advisory and must not be reported as passing.')
    process.stdout.write(`${out.join('\n')}\n`)
    return 0
  }

  const query = options.query
  if (!query) {
    process.stderr.write('seams: give a query (a seam id, a capability area, or a word) or --since <version>\n')
    return 2
  }

  const result = lookupSeam(index, query)
  if (options.json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
    return result.state === 'unknown' ? 3 : 0
  }

  if (result.state === 'unknown') {
    process.stdout.write(`${result.reason}\n`)
    return 3
  }

  const out: string[] = []
  if (result.seams.length) {
    out.push(`${result.seams.length} seam(s):`, '')
    for (const s of result.seams) renderSeam(s, out)
  }
  if (result.capabilities.length) {
    out.push(`${result.capabilities.length} capability record(s):`, '')
    for (const c of result.capabilities) renderCapability(c, out)
  }
  process.stdout.write(`${out.join('\n')}\n`)
  return 0
}
