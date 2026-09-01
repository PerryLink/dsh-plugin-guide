# 文档链接索引（links.md）

> `dsh-plugin-guide` 的 URL 索引：官方开发/参考文档的**线上 URL ↔ 本地副本**对照，加上社区开发文档的常用入口。
> **官方文档 URL 的唯一家**：官方链接在本文件维护，别处只引用本文件；社区链接的完整清单家是 [community-ecosystem.md](../references/community-ecosystem.md)，这里只列开发时最常用的入口，避免两份清单漂移。
> 文档站根路由为中文，`en/` 前缀为英文投影；本地副本统一在 `references/official-docs/docs/`，`.zh.md` 为中文对。
> 引用本文件的位置：[SKILL.md](../SKILL.md)、[plugin-dev-guide.md](plugin-dev-guide.md) §1/§9、[quick-reference.md](quick-reference.md)、README。

## 1. 官方开发文档（develop）

站点基址 `https://deepseek-harness.github.io/deepseek-harness`；下表链接为中文根路由，英文页在路径前加 `en/`。

| 主题 | 站点路由 | 本地副本（references/official-docs/docs/） |
|---|---|---|
| 第一个 Harness 插件（入门） | [develop/basic/](https://deepseek-harness.github.io/deepseek-harness/develop/basic/) | user/develop/basic/index.md |
| 开发一个 Tool | [develop/basic/tool](https://deepseek-harness.github.io/deepseek-harness/develop/basic/tool) | user/develop/basic/tool.md |
| 插件配置 | [develop/basic/config](https://deepseek-harness.github.io/deepseek-harness/develop/basic/config) | user/develop/basic/config.md |
| 打包与安装插件 | [develop/basic/publish](https://deepseek-harness.github.io/deepseek-harness/develop/basic/publish) | user/develop/basic/publish.md |
| 插件与生命周期 | [develop/framework/](https://deepseek-harness.github.io/deepseek-harness/develop/framework/) | user/develop/framework/index.md |
| 服务与依赖 | [develop/framework/service](https://deepseek-harness.github.io/deepseek-harness/develop/framework/service) | user/develop/framework/service.md |
| 事件系统 | [develop/framework/events](https://deepseek-harness.github.io/deepseek-harness/develop/framework/events) | user/develop/framework/events.md |
| 能力的三层拆分 | [develop/practice/](https://deepseek-harness.github.io/deepseek-harness/develop/practice/) | user/develop/practice/index.md |
| LLM 适配器 | [develop/practice/llm-adapter](https://deepseek-harness.github.io/deepseek-harness/develop/practice/llm-adapter) | user/develop/practice/llm-adapter.md |
| Cordis 框架教程 01–07 | [develop/cordis-tutorial/](https://deepseek-harness.github.io/deepseek-harness/develop/cordis-tutorial/) | cordis-tutorial/ |

## 2. 官方参考文档（reference）

| 主题 | 站点路由 | 本地副本（references/official-docs/docs/） |
|---|---|---|
| 架构总纲 | [reference/](https://deepseek-harness.github.io/deepseek-harness/reference/) | architecture.md |
| Cordis 入门（5 分钟） | [reference/cordis-primer](https://deepseek-harness.github.io/deepseek-harness/reference/cordis-primer) | cordis-primer.md |
| 能力接缝 | [reference/capability-seams](https://deepseek-harness.github.io/deepseek-harness/reference/capability-seams) | capability-seams.md |
| Agent 生命周期 | [reference/agent-lifecycle](https://deepseek-harness.github.io/deepseek-harness/reference/agent-lifecycle) | agent-lifecycle.md |
| Tool 执行管线 | [reference/tool-execution-pipeline](https://deepseek-harness.github.io/deepseek-harness/reference/tool-execution-pipeline) | tool-execution-pipeline.md |
| 生成式参考（配置/Tool/持久化） | [reference/config-catalog](https://deepseek-harness.github.io/deepseek-harness/reference/config-catalog) · [tool-catalog](https://deepseek-harness.github.io/deepseek-harness/reference/tool-catalog) · [persistence-catalog](https://deepseek-harness.github.io/deepseek-harness/reference/persistence-catalog) | config-catalog.md / tool-catalog.md / persistence-catalog.md |
| Cordis 核心 API | [reference/cordis-api/context](https://deepseek-harness.github.io/deepseek-harness/reference/cordis-api/context) · [events](https://deepseek-harness.github.io/deepseek-harness/reference/cordis-api/events) · [fiber](https://deepseek-harness.github.io/deepseek-harness/reference/cordis-api/fiber) · [registry](https://deepseek-harness.github.io/deepseek-harness/reference/cordis-api/registry) · [service](https://deepseek-harness.github.io/deepseek-harness/reference/cordis-api/service) · [inherited](https://deepseek-harness.github.io/deepseek-harness/reference/cordis-api/inherited) | cordis-api/ |
| 开发手册（Cookbook） | [adding-a-package](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/adding-a-package) · [adding-a-tool](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/adding-a-tool) · [adding-an-llm-adapter](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/adding-an-llm-adapter) · [extension-cookbook](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/extension-cookbook)（`adding-a-conversation-node` 已在 alpha.3 上游移除） | cookbook/ |
| 子系统生成式服务/事件 API | [reference/subsystems/](https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/)（每个子系统一页：tools、shell、session、web、skills、subagent……） | subsystems/ |

## 3. 官方仓库与直链（GitHub，master 分支）

- 仓库根：https://github.com/deepseek-ai/deepseek-harness · 官网：https://www.deepseek.com/harness/
- 开发红线 [AGENTS.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/AGENTS.md)（本地副本 references/official-docs/AGENTS.md）
- **官方 Discussions（Issues 关闭，反馈主渠道）**：https://github.com/deepseek-ai/deepseek-harness/discussions —— 全量 **1654 条**（2026-08-15 刷新）归档于 `downloads/github/harness/discussions/`（list.json 含正文；精选线程含评论，`scripts/archive-discussions.ps1` 可带 token 幂等刷新）；**社区关键动态**：[#1629 RFC：官方插件脚手架（template repo + `pnpm create dsh-plugin`）](https://github.com/deepseek-ai/deepseek-harness/discussions/1629)（08-15T01:15Z 发布）、安全审计类 [#817](https://github.com/deepseek-ai/deepseek-harness/discussions/817)、[#454](https://github.com/deepseek-ai/deepseek-harness/discussions/454)
- **npm 包**：`@deepseek-ai/dsh`（https://www.npmjs.com/package/@deepseek-ai/dsh）等全家桶 72 个包元数据归档于 `downloads/npm/`（README 含全表）；`create-dsh-plugin`（https://www.npmjs.com/package/create-dsh-plugin）
- 未上站的仓库内文档（本地副本 references/official-docs/docs/ 同名文件）：
  - [docs/event-producer-consumer.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/event-producer-consumer.md) — 全事件生产/消费矩阵
  - [docs/defensive-patterns.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/defensive-patterns.md) — 防御性模式
  - [docs/glossary.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/glossary.md) — 术语表
  - [docs/testing.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/testing.md) — 测试政策
- 仓库根文件（本地副本 references/official-docs/）：BENCHMARK.md、CLAUDE.md（symlink→AGENTS.md）、CONTRIBUTING.md/.zh.md/.i18n.yaml、README.zh.md/.i18n.yaml、THIRD_PARTY_NOTICES.md、LICENSE
- 上游 Cordis 框架：https://github.com/cordiverse/cordis · Cordis 论文：https://github.com/cordiverse/paper · **Cordis 文档站源：https://github.com/cordiverse/docs（60+ md，本地 `downloads/github/cordis/docs/`）**

## 4. 社区开发文档（常用入口）

完整 114 仓库清单、awesome 列表与归档位置见 [community-ecosystem.md](../references/community-ecosystem.md)；逐仓库深读见 [community-repo-deep-dive.md](../references/community-repo-deep-dive.md)（首批 15 个）；08-14 晚生态扫描（26 高优文档型 + 19 中优 skill/契约 + 20 低优目录）见 `downloads/_research/github-ecosystem-scan.md`；08-15 第七批（14 个桌面端/桥接/安全/移植仓库）与第八批（3 个主题/市场仓库）见 community-ecosystem.md §4.6/§4.7。

| 仓库 | 用途 |
|---|---|
| [omdsh-dev/plugin-template](https://github.com/omdsh-dev/plugin-template) | 生产级独立插件模板：src 四文件结构 + 7 个开发 skill + 自包含 prepare + 契约文档 |
| [omdsh-dev/dsh-plugin-dev](https://github.com/omdsh-dev/dsh-plugin-dev) | 踩坑档案：20 个实测坑 + 环境基线 |
| [Opr4Mp3r/deepseek-harness-plugin-from-scratch](https://github.com/Opr4Mp3r/deepseek-harness-plugin-from-scratch) | 代码审计式渐进教程：17 反模式 + 交付检查单 |
| [vlln/plugin-registry](https://github.com/vlln/plugin-registry) | 插件注册中心 + make-dsh-plugin skill + 机制时间线（repository 0809→0811） |
| [whyihaveyou/dsh-suite](https://github.com/whyihaveyou/dsh-suite) | 双语插件目录 + `npm create dsh-plugin` 脚手架 + 每日兼容性 CI |
| [omdsh-dev/dsh-plugin-check](https://github.com/omdsh-dev/dsh-plugin-check) | 插件健康检查：清单协议 / patch 格式 / 构建陷阱 |
| [omdsh-dev/dsh-plugin-skills](https://github.com/omdsh-dev/dsh-plugin-skills) | agent 会话内搭建/测试插件的 skill 集 |
| [randerous/dsh-turn-meta](https://github.com/randerous/dsh-turn-meta) | 最小首插件模板（agent/pre-step + prepend:true） |
| [flaqai/deepeseek-harness-guide](https://github.com/flaqai/deepeseek-harness-guide) | **15 语言**开发/插件构建指南（最接近官方文档多语翻译） |
| [Electricitysheep/dsh-handbook](https://github.com/Electricitysheep/dsh-handbook) | 从 0 到 1 深度手册（14 章双语 + 2 PDF，174★） |
| [flysheep-ai/learn_deepseek_harness](https://github.com/flysheep-ai/learn_deepseek_harness) | 可运行渐进课程 s01–s23（33 SKILL） |
| [pingfanfan/hello-dsh](https://github.com/pingfanfan/hello-dsh) | 零基础插件开发教程（22 个中文技能实例） |
| [LaplaceYoung/dsh-book-deepseek-harness](https://github.com/LaplaceYoung/dsh-book-deepseek-harness) | 《深入理解 DeepSeek Harness》源码拆解书（42 md + PDF） |
| [curtiseng/cordis-course](https://github.com/curtiseng/cordis-course) | Cordis 论文交互式中文课程与译文 |
| [NanmiCoder/dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) | 英文插件开发教程 `docs/developing-dsh-plugins.md` + dsh-plugin-development SKILL |
| [openma-ai/deepseek-harness-typescript-sdk](https://github.com/openma-ai/deepseek-harness-typescript-sdk) | TypeScript SDK（类型/DTS 参考）；Rust 版 [Loner1024/deepseek-harness-sdk-rs](https://github.com/Loner1024/deepseek-harness-sdk-rs) |
| [anywhere-labs/deepseek-harness-desktop](https://github.com/anywhere-labs/deepseek-harness-desktop) | Electron 桌面端（macOS/Windows 深度适配，08-15 归档）；同类 [cc1252](https://github.com/cc1252/deepseek-harness-desktop)、[ChisaAlter](https://github.com/ChisaAlter/Deepseek-Harness-Desktop) 等 |
| [zzszmyf/dsh-security-pocs](https://github.com/zzszmyf/dsh-security-pocs) | 三个漏洞 + 链式利用 PoC（!!js 配置执行/沙箱逃逸），配套官方讨论 #817/#454/#523/#250 |
| [HenryZ838978/deepseek-harness](https://github.com/HenryZ838978/deepseek-harness) | Python 移植（`pip install deepseek-harness` + MCP server + 16 协议怪癖/270+ 试验） |
| [banana770/dsh-qq-bridge](https://github.com/banana770/dsh-qq-bridge) | QQ ↔ Harness 桥接；npm 配套 [dsh-plugin-adapter-qq](https://www.npmjs.com/package/dsh-plugin-adapter-qq) |

## 5. 官方与社区渠道

- Discord：https://discord.gg/Ycq5dCaS4 · GitHub 讨论区：https://github.com/deepseek-ai/deepseek-harness/discussions（归档见 §3）
- 插件话题页：https://github.com/topics/dsh-plugin（08-15 快照在 `downloads/topic-snapshots/dsh-plugin-topic-2026-08-15/`，位置记录见 [sources.md](../references/sources.md) §D.2）
- awesome 列表（插件发现）：见 [community-ecosystem.md](../references/community-ecosystem.md) §5
- **中文社群与媒体**：微信公众号「DeepSeek Harness 团队」（黑鲸头像，08-12 注册）、企微小助手群（官方 README 链接）；[V2EX](https://global.v2ex.co/t/1234341) 系列线程（1234203/1234320/1234341/1234424/1234521…）；[Bilibili 教程视频](https://www.bilibili.com/video/BV1WmgF6qEMn/)（速通/安装/实战共 9 支，清单见归档 README）；知乎提问 [2040450519303288568](https://www.zhihu.com/question/2040450519303288568)（403 反爬，需浏览器）
- **英文社群与媒体**：Hacker News（[主发布线程 49285244](https://hn.edgecompute.app/item/49285244) + 5 条子线程，镜像已归档）；X/Twitter（官方 @deepseek_ai [发布帖](https://twitter.com/deepseek_ai/status/2087887408440164663)，digg 聚合见 [Web UI 截图帖](https://digg.com/tech/7fx4ofvh)/[内测招募帖](https://digg.com/tech/silt5bft)）；[OpenRouter Ori Harness](https://openrouter.ai/docs/guides/ori/harness)（OpenRouter 的 DSH 集成）；[Ollama 官方集成](https://docs.ollama.com/integrations/deepseek-harness)
- 社区文章归档（**149 篇**，`downloads/web/community-articles/`，`scripts/download-community-articles.ps1` 幂等刷新）：中文教程/实测（cnblogs、CSDN、51CTO、阿里云、V2EX、locdd、36氪、量子位、B站…）、英文教程（dev.to、AgentPedia、ExplainX、X-CMD、Ollama…）、HN 镜像线程 7 条
- 中文速查 + 踩坑：[V2EX 1234341](https://global.v2ex.co/t/1234341)；X-CMD 一键安装：https://www.x-cmd.com/install/deepseek-harness/ ；Ollama 集成：https://docs.ollama.com/integrations/deepseek-harness

## 6. 断链校验

本文件与 README、SKILL.md、guide/*.md 的相对链接由 `scripts/verify-kit.ps1` 扫描；新增链接后运行 `pwsh -File scripts/verify-kit.ps1` 验证。
