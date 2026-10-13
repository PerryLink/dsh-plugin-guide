// `dsh-plugin-dev` CLI entry: argument dispatch and top-level error handling.
import { UsageError, flagBool, flagString, parseArgs } from './lib/args'
import { readCliVersion } from './meta'
import { runCheck, printCheckReport } from './commands/check'
import { runNew } from './commands/new'
import { runSeams } from './commands/seams'
import { loadSeamIndex } from './lib/seams'
import {
  resolveDsh,
  resolvePnpm,
  renderVerifySteps,
  runVerify,
  VERIFY_BASE_SPEC,
  VERIFY_HEADLESS_SPEC,
} from './commands/verify'

const HELP = `dsh-plugin-dev — the DeepSeek Harness plugin-development CLI

Usage:
  dsh-plugin-dev <command> [options]

Commands:
  new <name>      Scaffold a TypeScript or JavaScript plugin repo skeleton
                  (src/index.ts contract template, Schemastery Config, tests,
                  tsdown/vitest, cordis.patch.yml, five-language READMEs).
                  Flags: --lang <ts|js> --dir <path> --force --git
  check           Run static plugin checks and emit a CI-consumable report.
                  Flags: --cwd <dir> --json --strict
  verify          pnpm pack, then install/start/uninstall the bundle in a clean
                  mkdtemp DSH_HOME profile (aligned with verify:self-contained).
                  Flags: --cwd <dir> --dsh <bin> --pnpm <bin> --profile <name>
                         --base <spec> --headless <spec> --timeout <ms>
                         --smoke-timeout <ms>
  seams <query>   Ask whether an API or capability exists in a target host:
                  a seam id (L3), a capability id (A20), a version, or a word.
                  Exits 3 when the knowledge base does not establish an answer —
                  which is NOT a "no". Flags: --json
  seams --since <version>
                  List every recorded breaking change that lands AFTER a version
                  you target, flagging which ones static inspection cannot see.

Global:
  -h, --help      Show this help
  -V, --version   Print the CLI version

Environment tunables:
  DSH_PLUGIN_DEV_TEMPLATES     override the scaffold templates directory
  DSH_PLUGIN_DEV_DSH           override the dsh CLI used by verify
  DSH_PLUGIN_DEV_PNPM          override the pnpm binary used by verify
  DSH_PLUGIN_DEV_TIMEOUT       install/pack timeout in ms (default 300000)
  DSH_PLUGIN_DEV_SMOKE_TIMEOUT headless smoke timeout in ms (default 120000)
`

const DEFAULT_TIMEOUT_MS = 300_000
const DEFAULT_SMOKE_TIMEOUT_MS = 120_000

/** Parse a millisecond integer flag with an env-tunable fallback. */
function timeoutMs(flags: Record<string, string | boolean>, key: string, envKey: string, fallback: number): number {
  const raw = flagString(flags, key, process.env[envKey])
  if (raw === undefined) return fallback
  const parsed = Number.parseInt(raw, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) throw new Error(`invalid ${key} value "${raw}": expected a positive millisecond count`)
  return parsed
}

/**
 * Run the CLI and return a process exit code.
 * @param argv - process.argv.slice(2) style input.
 * @param cwd - working directory (injectable for tests).
 */
export async function main(argv: string[], cwd: string = process.cwd()): Promise<number> {
  // Union of every subcommand's flags. The allowlist exists so a mistyped flag
  // fails loudly instead of being silently dropped: `check --stirct` used to
  // exit 0 without running the strict pass, which makes the tool unusable as a
  // CI gate - green runs that never evaluated what they claimed to.
  const KNOWN_FLAGS = [
    'help',
    'h',
    'version',
    'V',
    // new
    'lang',
    'dir',
    'force',
    'git',
    // check
    'cwd',
    'json',
    'strict',
    // verify
    'dsh',
    'pnpm',
    'profile',
    'base',
    'headless',
    'timeout',
    'smoke-timeout',
    // seams
    'since',
    'query',
  ] as const

  let parsed
  try {
    parsed = parseArgs(argv, KNOWN_FLAGS)
  } catch (err) {
    if (err instanceof UsageError) {
      // 2 = usage error, matching the documented exit-code contract.
      process.stderr.write(`dsh-plugin-dev: ${err.message}\n`)
      return 2
    }
    throw err
  }
  const { positionals, flags } = parsed

  if (flagBool(flags, 'version') || flags.V === true) {
    process.stdout.write(`${readCliVersion()}\n`)
    return 0
  }
  if (flagBool(flags, 'help') || flags.h === true || positionals.length === 0) {
    process.stdout.write(HELP)
    return 0
  }

  const command = positionals[0]

  try {
    switch (command) {
      case 'new': {
        const name = positionals[1]
        if (!name) throw new Error('missing plugin name: dsh-plugin-dev new <name>')
        const lang = flagString(flags, 'lang', 'ts') as 'ts' | 'js'
        if (lang !== 'ts' && lang !== 'js') throw new Error(`--lang must be "ts" or "js", got "${lang}"`)
        const result = await runNew(cwd, {
          name,
          lang,
          dir: flagString(flags, 'dir'),
          force: flagBool(flags, 'force'),
          git: flagBool(flags, 'git'),
        })
        process.stdout.write(`scaffolded ${result.files} files into ${result.targetDir}\n`)
        return 0
      }

      case 'check': {
        const root = flagString(flags, 'cwd', cwd) ?? cwd
        const { report, exitCode } = runCheck({ root, strict: flagBool(flags, 'strict') })
        printCheckReport(report, flagBool(flags, 'json') ? 'json' : 'text')
        return exitCode
      }

      case 'verify': {        const root = flagString(flags, 'cwd', cwd) ?? cwd
        const result = await runVerify({
          root,
          dshBin: resolveDsh(flagString(flags, 'dsh')),
          pnpmBin: resolvePnpm(flagString(flags, 'pnpm')),
          profile: flagString(flags, 'profile', 'compat') ?? 'compat',
          // Keep these aligned with the versions `.github/workflows/compat.yml`
          // installs. `dsh` enforces plugin/runtime compatibility at install time,
          // so a stale pin here makes `verify` fail on every newer harness with
          // "Plugin @deepseek-ai/dsh-headless@<old> is incompatible with dsh
          // <new>" — a failure that names the base bundle, not the plugin under
          // test. Verified working line: 0.2.1-alpha.2 (npm `alpha`).
          base: flagString(flags, 'base', VERIFY_BASE_SPEC) ?? VERIFY_BASE_SPEC,
          headless: flagString(flags, 'headless', VERIFY_HEADLESS_SPEC) ?? VERIFY_HEADLESS_SPEC,
          timeoutMs: timeoutMs(flags, 'timeout', 'DSH_PLUGIN_DEV_TIMEOUT', DEFAULT_TIMEOUT_MS),
          smokeTimeoutMs: timeoutMs(flags, 'smoke-timeout', 'DSH_PLUGIN_DEV_SMOKE_TIMEOUT', DEFAULT_SMOKE_TIMEOUT_MS),
        })
        process.stdout.write(renderVerifySteps(root, result.steps))
        process.stdout.write('\n')
        if (result.error) {
          process.stdout.write(`FAIL: ${result.error}\n`)
          for (const suggestion of result.suggestions) process.stdout.write(`  - ${suggestion}\n`)
        } else {
          process.stdout.write('verify: OK\n')
        }
        return result.exitCode
      }

      case 'seams': {
        // Two spellings: `seams <query>` looks one thing up, `seams --since <v>`
        // lists every recorded change that lands after a target version.
        const since = flagString(flags, 'since')
        const query = positionals[1] ?? flagString(flags, 'query')
        return runSeams(loadSeamIndex(), { query, since, json: flagBool(flags, 'json') })
      }

      default:
        process.stderr.write(`unknown command "${command}"\n\n${HELP}`)
        return 2
    }
  } catch (err) {
    process.stderr.write(`dsh-plugin-dev: ${err instanceof Error ? err.message : String(err)}\n`)
    return 1
  }
}
