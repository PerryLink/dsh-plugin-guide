<div align="center">

# 🐳 dsh-plugin-guide
- **1024 स्टोर चैनल**: एक बार `npm i -g dsh1024`, फिर `dsh1024 plugin --profile web add dsh-plugin-guide` ([deepseek1024.com](https://deepseek1024.com) इंस्टॉल रैंकिंग में गिना जाता है)।

**[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) प्लगइन बनाने के लिए आपकी ज़रूरत की हर चीज़।**

*आधिकारिक दस्तावेज़ संग्रह · Cordis प्राइमर · सामुदायिक गहन-विश्लेषण · युद्ध-परीक्षित नुकसान · agent skill · CLI टूलचेन*

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![DSH plugin](https://img.shields.io/badge/dsh-plugin-✅-green)](https://github.com/topics/dsh-plugin)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-plugin-guide/verify.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-plugin-guide/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-plugin-guide?label=version)](https://github.com/PerryLink/dsh-plugin-guide/releases)
[![npm version](https://img.shields.io/npm/v/dsh-plugin-guide)](https://www.npmjs.com/package/dsh-plugin-guide)
[![npm downloads](https://img.shields.io/npm/dm/dsh-plugin-guide)](https://www.npmjs.com/package/dsh-plugin-guide)

[English](README.md) · [简体中文](README.zh.md) · [Español](README.es.md) · [Português](README.pt.md) · [हिन्दी](README.hi.md)

</div>

---

## Compatibility

| Surface | Status |
|---|---|
| Harness | DeepSeek Harness `0.1.1-rc.2` |
| Node | `^22.19.0 || >=24.0.0` (DeepSeek Harness रनटाइम) |
| Platforms | सभी (सादा ESM बंडल; कोई नेटिव कोड नहीं, कोई नेटवर्क नहीं) |
| Model | कोई भी (कोई मॉडल अंतःक्रिया नहीं) |

## What you get

`dsh-plugin-guide` DSH प्लगइन-विकास ज्ञान-आधार है, जो एक इंस्टॉल-योग्य बंडल के रूप में पैक किया गया है और पूरी सामग्री को `dsh-plugin-guide` agent skill के रूप में पंजीकृत करता है। यह skill हर सत्र कैटलॉग में दृश्य रहती है और अपने वर्कफ़्लो चरण, आधिकारिक दस्तावेज़ और सामुदायिक गहन-विश्लेषण माँग पर लोड करती है।

- **प्लगइन अनुबंध और कठोर नियम** — effects/disposers, waterfall `next()`, मॉडल-दृश्य ⟺ लॉग किया गया, Schemastery विन्यास।
- **आधिकारिक दस्तावेज़ संग्रह** — आधिकारिक रेपो दस्तावेज़ों की शब्दशः प्रति (EN + ZH), अंतिम सत्यापित स्नैपशॉट पर अपस्ट्रीम से बाइट-समान।
- **Cordis प्राइमर** — पाँच अवधारणाएँ और तंत्र समयरेखा (repository-plugin 0809 को जोड़ा, 0811 को हटाया; दो इंस्टॉल चैनल)।
- **20+ वास्तविक-दुनिया नुकसान** मूल कारण + समाधान सहित (cordis दोहरी प्रतियाँ, tsconfig त्रयी, बहु-फ़्रेम zstd सत्र, Windows junction, पुराना npm `latest`, …)।
- **सामुदायिक गहन-विश्लेषण** — 114 सामुदायिक रिपॉज़िटरी संग्रहीत (15 गहन-विश्लेषित), साथ ही पूर्ण स्रोत सूची जहाँ हर तथ्य अपने मूल से जुड़ा है।
- **CLI टूलचेन** — `dsh-plugin-dev new / check / verify`: DSH प्लगइन स्कैफ़ोल्ड करना, स्थैतिक जाँच और पैक-सत्यापन; हर जाँच उस skill अनुभाग से जुड़ती है जिसे वह लागू करती है।

## Knowledge base

| Path | यह क्या है |
|---|---|
| `SKILL.md` | `dsh-plugin-guide` agent skill: कठोर नियम + कार्य-आधारित विकास पथ |
| `package.json` · `cordis.patch.yml` · `index.js` | इंस्टॉल-योग्य DSH बंडल: `dsh.bundle.patch` मैनिफ़ेस्ट + skill पंजीकृत करने वाला प्रवेश बिंदु |
| `guide/plugin-dev-guide.md` | पूर्ण विकास मार्गदर्शिका (10 अध्याय) |
| `guide/quick-reference.md` | एक-पृष्ठ चीट शीट (5 भाषाएँ) |
| `guide/links.md` | संकलित URL सूची: आधिकारिक विकास दस्तावेज़ (साइट ↔ स्थानीय प्रतियाँ) + सामुदायिक दस्तावेज़ लिंक |
| `references/official-docs/` | आधिकारिक रेपो दस्तावेज़ों की शब्दशः प्रति (EN + ZH) |
| `references/*.md` | शोध रिपोर्ट: रेपो दस्तावेज़, वेबसाइट, Cordis, पेपर, सामुदायिक पारिस्थितिकी, 114-रेपो संग्रह (15 गहन-विश्लेषित) |
| `scripts/` | इडेम्पोटेंट डाउनलोड स्क्रिप्ट + अखंडता जाँचकर्ता + विषय स्नैपशॉट जनरेटर |
| `bin/` · `src/cli/` · `dist/` | `dsh-plugin-dev` CLI: स्कैफ़ोल्डर, जाँचकर्ता, सत्यापक (TypeScript, tsdown-बंडल) |
| `templates/` | TS + JS स्कैफ़ोल्ड कंकाल: अनुबंध टेम्प्लेट, Config, टेस्ट, cordis.patch.yml, पाँच-भाषा README |
| `downloads/` | कच्चे स्नैपशॉट — `scripts/` से उत्पन्न, कमिट नहीं |

## CLI toolchain

बंडल शून्य-रनटाइम-निर्भरता `dsh-plugin-dev` CLI लेकर आता है (`bin/` → tsdown-बंडल `dist/dsh-plugin-dev.js`). हर जाँच उस skill अनुभाग को उद्धृत करती है जिसे वह लागू करती है, ताकि एजेंट मैन्युअल ऑडिट जारी रख सके।

```sh
dsh-plugin-dev new <name> [--lang ts|js] [--dir <path>] [--force] [--git]
dsh-plugin-dev check [--cwd <dir>] [--json] [--strict]
dsh-plugin-dev verify [--cwd <dir>] [--dsh <bin>] [--pnpm <bin>]
```

| उप-कमांड | क्या करता है |
|---|---|
| `new <name>` | TS या JS प्लगइन रेपो स्कैफ़ोल्ड करता है: `src/index.ts` अनुबंध टेम्प्लेट, Schemastery Config, टेस्ट, tsdown/vitest, टिप्पणी-युक्त `cordis.patch.yml`, पाँच-भाषा README। इडेम्पोटेंट; `--force` के बिना गैर-खाली लक्ष्य को अस्वीकार करता है। |
| `check` | स्थैतिक जाँच: `cordis.patch.yml` वैधता, `package.json` मेटाडेटा (`dsh.bundle.patch` पॉइंटर, peer deps, engines, files श्वेतसूची), पाँच-भाषा README संगति, इंजीनियरिंग रेड-लाइन पैटर्न। CI-उपभोज्य JSON उत्सर्जित करता है। |
| `verify` | `pnpm pack`, फिर साफ़ mkdtemp `DSH_HOME` प्रोफ़ाइल में बंडल को इंस्टॉल/स्टार्ट/अनइंस्टॉल स्मोक (आधिकारिक `verify:self-contained` से संरेखित)। विफलता लॉग टेल + सुझाव देती है। |

### CLI configuration

CLI में कोई हार्डकोडेड ट्यूनेबल नहीं — हर एक flag या पर्यावरण चर है।

| ट्यूनेबल | Flag | Env | डिफ़ॉल्ट |
|---|---|---|---|
| टेम्प्लेट निर्देशिका | — | `DSH_PLUGIN_DEV_TEMPLATES` | `<package>/templates` |
| dsh बाइनरी | `--dsh` | `DSH_PLUGIN_DEV_DSH` | `dsh` |
| pnpm बाइनरी | `--pnpm` | `DSH_PLUGIN_DEV_PNPM` | `pnpm` |
| इंस्टॉल/पैक टाइमआउट | `--timeout` | `DSH_PLUGIN_DEV_TIMEOUT` | `300000` ms |
| हेडलेस स्मोक टाइमआउट | `--smoke-timeout` | `DSH_PLUGIN_DEV_SMOKE_TIMEOUT` | `120000` ms |

### Upstream roadmap

`dsh-plugin-dev` आधिकारिक प्लगइन-विकास CLI (नियोजित आइटम C12) का अपस्ट्रीम उम्मीदवार है: स्कैफ़ोल्डर/जाँचकर्ता/सत्यापक यांत्रिक परतें हैं, जबकि `SKILL.md` + `guide/` संज्ञानात्मक परत बने रहते हैं।

## Quick start

```sh
# 1. install the bundle into your profile
dsh plugin --profile web add "github:PerryLink/dsh-plugin-guide#main"

# or from npm (published releases)
dsh plugin --profile web add dsh-plugin-guide

# 2. restart and verify the row
dsh --profile web --dump-config | grep -A3 'id: dsh-plugin-guide'
```

फिर बस अपने एजेंट से पूछें: *"मुझे … प्लगइन बनाने के लिए dsh-plugin-guide skill का उपयोग करो।"*

या सीधे CLI चलाएँ:

```sh
npx dsh-plugin-guide new hello-plugin            # TS प्लगइन रेपो स्कैफ़ोल्ड करें
npx dsh-plugin-guide check --json                # स्थैतिक जाँच
npx dsh-plugin-guide verify                      # पैक + साफ़ प्रोफ़ाइल स्मोक
```

## Install & uninstall

- **git चैनल** (नवीनतम `main`): `dsh plugin --profile web add github:PerryLink/dsh-plugin-guide#<sha>` — पुनरुत्पादन के लिए एक कमिट पिन करें; प्रवेश बिंदु सादा ESM JS है, कोई बिल्ड चरण नहीं।
- **npm चैनल** (प्रकाशित रिलीज़): `dsh plugin --profile web add dsh-plugin-guide`.
- **tarball चैनल**: इस रेपो में `pnpm pack`, फिर `dsh plugin --profile web add ./dsh-plugin-guide-<version>.tgz`.
- **uninstall**: `dsh plugin --profile web remove dsh-plugin-guide`.

## Copy as a plain agent skill

आप पूरे फ़ोल्डर को अपने एजेंट की skill निर्देशिका में भी कॉपी कर सकते हैं (सापेक्ष पथ बरकरार रहते हैं):

```powershell
# Windows (PowerShell)
pwsh -File scripts/install-skill.ps1 `
  -Target "$env:USERPROFILE\.deepseek\skills\dsh-plugin-guide"   # या <project>\.agents\skills\dsh-plugin-guide
```

```bash
# macOS / Linux
pwsh -File scripts/install-skill.ps1 -Target ~/.deepseek/skills/dsh-plugin-guide   # या <project>/.agents/skills/dsh-plugin-guide
```

इंस्टॉलर `downloads/` (उत्पन्न) और `.github/` को छोड़ता है, फिर हर कॉपी की गई फ़ाइल को बाइट-दर-बाइट सत्यापित करता है। पूरे फ़ोल्डर की मैन्युअल `Copy-Item -Recurse` भी काम करती है।

## Configuration

skill बंडल कोई Schemastery `Config` उजागर नहीं करता — यह ज्ञान-आधार को बिना किसी ट्यूनेबल कुंजी के एक agent skill के रूप में पंजीकृत करता है। `dsh-plugin-dev` CLI अपने ट्यूनेबल flags और `DSH_PLUGIN_DEV_*` पर्यावरण चरों से पढ़ता है ([CLI toolchain](#cli-toolchain) देखें)।

## Tools & surfaces

| Surface | Kind | Notes |
|---|---|---|
| `dsh-plugin-guide` | skill | `ctx.skills` से पंजीकृत; माँग पर `SKILL.md` + `./guide/` + `./references/` लोड करता है |
| `dsh-plugin-dev` | bin (CLI) | `new` / `check` / `verify` उप-कमांड; DSH प्लगइन पंक्ति नहीं |

## Permissions & data

- **Permissions**: workshop मैनिफ़ेस्ट में `filesystem:read` घोषित करता है।
- **Data**: केवल-पठन — अपनी पैक की गई `guide/` और `references/` फ़ाइलें पढ़ता है। कोई नेटवर्क अनुरोध नहीं, कोई लेखन नहीं, कोई मॉडल कॉल नहीं।

## Security boundaries

- **केवल-पठन ज्ञान-आधार।** बंडल केवल अपनी फ़ाइलें पढ़ता है; कभी लिखता नहीं, कभी नेटवर्क उपयोग नहीं करता, और कभी मॉडल नहीं बुलाता।
- **आधिकारिक दस्तावेज़ शब्दशः प्रतियाँ हैं।** `references/official-docs/` यहाँ कभी संपादित नहीं होता; समस्याएँ अपस्ट्रीम को रिपोर्ट करें और केवल `scripts/sync-official-docs.ps1` से पुनः-सिंक करें।
- **वितरण सीमाएँ।** पैक की गई तृतीय-पक्ष सामग्री अपना अपस्ट्रीम लाइसेंस रखती है; [NOTICE.md](NOTICE.md) देखें (जैसे `downloads/` केवल स्थानीय; `awesome-dsh-plugins` पुनर्वितरित नहीं होना चाहिए)।

## Known limitations

- **आधिकारिक दस्तावेज़ एक स्नैपशॉट है।** अपस्ट्रीम बदलने पर `scripts/sync-official-docs.ps1` से पुनः-सिंक करें; ताज़गी मुहर और कमिट हैश `references/official-docs/SNAPSHOT.md` को संदर्भित करते हैं।
- **`downloads/` उत्पन्न है, कमिट नहीं।** कच्चे स्नैपशॉट (सामुदायिक रेपो संग्रह, Discussions, लेख) उपयोग से पहले स्क्रिप्ट से उत्पन्न करने चाहिए।
- **`awesome-dsh-plugins` सामग्री केवल स्थानीय है।** इसका अपस्ट्रीम आंतरिक-उपयोग प्रतिबंध घोषित करता है, इसलिए इसे रेपो के साथ पुनर्वितरित नहीं किया जाता।

## Keeping it fresh

```sh
pwsh -File scripts/sync-official-docs.ps1                     # स्थानीय checkout से शब्दशः दस्तावेज़ प्रति
pwsh -File scripts/download-sources.ps1                       # आधिकारिक साइट/दस्तावेज़, Cordis, पेपर
pwsh -File scripts/download-community-repos.ps1               # सामुदायिक रिपॉज़िटरी (codeload tarballs)
pwsh -File scripts/download-community-articles.ps1            # zh/en/HN सामुदायिक लेख
pwsh -File scripts/archive-discussions.ps1                    # आधिकारिक Discussions ($env:GH_TOKEN चाहिए)
pwsh -File scripts/gen-topic-snapshot.ps1 -OutDir <dir>       # dsh-plugin विषय जनगणना
pwsh -File scripts/verify-kit.ps1 -Checkout <checkout>        # महत्वपूर्ण पथ + लिंक स्कैन + दस्तावेज़ विचलन
```

## Development

skill बंडल (`index.js`) सादा ESM है, कोई बिल्ड चरण नहीं; `dsh-plugin-dev` CLI TypeScript है, tsdown से बिल्ट। द्वार:

```sh
pnpm install --frozen-lockfile
pnpm run typecheck && pnpm run typecheck:ci
pnpm test
pnpm run build
pnpm run verify:artifacts        # आत्म-जाँच + स्कैफ़ोल्ड स्मोक (कोई नेटवर्क नहीं)
pnpm run verify:self-contained   # पैक + साफ़ प्रोफ़ाइल इंस्टॉल/स्टार्ट/अनइंस्टॉल स्मोक
pnpm pack
pwsh -File scripts/verify-kit.ps1   # महत्वपूर्ण पथ + लिंक स्कैन (-Checkout <checkout> से दस्तावेज़ विचलन)
```

## Topics

`dsh`, `deepseek-harness`, `dsh-plugin`, `cordis`, `agent-skill`, `plugin-development`, `knowledge-base`, `cli`, `scaffold`, `checker`

## Contributors

- [PerryLink](https://github.com/PerryLink) — निर्माता और अनुरक्षक: ज्ञान-आधार सामग्री, इंस्टॉल-योग्य बंडल रूपांतरण, पारिस्थितिकी योगदान और सामुदायिक अभियांत्रिकी।
- दैनिक अनुरक्षण में DeepSeek Harness एजेंट सहायता करते हैं (उनका कोई GitHub खाता नहीं है और वे पारदर्शिता हेतु यहाँ सूचीबद्ध हैं, योगदानकर्ता के रूप में नहीं)।

## PerryLink DSH Plugin Family

यह प्रोजेक्ट [PerryLink](https://github.com/PerryLink) द्वारा अनुरक्षित [33 DeepSeek Harness प्लगइनों](https://github.com/PerryLink) में से एक है। अगर यह आपकी मदद करता है, तो बाकी भी करेंगे:

| Plugin | One-liner |
|---|---|
| **[dsh-dsh-auto-review](https://github.com/PerryLink/dsh-dsh-auto-review)** | अनुमोदन श्रृंखला पर द्वितीय-मॉडल स्वतः-समीक्षा, डिफ़ॉल्ट रूप से विफल-बंद | |
| **[dsh-dsh-background-agents](https://github.com/PerryLink/dsh-dsh-background-agents)** | वेब UI साइडबार, संदेश और अवरोधन के साथ टिकाऊ पृष्ठभूमि चाइल्ड एजेंट | |
| **[dsh-dsh-budget](https://github.com/PerryLink/dsh-dsh-budget)** | DeepSeek Harness के लिए लागत प्रशासन: बजट, कार्बन और विलंबता एक पैनल में। | |
| **[dsh-dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-dsh-checkpoint-rewind)** | Claude Code /rewind-समतुल्य: स्नैपशॉट, सत्र फ़ॉर्क, एक-बार पुनर्स्थापना | |
| **[dsh-dsh-claude-move](https://github.com/PerryLink/dsh-dsh-claude-move)** | Claude Code सत्र, मेमोरी, कौशल और CLAUDE.md को DSH में स्थानांतरित करें | |
| **[dsh-dsh-click](https://github.com/PerryLink/dsh-dsh-click)** | DeepSeek Harness के लिए क्रॉस-प्लेटफ़ॉर्म नेटिव डेस्कटॉप नियंत्रण — Windows पहले। | |
| **[dsh-dsh-composer-history](https://github.com/PerryLink/dsh-dsh-composer-history)** | वेब कंपोज़र के लिए टर्मिनल-शैली इनपुट इतिहास: तीर, Ctrl+R खोज | |
| **[dsh-dsh-data-quality](https://github.com/PerryLink/dsh-dsh-data-quality)** | डेटासेट गुणवत्ता जाँच व उद्धरण सत्यापन (यहाँ उपभोग किया गया वैकल्पिक संख्या-सेतु) | |
| **[dsh-dsh-defend](https://github.com/PerryLink/dsh-dsh-defend)** | DeepSeek Harness के लिए प्रॉम्प्ट-इंजेक्शन, जेलब्रेक और सीक्रेट-लीक रक्षा। | |
| **[dsh-dsh-doublecheck](https://github.com/PerryLink/dsh-dsh-doublecheck)** | इंजीनियरिंग-अनुशासन रक्षक: आवश्यकताओं की पूछताछ, परीक्षण द्वार, प्रतिद्वंद्वी समीक्षा | |
| **[dsh-dsh-draw](https://github.com/PerryLink/dsh-dsh-draw)** | DeepSeek Harness के लिए एकीकृत स्थैतिक-छवि निर्माण रूटिंग। | |
| **[dsh-dsh-fast](https://github.com/PerryLink/dsh-dsh-fast)** | DeepSeek Harness के लिए रीड-ओनली प्रदर्शन डायग्नोस्टिक्स। | |
| **[dsh-dsh-fund-research](https://github.com/PerryLink/dsh-dsh-fund-research)** | चीनी सार्वजनिक म्यूचुअल फंड के लिए नियतात्मक अनुसंधान रिपोर्ट | |
| **[dsh-dsh-github](https://github.com/PerryLink/dsh-dsh-github)** | DSH के लिए GitHub PR/issues एकीकरण, हर लेखन अनुमोदन-द्वारित | |
| **[dsh-dsh-industry-research](https://github.com/PerryLink/dsh-dsh-industry-research)** | उद्योग-अनुसंधान ऑर्केस्ट्रेशन जो इस प्लगिन के `ctx.researchReport.assemble` से डिलीवरेबल सील करता है | |
| **[dsh-dsh-library](https://github.com/PerryLink/dsh-dsh-library)** | DeepSeek Harness के लिए स्थानीय दस्तावेज़ ज्ञानकोश। | |
| **[dsh-dsh-local-ai](https://github.com/PerryLink/dsh-dsh-local-ai)** | DeepSeek Harness के लिए स्थानीय-मॉडल (Ollama) एकीकरण। | |
| **[dsh-dsh-lsp-actions](https://github.com/PerryLink/dsh-dsh-lsp-actions)** | भाषा सर्वरों पर LSP निदान, फ़ॉर्मेटिंग, पूर्णता, कोड क्रियाएँ और नाम बदलना | |
| **[dsh-dsh-mask](https://github.com/PerryLink/dsh-dsh-mask)** | PII मास्किंग मिडलवेयर: मॉडल सीमा पर अनाम करें, डिस्प्ले लेयर पर पुनर्स्थापित करें | |
| **[dsh-dsh-mcp-panel](https://github.com/PerryLink/dsh-dsh-mcp-panel)** | केवल-पढ़ने वाला MCP रनटाइम पैनल: /mcp कमांड + स्थिति, टूल और त्रुटियों वाला Settings टैब | |
| **[dsh-dsh-memento](https://github.com/PerryLink/dsh-dsh-memento)** | अनुमोदन-द्वारित क्रॉस-सत्र मेमोरी: ctx.memory सीम + SQLite + मेमोरी टूल | |
| **[dsh-dsh-observe](https://github.com/PerryLink/dsh-dsh-observe)** | DeepSeek Harness के लिए OpenTelemetry और Langfuse अवलोकनीयता निर्यातक। | |
| **[dsh-dsh-output-styles](https://github.com/PerryLink/dsh-dsh-output-styles)** | Claude Code outputStyles-समतुल्य रनटाइम शैली बदलाव | |
| **[dsh-dsh-permission-rules](https://github.com/PerryLink/dsh-dsh-permission-rules)** | ऑडिट के साथ Claude Code-शैली घोषणात्मक allow/deny/ask अनुमति नियम | |
| **[dsh-dsh-research-report](https://github.com/PerryLink/dsh-dsh-research-report)** | सामग्री-पता साक्ष्य और सीलबंद संस्करणों वाला सत्यापन-योग्य अनुसंधान-रिपोर्ट इंजन | |
| **[dsh-dsh-score](https://github.com/PerryLink/dsh-dsh-score)** | DeepSeek Harness प्लगिनों की बहु-आयामी गुणवत्ता स्कोरिंग। | |
| **[dsh-dsh-session-pin](https://github.com/PerryLink/dsh-dsh-session-pin)** | टिकाऊ क्रम के साथ वेब साइडबार में सत्र पिन करें | |
| **[dsh-dsh-session-sync](https://github.com/PerryLink/dsh-dsh-session-sync)** | DeepSeek Harness के लिए क्रॉस-डिवाइस सत्र सिंक — आपके सत्र स्टोर का एक समर्पित git मिरर। | |
| **[dsh-dsh-skill-pack-security](https://github.com/PerryLink/dsh-dsh-skill-pack-security)** | सुरक्षा-ऑडिट कौशल पैक: गुप्त स्कैन, निर्भरता और आपूर्ति-श्रृंखला समीक्षा | |
| **[dsh-dsh-talk](https://github.com/PerryLink/dsh-dsh-talk)** | DeepSeek Harness के लिए आवाज़-प्रथम सत्र लूप: बोलें और उत्तर सुनें। | |
| **[dsh-dsh-test-drive](https://github.com/PerryLink/dsh-dsh-test-drive)** | DeepSeek Harness प्लगिनों के लिए पृथक इंस्टॉल-एंड-स्मोक टेस्ट ड्राइव। | |
| **[dsh-dsh-translate](https://github.com/PerryLink/dsh-dsh-translate)** | DeepSeek Harness के लिए वेंडर पैरामीटर अनुवाद और नियतात्मक JSON मरम्मत। | |

## Disclaimer

सामुदायिक-अनुरक्षित, **नहीं** एक आधिकारिक DeepSeek उत्पाद। DeepSeek Harness डेवलपर पूर्वावलोकन में है और ब्रेकिंग बदलाव प्रकाशित करता है; संदेह होने पर `references/official-docs/` में आधिकारिक दस्तावेज़ सत्य का स्रोत हैं।

## License

[Apache License 2.0](LICENSE) © 2026 dsh-plugin-guide contributors — हमारा अपना पाठ (`SKILL.md`, `guide/`, `references/`, `scripts/`, यह README) Apache-2.0 है; पैक की गई तृतीय-पक्ष सामग्री [NOTICE.md](NOTICE.md) में दस्तावेज़ित है।
