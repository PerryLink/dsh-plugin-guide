// Artifact gate for the dsh-plugin-guide CLI. Runs after `pnpm run build` and
// verifies the shipped surfaces without any network access:
//   1. the built CLI, bin shim, and template trees exist;
//   2. the CLI self-checks this repo (dogfood) and reports `ok: true`;
//   3. the scaffolder produces TS and JS skeletons inside a mkdtemp sandbox
//      (never touching a real home directory), which are then removed.
import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync, readdirSync } from 'node:fs'
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
    const readmeCount = readdirSync(target).filter((f) => /^README(\.\w{2})?\.md$/.test(f)).length
    check(result.status === 0 && hasEntry && hasPatch, `${lang} scaffold produces entry + cordis.patch.yml (exit ${result.status})`)
    check(readmeCount === 5, `${lang} scaffold produces 5 README languages (${readmeCount})`)
  }
} finally {
  rmSync(sandbox, { recursive: true, force: true })
}

if (failures.length > 0) {
  console.error(`\nverify:artifacts FAILED (${failures.length})`)
  process.exit(1)
}
console.log('\nverify:artifacts OK')
