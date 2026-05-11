# Phase MCBURB-1 — green receipt (Z-MCBURB + Z-FBAP doctrine)

## Scope delivered

| Deliverable | Role |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| [Z_MCBURB_BACKUP_RECONVERGE_BOOSTER.md](./Z_MCBURB_BACKUP_RECONVERGE_BOOSTER.md) | Z-MCBURB purpose, boundaries, related systems |
| [Z_FBAP_FIRE_BACKS_AWARENESS_PROTOCOL.md](./Z_FBAP_FIRE_BACKS_AWARENESS_PROTOCOL.md) | Z-FBAP ethical logging posture, “original location” definition |
| [data/z_mcburb_backup_policy.json](../../data/z_mcburb_backup_policy.json) | Backup domains, allowed modes, forbidden actions, gates, related systems |
| [data/z_fbap_event_taxonomy.json](../../data/z_fbap_event_taxonomy.json) | Event types, severity, privacy class, allowed/forbidden metadata |

## Explicitly not in Phase MCBURB-1

- Live tracking, network surveillance, VPN deanonymization
- Backend listener service, auto-restore, destructive writes
- Provider calls, deployment, billing, bridge execution
- `scripts/z_mcburb_status.mjs` (reserved for a later chartered phase)

## Manual checklist (operator)

1. Read both doctrine pages and confirm the team agrees: **authorized path provenance only**, not personal location tracking.
2. Open `data/z_mcburb_backup_policy.json` and `data/z_fbap_event_taxonomy.json` — confirm JSON parses in your editor or with `node -e "JSON.parse(require('fs').readFileSync('data/z_mcburb_backup_policy.json'))"`.
3. Run `npm run verify:md` after any follow-up doc edits.
4. Run `npm run z:traffic` and `npm run z:car2` before widening operational or logging scope elsewhere.
5. Any future code that emits FBAP-style events must **map to this taxonomy** and **never** store `global_forbidden_metadata` fields from the JSON.

## Commands run (acceptance)

```bash
npm run verify:md
npm run z:traffic
npm run z:car2
```

(Execute from hub root after merging this phase.)

## Rollback

1. Remove `docs/security/Z_MCBURB_BACKUP_RECONVERGE_BOOSTER.md`, `docs/security/Z_FBAP_FIRE_BACKS_AWARENESS_PROTOCOL.md`, and this receipt.
2. Remove `data/z_mcburb_backup_policy.json` and `data/z_fbap_event_taxonomy.json` if the initiative is withdrawn (check for doc links first).
3. Remove any `docs/AI_BUILDER_CONTEXT.md` or index rows that pointed at this phase, if added.

## Zuno verdict (posture)

- **Z-MCBURB:** yes — backup and reconvergence **resilience**, read-first.
- **Z-FBAP:** yes — **privacy-respecting** event awareness taxonomy.
- **VPN deanonymization:** no.
- **Authorized source-path provenance:** yes.
- **Auto-restore / destructive merge:** future **human-gated** only.
