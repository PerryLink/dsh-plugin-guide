<h1 align="center">dsh-plugin-guide</h1>

<p align="center">
  <b>开发 DeepSeek Harness 插件所需的一切。</b><br/>
  官方文档存档 · Cordis 入门 · 社区深读 · 实测踩坑 · 智能体技能
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.es.md">Español</a> ·
  <a href="README.pt.md">Português</a> ·
  <a href="README.hi.md">हिन्दी</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/dsh-dsh--plugin-4D6BFE" alt="dsh-plugin">
  <img src="https://img.shields.io/badge/documents-EN%2FZH-8257D0" alt="Documents: EN/ZH">
</p>

---

## 这是什么？

一个**自包含**的 DeepSeek Harness（[`dsh`](https://github.com/deepseek-ai/deepseek-harness)，基于
[Cordis](https://github.com/cordiverse/cordis) 的"一切皆插件"智能体框架）插件开发知识库。Cordis 的设计见论文
[A Programming Paradigm for Spatiotemporal Composability](https://github.com/cordiverse/paper)。

内含：

- **官方文档逐字副本**（中英双语，215 篇）；
- 上游 **Cordis** 框架调研与 **Cordis 论文**；
- **15 个社区插件开发仓库的深读报告**；
- **20+ 个实测踩坑**（cordis 双副本、tsconfig 三件套、多帧 zstd……），每条带根因与修法；
- 汇总成的**分步开发指南**与**一页速查表**；
- 以及可直接在任意智能体会话中调用的 **`dsh-plugin-guide` 技能**。

## 目录结构

| 路径 | 内容 |
|---|---|
| `SKILL.md` | `dsh-plugin-guide` 技能：硬性红线 + 按任务类型的开发路径 |
| `guide/plugin-dev-guide.md` | 完整开发指南（10 章） |
| `guide/quick-reference.md` | 一页速查表 |
| `references/official-docs/` | 官方文档逐字副本（中英双语） |
| `references/*.md` | 调研报告：仓库文档、官网文档站、Cordis、论文、社区生态、15 仓库深读 |
| `scripts/` | 幂等下载脚本 + 完整性检查器 |
| `downloads/` | 原始下载物——由 `scripts/` 生成，不入版本库 |

## 快速开始

### 作为智能体技能使用

把整个目录复制进你的 agent 技能目录（相对路径保持不变）：

```powershell
Copy-Item -Recurse -Force `
  'D:\path\to\dsh-plugin-guide' `
  "$env:USERPROFILE\.deepseek\skills\dsh-plugin-guide"   # 或 <项目>\.agents\skills\
```

然后对智能体说：*"用 dsh-plugin-guide 技能帮我开发一个 XX 插件。"*

### 或者直接阅读

- **赶时间？** → [`guide/quick-reference.md`](guide/quick-reference.md)
- **完整路径？** → [`guide/plugin-dev-guide.md`](guide/plugin-dev-guide.md)
- **查精确 API？** → `references/official-docs/docs/subsystems/` 与 `docs/cordis-api/`

## 亮点

- **插件契约与红线**——注册即 effect、waterfall 必须 `next()`、模型可见⟺已记录、Schemastery 配置。
- **机制时间线**——repository-plugin 机制 0809 推出、0811 移除；bundle 与纯 cordis 两条安装通道。
- **20+ 个实测坑**（根因+修法）：cordis 双副本、tsconfig 三件套、`tsc` 报错仍产出、Windows junction、多帧 zstd 会话、`DSH_*` 环境变量、npm `latest` 过期……
- **15 个社区仓库深读**——模板、脚手架、踩坑档案、plugin-check 规则、Fabric 层、MCP 桥。
- **全量来源索引**——每条结论都链接到出处（官方文档、上游仓库、社区仓库）。

## 重新生成原始下载物

`downloads/` 有意不入版本库，随时可重新生成：

```sh
pwsh -File scripts/download-sources.ps1           # 官网/文档站、Cordis、论文
pwsh -File scripts/download-community-repos.ps1   # 15 个社区仓库
```

## 完整性校验

```sh
pwsh -File scripts/verify-kit.ps1   # 关键路径 + 断链扫描
```

## 参与共建

- ⭐ **给仓库点 Star**——帮助更多 DSH 插件开发者发现它。
- 发现错误、新坑或值得深读的仓库？提 [issue](https://github.com/PerryLink/dsh-plugin-guide/issues) 或 Pull Request——见 [CONTRIBUTING.md](CONTRIBUTING.md)。
- 加入社区：[DeepSeek Harness Discord](https://discord.gg/Ycq5dCaS4) · [官方讨论区](https://github.com/deepseek-ai/deepseek-harness/discussions) · [`dsh-plugin` 话题页](https://github.com/topics/dsh-plugin)。

## 许可与归属

- 自有文本（`SKILL.md`、`guide/`、`references/` 报告、`scripts/`、本 README）：**MIT** —— 见 [LICENSE](LICENSE)。
- 收录的第三方内容及其分发边界见 [NOTICE.md](NOTICE.md)（例如 `downloads/` 仅限本地、`awesome-dsh-plugins` 禁止再分发）。

## 免责声明

社区维护，**不是** DeepSeek 官方产品。DeepSeek Harness 处于开发者预览期、会发布破坏性变更；有疑问时以
`references/official-docs/` 中的官方文档为准。
