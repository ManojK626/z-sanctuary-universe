# Z-Super Saiyan PS — Phase 1 (Read-only first)
# Goal: Observability + discipline before any mutation.
function Get-ZRepoRoot {
  param([string]$Start = (Get-Location).Path)
  $path = Resolve-Path $Start
  while ($path -and -not (Test-Path (Join-Path $path "package.json"))) {
    $parent = Split-Path $path -Parent
    if ($parent -eq $path) {
      break
    }
    $path = $parent
  }
  if (-not (Test-Path (Join-Path $path "package.json"))) {
    throw "Z-Doctor: Could not find repo root (package.json). Run inside C:\\ZSanctuary_Universe."
  }
  return $path
}

function Get-ZReportAgeMinutes {
  param([string]$Path)
  if (-not (Test-Path $Path)) {
    return $null
  }
  $age = (Get-Date) - (Get-Item $Path).LastWriteTime
  return [math]::Round($age.TotalMinutes, 1)
}

function Z-Doctor {
  [CmdletBinding()]
  param(
    [string]$Repo
  )
  $root = if ($Repo) { $Repo } else { Get-ZRepoRoot }
  Push-Location $root
  try {
    $node = Get-Command node -ErrorAction SilentlyContinue
    $npm = Get-Command npm -ErrorAction SilentlyContinue
    $nodeVer = if ($node) { (node -v 2>$null).Trim() } else { "NOT FOUND" }
    $npmVer = if ($npm) { (npm -v 2>$null).Trim() } else { "NOT FOUND" }
    $mem = Get-CimInstance Win32_OperatingSystem
    $totalGB = [math]::Round($mem.TotalVisibleMemorySize / 1MB, 2)
    $freeGB = [math]::Round($mem.FreePhysicalMemory / 1MB, 2)
    $usedGB = [math]::Round($totalGB - $freeGB, 2)
    $drive = Get-PSDrive -Name C -ErrorAction SilentlyContinue
    $freeDiskGB = if ($drive) { [math]::Round($drive.Free / 1GB, 2) } else { $null }
    $reports = @(
      "data\\reports\\z_slo_guard.json",
      "data\\reports\\z_provenance_check.json",
      "data\\reports\\z_workspace_auto_sweep.json",
      "data\\reports\\z_web_readiness_check.json",
      "data\\reports\\z_error_budget.json"
    ) | ForEach-Object { Join-Path $root $_ }
    $reportAges = $reports | ForEach-Object {
      [pscustomobject]@{
        Report = Split-Path $_ -Leaf
        AgeMinutes = Get-ZReportAgeMinutes $_
        Exists = Test-Path $_
      }
    }
    $codeProcesses = Get-Process Code -ErrorAction SilentlyContinue
    $codeCount = if ($codeProcesses) { $codeProcesses.Count } else { 0 }
    Write-Host ""
    Write-Host "⚕️  Z-Doctor — Z-Sanctuary Universe" -ForegroundColor Cyan
    Write-Host "Repo root: $root"
    Write-Host ""
    Write-Host "Runtime:" -ForegroundColor Cyan
    Write-Host "  Node: $nodeVer"
    Write-Host "  npm : $npmVer"
    Write-Host ""
    Write-Host "Memory:" -ForegroundColor Cyan
    Write-Host ("  Used: {0} GB / {1} GB" -f $usedGB, $totalGB)
    Write-Host "  Free: $freeGB GB"
    Write-Host ""
    Write-Host "Disk C: Free: $freeDiskGB GB" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "VS Code processes: $codeCount" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Governance report freshness (minutes):" -ForegroundColor Cyan
    $reportAges | Format-Table -AutoSize
    Write-Host ""
    Write-Host "✅ Z-Doctor complete (read-only)." -ForegroundColor Green
  }
  finally {
    Pop-Location
  }
}

Export-ModuleMember -Function Z-Doctor, Get-ZRepoRoot, Get-ZReportAgeMinutes
