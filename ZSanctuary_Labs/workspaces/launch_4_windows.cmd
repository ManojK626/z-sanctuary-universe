@echo off
set SCRIPT=C:\ZSanctuary_Labs\workspaces\launch_4_windows.ps1
if not exist "%SCRIPT%" (
  echo Missing launcher script: %SCRIPT%
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT%"
if errorlevel 1 (
  echo 4-window launch failed.
  exit /b 1
)

echo Launched 4 VS Code windows with automatic monitor split (2+2).
