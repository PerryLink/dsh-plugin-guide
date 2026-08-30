# Chuleta de plugins de DeepSeek Harness

> Referencia rápida de una página. Detalles: [plugin-dev-guide.md](plugin-dev-guide.md) (chino) y [references](../references/).
> Otros idiomas: [English](quick-reference.md) · [中文](quick-reference.zh-CN.md) · [Português](quick-reference.pt.md) · [हिन्दी](quick-reference.hi.md)

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
    description: '…',
    parameters: { x: { type: 'string', required: true } },
    output: { schema: { type: 'string' }, render: (_a, v) => [{ type: 'text', text: v }] },
    async execute(args, exec) { return `hi ${args.x}` },  // respeta exec.signal
  }))
}
```

Otras formas: objeto `export default { name, inject, apply }`; clase `class X extends Service { static inject=[...]; constructor(ctx){ super(ctx,'key') } }` (úsela al proveer un servicio).

## API principal de ctx (Cordis)

| Propósito | API |
|---|---|
| Registrar recurso + limpieza | `ctx.effect(() => disposer)` |
| Escuchar eventos | `ctx.on(name, handler)` (limpieza automática) |
| Difusión / sin retorno | `ctx.emit(name, payload)` |
| Valor con cortocircuito | `ctx.bail(name, input)` (gana el primero no-null/false/undefined) |
| Valor ordenado | `await ctx.serial(name, input)` |
| Tubería | `await ctx.waterfall(name, input, init)`; los listeners **deben llamar `next()`** |
| Contextos hijo | `ctx.extend(meta)` / `ctx.isolate(name, label?)` / `ctx.intercept(name, config)` |
| Montar plugin hijo | `ctx.plugin(plugin)` → Fiber; `await fiber.dispose()` |
| Consulta de servicio opcional | `ctx.get('metrics')?.x()` |
| Logging | `ctx.logger(name)` |

Ciclo de vida: `PENDING → LOADING → ACTIVE` (si apply lanza → FAILED); `ACTIVE → UNLOADING → DISPOSED`. Si un servicio requerido desaparece, el plugin se descarga; se recarga cuando el servicio vuelve.

## Modos de despacho de eventos + bail

| Modo | await | Orden | Valor de retorno |
|---|---|---|---|
| emit | no | orden de registro | ninguno |
| waterfall | no | orden de registro | sí (**no llamar `next()` cortocircuita**) |
| parallel | sí | paralelo | ninguno |
| serial | sí | orden de registro | sí (el primero no vacío detiene) |

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
# orden efectivo: bundles → cordis.patch.yml del profile → $DSH_HOME/cordis.patch.yml → --patch
# sobrescritura por id; se reemplaza toda la fila config (sin deep merge) — repite cada clave
# !!js se evalúa tras activarse los servicios inyectados; disabled se evalúa en cada montaje
```

Comandos: `dsh --profile web` · `dsh --profile headless "task"` · `dsh --profile X --dump-config` · `dsh plugin --profile X add/remove <pkg>` · `pnpm dsh web --patch ./scratch-plugin/cordis.yml`

Canales de instalación (repository-plugin eliminado el 0811 — solo quedan dos):
- **plugin bundle** (`"dsh":{"bundle":{"patch":"..."}}`) → `dsh plugin add <pkg>` entra en la pila `dsh.profile.bundles`; efecto tras reiniciar.
- **plugin cordis simple** (sin `dsh.bundle`) → `dsh plugin add <pkg>` instala la dependencia + una fila insert en `cordis.patch.yml` del profile; **HMR de configuración en vivo**.
- fuente git: `dsh plugin add "github:owner/repo#<sha>&path:<subdir>"` (fija el commit; build `prepare` autocontenido + `allowBuilds` en `pnpm-workspace.yaml` del profile; npm/tarball no requiere permiso de build).

## Servicios integrados comunes (claves de ctx)

`sessions` registro de sesión · `systemPrompt` ensamblado de prompts · `tools` registro de herramientas + pipeline protegido · `agents` registro de agentes · `agentLoop` driver del bucle · `llm` registro de adaptadores · `skills` registro de skills · `commands` comandos slash · `approval` aprobación única · `jobs` trabajos en segundo plano · `fs` seam de sistema de archivos · `shell` seam de ejecución bash · `subprocess` seam de subprocesos · `terminals` PTY · `sandbox` seam de confinamiento · `codeRuntime` ejecución de código · `sessionPersistence` persistencia · `settings` / `credentials` / `workspaceRegistry` / `goals` / `planMode` / `subagents` / `workflowEngine` / `storage`.
Lista completa y firmas exactas → `references/official-docs/docs/capability-seams.md` + `docs/subsystems/*.md` (regiones Cordis API generadas).

## Pipeline de políticas de herramientas (orden de ejecución)

```
tools/pre-execute (waterfall, allow|deny|ask) → ctx.tools.guard() (denegación monótona)
→ tools/execute (wrapper; solo exec.signal reemplazable) → execute(args, exec)
→ tools/post-execute (reemplazar content/value, bloquear, adjuntar contexto) → finalizeContent
→ tools/result (solo observación) → tool/result durable (evento de sesión)
```

Selección: puertas de política → pre-execute; denegación inapelable → guard; timeout/reintentos/métricas → execute; transformar resultados → post-execute; auditoría/recolección → result.
Code Mode: `await tools.<name>(args)` viene gratis; éxito = valor JSON canónico final; fallo = `ToolCallError(name, toolName, message)`.

## Tarjetas de UI (¡funciones puras! solo args(+result) — sin I/O/reloj/aleatorio)

- `presentCall(args)` → `{card:'generic',title,kind?,rawInput?,content?,locations?}` | `{card:'terminal',title,description?,cwd?}` | `{card:'diff',title,diffs,locations?}`
- `presentResult(args,{content,isError,meta?})` → generic / terminal / diff / search(`shape:'matches'|'paths'`) / read / web(`kind:'search'|'fetch'`)
- Metadatos de repetición: `output.presentationMeta(args, value)` → persistido en `tool/result.meta`

## Plantilla de seam de capacidad de tres roles

Definition (`dsh-my-cap`): `export abstract class MyCapService extends Service { constructor(ctx){super(ctx,'myCap')} abstract execute(req): Promise<res> }` + declaration merging de Context.
Provider (`dsh-my-cap-local`): `export function apply(ctx){ ctx.plugin(class MyCapLocal extends MyCapService {...}) }`.
Consumer (`dsh-tool-my-cap`): `inject = ['tools','myCap']`, `ctx.tools.register(defineTool({... execute: args => ctx.myCap.execute(...)}))`.
Reglas: no dividir prematuramente; Provider y Consumer nunca dependen entre sí; los valores por defecto se resuelven explícitamente en `resolve(request): Spec`.

## Esenciales del adaptador LLM

`class MyAdapter extends LlmAdapter { async *stream(options): AsyncIterable<StreamChunk> }` → `ctx.llm.registerAdapter(['provider'], adapter)`.
Protocolo de chunks: `block-start` → `text-delta*` → `block-end` (bloque completo) → … → `usage` (antes de finish) → `finish` (último; `reason: {kind:'stop'|'tool-calls'}`). Lanza `LlmError` con código estable para los campos que no puedas cumplir.

## Reglas estrictas (violarlas = fallos de puerta / mal comportamiento)

1. Todo registro pasa por `ctx.effect()` / `ctx.on()` / el `register()` de un servicio (devuelve disposer).
2. Los listeners de waterfall deben llamar `next()`; no llamarlo cortocircuita por diseño.
3. Visible-para-el-modelo ⇔ registrado: una nueva entrada visible requiere un nuevo evento de sesión (`SessionEventMap`).
4. Nunca codifiques valores ajustables (prueba: ¿puede cambiarlos cordis.yml?); la mala configuración falla en voz alta.
5. Paquetes de plugin independientes: cordis es peerDependency con la misma identidad del host (mezclar scoped `@deepseek-ai/cordis` y unscoped divide identidades); ESM; manifiesto `dsh.bundle`; instalaciones git necesitan `prepare` + `allowBuilds`; publica `lib/` o un tarball.
6. Documentación bilingüe en pares; descripciones/prompts son comportamiento; cambios no triviales llevan Agent Note; ejecuta el conjunto mínimo de checks antes de empujar (dsh-pre-push-checks).
7. Los ids opacos entre límites son branded (`Branded<B>` de `dsh-brand`), nunca `string` pelado.
8. Los miembros de `SessionEventMap` son required-on-read: el sobre `ignorable` desaparece en 0.1.2-alpha.1 (la lectura falla cerrada — un build que no conoce un tipo de evento rechaza el log), y los appends de eventos propios de plugins cruzan una puerta adaptativa que deja de escribir en hosts sin sobre; solo los cambios de formato estructural bumpan `SESSION_FORMAT_VERSION`. El switch sobre `SessionEvent` cae por un `default` documentado — sin `assertNever` (unión merge-extensible).

## Lista rápida de trampas comunitarias (detalles: guía §7.3 / community-repo-deep-dive.md)

- Trío de tsconfig: `moduleResolution: bundler` + `allowImportingTsExtensions` + `rewriteRelativeImportExtensions` (+ `lib:["ES2024"]`, `types:["node"]` explícito).
- `tsc` emite pese a errores → `tsc || exit 1` / `--noEmitOnError`; busca imports `.ts` residuales en el build antes de publicar.
- Junctions de Windows con PowerShell `New-Item -ItemType Junction`; la letra de unidad de vitest en mayúscula `C:/`.
- `DSH_PERMISSION_MODE=danger-full-access` es de alto riesgo (sin backend de sandbox en Windows, aprobaciones desactivadas); `DSH_*` en `~/.dsh/.env` rompe el arranque.
- Los archivos de sesión son zstd multiframe: usa `scanZstdFrames`/`createZstdFrameDecoder` (`@deepseek-ai/dsh-session-persistence-jsonl/src/zstd.ts`).
- npm: `dsh` sin alcance es el proyecto ajeno node-dsh (un shell) — instala `@deepseek-ai/dsh`; `@deepseek-ai/dsh-tools` y `@deepseek-ai/dsh-session-persistence-jsonl` tienen `latest` obsoleto (0.0.1-rc.1), fija `next` (0.1.0-rc.6); `create-dsh-plugin` ya está publicado (0.1.1, 2026-08-13); dsh-core/dsh-sdk siguen sin publicarse (verificado 2026-08-14).
- Haz `resolve()` en ambos lados antes de comparar rutas (trampa de barras invertidas de Windows).

## Enlaces de documentación

Documentación oficial de desarrollo — base del sitio <https://deepseek-harness.github.io/deepseek-harness> (la raíz es chino, `en/` es inglés; copias locales textuales en `references/official-docs/docs/`):

- Básico: [develop/basic/](https://deepseek-harness.github.io/deepseek-harness/develop/basic/) → [tool](https://deepseek-harness.github.io/deepseek-harness/develop/basic/tool) · [config](https://deepseek-harness.github.io/deepseek-harness/develop/basic/config) · [publish](https://deepseek-harness.github.io/deepseek-harness/develop/basic/publish)
- Framework: [develop/framework/](https://deepseek-harness.github.io/deepseek-harness/develop/framework/) ([service](https://deepseek-harness.github.io/deepseek-harness/develop/framework/service), [events](https://deepseek-harness.github.io/deepseek-harness/develop/framework/events)) · Práctica: [develop/practice/](https://deepseek-harness.github.io/deepseek-harness/develop/practice/) ([LLM adapter](https://deepseek-harness.github.io/deepseek-harness/develop/practice/llm-adapter))
- Guías: [quickstart](https://deepseek-harness.github.io/deepseek-harness/guide/quickstart) · [providers](https://deepseek-harness.github.io/deepseek-harness/guide/providers) · [python-sdk](https://deepseek-harness.github.io/deepseek-harness/guide/python-sdk)
- Cordis: [primer](https://deepseek-harness.github.io/deepseek-harness/reference/cordis-primer) · [tutorial](https://deepseek-harness.github.io/deepseek-harness/develop/cordis-tutorial/) · [core API](https://deepseek-harness.github.io/deepseek-harness/reference/cordis-api/context)
- Referencia: [architecture](https://deepseek-harness.github.io/deepseek-harness/reference/) · [cookbook/adding-a-tool](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/adding-a-tool) · [cookbook/extension-cookbook](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/extension-cookbook) · [subsystems](https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/)
- Índice completo URL ↔ copia local: [guide/links.md](links.md)

Documentación comunitaria de desarrollo — plantillas/tutoriales/errores, lista completa en [references/community-ecosystem.md](../references/community-ecosystem.md): [plugin-template](https://github.com/omdsh-dev/plugin-template) · [dsh-plugin-dev pitfalls](https://github.com/omdsh-dev/dsh-plugin-dev) · [from-scratch tutorial](https://github.com/Opr4Mp3r/deepseek-harness-plugin-from-scratch) · [dsh-plugin-check](https://github.com/omdsh-dev/dsh-plugin-check)

## Índice de fuentes clave

- Documentación oficial textual: `references/official-docs/docs/**` (215 páginas, incluye pares `.zh.md`)
- Restricciones raíz del repo: `references/official-docs/AGENTS.md`, `references/official-docs/packages/AGENTS.md`, `references/official-docs/examples/AGENTS.md`, `references/official-docs/vendor/README.md`; estado de sincronización en `references/official-docs/SNAPSHOT.md`
- HTML del sitio: `downloads/web/site/**` (sitio completo EN+ZH) + `downloads/manifest.tsv`
- Cordis upstream: `downloads/github/cordis/**` + investigación `references/upstream-cordis.md`
- Paper de Cordis: `downloads/github/paper/**` + investigación `references/cordis-paper-and-community.md`
- Investigación del sitio web: `references/website-pages.md`
- Investigación del repo: `references/harness-repo.md`
- Comunidad/ecosistema: `references/community-ecosystem.md` + `references/community-repo-deep-dive.md`
- Todas las URLs de fuentes: `references/sources.md`
