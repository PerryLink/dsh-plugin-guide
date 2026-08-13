<h1 align="center">dsh-plugin-guide</h1>

<p align="center">
  <b>Todo lo que necesitas para crear plugins de DeepSeek Harness.</b><br/>
  Archivo de documentación oficial · Introducción a Cordis · Análisis de la comunidad · Errores reales · Skill para agentes
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">中文</a> ·
  <a href="README.pt.md">Português</a> ·
  <a href="README.hi.md">हिन्दी</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Licencia: MIT">
  <img src="https://img.shields.io/badge/dsh-dsh--plugin-4D6BFE" alt="dsh-plugin">
  <img src="https://img.shields.io/badge/documents-EN%2FZH-8257D0" alt="Documentos: EN/ZH">
</p>

---

## ¿Qué es esto?

Una base de conocimiento **autónoma** para desarrollar plugins para
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) — el harness de agentes
["todo es un plugin"](https://github.com/deepseek-ai/deepseek-harness) construido sobre
[Cordis](https://github.com/cordiverse/cordis), cuyo diseño se describe en
[A Programming Paradigm for Spatiotemporal Composability](https://github.com/cordiverse/paper).

Incluye:

- una **copia textual de la documentación oficial** (inglés + chino, 215 páginas),
- investigación sobre **Cordis** y el **paper de Cordis**,
- un **análisis profundo de 15 repositorios comunitarios** de desarrollo de plugins,
- **más de 20 errores reales verificados** (copias dobles de cordis, trío de tsconfig, zstd multiframe, …),
- todo resumido en una **guía paso a paso** y una **chuleta de una página**,
- y un **skill para agentes** (`dsh-plugin-guide`) invocable en cualquier sesión de agente.
- **Actualidad:** verificado por última vez el 2026-08-14 — documentación oficial idéntica byte a byte a `master` (47f9438); etiquetas npm y el topic `dsh-plugin` (más de 550 repos) re-verificados en vivo.

## Contenido

| Ruta | Qué es |
|---|---|
| `SKILL.md` | El skill `dsh-plugin-guide`: reglas estrictas + rutas de desarrollo por tipo de tarea |
| `guide/plugin-dev-guide.md` | La guía de desarrollo completa (10 capítulos) |
| `guide/quick-reference.md` | Chuleta de una página |
| `references/official-docs/` | Copia textual de la documentación oficial (EN + ZH) |
| `references/*.md` | Informes de investigación: docs del repo, sitio web, Cordis, el paper, ecosistema, 15 repos analizados |
| `scripts/` | Scripts de descarga idempotentes + verificador de integridad |
| `downloads/` | Instantáneas crudas — generadas por `scripts/`, no versionadas |

## Inicio rápido

### Úsalo como skill de agente

Copia toda la carpeta al directorio de skills de tu agente (las rutas relativas se mantienen):

```powershell
Copy-Item -Recurse -Force `
  'D:\path\to\dsh-plugin-guide' `
  "$env:USERPROFILE\.deepseek\skills\dsh-plugin-guide"   # o <proyecto>\.agents\skills\
```

Luego dile a tu agente: *"Usa el skill dsh-plugin-guide para crearme un plugin de …"*.

### O simplemente lee

- **¿Con prisa?** → [`guide/quick-reference.md`](guide/quick-reference.md)
- **¿Ruta completa?** → [`guide/plugin-dev-guide.md`](guide/plugin-dev-guide.md)
- **¿APIs exactas?** → `references/official-docs/docs/subsystems/` y `docs/cordis-api/`

## Destacados

- **Contrato del plugin y reglas estrictas** — efectos/disposers, `next()` en waterfall, visible-para-el-modelo ⇔ registrado, configuración Schemastery.
- **Línea de tiempo de mecanismos** — repository-plugin introducido el 0809, eliminado el 0811; los dos canales de instalación (bundle vs plugin cordis simple).
- **Más de 20 errores reales** con causa y solución: copias dobles de cordis, trío de tsconfig, `tsc` que emite pese a errores, junctions de Windows, sesiones zstd multiframe, variables `DSH_*`, `latest` de npm obsoleto…
- **15 repositorios comunitarios analizados** — plantillas, andamiajes, archivo de errores, reglas de plugin-check, capa Fabric, puente MCP.
- **Índice de fuentes completo** — cada hecho enlaza a su origen (docs oficiales, repos upstream, repos comunitarios).

## Regenerar las descargas crudas

`downloads/` no se versiona a propósito. Regéneralo cuando quieras:

```sh
pwsh -File scripts/download-sources.ps1           # sitio/docs oficiales, Cordis, paper
pwsh -File scripts/download-community-repos.ps1   # 15 repositorios comunitarios
```

## Verificar integridad

```sh
pwsh -File scripts/verify-kit.ps1   # rutas críticas + escaneo de enlaces rotos
```

## Participa

- ⭐ **Dale una estrella** — ayuda a que otros autores de plugins DSH lo encuentren.
- ¿Encontraste un error, una nueva trampa o un repo que merece análisis? Abre un [issue](https://github.com/PerryLink/dsh-plugin-guide/issues) o un pull request — consulta [CONTRIBUTING.md](CONTRIBUTING.md).
- Únete a la comunidad: [Discord de DeepSeek Harness](https://discord.gg/Ycq5dCaS4) · [discusiones oficiales](https://github.com/deepseek-ai/deepseek-harness/discussions) · [topic `dsh-plugin`](https://github.com/topics/dsh-plugin).

## Licencia y atribución

- Texto propio (`SKILL.md`, `guide/`, informes de `references/`, `scripts/`, este README): **MIT** — véase [LICENSE](LICENSE).
- El contenido de terceros incluido está documentado en [NOTICE.md](NOTICE.md), con sus límites de distribución
  (p. ej. `downloads/` es solo local; `awesome-dsh-plugins` no debe redistribuirse).

## Aviso legal

Mantenido por la comunidad; **no** es un producto oficial de DeepSeek. DeepSeek Harness está en vista previa de
desarrollador y publica cambios incompatibles; ante la duda, la documentación oficial en `references/official-docs/`
es la fuente de verdad.
