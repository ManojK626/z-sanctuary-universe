# Z-R2 / Lifeboat Custody Reconciliation 0

**Status:** architecture-only · no Cloudflare mutation  
**Classification (this gate):** `OPTION B — R2 AS OPTIONAL CUSTODY DESTINATION`  
**Z-PoT Phase 0.5:** CLOSED  
**Buckets / uploads / credentials:** NONE

This document **observes and maps**. It does not create R2 resources, keys, Workers, lifecycle rules, or Bucket Locks.

---

## A. Canonical Root / Base

| Item | Evidence |
| --- | --- |
| Repository | `https://github.com/ManojK626/z-sanctuary-universe.git` |
| Worktree | `C:\Cursor Projects Organiser\Z_Sanctuary_Universe_wt_r2_custody_0` |
| Branch | `cursor/zsanctuary/z-r2-lifeboat-custody-reconciliation-0` |
| Canonical `origin/main` | `13bd62bc3a7c046d045cf06a73d014c301cf70d7` |
| Constitution V1 | `docs/governance/Z_SANCTUARY_UNIVERSE_CONSTITUTION_V1.md` |
| Z-PoT Spec 1 | `docs/Z_POT_PATTERNS_OF_TRUTH_CONSTITUTION_SPEC_1.md` |
| Z-LIC Reconciliation 1 | `docs/Z_LIC_LIVING_INTELLIGENCE_COMMONS_ARCHITECTURE_RECONCILIATION_1.md` |
| Z-LIC Constitution Spec 1 | `docs/Z_LIC_LIVING_INTELLIGENCE_COMMONS_CONSTITUTION_SPEC_1.md` |

Dirty mixed workspace was not mutated. Untracked files and other-branch trees were not treated as canonical architecture.

A sibling worktree named `r2-backup-readiness-0` exists at an older SHA. It is **not** an R2-custody architecture source. Treat it as unrelated checkout history (`UNKNOWN` as R2 product).

### Analysis constraints (frozen for this gate)

> Cloud custody is evidence redundancy, not evidence authority.

Also:

> Storage durability does not establish provenance.

Also:

> No external cloud platform shall become a single point of existence, authority, or recovery.

Also:

> GitHub may host custody. GitHub does not define identity.

R2 must not become the identity of a project, repository, receipt, dataset, or artifact.

Default:

**R2 joins Lifeboat. Lifeboat does not become R2.**

---

## B. Existing Lifeboat Capability

**Canonical status of “Lifeboat” as a product:** `UNKNOWN` / name-only on this `main`.

The only tracked uses of the word Lifeboat are in Z-LIC Constitution Spec 1 §27 and its green receipt: a later Steward gate may reconcile R2 against Lifeboat. No `*lifeboat*` doctrine file, script, or registry row exists on this base.

**What already performs recovery-organism work (reuse this stack; do not replace it):**

| Organ | Path | Maturity |
| --- | --- | --- |
| Preservation Principle | Constitution V1 Art. II | EXISTS_CANONICAL · law |
| GitHub vault + PR/CI | `docs/Z-GITHUB-SANCTUARY-GATE.md` | EXISTS_CANONICAL · doctrine + operational checklist |
| Folder Manager local vault | `scripts/z_folder_manager_guard.mjs`, `data/z_folder_manager_policy.json` | EXISTS_PARTIAL · local runtime |
| NAS architecture | `docs/Z-SANCTUARY-NAS-ARCHITECTURE-BLUEPRINT.md` | DOCTRINE_ONLY · NAS_WAIT |
| MCBURB backup doctrine | `docs/security/Z_MCBURB_BACKUP_RECONVERGE_BOOSTER.md`, `data/z_mcburb_backup_policy.json` | EXISTS_CANONICAL as Phase-1 metadata · no apply script |
| Restore-drill template | `data/reports/z_restore_test.md` | EXISTS_PARTIAL · blank template |
| Turtle restore-before-green | `.cursor/rules/z-turtle-mode-cursor-agents.mdc` | EXISTS_CANONICAL as rule |

**Answers required by this gate:**

| Question | Finding |
| --- | --- |
| What does Lifeboat protect? | Not defined as a product. The existing organism protects Git history, registries/docs spines, local vault snapshots, and (future) NAS copies. |
| Recovery levels already exist? | Partial: local Git, GitHub remote, local Folder Manager snapshots, NAS blueprint, MCBURB reconverge suggestions. No numbered Lifeboat classes. |
| Local / remote / offline distinguished? | Yes in doctrine (GitHub gate: Cursor builder; GitHub vault; Local/NAS sovereign). Not as a sealed Lifeboat matrix. |
| B2 / R2 lanes defined? | R2 is FUTURE_DECLARED and forbidden until Steward gate. Backblaze B2 object storage: **absent**. |
| Recovery drills defined? | Turtle requires restore drill for green flips; `z_restore_test.md` is an empty template; monthly drill is suggested elsewhere, not a system. |
| Secret/key custody defined? | Vault policy + security policy exist. Recovery-key-beside-archive rule is **not** a named Lifeboat law. |
| Evidence receipts defined? | Phase GREEN receipts and Constitution V1 custody receipt exist. No general object-custody receipt product. |
| Object storage contemplated? | Yes: Constitution Art. II “cloud archive”; LIC §27; Cloudflare pack lists R2 as a possible product, deferred. |
| Runtime authority? | Folder Manager local snapshots. MCBURB forbids auto_restore. NAS scripts in `martial-platform/` are lab/placeholder, not hub custody doctrine. |

**Recommendation:** treat **Lifeboat** as the future *name of the recovery organism* that already includes GitHub vault, Constitution Preservation, Folder Manager, NAS blueprint, and MCBURB. Do not manufacture a second backup project because R2 exists.

---

## C. Secure Clone Capability

**Canonical status:** `UNKNOWN` as a product. Phrase appears only in Z-LIC §27.

Nearby “clone” language (Replica Fabric, OMNAI routing clone, NAS “active project clones”) is **unrelated**. Do not reuse those as Secure Clone.

Secure Clone, if later declared, should mean: an **independent encrypted or cold copy** with integrity hash and a restore path that does not require the development PC or Cloudflare.

Overlap with future R2: a Secure Clone may be *stored* on R2 as Class C3, but R2 is not itself the clone. Avoid `Secure Clone 2` and any competing backup engine.

---

## D. Git / GitHub Role

| Layer | Role | R2 must not replace |
| --- | --- | --- |
| Local Git | Working history, local recovery, Turtle branches | Branch / commit / merge model |
| GitHub | Remote history, PR governance, CI, merge evidence, backup history | Identity, truth authority, sole recovery |
| Potential R2 | Object/archive custody of *packages* | Source control, review, CI |

GitHub Sanctuary Gate freeze: Cursor builds; GitHub verifies; human approves; Local/NAS remain sovereign storage.

Future suitability: verified `git bundle` artifacts, release snapshots, and repository recovery manifests **may** later sit in object storage as Class C3. **No bundles are created in this gate.**

Git bundle doctrine is **MISSING** on this `main`.

Also preserve: GitHub may host custody; GitHub does not define identity.

---

## E. Offline Custody

Canonical fragments:

- Constitution Art. II: verified backup may be remote git push, cloud archive, or NAS copy with receipt.
- NAS blueprint: RAID/snapshots, Folder Manager → `Z_Backups` / `Z_Archives`, optional rclone read-only offsite, restore via NAS UI or manifests. Status: blueprint; NAS often `NAS_WAIT`.
- Zero-trust NAS notes: daily cold backup when NAS is active.
- Crystal DNA: NAS cold mirror as future; auto-heal forbidden.

Named dual-custody / Class-A custody / recovery-key systems: **MISSING**.

Candidate freeze:

> Cloud availability must never be required to recover the Sanctuary's canonical knowledge.

R2 must not eliminate offline recovery. Keys must not be stored beside encrypted archives (`FUTURE_SECURITY_GATE` for exact scheme).

---

## F. R2 External Capability

Status: `EXTERNAL_CAPABILITY · REVERIFY_BEFORE_IMPLEMENTATION`

Fetched 2026-09-03 from Cloudflare Docs. Provider pages may change.

| Topic | Recorded capability | Source / page date |
| --- | --- | --- |
| Object storage, S3-compatible API | Yes | [R2 docs](https://developers.cloudflare.com/r2/) |
| Standard storage | $0.015 / GB-month; no retrieval fee; no min duration | [Pricing](https://developers.cloudflare.com/r2/pricing/) · updated 2026-08-07 |
| Infrequent Access | $0.01 / GB-month; $0.01 / GB retrieval; 30-day minimum | same |
| Class A / B ops (Standard) | $4.50 / $0.36 per million | same |
| Class A / B ops (IA) | $9.00 / $0.90 per million | same |
| Direct Internet egress | Free (footnote: other metered services may still charge) | same |
| Standard free tier | 10 GB-month; 1M Class A; 10M Class B | same; **does not apply to IA** |
| Billing rounding | Usage rounded up to next billing unit | same |
| Durability claim | 11 nines (provider claim) | [Storage classes](https://developers.cloudflare.com/r2/buckets/storage-classes/) |
| Bucket Locks | Native R2 retention; prefix/age/date/indefinite; up to 1000 rules; lock overrides lifecycle | [Bucket locks](https://developers.cloudflare.com/r2/buckets/bucket-locks/) · updated 2026-04-30 |
| S3 Object Lock APIs | Unsupported on R2 S3 compatibility surface | [S3 API compatibility](https://developers.cloudflare.com/r2/api/s3/api/) |

Design around **R2 Bucket Locks**, not AWS S3 Object Lock.

No feature was configured.

---

## G. Custody Classes

Domain-neutral classes. **Not** committed bucket names.

| Class | Examples | Primary mechanism | Candidate R2 role |
| --- | --- | --- | --- |
| C0 Source control | repos, commits, branches | Git / governed forge | recovery *package* only |
| C1 Governance / evidence | constitutions, GREEN receipts, audit packs | Git + receipts | high-integrity archive + hash + provenance + possible lock |
| C2 Release artifacts | signed builds, APKs, distributables | release process | versioned object custody |
| C3 Recovery packages | encrypted git bundles, project snapshots, manifests | Lifeboat / Secure Clone (future) | disaster-recovery copy |
| C4 Approved datasets | governed research/export corpora | project governance | large-object storage |
| C5 Temporary transfer | staging, migration dirt | short lifecycle | must not become permanent |
| C6 Forbidden cloud | see section H | never | never |

---

## H. Forbidden Cloud Material

Class C6 is **not exhaustive**. At minimum, never place in R2 (or any public-cloud object store) without a later explicit Steward exception:

- plaintext recovery keys, root secrets, API tokens, passwords, `.env` contents;
- unreviewed private user data; vault/personal material; medical/family/religious payloads;
- secrets embedded in archives of dirty trees;
- unrelated mixed-workspace snapshots;
- material whose license forbids cloud storage;
- material lacking provenance, owner, or Steward authorization;
- anything whose responsible owner has not authorized cloud custody.

Cloud eligibility must be an **explicit classification outcome**, not a default.

---

## I. Artifact Manifest

Design only. **No schema file.**

Candidate fields: `artifact_id`, `project_id`, `repository_id`, `artifact_class`, `artifact_type`, `source_root`, `source_commit`, `source_branch`, `created_at`, `created_by`, `sha256`, `size_bytes`, `encryption_state`, `encryption_scheme_reference`, `custody_destination`, `retention_class`, `lock_class`, `sensitivity`, `license_class`, `provenance`, `verification_state`, `last_restore_test`, `supersedes`, `superseded_by`, `steward`.

Existing overlaps (reuse, do not duplicate identity):

- Git: `source_commit`, `source_branch`, repository URL;
- phase GREEN receipts: gate, SHA, date, file surface;
- Constitution V1 custody receipt: blob SHA / SHA-256 provenance;
- MCBURB: `backup_provenance_recorded_when_human_creates_official_backup_artifacts`;
- FBAP: `privacy_class` on event taxonomy;
- registries: `project_id` / module IDs where already canonical.

Genuinely missing: a reusable **object-custody** record spanning hash, encryption state, destination, lock/retention, restore test, and Steward.

---

## J. Integrity / Hash Model

Conceptual chain:

```text
SOURCE
↓
PACKAGE
↓
HASH (source/package)
↓
ENCRYPT IF REQUIRED
↓
HASH (ciphertext)
↓
UPLOAD
↓
REMOTE METADATA (provider checksum ≠ provenance)
↓
DOWNLOAD SAMPLE / RECOVERY DRILL
↓
VERIFY CIPHERTEXT HASH
↓
DECRYPT IF REQUIRED
↓
VERIFY SOURCE/PACKAGE HASH
↓
RESTORE
↓
VERIFY CONTENT
```

Three hashes must stay distinct:

1. **Source/package hash** — canonical provenance.
2. **Ciphertext hash** — proves the stored blob is the intended encrypted object.
3. **Restored-content hash** — proves recovery reconstructed the source.

Provider checksums are operational health, not Sanctuary provenance.

---

## K. Encryption Boundary

| Posture | Candidate classes |
| --- | --- |
| May be unencrypted if already public/non-sensitive and authorized | some C1 public-doctrine snapshots; some C2 public releases |
| Encrypt locally before upload | C3 recovery packages; any C4 with privacy/license risk; C1 containing restricted receipts |
| Forbidden from cloud | C6 |

Candidate rule:

> Encrypt locally before cloud custody.

Keys use **separate** custody. Do not store keys beside archives.

Cryptographic scheme: `FUTURE_SECURITY_GATE`. This gate does not choose algorithms or create keys.

---

## L. Bucket Lock Analysis

Useful later for C1 evidence and selected C2 release records.

Risks: overly long retention; inability to delete sensitive data; privacy/retention conflict; cost accumulation; erroneous upload becoming locked; compromised Steward applying indefinite locks; emptying a bucket blocked while any lock remains (provider note).

Locks override lifecycle. That is desirable for evidence classes.

**No durations frozen.** Lock policy needs its **own Steward gate**. No locks configured here.

---

## M. Lifecycle Analysis

Candidate uses: expire C5 temporary transfer; age C2 toward Infrequent Access; never auto-delete C1 constitutional/evidence classes without explicit governance authority.

Conflict: a lifecycle delete cannot beat an active lock. Preserve: **retention protection overrides convenience cleanup.**

No lifecycle configured.

---

## N. Storage-Class Analysis

| Class | Likely use | Caution |
| --- | --- | --- |
| Standard | active C1/C2/C3 needing immediate restore | default; free tier applies |
| Infrequent Access | older C1/C2 after Steward aging | no free tier; retrieval fee; 30-day minimum even if deleted early |

Do not optimize for pennies at the expense of recovery reliability. Recovery drills on IA objects incur retrieval cost — budget that.

---

## O. Access / Credential Model

Conceptual roles (no credentials created):

| Role | Intended verbs |
| --- | --- |
| Custody writer | PACKAGE + UPLOAD when chartered |
| Custody reader | OBSERVE + limited GET |
| Restore verifier | VERIFY + RESTORE into disposable location |
| Retention-policy administrator | LOCK / lifecycle (separate from writer) |
| Emergency Steward | human AUTHORIZE including DELETE |

One credential must **not** hold writer + locker + deleter + emergency Steward. Prefer separation of duties.

No API tokens. No Cloudflare account identifiers in this document.

---

## P. Failure Scenarios

For each scenario, recovery **must not assume R2 is functioning**.

| Scenario | Path that does not need R2 |
| --- | --- |
| Cloudflare outage | Local Git + GitHub + offline/NAS copies |
| Account lockout | Independent GitHub + offline; Steward recovers CF later |
| Lost API credentials | Revoke; recover from Git/offline; new least-privilege token later |
| Compromised API token | Revoke immediately; treat R2 as untrusted until hash audit; Git/offline remain source |
| Accidental bucket/object deletion | GitHub + offline; R2 is redundant |
| Ransomware on local PC | GitHub + offline (+ later R2 if still honest) |
| Malicious upload | Manifest + hash reject; do not restore from unproven object |
| Corrupted / stale archive | Compare hashes; prefer Git HEAD + receipts |
| Successful upload, failed restore | Architecture fails until drill GREEN; keep Git/offline |
| Locked incorrect object | Keep Git/offline; lock-policy Steward gate to unwind later |
| Lifecycle deletes important object | C1 must not use convenience expiry; Git/offline remain |
| Excessive retention / cost | Steward review; do not panic-delete C1 |
| Provider policy/pricing/account closure | GitHub + offline; R2 optional |
| Loss of Internet | Local Git + offline A/B |
| Jurisdiction mismatch | Do not upload until classified; keep local/offline |
| Hidden secrets in archive | C6 / privacy scan before any future upload |
| Provenance / hash mismatch | Reject object; Git remains authority |
| Git valid, R2 stale | Expected; R2 is not HEAD |
| R2 valid, GitHub unavailable | Local Git + offline; R2 optional assist |
| Both GitHub and Cloudflare unavailable | **Must** still recover from local + offline |

---

## Q. Platform-Independent Recovery

Question 1: If GitHub and Cloudflare were both unavailable today, can authorized humans recover canonical projects from local/offline custody?

**Partial today.** Local Git on the development PC can recover *this clone*. Offline/NAS dual copies and recovery drills are **not sealed as a working Lifeboat**. NAS is often wait-state. Therefore independence is **doctrine-complete, operationally incomplete**.

That is a genuine gap. It does **not** justify making R2 required. It justifies finishing **offline / Secure Clone** before depending on any cloud.

Question 2: If the development PC is destroyed, can recovery occur from independent custody?

**Partial.** GitHub currently holds canonical `main` history for this hub. That is necessary but not sufficient (identity ≠ GitHub; large artifacts and dirty local work are not on GitHub). Offline second copy is incomplete. R2, if added later, would help this scenario only as **optional** redundancy.

No destructive test was run.

---

## R. Custody Matrix

Legend: R = required · O = optional · F = forbidden · E = encrypt-before-upload · N = no cloud encryption required if already public and authorized.

| Class | Local Git | Secure Clone (future) | GitHub | R2 | Offline A | Offline B | Encryption | Retention | Recovery owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C0 | R | O | R | O package | R | O | N in Git; E if bundled to cloud | Git history | Steward / repo owner |
| C1 | R | O | R | O | R | O | E if restricted | lock later, Steward-gated | Steward |
| C2 | O | O | O tags | O | O | O | case-by-case | versioned | release Steward |
| C3 | O | R (future) | O | O | R | R | E | long | Steward |
| C4 | O | O | F if oversized/private | O if classified | O | O | E unless public license | project policy | project Steward |
| C5 | F as permanence | F | F | O short | F | F | E if sensitive | expire | operator |
| C6 | local vault only | F cloud | F | F | F unless air-gap policy | F | never cloud | n/a | Steward |

No real storage created.

---

## S. Cost Model

`EXTERNAL_CAPABILITY · REVERIFY_BEFORE_IMPLEMENTATION`

Source: [Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/) fetched 2026-09-03 (page updated 2026-08-07). Conceptual only. No billing commitment.

Assumptions: Standard storage; ignore rounding-up; ignore ops unless noted; free-tier 10 GB-month Standard only.

| Example scale | Approx Standard storage / month after free tier |
| --- | --- |
| 10 GB | $0 storage (inside Standard free tier) |
| 100 GB | ~$1.35 (90 × $0.015) |
| 1 TB (1000 GB) | ~$14.85 |
| 5 TB (5000 GB) | ~$74.85 |

IA at 1 TB stored a full month with no free tier ≈ $10 storage **plus** retrieval ($0.01/GB) and higher ops, and 30-day minimum. A restore drill that reads 1 TB of IA would add about $10 retrieval — do not put the only recovery copy on IA.

Direct R2 Internet egress: $0 per provider footnote. Connecting other metered CDNs/services may still cost.

Do not design around the 10 GB free tier. Recovery reliability outranks pennies.

---

## T. Privacy / Data Classification

Existing fragments to **reuse**:

- Vault policy / security policy (restricted assets, no exfiltration);
- FBAP `privacy_class` on events;
- `scripts/z_privacy_scan.mjs` classes SAFE / POSSIBLE_PERSONAL / HIGH_RISK for local uploads;
- MCBURB human gates for vault-tier deletion and restore;
- LIC C6-adjacent forbids in this document.

**Gap:** no canonical **cloud-eligibility** classification that says “this artifact may enter R2.” Do not invent sweeping upload permission. Future uploads require an explicit class outcome plus Steward.

---

## U. Recovery Drill Design

Future non-destructive sequence (not executed):

1. Select a sealed test artifact (never C6).
2. Verify local source hash.
3. Package / encrypt if required.
4. Record manifest fields.
5. Upload (future gate).
6. Retrieve independently (different credential/role).
7. Verify ciphertext hash.
8. Decrypt where applicable.
9. Verify source hash.
10. Restore into a disposable location.
11. Run integrity verification.
12. Issue a recovery receipt.

Until this drill is GREEN, R2 remains optional theatre, not recovery.

---

## V. Authority Model

| Verb | Who |
| --- | --- |
| OBSERVE | reports / humans / later Z-LIC observations |
| PACKAGE | chartered operator |
| UPLOAD | explicit storage-write authority |
| LOCK | separate retention authority |
| DELETE | explicit destructive authority |
| RESTORE | recovery authority into disposable/chartered path |
| VERIFY | restore verifier |
| AUTHORIZE | human Steward only |

No AI automatically receives destructive or cloud-write authority.

> Performance does not grant sovereignty.

Also:

> Readiness does not equal deployment.

Z-LIC may later coordinate custody *observations* or `DEVELOPMENT_PROPOSAL`s. Z-LIC does **not** own R2. R2 does **not** become the Commons.

---

## W. Duplication Risks

Do **not** create:

- a Cloudflare backup project separate from Lifeboat;
- Secure Clone 2;
- a second evidence-authority ledger because objects have hashes;
- bucket-name identity that competes with Git/project IDs;
- Workers bindings as a hidden control plane.

Reuse: GitHub vault, Constitution Preservation, Folder Manager, NAS blueprint, MCBURB, phase receipts, privacy scan.

---

## X. Genuine Gaps

1. Lifeboat is a name, not a sealed organism document.
2. Secure Clone is a name, not a clone engine.
3. Git bundle / repository recovery-kit doctrine is missing.
4. Dual offline copies and recovery-key separation are incomplete in operations.
5. Object-custody manifest is missing.
6. Cloud-eligibility data class is missing.
7. Encryption scheme is `FUTURE_SECURITY_GATE`.
8. Recovery drills are templates, not proven.
9. NAS remains wait/blueprint for many operators.
10. Bucket-lock durations and lifecycle policy need a later Steward gate.

These gaps argue for **offline/Lifeboat completeness first**, then optional R2 — not R2-first.

---

## Y. R2 Architectural Classification

### OPTION B — `R2 AS OPTIONAL CUSTODY DESTINATION`

R2 can add useful object redundancy (bundles, receipts, releases, large datasets) **under** the existing recovery organism.

Existing Git + GitHub + (future) offline copies must remain independently recoverable.

Option A (R2 not required) is too strong: large artifacts and disaster copies are a real object-storage fit.  
Option C (R2 required) is rejected: it would make Cloudflare a single point of recovery, violating this gate’s freeze.

---

## Z. Recommended Next Gate

**Z-LIFEBOAT-ORGANISM-SPEC-1** (architecture-only): name the existing GitHub + Preservation + Folder Manager + NAS + MCBURB stack as Lifeboat, declare Secure Clone as the independent-copy role, and define git-bundle + offline dual-copy + recovery-drill requirements — still **no** buckets.

Only after that, a **Z-R2-CUSTODY-PREFLIGHT-1** may propose non-identity prefix plans, lock/lifecycle *policy*, and encryption-gate entry — still no upload.

Do **not** open Z-PoT Phase 0.5 from this document.
