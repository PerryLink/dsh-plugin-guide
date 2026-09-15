# DSH master 未修复问题与常见误解（源码核实版）

> 本文件是 `dsh-plugin-guide` 知识库对官方仓库社区讨论的**源码级结论收拢**：
> 每个条目都在基线提交上逐行核实过（read/grep），附 `path:line`、临时规避与原文讨论链接。
> 汇总帖见官方 Discussions [DSH master (0.1.5-rc.2 / c291e7961a) 仍未修复的问题清单（社区核实版）](https://github.com/deepseek-ai/deepseek-harness/discussions/6520)。
>
> - 初版基线：`c291e7961a515f6d7af9304e7fd1d257929aef26`（2026-09-10 快照，0.1.5-rc.2 世代）
> - **复核基线：`0d1f50007f9bca3f52b06e1c3074fa14d5fb0720`（2026-09-15，0.1.6-alpha.1 世代；区间 666 提交 / 3123 改动文件）——2026-09-15 全表重核：1 项已修复（#6129）、1 项转部分修复（#2）、行号已按新基线刷新**
> - 核实人：PerryLink（[dsh-plugin-guide](https://github.com/perrylink/dsh-plugin-guide) 维护者）
> - 用法：开发插件/排障时按「症状 → 位置 → 规避」查；条目后附原讨论，官方有新回复时以原帖为准。
> - 诚实标注：无法在源码复核的环节（依赖未安装的半边）已注明。

## 1. 仍未修复（31 项 + 1 项部分修复（#2），按严重度排序）

| # | 问题 | 位置（@0d1f500，2026-09-15 复核） | 临时规避 | 讨论 |
|---|---|---|---|---|
| 1 | 同级/更窄的 `sandbox_permissions` 直接报错，模型整轮循环 | `packages/sandbox/sandbox/src/escalation.ts:163`（schema 恒广告全枚举 `:41`；danger-full-access 变体 `packages/bundle/base/cordis.patch.yml:226` + `packages/fs/fs-sandbox/src/index.ts:65-67` + `packages/fs/tool-fs/src/sandbox.ts:39-45,59-70`；spec 钉死 `tests/escalation.spec.ts:88,90`） | persona 注明「已是该模式就别带 sandbox_permissions」 | #4021 #4481 #4672 #4742 #4763 #4976 #4990 #5570（同族 #5238 #5298 #6215） |
| 2 | 纯推理轮以空 content 落盘 → 之后每轮 400，整会话报废（**PARTIAL**：默认协议已切 Messages，待真机复测） | `packages/llm/llm-deepseek/src/protocols/chat-completions/serialize.ts:196-229`（chat-completions 仍空 content，注释 `:212-219`；旧 `src/serialize.ts` 已随 `6a137ea702` 删除）；默认协议已切 Messages（`src/config.ts:81,207`，`b0641b83fc`），推理走 `thinking` 块（`messages/serialize.ts:29-32`） | 显式 `protocol: chat-completions` 时：备份后解压 session.v3.jsonl.zstd，改占位/删除该条后重压 | #5466（同族 #1850 #6218 #6431） |
| 3 | windows-acl 沙箱缓存临时目录消失后该会话永久损坏 | `packages/sandbox/sandbox-local/src/index.ts:415-417`（缓存命中无复核）；runner 首检 `packages/sandbox/sandbox-windows-acl/src/runner.ts:110-113` | 重启 dsh host 重建快照 | #6483（同族 #5034） |
| 4 | read_image 所有预设一调即失败（cannot get property 'fs' without inject） | `packages/fs/tool-fs/src/index.ts:70-71`（inject 收窄 scope）；执行体 `packages/fs/tool-fs/src/read-image.ts:209`（`:265` 同类） | 无产品内规避；走外部视觉路径 | #4612 |
| 5 | 升级后旧 `code` 预设会话全部无法 resume（无 legacy 别名） | `packages/preset/agent-presets/src/index.ts:372-381`（无 LEGACY_PRESET_IDS）；错误被包成 `gateway/internal`（`packages/api/session-controller/src/agent.ts:216`） | 复制内置 ptc 预设到 `~/.dsh/.agent-presets/code/`，或改绑 standard/ptc | #5657 #5381 #5781 #4167 #5585 |
| 6 | exFAT 卷 write 必败（EISDIR）+ 盘根写入 EPERM | `packages/fs/fs-local/src/fsio.ts:633-638`（硬链接发布无回退，默认 `link` `:608`、`throwGuardedCreateFailure` `:536-571`）、`:597-598`（mkdir 不容忍盘根 EPERM） | 目标放 NTFS；勿直写盘根 | #5704 #4981（相关 #2402） |
| 7 | Node < 22.19/24.2 安装后静默深埋失败（无友好版本门） | `apps/cli/src/bin.ts`（无运行时版本检查）；`apps/cli/package.json` 无 engines；仅根 `package.json:8-9`（npm 只警告） | 升级 Node ≥ 24.2（或 22.19+）；全局安装替代 npx | #6115 #6124 #6126 |
| 8 | 单个损坏插件条目令所有对话请求 REQUEST_EXTENSION | `packages/llm/llm-deepseek/src/common/request-extensions.ts:20-24`（异常一律升级，原 `adapter.ts:627-637` 已随 `6a137ea702` 消失）；`packages/llm/plugin-package-inventory-deepseek/src/index.ts:123`（抛错）；默认挂载 `packages/bundle/base/cordis.patch.yml:70-71` | profile patch 禁用该插件，或修复损坏条目 | #6161（相关 #5683 #5968 #6108） |
| 9 | PTC 模式零参数工具绑定必失败 | `packages/ptc-runtime/ptc-runtime-node/src/bootstrap.ts:326-335`（旧包 `code-runtime-worker-thread` 已由 `7c9bb5914c` 改名）；`json-wire.ts`（原 `worker-json.ts`） | 无产品内规避；帖内一行修复未合入 | #6065 |
| 10 | opencode-go 路由缺 `x-opencode-session` 头 + 缺 4.1-flash 目录项 | `packages/llm/llm-pi-ai/src/adapter.ts:384`；`packages/llm/llm-pi-ai/package.json:44`（pi-ai ^0.85.1 dist 无该头） | 路由级静态头（牺牲每会话亲和）；profile `models` 手写条目 | #6224 |
| 11 | Python SDK 跨进程续接旧会话只跑不落盘 | `packages/sdk/server/src/server.ts:259-292`（只查进程内表；恒 create 无 resume） | 同一进程内复用实例循环多轮 | #4591 #5950 #4954（相关 #1414） |
| 12 | append() 不执行消息身份校验：插件注入缺 id/role 写坏会话 | `packages/core/session/src/index.ts:719-770`（append 只调 validateSessionEventData `:748`）；`assertMessageEventShape` `:327-386` 只挂 adoptSessionEvent/seed | 注入消息必须自带 id、role:'user'、source:{kind} | #6284（相关 #6236 #918） |
| 13 | `dsh plugin` 子命令无法自愈 profile 依赖（CLI 侧亦缺 windowsHide） | `apps/cli/src/plugin.ts:120-163`（spawnSync 无 healing、`:134-138` 无 windowsHide） | profile 目录手动 pnpm install | #5537（#4024） |
| 14 | 插件经 `connection.rpc.handle()` 注册的通道静默失效（405） | `packages/client/connection/src/rpc-host.ts:79-84`（owner 取服务自身 ctx）、`:178-179`；0.1.5-rc.x 回归实证：`git show dsh-v0.1.2-rc.1` inject=`['webServer','credentials']` → `dsh-v0.1.5-rc.2`=`['credentials']`（`index.ts:69`）；**截至 `dsh-v0.1.6-alpha.1` 仍未修** | 打社区补丁 cb9b6e2；等上游合并 | #6227（同族 #6270 #6289 #6337 #6513 #6681） |
| 15 | 文档预览插件钉版 pdfjs-dist 6.3.289 引用全局 `Iterator` → 旧 Safari/WebView 无法启动 | `packages/client/ui-sidebar-documentpreview/package.json:69`；`src/client/index.ts:37,116` | 换 Chrome/Edge 126+ / Firefox 131+ / Safari 18.2+；或注释 :37/:116 重建 | #6507（同类 #3912） |
| 16 | pwsh 沙箱对临时根未加保护的 realpath（RAM 盘报 EISDIR） | `packages/sandbox/sandbox-windows-acl/src/path-boundary.ts:11-12`（对照 `packages/sandbox/sandbox/src/roots.ts:30-41` 已有回退先例） | TEMP/TMP 指回物理盘或子目录 | #6018 |
| 17 | 编程式 `agents.create` 缺 model 时静默死轮 | `packages/core/agent-loop/src/index.ts:421`（{{model}} 绑原始可选字段无回退）；webhook 已有回退先例 `packages/webhook/webhook/src/session.ts:63-66` | 先 `agentDefaultModel.currentSelection()` 再显式传 provider/model | #4967 |
| 18 | grep/read 行预览从列 0 截断，2000 字节外的匹配被隐藏 | `packages/fs/tool-fs-search/src/grep.ts:35`、`search-core.ts:324-325`（kind:'head'）、`packages/fs/tool-fs/src/read-render.ts:11` | 单行大文件改用 shell 提取区间 | #4982 |
| 19 | dsh-llm 发布类型引用 devDependencies（npm 消费者 TS2724） | `packages/llm/llm/package.json:21-24`（./invariant 是公开子路径）、`:76-77` | 钉 0.1.1-rc.2 或自行声明依赖 | #5913 |
| 20 | /compact 在 agent 未空闲时一律报「active compaction」，诊断串味 | `packages/core/agent-loop/src/agent.ts:157-158`、`packages/compaction/compaction-basic/src/index.ts:410-416` | 等 turn 完全结束再 /compact | #6223 |
| 21 | todo 任务栏在回合中断后永久消失 | `packages/todo/tool-todo/src/index.ts:134-145`——投影 apply 在 `turn/start` 无条件返回 null（`:140`）、`stateVersion: 2`（`:144`）；修复需 bump 2→3（投影缓存 ver 不匹配即丢弃，`packages/session/session-projection-cache/README.md:80`） | 无产品内规避（模型自觉重写不可靠） | #6524（已并入汇总帖 #6520） |
| 22 | 压缩阈值按整窗口算，1M 窗口下高于 provider 实际输入上限（pressure 几乎永不触发） | `packages/compaction/compaction-basic/src/config.ts:20`（DEFAULT_THRESHOLD_RATIO = 0.8）、`:144`（thresholdTokens = floor(contextWindow × ratio)，不减输出预算）；`DEFAULT_MAX_TOKENS = 256_000` 现位于 `packages/llm/llm-deepseek/src/common/defaults.ts:8`（`DEFAULT_CONTEXT_WINDOW = 1_000_000` 在 `:6`，原 `adapter.ts:149` 已随协议拆分消失） | `modelPolicies` 按模型覆盖 thresholdRatio（对 1M/256K 设 ≤0.65）；#5123 有 reservedOutputTokens 补丁建议 | #5123 #5263 #5800 #6671（实测证据来自 #6520 条目提交者） |
| 23 | overflow 分支 retainTokens = 0，一次清掉约 98%（手动 /compact 同源） | `packages/compaction/compaction-basic/src/index.ts:281-285`——overflow 直接 `selectCompactableRange(session, measurement, 0)`（`:285`）；注释 `:248` 写明绕过正常保留尾策略 | 无产品内规避；先确认 preset 隔离域挂载了 compaction-basic（host 树默认禁用，`packages/bundle/web-app/cordis.patch.yml:432-439`） | #5416 #5650 #6672 |
| 24 | tool-result 剪枝跑在压缩选区之前，摘要器输入已失真 | `packages/compaction/compaction-basic/src/index.ts:281-285`（overflow：prune → select）、`:305-313`（pressure：prune → remeasure → select） | 无产品内规避 | #5766（相关实测 1:1 剪枝标记，来自 #6520 条目提交者） |
| 25 | 压缩后旧轮推理整段不回传（实测推理占摘要器输入 58.8%） | 压缩交易把选区整体替换为摘要（`packages/compaction/compaction-basic/src/region.ts:174` compactSurfaceRegion + `commitCompactionBody` `:472-500`），旧轮 reasoning 位于被替换区间内、不再回传 | 无产品内规避 | #6480 #6510 #3002（实测证据为准，见 #6520） |
| 26 | token-meter 的 CJK 增量低估（实测 +26% ~ +57%，纯中文样本 1.57×） | `packages/llm/token-meter/src/estimate.ts:13`（CHARS_PER_TOKEN = 4；estimate 只作用于每步增量，总量 provider-anchored） | 无产品内规避；注意按真实用量预算 | #6361 #5632 #6688（实测口径见 #6520） |
| 27 | 桌面端打包在 prepare:dsh 阶段必败（payload smoke 引用已移除的 fs-ext） | `apps/desktop/scripts/prepare-dsh.ts:142`；smoke `apps/desktop/tests/fixtures/runtime-payload-smoke.mjs:67-83`（`requireRuntime('fs-ext')`，调用 `:124`）；策略残留 `runtime-file-policy.ts:26-30`、`project-manager.ts:111`；依赖树已无 fs-ext | 打包机在 apps/desktop 下 `pnpm add -D fs-ext` | #6589 #6612 |
| 28 | 读路径 `SessionLogScanner` 默认 `recoverable`：seq gap/损坏行被静默截断，直到后续 turn/end 才重抛（"valid aborted-turn 被当作 no more history"） | `packages/session/session-persistence-jsonl/src/index.ts:915`（无 recovery 实参）；`format.ts:403`（默认值）、`:482-484`/`:497-514`（issue 暂存）、`:369`（header 侧实为 strict，但被扫描器默认覆盖）；strict 仅 verify 路径 `generation.ts:583/597` | 备份日志手动修 gap；修复方向=`:915` 传 `'strict'` 或暴露 `format.ts:394` issue | #6562 #3631 |
| 29 | v0→v3 迁移后三类 stock 投影未守卫 `message.content/source` 读取 → hydrate 崩溃（迁移器有直通分支不保证完整 envelope） | `session-turn-outline/src/projection.ts:110,113,119`；`session-stats/src/projection.ts:174`；`session-telemetry/src/coordinator.ts:270`；直通分支 `session-format-v0-to-v1/src/migration.ts:354-357,366-368,390-395` | 投影侧防御性守卫（最小风险补丁方向） | #6686 |
| 30 | http-proxy 把 `[::1]` 写进子进程 `no_proxy`/`NO_PROXY` → httpx 系 MCP server 崩溃（undici 专用括号项泄漏到子进程 env） | `packages/util/http-proxy/src/policy.ts:33`（LOOPBACK_NO_PROXY 含 `[::1]`，注释 `:25-32` 自认是为 undici）、`:206-210`；`install.ts:79-92,113-129`；harness 自身匹配器无需括号项（`:279-295` 去括号） | env 写入侧只写裸 `::1`，undici 消费处保留括号项（两处消费者分离） | #6655 |
| 31 | 粘贴图片惰性持有 File 快照：剪贴板同步（如微信输入法跨设备复制）后提交时 FileReader NotFoundError | `ui-conversation/src/client/service.ts:73-80`（browserDraftAttachment 只存 File+objectURL）、`:124-135`（base64ImageOf）、`:286-291`；对比文件类立即上传 `:316-324` | 粘贴后立即发送，或拖拽/文件选择 | #6673 |
| 32 | web-fetch NAT64 探测无守卫：无 DNS64 网络（ipv4only.arpa 不解析）下所有双栈主机 fetch 全灭 | `packages/web/web-fetch-http/src/network.ts:90-92`（无 try/catch）、`:113-134`（discoverNat64Prefixes）、`:38`；SSRF 检查独立（`:96-106`） | 无产品内规避；补丁方向=ENOTFOUND/ENODATA 视为无前缀 | #6664 |

## 2. 次级清单（已核实、优先级较低，6 项）

| # | 问题 | 位置 | 规避 | 讨论 |
|---|---|---|---|---|
| S1 | Python SDK bundled runtime 清单缺 `dsh-attachment-local` → 挂载即 ERR_MODULE_NOT_FOUND | `python/sdk-runtime/package.json` 依赖清单（`dsh-attachment` 在 `:23`，仍无 `dsh-attachment-local`；0.1.6 世代清单已改：`dsh-code-runtime*`→`dsh-ptc-runtime*`、新增 `dsh-compaction-image-offload`/`dsh-session-title-llm`） | SDK 组合不挂 attachment-local | #4377 |
| S2 | 会话列表 RPC 是一次性全量快照，无分页/懒加载 | `packages/api/session-controller/src/index.ts:223-225`；cursor 仅保留位 `types.ts:245` | 拆分工作区/清理旧会话/ssh -C | #6017 |
| S4 | 冷/种子会话列表行回退显示工作区文件夹名 | `packages/api/session-controller/src/client/sessions/service.ts:145-152` | 打开会话一次生成标题投影 | #6316 #6207（相关 #3375 #5368） |
| S5 | cordis preset 的 SKILL.md 仍在教已废弃工具名（6 处旧名 vs 实现注册 7 个新名） | `packages/preset/agent-presets/presets/cordis/skills/editing-cordis-compositions/SKILL.md:32,34,64,80,118,122`；新名 `packages/extensions/tool-cordis/src/index.ts:45,64,100,152,244,333,355`；另有生成文件/文档残留 `tool-cordis/src/api-catalog.ts:6`、`cordis-client-runner/.../slot-catalog.ts:7,74`、`docs/subsystems/slots.md:176`（+.zh）与三个快照（`ui.expected.md:36`、`session.v2.jsonl:17`、`session.v3.jsonl:18`） | 文档修复型 PR；快照测试需重生成 | #6679 |
| S6 | SIGTERM 无在途 turn 排空路径；5s 宽限硬编码；无 `dsh restart` | `apps/cli/src/process-shutdown.ts:4,69-75`；dispose=cancel+whenIdle `agent-loop/src/index.ts:594-595`；launcher 无 restart（`apps/cli/src/args.ts:145-201`） | 第二信号即强退是固定语义；drain 属 feature request | #6665 |
| S7 | LLM 出站超时修复未合入；undici 全局 dispatcher 由 http-proxy 独占（>5min prefill 在 ~302s 被 body timeout 终止） | 无 `egress.ts`/`httpBodyTimeoutMs`；`llm-pi-ai/src/config.ts:46`（300s 空闲看门狗）、`adapter.ts:355`；`util/http-proxy/src/install.ts:208-220` | 每请求新建 fetch 绕过共享 socket 记账 | #5673 |

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
- **轨迹面板首 token 时间（#6129）**：`e779831f40` "fix(client): restore assistant timing from recorded streams"（2026-09-14 经 `a85778448a` 进入 master；不在初版基线 c291e7961a 中）。`packages/client/ui-trajectory/src/client/trajectory-assistant-definition.ts:195-203` 新增 `settleTiming()` 用 `assistantStreamFirstTokenTime(event.data.stream)` 从已记录流恢复首 token 时间，挂到 `assistant/message`（`:210-213`）与新增的 `assistant/attempt`（`:238-243,367`）。回放/已结流不再是空洞（原次级 S3，2026-09-15 复核移入本节）。
- **Node 版本门槛**：根 `package.json:8-9` engines `^22.19.0 || >=24.0.0`；实测实际下限 ≈ 24.2（24.0/24.1 有 undefined 报错）。

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
| 同级权限请求报错 | 见第 1 节 #1；read-only 下升级走审批可正常终止 | `packages/sandbox/sandbox/src/escalation.ts:163` |
| bash/run_code 的 `description` 必填 | 刻意设计（活动列表/UI 展示用）；空串另有执行期拒绝 | `packages/shell/tool-bash/src/index.ts:244-252`；`packages/core/tools/src/ptc.ts:304-311,327-330`（#3874） |
| 界面 token 远小于计费 | 界面=主会话 usage 之和；子代理独立会话/日志不计入；无费用熔断功能 | `ui-trajectory/src/client/layout.ts:758,952-955`；`subagent-in-process-driver/src/index.ts:113`（#6688） |
| skill 目录监视挡 Windows 插件更新 | `watch: false` 开关已存在（未文档化）；Windows 可用 `watchUsePolling` | `packages/skill/skill-filesystem/src/index.ts:82-83`（#6674） |
| headless 每次运行新会话 | 默认新会话 `session-<uuid>`；**0.1.6+ 已支持 `--session-id <id>` 续跑已存在会话**（`startup.ts:44`、`index.ts:279` `agents.resume`；缺 `sessionPersistence`/`sessionQuery` 会 fail loud）；无"继续最近会话"便捷形式；多轮另可走 Connection RPC/gateway | `packages/bundle/headless/src/index.ts:279,342`；`startup.ts:43-45`（#6677） |
| 想"回退到第 N 轮重跑" | 无原位 rewind；fork 生成新会话继承前缀，边界禁落在开启 turn 内；UI 仅开放已完成轮次末条消息 | `packages/core/session/src/index.ts:1203,1256-1260`；`ui-chat/src/client/locale.ts:71-72`（#6652） |
| 自定义 provider 想调思考强度 | 模型条目声明 `reasoningEfforts`（off/minimal/low/medium/high/xhigh/max）→ thinkingLevelMap；仅 llm-pi-ai | `packages/llm/llm-pi-ai/src/catalog.ts:607,690-743`；示例 `index.ts:28-53`（#1058） |
| 编译报错引用不存在的导出（如 PersistenceCoordinator） | 旧产物与源码混装，非配置问题；彻底重建 | 常量已改名搬家 `session-query/src/config.ts:12`（#5622） |
| 自动压缩"开始"阶段不可见 | 节点模型已按 lifecycle-first（start=compaction/start）；仅渲染层被 checkpoint 门控 | `ui-chat/src/client/conversation-nodes/compaction.ts:39-45,52-53`（#6675） |

## 5. 相关资源

- 官方汇总帖（31 项未修 + 1 项部分修复 + 6 项次级，2026-09-15 已对照 0.1.6-alpha.1 复核）：<https://github.com/deepseek-ai/deepseek-harness/discussions/6520>
- 官方仓库 checkout 路径约定见 [SKILL.md](../SKILL.md)（本知识库以 `D:\deepseek-harness` 为示例）。
- 每项条目引用的讨论号均可拼为 `https://github.com/deepseek-ai/deepseek-harness/discussions/<编号>` 直接查看原始分析。

---

*维护说明：官方有新提交/新回复时，本文件的「仍未修复」条目可能过时——以原帖与官方答复为准；更新时保留基线提交号与核实日期。*
