# dsh-plugin-guide 官方 GitHub Discussions 归档脚本（可复跑，幂等）
# 输出: downloads/github/harness/discussions/
#   list.json          全部讨论（title/body/category/answers/labels 等，正文即文档）
#   comments-<n>.json  精选线程的全部评论（选择规则见下）
#   _selection.tsv     精选线程清单
#   README.md          分类统计 + 精选清单
# 说明: GitHub REST API;未提供 Token 时走匿名配额(60/h,可能不够),建议
#   $env:GH_TOKEN 或 -Token <token>(经典 PAT,只需 public_repo 读权限)。
#   选择规则(与 08-14 首版覆盖度一致): Announcements 全部; Q&A/Ideas 评论>=1;
#   General/Show and tell 评论>=3 且标题不含拉群/招聘/广告词。
#   传输用 Invoke-WebRequest(而非 curl.exe 数组参数): PS 5.1 下 curl 数组参数
#   的引号拆分会把 -H 头打碎,导致静默拿到错误对象——本脚本已规避该坑。
# 参数: -OutDir <dir> 覆盖输出目录; -SkipComments 只刷新 list.json 不拉评论。
param(
  [string]$OutDir = '',
  [string]$Repo = 'deepseek-ai/deepseek-harness',
  [string]$Token = $env:GH_TOKEN,
  [switch]$SkipComments
)
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
if (-not $OutDir) { $OutDir = Join-Path (Split-Path $PSScriptRoot -Parent) 'downloads\github\harness\discussions' }
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

$headers = @{ 'User-Agent' = 'dsh-plugin-guide-research'; 'Accept' = 'application/vnd.github+json' }
if ($Token) { $headers['Authorization'] = "Bearer $Token" }

function Get-Api([string]$url) {
  # 返回对象数组;失败/限流时抛错(带状态码),由调用方决定重试或中止。
  try {
    $resp = Invoke-WebRequest -Uri $url -Headers $headers -TimeoutSec 60 -UseBasicParsing
  } catch {
    $code = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { 0 }
    throw "HTTP $code : $url"
  }
  $obj = $null
  try { $obj = $resp.Content | ConvertFrom-Json } catch { throw "JSON parse failed: $url" }
  if ($obj -is [System.Management.Automation.PSCustomObject] -and $obj.PSObject.Properties.Name -contains 'message') {
    throw "API message '$($obj.message)' : $url"
  }
  return @($obj)
}

# ---- 1) 全量 list(按创建序分页;REST 的 direction 参数对 discussions 无效,只能从头翻到尾) ----
$prevCount = 0
if (Test-Path (Join-Path $OutDir 'list.json')) {
  try { $prev = @((Get-Content (Join-Path $OutDir 'list.json') -Raw -Encoding UTF8 | ConvertFrom-Json)); $prevCount = $prev.Count } catch { $prevCount = 0 }
}
$all = @()
$page = 1
while ($page -le 50) {
  $items = Get-Api "https://api.github.com/repos/$Repo/discussions?per_page=100&page=$page&sort=created"
  if ($items.Count -eq 0) { Write-Output "page ${page}: 空页,列表结束"; break }
  $all += $items
  Write-Output ("page {0}: +{1} (累计 {2})" -f $page, $items.Count, $all.Count)
  if ($items.Count -lt 100) { break }
  $page++
  Start-Sleep -Milliseconds 500
}
if ($all.Count -eq 0) { throw 'discussions 列表抓取失败(0 条)' }
if ($prevCount -gt 0 -and $all.Count -lt [Math]::Floor($prevCount * 0.9)) {
  throw "列表疑似缩水: 上次 $prevCount 条, 本次仅 $all.Count 条 —— 拒绝覆盖归档,请检查网络/配额后重跑"
}

# 按 number 去重(分页边界可能重复)
$uniq = @{}
foreach ($d in $all) { $uniq[[int]$d.number] = $d }
$discs = @($uniq.Values | Sort-Object { [int]$_.number })
$listPath = Join-Path $OutDir 'list.json'
$discs | ConvertTo-Json -Depth 6 | Set-Content -Path $listPath -Encoding UTF8
Write-Output "list.json: $($discs.Count) 条 -> $listPath"

# ---- 2) 精选线程 + 评论 ----
$sel = @()
foreach ($d in $discs) {
  $cat = $d.category.name
  $c = [int]$d.comments
  $t = [string]$d.title
  $pick = $false
  if ($cat -eq 'Announcements') { $pick = $true }
  elseif ($cat -eq 'Q&A' -and $c -ge 1) { $pick = $true }
  elseif ($cat -eq 'Ideas' -and $c -ge 1) { $pick = $true }
  elseif (($cat -eq 'General' -or $cat -eq 'Show and tell') -and $c -ge 3) {
    # 非社群拉群帖: 标题含拉群/扫码/加群/招聘/广告类词的不收
    if ($t -notmatch '群|扫码|加群|招聘|内推|广告|投简历|纳新') { $pick = $true }
  }
  if ($pick) { $sel += $d }
}
$sel = @($sel | Sort-Object { [int]$_.number })
Write-Output "精选线程: $($sel.Count) 条"

if (-not $SkipComments) {
  $n = 0
  foreach ($d in $sel) {
    $num = [int]$d.number
    $comments = @()
    $cp = 1
    while ($cp -le 20) {
      $ci = Get-Api "https://api.github.com/repos/$Repo/discussions/$num/comments?per_page=100&page=$cp"
      if ($ci.Count -eq 0) { break }
      $comments += $ci
      if ($ci.Count -lt 100) { break }
      $cp++
      Start-Sleep -Milliseconds 300
    }
    $comments | ConvertTo-Json -Depth 6 | Set-Content -Path (Join-Path $OutDir "comments-$num.json") -Encoding UTF8
    $n++
    if ($n % 20 -eq 0) { Write-Output "comments: $n / $($sel.Count)" }
    Start-Sleep -Milliseconds 200
  }
  Write-Output "comments: 完成 $n 个线程"
  # 清掉列表里已不存在的旧 comments 文件
  $keep = New-Object System.Collections.Generic.HashSet[string]
  foreach ($d in $sel) { [void]$keep.Add("comments-$([int]$d.number).json") }
  Get-ChildItem $OutDir -Filter 'comments-*.json' | Where-Object { -not $keep.Contains($_.Name) } | Remove-Item -Force
} else {
  Write-Output 'comments: 跳过(-SkipComments)'
}

# ---- 3) _selection.tsv 与 README.md ----
$selLines = @('number' + "`t" + 'category' + "`t" + 'comments' + "`t" + 'title')
foreach ($d in $sel) { $selLines += ("{0}`t{1}`t{2}`t{3}" -f $d.number, $d.category.name, $d.comments, ($d.title -replace "`t",' ')) }
Set-Content -Path (Join-Path $OutDir '_selection.tsv') -Value $selLines -Encoding UTF8

$cats = @{}
foreach ($d in $discs) { $k = [string]$d.category.name; if (-not $cats.ContainsKey($k)) { $cats[$k] = 0 }; $cats[$k]++ }
$utc = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
$L = @()
$L += '# 官方 GitHub Discussions 归档（自动生成，见抓取时间）'
$L += ''
$L += '> 来源：https://github.com/deepseek-ai/deepseek-harness/discussions （官方仓库 Issues 关闭，Discussions 为反馈主渠道）。'
$L += '> 抓取：GitHub REST API（list 含每条正文；comments-<n>.json 为精选线程的全部评论）。'
$L += "> 更新：提供 ``GH_TOKEN`` 后可由 ``scripts/archive-discussions.ps1`` 幂等刷新；抓取时间 $utc (UTC)。"
$L += ''
$L += '## 文件'
$L += ''
$L += "- list.json — 全部 $($discs.Count) 条讨论（含 title/body/category/answers/labels 等字段，正文即模型可读文档）。"
$L += "- comments-<n>.json — 精选 $($sel.Count) 条线程的评论（选择规则：Announcements/Q&A/Ideas 评论>=1；General/Show and tell 评论>=3 且非社群拉群帖）。"
$L += '- _selection.tsv — 精选线程清单（编号/分类/评论数/标题）。'
$L += ''
$L += '## 分类统计'
$L += ''
foreach ($k in @($cats.Keys | Sort-Object)) { $L += "- $k：$($cats[$k]) 条" }
$L += ''
$L += '## 有归档评论的精选线程'
$L += ''
$L += '| # | 分类 | 评论 | 标题 |'
$L += '|---|---|---|---|'
foreach ($d in $sel) {
  $title = ($d.title -replace '\|','\|' -replace "[\r\n]",' ')
  $L += "| [#$($d.number)](https://github.com/deepseek-ai/deepseek-harness/discussions/$($d.number)) | $($d.category.name) | $($d.comments) | $title |"
}
Set-Content -Path (Join-Path $OutDir 'README.md') -Value ($L -join "`r`n") -Encoding UTF8
Write-Output "DONE: list=$($discs.Count) selected=$($sel.Count) -> $OutDir"
