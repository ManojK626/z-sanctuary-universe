# Z-PC-IDE-PATH-1 — PC IDE path health (AMK doorway aid)

## Purpose

**Read-only** evidence so AMK can confirm **VS Code** and **Cursor** are present on disk and/or on `PATH`, and that **real hub and Labs folders** resolve before trusting Explorer shortcuts or IDE shadow workspaces.

This phase **does not** edit the Windows registry, reinstall editors, launch IDEs, or write secrets.

## Law

```text
Explorer right-click ≠ project health.
Missing “Open with Code” ≠ repo failure — often shell registration drift.
CLI proof (`code`, `cursor`) beats menu appearance.
.cursor/projects ≠ canonical hub — archive/cache turf.
Doorway prefers explicit hub paths over Explorer guesses.
GREEN ≠ deploy.
AMK-Goku owns sacred moves.
```

## What the checker does

| Check | Meaning |
| ---------------------------------------------------- | -------------------------------------------------------------- |
| `code` on PATH | Windows `where code` / POSIX `which code` |
| `cursor` on PATH | Same for `cursor` |
| `%LOCALAPPDATA%\Programs\Microsoft VS Code\Code.exe` | Common user install |
| `C:\Program Files\Microsoft VS Code\Code.exe` | Common system install |
| `%LOCALAPPDATA%\Programs\cursor\Cursor.exe` | Common Cursor install |
| Hub root | Directory containing this hub’s `package.json` |
| Labs root | `ZSanctuary_Labs` sibling under hub |
| `process.cwd()` | **RED** if under `.cursor/projects` (wrong build/archive root) |

## Signals

| Signal | Typical meaning |
| ---------- | --------------------------------------------------------------------------- |
| **GREEN** | Both IDE families detected **and** hub exists **and** Labs exists |
| **YELLOW** | One IDE missing **or** Labs missing — paths still workable |
| **RED** | Hub missing **or** CWD under `.cursor/projects` **or** neither IDE detected |

Exit code: **0** on GREEN/YELLOW, **1** on RED only.

## Commands

```bash
npm run z:pc:ide-path
```

Reports (generated, not hand-edited):

- `data/reports/z_pc_ide_path_report.json`
- `data/reports/z_pc_ide_path_report.md`

## Open the real hub reliably (manual)

Prefer explicit paths (official VS Code CLI is documented here: [VS Code command line](https://code.visualstudio.com/docs/configure/command-line)).

```powershell
code "C:\Cursor Projects Organiser\Z_Sanctuary_Universe"
code "C:\Cursor Projects Organiser\Z_Sanctuary_Universe\ZSanctuary_Labs"
```

If `code` is unknown, reinstall/repair VS Code with **Add to PATH** and **Explorer context menus** checked (installer-based fix — not scripted by this hub).

## Relation to doorway and fusion

- [AMK_WORKSPACE_DOORWAY.md](AMK_WORKSPACE_DOORWAY.md) — controlled open profiles; still **human-run**.
- `npm run amk:doorway:status` — path existence posture for doorway registry rows.
- [Z_IDE_FUSION_WORKFLOW_CONTROL.md](Z_IDE_FUSION_WORKFLOW_CONTROL.md) — dual-IDE coordination; declares **vscode_manual** vs **cursor_ide** intent.

## Receipt

Seal and acceptance checklist: [PHASE_Z_PC_IDE_PATH_1_GREEN_RECEIPT.md](PHASE_Z_PC_IDE_PATH_1_GREEN_RECEIPT.md).
