# GPS / location safety posture (concept)

## Registry Identity

| Field | Value |
| --- | --- |
| **ID** | `gps_safety_module` |
| **Category** | safety_emergency |
| **Registry status** | safety_hold |
| **Safety class** | high |
| **Z registry ZID** | — |
| **Zuno audit status** | NEEDS_SAFETY_REVIEW |

## Purpose

See master registry `notes` and hub doctrine; no extra claims added by generator.

## Current Evidence

> No implementation evidence paths declared in master registry (`expected_paths` empty) and no Zuno audit evidence paths. **Doctrine / stub / hold until paths exist on disk.**

## Current Build Posture

Registry lists **safety_hold**. No `expected_paths` in master registry — treat as doctrine, stub, or external until paths are added with on-disk proof.

**Closure / safety notes:**

- Doctrine / safety_hold: boundary text verifies; no implementation paths yet — creator sign-off before any UX or automation.

## Safety Boundaries

Cross-check hub safety doctrine (generator suggestions only — human authority wins):

- [`LOCATION_CAMERA_MIC_BOUNDARY.md`](../../safety/LOCATION_CAMERA_MIC_BOUNDARY.md)
- [`GAMBLING_PREDICTION_BOUNDARY.md`](../../safety/GAMBLING_PREDICTION_BOUNDARY.md)
- [`BABY_PREDICTOR_CONSENT_BOUNDARY.md`](../../safety/BABY_PREDICTOR_CONSENT_BOUNDARY.md)
- [`NON_MEDICAL_PRODUCT_BOUNDARY.md`](../../safety/NON_MEDICAL_PRODUCT_BOUNDARY.md)
- [`MIRRORSOUL_PRIVACY_BOUNDARY.md`](../../safety/MIRRORSOUL_PRIVACY_BOUNDARY.md)
- [`LOTTERY_RESPONSIBLE_USE_BOUNDARY.md`](../../safety/LOTTERY_RESPONSIBLE_USE_BOUNDARY.md)

## Allowed Next Steps

- Documentation and registry alignment only unless a separate charter approves code.
- Re-run `npm run zuno:coverage` after changing `expected_paths`.
- Re-run `npm run z:docs:modules` to refresh this file from truth sources.

## Forbidden Until Gate

- Auto-merge, deploy, publish, or enable payments without AMK consent and release gates.
- Invent files, paths, or features not listed in registry + evidence above.
- Activate GPS, camera, mic, health, gambling, emergency, soulmate/baby predictor, or marketplace automation without explicit boundary review.
- Treat as **safety hold** — no speculative code paths until governance clears.

## Cursor Builder Notes

- Read `data/z_master_module_registry.json` and this file together; registry ID is canonical.
- Do not claim **implemented** unless evidence paths above are present (or audit proves alternate evidence).
- Default deployment posture: **HOLD** unless AMK and Overseer workflow say otherwise.

## Zuno Verdict

`SAFETY_HOLD`
