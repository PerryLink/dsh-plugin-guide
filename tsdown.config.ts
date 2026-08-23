import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: { 'dsh-plugin-dev': 'src/cli/entry.ts' },
  format: ['esm'],
  platform: 'node',
  target: 'node22',
  dts: false,
  clean: true,
  sourcemap: false,
  minify: false,
  outDir: 'dist',
  // With `platform: node` tsdown forces `.mjs`/`.cjs`; disable that so ESM output
  // follows the package `"type": "module"` and emits `dist/dsh-plugin-dev.js`.
  fixedExtension: false,
})
