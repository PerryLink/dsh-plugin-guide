import { defineTool } from '@deepseek-ai/dsh-tools'
import Schema from '@deepseek-ai/schemastery'

export const name = '{{pkgName}}'
export const inject = ['tools']

// Tunable configuration must be a Schemastery Schema, never a plain object:
// the harness validates it at load time and fails loud on invalid values, and
// every key can be changed from cordis.yml without editing code (guide §3.6).
export const Config = Schema.object({
  greeting: Schema.string().default('Hello').description('Greeting prefix for the echo tool.'),
})

/** Pure greeting builder kept separate from the tool so tests stay keyless. */
export function buildGreeting(greeting, text) {
  return `${greeting}: ${text}`
}

// Every registration is an effect: `ctx.tools.register` returns the disposer that
// removes the tool on unload, so the plugin stays hot-reloadable (guide §3.3).
export function apply(ctx, config) {
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
