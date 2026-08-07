# Project Lifeboat — 20-Year Cost Projection

**Phase:** 0 — Research & Evidence  
**Date:** 2026-08-07  
**Currency:** USD list rates (convert to EUR at decision time)  
**Assumption class:** Order-of-magnitude stewardship planning — **not** a quote  

**Does not:** authorize spend · create accounts · lock a vendor  

---

## 1. Planning sizes

| Scenario | Steady-state stored data | Typical Lifeboat use |
| --- | --- | --- |
| S — Seed | 50 GB | Governance docs + Wave 1 stewardship core |
| M — Working | 500 GB | Hub + selected satellites + encrypted vaults policy packs |
| L — Estate | 5 TB | Multi-project archives + media-light vaults |
| XL — Legacy | 20 TB | Full multi-decade organism + NAS mirrors |

Encrypted engine overhead (dedup/compression) varies; projections use **gross stored** at the object store.

---

## 2. Unit rates used (Phase 0 snapshot)

| Provider | Storage / GB-mo | Egress model (stewardship archive) |
| --- | --- | --- |
| Backblaze B2 | $0.006 | Free ≤ ~3× stored/mo; rare full restore assumed within free band |
| Cloudflare R2 | $0.015 | Egress $0; API ops extra (small for cold archive) |
| Wasabi | $0.0069 | Included egress with fair-use — treat restore drills as careful |
| Hetzner Object | ~€5–9/TB-mo class | Use EU quote at decision; model ~$0.007–0.009/GB-mo for USD table |
| AWS S3 Standard | $0.023 | Egress often dominates — shown as caution |

GitHub: assume existing private-repo plan cost = **sunk / separate** (not double-counted as object storage).

---

## 3. Annual storage-only estimates (USD)

Formula: `size_GB × rate × 12`

| Size | B2 | R2 | Wasabi | S3 Standard (storage only) |
| --- | --- | --- | --- | --- |
| 50 GB | $3.60 | $9.00 | $4.14 | $13.80 |
| 500 GB | $36 | $90 | $41 | $138 |
| 5 TB (5120 GB) | $369 | $922 | $424 | $1,413 |
| 20 TB | $1,475 | $3,686 | $1,694 | $5,653 |

S3 **true** TCO with even modest egress is often several× storage — unsuitable as primary Lifeboat archive on a limited budget.

---

## 4. Twenty-year ownership (storage-only, undiscounted)

| Size | B2 (20y) | R2 (20y) | Wasabi (20y) | S3 storage-only (20y) |
| --- | --- | --- | --- | --- |
| 50 GB | ~$72 | ~$180 | ~$83 | ~$276 |
| 500 GB | ~$720 | ~$1,800 | ~$828 | ~$2,760 |
| 5 TB | ~$7,380 | ~$18,440 | ~$8,480 | ~$28,260 |
| 20 TB | ~$29,500 | ~$73,720 | ~$33,880 | ~$113,060 |

### Steward reading

- **Seed / Working (≤500 GB):** All Tier S/A options are **pocket-money** relative to decades of organism value.  
- **Estate (5 TB):** B2/Wasabi remain plausible; R2 still fine if egress certainty matters more than storage $/GB.  
- **Legacy (20 TB):** Prefer B2/Wasabi/Hetzner-class; re-evaluate every 3 years; consider dual-provider split.  

Inflation, price changes, and currency swings are **real** — Phase 4 annual cost review is mandatory.

---

## 5. Restore-drill cost buffer

Add a **contingency** for one full download every 3 years:

| Size | Rough egress risk if billed at $0.01/GB | R2 / Alliance-free path |
| --- | --- | --- |
| 500 GB | ~$5 per full pull | ~$0 egress |
| 5 TB | ~$50 per full pull | ~$0 egress |
| 20 TB | ~$200 per full pull | ~$0 egress |

B2 often covers this inside free egress multiples; confirm account rules at purchase time.

---

## 6. Non-storage costs (budget lines)

| Line | Notes |
| --- | --- |
| Client encryption tooling | Restic/Kopia/rclone — free/open |
| Synology hardware | Capital expense (Phase 3) — separate CAPEX decision |
| Synology C2 | Optional subscription if chosen later |
| Human time | Highest real cost — schedule annual drills |
| GitHub | Existing identity / private repo |

---

## 7. Dual-copy posture (recommended long-term)

Example sustainable pattern:

1. **Local steward:** Synology NAS (when present)  
2. **Independent cloud:** B2 **or** R2  

Cloud cost ≈ single-provider tables above. Local electricity/hardware amortized separately.

Avoid: PC + same OneDrive only; single USB drive as sole off-site; hyperscaler default without egress math.

---

## 8. Decision thresholds (AMK)

| If steward budget comfort is… | Prefer |
| --- | --- |
| Absolute minimum $/GB | Backblaze B2 (or Wasabi after fair-use read) |
| Zero-egress mental model | Cloudflare R2 |
| NAS-first after DiskStation | Synology C2 **plus** one independent Tier S |
| EU-hosted preference | Re-quote Hetzner in EUR before lock |

---

## 9. Re-verification rule

Before Phase 1 spend:

1. Open provider pricing page same day  
2. Recalculate table for chosen size  
3. Record screenshot/PDF receipt in stewardship notes (no secrets)  
4. Update `data/z_lifeboat_provider_scores_v0.json` cost fields  

---

_Projection v0 · sustainability over convenience · re-quote before euros_
