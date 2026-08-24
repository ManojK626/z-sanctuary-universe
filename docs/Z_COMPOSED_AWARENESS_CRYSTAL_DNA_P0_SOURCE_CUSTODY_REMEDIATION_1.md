# Z-COMPOSED-AWARENESS-CRYSTAL-DNA-P0-SOURCE-CUSTODY-REMEDIATION-1

**Mode:** VERIFY · ACCEPT CURRENT SOURCE STATE · SEAL CUSTODY · REBUILD-IN-MEMORY · REPORT · STOP
**Date:** 2026-08-24
**START HEAD:** `31fd739`
**Does not:** restore 24-project pc_root · amend `6bd4fda` · rerun drift producer · regenerate Crystal DNA P0 report · modify P0 runtime · open TEVV · activate GARE

## Baseline

| Field | Value |
| ----- | ----- |
| Branch | `cursor/zsanctuary/z-sdc-phase-0-architecture` |
| START HEAD | `31fd739` (custody reconciliation HOLD) |
| P0 execution checkpoint | `6bd4fda` — **preserved**, not amended |
| Dirt | Large unrelated porcelain **preserved**. This commit stages only authorized custody paths. |

## Previous HOLD

Reconciliation (`31fd739`) proved:

- Crystal DNA P0 **execution proof PASS** against worktree bytes
- Rebuild from `6bd4fda` **HEAD blobs FAIL** (24 vs 22 projects)
- Rebuild from then-current worktree **PASS**
- Manifest parsed JSON HEAD = worktree; raw SHA differed (LF blob vs CRLF checkout)

**CRYSTAL_DNA_P0_SOURCE_CUSTODY** was **HOLD**.

## Steward Decision

| Choice | Decision |
| ------ | -------- |
| Current 22-project pc_root | **KEEP** — accept as current source state |
| Old 24-project HEAD blob | **DO NOT RESTORE** — remain in git history |
| Current drift JSON | **KEEP** as the exact P0 input evidence |
| Drift producer | **DO NOT RERUN** |
| DNA manifest | **NO CONTENT CHANGE** |
| `6bd4fda` | **PRESERVE** as historical execution checkpoint |

Forward reconciliation, not history replacement.

## pc_root Current State

Worktree `data/z_pc_root_projects.json` before seal:

| Check | Result |
| ----- | ------ |
| `projects[]` count | **22** |
| Hub `id` | `z-sanctuary-universe` (single `role: hub`) |
| IDs unique | **YES** |
| Malformed rows (missing id/name/role) | **none** |
| Retired stub in `projects[]` | **NO** (lives in `retired_projects`) |
| Roulette | `replit-roulette-z-amk-goku-mdcp` · `role: external` · `hosting: replit` · empty `path` |
| Role mix | hub 1 · member 15 · external 4 · continuation_active 1 · hub_backup_slice 1 |

No silent merge of Roulette into hub. Universe-2 remains an **intentional split** (`universe_2_resolution.verdict: intentional_split_not_merge`), not a sovereignty collapse.

## pc_root Canon Validation

Compared against:

- `docs/PROJECT_IDENTITY_RECONCILIATION.md` — Roulette `SEPARATE_PROJECT` / external; Dashboards 2 and ÉirMind HOLD rows remain distinct citizens
- `data/reports/z_composed_awareness_project_world_p0.json` — `project_count: 22`; **same ID set**; recorded pc_root SHA-256 `b80156c335ca6056…` **equals** Crystal DNA P0 input hash
- `docs/Z_COMPOSED_AWARENESS_READ_MODEL_P0_IMPLEMENTATION_1.md` — enumerates `z-sanctuary-universe` without rewriting to `ZSanctuary_Universe`
- Project World P0 TEVV audit — 22 projects from `projects[]`

**IDENTITY-CANON RESULT: ACCEPT**

No `PC_ROOT_CURRENT_STATE_CONTRADICTS_IDENTITY_CANON`.

## Old 24-Project State Preservation

The 24-row enumeration remains in git at `6bd4fda:data/z_pc_root_projects.json` (and earlier commits). This remediation **does not claim it never existed**. Restoring it would move the architecture backward relative to Project World P0 / TEVV / Crystal DNA P0.

## Drift Evidence State

Current `data/reports/z_crystal_dna_drift_report.json` (not regenerated):

| Field | Value |
| ----- | ----- |
| schema | `z_crystal_dna_drift_report_v1` |
| overall_signal | `BLUE` |
| findings | **3** (`stale_bridge`, `satellite_not_wired_in_dna_mesh`, `hold_parallel_green_doorway`) |
| `generated_at` | `2026-08-21T07:03:09.082Z` |
| law | Detect / compare / report only |

Findings match the earlier HEAD blob; only `generated_at` differed. Structure matches `docs/Z_CRYSTAL_DNA_DRIFT_AWARENESS.md` (v1 schema, named inputs including the DNA manifest). Crystal DNA P0 projected the same three codes.

**DERIVED ≠ DISPOSABLE EVIDENCE.** Committing this file does not promote it above underlying sources. It remains **derived real evidence** in the P0 chain.

## DNA Manifest Encoding Finding

`data/z_crystal_dna_asset_manifest.json` was **not modified**.

Parsed JSON at prior HEAD **equals** worktree. Raw git blob SHA ≠ Windows checkout SHA because of LF vs CRLF. That is **not** semantic DNA drift.

## Execution-Byte Fingerprint

SHA-256 of **exact filesystem bytes** read by a local run. Checkout-specific. Used for local integrity / non-mutation proofs.

Worktree execution-byte hashes at validation (same as Crystal DNA P0 `sources[]`):

| Path | Execution-byte SHA-256 |
| ---- | ---------------------- |
| DNA manifest | `11d8814fc2111c9858673a18b33f24b8aa9352a75f4ffaed40c38b5201b5e1b8` |
| Drift report | `77cb24e003f215b8606629cc2b1a31ee51620833b979b11eebe3697c75521136` |
| pc_root | `b80156c335ca6056dd4e3592d7431b127f0ee898c45b3bde39ab7501b24251c8` |

**Do not require** git blob raw SHA = checkout raw SHA where line-ending conversion exists.

## Canonical JSON Fingerprint

Parse JSON → recursively sort **object** keys → **preserve array order** → `JSON.stringify` → SHA-256 of UTF-8. In-memory only (existing P0 `sortKeys` helper; **no** new production runtime file; **no** rewrite of source JSON).

Worktree canonical fingerprints **before** this seal (portable semantic identity):

| Path | Canonical JSON SHA-256 |
| ---- | ---------------------- |
| DNA manifest | `c7b1b4556743b0ac98c8898ccbb9a461bedb0bc37261a02f4f198ed27e54e2b3` |
| Drift report | `95418394a96e0dc16985d59b6e17fb143b4e15baaf86423db8e06ade83e3d536` |
| pc_root | `7eaf4234cce6a9eac90dcfbaad57c1b3f1080a7075972a834431fada0febe5e4` |

Prior HEAD (`31fd739`) canonical vs worktree:

| Path | Match? |
| ---- | ------ |
| Manifest | YES (encoding-only raw mismatch) |
| Drift | NO (`generated_at`) |
| pc_root | NO (22 vs 24 semantics) |

After this source commit, **canonical JSON SHA(worktree) must equal canonical JSON SHA(new HEAD blob)** for all three.

## Sources Sealed

Authorized commit contents:

1. `data/z_pc_root_projects.json`
2. `data/reports/z_crystal_dna_drift_report.json`
3. this document

Unrelated dirt (including `z_crystal_dna_drift_report.md`) is **not** staged.

## Source Commit Relationship

```text
6bd4fda   Crystal DNA P0 execution checkpoint (unamended)
31fd739   custody reconciliation (HOLD documented)
<this commit>  source-custody remediation — 22-project + August drift evidence sealed
```

Git identifies this changeset by the commit that introduces this file. The gate report records **SOURCE CUSTODY HEAD** after `git rev-parse HEAD`.

## P0 Semantic Rebuild

After seal: in-memory `projectCrystalDnaP0` from **new HEAD blobs**, compared to tracked `data/reports/z_composed_awareness_crystal_dna_p0.json`, excluding **only** `sources[].sha256` (execution-byte fingerprints that may differ by CRLF/LF).

Required: **P0_SEMANTIC_REBUILD_FROM_NEW_HEAD = PASS**

## P0 Byte-Level Limitations

Tracked P0 report still embeds checkout execution-byte hashes. A Linux LF checkout of the same JSON may hash differently while **canonical JSON** and **semantic projection** match. That is an **engineering limitation**, not a P0 failure. P0 runtime is **not** refactored in this gate.

## Execution-Proof Standing

`6bd4fda` remains a valid execution checkpoint. Current checkout must still fully rebuild the tracked report (committing must not alter worktree source bytes).

## Reproducible-Seal Standing

After this seal, P0 must be **semantically reproducible from git HEAD blobs**. Raw-byte identity of the sealed report vs a foreign checkout remains checkout-specific.

## Remaining Observations

- Drift **markdown** companion remains dirty and unsealed (not a Crystal DNA P0 machine input).
- Manifest still has a raw-byte LF/CRLF gap; canonical fingerprint closes the **semantic** custody gap.
- Crystal DNA P0 TEVV is **not** opened here.

## ONE Recommended Next Gate

If custody = CLEAN after post-commit verification:

**Z-SANCTUARY-COMPOSED-AWARENESS-CRYSTAL-DNA-P0-TEVV-AUDIT-1**
