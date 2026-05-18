# Z-SSWS × Z-Lab unified control spine (Phase Z-SSWS-ZLAB-1)

**Purpose.** Position **Z-SSWS** as the **main Cursor IDE project control spine** for hub and sibling PC folders, and **Z-Lab** as the **supervised background analysis layer** (readiness signals and reports), without conflating either with deploy, secrets, or NAS mutation.

**Machine registry.** [`data/z_ssws_zlab_control_spine.json`](../data/z_ssws_zlab_control_spine.json)

**Scope of this phase.** **Documentation and registry only.** No auto-deploy, no secret writes, no background execution beyond what an operator already runs explicitly, no extension auto-install, no NAS writes.

---

## Z-SSWS role (main spine)

Z-SSWS is the **primary cockpit** for operator alignment:

| Area | Definition |
| --- | --- |
| Main cockpit | Dashboards, AMK main control surfaces, and controlled navigation into projects (visibility and doorways, not silent execution) |
| Project registry | Alignment with canonical manifests and PC-root / EAII-facing registry truth where the hub owns the pointer |
| Readiness routing | Status-driven behavior: see status table below; doorways and tasks respect YELLOW warnings and BLUE holds |
| Doorway opening | Local-only governed open (Cursor / VS Code / Explorer) per doorway docs; not npm lifecycle or cloud bind |
| Mini-bot coordination | Traffic, cadence, and comms signals as **read-only or operator-triggered** lanes — no unapproved autonomous side effects |

Z-SSWS **coordinates**; it does **not** override Hierarchy Chief governance or human sacred-move gates.

---

## Z-Lab role (supervised analysis layer)

Z-Lab sits **behind** the spine as **observation and readiness**:

| Area | Definition |
| --- | --- |
| Background analysis | Aggregate checks, structure/registry validation, and report-style scans (as implemented in hub scripts) |
| Dry-run checks | Verifiers and lint-style passes that emit results without changing production or remote secrets |
| Report generation | JSON/Markdown artifacts under `data/reports/` (or equivalent) for operator review |
| Suggested Cursor prompts | Stored prompts and slash-command workflows — **suggestions only**; no automatic submission to AI services |
| Build-readiness scoring | Advisory tiers or scores; **does not** merge, deploy, or flip amber to green without full gate discipline |

Z-Lab **informs**; it does **not** silently mutate deployment or vault posture.

---

## Status values (shared vocabulary)

| Status | Meaning |
| --- | --- |
| GREEN | Safe to proceed with the described local or supervised action |
| YELLOW | Proceed only with explicit review; warnings are intentional |
| BLUE | Hold: AMK / governance decision before expanding scope |
| RED | Blocked: do not perform the gated action until posture recovers |
| NAS_WAIT | Path or capability depends on Synology/NAS; wait until mount and verification |

---

## Forbidden actions (this spine)

The following are **out of band** for spine automation and **must not** be triggered by Z-SSWS or Z-Lab machinery without explicit human charter and gates:

| Forbidden | Rationale |
| --- | --- |
| Deploy | Sacred move; separate release and overseer discipline |
| Bind domain | External surface coupling |
| Write secrets | Vault and policy violation risk |
| Auto-run services | Background execution and side effects |
| Install extensions | Cursor/IDE mutation without operator consent |
| Mutate NAS | Data path integrity until mount and policy |
| Force push | Git history risk; merge discipline |

---

## Synology / NAS posture

Until a NAS volume is **mounted and verified**:

- Paths in registry and docs may appear as **declarations of intent only**
- **No** hub automation writes, deletes, or syncs to Synology from this spine definition
- Use **NAS_WAIT** when an action depends on that mount

---

## Verification (hub)

From `ZSanctuary_Universe` root:

- `npm run verify:md`
- `npm run z:traffic`
- `npm run z:car2`

---

## Related

- Phase receipt: [`docs/PHASE_Z_SSWS_ZLAB_1_GREEN_RECEIPT.md`](PHASE_Z_SSWS_ZLAB_1_GREEN_RECEIPT.md)
- AMK project doorway (parallel doorway lane): [`docs/AMK_PROJECT_DOORWAY_LAUNCHER.md`](AMK_PROJECT_DOORWAY_LAUNCHER.md)
