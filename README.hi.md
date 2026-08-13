<h1 align="center">dsh-plugin-guide</h1>

<p align="center">
  <b>DeepSeek Harness प्लगइन बनाने के लिए आपको जो कुछ चाहिए।</b><br/>
  आधिकारिक दस्तावेज़ संग्रह · Cordis परिचय · समुदाय विश्लेषण · वास्तविक समस्याएँ · एजेंट स्किल
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">中文</a> ·
  <a href="README.es.md">Español</a> ·
  <a href="README.pt.md">Português</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="लाइसेंस: MIT">
  <img src="https://img.shields.io/badge/dsh-dsh--plugin-4D6BFE" alt="dsh-plugin">
  <img src="https://img.shields.io/badge/documents-EN%2FZH-8257D0" alt="दस्तावेज़: EN/ZH">
</p>

---

## यह क्या है?

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) — जो
[Cordis](https://github.com/cordiverse/cordis) पर बना ["हर चीज़ एक प्लगइन है"](https://github.com/deepseek-ai/deepseek-harness)
वाला एजेंट हार्नेस है (इसका डिज़ाइन
[A Programming Paradigm for Spatiotemporal Composability](https://github.com/cordiverse/paper) में वर्णित है) —
के लिए प्लगइन विकसित करने हेतु एक **आत्मनिर्भर** ज्ञानकोश।

इसमें शामिल हैं:

- **आधिकारिक दस्तावेज़ की हूबहू प्रति** (अंग्रेज़ी + चीनी, 215 पृष्ठ),
- **Cordis** पर शोध और **Cordis का पेपर**,
- **15 सामुदायिक प्लगइन-डेव रिपॉज़िटरी का गहन विश्लेषण**,
- **20+ वास्तविक, परखी हुई समस्याएँ** (cordis की दोहरी प्रतियाँ, tsconfig तिकड़ी, मल्टी-फ़्रेम zstd, …),
- यह सब एक **चरण-दर-चरण गाइड** और **एक पेज की चीट शीट** में संक्षेपित,
- और एक इंस्टॉल करने योग्य **एजेंट स्किल** (`dsh-plugin-guide`) जिसे किसी भी एजेंट सत्र में बुलाया जा सकता है।

## सामग्री

| पथ | क्या है |
|---|---|
| `SKILL.md` | `dsh-plugin-guide` स्किल: सख़्त नियम + कार्य-आधारित विकास पथ |
| `guide/plugin-dev-guide.md` | संपूर्ण विकास गाइड (10 अध्याय) |
| `guide/quick-reference.md` | एक पेज की चीट शीट |
| `references/official-docs/` | आधिकारिक दस्तावेज़ की हूबहू प्रति (EN + ZH) |
| `references/*.md` | शोध रिपोर्ट: रिपो दस्तावेज़, वेबसाइट, Cordis, पेपर, पारिस्थितिकी, 15 रिपो विश्लेषण |
| `scripts/` | आइडेम्पोटेंट डाउनलोड स्क्रिप्ट + अखंडता जाँचकर्ता |
| `downloads/` | कच्चे स्नैपशॉट — `scripts/` से बनते हैं, गिट में नहीं |

## त्वरित शुरुआत

### एजेंट स्किल के रूप में उपयोग करें

पूरा फ़ोल्डर अपने एजेंट की स्किल डायरेक्टरी में कॉपी करें (सापेक्ष पथ वैसे ही काम करते हैं):

```powershell
Copy-Item -Recurse -Force `
  'D:\path\to\dsh-plugin-guide' `
  "$env:USERPROFILE\.deepseek\skills\dsh-plugin-guide"   # या <project>\.agents\skills\
```

फिर अपने एजेंट से कहें: *"dsh-plugin-guide स्किल का उपयोग करके मुझे एक … प्लगइन बनाओ।"*

### या बस पढ़ें

- **जल्दी में हैं?** → [`guide/quick-reference.md`](guide/quick-reference.md)
- **पूरा रास्ता?** → [`guide/plugin-dev-guide.md`](guide/plugin-dev-guide.md)
- **सटीक API?** → `references/official-docs/docs/subsystems/` और `docs/cordis-api/`

## मुख्य आकर्षण

- **प्लगइन अनुबंध और सख़्त नियम** — इफ़ेक्ट/डिस्पोज़र, waterfall में `next()`, मॉडल-दृश्य ⇔ लॉग, Schemastery कॉन्फ़िग।
- **तंत्र की समयरेखा** — repository-plugin 0809 को आया, 0811 को हटाया गया; दो इंस्टॉल मार्ग (bundle बनाम सादा cordis प्लगइन)।
- **20+ वास्तविक समस्याएँ** कारण और समाधान सहित: cordis की दोहरी प्रतियाँ, tsconfig तिकड़ी, त्रुटि पर भी `tsc` का आउटपुट, Windows junctions, मल्टी-फ़्रेम zstd सत्र, `DSH_*` पर्यावरण चर, npm का पुराना `latest`…
- **15 सामुदायिक रिपो का गहन विश्लेषण** — टेम्पलेट, स्कैफ़ोल्ड, समस्या-संग्रह, plugin-check नियम, Fabric परत, MCP ब्रिज।
- **संपूर्ण स्रोत सूची** — हर तथ्य अपने मूल (आधिकारिक दस्तावेज़, अपस्ट्रीम रिपो, सामुदायिक रिपो) से जुड़ा है।

## कच्चे डाउनलोड फिर से बनाएँ

`downloads/` जानबूझकर गिट में नहीं है। जब चाहें फिर से बनाएँ:

```sh
pwsh -File scripts/download-sources.ps1           # आधिकारिक साइट/दस्तावेज़, Cordis, पेपर
pwsh -File scripts/download-community-repos.ps1   # 15 सामुदायिक रिपॉज़िटरी
```

## अखंडता जाँच

```sh
pwsh -File scripts/verify-kit.ps1   # महत्वपूर्ण पथ + टूटी कड़ियों की जाँच
```

## सहभागी हों

- ⭐ **स्टार दें** — इससे अन्य DSH प्लगइन लेखकों को यह मिल पाएगा।
- कोई त्रुटि, नई समस्या या विश्लेषण योग्य रिपो मिला? [issue](https://github.com/PerryLink/dsh-plugin-guide/issues) खोलें या pull request भेजें — देखें [CONTRIBUTING.md](CONTRIBUTING.md)।
- समुदाय से जुड़ें: [DeepSeek Harness Discord](https://discord.gg/Ycq5dCaS4) · [आधिकारिक चर्चाएँ](https://github.com/deepseek-ai/deepseek-harness/discussions) · [`dsh-plugin` टॉपिक](https://github.com/topics/dsh-plugin)।

## लाइसेंस और श्रेय

- हमारा अपना पाठ (`SKILL.md`, `guide/`, `references/` की रिपोर्टें, `scripts/`, यह README): **MIT** — देखें [LICENSE](LICENSE)।
- शामिल तृतीय-पक्ष सामग्री [NOTICE.md](NOTICE.md) में दर्ज है, वितरण सीमाओं सहित
  (जैसे `downloads/` केवल स्थानीय उपयोग हेतु; `awesome-dsh-plugins` का पुनर्वितरण न करें)।

## अस्वीकरण

समुदाय-संचालित; **यह DeepSeek का आधिकारिक उत्पाद नहीं है।** DeepSeek Harness डेवलपर प्रीव्यू में है और
असंगत बदलाव लाता है; संदेह हो तो `references/official-docs/` में मौजूद आधिकारिक दस्तावेज़ ही अंतिम सत्य हैं।
