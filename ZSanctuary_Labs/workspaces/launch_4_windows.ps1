param(
  [switch]$NoLaunch,
  [int]$LaunchDelayMs = 1200,
  [int]$DiscoverTimeoutSec = 20
)

Add-Type @"
using System;
using System.Runtime.InteropServices;
public static class ZWinApi {
  [DllImport("user32.dll")] public static extern bool MoveWindow(IntPtr hWnd, int X, int Y, int nWidth, int nHeight, bool bRepaint);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
}
"@
Add-Type -AssemblyName System.Windows.Forms

"@
Add-Type -AssemblyName System.Windows.Forms

$WindowMarginPx = 18
$LaunchWarnTitleMismatch = $true

function Test-UntitledWorkspace {
    $vsProcesses = Get-Process -Name "Code" -ErrorAction SilentlyContinue

    foreach ($proc in $vsProcesses) {
        if ($proc.MainWindowTitle -match "Untitled") {
            Write-Host ""
            Write-Host "🚨 ENFORCEMENT MODE: Untitled Workspace Detected" -ForegroundColor Red
            Write-Host "Window Title: $($proc.MainWindowTitle)" -ForegroundColor Yellow
            Write-Host "Close the Untitled workspace before launching governed sessions." -ForegroundColor Cyan
            Write-Host ""
            return $true
        }
    }

    return $false
}

if (-not $NoLaunch -and (Test-UntitledWorkspace)) {
    Write-Host "Launch aborted to preserve CORE/LAB discipline." -ForegroundColor Red
    exit
}

function Build-TitleHint {
  param([string]$Path)
  if (-not $Path) { return $null }
  $baseName = [System.IO.Path]::GetFileNameWithoutExtension($Path)
  return ($baseName -replace '_', ' ').Trim()
}

function Shrink-WindowRect {
  param(
    [pscustomobject]$Rect,
    [int]$MarginX,
    [int]$MarginY
  )

  $marginX = [Math]::Max(0, $MarginX)
  $marginY = [Math]::Max(0, $MarginY)
  $addX = [Math]::Floor($marginX / 2)
  $addY = [Math]::Floor($marginY / 2)
  $newWidth = [Math]::Max(1, $Rect.W - $marginX)
  $newHeight = [Math]::Max(1, $Rect.H - $marginY)

  return [pscustomobject]@{
    X = $Rect.X + $addX
    Y = $Rect.Y + $addY
    W = $newWidth
    H = $newHeight
  }
}

function Canonical-TitleMatch {
  param(
    [string]$Title,
    [string]$Hint
  )
  if (-not $Title -or -not $Hint) { return $false }
  $titleLower = $Title.ToLowerInvariant()
  $hintLower = $Hint.ToLowerInvariant()
  $pattern = [regex]::Escape($hintLower)
  return [regex]::IsMatch($titleLower, $pattern)
}

function Shrink-AllSlotRects {
  param(
    [hashtable]$Slots,
    [int]$Margin
  )
  if (-not $Slots) { return $Slots }
  $result = @{}
  foreach ($key in $Slots.Keys) {
    $result[$key] = Shrink-WindowRect -Rect $Slots[$key] -MarginX ($Margin) -MarginY ($Margin)
  }
  return $result
}

$workspaceMap = @(
  [pscustomobject]@{ Name = 'CORE_A'; Path = 'C:\ZSanctuary_Universe\Z_SSWS.code-workspace'; Slot = 'M1L' },
  [pscustomobject]@{ Name = 'CORE_B'; Path = 'C:\ZSanctuary_Universe\core\ZSanctuary_Universe.code-workspace'; Slot = 'M1R' },
  [pscustomobject]@{ Name = 'LAB_A';  Path = 'C:\ZSanctuary_Labs\workspaces\Z_LAB_Dashboard_Copy.code-workspace'; Slot = 'M2L' },
  [pscustomobject]@{ Name = 'LAB_B';  Path = 'C:\ZSanctuary_Labs\workspaces\Z_LAB_SSWS_Copy.code-workspace'; Slot = 'M2R' }
)

foreach ($entry in $workspaceMap) {
  $entry | Add-Member -NotePropertyName TitleHint -NotePropertyValue (Build-TitleHint $entry.Path)
  $entry | Add-Member -NotePropertyName Category -NotePropertyValue (if ($entry.Path -match 'Z_LAB') { 'LAB' } else { 'CORE' })
}

function Get-CodeWindows {
  Get-Process Code -ErrorAction SilentlyContinue |
    Where-Object { $_.MainWindowHandle -ne 0 } |
    ForEach-Object {
      [pscustomobject]@{
        Id     = $_.Id
        Handle = [IntPtr]$_.MainWindowHandle
        Start  = $_.StartTime
        Title  = $_.MainWindowTitle
      }
    }
}

function Wait-NewCodeWindow {
  param(
    [Parameter(Mandatory=$true)]
    [System.Collections.Generic.HashSet[string]]$BeforeHandles,
    [int]$TimeoutSec = 20
  )

  $deadline = (Get-Date).AddSeconds($TimeoutSec)
  while ((Get-Date) -lt $deadline) {
    $wins = Get-CodeWindows | Sort-Object Start -Descending
    foreach ($w in $wins) {
      $k = $w.Handle.ToString()
      if (-not $BeforeHandles.Contains($k)) {
        return $w
      }
    }
    Start-Sleep -Milliseconds 250
  }
  return $null
}

function Get-HalfRects {
  param([System.Windows.Forms.Screen]$Screen)
  $wa = $Screen.WorkingArea
  $half = [Math]::Floor($wa.Width / 2)
  return @{
    L = [pscustomobject]@{ X = $wa.X;         Y = $wa.Y; W = $half;               H = $wa.Height }
    R = [pscustomobject]@{ X = ($wa.X+$half); Y = $wa.Y; W = ($wa.Width - $half); H = $wa.Height }
  }
}

function Get-QuadRects {
  param([System.Windows.Forms.Screen]$Screen)
  $wa = $Screen.WorkingArea
  $halfW = [Math]::Floor($wa.Width / 2)
  $halfH = [Math]::Floor($wa.Height / 2)
  return @{
    M1L = [pscustomobject]@{ X = $wa.X;             Y = $wa.Y;              W = $halfW;               H = $halfH }
    M1R = [pscustomobject]@{ X = ($wa.X + $halfW);  Y = $wa.Y;              W = ($wa.Width - $halfW);  H = $halfH }
    M2L = [pscustomobject]@{ X = $wa.X;             Y = ($wa.Y + $halfH);   W = $halfW;               H = ($wa.Height - $halfH) }
    M2R = [pscustomobject]@{ X = ($wa.X + $halfW);  Y = ($wa.Y + $halfH);   W = ($wa.Width - $halfW);  H = ($wa.Height - $halfH) }
  }
}

foreach ($w in $workspaceMap) {
  if (-not (Test-Path $w.Path)) {
    Write-Error "Missing workspace: $($w.Path)"
    exit 1
  }
}

$allScreens = [System.Windows.Forms.Screen]::AllScreens
$primary = $allScreens | Where-Object { $_.Primary } | Select-Object -First 1
if (-not $primary) { $primary = $allScreens | Select-Object -First 1 }
$secondary = $allScreens | Where-Object { -not $_.Primary } | Sort-Object { $_.Bounds.X } | Select-Object -First 1

$slotRects = @{}
if ($secondary) {
  $m1 = Get-HalfRects -Screen $primary
  $m2 = Get-HalfRects -Screen $secondary
  $slotRects = @{
    M1L = $m1.L
    M1R = $m1.R
    M2L = $m2.L
    M2R = $m2.R
  }
} else {
  Write-Warning 'Only one monitor detected. Falling back to 2x2 tiling on primary monitor.'
  $slotRects = Get-QuadRects -Screen $primary
}
$slotRects = Shrink-AllSlotRects -Slots $slotRects -Margin $WindowMarginPx

$before = New-Object 'System.Collections.Generic.HashSet[string]'
(Get-CodeWindows).Handle | ForEach-Object { [void]$before.Add($_.ToString()) }

# Enforcement: detect stray untitled editor windows before launching new workspaces.
$existingWindows = Get-CodeWindows
$untitledWindows = $existingWindows | Where-Object {
  -not [string]::IsNullOrEmpty($_.Title) -and $_.Title -match '(?i)untitled'
}
if ($untitledWindows.Count -gt 0) {
  Write-Warning 'One or more existing VS Code windows are running as "Untitled".'
  $untitledWindows | ForEach-Object { Write-Warning ("- PID {0}, Title: {1}" -f $_.Id, $_.Title) }
  Write-Warning 'Please close the untitled workspace windows before relaunching via this script.'
  exit 1
}

function Warn-LauncherMismatch {
  param(
    [pscustomobject]$Win,
    [pscustomobject]$Entry,
    [int]$ExpectedPid
  )
  $msg = "Workspace `$($Entry.Name)` (slot $($Entry.Slot)) opened `"$($Win.Title)`"."
  if ($ExpectedPid) {
    $msg += " Expected PID $ExpectedPid, actual PID $($Win.ProcessId)."
  }
  if ($LaunchWarnTitleMismatch) {
    $msg += " Title hint: '$($Entry.TitleHint)'."
  }
  Write-Warning $msg
}

$launched = @()
foreach ($entry in $workspaceMap) {
  $spawn = $null
  if (-not $NoLaunch) {
    $spawn = Start-Process -FilePath 'code' -ArgumentList @('-n', $entry.Path)
    Start-Sleep -Milliseconds $LaunchDelayMs
  }

  $newWin = Wait-NewCodeWindow -BeforeHandles $before -TimeoutSec $DiscoverTimeoutSec
  if (-not $newWin) {
    Write-Warning "Could not detect new VS Code window for: $($entry.Name). Will skip placement for this slot."
    continue
  }

  [void]$before.Add($newWin.Handle.ToString())
  $expectedPid = if ($spawn) { $spawn.Id } else { $null }
  $titleOk = Canonical-TitleMatch -Title $newWin.Title -Hint $entry.TitleHint
  $pidOk = -not $expectedPid -or ($newWin.ProcessId -eq $expectedPid)
  if (-not ($titleOk -and $pidOk)) {
    Warn-LauncherMismatch -Win $newWin -Entry $entry -ExpectedPid $expectedPid
  }
  $launched += [pscustomobject]@{
    Name        = $entry.Name
    Slot        = $entry.Slot
    Path        = $entry.Path
    Handle      = $newWin.Handle
    ProcessId   = $newWin.Id
    ExpectedPid = $expectedPid
    Title       = $newWin.Title
    TitleHint   = $entry.TitleHint
    Category    = $entry.Category
  }
}

foreach ($win in $launched) {
  $rect = $slotRects[$win.Slot]
  if (-not $rect) { continue }
  [void][ZWinApi]::ShowWindow($win.Handle, 9)  # SW_RESTORE
  Start-Sleep -Milliseconds 80
  [void][ZWinApi]::MoveWindow($win.Handle, [int]$rect.X, [int]$rect.Y, [int]$rect.W, [int]$rect.H, $true)
}

Write-Host "Launched/placed windows: $($launched.Count)"
$launched | ForEach-Object {
  Write-Host ("- {0} [{1}] -> PID {2} (Hint: {3})" -f $_.Name, $_.Slot, $_.ProcessId, $_.TitleHint)
}

if ($launched.Count -lt 4) {
  Write-Warning 'Not all 4 windows were detected for placement. Re-run launcher once if needed.'
}
