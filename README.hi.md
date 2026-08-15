<div align="center">

# 🐳 dsh-plugin-guide

**[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) प्लगइन बनाने के लिए आपको जो कुछ चाहिए।**

आधिकारिक दस्तावेज़ संग्रह · Cordis परिचय · समुदाय विश्लेषण · वास्तविक समस्याएँ · एजेंट स्किल

[English](README.md) · [中文](README.zh-CN.md) · [Español](README.es.md) · [Português](README.pt.md) · [हिन्दी](README.hi.md)

[![GitHub stars](https://img.shields.io/github/stars/PerryLink/dsh-plugin-guide?style=for-the-badge&color=yellow&label=%E2%AD%90%20Stars)](https://github.com/PerryLink/dsh-plugin-guide/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/PerryLink/dsh-plugin-guide?style=for-the-badge&color=blue&label=Forks)](https://github.com/PerryLink/dsh-plugin-guide/network/members)
[![verify-kit CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-plugin-guide/verify.yml?branch=main&style=for-the-badge&label=CI)](https://github.com/PerryLink/dsh-plugin-guide/actions/workflows/verify.yml)
[![npm version](https://img.shields.io/npm/v/dsh-plugin-guide?style=for-the-badge&label=npm)](https://www.npmjs.com/package/dsh-plugin-guide)
[![npm downloads](https://img.shields.io/npm/dm/dsh-plugin-guide?style=for-the-badge&label=downloads)](https://www.npmjs.com/package/dsh-plugin-guide)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue?style=for-the-badge)](LICENSE)
[![Topic: dsh](https://img.shields.io/badge/Topic-dsh-4D6BFE?style=for-the-badge)](https://github.com/topics/dsh)
[![Topic: dsh-plugin](https://img.shields.io/badge/Topic-dsh--plugin-8257D0?style=for-the-badge)](https://github.com/topics/dsh-plugin)
[![Docs: EN/ZH](https://img.shields.io/badge/Docs-EN%2FZH-8257D0?style=for-the-badge)](references/official-docs/)

</div>

> 🗺️ **हर तथ्य अपने मूल से जुड़ा है** — आधिकारिक दस्तावेज़, अपस्ट्रीम रिपो या सामुदायिक रिपो। संदेह हो तो आधिकारिक हूबहू प्रति ही मान्य है।
>
> ⏱️ **अंतिम सत्यापन 2026-08-15** — आधिकारिक दस्तावेज़ अपस्ट्रीम `master` (47f9438, देखें [SNAPSHOT.md](references/official-docs/SNAPSHOT.md)) से बाइट-दर-बाइट समान; npm टैग और `dsh-plugin` टॉपिक (08-15 स्नैपशॉट के दौरान API total_count **2668 → 2671** बढ़ा; 998 रेपो कैप्चर, देखें [sources.md](references/sources.md) §D.2) लाइव पुनः-जाँचे गए; अपस्ट्रीम HEAD (47f9438) व npm `@deepseek-ai/dsh` (0.1.0-rc.6) में कोई बदलाव नहीं।

## 📊 एक नज़र में

| आधिकारिक दस्तावेज़ | सामुदायिक विश्लेषण | वास्तविक समस्याएँ | `dsh-plugin` टॉपिक | भाषाएँ | एजेंट स्किल |
|---|---|---|---|---|---|
| 215 पृष्ठ (EN + ZH) | 114 रिपो | 20+ | 998 स्नैपशॉट (API ≈2670) | EN · 中文 · ES · PT · HI | `dsh-plugin-guide` |

## 🚀 त्वरित शुरुआत

### 🧩 DSH प्लगइन के रूप में इंस्टॉल करें (अनुशंसित)

यह रिपॉज़िटरी एक इंस्टॉल करने योग्य **DSH bundle** है: यह पूरे नॉलेज बेस को `dsh-plugin-guide` एजेंट स्किल के रूप में पंजीकृत करता है। स्किल हर सत्र के कैटलॉग में दिखती है और मॉडल वर्कफ़्लो, आधिकारिक दस्तावेज़ और सामुदायिक विश्लेषण माँग पर लोड करता है (`./guide/`, `./references/`) — बिना कॉपी किए, बिना खोजे।

```sh
dsh plugin --profile <profile> add github:PerryLink/dsh-plugin-guide#<sha>
# या tarball: pnpm pack && dsh plugin --profile <profile> add ./dsh-plugin-guide-<version>.tgz
```

बंडल `dsh.bundle.patch` घोषित करता है और वैकल्पिक peerDependency के रूप में `@deepseek-ai/dsh@0.1.0-rc.6` ट्रेन को पिन करता है।

### 🤖 एजेंट स्किल के रूप में उपयोग करें

पूरा फ़ोल्डर अपने एजेंट की स्किल डायरेक्टरी में कॉपी करें (सापेक्ष पथ वैसे ही काम करते हैं):

**Windows (PowerShell)**

```powershell
pwsh -File scripts/install-skill.ps1 `
  -Target "$env:USERPROFILE\.deepseek\skills\dsh-plugin-guide"   # या <project>\.agents\skills\dsh-plugin-guide
```

**macOS / Linux**

```bash
pwsh -File scripts/install-skill.ps1 -Target ~/.deepseek/skills/dsh-plugin-guide   # या <project>/.agents/skills/dsh-plugin-guide
```

इंस्टॉलर `downloads/` (जनरेटेड) और `.github/` को छोड़ देता है, और हर कॉपी की गई फ़ाइल को बाइट-दर-बाइट सत्यापित करता है। पूरे फ़ोल्डर का मैन्युअल `Copy-Item -Recurse` भी काम करता है।

फिर अपने एजेंट से कहें: *"dsh-plugin-guide स्किल का उपयोग करके मुझे एक … प्लगइन बनाओ।"*

### 📖 या बस पढ़ें

| आप चाहते हैं… | पढ़ें |
|---|---|
| एक पेज की चीट शीट | [`guide/quick-reference.md`](guide/quick-reference.md) |
| 10 अध्यायों का पूरा रास्ता | [`guide/plugin-dev-guide.md`](guide/plugin-dev-guide.md) |
| आधिकारिक व सामुदायिक दस्तावेज़ लिंक | [`guide/links.md`](guide/links.md) · [`references/community-ecosystem.md`](references/community-ecosystem.md) |
| सेवा/इवेंट के सटीक API | `references/official-docs/docs/subsystems/` और `docs/cordis-api/` |

## 🧭 सामग्री

| पथ | क्या है |
|---|---|
| `SKILL.md` | `dsh-plugin-guide` स्किल: सख़्त नियम + कार्य-आधारित विकास पथ |
| `guide/plugin-dev-guide.md` | संपूर्ण विकास गाइड (10 अध्याय) |
| `guide/quick-reference.md` | एक पेज की चीट शीट (5 भाषाएँ) |
| `guide/links.md` | क्यूरेटेड URL सूची: आधिकारिक डेव दस्तावेज़ (साइट ↔ स्थानीय प्रतियाँ) + सामुदायिक लिंक |
| `references/official-docs/` | आधिकारिक रिपो दस्तावेज़ की हूबहू प्रति (EN + ZH) |
| `references/*.md` | शोध रिपोर्ट: रिपो दस्तावेज़, वेबसाइट, Cordis, पेपर, सामुदायिक पारिस्थितिकी, 114 रिपो संग्रह (15 का विश्लेषण) |
| `scripts/` | आइडेम्पोटेंट डाउनलोड स्क्रिप्ट + अखंडता जाँचकर्ता + टॉपिक जनगणना जनरेटर |
| `downloads/` | कच्चे स्नैपशॉट — `scripts/` से बनते हैं, गिट में नहीं |

## ✨ मुख्य आकर्षण

- 📜 **प्लगइन अनुबंध और सख़्त नियम** — इफ़ेक्ट/डिस्पोज़र, waterfall में `next()`, मॉडल-दृश्य ⇔ लॉग, Schemastery कॉन्फ़िग।
- 🕰️ **तंत्र की समयरेखा** — repository-plugin 0809 को आया, 0811 को हटाया गया; दो इंस्टॉल मार्ग (bundle बनाम सादा cordis प्लगइन)।
- 🕳️ **20+ वास्तविक समस्याएँ** कारण और समाधान सहित: cordis की दोहरी प्रतियाँ, tsconfig तिकड़ी, त्रुटि पर भी `tsc` का आउटपुट, Windows junctions, मल्टी-फ़्रेम zstd सत्र, `DSH_*` पर्यावरण चर, npm का पुराना `latest`…
- 🔬 **114 सामुदायिक रिपो संग्रहीत** (15 का गहन विश्लेषण) — टेम्पलेट, स्कैफ़ोल्ड, समस्या-संग्रह, plugin-check नियम, Fabric परत, MCP ब्रिज, साथ ही 15-भाषा गाइड, s01–s23 पाठ्यक्रम, हैंडबुक, TS/Rust SDK और 08-15 बैच (डेस्कटॉप शेल, QQ ब्रिज, सुरक्षा PoC, Python पोर्ट)।
- 🔗 **संपूर्ण स्रोत सूची** — हर तथ्य अपने मूल (आधिकारिक दस्तावेज़, अपस्ट्रीम रिपो, सामुदायिक रिपो) से जुड़ा है।
- 🗃️ **1654 आधिकारिक Discussions संग्रहीत** (चयनित थ्रेड्स की टिप्पणियों सहित) + 100+ सामुदायिक लेख (zh/en/HN) — `scripts/archive-discussions.ps1` / `scripts/download-community-articles.ps1` से ताज़ा करें।
- 🆕 **ताज़गी की मुहर** — 2026-08-15 को अपस्ट्रीम `master`, npm और लाइव `dsh-plugin` टॉपिक से पुनः-सत्यापित।

## 🔄 इसे ताज़ा रखें

```sh
pwsh -File scripts/sync-official-docs.ps1                     # स्थानीय checkout से हूबहू दस्तावेज़ प्रति (केवल origin/master)
pwsh -File scripts/download-sources.ps1                       # आधिकारिक साइट/दस्तावेज़, Cordis, पेपर
pwsh -File scripts/download-community-repos.ps1               # 114 सामुदायिक रिपॉज़िटरी (codeload tarball, ETag रिफ़्रेश)
pwsh -File scripts/download-community-articles.ps1            # zh/en/HN सामुदायिक लेख (HTML स्नैपशॉट)
pwsh -File scripts/archive-discussions.ps1                    # आधिकारिक Discussions ($env:GH_TOKEN आवश्यक)
pwsh -File scripts/gen-topic-snapshot.ps1 -OutDir <dir>       # dsh-plugin टॉपिक जनगणना
pwsh -File scripts/verify-kit.ps1 -Checkout <checkout>        # महत्वपूर्ण पथ + टूटी कड़ियाँ + दस्तावेज़ ड्रिफ़्ट रिपोर्ट
```

हर push और pull request पर CI `verify-kit` चलाता है।

## 🏷️ टॉपिक्स

यह रिपॉज़िटरी GitHub टॉपिक्स **[`dsh`](https://github.com/topics/dsh)** और **[`dsh-plugin`](https://github.com/topics/dsh-plugin)** के अंतर्गत खोजी जा सकती है — दोनों टॉपिक पृष्ठों पर सैकड़ों प्लगइन और डेवलपर संसाधन मिलते हैं।

## 🤝 सहभागी हों

- ⭐ **स्टार दें** — इससे अन्य DSH प्लगइन लेखकों को यह मिल पाएगा।
- कोई त्रुटि, नई समस्या या विश्लेषण योग्य रिपो मिला? [issue](https://github.com/PerryLink/dsh-plugin-guide/issues) खोलें या pull request भेजें — देखें [CONTRIBUTING.md](CONTRIBUTING.md)।
- समुदाय से जुड़ें: [DeepSeek Harness Discord](https://discord.gg/Ycq5dCaS4) · [आधिकारिक चर्चाएँ](https://github.com/deepseek-ai/deepseek-harness/discussions) · [`dsh-plugin` टॉपिक](https://github.com/topics/dsh-plugin)।

## 💛 योगदानकर्ता

- [PerryLink](https://github.com/PerryLink) — निर्माता और अनुरक्षक: नॉलेज बेस सामग्री, इंस्टॉल करने योग्य बंडल रूपांतरण, इकोसिस्टम योगदान और सामुदायिक इंजीनियरिंग।
- दैनिक अनुरक्षण में DeepSeek Harness एजेंट सहायता करते हैं (उनका कोई GitHub खाता नहीं है; पारदर्शिता के लिए सूचीबद्ध, योगदानकर्ता के रूप में नहीं)।


## 📄 लाइसेंस और श्रेय

- हमारा अपना पाठ (`SKILL.md`, `guide/`, `references/` की रिपोर्टें, `scripts/`, यह README): **Apache-2.0** — देखें [LICENSE](LICENSE)।
- शामिल तृतीय-पक्ष सामग्री [NOTICE.md](NOTICE.md) में दर्ज है, वितरण सीमाओं सहित
  (जैसे `downloads/` केवल स्थानीय उपयोग हेतु; `awesome-dsh-plugins` का पुनर्वितरण न करें)।

## ⚖️ अस्वीकरण

समुदाय-संचालित; **यह DeepSeek का आधिकारिक उत्पाद नहीं है।** DeepSeek Harness डेवलपर प्रीव्यू में है और
असंगत बदलाव लाता है; संदेह हो तो `references/official-docs/` में मौजूद आधिकारिक दस्तावेज़ ही अंतिम सत्य हैं।
