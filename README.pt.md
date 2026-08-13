<div align="center">

# 🐳 dsh-plugin-guide

**Tudo o que você precisa para criar plugins do [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).**

Arquivo da documentação oficial · Introdução ao Cordis · Análise da comunidade · Armadilhas reais · Skill para agentes

[English](README.md) · [中文](README.zh-CN.md) · [Español](README.es.md) · [Português](README.pt.md) · [हिन्दी](README.hi.md)

[![GitHub stars](https://img.shields.io/github/stars/PerryLink/dsh-plugin-guide?style=for-the-badge&color=yellow&label=%E2%AD%90%20Stars)](https://github.com/PerryLink/dsh-plugin-guide/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/PerryLink/dsh-plugin-guide?style=for-the-badge&color=blue&label=Forks)](https://github.com/PerryLink/dsh-plugin-guide/network/members)
[![verify-kit CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-plugin-guide/verify.yml?branch=main&style=for-the-badge&label=CI)](https://github.com/PerryLink/dsh-plugin-guide/actions/workflows/verify.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Topic: dsh](https://img.shields.io/badge/Topic-dsh-4D6BFE?style=for-the-badge)](https://github.com/topics/dsh)
[![Topic: dsh-plugin](https://img.shields.io/badge/Topic-dsh--plugin-8257D0?style=for-the-badge)](https://github.com/topics/dsh-plugin)
[![Docs: EN/ZH](https://img.shields.io/badge/Docs-EN%2FZH-8257D0?style=for-the-badge)](references/official-docs/)

</div>

> 🗺️ **Cada fato aponta para sua origem** — documentação oficial, repos upstream ou repos comunitários. Em caso de dúvida, a cópia oficial textual prevalece.
>
> ⏱️ **Última verificação em 2026-08-14** — documentação oficial idêntica byte a byte ao `master` upstream (47f9438); tags npm e o tópico `dsh-plugin` (mais de 550 repositórios) re-verificados ao vivo.

## 📊 Em resumo

| Documentação oficial | Análises comunitárias | Armadilhas reais | Tópico `dsh-plugin` | Idiomas | Skill de agente |
|---|---|---|---|---|---|
| 215 páginas (EN + ZH) | 15 repos | 20+ | 550+ repos | EN · 中文 · ES · PT · HI | `dsh-plugin-guide` |

## 🚀 Início rápido

### 🤖 Use como skill de agente

Copie a pasta inteira para o diretório de skills do seu agente (os caminhos relativos permanecem válidos):

**Windows (PowerShell)**

```powershell
Copy-Item -Recurse -Force `
  'D:\path\to\dsh-plugin-guide' `
  "$env:USERPROFILE\.deepseek\skills\dsh-plugin-guide"   # ou <projeto>\.agents\skills\
```

**macOS / Linux**

```bash
cp -r /path/to/dsh-plugin-guide ~/.deepseek/skills/      # ou <projeto>/.agents/skills/
```

Depois é só pedir ao seu agente: *"Use a skill dsh-plugin-guide para criar um plugin de …"*.

### 📖 Ou apenas leia

| Você quer… | Leia |
|---|---|
| A folha de consulta de uma página | [`guide/quick-reference.md`](guide/quick-reference.md) |
| O caminho completo de 10 capítulos | [`guide/plugin-dev-guide.md`](guide/plugin-dev-guide.md) |
| Links de documentação oficial e comunitária | [`guide/links.md`](guide/links.md) · [`references/community-ecosystem.md`](references/community-ecosystem.md) |
| APIs exatas de serviços/eventos | `references/official-docs/docs/subsystems/` e `docs/cordis-api/` |

## 🧭 Conteúdo

| Caminho | O que é |
|---|---|
| `SKILL.md` | A skill `dsh-plugin-guide`: regras rígidas + caminhos de desenvolvimento por tipo de tarefa |
| `guide/plugin-dev-guide.md` | O guia de desenvolvimento completo (10 capítulos) |
| `guide/quick-reference.md` | Folha de consulta de uma página (5 idiomas) |
| `guide/links.md` | Índice de URLs curado: documentação oficial de desenvolvimento (site ↔ cópias locais) + links comunitários |
| `references/official-docs/` | Cópia integral da documentação oficial do repo (EN + ZH) |
| `references/*.md` | Relatórios de pesquisa: docs do repo, site, Cordis, o paper, ecossistema comunitário, 15 repos analisados |
| `scripts/` | Scripts de download idempotentes + verificador de integridade + gerador de censo do tópico |
| `downloads/` | Instantâneos brutos — gerados por `scripts/`, não versionados |

## ✨ Destaques

- 📜 **Contrato do plugin e regras rígidas** — efeitos/disposers, `next()` no waterfall, visível-para-o-modelo ⇔ registrado, configuração Schemastery.
- 🕰️ **Linha do tempo dos mecanismos** — repository-plugin introduzido em 0809, removido em 0811; os dois canais de instalação (bundle vs plugin cordis simples).
- 🕳️ **Mais de 20 armadilhas reais** com causa e solução: cópias duplas do cordis, trio do tsconfig, `tsc` emitindo mesmo com erros, junctions do Windows, sessões zstd multiframe, variáveis `DSH_*`, `latest` do npm desatualizado…
- 🔬 **15 repositórios comunitários analisados** — modelos, scaffolds, arquivo de armadilhas, regras do plugin-check, camada Fabric, ponte MCP.
- 🔗 **Índice de fontes completo** — cada fato aponta para sua origem (docs oficiais, repos upstream, repos comunitários).
- 🆕 **Selo de atualidade** — re-verificado contra o `master` upstream, npm e o tópico `dsh-plugin` ao vivo em 2026-08-14.

## 🔄 Mantendo-o atualizado

```sh
pwsh -File scripts/download-sources.ps1                       # site/docs oficiais, Cordis, paper
pwsh -File scripts/download-community-repos.ps1               # 15 repositórios comunitários
pwsh -File scripts/gen-topic-snapshot.ps1 -OutDir <dir>       # censo do tópico dsh-plugin
pwsh -File scripts/verify-kit.ps1                             # caminhos críticos + varredura de links quebrados
```

O CI executa `verify-kit` em cada push e pull request.

## 🏷️ Topics

Este repositório é visível sob os topics do GitHub **[`dsh`](https://github.com/topics/dsh)** e **[`dsh-plugin`](https://github.com/topics/dsh-plugin)** — navegue pelas duas páginas de topic para encontrar centenas de plugins e recursos para desenvolvedores.

## 🤝 Participe

- ⭐ **Dê uma estrela** — ajuda outros autores de plugins DSH a encontrá-lo.
- Encontrou um erro, uma nova armadilha ou um repo que merece análise? Abra uma [issue](https://github.com/PerryLink/dsh-plugin-guide/issues) ou um pull request — veja [CONTRIBUTING.md](CONTRIBUTING.md).
- Junte-se à comunidade: [Discord do DeepSeek Harness](https://discord.gg/Ycq5dCaS4) · [discussões oficiais](https://github.com/deepseek-ai/deepseek-harness/discussions) · [topic `dsh-plugin`](https://github.com/topics/dsh-plugin).

## 📄 Licença e atribuição

- Texto próprio (`SKILL.md`, `guide/`, relatórios de `references/`, `scripts/`, este README): **MIT** — veja [LICENSE](LICENSE).
- O conteúdo de terceiros incluído está documentado em [NOTICE.md](NOTICE.md), com seus limites de distribuição
  (ex.: `downloads/` é apenas local; `awesome-dsh-plugins` não deve ser redistribuído).

## ⚖️ Aviso legal

Mantido pela comunidade; **não** é um produto oficial da DeepSeek. O DeepSeek Harness está em prévia de
desenvolvedor e publica mudanças incompatíveis; em caso de dúvida, a documentação oficial em
`references/official-docs/` é a fonte da verdade.
