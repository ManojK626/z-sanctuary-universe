# ZAG-1 — Autonomous Guardian Loop · Green receipt

## Scope

**Docs plus policy JSON only.** No daemons, schedulers, deployment, provider calls, API calls, billing execution, bridge execution, autonomous merge, or live automation added.

## Delivered

| Item | Path |
| ----------------------- | -------------------------------------------------- |
| Guardian loop doctrine | `docs/Z_AUTONOMOUS_GUARDIAN_LOOP.md` |
| Autonomy levels policy | `docs/Z_AUTONOMY_LEVELS_POLICY.md` |
| Machine-readable policy | `data/z_autonomy_task_policy.json` |
| Receipt | `docs/Z_AUTONOMOUS_GUARDIAN_LOOP_GREEN_RECEIPT.md` |

## Verify

```bash
node -e "JSON.parse(require('fs').readFileSync('data/z_autonomy_task_policy.json','utf8'))"
npm run verify:md
npm run z:traffic
npm run z:car2
```

## Manual checklist

| Check | Pass |
| ------------------------------------------------ | ---- |
| L0–L5 definitions match operator understanding | ☐ |
| Evidence scripts listed match hub `package.json` | ☐ |
| Human-gated list matches org risk posture | ☐ |
| No executor/daemon added | ☐ |

## Operator sign-off

| Role | Name | Date |
| -------- | ---- | ---- |
| Operator | | |

## Rollback

Remove the four paths in **Delivered** and revert any cross-links added elsewhere (none required for ZAG-1).
