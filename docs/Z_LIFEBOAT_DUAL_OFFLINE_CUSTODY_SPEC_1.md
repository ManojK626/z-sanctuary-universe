# Z-Lifeboat Dual Offline Custody Spec 1

**Short ID:** `Z-Lifeboat Dual Offline Custody`  
**Status:** specification only · **no** physical copy created  
**Offline A:** `FUTURE_DECLARED`  
**Offline B:** `FUTURE_DECLARED`  
**Execution pilot:** `Z-LIFEBOAT-DUAL-OFFLINE-CUSTODY-PILOT-1` · **CLOSED**  
**R2 implementation:** CLOSED  
**Z-PoT Phase 0.5:** CLOSED

Evidence base:

- [Z-Lifeboat Recovery Organism Spec 1](Z_LIFEBOAT_RECOVERY_ORGANISM_SPEC_1.md)
- [Z-Lifeboat Git Bundle Spec 1](Z_LIFEBOAT_GIT_BUNDLE_SPEC_1.md)
- [Git Bundle Pilot 1 recovery receipt](PHASE_Z_LIFEBOAT_GIT_BUNDLE_PILOT_1_RECOVERY_RECEIPT.md)
- [Constitution V1](governance/Z_SANCTUARY_UNIVERSE_CONSTITUTION_V1.md)

This document defines how a proven recovery package may become two genuinely independent offline custody copies. It does not copy one.

---

## 1. Purpose

Z-Lifeboat Dual Offline Custody maintains at least two physically and operationally independent offline recovery copies so loss of the primary workstation, GitHub, Cloudflare, or one custody copy does not destroy the recovery path.

It is: a failure-domain independence architecture; a future physical-custody procedure; a pair-level verification model; a privacy-aware labeling and receipt design.

It is **not**: a second source of truth; a cloud backup; a USB-copy convenience rule; proof of current recovery merely because two files exist; permission to expose sensitive source material; organism-wide `RECOVERY_PROVEN`.

---

## 2. Primary custody law

> Two copies are not two independent copies unless one plausible failure cannot reasonably destroy or compromise both.

Also:

> A copy is not independent if it depends on the same failure domain.

Also:

> Cloud redundancy does not replace offline custody.

Also:

> Numerical duplication is not architectural independence.

A second folder or partition on the same physical disk is **not** independent.

---

## 3. Custody proof vs freshness

> Custody proof and freshness are separate dimensions.

A bundle may be:

`RECOVERY_PACKAGE_PROVEN` + `BEHIND` + later `INDEPENDENT_CUSTODY_VERIFIED`

That would prove a historical state is independently recoverable. It would **not** prove current-`main` recovery.

`CURRENT` does not by itself prove custody independence. Do not collapse freshness and custody into one GREEN status.

Possible freshness states: `CURRENT`, `BEHIND`, `STALE`, `HISTORICAL`, `UNKNOWN`.

A copy may remain useful when historical. Historical usefulness is not current operational readiness.

---

## 4. Canonical evidence dependency

Pilot 1 evidence is canonical:

| Item | Value |
| --- | --- |
| Artifact | `ZSU-HUB__FULL__8ef9e3a4__20260903T103812Z` |
| Source commit | `8ef9e3a4589d0b3f1aa88a93788bfe2d8dbc967b` |
| SHA-256 | `44F1C2C8B38C763430E60BFE7AAA887B4A890160B5BD713C021D6C01E6651C4F` |
| Package state | `RECOVERY_PACKAGE_PROVEN` |
| Freshness vs current `main` | `BEHIND` |

That artifact is eligible as a **historical proven package** for future custody-procedure testing. It does not establish current-`main` recovery.

---

## 5. Offline A and Offline B

**Offline A** is the first physically independent offline custody copy. Status today: `FUTURE_DECLARED`.

**Offline B** is the second physically independent offline custody copy. Status today: `FUTURE_DECLARED`.

No physical media is created, selected, formatted, or labeled by this gate.

---

## 6. Failure-domain requirements

Future Offline A and Offline B must be evaluated against at least:

- same physical disk;
- same PC;
- same enclosure;
- same power source;
- same room/building;
- same bag/case;
- same fire/flood/theft exposure;
- same always-connected network;
- same malware/ransomware path;
- same administrator account;
- same cloud account;
- same encryption-key location.

If both proposed copies share one material failure domain: **STOP**. Do not label the pair independent.

---

## 7. Physical independence

Future custody should prefer genuine physical separation.

Candidate independent media classes (not product selections):

- separate external SSD/HDD;
- appropriate removable flash media;
- a separate trusted machine;
- an offline NAS copy **only** if failure-domain analysis proves independence;
- other durable offline media.

This spec does **not** authorize shopping, procurement, or vendor choice.

A separate folder or partition on the same physical disk remains: **NOT INDEPENDENT**.

---

## 8. Location independence

For high-value canonical recovery, at least one offline copy should survive loss of the primary building/location.

Canonical Git must not record private street addresses. Future receipts use custody labels, not unnecessarily precise location data.

Candidate labels: `PRIMARY_SITE`, `SECONDARY_SITE`, `OFFSITE_CUSTODY`.

Exact locations remain human-private custody information unless a later Steward gate explicitly authorizes more.

---

## 9. Offline definition

An offline custody copy should not remain continuously mounted or network reachable.

> A copy continuously exposed to the same malware/ransomware path as the source is not fully offline.

Future servicing procedure (not executed here):

`CONNECT → VERIFY → WRITE/REFRESH → VERIFY → SAFELY DISCONNECT`

---

## 10. Artifact eligibility

Only an artifact with sufficiently verified identity is eligible for offline custody.

Preferred minimum:

- artifact identity known;
- source commit known;
- bundle hash known;
- Git verification PASS;
- restore evidence available.

Pilot 1 satisfies `RECOVERY_PACKAGE_PROVEN` and is `BEHIND`. Eligible for **procedure proof**. Not current-`main` protection.

Before Z-Lifeboat may claim current canonical independent recovery, at least one independently custodied proven package should represent an acceptably current canonical state. The exact freshness window is **not** frozen here as an arbitrary commit/day count.

---

## 11. Copy identity and verification

Offline A and Offline B must preserve the exact bytes of the approved recovery artifact unless a separately governed encryption step transforms it.

Plaintext-copy mode: expected SHA-256 after copy equals source bundle SHA-256.

Future encrypted custody: ciphertext has its own distinct SHA-256. Never compare ciphertext hash to plaintext hash as if they should match.

Before copy: source exists; source SHA-256 matches canonical receipt; source state known; destination correct; capacity adequate; no conflicting artifact ID.

After copy: copy exists; byte size matches; SHA-256 matches expected source artifact where unencrypted; media operation reports success; copy can be read independently.

A successful copy command alone is insufficient.

---

## 12. Custody states

Copy-level candidate states:

- `OFFLINE_COPY_UNCREATED`
- `OFFLINE_COPY_CREATED`
- `OFFLINE_HASH_VERIFIED`
- `OFFLINE_MEDIA_VERIFIED`
- `OFFLINE_CUSTODY_VERIFIED`
- `OFFLINE_CUSTODY_DEGRADED`
- `OFFLINE_COPY_STALE`
- `OFFLINE_COPY_FAILED`
- `OFFLINE_COPY_MISSING`
- `UNKNOWN`

Pair-level candidate states:

- `DUAL_OFFLINE_UNPROVEN`
- `ONE_COPY_VERIFIED`
- `DUAL_OFFLINE_VERIFIED`
- `DUAL_OFFLINE_DEGRADED`
- `DUAL_OFFLINE_FAILED`

This spec remains `DUAL_OFFLINE_UNPROVEN`. Do not use organism-wide `RECOVERY_PROVEN` as a pair state.

---

## 13. Dual-offline success rule

Future `DUAL_OFFLINE_VERIFIED` requires at minimum:

- two distinct custody copies;
- both artifact identities known;
- both hashes verified;
- different relevant failure domains;
- neither depends on GitHub or R2 for existence;
- custody evidence recorded;
- copies are actually offline when not being serviced.

Two files on two partitions of one disk do **not** qualify.

Ladder (still not organism `RECOVERY_PROVEN`):

```text
RECOVERY_PACKAGE_PROVEN
        ↓
OFFLINE_A_CREATED
        ↓
OFFLINE_A_HASH_VERIFIED
        ↓
OFFLINE_B_CREATED
        ↓
OFFLINE_B_HASH_VERIFIED
        ↓
FAILURE_DOMAINS_VERIFIED
        ↓
DUAL_OFFLINE_VERIFIED
```

---

## 14. Encryption and key separation

The Pilot 1 bundle is unencrypted. Encryption and key custody remain `FUTURE_SECURITY_GATE`.

> A recovery key stored with its encrypted recovery artifact does not provide independent key custody.

If future Offline A/B contain encrypted artifacts, keys must be separately governed. This gate generates no keys, passwords, ciphertext, or example secrets.

---

## 15. Plaintext offline risk

Git bundle contents may include private repository material. Offline plaintext custody therefore has confidentiality consequences: physical loss/theft can expose source.

This spec does **not** make an unsupported blanket claim that encryption is already mandatory, nor that plaintext copy is already approved.

Unresolved for future execution: whether encryption must complete before the first physical copy. If later security/privacy doctrine requires encryption first, the copy gate must **HOLD** until that security gate is satisfied.

---

## 16. Media health and labeling

Future custody must not assume removable media remains healthy forever. Verification should include: readable filesystem; expected file present; expected size; SHA-256 recheck; device errors; SMART/device health where technically appropriate; safe eject/disconnect; periodic re-verification.

No media testing in this gate.

Future physical labels must be non-secret. Candidate fields: custody role (`OFFLINE_A` / `OFFLINE_B`); project/repository stable ID; artifact ID; bundle source short SHA; creation/custody date; classification; Steward label.

Do **not** place passwords, private keys, recovery secrets, or sensitive project content on an external label.

---

## 17. Custody receipt and private register

Future **Z-Dual Offline Custody Receipt** is `FUTURE_DECLARED`.

Candidate evidence: source artifact ID; source SHA-256; source commit; freshness state; Offline A custody ID and hash; Offline A failure-domain classification; Offline B custody ID and hash; Offline B failure-domain classification; physical-separation classification; encryption state; key-custody reference if applicable; verification timestamp; Steward disposition.

Canonical Git may prove that independent custody exists without publishing security-sensitive custody locations.

A private/offline custody register may be required later. It is **not** created here.

---

## 18. Loss, damage, and refresh

Offline A lost: pair becomes `DUAL_OFFLINE_DEGRADED`. Offline B must not automatically be moved or altered.

Offline B corrupted: same principle. Both missing: `DUAL_OFFLINE_FAILED`. Hash mismatch: affected copy `OFFLINE_COPY_FAILED`.

Do not overwrite evidence automatically. Do not repair silently. A replacement copy receives new custody evidence.

New recovery packages must not silently overwrite historical proven packages. Prefer lineage `artifact_v1 → superseded_by → artifact_v2`. Older proven packages may remain historical custody according to later retention doctrine.

Future refresh:

1. create/prove new package;
2. verify new artifact;
3. update one offline copy;
4. verify;
5. update second offline copy;
6. verify;
7. only then reconsider old artifact retention.

Avoid updating both offline copies simultaneously if that would temporarily destroy redundancy.

> Never intentionally place both independent recovery copies into an unverified state at the same time.

Preserve one known-good copy; update/verify the other; then update/verify the remaining copy.

---

## 19. Recovery drill relationship

Dual offline custody verifies package **survival**. It does not by itself prove that Offline A or B can restore a repository.

Distinguish `COPY HASH VERIFIED` from `RESTORE FROM OFFLINE MEDIA TESTED`.

No drill in this gate.

---

## 20. Organism-wide non-claim

Even after a future `DUAL_OFFLINE_VERIFIED`, do not automatically claim Z-Lifeboat `RECOVERY_PROVEN`. Remaining questions include key separation, manifest maturity, freshness, repeatable drills, project coverage, non-Git data, and workstation/environment recovery where relevant.

Dual offline custody is one subsystem proof.

---

## 21. Future execution gates

`Z-LIFEBOAT-DUAL-OFFLINE-CUSTODY-PILOT-1`: **CLOSED**. That future gate would authorize controlled creation of Offline A and Offline B for exactly one approved recovery artifact.

Two legitimate later paths must not be silently conflated:

- **Procedure proof:** Pilot 1 historical artifact may suffice to test whether Offline A/B mechanics work.
- **Current recovery protection:** create/prove a fresher package from then-current `main` first.

`Z-LIFEBOAT-GIT-BUNDLE-PILOT-2-CURRENT` is a `FUTURE_OPTION`, not authorized, not opened.

R2 remains **CLOSED**. Offline custody comes first. Future R2 is additive redundancy and must not replace Offline A/B.

---

## 22. Authority model

Distinguish: INSPECT, COPY, VERIFY, LABEL, DISCONNECT, REFRESH, DELETE, AUTHORIZE.

No AI automatically receives DELETE, media overwrite, secret/key access, custody-location disclosure, or AUTHORIZE.

Human Steward remains final authority.

---

## 23. Failure conditions

Future execution must STOP for: source hash mismatch; unknown source artifact; wrong destination media; destination collision; insufficient space; copy failure; destination hash mismatch; media read error; inability to establish failure-domain independence; unresolved privacy/security requirement; both copies sharing one material failure domain; custody location ambiguity; artifact freshness falsely represented.

No weakening of criteria to obtain GREEN.

---

## 24. This gate did not do

No USB, NAS, second-drive, or second-PC copy. No Offline A/B. No move or modification of the Pilot 1 bundle. No new Git bundle. No encryption, keys, passwords, or secrets. No R2. No workflows, registries, dashboards, or runtime mutation.
