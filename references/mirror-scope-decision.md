# R1 决策记录：镜像裁剪（2026-10-13）

## 结论：**不裁剪**，改为「结构化按需取用」

审计（`v2-2`、`v2-7`）建议剔除零引用内容以回收约 80% 体积。**精确复测后这个建议不成立**，
因为"零引用"是按**窄口径**统计的，而本库自己声明的路由是**宽 glob**。

## 复测数据（`_analysis/_mirror-trim-plan.mjs`，可复跑）

扫描 33 份自有文档，把镜像 708 个文件按"被引用强度"分档：

| 引用强度 | 文件数 | 体积 |
|---|---:|---:|
| 按确切路径被点名 | 73 | 2.22 MB |
| 仅被目录 glob 覆盖 | 623 | 20.17 MB |
| **完全无引用** | **3** | **≈4 KB** |

仅被 glob 覆盖的部分按扩展名拆开：

| 扩展名 | 文件数 | 体积 |
|---|---:|---:|
| `.json`（历史 session-format schema） | 45 | **13.97 MB** |
| `.md` | 362 | 5.26 MB |
| `.yaml`（`.i18n.yaml` 翻译哈希） | 212 | 0.54 MB |
| `.png` | 4 | 0.39 MB |

## 为什么不能按"零引用"删

本库**自己声明**的路由就是宽 glob，这些 glob 出现在 `SKILL.md` 与多份指南里：

- `references/official-docs/docs/**`（`quick-reference*.md` ×5、`official-plugin-dev-skill.md`）
- `docs/persistence-changes/**`（`SKILL.md`、`links.md`、`migration-0.2.md`、`version-matrix.md`）
- `docs/upgrade-guide/**`（`SKILL.md`、`migration-0.2.md`、`version-matrix.md`）

其中 `docs/persistence-changes/**` **正好就是那 14 MB 的来源**。
所以"14 MB 零引用"的真实含义是：**它们被一个我们自己写下的 `**` 覆盖着**。
按"没被逐字点名"删掉它们，等于**静默收窄本库对读者的承诺**——读者会以为
`docs/persistence-changes/**` 是完整的，而它已经不完整了。

这正是本轮审计反复抓到的同一类错误：**本地状态与声明不一致，且没有门禁**。
用一次裁剪去制造一个新的同类不一致，是拿一个 bug 换一个 bug。

## 附带否掉的子项

- **`.i18n.yaml`（212 个）**：`v2-7` 用正则确认过"0 引用"，但那是**窄口径**。
  它们同时是上游 `verify-translation-pairing` 门的哈希记录，删掉会让镜像不再是逐字副本。
- **`.png`（4 个）**：是 `docs/user/guide/providers-*.png`，被同一 glob 覆盖，且仅 0.39 MB。
- **3 个真正零引用的文件**（`CONTRIBUTING.i18n.yaml`、`CONTRIBUTING.zh.md`、`README.i18n.yaml`）
  也**保留**：它们是上游仓库根级文档，属于镜像"逐字完整"的一部分，合计约 4 KB，
  删掉省不下任何东西，却要让 `sync-official-docs.ps1` 增加一个例外清单。

## 真正的替代方案（如果体积确实成为问题）

保持"逐字完整"，改变**取用方式**，而不是改变内容：

1. **让 npm 包瘦、让镜像独立发布**——把 `references/official-docs/` 从 npm `files[]` 移出，
   改为随 GitHub Release 提供 `mirror-<commit>.tar.zst` 资产；`SKILL.md` 的路径路由不变，
   离线能力改为"下载一次镜像包"，首次使用时由脚本落盘。
   代价：失去"装完即离线可用"。
2. **按需取用**：`SKILL.md` 已建议优先用会话内 inspection 而非静态清单；
   可再加一条"镜像页按需从上游 fetch，附 commit 钉号"，把 20 MB 变成 0。
   代价：需要网络。

两条都需要**同时改 `SKILL.md` 的承诺**，属于产品决策而非清理动作。

## 生效的口径

**镜像保持逐字完整**。本文件的作用是把 R1 从"待清理"改判为
"**已评估、结论是不做，理由是被 glob 覆盖而非零引用**"，避免下一个会话重复提出同一建议。

> 复跑方式：`node _analysis/_mirror-trim-plan.mjs`
> （`_analysis/` 在 `.gitignore` 中；如需长期保留本结论，见 `guide/family-toolchain.md` 的说明）
