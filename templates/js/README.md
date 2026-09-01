# {{pkgName}}

A DeepSeek Harness (DSH) plugin scaffolded by [`dsh-plugin-dev new`](https://github.com/PerryLink/dsh-plugin-guide).

## Compatibility

| Surface | Status |
|---|---|
| Harness | DeepSeek Harness `0.1.2-alpha.3` |
| Node | `^22.19.0 || >=24.0.0` |
| Platforms | All (plain ESM; no native code, no network) |

## What it does

Registers the `{{name}}_echo` tool. Calling it replies with `<greeting>: <text>`, where `<greeting>` comes from the plugin config and `<text>` is the argument.

## Install

```sh
pnpm pack
dsh plugin --profile <name> add ./{{pkgName}}-{{version}}.tgz
dsh --profile <name> --dump-config | grep '{{pkgName}}'
```

## Configuration

| Key | Type | Default | Description |
|---|---|---|---|
| `greeting` | string | `Hello` | Prefix for the echo reply |

Configuration is validated by the Schemastery `Config` schema in `index.js`; no tunable is hardcoded.

## Development

```sh
pnpm install
pnpm test
```

## License

[Apache License 2.0](LICENSE) © {{year}} {{pkgName}} contributors.
