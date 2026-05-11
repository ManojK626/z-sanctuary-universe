# Add to your PowerShell profile to auto-load Z-Super Saiyan PS phase 1
Import-Module (Join-Path $PSScriptRoot 'Z-SuperSaiyanPS.psm1') -Force
Write-Host 'Z-Super Saiyan PS module loaded (Z-Doctor available)' -ForegroundColor Green
