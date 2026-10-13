// Content-parity gate for the five READMEs and the five quick references.
//
// `check-readme-sync.mjs` only compares `## ` headings, so four translation
// families drifted past it unnoticed: an audit on 2026-10-13 found the es/pt/hi
// READMEs missing whole entries of "What you get" (including the flagship
// version-adaptivity document), the quick references still claiming "215 pages"
// against an actual 429, and a "re-verified on 2026-10-06" date attached to a
// commit dated 2026-10-09.
//
// This gate compares STRUCTURE at the block level — the number of list items and
// table rows inside each H2 section — instead of only the H2 titles. It cannot
// judge translation quality; it catches the case that actually happens, a
// section that gained or lost items in one language only.
//
// Usage: node scripts/check-readme-parity.mjs [--json] [--max-drift N]

import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const json = process.argv.includes('--json')
const maxArg = process.argv.indexOf('--max-drift')
const maxDrift = maxArg >= 0 ? Number(process.argv[maxArg + 1] ?? 0) : 0

/** The English source and its translations, for each family. */
const FAMILIES = [
  {
    name: 'README',
    base: 'README.md',
    variants: ['README-zh.md', 'README-es.md', 'README-pt.md', 'README-hi.md'],
  },
  {
    name: 'quick-reference',
    base: 'guide/quick-reference.md',
    variants: [
      'guide/quick-reference.zh-CN.md',
      'guide/quick-reference.es.md',
      'guide/quick-reference.pt.md',
      'guide/quick-reference.hi.md',
    ],
  },
]

/**
 * Split a markdown document into H2 sections and count countable blocks.
 *
 * Sections are keyed by ORDINAL, not by title: the quick references legitimately
 * translate their headings, so matching on English titles produced 26 false
 * "missing section" reports per language. What must stay identical across a
 * translation family is the SEQUENCE and the SIZE of the sections, because the
 * failure mode this gate exists for is a section that gained or lost content in
 * one language only.
 *
 * @param text - raw markdown.
 * @returns ordered sections with their countable blocks.
 */
function sectionProfile(text) {
  const lines = text.split(/\r?\n/)
  const out = []
  let current = { index: 0, title: '(preamble)', bullets: 0, tableRows: 0, codeBlocks: 0 }
  out.push(current)
  let inFence = false

  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      if (inFence) current.codeBlocks++
      continue
    }
    if (inFence) continue
    const h2 = /^##\s+(.*)$/.exec(line)
    if (h2) {
      current = { index: out.length, title: h2[1].trim(), bullets: 0, tableRows: 0, codeBlocks: 0 }
      out.push(current)
      continue
    }
    if (/^\s*[-*]\s+\S/.test(line)) current.bullets++
    // A table row, excluding the separator row.
    if (/^\s*\|/.test(line) && !/^\s*[\s:|-]+\|\s*$/.test(line)) current.tableRows++
  }
  return out
}

/** Compare one variant against the English source, by section ordinal. */
function compare(basePath, variantPath) {
  const base = sectionProfile(readFileSync(join(root, basePath), 'utf8'))
  const variant = sectionProfile(readFileSync(join(root, variantPath), 'utf8'))
  const drift = []

  if (base.length !== variant.length) {
    drift.push({
      kind: 'section-count',
      detail: `${base.length} sections in base vs ${variant.length} in variant`,
      base: null,
      variant: null,
      section: null,
    })
  }

  const n = Math.min(base.length, variant.length)
  for (let i = 0; i < n; i++) {
    for (const key of ['bullets', 'tableRows', 'codeBlocks']) {
      if (base[i][key] !== variant[i][key]) {
        drift.push({
          section: `#${i} ${base[i].title}`,
          kind: key,
          base: base[i][key],
          variant: variant[i][key],
          detail: `base="${base[i].title}" variant="${variant[i].title}"`,
        })
      }
    }
  }
  return drift
}

let total = 0
const report = []
for (const family of FAMILIES) {
  if (!existsSync(join(root, family.base))) continue
  for (const v of family.variants) {
    if (!existsSync(join(root, v))) continue
    const drift = compare(family.base, v)
    total += drift.length
    report.push({ family: family.name, variant: v, drift })
  }
}

if (json) {
  console.log(JSON.stringify({ total, report }, null, 2))
} else {
  for (const r of report) {
    if (r.drift.length === 0) {
      console.log(`ok   ${r.family.padEnd(16)} ${r.variant}`)
      continue
    }
    console.log(`DRIFT ${r.family.padEnd(15)} ${r.variant}  (${r.drift.length} block(s))`)
    for (const d of r.drift.slice(0, 12)) {
      if (d.kind === 'section-count') console.log(`        ${d.detail}`)
      else if (d.section === null) console.log(`        ${d.kind}: ${d.detail ?? ''}`)
      else console.log(`        ${d.kind.padEnd(11)} ${d.base} vs ${d.variant}  in "${d.section}"`)
    }
    if (r.drift.length > 12) console.log(`        ... and ${r.drift.length - 12} more`)
  }
  console.log(`\nblock-level drift entries: ${total}`)
}

// The gate is opt-in strict: run with --max-drift N to allow a known budget.
process.exit(total > maxDrift ? 1 : 0)
