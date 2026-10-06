# DSH master 未修复问题与常见误解（源码核实版）

> 本文件是 `dsh-plugin-guide` 知识库对官方仓库社区讨论的**源码级结论收拢**：
> 每个条目都在基线提交上逐行核实过（read/grep），附 `path:line`、临时规避与原文讨论链接。
> 汇总帖见官方 Discussions [DSH master 仍未修复的问题清单（社区核实版）](https://github.com/deepseek-ai/deepseek-harness/discussions/6520)。
>
> - 初版基线：`c291e7961a515f6d7af9304e7fd1d257929aef26`（2026-09-10 快照，0.1.5-rc.2 世代）
> - 复核基线 1：`0d1f50007f9bca3f52b06e1c3074fa14d5fb0720`（2026-09-15，0.1.6-alpha.1 世代；区间 666 提交）
> - 复核基线 2：`ddefc45fbc7f8e46dd73185e68295696d1297887`（`dsh-v0.1.6-alpha.2`，2026-09-19；+882 提交）
> - **复核基线 3：`5badb15009ae1756c3afe0ae0cef1faafc290ccc`（`dsh-v0.2.1-alpha.1`，2026-10-03；+2300 余提交 / 8763 改动文件）——2026-10-06 全表重核，逐条复核覆盖 #1–#32 与 S1–S7**：
>   - **转入已修复 4 项**：#2（协议平面压平为 Messages-only，旧 chat-completions 半边删除；**后继形态 #8836 仍在**）、#5（`code`→`ptc` 迁移）、#10（pi-ai ^0.87.1 带上 `x-opencode-session`）、#22（压缩阈值改为 `min(window×ratio, window−reserved−headroom)`）、#29（telemetry 读取拍平 + 迁移产物强校验）——共 5 项，其中 #5 的修复**早于上一基线**，说明旧条目本身就过时。
>   - **判为不可复现 1 项**：#4（read_image）移入 §2，保留记录但**不要再当 bug 传播**。
>   - **部分修复 3 项**：#1（同级已接受、更窄仍抛）、#13（windowsHide 半侧已消失，自愈半侧仍在）、#19（`./invariant` 子路径已随 invariants 整体移除而消失，残留 devDependency `dsh-attachment` 引用）、S5（SKILL.md 半侧早已修好，仅剩生成文件/文档措辞残留）——共 4 项。
>   - **新核实 11 项**：§3 的 T1–T11（社区在 2026-09-15→10-06 窗口内提出，并经源码或已发布产物双向复核）。
>   - **行号全面刷新**：#23/#24/#26/#28/#30/#31/#32/S2/S4/S6/S7 的行号整体前移了一代；S5 引用**过时两代**；S1 的失败模式静态不可复现，已降级。
>   - 区间内两处上游改名/重写已并入条目：`llm-deepseek` 协议平面压平（`99e22ebbeb`，`src/common/*` → `src/*`、chat-completions 删除）、`preset/agent-presets` → `preset/agent-preset`（`d1e22a7e24`）。
> - 核实人：PerryLink（[dsh-plugin-guide](https://github.com/perrylink/dsh-plugin-guide) 维护者）
> - 用法：开发插件/排障时按「症状 → 位置 → 规避」查；条目后附原讨论，官方有新回复时以原帖为准。
> - 诚实标注：无法在源码复核的环节已注明 `UNVERIFIABLE`；**判为不可复现的条目不删除**，移入 §2 保留为"疑似误诊"记录。
> - **维护者参与度**：本轮通读窗口内 3100 条讨论，**没有任何维护者在任何帖里确认过修复或设计决定**；`#6520` 最后活动为 2026-09-23，无维护者回复。官方 Release 说明是唯一权威的"官方决定"记录（仓库无 CHANGELOG、无 issue tracker——API 核实 `has_issues=false`）。引用"官方已确认"时务必落到 Release 原文或提交号。

## 1. 仍未修复（22 项 + 2 项部分修复（#1、#13）+ 1 项残留面（#29），按严重度排序）

| # | 问题 | 位置（@5badb15，2026-10-06 复核） | 临时规避 | 讨论 |
|---|---|---|---|---|
| 1 | 同级/更窄的 `sandbox_permissions`：**同级自 `61c548e200` 起已接受**（该修复早于上一基线），更窄/不受支持的目标仍报错 | `packages/sandbox/sandbox/src/escalation.ts:171-179`（同级在 `:173` 返回；`:177-178` 仍抛"not strictly wider"；旧基线同文件 `:153-161`） | persona 注明「已是该模式就别带 sandbox_permissions」 | #4021 #4481 #4672 #4742 #4763 #4976 #4990 #5570（同族 #5238 #5298 #6215） |
| 2 | 适配器把**空白文本块**原样送上线路 → 云端端点 HTTP 400，整会话报废（**旧条目的 chat-completions 半边已随协议删除消失，这是 V4 / Messages-only 之后的后继形态，0.2.1-alpha.1 仍在**） | `packages/llm/llm-deepseek/src/serialize.ts:30`（`assistant()` 在 `:26` 声明，`:30` 的 `case 'text'` **无守卫**）；同文件两个兄弟转换器对同一 case 有守卫：`:65`（真值判断）、`:93`（长度判断）。实测每次出现的都是 `{ type:'text', text:'\n' }`——**长度 1，从不为 `''`**，所以 `length === 0` 抓不到；该包内基于 `trim()` 的守卫全库搜索为空。自托管路由容忍，**切到云模型才炸** | 无产品内规避；补丁要求=回放时丢弃**纯空白**文本块（并同样应用到 `:65`/`:93`，因为其他 role 也会发 `"\n"`）。另注意 npm 产物 `files` 只含 `lib/index.js` 与 `lib/types/**/*.d.ts`——**不发布 `src/`**，所以源码锚点在 npm 包里对不上 | #8836（后继）；#5466 #1850 #6218 #6431（原始族） |
| 3 | windows-acl 沙箱缓存临时目录消失后该会话永久损坏 | `packages/sandbox/sandbox-local/src/index.ts:423-425`（缓存命中无存在性复核；旧 `:415-417`）；runner 首检 `packages/sandbox/sandbox-windows-acl/src/runner.ts:110-114`。区间新增的 ACL 诊断技能（`1d56bd5628`/`927b59e138`/`5bab07157f`）只修 ACL，不修消失的临时目录 | 重启 dsh host 重建快照 | #6483（同族 #5034） |
| 6 | exFAT 卷 write 必败（EISDIR）+ 盘根写入 EPERM | `packages/fs/fs-local/src/fsio.ts:633-638`（硬链接发布无回退，默认 `link` `:608`、`throwGuardedCreateFailure` `:536-571`）、`:597-598`（mkdir 不容忍盘根 EPERM）。`fsio.ts` 在本区间**零改动**，行号与上一基线完全一致 | 目标放 NTFS；勿直写盘根 | #5704 #4981（相关 #2402） |
| 7 | Node < 22.19/24.2 安装后静默深埋失败（无友好版本门） | `apps/cli/src/bin.ts:26-27`（区间重构过 bin.ts，但**仍未加**运行时版本检查）；`apps/cli/package.json` 无 engines；仅根 `package.json:8-9`（npm 只警告）；`apps/cli`/`packages/boot` 内无 `process.versions.node` 检查 | 升级 Node ≥ 24.2（或 22.19+）；全局安装替代 npx | #6115 #6124 #6126 |
| 8 | 单个损坏插件条目令所有对话请求 REQUEST_EXTENSION | `packages/llm/llm-deepseek/src/request-extensions.ts:24-29`（该文件已由 `99e22ebbeb` 从 `src/common/` 上移一级；异常一律升级）；`packages/llm/plugin-package-inventory-deepseek/src/index.ts:124`（抛错）；registry 扇出 `packages/llm/deepseek-llm-api-extensions/src/index.ts:108-113`；默认挂载 `packages/bundle/base/cordis.patch.yml:77-78`。区间新增的 `onOmitted` 加固**只覆盖序列化失败**，不覆盖抛错的贡献者 | profile patch 禁用该插件，或修复损坏条目 | #6161（相关 #5683 #5968 #6108） |
| 9 | PTC 模式零参数工具绑定必失败 | `packages/ptc-runtime/ptc-runtime-node/src/bootstrap.ts:326-335`（+ `index.ts:319`）；`json-wire.ts:201`（零参调用得到 `undefined` → `binding arguments must be lossless JSON`）。`packages/ptc-runtime` 源码在本区间**零改动** | 无产品内规避；帖内一行修复未合入 | #6065 |
| 11 | Python SDK 跨进程续接旧会话只跑不落盘 | `packages/sdk/server/src/server.ts:261-294`（旧 `:259-292`；只查进程内表；恒 `agents.create`）；`packages/sdk` 与 `python/` 全树只有 initialize/session-prompt/shutdown 三类 RPC，**无任何 resume** | 同一进程内复用实例循环多轮 | #4591 #5950 #4954（相关 #1414） |
| 13 | `dsh plugin` 子命令无法自愈 profile 依赖（PARTIAL：windowsHide 半侧已消失） | **原引用的 `apps/cli/src/plugin.ts:120-163` 早已不存在**（该文件在**上一基线之前**的 2026-09-14 由 `98b92b683c` 删除）。现子进程在 `packages/boot/plugin-manager/src/operations.ts:357`，走 execa（默认 `windowsHide: true`），故弹窗半侧已消失；**自愈半侧仍在**：`runPluginCommand`（`:544-557`）只转发调用方的 pnpm 参数，boot 提示仍指向 `dsh plugin --profile X install`（`packages/boot/app-boot/src/profile.ts:715`） | 用 `dsh plugin --profile <p> install`（旧建议"手动 pnpm install"已过时） | #5537（#4024） |
| 14 | 插件经 `connection.rpc.handle()` 注册的通道静默失效（405） | `packages/client/connection/src/rpc-host.ts:87`（`const owner = this.ctx`，与上一基线逐字节相同）、`:191-194`（`owner.effect(() => owner.webServer.register(route))`）；inject 现为 `['credentials']`，位置 `packages/client/connection/src/index.ts:89`（旧条目写的 `:69` 在上一基线就已不准）。**caveat**：vendored Cordis 的 accessor 走影子代理，`this.ctx` 是"读取方"的 ctx，故"owner 取服务自身 ctx"的因果表述无法从源码确证，405 症状需要活体复现 | 打社区补丁 cb9b6e2；等上游合并 | #6227（同族 #6270 #6289 #6337 #6513 #6681） |
| 16 | pwsh 沙箱对临时根未加保护的 realpath（RAM 盘报 EISDIR） | `packages/sandbox/sandbox-windows-acl/src/path-boundary.ts:11-13`（`realpathSync.native` 无 try/catch；与上一基线逐字节相同）；对照 `packages/sandbox/sandbox/src/roots.ts:30-41` 已有回退先例（同样未改） | TEMP/TMP 指回物理盘或子目录 | #6018 |
| 17 | 编程式 `agents.create` 缺 model 时静默死轮 | `packages/core/agent-loop/src/index.ts:371`（旧条目 `:421`／报告 `:422-424` 均有偏差；`{{model}}` 仍绑 `context.agent?.options.model` 无 `agentDefaultModel` 回退）；`packages/core/agent-loop/src/agent.ts:581-582` 的 throw 与旧基线一致；webhook 已有回退先例 `packages/webhook/webhook/src/session.ts:63-66` | 先 `agentDefaultModel.currentSelection()` 再显式传 provider/model | #4967 |
| 18 | grep/read 行预览从列 0 截断，2000 字节外的匹配被隐藏 | `packages/fs/tool-fs-search/src/grep.ts:35`、`search-core.ts:324-325`（`kind:'head'`）、`packages/fs/tool-fs/src/read-render.ts:11`（`:70` 同类）——全部未变，行号与上一基线一致。细节：**grep 的截断按字节**（TextRetainer），**read 的截断按字符**（`line.length`） | 单行大文件改用 shell 提取区间 | #4982 |
| 20 | /compact 在 agent 未空闲时一律报「active compaction」，诊断串味 | `packages/compaction/compaction-basic/src/index.ts:428-433`（旧 `:410-416`）；`packages/core/agent-loop/src/agent.ts:183-184`（旧 `:157-158`）；面向用户的文案 `packages/command/command-compact/src/index.ts:29`——三处与旧基线逐字相同 | 等 turn 完全结束再 /compact | #6223 |
| 21 | todo 任务栏在回合中断后永久消失 | `packages/todo/tool-todo/src/index.ts:129`（投影 apply 在 `turn/start` 无条件返回 null；旧 `:140`）、`:133`（`stateVersion: 2`；旧 `:144`）；区间只改了 `DESCRIPTION_*` 文案。修复需 bump 2→3（投影缓存 ver 不匹配即丢弃，`packages/session/session-projection-cache/README.md:81`） | 无产品内规避（模型自觉重写不可靠） | #6524（已并入汇总帖 #6520） |
| 23 | overflow 分支 retainTokens = 0，一次清掉约 98%（手动 /compact 同源） | `packages/compaction/compaction-basic/src/index.ts:299`——overflow 直接 `selectCompactableRange(session, measurement, 0)`（旧 `:281-285`）；手动 /compact 同样是 `0`（`:394-398`）。**新增缓解**：`maxOverflowRetries: 0` 可拒绝这次零保留 pass；后端现已**按 preset 作用域**（`packages/bundle/web-app/presets/*.patch.yml:67-83`，host 树禁用 `packages/bundle/web-app/cordis.patch.yml:527-528`——旧引用的 `:432-439` 已失效） | 设 `maxOverflowRetries: 0`；确认 preset 隔离域确实挂载了 compaction-basic | #5416 #5650 #6672 |
| 24 | tool-result 剪枝跑在压缩选区之前，摘要器输入已失真 | `packages/compaction/compaction-basic/src/index.ts:294-302`（overflow：prune → select）、`:323-331`（pressure：prune → remeasure → select）；剪枝器已是独立包 `packages/compaction/compaction-tool-result-pruner/src/index.ts:136-182` | **（本次新增可用的规避）** 在自己编写的 preset 里**不挂** `tool-result-pruner` 行，或抬高 `thresholdChars` | #5766（相关实测 1:1 剪枝标记，来自 #6520 条目提交者） |
| 25 | 压缩后旧轮推理整段不回传（实测推理占摘要器输入 58.8%） | 压缩交易把选区整体替换为摘要（`packages/compaction/compaction-basic/src/region.ts:173` compactSurfaceRegion + replace 操作 `:506-509`；旧 `:174`/`:472-500`），旧轮 reasoning 位于被替换区间内、不再回传；区间内**没有**新增推理保留路径 | 无产品内规避 | #6480 #6510 #3002（实测证据为准，见 #6520） |
| 26 | token-meter 的 CJK 增量低估（实测 +26% ~ +57%，纯中文样本 1.57×） | `packages/llm/token-meter/src/estimate.ts:13`（CHARS_PER_TOKEN = 4；estimate 只作用于每步增量，总量 provider-anchored）。**上游现已把它记为已知限制**（`token-meter/README.md:154`、`compaction-basic/README.md:257`）——回答社区时按"已知限制"表述，别当未发现的 bug | 无产品内规避；注意按真实用量预算 | #6361 #5632 #6688（实测口径见 #6520） |
| 28 | 读路径 `SessionLogScanner` 默认 `recoverable`：seq gap/损坏行被静默截断，直到后续 turn/end 才重抛（"valid aborted-turn 被当作 no more history"） | `packages/session/session-persistence-jsonl/src/index.ts:964`（无 recovery 实参）；`src/format.ts:404`（默认值）、`:499-503`/`:513-517`（issue 暂存）；gap 逻辑 `session-format-v1-to-v2/src/codec.ts:104-112`；strict 仅 verify 路径 `generation.ts:586,600`。格式已升 V4 但**这条读路径未动**，行为现已被测试钉死（`tests/jsonl.spec.ts:2227-2249`）。新增的相邻守卫：`format.ts:493`（assertV4RowAdmission）、`:468`（assertReleasedV4Relationships） | 备份日志手动修 gap；修复方向=给 `:964` 传 `'strict'` 或暴露 `format.ts` 的 issue | #6562 #3631 |
| 30 | http-proxy 把 `[::1]` 写进子进程 `no_proxy`/`NO_PROXY` → httpx 系 MCP server 崩溃（undici 专用括号项泄漏到子进程 env） | `packages/util/http-proxy/src/policy.ts:33`（LOOPBACK_NO_PROXY 仍含 `['localhost','127.0.0.1','::1','[::1]']`，注释 `:25-32` 自认是为 undici）；env 写入 `install.ts:79-92,113-129`、子进程覆盖 `:262-279`；子进程消费方 `packages/subprocess/subprocess/src/index.ts:75`。**src 在本区间零改动** | env 写入侧只写裸 `::1`，undici 消费处保留括号项（两处消费者分离） | #6655 |
| 31 | 粘贴图片惰性持有 File 快照：剪贴板同步（如微信输入法跨设备复制）后提交时 FileReader NotFoundError | `packages/client/ui-conversation/src/client/service.ts:74-81`（只存惰性 `file`）、`:125-137`（提交时才 FileReader）、`:309-325`（文件类立即上传、图片类惰性）；该文件本区间仅 +6/−2 | 粘贴后立即发送，或拖拽/文件选择 | #6673 |
| 32 | web-fetch NAT64 探测无守卫：无 DNS64 网络（ipv4only.arpa 不解析）下所有双栈主机 fetch 全灭 | `packages/web/web-fetch-http/src/network.ts:90-92`（无 try/catch）、`:113-117`（discoverNat64Prefixes）、`:38`；SSRF 检查独立（现 `:96-108`）。**src 未改动** | 无产品内规避；补丁方向=ENOTFOUND/ENODATA 视为无前缀 | #6664 |
| 29 | 原生 V4 的 `user/message` content **未做校验**（只校验 `source`）→ 手改或插件注入的缺 `content` 行仍在投影层抛错。迁移路径的同类症状已由 `f4a32dbd0a` 修掉（见 §5），这条是**残留面** | 投影读取 `session-turn-outline/src/projection.ts:39`；对照：迁移产物的强校验在 `session-format-v3-to-v4/src/validation.ts:52-129` | 注入 `user/message` 时带完整 `content` | #6686 |

## 2. 疑似误诊（1 项，保留记录，勿当 bug 传播）

| # | 原报问题 | 复核结论（@5badb15） |
|---|---|---|
| 4 | read_image 所有预设一调即失败（cannot get property 'fs' without inject） | **UNREPRODUCIBLE（疑似误诊）**：`packages/fs/tool-fs/src/index.ts:70-72` 与 `read-image.ts:209,263`（旧 `:265`）在本区间**未改动**，`vendor/cordis/src/reflect.ts` 同样未改；真机跑该包真实 spec `vitest run packages/fs/tool-fs/tests/read-image.spec.ts` = **41/41 通过**，而该 spec 正是走 `ctx.inject(['attachments'], …)` + `ctx.tools.execute` 这条路径，且它不在本区间的测试 diff 里。结论：既不是"修复了"，也不是可复现缺陷——遇到同症状请先确认是否被"在未注入 attachments 的上下文里直接调 read_image"之类用法触发，再开帖。 |

## 3. 本世代新核实的问题（社区提出 + 源码/产物双向复核，T1–T11）

> 这一组是 2026-09-15 → 10-06 窗口内社区新开帖、并经**源码或已发布产物**双向复核的问题，之前不在本清单里。T 编号独立，避免与 §1 的编号冲突。

| # | 问题 | 位置 / 证据 | 规避 | 讨论 |
|---|---|---|---|---|
| T1 | **运行中修改 `cordis.patch.yml` 具破坏性**：`dsh-hmr` 精确监听 `profile/package.json`、`profile.patchPath`、`$DSH_HOME/cordis.patch.yml`（`@deepseek-ai/dsh-hmr/lib/index.js:353-376`，0.2.0-rc.2），任何写入（**包括逐字节相同的重写**）都触发重载 | 实测三种后果：① 会话内工具从 **65 → 41**（丢失 `bash`/`edit`/`read`/`write`/`grep`/`glob`/`web_fetch`/`web_search`/`skill`/`subagent_fork`/`workflow`/`todo_write`/`present`/全部 `job_*`，只剩 preset 之外挂载的行）；② 运行中会话的 turn 被杀；③ 重建 `session-controller` 时抛 `file-upload: Agent resolver is already registered`，`sessionController` **永久失效**（只有整进程重启能恢复，之后每次重载同样失败） | **运行中不要写 profile patch**。改配置走 profile 管理入口（`plugin_manager` / `dsh plugin`）而不是手写 YAML；必须手改就先停进程 | #8635 #8857 #8968 |
| T2 | `plugin add` **不补齐既有依赖的 layer 行**：`packages/boot/plugin-manager/src/operations.ts:95`/`:99`（`if (beforeDeps.has(name)) continue`），产物侧同一代码在 `lib/index.js:271`/`:275`（固定 176 行偏移）。后果：`dsh.profile.bundles` 掉了行之后，之后任何 `add` 都不会修回来；"先发布无 `dsh.bundle`、后加上 `dsh.bundle`"的包**永远不会**被登记为 bundle 层，且**第二次尝试不打印任何警告** | 实测仍在 `0.2.1-alpha.1`（源码与产物一致） | 先 `remove` 再 `add`；或手工补 `dsh.profile.bundles` | #7850 #8821 |
| T3 | 宿主插件（Host plugin）激活失败**在 `dsh web` 下不可见**：`Fiber._reload` 捕获异常 → `ctx.logger.error` → 置 FAILED、**不重抛**（`vendor/cordis/src/fiber.ts:646-665`）；`web` profile 没有日志导出器，那行日志**没有 sink**，终端一片空白，而工具/监听器已经静默缺失。`apply()` 返回普通对象只得到 `TypeError('Invalid effect')`，**不报插件名也不报值** | 交叉引用 #5145（同族客户端侧 #7891） | 排障时用 headless/带日志的 profile 复现，或逐个禁用 bundle 二分；社区工具 dsh-composition-doctor 专门把故障关联回组合来源 | #8633 |
| T4 | profile 内安装的 `@deepseek-ai/*` 包会**静默遮蔽**运行时自带版本：解析优先级 `profile > runtime`。最小复现：插件把 `"@deepseek-ai/dsh-settings": "^0.1.0-rc.6"` 写进 **dependencies** → pnpm 装进 profile 的 `0.1.0-rc.8` 盖掉自带的 `0.2.0-rc.2` → `settings service is absent: mount @deepseek-ai/dsh-settings with @deepseek-ai/dsh-config-editor`，桌面端每次崩溃 | `POST /api/settings/describe` 返回 `gateway/internal` | 共享实例的 dsh 包只放 **peerDependencies + devDependencies**，**绝不放 dependencies**（§migration-0.2 §1 的 npm 段同理） | #8862 #8864 |
| T5 | 会话内 **tool-call id 不唯一** → Web Chat/Trajectory 组装器抛 `received more than one start Match` 后**永久停止产节点**（实时与回放两条路径都无降级分支） | `packages/client/ui-conversation/src/client/conversation/assembler.ts` 的 `acceptMatch` | 无产品内规避；自己生成 `callId` 的插件务必全局唯一 | #6520 内提案（XGntsl，对照 `0d1f50007f` 核实）+ ≥10 个独立帖（自 `0.1.1-rc.2` 起） |
| T6 | 含 `turn: null` 的 `step` 块的会话**永远渲染不完**：白屏卡在 "Loading history…"，渲染循环不推进、CPU 升高；而契约检查报 0 违规，官方 `Session` 构造与 `deriveMessages` 都成功 | 渲染路径在无法归属的块上循环 | 无产品内规避 | #6520 内提案（yamingmou） |
| T7 | **桌面端 `cordis` preset 丢失全部文件系统 skill**：preset 唯一的 skill provider 目录指向 `app.asar` 内部（`resolve('@deepseek-ai/dsh-agent-preset/package.json') + /skills`），读取抛 `TypeError: Cannot mix BigInt and other types`；`discoverRoot` **没有 per-root try/catch**，且自定义目录**先于**默认根被扫描，于是一次失败终止整个 provider 的 `list()`——连带丢失项目的 `.dsh/skills` 与用户的 `~/.dsh/skills`、`~/.agents/skills`；`dsh-tool-skill` 又以 `snapshot.complete` 为发布门槛，导致模型侧 skill 目录整体消失（日志里同一条 `skipped` 反复出现即是信号） | `dsh-hooks`/skill provider 链路；`isAbsentSkillPathError` 只吞 `ENOENT`/`ENOTDIR`/`FS_NOT_FOUND`/`FS_NOT_DIRECTORY`，其余错误照抛 | 无产品内规避；把 skill 放默认根而不是 symlink 进 `~/.dsh/skills`（该路径不解决问题） | #8649 #8763 #8996 |
| T8 | 第三方插件在会话观察者里抛异常会**放倒整个宿主**（观察者回调外侧没有隔离边界） | 无 per-listener 隔离 | 自己插件里所有回调 try/catch | #8585 |
| T9 | 插件 `pre-step` 观察监听器返回 `undefined` → **放倒全部会话**（`installModelSelection` 中间件链未加守卫） | `packages/core/agent-loop/**` 选择中间件链 | 观测型监听器要原样返回传入的 decision（改写时用 `{ ...decision, … }`） | #8778 |
| T10 | `dsh plugin` 依赖**系统 pnpm**（不自带）：产物在 `@deepseek-ai/dsh-plugin-manager/lib/index.js` 用 `execa(options.command ?? "pnpm", …)`（L324/517/650/694/733），`pnpmCommand` 默认 `"pnpm"`（L1354），`dsh/node_modules` 里没有 pnpm——PATH 里去掉 pnpm，所有市场安装 `exit 1`，且 UI 可能只显示 `exit 1`。第二个缺陷：`install-spec.js` **校验但不注入版本**，裸包名会被 profile 的 lockfile 解析到旧版（实测 `@latest`、`@^2`、`pnpm update --latest`、`pnpm add …@latest` **全部失败**，只有显式 `@2.8.4` 成功） | 源码级复核 | 保证 PATH 有 pnpm；装包时**显式写版本** | #8905 #8922 #8310 |
| T11 | **组合包升级后大批第三方插件被判不兼容**：`evaluatePluginCompatibility()` 只返回**不满足**的 peer，且**不带任何"哪个版本能满足"的字段**，UI 无法告诉用户该装哪个版本；`minimumReleaseAge`（24h 冷却）让 `pnpm update` 成为静默 no-op、锁文件检查抛 `ERR_PNPM_MINERELEASE_AGE_VIOLATION`（可用 `--config.minimum-release-age=0`，但桌面宿主**拒绝**市场追加的 pnpm 参数）；另有锁文件污染模式：一旦两个 `name@version` 落进 `minimumReleaseAgeExclude`，该 profile 之后**每次**安装都失败 | `packages/boot/app-boot/src/plugin-compatibility.ts` | 插件显式声明两侧 peer 范围（如 `>=0.1.2-rc.1 <0.3.0`）并按版本发版；用户侧遇冷却期用 `--config.minimum-release-age=0` | #8199 #8310 |

**相关但不单列**（同族或用户侧）：#8537 提出 `dsh --profile <name> --ephemeral` 与一等公民 `dsh plugin verify <tarball>`（install → composition check → visibility probe → uninstall → rollback）——正是本仓库 `dsh-plugin-dev verify` 与 `PerryLink/dsh-test-drive` 在做的事；同帖给出 `sanitizeProfile` **按设计**把 profile 的 `cordis.patch.yml` 改名成 `.bak-<timestamp>`（JSDoc 明写 "patches are never parsed"），桌面端 `disableAllPlugins` 走的正是这条路径，实测用户文件 2622 B → 837 B，而 `backupPath` 只在 `console.info` 里打印、**UI 不显示**。#7401 单个 MCP 工具 `inputSchema` 含不支持关键字会**拒绝整个 server**；#7995 v0→v1 迁移拒收写入方唯一会产出的 `subagent/descriptor` version 2；#8836 见 §1 #2（V4 后继形态）；#8904 升级插件后有一个 client entry 没有 fiber → 刷新页面即崩整个应用。

## 4. 次级清单（已核实、优先级较低，6 项）

| # | 问题 | 位置（@5badb15） | 规避 | 讨论 |
|---|---|---|---|---|
| S1 | Python SDK bundled runtime 清单缺 `dsh-attachment-local`（`python/sdk-runtime/package.json:27` 只有 `dsh-attachment`）——**但静态不可复现**：`dsh-base` 把 `dsh-attachment-local` 列为产品依赖（`packages/bundle/base/package.json:42`），且 `scripts/verify-runtime-closure.ts:83-92` 会递归走依赖图，实跑 `pnpm run verify-runtime-closure` **通过**（"4 agent presets and 185 workspace packages form a closed runtime dependency graph"）。**降级为清单一致性观察**：除非有人能在构建出的 wheel 里复现 `ERR_MODULE_NOT_FOUND`，不要再当缺陷传播 | 见左 | 无需规避 | #4377 |
| S2 | 会话列表 RPC 是一次性全量快照，无分页/懒加载 | `packages/api/session-controller/src/index.ts:258-261`（list 忽略 `_request`）、`src/list.ts:131-164`、`src/types.ts:264-271`（cursor 仍只是保留位，无 `nextCursor`） | 拆分工作区/清理旧会话/ssh -C | #6017 |
| S4 | 冷/种子会话列表行回退显示工作区文件夹名 | `packages/api/session-controller/src/client/sessions/service.ts:116-123`（`displayTitleOf` → `workspaceTitleOf(cwd)` → id），调用点 `:620` | 打开会话一次生成标题投影 | #6316 #6207（相关 #3375 #5368） |
| S5 | cordis 组合 skill 里残留已废弃的 `cordis_inspect` 措辞（**PARTIAL**：SKILL.md 正文半侧早在上一基线**之前**就由 `ed32f57f88`（2026-09-16）修好——旧条目引的是 2026-09-10 的 165 行版本，已过时两代） | 残留未修：`packages/extensions/tool-cordis/src/api-catalog.ts:6`、`cordis-client-runner/src/client/slot-catalog.ts:7,74`、`docs/subsystems/slots.md:194`（+.zh）；SKILL.md 现位于 `packages/preset/agent-preset/skills/editing-cordis-compositions/SKILL.md:84`（改名 `d1e22a7e24`）。**注意**：那三个"快照"（`cordis-history ui.expected.md`、`session.v2/v3.jsonl`）是**故意的历史回放/迁移 fixture，不要重新生成** | 文档修复型 PR | #6679 |
| S6 | SIGTERM 无在途 turn 排空路径；5s 宽限硬编码；无 `dsh restart` | `apps/cli/src/process-shutdown.ts:4`（5s）、`:69-75`（第二信号强退）；`profile-boot.ts:269,280-281`；dispose=cancel+whenIdle 现位于 `packages/core/agent-loop/src/index.ts:544-545`（旧 `:594-595`）；`apps/cli/src/args.ts` 里**没有** restart 模式 | 第二信号即强退是固定语义；drain 属 feature request | #6665 |
| S7 | LLM 出站超时修复未合入；undici 全局 dispatcher 由 http-proxy 独占（>5min prefill 在 ~302s 被 body timeout 终止） | `packages/util/http-proxy/src/install.ts:208-213`（`setGlobalDispatcher`）、`new Agent({factory})` `:145-156`（**无 bodyTimeout**）；全库无 `httpBodyTimeoutMs`/`bodyTimeout`/`egress.ts`（新增的 `tests/egress.spec.ts` 只测代理路由）；pi-ai 看门狗 300_000 在 `llm-pi-ai/src/config.ts:47`（按路由覆盖 `:344`）、`adapter.ts:354-355` | 每请求新建 fetch 绕过共享 socket 记账 | #5673 |
| S8 | 创造模式 `cordis_define`/`cordis_run` 动态工具已退役 | `docs/tool-catalog.md` 只剩两个只读检查工具（`cordis_inspect_list`/`cordis_inspect_query`）；运行期创作的替代面 = `plugin_manager` 工具 + `ctx.pluginManager` + `OPTIONAL_BUNDLES` | 0.1.5-rc.2 世代 `docs/tool-catalog.md` 的 `cordis_*` 工具段（旧快照 :269-501）、`docs/capability-seams.md` 的 `ctx.dynamicCordisRunner` | 无（上游工具退役，非缺陷） |

## 5. 已在 master 修复（旧帖一律更新即可，无需改代码）

带 ✅ 的是本次（2026-10-06，基线 `5badb15`）新转入的条目：

- ✅ **纯推理轮以空 content 落盘 → 之后每轮 400、整会话报废（#2）**：`99e22ebbeb` 在区间内把 `llm-deepseek` 的协议平面**压平为 Messages-only**——旧 `src/protocols/chat-completions/serialize.ts` 及其同族 5 文件 / 1255 行被**整体删除（无改名）**，`protocols/messages/*` 上移为 `src/*`；`src/config.ts:206-207` 表明 `protocol:` 键现在**直接抛错**，空 content 分支随之消失。**仍需要的动作**：已被写坏的存量日志照旧要手工修（备份后解压 `session.v3.jsonl.zstd`，删/改占位后重压）；若你依赖显式 `protocol: chat-completions`，删掉该配置项。
- ✅ **升级后旧 `code` 预设会话无法 resume（#5）**：`ff33f79eb1` 在 `session-format-v2-to-v3` 的迁移里把 `code` 映射为 `ptc`（header 与所有 agent-preset/selected，`migration.ts:18`、`:140-151`）。**注意该修复早于上一基线**，旧条目本身已过时。残留属设计：原生 V3/V4 里的 `code` **不会**被重新解释，registry 仍抛 `agent-preset/not-found`（`packages/preset/agent-preset-registry/src/index.ts:207`），且该包在 `d1e22a7e24`（2026-09-21）拆包，无 git 改名配对。存量会话仍建议复制内置 ptc 预设或改绑 standard/ptc。
- ✅ **opencode-go 路由缺 `x-opencode-session` 头 + 缺 4.1-flash 目录项（#10）**：`6ed596f71b` 把 `packages/llm/llm-pi-ai/package.json:44` 的 `pi-ai` 抬到 `^0.87.1`；实测已装 0.87.1 的 `dist/providers/opencode-headers.js` 会设置 `x-opencode-session` 并包装 opencode/opencode-go，目录里也有 `deepseek-v4.1-flash`（仓库侧 patch 不触碰该 wrapper）。
- ✅ **压缩阈值按整窗口算，1M 窗口下高于 provider 实际输入上限（#22）——本次新修复**：`555b664b08` 把阈值改为 `Math.floor(Math.min(contextWindow × ratio, contextWindow − reservedCompletionTokens − headroomTokens))`（`packages/compaction/compaction-basic/src/config.ts:191-194`），新增 `headroomTokens`（默认 `65_536`，`:75`），保留输出在 `index.ts:314-318` 接线；窗口 ≤ `maxTokens + headroom` 时抛 `TargetPressureConfigError`（后续 `ec7030afd3`）。**新公开配置键**：`headroomTokens`、`maxTokens`——旧帖里"按模型覆盖 `thresholdRatio`"的规避可以撤掉。同区间 `llm-deepseek` 的 `src/common/defaults.ts` 由 `99e22ebbeb` 改名为 `src/defaults.ts`（`DEFAULT_CONTEXT_WINDOW`/`DEFAULT_MAX_TOKENS` 仍是 1M/256K）。
- **windowsHide 弹窗族**：`a05b5fbe79` + `cc8099dc5f`；CLI 侧现由 execa 承担（见 §1 #13）。
- **Windows 目录选择器 CJK 截断族**（U+XX00 低字节为 0）：`51c242749a` 重写 readUtf16 → `koffi.decode(..., 'str16')`。覆盖 #643 #1660 #2126 #2227 #3010 #3313。
- **`--expose-internals` HMR 启动失败**：`c685582d54` + `675efe73f2`；loader 回退 `node-addon-require-builtin`。
- **compat.supportsDeveloperRole 可配置**：`884f7b9c41` + `cf4a27c471` + 文档 `30a838cda3`。
- **子代理模型快照 → request-time 选择**：`f76a225a7d`（PR #2663）。
- **pnpm 11 构建失败（npm_execpath）**：`89674edc93`。
- **fs-ext/node-gyp Windows 构建族**：`d927cbff99`（换成预编译 `@deepseek-ai/node-addon-system`）。
- **koffi 32KB 崩溃**：`141d72d7cf`。
- **非 loopback HTTP crypto.randomUUID**：新增 `dsh-util-crypto`。
- **ACP server 已发布**：`dsh --profile acp`。
- **MCP structuredContent 要求条件化**：`e1633fbc3f`（自 0.1.0-rc.7+）。
- **旧 v0→v3 迁移校验**：多处收紧/修复已随 0.1.5-rc 发布（历史会话不可加载先试升级）。
- **轮次导航条（turn rail）load-and-jump**：`b3064cca77` + `6af1ee49b1`。
- **轨迹面板首 token 时间（#6129）**：`e779831f40`（2026-09-14 经 `a85778448a` 进 master）。
- **桌面端打包 payload smoke 引用已移除的 fs-ext（#27）**：`6b05ed53e9`（只进 `dsh-v0.1.6-alpha.2`）；本次复核确认 `apps/desktop/scripts/prepare-dsh.ts` 里已无 `checkFsExt()`。
- ✅ **v0→v3 迁移后 stock 投影读取崩溃（#29）——本次新修复**：`f4a32dbd0a`。telemetry 读取被拍平（`session-telemetry/src/coordinator.ts:273` 现在读 `message.isError`，旧代码读 `message.content[0].isError`），并且**迁移产物在 hydrate 前被强校验**（`session-format-v3-to-v4/src/validation.ts:52-129`，经 `session-persistence-jsonl/src/format.ts:468` 的 `assertReleasedV4Relationships` 接入；拒绝路径 `session-format/src/catalog.ts:231-251`）。症状因此从"hydrate 崩溃"变成"**带明确错误的拒绝加载**"。**残留面**已单列为 §1 的 #29（原生 V4 的 `user/message` content 仍不校验）。
- **运行时 invariants 全部移除（本区间新增的"官方移除"，不是修复）**：`@deepseek-ai/dsh-invariants`、`ctx.invariants`、`<pkg>/invariant` 子路径、整棵 `packages/runtime-diagnostics`、`sdk-minimal` 的五条相关行全部消失；四个 emitter 从重抛改为记录并继续。若你的旧帖/插件依赖它们，见 [migration-0.2.md](migration-0.2.md) §4。
- **Node 版本门槛**：根 `package.json:8-9` engines `^22.19.0 || >=24.0.0`（本区间未变）；实测实际下限 ≈ 24.2（24.0/24.1 有 undefined 报错）。

## 6. 设计行为 / 常见误解（不是 bug，快速对照）

| 现象 | 结论 | 关键位置 |
|---|---|---|
| 本地模型把工具调用输出成 `<DSML\|function_calls>` 文本 | 适配器只解析 `delta.tool_calls`，不解析文本标签；这是服务端职责 | `packages/llm/llm-deepseek/src/translate.ts` |
| 自定义 provider 显示上下文 262k 而非 1M | 262144 是未声明容量时的内置默认假设，可 settings 覆盖 | `packages/llm/llm-pi-ai/src/config.ts:64,330`、`catalog.ts:901` |
| 没填 key 却在扣 DeepSeek 余额 | 默认凭据引用环境变量 `DEEPSEEK_API_KEY`，启动环境只读且优先级最高 | `packages/llm/llm-deepseek-api-key/**`；`packages/credentials/credentials-local/README.md:75-80` |
| web_search 用 deepseek-v4-flash 而非会话模型 | 独立搜索 provider（web-search-deepseek），模型/凭据/端点与聊天分离 | `packages/web/web-search-deepseek/src/provider.ts:38,207-221` |
| `dsh --profile tui` 不存在 | tui 非内置；README 中为示例，社区方案 `dsh plugin --profile tui add github:deepseek-harness/turtle-ui` | `apps/cli/README.md`、`apps/cli/reference/README.md:70-72` |
| `--host 0.0.0.0` 被拒绝 | 刻意不支持（远程代码执行风险）；用 LAN IP + `--trusted-host` 或 SSH 隧道；反向代理部署见 `docs/user/guide/public-deployments.md` | `packages/bundle/web-app/src/startup.ts:74-75` |
| 工具定义每轮都发 | 无「每 N 轮」开关；工具集不变时前缀缓存复用。新增 `ToolSchema.deferLoading: true` 可标记延后加载 | `packages/core/agent-loop/src/agent.ts`；`packages/core/tools/src/index.ts` |
| 同级权限请求报错 | 见 §1 #1（同级已接受，只剩更窄/不受支持的目标抛错） | `packages/sandbox/sandbox/src/escalation.ts:171-179` |
| bash/run_code 的 `description` 必填 | 刻意设计（活动列表/UI 展示用）；空串另有执行期拒绝 | `packages/shell/tool-bash/src/index.ts`；`packages/core/tools/src/ptc.ts`（#3874） |
| 界面 token 远小于计费 | 界面=主会话 usage 之和；子代理独立会话/日志不计入；无费用熔断功能 | `ui-trajectory/src/client/layout.ts:758,952-955`；`subagent-in-process-driver/src/index.ts:113`（#6688） |
| skill 目录监视挡 Windows 插件更新 | `watch: false` 开关已存在（未文档化）；Windows 可用 `watchUsePolling` | `packages/skill/skill-filesystem/src/index.ts:82-83`（#6674） |
| headless 每次运行新会话 | 默认新会话 `session-<uuid>`；`--session-id <id>` 可续跑已存在会话（缺 `sessionPersistence`/`sessionQuery` 会 fail loud）；无"继续最近会话"便捷形式；多轮另可走 Connection RPC/gateway | `packages/bundle/headless/src/index.ts:279,342`；`startup.ts:43-45`（#6677） |
| 想"回退到第 N 轮重跑" | 无原位 rewind；fork 生成新会话继承前缀，边界禁落在开启 turn 内 | `packages/core/session/src/index.ts`；`ui-chat/src/client/locale.ts:71-72`（#6652） |
| 自定义 provider 想调思考强度 | 模型条目声明 `reasoningEfforts`（off/minimal/low/medium/high/xhigh/max）→ thinkingLevelMap；仅 llm-pi-ai | `packages/llm/llm-pi-ai/src/catalog.ts:607,690-743`（#1058） |
| 编译报错引用不存在的导出（如 PersistenceCoordinator） | 旧产物与源码混装，非配置问题；彻底重建 | 常量已改名搬家 `session-query/src/config.ts:12`（#5622） |
| 自动压缩"开始"阶段不可见 | 节点模型已按 lifecycle-first（start=compaction/start）；仅渲染层被 checkpoint 门控 | `ui-chat/src/client/conversation-nodes/compaction.ts:39-45,52-53`（#6675） |
| 插件想写自己的会话事件 | **不要写**：未知类型要带信封 `ignorable: true` 才被接受，而 `Session.append()` 写不了该标记，写入会让会话打不开。改用既有事件推导或 storage 服务 | `packages/core/session/src/types.ts`（`SessionEvent.ignorable`）；官方 `.../cordis-plugin-development/references/practices.md` |

## 7. 相关资源

- 官方汇总帖（社区核实版）：<https://github.com/deepseek-ai/deepseek-harness/discussions/6520>
- 本世代破坏性变更的迁移路径：[migration-0.2.md](migration-0.2.md)
- 官方逐版本迁移指南（原文副本，仓库内**无 index、无入链**）：`references/official-docs/docs/upgrade-guide/**`
- 官方仓库 checkout 路径约定见 [SKILL.md](../SKILL.md)（本知识库以 `D:\deepseek-harness` 为示例）。
- 每项条目引用的讨论号均可拼为 `https://github.com/deepseek-ai/deepseek-harness/discussions/<编号>` 直接查看原始分析。

---

*维护说明：官方有新提交/新回复时，本文件的「仍未修复」条目可能过时——以原帖与官方答复为准；更新时保留基线提交号与核实日期。*
