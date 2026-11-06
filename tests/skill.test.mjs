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
