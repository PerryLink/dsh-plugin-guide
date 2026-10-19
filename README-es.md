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

## Familia de plugins DSH de PerryLink

Este proyecto forma parte de la familia de plugins de DeepSeek Harness de [PerryLink](https://github.com/PerryLink). El registro permanece plegado abajo para que cada README conserve una primera pantalla corta; expándelo para ver cada fila y su estado.

<details>
<summary>Expandir todos los plugins</summary>

| Plugin | Estado |
|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** |  |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** |  |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** |  |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** |  |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** |  |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** |  |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** |  |
| **[dsh-drill-script-check](https://github.com/PerryLink/dsh-drill-script-check)** |  |
| **[dsh-eia-guide-check](https://github.com/PerryLink/dsh-eia-guide-check)** |  |
| **[dsh-emergency-plan](https://github.com/PerryLink/dsh-emergency-plan)** |  |
| **[dsh-essay-rubric-check](https://github.com/PerryLink/dsh-essay-rubric-check)** |  |
| **[dsh-evidence-check](https://github.com/PerryLink/dsh-evidence-check)** |  |
| **[dsh-export-ctl-check](https://github.com/PerryLink/dsh-export-ctl-check)** |  |
| **[dsh-fast](https://github.com/PerryLink/dsh-fast)** |  |
| **[dsh-fmea-table-check](https://github.com/PerryLink/dsh-fmea-table-check)** |  |
| **[dsh-forecast-penalty](https://github.com/PerryLink/dsh-forecast-penalty)** |  |
| **[dsh-fund-research](https://github.com/PerryLink/dsh-fund-research)** |  |
| **[dsh-github](https://github.com/PerryLink/dsh-github)** |  |
| **[dsh-gongwen-flow-check](https://github.com/PerryLink/dsh-gongwen-flow-check)** |  |
| **[dsh-gongwen-word-check](https://github.com/PerryLink/dsh-gongwen-word-check)** |  |
| **[dsh-guard-plan-qc](https://github.com/PerryLink/dsh-guard-plan-qc)** |  |
| **[dsh-hazchem-check](https://github.com/PerryLink/dsh-hazchem-check)** |  |
| **[dsh-hazplan-check](https://github.com/PerryLink/dsh-hazplan-check)** |  |
| **[dsh-hidden-risk-map](https://github.com/PerryLink/dsh-hidden-risk-map)** |  |
| **[dsh-hs-classify](https://github.com/PerryLink/dsh-hs-classify)** |  |
| **[dsh-icd-rule-check](https://github.com/PerryLink/dsh-icd-rule-check)** |  |
| **[dsh-industry-research](https://github.com/PerryLink/dsh-industry-research)** |  |
| **[dsh-lawcite-adapter](https://github.com/PerryLink/dsh-lawcite-adapter)** |  |
| **[dsh-laya](https://github.com/PerryLink/dsh-laya)** |  |
| **[dsh-lc-doc-check](https://github.com/PerryLink/dsh-lc-doc-check)** |  |
| **[dsh-learning-gap-check](https://github.com/PerryLink/dsh-learning-gap-check)** |  |
| **[dsh-library](https://github.com/PerryLink/dsh-library)** |  |
| **[dsh-local-ai](https://github.com/PerryLink/dsh-local-ai)** |  |
| **[dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions)** |  |
| **[dsh-mask](https://github.com/PerryLink/dsh-mask)** |  |
| **[dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel)** |  |
| **[dsh-medrec-qc](https://github.com/PerryLink/dsh-medrec-qc)** |  |
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** |  |
| **[dsh-nsfc-form-check](https://github.com/PerryLink/dsh-nsfc-form-check)** |  |
| **[dsh-nurse-record-check](https://github.com/PerryLink/dsh-nurse-record-check)** |  |
| **[dsh-observe](https://github.com/PerryLink/dsh-observe)** |  |
| **[dsh-origin-rvc-check](https://github.com/PerryLink/dsh-origin-rvc-check)** |  |
| **[dsh-ota-review-check](https://github.com/PerryLink/dsh-ota-review-check)** |  |
| **[dsh-output-styles](https://github.com/PerryLink/dsh-output-styles)** |  |
| **[dsh-paper-doc-adapter](https://github.com/PerryLink/dsh-paper-doc-adapter)** |  |
| **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** |  |
| **[dsh-permit-report-check](https://github.com/PerryLink/dsh-permit-report-check)** |  |
| **[dsh-pipeline-check](https://github.com/PerryLink/dsh-pipeline-check)** |  |
| **[dsh-pleading-draft](https://github.com/PerryLink/dsh-pleading-draft)** |  |
| **[dsh-plugin-doctor](https://github.com/PerryLink/dsh-plugin-doctor)** |  |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** |  |
| **[dsh-plugin-kit](https://github.com/PerryLink/dsh-plugin-kit)** |  |
| **[dsh-plugin-upgrade](https://github.com/PerryLink/dsh-plugin-upgrade)** |  |
| **[dsh-policy-brief-draft](https://github.com/PerryLink/dsh-policy-brief-draft)** |  |
| **[dsh-power-loss-split](https://github.com/PerryLink/dsh-power-loss-split)** |  |
| **[dsh-power-ticket-check](https://github.com/PerryLink/dsh-power-ticket-check)** |  |
| **[dsh-ppap-check](https://github.com/PerryLink/dsh-ppap-check)** |  |
| **[dsh-protest-deadline](https://github.com/PerryLink/dsh-protest-deadline)** |  |
| **[dsh-railway-window](https://github.com/PerryLink/dsh-railway-window)** |  |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** |  |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** |  |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** |  |
| **[dsh-tender-extract](https://github.com/PerryLink/dsh-tender-extract)** |  |
| **[dsh-tender-matrix](https://github.com/PerryLink/dsh-tender-matrix)** |  |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** |  |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** |  |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | 🚫 RETIRADO — ver el README del repositorio |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | 🚫 RETIRADO — ver el README del repositorio |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | 🚫 RETIRADO — ver el README del repositorio |

</details>## Disclaimer

Mantenido por la comunidad, **no** es un producto oficial de DeepSeek. DeepSeek Harness está en vista previa de desarrollador y publica cambios rompedores; ante la duda, la documentación oficial en `references/official-docs/` es la fuente de verdad.

## License

[Apache License 2.0](LICENSE) © 2026 dsh-plugin-guide contributors — nuestro propio texto (`SKILL.md`, `guide/`, `references/`, `scripts/`, este README) es Apache-2.0; el contenido de terceros empaquetado se documenta en [NOTICE.md](NOTICE.md).

### Instalar desde el mercado de DSH Desktop

Todos los plugins de PerryLink pueden explorarse en el mercado integrado de DSH Desktop: **Market → Sources → add source → pegar** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ seleccionarlo**. La instalación sigue pasando por la verificación de identidad npm del mercado y tu confirmación.
