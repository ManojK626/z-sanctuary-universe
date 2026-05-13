# Z-PC-IDE-ADMIN-MODE-SAFETY

**Version:** 1.0  
**Phase:** Z*PC_IDE_ADMIN_1  
**Locked Law:** \_Normal mode is default. Administrator mode ≠ project health.*  
**Authority:** AMK-Goku (Sanctuary Sacred Moves)

---

## Why Admin Mode Matters

VS Code on Windows can run in **elevated/administrator mode**. This is often accidental—a shortcut set to "Run as administrator," or inherited from a previous launch. While admin mode may seem helpful, it actually introduces confusion and risk to your Sanctuary workflow.

### The Key Problem

`ext
Administrator mode ≠ better project access.
Administrator mode can increase confusion and risk.`

When VS Code runs elevated:

- **Terminals start elevated too** → permission model misalignment
- **Paths behave differently** → .cursor/projects vs. real hub confusion
- **Shell integration changes** → Explorer context menu may be missing or wrong
- **Updates disabled** → running user-mode installer as admin breaks auto-update
- **Workspace Trust applies differently** → extensions may behave unexpectedly

---

## Symptom Reference

| Symptom | Likely Cause | Solution |
| ------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------ |
| VS Code title says **Administrator** | App launched elevated or shortcut set to "Run as administrator" | Reopen normally from real hub path |
| Explorer context menu changed or missing | Windows/VS Code shell integration issue | Unpin taskbar icon, relaunch normally |
| Only part of repo visible in Explorer | Wrong folder/workspace opened | Open the real hub root |
| Terminals behave differently (permissions, paths) | Admin VS Code starts terminals elevated | Reopen VS Code normally |
| .cursor/projects confusion | IDE opened archive/cache path instead of real hub | Use code "C:\Cursor Projects Organiser\Z_Sanctuary_Universe" |

---

## The Safe Default: Normal Mode

### Opening VS Code Normally

**Step 1: Close all VS Code windows.**

**Step 2: Open from PowerShell (normal mode):**

`powershell
code "C:\Cursor Projects Organiser\Z_Sanctuary_Universe"
`

**Step 3: Verify the title bar.**

Expected: **VS Code** (no "Administrator" label)

**Step 4: Verify working directory:**

In VS Code terminal, run:

`powershell
pwd
dir package.json
`

Expected output:
`C:\Cursor Projects Organiser\Z_Sanctuary_Universe
package.json exists`

### Removing "Run as administrator"

If your VS Code shortcut is locked to admin mode:

1. **Right-click the VS Code shortcut.**
2. **Choose Properties.**
3. **Go to Shortcut → Advanced.**
4. **Uncheck** "Run as administrator."
5. **Also check Compatibility tab** – make sure "Run this program as an administrator" is **unchecked**.
6. **If pinned to taskbar:** unpin it, then pin it again after opening VS Code normally.

---

## When Admin Mode Might Be Needed

**Very rarely.** Admin mode should be used only for:

- **OS-level maintenance** (Windows updates, network config, driver installation)
- **System-wide tools** (antivirus, registry changes for non-Sanctuary systems)
- **Infrastructure tasks** (Docker daemon, Windows services)

**Never use admin mode for:**

- Regular Sanctuary repo editing
- Running build tasks or gates
- Extension development or installation (outside of one-time setup)
- Testing or debugging Sanctuary code

### The Locked Law

`ext
Administrator mode ≠ project health.
Elevated terminal ≠ permission.
Explorer menu ≠ authority.
CLI path proof beats right-click.
.cursor/projects ≠ build root.
GREEN ≠ deploy.
AMK-Goku owns sacred moves.`

---

## Workspace Trust

VS Code has **Workspace Trust**, which controls whether code/extensions can execute from a workspace. When opening a folder, VS Code may ask whether to trust it.

**For Z-Sanctuary:**

- **Trusted real hub:** Fine when you deliberately work there.
- **.cursor/projects:** Do not use as build root (this is cache/archive).
- **Unknown folders:** Use Restricted Mode first, enable trust intentionally later.

---

## The Safety Check

pm run z:pc:ide-admin

The Z_PC_IDE_ADMIN_1 checker verifies:

1. **Is current process elevated?** → Flag if yes
2. **Is current working directory in the real hub?** → Not in .cursor/projects
3. **Does the real hub root exist?** → Confirms path is valid
4. **Signals:**
   - **GREEN:** Normal mode, safe hub path, all checks pass
   - **YELLOW:** Admin mode detected but cwd is safe (⚠️ warning)
   - **RED:** Critical issue (in archive path or hub root missing)

**Running the check:**

`ash
npm run z:pc:ide-admin
`

This generates:

- data/reports/z_pc_ide_admin_report.json (structured data)
- data/reports/z_pc_ide_admin_report.md (human-readable report)

The MiniBot (AMK-Goku) uses this signal to warn you if admin mode is active.

---

## Integration with the Sanctuary System

The admin mode check integrates with:

- **docs/Z_PC_IDE_PATH_HEALTH_CHECK.md** – Path validation
- **docs/AMK_IDE_PATH_AND_FUSION_OPERATOR_RHYTHM.md** – Fusion operator rhythm
- **dashboard/data/amk_project_indicators.json** – MiniBot indicator updates
- **scripts/z_pc_ide_admin_check.mjs** – This phase's checker

The MiniBot uses the z:pc:ide-admin signal to:

- Warn if you're in admin mode unexpectedly
- Suggest the correct launch command
- Update Sanctuary project health indicators

---

## Quick Reference: Locked Laws

` ext
✓ Normal VS Code = safe default
✓ CLI path proof = stronger than explorer menu
✓ Real hub path = build root
✓ .cursor/projects = archive, not build root
✓ GREEN signal = safe to proceed, not deploy approval
✓ AMK-Goku = sacred move authority

✗ Admin mode ≠ better project access
✗ Elevated terminal ≠ permission increase
✗ Admin as default = confusion & risk
✗ .cursor/projects = not workspace root
✗ GREEN ≠ deployment signal
`

---

## Related Documentation

- [Visual Studio Code: Windows Setup](https://code.visualstudio.com/docs/setup/windows)
- [Visual Studio Code: Command Line Interface](https://code.visualstudio.com/docs/configure/command-line)
- [Visual Studio Code: Workspace Trust](https://code.visualstudio.com/docs/editing/workspaces/workspace-trust)
- [docs/Z_PC_IDE_PATH_HEALTH_CHECK.md](Z_PC_IDE_PATH_HEALTH_CHECK.md) – Path validation details
- [docs/INDEX.md](INDEX.md) – Sanctuary documentation index

---

## Phase: Z_PC_IDE_ADMIN_1

**Purpose:** Detect whether VS Code/terminals are running elevated, warn if active, document normal-mode opening as the default.

**Scope (read-only, no modifications to OS/system):**

- Detect admin mode status
- Verify working directory
- Confirm hub root exists
- Generate safety reports

**Out of scope:**

- Do not edit Windows registry
- Do not install software
- Do not auto-launch editors
- Do not change VS Code settings automatically
- Do not touch secrets
- Do not deploy
- Do not modify .cursor/projects
- Do not create package.json in archive folders

**Deliverables:**

- docs/Z_PC_IDE_ADMIN_MODE_SAFETY.md (this file)
- docs/PHASE_Z_PC_IDE_ADMIN_1_GREEN_RECEIPT.md
- scripts/z_pc_ide_admin_check.mjs
- data/reports/z_pc_ide_admin_report.json
- data/reports/z_pc_ide_admin_report.md
- Updated package.json with "z:pc:ide-admin" npm script

---

## Support & Escalation

If you experience persistent admin mode issues:

1. **Check your VS Code shortcut properties** (especially on Windows)
2. **Close all VS Code windows**
3. **Launch from terminal:** code "C:\Cursor Projects Organiser\Z_Sanctuary_Universe"
4. **Verify title bar:** Should NOT say "Administrator"
5. **Review reports:**
   pm run z:pc:ide-admin

If issues persist, contact the Sanctuary ops team with:

- Output of
  pm run z:pc:ide-admin
- VS Code version: code --version
- Output of whoami /groups (admin check)

---

**Zuno Verdict 🦉✨:**  
_Normal mode is the locked law default. Use admin only for rare OS tasks, outside Sanctuary workflow. The MiniBot will watch for elevation and warn you._
