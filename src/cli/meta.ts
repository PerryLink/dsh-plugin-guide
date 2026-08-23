// Package-root resolution and version readout for self-describing output.
import { dirname, join } from 'node:path'
import { readJsonIfExists } from './lib/fs'
import { resolveTemplatesRoot } from './templates'

/** Resolve the installed package root (parent of the templates directory). */
export function resolvePackageRoot(): string {
  return dirname(resolveTemplatesRoot())
}

/** Read the installed package version, falling back to a placeholder. */
export function readCliVersion(): string {
  const pkg = readJsonIfExists<{ version?: string }>(join(resolvePackageRoot(), 'package.json'))
  return pkg?.version ?? '0.0.0'
}
