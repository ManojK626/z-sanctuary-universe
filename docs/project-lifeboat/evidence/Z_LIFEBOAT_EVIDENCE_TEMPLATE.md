# Evidence sheet template — Project Lifeboat

**Use:** One sheet per provider under `docs/project-lifeboat/evidence/`
**Law:** Evidence over marketing. Mark unknowns. Cite dated sources. No spend implied.

**Benchmark:** After B2 sheet exists, every sheet must answer: *Can you beat B2?*

---

## Header

| Field | Value |
| --- | --- |
| Provider | |
| Tier | S / A / B |
| Sheet status | DRAFT / REVIEW / BENCHMARK-COMPLETE |
| Score date | |
| Sources last checked | |

---

## 1. Longevity

| Question | Evidence | Confidence |
| --- | --- | --- |
| Company history | | low / med / high |
| Financial stability | | |
| Enterprise / market adoption | | |
| Future outlook (10–20+ yr) | | |

**Longevity provisional score (0–10):**

---

## 2. Economics

| Item | Evidence | Notes |
| --- | --- | --- |
| Storage $/GB or $/TB-mo | | |
| API / transaction fees | | |
| Retrieval / egress | | |
| Hidden / min-duration / fair-use | | |
| Growth projection (20y) | link cost doc scenario | |

**Economics / Lifetime Cost provisional score (0–10):**

---

## 3. Security

| Feature | Present? | Evidence |
| --- | --- | --- |
| Client-side encryption (tooling) | | |
| At-rest / in-transit (provider) | | |
| MFA | | |
| Object Lock / immutability | | |
| Versioning | | |
| Lifecycle policies | | |
| Compliance certifications | | |

**Security provisional score (0–10):**

---

## 4. Recovery

| Question | Evidence |
| --- | --- |
| Catastrophic restore path | |
| Restore tooling (Restic / Kopia / rclone / native) | |
| Speed / practicality notes | |
| Drill feasibility for Lifeboat sizes | |

**Restore Confidence provisional score (0–10):**

---

## 5. Exit strategy (Steward Exit)

| Question | Evidence |
| --- | --- |
| Open standards / S3-compatible? | |
| Proprietary format risk? | |
| Export / migrate without rebuild? | |
| Metadata preservation? | |
| Client encryption portable? | |

**Steward Exit Score (0–10):**
*(10 = leave without losing the organism — open standards, S3-compat, standard encryption, easy export, minimal lock-in)*

---

## 6. Synology integration

| Item | Evidence |
| --- | --- |
| Hyper Backup | |
| S3 compatibility | |
| Native / documented support | |
| Restore workflows | |

**Synology Ready provisional score (0–10):**

---

## Beat-B2 verdict (fill after B2 benchmark sheet)

| Dimension | Better / Equal / Worse than B2 | Why |
| --- | --- | --- |
| Longevity | | |
| Economics | | |
| Security | | |
| Recovery | | |
| Steward Exit | | |
| Synology | | |

**Overall:** Does this provider beat B2 for Lifeboat? **Yes / No / Partial** — reason:

---

_Template · evidence before destination_
