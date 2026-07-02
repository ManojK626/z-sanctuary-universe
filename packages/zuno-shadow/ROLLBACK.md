# Rollback — @z-sanctuary/zuno-shadow

**Package:** Phase 2A Package 3
**Risk:** Low — standalone TypeScript library with no runtime services

## Safe removal

1. Delete `packages/zuno-shadow/` from the hub monorepo.
2. Revert catalog updates in `docs/vile/PACKAGE_CATALOG.md` and `docs/vile/IMPLEMENTATION_PHASES.md` if merged.
3. Run `npm install` at hub root if workspace references remain in lockfile (npm will prune unused workspace).

No other packages in Phase 2A currently depend on `zuno-shadow`. Removal does not affect `zuno-observability` or `zuno-security`.

## No runtime dependencies

This package:

- Performs no network requests
- Starts no daemons or background workers
- Does not register API routes or UI components
- Does not modify hub `data/` reports or registries at install time

Rollback requires **no** infrastructure teardown.

## Expected rollback effects

| Area               | Effect                                                    |
| ------------------ | --------------------------------------------------------- |
| Hub verify scripts | None unless a future phase wires shadow into verify gates |
| Applications       | None until an app explicitly imports this package         |
| VILE docs          | Revert `zuno-shadow` status to PLANNED in catalog         |
| Git history        | Prior commits remain; optional revert commit on branch    |

## Verification after rollback

```bash
npm run build --workspace=@z-sanctuary/zuno-observability
npm run build --workspace=@z-sanctuary/zuno-security
```

Confirm hub structure verify still passes if used in your lane.
