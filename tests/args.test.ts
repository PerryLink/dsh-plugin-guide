import { describe, expect, it } from 'vitest'
import { flagBool, flagString, parseArgs } from '../src/cli/lib/args'

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
