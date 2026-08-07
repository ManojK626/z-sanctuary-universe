# Evidence — Cloudflare R2 (vs B2 benchmark)

**Provider:** Cloudflare R2  
**Tier:** S  
**Role:** Phase 0 challenger — must answer *Can you beat B2?*  
**Sheet status:** DRAFT (public research · not a purchase · not Wave 1B lock)  
**Score date:** 2026-08-07  
**Sources last checked:** 2026-08-07  
**Benchmark:** [Z_LIFEBOAT_EVIDENCE_BACKBLAZE_B2.md](Z_LIFEBOAT_EVIDENCE_BACKBLAZE_B2.md)

**Parents:** [Matrix](../Z_LIFEBOAT_PROVIDER_COMPARISON_MATRIX.md) · [Cost projection](../Z_LIFEBOAT_20_YEAR_COST_PROJECTION.md)

**Does not:** create R2 buckets · API tokens · spend · upload · bind production Workers · name Wave 1B  

**Governance care:** R2-as-**archive** ≠ Cloudflare **production** deploy. Hub HOLD on production CF remains in force.

---

## 1. Longevity

| Question | Evidence | Confidence |
| --- | --- | --- |
| Company history | Cloudflare is a major global edge/network company; R2 is a strategic object-storage product on that platform | med–high |
| Financial stability | Large public company (NET) — deeper capital base than a storage specialist; R2 is one product line among many | med–high |
| Enterprise / adoption | Strong developer / edge adoption; S3-compatible migration narrative; less “NAS backup specialist” branding than B2 | med |
| Future outlook (10–20+) | Cloudflare longevity looks strong; **product** priority of R2 vs other lines should be re-checked over decades | med |

**Longevity provisional score:** **9 / 10** *(company stronger than B2; product-line risk remains)*

---

## 2. Economics

| Item | Evidence (public snapshot) | Notes |
| --- | --- | --- |
| Storage | Standard **~$0.015/GB-mo** (~$15/TB); Infrequent Access **~$0.01/GB-mo** (+ retrieval fee) | ~2×+ B2 storage $/TB |
| API / transactions | Class A / Class B **metered** (e.g. ~$4.50 / $0.36 per million on Standard — verify live docs) | Backup tools that list/chatty may add cost |
| Retrieval / egress | **Egress free** (permanent product claim) | Beats B2 on unpredictable restore bandwidth |
| Hidden / mins | Free tier (e.g. 10 GB-mo class — verify); IA retrieval fees if that class used | Prefer Standard for rare stewardship drills unless modeled |
| Growth (20y) | Seed/Working still cheap; Estate/Legacy **more expensive storage** than B2; egress certainty helps XL restores | See cost projection |

**Economics provisional score:** **7 / 10** *(loses on $/TB; wins on egress predictability)*

---

## 3. Security

| Feature | Present? | Evidence |
| --- | --- | --- |
| Client-side encryption | Yes (Lifeboat law) | Restic / Kopia / rclone crypt before upload |
| Provider encryption / TLS | Yes | At-rest / TLS per CF docs |
| MFA | Yes (account) | Cloudflare account MFA — enable before any use |
| Object Lock / immutability | **Partial / weaker than B2 for classic S3 Object Lock** | Official S3 API matrix shows Object Lock headers **not** supported; **Bucket locks** exist (retention rules) — not a drop-in for all Hyper Backup Object Lock flows |
| Versioning | Yes | Available — important if Object Lock incomplete |
| Lifecycle policies | Basic | IA transition / expiration — verify |
| Compliance certifications | Evolving | Do not invent; verify Cloudflare trust/compliance pages before legal reliance |

**Security provisional score:** **7 / 10** *(solid baseline; immutability story weaker than B2 Object Lock for ransomware-resistant NAS patterns)*

---

## 4. Recovery

| Question | Evidence |
| --- | --- |
| Catastrophic restore path | S3-compatible endpoint `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`; Restic/Kopia/rclone well documented in community |
| Tooling | Strong for open tools; **weaker** for turnkey Synology Hyper Backup vs B2 |
| Speed / practicality | Zero egress removes bill shock on full pulls; still limited by home downlink |
| Lifeboat sizes | Excellent mental model for annual full restore drills (cost predictability) |

**Restore Confidence provisional score:** **8 / 10** *(tooling strong; NAS-native path less mature than B2)*

---

## 5. Exit strategy — Steward Exit Score

| Question | Evidence |
| --- | --- |
| Open standards / S3-compatible? | **Yes** — primary migration story |
| Proprietary format risk? | **Low** with Restic/Kopia client repos |
| Export / migrate without rebuild? | rclone / S3 copy; CF also markets migration/pull patterns |
| Metadata preservation? | Tool-dependent (same as B2) |
| Client encryption portable? | **Yes** |

**Steward Exit Score:** **9 / 10** *(equal to B2 on open-tool spine)*

---

## 6. Synology integration

| Item | Evidence |
| --- | --- |
| Hyper Backup | No first-class “R2” connector; **custom S3 endpoint** — more friction; firmware/version caveats reported in field write-ups |
| S3 compatibility | Yes |
| Native / documented support | Weaker than B2’s official Hyper Backup guide |
| Restore workflows | Prefer rclone/Restic on NAS or PC; Hyper Backup Object Lock features may not map cleanly |

**Synology Ready provisional score:** **5 / 10**

---

## Provisional score rollup

| Category | R2 | B2 (benchmark) | Beat B2? |
| --- | --- | --- | --- |
| Longevity | 9 | 8 | **Better** |
| Economics | 7 | 9 | Worse ($/TB) |
| Security | 7 | 8 | Worse (Object Lock / immutability) |
| Recovery | 8 | 9 | Slightly worse (NAS path) |
| Steward Exit | 9 | 9 | Equal |
| Synology Ready | 5 | 8 | Worse |

---

## Beat-B2 verdict

| Dimension | Better / Equal / Worse | Why |
| --- | --- | --- |
| Longevity | Better | Cloudflare corporate depth |
| Economics | Worse | Higher storage $/TB; API fees; wins on egress |
| Security | Worse | Classic S3 Object Lock gap vs B2 |
| Recovery | Worse / mixed | Great egress; weaker NAS-native restore story |
| Steward Exit | Equal | S3 + client encryption |
| Synology | Worse | Custom S3 friction |

**Overall: Does R2 beat B2 for Lifeboat primary off-site?** **No — not as sole primary** on current evidence.

**Partial win:** R2 is a **strong secondary / egress-certain** archive and an excellent **migration/exit target**. Pairing patterns (e.g. B2 primary + R2 copy later) remain open — still **no destination named**.

```text
B2 remains the Phase 0 benchmark leader for Lifeboat primary off-site.
R2 does not dethrone B2 on total stewardship fit (cost + Synology + Object Lock).
R2 beats B2 on: corporate longevity signal + egress predictability.
Next sheet: Synology C2 (NAS-relevant) — still Can you beat B2?
```

---

## Evidence Confidence (manual)

| Check | Status |
| --- | --- |
| Sources dated same week | Yes (2026-08-07) |
| Official pricing page cited | Yes — re-open same day before spend |
| Object Lock nuance documented | Yes — bucket locks ≠ full S3 Object Lock |
| Gaps listed | Synology live drill · compliance list · IA cost model |
| Wave 1B named from this sheet? | **No** |

**Evidence Confidence:** **med–high** for research; **not** spend-ready without same-day re-verify.

---

## Sources (public)

- https://developers.cloudflare.com/r2/pricing/  
- https://developers.cloudflare.com/r2/api/s3/api/  
- https://developers.cloudflare.com/r2/buckets/bucket-locks/  
- https://www.cloudflare.com/developer-platform/products/r2/  
- Field comparisons (NAS / Hyper Backup / Object Lock) — treat as secondary; confirm on live DSM when NAS arrives  

---

_Evidence draft · challenger · B2 still benchmark · no accounts created_
