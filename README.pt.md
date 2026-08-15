<div align="center">

# 🐳 dsh-plugin-guide

**Tudo o que você precisa para criar plugins do [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).**

Arquivo da documentação oficial · Introdução ao Cordis · Análise da comunidade · Armadilhas reais · Skill para agentes

[English](README.md) · [中文](README.zh-CN.md) · [Español](README.es.md) · [Português](README.pt.md) · [हिन्दी](README.hi.md)

[![GitHub stars](https://img.shields.io/github/stars/PerryLink/dsh-plugin-guide?style=for-the-badge&color=yellow&label=%E2%AD%90%20Stars)](https://github.com/PerryLink/dsh-plugin-guide/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/PerryLink/dsh-plugin-guide?style=for-the-badge&color=blue&label=Forks)](https://github.com/PerryLink/dsh-plugin-guide/network/members)
[![verify-kit CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-plugin-guide/verify.yml?branch=main&style=for-the-badge&label=CI)](https://github.com/PerryLink/dsh-plugin-guide/actions/workflows/verify.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue?style=for-the-badge)](LICENSE)
[![Topic: dsh](https://img.shields.io/badge/Topic-dsh-4D6BFE?style=for-the-badge)](https://github.com/topics/dsh)
[![Topic: dsh-plugin](https://img.shields.io/badge/Topic-dsh--plugin-8257D0?style=for-the-badge)](https://github.com/topics/dsh-plugin)
[![Docs: EN/ZH](https://img.shields.io/badge/Docs-EN%2FZH-8257D0?style=for-the-badge)](references/official-docs/)

</div>

> 🗺️ **Cada fato aponta para sua origem** — documentação oficial, repos upstream ou repos comunitários. Em caso de dúvida, a cópia oficial textual prevalece.
>
> ⏱️ **Última verificação em 2026-08-15** — documentação oficial idêntica byte a byte ao `master` upstream (47f9438, veja [SNAPSHOT.md](references/official-docs/SNAPSHOT.md)); tags npm e o tópico `dsh-plugin` (API total_count subiu **2668 → 2671** durante o snapshot de 08-15; 998 repositórios capturados, veja [sources.md](references/sources.md) §D.2) re-verificados ao vivo; HEAD upstream (47f9438) e npm `@deepseek-ai/dsh` (0.1.0-rc.6) sem mudanças.

## 📊 Em resumo

| Documentação oficial | Análises comunitárias | Armadilhas reais | Tópico `dsh-plugin` | Idiomas | Skill de agente |
|---|---|---|---|---|---|
| 215 páginas (EN + ZH) | 114 repos | 20+ | 998 snapshot (API ≈2670) | EN · 中文 · ES · PT · HI | `dsh-plugin-guide` |

## 🚀 Início rápido

### 🤖 Use como skill de agente

Copie a pasta inteira para o diretório de skills do seu agente (os caminhos relativos permanecem válidos):

**Windows (PowerShell)**

```powershell
pwsh -File scripts/install-skill.ps1 `
  -Target "$env:USERPROFILE\.deepseek\skills\dsh-plugin-guide"   # ou <projeto>\.agents\skills\dsh-plugin-guide
```

**macOS / Linux**

```bash
pwsh -File scripts/install-skill.ps1 -Target ~/.deepseek/skills/dsh-plugin-guide   # ou <projeto>/.agents/skills/dsh-plugin-guide
```

O instalador pula `downloads/` (gerado) e `.github/`, e verifica byte a byte cada arquivo copiado. Um `Copy-Item -Recurse` manual da pasta inteira também funciona.

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
| `references/*.md` | Relatórios de pesquisa: docs do repo, site, Cordis, o paper, ecossistema comunitário, arquivo de 114 repos (15 analisados) |
| `scripts/` | Scripts de download idempotentes + verificador de integridade + gerador de censo do tópico |
| `downloads/` | Instantâneos brutos — gerados por `scripts/`, não versionados |

## ✨ Destaques

- 📜 **Contrato do plugin e regras rígidas** — efeitos/disposers, `next()` no waterfall, visível-para-o-modelo ⇔ registrado, configuração Schemastery.
- 🕰️ **Linha do tempo dos mecanismos** — repository-plugin introduzido em 0809, removido em 0811; os dois canais de instalação (bundle vs plugin cordis simples).
- 🕳️ **Mais de 20 armadilhas reais** com causa e solução: cópias duplas do cordis, trio do tsconfig, `tsc` emitindo mesmo com erros, junctions do Windows, sessões zstd multiframe, variáveis `DSH_*`, `latest` do npm desatualizado…
- 🔬 **114 repositórios comunitários arquivados** (15 analisados) — modelos, scaffolds, arquivos de armadilhas, regras do plugin-check, camada Fabric, ponte MCP, mais um guia em 15 idiomas, um curso s01–s23, manuais, SDKs TS/Rust e o lote 08-15 (shells de desktop, ponte QQ, PoCs de segurança, port Python).
- 🔗 **Índice de fontes completo** — cada fato aponta para sua origem (docs oficiais, repos upstream, repos comunitários).
- 🗃️ **1654 Discussions oficiais arquivadas** (com comentários de threads selecionadas) + 100+ artigos comunitários (zh/en/HN) — atualize com `scripts/archive-discussions.ps1` / `scripts/download-community-articles.ps1`.
- 🆕 **Selo de atualidade** — re-verificado contra o `master` upstream, npm e o tópico `dsh-plugin` ao vivo em 2026-08-15.

## 🔄 Mantendo-o atualizado

```sh
pwsh -File scripts/sync-official-docs.ps1                     # cópia integral dos docs a partir de um checkout local (apenas origin/master)
pwsh -File scripts/download-sources.ps1                       # site/docs oficiais, Cordis, paper
pwsh -File scripts/download-community-repos.ps1               # 114 repositórios comunitários (tarballs codeload, atualização por ETag)
pwsh -File scripts/download-community-articles.ps1            # artigos comunitários zh/en/HN (snapshots HTML)
pwsh -File scripts/archive-discussions.ps1                    # Discussions oficiais (requer $env:GH_TOKEN)
pwsh -File scripts/gen-topic-snapshot.ps1 -OutDir <dir>       # censo do tópico dsh-plugin
pwsh -File scripts/verify-kit.ps1 -Checkout <checkout>        # caminhos críticos + links quebrados + relatório de deriva dos docs
```

O CI executa `verify-kit` em cada push e pull request.

## 🏷️ Topics

Este repositório é visível sob os topics do GitHub **[`dsh`](https://github.com/topics/dsh)** e **[`dsh-plugin`](https://github.com/topics/dsh-plugin)** — navegue pelas duas páginas de topic para encontrar centenas de plugins e recursos para desenvolvedores.

## 🤝 Participe

- ⭐ **Dê uma estrela** — ajuda outros autores de plugins DSH a encontrá-lo.
- Encontrou um erro, uma nova armadilha ou um repo que merece análise? Abra uma [issue](https://github.com/PerryLink/dsh-plugin-guide/issues) ou um pull request — veja [CONTRIBUTING.md](CONTRIBUTING.md).
- Junte-se à comunidade: [Discord do DeepSeek Harness](https://discord.gg/Ycq5dCaS4) · [discussões oficiais](https://github.com/deepseek-ai/deepseek-harness/discussions) · [topic `dsh-plugin`](https://github.com/topics/dsh-plugin).

## 📄 Licença e atribuição

- Texto próprio (`SKILL.md`, `guide/`, relatórios de `references/`, `scripts/`, este README): **Apache-2.0** — veja [LICENSE](LICENSE).
- O conteúdo de terceiros incluído está documentado em [NOTICE.md](NOTICE.md), com seus limites de distribuição
  (ex.: `downloads/` é apenas local; `awesome-dsh-plugins` não deve ser redistribuído).

## ⚖️ Aviso legal

Mantido pela comunidade; **não** é um produto oficial da DeepSeek. O DeepSeek Harness está em prévia de
desenvolvedor e publica mudanças incompatíveis; em caso de dúvida, a documentação oficial em
`references/official-docs/` é a fonte da verdade.
