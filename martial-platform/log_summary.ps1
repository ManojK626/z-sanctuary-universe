$log = "C:\ZSanctuary_Universe\logs\nas_backup.log"
if (-not (Test-Path $log)) {
    Write-Warning "Log not found: $log"
    return
}
$lastEntries = Get-Content $log | Select-Object -Last 10
Write-Output "=== NAS Backup Log (last 10) ==="
$lastEntries | ForEach-Object { Write-Output $_ }
$restoreEntries = Get-Content $log | Where-Object { $_ -match "RESTORE_TEST_OK" }
if ($restoreEntries) {
    Write-Output "`nMost recent restore test:"
    Write-Output ($restoreEntries | Select-Object -Last 1)
} else {
    Write-Output "`nNo restore tests logged yet."
}
