# Project Lifeboat — Global Provider Comparison Matrix

**Phase:** 0 — Research & Evidence  
**Score date:** 2026-08-07  
**Authority:** Research draft for AMK review — **not** a purchase order  
**Machine scores:** `data/z_lifeboat_provider_scores_v0.json`  

**Law:** Scores are **provisional**. They combine public pricing snapshots (2026 research), known S3-compatibility, Synology ecosystem fit, and Z-Sanctuary governance fit. Re-score before any spend.

---

## Scoring scale

| Score | Meaning |
| --- | --- |
| 9–10 | Strong fit for Lifeboat principles |
| 7–8 | Good with manageable caveats |
| 5–6 | Usable; trade-offs material |
| 3–4 | Weak for long stewardship / cost |
| 0–2 | Poor fit for this initiative |

Categories (each 0–10): Lifetime Cost · Security · Longevity · Vendor Independence · Restore Confidence · Synology Ready · Automation · Governance Fit · Scalability  

**Composite** = arithmetic mean of the nine categories (rounded to 1 decimal).

---

## Tier S — primary research focus

| Provider | Role in architecture | Cost | Sec | Lon | Ind | Rest | Syn | Auto | Gov | Scale | Composite |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GitHub | Constitution & source history | 8 | 8 | 9 | 6 | 8 | 4 | 7 | 10 | 7 | **7.4** |
| Cloudflare R2 | Independent object archive | 7 | 8 | 8 | 8 | 8 | 6 | 9 | 8 | 9 | **7.9** |
| Backblaze B2 | Independent object archive | 9 | 8 | 8 | 9 | 9 | 8 | 9 | 8 | 9 | **8.6** |

### Notes (Tier S)

| Provider | Evidence notes | Caveats |
| --- | --- | --- |
| GitHub | Already hub of living history; private repo + PR gates | Not bulk object backup; not Synology Hyper Backup target |
| Cloudflare R2 | ~$0.015/GB-mo storage; **egress free**; S3-compatible API | API operation fees; stewardship must not confuse R2-archive with production Workers deploy |
| Backblaze B2 | ~$0.006–$0.00695/GB-mo; egress free ≤3× storage (or via Bandwidth Alliance) | Confirm Synology Hyper Backup / Restic path on chosen SKU |

**Phase 0 research order (not a lock):** Backblaze B2 → Cloudflare R2 → Synology C2 → then Hetzner · iDrive e2 · Storj · Wasabi · hyperscalers · OVH. Wave 1B destination is **not named** until evidence earns it. See matrix evaluation order + [Success Criteria](Z_PROJECT_LIFEBOAT_SUCCESS_CRITERIA.md).

---

## Tier A — strong alternatives

| Provider | Cost | Sec | Lon | Ind | Rest | Syn | Auto | Gov | Scale | Composite |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Wasabi | 8 | 7 | 7 | 8 | 8 | 7 | 8 | 7 | 8 | **7.6** |
| Synology C2 | 6 | 8 | 7 | 5 | 8 | 10 | 9 | 7 | 7 | **7.4** |
| Hetzner Object Storage | 8 | 7 | 8 | 8 | 8 | 6 | 8 | 7 | 8 | **7.6** |
| iDrive e2 | 8 | 7 | 6 | 8 | 7 | 6 | 8 | 6 | 7 | **7.0** |
| Storj | 8 | 8 | 6 | 7 | 6 | 5 | 7 | 6 | 7 | **6.7** |

### Notes (Tier A)

| Provider | Why consider | Watch |
| --- | --- | --- |
| Wasabi | Low storage; included egress with fair-use | Min storage duration / fair-use surprises |
| Synology C2 | Best NAS-native story when DiskStation arrives | Vendor coupling to Synology ecosystem |
| Hetzner Object Storage | EU-friendly pricing model; S3 API | Confirm rclone/Restic maturity for chosen region |
| iDrive e2 | Aggressive cold-object pricing (verify current) | Longevity / brand depth vs Tier S |
| Storj | Decentralized durability narrative | Operational complexity; restore drill burden higher |

---

## Tier B — hyperscale / regional (use when needed)

| Provider | Cost | Sec | Lon | Ind | Rest | Syn | Auto | Gov | Scale | Composite |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AWS S3 | 3 | 9 | 10 | 7 | 9 | 7 | 9 | 7 | 10 | **7.9** |
| Google Cloud Storage | 3 | 9 | 10 | 7 | 9 | 6 | 8 | 7 | 10 | **7.7** |
| Azure Blob Storage | 3 | 9 | 10 | 7 | 9 | 6 | 8 | 7 | 10 | **7.7** |
| OVHcloud Object Storage | 6 | 7 | 7 | 7 | 7 | 5 | 7 | 6 | 8 | **6.7** |

### Notes (Tier B)

Hyperscalers score high on longevity, security tooling, and scale — and **low on Lifetime Cost** for a 20–50 year personal stewardship budget (egress and API complexity amplify risk). Prefer Tier S/A for Lifeboat **primary** archive; keep Tier B as migration/escape hatch knowledge, not default home.

---

## Cross-cut: tools fit (qualitative)

| Tool | B2 | R2 | Wasabi | Hetzner | Synology C2 | S3 |
| --- | --- | --- | --- | --- | --- | --- |
| Restic | ✅ | ✅ | ✅ | ✅ | via S3-compat if exposed | ✅ |
| Kopia | ✅ | ✅ | ✅ | ✅ | check docs | ✅ |
| rclone (+ crypt) | ✅ | ✅ | ✅ | ✅ | ✅/partial | ✅ |
| Synology Hyper Backup | ✅ (common) | check | ✅ (common) | check | ✅ native | ✅ |

Exact checkbox confirmation is a **Phase 1** prototype duty on the AMK-chosen path.

---

## Pricing snapshot sources (Phase 0)

Public research references used for order-of-magnitude (re-verify before spend):

- Backblaze published B2 pricing pages / 2026 comparison write-ups (~$6–$6.95/TB-mo; egress rules as published)  
- Cloudflare R2 published rates (~$0.015/GB-mo Standard; egress $0)  
- Wasabi / Hetzner / iDrive public pages (2026 secondary summaries)  
- Hyperscaler list prices (US regions) for cost contrast  

Currency: research often in **USD**; steward budget discussion may use **EUR** — convert at decision time.

---

## Phase 0 research evaluation order (Steward Board)

Evaluate providers in this sequence so specialist backup ecosystems are weighed before hyperscalers:

| Order | Provider | Why this slot |
| --- | --- | --- |
| 1 | Backblaze B2 | Best current storage value · strong backup ecosystem · Synology-friendly |
| 2 | Cloudflare R2 | Strong S3 ecosystem · no egress fees · future integration |
| 3 | Synology C2 | Especially relevant once NAS arrives |
| 4 | Hetzner Object Storage | EU-friendly specialist alternative |
| 5 | iDrive e2 | Aggressive object pricing (verify current) |
| 6 | Storj | Decentralized durability narrative |
| 7 | Wasabi | Low storage · fair-use egress discipline |
| 8 | AWS S3 | Hyperscale baseline (cost caution) |
| 9 | Google Cloud Storage | Hyperscale baseline |
| 10 | Azure Blob Storage | Hyperscale baseline |
| 11 | OVHcloud Object Storage | Regional alternative |

GitHub remains the **parallel constitution & source-history layer** — evaluated for that role, not as bulk object archive.

**Wave 1B:** Do **not** name D1/D2/D3 until Phase 0 evidence can support: *we chose this because evidence earned it—not because it was first available.*

Finish line: [Z_PROJECT_LIFEBOAT_SUCCESS_CRITERIA.md](Z_PROJECT_LIFEBOAT_SUCCESS_CRITERIA.md)

---

## Phase 0 standing (research only)

| Standing | Detail |
| --- | --- |
| GitHub | Living constitution & history (parallel layer) |
| Evaluation order | B2 → R2 → Synology C2 → Hetzner → iDrive e2 → Storj → Wasabi → hyperscalers / OVH |
| Wave 1B destination | **Not named** until evidence earns it |
| Spend / accounts | Not authorized by this matrix |

Next: deep-dive evidence sheets in evaluation order · [Wave 1B Decision Guide](Z_WAVE_1B_DECISION_GUIDE.md) · [Cost Projection](Z_LIFEBOAT_20_YEAR_COST_PROJECTION.md)

---

_Matrix v0 · provisional · evidence before euros · destination not named_
