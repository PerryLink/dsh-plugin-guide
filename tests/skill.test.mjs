import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { apply, splitFrontmatter } from '../index.js'

const root = dirname(dirname(fileURLToPath(import.meta.url)))

test('package is a 0.5.x guide, not the old CLI', () => {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
  assert.equal(pkg.name, 'dsh-plugin-guide')
  assert.match(pkg.version, /^0\.5\./)
  assert.equal(pkg.bin, undefined)
  assert.equal(pkg.dependencies, undefined)
})

test('SKILL.md has the guide identity and routes to docs', () => {
  const text = readFileSync(join(root, 'SKILL.md'), 'utf8')
  const { description, body } = splitFrontmatter(text)
  assert.match(description ?? '', /ENTRY.*FLOW.*BOOST/s)
  assert.match(body, /docs\/levels\.md/)
  assert.match(body, /dsh-standards/)
  assert.match(body, /dsh-primer/)
})

test('three-layer docs exist and keep the non-grade boundary', () => {
  for (const file of ['levels.md', 'entry.md', 'flow.md', 'boost.md']) {
    assert.ok(existsSync(join(root, 'docs', file)), `missing docs/${file}`)
  }
  const levels = readFileSync(join(root, 'docs', 'levels.md'), 'utf8')
  assert.match(levels, /three tracks, not three grades/i)
  assert.match(levels, /not-run.*not.*pass/is)
  assert.match(levels, /no official, certified, verified, audited, secure, recommended, or ranked claim/i)
})

test('old CLI entry points are gone', () => {
  assert.equal(existsSync(join(root, 'bin', 'dsh-plugin-dev.js')), false)
  assert.equal(existsSync(join(root, 'dist')), false)
})

test('docs and package keep the 0.2.2-rc.3 baseline', () => {
  const levels = readFileSync(join(root, 'docs', 'levels.md'), 'utf8')
  assert.match(levels, /0\.2\.2-rc\.3/)
  assert.match(levels, /Cordis `4\.1\.0`/)
  assert.doesNotMatch(levels, /Current baseline \(2026-11-04\)/)

  for (const file of ['README.md', 'README.en.md', 'README.es.md', 'README.pt.md', 'README.hi.md']) {
    const text = readFileSync(join(root, file), 'utf8')
    assert.match(text, /0\.2\.2-rc\.3/, `${file} must carry the rc3 baseline`)
    assert.match(text, /0\.5\.7/, `${file} must carry the published version`)
    assert.doesNotMatch(
      text,
      /\^0\.2\.2-alpha\.3` (union arm|并集臂|brazo de unión|braço de união|यूनियन आर्म)/,
      `${file} must not repeat the stale union-arm claim`,
    )
  }

  const checklist = readFileSync(join(root, 'docs', 'release-checklist.md'), 'utf8')
  assert.match(checklist, /"dsh": ">=0\.2\.2-0 <0\.3\.0"/)
  assert.match(checklist, /--host-version 0\.2\.2-rc\.3/)
  assert.match(checklist, /dsh-standards@1\.6\.11/)
  assert.doesNotMatch(checklist, /dsh-standards@1\.6\.10/)
  assert.match(checklist, /C-2 is judged only when the host version is known/)

  const flow = readFileSync(join(root, 'docs', 'flow.md'), 'utf8')
  assert.match(flow, /dsh-flow-collect/)
  assert.match(flow, /RUNTIME_JOURNEYS` cover \*\*J1, J2, J4, J6\*\*/)
  assert.match(flow, /dsh plugin --profile demo add \./)
  assert.doesNotMatch(flow, /still consumes the flat map/)

  assert.ok(existsSync(join(root, 'docs', 'rc3-notes.md')), 'missing docs/rc3-notes.md')
  const notes = readFileSync(join(root, 'docs', 'rc3-notes.md'), 'utf8')
  for (const id of ['plugin-update-method', 'session-append-overloads', 'window-drag-regions']) {
    assert.match(notes, new RegExp(id), `rc3-notes must index ${id}`)
  }
})

test('package.json files[] only lists files that exist', () => {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
  assert.deepEqual(pkg.dshWorkshop.compatibility.dshVersions, ['0.2.2-rc.3'])
  for (const entry of pkg.files) {
    if (entry.includes('*')) continue
    assert.ok(existsSync(join(root, entry)), `package.json files entry does not exist: ${entry}`)
  }
})

test('apply registers the guide skill with a directory resourceBase', () => {
  let registered
  const ctx = {
    effect(fn) {
      fn()
    },
    skills: {
      register(def) {
        registered = def
      },
    },
  }
  apply(ctx)
  assert.equal(registered.name, 'dsh-plugin-guide')
  assert.match(registered.content, /## The three layers/)
  assert.equal(registered.resourceBase.kind, 'directory')
  assert.equal(registered.resourceBase.path, root)
})
