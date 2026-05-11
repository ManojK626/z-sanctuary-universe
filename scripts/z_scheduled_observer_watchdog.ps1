#Requires -Version 5.1
<#
.SYNOPSIS
  Run hub cross-project observer, then append one line to Organiser Z-EAII Watchdog.

.DESCRIPTION
  Intended for Windows Task Scheduler. Schedule:
    Program: powershell.exe
    Arguments: -NoProfile -ExecutionPolicy Bypass -File "C:\Cursor Projects Organiser\ZSanctuary_Universe\scripts\z_scheduled_observer_watchdog.ps1"

  Run as your user account (so npm is on PATH). Daily or on unlock is typical.

.NOTES
  Watchdog format matches Z-EAII discipline:
  [ISO-8601-UTC] | action | project/path | result
#>

$ErrorActionPreference = "Stop"

$universeRoot = Split-Path -Parent $PSScriptRoot
$watchdogPath = "C:\Cursor Projects Organiser\Z-EAII-Watchdog.log"
$action = "npm run monitor:cross-project (scheduled)"
$projectPath = $universeRoot

Set-Location -LiteralPath $universeRoot

try {
  npm run monitor:cross-project
  $code = $LASTEXITCODE
  if ($null -eq $code) { $code = 0 }
} catch {
  $code = 1
}

$ts = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
if ($code -eq 0) {
  $result = "OK - exit 0; report under data/reports/z_cross_project_observer.*"
} else {
  $result = "FAIL - exit $code (see Task Scheduler History / npm log)"
}

$line = "${ts} | ${action} | ${projectPath} | ${result}"
Add-Content -LiteralPath $watchdogPath -Value $line -Encoding utf8

exit $code
