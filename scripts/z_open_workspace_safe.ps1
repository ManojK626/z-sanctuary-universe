#Requires -Version 5.1
<#
.SYNOPSIS
  Z-DOORWAY-2 / Z-DOORWAY-3 — SSWS-safe workspace/folder opener (registry only, dry-run by default).

.DESCRIPTION
  Reads data/z_doorway_workspace_registry.json. Never runs npm install, npm start, deploy,
  git commands, extension installs, daemons, NAS writes, or recursive disk scans.

  Default: dry-run (print plan only). Pass -Apply with explicit -Id to open targets.

  Z-DOORWAY-3: optional local session receipts (JSON Lines) when -Apply and -SessionLog are set.
  Receipts never record registry path strings, secrets, env, tokens, or command output.

.PARAMETER Apply
  Perform opens. Requires -Id (one or more registry entry ids). Max 12 ids per invocation.

.PARAMETER Id
  Registry entry id(s). When -Apply is set, at least one -Id is mandatory.

.PARAMETER Tag
  Optional filter: only entries whose tags contain this string (case-insensitive).

.PARAMETER SessionLog
  With -Apply only: append one JSON line per processed row to data/reports/z_doorway_session_log.jsonl
  (allowed fields per docs/Z_DOORWAY_3_TELEMETRY_POLICY.md).

.NOTES
  Prefer Cursor for workspace and folder. Falls back to VS Code (code) when Cursor is missing.
  Opening a workspace or folder is not running the project.
#>
param(
  [switch] $Apply,
  [string[]] $Id = @(),
  [string] $Tag = '',
  [switch] $SessionLog
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = (Resolve-Path (Join-Path $ScriptDir '..')).Path
$RegistryPath = Join-Path $RepoRoot 'data/z_doorway_workspace_registry.json'

if (-not (Test-Path -LiteralPath $RegistryPath)) {
  throw "Registry not found: $RegistryPath"
}

if ($Apply -and ($null -eq $Id -or $Id.Count -eq 0)) {
  throw 'Dry-run is default. To open, pass -Apply together with -Id <entry_id> (explicit operator-approved targets).'
}

if ($Apply -and $Id.Count -gt 12) {
  throw 'At most 12 -Id values per -Apply batch. Split into multiple invocations.'
}

if ($SessionLog -and -not $Apply) {
  throw '-SessionLog is only valid together with -Apply (dry-run does not write telemetry).'
}

$raw = Get-Content -LiteralPath $RegistryPath -Raw -Encoding UTF8
$data = $raw | ConvertFrom-Json

if ($data.schema -ne 'z_doorway_workspace_registry_v1') {
  throw 'Unexpected registry schema; expected z_doorway_workspace_registry_v1'
}

function Get-CursorExe {
  $cmd = Get-Command cursor -ErrorAction SilentlyContinue
  if ($cmd -and $cmd.Source) { return $cmd.Source }
  $c1 = Join-Path $env:LOCALAPPDATA 'Programs\cursor\Cursor.exe'
  if (Test-Path -LiteralPath $c1) { return $c1 }
  $c2 = Join-Path $env:ProgramFiles 'Cursor\Cursor.exe'
  if (Test-Path -LiteralPath $c2) { return $c2 }
  return $null
}

function Get-VsCodeExe {
  $cmd = Get-Command code -ErrorAction SilentlyContinue
  if ($cmd -and $cmd.Source) { return $cmd.Source }
  $b = Join-Path $env:ProgramFiles 'Microsoft VS Code\Code.exe'
  if (Test-Path -LiteralPath $b) { return $b }
  return $null
}

function Test-PathExists([string]$P) {
  if ([string]::IsNullOrWhiteSpace($P)) { return $false }
  $n = $P.Trim().Replace('/', [System.IO.Path]::DirectorySeparatorChar)
  return Test-Path -LiteralPath $n
}

function Tags-Match {
  param($Entry, [string]$T)
  if ([string]::IsNullOrWhiteSpace($T)) { return $true }
  $tl = $T.Trim().ToLowerInvariant()
  foreach ($g in @($Entry.tags)) {
    if ([string]$g -and ([string]$g).ToLowerInvariant() -eq $tl) { return $true }
  }
  return $false
}

function Get-SkipReason {
  param($Entry)
  if (-not $Entry.enabled) { return 'disabled' }
  $st = [string]$Entry.status
  if ($null -ne $st) { $st = $st.Trim().ToUpperInvariant() }
  if ($st -eq 'RED') { return 'RED' }
  if ($st -eq 'HOLD') { return 'HOLD' }
  if ($st -eq 'NAS_WAIT') { return 'NAS_WAIT' }
  if ($st -ne 'GREEN' -and $st -ne 'YELLOW') { return 'unknown_status' }
  $pref = [string]$Entry.preferred_entry
  if ($pref.Trim().ToLowerInvariant() -eq 'none') { return 'preferred_none' }
  $p = [string]$Entry.path
  if ([string]::IsNullOrWhiteSpace($p)) { return 'empty_path' }
  if (-not (Test-PathExists $p)) {
    if ($Entry.nas_required) { return 'NAS_WAIT_missing_path' }
    return 'missing_path'
  }
  $typ = [string]$Entry.type
  if ($typ.ToLowerInvariant() -eq 'workspace' -and -not $p.ToLowerInvariant().EndsWith('.code-workspace')) {
    return 'workspace_extension'
  }
  return ''
}

function Append-DoorwaySessionReceipt {
  param(
    [string] $LogPath,
    [hashtable] $Record
  )
  $dir = Split-Path -Parent $LogPath
  if (-not (Test-Path -LiteralPath $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
  }
  $json = ([pscustomobject]$Record | ConvertTo-Json -Compress -Depth 8)
  $enc = New-Object System.Text.UTF8Encoding $false
  [System.IO.File]::AppendAllText($LogPath, $json + [Environment]::NewLine, $enc)
}

function Open-OneTarget {
  param([string]$Target, [string]$Preferred, [bool]$DoLaunch)
  $cursor = Get-CursorExe
  $code = Get-VsCodeExe
  if (-not $DoLaunch) {
    Write-Host ("[DRY-RUN] would open: " + $Target + ' (preferred=' + $Preferred + ')')
    return
  }
  $order = @('cursor', 'vscode')
  if ($Preferred -eq 'vscode') { $order = @('vscode', 'cursor') }
  foreach ($p in $order) {
    if ($p -eq 'cursor' -and $cursor) {
      Start-Process -FilePath $cursor -ArgumentList @("`"$Target`"")
      return
    }
    if ($p -eq 'vscode' -and $code) {
      Start-Process -FilePath $code -ArgumentList @("`"$Target`"")
      return
    }
  }
  throw 'Neither Cursor nor VS Code (code) found on PATH / default locations.'
}

$entries = @($data.entries)
$selected = foreach ($e in $entries) {
  if (-not (Tags-Match -Entry $e -T $Tag)) { continue }
  if ($Id.Count -gt 0) {
    $match = $false
    foreach ($i in $Id) {
      if ([string]$e.id -eq [string]$i) { $match = $true; break }
    }
    if (-not $match) { continue }
  }
  $e
}
# Single match is a PSCustomObject, not an array — force array for .Count / foreach.
$selected = @($selected)

$SessionLogPath = Join-Path $RepoRoot 'data/reports/z_doorway_session_log.jsonl'

Write-Host ''
Write-Host ('Z-DOORWAY-2 safe opener | Apply=' + [bool]$Apply.IsPresent + ' | SessionLog=' + [bool]$SessionLog.IsPresent + ' | Tag=' + $Tag)
Write-Host ('Registry: ' + $RegistryPath)
Write-Host 'This script never runs npm, git, deploy, extensions, services, or NAS writes.'
Write-Host ''

if ($selected.Count -eq 0) {
  Write-Host 'No registry entries match filters.'
  exit 0
}

foreach ($e in $selected) {
  $reason = Get-SkipReason -Entry $e
  # Use $entryId — not $id — so we do not collide with the -Id parameter ($Id) under case-insensitive rules.
  $entryId = [string]$e.id
  $path = [string]$e.path
  $nm = [string]$e.name
  if ([string]::IsNullOrWhiteSpace($nm)) { $nm = $entryId }
  $pathExists = Test-PathExists $path
  $stRaw = [string]$e.status
  $stLog = if ($stRaw) { $stRaw.Trim().ToUpperInvariant() } else { '' }

  if ($reason) {
    Write-Host ("[SKIP] id=" + $entryId + ' reason=' + $reason)
    if ($Apply -and $SessionLog) {
      Append-DoorwaySessionReceipt -LogPath $SessionLogPath -Record @{
        timestamp      = (Get-Date).ToUniversalTime().ToString('o')
        id             = [string]$entryId
        name           = $nm
        path_exists    = [bool]$pathExists
        status         = $stLog
        action         = 'open_workspace_only'
        result         = 'skipped'
        operator_mode  = 'apply'
      }
    }
    continue
  }

  $st = [string]$e.status
  if ($st -and $st.Trim().ToUpperInvariant() -eq 'YELLOW') {
    Write-Warning ("[REVIEW] id=" + $entryId + ' status=YELLOW — open only after operator review.')
  }

  $pref = [string]$e.preferred_entry
  if ([string]::IsNullOrWhiteSpace($pref)) { $pref = 'cursor' }
  $targetNorm = $path.Trim().Replace('/', [System.IO.Path]::DirectorySeparatorChar)
  if ($Apply) {
    $launchOk = $false
    $resultTag = 'error'
    $launchEx = $null
    try {
      Open-OneTarget -Target $targetNorm -Preferred $pref.Trim().ToLowerInvariant() -DoLaunch $true
      $launchOk = $true
      $resultTag = 'opened'
    }
    catch {
      $launchEx = $_
      $msg = $_.Exception.Message
      if ($msg -like '*Neither Cursor nor VS Code*') {
        $resultTag = 'ide_unavailable'
      }
      else {
        $resultTag = 'error'
      }
    }
    if ($Apply -and $SessionLog) {
      Append-DoorwaySessionReceipt -LogPath $SessionLogPath -Record @{
        timestamp      = (Get-Date).ToUniversalTime().ToString('o')
        id             = [string]$entryId
        name           = $nm
        path_exists    = [bool]$pathExists
        status         = $stLog
        action         = 'open_workspace_only'
        result         = $resultTag
        operator_mode  = 'apply'
      }
    }
    if (-not $launchOk) {
      throw $launchEx
    }
    Write-Host ("[OPENED] id=" + $entryId)
  }
  else {
    Open-OneTarget -Target $targetNorm -Preferred $pref.Trim().ToLowerInvariant() -DoLaunch $false
  }
}

Write-Host ''
Write-Host '[DONE] doorway pass complete (Z-DOORWAY-2 open-only; Z-DOORWAY-3 optional -SessionLog receipts).'
exit 0
