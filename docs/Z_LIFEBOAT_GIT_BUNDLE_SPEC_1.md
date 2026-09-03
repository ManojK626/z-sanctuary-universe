# Z-Lifeboat Git Bundle Spec 1

**Short ID:** `Z-Lifeboat Git Bundle`  
**Status:** specification only · **no** `.bundle` created  
**Pilot gate:** `Z-LIFEBOAT-GIT-BUNDLE-PILOT-1` · **CLOSED**  
**R2 implementation:** CLOSED  
**Dual offline custody:** CLOSED

Evidence base:

- [Z-Lifeboat Recovery Organism Spec 1](Z_LIFEBOAT_RECOVERY_ORGANISM_SPEC_1.md)
- [Z-R2 / Lifeboat Custody Reconciliation 0](Z_R2_LIFEBOAT_CUSTODY_RECONCILIATION_0.md)
- [Constitution V1](governance/Z_SANCTUARY_UNIVERSE_CONSTITUTION_V1.md)

This document defines what a trustworthy portable Git recovery package **must prove**. It does not create one.

---

## 1. Purpose

Z-Lifeboat Git Bundle is a future Git-native recovery artifact capable of reconstructing a verified repository without requiring GitHub or another forge.

It is: a recovery package; a portable Git history artifact; a source-control recovery mechanism; a future input to offline and optional R2 custody.

It is **not**: a replacement for canonical Git; a second repository identity; proof of recovery merely because a file exists; a substitute for offline custody; a substitute for restore testing; full workstation recovery.

---

## 2. Trust rule

> A Git bundle is not trusted because it was created. It becomes trusted only after an independent restore verifies the expected repository identity and history.

Also:

> Backup is not proven until restore is proven.

Also:

> Bundle hash proves bundle-file identity, not recovery success.

Also:

> Filename ≠ provenance.

Also:

> Portable does not mean independently custodied.

A bundle sitting on the same drive as its source repository is not independent recovery.

---

## 3. Bundle scope classes

| Class | Intent | Rule |
| --- | --- | --- |
| `FULL_REPOSITORY_BUNDLE` | Portable recovery of all required canonical refs and reachable history | Preferred first recovery class |
| `BRANCH_SCOPED_BUNDLE` | Deliberately limited branch/reference set | Must never be described as full-repository recovery |
| `INCREMENTAL_BUNDLE` | Future chain of deltas | Not introduced until base dependency, restore order, and chain integrity are proven |

Default first implementation target: **`FULL_REPOSITORY_BUNDLE`**.

Future Git-native creation (not executed here) would typically use `git bundle create <path> --all` for full coverage, or an explicit ref list for scoped bundles. Incremental bundles remain deferred.

---

## 4. Source-state requirements

A future bundle operation must record:

- repository physical root;
- Git root (common dir when using linked worktrees);
- repository stable identity;
- remote identity where applicable;
- source branch;
- source HEAD;
- canonical `origin/main`;
- Git status / porcelain;
- refs included;
- tags included;
- source timestamp (UTC);
- bundle scope class.

> Git bundle protects committed Git objects and refs; it does not automatically protect uncommitted working-tree state.

---

## 5. Dirty-tree doctrine

If the source repository contains modified tracked files, staged changes, untracked files, or ignored but important local artifacts, the bundle receipt must state `UNCOMMITTED STATE NOT CAPTURED` unless a separately governed custody mechanism covers that material.

Do not auto-commit dirty work merely to make a recovery bundle. Do not stash automatically. Do not clean automatically.

The historically dirty mixed workspace `C:\Cursor Projects Organiser\Z_Sanctuary_Universe` is **not** an authorized bundle source. A future hub pilot must package from a known, declared Git state (typically a dedicated checkout of canonical `origin/main`), not from unrelated dirty work.

---

## 6. Ref and history coverage

Future implementation must prove intended history using Git-native checks. Expected operations (not run in this gate):

| Check | Purpose |
| --- | --- |
| `git bundle verify <file>` | Bundle structure and prerequisite completeness |
| listed heads/prerequisites | What the bundle claims to contain |
| `git clone <bundle> <disposable-path>` or equivalent fetch | Independent restore |
| expected canonical commit present | Hub `origin/main` (or declared source commit) exists in restored repo |
| expected branch/tag presence | Declared refs exist |
| ancestry / `git fsck` | Object integrity |

A `FULL_REPOSITORY_BUNDLE` of this hub should include refs required to reconstruct canonical `main` and other declared heads/tags. Exact ref inventory is recorded at packaging time, not frozen here.

---

## 7. Naming model

Candidate filename shape (convenience only):

`<repository-stable-id>__<bundle-class>__<canonical-head-shortsha>__<UTC-timestamp>.bundle`

Illustrative example (not evidence of a created artifact):

`ZSU-HUB__FULL__30e67032__20260903T000000Z.bundle`

The example timestamp is **not** a real packaging event. Canonical identity comes from the manifest and hashes, not the filename.

---

## 8. Artifact identity

Reuse [Z-Recovery Manifest](Z_LIFEBOAT_RECOVERY_ORGANISM_SPEC_1.md) doctrine. **No schema file.**

Candidate fields: `artifact_id`, `repository_id`, `bundle_class`, `source_commit`, `canonical_main_commit`, `created_at`, `created_by`, `refs_covered`, `bundle_sha256`, `size_bytes`, `verification_state`, `restore_test_state`, `supersedes`, `steward`.

`artifact_id` is separate from the filename.

---

## 9. Hash model

After a future bundle file exists, compute a cryptographic digest of the **bundle file**.

Candidate baseline: **SHA-256**. Broader cryptographic policy remains `FUTURE_SECURITY_GATE`.

Distinguish three identities:

1. source repository identity (Git commit / refs);
2. bundle-file SHA-256;
3. restored-repository verification.

---

## 10. Bundle verification states

- `BUNDLE_UNCREATED`
- `BUNDLE_CREATED`
- `BUNDLE_HASHED`
- `BUNDLE_GIT_VERIFIED`
- `RESTORE_PENDING`
- `RESTORE_TESTED`
- `RECOVERY_PACKAGE_PROVEN`
- `STALE`
- `FAILED`
- `UNKNOWN`

Do **not** promote organism-wide `RECOVERY_PROVEN` merely because one repository bundle passed. Prefer `RECOVERY_PACKAGE_PROVEN` for a successfully tested bundle artifact.

This spec remains `BUNDLE_UNCREATED`.

---

## 11. Restore-test requirement

`RECOVERY_PACKAGE_PROVEN` requires restore into a **fresh disposable location**, never the source working tree.

Future test must verify:

1. bundle file exists;
2. expected hash matches;
3. Git verifies bundle structure;
4. repository can be cloned/restored from the bundle;
5. expected canonical commit exists;
6. expected branch/ref exists;
7. expected ancestry is intact;
8. repository integrity checks pass;
9. source and restored repository identity agree;
10. a recovery receipt is produced.

No restore test in this gate.

---

## 12. Disposable restore location

Never restore over: canonical project root; active working tree; dirty reconciliation workspace; another trusted clone.

Candidate future naming: `C:\Cursor Projects Organiser\Z_Recovery_Drills\<artifact-id>\`

Do **not** create this path now. Exact location may be resolved later.

---

## 13. Source / restored comparison

Future comparison should include expected HEAD, canonical main commit, required refs, Git object integrity, remote identity as metadata, repository stable ID, and expected critical tracked files where appropriate.

Do not require byte-comparison of generated or non-versioned files that Git bundle does not contain.

Distinguish **Git repository recovery** from **full workstation / project-environment recovery**.

---

## 14. Limitations

Git bundles may **not** capture:

- uncommitted files;
- ignored local files;
- environment secrets;
- installed dependencies (`node_modules`, venvs);
- databases outside Git;
- local caches;
- external datasets;
- generated releases not committed;
- large external assets;
- Git LFS objects unless separately addressed;
- submodule content unless independently recoverable;
- linked external project roots;
- worktree working directories as distinct checkouts (objects live in the shared Git common dir).

These require other Lifeboat custody mechanisms.

---

## 15. LFS / submodule / clone preflight

A future implementation preflight must detect Git LFS, submodules, alternates, worktrees, external object stores, shallow clones, and partial clones.

If any materially affect completeness, the implementation must **stop** or classify coverage honestly. No workaround is authorized by this spec.

Observation of **this isolated worktree** at packaging-spec time (not a bundle):

| Check | Result on this worktree |
| --- | --- |
| Git version | 2.54.0.windows.1 |
| HEAD / `origin/main` | `30e670326018de64737deb268e06b8d61215433b` |
| Porcelain | CLEAN |
| Shallow | false |
| `.gitmodules` | absent |
| `.gitattributes` LFS | absent |
| Linked worktree | yes (shares object store with hub `.git`) |

This observation is **not** `RECOVERY_PACKAGE_PROVEN`. Other clones/worktrees of the same repo may differ (shallow, LFS later, dirty trees).

---

## 16. Encryption boundary

The Git bundle may later require encryption before offline transport, R2 custody, or other external storage.

Encryption is **separate** from bundle generation:

```text
Git repository
↓
Git bundle
↓
Bundle verification
↓
Bundle SHA-256
↓
Encrypt if custody policy requires
↓
Ciphertext SHA-256
↓
Independent custody
```

Crypto remains `FUTURE_SECURITY_GATE`. No encryption implementation here.

---

## 17. Offline and R2 relationship

A verified bundle is intended to become the portable object used later by Offline Copy A, Offline Copy B, Secure Clone, and optional R2.

This specification **does not authorize** any of them.

R2 remains **CLOSED**. Future R2 may store an approved verified (and encrypted, if required) bundle. R2 must not receive an unverified package merely because upload is possible.

Preferred future order: create → verify → restore-test → approve custody → encrypt if required → upload.

---

## 18. Z-Git Bundle Recovery Receipt

**FUTURE_DECLARED.** No schema/runtime.

Candidate content: repository identity; source commit; bundle scope; refs covered; bundle filename; artifact ID; bundle SHA-256; Git verification result; restore location; restored HEAD; required-ref checks; discrepancy list; result; Steward disposition.

---

## 19. Failure conditions

A future implementation must fail closed for: wrong repository root; unknown repository identity; dirty-state misrepresentation; failed bundle creation; failed `git bundle verify`; missing expected refs; missing canonical commit; hash mismatch; failed restore; restored history mismatch; shallow/partial clone completeness uncertainty; Git LFS/submodule incompleteness; insufficient disk space; destination collision.

A failed operation must produce evidence. It must not auto-delete the failed artifact unless separately authorized.

---

## 20. Freshness model

A successful bundle reflects a **specific** repository state. It becomes stale as the canonical repository advances.

Compare `bundle.source_commit` to current canonical commit. Do not call an old bundle invalid merely because it is old. Classify: current; behind; stale; historical; unknown.

---

## 21. Multi-repository future

Do not design the first implementation as a bulk whole-PC bundler.

Initial implementation: **ONE VERIFIED REPOSITORY**. The Z-Sanctuary hub is the likely first candidate. Implementation authorization comes later (`Z-LIFEBOAT-GIT-BUNDLE-PILOT-1`).

After one repository is proven recoverable, later gates may generalize.

---

## 22. Authority model

| Verb | Meaning |
| --- | --- |
| INSPECT | Read repository state |
| PACKAGE | Create bundle |
| HASH | Calculate integrity digest |
| VERIFY | Run Git-native verification |
| RESTORE_TEST | Restore into disposable path |
| COPY | Place artifact into independent custody |
| DELETE | Destroy artifact |
| AUTHORIZE | Approve custody/readiness state |

No AI receives DELETE, LOCK, cloud-write, secret access, or AUTHORIZE automatically.

PACKAGE and RESTORE_TEST require an explicit future gate.

---

## 23. Closed gates

`Z-LIFEBOAT-GIT-BUNDLE-PILOT-1`: **CLOSED**. This spec does not authorize creating a bundle.

Dual offline custody: **CLOSED**.

R2 implementation: **CLOSED**. No bucket, token, or upload.

Z-PoT Phase 0.5: **CLOSED**.
