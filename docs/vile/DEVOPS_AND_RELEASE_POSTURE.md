# DevOps and Release Posture

**Law:** GitHub hosts reality · Cloudflare hosts approved assets · AMK approves sacred moves

## CI alignment (hub)

| Stage | Command |
| ----- | ------- |
| Docs | `npm run verify:md` |
| Hub metadata | `npm run verify:hub:metadata` |
| PR technical proof | `npm run verify:sanctuary-github-pr` |
| Full (enforcer) | `npm run verify:full` — blocked until release governance |

## Branch workflow

```text
cursor/zsanctuary/vile-* → Draft PR → Review → AMK Gate → Merge
```

## Environments (future)

| Env | Purpose | Gate |
| --- | ------- | ---- |
| local | Developer | Default |
| preview | Static / API preview | Cloudflare charter |
| staging | Integration | AMK |
| production | Live | AMK + legal + security receipts |

**No production bind in Phase 1.**

## Rollback

Every release artifact requires:

- Previous known-good tag or commit  
- Database migration down plan (when DB exists)  
- Feature flag off switch  
- Operator comms template  

## Observability in CI

- Test reports archived in PR  
- DRP + security reports attached to phase receipts  

## Related

- [Z-GITHUB-SANCTUARY-GATE.md](../Z-GITHUB-SANCTUARY-GATE.md)  
- [Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md](../Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md)  
- [DEVOPS — Operational Posture](../Z_SANCTUARY_OPERATIONAL_POSTURE_2026.md)  
