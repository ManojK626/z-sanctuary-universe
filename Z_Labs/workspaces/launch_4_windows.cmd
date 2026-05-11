@echo off
set CORE_A=C:\Cursor Projects Organiser\ZSanctuary_Universe\Z_SSWS.code-workspace
set CORE_B=C:\Cursor Projects Organiser\ZSanctuary_Universe\core\ZSanctuary_Universe.code-workspace
set LAB_A=C:\Cursor Projects Organiser\ZSanctuary_Universe\Z_Labs\workspaces\Z_LAB_Dashboard_Copy.code-workspace
set LAB_B=C:\Cursor Projects Organiser\ZSanctuary_Universe\Z_Labs\workspaces\Z_LAB_SSWS_Copy.code-workspace

start "" code -n "%CORE_A%"
start "" code -n "%CORE_B%"
start "" code -n "%LAB_A%"
start "" code -n "%LAB_B%"
echo Launched 4 VS Code windows: 2 core + 2 lab copies.
