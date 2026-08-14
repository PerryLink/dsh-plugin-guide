# dsh-plugin-guide 话题快照生成脚本
# 用途: 抓取 GitHub topic:dsh-plugin 全量仓库清单,产出与 sources.md §D.2 记录一致的快照目录
#   <OutDir>/raw-github-api-page-<n>.json + repos.tsv + README.md(全量表)
# 用法: pwsh -File scripts/gen-topic-snapshot.ps1 -OutDir <路径> [-PerPage 100] [-MaxPages 10] [-DelaySeconds 6]
# 说明: 走 GitHub Search API(未认证 10 次/分钟),分页抓取、按 full_name 去重、按 star 降序;
#       与 08-13/08-14 两期快照同构,便于续期对比(新增/消失仓库用 repos.tsv diff)。
param(
  [Parameter(Mandatory=$true)][string]$OutDir,
  [int]$PerPage = 100,
  [int]$MaxPages = 10,
  [int]$DelaySeconds = 6
)
$ErrorActionPreference = 'Continue'
$ProgressPreference = 'SilentlyContinue'
$ua = @('-H','User-Agent: dsh-plugin-guide-research')
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

$all = @()
$total = -1
for ($p = 1; $p -le $MaxPages; $p++) {
  $r = $null
  for ($a = 0; $a -lt 3 -and $null -eq $r; $a++) {
    try {
      $json = & curl.exe -sS -L --max-time 40 $ua "https://api.github.com/search/repositories?q=topic:dsh-plugin&per_page=$PerPage&page=$p"
      $r = $json | ConvertFrom-Json
    } catch { Start-Sleep -Seconds 3 }
  }
  if ($null -eq $r) { Write-Output "page ${p} FAILED (after retries)"; break }
  if ($r.items.Count -eq 0) { Write-Output "page ${p}: no items (end)"; break }
  $total = $r.total_count
  $all += @($r.items)
  $raw = Join-Path $OutDir "raw-github-api-page-$p.json"
  $r | ConvertTo-Json -Depth 6 | Set-Content $raw -Encoding UTF8
  Write-Output "page ${p}: total=$($r.total_count) items=$($r.items.Count)"
  Start-Sleep -Seconds $DelaySeconds
  if ($all.Count -ge $total -or $r.items.Count -lt $PerPage) { break }
}

$uniq = @{}
foreach ($i in $all) { if (-not $uniq.ContainsKey($i.full_name)) { $uniq[$i.full_name] = $i } }
$rows = @($uniq.Values | Sort-Object -Property stargazers_count -Descending)

$tsv = @("full_name`tstars`tlanguage`tlicense`tarchived`tpushed_at`tdescription")
foreach ($i in $rows) {
  $desc = ($i.description -replace "[\r\n\t]", ' ')
  $tsv += "{0}`t{1}`t{2}`t{3}`t{4}`t{5}`t{6}" -f $i.full_name, $i.stargazers_count, $i.language, $i.license.spdx_id, $i.archived, $i.pushed_at, $desc
}
Set-Content -Path (Join-Path $OutDir 'repos.tsv') -Value ($tsv -join "`r`n") -Encoding UTF8

$utc = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mmZ')
$L = @()
$L += '# DeepSeek Harness `dsh-plugin` 话题全量清单'
$L += ''
$L += '> 数据来源：GitHub Search API `q=topic:dsh-plugin`（公开话题页 <https://github.com/topics/dsh-plugin>）。'
$L += "> 抓取时间：$utc（UTC）。API total_count $total；本清单去重收录 $($rows.Count) 个。"
$L += ''
$L += '## 元信息'
$L += ''
$L += '| 项目 | 值 |'
$L += '|---|---|'
$L += '| 话题 | [dsh-plugin](https://github.com/topics/dsh-plugin) |'
$L += "| 仓库总数 | $($rows.Count)（API total_count $total） |"
$L += "| 抓取时间 (UTC) | $utc |"
$L += '| 排序 | star 数降序 |'
$L += ''
$L += '## 全量清单（按 star 排序）'
$L += ''
$L += '| # | 仓库 | ⭐ | 语言 | 许可 | 归档 | 功能 / 效果（官方描述） | 最近推送 (UTC) | 话题标签 |'
$L += '|---|------|----|------|------|------|----------------|----------------|----------|'
$n = 0
foreach ($i in $rows) {
  $n++
  $name = $i.full_name
  $stars = $i.stargazers_count
  $lang = $i.language
  $lic = if ($i.license) { $i.license.spdx_id } else { '-' }
  $arch = if ($i.archived) { '是' } else { '否' }
  $desc = ($i.description -replace '\|','\|' -replace "[\r\n]", ' ')
  $push = $i.pushed_at
  $topics = if ($i.topics) { ($i.topics -join ', ') } else { '' }
  $L += "| $n | [$name](https://github.com/$name) | $stars | $lang | $lic | $arch | $desc | $push | $topics |"
}
Set-Content -Path (Join-Path $OutDir 'README.md') -Value ($L -join "`r`n") -Encoding UTF8
Write-Output "DONE: $($rows.Count) unique repos -> $OutDir (README/`repos.tsv/`raw pages)"
