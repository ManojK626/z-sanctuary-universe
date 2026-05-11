$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File 'C:\ZSanctuary_Universe\martial-platform\nas_backup.ps1'"
$trigger = New-ScheduledTaskTrigger -Daily -At 2:00AM
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -RunLevel Highest
Register-ScheduledTask -TaskName "ZSanctuaryNASBackup" -Action $action -Trigger $trigger -Principal $principal -Description "Nightly archive of martial platform bundles to NAS"
