# Universe Status Engine

**System ID:** Z-UNIVERSE-STATUS-1  
**Script:** `scripts/z_universe_status_report.mjs`  
**Command:** `npm run z:universe:status`  
**Posture:** Read-only · observer · no execution

---

## Pipeline position

```text
AMK-Goku Indicator Dashboard
        ↓
Universe Status Engine          ← this script
        ↓
Readiness Evaluation            ← dimensions + blockers
        ↓
DRP Governance                  ← human operator + policy
        ↓
Human Approval
        ↓
Approved Action
```

The engine **feeds** Mission Control. It does **not** replace DRP or human gates.

---

## Inputs (read-only)

| Source | Path |
| ------ | ---- |
| Department registry | `data/z_universe_department_registry.json` |
| PC root projects | `data/z_pc_root_projects.json` |
| Ecosystem awareness | `data/reports/z_ecosystem_awareness_report.json` |
| Cross-project observer | `data/reports/z_cross_project_observer.json` |
| Deployment readiness | `data/reports/z_deployment_readiness_status.json` |
| Cycle observe | `data/reports/z_cycle_observe_status.json` |
| Hub git | `git branch` / `HEAD` / `status --porcelain` (hub only) |
| Universe resolution | `docs/Z_SANCTUARY_UNIVERSE_RESOLUTION_2026_07_04.md` |

---

## Outputs

| File | Role |
| ---- | ---- |
| `data/reports/z_universe_status_report.json` | Machine rollup for dashboard overlay |
| `data/reports/z_universe_status_report.md` | Human-readable Mission Control brief |

Schema: `z_universe_status_report_v1`

---

## Does not

- Deploy, merge, build, or publish  
- Mutate sibling repositories  
- Auto-fix or auto-merge  
- Bypass Merge Hold or sacred gates  
- Scan arbitrary disks outside registries  

---

## Operator ritual

```bash
npm run z:universe:status
# Review data/reports/z_universe_status_report.md
# Cross-check Track A priorities before any sacred move
```

Refresh after registry edits, major phase completions, or before architecture review sessions.

---

## Related

- [Z_UNIVERSE_MISSION_CONTROL_ARCHITECTURE.md](Z_UNIVERSE_MISSION_CONTROL_ARCHITECTURE.md)  
- [Z_ZUNO_UNIVERSE_REPORT_SPEC.md](Z_ZUNO_UNIVERSE_REPORT_SPEC.md)
