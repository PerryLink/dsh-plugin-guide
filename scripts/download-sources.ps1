# DeepSeek Harness 插件开发资料全量下载脚本
# 输出: dsh-plugin-guide/downloads/{web,github,community} + manifest.tsv
# 参数: -DocRoot <路径> 官方 checkout 的 docs 目录(Phase D 站点路由来源),默认本机 checkout。
param([string]$DocRoot = 'D:\deepseek-harness\docs')
$ErrorActionPreference = 'Continue'
$ProgressPreference = 'SilentlyContinue'

$kit  = Split-Path $PSScriptRoot -Parent
$dl   = Join-Path $kit 'downloads'
New-Item -ItemType Directory -Force -Path $dl | Out-Null
$manifest = New-Object System.Collections.Generic.List[string]
$manifest.Add("status`thttpcode`tbytes`turl`tfile")

function Log([string]$line) { $script:manifest.Add($line) }

function Do-Curl([string]$url, [string]$outFile, [string]$extra) {
  $dir = Split-Path $outFile -Parent
  if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  $args1 = @('-sS','-L','--max-time','90','-o',$outFile)
  if ($extra) { $args1 += $extra }
  $args1 += @('-w','%{http_code}', $url)
  $code = & curl.exe @args1 2>$null
  if (($code -match '^2') -and (Test-Path $outFile)) {
    $sz = (Get-Item $outFile).Length
    if ($sz -eq 0) { Remove-Item $outFile -Force; Log "FAIL`t$code`t0`t$url"; return $false }
    Log "OK`t$code`t$sz`t$url`t$outFile"
    return $true
  }
  if (Test-Path $outFile) { Remove-Item $outFile -Force -ErrorAction SilentlyContinue }
  Log "FAIL`t$code`t0`t$url"
  return $false
}

function Download([string[]]$urls, [string]$outFile, [string]$extra) {
  foreach ($u in $urls) { if (Do-Curl $u $outFile $extra) { return $true } }
  return $false
}

function Get-DefaultBranch([string]$metaFile, [string]$fallback) {
  if (!(Test-Path $metaFile)) { return $fallback }
  try {
    $m = Get-Content $metaFile -Raw | ConvertFrom-Json
    if ($m.default_branch) { return $m.default_branch }
  } catch { }
  return $fallback
}

$ua = @('-H','User-Agent: dsh-plugin-guide-research')

# ---------- Phase A: 固定 URL ----------
Download @('https://raw.githubusercontent.com/cordiverse/cordis/HEAD/README.md',
          'https://raw.githubusercontent.com/cordiverse/cordis/master/README.md',
          'https://raw.githubusercontent.com/cordiverse/cordis/main/README.md') `
  (Join-Path $dl 'github\cordis\README.md')
Download @('https://raw.githubusercontent.com/cordiverse/cordis/HEAD/package.json') `
  (Join-Path $dl 'github\cordis\package.json')
Download @('https://api.github.com/repos/cordiverse/cordis') `
  (Join-Path $dl 'github\cordis\repo.json') $ua

Download @('https://raw.githubusercontent.com/cordiverse/paper/HEAD/README.md',
          'https://raw.githubusercontent.com/cordiverse/paper/master/README.md',
          'https://raw.githubusercontent.com/cordiverse/paper/main/README.md') `
  (Join-Path $dl 'github\paper\README.md')
Download @('https://api.github.com/repos/cordiverse/paper') `
  (Join-Path $dl 'github\paper\repo.json') $ua

Download @('https://raw.githubusercontent.com/deepseek-ai/deepseek-harness/HEAD/README.md',
          'https://raw.githubusercontent.com/deepseek-ai/deepseek-harness/master/README.md',
          'https://raw.githubusercontent.com/deepseek-ai/deepseek-harness/main/README.md') `
  (Join-Path $dl 'github\harness\README.md')
Download @('https://api.github.com/repos/deepseek-ai/deepseek-harness') `
  (Join-Path $dl 'github\harness\repo.json') $ua

# 官网与文档站入口页
Download @('https://www.deepseek.com/harness/','https://www.deepseek.com/harness','https://deepseek.com/harness/') `
  (Join-Path $dl 'web\deepseek-com-harness.html')
Download @('https://deepseek-harness.github.io/deepseek-harness/sitemap.xml') `
  (Join-Path $dl 'web\sitemap.xml')
Download @('https://deepseek-harness.github.io/deepseek-harness/develop/basic/') `
  (Join-Path $dl 'web\develop-basic.html')

# ---------- Phase B: cordis 仓库全量 md 文档 ----------
$cordisBranch = Get-DefaultBranch (Join-Path $dl 'github\cordis\repo.json') 'master'
$treeFile = Join-Path $dl 'github\cordis\tree.json'
Download @("https://api.github.com/repos/cordiverse/cordis/git/trees/$cordisBranch`?recursive=1") $treeFile $ua
if (Test-Path $treeFile) {
  try {
    $t = Get-Content $treeFile -Raw | ConvertFrom-Json
    $i = 0
    foreach ($item in $t.tree) {
      if ($item.type -ne 'blob') { continue }
      if ($item.path -notmatch '\.(md|mdx)$') { continue }
      $i++
      if ($i -gt 120) { break }
      $out = Join-Path $dl ("github\cordis\repo\" + ($item.path -replace '/','\'))
      Download @("https://raw.githubusercontent.com/cordiverse/cordis/$cordisBranch/$($item.path)") $out
    }
  } catch { Log "FAIL`tparse-tree`t0`tcordis tree.json 解析失败" }
}

# ---------- Phase C: paper 仓库 md/tex ----------
$paperBranch = Get-DefaultBranch (Join-Path $dl 'github\paper\repo.json') 'master'
$ptreeFile = Join-Path $dl 'github\paper\tree.json'
Download @("https://api.github.com/repos/cordiverse/paper/git/trees/$paperBranch`?recursive=1") $ptreeFile $ua
if (Test-Path $ptreeFile) {
  try {
    $t = Get-Content $ptreeFile -Raw | ConvertFrom-Json
    $i = 0
    foreach ($item in $t.tree) {
      if ($item.type -ne 'blob') { continue }
      if ($item.path -notmatch '\.(md|tex|bib|typ|pdf)$') { continue }
      $i++
      if ($i -gt 60) { break }
      $out = Join-Path $dl ("github\paper\repo\" + ($item.path -replace '/','\'))
      Download @("https://raw.githubusercontent.com/cordiverse/paper/$paperBranch/$($item.path)") $out
    }
  } catch { Log "FAIL`tparse-tree`t0`tpaper tree.json 解析失败" }
}

# ---------- Phase D: GitHub Pages 全站爬取 ----------
$siteBase = 'https://deepseek-harness.github.io/deepseek-harness/'
$docRoot = $DocRoot
$routes = New-Object System.Collections.Generic.HashSet[string]

function SitePath([string]$rel) {
  $p = $rel -replace '\.zh\.md$','' -replace '\.md$',''
  $p = $p -replace '\\','/'
  if ($p -match '/index$') { $p = $p -replace '/index$','' }
  return $p
}

Get-ChildItem (Join-Path $docRoot 'user') -Recurse -Filter *.md | ForEach-Object {
  $rel = $_.FullName.Substring((Join-Path $docRoot 'user').Length + 1)
  [void]$routes.Add((SitePath $rel))
}
Get-ChildItem (Join-Path $docRoot 'cordis-tutorial') -Filter *.md | ForEach-Object {
  [void]$routes.Add('develop/cordis-tutorial/' + (SitePath $_.Name))
}
Get-ChildItem (Join-Path $docRoot 'subsystems') -Filter *.md | ForEach-Object {
  $n = SitePath $_.Name
  [void]$routes.Add($(if ($_.BaseName -eq 'README') { 'reference/subsystems' } else { "reference/subsystems/$n" }))
}
@('architecture','cordis-primer','capability-seams','agent-lifecycle','tool-execution-pipeline','config-catalog','tool-catalog','persistence-catalog') | ForEach-Object {
  [void]$routes.Add("reference/$_")
}
Get-ChildItem (Join-Path $docRoot 'cordis-api') -Filter *.md | ForEach-Object {
  [void]$routes.Add('reference/cordis-api/' + (SitePath $_.Name))
}
@('adding-a-package','adding-a-tool','adding-an-llm-adapter','extension-cookbook') | ForEach-Object {
  [void]$routes.Add("reference/cookbook/$_")
}

$siteCount = 0
foreach ($r in $routes) {
  foreach ($loc in @('','en/')) {
    $rel = $loc + $r
    $url = $siteBase + $rel
    $fname = $rel -replace '/','\'
    if ($fname -eq '') { $fname = 'index' }
    $out = Join-Path $dl ("web\site\$fname.html")
    Do-Curl $url $out | Out-Null
    $siteCount++
  }
}
Log "INFO`t-`t$siteCount`tpages attempted`tghpages crawl"

# ---------- Phase E: 社区仓库 README ----------
$community = @(
  @('AdamPlatin123','awesome-dsh-plugins'),
  @('omdsh-dev','dsh-plugin-dev'),
  @('omdsh-dev','plugin-template'),
  @('omdsh-dev','dsh-plugin-skills'),
  @('vlln','plugin-registry'),
  @('0xsline','awesome-deepseek-harness'),
  @('awesome-dsh-plugin','awesome-dsh-plugin'),
  @('Alex-Yanggg','awesome-DSH-plugin'),
  @('bruc3van','awesome-dsh-plugin'),
  @('Dominic789654','awesome-deepseek-harness'),
  @('hikariming','dshfind'),
  @('dsh-external','hub'),
  @('titanwings','colleague-skill')
)
foreach ($pair in $community) {
  $owner = $pair[0]; $repo = $pair[1]
  Download @("https://raw.githubusercontent.com/$owner/$repo/HEAD/README.md",
            "https://raw.githubusercontent.com/$owner/$repo/master/README.md",
            "https://raw.githubusercontent.com/$owner/$repo/main/README.md") `
    (Join-Path $dl "community\$repo.md")
  Download @("https://api.github.com/repos/$owner/$repo") `
    (Join-Path $dl "community\$repo.json") $ua
}

# ---------- Phase F: manifest ----------
Set-Content -Path (Join-Path $dl 'manifest.tsv') -Value $manifest -Encoding UTF8
Write-Output ("DONE: " + $manifest.Count + " 条记录 -> " + (Join-Path $dl 'manifest.tsv'))
