# DeepSeek Harness 官网与文档站调研

> **归档更正（2026-08-13 下载复核）**：本报告撰写时子代理沙箱无法直连外网，文档站"线上渲染页"标为 `[unverified]`。随后知识库下载脚本（`scripts/download-sources.ps1`）在更宽权限下**成功爬取了 GitHub Pages 全站 168 个 HTML 页面**（中英双语，内容已验证含中文正文），归档于 `downloads/web/site/`（下载明细见 `downloads/manifest.tsv`）——本报告中关于页面清单/正文的 `[unverified]` 项已由该爬取解决；`www.deepseek.com/harness/` 页面快照亦已归档于 `downloads/web/deepseek-com-harness.html`。

> 调研目标：
> - 官网入口：`https://www.deepseek.com/harness/`
> - 文档站：`https://deepseek-harness.github.io/deepseek-harness/develop/basic/`（及其下所有可发现页面）
>
> 产出用途：作为插件开发知识库的归档参考材料。语言：中文（保留英文技术术语）。

---

## 0. 调研方法与可信度说明（重要）

1. **文档站内容以仓库源码为权威依据。** 文档站 `deepseek-harness.github.io/deepseek-harness/` 是一个 **VitePress** 站点，由开源仓库 `deepseek-ai/deepseek-harness`（本地 checkout：`D:\deepseek-harness`）中的 `docs/` 目录 + `website/` 投影层（`website/docs.ts` + `website/.vitepress/config.ts`）在构建期生成。因此本报告中的**页面 URL、页面标题、正文内容、代码示例**均来自该权威构建清单与源码文件，而不是抓取线上渲染结果。
2. **线上页面无法从本会话直接抓取。** 本会话的 PowerShell 网络请求被沙箱拦截（`Invoke-WebRequest` 报 "基础连接已经关闭: 接收时发生错误"），且 `web_search` 未索引到 `deepseek-harness.github.io` 的渲染页（`site:deepseek-harness.github.io` 返回无结果）。因此「线上页面是否按清单原样渲染、是否有额外未列出的页面」标记为 **[unverified]**；但「站点结构/路由/标题/内容」来自官方仓库的站点生成清单，视为可靠。
3. **`www.deepseek.com/harness/` 页面内容无法直接获取**，仅能从第三方新闻报道与官方 GitHub README 间接推断，相关内容标记为 **[unverified]**。
4. **版本信息**：本地仓库根 `package.json` 的 `version` 为 **`0.1.0-rc.5`**；README 明确标注 "developer preview / 技术预览"，并警告 "THERE WILL BE COMPATIBILITY-BREAKING CHANGES."（会有破坏兼容性的变更）。
5. **易混淆项提醒**：`web_search` 会返回多个同名但**无关**的第三方项目（例如 `HenryZ838978/deepseek-harness`，一个 "pip install deepseek-harness + MCP" 的 Python 项目），与官方 `deepseek-ai/deepseek-harness` 不是同一项目，本报告不采用其内容。

---

## 1. 站点一：`https://www.deepseek.com/harness/`（官网 Landing 页）

- **URL**：`https://www.deepseek.com/harness/`（目标 URL 之一）
- **状态**：**[unverified]** 未能直接抓取或索引到该页的正文；`site:deepseek.com harness` 仅返回 DeepSeek API 文档站的一篇新闻页（`https://api-docs.deepseek.com/zh-cn/news/news260813/`，与 Harness 无关）。

### 从第三方报道推断的发布事实（均 [unverified]，来自新闻聚合）

| 事实 | 来源 |
|---|---|
| DeepSeek 正式开源 / 公测 "DeepSeek Harness"，时间约 2026-08-13 | [IT之家《对标 Claude Cowork：DeepSeek Harness 公测，同步开放插件生态》](https://www.ithome.com/0/989/446.htm)、[新浪财经](https://finance.sina.cn/tech/2026-08-13/detail-inineuqm9870965.d.html)、[DoNews](https://www.donews.com/news/detail/1/6670452.html)、[网易科技《一切皆插件！DeepSeek Harness正式发布》](https://www.163.com/tech/article/L4892ED600097U7T.html) |
| 定位口号："**AGENT = MODEL + HARNESS**"；与 Claude Code / Claude Cowork 对标（dsh 与 Claude Code 是同类：模型可调用工具完成任务） | [新浪新闻](https://www.sina.cn/news/detail/5331578031178880.html)、[IT之家](https://www.ithome.com/0/989/446.htm) |
| 核心理念："**一切皆插件**"（模型、工具、技能、会话、沙箱等皆为插件） | 同上 |
| 版本：**v0.1 开发者预览版**开放测试 | [星岛 stnn《DeepSeek Harness 的开发者预览版（v0.1 版本）开放测试》](http://www.stnn.cc/detail/6a7dc390bcf6f20e311cbbce.html) |
| 同步开放 **npm 插件生态**（`@deepseek-ai/*` 命名空间） | IT之家、新浪财经 |
| 官方代码仓库：`https://github.com/deepseek-ai/deepseek-harness` | 官方 README |

### 官方 README 中可确认的安装方式（来自仓库，非官网页）

- **从 npm 运行**：`npx @deepseek-ai/dsh web`（默认启动 Web UI，`http://127.0.0.1:3080`）
- **从源码运行**：`git clone https://github.com/deepseek-ai/deepseek-harness.git` → `pnpm install` → `pnpm run build` → `pnpm dsh web`
- **社区**：GitHub Discussions、Discord、插件仓库打 `dsh-plugin` topic 提升可发现性
- **许可证**：MIT

> 结论：`www.deepseek.com/harness/` 极可能是官方面向开发者的落地页（Landing/下载页），但具体文案、下载按钮、是否内嵌文档链接等**均未核实**。

---

## 2. 站点二：`https://deepseek-harness.github.io/deepseek-harness/`（文档站）

### 2.1 站点元信息

- **技术栈**：VitePress（`vitepress ^1.6.4`），带 Mermaid 插件（`vitepress-plugin-mermaid`）。
- **站点标题**：`DeepSeek Harness`；描述：`用于构建 Agent Harness 的插件化 SDK`。
- **双语言（locales）**：
  - `root`（默认）= 简体中文（`zh-CN`），导航栏显示 "技术预览" 标签。
  - `en` = English（`en-US`），URL 前缀 `/en/`，显示 "Preview" 标签。
- **base path**：`/deepseek-harness/`（由构建环境变量 `DOCS_BASE` 控制，默认 `/`；GitHub Pages 部署时为 `/deepseek-harness/`）。
- **生成机制**：`website/docs.ts` 是"规范发布清单"（canonical publication manifest），把仓库各层的 Markdown 源文件映射为双语言路由；`cleanUrls: true`（无 `.html`/`.md` 后缀）。`srcDir: .generated` 说明构建时先把源文件投影到生成目录再交给 VitePress。
- **导航（顶部 nav）**：`入门 / 开发 / 参考`（英文 `Guide / Development / Reference`）。
- **搜索**：VitePress 本地搜索（local provider）。
- **社交链接**：GitHub `https://github.com/deepseek-ai/deepseek-harness`。
- **每页 "在 GitHub 上编辑此页"** 链接指向 `https://github.com/deepseek-ai/deepseek-harness/edit/master/<源文件>`。
- **首页行为**：`docs/user/index.md` 声明 `layout: false` + `<meta http-equiv=refresh content="0; url=./guide/quickstart">`，即首页 **302/refresh 重定向到 `/guide/quickstart`**。

### 2.2 完整页面清单（sitemap / 路由表）

> 下列为**简体中文（root locale）路由**。英文 locale 在每个路由前加 `/en/`。站点根 = `https://deepseek-harness.github.io/deepseek-harness`。

#### 入门 + SDK（Guide / SDK）

| 路由 | 标题（zh / en） | 源文件 |
|---|---|---|
| `/`（首页，重定向到 quickstart） | DeepSeek Harness | `docs/user/index.md` |
| `/guide/quickstart` | 使用 Web UI / Use the Web UI | `docs/user/guide/index.md` |
| `/guide/providers` | 配置模型 / Configure models | `docs/user/guide/providers.md` |
| `/guide/python-sdk` | Python / Python | `docs/user/guide/python-sdk.md` |

#### 开发（Develop）—— 基础 / 框架能力 / 实战 / Cordis 教程

| 路由 | 标题（zh / en） | 源文件 |
|---|---|---|
| `/develop/basic/` | 第一个 Harness 插件 / Your first Harness plugin | `docs/user/develop/basic/index.md` |
| `/develop/basic/tool` | 开发一个 Tool / Build a tool | `docs/user/develop/basic/tool.md` |
| `/develop/basic/config` | 插件配置 / Plugin configuration | `docs/user/develop/basic/config.md` |
| `/develop/basic/publish` | 打包与安装插件 / Package and install | `docs/user/develop/basic/publish.md` |
| `/develop/framework/` | 插件与生命周期 / Plugin lifecycle | `docs/user/develop/framework/index.md` |
| `/develop/framework/service` | 服务与依赖 / Services and dependencies | `docs/user/develop/framework/service.md` |
| `/develop/framework/events` | 事件系统 / Event system | `docs/user/develop/framework/events.md` |
| `/develop/practice/` | 能力的三层拆分 / Capability layering | `docs/user/develop/practice/index.md` |
| `/develop/practice/llm-adapter` | LLM 适配器 / LLM adapter | `docs/user/develop/practice/llm-adapter.md` |
| `/develop/cordis-tutorial/` | 总览 / Overview | `docs/cordis-tutorial/index.md` |
| `/develop/cordis-tutorial/01-first-plugin` | 1. 第一个插件 / Your first plugin | `docs/cordis-tutorial/01-first-plugin.md` |
| `/develop/cordis-tutorial/02-lifecycle-and-effects` | 2. 生命周期与副作用 | `02-lifecycle-and-effects.md` |
| `/develop/cordis-tutorial/03-services` | 3. 服务 / Services | `03-services.md` |
| `/develop/cordis-tutorial/04-events` | 4. 事件 / Events | `04-events.md` |
| `/develop/cordis-tutorial/05-config` | 5. 配置 / Configuration | `05-config.md` |
| `/develop/cordis-tutorial/06-composition-and-hmr` | 6. 组合与热重载 / Composition and HMR | `06-composition-and-hmr.md` |
| `/develop/cordis-tutorial/07-into-the-harness` | 7. 进入 Harness / Into the harness | `07-into-the-harness.md` |

#### 参考（Reference）—— 概念 / 生成参考 / Cordis API / 开发手册 / 子系统

| 路由 | 标题（zh / en） | 源文件 |
|---|---|---|
| `/reference/` | 架构 / Architecture | `docs/architecture.md` |
| `/reference/cordis-primer` | Cordis 入门 / Cordis primer | `docs/cordis-primer.md` |
| `/reference/capability-seams` | 能力服务 / Capability services | `docs/capability-seams.md` |
| `/reference/agent-lifecycle` | Agent 生命周期 / Agent lifecycle | `docs/agent-lifecycle.md` |
| `/reference/tool-execution-pipeline` | Tool 执行 / Tool execution | `docs/tool-execution-pipeline.md` |
| `/reference/config-catalog` | 插件配置 / Plugin configuration（生成） | `docs/config-catalog.md` |
| `/reference/tool-catalog` | Tool Schema / Tool schemas（生成） | `docs/tool-catalog.md` |
| `/reference/persistence-catalog` | 持久化事件 / Persistence events（生成） | `docs/persistence-catalog.md` |
| `/reference/cordis-api/context` | Context | `docs/cordis-api/context.md` |
| `/reference/cordis-api/events` | Events | `docs/cordis-api/events.md` |
| `/reference/cordis-api/fiber` | Fiber | `docs/cordis-api/fiber.md` |
| `/reference/cordis-api/registry` | Plugin Registry | `docs/cordis-api/registry.md` |
| `/reference/cordis-api/service` | Service | `docs/cordis-api/service.md` |
| `/reference/cordis-api/inherited` | 继承接口面 / Inherited surface | `docs/cordis-api/inherited.md` |
| `/reference/cookbook/adding-a-package` | 新增 Package | `docs/cookbook/adding-a-package.md` |
| `/reference/cookbook/adding-a-tool` | 新增 Tool | `docs/cookbook/adding-a-tool.md` |
| `/reference/cookbook/adding-an-llm-adapter` | 新增 LLM Adapter | `docs/cookbook/adding-an-llm-adapter.md` |
| `/reference/cookbook/extension-cookbook` | 扩展模式 | `docs/cookbook/extension-cookbook.md` |
| ~~`/reference/cookbook/adding-a-conversation-node`~~ | （alpha.3 上游已移除该页） | 原 `docs/cookbook/adding-a-conversation-node.md` 已删除 |
| `/reference/subsystems/` | 子系统 / Subsystems | `docs/subsystems/README.md` |

**子系统页**（`/reference/subsystems/<name>`，共约 40 页，按侧栏分组）：

- **总览**：`README`（子系统）
- **内核与作用域**：`core`（核心）、`scope`（作用域）、`invariants`（运行时不变式）
- **会话与持久化**：`session`、`session-query`、`session-reference`、`session-title`、`session-projection`、`persistence`、`spill`、`session-telemetry`
- **模型与上下文**：`llm-streaming`、`token-meter`、`system-prompt`、`compaction`
- **执行与工具**：`tools`、`shell`、`subprocess`、`terminal`、`jobs`、`filesystem`、`lsp`、`code-runtime`、`web`、`skills`、`workflow`、`subagent`
- **策略与交互**：`approval`、`permission-presets`、`sandbox`、`plan`、`user-questions`、`commands`、`goal`、`schedule`
- **平台与接入**：`web-server`、`typert`、`client-modules`、`storage`、`workspace`、`settings`、`credentials`

---

## 3. 逐页详细内容（重点页）

### 3.1 入门（Guide）

#### `/guide/quickstart` —— 使用 Web UI（`docs/user/guide/index.md`）

- **目的**：在 Web UI 跑通第一个任务。
- **内容要点**：
  1. 通过根 README 的 `pnpm dsh web`（或 `npx @deepseek-ai/dsh web`）启动服务器，命令会打印 URL。
  2. **配置模型**：打开 **Settings → Models**，输入 DeepSeek API key 保存；模型路由**无需重启**立即生效。其它 provider 见 `/guide/providers`。
  3. **选择工作区**：点击 **Choose workspace**，添加启动 `dsh` 的目录并选中；未选工作区前会话 composer 不可用。
  4. **运行任务**：如 "Summarize this repository and identify its main packages."。agent 可读写工作区文件、执行命令、委派工作、维护计划；在活动权限策略下需要审批的操作 Web UI 会先询问。
  - 后续：配置模型 / Python SDK / 其它 CLI 模式 / 开发插件。

#### `/guide/providers` —— 配置模型（`docs/user/guide/providers.md`）

- **目的**：配置 DeepSeek、目录 provider、自定义 provider、图像输入、排障。
- **内容要点**：
  - **DeepSeek**：Settings → Models，DeepSeek 卡片只有一个 API key 字段。
  - **密钥只写**：保存后页面只收到脱敏描述符，永不回显明文；key 存于 `$DSH_HOME/.credentials.yaml`，settings 只保留其 credential reference。
  - **目录 provider**：Add provider 可选 Anthropic / OpenAI 等，目录自带 endpoint、协议、模型列表。原生鉴权的 provider（Bedrock/Vertex/Azure/Codex）需要各自原生凭据，仅填 API key 不生效。
  - **自定义 provider**：Add a custom provider，需小写 Provider ID、base URL、API 协议、凭据、至少一个模型。Provider ID 永久（请求、会话、默认模型、凭据引用都依赖它）。
  - **Fetch available models**：走 OpenAI 兼容 `GET /models` 探测。
  - **图像输入**：手输模型默认按纯文本；视觉模型需在 `$DSH_HOME/settings.yaml` 里给模型加 `input: [text, image]`，或用路由级 `defaultInput: [text, image]`；`defaultInput` 是 fallback 非覆盖，默认 `[text]`。目录 provider 用 `modelOverrides`（按 model id）。
  - **排障码**：`MISSING_CREDENTIAL`、`UNKNOWN_MODEL`、401（fetch models）、图像被拒等。
  - 高级：指向生成的 `config-catalog` 与 `dsh-llm-pi-ai` / `dsh-llm-deepseek` README。

#### `/guide/python-sdk` —— Python SDK 快速上手（`docs/user/guide/python-sdk.md`）

- **目的**：以编程方式替代 Web UI。
- **前置**：Python 3.10+；Git；Linux x64/arm64 或 macOS 14+ (arm64)；DeepSeek 兼容端点与凭据；一个可被 agent 修改的隔离工作区。
- **安装**：
  ```sh
  git clone https://github.com/deepseek-ai/deepseek-harness.git
  cd deepseek-harness
  python -m venv .venv && . .venv/bin/activate
  python -m pip install deepseek-harness-sdk
  ```
  （安装的运行时自带 Node.js，无需系统 Node。）
- **跑内置示例**：
  ```sh
  export DEEPSEEK_API_KEY=sk-your-key-here
  # export DEEPSEEK_BASE_URL=http://127.0.0.1:8000/v1
  # export DSH_MODEL=deepseek-v4-flash
  # export DSH_SYSTEM_PROMPT='You are a helpful software engineer assistant.'
  python examples/jsonrpc-agent/minimal.py --workspace /abs/ws --session-root /abs/sessions --session-id example-001 "Inspect the repository and fix the failing tests."
  ```
- **在自有程序里调用**：
  ```python
  from pathlib import Path
  from deepseek_harness import DeepSeekHarness
  config = Path("examples/jsonrpc-agent/minimal.cordis.yml").resolve()
  with DeepSeekHarness(provider="deepseek-official", model="deepseek-v4-flash",
                       max_tokens=49_152, cwd=str(workspace), session_root=str(sessions),
                       cordis=str(config)) as harness:
      result = harness.run("...", session_id="example-001")
  print(result.final_response)
  ```
  - `DeepSeekHarness` 惰性启动 bundled runtime，context manager 退出前复用；复用同一 harness+session id 会保留会话拥有的 Bash 进程（cwd、环境变量、shell 函数）。
- **示例组合事实表**：系统提示词 fallback 为 "You are a helpful software engineer assistant."；模型 `--model → DSH_MODEL → deepseek-v4-flash`；模型可见工具仅 `bash` 与 `str_replace_editor`；bash 超时 300s；编辑器输出上限 16000 字符；compaction 关闭；filesystem 为 bare local backend；会话持久化为未压缩 JSONL（`DSH_SESSION_ROOT`）。
- **安全警告**：该组合用 `danger-full-access`，仅应在一次性 checkout/容器内运行；持久 PTY 后端要求 POSIX，**不支持 Windows agent**。

### 3.2 开发基础（Develop / Basic）

#### `/develop/basic/` —— 第一个 Harness 插件（`docs/user/develop/basic/index.md`）

- **核心定义**：插件是导出 `apply` 函数的 TypeScript 模块，框架加载时调用 `apply` 并传入 `ctx`：
  ```ts
  import type { Context } from '@deepseek-ai/cordis'
  export const name = 'my-plugin'
  export function apply(ctx: Context) { /* 在此注册能力 */ }
  ```
- **在 cordis.yml 中注册**（本地 overlay，插件路径必须绝对路径）：
  ```yaml
  - insert:
      - id: hello
        name: '/absolute/path/to/deepseek-harness/scratch-plugin/src/my-plugin.ts'
  ```
  启动：`pnpm dsh web --patch ./scratch-plugin/cordis.yml`，打开 `http://127.0.0.1:3080`。
- **自动清理**：通过 `ctx` 注册的一切（事件监听、工具、定时器）在插件卸载时自动清理；显式资源用 `ctx.effect()`：
  ```ts
  ctx.effect(() => { const t = setInterval(...); return () => clearInterval(t) })
  ```
- **声明依赖**：`export const inject = ['tools']`；框架会等所有必需服务就绪后再加载。
- **三种插件形态**：
  1. **函数形式**（`export function apply(ctx) {}`）——最常用。
  2. **对象形式**（`export default { name, inject, apply(ctx){} }`）。
  3. **类形式**（`export default class MyService extends Service { static inject=['tools']; constructor(ctx){ super(ctx,'myService') } }`）——提供 service 给其它插件时用。

#### `/develop/basic/tool` —— 开发一个 Tool（`docs/user/develop/basic/tool.md`）

- **工具 DSL**（`defineTool`）：
  ```ts
  import { defineTool } from '@deepseek-ai/dsh-tools'
  export const name = 'greet-tool'
  export const inject = ['tools']
  export function apply(ctx: Context) {
    ctx.tools.register(defineTool({
      name: 'greet',
      description: 'Greet someone by name.',
      parameters: { name: { type: 'string', required: true, description: 'The name to greet' } },
      output: {
        schema: { type: 'string' },
        render: (_args, value) => [{ type: 'text', text: value }],
      },
      async execute(args) { return `Hello, ${args.name}!` },
    }))
  }
  ```
  - `defineTool` 从 `parameters` 推断并校验 `args`；`execute` 返回 `output.schema` 声明的 canonical 值；`output.render` 把 canonical 值转为模型可见内容。
- **测试**：`Use the greet tool to greet Ada.` → 模型调用 `greet`，收到 `Hello, Ada!`。
- 后续指向 `/reference/cookbook/adding-a-tool`（工具作者参考）与 `/develop/practice/`（三层能力拆分）。

#### `/develop/basic/config` —— 插件配置（`docs/user/develop/basic/config.md`）

- **定义 Config 类型 + 同名 Schemastery schema**，默认值写在 schema 字段上：
  ```ts
  import Schema from '@deepseek-ai/schemastery'
  export interface Config { greeting: string; maxRetries: number; verbose?: boolean }
  export const Config: Schema<Config> = Schema.object({
    greeting: Schema.string().default('Hello'),
    maxRetries: Schema.number().default(3),
    verbose: Schema.boolean().default(false),
  })
  export function apply(ctx: Context, config: Config) { console.log(config.greeting) }
  ```
  - 注意：**不要**导出普通对象作为 `Config`，它不实现 Cordis 要求的 Standard Schema 接口。
- **cordis.yml 传配置**：
  ```yaml
  - insert:
      - id: hello
        name: './src/my-plugin.ts'
        config: { greeting: 'Hi there', maxRetries: 5 }
  ```
- **schema 校验**在插件加载期运行，非法配置使加载失败并报可操作错误（"Fail loudly"）。
- **设计原则**：任何"两个部署可能想不同设置"的值都必须是配置字段（禁止硬编码可调值）；自包含约束放 schema，引用其它服务/资源的约束用依赖注入。
- **HMR**：配置改动会热替换插件（旧实例卸载、新实例加载），因为注册是 effect，替换不会残留旧实例的注册。

#### `/develop/basic/publish` —— 打包与安装插件（`docs/user/develop/basic/publish.md`）

- **两个概念、两份 manifest**（都用 `package.json`，但 `dsh` key 不同）：
  - **bundle**：发布配置层的 npm 包，manifest 声明 `dsh.bundle`（"这个包贡献什么"：一个 insert/override 插件行的 patch 文件）。
  - **profile**：`$DSH_HOME/profiles/<name>` 下的目录，描述一个可运行组合，manifest 声明 `dsh.profile`（"哪些 bundle 按什么顺序组合"）。**二者互斥，一个包不能既是 bundle 又是 profile。**
- **bundle manifest 示例**：
  ```json
  {
    "name": "dsh-hello-plugin", "version": "0.1.0", "type": "module",
    "main": "index.js", "files": ["index.js", "cordis.patch.yml"],
    "dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
  }
  ```
  `cordis.patch.yml`（插件行按包名引用，走 Node 解析）：
  ```yaml
  - insert:
      - id: hello
        name: dsh-hello-plugin
  ```
  - 无 `dsh.bundle` 的包仍可安装，但只作为普通依赖，`dsh plugin` 打印警告且不激活层。
- **安装到 profile**：`dsh plugin --profile demo add ./hello-plugin`（转发到 pnpm，支持所有 pnpm 动词）。
  - 首次使用初始化 profile（首个 bundle 为 `@deepseek-ai/dsh-base`），生成：
  ```json
  { "name": "dsh-profile-demo", "private": true,
    "dependencies": { "dsh-hello-plugin": "link:/path/to/hello-plugin" },
    "dsh": { "profile": { "bundles": ["@deepseek-ai/dsh-base", "dsh-hello-plugin"] } } }
  ```
  - `dsh --profile demo --dump-config` 显示 `# == dsh-hello-plugin` 层；`dsh --profile demo` 启动；`dsh plugin --profile demo remove dsh-hello-plugin` 移除依赖与层。
- **加载顺序（层序）**：空根之上依次应用：① profile `dsh.profile.bundles` 列表顺序（`dsh-base` 最先）→ ② profile 自有 `cordis.patch.yml` → ③ 机器级 `$DSH_HOME/cordis.patch.yml` → ④ 每个 `--patch <path>` overlay（argv 顺序）。**后层按 row 取胜**，patch 替换整行 `config`（不深合并）。
- **GitHub 安装的 build-script 陷阱**：`dsh plugin --profile demo add github:you/hello-plugin` 拉的是**源码**；作者需提供自包含 `prepare` 脚本（`turtle-ui` 是范例），用户需在 profile 的 `pnpm-workspace.yaml` allowlist `allowBuilds`（pnpm ≥10 默认拒绝 git 依赖的 prepare）。或直接发布 npm 预构建产物 / `pnpm pack` tarball。

### 3.3 框架能力（Develop / Framework）

#### `/develop/framework/` —— 插件与生命周期（`docs/user/develop/framework/index.md`）

- **Fiber 状态机**：
  ```
  PENDING → LOADING → ACTIVE
                   ↘ FAILED
  ACTIVE → UNLOADING → DISPOSED
  ```
  - PENDING（声明但依赖未就绪）/ LOADING（`apply` 执行中）/ ACTIVE / FAILED（`apply` 抛错）/ UNLOADING / DISPOSED。
- **依赖驱动加载**：`inject` 等待服务；服务消失（如 provider 替换）时插件自动卸载（ACTIVE→DISPOSED），服务回归时重新加载。
- **自动清理**：框架跟踪并 dispose：`ctx.on(event, handler)`、`ctx.tools.register(tool)`、`ctx.llm.registerAdapter(names, adapter)`、`ctx.effect(() => cleanup)`。卸载时 disposer **逆序**执行，多个异步 disposer 并发执行（无串行完成保证）；顺序相关的清理放同一个 `ctx.effect()` 内串行 await。
- **嵌套上下文**：`ctx.plugin(childPlugin)` 创建子 Fiber，继承父上下文但独立生命周期。
- **手动 dispose**：`const fiber = ctx.plugin(myPlugin); await fiber.dispose()`（保证：移除全部注册、递归卸载子插件、promise 在所有异步清理完成后 resolve）。
- **HMR**：加载 `@deepseek-ai/cordis-plugin-hmr` 后编辑源码触发 unload 旧插件 → 载入新代码 → 运行新 `apply`。

#### `/develop/framework/service` —— 服务与依赖（`docs/user/develop/framework/service.md`）

- **什么是服务**：`tools`、`llm`、`agents` 都是服务，是挂在 `ctx` 上的命名能力（`ctx.tools` / `ctx.llm` / `ctx.agents`）。任何插件都能提供或消费服务。
- **消费**：`export const inject = ['tools']`，`apply` 运行时 `ctx.tools` 已就绪；未就绪则等待。
- **提供（类形式）**：
  ```ts
  import { Service, type Context } from '@deepseek-ai/cordis'
  export default class MetricsService extends Service {
    static inject = ['llm']
    constructor(ctx: Context) { super(ctx, 'metrics') }
    record(event: string, value: number) { /* ... */ }
  }
  ```
  消费者随后用 `inject = ['metrics']` 访问 `ctx.metrics.record(...)`。
- **类型声明（declaration merging）**：
  ```ts
  declare module '@deepseek-ai/cordis' { interface Context { metrics: MetricsService } }
  ```
- **依赖行为**：必需依赖用 `inject`；可选依赖省略 `inject`，用 `ctx.get('metrics')` 查询（返回 `undefined` 时安全跳过）。必需服务消失→依赖插件 dispose，服务回归→重新加载。
- **服务隔离（isolate）**：`cordis.yml` 可用 `@deepseek-ai/cordis-plugin-group` + `group: true` + `isolate: { shell: true }` 让不同插件组看到独立的同名服务实例（示例中 group-a/group-b 各自 `timeoutMs: 5000` / `60000` 互不影响）。
- **内置服务**：由仓库生成到各 subsystem 页（`subsystems/core.md`）的 "generated regions"，开发插件时以这些 + TypeScript 接口为准，不维护第二份静态列表。

#### `/develop/framework/events` —— 事件系统（`docs/user/develop/framework/events.md`）

- **基本用法**：`ctx.on('event-name', payload => ...)` 监听；`ctx.emit('event-name', payload)` 派发。
- **四种事件模式**（详见 Cordis API）：
  - `emit`（广播）：同步执行，忽略返回值。
  - `bail`（短路）：按序执行，第一个非 `null/false/undefined` 返回值成为最终结果。
  - `serial`（有序）：按注册序 await，首个非 null/false/undefined 结果停止后续。
  - `waterfall`（管道）：每个监听器包装下游结果；**必须调用 `next()` 委派**，否则短路。
- **类型化事件（declaration merging）**：
  ```ts
  declare module '@deepseek-ai/cordis' {
    interface Events {
      'my-plugin/ready': (payload: { id: string }) => void
      'my-plugin/transform': (input: string, next: () => Promise<string>) => Promise<string>
    }
  }
  ```
- **命名规范**：Cordis 事件用 `namespace/action`，如 `agent/step`、`agent/request`、`agent/request-error`、`tools/result`、`session/event`。
- **与持久化会话事件的区分**：`turn/*`、`step/*`、`tool/call`、`tool/result`、`compaction/*` 是 **durable session-event 类型**（不是同名 Cordis 事件）；要观察它们就监听 `session/event` 并检查 `event.type`。
- **监听器是 effect**：`ctx.on()` 注册的监听器随插件卸载自动移除。
- **示例（日志插件）**：监听 `tools/result`，打印工具名/参数/结果文本。

#### `/develop/practice/` —— 能力的三层拆分（`docs/user/develop/practice/index.md`）

- **概念**：当能力通用到需要可替换 provider（如 Bash 执行）时，拆成三个角色：**Service Definition / Service Provider / Consumer**。三者在需独立演化/替换时放独立包；完整能力是它的 **seam（接缝）**，单个角色不是 seam。
- **Bash 例子**：
  - Service Definition = `dsh-shell`（定义 Cordis 服务 + Bash 请求/结果类型）
  - Service Provider = `dsh-bash-local`（本机执行命令）
  - Consumer = `dsh-tool-bash`（把能力暴露为模型可调用工具），`inject: ['shell']`
- **收益**：可换 provider（`cordis.yml` 换一行包名，Definition 与 tool 不变）；独立演化；解耦（Provider 与 Consumer 互不依赖，都只依赖 Definition）。
- **教程（三步）**：写 Definition（抽象类 `MyCapService extends Service` + `MyCapRequest`/`MyCapResult` 类型）→ 写 Provider（`ctx.plugin(MyCapLocal)`）→ 写 Consumer（`inject: ['tools','myCap']` 注册 `defineTool`）→ `cordis.yml` 组合两行。
- **设计要点**：不要过早拆分；Definition 拥有 Request/Result 类型；"Explicit > implicit"（用显式 `resolve(request): Spec` 步骤解析默认值，而非在 `run()` 里藏 `?? default`）。

#### `/develop/practice/llm-adapter` —— LLM 适配器（`docs/user/develop/practice/llm-adapter.md`）

- **总览**：适配器 extends `LlmAdapter` 并实现 `stream()`，把 Harness 的 provider-neutral 请求转成 provider API 调用，再把响应转回 Harness chunks。
- **最小实现**：
  ```ts
  import { LlmAdapter, type GenerateOptions, type StreamChunk } from '@deepseek-ai/dsh-llm'
  class MyAdapter extends LlmAdapter {
    async *stream(options: GenerateOptions): AsyncIterable<StreamChunk> { /* ... */ }
  }
  export const inject = ['llm']
  export function apply(ctx, config) { ctx.llm.registerAdapter(config.providers, new MyAdapter(config.apiKey)) }
  ```
- **StreamChunk 协议**（关键规则）：
  - `{ type: 'block-start', index, blockType: 'text'|'tool-call' }` 开始每个内容块；`{ type: 'text-delta', index, text }` 流式文本；`{ type: 'block-end', index, block }` 结束并给完整块。
  - 工具调用块用 `tool-call-delta`（`argumentsDelta` 携带原始 JSON，可一次或分多段）+ `block-end`（含 `CallId`、`name`、`arguments`）。
  - `{ type: 'usage', usage: { inputTokens, outputTokens } }`（在 finish 之前）；`{ type: 'finish', reason: { kind: 'stop' | 'tool-calls' } }` 是最后一块。
  - 每个 `block-start` 配一个 `block-end`；`index` 从 0 递增。
- **GenerateOptions**：含 model、adapter 自有 reasoning-effort id、会话历史、系统提示词、工具 schema、生成参数、stop sequences、abort signal；以 `@deepseek-ai/dsh-llm` 导出的类型为准。无法满足的字段抛 `LlmError`（带稳定 code），不要静默丢弃。
- **resolveModel / listModels**：`resolveModel(provider, model, signal?)` 返回精确 provider/model 身份 + 可选 `context`/`reasoning` 元数据；`listModels()` 向选择器广告模型。
- **cordis.yml 用法**：`apiKey: !!js process.env.MY_API_KEY`，`agent-loop` 行里 `agents: [{ id, provider, model }]`。
- **参考实现**：`packages/llm/llm-deepseek/`（OpenAI 兼容格式）、`packages/llm/llm-pi-ai/`（不同 API 格式）。
- **错误处理**：传输/协议失败抛 `LlmError`（稳定 code）；每次 HTTP 请求必须合并 `attributionHeaders()` 并转发 `options.signal`。

### 3.4 Cordis 教程（`/develop/cordis-tutorial/*`）

- **总览**（`index.md`）：Cordis 是 Harness 底层的 vendored 插件框架，"每个能力都是挂到共享 context 的插件"。**无需 API key**，全程 keyless。运行方式（在 `tmp/cordis-tutorial` 内）：
  ```sh
  node --import tsx ../../vendor/cordis/bin.js
  ```
  该单文件 launcher 创建根 `Context`、挂载 Loader、加载 `./cordis.yml`。
- **七章**：① 第一个插件（插件是函数，loader 挂载）② 生命周期与副作用（Cordis 管理的注册随插件卸载撤销）③ 服务（在 `ctx` 暴露能力并用 `inject` 依赖）④ 事件（类型化事件、广播派发、waterfall 短路）⑤ 配置（`cordis.yml` 校验配置，坏输入 fail loud）⑥ 组合与热重载（配置文件即插件树、HMR、诊断永不加载的插件）⑦ 进入 Harness（对真实 harness 服务注册模型可调用工具）。

### 3.5 参考（Reference）

#### `/reference/` —— 架构（`docs/architecture.md`）【核心】

- **Cordis**：dsh 底下的框架；插件向共享 context 贡献服务、类型化事件、可逆 effect。产品的**每个部分都是插件**（模型适配器、工具注册表、会话日志、agent loop 本身），均可从配置替换。**没有需要 patch 的特权核心**。
- **Profiles 与 bundles**：
  - **profile** = Harness home 里的命名组合，列出所叠加的 bundle、持有 out-of-tree 插件、保留用户自己的 `cordis.patch.yml`。`web` 与 `headless` 作为模板发布。
  - **bundle** = Cordis 配置行 + 其挂载代码的分发格式。
  - 各自在 `package.json` 的 `dsh` 字段声明：`dsh.profile`（profile 的 bundle 列表）与 `dsh.bundle`（指向 patch 文件）。
  - `dsh-base` 是每个 profile 的第一层（模型适配器、工具、持久化、沙箱/审批策略、设置、凭据、遥测）；`dsh-web-app` 加浏览器应用；`dsh-headless` 加无服务器的 one-shot runner。
  - 查看实际启动的树：`dsh --profile web --dump-config`。
- **核心包表**：`core/session`→`ctx.sessions`（append-only `SessionEvent` 日志 + 内存 store）、`core/system-prompt`→`ctx.systemPrompt`（prompt 段与 tool schema 组装）、`core/tools`→`ctx.tools`（scoped 工具注册表 + 守卫执行管线）、`core/agent`→`ctx.agents`（`Agent` 接口 + 活跃注册表 + `agent/*` 事件）、`core/agent-loop`→`ctx.agentLoop`（默认 driver）、`core/scope`（库，无 key）、`llm/llm`→`ctx.llm`（消息/流词汇 + 适配器 seam）。
- **事件即扩展点**：会话事件（durable 事实，经 `session/event` 广播）、Agent 事件（`agent/*`，携带活跃 `Agent`）、能力事件（`fs/*`、`tools/*`、`telemetry/*`，给 seam 挂策略/适配器）。`event-producer-consumer.md` 列每个事件的生产者/消费者。
- **Turn flow（转流）**：step = 一次模型请求 + 其调用的工具；turn = 0..n step。给出完整事件序列：
  ```
  turn/start → claim input → assemble prompt+tools → agent/pre-step (waterfall)
  → step/start → user/message → derive history → agent/request (waterfall)
  → llm/stream → assistant/chunk* → assistant/message
  → tool/call* → tools/pre-execute → tools/execute → tools/post-execute → tool/result*
  → step/end → (下一个 step 或) agent/turn-stopping (serial) → turn/end
  ```
  - `agent/pre-step`、`agent/request`、`llm/stream`、三个 `tools/*` 是 waterfall（必须 `next()`）；`agent/turn-stopping` 是 serial 且无 `next()`。
- **会话日志**：模型所见上下文的唯一来源；`deriveMessages()` 从日志投影历史；"**Model-visible means logged**"（模型可见 ⟺ 已记录），新增模型可见输入必须新增 session event。
- **能力接缝（capability seams）**：seam = 三角色可替换能力（Definition/Provider/Consumer）；换一个 provider 即可改变整个产品（如把 fs/subprocess 指向远程沙箱，Bash/PTY/LSP 一并迁移）。
- **新行为去哪**（扩展点速查表）：加模型 provider→`ctx.llm` 注册适配器；加模型可见能力→`ctx.tools` 注册；给单个会话换能力集→agent preset + `isolate`；加 shell→`ctx.shell`；加持久终端→`ctx.terminals` + `dsh-tool-terminal`；加人工命令→`ctx.commands`；加后台任务→`ctx.jobs`（`job_*` 工具）；加文件系统/策略→`ctx.fs` provider 或 `fs/*` 事件；限制子进程→`ctx.sandbox`；拦截请求/工具/回合→`agent/*` 或 `tools/*` 事件；加模型可见上下文→`agent.inject()`；加 UI/编辑器集成→驱动 `ctx.agents` + 渲染 `session/event`；加 Web 客户端 Chat 节点→`ConversationNodeDefinition` + keyed renderer；加持久会话状态→扩展 `SessionEventMap`；生成会话标题→`ctx.sessionTitle` provider；管理同会话目标→`ctx.goals`；fork 会话→`ctx.sessions.fork(...)`；作用域到单 agent→该 agent 的 `agent.ctx`。

#### `/reference/cordis-primer` —— Cordis 入门（`docs/cordis-primer.md`）

- **五个核心理念**：① 插件是实现 Service 的对象（函数 + 可选 `inject`/`apply(ctx)`，或 `Service` 子类）；② context 是服务的仓库（服务认领稳定 `ctx.<key>`，如 `ctx.tools`/`ctx.llm`/`ctx.sessions`）；③ 用 `inject` 声明依赖（按服务需求表达加载顺序，而非手动引导顺序）；④ 类型化事件用于通信（`emit`/`waterfall`/`parallel`/`serial`）；⑤ 注册是可逆 effect（prompt 段、tool schema、适配器、provider、监听器都经 `ctx.effect()`/`ctx.on()` 安装，可逆卸载）。
- **派发模式表**：`emit`（不 await、注册序、无返回）、`waterfall`（不 await、注册序、有返回）、`parallel`（await、并发、无返回）、`serial`（await、注册序、有返回）。派发模式是事件公共契约的一部分，新事件用 `@mode` 标注。
- **waterfall 语义**：around-middleware，监听器收 `(...args, next)`；`next()` 委派，不调 `next()` 短路；`prepend: true` 让监听器先于普通注册运行。
- **Loader 配置**：`@deepseek-ai/cordis-plugin-include` 把 `!!js` 解析为表达式节点；Loader 在注入激活后、针对插件上下文插值 entry 的 `config`，并在每次挂载决策时针对 loader 上下文插值 `disabled`；其余元数据保持字面量。
- **实用规则**：工具管线事件属于 `ctx.tools`、模型流式属于 `ctx.llm`、活跃 agent 协调属于 `ctx.agents`；拦截/策略用事件，直接能力调用用服务方法；每个注册要有 disposer。

#### `/reference/cordis-api/context` —— Context（生成自 `vendor/cordis/src/context.ts`）

- Context 是核心 Cordis 对象；`ctx` 是 proxy，普通属性读走服务解析器；`extend()`/`isolate()`/`intercept()` 创建 scoped 子 context 而不改父级。
- 关键成员：
  - `ctx.extend(meta?)` 子 context（原型继承父属性，`meta` 自有属性遮蔽继承属性）
  - `ctx.isolate(name, label?)` 为 `name` 服务建立独立 scope
  - `ctx.intercept(name, config)` 服务级 intercept 配置合并
  - `ctx.root`（应用根 context，@experimental）、`ctx.baseUrl`、`ctx.events`（事件总线）、`ctx.logger`、`ctx.reflect`、`ctx.registry`
  - **服务仓库**：`ctx.get(name, strict?)`（无 inject 要求读服务，默认只返回当前活跃 fiber 提供的实现）、`ctx.set(name, value)`（仅提供服务者本人可写）、`ctx.provide(name, value)`（注册服务实现，返回 disposer）、`ctx.accessor(name, options)`（计算属性 get/set 钩子）、`ctx.mixin(name, mixins)`（把服务的成员直接暴露到 `ctx`，如 `ctx.on` → `ctx.events.on`）。
  - 静态：`Context.is(value)` 跨 realm 判断是否 Cordis context。

#### `/reference/cordis-api/service` —— Service（生成自 `vendor/cordis/src/service.ts`）

- `Service` 是 context 服务的基类；子类在构造函数调用 `super(ctx, name)`，服务立即注册并随 owning fiber 自动移除。`service.name` 为注册名。
- 静态符号成员（协议槽）：`Service.init`（构造后运行的实例方法）、`Service.check`（传给 `ctx.provide()` 的可用性谓词）、`Service.config`（phantom intercept-config 类型参数）、`Service.invoke`（使服务可调用，如 `ctx.logger()`）、`Service.extend`、`Service.tracker`、`Service.resolveConfig`。

#### `/reference/cordis-api/events` —— Events（生成自 `vendor/cordis/src/events.ts`）

- 派发方法（混入每个 context）：`ctx.parallel`（并发 await 所有监听器）、`ctx.emit`（同步、忽略返回）、`ctx.serial`（按序 await 至首个 bail）、`ctx.bail`（按序同步至首个 bail）、`ctx.waterfall`（末参为 `next` 续延）。
- 注册：`ctx.on(name, listener, options?)`（返回 disposer）、`ctx.once(...)`（首次调用后自动 dispose）。
- `EventOptions`：`{ prepend?: boolean; global?: boolean }`。
- `DispatchMode` 类型：`'emit' | 'parallel' | 'serial' | 'bail' | 'waterfall'`。

#### `/reference/cordis-api/registry` —— Plugin Registry（生成自 `vendor/cordis/src/registry.ts`）

- `ctx.inject(deps, callback)`：`ctx.plugin({ inject, apply: callback })` 的简写；必需服务变化时卸载并重跑。
- `ctx.plugin(plugin, ...args)`：加载函数/类/`{apply}` 对象插件；返回 Fiber（await 它等待加载完成，配置/启动错误会 reject）。
- `Plugin` 类型（三种入口形态）+ `Plugin.Base` 元数据：`name?`、`Config?`（StandardSchemaV1 validator）、`inject?`、`provide?: string|string[]`、`intercept?`。
- `Inject` 类型：数组形式（无 intercept 配置）或对象形式（服务名 → 可选 intercept 配置）。

#### `/reference/cordis-api/fiber` —— Fiber（生成自 `vendor/cordis/src/fiber.ts`）

- Fiber = 一个已加载插件实例（生命周期状态、校验后的配置、已注册 effect）。`ctx.fiber` 是当前 fiber；`ctx.effect()` 委托给它。
- `ctx.effect(execute, label?)`：立即执行 `execute`，其产生的 disposer 在 disposer 被调用或 fiber 卸载时（逆序）执行；重复调用 disposer 是 no-op；已 dispose 抛 `CordisError('INACTIVE_EFFECT')`。
- Fiber 类成员：`uid`（root 为 0，dispose 后为 null）、`ctx`、`config`、`state`（状态转移发 `internal/status`）、`dispose()`、`store`、`inertia`、`name`、`assertActive()`、`getEffects()`、`await()`、`restart()`、`update(config, noSave?)`（先跑 `internal/update` waterfall，HMR/更新钩子可 veto 或替换重启）。
- `Effect` 类型（单 disposer / promise / (async) iterable）、`Disposable`、`EffectMeta`、`CordisError`（稳定 code）、`ValidationError`（StandardSchemaV1 校验失败）。

#### `/reference/cordis-api/inherited` —— 继承接口面（生成）

- 列出插件可见的框架级 `ctx` 成员与事件（vendor 层）：
  - 成员：`ctx.on/once`、`ctx.emit/parallel/serial/bail/waterfall`、`ctx.plugin/inject`、`ctx.effect`、`ctx.get/set/provide/accessor/mixin`、`ctx.extend/isolate/intercept`、`ctx.root/scope/fiber/registry/reflect/events/logger`、`ctx.timer`（+ interval/timeout/throttle/debounce）、`ctx.loader`、`ctx.hmr`。
  - 事件：`internal/plugin`、`internal/status`、`internal/service`、`internal/update`（waterfall）、`internal/get`、`internal/set`、`internal/listener`、`internal/dispatch`、`hmr/change`、`hmr/reload`、`exit`、`loader/config-update`、`loader/entry-init`、`loader/partial-dispose`、`loader/patch-context`。

#### `/reference/capability-seams` —— 能力服务（生成，`docs/capability-seams.md`）

- 一份 **Mermaid 图 + 表格**，列出全部 `ctx.*` 服务：Role（`core` / `seam` / `bundle`）、Owner 包、实现包、直接消费者、companion 插件与说明。
- 关键 seam 举例（表格行）：`ctx.llm`（seam；`llm-deepseek`/`llm-pi-ai`/`llm-replay` 实现）、`ctx.shell`（seam；`bash-local`/`bash-sandbox`/`pwsh-local`）、`ctx.fs`（seam；`fs-local`/`fs-sandbox`/`fs-e2b`）、`ctx.subprocess`、`ctx.sandbox`、`ctx.terminals`、`ctx.web`（`web-search-exa/perplexity/deepseek` + `web-fetch-http`）、`ctx.compaction`、`ctx.subagents`、`ctx.skills`、`ctx.sessionPersistence`（`jsonl`）、`ctx.sessionQuery`、`ctx.storage`、`ctx.settings`、`ctx.credentials`、`ctx.workflowEngine`、`ctx.lsp`、`ctx.jobs` 等。core 服务如 `ctx.tools`、`ctx.sessions`、`ctx.systemPrompt`、`ctx.agents`、`ctx.agentLoop`（bundle）。
- 完整消费者/实现关系图可作插件开发者的"服务地图"。

#### `/reference/config-catalog` —— 插件配置目录（生成，`docs/config-catalog.md`，约 3151 行）

- 收录**每个可加载 harness 包**的 `config:` 块可设字段（含 JSDoc），是 **deployment 轴**的参考。每个条目：`Requires:`（该插件 inject 的服务键）、配置声明块、`Depends on:`、`Source:`（源码位置）。
- 示例（`@deepseek-ai/dsh-acp`：`provider?`/`model?`/`stream?`；`dsh-acp-demo`：`provider`/`model`/`maxParallelToolCalls`/`persona`/`toolOrder`/`tools`/`dshHome`/`sessionTitle`/`persistenceRoot`/`packChunks`/`workspaceContext`/`skills`/`toolBash`/`jobs`/`toolJobs`/`goals` 等）。
- 注意：运行时 schema 刻意排除的字段是 runtime-only seam（JSDoc 会注明），**不能从 cordis.yml 设置**。vendored cordis 插件（hmr、console logger）不在目录内。

#### `/reference/tool-catalog` —— Tool Schema 目录（生成，`docs/tool-catalog.md`，约 1873 行）

- 收录**每个出厂插件贡献给 `ctx.tools` 的模型可见工具**：`name`、`description`、JSON-Schema `parameters`。该生成器会真实 boot 每个工具插件并读 `ctx.tools.schemas()`（因为 schema 无法静态得知）。
- **工具包映射表**（模型可见名 → 包 → Requires → 写入/影响 → 别名 → 部署说明）。示例：`bash`（dsh-tool-bash）、`pwsh`、`edit/read/read_image/write`（dsh-tool-fs）、`glob/grep`（dsh-tool-fs-search）、`web_fetch/web_search`（dsh-tool-web）、`subagent`（别名 `subagent_fork`）、`todo_write`、`run_code`（dsh-tools 保留传输）、`exit_plan_mode`、`ask_user_question`、`create_goal/get_goal/update_goal`、`job_kill/job_list/job_output`、`terminal_*`、`lsp`、`workflow`、`ralph`、`skill`、`cordis_*`（自引用工具集，默认不挂载）等。
- 每个工具随后给出完整 JSON Schema。

#### `/reference/cookbook/adding-a-tool` —— Tool 作者参考（`docs/cookbook/adding-a-tool.md`）【重要】

- **最小形态**（同 `defineTool`）。
- **`execute()` 契约规则**：
  - 参数已被校验：`defineTool` 在 `execute` 前对 `arguments` 做运行时校验（类型、必填键、字面约束、exact-one 联合、嵌套值）；DSL 不表达的约束（非空串、正数、跨字段规则）仍需自检。
  - 注册借用你的 readonly 定义；不可在注册后改 schema/替换回调；热替换 = dispose 拥有 effect 再注册新工具。
  - 执行身份受保护：`arguments` 以 detached lossless JSON 物化并冻结；`exec.token`、`callId`、`name`、`agent`、`signal` 不可变；`parent` 仅身份。`args` 视作只读输入。
  - 声明并返回**一个 canonical JSON 值**（`output.schema` 用 `ValueSchemaSpec`，根可为对象/数组/标量/null）；`execute` 只返回推断值，`output.render(args, value)` 负责转模型内容。
  - 抛错或返回非法值 → `isError`；基础设施失败用抛错；非零退出码等"非理想但成功"用 canonical 值表达。
  - 遵守 `exec.signal` 取消。
  - `output.presentationMeta(args, value)` 投影可回放的卡片数据（持久化在 `tool/result`）。
  - `exec.agent` 用于异步通知（`agent.inject(...)` 追加下一条模型请求可见的持久上下文，不是唤醒）。
- **长任务**：`run_in_background` 用 `ctx.jobs.start({ kind, label, owner: exec.agent, run })`；发布后 id 用任务自有取消信号而非 `exec.signal`；后台成功分支返回 `{ kind: 'background', jobId }`。
- **执行策略与观察**：`tools/pre-execute`（allow/deny/ask 策略）、`ctx.tools.guard()`（最终单调 deny）、`tools/execute`（包裹派发）、`tools/post-execute`（替换呈现/返回值/拦截结果/附加上下文）、`tools/result`（观察不可变规范化结果）。
- **Code Mode 免费覆盖**：Code Mode 下每个可见工具自动可用 `await tools.<name>(args)`，类型从同一 schema 生成。
- **UI 渲染**：`presentCall(args)`（generic/terminal/diff）与 `presentResult(...)`（generic/terminal/diff/search/web），返回 `card`-tagged render intent；必须是 `args`(+result) 的纯函数（直播流与 session-log REPLAY 都运行，禁 I/O/会话状态/时钟/随机）。`locations`、diff hunks 等。

#### `/reference/agent-lifecycle` / `/reference/tool-execution-pipeline` / `/reference/persistence-catalog`

- （未逐页细读）分别对应 Agent 生命周期序列图、工具执行管线、持久化事件目录；架构页已给出其核心要点。

### 3.6 CLI 行为参考（`apps/cli/reference/README.md`，仓库内，非文档站页但被文档站多处链接）

- **Profile boot**：`dsh --profile <name>` 启动 `$DSH_HOME/profiles/<name>`；层序同 publish.md；SIGINT/SIGTERM 先 dispose 挂载的 root。
- **bundle 解析顺序**：先从 dsh 安装解析，再从 profile 目录；in-box bundle（`dsh-base`/`dsh-web-app`/`dsh-headless`）总是来自同一安装；out-of-tree 来自 profile 的 pnpm `node_modules`。裸插件 `name` 经 profile 目录 Node parent-walk 解析，落到安装 fallback `$DSH_HOME/profiles/node_modules`。
- **`web`/`headless` profile 首次使用自动从模板初始化**（web = base+web-app；headless = base+headless）；其它缺失 profile 报错并提示 `dsh plugin --profile <name> add <package>`。
- **App 参数**：launcher 参数在首个不识别 token 处结束，其余经 `ctx.cmdlineArgs` 交给 app；`--help` 打印对应 app 帮助；`-V/--version` 打印 launcher 版本。出厂 app：`web`（`--host`/`--port`/`--trusted-host`）、`headless`（任务文本为 positional）。
- **headless**：`dsh --profile headless "run the tests"` 建一个持久 Agent、提交任务、等 quiescence、flush Session，stdout 打印最后非空 assistant 文本，`completed` 退 0，否则 1。
- **dump**：`--dump-default-config`（仅 bundle 层）与 `--dump-config`（+ profile/home patch + `--patch` overlay）；打印每行来源注释；`!!js` 不求值；未匹配 patch 目标报 stderr。
- **插件管理**：`dsh plugin --profile <name> <args...>` 转发到 pnpm；成功后把 `dsh.profile.bundles` 与已安装状态对账（含 `dsh.bundle` 声明者加入层栈）。
- **Web 别名**：`dsh web` = `--profile web`；生产 Web runner 需 `pnpm run build`，默认 `http://127.0.0.1:3080`；**不支持 `--host 0.0.0.0`**；`--trusted-host` 添加 `/api` 浏览器信任栅栏接受的主机名。
- **部署行为**：所有模式把调用目录当默认工作区根，加载 `AGENTS.md`/`CLAUDE.md`（渲染预算 65536 字节），用内存 SQLite 会话内容索引；新会话默认 `workspace-write` 权限预设；`DSH_PERMISSION_MODE` 改进程 fallback；`DSH_TOOLS_MODE` 选 `native`/`code`/`both`；base bundle 挂原生 DeepSeek 适配器、settings/credentials provider、`web_search`、默认关闭会话遥测；凭据解析顺序 `环境 → $DSH_HOME/.credentials.yaml → 调用目录 .env → $DSH_HOME/.env`；`DSH_TELEMETRY_MODE`（FULL/FEEDBACK_ONLY）、`DSH_TELEMETRY_OTLP_URL`、`DSH_TELEMETRY_DISABLED`（硬退出开关）。
- **源码执行**：`pnpm run build` 后 `pnpm dsh <args...>`（经 `node --import tsx/esm` 跑 `apps/cli/src/bin.ts`，不构建）；安装形态跑构建后的 `apps/cli/lib/bin.js`。

---

## 4. 跨页核心概念综合（插件开发知识库要点）

### 4.1 插件模型（Plugin Model）

- 插件 = 导出 `apply(ctx)` 的模块（或对象/类）。`name`、`inject`、`Config`、`provide`、`intercept` 为元数据。
- 一切皆插件；每个能力都是挂到共享 `Context` 的插件；没有特权核心。
- 生命周期 = Fiber 状态机（PENDING→LOADING→ACTIVE/FAILED→UNLOADING→DISPOSED），依赖驱动加载。
- 注册是 effect：所有注册（`ctx.on`、`ctx.tools.register`、`ctx.llm.registerAdapter`、`ctx.effect`）随插件卸载自动逆序清理。

### 4.2 cordis.yml 配置

- YAML 数组，元素是 patch（`insert:` / 按 id override）或插件行（`id`/`name`/`config`/`inject`/`isolate`/`group`）。
- 插件行 `config` 走同名 Schemastery schema 校验；`!!js` 表达式（注意是 `!!js`，不是 `!js`）在注入激活后针对插件上下文插值。
- 层序：profile bundles → profile `cordis.patch.yml` → home `$DSH_HOME/cordis.patch.yml` → `--patch` overlay；后层按行取胜，整行 `config` 替换。
- `--patch` 只贡献配置，不改变模块路径解析的 profile 目录；本地插件路径须绝对路径（或相对解析自 profile 目录）。

### 4.3 Service Definition / Provider / Consumer（能力接缝）

- 三层：Definition（接口+请求/结果类型）→ Provider（实现）→ Consumer（通常模型可见工具）；Definition 拥有类型；Provider/Consumer 互不依赖。
- 服务通过 `ctx.<key>` 暴露；`inject` 声明依赖；类形式 `Service` 子类 + `super(ctx, name)` 提供服务；`declare module '@deepseek-ai/cordis' { interface Context { ... } }` 类型化。

### 4.4 Context API

- `ctx.get/set/provide/accessor/mixin`（服务仓库与绑定）、`ctx.extend/isolate/intercept`（子上下文）、`ctx.root/events/logger/registry/reflect/fiber/timer/loader/hmr`（ambient 句柄）、`ctx.effect`（effect）、`ctx.plugin/inject`（插件加载与依赖）。

### 4.5 事件系统

- 五模式：`emit`/`parallel`/`serial`/`bail`/`waterfall`；`waterfall` 监听器必须 `next()`。
- 类型化事件用 declaration merging；`namespace/action` 命名；durable session 事件与 Cordis 事件是两套。

### 4.6 Tool 注册

- `ctx.tools.register(defineTool({ name, description, parameters, output: { schema, render }, execute, presentationMeta?, presentCall?, presentResult? }))`。
- 执行管线：`tools/pre-execute → tools/execute → tools/post-execute → tools/result`。

### 4.7 profiles / bundles / CLI

- `dsh --profile <name>`、`dsh web`（别名）、`dsh plugin --profile <name> add/remove`、`--dump-config`/`--dump-default-config`、`--patch`、`--help`、`--version`。

### 4.8 扩展点（Extension Points）

- `agent/*`（`agent/pre-step`、`agent/request`、`agent/turn-stopping`）、`tools/*`（pre-execute/execute/post-execute/result）、`fs/*`、`llm/stream`、`session/event`、`internal/*`、`loader/*`、`hmr/*`；能力 seam 注册（`ctx.llm`/`ctx.fs`/`ctx.shell`/`ctx.web`/`ctx.subagents`…）；`agent.inject()`；`ConversationNodeDefinition`。

### 4.9 SDK / API

- TypeScript：`@deepseek-ai/cordis`（Context/Service/Events/Fiber/Registry）、`@deepseek-ai/dsh-tools`（`defineTool`）、`@deepseek-ai/dsh-llm`（`LlmAdapter`/`GenerateOptions`/`StreamChunk`/`LlmError`/`attributionHeaders`）、`@deepseek-ai/schemastery`（`Schema`）。
- Python：`deepseek-harness-sdk`（`from deepseek_harness import DeepSeekHarness`）。
- JSON-RPC 示例：`examples/jsonrpc-agent/minimal.py` / `minimal.cordis.yml`。

### 4.10 版本化

- 版本 `0.1.0-rc.5`；**developer preview / 技术预览**，明确警告破坏性变更。无独立 semver 兼容承诺的文档页；会话/存储格式有单调 `SCHEMA_VERSION` / `SESSION_FORMAT_VERSION` 机制（见 AGENTS.md，属仓库内部，非文档站页）。

### 4.11 安装 / 设置

- `npx @deepseek-ai/dsh web`（npm）或源码 `pnpm install && pnpm run build && pnpm dsh web`；配置模型（Settings → Models 填 DeepSeek API key）；选工作区；发任务。
- Python：`pip install deepseek-harness-sdk`（自带 Node 运行时）。

---

## 5. 完整 URL 清单（visited / found）

### 5.1 目标 URL

- `https://www.deepseek.com/harness/`（内容 [unverified]）
- `https://deepseek-harness.github.io/deepseek-harness/develop/basic/`（结构/内容来自仓库清单；线上渲染 [unverified]）
- `https://deepseek-harness.github.io/deepseek-harness/`（站点根；结构来自仓库清单）

### 5.2 文档站页面路由（派生自 `website/docs.ts`，均加站点前缀 `https://deepseek-harness.github.io/deepseek-harness`；英文 locale 加 `/en/` 前缀）

- `/`（重定向）、`/guide/quickstart`、`/guide/providers`、`/guide/python-sdk`
- `/develop/basic/`、`/develop/basic/tool`、`/develop/basic/config`、`/develop/basic/publish`
- `/develop/framework/`、`/develop/framework/service`、`/develop/framework/events`
- `/develop/practice/`、`/develop/practice/llm-adapter`
- `/develop/cordis-tutorial/`、`/develop/cordis-tutorial/01-first-plugin`、`/develop/cordis-tutorial/02-lifecycle-and-effects`、`/develop/cordis-tutorial/03-services`、`/develop/cordis-tutorial/04-events`、`/develop/cordis-tutorial/05-config`、`/develop/cordis-tutorial/06-composition-and-hmr`、`/develop/cordis-tutorial/07-into-the-harness`
- `/reference/`、`/reference/cordis-primer`、`/reference/capability-seams`、`/reference/agent-lifecycle`、`/reference/tool-execution-pipeline`、`/reference/config-catalog`、`/reference/tool-catalog`、`/reference/persistence-catalog`
- `/reference/cordis-api/context`、`/reference/cordis-api/events`、`/reference/cordis-api/fiber`、`/reference/cordis-api/registry`、`/reference/cordis-api/service`、`/reference/cordis-api/inherited`
- `/reference/cookbook/adding-a-package`、`/reference/cookbook/adding-a-tool`、`/reference/cookbook/adding-an-llm-adapter`、`/reference/cookbook/extension-cookbook`
- `/reference/subsystems/` + 子系统（core, scope, invariants, session, session-query, session-reference, session-title, session-projection, persistence, spill, session-telemetry, llm-streaming, token-meter, system-prompt, compaction, tools, shell, subprocess, terminal, jobs, filesystem, lsp, code-runtime, web, skills, workflow, subagent, approval, permission-presets, sandbox, plan, user-questions, commands, goal, schedule, web-server, typert, client-modules, storage, workspace, settings, credentials）

### 5.3 GitHub 仓库文档源文件（web_search 命中，均在 `github.com/deepseek-ai/deepseek-harness`）

- `https://github.com/deepseek-ai/deepseek-harness`（主仓库）
- `https://github.com/deepseek-ai/deepseek-harness/blob/master/README.md` / `README.zh.md`
- `https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md` / `.zh.md`
- `.../docs/development.md` / `.zh.md`
- `.../docs/cordis-primer.md` / `.zh.md`
- `.../docs/glossary.md`
- `.../docs/subsystems/core.zh.md`
- `.../docs/user/guide/python-sdk.md` / `.zh.md`
- `.../docs/user/guide/providers.md` / `.zh.md`
- `.../docs/user/guide/index.md`
- `.../docs/user/develop/basic/index.md`、`config.md`、`publish.md`
- `.../packages/mcp/mcp-client/README.md`、`.../packages/llm/llm-deepseek/README.md`、`.../packages/llm/llm-pi-ai/README.md`、`.../packages/bundle/base/README.md`、`.../packages/README.md`、`.../packages/skill/SKILL.md`、`.../packages/hooks/hooks-codex/README.md`
- `.../apps/cli/reference/README.zh.md`

### 5.4 第三方报道 / 生态（web_search 命中，非官方，内容 [unverified]）

- `https://www.ithome.com/0/989/446.htm`、`https://m.ithome.com/html/989446.htm`
- `https://finance.sina.cn/tech/2026-08-13/detail-inineuqm9870965.d.html`
- `https://www.donews.com/news/detail/1/6670452.html`
- `https://www.sohu.com/a/1062513068_100106801`
- `https://www.163.com/tech/article/L4892ED600097U7T.html`
- `https://www.appinn.com/deepseek-harness/`
- `https://www.cnblogs.com/sing1ee/p/22455466`、`https://www.cnblogs.com/weiwuji/p/22456195`
- `https://news.qq.com/rain/a/20260813A0E8ES00`
- `http://www.stnn.cc/detail/6a7dc390bcf6f20e311cbbce.html`
- `https://news.17173.com/content/08132026/220156228.shtml`
- `https://www.uied.cn/posts/921608`
- `https://www.smarthey.com/detail/342220702961.html`
- `https://www.eet-china.com/mp/a516864.html`
- `https://www.sina.cn/news/detail/5331578031178880.html`
- `https://tech.ifeng.com/c/8vZ0azYi0Sf`
- `https://aihot.virxact.com/items/cmsrjkbcd02tiro46cfjwidak`
- `https://global.v2ex.co/t/1234203`
- `https://www.npmjs.com/package/@deepseek-ai/dsh-base`、`https://www.npmjs.com/package/@deepseek-ai/dsh-web-app`
- `https://www.awesomeskills.dev/en/skill/henryz838978-deepseek-harness`（注意：第三方同名项目）

---

## 6. 附注 / 未核实项汇总

- `www.deepseek.com/harness/` 页面正文、下载按钮、具体文案：**[unverified]**。
- 文档站线上渲染页：**[unverified]**（沙箱网络被禁，`site:deepseek-harness.github.io` 无索引）；页面清单/标题/内容以官方仓库 `website/docs.ts` + `docs/` 源文件为权威。
- `deepseek-harness.github.io` 对应的 GitHub org（与 `deepseek-ai/deepseek-harness` 的关系，是否独立文档 org）未直接核实；但 `docs/user/develop/basic/publish.md` 提到 `https://github.com/deepseek-harness/turtle-ui`，证明存在 `deepseek-harness` org（**08-14 核查：turtle-ui 仓库现 404**）。
- 发布/公测的具体日期与版本号（0.1.x）来自第三方新闻，非官方页面确认。
