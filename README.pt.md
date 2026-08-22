<div align="center">

# 🐳 dsh-plugin-guide

**Tudo o que você precisa para construir plugins do [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).**

*Arquivo de documentação oficial · primer de Cordis · deep-dives da comunidade · armadilhas testadas em batalha · agent skill*

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
| Node | `^22.19.0 || >=24.0.0` (runtime do DeepSeek Harness) |
| Platforms | Todas (bundle ESM puro; sem código nativo, sem rede) |
| Model | Qualquer (sem interação com o modelo) |

## What you get

O `dsh-plugin-guide` é a base de conhecimento de desenvolvimento de plugins DSH, empacotada como um bundle instalável que registra tudo como a agent skill `dsh-plugin-guide`. A skill permanece visível no catálogo de toda sessão e carrega seus passos de fluxo de trabalho, documentação oficial e deep-dives da comunidade sob demanda.

- **Contrato de plugin e regras rígidas** — effects/disposers, waterfall `next()`, visível para o modelo ⟺ registrado, configuração Schemastery.
- **Arquivo de documentação oficial** — uma cópia textual da documentação oficial do repo (EN + ZH), byte-idêntica ao upstream na última instantânea verificada.
- **Primer de Cordis** — os cinco conceitos e a linha do tempo de mecanismos (repository-plugin introduzido 0809, removido 0811; os dois canais de instalação).
- **20+ armadilhas do mundo real** com causa raiz + correção (cópias duplas de cordis, trio tsconfig, sessões zstd multi-frame, junctions do Windows, `latest` obsoleto do npm, …).
- **Deep-dives da comunidade** — 114 repositórios da comunidade arquivados (15 com deep-dive), mais um índice fonte completo onde cada fato aponta para sua origem.

## Knowledge base

| Path | O que é |
|---|---|
| `SKILL.md` | A agent skill `dsh-plugin-guide`: regras rígidas + caminhos de desenvolvimento por tarefa |
| `package.json` · `cordis.patch.yml` · `index.js` | O bundle DSH instalável: manifesto `dsh.bundle.patch` + ponto de entrada que registra a skill |
| `guide/plugin-dev-guide.md` | O guia de desenvolvimento completo (10 capítulos) |
| `guide/quick-reference.md` | Folha de referência de uma página (5 idiomas) |
| `guide/links.md` | Índice de URL curado: docs oficiais de desenvolvimento (site ↔ cópias locais) + links de docs da comunidade |
| `references/official-docs/` | Cópia textual da documentação oficial do repo (EN + ZH) |
| `references/*.md` | Relatórios de pesquisa: docs do repo, site, Cordis, o paper, ecossistema da comunidade, arquivo de 114 repos (15 com deep-dive) |
| `scripts/` | Scripts de download idempotentes + verificador de integridade + gerador de instantânea de tópico |
| `downloads/` | Instantâneas cruas — geradas por `scripts/`, não commitadas |

## Quick start

```sh
# 1. install the bundle into your profile
dsh plugin --profile web add "github:PerryLink/dsh-plugin-guide#main"

# or from npm (published releases)
dsh plugin --profile web add dsh-plugin-guide

# 2. restart and verify the row
dsh --profile web --dump-config | grep -A3 'id: dsh-plugin-guide'
```

Depois é só pedir ao seu agente: *"Use a skill dsh-plugin-guide para me construir um plugin de …."*

## Install & uninstall

- **canal git** (último `main`): `dsh plugin --profile web add github:PerryLink/dsh-plugin-guide#<sha>` — fixe um commit para reprodutibilidade; o ponto de entrada é JS ESM puro, sem etapa de build.
- **canal npm** (versões publicadas): `dsh plugin --profile web add dsh-plugin-guide`.
- **canal tarball**: `pnpm pack` neste repo, depois `dsh plugin --profile web add ./dsh-plugin-guide-<version>.tgz`.
- **desinstalar**: `dsh plugin --profile web remove dsh-plugin-guide`.

## Copy as a plain agent skill

Você também pode copiar a pasta inteira para o diretório de skills do seu agente (os caminhos relativos permanecem intactos):

```powershell
# Windows (PowerShell)
pwsh -File scripts/install-skill.ps1 `
  -Target "$env:USERPROFILE\.deepseek\skills\dsh-plugin-guide"   # ou <project>\.agents\skills\dsh-plugin-guide
```

```bash
# macOS / Linux
pwsh -File scripts/install-skill.ps1 -Target ~/.deepseek/skills/dsh-plugin-guide   # ou <project>/.agents/skills/dsh-plugin-guide
```

O instalador pula `downloads/` (gerado) e `.github/`, e então verifica cada arquivo copiado byte a byte. Um `Copy-Item -Recurse` manual da pasta inteira também funciona.

## Configuration

O `dsh-plugin-guide` não expõe nenhum `Config` de Schemastery — ele registra a base de conhecimento como uma agent skill sem chaves ajustáveis.

## Tools & surfaces

| Surface | Kind | Notes |
|---|---|---|
| `dsh-plugin-guide` | skill | Registrada via `ctx.skills`; carrega `SKILL.md` + `./guide/` + `./references/` sob demanda |

## Permissions & data

- **Permissions**: declara `filesystem:read` em seu manifesto de workshop.
- **Data**: somente leitura — lê seus próprios arquivos empacotados `guide/` e `references/`. Sem solicitações de rede, sem escritas, sem chamadas de modelo.

## Security boundaries

- **Base de conhecimento somente leitura.** O bundle apenas lê seus próprios arquivos; nunca escreve, nunca usa a rede e nunca invoca um modelo.
- **A documentação oficial são cópias textuais.** `references/official-docs/` nunca é editada aqui; reporte problemas ao upstream e ressincronize apenas com `scripts/sync-official-docs.ps1`.
- **Limites de distribuição.** O conteúdo de terceiros empacotado mantém sua licença de upstream; consulte [NOTICE.md](NOTICE.md) (ex.: `downloads/` é somente local; `awesome-dsh-plugins` não deve ser redistribuído).

## Known limitations

- **A documentação oficial é uma instantânea.** Ressincronize com `scripts/sync-official-docs.ps1` quando o upstream mudar; o selo de atualidade e o hash de commit referenciam `references/official-docs/SNAPSHOT.md`.
- **`downloads/` é gerado, não commitado.** As instantâneas cruas (arquivos de repos da comunidade, Discussions, artigos) devem ser geradas com os scripts antes do uso.
- **O conteúdo de `awesome-dsh-plugins` é somente local.** Seu upstream declara uma restrição de uso interno, então não é redistribuído com o repo.

## Keeping it fresh

```sh
pwsh -File scripts/sync-official-docs.ps1                     # cópia textual de docs a partir de um checkout local
pwsh -File scripts/download-sources.ps1                       # site/docs oficiais, Cordis, paper
pwsh -File scripts/download-community-repos.ps1               # repositórios da comunidade (tarballs codeload)
pwsh -File scripts/download-community-articles.ps1            # artigos da comunidade zh/en/HN
pwsh -File scripts/archive-discussions.ps1                    # Discussions oficiais (precisa de $env:GH_TOKEN)
pwsh -File scripts/gen-topic-snapshot.ps1 -OutDir <dir>       # censo do tópico dsh-plugin
pwsh -File scripts/verify-kit.ps1 -Checkout <checkout>        # caminhos críticos + varredura de links + deriva de docs
```

## Development

O bundle é ESM puro — sem etapa de build. O CI executa a porta de integridade em cada push e pull request:

```sh
pwsh -File scripts/verify-kit.ps1   # caminhos críticos + varredura de links (+ deriva de docs com -Checkout <checkout>)
```

## Topics

`dsh`, `deepseek-harness`, `dsh-plugin`, `cordis`, `agent-skill`, `plugin-development`, `knowledge-base`

## Contributors

- [PerryLink](https://github.com/PerryLink) — criador e mantenedor: conteúdo da base de conhecimento, a transformação para bundle instalável, envios ao ecossistema e engenharia de comunidade.
- A manutenção diária é assistida por agentes do DeepSeek Harness (eles não têm conta no GitHub e são listados aqui por transparência, não como contribuidores).

## PerryLink DSH Plugin Family

Este projeto é um dos [15 plugins do DeepSeek Harness](https://github.com/PerryLink) mantidos por [PerryLink](https://github.com/PerryLink). Se este te ajuda, os demais provavelmente também:

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

Mantido pela comunidade, **não** é um produto oficial da DeepSeek. O DeepSeek Harness está em preview de desenvolvedor e publica mudanças quebradoras; na dúvida, a documentação oficial em `references/official-docs/` é a fonte da verdade.

## License

[Apache License 2.0](LICENSE) © 2026 dsh-plugin-guide contributors — nosso próprio texto (`SKILL.md`, `guide/`, `references/`, `scripts/`, este README) é Apache-2.0; o conteúdo de terceiros empacotado é documentado em [NOTICE.md](NOTICE.md).
