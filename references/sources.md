# 全部资料来源清单（sources.md）

> 本清单是 `dsh-plugin-guide` 的"下载与记录"总账：每条来源的 URL、本地归档位置、抓取方式与状态。
> 下载明细（状态/字节数）见 `downloads/manifest.tsv`。

## A. 官方核心来源（用户指定的五个入口）

| # | 来源 | URL | 本地归档 |
|---|---|---|---|
| 1 | deepseek-harness GitHub 仓库 | https://github.com/deepseek-ai/deepseek-harness | 本地 checkout `D:\deepseek-harness`（工作环境本体）+ `references/official-docs/**`（文档副本）+ `downloads/github/harness/README.md`（线上 README 快照） |
| 2 | 官网 Harness 页 | https://www.deepseek.com/harness/ | `downloads/web/deepseek-com-harness.html` + 调研 `references/website-pages.md` |
| 3 | 文档站 develop/basic | https://deepseek-harness.github.io/deepseek-harness/develop/basic/ | `downloads/web/develop-basic.html` + 全站爬取 `downloads/web/site/**` + 投影源 `references/official-docs/docs/user/develop/basic/**` |
| 4 | Cordis 框架仓库 | https://github.com/cordiverse/cordis | `downloads/github/cordis/**`（README/package.json/仓库树/全部 md）+ 调研 `references/upstream-cordis.md` + vendored 源码（本地 checkout `vendor/cordis`） |
| 5 | Cordis 论文仓库 | https://github.com/cordiverse/paper | `downloads/github/paper/**`（README + **paper.pdf 论文全文**）+ 调研 `references/cordis-paper-and-community.md` |

## B. 文档站全站路由清单（GitHub Pages）

站点基址 `https://deepseek-harness.github.io/deepseek-harness/`；根路由为中文投影，`en/` 前缀为英文投影。已全部爬取（`downloads/web/site/<route>.html`）：

- `/`（首页）、`/guide/quickstart`、`/guide/providers`、`/guide/python-sdk`
- `/develop/basic/`、`/develop/basic/tool`、`/develop/basic/config`、`/develop/basic/publish`
- `/develop/framework/`、`/develop/framework/service`、`/develop/framework/events`
- `/develop/practice/`、`/develop/practice/llm-adapter`
- `/develop/cordis-tutorial/` 及 `01-first-plugin`…`07-into-the-harness`
- `/reference/`（架构）、`/reference/cordis-primer`、`/reference/capability-seams`、`/reference/agent-lifecycle`、`/reference/tool-execution-pipeline`
- `/reference/config-catalog`、`/reference/tool-catalog`、`/reference/persistence-catalog`
- `/reference/cordis-api/context|events|fiber|registry|service|inherited`
- `/reference/cookbook/adding-a-package|adding-a-tool|adding-an-llm-adapter|extension-cookbook|adding-a-conversation-node`
- `/reference/subsystems/` + 全部子系统页（core、llm-streaming、token-meter、scope、typert、goal、schedule、commands、session、persistence、settings、credentials、session-query、feedback、session-title、session-reference、system-prompt、tools、user-questions、approval、attachment、shell、subprocess、terminal、sandbox、code-runtime、extensions、filesystem、lsp、skills、compaction、subagent、web、spill、workflow、jobs、permission-presets、plan、invariants、web-server、storage、workspace、client-modules、session-projection、session-telemetry）
- 站点投影清单源文件：`references/official-docs/website-docs.ts`（= 仓库 `website/docs.ts`）

## C. 本地 checkout 文档副本（references/official-docs/）

- `docs/**`（215 个 md，含全部 `.zh.md` 双语对）— 教程/架构/子系统/API/cookbook 全量
- `AGENTS.md`（仓库根，开发红线）· `packages/AGENTS.md` · `examples/AGENTS.md` · `packages/README.md` · `vendor/README.md`（Cordis vendoring 清单与同步流程）
- `website-docs.ts`（站点投影清单）

## D. 社区与生态（downloads/community/ + references/community-ecosystem.md）

### D.1 深读的 15 个插件开发仓库（完整源码 tarball 归档）

归档位置 `downloads/community-repos/<repo>/`（脚本 `scripts/download-community-repos.ps1`，深读报告 `references/community-repo-deep-dive.md`）：

| 仓库 | 定位 |
|---|---|
| omdsh-dev/plugin-template | 生产级独立插件模板（src 四文件结构 + 7 个开发 skill + 自包含 prepare + 契约文档） |
| omdsh-dev/dsh-plugin-skills | agent 会话内搭建/测试插件的 skill 集 |
| omdsh-dev/dsh-plugin-dev | 踩坑档案（20 个实测坑 + 环境基线 + 审查记录） |
| vlln/plugin-registry | 薄控制台 + make-dsh-plugin skill + 插件类型对比（含 repository 机制 0809→0811 时间线） |
| omdsh-dev/fabric | 类 MC Fabric 的 hook 处理器 |
| whyihaveyou/dsh-suite | 双语插件目录 + 每日兼容性 CI + `npm create dsh-plugin` 脚手架 |
| omdsh-dev/dsh-plugin-check | 插件健康检查（清单协议/patch 格式/构建陷阱/hub 收录） |
| Opr4Mp3r/deepseek-harness-plugin-from-scratch | 代码审计式渐进教程（17 反模式 + 交付检查单，锁 harness@47f9438、npm rc.6） |
| randerous/dsh-turn-meta | 最小首插件模板（agent/pre-step + prepend:true 注入范例） |
| bobleer/deepseek-harness-plugin-mcp | 经 MCP 发现/安装/运行 DSH 插件（用户清单中 "ess-plugin-mcp" 的定位假设） |
| Nagi-ovo/dsh-find-plugins | 插件发现 |
| omdsh-dev/dsh-hub-workshop | 插件市场/注册 workshop |
| AdamPlatin123/awesome-dsh-plugins | 插件目录 + 每日兼容性追踪（1556 文件含数据） |
| bruc3van/awesome-dsh-plugin | "30 秒找插件"精选列表 |
| Alex-Yanggg/awesome-DSH-plugin | 精选插件/扩展/调试工具/开发模块（目录 awesome-DSH-plugin-alexyanggg） |

### D.2 生态与社区其他来源

- 官方 Discord 社群：https://discord.gg/Ycq5dCaS4 （官方仓库 README 明文链接）
- GitHub 讨论区：https://github.com/deepseek-ai/deepseek-harness/discussions
- GitHub topic：https://github.com/topics/dsh-plugin（全量清单快照在工作区：`dsh-plugin-topic-2026-08-13/`＝304 个/2026-08-13T15:15Z；`dsh-plugin-topic-2026-08-14/`＝去重 550 个/2026-08-13T18:36Z，API total_count 552–554；`dsh-plugin-topic-2026-08-14b/`＝去重 993 个/2026-08-14T08:16Z，API total_count 1391——search API 分页上限 1000 条，993 是分页内去重数，其余见 total_count）
- awesome-dsh-plugins：https://github.com/AdamPlatin123/awesome-dsh-plugins
- awesome-deepseek-harness：https://github.com/0xsline/awesome-deepseek-harness
- awesome-DSH-plugin：https://github.com/Alex-Yanggg/awesome-DSH-plugin
- awesome-dsh-plugin（精选）：https://github.com/awesome-dsh-plugin/awesome-dsh-plugin
- bruc3van/awesome-dsh-plugin：https://github.com/bruc3van/awesome-dsh-plugin
- Dominic789654/awesome-deepseek-harness：https://github.com/Dominic789654/awesome-deepseek-harness
- dsh-plugin-dev（踩坑档案）：https://github.com/omdsh-dev/dsh-plugin-dev
- plugin-template（插件模板）：https://github.com/omdsh-dev/plugin-template
- dsh-plugin-skills（agent 内开发 skill 集）：https://github.com/omdsh-dev/dsh-plugin-skills
- plugin-registry（含 make-dsh-plugin skill）：https://github.com/vlln/plugin-registry
- dsh-external/hub（生态 hub）：https://github.com/dsh-external/hub（**08-14 核查 404**）
- dshfind（学习分享社区）：https://github.com/hikariming/dshfind
- 工作区已有插件实例（可作参考实现）：`dsh-chat-import`、`dsh-resume-plugin`、`dsh-plugin-claude-bridge`（目录：`D:\deepseek-harness\Project\Plugins\`）
- turtle-ui（git 安装 prepare 范例）：https://github.com/deepseek-harness/turtle-ui（**08-14 核查 404**；官方 publish.md 原文仍引用它，活范例见 omdsh-dev/plugin-template 的 scripts/prepare.mjs）

## E. 上游 Cordis 相关

- cordiverse/cordis 全部 md 文档：`downloads/github/cordis/repo/**`
- cordiverse/paper 全文源文件：`downloads/github/paper/repo/**`
- Cordis 文档站（如存在，见 references/upstream-cordis.md 中的调研记录）

## F. 抓取说明

- 方式：`scripts/download-sources.ps1`（curl.exe；GitHub API 带 User-Agent；含多分支回退 master/main/HEAD）+ `scripts/download-community-repos.ps1`（codeload tarball + tar 解包）。
- 明细：`downloads/manifest.tsv`（主脚本）与 `downloads/community-repos/_download.log`（社区仓库脚本）。
- 重跑：两个脚本均幂等，可随时刷新。
- 时间戳：下载会话当日（详见 manifest 与文件 mtime）；dsh-plugin topic 快照共三期：2026-08-13T15:15:06Z（304 个）、2026-08-13T18:36Z（去重 550 个）与 2026-08-14T08:16Z（去重 993 个，API total_count 1391），见 §D.2。
- 官网 deepseek.com 页面受 Cloudflare 保护时可能失败——以 manifest 记录为准，正文内容以 GitHub Pages 同源文档为准。
- **备注**：用户清单中 `ess-plugin-mcp` 经 GitHub 搜索无精确匹配（最接近者为 Skyrim .ess 插件工具的 MCP，与 DSH 无关）；按 DSH 生态语义定位到 `bobleer/deepseek-harness-plugin-mcp`（让任意 agent 经 MCP 发现/安装/运行 DSH 插件）并归档，如用户所指另有其仓，请告知后补充。
- **2026-08-14 复核（网络实时核验）**：上游 master 仍为 47f9438（本地 checkout 即上游 HEAD，官方文档副本与 checkout 逐文件 hash 一致）；无 GitHub Releases/tag。npm `@deepseek-ai/dsh` latest=next=0.1.0-rc.6（08-13T12:35Z 发布）、`@deepseek-ai/cordis` latest=4.0.1，`@deepseek-ai/dsh-tools` 与 `@deepseek-ai/dsh-session-persistence-jsonl` 的 `latest` 仍为过期的 0.0.1-rc.1（`next`=0.1.0-rc.6）；已发布还包括 dsh-shell（0.0.1-rc.5）、dsh-session*/dsh-web/dsh-headless/dsh-loader-smoke/dsh-skill（0.0.1-rc.1）；dsh-core、dsh-sdk 未发布（404）；**无作用域 `dsh` 包是无关项目 node-dsh**（description: A shell written in JavaScript）。
- **2026-08-14 二次复核（08:16Z，网络实时核验）**：`create-dsh-plugin` 已发布（latest=0.1.1，2026-08-13T15:15:42Z）——上次复核"未发布（404）"的记录作废；`@deepseek-ai/cordis` 另发布 `next`=4.0.1-rc.4；其余 npm 结论不变（dsh/dsh-tools/dsh-session-persistence-jsonl/dsh-shell 同上；dsh-core、dsh-sdk 仍 404）。`dsh-plugin` 话题 API total_count 增长至 1391（08-14T08:16Z，分页去重 993，见 §D.2）。官方文档副本与上游 `origin/master`（47f9438）逐字节一致，快照记录见 `references/official-docs/SNAPSHOT.md`。
- **2026-08-14 外链扫描**：KB 自有文档 215 个外部 URL 逐一探测。真死链已修复/标注：turtle-ui、dsh-external/hub、deepseek-harness/cordis（404）；npmjs/socket.dev/新闻站（163/sohu/qq/aihot）与 discord.gg 对 curl 返回 403/501/超时属反爬，浏览器可用，非死链；cordiverse/paper 的 raw README（master/main）均 200。
- **2026-08-14 社区仓库提交复核**：15 个深读仓库中 6 个在 08-13T15:15Z 快照后有新提交——dsh-suite（16:20Z X digest 管线/first-party 目录）、from-scratch（16:29Z 教程 prose 与 checkpoint 对齐）、plugin-mcp（16:16Z Streamable HTTP 每会话独立 Server 修复）、dsh-hub-workshop（17:30Z qualify catalog + close registry）、AdamPlatin123/awesome-dsh-plugins（18:10Z 登记 PR #4/#14 等）、bruc3van/awesome-dsh-plugin（17:56Z 目录刷新）；其余 9 个无新提交、无改名/归档。已按最新 HEAD 全部重下（HEAD 记录 downloads/community-repos/_heads.tsv）。
