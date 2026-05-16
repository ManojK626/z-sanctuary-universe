# PHASE AetherNav 0 — Green Receipt

## Scope

Phase 0 delivered **documentation only** for AetherNav — a **privacy-first spatial intelligence and map guidance** lane **separate from LinguaCore**.

| Artifact | Path |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| Master blueprint | [AETHERNAV_MASTER_BLUEPRINT.md](AETHERNAV_MASTER_BLUEPRINT.md) |
| Integration map | [AETHERNAV_Z_SANCTUARY_INTEGRATION_MAP.md](AETHERNAV_Z_SANCTUARY_INTEGRATION_MAP.md) |
| Privacy / 14 DRP | [AETHERNAV_PRIVACY_SAFETY_AND_14_DRP_POLICY.md](AETHERNAV_PRIVACY_SAFETY_AND_14_DRP_POLICY.md) |
| Phase ladder | [AETHERNAV_PHASE_LADDER.md](AETHERNAV_PHASE_LADDER.md) |
| Hub hooks | [INDEX.md](../INDEX.md), [AI_BUILDER_CONTEXT.md](../AI_BUILDER_CONTEXT.md) |

**No** runtime, APIs, map processing, AR, location tracking, biometrics, deployment, `data/reports/*` churn, or module manifest writes in this phase.

## Standing law

```text
navigation assistance is not emergency authority
mock readiness does not equal production approval
user consent is required for any location or personal data
```

## Commands

```bash
npm run verify:md
```

## Acceptance

- AetherNav documented as **its own lane** (not inside LinguaCore).
- Future ties to LinguaCore, tourism, accessibility, AT Princess & Blackie, and dashboards described — not implemented.
- Phase ladder 0–5 documented with hard exclusions.
- `verify:md` exits 0.

## Next phase (not in this PR)

**Phase 1:** static mock map cockpit — separate branch `cursor/zsanctuary/aethernav-phase-1-mock-cockpit` after human review of Phase 0 merge.

## Rollback

Revert Phase 0 commit; run `npm run verify:md`.
