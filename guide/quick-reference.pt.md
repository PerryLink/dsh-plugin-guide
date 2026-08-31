# Folha de consulta de plugins do DeepSeek Harness

> Refer锚ncia r谩pida de uma p谩gina. Detalhes: [plugin-dev-guide.md](plugin-dev-guide.md) (chin锚s) e [references](../references/).
> Outros idiomas: [English](quick-reference.md) 路 [涓枃](quick-reference.zh-CN.md) 路 [Espa帽ol](quick-reference.es.md) 路 [啶灌た啶ㄠ啶︵](quick-reference.hi.md)

## Esqueleto do plugin

```ts
import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'
import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'my-plugin'          // obrigat贸rio
export const inject = ['tools']          // servi莽os necess谩rios; omita se n茫o houver

export interface Config { limit: number }
export const Config: Schema<Config> = Schema.object({
  limit: Schema.number().default(10),    // schema Schemastery, n茫o um objeto simples
})

export function apply(ctx: Context, config: Config) {
  ctx.effect(() => {                     // registro = efeito, desfeito ao descarregar
    const timer = setInterval(() => {}, 1000)
    return () => clearInterval(timer)
  })
  ctx.on('tools/result', (exec, result) => { /* ... */ })
  ctx.tools.register(defineTool({
    name: 'my_tool',
    description: '鈥?,
    parameters: { x: { type: 'string', required: true } },
    output: { schema: { type: 'string' }, render: (_a, v) => [{ type: 'text', text: v }] },
    async execute(args, exec) { return `hi ${args.x}` },  // respeite exec.signal
  }))
}
```

Outras formas: objeto `export default { name, inject, apply }`; classe `class X extends Service { static inject=[...]; constructor(ctx){ super(ctx,'key') } }` (use ao fornecer um servi莽o).

## API principal do ctx (Cordis)

| Finalidade | API |
|---|---|
| Registrar recurso + limpeza | `ctx.effect(() => disposer)` |
| Ouvir eventos | `ctx.on(name, handler)` (limpeza autom谩tica) |
| Transmiss茫o / sem retorno | `ctx.emit(name, payload)` |
| Valor com curto-circuito | `ctx.bail(name, input)` (o primeiro n茫o-null/false/undefined vence) |
| Valor ordenado | `await ctx.serial(name, input)` |
| Pipeline | `await ctx.waterfall(name, input, init)`; listeners **devem chamar `next()`** |
| Contextos filhos | `ctx.extend(meta)` / `ctx.isolate(name, label?)` / `ctx.intercept(name, config)` |
| Montar plugin filho | `ctx.plugin(plugin)` 鈫?Fiber; `await fiber.dispose()` |
| Consulta de servi莽o opcional | `ctx.get('metrics')?.x()` |
| Logging | `ctx.logger(name)` |

Ciclo de vida: `PENDING 鈫?LOADING 鈫?ACTIVE` (apply lan莽a erro 鈫?FAILED); `ACTIVE 鈫?UNLOADING 鈫?DISPOSED`. Se um servi莽o necess谩rio desaparece, o plugin descarrega; recarrega quando o servi莽o volta.

## Modos de despacho de eventos + bail

| Modo | await | Ordem | Valor de retorno |
|---|---|---|---|
| emit | n茫o | ordem de registro | nenhum |
| waterfall | n茫o | ordem de registro | sim (**n茫o chamar `next()` causa curto-circuito**) |
| parallel | sim | paralelo | nenhum |
| serial | sim | ordem de registro | sim (o primeiro n茫o vazio para) |

Eventos tipados (declaration merging):

```ts
declare module '@deepseek-ai/cordis' {
  interface Events { 'my/event': (p: { id: string }) => void }
  interface Context { myService: MyService }   // ao fornecer um servi莽o
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
# ordem efetiva: bundles 鈫?cordis.patch.yml do profile 鈫?$DSH_HOME/cordis.patch.yml 鈫?--patch
# sobrescrita por id; a linha config inteira 茅 substitu铆da (sem deep merge) 鈥?repita todas as chaves
# !!js avalia ap贸s os servi莽os injetados ativarem; disabled 茅 avaliado em cada montagem
```

Comandos: `dsh --profile web` 路 `dsh --profile headless "task"` 路 `dsh --profile X --dump-config` 路 `dsh plugin --profile X add/remove <pkg>` 路 `pnpm dsh web --patch ./scratch-plugin/cordis.yml`

Canais de instala莽茫o (repository-plugin removido em 0811 鈥?restam apenas dois):
- **plugin bundle** (`"dsh":{"bundle":{"patch":"..."}}`) 鈫?`dsh plugin add <pkg>` entra na pilha `dsh.profile.bundles`; efeito ap贸s reiniciar.
- **plugin cordis simples** (sem `dsh.bundle`) 鈫?`dsh plugin add <pkg>` instala a depend锚ncia + uma linha insert no `cordis.patch.yml` do profile; **HMR de configura莽茫o ao vivo**.
- fonte git: `dsh plugin add "github:owner/repo#<sha>&path:<subdir>"` (fixe o commit; build `prepare` autocontido + `allowBuilds` no `pnpm-workspace.yaml` do profile; npm/tarball dispensa permiss茫o de build).

## Servi莽os internos comuns (chaves do ctx)

`sessions` registro de sess茫o 路 `systemPrompt` montagem de prompts 路 `tools` registro de ferramentas + pipeline protegido 路 `agents` registro de agentes 路 `agentLoop` driver do loop 路 `llm` registro de adaptadores 路 `skills` registro de skills 路 `commands` comandos slash 路 `approval` aprova莽茫o 煤nica 路 `jobs` trabalhos em segundo plano 路 `fs` seam de sistema de arquivos 路 `shell` seam de execu莽茫o bash 路 `subprocess` seam de subprocessos 路 `terminals` PTY 路 `sandbox` seam de confinamento 路 `codeRuntime` execu莽茫o de c贸digo 路 `sessionPersistence` persist锚ncia 路 `settings` / `credentials` / `workspaceRegistry` / `goals` / `planMode` / `subagents` / `workflowEngine` / `storage`.
Lista completa e assinaturas exatas 鈫?`references/official-docs/docs/capability-seams.md` + `docs/subsystems/*.md` (regi玫es Cordis API geradas).

## Pipeline de pol铆ticas de ferramentas (ordem de execu莽茫o)

```
tools/pre-execute (waterfall, allow|deny|ask) 鈫?ctx.tools.guard() (nega莽茫o mon贸tona)
鈫?tools/execute (wrapper; apenas exec.signal substitu铆vel) 鈫?execute(args, exec)
鈫?tools/post-execute (substituir content/value, bloquear, anexar contexto) 鈫?finalizeContent
鈫?tools/result (somente observa莽茫o) 鈫?tool/result dur谩vel (evento de sess茫o)
```

Sele莽茫o: port玫es de pol铆tica 鈫?pre-execute; nega莽茫o irrevers铆vel 鈫?guard; timeout/retentativas/m茅tricas 鈫?execute; transformar resultados 鈫?post-execute; auditoria/coleta 鈫?result.
Code Mode: `await tools.<name>(args)` vem de gra莽a; sucesso = valor JSON can么nico final; falha = `ToolCallError(name, toolName, message)`.

## Cart玫es de UI (fun莽玫es puras! apenas args(+result) 鈥?sem I/O/rel贸gio/aleat贸rio)

- `presentCall(args)` 鈫?`{card:'generic',title,kind?,rawInput?,content?,locations?}` | `{card:'terminal',title,description?,cwd?}` | `{card:'diff',title,diffs,locations?}`
- `presentResult(args,{content,isError,meta?})` 鈫?generic / terminal / diff / search(`shape:'matches'|'paths'`) / read / web(`kind:'search'|'fetch'`)
- Metadados de replay: `output.presentationMeta(args, value)` 鈫?persistido em `tool/result.meta`

## Modelo de seam de capacidade de tr锚s pap茅is

Definition (`dsh-my-cap`): `export abstract class MyCapService extends Service { constructor(ctx){super(ctx,'myCap')} abstract execute(req): Promise<res> }` + declaration merging de Context.
Provider (`dsh-my-cap-local`): `export function apply(ctx){ ctx.plugin(class MyCapLocal extends MyCapService {...}) }`.
Consumer (`dsh-tool-my-cap`): `inject = ['tools','myCap']`, `ctx.tools.register(defineTool({... execute: args => ctx.myCap.execute(...)}))`.
Regras: n茫o divida prematuramente; Provider e Consumer nunca dependem um do outro; padr玫es resolvem explicitamente em `resolve(request): Spec`.

## Essenciais do adaptador LLM

`class MyAdapter extends LlmAdapter { async *stream(options): AsyncIterable<StreamChunk> }` 鈫?`ctx.llm.registerAdapter(['provider'], adapter)`.
Protocolo de chunks: `block-start` 鈫?`text-delta*` 鈫?`block-end` (bloco completo) 鈫?鈥?鈫?`usage` (antes de finish) 鈫?`finish` (煤ltimo; `reason: {kind:'stop'|'tool-calls'}`). Lance `LlmError` com c贸digo est谩vel para campos que voc锚 n茫o puder atender.

## Regras r铆gidas (viola莽玫es = falhas de gate / comportamento errado)

1. Todo registro passa por `ctx.effect()` / `ctx.on()` / o `register()` de um servi莽o (retorna disposer).
2. Listeners de waterfall devem chamar `next()`; n茫o chamar causa curto-circuito por design.
3. Vis铆vel-para-o-modelo 鈬?registrado: nova entrada vis铆vel exige novo evento de sess茫o (`SessionEventMap`).
4. Nunca codifique valores ajust谩veis (teste: o cordis.yml consegue mud谩-los?); m谩 configura莽茫o falha em voz alta.
5. Pacotes de plugin independentes: cordis 茅 peerDependency com a mesma identidade do host (misturar scoped `@deepseek-ai/cordis` e unscoped divide identidades); ESM; manifesto `dsh.bundle`; instala莽玫es git precisam de `prepare` + `allowBuilds`; publique `lib/` ou um tarball.
6. Documenta莽茫o bil铆ngue em pares; descri莽玫es/prompts s茫o comportamento; mudan莽as n茫o triviais levam Agent Note; rode o conjunto m铆nimo de verifica莽玫es antes de empurrar (dsh-pre-push-checks).
7. IDs opacos entre limites s茫o branded (`Branded<B>` de `dsh-brand`), nunca `string` crua.
8. Membros de `SessionEventMap` s茫o required-on-read: o envelope `ignorable` desaparece no 0.1.2-alpha.1 (a leitura falha fechada 鈥?um build que n茫o conhece um tipo de evento recusa o log), e appends de eventos pr贸prios de plugins cruzam uma porta adaptativa que para de gravar em hosts sem envelope; 0.1.2-alpha.2 mantém o campo ignorable?: true apenas para compatibilidade de leitura de logs armazenados (seu Session.append ainda não consegue estampar o marcador), então a porta continua sem gravar (sem mudança de comportamento). Apenas mudan莽as de formato estrutural bumpam `SESSION_FORMAT_VERSION`. O switch sobre `SessionEvent` cai num `default` documentado 鈥?sem `assertNever` (uni茫o merge-extensible).

## Lista r谩pida de armadilhas da comunidade (detalhes: guia 搂7.3 / community-repo-deep-dive.md)

- Trio do tsconfig: `moduleResolution: bundler` + `allowImportingTsExtensions` + `rewriteRelativeImportExtensions` (+ `lib:["ES2024"]`, `types:["node"]` expl铆cito).
- `tsc` emite apesar de erros 鈫?`tsc || exit 1` / `--noEmitOnError`; procure imports `.ts` residuais no build antes de publicar.
- Junctions do Windows via PowerShell `New-Item -ItemType Junction`; letra de unidade do vitest em mai煤scula `C:/`.
- `DSH_PERMISSION_MODE=danger-full-access` 茅 de alto risco (sem backend de sandbox no Windows, aprova莽玫es desativadas); `DSH_*` em `~/.dsh/.env` quebra a inicializa莽茫o.
- Arquivos de sess茫o s茫o zstd multiframe: use `scanZstdFrames`/`createZstdFrameDecoder` (`@deepseek-ai/dsh-session-persistence-jsonl/src/zstd.ts`).
- npm: o `dsh` sem escopo 茅 o projeto alheio node-dsh (um shell) 鈥?instale `@deepseek-ai/dsh`; `@deepseek-ai/dsh-tools` e `@deepseek-ai/dsh-session-persistence-jsonl` t锚m `latest` obsoleto (0.0.1-rc.1), fixe `next` (0.1.0-rc.6); `create-dsh-plugin` j谩 est谩 publicado (0.1.1, 2026-08-13); dsh-core/dsh-sdk seguem n茫o publicados (verificado em 2026-08-14).
- Aplique `resolve()` nos dois lados antes de comparar caminhos (armadilha da barra invertida do Windows).

## Links de documenta莽茫o

Documenta莽茫o oficial de desenvolvimento 鈥?base do site <https://deepseek-harness.github.io/deepseek-harness> (a raiz 茅 chin锚s, `en/` 茅 ingl锚s; c贸pias locais textuais em `references/official-docs/docs/`):

- B谩sico: [develop/basic/](https://deepseek-harness.github.io/deepseek-harness/develop/basic/) 鈫?[tool](https://deepseek-harness.github.io/deepseek-harness/develop/basic/tool) 路 [config](https://deepseek-harness.github.io/deepseek-harness/develop/basic/config) 路 [publish](https://deepseek-harness.github.io/deepseek-harness/develop/basic/publish)
- Framework: [develop/framework/](https://deepseek-harness.github.io/deepseek-harness/develop/framework/) ([service](https://deepseek-harness.github.io/deepseek-harness/develop/framework/service), [events](https://deepseek-harness.github.io/deepseek-harness/develop/framework/events)) 路 Pr谩tica: [develop/practice/](https://deepseek-harness.github.io/deepseek-harness/develop/practice/) ([LLM adapter](https://deepseek-harness.github.io/deepseek-harness/develop/practice/llm-adapter))
- Guias: [quickstart](https://deepseek-harness.github.io/deepseek-harness/guide/quickstart) 路 [providers](https://deepseek-harness.github.io/deepseek-harness/guide/providers) 路 [python-sdk](https://deepseek-harness.github.io/deepseek-harness/guide/python-sdk)
- Cordis: [primer](https://deepseek-harness.github.io/deepseek-harness/reference/cordis-primer) 路 [tutorial](https://deepseek-harness.github.io/deepseek-harness/develop/cordis-tutorial/) 路 [core API](https://deepseek-harness.github.io/deepseek-harness/reference/cordis-api/context)
- Refer锚ncia: [architecture](https://deepseek-harness.github.io/deepseek-harness/reference/) 路 [cookbook/adding-a-tool](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/adding-a-tool) 路 [cookbook/extension-cookbook](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/extension-cookbook) 路 [subsystems](https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/)
- 脥ndice completo URL 鈫?c贸pia local: [guide/links.md](links.md)

Documenta莽茫o comunit谩ria de desenvolvimento 鈥?modelos/tutoriais/armadilhas, lista completa em [references/community-ecosystem.md](../references/community-ecosystem.md): [plugin-template](https://github.com/omdsh-dev/plugin-template) 路 [dsh-plugin-dev pitfalls](https://github.com/omdsh-dev/dsh-plugin-dev) 路 [from-scratch tutorial](https://github.com/Opr4Mp3r/deepseek-harness-plugin-from-scratch) 路 [dsh-plugin-check](https://github.com/omdsh-dev/dsh-plugin-check)

## 脥ndice de fontes principais

- Documenta莽茫o oficial textual: `references/official-docs/docs/**` (215 p谩ginas, inclui pares `.zh.md`)
- Restri莽玫es da raiz do repo: `references/official-docs/AGENTS.md`, `references/official-docs/packages/AGENTS.md`, `references/official-docs/examples/AGENTS.md`, `references/official-docs/vendor/README.md`; estado de sincroniza莽茫o em `references/official-docs/SNAPSHOT.md`
- HTML do site: `downloads/web/site/**` (site completo EN+ZH) + `downloads/manifest.tsv`
- Cordis upstream: `downloads/github/cordis/**` + pesquisa `references/upstream-cordis.md`
- Paper do Cordis: `downloads/github/paper/**` + pesquisa `references/cordis-paper-and-community.md`
- Pesquisa do site: `references/website-pages.md`
- Pesquisa do repo: `references/harness-repo.md`
- Comunidade/ecossistema: `references/community-ecosystem.md` + `references/community-repo-deep-dive.md`
- Todas as URLs de fontes: `references/sources.md`
