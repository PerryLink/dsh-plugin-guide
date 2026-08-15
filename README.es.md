<div align="center">

# 🐳 dsh-plugin-guide

**Todo lo que necesitas para crear plugins de [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).**

Archivo de documentación oficial · Introducción a Cordis · Análisis de la comunidad · Errores reales · Skill para agentes

[English](README.md) · [中文](README.zh-CN.md) · [Español](README.es.md) · [Português](README.pt.md) · [हिन्दी](README.hi.md)

[![GitHub stars](https://img.shields.io/github/stars/PerryLink/dsh-plugin-guide?style=for-the-badge&color=yellow&label=%E2%AD%90%20Stars)](https://github.com/PerryLink/dsh-plugin-guide/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/PerryLink/dsh-plugin-guide?style=for-the-badge&color=blue&label=Forks)](https://github.com/PerryLink/dsh-plugin-guide/network/members)
[![verify-kit CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-plugin-guide/verify.yml?branch=main&style=for-the-badge&label=CI)](https://github.com/PerryLink/dsh-plugin-guide/actions/workflows/verify.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue?style=for-the-badge)](LICENSE)
[![Topic: dsh](https://img.shields.io/badge/Topic-dsh-4D6BFE?style=for-the-badge)](https://github.com/topics/dsh)
[![Topic: dsh-plugin](https://img.shields.io/badge/Topic-dsh--plugin-8257D0?style=for-the-badge)](https://github.com/topics/dsh-plugin)
[![Docs: EN/ZH](https://img.shields.io/badge/Docs-EN%2FZH-8257D0?style=for-the-badge)](references/official-docs/)

</div>

> 🗺️ **Cada hecho enlaza a su origen** — documentación oficial, repos upstream o repos comunitarios. Ante la duda, la copia oficial textual manda.
>
> ⏱️ **Verificado por última vez el 2026-08-15** — documentación oficial idéntica byte a byte al `master` upstream (47f9438, véase [SNAPSHOT.md](references/official-docs/SNAPSHOT.md)); etiquetas npm y el topic `dsh-plugin` (API total_count subió **2668 → 2671** durante el snapshot del 08-15; 998 repos capturados, véase [sources.md](references/sources.md) §D.2) re-verificados en vivo; HEAD upstream (47f9438) y npm `@deepseek-ai/dsh` (0.1.0-rc.6) sin cambios.

## 📊 De un vistazo

| Documentación oficial | Análisis comunitarios | Errores reales | Topic `dsh-plugin` | Idiomas | Skill de agente |
|---|---|---|---|---|---|
| 215 páginas (EN + ZH) | 114 repos | 20+ | 998 snapshot (API ≈2670) | EN · 中文 · ES · PT · HI | `dsh-plugin-guide` |

## 🚀 Inicio rápido

### 🤖 Úsalo como skill de agente

Copia toda la carpeta al directorio de skills de tu agente (las rutas relativas se mantienen):

**Windows (PowerShell)**

```powershell
pwsh -File scripts/install-skill.ps1 `
  -Target "$env:USERPROFILE\.deepseek\skills\dsh-plugin-guide"   # o <proyecto>\.agents\skills\dsh-plugin-guide
```

**macOS / Linux**

```bash
pwsh -File scripts/install-skill.ps1 -Target ~/.deepseek/skills/dsh-plugin-guide   # o <proyecto>/.agents/skills/dsh-plugin-guide
```

El instalador omite `downloads/` (generado) y `.github/`, y verifica byte a byte cada archivo copiado. Un `Copy-Item -Recurse` manual de toda la carpeta también funciona.

Luego dile a tu agente: *"Usa el skill dsh-plugin-guide para crearme un plugin de …"*.

### 📖 O simplemente lee

| Quieres… | Lee |
|---|---|
| La chuleta de una página | [`guide/quick-reference.md`](guide/quick-reference.md) |
| La ruta completa de 10 capítulos | [`guide/plugin-dev-guide.md`](guide/plugin-dev-guide.md) |
| Enlaces a documentación oficial y comunitaria | [`guide/links.md`](guide/links.md) · [`references/community-ecosystem.md`](references/community-ecosystem.md) |
| APIs exactas de servicios/eventos | `references/official-docs/docs/subsystems/` y `docs/cordis-api/` |

## 🧭 Contenido

| Ruta | Qué es |
|---|---|
| `SKILL.md` | El skill `dsh-plugin-guide`: reglas estrictas + rutas de desarrollo por tipo de tarea |
| `guide/plugin-dev-guide.md` | La guía de desarrollo completa (10 capítulos) |
| `guide/quick-reference.md` | Chuleta de una página (5 idiomas) |
| `guide/links.md` | Índice de URLs curado: documentación oficial de desarrollo (sitio ↔ copias locales) + enlaces comunitarios |
| `references/official-docs/` | Copia textual de la documentación oficial del repo (EN + ZH) |
| `references/*.md` | Informes de investigación: docs del repo, sitio web, Cordis, el paper, ecosistema comunitario, archivo de 114 repos (15 analizados) |
| `scripts/` | Scripts de descarga idempotentes + verificador de integridad + generador de censo del topic |
| `downloads/` | Instantáneas crudas — generadas por `scripts/`, no versionadas |

## ✨ Destacados

- 📜 **Contrato del plugin y reglas estrictas** — efectos/disposers, `next()` en waterfall, visible-para-el-modelo ⇔ registrado, configuración Schemastery.
- 🕰️ **Línea de tiempo de mecanismos** — repository-plugin introducido el 0809, eliminado el 0811; los dos canales de instalación (bundle vs plugin cordis simple).
- 🕳️ **Más de 20 errores reales** con causa y solución: copias dobles de cordis, trío de tsconfig, `tsc` que emite pese a errores, junctions de Windows, sesiones zstd multiframe, variables `DSH_*`, `latest` de npm obsoleto…
- 🔬 **114 repositorios comunitarios archivados** (15 analizados) — plantillas, andamiajes, archivos de errores, reglas de plugin-check, capa Fabric, puente MCP, más una guía en 15 idiomas, un curso s01–s23, manuales, SDKs TS/Rust y el lote 08-15 (shells de escritorio, puente QQ, PoCs de seguridad, port a Python).
- 🔗 **Índice de fuentes completo** — cada hecho enlaza a su origen (docs oficiales, repos upstream, repos comunitarios).
- 🗃️ **1654 Discussions oficiales archivadas** (con comentarios de hilos seleccionados) + más de 100 artículos comunitarios (zh/en/HN) — refresca con `scripts/archive-discussions.ps1` / `scripts/download-community-articles.ps1`.
- 🆕 **Sello de actualidad** — re-verificado contra `master` upstream, npm y el topic `dsh-plugin` en vivo el 2026-08-15.

## 🔄 Mantenerlo fresco

```sh
pwsh -File scripts/sync-official-docs.ps1                     # copia textual de docs desde un checkout local (solo origin/master)
pwsh -File scripts/download-sources.ps1                       # sitio/docs oficiales, Cordis, paper
pwsh -File scripts/download-community-repos.ps1               # 114 repositorios comunitarios (tarballs codeload, refresco por ETag)
pwsh -File scripts/download-community-articles.ps1            # artículos comunitarios zh/en/HN (instantáneas HTML)
pwsh -File scripts/archive-discussions.ps1                    # Discussions oficiales (requiere $env:GH_TOKEN)
pwsh -File scripts/gen-topic-snapshot.ps1 -OutDir <dir>       # censo del topic dsh-plugin
pwsh -File scripts/verify-kit.ps1 -Checkout <checkout>        # rutas críticas + enlaces rotos + informe de deriva de docs
```

CI ejecuta `verify-kit` en cada push y pull request.

## 🏷️ Topics

Este repositorio es visible bajo los topics de GitHub **[`dsh`](https://github.com/topics/dsh)** y **[`dsh-plugin`](https://github.com/topics/dsh-plugin)** — navega ambas páginas de topic para encontrar cientos de plugins y recursos para desarrolladores.

## 🤝 Participa

- ⭐ **Dale una estrella** — ayuda a que otros autores de plugins DSH lo encuentren.
- ¿Encontraste un error, una nueva trampa o un repo que merece análisis? Abre un [issue](https://github.com/PerryLink/dsh-plugin-guide/issues) o un pull request — consulta [CONTRIBUTING.md](CONTRIBUTING.md).
- Únete a la comunidad: [Discord de DeepSeek Harness](https://discord.gg/Ycq5dCaS4) · [discusiones oficiales](https://github.com/deepseek-ai/deepseek-harness/discussions) · [topic `dsh-plugin`](https://github.com/topics/dsh-plugin).

## 📄 Licencia y atribución

- Texto propio (`SKILL.md`, `guide/`, informes de `references/`, `scripts/`, este README): **Apache-2.0** — véase [LICENSE](LICENSE).
- El contenido de terceros incluido está documentado en [NOTICE.md](NOTICE.md), con sus límites de distribución
  (p. ej. `downloads/` es solo local; `awesome-dsh-plugins` no debe redistribuirse).

## ⚖️ Aviso legal

Mantenido por la comunidad; **no** es un producto oficial de DeepSeek. DeepSeek Harness está en vista previa de
desarrollador y publica cambios incompatibles; ante la duda, la documentación oficial en `references/official-docs/`
es la fuente de verdad.
