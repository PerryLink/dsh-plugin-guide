# DeepSeek Harness प्लगइन चीट शीट

> एक पेज का त्वरित संदर्भ। विवरण: [plugin-dev-guide.md](plugin-dev-guide.md) (चीनी) और [references](../references/)।
> अन्य भाषाएँ: [English](quick-reference.md) · [中文](quick-reference.zh-CN.md) · [Español](quick-reference.es.md) · [Português](quick-reference.pt.md)

## प्लगइन का ढाँचा

```ts
import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'
import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'my-plugin'          // अनिवार्य
export const inject = ['tools']          // आवश्यक सेवाएँ; न हों तो छोड़ें

export interface Config { limit: number }
export const Config: Schema<Config> = Schema.object({
  limit: Schema.number().default(10),    // Schemastery स्कीमा, सादा ऑब्जेक्ट नहीं
})

export function apply(ctx: Context, config: Config) {
  ctx.effect(() => {                     // पंजीकरण = इफ़ेक्ट, अनलोड पर पूर्ववत
    const timer = setInterval(() => {}, 1000)
    return () => clearInterval(timer)
  })
  ctx.on('tools/result', (exec, result) => { /* ... */ })
  ctx.tools.register(defineTool({
    name: 'my_tool',
    description: '…',
    parameters: { x: { type: 'string', required: true } },
    output: { schema: { type: 'string' }, render: (_a, v) => [{ type: 'text', text: v }] },
    async execute(args, exec) { return `hi ${args.x}` },  // exec.signal का सम्मान करें
  }))
}
```

अन्य रूप: ऑब्जेक्ट `export default { name, inject, apply }`; क्लास `class X extends Service { static inject=[...]; constructor(ctx){ super(ctx,'key') } }` (सेवा प्रदान करते समय उपयोग करें)।

## मुख्य ctx API (Cordis)

| उद्देश्य | API |
|---|---|
| संसाधन पंजीकरण + सफ़ाई | `ctx.effect(() => disposer)` |
| घटनाएँ सुनना | `ctx.on(name, handler)` (स्वतः सफ़ाई) |
| प्रसारण / बिना रिटर्न | `ctx.emit(name, payload)` |
| शॉर्ट-सर्किट मान | `ctx.bail(name, input)` (पहला non-null/false/undefined जीतता है) |
| क्रमबद्ध मान | `await ctx.serial(name, input)` |
| पाइपलाइन | `await ctx.waterfall(name, input, init)`; श्रोताओं को **`next()` अवश्य बुलाना चाहिए** |
| चाइल्ड कॉन्टेक्स्ट | `ctx.extend(meta)` / `ctx.isolate(name, label?)` / `ctx.intercept(name, config)` |
| चाइल्ड प्लगइन माउंट | `ctx.plugin(plugin)` → Fiber; `await fiber.dispose()` |
| वैकल्पिक सेवा लुकअप | `ctx.get('metrics')?.x()` |
| लॉगिंग | `ctx.logger(name)` |

जीवनचक्र: `PENDING → LOADING → ACTIVE` (apply में त्रुटि → FAILED); `ACTIVE → UNLOADING → DISPOSED`। आवश्यक सेवा गायब होने पर प्लगइन अनलोड होता है; सेवा लौटने पर पुनः लोड होता है।

## इवेंट डिस्पैच मोड + bail

| मोड | await | क्रम | रिटर्न मान |
|---|---|---|---|
| emit | नहीं | पंजीकरण क्रम | कोई नहीं |
| waterfall | नहीं | पंजीकरण क्रम | हाँ (**`next()` न बुलाना शॉर्ट-सर्किट करता है**) |
| parallel | हाँ | समानांतर | कोई नहीं |
| serial | हाँ | पंजीकरण क्रम | हाँ (पहला गैर-खाली रुकता है) |

टाइप्ड इवेंट (declaration merging):

```ts
declare module '@deepseek-ai/cordis' {
  interface Events { 'my/event': (p: { id: string }) => void }
  interface Context { myService: MyService }   // सेवा प्रदान करते समय
}
```

## cordis.yml / परतें

```yaml
# scratch-plugin/cordis.yml (--patch ओवरले)
- insert:
    - id: hello
      name: '/absolute/path/to/scratch-plugin/src/my-plugin.ts'
      config: { greeting: 'Hi' }

# bundle: package.json में "dsh": {"bundle":{"patch":"./cordis.patch.yml"}}
# profile: "dsh": {"profile":{"bundles":["@deepseek-ai/dsh-base","my-bundle"]}}
# प्रभावी क्रम: bundles → profile cordis.patch.yml → $DSH_HOME/cordis.patch.yml → --patch
# id से ओवरराइड; पूरी config पंक्ति बदलती है (deep merge नहीं) — हर कुंजी दोबारा लिखें
# !!js इंजेक्ट की गई सेवाओं के सक्रिय होने पर मूल्यांकित होता है; disabled हर माउंट पर जाँचा जाता है
```

कमांड: `dsh --profile web` · `dsh --profile headless "task"` · `dsh --profile X --dump-config` · `dsh plugin --profile X add/remove <pkg>` · `pnpm dsh web --patch ./scratch-plugin/cordis.yml`

इंस्टॉल मार्ग (repository-plugin 0811 को हटाया गया — केवल दो बचे):
- **bundle प्लगइन** (`"dsh":{"bundle":{"patch":"..."}}`) → `dsh plugin add <pkg>` से `dsh.profile.bundles` स्टैक में; पुनः आरंभ पर प्रभावी।
- **सादा cordis प्लगइन** (बिना `dsh.bundle`) → `dsh plugin add <pkg>` निर्भरता लगाता है + profile के `cordis.patch.yml` में insert पंक्ति; **कॉन्फ़िग HMR लाइव**।
- git स्रोत: `dsh plugin add "github:owner/repo#<sha>&path:<subdir>"` (commit पिन करें; स्वनिर्भर `prepare` बिल्ड + profile `pnpm-workspace.yaml` allowBuilds; npm/tarball को बिल्ड अनुमति नहीं चाहिए)।

## सामान्य अंतर्निर्मित सेवाएँ (ctx कुंजियाँ)

`sessions` सत्र लॉग · `systemPrompt` प्रॉम्प्ट असेंबली · `tools` टूल रजिस्ट्री + संरक्षित पाइपलाइन · `agents` एजेंट रजिस्ट्री · `agentLoop` लूप ड्राइवर · `llm` मॉडल अडैप्टर रजिस्ट्री · `skills` स्किल रजिस्ट्री · `commands` मानव स्लैश कमांड · `approval` एकबार अनुमोदन · `jobs` पृष्ठभूमि कार्य · `fs` फ़ाइलसिस्टम सीम · `shell` bash निष्पादन सीम · `subprocess` सबप्रोसेस सीम · `terminals` PTY · `sandbox` प्रक्रिया-सीमा सीम · `codeRuntime` कोड निष्पादन · `sessionPersistence` पर्सिस्टेंस · `settings` / `credentials` / `workspaceRegistry` / `goals` / `planMode` / `subagents` / `workflowEngine` / `storage`।
पूरी सूची व सटीक हस्ताक्षर → `references/official-docs/docs/capability-seams.md` + `docs/subsystems/*.md` (जनरेटेड Cordis API क्षेत्र)।

## टूल नीति पाइपलाइन (निष्पादन क्रम)

```
tools/pre-execute (waterfall, allow|deny|ask) → ctx.tools.guard() (एकांगी अस्वीकृति)
→ tools/execute (रैपर; केवल exec.signal बदला जा सकता है) → execute(args, exec)
→ tools/post-execute (content/value बदलें, ब्लॉक करें, संदर्भ जोड़ें) → finalizeContent
→ tools/result (केवल अवलोकन) → टिकाऊ tool/result (सत्र इवेंट)
```

चयन: नीति द्वार → pre-execute; अपील-रहित अस्वीकृति → guard; टाइमआउट/रिट्री/मेट्रिक्स → execute; परिणाम बदलना → post-execute; ऑडिट/संग्रह → result।
Code Mode: `await tools.<name>(args)` मुफ़्त मिलता है; सफलता = अंतिम कैननिकल JSON मान; विफलता = `ToolCallError(name, toolName, message)`।

## UI कार्ड (शुद्ध फ़ंक्शन! केवल args(+result) — कोई I/O/घड़ी/यादृच्छिक नहीं)

- `presentCall(args)` → `{card:'generic',title,kind?,rawInput?,content?,locations?}` | `{card:'terminal',title,description?,cwd?}` | `{card:'diff',title,diffs,locations?}`
- `presentResult(args,{content,isError,meta?})` → generic / terminal / diff / search(`shape:'matches'|'paths'`) / read / web(`kind:'search'|'fetch'`)
- रीप्ले मेटाडेटा: `output.presentationMeta(args, value)` → `tool/result.meta` में संग्रहीत

## त्रि-भूमिका क्षमता सीम (seam) टेम्पलेट

Definition (`dsh-my-cap`): `export abstract class MyCapService extends Service { constructor(ctx){super(ctx,'myCap')} abstract execute(req): Promise<res> }` + Context declaration merging।
Provider (`dsh-my-cap-local`): `export function apply(ctx){ ctx.plugin(class MyCapLocal extends MyCapService {...}) }`।
Consumer (`dsh-tool-my-cap`): `inject = ['tools','myCap']`, `ctx.tools.register(defineTool({... execute: args => ctx.myCap.execute(...)}))`।
नियम: समय से पहले न बाँटें; Provider और Consumer कभी एक-दूसरे पर निर्भर न हों; डिफ़ॉल्ट स्पष्ट `resolve(request): Spec` में।

## LLM अडैप्टर की अनिवार्य बातें

`class MyAdapter extends LlmAdapter { async *stream(options): AsyncIterable<StreamChunk> }` → `ctx.llm.registerAdapter(['provider'], adapter)`।
चंक प्रोटोकॉल: `block-start` → `text-delta*` → `block-end` (पूर्ण ब्लॉक) → … → `usage` (finish से पहले) → `finish` (अंतिम; `reason: {kind:'stop'|'tool-calls'}`)। जिन फ़ील्ड को पूरा नहीं कर सकते उनके लिए स्थिर कोड सहित `LlmError` फेंकें।

## कठोर नियम (उल्लंघन = गेट विफलता / गलत व्यवहार)

1. हर पंजीकरण `ctx.effect()` / `ctx.on()` / सेवा के `register()` से हो (disposer लौटाता है)।
2. waterfall श्रोताओं को `next()` बुलाना ही होगा; न बुलाना जानबूझकर शॉर्ट-सर्किट है।
3. मॉडल-दृश्य ⇔ लॉग: नई मॉडल-दृश्य इनपुट के लिए नया सत्र इवेंट चाहिए (`SessionEventMap`)।
4. समायोज्य मान कभी हार्डकोड न करें (कसौटी: क्या cordis.yml इसे बदल सकता है?); गलत कॉन्फ़िग ज़ोर से विफल हो।
5. स्वतंत्र प्लगइन पैकेज: cordis peerDependency है और होस्ट पहचान से मेल खाना चाहिए (scoped `@deepseek-ai/cordis` और unscoped मिलाना पहचान बाँट देता है); ESM; `dsh.bundle` मैनिफ़ेस्ट; git इंस्टॉल को `prepare` + `allowBuilds` चाहिए; `lib/` या tarball प्रकाशित करें।
6. दस्तावेज़ द्विभाषी जोड़ों में; टूल विवरण/प्रॉम्प्ट ही व्यवहार हैं; गैर-तुच्छ बदलाव में Agent Note चाहिए; पुश से पहले न्यूनतम जाँच सेट चलाएँ (dsh-pre-push-checks)।
7. सीमाओं के पार अपारदर्शी ids branded होते हैं (`Branded<B>` from `dsh-brand`), कभी भी नंगे `string` नहीं।
8. `SessionEventMap` सदस्य required-on-read हैं: 0.1.2-alpha.1 में `ignorable` लिफ़ाफ़ा हट गया है (पठन विफल-बंद है — जो build किसी इवेंट प्रकार को नहीं जानता वह log अस्वीकार करता है), और plugins के अपने इवेंट के append एक अनुकूली द्वार से चलते हैं जो बिना-लिफ़ाफ़े वाले hosts पर लिखना रोक देता है; केवल संरचनात्मक प्रारूप बदलाव ही `SESSION_FORMAT_VERSION` bump करते हैं। `SessionEvent` पर switch दस्तावेज़ित `default` में गिरता है — `assertNever` नहीं (merge-extensible union)।

## समुदाय की त्वरित समस्या-सूची (विवरण: गाइड §7.3 / community-repo-deep-dive.md)

- tsconfig तिकड़ी: `moduleResolution: bundler` + `allowImportingTsExtensions` + `rewriteRelativeImportExtensions` (+ `lib:["ES2024"]`, स्पष्ट `types:["node"]`)।
- त्रुटि पर भी `tsc` आउटपुट देता है → `tsc || exit 1` / `--noEmitOnError`; प्रकाशन से पहले बिल्ड में बचे `.ts` इम्पोर्ट खोजें।
- Windows junctions PowerShell `New-Item -ItemType Junction` से; vitest ड्राइव अक्षर बड़ा `C:/`।
- `DSH_PERMISSION_MODE=danger-full-access` उच्च जोखिम है (Windows पर सैंडबॉक्स बैकएंड नहीं, अनुमोदन बंद); `~/.dsh/.env` में `DSH_*` स्टार्टअप तोड़ता है।
- सत्र फ़ाइलें मल्टी-फ़्रेम zstd हैं: `scanZstdFrames`/`createZstdFrameDecoder` उपयोग करें (`@deepseek-ai/dsh-session-persistence-jsonl/src/zstd.ts`)।
- npm: बिना स्कोप वाला `dsh` असंबंधित node-dsh प्रोजेक्ट (एक shell) है — `@deepseek-ai/dsh` इंस्टॉल करें (latest=0.1.2-rc.1); `@deepseek-ai/dsh-tools` और `@deepseek-ai/dsh-session-persistence-jsonl` का `latest` पुराना है (0.0.1-rc.1), `next` (0.1.2-rc.1) पिन करें; `create-dsh-plugin` latest=0.2.1; dsh-core/dsh-sdk अभी भी अप्रकाशित (2026-09-04 को सत्यापित)।
- पथ तुलना से पहले दोनों ओर `resolve()` करें (Windows बैकस्लैश जाल)।

## दस्तावेज़ लिंक

आधिकारिक डेव दस्तावेज़ — साइट आधार <https://deepseek-harness.github.io/deepseek-harness> (रूट चीनी, `en/` अंग्रेज़ी; हूबहू स्थानीय प्रतियाँ `references/official-docs/docs/` में):

- मूल बातें: [develop/basic/](https://deepseek-harness.github.io/deepseek-harness/develop/basic/) → [tool](https://deepseek-harness.github.io/deepseek-harness/develop/basic/tool) · [config](https://deepseek-harness.github.io/deepseek-harness/develop/basic/config) · [publish](https://deepseek-harness.github.io/deepseek-harness/develop/basic/publish)
- फ़्रेमवर्क: [develop/framework/](https://deepseek-harness.github.io/deepseek-harness/develop/framework/) ([service](https://deepseek-harness.github.io/deepseek-harness/develop/framework/service), [events](https://deepseek-harness.github.io/deepseek-harness/develop/framework/events)) · अभ्यास: [develop/practice/](https://deepseek-harness.github.io/deepseek-harness/develop/practice/) ([LLM adapter](https://deepseek-harness.github.io/deepseek-harness/develop/practice/llm-adapter))
- गाइड: [quickstart](https://deepseek-harness.github.io/deepseek-harness/guide/quickstart) · [providers](https://deepseek-harness.github.io/deepseek-harness/guide/providers) · [python-sdk](https://deepseek-harness.github.io/deepseek-harness/guide/python-sdk)
- Cordis: [primer](https://deepseek-harness.github.io/deepseek-harness/reference/cordis-primer) · [tutorial](https://deepseek-harness.github.io/deepseek-harness/develop/cordis-tutorial/) · [core API](https://deepseek-harness.github.io/deepseek-harness/reference/cordis-api/context)
- संदर्भ: [architecture](https://deepseek-harness.github.io/deepseek-harness/reference/) · [cookbook/adding-a-tool](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/adding-a-tool) · [cookbook/extension-cookbook](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/extension-cookbook) · [subsystems](https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/)
- पूर्ण URL ↔ स्थानीय प्रति सूची: [guide/links.md](links.md)

सामुदायिक डेव दस्तावेज़ — टेम्पलेट/ट्यूटोरियल/समस्याएँ, पूरी सूची [references/community-ecosystem.md](../references/community-ecosystem.md) में: [plugin-template](https://github.com/omdsh-dev/plugin-template) · [dsh-plugin-dev pitfalls](https://github.com/omdsh-dev/dsh-plugin-dev) · [from-scratch tutorial](https://github.com/Opr4Mp3r/deepseek-harness-plugin-from-scratch) · [dsh-plugin-check](https://github.com/omdsh-dev/dsh-plugin-check)

## मुख्य स्रोत सूची

- आधिकारिक दस्तावेज़ हूबहू: `references/official-docs/docs/**` (215 पृष्ठ, `.zh.md` जोड़े सहित)
- रिपो-रूट बाधाएँ: `references/official-docs/AGENTS.md`, `references/official-docs/packages/AGENTS.md`, `references/official-docs/vendor/README.md`; सिंक स्थिति `references/official-docs/SNAPSHOT.md` में
- साइट क्रॉल HTML: `downloads/web/site/**` (EN+ZH पूर्ण साइट) + `downloads/manifest.tsv`
- अपस्ट्रीम Cordis: `downloads/github/cordis/**` + शोध `references/upstream-cordis.md`
- Cordis पेपर: `downloads/github/paper/**` + शोध `references/cordis-paper-and-community.md`
- वेबसाइट शोध: `references/website-pages.md`
- रिपो शोध: `references/harness-repo.md`
- समुदाय/पारिस्थितिकी: `references/community-ecosystem.md` + `references/community-repo-deep-dive.md`
- सभी स्रोत URL: `references/sources.md`
