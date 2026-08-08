# Phase 0 Evidence Review — Z-CPU Spine Fabric (MAP vs GAP)

**Status:** EVIDENCE REVIEW COMPLETE · **map-vs-gap only** · **zero implementation authority**
**Date:** 2026-08-08
**Opened by:** AMK-Goku (explicit gate)
**Foundation seals:** `fad4f56` (audit) · `3d0aab0` (Steward decisions) · `c9555e6` (index, not product)
**Charter:** [PHASE_Z_CPU_SPINE_FABRIC_0_CHARTER.md](PHASE_Z_CPU_SPINE_FABRIC_0_CHARTER.md)
**Posture:** Inspect · compare · map · report · **STOP**

---

## Mission question

> How much of a Z-CPU do we already have without calling it a Z-CPU?

**Not asked:** What Z-CPU should we build?

---

## Hard stops (honored)

No Z-CPU product · no new/modified registries · no UI/Doorway · no runtime/deploy · no identity merge · no rename · no status paint · no new bridges · no PC-root reorganization.

---

## Outcome vocabulary

| Outcome     | Meaning                                                                            |
| ----------- | ---------------------------------------------------------------------------------- |
| **EXISTS**  | Capability covered by a sealed plane — map to it                                   |
| **PARTIAL** | Plane exists; precise gap named — strengthen first, don’t auto-build               |
| **MISSING** | No plane covers it — propose strengthening; new mechanism only if strengthen fails |

**Rule:** PARTIAL ≠ permission to invent a parallel core.

---

## Live test cases (from Steward Pass)

| Case               | What was needed                   | What we did **not** need |
| ------------------ | --------------------------------- | ------------------------ |
| Dashboard 2        | Identity resolution + HOLD        | New project / GREEN      |
| Aisling / ÉirMind  | Relationship (SUBSYSTEM / rehome) | Auto-merge               |
| Z-Sanctuary Replit | Boundary-aware UNKNOWN            | GREEN over uncertainty   |

These stress-test **Z-ID · Z-LINK · Z-PATH · Z-GUARD · Z-RESOLVE · Z-RECEIPT**.

---

## Plane-by-plane review

### 1. Z-ID — Identity Spine

| Field                 | Content                                                                                                                                                                                                                                                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Outcome**           | **PARTIAL**                                                                                                                                                                                                                                                                                                                        |
| **Maps to**           | Trust Chain · [Z_IDENTITY_MANIFEST.md](Z_IDENTITY_MANIFEST.md) (categories sealed; **no** mandatory runtime manifest) · `data/z_pc_root_projects.json` (22) · `data/z_universe_id_map.json` · `data/z_universe_project_registry.json` · `data/z_family_ai_registry.json` · module/monster registries · Triple Identification Audit |
| **Evidence**          | Book B: identity precedes citizenship; PC-root field union today = `id,name,path,role,ssws,…` (no full Manifest schema enforced). Triple Audit: Indicators ≠ PC-root ≠ Universe (schema gap by design). Disk markers vary (hub has control-link doc; Aisling/Replit/Vaults have `z_sanctuary_link.json`).                          |
| **Precise gap**       | No single portable “who am I?” record a **sibling project can load** that unifies aliases, parent ecosystem, lifecycle, stewardship state, and evidence sources. Multiple ID planes intentionally not joined.                                                                                                                      |
| **Strengthen first?** | **Yes** — extend Identity Manifest / PC-root **notes & optional fields** under Steward charter; keep planes separate; use Family AI + EMK-REHOME pattern for aliases.                                                                                                                                                              |
| **New mechanism?**    | **Not yet** — strengthen Book B + PC-root documentation before any “Z-ID engine.”                                                                                                                                                                                                                                                  |
| **DISCOVERY PATH**    | Start at hub Trust Chain → PC-root id → on-disk path/markers → Family AI / universe census → Triple Audit if planes disagree → Steward HOLD if Paths A/B/C conflict.                                                                                                                                                               |

**Test case:** Dashboard 2 resolved as registry citizen without disk → D2-HOLD (Z-ID + Triple Path working as discipline, not as runtime).

---

### 2. Z-LINK — Relationship Graph

| Field                 | Content                                                                                                                                                                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Outcome**           | **PARTIAL**                                                                                                                                                                                                                               |
| **Maps to**           | Control-Link manifest + sync · Twin Roots mock/status/panel · Doorway registries · SSWS spines · Awareness registry · Steward EMK/D2/REP relationship language · [PROJECT_IDENTITY_RECONCILIATION.md](PROJECT_IDENTITY_RECONCILIATION.md) |
| **Evidence**          | Satellites: thin `docs/Z_SANCTUARY_CONTROL_LINK.md` bridges (2 manifest targets sampled). Twin Roots = Phase 1 **mock**. EMK-REHOME encoded SUBSYSTEM without merging rows. Replit vs roulette = SEPARATE.                                |
| **Precise gap**       | No machine-readable **relationship type** field shared across citizens (`SUBSYSTEM`, `MIRROR`, `EXTERNAL_COUNTERPART`, …). Relationships live in docs/receipts/notes, not a queryable graph.                                              |
| **Strengthen first?** | **Yes** — documentary `identity_relation` / notes on existing rows + Twin Roots charter upgrade; optional later schema only after Steward.                                                                                                |
| **New mechanism?**    | **Not yet** — do not invent Z-LINK DB beside Control-Link / Twin Roots.                                                                                                                                                                   |
| **DISCOVERY PATH**    | PC-root / Family AI → Steward receipts → Control-Link (if satellite) → Twin Roots status (architecture twins) → Awareness capsule → stop at RELATED_CANDIDATE until Steward upgrades.                                                     |

---

### 3. Z-PATH — Evidence / routing pathways

| Field                 | Content                                                                                                                                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Outcome**           | **PARTIAL**                                                                                                                                                                                                                 |
| **Maps to**           | Ecosystem Awareness Spine (Z-AWARE-1) · SSWS workspace/control spines · MOD-DIST “where idea belongs” · Registry Atlas · AI Team Indicator Sync Router · Cycle Observe (queue only) · Triple Path discipline in CPU charter |
| **Evidence**          | Awareness: capsules → report → indicators/notifications; law “Awareness ≠ execution.” SSWS routes operator attention. Control Panel confusion showed pathway **layer labels** missing in UI, not missing registries.        |
| **Precise gap**       | No standard “ask the ecosystem where this belongs” **protocol** a project or Cursor session can invoke end-to-end; operators must know which report/registry to open.                                                       |
| **Strengthen first?** | **Yes** — operator morning path + Atlas pointers + layered Control Panel charter (separate gate); Awareness capsules for more PC-root citizens.                                                                             |
| **New mechanism?**    | **Not yet** — pathway = discovery discipline + Atlas, not a new router product.                                                                                                                                             |
| **DISCOVERY PATH**    | Question → Registry Atlas / AI Builder context → Awareness report → SSWS/Doorway for open → MOD-DIST if “where does idea belong?” → Cycle Observe for suggested queue (human picks).                                        |

---

### 4. Z-COM — Communication envelope

| Field                 | Content                                                                                                                                                                                              |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Outcome**           | **PARTIAL**                                                                                                                                                                                          |
| **Maps to**           | Z-Bridge scripts/reports · `amk_operator_notifications.json` · §9 Completions & Comms · GitHub/CF AI precautions · SSWS · Ω-6 Nervous System **charter only** · decision local bridge (panel parity) |
| **Evidence**          | Hub-local observability and notify queue exist. No universal `Z-MESSAGE` envelope across sibling roots. External talk gated by XBUS metadata (not live bus).                                         |
| **Precise gap**       | Cross-project structured message (`source_id`, `relationship`, `evidence`, `risk`, `resolution_state`) is **not** standardized; Cursor narratives are free-form.                                     |
| **Strengthen first?** | **Yes** — adopt envelope as **documentation template** in Steward/AI rituals (like this review); harden Bridge/Notifications; keep Ω-6 foresight until charter opens.                                |
| **New mechanism?**    | **Not yet** — template ≠ new bridge. Forbidden: create communication bridges in this review.                                                                                                         |
| **DISCOVERY PATH**    | Local issue → Bridge/notification if hub interrupt → SSWS surface → Steward if BLUE/RED → external only via XBUS classification.                                                                     |

---

### 5. Z-RESOLVE — Collision / conflict resolution

| Field                 | Content                                                                                                                                                                                                               |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Outcome**           | **EXISTS** (human-centered) · **PARTIAL** (machine assist)                                                                                                                                                            |
| **Maps to**           | Steward Decision receipts + Pass rollup · Steward Decision Log · Quality Gate · AAFRTC · execution enforcer + `manual_release` · Autonomy ladder · Steward Gate Logic (**outline**) · Alpha A4 (**charter reserved**) |
| **Evidence**          | D2-HOLD · EMK-REHOME · REP-UNKNOWN are live proof of DISCOVERY → CLASSIFY → HOLD/RESOLVE → RECEIPT. Enforcer blocks verify:full without release posture.                                                              |
| **Precise gap**       | No automated conflict classifier in-repo; Steward Gate Logic not an engine (by design). A4 not open.                                                                                                                  |
| **Strengthen first?** | **Yes** — keep human Steward as engine; optional A4 advise-only later; document resolution vocabulary in Atlas.                                                                                                       |
| **New mechanism?**    | **No** — inventing “Z-RESOLVE CPU” would fork Steward authority.                                                                                                                                                      |
| **DISCOVERY PATH**    | Conflict → Triple Path → relationship class → Steward Pass codes → receipt → only then verified text pass (separate gate).                                                                                            |

---

### 6. Z-GUARD — Boundary / external isolation

| Field                 | Content                                                                                                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Outcome**           | **EXISTS**                                                                                                                                                                                       |
| **Maps to**           | Z-XBUS gate + security policy · Turtle Mode · XL2 coupling rules · satellite control-link manifest · visual-automation boundary · PURPLE / NO_GO indicators · voice/sacred-move rules · NAS_WAIT |
| **Evidence**          | XBUS: register/classify/report only; connector ≠ live bus. Replit external URL remains separate citizen. ÉirMind hub indicator NO_GO. Control-link does not scan arbitrary disks.                |
| **Precise gap**       | Zone labels (Internal / Federated / Unverified) are **implicit** across docs, not one operator-facing zone map.                                                                                  |
| **Strengthen first?** | **Yes** — one documentary zone legend citing XBUS + Turtle + satellite + NO_GO (in Atlas or this charter family).                                                                                |
| **New mechanism?**    | **No** — do not build a packet filter product.                                                                                                                                                   |
| **DISCOVERY PATH**    | Entity unknown? → Unverified (no write/merge/secrets) → if known external → XBUS/Federated charter → if Sanctuary citizen → Internal evidence-bound path.                                        |

**External boundary sketch (already enforceable by policy):**

```text
ZSU Internal  ↔  trusted relation (evidence-bound)
External      ↔  explicit federation (XBUS / charter)
Unverified    ↔  no auto-merge / write / credential / deploy
         → Resolution Gate → Steward Receipt
```

---

### 7. Z-MEMORY — Durable operational memory

| Field                 | Content                                                                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Outcome**           | **PARTIAL**                                                                                                                                  |
| **Maps to**           | `data/reports/*` · Zuno snapshots · PC activation receipt · Cycle Observe status · stewardship certificates · Folder Manager / drift reports |
| **Evidence**          | Large report corpus with freshness discipline; many families. AI must not treat model recall as memory.                                      |
| **Precise gap**       | No single index answering “what does the ecosystem remember about X?” across report families; operators hunt by filename.                    |
| **Strengthen first?** | **Yes** — Registry Atlas + EAII knowledge index + Indicator Source Atlas patterns; freshness cadence (already chartered elsewhere).          |
| **New mechanism?**    | **Not yet** — no Z-Memory Engine product.                                                                                                    |
| **DISCOVERY PATH**    | Subject → Atlas/knowledge index → named report path → check `generated_at` → if stale, refresh script (human) → never invent.                |

---

### 8. Z-RECEIPT — Decision / phase memory

| Field                 | Content                                                                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Outcome**           | **EXISTS**                                                                                                                                                                     |
| **Maps to**           | `docs/PHASE_*_GREEN_RECEIPT.md` · Steward Decision docs · Steward Pass rollup · Steward Decision Log · Book D Audit Receipts outline · Trust Chain “no trust without evidence” |
| **Evidence**          | `fad4f56` / `3d0aab0` / `c9555e6` chain; D2/EMK/REP receipts; green receipts ecosystem-wide.                                                                                   |
| **Precise gap**       | Receipt **families** differ in shape; no unified schema (acceptable if indexed).                                                                                               |
| **Strengthen first?** | Light template alignment when Steward wants; do not collapse all receipts into one store.                                                                                      |
| **New mechanism?**    | **No**.                                                                                                                                                                        |
| **DISCOVERY PATH**    | Decision topic → Steward Log / STEWARD*DECISION*_ / PHASE\__\_GREEN_RECEIPT → cite commit hash → treat as authority over chat memory.                                          |

---

## Rollup matrix

| Plane     | Outcome                 | Strengthen existing?                             | New mechanism now? |
| --------- | ----------------------- | ------------------------------------------------ | ------------------ |
| Z-ID      | PARTIAL                 | Yes (Manifest / PC-root fields · keep planes)    | No                 |
| Z-LINK    | PARTIAL                 | Yes (relation notes · Twin Roots)                | No                 |
| Z-PATH    | PARTIAL                 | Yes (Atlas · Awareness · layer UI charter later) | No                 |
| Z-COM     | PARTIAL                 | Yes (envelope as **template**; Bridge/Notify)    | No                 |
| Z-RESOLVE | EXISTS / assist PARTIAL | Yes (A4 later advise-only)                       | No                 |
| Z-GUARD   | EXISTS                  | Yes (zone legend doc)                            | No                 |
| Z-MEMORY  | PARTIAL                 | Yes (index/freshness)                            | No                 |
| Z-RECEIPT | EXISTS                  | Light template only                              | No                 |

### Genuine architectural gaps (precise)

None require a **new spine product** today. Gaps are:

1. **Portable identity record** for siblings (Manifest not runtime).
2. **Typed relationships** in machine-readable form.
3. **Operator discovery path** made explicit (how to find the right plane).
4. **Cross-project message template** (docs ritual, not a bus).
5. **Report/decision memory indexing** (findability).

All five are candidates for **strengthening existing planes** under future Steward gates — not for Z-CPU-2.

---

## How much Z-CPU do we already have?

```text
≈  Identity constitution + multi-plane citizenship     (Z-ID PARTIAL)
≈  Control-link + twin + doorway + steward relations   (Z-LINK PARTIAL)
≈  Awareness + SSWS + Atlas routing                    (Z-PATH PARTIAL)
≈  Bridge + notify + §9 + XBUS metadata                (Z-COM PARTIAL)
≈  Steward Pass + Quality Gate + AAFRTC + enforcer     (Z-RESOLVE EXISTS)
≈  Turtle + XBUS + NO_GO + satellites                  (Z-GUARD EXISTS)
≈  Reports + certificates + Zuno                         (Z-MEMORY PARTIAL)
≈  Green + Steward receipts                            (Z-RECEIPT EXISTS)
```

**Verdict:** We already have a **distributed Z-CPU** under other names. Phase 0 Evidence Review finds **no MISSING plane that fails strengthen-first**.

---

## STOP

```text
PHASE 0 EVIDENCE REVIEW
        ↓
MAP vs GENUINE GAP  ✓
        ↓
STOP  (no implementation · no registry · no UI)
```

**Next Steward choices (closed until opened):**

1. Accept this review as sealed (commit docs-only).
2. Open a **strengthen-first** mini-gate (e.g. documentary zone legend + relation notes) — still not “build Z-CPU.”
3. Open layered Control Panel charter (compass/roster/doorway/identity) — separate domain.
4. Remain on Turtle Hold.

**External-project boundary:** already policy-complete via Z-GUARD; Z-COM template + Steward receipts are enough to talk without absorbing externals into citizenship.
