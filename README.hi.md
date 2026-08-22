<div align="center">

# 🐳 dsh-plugin-guide

**[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) प्लगइन बनाने के लिए आपकी ज़रूरत की हर चीज़।**

*आधिकारिक दस्तावेज़ संग्रह · Cordis प्राइमर · सामुदायिक गहन-विश्लेषण · युद्ध-परीक्षित नुकसान · agent skill*

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
| `downloads/` | कच्चे स्नैपशॉट — `scripts/` से उत्पन्न, कमिट नहीं |

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

`dsh-plugin-guide` कोई Schemastery `Config` उजागर नहीं करता — यह ज्ञान-आधार को बिना किसी ट्यूनेबल कुंजी के एक agent skill के रूप में पंजीकृत करता है।

## Tools & surfaces

| Surface | Kind | Notes |
|---|---|---|
| `dsh-plugin-guide` | skill | `ctx.skills` से पंजीकृत; माँग पर `SKILL.md` + `./guide/` + `./references/` लोड करता है |

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

बंडल सादा ESM है — कोई बिल्ड चरण नहीं। CI हर push और pull request पर अखंडता द्वार चलाता है:

```sh
pwsh -File scripts/verify-kit.ps1   # महत्वपूर्ण पथ + लिंक स्कैन (-Checkout <checkout> से दस्तावेज़ विचलन)
```

## Topics

`dsh`, `deepseek-harness`, `dsh-plugin`, `cordis`, `agent-skill`, `plugin-development`, `knowledge-base`

## Contributors

- [PerryLink](https://github.com/PerryLink) — निर्माता और अनुरक्षक: ज्ञान-आधार सामग्री, इंस्टॉल-योग्य बंडल रूपांतरण, पारिस्थितिकी योगदान और सामुदायिक अभियांत्रिकी।
- दैनिक अनुरक्षण में DeepSeek Harness एजेंट सहायता करते हैं (उनका कोई GitHub खाता नहीं है और वे पारदर्शिता हेतु यहाँ सूचीबद्ध हैं, योगदानकर्ता के रूप में नहीं)।

## PerryLink DSH Plugin Family

यह परियोजना [PerryLink](https://github.com/PerryLink) द्वारा अनुरक्षित [15 DeepSeek Harness प्लगइन](https://github.com/PerryLink) में से एक है। यदि यह आपकी मदद करता है, तो बाकी भी संभवतः करेंगे:

| Plugin | One-liner |
|---|---|
| [dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel) | Read-only MCP runtime panel: /mcp command + Settings tab with status, tools and errors |
| [dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck) | Engineering-discipline guard: requirements grill, test gates, adversary review |
| [dsh-background-agents](https://github.com/PerryLink/dsh-background-agents) | Durable background child agents with a Web UI sidebar, messaging and interrupt |
| [dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions) | LSP diagnostics, formatting, completion, code actions and rename over language servers |
| [dsh-output-styles](https://github.com/PerryLink/dsh-output-styles) | Claude Code outputStyles-equivalent runtime style switching |
| [dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind) | Claude Code /rewind-equivalent: snapshots, session forks, one-shot restore |
| [dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules) | Claude Code-style declarative allow/deny/ask permission rules with audit |
| [dsh-auto-review](https://github.com/PerryLink/dsh-auto-review) | Second-model auto-review on the approval chain, fail-closed by default |
| [dsh-memento](https://github.com/PerryLink/dsh-memento) | Approval-gated cross-session memory: ctx.memory seam + SQLite + memory tool |
| [dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security) | Security-audit skill pack: secret scan, dependency and supply-chain review |
| [dsh-session-pin](https://github.com/PerryLink/dsh-session-pin) | Pin sessions in the Web sidebar with durable ordering |
| [dsh-composer-history](https://github.com/PerryLink/dsh-composer-history) | Terminal-style input history for the web composer: arrows, Ctrl+R search |
| [dsh-github](https://github.com/PerryLink/dsh-github) | GitHub PR/issues integration for DSH, every write gated by approval |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** | Plugin-development knowledge base as an on-demand agent skill |
| [dsh-claude-move](https://github.com/PerryLink/dsh-claude-move) | Migrate Claude Code sessions, memory, skills and CLAUDE.md into DSH |

## Disclaimer

सामुदायिक-अनुरक्षित, **नहीं** एक आधिकारिक DeepSeek उत्पाद। DeepSeek Harness डेवलपर पूर्वावलोकन में है और ब्रेकिंग बदलाव प्रकाशित करता है; संदेह होने पर `references/official-docs/` में आधिकारिक दस्तावेज़ सत्य का स्रोत हैं।

## License

[Apache License 2.0](LICENSE) © 2026 dsh-plugin-guide contributors — हमारा अपना पाठ (`SKILL.md`, `guide/`, `references/`, `scripts/`, यह README) Apache-2.0 है; पैक की गई तृतीय-पक्ष सामग्री [NOTICE.md](NOTICE.md) में दस्तावेज़ित है।
