# dsh-plugin-guide 完整性检查器
# 用法: pwsh -File scripts/verify-kit.ps1 -Root <路径>
# 校验范围: 本知识库自有文档(SKILL/README/NOTICE/guide/references 顶层);
# 官方文档副本(references/official-docs)是逐字副本,其内部链接指向 deepseek-harness checkout,不在校验范围。
param([string]$Root = '', [string]$Checkout = '', [switch]$Strict)
if ([string]::IsNullOrEmpty($Root)) { $Root = if ($PSScriptRoot) { Split-Path $PSScriptRoot -Parent } else { (Get-Location).Path } }
$ErrorActionPreference = 'SilentlyContinue'
$issues = New-Object System.Collections.Generic.List[string]
$info = New-Object System.Collections.Generic.List[string]

# ---- 1) 关键路径 ----
$critical = @(
  'SKILL.md','README.md','README.zh.md','README.es.md','README.pt.md','README.hi.md','LICENSE','NOTICE.md','.gitignore',
  'CONTRIBUTING.md','SECURITY.md','.github/ISSUE_TEMPLATE/bug_report.yml','.github/ISSUE_TEMPLATE/feature_request.yml','.github/PULL_REQUEST_TEMPLATE.md',
  'guide/plugin-dev-guide.md','guide/quick-reference.md','guide/links.md','guide/quick-reference.zh-CN.md','guide/quick-reference.es.md','guide/quick-reference.pt.md','guide/quick-reference.hi.md',
  'references/sources.md','references/harness-repo.md','references/website-pages.md',
  'references/upstream-cordis.md','references/cordis-paper-and-community.md',
  'references/community-ecosystem.md','references/community-repo-deep-dive.md',
  'references/official-docs/docs/cordis-primer.md',
  'references/official-docs/docs/cordis-tutorial/index.md',
  'references/official-docs/docs/cordis-tutorial/01-first-plugin.md',
  'references/official-docs/docs/cordis-tutorial/02-lifecycle-and-effects.md',
  'references/official-docs/docs/cordis-tutorial/03-services.md',
  'references/official-docs/docs/cordis-tutorial/04-events.md',
  'references/official-docs/docs/cordis-tutorial/05-config.md',
  'references/official-docs/docs/cordis-tutorial/06-composition-and-hmr.md',
  'references/official-docs/docs/cordis-tutorial/07-into-the-harness.md',
  'references/official-docs/docs/architecture.md',
  'references/official-docs/docs/cookbook/extension-cookbook.md',
  'references/official-docs/docs/cookbook/adding-a-tool.md',
  'references/official-docs/docs/event-producer-consumer.md',
  'references/official-docs/docs/user/develop/basic/index.md',
  'references/official-docs/docs/user/develop/basic/tool.md',
  'references/official-docs/docs/user/develop/basic/config.md',
  'references/official-docs/docs/user/develop/basic/publish.md',
  'references/official-docs/docs/user/develop/framework/service.md',
  'references/official-docs/docs/user/develop/framework/events.md',
  'references/official-docs/docs/user/develop/practice/index.md',
  'references/official-docs/docs/user/develop/practice/llm-adapter.md',
  'references/official-docs/docs/subsystems/session.md',
  'references/official-docs/docs/subsystems/tools.md',
  'references/official-docs/docs/cordis-api/context.md',
  'references/official-docs/AGENTS.md',
  'references/official-docs/SNAPSHOT.md',
  'references/official-docs/packages/AGENTS.md',
  'references/official-docs/packages/README.md',
  'references/official-docs/vendor/README.md',
  'scripts/download-sources.ps1','scripts/download-community-repos.ps1','scripts/gen-topic-snapshot.ps1','scripts/sync-official-docs.ps1','scripts/install-skill.ps1','scripts/verify-kit.ps1','scripts/archive-discussions.ps1','scripts/download-community-articles.ps1'
)
foreach ($c in $critical) { if (-not (Test-Path (Join-Path $Root $c))) { $issues.Add("CRITICAL-MISSING: $c") } }
$info.Add("critical: $($critical.Count) 项, 缺失 $((($issues | Where-Object { $_ -like 'CRITICAL-*' }) | Measure-Object).Count)")

# ---- 1b) 归档内容断言(防止同名文件错位: 历史事故是 examples/AGENTS.md 被当成仓库根 AGENTS.md) ----
function Assert-FirstLine([string]$rel, [string]$pattern, [string]$expect) {
  $p = Join-Path $Root $rel
  if (-not (Test-Path $p)) { return }
  $first = Get-Content $p -Encoding UTF8 | Where-Object { $_.Trim() -ne '' } | Select-Object -First 1
  if ($first -notlike $pattern) { $issues.Add("CONTENT-ASSERT-FAIL: $rel 首行应为 $expect, 实际: $first") }
}
Assert-FirstLine 'references/official-docs/AGENTS.md'           '# AGENTS.md'                     "仓库根 AGENTS.md 标题"
Assert-FirstLine 'references/official-docs/packages/AGENTS.md' '# AGENTS.md*Harness Packages*'  "packages/AGENTS.md 标题"

# ---- 2) 自有文档相对链接解析 ----
# 只检查 markdown 链接目标(读者会点击的);代码块/行内码里的裸词不参与,
# 避免把 name、ctx、- 等片段误判为路径。链接按"相对所在文件目录"解析;
# downloads/ 引用允许,指向 checkout 的逃逸链接(../../、../packages/ 等)跳过。
$scopeFiles = @((Join-Path $Root 'SKILL.md'), (Join-Path $Root 'README.md'), (Join-Path $Root 'NOTICE.md'))
$scopeFiles += Get-ChildItem (Join-Path $Root 'guide') -Filter *.md -File
$scopeFiles += Get-ChildItem (Join-Path $Root 'references') -Filter *.md -File   # 仅顶层,不含 official-docs 子树
$missing = 0; $downloadsRefs = 0; $repoRelRefs = 0; $absRefs = 0

function Is-PathToken([string]$t) {
  # 纯 ASCII 相对路径:含斜杠(guide/links.md、../references/x.md)或带扩展名(README.md);
  # 裸词、含空格/CJK 的引文片段不参与检查
  return $t -match '^(\.\./)?(\./)?(([A-Za-z0-9][A-Za-z0-9_.\-]*/)+[A-Za-z0-9_.\-]+(\.[A-Za-z0-9]+)?|[A-Za-z0-9][A-Za-z0-9_.\-]+\.[A-Za-z0-9]+)(#[A-Za-z0-9_\-/]+)?$'
}
function Test-FileRel([string]$p, [string]$dir) {
  $p = $p -replace '^\./',''
  $p = $p -replace '[?#].*$',''
  if ($p -match '[*]') { $d = Split-Path (Join-Path $dir $p) -Parent; return Test-Path $d }
  return Test-Path (Join-Path $dir $p)
}

foreach ($f in $scopeFiles) {
  if (-not (Test-Path $f.FullName)) { continue }
  $relFile = $f.FullName.Substring($Root.Length + 1)
  $fileDir = Split-Path $f.FullName -Parent
  $text = Get-Content $f.FullName -Raw -Encoding UTF8
  $tokens = New-Object System.Collections.Generic.HashSet[string]
  foreach ($m in [regex]::Matches($text, '\[[^\]]*\]\(([^)\s]+)\)')) {
    $t = $m.Groups[1].Value.Trim()
    if ($t -match '^https?://' -or $t -match '^[A-Za-z]:[\\/]' -or $t -match '^(<|\$|#)') { continue }
    if ($t -match '^[A-Za-z]:[\\/]') { $absRefs++; continue }
    if (-not (Is-PathToken $t)) { continue }
    [void]$tokens.Add($t)
  }
  foreach ($t in $tokens) {
    if ($t -match '^(\.\./){2,}' -or $t -match '^\.\./packages/|^\.\./\.agents/') { $repoRelRefs++; continue }
    if ($t -match '^(\./)?downloads/') { $downloadsRefs++; continue }
    if (-not (Test-FileRel $t $fileDir)) { $missing++; $issues.Add("LINK-MISSING: [$relFile] -> $t") }
  }
}
$info.Add("link-scan: $($scopeFiles.Count) 个自有文档; 缺失 $missing; downloads 引用 $downloadsRefs(允许); checkout 相对链接 $repoRelRefs(跳过); 绝对路径 $absRefs(信息)")

# ---- 3) 功能文档中的本机绝对路径(设计内的回退/示例,仅信息) ----
foreach ($f in @('SKILL.md','README.md','guide/plugin-dev-guide.md','guide/quick-reference.md','guide/links.md')) {
  $hits = Select-String -Path (Join-Path $Root $f) -Pattern 'D:\\deepseek-harness' -AllMatches
  foreach ($h in $hits) { $info.Add("ABS-PATH(设计内回退/示例): [$f] L$($h.LineNumber)") }
}

# ---- 4) 官方文档副本与 checkout 漂移校验(可选: -Checkout <deepseek-harness 路径>) ----
# 把副本与 ref(origin/master, 回退 HEAD)的 git blob 逐一对比: 与工作树/本地未推送提交无关, 只回答"副本与上游是否一致"。
if ($Checkout -and (Test-Path $Checkout)) {
  $kbDocs = Join-Path $Root 'references\official-docs'
  $driftCount = 0; $kbExtra = 0; $missingKb = 0; $checkedDrift = 0
  $gitOk = (& git -C $Checkout rev-parse --is-inside-work-tree 2>$null) -eq 'true'
  if (-not $gitOk) {
    $info.Add("checkout-drift: $Checkout 不是 git 仓库, 跳过(使用 scripts/sync-official-docs.ps1 的非 git 模式同步)")
  } else {
    $ref = if ((& git -C $Checkout rev-parse --verify -q origin/master 2>$null)) { 'origin/master' } else { 'HEAD' }
    $map = @{
      'docs'                   = 'docs';
      'AGENTS.md'              = 'AGENTS.md';
      'BENCHMARK.md'           = 'BENCHMARK.md';
      'CONTRIBUTING.md'        = 'CONTRIBUTING.md';
      'CONTRIBUTING.zh.md'     = 'CONTRIBUTING.zh.md';
      'CONTRIBUTING.i18n.yaml' = 'CONTRIBUTING.i18n.yaml';
      'README.zh.md'           = 'README.zh.md';
      'README.i18n.yaml'       = 'README.i18n.yaml';
      'THIRD_PARTY_NOTICES.md' = 'THIRD_PARTY_NOTICES.md';
      'LICENSE'                = 'LICENSE';
      'packages/AGENTS.md'     = 'packages\AGENTS.md';
      'packages/README.md'     = 'packages\README.md';
      'vendor/README.md'       = 'vendor\README.md';
      'website/docs.ts'        = 'website-docs.ts'
    }
    # CLAUDE.md 上游是 symlink(blob 为目标路径文本), 与 KB 普通文件 blob 必然不同——单独比对目标文本内容。
    $claudeUpstream = (& git -C $Checkout cat-file -p "${ref}:CLAUDE.md" 2>$null | Select-Object -First 1)
    if ($claudeUpstream) {
      $claudeKb = Join-Path $kbDocs 'CLAUDE.md'
      if (Test-Path $claudeKb) {
        $claudeKbContent = (Get-Content $claudeKb -Raw -Encoding UTF8).Trim()
        if ($claudeKbContent -ne $claudeUpstream.Trim()) { $issues.Add("CHECKOUT-DRIFT: CLAUDE.md symlink 目标文本与 $ref 不一致, 运行 sync-official-docs.ps1 同步") }
      } else { $missingKb++; $issues.Add("CHECKOUT-DRIFT-MISSING-KB: CLAUDE.md -> 副本无此文件, 请运行 sync-official-docs.ps1") }
    }
    $keys = @($map.Keys)
    foreach ($line in (& git -C $Checkout ls-tree -r $ref -- $keys)) {
      if (-not $line) { continue }
      $i = $line.IndexOf("`t")
      if ($i -lt 0) { continue }
      $path = $line.Substring($i + 1)
      $sha = (($line.Substring(0, $i) -split '\s+')[2])
      $checkedDrift++
      $prefix = $null; $kbRel = $null
      foreach ($k in $keys) { if ($path -eq $k -or $path.StartsWith("$k/")) { $prefix = $k; $kbRel = $map[$k]; break } }
      if (-not $kbRel) { continue }
      $suffix = if ($path -eq $prefix) { '' } else { $path.Substring($prefix.Length + 1) }
      $kbPath = if ($suffix) { Join-Path (Join-Path $kbDocs $kbRel) ($suffix -replace '/','\') } else { Join-Path $kbDocs $kbRel }
      if (-not (Test-Path $kbPath)) { $missingKb++; $issues.Add("CHECKOUT-DRIFT-MISSING-KB: $path -> 副本无此文件, 请运行 sync-official-docs.ps1"); continue }
      $kbSha = (& git -C $Checkout hash-object $kbPath).Trim()
      if ($kbSha -ne $sha) {
        $driftCount++
        if ($driftCount -le 10) { $issues.Add("CHECKOUT-DRIFT: $path 与 $ref 不一致(副本落后或超前于上游), 运行 sync-official-docs.ps1 同步") }
      }
    }
    # KB 内多出、源 ref 已没有的文件(仅 docs/ 目录映射)
    $docsDir = Join-Path $kbDocs 'docs'
    if (Test-Path $docsDir) {
      $docsRoot = (Resolve-Path $docsDir).Path
      $treePaths = New-Object System.Collections.Generic.HashSet[string]
      foreach ($line in (& git -C $Checkout ls-tree -r --name-only $ref -- docs)) { if ($line) { [void]$treePaths.Add($line) } }
      Get-ChildItem -Recurse -File $docsDir | ForEach-Object {
        $rel = 'docs/' + $_.FullName.Substring($docsRoot.Length + 1).Replace('\','/')
        if (-not $treePaths.Contains($rel)) { $kbExtra++; $issues.Add("CHECKOUT-DRIFT-KB-EXTRA: 副本有、$ref 无: $rel (同步时会被清理)") }
      }
    }
    $info.Add("checkout-drift: ref=$ref 比较 $checkedDrift 个 blob; 内容漂移 $driftCount, KB 缺失 $missingKb, KB 多余 $kbExtra")
    if ($Strict -and ($driftCount -gt 0 -or $missingKb -gt 0 -or $kbExtra -gt 0)) { $issues.Add("CHECKOUT-DRIFT-STRICT: -Strict 下漂移视为失败") }
  }
} elseif ($Checkout) {
  $issues.Add("CHECKOUT-MISSING: -Checkout 指定的路径不存在: $Checkout")
}

# ---- 输出 ----
$info | ForEach-Object { Write-Output $_ }
if ($issues.Count -gt 0) { $issues | ForEach-Object { Write-Output $_ }; Write-Output "ISSUES: $($issues.Count)"; exit 1 }
Write-Output "VERIFY-OK"; exit 0
