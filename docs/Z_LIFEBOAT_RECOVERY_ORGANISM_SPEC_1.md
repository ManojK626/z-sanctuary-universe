# Z-Lifeboat — Recovery Organism Spec 1

**Short ID:** `Z-Lifeboat`  
**Status:** architecture / doctrine only  
**Classification of R2 (inherited):** `OPTION B — R2 AS OPTIONAL CUSTODY DESTINATION`  
**This document:** recovery organism constitution · **not** restore proof · **not** a deploy grant

Evidence base (canonical on `main`):

- [Z-Sanctuary Universe Constitution V1](governance/Z_SANCTUARY_UNIVERSE_CONSTITUTION_V1.md)
- [Z-LIC Constitution Spec 1](Z_LIC_LIVING_INTELLIGENCE_COMMONS_CONSTITUTION_SPEC_1.md)
- [Z-R2 / Lifeboat Custody Reconciliation 0](Z_R2_LIFEBOAT_CUSTODY_RECONCILIATION_0.md)

Canonical principle:

> R2 joins Lifeboat. Lifeboat does not become R2.

---

## 1. Canonical identity

| Field | Frozen value |
| --- | --- |
| Name | Z-Lifeboat |
| Descriptive identity | Z-Sanctuary Recovery · Continuity · Independent Custody Organism |
| Type | Recovery architecture / custody coordination / continuity doctrine / restore-verification framework |

Z-Lifeboat is **not**: Cloudflare R2; GitHub; a single backup; a new source-control system; an autonomous recovery AI; a replacement for project identity; a replacement for human stewardship.

It coordinates existing custody paths. It does not absorb them.

---

## 2. Purpose

Z-Lifeboat exists to make catastrophic loss survivable.

It coordinates independent custody paths so canonical project knowledge can be reconstructed after development-machine loss, drive failure, accidental deletion, repository corruption, cloud outage, forge loss, account lockout, malware/ransomware, operator error, stale backups, unavailable network, or provider failure.

Recovery must not depend upon one provider or one device.

---

## 3. Law 1 — Restore Proof

> Backup is not proven until restore is proven.

Existence of a copy is insufficient. A recovery path becomes trusted only after a governed restore test demonstrates integrity.

Do not use vague labels such as `BACKED UP` as proof.

---

## 4. Law 2 — Failure-Domain Independence

> A copy is not independent if it depends on the same failure domain.

Two folders on one drive are not two independent recovery copies. Two cloud locations under one compromised credential may not be operationally independent.

Independence is architectural, not merely numerical.

---

## 5. Law 3 — Key Separation

> A secret stored beside its encrypted recovery artifact is not separate custody.

Recovery keys and secrets require independent custody. No plaintext secret may be placed inside its own protected recovery package.

Also:

> Encryption without independent key custody is incomplete recovery architecture.

---

## 6. Law 4 — Cloud Is Not Survival

> Cloud redundancy does not replace offline custody.

Also:

> Cloud availability must never be required to recover canonical Z-Sanctuary knowledge.

---

## 7. Recovery organism

```text
                    Z-LIFEBOAT
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   SOURCE CUSTODY   INDEPENDENT COPY   REMOTE CUSTODY
        │                │                │
    Local Git       Secure Clone       GitHub
    Snapshots       Offline A/B        Future R2
        │                │                │
        └────────────────┼────────────────┘
                         │
                 Recovery Manifest
                         │
                  Integrity Proof
                         │
                    Restore Drill
                         │
                  Recovery Receipt
```

This diagram is architecture only.

---

## 8. Source custody

Local Git remains the working source-history mechanism where applicable. Z-Lifeboat does not replace Git.

Future recovery design may include canonical repository identity, commit history, refs, tags, Git bundles, and verified repository snapshots.

Git-bundle implementation remains **FUTURE_DECLARED**.

---

## 9. Z-Secure Clone

**Z-Secure Clone** is a future role inside Lifeboat: Independent Recovery Copy.

Canonical product status on this `main`: **UNKNOWN / FUTURE_DECLARED**. This spec does not claim an implemented Secure Clone engine.

Later purpose may include separate physical or device custody, verified freshness, integrity proof, and independent restore capability.

It does not become a second source of truth.

---

## 10. Dual offline custody

**Offline Copy A** — physically independent recovery copy.  
**Offline Copy B** — second physically independent recovery copy.

Exact media and location are not specified in this gate.

> Two copies count as independent only when the same single failure cannot reasonably destroy both.

Status: **FUTURE_DECLARED**. No physical copies created here.

---

## 11. Git bundle doctrine

Future use of Git bundle or an equivalent repository-portable package is declared where technically suitable.

A future trusted bundle must be created from a known repository state, hashed, verified, restored into a disposable test location, and checked against expected refs/commits.

Status: **FUTURE_DECLARED**. No bundle generated.

---

## 12. Z-Recovery Manifest

Status: **FUTURE_DECLARED**. No schema file.

Purpose: describe what a recovery artifact is and how it relates to canonical identity.

Candidate fields include artifact ID, project ID, repository ID, source commit, source branch/ref, artifact class, creation time, hash, encryption status, custody destination, retention class, recovery owner, verification state, last restore test, and supersession lineage.

Reuse existing Git, receipt, registry, and MCBURB identity fields wherever possible.

---

## 13. Integrity model

```text
SOURCE
↓
PACKAGE
↓
SOURCE/PACKAGE HASH
↓
ENCRYPT IF REQUIRED
↓
CIPHERTEXT HASH
↓
CUSTODY
↓
RETRIEVE
↓
VERIFY CIPHERTEXT
↓
DECRYPT
↓
VERIFY RESTORED CONTENT
↓
RESTORE TEST
```

Provider checksum is useful operational evidence. It is not provenance authority.

---

## 14. Encryption / key custody

Sensitive recovery material should be encrypted before external custody where future security doctrine requires it.

Cryptographic implementation: **FUTURE_SECURITY_GATE**. No secret material belongs in this specification. No keys are generated here.

---

## 15. Remote custody

### GitHub

Role: remote Git, collaboration, PR/CI evidence, branch/merge history, and a recovery source.

GitHub does not define project identity.

### Cloudflare R2

Role: **optional object / archive custody**.

May later hold approved classes such as governance/evidence archives, release artifacts, encrypted recovery packages, and approved datasets.

R2 remains optional. No R2 resource is created here. R2 implementation remains **CLOSED**.

---

## 16. Custody classes

This spec **references** C0–C6 from [Z-R2 / Lifeboat Custody Reconciliation 0](Z_R2_LIFEBOAT_CUSTODY_RECONCILIATION_0.md). It does not fork them.

| Class | Meaning |
| --- | --- |
| C0 | Source control |
| C1 | Governance / evidence |
| C2 | Release artifacts |
| C3 | Recovery packages |
| C4 | Approved datasets |
| C5 | Temporary transfer |
| C6 | Forbidden cloud custody |

---

## 17. Z-Recovery Drill

Status: **FUTURE_DECLARED**. No drill executed.

A trusted recovery drill should eventually demonstrate: known canonical source; source hash; package creation; encryption where required; independent custody; retrieval; hash verification; decryption if applicable; disposable restore; repository/content verification; application/domain validation where appropriate; recovery receipt.

A drill may fail. Failure is useful evidence. A failed drill must not be reported as recovery readiness.

---

## 18. Z-Recovery Receipt

Status: **FUTURE_DECLARED**.

A future receipt should capture source identity, artifact identity, custody path, integrity checks, restore environment, restored identity, test result, discrepancies, Steward disposition, and next required action.

---

## 19. Recovery readiness states

Prefer governed states:

- `UNASSESSED`
- `COPY_EXISTS`
- `INTEGRITY_VERIFIED`
- `INDEPENDENT_CUSTODY_VERIFIED`
- `RESTORE_TESTED`
- `RECOVERY_PROVEN`
- `STALE`
- `FAILED`
- `UNKNOWN`

`RECOVERY_PROVEN` requires successful restore evidence. This spec does **not** claim `RECOVERY_PROVEN`.

---

## 20. Failure-domain model

Future custody analysis must consider at minimum: same physical drive; same machine; same building/location; same cloud provider; same account; same credentials; same network dependency; same encryption-key custody; same administrator; same malware/ransomware exposure.

---

## 21. Authority model

| Verb | Meaning |
| --- | --- |
| OBSERVE | Inspect recovery health |
| PACKAGE | Prepare approved recovery material |
| COPY / UPLOAD | Write to an approved custody destination |
| LOCK | Apply retention protection |
| DELETE | Destroy a custody artifact |
| RESTORE | Recover into an approved environment |
| VERIFY | Confirm integrity |
| AUTHORIZE | Approve dangerous or privileged actions |

No AI automatically receives DELETE, LOCK, cloud-write, secret access, or AUTHORIZE.

> Performance does not grant sovereignty.

Also:

> Readiness does not equal deployment.

---

## 22. Destructive actions

Future destructive operations are separate from ordinary backup creation. Examples: deleting recovery artifacts; overwriting canonical recovery copies; shortening retention; destroying old keys; resetting custody destinations.

These require explicit governance. No destructive operation is authorized by this spec.

---

## 23. Platform-independence tests

### Scenario A — dual-cloud loss

GitHub unavailable. Cloudflare unavailable. Can authorized humans still recover canonical knowledge?

### Scenario B — development machine lost

Primary development machine destroyed. Can independent custody restore canonical repositories?

### Scenario C — cloud credentials compromised

Can recovery proceed without trusting affected cloud copies?

### Scenario D — one offline copy corrupted

Does another independent recovery path remain?

A Lifeboat architecture that cannot answer these positively is incomplete.

---

## 24. Current readiness honesty

Based on [Z-R2 / Lifeboat Custody Reconciliation 0](Z_R2_LIFEBOAT_CUSTODY_RECONCILIATION_0.md): operational independent recovery remains **incomplete**. Local Git and GitHub exist. Dual offline copies, Secure Clone, git bundles, proven restore drills, and independent key custody are not sealed as working systems on this `main`.

Architecture readiness is not recovery proof.

Current governed posture: `COPY_EXISTS` for GitHub-hosted hub history; `UNKNOWN` / incomplete for independent offline restore. **Not** `RECOVERY_PROVEN`.

---

## 25. Future implementation order

Each step remains separately gated:

1. Git-bundle doctrine / portable repository package
2. Dual offline custody
3. Key-separation operations
4. Recovery manifest
5. Non-destructive restore drill
6. Recovery receipt
7. Recovery readiness evaluation
8. R2 implementation preflight
9. Optional R2 pilot
10. Periodic recovery drills

---

## 26. Closed gates

R2 implementation: **CLOSED**. No bucket, credential, token, Worker, upload, lifecycle, or lock.

Z-PoT Phase 0.5: **CLOSED**. No project citizenship changes.

Promotion of this spec requires a separate Steward gate.
