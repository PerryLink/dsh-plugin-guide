import { describe, expect, it } from 'vitest'
import { buildGreeting } from '../index.js'

describe('{{pkgName}}', () => {
  it('builds a greeting from the configured prefix', () => {
    expect(buildGreeting('Hello', 'world')).toBe('Hello: world')
  })

  it('keeps the text verbatim after the prefix', () => {
    expect(buildGreeting('Hi', 'a b:c')).toBe('Hi: a b:c')
  })
})
