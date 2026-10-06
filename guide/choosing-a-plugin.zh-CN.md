# DSH 插件选型指南：每个能力面该用哪个插件（实测数据）

> English: [choosing-a-plugin.md](choosing-a-plugin.md)

## 一、怎么读这份指南

这份指南回答一个问题：**某件具体的事，现在该装哪个插件。** 它不按目录分类组织——目录的 11 个分类是机器标签，不是用户的问题，同一件事的候选常散落在好几个分类里。下面按「你想干什么」分面，每个面给出领先者、实测数字、它强在哪，以及可直接复制执行的安装命令。

判断依据只有两个字段，都来自 1024Store 的公开接口：

- **装机数**（`installs`，1024Store 记录的累计安装次数）
- **npm 周下载**（`npm7d`）

**不看 star。** 原因见第二节。

几个必须提前说清的局限：

1. **⚠️ 最重要的一条：「装机数」只是 1024Store 渠道口径，不是总采用量。** 1024Store 的「装机数」**只统计经它自己的包装器 `dsh1024` 完成的安装**；用官方 `dsh plugin` 命令安装**不计入**。该 Store 自己的 README 明写：*「直接使用官方 `dsh plugin` 命令仍然可用，但不会计入 DSH 1024Store 安装统计」*。佐证：`dsh1024` 自身周下载仅 **355**。⇒ **「装机 3」不等于「只有 3 人在用」。** 本篇的装机排序应理解为「**经 1024Store 渠道的安装热度**」，**不是总采用量**；这限制贯穿全篇每一处装机对比与排名。
2. **star ≠ 质量，在这份数据里几乎不是任何信号。** 目录把 monorepo 子包当独立条目收录，每条继承父仓星数。实测「官方 star 降序 Top 60」里 `zhu1090093659/dsh-web` 一个仓占 **27 席**（其条目全部 8,400★），那 60 行只来自 **27 个不同父仓**。更直观的反例：`reactive-resume`（一个简历工具）有 43,851★，它的目录条目装机 **66**、npm 周下载 **223**；而 `omdsh-dev/DSH-better-sidebar` 只有 4,006★，却是装机 **127**、npm 周下载 **57,806**。**星数与真实使用量在这份数据里可以是反的。**
3. **装机数里混着失败重试。** 数据带 `fail`（失败次数）字段：`volcengine/OpenViking` 的 DSH 条目装机 **401** / 失败 **448**；`omdsh-dev/DSH-better-sidebar` 装机 **127** / 失败 **333**。也就是说装机数不等于成功安装数，更不等于用户数。
4. **npm 周下载含 CI 与镜像流量，单独看会骗人 —— 但不要因此把真插件当成假的。** 极端例子：`MichengAI/dsh-codex-ui` 的 npm 周下载 **86,997**（全样本第一），装机却只有 **3**。经独立核验，**它是真实、活跃、兼容当前宿主的社区 Web UI 插件**（`@michengai/dsh-codex-ui` v1.1.28 / Apache-2.0 / 92 个版本 / 仓库建于 2026-08-14 / README 有 Host compatibility 节显式覆盖 `0.2.0-rc.1`、`rc.2` / 0 open issues），86,997 是真实下载量，非撞名（npm 上无裸 `dsh-codex-ui`），也非自家 CI（4 个 workflow 无 cron）。**它的问题不是「假」，而是「下载曲线不能直接读作采用量」**——其日曲线呈台阶状（9/21–9/25 连续 5 天稳定在 24,648–24,968），说明看 npm 数字还必须看曲线形状。反过来也有装机不低但 npm 为空的条目。
5. **目录分类是机器打的、可能错。** 本条样本里，余额挂件被归进「趣味」，上下文洞察面板被归进「界面」。所以本篇按需求分面，不照抄分类。
6. **样本不是全量。** 分析范围是 11 个分类各取前 200、按条目 id 去重后的 **2,200 条**，不是目录全量 13,760 条。尾部仍有装机数约 2 的条目，长尾是否被完全覆盖，本篇无法保证。

7. **要看你选的插件最近还动没动。** 本样本装机前 200 条里，末次 push 在 **7 天内**的有 **152** 条、8–30 天 **25** 条、31–60 天 **23** 条、超过 60 天 **0** 条。整体是活跃的，但下面点名的领先者里有两个明显安静下来的条目，已在第三节对应位置标注。

> 本文所有日期均为 **UTC**（数据集 `pushedAt` 原值，未做本地时区换算）；「静默天数」按数据集测量日 2026-10-06（UTC）与 push 日期之差取整。

**核验说明**：本篇点名的领先者均经独立核验——逐个读其 README 与 package.json、以 semver 实测其对当前宿主 `@deepseek-ai/dsh@0.2.0-rc.2` 的 peer 范围，并查其 open issue。**第三节各处的兼容与许可警示即核验结果。** 核验日期 2026-10-06。

## 二、大多数人最想要的 10 个插件

**按装机数排第一的条目（818）是 `imsai-sh/awesome-deepseek-harness-plugins`，但它根本不是插件 —— 它是 1024Store 的目录/数据仓，不可安装**（其 README 自曝由 `scripts/build-readme.mjs` 从 API 自动生成、收录 13,759 条；实测其 package.json 为 `"private": true`，**无 bin、无 dependencies、无 `dsh` 字段**，客户端是另一个仓的 `dsh1024`）。下表已排除它，只列社区插件。

| # | 插件 | 装机 | 安装者 | 30 日 | 失败 | npm 周下载 | 末次 push (UTC) | 一句话它强在哪 |
|---:|---|---:|---:|---:|---:|---:|---|---|
| 1 | `volcengine/OpenViking` 记忆插件 | 401 | 363 | 131 | 448 | 10,160 | 2026-10-06（0 天） | 整合长期记忆、知识检索与技能，装机与 30 日增量双第一 |
| 2 | `tt-a1i/archify` | 268 | 244 | 115 | 145 | 7,702 | 2026-10-05（0 天） | 把架构/流程/时序/数据流图表打包成技能，输出自包含 HTML |
| 3 | `liustack/modlens` | 173 | 154 | 37 | 123 | 16,691 | 2026-10-04（2 天） | 给纯文本模型架视觉桥，粘贴图片返回结构化 JSON 证据 |
| 4 | `vectorize-io/hindsight` | 169 | 148 | 73 | 145 | 19,056 | 2026-10-05（0 天） | 可学习的项目记忆，自动召回沉淀、按仓库隔离 |
| 5 | `omdsh-dev/DSH-better-sidebar` | 127 | 99 | 38 | 333 | 57,806 | 2026-10-05（0 天） | 侧边栏完整工作台：文件编辑、终端、Git、子代理，可注册新 Tab |
| 6 | `NanmiCoder/dsh-agent-teams` | 109 | 97 | 38 | 38 | 13,890 | 2026-10-05（1 天） | 多智能体团队，把长任务拆给协作的代理 |
| 7 | `MeteorNOX/DeepSeek-Balance-Whale-Widget` | 108 | 93 | 44 | 60 | 57,320 | 2026-10-05（1 天） | 右下角常驻余额挂件，顺带把账户余额一直摆在眼前 |
| 8 | `Tencent/BrowserSkill` | 95 | 83 | 51 | 27 | 7,455 | 2026-09-30（6 天） | 让智能体操控真实已登录浏览器，30 日增量 51 为全表最高档 |
| 9 | `bowenliang123/dsh-context` | 50 | 46 | 10 | 19 | 38,839 | 2026-10-05（1 天） | 上下文洞察面板：窗口当前构成、演变、压缩与注入事件 |
| 10 | `Han-1413141/dsh-cost-meter` | 72 | 65 | 24 | 43 | 31,807 | 2026-10-05（0 天） | 会话与当日费用统计、预算图框、余额、峰谷计价一键同步 |

第 9、10 行是两件事（前者看**上下文窗口**，后者看**钱**），多数人同时想要，故并列。严格按装机排序第 9 位应是 `Tencent/WeKnora`（装机 75），但它定位文档知识库、受众窄得多，故未入榜。

## 三、逐能力面选型

以下每个面给出：领先者 + 实测数字 + 它强在哪 + 现成安装命令。**同一面若没有明确领先者，本节直接写明并列出前 2–3 个候选的实测值。**

### A. 跨会话记忆

**领先者：`volcengine/OpenViking` 的 DSH 记忆插件** —— 装机 **401** / 安装者 363 / 30 日 **131** / 失败 448 / npm 周下载 **10,160**。装机、安装者、30 日增量三项均为本面第一，且是唯一装机过 400 的记忆类条目。

**三点使用前必须知道：** ① **License = AGPL-3.0**（本篇其它多数条目是 MIT/Apache，许可差异需单独留意）；② 它的 DSH 条目是**连服务器的客户端 bundle**（auto-recall、会话捕获、`viking://` URI 保护、MCP 工具面），**它本身不实现记忆库、也不实现检索**——上面的描述容易让人误以为它是完整的记忆系统；③ 「自演进」只出现在该仓 README 的 `## Research` 段，**主语是另一个研究系统 VikingMem**，产品功能里没有这个承诺，故本段不使用该措辞。

第二梯队是 `vectorize-io/hindsight`（装机 169 / npm 19,056）与 `omdsh-dev/dsh-mnemon`（装机 12，但 npm 周下载 **13,825**）。

```bash
dsh plugin --profile web add @openviking/dsh-memory-plugin
```

### B. 成本与用量

这个面是两件事，不要混。

**看「钱」的领先者：`Han-1413141/dsh-cost-meter`** —— 装机 **72** / 安装者 65 / 30 日 24 / 失败 43 / npm 周下载 **31,807**。会话与当日费用统计、预算图框、余额、历史看板，支持峰谷计价与价格一键同步。**注意：「170+ 模型价目」「11 家 Coding Plan」目前只有作者自述级证据**——承载文件 `lib/provider-prices.js`、`lib/coding-plans.js` 确实存在，但未逐条计数核实。

```bash
dsh plugin --profile web add dsh-cost-meter
```

**看「上下文窗口」的领先者：`bowenliang123/dsh-context`** —— 装机 **50** / 安装者 46 / npm 周下载 **38,839**（本面最高）。它把上下文窗口的构成与演变画出来：窗口占比对照、按请求的历史趋势、压缩与注入事件、消息级 token 统计。**兼容性提示（声明层，不等于跑不起来）：其 `peerDependencies` 写的是 `>=0.1.5-rc.1`，在 semver 预发布规则下 `satisfies("0.2.0-rc.2")` 为 `false`。** 这是**声明层**现象——作者意图显然是无上界（README 写 0.1.5-rc.1+），且该仓在核验当日仍在推送提交；但它意味着安装前的自动兼容检查可能给出警告，请以实装结果为准。

```bash
dsh plugin --profile web add dsh-context
```

**看「Token 归属与余额」的候选（尚无明确领先者）**：`Ychris12138/dsh-usage-stats`（装机 20 / npm 2,226）、`zh667/TokenLedger`（装机 13 / npm 258）、`feibi-mochi/deepseek-harness-wallet`。三者各做一件事，装机都在 20 以内，差距不足以判定领先。

```bash
dsh plugin --profile web add @ychris12138/dsh-usage-stats
```

### C. IM 与远程访问

**IM 桥接领先者：`xmanrui/dsh-im`** —— 装机 **73** / 安装者 69 / 30 日 25 / 失败 23 / npm 周下载 **17,384**。实际覆盖 **12 个 IM 渠道**：飞书、微信、钉钉、企业微信、**企业微信应用**、QQ、**Slack**、Telegram、**Discord**、WhatsApp、**iMessage**、**Matrix**（另有 1 个 AI Office 连接器）。**⚠️ 已知故障：issue #299 报告「桌面版 0.2.0-rc.2 上连接超时」——这是本篇全表唯一直接命中当前宿主的故障报告**，桌面版用户选它之前请先看该 issue 状态。

```bash
dsh plugin --profile web add @xmanrui/dsh-im
```

**手机与远程访问领先者：`shaobeichen/dsh-pocket`** —— 装机 **30** / 安装者 26 / 30 日 11 / npm 周下载 3,753。电脑上跑 dsh web，手机扫码访问，局域网加公网、实时同屏。**⚠️ ① 兼容性未知：它未声明任何 `dsh-*` peer 范围**（只声明 cordis `^4.0.1`），因此对当前宿主的兼容性**没有声明层保证**；**② License = GPL-2.0**，与多数条目的 MIT/Apache 不同；**③ 维护状态：末次 push 2026-09-16，已静默 19 天**，在本面候选里属于更新较慢的一个。

```bash
dsh plugin --profile web add dsh-pocket
```

**多机远程工作区的候选（尚无明确领先者）**：`wenbin-wb/dsh-bridge`（装机 2 / npm 5,543，局域网二维码 / Cloudflare 隧道 / 自建 WebSocket 隧道）、`flymysql/dsh-remote`（装机 1 / npm 5,212，多机 SSH 工作区）、`summer1238/dsh-remote-web-gateway`（装机 1）。装机都在 2 以内而 npm 都不低，无法判定领先。

### D. 注入与权限安全

**本面尚无明确领先者。** 候选实测值如下，装机差距在噪声范围内：

| 候选 | 装机 | 安装者 | 30 日 | 失败 | npm 周下载 | 定位 |
|---|---:|---:|---:|---:|---:|---|
| `NanmiCoder/dsh-auto-mode` | 13 | 9 | 7 | 0 | 991 | 安全自动权限管理，保持控制的同时允许自动化 |
| `PerryLink/dsh-defend` | 3 | 2 | 3 | 0 | 937 | 三接缝检测注入/越狱/密钥泄露，allow/ask/block 分层 |
| `PerryLink/dsh-permission-rules` | 2 | — | — | — | 1,965 | 声明式 allow/deny/ask 规则 + 进程级网络策略 |
| `moon09300731/dsh-approval-gate` | 5 | 4 | 2 | 1 | 1,083 | Flash 预判不可回补操作，危险转人工 |

`NanmiCoder/dsh-auto-mode` 装机最高且失败为 0；`PerryLink/dsh-permission-rules` 的 npm 周下载（1,965）高于其他人。**两者谁更强，这份数据回答不了。**

**⚠️ 使用前必看：`NanmiCoder/dsh-auto-mode` 所在仓库已被归档（`archived: true`，只读）。** 该仓已不再接受 issue 或 PR，问题不会有人修。其安全策略描述经核验属实，但**归档状态意味着这条路线已经停止演进**——把它当作候选时请把这一点算进去。

```bash
dsh plugin --profile web add @nanmicoder/dsh-auto-mode
```

### E. MCP 管理

**本面尚无明确领先者**，两个候选走的是完全不同的路线：

- `duhu2000/dsh-mcp-connector` —— 装机 **5** / 安装者 5 / npm 周下载 **7,150**（本面最高）。通用 MCP 连接器与管理市场：连接 MCP Server、发现工具与 Prompt，支持 OAuth/PKCE、API Key、JSON 导入。
- `PerryLink/dsh-mcp-panel` —— 装机 **13** / 安装者 13 / 30 日 9 / 失败 2 / npm 周下载 2,472。只读运行时管理面板：`/mcp` 命令与设置页展示连接状态、已注册工具、错误与重连计数。

装机后者高，npm 前者是后者的近 2.9 倍。**一个偏接入，一个偏观测，不是同一件事的两条实现。**

```bash
dsh plugin --profile web add dsh-mcp-connector
```

### F. 视觉与图像理解

**领先者：`liustack/modlens`** —— 装机 **173** / 安装者 154 / 30 日 37 / 失败 123 / npm 周下载 **16,691**。为纯文本模型架视觉桥梁：粘贴图片，输出结构化的 JSON 证据（OCR、版面、语义）。装机与 npm 两项均领先，且是唯一装机过 150 的视觉类条目。

```bash
dsh plugin --profile web add @liustack/modlens
```

第二梯队：`ysr666/dsh-vision-router`（装机 48 / npm 10,168，内置免 Key 视觉链加像素级工具）、`Anionex/dsh-vision-toolkit`（装机 35 / npm 3,652，图片问答、多图比较、长图 OCR、截图还原 UI）。两者与 modlens 有重叠但各有侧重。

### G. 侧边栏与界面底座

**领先者：`omdsh-dev/DSH-better-sidebar`** —— 装机 **127** / 安装者 99 / 30 日 38 / npm 周下载 **57,806**（全样本第二高）。侧边栏完整工作台：内置文件渲染编辑、Git 与子代理视图，三方插件可注册新 Tab。**注意：「终端」不是它提供的**——其 README 明写终端与 `node-pty` 已**交还 DSH 内置的 `ui-sidebar-terminal`**，其 npm description 也刻意没写终端。

```bash
dsh plugin --profile web add dsh-better-sidebar
```

同面其它部件（不冲突，可各自单独装）：

| 部件 | 装机 | npm 周下载 | 说明 |
|---|---:|---:|---|
| `omdsh-dev/dsh-genui` | 26 | 9,982 | 在助手回复内渲染交互式 UI：布局、图表、表单、测验、mermaid、3D 场景 |
| `omdsh-dev/dsh-at-file` | 26 | — | Codex 风格的 `@file` 文件引用，输入框里直接搜工作区文件 |
| `zhu1090093659/dsh-web` 的 `dsh-doctor` | 36 | — | 任务板 / Git 图 / 右侧面板 / 远程移动 UI / 宠物 / token 统计 / 皮肤中心合集 |
| `zhu1090093659/dsh-web` 的 `dsh-plugin-manager` | 59 | 27,649 | 客户端插件管理：安装、启用、移除 |

```bash
dsh plugin --profile web add @changfenhuang/dsh-genui
```

### H. TUI

**领先者：`ccch1mneyyy/dsh-TUI`** —— 装机 **42** / 安装者 34 / 30 日 10 / 失败 92 / npm 周下载 **16,008**（本面最高）。Claude Code 风格全屏终端 UI：像素鲸鱼顶栏、实时状态行、思考流式展开。

```bash
dsh plugin --profile web add @deepseek-harness-tui/dsh-tui
```

第二候选 `huiliyi37/dsh-tianshu-tui` 装机 3 / npm 544，差一个量级。

### I. 插件市场与分发

**本面尚无明确领先者**，两条路线的量级差距很大但性质不同：

| 候选 | 装机 | 安装者 | npm 周下载 | 定位 |
|---|---:|---:|---:|---|
| `imsai-sh/awesome-deepseek-harness-plugins` | 818 | 763 | — | **1024Store 目录/数据仓**（不是插件，不可安装） |
| `dsh-market/dsh-market` | 53 | 43 | — | 装在 DSH 里逛全部社区插件，分类筛选、一键安装 |
| `dshplugin/dsh-plugin-hub` | 5 | 5 | **6,198** | 社区内置市场，自述收录 4,000+ 精选插件，每日更新 |
| `zhu1090093659/dsh-web` 的 `dsh-market` | 33 | 25 | — | 创意工坊界面，供用户发现并安装社区插件 |
| `kingOfSoySauce/dsh-skin-market` | 26 | 24 | 2,761 | 皮肤市场（主题专用，不是通用插件市场） |

装机最高的 `imsai-sh/awesome-deepseek-harness-plugins` 是目录/数据仓、**不是可安装插件**；第三方中 `dsh-market` 装机最高（53），`dsh-plugin-hub` 的 npm 最高（6,198，装机仅 5）。**两个数字指向不同结论，本面不下判断。**

```bash
dsh plugin --profile web add github:dsh-market/dsh-market
```

### J. 桌面外壳

**本面尚无明确领先者**，三个候选的时间线不同：

- `anywhere-labs/dsh-desktop` 的 `dsh-plugin-desktop` —— 装机 **79** / 安装者 63 / 30 日 **7** / 失败 **363** / npm 周下载 129。现代桌面端，把桌面本身当作插件容器。装机最高，但 30 日仅 7、失败 363 偏高。
- `zhu1090093659/dsh-web` 的聚合包 —— 装机 **55** / 30 日 **24** / 失败仅 **3**。30 日增量为三者最高。
- `dsh-tauri-desk/deepseek-harness-desktop` 的 `dsh-tauri` —— 装机 1，Tauri 桌面主界面框架。

```bash
dsh plugin --profile web add dsh-plugin-desktop
```

### K. 浏览器控制

**领先者：`Tencent/BrowserSkill`** —— 装机 **95** / 安装者 83 / 30 日 **51** / 失败 **27** / npm 周下载 7,455。CLI 加扩展让智能体操控真实已登录的浏览器，无干扰地自动化。30 日增量 51 属全表最高档，该档里失败最少。**⚠️ 已知安全问题：issue #402 报告「未鉴权的 loopback daemon 可操控浏览器扩展」**，涉及本机进程可越权驱动浏览器，部署前请先评估该暴露面。

```bash
dsh plugin --profile web add @wxg-prc-cpg/browser-skill-dsh-plugin
```

其它路线（思路不同，各自装机个位数）：`Lum1104/dsh-browser`（装机 5，Chrome 侧边栏扩展，无需视觉能力）、`Fisfzy/ego-browser`（装机 9，13 个结构化工具加内置运行时）、`wqty123/dsh-browser`（装机 5 / npm 5,515）。

### L. 插件开发工具链

**本面尚无明确领先者。** `PerryLink/dsh-mcp-panel` 以装机 **13** 排在本样本 dev 分类第 4；`PerryLink/dsh-plugin-guide` 装机 6 / npm 1,012。同面其它条目装机都是 1–2：`MicroMilo/upstream-radar`（装机 2 / npm 484，依赖安全监控）、`Airmetro/dsh-update-checker`（装机 8 / npm 2,819，宿主版本检测），以及一批 npm 有量、装机为 0 的候选。

**本面实测值整体偏低，不足以支撑「领先者」结论。**

```bash
dsh plugin --profile web add dsh-mcp-panel
```

### M. Agent 团队与编排

**领先者：`NanmiCoder/dsh-agent-teams`** —— 装机 **109** / 安装者 97 / 30 日 38 / 失败 **38** / npm 周下载 **13,890**。装机、安装者、30 日增量、npm 四项均为本面第一，且大幅领先第二名。

```bash
dsh plugin --profile web add @nanmicoder/dsh-agent-teams
```

第二梯队：`Q00/ouroboros`（装机 8，分阶段评估加预算控制）、`MichengAI/dsh-automation`（装机 7 / npm 4,003，定时与自动化任务）。

### N. 网络搜索

**本面尚无明确领先者**，两个候选平分装机数：

| 候选 | 装机 | 安装者 | 30 日 | 失败 | npm 周下载 | 定位 |
|---|---:|---:|---:|---:|---:|---|
| `liustack/modsearch` | 30 | 25 | 12 | 16 | 7,347 | 搜索网页与 X，返回结构化 JSON 证据（search/fetch/引用） |
| `anysearch-team/anysearch-dsh` | 30 | 30 | 13 | 35 | 1,749 | 网络搜索与高级搜索工具 |
| `DDDMUC/dsh-free-search` | 18 | 16 | 6 | 4 | 14,568 | 免密钥免费网页搜索（DuckDuckGo） |

装机 30 对 30 平手；`dsh-free-search` 的 npm 最高（14,568）但装机仅 18。**三者各有一项第一，本面不判定领先者。**

```bash
dsh plugin --profile web add @liustack/modsearch
```

### O. Office 文档与交付

**本面尚无明确领先者**，候选之间维度互有胜负：

| 候选 | 装机 | npm 周下载 | 定位 |
|---|---:|---:|---|
| `dream-num/dsh-univer-office` | 19 | **12,227** | 表格、文档、演示、多维表格、画布，实时预览与 worktree 审阅 |
| `Tencent/WeKnora` 的 `dsh-weknora` | **75** | 1,217 | 原始文档转可查询 RAG、自主推理代理、自维护 Wiki |
| `Devin-AXIS/iPolloWork` 的 `ppt-studio` | 24 | 443 | 演示文稿制作与编辑 |

装机最高是 `dsh-weknora`（75），npm 最高却是 `dsh-univer-office`（12,227），差近 10 倍。两者不是同一个问题（知识库 vs 文档产出），**不构成同面比较。**

```bash
dsh plugin --profile web add dsh-univer-office
```

### P. 图像生成

**本面尚无明确领先者，且整体量级明显偏低。** 装机最高的图像生成条目是 `shanliuling/dsh-image-gen`（装机 **8** / npm 周下载 **7,216**，支持 Gemini、OpenAI、Seedream），其后是 `dickpy/dsh-imagegen`（装机 4 / npm 2,661）。**装机都是个位数，本面真实采用度还很低。**

```bash
dsh plugin --profile web add dsh-image-gen
```

### Q. 会话回退与归档

**回退（rewind）领先者：`Anionex/dsh-turn-rewind`** —— 装机 **24** / 安装者 17 / 30 日 5 / 失败 **4** / npm 周下载 1,504。基于持久 Change Ledger 回滚会话与工作区状态，同面候选里失败数最低。**⚠️ 定位纠正：它实际是「以消息为锚的项目文件恢复 + 可选对话回退」，会改动磁盘上的项目文件**——不要误以为它只回滚对话、不动你的工作区。使用前请确认你要恢复的范围。

```bash
dsh plugin --profile web add @anionex/dsh-turn-rewind
```

**归档与会话管理领先者：`dream12347/dsh-session-manager`** —— 装机 **20** / 安装者 17 / 30 日 **9** / 失败 **3**。删除（回收站恢复/彻底清除）、统计、继续/暂停、打开日志目录、工作区分组排序、压缩阈值设置。 **⚠️ 但请注意维护状态：该条目末次 push 为 2026-08-27，已静默 39 天，是本篇点名的领先者里最安静的一个。它装机只有 20、30 日增量 9，样本量本就小，选它之前请先看仓库是否还有响应。**

```bash
dsh plugin --profile web add dsh-session-manager
```

同面其它候选：`zhu1090093659/dsh-web` 的 `dsh-session-archive`（装机 19 / npm **25,779**，归档并存储整个会话）、`z953218350/dsh-archive-manager`（装机 16 / npm 2,351）、`SiriLee/dsh-rewind`（装机 11 / npm 8,546）。注意 `dsh-session-archive` npm 本面最高、装机却排第三——**两个口径不一致时，本篇以装机为主、npm 为辅，并摆出差异。**

### R. 皮肤与主题

**领先者：`zhu1090093659/dsh-web` 的皮肤中心（`skin-center`）** —— 装机 **75** / 安装者 67 / 30 日 26 / 失败 55。集中浏览与应用主题，主题面装机最高。

```bash
dsh plugin --profile web add @linxin666/dsh-client-ui-skin-center
```

其后是 `Small-tailqwq/dsh-deep-whale`（装机 31）、`kingOfSoySauce/dsh-skin-market`（装机 26 / npm 2,761）、`elysia395/dsh-wallpaper-engine`（装机 23 / npm **13,004**，本面 npm 最高）。

### S. 趣味与陪伴

**领先者：`MeteorNOX/DeepSeek-Balance-Whale-Widget`** —— 装机 **108** / 安装者 93 / 30 日 44 / npm 周下载 **57,320**。界面右下角常驻的余额挂件，带拖拽吸附与数字滚动动画。装机与 npm 两项均为本面第一。

```bash
dsh plugin --profile web add dsh-whale-widget
```

其后：`zhu1090093659/dsh-web` 的 `dsh-liangshen`（装机 18）、`dsh-pet`（装机 14）、`vlln/whale-girl`（装机 13 / npm 1,044）、`PC2005-cloud/dsh-pet`（装机 8）。

### T. 联网获取网页之外的证据（搜索与抓取）

见上文 N 面。此处不重复。

## 四、他不在第一的面（诚实清单）

这一节是全文可信度的支点，不软化。

**作者的条目在按装机排序的前 200 里只有 6 条：**

| 条目 | 装机 | 安装者 | 30 日 | 失败 | npm 周下载 |
|---|---:|---:|---:|---:|---:|
| `PerryLink/dsh-mcp-panel` | 13 | 13 | 9 | 2 | 2,472 |
| `PerryLink/dsh-plugin-guide` | 6 | 6 | 5 | 1 | 1,012 |
| `PerryLink/dsh-local-ai` | 4 | 4 | 3 | 3 | 900 |
| `PerryLink/dsh-defend` | 3 | 2 | 3 | 0 | 937 |
| `PerryLink/dsh-claude-move` | 3 | 3 | 3 | 0 | 843 |
| `PerryLink/dsh-output-styles` | 3 | 1 | 3 | 0 | 826 |

**对照：本篇装机第一的社区插件是 401。**

按能力面逐一对照——**下面这些面，作者都不是第一：**

| 能力面 | 本面领先者（实测） | 作者的条目（实测） |
|---|---|---|
| 跨会话记忆 | `OpenViking` 记忆插件 401 / npm 10,160 | `dsh-memento` 未进前 200；记忆面 20 名门槛为装机 **1**，其 npm 周下载 1,202 |
| 成本与用量 | `dsh-cost-meter` 72 / npm 31,807 | 无同面条目 |
| IM 与远程 | `xmanrui/dsh-im` 73 / npm 17,384 | 无同面条目 |
| 注入与权限安全 | 见 D 面：**本面尚无明确领先者** | `dsh-defend` 装机 3；`dsh-permission-rules` 装机 2 / npm 1,965 |
| 图像生成 | 本面最高装机 8（`dsh-image-gen` / npm 7,216） | `dsh-draw` 未出现在本样本前 200 |
| MCP 管理 | **本面尚无明确领先者**；`dsh-mcp-connector` 装机 5 / npm 7,150 | `dsh-mcp-panel` 装机 13 / npm 2,472 |
| 会话迁移 | `Nwflower/dsh-chat-import` 装机 10 / npm 5,111 | `dsh-claude-move` 装机 3 / npm 843 |
| 输出风格 | 本面样本内无强条目 | `dsh-output-styles` 装机 3 / npm 826 |
| 插件市场与分发 | **本面尚无明确领先者**（第三方装机最高 53） | 作者的市场类条目不在此列 |
| 上下文洞察 | `bowenliang123/dsh-context` 装机 50 / npm 38,839 | 无同面条目 |
| 插件开发知识 | 本面样本内无强条目 | `dsh-plugin-guide` 装机 6 / npm 1,012 |

**两条口径不对称**，必须讲清而不是含糊过去：

1. `dsh-claude-move` 与 `dsh-output-styles` 的「同面最强第三方」在本样本前 200 里**找不到可比条目**——不是作者第一，而是这个面在目录里的样本本身就很薄。
2. `dsh-memento` 未进装机前 200，但记忆面第 20 名门槛只有装机 1，故「未进前 200」与「装机为 0」是两件事，不能反推。

**作者此前一次独立普查（2026-10-05，npm registry）给出同一方向、更不利的结论**——那些周下载数**不在本篇数据源内，只作背景**：

- 成本：他 1,079 ← 第三方 **33,526**
- 记忆：他 1,202 ← 第三方 **10,160**
- IM：他 752 ← 第三方 **17,384**
- 安全：他 937 ← 第三方 **13,087**
- 图像生成：他 973 ← 第三方 **7,216**

同一普查里 `dsh-mcp-panel` 的 2,472 是他家族第一，但当面有更强的第三方（7,556）。**按本篇样本这条照旧成立**（7,150 对 2,472，约 2.9 倍）。

**一句话**：作者只有 `dsh-mcp-panel` 一条勉强够得着本样本 dev 分类前 5，其余五条都在装机个位数。**「谁是第一」的答案基本都不是他。**

## 五、选型时容易踩的坑

1. **不要用 star 排序选插件。** 目录把 monorepo 子包当独立条目，每条继承父仓星数——官方 star 榜前 60 里一个仓能占 27 席。复现方法见第六节。
2. **你看到的是「条目」，不是「插件」。** 同一个仓库会以多个条目出现（`zhu1090093659/dsh-web` 在 star 榜占 27 席）。**同个仓名在排行榜反复出现时，那是父仓溢出，不是 27 个热门插件。** 本篇排行榜均已按父仓去重。
3. **装机数里混着失败重试。** 装机 401 对失败 448、装机 127 对失败 333 都是真实读数。看到高装机条目，顺手看一眼 `fail`。
4. **失败数可以是装机的十倍以上。** `nexu-io/open-design` 的 `dsh-runtime`：装机 **73** / 失败 **1,103**。**失败数高不必然代表质量差**（可能只是依赖重、构建环节多），但它是选型前该知道的风险信号。
5. **npm 周下载与装机数会严重脱节，两个都要看。** 极端例子：`MichengAI/dsh-codex-ui` npm 周下载 **86,997**（全样本第一）、装机 **3**；`omdsh-dev/dsh-mnemon` 的 `dsh-mnemon-strategy-scoped` npm **7,627**、装机 **0**。**装机 0 而 npm 有量，通常意味着下载来自 CI、镜像或被父包带动，不代表有人在用 —— 但要先确认那个包是真插件，再下结论：`dsh-codex-ui` 就是被误判过的例子（真实、活跃、兼容当前宿主，见第一节第 4 条）。**
6. **分类标签不可信。** 余额挂件归入「趣味」，上下文洞察归入「界面」，「工具」类混杂了知识库、视觉、演示文稿、插件市场。**按需求找，不要按分类找。**
7. **30 日增量比总装机更能反映当下。** `anywhere-labs/dsh-desktop` 的桌面插件总装机 79，30 日增量却只有 **7**、失败 363；而 `zhu1090093659/dsh-web` 的聚合包总装机 55、30 日增量 **24**、失败仅 3。**总装机是历史，30 日增量是现在。**
8. **不要把「装机第一」当成推荐，也不要当成插件。** 装机第一的 `imsai-sh/awesome-deepseek-harness-plugins` 是 1024Store 的**目录/数据仓，不可安装**，不是社区插件；本篇已从推荐表排除。

## 六、数据来源与复现方式

**来源与口径**

- 接口：`deepseek1024.com/api/v2/plugins`（DSH 1024Store）
- 目录总量：**13,760** 条（v2 JSON 的 `catalogTotal`）
- API 生成时间：`2026-10-06T04:31:08.815Z`；本地归一化：`2026-10-06T06:43:06.608Z`
- 本篇分析样本：**2,200 条**（11 个分类各取前 200，按条目 id 去重），**不是全量**
- 排序字段：`installs`（原始 `installCount`）、`npm7d`（原始 `npmDownloads7d`）
- 附带字段：`installers`（`installerCount`）、`installs30d`、`fail`（`failureCount`）、`pushedAt`（默认分支末次 push）、`latestReleaseAt`（可能为 null）

**复现 star 溢出**

1. 取官方按 star 降序的 Top 60。
2. 按 `repo` 分组计数，得到每个仓占了多少席。
3. 结果：60 行只来自 **27 个不同父仓**，其中 `zhu1090093659/dsh-web` 占 **27 席**且 star 完全相同（8,400）——这是「子包继承父仓星数」的直接证据。
4. 交叉验证：`nexu-io/open-design` 99,560★、`tt-a1i/archify` 78,074★、`vectorize-io/hindsight` 45,905★、`reactive-resume` 43,851★ 都是**父仓星数**，不是该条目本身的。

**复现「星数与使用量可以是反的」**

取任意两条目读 `stars`、`installs`、`npm7d` 三列即可。本文对照：`reactive-resume`（43,851★ / 装机 66 / npm 223）对 `omdsh-dev/DSH-better-sidebar`（4,006★ / 装机 127 / npm 57,806）。

**本篇用到的数据文件**

- `00-live/_tmp-research/selection-dataset-2026-10-06-v2.md`（人读版，含 A 按装机去重 Top 100、B 按 npm 周下载 Top 100、C 各分类装机前 20）
- `00-live/_tmp-research/selection-dataset-2026-10-06-v2.json`（精确值；键：`byInstalls` / `byNpm7d` / `dedupByRepoTop100` / `starSpillEvidence` / `sampledEntries`）
- `D:\Projects\dsh-plugin-supersession-review-20261005.md`（仅用于第四节背景普查，该处已标注口径不同）

**已知未覆盖**

- 功能级对比：本篇正文只比采用度；「谁强在哪」除第三节已标注的兼容/许可/故障警示外，仍以条目自述定位为主，未做全面功能核验。（第三节的警示来自对领先者的独立核验：读 README 与 package.json、semver 实测 peer 范围、查 open issue，核验日期 2026-10-06。）
- 长尾：样本为各分类前 200，装机数约 2 以下的条目覆盖不保证完整。
- 作者普查里的五个第三方对手（`cc-safety-net`、`@openviking/dsh-memory-plugin` 之外的记忆对手、`dsh-image-gen` 之外的图像对手等）**不在本篇数据源内**，故只作背景、不作选型依据。

***

**结论**：本指南能给的是「哪些条目真的有人装、装了多少、失败多少次」，不能给「哪个插件写得更好」。**前者是这份数据的强项，后者要读者自己读 README、自己试装。** 凡是数据不足以判定领先者的面，都写明「尚无明确领先者」并列出候选实测值，没有硬凑赢家。
