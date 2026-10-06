import { defineConfig } from 'tsdown'

// tsdown bundles src/index.ts into lib/index.js (ESM) and emits lib/index.d.ts.
// It is also the self-contained `prepare` script for git installs: no project
// references, no type checking (see guide §7.1 "build-script catch").
export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['esm'],
  platform: 'node',
  target: 'node22',
  dts: true,
  clean: true,
  sourcemap: false,
  outDir: 'lib',
  // With `platform: node` tsdown forces `.mjs`/`.cjs`; disable that so ESM output
  // follows the package `"type": "module"` and emits `lib/index.js` +
  // `lib/index.d.ts` — the paths this template's package.json declares. Without
  // this flag the build emits `lib/index.mjs`/`lib/index.d.mts`, `main` resolves
  // to nothing, and the plugin silently never loads.
  fixedExtension: false,
})
