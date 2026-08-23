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

/**
 * Parse an argv slice (without the node/script prefix) into positionals and flags.
 * @param argv - process.argv.slice(2) style input.
 * @returns the parsed structure.
 */
export function parseArgs(argv: string[]): ParsedArgs {
  const positionals: string[] = []
  const flags: Record<string, string | boolean> = {}

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
        setFlag(flags, body.slice(0, eq), body.slice(eq + 1))
        continue
      }
      const key = body
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
      for (const ch of arg.slice(1)) flags[ch] = true
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
