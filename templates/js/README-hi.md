# {{pkgName}}

[`dsh-plugin-dev new`](https://github.com/PerryLink/dsh-plugin-guide) से बनाया गया एक DeepSeek Harness (DSH) प्लगइन।

## Compatibility

| सतह | स्थिति |
|---|---|
| Harness | DeepSeek Harness `{{dshBaseline}}` (npm `alpha`); `latest`/`next` = `0.2.0-rc.2` |
| Node | `^22.19.0 || >=24.0.0` |
| प्लेटफ़ॉर्म | सभी (शुद्ध ESM; कोई नेटिव कोड नहीं, कोई नेटवर्क नहीं) |

## What it does

`{{name}}_echo` टूल पंजीकृत करता है। इसे बुलाने पर `<greeting>: <text>` लौटाता है, जहाँ `<greeting>` प्लगइन कॉन्फ़िग से आता है और `<text>` आर्गुमेंट है।

## Install

```sh
pnpm pack
dsh plugin --profile <name> add ./{{pkgName}}-{{version}}.tgz
dsh --profile <name> --dump-config | grep '{{pkgName}}'
```

## Configuration

| कुंजी | प्रकार | डिफ़ॉल्ट | विवरण |
|---|---|---|---|
| `greeting` | string | `Hello` | echo उत्तर का उपसर्ग |

कॉन्फ़िगरेशन `index.js` में Schemastery `Config` स्कीमा से मान्य होता है; कोई भी सेटिंग हार्डकोडेड नहीं है।

## Development

```sh
pnpm install
pnpm test
```

## Standards

`package.json` में `dsh.standards` एक प्लेसहोल्डर है, कोई दावा नहीं: सभी स्तर `not-run` से शुरू होते हैं (BOOST `not-measured` से)। दर्ज प्रमाण के साथ `level-audit` चलाएँ और केवल उन्हीं स्तरों को बदलें; प्रमाण न हो तो `not-run` ही रखें — बिना परीक्षण किया गया स्तर पास नहीं होता।

## License

[Apache License 2.0](LICENSE) © {{year}} {{pkgName}} contributors.
