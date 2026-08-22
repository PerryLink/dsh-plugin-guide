<div align="center">

# 🐳 dsh-plugin-guide

**Todo lo que necesitas para construir plugins de [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).**

*Archivo de documentación oficial · primer de Cordis · deep-dives de la comunidad · trampas probadas en batalla · agent skill*

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![DSH plugin](https://img.shields.io/badge/dsh-plugin-✅-green)](https://github.com/topics/dsh-plugin)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-plugin-guide/verify.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-plugin-guide/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-plugin-guide?label=version)](https://github.com/PerryLink/dsh-plugin-guide/releases)
[![npm version](https://img.shields.io/npm/v/dsh-plugin-guide)](https://www.npmjs.com/package/dsh-plugin-guide)
[![npm downloads](https://img.shields.io/npm/dm/dsh-plugin-guide)](https://www.npmjs.com/package/dsh-plugin-guide)

[English](README.md) · [简体中文](README.zh.md) · [Español](README.es.md) · [Português](README.pt.md) · [हिन्दी](README.hi.md)

</div>

---

## Compatibility

| Surface | Status |
|---|---|
| Harness | DeepSeek Harness `0.1.1-rc.2` |
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

## Knowledge base

| Path | Qué es |
|---|---|
| `SKILL.md` | La skill de agente `dsh-plugin-guide`: reglas duras + rutas de desarrollo por tarea |
| `package.json` · `cordis.patch.yml` · `index.js` | El bundle DSH instalable: manifiesto `dsh.bundle.patch` + punto de entrada que registra la skill |
| `guide/plugin-dev-guide.md` | La guía de desarrollo completa (10 capítulos) |
| `guide/quick-reference.md` | Hoja de referencia de una página (5 idiomas) |
| `guide/links.md` | Índice de URL curado: documentación oficial de desarrollo (sitio ↔ copias locales) + enlaces de documentación de la comunidad |
| `references/official-docs/` | Copia textual de la documentación oficial del repo (EN + ZH) |
| `references/*.md` | Informes de investigación: documentación del repo, sitio web, Cordis, el paper, ecosistema de la comunidad, archivo de 114 repos (15 con deep-dive) |
| `scripts/` | Scripts de descarga idempotentes + verificador de integridad + generador de instantáneas de tema |
| `downloads/` | Instantáneas crudas — generadas por `scripts/`, no confirmadas |

## Quick start

```sh
# 1. install the bundle into your profile
dsh plugin --profile web add "github:PerryLink/dsh-plugin-guide#main"

# or from npm (published releases)
dsh plugin --profile web add dsh-plugin-guide

# 2. restart and verify the row
dsh --profile web --dump-config | grep -A3 'id: dsh-plugin-guide'
```

Luego pídele a tu agente: *"Usa la skill dsh-plugin-guide para construirme un plugin de …."*

## Install & uninstall

- **canal git** (último `main`): `dsh plugin --profile web add github:PerryLink/dsh-plugin-guide#<sha>` — fija un commit para reproducibilidad; el punto de entrada es JS ESM plano, sin paso de build.
- **canal npm** (versiones publicadas): `dsh plugin --profile web add dsh-plugin-guide`.
- **canal tarball**: `pnpm pack` en este repo, luego `dsh plugin --profile web add ./dsh-plugin-guide-<version>.tgz`.
- **desinstalar**: `dsh plugin --profile web remove dsh-plugin-guide`.

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

`dsh-plugin-guide` no expone ningún `Config` de Schemastery — registra la base de conocimiento como una skill de agente sin claves ajustables.

## Tools & surfaces

| Surface | Kind | Notes |
|---|---|---|
| `dsh-plugin-guide` | skill | Registrada vía `ctx.skills`; carga `SKILL.md` + `./guide/` + `./references/` bajo demanda |

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

El bundle es ESM plano — sin paso de build. CI ejecuta la puerta de integridad en cada push y pull request:

```sh
pwsh -File scripts/verify-kit.ps1   # rutas críticas + escaneo de enlaces (+ deriva de docs con -Checkout <checkout>)
```

## Topics

`dsh`, `deepseek-harness`, `dsh-plugin`, `cordis`, `agent-skill`, `plugin-development`, `knowledge-base`

## Contributors

- [PerryLink](https://github.com/PerryLink) — creador y mantenedor: contenido de la base de conocimiento, la transformación a bundle instalable, envíos al ecosistema e ingeniería de comunidad.
- El mantenimiento diario está asistido por agentes de DeepSeek Harness (no tienen cuenta de GitHub y se listan aquí por transparencia, no como contribuyentes).

## PerryLink DSH Plugin Family

Este proyecto es uno de los [15 plugins de DeepSeek Harness](https://github.com/PerryLink) mantenidos por [PerryLink](https://github.com/PerryLink). Si este te ayuda, los demás probablemente también:

| Plugin | One-liner |
|---|---|
| [dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel) | Read-only MCP runtime panel: /mcp command + Settings tab with status, tools and errors |
| [dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck) | Engineering-discipline guard: requirements grill, test gates, adversary review |
| [dsh-background-agents](https://github.com/PerryLink/dsh-background-agents) | Durable background child agents with a Web UI sidebar, messaging and interrupt |
| [dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions) | LSP diagnostics, formatting, completion, code actions and rename over language servers |
| [dsh-output-styles](https://github.com/PerryLink/dsh-output-styles) | Claude Code outputStyles-equivalent runtime style switching |
| [dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind) | Claude Code /rewind-equivalent: snapshots, session forks, one-shot restore |
| [dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules) | Claude Code-style declarative allow/deny/ask permission rules with audit |
| [dsh-auto-review](https://github.com/PerryLink/dsh-auto-review) | Second-model auto-review on the approval chain, fail-closed by default |
| [dsh-memento](https://github.com/PerryLink/dsh-memento) | Approval-gated cross-session memory: ctx.memory seam + SQLite + memory tool |
| [dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security) | Security-audit skill pack: secret scan, dependency and supply-chain review |
| [dsh-session-pin](https://github.com/PerryLink/dsh-session-pin) | Pin sessions in the Web sidebar with durable ordering |
| [dsh-composer-history](https://github.com/PerryLink/dsh-composer-history) | Terminal-style input history for the web composer: arrows, Ctrl+R search |
| [dsh-github](https://github.com/PerryLink/dsh-github) | GitHub PR/issues integration for DSH, every write gated by approval |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** | Plugin-development knowledge base as an on-demand agent skill |
| [dsh-claude-move](https://github.com/PerryLink/dsh-claude-move) | Migrate Claude Code sessions, memory, skills and CLAUDE.md into DSH |

## Disclaimer

Mantenido por la comunidad, **no** es un producto oficial de DeepSeek. DeepSeek Harness está en vista previa de desarrollador y publica cambios rompedores; ante la duda, la documentación oficial en `references/official-docs/` es la fuente de verdad.

## License

[Apache License 2.0](LICENSE) © 2026 dsh-plugin-guide contributors — nuestro propio texto (`SKILL.md`, `guide/`, `references/`, `scripts/`, este README) es Apache-2.0; el contenido de terceros empaquetado se documenta en [NOTICE.md](NOTICE.md).
