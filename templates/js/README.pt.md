# {{pkgName}}

Um plugin do DeepSeek Harness (DSH) gerado com [`dsh-plugin-dev new`](https://github.com/PerryLink/dsh-plugin-guide).

## Compatibility

| Superfície | Estado |
|---|---|
| Harness | DeepSeek Harness `0.1.2-rc.1` |
| Node | `^22.19.0 || >=24.0.0` |
| Plataformas | Todas (ESM puro; sem código nativo, sem rede) |

## What it does

Registra a ferramenta `{{name}}_echo`. Ao chamá-la, responde `<greeting>: <text>`, em que `<greeting>` vem da configuração do plugin e `<text>` é o argumento.

## Install

```sh
pnpm pack
dsh plugin --profile <name> add ./{{pkgName}}-{{version}}.tgz
dsh --profile <name> --dump-config | grep '{{pkgName}}'
```

## Configuration

| Chave | Tipo | Padrão | Descrição |
|---|---|---|---|
| `greeting` | string | `Hello` | Prefixo da resposta echo |

A configuração é validada pelo schema Schemastery `Config` em `index.js`; nenhum ajuste fica fixo no código.

## Development

```sh
pnpm install
pnpm test
```

## License

[Apache License 2.0](LICENSE) © {{year}} {{pkgName}} contributors.
