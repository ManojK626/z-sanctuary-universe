# Z-COMPOSED-AWARENESS-AI-ECOSPHERE-READ-ADAPTER-SPEC-1

**Status:** Specification only · **no adapter runtime** · **no model execution** · **no ledger refresh**
**Date:** 2026-08-24
**START HEAD:** `073bbe4`
**Branch:** `cursor/zsanctuary/z-sdc-phase-0-architecture`

## Baseline

Unrelated porcelain preserved. No `git clean`, reset, amend, push, deploy. No `npm run ai:ecosphere:ledger` / `:delta`. Project World, Crystal DNA, and two-lens composition untouched.

## Purpose

Specify a deterministic **READ-ONLY** adapter so Z Composed Awareness can later answer which AI identities/capabilities are known, registered, configured, advisory, dormant, proposed, or **evidence-backed active** — without confusing registration with activation, ledger with live model, or AI identity with authority.

```text
AI AWARENESS ≠ AI EXECUTION
REGISTERED ≠ ACTIVE
CONFIGURED ≠ RUNNING
DESIGNED ≠ IMPLEMENTED
LEDGER ROW ≠ LIVE MODEL
GREEN BAND ≠ AI ONLINE
AI IDENTITY ≠ AI AUTHORITY
AI PROPOSAL ≠ SYSTEM FACT
AI PERSONA ≠ PROJECT
AI ASSOCIATION ≠ OWNERSHIP
```

No adapter implementation in this gate. The adapter itself must never require AI.

## Current Composed-Awareness Standing

| Layer | Standing |
| ----- | -------- |
| Project World P0 + TEVV | PASS |
| Crystal DNA P0 + custody + TEVV | PASS · CLEAN |
| Project World + Crystal DNA composition P0 + TEVV | PASS |
| Composed envelope | Untouched |

## TEVV Observations Carried Forward

| ID | Severity | Carry into AI Ecosphere design |
| -- | -------- | ------------------------------ |
| OBS-ID-001 | OBSERVATION | Distinguish `MISSING_AI_ID` vs `DUPLICATE_AI_ID`. Do not repair Crystal DNA child. |
| OBS-COMP-001 | OBSERVATION | AI projection must declare `schema_version`, `projection_id`, `projection_version`. Future three-lens **acquisition** must reject unsupported versions **before** compose. Do not modify current `compose()`. |
| OBS-COMP-002 | OBSERVATION | Define same-field conflict channel now. Future `cross_lens_conflicts[]` must retain incompatible claims. Current two-lens `conflicts:[]` is not a blocker. |

All three: **NOT CURRENT BLOCKER**.

## AI Ecosphere Canon

Discovered (not guessed): `data/z_ai_ecosphere_config.json` purpose — unify **observability** for Z-SSWS, Z-Mega/QOSMEI families, AI Tower, shadow pipelines, mini-bots. **Advisory scores — not autonomous execution authority.** Ledger `governance_note`: Hierarchy Chief, DRP, and Enforcer are not overridden.

Prior composed-awareness read-model spec already stated REGISTERED ≠ ACTIVE and band green ≠ live model. This spec binds that to exact files.

## Source Discovery

Search covered `docs/`, `data/`, `scripts/`, `dashboard/`, `config/` for AI Ecosphere, ledger, colony, MiniBot, band, sync_score, registered/active. Essential **machine-readable** ecosphere state **exists**. No invented ledger.

## Source Resolution Matrix

| Role | Exact path | Exists | Type | Maturity | Read-adapter use |
| ---- | ---------- | ------ | ---- | -------- | ---------------- |
| Ecosphere configuration | `data/z_ai_ecosphere_config.json` | YES | configuration | CANONICAL registry of rings, actor_classes, data_source map | **P0 READ** |
| Machine ledger | `data/reports/z_ai_ecosphere_ledger.json` | YES | generated report | Tracked derived; `generated_at` 2026-05-03 | **P0 READ** (fixture, not SoT of live AI) |
| Ledger markdown | `data/reports/z_ai_ecosphere_ledger.md` | YES | generated report | Derived sibling of JSON | Optional human lens; prefer JSON |
| Ledger previous | `data/reports/z_ai_ecosphere_ledger.prev.json` | YES | generated snapshot | Delta input | Not P0 identity SoT |
| Delta report | `data/reports/z_ai_ecosphere_delta.json` | YES | generated report | Derived | Not P0 unless needed for unmatched |
| Refresh producer | `scripts/z_ai_ecosphere_ledger_refresh.mjs` | YES | WRITE / REFRESH | `npm run ai:ecosphere:ledger` | **Do not run** · not adapter |
| Delta producer | `scripts/z_ai_ecosphere_delta.mjs` | YES | WRITE | `npm run ai:ecosphere:delta` | **Do not run** |
| Dashboard / lens | `dashboard/z-ai-ecosphere/` | YES | visualization | Loads ledger + KRTAAO + PAPAO + Zuno | **Not** runtime truth |
| Universe map (separate) | `dashboard/Html/z-universe-ecosphere-map.html` | YES | visualization | Living map UI | Out of P0 consume set |
| AI Tower / MiniBot machine report | `data/reports/z_ai_status.json` | YES | generated report | Tower `blueprint` / agents `planned`; miniai `online: false` | **P0 READ** runtime-evidence **as declared** |
| QOSMEI vision manifest | `data/z_qosmei_manifest.json` | YES | configuration | `status: active` in **QOSMEI namespace**; families `shadow: true` | Optional P0 overlay; ≠ swarm live |
| SSWS / AI Colony blueprint | `docs/Z-SSWS-ALL-PROJECTS-AND-AI-COLONY-BLUEPRINT.md` | YES | doctrine / blueprint | Intended all-projects + colony | BLUEPRINT only |
| Family AI registry JSON | `data/z_family_ai_registry.json` | YES on disk | identity registry | **Untracked** | **Not P0** until custody |
| Family AI registry doc | `docs/governance/Z_FAMILY_AI_REGISTRY.md` | YES | doctrine | Untracked JSON sibling | Semantics only until JSON sealed |
| Shadow workspace manifest | `data/z_ssws_shadow_manifest.json` | YES | generated/config | **Worktree dirty** | **Not P0** |
| Config-listed health reports | e.g. `data/reports/z_ai_signal_health.json` | YES | generated | Several currently dirty | **Not P0** (avoid dirty fan-in) |
| Traffic MiniBots script | `scripts/z_traffic_minibots_status.mjs` | YES | WRITE/status tool | Worktree dirty | **Do not run** |

If these P0 JSON files were absent: `AI_ECOSPHERE_READ_ADAPTER_SOURCE_UNRESOLVED`. They are present.

## Read / Write Classification

| Artifact | Class |
| -------- | ----- |
| `z_ai_ecosphere_config.json` | READ SOURCE |
| `z_ai_ecosphere_ledger.json` | DERIVED REPORT (producer: refresh script) |
| `z_ai_status.json` | DERIVED REPORT (Tower/MiniBot declared state) |
| Refresh / delta scripts | WRITE / REFRESH TOOL |
| `dashboard/z-ai-ecosphere/` | VISUALIZATION |
| Colony / SSWS all-projects doc | BLUEPRINT / DOCTRINE |
| QOSMEI manifest | CONFIGURATION (vision/engineering map) |
| Live LLM / provider APIs | RUNTIME — **out of scope; no contact** |

## AI Identity Model

Do **not** collapse everything named “AI” into one count.

Conceptual families (evidence-backed):

| Family | Current evidence | Not |
| ------ | ---------------- | --- |
| Observability **ring** | config/ledger `rings[]` ids `z_ssws`, `z_mega_formulas`, `ai_tower`, `shadow_minibots` | A live process |
| **Actor class** | config `actor_classes` | An instance |
| Tower **agent** | `z_ai_status.agents[]` id + `status: planned` | Running agent |
| **MiniBot** | `z_ai_status.miniai[]` name + `online` + `mode: observer` | Live LLM |
| **Persona / observer** | Zuno (family registry / Zuno docs) | Model runtime |
| **Human steward** | AMK-Goku in untracked family registry | AI identity |
| **Family project** | Sister Aisling Sol, AT Princess (pc_root + family registry) | Hub AI process |
| **Provider / model name** | Not in P0 ecosphere JSON | Identity |

Conceptual records (not executable schema): AIIdentity, AIRegistration, AIRuntimeState, AIProjectAssociation, AILedgerEntry, AIAdvisorySignal, AIProviderReference, AIModelReference, AIEvidence, AIConflict — **only fields supported by sources**.

## Persona / MiniBot / Model / Provider Boundaries

- **Zuno** ≠ a specific model runtime unless a source explicitly binds them. P0 ecosphere JSON does not bind a provider/model id to Zuno.
- **MiniBot** `online: false` + `mode: observer` ≠ live model process.
- NAME CONTAINS “AI” ≠ LIVE LLM (QOSMEI, AI Tower, AI Colony, AI Ecosphere).
- Provider/model: P0 ecosphere sources do **not** list API model ids. If later sources do: preserve provider/model/config refs; **do not** test availability; **no credentials**.

## Registration Model

**REGISTERED** in this architecture means: known to ecosphere config/ledger rings, or listed in `z_ai_status` agents/miniai, or (later) a sealed identity registry row.

It does **not** mean enabled, active, executing, reachable, online, or autonomous.

## Configuration Model

Config file exists (`z_ai_ecosphere_config.json`) and QOSMEI manifest exists. **CONFIG FILE EXISTS ≠ PROCESS RUNNING.** QOSMEI `status: active` is a **manifest field in the QOSMEI namespace**, not verified swarm execution (F5A still treats formula-swarm/QOSMEI runtime as dormant/separate).

## Runtime-Evidence Model

**P0: source-declared state only. NO LIVE PROCESS PROBING.**

`z_ai_status.json`:

- `ai_tower.tower_phase`: `blueprint`
- `planned_rollout_only`: true
- `intent_surface`: `planned_agents_manifest_only`
- agents: `status: planned`, `lastPulse: null`
- miniai: `online: false`

**ACTIVE** (future claim) requires evidence stronger than registration: an explicit source runtime field meaning live execution **or** a later chartered runtime report. Current P0: **VERIFIED ACTIVE COUNT = 0** is the evidence-backed result.

**NO VERIFIED RUNTIME EVIDENCE ≠ PROVEN INACTIVE.** Use UNVERIFIED / MISSING / source-declared `online: false` without coercing to inactive-as-health.

## Advisory Ledger Model

Ledger is **advisory derived** from hub JSON reports (`governance_note`). Rings carry `sync_score`, `band`, `potential_label`, `color`. Task samples include example MiniBot/ssws_task rows — treat as ledger content with provenance, not proof of live bots.

AI-generated summaries in later sources: `AI_PROPOSED` / source-equivalent — not HUMAN_CONFIRMED / CANONICAL / AUTHORIZED.

## Band / Score Boundaries

Ledger `bandFromPct` in producer (do not run): ≥80 green “high potential”; ≥55 yellow “developing”; else red “needs attention”.

| Band/value | Source meaning | Runtime implication | Authority |
| ---------- | -------------- | ------------------- | --------- |
| green | Advisory sync/potential band from derived scores | **None** (≠ ACTIVE MODEL) | **NO** |
| yellow | Developing / watch | None | **NO** |
| red | Needs attention (advisory) | None | **NO** |
| `sync_score` | Source-local advisory metric | ≠ truth/quality/readiness/authority | **NO** |
| `potential_label` | Label paired with band | None | **NO** |

GREEN BAND ≠ HEALTHY PROJECT ≠ DEPLOY AUTHORITY ≠ TRUTH.

SOURCE SCORE = SOURCE-LOCAL ADVISORY FIELD. No new mathematics. No composed universal AI score.

## Project Association

P0 ecosphere config/ledger **do not** list `pc_root` project ids. Rings are hub observability surfaces.

| AI identity | Candidate project | Evidence | Association | Ownership |
| ----------- | ----------------- | -------- | ----------- | --------- |
| Ecosphere rings | Hub observability | config rings | Hub-level lens, not 22-project join | **NO** |
| Tower agents / MiniBots | Unspecified project | `z_ai_status` only | **NONE VERIFIED** to a Project World id | **NO** |
| Roulette / Z-Wheel | `replit-roulette-z-amk-goku-mdcp` | **No** mention in config or ledger | **MISSING / NONE VERIFIED** | **NO** |
| Sister Aisling / ÉirMind | `sister-aisling-sol` | Family registry + pc_root (Project World) | **PROJECT identity**; not a new project from a persona | **NO** (steward project) |

AI ASSOCIATED WITH PROJECT ≠ AI OWNS PROJECT. PROJECT USES AI ≠ IDENTITY MERGE. Display-name inference **forbidden**.

## Sovereignty

Adapter must never change Project World sovereignty (SEPARATE ↛ MEMBER, EXTERNAL ↛ INTERNAL).

## Roulette / Z-Wheel

Ecosphere config and ledger: **no** Roulette/Z-Wheel association. QOSMEI `ethics.roulette` is formula-observation policy, **not** product ownership. Adapter: AI ASSOCIATION **NONE VERIFIED**. Do not absorb the sovereign product.

## Blueprint / Runtime Boundary

Colony / All-Projects doc describes intended SSWS-everywhere + AI colony (Tower, Skyscraper) as brain. That remains **PROPOSED / BLUEPRINT** unless implementation + live evidence exist.

## AI Colony / Swarm Boundary

| Capability | Blueprint | Implementation | Live | Current posture |
| ---------- | --------- | -------------- | ---- | --------------- |
| AI Colony (Tower + Skyscraper as collective brain) | YES (`Z-SSWS-ALL-PROJECTS-AND-AI-COLONY-BLUEPRINT.md`) | Partial hub tools; not a live colony process | **UNVERIFIED** | BLUEPRINT |
| AI Tower agents | Manifest in `z_ai_status` | `planned` / blueprint phase | **NO** (`lastPulse` null, planned_only) | DESIGNED / PLANNED |
| MiniBots | Listed | observer mode | Source `online: false`; not process-probed | REGISTERED + DECLARED NOT ONLINE |
| QOSMEI / formula swarm | Manifest `status: active`, families shadow | F5A/formula kernels separate | Swarm **not** proven live by ecosphere ledger | CONFIGURED / SHADOW FAMILIES |
| Visual/QOSMEI swarm vs ecosphere | Legacy reconciliation | Sibling surfaces | Do not merge | DISTINCT |

## Activity Evidence

P0: **no process probing**. ACTIVITY from explicit declared fields only. Current verified live activity: **none**. Timestamp `generated_at` ≠ AI recently executed.

## Freshness

Preserve timestamps (`generated_at` on ledger ~2026-05-03, `z_ai_status` similar). Do **not** invent CURRENT/STALE thresholds. Recent refresh ≠ activity proof. **Do not refresh** to “fix” age in this or the first implementation gate without a custody/implementation charter.

## Missing / Unknown / Unverified

Distinguish MISSING · UNKNOWN · UNVERIFIED · NOT_APPLICABLE. No coercion to false / 0 / inactive / offline unless the source field explicitly states that value (e.g. `online: false` stays `online: false` in source namespace).

## Conflict Semantics

**Same semantic field + incompatible source claims = CONFLICT.** No auto-winner. Preserve both claims and sources.

**Different dimensions ≠ conflict.** Examples: REGISTERED + DORMANT; GREEN band + `online: false`; QOSMEI manifest `active` + Tower `planned`.

Example same-field candidate (future adapter must not silently pick): ledger ring `z_mega_formulas.sync_score` (66) vs nested `delta.rings.z_mega_formulas.current` (94) in the same ledger file — treat as **ledger-internal conflict / unmatched consistency**, not as live-AI activity.

Carries **OBS-COMP-002** into three-lens `cross_lens_conflicts[]`.

## Provenance

Every claim: source path, record id, namespace, identity, source-declared status, origin, timestamp/version if present. ACTIVE requires stronger evidence than registration. **No provenance → no verified identity/link/activity.**

## Source Origin

REAL_SOURCE (config bytes) · DERIVED_REAL (ledger, `z_ai_status`) · PROPOSED (colony blueprint) · MOCK/example task samples in ledger · LEGACY (visual swarm labels) · UNKNOWN otherwise. Do not blur blueprint and runtime.

## Version Contract

Carries **OBS-COMP-001**. Future projection:

- `schema_version`
- `projection_id` (recommended: `z_composed_awareness_ai_ecosphere_p0`)
- `projection_version`

Unsupported versions: hard-stop **before** composition. Do not patch two-lens `compose()` in this gate.

## Source Custody

| Intended P0 machine input | Tracked | Worktree vs HEAD | Derived? | P0 consume? |
| ------------------------- | ------- | ---------------- | -------- | ----------- |
| `data/z_ai_ecosphere_config.json` | YES | Clean (this gate) | No | YES |
| `data/reports/z_ai_ecosphere_ledger.json` | YES | Clean (this gate) | YES (refresh producer) | YES |
| `data/reports/z_ai_status.json` | YES | Clean (this gate) | YES | YES |
| Family AI JSON | NO (untracked) | Unsealed | No | NO until sealed |
| `z_ssws_shadow_manifest.json` | YES | **Dirty** | Yes | NO |
| Config-listed dirty health JSON | Often dirty | Dirty | Yes | NO |

**ARE ALL INTENDED MACHINE INPUTS SEMANTICALLY SEALED?** **YES** for the P0 consume set above.

Ledger generation: producer `scripts/z_ai_ecosphere_ledger_refresh.mjs`; inputs = config `data_sources` map (many reports). Tracked ledger currently clean. **Do not run producer.** Before later refresh: custody reconciliation of **inputs**, not silent regenerate.

## Determinism

Same source bytes + same adapter version = same projection. No network, AI calls, randomness, clock-as-fact, database. Copy source timestamps only.

## Non-Mutation

Must not modify AI registry/ledger/config/reports, Project World, Crystal DNA, or existing composed report.

## GARE Boundary

AI ECOSPHERE ≠ GARE EXECUTOR. AI AVAILABLE/ACTIVE/REGISTERED/ADVISORY BAND ≠ repair authorized, Overseer, or Hierarchy Chief.

## Self-Awareness Contribution

AI capability / registration / runtime-evidence **awareness** only. Not machine consciousness.

## Source-to-Entity Matrix

| Source | Proves | Does not prove |
| ------ | ------ | -------------- |
| Ecosphere config | Ring ids, actor classes, which reports the ledger *may* read | Live AI, project ownership |
| Ecosphere ledger | Derived advisory bands/scores, copied notes, task samples | Live model, authority, project health |
| `z_ai_status.json` | Declared tower phase, planned agents, miniai online flags | Process liveness (no probe) |
| Dashboard HTML/JS | UI over ledger | Source truth |
| Colony blueprint | Intended topology | Implementation / live swarm |
| QOSMEI manifest | Declared vision status + shadow families | Swarm online |
| Family AI JSON (untracked) | Stewardship identities (once sealed) | Runtime |
| Refresh script | How ledger is written | Must not be an adapter input |

## State-Semantic Matrix

| Source state | Namespace | Meaning | May imply ACTIVE? | Authority? |
| ------------ | --------- | ------- | ----------------- | ---------- |
| ring `band` green/yellow/red | `AI_ECOSPHERE_LEDGER_BAND` | Advisory potential/sync | **NO** | **NO** |
| `sync_score` | `AI_ECOSPHERE_LEDGER_SCORE` | Derived advisory number | **NO** | **NO** |
| tower `planned` / `blueprint` | `AI_TOWER_STATUS` | Designed, not rolled out | **NO** | **NO** |
| miniai `online: false` | `MINIBOT_DECLARED_ONLINE` | Source-declared not online | **NO** | **NO** |
| miniai `mode: observer` | `MINIBOT_MODE` | Observer posture | **NO** | **NO** |
| QOSMEI `status: active` | `QOSMEI_MANIFEST` | Manifest self-status | **NO** | **NO** |
| formula family `shadow: true` | `QOSMEI_FAMILY` | Shadow until promoted | **NO** | **NO** |
| actor listed in config | `AI_ECOSPHERE_REGISTRATION` | Known class | **NO** | **NO** |

## Project-Association Matrix

See Project Association table. Ownership implied: **NO** everywhere.

## Runtime-Evidence Matrix

| Identity | Evidence source | Claim | Verified live? | Freshness |
| -------- | --------------- | ----- | -------------- | --------- |
| ai-agent-* (×4) | `z_ai_status.agents` | `planned`, `lastPulse` null | **NO** | `generated_at` present |
| ScribeBot et al. (×4) | `z_ai_status.miniai` | `online: false`, observer | **NO** (declared) | same |
| Ledger rings | ledger | bands/scores | N/A (not runtime) | `generated_at` 2026-05-03 |
| AI Colony swarm | blueprint only | intended collective | **UNVERIFIED** | n/a |

## Blueprint / Live Matrix

See AI Colony / Swarm table.

## Current Coverage

| Question | Evidence now |
| -------- | ------------- |
| Observability rings | **4** |
| Tower agents listed | **4** (planned) |
| MiniBots listed | **4** (`online: false`) |
| Collapsed “total AIs” | **UNKNOWN** (do not mix rings, agents, humans, projects) |
| Registered (typed) | Rings + agents + minibots **known to sources** |
| Project associations to Project World ids | **NONE VERIFIED** in P0 ecosphere JSON |
| Verified active runtimes | **0** |
| Dormant (normalized) | **UNKNOWN** (do not invent); preserve declared fields |
| Unverified runtime | Agents + MiniBots (no process proof) |
| Unmatched | **UNKNOWN** until adapter enumerates |
| Conflicts | Ledger internal score mismatch candidate; no auto-resolve |
| Family overlay | **UNKNOWN** for P0 (untracked JSON) |

## First Implementable Slice

AI identity **typed records** + registration (known-to-source) + source-declared configuration + source-declared runtime evidence + explicit project associations (likely empty) + advisory ledger values + provenance + missing/unmatched/conflict. **No** model execution, network, ledger refresh, dashboard, process probe.

Recommended tree (later): `scripts/z_composed_awareness_ai_ecosphere/` · generator/verifier isolated. Output: `data/reports/z_composed_awareness_ai_ecosphere_p0.json`. Do **not** modify Project World / Crystal DNA / composed PW+DNA reports.

## Future Machine Output

`data/reports/z_composed_awareness_ai_ecosphere_p0.json` — intermediate sibling lens. Conceptual shape: schema/projection ids, sources[], typed identities[], registrations[], project_associations[], runtime_evidence[], advisory_ledger[], conflicts[], unmatched_records[], derived summary counts only where categories exist. No AI quality score.

## Future Verification

Independent tests: source resolution, custody, unique AI ids, missing vs duplicate ids, REGISTERED≠ACTIVE, config≠activity, ledger≠activity, green≠runtime, explicit association, association≠ownership, persona≠project, model≠identity, missing runtime≠inactive, dimensions≠conflict, same-field conflicts retained, provenance, unmatched retention, non-mutation, determinism, no network/AI/refresh/GARE eligibility.

## Future TEVV

Attack at least: duplicate/missing AI id; same display name / different ids; case/spelling alias; registered/config/ledger GREEN/timestamp/blueprint/colony/MiniBot/persona/sovereignty/missing→inactive/false-conflict/auto-resolve/AI_PROPOSED→fact/sync_score→truth/no provenance/refresh executed/network call/GARE from AI availability.

## Three-Lens Composition Preparation

```text
Z COMPOSED AWARENESS
├── PROJECT WORLD
├── CRYSTAL DNA
├── AI ECOSPHERE
└── EXPLICIT CROSS-LENS RELATIONSHIPS
```

No lens owns the others. Sequence: AI P0 projection → verify → TEVV → **then** compose. Do not fold AI into Project World first. Crystal DNA status/deps not inherited. Future acquisition validates **all** child versions (OBS-COMP-001). Future compose supports evidence-backed `cross_lens_conflicts[]` (OBS-COMP-002). Do not change current composition runtime now.

## Hard Stops

- Essential machine ecosphere JSON missing → `AI_ECOSPHERE_READ_ADAPTER_SOURCE_UNRESOLVED`
- Duplicate AI id → fail-safe or explicit ambiguity; no winner
- Missing AI id ≠ duplicate code (OBS-ID-001 lesson)
- Ambiguous project association → NO association + conflict
- Refresh/network/model invocation inside adapter → FAIL

## Non-Goals

No activating AI, prompts, APIs, MiniBot/Swarm/Colony enablement, GARE, Project World/DNA/composition edits, dashboard implementation, production claims, consciousness claims.

## Maturity

**AI_ECOSPHERE_READ_ADAPTER_SPEC_READY**

Claim only: specified read contract for a future sibling lens. Not implemented. Not live AI awareness runtime.

## ONE Recommended Next Gate

**Z-SANCTUARY-COMPOSED-AWARENESS-AI-ECOSPHERE-READ-ADAPTER-P0-IMPLEMENTATION-1**

P0 machine inputs (config, ledger JSON, `z_ai_status.json`) are tracked and currently clean. Do not run ledger refresh. Re-check hashes at implementation start. Exclude dirty/untracked overlays until sealed.
