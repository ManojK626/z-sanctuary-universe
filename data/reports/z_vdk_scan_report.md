# Z-VDK — Virus Detection & Quarantine Core (Phase 1 summary)

**Schema:** v1 · **Generated (UTC):** 04/27/2026 19:18:00

**Safety:** `READ_ONLY_PHASE1_NO_DELETE_NO_KILL`

## Scan roots

- `C:\Cursor Projects Organiser\ZSanctuary_Universe`
- `C:\Cursor Projects Organiser\Extras & Tools`
- `C:\Users\manoj\Downloads`

## Summary

**Total files scanned:** 8849 · **Findings:** 13 (critical: 0, high: 2, medium: 11, low: 0)

## Findings

| Risk | Path | Reason | SHA256 (prefix) |
| ------ | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------- |
| medium | `C:\Cursor Projects Organiser\ZSanctuary_Universe\martial-platform\log_summary.ps1` | PowerShell script outside trusted scripts/.github workflows paths | `a04b9805e75ea129…` |
| medium | `C:\Cursor Projects Organiser\ZSanctuary_Universe\martial-platform\nas_backup.ps1` | PowerShell script outside trusted scripts/.github workflows paths | `1334adccd1751bbd…` |
| medium | `C:\Cursor Projects Organiser\ZSanctuary_Universe\martial-platform\schedule_backup.ps1` | PowerShell script outside trusted scripts/.github workflows paths | `ba0a9426af29f9a3…` |
| medium | `C:\Cursor Projects Organiser\ZSanctuary_Universe\ops\zps\profile_snippet.ps1` | PowerShell script outside trusted scripts/.github workflows paths | `d5df39deb6ec13a3…` |
| medium | `C:\Cursor Projects Organiser\ZSanctuary_Universe\ZSanctuary_Labs\sync_lab_registry.cmd` | Suspicious extension .cmd under scan root | `1984edab2da53bac…` |
| medium | `C:\Cursor Projects Organiser\ZSanctuary_Universe\ZSanctuary_Labs\workspaces\launch_4_wi...` | Suspicious extension .cmd under scan root | `593ebc5bc8ac3530…` |
| medium | `C:\Cursor Projects Organiser\ZSanctuary_Universe\ZSanctuary_Labs\workspaces\launch_4_wi...` | PowerShell script outside trusted scripts/.github workflows paths | `a36186d623186600…` |
| medium | `C:\Cursor Projects Organiser\ZSanctuary_Universe\Z_Labs\uvx.cmd` | Suspicious extension .cmd under scan root | `312f480c7535770d…` |
| medium | `C:\Cursor Projects Organiser\ZSanctuary_Universe\Z_Labs\workspaces\launch_4_windows.cmd` | Suspicious extension .cmd under scan root | `9341f39b9935c9bb…` |
| medium | `C:\Cursor Projects Organiser\Extras & Tools\thebcs.exe` | Binary in tools sink (Extras & Tools); verify origin | `59426caedeeb08c3…` |
| medium | `C:\Cursor Projects Organiser\Extras & Tools\scripts\build-all-projects.ps1` | Suspicious extension .ps1 under scan root | `87b4e5ea36bb4638…` |
| high | `C:\Users\manoj\Downloads\Claude Setup.exe` | Executable/installer in Downloads | `bb3299c619619b74…` |
| high | `C:\Users\manoj\Downloads\CursorUserSetup-x64-2.6.14.exe` | Executable/installer in Downloads; Large binary (171.1 MiB); SHA256 skipped (file over cap) | `—` |

## Warnings

_None._

---

Phase 1 is read-only: no delete, quarantine, process kill, registry, Defender changes, or uploads. See [docs/Z-VDK-VIRUS-DETECTION-QUARANTINE-CORE.md](../../docs/Z-VDK-VIRUS-DETECTION-QUARANTINE-CORE.md).
