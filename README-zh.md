<div align="center">

# dsh-plugin-guide

**DSH 插件质量指南：ENTRY、FLOW、BOOST。**

社区指南，不是官方标准、不是认证、不是排名。

[![npm](https://img.shields.io/npm/v/dsh-plugin-guide)](https://www.npmjs.com/package/dsh-plugin-guide)
[![CI](https://github.com/PerryLink/dsh-plugin-guide/actions/workflows/verify.yml/badge.svg)](https://github.com/PerryLink/dsh-plugin-guide/actions/workflows/verify.yml)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

[English](README.md) · [简体中文](README-zh.md)

</div>

---

## 这是什么

`dsh-plugin-guide` 是 DSH 插件的**指南层**：解释要检查什么、为什么重要，以及
判定应该由哪个工具负责。它不做认证、不打分、不排名。

| 包 | 角色 |
|---|---|
| **`dsh-plugin-guide`** | 本包：文字指南、三层地图、agent skill |
| **`dsh-standards`** | 执行总包：ENTRY/FLOW 检查、三层审计、规范文件 |
| **`dsh-plugin-spec`** | 底层规则文本与条款来源 |
| **`dsh-primer`** | 旧的构建/脚手架技能和 CLI（原 `dsh-plugin-guide` 0.3.x） |

## 三层

| 层 | 回答 | 能否判定 |
|---|---|---|
| **ENTRY** | 能不能被识别、安装、启动 | 能：recognized / runtime / failed / incomplete / unavailable |
| **FLOW** | 用户能不能装、配、用、升级、卸载 | 有 runtime 证据时能；否则 `not-run` |
| **BOOST** | 有没有用好 Cordis | 不给插件级判定；按实践登记证据 |

三条轨道，不是三个等级；它们相加不等于分数或证书。

先读一页地图：[docs/levels.md](docs/levels.md)。

## 安装

```sh
dsh plugin --profile web add dsh-plugin-guide
```

然后在审查插件时让 agent 使用 `dsh-plugin-guide` 技能。它会将检查交给
`dsh-standards`，将构建/脚手架工作指向 `dsh-primer`。

## 检查插件

```sh
# 只做 ENTRY 识别（不声明 runtime）
npx dsh-standards ./my-plugin --scope entry --entry-claim static

# 三层审计；没跑的层保持 not-run / not-measured
npx -p dsh-standards dsh-levels ./my-plugin --format json
```

`recognized` 不是通过，`static` 不是通过，`not-run` 也不是通过。

## 0.4.0 改了什么

- 旧的 agent skill 和 `dsh-plugin-dev` CLI 已迁到
  [`dsh-primer`](https://github.com/PerryLink/dsh-primer)。
- 本包现在是**指南层**：三层地图、检查路由、证据规则。
- 旧 0.3.x npm 版本已标记 deprecated，已有安装仍可用；0.4.0 是产品切换，
  锁在 `^0.3` 的用户不会自动升级。
- 检查在 [`dsh-standards`](https://github.com/PerryLink/dsh-standards)，不在本包。

## 边界

- 不做官方背书、认证、认可或安全审计。
- 不做评分、排名或市场门禁。
- 不伪造 runtime 证据：`static` ≠ `runtime`，`not-run` ≠ `pass`。
- BOOST 是建议和证据，不是插件等级。

## 许可

Apache-2.0。见 [LICENSE](LICENSE) 与 [NOTICE.md](NOTICE.md)。
