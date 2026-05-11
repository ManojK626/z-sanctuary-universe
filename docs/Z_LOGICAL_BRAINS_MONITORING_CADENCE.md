# Z-LOGICAL-BRAINS-HUB-2 — Ongoing Monitoring Cadence Checklist

## Purpose

Keep Logical Brains visible and healthy inside the main hub through repeatable checks: refresh reports, watch drift, preserve non-clinical posture, and keep public release at `NO_GO` until AMK opens a lane.

## Scope law

- Checklist only
- Docs-only maintenance
- No runtime widening
- No bridge execution
- No deploy or provider lane opening

## Daily / working-session quick check

Run in `C:\Cursor Projects Organiser\Z_Sanctuary_Universe`:

```bash
npm run z:logical-brains:hub
npm run z:numen:hub
npm run z:mod:dist
npm run z:sec:triplecheck
npm run z:ide:fusion
```

## Weekly / full check

Run in `C:\Cursor Projects Organiser\Z_Sanctuary_Universe`:

```bash
npm run verify:md
npm run z:traffic
npm run z:car2
```

## Labs-side check

Run in `C:\Cursor Projects Organiser\Z_Sanctuary_Universe\ZSanctuary_Labs`:

```bash
npm run verify:local
npm run z:labs:health
```

## Drift watch checklist

Confirm all remain true:

- Non-clinical wording remains intact.
- `public_release` remains `NO_GO`.
- `runtime_bridge_enabled` remains `false`.
- `provider_enabled` remains `false`.
- `child_data_collection_enabled` remains `false`.
- Z-NUMEN hub reference (`data/z_numen_hub_reference.json`): `profiling_enabled`, `social_scraping_enabled`, `psychological_targeting_enabled`, and `canvas_runtime_enabled` remain `false`; `public_release` remains `NO_GO`.
- `secure_vault_runtime` remains future-gated.
- `personal_ai_memory` remains future-gated.
- `cloud_sync` remains future-gated.
- `voice_input` remains future-gated.
- `multiplayer_classroom` remains future-gated.

## RED / BLUE / GREEN law

- RED blocks movement.
- BLUE requires AMK.
- GREEN does not deploy.

## Mr Bug policy boundary

- Docs-hygiene auto-fix only.
- No code/security/auth/deploy/child-data auto-fix.

## Locked law

- Monitoring cadence != runtime bridge.
- Checklist != deployment approval.
- Labs GREEN != public release.
- GREEN != deploy.
- BLUE requires AMK.
- RED blocks movement.
- AMK-Goku owns sacred moves.

## Real cadence runner

Use `npm run z:cadence:logical-brains` for one-command read-only cadence orchestration. It writes follow-up metadata only and never opens runtime, deploy, provider, child-data, or vault lanes.
