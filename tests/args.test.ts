import { describe, expect, it } from 'vitest'
import { UsageError, flagBool, flagString, parseArgs } from '../src/cli/lib/args'

describe('parseArgs', () => {
  it('splits positionals from flags', () => {
    const { positionals, flags } = parseArgs(['new', 'hello-plugin', '--lang', 'ts'])
    expect(positionals).toEqual(['new', 'hello-plugin'])
    expect(flags.lang).toBe('ts')
  })

  it('supports --key=value', () => {
    const { flags } = parseArgs(['check', '--cwd=C:\\x'])
    expect(flags.cwd).toBe('C:\\x')
  })

  it('supports boolean flags and a -- terminator', () => {
    const { positionals, flags } = parseArgs(['verify', '--json', '--', '--not-a-flag'])
    expect(flags.json).toBe(true)
    expect(positionals).toEqual(['verify', '--not-a-flag'])
  })

  it('records short flags', () => {
    const { flags } = parseArgs(['-h'])
    expect(flags.h).toBe(true)
  })

  // Regression: `check --stirct` used to parse the typo, silently skip the
  // strict pass, and exit 0. A gate that a spelling mistake can disable while
  // staying green is worse than no gate.
  describe('flag allowlist', () => {
    const allowed = ['strict', 'json', 'cwd', 'help', 'h', 'version', 'V'] as const

    it('accepts a known flag', () => {
      expect(parseArgs(['check', '--strict'], allowed).flags.strict).toBe(true)
    })

    it('rejects a mistyped flag instead of ignoring it', () => {
      expect(() => parseArgs(['check', '--stirct'], allowed)).toThrow(UsageError)
      expect(() => parseArgs(['check', '--stirct'], allowed)).toThrow(/unknown option "--stirct"/)
    })

    it('names the accepted options in the error', () => {
      expect(() => parseArgs(['--nope'], allowed)).toThrow(/accepted: .*strict/)
    })

    it('rejects an unknown flag given as --key=value too', () => {
      expect(() => parseArgs(['--bogus=1'], allowed)).toThrow(UsageError)
    })

    it('rejects an unknown short flag', () => {
      expect(() => parseArgs(['-Z'], allowed)).toThrow(UsageError)
    })

    it('still allows everything when no allowlist is supplied', () => {
      expect(parseArgs(['--anything']).flags.anything).toBe(true)
    })
  })
})

describe('flag helpers', () => {
  it('reads strings and booleans with fallbacks', () => {
    expect(flagString({ lang: 'ts' }, 'lang')).toBe('ts')
    expect(flagString({}, 'lang', 'js')).toBe('js')
    expect(flagBool({ force: true }, 'force')).toBe(true)
    expect(flagBool({ force: 'true' }, 'force')).toBe(true)
    expect(flagBool({}, 'force')).toBe(false)
  })
})
