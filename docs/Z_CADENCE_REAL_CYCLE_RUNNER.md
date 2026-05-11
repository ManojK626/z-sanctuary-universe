# Z-CADENCE-1 — Real Cadence Cycle Runner + Dashboard Follow-Up

## Purpose

Run Logical Brains monitoring cadence as one safe command, produce cadence reports, refresh indicator metadata, and emit follow-up candidates only when blocked, AMK decision is required, or stable review readiness is reached.

## Scope

- Docs + JSON registry + read-only cadence runner + reports + indicator/notification metadata
- No runtime bridge, no deploy lane, no provider lane, no child-data lane, no vault runtime lane

## Automatic means

- run read-only checks
- refresh reports
- classify GREEN/YELLOW/BLUE/RED
- update dashboard indicator metadata
- create follow-up notification candidates for RED/BLUE/READY_REVIEW

## Automatic does not mean

- deploy
- runtime bridge enablement
- provider calls
- child-data lane enablement
- vault runtime enablement
- auto-merge or auto-launch

## Command

```bash
npm run z:cadence:logical-brains
```

## Allowlisted checks

- `npm run z:logical-brains:hub`
- `npm run z:numen:hub`
- `npm run z:mod:dist` (Z-MOD-DIST-1 advisory routing advisor; report-only)
- `npm run z:sec:triplecheck`
- `npm run z:ide:fusion`
- `npm run verify:md`
- `npm run z:traffic`
- `npm run z:car2`

## Follow-up logic

- GREEN + previous GREEN -> `READY_FOR_HUB_2_1_MONTHLY_REVIEW_TEMPLATE`
- otherwise GREEN -> `CONTINUE_CADENCE`
- BLUE -> `AMK_DECISION_REQUIRED`
- RED -> `BLOCKED_RED`

Two GREEN cadence cycles mean ready to draft HUB-2.1 review from evidence. It does not mean ready to deploy or public-release.

## Mr Bug boundary

- Docs-hygiene only
- No code/security/auth/deploy/child-data auto-fix

## Locked law

- Cadence runner != deployment.
- Follow-up notification != permission.
- Two GREEN cycles != public release.
- Auto-task follow-up != auto-execution.
- GREEN != deploy.
- BLUE requires AMK.
- RED blocks movement.
- AMK-Goku owns sacred moves.
