# Z-CONNECT CANONICAL RECOVERY

**Phase:** ZCR-0
**Date:** 2026-09-14
**Mutation class:** `DOCS_ONLY`

| Field | Value |
| --- | --- |
| Source commit | `da9027e3ba384ffc8c7123623b6d0cfbd12f308a` |
| Recovery method | path-scoped Git restore (`docs/z-connect` only) |
| Whole branch merged | **NO** |
| Creator tree copied | **NO** |
| Historical source tree preserved | **YES** (commit 1 tree hash equals `da9027e:docs/z-connect`) |
| Consumer application | **NOT PRESENT** |
| Deployment | **NOT AUTHORIZED** |
| Soulmates V1 | **RECOVERY FOUNDATION ONLY** |
| AETERNA runtime | **CLOSED** |
| Adult content | **CLOSED** |
| MirrorSoul | **Separate** (not wired; not claimed as Soulmates backend) |

This file is recovery evidence. It is not new product doctrine.

---

## Known missing referenced artifacts

Status vocabulary: `REFERENCED_BUT_MISSING` = named here, absent on this recovery branch. Never-in-git vs companion-off-main is in **Git search**. Implication: do **not** recreate; do **not** restore companions in this slice.

### Never in git (`git log --all -- path` empty)

| Expected path | Origin | Git search | Status | Implication |
| --- | --- | --- | --- | --- |
| `docs/z-connect/phase-b2/BRAND_ARCHITECTURE_GUIDE.md` | B2 INDEX #2 | 0 commits; absent `da9027e` / Creator HEAD | `REFERENCED_BUT_MISSING` | Historical name kept; no file |
| `docs/z-connect/phase-b2/PRODUCT_VISION.md` | B2 INDEX #3 · HCI | 0 commits | `REFERENCED_BUT_MISSING` | Same |
| `docs/z-connect/phase-b2/USER_PERSONA_GUIDE.md` | B2 INDEX #4 · HCI | 0 commits | `REFERENCED_BUT_MISSING` | Same |
| `docs/z-connect/phase-b2/JOURNEY_HANDBOOK.md` | B2 INDEX #5 · HCI · Growth Journeys | 0 commits | `REFERENCED_BUT_MISSING` | B2.2 `GROWTH_JOURNEYS.md` is not a substitute rewrite |
| `docs/z-connect/phase-b2/INFORMATION_ARCHITECTURE.md` | B2 INDEX #6 | 0 commits | `REFERENCED_BUT_MISSING` | Same |
| `docs/z-connect/phase-b2/FEATURE_ROADMAP.md` | B2 INDEX #7 · Compassion Principles | 0 commits | `REFERENCED_BUT_MISSING` | Same |
| `docs/z-connect/phase-b2/COMMERCIAL_PREPARATION_GUIDE.md` | B2 INDEX #8 | 0 commits | `REFERENCED_BUT_MISSING` | Same |
| `docs/z-connect/phase-b2/TRUST_AND_SAFETY_REVIEW.md` | B2 INDEX #9 · HCI | 0 commits | `REFERENCED_BUT_MISSING` | Do not treat HCI “Mature T&S” as a file |
| `docs/z-connect/phase-b2/AI_EXPERIENCE_REVIEW.md` | B2 INDEX #10 | 0 commits | `REFERENCED_BUT_MISSING` | Same |
| `docs/z-connect/phase-b2/MISSION_CONTROL_INTEGRATION_GUIDE.md` | B2 INDEX #11 | 0 commits | `REFERENCED_BUT_MISSING` | Same |
| `docs/z-connect/phase-b2/IMPLEMENTATION_READINESS_REPORT.md` | B2 INDEX #12 | 0 commits | `REFERENCED_BUT_MISSING` | Same |
| `docs/z-connect/phase-b2/EXECUTIVE_SUMMARY.md` | B2 INDEX #13 | 0 commits | `REFERENCED_BUT_MISSING` | Same |
| `docs/governance/Z_SANCTUARY_COMPASSION_CHARTER.md` | README · HCI · B2 INDEX #14 · Compassion Principles | 0 commits; absent everywhere searched | `REFERENCED_BUT_MISSING` | Do not invent a charter |
| `docs/dashboard/Z_UNIVERSE_STRATEGIC_READINESS_REVIEW_2026_07_08.md` | B2 INDEX related hub docs | 0 commits | `REFERENCED_BUT_MISSING` | Same |
| `docs/z-connect/commercial/PRICING_STRATEGY.md` | `Z_CONNECT_COMMERCIAL_MILESTONE.md` | 0 commits | `REFERENCED_BUT_MISSING` | Same |

### Named in restored tree; not on this `origin/main` branch (path-scoped restore did not import companions)

| Expected path | Origin | Git search | Status | Implication |
| --- | --- | --- | --- | --- |
| `docs/governance/Z_SANCTUARY_FOUNDATION_DOCTRINES.md` | B2 INDEX · Compassion Principles | 6 commits; present `da9027e` + Creator; **absent** `origin/main` | `REFERENCED_BUT_MISSING` (this branch) | Out of ZCR-0 path scope |
| `docs/Z_SANCTUARY_UNIVERSE_RESOLUTION_2026_07_04.md` | B2 INDEX · program status · RA INDEX | 2 commits (`a8186d6`, `883a44c`); on `da9027e`; absent main | `REFERENCED_BUT_MISSING` (this branch) | Same |
| `docs/Z_SANCTUARY_PROJECT_ARCHITECTURE_LIFECYCLE.md` | RA INDEX · program status | 2 commits (`5965b01`, `a8186d6`); on `da9027e`; absent main | `REFERENCED_BUT_MISSING` (this branch) | Same |
| `docs/Z_SANCTUARY_OPERATIONAL_POSTURE_2026.md` | Master build charter | 2 commits; on `da9027e`; absent main | `REFERENCED_BUT_MISSING` (this branch) | Same |
| `docs/vile/platform-contracts/` (+ README) | VERSIONING · RA security | on `da9027e` (`fcb2013`); 0 files on main | `REFERENCED_BUT_MISSING` (this branch) | Same |
| `docs/vile/PHASE_2A_FOUNDATION_INTEGRATION_REPORT.md` | RA map / AI / security / roadmap | `85c4c51`; on `da9027e`; absent main | `REFERENCED_BUT_MISSING` (this branch) | Same |
| `docs/vile/PHASE_2A_FOUNDATION_INTEGRATION_GREEN_RECEIPT.md` | RA future · program status | `85c4c51`; on `da9027e`; absent main | `REFERENCED_BUT_MISSING` (this branch) | Same |
| `docs/vile/SHADOW_VALIDATION_PIPELINE.md` | Discovery journey · charter | 3 commits; on `da9027e`; absent main | `REFERENCED_BUT_MISSING` (this branch) | Same |
| `docs/vile/PHASE_2A_PACKAGE_4_ZUNO_DRP_CHARTER.md` | Stream B prep | `bbba451`; on `da9027e`; absent main | `REFERENCED_BUT_MISSING` (this branch) | Same |
| `docs/zilwa-living-experiences/` | RA future extensions | 10 commits; on `da9027e`; 0 on main | `REFERENCED_BUT_MISSING` (this branch) | Same |
| `docs/commercial-readiness-audit/` | Commercial milestone | 5 commits; on `da9027e`; 0 on main | `REFERENCED_BUT_MISSING` (this branch) | Same |
| `docs/z-nexus-engine/` | RA future extensions | 1 commit (`c5aa6ed`); **not** on `da9027e` or main | `REFERENCED_BUT_MISSING` | Not part of sealed Z-Connect tip |

### Named in Soulmates recon, not in restored `docs/z-connect`

| Expected path / artifact | Origin | Git search | Status | Implication |
| --- | --- | --- | --- | --- |
| DateShield implementation | Hub master register / SDR-0 | 0 hits under recovered `docs/z-connect` | `REFERENCED_BUT_MISSING` | Not a Z-Connect INDEX link; still no runtime |
| Scheduler / Zen Scheduler runtime | SDR-0 | 0 hits under recovered `docs/z-connect` | `REFERENCED_BUT_MISSING` | Not restored; not implemented |
| Aisling-Sol in Soulmates | SDR-0 | 0 hits under recovered `docs/z-connect` | `REFERENCED_BUT_MISSING` | Not wired |
| Soulmates Guide / consumer UI / auth / DB | SDR-0 | none in this tree | **NOT PRESENT** | Recovery ≠ implementation |

---

## What this recovery is not

Restored doctrine / JSON Schema / two helper scripts do **not** prove: consumer UI, mobile app, auth, production database, deployment target, 18+ runtime gate, DateShield, scheduler, Soulmates Guide runtime, or AETERNA runtime. Those remain **not GREEN**.
