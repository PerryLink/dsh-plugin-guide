# 全部资料来源清单（sources.md）

> 本清单是 `dsh-plugin-guide` 的"下载与记录"总账：每条来源的 URL、本地归档位置、抓取方式与状态。
> 下载明细（状态/字节数）见 `downloads/manifest.tsv`；社区仓库明细见 `downloads/community-repos/_download.log`。
> 2026-08-14 晚间二次补录（本文件本次更新）涵盖：官方 Discussions、npm 全家桶、cordiverse 组织其余仓库、GitHub 生态新增 80+ 文档仓库、中英文社区文章与 HN 线程。

## A. 官方核心来源（用户指定的五个入口）

| # | 来源 | URL | 本地归档 |
|---|---|---|---|
| 1 | deepseek-harness GitHub 仓库 | https://github.com/deepseek-ai/deepseek-harness | 本地 checkout `D:\deepseek-harness`（工作环境本体）+ `references/official-docs/**`（文档副本）+ `downloads/github/harness/README.md`（线上 README 快照）+ **`downloads/github/harness/discussions/`（Discussions 全量归档，2026-08-14 新增）** |
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
- **08-14 晚复核**：上游 master 仍为 47f9438（站点随仓库构建，无新增路由）；此前 404 的 `/reference/subsystems/{attachment,extensions,feedback}` 仍为 404（已确认），sitemap.xml 仍不存在。

## C. 本地 checkout 文档副本（references/official-docs/）

- `docs/**`（215 个 md，含全部 `.zh.md` 双语对）— 教程/架构/子系统/API/cookbook 全量
- 仓库根文件（**2026-08-14 晚新增**）：`AGENTS.md`、`CLAUDE.md`（上游为 symlink→AGENTS.md，副本存其目标文本）、`BENCHMARK.md`、`CONTRIBUTING.md`/`.zh.md`/`.i18n.yaml`、`README.zh.md`/`.i18n.yaml`、`THIRD_PARTY_NOTICES.md`、`LICENSE`
- `packages/AGENTS.md` · `examples/AGENTS.md` · `packages/README.md` · `vendor/README.md`
- `website-docs.ts`（站点投影清单）
- 上游英文 `README.md` 不进入本目录（与 KB 索引同名），线上快照在 `downloads/github/harness/README.md`
- 同步脚本本次加固：pathspec 全部 `:(top)` 锚定（避免 basename 全局匹配误收仓库深处 symlink）；Windows 下无法解出的 symlink 按其 blob 目标文本落地；目的目录只保留范围内条目（曾因一次失败抽取残留污染，已由脚本自动修剪 107 项）。

## D. 社区与生态（downloads/community/ + references/community-ecosystem.md）

### D.1 插件开发仓库完整 tarball 归档（scripts/download-community-repos.ps1，共 114 个）

| 批次 | 仓库 | 定位 |
|---|---|---|
| 第一批（15） | omdsh-dev/plugin-template、omdsh-dev/dsh-plugin-skills、omdsh-dev/dsh-plugin-dev、vlln/plugin-registry、omdsh-dev/fabric、whyihaveyou/dsh-suite、omdsh-dev/dsh-plugin-check、Opr4Mp3r/deepseek-harness-plugin-from-scratch、randerous/dsh-turn-meta、bobleer/deepseek-harness-plugin-mcp、Nagi-ovo/dsh-find-plugins、omdsh-dev/dsh-hub-workshop、AdamPlatin123/awesome-dsh-plugins、bruc3van/awesome-dsh-plugin、Alex-Yanggg/awesome-DSH-plugin | 首批深读（报告 `references/community-repo-deep-dive.md`） |
| 第二批（14） | walkinglabs/awesome-deepseek-harness-plugins、vvlife/awesome-deepseek-harness-plugins、cccakeee/awesome-dsh-plugins、bradeGithub/DSH-Plugins-Marketplace、Toukaiteio/dsh-plugin-installer、Scorp1o117/dsh-plugin-marketplace、NanmiCoder/dsh-agent-teams、vibeinging/dsh-tool-search、zhu1090093659/dsh-web-ui、ccch1mneyyy/dsh-cc-tui、dataelement/dsh-desktop、hust-open-atom-club/oh-dsh-desktop、lhh010/dsh-bash-encoding、Nagi-ovo/dsh-visualize | 08-14 上午清单（awesome/市场/候选） |
| 第三批（26，高优文档型） | flaqai/deepeseek-harness-guide（15 语言指南）、Electricitysheep/dsh-handbook（14 章双语+PDF）、JingHao-Leon/deepseek-harness-guide（保姆级双语教程）、flysheep-ai/learn_deepseek_harness（s01–s23+33 SKILL）、pingfanfan/hello-dsh（22 技能实例）、LaplaceYoung/dsh-book-deepseek-harness（42 md 源码拆解书）、yanhua1010/dsh-harness-tutorial（39 md+8 demo）、hoco-scy/deepseek-harness-deep-dive（36 章/1094 证据）、libukai/awesome-deepseek-harness（中英日三语）、sandbaseai/deepseek-harness-handbook（多语手册）、openma-ai/deepseek-harness-typescript-sdk（TS SDK）、h565656445/dsh-llm-agent-harness-guide、h565656445/dsh-agent-os-worker-protocol、cyanseek/dsh-native-playbook、whyihaveyou/dsh-plugin-tutorial、DumplingHuman/dsh-plugin-tutorial、anweat/dsh-plugin-dev-guide、Hubert-hwk/dsh-for-humans、yangl326-Dylan/learning-dsh、curtiseng/cordis-course（Cordis 论文中文课程）、THU-MAIC/dsh-openmaic（清华 MAIC）、qomob/DSHwiki、calderbuild/awesome-deepseek-harness、njdldkl666699/dsh-learning、Loner1024/deepseek-harness-sdk-rs（Rust SDK）、dshworks/howto-dsh | 08-14 晚 GitHub 生态扫描（报告 `downloads/_research/github-ecosystem-scan.md`） |
| 第四批（19，中优 skill/契约） | dhicoc/dsh-reverse-skill（85 SKILL）、phoenixlucky/zerotoken-skill、unknowbug/anchorlaw、w2112515/dsh-plugin-development、OneZero-Y/dsh-plugin-kit、akira399/dsh-plugin-publisher、LeslieWylie/dsh-plugin-release、LeslieWylie/dsh-benchmark-evidence、LeslieWylie/dsh-agent-orchestration、dongsheng123132/task-passport、Tostoevsky/TsienHsueShen、Whning0513/awesome-deepseek-skills、Jesse-njx/dsh-skillport、green-dalii/dsh-plugin-dev-skill、RayYeung1989/dsh-plugin-development、SmileTao/dsh-plugin-dev-skill、Leeaoyin/dr-agent-skills、KhalilYamber/hana-dsh-bridge、ieookm/agent-to-dsh-migration | 同上扫描（中优先级） |
| 第五批（20，低优目录/市场） | kejixiaoliang/awesome-dsh-plugins、like-study1/Oh-My-DSH、zp-home/dsh-recommend、white0dew/awesome-dsh-plugins、wangshunnn/oh-my-dsh、billLiao/awesome-dsh-plugin、YYTbit/awesome-dsh-bridges、HackSing/dsh-plugins、xiaohai-78/Top、2BingLing/dsh-market、lwmxiaobei/dsh-plugins、dshworks/awesome-dsh-themes、dshworks/awesome-dsh-plugins、dsh-pub/dsh-pub、cooljser/dsh-plugin-portal、WatchaAI/awesome-deepseek-harness-plugins、imsai-sh/awesome-deepseek-harness-plugins、xianyu110/awesome-deepseek-harness、openguardrails/openguardrails、Bandersnatch0x/amber-protocol | 同上扫描（低优先级，README 即文档） |
| 第六批（3） | onychen/learn-dsh、alchaincyf/deepseek-harness-orange-book（橙皮书《从开机到拆开》）、bobleer/deepseek-harness-gui（Tauri 桌面壳） | 中英文社区扫描补充 |
| 第七批（14） | anywhere-labs/cc1252/LisiChen0/Skyearn/salathleizhang/ChisaAlter/hairyf 的 deepseek-harness-desktop 系列（7 个桌面端）、banana770/dsh-qq-bridge（QQ 桥接）、Vengisk/deepseek-harness-termux、zzszmyf/dsh-security-pocs（安全 PoC）、HenryZ838978/deepseek-harness（Python 移植）、Lyowisee/deepseek-harness、mishibeikejie/zat-dsh-engine（可视化市场）、beancookie/awesome-dsh-plugin | 08-15 上午 web_search 增量扫描（清单见 community-ecosystem.md §4.6） |
| 第八批（3） | orxz/deepseek-harness-themes（主题集合）、vvlife/whalehub-dsh（WhaleHub 插件市场）、dsh-market/dsh-market（市场注册表组织） | 08-15 午间 web_search 补充（见 community-ecosystem.md §4.7） |

归档位置 `downloads/community-repos/<repo>/`；ETag 记录 `_heads.tsv`；运行日志 `_download.log`。**同名消歧规则（08-15 起）**：多个 owner 有同名仓库（如 4 个 awesome-dsh-plugins、7 个 deepseek-harness-desktop）且 Windows 文件系统大小写不敏感——清单中首个出现者保留裸目录名（兼容既有文档引用），后续同名者用 `<owner>-<repo>` 目录名。脚本改造史：08-14 晚改为 codeload HEAD 探测 + tarball（零 api.github.com 配额消耗）；08-15 修复弱 ETag（`W/"..."`）解析 bug、PS 5.1 切片数学、新增第七批与 `-OnlyMissing`。

### D.2 生态与社区其他来源

- 官方 Discord 社群：https://discord.gg/Ycq5dCaS4 （官方仓库 README 明文链接）
- GitHub 讨论区：https://github.com/deepseek-ai/deepseek-harness/discussions —— **全量归档见 §G**
- GitHub topic：https://github.com/topics/dsh-plugin —— 08-14 晚 total_count=2034（topic:deepseek-harness=1432、topic:dsh=980），扫描报告 `downloads/_research/github-ecosystem-scan.md`；早期三期快照在工作区（304/550/993 去重，见前版记录）
- 生态目录/市场类仓库（第五批）与文档型仓库（第三/四批）完整清单见 §D.1 与 `references/community-ecosystem.md`
- dshfind（学习分享社区）：https://github.com/hikariming/dshfind
- 工作区已有插件实例（可作参考实现）：`dsh-chat-import`、`dsh-resume-plugin`、`dsh-plugin-claude-bridge`（目录：`D:\deepseek-harness\Project\Plugins\`）
- turtle-ui（git 安装 prepare 范例）：https://github.com/deepseek-harness/turtle-ui（**08-14 核查 404**；官方 publish.md 原文仍引用它，活范例见 omdsh-dev/plugin-template 的 scripts/prepare.mjs）

## E. 上游 Cordis 相关

- cordiverse/cordis 全部 md 文档：`downloads/github/cordis/repo/**`
- cordiverse/paper 全文源文件：`downloads/github/paper/repo/**`
- **cordiverse 组织其余仓库（2026-08-14 晚新增归档，`downloads/github/cordis/<repo>/`）**：
  - `docs/` —— **Cordis 官方文档站源（zh-CN，60+ md：API/design/guide/manual/install）**，此前未收录
  - `webui/`（Cordis App WebUI，385 文件）、`cli/`、`server/`、`capability/`、`registry/` —— 框架周边实现与文档
- Cordis 文档站（如存在，见 references/upstream-cordis.md 中的调研记录）；cordis.io 为 308 自循环重定向、cordisjs.org 无解析（08-14 复核，均不可用）

## F. 官方 GitHub Discussions 归档（2026-08-14 晚新增；2026-08-15 刷新）

`downloads/github/harness/discussions/`（说明文件 `README.md` 含分类统计与精选清单；刷新脚本 `scripts/archive-discussions.ps1`）：

- `list.json` —— 全部 **1654 条**讨论（title/body/category/answers 等，正文即文档；08-14 首版 1408 条，08-15 增量 +246）
- `comments-<n>.json` —— 精选线程的全部评论（规则：Announcements/Q&A/Ideas 评论≥1；General/Show and tell 评论≥3 且非拉群帖）
- `_selection.tsv` —— 精选清单
- 背景：官方仓库 **Issues 关闭、Discussions 开放**（社区反馈主渠道）；排障与功能讨论代表：#49 ArchLinux 安装、#55 pnpm 全局安装 cordis-plugin-timer 缺失、#60 外部 GUI/ACP bridge、#30 win32 目录选择器；**08-15 新编号至 1629+**，代表作 [#1629 RFC 官方插件脚手架](https://github.com/deepseek-ai/deepseek-harness/discussions/1629)（08-15T01:15Z）、安全审计类 #817/#454/#523/#250

## G. npm 包归档（2026-08-14 晚新增）

`downloads/npm/`（说明文件 `README.md` 含全表）：

- **@deepseek-ai/* 全家桶 72 个包**的 registry 元数据（全部版本历史+dist-tags；README 非空者另存 `.readme.md`）：由 `@deepseek-ai/dsh@0.1.0-rc.6` 依赖树（约 60 个 dsh-* 包 + cordis-plugin-hmr/loader/timer/include）+ 历史已知包（dsh-shell、dsh-session*、dsh-tools、dsh-web、dsh-loader-smoke、node-addon-landlock-run 等）推导
- `@deepseek-ai/cordis`（latest 4.0.1，next 4.0.1-rc.4）、`create-dsh-plugin`（0.1.1）、`@linxin666/dsh-remote-web-ui`（社区远程 Web UI）
- 404（未发布）：`@deepseek-ai/dsh-core`、`@deepseek-ai/dsh-sdk`（截至本快照）
- `search-*.json`：npm 搜索快照（scope:deepseek-ai / dsh-plugin / deepseek-harness / create-dsh）
- 依赖上下文包：commander、js-yaml、node-addon-require-builtin、dsh（无关项目 node-dsh，仅存档对比）

## H. 社区文章与论坛归档（2026-08-14 晚新增；2026-08-15 实盘落地为 145 篇）

`downloads/web/community-articles/`（日志 `_download.log`；刷新脚本 `scripts/download-community-articles.ps1`；线索与摘要见 `downloads/_research/chinese-community-scan.md` 与 `english-community-scan.md`）：

- `zh/`（94 篇）—— cnblogs 教程（pc2005 npm 发布实战、qq8864 会话导出/插件vs工具、sing1ee Agent Loop 解析、knqiufan/foxcharon/itech/adgine-ai/isLinXu）、CSDN（yuqingteck Hello Tool、damodev 大仓工程化、zhuosj、aiutools、qq8864、csdnnews、aicoding）、51CTO 2 篇、阿里云开发者社区 2 篇、bibigpt/aixq 实战、量子位/智东西/品玩/DTinsight/极客公园/36氪/界面/IT之家/甲子光年/53AI/搜狐/网易/新浪/东方财富等媒体实测与新闻、V2EX 8 线程（1234203/1234320/1234341/1234424/1234521/1231389/1214141）、locdd 3 线程、B 站视频页 9 支（BV1WmgF6qEMn/BV1iAgc6xEj7/BV1KFgF6zEtk/BV1NKgw6VErB/BV1o4gP6iEeo/BV1vugA6FERZ/BV1VkgK6NEZS/BV1eDgW6QEFx/BV17ygc6tEE1）
- `en/`（41 篇）—— NYU Shanghai RITS Cordis 解读、dev.to 2 篇（onsen 全指南、reidmarlow 价格信号）、AgentPedia/ExplainX/AgentBreaking 教程、essamamdani、X-CMD 安装页、dsh-index.xlings、xlings 多版本页、36Kr 英文 3 篇、Ollama 官方集成文档、aiengineerguide TIL、GIGAZINE、OpenRouter Ori Harness 文档、Pandaily/Edgen/TMTPOST/BlockBeats/Gate.it/e-ink 等新闻页（digg 2 页被反爬拦截）
- `hn/`（10 篇）—— Hacker News 镜像（hn.edgecompute.app）7 条线程：49285244（主发布）、49286003（Cordis 论文）、49287821（X-CMD）、49294357（dsh-index）、49291049（xlings）、49291893（jelly ball 视频）、49285620（官方 X 帖）
- 未归档（反爬/需浏览器）：知乎提问 2040450519303288568、InfoQ 中文 451、venturebeat 429、thenextweb 403、Reddit/X/YouTube（见两份扫描报告的"未收录但无法访问"清单）

### H.1 08-15 抓取环境记录

- Discussions 刷新与话题快照走 **Invoke-WebRequest + Authorization Bearer**（用户提供的 GitHub PAT 经 `$env:GH_TOKEN`/`-Token` 传入，未落盘任何配置）。
- 关键坑（已写进脚本注释与 §I）：后台任务宿主为 Windows PowerShell 5.1——`curl.exe` 数组参数（`-H` 头）会被拆词静默破坏，导致 API 返回错误对象、一次误把 list.json 写成 0 条（防缩水保护即为此加）；修复为 Invoke-WebRequest 后稳定。
- 话题快照 08-15 期：`downloads/topic-snapshots/dsh-plugin-topic-2026-08-15/`（去重 998、total_count 抓取期间 2668→2671）。

## I. 抓取说明

- 方式：`scripts/download-sources.ps1`（curl.exe；GitHub API 带 User-Agent；含多分支回退 master/main/HEAD）+ `scripts/download-community-repos.ps1`（**codeload HEAD 探测（main→master→HEAD 三级回退 + ETag 增量）+ codeload tarball + tar 解包**，零 API 配额）+ `scripts/download-community-articles.ps1`（curl + Invoke-Expression 拼串，规避 PS 5.1 拆词）+ `scripts/archive-discussions.ps1`（Invoke-WebRequest + Bearer token）。
- 明细：`downloads/manifest.tsv`（主脚本）、`downloads/community-repos/_download.log`（社区仓库）、`downloads/web/community-articles/_download.log`（文章）、`downloads/github/harness/discussions/README.md`（Discussions）。
- 重跑：脚本均幂等，可随时刷新；`sync-official-docs.ps1` 同步官方文档副本（本次扩展了根文件范围与 `:(top)` pathspec/修剪）。
- **08-14 晚环境限制记录**：`gh` CLI token 失效（401）后，GitHub 全部查询改走 git 协议（ls-remote/clone）与 codeload；api.github.com 匿名配额 60/h 仅用于 Discussions 评论精选抓取；本机网络直连 github.com 网页与 raw.githubusercontent.com 失败（curl 000），git https 与 codeload 正常。
- **编码约定（重要）**：Windows PowerShell 5.1 无 BOM 的 UTF-8 脚本会按 ANSI 解析，中文注释尾字节可能吞换行导致代码行并入注释（本次真实踩坑）；`scripts/*.ps1` 必须保持 **UTF-8 with BOM**，编辑后务必复核 BOM。
- 时间戳：下载会话 2026-08-14 22:45–23:59（+08:00）；dsh-plugin topic 快照共三期（2026-08-13T15:15Z/08-13T18:36Z/08-14T08:16Z）+ 08-14 晚扫描（total_count 2034，见 §D.2）。
- 官网 deepseek.com 页面受 Cloudflare 保护时可能失败——以 manifest 记录为准，正文内容以 GitHub Pages 同源文档为准。
- **备注**：用户清单中 `ess-plugin-mcp` 经 GitHub 搜索无精确匹配（最接近者为 Skyrim .ess 插件工具的 MCP，与 DSH 无关）；按 DSH 生态语义定位到 `bobleer/deepseek-harness-plugin-mcp`（让任意 agent 经 MCP 发现/安装/运行 DSH 插件）并归档，如用户所指另有其仓，请告知后补充。
- **2026-08-14 复核（网络实时核验）**：上游 master 仍为 47f9438（本地 checkout 即上游 HEAD，官方文档副本与 checkout 逐文件 hash 一致）；无 GitHub Releases/tag。npm `@deepseek-ai/dsh` latest=next=0.1.0-rc.6（08-13T12:35Z 发布）、`@deepseek-ai/cordis` latest=4.0.1、`@deepseek-ai/dsh-tools` 与 `@deepseek-ai/dsh-session-persistence-jsonl` 的 `latest` 仍为过期的 0.0.1-rc.1（`next`=0.1.0-rc.6）；已发布还包括 dsh-shell（0.0.1-rc.5）、dsh-session*/dsh-web/dsh-headless/dsh-loader-smoke/dsh-skill（0.0.1-rc.1）；dsh-core、dsh-sdk 未发布（404）；**无作用域 `dsh` 包是无关项目 node-dsh**（description: A shell written in JavaScript）。
- **2026-08-14 二次复核（08:16Z，网络实时核验）**：`create-dsh-plugin` 已发布（latest=0.1.1，2026-08-13T15:15:42Z）——上次复核"未发布（404）"的记录作废；`@deepseek-ai/cordis` 另发布 `next`=4.0.1-rc.4；其余 npm 结论不变（dsh/dsh-tools/dsh-session-persistence-jsonl/dsh-shell 同上；dsh-core、dsh-sdk 仍 404）。`dsh-plugin` 话题 API total_count 增长至 1391（08-14T08:16Z，分页去重 993，见 §D.2）。官方文档副本与上游 `origin/master`（47f9438）逐字节一致，快照记录见 `references/official-docs/SNAPSHOT.md`。
- **2026-08-14 外链扫描**：KB 自有文档 215 个外部 URL 逐一探测。真死链已修复/标注：turtle-ui、dsh-external/hub、deepseek-harness/cordis（404）；npmjs/socket.dev/新闻站（163/sohu/qq/aihot）与 discord.gg 对 curl 返回 403/501/超时属反爬，浏览器可用，非死链；cordiverse/paper 的 raw README（master/main）均 200。
- **2026-08-14 社区仓库提交复核**：15 个深读仓库中 6 个在 08-13T15:15Z 快照后有新提交——dsh-suite（16:20Z X digest 管线/first-party 目录）、from-scratch（16:29Z 教程 prose 与 checkpoint 对齐）、plugin-mcp（16:16Z Streamable HTTP 每会话独立 Server 修复）、dsh-hub-workshop（17:30Z qualify catalog + close registry）、AdamPlatin123/awesome-dsh-plugins（18:10Z 登记 PR #4/#14 等）、bruc3van/awesome-dsh-plugin（17:56Z 目录刷新）；其余 9 个无新提交、无改名/归档。已按最新 HEAD 全部重下（HEAD 记录 downloads/community-repos/_heads.tsv）。
- **2026-08-15 复核（网络实时核验 + 增量归档）**：上游 master 仍 47f9438、无新提交/Release/tag；`@deepseek-ai/dsh` latest=next=0.1.0-rc.6 无变化。`dsh-plugin` 话题 total_count 08-14 晚 2034 → **08-15 快照抓取期间 2668→2671**（第四期快照 `downloads/topic-snapshots/dsh-plugin-topic-2026-08-15/`，去重 998；`topic:deepseek-harness` 1432→1872）。官方 Discussions 全量刷新 1408→1654（含新增 RFC #1629）。社区仓库新增第七批 14 个 + 第八批 3 个（web_search 增量线索，见 community-ecosystem.md §4.6/§4.7）。社区文章归档 53→145 篇（zh 94/en 41/hn 10）。修复 `download-community-repos.ps1` 弱 ETag 解析 bug（弱 ETag `W/"..."` 曾致 heads 记录损坏 + Substring 越界）。
