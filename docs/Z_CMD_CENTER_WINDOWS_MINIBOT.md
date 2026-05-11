# Z-CMD-CENTER-WINDOWS-MINIBOT

**Version:** 1.0
**Phase:** Z_CMD_CENTER_1
**Mode:** Read-Only Command Center
**Authority:** AMK-Goku (Sanctuary Sacred Moves)

---

## Purpose

The Windows Command Center MiniBot is a **read-only guide** for Windows-based Sanctuary operations. It:

- **Knows all project roots** (main hub, labs, archive)
- **Detects IDE availability** (VS Code code, Cursor IDE cursor)
- **Verifies safe paths** (warns if in .cursor/projects archive)
- **Recommends safe commands** (prints safe command lines for manual use)
- **Signals readiness** (GREEN/YELLOW/BLUE/RED)
- **Never executes sacred moves** (all actions require manual approval or AMK gate)

Think of it as a **PC-root guide**, not an autonomous operator. It helps you find the right place, check tools, and use safe commands — but you remain in control.

---

## Architecture

The command center system has seven layers:

| Layer | Component | Role |
| ----- | ------------------------------ | -------------------------------------------------------- |
| 1 | Windows Terminal | Command cockpit / shell environment |
| 2 | PowerShell profile (future) | Optional shortcut functions like zroot, zcheck |
| 3 | Registry JSON | Knows roots, IDE commands, safe commands, future domains |
| 4 | Node MiniBot script | Reads registry, checks paths/tools, writes reports |
| 5 | AMK Dashboard | Shows signal, recommended actions, next steps |
| 6 | Doorway + SSWS | Knows workspace modes and sacred move gates |
| 7 | Z-PC-IDE-ADMIN + Z-PC-IDE-PATH | Confirms IDE elevation and path health |

In **Phase 1 (now)**, only layers 1, 3, and 4 are active. Layers 2, 5, 6, and 7 are future phases or integrate with existing systems.

---

## Command Center Signals

### GREEN ✅

**All systems ready. Safe to proceed with normal command center workflow.**

**Conditions:**

- Main hub root exists and accessible
- Labs workspace exists (optional but good to have)
- Current directory NOT in .cursor/projects
- At least one IDE command available (code or cursor)

**Action:** Use recommended commands to open IDE safely.
**Exit Code:** 0

### YELLOW ⚠️

**Warnings detected. Proceed with caution; check for missing optional tools.**

**Conditions:**

- Main hub exists and accessible
- Current directory NOT in archive
- One or more IDE commands missing, OR Labs workspace missing

**Action:** Install missing IDE tool or accept operating with what's available.
**Exit Code:** 0

### BLUE 🔵

**AMK decision required. No IDE commands available; command center cannot open IDE safely.**

**Conditions:**

- Main hub exists
- Current directory is safe
- Neither code nor cursor command available

**Action:** Install VS Code or Cursor, then re-run. Request AMK approval for future automation.
**Exit Code:** 0

### RED 🛑

**Critical issue. Command center cannot operate safely.**

**Conditions:**

- Main hub root missing OR
- Current directory is in .cursor/projects (archive path)

**Action:** Fix the issue before proceeding. Do not use archive path as build root.
**Exit Code:** 1

---

## Known Roots

### Main Hub

**Path:** C:\Cursor Projects Organiser\Z_Sanctuary_Universe
**Purpose:** Primary project hub root
**Critical:** Yes — must exist for green signal
**Usage:** code "C:\Cursor Projects Organiser\Z_Sanctuary_Universe"

### Labs

**Path:** C:\Cursor Projects Organiser\Z_Sanctuary_Universe\ZSanctuary_Labs
**Purpose:** Experimental workspace
**Critical:** No — yellow if missing
**Usage:** code "C:\Cursor Projects Organiser\Z_Sanctuary_Universe\ZSanctuary_Labs"

### Archive/Cache (AVOID)

**Path:** C:\Users\manoj\.cursor\projects
**Purpose:** IDE cache and archive
**Build Root?** NO — this is NOT the build root
**Usage:** Never use this as workspace root
**Signal:** RED if current directory is here

---

## IDE Commands

### VS Code

**Command:** code
**Tool:** Microsoft Visual Studio Code
**Check:** where code in PowerShell
**Install:** From <https://code.visualstudio.com> or winget install Microsoft.VisualStudioCode

### Cursor

**Command:** cursor
**Tool:** Cursor IDE (AI-powered code editor)
**Check:** where cursor in PowerShell
**Install:** From <https://cursor.sh> or check your installer

---

## Safe Command Queue

The command center recommends a **read-only verification queue** that runs from the real hub:

```powershell
cd "C:\Cursor Projects Organiser\Z_Sanctuary_Universe"

npm run z:pc:ide-path             # IDE path verification
npm run z:ssws:cockpit            # Super Saiyan Workspace status
npm run z:ide:fusion              # IDE fusion operator
npm run verify:md                 # Markdown verification
npm run z:traffic                 # Traffic monitor
npm run z:car2                    # Car2 status
npm run dashboard:registry-verify # Dashboard integrity
```

All these commands are **read-only**. None modify any state or execute sacred moves.

---

## Command Recommendations

### Safe Command Center Recommendations

The command center prints safe commands for manual execution. Examples:

```powershell
# Open main hub in VS Code (normal mode, recommended)
code "C:\Cursor Projects Organiser\Z_Sanctuary_Universe"

# Open Labs workspace in VS Code
code "C:\Cursor Projects Organiser\Z_Sanctuary_Universe\ZSanctuary_Labs"

# Open Labs in Cursor IDE (if available)
cursor "C:\Cursor Projects Organiser\Z_Sanctuary_Universe\ZSanctuary_Labs"
```

**Key principle:** Command center **prints recommendations** for you to execute manually. It does **not auto-launch** anything (except in future opt-in phases).

---

## Future Declared Domains

These domains are **declared but not yet activated**. They require explicit AMK approval:

### NAS/Synology

**Status:** Declared, not mounted
**Future Action:** Mount NAS when AMK approves
**Current:** Read-only awareness only
**When:** Phase Z-NAS-AWARE-1 or later, pending AMK gate

### Cloudflare

**Status:** Declared, not deployed
**Future Action:** Deploy to Cloudflare when AMK approves
**Current:** Read-only awareness only
**When:** Phase Z-CLOUDFLARE-AWARE-1 or later, pending AMK gate

### External Storage

**Status:** Declared, not connected
**Future Action:** Connect when integration approved
**Current:** Read-only awareness only
**When:** Pending AMK decision

**Locked Law:** _Declared ≠ Deployed. Awareness ≠ Execution._

---

## What This Phase Does NOT Do

**Phase 1 is read-only.** The command center does NOT:

- ❌ Modify Windows registry
- ❌ Install software or extensions
- ❌ Modify PowerShell profiles (that's Phase 2)
- ❌ Mount NAS (that's future, pending approval)
- ❌ Deploy to Cloudflare (that's future, pending approval)
- ❌ Auto-launch any editors
- ❌ Execute any state-changing commands
- ❌ Modify .cursor/projects or cache paths
- ❌ Touch secrets or sensitive data

The command center **suggests**, **recommends**, and **guides**. It does not **execute** sacred moves.

---

## Locked Laws

```text
✓ Command center ≠ command authority
✓ MiniBot guide ≠ autonomous operator
✓ Windows Terminal is cockpit, not deployment
✓ PowerShell shortcut is suggestion, not permission
✓ NAS declared ≠ mounted
✓ Cloudflare declared ≠ deployed
✓ GREEN ≠ deploy (signal confirms safety, not deployment)
✓ AMK-Goku owns sacred moves

✗ Auto-launch ≠ approval
✗ Shortcut ≠ execution
✗ Registry read ≠ registry write
✗ Profile suggestion ≠ profile modification
✗ Future domain ≠ active integration
```

---

## How to Use the Command Center

### Run the status checker

```powershell
npm run z:cmd:center
```

This will:

1. Load the registry
2. Check if main hub exists
3. Check if Labs workspace exists
4. Detect if code command is available
5. Detect if cursor command is available
6. Verify cwd is not in archive
7. Determine signal (GREEN/YELLOW/BLUE/RED)
8. Write reports (JSON + Markdown)
9. Print recommendations to console

### Use the recommendations

The output will suggest safe commands like:

```powershell
code "C:\Cursor Projects Organiser\Z_Sanctuary_Universe"
```

Copy and paste this into your terminal to open the IDE.

### Run the safe queue

After opening the IDE, run safe verification commands:

```powershell
npm run z:pc:ide-path
npm run z:ssws:cockpit
npm run z:ide:fusion
```

### Check the reports

Human-readable report:

```powershell
cat data/reports/z_cmd_center_report.md
```

Machine-readable JSON:

```powershell
cat data/reports/z_cmd_center_report.json
```

---

## Integration with Existing Systems

The command center integrates with:

- **Z_PC_IDE_ADMIN_1** – Admin mode detection and warnings
- **Z_PC_IDE_PATH_HEALTH_CHECK** – IDE path validation
- **AMK Dashboard** – Displays command center signal and recommended actions
- **Doorway + SSWS** – Workspace mode awareness
- **Z-IDE-FUSION** – IDE fusion operator rhythm

The command center is a **read-only guide layer** that sits above these systems and helps you navigate safely.

---

## Phase Roadmap

| Phase | Name | Focus | Risk |
| ----- | -------------------- | ----------------------------------------------------------- | ------ |
| 1 | **Z-CMD-CENTER-1** | Read-only guidance, root awareness, command recommendations | Low ✓ |
| 2 | Z-CMD-SHORTCUTS-1 | PowerShell functions for manual use (opt-in) | Low |
| 3 | Z-TERMINAL-LAYOUT-1 | Windows Terminal layout suggestions (dry-run) | Low |
| 4 | Z-PROFILE-OPTIN-1 | Optional profile installation (opt-in after AMK) | Medium |
| 5 | Z-NAS-AWARE-1 | NAS mount awareness (read-only, future) | Medium |
| 6 | Z-CLOUDFLARE-AWARE-1 | Cloudflare deployment awareness (read-only, future) | Medium |
| 7 | Z-LIVE-OPS-1 | Real launch/sync/deploy (AMK-only, far future) | High |

We are currently at **Phase 1 (Z-CMD-CENTER-1)**. Phases 2+ are future and require explicit planning/approval.

---

## FAQ

**Q: Does the command center auto-launch VS Code?**
A: No. Phase 1 prints recommendations. You copy-paste them manually. Auto-launch is Phase 2+ and optional.

**Q: Can I modify PowerShell profiles with this?**
A: No. Phase 1 is read-only. Profile modification is Phase 2 and requires opt-in.

**Q: Does the command center mount NAS?**
A: No. NAS is declared but not activated. That's Phase 5+ pending AMK approval.

**Q: Does the command center deploy to Cloudflare?**
A: No. Cloudflare is declared but not activated. That's Phase 6+ pending approval.

**Q: What if I get a RED signal?**
A: Stop. Fix the issue. Either your main hub is missing or you're in .cursor/projects. Do not proceed until this is resolved.

**Q: What if I get YELLOW?**
A: Warnings detected (missing optional tool or Labs). Safe to proceed but consider installing missing IDE.

**Q: What if I get BLUE?**
A: No IDE commands available. Install VS Code or Cursor, then re-run the check.

---

## Zuno Verdict 🦉✨

The Windows Command Center MiniBot is a **read-only guide** for Phase 1. It knows the roots, detects tools, prints safe recommendations, and signals readiness. It's not an operator — it's a guide. You remain in control of every action.

Future phases will add PowerShell shortcuts, terminal layout suggestions, and eventually live operations — but all behind explicit gates and opt-in decisions.

**Command authority stays with AMK-Goku. The MiniBot only guides.**

---

**Phase:** Z_CMD_CENTER_1
**Status:** Read-Only
**Locked:** Command authority with AMK
