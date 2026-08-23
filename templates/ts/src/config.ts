import Schema from '@deepseek-ai/schemastery'

// Tunable configuration must be a Schemastery Schema, never a plain object:
// the harness validates it at load time and fails loud on invalid values, and
// every key can be changed from cordis.yml without editing code (guide §3.6).
export interface Config {
  greeting: string
}

export const Config: Schema<Config> = Schema.object({
  greeting: Schema.string().default('Hello').description('Greeting prefix for the echo tool.'),
})
