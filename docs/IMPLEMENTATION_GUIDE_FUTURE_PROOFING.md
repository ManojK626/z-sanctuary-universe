# Implementation Guide: Future-Proofing Z-Sanctuary

## Phase 1: Immediate (This Week) ✅ COMPLETED

### ✅ Path Resolution Fixes Applied

All 8 affected tasks in `.vscode/tasks.json` have been updated with proper PowerShell quoting using `Push-Location`/`Pop-Location` pattern.

**Verification:**

```bash
# All these now execute successfully:
npm run "Z: Check VS Code Hygiene"
npm run "Z: System Status"
npm run "Z: System Status + Trust Pack"
```

---

## Phase 2: High Priority (Next 2 Weeks)

### Action 1: Folder Rename (4 hours)

**Current:** `Amk_Goku Worldwide Loterry`
**Target:** `amk-goku-worldwide-lottery`

**Steps:**

1. **Create new folder structure:**

```bash
mkdir amk-goku-worldwide-lottery
xcopy "Amk_Goku Worldwide Loterry\*" amk-goku-worldwide-lottery\ /E /I
```

1. **Update all task references** in `.vscode/tasks.json`:

```jsonc
// BEFORE:
"Push-Location 'Amk_Goku Worldwide Loterry'; python scripts/file.py; Pop-Location"

// AFTER:
"cd amk-goku-worldwide-lottery && python scripts/file.py && cd .."
```

1. **Test all 8 tasks:**

```bash
npm run "Z: Check VS Code Hygiene"
npm run "Z: Vault Health"
npm run "Z: JailCell Summary"
npm run "Z: System Status"
npm run "Z: System Status + Reputation"
npm run "Z: System Status + Trust Pack"
npm run "Z: AI + System Status (Grouped)"
npm run "Z: Trust Pack + AI Status (Grouped)"
```

1. **Update documentation:**

- `README.md`: Update all references
- `MONOREPO_GUIDE.md`: Update structure section
- `docs/Z_LAB_TASK_STRUCTURE.md`: Update path examples

1. **Archive old folder (after verification):**

```bash
ren "Amk_Goku Worldwide Loterry" "_archive_amk_goku_2026-02-23"
# Keep 30 days then delete
```

---

### Action 2: Establish Hygiene Automation (2 hours)

**Goal:** Keep privacy, security, and storage audits current

**Add to `.vscode/tasks.json`:**

```jsonc
{
  "label": "Z: Auto Daily Maintenance",
  "type": "shell",
  "command": "node scripts/z_hygiene_cycle.mjs && node scripts/z_privacy_scan.mjs && node scripts/z_anydevices_analyzer.mjs",
  "runOptions": { "runOn": "folderOpen" },
  "presentation": { "reveal": "silent", "panel": "shared" },
  "problemMatcher": []
},
{
  "label": "Z: Auto Weekly Deep Scan",
  "type": "shell",
  "command": "node scripts/z_storage_hygiene_guard.mjs && node scripts/z_data_layout_audit.mjs && npm run lint",
  "runOptions": { "runOn": "folderOpen" },
  "presentation": { "reveal": "silent", "panel": "shared" },
  "problemMatcher": []
}
```

**Configure in VS Code settings (`.vscode/settings.json`):**

```json
{
  "task.autoRunTasks": ["Z: Auto Daily Maintenance", "Z: Auto Weekly Deep Scan"]
}
```

**Expected Output:**

- Daily: Privacy, Storage, AnyDevices reports refreshed
- Weekly: Full data layout and hygiene validation

---

## Phase 3: Medium Priority (Sprint 2)

### Action 3: Path Resolution Resilience Pattern (3 hours)

**Goal:** Standardize path handling across all scripts

**Pattern for Node.js scripts:**

```javascript
// GOOD: OS-agnostic path resolution
const path = require('path');
const scriptPath = path.join(__dirname, '..', 'amk-goku-worldwide-lottery', 'scripts', 'file.py');
exec(`python "${scriptPath}"`);

// BAD: Hardcoded, fragile
exec('python "amk-goku-worldwide-lottery\\scripts\\file.py"');
```

**Apply to these files:**

- `scripts/z_ai_status_writer.js`
- `scripts/z_priority_audit.mjs`
- `core/action-executor.js`
- Any script spawning child processes

**Audit command:**

```bash
grep -r "cd \".*Worldwide" scripts/ core/
```

---

### Action 4: Python Consolidation (2 hours)

**Current State:**

- Legacy: `Amk_Goku Worldwide Loterry/scripts/` (22 files)
- Current: `/scripts/` (120+ files)

**Consolidation Plan:**

1. **Identify duplicates:**

```bash
# Check for duplicate names
ls Amk_Goku\ Worldwide\ Loterry/scripts/*.py | xargs -I {} basename {} > /tmp/legacy.txt
ls scripts/*.py | xargs -I {} basename {} > /tmp/current.txt
comm -12 <(sort /tmp/current.txt) <(sort /tmp/legacy.txt)
```

1. **For shared scripts, create shims** in legacy location:

```python
# Amk_Goku Worldwide Loterry/scripts/system_status.py (new, after rename)
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'scripts'))
from system_status_impl import *

if __name__ == '__main__':
    main()
```

1. **Create requirements-lock.txt:**

```bash
pip freeze > requirements-lock.txt
```

1. **Document deprecation path:**

```markdown
# Deprecated Script Locations

Legacy location: `amk-goku-worldwide-lottery/scripts/` (will be removed 2026-06-01)

Scripts have been consolidated to `/scripts/`. Use directly from there.

Migration guide: [See WORKSPACE_RUNBOOK.md]
```

---

### Action 5: Priority Queue Automation (1.5 hours)

**Goal:** Prevent P1 backlog accumulation

**Add monitoring task:**

```jsonc
{
  "label": "Z: Priority Monitor (15-min check)",
  "type": "shell",
  "command": "node scripts/z_priority_audit.mjs | node scripts/z_incident_reporter.mjs",
  "runOptions": { "runOn": "folderOpen" },
  "presentation": { "reveal": "silent" },
  "problemMatcher": [],
}
```

**Create incident threshold** (add to `scripts/z_incident_reporter.mjs`):

```javascript
const P1_WARNING_THRESHOLD = 5;
const P1_CRITICAL_THRESHOLD = 8;

if (p1Count > P1_CRITICAL_THRESHOLD) {
  console.error(`🚨 CRITICAL: ${p1Count} P1 blockers detected!`);
  // Notify: email, Slack, etc.
}
```

---

## Phase 4: Low Priority (Next Month)

### Action 6: Create Workspace Runbook (3 hours)

**File:** `/docs/WORKSPACE_RUNBOOK.md`

**Content:**

````markdown
# Z-Sanctuary Workspace Runbook

## Folder Purpose Legend

- `/core/` - Main system files
- `/scripts/` - Automation & utility scripts
- `/docs/` - Documentation
- `/data/` - Persistent data & reports
- `/config/` - Configuration files
- `/amk-goku-worldwide-lottery/` - Legacy application (deprecated)

## Path Resolution by OS

### Windows (PowerShell)

✅ CORRECT:

- `Push-Location 'Folder Name'; command; Pop-Location`
- `Join-Path $PSScriptRoot -ChildPath 'subfolder' | Join-Path -ChildPath 'file'`

❌ AVOID:

- Forward slashes with spaces: `cd ./Folder Name/subfolder`
- Relative paths without quotes: `cd Folder Name`

### macOS/Linux

✅ CORRECT:

- `cd ./folder-name/subfolder && command && cd -`
- `$(cd folder-name && pwd)/subfolder/file`

## Common Issues & Fixes

### "No such file or directory" - Folder with spaces

**Cause:** Shell interprets spaces as argument separators
**Fix:**

- Windows: Use Push-Location
- Unix: Use quotes or escaping

### Python script fails to import

**Cause:** sys.path doesn't include parent directories
**Fix:** Add to top of script:

```python
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
```
````

## Task Execution Flowchart

[Diagram showing task dependencies and execution order]

## Maintenance Calendar

[Weekly, monthly, quarterly, annual schedules]

---

## Verification Checklist

### Phase 1 (Completed ✅)

- [x] 8 path resolution errors fixed in tasks.json
- [x] All affected tasks tested successfully
- [x] Error patterns documented
- [x] Verification report created

### Phase 2 (Next Week)

- [ ] Folder rename planned & documented
- [ ] All task references updated
- [ ] Test each task with new folder name
- [ ] Documentation updated
- [ ] Old folder archived
- [ ] Daily automation tasks created
- [ ] Hygiene schedule verified

### Phase 3 (Next Sprint)

- [ ] Path resolution pattern guide created
- [ ] All scripts audited for hardcoded paths
- [ ] Python scripts consolidated
- [ ] Requirements locked
- [ ] Deprecation notice posted
- [ ] Priority monitoring active

### Phase 4 (Following Month)

- [ ] Runbook completed
- [ ] Team trained on conventions
- [ ] Documentation reviewed
- [ ] Maintenance cadence established

---

## Success Metrics

| Metric | Current | Target | Timeline |
| ----------------------------- | -------- | ------- | --------- |
| Path-related task failures | 8/8 | 0/8 | Week 1 ✅ |
| Hygiene report freshness | 3-6 days | < 1 day | Week 2 |
| P1 queue size | 8 | < 3 | Week 3 |
| Script location consolidation | 40% | 100% | Week 4 |
| Documentation completeness | 60% | 100% | Month 2 |

---

## Rollback Plan

If issues arise:

1. **Revert tasks.json** to previous version
2. **Restore archived folder** if renamed
3. **Document failure** in incident report
4. **Adjust approach** based on root cause

```bash
# Quick rollback
git checkout HEAD -- .vscode/tasks.json
git checkout HEAD -- Amk_Goku\ Worldwide\ Loterry/
```

---

## Contact & Escalation

- **Technical Issues:** Engineering team
- **Automation Problems:** DevOps team
- **Documentation Questions:** Technical writers
- **Security Concerns:** Security team

---

_Implementation Guide v1.0_
_Last Updated: 2026-02-23_
_Status: READY FOR EXECUTION_
