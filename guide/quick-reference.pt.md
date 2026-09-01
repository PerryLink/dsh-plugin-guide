# Folha de consulta de plugins do DeepSeek Harness

> Referência rápida de uma página. Detalhes: [plugin-dev-guide.md](plugin-dev-guide.md) (chinês) e [references](../references/).
> Outros idiomas: [English](quick-reference.md) · [中文](quick-reference.zh-CN.md) · [Español](quick-reference.es.md) · [हिन्दी](quick-reference.hi.md)

## Esqueleto do plugin

```ts
import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'
import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'my-plugin'          // obrigatório
export const inject = ['tools']          // serviços necessários; omita se não houver

export interface Config { limit: number }
export const Config: Schema<Config> = Schema.object({
  limit: Schema.number().default(10),    // schema Schemastery, não um objeto simples
})

export function apply(ctx: Context, config: Config) {
  ctx.effect(() => {                     // registro = efeito, desfeito ao descarregar
    const timer = setInterval(() => {}, 1000)
    return () => clearInterval(timer)
  })
  ctx.on('tools/result', (exec, result) => { /* ... */ })
  ctx.tools.register(defineTool({
    name: 'my_tool',
    description: '…',
    parameters: { x: { type: 'string', required: true } },
    output: { schema: { type: 'string' }, render: (_a, v) => [{ type: 'text', text: v }] },
    async execute(args, exec) { return `hi ${args.x}` },  // respeite exec.signal
  }))
}
```

Outras formas: objeto `export default { name, inject, apply }`; classe `class X extends Service { static inject=[...]; constructor(ctx){ super(ctx,'key') } }` (use ao fornecer um serviço).

## API principal do ctx (Cordis)

| Finalidade | API |
|---|---|
| Registrar recurso + limpeza | `ctx.effect(() => disposer)` |
| Ouvir eventos | `ctx.on(name, handler)` (limpeza automática) |
| Transmissão / sem retorno | `ctx.emit(name, payload)` |
| Valor com curto-circuito | `ctx.bail(name, input)` (o primeiro não-null/false/undefined vence) |
| Valor ordenado | `await ctx.serial(name, input)` |
| Pipeline | `await ctx.waterfall(name, input, init)`; listeners **devem chamar `next()`** |
| Contextos filhos | `ctx.extend(meta)` / `ctx.isolate(name, label?)` / `ctx.intercept(name, config)` |
| Montar plugin filho | `ctx.plugin(plugin)` → Fiber; `await fiber.dispose()` |
| Consulta de serviço opcional | `ctx.get('metrics')?.x()` |
| Logging | `ctx.logger(name)` |

Ciclo de vida: `PENDING → LOADING → ACTIVE` (apply lança erro → FAILED); `ACTIVE → UNLOADING → DISPOSED`. Se um serviço necessário desaparece, o plugin descarrega; recarrega quando o serviço volta.

## Modos de despacho de eventos + bail

| Modo | await | Ordem | Valor de retorno |
|---|---|---|---|
| emit | não | ordem de registro | nenhum |
| waterfall | não | ordem de registro | sim (**não chamar `next()` causa curto-circuito**) |
| parallel | sim | paralelo | nenhum |
| serial | sim | ordem de registro | sim (o primeiro não vazio para) |

Eventos tipados (declaration merging):

```ts
declare module '@deepseek-ai/cordis' {
  interface Events { 'my/event': (p: { id: string }) => void }
  interface Context { myService: MyService }   // ao fornecer um serviço
}
```

## cordis.yml / camadas

```yaml
# scratch-plugin/cordis.yml (overlay --patch)
- insert:
    - id: hello
      name: '/absolute/path/to/scratch-plugin/src/my-plugin.ts'
      config: { greeting: 'Hi' }

# bundle: "dsh": {"bundle":{"patch":"./cordis.patch.yml"}} no package.json
# profile: "dsh": {"profile":{"bundles":["@deepseek-ai/dsh-base","my-bundle"]}}
# ordem efetiva: bundles → cordis.patch.yml do profile → $DSH_HOME/cordis.patch.yml → --patch
# sobrescrita por id; a linha config inteira é substituída (sem deep merge) — repita todas as chaves
# !!js avalia após os serviços injetados ativarem; disabled é avaliado em cada montagem
```

Comandos: `dsh --profile web` · `dsh --profile headless "task"` · `dsh --profile X --dump-config` · `dsh plugin --profile X add/remove <pkg>` · `pnpm dsh web --patch ./scratch-plugin/cordis.yml`

Canais de instalação (repository-plugin removido em 0811 — restam apenas dois):
- **plugin bundle** (`"dsh":{"bundle":{"patch":"..."}}`) → `dsh plugin add <pkg>` entra na pilha `dsh.profile.bundles`; efeito após reiniciar.
- **plugin cordis simples** (sem `dsh.bundle`) → `dsh plugin add <pkg>` instala a dependência + uma linha insert no `cordis.patch.yml` do profile; **HMR de configuração ao vivo**.
- fonte git: `dsh plugin add "github:owner/repo#<sha>&path:<subdir>"` (fixe o commit; build `prepare` autocontido + `allowBuilds` no `pnpm-workspace.yaml` do profile; npm/tarball dispensa permissão de build).

## Serviços internos comuns (chaves do ctx)

`sessions` registro de sessão · `systemPrompt` montagem de prompts · `tools` registro de ferramentas + pipeline protegido · `agents` registro de agentes · `agentLoop` driver do loop · `llm` registro de adaptadores · `skills` registro de skills · `commands` comandos slash · `approval` aprovação única · `jobs` trabalhos em segundo plano · `fs` seam de sistema de arquivos · `shell` seam de execução bash · `subprocess` seam de subprocessos · `terminals` PTY · `sandbox` seam de confinamento · `codeRuntime` execução de código · `sessionPersistence` persistência · `settings` / `credentials` / `workspaceRegistry` / `goals` / `planMode` / `subagents` / `workflowEngine` / `storage`.
Lista completa e assinaturas exatas → `references/official-docs/docs/capability-seams.md` + `docs/subsystems/*.md` (regiões Cordis API geradas).

## Pipeline de políticas de ferramentas (ordem de execução)

```
tools/pre-execute (waterfall, allow|deny|ask) → ctx.tools.guard() (negação monótona)
→ tools/execute (wrapper; apenas exec.signal substituível) → execute(args, exec)
→ tools/post-execute (substituir content/value, bloquear, anexar contexto) → finalizeContent
→ tools/result (somente observação) → tool/result durável (evento de sessão)
```

Seleção: portões de política → pre-execute; negação irreversível → guard; timeout/retentativas/métricas → execute; transformar resultados → post-execute; auditoria/coleta → result.
Code Mode: `await tools.<name>(args)` vem de graça; sucesso = valor JSON canônico final; falha = `ToolCallError(name, toolName, message)`.

## Cartões de UI (funções puras! apenas args(+result) — sem I/O/relógio/aleatório)

- `presentCall(args)` → `{card:'generic',title,kind?,rawInput?,content?,locations?}` | `{card:'terminal',title,description?,cwd?}` | `{card:'diff',title,diffs,locations?}`
- `presentResult(args,{content,isError,meta?})` → generic / terminal / diff / search(`shape:'matches'|'paths'`) / read / web(`kind:'search'|'fetch'`)
- Metadados de replay: `output.presentationMeta(args, value)` → persistido em `tool/result.meta`

## Modelo de seam de capacidade de três papéis

Definition (`dsh-my-cap`): `export abstract class MyCapService extends Service { constructor(ctx){super(ctx,'myCap')} abstract execute(req): Promise<res> }` + declaration merging de Context.
Provider (`dsh-my-cap-local`): `export function apply(ctx){ ctx.plugin(class MyCapLocal extends MyCapService {...}) }`.
Consumer (`dsh-tool-my-cap`): `inject = ['tools','myCap']`, `ctx.tools.register(defineTool({... execute: args => ctx.myCap.execute(...)}))`.
Regras: não divida prematuramente; Provider e Consumer nunca dependem um do outro; padrões resolvem explicitamente em `resolve(request): Spec`.

## Essenciais do adaptador LLM

`class MyAdapter extends LlmAdapter { async *stream(options): AsyncIterable<StreamChunk> }` → `ctx.llm.registerAdapter(['provider'], adapter)`.
Protocolo de chunks: `block-start` → `text-delta*` → `block-end` (bloco completo) → … → `usage` (antes de finish) → `finish` (último; `reason: {kind:'stop'|'tool-calls'}`). Lance `LlmError` com código estável para campos que você não puder atender.

## Regras rígidas (violações = falhas de gate / comportamento errado)

1. Todo registro passa por `ctx.effect()` / `ctx.on()` / o `register()` de um serviço (retorna disposer).
2. Listeners de waterfall devem chamar `next()`; não chamar causa curto-circuito por design.
3. Visível-para-o-modelo ⇔ registrado: nova entrada visível exige novo evento de sessão (`SessionEventMap`).
4. Nunca codifique valores ajustáveis (teste: o cordis.yml consegue mudá-los?); má configuração falha em voz alta.
5. Pacotes de plugin independentes: cordis é peerDependency com a mesma identidade do host (misturar scoped `@deepseek-ai/cordis` e unscoped divide identidades); ESM; manifesto `dsh.bundle`; instalações git precisam de `prepare` + `allowBuilds`; publique `lib/` ou um tarball.
6. Documentação bilíngue em pares; descrições/prompts são comportamento; mudanças não triviais levam Agent Note; rode o conjunto mínimo de verificações antes de empurrar (dsh-pre-push-checks).
7. IDs opacos entre limites são branded (`Branded<B>` de `dsh-brand`), nunca `string` crua.
8. Membros de `SessionEventMap` são required-on-read: o envelope `ignorable` desaparece no 0.1.2-alpha.1 (a leitura falha fechada — um build que não conhece um tipo de evento recusa o log), e appends de eventos próprios de plugins cruzam uma porta adaptativa que para de gravar em hosts sem envelope; 0.1.2-alpha.3 mantém o campo ignorable?: true apenas para compatibilidade de leitura de logs armazenados (seu Session.append ainda não consegue estampar o marcador), então a porta continua sem gravar (sem mudança de comportamento). Apenas mudanças de formato estrutural bumpam `SESSION_FORMAT_VERSION`. O switch sobre `SessionEvent` cai num `default` documentado — sem `assertNever` (união merge-extensible).

## Lista rápida de armadilhas da comunidade (detalhes: guia §7.3 / community-repo-deep-dive.md)

- Trio do tsconfig: `moduleResolution: bundler` + `allowImportingTsExtensions` + `rewriteRelativeImportExtensions` (+ `lib:["ES2024"]`, `types:["node"]` explícito).
- `tsc` emite apesar de erros → `tsc || exit 1` / `--noEmitOnError`; procure imports `.ts` residuais no build antes de publicar.
- Junctions do Windows via PowerShell `New-Item -ItemType Junction`; letra de unidade do vitest em maiúscula `C:/`.
- `DSH_PERMISSION_MODE=danger-full-access` é de alto risco (sem backend de sandbox no Windows, aprovações desativadas); `DSH_*` em `~/.dsh/.env` quebra a inicialização.
- Arquivos de sessão são zstd multiframe: use `scanZstdFrames`/`createZstdFrameDecoder` (`@deepseek-ai/dsh-session-persistence-jsonl/src/zstd.ts`).
- npm: o `dsh` sem escopo é o projeto alheio node-dsh (um shell) — instale `@deepseek-ai/dsh`; `@deepseek-ai/dsh-tools` e `@deepseek-ai/dsh-session-persistence-jsonl` têm `latest` obsoleto (0.0.1-rc.1), fixe `next` (0.1.0-rc.6); `create-dsh-plugin` já está publicado (0.1.1, 2026-08-13); dsh-core/dsh-sdk seguem não publicados (verificado em 2026-08-14).
- Aplique `resolve()` nos dois lados antes de comparar caminhos (armadilha da barra invertida do Windows).

## Links de documentação

Documentação oficial de desenvolvimento — base do site <https://deepseek-harness.github.io/deepseek-harness> (a raiz é chinês, `en/` é inglês; cópias locais textuais em `references/official-docs/docs/`):

- Básico: [develop/basic/](https://deepseek-harness.github.io/deepseek-harness/develop/basic/) → [tool](https://deepseek-harness.github.io/deepseek-harness/develop/basic/tool) · [config](https://deepseek-harness.github.io/deepseek-harness/develop/basic/config) · [publish](https://deepseek-harness.github.io/deepseek-harness/develop/basic/publish)
- Framework: [develop/framework/](https://deepseek-harness.github.io/deepseek-harness/develop/framework/) ([service](https://deepseek-harness.github.io/deepseek-harness/develop/framework/service), [events](https://deepseek-harness.github.io/deepseek-harness/develop/framework/events)) · Prática: [develop/practice/](https://deepseek-harness.github.io/deepseek-harness/develop/practice/) ([LLM adapter](https://deepseek-harness.github.io/deepseek-harness/develop/practice/llm-adapter))
- Guias: [quickstart](https://deepseek-harness.github.io/deepseek-harness/guide/quickstart) · [providers](https://deepseek-harness.github.io/deepseek-harness/guide/providers) · [python-sdk](https://deepseek-harness.github.io/deepseek-harness/guide/python-sdk)
- Cordis: [primer](https://deepseek-harness.github.io/deepseek-harness/reference/cordis-primer) · [tutorial](https://deepseek-harness.github.io/deepseek-harness/develop/cordis-tutorial/) · [core API](https://deepseek-harness.github.io/deepseek-harness/reference/cordis-api/context)
- Referência: [architecture](https://deepseek-harness.github.io/deepseek-harness/reference/) · [cookbook/adding-a-tool](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/adding-a-tool) · [cookbook/extension-cookbook](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/extension-cookbook) · [subsystems](https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/)
- Índice completo URL ↔ cópia local: [guide/links.md](links.md)

Documentação comunitária de desenvolvimento — modelos/tutoriais/armadilhas, lista completa em [references/community-ecosystem.md](../references/community-ecosystem.md): [plugin-template](https://github.com/omdsh-dev/plugin-template) · [dsh-plugin-dev pitfalls](https://github.com/omdsh-dev/dsh-plugin-dev) · [from-scratch tutorial](https://github.com/Opr4Mp3r/deepseek-harness-plugin-from-scratch) · [dsh-plugin-check](https://github.com/omdsh-dev/dsh-plugin-check)

## Índice de fontes principais

- Documentação oficial textual: `references/official-docs/docs/**` (215 páginas, inclui pares `.zh.md`)
- Restrições da raiz do repo: `references/official-docs/AGENTS.md`, `references/official-docs/packages/AGENTS.md`, `references/official-docs/vendor/README.md`; estado de sincronização em `references/official-docs/SNAPSHOT.md`
- HTML do site: `downloads/web/site/**` (site completo EN+ZH) + `downloads/manifest.tsv`
- Cordis upstream: `downloads/github/cordis/**` + pesquisa `references/upstream-cordis.md`
- Paper do Cordis: `downloads/github/paper/**` + pesquisa `references/cordis-paper-and-community.md`
- Pesquisa do site: `references/website-pages.md`
- Pesquisa do repo: `references/harness-repo.md`
- Comunidade/ecossistema: `references/community-ecosystem.md` + `references/community-repo-deep-dive.md`
- Todas as URLs de fontes: `references/sources.md`
