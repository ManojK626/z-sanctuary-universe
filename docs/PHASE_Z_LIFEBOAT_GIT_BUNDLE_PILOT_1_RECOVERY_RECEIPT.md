# PHASE_Z_LIFEBOAT_GIT_BUNDLE_PILOT_1_RECOVERY_RECEIPT

**Gate:** Z-LIFEBOAT-GIT-BUNDLE-PILOT-1  
**Seal:** local Turtle branch only · **not** pushed · **not** a PR  
**Date:** 2026-09-03  
**Package state:** `RECOVERY_PACKAGE_PROVEN`  
**Scope of that state:** this exact artifact / hash / source commit only

Organism-wide `RECOVERY_PROVEN` is **not** claimed.

---

## Source

| Item | Value |
| --- | --- |
| Repository identity | `https://github.com/ManojK626/z-sanctuary-universe.git` |
| Authorized physical context | `C:\Cursor Projects Organiser\Z_Sanctuary_Universe_wt_lifeboat_git_bundle_pilot_1` |
| Common Git directory | `C:/Cursor Projects Organiser/Z_Sanctuary_Universe/.git` |
| Source branch | `cursor/zsanctuary/z-lifeboat-git-bundle-pilot-1` |
| Source HEAD at packaging | `8ef9e3a4589d0b3f1aa88a93788bfe2d8dbc967b` |
| Canonical `origin/main` | `8ef9e3a4589d0b3f1aa88a93788bfe2d8dbc967b` |
| Porcelain at packaging | CLEAN |
| Git version | `git version 2.54.0.windows.1` |
| Dirty mixed workspace | **not** an authorized bundle source |

The historically dirty mixed workspace remained on `cursor/zsanctuary/global-open-workflow-reconciliation` @ `3f02aa68810df3184ca073d15a8293f0e834bd22` and was not packaged.

---

## Completeness preflight

| Check | Result |
| --- | --- |
| Shallow repository | no (`git rev-parse --is-shallow-repository` = `false`) |
| Partial clone / promisor remote | not configured |
| Object alternates | none |
| Git LFS client present | yes (`git-lfs/3.7.1`) |
| `.gitattributes` LFS filters | none |
| LFS pointers in `HEAD` | none |
| `git lfs ls-files` | empty |
| `.gitmodules` | absent |
| Gitlink entries (`160000`) | none |
| Attached worktrees | present on the shared Git directory; not treated as committed repository contents |
| Source `git fsck --full` | exit 0; dangling objects reported; no missing/corrupt objects |

LFS client filters exist on this workstation. This hub tree does not use Git LFS content. Completeness was not held for LFS.

`--all` on the **shared** Git directory would have included 157 local heads, a stale local `refs/heads/main` (`36c396b5017f50f93cb2421a197c5c813b856d9d` ≠ canonical `origin/main`), and stash. Those refs are **not** the authorized canonical hub. They were excluded.

Stash is present in the shared Git directory (27 stash reflog entries). Stash was **not** bundled. Stash messages are **not** reproduced here.

---

## Artifact

| Item | Value |
| --- | --- |
| Artifact ID | `ZSU-HUB__FULL__8ef9e3a4__20260903T103812Z` |
| Bundle class | `FULL_REPOSITORY_BUNDLE` |
| Filename | `ZSU-HUB__FULL__8ef9e3a4__20260903T103812Z.bundle` |
| Local path | `C:\Cursor Projects Organiser\Z_Lifeboat_Recovery\Git_Bundle_Pilot_1\ZSU-HUB__FULL__8ef9e3a4__20260903T103812Z\ZSU-HUB__FULL__8ef9e3a4__20260903T103812Z.bundle` |
| Size | 5419250 bytes |
| SHA-256 (Get-FileHash) | `44F1C2C8B38C763430E60BFE7AAA887B4A890160B5BD713C021D6C01E6651C4F` |
| Creation timestamp (UTC) | `2026-09-03T10:38:15Z` |
| Source `origin/main` | `8ef9e3a4589d0b3f1aa88a93788bfe2d8dbc967b` |
| Source HEAD | `8ef9e3a4589d0b3f1aa88a93788bfe2d8dbc967b` |

Filename ≠ provenance. Bundle hash proves bundle-file identity, not recovery success.

Exact bundle command (after an isolated packaging mirror whose heads matched GitHub `origin` refs 120/120):

`git -C "<artDir>\packaging-source-mirror.git" bundle create "<bundlePath>" --all`

Bundle create exit code: 0.

The packaging mirror is a local packaging aid beside the bundle. It is **not** independent custody and is **not** a Git-tracked artifact.

---

## Ref coverage

| Item | Value |
| --- | --- |
| Intended scope | GitHub hub `FULL_REPOSITORY_BUNDLE`: all `refs/remotes/origin/*` commit heads after `git fetch origin`, excluding symbolic `origin/HEAD` |
| Tags | 0 |
| Source origin heads | 120 |
| Bundle `refs/heads/*` | 120 |
| Bundle also records | `HEAD` → same commit as `refs/heads/main` |
| Coverage result | PASS — 120/120 names and SHAs match source origin, bundle, and restored `origin/*` |

`git bundle verify` reported: "The bundle records a complete history."

Excluded from this artifact on purpose (not FULL of the shared workstation Git directory):

- 157 local heads (worktree / development branches, including the dirty mixed workspace branch)
- stale local `refs/heads/main`
- stash
- no tags existed to include

This artifact is FULL of the **canonical GitHub hub repository identity** known locally after fetch. It is not a dump of unrelated local worktree branches.

---

## Git verification

| Check | Result |
| --- | --- |
| `git bundle verify <bundle>` | exit 0 |
| Prerequisites | none (complete history) |
| Hash algorithm recorded by Git | sha1 (Git object IDs; distinct from bundle-file SHA-256) |
| Canonical commit in bundle heads | `8ef9e3a4589d0b3f1aa88a93788bfe2d8dbc967b refs/heads/main` |
| Canonical commit object type | commit |

Creation is not proof. Git-native verify is not restore proof.

---

## Restore

| Item | Value |
| --- | --- |
| Disposable restore path | `C:\Cursor Projects Organiser\Z_Recovery_Drills\Git_Bundle_Pilot_1\ZSU-HUB__FULL__8ef9e3a4__20260903T103812Z` |
| Exact restore command | `git clone -- "<bundlePath>" "<restorePath>"` |
| Restore exit code | 0 |
| Network independence | clone URL was the local `.bundle` file only; restored `origin` points at that file; URL does not contain `github` |
| Restored HEAD | `8ef9e3a4589d0b3f1aa88a93788bfe2d8dbc967b` |
| Restored branch | `main` |
| Restored `refs/heads/main` | `8ef9e3a4589d0b3f1aa88a93788bfe2d8dbc967b` |
| Restored `origin/main` | `8ef9e3a4589d0b3f1aa88a93788bfe2d8dbc967b` |
| Restored fsck | `git fsck --full` exit 0 |
| Parents | `30e670326018de64737deb268e06b8d61215433b` and `1134236848cf9da283c56d4fbb26cf010482c6bc` (source and restored identical) |
| Tree | `52153835265105f25272c922195de36b63a36b24` (source and restored identical) |

Remote configuration metadata differs from GitHub by design. That is not repository corruption.

Content / history identity: PASS.

---

## Result

`RECOVERY_PACKAGE_PROVEN`

Applies only to:

- repository `z-sanctuary-universe`
- source commit `8ef9e3a4589d0b3f1aa88a93788bfe2d8dbc967b`
- artifact `ZSU-HUB__FULL__8ef9e3a4__20260903T103812Z`
- SHA-256 `44F1C2C8B38C763430E60BFE7AAA887B4A890160B5BD713C021D6C01E6651C4F`

---

## Explicit non-claims

| Claim | Status |
| --- | --- |
| Lifeboat `RECOVERY_PROVEN` | NO |
| Sanctuary `RECOVERY_PROVEN` | NO |
| Independent custody | NO |
| Offline A | NO |
| Offline B | NO |
| Secure Clone complete | NO |
| Key separation complete | NO |
| Cloud recovery complete | NO |
| R2 readiness / upload | NO |
| Full workstation recovery | NO |

Package recovery proof is not custody independence.

The `.bundle` remains on the same general workstation failure domain.

`UNCOMMITTED STATE NOT CAPTURED` remains true for the dirty mixed workspace and for any uncommitted state anywhere on this PC.

---

## Steward disposition

Recommended next gate (not opened): **Z-LIFEBOAT-DUAL-OFFLINE-CUSTODY-SPEC-1**.

Do not jump to R2.

Preferred later order remains: proven Git bundle → dual offline custody → key separation → recovery manifest maturity → repeatable recovery drill → R2 preflight.

R2 remains CLOSED. Z-PoT Phase 0.5 remains CLOSED.

---

## Tracked repository file

This receipt is the only authorized Git-tracked file from this gate.

Not committed: `.bundle`, packaging mirror, restore directory, hash sidecar, command logs, secrets.

---

## Validation

| Check | Result |
| --- | --- |
| Authorized source CLEAN at packaging | PASS |
| Completeness preflight recorded | PASS |
| FULL origin-head coverage 120/120 | PASS |
| One `.bundle` created outside Git trees | PASS |
| SHA-256 recorded | PASS |
| `git bundle verify` | PASS |
| Canonical commit proven by object/ref semantics | PASS |
| Disposable restore from local bundle only | PASS |
| Restored fsck / tree / parents | PASS |
| Organism `RECOVERY_PROVEN` not claimed | PASS |
