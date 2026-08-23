import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { Config } from './config'
import type { Config as ConfigShape } from './config'

export const name = '{{pkgName}}'
export const inject = ['tools']

// Re-export the schema so the loader can validate this plugin's config.
export { Config }

/** Pure greeting builder kept separate from the tool so tests stay keyless. */
export function buildGreeting(greeting: string, text: string): string {
  return `${greeting}: ${text}`
}

// Every registration is an effect: `ctx.tools.register` returns the disposer that
// removes the tool on unload, so the plugin stays hot-reloadable (guide §3.3).
export function apply(ctx: Context, config: ConfigShape): void {
  ctx.tools.register(
    defineTool({
      name: '{{name}}_echo',
      description: 'Echo a greeting back to the caller.',
      parameters: {
        text: { type: 'string', required: true, description: 'Text to echo.' },
      },
      output: {
        schema: { type: 'string' },
        render: (_args, value) => [{ type: 'text', text: value }],
      },
      async execute(args) {
        return buildGreeting(config.greeting, args.text)
      },
    }),
  )
}
