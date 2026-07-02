# Rollback — @z-sanctuary/zuno-observability

## Safe removal

This package is **standalone**. No hub runtime, API, or dashboard depends on it yet.

### Steps

1. Revert the PR or delete `packages/zuno-observability/`
2. Run `npm install` from hub root (refresh lockfile if package was linked)
3. No database migrations — none exist
4. No deploy rollback — nothing was deployed

## Runtime dependencies

**None on application code.** Consumers are future Phase 2B+ services.

Removing this package does not stop:

- Hub verify scripts
- Zuno snapshot
- Existing dashboards

## Expected effects after rollback

| Area | Effect |
| ---- | ------ |
| Hub verify | Unchanged |
| VILE contracts docs | Unchanged (canonical schema remains in `docs/vile/`) |
| Future services | Must wait for package restore or inline validation (not recommended) |

## Re-install

```bash
git checkout <commit-with-package>
npm install
npm run build --workspace=@z-sanctuary/zuno-observability
npm run test --workspace=@z-sanctuary/zuno-observability
```
