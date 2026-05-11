# tools/z-maos — Z-MAOS manifests

**Z-MAOS** = Z-Sanctuary **Multi-Project AI Operating Supervisor** (operator coordination, not autonomous control).

**Doctrine:** [docs/z-maos/Z_MAOS_CHARTER.md](../../docs/z-maos/Z_MAOS_CHARTER.md)

| File | Role |
| -------------------------------- | ------------------------------------------------------ |
| `project_registry.json` | Known projects, coupling, suggested health commands |
| `launch_requirements.json` | Per-project extensions + opening checks + safe reports |
| `mini_bot_routes.json` | Keyword → bot routing hints for `npm run z:maos-route` |
| `consent_matrix.json` | Gated action categories |
| `workspace_health_manifest.json` | Read-only file presence checks |

**Commands (hub root):**

- `npm run z:maos-status` — print ecosystem snapshot (read-only)
- `npm run z:maos-open` — opening cycle checklist; optional `--write` for `data/reports/z_maos_opening_cycle.md`
- `npm run z:maos-route -- <keyword>` — suggest mini-bot lane

**Operator rhythm:** Use `z:maos-status` daily; use `verify:full:technical` only for serious or pre-merge work. See [Opening Cycle Runbook — section 5](../../docs/z-maos/OPENING_CYCLE_RUNBOOK.md#5-daily-vs-serious-verification-operator-canon).

**Safety:** No auto-install, merge, deploy, delete, or external connect from these commands.
