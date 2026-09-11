# Z-Atlas Registry v0.5 — machine-readable topology slice

**Gate:** `Z-ATLAS-0.5-MACHINE-READABLE-TOPOLOGY-REGISTRY`  
**Custody:** `C:\Cursor Projects Organiser\Z_Sanctuary_Universe_wt_sidework0`  
**Instance:** [../../data/z_atlas/z_atlas_registry_v0_5.json](../../data/z_atlas/z_atlas_registry_v0_5.json)  
**Validator:** [../../scripts/z_atlas_registry_v0_5_validate.mjs](../../scripts/z_atlas_registry_v0_5_validate.mjs)  
**Report:** [Z_ATLAS_PHASE_0_5_REGISTRY_REPORT.md](Z_ATLAS_PHASE_0_5_REGISTRY_REPORT.md)

---

## Governing principle (locked)

```text
Machine-readable ≠ machine-authoritative.
Registry entry ≠ canonical identity.
Observed path ≠ trusted project.
Existing ≠ canonical.
Discovered ≠ trusted.
UNKNOWN ≠ GREEN.
Absence of evidence ≠ evidence of absence.
```

This slice **projects** the already-approved Phase 0 seed inventory into schema-valid nodes, edges, and facts. It does **not** become a second canonical engine, a crawler, or a completeness claim.

Phase 0 constitution is not expanded. Phase 0 schemas are not rewritten.

---

## What is encoded

Only identities classified in [Z_ATLAS_SEED_INVENTORY.md](Z_ATLAS_SEED_INVENTORY.md) and the pointer-reconciliation posture:

| Kind | Encoded |
| --- | --- |
| Organism / categories | Ecosystem node; Gaming Intelligence, Commercial Systems, Governance families |
| Existing registries (consumed, not forked) | Organiser `z-eaii-registry.json`; hub `z_pc_root_projects.json`; hub GitHub identity registry |
| Proven Organiser / pc_root members | REGISTERED_ACTIVE roots with Test-Path-proven paths from Phase 0 |
| Hub | `Z_Sanctuary_Universe` canonical hub folder on disk |
| This worktree | `HAS_WORKTREE` custody checkout + recorded branch — **not** a product root |
| ZWheel Cracker | `PRODUCT` + `ROOT` at `C:\Z-Wheel Cracker`, `EXTERNAL_SOVEREIGN`, commercial member of ZGI |
| ZGame Intelligence | `EXTERNAL_SOVEREIGN` commercial umbrella; **not** ZWheel source; Commercial Core **not** activated |
| `C:\Z-Wheel Traker` | `LEGACY_READ_ONLY` / `LEGACY_OF` ZWheel |
| Pre-organiser backup | `ARCHIVAL_BACKUP` / `SUPERSEDED_BY` current ZWheel root |
| Super-Saiyan Roulette Pro App | Distinct `PRODUCT` `EXTERNAL_SOVEREIGN`; Organiser sibling; not pc_root-registered |
| Roulette-Data-Analyzer | Distinct `PRODUCT` nested under registered Replit parent |
| Hub roulette / roulette-calculator | `MODULE` `REFERENCE_ONLY` / STALE — not source ownership |
| Hub `zwheel-cracker` row | Empty-path pointer (`SCHEMA_LIMITATION`) `REFERENCE_ONLY` |
| Missing / stale registry paths | `MISSING` authority, not promoted |
| Uncertainty | PID / Z-CLDO / Z-PACE `UNVERIFIED`; Z-Family Health `UNRESOLVED`; Amk-Goku Dashboards 2 empty path `UNRESOLVED`; PC-wide completeness `UNVERIFIED` |
| Conflicts | Deferred only (no automatic fix): duplicate Princess ids, ZGI version drift, port 8080 collision, continuation path, SSR README, RDA Stripe HOLD, backup CANONICAL_MOVED |
| Preflight example | Phase 0 ZWheel example, **illustrative / documentation-bound / not wired** |

Counts in this slice: **55** nodes, **54** edges, **40** facts, **1** preflight example.

---

## What is explicitly not encoded

- Any project, worktree, or `C:\` folder **not** listed in the Phase 0 seed inventory
- Auto-registered new roots
- Merged similar-named products (ZWheel, SSR, RDA, hub roulette, Z-OMNI remain distinct)
- Live port / process health measurements
- DNS purchase or liveness proof
- Unlisted hub worktrees (Phase 0: enumeration is Phase 1.5)
- Nested `Z_Sanctuary_Universe/Z_Sanctuary_Universe 2` as a separate proven root (conflict fact only)
- SSR / RDA membership of ZGI (candidate / undecided — facts `UNRESOLVED`, **no** `COMMERCIAL_MEMBER_OF` edge)
- Quadruple Spine redefinition
- Runtime crawler, watcher, dashboard, AI Tower, health runtime, deployment, commercial core, Cursor wiring

`claims.completenessClaimed` and `claims.pcWideCompletenessClaimed` are **false**.

---

## Uncertainty preserved (do not promote)

### UNVERIFIED

| Node | Why |
| --- | --- |
| `sys.pid` | Named constitution class; no artifact on this worktree |
| `sys.z-cldo` | Named constitution class; no artifact on this worktree |
| `sys.z-pace` | Named constitution class; no artifact on this worktree |
| `domain.zwheelcracker-com` | Declared. Domain ownership/current DNS state was not re-verified by this Atlas slice. ownership state: NOT RE-VERIFIED IN THIS SLICE; DNS liveness: UNVERIFIED; deployment state: NOT INFERRED |
| `overlay.live-ports` | Ports 8080 / 5190 / 5502 / 8888 not measured this gate |
| `overlay.pc-wide-completeness` | No Organiser / `C:\` crawl |

### UNRESOLVED

| Node | Why |
| --- | --- |
| `project.z-family-health` | Path exists; not EAII `projects[]`; not sealed pc_root roster |
| `project.amk-goku-dashboards-2` | Empty path; `path_unregistered`; no invented root |
| `root.z-sanctuary-universe-2` | REGISTERED_ACTIVE path; canonical continuation pending Steward |

Empty-path rows (`pointer.hub-zwheel-cracker`, `project.amk-goku-dashboards-2`) stay empty. They are not upgraded to `CANONICAL`.

ZWheel `healthState: GREEN` is the **existing overlay example** preserved by Phase 0 (local GREEN, deployment HOLD, physical proof INSUFFICIENT/UNVERIFIED). It is **not** an UNKNOWN→GREEN promotion.

---

## Identity boundaries (locked)

```text
ZWheel Cracker  ≠  Super-Saiyan Roulette Pro App  ≠  Roulette-Data-Analyzer
Hub roulette / roulette-calculator / zwheel-cracker row  =  pointers / metadata / REFERENCE_ONLY / STALE
Hub reference ≠ source ownership
```

Edges among the three products do **not** use `CANONICAL_FOR`, `OWNS_SOURCE`, or `SUPERSEDED_BY`. Hub pointers do **not** `OWNS_SOURCE` those products. Vague `CONNECTED_TO` is not used.

---

## Authority fields

Every node capable of product / executable / root / module / commercial / worktree / named-system identity carries Phase 0 fields:

`identityStatus` · `authorityStatus` · `canonicality` · `ownership` · `environment` · `gateState` · `healthState` · `evidenceFreshness`

Facts carry provenance: `factId`, `subjectId`, `predicate`, `source`, `evidenceRef`, `observedAt`, `freshness`, `confidenceClass`, `authority`, `status`.

---

## Preflight example

`preflightExamples[0]` is a non-runtime copy of the Phase 0 ZWheel preflight. `wired: false`, `runtime: false`, `illustrative: true`. It is not imported by Cursor, dashboards, or product apps.

---

## How to validate

From this worktree (deterministic; no network; no crawl):

```text
node scripts/z_atlas_registry_v0_5_validate.mjs
```

Exit 0 only if all required PASS verdicts hold.

---

## Related

- [Z_ATLAS_CONSTITUTION.md](Z_ATLAS_CONSTITUTION.md)
- [Z_ATLAS_ONTOLOGY.md](Z_ATLAS_ONTOLOGY.md)
- [Z_ATLAS_ROOT_REGISTRY_SPEC.md](Z_ATLAS_ROOT_REGISTRY_SPEC.md)
- [Z_ATLAS_SEED_INVENTORY.md](Z_ATLAS_SEED_INVENTORY.md)
- [Z_ATLAS_PHASE_0_GENESIS_REPORT.md](Z_ATLAS_PHASE_0_GENESIS_REPORT.md)
- [Z_ATLAS_AI_PREFLIGHT_CONTEXT.md](Z_ATLAS_AI_PREFLIGHT_CONTEXT.md)
- `docs/reconciliation/Z_WHEEL_HUB_POINTER_RECONCILIATION.md` — observe only; historical/source-worktree evidence reference; not included in this Atlas custody PR; not available as a canonical-main link at this gate
