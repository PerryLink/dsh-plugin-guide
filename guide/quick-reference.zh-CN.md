# DeepSeek Harness 鎻掍欢寮€鍙戦€熸煡琛?
> 涓€椤靛紡閫熸煡銆傜粏鑺傚洖鍒?[plugin-dev-guide.md](plugin-dev-guide.md) 涓?[references](../references/)銆?
## 鎻掍欢楠ㄦ灦

```ts
import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'
import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'my-plugin'          // 蹇呴』
export const inject = ['tools']          // 渚濊禆鐨勬湇鍔? 鏃犱緷璧栧彲鐪佺暐

export interface Config { limit: number }
export const Config: Schema<Config> = Schema.object({
  limit: Schema.number().default(10),    // Schemastery schema, 涓嶆槸鏅€氬璞?})

export function apply(ctx: Context, config: Config) {
  ctx.effect(() => {                     // 娉ㄥ唽=effect, 鍗歌浇鑷姩鎾ら攢
    const timer = setInterval(() => {}, 1000)
    return () => clearInterval(timer)
  })
  ctx.on('tools/result', (exec, result) => { /* ... */ })
  ctx.tools.register(defineTool({
    name: 'my_tool',
    description: '鈥?,
    parameters: { x: { type: 'string', required: true } },
    output: { schema: { type: 'string' }, render: (_a, v) => [{ type: 'text', text: v }] },
    async execute(args, exec) { return `hi ${args.x}` },  // 灏婇噸 exec.signal
  }))
}
```

鍏朵粬褰㈡€侊細瀵硅薄 `export default { name, inject, apply }`锛涚被 `class X extends Service { static inject=[...]; constructor(ctx){ super(ctx,'key') } }`锛堟彁渚涙湇鍔℃椂鐢級銆?
## ctx 鏍稿績 API锛圕ordis锛?
| 鐢ㄩ€?| API |
|---|---|
| 娉ㄥ唽鑷畾涔夎祫婧?娓呯悊 | `ctx.effect(() => disposer)` |
| 鐩戝惉浜嬩欢 | `ctx.on(name, handler)`锛堣嚜鍔ㄦ竻鐞嗭級 |
| 骞挎挱 / 鏃犺繑鍥炲€?| `ctx.emit(name, payload)` |
| 鐭矾鍙栧€?| `ctx.bail(name, input)`锛堥涓潪 null/false/undefined 鍗虫锛?|
| 椤哄簭鍙栧€?| `await ctx.serial(name, input)` |
| 绠＄嚎 | `await ctx.waterfall(name, input, init)`锛涚洃鍚櫒**蹇呴』 `next()`** |
| 瀛愪笂涓嬫枃 | `ctx.extend(meta)` / `ctx.isolate(name, label?)` / `ctx.intercept(name, config)` |
| 鎸傚瓙鎻掍欢 | `ctx.plugin(plugin)` 鈫?Fiber锛沗await fiber.dispose()` |
| 鍙€夋湇鍔℃煡璇?| `ctx.get('metrics')?.x()` |
| 鏃ュ織 | `ctx.logger(name)` |

鐢熷懡鍛ㄦ湡锛歚PENDING 鈫?LOADING 鈫?ACTIVE`锛坅pply 鎶涢敊 鈫?FAILED锛夛紱`ACTIVE 鈫?UNLOADING 鈫?DISPOSED`銆備緷璧栨湇鍔℃秷澶?鈫?鑷姩鍗歌浇锛屾仮澶?鈫?鑷姩閲嶈浇銆?
## 浜嬩欢娲惧彂鍥涙ā寮?+ bail

| 妯″紡 | await | 椤哄簭 | 杩斿洖鍊?|
|---|---|---|---|
| emit | 鍚?| 娉ㄥ唽搴?| 鏃?|
| waterfall | 鍚?| 娉ㄥ唽搴?| 鏈夛紙**涓嶈皟 next() 鍗崇煭璺?*锛?|
| parallel | 鏄?| 骞惰 | 鏃?|
| serial | 鏄?| 娉ㄥ唽搴?| 鏈夛紙棣栦釜闈炵┖鍗虫锛?|

绫诲瀷澹版槑锛坉eclaration merging锛夛細

```ts
declare module '@deepseek-ai/cordis' {
  interface Events { 'my/event': (p: { id: string }) => void }
  interface Context { myService: MyService }   // 鎻愪緵鏈嶅姟鏃?}
```

## cordis.yml / 鍒嗗眰

```yaml
# scratch-plugin/cordis.yml (--patch 瑕嗙洊灞?
- insert:
    - id: hello
      name: '/absolute/path/to/scratch-plugin/src/my-plugin.ts'
      config: { greeting: 'Hi' }

# bundle: package.json 鐨?"dsh": {"bundle":{"patch":"./cordis.patch.yml"}}
# profile: "dsh": {"profile":{"bundles":["@deepseek-ai/dsh-base","my-bundle"]}}
# 鐢熸晥椤哄簭: bundles 鈫?profile cordis.patch.yml 鈫?$DSH_HOME/cordis.patch.yml 鈫?--patch
# 鎸?id 瑕嗙洊, 鏁磋 config 鏇挎崲(闈炴繁鍚堝苟); 瑕嗙洊鏂瑰繀椤婚噸杩板叏閮ㄩ敭
# !!js 琛ㄨ揪寮?鍙屾劅鍙瑰彿)鍦ㄦ敞鍏ユ湇鍔″氨缁悗姹傚€? disabled 姣忔鎸傝浇鏃舵眰鍊?```

鍛戒护锛歚dsh --profile web` 路 `dsh --profile headless "task"` 路 `dsh --profile X --dump-config` 路 `dsh plugin --profile X add/remove <pkg>` 路 `pnpm dsh web --patch ./scratch-plugin/cordis.yml`

瀹夎褰㈡€侊紙0811 璧?repository-plugin 鏈哄埗宸茬Щ闄わ紝鍙墿涓ゆ潯閫氶亾锛夛細
- **bundle 鎻掍欢**锛坄"dsh":{"bundle":{"patch":"..."}}`锛夆啋 `dsh plugin add <pkg>` 杩?`dsh.profile.bundles` 灞傛爤锛岄噸鍚敓鏁堛€?- **绾?cordis 鎻掍欢**锛堟棤 `dsh.bundle`锛夆啋 `dsh plugin add <pkg>` 瑁呬緷璧?+ profile `cordis.patch.yml` 鍔?insert 琛岋紝**閰嶇疆 HMR 瀹炴椂鐢熸晥**銆?- git 婧愶細`dsh plugin add "github:owner/repo#<sha>&path:<subdir>"`锛坧in commit锛沗prepare` 鑷寘鍚瀯寤?+ profile `pnpm-workspace.yaml` allowBuilds锛沶pm/tarball 鍏嶆瀯寤鸿鍙級銆?
## 甯哥敤鍐呭缓鏈嶅姟锛坈tx 閿級

`sessions` 浼氳瘽鏃ュ織/鍐呭瓨搴?路 `systemPrompt` 鎻愮ず璇嶇粍瑁?路 `tools` 宸ュ叿娉ㄥ唽涓庡彈鎺ф墽琛岀绾?路 `agents` Agent 娉ㄥ唽琛?路 `agentLoop` 寰幆椹卞姩鍣?路 `llm` 妯″瀷閫傞厤鍣ㄦ敞鍐岃〃 路 `skills` 鎶€鑳芥敞鍐岃〃 路 `commands` 浜虹被鏂滄潬鍛戒护 路 `approval` 涓€娆℃€у鎵?路 `jobs` 鍚庡彴浠诲姟 路 `fs` 鏂囦欢绯荤粺缂?路 `shell` bash 鎵ц缂?路 `subprocess` 瀛愯繘绋嬬紳 路 `terminals` PTY 路 `sandbox` 杩涚▼闄愬埗缂?路 `codeRuntime` 浠ｇ爜鎵ц 路 `sessionPersistence` 鎸佷箙鍖?路 `settings` / `credentials` / `workspaceRegistry` / `goals` / `planMode` / `subagents` / `workflowEngine` / `storage`銆?瀹屾暣娓呭崟涓庢瘡涓柟娉曠殑绮剧‘绛惧悕 鈫?`references/official-docs/docs/capability-seams.md` + `docs/subsystems/*.md`锛堢敓鎴愬紡 Cordis API 鍖猴級銆?
## 宸ュ叿绛栫暐绠＄嚎锛堟墽琛岄『搴忥級

```
tools/pre-execute (waterfall, allow|deny|ask) 鈫?ctx.tools.guard() (鍗曡皟 deny)
鈫?tools/execute (鍖呰９, 浠呭彲鎹?exec.signal) 鈫?execute(args, exec)
鈫?tools/post-execute (鎹?content/value/闃绘柇/闄勪笂涓嬫枃) 鈫?finalizeContent
鈫?tools/result (鍙瑙傚療) 鈫?鎸佷箙鍖?tool/result (浼氳瘽浜嬩欢)
```

閫夋嫨瑙勫垯锛氱瓥鐣ラ棬鐢?pre-execute锛涗笉鍙炕妗堢殑 deny 鐢?guard锛涜秴鏃?閲嶈瘯/鎸囨爣鐢?execute锛涙敼缁撴灉鐢?post-execute锛涘璁?閲囬泦鐢?result銆?Code Mode锛歚await tools.<name>(args)` 鍏嶈垂鑾峰緱锛涙垚鍔?鏈€缁堣鑼?JSON 鍊硷紱澶辫触=`ToolCallError(name, toolName, message)`銆?
## UI 鍗＄墖锛堢函鍑芥暟锛佸彧渚濊禆 args(+result)锛岀姝?I/O/鏃堕挓/闅忔満锛?
- `presentCall(args)` 鈫?`{card:'generic',title,kind?,rawInput?,content?,locations?}` | `{card:'terminal',title,description?,cwd?}` | `{card:'diff',title,diffs,locations?}`
- `presentResult(args,{content,isError,meta?})` 鈫?generic / terminal / diff / search(`shape:'matches'|'paths'`) / read / web(`kind:'search'|'fetch'`)
- 鍥炴斁鍏冩暟鎹細`output.presentationMeta(args, value)` 鈫?鎸佷箙鍖?`tool/result.meta`

## 涓夊眰鑳藉姏缂濓紙seam锛夋ā鏉?
Definition锛坄dsh-my-cap`锛夛細`export abstract class MyCapService extends Service { constructor(ctx){super(ctx,'myCap')} abstract execute(req): Promise<res> }` + Context 澹版槑鍚堝苟銆?Provider锛坄dsh-my-cap-local`锛夛細`export function apply(ctx){ ctx.plugin(class MyCapLocal extends MyCapService {...}) }`銆?Consumer锛坄dsh-tool-my-cap`锛夛細`inject = ['tools','myCap']`锛宍ctx.tools.register(defineTool({... execute: args => ctx.myCap.execute(...)}))`銆?瑙勫垯锛氫笉鎻愬墠鎷嗭紱Provider 涓?Consumer 浜掍笉渚濊禆锛涢粯璁ゅ€艰蛋鏄惧紡 `resolve(request): Spec`銆?
## LLM 閫傞厤鍣ㄨ鐐?
`class MyAdapter extends LlmAdapter { async *stream(options): AsyncIterable<StreamChunk> }` 鈫?`ctx.llm.registerAdapter(['provider'], adapter)`銆?Chunk 鍗忚锛歚block-start` 鈫?`text-delta*` 鈫?`block-end`锛堝畬鏁村潡锛夆啋 鈥?鈫?`usage`锛堝湪 finish 鍓嶏級鈫?`finish`锛堟渶鍚庯紱`reason: {kind:'stop'|'tool-calls'}`锛夈€傛棤娉曟弧瓒崇殑瀛楁鎶涘甫绋冲畾 code 鐨?`LlmError`銆?
## 绾㈢嚎锛堣繚鍙?鎸傞棬绂?閿欒琛屼负锛?
1. 娉ㄥ唽蹇呴』璧?`ctx.effect()`/`ctx.on()`/鏈嶅姟 `register()`锛堣繑鍥?disposer锛夈€?2. waterfall 鐩戝惉鍣ㄥ繀椤昏皟 `next()`锛涗笉璋?鏁呮剰鐭矾銆?3. 妯″瀷鍙 鉄?宸茶褰曪細鏂版ā鍨嬪彲瑙佽緭鍏ュ繀椤绘柊澧炰細璇濅簨浠讹紙`SessionEventMap`锛夈€?4. 涓嶅緱纭紪鐮佸彲璋冨弬鏁帮紙鍒ゆ柇锛歝ordis.yml 鑳藉惁鏀癸級锛沵isconfig fail loud銆?5. 鐙珛鎻掍欢鍖咃細cordis 鏄?peerDependency锛堜笌瀹夸富鍚岃韩浠斤細scoped `@deepseek-ai/cordis` 涓?unscoped 娣风敤浼?鍙?Cordis 鍒嗚"锛夛紱ESM锛沗dsh.bundle` 娓呭崟锛沢it 瀹夎閰?`prepare` + `allowBuilds`锛涘彂甯冨甫 `lib/` 鎴?tarball銆?6. 鏂囨。鍙岃鎴愬锛涘伐鍏锋弿杩?鎻愮ず璇嶅嵆琛屼负锛涢潪骞冲嚒鍙樻洿鍔?Agent Note锛涙彁浜ゅ墠璺戞渶灏忔鏌ラ泦锛坉sh-pre-push-checks锛夈€?7. 璺ㄨ竟鐣?opaque id 鐢?branded锛坄Branded<B>` from `dsh-brand`锛夛紝浠庝笉瑁?`string`銆?8. `SessionEventMap` 鎴愬憳榛樿 required-on-read锛歚ignorable` 淇″皝鍦?0.1.2-alpha.1 宸茬Щ闄わ紙璇昏矾寰?fail-closed鈥斺€斾笉璁よ瘑璇ヤ簨浠剁被鍨嬬殑 build 涓€寰嬫嫆缁濇棩蹇楋級锛屾彃浠惰嚜瀹氫箟浜嬩欢鐨勮拷鍔犺蛋鑷€傚簲闂ㄣ€佸湪鏃犱俊灏佸涓讳笂鍋滃啓锛涘彧鏈夌粨鏋勬牸寮忓彉鏇存墠 bump `SESSION_FORMAT_VERSION`銆傚 `SessionEvent` 鐨?switch 钀藉叆鏂囨。鍖?`default`鈥斺€?*绂佺敤 `assertNever`**锛坢erge-extensible union锛夈€?
## 绀惧尯瀹炴祴鍧戦€熸煡锛堣瑙?guide 搂7.3 / community-repo-deep-dive.md锛?
- tsconfig 涓変欢濂楋細`moduleResolution: bundler` + `allowImportingTsExtensions` + `rewriteRelativeImportExtensions`锛? `lib:["ES2024"]`銆佹樉寮?`types:["node"]`锛夈€?- `tsc` 鎶ラ敊浠?emit 鈫?`tsc || exit 1` / `--noEmitOnError`锛涘彂甯冨墠 grep 浜х墿鏃?`.ts` 娈嬬暀銆?- Windows junction 鐢?PowerShell `New-Item -ItemType Junction`锛泇itest 鐩樼澶у啓 `C:/`銆?- `DSH_PERMISSION_MODE=danger-full-access` 楂橀闄╋紙Windows 鏃犳矙绠卞悗绔€佺鐢ㄥ鎵癸級锛沗DSH_*` 鏀?`~/.dsh/.env` 浼氭姤閿欍€?- 浼氳瘽鏂囦欢澶氬抚 zstd锛氱敤 `scanZstdFrames`/`createZstdFrameDecoder`锛坄@deepseek-ai/dsh-session-persistence-jsonl/src/zstd.ts`锛夈€?- npm锛氭棤浣滅敤鍩?`dsh` 鏄棤鍏抽」鐩?node-dsh锛坰hell锛夆€斺€斿畼鏂瑰寘鏄?`@deepseek-ai/dsh`锛沗@deepseek-ai/dsh-tools` 涓?`@deepseek-ai/dsh-session-persistence-jsonl` 鐨?`latest` 鏄繃鏈熺増鏈紙0.0.1-rc.1锛夛紝瑕侀拤 `next`锛?.1.0-rc.6锛夛紱`create-dsh-plugin` 宸插彂甯冿紙0.1.1锛?026-08-13锛夛紱dsh-core/dsh-sdk 浠嶆湭鍙戝竷锛?026-08-14 澶嶆牳锛夈€?- 璺緞姣旇緝鍓嶄袱渚ч兘 `resolve()`锛圵indows 鍙嶆枩鏉犻櫡闃憋級銆?
## 鏂囨。閾炬帴

瀹樻柟寮€鍙戞枃妗ｂ€斺€旂珯鐐瑰熀鍧€ <https://deepseek-harness.github.io/deepseek-harness>锛堟牴璺敱涓枃锛宍en/` 鍓嶇紑鑻辨枃锛涢€愬瓧鍓湰鍦?`references/official-docs/docs/`锛夛細

- 鍏ラ棬锛歔develop/basic/](https://deepseek-harness.github.io/deepseek-harness/develop/basic/) 鈫?[tool](https://deepseek-harness.github.io/deepseek-harness/develop/basic/tool) 路 [config](https://deepseek-harness.github.io/deepseek-harness/develop/basic/config) 路 [publish](https://deepseek-harness.github.io/deepseek-harness/develop/basic/publish)
- 妗嗘灦涓庡疄璺碉細[develop/framework/](https://deepseek-harness.github.io/deepseek-harness/develop/framework/)锛圼service](https://deepseek-harness.github.io/deepseek-harness/develop/framework/service)銆乕events](https://deepseek-harness.github.io/deepseek-harness/develop/framework/events)锛壜?[develop/practice/](https://deepseek-harness.github.io/deepseek-harness/develop/practice/)锛圼LLM adapter](https://deepseek-harness.github.io/deepseek-harness/develop/practice/llm-adapter)锛?- 鐢ㄦ埛鎸囧崡锛歔quickstart](https://deepseek-harness.github.io/deepseek-harness/guide/quickstart) 路 [providers](https://deepseek-harness.github.io/deepseek-harness/guide/providers) 路 [python-sdk](https://deepseek-harness.github.io/deepseek-harness/guide/python-sdk)
- Cordis锛歔primer](https://deepseek-harness.github.io/deepseek-harness/reference/cordis-primer) 路 [tutorial](https://deepseek-harness.github.io/deepseek-harness/develop/cordis-tutorial/) 路 [core API](https://deepseek-harness.github.io/deepseek-harness/reference/cordis-api/context)
- 鍙傝€冿細[architecture](https://deepseek-harness.github.io/deepseek-harness/reference/) 路 [cookbook/adding-a-tool](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/adding-a-tool) 路 [cookbook/extension-cookbook](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/extension-cookbook) 路 [subsystems](https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/)
- 瀹屾暣 URL 鈫?鏈湴鍓湰瀵圭収锛歔guide/links.md](links.md)

绀惧尯寮€鍙戞枃妗ｂ€斺€旀ā鏉?鏁欑▼/韪╁潙锛屽畬鏁存竻鍗曡 [references/community-ecosystem.md](../references/community-ecosystem.md)锛歔plugin-template](https://github.com/omdsh-dev/plugin-template) 路 [dsh-plugin-dev pitfalls](https://github.com/omdsh-dev/dsh-plugin-dev) 路 [from-scratch tutorial](https://github.com/Opr4Mp3r/deepseek-harness-plugin-from-scratch) 路 [dsh-plugin-check](https://github.com/omdsh-dev/dsh-plugin-check)

## 鍏抽敭婧愮储寮?
- 鏈湴瀹樻柟鏂囨。鍏ㄦ枃锛歚references/official-docs/docs/**`锛?15 绡囷紝鍚叏閮?`.zh.md`锛?- 浠撳簱鏍圭害鏉燂細`references/official-docs/AGENTS.md`銆乣references/official-docs/packages/AGENTS.md`銆乣references/official-docs/examples/AGENTS.md`銆乣references/official-docs/vendor/README.md`锛涘悓姝ョ姸鎬佽 `references/official-docs/SNAPSHOT.md`
- 绔欑偣鐖彇 HTML锛歚downloads/web/site/**`锛堜腑鑻卞弻璇叏绔欙級+ `downloads/manifest.tsv`锛堜笅杞芥竻鍗曪級
- 涓婃父 Cordis锛歚downloads/github/cordis/**` + 璋冪爺 `references/upstream-cordis.md`
- Cordis 璁烘枃锛歚downloads/github/paper/**` + 璋冪爺 `references/cordis-paper-and-community.md`
- 缃戠珯/瀹樼綉璋冪爺锛歚references/website-pages.md`
- 浠撳簱璋冪爺锛歚references/harness-repo.md`
- 绀惧尯/鐢熸€侊細`references/community-ecosystem.md` + 宸ヤ綔鍖?`dsh-plugin-topic-2026-08-13/`
- 鍏ㄩ儴 URL 娓呭崟锛歚references/sources.md`
