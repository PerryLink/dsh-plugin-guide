<div align="center">

# 🐳 dsh-plugin-guide

**Todo lo que necesitas para construir plugins de [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).**

*Archivo de documentación oficial · primer de Cordis · deep-dives de la comunidad · trampas probadas en batalla · agent skill · toolchain CLI*


```sh
dsh plugin --profile web add dsh-plugin-guide
```
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Gitee](https://img.shields.io/badge/Gitee-mirror-c71d23?logo=gitee)](https://gitee.com/perrylink/dsh-plugin-guide)
[![DSH plugin](https://img.shields.io/badge/dsh--plugin-✅-green)](https://github.com/topics/dsh-plugin)
[![dsh-doctor](https://raw.githubusercontent.com/PerryLink/dsh-plugin-doctor/main/badges/PerryLink__dsh-plugin-guide.svg)](https://github.com/PerryLink/dsh-plugin-doctor#verified-徽章)
[![DSH Market](https://raw.githubusercontent.com/2BingLing/dsh-market/master/assets/readme/badge-top-rated.svg)](https://dsh.market/)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-plugin-guide/verify.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-plugin-guide/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-plugin-guide?label=version)](https://github.com/PerryLink/dsh-plugin-guide/releases)
[![npm version](https://img.shields.io/npm/v/dsh-plugin-guide)](https://www.npmjs.com/package/dsh-plugin-guide)
[![npm downloads](https://img.shields.io/npm/dm/dsh-plugin-guide)](https://www.npmjs.com/package/dsh-plugin-guide)
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-plugin-guide?metric=downloads&lang=es)](https://dshfind.com/es/plugins/PerryLink/dsh-plugin-guide?ref=badge)

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

```sh
dsh plugin --profile <name> add dsh-plugin-guide
```


</div>

---

**📖 ¿Prefieres leerlo como sitio web?** [perrylink.github.io/dsh-plugin-guide](https://perrylink.github.io/dsh-plugin-guide/) — cada capítulo en su propia página, más un [llms.txt](https://perrylink.github.io/dsh-plugin-guide/llms.txt) legible por máquina para asistentes.

## Install & uninstall

- **canal git** (último `main`): `dsh plugin --profile web add github:PerryLink/dsh-plugin-guide#<sha>` — fija un commit para reproducibilidad; el punto de entrada es JS ESM plano, sin paso de build.
- **canal npm** (versiones publicadas): `dsh plugin --profile web add dsh-plugin-guide`.
- **canal tarball**: `pnpm pack` en este repo, luego `dsh plugin --profile web add ./dsh-plugin-guide-<version>.tgz`.
- **desinstalar**: `dsh plugin --profile web remove dsh-plugin-guide`.

## Why not just read the official docs?

Porque está escrita para quien ya sabe qué página abrir, y DSH publica **una versión preliminar cada 1,7–2,8 días** con cambios que rompen compatibilidad. Este plugin cubre las tres brechas que más tiempo cuestan:

| Brecha | Qué añade este plugin |
|---|---|
| **"¿Contra qué versión estoy desarrollando?"** | Una [matriz de versiones](guide/version-matrix.md): los cuatro valores que se llaman "latest", las etiquetas `latest` congeladas de los subpaquetes, las fallas de compatibilidad y cómo elegir un rango en `peerDependencies`. **No existe una línea estable** — toda versión publicada es preliminar. |
| **"¿Qué rompe esta versión?"** | Una [guía de migración](guide/migration-0.2.md) que expone `0.1.6-alpha.2` → `0.2.1-alpha.2` como **seams citables**, cada uno con síntoma *y* arreglo y su fuente oficial — incluida una pérdida de datos y un cambio que hace fallar los prompts antes de construir la petición al modelo. |
| **"¿Mi plugin es realmente correcto?"** | Una [CLI sin dependencias](SKILL.md) (`dsh-plugin-dev new / check / verify`) y un [espejo literal y sin conexión](references/official-docs/) de la documentación oficial, para que el agente cite la página exacta. |

**Compruébalo en 60 segundos:**

```sh
dsh plugin --profile web add dsh-plugin-guide
```

<!-- star-cta -->
## ⭐ 如果它帮到了你

Este plugin forma parte de la [familia de plugins DSH](https://github.com/PerryLink) (más de 40, todos Apache-2.0). Si te resulta útil, **dale una estrella**: no desbloquea nada, pero ayuda a que la siguiente persona lo encuentre antes.

*English:* part of a 95 plugin family for DeepSeek Harness. If it is useful, **a star helps the next person find it** — nothing is gated behind it.

## What is dsh-plugin-guide?

Todo lo que necesitas para construir plugins de [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).

Archivo de documentación oficial · primer de Cordis · deep-dives de la comunidad · trampas probadas en batalla · agent skill · toolchain CLI

![Demostración de terminal de dsh-plugin-guide: dsh-plugin-guide — install the bundle, then run the checker](https://raw.githubusercontent.com/PerryLink/dsh-plugin-guide/main/docs/assets/dsh-plugin-guide-hero.png)

![Animated terminal demo of dsh-plugin-guide](https://raw.githubusercontent.com/PerryLink/dsh-plugin-guide/main/docs/assets/dsh-plugin-guide-demo.gif)

*La misma ejecución, animada.*

## Comparison

![Gráfico comparativo medido de dsh-plugin-guide](https://raw.githubusercontent.com/PerryLink/dsh-plugin-guide/main/docs/assets/dsh-plugin-guide-evidence.png)

content counts as stated in the README (What you get)

## Compatibility

| Surface | Status |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.2.1-alpha.2` (`d743267388641bc76f17c45ce8b4c231aed1d32c`, el tag más nuevo de master **y** HEAD, 2026-10-09); npm `latest` = `0.2.0-rc.2`, `alpha` = `0.2.1-alpha.2`. Re-verificado el 2026-10-06 contra ese checkout (cadena de gates + smoke de instalación de perfil). La base de conocimiento, el espejo de docs oficiales y [guide/migration-0.2.md](guide/migration-0.2.md) usan esta línea base. |
| Node | `^22.19.0 || >=24.0.0` (runtime de DeepSeek Harness) |
| Platforms | Todas (bundle ESM plano; sin código nativo, sin red) |
| Model | Cualquiera (sin interacción con el modelo) |

## What you get

`dsh-plugin-guide` es la base de conocimiento de desarrollo de plugins DSH, empaquetada como un bundle instalable que registra todo como la skill de agente `dsh-plugin-guide`. La skill permanece visible en el catálogo de cada sesión y carga sus pasos de flujo de trabajo, documentación oficial y deep-dives de la comunidad bajo demanda.

- **Contrato de plugin y reglas duras** — effects/disposers, waterfall `next()`, visible para el modelo ⟺ registrado, configuración Schemastery.
- **Archivo de documentación oficial** — una copia textual de la documentación oficial del repo (EN + ZH), byte-idéntica al upstream en la última instantánea verificada.
- **Primer de Cordis** — los cinco conceptos y la línea de tiempo de mecanismos (repository-plugin introducido 0809, eliminado 0811; los dos canales de instalación).
- **20+ trampas del mundo real** con causa raíz + arreglo (copias duales de cordis, trío tsconfig, sesiones zstd multi-frame, junctions de Windows, `latest` obsoleto de npm, …).
- **Deep-dives de la comunidad** — 114 repositorios de la comunidad archivados (15 con deep-dive), más un índice fuente completo donde cada hecho enlaza a su origen.
- **Toolchain CLI** — `dsh-plugin-dev new / check / verify`: genera, verifica estáticamente y valida el empaquetado de plugins DSH; cada check enlaza a la sección de la skill que aplica.

- **Adaptabilidad de versión** — [guide/version-matrix.md](guide/version-matrix.md): los cuatro valores "latest", las etiquetas `latest` congeladas, las fallas de compatibilidad, cómo elegir el rango de peers y los 19 cambios de `0.2.1-alpha.2`.
- **Enrutador de la cadena de herramientas** — [guide/family-toolchain.md](guide/family-toolchain.md): qué herramienta responde a cada pregunta, el catálogo completo de 33 comprobaciones de `dsh-plugin-doctor` y su cruce con las 16 de este repositorio.
- **Decisión sobre el alcance del espejo** — [references/mirror-scope-decision.md](references/mirror-scope-decision.md): por qué "eliminar lo no referenciado para ahorrar un 80%" **no se sostiene** al volver a medirlo.
- **Destilado de la skill oficial** — [references/official-plugin-dev-skill.md](references/official-plugin-dev-skill.md): prohibiciones, metadatos de presentación y reglas de UI/rendimiento de la skill oficial `cordis-plugin-development`.
## Knowledge base

| Path | Qué es |
|---|---|
| `SKILL.md` | La skill de agente `dsh-plugin-guide`: reglas duras + rutas de desarrollo por tarea |
| `package.json` · `cordis.patch.yml` · `index.js` | El bundle DSH instalable: manifiesto `dsh.bundle.patch` + punto de entrada que registra la skill |
| `guide/plugin-dev-guide.md` | La guía de desarrollo completa (10 capítulos) |
| `guide/quick-reference.md` | Hoja de referencia de una página (5 idiomas) |
| `guide/links.md` | Índice de URL curado: documentación oficial de desarrollo (sitio ↔ copias locales) + enlaces de documentación de la comunidad |
| `guide/when-to-retire-a-plugin.md` | Retirar y congelar plugins: los criterios y los datos medidos de una auditoría de cartera (EN + ZH) |
| `guide/choosing-a-plugin.md` | Elegir un plugin: quién lidera cada capacidad, con los números medidos y las advertencias de verificación (EN + ZH) |
| `references/official-docs/` | Copia textual de la documentación oficial del repo (EN + ZH) |
| `references/*.md` | Informes de investigación: documentación del repo, sitio web, Cordis, el paper, ecosistema de la comunidad, archivo de 114 repos (15 con deep-dive) |
| `scripts/` | Scripts de descarga idempotentes + verificador de integridad + generador de instantáneas de tema |
| `bin/` · `src/cli/` · `dist/` | El CLI `dsh-plugin-dev`: scaffolder, checker, verifier (TypeScript, empaquetado con tsdown) |
| `templates/` | Esqueletos TS + JS: plantilla de contrato, Config, tests, cordis.patch.yml, READMEs en cinco idiomas |
| `downloads/` | Instantáneas crudas — generadas por `scripts/`, no confirmadas |
| `guide/version-matrix.md` | **Matriz de adaptabilidad de versión**: los cuatro valores "latest", etiquetas congeladas, fallas de compatibilidad, selección de rango de peers, linaje del formato de sesión y los 19 cambios de `0.2.1-alpha.2` |
| `guide/family-toolchain.md` | **Enrutador de la cadena de herramientas**: pregunta → propietario → artefacto citable; catálogo completo de 33 comprobaciones de `dsh-plugin-doctor` y cruce con las 16 de este repositorio |
| `guide/migration-0.2.md` | Guía de cambios que rompen compatibilidad de la generación 0.2 (§0–§12 hasta `0.2.1-alpha.1`; **§13 cubre los 19 seams de `0.2.1-alpha.2`**) |
| `references/mirror-scope-decision.md` | Registro de decisión sobre el alcance del espejo: por qué no se recorta por "cero referencias", con el script de medición reproducible |

## CLI toolchain

El bundle incluye el CLI `dsh-plugin-dev` sin dependencias de runtime (`bin/` → `dist/dsh-plugin-dev.js` empaquetado con tsdown). Cada check cita la sección de la skill que aplica, para que un agente pueda seguir auditando manualmente.

```sh
dsh-plugin-dev new <name> [--lang ts|js] [--dir <path>] [--force] [--git]
dsh-plugin-dev check [--cwd <dir>] [--json] [--strict]
dsh-plugin-dev verify [--cwd <dir>] [--dsh <bin>] [--pnpm <bin>]
dsh-plugin-dev seams <query> | --since <version>   # ¿existe esta API en mi host destino?
```

| Subcomando | Qué hace |
|---|---|
| `new <name>` | Genera un repo de plugin TS o JS: plantilla de contrato `src/index.ts`, Config de Schemastery, tests, tsdown/vitest, `cordis.patch.yml` comentado, READMEs en cinco idiomas. Idempotente; rechaza destinos no vacíos sin `--force`. |
| `check` | Checks estáticos: validez de `cordis.patch.yml`, metadatos de `package.json` (puntero `dsh.bundle.patch`, peer deps, engines, lista blanca de files), consistencia de READMEs en cinco idiomas, patrones de línea roja de ingeniería. Emite JSON consumible por CI. |
| `verify` | `pnpm pack`, luego instala/inicia/desinstala el bundle en un perfil `DSH_HOME` mkdtemp limpio (alineado con `verify:self-contained`). Los fallos reportan la cola del log más sugerencias. |

### CLI configuration

El CLI no tiene ajustes hardcodeados — cada uno es un flag o una variable de entorno.

| Ajuste | Flag | Env | Por defecto |
|---|---|---|---|
| Directorio de plantillas | — | `DSH_PLUGIN_DEV_TEMPLATES` | `<package>/templates` |
| Binario dsh | `--dsh` | `DSH_PLUGIN_DEV_DSH` | `dsh` |
| Binario pnpm | `--pnpm` | `DSH_PLUGIN_DEV_PNPM` | `pnpm` |
| Timeout de instalación/pack | `--timeout` | `DSH_PLUGIN_DEV_TIMEOUT` | `300000` ms |
| Timeout de smoke headless | `--smoke-timeout` | `DSH_PLUGIN_DEV_SMOKE_TIMEOUT` | `120000` ms |

### Upstream roadmap

`dsh-plugin-dev` es un candidato upstream para el CLI oficial de desarrollo de plugins (ítem C12): el scaffolder/checker/verifier son las capas mecánicas, mientras que `SKILL.md` + `guide/` siguen siendo la capa cognitiva.

## Quick start

```sh
# 1. install the bundle into your profile
dsh plugin --profile web add github:PerryLink/dsh-plugin-guide

# or from npm (published releases)
dsh plugin --profile web add dsh-plugin-guide

# 2. restart and verify the row
dsh --profile web --dump-config | grep -A3 'id: dsh-plugin-guide'
```

Luego pídele a tu agente: *"Usa la skill dsh-plugin-guide para construirme un plugin de …."*

O maneja el CLI directamente:

```sh
npx dsh-plugin-guide new hello-plugin            # genera un repo de plugin TS
npx dsh-plugin-guide check --json                # check estático
npx dsh-plugin-guide verify                      # pack + smoke de perfil limpio
```

## Copy as a plain agent skill

También puedes copiar la carpeta completa al directorio de skills de tu agente (las rutas relativas permanecen intactas):

```powershell
# Windows (PowerShell)
pwsh -File scripts/install-skill.ps1 `
  -Target "$env:USERPROFILE\.deepseek\skills\dsh-plugin-guide"   # o <project>\.agents\skills\dsh-plugin-guide
```

```bash
# macOS / Linux
pwsh -File scripts/install-skill.ps1 -Target ~/.deepseek/skills/dsh-plugin-guide   # o <project>/.agents/skills/dsh-plugin-guide
```

El instalador omite `downloads/` (generado) y `.github/`, y luego verifica cada archivo copiado byte a byte. Un `Copy-Item -Recurse` manual de toda la carpeta también funciona.

## Configuration

El bundle de skill no expone ningún `Config` de Schemastery — registra la base de conocimiento como una skill de agente sin claves ajustables. El CLI `dsh-plugin-dev` lee sus ajustes de flags y variables de entorno `DSH_PLUGIN_DEV_*` (ver [CLI toolchain](#cli-toolchain)).

## Tools & surfaces

| Surface | Kind | Notes |
|---|---|---|
| `dsh-plugin-guide` | skill | Registrada vía `ctx.skills`; carga `SKILL.md` + `./guide/` + `./references/` bajo demanda |
| `dsh-plugin-dev` | bin (CLI) | Subcomandos `new` / `check` / `verify`; no es una fila de plugin DSH |

## Permissions & data

- **Permissions**: declara `filesystem:read` en su manifiesto de workshop.
- **Data**: solo lectura — lee sus propios archivos empaquetados `guide/` y `references/`. Sin solicitudes de red, sin escrituras, sin llamadas al modelo.

## Security boundaries

- **Base de conocimiento de solo lectura.** El bundle solo lee sus propios archivos; nunca escribe, nunca usa la red y nunca invoca un modelo.
- **La documentación oficial son copias textuales.** `references/official-docs/` nunca se edita aquí; reporta problemas al upstream y vuelve a sincronizar solo con `scripts/sync-official-docs.ps1`.
- **Límites de distribución.** El contenido de terceros empaquetado conserva su licencia de upstream; consulta [NOTICE.md](NOTICE.md) (p. ej. `downloads/` es solo local; `awesome-dsh-plugins` no debe redistribuirse).

## Known limitations

- **La documentación oficial es una instantánea.** Vuelve a sincronizar con `scripts/sync-official-docs.ps1` cuando el upstream se mueva; el sello de frescura y el hash de commit referencian `references/official-docs/SNAPSHOT.md`.
- **`downloads/` es generado, no confirmado.** Las instantáneas crudas (archivos de repos de la comunidad, Discussions, artículos) deben generarse con los scripts antes de usarse.
- **El contenido de `awesome-dsh-plugins` es solo local.** Su upstream declara una restricción de uso interno, por lo que no se redistribuye con el repo.

## Release channels

Todos los canales resuelven desde este repositorio o desde npm, así que **una etiqueta llega a todos**; solo el espejo de Gitee es una copia programada:

| Canal | Fuente de verdad | Cómo se actualiza |
|---|---|---|
| npm (`dsh-plugin-guide`) | el `package.json` de este repositorio | `.github/workflows/release.yml` en una etiqueta `v*`: puerta `verify-kit` → comprobación de la sección del CHANGELOG → `npm publish --provenance` (se omite si la versión ya existe) |
| GitHub Release | la misma etiqueta | el mismo workflow la crea de forma idempotente |
| Insignias de descubrimiento (versión npm, etiqueta de GitHub, DSH Market, dsh-doctor) | consultas en vivo | no hay nada que publicar: leen npm/el registro en cada render |
| Espejo de Gitee | este repositorio | **espejo programado de solo lectura**, no un destino de publicación: el workflow `gitee-sync` de la familia lo alinea al tip de GitHub con `--force-with-lease`, así que `main` suele ir una ejecución programada por detrás. **Aquí nunca se empuja una etiqueta a Gitee**; compara con `git ls-remote` antes de reportar el espejo como obsoleto |
| DSH Desktop Market / dsh1024 | npm | el mercado instala el paquete de npm, así que una versión publicada es instalable de inmediato; no hay envío por versión |
## Keeping it fresh

```sh
pwsh -File scripts/sync-official-docs.ps1                     # copia textual de docs desde un checkout local
pwsh -File scripts/download-sources.ps1                       # sitio/docs oficiales, Cordis, paper
pwsh -File scripts/download-community-repos.ps1               # repositorios de la comunidad (tarballs codeload)
pwsh -File scripts/download-community-articles.ps1            # artículos de la comunidad zh/en/HN
pwsh -File scripts/archive-discussions.ps1                    # Discussions oficiales (necesita $env:GH_TOKEN)
pwsh -File scripts/gen-topic-snapshot.ps1 -OutDir <dir>       # censo del tema dsh-plugin
pwsh -File scripts/verify-kit.ps1 -Checkout <checkout>        # rutas críticas + escaneo de enlaces + deriva de docs
```

## Development

El bundle de skill (`index.js`) es ESM plano, sin paso de build; el CLI `dsh-plugin-dev` es TypeScript compilado con tsdown. Puertas:

```sh
pnpm install --frozen-lockfile
pnpm run typecheck && pnpm run typecheck:ci
pnpm test
pnpm run build
pnpm run verify:artifacts        # auto-check + smoke de scaffold (sin red)
pnpm run verify:self-contained   # pack + smoke de instalación/inicio/desinstalación en perfil limpio
pnpm run check:readmes           # five READMEs share section structure
pnpm run check:parity            # translations have identical block counts
pnpm run check:facts             # self-stated numbers match data/facts.json
pnpm run check:ps1-bom           # PowerShell scripts keep their UTF-8 BOM
pnpm pack
pwsh -File scripts/verify-kit.ps1   # rutas críticas + escaneo de enlaces (+ deriva de docs con -Checkout <checkout>)
```

## Topics

`dsh`, `deepseek-harness`, `dsh-plugin`, `cordis`, `agent-skill`, `plugin-development`, `knowledge-base`, `cli`, `scaffold`, `checker`

## Contributors

- [PerryLink](https://github.com/PerryLink) — creador y mantenedor: contenido de la base de conocimiento, la transformación a bundle instalable, envíos al ecosistema e ingeniería de comunidad.
- [@Yisa-yi](https://github.com/Yisa-yi) — **product manager**. Participó en todo el arco de diseño, desde el primer esquema hasta el bundle publicado, y se ocupó de la forma del producto más que de su código: la decisión de que se entregara como bundle instalable que registra una agent skill bajo demanda (el sitio de documentación renderiza esas mismas fuentes y no un conjunto de contenido aparte), la arquitectura de la información de la guía de 10 capítulos, la regla de que cada hecho enlace con su origen, y la separación entre la capa cognitiva (`SKILL.md` + `guide/`) y la capa mecánica (`dsh-plugin-dev new / check / verify`). Fijó el estándar de evidencia de `guide/unfixed-issues.md` — `path:line` contra un commit concreto del host, la tabla diseño-vs-bug y una sección explícita de no reproducible — y los criterios de congelación y retirada de `guide/when-to-retire-a-plugin.md`. Sostuvo la línea de alcance (solo lectura, sin red, sin llamadas al modelo, sin claves configurables) y el requisito de paridad de los README en cinco idiomas.
- El mantenimiento diario está asistido por agentes de DeepSeek Harness (no tienen cuenta de GitHub y se listan aquí por transparencia, no como contribuyentes).

## PerryLink DSH Plugin Family

Este proyecto es uno de los **87 plugins activamente mantenidos** de DeepSeek Harness de [PerryLink](https://github.com/PerryLink). El registro familiar tiene **95** plugins — **5 congelados**, **3 retirados** — y permanece plegado abajo para que cada README conserve una primera pantalla corta. Expándelo para ver cada fila, con el motivo en la columna Estado.

<details>
<summary>Expandir los 95 plugins</summary>

| Plugin | Una línea | Estado |
|---|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** | 水产养殖投入品记录核对（按投入品用量、休药期与起捕间隔核对记录自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** | 档案归档完整性与保管期限核对（依据《档案法》及配套规定，仅提示差异，不作出定性结论） |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** | Second-model auto-review on the approval chain, fail-closed by default |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | Automatic strong/cheap model-tier routing with deterministic risk guards and a `/tier` command |  |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | Durable background child agents with a Web UI sidebar, messaging and interrupt | 🚫 RETIRADO — ver el README del repositorio |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** | 投标文件符合性预检（按招标文件逐条核对响应情况，仅提示差异，不作出定性结论） |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** | 投标人资格条件核对（按资格条件与证明材料核对逐条响应，仅提示差异，不作出定性结论） |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | Cost governance for DeepSeek Harness: budgets, carbon, and latency in one panel. | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | Read-only MCP server exposing the certification registry: grades, snapshots and five-dimension evidence |  |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** | Claude Code /rewind-equivalent: snapshots, session forks, one-shot restore |  |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | Migrate Claude Code sessions, memory, skills and CLAUDE.md into DSH | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** | Cross-platform native desktop control for DeepSeek Harness — Windows first. |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** | Terminal-style input history for the web composer: arrows, Ctrl+R search |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** | 合同条款立场台账核对（按立场、风险等级与退让底线核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** | 报关单证一致性核对（按公开的报关单填制规范核对单证间字段一致性，仅提示差异，不作出定性结论） |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** | Dataset quality checks and citation cross-checks (the optional numeric bridge consumed here) |  |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | Prompt-injection, jailbreak, and secret-leak defense for DeepSeek Harness. | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** | 滞箱费台账核对（按免箱期与费率核对超期天数与金额的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** | Engineering-discipline guard: requirements grill, test gates, adversary review |  |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | Unified static-image generation routing for DeepSeek Harness. | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-drill-script-check](https://github.com/PerryLink/dsh-drill-script-check)** | 应急演练脚本核对（按阶段、响应分级、指挥与资源要素核对脚本齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-eia-guide-check](https://github.com/PerryLink/dsh-eia-guide-check)** | 环评导则适用性核对（按要素、导则名称与执行标准核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-emergency-plan](https://github.com/PerryLink/dsh-emergency-plan)** | 应急预案要素齐备性与条款级页码定位（依据 GB/T 29639-2020 等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-essay-rubric-check](https://github.com/PerryLink/dsh-essay-rubric-check)** | 作文量表评分核对（按评分项、原文定位与分值算术核对评分自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-evidence-check](https://github.com/PerryLink/dsh-evidence-check)** | 证据清单齐备性核对（按待证事实与证据要素核对清单自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-export-ctl-check](https://github.com/PerryLink/dsh-export-ctl-check)** | 出口管制物项核对（按管制清单、最终用途与许可证核对台账齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-fast](https://github.com/PerryLink/dsh-fast)** | Read-only performance diagnostics for DeepSeek Harness. |  |
| **[dsh-fmea-table-check](https://github.com/PerryLink/dsh-fmea-table-check)** | FMEA 分析表要素齐备性与风险顺序数一致性核对（按公开的 FMEA 方法标准核对表内自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-forecast-penalty](https://github.com/PerryLink/dsh-forecast-penalty)** | 预测准确率考核核对（按准确率、门槛与考核单价核对考核费用的算术自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-fund-research](https://github.com/PerryLink/dsh-fund-research)** | Deterministic research reports for Chinese public mutual funds |  |
| **[dsh-github](https://github.com/PerryLink/dsh-github)** | GitHub PR/issues integration for DSH, every write gated by approval |  |
| **[dsh-gongwen-flow-check](https://github.com/PerryLink/dsh-gongwen-flow-check)** | 公文流转与办理时限核对（按公开的公文处理规范核对环节完整性与时限，仅提示差异，不作出定性结论） |  |
| **[dsh-gongwen-word-check](https://github.com/PerryLink/dsh-gongwen-word-check)** | 公文格式要素核对（按公开的党政机关公文格式标准核对版头与主体要素，仅提示差异，不作出定性结论） |  |
| **[dsh-guard-plan-qc](https://github.com/PerryLink/dsh-guard-plan-qc)** | 劳动保护与安全防护用品配置表核对（按公开的配备标准核对品名规格与配置数量，仅提示差异，不作出定性结论） |  |
| **[dsh-hazchem-check](https://github.com/PerryLink/dsh-hazchem-check)** | 危险化学品临界量与重大危险源辨识核对（按储存量与临界量核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-hazplan-check](https://github.com/PerryLink/dsh-hazplan-check)** | HAZOP 分析表要素齐备性与偏差推导一致性核对（依据公开的危险与可操作性分析标准，仅提示差异，不作出定性结论） |  |
| **[dsh-hidden-risk-map](https://github.com/PerryLink/dsh-hidden-risk-map)** | 安全隐患台账→《工贸企业重大事故隐患判定标准》（应急管理部令第10号）条款映射提示（仅提示差异，不作出定性结论） |  |
| **[dsh-hs-classify](https://github.com/PerryLink/dsh-hs-classify)** | 商品归类层级一致性核对（按章、品目、子目与商品编号的层级关系核对自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-icd-rule-check](https://github.com/PerryLink/dsh-icd-rule-check)** | ICD 合并编码与星剑号配对提示（依据 GB/T 14396-2016 与公开的 ICD 使用说明，仅提示差异，不作出定性结论） |  |
| **[dsh-industry-research](https://github.com/PerryLink/dsh-industry-research)** | Industry research orchestration that seals its deliverables through this plugin's `ctx.researchReport.assemble` |  |
| **[dsh-lawcite-adapter](https://github.com/PerryLink/dsh-lawcite-adapter)** | 法条引用与文书要素核对（按名称、条号、原文与效力状态核对引用可核验性，仅提示差异，不作出定性结论） |  |
| **[dsh-laya](https://github.com/PerryLink/dsh-laya)** | Laya typed decisions (`noul`/`choice`/`score`) as a first-class Cordis service and model-visible tools |  |
| **[dsh-lc-doc-check](https://github.com/PerryLink/dsh-lc-doc-check)** | 信用证单据条款核对（按单据种类、份数、期限与不符点核对交单自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-learning-gap-check](https://github.com/PerryLink/dsh-learning-gap-check)** | 能力差距与培养计划核对（按能力等级差、培养措施与完成期限核对台账闭环，仅提示差异，不作出定性结论） |  |
| **[dsh-library](https://github.com/PerryLink/dsh-library)** | Local document knowledge base for DeepSeek Harness. |  |
| **[dsh-local-ai](https://github.com/PerryLink/dsh-local-ai)** | Local-model (Ollama) integration for DeepSeek Harness. |  |
| **[dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions)** | LSP diagnostics, formatting, completion, code actions and rename over language servers |  |
| **[dsh-mask](https://github.com/PerryLink/dsh-mask)** | PII masking middleware: anonymize at the model boundary, restore at the display layer |  |
| **[dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel)** | Read-only MCP runtime panel: /mcp command + Settings tab with status, tools and errors |  |
| **[dsh-medrec-qc](https://github.com/PerryLink/dsh-medrec-qc)** | 病案首页形式质控与逻辑矛盾提示（依据国卫办医发〔2016〕24号等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** | Approval-gated cross-session memory: ctx.memory seam + SQLite + memory tool |  |
| **[dsh-nsfc-form-check](https://github.com/PerryLink/dsh-nsfc-form-check)** | 国家自然科学基金申请书形式审查与匿名化提示（依据《国家自然科学基金条例》与申请人导入的当年指南，仅提示差异，不作出定性结论） |  |
| **[dsh-nurse-record-check](https://github.com/PerryLink/dsh-nurse-record-check)** | 护理记录时限、签名与评估表完整性校验（依据《病历书写基本规范》等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-observe](https://github.com/PerryLink/dsh-observe)** | OpenTelemetry and Langfuse observability exporter for DeepSeek Harness. |  |
| **[dsh-origin-rvc-check](https://github.com/PerryLink/dsh-origin-rvc-check)** | 原产地区域价值成分核对（按 RVC 定义式与门槛核对原产地判定自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-ota-review-check](https://github.com/PerryLink/dsh-ota-review-check)** | 在线点评回复台账核对（按回复时限、问题分类与整改状态核对台账闭环，仅提示差异，不作出定性结论） |  |
| **[dsh-output-styles](https://github.com/PerryLink/dsh-output-styles)** | Claude Code outputStyles-equivalent runtime style switching |  |
| **[dsh-paper-doc-adapter](https://github.com/PerryLink/dsh-paper-doc-adapter)** | 试卷解析结构核对（按题型、答案、分值与 yotta 标识核对试卷结构自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** | Claude Code-style declarative allow/deny/ask permission rules with audit |  |
| **[dsh-permit-report-check](https://github.com/PerryLink/dsh-permit-report-check)** | 行政许可办理核对（按申请材料、法定时限与决定记录核对台账闭环，仅提示差异，不作出定性结论） |  |
| **[dsh-pipeline-check](https://github.com/PerryLink/dsh-pipeline-check)** | 项目全流程文件链条核对（按环节先后与金额口径核对链条自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-pleading-draft](https://github.com/PerryLink/dsh-pleading-draft)** | 起诉状要素齐备性核对（按诉请、事实、证据、法条四要素核对文书齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-plugin-doctor](https://github.com/PerryLink/dsh-plugin-doctor)** | Zero-dependency static + sandbox smoke detector for DSH plugins |  |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** | Plugin-development knowledge base as an on-demand agent skill |  |
| **[dsh-plugin-kit](https://github.com/PerryLink/dsh-plugin-kit)** | Shared zero-runtime-dependency toolkit for the PerryLink DSH plugins |  |
| **[dsh-plugin-upgrade](https://github.com/PerryLink/dsh-plugin-upgrade)** | One-package, one-corridor-index plugin upgrade skill: routes a repository to the matching closed corridor card |  |
| **[dsh-policy-brief-draft](https://github.com/PerryLink/dsh-policy-brief-draft)** | 政策专报要素核对（按观点、依据、出处与建议核对专报齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-power-loss-split](https://github.com/PerryLink/dsh-power-loss-split)** | 线损电量拆分与考核表核对（依据公开的线损计算口径，仅提示差异，不作出定性结论） |  |
| **[dsh-power-ticket-check](https://github.com/PerryLink/dsh-power-ticket-check)** | 电力工作票要素齐备性与签发许可顺序核对（依据现行电力安全工作规程，仅提示差异，不作出定性结论） |  |
| **[dsh-ppap-check](https://github.com/PerryLink/dsh-ppap-check)** | PPAP 提交要素齐备性核对（按公开的 PPAP 手册与提交等级核对要素齐备与版本填写，仅提示差异，不作出定性结论） |  |
| **[dsh-protest-deadline](https://github.com/PerryLink/dsh-protest-deadline)** | 质疑与投诉期限核对（按公开的政府采购质疑投诉规定核对期限与台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-railway-window](https://github.com/PerryLink/dsh-railway-window)** | 铁路施工天窗台账核对（按时间窗、时长算术与命令号核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | Multi-channel approval/question bridge: WeChat/Telegram/Feishu, session console | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** | 维修工单结算核对（按项目金额、配件工时合计与结算总额核对算术自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** | Verifiable research-report engine: content-addressed evidence ledger and sealed versions |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** | 审稿意见逐条回应覆盖核对（按意见与回应一一对应核对覆盖完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** | 规则库文件自检核对（按条款引用纪律与效力上限核对规则库自身合规，仅提示差异，不作出定性结论） |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** | 安全技术交底记录要素齐备性与签字闭环核对（依据公开的安全生产法规与检查标准，仅提示差异，不作出定性结论） |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** | Multi-dimensional quality scoring for DeepSeek Harness plugins. |  |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | Pin sessions in the Web sidebar with durable ordering | 🚫 RETIRADO — ver el README del repositorio |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** | Cross-device session sync for DeepSeek Harness — a dedicated git mirror of your session store. |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** | 监理日志跨日连续性与旁站覆盖提示（依据 GB/T 50319-2013 等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** | Security-audit skill pack: secret scan, dependency and supply-chain review |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** | 三重一大决策台账核对（按前置研究、会议审议与决议记录核对程序留痕，仅提示差异，不作出定性结论） |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** | 土壤与地下水监测台账核对（按点位、监测项目、限值与超标判定核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** | 作业规程与 FMEA／控制计划一致性核对（按编号与版本核对三份文件是否同步，仅提示差异，不作出定性结论） |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** | 控制图常数与过程能力指数核对（按 GB/T 4091 的常规控制图常数表核对控制限与 Cp/Cpk 的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** | Voice-first session loop for DeepSeek Harness: talk to it, hear it answer. |  |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | Cross-session team rooms: shared message bus, task board and timeline | 🚫 RETIRADO — ver el README del repositorio |
| **[dsh-tender-extract](https://github.com/PerryLink/dsh-tender-extract)** | 招标文件条款摘录核对（按出处与原文逐字核对摘录完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-tender-matrix](https://github.com/PerryLink/dsh-tender-matrix)** | 评标因素评分矩阵核对（按分值上限与合计核对矩阵自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** | Isolated install-and-smoke test drives for DeepSeek Harness plugins. |  |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** | TickTick/Dida365 task bridge: session-header panel + 11 tools |  |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** | Vendor parameter translation and deterministic JSON repair for DeepSeek Harness. |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** | 质保期与索赔金额核对（按质保期月数与里程、索赔金额算式核对自洽，仅提示差异，不作出定性结论） |  |

</details>

</details>

</details>## Disclaimer

Mantenido por la comunidad, **no** es un producto oficial de DeepSeek. DeepSeek Harness está en vista previa de desarrollador y publica cambios rompedores; ante la duda, la documentación oficial en `references/official-docs/` es la fuente de verdad.

## License

[Apache License 2.0](LICENSE) © 2026 dsh-plugin-guide contributors — nuestro propio texto (`SKILL.md`, `guide/`, `references/`, `scripts/`, este README) es Apache-2.0; el contenido de terceros empaquetado se documenta en [NOTICE.md](NOTICE.md).

### Instalar desde el mercado de DSH Desktop

Todos los plugins de PerryLink pueden explorarse en el mercado integrado de DSH Desktop: **Market → Sources → add source → pegar** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ seleccionarlo**. La instalación sigue pasando por la verificación de identidad npm del mercado y tu confirmación.
