// `dsh-plugin-dev check` — static plugin checks with structured JSON output.
//
// Every check carries a `skillRef` linking the owning knowledge-base section so
// an agent can keep auditing manually. Deterministic checks fail the command on
// errors; heuristic red-line checks report warnings that `--strict` promotes to
// failures.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { isFile, readJsonIfExists } from '../lib/fs'
import { buildReport, renderHuman, type CheckReport, type CheckResult } from '../lib/report'
import { skillRefFor } from '../skill-sections'
import { isArray, isObject, parseYaml, type YamlValue } from '../lib/yaml'
import { readCliVersion } from '../meta'

/** Shape of the package.json fields the checker inspects. */
interface PackageJson {
  name?: string
  version?: string
  main?: string
  files?: string[]
  type?: string
  engines?: { node?: string }
  packageManager?: string
  peerDependencies?: Record<string, string>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  dsh?: { bundle?: { patch?: string } }
}

const README_LANGS = ['README.md', 'README.zh.md', 'README.es.md', 'README.pt.md', 'README.hi.md']

const EXCLUDED_DIRS = new Set(['node_modules', '.git', 'dist', 'coverage', 'downloads', '_check'])

/** Options for the check command. */
export interface CheckOptions {
  root: string
  strict: boolean
}

/** Run every check and return the report plus a process exit code. */
export function runCheck(options: CheckOptions): { report: CheckReport; exitCode: number } {
  const root = resolve(options.root)
  const pkg = readJsonIfExists<PackageJson>(join(root, 'package.json'))
  const checks: CheckResult[] = [
    checkPatchValid(root, pkg),
    checkPatchIdsUnique(root, pkg),
    checkManifestBundlePatch(root, pkg),
    checkManifestMain(root, pkg),
    checkManifestPeers(root, pkg),
    checkManifestEngines(root, pkg),
    checkManifestFiles(root, pkg),
    checkManifestPackageManager(root, pkg),
    checkReadmeFiveLangs(root),
    checkReadmeConsistency(root),
    checkRedlinePersonaRole(root),
    checkRedlineWaterfallNext(root),
    checkRedlineNoHardcodedTunables(root),
    checkRedlineEffectRegistration(root),
  ]
  const report = buildReport(root, readCliVersion(), checks)
  const failed = report.summary.failed
  const warned = options.strict ? report.summary.warned : 0
  return { report, exitCode: failed + warned > 0 ? 1 : 0 }
}

/** Render the report to the console in the requested format. */
export function printCheckReport(report: CheckReport, format: 'json' | 'text'): void {
  if (format === 'json') {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
  } else {
    process.stdout.write(`${renderHuman(report)}\n`)
  }
}

// ---- shared helpers ----

function patchPath(root: string, pkg?: PackageJson): string | undefined {
  const pointer = pkg?.dsh?.bundle?.patch
  if (!pointer) return undefined
  return resolve(root, pointer)
}

/**
 * List real source files: the `src/` tree plus root-level JS/ESM entry files.
 * Templates, tests, scripts, references, and generated directories are data or
 * fixtures, never runtime source, so they are excluded from static scans.
 */
function listSourceFiles(root: string): string[] {
  const out: string[] = []
  let rootEntries: string[]
  try {
    rootEntries = readdirSync(root)
  } catch {
    rootEntries = []
  }
  for (const entry of rootEntries) {
    if (/\.(js|mjs|cjs)$/.test(entry)) out.push(join(root, entry))
  }
  const walk = (dir: string): void => {
    let entries: string[]
    try {
      entries = readdirSync(dir)
    } catch {
      return
    }
    for (const entry of entries) {
      if (EXCLUDED_DIRS.has(entry)) continue
      const full = join(dir, entry)
      let stat: ReturnType<typeof statSync>
      try {
        stat = statSync(full)
      } catch {
        continue
      }
      if (stat.isDirectory()) walk(full)
      else if (stat.isFile() && /\.(ts|js|mjs|cjs)$/.test(entry)) out.push(full)
    }
  }
  walk(join(root, 'src'))
  return out
}

function readText(path: string): string | undefined {
  try {
    return readFileSync(path, 'utf8')
  } catch {
    return undefined
  }
}

function collectedImports(sourceFiles: string[]): Set<string> {
  const imports = new Set<string>()
  const re = /(?:from\s+|import\s+|import\s*\(\s*)['"](@deepseek-ai\/[^'"]+)['"]/g
  for (const file of sourceFiles) {
    const text = readText(file)
    if (!text) continue
    let match: RegExpExecArray | null
    while ((match = re.exec(text)) !== null) imports.add(match[1])
  }
  return imports
}

// ---- 1. cordis.patch.yml validity ----

interface PatchRow {
  id?: string
  name?: string
}

function validatePatch(text: string): { errors: string[]; rows: PatchRow[] } {
  const errors: string[] = []
  const rows: PatchRow[] = []
  let value: YamlValue
  try {
    value = parseYaml(text)
  } catch (err) {
    return { errors: [`cannot parse YAML: ${err instanceof Error ? err.message : String(err)}`], rows }
  }
  if (value === null || value === undefined) return { errors: ['empty document'] , rows }
  if (!isArray(value)) return { errors: ['top level must be a YAML sequence of row verbs'] , rows }
  value.forEach((verbEntry, i) => {
    if (!isObject(verbEntry)) {
      errors.push(`entry ${i} must be a mapping like \`- insert:\``)
      return
    }
    const verbs = Object.keys(verbEntry)
    if (verbs.length !== 1) {
      errors.push(`entry ${i} must have exactly one verb key (got ${verbs.length})`)
      return
    }
    const verb = verbs[0]
    const rowsValue = verbEntry[verb]
    if (!isArray(rowsValue)) {
      errors.push(`entry ${i} verb \`${verb}\` must map to a sequence of rows`)
      return
    }
    rowsValue.forEach((row, r) => {
      if (!isObject(row)) {
        errors.push(`row ${i}.${r} must be a mapping`)
        return
      }
      const id = row.id
      const name = row.name
      if (typeof id !== 'string' || id === '') errors.push(`row ${i}.${r} is missing a string \`id\``)
      // `insert` rows add a new module and need a resolvable `name`; override/other
      // verbs only target an existing id.
      if (verb === 'insert' && (typeof name !== 'string' || name === '')) {
        errors.push(`row ${i}.${r} (insert) is missing a string \`name\``)
      }
      rows.push({ id: typeof id === 'string' ? id : undefined, name: typeof name === 'string' ? name : undefined })
    })
  })
  return { errors, rows }
}

function checkPatchValid(root: string, pkg?: PackageJson): CheckResult {
  const ref = skillRefFor('patch-valid')
  const path = patchPath(root, pkg)
  if (!path) {
    return { id: 'patch-valid', severity: 'warning', kind: 'deterministic', status: 'warn', message: 'no dsh.bundle.patch pointer; nothing to validate', skillRef: ref }
  }
  if (!isFile(path)) {
    return { id: 'patch-valid', severity: 'error', kind: 'deterministic', status: 'fail', message: `patch file not found: ${path}`, skillRef: ref }
  }
  const { errors } = validatePatch(readText(path) ?? '')
  if (errors.length > 0) {
    return { id: 'patch-valid', severity: 'error', kind: 'deterministic', status: 'fail', message: 'cordis.patch.yml is invalid', skillRef: ref, detail: errors }
  }
  return { id: 'patch-valid', severity: 'error', kind: 'deterministic', status: 'pass', message: 'cordis.patch.yml parses and every row is well-formed', skillRef: ref }
}

function checkPatchIdsUnique(root: string, pkg?: PackageJson): CheckResult {
  const ref = skillRefFor('patch-ids-unique')
  const path = patchPath(root, pkg)
  if (!path || !isFile(path)) {
    return { id: 'patch-ids-unique', severity: 'error', kind: 'deterministic', status: 'skip', message: 'no patch file to check for duplicate ids', skillRef: ref }
  }
  const { rows } = validatePatch(readText(path) ?? '')
  const seen = new Map<string, number>()
  const dupes: string[] = []
  rows.forEach((row, i) => {
    if (!row.id) return
    if (seen.has(row.id)) dupes.push(`id "${row.id}" repeated at row ${seen.get(row.id)} and row ${i}`)
    else seen.set(row.id, i)
  })
  if (dupes.length > 0) {
    return { id: 'patch-ids-unique', severity: 'error', kind: 'deterministic', status: 'fail', message: 'duplicate row ids in cordis.patch.yml', skillRef: ref, detail: dupes }
  }
  return { id: 'patch-ids-unique', severity: 'error', kind: 'deterministic', status: 'pass', message: `row ids are unique (${rows.length} rows)`, skillRef: ref }
}

// ---- 3-8. package.json metadata ----

function checkManifestBundlePatch(root: string, pkg?: PackageJson): CheckResult {
  const ref = skillRefFor('manifest-bundle-patch')
  const pointer = pkg?.dsh?.bundle?.patch
  if (!pointer) {
    return { id: 'manifest-bundle-patch', severity: 'warning', kind: 'deterministic', status: 'warn', message: 'no dsh.bundle.patch declared (pure cordis plugin, no bundle layer)', skillRef: ref }
  }
  const path = resolve(root, pointer)
  if (!isFile(path)) {
    return { id: 'manifest-bundle-patch', severity: 'error', kind: 'deterministic', status: 'fail', message: `dsh.bundle.patch points at a missing file: ${pointer}`, skillRef: ref }
  }
  return { id: 'manifest-bundle-patch', severity: 'error', kind: 'deterministic', status: 'pass', message: `dsh.bundle.patch resolves to ${pointer}`, skillRef: ref }
}

function checkManifestMain(root: string, pkg?: PackageJson): CheckResult {
  const ref = skillRefFor('manifest-main')
  const main = pkg?.main
  if (!main) {
    return { id: 'manifest-main', severity: 'error', kind: 'deterministic', status: 'fail', message: 'package.json has no `main` entry', skillRef: ref }
  }
  if (!isFile(join(root, main))) {
    return { id: 'manifest-main', severity: 'warning', kind: 'deterministic', status: 'warn', message: `main entry not built yet: ${main} (run the build first)`, skillRef: ref }
  }
  return { id: 'manifest-main', severity: 'error', kind: 'deterministic', status: 'pass', message: `main entry present: ${main}`, skillRef: ref }
}

function checkManifestPeers(root: string, pkg?: PackageJson): CheckResult {
  const ref = skillRefFor('manifest-peers')
  const peers = pkg?.peerDependencies ?? {}
  const imports = collectedImports(listSourceFiles(root))
  const harnessImports = [...imports].filter((i) => i.startsWith('@deepseek-ai/'))
  if (harnessImports.length === 0) {
    return { id: 'manifest-peers', severity: 'info', kind: 'deterministic', status: 'pass', message: 'no @deepseek-ai/* packages imported; peers are optional', skillRef: ref }
  }
  const expected: Record<string, string> = {}
  for (const imp of harnessImports) {
    if (imp === '@deepseek-ai/cordis') expected[imp] = '^4.0.1'
    else if (imp === '@deepseek-ai/schemastery') expected[imp] = '^3.18.0'
    else if (imp.startsWith('@deepseek-ai/dsh-')) expected[imp] = '>=0.1.0-rc.8 <0.2.0'
  }
  const problems: string[] = []
  for (const [pkgName, range] of Object.entries(expected)) {
    const declared = peers[pkgName]
    if (!declared) problems.push(`imports ${pkgName} but declares no peerDependency`)
    else if (declared !== range) problems.push(`peerDependency ${pkgName} should be "${range}", found "${declared}"`)
  }
  if (problems.length > 0) {
    return { id: 'manifest-peers', severity: 'error', kind: 'deterministic', status: 'fail', message: 'harness imports without a matching peerDependency', skillRef: ref, detail: problems }
  }
  return { id: 'manifest-peers', severity: 'error', kind: 'deterministic', status: 'pass', message: `peerDependencies align with harness imports (${Object.keys(expected).length})`, skillRef: ref }
}

function checkManifestEngines(_root: string, pkg?: PackageJson): CheckResult {
  const ref = skillRefFor('manifest-engines')
  const node = pkg?.engines?.node
  if (!node) {
    return { id: 'manifest-engines', severity: 'error', kind: 'deterministic', status: 'fail', message: 'package.json has no engines.node', skillRef: ref }
  }
  const has22 = /\b22\b/.test(node)
  const has24 = /\b24\b/.test(node)
  if (!has22 || !has24) {
    return { id: 'manifest-engines', severity: 'error', kind: 'deterministic', status: 'fail', message: `engines.node "${node}" should allow Node 22 and 24 (^22.19.0 || >=24.0.0)`, skillRef: ref }
  }
  return { id: 'manifest-engines', severity: 'error', kind: 'deterministic', status: 'pass', message: `engines.node "${node}" covers Node 22 and 24`, skillRef: ref }
}

function checkManifestFiles(_root: string, pkg?: PackageJson): CheckResult {
  const ref = skillRefFor('manifest-files')
  const files = pkg?.files
  if (!files || files.length === 0) {
    return { id: 'manifest-files', severity: 'warning', kind: 'deterministic', status: 'warn', message: 'no `files` whitelist; npm will publish everything', skillRef: ref }
  }
  const patchFile = pkg?.dsh?.bundle?.patch?.replace(/^\.\//, '') ?? 'cordis.patch.yml'
  const main = pkg?.main
  const problems: string[] = []
  if (!files.includes(patchFile)) problems.push(`files whitelist is missing the patch file "${patchFile}"`)
  if (main && !files.includes(main) && !files.some((f) => main.startsWith(`${f.replace(/\/$/, '')}/`))) {
    problems.push(`files whitelist is missing the main entry "${main}"`)
  }
  const hasArtifactDir = files.some((f) => f === 'lib' || f === 'dist')
  if (!hasArtifactDir) problems.push('files whitelist has no built-artifact directory (`lib` or `dist`)')
  if (problems.length > 0) {
    return { id: 'manifest-files', severity: 'error', kind: 'deterministic', status: 'fail', message: 'files whitelist incomplete', skillRef: ref, detail: problems }
  }
  return { id: 'manifest-files', severity: 'error', kind: 'deterministic', status: 'pass', message: 'files whitelist includes patch, entry, and built artifacts', skillRef: ref }
}

function checkManifestPackageManager(_root: string, pkg?: PackageJson): CheckResult {
  const ref = skillRefFor('manifest-package-manager')
  const pm = pkg?.packageManager
  if (pm === 'pnpm@11.7.0') {
    return { id: 'manifest-package-manager', severity: 'warning', kind: 'deterministic', status: 'pass', message: 'packageManager pinned to pnpm@11.7.0', skillRef: ref }
  }
  if (pm) {
    return { id: 'manifest-package-manager', severity: 'warning', kind: 'deterministic', status: 'warn', message: `packageManager is "${pm}"; the family standard is pnpm@11.7.0`, skillRef: ref }
  }
  return { id: 'manifest-package-manager', severity: 'warning', kind: 'deterministic', status: 'warn', message: 'packageManager not pinned; add "pnpm@11.7.0" for reproducible installs', skillRef: ref }
}

// ---- 9-10. five-language README ----

function checkReadmeFiveLangs(root: string): CheckResult {
  const ref = skillRefFor('readme-five-langs')
  const missing: string[] = []
  for (const lang of README_LANGS) {
    const path = join(root, lang)
    if (!isFile(path)) missing.push(lang)
    else if ((readText(path) ?? '').trim() === '') missing.push(`${lang} (empty)`)
  }
  const missingEn = missing.includes('README.md')
  const missingOthers = missing.filter((m) => m !== 'README.md')
  if (missingEn) {
    return { id: 'readme-five-langs', severity: 'error', kind: 'deterministic', status: 'fail', message: 'README.md (English source) is missing', skillRef: ref, detail: missing }
  }
  if (missingOthers.length > 0) {
    return { id: 'readme-five-langs', severity: 'warning', kind: 'deterministic', status: 'warn', message: 'five-language README incomplete', skillRef: ref, detail: missingOthers }
  }
  return { id: 'readme-five-langs', severity: 'error', kind: 'deterministic', status: 'pass', message: 'all five README languages present', skillRef: ref }
}

function headingsOf(text: string): string[] {
  return text
    .split(/\r?\n/)
    .filter((line) => line.startsWith('## '))
    .map((line) => line.slice(3).trim())
}

function checkReadmeConsistency(root: string): CheckResult {
  const ref = skillRefFor('readme-consistency')
  const existing = README_LANGS.filter((lang) => isFile(join(root, lang)))
  if (existing.length < 2) {
    return { id: 'readme-consistency', severity: 'warning', kind: 'deterministic', status: 'skip', message: 'fewer than two READMEs; nothing to compare', skillRef: ref }
  }
  const base = headingsOf(readText(join(root, 'README.md')) ?? '')
  const mismatches: string[] = []
  for (const lang of existing.slice(1)) {
    const headings = headingsOf(readText(join(root, lang)) ?? '')
    const missing = base.filter((h) => !headings.includes(h))
    if (missing.length > 0) mismatches.push(`${lang} is missing headings: ${missing.join(', ')}`)
  }
  if (mismatches.length > 0) {
    return { id: 'readme-consistency', severity: 'warning', kind: 'deterministic', status: 'warn', message: 'README headings drifted across languages', skillRef: ref, detail: mismatches }
  }
  return { id: 'readme-consistency', severity: 'warning', kind: 'deterministic', status: 'pass', message: `README headings match across ${existing.length} languages`, skillRef: ref }
}

// ---- 11-14. engineering red-line patterns (heuristic) ----

/** Body of SKILL.md after its YAML frontmatter, or undefined. */
function skillBody(root: string): string | undefined {
  const text = readText(join(root, 'SKILL.md'))
  if (!text) return undefined
  if (!text.startsWith('---\n')) return text
  const end = text.indexOf('\n---', 4)
  if (end < 0) return text
  return text.slice(end + 4).replace(/^\n+/, '')
}

function checkRedlinePersonaRole(root: string): CheckResult {
  const ref = skillRefFor('redline-persona-role')
  const body = skillBody(root)
  const problems: string[] = []
  if (body !== undefined) {
    const paragraphs = body.split(/\r?\n\s*\r?\n/)
    const firstContentPara = paragraphs.find((p) => !/^\s*#/.test(p)) ?? ''
    const firstLine = firstContentPara.split(/\r?\n/)[0] ?? ''
    const hasSentenceEnd = /[.。?!]/.test(firstLine)
    if (!hasSentenceEnd) problems.push('SKILL.md instruction body does not open with a role sentence')
    else if (firstLine.length > 200) problems.push('SKILL.md opening role sentence is longer than 200 characters')
    if (firstContentPara.length > 600) problems.push('SKILL.md first paragraph is a wall of text; keep injected persona paragraphs short')
  }
  // Scan source for systemPrompt.section(...) string arguments that are long.
  for (const file of listSourceFiles(root)) {
    const text = readText(file) ?? ''
    const re = /systemPrompt\.section\(\s*['"][^'"]*['"]\s*,\s*`([^`]+)`/g
    let match: RegExpExecArray | null
    while ((match = re.exec(text)) !== null) {
      const content = match[1]
      if (content.length > 400) problems.push(`${relativePath(root, file)}: injected systemPrompt section is a wall of text`)
    }
  }
  if (problems.length > 0) {
    return { id: 'redline-persona-role', severity: 'warning', kind: 'heuristic', status: 'warn', message: 'injected persona/prompt paragraphs should open with a short role sentence', skillRef: ref, detail: problems }
  }
  if (body === undefined) {
    return { id: 'redline-persona-role', severity: 'warning', kind: 'heuristic', status: 'skip', message: 'no SKILL.md or systemPrompt section found to inspect', skillRef: ref }
  }
  return { id: 'redline-persona-role', severity: 'warning', kind: 'heuristic', status: 'pass', message: 'persona paragraphs open with a short role sentence', skillRef: ref }
}

function checkRedlineWaterfallNext(root: string): CheckResult {
  const ref = skillRefFor('redline-waterfall-next')
  const flagged: string[] = []
  for (const file of listSourceFiles(root)) {
    const text = readText(file) ?? ''
    if (!text.includes('waterfall')) continue
    if (!text.includes('next')) {
      flagged.push(`${relativePath(root, file)}: mentions waterfall but never calls next()`)
    }
  }
  if (flagged.length > 0) {
    return { id: 'redline-waterfall-next', severity: 'warning', kind: 'heuristic', status: 'warn', message: 'possible waterfall listener missing next()', skillRef: ref, detail: flagged }
  }
  const any = listSourceFiles(root).some((f) => (readText(f) ?? '').includes('waterfall'))
  if (!any) {
    return { id: 'redline-waterfall-next', severity: 'warning', kind: 'heuristic', status: 'skip', message: 'no waterfall listeners found', skillRef: ref }
  }
  return { id: 'redline-waterfall-next', severity: 'warning', kind: 'heuristic', status: 'pass', message: 'waterfall listeners call next()', skillRef: ref }
}

function checkRedlineNoHardcodedTunables(root: string): CheckResult {
  const ref = skillRefFor('redline-no-hardcoded-tunables')
  const files = listSourceFiles(root)
  const plainObjectConfigs: string[] = []
  const schemaConfigs: string[] = []
  for (const file of files) {
    const text = readText(file) ?? ''
    if (/export\s+const\s+Config\s*=\s*\{/.test(text)) plainObjectConfigs.push(relativePath(root, file))
    if (/export\s+const\s+Config\s*=\s*Schema\./.test(text)) schemaConfigs.push(relativePath(root, file))
  }
  if (plainObjectConfigs.length > 0) {
    return { id: 'redline-no-hardcoded-tunables', severity: 'error', kind: 'heuristic', status: 'fail', message: 'Config is a plain object; it must be a Schemastery Schema', skillRef: ref, detail: plainObjectConfigs }
  }
  if (schemaConfigs.length === 0) {
    return { id: 'redline-no-hardcoded-tunables', severity: 'warning', kind: 'heuristic', status: 'skip', message: 'no Config schema found to inspect', skillRef: ref }
  }
  return { id: 'redline-no-hardcoded-tunables', severity: 'warning', kind: 'heuristic', status: 'pass', message: `Config uses Schemastery Schema (${schemaConfigs.length} file(s))`, skillRef: ref }
}

function checkRedlineEffectRegistration(root: string): CheckResult {
  const ref = skillRefFor('redline-effect-registration')
  const files = listSourceFiles(root)
  const manualTeardown: string[] = []
  for (const file of files) {
    const text = readText(file) ?? ''
    if (/removeListener\(|removeAllListeners\(|\.off\(/.test(text)) {
      manualTeardown.push(`${relativePath(root, file)}: manual event-listener teardown detected; registrations must be reversible via ctx.effect()/disposer`)
    }
  }
  if (manualTeardown.length > 0) {
    return { id: 'redline-effect-registration', severity: 'warning', kind: 'heuristic', status: 'warn', message: 'possible non-effect manual teardown', skillRef: ref, detail: manualTeardown }
  }
  return { id: 'redline-effect-registration', severity: 'warning', kind: 'heuristic', status: 'pass', message: 'no manual teardown patterns detected', skillRef: ref }
}

function relativePath(root: string, file: string): string {
  return file.replace(root.replace(/[\\/]$/, ''), '').replace(/^[\\/]/, '')
}
