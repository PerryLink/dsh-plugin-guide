import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { cleanupTempDir, createTempDir, readFileIfExists, TEMP_PREFIX, writeFileDeep } from '../src/cli/lib/fs'

const created: string[] = []

afterEach(() => {
  for (const dir of created.splice(0)) {
    try {
      cleanupTempDir(dir)
    } catch {
      // already cleaned by the test
    }
  }
})

describe('temp dir lifecycle', () => {
  it('creates a tracked dir under the temp root with the marker prefix', () => {
    const dir = createTempDir('t')
    created.push(dir)
    expect(dir).toContain(tmpdir())
    expect(dir).toContain(TEMP_PREFIX)
    expect(existsSync(dir)).toBe(true)
  })

  it('cleans a tracked dir and refuses to clean it twice', () => {
    const dir = createTempDir('t')
    created.push(dir)
    cleanupTempDir(dir)
    expect(existsSync(dir)).toBe(false)
    expect(() => cleanupTempDir(dir)).toThrow(/untracked/)
  })

  it('refuses to clean a marker-prefixed path it did not create', () => {
    const other = mkdtempSync(join(tmpdir(), `${TEMP_PREFIX}not-tracked-`))
    try {
      expect(() => cleanupTempDir(other)).toThrow(/untracked/)
    } finally {
      rmSync(other, { recursive: true, force: true })
    }
  })

  it('refuses to clean a non-prefixed path', () => {
    const other = mkdtempSync(join(tmpdir(), 'not-ours-'))
    try {
      expect(() => cleanupTempDir(other)).toThrow(/non-mkdtemp/)
    } finally {
      rmSync(other, { recursive: true, force: true })
    }
  })

  it('refuses to clean the temp root itself', () => {
    expect(() => cleanupTempDir(tmpdir())).toThrow(/outside the temp root/)
  })
})

describe('write/read helpers', () => {
  it('writes files with deep directories and reads them back', () => {
    const dir = createTempDir('w')
    created.push(dir)
    const path = join(dir, 'a', 'b', 'c.txt')
    writeFileDeep(path, 'hello')
    expect(readFileIfExists(path)).toBe('hello')
  })
})
