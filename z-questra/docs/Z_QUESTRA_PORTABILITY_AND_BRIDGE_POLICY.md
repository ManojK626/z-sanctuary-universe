# Z-QUESTRA — Portability and Bridge Policy

## Role in Z-Sanctuary

Z-QUESTRA is a **local-first** learning / gameplay / workstation surface (Comfort, Zebras, Notebook, PlayGarden, uncertainty literacy tools). It stays **an independent Vite app** in its repo folder unless the ecosystem adopts a **written charter** for deeper integration.

## Independence rule

- No automatic inheritance of hub runtime, dashboard APIs, or shared memory.
- Hub surfaces (e.g. NAV-1 catalog) may **reference** Z-QUESTRA **without controlling** it.
- Any **live bridge** (sync, shared tokens, cross-project execution) requires **charter + 14 DRP gate** (and human approval paths documented elsewhere).

## Reuse modes

| Mode | Meaning | Allowed now (QX-1) |
| ------------------------ | ------------------------------------------------------- | ------------------------: |
| Docs link | Operators open README / docs / built `dist/` manually | Yes |
| Hub catalog reference | `z_universe_service_catalog.json` + capability manifest | Yes |
| Manual operator launch | Dev server or static `dist/` from hub serve | Yes |
| iframe embed | Embed app inside another shell | Future gated |
| Shared component package | Publish reusable tokens/components | Future gated |
| Local file bridge | Scripted local paths between projects | Future gated |
| Cross-project memory | Shared storage of notes/state | Future gated |
| Live service API | Network coupling | Forbidden without charter |

## Forbidden without charter

Listed in `data/z_questra_capability_manifest.json` under `forbidden_without_charter` — includes cloud sync, email/calendar APIs, live AI generation, provider calls, multiplayer, payments, unsafe kids online sharing, gambling/prediction mechanics, heavy 3D engines.

## PlayGarden / gameplay posture

- **Local**, **educational**, **non-predatory**: see `docs/Z_PLAYGARDEN_SAFETY_POLICY.md` and Phase 2.5 uncertainty docs.
- No stakes, no prediction claims for kaleidoscope; receipts are creative mementos, not scores.

## Governance

- **14 DRP (safety / harm-reduction habits):** Mandatory before any live bridge or expanded reuse mode; governs what must not ship without review.
- **14 DOP (operational discipline / process):** Charters, sign-off, and staged phases (e.g. QX ladder) follow the same gate — no “fast path” around human and policy checks.
- Capability truth file: **`data/z_questra_capability_manifest.json`** (`schema: z_questra_capability_manifest_v1`).

## Related

- [Z_QUESTRA_UNIVERSAL_ACCESS_ROADMAP.md](./Z_QUESTRA_UNIVERSAL_ACCESS_ROADMAP.md)
- [Z_VISUAL_INTERACTION_LANGUAGE.md](./Z_VISUAL_INTERACTION_LANGUAGE.md)
- [PHASE_QX_1_CROSS_PROJECT_ACCESS_GREEN_RECEIPT.md](./PHASE_QX_1_CROSS_PROJECT_ACCESS_GREEN_RECEIPT.md)
