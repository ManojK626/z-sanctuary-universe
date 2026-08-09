<!-- Z: docs/amk-goku-steward-ai/SSR_HISTORICAL_SPECIFICATION_CENSUS_1_DEEP_LINEAGE.md -->

# SUPER SAIYAN ROULETTE — HISTORICAL SPECIFICATION CENSUS 1 (DEEP LINEAGE)

**Phase:** SSR-HISTORICAL-SPECIFICATION-CENSUS-1
**Date:** 2026-08-09
**Posture:** DEEP LINEAGE RECOVERY → CLASSIFY → REPORT → STOP
**Depends on (sealed, not modified):** Census 0 @ hub commit `74660d3` — `SSR_HISTORICAL_SPECIFICATION_CENSUS_0.md`
**Reconstruction:** NOT AUTHORIZED
**Canonical Pro App modified:** NO

---

## 0. Purpose

Reconcile **new ChatGPT / historical-work leads** with on-disk evidence **before** any reconstruction.

Especially:

1. Named AI / engine roster for historical SSR vs modern Z-Sanctuary
2. Critical lead: Flutter scaffold ~**2025-12-31** (`pubspec`, assets, working `main.dart`, bottom-nav Dashboard, `lib/features/wonderland/`, planned Z1–Z18 / five-zone / LPBS / XXXtreme engines)

This document is an **evidence layer**. It does **not** rewrite Census 0.

---

## 1. Evidence sources used (this pass)

| ID | Source | Role |
| --- | --- | --- |
| E0 | Census 0 (sealed) | Baseline: vision recovered; Flutter source not recovered |
| E1 | Canonical Pro App README + ZIP archaeology | Product intent seed (2025-05-26 Git) |
| E2 | `Z_Labs/sicmns/docs/RL-GOKU-TRANSCRIPT.md` + `RL-GOKU-PDF-SOURCE.md` | OCR of historical PDF (“xxx Rl Goku…”) — **primary deep-lineage documentary** for Whis→SKK, Z/ZN/ZX, LPBS variants, AI HeatZone / Whis Mode |
| E3 | Hub `SUPER_SAIYAN_MANIFEST.md`, `ROULETTE_PUBLIC_OVERVIEW.md`, `ROULETTE_SAFETY_RULES.md`, `SKK_DASHBOARD_PRIORITY.md`, `SKK_RAINBOW_CLOUD_V0_1.md` | Later Z-Sanctuary governance / roulette safety — **not** proof of original Pro App code |
| E4 | OMNI `Z-CREATOR-VISION-BLUEPRINT.md`, `MODULES-IDEAS-MASTER.md` | Family mentor / Whis→SKK overlay notes in OMNI lineage |
| E5 | Hub `packages/z-sanctuary-core/ai/*.json` | Modern persona stubs (Zuno / Aisling-Sol / Zulu) |
| E6 | Bounded PC-root Flutter hunt (Organiser depth ≤7–8) | Scaffold existence check |
| E7 | Steward ChatGPT lead (2025-12-31 Flutter scaffold description) | **Lead only** until physical match found |

**OCR caveat (E2):** Transcript may contain typos; treat as strong historical *intent* record, not executable source.

---

## 2. Classification vocabulary (Census 1)

| Label | Meaning |
| --- | --- |
| **ORIGINAL SSR** | Attested in early Pro App / RL-Goku roulette-app design as belonging to that product |
| **LATER SSR EVOLUTION** | Same product lineage, but a deliberate later change (e.g. Whis → SKK) |
| **WIDER Z-FAMILY** | Family / Sanctuary ecosystem roles that outgrew or sit beside roulette |
| **RELATED ROULETTE** | RDA / OMNI / hub / XL2 roulette implementations without proven Pro App identity |
| **UNRELATED** | Different product (e.g. training Flutter shell, marketplace) |
| **UNKNOWN** | Name appears in Steward lead or vague recall; insufficient on-disk corroboration |

---

## 3. Critical lead — Flutter scaffold (~2025-12-31)

### 3.1 Claimed fingerprint (Steward / ChatGPT lead)

- `pubspec.yaml`
- `assets/`
- working `lib/main.dart`
- bottom-navigation **Dashboard**
- `lib/features/wonderland/`
- Planned / continued engines: multi-table spin storage, Z1–Z18, Hot/Cold five-zone, LPBS simulation, XXXtreme bonus-board

### 3.2 Search result (approved Organiser scope)

| Check | Result |
| --- | --- |
| `lib/features/wonderland/` directory | **NOT FOUND** |
| `*.dart` containing `wonderland` / `Wonderland` | **NOT FOUND** |
| Flutter apps found | (1) `Z_Labs/sicmns/amk_goku_training` — fighting-styles shell, bottom nav Train/Guardian/Progress — **UNRELATED** to SSR; (2) `Z-WorkSphere_Marketplace_Hub` — marketplace + Firebase — **UNRELATED** |
| Canonical Pro App | README only — no Flutter tree |
| `docs/chatgpt_exports/` | README placeholder only — **no** scaffold dump |

### 3.3 Provenance verdict

| Field | Value |
| --- | --- |
| Scaffold located on disk? | **NO** |
| Closest false positive | `amk_goku_training` (bottom nav + `main.dart`) — wrong product identity |
| Classification of lead | **UNKNOWN** physical survival · **NOT** copied · **NOT** merged into Pro App |
| FLUTTER SCAFFOLD RECOVERY | **NOT RECOVERED** within approved roots |

**Do not** treat WorkSphere or training Flutter as SSR source.

---

## 4. Historical SSR AI hierarchy (reconstructed from evidence — separate from modern ZSU)

### 4.1 Early SSR mentor layer (documentary)

```text
[Early design]
Whis guide / Whis Mode
  → explains techniques & strategy tips
  → bundled in pricing tiers as “Whis guide”
        ↓  (explicit product decision in RL-Goku transcript)
[Later SSR evolution]
SKK — Supreme Teacher / Supreme AI Mentor / Main AI Assistant
  → “Ask SKK” for patterns, AI logic, betting guidance
  → replaces Whis; family characters replace DBZ cast (IP workaround)
        ↓
Family AI Assistants (SSR app role table)
  SKK, RKPK, AMK-Goku, JB, Rishi/… Humor Guardian, siblings…
  + “Shadow Ai” companions per character (mystical animals)
        ↓
Named technique AIs (same documentary pack)
  AI HeatZone Radar | Whis Mode (legacy name may linger) | Auto AI X-Adjust
```

### 4.2 Triple-check findings

| Question | Evidence-based answer | Class |
| --- | --- | --- |
| Was Whis the Roulette Head Teacher / Teacher? | **Partially yes, then superseded.** Early tiers/modes: “Whis guide”, “Whis Mode” = explanation/strategy tips. Explicit instruction: **CHANGE Whis to SKK**; SKK becomes **Supreme Teacher & Brain** / **Main AI Assistant**. | ORIGINAL SSR (Whis) → **LATER SSR EVOLUTION** (SKK replaces Whis) |
| What authority did SKK have? | Mentor/strategist; explains complex logic; “Ask SKK”; **not** described as autonomous deployer of bets. Later hub docs expand SKK into Sanctuary law-guardian — that is **WIDER Z-FAMILY**, do not collapse into early SSR. | LATER SSR EVOLUTION (app mentor) · WIDER Z-FAMILY (dashboard/Rainbow Cloud) |
| What did Shadow AI / Zulu actually do? | Transcript: each family character gets **“Shadow Ai”** + mystical animal — companion overlay, **not** a separate Overseer. **Zulu** does **not** appear as roulette teacher in RL-Goku; hub/Rainbow Cloud casts Zulu as **Technology Survival Specialist** / persona stub. | Shadow companions: ORIGINAL/LATER SSR (family system) · Zulu: **WIDER Z-FAMILY** |
| Which named AIs belonged **directly** to Roulette? | Strong: **Whis** (early), **SKK** (successor teacher), **AI HeatZone Radar**, **Auto AI X-Adjust**, family assistants in app slides. Weaker/ecosystem: **Zuno** appears later in same PDF as Sanctuary/ZES partner — treat as **WIDER Z-FAMILY** emerging inside the same conversation stream, not proven Pro App Git code. | See roster §8 |

### 4.3 Modern Z-Sanctuary hierarchy — **do not retro-insert**

| Modern role | Class vs historical SSR |
| --- | --- |
| Z-Super Overseer / EAII / SSWS / Doorway | **WIDER Z-FAMILY** — post-SSR Sanctuary OS |
| Zuno state observer / persona JSON | **WIDER Z-FAMILY** |
| Aisling-Sol compassion persona / Sister project | **WIDER Z-FAMILY** |
| Zulu persona / Rainbow Cloud tech role | **WIDER Z-FAMILY** |
| Shadow AI factory / ZIX planetary consciousness | **WIDER Z-FAMILY** / **BLOCKED** product concepts — **not** historical SSR |
| OMNI Goku Heart LPBS micro-agents | **RELATED ROULETTE** |
| RDA Living AI / Z-SSRP advisors | **RELATED ROULETTE** |

---

## 5. Named-lead classification table

| Name / module | On-disk / documentary hit | Classification |
| --- | --- | --- |
| Whis AI | RL-Goku: guide / Whis Mode; Master Register “Whis overlay”; office zip TTS concept | **ORIGINAL SSR** (early mentor) → replaced |
| Roulette Teacher | Role filled by Whis then **SKK Supreme Teacher** | **ORIGINAL SSR** / **LATER SSR EVOLUTION** |
| SKK | RL-Goku + OMNI blueprint + hub SKK docs | **LATER SSR EVOLUTION** (app) · **WIDER Z-FAMILY** (Sanctuary law) |
| Supreme AI Mentor | Synonym for SKK in RL-Goku / OMNI | **LATER SSR EVOLUTION** |
| Zuno | Late RL-Goku pages; hub persona | **WIDER Z-FAMILY** (not proven Pro App core teacher) |
| Zulu | Rainbow Cloud / persona JSON; **absent** as SSR teacher in RL-Goku | **WIDER Z-FAMILY** |
| Shadow Strength AI | Exact name **not found**; RKPK elephant “Memory, Strength”; family “Shadow Ai” | **UNKNOWN** as product name · Shadow companions **ORIGINAL/LATER SSR** |
| Aisling-Sol | Hub Trinity / Sister project | **WIDER Z-FAMILY** |
| Shadow AI | Family Shadow Ai overlays; ZILWA dual-layer concept later | **LATER SSR EVOLUTION** (family) · **WIDER Z-FAMILY** (ZILWA) |
| Z1–Z18 / ZN / ZX | README + RL-Goku definitions (non-appearance / multipliers / follow-on) | **ORIGINAL SSR** (concepts); math still incomplete vs code |
| LPBS | README + RL-Goku Classic/Flex/Survivor + 60/90/120 settings | **ORIGINAL SSR** (name + variants documentary) |
| Micro-Formula Pattern Recognition | Exact phrase **not found** | **UNKNOWN** |
| Memory Engine | Exact product **not found**; elephant “Memory & Strength” symbolism | **UNKNOWN** as engine · symbolism **ORIGINAL/LATER SSR** |
| Emotional Shadow/Light Engine | Exact name **not found** | **UNKNOWN** |
| Humor-Wisdom Dual System | Rishi “Guardian of Humor”; SKK wisdom — dual **roles**, not named engine | **ORIGINAL/LATER SSR** (family roles) · engine name **UNKNOWN** |
| Story Feedback Loop | Exact name **not found** | **UNKNOWN** |
| Tournament Battle Logic | Transcript: integrate family into “Tournament” | **ORIGINAL/LATER SSR** (intent) · implementation **UNKNOWN** |
| Real-Time Role Switching | Companion form swap / enhancer (OMNI + family slides) | **LATER SSR EVOLUTION** / **WIDER Z-FAMILY** |
| SUPER_SAIYAN_MANIFEST | Hub doc (2026-01-16 Sanctuary activation) | **WIDER Z-FAMILY** (not Pro App Flutter manifest) |
| ROULETTE_PUBLIC_OVERVIEW | Hub public module overview | **RELATED ROULETTE** / hub |
| ROULETTE_SAFETY_RULES | Hub Z-Flow roulette safety | **WIDER Z-FAMILY** / hub governance |
| SKK_DASHBOARD_PRIORITY | Hub root-first dashboard law | **WIDER Z-FAMILY** |
| SKK_RAINBOW_CLOUD | Hub control-plane blueprint | **WIDER Z-FAMILY** |

---

## 6. Engine / math lineage updates (from RL-Goku — still not Pro App source)

These **strengthen Census 0’s ORIGINAL_PARTIAL** entries; they do **not** equal recovered Flutter code.

| Topic | Documentary addition (E2) | Still missing |
| --- | --- | --- |
| Z1 | “1 Number not appearing in X spins” | Exact X defaults; code |
| Z2–Z18 | “2 to 18 numbers not appearing” | Full matrix |
| ZX | Z1x2, Z3x2, Z6x3, Z12x5, Z18x10 described | Executable formulas |
| ZN | ZN1=1 / =2 / =10 follow-on patterns | Full semantics |
| LPBS | Classic (Capital/36, e.g. ~525 spins), Flex (adapt every 100), Survivor; plus 60→2 / 90→3 / 120→4 unit settings | Which variant shipped; Flutter sim |
| XXXtreme | Bonus Watcher 100x–2000x; Category Storm; Multi-Chaser | Live-game vs SSR Pro App boundary |
| Heat / zones | AI HeatZone Radar; Category Storm “20% bonus zone (hot, cold…)” | Exact five-zone SSR mapping |

---

## 7. Document map (requested filenames)

| Doc | Location | Relation to SSR Pro App |
| --- | --- | --- |
| SUPER_SAIYAN_MANIFEST | `docs/SUPER_SAIYAN_MANIFEST.md` | Sanctuary activation manifesto — **WIDER Z-FAMILY** |
| ROULETTE_PUBLIC_OVERVIEW | `docs/ROULETTE_PUBLIC_OVERVIEW.md` | Hub roulette module public face — **RELATED ROULETTE** |
| ROULETTE_SAFETY_RULES | `docs/ROULETTE_SAFETY_RULES.md` | Z-Flow safety — **WIDER Z-FAMILY** |
| SKK_DASHBOARD_PRIORITY | `docs/SKK_DASHBOARD_PRIORITY.md` | Sanctuary command dashboard — **WIDER Z-FAMILY** |
| SKK_RAINBOW_CLOUD | `docs/SKK_RAINBOW_CLOUD_V0_1.md` | Living spine server — **WIDER Z-FAMILY** |

---

## 8. Rosters (Census 1 deliverables)

### SSR CORE AI ROSTER

| AI | Era | Class | Notes |
| --- | --- | --- | --- |
| Whis (guide / Whis Mode) | Early | ORIGINAL SSR | Teacher/explainer; later replaced |
| SKK (Supreme Teacher / Ask SKK) | Post-Whis | LATER SSR EVOLUTION | Primary roulette mentor after replacement |
| AI HeatZone Radar | Documentary pack | ORIGINAL SSR | Heat/cold map AI |
| Auto AI X-Adjust | Documentary pack | ORIGINAL SSR | Retunes X-spin thresholds |
| Family assistants (RKPK, AMK, JB, Humor Guardian, siblings…) | Documentary pack | ORIGINAL/LATER SSR | App roles + Shadow Ai companions |
| Zuno | Late same PDF / hub | WIDER Z-FAMILY | Not proven as Pro App Head Teacher |
| Zulu / Aisling-Sol | Hub / Rainbow | WIDER Z-FAMILY | Not SSR Head Teacher |
| Modern Overseer / EAII / SSWS | Hub OS | WIDER Z-FAMILY | **Do not insert into SSR** |

### SSR CORE ENGINE ROSTER

| Engine / technique family | Class | Evidence |
| --- | --- | --- |
| Z-Series (Z1–Z18 non-appearance) | ORIGINAL SSR | README + RL-Goku |
| ZX multipliers | ORIGINAL SSR | README examples + RL-Goku table |
| ZN repeat / follow-on | ORIGINAL SSR | RL-Goku |
| LPBS (+ Classic/Flex/Survivor; 60/90/120 settings) | ORIGINAL SSR (doc) | README + RL-Goku |
| XXXtreme bonus patterns | ORIGINAL/LATER SSR intent · RELATED live products | RL-Goku + RDA/XL2 |
| Multi-table spin storage | ORIGINAL SSR intent | README; scaffold lead **unverified** |
| Five-zone hot/cold | ORIGINAL PARTIAL / RELATED hub | Calculator README; HeatZone Radar |
| Kaioken X10 / paid techniques | LATER SSR EVOLUTION (paid modules in PDF) | RL-Goku |

### SSR UI / FEATURE ROSTER

| Feature | Class | Physical code |
| --- | --- | --- |
| Multi-table tracking | ORIGINAL SSR intent | Not in Pro App tree |
| Social / streaming / VIP | ORIGINAL SSR intent | Not in Pro App tree |
| Wonderland game mode (pricing/modes) | ORIGINAL SSR intent (mode name) | `lib/features/wonderland/` **NOT FOUND** |
| Bottom-nav Dashboard Flutter shell | Steward lead | **NOT FOUND** (false positive: training app) |
| Ask SKK / 3D mentor UX | LATER SSR EVOLUTION | Documentary only |
| Tournament integration | ORIGINAL/LATER SSR intent | UNKNOWN implementation |

### SSR SAFETY / GOVERNANCE ROSTER

| Item | Class | Notes |
| --- | --- | --- |
| Trademark / DBZ IP workaround (replace Whis, family cast) | ORIGINAL/LATER SSR | Explicit in RL-Goku |
| Hub ROULETTE_SAFETY_RULES / LPBS governors | WIDER Z-FAMILY | Later Sanctuary law |
| SKK Dashboard Priority / Rainbow Cloud | WIDER Z-FAMILY | Not Pro App runtime |
| No-guarantee / entertainment posture | RELATED hub + required for any rebuild | Census 0 + public overview |

### LATER EVOLUTION ROSTER

| Item | Class |
| --- | --- |
| Whis → SKK teacher replacement | LATER SSR EVOLUTION |
| Family Shadow Ai companion system | LATER SSR EVOLUTION |
| Paid unlock techniques (Kaioken, Pro Monster Challenges) | LATER SSR EVOLUTION |
| RDA Z-SSRP / Living AI | RELATED ROULETTE |
| OMNI Goku Heart LPBS ladders | RELATED ROULETTE |
| Hub Zuno/Zulu/Aisling Trinity + Overseer stack | WIDER Z-FAMILY |
| XL2 XXXtreme Lightning 2 product | RELATED ROULETTE / SEPARATE charter |

### UNKNOWN REGISTER (Census 1 additions)

| # | Question | Status |
| --- | --- | --- |
| C1-U1 | Does the 2025-12-31 Flutter scaffold survive anywhere outside approved Organiser roots? | **UNKNOWN** — needs Steward-approved external path |
| C1-U2 | Exact path/project name of that scaffold if it existed | **UNKNOWN** |
| C1-U3 | Was “Shadow Strength AI” a real module name or a conflation of Shadow Ai + Memory/Strength symbolism? | **UNKNOWN** |
| C1-U4 | Micro-Formula Pattern Recognition / Memory Engine / Emotional Shadow-Light / Story Feedback Loop as named engines | **UNKNOWN** (names not recovered on disk) |
| C1-U5 | Did Whis Mode remain as a *mode name* after SKK became Head Teacher? | **UNKNOWN** (both appear in same PDF section) |
| C1-U6 | Which RL-Goku techniques were ever coded vs slideware | **UNKNOWN** |
| C1-U7 | Link between Pro App GitHub seed (2025-05) and Dec-2025 scaffold lead | **UNKNOWN** chronology bridge |

---

## 9. FLUTTER SCAFFOLD RECOVERY RESULT

```text
RESULT: NOT RECOVERED
SCOPE: Approved AMK Organiser / PC-root awareness (bounded)
FALSE POSITIVES: amk_goku_training (UNRELATED); WorkSphere Flutter (UNRELATED)
ACTION TAKEN: None (no copy, no merge into Pro App)
NEXT: Only Steward-authorized external/preservation search
```

---

## 10. Sufficiency for SSR-RECONSTRUCTION-0?

| Criterion | Status |
| --- | --- |
| Product vision / AI mentor lineage | **Stronger** than Census 0 (Whis→SKK hierarchy now evidenced) |
| Exact math + Flutter implementation | **Still insufficient** |
| Scaffold / source payload | **Still not found** |
| Risk of fake recovery | **High** if reconstruction starts now |

**Verdict:** Evidence is **NOT yet sufficient** for **SSR-RECONSTRUCTION-0**.

Recommended gate remains: **MORE HISTORICAL RECOVERY** against an **explicit** external preservation location — **or** Steward seal “original implementation unavailable” before any **documented rebirth** charter that keeps ORIGINAL / DERIVED / NEW labels.

---

## 11. Control

| Item | Value |
| --- | --- |
| Census 0 | **Unchanged** |
| Canonical Pro App | **Unchanged** |
| Related projects | **Not modified** |
| Registry / Doorway | **Not changed** |
| Flutter init / copy / deploy | **NONE** |

---

*End of Census 1 — STOP.*
