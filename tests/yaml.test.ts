import { describe, expect, it } from 'vitest'
import { isArray, isObject, parseYaml } from '../src/cli/lib/yaml'

describe('yaml subset parser', () => {
  it('parses a block mapping with scalars', () => {
    const value = parseYaml('a: 1\nb: hello\nc: true\nd: null\n')
    expect(isObject(value)).toBe(true)
    if (isObject(value)) {
      expect(value.a).toBe(1)
      expect(value.b).toBe('hello')
      expect(value.c).toBe(true)
      expect(value.d).toBe(null)
    }
  })

  it('parses the cordis.patch.yml insert shape', () => {
    const value = parseYaml(`# comment
- insert:
    - id: dsh-plugin-guide
      name: dsh-plugin-guide
    - id: dsh-other
      name: 'dsh-other'
`)
    expect(isArray(value)).toBe(true)
    if (isArray(value)) {
      const first = value[0]
      expect(isObject(first)).toBe(true)
      if (isObject(first)) {
        const rows = first.insert
        expect(isArray(rows)).toBe(true)
        if (isArray(rows)) {
          expect(rows.length).toBe(2)
          const row0 = rows[0]
          expect(isObject(row0)).toBe(true)
          if (isObject(row0)) {
            expect(row0.id).toBe('dsh-plugin-guide')
            expect(row0.name).toBe('dsh-plugin-guide')
          }
        }
      }
    }
  })

  it('strips inline comments but keeps quoted #', () => {
    const value = parseYaml("greeting: 'hi # there'\n# full-line comment\ncount: 2\n")
    expect(isObject(value)).toBe(true)
    if (isObject(value)) {
      expect(value.greeting).toBe('hi # there')
      expect(value.count).toBe(2)
    }
  })

  it('keeps !!js tagged values as literal strings', () => {
    const value = parseYaml('- id: x\n  config:\n    port: !!js ctx.foo ?? 8080\n')
    expect(isArray(value)).toBe(true)
    if (isArray(value) && isObject(value[0]) && isObject(value[0].config)) {
      expect(value[0].config.port).toBe('!!js ctx.foo ?? 8080')
    }
  })

  it('parses nested sequences under a mapping key', () => {
    const value = parseYaml('inject:\n  - tools\n  - skills\n')
    expect(isObject(value)).toBe(true)
    if (isObject(value)) {
      expect(isArray(value.inject)).toBe(true)
      if (isArray(value.inject)) expect(value.inject).toEqual(['tools', 'skills'])
    }
  })

  it('returns null for an empty document', () => {
    expect(parseYaml('# only a comment\n')).toBe(null)
  })

  it('parses double-quoted escapes', () => {
    const value = parseYaml('msg: "line1\\nline2"\n')
    if (isObject(value)) expect(value.msg).toBe('line1\nline2')
  })
})
