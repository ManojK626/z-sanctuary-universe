# Phase Z-SSWS-ZLAB-1 — Green receipt (unified Cursor control spine)

**Scope:** Documentation + declarative registry only — **no** auto-deploy, secret writes, background execution, extension auto-install, or NAS mutation.

## Deliverables

| Item | Path |
| ------------------- | ----------------------------------------------------------------------------------- |
| Spine doc | [`docs/Z_SSWS_ZLAB_UNIFIED_CONTROL_SPINE.md`](Z_SSWS_ZLAB_UNIFIED_CONTROL_SPINE.md) |
| Machine registry | [`data/z_ssws_zlab_control_spine.json`](../data/z_ssws_zlab_control_spine.json) |
| Receipt (this file) | [`docs/PHASE_Z_SSWS_ZLAB_1_GREEN_RECEIPT.md`](PHASE_Z_SSWS_ZLAB_1_GREEN_RECEIPT.md) |

## Gates (required)

- `npm run verify:md`
- `npm run z:traffic`
- `npm run z:car2`

### Evidence

```text
2026-05-11: npm run verify:md — pass
2026-05-11: npm run z:traffic — ok; overall_signal GREEN
2026-05-11: npm run z:car2 — ok; files_scanned: 3244
```

## Posture checklist

| Check | Confirm |
| ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| No deploy / domain bind / secrets / auto-services / extension install / NAS mutate / force push in spine definition | Yes (explicitly forbidden in doc + JSON) |
| Z-SSWS = control spine; Z-Lab = supervised analysis layer | Yes |
| NAS = declaration-only until mount | Yes |

**Seal:** This phase establishes **posture and vocabulary** only; runtime behavior remains governed by existing hub scripts, Turtle Mode, and human gates.
