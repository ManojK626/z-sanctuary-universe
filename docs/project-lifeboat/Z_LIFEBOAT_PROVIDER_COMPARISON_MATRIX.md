# Project Lifeboat — Global Provider Comparison Matrix

**Phase:** 0 — Research & Evidence
**Score date:** 2026-08-07
**Authority:** Research draft for AMK review — **not** a purchase order
**Machine scores:** `data/z_lifeboat_provider_scores_v0.json`
**Benchmark evidence:** [evidence/Z_LIFEBOAT_EVIDENCE_BACKBLAZE_B2.md](evidence/Z_LIFEBOAT_EVIDENCE_BACKBLAZE_B2.md)

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

### Categories (each 0–10)

Lifetime Cost · Security · Longevity · Vendor Independence · Restore Confidence · Synology Ready · Automation · Governance Fit · Scalability · **Steward Exit**

**Steward Exit Score** (Era IV unique):

> How easy is it to leave this provider without losing the organism?

**10/10** means: open standards · S3 compatibility · standard/client encryption · easy export · minimal vendor lock-in.

**Appliance Stewardship Score** (NAS-class / Synology C2):

> How well does this provider work as a long-term companion to a Synology NAS?

Onboarding · maintenance · restore · automation · health monitoring · migration — not merely “does it connect?”  
Recorded on C2 evidence sheets; not averaged into the ten-category composite unless later promoted.

**Composite** = arithmetic mean of the **ten** core categories (rounded to 1 decimal).

**Evidence Board:** [Z_LIFEBOAT_EVIDENCE_BOARD.md](Z_LIFEBOAT_EVIDENCE_BOARD.md) — B2 primary candidate · R2 secondary · C2 next.

---

## Benchmark rule

Backblaze B2 is the Phase 0 **benchmark** (not the locked winner).

Every other provider must answer: **Can you beat B2?**

---

## Tier S — primary research focus

| Provider | Role | Cost | Sec | Lon | Ind | Rest | Syn | Auto | Gov | Scale | Exit | Composite |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GitHub | Constitution & history | 8 | 8 | 9 | 6 | 8 | 4 | 7 | 10 | 7 | 6 | **7.3** |
| Cloudflare R2 | Object archive | 7 | 8 | 8 | 8 | 8 | 6 | 9 | 8 | 9 | 9 | **8.0** |
| Backblaze B2 | Object archive (**benchmark**) | 9 | 8 | 8 | 9 | 9 | 8 | 9 | 8 | 9 | 9 | **8.6** |

### Notes (Tier S)

| Provider | Evidence notes | Caveats |
| --- | --- | --- |
| GitHub | Living history; private repo + PR gates | Not bulk object backup; Exit middling for org/process lock-in |
| Cloudflare R2 | Egress free; S3-compatible | Must not confuse archive with production Workers deploy |
| Backblaze B2 | Strong $/TB; Object Lock; Hyper Backup docs; Steward Exit ~9 | Re-quote pricing; live NAS drill pending |

---

## Tier A — strong alternatives

| Provider | Cost | Sec | Lon | Ind | Rest | Syn | Auto | Gov | Scale | Exit | Composite |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Wasabi | 8 | 7 | 7 | 8 | 8 | 7 | 8 | 7 | 8 | 8 | **7.6** |
| Synology C2 | 6 | 8 | 7 | 5 | 8 | 10 | 9 | 7 | 7 | 5 | **7.2** |
| Hetzner Object Storage | 8 | 7 | 8 | 8 | 8 | 6 | 8 | 7 | 8 | 8 | **7.6** |
| iDrive e2 | 8 | 7 | 6 | 8 | 7 | 6 | 8 | 6 | 7 | 8 | **7.1** |
| Storj | 8 | 8 | 6 | 7 | 6 | 5 | 7 | 6 | 7 | 6 | **6.6** |

### Notes (Tier A)

| Provider | Why consider | Watch |
| --- | --- | --- |
| Wasabi | Low storage; included egress with fair-use | Min duration / fair-use |
| Synology C2 | Best NAS-native once DiskStation arrives | **Low Steward Exit** (ecosystem coupling) |
| Hetzner Object Storage | EU-friendly; S3 API | Confirm tool maturity |
| iDrive e2 | Aggressive pricing (verify) | Longevity depth |
| Storj | Decentralized narrative | Restore/ops complexity |

---

## Tier B — hyperscale / regional

| Provider | Cost | Sec | Lon | Ind | Rest | Syn | Auto | Gov | Scale | Exit | Composite |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AWS S3 | 3 | 9 | 10 | 7 | 9 | 7 | 9 | 7 | 10 | 7 | **7.8** |
| Google Cloud Storage | 3 | 9 | 10 | 7 | 9 | 6 | 8 | 7 | 10 | 7 | **7.6** |
| Azure Blob Storage | 3 | 9 | 10 | 7 | 9 | 6 | 8 | 7 | 10 | 7 | **7.6** |
| OVHcloud Object Storage | 6 | 7 | 7 | 7 | 7 | 5 | 7 | 6 | 8 | 7 | **6.7** |

Hyperscalers: high longevity/security/scale; weak Lifetime Cost for personal decades; Steward Exit middling (gravity of ecosystem ≠ open portable stewardship).

---

## Steward Exit Score (spotlight)

| Provider | Exit | One-line reason |
| --- | --- | --- |
| Backblaze B2 | 9 | S3-compat + client encryption portability |
| Cloudflare R2 | 9 | S3-compat; egress model aids migration pulls |
| Wasabi / Hetzner / iDrive e2 | 8 | S3-class; verify fair-use/export friction |
| AWS / GCP / Azure / OVH | 7 | Portable APIs; ecosystem gravity |
| GitHub | 6 | Git portable; org/process not bulk archive |
| Storj | 6 | Model-specific operational knowledge |
| Synology C2 | 5 | Strong NAS fit; weaker leave-without-ecosystem |

---

## Cross-cut: tools fit (qualitative)

| Tool | B2 | R2 | Wasabi | Hetzner | Synology C2 | S3 |
| --- | --- | --- | --- | --- | --- | --- |
| Restic | ✅ | ✅ | ✅ | ✅ | via S3-compat if exposed | ✅ |
| Kopia | ✅ | ✅ | ✅ | ✅ | check docs | ✅ |
| rclone (+ crypt) | ✅ | ✅ | ✅ | ✅ | ✅/partial | ✅ |
| Synology Hyper Backup | ✅ (docs) | check | ✅ (common) | check | ✅ native | ✅ |

---

## Pricing snapshot sources (Phase 0)

- Backblaze B2 published pricing / transaction pages (~$6.95/TB-mo class; egress rules as published)
- Cloudflare R2 (~$0.015/GB-mo Standard; egress $0)
- Wasabi / Hetzner / iDrive public pages
- Hyperscaler list prices for contrast

Currency: often **USD**; convert to **EUR** at decision time.

---

## Phase 0 research evaluation order (Steward Board)

| Order | Provider | Why this slot |
| --- | --- | --- |
| 1 | Backblaze B2 | Benchmark — best current storage value · backup ecosystem · Synology-friendly |
| 2 | Cloudflare R2 | S3 ecosystem · no egress fees · future integration |
| 3 | Synology C2 | Especially relevant once NAS arrives |
| 4–7 | Hetzner · iDrive e2 · Storj · Wasabi | Specialist alternatives |
| 8–11 | AWS · GCS · Azure · OVH | Hyperscale / regional baselines |

GitHub = parallel constitution layer (not bulk object archive).

**Wave 1B:** Do **not** name D1/D2/D3 until evidence earns it.

---

## Phase 0 standing

| Standing | Detail |
| --- | --- |
| Maturity | [Z_LIFEBOAT_PHASE_0_MATURITY.md](Z_LIFEBOAT_PHASE_0_MATURITY.md) — RESEARCH |
| B2 evidence | Opened as benchmark sheet |
| Destination | **Unnamed** |
| Spend / accounts | Not authorized |

Next: Synology C2 evidence sheet — *Can you beat B2?* · [Key Ceremony](Z_LIFEBOAT_KEY_CEREMONY_ONE_PAGER.md) (offline fill)

**R2 vs B2 (research):** R2 does **not** dethrone B2 as sole primary; see [evidence/Z_LIFEBOAT_EVIDENCE_CLOUDFLARE_R2.md](evidence/Z_LIFEBOAT_EVIDENCE_CLOUDFLARE_R2.md).

---

_Matrix v0.1 · ten categories · Steward Exit · evidence before euros_
