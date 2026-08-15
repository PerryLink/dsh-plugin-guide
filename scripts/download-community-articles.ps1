# dsh-plugin-guide 社区文章归档脚本（幂等：已存在且非空则跳过）
# 输出: downloads/web/community-articles/{zh,en,hn}/<slug>.html + _download.log + README.md
# 来源: downloads/_research/{chinese,english}-community-scan.md 中标 200 的 URL + 08-15 增量扫描线索。
#   已知反爬站(知乎/InfoQ/venturebeat/thenextweb/twitter/youtube/reddit/腾讯新闻 501 等)不在清单内,记录见两份扫描报告。
# 注意: PS 5.1 下 curl 的 -A/-o 参数若经变量数组传入会被拆词;本脚本用 Invoke-Expression
#   拼完整命令行字符串,引号在字符串内显式给出,规避该坑。
# 参数: -Force 强制全部重下; -Lang zh|en|hn 只处理某语言段。
param([switch]$Force, [string]$Lang = '')
$ErrorActionPreference = 'Continue'
$ProgressPreference = 'SilentlyContinue'

$kb = Split-Path $PSScriptRoot -Parent
$out = Join-Path $kb 'downloads\web\community-articles'
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
$curl = Get-Command curl.exe -ErrorAction SilentlyContinue
if (-not $curl) { $curl = "$env:SystemRoot\System32\curl.exe" } else { $curl = $curl.Source }

# slug => url(语言段前缀 zh:/en:/hn: 决定落盘目录)
$list = @(
  # ---------- zh ----------
  'zh:cnblogs-pc2005-npm-publish = https://www.cnblogs.com/pc2005/p/22477987',
  'zh:cnblogs-qq8864-session-export = https://www.cnblogs.com/qq8864/articles/22476471',
  'zh:cnblogs-qq8864-plugin-vs-tool = https://www.cnblogs.com/qq8864/articles/22478648',
  'zh:csdn-yuqingteck-hello-tool = https://yuqingteck.blog.csdn.net/article/details/163735126',
  'zh:cnblogs-sing1ee-agent-loop = https://www.cnblogs.com/sing1ee/p/22479295',
  'zh:cnblogs-sing1ee-guide = https://www.cnblogs.com/sing1ee/p/22455466',
  'zh:cnblogs-knqiufan-context = https://www.cnblogs.com/knqiufan/p/22472410',
  'zh:cnblogs-foxcharon-install = https://www.cnblogs.com/foxcharon/p/22467976',
  'zh:cnblogs-pc2005-getting-started = https://www.cnblogs.com/pc2005/p/22477984',
  'zh:cnblogs-adgine-ai-engineering = https://www.cnblogs.com/adgine-ai/articles/22473232',
  'zh:cnblogs-itech-architecture = https://www.cnblogs.com/itech/p/22460843',
  'zh:cnblogs-isLinXu-analysis = https://www.cnblogs.com/isLinXu/p/22457058',
  'zh:csdn-damodev-monorepo = https://damodev.csdn.net/6a7dd787662f9a54cb9c6da0.html',
  'zh:51cto-v4pro-runtime = https://www.51cto.com/article/852965.html',
  'zh:51cto-blog-observability = https://blog.51cto.com/u_16175471/14797309',
  'zh:aliyun-first-tutorial = https://developer.aliyun.com/article/1755786',
  'zh:aliyun-everything-plugin = https://developer.aliyun.com/article/1755877',
  'zh:bibigpt-skill-video = https://bibigpt.co/zh/blog/posts/deepseek-harness-skill-ai-video-summary',
  'zh:aixq-visual-tutorial = https://www.aixq.cc/62178.html',
  'zh:qbitai-review = https://www.qbitai.com/2026/08/472208.html',
  'zh:zhidx-review = https://www.zhidx.com/p/584897.html',
  'zh:pingwest-review = https://www.pingwest.com/a/316436',
  'zh:dtinsight-review = https://www.dtinsight.com.cn/sys-nd/4072.html',
  'zh:v2ex-1234341-quickref = https://global.v2ex.co/t/1234341',
  'zh:v2ex-1234203 = https://global.v2ex.co/t/1234203',
  'zh:v2ex-1234320-tools-limit = https://global.v2ex.co/t/1234320',
  'zh:v2ex-1234424-shell = https://global.v2ex.co/t/1234424',
  'zh:v2ex-1234521-v4flash = https://global.v2ex.co/t/1234521',
  'zh:v2ex-1231389-pre-release = https://global.v2ex.co/t/1231389',
  'zh:v2ex-1214141-hiring = https://global.v2ex.co/t/1214141',
  'zh:36kr-black-whale = https://www.36kr.com/p/3938566998834308',
  'zh:jiemian-lego = https://www.jiemian.com/article/14922169.html',
  'zh:80aj-doc-reader = https://www.80aj.com/2026/08/14/agent-doc-reader-plugin/',
  'zh:80aj-vscode-search = https://www.80aj.com/2026/08/14/deepseek-vscode-plugin-search/',
  'zh:locdd-80299 = https://locdd.com/t/topic/80299/7',
  'zh:locdd-80207 = https://locdd.com/t/topic/80207',
  'zh:53ai-first-test = https://www.53ai.com/news/LargeLanguageModel/2026081423497.html',
  'zh:53ai-plugin-tutorial-0815 = https://www.53ai.com/news/OpenSourceLLM/2026081561375.html',
  'zh:csdn-zhuosj-black-whale = https://zhuosj.blog.csdn.net/article/details/163757323',
  'zh:csdn-aiutools-install = https://aiutools.blog.csdn.net/article/details/163758630',
  'zh:csdn-qq8864-plugin-tool = https://blog.csdn.net/qq8864/article/details/163760812',
  'zh:163-architecture = https://www.163.com/dy/article/L4AHS9B70518R7MO.html',
  'zh:163-install-tutorial = https://www.163.com/dy/article/L4AUJ7A305568W0A.html',
  'zh:qq-news-hot = https://news.qq.com/rain/a/20260814A048HD00',
  'zh:csdnnews-28k-star = https://csdnnews.blog.csdn.net/article/details/163747298',
  'zh:geekpark-50k = https://w.geekpark.net/news/368809',
  'zh:pedaily-investment = https://news.pedaily.cn/202608/567694.shtml',
  'zh:weibo-beta-share = https://weibo.com/2/detail/5331613565062839',
  'zh:csdn-aicoding-roles = https://aicoding.csdn.net/6a23863d662f9a54cb7a4fed.html',
  'zh:aitop100-v01 = https://www.aitop100.cn/infomation/details/34468.html',
  'zh:bilibili-BV1WmgF6qEMn = https://www.bilibili.com/video/BV1WmgF6qEMn/',
  'zh:bilibili-BV1iAgc6xEj7 = https://www.bilibili.com/video/BV1iAgc6xEj7/',
  'zh:bilibili-BV1KFgF6zEtk = https://www.bilibili.com/video/BV1KFgF6zEtk/',
  'zh:bilibili-BV1NKgw6VErB = https://www.bilibili.com/video/BV1NKgw6VErB/',
  'zh:bilibili-BV1o4gP6iEeo = https://www.bilibili.com/video/BV1o4gP6iEeo/',
  'zh:bilibili-BV1vugA6FERZ = https://www.bilibili.com/video/BV1vugA6FERZ/',
  'zh:bilibili-BV1VkgK6NEZS = https://www.bilibili.com/video/BV1VkgK6NEZS/',
  'zh:bilibili-BV1eDgW6QEFx = https://www.bilibili.com/video/BV1eDgW6QEFx/',
  'zh:bilibili-BV17ygc6tEE1 = https://www.bilibili.com/video/BV17ygc6tEE1/',
  'zh:21jingji-jiazi = https://www.21jingji.com/article/20260521/herald/d706e7b6130739114b8761d933f7e546.html',
  'zh:21jingji-wechat = https://m.21jingji.com/article/20260813/b78d3f9cd177ec3974c227ca1e9f7672.html',
  'zh:ithome-beta-plugins = https://www.ithome.com/0/989/446.htm',
  'zh:ai-indeed-timeline = https://www.ai-indeed.com/encyclopedia/29653.html',
  'zh:yijunzhao-guide = https://yijunzhao.cn/archives/deepseek-harness-getting-started-guide-first-agent-framework',
  'zh:gm7-install = https://www.gm7.org/archives/141339',
  'zh:zol-v01 = https://ai.zol.com.cn/1231/12318730.html',
  'zh:thepaper-three = https://www.thepaper.cn/newsDetail_forward_33785032',
  'zh:donews = https://www.donews.com/news/detail/1/6670751.html',
  'zh:chinaz-plugin = https://www.chinaz.com/ainews/30334.shtml',
  'zh:wsisp-80k = https://www.wsisp.com/helps/94702.html',
  'zh:eastmoney-black-whale = https://finance.eastmoney.com/a/202608123839370860.html',
  'zh:sina-whale = https://www.sina.cn/news/detail/5331578031178880.html',
  'zh:sina-wechat-account = https://www.sina.cn/news/detail/5331415036067930.html',
  'zh:tmtpost-beta = https://www.tmtpost.com/8083615.html',
  'zh:aihot-community = https://aihot.virxact.com/items/cmst6pn4b06aqro06xbl1wusy',
  'zh:aihot-openrouter-ori = https://aihot.virxact.com/items/cmstacm1202dzro0xv735yk7c',
  'zh:chaincatcher-beta = https://www.chaincatcher.com/article/2278625',
  'zh:baijing-harness = https://jishuzhan.baijing.cn/article/3251',
  'zh:sohu-28k = https://www.sohu.com/a/1062527577_115128',
  'zh:locdd-80821-qqbot = https://locdd.com/t/topic/80821',
  # ---------- en ----------
  'en:rits-cordis = http://rits.shanghai.nyu.edu/ai/deepseek-harness-cordis-everything-is-a-plugin/',
  'en:devto-onsen-guide = https://dev.to/onsen/deepseek-harness-developer-preview-full-guide-ocm',
  'en:devto-reidmarlow-price = https://dev.to/reidmarlow/deepseeks-harness-is-the-price-signal-17bl',
  'en:agentpedia-v01 = https://agentpedia.codes/blog/deepseek-harness-v0-1-plugin-agent-guide',
  'en:explainx = https://explainx.ai/blog/deepseek-harness-v0-1-plugin-first-agent-stack-august-2026',
  'en:agentbreaking = https://agentbreaking.com/blog/deepseek-harness-open-source-agent-framework/',
  'en:xcmd-install = https://www.x-cmd.com/install/deepseek-harness/',
  'en:dsh-index = https://dsh-index.xlings.org',
  'en:xlings-dsh = https://openxlings.github.io/xim-pkgindex/en/packages/dsh/',
  'en:36kr-en-minecraft = https://eu.36kr.com/en/p/3938774780263814',
  'en:36kr-en-blackwhale = https://eu.36kr.com/en/p/3938566998834308',
  'en:36kr-en-selfevolution = https://eu.36kr.com/en/p/3938795963137411',
  'en:ollama-integration = https://docs.ollama.com/integrations/deepseek-harness',
  'en:aiengineerguide = https://aiengineerguide.com/til/deepseek-harness/',
  'en:julian-goldie = https://aisuccesslabjuliangoldie.com/blog/deepseek-harness/',
  'en:gigazine-en = https://gigazine.net/gsc_news/en/20260814-deepseek-harness-v0-1',
  'en:aibase-en = https://www.aibase.com/news/30334',
  'en:pandaily-preview = https://pandaily.com/deepseek-harness-developer-preview-everything-is-a-plugin-black-whale-aug2026',
  'en:edgen-300plugins = https://www.edgen.tech/en/news/post/deepseek-harness-enters-agent-market-with-300-plugins-challenging-codex',
  'en:tmtpost-en = https://en.tmtpost.com/news/7995741',
  'en:pandaily-funding = https://pandaily.com/deepseek-funding-expansion-hiring-harness',
  'en:essamamdani = https://essamamdani.com/blog/deepseek-harness-plugin-first-agent-stack-2026',
  'en:openrouter-ori = https://openrouter.ai/docs/guides/ori/harness',
  'en:digg-webui-x = https://digg.com/tech/7fx4ofvh',
  'en:digg-devs-beta = https://digg.com/tech/silt5bft',
  'en:news-eink = https://news.e-ink.me/en/archive/2026-08-13/article/deepseek-harness-developer-preview',
  'en:tipranks-openrouter = https://fastly.tipranks.com/news/private-companies/openrouter-expands-ai-model-orchestration-with-ori-deepseek-harness-integration',
  'en:webgate-mit = https://web.gate.it/zh/news/detail/deepseek-open-sources-harness-v01-under-the-mit-license-rivaling-claude-23440280',
  'en:blockbeats-v4pro = https://en.theblockbeats.news/flash/361500',
  # ---------- hn ----------
  'hn:49286003-cordis = https://hn.edgecompute.app/item/49286003',
  'hn:49287821-xcmd = https://hn.edgecompute.app/item/49287821',
  'hn:49294357-dshindex = https://hn.edgecompute.app/item/49294357',
  'hn:49291049-xlings = https://hn.edgecompute.app/item/49291049',
  'hn:49291893-jellyball = https://hn.edgecompute.app/item/49291893',
  'hn:49285244-main = https://hn.edgecompute.app/item/49285244',
  'hn:49285620-twitter-post = https://hn.edgecompute.app/item/49285620'
)

$log = New-Object System.Collections.Generic.List[string]
$counts = @{}
foreach ($entry in $list) {
  $lang, $rest = $entry -split ':', 2
  $slug, $url = $rest -split '=', 2
  $slug = $slug.Trim(); $url = $url.Trim()
  if ($Lang -and $lang -ne $Lang) { continue }
  $dir = Join-Path $out $lang
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  $file = Join-Path $dir ($slug + '.html')
  if (-not $Force -and (Test-Path $file) -and (Get-Item $file).Length -gt 500) {
    $log.Add("SKIP`t$lang/$slug"); continue
  }
  $cmd = "& '$curl' -sSL --connect-timeout 10 --max-time 30 -A `"$ua`" -o `"$file`" `"$url`""
  try { Invoke-Expression $cmd | Out-Null } catch { $log.Add("FAIL`t$lang/$slug`tinvoke-error"); continue }
  if (Test-Path $file) {
    $len = (Get-Item $file).Length
    if ($len -gt 500) { $log.Add("OK`t$lang/$slug`t$len bytes") }
    else { Remove-Item $file -Force; $log.Add("FAIL`t$lang/$slug`ttoo-small($len)") }
  } else { $log.Add("FAIL`t$lang/$slug`tno-file") }
}
foreach ($l in @('zh','en','hn')) {
  $d = Join-Path $out $l
  if (Test-Path $d) { $counts[$l] = (Get-ChildItem $d -Filter *.html -File).Count }
}
$log | Set-Content (Join-Path $out '_download.log') -Encoding UTF8

$utc = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mmZ')
$L = @()
$L += '# 社区文章归档（HTML 快照）'
$L += ''
$L += "> 抓取: $utc (UTC) via scripts/download-community-articles.ps1（幂等，-Force 全量重下）。"
$L += '> 反爬/需浏览器站点(知乎/InfoQ/venturebeat/TNW/Twitter/YouTube/Reddit 等)不在清单,线索见 downloads/_research/*-community-scan.md。'
$L += ''
$L += '| 语言段 | 篇数 |'
$L += '|---|---|'
foreach ($l in @('zh','en','hn')) { $L += "| $l/ | $($counts[$l]) |" }
$L += ''
$L += '## 归档明细'
$L += ''
$L += '见 _download.log（OK/SKIP/FAIL + 字节数）。'
Set-Content -Path (Join-Path $out 'README.md') -Value ($L -join "`r`n") -Encoding UTF8
Write-Output ("DONE: zh={0} en={1} hn={2} -> {3}" -f $counts['zh'], $counts['en'], $counts['hn'], $out)
$log | Write-Output
