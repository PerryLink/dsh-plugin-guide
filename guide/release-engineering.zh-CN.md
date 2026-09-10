# DSH 插件组合的发布工程

> English: [release-engineering.md](release-engineering.md)

官方文档教的是**一个**插件怎么写。它没有讲**几十个**插件怎么在一个"设计上就会破坏兼容"的宿主上持续可安装、可发布、可升级。本章补的就是这一段，素材来自一个真实在跑的插件组合：38 个 bundle 插件、39 个 npm 包、500+ 已发布版本。

---

## 0. 你实际在维护的是四份契约

插件不是"一个 TypeScript 包"，而是四份契约；组合出问题，一定是其中一份先漂移了：

| 契约 | 位置 | 断裂方式 |
|---|---|---|
| Bundle 清单 | `package.json` -> `dsh.bundle.patch` | patch 文件改名，或该键被删掉 |
| 安装面 | npm 包名 + `dist-tags` | 发布落到错误的 tag，或根本没发出去 |
| 兼容窗口 | `@deepseek-ai/*` 的 `peerDependencies` | 宿主换了 alpha/rc 线，范围不再接受它 |
| 可发现性 | GitHub topic `dsh-plugin` + 包 `keywords` | 仓库改名，或 fork 出来时没带 topic |

下面全部围绕"如何低成本地让这四份契约在组合规模上保持一致"。

---

## 1. 能扩展的布局与命名

从 5 个插件走到 50 个，只差两个习惯：

1. **一个插件一个仓库**，各自独立发布。monorepo 会让一个失败的门禁卡住所有插件的发布。
2. **可预测的命名**：包名 `dsh-<能力>`，仓库同名。scoped 名（`@you/dsh-x`）也可以，但仓库名要保持稳定——发现机制靠 GitHub topic，改名会让你无声地掉出搜索结果。

每个仓库保留一份 `AGENTS.md` 写清该仓自己的规则。组合变大后，仓库内文件是该仓的权威，跨仓约定则集中在一份共享文档里（就是本文）。

---

## 2. 版本线矩阵

开发者预览期，宿主会同时存在多条线，例如 `0.1.2-rc.1`、`0.1.5-alpha.1`、`0.1.5-rc.1`。只钉一条线的组合，在用户从另一条线安装的那一刻就坏。

同时接受两个窗口的写法：

```jsonc
{
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.2",
    "@deepseek-ai/dsh-tools": ">=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0"
  },
  "devDependencies": {
    "@deepseek-ai/dsh-tools": "0.1.5-rc.1"
  }
}
```

由此得到的规则：

- **`devDependencies` 钉最新已发布的线。** 类型检查要赶在你的用户之前报错。
- **`dependencies` 钉 stable/rc 线，`peerDependencies` 接受两个窗口。** 永远不要为了让自己的 CI 变绿而收窄 peer 范围——那等于把另一条线上的用户静默卸载掉。
- **绝不用手改 30 个仓库的钉号。** 脚本化的一波（patch bump、更新钉号、过门禁、发布）是唯一可持续的路径；把它当成一个原子批次执行，并为每个仓留回滚注记。

---

## 3. 发布流水线

每个仓的发布 = 推一个 tag，触发 workflow：

```yaml
on:
  push:
    tags: ['v*']
jobs:
  publish:
    steps:
      - run: pnpm install --frozen-lockfile
      - run: pnpm run build
      - run: npm publish --provenance --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

五个用时间换来的经验：

1. **`--frozen-lockfile` 是一道门禁，而且它是对的。** 发布提交漏了 `pnpm-lock.yaml`，就会死在这里。绝不要在锁文件不干净的状态下发布。
2. **用 `--provenance` 发布。** 一个参数换来签名的供应链凭证，这是你能给审查者的最便宜的信任信号。
3. **secret 是按仓存的。** 每个会发布的仓都必须有 `NPM_TOKEN`。令牌轮换时要全量重播种，否则故障会晚很多、一个一个仓地冒出来。
4. **已推送的 tag 不能重发。** 产物错了就：修提交、强制移动 tag、重跑，并接受第一次尝试已成为公开历史。
5. **要知道 registry 的复制延迟。** 发布后立刻跑的校验任务，可能仍解析到上一个版本（"The latest release is X"）。等 `latest` 稳定后重跑，而不是去"修"一个本来没坏的包。

---

## 4. 一个版本，三个面

发布一次，镜像到位，并让镜像幂等：

| 面 | 机制 | 要盯的失败模式 |
|---|---|---|
| npm | tag 触发 workflow | dist-tag 落错线 |
| GitHub Release | 同一个 tag 触发的 workflow（幂等） | release notes 与 CHANGELOG 漂移 |
| Gitee（镜像） | 定时同步 workflow | 强制移动 tag 后镜像 HEAD 落后于上游 |

三面都验过，才算发布完成。只上了 npm 而镜像没有，是半个发布——镜像上的用户会来报一个你早已修好的 bug。

GitHub Release 由**发布 npm 的同一个 tag workflow** 创建，**绝不手工建**。手工建正是 release notes 与 `CHANGELOG.md` 漂移的来源，而且这个缺口在 registry 侧看不见：一个上了 npm 却没有 Release 页的版本，对 `npm view` 看起来是完整的，对任何读仓库的人却是不完整的。这一步必须幂等，这样重跑、补 tag、或 Release 页已存在都不会让 job 失败：

```sh
if gh release view "$TAG" >/dev/null 2>&1; then
  echo "release $TAG already exists; skipping"
  exit 0
fi
node scripts/changelog-section.mjs "$VERSION" > release-notes.md || true
if [ -s release-notes.md ]; then
  gh release create "$TAG" --title "$TAG" --notes-file release-notes.md
else
  gh release create "$TAG" --generate-notes
fi
```

三个细节是关键。该 job 需要 `permissions: contents: write`（publish job 的 `contents: read` 不够，且 job 级权限会覆盖 workflow 级）。它应当是**一个 `needs:` 发布 job 的独立 job**，这样一个 `CHANGELOG.md` 缺少该小节的 tag 就不会把已经成功的 npm 发布变成红灯。而 `|| true` 加 `-s` 判断，正是让「缺小节」这一情形退化为生成式 notes 而不是失败的原因——有生成式 notes 的 Release 页，胜过没有 Release 页。

---

## 5. README 一致性属于构建的一部分

如果组合提供多语言 README，就把它们当构建产物：

- 语言集合是固定的、且被检查。只给一种语言加章节而其他语言不加，必须让 CI 失败。
- tag 之前先跑编码门禁：UTF-8 无 BOM、无乱码、无替换字符。已发布的 README 修不回来——npm 元数据不可变，registry 甚至可能不展示你修正后的文件。
- 写锚点正则时注意：CJK 字符之后的词边界行为与英文不同。

---

## 6. 宿主破坏兼容时的迁移波

宿主明确写了会破坏兼容。所以要按"波"来做计划，而不是指望稳定：

1. **探测。** 在用户撞上之前，先对最新已发布的线跑类型检查矩阵。某个事件类型被移除、或签名变了，会在某一个仓里先炸成编译错误——这个错误就告诉你全部仓的影响面。
2. **分诊。** 把"钉号更新""机械改写""语义重设计"分开。只有前两类属于一波；第三类单独发布、单独写 changelog。
3. **原子执行。** 一批 patch bump、一次门禁、一波发布，并为每个仓留回滚注记（上一个 tag + 要还原的确切钉号）。
4. **记录事故。** 两个值得写下来的例子，都是自伤，都各吃掉一个发布周期：
   - 发布提交漏了锁文件导致 CI 红；修法是补提交 + 强制移动 tag。
   - 用另一个包管理器生成的锁文件里含 workspace link 条目，干净环境无法复现；修法是删掉锁文件、隔离重装、重新生成。

**经验值**：一波超过约四个仓，CI 队列就会饱和、各 run 结算乱序。按此分批。

---

## 7. 打 tag 前的门禁清单

每次推 tag 之前：

- [ ] `pnpm install --frozen-lockfile` 干净
- [ ] 对**最新已发布的线**做类型检查，而不是你开发时用的那条
- [ ] 单元测试全绿
- [ ] 包不变量：`files` 白名单确实包含构建产物，且该产物存在
- [ ] 多语 README 一致 + 编码审计（无 BOM、无乱码、无替换字符）
- [ ] `CHANGELOG.md` 有即将打的这个版本的小节
- [ ] tag workflow 自己创建 GitHub Release，且幂等，正文取自该版本小节（见第 4 节）
- [ ] 版本号与意图一致（patch = 波，minor = 功能，major = 破坏性）
- [ ] 远端还没有这个 tag

推 tag 之后：

- [ ] npm `dist-tags.latest` 等于新版本
- [ ] GitHub Release 已建且带 notes
- [ ] 镜像已同步
- [ ] 所有 vendor 钉住该包的消费仓已在同一批里升级

---

## 8. 那些看起来像你的 bug、其实不是的 registry 行为

写下来一次，省得有人调两遍：

- **`versions[].readme` 可能为空**——即使 tarball 里的 README 与你的仓库逐字节一致，包页也会展示旧 README。这是 registry 侧的呈现行为，CLI 与 CI 两条通道都能复现，不要靠"重发一次"去修。
- **`description` 在包元数据里约 255 字符处被截断。** 校验发布时按截断形式比对，而不是全文。
- **scoped 包**在某些下载量端点上会返回占位值。用 range 端点，别用 point 端点。
- **发布成功不等于可见。** 见第 3 节第 5 条。

---

## 9. 会伪造结论的本地工具

下面每一条都返回一个自信的错误答案，而不是报错；每一条都真实吃掉过一个排查周期。写下来，好让下一个人认得出这个形状：

- **`npm view <pkg>@<ver> A B --json` 会凭空造出「缺失」。** 一次问两个字段时，它可能把一个实际存在的字段报成空值，读起来就像「已发布的包丢了 `peerDependencies`」。每次只查一个字段；当真要下结论时，解开已发布的 tarball 读它的 `package.json`——那才是地面真相。曾有一次审计据此标出八个仓，八个全错。
- **遵守 `.gitignore` 的内容检索会返回假阴性。** 当工作区根目录忽略一切（`*` 加一条例外）时，在它上面做检索会一无所获，而「一无所获」会被读成「不存在」的证据。在断言某个模式不存在之前，先用一个不查忽略规则的扫描确认一遍。
- **Windows PowerShell 5.1 的 `Set-Content -Encoding utf8` 会写 BOM。** 以 `EF BB BF` 开头的 JSON 请求体会解析失败，而报错指向的是载荷内容而不是编码。机器要读的文件一律走显式编码器：`[System.IO.File]::WriteAllText($path, $text, (New-Object System.Text.UTF8Encoding($false)))`。
- **在 Windows 上，`rd /s /q` 删不掉含保留设备名的目录树**（`NUL`、`CON`、`AUX`、`PRN`、`COM1`-`COM9`、`LPT1`-`LPT9`）。它会报成功，却把整条祖先链原样留下。用 `\\?\` 前缀的长路径删除该条目，然后断言目录确实消失——退出码为 0 不能作为「树已消失」的证据。

---

## 10. 这样做换来什么

按这套方式维护的组合，表现得像一个产品：任何宿主线上的用户都能装到任何插件，每个版本都有凭证，镜像一致，上游的破坏性变更只花掉一波而不是一次事故。这同时也是最强的生态贡献形式——官方要的正是这个，并且明确否认"官方仓的包比社区的包更重要"。

欢迎指出错误或补充；常用入口见 [links.md](links.md)。
