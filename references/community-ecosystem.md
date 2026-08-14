# 生态与社区汇总（community-ecosystem.md）

> DeepSeek Harness 插件生态与社区资料的索引与要点。15 个插件开发仓库的**完整源码副本**在 `downloads/community-repos/`，逐仓库深读报告见 [community-repo-deep-dive.md](community-repo-deep-dive.md)；全量来源总账见 [sources.md](sources.md)。

## 1. 官方渠道

- GitHub 仓库：https://github.com/deepseek-ai/deepseek-harness（README 快照：`downloads/github/harness/README.md`；元数据：`downloads/github/harness/repo.json`）
- 官方文档站：https://deepseek-harness.github.io/deepseek-harness/（全站爬取：`downloads/web/site/`）
- 官网：https://www.deepseek.com/harness/（快照：`downloads/web/deepseek-com-harness.html`）
- 官方 Discord：https://discord.gg/Ycq5dCaS4 （官方 README 明文链接）+ GitHub Discussions + 企微群/公众号（见 `cordis-paper-and-community.md`）
- GitHub 话题页：https://github.com/topics/dsh-plugin

## 2. 机制时间线（社区实测，vlln/plugin-registry 档案）

| 日期 | 事件 |
|---|---|
| 2026-08-09 | 官方推出 repository-plugin 机制（`.dsh-plugin` 格式） |
| **2026-08-11** | **官方移除 repository 机制**（`vendor/loader/src/repository.ts` 删除）——外部插件只剩 web profile 一条官方路径 |
| 之后 | bundle 插件（`dsh.bundle`）→ `dsh.profile.bundles` 层栈（重启生效）；纯 cordis 插件 → profile `cordis.patch.yml` insert 行（配置 HMR 实时生效） |

## 3. 插件全量清单（dsh-plugin topic）

工作区快照三期：`dsh-plugin-topic-2026-08-13/`（2026-08-13T15:15Z，304 仓库、去重 303 条）、`dsh-plugin-topic-2026-08-14/`（2026-08-13T18:36Z，API total_count 552–554、去重 550 条）与 `dsh-plugin-topic-2026-08-14b/`（2026-08-14T08:16Z，API total_count 1391、分页去重 993 条）：`README.md` 全量清单表、`repos.tsv`、`raw-github-api-page-*.json`、`related-readmes/`（仅 08-13 期）。08-13 当天约 3.5 小时内 +246 个仓库（与官方 npm 公开化同日）；到 08-14 早间 total_count 已增长至 ≈1390（GitHub Search API 分页上限 1000 条，993 是分页内去重数）。

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

### 4.1 08-14 新出现的 Web GUI 插件市场（观察，未深读）

- [bradeGithub/DSH-Plugins-Marketplace](https://github.com/bradeGithub/DSH-Plugins-Marketplace) — 在 DSH Web GUI 内一键浏览/安装/更新 `topic:dsh-plugin` 的全部插件
- [Toukaiteio/dsh-plugin-installer](https://github.com/Toukaiteio/dsh-plugin-installer) — 市场插件：接入 GitHub 插件生态
- [Scorp1o117/dsh-plugin-marketplace](https://github.com/Scorp1o117/dsh-plugin-marketplace) — 设置页内浏览 topic：搜索、按 star 排序、展示安装指引

三者均为 08-13/14 出现；安装权威与信任边界仍适用 dsh-hub-workshop 的"发现 ≠ 安装权限"结论（见 [community-repo-deep-dive.md](community-repo-deep-dive.md) §1.12；08-13 17:27Z 其 `registry-v1.json` 已上线、entries 仍空、11 个候选全部 blocked）。

## 5. Awesome 精选列表

- [AdamPlatin123/awesome-dsh-plugins](https://github.com/AdamPlatin123/awesome-dsh-plugins) — 插件目录 + 每日兼容性追踪（`downloads/community-repos/awesome-dsh-plugins/`）
- [0xsline/awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness) — 插件/工具/基建策展
- [Alex-Yanggg/awesome-DSH-plugin](https://github.com/Alex-Yanggg/awesome-DSH-plugin) — 精选插件/扩展/调试/开发模块（`downloads/community-repos/awesome-DSH-plugin-alexyanggg/`）
- [awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) — 插件精选列表
- [bruc3van/awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin) — "30 秒找到适合你的插件"（`downloads/community-repos/awesome-dsh-plugin/`）
- [Dominic789654/awesome-deepseek-harness](https://github.com/Dominic789654/awesome-deepseek-harness) — 插件/skill/MCP/编排/UI 策展
- [walkinglabs/awesome-deepseek-harness-plugins](https://github.com/walkinglabs/awesome-deepseek-harness-plugins) — 双语精选：插件/工具/工作流/学习资源（08-14 新）
- [vvlife/awesome-deepseek-harness-plugins](https://github.com/vvlife/awesome-deepseek-harness-plugins) — 插件/工具/皮肤/扩展策展（08-14 新）
- [cccakeee/awesome-dsh-plugins](https://github.com/cccakeee/awesome-dsh-plugins) — evidence-led 目录：可加载扩展/skill/带权限意识的安装指引（08-14 新）

## 6. 社区与学习

- [hikariming/dshfind](https://github.com/hikariming/dshfind) — DSH 学习与分享社区（MDX）
- 论坛/博客/B 站线索：见 `cordis-paper-and-community.md` Part 2（84 条 URL 清单）
- turtle-ui — 官方 git 安装 prepare 脚本范例（**08-14 核查：仓库已 404**）；同用途的活范例见 [omdsh-dev/plugin-template](https://github.com/omdsh-dev/plugin-template) 的 `scripts/prepare.mjs`
- dsh-external/hub — 生态 hub（**08-14 核查：仓库已 404**）

### 6.1 08-14 新出现、未深读的候选仓库

- [NanmiCoder/dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) — AgentTeams 插件 + `skills/dsh-plugin-development/SKILL.md`
- [vibeinging/dsh-tool-search](https://github.com/vibeinging/dsh-tool-search) — 按需工具发现插件
- [zhu1090093659/dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) — Web UI 插件与皮肤合集（task board/git graph/皮肤中心）
- [ccch1mneyyy/dsh-cc-tui](https://github.com/ccch1mneyyy/dsh-cc-tui) — Claude Code 风格终端 TUI
- [dataelement/dsh-desktop](https://github.com/dataelement/dsh-desktop) — 桌面客户端（未核实详情）
- [hust-open-atom-club/oh-dsh-desktop](https://github.com/hust-open-atom-club/oh-dsh-desktop) — 可扩展 macOS 工作台 + 插件市场
- [lhh010/dsh-bash-encoding](https://github.com/lhh010/dsh-bash-encoding) — bash 编码相关修复插件

## 7. 工作区已有插件实例（可作参考实现）

- `dsh-chat-import/` — JS 插件：从 Claude Code 导入历史；`cordis.patch.yml` + index.mjs + 测试
- `dsh-resume-plugin/` — 多 skill 插件（resume-claude/resume-codex/shared），`cordis.patch.yml` + 双语 README
- `dsh-plugin-claude-bridge/` — TS 插件（src/index.ts、types、parser、skills、tsconfig）
- 上述目录位于 `D:\deepseek-harness\Project\Plugins\`
