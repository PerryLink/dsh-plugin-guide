import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { runCheck } from '../src/cli/commands/check'
import type { CheckResult } from '../src/cli/lib/report'

const created: string[] = []

afterEach(() => {
  for (const dir of created.splice(0)) rmSync(dir, { recursive: true, force: true })
})

function sandbox(): string {
  const dir = mkdtempSync(join(tmpdir(), 'dsh-pd-check-'))
  created.push(dir)
  return dir
}

function write(root: string, rel: string, content: string): void {
  const path = join(root, rel)
  mkdirSync(join(path, '..'), { recursive: true })
  writeFileSync(path, content)
}

const README_BODY = `# demo\n\n## Compatibility\n\nok\n\n## Install\n\nok\n\n## License\n\nok\n`

function goodFixture(root: string): void {
  write(root, 'package.json', JSON.stringify({
    name: 'dsh-demo',
    version: '0.1.0',
    main: 'index.js',
    files: ['index.js', 'cordis.patch.yml', 'lib'],
    engines: { node: '^22.19.0 || >=24.0.0' },
    packageManager: 'pnpm@11.7.0',
    peerDependencies: { '@deepseek-ai/cordis': '^4.0.1', '@deepseek-ai/schemastery': '^3.18.0' },
    dsh: { bundle: { patch: './cordis.patch.yml' } },
  }))
  write(root, 'index.js', "export const name = 'dsh-demo'\n")
  write(root, 'cordis.patch.yml', '- insert:\n    - id: dsh-demo\n      name: dsh-demo\n')
  write(root, 'src/index.ts', "import type { Context } from '@deepseek-ai/cordis'\nimport Schema from '@deepseek-ai/schemastery'\nexport const Config = Schema.object({ greeting: Schema.string().default('Hi') })\n")
  for (const lang of ['README.md', 'README.zh.md', 'README.es.md', 'README.pt.md', 'README.hi.md']) {
    write(root, lang, README_BODY)
  }
}

function statusOf(results: CheckResult[], id: string): string {
  return results.find((c) => c.id === id)?.status ?? 'missing'
}

describe('check command', () => {
  it('passes a well-formed plugin', () => {
    const root = sandbox()
    goodFixture(root)
    const { report, exitCode } = runCheck({ root, strict: false })
    expect(exitCode).toBe(0)
    expect(report.ok).toBe(true)
    expect(statusOf(report.checks, 'patch-valid')).toBe('pass')
    expect(statusOf(report.checks, 'patch-ids-unique')).toBe('pass')
    expect(statusOf(report.checks, 'manifest-engines')).toBe('pass')
    expect(statusOf(report.checks, 'manifest-peers')).toBe('pass')
    expect(statusOf(report.checks, 'readme-five-langs')).toBe('pass')
  })

  it('fails deterministic checks on a malformed plugin', () => {
    const root = sandbox()
    write(root, 'package.json', JSON.stringify({
      name: 'dsh-bad',
      files: ['index.js'],
      peerDependencies: {},
      dsh: { bundle: { patch: './cordis.patch.yml' } },
    }))
    write(root, 'cordis.patch.yml', '- insert:\n    - id: dup\n      name: a\n    - id: dup\n      name: b\n- bogus\n')
    write(root, 'src/index.ts', "import { defineTool } from '@deepseek-ai/dsh-tools'\nexport const Config = { greeting: 'x' }\n")
    const { report, exitCode } = runCheck({ root, strict: false })
    expect(exitCode).toBe(1)
    expect(report.ok).toBe(false)
    expect(statusOf(report.checks, 'manifest-main')).toBe('fail')
    expect(statusOf(report.checks, 'manifest-engines')).toBe('fail')
    expect(statusOf(report.checks, 'manifest-peers')).toBe('fail')
    expect(statusOf(report.checks, 'manifest-files')).toBe('fail')
    expect(statusOf(report.checks, 'patch-valid')).toBe('fail')
    expect(statusOf(report.checks, 'patch-ids-unique')).toBe('fail')
    expect(statusOf(report.checks, 'redline-no-hardcoded-tunables')).toBe('fail')
    expect(statusOf(report.checks, 'readme-five-langs')).toBe('fail')
  })

  it('fails manifest-bundle-patch when the pointer is missing', () => {
    const root = sandbox()
    write(root, 'package.json', JSON.stringify({ name: 'dsh-bad', main: 'index.js', dsh: { bundle: { patch: './nope.yml' } } }))
    const { report } = runCheck({ root, strict: false })
    expect(statusOf(report.checks, 'manifest-bundle-patch')).toBe('fail')
  })

  it('reports warnings for missing five-language READMEs without failing', () => {
    const root = sandbox()
    goodFixture(root)
    rmSync(join(root, 'README.zh.md'))
    rmSync(join(root, 'README.hi.md'))
    const { report, exitCode } = runCheck({ root, strict: false })
    expect(exitCode).toBe(0)
    expect(statusOf(report.checks, 'readme-five-langs')).toBe('warn')
  })

  it('attaches a skill citation to every check', () => {
    const root = sandbox()
    goodFixture(root)
    const { report } = runCheck({ root, strict: false })
    for (const check of report.checks) {
      expect(check.skillRef.file).toBeTruthy()
      expect(check.skillRef.section).toBeTruthy()
    }
  })

  it('emits JSON when requested and is CI-consumable', () => {
    const root = sandbox()
    goodFixture(root)
    const { report } = runCheck({ root, strict: false })
    const parsed = JSON.parse(JSON.stringify(report)) as { schemaVersion: number; cli: string; ok: boolean; checks: unknown[] }
    expect(parsed.schemaVersion).toBe(1)
    expect(parsed.cli).toBe('dsh-plugin-dev')
    expect(parsed.ok).toBe(true)
    expect(parsed.checks.length).toBeGreaterThan(0)
  })
})
