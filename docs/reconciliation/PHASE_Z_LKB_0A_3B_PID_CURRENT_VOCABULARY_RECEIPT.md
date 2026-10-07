# Phase Z-LKB-0A.3B — PID current vocabulary receipt

**Date:** 2026-10-07
**Mode:** derive, verify, commit locally, stop

The pilot branch `cursor/zsanctuary/z-lkb-0a-3a-doc-recovery-pilot` was not modified. Commit `3b62323d1f2d3ef0f359b7e709974312ccfc66b5` was not amended.

## Baseline

| Item | Value |
| --- | --- |
| Published baseline | `origin/main` @ `1c597e2cb4ddc1a81b09695a2899d1c592a345a8` |
| Recovery source lineage | `3f02aa68810df3184ca073d15a8293f0e834bd22` |
| Preserved pilot | `3b62323d1f2d3ef0f359b7e709974312ccfc66b5` |
| R1 review | Uncommitted on the dirty reconciliation worktree. Not part of this commit |
| Worktree | `C:\Cursor Projects Organiser\Z_Sanctuary_Universe_wt_z_lkb_0a_3b` |
| Branch | `cursor/zsanctuary/z-lkb-0a-3b-pid-current-vocabulary` |
| Initial status | Clean. Created from `origin/main` |

`docs/PROJECT_IDENTITY_RECONCILIATION.md` was not copied and is not in this commit.

## Source provenance

| Derivative | Source blob | Pilot commit |
| --- | --- | --- |
| `docs/Z_PROJECT_IDENTITY_RELATIONSHIP_CONTRACT.md` | `b5cbeaa7029f7ad0dac8326cd6a1e77c7f1d00a3` | `3b62323d1f2d3ef0f359b7e709974312ccfc66b5` |
| `docs/Z_PROJECT_IDENTITY_TRUSTED_INPUT_MAP.md` | `7d39b00202706a77d5a05b413f4746903367e879` | `3b62323d1f2d3ef0f359b7e709974312ccfc66b5` |

Both derivatives state: CURRENT DERIVATIVE — NOT BYTE-IDENTICAL TO HISTORICAL SOURCE.

Derivation base: `origin/main` @ `1c597e2cb4ddc1a81b09695a2899d1c592a345a8`.

## Relationship contract adaptations

Preserved: no second master registry; runtime is not deployment; a worktree is not the organism; a newer copy is not canonical; canonical identity needs explicit human confirmation; observer evidence must not become ownership; relationship classification stays conservative.

Adapted:

- Branch seal `c685b76` is recorded as provenance. It is not written as acceptance on main.
- "Sealed permanently" was removed.
- The August audit map, control-panel audit, health review, Book B identity manifest, and Z-SDC Phase 0 note are not linked.
- Current companions that exist on this base are Constitution V1, the Z-SEIF capability reconciliation, and the Z-UORM 0.1 contract.
- No Z-CCC doctrine was added.
- The observer is described as future and unchartered. No PID-1B report is called current.
- Case lessons are labeled historical. The D2, EMK, and REP receipts are not treated as current-main law.

## Trusted input map adaptations

Preserved trust classes: `TRUSTED_CANON`, `TRUSTED_STRUCTURAL`, `OBSERVATIONAL_ONLY`, `DIRTY_UNSEALED`, `DERIVED`, `EXCLUDED`, `UNKNOWN`.

Added availability classes: `TRUSTED_CURRENT_INPUT`, `HUMAN_CONFIRMED_INPUT`, `HISTORICAL_INPUT`, `PARTIAL_UNAVAILABLE_INPUT`, `UNKNOWN_INPUT`.

PID-1B report paths are marked `PARTIAL_UNAVAILABLE_INPUT`. The map says they are not runtime proof and are not current on this base.

## Removed or replaced historical references

Not recovered, and not given fake equivalents:

- `docs/AMK_GOKU_CONTROL_PANEL_RECONCILIATION.md`
- `docs/Z_SANCTUARY_INDICATOR_SUPER_TURTLE_HEALTH_REVIEW_1.md`
- `docs/Z_IDENTITY_MANIFEST.md`
- `docs/Z_SANCTUARY_STEWARD_DIAGNOSTIC_CORE_0.md`
- `docs/PROJECT_IDENTITY_RECONCILIATION.md`

Replaced only where the current file is the same statement on this base:

- Human decision, readiness is not deploy, and the existing registries: Constitution V1.
- Consume identity vocabulary and do not add a second identity registry: Z-SEIF capability reconciliation.
- Not a project registry: Z-UORM 0.1.

The two derivatives link to each other.

## Current main compatibility

- No new master registry.
- No new execution authority.
- Runtime is not deployment. Readiness is not deploy.
- Z-UORM is not used as an identity registry.
- Z-SEIF is cited for the no-second-registry boundary. This commit does not edit Z-SEIF, so its older `EXISTING` label is unchanged.
- Registry JSON was not edited.

## Link validation

Relative links in the two derivatives resolve to files in this worktree:

- `docs/governance/Z_SANCTUARY_UNIVERSE_CONSTITUTION_V1.md`
- `docs/z_seif/Z_SEIF_EXISTING_CAPABILITY_RECONCILIATION.md`
- `docs/z-uorm/Z_UORM_COMPOSITION_CONTRACT_0_1.md`
- `docs/Z_PROJECT_IDENTITY_RELATIONSHIP_CONTRACT.md`
- `docs/Z_PROJECT_IDENTITY_TRUSTED_INPUT_MAP.md`

Unresolved relative links in those two documents: 0.

## Markdown validation

`npm run verify:md` was run in this worktree before this receipt was added. Exit 0.

The two derivatives were linted with this worktree's `.markdownlint.json`. MD060 errors: 0.

This receipt is included in the same commit and was linted before the commit. Markdownlint settings were not changed.

## Protected main verification

The diff from `origin/main` is the two derivatives and this receipt. All three paths were absent on `origin/main`.

`package.json` and `package-lock.json` are not in the diff.

`verify:ci` still starts with `node scripts/z_execution_enforcer_gate.mjs --verify-only`.

Both `deploy:cf-z-bridge:pages:preview` and `deploy:cf-z-bridge:pages:production` still start with `node scripts/z_readiness_attestation.mjs --require-deployment`.

No registry, generated report, runtime file, or six-conflict path is in the commit.

## Commit content

One local commit. Parent is `origin/main`. Files:

- `docs/Z_PROJECT_IDENTITY_RELATIONSHIP_CONTRACT.md`
- `docs/Z_PROJECT_IDENTITY_TRUSTED_INPUT_MAP.md`
- `docs/reconciliation/PHASE_Z_LKB_0A_3B_PID_CURRENT_VOCABULARY_RECEIPT.md`

The commit SHA cannot be stored inside the commit that creates it. Steward-facing SHA is the commit this file belongs to.

## Rollback

On this branch only: revert this commit. Do not reset the pilot. Do not reset the reconciliation worktree. This commit is not pushed.

## Deferred items

- Push, merge, and deploy.
- The historical audit map.
- The four missing link targets.
- PID-1B observer and its reports.
- Z-SEIF label repair.
- Z-UORM status-line wording.
- Another recovery family.
- Z-LKB-0B.
- MD060 repair of the immutable pilot bytes.

## Close

```text
Z_LKB_0A_3B_STATUS: REVIEW
BASE_SHA: 1c597e2cb4ddc1a81b09695a2899d1c592a345a8
SOURCE_PILOT_SHA: 3b62323d1f2d3ef0f359b7e709974312ccfc66b5
DERIVED_DOCS: 2
HISTORICAL_AUDIT_PROMOTED: NO
SOURCE_BYTES_PRESERVED_IN_PILOT: YES
RELATIONSHIP_CONTRACT_CURRENT_DERIVATIVE: YES
TRUSTED_INPUT_MAP_CURRENT_DERIVATIVE: YES
UNRESOLVED_LINKS: 0
MD060_ERRORS: 0
PROTECTED_MAIN_PATHS_PRESERVED: YES
PACKAGE_JSON_PRESERVED: YES
PACKAGE_LOCK_PRESERVED: YES
VERIFY_ONLY_GUARD_PRESERVED: YES
REQUIRE_DEPLOYMENT_GUARDS_PRESERVED: YES
REGISTRY_FILES_TOUCHED: 0
RUNTIME_FILES_TOUCHED: 0
LOCAL_COMMIT_CREATED: YES
COMMIT_SHA: THIS_COMMIT
PUSH_PERFORMED: NO
MERGE_PERFORMED: NO
NEXT_RECOVERY_FAMILY_OPENED: NO
Z_LKB_0B_OPENED: NO
```

STOP — AWAIT AMK-GOKU.
