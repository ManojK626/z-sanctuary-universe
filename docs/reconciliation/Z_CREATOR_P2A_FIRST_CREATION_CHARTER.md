# Z-Creator P2A — First creation charter

**Charter ID:** `Z-CREATOR-P2A-FIRST-CREATION-CHARTER`  
**Phase:** Z-CREATOR-P2A  
**Kind:** Phase-scoped authorization record (not a constitutional layer)  
**Requested by:** AMK-Goku / Steward  
**Human review:** **required** before merge

---

## Authorization (this cycle only)

| Field | Value |
| --- | --- |
| Domain | `DOCUMENTATION_SPECIFICATION` only |
| Artefacts | **one** — `docs/creator/Z_CREATOR_SOFTWARE_CREATION_CYCLE_V1.md` |
| Verification | **one** — `npm run aafrtc:ci` |
| Runtime code | **none** |
| Application execution | **none** |
| Provider / Atoms / Cloudflare / R2 | **none** |
| Deployment | **none** |
| External network (this slice) | **none** (CI is local hub scripts) |
| Child-project mutation | **none** |
| Human review | **required** |

This charter authorizes **Creation Intake Binding** plus one bounded documentation artefact. It does **not** authorize a Foundry, orchestrator, app factory, agents, or a second verify mode.

---

## Bound identifiers

| Field | Value |
| --- | --- |
| Request ID | `req-z-creator-p2a-001` |
| Task-plan ID | `plan-z-creator-p2a-001` |
| Intake | `data/reconciliation/z_creator_p2a_first_creation_intake.json` |

---

## Forbidden

Normalize `docs/INDEX.md`; absorb unrelated `package.json` dirt; run `aafrtc:full-core` / `:full` / `:resolve`; merge; push; execute the task plan.
