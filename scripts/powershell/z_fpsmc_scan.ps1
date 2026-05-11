#requires -Version 5.1
<#
  Z-FPSMC Phase 1 — READ ONLY. No delete/move/copy/sync. Writes a single JSON report only.
#>
$ErrorActionPreference = 'Stop'

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$DataReports = Join-Path $RepoRoot 'data\reports'
$OutJson = Join-Path $DataReports 'z_fpsmc_storage_map.json'
$PcRootJson = Join-Path $RepoRoot 'data\z_pc_root_projects.json'

if (-not (Test-Path -LiteralPath $DataReports)) {
  New-Item -ItemType Directory -Path $DataReports -Force | Out-Null
}

function Add-Warning {
  param(
    [System.Collections.Generic.List[string]]$List,
    [string]$Message
  )
  if ($Message) { [void]$List.Add($Message) }
}

$warnings = [System.Collections.Generic.List[string]]::new()
$generatedAt = (Get-Date).ToUniversalTime().ToString('o')

# --- Drives (fixed) + free space map ---
$drives = @()
$freeSpace = @{}
try {
  $disks = Get-CimInstance -ClassName Win32_LogicalDisk -Filter 'DriveType=3' -ErrorAction Stop
  foreach ($d in $disks) {
    $letter = if ($d.DeviceId) { $d.DeviceId.TrimEnd('\') } else { $null }
    $item = [ordered]@{
      device_id  = $d.DeviceId
      volume_name = $d.VolumeName
      file_system = $d.FileSystem
      size_bytes  = if ($null -ne $d.Size) { [int64]$d.Size } else { $null }
      free_bytes  = if ($null -ne $d.FreeSpace) { [int64]$d.FreeSpace } else { $null }
    }
    $drives += $item
    if ($letter -and $null -ne $d.FreeSpace) {
      $freeSpace[$letter] = [int64]$d.FreeSpace
    }
    if ($null -ne $d.FreeSpace -and $d.FreeSpace -lt 2GB) {
      Add-Warning -List $warnings -Message "Low free space on ${letter} ($([math]::Round($d.FreeSpace/1GB,2)) GiB)"
    }
  }
}
catch {
  Add-Warning -List $warnings -Message "Win32_LogicalDisk query failed: $($_.Exception.Message)"
}

# --- pc_root + project roots from EAII data (read only) ---
$projectRoots = @()
if (Test-Path -LiteralPath $PcRootJson) {
  try {
    $raw = Get-Content -LiteralPath $PcRootJson -Raw -Encoding UTF8
    $cfg = $raw | ConvertFrom-Json
    $pc = $cfg.pc_root -replace '/', [char]0x5C
    if ($pc) {
      $pr = [ordered]@{ kind = 'pc_root'; path = $pc; exists = (Test-Path -LiteralPath $pc) }
      $projectRoots += $pr
      if (-not $pr.exists) {
        Add-Warning -List $warnings -Message "pc_root path missing or not accessible: $pc"
      }
    }
    if ($cfg.hub) {
      $hubPath = Join-Path $pc $cfg.hub
      $projectRoots += [ordered]@{
        kind     = 'hub'
        path     = $hubPath
        exists   = (Test-Path -LiteralPath $hubPath)
        relative = $cfg.hub
      }
    }
    if ($cfg.projects) {
      foreach ($p in $cfg.projects) {
        if (-not $p.path) { continue }
        $rel = [string]$p.path
        $full = Join-Path $pc $rel
        $projectRoots += [ordered]@{
          id       = $p.id
          name     = $p.name
          path     = $full
          exists   = (Test-Path -LiteralPath $full)
          role     = $p.role
          relative = $rel
        }
        if (-not (Test-Path -LiteralPath $full)) {
          Add-Warning -List $warnings -Message "Project path not found on disk: $rel ($($p.id))"
        }
      }
    }
  }
  catch {
    Add-Warning -List $warnings -Message "Failed to read z_pc_root_projects.json: $($_.Exception.Message)"
  }
}
else {
  Add-Warning -List $warnings -Message "data/z_pc_root_projects.json not found; project_roots will be empty."
}

# --- Container hints (read-only: list + paths, no config changes) ---
$containers = @()
$pathHints = @(
  "$env:ProgramData\Docker",
  "$env:ProgramFiles\Docker",
  "$env:USERPROFILE\.docker",
  "$env:LOCALAPPDATA\Containers",
  "$env:USERPROFILE\.local\share\containers"
)
foreach ($h in $pathHints) {
  if ($h -and (Test-Path -LiteralPath $h)) {
    $containers += [ordered]@{
      kind = 'path_presence'
      path = $h
      note = 'Directory present (no mutation)'
    }
  }
}

function Invoke-ReadOnlyVolumeList {
  param([string]$Name)
  $cmd = Get-Command $Name -ErrorAction SilentlyContinue
  if (-not $cmd) { return $null }
  try {
    $out = & $Name @('volume', 'ls') 2>&1
    $code = 0
    if ($null -ne $LASTEXITCODE) { $code = $LASTEXITCODE }
    $text = if ($out -is [Array]) { $out | ForEach-Object { $_.ToString() } | Out-String } else { $out.ToString() }
    if ($text.Length -gt 12000) { $text = $text.Substring(0, 12000) + '...[truncated]' }
    return [ordered]@{
      command   = "$Name volume ls"
      exit_code = $code
      stdout    = $text
    }
  }
  catch {
    return [ordered]@{
      command   = "$Name volume ls"
      exit_code = -1
      stdout    = $_.Exception.Message
    }
  }
}

$dv = Invoke-ReadOnlyVolumeList -Name 'docker'
if ($dv) {
  $containers += [ordered]@{ kind = 'docker'; note = 'docker volume ls (read-only)'; result = $dv }
}
$pv = Invoke-ReadOnlyVolumeList -Name 'podman'
if ($pv) {
  $containers += [ordered]@{ kind = 'podman'; note = 'podman volume ls (read-only)'; result = $pv }
}

$report = [ordered]@{
  schema_version = '1'
  generated_at   = $generatedAt
  repo_root      = $RepoRoot
  drives         = $drives
  containers     = $containers
  project_roots  = $projectRoots
  free_space     = $freeSpace
  warnings       = @($warnings)
  safety         = 'READ_ONLY_PHASE1_NO_DELETE_NO_MOVE'
}

$json = $report | ConvertTo-Json -Depth 12
Set-Content -LiteralPath $OutJson -Value $json -Encoding utf8
Write-Host "OK: wrote $OutJson" -ForegroundColor Green
exit 0
