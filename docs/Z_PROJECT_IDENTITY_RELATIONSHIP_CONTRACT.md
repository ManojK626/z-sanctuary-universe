# Z-Project Identity Relationship Contract

**Status:** PID-0.5 · DESIGN CONTRACT · Steward review (uncommitted until seal gate)
**Date:** 2026-08-20
**Authority:** AMK-Goku · Super Turtle · Consolidation Era
**Predecessor:** Z-SANCTUARY-PROJECT-IDENTITY-DUPLICATE-GUARD-1 (design)
**Health baseline:** [Z_SANCTUARY_INDICATOR_SUPER_TURTLE_HEALTH_REVIEW_1.md](Z_SANCTUARY_INDICATOR_SUPER_TURTLE_HEALTH_REVIEW_1.md) · `a09028c`
**Related (not replaced):** [PROJECT_IDENTITY_RECONCILIATION.md](PROJECT_IDENTITY_RECONCILIATION.md) · [Z_IDENTITY_MANIFEST.md](Z_IDENTITY_MANIFEST.md) · [Z_SANCTUARY_STEWARD_DIAGNOSTIC_CORE_0.md](Z_SANCTUARY_STEWARD_DIAGNOSTIC_CORE_0.md)

**Implementation:** NONE · **Runtime:** NONE · **Z-SDC Phase 1:** CLOSED

---

## 1. Purpose

Define the smallest canonical **identity and relationship language** required before any future Project Identity observation script (PID-1) may classify filesystem roots.

This contract exists to prevent:

```text
machine observation → informal label → generated metadata → accidental governance doctrine
```

It seals vocabulary, evidence rules, authority boundaries, HOLD behavior, and PID-1 limits.
It does **not** implement the Duplicate Guard, create registries, or select canonical paths.

---

## 2. Scope

| In scope | Out of scope |
| --- | --- |
| Identity laws | PID-1+ implementation |
| Relationship vocabulary (V1) | Folder move/delete/merge |
| Canonical-path states | Membership grants |
| Evidence precedence | Runtime / deploy authority |
| Authority matrix | Z-SDC Phase 1 |
| HOLD / Steward boundaries | New master registry |
| Privacy / rebuildability | External AI |
| PID-1 allowed outputs | Auto-canonical / auto-cleanup |

---

## 3. Non-goals

- No second Overseer, Folder Manager, or master project registry
- No universal health percentage
- No automatic cleanup, merge, rename, or membership
- No automatic canonical selection
- No graph database / schema implementation
- No indicator creation in this phase

---

## 4. Identity laws

Sealed permanently for current architecture:

```text
FOLDER NAME ≠ PROJECT IDENTITY
PATH ≠ OWNERSHIP
PACKAGE NAME ≠ CANONICAL AUTHORITY
GIT REMOTE ≠ AUTOMATIC OWNERSHIP
SIMILARITY ≠ IDENTITY
SIMILARITY ≠ DUPLICATE PROOF
NEWER COPY ≠ CANONICAL
NESTED COPY ≠ BACKUP BY DEFAULT
MULTIPLE ROOTS ≠ MULTIPLE PROJECTS
WORKTREE ≠ ORGANISM
BACKUP ≠ CANONICAL
CONTINUATION ≠ CANONICAL
EXTERNAL ≠ MISSING
KNOWN ≠ MEMBER
MEMBER ≠ RUNTIME
RUNTIME ≠ DEPLOYMENT
RELATIONSHIP ≠ OWNERSHIP
CORRELATION ≠ CAUSATION
DEPENDENCY ≠ AUTHORIZATION
FEDERATION ≠ CONTROL
PROXIMITY ≠ MEMBERSHIP
```

**Stable identity principle:** A project identity is a logical ecosystem identity that may be observed at one or more physical roots over time. A path is a location associated with identity evidence — not sufficient proof of identity by itself.

Conceptual node kinds (no storage): `PROJECT_IDENTITY` · `FILESYSTEM_ROOT` · `GIT_REPOSITORY` · `GIT_WORKTREE` · `PACKAGE_IDENTITY` · `REGISTRY_RECORD` · `INDICATOR` · `EXTERNAL_ORGANISM`

---

## 5. Existing authority planes

**NO NEW MASTER PROJECT REGISTRY.**

| Plane | Role |
| --- | --- |
| PC-root registry | Folder citizenship evidence (`id` / `path` / `role` / `hosting`) |
| Universe registry / census | Mission Control / census citizenship |
| Family AI registry | Companion / human identity (not folder collision) |
| Steward receipts / governance | Highest sealed ownership decisions |
| AMK indicators | Posture signals (KNOWN ≠ MEMBER) |
| Git metadata | Repository / worktree evidence |
| Doorway awareness | Path / multi-id collision evidence |
| Lifeboat classification | Relationship-classification **seed** (not continuous Overseer) |
| Cycle Observe / Awareness | Future safe **consumers** of identity reports |
| Z-Super Overseer / EAII | Future synthesis surface — not auto-repair |
| Z-SDC Phase 0 | Supplementary similarity design only · Phase 1 CLOSED |

PID-1 will **normalize** evidence from these sources. It will not replace them.

---

## 6. Relationship vocabulary (V1 minimum)

| Term | Definition |
| --- | --- |
| `CANONICAL` | Currently accepted authoritative home/root for a specific project identity per **sealed** evidence — not newest/largest/nearest/most-complete/same-package |
| `MEMBER` | Explicitly recognized citizen of the relevant Sanctuary scope; does **not** grant runtime, deploy, auto-open, or external ownership |
| `EXTERNAL` | Known project/organism intentionally outside owning Sanctuary scope · **EXTERNAL ≠ MISSING** |
| `WORKTREE_OF` | Git metadata proves a filesystem root is a working tree of an existing repository identity |
| `BACKUP_OF` | Explicit evidence establishes preservation/recovery relationship — not inferred from date/suffix/nesting alone |
| `MIRROR_OF` | Explicit evidence of intentional mirror — not canonical, member, or runtime by itself |
| `CONTINUATION_OF` | Explicitly authorized continuation lineage — **generated continuation metadata without sealed governance must NOT establish this** (Universe 2 lesson) |
| `ARCHIVE_OF` | Intentional historical/frozen/legacy retention — not disposable; not deletion license |
| `FORK_OF` | Intentional divergence remaining independently identifiable — not accidental duplicate; package similarity insufficient |
| `HOLD_UNCLASSIFIED` | Relationship may exist but evidence is insufficient or contradictory for safe classification |

Deferred from V1 unless later evidence proves need: `GENERATED_COPY_OF` · `NESTED_COPY_OF`.

### Canonical claim collision

```text
MULTI_CLAIM / competing CANONICAL evidence
        ↓
HOLD
        ↓
STEWARD REVIEW
```

No automatic winner.

---

## 7. Canonical-path states

Separate from relationship type:

| State | Meaning |
| --- | --- |
| `PRESENT` | Declared canonical path exists; no known relevant contradiction |
| `MISSING` | Declared canonical path absent — **do not** auto-promote another copy (Lumina lesson) |
| `MULTI_CLAIM` | More than one root claims canonical authority → HOLD |
| `UNKNOWN` | No reliable canonical evidence |
| `HOLD` | Canonical resolution intentionally deferred |

---

## 8. Evidence precedence

Default hierarchy (higher outranks lower; contradictions are **reported**, not silently overridden):

1. Explicit sealed Steward / governance identity decision
2. Stable committed registry `project_id` / explicit identity record
3. Git worktree metadata / repository identity with proven relationship
4. Declared canonical path plus disk existence
5. Package / module manifest identity (**evidence only**)
6. Filesystem topology / normalized structure
7. Folder names / timestamps / similarity (**weakest**)

**Similarity may open a question. Similarity may not close the question.**  
Similarity → `POSSIBLE_RELATIONSHIP` only — never auto `BACKUP_OF` / `CONTINUATION_OF` / `CANONICAL` / same-project.

**Package name = evidence only** (Gem/D2 lesson). Conflict → HOLD.

---

## 9. Evidence / confidence states

| State | Meaning |
| --- | --- |
| `EXACT_IDENTITY` | Deterministic same-identity evidence (e.g. Git worktree proof) |
| `STRONG_RELATIONSHIP_EVIDENCE` | Strong support; may still lack governance authority |
| `POSSIBLE_RELATIONSHIP` | Similarity / indirect evidence warrants observation |
| `AMBIGUOUS` | Significant conflict |
| `INSUFFICIENT_EVIDENCE` | Cannot safely classify |

No universal score.

---

## 10. Authority matrix

| Relationship | Membership | Canonical authority | Runtime | Deploy | Auto-classifiable? | Steward needed? |
| --- | --- | --- | --- | --- | --- | --- |
| `CANONICAL` | Reflects existing sealed claim only | Reflects existing sealed claim only | NO | NO | NO (must already be established) | If contested |
| `MEMBER` | YES if registry/governance says so | NO by itself | NO | NO | Only if registry already states | If granting |
| `EXTERNAL` | NO | NO | NO | NO | When known external evidence | If promoting |
| `WORKTREE_OF` | NO | NO | NO | NO | **YES** if Git-proven | Usually no |
| `BACKUP_OF` | NO | NO | NO | NO | Only with explicit strong evidence | If ambiguous |
| `MIRROR_OF` | NO | NO | NO | NO | Only with explicit strong evidence | If ambiguous |
| `CONTINUATION_OF` | NO | NO | NO | NO | Only with sealed authorization | If unsealed/ambiguous |
| `ARCHIVE_OF` | NO | NO | NO | NO | Only with explicit evidence | If ambiguous |
| `FORK_OF` | NO | NO | NO | NO | Rare / strong evidence | Often yes |
| `HOLD_UNCLASSIFIED` | NO new grant | NO | NO | NO | YES when unsure | YES when ownership matters |

**The classifier does not create canonical, membership, runtime, or deployment authority.**

---

## 11. Automatic classification limits (future PID-1/2)

**Allowed when evidence is deterministic:**

- `WORKTREE_OF` (Git-proven)
- `CANONICAL_PATH_MISSING` (declared path absent)
- `REGISTRY_DISK_DRIFT` (direct compare mismatch)
- `HOLD_UNCLASSIFIED`
- `POSSIBLE_RELATIONSHIP` (weak similarity — observation only)

**Not auto without explicit strong relationship evidence:**

- `BACKUP_OF` · `MIRROR_OF` · `CONTINUATION_OF` · `FORK_OF` · `CANONICAL`

**Ambiguity law:** AMBIGUITY → HOLD — never guess latest / largest / nearest / first registry hit / name-contains-canonical.

---

## 12. HOLD doctrine

`HOLD_UNCLASSIFIED` implies:

| Action | Allowed? |
| --- | --- |
| New membership grant | NO |
| Runtime | NONE |
| Deployment | NONE |
| Canonical promotion | NO |
| Cleanup / merge / move / rename | NO |
| Steward review when ownership/canonical intent matters | YES |

```text
DETECT ≠ DELETE
CLASSIFY ≠ MOVE
IDENTIFY ≠ MERGE
COLLISION ≠ CLEANUP AUTHORITY
PID MAY REPORT CANONICAL EVIDENCE
PID MAY NOT CREATE CANONICAL AUTHORITY
```

---

## 13. Steward decision boundary

AMK-Goku / Steward required when:

- multiple canonical claims
- backup vs continuation ambiguity
- same stable identity claimed by independent roots
- external vs member ambiguity
- fork vs accidental duplicate ambiguity
- destructive cleanup requested
- canonical or membership promotion requested

The system may **report**. It may not **decide** those ownership questions autonomously.

---

## 14. Pre-create principle (design only)

Before controlled create/register:

```text
CHECK project ID → known paths → Git/worktrees → package identity
→ relationship evidence → similarity (weak)
→ collision? → HOLD · POTENTIAL_EXISTING_PROJECT
```

No new root treated as independent until classification resolves.

---

## 15. Post-create observation principle (design only)

```text
NEW ROOT OBSERVED → IDENTITY UNKNOWN → UNCLASSIFIED PROJECT DISCOVERED
→ NO MEMBERSHIP → NO RUNTIME
```

No automatic deletion.

---

## 16. Privacy / secrets / rebuildability

- **LOCAL_ONLY** — no external AI for V1 identity inference; no upload of trees, fingerprints, topology, Git metadata, or registries
- Exclude secret **values** (`.env` contents, keys, tokens, passwords, private keys, DB credentials)
- **CANON > DERIVED MEMORY** — observation reports/caches must be rebuildable; derived output is never irreplaceable governance

---

## 17. Existing-organ reuse

| Organ | Responsibility |
| --- | --- |
| PC-root / Universe | Citizenship evidence |
| Git metadata | Repository / worktree evidence |
| Lifeboat | Classification seed |
| Doorway | Path / multi-id collision evidence |
| Cycle Observe | Future safe report consumer |
| Awareness | Future posture consumer |
| Overseer / EAII | Future synthesis (observe + report) |
| AMK Indicators | Optional later derived signal |
| Z-SDC | Future supplementary similarity · Phase 1 CLOSED |

No organ replacement. No second Overseer. No second Folder Manager.

---

## 18. Case-study lessons (governance not reopened)

| Case | Standing | Contract lesson |
| --- | --- | --- |
| Universe 2 | HOLD · dirty continuation not canon | Generated labels without authority ≠ `CONTINUATION_OF` |
| Lumina | KEEP_ROOT_HOLD · canonical NONE | `CANONICAL_PATH_MISSING` ≠ promote observational copy |
| Hub worktrees (3) | EXCLUDE AS MEMBERS | Git-proven → safe `WORKTREE_OF` |
| Gem / D2 | D2-HOLD · NO BIND | Package similarity is weak |
| SSR | KNOWN · HOLD_OBSERVER_DORMANT | KNOWN ≠ MEMBER |
| Z-Family Health | KNOWN · HOLD / OBSERVE_ONLY | KNOWN ≠ MEMBER |
| ASTRALIS / Z-Oisela | EXTERNAL · NOT MISSING | Outside Organiser ≠ absent |

---

## 19. PID-1 allowed contract

When separately chartered, PID-1 **may**:

- READ approved evidence (registries, Git worktree metadata, path existence)
- NORMALIZE classifications per this contract
- WRITE only derived reports under `data/reports/`
- REPORT ambiguity

PID-1 **may not**:

- edit registries · change membership · move/delete/rename folders
- promote canonical paths · start runtime · deploy · open Z-SDC Phase 1

**Initial PID-1 machine output vocabulary (conservative):**  
`WORKTREE_OF` · `CANONICAL_PATH_MISSING` · `REGISTRY_DISK_DRIFT` · `HOLD_UNCLASSIFIED` · `POSSIBLE_RELATIONSHIP`

---

## 20. Deferred capabilities

PID-1 implementation · PID-2 classifier expansion · PID-3 similarity · PID-4 Overseer connection · PID-5 indicator · PID-6 pre-create gate · Z-SDC fingerprint runtime · new registry · cleanup · deployment

---

## 21. Super Turtle compatibility

```text
Observe before action
Classify before remediation
Identity before canonical authority
HOLD before guessing
Human gate before destructive action
```

Compatible with Consolidation Era and Super Turtle Mode.

---

## 22. Architecture verdicts (sealed here)

| Verdict | Answer |
| --- | --- |
| New master registry | NO |
| Second Overseer | NO |
| Second Folder Manager | NO |
| Auto-cleanup | NO |
| Auto-canonical selection | NO |
| External AI | NO |
| Z-SDC Phase 1 | CLOSED |
| New universal score | NO |

---

## 23. Golden doctrine

Identity before automation. Classification before remediation. Evidence before relationship. Relationship before ownership. HOLD before guessing.

A path is a location. A project ID is an identity. A package name is evidence. A fingerprint is evidence. Similarity asks a question — it does not answer ownership.

Worktrees are working surfaces. Backups are preserved relationships. External organisms remain external unless governance says otherwise.

No generated label becomes doctrine by repetition. No report creates canonical authority. No classifier grants runtime or deployment.

AMK-Goku owns the sacred moves.
