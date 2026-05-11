# Phase Z-REPLICA-FABRIC-1 green receipt

## Delivered

- `docs/Z_REPLICA_FABRIC_GOVERNED_SELF_REPLICATION.md` — operator doctrine for governed OMNAI replica language.
- `data/z_replica_fabric_registry.json` — doctrine registry (`mode: governed_replication_doctrine_only`).
- `data/examples/z_replica_fabric_sample_missions.json` — advisory missions and optional RED fixture.
- `scripts/z_replica_fabric_check.mjs` — read-only validator; writes reports; updates AMK indicator **signal** for `z_replica_fabric_governance`.
- `data/reports/z_replica_fabric_report.json` and `data/reports/z_replica_fabric_report.md` — produced by `npm run z:replica:fabric`.
- Hub wiring: `package.json` script `z:replica:fabric`, `docs/INDEX.md`, `docs/AI_BUILDER_CONTEXT.md`, cross-links from Z-MOD-DIST, Z-XBUS, Z-SSWS-COCKPIT, Z-SEC-TRIPLECHECK, `data/z_autonomy_task_policy.json`, dashboard indicator row, overlay fetch in `dashboard/scripts/amk-project-indicators-readonly.js`.

## Acceptance

- Default `npm run z:replica:fabric` exits **0** when overall signal is **GREEN**, **YELLOW**, or **BLUE**.
- Exit **1** only when signal is **RED** (broken registry or deliberate fixture exercising forbidden execution posture).
- No runtime replication, autonomous agents, provider execution, deployments, billing, secrets, live API bridges, or auto-merge behaviors are introduced by this phase.

## Fixture exercise (optional)

To include the RED demonstration mission packaged in JSON:

```bash
set Z_REPLICA_FABRIC_INCLUDE_FIXTURES=1
npm run z:replica:fabric
```

(On PowerShell use `$env:Z_REPLICA_FABRIC_INCLUDE_FIXTURES='1'` before `npm run z:replica:fabric`.)

Expect **RED** and exit code **1**.

## Rollback

1. Remove the new doc, registry, example missions, and script paths listed above.
2. Delete report artifacts under `data/reports/z_replica_fabric_report.*`.
3. Remove `z:replica:fabric` from `package.json`.
4. Remove indicator id `z_replica_fabric_governance` from `dashboard/data/amk_project_indicators.json`.
5. Revert overlay hooks in `dashboard/scripts/amk-project-indicators-readonly.js` for `z_replica_fabric`.
6. Revert `docs/INDEX.md`, `docs/AI_BUILDER_CONTEXT.md`, related cross-links, and `data/z_autonomy_task_policy.json` entry.

## Locked law (summary)

Replica fabric output is **evidence and planning** only until AMK opens chartered execution lanes. **GREEN is not deploy.** **XBUS** remains the gate for anything external.
