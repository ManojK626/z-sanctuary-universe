# Cursor phased implementation guide

Aligned with [Z_SANCTUARY_IMPLEMENTATION_LANES.md](../Z_SANCTUARY_IMPLEMENTATION_LANES.md).

## Phase A — Align truth (no user-visible product)

- Confirm `id`, `registry_status`, `expected_paths` in master registry.
- Run Zuno audit and phase plan JSON.
- Regenerate `docs/modules/**` and indexes (`npm run z:docs:modules`).

## Phase B — Thin vertical slice (evidenced)

- Implement inside paths already listed and verified present.
- Add tests or structure verify hooks only where the repo already uses that pattern.

## Phase C — Expand surface (still gated)

- Dashboard or HTML panels: follow Z-ACN/MTEH and manifest rules in `AGENTS.md`.
- No new external services without explicit approval (hub policy).

## Phase D — Sensitive modalities

- Only after boundary docs + human sign-off: health, gambling-adjacent, lottery, intimacy, payments, devices.

## Phase E — Release proof

- `npm run verify:full:technical` when appropriate; never bypass execution enforcer or `manual_release` story without human authority.
