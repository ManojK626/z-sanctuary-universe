<!-- Z: docs\PHASE_1_CHECKLIST.md -->

# Phase 1 Checklist — Core v1.0 Freeze

## Scope

- Freeze behavioral changes
- Document current baseline
- Keep tests green

## Steps

1. Confirm lint + tests are green.
   - `npm run lint`
   - `npm test`
2. Declare baseline in `SYSTEM_STATUS.md`.
   - Note: Core v1.0 stabilization
   - Quiet Mode active
   - Trust Pack reference active
3. Add a minimal CHANGELOG entry.
   - Quiet Mode surfaces
   - Trust Pack reference chip
   - Stillness messaging
4. Ensure Trust Pack points to the latest folder.
   - `exports/trust_pack_YYYY-MM`
5. No new runtime behavior changes until Phase 2.

## Exit Criteria

- Lint/tests green
- Baseline declared
- Trust Pack built
- No new runtime changes pending
