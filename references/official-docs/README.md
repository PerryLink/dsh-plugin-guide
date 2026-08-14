# official-docs（官方文档逐字副本）

> 本目录是 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 官方文档的**逐字副本**：不要在这里编辑，上游有问题反馈给上游仓库。
> 本 README 是 dsh-plugin-guide 自有的说明文件，不是上游内容。

| 内容 | 位置 | 来源（仓库内路径） |
|---|---|---|
| 官方 `docs/` 全文（215 篇 md，含全部 `.zh.md` 双语对） | [`docs/`](docs/) | `docs/` |
| 仓库根开发红线 | [`AGENTS.md`](AGENTS.md) | `AGENTS.md` |
| packages 组红线 | [`packages/AGENTS.md`](packages/AGENTS.md) | `packages/AGENTS.md` |
| examples 红线 | [`examples/AGENTS.md`](examples/AGENTS.md) | `examples/AGENTS.md` |
| 包分组总览 | [`packages/README.md`](packages/README.md) | `packages/README.md` |
| Cordis vendoring 清单与同步流程 | [`vendor/README.md`](vendor/README.md) | `vendor/README.md` |
| 文档站投影清单 | [`website-docs.ts`](website-docs.ts) | `website/docs.ts` |
| 副本快照（源 ref/提交/时间，README 新鲜度印章的权威） | [`SNAPSHOT.md`](SNAPSHOT.md) | 由 `scripts/sync-official-docs.ps1` 生成 |

## 同步与校验

```sh
# 同步（源固定为 checkout 的 origin/master，未跟踪/未推送内容不会进来）
pwsh -File scripts/sync-official-docs.ps1 [-Checkout <deepseek-harness-checkout>]

# 漂移校验（KB 与 checkout 的 git 已跟踪文件逐一哈希对比）
pwsh -File scripts/verify-kit.ps1 -Checkout <deepseek-harness-checkout>
```

同步范围只包含 git 已跟踪文件；checkout 里的本地草稿（未跟踪）与未推送提交的改动不会进入本目录。同步后 README 里的"最后核验"日期与提交号请引用 `SNAPSHOT.md`。
