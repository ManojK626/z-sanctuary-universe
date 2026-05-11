#requires -Version 5.1
<#
  Z-FPSMC — Render markdown summary from z_fpsmc_storage_map.json (read-only; writes one .md only).
#>
$ErrorActionPreference = 'Stop'

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$InJson = Join-Path $RepoRoot 'data\reports\z_fpsmc_storage_map.json'
$OutMd = Join-Path $RepoRoot 'data\reports\z_fpsmc_storage_map.md'

if (-not (Test-Path -LiteralPath $InJson)) {
  @"
# Z-FPSMC storage map (summary)

**Status:** No JSON yet. Run `npm run fpsmc:scan` or `.\scripts\powershell\z_fpsmc_scan.ps1` from the repo.

Generated: $( (Get-Date).ToUniversalTime().ToString('o') ) UTC
"@ | Set-Content -LiteralPath $OutMd -Encoding utf8
  Write-Host "Wrote placeholder (no JSON): $OutMd" -ForegroundColor Yellow
  exit 0
}

$j = Get-Content -LiteralPath $InJson -Raw -Encoding UTF8 | ConvertFrom-Json
$ts = if ($j.generated_at) {
  if ($j.generated_at -is [datetime]) {
    $j.generated_at.ToUniversalTime().ToString('o')
  } else {
    [string]$j.generated_at
  }
} else { 'unknown' }
$ver = if ($j.schema_version) { $j.schema_version } else { '0' }
$rows = [System.Text.StringBuilder]::new()
[void]$rows.AppendLine('| Drive / key | Free (GiB) |')
[void]$rows.AppendLine('| --- | --- |')
if ($j.free_space) {
  $j.free_space.PSObject.Properties | ForEach-Object {
    $gib = [math]::Round([int64]$_.Value / 1GB, 2)
    [void]$rows.AppendLine("| $($_.Name) | $gib |")
  }
} else {
  [void]$rows.AppendLine('| — | n/a |')
}

$wrn = if ($j.warnings -and $j.warnings.Count -gt 0) {
  ($j.warnings | ForEach-Object { "- $_" }) -join "`n"
} else { '_None._' }

$prows = if ($j.project_roots) {
  ($j.project_roots | ForEach-Object {
    $e = if ($_.exists) { 'yes' } else { 'no' }
    $p = if ($_.path) { $_.path } else { '' }
    $id = if ($_.id) { $_.id } else { if ($_.kind) { $_.kind } else { '' } }
    "| $id | ``$p`` | $e |"
  }) -join "`n"
} else { '| — | — | — |' }

$dvCount = 0
if ($j.drives) { $dvCount = @($j.drives).Count }

$md = @"
# Z-FPSMC — Storage map (read-only summary)

**Schema:** v$ver · **Generated (UTC):** $ts

**Safety posture:** $( if ($j.safety) { $j.safety } else { 'READ_ONLY' } )

## Drives (fixed)

Count: **$dvCount**

## Free space (per drive key)

$($rows.ToString().TrimEnd())

## Project roots (from z_pc_root_projects.json)

| Id / kind | Path | Exists |
| --- | --- | --- |
$prows

## Warnings

$wrn

## Container / path hints

$( if ($j.containers -and $j.containers.Count -gt 0) { 'See `z_fpsmc_storage_map.json` for `path_presence` and optional `docker` / `podman` volume list output (read-only).' } else { '_No container metadata._' } )

---

*Z-FPSMC Phase 1 — machine-readable: ``data/reports/z_fpsmc_storage_map.json``*
"@

Set-Content -LiteralPath $OutMd -Value $md.TrimEnd() -Encoding utf8
Write-Host "OK: wrote $OutMd" -ForegroundColor Green
exit 0
