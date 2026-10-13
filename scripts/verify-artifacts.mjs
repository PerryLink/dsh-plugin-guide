// Artifact gate for the dsh-plugin-guide CLI. Runs after `pnpm run build` and
// verifies the shipped surfaces without any network access:
//   1. the built CLI, bin shim, and template trees exist;
//   2. the CLI self-checks this repo (dogfood) and reports `ok: true`;
//   3. the scaffolder produces TS and JS skeletons inside a mkdtemp sandbox
//      (never touching a real home directory), which are then removed.
import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const failures = []

function check(condition, message) {
  if (condition) {
    console.log(`ok - ${message}`)
  } else {
    failures.push(message)
    console.error(`FAIL - ${message}`)
  }
}

function runNode(args, options = {}) {
  return spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8', ...options })
}

// 1. Shipped surfaces.
check(existsSync(join(root, 'dist', 'dsh-plugin-dev.js')), 'dist/dsh-plugin-dev.js exists (run pnpm run build first)')
check(existsSync(join(root, 'bin', 'dsh-plugin-dev.js')), 'bin/dsh-plugin-dev.js exists')
check(existsSync(join(root, 'templates', 'ts')), 'templates/ts exists')
check(existsSync(join(root, 'templates', 'js')), 'templates/js exists')

// Files a subcommand reads at RUNTIME but that nothing else asserts are shipped.
// `data/seams/index.json` was missing from package.json `files[]` while the
// `seams` command already depended on it: the command worked from the source
// tree and would have failed for every installed user with "seam index not
// found". Reading the file in-repo cannot catch that, so assert the manifest
// declares it.
{
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
  const declared = (p) => pkg.files.some((f) => f === p || f.startsWith(`${p}/`) || f === `${p}`)
  const runtimeInputs = [
    ['data', 'data/seams/index.json read by `seams`'],
    ['data', 'data/facts.json read by check-facts'],
    ['SKILL.md', 'SKILL.md registered as the agent skill'],
  ]
  for (const [entry, why] of runtimeInputs) {
    check(declared(entry), `package.json files[] ships ${why}`)
  }
  const seamIndex = JSON.parse(readFileSync(join(root, 'data', 'seams', 'index.json'), 'utf8'))
  check(Array.isArray(seamIndex.seams) && seamIndex.seams.length > 0, 'seam index parses and is non-empty')
}

// The `seams` command must resolve its data through the BUILT bundle, since that
// is what ships; a source-tree-only path resolution works in tests and fails in
// the published artifact.
{
  const seams = runNode(['dist/dsh-plugin-dev.js', 'seams', 'L3', '--json'], { stdio: ['ignore', 'pipe', 'pipe'] })
  let parsed = null
  try { parsed = JSON.parse(seams.stdout) } catch { parsed = null }
  check(seams.status === 0 && parsed?.state === 'found', `bundled \`seams L3\` resolves its data (exit ${seams.status})`)

  // The third state must survive bundling: an unmatched query reports unknown.
  const unknown = runNode(['dist/dsh-plugin-dev.js', 'seams', 'zzz-nothing', '--json'], { stdio: ['ignore', 'pipe', 'pipe'] })
  let u = null
  try { u = JSON.parse(unknown.stdout) } catch { u = null }
  check(unknown.status === 3 && u?.state === 'unknown', `bundled \`seams\` reports unknown with exit 3 (exit ${unknown.status})`)
}

// 2. Version + dogfood self-check.
const version = runNode(['dist/dsh-plugin-dev.js', '--version'])
check(version.status === 0 && /\d+\.\d+\.\d+/.test(version.stdout.trim()), `--version prints a semver (${version.stdout.trim()})`)

const selfCheck = runNode(['dist/dsh-plugin-dev.js', 'check', '--json'], { stdio: ['ignore', 'pipe', 'pipe'] })
let ok = false
if (selfCheck.status === 0) {
  try {
    ok = JSON.parse(selfCheck.stdout).ok === true
  } catch {
    ok = false
  }
}
check(selfCheck.status === 0 && ok, `self-check (dogfood) reports ok (exit ${selfCheck.status})`)

// 3. Scaffold smoke in a mkdtemp sandbox.
const sandbox = mkdtempSync(join(tmpdir(), 'dsh-pd-artifacts-'))
try {
  for (const lang of ['ts', 'js']) {
    const target = join(sandbox, lang, 'demo-plugin')
    const result = runNode(['dist/dsh-plugin-dev.js', 'new', 'demo-plugin', '--lang', lang, '--dir', target])
    const hasEntry = lang === 'ts' ? existsSync(join(target, 'src', 'index.ts')) : existsSync(join(target, 'index.js'))
    const hasPatch = existsSync(join(target, 'cordis.patch.yml'))
    const readmeCount = readdirSync(target).filter((f) => /^README(-\w{2})?\.md$/.test(f)).length
    check(result.status === 0 && hasEntry && hasPatch, `${lang} scaffold produces entry + cordis.patch.yml (exit ${result.status})`)
    check(readmeCount === 5, `${lang} scaffold produces 5 README languages (${readmeCount})`)

    // Round-trip the scaffolder through the checker. This is the assertion whose
    // absence let `new --lang js` fail `check` for as long as it did: the
    // scaffolder and the checker disagreed about whether a build-artifact
    // directory is mandatory, and nothing ever ran one against the other. The
    // golden path a user follows is exactly this pair, so it is the pair the
    // artifact gate must exercise.
    const scaffoldCheck = runNode(['dist/dsh-plugin-dev.js', 'check', '--cwd', target, '--json'], { stdio: ['ignore', 'pipe', 'pipe'] })
    let scaffoldOk = false
    let scaffoldDetail = ''
    try {
      const parsed = JSON.parse(scaffoldCheck.stdout)
      scaffoldOk = parsed.ok === true
      if (!scaffoldOk) {
        scaffoldDetail = (parsed.checks ?? [])
          .filter((c) => c.status === 'fail')
          .map((c) => c.id)
          .join(', ')
      }
    } catch {
      scaffoldDetail = 'unparseable --json output'
    }
    check(
      scaffoldCheck.status === 0 && scaffoldOk,
      `${lang} scaffold passes the checker (exit ${scaffoldCheck.status}${scaffoldDetail ? `; failing: ${scaffoldDetail}` : ''})`,
    )
  }

  // 3b. Extension contract for the TS scaffold. `platform: node` makes tsdown
  // force `.mjs`/`.cjs` unless `fixedExtension` is disabled, while the scaffolded
  // package.json declares `lib/index.js` + `lib/index.d.ts`. When those two
  // disagree the build succeeds and `main` resolves to nothing, so the plugin
  // installs and then silently never loads — with no error anywhere. Asserted
  // offline (no install, no build) so the gate stays network-free.
  const tsConfig = readFileSync(join(root, 'templates', 'ts', 'tsdown.config.mjs'), 'utf8')
  check(
    /fixedExtension\s*:\s*false/.test(tsConfig),
    'ts template disables tsdown fixedExtension so the build emits the declared lib/index.js',
  )
} finally {
  rmSync(sandbox, { recursive: true, force: true })
}

if (failures.length > 0) {
  console.error(`\nverify:artifacts FAILED (${failures.length})`)
  process.exit(1)
}
console.log('\nverify:artifacts OK')
