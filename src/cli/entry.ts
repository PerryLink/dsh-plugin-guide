// Bundled entry point: run the CLI and map the resolved code to the exit status.
//
// Seam roles (this package is a CLI that operates on plugins, not a runtime plugin):
// - Service Definition — the `new` command scaffolds the src/index.ts contract
//   template (name/inject/Config/apply) that declares a plugin's public interface.
// - Service Provider — the `verify` command packs the bundle, installs it into a
//   clean mkdtemp DSH_HOME, and starts it, exercising the registration path.
// - Consumer — the CLI command handlers (new/check/verify) consume the dsh/pnpm
//   binaries and the scaffolded repo.
import { main } from './main'

main(process.argv.slice(2)).then(
  (code) => {
    process.exitCode = code
  },
  (err: unknown) => {
    process.stderr.write(`dsh-plugin-dev: ${err instanceof Error ? (err.stack ?? err.message) : String(err)}\n`)
    process.exitCode = 1
  },
)
