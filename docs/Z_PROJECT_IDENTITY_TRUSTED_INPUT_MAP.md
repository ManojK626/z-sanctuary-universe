# Z-Project Identity — Trusted Input Map (PID-1A)

**Status:** PID-1A · TRUSTED INPUT MAP · binds PID-1B observation  
**Date:** 2026-08-20  
**Contract:** [Z_PROJECT_IDENTITY_RELATIONSHIP_CONTRACT.md](Z_PROJECT_IDENTITY_RELATIONSHIP_CONTRACT.md) · sealed `c685b76`  
**Health baseline:** [Z_SANCTUARY_INDICATOR_SUPER_TURTLE_HEALTH_REVIEW_1.md](Z_SANCTUARY_INDICATOR_SUPER_TURTLE_HEALTH_REVIEW_1.md) · `a09028c`  
**Authority:** Observation only · **not** a registry · **not** membership · **not** canonical authority

---

## Purpose

Classify every potential PID-1 evidence source **before** derived reports are written, so dirty or weak inputs cannot silently become governance doctrine.

```text
PID-0.5 sealed language
        ↓
PID-1A Trusted Input Map  (this document)
        ↓
PID-1B Read-only identity report
```

---

## Trust classes

| Class | Meaning | May drive auto classification? |
| --- | --- | --- |
| `TRUSTED_CANON` | Sealed Steward/governance documentation or committed identity contract | Yes — as law / sealed standing |
| `TRUSTED_STRUCTURAL` | Deterministic local structure (Git worktree list, path exists/missing) | Yes — for WORKTREE_OF / path missing / drift |
| `OBSERVATIONAL_ONLY` | Useful awareness; never alone establishes BACKUP/CONTINUATION/CANONICAL/MEMBER | No for heavy relations |
| `DIRTY_UNSEALED` | Generated or contested metadata without sealed governance | **Never** as ownership authority → HOLD |
| `DERIVED` | Outputs of prior reports / fingerprints | Rebuildable · not SoT |
| `EXCLUDED` | Secrets, provider APIs, arbitrary disk outside Organiser, Z-SDC Phase 1 | Must not read/use |
| `UNKNOWN` | Not yet classified | Treat as HOLD |

---

## Input map (V1)

| Source | Class | PID-1B may use for | Must not use for |
| --- | --- | --- | --- |
| PID-0.5 Identity Relationship Contract | `TRUSTED_CANON` | Vocabulary · HOLD law · auto limits | — |
| Steward receipts (D2/EMK/REP) + health review seals | `TRUSTED_CANON` | Case standing · lessons | Reopening decisions |
| Consolidation / Super Turtle charters | `TRUSTED_CANON` | Boundaries | — |
| `git worktree list` (hub repo) | `TRUSTED_STRUCTURAL` | `WORKTREE_OF` | Membership |
| Disk path exists / missing vs declared PC-root `path` | `TRUSTED_STRUCTURAL` | `CANONICAL_PATH_MISSING` · `REGISTRY_DISK_DRIFT` | Auto-promote copy |
| `data/z_pc_root_projects.json` row existence / id / empty path | `TRUSTED_STRUCTURAL` + registry | Identity enumeration · drift | Treating `role=continuation_*` as sealed CONTINUATION_OF |
| PC-root `role` / `hosting` / `migration_status` / notes for contested trees (esp. Universe 2) | `DIRTY_UNSEALED` or `OBSERVATIONAL_ONLY` | Narrative context only | `CONTINUATION_OF` · CANONICAL · MEMBERSHIP change |
| Universe / SOTU / census snapshots | `OBSERVATIONAL_ONLY` | Cross-check hints | Ownership |
| Package.json `name` | `OBSERVATIONAL_ONLY` | `POSSIBLE_RELATIONSHIP` | SAME_PROJECT · alias · bind |
| Folder names / timestamps | `OBSERVATIONAL_ONLY` | Weak hints | Any sealed relation |
| AMK indicators (SSR / Z-Family posture) | `OBSERVATIONAL_ONLY` | KNOWN awareness · HOLD posture | MEMBER grant |
| Lifeboat classify outputs | `DERIVED` / observational | Compare later | Override TRUSTED_CANON |
| Cycle Observe / Awareness reports | `DERIVED` | Not consumed in PID-1B V1 | — |
| `.env` / secrets / tokens | `EXCLUDED` | — | Everything |
| External AI / cloud | `EXCLUDED` | — | Everything |
| Z-SDC Phase 1 runtime | `EXCLUDED` | — | Phase 1 CLOSED |
| Arbitrary paths outside Organiser PC-root | `EXCLUDED` (V1) | External lessons via TRUSTED_CANON only | Disk walk |

---

## Conservative machine outputs (PID-1B)

**Allowed:** `WORKTREE_OF` · `CANONICAL_PATH_MISSING` · `REGISTRY_DISK_DRIFT` · `HOLD_UNCLASSIFIED` · `POSSIBLE_RELATIONSHIP`

**Forbidden as auto labels:** `BACKUP_OF` · `MIRROR_OF` · `CONTINUATION_OF` · `FORK_OF` · `CANONICAL`

Ambiguous → `HOLD_UNCLASSIFIED`.

---

## Derived report marking (required)

Any PID-1B output must declare:

```text
DERIVED · READ-ONLY · REBUILDABLE · LOCAL_ONLY
NOT A REGISTRY · NOT MEMBERSHIP AUTHORITY · NOT CANONICAL AUTHORITY
```

Paths (provisional):

- `data/reports/z_project_identity_observe_status.json`
- `data/reports/z_project_identity_observe_status.md`

---

## Integration freeze (PID-1B V1)

Do **not** wire into: Overseer · Cycle Observe · indicators · Doorway · Mission Control · Lifeboat apply · registry edits.

Prove the report tells the truth first.

---

## Case expectations (verify, do not mutate)

| Case | Expected machine stance |
| --- | --- |
| Hub Git worktrees | `WORKTREE_OF` hub · not members |
| Lumina empty path | `CANONICAL_PATH_MISSING` · no promote |
| Universe 2 | `HOLD_UNCLASSIFIED` (dirty/unsealed labels ignored as authority) |
| Gem package name vs D2 id | `POSSIBLE_RELATIONSHIP` · no bind |
| SSR / Z-Family on disk | KNOWN awareness · not MEMBER |
| ASTRALIS / Z-Oisela | EXTERNAL · NOT MISSING (from sealed lessons; no incorporation) |
