$bundlesDir = "C:\ZSanctuary_Universe\exports\bundles"
$nasTargetDir = "\\YourNas\ZSanctuary_Backups"  # update this path
$logFile = "C:\ZSanctuary_Universe\logs\nas_backup.log"
$timestamp = Get-Date -Format "yyyyMMdd_HHmm"
$latestZip = Get-ChildItem -Path $bundlesDir -Filter "*.zip" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $latestZip) {
    Write-Error "No bundle zip found in $bundlesDir"
    exit 1
}
if (-not (Test-Path $nasTargetDir)) {
    New-Item -ItemType Directory -Force -Path $nasTargetDir | Out-Null
}
if (-not (Test-Path (Split-Path $logFile))) {
    New-Item -ItemType Directory -Force -Path (Split-Path $logFile) | Out-Null
}
Add-Content -Path $logFile -Value "$(Get-Date -Format u) | TASK_START | $($latestZip.Name)"
$destFile = Join-Path $nasTargetDir "martial_phase2_$timestamp.zip"
try {
    Copy-Item -Path $latestZip.FullName -Destination $destFile -Force
} catch {
    $err = "$(Get-Date -Format u) | ERROR copying bundle: $($_.Exception.Message)"
    Add-Content -Path $logFile -Value $err
    throw
}
if (-not (Test-Path $destFile)) {
    $err = "$(Get-Date -Format u) | ERROR: destination $destFile not found after copy."
    Add-Content -Path $logFile -Value $err
    throw "Destination missing"
}
$hash = Get-FileHash -Algorithm SHA256 -Path $destFile
$logEntry = "$(Get-Date -Format u) | COPY | $($latestZip.Name) -> $destFile | SHA256=$($hash.Hash)"
Add-Content -Path $logFile -Value $logEntry
Write-Output "NAS backup complete. Log entry recorded."
Write-Output "Source : $($latestZip.Name)"
Write-Output "Target : $destFile"
Write-Output "Hash   : $($hash.Hash)"
Add-Content -Path $logFile -Value "$(Get-Date -Format u) | TASK_END | $($latestZip.Name)"

function Log-RestoreTest {
    param($Note = "RESTORE_TEST_OK")
    $entry = "$(Get-Date -Format u) | $Note"
    Add-Content -Path $logFile -Value $entry
    Write-Output "Restore test logged: $entry"
}

# usage helper
Write-Output "To record a restore drill, run: . $MyInvocation.MyCommand.Path; Log-RestoreTest"
