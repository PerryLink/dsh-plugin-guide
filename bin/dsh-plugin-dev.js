#!/usr/bin/env node
// dsh-plugin-dev CLI entry shim. The real implementation is the tsdown-bundled
// `dist/dsh-plugin-dev.js` (built by `pnpm run build` / `prepack`). Keeping this
// shim as a stable path lets the bin stay fixed while the bundle filename may
// change across tsdown versions.
import '../dist/dsh-plugin-dev.js'
