# 家族工具链路由（family-toolchain.md）

> **这份文件回答**：我的问题该找哪个工具？哪个文档是这项事实的**权威所有者**？
> 以及 `dsh-plugin-dev check` 的 16 项检查和 `dsh-plugin-doctor` 的 33 项检查是什么关系。
>
> **原则**：**一个事实只有一个所有者。** 本知识库只负责"认知 + 索引"，
> 机械检查交给工具；发现重复时**链接**而不是**复述**。
>
> **测量时间**：2026-10-13。

---

## 1. 路由表：问题 → 所有者 → 可引用产物

| 你的问题 | 权威所有者 | 可引用产物 | 命令 |
|---|---|---|---|
| 这个插件包结构对不对？ | `dsh-plugin-doctor` | `SPEC.md`（规范）R0–R8 | `npx @perrylink/dsh-plugin-doctor --only R` |
| 我的 Cordis 用法有没有踩契约？ | `dsh-plugin-doctor` | `SPEC.md` §4.2b，K1–K14 | `… --only K` |
| 装了能不能起来？ | `dsh-plugin-doctor` D 组 / `dsh-test-drive` | D0–D3/D9；test-drive 的四态记录 | `… --only D` |
| 我在各个目录里被收录对了吗？ | `dsh-plugin-doctor` CC 组 | CC1–CC5 | `… --only CC` |
| 我的插件质量几分？ | `dsh-score` | 五维评分 + 排行榜 JSON/MD | `dsh-score <repo\|pkg>` |
| 怎么从旧世代升上来？ | `dsh-plugin-upgrade` | 走廊卡（`legAB` 20 seams / `legC` E1–E5） | `dsh-plugin-upgrade-scan` |
| 共享代码怎么写？ | `@perrylink/dsh-plugin-kit` | `data/peer-range.json`、seam/gate 契约、新插件骨架 | — |
| 社区认证是什么等级？ | `dsh-plugin-certification` + `dsh-cert-mcp` | 五维 A–E、等级 A–D、安全否决 | MCP：`get_certification` |
| 目标宿主这一版有什么？ | **本知识库** | [`version-matrix.md`](version-matrix.md) | `dsh --version` |
| 该改哪一行？ | **本知识库** | [`migration-0.2.md`](migration-0.2.md) | — |
| 官方怎么规定的？ | **本知识库镜像** | `references/official-docs/` | — |

---

## 2. `dsh-plugin-doctor`：33 项检查全表

规范来源是 **`SPEC.md`**（spec `v1`，checkset 字符串
`R0-R8+K1-K14+D0-D3,D9+CC1-CC5/3`），ID 空间**已冻结**（SPEC §3.3）。
共 **33** 项 = 9 (R) + 14 (K) + 5 (D) + 5 (CC)。

> ⚠️ **不要引用 doctor 的 README 核对检查 ID。** README 在 5 处写 `K1–K9` 和"16 checks"，
> 而规范 `SPEC.md` 定义的是 **K1–K14** 和 **21 项规范门禁**——README 在 K10–K14 落地时没更新。
> README 内部还自相矛盾（43 / 41 / 37 仓 vs `data/verified-repos.json` 的 40 条）。

### 2.1 裁定词表（SPEC §2，规范，五种）

| 裁定 | 含义 |
|---|---|
| `pass` | 已评估且成立 |
| `warn` | 已评估、看似违规，**启发式**，需人工复核，**单独不足以定罪** |
| `fail` | 已评估且违规 → 计入失败 |
| `error` | **检查本身无法完成** → 计入失败 |
| `skip` | **未评估** —— **绝不能渲染成 pass** |

正交分类：`critical`（目前仅 `R1`）与 `category` ∈
{`plugin-defect`, `policy`, `not-applicable`, `environment`, `infrastructure`, `unsupported-host`, `unstable`}。
**后四类永远不是插件缺陷**；`policy` 表示这是"家族约定而规范并不共享"（R5、R8）。

**降级规则**（SPEC §3.2，规范）：被请求的组里**每一项都 `skip`**，则该组"未被评估"，
不得报告成功；零检查执行、或组名匹配不到任何东西，同样不得报告成功。
规范里记了理由：**曾经一个写坏的组名让 35 个仓库的 CI 门禁全绿，而实际什么都没查。**

**K 组覆盖模式**（SPEC §3.4，规范披露）：`src`（带 `src/` → 完整预期覆盖）·
`lib-fallback`（无 `src/`，退到 `main` 所在目录 → 真实覆盖但**不等价**，K3–K7 可能少报）·
`none`（都不存在 → 降级）。

### 2.2 R 组 —— 静态 · 包结构（R0–R8）

| ID | 要求 | 裁定 | critical |
|---|---|---|---|
| `R0` | 基础清单字段 `name`/`version`/`license`(SPDX)/`type`；仓内有 `README.md` + `LICENSE` | warn · pass | 否 |
| `R1` | **激活门 `dsh.bundle.patch`** 声明为非空字符串 | fail · pass | **是——唯一 critical** |
| `R2` | tarball 完整性：`npm pack --dry-run --json --ignore-scripts` 成功；文件表含声明的入口**与** patch 文件且都非空；tarball 名 = name+version | fail · pass · skip | 否 |
| `R3` | `cordis.patch.yml` 结构（启发式）：存在、解析为顶层 YAML **数组**；空数组合法；非空必须含 `- insert:` 与 ≥1 个 `id:`；每个 `name:` 等于或命名空间在包名之下 | skip · fail · pass | 否 |
| `R4` | 入口契约：`main`/`exports` 入口存在且同时导出 `apply` 与 `name`；`inject` 是字符串字面量数组 | fail · warn · pass · skip | 否 |
| `R5` | 依赖策略：① 任何位置不许裸 `cordis`/`schemastery`；② 导入的 `@deepseek-ai/cordis` 必须被声明；③ 它必须在 `peerDependencies` **和** `devDependencies`，**绝不** `dependencies`；④ `@deepseek-ai/dsh` 不得是直接 `dependencies` | fail · pass · skip | 否（`policy`） |
| `R6` | `engines.node` 兼容 `^22.19.0 \|\| >=24.0.0`（只声明 Node 23 会失败） | fail · warn · pass | 否 |
| `R7` | `files` 白名单已声明且覆盖入口 + patch；需要构建时入口不得指向源码 | fail · pass | 否 |
| `R8` | 不得有指向已被取代的预发布线的陈旧 peer 范围（`0.1.0-rc.*`、`0.1.1-rc.*`、`0.1.2-alpha.*`、`0.1.3-alpha.*`），也不得有开顶 `>=` 范围 | skip · fail · warn · pass | 否（`policy`；"报告**陈旧**，不是**损坏**"） |

**规范门禁**（SPEC §1）：`R0, R1, R3, R5, R6, R7, R8, K1–K14` = **21 项**，
故意排除 R2 和 R4（它们读的是**构建产物**）。

### 2.3 K 组 —— 静态 · Cordis 契约扫描（K1–K14）

K1–K9 回答"这个插件自身正确吗"；**K10–K14 回答"它会不会干扰别的插件，或被别的插件悄悄吃掉"**。
全部为启发式；没有发现源码文件时一律 `skip`。

| ID | 含义 | 裁定 |
|---|---|---|
| `K1` | 每个 `ctx.<service>` 访问要么是 Context 内建、要么在 `inject` 声明、要么经 `ctx.get(name)` | skip · warn · pass |
| `K2` | **活数据序列化红线** —— 绝不 `JSON.stringify(ctx…)`、`structuredClone(ctx…)`、`{...ctx…}` | skip · **fail** · pass |
| `K3` | 定时器/全局监听被 `ctx.effect`（或 `ctx.on`）包裹，或显式自清理 | skip · warn · pass |
| `K4` | 定义 `Schema` 的文件里不得引入箭头函数 | skip · warn · pass |
| `K5` | `apply` 返回形态（v4 Effect 契约）：disposer 函数、`null`、`undefined`、`Promise<disposer>`、或（异步）可迭代；async `apply` 合法但必须返回 `Promise<disposer>` | skip · warn · pass |
| `K6` | 每个注入的服务名要么是已知宿主接缝、要么带命名空间（含 `.`）、要么是自己 `provide` 的 | skip · warn · pass |
| `K7` | 无 v3 遗留 API：`ctx.using/scope/runtime/lifecycle/collect/accept/decline/alias/off/fork`、`ctx.config`、`ctx.start()/stop()`、v3 的 `inject: {required, optional}` | skip · **fail**（硬名单）· warn（软名单）· pass |
| `K8` | `export const Config` 必须是 Standard Schema 校验器，不是普通对象字面量 | skip · **fail** · pass |
| `K9` | 对象插件不得设 `name: 'apply'`（框架会把它重置为 `undefined`） | skip · warn · pass |
| `K10` | 用 `ctx.on(<waterfall 事件>, …)` 注册的监听器必须引用 `next` | skip · warn · pass |
| `K11` | 注册的工具名不得与宿主内建或保留字 `run_code` 冲突，也不得用 `tools.data.delete(def.name)` + 重新注册的遮蔽写法 | skip · warn · pass |
| `K12` | 传给 `super(ctx, '<name>')` / `ctx.provide('<name>')` 的键不得等于宿主接缝名 | skip · warn · pass |
| `K13` | `cordis.patch.yml` 不得带顶层（非 `insert`）且 `id` 属于宿主的行（按 id 定位的 patch **整行替换 config，不做深合并**） | skip · warn · pass |
| `K14` | **跨仓注入点冲突** —— 任何自有名字（服务键、工具名、命令名、patch `insert` 行 id）都不得与同工作区的兄弟插件仓重复 | skip · warn · pass |

**K14 有规范的"守卫感知豁免"**（SPEC §4.2b）：在 `package.json` 的
`dsh-plugin-doctor.crossPlugin.exempt` 或旁挂 `dsh-plugin-doctor.yml` 里声明
`{kind, name, peer?, guard?}` 列表，`kind` ∈ {`service`, `tool`, `command`, `patch insert id`}；
被豁免的冲突算 `pass`。工作区里少于两个插件仓时降级为 `skip`——
所以随包发布的 CI workflow（不传 `--workspace`）不会因此挂构建。

K10/K11/K13 的参照数据取自上游 `docs/event-producer-consumer.md` 的 `@mode` 列、
工具目录各节，以及基线 DSH `0.2.0-rc.2` 的 `packages/bundle/base/cordis.patch.yml` 顶层 id。

### 2.4 D 组 —— 动态 · 沙箱冒烟（D0–D3, D9）

| ID | 要求 | 裁定 |
|---|---|---|
| `D0` | `npm pack --ignore-scripts` 成功；tarball 写进**沙箱**，不是被测仓库 | fail · pass |
| `D1` | 宿主从 tarball 安装：`dsh plugin --profile headless add <tarball>`（带 `--ignore-scripts`）把包名写进 `dsh.profile.bundles` | skip · fail · pass |
| `D2` | `dsh --profile headless --dump-config` 输出层标记 `# == <package name>` | skip · fail · pass |
| `D3` | **无密钥 headless 冒烟（`MISSING_CREDENTIAL` 判据）**：无凭据时以**退出码 1 + `dsh: MISSING_CREDENTIAL`** 结束（有凭据环境下退出 0 也算 pass）。明确致命：`NO_ADAPTER`、`ERR_MODULE_NOT_FOUND`、`SyntaxError`、`TypeError`、`ReferenceError`、`Cannot find module` | skip · fail · pass |
| `D9` | **沙箱隔离** —— 沙箱被隔离而非删除；运行打印隔离路径；删除是单独显式步骤 | pass · fail |

D1 里"不是插件缺陷"的情形：缺 `pnpm`/`npm`（`infrastructure`）、宿主版本装不上（`unsupported-host`）、
pnpm `ignored-builds` 阻断（`environment`，报为 `skip`）。

### 2.5 CC 组 —— 生态 · 目录收录（CC1–CC5）

渠道数据缺失时一律 `skip`，**永不判失败**。

| ID | 要求 | 裁定 |
|---|---|---|
| `CC1` | 认证注册表 spec v1：若已收录，条目需带 `grade`、`snapshot` 和五维（`manifest`、`buildHygiene`、`supplyChain`、`releaseIntegrity`、`installSmoke`）的 `evidence`，无 `veto`，且 `installSmoke ≠ install-fail` | skip · warn · pass |
| `CC2` | `adp-list` 条目：`url`/`name`/`category` 齐备；`category` 在 **23 值枚举**内；`url` 与仓库一致；`description.en` 单行；`tarball` 若存在须是 GitHub Release 上的 `https` `.tgz` | skip · fail · pass |
| `CC3` | `dsh-catalog` 条目：`npm`/`repo`/`displayName`/`categories`/`summary` 齐备；`repo` 一致；`categories` 非空数组；`summary` ≤1000 字符、不含安装命令文本、且未被截断（须以标点结尾） | skip · fail · pass |
| `CC4` | `dshWorkshop` 清单：若声明，`lifecycle.activation` 必须是**五个枚举值**之一 | skip · fail · pass |
| `CC5` | **家族三重门——规范明说"这不是生态标准"**：Apache-2.0 许可、五语 README、三种 seam 角色，由 `dsh-plugin-kit` 校验 CLI 检查。非 PerryLink 工作区报 `skip`（`not-applicable`） | skip · fail · pass |

> **CC4 的五个值**（doctor SPEC 断言，但**只有 doctor 的 `SURVEY.md` §1.5 列出了它们**）：
> `immediate`、`hot-reload`、`restart-plugin`、`restart-profile`、`restart-host`；
> `restartRequired` 判据为 `/^restart-/`。

### 2.6 退出码契约

| 码 | 含义 |
|---|---|
| `0` | 无 fail/error，且每个被请求的组**真的跑过** |
| `1` | 存在 fail/error（插件缺陷） |
| `2` | 用法错误 / 未知组 / 未知选项 |
| `3` | 基础设施错误 |
| `4` | 宿主版本不支持，**不是插件裁定** |
| `5` | 结果不稳定，步骤超时或被杀 |
| `6` | **降级（degraded）**——被请求的组从未真正运行 |

`--allow-degraded` 把 6 降为 0，但 JSON 里 `degraded` 字段仍非空。
**两道防假绿**：`--only` 组名匹配不到 → 立即 `2`；被请求的组全部 `skip` → `6`。

**组别名**：`R` = R0–R8，`K` = K1–K9 *(README)* / **K1–K14** *(SPEC，以此为准)*，
`D` = D0–D3/D9，`CC` = CC1–CC5。**建议用 ASCII 别名**——
一个被双重错误编码的 CJK 组名匹配不到任何东西（这正是 35 仓假绿的成因）。

---

## 3. 六项检查族的交叉对照

| 工具 | 检查项 | 层级 | 与本库的关系 |
|---|---|---|---|
| `dsh-plugin-dev check`（**本库**） | **16** 项 | 静态 | 每项经 `src/cli/skill-sections.ts` 链回本知识库章节 |
| `dsh-plugin-doctor` | **33** 项（规范门禁 21） | 静态 + 动态 + 生态 | 超集；R8 与我们的 `manifest-peers` 重叠但**更严**（查开顶区间与陈旧线） |
| `omdsh-dev/dsh-plugin-check` | **33** 项（README 只列 26） | 静态 | 独立实现，基线停在 0.1.5-rc.1 |
| `dsh-session-health` | 11 项检测 ID | 静态 | 会话文件层面 |
| `dsh-security-audit` | 6 个 action | 静态 | 四态诚实模型（skipped/error 永不记为 pass） |
| `dsh-cert-mcp` / certification | 5 维（A–E） | 生态 | 认证等级 A–D + 安全否决 |

### 3.1 本库 `dsh-plugin-dev check` 的 16 项 ID

`patch-valid` · `patch-ids-unique` · `manifest-bundle-patch` · `manifest-main` ·
`manifest-peers` · `manifest-engines` · `manifest-files` · `manifest-package-manager` ·
`display-meta` · `readme-five-langs` · `readme-consistency` ·
`redline-persona-role` · `redline-waterfall-next` · `redline-no-hardcoded-tunables` ·
`redline-effect-registration` · `redline-async-apply-registration`

### 3.2 与 doctor 的对应关系（谁更严就用谁）

| 本库检查 | doctor 对应 | 说明 |
|---|---|---|
| `patch-valid` | `R3` | doctor 额外要求 `name:` 命名空间在包名之下 |
| `patch-ids-unique` | `K13` | doctor 从"重复"扩展到"是否占用宿主 id" |
| `manifest-bundle-patch` | `R1` | **R1 是唯一 critical**，我们的是普通 fail |
| `manifest-main` | `R4` | doctor 还查导出是否含 `apply` + `name` |
| `manifest-peers` | `R5` + `R8` | **doctor 更严**：查裸 `cordis`、查 `dependencies` 误置、查陈旧线与开顶区间 |
| `manifest-engines` | `R6` | — |
| `manifest-files` | `R7` | — |
| `manifest-package-manager` | — | 本库独有 |
| `display-meta` | — | 本库独有（doctor 无展示元数据检查） |
| `readme-five-langs` | `CC5`（仅家族内） | doctor 只在 PerryLink 工作区查 |
| `readme-consistency` | — | 本库独有 |
| `redline-persona-role` | — | 本库独有 |
| `redline-waterfall-next` | `K10` | 重叠 |
| `redline-effect-registration` | `K3` + `K5` | doctor 拆成两项 |
| `redline-async-apply-registration` | `K5` 部分 | ⚠️ **我们是家族内该缺陷的唯一检测器**——`dsh-plugin-upgrade` 的 `legC` W0 卡明确点名"guide async-apply lint"作为 E2 的预防门。doctor 只查返回形态 |
| `redline-no-hardcoded-tunables` | `K8` 部分 | doctor 查 `Config` 是否 Standard Schema |

> **结论**：**我们的 16 项是 doctor 33 项的子集，但有 5 项 doctor 没有**
> （`manifest-package-manager`、`display-meta`、`readme-consistency`、
> `redline-persona-role`、`redline-async-apply-registration`）。
> 两者**不是替代关系**：本库的检查**每一项都链回可读章节**，doctor 的检查**有裁定语义与退出码契约**。
> 严肃发布请**两个都跑**。

---

## 4. 规范事实：只认一个所有者

| 事实 | 所有者 | 值 |
|---|---|---|
| canonical peer 区间 | `dsh-plugin-kit` → `data/peer-range.json` | 六子句（见 [version-matrix.md](version-matrix.md) §4.1） |
| 家族花名册 | `dsh-plugin-kit` → `data/repos.json` | **95 条**（94 插件 + 1 基建）；活跃 87 / 冻结 5 / 退役 3 |
| 家族检查 ID 空间 | `dsh-plugin-doctor` → `SPEC.md` | 33 项，已冻结 |
| 认证等级定义 | `dsh-plugin-certification` → README（即规范） | 五维 A–E，等级 A–D |
| 认证注册表内容 | 同上 → `data/certified.json` | 截至 2026-10-13：**仅 1 条**（`dsh-auto-review`，A 级，快照 2026-09-07） |
| 已核验仓名单 | `dsh-plugin-doctor` → `data/verified-repos.json` | **40 条** |
| 升级走廊与 seam | `dsh-plugin-upgrade` | `legAB` 20 seams；`legC` E1–E5 |
| DSH 版本谱系与 peer 区间选择 | **本知识库** | [`version-matrix.md`](version-matrix.md) |

> ⚠️ **花名册计数存在五个互相冲突的说法**，引用前先看日期：
> `data/repos.json`（2026-10-12）95 条 · certification README 94/86 · doctor README 42/34 ·
> doctor 自己的表 45 行 · `dsh-catalog` README 自相矛盾（开头 96 / 计数节 42）·
> `dsh-kit` README "87 活跃 + 5 冻结 = 92"。
> **以 `data/repos.json` 为准**；本库 `guide/when-to-retire-a-plugin.md` 的
> "44 仓 / 7 冻结"是 **2026-10-05 那次审计的快照**，测的是不同时点，**不要直接换算**。

---

## 5. 本知识库在家族里的位置

```
                        认知层（读）                    机械层（跑）
                  ┌──────────────────────┐      ┌──────────────────────────┐
   官方契约 ──────┤  dsh-plugin-guide    │      │  dsh-plugin-doctor       │ 33 项，有裁定语义
   + 版本谱系     │  （本库）             │      │  dsh-test-drive          │ 隔离冒烟
   + 迁移叙事     │  guide/ + references/ │      │  dsh-score               │ 五维评分
   + 踩坑档案     │  + dsh-plugin-dev    │      │  dsh-cert-mcp            │ 认证查询
                  │    check（16 项）     │      │  dsh-plugin-upgrade      │ 走廊扫描
                  └──────────────────────┘      └──────────────────────────┘
                            ↑                                  ↑
                       回答"为什么/该改哪"                回答"过没过/几分"
```

**分工一句话**：本库负责**认知**（为什么、该改哪一行、这一版有什么），
工具链负责**判定**（过没过、几分、能不能装）。**两者都链到本库章节**——
`dsh-plugin-dev check` 经 `src/cli/skill-sections.ts`，
`dsh-plugin-upgrade` 的 `legC` 卡直接点名本库的 async-apply lint。

---

## 6. 未核事项

- `dsh-plugin-doctor` 的 `--dsh` 默认值：README 兼容性单元格写 peer 下界 `0.1.2-rc.1`，
  用法注释却写 npm latest——**两处冲突**。
- SPEC checkset 字符串里的 `/3` 含义未确认。
- CC2 的 23 值 `category` 枚举**家族内无人发布完整列表**（doctor 的 `adp-list` 可导出）。
- `data/verified.json`（区别于 `verified-repos.json`）当前内容未读。
- 本表**未执行任何家族工具**；所有行为描述均为**文档化行为**，非实测行为。
