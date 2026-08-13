<div align="center">

# 🐳 dsh-plugin-guide

**[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) प्लगइन बनाने के लिए आपको जो कुछ चाहिए।**

आधिकारिक दस्तावेज़ संग्रह · Cordis परिचय · समुदाय विश्लेषण · वास्तविक समस्याएँ · एजेंट स्किल

[English](README.md) · [中文](README.zh-CN.md) · [Español](README.es.md) · [Português](README.pt.md) · [हिन्दी](README.hi.md)

[![GitHub stars](https://img.shields.io/github/stars/PerryLink/dsh-plugin-guide?style=for-the-badge&color=yellow&label=%E2%AD%90%20Stars)](https://github.com/PerryLink/dsh-plugin-guide/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/PerryLink/dsh-plugin-guide?style=for-the-badge&color=blue&label=Forks)](https://github.com/PerryLink/dsh-plugin-guide/network/members)
[![verify-kit CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-plugin-guide/verify.yml?branch=main&style=for-the-badge&label=CI)](https://github.com/PerryLink/dsh-plugin-guide/actions/workflows/verify.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue?style=for-the-badge)](LICENSE)
[![Topic: dsh](https://img.shields.io/badge/Topic-dsh-4D6BFE?style=for-the-badge)](https://github.com/topics/dsh)
[![Topic: dsh-plugin](https://img.shields.io/badge/Topic-dsh--plugin-8257D0?style=for-the-badge)](https://github.com/topics/dsh-plugin)
[![Docs: EN/ZH](https://img.shields.io/badge/Docs-EN%2FZH-8257D0?style=for-the-badge)](references/official-docs/)

</div>

> 🗺️ **हर तथ्य अपने मूल से जुड़ा है** — आधिकारिक दस्तावेज़, अपस्ट्रीम रिपो या सामुदायिक रिपो। संदेह हो तो आधिकारिक हूबहू प्रति ही मान्य है।
>
> ⏱️ **अंतिम सत्यापन 2026-08-14** — आधिकारिक दस्तावेज़ अपस्ट्रीम `master` (47f9438) से बाइट-दर-बाइट समान; npm टैग और `dsh-plugin` टॉपिक (550+ रेपो) लाइव पुनः-जाँचे गए।

## 📊 एक नज़र में

| आधिकारिक दस्तावेज़ | सामुदायिक विश्लेषण | वास्तविक समस्याएँ | `dsh-plugin` टॉपिक | भाषाएँ | एजेंट स्किल |
|---|---|---|---|---|---|
| 215 पृष्ठ (EN + ZH) | 15 रिपो | 20+ | 550+ रिपो | EN · 中文 · ES · PT · HI | `dsh-plugin-guide` |

## 🚀 त्वरित शुरुआत

### 🤖 एजेंट स्किल के रूप में उपयोग करें

पूरा फ़ोल्डर अपने एजेंट की स्किल डायरेक्टरी में कॉपी करें (सापेक्ष पथ वैसे ही काम करते हैं):

**Windows (PowerShell)**

```powershell
Copy-Item -Recurse -Force `
  'D:\path\to\dsh-plugin-guide' `
  "$env:USERPROFILE\.deepseek\skills\dsh-plugin-guide"   # या <project>\.agents\skills\
```

**macOS / Linux**

```bash
cp -r /path/to/dsh-plugin-guide ~/.deepseek/skills/      # या <project>/.agents/skills/
```

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
| `references/*.md` | शोध रिपोर्ट: रिपो दस्तावेज़, वेबसाइट, Cordis, पेपर, सामुदायिक पारिस्थितिकी, 15 रिपो विश्लेषण |
| `scripts/` | आइडेम्पोटेंट डाउनलोड स्क्रिप्ट + अखंडता जाँचकर्ता + टॉपिक जनगणना जनरेटर |
| `downloads/` | कच्चे स्नैपशॉट — `scripts/` से बनते हैं, गिट में नहीं |

## ✨ मुख्य आकर्षण

- 📜 **प्लगइन अनुबंध और सख़्त नियम** — इफ़ेक्ट/डिस्पोज़र, waterfall में `next()`, मॉडल-दृश्य ⇔ लॉग, Schemastery कॉन्फ़िग।
- 🕰️ **तंत्र की समयरेखा** — repository-plugin 0809 को आया, 0811 को हटाया गया; दो इंस्टॉल मार्ग (bundle बनाम सादा cordis प्लगइन)।
- 🕳️ **20+ वास्तविक समस्याएँ** कारण और समाधान सहित: cordis की दोहरी प्रतियाँ, tsconfig तिकड़ी, त्रुटि पर भी `tsc` का आउटपुट, Windows junctions, मल्टी-फ़्रेम zstd सत्र, `DSH_*` पर्यावरण चर, npm का पुराना `latest`…
- 🔬 **15 सामुदायिक रिपो का गहन विश्लेषण** — टेम्पलेट, स्कैफ़ोल्ड, समस्या-संग्रह, plugin-check नियम, Fabric परत, MCP ब्रिज।
- 🔗 **संपूर्ण स्रोत सूची** — हर तथ्य अपने मूल (आधिकारिक दस्तावेज़, अपस्ट्रीम रिपो, सामुदायिक रिपो) से जुड़ा है।
- 🆕 **ताज़गी की मुहर** — 2026-08-14 को अपस्ट्रीम `master`, npm और लाइव `dsh-plugin` टॉपिक से पुनः-सत्यापित।

## 🔄 इसे ताज़ा रखें

```sh
pwsh -File scripts/download-sources.ps1                       # आधिकारिक साइट/दस्तावेज़, Cordis, पेपर
pwsh -File scripts/download-community-repos.ps1               # 15 सामुदायिक रिपॉज़िटरी
pwsh -File scripts/gen-topic-snapshot.ps1 -OutDir <dir>       # dsh-plugin टॉपिक जनगणना
pwsh -File scripts/verify-kit.ps1                             # महत्वपूर्ण पथ + टूटी कड़ियों की जाँच
```

हर push और pull request पर CI `verify-kit` चलाता है।

## 🏷️ टॉपिक्स

यह रिपॉज़िटरी GitHub टॉपिक्स **[`dsh`](https://github.com/topics/dsh)** और **[`dsh-plugin`](https://github.com/topics/dsh-plugin)** के अंतर्गत खोजी जा सकती है — दोनों टॉपिक पृष्ठों पर सैकड़ों प्लगइन और डेवलपर संसाधन मिलते हैं।

## 🤝 सहभागी हों

- ⭐ **स्टार दें** — इससे अन्य DSH प्लगइन लेखकों को यह मिल पाएगा।
- कोई त्रुटि, नई समस्या या विश्लेषण योग्य रिपो मिला? [issue](https://github.com/PerryLink/dsh-plugin-guide/issues) खोलें या pull request भेजें — देखें [CONTRIBUTING.md](CONTRIBUTING.md)।
- समुदाय से जुड़ें: [DeepSeek Harness Discord](https://discord.gg/Ycq5dCaS4) · [आधिकारिक चर्चाएँ](https://github.com/deepseek-ai/deepseek-harness/discussions) · [`dsh-plugin` टॉपिक](https://github.com/topics/dsh-plugin)।

## 📄 लाइसेंस और श्रेय

- हमारा अपना पाठ (`SKILL.md`, `guide/`, `references/` की रिपोर्टें, `scripts/`, यह README): **Apache-2.0** — देखें [LICENSE](LICENSE)।
- शामिल तृतीय-पक्ष सामग्री [NOTICE.md](NOTICE.md) में दर्ज है, वितरण सीमाओं सहित
  (जैसे `downloads/` केवल स्थानीय उपयोग हेतु; `awesome-dsh-plugins` का पुनर्वितरण न करें)।

## ⚖️ अस्वीकरण

समुदाय-संचालित; **यह DeepSeek का आधिकारिक उत्पाद नहीं है।** DeepSeek Harness डेवलपर प्रीव्यू में है और
असंगत बदलाव लाता है; संदेह हो तो `references/official-docs/` में मौजूद आधिकारिक दस्तावेज़ ही अंतिम सत्य हैं।
