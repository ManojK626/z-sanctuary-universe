# Z-OTF — Architecture and Phase Roadmap

**Phase:** 0 · **Mutation class:** `DOCS_ONLY`

All phases after 0 are **CLOSED** until separately authorized by the Steward. Completion of one phase does not authorize the next.

---

## 1. High-level architecture

Z-OTF composes existing Z-Sanctuary capabilities. It does not copy them.

```text
Human / Business Surface
        |
        v
Z-OTF Operational Composition
  | communications
  | tasks and workflows
  | knowledge requests
  | OPR requests
  | feedback
        |
        +-------------------------+
        |                         |
        v                         v
Existing Z-Sanctuary         Product-specific
governed capabilities        adapters (future)
        |
        +-- Z-PoT epistemic distinctions and truth states
        +-- Z-LIC learning and evolution governance
        +-- Z-SUSBV commercial evidence and claim policy
        +-- entitlement and pricing policy, entitlement catalog
        +-- autonomy levels policy and task policy
        +-- Traffic MiniBots, SLO guard, indicators
        +-- cross-project capability index, ecosystem awareness spine
        +-- green receipts, reconciliation, Lifeboat custody
        +-- Z-XBUS external connector gate
        +-- dashboard registry and observatory surfaces
```

Z-OTF is a consumer and composer of these contracts. Located paths for each are recorded in the [Reuse and Overlap Matrix](Z_OTF_REUSE_AND_OVERLAP_MATRIX.md).

---

## 2. Phase ladder

| Phase | Name | State | Main output |
| --- | --- | --- | --- |
| 0 | Identity and Reconciliation | **this surface** | identity freeze, reuse matrix, idea ledger, evidence doctrine, brand hold, receipt |
| 0.5 | Sanctuary Citizenship | CLOSED | registry and project identity, only if approved |
| 1 | Evidence Contract Compatibility | CLOSED | receipt and provenance contract, reuse-first |
| 2 | Operational Domain Model | CLOSED | task, message, party and artifact model |
| 3 | Local Knowledge Interface | CLOSED | honest data modes with citations |
| 4 | Human-Approved Communication Workflows | CLOSED | drafts, quick replies, approvals |
| 5 | Commercial Evidence View | CLOSED | Z-SUSBV-backed comparator and readiness interface |
| 6 | Operational Provenance Records | CLOSED | cryptographic OPR minimum viable product; not legal evidence |
| 7 | Multi-Party Role Model | CLOSED | server-enforced access model |
| 8 | Feedback and Learning | CLOSED | Z-LIC-compatible learning proposals |
| 9 | Academy and Knowledge Delivery | CLOSED | educational content and completion receipts |
| 10 | External Provider Adapters | CLOSED | one provider per gate, through Z-XBUS |
| 11 | Tax and Compliance Decision Support | CLOSED | professional-review support, never auto-advice |
| 12 | Dashboard Integration | CLOSED | consume the existing observatory roof |
| 13 | Controlled Pilot | CLOSED | real user evidence |
| 14 | Commercial Release Gate | CLOSED | human commercial approval |
| 15 | Separate Deployment and Repository Review | CLOSED | decide whether an independent product repository is justified |

---

## 3. Phase 1 — evidence compatibility

Do not invent a ledger first.

First inspect the current green receipt structure, Lifeboat custody receipts, existing registry identities, provenance fields in `config/provenance_manifest.json` and `scripts/z_provenance_check.mjs`, the digest conventions already used in `exports/trust_pack_*/verification/`, any canonical signature or attestation conventions, Z-PoT evidence categories, and the receipt language already present in `docs/Z_LEGAL_EVIDENCE_CORE.md`.

The last item is a recorded `POSSIBLE_OVERLAP_REVIEW`. Naming is resolved: Z-OTF uses Operational Provenance Record (`OPR`), not "Evidence Receipt". Phase 1 remains a separately authorized compatibility review with Z-Legal Evidence Core before any schema.

Only after a written gap report may Z-OTF propose missing OPR fields.

## 4. Phase 2 — operational domain model

Candidate entities: `Party`, `Organization`, `Role`, `Conversation`, `Message`, `WorkItem`, `Artifact`, `Claim`, `EvidenceReference`, `OperationalProvenanceRecord`, `Feedback`, `Entitlement`, `ProviderAdapter`.

No database technology may be selected until the model and its privacy requirements are frozen. `docs/Z_IDE_FUSION_WORKFLOW_CONTROL.md` is a recorded overlap candidate for the work-item concept and must be reviewed first.

---

## 5. Phase 3 — local knowledge

Minimum truthfulness requirement: every session and action visibly declares its data mode, source scope, citation availability, external providers involved, sync state and freshness.

No blanket statement that data never leaves the device unless the runtime provably operates in `LOCAL_ONLY`.

Reuse candidates to examine first: `docs/orchestration/ZUNO_MEMORY_KNOWLEDGE_LAYER.md` and `docs/Z_MU_CIVIC_KNOWLEDGE_ADVISOR.md`.

---

## 6. Phase 4 — communications

Start manual and human-approved: draft reply, quick reply, translation, frequently asked question lookup, source-linked answer, handoff to a human.

External automated messaging is a later adapter gate. No autonomous prospect scraping or outreach is permitted by default.

Existing communication policy and spine surfaces are consumed rather than replaced.

---

## 7. Phase 5 — commercial evidence

Z-OTF may render a comparison interface, but the benchmark registry remains evidence-backed, sources and dates stay visible, stale entries are flagged, and price, cost and claims pass existing commercial doctrine. No superiority claim without evidence.

Z-SUSBV remains the evidence authority for commercial comparison.

---

## 8. Phase 6 — Operational Provenance Records

Success at this phase is not "blockchain" and is not legal evidence.

Success is a deterministic canonical payload, a declared digest, an identified signer, a documented verification procedure, privacy-aware disclosure, correct not-found behaviour, defined custody, and reproducible replay.

An OPR remains operational provenance. Compatibility with `docs/Z_LEGAL_EVIDENCE_CORE.md` is not implied.

The serialization discipline is already evidenced in [Evidence and State Doctrine](Z_OTF_EVIDENCE_AND_STATE_DOCTRINE.md) section 4.3. Independent anchoring may be evaluated later and is not implied. No hashing engine is authorized by Phase 0.

---

## 9. Phase 7 — multi-party access

Role-based interfaces are not security unless enforced server-side.

Future access control must derive role from authenticated authorization, enforce data access server-side, log security-relevant changes, support least privilege, and separate customer, supplier and business data.

A role switcher used for demonstration must be labelled `DEMO`.

---

## 10. Phase 8 — learning

Feedback may identify confusion, suggest improved content, propose workflow changes and detect recurring failure.

Feedback may not silently broaden autonomy, rewrite law or policy, alter prices, redefine truth, or promote a minibot's authority. Per Z-LIC, no intelligence may infer permission from competence.

Human approval remains the authority boundary.

---

## 11. Phase 9 — academy

An academy may issue a `Certificate of Completion` recording course version, completion criteria, issue date, verification URL and issuer identity.

It must never be represented as government or professional accreditation without a real accrediting relationship.

---

## 12. Phase 10 — external adapters, one gate at a time

Candidates include messaging providers, mail, collaboration tools, payment providers, maps and media storage.

Each requires a stated purpose, data flow, privacy assessment, permissions, error behaviour, consent model, provider terms review, incident plan and rollback.

Every adapter passes the existing Z-XBUS external connector gate: `docs/Z_XBUS_EXTERNAL_CONNECTOR_GATE.md`, `docs/Z_XBUS_CONNECTOR_SECURITY_POLICY.md`, `data/z_xbus_connector_registry.json`. Z-OTF does not build a parallel gate.

No "all integrations connected" mock state may ever appear in production.

---

## 13. Phase 11 — tax and compliance

Treated as high-risk decision support.

Requirements before any implementation: authoritative jurisdiction sources; service and product classification; seller legal entity; buyer location and status; registration status; VAT, GST or sales-tax treatment; a professional review path; effective dates; and change monitoring.

Output prefers `REVIEW REQUIRED` over fabricated certainty.

---

## 14. Phase 15 — separate repository review

A separate repository becomes reasonable only once the product has stable contracts, a distinct runtime, distinct secrets, real users, a separate release cadence, clear custody and recovery, a clear commercial identity, an approved public brand, and a strong reason not to remain a Sanctuary module.

Until then, Z-OTF remains inside Z-Sanctuary Universe.
