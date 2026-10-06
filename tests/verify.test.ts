import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  isSmokeOk,
  renderVerifySteps,
  resolveDsh,
  resolvePnpm,
  VERIFY_BASE_SPEC,
  VERIFY_HEADLESS_SPEC,
} from '../src/cli/commands/verify'

describe('verify helpers', () => {
  it('resolves dsh and pnpm from flags, env, then PATH defaults', () => {
    expect(resolveDsh('C:\\dsh.cmd')).toBe('C:\\dsh.cmd')
    expect(resolvePnpm('C:\\pnpm.cmd')).toBe('C:\\pnpm.cmd')
    expect(resolveDsh(undefined)).toBe('dsh')
    expect(resolvePnpm(undefined)).toBe('pnpm')
  })

  it('treats MISSING_CREDENTIAL on stderr as a keyless success', () => {
    expect(isSmokeOk('', 'dsh: MISSING_CREDENTIAL: no API key')).toBe(true)
    expect(isSmokeOk('', 'plugin tree failed to load')).toBe(false)
    expect(isSmokeOk('ok', '')).toBe(true)
  })

  it('accepts a keyed host whose provider call fails after dispatch', () => {
    // A throwaway DSH_HOME does not isolate credentials -- they live in the OS
    // credential store -- so on a keyed host the smoke reaches the provider and
    // dies there. That still proves the tree loaded and the turn dispatched.
    expect(isSmokeOk('', 'dsh: TRANSPORT: DeepSeek Messages transport failed')).toBe(true)
    // A plugin that never mounted produces no provider traffic and still fails.
    expect(isSmokeOk('', 'web boot: 1 entry did not activate')).toBe(false)
    expect(isSmokeOk('', 'Error: cannot get property "tools" without inject')).toBe(false)
  })

  it('renders step results with pass/fail markers', () => {
    const text = renderVerifySteps('C:\\repo', [
      { step: 'pack', ok: true, detail: 'ok' },
      { step: 'install', ok: false, detail: 'boom' },
    ])
    expect(text).toContain('✓ pack')
    expect(text).toContain('✗ install')
    expect(text).toContain('boom')
  })

  it('pins the same harness line as the compat workflow', () => {
    // Regression guard. The defaults used to sit on 0.1.7-rc.2 while compat.yml
    // had already moved to 0.2.1-alpha.1; because `dsh` enforces install-time
    // compatibility, that made `verify` fail on every newer harness with a
    // message naming the base bundle instead of the plugin under test.
    const compat = readFileSync(join(process.cwd(), '.github', 'workflows', 'compat.yml'), 'utf8')
    for (const spec of [VERIFY_BASE_SPEC, VERIFY_HEADLESS_SPEC]) {
      const version = spec.slice(spec.lastIndexOf('@') + 1)
      expect(version).toMatch(/^\d+\.\d+\.\d+/)
      // The workflow installs `<pkg>@<version>`; the same version must be pinned.
      expect(compat).toContain(`${spec}`)
    }
    expect(compat).toContain(`@deepseek-ai/dsh@${VERIFY_BASE_SPEC.slice(VERIFY_BASE_SPEC.lastIndexOf('@') + 1)}`)
  })
})
