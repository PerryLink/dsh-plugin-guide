// Minimal dependency-free argument parser for the `dsh-plugin-dev` CLI.
// Supports positionals, `--flag`, `--key value`, `--key=value`, short flags,
// and a `--` end-of-options marker. No commander dependency by design.

/** Parsed command-line arguments. */
export interface ParsedArgs {
  /** Positional arguments in order. */
  positionals: string[]
  /** Long/short flags keyed by their canonical name; booleans are `true`. */
  flags: Record<string, string | boolean>
}

const LONG_ALIASES: Record<string, string> = {
  help: 'help',
  version: 'version',
}

/** Raised for a malformed or unrecognised argument. */
export class UsageError extends Error {}

/**
 * Parse an argv slice (without the node/script prefix) into positionals and flags.
 *
 * `allowed` is the set of long flag names the caller accepts (aliases included).
 * Passing it turns an unrecognised flag into a `UsageError` instead of a silently
 * ignored one: `dsh-plugin-dev check --stirct` used to parse the typo, check
 * nothing extra, and exit 0 — a gate that can be disabled by a spelling mistake
 * is worse than no gate, because CI stays green and everyone believes it ran.
 *
 * @param argv - process.argv.slice(2) style input.
 * @param allowed - optional allowlist of accepted long flag names.
 * @returns the parsed structure.
 */
export function parseArgs(argv: string[], allowed?: readonly string[]): ParsedArgs {
  const positionals: string[] = []
  const flags: Record<string, string | boolean> = {}
  const permitted = allowed ? new Set(allowed) : undefined

  const assertAllowed = (key: string): void => {
    if (permitted && !permitted.has(key)) {
      const known = [...permitted].sort().join(', ')
      throw new UsageError(`unknown option "--${key}" (accepted: ${known})`)
    }
  }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--') {
      positionals.push(...argv.slice(i + 1))
      break
    }
    if (arg.startsWith('--')) {
      const body = arg.slice(2)
      const eq = body.indexOf('=')
      if (eq >= 0) {
        const key = body.slice(0, eq)
        const canonical = LONG_ALIASES[key] ?? key
        assertAllowed(canonical)
        setFlag(flags, key, body.slice(eq + 1))
        continue
      }
      const key = body
      assertAllowed(LONG_ALIASES[key] ?? key)
      const next = argv[i + 1]
      if (next !== undefined && !next.startsWith('-')) {
        setFlag(flags, key, next)
        i++
      } else {
        setFlag(flags, key, true)
      }
      continue
    }
    if (arg.startsWith('-') && arg.length > 1) {
      // Short flags; a trailing short flag with a value is not supported.
      for (const ch of arg.slice(1)) {
        assertAllowed(ch)
        flags[ch] = true
      }
      continue
    }
    positionals.push(arg)
  }

  return { positionals, flags }
}

function setFlag(flags: Record<string, string | boolean>, key: string, value: string | boolean): void {
  const canonical = LONG_ALIASES[key] ?? key
  flags[canonical] = value
}

/** Read a flag as a string, returning the fallback when absent or boolean-true. */
export function flagString(flags: Record<string, string | boolean>, key: string, fallback?: string): string | undefined {
  const v = flags[key]
  if (typeof v === 'string') return v
  return fallback
}

/** Read a flag as a boolean. */
export function flagBool(flags: Record<string, string | boolean>, key: string): boolean {
  return flags[key] === true || flags[key] === 'true'
}
