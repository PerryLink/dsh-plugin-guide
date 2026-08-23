// Minimal dependency-free YAML subset parser.
//
// The checker needs to validate `cordis.patch.yml` files without pulling in a
// third-party YAML dependency. This parser intentionally covers the documented
// patch-layer shape only: block sequences, block mappings, plain/single/double
// quoted scalars, booleans/numbers/null, `!!js` tags (kept as literal strings),
// and `#` comments. Flow collections, anchors/aliases, block scalars (`|`/`>`),
// and multi-line scalars are out of scope; a line using them parses as a plain
// string rather than being misread as structure.

/** A parsed YAML value (the supported subset). */
export type YamlValue = null | boolean | number | string | YamlValue[] | { [key: string]: YamlValue }

interface Line {
  indent: number
  text: string
  num: number
}

/**
 * Parse a YAML subset document.
 * @param text - raw YAML text.
 * @returns the parsed value; an empty document is `null`.
 */
export function parseYaml(text: string): YamlValue {
  const lines = tokenize(text)
  const parser = new Parser(lines)
  return parser.parseValue()
}

/** Parse a YAML subset document and require an object root. */
export function parseYamlObject(text: string): { [key: string]: YamlValue } | null {
  const value = parseYaml(text)
  return isObject(value) ? value : null
}

/** True when the value is a mapping. */
export function isObject(value: YamlValue): value is { [key: string]: YamlValue } {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** True when the value is a sequence. */
export function isArray(value: YamlValue): value is YamlValue[] {
  return Array.isArray(value)
}

function tokenize(text: string): Line[] {
  const out: Line[] = []
  const lines = text.split(/\r?\n/)
  for (let n = 0; n < lines.length; n++) {
    const stripped = stripComment(lines[n])
    if (stripped.trim() === '') continue
    out.push({ indent: stripped.length - stripped.trimStart().length, text: stripped.trim(), num: n + 1 })
  }
  return out
}

function stripComment(line: string): string {
  let single = false
  let double = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (single) {
      if (c === "'") single = false
      continue
    }
    if (double) {
      if (c === '\\') {
        i++
        continue
      }
      if (c === '"') double = false
      continue
    }
    if (c === "'") single = true
    else if (c === '"') double = true
    else if (c === '#') return line.slice(0, i)
  }
  return line
}

class Parser {
  private pos = 0
  constructor(private readonly lines: Line[]) {}

  parseValue(): YamlValue {
    if (this.pos >= this.lines.length) return null
    const line = this.lines[this.pos]
    if (isSeqItem(line.text)) return this.parseSequence(line.indent)
    if (isMappingStart(line.text)) return this.parseMapping(line.indent)
    this.pos++
    return parseScalar(line.text)
  }

  private parseSequence(indent: number): YamlValue[] {
    const arr: YamlValue[] = []
    while (this.pos < this.lines.length && this.lines[this.pos].indent === indent && isSeqItem(this.lines[this.pos].text)) {
      const text = this.lines[this.pos].text
      if (text === '-') {
        this.pos++
        arr.push(this.parseValue())
        continue
      }
      const rest = text.slice(2)
      if (rest === '') {
        this.pos++
        arr.push(this.parseValue())
      } else if (isMappingStart(rest)) {
        arr.push(this.parseInlineMapping(rest, indent))
      } else {
        this.pos++
        arr.push(parseScalar(rest))
      }
    }
    return arr
  }

  private parseInlineMapping(firstEntry: string, seqIndent: number): { [key: string]: YamlValue } {
    const map: { [key: string]: YamlValue } = {}
    let entry = firstEntry
    const keyIndent = seqIndent + 2
    while (true) {
      const split = splitKeyValue(entry)
      if (split.value === '') {
        this.pos++
        map[split.key] = this.parseValue()
      } else {
        this.pos++
        map[split.key] = parseScalar(split.value)
      }
      const next = this.lines[this.pos]
      if (
        next
        && next.indent === keyIndent
        && !isSeqItem(next.text)
        && isMappingStart(next.text)
      ) {
        entry = next.text
      } else {
        break
      }
    }
    return map
  }

  private parseMapping(indent: number): { [key: string]: YamlValue } {
    const map: { [key: string]: YamlValue } = {}
    while (
      this.pos < this.lines.length
      && this.lines[this.pos].indent === indent
      && isMappingStart(this.lines[this.pos].text)
      && !isSeqItem(this.lines[this.pos].text)
    ) {
      const entry = this.lines[this.pos].text
      const split = splitKeyValue(entry)
      if (split.value === '') {
        this.pos++
        map[split.key] = this.parseValue()
      } else {
        this.pos++
        map[split.key] = parseScalar(split.value)
      }
    }
    return map
  }
}

function isSeqItem(text: string): boolean {
  return text === '-' || text.startsWith('- ')
}

function isMappingStart(text: string): boolean {
  if (text.endsWith(':')) return true
  return text.includes(': ')
}

function splitKeyValue(text: string): { key: string; value: string } {
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ':' && (i + 1 >= text.length || text[i + 1] === ' ')) {
      return { key: text.slice(0, i).trim(), value: text.slice(i + 1).trim() }
    }
  }
  return { key: text, value: '' }
}

function parseScalar(text: string): YamlValue {
  const t = text.trim()
  if (t === '' || t === '~' || t === 'null' || t === 'Null' || t === 'NULL') return null
  if (t === 'true' || t === 'True' || t === 'TRUE') return true
  if (t === 'false' || t === 'False' || t === 'FALSE') return false
  if (t.startsWith("'") && t.endsWith("'") && t.length >= 2) return t.slice(1, -1).replace(/''/g, "'")
  if (t.startsWith('"') && t.endsWith('"') && t.length >= 2) return unescapeDouble(t.slice(1, -1))
  if (/^-?\d+$/.test(t)) return Number.parseInt(t, 10)
  if (/^-?\d+\.\d+$/.test(t)) return Number.parseFloat(t)
  return t
}

function unescapeDouble(text: string): string {
  return text
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\r/g, '\r')
    .replace(/\\0/g, '\0')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
}
