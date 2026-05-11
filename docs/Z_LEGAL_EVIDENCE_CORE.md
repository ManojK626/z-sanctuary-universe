# Z-LEGAL-OPS-1 — Z-Legal Evidence Core

Formal ID: **Z-LEGAL-OPS-1** (layer: `z_legal_evidence_core`).

## Purpose

Define a **proof-first legal evidence concept** for Z-Sanctuary where AI can organize evidence and draft summaries while humans control sharing and legal professionals provide legal advice.

Phase 1 scope is **docs + registry + policy + read-only reports** only.

## What this layer includes

- Ecosystem map and module inventory references.
- Evidence receipt map (commands run, generated reports, registry links).
- Risk-gate framing (RED/BLUE/YELLOW/GREEN).
- Damage/invoice checklist concept fields (metadata only).
- Export packet concept for manual human review.

## What this layer does not include

- Client data intake forms.
- Evidence upload runtime.
- Court filing automation.
- Email sending or legal correspondence automation.
- Payment activation.
- Live legal advice chatbot behavior.
- Public launch claims.

## Legal boundary

```text
AI evidence summary ≠ legal advice.
Lawyer dashboard ≠ lawyer endorsement.
Legal circle ≠ runtime authority.
```

## Data and privacy posture (Phase 1)

This phase keeps a concept-only posture aligned with privacy-by-design principles:

- data minimization
- transparency
- human-controlled sharing
- accountability through receipts

No privileged client repository or SAR automation is introduced here.

## Relation to Z-LEGAL-PRODUCT-OPS-1

This core now feeds a wider legal-product workstation posture where AI/software evidence is reviewed alongside physical product, IP, safety, and supplier-contract governance — still read-only in this phase. See [Z_LEGAL_PRODUCT_IP_COMPLIANCE_WORKSTATION.md](Z_LEGAL_PRODUCT_IP_COMPLIANCE_WORKSTATION.md).
