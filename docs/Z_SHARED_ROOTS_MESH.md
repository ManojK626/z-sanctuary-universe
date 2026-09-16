# Z-Shared Roots Mesh — Z-SRM-OBSERVE-1

**Gate:** `Z-SRM-OBSERVE-1`  
**Posture:** READ-ONLY OBSERVER  
**Runtime service:** none  
**Canonicalisation:** none

Z-Atlas maps what exists. Z-SRM observes whether multiple project organisms appear to share doctrine, contracts, capabilities, or services — and what evidence supports that observation.

Z-SRM does **not** command the organism, extract shared packages, merge projects, or declare canonical shared roots.

## Constitutional law

```text
Similarity does not authorize extraction.
Reuse does not imply ownership.
A project does not become subordinate because it consumes a shared root.
Shared doctrine may remain locally implemented.
Shared runtime requires stronger governance than shared code.
No capability becomes canonical without verified multi-project semantic alignment.
Divergence is evidence, not failure.
Human stewardship controls extraction and canonicalisation.
UNKNOWN must never be silently treated as GREEN.
```

## Architectural boundaries

| System | Question |
| --- | --- |
| Z-Atlas | What exists, and how is the organism connected? |
| Z-SEIF | What capabilities already exist so we do not duplicate them? |
| Crystal DNA | Where is structural / path drift appearing? |
| Z-SRM | Which existing capabilities appear to have legitimate multi-project shared-root relationships? |
| Z-AI-FUSION-MAP | Which **hub AI lanes** overlap (lead/support)? Not a project-sharing engine. |
| CaseGraph | CLOSED this phase — evidence graphs later, separate Turtle PR. |

If SRM needed to rewrite Atlas nodes/edges to function, that would be an architectural conflict. This observer **only reads** Atlas.

## Classification (this phase)

`SHARED_DOCTRINE` · `SHARED_CONTRACT` · `SHARED_CAPABILITY_CANDIDATE` · `SHARED_SERVICE_CANDIDATE` · `KEEP_LOCAL` · `DIVERGED` · `HUMAN_REVIEW_REQUIRED` · `UNKNOWN`

`SHARED_CANONICAL` is **not** authorized.

## Evidence sufficiency (not probability)

`HIGH_EVIDENCE_ALIGNMENT` · `PARTIAL_EVIDENCE` · `INSUFFICIENT_EVIDENCE` · `CONFLICTING_EVIDENCE` · `UNKNOWN`

Do not emit unexplained numerical AI confidence percentages.

## Distinction law (never collapse)

`DUPLICATE_BYTES` ≠ `DUPLICATE_PATH` ≠ `DUPLICATE_NAME` ≠ `SIMILAR_STRUCTURE` ≠ `COMMON_LINEAGE` ≠ `SEMANTIC_SIMILARITY` ≠ `SHARED_DOCTRINE` ≠ `SHARED_CONTRACT` ≠ `SHARED_CAPABILITY_CANDIDATE`

Similar names are not implementation-sharing evidence.

## Inputs (consume if present on the isolated base)

Atlas registry · SEIF docs · Crystal DNA manifest/report · `data/z_pc_root_projects.json` · module manifest · legal stack registry · duplicate-audit docs · MiniBot / traffic observers · **ZSX** `data/z_cross_project_capability_index.json` · Z-OTF reuse/overlap matrix.

Do not fork ZSX, SEIF, OTF, or Fusion Map. SRM’s question is shared-root *relationships*, not a second capability catalog.

Absent inputs: `SOURCE_NOT_AVAILABLE` / `UNKNOWN`. Do not invent GREEN.

PID/CLDO and Z-VUE unmerged worktrees are **not** canonical on this base: `PID_CLDO_CANONICAL_STATUS: NOT_ON_BASE`.

## Outputs

`npm run z:srm:observe` → `data/reports/z_srm_observe_status.{json,md}` only.

Forbidden: rewrite projects, Atlas, SEIF, Crystal DNA, identity registries, dashboards, legal workstation, extract/refactor, CaseGraph files, shared runtime, deploy.

## MiniBot roles

Logical roles (Rootkeeper, Lineage, Dependency, Divergence, Custodian, Boundary, Reconciliation, Impact) map onto **existing** observers. This phase creates **zero** new MiniBot engines.

## Command

```bash
npm run z:srm:observe
```

Read → analyze → report → exit.
