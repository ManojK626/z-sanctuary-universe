# 🦉 VS-FALLBACK-1: VS Code Operating Mode

**Status:** ✅ **ACTIVE**
**Effective:** May 5, 2026 onwards
**Scope:** Safe editing and terminal gates in VS Code when Cursor is unavailable
**Principle:** Turtle Mode — no deploy, no secrets, no auto-launch, no billing bridges

---

## 🎯 Core Distinction

### ⚠️ Archive ≠ Runtime

| Folder | Purpose | Trust Level |
| --------------------------------------------------- | --------------------------------------------------- | --------------------- |
| `.cursor\projects\` | Agent transcripts, metadata, Cursor internal memory | Archive evidence only |
| `C:\Cursor Projects Organiser\Z_Sanctuary_Universe` | Real working repo, npm scripts, build gates | Authoritative source |

**Law:**

```text
Healthy transcripts ≠ repo build health
Archive verification ≠ runtime proof
.cursor metadata ≠ working repo
Cursor health check ≠ Z-Sanctuary readiness
```

---

## 🛡️ VS Code Safe Posture

### What IS safe in VS Code

- ✅ Read files
- ✅ Edit docs (non-code)
- ✅ Edit code for review
- ✅ Run `npm run verify:*` commands
- ✅ Run `npm run z:traffic` (read status)
- ✅ Run `npm run z:car2` (read status)
- ✅ Run `npm run amk:doorway:status` (read profile status)
- ✅ Run `npm run amk:workspace:profiles` (read profiles)
- ✅ Run dry-run operations (`-DryRun` flag)
- ✅ Terminal gates (test-only)

### What IS NOT safe without AMK-Goku approval

- ❌ Deploy to any environment
- ❌ Direct API calls to production
- ❌ Auto-launch scripts
- ❌ Billing system changes
- ❌ User data modifications
- ❌ Secret management without isolation
- ❌ Bridge activation (Z-Compass, Z-Comms bridges)
- ❌ Database schema changes
- ❌ Package initialization in `.cursor` folders

---

## 📋 Daily VS Code Workflow

### Step 1: Open the Real Hub

```powershell
cd "C:\Cursor Projects Organiser\Z_Sanctuary_Universe"
```

**Never:**

```powershell
cd "C:\Users\manoj\.cursor\projects\..."
```

### Step 2: Verify Basic Health

```powershell
dir package.json
npm run verify:md
npm run z:traffic
npm run z:car2
npm run amk:doorway:status
npm run amk:workspace:profiles
```

**Expected output:**

- `package.json` exists (already initialized)
- `verify:md` passes (no lint errors)
- `z:traffic` shows status
- `z:car2` shows status
- `amk:doorway:status` shows profile status
- `amk:workspace:profiles` lists available profiles

### Step 3: Edit & Test Dry-Run

If working on **Franed profile** (test/sandbox):

```powershell
npm run amk:doorway:open -- -Profile franed -DryRun
```

If working on **main_control profile** (production gates only, still dry-run):

```powershell
npm run amk:doorway:open -- -Profile main_control -DryRun
```

**Dry-run means:**

- Shows what would happen
- Makes no real changes
- Requires no secret exposure
- Safe for terminal testing

### Step 4: Document Changes

If editing code or docs:

```powershell
git add .
git commit -m "your message"
```

---

## 🔍 How to Identify Real vs Archive

### Real Repo Signals

- ✅ Location: `C:\Cursor Projects Organiser\Z_Sanctuary_Universe`
- ✅ Contains: `package.json` (with npm scripts)
- ✅ Contains: `docs/`, `scripts/`, `src/`
- ✅ Contains: `.git/`
- ✅ npm scripts work: `npm run verify:md`, `npm run z:traffic`

### Archive Signals

- 🔍 Location: `C:\Users\manoj\.cursor\projects\...`
- 🔍 Contains: `agent-transcripts/`, `agent-tools/`, `assets/`
- 🔍 **No** `package.json`
- 🔍 **No** working npm scripts
- 🔍 **No** `.git/` (metadata only)
- ⚠️ For **reference and evidence** only

---

## ⚖️ Locked Laws

```text
1. Cursor archive health ≠ repo build health
2. VS Code task ≠ deployment
3. Package initialization ≠ permission
4. Healthy transcripts ≠ runtime ready
5. Dry-run ≠ actual change
6. Terminal test ≠ production gate
7. AMK-Goku owns sacred moves (auth, deploy, secrets)
```

---

## 🚫 Protection Rules

### Never do this in VS Code

```powershell
cd "C:\Users\manoj\.cursor\projects\c-Cursor-Projects-Organiser-ZSanctuary-Universe"
npm init
npm run deploy
npm run bridge:activate
echo ${{ secrets.API_KEY }}
```

### Always do this in VS Code

```powershell
cd "C:\Cursor Projects Organiser\Z_Sanctuary_Universe"
npm run verify:md
npm run amk:doorway:open -- -Profile franed -DryRun
git add docs/my_changes.md
git commit -m "docs: add my work"
npm run z:traffic
```

---

## 🔄 Workflow for the Next Week

### If Editing Docs

1. Open real repo in VS Code
2. Edit `docs/*.md` files
3. Run `npm run verify:md`
4. Commit to git branch
5. Leave for Cursor/AMK review

### If Testing Code

1. Open real repo in VS Code
2. Edit `src/` or `scripts/` files
3. Run relevant test gate (if available)
4. Use dry-run flags for safety
5. Commit to git branch
6. Leave for Cursor/AMK review

### If Checking Status

1. Run `npm run z:traffic`
2. Run `npm run amk:doorway:status`
3. Run `npm run amk:workspace:profiles`
4. No changes made, safe to run anytime

---

## 🛡️ Emergency Protocol

**If you accidentally open `.cursor` folder:**

```powershell
exit
cd "C:\Cursor Projects Organiser\Z_Sanctuary_Universe"
ls package.json
pwd
```

**If you accidentally run npm init in `.cursor`:**

```powershell
cd "C:\Cursor Projects Organiser\Z_Sanctuary_Universe"
```

Report to AMK-Goku. The `.cursor` folder will be cleaned as part of normal Cursor maintenance.

---

## 📚 Related Documentation

- [docs/INDEX.md](INDEX.md) — Full navigation
- [docs/AI_BUILDER_CONTEXT.md](AI_BUILDER_CONTEXT.md) — Builder posture
- [docs/Z_IDE_FUSION_WORKFLOW_CONTROL.md](Z_IDE_FUSION_WORKFLOW_CONTROL.md) — Shared Cursor + VS Code evidence spine
- [docs/Z_SEC_TRIPLECHECK_COMMUNICATION_FLOW_AUDIT.md](Z_SEC_TRIPLECHECK_COMMUNICATION_FLOW_AUDIT.md) — Triple-check drift audit before new lanes
- [docs/Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md) — Command structure

---

## ✅ Acceptance Criteria

This fallback mode is active when:

1. ✅ Cursor is temporarily unavailable
2. ✅ You need to edit or verify using VS Code
3. ✅ All changes stay as git commits (not auto-deployed)
4. ✅ Dry-run only for operational tests
5. ✅ No secrets exposed in terminal
6. ✅ Real repo location is used (not `.cursor`)
7. ✅ AMK-Goku remains authority for sensitive gates

---

## 🦉 Zuno Verdict

```powershell
This mode is:
✅ Safe for editing
✅ Safe for verification
✅ Safe for status checks
✅ Safe for dry-run tests
✅ Safe until Cursor returns

As long as you:
✅ Use the real repo root
✅ Keep changes in git
✅ Use dry-run flags
✅ Don't expose secrets
✅ Don't auto-deploy
✅ Respect Turtle Mode
```

---

**Fallback Active** 🦉✨
**Guardian Protocol:** Turtle Mode
**AMK-Goku Authority:** Always respected
