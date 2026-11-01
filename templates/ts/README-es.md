# {{pkgName}}

Un plugin de DeepSeek Harness (DSH) generado con [`dsh-plugin-dev new`](https://github.com/PerryLink/dsh-plugin-guide).

## Compatibility

| Superficie | Estado |
|---|---|
| Harness | DeepSeek Harness `{{dshBaseline}}` (npm `alpha`); `latest`/`next` = `0.2.0-rc.2` |
| Node | `^22.19.0 || >=24.0.0` |
| Plataformas | Todas (ESM puro; sin código nativo, sin red) |

## What it does

Registra la herramienta `{{name}}_echo`. Al llamarla responde `<greeting>: <text>`, donde `<greeting>` proviene de la configuración del plugin y `<text>` es el argumento.

## Install

```sh
pnpm pack
dsh plugin --profile <name> add ./{{pkgName}}-{{version}}.tgz
dsh --profile <name> --dump-config | grep '{{pkgName}}'
```

## Configuration

| Clave | Tipo | Valor por defecto | Descripción |
|---|---|---|---|
| `greeting` | string | `Hello` | Prefijo de la respuesta echo |

La configuración se valida con el esquema Schemastery `Config` de `src/config.ts`; ningún ajuste está codificado de forma fija.

## Development

```sh
pnpm install
pnpm run typecheck
pnpm test
pnpm run build
```

## Standards

El bloque `dsh.standards` de `package.json` es un marcador de posición, no una afirmación: todos los niveles empiezan en `not-run` (BOOST en `not-measured`). Ejecuta `level-audit` con la evidencia registrada y sustituye solo esos niveles; sin evidencia, déjalo en `not-run`: un nivel sin probar no es un aprobado.

## License

[Apache License 2.0](LICENSE) © {{year}} {{pkgName}} contributors.
