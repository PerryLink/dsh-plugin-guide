import { describe, expect, it } from 'vitest'
import { renderScaffold } from '../src/cli/templates'

const context = { name: 'demo-plugin', pkgName: 'dsh-demo-plugin', version: '0.1.0', year: '2026' }

function files(lang: 'ts' | 'js'): Map<string, string> {
  return new Map(renderScaffold(lang, context).map((f) => [f.relativePath, f.content]))
}

describe('scaffold templates', () => {
  it('substitutes placeholders in the TS skeleton', () => {
    const ts = files('ts')
    expect(ts.get('package.json')).toContain('"name": "dsh-demo-plugin"')
    expect(ts.get('src/index.ts')).toContain("export const name = 'dsh-demo-plugin'")
    expect(ts.get('cordis.patch.yml')).toContain('id: dsh-demo-plugin')
    expect(ts.get('src/index.ts')).not.toContain('{{')
  })

  it('follows the family package.json standards in both skeletons', () => {
    for (const lang of ['ts', 'js'] as const) {
      const pkg = JSON.parse(files(lang).get('package.json') ?? '{}')
      expect(pkg.engines.node).toBe('^22.19.0 || >=24.0.0')
      expect(pkg.packageManager).toBe('pnpm@11.7.0')
      expect(pkg.peerDependencies['@deepseek-ai/cordis']).toBe('^4.0.1')
      expect(pkg.peerDependencies['@deepseek-ai/schemastery']).toBe('^3.18.0')
      expect(pkg.peerDependencies['@deepseek-ai/dsh-tools']).toBe('>=0.1.0-rc.8 <0.2.0')
      expect(pkg.dsh.bundle.patch).toBe('./cordis.patch.yml')
    }
  })

  it('keeps five README headings consistent within a skeleton', () => {
    for (const lang of ['ts', 'js'] as const) {
      const set = files(lang)
      const headingsOf = (f: string) => (set.get(f) ?? '').split(/\r?\n/).filter((l) => l.startsWith('## ')).map((l) => l.trim()).sort()
      const base = headingsOf('README.md')
      expect(base.length).toBeGreaterThanOrEqual(5)
      for (const readme of ['README.zh.md', 'README.es.md', 'README.pt.md', 'README.hi.md']) {
        expect(headingsOf(readme)).toEqual(base)
      }
    }
  })

  it('comments the cordis.patch.yml keys in both skeletons', () => {
    for (const lang of ['ts', 'js'] as const) {
      const patch = files(lang).get('cordis.patch.yml') ?? ''
      expect(patch).toContain('`id`')
      expect(patch).toContain('`name`')
      expect(patch).toContain('dsh.bundle.patch')
    }
  })
})
