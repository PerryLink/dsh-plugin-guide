import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { normalizeName, runNew } from '../src/cli/commands/new'

const created: string[] = []

afterEach(() => {
  for (const dir of created.splice(0)) rmSync(dir, { recursive: true, force: true })
})

function sandbox(): string {
  const dir = mkdtempSync(join(tmpdir(), 'dsh-pd-new-'))
  created.push(dir)
  return dir
}

describe('normalizeName', () => {
  it('prefixes dsh- and strips an existing prefix', () => {
    expect(normalizeName('hello-plugin')).toEqual({ name: 'hello-plugin', pkgName: 'dsh-hello-plugin' })
    expect(normalizeName('dsh-hello-plugin')).toEqual({ name: 'hello-plugin', pkgName: 'dsh-hello-plugin' })
  })

  it('strips an npm scope', () => {
    expect(normalizeName('@scope/dsh-foo')).toEqual({ name: 'foo', pkgName: 'dsh-foo' })
  })

  it('rejects invalid names', () => {
    expect(() => normalizeName('Hello World')).toThrow(/invalid plugin name/)
    expect(() => normalizeName('')).toThrow(/invalid plugin name/)
  })
})

describe('runNew', () => {
  it('scaffolds a TypeScript skeleton with the contract files', async () => {
    const dir = sandbox()
    const result = await runNew(dir, { name: 'demo-plugin', lang: 'ts', force: false, git: false })
    expect(result.files).toBeGreaterThan(10)
    expect(existsSync(join(dir, 'demo-plugin', 'src', 'index.ts'))).toBe(true)
    expect(existsSync(join(dir, 'demo-plugin', 'src', 'config.ts'))).toBe(true)
    expect(existsSync(join(dir, 'demo-plugin', 'cordis.patch.yml'))).toBe(true)
    expect(existsSync(join(dir, 'demo-plugin', 'tests', 'index.test.ts'))).toBe(true)
    const readmeNames = readdirSync(join(dir, 'demo-plugin')).filter((f) => /^README(\.\w{2})?\.md$/.test(f))
    expect(readmeNames).toHaveLength(5)
    const pkg = readFileSync(join(dir, 'demo-plugin', 'package.json'), 'utf8')
    expect(pkg).toContain('"name": "dsh-demo-plugin"')
  })

  it('scaffolds a JavaScript skeleton without a build step', async () => {
    const dir = sandbox()
    await runNew(dir, { name: 'js-plugin', lang: 'js', force: false, git: false })
    expect(existsSync(join(dir, 'js-plugin', 'index.js'))).toBe(true)
    expect(existsSync(join(dir, 'js-plugin', 'cordis.patch.yml'))).toBe(true)
    const pkg = JSON.parse(readFileSync(join(dir, 'js-plugin', 'package.json'), 'utf8'))
    expect(pkg.main).toBe('index.js')
  })

  it('refuses to overwrite a non-empty target without --force, then succeeds with --force', async () => {
    const dir = sandbox()
    await runNew(dir, { name: 'demo-plugin', lang: 'ts', force: false, git: false })
    await expect(runNew(dir, { name: 'demo-plugin', lang: 'ts', force: false, git: false })).rejects.toThrow(/not empty/)
    const result = await runNew(dir, { name: 'demo-plugin', lang: 'ts', force: true, git: false })
    expect(result.files).toBeGreaterThan(10)
  })
})
