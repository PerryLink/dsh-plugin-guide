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

工作区 `dsh-plugin-topic-2026-08-13/`（2026-08-13T15:15Z，304 仓库、去重 303 条）：`README.md` 全量清单表、`repos.tsv`、`raw-github-api-page-1..4.json`、`related-readmes/`。

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

## 5. Awesome 精选列表

- [AdamPlatin123/awesome-dsh-plugins](https://github.com/AdamPlatin123/awesome-dsh-plugins) — 插件目录 + 每日兼容性追踪（`downloads/community-repos/awesome-dsh-plugins/`）
- [0xsline/awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness) — 插件/工具/基建策展
- [Alex-Yanggg/awesome-DSH-plugin](https://github.com/Alex-Yanggg/awesome-DSH-plugin) — 精选插件/扩展/调试/开发模块（`downloads/community-repos/awesome-DSH-plugin-alexyanggg/`）
- [awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) — 插件精选列表
- [bruc3van/awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin) — "30 秒找到适合你的插件"（`downloads/community-repos/awesome-dsh-plugin/`）
- [Dominic789654/awesome-deepseek-harness](https://github.com/Dominic789654/awesome-deepseek-harness) — 插件/skill/MCP/编排/UI 策展

## 6. 社区与学习

- [hikariming/dshfind](https://github.com/hikariming/dshfind) — DSH 学习与分享社区（MDX）
- 论坛/博客/B 站线索：见 `cordis-paper-and-community.md` Part 2（84 条 URL 清单）
- [turtle-ui](https://github.com/deepseek-harness/turtle-ui) — 官方 git 安装 prepare 脚本范例

## 7. 工作区已有插件实例（可作参考实现）

- `dsh-chat-import/` — JS 插件：从 Claude Code 导入历史；`cordis.patch.yml` + index.mjs + 测试
- `dsh-resume-plugin/` — 多 skill 插件（resume-claude/resume-codex/shared），`cordis.patch.yml` + 双语 README
- `dsh-plugin-claude-bridge/` — TS 插件（src/index.ts、types、parser、skills、tsconfig）
- 上述目录位于 `D:\deepseek-harness\Project\Plugins\`
