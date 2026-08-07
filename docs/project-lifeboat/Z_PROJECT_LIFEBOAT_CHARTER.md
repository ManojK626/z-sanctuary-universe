# Project Lifeboat Charter

**Full name:** Z-Sanctuary Preservation & Continuity Initiative
**Horizon:** 2026 → 2050+
**Class:** Era IV Stewardship Initiative
**Authority:** AMK-Goku (human steward)
**Status:** ✅ CHARTERED — Phase 0 Research & Evidence
**Date:** 2026-08-07

**Does not:** open a fifth Book · amend Constitutional Reference Editions · authorize spend · invent Wave 1B path · deploy · bind Cloudflare production · mutate NAS

---

## 1. Mission

> Ensure the Z-Sanctuary Universe can survive hardware failure, cloud provider changes, financial hardship, and the passage of decades.

Preservation here means **restore confidence under stress**, not “files exist somewhere.”

---

## 2. Why this is not a Book

| Books A / B | Project Lifeboat |
| --- | --- |
| Constitutional identity & principles | Continuity operations & evidence |
| Cite-only Reference Editions | Living research → prototype → drills |
| Answers *what the organism must be* | Answers *how it remains alive* |

Era IV already sealed the architectural identity of Stewardship. Lifeboat is the **long-horizon preservation program** under that identity — strengthen > complexity; no Book C unless constitutional need appears.

---

## 3. Scope

### In scope

- Off-site independent archives (encrypted)
- Provider research, cost sustainability, migration readiness
- Restore testing and disaster-recovery drills
- Future Synology NAS as **local steward** (when hardware arrives)
- GitHub as constitution & source-history vault (already primary for code)
- Stewardship Certificates and receipt culture

### Out of scope (until separately gated)

- Payment rails, commercial product hosting
- Public NAS exposure / RDP without charter
- Silent full-tree dumps of personal vaults
- Auto-execution of Cycle Observe queue items
- Binding production Cloudflare Workers/R2 for app runtime “because we can”

R2 (or similar) may later serve as a **preservation destination** under Lifeboat — that is not a production deploy of the hub.

---

## 4. Stewardship principles (decision law)

1. **Evidence over assumptions** — scores require dated sources or are marked provisional.
2. **Restore over backup** — a copy without a restore drill is incomplete.
3. **Encryption before upload** — client-side encryption (Restic / Kopia / rclone crypt) before off-site.
4. **Multiple independent copies** — avoid single-provider or single-drive fate.
5. **Open standards over vendor lock-in** — prefer S3-compatible / portable formats.
6. **Sustainability over short-term convenience** — 20–50 year cost must remain thinkable on a limited budget.

---

## 5. Evaluation categories (Phase 0)

Every candidate provider is scored **0–10** on:

| Category | Why it matters |
| --- | --- |
| Lifetime Cost | Sustainable for 20–50 years on a limited budget |
| Security | Encryption support, access controls, MFA, auditability |
| Longevity | Financial stability and long-term market presence |
| Vendor Independence | Ease of migrating away |
| Restore Confidence | Reliable recovery and restore testing |
| Synology Ready | Smooth integration with future NAS |
| Automation | Restic, Kopia, rclone, Hyper Backup, etc. |
| Governance Fit | Receipts, versioning, stewardship principles |
| Scalability | Few GB → many TB over decades |
| **Steward Exit** | Leave without losing the organism (open standards · S3 · portable encryption · easy export) |

Full matrix: [Z_LIFEBOAT_PROVIDER_COMPARISON_MATRIX.md](Z_LIFEBOAT_PROVIDER_COMPARISON_MATRIX.md)
B2 benchmark evidence: [evidence/Z_LIFEBOAT_EVIDENCE_BACKBLAZE_B2.md](evidence/Z_LIFEBOAT_EVIDENCE_BACKBLAZE_B2.md)

---

## 6. Candidate tiers (research set)

| Tier | Candidates |
| --- | --- |
| **S** | GitHub (code & constitution) · Cloudflare R2 · Backblaze B2 |
| **A** | Wasabi · Synology C2 · Hetzner Object Storage · iDrive e2 · Storj |
| **B** | AWS S3 · Google Cloud Storage · Azure Blob · OVHcloud Object Storage |

Promising new entrants stay watchlisted — a 20–50 year strategy must remain adaptable.

---

## 7. Research roadmap

| Phase | Name | Outcome |
| --- | --- | --- |
| **0** | Market Research | Provider / price / durability / security / restore comparison (**this charter**) |
| **1** | Prototype | One encrypted archive · upload · checksum · full restore test |
| **2** | Wave 1B | Independent destination selected · first preservation certificate earned |
| **3** | NAS Integration | Synology · automated encrypted backups · scheduled restore verification |
| **4** | 20+ Year Stewardship | Annual health · cost · migration readiness · DR drills |

Phase advance requires **AMK gate**. Cursor may prepare evidence; Cursor must not spend, create accounts, or upload without explicit approval.

---

## 8. Target architecture (summary)

```text
GitHub (Constitution & Source History)
        │
        ▼
Encrypted Backup Engine (Restic / Kopia / rclone crypt)
        │
        ▼
Backblaze B2 or Cloudflare R2 (Independent Off-site Archive)
        │
        ▼
Future Synology NAS (Primary Local Steward)
        │
        ▼
Local Development PC (builder node — not master)
```

Design intent:

- **PC** is no longer the master of fate
- **NAS** becomes local steward (when present)
- **Cloud** is independent preservation
- **GitHub** preserves living history

Detail: [Z_SANCTUARY_PRESERVATION_ARCHITECTURE.md](Z_SANCTUARY_PRESERVATION_ARCHITECTURE.md)

---

## 9. Success metrics (Era IV quiet style)

| Metric | Signal |
| --- | --- |
| Restore drill pass rate | Last successful full/sample restore date |
| Independent copies | Count of physically/logically independent stores ≥ 2 |
| Certificate maturity | Wave 1A → Wave 1B `VERIFIED_OFF_PC` / `COMPLETE` |
| Cost headroom | Projected 20-year spend within steward-accepted band |
| Migration rehearsal | Documented exit path tested at least once per 3 years |

---

## 10. Sacred gates

- No auto-merge · no auto-deploy
- No unsolicited external connections
- Merge, deploy, payment, legal/pricing public copy, bulk user-data actions → **AMK-Goku** consent
- Wave 1B destination path → **AMK-named** only

---

## 11. Package map

See [README.md](README.md). Finish line: [Z_PROJECT_LIFEBOAT_SUCCESS_CRITERIA.md](Z_PROJECT_LIFEBOAT_SUCCESS_CRITERIA.md).

---

_Chartered · Era IV · evidence before euros · restore before claims_
