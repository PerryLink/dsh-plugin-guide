# dsh-plugin-guide official-docs freshness probe.
# Purpose: detect drift between the KB mirror (references/official-docs) and the
#   upstream deepseek-harness repository WITHOUT a local checkout. It compares the
#   upstream branch tip SHA (git ls-remote) against the pinned "Source commit" SHA
#   recorded in references/official-docs/SNAPSHOT.md — the SHA-locked authority the
#   mirror was synced from. It never edits the mirror; drift is only reported.
# Usage:  pwsh -File scripts/check-docs-drift.ps1 [-Repo <url>] [-Branch <name>] [-Snapshot <path>] [-FailOnDrift]
#   Exit codes: 0 = FRESH, 1 = DRIFT (with -FailOnDrift), 2 = probe could not run (snapshot/parse/fetch failure).
#   In CI it also writes `drift=yes|no|error` to $env:GITHUB_OUTPUT when that variable is set.
param(
  [string]$Repo = 'https://github.com/deepseek-ai/deepseek-harness.git',
  [string]$Branch = 'master',
  [string]$Snapshot = 'references/official-docs/SNAPSHOT.md',
  [switch]$FailOnDrift
)
$ErrorActionPreference = 'Stop'
$kit = Split-Path $PSScriptRoot -Parent
$snapshotPath = Join-Path $kit $Snapshot

# ---- 1) Read the pinned source commit SHA from SNAPSHOT.md ----
$pinned = $null
if (-not (Test-Path $snapshotPath)) { Write-Error "snapshot not found: $snapshotPath"; exit 2 }
foreach ($line in Get-Content $snapshotPath -Encoding UTF8) {
  if ($line -match '^\|\s*Source commit\s*\|\s*`([0-9a-f]{40})`\s*\|') {
    $pinned = $Matches[1]
    break
  }
}
if (-not $pinned) { Write-Error "cannot parse the pinned 'Source commit' SHA from $Snapshot"; exit 2 }

# ---- 2) Fetch the upstream branch tip SHA (no clone required) ----
$remoteLine = (& git ls-remote $Repo "refs/heads/$Branch" 2>$null | Select-Object -First 1)
if (-not $remoteLine -or $remoteLine -notmatch '^([0-9a-f]{40})\s') {
  $message = "cannot reach upstream $Repo (branch $Branch)"
  Write-Output "ERROR: $message"
  if ($env:GITHUB_OUTPUT) { Add-Content -Path $env:GITHUB_OUTPUT -Value 'drift=error' }
  exit 2
}
$upstream = $Matches[1]

# ---- 3) Compare and report ----
$fresh = ($upstream -eq $pinned)
Write-Output "pinned (SNAPSHOT.md): $pinned"
Write-Output "upstream ($Branch): $upstream"
if ($fresh) {
  Write-Output 'FRESH: references/official-docs matches the upstream branch tip'
} else {
  Write-Output "DRIFT: references/official-docs is pinned to $pinned but upstream is at $upstream"
  Write-Output 'Action: run  pwsh -File scripts/sync-official-docs.ps1  to refresh the mirror (do not hand-edit the mirror).'
}
if ($env:GITHUB_OUTPUT) {
  Add-Content -Path $env:GITHUB_OUTPUT -Value ($(if ($fresh) { 'drift=no' } else { 'drift=yes' }))
}
if (-not $fresh -and $FailOnDrift) { exit 1 }
exit 0
