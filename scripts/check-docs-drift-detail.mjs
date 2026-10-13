// Answer "WHAT changed upstream?", not just "is the mirror stale?".
//
// `check-docs-drift.ps1` compares the upstream branch-tip SHA against the SHA
// recorded in `references/official-docs/SNAPSHOT.md`. When they differ it says so
// and stops — a maintainer still has to work out which of ~700 mirrored files
// moved. A drift report that names no file is why the weekly job can sit red for
// eleven weeks without anyone acting on it.
//
// This script names the files: it compares the pinned commit's tree against the
// upstream head's tree and lists added, removed, and modified paths inside the
// mirror's declared scope.
//
// Usage:
//   node scripts/check-docs-drift-detail.mjs [--commit <sha>] [--json]
//   node scripts/check-docs-drift-detail.mjs --checkout D:\deepseek-harness
//
// Exit codes: 0 = fresh or report produced, 2 = could not probe, 1 = drift (with --fail-on-drift).

import { execFileSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const argv = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = argv.indexOf(name)
  return i >= 0 ? (argv[i + 1] ?? true) : fallback
}
const asJson = argv.includes('--json')
const failOnDrift = argv.includes('--fail-on-drift')
const checkout = flag('--checkout', null)

const SNAPSHOT = join(root, 'references', 'official-docs', 'SNAPSHOT.md')
const MIRROR = join(root, 'references', 'official-docs')

// The mirror's declared scope, matching sync-official-docs.ps1 `$paths` exactly.
// `packages/` contributes only AGENTS.md and README.md, and `vendor/` only
// README.md — a bare directory prefix would report every package file as
// "missing from the mirror", which is 2,000 paths of noise.
const SCOPE_EXACT = new Set([
  'AGENTS.md',
  'BENCHMARK.md',
  'CONTRIBUTING.md',
  'CONTRIBUTING.zh.md',
  'CONTRIBUTING.i18n.yaml',
  'README.zh.md',
  'README.i18n.yaml',
  'THIRD_PARTY_NOTICES.md',
  'LICENSE',
  'packages/AGENTS.md',
  'packages/README.md',
  'vendor/README.md',
  'website/docs.ts',
])
const inScope = (p) => p.startsWith('docs/') || SCOPE_EXACT.has(p)

/** The scope, for the report header. */
const SCOPE = ['docs/', ...SCOPE_EXACT]

/** Read the pinned SHA and scope out of SNAPSHOT.md. */
function readSnapshot() {
  const text = readFileSync(SNAPSHOT, 'utf8')
  const sha = /^\|\s*Source commit\s*\|\s*`([0-9a-f]{40})`\s*\|/m.exec(text)?.[1]
  if (!sha) throw new Error(`cannot parse the pinned Source commit from ${SNAPSHOT}`)
  return { sha, text }
}

/** git against the local checkout. */
function git(args) {
  return execFileSync('git', ['-C', checkout, ...args], { encoding: 'utf8', maxBuffer: 1 << 28 })
}

/** path -> blob sha for a commit's tree, via the local checkout. */
function treeOf(rev) {
  const out = git(['ls-tree', '-r', '--format=%(objectname) %(path)', rev])
  const map = new Map()
  for (const line of out.split('\n')) {
    const sp = line.indexOf(' ')
    if (sp < 0) continue
    map.set(line.slice(sp + 1), line.slice(0, sp))
  }
  return map
}

const report = { scope: SCOPE, added: [], removed: [], modified: [] }

if (checkout) {
  if (!existsSync(checkout)) {
    console.error(`ERROR: checkout not found: ${checkout}`)
    process.exit(2)
  }
  const { sha: pinned } = readSnapshot()
  const head = git(['rev-parse', 'HEAD']).trim()
  const upstreamRev = git(['rev-parse', 'origin/master']).trim()
  const target = flag('--commit', upstreamRev)
  let a
  let b
  try {
    a = treeOf(pinned)
    b = treeOf(target)
  } catch (err) {
    console.error(`ERROR: cannot read a tree (${err.message.split('\n')[0]}). Is ${pinned.slice(0, 7)} present in the checkout?`)
    process.exit(2)
  }
  for (const [p, s] of b) {
    if (!inScope(p)) continue
    if (!a.has(p)) report.added.push(p)
    else if (a.get(p) !== s) report.modified.push(p)
  }
  for (const p of a.keys()) if (inScope(p) && !b.has(p)) report.removed.push(p)
  report.pinned = pinned
  report.target = target
  report.head = head
  report.mode = 'checkout'
} else {
  console.error('ERROR: pass --checkout <deepseek-harness>; the API mode is not implemented (the mirror is pinned to a commit, and a tree comparison needs both trees).')
  process.exit(2)
}

const total = report.added.length + report.removed.length + report.modified.length
if (asJson) {
  console.log(JSON.stringify({ ...report, total }, null, 2))
} else {
  console.log(`pinned : ${report.pinned}`)
  console.log(`target : ${report.target}${report.target === report.head ? ' (checkout HEAD)' : ''}`)
  console.log('')
  if (total === 0) {
    console.log('FRESH: no in-scope file differs between the pinned commit and the target.')
  } else {
    console.log(`DRIFT: ${total} in-scope file(s) differ`)
    const show = (label, list) => {
      if (!list.length) return
      console.log(`\n  ${label} (${list.length}):`)
      for (const p of list.slice(0, 25)) console.log(`    ${p}`)
      if (list.length > 25) console.log(`    ... and ${list.length - 25} more`)
    }
    show('ADDED upstream (the mirror is missing these)', report.added)
    show('REMOVED upstream (the mirror still carries these)', report.removed)
    show('MODIFIED upstream (the mirror has stale content)', report.modified)
    console.log('\nAction: run  pwsh -File scripts/sync-official-docs.ps1  to refresh the mirror (never hand-edit it).')
  }
}

if (total > 0 && failOnDrift) process.exit(1)
process.exit(0)
