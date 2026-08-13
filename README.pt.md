<h1 align="center">dsh-plugin-guide</h1>

<p align="center">
  <b>Tudo o que você precisa para criar plugins do DeepSeek Harness.</b><br/>
  Arquivo da documentação oficial · Introdução ao Cordis · Análise da comunidade · Armadilhas reais · Skill para agentes
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">中文</a> ·
  <a href="README.es.md">Español</a> ·
  <a href="README.hi.md">हिन्दी</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Licença: MIT">
  <img src="https://img.shields.io/badge/dsh-dsh--plugin-4D6BFE" alt="dsh-plugin">
  <img src="https://img.shields.io/badge/documents-EN%2FZH-8257D0" alt="Documentos: EN/ZH">
</p>

---

## O que é isto?

Uma base de conhecimento **autocontida** para desenvolver plugins para o
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) — o harness de agentes
["tudo é um plugin"](https://github.com/deepseek-ai/deepseek-harness) construído sobre o
[Cordis](https://github.com/cordiverse/cordis), cujo design é descrito em
[A Programming Paradigm for Spatiotemporal Composability](https://github.com/cordiverse/paper).

Inclui:

- uma **cópia integral da documentação oficial** (inglês + chinês, 215 páginas),
- pesquisa sobre o **Cordis** e o **paper do Cordis**,
- um **mergulho profundo em 15 repositórios comunitários** de desenvolvimento de plugins,
- **mais de 20 armadilhas reais testadas** (cópias duplas do cordis, trio do tsconfig, zstd multiframe, …),
- tudo destilado em um **guia passo a passo** e uma **folha de consulta de uma página**,
- e uma **skill para agentes** (`dsh-plugin-guide`) que você pode invocar em qualquer sessão de agente.

## Conteúdo

| Caminho | O que é |
|---|---|
| `SKILL.md` | A skill `dsh-plugin-guide`: regras rígidas + caminhos de desenvolvimento por tipo de tarefa |
| `guide/plugin-dev-guide.md` | O guia de desenvolvimento completo (10 capítulos) |
| `guide/quick-reference.md` | Folha de consulta de uma página |
| `references/official-docs/` | Cópia integral da documentação oficial (EN + ZH) |
| `references/*.md` | Relatórios de pesquisa: docs do repo, site, Cordis, o paper, ecossistema, 15 repos analisados |
| `scripts/` | Scripts de download idempotentes + verificador de integridade |
| `downloads/` | Instantâneos brutos — gerados por `scripts/`, não versionados |

## Início rápido

### Use como skill de agente

Copie a pasta inteira para o diretório de skills do seu agente (os caminhos relativos permanecem válidos):

```powershell
Copy-Item -Recurse -Force `
  'D:\path\to\dsh-plugin-guide' `
  "$env:USERPROFILE\.deepseek\skills\dsh-plugin-guide"   # ou <projeto>\.agents\skills\
```

Depois é só pedir ao seu agente: *"Use a skill dsh-plugin-guide para criar um plugin de …"*.

### Ou apenas leia

- **Com pressa?** → [`guide/quick-reference.md`](guide/quick-reference.md)
- **Caminho completo?** → [`guide/plugin-dev-guide.md`](guide/plugin-dev-guide.md)
- **APIs exatas?** → `references/official-docs/docs/subsystems/` e `docs/cordis-api/`

## Destaques

- **Contrato do plugin e regras rígidas** — efeitos/disposers, `next()` no waterfall, visível-para-o-modelo ⇔ registrado, configuração Schemastery.
- **Linha do tempo dos mecanismos** — repository-plugin introduzido em 0809, removido em 0811; os dois canais de instalação (bundle vs plugin cordis simples).
- **Mais de 20 armadilhas reais** com causa e solução: cópias duplas do cordis, trio do tsconfig, `tsc` emitindo mesmo com erros, junctions do Windows, sessões zstd multiframe, variáveis `DSH_*`, `latest` do npm desatualizado…
- **15 repositórios comunitários analisados** — modelos, scaffolds, arquivo de armadilhas, regras do plugin-check, camada Fabric, ponte MCP.
- **Índice de fontes completo** — cada fato aponta para sua origem (docs oficiais, repos upstream, repos comunitários).

## Regenerar os downloads brutos

`downloads/` não é versionado de propósito. Regenere quando quiser:

```sh
pwsh -File scripts/download-sources.ps1           # site/docs oficiais, Cordis, paper
pwsh -File scripts/download-community-repos.ps1   # 15 repositórios comunitários
```

## Verificar integridade

```sh
pwsh -File scripts/verify-kit.ps1   # caminhos críticos + varredura de links quebrados
```

## Licença e atribuição

- Texto próprio (`SKILL.md`, `guide/`, relatórios de `references/`, `scripts/`, este README): **MIT** — veja [LICENSE](LICENSE).
- O conteúdo de terceiros incluído está documentado em [NOTICE.md](NOTICE.md), com seus limites de distribuição
  (ex.: `downloads/` é apenas local; `awesome-dsh-plugins` não deve ser redistribuído).

## Aviso legal

Mantido pela comunidade; **não** é um produto oficial da DeepSeek. O DeepSeek Harness está em prévia de
desenvolvedor e publica mudanças incompatíveis; em caso de dúvida, a documentação oficial em
`references/official-docs/` é a fonte da verdade.
