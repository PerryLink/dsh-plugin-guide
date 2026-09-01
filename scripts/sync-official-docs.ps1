# dsh-plugin-guide official-docs sync script.
# Purpose: sync the deepseek-harness checkout's official docs into references/official-docs/ (verbatim copy).
# Source is pinned to origin/master (HEAD fallback): untracked drafts and unpushed commits in the checkout never enter the KB.
# Output: references/official-docs/SNAPSHOT.md (source ref/SHA, sync time, file counts - the freshness authority for READMEs).
# Usage:  pwsh -File scripts/sync-official-docs.ps1 [-Checkout <path>] [-SkipGit]
# Verify: pwsh -File scripts/verify-kit.ps1 -Checkout <path>   # drift report KB vs checkout (tracked files only)
param(
  [string]$Checkout = 'D:\deepseek-harness',
  [switch]$SkipGit
)
$ErrorActionPreference = 'Stop'
$kit  = Split-Path $PSScriptRoot -Parent
$dest = Join-Path $kit 'references\official-docs'

if (-not (Test-Path $Checkout)) { Write-Error "checkout not found: $Checkout"; exit 1 }

$gitOk = $false
if (-not $SkipGit) {
  $gitOk = (& git -C $Checkout rev-parse --is-inside-work-tree 2>$null) -eq 'true'
}

$ref = 'filesystem'
$sha = ''
$pruned = 0
$mdCount = 0
$zhCount = 0

# Sync scope: docs/, root AGENTS.md/BENCHMARK.md/CLAUDE.md/CONTRIBUTING.*/README.zh.md/README.i18n.yaml/THIRD_PARTY_NOTICES.md/LICENSE, packages/AGENTS.md, packages/README.md, vendor/README.md, website/docs.ts
# Upstream root README.md is out of scope: official-docs/README.md is the KB-owned index (the upstream English README snapshot lives in downloads/github/harness/README.md).
# Every pathspec uses the :(top) anchor so git's basename-wide matching cannot sweep in same-named symlinks (e.g. the various CLAUDE.md files).
$paths = @(':(top)docs', ':(top)AGENTS.md', ':(top)BENCHMARK.md', ':(top)CONTRIBUTING.md', ':(top)CONTRIBUTING.zh.md', ':(top)CONTRIBUTING.i18n.yaml', ':(top)README.zh.md', ':(top)README.i18n.yaml', ':(top)THIRD_PARTY_NOTICES.md', ':(top)LICENSE', ':(top)packages/AGENTS.md', ':(top)packages/README.md', ':(top)vendor/README.md', ':(top)website/docs.ts')

if ($gitOk) {
  # Prefer origin/master, fall back to HEAD - never the working tree (may contain untracked/unpushed content).
  if ((& git -C $Checkout rev-parse --verify -q origin/master 2>$null)) { $ref = 'origin/master' } else { $ref = 'HEAD' }
  $sha = (& git -C $Checkout rev-parse $ref).Trim()

  $tmp = Join-Path ([System.IO.Path]::GetTempPath()) ("dsh-official-docs-$sha.tar")
  Remove-Item $tmp -Force -ErrorAction SilentlyContinue
  & git -C $Checkout archive -o $tmp $ref -- $paths
  if ($LASTEXITCODE -ne 0) { Write-Error "git archive failed (ref=$ref)"; exit 1 }

  New-Item -ItemType Directory -Force -Path $dest | Out-Null
  # Verbatim copy: clear the destination before extracting (keep only the KB-owned index README.md,
  # which is unrelated to upstream), so structural residue from older snapshots (e.g. a top-level
  # .agents/ directory from a previous tree) cannot interfere with the extraction.
  Get-ChildItem -Force $dest | Where-Object { $_.Name -ne 'README.md' } | ForEach-Object {
    Remove-Item $_.FullName -Recurse -Force; $pruned++
  }
  & tar -xf $tmp -C $dest
  if ($LASTEXITCODE -ne 0) { Write-Error 'tar extraction failed'; exit 1 }
  Remove-Item $tmp -Force

  # CLAUDE.md is a symlink upstream (target AGENTS.md, mode 120000); Windows tar cannot extract
  # symlinks, and the 'CLAUDE.md' pathspec would basename-match same-named symlinks deeper in the
  # repo, so it stays out of $paths - after extraction its target text lands as a plain file
  # (content = the upstream blob text).
  $claudeTarget = (& git -C $Checkout cat-file -p "${ref}:CLAUDE.md" 2>$null | Select-Object -First 1)
  if (-not $claudeTarget) { $claudeTarget = 'AGENTS.md' }
  Set-Content -Path (Join-Path $dest 'CLAUDE.md') -Value $claudeTarget -Encoding UTF8

  # website/docs.ts keeps its in-repo filename in the archive; move it to the KB's flat name.
  if (Test-Path (Join-Path $dest 'website\docs.ts')) {
    Copy-Item (Join-Path $dest 'website\docs.ts') (Join-Path $dest 'website-docs.ts') -Force
    Remove-Item (Join-Path $dest 'website\docs.ts') -Force
    Remove-Item (Join-Path $dest 'website') -Force -Recurse -ErrorAction SilentlyContinue
  }

  # Keep only in-scope entries at the destination root (drops stale extraction residue and
  # upstream-deleted root files so the copy stays verbatim).
  $rootKeep = @('docs','examples','packages','vendor','AGENTS.md','BENCHMARK.md','CLAUDE.md','CONTRIBUTING.md','CONTRIBUTING.zh.md','CONTRIBUTING.i18n.yaml','LICENSE','README.zh.md','README.i18n.yaml','THIRD_PARTY_NOTICES.md','SNAPSHOT.md','README.md','website-docs.ts')
  Get-ChildItem -Force $dest | Where-Object { $rootKeep -notcontains $_.Name } | ForEach-Object {
    Remove-Item $_.FullName -Recurse -Force; $pruned++
  }
  foreach ($sub in @('examples','packages','vendor')) {
    $subDir = Join-Path $dest $sub
    if (Test-Path $subDir) {
      $subKeep = @()
      if ($sub -eq 'examples') { $subKeep = @('AGENTS.md') }
      if ($sub -eq 'packages') { $subKeep = @('AGENTS.md','README.md') }
      if ($sub -eq 'vendor')   { $subKeep = @('README.md') }
      Get-ChildItem -Force -Directory $subDir -ErrorAction SilentlyContinue | ForEach-Object {
        Remove-Item $_.FullName -Recurse -Force; $pruned++
      }
      Get-ChildItem -Force -File $subDir -ErrorAction SilentlyContinue | Where-Object { $subKeep -notcontains $_.Name } | ForEach-Object {
        Remove-Item $_.FullName -Force; $pruned++
      }
    }
  }

  # Prune docs/ files that no longer exist in the source ref (a verbatim copy does not keep upstream-deleted content).
  $tracked = New-Object System.Collections.Generic.HashSet[string]
  foreach ($t in (& git -C $Checkout ls-tree -r --name-only $ref -- docs)) { [void]$tracked.Add($t.Replace('\','/')) }
  $docsDir = Join-Path $dest 'docs'
  if (Test-Path $docsDir) {
    $docsRoot = (Resolve-Path $docsDir).Path
    Get-ChildItem -Recurse -File $docsDir | ForEach-Object {
      $rel = 'docs/' + $_.FullName.Substring($docsRoot.Length + 1).Replace('\','/')
      if (-not $tracked.Contains($rel)) { Remove-Item $_.FullName -Force; $pruned++ }
    }
  }
} else {
  Write-Output 'WARN: checkout is not a git repo (or -SkipGit) - copying the filesystem as-is; untracked files are not filtered and no pruning runs.'
  foreach ($p in $paths) {
    $rel = $p -replace '^:\(top\)',''   # strip the pathspec anchor to get the in-repo relative path
    $srcFull = Join-Path $Checkout ($rel -replace '/','\')
    if (-not (Test-Path $srcFull)) { Write-Output "SKIP(source missing): $rel"; continue }
    $target = Join-Path $dest ($rel -replace '/','\')
    $tdir = Split-Path $target -Parent
    if ($tdir -and -not (Test-Path $tdir)) { New-Item -ItemType Directory -Force -Path $tdir | Out-Null }
    Copy-Item $srcFull $target -Recurse -Force
  }
}

$mdCount = (Get-ChildItem -Recurse -File (Join-Path $dest 'docs') -Filter *.md).Count
$zhCount = (Get-ChildItem -Recurse -File (Join-Path $dest 'docs') -Filter *.zh.md).Count
$utc = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
$L = @(
  '# official-docs snapshot (SNAPSHOT.md)',
  '',
  '> Generated by `scripts/sync-official-docs.ps1`. This file is the single authority for how `references/official-docs/` lines up with upstream deepseek-harness.',
  '> The "last verified" dates and commit SHAs in README/guide must cite this file; do not hand-edit them.',
  '',
  '| Item | Value |',
  '|---|---|',
  "| Source checkout | ``$Checkout`` |",
  "| Source ref | ``$ref`` |",
  "| Source commit | ``$sha`` |",
  "| Synced at (UTC) | $utc |",
  '| Scope | tracked files at the ref: `docs/`, root `AGENTS.md`, `BENCHMARK.md`, `CLAUDE.md` (symlink target text), `CONTRIBUTING.md`/`.zh.md`/`.i18n.yaml`, `README.zh.md`/`.i18n.yaml` (the upstream English `README.md` is not in this dir; its snapshot lives in `downloads/github/harness/README.md`), `THIRD_PARTY_NOTICES.md`, `LICENSE`, `packages/AGENTS.md`, `packages/README.md`, `vendor/README.md`, `website/docs.ts` |',
  "| File counts | docs/: $mdCount md files ($zhCount .zh.md pairs) |",
  "| Pruned this run | $pruned out-of-scope/upstream-deleted entries |",
  '',
  'Drift check: `pwsh -File scripts/verify-kit.ps1 -Checkout <checkout>` (tracked files only).'
)
Set-Content -Path (Join-Path $dest 'SNAPSHOT.md') -Value ($L -join "`r`n") -Encoding UTF8

Write-Output "DONE: ref=$ref sha=$sha pruned=$pruned -> $dest"
