# Z-Project Identity — Trusted Input Map

**Status:** CURRENT DERIVATIVE — NOT BYTE-IDENTICAL TO HISTORICAL SOURCE

**Date:** 2026-10-07

**Contract:** [Z_PROJECT_IDENTITY_RELATIONSHIP_CONTRACT.md](Z_PROJECT_IDENTITY_RELATIONSHIP_CONTRACT.md)

**Authority:** Observation vocabulary only. Not a registry. Not membership. Not canonical authority. Not runtime proof.

## Provenance

SOURCE PILOT COMMIT: `3b62323d1f2d3ef0f359b7e709974312ccfc66b5`

SOURCE ORIGINAL BLOB: `7d39b00202706a77d5a05b413f4746903367e879`

DERIVATION BASE: `origin/main` @ `1c597e2cb4ddc1a81b09695a2899d1c592a345a8`

STATUS: CURRENT DERIVATIVE — NOT BYTE-IDENTICAL TO HISTORICAL SOURCE

The historical contract seal `c685b76` and the historical health-review commit `a09028c` are provenance. They are not acceptance on `origin/main`. The health review, the August audit map, the Book B identity manifest, and the Z-SDC Phase 0 note are not on this base and are not linked.

## Purpose

Classify potential identity evidence before any derived report is written, so dirty or weak inputs cannot silently become governance.

```text
current relationship contract
        ↓
this trusted input map
        ↓
a future read-only report, only if separately chartered
```

This map does not claim that a PID-1B report exists or is current.

## Availability classes

Use these classes before the older trust classes. They say whether an input is on this base. They do not create proof.

| Availability | Meaning |
| --- | --- |
| `TRUSTED_CURRENT_INPUT` | Present on this derivation base and safe to read as structure or standing vocabulary |
| `HUMAN_CONFIRMED_INPUT` | An explicit Steward or governance decision recorded on this base |
| `HISTORICAL_INPUT` | Preserved on the pilot or source lineage. Not current doctrine on this base |
| `PARTIAL_UNAVAILABLE_INPUT` | Named by older material, but the artifact is not on this base |
| `UNKNOWN_INPUT` | Not classified. Treat as HOLD |

## Trust classes

These classes still say how a present input may be used. They do not make an unavailable input current.

| Class | Meaning | May drive auto classification? |
| --- | --- | --- |
| `TRUSTED_CANON` | Governance documentation or the identity contract on the current base | Yes, as vocabulary and limits. Not as a new canonical path |
| `TRUSTED_STRUCTURAL` | Deterministic local structure, such as a Git worktree list or a path that exists or is missing | Yes, for `WORKTREE_OF`, path missing, or drift, when that observation is actually made |
| `OBSERVATIONAL_ONLY` | Useful awareness. Never alone establishes backup, continuation, canonical, or member | No for heavy relations |
| `DIRTY_UNSEALED` | Generated or contested metadata without a governance decision on this base | Never as ownership authority. HOLD |
| `DERIVED` | Outputs of prior reports or fingerprints | Rebuildable. Not a source of truth |
| `EXCLUDED` | Secrets, provider APIs, arbitrary disk outside the Organiser, Z-SDC Phase 1 | Must not read or use |
| `UNKNOWN` | Not yet classified | HOLD |

## Input map

| Source | Availability | Class | May use for | Must not use for |
| --- | --- | --- | --- | --- |
| This relationship contract | `TRUSTED_CURRENT_INPUT` | `TRUSTED_CANON` | Vocabulary, HOLD law, auto limits | Canonical path selection |
| Constitution V1 | `HUMAN_CONFIRMED_INPUT` | `TRUSTED_CANON` | Human decision, readiness is not deploy, existing registries | A second identity language |
| `data/z_pc_root_projects.json` row id and empty or present path | `TRUSTED_CURRENT_INPUT` | `TRUSTED_STRUCTURAL` | Enumeration and drift | Treating `role` as sealed `CONTINUATION_OF` |
| PC-root `role`, `hosting`, or notes on contested trees | `TRUSTED_CURRENT_INPUT` as text | `DIRTY_UNSEALED` or `OBSERVATIONAL_ONLY` | Narrative context | `CONTINUATION_OF`, canonical, or membership change |
| `git worktree list` when a human runs it | `UNKNOWN_INPUT` until observed | `TRUSTED_STRUCTURAL` | `WORKTREE_OF` | Membership. This map is not that observation |
| Disk existence versus a declared path, when checked | `UNKNOWN_INPUT` until observed | `TRUSTED_STRUCTURAL` | `CANONICAL_PATH_MISSING`, `REGISTRY_DISK_DRIFT` | Auto-promote a copy |
| Universe, census, or status snapshots | `OBSERVATIONAL_ONLY` when present | `OBSERVATIONAL_ONLY` | Cross-check hints | Ownership |
| `package.json` `name` | `OBSERVATIONAL_ONLY` | `OBSERVATIONAL_ONLY` | `POSSIBLE_RELATIONSHIP` | Same-project, alias, or bind |
| Folder names and timestamps | `OBSERVATIONAL_ONLY` | `OBSERVATIONAL_ONLY` | Weak hints | Any ownership relation |
| AMK indicators | `OBSERVATIONAL_ONLY` | `OBSERVATIONAL_ONLY` | Known awareness and HOLD posture | A MEMBER grant |
| Lifeboat classify outputs | `DERIVED` when present | `DERIVED` | Later comparison | Overriding `TRUSTED_CANON` |
| Cycle Observe or Awareness reports | `DERIVED` | `DERIVED` | Not consumed as identity authority | Ownership |
| D2, EMK, and REP receipts | `HISTORICAL_INPUT` | Not current canon | Historical lessons only | Reopening or inventing a current decision |
| Super Turtle health review | `PARTIAL_UNAVAILABLE_INPUT` | Not on this base | Provenance only | A current health baseline |
| PID-1B `z_project_identity_observe_status` reports | `PARTIAL_UNAVAILABLE_INPUT` | `DERIVED` if they ever exist | Nothing on this base | Runtime proof or current doctrine |
| `.env`, secrets, and tokens | `EXCLUDED` | `EXCLUDED` | Nothing | Everything |
| External AI or cloud | `EXCLUDED` | `EXCLUDED` | Nothing | Everything |
| Z-SDC Phase 1 runtime | `EXCLUDED` | `EXCLUDED` | Nothing | Phase 1 stays closed |
| Arbitrary paths outside the Organiser | `EXCLUDED` | `EXCLUDED` | Nothing in this map | A disk walk |

## Conservative machine outputs

If a later charter authorizes an observer, the allowed labels are:

`WORKTREE_OF`, `CANONICAL_PATH_MISSING`, `REGISTRY_DISK_DRIFT`, `HOLD_UNCLASSIFIED`, `POSSIBLE_RELATIONSHIP`.

Forbidden as automatic labels:

`BACKUP_OF`, `MIRROR_OF`, `CONTINUATION_OF`, `FORK_OF`, `CANONICAL`.

Ambiguity becomes `HOLD_UNCLASSIFIED`.

No observer report is current on this base. Do not treat a missing report as a pass or a failure.

## Derived report marking

Any future observer output must declare:

```text
DERIVED · READ-ONLY · REBUILDABLE · LOCAL_ONLY
NOT A REGISTRY · NOT MEMBERSHIP AUTHORITY · NOT CANONICAL AUTHORITY
NOT RUNTIME PROOF
```

Provisional paths, not present on this base:

- `data/reports/z_project_identity_observe_status.json`
- `data/reports/z_project_identity_observe_status.md`

## Integration freeze

Do not wire this map into Overseer, Cycle Observe, indicators, Doorway, Mission Control, Lifeboat apply, or registry edits.

A future report would have to be shown true before any consumer is authorized. This derivative does not run that report.

## Historical expectations, not a current run

These stances are vocabulary from the source map. They are not a fresh observation.

| Case | Expected stance if later observed |
| --- | --- |
| Hub Git worktrees | `WORKTREE_OF`. Not members |
| Empty declared canonical path | `CANONICAL_PATH_MISSING`. No promotion |
| Contested continuation labels | `HOLD_UNCLASSIFIED` |
| Package name versus a different registry id | `POSSIBLE_RELATIONSHIP`. No bind |
| Known on disk | Known awareness. Not MEMBER |
| Outside the Organiser | EXTERNAL is not MISSING |

Canonical identity still requires explicit human confirmation.
