# PHASE_Z_LIFEBOAT_GIT_BUNDLE_PILOT_2_CURRENT_RECOVERY_RECEIPT

**Gate:** Z-LIFEBOAT-GIT-BUNDLE-PILOT-2-CURRENT  
**Seal:** local Turtle branch only · **not** pushed · **not** a PR  
**Date:** 2026-09-03  
**Package state:** `RECOVERY_PACKAGE_PROVEN`  
**Freshness:** `CURRENT`  
**Scope of package state:** this exact artifact / hash / source commit only

`RECOVERY_PACKAGE_PROVEN` and `CURRENT` were proven independently. Organism-wide `RECOVERY_PROVEN` is **not** claimed.

Pilot 1 remains immutable historical evidence (`RECOVERY_PACKAGE_PROVEN` + `BEHIND`). This is a new lineage member.

---

## Source

| Item | Value |
| --- | --- |
| Repository identity | `https://github.com/ManojK626/z-sanctuary-universe.git` |
| Authorized physical context | `C:\Cursor Projects Organiser\Z_Sanctuary_Universe_wt_lifeboat_git_bundle_pilot_2_current` |
| Common Git directory | `C:/Cursor Projects Organiser/Z_Sanctuary_Universe/.git` |
| Source branch | `cursor/zsanctuary/z-lifeboat-git-bundle-pilot-2-current` |
| PILOT_2_SOURCE_COMMIT | `d3e93cd5a333fe0dabe3a013ddf883340f49b99b` |
| Source HEAD at packaging | `d3e93cd5a333fe0dabe3a013ddf883340f49b99b` |
| Canonical `origin/main` at packaging | `d3e93cd5a333fe0dabe3a013ddf883340f49b99b` |
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
| Attached worktrees | 26 on the shared Git directory; not treated as committed repository contents |
| Source `git fsck --full` | exit 0; dangling objects reported; no missing/corrupt objects |

`--all` on the shared Git directory would have included 159 local heads and stash (27 reflog entries). Those refs are **not** the authorized canonical hub. They were excluded. Stash messages are not reproduced here.

---

## Ref scope

| Item | Value |
| --- | --- |
| Intended class | `FULL_REPOSITORY_BUNDLE` of GitHub hub `refs/remotes/origin/*` commit heads after `git fetch origin`, excluding symbolic `origin/HEAD` |
| Tags | 0 |
| Source origin heads | 122 |
| Packaging mirror heads | 122 |
| Missing / mismatch / extra before create | 0 / 0 / 0 |

FULL means the declared canonical hub ref scope, not every local scratch/worktree ref.

---

## Artifact

| Item | Value |
| --- | --- |
| Artifact ID | `ZSU-HUB__FULL__d3e93cd5__20260903T110637Z` |
| Bundle class | `FULL_REPOSITORY_BUNDLE` |
| Filename | `ZSU-HUB__FULL__d3e93cd5__20260903T110637Z.bundle` |
| Local path | `C:\Cursor Projects Organiser\Z_Lifeboat_Recovery\Git_Bundle_Pilot_2_Current\ZSU-HUB__FULL__d3e93cd5__20260903T110637Z\ZSU-HUB__FULL__d3e93cd5__20260903T110637Z.bundle` |
| Size | 5432228 bytes |
| SHA-256 (Get-FileHash) | `B96AABA6111E873FC42598833D84FB333A15BB364343B1AC09471BDB2A25ED27` |
| Creation timestamp (UTC) | `2026-09-03T11:06:40Z` |
| Source commit | `d3e93cd5a333fe0dabe3a013ddf883340f49b99b` |

Filename ≠ provenance. Bundle hash proves bundle-file identity, not recovery success.

Exact bundle command (after isolated packaging mirror whose heads matched origin 122/122):

`git -C "<artDir>\packaging-source-mirror.git" bundle create "<bundlePath>" --all`

Bundle create exit code: 0. Packaging mirror is not Git-tracked.

Pilot 1 artifact `ZSU-HUB__FULL__8ef9e3a4__20260903T103812Z` was not renamed, overwritten, or reused. Reconfirmed SHA-256 `44F1C2C8B38C763430E60BFE7AAA887B4A890160B5BD713C021D6C01E6651C4F`.

---

## Git verification

| Check | Result |
| --- | --- |
| `git bundle verify <bundle>` | exit 0; "The bundle records a complete history." |
| Prerequisites | none |
| Advertised `refs/heads/*` | 122 |
| Canonical `main` in bundle heads | `d3e93cd5a333fe0dabe3a013ddf883340f49b99b refs/heads/main` |
| Canonical commit object type | commit |

---

## Restore

| Item | Value |
| --- | --- |
| Disposable restore path | `C:\Cursor Projects Organiser\Z_Recovery_Drills\Git_Bundle_Pilot_2_Current\ZSU-HUB__FULL__d3e93cd5__20260903T110637Z` |
| Exact restore command | `git clone -- "<bundlePath>" "<restorePath>"` |
| Restore exit code | 0 |
| Network independence | clone URL was the local `.bundle` only; restored `origin` points at that file; URL does not contain `github` |
| Restored HEAD / `main` | `d3e93cd5a333fe0dabe3a013ddf883340f49b99b` |
| Restored fsck | `git fsck --full` exit 0 |
| Parents | `7fd41b080cf51164506544f5fbfbfe84da14a9c6` and `77b70860cb194a5092e0d369fe925bc09470bcd7` (source and restored identical) |
| Tree | `e72b50ab6ddc7dbd45d5cc53ce43ed390b23b050` (source and restored identical) |

Content / history identity: PASS. Remote configuration metadata differs by design.

---

## Coverage

| Item | Count |
| --- | --- |
| Source origin heads | 122 |
| Bundle `refs/heads/*` | 122 |
| Restored `origin/*` branches | 122 |
| Missing | 0 |
| Mismatched SHA | 0 |
| Unexplained extra | 0 |

---

## Result

Recovery state: `RECOVERY_PACKAGE_PROVEN`

Freshness (final `origin/main` re-read after restore): `CURRENT`

Final observed `origin/main` remained `d3e93cd5a333fe0dabe3a013ddf883340f49b99b`, equal to `PILOT_2_SOURCE_COMMIT`.

Applies only to:

- repository `z-sanctuary-universe`
- source commit `d3e93cd5a333fe0dabe3a013ddf883340f49b99b`
- artifact `ZSU-HUB__FULL__d3e93cd5__20260903T110637Z`
- SHA-256 `B96AABA6111E873FC42598833D84FB333A15BB364343B1AC09471BDB2A25ED27`

---

## Explicit non-claims

| Claim | Status |
| --- | --- |
| Lifeboat `RECOVERY_PROVEN` | NO |
| Sanctuary `RECOVERY_PROVEN` | NO |
| Independent custody | NO |
| Offline A | NO |
| Offline B | NO |
| `DUAL_OFFLINE_VERIFIED` | NO |
| Secure Clone complete | NO |
| Key separation complete | NO |
| R2 readiness / upload | NO |
| Full workstation recovery | NO |

Recovery package proof is not independent custody.

The `.bundle` remains on the same general workstation failure domain: **LOCAL PORTABLE RECOVERY PACKAGE**.

---

## Steward disposition

Recommended next gate (not opened): **Z-LIFEBOAT-OFFLINE-CUSTODY-SECURITY-PREFLIGHT-1**.

`Z-LIFEBOAT-DUAL-OFFLINE-CUSTODY-PILOT-1` remains **CLOSED** until that security/encryption boundary is resolved.

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
| FULL origin-head coverage 122/122 | PASS |
| One new `.bundle` outside Git trees | PASS |
| Pilot 1 artifact unmodified | PASS |
| SHA-256 recorded | PASS |
| `git bundle verify` | PASS |
| Disposable restore from local bundle only | PASS |
| Restored fsck / tree / parents | PASS |
| Freshness independent of package proof | PASS (`CURRENT`) |
| Organism `RECOVERY_PROVEN` not claimed | PASS |
