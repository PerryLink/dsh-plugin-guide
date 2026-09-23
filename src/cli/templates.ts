// Scaffold template resolution and rendering.
//
// Templates ship as real files under the package `templates/` directory (kept in
// sync with `references/official-docs`); the scaffolder reads them from disk and
// substitutes `{{token}}` placeholders. The template root is an overridable
// tunable (`DSH_PLUGIN_DEV_TEMPLATES`) with a computed default, never a baked-in
// absolute path.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { writeFileDeep } from './lib/fs'

/** Supported scaffold languages. */
export type TemplateLang = 'ts' | 'js'

/**
 * The canonical `@deepseek-ai/dsh-*` peer range, single-sourced here and
 * substituted into every scaffolded package.json through the
 * `{{dshPeerRange}}` placeholder. Keep it identical to the canonical range in
 * `dsh-plugin-kit/data/peer-range.json`: one clause per prerelease tuple is
 * required by semver's prerelease rule, and the `-0` floor covers the whole
 * 0.1.6 tuple (never the bare `>=0.1.6` form).
 */
export const DSH_PEER_RANGE = '>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0'

/** Placeholder values substituted into template files. */
export interface TemplateContext {
  /** Base plugin name without the `dsh-` prefix (e.g. `hello-plugin`). */
  name: string
  /** Full npm package name (e.g. `dsh-hello-plugin`). */
  pkgName: string
  version: string
  year: string
}

/** Resolve the templates root: env override first, then candidate walks. */
export function resolveTemplatesRoot(): string {
  const env = process.env.DSH_PLUGIN_DEV_TEMPLATES
  if (env) return resolve(env)
  const here = dirname(fileURLToPath(import.meta.url))
  const candidates = [
    join(here, '..', '..', 'templates'), // source: src/cli/lib -> <pkg>/templates
    join(here, '..', 'templates'), // bundled: dist -> <pkg>/templates
    join(here, 'templates'),
  ]
  for (const candidate of candidates) {
    if (existsSync(join(candidate, 'ts')) && existsSync(join(candidate, 'js'))) return resolve(candidate)
  }
  throw new Error('templates directory not found; set DSH_PLUGIN_DEV_TEMPLATES to its path')
}

/** Recursively list relative file paths under a directory. */
function walkFiles(dir: string, base = ''): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${entry.name}` : entry.name
    if (entry.isDirectory()) out.push(...walkFiles(join(dir, entry.name), rel))
    else out.push(rel)
  }
  return out
}

/** Substitute placeholders in template text. */
export function renderTemplate(text: string, context: TemplateContext): string {
  return text
    .replaceAll('{{pkgName}}', context.pkgName)
    .replaceAll('{{name}}', context.name)
    .replaceAll('{{version}}', context.version)
    .replaceAll('{{year}}', context.year)
    .replaceAll('{{dshPeerRange}}', DSH_PEER_RANGE)
}

/** One rendered scaffold file. */
export interface RenderedFile {
  /** Path relative to the scaffold target root. */
  relativePath: string
  content: string
}

/** Render every file of a language template. */
export function renderScaffold(lang: TemplateLang, context: TemplateContext): RenderedFile[] {
  const root = join(resolveTemplatesRoot(), lang)
  const files = walkFiles(root).sort()
  return files.map((rel) => {
    const content = readFileSync(join(root, rel), 'utf8')
    return { relativePath: rel, content: renderTemplate(content, context) }
  })
}

/** Write rendered files under a target directory. */
export function writeScaffold(targetDir: string, files: RenderedFile[]): void {
  for (const file of files) {
    writeFileDeep(join(targetDir, file.relativePath), file.content)
  }
}
