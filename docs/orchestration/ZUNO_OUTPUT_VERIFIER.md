# Zuno output verifier

**Purpose:** Define what **verification** means before outputs are treated as advisory truth, dashboard-ready, or implementation claims.

## Layers of verification

| Layer | Question | Hub analogue |
| --------- | -------------------------------------- | ----------------------------------------------------------- |
| Syntactic | Valid format, no truncation corruption | Lint, tests, JSON schema guards |
| Grounded | Cites paths, registry IDs, or docs | AI Builder evidence-first rules |
| Safe | Passes build rules and DRP posture | [Z_SANCTUARY_BUILD_RULES.md](../Z_SANCTUARY_BUILD_RULES.md) |
| Scoped | Correct project/lane; no XL2 bleed | MAOS + linking policy |
| Honest | No fake “shipped” without audit | `zuno:coverage` statuses |

## Orchestrator-facing checklist (conceptual)

Before promoting an orchestrator output:

1. **Classification** — doc vs code vs creative vs governance.
2. **Citations** — file paths or doc links for factual claims about the repo.
3. **Registry alignment** — module IDs from `data/z_master_module_registry.json` when claiming modules.
4. **Safety labels** — e.g. advisory, simulation, human approval required.
5. **Reversibility** — rollback note for suggested changes ([Z-NEW-MODULE-DISCIPLINE.md](../Z-NEW-MODULE-DISCIPLINE.md) mindset).

## Dashboard surfacing

Dashboard cards should remain **read-only** until Overseer-class workflow approves interactive fixes ([dashboard/README.md](../../dashboard/README.md), deployment HOLD in build rules).

## Relation to Z-SAGE signals

SAGE consumes **already-written** reports — verifier ensures **those** reports are trustworthy; SAGE does not replace verifier scripts.

## Forbidden

- Auto-elevating AI text to “verified green” without human or script gate.
- Verifier that silently drops safety failures.
