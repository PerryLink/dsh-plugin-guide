# DSH master 未修复问题与常见误解（源码核实版）

> 本文件是 `dsh-plugin-guide` 知识库对官方仓库社区讨论的**源码级结论收拢**：
> 每个条目都在基线提交上逐行核实过（read/grep），附 `path:line`、临时规避与原文讨论链接。
> 汇总帖见官方 Discussions [DSH master (0.1.5-rc.2 / c291e7961a) 仍未修复的问题清单（社区核实版）](https://github.com/deepseek-ai/deepseek-harness/discussions/6520)。
>
> - 基线提交：`c291e7961a515f6d7af9304e7fd1d257929aef26`（= origin/master 2026-09-10 快照，0.1.5-rc.2 世代）
> - 核实人：PerryLink（[dsh-plugin-guide](https://github.com/perrylink/dsh-plugin-guide) 维护者）
> - 用法：开发插件/排障时按「症状 → 位置 → 规避」查；条目后附原讨论，官方有新回复时以原帖为准。
> - 诚实标注：无法在源码复核的环节（依赖未安装的半边）已注明。

## 1. 仍未修复（20 项，按严重度排序）

| # | 问题 | 位置（@c291e7961a） | 临时规避 | 讨论 |
|---|---|---|---|---|
| 1 | 同级/更窄的 `sandbox_permissions` 直接报错，模型整轮循环 | `packages/sandbox/sandbox/src/escalation.ts:162-164`（schema 恒广告全枚举 `:41`；danger-full-access 变体 `packages/bundle/base/cordis.patch.yml:227` + `packages/fs/fs-sandbox/src/index.ts:65-67` + `packages/fs/tool-fs/src/sandbox.ts:44-45`） | persona 注明「已是该模式就别带 sandbox_permissions」 | #4021 #4481 #4672 #4742 #4763 #4976 #4990 #5570（同族 #5238 #5298 #6215） |
| 2 | 纯推理轮以空 content 落盘 → 之后每轮 400，整会话报废 | `packages/llm/llm-deepseek/src/serialize.ts:203-235`（注释 `:219-226` 自认风险；无跳过/占位兜底） | 备份后解压 session.v3.jsonl.zstd，改占位/删除该条后重压 | #5466（同族 #1850 #6218 #6431） |
| 3 | windows-acl 沙箱缓存临时目录消失后该会话永久损坏 | `packages/sandbox/sandbox-local/src/index.ts:412-414`（缓存命中无复核）；runner 首检 `packages/sandbox/sandbox-windows-acl/src/runner.ts:109-120` | 重启 dsh host 重建快照 | #6483（同族 #5034） |
| 4 | read_image 所有预设一调即失败（cannot get property 'fs' without inject） | `packages/fs/tool-fs/src/index.ts:70-72`（inject 收窄 scope）；执行体 `packages/fs/tool-fs/src/read-image.ts:209`（`:265` 同类） | 无产品内规避；走外部视觉路径 | #4612 |
| 5 | 升级后旧 `code` 预设会话全部无法 resume（无 legacy 别名） | `packages/preset/agent-presets/src/index.ts:365-378`（无 LEGACY_PRESET_IDS）；错误被包成 `gateway/internal`（`packages/api/session-controller/src/agent.ts:216`） | 复制内置 ptc 预设到 `~/.dsh/.agent-presets/code/`，或改绑 standard/ptc | #5657 #5381 #5781 #4167 #5585 |
| 6 | exFAT 卷 write 必败（EISDIR）+ 盘根写入 EPERM | `packages/fs/fs-local/src/fsio.ts:616-621`（硬链接发布无回退，`:591` 默认 node:fs.link）、`:580-581`（mkdir 不容忍盘根 EPERM） | 目标放 NTFS；勿直写盘根 | #5704 #4981（相关 #2402） |
| 7 | Node < 22.19/24.2 安装后静默深埋失败（无友好版本门） | `apps/cli/src/bin.ts`（无运行时版本检查）；`apps/cli/package.json` 无 engines；仅根 `package.json:8-10`（npm 只警告） | 升级 Node ≥ 24.2（或 22.19+）；全局安装替代 npx | #6115 #6124 #6126 |
| 8 | 单个损坏插件条目令所有对话请求 REQUEST_EXTENSION | `packages/llm/llm-deepseek/src/adapter.ts:627-637`；`packages/llm/plugin-package-inventory-deepseek/src/index.ts:105-128`（`:117` 抛错）；默认挂载 `packages/bundle/base/cordis.patch.yml:70-71` | profile patch 禁用该插件，或修复损坏条目 | #6161（相关 #5683 #5968 #6108） |
| 9 | PTC 模式零参数工具绑定必失败 | `packages/code-runtime/code-runtime-worker-thread/src/bootstrap.ts:328-337`；`worker-json.ts:150,187-201` | 无产品内规避；帖内一行修复未合入 | #6065 |
| 10 | opencode-go 路由缺 `x-opencode-session` 头 + 缺 4.1-flash 目录项 | `packages/llm/llm-pi-ai/src/adapter.ts:384`；`packages/llm/llm-pi-ai/package.json:44`（pi-ai ^0.85.1 dist 无该头） | 路由级静态头（牺牲每会话亲和）；profile `models` 手写条目 | #6224 |
| 11 | Python SDK 跨进程续接旧会话只跑不落盘 | `packages/sdk/server/src/server.ts:259-292`（只查进程内表；恒 create 无 resume） | 同一进程内复用实例循环多轮 | #4591 #5950 #4954（相关 #1414） |
| 12 | append() 不执行消息身份校验：插件注入缺 id/role 写坏会话 | `packages/core/session/src/index.ts:710-740`（append 只调 validateSessionEventData `:739`）；`assertMessageEventShape` `:328-359` 只挂 adoptSessionEvent/seed | 注入消息必须自带 id、role:'user'、source:{kind} | #6284（相关 #6236 #918） |
| 13 | `dsh plugin` 子命令无法自愈 profile 依赖（CLI 侧亦缺 windowsHide） | `apps/cli/src/plugin.ts:120-163`（spawnSync 无 healing、`:134-138` 无 windowsHide） | profile 目录手动 pnpm install | #5537（#4024） |
| 14 | 插件经 `connection.rpc.handle()` 注册的通道静默失效（405） | `packages/client/connection/src/rpc-host.ts:79-86`（owner 取服务自身 ctx）、`:178-181` | 打社区补丁 cb9b6e2；等上游合并 | #6227（同族 #6270 #6289 #6337 #6513） |
| 15 | 文档预览插件钉版 pdfjs-dist 6.3.289 引用全局 `Iterator` → 旧 Safari/WebView 无法启动 | `packages/client/ui-sidebar-documentpreview/package.json:69`；`src/client/index.ts:37,116` | 换 Chrome/Edge 126+ / Firefox 131+ / Safari 18.2+；或注释 :37/:116 重建 | #6507（同类 #3912） |
| 16 | pwsh 沙箱对临时根未加保护的 realpath（RAM 盘报 EISDIR） | `packages/sandbox/sandbox-windows-acl/src/path-boundary.ts:11-14`（对照 `packages/sandbox/sandbox/src/roots.ts:30-41` 已有回退先例） | TEMP/TMP 指回物理盘或子目录 | #6018 |
| 17 | 编程式 `agents.create` 缺 model 时静默死轮 | `packages/core/agent-loop/src/index.ts:421-422`（{{model}} 绑原始可选字段无回退）；webhook 已有回退先例 `packages/webhook/webhook/src/session.ts:63-65` | 先 `agentDefaultModel.currentSelection()` 再显式传 provider/model | #4967 |
| 18 | grep/read 行预览从列 0 截断，2000 字节外的匹配被隐藏 | `packages/fs/tool-fs-search/src/grep.ts:35`、`search-core.ts:321-326`（kind:'head'）、`packages/fs/tool-fs/src/read-render.ts:11` | 单行大文件改用 shell 提取区间 | #4982 |
| 19 | dsh-llm 发布类型引用 devDependencies（npm 消费者 TS2724） | `packages/llm/llm/package.json:21-24`（./invariant 是公开子路径）、`:75-79` | 钉 0.1.1-rc.2 或自行声明依赖 | #5913 |
| 20 | /compact 在 agent 未空闲时一律报「active compaction」，诊断串味 | `packages/core/agent-loop/src/agent.ts:157-158`、`packages/compaction/compaction-basic/src/index.ts:414-419` | 等 turn 完全结束再 /compact | #6223 |

## 2. 次级清单（已核实、优先级较低，4 项）

| # | 问题 | 位置 | 规避 | 讨论 |
|---|---|---|---|---|
| S1 | Python SDK bundled runtime 清单缺 `dsh-attachment-local` → 挂载即 ERR_MODULE_NOT_FOUND | `python/sdk-runtime/package.json:23` | SDK 组合不挂 attachment-local | #4377 |
| S2 | 会话列表 RPC 是一次性全量快照，无分页/懒加载 | `packages/api/session-controller/src/index.ts:223-225`；cursor 仅保留位 `types.ts:245` | 拆分工作区/清理旧会话/ssh -C | #6017 |
| S3 | 轨迹面板首 token 时间在回放/已结流上不可用 | `packages/client/ui-trajectory/src/client/trajectory-assistant-definition.ts:188-189,261` | 无（仅影响指标展示） | #6129 |
| S4 | 冷/种子会话列表行回退显示工作区文件夹名 | `packages/api/session-controller/src/client/sessions/service.ts:143-151` | 打开会话一次生成标题投影 | #6316 #6207（相关 #3375 #5368） |

## 3. 已在 master 修复（旧帖一律更新即可，无需改代码）

更新到 0.1.5-rc.2 世代后以下问题消失；遇旧帖时给「更新即可 + 提交号」式回答：

- **windowsHide 弹窗族**：`a05b5fbe79` + `cc8099dc5f`（子进程清理工具隐藏）；CLI 半侧 `apps/cli/src/plugin.ts:134-138` 仍未修（见上 #13）。
- **Windows 目录选择器 CJK 截断族**（U+XX00 低字节为 0）：`51c242749a` 重写 readUtf16 → `koffi.decode(..., 'str16')`（`packages/host/directory-picker-native/src/win32-dialog-bindings.ts:39-44`）。覆盖 #643 #1660 #2126 #2227 #3010 #3313。
- **`--expose-internals` HMR 启动失败**：`c685582d54` + `675efe73f2`；loader 回退 `node-addon-require-builtin`（`vendor/loader/src/internal.ts:108-118`，CLI 依赖 `apps/cli/package.json:101`）。
- **compat.supportsDeveloperRole 可配置**：`884f7b9c41` + `cf4a27c471`（schema `packages/llm/llm-pi-ai/src/config.ts:256`、`catalog.ts:367`）+ 文档 `30a838cda3`（`docs/user/guide/providers.zh.md:156,184`）。
- **子代理模型快照 → request-time 选择**：`f76a225a7d`（PR #2663；`packages/subagent/subagent/src/child-agent.ts:60-85`）。
- **pnpm 11 构建失败（npm_execpath）**：`89674edc93`（`scripts/build.ts:18-20` + `scripts/pnpm-invocation.ts`）。
- **fs-ext/node-gyp Windows 构建族**：`d927cbff99` 换成预编译 `@deepseek-ai/node-addon-system`（flock）。
- **koffi 32KB 崩溃**：`141d72d7cf`（不再固定 32KiB view 读指针）。
- **非 loopback HTTP crypto.randomUUID**：新增 `dsh-util-crypto` 提供实现（`packages/client/connection/src/rpc.ts:36` 侧）。
- **ACP server 已发布**：`dsh --profile acp`（`@deepseek-ai/dsh-acp`）。
- **MCP structuredContent 要求条件化**：`e1633fbc3f`（自 0.1.0-rc.7+；按 outputSchema 广告与否决定）。
- **旧 v0→v3 迁移校验**：多处收紧/修复已随 0.1.5-rc 发布（历史会话不可加载先试升级）。
- **轮次导航条（turn rail）load-and-jump**：`b3064cca77` + `6af1ee49b1`。
- **Node 版本门槛**：根 `package.json:8-10` engines `^22.19.0 || >=24.0.0`；实测实际下限 ≈ 24.2（24.0/24.1 有 undefined 报错）。

## 4. 设计行为 / 常见误解（不是 bug，快速对照）

| 现象 | 结论 | 关键位置 |
|---|---|---|
| 本地模型把工具调用输出成 `<DSML|function_calls>` 文本 | 适配器只解析 `delta.tool_calls`，不解析文本标签；这是服务端职责 | `packages/llm/llm-deepseek/src/translate.ts:167-195` |
| 自定义 provider 显示上下文 262k 而非 1M | 262144 是未声明容量时的内置默认假设，可 settings.yaml 覆盖 | `packages/llm/llm-pi-ai/src/config.ts:64,330`、`catalog.ts:901` |
| 没填 key 却在扣 DeepSeek 余额 | 默认凭据引用环境变量 `DEEPSEEK_API_KEY`，启动环境只读且优先级最高 | `packages/llm/llm-deepseek/src/index.ts:88`；`packages/credentials/credentials-local/README.md:75-80` |
| web_search 用 deepseek-v4-flash 而非会话模型 | 独立搜索 provider（web-search-deepseek），模型/凭据/端点与聊天分离 | `packages/web/web-search-deepseek/src/provider.ts:38,207-221` |
| `dsh --profile tui` 不存在 | tui 非内置；README 中为示例（"assuming the tui profile is installed"），社区方案 `dsh plugin --profile tui add github:deepseek-harness/turtle-ui` | `apps/cli/README.md:28`、`apps/cli/reference/README.md:70-72` |
| `--host 0.0.0.0` 被拒绝 | 刻意不支持（远程代码执行风险）；用 LAN IP + `--trusted-host` 或 SSH 隧道 | `packages/bundle/web-app/src/startup.ts:74-75` |
| 工具定义每轮都发 | 无「每 N 轮」开关；工具集不变时前缀缓存复用（逻辑 prompt 体积 ≠ 全价计费） | `packages/core/agent-loop/src/agent.ts:262-265,556,613` |
| 同级权限请求报错 | 见第 1 节 #1；read-only 下升级走审批可正常终止 | `packages/sandbox/sandbox/src/escalation.ts:162-164` |

## 5. 相关资源

- 官方汇总帖（含 20+4 完整清单与维护者说明）：<https://github.com/deepseek-ai/deepseek-harness/discussions/6520>
- 官方仓库 checkout 路径约定见 [SKILL.md](../SKILL.md)（本知识库以 `D:\deepseek-harness` 为示例）。
- 每项条目引用的讨论号均可拼为 `https://github.com/deepseek-ai/deepseek-harness/discussions/<编号>` 直接查看原始分析。

---

*维护说明：官方有新提交/新回复时，本文件的「仍未修复」条目可能过时——以原帖与官方答复为准；更新时保留基线提交号与核实日期。*
