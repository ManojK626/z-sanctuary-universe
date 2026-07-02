# Rollback — @z-sanctuary/zuno-security

## Safe removal

Standalone package. No application or API depends on it yet.

1. Revert PR or delete `packages/zuno-security/`
2. `npm install` from hub root
3. No database or deploy rollback required

## Runtime dependencies

None on application code. `@z-sanctuary/zuno-observability` is independent.

## Expected effects

| Area | Effect |
| ---- | ------ |
| Hub verify | Unchanged |
| zuno-observability | Unchanged |
| VILE docs | Unchanged |

## Re-install

```bash
npm run build --workspace=@z-sanctuary/zuno-security
npm run test --workspace=@z-sanctuary/zuno-security
```
