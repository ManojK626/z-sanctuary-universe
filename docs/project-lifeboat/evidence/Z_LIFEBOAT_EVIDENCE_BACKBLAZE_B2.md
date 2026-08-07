# Evidence — Backblaze B2 (Phase 0 benchmark)

**Provider:** Backblaze B2 Cloud Storage
**Tier:** S
**Role:** Phase 0 **benchmark** — every later sheet asks *Can you beat B2?*
**Sheet status:** DRAFT (public research · not a purchase · not Wave 1B lock)
**Score date:** 2026-08-07
**Sources last checked:** 2026-08-07

**Parents:** [Matrix](../Z_LIFEBOAT_PROVIDER_COMPARISON_MATRIX.md) · [Cost projection](../Z_LIFEBOAT_20_YEAR_COST_PROJECTION.md) · [Success Criteria](../Z_PROJECT_LIFEBOAT_SUCCESS_CRITERIA.md)

**Does not:** create accounts · spend · upload · name Wave 1B

---

## Why B2 first

Not because B2 must win — because it gives an **objective bar**.

Later providers compete against this sheet’s dimensions, not against marketing pages.

---

## 1. Longevity

| Question | Evidence | Confidence |
| --- | --- | --- |
| Company history | Backblaze founded **2007**; B2 object storage is a long-running product line alongside consumer/business backup | med–high |
| Financial stability | **Public company** (NASDAQ: **BLZE**) — filings and market scrutiny exist (re-check 10-K/earnings before spend) | med |
| Enterprise / adoption | Positioned for NAS backup, S3-compatible apps, MSP/backup vendors; Synology/QNAP/TrueNAS docs and partner pages | med |
| Future outlook (10–20+) | Independent storage specialist with “no lock-in / S3-compatible” positioning; public status helps visibility — **no guarantee** of 2050 existence (same as any vendor) | med |

**Caveats:** Storage specialists can still be acquired, change pricing (e.g. historical move toward ~$6.95/TB), or shift product focus. Longevity score must stay honest — not romantic.

**Longevity provisional score:** **8 / 10**

---

## 2. Economics

| Item | Evidence (public snapshot) | Notes |
| --- | --- | --- |
| Storage | Published ~**$6.95 / TB / month** (~$0.00695/GB-mo); older materials cited $6/TB — **re-quote same day as any spend** | Prefer official pricing page at decision |
| API / transactions | Backblaze has moved toward **free Class A/B/C** for pay-as-you-go (verify current Class D / edge cases on transaction-pricing page) | Good for backup-tool chatter |
| Retrieval / egress | Free egress up to **~3×** average monthly storage; then **~$0.01/GB**; **unlimited free** egress via Bandwidth Alliance partners (e.g. Cloudflare) | Annual restore drills often fit free band |
| Hidden / mins | Marketing claims **no** min file size / min retention for standard B2 — still verify account terms | Contrast Wasabi fair-use |
| Growth (20y) | See cost projection: Seed/Working sizes are pocket-money; Estate/Legacy remain plausible vs hyperscalers | Inflation + price changes → Phase 4 annual review |

**Economics provisional score:** **9 / 10**

---

## 3. Security

| Feature | Present? | Evidence |
| --- | --- | --- |
| Client-side encryption | Yes (Lifeboat law) | Restic / Kopia / rclone crypt **before** upload — provider never sees plaintext if done correctly |
| Provider encryption / TLS | Yes (typical) | Confirm current docs at account time |
| MFA | Yes | Account MFA supported (enable before any production use) |
| Object Lock / immutability | Yes | Official Object Lock docs; retention up to long windows; enable carefully (cannot casually disable once on) |
| Versioning | Yes (bucket/object model) | Confirm with S3-compatible versioning behavior for chosen tool |
| Lifecycle policies | Yes | Lifecycle rules available — map to retention stewardship |
| Compliance certifications | Partial / evolving | Do **not** invent SOC/ISO claims — verify current trust/compliance page before relying for legal posture |

**Security provisional score:** **8 / 10**
*(Client encryption + Object Lock + MFA are strong; compliance claims need live verification.)*

---

## 4. Recovery

| Question | Evidence |
| --- | --- |
| Catastrophic restore path | Download via S3-compatible API / native API / CLI; restore with same client that wrote (Restic/Kopia/rclone) or Synology Hyper Backup restore |
| Tooling | Restic, Kopia, rclone, Hyper Backup (documented), many backup vendors |
| Speed / practicality | Bound by home uplink + 3× free egress math; full multi-TB restores need scheduling — **drill before crisis** |
| Lifeboat sizes | Seed/Working (≤500 GB): highly practical; Estate (5 TB): annual drill still feasible; XL needs plan |

**Recovery note (steward):** Recovery *difficulty* is mostly **key custody + tool familiarity + bandwidth**, not proprietary B2 format — if client-side open tools are used.

**Restore Confidence provisional score:** **9 / 10**

---

## 5. Exit strategy — Steward Exit Score

| Question | Evidence |
| --- | --- |
| Open standards / S3-compatible? | **Yes** — S3-Compatible API is a primary integration path |
| Proprietary format risk? | **Low** if Lifeboat stores **encrypted open-tool repositories** (Restic/Kopia) or portable archives — not B2-only UI blobs |
| Export / migrate without rebuild? | rclone / native copy to another S3 endpoint; Assisted migration offerings exist commercially |
| Metadata preservation? | Depends on tool (Restic/Kopia preserve their own metadata); avoid relying on provider-only UI tags as sole truth |
| Client encryption portable? | **Yes** — keys + repo format travel with the steward |

**Steward Exit Score:** **9 / 10**
*(Near-ideal for Era IV: leave without losing the organism — if we keep encryption and repo formats in our hands.)*

---

## 6. Synology integration

| Item | Evidence |
| --- | --- |
| Hyper Backup | Official Backblaze doc: Hyper Backup → **S3-Compatible** custom endpoint; keyID / applicationKey; signature v4 |
| S3 compatibility | First-class |
| Native / documented support | NAS solutions pages list Synology; community tutorials exist |
| Restore workflows | Hyper Backup restore path documented in vendor/community guides — **must be drilled on real NAS when hardware arrives** |

**Synology Ready provisional score:** **8 / 10**
*(Docs strong; live NAS drill still pending — hardware not yet the steward.)*

---

## Provisional score rollup (this sheet)

| Category | Score |
| --- | --- |
| Longevity | 8 |
| Economics (Lifetime Cost) | 9 |
| Security | 8 |
| Recovery (Restore Confidence) | 9 |
| Steward Exit | 9 |
| Synology Ready | 8 |

Aligned matrix also carries Automation / Governance / Scalability / Vendor Independence — see `data/z_lifeboat_provider_scores_v0.json`.

---

## Gaps to close before any spend

- [ ] Same-day screenshot/PDF of official pricing + transaction pages
- [ ] Confirm current compliance/trust certifications list
- [ ] Confirm Object Lock interaction with chosen backup tool
- [ ] Written key-ceremony plan (offline)
- [ ] Still **no** Wave 1B naming from this sheet alone

---

## Benchmark statement

```text
B2 is the Phase 0 benchmark.
It is not the Wave 1B destination until evidence across all sheets earns that claim.
Next sheet should open: Cloudflare R2 — "Can you beat B2?"
```

---

## Sources (public)

- https://www.backblaze.com/cloud-storage/pricing
- https://www.backblaze.com/cloud-storage/transaction-pricing
- https://www.backblaze.com/docs/cloud-storage-object-lock
- https://www.backblaze.com/docs/cloud-storage-integrate-synology-hyper-backup-with-backblaze-b2
- https://www.backblaze.com/cloud-storage/solutions/nas-backup
- Company public listing references (BLZE) — verify via official investor relations before relying

---

_Evidence draft · benchmark · care before binding_
