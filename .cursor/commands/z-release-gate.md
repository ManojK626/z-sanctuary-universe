# Z Release Gate

Run the **single release gate** for GO/HOLD with evidence artifacts.

From `ZSanctuary_Universe` root:

```powershell
npm run release:gate
```

This executes, in order:

1. `z_sanctuary_structure_verify.mjs`
2. `z_registry_omni_verify.mjs`
3. `z_report_freshness_check.mjs`
4. `z_cross_project_health_probe.mjs`
5. `z_boundary_service_ownership_check.mjs` (**fails on boundary/service ownership violations**)
6. `z_trust_scorecard.mjs`

Artifacts:

- `data/reports/z_release_gate.json`
- `data/reports/z_release_gate.md`
- `data/reports/z_trust_scorecard.json`
- `data/reports/z_trust_scorecard.md`

Report back to user:

- Verdict (`GO` or `HOLD`)
- Blockers list (if any)
- Trust score + grade
