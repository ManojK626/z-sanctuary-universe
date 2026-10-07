# Z-Project Identity Relationship Contract

**Status:** CURRENT DERIVATIVE — NOT BYTE-IDENTICAL TO HISTORICAL SOURCE

**Date:** 2026-10-07

**Authority:** AMK-Goku · vocabulary only · no implementation · no runtime

**Implementation:** NONE · **Runtime:** NONE · **Observer reports:** NOT CURRENT ON THIS BASE

## Provenance

SOURCE PILOT COMMIT: `3b62323d1f2d3ef0f359b7e709974312ccfc66b5`

SOURCE ORIGINAL BLOB: `b5cbeaa7029f7ad0dac8326cd6a1e77c7f1d00a3`

DERIVATION BASE: `origin/main` @ `1c597e2cb4ddc1a81b09695a2899d1c592a345a8`

STATUS: CURRENT DERIVATIVE — NOT BYTE-IDENTICAL TO HISTORICAL SOURCE

The historical branch seal `c685b76` is provenance. It is not acceptance of this file on `origin/main`.

## Current companions

These files exist on the derivation base. They do not replace this vocabulary.

- [Constitution V1](governance/Z_SANCTUARY_UNIVERSE_CONSTITUTION_V1.md) — humans decide; readiness is not deploy; canonical rosters are the existing registries.
- [Z-SEIF existing-capability reconciliation](z_seif/Z_SEIF_EXISTING_CAPABILITY_RECONCILIATION.md) — consume identity vocabulary; a second identity registry is drift.
- [Z-UORM 0.1 composition contract](z-uorm/Z_UORM_COMPOSITION_CONTRACT_0_1.md) — not a project registry and not a health engine.
- [Trusted input map](Z_PROJECT_IDENTITY_TRUSTED_INPUT_MAP.md) — current derivative of the input classes.

No Z-CCC doctrine body is on this base. This derivative does not create one.

Historical audit companions are not linked. They are preserved on the pilot commit and are not current doctrine. That includes the August 2026 project-identity audit map, the control-panel audit, the Super Turtle health review, the Book B identity manifest, and the Z-SDC Phase 0 architecture note.

## 1. Purpose

Define the smallest identity and relationship language required before any future project-identity observation may classify filesystem roots.

This contract exists to prevent:

```text
machine observation → informal label → generated metadata → accidental governance doctrine
```

It keeps vocabulary, evidence rules, authority boundaries, HOLD behavior, and observer limits.

It does not implement an observer, create a registry, or select canonical paths.

## 2. Scope

| In scope | Out of scope |
| --- | --- |
| Identity laws | Observer implementation |
| Relationship vocabulary | Folder move, delete, or merge |
| Canonical-path states | Membership grants |
| Evidence precedence | Runtime or deploy authority |
| Authority matrix | A new master registry |
| HOLD and Steward boundaries | External AI inference as authority |
| Future observer output limits | Auto-canonical selection or cleanup |

## 3. Non-goals

- No second Overseer, Folder Manager, or master project registry.
- No universal health percentage.
- No automatic cleanup, merge, rename, or membership.
- No automatic canonical selection.
- No graph database or schema implementation.
- No indicator creation in this derivative.

## 4. Identity laws

Standing vocabulary for this derivative:

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
IDENTIFIERS ARE NAMESPACE-SCOPED
SAME STRING ≠ SAME IDENTITY
DIFFERENT STRING ≠ DIFFERENT IDENTITY
```

A project identity is a logical ecosystem identity. It may be observed at one or more physical roots over time. A path is a location associated with identity evidence. A path is not sufficient proof of identity.

Canonical identity requires explicit human confirmation. Observer evidence must not silently become ownership. A classifier must not create canonical authority.

Conceptual node kinds, with no storage: `PROJECT_IDENTITY`, `FILESYSTEM_ROOT`, `GIT_REPOSITORY`, `GIT_WORKTREE`, `PACKAGE_IDENTITY`, `REGISTRY_RECORD`, `INDICATOR`, `EXTERNAL_ORGANISM`.

## 5. Existing authority planes

No new master project registry.

| Plane | Role |
| --- | --- |
| PC-root registry | Folder citizenship evidence (`id`, `path`, `role`, `hosting`) |
| Universe registry / census | Mission Control / census citizenship, where that registry exists on the current base |
| Family AI registry | Companion or human identity, not folder collision |
| Steward decisions on the current base | Highest ownership decisions for this base |
| AMK indicators | Posture signals. KNOWN is not MEMBER |
| Git metadata | Repository and worktree evidence |
| Doorway awareness | Logical lane or open-path evidence. Several ids on one path are not automatic ownership |
| Lifeboat classification | Relationship-classification seed, not a continuous Overseer |
| Cycle Observe / Awareness | Future consumers of identity reports, not current authority |
| Z-Super Overseer / EAII | Future synthesis surface, not auto-repair |

A future observer may normalize evidence from these sources. It does not replace them. This derivative does not authorize that observer to run.

### Cross-plane identity namespaces

A namespace is the declared identity domain in which an identifier is issued, interpreted, and required to be unique. The planes above are not one shared namespace.

```text
ID EQUALITY IS MEANINGFUL ONLY WITHIN
THE SAME DECLARED IDENTITY NAMESPACE
UNLESS AN EXPLICIT AUTHORITATIVE LINK EXISTS.
```

Interpret identifiers as `(namespace, identifier)`. `("pc_root", "example")` is distinct from `("family_ai", "example")` unless an explicit link joins them.

An explicit cross-plane link is a committed registry field, a governance mapping on the current base, a declared relationship field, or another explicit authoritative relation. String equality, folder-name similarity, package similarity, path proximity, timestamps, and AI inference are not explicit links.

Within one authoritative namespace, the same id with incompatible independent identity claims may be `ID_COLLISION`. The same string across namespaces is not `ID_COLLISION`. This derivative does not authorize an `ID_COLLISION` detector.

Across namespaces, a matching literal string is at most possible linkage evidence. It is never automatic `EXACT_IDENTITY`, membership, or canonical authority. Different strings across planes do not automatically mean different organisms.

| Rule | Meaning |
| --- | --- |
| `FAMILY_AI_ID ≠ PC_ROOT_ID` | Companion or AI identity is not folder citizenship unless explicitly linked |
| `INDICATOR IDENTITY ≠ PROJECT IDENTITY` | Indicator records describe posture. They are not the project canonical id |
| `DOORWAY_ID ≠ UNIVERSE_STABLE_KEY` | Doorway ids may be logical lanes, not competing ownership claims |
| `PACKAGE NAME ≠ SANCTUARY PROJECT ID` | Package name is its own observational plane |
| Git repo or worktree identity is not a Sanctuary project id | Git may prove `WORKTREE_OF` without assigning registry ids |
| A filesystem path is not an ID namespace | Several lanes may reference one root |

`ID_COLLISION` is incompatible identifier use inside one namespace. Relationship vocabulary is how identities and roots relate. Do not collapse them.

If records look related and no explicit link exists, the result is `POSSIBLE_RELATIONSHIP` or `HOLD_UNCLASSIFIED`. Do not silently join them.

This namespace doctrine interprets identity evidence only. It grants no membership, canonical status, runtime, deployment, ownership, folder management, or Overseer execution. It creates no namespace registry and no master identity registry.

## 6. Relationship vocabulary

| Term | Definition |
| --- | --- |
| `CANONICAL` | Currently accepted authoritative home for a specific project identity, by explicit human confirmation. Not newest, largest, nearest, most complete, or same package |
| `MEMBER` | Explicitly recognized citizen of the relevant Sanctuary scope. Does not grant runtime, deploy, auto-open, or external ownership |
| `EXTERNAL` | Known project intentionally outside owning Sanctuary scope. EXTERNAL is not MISSING |
| `WORKTREE_OF` | Git metadata proves a filesystem root is a working tree of an existing repository identity |
| `BACKUP_OF` | Explicit evidence of a preservation relationship. Not inferred from date, suffix, or nesting |
| `MIRROR_OF` | Explicit evidence of an intentional mirror. Not canonical, member, or runtime by itself |
| `CONTINUATION_OF` | Explicitly authorized continuation. Generated continuation metadata without a governance decision on the current base does not establish this |
| `ARCHIVE_OF` | Intentional historical retention. Not a deletion license |
| `FORK_OF` | Intentional divergence that remains independently identifiable. Package similarity is not enough |
| `HOLD_UNCLASSIFIED` | A relationship may exist, but the evidence is insufficient or contradictory |

Deferred unless a later gate proves the need: `GENERATED_COPY_OF`, `NESTED_COPY_OF`.

Competing canonical claims go to HOLD, then Steward review. There is no automatic winner.

## 7. Canonical-path states

| State | Meaning |
| --- | --- |
| `PRESENT` | Declared canonical path exists, with no known relevant contradiction |
| `MISSING` | Declared canonical path is absent. Do not auto-promote another copy |
| `MULTI_CLAIM` | More than one root claims canonical authority. HOLD |
| `UNKNOWN` | No reliable canonical evidence |
| `HOLD` | Canonical resolution is intentionally deferred |

## 8. Evidence precedence

Higher outranks lower. Contradictions are reported. They are not silently overridden.

1. Explicit Steward or governance identity decision recorded on the current base.
2. Stable committed registry id or explicit identity record.
3. Git worktree metadata or repository identity with a proven relationship.
4. Declared canonical path plus disk existence.
5. Package or module manifest identity, as evidence only.
6. Filesystem topology.
7. Folder names, timestamps, and similarity. These are weakest.

Similarity may open a question. Similarity may not close it. Similarity is `POSSIBLE_RELATIONSHIP` only. It is never automatic `BACKUP_OF`, `CONTINUATION_OF`, `CANONICAL`, or same-project.

A package name is evidence only. Conflict goes to HOLD.

## 9. Evidence states

| State | Meaning |
| --- | --- |
| `EXACT_IDENTITY` | Deterministic same-identity evidence, such as Git worktree proof |
| `STRONG_RELATIONSHIP_EVIDENCE` | Strong support that may still lack governance authority |
| `POSSIBLE_RELATIONSHIP` | Similarity or indirect evidence that warrants observation |
| `AMBIGUOUS` | Significant conflict |
| `INSUFFICIENT_EVIDENCE` | Cannot safely classify |

No universal score.

## 10. Authority matrix

| Relationship | Membership | Canonical authority | Runtime | Deploy | Auto-classifiable? | Steward needed? |
| --- | --- | --- | --- | --- | --- | --- |
| `CANONICAL` | Reflects an existing human-confirmed claim only | Reflects an existing human-confirmed claim only | NO | NO | NO | If contested |
| `MEMBER` | YES if the current registry or governance says so | NO by itself | NO | NO | Only if the registry already states it | If granting |
| `EXTERNAL` | NO | NO | NO | NO | When known external evidence exists | If promoting |
| `WORKTREE_OF` | NO | NO | NO | NO | YES if Git-proven | Usually no |
| `BACKUP_OF` | NO | NO | NO | NO | Only with explicit strong evidence | If ambiguous |
| `MIRROR_OF` | NO | NO | NO | NO | Only with explicit strong evidence | If ambiguous |
| `CONTINUATION_OF` | NO | NO | NO | NO | Only with explicit authorization | If unconfirmed or ambiguous |
| `ARCHIVE_OF` | NO | NO | NO | NO | Only with explicit evidence | If ambiguous |
| `FORK_OF` | NO | NO | NO | NO | Rare, and only with strong evidence | Often yes |
| `HOLD_UNCLASSIFIED` | NO new grant | NO | NO | NO | YES when unsure | YES when ownership matters |

The classifier does not create canonical, membership, runtime, or deployment authority.

Readiness is not deploy. A green or ready signal is not deployment authority.

## 11. Automatic classification limits

Allowed only when evidence is deterministic, and only inside a future observer that has its own charter:

- `WORKTREE_OF` when Git-proven
- `CANONICAL_PATH_MISSING` when a declared path is absent
- `REGISTRY_DISK_DRIFT` when a direct compare mismatches
- `HOLD_UNCLASSIFIED`
- `POSSIBLE_RELATIONSHIP` for weak similarity, as observation only

Not automatic without explicit strong relationship evidence:

- `BACKUP_OF`
- `MIRROR_OF`
- `CONTINUATION_OF`
- `FORK_OF`
- `CANONICAL`

Ambiguity goes to HOLD. Do not guess latest, largest, nearest, first registry hit, or a name that contains "canonical".

## 12. HOLD doctrine

| Action | Allowed? |
| --- | --- |
| New membership grant | NO |
| Runtime | NONE |
| Deployment | NONE |
| Canonical promotion | NO |
| Cleanup, merge, move, or rename | NO |
| Steward review when ownership or canonical intent matters | YES |

```text
DETECT ≠ DELETE
CLASSIFY ≠ MOVE
IDENTIFY ≠ MERGE
COLLISION ≠ CLEANUP AUTHORITY
PID MAY REPORT CANONICAL EVIDENCE
PID MAY NOT CREATE CANONICAL AUTHORITY
```

## 13. Steward decision boundary

AMK-Goku is required when there are:

- multiple canonical claims
- backup versus continuation ambiguity
- the same stable identity claimed by independent roots
- external versus member ambiguity
- fork versus accidental duplicate ambiguity
- a destructive cleanup request
- a canonical or membership promotion request

The system may report. It may not decide those ownership questions.

## 14. Pre-create principle

This is design language only. It is not an execution gate.

```text
CHECK project ID → known paths → Git and worktrees → package identity
→ relationship evidence → similarity (weak)
→ collision? → HOLD · POTENTIAL_EXISTING_PROJECT
```

No new root is treated as independent until classification resolves.

## 15. Post-create observation principle

This is design language only.

```text
NEW ROOT OBSERVED → IDENTITY UNKNOWN → UNCLASSIFIED PROJECT DISCOVERED
→ NO MEMBERSHIP → NO RUNTIME
```

No automatic deletion.

## 16. Privacy and rebuildability

- Local only. No external AI for identity inference. No upload of trees, fingerprints, topology, Git metadata, or registries.
- Exclude secret values: `.env` contents, keys, tokens, passwords, private keys, and database credentials.
- Canon outranks derived memory. Observation reports must be rebuildable. Derived output is not governance.

## 17. Existing surfaces to reuse

| Surface | Responsibility |
| --- | --- |
| PC-root and Universe registries | Citizenship evidence |
| Git metadata | Repository and worktree evidence |
| Lifeboat | Classification seed |
| Doorway | Lane and open-path evidence |
| Cycle Observe | Future report consumer |
| Awareness | Future posture consumer |
| Overseer / EAII | Future synthesis: observe and report |
| AMK indicators | Optional later derived signal |
| Z-SDC | Historical supplementary design. Phase 1 stays closed. Not a current runtime |

No organ replacement. No second Overseer. No second Folder Manager.

## 18. Historical lessons carried as vocabulary

These lessons come from the preserved source. The named decision receipts are not on `origin/main` and are not recovered here. They are not current case law on this base.

| Lesson | Vocabulary constraint |
| --- | --- |
| Generated continuation labels | Not `CONTINUATION_OF` |
| Missing declared path | `CANONICAL_PATH_MISSING` does not promote another copy |
| Hub Git worktrees | `WORKTREE_OF`, not members |
| Package-name similarity | `POSSIBLE_RELATIONSHIP` only. Not a bind |
| Known on disk | KNOWN is not MEMBER |
| Outside the Organiser | EXTERNAL is not MISSING |

## 19. Future observer limits

If a later charter authorizes an observer, it may:

- read approved evidence: registries, Git worktree metadata, and path existence
- normalize classifications under this contract
- write only derived reports under `data/reports/`
- report ambiguity

It may not:

- edit registries, change membership, or move, delete, or rename folders
- promote canonical paths, start runtime, deploy, or open Z-SDC Phase 1

Initial machine-output vocabulary, if that charter exists:

`WORKTREE_OF`, `CANONICAL_PATH_MISSING`, `REGISTRY_DISK_DRIFT`, `HOLD_UNCLASSIFIED`, `POSSIBLE_RELATIONSHIP`.

No such report is current on this base.

## 20. Not opened by this derivative

Observer implementation, classifier expansion, similarity scoring, Overseer connection, indicator wiring, a pre-create gate, fingerprint runtime, a new registry, cleanup, deployment, and an `ID_COLLISION` detector stay closed.

## 21. Standing limits

| Limit | Answer |
| --- | --- |
| New master registry | NO |
| Second Overseer | NO |
| Second Folder Manager | NO |
| Auto-cleanup | NO |
| Auto-canonical selection | NO |
| External AI as authority | NO |
| Z-SDC Phase 1 | CLOSED |
| New universal score | NO |
| New execution authority | NO |

## 22. Doctrine

Identity before automation. Classification before remediation. Evidence before relationship. Relationship before ownership. HOLD before guessing.

A path is a location. A project id is an identity. A package name is evidence. Similarity asks a question. It does not answer ownership.

Worktrees are working surfaces. They are not the organism. Backups are preserved relationships. External organisms remain external unless governance on the current base says otherwise.

No generated label becomes doctrine by repetition. No report creates canonical authority. No classifier grants runtime or deployment.

AMK-Goku owns the sacred moves.
