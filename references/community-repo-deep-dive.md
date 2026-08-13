# 社区插件开发仓库深读

> 对 15 个 DeepSeek Harness 插件开发社区仓库的逐仓库源码深读。源码副本位于
> `dsh-plugin-guide/downloads/community-repos/<repo>/`；本文所有文件路径均为相对各仓库根目录的路径
> （即 `community-repos/<repo>/` 之下），不重复书写 `downloads/community-repos/` 前缀。
> 术语保留英文（bundle / profile / cordis.patch.yml / `dsh.bundle` / repository-plugin 等）。
> 阅读范围：README / SKILL.md / docs/ / references/ / package.json / cordis.patch.yml / 关键源码 / 测试；
> 跳过 `node_modules` / `.git` / `dist` / `build` / `lib` / `coverage` 产物（但把“是否入库产物”作为一个事实记录）。
> 本文是 `guide/plugin-dev-guide.md` §7.3 与 `guide/quick-reference.md`“社区实测坑速查”的**全文证据与出处**。

---

## 0. 总览表

> “文件数”为排除 `node_modules/.git/dist/build/lib/coverage` 后的非产物文件数（本机 `Get-ChildItem -Recurse` 统计，
> 与下载日志 `_download.log` 的 tarball 文件数略有出入）。仓库按“对插件开发者重要性”排序。

| # | 仓库（owner/repo） | 定位 | 形态 | 语言 | 安装方式 | 文件数 | 亮点 |
|---|---|---|---|---|---|---|---|
| 1 | omdsh-dev/**plugin-template** | 自包含独立插件模板 | scaffold + 7 个仓库本地 skill | TypeScript/ESM | `pnpm install`；bundle 经 `dsh plugin add` | 46 | src 四文件结构 + `./invariant` 伴生 + tsdown 双构建路径 + `verify:self-contained` 边界校验 |
| 2 | omdsh-dev/**dsh-plugin-dev** | 踩坑与做法档案 | skill + 文档 | Markdown | 拷入 skills 目录 | 9 | 20 个实测坑（cordis 双副本 / tsconfig 三件套 / Windows junction / 多帧 zstd / `DSH_PERMISSION_MODE` 等） |
| 3 | Opr4Mp3r/**deepseek-harness-plugin-from-scratch** | 代码审计式渐进教程 + 可安装示例 | 教程 + bundle | TypeScript | `pnpm install`；`pnpm pack` 后 `dsh plugin add` | 48 | checkpoint 生成器 + 17 反模式 + 5 层测试证据 + 交付检查单 |
| 4 | omdsh-dev/**dsh-plugin-skills** | 写/测插件的 agent skills | skill（纯 Markdown） | Markdown | `cp -r` 到 `.agents/skills/` | 11 | 5 种能力形态各配一份自包含 reference + 测试分层决策表 |
| 5 | vlln/**plugin-registry** | 插件生态基建：薄控制台 + 开发引导 | bundle（console 包）+ docs + skill | TypeScript | `dsh plugin --profile web add "github:vlln/plugin-registry#main&path:/packages/plugin/console"` | 63 | 记录 repository-plugin 0809→0811 全时间线；bundle vs 纯插件双通道对比 |
| 6 | omdsh-dev/**dsh-plugin-check** | 插件健康检查工具 | tool-bundle | TypeScript | `dsh plugin --profile web add "C:/path/to/dsh-plugin-check"` | 27 | `plugin_check` 工具 36 项检测项（清单/patch/构建/生态/hub）按形态分流 |
| 7 | whyihaveyou/**dsh-suite** | 双语插件目录 + 脚手架 + 自研插件 | monorepo（脚手架 + 3 个第一方插件） | JS/TS | `npm create dsh-plugin@latest`；`dsh plugin add <pkg>` | 79 | 167+ 插件目录带日检兼容徽章 + `create-dsh-plugin` 三模板 + 15 条设计准则 |
| 8 | omdsh-dev/**fabric** | MC-Fabric 风格 hook 处理器 | 3 包 workspace + bundle 载体 | TypeScript | `dsh plugin --profile web add github:dsh-external/fabric` | 91 | Orchestrion-JS 加载期代码变换；`before/after/around/replace` 四操作 |
| 9 | randerous/**dsh-turn-meta** | 最小首插件范例 | monorepo 包 | TypeScript | npm/tarball（`workspace:^` 依赖） | 11 | `agent/pre-step` `{prepend:true}` waterfall 注入 + source 归属 + `./invariant` 伴生 |
| 10 | bobleer/**deepseek-harness-plugin-mcp** | 把 DSH 插件发布给外部 agent 的 MCP server | 双入口 npm 包（stdio/HTTP MCP + DSH bundle） | TypeScript | `npx deepseek-harness-plugin-mcp`；`dsh plugin add github:bobleer/...` | 46 | Catalog/Profile/Runtime 三平面；`ctx.tools`→MCP 工具桥接 + `tools/change` 联动 |
| 11 | Nagi-ovo/**dsh-find-plugins** | 找插件/装插件 agent skill | skill（SKILL.md + script） | Markdown + Node ESM | 拷入 skills 目录 | 5 | 身份 = `dsh-plugin` topic；bundle/cordis/skill 四类装法优先级 |
| 12 | omdsh-dev/**dsh-hub-workshop** | 插件市场/注册 workshop | 静态站点 + JSON feed/schema + CF Worker | HTML/JS + JSON Schema | 无需安装（feed 站点） | 60 | “发现 ≠ 安装权限”信任边界；40 位不可变 commit 准入；registry 安装权威当前为空 |
| 13 | AdamPlatin123/**awesome-dsh-plugins** | 生态情报/兼容性雷达 | 情报仓库（报告 + 脚本） | bash/python/Markdown | 无需安装 | 1556 | 288 仓每日 mainline 四维兼容引擎 + 两代格式对照 + 12 条安全清单 |
| 14 | bruc3van/**awesome-dsh-plugin** | 双语精选 catalog | catalog + JSON Schema + 生成器 | Python | 无需安装 | 11 | 严格 JSON Schema + 强制双语 `localizedText` + CI `--check` |
| 15 | Alex-Yanggg/**awesome-DSH-plugin** | 使用者场景导航 + 全量 topic 快照 | 数据 JSON + 生成器 | Node.js ESM | 无需安装 | 10 | 场景化“套装”推荐 + 212 仓机器快照（含 star/license/语言） |

---

## 1. 每个仓库的详细分析

### 1.1 plugin-template（omdsh-dev/plugin-template）— 自包含独立插件模板（重要性最高）

- **目的**：提供一个“仓库内一切开发输入都在根目录之下”的最小 DSH 插件模板，把
  `src/index.ts` / `config.ts` / `runtime.ts` / `invariant.ts` 与 `tests/harness.ts` 的职责边界固定，
  并随模板配送 7 个仓库本地的开发 skill。README 开头即声明：
  > "A self-contained standalone repository template for an ESM Cordis plugin. Every source file, compiler setting, test fixture, contributor instruction, skill, and build helper used by the repository is inside this directory…"（`README.md`）
- **结构**：`src/{index,config,runtime,invariant}.ts`；`tests/{harness,plugin.spec}.ts`；`scripts/{extract-patch,patch.sh,prepare,verify-self-contained}.mjs`；`patches/README.md`；`docs/dsh-plugin-contracts.md`；`.agents/skills/dsh-plugin-{development,plan,scaffold,implement,compose,test,release}/`；`tsconfig.{base,json,vitest,prepare,prepare.dts}.json`；`tsdown.config.ts` + `tsdown.prepare.config.ts`。**不入库产物**：`.gitignore` 明确忽略 `lib/ node_modules/ *.tsbuildinfo *.tgz coverage/ .pnpm-store/`。
- **约定与代码模式**（关键 snippet）：

  插件入口（`src/index.ts`，命名导出、无 default）：
  ```ts
  export const name = 'plugin-template'
  export const inject: string[] = []
  export { Config } from './config.ts'
  export type { ResolvedConfig } from './config.ts'
  export { apply } from './runtime.ts'
  export type { PluginRuntime } from './runtime.ts'
  ```

  配置 schema（`src/config.ts`，Schemastery `z<Config>` + 直调默认值）：
  ```ts
  export interface Config { message?: string }
  export interface ResolvedConfig { message: string }
  export const Config: z<Config> = z.object({
    message: z.string().default('DSH plugin template loaded'),
  })
  export function resolveConfig(config: Config = {}): ResolvedConfig {
    return { message: config.message ?? 'DSH plugin template loaded' }
  }
  ```

  bundle manifest（`package.json`）与 `cordis.patch.yml`（含 invariant 伴生行）：
  ```json
  { "dsh": { "bundle": { "patch": "./cordis.patch.yml" } } }
  ```
  ```yaml
  - insert:
      - id: plugin-template
        name: '@your-scope/dsh-plugin-template'
        config: { message: DSH plugin template loaded }
      - id: plugin-template-invariant
        name: '@your-scope/dsh-plugin-template/invariant'
  ```

  invariant 伴生（`src/invariant.ts`，经 `ctx.get('invariants')` 取窄接口注册）：
  ```ts
  export const name = 'plugin-template-invariant'
  export const inject = ['invariants']
  export const apply = (ctx: Context): Promise<() => void> =>
    Promise.resolve(getInvariantRegistry(ctx).register(PACKAGE_NAME, install))
  ```

  测试（真实 Cordis 挂载 + Loader 解包断言，`tests/harness.ts`、`tests/plugin.spec.ts`）：
  ```ts
  export async function createPluginHarness(config: plugin.Config = {}) {
    const ctx = new Context()
    const info = vi.spyOn(ctx.logger, 'info').mockImplementation(() => undefined)
    const fiber = await ctx.plugin(plugin, config)
    // ... dispose(): fiber.dispose() then info.mockRestore()
  }
  ```
  ```ts
  it('preserves the function-plugin namespace through Loader unwrapping', () => {
    expect('default' in plugin).toBe(false)
    const unwrapped = Object.create(Loader.prototype).unwrapExports(plugin)
    expect(unwrapped.name).toBe('plugin-template')
    expect(unwrapped.inject).toEqual([])
    expect(unwrapped.Config).toBeDefined()
    expect(typeof unwrapped.apply).toBe('function')
  })
  ```

  package.json 关键字段（`package.json`）：`"type":"module"`、`"packageManager":"pnpm@11.7.0"`、
  `"engines":{"node":"^22.19.0 || >=24.0.0"}`、`main: lib/index.js`、`types: lib/types/index.d.ts`、
  `exports` 含 `.`/`./invariant`/`./src/*`/`./package.json`、`files: [lib/index.js, lib/invariant.js, lib/types/**/*.d.ts(+map), src, cordis.patch.yml]`、
  `peerDependencies: { cordis: ^4.0.0-rc.7, schemastery: ^3.18.0 }`、`devDependencies` 含 `@cordisjs/plugin-loader`、`tsdown`、`vitest`、`unrun`。
  scripts：`build: tsc -b && tsdown`、`test: vitest run`、`typecheck: tsc -b --pretty false && tsc -p tsconfig.vitest.json --pretty false`、`prepare: node scripts/prepare.mjs`、`verify:self-contained`、`extract:patch`、`patch:host`。

  tsconfig 三件套（`tsconfig.base.json`，与 omdsh-dev/dsh-plugin-dev 坑 2 完全一致）：
  ```jsonc
  { "target": "ES2024", "module": "ESNext", "moduleResolution": "bundler",
    "declaration": true, "sourceMap": true, "declarationMap": true,
    "composite": true, "incremental": true, "skipLibCheck": true, "esModuleInterop": true,
    "allowImportingTsExtensions": true, "rewriteRelativeImportExtensions": true,
    "strict": true, "noUncheckedIndexedAccess": true, "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true, "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true, "noUnusedParameters": true, "types": ["node"] }
  ```
  `tsconfig.json`：`extends base` + `rootDir: src` + `outDir: lib/types` + `include: ["src"]`。

- **记录的坑**（verbatim，带根因+修法）：
  - **函数插件不得加 default export**：`README.md` — "Do not add a default export to a function plugin. Cordis Loader unwraps `exports.default ?? exports`; a stray default export discards namespace exports such as `inject`, `Config`, and `apply`."
  - **id 定向 patch 是整行替换 config，非深合并**：`docs/dsh-plugin-contracts.md` — "An id-targeted override replaces the complete `config`, so retained fields must be restated."（`cordis.patch.yml` 内注释同义）
  - **`!!js` 只在 plugin `config` 下合法**：`.agents/skills/dsh-plugin-implement/SKILL.md` — "JavaScript interpolation is permitted only under plugin `config` in DSH composition."
  - **pnpm ≥10 阻止 prepare（allowBuilds）**：`.agents/skills/dsh-plugin-compose/SKILL.md` — "pnpm 10 and later block dependency lifecycle builds until allowed … print the exact `allowBuilds` key. Add only that printed key to the profile's `pnpm-workspace.yaml`, then rerun."
  - **禁用 `link:`/`file:` 依赖与越界路径**：`scripts/verify-self-contained.mjs` 用正则拒绝非 registry spec 与离开仓库根的代码/编译器/Markdown 链接/symlink（`if (/^(?:file|link|portal|workspace|git\+|https?):/i.test(spec) || spec.startsWith('.') || isAbsolute(spec)) { failures.push(...) }`）。
  - **host patch 三条裁剪规则**：`patches/README.md` — `keep actual code` / `drop documentation` / `drop what the official registration system handles`（`.patch` 不随包发布、不进 `pnpm-workspace.yaml`）。
- **安装/发布指令**（verbatim）：
  ```sh
  pnpm install && pnpm run verify:self-contained && pnpm run typecheck && pnpm test && pnpm run build && pnpm run prepare
  pnpm run prepare && pnpm pack --dry-run --json && pnpm run build   # 分发前
  dsh --profile <profile> --dump-default-config
  dsh --profile <profile> --dump-config
  ```
  本仓库未使用 `github:owner/repo#ref&path:...` 全形 git 安装语法；安装形态统一描述为
  `dsh plugin --profile <p> add <spec>`（`patches/README.md`、`scripts/patch.sh`）。
- **.dsh-plugin / repository-plugin 机制演变**：无。通篇只描述现代 bundle 机制（`dsh.bundle.patch`→`cordis.patch.yml`），无 `.dsh-plugin` / `repository-plugin` / `dsh.plugin.json` 字样。

### 1.2 dsh-plugin-dev（omdsh-dev/dsh-plugin-dev）— 踩坑与做法档案

- **目的**：把 DSH 公测期（dsh-external 组织）插件开发的真实踩坑固化下来；`README.md` 自述
  “记录自 DSH 公测期间的插件开发实践：vendor cordis 双副本、tsconfig 三件套、Windows junction、多帧 zstd API……”。
- **结构**：`skills/dsh-plugin-dev/SKILL.md` + `references/{overview,tool-plugin,build-pitfalls,bundle-patch,testing,publish}.md`；`README.md`/`README.en.md`（无 package.json）。
- **一句话总纲**（`SKILL.md`）：
  > "工具插件 = cordis 插件包 + `cordis.patch.yml`（bundle 形态）挂进 profile 就生效；但 bundle 不是唯一形态——registry（dsh.plugin.json）/ skill（SKILL.md）/ collection（catalog.json）各有合法协议，按需求选型"
- **工具插件 package.json 与入口**（`references/tool-plugin.md`）：
  ```jsonc
  {
    "name": "@deepseek-ai/dsh-tool-xxx",
    "main": "lib/index.js", "types": "lib/types/index.d.ts",
    "scripts": { "build": "tsc -p tsconfig.json", "prepack": "npm run build", "test": "vitest run tests" },
    "peerDependencies": {
      "@deepseek-ai/dsh-tools": "^0.0.1-rc.1",
      "@deepseek-ai/cordis": "^4.0.1-rc.1",
      "@deepseek-ai/dsh-invariants": "^0.0.1-rc.1" },
    "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
    "files": ["lib", "src", "cordis.patch.yml"]
  }
  ```
  ```ts
  import type { Context } from '@deepseek-ai/cordis'
  import { defineTool } from '@deepseek-ai/dsh-tools'
  export const name = '@deepseek-ai/dsh-tool-xxx'
  export const inject = ['tools']
  export function apply(ctx: Context): void {
    ctx.tools.register(defineTool({
      name: 'xxx', description: '…',
      parameters: { action: { type: 'string', required: true, enum: ['a','b'] } },
      output: { schema: { type: 'string' }, render: (_a, v) => [{ type: 'text', text: v }] },
      execute: args => Promise.resolve(runAction(args)), timeoutMs: 2000,
    }))
  }
  ```
- **20 个实测坑**（`references/build-pitfalls.md`，每条含现象/根因/修法；节选最关键）：
  - 坑 1 **cordis 双副本 → `Property 'tools' does not exist on type 'Context'`**：根因 “DSH monorepo vendor 了 cordis（`vendor/cordis`）……插件若从 `node_modules/.pnpm/cordis@.../` 副本解析，TypeScript 把两个物理副本视为两个不同模块，`@deepseek-ai/dsh-tools` 的 `declare module 'cordis'` 增强无法合并”。修法：构建期 junction 到 `<monorepo>/vendor/cordis`；npm rc.1 路径全链 scoped `@deepseek-ai/cordis`。
  - 坑 1b **Windows junction 只有 PowerShell 成功**：`ln -s` → `Operation not permitted`；`cmd /c mklink /J` → MSYS 参数转换破坏 `/J`；`powershell -NoProfile -Command "New-Item -ItemType Junction ..."` ✅。`@types` 不能整体 junction（内部是 pnpm 符号链接），须直达 `.pnpm/@types+node@22.20.0/node_modules/@types/node` 真实路径。
  - 坑 2 **tsconfig 三件套**：`allowImportingTsExtensions: true`（否则 TS5097）、`rewriteRelativeImportExtensions: true`（否则产物 `lib/index.js` 残留 `./x.ts` 导入→运行时 ESM 崩溃）、`lib: ["ES2024"]`（否则新 API TS2550）。
  - 坑 6 **多帧 zstd 会话文件**：dsh 会话每批追加一个新 zstd frame（0808 起 200ms 窗口；19MB 会话 ≈ 12 万帧），单帧 API `decompressZstdFrame` 误判“只有 header”。修法：
    ```ts
    import { scanZstdFrames, createZstdFrameDecoder } from '@deepseek-ai/dsh-session-persistence-jsonl/src/zstd.ts'
    const { frames } = scanZstdFrames(buf)
    for (const f of createZstdFrameDecoder().decode(buf, frames)) { /* 逐帧 */ }
    ```
  - 坑 7 **DSH_* 环境变量层**：“`DSH_*` 特殊变量放 `~/.dsh/.env` 会导致启动报错（启动方式相关变量必须由运行环境传入）；凭据已迁移到 `$DSH_HOME/.credentials.yaml`。”
  - 坑 8 **tsc 报错仍 emit**：`noEmitOnError` 默认 false；修法 `tsc ... || exit 1` 或 `--noEmitOnError`；构建后 `grep -rE "from './[^']+\.ts'" lib/` 验证无 `.ts` 残留。
  - 坑 13 **Windows 路径分隔符**：`path.resolve()` 返回反斜杠，与外部正斜杠比较恒 false → “路径逃逸”误报；比较前两侧都 `resolve()`。
  - `README.md` 环境基线表还含 **`DSH_PERMISSION_MODE=danger-full-access` ⚠️ 高风险**：“Windows 无沙箱后端（bwrap/Landlock/Seatbelt），仅此模式可启动，且禁用审批提示——只应在可信的本地开发机临时使用；不要写进项目模板、CI 或共享机器”；以及 **MSYS 路径转换**：“启动用 `~/.local/bin/dsh` wrapper（不要直接跑 `bin/dsh`——Windows 下 MSYS 路径转换触发 `ERR_UNSUPPORTED_ESM_URL_SCHEME`，issue #388；wrapper 用 `file://` URL 启动 tsx 规避）”。
  - 坑 14（plugin-check 审查轮教训）：“先定形态矩阵，再写规则……registry 原生插件可只有 `dsh.plugin.json + index.mjs`；bundle 可插入多个包，patch name 与包名不一致是合法的。”
- **安装/发布指令**（verbatim，`references/bundle-patch.md`、`SKILL.md`）：
  ```sh
  dsh plugin --profile web add "C:/Users/admin/Desktop/dshext/dsh-tool-xxx"
  dsh plugin --profile headless add "C:/Users/admin/Desktop/dshext/dsh-tool-xxx"  # dsh run 默认用 headless
  dsh --profile web --dump-config | grep tool-xxx
  dsh run "用 xxx 工具做一次端到端任务"
  ```
  npm rc.1 路径：`npx -p @deepseek-ai/dsh@0.0.1-rc.1 dsh web` → `npm pack` → `dsh plugin --profile compat add ./<pkg>.tgz`。
  交付闭环：`npm run typecheck` → `grep -rE "from './[^']+\.ts'" lib/ || echo 无残留` → `npm run build && npm pack` → `--dump-config | grep <id>` → `npm run verify:execution` → `npm test`。
- **.dsh-plugin / repository-plugin 机制演变**：无 repository-plugin 史，但 `references/overview.md` 把 **registry（`dsh.plugin.json` 清单 + cordis 入口，`dsh registry install`）** 列为 bundle 之外的合法形态，属“已并存、后被官方 0809 覆盖”的第二代协议（详见 1.5 plugin-registry 与 1.13 awesome-dsh-plugins 的时间线）。

### 1.3 deepseek-harness-plugin-from-scratch（Opr4Mp3r）— 代码审计式渐进教程

- **目的**：回答“不是 `apply()` 怎么写，而是一个插件如何在真实 Harness 中做到：依赖正确、配置可验证、注册可撤销、服务可替换、模型可见内容可回放、测试覆盖真实装配路径”（`README.md`）。非官方社区教程，审计基线 `deepseek-ai/deepseek-harness@47f9438`（2026-08-13），示例依赖公开包 `0.1.0-rc.6`。
- **六句话核心**（`README.md`）：① 一切行为都是插件，不修改 `agent-loop`；② 必需依赖用 `inject`、可选读取 `ctx.get()`、可选子贡献 `ctx.inject()`；③ 所有注册和外部资源都必须属于可撤销 effect；④ 可替换能力由 Service Definition / Provider / Consumer 三角色组成；⑤ `waterfall` 是 around middleware，除非有意短路必须 `next()`；⑥ 模型可见 ⟺ 可从 Session log 重建（`model-visible ⇔ logged`）。
- **结构**：`docs/{00-architecture-map,01-minimal-plugin,02-lifecycle-and-effects,03-capability-seams,04-events-and-durability,05-testing-and-release}.md` + `anti-patterns.md` + `checklist.md` + `audit-report.md`；`examples/progressive/{src,tests,checkpoints,diffs}`；`scripts/{checkpoint-lib,generate-checkpoints,verify-checkpoints,verify-docs,verify-package,verify-preview,verify-profile}`；`preview/server.mjs`（本地 scrollytelling 阅读器）；`cordis.patch.yml`；`audit-manifest.json`（钉 commit/日期/运行时版本）。
- **checkpoint 系统**（`README.md`、`scripts/verify-checkpoints.ts`）：唯一手工维护源码 `examples/progressive/src/index.ts`；三份 checkpoint（`01-plugin.ts`/`02-config.ts`/`03-tool.ts`）由 `generate-checkpoints` 生成；CI 验证“每步只能在上一步末尾追加，最终一步与源码逐字相同”；配套 `diffs/*.patch`。
- **17 条反模式**（`docs/anti-patterns.md`，每条有对应生产代码证据在 `audit-report.md`）——最关键：
  1. 函数插件同时 `export default apply` → Loader 丢 `inject/Config/name`；
  2. 可选 service 用 `ctx.optionalService` → shadow/fiber 拓扑下兄弟 provider 不可见，用 `ctx.get()`；
  4. waterfall 忘记 `next()` → 日志/metrics 插件悄悄吞掉工具执行或模型请求；
  5. registry mutation/timer/watcher 不属于 effect → HMR 后留旧资源；
  8. 只有 TypeScript `Config` interface → 真实 Loader 无运行时 schema；
  9. 在 `run()` 里 `?? default` → 用显式 `resolve(request): spec`；
  15. 忽略 `exec.signal` 或 dispose 不等 quiescence → 取消后旧工作继续改变世界；
  17. 把“源码能跑”当成“插件可安装” → 没有 `lib/`、包入口、`dsh.bundle` 或 `cordis.patch.yml` 时，`dsh plugin add` 只会装普通依赖、不激活插件。
- **五层测试证据**（`docs/05-testing-and-release.md`）：Unit（边界/错误/取消/race/纯 render）→ HMR disposal（贡献随 fiber 消失）→ Real Loader composition（export normalization、fiber topology、cordis.yml）→ Built entry smoke（发布后 `lib/` 由 plain Node 使用）→ Keyless snapshot / e2e（模型/协议/UI/人类可见行为在完整应用成立）。配套教训：“178 个测试全绿、100% 行覆盖，但 ACP 在真实编辑器第一次连接时就崩溃”——手工 `ctx.plugin(...)` 测试绕过了 default-export 与错误 Context 路径两条真实路径。
- **一个可安装包必须交付什么**（`docs/05-testing-and-release.md`）：`main/types/exports` 指向真实生成的 `lib/`；`files` 只收录运行入口/声明/许可证/README/组合层；`dsh.bundle.patch` 指向包内 `cordis.patch.yml`；patch 用包名而非 checkout 相对路径加载；Harness 提供的 Cordis 与 Service Definition 包为 peer、插件自有实现为 dependencies；npm/tarball 分发前构建、GitHub 源安装配自包含 `prepare`。
- **交付检查单**（`docs/checklist.md`，可直接复制进 PR 描述）：架构 / 导出依赖生命周期 / Config 与错误 / Tool·UI / Event 与持久化 / 测试与文档 / 构建打包安装 七大块。
- **安装/发布指令**（verbatim，`README.md`）：
  ```sh
  pnpm install --frozen-lockfile
  pnpm smoke:source && pnpm smoke:loader && pnpm check
  pnpm pack
  dsh plugin --profile tutorial add ./deepseek-harness-plugin-from-scratch-0.1.0.tgz
  dsh --profile tutorial --dump-config          # 应出现 # == deepseek-harness-plugin-from-scratch 与 id: greet-tool
  pnpm check:profile                            # 打包→dsh plugin add→config 层检查→启动→调用 greet（公开 CLI @deepseek-ai/dsh@0.1.0-rc.6）
  dsh plugin --profile tutorial add 'github:Opr4Mp3r/deepseek-harness-plugin-from-scratch#FULL_COMMIT_SHA'  # GitHub 源，需 prepare+allowBuilds
  ```
  配置覆盖示例（整行替换，两个字段都要重述）：`cordis.patch.yml` 内 `- id: greet-tool` + `config: { greeting: '你好', excited: true }`。
- **兼容性锁定**（`README.md`）：审计语义 Harness `47f9438…`；可运行示例 `@deepseek-ai/dsh-*` `0.1.0-rc.6`、`@deepseek-ai/cordis` `4.0.1`；`@deepseek-ai/cordis-plugin-include` `1.0.6`、`@deepseek-ai/cordis-plugin-loader` `1.0.2`、`@deepseek-ai/schemastery` `3.18.1`；发布 peer window `@deepseek-ai/cordis ^4.0.1`、`@deepseek-ai/dsh-tools ^0.1.0-rc.5`。“上游在首个正式 tag 前明确不承诺兼容旧格式，升级依赖时应重新执行审计清单”。

### 1.4 dsh-plugin-skills（omdsh-dev/dsh-plugin-skills）— 写/测插件 skill 集

- **目的**：把“选形态 → 走包清单 → 选测试分层”固化成语义可被任意 agent 读取的 skill，声明**完全自包含**：“Both skills are fully self-contained: no external docs or other skills needed at runtime”（`README.md`）。
- **结构**：`dsh-write-plugin/SKILL.md` + `references/{tool-plugin,service-plugin,hook-plugin,config-plugin,llm-adapter-plugin}.md`；`dsh-test-plugin/SKILL.md`。
- **形态分类表**（`dsh-write-plugin/SKILL.md`）：模型工具→Tool plugin；新模型提供商→LLM adapter；拦截请求/工具/回合→Hook；其他插件消费的能力→Service；用户可配置行为→Config。
- **关键 snippet**：`defineTool` 注册（`references/tool-plugin.md`，与官方一致）：
  ```ts
  export const name = 'my-tool'
  export const inject = ['tools']
  export function apply(ctx: Context) {
    ctx.tools.register(defineTool({
      name: 'read_file', description: 'Read a file from disk.',
      parameters: { path: { type: 'string', required: true, description: 'Absolute path' } },
      output: { schema: { type: 'string' }, render: (_args, value) => [{ type: 'text', text: value }] },
      async execute(args, exec) { return readFile(args.path, { encoding: 'utf8', signal: exec.signal }) },
    }))
  }
  ```
  服务（`references/service-plugin.md`）：`export default class MetricsService extends Service { static inject = ['llm']; constructor(ctx){ super(ctx,'metrics') } }` + `declare module 'cordis' { interface Context { metrics: MetricsService } }`。
  权限 gate（`references/hook-plugin.md`）：`ctx.on('tools/pre-execute', async (exec, next) => { if (!(await isAllowed(exec))) return { kind:'deny', reason:'…' }; return next() })`。
- **记录的坑**（verbatim）：`Config` 不得是普通对象（`config-plugin.md` — "Do not export a plain object as `Config`; it does not implement the Standard Schema interface Cordis requires."）；`!!js`（双感叹号）只允许在 plugin `config` 下、`disabled: !!js …` 是 truthy object 恒禁用（`config-plugin.md`）；UI presenter 是纯函数（回放会重跑，禁 I/O/时钟/随机，`tool-plugin.md`）；可选服务 `ctx.get` 缺省容忍、必选服务消失自动卸载恢复（`service-plugin.md`）；“真实入口路径 = 发布产物”（`dsh-test-plugin/SKILL.md` — package `bin` 跑 built `lib/bin.js` 于 plain Node，暴露 tsx 掩盖的失败；测试解析停在源码 plane，workspace import 走 `src` 而非 stale `lib/`）。
- **安装**：`cp -r dsh-write-plugin dsh-test-plugin <project>/.agents/skills/`；Claude Code 用 `ln -s ../.agents/skills <project>/.claude/skills`（`README.md`）。无 `dsh plugin add`/`pack`（本仓库是 skill 非包）。
- **.dsh-plugin / repository-plugin 机制演变**：无（面向 workspace package + `ctx.*` 扩展点，不涉及历史静态格式）。

### 1.5 plugin-registry（vlln/plugin-registry）— 机制演变权威记录 + 薄控制台

- **目的**：官方机制管“插件是什么、怎么跑”；本仓库补两件事——① 薄控制台（管理 profile 插件安装态的浏览器面板 + 4 个 agent 工具）；② 开发规范和引导（`make-dsh-plugin` skill + cookbook）（`README.md`）。交付物是**官方 bundle 格式的独立包** `@dsh-external/plugin-console`（声明 `dsh.bundle` + `dsh.client`），非 patch/官方源码改动（`AGENTS.md`）。
- **最关键的机制演变记录**（`README.md` 顶部告示，verbatim）：
  > "**转向（2026-08）**：官方 0809 推出仓库插件机制（`.dsh-plugin`）覆盖旧独立机制 ~95%，本仓库收敛为薄控制台 + 插件开发规范和引导（旧 patch/CLI/面板已移除）。**0811 起官方删除 repository-plugins 机制**（`vendor/loader/src/repository.ts`），外部插件统一经 web profile 安装：bundle 插件（`dsh.bundle` 包）进 `dsh.profile.bundles` 层栈；非 bundle 插件（纯 cordis 包）经 profile `cordis.patch.yml` insert 行挂载（配置 HMR 实时生效）。"
- **完整时间线**（`CHANGELOG.md` + `docs/official-0809-coverage.md`）：
  - **0809 新增**：官方新增 repository-plugin 格式——`.dsh-plugin/` 目录 + `package.json#dsh.skills/mcpServers/entry` + `scripts.prepack`（调用 `dsh-plugin-prepare`）→ 生成固定 `dsh-plugin.mjs` wrapper + `dsh-plugin-assets/`；安装走 `$DSH_HOME/cordis.patch.yml` 的 `repository-plugins.repositories` 列表，`github:owner/repo#<ref>` 精确锁定、可 `&path:` 选子目录；`RepositoryCache` + `loadPreparedRepository` + 事务性换代 + HMR watcher。官方**明确拒绝** install 命令/注册表/市场（config-only-repository-plugins Alternatives 原文 “Add a dsh plugin install command and installation database. Rejected”）。
  - **0809/0810 转向**：`docs/official-0809-coverage.md` 逐能力评估后结论 “plugin-registry 作为独立插件机制的 ~95% 能力被官方 0809 覆盖，剩余价值收敛为管理 .dsh-plugin 包的控制台”；`CHANGELOG.md` 记录 “官方 0809 覆盖度评估结论……进入转向期……旧机制已移除（独立一步，46ac846）：patch 加载（0808）、`dsh registry` CLI、`ctx.plugins`、`ui-plugin-manager` 旧面板、patches/ 目录全部删除”。
  - **0810**：官方 client 插件声明 `dshClient` → `dsh.client`（原 `dshClient` 不再识别）；用户配置层为 `$DSH_HOME/cordis.patch.yml`（08-05 取代 `config.yaml`）。
  - **0811 契约断裂**：`CHANGELOG.md` — “官方 `vendor/loader/src/repository.ts` 删除（−258 行），`repository-plugins.repositories` 机制整体移除——`plugin_search`/`plugin_install`/`plugin_uninstall`/`plugin_status` 四个工具与面板「repository 插件源」区的官方后端不复存在。”新契约：bundle 插件进 `dsh.profile.bundles` 层栈（重启生效）；非 bundle 插件经 profile `cordis.patch.yml` insert 行（**配置 HMR 实时生效，零重启**——0811 保留配置级 HMR，web-app 禁用模块级 hmr 时 profile-boot 主动挂 watch-only 实例，`profile-boot.ts:287-301`）。
  - **0812 服务重命名**：17 个服务名变更——`httpServer`→`webServer`、`tasks`→`jobs`、`bash`→`shell`、`compact`→`compaction` 等；`repository.ts` 无回归（0811 删除保持）。
- **bundle vs 纯 cordis 双通道**（`docs/plugin-types.md`）：核心判据 = 包是否自带 `dsh.bundle.patch`（组合层）。bundle → `dsh plugin --profile web add` 进层栈，**重启生效**；纯 cordis（无 `dsh.bundle`，`main` 指向 Cordis entry）→ `dsh plugin add` 装依赖 + profile `cordis.patch.yml` 加 insert 行，**配置 HMR 实时生效**。管理文件：profile `package.json` 的 `dsh.profile.bundles`（bundle 层栈）+ profile `cordis.patch.yml`（insert 行 + disabled 启停，HMR watched）。
- **官方包未发布的依赖解析**（`docs/plugin-types.md`）：两类插件都依赖 `@deepseek-ai/*`（未发布到公共 npm）时，`dependencies` 声明为空是**设计**——官方包由 profile 的 pnpm 闭包挂载时注入（`$DSH_HOME/profiles/node_modules` flat fallback）；声明了反而解析失败。（注：rc.6 起公开包可用，见 dsh-plugin-dev/from-scratch 的 npm rc 路径，两条时间线资料要按宿主版本取舍。）
- **薄控制台代码模式**（`packages/plugin/console/`）：Node half `inject = ['webServer','loader','tools','agentPresets']`；`ctx.effect` 内 `webServer.register({kind:'prefix', path:'/api/plugin-console', handler})` + `pluginTools.map(t => ctx.tools.register(t))` 并返回 disposer（`src/index.ts`）。`plugin_install` 工具描述直接写双通道语义（`src/discovery/tools.ts`）：bundle → pnpm add + 进 `dsh.profile.bundles`（重启生效）；非 bundle → pnpm add + profile `cordis.patch.yml` insert 行（HMR 实时）。tsdown 双产物（`tsdown.config.ts`）：Node half ESM（`external: [/@deepseek-ai\//]`）+ client half **CJS**（`window.__ModuleLoader__.load({ id, factory })` banner/footer；ESM 输出与顶层 `return` 不兼容，已实证浏览器解析失败）。
- **记录的坑**（`CHANGELOG.md` + `skills/make-dsh-plugin/references/gotchas.md`，verbatim）：
  - insert 行 `name:` 必须加引号——“YAML `@` 开头是保留指示符，裸写解析失败 HMR 不生效”；
  - 移除最后一个 insert 行后必须恢复 `[]` 模板——“纯注释文件解析为 null，HMR reload 失败”；
  - tsdown 需 `external: [/@deepseek-ai\//]`——“本地仓库 symlink 官方包后 tsdown 会误内联依赖（lib 从 242 行膨胀到 7036 行）……官方包由 profile 闭包注入，不内联”；
  - 官方 `@deepseek-ai/*` 未发布公共 npm → `npm install` 直接失败，`dependencies` 留空（`gotchas.md`）；
  - 已挂载插件改源码需 web 重启（ESM 模块缓存按 URL 永久缓存，`import(entryUrl)` 无 query bust）（`gotchas.md`）；
  - 宿主全局 CSS 可能覆盖插件 `<style>`，关键样式用 JS 内联（`gotchas.md`）；
  - 严格注入（0811 cordis）：`ctx.get` 未在 `inject` 声明 → `cannot get property without inject`，apply 开头即抛（`gotchas.md`）；
  - allowBuilds 的 key 含冒号，写入 yaml 必须加引号（`gotchas.md`）。
- **安装**（verbatim，`README.md`）：方式一（git 源一行，实测约 15 秒，产物已入库故不触发构建）：
  ```sh
  dsh plugin --profile web add "github:vlln/plugin-registry#main&path:/packages/plugin/console"
  ```
  方式二（本地目录）：`git clone … && cd plugin-registry/packages/plugin/console && dsh plugin --profile web add .`（“产物已入库，无需构建；当前目录即 bundle 包子目录，dsh 锚定 `.` 为绝对路径”）。
  bundle 子目录 `&path:` 语法（`skills/make-dsh-plugin/references/bundle-plugins.md`）：
  ```sh
  dsh plugin --profile web add "github:owner/my-bundle#<commit>&path:/packages/my-bundle"
  # ❌ 不要写仓库根（dsh plugin --profile web add ./）——根不是 npm 包，无 dsh.bundle。
  ```
- **.dsh-plugin / repository-plugin 机制演变**：本仓库是唯一完整记录 0809 新增→0811 删除→双通道替代→0812 服务重命名全过程的仓库，是知识库该机制条目的**事实源**。历史文档存档：`docs/cookbook/creating-a-repository-plugin.md`（标“历史文档：官方 0811 移除 repository-plugins 机制…安装路径已不可用”）、`docs/architecture.md`、`docs/manifest-format.md` 等 12 篇标“历史文档”的设计。

### 1.6 dsh-plugin-check（omdsh-dev/dsh-plugin-check）— 插件健康检查工具

- **目的**：把组织内作者踩过的坑（cordis 双副本、tsconfig 三件套、patch name 不一致、产物 `.ts` 残留）变成可自动检查的门禁（`README.md`）。**只读**：仅 `readdir/stat/readFile`，不修改/不构建被检查仓库；零业务依赖（仅 node 内置模块）；不执行 tsc（构建陷阱全静态文本扫描）。
- **形态**：tool-bundle，注册 `plugin_check` 工具（`@deepseek-ai/dsh-plugin-check`，row id `tool-plugin-check`），统一输出 JSON 文本；无 CLI、无进程退出码——verdict 内嵌 JSON。参数 `action: check|scan|schema`、`path`、`strict`（warning 升级为 error）。
- **检测项**（`README.md` 表 + `src/report.ts` 的 `CHECK_SCHEMA`）：清单协议（`no-manifest/invalid-name/missing-main-or-types/no-patch` + `incomplete-files/missing-peer/no-bundle-decl`）、patch 格式（`malformed-patch/patch-name-mismatch/duplicate-row-id`）、构建陷阱（`no-source-entry/no-tsconfig/missing-ts-ext-imports/lib-layout-mismatch/stale-ts-imports` + `missing-rewrite-imports`）、生态合规（`core-row-id`=patch 用官方核心 row tools/session/llm/web/permission、`missing-profile-install-example`、`manual-install-only`、`core-modification-required`）、hub 收录（`not-in-hub`）。`verdict`：0 error→pass；有 error→fail；仅 warning→warn。`kind`：registry/skill/collection/tool-bundle/bundle/infra/unknown，按形态套用不同检查集。
- **manifest 校验规则**（`src/manifest.ts`，verbatim 语义）：name 用完整 npm 规则 + 组织政策（`@deepseek-ai/*` 或 `dsh-*`）；`main`/`types` 走 `resolveWithin` 真实路径 containment；`files` 必须含 `lib`/`src`/`cordis.patch.yml`；peer 必须含 `@deepseek-ai/cordis` 或 `cordis`；`dsh.bundle.patch` 必须声明且目标在根内。
- **npm rc.1 依赖线**（`README.md`、`package.json`）：peer 全 scoped `@deepseek-ai/cordis@^4.0.1-rc.1` + `@deepseek-ai/dsh-tools@^0.0.1-rc.1` + `@deepseek-ai/dsh-invariants@^0.0.1-rc.1`；`npm install`→`npm run typecheck`→`npm test`→`npm run build`→`npm pack`；启动 `npx -p @deepseek-ai/dsh@0.0.1-rc.1 dsh web`。
- **安装**（verbatim）：`dsh plugin --profile web add "C:/path/to/dsh-plugin-check"`；`dsh plugin --profile headless add "C:/path/to/dsh-plugin-check"`（`dsh run` 默认用 headless profile）。验证：`dsh --profile web --dump-config | grep tool-plugin-check`；运行：`dsh run "使用 plugin_check 工具检查一个插件仓库"`。**注意**：web 与 headless 是不同 profile，web 安装不覆盖 headless。
- **内部不一致**（值得记录）：README 称“33 项”，`src/report.ts` 的 `CHECK_SCHEMA` 实为 **36 项**；README 表把 `missing-rewrite-imports` 标 warning 但代码为 error（以 `ERROR_CODES`/`isErrorCode` 为准）。
- **.dsh-plugin / repository-plugin 机制演变**：无（只校验现代 bundle 与 `dsh.plugin.json` registry 形态，不涉及 `.dsh-plugin`）。

### 1.7 dsh-suite（whyihaveyou/dsh-suite）— 目录 + 脚手架 + 自研插件

- **目的**：DSH 发布时无官方 registry，发现靠 GitHub `dsh-plugin` topic 与一夜冒出的静态列表，且 DSH 仍在发兼容性破坏变更。本仓库建三件东西：① 活目录（每条带 DSH 兼容徽章，CI 每 24h 对最新 DSH 重检，无 key）；② 脚手架 `npm create dsh-plugin`（官方没有）；③ 自研插件（`plugin-notify`/`plugin-session-export`/`plugin-team-board`）（`README.md`）。
- **目录数据**（`data/plugins.json`，单一真相源，JSON）：`_meta` + `plugins[]`（167 条）+ `watchlist[]`（57 条）。字段（`docs/catalog-schema.md`）：`id`（slug）、`name`、`npm`（当前全 null）、`repo`、`url`、`category`（11 类）、`description {en,zh}`（≤140 字符）、`author`、`stars`、`license`、`tags`、`dsh {minVersion,peerCordis,node}`、`compat {status,dshVersion,lastVerified,note}`、`install`（空则生成默认 `dsh plugin --profile demo add <name>`）、`featured`、`isOfficialBeta`、`language`、`sourceNote`、`watchReason`。`compat.status` 枚举 `unknown|ok|broken|unmaintained`。README 目录表格由 `gen-readme.mjs` 生成，**绝不手改**。
- **兼容性日检（三层，无 key）**（`docs/catalog-schema.md` + `scripts/compat-check.mjs` + `.github/workflows/compat.yml`）：L1 静态 peer 比对（已实现）——`npm view <name> peerDependencies engines --json` 比 `@deepseek-ai/cordis`/`@deepseek-ai/dsh` peer 范围与 node engines（peer 不满足→broken；有 cordis/dsh peer 且满足→ok；无 npm 包→unavailable；无 peer→unknown）；L2 安装检查（TODO）`dsh plugin --profile __compat__ add <name>`；L3 组装检查（TODO）`dsh --profile __compat__ --dump-config`。`--write` 把 ok/broken 写回 `data/plugins.json`；CI 每日 UTC 00:00 cron。徽章：🟢 ok / 🔴 broken / ⚪ unknown / ⚫ unmaintained。真实 broken 案例（`data/compat-report.json`）：`open-managed-agents`→`node 22.17.0 not in engines ">=22.19.0"`；`role-model`→`no @deepseek-ai/cordis or @deepseek-ai/dsh peer dep`。
- **`create-dsh-plugin` 脚手架**（`packages/create-dsh-plugin/`，零依赖，`bin: create-dsh-plugin → src/cli.js`）：
  ```bash
  npm create dsh-plugin@latest my-plugin
  ```
  三模板 `tool`/`events`/`webui`（差异见 `src/templates.js` + 各模板）：
  - `tool`：`dependencies: {"@deepseek-ai/dsh-tools": "{{DSH_TOOLS_VERSION}}"}`；`inject = ['tools']`；`defineTool` 返回时间/环境信息。
  - `events`：`"dependencies": {}`（**零运行时依赖**，dsh-tools/dsh-session 仅 devDep 供 `import type`）；不声明 `inject`；`ctx.on('session/event')` + `ctx.on('tools/change')` + `ctx.on('tools/pre-execute', (exec,next)=>{…; return next()})` + `ctx.effect(()=>{ const timer=setInterval(…); return ()=>clearInterval(timer) })`。
  - `webui`：同 `tool`，额外 `presentationMeta`/`presentCall`/`presentResult` diff 卡片（`presentCall` 返回 `{card:'diff', diffs:[{path, oldText:null, newText}], locations:[{path}]}`）。
  三者共同 `peerDependencies: {"@deepseek-ai/cordis": "^{{CORDIS_VERSION}}"}`、tsconfig `target es2022 + module esnext + moduleResolution bundler + strict + outDir dist`。
  tool 模板 `src/index.ts` 头注逐字列出它守护的坑：
  > "1. `@deepseek-ai/dsh-tools` is pinned to the `next`-tag version in package.json — npm's `latest` tag is a STALE 0.0.1-rc.1. Never run a bare `npm i @deepseek-ai/dsh-tools` over it.
  > 2. Registration is an EFFECT: `ctx.tools.register()` returns a disposer…
  > 3. Load order = service dependencies (`inject`), never file order.
  > 4. Pure ESM (`"type": "module"`); `@deepseek-ai/cordis` is types-only here…
  > 5. An object output schema MUST declare `additionalProperties` explicitly."
  `cordis.patch.yml` 头注：“`name` is a PACKAGE NAME（经 profile node_modules 或 `$DSH_HOME/profiles/node_modules` fallback 解析），NOT a relative path”。
- **10 条 PITFALLS**（`packages/create-dsh-plugin/src/templates.js` 的 `PITFALLS` 数组，渲染进每个生成项目 README）：① Node `^22.19.0 || >=24.0.0`（旧版 EBADENGINE 告警）；② **npm dist-tag 坑（最大）**：`@deepseek-ai/dsh-tools` 的 `latest` 是过期的 `0.0.1-rc.1`、真版本在 `next` tag（`0.1.0-rc.x`）；③ 版本线对齐（所有 `@deepseek-ai/dsh-*` 统一同 `0.1.0-rc.x` 线，避免 pnpm 装两份）；④ `@deepseek-ai/cordis` 是 peerDep 且只 `import type`（编译期擦除，运行时 ctx 由宿主传入）；⑤ 纯 ESM（`"type":"module"` + `module: esnext` + `moduleResolution: bundler`）；⑥ `dsh plugin add <dir>` 相对路径锚定**调用目录**（要在插件父目录执行）；⑦ bundle `cordis.patch.yml` 里 `name` 是**包名**；⑧ 注册是 effect（timer/连接包 `ctx.effect(()=>{…; return cleanup})`）；⑨ 加载顺序靠 `inject` 不靠文件顺序；⑩ 端到端需 `DEEPSEEK_API_KEY`（无 key 时 `--verify` 只能证明 load/list/event，模型调用 `MISSING_CREDENTIAL`）。
- **第一方插件代码模式**：`@dsh-suite/plugin-notify` 用 Schemastery `Schema.object({ webhooks: Schema.object({ feishu/wecom/dingtalk/slack/discord/custom: Schema.string() }), events: Schema.array(...), local: Schema.boolean().default(true), timeoutMs: Schema.number().default(5000) })` + `declare module '@deepseek-ai/dsh-session/types' { interface SessionEventMap { 'approval/asked': {…} } }`（`packages/plugins/plugin-notify/src/index.ts`）；`plugin-session-export` `inject = ['tools','sessions']`、`ctx.sessions.list()/get(SessionId(...))`（`packages/plugins/plugin-session-export/src/index.ts`）。
- **15 条插件设计准则**（`CONTRIBUTING.md`，对应 Cordis 论文概念）：注册即效果（register 返回 disposer）、共享状态物化为服务键（禁全局可变态）、依赖走 `inject` 不乐观查找、每个原子副作用配逆、相关拆除放进同一 effect、集合型可交换协作用、多 provider 走 service broker、能力封装成 seam、外部副作用（发射）扣留或 saga 补偿、跨重载状态放进更长命依赖、避免依赖环、声明式配置走 cordis.yml + `!!js`、消费依赖用 Proxy 属性访问 `ctx.<key>`、realm 隔离 + interception 治理、类型化事件 + 声明派发模式。
- **目录收录标准**（`CONTRIBUTING.md`）：真是 DSH 插件/生态组件（npm 包带 `dsh.bundle` 或 GitHub 仓库明确面向 DSH）；有真实代码；repo+stars 可核实（`gh api`）；中英双语描述（≤140 字符）；`compat.status` 诚实（没实测留 unknown）。蹭 tag/工具链/占位进 `watchlist`。
- **.dsh-plugin / repository-plugin 机制演变**：无（目录按现代 bundle/npm 名收录；全仓唯一命中“repository plugins”是第三方条目 plugin-registry 的英文描述文本，非本仓库机制）。

### 1.8 fabric（omdsh-dev/fabric）— Fabric/Mixin 加载期变换层

- **目的**：类 MC Fabric 的 hook 处理器——一个受信插件（A）无需改另一个插件（B）的源码即可改变其函数行为，通过注册 Fabric patch 针对 B 的 module/file/function 施加 `before`/`after`/`around`/`replace`（`docs/fabric.md`）。
- **机制本质**（`docs/fabric.md` + `packages/cordis-fabric/package.json`）：**Orchestrion-JS 之上的加载期代码变换**（依赖 `@apm-js-collab/code-transformer ^0.18.1`），**不是** bundling Cordis、不是 shim。变换 hook 重写目标函数体，把调用记录发布到进程内 bridge channel，运行时派发给当前注册 handler；无 handler 时直接委托原始函数体。`before` 改入参 / `after` 观察或替换成功结果（含 async）/ `around` 决定原体是否运行并可替换（`invoke()` 委托）/ `replace` 完全接管。
- **结构**：`packages/{cordis-fabric,cordis-fabric-api,cordis-fabric-dsh}` 三包 + 根 `cordis.patch.yml`（bundle 载体）；`patches/fabric-host-integration.patch` + `patches/README.md`（host 端 launcher/bootstrap + 浏览器 build seam）；`docs/{fabric,fabric-api,dsh-plugin-contracts}.md`。**不入库产物**：`lib/` 由 `prepare` 现建（`.gitignore`）。
- **关键 snippet**（`docs/fabric.md`、`packages/cordis-fabric/src/service.ts`）：
  ```ts
  import { bootstrapFabric, FabricService } from 'cordis-fabric'
  const disposeHooks = bootstrapFabric([])
  await ctx.plugin(FabricService)
  disposeHooks()
  ```
  ```ts
  declare module 'cordis' { interface Context { fabric: FabricService } }
  export class FabricService extends Service {
    static provide = 'fabric'
    constructor(ctx: Context) { super(ctx, 'fabric') }
  }
  ```
  注册 patch（`ctx.fabric.register` 返回 disposer，handler 是运行时绑定的可信代码）：
  ```ts
  export const inject = ['fabric']
  export function apply(ctx: Context & { fabric: FabricService }): void {
    ctx.fabric.register({
      id: 'my-vendor/rewrite-greeting',
      target: { module: '@example/target-package', versionRange: '^1.0.0',
                filePath: 'lib/index.js', functionQuery: { functionName: 'greet', kind: 'Sync' } },
      operation: 'before',
      handler(call: FabricCall) { call.arguments[0] = String(call.arguments[0]).toUpperCase() },
    })
  }
  ```
  `cordis.patch.yml`（显式 opt-in，两行 disabled）：
  ```yaml
  - insert:
      - id: cordis-fabric
        name: 'cordis-fabric'
        disabled: true
      - id: cordis-fabric-dsh
        name: 'cordis-fabric-dsh'
        disabled: true
  ```
  根 `package.json` 的 bundle 载体用 `&path:` 子目录依赖三包：
  ```json
  "dependencies": {
    "cordis-fabric": "github:dsh-external/fabric#main&path:/packages/cordis-fabric",
    "cordis-fabric-api": "github:dsh-external/fabric#main&path:/packages/cordis-fabric-api",
    "cordis-fabric-dsh": "github:dsh-external/fabric#main&path:/packages/cordis-fabric-dsh"
  }
  ```
  `cordis-fabric-dsh` 宿主门面 `inject = ['tools','systemPrompt','commands']`，`apply` 内逐个子插件 `ctx.plugin(FabricAgentService/FabricToolsService/FabricPromptService/FabricCommandsService)`（`packages/cordis-fabric-dsh/src/index.ts`）。窄 host 契约 `packages/cordis-fabric-dsh/src/host-contracts.ts` 是 `cordis-fabric-dsh` 对 DSH 运行时的**唯一视图**（官方 `@deepseek-ai/*` 私有不可装，只能声明最小结构面）。
- **安全边界**（`README.md`）：Fabric patch handlers 是注册时绑定的可信代码；“patch descriptors are configuration metadata, but executable handlers are never deserialized from YAML or model input”。`required: true` + `checkRequiredPatches` 在 boot 后 fail loud（`filePath` 可能写错 launch form `src/index.ts` vs `lib/index.js`，或函数已迁移）。`docs/fabric.md` 另注：“`cordis_mount` temporary plugins and repository plugins must not receive Fabric capability without an explicit grant.”
- **记录的坑**（`src/*.ts` + `patches/README.md`，root cause + fix）：
  - `registerHooks` 无 unregister → disposer 停用状态（`active=false`）而非移除 hook（`src/node-loader.ts`）；
  - **同步 `registerHooks` 与 tsx loader-thread hook 共存时 CJS 崩溃（版本边界）**：函数自 22.19.0 就有，但 **22.22.3 / 24.11.1 之前**同步 load chain 对 CJS 返回空 source 崩溃 → 版本门控 `supportsSyncHooks()`，低版本走 `./hook-entry` async `module.register`（bug 源 `nodejs/node#63060`、`#56241`）（`src/node-loader.ts`）；
  - constructor 目标被显式拒绝（`super()`/`new.target` 无法搬进 traced closure）→ 改 patch 方法或工厂函数（`src/transform.ts`）；
  - workspace 包无 `node_modules` 边界，`module-details-from-path` 无法命名 → 回退最近 `package.json`（`src/module-identity.ts`）；
  - Node 加载期变换要求预编译 JS，`.ts` 源码直接给 load hook 会失败（`docs/fabric.md`）；
  - src/lib 混用会分裂 bridge 监听器 → runner 与 launcher 都只 import package root（`lib/` half）（`patches/fabric-host-integration.patch`）；
  - pnpm 11 封锁 git-resolved subdependencies / allowBuilds 只收精确 commit key → `dangerouslyAllowAllBuilds: true` + profile 模板 `blockExoticSubdeps: false`（`patches/README.md`、`patches/host-patch.config.json`）；
  - pnpm 通过 SSH 解析 GitHub 依赖，装机需 SSH 权限（`README.md`）；
  - RegExp `filePath` 无法通过 JSON 配置通道序列化（变 `{}`）→ `{ fabricRegexp: [source, flags] }` marker 重建（`src/node-loader.ts`）；
  - 同一目标上的两个 `replace` patch 注册期被拒（`src/runtime.ts`）；箭头参数字面命名 `arguments` 遮蔽外层捕获被跳过（`src/transform.ts`）；patch 文件 trailing-space 被 git diff 误判 → `.gitattributes` `patches/*.patch whitespace=-trailing-space`。
- **主机集成限制**（`README.md`）：host launcher 必须在任何 target module import 前调用 trio 的 bootstrap；官方 master 尚未做——source host 需打 `patches/fabric-host-integration.patch`（`pnpm run patch:host -- <checkout>`）；npm 安装的官方 `dsh` 无法打源码 patch，需等官方 merge wiring。
- **安装**（verbatim，`README.md`）：`dsh plugin --profile web add github:dsh-external/fabric`；仓库不入库构建产物，`prepare` 在 git 安装时构建 `lib/`；需重启 web app，再在 profile composition 里 enable `cordis-fabric`/`cordis-fabric-dsh`。仓库自包含边界由 `verify:self-contained` 强制（拒绝 local-path 依赖、越界代码/编译器路径、绝对工作站路径）。
- **.dsh-plugin / repository-plugin 机制演变**：无（纯现代 bundle + host patch 分层；无 `.dsh-plugin` 目录/字段）。

### 1.9 dsh-turn-meta（randerous/dsh-turn-meta）— 最小首插件范例

- **目的**：刻意极小的可作模板的首插件，注入紧凑的、带 source 归属的每步头部（当前 turn/step、真实用户消息数与工具结果数、前置 turn 数）进 agent 请求历史（`src/index.ts` 头注）。它演练真实插件用的同一条 seam：命名 Cordis 插件 + Schemastery `Config` + 可选 `inject` + `agent/pre-step` hook `{prepend:true}` + `createUserMessage` source 归属。
- **形态**：monorepo 包 `@deepseek-ai/dsh-turn-meta`（`package.json` 的 `repository.directory: packages/context/turn-meta`，`workspace:^` 依赖，无 `dsh.bundle.patch`——这是官方包结构的抽取样例）。
- **关键 snippet**（`src/index.ts`）：
  ```ts
  export const name = 'turn-meta'
  export const inject = ['agents']
  export interface Config { enabled?: boolean; minStep?: number }
  export const Config: z<Config> = z.object({ enabled: z.boolean(), minStep: z.number() })

  export function apply(ctx: Context, config: Config): void {
    const enabled = config.enabled ?? true
    const minStep = config.minStep ?? 1
    validateMinStep(minStep)
    if (!enabled) return
    ctx.on('agent/pre-step', async ({ agent, turn, step }, next): Promise<PreStepDecision> => {
      const decision = await next()
      if (decision.kind === 'reject' || step < minStep) return decision
      return {
        kind: 'enter',
        messages: [...decision.messages, createUserMessage({
          content: [{ type: 'text', text: renderHeader(agent, turn, step, decision.messages) }],
          source: { kind: 'plugin', plugin: name, form: 'snapshot', sections: [{ name, text }] },
        })],
      }
    }, { prepend: true })
  }
  ```
  要点：`{ prepend: true }` 让 hook 在模型调用前运行；waterfall 先 `await next()` 再改 `decision.messages`；source 归属 `kind:'plugin'` 使注入可追溯/过滤；`enabled` 主开关是“发布默认关闭特性”的范式；`validateMinStep` 在 apply 顶部 fail loud。
- **构建**（`tsdown.config.ts`）：tsc 先 emit 到 `lib/types`，tsdown 再对 `index`/`invariant` 双入口各打一个 ESM bundle（esm/node/es2024/`dts:false`）。
- **测试**：`tests/turn-meta.spec.ts`（8 用例）+ `tests/smoke.mjs`（6 断言）。
- **.dsh-plugin / repository-plugin 机制演变**：无。

### 1.10 deepseek-harness-plugin-mcp（bobleer）— 把 DSH 插件发布给外部 agent 的 MCP server

- **目的**：官方 `@deepseek-ai/dsh-mcp-client` 是“把外部 MCP 工具拉进 DSH”；本仓库是**反向**——让不会说 Cordis 的外部 agent（Cursor/Claude Desktop/Claude Code/Codex）能发现、检视、安装、运行 DSH 插件（`README.md:13`）。三平面共享一个 MCP server：Catalog（只读 GitHub `topic:dsh-plugin`）/ Profile（`dsh plugin add|remove` 操作真实 profile）/ Runtime（`dsh --profile <name>` 拉起并把组合包注册的 `ctx.tools` 桥成 MCP `dsh__*` 工具）。
- **形态**：单 npm 包双入口——既是 agent 可 spawn 的 stdio/`--http` MCP server，又是 `dsh plugin add` 可装的 DSH bundle（`docs/design.md`）。
- **关键 snippet**：
  bundle 清单 + `cordis.patch.yml`（`!!js` 环境变量求值 + 默认关闭授权）：
  ```yaml
  - insert:
      - id: dsh-plugin-mcp
        name: deepseek-harness-plugin-mcp
        config:
          host: 127.0.0.1
          port: !!js Number(process.env.DSH_PLUGIN_MCP_PORT ?? 8765)
          catalog: !!js process.env.DSH_PLUGIN_MCP_CATALOG !== '0'
          bridgeTools: true
          allowInstall: false
          allowRuntime: false
  ```
  插件入口（`src/dsh-plugin.ts`）：`inject = ['tools']`，`apply` 内 `new ToolBridge(ctx.tools)` → `ctx.on('tools/change', …)` + `ctx.effect(() => () => { stopChange(); void listening.close() }, '…')` 收尾。
  工具名规范化（`src/plugin/names.ts`）：`dsh__<rawName>`，非法字符替换 + 64 上限 + SHA-256 哈希后缀防碰撞。
  控制面工具（`src/mcp/control-tools.ts`）用 **zod** 校验参数，`dsh_plugin_install` 需 `--allow-install` 或 `DSH_PLUGIN_MCP_ALLOW_INSTALL=1`，`handle` 内 `dsh.runPlugin(config.profile, pluginAddArgs(spec))`。
  MCP server（`src/mcp/server.ts`）声明 `tools: { listChanged: true }` 能力；安装 spec 一律 `github:<owner>/<repo>`（`src/plugin/classify.ts` 的 `installSpecFor`，不含 `#ref&path`）。
- **记录的坑**：① Runtime 子进程会再次挂载本包 → spawn 时强制注入 `DSH_PLUGIN_MCP_CATALOG/ALLOW_INSTALL/ALLOW_RUNTIME=0` 防递归（`src/runtime/host.ts`）；② `!!js` 标量在检视面不能求值 → 给 yaml 解析器注册自定义 tag `tag:yaml.org,2002:js` 当不透明字符串（`src/plugin/inspect.ts`）；③ Windows `which` 补 `.cmd/.exe` 后缀（`src/profile/dsh-cli.ts`）；④ 安装/运行前置 `whichDsh()` 检查，缺 `dsh` 返回 exit 127（同文件）。**注意**：`dsh-cli.ts` 用捕获式 stdio（`spawnSync(..., encoding:'utf8')` 与 `spawn(dsh, [...], {stdio:['ignore','pipe','pipe']})`），但仓库未记录 Windows 受限沙箱下 piped stdio 的 EPERM/MSYS 坑（潜在风险，读者自行注意）。
- **安装/运行**（verbatim，`README.md`）：`npm install -g deepseek-harness-plugin-mcp` 或 `npx deepseek-harness-plugin-mcp --help`；`dsh-plugin-mcp --http --port 8765 --allow-runtime`；装进 Harness `dsh plugin --profile web add github:bobleer/deepseek-harness-plugin-mcp`。agent stdio 配置 `command: npx` + `args: [-y, deepseek-harness-plugin-mcp, --allow-install, --allow-runtime]`。
- **.dsh-plugin / repository-plugin 机制演变**：无（只识别 `dsh.bundle.patch`→bundle 与 `dsh.client`→ui 两种现代形态）。

### 1.11 dsh-find-plugins（Nagi-ovo）— 找插件/装插件 agent skill

- **目的**：给 DSH 一句“有没有插件能……”，agent 搜出候选、解释差别、等用户拍板，再按仓库**当前声明**判定装法并验证挂载；“只负责找和装；开发新插件转 make-dsh-plugin”（`skills/find-plugins/SKILL.md`）。
- **核心原则**（`SKILL.md`）：“把 GitHub 的 `dsh-plugin` topic 当作插件身份，不把某个 owner 或组织当作目录。仓库转移后以搜索结果返回的最新 `fullName` 和 `url` 为准。”
- **装法判定**（`SKILL.md` Step 2）：`package.json` 声明 `dsh.bundle.patch`→`bundle`；含 `SKILL.md` 且无 bundle 声明→`skill`；README 要求写 `cordis.patch.yml` 且无 bundle→`cordis`；**只有 `.dsh-plugin`/`repository` 旧格式→标“需迁移”，不能直接安装**；无法判断→“需核对”，不编造安装命令。
- **repository 旧格式已移除**（`references/install-methods.md:39-43`，verbatim）：“最新 DSH 已删除 `@deepseek-ai/dsh-repository-plugin`、`.dsh-plugin`、repository cache 和对应配置行，不提供兼容解析。只有 `repository` 标记的插件不能安装；报告仓库链接和「需要迁移为 profile bundle」。”
- **安装优先级**（`references/install-methods.md:3-6`）：`bundle` > `cordis` > 外部管理器（`marisa`/`mygo`）；`repository` 已移除。bundle 安装命令（verbatim）：
  ```sh
  cd <dsh-source>
  pnpm dsh plugin --profile <profile> add <package-or-git-spec>
  pnpm dsh plugin --profile <profile> add 'github:<owner>/<repo>#<commit>'   # pin commit；README 给 &path:/<子目录> 时保留
  ```
  手工等价操作（CLI 不可用时）：在 `$DSH_HOME/profiles/<profile>/package.json` 的 `dependencies` 加包 → 同文件 `dsh.profile.bundles` 末尾追加包名 → profile 目录 `pnpm install`。cordis（裸插件）：profile `cordis.patch.yml` 加 `- insert: - name: '<package-name>' config: {}`。
- **记录的坑**：`dsh` 全局 launcher 已消失，须从 checkout 用 `pnpm dsh`（`references/install-methods.md:8-10`）；lifecycle scripts（`preinstall/install/postinstall/prepare`）风险须先确认（`SKILL.md` Step 4）；验证失败排查 `hmr/config-update-failed`、Git spec 转移前 owner、ref/path 拼写、profile `pnpm install`（`SKILL.md` Step 5）。
- **检索脚本**（`scripts/search-topic.mjs`）：`topic:dsh-plugin is:public archived:false`，分页 100/页，复用 `GITHUB_TOKEN`/`GH_TOKEN`→`gh auth token`→公开 API，过滤 archived/disabled/fork，按 `full_name` 去重。
- **.dsh-plugin / repository-plugin 机制演变**：本仓库是对“repository 旧格式已退役”的最直接陈述之一。

### 1.12 dsh-hub-workshop（omdsh-dev）— 插件市场/注册 workshop

- **目的**：把“发现层”与“安装层”严格分离——公开仓库/`dsh-plugin` topic 只是**发现证据**，绝不自动授予安装权限；可安装条目必须经 Workshop 审核，由 `registry-v1.json` 发布**不可变来源坐标**（`README.md`）。`SECURITY.md`：“Catalog inclusion, a public repository, passing CI, and a `dsh-plugin` topic are discovery facts rather than security endorsements or installation grants.”
- **形态**：纯静态站点 + JSON feed/schema + Cloudflare Worker + 3 个 Node 脚本；`private: true`、唯一依赖 `wrangler`。
- **目录/registry schema**（`catalog.schema.json`、`registry-v1.json`、`submission.schema.json`）：`package` 记录必填 `id/name/description/kind/tags/author/repository/ref/updatedAt/license/status/install`；`kind` enum（skill/mcp/extension/channel/ui/adapter/manager/toolkit）、`category` enum（9+1 类）；`install.type` enum 含 `profile-bundle/repository-plugin/marisa/plugin-registry/source/manual/npm/script`。`ref` 必须是 **40 位 hex 不可变 commit**（`^[0-9a-f]{40}$`）；`status` ∈ verified/beta/prototype（注意：实际 `catalog.json` 用 v0.3 schema、`status: discovery`、`ref: master/main`，与 `catalog.schema.json` 的 v0.2 声明不一致——schema 文件是遗留未同步文件，运行中校验门断言 v0.3）。
- **submission 条件约束**（`submission.schema.json`）：`management.method=repository-plugin ⇒ source` 必须匹配 `^github:owner/repo#40hex&path:/...$`；`method=profile-bundle ⇒ profileBundle` 必须为对象（`spec` 匹配 `github:…#40hex` 或 semver）；`deepHook=true ⇒ requiresFabric=true`；`installScriptsMustRemainDisabled` 恒 `const: true`。
- **样例记录**（`catalog.json`）：`status: discovery`、`install.type: manual`、`install.note: "Topic 标签只用于发现。请先检查源码、许可证、固定版本、权限和运行环境；该条目尚未获得 Registry 安装权限。"`——目录 264 条全是 `discovery`，`registry-v1.json` 安装权威**为空**（`entries: []`，`signature: null`）。
- **硬断言门**（`scripts/check-public-site.mjs`）：空安装 feed（`registry.entries.length===0`）、264 条目录、9 个白名单仓库、255 topic 仓库必须同时成立，否则 fail。
- **前端生成的安装坐标**（`assets/publish.js`）：profile-bundle spec `git+<repo>.git#<ref>`；repository-plugin source `github:<repo>#<ref>&path:/<packageDirectory>`（缺 path 时补 `/.dsh-plugin`）；`omdsh workshop install <id> --profile web --enable`（`assets/app.js`）。
- **记录的坑**：退役 `dsh-external` 组织名被脚本硬编码清洗（`build-topic-catalog.mjs` 用 `['dsh','external'].join('-')` + `replaceAll(..., 'retired DSH ecosystem')`）；空安装 feed 是硬门（禁止提前发布可安装条目）；不可变 commit 是唯一可信坐标（分支/浮动标签禁用）。
- **.dsh-plugin / repository-plugin 机制演变**：本仓库**同时保留旧 `repository-plugin` 支持线索与“已退役”信号**（`submission.schema.json` 的 `management.method` 仍含 `repository-plugin`、`assets/publish.js` 仍生成 `&path:/...` source 与 `@deepseek-ai/dsh-repository-plugin` config 片段），但不再授权安装；权威结论仍以 dsh-find-plugins 的 `install-methods.md` 为准（最新 DSH 已删除 repository 机制）。

### 1.13 awesome-dsh-plugins（AdamPlatin123）— 生态情报/兼容性雷达

- **目的**：对 `dsh-external` org 全部仓库（动态发现，当前 288）聚合调研 + 与**当日 mainline**（`dsh2026/test-AdamPlatin123` 最新 snapshot 分支）自动兼容对比；只承载情报、对比引擎与报告，不托管插件代码（`AGENTS.md`）。README 顶部 IMPORTANT：“收录不等于兼容，静态检查不等于运行可用，运行可用也不等于安全审计。”
- **结构**：`README.md`（分类目录 + 生态快照，AUTO 生成）、`CHANGELOG.md`（主更新视图）、`PLUGINS.md`（8 类人工登记）、`analysis/{plugin-formats,security-issues,group-chat-plugin-dev-insights}.md`、`cross-analysis/summary.md`、`docs/{SOP,plugin-fix-test}.md`、`research/<name>.md`（63 份）、`reports/<日期>/{index,mainline-compat,<repo>.md}`、`scripts/`（22 个）、`.mainline-state.json`、`.agents/skills/mainline-compat/SKILL.md`。
- **索引数据结构**（`.mainline-state.json`）：`{lastMainlineCommit, lastDate, previousCommit, repos:{<name>:{anchoredCommit, status}}}`。状态枚举：已收录/兼容（静态）/关注/需适配/运行可用/未知（待调研）+ 占位/不适用/已删除。当日快照（`README.md`）：288 仓，41 兼容 · 31 关注 · 9 需适配 · 188 待调研 · 13 占位 · 2 不适用 · 4 已删除；运行级实测 0 可用 · 5 失败。
- **证据分层 L0-L4**（`README.md`）：L0 发现（topic/可见性/元数据）→ L1 清单（package.json/name/入口）→ L2 静态兼容（补丁/seam/依赖范围）→ L3 编译实验（类型/语法检查）→ L4 运行实测（安装/加载/最小任务）。本仓库**不推导 `dsh plugin add`**：“本目录不是包管理器，也没有被本仓库验证过的统一安装命令。请以插件自身 README 的安装方式为准。”最低收录条件（`README.md`）：公开 + `dsh-plugin` topic + 合法 `package.json`（非空 name）+ 入口字段 + README 说明安装/卸载/最小示例 + 依赖显式声明 + 许可证 + 不提交密钥/PII。
- **四维兼容引擎**（`docs/SOP.md` + `AGENTS.md`）：补丁 `git apply --check --3way` / seam 符号 `git grep` / peerDeps / 锚定；退出码 `0` 全兼容、`1` 存在需适配、`2` 脚本错误、`3` 离线；cron 02:00/10:00/18:00 三班 + post-merge hook；`--dry-run` 只读。
- **两代格式对照**（`analysis/plugin-formats.md`，一句话结论）：“`.dsh-plugin/package.json` 是主仓库快照唯一官方支持的静态交付格式（只承载 skill + MCP 配置，按 commit ref 不可变挂载），`dsh.plugin.json` 是 plugin-registry 独立演进的动态生命周期协议（同进程 import + 声明即契约 + 安装/启停/校验），二者能力面不重叠且互转有损。”挂载 source 形如 `github:dsh-external/toybox#<40位commit>&path:/plugins/<id>/.dsh-plugin`。演进判断：“补丁锚定是共同债务……建议推动主仓库把 `dsh.plugin.json` 协议官方化，从补丁升级为上游能力。”
- **12 条安全清单**（`analysis/security-issues.md`）：主仓库红线 #302（AGENTS.md 无信任门槛升级 system-reminder，Critical）、#300（agent 可删自身审计日志，Critical）、#301（/compact 压缩丢硬约束）、#176（torn zstd 静默恢复）、#73（ENOSPC 崩溃）、#118/#20（并发写会话 seq 冲突）、#7（SSE 内存泄漏）；插件侧 plugin-registry 同进程任意代码（无沙箱/签名/发布者身份，Critical）、qqbot/tg-bot 凭据明文落盘、toybox 胶囊明文、group-chat-diary PII。
- **seam 全景结论**（`cross-analysis/summary.md`）：“客户端扩展面（slot/ThemeService/projection/dshClient）已经足够开放，服务端扩展面（动态挂载、设置写权限、渲染管线）仍有缺口。”
- **.dsh-plugin / repository-plugin 机制演变**：本仓库有全生态最系统的记录（第一代静态 `.dsh-plugin` → 第二代社区动态 `dsh.plugin.json` + 1061 行补丁接线主仓库；issues#171 是统一入口诉求）。

### 1.14 awesome-dsh-plugin（bruc3van）— 双语精选 catalog

- **目的**：社区精选、厂商中立的 DSH 插件索引，English 为主 + 简体中文镜像页，单数据源渲染两页（`README.md`）。
- **数据模式**（`catalog/plugins.json` + `catalog/schema.json`）：`categories[]`（id + localized title）+ `plugins[]`（`name`/`url`/`category`/`description` 必填；可选 `status` ∈ active/beta/archived、`source` ∈ official/community）。`localizedText` 强制 `en` + `zh-CN` 双字段。共 **44 条**插件、8 类。样例（`catalog/plugins.json`）：
  ```json
  { "name": "mstar-harness", "url": "https://github.com/btspoony/mstar-harness",
    "category": "agent-automation",
    "description": { "en": "A skill-driven workflow agent plugin for structured harness-loop engineering.",
                     "zh-CN": "面向结构化 Harness 循环工程的技能驱动工作流智能体 Plugin。" } }
  ```
- **自动化**：`scripts/generate_readmes.py` 承担校验（id kebab-case、name 唯一、url 绝对 http(s)、category 引用已声明、status/source 枚举、双语非空）+ 渲染（分类分组、按 `name.casefold()` 排序、回填 `<!-- CATALOG:START/END -->` 块）；CI `validate.yml` 跑 `--check`。本地：`python scripts/generate_readmes.py` / `--check`。
- **收录规则**（`README.md`）：与 DSH 相关或有清晰 DSH 集成说明；稳定公开 URL；一句事实描述（禁营销文案）；英中双语；厂商中立、有用、不重复；不含 secrets/affiliate links/恶意分发。PR 模板 checklist 强制“只改 `catalog/plugins.json`，跑 `--check`”。
- **对开发者价值**：`status`（active/beta/archived）× `source`（official/community）是最简有用的维护状态/来源维度；但本列表不做兼容性实测、不推导 `dsh plugin add`。
- **.dsh-plugin / repository-plugin 机制演变**：无（纯人工精选目录，schema 无 install/path/dsh 字段）。

### 1.15 awesome-DSH-plugin-alexyanggg（Alex-Yanggg）— 使用者场景导航 + 全量快照

- **目的**：“用 30 秒找到适合你的 DeepSeek Harness 插件”——不只是仓库列表，告诉你插件解决什么问题、适合谁、从哪里开始（`README.md`）。
- **数据模式**：`data/repositories.json`（GitHub `topic:dsh-plugin` 机器快照，**212 条**，每条 21 字段含 `full_name/html_url/description/category/category_zh/category_en/language/stargazers_count/forks_count/license/archived/disabled/created_at/updated_at/pushed_at/default_branch/topics`）+ `data/curated.json`（人工：`category_overrides`/`scenarios`（goal_zh/goal_en + repos + why）/`starter_kits`/`editor_picks`）。分类用正则 `categoryRules` 自动归类 + `category_overrides` 人工覆盖（`scripts/update.mjs`）。
- **样例**（`data/repositories.json` 第一条即官方仓库 `deepseek-ai/deepseek-harness`，star 18411）；`data/curated.json` 的 `scenarios` 如 `{ goal_zh: "更方便地管理和发现插件", repos: ["vlln/plugin-registry"], why_zh: "在浏览器面板中管理 repository 插件，并提供开发引导。" }`。
- **自动化**：`scripts/update.mjs` 走 GitHub Search API 分页拉取 → 规范化 → 按 star 降序 → 写回 JSON + 重生成 README/README_EN/CATALOG；workflow 每日 cron `17 1 * * *` 自动 commit+push（`contents: write`）。
- **诚实边界**（`README.md`）：“收录不等于安全或兼容性背书”；“第三方插件可能读取会话、文件、网络或系统资源。安装前请检查源码、权限、许可证、安装方式和最近更新情况。”索引统计：212 仓、10 种语言、158 个声明许可证、212 未归档未禁用。
- **可观察不一致**：README 的 Catalog refresh badge 硬编码指向 `bruc3van/awesome-dsh-plugin` 的 workflow（疑似 fork 后未改 badge 目标）。
- **.dsh-plugin / repository-plugin 机制演变**：无专门记录（仅 `curated.json` 里 plugin-registry 推荐文案提到“repository 插件”）。

---

## 2. 跨仓库共识

所有 scaffold/template/教程在以下事实点上**高度一致**（这构成“插件开发事实集”）：

### 2.1 插件入口形态（统一）

- 函数插件 = 命名导出 `name` + `inject: string[]` + `Config` + `apply(ctx, config)`，**不得加 default export**（Loader 解包 `exports.default ?? exports`，多余 default 会丢 `inject/Config/name`）——`plugin-template/README.md`、`plugin-template/src/index.ts`、`dsh-plugin-skills`、`fabric/docs/dsh-plugin-contracts.md`、`from-scratch/docs/anti-patterns.md`（反模式 1）、`from-scratch/docs/01-minimal-plugin.md` 一致。
- 服务提供者 = default-export `Service` 子类（`super(ctx, 'key')` + `static inject`/`static provide`）——`plugin-template/README.md`、`dsh-plugin-skills/references/service-plugin.md`、`fabric/packages/cordis-fabric/src/service.ts`。
- 配置必须是 Schemastery schema（`z.object`/`Schema.object`），禁普通对象；TS `Config` interface 与运行时 schema 并存——`plugin-template/src/config.ts`、`dsh-plugin-skills/config-plugin.md`、`from-scratch/docs/01-minimal-plugin.md`、`from-scratch/docs/anti-patterns.md`（反模式 8）、`dsh-suite/packages/plugins/plugin-notify/src/index.ts`。

### 2.2 package.json 关键字段（scaffold 共识）

- `"type": "module"`（ESM）、`main`/`types`/`exports` 指向 `lib/`（或 `dist/`）构建产物、`engines.node` `^22.19 || >=24`、`files` 只收录入口 + 声明 + `cordis.patch.yml`（+ `src`）。
- `dsh.bundle.patch → ./cordis.patch.yml`（bundle 形态）。
- **cordis peerDependency 身份分歧是唯一未对齐点**：`plugin-template`/`fabric` 用 **unscoped** `cordis ^4.0.0-rc.7` + `schemastery`（面向 standalone Cordis）；`dsh-plugin-dev`/`dsh-plugin-check`/`from-scratch`/`create-dsh-plugin`/`dsh-turn-meta` 用 **scoped** `@deepseek-ai/cordis`（^4.0.1-rc.1 / ^4.0.1 / workspace:^，dsh-tools 类型只增强 scoped 版本）。两者混用 = “双 Cordis 身份分裂”（`dsh-plugin-dev/references/build-pitfalls.md` 坑 1）。`@deepseek-ai/dsh-tools` 在 `dsh-plugin-dev`/`dsh-plugin-check` 里是 peer，在 `create-dsh-plugin` 里是 dependency（`next`-tag）——也是未对齐点。

### 2.3 tsconfig 三件套（构建共识）

- `moduleResolution: bundler` + `allowImportingTsExtensions: true`（否则 TS5097）+ `rewriteRelativeImportExtensions: true`（否则产物残留 `./x.ts` 导入→运行时 ESM 崩溃）+ `lib: ["ES2024"]` + 显式 `types: ["node"]`——`plugin-template/tsconfig.base.json`、`dsh-plugin-dev/build-pitfalls.md` 坑 2/坑 3 完全一致。
- `create-dsh-plugin` 例外：用 `dist/` + `noEmitOnError: true` + `verbatimModuleSyntax: true`，不写三件套（因其生成的 tool 入口无 `.ts` 相对导入）。
- `tsc` 报错仍 emit（`noEmitOnError` 默认 false）→ 构建脚本 `tsc ... || exit 1` 或 `--noEmitOnError`，发布前 `grep -rE "from './[^']+\.ts'" lib/` 验证无残留。

### 2.4 cordis.patch.yml / patch / bundle 分层（共识）

- bundle patch = YAML 数组，`- insert: - id: <id> name: <package-name>`（`name` 是**包名**经 profile node_modules 或 `$DSH_HOME/profiles/node_modules` fallback 解析，不是相对路径）——`plugin-template/cordis.patch.yml`、`create-dsh-plugin/templates/tool/cordis.patch.yml`、`from-scratch/docs/05-testing-and-release.md`。
- id 定向 patch = **整行替换 config**（非深合并），覆盖方必须重述全部键——`plugin-template/docs/dsh-plugin-contracts.md`、`from-scratch/README.md`。
- 生效层序：profile `dsh.profile.bundles` 层栈（bundle）→ profile `cordis.patch.yml`（用户 insert/disabled，HMR 实时）→ home `$DSH_HOME/cordis.patch.yml` → `--patch`。
- `!!js`（双感叹号，绝不 `!js`）只在 plugin `config` 下合法，loader 元数据（id/name/inject/disabled…）是静态字面量——`dsh-plugin-skills/config-plugin.md`、`plugin-template/.agents/skills/dsh-plugin-implement/SKILL.md`、官方 `publish.md`。
- insert 行 `name:` 必须加引号（YAML `@` 是保留指示符）；移除最后一个 insert 行后必须恢复 `[]` 模板——`plugin-registry/CHANGELOG.md`（0811 实证）。

### 2.5 安装/发布清单（共识）

- bundle：`dsh plugin --profile <name> add <spec>` → 进 `dsh.profile.bundles`，**重启生效**。
- 纯 cordis：`dsh plugin add` 装依赖 + profile `cordis.patch.yml` 加 insert 行，**配置 HMR 实时生效**——`plugin-registry/docs/plugin-types.md`。
- git 源安装：`dsh plugin add "github:owner/repo#<ref>&path:<subdir>"`（`&path:` 是 pnpm 的 git 子目录选择器，`dsh plugin` 转发给 pnpm verbatim，见官方 `apps/cli/src/plugin.ts`）；拉的是源码不是构建产物，须作者写**自包含 `prepare`**、用户侧 profile `pnpm-workspace.yaml` 加 `allowBuilds`（pnpm ≥10 阻止 git 依赖的 prepare 直到显式允许）——官方 `publish.md`、`plugin-template`、`from-scratch/README.md`、`fabric/package.json`（`&path:` 三包依赖实例）、`plugin-registry/README.md`（“产物已入库，git 源安装不触发构建”）。
- 免 allowBuilds 的分发：npm 发布带 `lib/`，或 `pnpm pack` 出 tarball（`dsh plugin add ./xxx.tgz`）。
- web 与 headless 是**不同 profile**（`dsh run` 默认 headless）——`dsh-plugin-check/README.md`、`dsh-plugin-dev/references/bundle-patch.md`。

### 2.6 测试分层（共识）

- from-scratch 五层：Unit → HMR disposal → Real Loader composition → Built entry smoke（`lib/` 于 plain Node）→ Keyless snapshot/e2e（`docs/05-testing-and-release.md`）。
- plugin-template：真实 `new Context()` + `ctx.plugin()` harness + Loader 解包断言（`'default' in plugin === false`）。
- dsh-plugin-dev：register.spec（注册契约）+ impl.spec（纯逻辑）+ tool-driver（真实管道直调 `ctx.tools.execute`）。
- dsh-suite create-dsh-plugin：内置 `--verify` smoke（生成→build→装临时 profile→dump-config）。
- 共识点：手工 `ctx.plugin()` 单测不够，必须证明真实 Loader/发布产物/产品 composition 可用（from-scratch 反模式 16/17）。

### 2.7 hub/awesome 收录标准（共识）

- 最低：公开 + `dsh-plugin` topic + 合法 `package.json`（非空 name）+ 入口字段 + README 说明安装/卸载/最小示例 + 依赖显式声明 + 许可证 + 不提交密钥/PII——`awesome-dsh-plugins/README.md`（最低收录条件）、`awesome-dsh-plugins/analysis/security-issues.md`。
- dsh-suite：真是 DSH 插件、有代码、repo+stars 可核实、双语描述 ≤140 字、compat 诚实（没实测留 unknown）；蹭 tag/工具链/占位进 watchlist——`dsh-suite/CONTRIBUTING.md`。
- bruc3van：厂商中立 + 双语 + 一句事实描述（禁营销）+ status/source 维度——`awesome-dsh-plugin/README.md`、`CONTRIBUTING.md`。
- dsh-hub-workshop：**发现 ≠ 安装权限**；40 位不可变 commit 是唯一准入坐标；安装条目须逐项审核，registry 安装权威当前为空——`dsh-hub-workshop/README.md`、`submission.schema.json`、`scripts/check-public-site.mjs`。
- 三个 awesome 列表与 dsh-suite 都**不推导** `dsh plugin add`（以插件自身 README 为准）；只有 dsh-hub-workshop 的 submission schema 把 `github:owner/repo#40hex&path:...` 写进准入正则。

---

## 3. 对知识库的更新建议

知识库现状（`dsh-plugin-guide/`）：`guide/plugin-dev-guide.md` §7.3 已收录社区踩坑的**压缩版**（cordis 双副本、tsconfig 三件套、Windows junction、多帧 zstd、`DSH_PERMISSION_MODE`、MSYS、路径 resolve），`guide/quick-reference.md` 的“社区实测坑速查”与 §7.0/§7.1 也已把 0811 repository-plugin 移除、`github:owner/repo#<sha>&path:<subdir>`、`prepare`/`allowBuilds` 写入。本报告是这些压缩条的**全文证据与出处**。以下是与官方文档（`references/official-docs/`）相比、社区确认且值得沉淀进知识库的增量：

1. **repository-plugin 机制演变（最高优先，需在知识库显式成文）**：官方 `references/official-docs/docs/subsystems/skills.md`（第 13/249 行）仍写着“host rows and repository plugins land in the global layer”——这是一处**已被 0811 移除机制影响的过时表述**，知识库应补一条“repository-plugin 已移除”的对照说明并引用事实源。完整时间线（0809 新增 `.dsh-plugin` → 0811 删除 `vendor/loader/src/repository.ts`（−258 行）→ bundle 层栈 + 纯 cordis insert 双通道 → 0812 服务重命名）事实源在 `community-repos/plugin-registry/README.md`、`CHANGELOG.md`、`docs/plugin-types.md`、`docs/official-0809-coverage.md`；旧格式细节与两代对照在 `community-repos/awesome-dsh-plugins/analysis/plugin-formats.md`、`dsh-find-plugins/skills/find-plugins/references/install-methods.md`。
2. **`dsh plugin` 是 pnpm forwarder + 层栈 reconcile**：官方 `apps/cli/src/plugin.ts` 证实——`dsh plugin add` 只转发 pnpm 并 reconcile `dsh.profile.bundles`；bundle-less 包只作为普通依赖安装并告警（不自动加 insert 行）；`&path:` 是 pnpm git 子目录语法（pnpm PR #7487），dsh 转发 verbatim。知识库可把“纯 cordis 插件的 insert 行是**额外一步**（手动或经薄控制台写 profile `cordis.patch.yml`）”讲得更精确。
3. **cordis 身份双轨（unscoped vs scoped）**：`plugin-template`/`fabric`（unscoped `cordis ^4.0.0-rc.7` + `schemastery`）与 `dsh-plugin-dev`/`from-scratch`/`create-dsh-plugin`/`dsh-turn-meta`（scoped `@deepseek-ai/cordis`）是两条时间线的资料，知识库 §7.3 已写“scoped/unscoped 混用分裂”，可补充“模板间未对齐”的事实与选型判据（面向 standalone Cordis 用 unscoped；面向 harness 宿主用 scoped）。
4. **官方 `@deepseek-ai/*` 包发布状态的双时间线**：rc 早期官方包未发布公共 npm → 社区 bundle `dependencies` 留空靠 profile 闭包 flat fallback（`plugin-registry/docs/plugin-types.md`）；rc.6 起公开包可用（`dsh-plugin-dev` 的 npm rc.1 路径、`from-scratch` 锁 `0.1.0-rc.6`）。知识库 §7.3 已收录此条，可补上 `create-dsh-plugin` 的 `next`-tag（npm `latest` 是 stale 0.0.1-rc.1）细节。
5. **`DSH_PERMISSION_MODE` 风险**：官方文档 grep 无此变量；社区 `dsh-plugin-dev/README.md` 明确其为高风险模式（Windows 无沙箱后端时仅此可启动且禁用审批提示）。知识库已收录，可补充“不要写进模板/CI/共享机器”的完整表述与出处。
6. **`DSH_*` 环境变量全集**：官方已文档化的有 `DSH_HOME`/`DSH_AGENTS_HOME`/`DSH_BUNDLED_SKILL_DIR`/`DSH_SNAPSHOT_*`/`DSH_CORDIS_CONFIG`/`DSH_WEB_URL`/`DSH_WEB_MODE`/`DSH_BUILD_FACE`/`DSH_SESSION_ROOT`/`DSH_MODEL`/`DSH_SYSTEM_PROMPT`/`DSH_ENV_PREFIX`/`DSH_SNAPSHOT`/`DSH_CODE_REVIEW_SINCE`（见 config-catalog、subsystems）；社区新增事实：`DSH_*` 特殊变量须由启动环境传入、放 `~/.dsh/.env` 会报错（`dsh-plugin-dev/build-pitfalls.md` 坑 7），`DSH_PLUGIN_MCP_*`（`deepseek-harness-plugin-mcp/src/config.ts`）、`DSH_HARNESS_ROOT`（`from-scratch/README.md`）。知识库可把“DSH_* 从启动环境传入”与“官方 env 清单”合并为一条索引。
7. **MSYS 路径转换**：`dsh-plugin-dev/README.md` — Windows 下直接跑 `bin/dsh` 触发 `ERR_UNSUPPORTED_ESM_URL_SCHEME`（issue #388），须用 `~/.local/bin/dsh` wrapper（`file://` URL 启动 tsx）。知识库 §7.3 已收录，可补 wrapper 事实。
8. **tsdown `external: [/@deepseek-ai\//]`**：`plugin-registry/CHANGELOG.md`（0812 实证）——symlink 官方包后 tsdown 会误内联依赖（lib 242→7036 行）；官方包由 profile 闭包注入、不内联。这是知识库尚未明确写的一条构建坑。
9. **bundle vs 纯插件 install 路径**：`plugin-registry/docs/plugin-types.md` 的双通道表（形态/开发/分发/安装/加载/启停/管理七维）比官方 `publish.md` 更聚焦第三方视角，可作为知识库 §7.0 的补充来源；`plugin-types.md` 的“自渲染 UI 与类型无关”结论（whale-girl 转 bundle 后照常工作）也值得收录。
10. **hub/awesome 收录标准**：知识库 §9 已列各列表；可补充 `dsh-suite` 的 5 条收录标准 + 15 条设计准则（`CONTRIBUTING.md`）、`dsh-hub-workshop` 的“发现 ≠ 安装权限 + 40 位 commit 准入 + 空 registry 硬门”（`README.md`/`scripts/check-public-site.mjs`）作为“发布到生态”的具体门槛。
11. **安全红线清单**：`awesome-dsh-plugins/analysis/security-issues.md` 的 12 条（含主仓库 #302/#300/#301/#176/#73/#118/#20/#7）与 `analysis/plugin-formats.md` 的“静态 vs 动态安全模型差异”（`.dsh-plugin` 子进程隔离 vs `dsh.plugin.json` 同进程任意代码）值得作为“插件安全评估”参考面沉淀。

---

## 4. 文件路径索引（重要结论 → 仓库内精确文件路径）

> 以下均为相对 `community-repos/<repo>/` 的路径。只列承载“结论级事实”的文件。

**plugin-template（omdsh-dev）**
- 插件入口四文件职责与命名导出：`src/index.ts`、`src/config.ts`、`src/runtime.ts`、`src/invariant.ts`
- bundle 清单 + 文件字段：`package.json`；bundle patch：`cordis.patch.yml`
- tsconfig 三件套：`tsconfig.base.json`、`tsconfig.json`
- 测试 harness/Loader 解包断言：`tests/harness.ts`、`tests/plugin.spec.ts`
- 自包含边界校验：`scripts/verify-self-contained.mjs`；prepare：`scripts/prepare.mjs`
- 坑（default export / 整行替换 / `!!js` / allowBuilds）：`README.md`、`docs/dsh-plugin-contracts.md`、`.agents/skills/dsh-plugin-{implement,compose}/SKILL.md`、`patches/README.md`

**dsh-plugin-dev（omdsh-dev）**
- 总纲/速查/交付闭环：`skills/dsh-plugin-dev/SKILL.md`
- 20 坑全表：`skills/dsh-plugin-dev/references/build-pitfalls.md`
- 工具插件骨架：`skills/dsh-plugin-dev/references/tool-plugin.md`
- 挂载/验证：`skills/dsh-plugin-dev/references/bundle-patch.md`；测试分层：`references/testing.md`；发布/hub：`references/publish.md`
- 环境基线（`DSH_PERMISSION_MODE`/MSYS）：`README.md`

**deepseek-harness-plugin-from-scratch（Opr4Mp3r）**
- 六句话/兼容锁定/安装：`README.md`
- 17 反模式：`docs/anti-patterns.md`；交付检查单：`docs/checklist.md`；五层测试与可安装包清单：`docs/05-testing-and-release.md`
- 最小插件三步骤：`docs/01-minimal-plugin.md`；checkpoint 源码：`examples/progressive/src/index.ts`、`examples/progressive/checkpoints/*.ts`
- 审计基线：`audit-manifest.json`；真实 profile 安装验证：`scripts/verify-profile.mjs`

**dsh-plugin-skills（omdsh-dev）**
- 形态分类：`dsh-write-plugin/SKILL.md`
- 工具/服务/hook/config/LLM adapter：`dsh-write-plugin/references/{tool-plugin,service-plugin,hook-plugin,config-plugin,llm-adapter-plugin}.md`
- 测试分层：`dsh-test-plugin/SKILL.md`；安装：`README.md`

**plugin-registry（vlln）**
- 0811 移除告示 + 安装命令：`README.md`
- 时间线（0809→0812 全量）：`CHANGELOG.md`
- bundle vs 纯插件双通道：`docs/plugin-types.md`
- 0809 覆盖度评估 + repository 格式细节：`docs/official-0809-coverage.md`
- 项目导览/约束：`AGENTS.md`；开发 skill：`skills/make-dsh-plugin/SKILL.md`、`skills/make-dsh-plugin/references/gotchas.md`、`bundle-plugins.md`、`entry-contract.md`
- 薄控制台：`packages/plugin/console/src/index.ts`（Node half）、`src/discovery/tools.ts`（plugin_install 等）、`tsdown.config.ts`（dual build + `__ModuleLoader__`）

**dsh-plugin-check（omdsh-dev）**
- 工具声明/检测项/安装：`README.md`；npm rc.1 兼容：`README.md` §npm rc.1
- manifest 校验规则：`src/manifest.ts`；patch 校验：`src/patch.ts`；构建陷阱：`src/build-check.ts`；report/verdict：`src/report.ts`
- 包清单：`package.json`；bundle patch：`cordis.patch.yml`

**dsh-suite（whyihaveyou）**
- 目录/徽章/脚手架总览：`README.md`
- 目录 schema：`docs/catalog-schema.md`；分类：`docs/categories.md`；迁移指南：`docs/migration-guide.en.md`/`.zh-CN.md`
- 收录标准 + 15 条准则：`CONTRIBUTING.md`
- 脚手架：`packages/create-dsh-plugin/{package.json,src/*.js,templates/{tool,events,webui}/**}`（tool 头注坑清单：`templates/tool/src/index.ts`；events 模板：`templates/events/src/index.ts`；PITFALLS 数组：`src/templates.js`）
- 第一方插件：`packages/plugins/plugin-notify/src/index.ts`、`packages/plugins/plugin-session-export/src/index.ts`
- 兼容 CI：`.github/workflows/compat.yml`、`scripts/compat-check.mjs`

**fabric（omdsh-dev）**
- 机制总览/安装：`README.md`、`docs/fabric.md`、`docs/fabric-api.md`
- bundle 载体：`package.json`、`cordis.patch.yml`；核心包：`packages/cordis-fabric/{package.json,src/service.ts,src/node-loader.ts,src/transform.ts,src/module-identity.ts,src/runtime.ts}`；DSH 集成：`packages/cordis-fabric-dsh/src/{index.ts,host-contracts.ts}`
- host patch 分层：`patches/README.md`、`patches/fabric-host-integration.patch`、`patches/host-patch.config.json`；自包含校验：`scripts/verify-self-contained.mjs`

**dsh-turn-meta（randerous）**
- 完整插件源：`src/index.ts`；invariant 伴生：`src/invariant.ts`；tsdown 双 entry：`tsdown.config.ts`；测试：`tests/turn-meta.spec.ts`、`tests/smoke.mjs`；包清单：`package.json`

**deepseek-harness-plugin-mcp（bobleer）**
- 三平面/安装：`README.md`、`docs/design.md`
- bundle patch（`!!js` + 默认关闭授权）：`cordis.patch.yml`；插件入口：`src/dsh-plugin.ts`
- 配置 schema（parseArgs + env）：`src/config.ts`；控制面工具（zod）：`src/mcp/control-tools.ts`；工具名规范化：`src/plugin/names.ts`；MCP server：`src/mcp/server.ts`
- 防递归 env 注入：`src/runtime/host.ts`；`!!js` 检视 tag：`src/plugin/inspect.ts`；`which`/Windows 后缀：`src/profile/dsh-cli.ts`

**dsh-find-plugins（Nagi-ovo）**
- 5 步工作流 + 装法判定：`skills/find-plugins/SKILL.md`
- 装法优先级 + repository 已移除：`skills/find-plugins/references/install-methods.md`
- 检索脚本：`skills/find-plugins/scripts/search-topic.mjs`

**dsh-hub-workshop（omdsh-dev）**
- 信任边界/registry 权威：`README.md`、`SECURITY.md`
- catalog/registry/submission schema：`catalog.schema.json`、`registry-v1.json`、`submission.schema.json`、`catalog.json`
- 硬断言门：`scripts/check-public-site.mjs`；目录生成：`scripts/build-topic-catalog.mjs`
- 前端安装坐标（`&path:`）：`assets/publish.js`、`assets/app.js`、`assets/configurations.js`
- Worker：`worker/public.js`；类型定义：`api/v1/plugin-types.json`

**awesome-dsh-plugins（AdamPlatin123）**
- 定位/快照/最低收录条件/L0-L4：`README.md`；行为契约：`AGENTS.md`
- 两代格式对照：`analysis/plugin-formats.md`；安全清单：`analysis/security-issues.md`；群聊洞察：`analysis/group-chat-plugin-dev-insights.md`
- 15 仓聚合（seam/补丁全景）：`cross-analysis/summary.md`；SOP：`docs/SOP.md`
- 索引状态机：`.mainline-state.json`；引擎：`scripts/compare-mainline.sh`；样例报告：`reports/2026-08-13/dsh-shell-windows.md`

**awesome-dsh-plugin（bruc3van）**
- 收录规则：`README.md`；schema：`catalog/schema.json`；数据：`catalog/plugins.json`
- 生成器/校验：`scripts/generate_readmes.py`；PR 流程：`CONTRIBUTING.md`、`.github/PULL_REQUEST_TEMPLATE.md`；CI：`.github/workflows/validate.yml`

**awesome-DSH-plugin-alexyanggg（Alex-Yanggg）**
- 场景/套装/安全提示：`README.md`；机器快照：`data/repositories.json`；人工层：`data/curated.json`
- 生成器：`scripts/update.mjs`；收录标准：`CONTRIBUTING.md`；自动刷新：`.github/workflows/update-catalog.yml`；全量目录：`CATALOG.md`
