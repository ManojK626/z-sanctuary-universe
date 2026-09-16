# Z-SEIF Phase 1 Thin Slice 1

**Gate:** `Z-SEIF-1-READ-ONLY-OBSERVER-THIN-SLICE-1`  
**Target:** Z-Sanctuary Universe self-observation only  
**Posture:** LOCAL-FIRST · READ-ONLY · NO REGISTRY · NO CLOUD WRITES

```text
PHASE_0: LANDED
PHASE_0_5: CLOSED
NEW_REGISTRY_REQUIRED: NO
NEW_SCHEMA_REQUIRED: NO
PERSISTENCE_REQUIRED: NO
PRODUCTION_AUTHORITY: NONE
```

Command: `npm run z:seif:observe`  
Script: `scripts/z_seif_phase1_observe.mjs`  
Tests: `npm run test:z-seif:observe`

## What this slice does

Composes existing authorities into one human-readable evidence view:

1. Canonical identity from Z-Atlas (`root.z-sanctuary-universe`), with pc-root as supplemental only.
2. Local Git facts (branch, HEAD, origin URL) as `OBSERVED_PROVIDER_EVIDENCE`.
3. Expected repository only if a present canonical source names a hub repo (`role: hub` in `data/z_ecosystem_github_identity.json`, or an Atlas `REPOSITORY` node linked to the hub). The gate instruction is not runtime truth.
4. In-memory provenance hash check (does not write `data/reports/`).
5. Receipt filenames under `docs/z_seif/` only.
6. Cloudflare always `UNKNOWN` / `LIVE_READ_NOT_AUTHORIZED_IN_THIS_SLICE`. No live API, no token search.

Observation does not persist provider state. UNKNOWN is an evidence state, not process failure.

## Known Phase 0 evidence correction

```text
KNOWN_PHASE0_EVIDENCE_CORRECTION:
data/z_universe_project_registry.json is absent on canonical main.
Phase 1 does not depend on it.
```

Do not invent that file. Do not reopen Phase 0.5 because of its absence.

Recommended later docs-only gate (not opened here): `Z-SEIF-0-DOCS-EVIDENCE-RECONCILIATION-1`

## What this slice must not do

- Create `data/z_seif/` or any Z-SEIF schema/registry
- Query Cloudflare APIs (still closed)
- Query GitHub APIs unless `--github-public` (Thin Slice 2; public allowlisted hub only)
- Read ZWheel or other sovereign product trees
- Assign overall GREEN merely because local reads succeeded
- Mutate Atlas, PID, Z-CLDO, Z-OTF, Guardian, HAM, or production

## Next

Thin Slice 2 (implemented on this branch): [Z_SEIF_PHASE_1_THIN_SLICE_2.md](Z_SEIF_PHASE_1_THIN_SLICE_2.md)

Cloudflare remains closed until credential posture is proven.
