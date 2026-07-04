# Zuno Universe Report — Standard Specification

**Version:** 1.0 · Schema: `z_zuno_universe_report_v1` (embedded in department_reports)  
**Purpose:** Every major project publishes the **same report shape** for Mission Control comparison.

---

## Standard fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| `project` | string | Display name |
| `department_id` | string | Registry id |
| `system_id` | string | System identifier |
| `current_phase` | string | Lifecycle phase |
| `current_branch` | string | Active git branch (when known) |
| `current_status` | string | Merge Hold / active / etc. |
| `architecture` | string | FROZEN / HOLD / active |
| `governance` | string | Merge Hold, DRP posture |
| `implementation` | string | NOT AUTHORIZED / chartered |
| `verification` | string | Evidence summary |
| `tests` | string | Test posture |
| `open_issues` | string[] | Honest blockers |
| `known_risks` | string[] | Risk register |
| `dependencies` | string[] | Other departments |
| `commercial_readiness` | string | Early / N/A / ready |
| `documentation` | string | present / gap |
| `last_review` | string | ISO date |
| `recommended_next_step` | string | Operator guidance |
| `overall_health` | signal | GREEN / YELLOW / BLUE / RED |
| `department_card` | object | Dashboard card subset |

---

## Department card subset

| Field | Description |
| ----- | ----------- |
| `current_phase` | Phase label |
| `architecture` | Architecture posture |
| `merge_hold` | boolean |
| `runtime` | Runtime authorization |
| `readiness` | Readiness label |
| `open_risks` | Top risks |
| `next_action` | Next recommended action |
| `required_human_gate` | Gate description |
| `latest_ai_review` | Consolidated AI note |
| `latest_validation` | Report paths + signals |
| `dependencies` | Dependency ids |

---

## Generation

```bash
npm run z:universe:status
```

Department registry: `data/z_universe_department_registry.json`  
Rollup output: `data/reports/z_universe_status_report.json`

---

## Rules

1. Reports are **read-only evidence** — not permission to deploy.  
2. **UNKNOWN** is valid — never fabricate GREEN.  
3. Sacred moves always show **required_human_gate**.  
4. Each project may extend with `_extensions` in future schema versions — core fields stay stable.

---

## Related

- [Z_UNIVERSE_MISSION_CONTROL_ARCHITECTURE.md](Z_UNIVERSE_MISSION_CONTROL_ARCHITECTURE.md)  
- [Z_UNIVERSE_STATUS_ENGINE.md](Z_UNIVERSE_STATUS_ENGINE.md)
