# dsh-plugin-guide 完整性检查器
# 用法: pwsh -File scripts/verify-kit.ps1 -Root <路径>
# 校验范围: 本知识库自有文档(SKILL/README/NOTICE/guide/references 顶层);
# 官方文档副本(references/official-docs)是逐字副本,其内部链接指向 deepseek-harness checkout,不在校验范围。
param([string]$Root = '')
if ([string]::IsNullOrEmpty($Root)) { $Root = if ($PSScriptRoot) { Split-Path $PSScriptRoot -Parent } else { (Get-Location).Path } }
$ErrorActionPreference = 'SilentlyContinue'
$issues = New-Object System.Collections.Generic.List[string]
$info = New-Object System.Collections.Generic.List[string]

# ---- 1) 关键路径 ----
$critical = @(
  'SKILL.md','README.md','LICENSE','NOTICE.md','.gitignore',
  'guide/plugin-dev-guide.md','guide/quick-reference.md',
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
  'references/official-docs/docs/cookbook/adding-a-conversation-node.md',
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
  'scripts/download-sources.ps1','scripts/download-community-repos.ps1','scripts/verify-kit.ps1'
)
foreach ($c in $critical) { if (-not (Test-Path (Join-Path $Root $c))) { $issues.Add("CRITICAL-MISSING: $c") } }
$info.Add("critical: $($critical.Count) 项, 缺失 $((($issues | Where-Object { $_ -like 'CRITICAL-*' }) | Measure-Object).Count)")

# ---- 2) 自有文档相对路径解析 ----
$scopeFiles = @((Join-Path $Root 'SKILL.md'), (Join-Path $Root 'README.md'), (Join-Path $Root 'NOTICE.md'))
$scopeFiles += Get-ChildItem (Join-Path $Root 'guide') -Filter *.md -File
$scopeFiles += Get-ChildItem (Join-Path $Root 'references') -Filter *.md -File   # 仅顶层,不含 official-docs 子树
$missing = 0; $downloadsRefs = 0; $repoRelRefs = 0; $absRefs = 0

function Is-PathToken([string]$t) {
  # 纯 ASCII 相对路径(允许 md/ps1/yml 等扩展名与 #锚点),拒绝带空格/CJK 的引文片段
  return $t -match '^(\./)?([A-Za-z0-9][A-Za-z0-9_.\-]*/)*[A-Za-z0-9_.\-]+(\.[A-Za-z0-9]+)?(#[A-Za-z0-9_\-/]+)?$'
}
function Test-RootRel([string]$p) {
  $p = $p -replace '^\./',''
  $p = $p -replace '[?#].*$',''
  if ($p -match '[*]') { $dir = Split-Path (Join-Path $Root $p) -Parent; return Test-Path $dir }
  return Test-Path (Join-Path $Root $p)
}

foreach ($f in $scopeFiles) {
  if (-not (Test-Path $f.FullName)) { continue }
  $relFile = $f.FullName.Substring($Root.Length + 1)
  $text = Get-Content $f.FullName -Raw
  $tokens = New-Object System.Collections.Generic.HashSet[string]
  foreach ($m in [regex]::Matches($text, '`([^`]+)`|\[[^\]]*\]\(([^)\s]+)\)')) {
    $t = if ($m.Groups[1].Success) { $m.Groups[1].Value } else { $m.Groups[2].Value }
    $t = $t.Trim()
    if ($t -match '^https?://' -or $t -match '^[A-Za-z]:[\\/]' -or $t -match '^(<|\$|#)') { continue }
    if ($t -match '^[A-Za-z]:[\\/]') { $absRefs++; continue }
    if (-not (Is-PathToken $t)) { continue }
    [void]$tokens.Add($t)
  }
  foreach ($t in $tokens) {
    if ($t -match '^(\.\./){2,}' -or $t -match '^\.\./packages/|^\.\./\.agents/') { $repoRelRefs++; continue }
    if ($t -match '^(\./)?downloads/') { $downloadsRefs++; continue }
    if (-not (Test-RootRel $t)) { $missing++; $issues.Add("LINK-MISSING: [$relFile] -> $t") }
  }
}
$info.Add("link-scan: $($scopeFiles.Count) 个自有文档; 缺失 $missing; downloads 引用 $downloadsRefs(允许); checkout 相对链接 $repoRelRefs(跳过); 绝对路径 $absRefs(信息)")

# ---- 3) 功能文档中的本机绝对路径(设计内的回退/示例,仅信息) ----
foreach ($f in @('SKILL.md','README.md','guide/plugin-dev-guide.md','guide/quick-reference.md')) {
  $hits = Select-String -Path (Join-Path $Root $f) -Pattern 'D:\\deepseek-harness' -AllMatches
  foreach ($h in $hits) { $info.Add("ABS-PATH(设计内回退/示例): [$f] L$($h.LineNumber)") }
}

# ---- 输出 ----
$info | ForEach-Object { Write-Output $_ }
if ($issues.Count -gt 0) { $issues | ForEach-Object { Write-Output $_ }; Write-Output "ISSUES: $($issues.Count)"; exit 1 }
Write-Output "VERIFY-OK"; exit 0
