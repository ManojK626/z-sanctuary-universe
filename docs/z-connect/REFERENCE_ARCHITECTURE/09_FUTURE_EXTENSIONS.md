# 09 — Future Extensions

**Handbook chapter** · [INDEX](INDEX.md)

## Architecture is frozen

Phase 1.5 is **complete**. Do not add contract layers without an AMK-gated ADR. The next work is **consolidation** (this handbook), **VILE foundation merge** (Stream A), and **Phase 1.6** only when the governance gate opens.

## Phase 1.6 (blocked)

| Deliverable | Source layers | Planned location |
| ----------- | ------------- | ---------------- |
| OpenAPI v1 | Domain + Interaction + ESC transitions | `docs/z-connect/api/v1/` |
| Logical database | Domain schemas + ESC states + consent append-only | `docs/z-connect/data/Z_CONNECT_LOGICAL_SCHEMA_v1.md` |
| Cross-walk matrix | Schema status ↔ ESC state ↔ API route | Phase 1.6 report |

[Roadmap](../Z_CONNECT_PHASE_1_5_ROADMAP.md)

## Sprint 0 (blocked)

Prerequisites:

- VILE Pkgs 1–3 on `main`  
- `zuno-drp` implemented  
- Merge Hold released for Z-Connect code  
- Phase 1.6 minimum complete (recommended)  

First code scope (planned): contract validation package, read-only profile mock — **no deploy, no payments, no messaging send**.

## Commercial parallel track (no runtime)

Brand, logo, UI language, App Store drafts, landing copy, mockups, onboarding guide, waitlist, pricing experiments.

[Z_CONNECT_COMMERCIAL_PREP_ASSETS.md](../Z_CONNECT_COMMERCIAL_PREP_ASSETS.md)

## Reuse beyond Z-Connect

### Z-Sanctuary principle

> The governance framework is reusable, but each application owns its own domain logic and experience states.

### Pattern adoption map

| Project | Reuse from Z-Connect | Own per project |
| ------- | -------------------- | --------------- |
| Compassion Platform | ESC law, gate taxonomy, Shadow/DRP pipeline | Domain schemas, flows, states |
| ZILWA | Governance reference, observability patterns | Booking/stay/experience states |
| Z-Legal | Consent + audit patterns | Case/document/review states |
| Zuno Intelligence | AI pipeline, Shadow | Observation/analysis states |

Each project cites [ESC_REUSABLE_PATTERN.md](../experience-state-contracts/ESC_REUSABLE_PATTERN.md) — **blueprint, not bridge**. No shared runtime without explicit charter + 14 DRP gate.

## Connection Tree future branches

Module branches defined; implementation per-branch when chartered:

[Z_CONNECT_MODULE_BRANCHES.md](../Z_CONNECT_MODULE_BRANCHES.md)

## What not to do

- Expand architecture indefinitely  
- Skip Phase 1.6 cross-walk  
- Implement runtime before VILE foundation merge  
- Couple Z-Connect runtime to sibling repos without charter  
- Flip Merge Hold without AMK approval  

## Healthy transition (AMK directive)

```text
1. Consolidate  →  this Reference Architecture handbook ✅
2. Protect      →  Merge Hold + frozen Phase 1.5
3. Review       →  VILE Pkgs 1–3 merge (Stream A)
4. Build        →  Phase 1.6 → Sprint 0 → deliberate implementation
```

## Related hub phases

| System | Doc |
| ------ | --- |
| VILE Phase 2A | [PHASE_2A_FOUNDATION_INTEGRATION_GREEN_RECEIPT.md](../../vile/PHASE_2A_FOUNDATION_INTEGRATION_GREEN_RECEIPT.md) |
| Z-Nexus Engine | [z-nexus-engine/](../../z-nexus-engine/) (separate product line) |
| ZILWA | [zilwa-living-experiences/](../../zilwa-living-experiences/) |
