# official-docs（官方文档逐字副本）

> 本目录是 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 官方文档的**逐字副本**：不要在这里编辑，上游有问题反馈给上游仓库。
> 本 README 是 dsh-plugin-guide 自有的说明文件，不是上游内容。

| 内容 | 位置 | 来源（仓库内路径） |
|---|---|---|
| 官方 `docs/` 全文（215 篇 md，含全部 `.zh.md` 双语对） | [`docs/`](docs/) | `docs/` |
| 仓库根开发红线 | [`AGENTS.md`](AGENTS.md) | `AGENTS.md` |
| CLAUDE 入口（上游为 symlink，此处为其目标文本） | [`CLAUDE.md`](CLAUDE.md) | `CLAUDE.md` → `AGENTS.md` |
| 基准测试说明 | [`BENCHMARK.md`](BENCHMARK.md) | `BENCHMARK.md` |
| 贡献指引（中英 + i18n 元数据） | [`CONTRIBUTING.md`](CONTRIBUTING.md) · [`CONTRIBUTING.zh.md`](CONTRIBUTING.zh.md) · [`CONTRIBUTING.i18n.yaml`](CONTRIBUTING.i18n.yaml) | `CONTRIBUTING.*` |
| 上游中文 README 与 i18n 元数据 | [`README.zh.md`](README.zh.md) · [`README.i18n.yaml`](README.i18n.yaml) | `README.zh.md` · `README.i18n.yaml` |
| 三方声明 | [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) | `THIRD_PARTY_NOTICES.md` |
| 许可证 | [`LICENSE`](LICENSE) | `LICENSE` |
| packages 组红线 | [`packages/AGENTS.md`](packages/AGENTS.md) | `packages/AGENTS.md` |
| examples 红线 | （alpha.3 上游已移除 `examples/AGENTS.md`，本快照不再收录） | 原 `examples/AGENTS.md` |
| 包分组总览 | [`packages/README.md`](packages/README.md) | `packages/README.md` |
| Cordis vendoring 清单与同步流程 | [`vendor/README.md`](vendor/README.md) | `vendor/README.md` |
| 文档站投影清单 | [`website-docs.ts`](website-docs.ts) | `website/docs.ts` |
| 副本快照（源 ref/提交/时间，README 新鲜度印章的权威） | [`SNAPSHOT.md`](SNAPSHOT.md) | 由 `scripts/sync-official-docs.ps1` 生成 |

> 上游英文 `README.md` 不进入本目录（与本 KB 索引同名冲突）；其线上快照在 `downloads/github/harness/README.md`。

## 同步与校验

```sh
# 同步（源固定为 checkout 的 origin/master，未跟踪/未推送内容不会进来）
pwsh -File scripts/sync-official-docs.ps1 [-Checkout <deepseek-harness-checkout>]

# 漂移校验（KB 与 checkout 的 git 已跟踪文件逐一哈希对比）
pwsh -File scripts/verify-kit.ps1 -Checkout <checkout>
```

同步范围只包含 git 已跟踪文件；checkout 里的本地草稿（未跟踪）与未推送提交的改动不会进入本目录。同步后 README 里的"最后核验"日期与提交号请引用 `SNAPSHOT.md`。
