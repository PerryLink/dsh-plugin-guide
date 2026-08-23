// Dependency-free subprocess runner with a hard timeout and AbortSignal support.
// All long-running external commands (network fetches, package managers, the dsh
// CLI) go through here so they respect `--timeout` and an optional abort signal.
import { spawn } from 'node:child_process'

/** Result of a completed subprocess. */
export interface RunResult {
  /** Exit code; `null` when terminated by a signal or abort. */
  code: number | null
  stdout: string
  stderr: string
  /** True when the timeout aborted the process. */
  timedOut: boolean
  /** Signal name when terminated by a signal, else null. */
  signal: string | null
}

/** Options for {@link run}. */
export interface RunOptions {
  cwd?: string
  env?: Record<string, string | undefined>
  /** Hard wall-clock timeout; the process is killed when exceeded. */
  timeoutMs?: number
  /** External abort signal (e.g. from an HTTP fetch); kills the process on abort. */
  signal?: AbortSignal
}

/**
 * Run a command and capture its output. Uses piped stdio so callers can read
 * logs; the process is terminated on timeout or external abort.
 * @param command - executable name or path.
 * @param args - argument vector.
 * @param options - cwd, env, timeout, and abort signal.
 * @returns the exit code, captured streams, and timeout flag.
 */
export function run(command: string, args: string[], options: RunOptions = {}): Promise<RunResult> {
  return new Promise<RunResult>((resolve) => {
    const controller = new AbortController()
    let timedOut = false
    let settled = false

    const finish = (result: RunResult): void => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      options.signal?.removeEventListener('abort', onAbort)
      resolve(result)
    }

    const timer = options.timeoutMs
      ? setTimeout(() => {
          timedOut = true
          controller.abort(new Error(`command timed out after ${options.timeoutMs}ms`))
        }, options.timeoutMs)
      : undefined

    const onAbort = (): void => controller.abort()
    options.signal?.addEventListener('abort', onAbort)

    const env = { ...process.env }
    for (const [key, value] of Object.entries(options.env ?? {})) {
      if (value === undefined) delete env[key]
      else env[key] = value
    }

    const child = spawnCommand(command, args, {
      cwd: options.cwd,
      env,
      signal: controller.signal,
    })

    let stdout = ''
    let stderr = ''
    child.stdout?.setEncoding('utf8')
    child.stderr?.setEncoding('utf8')
    child.stdout?.on('data', (chunk: string) => {
      stdout += chunk
    })
    child.stderr?.on('data', (chunk: string) => {
      stderr += chunk
    })
    child.on('error', (err: Error) => {
      finish({ code: null, stdout, stderr: `${stderr}\n${err.message}`, timedOut, signal: null })
    })
    child.on('close', (code, signal) => {
      finish({ code, stdout, stderr, timedOut, signal })
    })
  })
}

function spawnCommand(
  command: string,
  args: string[],
  options: { cwd?: string; env: NodeJS.ProcessEnv; signal: AbortSignal },
): ReturnType<typeof spawn> {
  // Windows npm bins (`pnpm`, `dsh`, `npm`) are `.cmd` shims that `spawn` cannot
  // exec directly, so wrap them in the shell with each token quoted.
  if (process.platform === 'win32') {
    return spawn(winCommandLine(command, args), {
      cwd: options.cwd,
      env: options.env,
      stdio: ['ignore', 'pipe', 'pipe'],
      signal: options.signal,
      shell: true,
      windowsHide: true,
    })
  }
  return spawn(command, args, {
    cwd: options.cwd,
    env: options.env,
    stdio: ['ignore', 'pipe', 'pipe'],
    signal: options.signal,
  })
}

function winCommandLine(command: string, args: string[]): string {
  return [command, ...args].map(quoteWin).join(' ')
}

function quoteWin(arg: string): string {
  if (!/[\s"&|<>^()]/.test(arg)) return arg
  return `"${arg.replace(/(["\\])/g, '\\$1')}"`
}

/** Format a run result's streams into a short tail for failure reports. */
export function tailOf(result: RunResult, lines = 40): string {
  const text = `${result.stdout}\n${result.stderr}`.trim()
  const all = text.split(/\r?\n/)
  return all.slice(-lines).join('\n')
}
