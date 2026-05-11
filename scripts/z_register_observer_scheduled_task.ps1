#Requires -Version 5.1
<#
.SYNOPSIS
  Register a daily Windows Scheduled Task that runs the observer + Watchdog append.

.NOTES
  Run once from an elevated PowerShell if Register-ScheduledTask fails without admin.
  Adjust -At time below to your preference.
#>

$ErrorActionPreference = "Stop"

$taskName = "Z-EAII-Universe-CrossProject-Observer"
$scriptPath = Join-Path $PSScriptRoot "z_scheduled_observer_watchdog.ps1"
if (-not (Test-Path -LiteralPath $scriptPath)) {
  throw "Missing runner: $scriptPath"
}

$arg = "-NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`""
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument $arg
$trigger = New-ScheduledTaskTrigger -Daily -At "06:30"
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive

$existing = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existing) {
  Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

Register-ScheduledTask `
  -TaskName $taskName `
  -Action $action `
  -Trigger $trigger `
  -Settings $settings `
  -Principal $principal `
  -Description "Runs ZSanctuary_Universe npm run monitor:cross-project; appends Z-EAII-Watchdog.log"

Write-Host "Registered: $taskName (daily 06:30, logon interactive as $env:USERNAME)"
