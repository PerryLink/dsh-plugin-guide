# 社区插件开发相关仓库全量下载(tarball)脚本
# 输出: dsh-plugin-guide/downloads/community-repos/<repo>/
# 刷新策略: codeload HEAD 请求的 ETag 对比（内容变更即重新下载）；记录在 downloads/community-repos/_heads.tsv。
# 传输: 纯 curl + codeload（main -> master -> HEAD 分支回退），不消耗 GitHub API 配额，也不依赖 git 进程。
# 参数: -Force 忽略 ETag 对比,强制全部重下; -Slice <n> -Slices <m> 只处理第 n/m 段(1-based),
#       此时日志与 heads 写入 _download.s<n>.log / _heads.s<n>.tsv,由调用方自行合并。
param([switch]$Force, [int]$Slice = 0, [int]$Slices = 1, [switch]$OnlyMissing)
$ErrorActionPreference = 'Continue'
$ProgressPreference = 'SilentlyContinue'

$kb = Split-Path $PSScriptRoot -Parent
$dl = Join-Path $kb 'downloads\community-repos'
New-Item -ItemType Directory -Force -Path $dl | Out-Null

# 后台/受限环境 PATH 可能缺失 curl/tar：逐一下落
$curl = Get-Command curl.exe -ErrorAction SilentlyContinue
if (-not $curl) { if (Test-Path "$env:SystemRoot\System32\curl.exe") { $curl = "$env:SystemRoot\System32\curl.exe" } else { $curl = 'curl.exe' } }
$tar = Get-Command tar.exe -ErrorAction SilentlyContinue
if (-not $tar) { if (Test-Path "$env:SystemRoot\System32\tar.exe") { $tar = "$env:SystemRoot\System32\tar.exe" } else { $tar = 'tar.exe' } }

$repos = @(
  # 第一批：08-13/14 首批深读的 15 个插件开发仓库
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
  'Alex-Yanggg/awesome-DSH-plugin',
  # 第二批：08-14 上午清单（awesome/市场/候选，此前未归档）
  'walkinglabs/awesome-deepseek-harness-plugins',
  'vvlife/awesome-deepseek-harness-plugins',
  'cccakeee/awesome-dsh-plugins',
  'bradeGithub/DSH-Plugins-Marketplace',
  'Toukaiteio/dsh-plugin-installer',
  'Scorp1o117/dsh-plugin-marketplace',
  'NanmiCoder/dsh-agent-teams',
  'vibeinging/dsh-tool-search',
  'zhu1090093659/dsh-web-ui',
  'ccch1mneyyy/dsh-cc-tui',
  'dataelement/dsh-desktop',
  'hust-open-atom-club/oh-dsh-desktop',
  'lhh010/dsh-bash-encoding',
  'Nagi-ovo/dsh-visualize',
  # 第三批：08-14 晚间 GitHub 生态扫描（高优先级 26 个文档型仓库）
  'flaqai/deepeseek-harness-guide',
  'Electricitysheep/dsh-handbook',
  'JingHao-Leon/deepseek-harness-guide',
  'flysheep-ai/learn_deepseek_harness',
  'pingfanfan/hello-dsh',
  'LaplaceYoung/dsh-book-deepseek-harness',
  'yanhua1010/dsh-harness-tutorial',
  'hoco-scy/deepseek-harness-deep-dive',
  'libukai/awesome-deepseek-harness',
  'sandbaseai/deepseek-harness-handbook',
  'openma-ai/deepseek-harness-typescript-sdk',
  'h565656445/dsh-llm-agent-harness-guide',
  'h565656445/dsh-agent-os-worker-protocol',
  'cyanseek/dsh-native-playbook',
  'whyihaveyou/dsh-plugin-tutorial',
  'DumplingHuman/dsh-plugin-tutorial',
  'anweat/dsh-plugin-dev-guide',
  'Hubert-hwk/dsh-for-humans',
  'yangl326-Dylan/learning-dsh',
  'curtiseng/cordis-course',
  'THU-MAIC/dsh-openmaic',
  'qomob/DSHwiki',
  'calderbuild/awesome-deepseek-harness',
  'njdldkl666699/dsh-learning',
  'Loner1024/deepseek-harness-sdk-rs',
  'dshworks/howto-dsh',
  # 第四批：skill 集合/契约规范/含实质开发知识（中优先级 19 个）
  'dhicoc/dsh-reverse-skill',
  'phoenixlucky/zerotoken-skill',
  'unknowbug/anchorlaw',
  'w2112515/dsh-plugin-development',
  'OneZero-Y/dsh-plugin-kit',
  'akira399/dsh-plugin-publisher',
  'LeslieWylie/dsh-plugin-release',
  'LeslieWylie/dsh-benchmark-evidence',
  'LeslieWylie/dsh-agent-orchestration',
  'dongsheng123132/task-passport',
  'Tostoevsky/TsienHsueShen',
  'Whning0513/awesome-deepseek-skills',
  'Jesse-njx/dsh-skillport',
  'green-dalii/dsh-plugin-dev-skill',
  'RayYeung1989/dsh-plugin-development',
  'SmileTao/dsh-plugin-dev-skill',
  'Leeaoyin/dr-agent-skills',
  'KhalilYamber/hana-dsh-bridge',
  'ieookm/agent-to-dsh-migration',
  # 第五批：目录/市场/awesome 索引（低优先级 20 个，README 即文档）
  'kejixiaoliang/awesome-dsh-plugins',
  'like-study1/Oh-My-DSH',
  'zp-home/dsh-recommend',
  'white0dew/awesome-dsh-plugins',
  'wangshunnn/oh-my-dsh',
  'billLiao/awesome-dsh-plugin',
  'YYTbit/awesome-dsh-bridges',
  'HackSing/dsh-plugins',
  'xiaohai-78/Top',
  '2BingLing/dsh-market',
  'lwmxiaobei/dsh-plugins',
  'dshworks/awesome-dsh-themes',
  'dshworks/awesome-dsh-plugins',
  'dsh-pub/dsh-pub',
  'cooljser/dsh-plugin-portal',
  'WatchaAI/awesome-deepseek-harness-plugins',
  'imsai-sh/awesome-deepseek-harness-plugins',
  'xianyu110/awesome-deepseek-harness',
  'openguardrails/openguardrails',
  'Bandersnatch0x/amber-protocol',
  # 第六批：中英文社区扫描补充（教程仓库/Tauri 壳）
  'onychen/learn-dsh',
  'alchaincyf/deepseek-harness-orange-book',
  'bobleer/deepseek-harness-gui',
  # 第七批：08-15 上午增量扫描（web_search 新线索：桌面端/QAT 桥接/安全 PoC/awesome/Python 移植/Termux）
  'anywhere-labs/deepseek-harness-desktop',
  'cc1252/deepseek-harness-desktop',
  'LisiChen0/DeepSeek-Harness-Desktop',
  'Skyearn/deepseek-harness-app',
  'salathleizhang/deepseek-harness-desktop',
  'ChisaAlter/Deepseek-Harness-Desktop',
  'hairyf/deepseek-harness-desktop',
  'banana770/dsh-qq-bridge',
  'mishibeikejie/zat-dsh-engine',
  'beancookie/awesome-dsh-plugin',
  'Vengisk/deepseek-harness-termux',
  'zzszmyf/dsh-security-pocs',
  'HenryZ838978/deepseek-harness',
  'Lyowisee/deepseek-harness'
)

$headsFile = Join-Path $dl '_heads.tsv'
$logFile = Join-Path $dl '_download.log'
if ($Slice -gt 0 -and $Slices -gt 1) {
  $headsFile = Join-Path $dl ("_heads.s{0}.tsv" -f $Slice)
  $logFile = Join-Path $dl ("_download.s{0}.log" -f $Slice)
  # 注意: 切片数学必须先算进变量再传给 Select-Object——PS 5.1 会把裸的 [Math]::Ceiling(...)
  # 当成字符串参数导致绑定失败(切片失效, 多进程重跑全量互相踩踏, 08-15 真实踩坑)。
  $sliceSize = [Math]::Ceiling($repos.Count / $Slices)
  $sliceStart = ($Slice - 1) * $sliceSize
  $repos = @($repos | Select-Object -Skip $sliceStart -First $sliceSize)
}
$heads = @{}
if ((Test-Path $headsFile) -and -not $Force) {
  Get-Content $headsFile -Encoding UTF8 | ForEach-Object {
    if ($_ -match '^(.+)\t(.+)$') { $heads[$matches[1]] = $matches[2] }
  }
}

$log = New-Object System.Collections.Generic.List[string]
foreach ($r in $repos) {
  $owner, $repo = $r -split '/'
  $repoDir = Join-Path $dl $repo
  # -OnlyMissing: 只补清单中本地缺失的仓库（已有目录跳过下载；仍会探测 ETag 写入 heads，便于后续增量刷新）。
  $exists = (Test-Path $repoDir) -and (Get-ChildItem $repoDir -File -ErrorAction SilentlyContinue)
  if ($OnlyMissing -and $exists -and -not $Force) {
    $hdr2 = & $curl -sI --connect-timeout 10 --max-time 30 "https://codeload.github.com/$r/tar.gz/HEAD" 2>&1 | Out-String
    if ($hdr2 -match '(?i)^etag:\s*"?W/?\s*"?([0-9a-fA-F]+)"?') { $heads[$r] = $matches[1]; $log.Add("KEEP`t$r`tlocal-exists") }
    else { $log.Add("KEEP`t$r`tlocal-exists(etag-probe-miss)") }
    continue
  }
  # 全部走 curl + codeload（后台沙箱对 git 进程的对外连接不稳定，curl 带 connect/max 超时最可靠）。
  # 刷新标记用 codeload 的 ETag（内容变更即变化）：分支探测 main -> master -> HEAD 三级回退。
  $branch = ''
  $etag = ''
  foreach ($cand in @('refs/heads/main','refs/heads/master','HEAD')) {
    $hdr = & $curl -sI --connect-timeout 10 --max-time 40 "https://codeload.github.com/$r/tar.gz/$cand" 2>&1 | Out-String
    if ($hdr -match 'HTTP/\S+\s+200') {
      $branch = $cand
      # 弱 ETag 形如 W/"abc..."：正则跳过 W/ 前缀，完整捕获引号内十六进制值。
      # 修复: 旧正则把 "W" 当成 etag（弱 ETag 时 Substring(0,12) 抛越界异常，heads 记录损坏）。
      if ($hdr -match '(?i)^etag:\s*"?W/?\s*"?([0-9a-fA-F]+)"?') { $etag = $matches[1] }
      break
    }
  }
  if (-not $branch) { $log.Add("FAIL`t$r`thead-request-failed(404?)"); continue }
  $etagShort = $etag
  if ($etagShort.Length -gt 12) { $etagShort = $etagShort.Substring(0, 12) }
  $downloaded = (Test-Path $repoDir) -and (Get-ChildItem $repoDir -File -ErrorAction SilentlyContinue)
  if (-not $Force -and $downloaded -and $heads.ContainsKey($r) -and $etag -and $heads[$r] -eq $etag) {
    $log.Add("SKIP`t$r`tup-to-date@$etagShort"); continue
  }
  $tgz = Join-Path $dl ("$repo.tar.gz")
  $code = & $curl -sS -L --retry 2 --retry-delay 2 --connect-timeout 10 --max-time 180 -o $tgz -w '%{http_code}' "https://codeload.github.com/$r/tar.gz/$branch" 2>&1
  if ($code -match '^2' -and (Test-Path $tgz) -and (Get-Item $tgz).Length -gt 1024) {
    $tmp = Join-Path $dl ("_$repo")
    if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
    New-Item -ItemType Directory -Force -Path $tmp | Out-Null
    & $tar -xzf $tgz -C $tmp 2>&1 | Out-Null
    $extracted = Get-ChildItem $tmp -Directory | Select-Object -First 1
    if ($extracted) {
      if (Test-Path $repoDir) { Remove-Item $repoDir -Recurse -Force }
      Move-Item $extracted.FullName $repoDir
      Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
      $n = (Get-ChildItem $repoDir -Recurse -File | Measure-Object).Count
      $heads[$r] = $etag
      $log.Add("OK`t$r`tbranch=$branch`tfiles=$n`tetag=$etagShort")
    } else { $log.Add("FAIL`t$r`textract-empty") }
  } else { $log.Add("FAIL`t$r`thttp=$code") }
  if (Test-Path $tgz) { Remove-Item $tgz -Force }
}
$heads.GetEnumerator() | Sort-Object Key | ForEach-Object { "{0}`t{1}" -f $_.Key, $_.Value } | Set-Content $headsFile -Encoding UTF8
$log | Set-Content $logFile -Encoding UTF8
Write-Output ('DONE: ' + $log.Count + ' repos -> ' + $logFile)
$log | Write-Output
