# Zuno “Super Saiyan” knowledge guide — design note (ZSX-1)

## Intent

Plan a **read-only knowledge and routing assistant** that helps operators navigate the Sanctuary stack — **not** an unconstrained super-bot with silent tool execution.

Working name: **Zuno Super Saiyan Knowledge Guide** (persona label only; implementation is phased).

## Phase 1 posture (this document)

- **Read-only knowledge manifest + prompt/personality policy** — no live external APIs, no provider keys, no automatic execution across projects.
- Answers should **cite** hub artifacts: Zuno reports, Z-CAR² outputs, AI Builder context, orchestration README, Questra capability manifest, service catalog, entitlement catalog, cross-project index, shadow policy, 14 DRP/DOP docs.

## Future lane (governed only)

Later additions — **only** through explicit adapters and gates:

- Provider-backed research,
- Deep retrieval across private repos,
- Live orchestration hooks.

Each adapter needs **DRP/DOP review**, logging boundaries, and human overrides.

## Personalities and observers

| Reference | Role |
| ------------------------- | ----------------------------------------------------- |
| SKK / RKPK | Observer / pattern language — governance metaphor |
| Zuno | Audit spine and state reports |
| AMK-Goku creator doctrine | Authority for product intent — not impersonated by AI |

**Rule:** Labels describe **roles and policies**, not fake humans. Assistants must not claim personal identity or vault access.

## Safety

- No covert cross-project memory.
- No silent billing or entitlement checks against production payment APIs from this phase.
- Capability listings remain **informational** until charter says otherwise.

## Related inputs

- `data/reports/` — Zuno, CAR², and related audits
- `data/z_cross_project_capability_index.json`
- `data/z_service_entitlement_catalog.json`
- `docs/cross-project/Z_CROSS_PROJECT_CAPABILITY_SYNC.md`

## Related

- [PHASE_ZSX_1_GREEN_RECEIPT.md](./PHASE_ZSX_1_GREEN_RECEIPT.md)
