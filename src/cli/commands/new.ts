// `dsh-plugin-dev new <name>` — interactive/parameterized plugin scaffolder.
//
// Generates a TypeScript or JavaScript plugin repo skeleton (src/index.ts
// contract template, Schemastery Config, tests, tsdown/vitest, cordis.patch.yml,
// five-language READMEs). Idempotent: it refuses to write into a non-empty
// target unless `--force`, and `--force` only overwrites template-owned files.
import { existsSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { isDir } from '../lib/fs'
import { run } from '../lib/subprocess'
import { renderScaffold, type TemplateLang, writeScaffold } from '../templates'

/** Options for the `new` command. */
export interface NewOptions {
  name: string
  lang: TemplateLang
  dir?: string
  force: boolean
  git: boolean
}

/** Normalized scaffold inputs. */
export interface NormalizedName {
  /** Base plugin name without the `dsh-` prefix. */
  name: string
  /** Full npm package name with the `dsh-` prefix. */
  pkgName: string
}

const NAME_RE = /^[a-z0-9][a-z0-9-]*$/

/** Normalize and validate a user-supplied plugin name. */
export function normalizeName(raw: string): NormalizedName {
  let name = raw.trim()
  if (name.startsWith('@')) {
    const slash = name.indexOf('/')
    if (slash >= 0) name = name.slice(slash + 1)
  }
  if (name.startsWith('dsh-')) name = name.slice(4)
  if (!NAME_RE.test(name)) {
    throw new Error(`invalid plugin name "${raw}": use lowercase letters, digits, and hyphens (e.g. hello-plugin)`)
  }
  return { name, pkgName: `dsh-${name}` }
}

/** True when the directory exists and contains any entry. */
function dirNonEmpty(dir: string): boolean {
  if (!isDir(dir)) return false
  return readdirSync(dir).length > 0
}

/**
 * Run the scaffolder. Returns the target directory path.
 * @param cwd - current working directory.
 * @param options - name, language, target dir, force, and git flags.
 */
export async function runNew(cwd: string, options: NewOptions): Promise<{ targetDir: string; files: number }> {
  const { name, pkgName } = normalizeName(options.name)
  const targetDir = resolve(options.dir ?? join(cwd, name))

  if (dirNonEmpty(targetDir) && !options.force) {
    throw new Error(`target directory already exists and is not empty: ${targetDir} (use --force to overwrite template files)`)
  }

  const year = String(new Date().getFullYear())
  const files = renderScaffold(options.lang, { name, pkgName, version: '0.1.0', year })
  writeScaffold(targetDir, files)

  if (options.git) {
    // Best-effort git init; a missing git binary must not fail the scaffold.
    await initGit(targetDir)
  }

  return { targetDir, files: files.length }
}

async function initGit(targetDir: string): Promise<void> {
  await run('git', ['init'], { cwd: targetDir, timeoutMs: 30_000 })
}

/** Ensure a target directory is a sensible scaffold destination. */
export function validateTargetDir(targetDir: string): void {
  if (!existsSync(targetDir)) return
  if (!isDir(targetDir)) throw new Error(`target exists and is not a directory: ${targetDir}`)
}
