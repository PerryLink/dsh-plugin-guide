<div align="center">

# 🐳 dsh-plugin-guide

**Tudo o que você precisa para construir plugins do [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).**

*Arquivo de documentação oficial · primer de Cordis · deep-dives da comunidade · armadilhas testadas em batalha · agent skill · toolchain CLI*


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
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-plugin-guide?metric=downloads&lang=pt)](https://dshfind.com/pt/plugins/PerryLink/dsh-plugin-guide?ref=badge)

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

```sh
dsh plugin --profile <name> add dsh-plugin-guide
```


</div>

---

**📖 Prefere ler como site?** [perrylink.github.io/dsh-plugin-guide](https://perrylink.github.io/dsh-plugin-guide/) — cada capítulo em sua própria página, além de um [llms.txt](https://perrylink.github.io/dsh-plugin-guide/llms.txt) legível por máquina para assistentes.

## Install & uninstall

- **canal git** (último `main`): `dsh plugin --profile web add github:PerryLink/dsh-plugin-guide#<sha>` — fixe um commit para reprodutibilidade; o ponto de entrada é JS ESM puro, sem etapa de build.
- **canal npm** (versões publicadas): `dsh plugin --profile web add dsh-plugin-guide`.
- **canal tarball**: `pnpm pack` neste repo, depois `dsh plugin --profile web add ./dsh-plugin-guide-<version>.tgz`.
- **desinstalar**: `dsh plugin --profile web remove dsh-plugin-guide`.

## Why not just read the official docs?

Porque ela é escrita para quem já sabe qual página abrir, e o DSH publica **uma versão preliminar a cada 1,7–2,8 dias** com mudanças que quebram compatibilidade. Este plugin cobre as três lacunas que mais custam tempo:

| Lacuna | O que este plugin acrescenta |
|---|---|
| **"Contra qual versão estou desenvolvendo?"** | Uma [matriz de versões](guide/version-matrix.md): os quatro valores que se chamam "latest", as tags `latest` congeladas dos subpacotes, as falhas de compatibilidade e como escolher um intervalo em `peerDependencies`. **Não existe linha estável** — toda versão publicada é preliminar. |
| **"O que esta versão quebra?"** | Um [guia de migração](guide/migration-0.2.md) que expõe `0.1.6-alpha.2` → `0.2.1-alpha.2` como **seams citáveis**, cada um com sintoma *e* correção e sua fonte oficial — incluindo uma perda de dados e uma mudança que faz os prompts falharem antes de montar a requisição ao modelo. |
| **"Meu plugin está realmente correto?"** | Uma [CLI sem dependências](SKILL.md) (`dsh-plugin-dev new / check / verify`) e um [espelho literal e offline](references/official-docs/) da documentação oficial, para o agente citar a página exata. |

**Comprove em 60 segundos:**

```sh
dsh plugin --profile web add dsh-plugin-guide
```

<!-- star-cta -->
## ⭐ 如果它帮到了你

Este plugin faz parte da [família de plugins DSH](https://github.com/PerryLink) (mais de 40, todos Apache-2.0). Se for útil, **deixe uma estrela**: não desbloqueia nada, mas ajuda a próxima pessoa a encontrá-lo.

*English:* part of a 40+ plugin family for DeepSeek Harness. If it is useful, **a star helps the next person find it** — nothing is gated behind it.

## What is dsh-plugin-guide?

Tudo o que você precisa para construir plugins do [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).

Arquivo de documentação oficial · primer de Cordis · deep-dives da comunidade · armadilhas testadas em batalha · agent skill · toolchain CLI

![Demonstração de terminal do dsh-plugin-guide: dsh-plugin-guide — install the bundle, then run the checker](https://raw.githubusercontent.com/PerryLink/dsh-plugin-guide/main/docs/assets/dsh-plugin-guide-hero.png)

![Animated terminal demo of dsh-plugin-guide](https://raw.githubusercontent.com/PerryLink/dsh-plugin-guide/main/docs/assets/dsh-plugin-guide-demo.gif)

*A mesma execução, animada.*

## Comparison

![Gráfico comparativo medido do dsh-plugin-guide](https://raw.githubusercontent.com/PerryLink/dsh-plugin-guide/main/docs/assets/dsh-plugin-guide-evidence.png)

content counts as stated in the README (What you get)

## Compatibility

| Surface | Status |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.2.1-alpha.2` (`d743267388641bc76f17c45ce8b4c231aed1d32c`, a tag mais nova do master **e** HEAD, 2026-10-09); npm `latest` = `0.2.0-rc.2`, `alpha` = `0.2.1-alpha.2`. Re-verificado em 2026-10-06 contra esse checkout (cadeia de gates + smoke de instalação de perfil). A base de conhecimento, o espelho de docs oficiais e [guide/migration-0.2.md](guide/migration-0.2.md) usam essa linha de base. |
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

- **Adaptabilidade de versão** — [guide/version-matrix.md](guide/version-matrix.md): os quatro valores "latest", tags `latest` congeladas, falhas de compatibilidade, escolha do intervalo de peers e as 19 mudanças de `0.2.1-alpha.2`.
- **Roteador da cadeia de ferramentas** — [guide/family-toolchain.md](guide/family-toolchain.md): qual ferramenta responde a cada pergunta, o catálogo completo de 33 verificações do `dsh-plugin-doctor` e o cruzamento com as 16 deste repositório.
- **Decisão sobre o escopo do espelho** — [references/mirror-scope-decision.md](references/mirror-scope-decision.md): por que "remover o não referenciado para economizar 80%" **não se sustenta** ao medir de novo.
- **Destilado da skill oficial** — [references/official-plugin-dev-skill.md](references/official-plugin-dev-skill.md): proibições, metadados de apresentação e regras de UI/desempenho da skill oficial `cordis-plugin-development`.
## Knowledge base

| Path | O que é |
|---|---|
| `SKILL.md` | A agent skill `dsh-plugin-guide`: regras rígidas + caminhos de desenvolvimento por tarefa |
| `package.json` · `cordis.patch.yml` · `index.js` | O bundle DSH instalável: manifesto `dsh.bundle.patch` + ponto de entrada que registra a skill |
| `guide/plugin-dev-guide.md` | O guia de desenvolvimento completo (10 capítulos) |
| `guide/quick-reference.md` | Folha de referência de uma página (5 idiomas) |
| `guide/links.md` | Índice de URL curado: docs oficiais de desenvolvimento (site ↔ cópias locais) + links de docs da comunidade |
| `guide/when-to-retire-a-plugin.md` | Aposentar e congelar plugins: os critérios e os dados medidos de uma auditoria de portfólio (EN + ZH) |
| `guide/choosing-a-plugin.md` | Escolhendo um plugin: quem lidera cada capacidade, com os números medidos e as ressalvas de verificação (EN + ZH) |
| `references/official-docs/` | Cópia textual da documentação oficial do repo (EN + ZH) |
| `references/*.md` | Relatórios de pesquisa: docs do repo, site, Cordis, o paper, ecossistema da comunidade, arquivo de 114 repos (15 com deep-dive) |
| `scripts/` | Scripts de download idempotentes + verificador de integridade + gerador de instantânea de tópico |
| `bin/` · `src/cli/` · `dist/` | O CLI `dsh-plugin-dev`: scaffolder, checker, verifier (TypeScript, empacotado com tsdown) |
| `templates/` | Esqueletos TS + JS: modelo de contrato, Config, tests, cordis.patch.yml, READMEs em cinco idiomas |
| `downloads/` | Instantâneas cruas — geradas por `scripts/`, não commitadas |
| `guide/version-matrix.md` | **Matriz de adaptabilidade de versão**: os quatro valores "latest", tags congeladas, falhas de compatibilidade, seleção de intervalo de peers, linhagem do formato de sessão e as 19 mudanças de `0.2.1-alpha.2` |
| `guide/family-toolchain.md` | **Roteador da cadeia de ferramentas**: pergunta → responsável → artefato citável; catálogo completo de 33 verificações do `dsh-plugin-doctor` e cruzamento com as 16 deste repositório |
| `guide/migration-0.2.md` | Guia de mudanças que quebram compatibilidade da geração 0.2 (§0–§12 até `0.2.1-alpha.1`; **§13 cobre os 19 seams de `0.2.1-alpha.2`**) |
| `references/mirror-scope-decision.md` | Registro de decisão sobre o escopo do espelho: por que não se recorta por "zero referências", com o script de medição reproduzível |

## CLI toolchain

O bundle inclui o CLI `dsh-plugin-dev` sem dependências de runtime (`bin/` → `dist/dsh-plugin-dev.js` empacotado com tsdown). Cada check cita a seção da skill que ele aplica, para que um agente possa continuar auditando manualmente.

```sh
dsh-plugin-dev new <name> [--lang ts|js] [--dir <path>] [--force] [--git]
dsh-plugin-dev check [--cwd <dir>] [--json] [--strict]
dsh-plugin-dev verify [--cwd <dir>] [--dsh <bin>] [--pnpm <bin>]
dsh-plugin-dev seams <query> | --since <version>   # esta API existe no host alvo?
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
dsh plugin --profile web add github:PerryLink/dsh-plugin-guide

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

## Release channels

Todos os canais resolvem deste repositório ou do npm, então **uma tag chega a todos**; só o espelho do Gitee é uma cópia agendada:

| Canal | Fonte da verdade | Como atualiza |
|---|---|---|
| npm (`dsh-plugin-guide`) | o `package.json` deste repositório | `.github/workflows/release.yml` numa tag `v*`: portão `verify-kit` → verificação da seção do CHANGELOG → `npm publish --provenance` (ignorado quando a versão já existe) |
| GitHub Release | a mesma tag | o mesmo workflow a cria de forma idempotente |
| Selos de descoberta (versão npm, tag do GitHub, DSH Market, dsh-doctor) | consultas ao vivo | nada a publicar — leem o npm/o registro a cada render |
| Espelho do Gitee | este repositório | **espelho agendado somente leitura**, não um destino de publicação: o workflow `gitee-sync` da família o alinha ao tip do GitHub com `--force-with-lease`, então `main` costuma ficar uma execução atrás. **Aqui nunca se envia tag ao Gitee**; compare com `git ls-remote` antes de reportar o espelho desatualizado |
| DSH Desktop Market / dsh1024 | npm | o mercado instala o pacote do npm, então uma versão publicada é instalável de imediato; não há envio por versão |
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
pnpm run check:readmes           # five READMEs share section structure
pnpm run check:parity            # translations have identical block counts
pnpm run check:facts             # self-stated numbers match data/facts.json
pnpm run check:ps1-bom           # PowerShell scripts keep their UTF-8 BOM
pnpm pack
pwsh -File scripts/verify-kit.ps1   # caminhos críticos + varredura de links (+ deriva de docs com -Checkout <checkout>)
```

## Topics

`dsh`, `deepseek-harness`, `dsh-plugin`, `cordis`, `agent-skill`, `plugin-development`, `knowledge-base`, `cli`, `scaffold`, `checker`

## Contributors

- [PerryLink](https://github.com/PerryLink) — criador e mantenedor: conteúdo da base de conhecimento, a transformação para bundle instalável, envios ao ecossistema e engenharia de comunidade.
- [@Yisa-yi](https://github.com/Yisa-yi) — **product manager**. Participou de todo o arco de design, do primeiro esboço ao bundle publicado, e respondeu pela forma do produto, não pelo seu código: a decisão de que isto fosse entregue como bundle instalável que registra uma agent skill sob demanda (o site de documentação renderiza essas mesmas fontes, não um conjunto de conteúdo à parte); a arquitetura da informação do guia de 10 capítulos; a regra de que todo fato deve linkar sua origem; e a separação entre a camada cognitiva (`SKILL.md` + `guide/`) e a camada mecânica (`dsh-plugin-dev new / check / verify`). Definiu o padrão de evidência de `guide/unfixed-issues.md` — `path:line` contra um commit nomeado do host, a tabela design-vs-bug e uma seção explícita de não reproduzível — e os critérios de congelamento e retirada de `guide/when-to-retire-a-plugin.md`. Sustentou a linha de escopo (somente leitura, sem rede, sem chamadas ao modelo, sem chaves configuráveis) e a exigência de paridade dos READMEs em cinco idiomas.
- A manutenção diária é assistida por agentes do DeepSeek Harness (eles não têm conta no GitHub e são listados aqui por transparência, não como contribuidores).

## PerryLink DSH Plugin Family

Este projeto é um dos **87 plugins ativamente mantidos** do DeepSeek Harness da [PerryLink](https://github.com/PerryLink). O registro da família tem **95** plugins — **5 congelados**, **3 retirados** — e fica recolhido abaixo para que cada README mantenha uma primeira tela curta. Expanda para ver cada linha, com o motivo na coluna Status.

<details>
<summary>Expandir os 95 plugins</summary>

| Plugin | Uma linha | Status |
|---|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** | 水产养殖投入品记录核对（按投入品用量、休药期与起捕间隔核对记录自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** | 档案归档完整性与保管期限核对（依据《档案法》及配套规定，仅提示差异，不作出定性结论） |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** | Second-model auto-review on the approval chain, fail-closed by default |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | Automatic strong/cheap model-tier routing with deterministic risk guards and a `/tier` command |  |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | Durable background child agents with a Web UI sidebar, messaging and interrupt | 🚫 RETIRADO — ver o README do repositório |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** | 投标文件符合性预检（按招标文件逐条核对响应情况，仅提示差异，不作出定性结论） |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** | 投标人资格条件核对（按资格条件与证明材料核对逐条响应，仅提示差异，不作出定性结论） |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | Cost governance for DeepSeek Harness: budgets, carbon, and latency in one panel. | 🧊 CONGELADO — ver o README do repositório |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | Read-only MCP server exposing the certification registry: grades, snapshots and five-dimension evidence |  |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** | Claude Code /rewind-equivalent: snapshots, session forks, one-shot restore |  |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | Migrate Claude Code sessions, memory, skills and CLAUDE.md into DSH | 🧊 CONGELADO — ver o README do repositório |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** | Cross-platform native desktop control for DeepSeek Harness — Windows first. |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** | Terminal-style input history for the web composer: arrows, Ctrl+R search |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** | 合同条款立场台账核对（按立场、风险等级与退让底线核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** | 报关单证一致性核对（按公开的报关单填制规范核对单证间字段一致性，仅提示差异，不作出定性结论） |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** | Dataset quality checks and citation cross-checks (the optional numeric bridge consumed here) |  |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | Prompt-injection, jailbreak, and secret-leak defense for DeepSeek Harness. | 🧊 CONGELADO — ver o README do repositório |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** | 滞箱费台账核对（按免箱期与费率核对超期天数与金额的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** | Engineering-discipline guard: requirements grill, test gates, adversary review |  |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | Unified static-image generation routing for DeepSeek Harness. | 🧊 CONGELADO — ver o README do repositório |
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
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | Multi-channel approval/question bridge: WeChat/Telegram/Feishu, session console | 🧊 CONGELADO — ver o README do repositório |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** | 维修工单结算核对（按项目金额、配件工时合计与结算总额核对算术自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** | Verifiable research-report engine: content-addressed evidence ledger and sealed versions |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** | 审稿意见逐条回应覆盖核对（按意见与回应一一对应核对覆盖完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** | 规则库文件自检核对（按条款引用纪律与效力上限核对规则库自身合规，仅提示差异，不作出定性结论） |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** | 安全技术交底记录要素齐备性与签字闭环核对（依据公开的安全生产法规与检查标准，仅提示差异，不作出定性结论） |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** | Multi-dimensional quality scoring for DeepSeek Harness plugins. |  |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | Pin sessions in the Web sidebar with durable ordering | 🚫 RETIRADO — ver o README do repositório |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** | Cross-device session sync for DeepSeek Harness — a dedicated git mirror of your session store. |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** | 监理日志跨日连续性与旁站覆盖提示（依据 GB/T 50319-2013 等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** | Security-audit skill pack: secret scan, dependency and supply-chain review |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** | 三重一大决策台账核对（按前置研究、会议审议与决议记录核对程序留痕，仅提示差异，不作出定性结论） |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** | 土壤与地下水监测台账核对（按点位、监测项目、限值与超标判定核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** | 作业规程与 FMEA／控制计划一致性核对（按编号与版本核对三份文件是否同步，仅提示差异，不作出定性结论） |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** | 控制图常数与过程能力指数核对（按 GB/T 4091 的常规控制图常数表核对控制限与 Cp/Cpk 的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** | Voice-first session loop for DeepSeek Harness: talk to it, hear it answer. |  |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | Cross-session team rooms: shared message bus, task board and timeline | 🚫 RETIRADO — ver o README do repositório |
| **[dsh-tender-extract](https://github.com/PerryLink/dsh-tender-extract)** | 招标文件条款摘录核对（按出处与原文逐字核对摘录完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-tender-matrix](https://github.com/PerryLink/dsh-tender-matrix)** | 评标因素评分矩阵核对（按分值上限与合计核对矩阵自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** | Isolated install-and-smoke test drives for DeepSeek Harness plugins. |  |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** | TickTick/Dida365 task bridge: session-header panel + 11 tools |  |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** | Vendor parameter translation and deterministic JSON repair for DeepSeek Harness. |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** | 质保期与索赔金额核对（按质保期月数与里程、索赔金额算式核对自洽，仅提示差异，不作出定性结论） |  |

</details>

</details>

</details>## Disclaimer

Mantido pela comunidade, **não** é um produto oficial da DeepSeek. O DeepSeek Harness está em preview de desenvolvedor e publica mudanças quebradoras; na dúvida, a documentação oficial em `references/official-docs/` é a fonte da verdade.

## License

[Apache License 2.0](LICENSE) © 2026 dsh-plugin-guide contributors — nosso próprio texto (`SKILL.md`, `guide/`, `references/`, `scripts/`, este README) é Apache-2.0; o conteúdo de terceiros empacotado é documentado em [NOTICE.md](NOTICE.md).

### Instalar a partir do mercado do DSH Desktop

Todos os plugins PerryLink podem ser explorados no mercado integrado do DSH Desktop: **Market → Sources → add source → colar** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ selecionar**. A instalação continua passando pela verificação de identidade npm do mercado e pela sua confirmação.
