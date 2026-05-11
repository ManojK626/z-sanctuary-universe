# PHASE Z-MAOS — Multi-Project AI Operating Supervisor (Report)

**Date:** 2026-05-01
**Repo:** ZSanctuary_Universe

## Files added

| Area | Path |
| ----------------- | --------------------------------------------------------------------- |
| Charter | `docs/z-maos/Z_MAOS_CHARTER.md` |
| Policy / workflow | `docs/z-maos/MULTI_PROJECT_REGISTRY_POLICY.md` |
| Policy / workflow | `docs/z-maos/AI_WORKSPACE_SUPERVISOR_WORKFLOW.md` |
| Policy / workflow | `docs/z-maos/EXTENSION_AND_TOOL_READINESS.md` |
| Policy / workflow | `docs/z-maos/OPENING_CYCLE_RUNBOOK.md` |
| Policy / workflow | `docs/z-maos/MINI_BOT_DISPATCH_RULES.md` |
| Policy / workflow | `docs/z-maos/AMK_CONSENT_GATES.md` |
| Policy / workflow | `docs/z-maos/AUTONOMY_LEVELS.md` |
| Policy / workflow | `docs/z-maos/CROSS_PROJECT_LINKING_POLICY.md` |
| Policy / workflow | `docs/z-maos/FRICTION_REMOVAL_PROTOCOL.md` |
| Policy / workflow | `docs/z-maos/FAILURE_ESCALATION_RULES.md` |
| Manifests | `tools/z-maos/README.md` |
| Manifests | `tools/z-maos/project_registry.json` |
| Manifests | `tools/z-maos/launch_requirements.json` |
| Manifests | `tools/z-maos/mini_bot_routes.json` |
| Manifests | `tools/z-maos/consent_matrix.json` |
| Manifests | `tools/z-maos/workspace_health_manifest.json` |
| Scripts | `scripts/z_maos_status.mjs` |
| Scripts | `scripts/z_maos_opening_cycle.mjs` |
| Scripts | `scripts/z_maos_task_router.mjs` |
| npm | `package.json` entries `z:maos-status`, `z:maos-open`, `z:maos-route` |

## Purpose

Operator-safe **ecosystem supervisor** doctrine plus read-only manifests and L0–L2 scripts: status, opening checklist, route hints. No merge/deploy/publish/delete/extension auto-install.

## Safety boundaries

- Default autonomy **L2**; L4/L5 forbidden unless future charter.
- XL2 **reference_only**; `repoPath` null in hub registry.
- Cross-link, do not cross-contaminate ([docs/z-maos/CROSS_PROJECT_LINKING_POLICY.md](docs/z-maos/CROSS_PROJECT_LINKING_POLICY.md)).

## Registry / extension / opening / routes / consent status

- **Registry:** seeded with hub + XL2 (reference) + Z-OCTAVE + Z-UCCR stubs.
- **Extension readiness:** documented; no auto-install ([docs/z-maos/EXTENSION_AND_TOOL_READINESS.md](docs/z-maos/EXTENSION_AND_TOOL_READINESS.md)).
- **Opening cycle:** runbook + `npm run z:maos-open` ([docs/z-maos/OPENING_CYCLE_RUNBOOK.md](docs/z-maos/OPENING_CYCLE_RUNBOOK.md)).
- **Mini-bot routes:** `tools/z-maos/mini_bot_routes.json` + dispatch doc.
- **Consent gates:** `tools/z-maos/consent_matrix.json` + AMK doc.

## Verification results

| Check | Result |
| ------------------------------------------------------------------------------ | ------------- |
| `npm run z:maos-status` | PASS (manual) |
| `node scripts/z_sanctuary_structure_verify.mjs` | PASS |
| `npx markdownlint-cli -c .markdownlint.json docs/z-maos/*.md` | PASS |
| `npx markdownlint-cli -c .markdownlint.json PHASE_Z_MAOS_SUPERVISOR_REPORT.md` | PASS |

## Next recommended phase

Wire optional `z:maos-open --write` into operator morning ritual only; expand `project_registry.json` as new satellites are chartered—still **no** auto coupling.

## Rollback

Remove `docs/z-maos/`, `tools/z-maos/`, `scripts/z_maos_*.mjs`, npm entries, and this report.
