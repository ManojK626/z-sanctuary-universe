#requires -Version 5.1
<#
  Z-VDK Phase 1 — READ ONLY. No delete, process kill, registry, Defender changes, upload, or auto-quarantine.
  Writes: data/reports/z_vdk_scan_report.json
#>
$ErrorActionPreference = 'Stop'

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$DataReports = Join-Path $RepoRoot 'data\reports'
$OutJson = Join-Path $DataReports 'z_vdk_scan_report.json'
$PcRootJson = Join-Path $RepoRoot 'data\z_pc_root_projects.json'

$SuspiciousExt = @('.exe', '.bat', '.ps1', '.vbs', '.scr', '.dll', '.cmd', '.msi', '.com')
$MaxHashBytes = 50MB
$SensitiveNames = @('svchost.exe', 'csrss.exe', 'lsass.exe', 'winlogon.exe', 'smss.exe', 'services.exe', 'explorer.exe')
$RecentDays = 7
$LargeBytes = 20MB

if (-not (Test-Path -LiteralPath $DataReports)) {
  New-Item -ItemType Directory -Path $DataReports -Force | Out-Null
}

function Test-ExcludedPath {
  param([string]$FullPath)
  $fp = $FullPath.ToLowerInvariant()
  if ($fp -match '\\node_modules\\') { return $true }
  if ($fp -match '\\.git\\') { return $true }
  if ($fp -match '\\dist\\') { return $true }
  if ($fp -match '\\out\\') { return $true }
  if ($fp -match '\\.vs\\') { return $true }
  if ($fp -match '\\target\\release\\') { return $true }
  if ($fp -match '\\packages\\') { return $true }
  if ($fp -match '\\__pycache__\\') { return $true }
  if ($fp -match '\\.venv\\') { return $true }
  return $false
}

function Test-TrustedPs1 {
  param([string]$FullPath, [string]$HubRoot)
  $h = $HubRoot.ToLowerInvariant()
  $f = $FullPath.ToLowerInvariant()
  if ($f.StartsWith($h) -and ($f -match '\\scripts\\' -or $f -match '\\.github\\workflows\\')) {
    return $true
  }
  return $false
}

function Get-PcRoot {
  param([string]$JsonPath)
  if (-not (Test-Path -LiteralPath $JsonPath)) { return $null }
  try {
    $j = Get-Content -LiteralPath $JsonPath -Raw -Encoding UTF8 | ConvertFrom-Json
    if ($j.pc_root -and [string]$j.pc_root) { return [string]$j.pc_root }
  }
  catch { }
  return $null
}

function Get-ScanRoots {
  param([string]$Hub, [string]$PcRoot)
  $roots = [System.Collections.Generic.List[string]]::new()
  [void]$roots.Add($Hub)
  if ($PcRoot) {
    $extras = Join-Path $PcRoot 'Extras & Tools'
    if (Test-Path -LiteralPath $extras) { [void]$roots.Add($extras) }
  }
  $dl = Join-Path $env:USERPROFILE 'Downloads'
  if (Test-Path -LiteralPath $dl) { [void]$roots.Add($dl) }
  return $roots | Select-Object -Unique
}

function Get-DepthForRoot {
  param([string]$RootPath, [string]$Hub, [string]$Downloads)
  if ($RootPath -eq $Downloads) { return 2 }
  if ($RootPath -eq $Hub) { return 7 }
  return 5
}

function Classify-Finding {
  param(
    [System.IO.FileInfo]$File,
    [string]$RootLabel,
    [string]$HubRoot,
    [datetime]$NowUtc
  )
  $ext = $File.Extension.ToLowerInvariant()
  $nameLower = $File.Name.ToLowerInvariant()
  $full = $File.FullName
  $reasons = [System.Collections.Generic.List[string]]::new()
  $risk = 'medium'

  $inDownloads = $full.ToLowerInvariant().Contains('\downloads\')
  $inExtras = $full -match '[\\/]extras \& tools[\\/]' -or $full -match '[\\/]extras and tools[\\/]'
  $hubLower = $HubRoot.ToLowerInvariant()
  $underHub = $full.ToLowerInvariant().StartsWith($hubLower)

  if ($SensitiveNames -contains $nameLower) {
    if ($full -notmatch '\\windows\\system32\\' -and $full -notmatch '\\windows\\syswow64\\') {
      [void]$reasons.Add('Filename matches high-value Windows process name outside System32/SysWOW64')
      return @{ risk = 'critical'; reasons = $reasons }
    }
  }

  if ($ext -eq '.scr' -or $ext -eq '.vbs') {
    $risk = 'high'
    [void]$reasons.Add("Extension $ext commonly abused")
  }
  if ($inDownloads -and ($ext -eq '.exe' -or $ext -eq '.msi' -or $ext -eq '.scr')) {
    $risk = 'high'
    [void]$reasons.Add('Executable/installer in Downloads')
  }
  if ($inExtras -and ($ext -eq '.exe' -or $ext -eq '.dll')) {
    if ($risk -ne 'high' -and $risk -ne 'critical') { $risk = 'medium' }
    [void]$reasons.Add('Binary in tools sink (Extras & Tools); verify origin')
  }
  if ($underHub -and $ext -eq '.exe') {
    if ($risk -eq 'medium') { $risk = 'high' }
    [void]$reasons.Add('Executable inside hub repo tree')
  }
  if ($underHub -and $ext -eq '.ps1' -and -not (Test-TrustedPs1 -FullPath $full -HubRoot $HubRoot)) {
    if ($risk -eq 'medium') { $risk = 'medium' }
    [void]$reasons.Add('PowerShell script outside trusted scripts/.github workflows paths')
  }
  if ($underHub -and $ext -eq '.dll' -and $full -notmatch '\\native\\' -and $full -notmatch '\\runtimes\\') {
    [void]$reasons.Add('DLL under repo; may be legitimate dependency — verify')
  }
  if ($File.Length -gt $LargeBytes) {
    [void]$reasons.Add(('Large binary ({0:N1} MiB)' -f ($File.Length / 1MB)))
    if ($risk -eq 'low') { $risk = 'medium' }
  }
  $age = ($NowUtc - $File.LastWriteTimeUtc).TotalDays
  if ($age -ge 0 -and $age -le $RecentDays) {
    [void]$reasons.Add('Recently modified (within ' + $RecentDays + ' days)')
  }
  if ($reasons.Count -eq 0) {
    [void]$reasons.Add(('Suspicious extension {0} under scan root' -f $ext))
    if ($ext -eq '.bat' -or $ext -eq '.cmd') { $risk = 'medium' }
    elseif ($ext -eq '.ps1') { $risk = 'medium' }
    elseif ($ext -eq '.dll') { $risk = 'medium' }
    else { $risk = 'medium' }
  }

  if ($underHub -and ($ext -eq '.bat' -or $ext -eq '.cmd') -and $risk -ne 'high' -and $risk -ne 'critical') {
    $risk = 'medium'
  }

  return @{ risk = $risk; reasons = $reasons }
}

$pcRoot = Get-PcRoot -JsonPath $PcRootJson
$downloadsPath = Join-Path $env:USERPROFILE 'Downloads'
$scanRoots = Get-ScanRoots -Hub $RepoRoot -PcRoot $pcRoot

$findings = [System.Collections.Generic.List[object]]::new()
$script:ZVdkFilesScanned = [int64]0
$warnings = [System.Collections.Generic.List[string]]::new()
$nowUtc = [datetime]::UtcNow

foreach ($root in $scanRoots) {
  if (-not (Test-Path -LiteralPath $root)) { continue }
  $depth = Get-DepthForRoot -RootPath $root -Hub $RepoRoot -Downloads $downloadsPath
  try {
    Get-ChildItem -LiteralPath $root -Recurse -Depth $depth -File -ErrorAction SilentlyContinue | ForEach-Object {
      $f = $_
      if (Test-ExcludedPath -FullPath $f.FullName) { return }
      $script:ZVdkFilesScanned++
      $ext = $f.Extension.ToLowerInvariant()
      if ($SuspiciousExt -notcontains $ext) { return }
      if ($ext -eq '.ps1' -and (Test-TrustedPs1 -FullPath $f.FullName -HubRoot $RepoRoot)) { return }

      $cls = Classify-Finding -File $f -RootLabel $root -HubRoot $RepoRoot -NowUtc $nowUtc
      $reasonStr = ($cls.reasons | ForEach-Object { $_ }) -join '; '

      $sha = $null
      if ($f.Length -le $MaxHashBytes) {
        try {
          $sha = (Get-FileHash -LiteralPath $f.FullName -Algorithm SHA256 -ErrorAction Stop).Hash.ToLowerInvariant()
        }
        catch {
          [void]$warnings.Add("Hash failed for $($f.FullName): $($_.Exception.Message)")
        }
      }
      else {
        $reasonStr = $reasonStr + '; SHA256 skipped (file over cap)'
      }

      $finding = [ordered]@{
        path   = $f.FullName
        risk   = $cls.risk
        reason = $reasonStr
        sha256 = $sha
        action = 'review_or_quarantine_proposal'
      }
      [void]$findings.Add($finding)
    }
  }
  catch {
    [void]$warnings.Add("Scan error under ${root}: $($_.Exception.Message)")
  }
}

$critical = ($findings | Where-Object { $_.risk -eq 'critical' }).Count
$high = ($findings | Where-Object { $_.risk -eq 'high' }).Count
$medium = ($findings | Where-Object { $_.risk -eq 'medium' }).Count
$low = ($findings | Where-Object { $_.risk -eq 'low' }).Count
$totalFilesScanned = [int64]$script:ZVdkFilesScanned

$payload = [ordered]@{
  schema_version = 1
  name           = 'z-vdk-scan'
  safety         = 'READ_ONLY_PHASE1_NO_DELETE_NO_KILL'
  generated_at   = $nowUtc.ToString('o')
  scan_roots     = @($scanRoots)
  findings       = @($findings)
  summary        = [ordered]@{
    total_files_scanned = $totalFilesScanned
    findings_total      = $findings.Count
    critical              = $critical
    high                  = $high
    medium                = $medium
    low                   = $low
  }
}
if ($warnings.Count -gt 0) {
  $payload['warnings'] = @($warnings)
}

$json = $payload | ConvertTo-Json -Depth 8
[System.IO.File]::WriteAllText($OutJson, $json, [System.Text.UTF8Encoding]::new($false))
Write-Host "Z-VDK scan complete: $($findings.Count) findings, $($script:ZVdkFilesScanned) files scanned -> $OutJson" -ForegroundColor Cyan
