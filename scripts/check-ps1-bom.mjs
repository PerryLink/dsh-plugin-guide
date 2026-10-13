// Assert every PowerShell script under scripts/ keeps its UTF-8 BOM.
//
// Why this exists: PowerShell 5.1 (Windows PowerShell - the only shell on a
// machine without pwsh) decodes a BOM-less script as ANSI/CP936. `verify-kit.ps1`
// carries ~1.6 KB of Chinese comments and messages, so the mis-decode corrupts
// the source and the parser fails with "Missing ')' in method call". That is the
// repository's own recorded convention (`references/sources.md`), and on
// 2026-10-13 `verify-kit.ps1` was found to be the only one of nine scripts
// missing its BOM - and therefore unusable on PowerShell 5.1, which was
// invisible to CI because CI runs it under `pwsh`, where a missing BOM is
// harmless.
//
// Deliberately implemented in Node, not PowerShell: it must run on the Linux CI
// runner and on a machine whose only PowerShell is the 5.1 that cannot read the
// file in the first place.

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = join(process.cwd(), 'scripts')
const BOM = [0xef, 0xbb, 0xbf]

/** True when the buffer starts with a UTF-8 BOM. */
function hasBom(buf) {
  return buf.length >= 3 && buf[0] === BOM[0] && buf[1] === BOM[1] && buf[2] === BOM[2]
}

/** Count bytes above ASCII, i.e. how much a mis-decode could corrupt. */
function nonAsciiBytes(buf) {
  let n = 0
  for (const b of buf) if (b > 127) n++
  return n
}

const scripts = readdirSync(dir)
  .filter((f) => f.toLowerCase().endsWith('.ps1'))
  .sort()

const problems = []
const rows = []

for (const file of scripts) {
  const buf = readFileSync(join(dir, file))
  const bom = hasBom(buf)
  const nonAscii = nonAsciiBytes(buf)
  rows.push({ file, bom, nonAscii, bytes: buf.length })
  // A BOM matters most when the file contains non-ASCII text; for a pure-ASCII
  // script a missing BOM is harmless, so report it without failing.
  if (!bom && nonAscii > 0) {
    problems.push(
      `${file}: ${nonAscii} non-ASCII bytes but no UTF-8 BOM - PowerShell 5.1 will mis-decode this script`,
    )
  }
}

for (const r of rows) {
  const flag = !r.bom && r.nonAscii > 0 ? 'FAIL' : r.bom ? 'ok  ' : 'warn'
  console.log(`${flag}  ${r.file.padEnd(34)} bom=${String(r.bom).padEnd(5)} nonAscii=${String(r.nonAscii).padEnd(5)} bytes=${r.bytes}`)
}

if (problems.length > 0) {
  console.error('\nps1-bom: FAIL')
  for (const p of problems) console.error('  ' + p)
  console.error('\nFix: prepend EF BB BF to the file (keep the content byte-identical otherwise).')
  process.exit(1)
}

console.log(`\nps1-bom OK (${scripts.length} scripts; every non-ASCII one carries a BOM)`)
