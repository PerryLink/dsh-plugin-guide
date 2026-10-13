// Type declarations for the bundle entry point (`index.js`).
//
// `index.js` is plain ESM JavaScript and is intentionally not part of the
// TypeScript program (`tsconfig.json` includes only `src`, `tests` and the build
// configs, with `allowJs` off). `tests/entry.test.ts` imports it, so without this
// file `noImplicitAny` rejects the import as an untyped module.
//
// The declaration is deliberately loose: this module exists to be loaded by the
// host's Cordis loader, not consumed as a typed library, and the shapes it
// touches (`ctx.effect`, `ctx.skills.register`) belong to the harness rather
// than to this package. Pinning them here would create a second, drifting copy
// of the host contract — the exact failure mode `guide/family-toolchain.md`
// warns about. The test asserts the runtime shape instead.

/** Cordis plugin name contributed by this bundle. */
export declare const name: string

/** Services this plugin requires before `apply` runs. */
export declare const inject: string[]

/**
 * Split a SKILL.md document into its frontmatter description and instruction
 * body. Falls back to `{ description: undefined, body: text }` when there is no
 * well-formed frontmatter block. Tolerates both LF and CRLF line endings.
 */
export declare function splitFrontmatter(text: string): {
  description: string | undefined
  body: string
}

/** Register the knowledge-base skill. Registration is an effect. */
export declare function apply(ctx: any): void
