#Requires -Version 5.1
<#
.SYNOPSIS
  Z-SSWS-DOOR-1 — AMK-Goku local workspace doorway (folders / workspace files only).

.DESCRIPTION
  Reads data/amk_workspace_doorway_registry.json and opens declared paths with Cursor,
  falling back to VS Code, then Explorer. Never runs npm install/start, smoke, deploy,
  servers, NAS mount, or secret writes. Use -DryRun to print actions only.

.PARAMETER Profile
  One of: morning, franed, lumina, creative, dashboard_review, full_review_safe, main_control, z_lab, questra, creative_deep

.PARAMETER DryRun
  Print planned actions only; do not launch apps.

.PARAMETER OpenDashboard
  Open AMK main control HTML in the default browser when configured in the registry.

.NOTES
  Run from any cwd; resolves hub via this script's parent folder.
#>
param(
  [Parameter(Mandatory = $true)]
  [ValidateSet('morning', 'franed', 'lumina', 'creative', 'dashboard_review', 'full_review_safe', 'main_control', 'z_lab', 'questra', 'creative_deep')]
  [string] $Profile,

  [switch] $DryRun,
  [switch] $OpenDashboard
)

$ErrorActionPreference = 'Stop'

function Get-RepoRoot {
  param([string] $ScriptDir)
  return (Resolve-Path (Join-Path $ScriptDir '..')).Path
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

function Resolve-FullPathOrNull {
  param([string] $P)
  if ([string]::IsNullOrWhiteSpace($P)) { return $null }
  return ($P.Trim().Replace('/', [System.IO.Path]::DirectorySeparatorChar))
}

function Open-Target {
  param(
    [string] $TargetPath,
    [string] $Preferred,
    [bool] $LaunchAllowed,
    [bool] $Dry
  )

  if (-not $LaunchAllowed) {
    Write-Host ('[SKIP] launch_allowed=false for target: ' + $TargetPath)
    return
  }
  if ([string]::IsNullOrWhiteSpace($TargetPath)) {
    Write-Host '[SKIP] empty target'
    return
  }
  if (-not (Test-Path -LiteralPath $TargetPath)) {
    Write-Host ('[WARN] path not found (skip open): ' + $TargetPath)
    return
  }

  $cursor = Get-CursorExe
  $code = Get-VsCodeExe

  if ($Preferred -eq 'terminal') {
    Write-Host ('[ACTION] terminal preference only — not auto-spawning shell here: ' + $TargetPath)
    return
  }

  if ($Dry) {
    Write-Host ('[DRY-RUN] would open: ' + $TargetPath + ' (preferred=' + $Preferred + ')')
    return
  }

  if ($Preferred -eq 'explorer') {
    if (Test-Path -LiteralPath $TargetPath -PathType Container) {
      Write-Host ('[ACTION] explorer folder ' + $TargetPath)
      Start-Process explorer.exe -ArgumentList @($TargetPath)
    }
    else {
      Write-Host ('[ACTION] explorer select ' + $TargetPath)
      Start-Process explorer.exe -ArgumentList @("/select,$TargetPath")
    }
    return
  }

  if ($Preferred -eq 'cursor' -and $cursor) {
    Write-Host ('[ACTION] cursor ' + $TargetPath)
    Start-Process -FilePath $cursor -ArgumentList @("`"$TargetPath`"")
    return
  }

  if ($Preferred -eq 'vscode' -and $code) {
    Write-Host ('[ACTION] code ' + $TargetPath)
    Start-Process -FilePath $code -ArgumentList @("`"$TargetPath`"")
    return
  }

  if ($cursor) {
    Write-Host ('[ACTION] cursor (fallback) ' + $TargetPath)
    Start-Process -FilePath $cursor -ArgumentList @("`"$TargetPath`"")
    return
  }
  if ($code) {
    Write-Host ('[ACTION] code (fallback) ' + $TargetPath)
    Start-Process -FilePath $code -ArgumentList @("`"$TargetPath`"")
    return
  }

  $dir = if (Test-Path -LiteralPath $TargetPath -PathType Container) { $TargetPath } else { Split-Path -Parent $TargetPath }
  Write-Host ('[ACTION] explorer fallback ' + $dir)
  Start-Process explorer.exe -ArgumentList @($dir)
}

$repoRoot = Get-RepoRoot -ScriptDir $PSScriptRoot
$regPath = Join-Path $repoRoot 'data\amk_workspace_doorway_registry.json'
if (-not (Test-Path -LiteralPath $regPath)) {
  throw "Registry not found: $regPath"
}

$raw = Get-Content -LiteralPath $regPath -Raw -Encoding UTF8
$reg = $raw | ConvertFrom-Json

$prof = @($reg.profiles | Where-Object { $_.id -eq $Profile })
if (-not $prof -or $prof.Count -lt 1) {
  throw "Profile not found: $Profile"
}
$pdef = $prof[0]
$ids = @($pdef.project_ids)
Write-Host '=== AMK Workspace Doorway ==='
Write-Host ('Profile: ' + $pdef.id + ' - ' + $pdef.display_name)
if ($DryRun) { Write-Host 'Mode: DRY-RUN (no launches)' }

$projectsById = @{}
foreach ($p in @($reg.projects)) {
  $projectsById[$p.project_id] = $p
}

foreach ($projId in $ids) {
  $proj = $projectsById[$projId]
  if (-not $proj) {
    Write-Host ('[WARN] unknown project_id in profile: ' + $projId)
    continue
  }

  $base = Resolve-FullPathOrNull -P ([string]$proj.path)
  $wf = [string]$proj.workspace_file
  $target = $null
  if (-not [string]::IsNullOrWhiteSpace($wf)) {
    if ([System.IO.Path]::IsPathRooted($wf)) {
      $target = Resolve-FullPathOrNull -P $wf
    }
    elseif ($base) {
      $target = Join-Path $base $wf
    }
  }
  if (-not $target) { $target = $base }

  Write-Host '----'
  Write-Host ('project_id: ' + $proj.project_id)
  Write-Host ('display_name: ' + $proj.display_name)
  Write-Host ('target: ' + $target)
  Write-Host ('preferred_open_mode: ' + $proj.preferred_open_mode)

  $allowed = $true
  if ($null -ne $proj.launch_allowed) { $allowed = [bool]$proj.launch_allowed }
  Open-Target -TargetPath $target -Preferred ([string]$proj.preferred_open_mode) -LaunchAllowed $allowed -Dry:$DryRun
}

if ($OpenDashboard) {
  $rel = [string]$reg.dashboard_html_relative
  if ([string]::IsNullOrWhiteSpace($rel)) {
    Write-Host '[SKIP] dashboard_html_relative not set in registry'
  }
  else {
    $html = Join-Path $repoRoot ($rel.Replace('/', [System.IO.Path]::DirectorySeparatorChar))
    Write-Host '----'
    Write-Host ('AMK dashboard HTML: ' + $html)
    if (-not (Test-Path -LiteralPath $html)) {
      Write-Host '[WARN] dashboard html not found'
    }
    elseif ($DryRun) {
      Write-Host '[DRY-RUN] would open dashboard in default browser'
    }
    else {
      Write-Host '[ACTION] Invoke-Item dashboard html (default browser)'
      Invoke-Item -LiteralPath $html
    }
  }
}

Write-Host '=== done (no servers started) ==='
