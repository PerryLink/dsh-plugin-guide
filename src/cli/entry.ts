// Bundled entry point: run the CLI and map the resolved code to the exit status.
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
