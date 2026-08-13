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
| 开发手册（Cookbook） | [adding-a-package](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/adding-a-package) · [adding-a-tool](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/adding-a-tool) · [adding-an-llm-adapter](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/adding-an-llm-adapter) · [extension-cookbook](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/extension-cookbook) · [adding-a-conversation-node](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/adding-a-conversation-node) | cookbook/ |
| 子系统生成式服务/事件 API | [reference/subsystems/](https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/)（每个子系统一页：tools、shell、session、web、skills、subagent……） | subsystems/ |

## 3. 官方仓库与直链（GitHub，master 分支）

- 仓库根：https://github.com/deepseek-ai/deepseek-harness · 官网：https://www.deepseek.com/harness/
- 开发红线 [AGENTS.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/AGENTS.md)（本地副本 references/official-docs/AGENTS.md）
- 未上站的仓库内文档（本地副本 references/official-docs/docs/ 同名文件）：
  - [docs/event-producer-consumer.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/event-producer-consumer.md) — 全事件生产/消费矩阵
  - [docs/defensive-patterns.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/defensive-patterns.md) — 防御性模式
  - [docs/glossary.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/glossary.md) — 术语表
  - [docs/testing.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/testing.md) — 测试政策
- 上游 Cordis 框架：https://github.com/cordiverse/cordis · Cordis 论文：https://github.com/cordiverse/paper

## 4. 社区开发文档（常用入口）

完整 15 仓库清单、awesome 列表与归档位置见 [community-ecosystem.md](../references/community-ecosystem.md)；逐仓库深读见 [community-repo-deep-dive.md](../references/community-repo-deep-dive.md)。

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

## 5. 官方与社区渠道

- Discord：https://discord.gg/Ycq5dCaS4 · GitHub 讨论区：https://github.com/deepseek-ai/deepseek-harness/discussions
- 插件话题页：https://github.com/topics/dsh-plugin（全量清单快照在本地工作区，位置记录见 [sources.md](../references/sources.md)）
- awesome 列表（插件发现）：见 [community-ecosystem.md](../references/community-ecosystem.md) §5

## 6. 断链校验

本文件与 README、SKILL.md、guide/*.md 的相对链接由 `scripts/verify-kit.ps1` 扫描；新增链接后运行 `pwsh -File scripts/verify-kit.ps1` 验证。
