// Measure how much of the offline mirror is actually referenced.
//
// `references/mirror-scope-decision.md` records a rejected proposal: drop the
// mirror content that no authored document references, to save ~80% of the
// published package. This script is the evidence. Run it before reviving that
// proposal — the answer depends on whether directory globs count as references,
// and this repository declares several broad ones.
//
// Usage: node scripts/measure-mirror-references.mjs [--json]

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const mirrorRoot = join(root, 'references', 'official-docs')
const json = process.argv.includes('--json')

/** Documents that count as "the knowledge base" when looking for references. */
function authoredFiles() {
  const out = []
  const add = (p) => {
    try { if (statSync(p).isFile()) out.push(p) } catch { /* optional */ }
  }
  add(join(root, 'SKILL.md'))
  add(join(root, 'llms.txt'))
  for (const dir of ['guide', 'references']) {
    try {
      for (const f of readdirSync(join(root, dir))) add(join(root, dir, f))
    } catch { /* optional */ }
  }
  for (const f of readdirSync(root)) if (/^README.*\.md$/.test(f)) add(join(root, f))
  return out.filter((p) => !p.includes('official-docs') && !p.includes('mirror-scope'))
}

const authored = authoredFiles()
const corpus = authored.map((p) => readFileSync(p, 'utf8'))

// Everything the corpus names: full paths, bare basenames, and directory globs.
const paths = new Set()
const names = new Set()
const globDirs = new Set()
for (const text of corpus) {
  for (const m of text.matchAll(/references\/official-docs\/([A-Za-z0-9._/-]+)/g)) paths.add(m[1])
  for (const m of text.matchAll(/\bdocs\/[A-Za-z0-9._/-]+/g)) paths.add(m[0])
  for (const m of text.matchAll(/([A-Za-z0-9._-]+)\.(md|json|ya?ml|png)\b/g)) names.add(`${m[1]}.${m[2]}`)
  for (const m of text.matchAll(/([A-Za-z0-9._/-]+)\/\*\*/g)) globDirs.add(m[1])
}

function walk(dir, base = '') {
  const out = []
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${e.name}` : e.name
    if (e.isDirectory()) out.push(...walk(join(dir, e.name), rel))
    else out.push(rel)
  }
  return out
}

/**
 * How the corpus reaches this mirror path.
 *
 * A glob only covers a path when the glob directory is a PREFIX of it:
 * `docs/persistence-changes/**` covers `docs/persistence-changes/x.json`, but a
 * bare `docs/**` does not imply everything under `docs/`. Matching a segment name
 * anywhere inflates the referenced count and produced a wrong "80% unreferenced"
 * figure in the original audit.
 */
function referencedBy(rel) {
  if (paths.has(rel) || paths.has(`docs/${rel}`)) return 'exact'
  const parts = rel.split('/')
  for (let i = 1; i <= parts.length; i++) {
    if (globDirs.has(parts.slice(0, i).join('/'))) return 'dir-glob'
  }
  if (names.has(parts[parts.length - 1])) return 'basename'
  return null
}

const SKIP = new Set(['README.md', 'SNAPSHOT.md', 'LICENSE', 'CLAUDE.md'])
const buckets = { exact: [], 'dir-glob': [], basename: [], unreferenced: [] }
for (const rel of walk(mirrorRoot).sort()) {
  if (SKIP.has(rel)) continue
  const size = statSync(join(mirrorRoot, rel)).size
  buckets[referencedBy(rel) ?? 'unreferenced'].push({ rel, size })
}

const MB = (n) => (n / 1048576).toFixed(2) + ' MB'
const sum = (a) => a.reduce((s, x) => s + x.size, 0)

if (json) {
  console.log(JSON.stringify({
    authoredDocuments: authored.length,
    buckets: Object.fromEntries(Object.entries(buckets).map(([k, v]) => [k, { files: v.length, bytes: sum(v) }])),
  }, null, 2))
} else {
  console.log(`authored documents scanned: ${authored.length}`)
  console.log('\nmirror files by reference strength:')
  for (const k of ['exact', 'dir-glob', 'basename', 'unreferenced']) {
    console.log(`  ${k.padEnd(14)} ${String(buckets[k].length).padStart(4)} files  ${MB(sum(buckets[k])).padStart(10)}`)
  }
  const unreferenced = buckets.unreferenced
  console.log(`\ngenuinely unreferenced: ${unreferenced.length} files, ${MB(sum(unreferenced))}`)
  for (const x of unreferenced) console.log(`  ${MB(x.size).padStart(10)}  ${x.rel}`)

  const byExt = new Map()
  for (const x of buckets['dir-glob']) {
    const ext = x.rel.slice(x.rel.lastIndexOf('.'))
    const g = byExt.get(ext) ?? { n: 0, b: 0 }
    g.n++
    g.b += x.size
    byExt.set(ext, g)
  }
  console.log('\nreachable only through a declared directory glob, by extension:')
  for (const [ext, g] of [...byExt].sort((a, b) => b[1].b - a[1].b)) {
    console.log(`  ${ext.padEnd(12)} ${String(g.n).padStart(4)} files  ${MB(g.b).padStart(10)}`)
  }
  console.log('\nSee references/mirror-scope-decision.md before acting on these numbers.')
}
