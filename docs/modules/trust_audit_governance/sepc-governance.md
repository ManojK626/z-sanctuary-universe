# sepc-governance

## Registry Identity

| Field | Value |
| --------------------- | ---------------------- |
| **ID** | `sepc-governance` |
| **Category** | trust_audit_governance |
| **Registry status** | planned_stub |
| **Safety class** | low |
| **Z registry ZID** | sepc-governance |
| **Zuno audit status** | FOUND_PARTIAL |

## Purpose

Security, Etiquette, Protocol & Compassion gate.

## Current Evidence

> No implementation evidence paths declared in master registry (`expected_paths` empty) and no Zuno audit evidence paths. **Doctrine / stub / hold until paths exist on disk.**

## Current Build Posture

Registry lists **planned_stub**. No `expected_paths` in master registry — treat as doctrine, stub, or external until paths are added with on-disk proof.

**Phase 3 hints (from last plan JSON):**

- Master registry has zero expected_paths (Z_module_registry ZEntry absent on disk, non-path ZEntry, or vision doctrine row). Audit rule: zero paths ⇒ FOUND_PARTIAL.

## Safety Boundaries

Cross-check hub safety doctrine (generator suggestions only — human authority wins):

_No keyword-boundary match for this module. See hub [Z_SANCTUARY_SAFETY_INDEX.md](../../Z_SANCTUARY_SAFETY_INDEX.md) and `docs/safety/`._

## Allowed Next Steps

- Documentation and registry alignment only unless a separate charter approves code.
- Re-run `npm run zuno:coverage` after changing `expected_paths`.
- Re-run `npm run z:docs:modules` to refresh this file from truth sources.

## Forbidden Until Gate

- Auto-merge, deploy, publish, or enable payments without AMK consent and release gates.
- Invent files, paths, or features not listed in registry + evidence above.
- Activate GPS, camera, mic, health, gambling, emergency, soulmate/baby predictor, or marketplace automation without explicit boundary review.

## Cursor Builder Notes

- Read `data/z_master_module_registry.json` and this file together; registry ID is canonical.
- Do not claim **implemented** unless evidence paths above are present (or audit proves alternate evidence).
- Default deployment posture: **HOLD** unless AMK and Overseer workflow say otherwise.

## Zuno Verdict

`READY_FOR_DOCS_ONLY`
