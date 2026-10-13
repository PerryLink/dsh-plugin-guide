// Assert that the numbers this project states about itself match reality.
//
// Why this exists: the audits found the same class of defect repeatedly, always
// a number stated in prose that no longer matched the thing it described.
//   * the family roster was written four different ways in four files;
//   * the pitfall list was "30+" in English and "20+" in three translations;
//   * the mirror was described as "215 pages" long after it reached 429;
//   * `unfixed-issues.md` carried four separate arithmetic slips ("4 items ...
//     5 items").
// None of those are content errors — they are drift between a claim and its
// source. `data/facts.json` is the single home for the numbers; this script
// checks the claims a machine can verify.
//
// Usage: node scripts/check-facts.mjs [--json]

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const root = process.cwd()
const asJson = process.argv.includes('--json')
const facts = JSON.parse(readFileSync(join(root, 'data', 'facts.json'), 'utf8'))

const failures = []
const checked = []
const ok = (name, detail) => checked.push(`${name}: ${detail}`)
const bad = (name, detail) => failures.push(`${name}: ${detail}`)

const read = (p) => readFileSync(join(root, p), 'utf8')

/** Count `## ` sections in a document. */
const sections = (text) => text.split(/\r?\n/).filter((l) => /^##\s/.test(l)).length

/** Count top-level bullets inside the section starting at `heading`. */
function bulletsIn(text, heading) {
  const lines = text.split(/\r?\n/)
  const start = lines.findIndex((l) => l.trim() === `## ${heading}`)
  if (start < 0) return -1
  let end = lines.length
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s/.test(lines[i])) { end = i; break }
  }
  return lines.slice(start + 1, end).filter((l) => /^- \S/.test(l)).length
}

// ---- 1. README structure claims -------------------------------------------------
{
  const text = read('README.md')
  const got = sections(text)
  if (got !== facts.readme.sections) bad('README sections', `${got} in README.md vs ${facts.readme.sections} in facts.json`)
  else ok('README sections', String(got))

  const wyg = bulletsIn(text, 'What you get')
  if (wyg !== facts.readme.whatYouGetEntries) bad('What you get entries', `${wyg} vs ${facts.readme.whatYouGetEntries}`)
  else ok('What you get entries', String(wyg))

  // Every translation must match too; the parity gate covers structure, but this
  // catches the case where a translation lost entries AND facts.json was not updated.
  for (const f of ['README-zh.md', 'README-es.md', 'README-pt.md', 'README-hi.md']) {
    let t
    try { t = read(f) } catch { continue }
    const n = bulletsIn(t, 'What you get')
    if (n !== facts.readme.whatYouGetEntries) bad(`${f} "What you get"`, `${n} vs ${facts.readme.whatYouGetEntries}`)
  }
}

// ---- 2. Knowledge-base inventory -------------------------------------------------
{
  const guide = readdirSync(join(root, 'guide')).filter((f) => f.endsWith('.md')).length
  if (guide !== facts.knowledgeBase.guideDocuments) bad('guide/ documents', `${guide} vs ${facts.knowledgeBase.guideDocuments}`)
  else ok('guide/ documents', String(guide))

  const refs = readdirSync(join(root, 'references'))
    .filter((f) => f.endsWith('.md') && statSync(join(root, 'references', f)).isFile()).length
  if (refs !== facts.knowledgeBase.referenceDocuments) bad('references/ documents', `${refs} vs ${facts.knowledgeBase.referenceDocuments}`)
  else ok('references/ documents', String(refs))
}

// ---- 3. Mirror claims ------------------------------------------------------------
{
  const snap = read('references/official-docs/SNAPSHOT.md')
  const commit = /^\|\s*Source commit\s*\|\s*`([0-9a-f]{40})`\s*\|/m.exec(snap)?.[1]
  if (commit !== facts.mirror.pinnedCommit) bad('mirror pinned commit', `${commit} in SNAPSHOT.md vs ${facts.mirror.pinnedCommit} in facts.json`)
  else ok('mirror pinned commit', commit.slice(0, 7))

  // Count the mirrored markdown pages and the zh pairs independently.
  let md = 0
  let zh = 0
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name)
      if (e.isDirectory()) walk(p)
      else if (e.name.endsWith('.md')) {
        md++
        if (e.name.endsWith('.zh.md')) zh++
      }
    }
  }
  walk(join(root, 'references', 'official-docs', 'docs'))
  if (md !== facts.mirror.mdPages) bad('mirror md pages', `${md} counted vs ${facts.mirror.mdPages} in facts.json`)
  else ok('mirror md pages', String(md))
  if (zh !== facts.mirror.zhPairs) bad('mirror zh pairs', `${zh} counted vs ${facts.mirror.zhPairs} in facts.json`)
  else ok('mirror zh pairs', String(zh))

  // Any document quoting a page count must quote the current one.
  for (const f of ['guide/quick-reference.md', 'guide/quick-reference.zh-CN.md', 'references/sources.md']) {
    let t
    try { t = read(f) } catch { continue }
    const stale = /\b(215|369|182)\s*(?:md|pages|篇)/i.exec(t)
    if (stale) bad(`${f} stale page count`, `states "${stale[0]}" but the mirror has ${facts.mirror.mdPages} pages`)
  }
}

// ---- 4. CLI check counts ---------------------------------------------------------
{
  const src = read('src/cli/skill-sections.ts')
  const n = [...src.matchAll(/^\s*'[a-z0-9-]+':\s*\{/gm)].length
  if (n !== facts.cli.staticChecks) bad('CLI static checks', `${n} citations vs ${facts.cli.staticChecks} in facts.json`)
  else ok('CLI static checks', String(n))
}

// ---- 5. Seam index consistency ---------------------------------------------------
{
  const idx = JSON.parse(read('data/seams/index.json'))
  const corridor = idx.seams.filter((s) => /^L\d+$/.test(s.id)).length
  if (corridor !== facts.seams.corridorL) bad('corridor L seams', `${corridor} vs ${facts.seams.corridorL}`)
  else ok('corridor L seams', String(corridor))

  const areas = idx.capabilities.filter((c) => /^A\d+$/.test(c.id)).length
  if (areas !== facts.seams.capabilityAreas) bad('capability areas', `${areas} vs ${facts.seams.capabilityAreas}`)
  else ok('capability areas', String(areas))

  const corridorSeams = idx.seams.filter((s) => /^L\d+$/.test(s.id))
  const detectable = corridorSeams.filter((s) => s.detectable).length
  const advisory = corridorSeams.length - detectable
  if (detectable !== facts.seams.staticallyDetectable) bad('statically detectable seams', `${detectable} vs ${facts.seams.staticallyDetectable}`)
  else ok('statically detectable seams', String(detectable))
  if (advisory !== facts.seams.advisoryOnly) bad('advisory-only seams', `${advisory} vs ${facts.seams.advisoryOnly}`)
  else ok('advisory-only seams', String(advisory))
}

// ---- 6. Release consistency ------------------------------------------------------
{
  const pkg = JSON.parse(read('package.json'))
  const changelog = read('CHANGELOG.md')
  if (!changelog.includes(`## [${pkg.version}]`)) {
    bad('CHANGELOG section', `no "## [${pkg.version}]" section for the current package.json version`)
  } else ok('CHANGELOG section', pkg.version)
}

if (asJson) {
  console.log(JSON.stringify({ facts: facts.schema, checked, failures }, null, 2))
} else {
  for (const c of checked) console.log(`  ok    ${c}`)
  if (failures.length) {
    console.error('\ncheck-facts: FAIL')
    for (const f of failures) console.error(`  - ${f}`)
    console.error('\nEvery number above has one home: data/facts.json. Update it, then update the prose.')
  } else {
    console.log(`\ncheck-facts OK (${checked.length} assertions against data/facts.json)`)
  }
}
process.exit(failures.length ? 1 : 0)
