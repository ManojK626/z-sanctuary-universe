# Z-Lifeboat Offline Custody Security Preflight 1

**Gate:** `Z-LIFEBOAT-OFFLINE-CUSTODY-SECURITY-PREFLIGHT-1`  
**Mode:** VERIFY → ISOLATE → DISCOVER → CLASSIFY → SECRET-HISTORY ASSESSMENT → THREAT-MODEL → DECIDE SECURITY POSTURE → REPORT → LOCAL SEAL → STOP  
**Date:** 2026-09-03  
**Authority:** Steward-authorized read-only security/privacy preflight  
**This gate does not authorize:** encryption, decryption, keys, passwords, recovery codes, media write, Offline A/B, R2, history rewrite, credential use, or Z-PoT Phase 0.5

Governed question:

> Can a proven Z-Sanctuary recovery bundle safely exist on removable/offsite media in plaintext, or must it be encrypted before Offline A/B are created?

**Decision class:** `OPTION A — PLAINTEXT OFFLINE CUSTODY ACCEPTABLE`  
**Recovery-artifact class (reuse, not invention):** `INTERNAL`  
**Offline custody security state:** `PLAINTEXT_APPROVED`  
**Scope of that approval:** GitHub-visible hub `FULL_REPOSITORY_BUNDLE` of `refs/remotes/origin/*` only (Pilot 1 / Pilot 2 class)

This is **not** a claim that the hub is `PUBLIC_SAFE`. It is a claim that encrypting a USB copy of already GitHub-visible history would not reduce a confidentiality exposure that GitHub already publishes, and would add a recovery-key failure mode.

> A clean current working tree does not prove clean historical Git content.
>
> Staleness can reduce recovery freshness without reducing confidentiality risk.
>
> Security that prevents authorized recovery is a recovery failure.
>
> A key stored with its ciphertext is not independent key custody.
>
> An encrypted recovery artifact whose only key can be lost in the same event is not resilient recovery.
>
> A password remembered by one person is not sufficient sole recovery-key custody.
>
> Security assessment must not turn secret discovery into secret use.

Secret values are **not** recorded in this document.

---

## A. Canonical Base

| Item | Evidence |
| --- | --- |
| Repository | `https://github.com/ManojK626/z-sanctuary-universe.git` |
| GitHub visibility (anonymous HTTP HEAD) | `200` |
| GitHub visibility (`gh repo view`) | `PUBLIC` (`isPrivate: false`) |
| Worktree | `C:\Cursor Projects Organiser\Z_Sanctuary_Universe_wt_lifeboat_offline_security_preflight_1` |
| Branch | `cursor/zsanctuary/z-lifeboat-offline-custody-security-preflight-1` |
| Canonical `origin/main` at assessment | `4d12e5383b1743f2334fe8eec79c34fad3ef0664` |
| Worktree HEAD | `4d12e5383b1743f2334fe8eec79c34fad3ef0664` |
| Start porcelain | CLEAN |
| Dirty mixed workspace | read-only; not an assessment mutation target |

Authorization-time known SHA `4d12e5383b1743f2334fe8eec79c34fad3ef0664` matched refreshed `origin/main`. Do not assume it remains current after later merges.

Canonical dependencies **present** on this base:

| Doctrine / evidence | Path |
| --- | --- |
| Constitution V1 | `docs/governance/Z_SANCTUARY_UNIVERSE_CONSTITUTION_V1.md` |
| Z-Lifeboat Recovery Organism Spec 1 | `docs/Z_LIFEBOAT_RECOVERY_ORGANISM_SPEC_1.md` |
| Git Bundle Spec 1 | `docs/Z_LIFEBOAT_GIT_BUNDLE_SPEC_1.md` |
| Pilot 1 canonical receipt | `docs/PHASE_Z_LIFEBOAT_GIT_BUNDLE_PILOT_1_RECOVERY_RECEIPT.md` |
| Pilot 2 canonical receipt | `docs/PHASE_Z_LIFEBOAT_GIT_BUNDLE_PILOT_2_CURRENT_RECOVERY_RECEIPT.md` |
| Dual Offline Custody Spec 1 | `docs/Z_LIFEBOAT_DUAL_OFFLINE_CUSTODY_SPEC_1.md` |
| Dual Offline GREEN receipt | `docs/PHASE_Z_LIFEBOAT_DUAL_OFFLINE_CUSTODY_SPEC_1_GREEN_RECEIPT.md` |

No `BLOCKED — CANONICAL DEPENDENCY FAILURE`.

---

## B. Recovery Evidence Inputs

| Item | Pilot 1 (historical) | Pilot 2 (latest lineage member) |
| --- | --- | --- |
| Artifact ID | `ZSU-HUB__FULL__8ef9e3a4__20260903T103812Z` | `ZSU-HUB__FULL__d3e93cd5__20260903T110637Z` |
| Package state | `RECOVERY_PACKAGE_PROVEN` | `RECOVERY_PACKAGE_PROVEN` |
| Freshness vs this `main` | `BEHIND` | `BEHIND` |
| Source commit | `8ef9e3a4589d0b3f1aa88a93788bfe2d8dbc967b` | `d3e93cd5a333fe0dabe3a013ddf883340f49b99b` |
| SHA-256 | `44F1C2C8B38C763430E60BFE7AAA887B4A890160B5BD713C021D6C01E6651C4F` | `B96AABA6111E873FC42598833D84FB333A15BB364343B1AC09471BDB2A25ED27` |

Pilot 2 SHA-256 was **rechecked read-only** on the existing file. Match. The bundle was **not** copied or modified.

Pilot 2 class: `FULL_REPOSITORY_BUNDLE` of GitHub hub `refs/remotes/origin/*` (122 heads at packaging). Confidentiality applies to **the history package**, not merely current `HEAD`.

Pilot 2 being `BEHIND` after evidence merge **does not** make it less sensitive than a current package.

Organism-wide `RECOVERY_PROVEN` is **not** claimed. `DUAL_OFFLINE_VERIFIED` is **not** claimed.

---

## C. Current Tree Assessment

Authorized checks (read-only; no secret values printed):

| Check | Result |
| --- | --- |
| Tracked `.env` (not example) | none |
| Tracked `.env.example` | present (template class) |
| Tracked `*.pem` | `config/z_request_access_public.pem` only (public PEM class) |
| Tracked `id_rsa` / `credentials.json` / `secrets.json` | none |
| `git grep` at `HEAD` for `ghp_` / `github_pat_` / `BEGIN PRIVATE KEY` / `AKIA` / Slack `xox` / `sk_live_` | zero hits |
| Canonical `npm run security:data-leak-audit` (`scripts/z_data_leak_detector.mjs`) | `status=green`; files scanned 2125; findings_count 0; critical/high/warn = 0 |
| Leak-audit report files | generated then **restored**; not retained; samples not copied into this doc |
| Security-policy restricted combat paths tracked on `HEAD` | yes (see F) |
| `vault/personal` tracked | none |
| gitleaks / trufflehog / detect-secrets in `.github/workflows` | **absent** |

`config/z_data_leak_policy.json` allow-list includes `.env.example`, the public PEM, and **`docs/`** (entire docs tree skipped by that detector). That is a scanner limitation, not proof of absence.

`scripts/z_privacy_scan.mjs` exists but targets uploads/vault directories and would create folders. It was **not** run (would mutate the worktree beyond the two authorized docs).

`scripts/z_security_sentinel.mjs` aggregates other report JSON; it is not a Git-history secret scanner. Not used as a secret-history authority.

---

## D. Historical Git Assessment

Approaches: `git log --name-only` (no `-p` dumps); `git log -G` with `--name-only` / `--max-count`; no credential testing; no history rewrite.

| Probe | Classification |
| --- | --- |
| Historical exact `.env` add (not example) | none observed |
| `vault/personal/z_request_access_private.pem` ever tracked | none observed |
| `-G` `BEGIN .*PRIVATE KEY` | `POTENTIAL_SECRET_PATTERN` — detector regex in `scripts/z_data_leak_detector.mjs` (initial baseline commit) |
| `-G` `ghp_` / `github_pat_` | `POTENTIAL_SECRET_PATTERN` — health-alert adapter/verify scripts and `data/examples/` synthetic producer JSON |
| Reachable deleted files still in included history | **assumed possible** for any full bundle; not exhaustively enumerated |
| Complete proof `NO SECRETS EXIST` | **not claimed** |

History class for live credentials: **`NONE_OBSERVED` by authorized checks**, with residual **`UNKNOWN`**.

A false-positive pattern is not a real secret. Example/detector strings were not treated as live credentials.

---

## E. Secret Findings Classification

| Class | Finding |
| --- | --- |
| Live secret at `HEAD` | **not observed** by authorized checks |
| Confirmed currently valid committed secret | **not observed** — `HOLD — SECRET REMEDIATION REQUIRED` **not** triggered |
| Historical confirmed secret | **not observed** |
| Potential secret pattern | detector regexes; synthetic/example health-alert fixtures |
| Overall secret-scan statement | `NO MATERIAL SECRET FINDINGS OBSERVED BY AUTHORIZED CHECKS` |

Secret scanning **cannot** prove `NO SECRETS EXIST`. Residual: `UNKNOWN`.

No discovered credential was tested against any external service. No login. No API call with suspected material.

If a later gate finds a currently valid committed secret: stop Offline A/B; open a dedicated remediation lane; **do not** rewrite history inside a copy/encryption gate.

Closest existing incident posture: hub security policy + leak detector + Steward-gated remediation. Do **not** invent a duplicate security organism. If a named Lifeboat lane is later required, reuse `Z-LIFEBOAT-RECOVERY-SECRET-REMEDIATION-1` only if no closer canonical incident lane is opened first.

---

## F. Proprietary / Confidential Classification

Distinguish:

**SECRET MATERIAL** — credentials, private keys, live tokens. Not observed as committed live secrets by authorized checks.

**CONFIDENTIAL / PROPRIETARY MATERIAL** — yes, as **policy overlay**:

- `rules/Z_SANCTUARY_SECURITY_POLICY.md`: proprietary; no external distribution without approval.
- `docs/Z-GITHUB-SANCTUARY-GATE.md`: start with a **private** repo until a conscious public choice.
- Restricted combat index (policy says remain in vault) **is tracked** on `HEAD`:
  - `docs/z_combat/Z_COMBAT_360_RING_CODEX.md`
  - `docs/z_combat/Z_COMBAT_EMBODIMENT_LAYER.md`
  - `docs/z_combat/Z_FORMULA_SECURITY_NOTICE.md`
  - `schemas/z_combat_360_schema_v1.json`
  - `exports/visuals/z_combat_360_ring_v1_2.svg`

**Observed GitHub hosting is PUBLIC.** Those same origin refs are already cloneable without authentication.

Encryption of a removable copy does **not** retract GitHub publication. Treating USB encryption as the remedy for public GitHub + restricted-in-git tension would be the wrong control.

This preflight therefore **does not** classify the GitHub-scoped bundle as `CONFIDENTIAL` or `RESTRICTED` for the **offline-encryption trigger**. Those labels remain available for unpublished local trees, non-origin refs, vault material, or a future private-repo state.

Reuse-before-invent: Dual Offline Spec 1 left plaintext-vs-encryption unresolved. No separate R2 classification-matrix file exists on this `main`. Gate candidate labels are reused: `PUBLIC_SAFE` / `INTERNAL` / `CONFIDENTIAL` / `RESTRICTED` / `UNKNOWN`.

**Assigned recovery-artifact class:** `INTERNAL`.

Not `PUBLIC_SAFE`: Steward has not issued an approved-public-safe declaration; security policy remains proprietary; GitHub-gate still recommends starting private.

---

## G. Personal-Data Boundary

Categories only. No collection beyond what the decision needs. Values not reproduced.

| Category | Observation |
| --- | --- |
| Git author/committer identity emails in history | present as ordinary Git metadata; also on public GitHub |
| Tracked personal vault files | none observed |
| Medical / family / address harvest | **not** performed |
| Privacy-scan numeric risk scores | **not** generated (scanner would mutate folders) |

Exposure of ordinary public Git identity metadata on lost media is undesirable in the abstract and is already a property of the public remote. It does not by itself require artifact encryption of this bundle.

---

## H. Physical-Loss Threat

| Scenario | Assessment for this GitHub-visible bundle |
| --- | --- |
| Removable drive lost | Finder can read plaintext Git history already published on GitHub |
| Removable drive stolen | Same; plus opportunistic offline copy without visiting GitHub |
| Offsite custodian device accessed without authorization | Same class as lost/stolen media |
| Media copied without Steward knowledge | Easier with plaintext; still GitHub-visible bytes |
| Discarded/recycled media | Residual copy of already-public history |
| Malware while temporarily connected | Integrity/availability risk; encryption does not replace scan/eject hygiene |
| Physical seizure / unauthorized inspection | Inspector obtains GitHub-visible history; encryption would delay inspection of *this* copy only |
| Key lost / stolen / password forgotten | N/A on plaintext path; **critical** if encryption is later added |
| Encrypted media survives but key does not | Recovery failure (see L, N) |
| Key survives but all ciphertext copies fail | Recovery failure unless a plaintext or alternate path remains |
| One custodian compromised | Dual Offline Spec: pair degrades; do not move the other copy automatically |
| Both physical copies stored with the same key | Not independent key custody |
| Plaintext bundle exposes entire included Git history | **Yes** — and that history is already on public GitHub for this origin-ref scope |

USB-specific increment: convenience of a packed snapshot without needing the GitHub URL. That is **not** a new secret class for this artifact.

---

## I. Plaintext Exposure

A full Git bundle may expose: complete included history; deleted-but-reachable files; old docs/code; historically committed config; architecture; proprietary implementation; later-removed mistakes; sensitive strings if ever committed and still reachable.

For **this** authorized Pilot 2 scope, that package is the **GitHub origin-head history**, which is **already public**.

**OPTION A** applies: physical loss of a plaintext copy would not expose **material requiring encryption** *beyond what GitHub already publishes*, given:

- no material live-secret findings observed by authorized checks;
- no tracked private key / live `.env`;
- public remote confirmed.

**OPTION A does not approve:**

- copying unpublished dirty-tree files;
- bundling local worktree heads or stash;
- printing custody locations or keys into Git;
- R2 upload;
- organism-wide `RECOVERY_PROVEN`.

If the repository is later made **private**, or a future bundle includes non-GitHub refs, this OPTION A is **void** until a new preflight.

---

## J. Device-Level Encryption Analysis

Device-level encryption (whole-disk unlock) can protect every file on a stick/drive.

Advantages: simple operator gesture; covers labels-adjacent files if they land on the same device.

Risks: platform lock-in; device death takes the unlock with the medium; forgotten unlock credential; portability limits; unlock credential stored with the device is not independent custody.

**This gate does not require device-level encryption** for confidentiality of GitHub-visible bytes. Steward **may** still use it as optional theft-hygiene. It is **not** a substitute for Dual Offline independence, and it is **not** a chosen implementation.

---

## K. Artifact-Level Encryption Analysis

Artifact-level encryption protects the recovery package across destinations.

Advantages: ciphertext remains ciphertext if copied; less tied to one vendor's disk format.

Risks: extra tooling; key-management complexity; lost key makes every copy useless.

**Not selected as mandatory** for this GitHub-visible hub bundle. No format, cipher, or vendor is chosen.

**Double encryption** (device + artifact) is **not** recommended as the default next step. Extra layers can fail independently (unlock forgotten, artifact key lost) without reducing GitHub exposure. More encryption is not automatically safer.

---

## L. Recovery Availability Risk

Encryption adds a failure mode: two healthy ciphertext copies plus a missing key equals **no recovery**.

On the plaintext path, recovery availability is limited by media health, hash integrity, and restore proof — already required by Dual Offline Spec 1 — **not** by a separate cryptographic secret.

That availability benefit is why this preflight refuses encryption-as-ritual.

---

## M. Key-Custody Requirement

For **this** OPTION A path: **no recovery-key custody is required** because no encryption is required.

If a later gate requires encryption, future architecture **must** survive: loss of Offline A; loss of Offline B; loss of primary PC; GitHub outage; Cloudflare outage; loss of one authorized custodian/key copy.

Canonical Git **may** later record: key scheme identifier; key-custody state; number/class of key copies; verification timestamp.

Canonical Git **must not** contain: actual key; password; recovery phrase; private key; full sensitive storage location.

Human memory may be **one** factor. It **must not** be the sole recovery-key path.

No keys, passwords, or recovery codes were created in this gate.

---

## N. Key Single-Point-of-Failure Test

Question: if the only recovery key disappears, are all independent recovery artifacts permanently useless?

On a future **encrypted-only** Offline A/B pair with one key: **YES** — architecture incomplete.

On this **plaintext** approval: **N/A** (no recovery key). Availability still depends on having at least one intact independent copy plus restore capability.

If encryption is later required, open a **key-custody design** inside `Z-LIFEBOAT-RECOVERY-ENCRYPTION-SPEC-1`. Do not solve distribution operationally here.

---

## O. Existing Security Doctrine Reuse

Reused, not replaced:

| Source | Reuse |
| --- | --- |
| `rules/Z_SANCTUARY_SECURITY_POLICY.md` | proprietary overlay; restricted combat index |
| `docs/Z-GITHUB-SANCTUARY-GATE.md` | GitHub as vault/gate; start-private recommendation vs observed PUBLIC |
| `scripts/z_data_leak_detector.mjs` + `config/z_data_leak_policy.json` | canonical current-tree leak audit |
| Dual Offline Spec 1 §14–15 | encryption was `FUTURE_SECURITY_GATE`; this preflight **closes that gate for this artifact class** |
| R2 Lifeboat Reconciliation 0 | R2 remains optional destination; implementation CLOSED |
| Gate candidate labels | `PUBLIC_SAFE` / `INTERNAL` / `CONFIDENTIAL` / `RESTRICTED` / `UNKNOWN` |

No parallel classification organism invented. No R2 classification-matrix file was present on this `main` to reuse as a machine registry.

---

## P. Security Classification

| Field | Value |
| --- | --- |
| Recovery-artifact class | `INTERNAL` |
| Secret-material class | `NO MATERIAL SECRET FINDINGS OBSERVED BY AUTHORIZED CHECKS` (residual `UNKNOWN`) |
| GitHub hosting | `PUBLIC` (observed) |
| Policy overlay | proprietary + restricted combat files tracked |
| Offline A/B encryption trigger | **not armed** for this GitHub-scoped bundle |

---

## Q. Offline A/B Security State

Declared state: **`PLAINTEXT_APPROVED`**.

Meaning: future Dual Offline execution **may** store the proven `.bundle` directly, **if and only if** Steward later opens `Z-LIFEBOAT-DUAL-OFFLINE-CUSTODY-PILOT-1`.

This preflight **does not** create Offline A or B.

States not selected: `SECURITY_UNASSESSED`, `ENCRYPTION_REQUIRED`, `KEY_CUSTODY_REQUIRED`, `SECURITY_HOLD`.

---

## R. R2 Implication

Whatever confidentiality rule applies to Offline A/B should later **inform** R2. It does **not** copy automatically.

Cloud encryption policy is **not** assumed equal to offline policy.

GitHub being public does **not** authorize R2.

**R2 remains CLOSED.** No upload. No buckets. No credentials.

---

## S. Genuine Gaps

1. GitHub is **PUBLIC** while GitHub-gate doctrine still says start private, and security policy forbids unaudited external distribution. Steward should confirm visibility was **intentional**. USB encryption is not the control for that question.
2. Restricted combat assets are tracked in public Git despite “remain in the vault.” Separate visibility/placement review; not an Offline A/B copy action.
3. No dedicated history-wide secret scanner (gitleaks-class) in canonical CI. Residual `UNKNOWN`.
4. Data-leak detector skips `docs/` and does not scan Git history.
5. Pilot 2 is `BEHIND`; a newer current package may exist later. Confidentiality class of origin history is unchanged by that staleness.
6. If unpublished local work is ever bundled, this OPTION A does not apply.

---

## T. Recommended Next Gate

**Next steward-opened execution gate (still CLOSED here):**

`Z-LIFEBOAT-DUAL-OFFLINE-CUSTODY-PILOT-1`

Plaintext path (authorized only after Steward opens that gate):

```text
RECOVERY_PACKAGE_PROVEN
        ↓
OFFLINE A
        ↓
OFFLINE B
```

**Not opened:** `Z-LIFEBOAT-RECOVERY-ENCRYPTION-SPEC-1` (not required for this artifact class). Keep it as a **future** spec if the repo becomes private, unpublished refs enter a bundle, or Steward later chooses defense-in-depth **with** independent key custody.

**Not opened:** `Z-LIFEBOAT-RECOVERY-SECRET-REMEDIATION-1` (no material live-secret finding).

**Not opened:** R2. **Not opened:** Z-PoT Phase 0.5.

Offline A/B remain **CLOSED** until the Dual Offline pilot is separately authorized.

---

## Authority

AI inspected, classified, and recommended. Human Steward remains final. AI did not reveal secrets, rotate secrets, generate keys, encrypt artifacts, destroy plaintext, or authorize physical custody.
