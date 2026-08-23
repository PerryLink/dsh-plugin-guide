// Filesystem helpers with strict temporary-directory lifecycle guarantees.
//
// Red lines honoured here:
//  - the CLI only ever cleans directories it created via `mkdtemp` under the OS
//    temp root (never `~/.dsh`, `%TEMP%` root, drive roots, or any user path);
//  - every temp directory carries a fixed `dsh-pd-` marker prefix, and cleanup
//    asserts both the marker and the temp-root containment before removing.
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, join, resolve, sep } from 'node:path'

/** Fixed temp-dir marker prefix; a security invariant, not a tunable. */
export const TEMP_PREFIX = 'dsh-pd-'

const createdTempDirs = new Set<string>()

/**
 * Create a fresh temporary directory under the OS temp root and track it so only
 * this process can clean it up.
 * @param label - short label embedded in the directory name for diagnostics.
 * @returns the absolute path of the new directory.
 */
export function createTempDir(label: string): string {
  const dir = mkdtempSync(join(tmpdir(), `${TEMP_PREFIX}${label}-`))
  createdTempDirs.add(resolve(dir))
  return dir
}

function assertSafeTempPath(dir: string): string {
  const target = resolve(dir)
  const tempRoot = resolve(tmpdir())
  if (target === tempRoot || !target.startsWith(tempRoot + sep)) {
    throw new Error(`refusing to clean path outside the temp root: ${dir}`)
  }
  if (!basename(target).startsWith(TEMP_PREFIX)) {
    throw new Error(`refusing to clean a non-mkdtemp path: ${dir}`)
  }
  if (!createdTempDirs.has(target)) {
    throw new Error(`refusing to clean an untracked path: ${dir}`)
  }
  return target
}

/** Remove a tracked temp directory created by {@link createTempDir}. */
export function cleanupTempDir(dir: string): void {
  rmSync(assertSafeTempPath(dir), { recursive: true, force: true })
  createdTempDirs.delete(resolve(dir))
}

/** Remove every still-tracked temp directory (best-effort teardown). */
export function cleanupAllTempDirs(): void {
  for (const dir of [...createdTempDirs]) {
    try {
      rmSync(dir, { recursive: true, force: true })
    } catch {
      // teardown is best-effort; the marker check already guarantees the path is ours
    }
    createdTempDirs.delete(dir)
  }
}

/** Read a UTF-8 file, returning `undefined` when it does not exist. */
export function readFileIfExists(path: string): string | undefined {
  try {
    return readFileSync(path, 'utf8')
  } catch {
    return undefined
  }
}

/** Read a JSON file as a structured value, returning `undefined` when absent. */
export function readJsonIfExists<T>(path: string): T | undefined {
  const text = readFileIfExists(path)
  if (text === undefined) return undefined
  try {
    return JSON.parse(text) as T
  } catch {
    return undefined
  }
}

/** Write a UTF-8 file, creating parent directories as needed. */
export function writeFileDeep(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content, 'utf8')
}

/** True when the path exists and is a regular file. */
export function isFile(path: string): boolean {
  try {
    return statSync(path).isFile()
  } catch {
    return false
  }
}

/** True when the path exists and is a directory. */
export function isDir(path: string): boolean {
  try {
    return statSync(path).isDirectory()
  } catch {
    return false
  }
}

/** True when the path exists. */
export function exists(path: string): boolean {
  return existsSync(path)
}

/** List the immediate entry names of a directory, or an empty array when absent. */
export function listDir(path: string): string[] {
  try {
    return readdirSync(path)
  } catch {
    return []
  }
}
