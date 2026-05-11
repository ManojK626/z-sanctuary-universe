#Requires -Version 5.1
<#
.SYNOPSIS
  Z-DOORWAY-2 — AMK project doorway launcher (registry-driven, local open only).

.DESCRIPTION
  Reads data/amk_project_doorway_registry.json and opens folder or workspace in Cursor,
  VS Code fallback, Explorer fallback. Supports -Group filters and -DryRun.

  NEVER runs: npm install, npm start, deploy, wrangler, git push, secrets ops, domain bind,
  or background servers. Opening an IDE folder is not executing those commands.

.PARAMETER Group
  deployment_ready | review | all_safe

.PARAMETER DryRun
  Print planned actions only; do not launch apps.

.NOTES
  NAS paths are declaration-only until Synology is mounted; NAS_WAIT + missing path = skip.
  RED and BLUE (none_until_amk) never open folders; review group may still echo warnings for BLUE.

  Run from repo root recommended; registry path resolved from this script directory.
#>
param(
  [Parameter(Mandatory = $false)]
  [ValidateSet('deployment_ready', 'review', 'all_safe')]
  [string] $Group = 'all_safe',

  [switch] $DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = (Resolve-Path (Join-Path $ScriptDir '..')).Path
$RegistryPath = Join-Path $RepoRoot 'data/amk_project_doorway_registry.json'

if (-not (Test-Path -LiteralPath $RegistryPath)) {
  throw "Registry not found: $RegistryPath"
}

$raw = Get-Content -LiteralPath $RegistryPath -Raw -Encoding UTF8
$data = $raw | ConvertFrom-Json

if ($data.schema -ne 'amk_project_doorway_registry_v1') {
  throw 'Unexpected registry schema; expected amk_project_doorway_registry_v1'
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

function Get-OpenGroupMembership {
  param($Proj)
  # Canonical: open_group (string | string[]). Legacy alias: open_groups.
  if ($null -ne $Proj.open_group) {
    if ($Proj.open_group -is [System.Array]) {
      return @($Proj.open_group)
    }
    return @([string]$Proj.open_group)
  }
  if ($null -ne $Proj.open_groups) {
    return @($Proj.open_groups)
  }
  throw "Registry row missing open_group: id=$($Proj.id)"
}

function Test-ResolvedPathPresent {
  param([string]$P)
  if ([string]::IsNullOrWhiteSpace($P)) { return $false }
  $normalized = $P.Trim().Replace('/', [System.IO.Path]::DirectorySeparatorChar)
  return Test-Path -LiteralPath $normalized
}

function Test-DeploymentReadyEligible {
  param($Proj)
  if ($Proj.deployment_posture -eq 'blocked') { return $false }
  if ($Proj.status -eq 'NAS_WAIT') { return $false }
  # NAS-required rows stay out until Synology-backed path exists
  if ($Proj.nas_required -eq $true) {
    return (Test-ResolvedPathPresent -P ([string]$Proj.path))
  }
  return $true
}

function Test-ShouldInclude {
  param(
    $Proj,
    [string] $Grp
  )

  $og = @(Get-OpenGroupMembership -Proj $Proj | ForEach-Object { $_ })
  if (($og | Measure-Object).Count -eq 0) {
    Write-Warning ('open_group empty for id ' + [string]$Proj.id + ' - skipping')
    return $false
  }
  if ($og -notcontains $Grp) { return $false }

  switch ($Grp) {
    'all_safe' {
      return ($Proj.status -eq 'GREEN')
    }
    'deployment_ready' {
      return (($Proj.status -eq 'GREEN') -and (Test-DeploymentReadyEligible -Proj $Proj))
    }
    'review' {
      return (($Proj.status -eq 'GREEN') -or ($Proj.status -eq 'YELLOW') -or ($Proj.status -eq 'BLUE') -or ($Proj.status -eq 'NAS_WAIT') -or ($Proj.status -eq 'RED'))
    }
    default { return $false }
  }
}

function Get-AllowedActionToken {
  param($Proj)
  $a = $Proj.allowed_action
  if ($null -eq $a) {
    return 'cursor'
  }
  if ($a -is [System.Array]) {
    if ($a.Count -eq 0) {
      return 'cursor'
    }
    return ([string]$a[0]).Trim()
  }
  return ([string]$a).Trim()
}

function Open-One {
  param(
    $Proj,
    [bool] $Dry
  )

  $id = $Proj.id
  $actionToken = Get-AllowedActionToken -Proj $Proj

  if ($Proj.status -eq 'RED') {
    Write-Host ('[BLOCKED] id=' + $id + ' status=RED - no open (' + [string]$Proj.deployment_posture + ')')
    return
  }

  if ($actionToken -eq 'none' -or $actionToken -eq 'none_until_amk') {
    Write-Host ('[HOLD] id=' + $id + ' AMK/decision posture - ' + $actionToken + '; no launcher open.')
    return
  }

  if ($Proj.status -eq 'NAS_WAIT' -and $Proj.nas_required -eq $true) {
    $pNorm = [string]$Proj.path
    if ([string]::IsNullOrWhiteSpace($pNorm)) {
      Write-Host ('[NAS_WAIT] id=' + $id + ' empty path - declaration only until NAS mount')
      return
    }
    $pNorm = $pNorm.Trim().Replace('/', [System.IO.Path]::DirectorySeparatorChar)
    if (-not (Test-Path -LiteralPath $pNorm)) {
      Write-Host ('[NAS_WAIT] id=' + $id + ' path missing - mount Synology/readiness stub first: ' + [string]$Proj.path)
      return
    }
  }

  if ($Proj.status -eq 'YELLOW') {
    Write-Warning ('[REVIEW_WARNING] id=' + $id + ' status=YELLOW - open only after conscious review (' + [string]$Proj.name + ')')
  }

  if ($Proj.status -eq 'BLUE') {
    Write-Warning ('[HOLD_BLUE] id=' + $id + ' status=BLUE - decision lane; launcher will not auto-open IDE for this row.')
    if ($actionToken -ne 'explorer_when_mounted') { return }
  }

  $target = ''
  $preferred = 'cursor'

  switch -Regex ($actionToken) {
    '^cursor_workspace_first$' {
      if (-not [string]::IsNullOrWhiteSpace($Proj.workspace)) {
        $target = [string]$Proj.workspace.Trim()
      }
      if ([string]::IsNullOrWhiteSpace($target)) {
        $target = [string]$Proj.path.Trim()
      }
      $preferred = 'cursor'
      break
    }
    '^cursor$' {
      $target = [string]$Proj.path.Trim()
      $preferred = 'cursor'
      break
    }
    '^explorer_when_mounted$' {
      $target = [string]$Proj.path.Trim()
      $preferred = 'explorer'
      break
    }
    default {
      $target = [string]$Proj.path.Trim()
      $preferred = 'cursor'
    }
  }

  $target = $target.Replace('/', [System.IO.Path]::DirectorySeparatorChar)

  if (-not $target) {
    Write-Host ('[SKIP] id=' + $id + ' empty path')
    return
  }

  if (-not (Test-Path -LiteralPath $target)) {
    Write-Host ('[WARN] id=' + $id + ' path not found - ' + [string]$target)
    return
  }

  $cursor = Get-CursorExe
  $code = Get-VsCodeExe

  if ($Dry) {
    Write-Host ("[DRY-RUN] id={0} would open `{1}` via preferred={2}" -f $id, $target, $preferred)
    return
  }

  if ($preferred -eq 'explorer') {
    if (Test-Path -LiteralPath $target -PathType Container) {
      Start-Process explorer.exe -ArgumentList @($target)
    }
    else {
      Start-Process explorer.exe -ArgumentList @("/select,$target")
    }
    return
  }

  if ($preferred -eq 'cursor' -and $cursor) {
    Start-Process -FilePath $cursor -ArgumentList @("`"$target`"")
    return
  }
  if ($code) {
    Start-Process -FilePath $code -ArgumentList @("`"$target`"")
    return
  }

  Write-Warning ('[FALLBACK] No Cursor/Code found; explorer for id=' + [string]$id)
  if (Test-Path -LiteralPath $target -PathType Container) {
    Start-Process explorer.exe -ArgumentList @($target)
  }
  else {
    Start-Process explorer.exe -ArgumentList @("/select,$target")
  }
}

Write-Host ''
Write-Host ('Z-DOORWAY-2 AMK Project Doorway - Group=' + $Group + ' DryRun=' + [string][bool]$DryRun.IsPresent)
Write-Host ('Registry = ' + $RegistryPath)
Write-Host 'This script NEVER runs npm install/start, deploy, wrangler, git push, secrets, domain bind, or services.'
Write-Host ''

$picked = @()
foreach ($Proj in @($data.projects)) {
  if (Test-ShouldInclude -Proj $Proj -Grp $Group) {
    $picked += $Proj
  }
}

if ($picked.Count -eq 0) {
  Write-Host 'No matching projects for this group filter.'
  exit 0
}

foreach ($p in $picked) {
  Open-One -Proj $p -Dry:([bool]$DryRun.IsPresent)
}

Write-Host ''
Write-Host '[DONE] doorway pass complete.'
exit 0
