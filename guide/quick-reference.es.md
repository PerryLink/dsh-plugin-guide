# Chuleta de plugins de DeepSeek Harness

> Referencia r谩pida de una p谩gina. Detalles: [plugin-dev-guide.md](plugin-dev-guide.md) (chino) y [references](../references/).
> Otros idiomas: [English](quick-reference.md) 路 [涓枃](quick-reference.zh-CN.md) 路 [Portugu锚s](quick-reference.pt.md) 路 [啶灌た啶ㄠ啶︵](quick-reference.hi.md)

## Esqueleto del plugin

```ts
import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'
import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'my-plugin'          // obligatorio
export const inject = ['tools']          // servicios requeridos; omite si no hay

export interface Config { limit: number }
export const Config: Schema<Config> = Schema.object({
  limit: Schema.number().default(10),    // schema de Schemastery, no un objeto plano
})

export function apply(ctx: Context, config: Config) {
  ctx.effect(() => {                     // registro = efecto, se deshace al descargar
    const timer = setInterval(() => {}, 1000)
    return () => clearInterval(timer)
  })
  ctx.on('tools/result', (exec, result) => { /* ... */ })
  ctx.tools.register(defineTool({
    name: 'my_tool',
    description: '鈥?,
    parameters: { x: { type: 'string', required: true } },
    output: { schema: { type: 'string' }, render: (_a, v) => [{ type: 'text', text: v }] },
    async execute(args, exec) { return `hi ${args.x}` },  // respeta exec.signal
  }))
}
```

Otras formas: objeto `export default { name, inject, apply }`; clase `class X extends Service { static inject=[...]; constructor(ctx){ super(ctx,'key') } }` (煤sela al proveer un servicio).

## API principal de ctx (Cordis)

| Prop贸sito | API |
|---|---|
| Registrar recurso + limpieza | `ctx.effect(() => disposer)` |
| Escuchar eventos | `ctx.on(name, handler)` (limpieza autom谩tica) |
| Difusi贸n / sin retorno | `ctx.emit(name, payload)` |
| Valor con cortocircuito | `ctx.bail(name, input)` (gana el primero no-null/false/undefined) |
| Valor ordenado | `await ctx.serial(name, input)` |
| Tuber铆a | `await ctx.waterfall(name, input, init)`; los listeners **deben llamar `next()`** |
| Contextos hijo | `ctx.extend(meta)` / `ctx.isolate(name, label?)` / `ctx.intercept(name, config)` |
| Montar plugin hijo | `ctx.plugin(plugin)` 鈫?Fiber; `await fiber.dispose()` |
| Consulta de servicio opcional | `ctx.get('metrics')?.x()` |
| Logging | `ctx.logger(name)` |

Ciclo de vida: `PENDING 鈫?LOADING 鈫?ACTIVE` (si apply lanza 鈫?FAILED); `ACTIVE 鈫?UNLOADING 鈫?DISPOSED`. Si un servicio requerido desaparece, el plugin se descarga; se recarga cuando el servicio vuelve.

## Modos de despacho de eventos + bail

| Modo | await | Orden | Valor de retorno |
|---|---|---|---|
| emit | no | orden de registro | ninguno |
| waterfall | no | orden de registro | s铆 (**no llamar `next()` cortocircuita**) |
| parallel | s铆 | paralelo | ninguno |
| serial | s铆 | orden de registro | s铆 (el primero no vac铆o detiene) |

Eventos tipados (declaration merging):

```ts
declare module '@deepseek-ai/cordis' {
  interface Events { 'my/event': (p: { id: string }) => void }
  interface Context { myService: MyService }   // al proveer un servicio
}
```

## cordis.yml / capas

```yaml
# scratch-plugin/cordis.yml (overlay --patch)
- insert:
    - id: hello
      name: '/absolute/path/to/scratch-plugin/src/my-plugin.ts'
      config: { greeting: 'Hi' }

# bundle: "dsh": {"bundle":{"patch":"./cordis.patch.yml"}} en package.json
# profile: "dsh": {"profile":{"bundles":["@deepseek-ai/dsh-base","my-bundle"]}}
# orden efectivo: bundles 鈫?cordis.patch.yml del profile 鈫?$DSH_HOME/cordis.patch.yml 鈫?--patch
# sobrescritura por id; se reemplaza toda la fila config (sin deep merge) 鈥?repite cada clave
# !!js se eval煤a tras activarse los servicios inyectados; disabled se eval煤a en cada montaje
```

Comandos: `dsh --profile web` 路 `dsh --profile headless "task"` 路 `dsh --profile X --dump-config` 路 `dsh plugin --profile X add/remove <pkg>` 路 `pnpm dsh web --patch ./scratch-plugin/cordis.yml`

Canales de instalaci贸n (repository-plugin eliminado el 0811 鈥?solo quedan dos):
- **plugin bundle** (`"dsh":{"bundle":{"patch":"..."}}`) 鈫?`dsh plugin add <pkg>` entra en la pila `dsh.profile.bundles`; efecto tras reiniciar.
- **plugin cordis simple** (sin `dsh.bundle`) 鈫?`dsh plugin add <pkg>` instala la dependencia + una fila insert en `cordis.patch.yml` del profile; **HMR de configuraci贸n en vivo**.
- fuente git: `dsh plugin add "github:owner/repo#<sha>&path:<subdir>"` (fija el commit; build `prepare` autocontenido + `allowBuilds` en `pnpm-workspace.yaml` del profile; npm/tarball no requiere permiso de build).

## Servicios integrados comunes (claves de ctx)

`sessions` registro de sesi贸n 路 `systemPrompt` ensamblado de prompts 路 `tools` registro de herramientas + pipeline protegido 路 `agents` registro de agentes 路 `agentLoop` driver del bucle 路 `llm` registro de adaptadores 路 `skills` registro de skills 路 `commands` comandos slash 路 `approval` aprobaci贸n 煤nica 路 `jobs` trabajos en segundo plano 路 `fs` seam de sistema de archivos 路 `shell` seam de ejecuci贸n bash 路 `subprocess` seam de subprocesos 路 `terminals` PTY 路 `sandbox` seam de confinamiento 路 `codeRuntime` ejecuci贸n de c贸digo 路 `sessionPersistence` persistencia 路 `settings` / `credentials` / `workspaceRegistry` / `goals` / `planMode` / `subagents` / `workflowEngine` / `storage`.
Lista completa y firmas exactas 鈫?`references/official-docs/docs/capability-seams.md` + `docs/subsystems/*.md` (regiones Cordis API generadas).

## Pipeline de pol铆ticas de herramientas (orden de ejecuci贸n)

```
tools/pre-execute (waterfall, allow|deny|ask) 鈫?ctx.tools.guard() (denegaci贸n mon贸tona)
鈫?tools/execute (wrapper; solo exec.signal reemplazable) 鈫?execute(args, exec)
鈫?tools/post-execute (reemplazar content/value, bloquear, adjuntar contexto) 鈫?finalizeContent
鈫?tools/result (solo observaci贸n) 鈫?tool/result durable (evento de sesi贸n)
```

Selecci贸n: puertas de pol铆tica 鈫?pre-execute; denegaci贸n inapelable 鈫?guard; timeout/reintentos/m茅tricas 鈫?execute; transformar resultados 鈫?post-execute; auditor铆a/recolecci贸n 鈫?result.
Code Mode: `await tools.<name>(args)` viene gratis; 茅xito = valor JSON can贸nico final; fallo = `ToolCallError(name, toolName, message)`.

## Tarjetas de UI (隆funciones puras! solo args(+result) 鈥?sin I/O/reloj/aleatorio)

- `presentCall(args)` 鈫?`{card:'generic',title,kind?,rawInput?,content?,locations?}` | `{card:'terminal',title,description?,cwd?}` | `{card:'diff',title,diffs,locations?}`
- `presentResult(args,{content,isError,meta?})` 鈫?generic / terminal / diff / search(`shape:'matches'|'paths'`) / read / web(`kind:'search'|'fetch'`)
- Metadatos de repetici贸n: `output.presentationMeta(args, value)` 鈫?persistido en `tool/result.meta`

## Plantilla de seam de capacidad de tres roles

Definition (`dsh-my-cap`): `export abstract class MyCapService extends Service { constructor(ctx){super(ctx,'myCap')} abstract execute(req): Promise<res> }` + declaration merging de Context.
Provider (`dsh-my-cap-local`): `export function apply(ctx){ ctx.plugin(class MyCapLocal extends MyCapService {...}) }`.
Consumer (`dsh-tool-my-cap`): `inject = ['tools','myCap']`, `ctx.tools.register(defineTool({... execute: args => ctx.myCap.execute(...)}))`.
Reglas: no dividir prematuramente; Provider y Consumer nunca dependen entre s铆; los valores por defecto se resuelven expl铆citamente en `resolve(request): Spec`.

## Esenciales del adaptador LLM

`class MyAdapter extends LlmAdapter { async *stream(options): AsyncIterable<StreamChunk> }` 鈫?`ctx.llm.registerAdapter(['provider'], adapter)`.
Protocolo de chunks: `block-start` 鈫?`text-delta*` 鈫?`block-end` (bloque completo) 鈫?鈥?鈫?`usage` (antes de finish) 鈫?`finish` (煤ltimo; `reason: {kind:'stop'|'tool-calls'}`). Lanza `LlmError` con c贸digo estable para los campos que no puedas cumplir.

## Reglas estrictas (violarlas = fallos de puerta / mal comportamiento)

1. Todo registro pasa por `ctx.effect()` / `ctx.on()` / el `register()` de un servicio (devuelve disposer).
2. Los listeners de waterfall deben llamar `next()`; no llamarlo cortocircuita por dise帽o.
3. Visible-para-el-modelo 鈬?registrado: una nueva entrada visible requiere un nuevo evento de sesi贸n (`SessionEventMap`).
4. Nunca codifiques valores ajustables (prueba: 驴puede cambiarlos cordis.yml?); la mala configuraci贸n falla en voz alta.
5. Paquetes de plugin independientes: cordis es peerDependency con la misma identidad del host (mezclar scoped `@deepseek-ai/cordis` y unscoped divide identidades); ESM; manifiesto `dsh.bundle`; instalaciones git necesitan `prepare` + `allowBuilds`; publica `lib/` o un tarball.
6. Documentaci贸n biling眉e en pares; descripciones/prompts son comportamiento; cambios no triviales llevan Agent Note; ejecuta el conjunto m铆nimo de checks antes de empujar (dsh-pre-push-checks).
7. Los ids opacos entre l铆mites son branded (`Branded<B>` de `dsh-brand`), nunca `string` pelado.
8. Los miembros de `SessionEventMap` son required-on-read: el sobre `ignorable` desaparece en 0.1.2-alpha.1 (la lectura falla cerrada 鈥?un build que no conoce un tipo de evento rechaza el log), y los appends de eventos propios de plugins cruzan una puerta adaptativa que deja de escribir en hosts sin sobre; 0.1.2-alpha.2 conserva el campo ignorable?: true solo para compatibilidad de lectura de logs almacenados (su Session.append sigue sin poder estampar el marcador), por lo que la puerta continúa sin escribir (sin cambio de comportamiento). Solo los cambios de formato estructural bumpan `SESSION_FORMAT_VERSION`. El switch sobre `SessionEvent` cae por un `default` documentado 鈥?sin `assertNever` (uni贸n merge-extensible).

## Lista r谩pida de trampas comunitarias (detalles: gu铆a 搂7.3 / community-repo-deep-dive.md)

- Tr铆o de tsconfig: `moduleResolution: bundler` + `allowImportingTsExtensions` + `rewriteRelativeImportExtensions` (+ `lib:["ES2024"]`, `types:["node"]` expl铆cito).
- `tsc` emite pese a errores 鈫?`tsc || exit 1` / `--noEmitOnError`; busca imports `.ts` residuales en el build antes de publicar.
- Junctions de Windows con PowerShell `New-Item -ItemType Junction`; la letra de unidad de vitest en may煤scula `C:/`.
- `DSH_PERMISSION_MODE=danger-full-access` es de alto riesgo (sin backend de sandbox en Windows, aprobaciones desactivadas); `DSH_*` en `~/.dsh/.env` rompe el arranque.
- Los archivos de sesi贸n son zstd multiframe: usa `scanZstdFrames`/`createZstdFrameDecoder` (`@deepseek-ai/dsh-session-persistence-jsonl/src/zstd.ts`).
- npm: `dsh` sin alcance es el proyecto ajeno node-dsh (un shell) 鈥?instala `@deepseek-ai/dsh`; `@deepseek-ai/dsh-tools` y `@deepseek-ai/dsh-session-persistence-jsonl` tienen `latest` obsoleto (0.0.1-rc.1), fija `next` (0.1.0-rc.6); `create-dsh-plugin` ya est谩 publicado (0.1.1, 2026-08-13); dsh-core/dsh-sdk siguen sin publicarse (verificado 2026-08-14).
- Haz `resolve()` en ambos lados antes de comparar rutas (trampa de barras invertidas de Windows).

## Enlaces de documentaci贸n

Documentaci贸n oficial de desarrollo 鈥?base del sitio <https://deepseek-harness.github.io/deepseek-harness> (la ra铆z es chino, `en/` es ingl茅s; copias locales textuales en `references/official-docs/docs/`):

- B谩sico: [develop/basic/](https://deepseek-harness.github.io/deepseek-harness/develop/basic/) 鈫?[tool](https://deepseek-harness.github.io/deepseek-harness/develop/basic/tool) 路 [config](https://deepseek-harness.github.io/deepseek-harness/develop/basic/config) 路 [publish](https://deepseek-harness.github.io/deepseek-harness/develop/basic/publish)
- Framework: [develop/framework/](https://deepseek-harness.github.io/deepseek-harness/develop/framework/) ([service](https://deepseek-harness.github.io/deepseek-harness/develop/framework/service), [events](https://deepseek-harness.github.io/deepseek-harness/develop/framework/events)) 路 Pr谩ctica: [develop/practice/](https://deepseek-harness.github.io/deepseek-harness/develop/practice/) ([LLM adapter](https://deepseek-harness.github.io/deepseek-harness/develop/practice/llm-adapter))
- Gu铆as: [quickstart](https://deepseek-harness.github.io/deepseek-harness/guide/quickstart) 路 [providers](https://deepseek-harness.github.io/deepseek-harness/guide/providers) 路 [python-sdk](https://deepseek-harness.github.io/deepseek-harness/guide/python-sdk)
- Cordis: [primer](https://deepseek-harness.github.io/deepseek-harness/reference/cordis-primer) 路 [tutorial](https://deepseek-harness.github.io/deepseek-harness/develop/cordis-tutorial/) 路 [core API](https://deepseek-harness.github.io/deepseek-harness/reference/cordis-api/context)
- Referencia: [architecture](https://deepseek-harness.github.io/deepseek-harness/reference/) 路 [cookbook/adding-a-tool](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/adding-a-tool) 路 [cookbook/extension-cookbook](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/extension-cookbook) 路 [subsystems](https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/)
- 脥ndice completo URL 鈫?copia local: [guide/links.md](links.md)

Documentaci贸n comunitaria de desarrollo 鈥?plantillas/tutoriales/errores, lista completa en [references/community-ecosystem.md](../references/community-ecosystem.md): [plugin-template](https://github.com/omdsh-dev/plugin-template) 路 [dsh-plugin-dev pitfalls](https://github.com/omdsh-dev/dsh-plugin-dev) 路 [from-scratch tutorial](https://github.com/Opr4Mp3r/deepseek-harness-plugin-from-scratch) 路 [dsh-plugin-check](https://github.com/omdsh-dev/dsh-plugin-check)

## 脥ndice de fuentes clave

- Documentaci贸n oficial textual: `references/official-docs/docs/**` (215 p谩ginas, incluye pares `.zh.md`)
- Restricciones ra铆z del repo: `references/official-docs/AGENTS.md`, `references/official-docs/packages/AGENTS.md`, `references/official-docs/examples/AGENTS.md`, `references/official-docs/vendor/README.md`; estado de sincronizaci贸n en `references/official-docs/SNAPSHOT.md`
- HTML del sitio: `downloads/web/site/**` (sitio completo EN+ZH) + `downloads/manifest.tsv`
- Cordis upstream: `downloads/github/cordis/**` + investigaci贸n `references/upstream-cordis.md`
- Paper de Cordis: `downloads/github/paper/**` + investigaci贸n `references/cordis-paper-and-community.md`
- Investigaci贸n del sitio web: `references/website-pages.md`
- Investigaci贸n del repo: `references/harness-repo.md`
- Comunidad/ecosistema: `references/community-ecosystem.md` + `references/community-repo-deep-dive.md`
- Todas las URLs de fuentes: `references/sources.md`
