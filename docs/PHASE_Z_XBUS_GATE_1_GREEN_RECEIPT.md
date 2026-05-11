# PHASE Z-XBUS-GATE-1 — Green receipt

Scope delivered:

- external connector doctrine + security policy docs
- `data/z_xbus_connector_registry.json` metadata registry
- `data/z_xbus_connector_policy.json` Phase 1 law flags
- `data/examples/z_xbus_connector_samples.json` classifier fixtures
- read-only validator `scripts/z_xbus_connector_gate_check.mjs`
- gate reports under `data/reports/z_xbus_connector_gate_*`
- `npm run z:xbus:gate`
- dashboard indicator row + optional live overlay
- autonomy L1 evidence registration
- pointers in INDEX, AI Builder, MOD-DIST, SEC triplecheck, AMK indicators doc

Forbidden in this phase: live API/backend connectors, provider calls, billing, secrets committed, webhook execution, customer data flows, deploy, bridge execution, auto-launch, autonomous merge.

## Commands

```bash
node -e "JSON.parse(require('fs').readFileSync('data/z_xbus_connector_registry.json','utf8')); JSON.parse(require('fs').readFileSync('data/z_xbus_connector_policy.json','utf8')); console.log('Z-XBUS connector gate JSON OK')"
npm run z:xbus:gate
npm run verify:md
npm run z:traffic
npm run z:car2
npm run dashboard:registry-verify
```

## Acceptance

- JSON parses.
- `npm run z:xbus:gate` exits **1** only on overall **RED**.
- Markdown and dashboard registry verify succeed after wiring.

## Rollback

Revert all files touched in Z-XBUS-GATE-1 plus indicator/overlay/dashboard script snippet; delete generated reports optional; rerun `npm run verify:md` and `npm run dashboard:registry-verify`.
