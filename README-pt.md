<div align="center">

# 🐳 dsh-plugin-guide
- **Canal 1024 store**: `npm i -g dsh1024` uma vez, depois `dsh1024 plugin --profile web add dsh-plugin-guide` (conta para o ranking de instalações do [deepseek1024.com](https://deepseek1024.com)).

**Tudo o que você precisa para construir plugins do [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).**

*Arquivo de documentação oficial · primer de Cordis · deep-dives da comunidade · armadilhas testadas em batalha · agent skill · toolchain CLI*

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
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-plugin-guide?metric=downloads&lang=pt)](https://dshfind.com/pt/plugins/PerryLink/dsh-plugin-guide?ref=badge)

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

</div>

---

## Compatibility

| Surface | Status |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.1.7-alpha.2` (re-sincronizado em 2026-09-18, `ddefc45`): o snapshot de docs oficiais foi atualizado para alpha.2, o checker agora espera o intervalo de pares de quatro cláusulas (`… || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0`) com fonte única nos templates do scaffold, e uma nova linha vermelha falha funções `async apply` que registram após seu primeiro `await`. Cadeia de gates local verde (40 testes, typecheck, dogfood do `verify`); a execução real alpha.2 do job compat chega com o próximo push de CI. |
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
- **Toolchain CLI** — `dsh-plugin-dev new / check / verify`: gerar, verificar estaticamente e validar o empacotamento de plugins DSH; cada check aponta para a seção da skill que ele aplica.

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
| `bin/` · `src/cli/` · `dist/` | O CLI `dsh-plugin-dev`: scaffolder, checker, verifier (TypeScript, empacotado com tsdown) |
| `templates/` | Esqueletos TS + JS: modelo de contrato, Config, tests, cordis.patch.yml, READMEs em cinco idiomas |
| `downloads/` | Instantâneas cruas — geradas por `scripts/`, não commitadas |

## CLI toolchain

O bundle inclui o CLI `dsh-plugin-dev` sem dependências de runtime (`bin/` → `dist/dsh-plugin-dev.js` empacotado com tsdown). Cada check cita a seção da skill que ele aplica, para que um agente possa continuar auditando manualmente.

```sh
dsh-plugin-dev new <name> [--lang ts|js] [--dir <path>] [--force] [--git]
dsh-plugin-dev check [--cwd <dir>] [--json] [--strict]
dsh-plugin-dev verify [--cwd <dir>] [--dsh <bin>] [--pnpm <bin>]
```

| Subcomando | O que faz |
|---|---|
| `new <name>` | Gera um repo de plugin TS ou JS: modelo de contrato `src/index.ts`, Config de Schemastery, tests, tsdown/vitest, `cordis.patch.yml` comentado, READMEs em cinco idiomas. Idempotente; recusa destinos não vazios sem `--force`. |
| `check` | Checks estáticos: validade de `cordis.patch.yml`, metadados de `package.json` (ponteiro `dsh.bundle.patch`, peer deps, engines, whitelist de files), consistência de READMEs em cinco idiomas, padrões de linha vermelha de engenharia. Emite JSON consumível por CI. |
| `verify` | `pnpm pack`, depois instala/inicia/desinstala o bundle em um perfil `DSH_HOME` mkdtemp limpo (alinhado com `verify:self-contained`). Falhas reportam a cauda do log mais sugestões. |

### CLI configuration

O CLI não tem ajustes hardcoded — cada um é um flag ou uma variável de ambiente.

| Ajuste | Flag | Env | Padrão |
|---|---|---|---|
| Diretório de templates | — | `DSH_PLUGIN_DEV_TEMPLATES` | `<package>/templates` |
| Binário dsh | `--dsh` | `DSH_PLUGIN_DEV_DSH` | `dsh` |
| Binário pnpm | `--pnpm` | `DSH_PLUGIN_DEV_PNPM` | `pnpm` |
| Timeout de instalação/pack | `--timeout` | `DSH_PLUGIN_DEV_TIMEOUT` | `300000` ms |
| Timeout de smoke headless | `--smoke-timeout` | `DSH_PLUGIN_DEV_SMOKE_TIMEOUT` | `120000` ms |

### Upstream roadmap

O `dsh-plugin-dev` é um candidato upstream para o CLI oficial de desenvolvimento de plugins (item C12): o scaffolder/checker/verifier são as camadas mecânicas, enquanto `SKILL.md` + `guide/` seguem sendo a camada cognitiva.

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

Ou use o CLI diretamente:

```sh
npx dsh-plugin-guide new hello-plugin            # gera um repo de plugin TS
npx dsh-plugin-guide check --json                # check estático
npx dsh-plugin-guide verify                      # pack + smoke de perfil limpo
```

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

O bundle de skill não expõe nenhum `Config` de Schemastery — ele registra a base de conhecimento como uma agent skill sem chaves ajustáveis. O CLI `dsh-plugin-dev` lê seus ajustes de flags e variáveis de ambiente `DSH_PLUGIN_DEV_*` (veja [CLI toolchain](#cli-toolchain)).

## Tools & surfaces

| Surface | Kind | Notes |
|---|---|---|
| `dsh-plugin-guide` | skill | Registrada via `ctx.skills`; carrega `SKILL.md` + `./guide/` + `./references/` sob demanda |
| `dsh-plugin-dev` | bin (CLI) | Subcomandos `new` / `check` / `verify`; não é uma linha de plugin DSH |

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

O bundle de skill (`index.js`) é ESM puro, sem etapa de build; o CLI `dsh-plugin-dev` é TypeScript compilado com tsdown. Portas:

```sh
pnpm install --frozen-lockfile
pnpm run typecheck && pnpm run typecheck:ci
pnpm test
pnpm run build
pnpm run verify:artifacts        # auto-check + smoke de scaffold (sem rede)
pnpm run verify:self-contained   # pack + smoke de instalação/início/desinstalação em perfil limpo
pnpm pack
pwsh -File scripts/verify-kit.ps1   # caminhos críticos + varredura de links (+ deriva de docs com -Checkout <checkout>)
```

## Topics

`dsh`, `deepseek-harness`, `dsh-plugin`, `cordis`, `agent-skill`, `plugin-development`, `knowledge-base`, `cli`, `scaffold`, `checker`

## Contributors

- [PerryLink](https://github.com/PerryLink) — criador e mantenedor: conteúdo da base de conhecimento, a transformação para bundle instalável, envios ao ecossistema e engenharia de comunidade.
- A manutenção diária é assistida por agentes do DeepSeek Harness (eles não têm conta no GitHub e são listados aqui por transparência, não como contribuidores).

## PerryLink DSH Plugin Family

This project is one of the **45 DeepSeek Harness plugins** maintained by [PerryLink](https://github.com/PerryLink). If this one helps you, the others likely will too:

| Plugin | One-liner |
|---|---|
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** | Second-model auto-review on the approval chain, fail-closed by default | |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | Automatic strong/cheap model-tier routing with deterministic risk guards and a `/tier` command | |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | Durable background child agents with a Web UI sidebar, messaging and interrupt | |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | Cost governance for DeepSeek Harness: budgets, carbon, and latency in one panel. | |
| **[dsh-catalog](https://github.com/PerryLink/dsh-catalog)** | DSH Desktop Market standard catalog source for the PerryLink family | |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | Read-only MCP server exposing the certification registry: grades, snapshots and five-dimension evidence | |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** | Claude Code /rewind-equivalent: snapshots, session forks, one-shot restore | |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | Migrate Claude Code sessions, memory, skills and CLAUDE.md into DSH | |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** | Cross-platform native desktop control for DeepSeek Harness — Windows first. | |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** | Terminal-style input history for the web composer: arrows, Ctrl+R search | |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** | Dataset quality checks and citation cross-checks (the optional numeric bridge consumed here) | |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | Prompt-injection, jailbreak, and secret-leak defense for DeepSeek Harness. | |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** | Engineering-discipline guard: requirements grill, test gates, adversary review | |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | Unified static-image generation routing for DeepSeek Harness. | |
| **[dsh-fast](https://github.com/PerryLink/dsh-fast)** | Read-only performance diagnostics for DeepSeek Harness. | |
| **[dsh-fund-research](https://github.com/PerryLink/dsh-fund-research)** | Deterministic research reports for Chinese public mutual funds | |
| **[dsh-github](https://github.com/PerryLink/dsh-github)** | GitHub PR/issues integration for DSH, every write gated by approval | |
| **[dsh-industry-research](https://github.com/PerryLink/dsh-industry-research)** | Industry research orchestration that seals its deliverables through this plugin's `ctx.researchReport.assemble` | |
| **[dsh-laya](https://github.com/PerryLink/dsh-laya)** | Laya typed decisions (`noul`/`choice`/`score`) as a first-class Cordis service and model-visible tools | |
| **[dsh-library](https://github.com/PerryLink/dsh-library)** | Local document knowledge base for DeepSeek Harness. | |
| **[dsh-local-ai](https://github.com/PerryLink/dsh-local-ai)** | Local-model (Ollama) integration for DeepSeek Harness. | |
| **[dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions)** | LSP diagnostics, formatting, completion, code actions and rename over language servers | |
| **[dsh-mask](https://github.com/PerryLink/dsh-mask)** | PII masking middleware: anonymize at the model boundary, restore at the display layer | |
| **[dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel)** | Read-only MCP runtime panel: /mcp command + Settings tab with status, tools and errors | |
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** | Approval-gated cross-session memory: ctx.memory seam + SQLite + memory tool | |
| **[dsh-observe](https://github.com/PerryLink/dsh-observe)** | OpenTelemetry and Langfuse observability exporter for DeepSeek Harness. | |
| **[dsh-output-styles](https://github.com/PerryLink/dsh-output-styles)** | Claude Code outputStyles-equivalent runtime style switching | |
| **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** | Claude Code-style declarative allow/deny/ask permission rules with audit | |
| **[dsh-plugin-certification](https://github.com/PerryLink/dsh-plugin-certification)** | Community certification registry with repro-checkable grades and badges | |
| **[dsh-plugin-doctor](https://github.com/PerryLink/dsh-plugin-doctor)** | Zero-dependency static + sandbox smoke detector for DSH plugins | |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** | Plugin-development knowledge base as an on-demand agent skill | |
| **[dsh-plugin-kit](https://github.com/PerryLink/dsh-plugin-kit)** | Shared zero-runtime-dependency toolkit for the PerryLink DSH plugins | |
| **[dsh-plugin-upgrade](https://github.com/PerryLink/dsh-plugin-upgrade)** | One-package, one-corridor-index plugin upgrade skill: routes a repository to the matching closed corridor card | |
| **[dsh-plugin-upgrade-015](https://github.com/PerryLink/dsh-plugin-upgrade-015)** | Merged `0.1.3-alpha.1` → `0.1.5-rc.1` upgrade corridor card plus a zero-dependency seam scanner | |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | Multi-channel approval/question bridge: WeChat/Telegram/Feishu, session console | |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** | Verifiable research-report engine: content-addressed evidence ledger and sealed versions | |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** | Multi-dimensional quality scoring for DeepSeek Harness plugins. | |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | Pin sessions in the Web sidebar with durable ordering | |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** | Cross-device session sync for DeepSeek Harness — a dedicated git mirror of your session store. | |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** | Security-audit skill pack: secret scan, dependency and supply-chain review | |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** | Voice-first session loop for DeepSeek Harness: talk to it, hear it answer. | |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | Cross-session team rooms: shared message bus, task board and timeline | |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** | Isolated install-and-smoke test drives for DeepSeek Harness plugins. | |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** | TickTick/Dida365 task bridge: session-header panel + 11 tools | |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** | Vendor parameter translation and deterministic JSON repair for DeepSeek Harness. | |


## Disclaimer

Mantido pela comunidade, **não** é um produto oficial da DeepSeek. O DeepSeek Harness está em preview de desenvolvedor e publica mudanças quebradoras; na dúvida, a documentação oficial em `references/official-docs/` é a fonte da verdade.

## License

[Apache License 2.0](LICENSE) © 2026 dsh-plugin-guide contributors — nosso próprio texto (`SKILL.md`, `guide/`, `references/`, `scripts/`, este README) é Apache-2.0; o conteúdo de terceiros empacotado é documentado em [NOTICE.md](NOTICE.md).

### Instalar a partir do mercado do DSH Desktop

Todos os plugins PerryLink podem ser explorados no mercado integrado do DSH Desktop: **Market → Sources → add source → colar** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ selecionar**. A instalação continua passando pela verificação de identidade npm do mercado e pela sua confirmação.
