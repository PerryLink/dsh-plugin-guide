// `dsh-plugin-dev verify` — pack + clean-profile install/start/uninstall smoke.
//
// Aligned with the official verify:self-contained approach and this repo's own
// compat.yml: pack the bundle, install it next to dsh-base + dsh-headless into a
// scratch profile under a mkdtemp DSH_HOME, assert the row mounts (dump-config),
// run one keyless headless task (MISSING_CREDENTIAL proves the tree loaded), then
// uninstall. Only the mkdtemp directories this command created are ever cleaned.
import { readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { cleanupAllTempDirs, createTempDir, readJsonIfExists, writeFileDeep } from '../lib/fs'
import { run, tailOf, type RunResult } from '../lib/subprocess'

/** Options for the verify command. */
export interface VerifyOptions {
  root: string
  dshBin: string
  pnpmBin: string
  profile: string
  base: string
  headless: string
  timeoutMs: number
  smokeTimeoutMs: number
}

/** One verification step result. */
export interface StepResult {
  step: string
  ok: boolean
  detail: string
}

/** Final verification outcome. */
export interface VerifyResult {
  steps: StepResult[]
  exitCode: number
  error?: string
  suggestions: string[]
}

const PROFILE_WORKSPACE = `# scratch profile allowlist (mirrors the repo's compat workflow)
packages:
  - .
nodeLinker: hoisted
autoInstallPeers: false
allowBuilds:
  '@deepseek-ai/dsh-subprocess-local': true
  koffi: true
  node-pty: true
  protobufjs: true
  '@google/genai': true
`

/**
 * Run the full verify smoke. Never throws for a verification failure; instead it
 * returns a non-zero exit code with the failing step tail and suggestions. Temp
 * directories are always cleaned up in `finally`.
 */
export async function runVerify(options: VerifyOptions): Promise<VerifyResult> {
  const root = resolve(options.root)
  const pkg = readJsonIfExists<{ name?: string }>(join(root, 'package.json'))
  const pkgName = pkg?.name ?? 'plugin'
  const workDir = createTempDir('verify')
  const homeDir = createTempDir('home')
  const steps: StepResult[] = []
  let failure: { error: string; suggestions: string[] } | undefined

  const push = (step: string, result: RunResult): void => {
    const ok = result.code === 0 && !result.timedOut
    steps.push({ step, ok, detail: ok ? 'ok' : tailOf(result) })
  }

  try {
    // 1. Pack the bundle into the scratch work dir.
    const pack = await run(options.pnpmBin, ['pack', '--pack-destination', workDir], {
      cwd: root,
      timeoutMs: options.timeoutMs,
    })
    push('pack', pack)
    if (pack.code !== 0) {
      failure = { error: 'pnpm pack failed', suggestions: suggestionsFor('pack', pack) }
      return { steps, exitCode: 1, ...failure }
    }
    const tarball = findTarball(workDir)
    if (!tarball) {
      failure = { error: `no tarball produced in ${workDir}`, suggestions: ['run `pnpm pack --pack-destination <dir>` manually and inspect the output'] }
      return { steps, exitCode: 1, ...failure }
    }

    // 2. Initialize the scratch profile before the first `dsh plugin add`.
    const profileDir = join(homeDir, 'profiles', options.profile)
    writeFileDeep(join(profileDir, 'pnpm-workspace.yaml'), PROFILE_WORKSPACE)

    // 3. Install base + headless + the tarball into the scratch profile.
    const add = await run(
      options.dshBin,
      ['plugin', '--profile', options.profile, 'add', options.base, options.headless, tarball],
      { cwd: homeDir, env: { DSH_HOME: homeDir }, timeoutMs: options.timeoutMs },
    )
    push('install', add)
    if (add.code !== 0) {
      failure = { error: 'profile install failed', suggestions: suggestionsFor('install', add) }
      return { steps, exitCode: 1, ...failure }
    }

    // 4. Assert the bundle row mounts.
    const dump = await run(options.dshBin, ['--profile', options.profile, '--dump-config'], {
      cwd: homeDir,
      env: { DSH_HOME: homeDir },
      timeoutMs: options.timeoutMs,
    })
    push('dump-config', dump)
    if (dump.code !== 0) {
      failure = { error: 'dump-config failed', suggestions: suggestionsFor('dump-config', dump) }
      return { steps, exitCode: 1, ...failure }
    }
    if (!dump.stdout.includes(pkgName)) {
      failure = { error: `bundle row "${pkgName}" did not mount`, suggestions: [`dump-config output did not contain "${pkgName}"`] }
      return { steps, exitCode: 1, ...failure }
    }

    // 5. Keyless headless smoke: MISSING_CREDENTIAL proves the tree loaded.
    // The dsh CLI writes that error to stderr on keyless machines, so check both.
    const smoke = await run(options.dshBin, ['--profile', options.profile, 'Reply with exactly: ok'], {
      cwd: homeDir,
      env: { DSH_HOME: homeDir },
      timeoutMs: options.smokeTimeoutMs,
    })
    const smokeOk = isSmokeOk(smoke.stdout, smoke.stderr)
    steps.push({
      step: 'headless-smoke',
      ok: smokeOk,
      detail: smokeOk ? ((`${smoke.stdout}\n${smoke.stderr}`.includes('MISSING_CREDENTIAL')) ? 'ok (keyless)' : 'ok (with key)') : tailOf(smoke),
    })
    if (!smokeOk) {
      failure = { error: 'headless smoke did not prove tree load', suggestions: suggestionsFor('headless', smoke) }
      return { steps, exitCode: 1, ...failure }
    }

    // 6. Uninstall must be fully reversible.
    const remove = await run(options.dshBin, ['plugin', '--profile', options.profile, 'remove', pkgName], {
      cwd: homeDir,
      env: { DSH_HOME: homeDir },
      timeoutMs: options.timeoutMs,
    })
    push('uninstall', remove)
    if (remove.code !== 0) {
      failure = { error: 'uninstall failed', suggestions: suggestionsFor('uninstall', remove) }
      return { steps, exitCode: 1, ...failure }
    }

    return { steps, exitCode: 0, suggestions: [] }
  } finally {
    cleanupAllTempDirs()
  }
}

function findTarball(dir: string): string | undefined {
  for (const entry of readdirSync(dir)) {
    if (entry.endsWith('.tgz')) return join(dir, entry)
  }
  return undefined
}

function suggestionsFor(step: string, result: RunResult): string[] {
  const base = [`tail of "${step}":\n${tailOf(result)}`]
  if (result.timedOut) base.push(`command timed out; raise --timeout or --smoke-timeout`)
  if (step === 'install') {
    base.push('ensure the dsh CLI is @deepseek-ai/dsh@0.1.2-rc.1 (older builds such as the rc.6 line do not satisfy the compat pin)')
    base.push('confirm the profile allowlist matches the repo compat workflow (native builds allowlisted)')
  }
  if (step === 'headless') {
    base.push('a hang usually means an injected service stayed pending; the smoke timeout surfaces exactly that')
  }
  return base
}

/**
 * True when a headless smoke run proves the plugin tree loaded: keyless runs
 * print `MISSING_CREDENTIAL` (on stderr), keyed runs print `ok`.
 * @param stdout - captured stdout.
 * @param stderr - captured stderr.
 */
export function isSmokeOk(stdout: string, stderr: string): boolean {
  const text = `${stdout}\n${stderr}`
  return text.includes('MISSING_CREDENTIAL') || /(^|[^a-z])ok([^a-z]|$)/i.test(text)
}

/** Resolve the dsh binary: explicit flag/env first, then PATH `dsh`. */
export function resolveDsh(flag?: string): string {
  return flag ?? process.env.DSH_PLUGIN_DEV_DSH ?? 'dsh'
}

/** Resolve the pnpm binary: explicit flag/env first, then PATH `pnpm`. */
export function resolvePnpm(flag?: string): string {
  return flag ?? process.env.DSH_PLUGIN_DEV_PNPM ?? 'pnpm'
}

/** Format the verify steps for the console. */
export function renderVerifySteps(root: string, steps: StepResult[]): string {
  const lines = [`verify: ${root}`, '']
  for (const step of steps) {
    lines.push(`${step.ok ? '✓' : '✗'} ${step.step}${step.ok ? '' : `\n${step.detail}`}`)
  }
  return lines.join('\n')
}
