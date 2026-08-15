# 生态与社区汇总（community-ecosystem.md）

> DeepSeek Harness 插件生态与社区资料的索引与要点。全部仓库的**完整源码 tarball 副本**在 `downloads/community-repos/`（111 个，HEAD/ETag 记录 `_heads.tsv`）；首批 15 个的逐仓库深读报告见 [community-repo-deep-dive.md](community-repo-deep-dive.md)；08-14 晚生态扫描报告见 `downloads/_research/github-ecosystem-scan.md`；08-15 增量（第七批 14 仓 + Discussions 刷新 + 文章归档落地）见 §4.6 与文末"08-15 更新记录"；全量来源总账见 [sources.md](sources.md)。

## 1. 官方渠道

- GitHub 仓库：https://github.com/deepseek-ai/deepseek-harness（README 快照：`downloads/github/harness/README.md`；元数据：`downloads/github/harness/repo.json`；**08-15 核验：HEAD 仍为 47f9438**，无新提交/Release/tag）
- 官方文档站：https://deepseek-harness.github.io/deepseek-harness/（全站爬取：`downloads/web/site/`）
- 官网：https://www.deepseek.com/harness/（快照：`downloads/web/deepseek-com-harness.html`）
- **GitHub Discussions（Issues 关闭，Discussions 为反馈主渠道）：全量 1654 条归档于 `downloads/github/harness/discussions/`**（list.json 含全部正文；精选线程含评论；2026-08-15 由 `scripts/archive-discussions.ps1` 刷新，08-14 首版为 1408 条）
- 官方 Discord：https://discord.gg/Ycq5dCaS4 （官方 README 明文链接）+ 企微群/公众号（见 `cordis-paper-and-community.md`）；公众号「DeepSeek Harness 团队」（黑鲸头像）08-12 注册（新浪财经/21 世纪经济报道）
- GitHub 话题页：https://github.com/topics/dsh-plugin（08-14 晚 total_count=2034；**08-15 快照抓取期间 2668→2671**；deepseek-harness=1872、dsh=980+；第四期快照 `downloads/topic-snapshots/dsh-plugin-topic-2026-08-15/`）
- npm：`@deepseek-ai/*` 全家桶 72 个包元数据归档 `downloads/npm/`（README 含全表；08-15 核验 `@deepseek-ai/dsh` latest=next=0.1.0-rc.6 无变化）；社区包 [dsh-plugin-adapter-qq](https://www.npmjs.com/package/dsh-plugin-adapter-qq)

## 2. 机制时间线（社区实测，vlln/plugin-registry 档案）

| 日期 | 事件 |
|---|---|
| 2026-08-09 | 官方推出 repository-plugin 机制（`.dsh-plugin` 格式） |
| **2026-08-11** | **官方移除 repository 机制**（`vendor/loader/src/repository.ts` 删除）——外部插件只剩 web profile 一条官方路径 |
| 之后 | bundle 插件（`dsh.bundle`）→ `dsh.profile.bundles` 层栈（重启生效）；纯 cordis 插件 → profile `cordis.patch.yml` insert 行（配置 HMR 实时生效） |

## 3. 插件全量清单（dsh-plugin topic）

- 工作区快照三期：`dsh-plugin-topic-2026-08-13/`（304）、`dsh-plugin-topic-2026-08-14/`（去重 550）与 `dsh-plugin-topic-2026-08-14b/`（去重 993）；08-14 晚扫描 total_count=**2034**（位置见 sources.md §D.2）。
- 生态目录/市场类仓库（自动聚合、每日刷新）见 §4.4。

## 4. 插件开发方法类仓库（深读重点）

| 仓库 | 用途 | 归档 |
|---|---|---|
| [omdsh-dev/plugin-template](https://github.com/omdsh-dev/plugin-template) | 生产级独立插件模板：src/index+config+runtime+invariant 四文件、7 个 dsh-plugin-* 开发 skill、tsdown 自包含 `prepare`、契约文档 | `downloads/community-repos/plugin-template/` |
| [omdsh-dev/dsh-plugin-dev](https://github.com/omdsh-dev/dsh-plugin-dev) | 踩坑档案：20 个实测坑（cordis 双副本、tsconfig 三件套、junction、多帧 zstd、DSH_* 环境变量……）+ 环境基线 | `downloads/community-repos/dsh-plugin-dev/` |
| [vlln/plugin-registry](https://github.com/vlln/plugin-registry) | 薄控制台 + `make-dsh-plugin` skill + 插件类型对比（bundle vs 纯 cordis 双通道） | `downloads/community-repos/plugin-registry/` |
| [Opr4Mp3r/deepseek-harness-plugin-from-scratch](https://github.com/Opr4Mp3r/deepseek-harness-plugin-from-scratch) | 代码审计式渐进教程：checkpoint 阅读器、17 反模式、交付检查单（锁 harness@47f9438、npm 0.1.0-rc.6） | `downloads/community-repos/deepseek-harness-plugin-from-scratch/` |
| [whyihaveyou/dsh-suite](https://github.com/whyihaveyou/dsh-suite) | 双语插件目录（167+ 插件、每日兼容性 CI）+ `npm create dsh-plugin` 脚手架 + 自有插件 | `downloads/community-repos/dsh-suite/` |
| [randerous/dsh-turn-meta](https://github.com/randerous/dsh-turn-meta) | 最小首插件模板：agent/pre-step + prepend:true + source 归属注入 | `downloads/community-repos/dsh-turn-meta/` |
| [omdsh-dev/dsh-plugin-skills](https://github.com/omdsh-dev/dsh-plugin-skills) | agent 会话内从脚手架到测试分层的 skill 集 | `downloads/community-repos/dsh-plugin-skills/` |
| [omdsh-dev/fabric](https://github.com/omdsh-dev/fabric) | 类 MC Fabric 的 hook 处理器 | `downloads/community-repos/fabric/` |
| [omdsh-dev/dsh-plugin-check](https://github.com/omdsh-dev/dsh-plugin-check) | 插件健康检查：清单协议/patch 格式/构建陷阱/hub 收录状态 | `downloads/community-repos/dsh-plugin-check/` |
| [bobleer/deepseek-harness-plugin-mcp](https://github.com/bobleer/deepseek-harness-plugin-mcp) | MCP 服务器：让任意 agent 发现/安装/运行 DSH 插件（用户清单 "ess-plugin-mcp" 的定位假设，未找到更接近的仓库） | `downloads/community-repos/deepseek-harness-plugin-mcp/` |
| [Nagi-ovo/dsh-find-plugins](https://github.com/Nagi-ovo/dsh-find-plugins) | 插件发现 | `downloads/community-repos/dsh-find-plugins/` |
| [omdsh-dev/dsh-hub-workshop](https://github.com/omdsh-dev/dsh-hub-workshop) | 插件市场/注册 workshop | `downloads/community-repos/dsh-hub-workshop/` |

### 4.1 08-14 上午出现的 Web GUI 插件市场（已归档）

- [bradeGithub/DSH-Plugins-Marketplace](https://github.com/bradeGithub/DSH-Plugins-Marketplace) — 在 DSH Web GUI 内一键浏览/安装/更新 `topic:dsh-plugin` 的全部插件
- [Toukaiteio/dsh-plugin-installer](https://github.com/Toukaiteio/dsh-plugin-installer) — 市场插件：接入 GitHub 插件生态
- [Scorp1o117/dsh-plugin-marketplace](https://github.com/Scorp1o117/dsh-plugin-marketplace) — 设置页内浏览 topic：搜索、按 star 排序、展示安装指引

三者均为 08-13/14 出现；安装权威与信任边界仍适用 dsh-hub-workshop 的"发现 ≠ 安装权限"结论（见 [community-repo-deep-dive.md](community-repo-deep-dive.md) §1.12）。

### 4.2 08-14 晚扫描：文档型仓库（高优先级 26，已整仓归档）

> 详细清单与文件树统计见 `downloads/_research/github-ecosystem-scan.md`；均位于 `downloads/community-repos/<repo>/`。

| 仓库 | 定位 |
|---|---|
| [flaqai/deepeseek-harness-guide](https://github.com/flaqai/deepeseek-harness-guide) | **15 语言**（ar/de/es/fr/id/it/ja/ko/pt/ru/th/tw/vi/zh + en）开发与插件构建指南，53 md + 4 SKILL——最接近官方文档多语翻译的仓库 |
| [Electricitysheep/dsh-handbook](https://github.com/Electricitysheep/dsh-handbook) | 从 0 到 1 深度手册：14 章中英双份 + 2 PDF + llms.txt（174★） |
| [JingHao-Leon/deepseek-harness-guide](https://github.com/JingHao-Leon/deepseek-harness-guide) | 保姆级理解教程 + Complete English Guide（架构深潜/Cordis/事件溯源/与 LangGraph·OpenAI·Claude·Google ADK 对比） |
| [flysheep-ai/learn_deepseek_harness](https://github.com/flysheep-ai/learn_deepseek_harness) | 可运行渐进课程 s01–s23（90 md + 33 SKILL + DESIGN.md） |
| [pingfanfan/hello-dsh](https://github.com/pingfanfan/hello-dsh) | 零基础插件开发教程：22 个中文技能实例（29 md + 22 SKILL） |
| [LaplaceYoung/dsh-book-deepseek-harness](https://github.com/LaplaceYoung/dsh-book-deepseek-harness) | 《深入理解 DeepSeek Harness》源码级拆解书（42 md + PDF + 写作规范） |
| [yanhua1010/dsh-harness-tutorial](https://github.com/yanhua1010/dsh-harness-tutorial) | Agent 原理与实现中文教程（VitePress 39 md + 8 个可运行 demo） |
| [hoco-scy/deepseek-harness-deep-dive](https://github.com/hoco-scy/deepseek-harness-deep-dive) | 源码锚定双语深潜：36 章/1094 证据/533 源码路径 |
| [libukai/awesome-deepseek-harness](https://github.com/libukai/awesome-deepseek-harness) | DSH 终极指南（中英日三语 README） |
| [sandbaseai/deepseek-harness-handbook](https://github.com/sandbaseai/deepseek-harness-handbook) | Agent-first 多语手册（quickstarts/架构/安全/排障/生产配方） |
| [openma-ai/deepseek-harness-typescript-sdk](https://github.com/openma-ai/deepseek-harness-typescript-sdk) | **TypeScript SDK**（镜像官方 Python SDK），类型/DTS 参考 |
| [Loner1024/deepseek-harness-sdk-rs](https://github.com/Loner1024/deepseek-harness-sdk-rs) | **Rust SDK**（双语 README） |
| [h565656445/dsh-llm-agent-harness-guide](https://github.com/h565656445/dsh-llm-agent-harness-guide) | LLM agent 控制面设计指南（控制循环/worker 协议/审批边界/可观测性） |
| [h565656445/dsh-agent-os-worker-protocol](https://github.com/h565656445/dsh-agent-os-worker-protocol) | Agent OS 统一 worker 协议（specs/schemas/证据哈希，契约型） |
| [cyanseek/dsh-native-playbook](https://github.com/cyanseek/dsh-native-playbook) | DSH 原生能力指南（插件 + Agent Skill + CLI 三合一） |
| [whyihaveyou/dsh-plugin-tutorial](https://github.com/whyihaveyou/dsh-plugin-tutorial) | 手把手、全真实截图的双语插件开发实战指南 |
| [DumplingHuman/dsh-plugin-tutorial](https://github.com/DumplingHuman/dsh-plugin-tutorial) | 中文插件开发教程（环境/Cordis/Tool/事件/LLM 适配器/打包发布） |
| [anweat/dsh-plugin-dev-guide](https://github.com/anweat/dsh-plugin-dev-guide) | 插件开发与发布指南 |
| [Hubert-hwk/dsh-for-humans](https://github.com/Hubert-hwk/dsh-for-humans) | 费曼学习法通俗教程（12 章 + 图解 + 测验） |
| [yangl326-Dylan/learning-dsh](https://github.com/yangl326-Dylan/learning-dsh) | 版本化双语源码学习页（dsh 插件形式 /learning） |
| [curtiseng/cordis-course](https://github.com/curtiseng/cordis-course) | **Cordis 论文交互式中文课程与译文**（「动态可组合性演算」）——Cordis 讲义唯一命中 |
| [THU-MAIC/dsh-openmaic](https://github.com/THU-MAIC/dsh-openmaic) | OpenMAIC for DSH（清华 MAIC）：课堂/幻灯片/交互 widget/苏格拉底教学（真插件） |
| [qomob/DSHwiki](https://github.com/qomob/DSHwiki) | 社区 Wiki + 每日聚合插件目录（VitePress） |
| [calderbuild/awesome-deepseek-harness](https://github.com/calderbuild/awesome-deepseek-harness) | 精选 DSH 资源（docs/概念/包/插件/write-ups） |
| [njdldkl666699/dsh-learning](https://github.com/njdldkl666699/dsh-learning) | 学习者技术设计报告（双语，源码角度） |
| [dshworks/howto-dsh](https://github.com/dshworks/howto-dsh) | 验证过的实地笔记（陷阱/技能/钩子/profiles，每条标注版本+源码路径） |
| [onychen/learn-dsh](https://github.com/onychen/learn-dsh) | 拆解式教学课程（附教学版实现） |
| [alchaincyf/deepseek-harness-orange-book](https://github.com/alchaincyf/deepseek-harness-orange-book) | 橙皮书《从开机到拆开》：一手实测（系统提示词/启动清单/原始会话日志）PDF/EPUB |

### 4.3 08-14 晚扫描：skill 集合/契约规范（中优先级 19，已整仓归档）

- [dhicoc/dsh-reverse-skill](https://github.com/dhicoc/dsh-reverse-skill) — 逆向技能包（351 md、85 SKILL）
- [phoenixlucky/zerotoken-skill](https://github.com/phoenixlucky/zerotoken-skill) — ZeroToken + 尉缭子十原则 + Unicode/搜索规范
- [unknowbug/anchorlaw](https://github.com/unknowbug/anchorlaw) — vibe coding 代码验证协议（48 md、22 SKILL，含 DSH 集成目录）
- [w2112515/dsh-plugin-development](https://github.com/w2112515/dsh-plugin-development) — 可移植 DSH 插件开发/审计 Agent Skill
- [OneZero-Y/dsh-plugin-kit](https://github.com/OneZero-Y/dsh-plugin-kit) — Agent skills + 独立插件模板（7 SKILL）
- [akira399/dsh-plugin-publisher](https://github.com/akira399/dsh-plugin-publisher) — 插件开发与 GitHub 发布工作流（consent-gated）
- [LeslieWylie/dsh-plugin-release](https://github.com/LeslieWylie/dsh-plugin-release) — 打包契约/发布清单/安装卫生
- [LeslieWylie/dsh-benchmark-evidence](https://github.com/LeslieWylie/dsh-benchmark-evidence) — 基准清单/fail-closed 门禁/artifact 契约
- [LeslieWylie/dsh-agent-orchestration](https://github.com/LeslieWylie/dsh-agent-orchestration) — 证据优先多 agent 工作流（2 SKILL）
- [dongsheng123132/task-passport](https://github.com/dongsheng123132/task-passport) — 开放任务交接协议（DSH/WorkBuddy/Claude Code/Codex）
- [Tostoevsky/TsienHsueShen](https://github.com/Tostoevsky/TsienHsueShen) — 钱学森《工程控制论》蒸馏的 DSH 方法论技能
- [Whning0513/awesome-deepseek-skills](https://github.com/Whning0513/awesome-deepseek-skills) — pinned + 静态验证的 DeepSeek/DSH Agent Skills 目录
- [Jesse-njx/dsh-skillport](https://github.com/Jesse-njx/dsh-skillport) — Claude Code/Codex/Cursor/Gemini CLI skill 移植进 DSH（15 SKILL）
- [green-dalii/dsh-plugin-dev-skill](https://github.com/green-dalii/dsh-plugin-dev-skill) — 教会任意 agent 开发 DSH 插件的 skill pack
- [RayYeung1989/dsh-plugin-development](https://github.com/RayYeung1989/dsh-plugin-development) — 通用 dsh 插件开发 SKILL.md + templates
- [SmileTao/dsh-plugin-dev-skill](https://github.com/SmileTao/dsh-plugin-dev-skill) — 帮 AI 正确编写 dsh 插件的 skill
- [Leeaoyin/dr-agent-skills](https://github.com/Leeaoyin/dr-agent-skills) — 结构化可复用 skill 模块
- [KhalilYamber/hana-dsh-bridge](https://github.com/KhalilYamber/hana-dsh-bridge) — 含 DSH API 逆向笔记 + Agent 自部署手册
- [ieookm/agent-to-dsh-migration](https://github.com/ieookm/agent-to-dsh-migration) — Claude Code/Codex/Qoder 一键迁移 + 实测踩坑手册

### 4.4 08-14 晚扫描：目录/市场/awesome 索引（低优先级 20，已归档）

- [kejixiaoliang/awesome-dsh-plugins](https://github.com/kejixiaoliang/awesome-dsh-plugins)（14 类 280+ 插件）
- [like-study1/Oh-My-DSH](https://github.com/like-study1/Oh-My-DSH)（每 8 小时自动同步生态）
- [zp-home/dsh-recommend](https://github.com/zp-home/dsh-recommend)（每日抓取 + 公开评分模型）
- [white0dew/awesome-dsh-plugins](https://github.com/white0dew/awesome-dsh-plugins)、[wangshunnn/oh-my-dsh](https://github.com/wangshunnn/oh-my-dsh)、[billLiao/awesome-dsh-plugin](https://github.com/billLiao/awesome-dsh-plugin)、[HackSing/dsh-plugins](https://github.com/HackSing/dsh-plugins)、[lwmxiaobei/dsh-plugins](https://github.com/lwmxiaobei/dsh-plugins)（插件目录类）
- [YYTbit/awesome-dsh-bridges](https://github.com/YYTbit/awesome-dsh-bridges)（AI 编码工具桥接目录）
- [xiaohai-78/Top](https://github.com/xiaohai-78/Top)（每日排行榜 + 快照归档）
- [2BingLing/dsh-market](https://github.com/2BingLing/dsh-market)（500+ 插件市场：中文搜索 + 五维评分）
- [dshworks/awesome-dsh-themes](https://github.com/dshworks/awesome-dsh-themes)（主题与 --dsw-* token 皮肤注册表）
- [dshworks/awesome-dsh-plugins](https://github.com/dshworks/awesome-dsh-plugins)（垃圾过滤、开放数据注册表）
- [dsh-pub/dsh-pub](https://github.com/dsh-pub/dsh-pub)（双语、来源可溯的注册表与安装器）
- [cooljser/dsh-plugin-portal](https://github.com/cooljser/dsh-plugin-portal)（227+ 插件零依赖静态门户）
- [WatchaAI/awesome-deepseek-harness-plugins](https://github.com/WatchaAI/awesome-deepseek-harness-plugins)、[imsai-sh/awesome-deepseek-harness-plugins](https://github.com/imsai-sh/awesome-deepseek-harness-plugins)、[xianyu110/awesome-deepseek-harness](https://github.com/xianyu110/awesome-deepseek-harness)（精选目录）
- [openguardrails/openguardrails](https://github.com/openguardrails/openguardrails)（供应商中立 AI agent 安全协议与基准，备查）
- [Bandersnatch0x/amber-protocol](https://github.com/Bandersnatch0x/amber-protocol)（仓库本地治理协议，含 dsh/ patch overlay）

### 4.5 其他已归档功能仓库（第二批 14）

- [NanmiCoder/dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) — AgentTeams 插件 + `docs/developing-dsh-plugins.md` + dsh-plugin-development SKILL（229★，英文插件开发教程）
- [vibeinging/dsh-tool-search](https://github.com/vibeinging/dsh-tool-search) — 按需工具发现插件
- [zhu1090093659/dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) — Web UI 插件与皮肤合集
- [ccch1mneyyy/dsh-cc-tui](https://github.com/ccch1mneyyy/dsh-cc-tui) — Claude Code 风格终端 TUI
- [dataelement/dsh-desktop](https://github.com/dataelement/dsh-desktop) — 桌面客户端
- [hust-open-atom-club/oh-dsh-desktop](https://github.com/hust-open-atom-club/oh-dsh-desktop) — 可扩展 macOS 工作台 + 插件市场
- [lhh010/dsh-bash-encoding](https://github.com/lhh010/dsh-bash-encoding) — bash 编码修复插件
- [Nagi-ovo/dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize) — 对话内生成式 UI（visualize 工具 + skill + 沙箱渲染）
- [bobleer/deepseek-harness-gui](https://github.com/bobleer/deepseek-harness-gui) — 社区 Tauri 桌面 GUI（HN 评论区引用）
- walkinglabs/awesome-deepseek-harness-plugins、vvlife/awesome-deepseek-harness-plugins、cccakeee/awesome-dsh-plugins —— 08-14 新出现的双语 awesome（见 §5）

### 4.6 08-15 第七批（web_search 增量线索，14 个，已整仓归档）

> 全部位于 `downloads/community-repos/<repo>/`（`scripts/download-community-repos.ps1` 第七批）。

- **桌面端（7 个）**：[anywhere-labs/deepseek-harness-desktop](https://github.com/anywhere-labs/deepseek-harness-desktop)（Electron，深度适配 macOS/Windows）、[cc1252/deepseek-harness-desktop](https://github.com/cc1252/deepseek-harness-desktop)（Windows Electron 壳）、[LisiChen0/DeepSeek-Harness-Desktop](https://github.com/LisiChen0/DeepSeek-Harness-Desktop)、[Skyearn/deepseek-harness-app](https://github.com/Skyearn/deepseek-harness-app)、[salathleizhang/deepseek-harness-desktop](https://github.com/salathleizhang/deepseek-harness-desktop)、[ChisaAlter/Deepseek-Harness-Desktop](https://github.com/ChisaAlter/Deepseek-Harness-Desktop)、[hairyf/deepseek-harness-desktop](https://github.com/hairyf/deepseek-harness-desktop)
- **桥接/移动端**：[banana770/dsh-qq-bridge](https://github.com/banana770/dsh-qq-bridge)（QQ ↔ Harness，npm `dsh-plugin-adapter-qq`）、[Vengisk/deepseek-harness-termux](https://github.com/Vengisk/deepseek-harness-termux)（Android/Termux 运行 dsh）
- **安全研究**：[zzszmyf/dsh-security-pocs](https://github.com/zzszmyf/dsh-security-pocs)（3 漏洞 + 链式利用 PoC：!!js 配置执行、只读沙箱全盘读、vm 逃逸→宿主机 RCE；配套官方 Discussion #817/#454/#523/#250）
- **其他实现/移植**：[HenryZ838978/deepseek-harness](https://github.com/HenryZ838978/deepseek-harness)（Python 移植：`pip install deepseek-harness` + dsh CLI + MCP server + 16 协议怪癖/270+ 试验）、[Lyowisee/deepseek-harness](https://github.com/Lyowisee/deepseek-harness)
- **市场/目录**：[mishibeikejie/zat-dsh-engine](https://github.com/mishibeikejie/zat-dsh-engine)（可视化插件市场）、[beancookie/awesome-dsh-plugin](https://github.com/beancookie/awesome-dsh-plugin)（英文精选列表）

## 5. Awesome 精选列表

- [AdamPlatin123/awesome-dsh-plugins](https://github.com/AdamPlatin123/awesome-dsh-plugins) — 插件目录 + 每日兼容性追踪（`downloads/community-repos/awesome-dsh-plugins/`）
- [0xsline/awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness) — 插件/工具/基建策展
- [Alex-Yanggg/awesome-DSH-plugin](https://github.com/Alex-Yanggg/awesome-DSH-plugin) — 精选插件/扩展/调试工具/开发模块（`downloads/community-repos/awesome-DSH-plugin-alexyanggg/`）
- [awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) — 插件精选列表（837★）
- [bruc3van/awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin) — "30 秒找到适合你的插件"（`downloads/community-repos/awesome-dsh-plugin/`）
- [Dominic789654/awesome-deepseek-harness](https://github.com/Dominic789654/awesome-deepseek-harness) — 插件/skill/MCP/编排/UI 策展
- [walkinglabs/awesome-deepseek-harness-plugins](https://github.com/walkinglabs/awesome-deepseek-harness-plugins) — 双语精选：插件/工具/工作流/学习资源（08-14 新，已归档）
- [vvlife/awesome-deepseek-harness-plugins](https://github.com/vvlife/awesome-deepseek-harness-plugins) — 插件/工具/皮肤/扩展策展（08-14 新，已归档）
- [cccakeee/awesome-dsh-plugins](https://github.com/cccakeee/awesome-dsh-plugins) — evidence-led 目录：可加载扩展/skill/带权限意识的安装指引（08-14 新，已归档）
- [libukai/awesome-deepseek-harness](https://github.com/libukai/awesome-deepseek-harness) — 中英日三语终极指南（08-14 新，已归档）
- [calderbuild/awesome-deepseek-harness](https://github.com/calderbuild/awesome-deepseek-harness) — 精选资源（08-14 新，已归档）
- 目录/市场类更多见 §4.4

## 6. 社区与学习

- [hikariming/dshfind](https://github.com/hikariming/dshfind) — DSH 学习与分享社区（MDX）
- 论坛/博客/B 站线索：见 `cordis-paper-and-community.md` Part 2（84 条 URL 清单）
- **社区文章归档**（`downloads/web/community-articles/`，**08-15 实盘 145 篇**，`scripts/download-community-articles.ps1` 幂等刷新）：
  - `zh/`（94 篇）：cnblogs 教程（pc2005 npm 发布实战、qq8864 会话导出/插件vs工具、sing1ee Agent Loop 解析、knqiufan/foxcharon/itech/adgine-ai/isLinXu）、CSDN（yuqingteck/damodev/zhuosj/aiutools/qq8864/csdnnews/aicoding）、51CTO 2 篇、阿里云 2 篇、bibigpt/aixq 实战、量子位/智东西/品玩/DTinsight/极客公园/36氪/界面/IT之家/甲子光年等媒体实测、V2EX 8 线程（1234203/1234320/1234341/1234424/1234521/1231389/1214141…）、locdd 3 线程、B 站视频页 9 支、新闻/财经页若干
  - `en/`（41 篇）：NYU Shanghai RITS Cordis 解读、dev.to 2 篇、AgentPedia/ExplainX/AgentBreaking、essamamdani、X-CMD 安装页、dsh-index.xlings、xlings 多版本、36Kr 英文 3 篇、Ollama 官方集成文档、aiengineerguide TIL、GIGAZINE、OpenRouter Ori Harness 文档、digg X 聚合页（curl 拦截，部分未归档）、Pandaily/Edgen/TMTPOST/BlockBeats 等新闻页
  - `hn/`（10 篇）：Hacker News 镜像 7 条线程（主发布 49285244 + Cordis 论文/X-CMD/dsh-index/xlings/jelly ball/官方 X 帖）
  - 反爬未归档清单（知乎/InfoQ/venturebeat/TNW/Twitter/YouTube/Reddit）与全部线索摘要见 `downloads/_research/{chinese,english}-community-scan.md`
- **中文社群与媒体入口**：微信公众号「DeepSeek Harness 团队」（黑鲸头像）；企微小助手群（官方 README 链接）；V2EX 与 locdd 活跃讨论；B 站教程视频（见上）；知乎提问 2040450519303288568（403 反爬）
- **英文社群与媒体入口**：Hacker News（主线程 49285244）；X/Twitter 官方 @deepseek_ai 发布帖（2087887408440164663）；[OpenRouter Ori Harness](https://openrouter.ai/docs/guides/ori/harness)（第三方托管集成）
- turtle-ui — 官方 git 安装 prepare 脚本范例（**08-14 核查：仓库已 404**）；同用途的活范例见 [omdsh-dev/plugin-template](https://github.com/omdsh-dev/plugin-template) 的 `scripts/prepare.mjs`
- dsh-external/hub — 生态 hub（**08-14 核查：仓库已 404**）

## 7. 工作区已有插件实例（可作参考实现）

- `dsh-chat-import/` — JS 插件：从 Claude Code 导入历史；`cordis.patch.yml` + index.mjs + 测试
- `dsh-resume-plugin/` — 多 skill 插件（resume-claude/resume-codex/shared），`cordis.patch.yml` + 双语 README
- `dsh-plugin-claude-bridge/` — TS 插件（src/index.ts、types、parser、skills、tsconfig）
- 上述目录位于 `D:\deepseek-harness\Project\Plugins\`

## 8. 08-15 更新记录（本轮增量）

- **话题爆发持续**：`dsh-plugin` topic API total_count 08-14 晚 2034 → 08-15 午间快照抓取期间 **2668→2671**（约 16 小时 +640）；`topic:deepseek-harness` 1432 → 1872。
- **官方 Discussions 刷新**：1408 → **1654 条**（新编号最高 1629+）；代表性新线程：
  - [#1629 RFC：官方插件脚手架](https://github.com/deepseek-ai/deepseek-harness/discussions/1629)（zoahdev，08-15T01:15Z）——提议 template repo + `pnpm create dsh-plugin`，点名 dsh-tools `latest` 版本火车混淆（关联 #984）；
  - 安全审计类 #817/#454/#523/#250 与社区 PoC 仓库 zzszmyf/dsh-security-pocs 呼应。
- **新仓库第七批 14 个**归档（§4.6）：桌面端扎堆（7 个 Electron 壳）、QQ/Termux 桥接、安全 PoC、Python 移植、可视化市场、英文 awesome。
- **社区文章归档落地**：`downloads/web/community-articles/` 由 53 篇扩到 **145 篇**（zh 94 / en 41 / hn 10，新脚本 `scripts/download-community-articles.ps1`）；digg/知乎/InfoQ/venturebeat/TNW/Twitter/YouTube/Reddit 反爬，线索已留档。
- **上游与 npm 无变化**：官方仓库 HEAD 仍 47f9438（无新提交/Release）；`@deepseek-ai/dsh` latest=next=0.1.0-rc.6。
- **工具链**：新增 `scripts/archive-discussions.ps1`（token 支持 + 防缩水保护）；`gen-topic-snapshot.ps1` 支持 token 并改用 Invoke-WebRequest（规避 PS 5.1 curl 数组参数拆词坑）；`download-community-repos.ps1` 修复弱 ETag 解析并新增第七批。
