#requires -Version 5.1
<#
  Z-VDK — Render markdown summary from z_vdk_scan_report.json (read-only; writes one .md only).
#>
$ErrorActionPreference = 'Stop'

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$InJson = Join-Path $RepoRoot 'data\reports\z_vdk_scan_report.json'
$OutMd = Join-Path $RepoRoot 'data\reports\z_vdk_scan_report.md'

if (-not (Test-Path -LiteralPath $InJson)) {
  @"
# Z-VDK scan report

**Status:** No JSON yet. Run ``npm run vdk:scan`` or ``.\scripts\powershell\z_vdk_scan.ps1`` from the repo.

Generated: $( (Get-Date).ToUniversalTime().ToString('o') ) UTC
"@ | Set-Content -LiteralPath $OutMd -Encoding utf8
  Write-Host "Wrote placeholder (no JSON): $OutMd" -ForegroundColor Yellow
  exit 0
}

$j = Get-Content -LiteralPath $InJson -Raw -Encoding UTF8 | ConvertFrom-Json
$ts = if ($j.generated_at) { [string]$j.generated_at } else { 'unknown' }
$ver = if ($j.schema_version) { $j.schema_version } else { '0' }
$safety = if ($j.safety) { $j.safety } else { 'READ_ONLY_PHASE1' }

$roots = if ($j.scan_roots) {
  ($j.scan_roots | ForEach-Object { "- ``$_``" }) -join "`n"
} else { '_None._' }

$wrn = if ($j.warnings -and @($j.warnings).Count -gt 0) {
  ($j.warnings | ForEach-Object { "- $_" }) -join "`n"
} else { '_None._' }

$findRows = [System.Text.StringBuilder]::new()
if ($j.findings -and @($j.findings).Count -gt 0) {
  [void]$findRows.AppendLine('| Risk | Path | Reason | SHA256 (prefix) |')
  [void]$findRows.AppendLine('| --- | --- | --- | --- |')
  foreach ($f in $j.findings) {
    $p = if ($f.path) { $f.path } else { '' }
    $pShort = if ($p.Length -gt 90) { $p.Substring(0, 87) + '...' } else { $p }
    $r = if ($f.risk) { $f.risk } else { '' }
    $rs = if ($f.reason) { ($f.reason -replace '\|', '/') } else { '' }
    $rsShort = if ($rs.Length -gt 120) { $rs.Substring(0, 117) + '...' } else { $rs }
    $h = if ($f.sha256) { $f.sha256.Substring(0, [Math]::Min(16, $f.sha256.Length)) + '…' } else { '—' }
    [void]$findRows.AppendLine("| $r | ``$pShort`` | $rsShort | ``$h`` |")
  }
}
else {
  [void]$findRows.AppendLine('_No findings in this run._')
}

$sum = $j.summary
$st = if ($sum) {
  "**Total files scanned:** $($sum.total_files_scanned) · **Findings:** $($sum.findings_total) (critical: $($sum.critical), high: $($sum.high), medium: $($sum.medium), low: $($sum.low))"
} else { '_No summary._' }

$md = @"
# Z-VDK — Virus Detection & Quarantine Core (Phase 1 summary)

**Schema:** v$ver · **Generated (UTC):** $ts

**Safety:** ``$safety``

## Scan roots

$roots

## Summary

$st

## Findings

$($findRows.ToString().TrimEnd())

## Warnings

$wrn

---

Phase 1 is read-only: no delete, quarantine, process kill, registry, Defender changes, or uploads. See [docs/Z-VDK-VIRUS-DETECTION-QUARANTINE-CORE.md](../../docs/Z-VDK-VIRUS-DETECTION-QUARANTINE-CORE.md).
"@

Set-Content -LiteralPath $OutMd -Value $md.TrimEnd() -Encoding utf8
Write-Host "Wrote $OutMd" -ForegroundColor Cyan
