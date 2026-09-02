# {{pkgName}}

由 [`dsh-plugin-dev new`](https://github.com/PerryLink/dsh-plugin-guide) 脚手架生成的 DeepSeek Harness（DSH）插件。

## Compatibility

| 项目 | 状态 |
|---|---|
| Harness | DeepSeek Harness `0.1.2-alpha.5` |
| Node | `^22.19.0 || >=24.0.0` |
| 平台 | 全部（纯 ESM；无原生代码、无网络） |

## What it does

注册 `{{name}}_echo` 工具。调用它时返回 `<greeting>: <text>`，其中 `<greeting>` 来自插件配置，`<text>` 是入参。

## Install

```sh
pnpm pack
dsh plugin --profile <name> add ./{{pkgName}}-{{version}}.tgz
dsh --profile <name> --dump-config | grep '{{pkgName}}'
```

## Configuration

| 键 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `greeting` | string | `Hello` | echo 回复的前缀 |

配置由 `index.js` 中的 Schemastery `Config` 模式校验；没有任何硬编码可调参数。

## Development

```sh
pnpm install
pnpm test
```

## License

[Apache License 2.0](LICENSE) © {{year}} {{pkgName}} contributors.
