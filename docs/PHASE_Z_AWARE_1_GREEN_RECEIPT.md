# Phase Z-AWARE-1 — GREEN receipt (manual)

**Scope:** Docs + JSON registry + alert policy + example capsule + hub/z-questra capsules + read-only validator + reports + AMK indicator/notification metadata. **No** deploy, DNS, billing, secrets, provider calls, live bridges, auto-merge, destructive actions, runtime orchestration, or uncontrolled agents.

## Manual checklist

- [ ] `node -e` parses `data/z_ecosystem_awareness_registry.json` and `data/z_ecosystem_alert_policy.json`.
- [ ] `npm run z:ecosystem:awareness` exits **0** unless you intentionally break a **required** capsule (then expect exit **1** only when overall **RED**).
- [ ] `npm run verify:md` exits 0.
- [ ] `npm run z:traffic` and `npm run z:car2` exit 0.
- [ ] Open indicators UI (HTTP) and confirm `z_ecosystem_awareness_spine` overlays from `data/reports/z_ecosystem_awareness_report.json`.
- [ ] Confirm **YELLOW** optional projects do not flood notifications; **held** BLUE/RED template lanes stay deprioritized until you promote from report candidates.

## Rollback

1. Remove `z:ecosystem:awareness` from `package.json` and the `allowed_automatic_evidence_tasks` / `conceptual_integrations` entries from `data/z_autonomy_task_policy.json`.
2. Delete `scripts/z_ecosystem_awareness_check.mjs`, registry, policy, example capsule, hub capsule, z-questra capsule (if reverting z-questra), and Z-AWARE docs.
3. Revert `data/amk_operator_notifications.json`, `dashboard/data/amk_project_indicators.json`, and `dashboard/scripts/amk-project-indicators-readonly.js` overlay wiring.
4. Remove generated `data/reports/z_ecosystem_awareness_report.{json,md}` if desired.

## Evidence

- [Z_ECOSYSTEM_AWARENESS_SPINE.md](./Z_ECOSYSTEM_AWARENESS_SPINE.md)
