# Z-COMPOSED-AWARENESS-CRYSTAL-DNA-P0-SOURCE-CUSTODY-RECONCILIATION-1

**Mode:** OBSERVE · COMPARE · TRACE · RECONCILE · REPORT · STOP
**Date:** 2026-08-24
**START HEAD:** `6bd4fda`
**This gate mutates:** this document only
**Does not:** amend `6bd4fda`, restore sources, commit sources, regenerate P0, run drift writer, open TEVV

## Baseline

| Field | Value |
| ----- | ----- |
| Repository | `C:/Cursor Projects Organiser/Z_Sanctuary_Universe` |
| Branch | `cursor/zsanctuary/z-sdc-phase-0-architecture` |
| START HEAD | `6bd4fda` (`feat(awareness): implement Crystal DNA read projection P0`) |
| Dirt | Large pre-existing tracked + untracked porcelain **preserved**. This gate does not restore, clean, or commit it. |

## Reason for Custody Review

`6bd4fda` sealed P0 **code + derived report**. Two consumed machine sources were dirty at seal time and were left outside that commit. Determinism against the bytes actually read can still be true while the seal is not self-contained from HEAD blobs alone.

Separate:

- **EXECUTION CORRECTNESS** — did P0 project the bytes it hashed?
- **SEAL REPRODUCIBILITY** — can those exact inputs be recovered from `6bd4fda`?

## P0 Existing Standing

**Preserved.** This gate found no contradictory execution evidence.

| Claim | Standing |
| ----- | -------- |
| `COMPOSED_AWARENESS_CRYSTAL_DNA_P0` | PASS (execution proof) |
| Shards / deps / drift findings | 8 / 6 / 3 |
| Projects in sealed projection | 22 |
| Project joins | 0 |
| 3× determinism | PASS (against those input bytes) |
| Source mutation by P0 | NONE |
| GARE executor | NONE |

`6bd4fda` remains a **valid execution checkpoint with a source-custody limitation**. It is not amended or erased.

## Consumed Sources

P0 machine inputs (from sealed `data/reports/z_composed_awareness_crystal_dna_p0.json`):

1. `data/z_crystal_dna_asset_manifest.json`
2. `data/reports/z_crystal_dna_drift_report.json`
3. `data/z_pc_root_projects.json`

No other JSON sources are hashed into the sealed projection. Doctrine markdown is semantic context only.

P0-recorded hashes (verified from the sealed artifact, not from memory of the prior report):

| Path | P0 input SHA-256 |
| ---- | ---------------- |
| `data/z_crystal_dna_asset_manifest.json` | `11d8814fc2111c9858673a18b33f24b8aa9352a75f4ffaed40c38b5201b5e1b8` |
| `data/reports/z_crystal_dna_drift_report.json` | `77cb24e003f215b8606629cc2b1a31ee51620833b979b11eebe3697c75521136` |
| `data/z_pc_root_projects.json` | `b80156c335ca6056dd4e3592d7431b127f0ee898c45b3bde39ab7501b24251c8` |

HEAD hashes are SHA-256 of `git show 6bd4fda:<path>` blob bytes (no checkout overwrite). Worktree hashes are SHA-256 of current disk bytes.

## HEAD / Worktree / P0 Hash Matrix

| Source | HEAD SHA-256 | Worktree SHA-256 | P0 Input SHA-256 | HEAD=WT? | WT=P0? | HEAD=P0? |
| ------ | ------------ | ---------------- | ---------------- | -------- | ------ | -------- |
| DNA manifest | `36ded65102d017f58a495a058c2a534b0ef4fd6aeafc16b6ebf8b129effb62cb` | `11d8814fc2111c9858673a18b33f24b8aa9352a75f4ffaed40c38b5201b5e1b8` | `11d8814fc2111c9858673a18b33f24b8aa9352a75f4ffaed40c38b5201b5e1b8` | NO | YES | NO |
| Drift report | `f86d5dc9aab362d9447dcd9d3c2ea184df56d7f4070a73918f8dedc4cce576ee` | `77cb24e003f215b8606629cc2b1a31ee51620833b979b11eebe3697c75521136` | `77cb24e003f215b8606629cc2b1a31ee51620833b979b11eebe3697c75521136` | NO | YES | NO |
| pc_root | `f6047de85f7699cf4a7f5d28e2ee46adbb27312d0c34af02a02ad8e46a552d47` | `b80156c335ca6056dd4e3592d7431b127f0ee898c45b3bde39ab7501b24251c8` | `b80156c335ca6056dd4e3592d7431b127f0ee898c45b3bde39ab7501b24251c8` | NO | YES | NO |

**Interpretation of the matrix:** every P0-recorded hash matches **current worktree** bytes. **None** of the three P0-recorded hashes matches the **git blob** at `6bd4fda`.

## pc_root Diff

`git diff -- data/z_pc_root_projects.json` (read-only): **173 lines**, 82 insertions / 93 deletions.

Porcelain: **dirty before this gate**, still dirty, **not** modified by this gate.

## pc_root Semantic Impact

**Classification: SEMANTICALLY_RELEVANT**

P0 enumerates `projects[]` IDs for coverage. In-memory parse of HEAD vs worktree:

| Field | HEAD (`6bd4fda` blob) | Current worktree (P0 inputs) |
| ----- | --------------------- | ---------------------------- |
| `projects.length` | **24** | **22** |
| Hub `id` | `zsanctuary-universe` | `z-sanctuary-universe` |
| Roulette id present | YES (`replit-roulette-z-amk-goku-mdcp`) | YES (same id) |

IDs only on HEAD `projects[]`: `zsanctuary-universe`, `zsanctuary-universe-stub-retired`, `at-princess-blackie-copitol`, `pc-root-extras-and-tools`, `z-sanctuary-universe-2-pc-root`, `z-pets-care-compassion`.

IDs only on worktree `projects[]`: `z-sanctuary-universe`, `extras-tools`, `z-sanctuary-universe-2`, `z-sancurary-pets-care-compassion`.

Worktree also adds `retired_projects` and `universe_2_resolution` (P0 coverage adapter does not read those objects; it still **does** read the changed `projects[]` list).

This is **not** harmless pre-existing dirt. `data/z_pc_root_projects.json` is the Project World enumeration source. PRE-EXISTING ≠ IRRELEVANT.

## Drift Report Diff

`git diff -- data/reports/z_crystal_dna_drift_report.json` (read-only): **one field**.

```text
-  "generated_at": "2026-05-12T18:06:23.903Z",
+  "generated_at": "2026-08-21T07:03:09.082Z",
```

Same byte length (1463) with different SHA-256 because of that timestamp.

## Drift Report Semantic Impact

**Classification: SEMANTICALLY_IRRELEVANT_TO_P0** (projection body)

Verified in-memory:

- `overall_signal` HEAD = worktree = `BLUE`
- finding count HEAD = worktree = 3
- `findings` JSON equality HEAD = worktree = true

P0 `adaptDrift` does **not** copy `generated_at` into the projection. The dirty timestamp **does** change the consumed-file SHA-256 recorded in `sources[]`.

DERIVED SOURCE ≠ UNIMPORTANT SOURCE: custody of the file still matters for seal hashes even when P0 ignores the clock field.

## Manifest Custody

`git status -- data/z_crystal_dna_asset_manifest.json`: **clean** (not dirty porcelain).

Parsed JSON HEAD blob **equals** parsed worktree JSON (`jsonEq` true).

Raw SHA-256 still differs: HEAD blob 3587 bytes vs worktree 3695 bytes (~108 extra bytes). That matches a **LF git blob vs CRLF working-tree checkout** gap under Windows `core.autocrlf`, not a semantic DNA-card edit.

P0 hashes **filesystem bytes**, so the sealed report records the checkout encoding hash (`11d8814f…`), not the git blob hash (`36ded651…`).

## Derived-Report Producer

| Item | Evidence |
| ---- | -------- |
| Producer | `scripts/z_crystal_dna_drift_check.mjs` |
| npm script | `z:crystal:dna:drift` |
| Writes | `data/reports/z_crystal_dna_drift_report.json` and `.md` |
| Inputs (producer) | crystal manifest, satellite control-link manifest, doorway registry, dashboard indicators |
| Clock | `generated_at = new Date().toISOString()` — regeneration always new timestamp |
| Tracked? | YES — `.gitignore` ignores `data/reports/*.json` then **un-ignores** this JSON |
| This gate | **Did not run** the producer |

## Source Authority Classification

| Source | Classification | Evidence |
| ------ | -------------- | -------- |
| DNA manifest | `SEALED_AT_HEAD` (porcelain) plus **hash-encoding gap** | Git-clean; JSON equivalent to HEAD; P0 SHA ≠ blob SHA because P0 hashed checkout bytes |
| Drift report | `DIRTY_DERIVED_REPORT_PENDING` | Tracked derived file; only `generated_at` dirty; producer is a writer; not sealed in `6bd4fda` |
| pc_root | `DIRTY_INTENTIONAL_CANON_PENDING` | Substantive registry rewrite (IDs, roles, retired split, Universe-2 resolution). **Intent is not a steward decision this gate may make.** Pending confirmation whether these bytes are next canon, discard, or restore |

Cursor **does not** keep, discard, commit, or restore these files in this gate.

## Rebuild from Sealed HEAD

In-memory `projectCrystalDnaP0` on `git show 6bd4fda:<path>` parses (no write of the tracked P0 report).

| Check | Result |
| ----- | ------ |
| Hard stop | none |
| Full equality vs sealed P0 JSON | **FAIL** |
| Semantic equality (strip `sources[].sha256`) vs sealed P0 JSON | **FAIL** |
| HEAD summary `project_missing_count` | **24** |
| Sealed / worktree summary `project_missing_count` | **22** |
| HEAD shards / deps / drift finding counts | 8 / 6 / 3 (same) |

**P0_REBUILD_FROM_SEALED_HEAD: FAIL**

Cause: HEAD `projects[]` is a different enumeration. Not a tooling inability.

## Rebuild from Current Worktree

In-memory projection from current disk JSON:

| Check | Result |
| ----- | ------ |
| Full equality vs sealed P0 JSON | **PASS** |
| Semantic equality vs sealed P0 JSON | **PASS** |

**P0_REBUILD_FROM_CURRENT_WORKTREE: PASS**

This is **result B**: HEAD inputs ≠ P0 inputs; current worktree inputs = P0 inputs.

## P0 Execution-Proof Verdict

**VALID.** The sealed report is a faithful projection of the worktree bytes it hashed. Determinism and non-mutation claims stand.

## P0 Reproducible-Seal Verdict

**HOLD.** `6bd4fda` **alone** (git blobs of the three sources + committed report) does **not** rebuild the sealed projection. Unsealed worktree `pc_root` (semantic) and unsealed drift timestamp (hash) plus checkout encoding of the manifest (hash) are required to match the sealed artifact.

## Historical Preservation

```text
6bd4fda
=
VALID EXECUTION CHECKPOINT
WITH SOURCE-CUSTODY LIMITATION
```

Do not amend. A later **corrective seal** (steward-chosen source state + optional P0 re-projection commit) should supersede the limitation. TEVV must not certify a baseline whose exact inputs sit outside the commit.

## Required Steward Decision

Cursor must not choose. Steward must decide, in a **separate** mutation gate, one path such as:

1. **Promote** current worktree `pc_root` and/or drift JSON as canon, then add a **new** custody/P0 seal commit (not amend `6bd4fda`).
2. **Restore** those files to HEAD blobs, then decide whether to re-run P0 (new report commit) so HEAD and projection match.
3. **Split**: restore drift timestamp vs keep pc_root, or the reverse — only if that is the intended canon.

Until that decision, Crystal DNA P0 TEVV would certify mixed sealed/unsealed inputs.

## ONE Recommended Next Gate

**Z-SANCTUARY-COMPOSED-AWARENESS-CRYSTAL-DNA-P0-SOURCE-CUSTODY-REMEDIATION-1**

Narrow: steward-directed keep/restore/commit of the two dirty consumed sources (and optionally a **new** P0 report seal). **Not** TEVV. **Not** GARE. **Not** amend `6bd4fda`.

## Custody Verdict

**CRYSTAL_DNA_P0_SOURCE_CUSTODY = HOLD**
