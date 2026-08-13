# 社区插件开发相关仓库全量下载(tarball)脚本
# 输出: dsh-plugin-guide/downloads/community-repos/<repo>/
$ErrorActionPreference = 'Continue'
$ProgressPreference = 'SilentlyContinue'

$dl = 'D:\deepseek-harness\Project\Plugins\dsh-plugin-guide\downloads\community-repos'
New-Item -ItemType Directory -Force -Path $dl | Out-Null
$ua = @('-H','User-Agent: dsh-plugin-guide-research')

$repos = @(
  'omdsh-dev/plugin-template',
  'omdsh-dev/dsh-plugin-skills',
  'omdsh-dev/dsh-plugin-dev',
  'vlln/plugin-registry',
  'omdsh-dev/fabric',
  'whyihaveyou/dsh-suite',
  'omdsh-dev/dsh-plugin-check',
  'Opr4Mp3r/deepseek-harness-plugin-from-scratch',
  'randerous/dsh-turn-meta',
  'bobleer/deepseek-harness-plugin-mcp',
  'Nagi-ovo/dsh-find-plugins',
  'omdsh-dev/dsh-hub-workshop',
  'AdamPlatin123/awesome-dsh-plugins',
  'bruc3van/awesome-dsh-plugin',
  'Alex-Yanggg/awesome-DSH-plugin'
)

$log = New-Object System.Collections.Generic.List[string]
foreach ($r in $repos) {
  $owner, $repo = $r -split '/'
  $repoDir = Join-Path $dl $repo
  if ((Test-Path $repoDir) -and (Get-ChildItem $repoDir -File -ErrorAction SilentlyContinue)) {
    $log.Add("SKIP`t$r (already downloaded)"); continue
  }
  $meta = & curl.exe -sS -L --max-time 40 $ua "https://api.github.com/repos/$r" 2>$null
  try { $branch = ($meta | ConvertFrom-Json).default_branch } catch { $branch = '' }
  if (-not $branch) { $branch = 'main' }
  $tgz = Join-Path $dl ("$repo.tar.gz")
  $code = & curl.exe -sS -L --max-time 120 -o $tgz -w '%{http_code}' "https://codeload.github.com/$r/tar.gz/refs/heads/$branch" 2>$null
  if ($code -match '^2' -and (Test-Path $tgz) -and (Get-Item $tgz).Length -gt 1024) {
    $tmp = Join-Path $dl ("_$repo")
    if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
    New-Item -ItemType Directory -Force -Path $tmp | Out-Null
    & tar.exe -xzf $tgz -C $tmp 2>$null
    $extracted = Get-ChildItem $tmp -Directory | Select-Object -First 1
    if ($extracted) {
      if (Test-Path $repoDir) { Remove-Item $repoDir -Recurse -Force }
      Move-Item $extracted.FullName $repoDir
      Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
      $n = (Get-ChildItem $repoDir -Recurse -File | Measure-Object).Count
      $log.Add("OK`t$r`tbranch=$branch`tfiles=$n")
    } else { $log.Add("FAIL`t$r`textract-empty") }
  } else { $log.Add("FAIL`t$r`thttp=$code") }
  if (Test-Path $tgz) { Remove-Item $tgz -Force }
}
$log | Set-Content (Join-Path $dl '_download.log') -Encoding UTF8
Write-Output ('DONE: ' + $log.Count + ' repos -> ' + (Join-Path $dl '_download.log'))
$log | Write-Output
