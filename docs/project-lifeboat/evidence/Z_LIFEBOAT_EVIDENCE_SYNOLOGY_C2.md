# Evidence — Synology C2 (vs B2 benchmark)

**Provider:** Synology C2 (OneStorage / Hyper Backup destination · Object Storage where noted)  
**Tier:** A  
**Role:** Framework **stress-test** — integrated hardware + cloud ecosystem (not B2 competitor-first)  
**Sheet status:** DRAFT COMPLETE (public research · provisional)  
**Score date:** 2026-08-07  
**Sources last checked:** 2026-08-07  
**Benchmark:** [Z_LIFEBOAT_EVIDENCE_BACKBLAZE_B2.md](Z_LIFEBOAT_EVIDENCE_BACKBLAZE_B2.md)  
**Charter:** [Z_SYNOLOGY_C2_RESEARCH_CHARTER.md](../Z_SYNOLOGY_C2_RESEARCH_CHARTER.md)  
**Pre-gate:** [Z_FRAMEWORK_REVIEW_0_PRE_C2.md](../Z_FRAMEWORK_REVIEW_0_PRE_C2.md) ✅ PASS  
**Board:** [Z_LIFEBOAT_EVIDENCE_BOARD.md](../Z_LIFEBOAT_EVIDENCE_BOARD.md)  
**Principle:** [Z_PROJECT_LIFEBOAT_GUIDING_PRINCIPLE.md](../Z_PROJECT_LIFEBOAT_GUIDING_PRINCIPLE.md)

**Does not:** create C2 accounts · spend · bind NAS · name Wave 1B  

**Ecosystem under review:** Synology NAS · DSM · Hyper Backup · hardware lifecycle · C2 OneStorage / Object Storage — not a logo.

---

## Research posture

> Can the evidence justify C2’s place in a 20–50 year stewardship architecture?

Not: *It’s Synology, therefore it must fit.*

C2’s job on the board: **stress-test** the framework against an appliance-tied philosophy — not to dethrone B2 as primary independent archive.

---

## 1. Stewardship Compatibility

| Question | Evidence | Confidence |
| --- | --- | --- |
| Designed for decades of operation? | Synology NAS line is long-lived in SMB/home; **C2 cloud portfolio is restructuring** (OneStorage consolidation Jun 2026; C2 Password/Transfer EOL paths) — hardware longevity ≠ cloud SKU stability | med |
| Can future stewards understand it? | Strong DSM docs + Hyper Backup UX; future steward still needs Synology literacy | med–high |
| Does it reduce operational complexity? | **Yes inside Synology** — native destination, fewer S3 endpoint steps | high |
| Does it encourage regular restore testing? | Web Hyper Backup Explorer / browser restore lowers friction vs opaque S3 archives — **encourages** browse/restore habits | med–high |

**Stewardship Compatibility provisional score:** **7 / 10**

---

## 2. Appliance Stewardship Score (NAS Companion)

| Dimension | Evidence |
| --- | --- |
| Hyper Backup seamlessness | Native C2 destination — often cited as easiest Synology offsite path |
| Recovery maturity | Hyper Backup + Explorer (web/PC); full NAS restore paths assume Synology DSM |
| Storage management transparency | Improving via OneStorage pool narrative; 2026 plan migration complexity for legacy users |
| Hardware replacement ease | Replace DiskStation → restore via Hyper Backup to new Synology; **brand-bound** |
| Recover without specialist knowledge? | Good for Synology-familiar stewards; weaker if successor is tool-agnostic only |

**Appliance Stewardship Score:** **9 / 10**

---

## 3. Steward Exit Score

> If Synology disappeared in 15 years…

| Question | Evidence |
| --- | --- |
| Migrate without proprietary dead-end? | Hyper Backup archives are **Synology-oriented**; C2 is Synology-account tied; not a clean open-tool repo like Restic→any S3 |
| Restore with open tools / portable archives? | Generally need Hyper Backup / Explorer — not rclone/Restic-native |
| Independent copy assumed? | Lifeboat architecture **should** keep B2/R2 (or open-tool) copy — C2 alone fails Exit |

**Steward Exit Score:** **4 / 10**  
*(Confirms matrix caution: high appliance fit · weak leave-without-ecosystem.)*

---

## 4. Cost Through Time

| Horizon | Evidence (public snapshot — re-quote before spend) |
| --- | --- |
| Year 1 | C2 OneStorage listed ~**$29.99/€29.99/yr for 300 GB**; ~**$77.99/€77.99 per TB/yr** (1–200 TB); monthly ~$7.99/TB — plus **NAS hardware CAPEX** |
| Year 5–10 | Subscription + hardware refresh cycles; 2026 consolidation shows **pricing/SKU can change** |
| Year 20–30 | Cloud plan volatility + DiskStation generations — budget for both |
| vs B2 | B2 ~$6–7/TB-mo (~$72–84/TB-yr) without requiring Synology hardware; C2 annual $/TB can look close on paper but **ecosystem TCO** includes NAS |

**Economics / Lifetime Cost provisional score:** **5 / 10**  
*(Acceptable as companion convenience; poor as sole mass archive on independence + CAPEX.)*

---

## 5. Recovery Confidence (under stress)

| Stress | Recoverable? | Notes |
| --- | --- | --- |
| Hardware failure | **Yes** (within Synology) | New NAS + Hyper Backup restore — brand path |
| Accidental deletion | **Yes** | Versions / Explorer restore |
| Ransomware | **Partial → Yes** | Client-side encryption + versions; Object Lock on Object Storage — verify SKU; still need immutable independent copy for strong posture |
| Loss of one administrator | **Partial** | Synology account + encryption password + DSM knowledge — ceremony critical |

**Restore Confidence provisional score:** **7 / 10** *(strong in-ecosystem; weaker as sole civilization-scale Exit)*

---

## Standard categories (rollup)

| Category | Score | Note |
| --- | --- | --- |
| Longevity | 7 | Company/NAS strong; C2 SKU churn in 2026 |
| Security | 7 | MFA · encryption · object lock (Object Storage) — verify live |
| Synology Ready | 10 | Native |
| Automation | 9 | Hyper Backup schedules |
| Governance Fit | 6 | Good ops UX; weaker independent receipts than open-tool+S3 |
| Scalability | 7 | OneStorage to high TB; Synology-only clients |
| Steward Exit | 4 | See above |
| Lifetime Cost | 5 | See above |
| Restore Confidence | 7 | See above |
| Vendor Independence | 4 | Aligns with Exit |

**Composite (approx, ten-cat style):** ~**6.6 / 10** (provisional)

---

## Beat-B2 verdict

| Dimension | vs B2 | Why |
| --- | --- | --- |
| Longevity | Equal / slight worse | Cloud SKU restructuring vs B2 focus |
| Economics | Worse (ecosystem TCO) | Hardware + plan volatility |
| Security | Equal-ish | Both solid with caveats |
| Recovery | Worse as independent; Better in-DSM | Explorer UX vs open S3 tooling |
| Steward Exit | **Worse** | Proprietary path |
| Appliance Stewardship | **Better** | Native companion |

**Overall (primary object archive):** **No** — does not beat B2 as sole primary.  
**Overall (NAS companion seat):** **Yes (Partial)** — earns a **companion** seat beside independent archive (B2/R2/open-tool), **based on current evidence**.

```text
C2 does not replace B2 as independent primary archive.
C2 stress-tests Lifeboat successfully as hardware+cloud philosophy.
Recommended posture: NAS local steward + independent off-site (B2-class);
                 C2 optional convenience layer — never sole off-site.
```

---

## Evidence Confidence

| Check | Status |
| --- | --- |
| Sources dated | 2026-08-07 |
| OneStorage pricing cited | Yes — re-verify same day before spend |
| Exit weakness documented | Yes |
| Wave 1B named? | **No** |

**Evidence Confidence:** med — enough for board position; live NAS drill still pending hardware.

---

## Sources (public)

- https://c2.synology.com/pricing/onestorage  
- https://nascompares.com/2026/05/25/synologys-c2-and-license-changes-explained/  
- https://www.blackvoid.club/synology-c2-cloud-service-changes-for-2026/  
- Field guides: Hyper Backup ↔ C2 vs B2 (WunderTech, Need to Know IT, etc.) — secondary  

---

_Evidence draft · stress-test passed · companion not primary · framework decided_
