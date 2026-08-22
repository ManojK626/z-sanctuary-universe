# Z-SANCTUARY-DOCS-DIRT-INCIDENT-RECONCILIATION-1

**Status:** Observation + path-scoped recovery where evidenced · **no formula work**
**Date:** 2026-08-22
**Baseline HEAD (preserved):** `51126b5`
**Branch:** `cursor/zsanctuary/z-sdc-phase-0-architecture`
**Mode:** OBSERVE · IDENTIFY · RECOVER WHERE EVIDENCE EXISTS · REPORT

## Incident

During Steward P0 gate (`Z-SANCTUARY-MICRO-MESO-MACRO-STEWARD-P0-DECISIONS-1.1`):

1. `node scripts/z_markdown_table_compact.mjs --dir=docs` mass-touched tracked docs under `docs/` (~35 files reported).
2. `git restore -- docs/` was then used to undo that mass format.
3. That restore also reset **pre-existing tracked modifications** under `docs/` to HEAD.
4. Porcelain was reported to drop approximately **~183 → ~127** lines.
5. Aggregation Steward files were re-authored and sealed at **`51126b5`**.

Primary law applied: **Recover before redefine. Preserve learning before continuing.**

## Baseline

| Field | Value |
| ---------------------------------- | ----------------------------------------------------------- |
| Expected HEAD | `51126b5` |
| Actual HEAD | `51126b5` |
| Branch | `cursor/zsanctuary/z-sdc-phase-0-architecture` |
| Stash | Present (many entries); `stash@{0}` has **0** `docs/` paths |
| Reflog | Linear commits only; no accidental checkout overwrite |
| Bulk restore during this audit | **NO** |
| Global formatter during this audit | **NO** |

## Known Scope

| Class | Finding |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| A. Tracked modified `docs/` potentially reverted | **YES** — candidate list reconstructed from gate shell status + restore listing |
| B. Staged docs at incident | **NONE evidenced** |
| C. Untracked docs | **NOT removed** by `git restore` (still present) |
| D. Non-doc paths | Outside primary incident scope (porcelain still includes reports/data/etc.) |
| E. Current intentional dirt | Untracked Steward/OMEGA/Turtle/Lifeboat docs remain; sealed aggregation paths re-aligned to HEAD |

**Git limitation (explicit):** Unstaged bytes destroyed by `git restore` are **not** in Git objects unless previously committed, staged, or stashed. Missing bytes are classified `UNRECOVERABLE_FROM_AVAILABLE_EVIDENCE` — **not invented**.

## Git Evidence

| Source | Result |
| -------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `git status` / porcelain | Actual count at audit ~**126–128** (varies with concurrent tasks) |
| `git stash list` | Many historical stashes; **none** shown to hold this incident’s wiped `docs/` dirt |
| `git stash show --name-only stash@{0}` | **0** docs paths |
| `git reflog` | Seal `51126b5` intact; no destructive branch move |
| Pre-incident path list | Recovered from conversation/tool status listings (path identity only — **not** prior file bytes) |

## Local-History Evidence

Cursor / VS Code Local History root exists (`%APPDATA%\Cursor\User\History`, thousands of entry dirs).
~478 entries reference `Z_Sanctuary_Universe/docs/`.

Sampled candidates vs HEAD:

| Path | Latest Local History | vs HEAD | Notes |
| ------------------------------------------------------------- | ------------------------ | -------------------------------------------------- | -------------------------------------------- |
| `docs/Z_CONTINUOUS_360_MULTIDIMENSIONAL_FIELD_SPEC_1.md` | 2026-08-21 13:21 | Mostly trailing-space / table spacing | **Not** a proven Aug-22 pre-restore snapshot |
| `docs/Z_CONTINUOUS_360_STEWARD_P0_DECISIONS_1_1.md` | 2026-08-21 13:21 | Formatting-class diff | Same caveat |
| `docs/Z_SANCTUARY_STATE_OF_THE_OS_2026_LAYER_1_FOUNDATION.md` | 2026-08-21 11:41 | Trailing spaces | Same caveat |
| `docs/Z_FORMULA_SEMANTIC_GOLDENS.md` | 2026-08-21 11:41 | Small formatting-class | Same caveat |
| `docs/Z_STEWARD_GATE_LOGIC.md` | 2026-08-21 11:41 | Small formatting-class | Same caveat |
| `docs/Z_TRAFFIC_MINIBOTS.md` | 2026-08-21 11:41 | **Substantive** wording + table row vs HEAD | STEWARD_REVIEW (see below) |
| Aggregation Spec / Steward P0 | Post-seal history exists | Working tree had format-only drift after `51126b5` | Restored to HEAD (below) |

**No Local History snapshot was proven to equal the exact Aug-22 working-tree bytes immediately before `git restore -- docs/`** for the wiped tracked set.

## Candidate Paths

Pre-incident **tracked dirty** `docs/` paths evidenced by gate status listings (non-exhaustive of all ~56 porcelain-line drop, which also includes non-docs and multi-line entries):

Doorway / ZIX / Books / C360 / Cubes / LPBS / Ultra / Consolidation / State-of-OS layers / Steward gate / Traffic minibots / Formula semantic goldens / governance doctrines / project-lifeboat README / commercial-readiness / dashboard census / vile / z-connect / zilwa (as previously listed `M docs/...` in gate shells).

After incident + this audit: those tracked paths are **CLEAN vs HEAD** (match sealed tree), except as noted for post-seal aggregation format dirt (corrected).

### Candidate matrix (representative)

| Path | Pre-incident dirty evidence | Current state | Recovery source | Confidence | Action |
| --------------------------------------------------------------------- | --------------------------------- | ------------------------ | -------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| `docs/Z_MICRO_MESO_MACRO_AGGREGATION_SPEC_1.md` | Post-`51126b5` format drift | Matches HEAD after audit | `git restore --source=HEAD` (exact seal bytes) | HIGH | **RECOVER_EXACT** (done) |
| `docs/Z_MICRO_MESO_MACRO_STEWARD_P0_DECISIONS_1_1.md` | Post-`51126b5` format drift | Matches HEAD after audit | same | HIGH | **RECOVER_EXACT** (done) |
| `docs/Z_TRAFFIC_MINIBOTS.md` | Was `M` in pre-incident porcelain | Recovered = LH H6AR | Cursor History `74c080a9/H6AR.md` + live traffic script | HIGH | **RECOVER_EXACT** (Traffic recovery gate) |
| `docs/Z_CONTINUOUS_360_MULTIDIMENSIONAL_FIELD_SPEC_1.md` | Was `M` | CLEAN = HEAD | Local History formatting-class only; sealed surface hash OK | LOW→MEDIUM | **STEWARD_REVIEW** (do not auto-apply hist) |
| Other listed pre-`M` tracked docs | Path list from status | CLEAN = HEAD | No proven Aug-22 exact bytes | LOW | **UNRECOVERABLE_FROM_AVAILABLE_EVIDENCE** (exact wiped content) / **STEWARD_REVIEW** if Steward recalls intentional WIP |
| Untracked `docs/OMEGA_*`, Book II, Turtle, Lifeboat, Steward A4, etc. | Untracked | Still present | n/a | HIGH | **NOT_AFFECTED** |
| `docs/Z_SHADOW_TAXONOMY_AND_CONTRACT_SPEC_1.md` | Spot-check | Matches HEAD | n/a | HIGH | **NOT_AFFECTED** (seal intact) |
| C360 F4 JSON / Z Logic Spec 0 | Spot-check | Matches HEAD | n/a | HIGH | **NOT_AFFECTED** |

## Exact Recoveries

| Path | Action | Provenance |
| --- | --- | --- |
| `docs/Z_MICRO_MESO_MACRO_AGGREGATION_SPEC_1.md` | Restored to `51126b5` | Working-tree hash equals `HEAD:` hash |
| `docs/Z_MICRO_MESO_MACRO_STEWARD_P0_DECISIONS_1_1.md` | Restored to `51126b5` | Working-tree hash equals `HEAD:` hash |
| `docs/Z_TRAFFIC_MINIBOTS.md` | Restored to Local History `74c080a9/H6AR.md` (exact) | Path identity confirmed · pre-incident · matches live `z_traffic_minibots_status.mjs` 8th required Law Bot |

## Traffic MiniBots Resolution

| Field | Value |
| --- | --- |
| Gate | `Z-SANCTUARY-TRAFFIC-MINIBOTS-STEWARD-RECOVERY-1` |
| Evidence source | Cursor Local History `…/User/History/74c080a9/H6AR.md` (2026-08-21 11:41:32 local) |
| Path identity | `file:///…/docs/Z_TRAFFIC_MINIBOTS.md` — **CONFIRMED** |
| Pre-incident | **YES** (predates Aug-22 `git restore -- docs/`) |
| Verdict | **`RECOVER_EXACT_LOCAL_HISTORY`** (file equals LH after apply; only two substantive hunks vs prior HEAD) |
| Recovered content | (1) Companion sentence: Law Bot **also required inside** `npm run z:traffic` as 8th required minibot; (2) roster table row for **Z-SWARM-14DRP-1 Law Bot** |
| Rejected content | **None** — no synthetic merge; no other LH variants applied |
| Cross-check | `scripts/z_traffic_minibots_status.mjs` already registers Law Bot as required (`true`); docs were stale vs executable |
| Authority / runtime | Classifier / report-only · exit 1 only if RED · **no activation** in this gate |
| Residual ambiguity (Traffic) | **NONE** after recovery |

Former STEWARD_REVIEW for Traffic is **closed**.

### Formatting-class Local History (C360 / Layers / Goldens / Steward gate)

Older History often differs only by trailing spaces / table alignment. Auto-applying would reintroduce formatter churn without proven intentional content gain → **no auto recovery** (unchanged).

## Ambiguous Candidates

**None remaining at MEDIUM/HIGH confidence.** Traffic resolved above.

## Unrecoverable Candidates

Exact Aug-22 unstaged content for the **other** wiped tracked `docs/` set (excluding Traffic, which is recovered):

```text
PATH IDENTITY MAY BE KNOWN
EXACT PRE-RESTORE BYTES NOT EVIDENCED
NO CONTENT INVENTED
UNRECOVERABLE_FROM_AVAILABLE_EVIDENCE
```

Reasons: never committed · not in stash@{0} docs · no proven immediate pre-restore Local History capture for those working trees.

This evidence gap remains recorded honestly and does **not** block forward progress once Traffic is resolved.

## Current Dirt Comparison

| Metric | Approximate |
| ------------------------------- | ---------------------------------------------------------- |
| Reported pre-incident porcelain | ~183 |
| Reported post-incident | ~127 |
| Audit-time porcelain | ~126 |
| Tracked dirty `docs/` now | **None** after aggregation restore (untracked docs remain) |

Untracked documentation (OMEGA, Turtle phases, Book II, Lifeboat, Steward A4 charter, etc.) remains and was **not** deleted by the incident restore.

## Sealed-Surface Verification

| Surface | Working tree vs `51126b5` / HEAD |
| ----------------------------------------------------------------------- | -------------------------------- |
| `docs/Z_MICRO_MESO_MACRO_AGGREGATION_SPEC_1.md` | **MATCH** (after RECOVER_EXACT) |
| `docs/Z_MICRO_MESO_MACRO_STEWARD_P0_DECISIONS_1_1.md` | **MATCH** (after RECOVER_EXACT) |
| `docs/Z_SHADOW_TAXONOMY_AND_CONTRACT_SPEC_1.md` | **MATCH** |
| `docs/Z_CONTINUOUS_360_MULTIDIMENSIONAL_FIELD_SPEC_1.md` | **MATCH** |
| `docs/Z_LOGIC_AND_CONTROL_GRAMMAR_SPEC_0.md` | **MATCH** |
| `data/formula_semantic_goldens/continuous_360_semantic_goldens_v1.json` | **MATCH** |

`51126b5` commit itself was **not** amended, reset, or rewritten.

## Residual Risk

1. Intentional unstaged doc edits that existed only in the working tree on Aug-22 and were never History-captured remain lost (**acknowledged evidence gap**).
2. Porcelain count is not a perfect proxy for “documents lost” (multi-line status, non-docs, untracked).
3. Future mass `md:table-compact` / `git restore -- docs/` remains hazardous — treat as **forbidden without path-scoped plan**.

Traffic MiniBots residual ambiguity: **NONE** after exact Local History recovery.

## Steward Action Required

| Priority | Action |
| --- | --- |
| Done | Traffic MiniBots Local History reviewed and recovered exactly |
| Done | Residual unrecoverable wiped docs recorded as evidence gap (no invention) |
| Optional | Spot-check recovered Law Bot wording against operator expectation |
| Next | Formula HOLD released — open Micro/Meso/Macro semantic goldens design |

## Gate Recommendation

```text
Z-MICRO-MESO-MACRO-SEMANTIC-GOLDENS-DESIGN-1
```

```text
DOCS_RECOVERY_HOLD_RELEASED = YES
```

Conditions met: Traffic verdict resolved · no other HIGH/MEDIUM recoverable candidate unresolved · unrecoverable dirt acknowledged · critical formula sealed architecture still matches `51126b5`.

## Commit posture

Narrow recovery/audit seal authorized for:

- `docs/Z_TRAFFIC_MINIBOTS.md`
- `docs/Z_DOCS_DIRT_INCIDENT_RECONCILIATION_1.md`

Suggested message: `docs(recovery): reconcile docs restore incident` · **no push**.

## Terminal

```text
DOCS_DIRT_INCIDENT_RECONCILIATION_1 = RECONCILED
TRAFFIC_MINIBOTS = RECOVERED_FROM_LOCAL_HISTORY
51126b5 = PRESERVED (formula seals)
LOST_BYTES_INVENTED = NO
BULK_RESTORE_DURING_AUDIT = NO
DOCS_RECOVERY_HOLD_RELEASED = YES
NEXT_FORMULA_GATE = Z-MICRO-MESO-MACRO-SEMANTIC-GOLDENS-DESIGN-1
```\n
