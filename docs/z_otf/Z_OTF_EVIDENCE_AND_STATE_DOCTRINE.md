# Z-OTF — Evidence and State Doctrine

**Phase:** 0 · **Mutation class:** `DOCS_ONLY`
**Inherits:** [Z-PoT Constitution Spec 1](../Z_POT_PATTERNS_OF_TRUTH_CONSTITUTION_SPEC_1.md) · [Z-LIC Constitution Spec 1](../Z_LIC_LIVING_INTELLIGENCE_COMMONS_CONSTITUTION_SPEC_1.md) · [Z-SUSBV price and claim policy](../commercial/Z_SUSBV_PRICE_CLAIM_POLICY.md)

Core law:

> Evidence creates GREEN. GREEN never creates evidence.

Z-OTF adds no new epistemic authority. This document composes existing canonical distinctions into the operational dimensions a future product surface would need.

---

## 1. Why one colour is not enough

A single `20/20 GREEN` cannot safely describe content quality, factual truth, implementation, deployment, legal compliance, security, provenance, freshness and commercial authorization simultaneously.

Collapsing independent dimensions into one status is the failure mode that produced the quarantined claims in the [Meta Idea Reconciliation Ledger](Z_OTF_META_IDEA_RECONCILIATION_LEDGER.md). Z-OTF therefore keeps the dimensions independent.

---

## 2. Required dimensions

### 2.1 Epistemic and claim posture

Adopted **unchanged** from Z-PoT section 7:

- `KNOWN`
- `SUPPORTED`
- `LIKELY`
- `PLAUSIBLE`
- `MIXED`
- `DISPUTED`
- `UNVERIFIED`
- `CONTRADICTED`
- `UNKNOWN`

No arbitrary numerical truth score is authorized. Per Z-PoT section 8, constructs such as `truth_score: 91%` are prohibited as epistemic authority. Ordinal bands may be used only with written rationale, evidence provenance, contradiction state and explicit uncertainty. Operational percentages remain allowed where a real denominator exists, such as test pass rate or verification coverage, and operational health must never become claim authority.

`UNKNOWN` is a valid governed result.

### 2.2 Artifact implementation state

- `CONCEPT`
- `MOCK`
- `DOCUMENTED`
- `IMPLEMENTED`
- `TESTED`
- `DEPLOYED`
- `RETIRED`

Z-OTF as a whole is currently `DOCUMENTED` at Phase 0. Nothing in this lane is `IMPLEMENTED`.

### 2.3 Provenance state

- `SOURCE_MISSING`
- `SOURCE_PRESENT`
- `SOURCE_CHECKED`
- `MULTI_SOURCE_CHECKED`
- `PRIMARY_SOURCE_CONFIRMED`

### 2.4 Freshness state

- `CURRENT`
- `REVIEW_DUE`
- `STALE`
- `DATE_UNKNOWN`

Commercial and market freshness follows the existing ritual in [Quarterly Market and Facts Review](../QUARTERLY-MARKET-AND-FACTS-REVIEW.md).

### 2.5 Evidence custody state

- `LOCAL_ONLY`
- `GIT_CUSTODY`
- `REMOTE_REDUNDANT`
- `DUAL_CUSTODY`
- `CUSTODY_UNKNOWN`

Per Z-LIC section 27: custody is evidence redundancy, not evidence authority, and storage durability does not establish provenance.

### 2.6 Data processing mode

- `LOCAL_ONLY`
- `LOCAL_FIRST_SYNC`
- `CLOUD_PROCESSING_CONSENTED`
- `EXTERNAL_PROVIDER_REQUIRED`
- `DATA_MODE_UNKNOWN`

No blanket statement that data never leaves the device may be made unless the runtime provably operates in `LOCAL_ONLY`. Local-first is not local-only.

### 2.7 Authority state

- `OBSERVE_ONLY`
- `ADVISE_ONLY`
- `HUMAN_APPROVAL_REQUIRED`
- `AUTHORIZED_AUTOMATION`
- `PROHIBITED`

Bounded by the existing `docs/Z_AUTONOMY_LEVELS_POLICY.md` and `data/z_autonomy_task_policy.json`. Z-OTF creates no new autonomy ladder. Per Z-LIC section 25, systems may observe, suggest, challenge, and execute when authorized; they may not authorize.

### 2.8 Commercial state

- `IDEA`
- `EVIDENCE_COLLECTION`
- `HUMAN_REVIEW`
- `READY_FOR_QUOTE`
- `CONTRACTED`
- `LIVE`
- `SUSPENDED`

Z-SUSBV and [Commercial Readiness](../COMMERCIAL-READINESS.md) remain authoritative for commercial progression. Z-OTF renders; it does not decide.

---

## 3. CAAS quality rubric

CAAS may remain a four-part content review scored one to five: clarity, accuracy process, actionability, safety.

CAAS means **content quality review**. It does not mean verification.

These combinations are all valid and must remain expressible:

- `CAAS 20/20` with `CLAIM UNVERIFIED`
- `CAAS 18/20` with `PRIMARY_SOURCE_CONFIRMED`
- `CAAS 20/20` with `IMPLEMENTATION: CONCEPT`

`CAAS 20/20` must never automatically imply legally compliant, factually true, secure, insured, deployed, accredited or profitable.

---

## 4. Operational Provenance Record — future compatible

**Steward naming ruling, 2026-09-07:** the future Z-OTF artifact is an **Operational Provenance Record (`OPR`)**. It is not an "Evidence Receipt".

`Z-OTF OPR ≠ Z-Legal Evidence Core Evidence Receipt`

An OPR records operational provenance, work state, sources, timestamps, actors, custody and verification metadata. It does **not** automatically constitute legal evidence, legal admissibility, legal attestation, notarization, immutable proof, or an external timestamp authority.

A future Z-OTF OPR is **not authorized** by this document. Phase 6 remains CLOSED. The following records what an OPR would need, so that a later gate does not start from marketing language. No schema is created here.

Candidate fields: OPR identifier; artifact identifier and version; source identifiers; event timestamps; actor or signer key identifier; canonical payload digest; signature; privacy and redaction state; claim state; provenance state; freshness; related work or task identifier; verification method; independent checkpoint where available.

### 4.1 Cryptographic minimum

If later authorized: canonical serialization; SHA-256 or a stronger approved digest; a digital signature for origin and authenticity; a key rotation and revocation strategy; a documented verification procedure; and no secret or private data in a public receipt.

### 4.2 Distinctions that must never blur

- Base64 is not a hash.
- A hash is not a signature.
- A signature is not a timestamp authority.
- A timestamp is not independent notarization.
- A QR code is not evidence.
- A blockchain is not required.
- `immutable` may not be claimed unless the storage or anchoring model supports it.

### 4.3 Canonical serialization is not theoretical — observed evidence

The requirement for canonical serialization was demonstrated on the Phase 0 audit base rather than asserted.

`docs/governance/Z_SANCTUARY_UNIVERSE_CONSTITUTION_V1.md` was measured two ways:

| Measurement | Value |
| --- | --- |
| Git blob object identifier | `3b09157664b55f0d336ebe2dcb670df5d3afb228` |
| Blob byte length (line-feed endings) | 17290 |
| SHA-256 of blob bytes | `F0DA45CA35A81A88E93BB1C87C8BCAC97AA0CBB28E481D0ED9A12EE8200F1603` |
| Working-copy byte length on this Windows checkout | 17643 (353 carriage-return pairs) |
| SHA-256 of the working copy | `1C75AE5D6E8DDECF0A3CE9D125804E5B2E7B9940046AF688C58DEBAA48B66AEE` |

The content is identical. The digests are not, because line endings were normalized on checkout.

The blob-byte digest independently reproduces the value recorded in `docs/PHASE_Z_POT_CONSTITUTION_SPEC_1_GREEN_RECEIPT.md`, which confirms the repository's existing convention.

Rulings that follow:

1. The digest of a working file is **not** a stable evidence identifier across checkouts or platforms.
2. The canonical digest convention on this base is SHA-256 over git blob bytes; Z-OTF reuses it and invents nothing.
3. Any future OPR must state which byte sequence was hashed. A digest without a declared serialization is not evidence.

---

## 5. Public verification page rules

An unknown identifier must return `NOT FOUND / UNVERIFIED`. It must never fall back to a sample receipt.

Public pages must redact phone numbers, unnecessary email addresses, addresses, precise location data, payment processor private identifiers, internal URLs, confidential documents, secrets and customer data. Public evidence disclosure is minimum-necessary.

Existing reuse candidate for this discipline: `scripts/z_data_leak_detector.mjs` via `npm run security:data-leak-audit`.

---

## 6. Claim publication gate

Before public copy uses a factual or comparative claim, all of the following are required:

1. the exact claim text;
2. the source or sources;
3. the date checked;
4. the geography;
5. the population or sample if statistical;
6. the assumptions;
7. the contradictions and limitations;
8. the freshness interval;
9. Z-SUSBV review where the claim is commercial;
10. human approval where required.

If any element is missing, the claim state is:

`UNVERIFIED · DO NOT PUBLISH AS FACT`

Z-SUSBV price and claim policy adds the monetary rule: figures belong in human-reviewed sources and must cite a URL, a date, or an internal receipt identifier. Sensitive 14 DRP themes require a human gate before any public commercial claim.

---

## 7. Simulation-to-assertion guard

Every mock or demonstration surface must carry one of: `DEMO`, `SAMPLE DATA`, `SIMULATION`, `PLACEHOLDER`.

A mock may demonstrate a user experience. A mock may not prove customer adoption, revenue, uptime, compliance, insurance, accreditation, deployment or performance.

Reuse candidates rather than new invention: `docs/Z_PATTERN_SAFE_UNIVERSAL_PATTERN_SIMULATION.md` and `docs/Z_LEGAL_WORKSTATION_SIMULATION_MODE.md`.

---

## 8. Freeze list

Preserve these inequalities:

- `CAAS ≠ TRUTH`
- `HASH ≠ SIGNATURE`
- `CUSTODY ≠ AUTHORITY`
- `READINESS ≠ DEPLOYMENT`
- `ARCHITECTURE ≠ IMPLEMENTATION`
- `FEDERATION ≠ AUTHORITY`
- `OBSERVATION ≠ EXECUTION`
- `CAPABILITY ≠ AUTHORITY`
- `CONSENSUS ≠ TRUTH`
- `LOCAL-FIRST ≠ LOCAL-ONLY`
- `OPR ≠ LEGAL EVIDENCE`

---

## 9. Governing sentence

> Z-OTF is allowed to say "we do not know yet."
