// Structured JSON report for the `check` command, consumable by CI.
//
// Schema (schemaVersion 1): a `checks` array where every entry carries a stable
// `id`, a `severity` (`error`|`warning`|`info`), a `kind`
// (`deterministic`|`heuristic`), a `status` (`pass`|`fail`|`warn`|`skip`), a
// human `message`, and a `skillRef` linking back to the knowledge base so an
// agent can keep auditing manually.

/** Severity of a single check. */
export type Severity = 'error' | 'warning' | 'info'
/** Whether a check is a hard deterministic rule or a best-effort heuristic. */
export type CheckKind = 'deterministic' | 'heuristic'
/** Outcome of a single check. */
export type CheckStatus = 'pass' | 'fail' | 'warn' | 'skip'

/** A citation into the bundled skill/knowledge base. */
export interface SkillRef {
  file: string
  section: string
  heading: string
}

/** One check result. */
export interface CheckResult {
  id: string
  severity: Severity
  kind: CheckKind
  status: CheckStatus
  message: string
  skillRef: SkillRef
  /** Optional extra detail (file paths, offending lines). */
  detail?: string[]
}

/** The full JSON report. */
export interface CheckReport {
  schemaVersion: 1
  cli: 'dsh-plugin-dev'
  version: string
  target: string
  ok: boolean
  summary: { passed: number; failed: number; warned: number; skipped: number }
  checks: CheckResult[]
}

/** Aggregate a list of checks into a report, deriving `ok` from errors. */
export function buildReport(target: string, version: string, checks: CheckResult[]): CheckReport {
  const summary = {
    passed: checks.filter((c) => c.status === 'pass').length,
    failed: checks.filter((c) => c.status === 'fail').length,
    warned: checks.filter((c) => c.status === 'warn').length,
    skipped: checks.filter((c) => c.status === 'skip').length,
  }
  const ok = summary.failed === 0
  return { schemaVersion: 1, cli: 'dsh-plugin-dev', version, target, ok, summary, checks }
}

/** Render a check list as a human-readable line-oriented report. */
export function renderHuman(report: CheckReport): string {
  const lines: string[] = []
  lines.push(`target: ${report.target}`)
  lines.push(`result: ${report.ok ? 'OK' : 'FAILED'} (${report.summary.passed} passed, ${report.summary.failed} failed, ${report.summary.warned} warned, ${report.summary.skipped} skipped)`)
  lines.push('')
  for (const check of report.checks) {
    const icon = check.status === 'pass' ? '✓' : check.status === 'fail' ? '✗' : check.status === 'warn' ? '!' : '-'
    lines.push(`${icon} [${check.id}] (${check.severity}/${check.kind}) ${check.message}`)
    lines.push(`    skill: ${check.skillRef.file} ${check.skillRef.section} — ${check.skillRef.heading}`)
    for (const detail of check.detail ?? []) lines.push(`      ${detail}`)
  }
  return lines.join('\n')
}
