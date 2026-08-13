# dsh-plugin-guide — DeepSeek Harness 插件开发知识库 + 技能包

> 对 DeepSeek Harness 插件开发资料做**全量调研 → 下载归档 → 汇总**的可复用知识库，同时以 `dsh-plugin-guide` **技能**形态供 agent 会话直接调用。
> 覆盖：官方仓库（github.com/deepseek-ai/deepseek-harness）、官网（deepseek.com/harness）、文档站（deepseek-harness.github.io 全站）、Cordis 框架（cordiverse/cordis）、Cordis 论文（cordiverse/paper）、dsh-plugin 生态与 15 个社区开发仓库深读。

**本仓库自包含（相对路径）**：克隆到任何目录、或把整个目录复制进任意 agent 的 skills 目录，都能直接用；`SKILL.md` 内的资料路径全部相对本目录解析。

## 目录结构

```
dsh-plugin-guide/
├── SKILL.md                  # 可调用技能（dsh-plugin-guide）：契约红线 + 按任务类型的开发路径 + 维护方式
├── README.md                 # 本文件
├── LICENSE                   # MIT（本仓库自有文本）
├── NOTICE.md                 # 第三方内容归属与分发边界（含私有约束内容的排除说明）
├── .gitignore                # downloads/ 等重型/第三方快照不入库
├── guide/
│   ├── plugin-dev-guide.md   # 综合开发指南（10 章：心智模型→资料地图→工程形态→契约→工具→能力分层→扩展点→打包+社区坑→规范→生态）
│   └── quick-reference.md    # 一页速查表（骨架代码/ctx API/事件模式/工具管线/安装形态/坑速查/红线）
├── references/
│   ├── sources.md            # 全部来源 URL 清单 + 归档位置（总账）
│   ├── official-docs/        # 官方文档全文副本（docs/** 215 篇双语 + AGENTS/packages/examples/vendor README + 站点投影清单）
│   ├── harness-repo.md       # 仓库文档调研
│   ├── website-pages.md      # 官网与文档站调研
│   ├── upstream-cordis.md    # Cordis 框架上游调研
│   ├── cordis-paper-and-community.md  # Cordis 论文 + 社区调研
│   ├── community-ecosystem.md         # 生态与社区汇总（含机制时间线）
│   └── community-repo-deep-dive.md    # 15 个社区开发仓库深读
├── downloads/                # 原始下载物（**不入 git**，由 scripts/ 再生；含 15 仓库源码、全站 HTML、论文 PDF 等）
└── scripts/
    ├── download-sources.ps1           # 官方/站点/上游全量下载脚本（幂等）
    └── download-community-repos.ps1   # 15 个社区仓库全量下载脚本（幂等）
```

## 使用方式一：本地安装为技能（主要用途）

把**整个目录**复制进 agent 的技能发现目录（相对路径因此保持不变）：

```powershell
$dst = 'D:\deepseek-harness\.agents\skills\dsh-plugin-guide'
Copy-Item -Recurse -Force 'D:\deepseek-harness\Project\Plugins\dsh-plugin-guide\SKILL.md','D:\deepseek-harness\Project\Plugins\dsh-plugin-guide\guide','D:\deepseek-harness\Project\Plugins\dsh-plugin-guide\references','D:\deepseek-harness\Project\Plugins\dsh-plugin-guide\scripts','D:\deepseek-harness\Project\Plugins\dsh-plugin-guide\LICENSE','D:\deepseek-harness\Project\Plugins\dsh-plugin-guide\NOTICE.md' $dst
```

新开会话后技能目录出现 `dsh-plugin-guide`，直接说"用 dsh-plugin-guide 技能帮我开发一个 XX 插件"即可。也可只复制 `SKILL.md`（此时技能按其中列出的回退路径寻找资料）。

## 使用方式二：发布到 GitHub（同样支持）

1. 在 GitHub 新建仓库，把本目录整个推送（`downloads/` 已被 `.gitignore` 排除，推送体积约 4MB）：
   ```sh
   git remote add origin git@github.com:<you>/dsh-plugin-guide.git
   git push -u origin main
   ```
2. 使用者克隆后即得完整知识库；需要原始下载物时运行 `scripts/download-sources.ps1` / `scripts/download-community-repos.ps1`。
3. 使用者安装为技能：把克隆目录复制进自己的 `.agents/skills/`（同方式一）。

## 维护

- 刷新线上资料：`pwsh -File scripts/download-sources.ps1`；刷新社区仓库：`pwsh -File scripts/download-community-repos.ps1`。
- 官方仓库 checkout（`D:\deepseek-harness`）更新后，重跑 `Copy-Item -Recurse D:\deepseek-harness\docs references\official-docs\docs` 同步官方文档副本。
- 分发边界：见 `NOTICE.md`——`downloads/` 与其中 `awesome-dsh-plugins/` 内容不得随仓库再分发。
- 与官方文档冲突时，以 `references/official-docs/`（= 官方仓库原文）为准。
