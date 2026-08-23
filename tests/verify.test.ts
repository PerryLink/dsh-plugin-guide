import { describe, expect, it } from 'vitest'
import { isSmokeOk, renderVerifySteps, resolveDsh, resolvePnpm } from '../src/cli/commands/verify'

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

  it('renders step results with pass/fail markers', () => {
    const text = renderVerifySteps('C:\\repo', [
      { step: 'pack', ok: true, detail: 'ok' },
      { step: 'install', ok: false, detail: 'boom' },
    ])
    expect(text).toContain('✓ pack')
    expect(text).toContain('✗ install')
    expect(text).toContain('boom')
  })
})
