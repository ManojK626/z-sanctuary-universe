<!-- Z: docs/amk-goku-steward-ai/SSR_RECONSTRUCTION_R1_ARCHITECTURE_AND_DATA_CONTRACTS.md -->

# SUPER SAIYAN ROULETTE — RECONSTRUCTION R1
# ARCHITECTURE & DATA CONTRACTS

**Phase:** SSR-RECONSTRUCTION-R1
**Date:** 2026-08-09
**Authority:** AMK-Goku Steward Authorization
**Mode:** EVIDENCE → MODEL → CONTRACT → CHALLENGE → REPORT → STOP
**Status:** DESIGN ONLY · IMPLEMENTATION NOT AUTHORIZED
**Depends on:** R0 seal `ad286e8` — `SSR_IMPLEMENTATION_UNAVAILABLE_STEWARD_SEAL.md` + `SSR_RECONSTRUCTION_0_CHARTER.md`
**Preserves (read-only):** Census 0 @ `74660d3` · Census 1 @ `28b153f`
**Canonical Pro App modified:** NO

---

## 0. Objective

Design the architecture that a **later** Flutter implementation will follow.

This architecture must support reconstructed SSR **without pretending UNKNOWN historical behavior has been recovered**.

R0 provenance law is permanent:

| ProvenanceClass |
| --- |
| ORIGINAL |
| LATER_SSR_EVOLUTION |
| RELATED_WIDER_Z_FAMILY |
| NEW_RECONSTRUCTION |
| UNKNOWN |

**R1 is design only.** No Flutter init, no application source, no dependency install, no Firebase, no UI, no registry/Doorway edits, no deploy, no push.

---

## 1. Evidence summary (carry-forward)

| Finding | Implication for architecture |
| --- | --- |
| Flutter / formulas NOT RECOVERED | Spec-state must block silent “historical” executables |
| README proves intent, not implementation | Domain contracts model intent; engines versioned as NEW when invented |
| Whis → SKK evidenced | TeacherIdentity supports succession without erasing Whis |
| Shadow = companion challenge | Separate capability; never bet execution |
| Six-table / six-candidate / exact LPBS / Z math | Configurable / UNRESOLVED — not hard-coded as historical truth |
| Wider Z-Family systems exist beside SSR | Adapter boundary only; no automatic membership |

---

## 2. Architectural principle

Prefer layered ownership:

```text
DOMAIN LOGIC          ← roulette math, facts, derived observations (pure, offline-testable)
        ↓
APPLICATION SERVICES  ← use-cases, orchestration, policy gates
        ↓
DATA / STORAGE        ← local-first persistence; optional cloud later
        ↓
PRESENTATION          ← Flutter UI (future); never source of truth for math
```

**AI advisory capability is separated from deterministic analytics.**

Forbidden as source of truth for Roulette mathematics:

- UI code
- AI prompts / model outputs
- Firebase / external services
- Wider Z-Family buses

Core analytics must eventually be **testable offline and independently**.

---

## 3. Layer model (binding)

### 3.1 FACT

Immutable (except explicit correction events) recorded reality.

Examples:

- spin 17 occurred
- table A has 120 recorded spins
- number 8 has not occurred for N recorded spins (as a restatement of fact window — see drought as DERIVED)

Contract rule: **AI MUST NOT rewrite FACT.**

### 3.2 DERIVED OBSERVATION

Deterministic calculation over a declared FACT window + algorithm version.

Examples:

- drought length
- frequency
- zone state
- Z observation
- LPBS observation

Contract rule: Derived outputs must declare `AlgorithmSpecRef`, window, and `SpecificationStatus`. If status is UNRESOLVED / CONFLICT for a historical claim, the engine must not claim ORIGINAL executability.

### 3.3 ADVISORY INTERPRETATION

Teacher / Shadow / AI commentary over facts + derived observations.

Examples:

- Whis explanation
- SKK teaching
- Shadow challenge
- AI-generated commentary

Contract rule: Advisory remains distinguishable from deterministic derived calculations. Never promoted to FACT.

```text
FACT  ──►  DERIVED OBSERVATION  ──►  ADVISORY INTERPRETATION
 ▲                ▲                         │
 │                │                         │
 └──── AI cannot rewrite ───────────────────┘
       Advisory cannot alter FACT
```

---

## 4. Specification-state mechanism (unknown formula contract)

Architecture must make unresolved historical algorithms **impossible to silently implement as historical truth**.

### 4.1 SpecificationStatus

| Status | Meaning |
| --- | --- |
| CONFIRMED | Historical behavior strongly specified and Steward-accepted |
| PARTIAL | Concept attested; incomplete semantics |
| UNRESOLVED | Insufficient historical formula |
| CONFLICT | Competing historical definitions |
| RECONSTRUCTED_NEW | Modern Steward-gated design; not historical |

### 4.2 AlgorithmSpec record (conceptual)

| Field | Intent |
| --- | --- |
| `specId` | Stable id (e.g. `LPBS-HISTORICAL`, `LPBS-R1`) |
| `displayName` | Human label |
| `provenance` | ProvenanceClass |
| `specificationStatus` | SpecificationStatus |
| `executable` | boolean — false unless Steward gate + CONFIRMED or RECONSTRUCTED_NEW |
| `version` | Spec version string |
| `evidenceRefs` | EvidenceReference[] |
| `unknowns` | Explicit unresolved questions |
| `supersedes` / `supersededBy` | Optional lineage links |

### 4.3 Binding examples

```text
LPBS-HISTORICAL
  provenance = ORIGINAL
  specificationStatus = UNRESOLVED
  executable = false

LPBS-R1
  provenance = NEW_RECONSTRUCTION
  specificationStatus = RECONSTRUCTED_NEW
  executable = future Steward gate only

Z1-Z18-HISTORICAL
  provenance = ORIGINAL
  specificationStatus = UNRESOLVED
  executable = false

ZX-HISTORICAL / ZN-HISTORICAL
  provenance = ORIGINAL (labels / documentary)
  specificationStatus = UNRESOLVED
  executable = false

HeatZone-HISTORICAL
  provenance = ORIGINAL
  specificationStatus = UNRESOLVED   # five-zone map not recovered
  executable = false
```

Any future executable strategy **must** reference a versioned `AlgorithmSpec` with `executable=true` under Steward authorization. Presentation and AI layers may discuss UNRESOLVED specs but must not run them as historical truth.

---

## 5. Domain contracts (conceptual types)

Names are **proposed**, not final. Clearer synonyms may replace them in R2+ if justified — rename via Steward note, do not silently redefine semantics.

### 5.1 Core roulette facts

| Contract | Purpose |
| --- | --- |
| `RouletteNumber` | 0–36 (European assumed unless session declares otherwise); unknown wheel variants flagged |
| `RouletteColor` | red / black / green (0) — derived from number map, not AI |
| `RouletteSpin` | Fact: number, optional timestamp, sequence index, table id, correction flag |
| `RouletteTable` | Stable table identity + display metadata |
| `TableSession` | Bounded play/analysis window on a table |
| `SpinHistory` | Ordered fact collection for a session or table |

### 5.2 Z-family observations (derived)

| Contract | Purpose |
| --- | --- |
| `ZMetric` | Named metric identity (Z1…Z18, ZX, ZN families) |
| `ZLevel` | Level / window parameter where historically partial |
| `Z1ToZ18Observation` | Derived drought/cold observation; requires AlgorithmSpecRef |
| `ZXObservation` | Derived multiplier observation; UNRESOLVED historical math |
| `ZNObservation` | Derived Zn observation; boundary with Z1–Z18 UNRESOLVED |

### 5.3 LPBS

| Contract | Purpose |
| --- | --- |
| `LPBSObservation` | Derived observation under a declared spec |
| `LPBSConfiguration` | User/session parameters (windows, units) — not historical truth by default |
| `LPBSHistoricalUnknown` | Explicit carrier for UNRESOLVED / CONFLICT historical claims |
| `LPBSReconstructedStrategy` | NEW_RECONSTRUCTION strategy; Steward-gated executable |

### 5.4 Heat / drought / pattern

| Contract | Purpose |
| --- | --- |
| `HeatZone` | Zone identity under a declared HeatZone spec |
| `HeatZoneObservation` | Derived zone state |
| `DroughtObservation` | Derived absence length for a number/set |
| `FrequencyObservation` | Derived frequency over window |
| `PatternObservation` | Derived pattern descriptor (deterministic rules only) |
| `CandidateObservation` | Ranked/observed candidates — never guarantees; count **configurable**, not historically fixed at 6 |

### 5.5 Multi-table

| Contract | Purpose |
| --- | --- |
| `MultiTableSession` | Concurrent analysis spanning N tables |
| `TableSnapshot` | Point-in-time fact+derived bundle per table |

**Table count limit:** `ConfigurableLimit` (NEW_RECONSTRUCTION policy). Do **not** encode “6 tables” as historical truth.

### 5.6 Money / responsible use (separated from prediction)

| Contract | Purpose |
| --- | --- |
| `BankrollSnapshot` | Tracking only |
| `SessionLimit` | Budgets / caps / time limits |
| `ResponsibleUseState` | Aggregated limit adherence, cool-off, warnings |

Separated from prediction/advisory engines. **No loss-chasing automation. No autonomous wager sizing.**

### 5.7 Provenance & evidence

| Contract | Purpose |
| --- | --- |
| `EvidenceReference` | Pointer to census, README, RL-Goku, steward seal, etc. |
| `ProvenanceClass` | R0 enum |
| `SpecificationStatus` | Spec-state enum |
| `ConfidenceLevel` | Explicit uncertainty band for outputs that need it |

### 5.8 Teachers & stewardship

| Contract | Purpose |
| --- | --- |
| `TeacherIdentity` | Whis / SKK / Shadow / future — with provenance |
| `TeacherMessage` | Advisory message payload |
| `AdvisoryObservation` | Structured advisory linked to facts/derived ids |
| `AIContribution` | Model contribution metadata (provider, prompt version) — never FACT |
| `ShadowChallenge` | Alternative interpretation / dissent record |
| `HumanStewardDecision` | Gate decisions, seals, opens, holds |

---

## 6. Analytical output envelope (responsible analytics contract)

Every future analytical output **should be capable of exposing**:

| Field | Required intent |
| --- | --- |
| `sourceDataWindow` | Spin range / time range / session ids |
| `calculationOrVersion` | AlgorithmSpecRef + version |
| `provenance` | ProvenanceClass of the *method* |
| `specificationStatus` | SpecificationStatus |
| `confidenceOrUncertainty` | Where relevant |
| `explanation` | Human-readable method note (not marketing guarantee) |
| `timestampOrFreshness` | Produced-at / stale-after |

Envelope applies to DERIVED and ADVISORY outputs. FACT records expose provenance of *recording*, not prediction confidence.

Forbidden output language (R0): GUARANTEE, CERTAINTY, PROMISED WIN, GUARANTEED PROFIT.

Allowed: OBSERVATION, PATTERN, FREQUENCY, DROUGHT, HEURISTIC, SIMULATION, UNCERTAINTY.

---

## 7. AI / teacher contracts (no AI implementation)

### 7.1 Roles

| Role | Provenance | Posture |
| --- | --- | --- |
| **WHIS** | ORIGINAL | Early teacher / guide — explanatory/advisory |
| **SKK** | LATER_SSR_EVOLUTION | Supreme Teacher / Ask SKK — advisory |
| **SHADOW** | LATER_SSR_EVOLUTION | Challenge / alternative interpretation — **never** automatic execution authority |
| **WIDER Z-FAMILY** | RELATED_WIDER_Z_FAMILY | External interface boundary only — **no** automatic SSR membership |

### 7.2 Capability vs authority

| May | Must not imply |
| --- | --- |
| TEACH | EXECUTE BET |
| ANALYZE | ALTER FACT |
| EXPLAIN | OVERRIDE STEWARD |
| CHALLENGE | CLAIM CERTAINTY |
| SYNTHESIZE | Autonomously change limits or bankroll |

`TeacherAuthorityPolicy` (conceptual): capabilities are additive flags; execution/betting flags are permanently denied for all AI teachers in this charter.

---

## 8. Application services (conceptual)

Design-only service boundaries (names provisional):

| Service | Responsibility |
| --- | --- |
| `SpinIngestionService` | Record / correct FACT spins |
| `SessionLifecycleService` | Start/end table & multi-table sessions |
| `DeterministicAnalyticsService` | Run only executable AlgorithmSpecs offline |
| `SpecRegistryService` | Resolve specs; refuse executable=false historical claims |
| `AdvisoryOrchestrationService` | Route Ask Whis/SKK/Shadow; attach envelopes |
| `BankrollTrackingService` | Tracking only |
| `ResponsibleUseService` | Limits, cool-offs, block advisory that urges chase |
| `StewardGateService` | Record HumanStewardDecision; gate stage opens |
| `ExportImportService` | Portable local bundles |

UI and AI providers call services; they do not own math.

---

## 9. Data model — storage boundaries

Conceptual stores (local-first preferred):

| Boundary | Contents |
| --- | --- |
| Tables | `RouletteTable` identities |
| Sessions | `TableSession`, `MultiTableSession` |
| Spins | `RouletteSpin` facts + correction log |
| Analytics snapshots | Cached DERIVED envelopes (recomputable) |
| User preferences | Display, accessibility, configurable limits |
| Responsible-use limits | `SessionLimit`, `ResponsibleUseState` |
| Teacher / advisory history | `TeacherMessage`, `ShadowChallenge`, `AdvisoryObservation` |
| Provenance | Evidence refs, decision log |
| Algorithm specification versions | `AlgorithmSpec` registry (local) |

**Cloud sync / authentication:** optional later. **Not required** for core deterministic analytics.

**No Firebase implementation in R1.**

Ownership: local data is Steward/user-owned by default; cloud copies are replicas with explicit consent (future).

---

## 10. Multi-table design notes

- `MultiTableSession` references N `RouletteTable` ids.
- `maxTables` is a `ConfigurableLimit` with default TBD in a later NEW policy — **not** historical “6”.
- Cross-table derived metrics must declare whether windows are independent or pooled.
- Candidate counts similarly configurable — **not** fixed historical “6”.

---

## 11. Money management separation

```text
[Bankroll / Session tracking]   [Limits / Budgets]   [Historical outcomes]
                 ╲                    │                    ╱
                  ╲                   │                   ╱
                   ──── independent of prediction/advisory ────
```

- No loss-chasing automation
- No autonomous wager sizing
- Advisory may **discuss** limits; may not **override** Steward/user limits

---

## 12. Event / communication model (design only)

Internal SSR event vocabulary (not a Z-Sanctuary bus):

| Event | Notes |
| --- | --- |
| `SpinRecorded` | FACT append |
| `SpinCorrected` | FACT correction (audited) |
| `SessionStarted` / `SessionEnded` | Lifecycle |
| `ObservationUpdated` | DERIVED refresh |
| `DroughtChanged` | DERIVED |
| `HeatZoneChanged` | DERIVED |
| `TeacherAsked` / `TeacherResponded` | ADVISORY |
| `ShadowChallengeRaised` | ADVISORY dissent |
| `StewardDecisionRecorded` | Governance |

**Events are not authority.**

Do **not** create a new Z-Sanctuary communication bus in R1. SSR may later expose an **adapter** to wider Z-Family communication systems.

---

## 13. Boundary adapters (documented only · no implementation)

| Adapter | Future role |
| --- | --- |
| Local persistence | Primary store for facts + specs |
| Optional cloud persistence | Sync replica; never math authority |
| AI provider | Advisory generation only |
| Wider Z-Sanctuary communication | Outbound/inbound adapter; membership opt-in |
| Import / export | Portable evidence-preserving bundles |
| Analytics engine versions | Swap AlgorithmSpec executables under Steward gate |

---

## 14. Accessibility as architecture

Accessibility is **foundational** (NEW_RECONSTRUCTION requirement), not late polish.

Design support for:

- Scalable typography
- High readability
- Reduced glare / dark surfaces
- Strong contrast
- Large touch targets
- Reduced motion
- Screen reader semantics
- Keyboard navigation where supported
- Tablet-first comfortable layouts

Presentation tokens/preferences belong in user preferences store; domain math remains independent of theme.

**Do not implement UI in R1.**

---

## 15. Security / privacy (design boundaries)

| Boundary | Rule |
| --- | --- |
| Local data ownership | Default; user/Steward controls export/delete |
| Authentication | Optional later; not required for offline analytics |
| Secrets | **Never** embedded in client binaries or source |
| Collection | **Minimal** — only what session analytics and responsible-use require |
| AI providers | Send least necessary context; no silent bankroll upload |
| Cloud | Explicit consent; separable from local core |
| Audit | Spin corrections and Steward decisions retained as FACT/governance |

No auth/Firebase/secrets implementation in R1.

---

## 16. Suggested future package map (names provisional · no code)

```text
ssr_domain/           facts, derived pure functions, AlgorithmSpec types
ssr_application/      services, policies, steward gates
ssr_persistence/      local repositories (future)
ssr_advisory/         teacher contracts, AI provider ports (future)
ssr_presentation/     Flutter UI (future R2+)
ssr_adapters/         cloud / Z-Family / import-export (future)
```

Domain must not depend on presentation, Firebase, or AI SDKs.

---

## 17. Twin Roots challenge

### MANGO — What evidence supports this architecture?

| Claim | Support |
| --- | --- |
| Layered domain-first | R0: analytics must not invent history; offline testability from census gaps |
| Spec-state / executable=false | Census UNRESOLVED math + R0 unknown-formula law |
| Whis / SKK / Shadow separation | Census 1 lineage |
| Local-first | No recovered cloud schema; README Firebase is intent only |
| Configurable multi-table | Census UNKNOWN on six-table hard limit |
| Responsible envelope | R0 responsible analytics + hub safety as RELATED (opt-in later) |

### TARZAN — What could make this wrong?

| Risk | Dissent |
| --- | --- |
| Over-modeling | Contracts invent structure the original never had |
| Spec registry complexity | Blocks delivery or gets bypassed by UI shortcuts |
| European-only number model | Wrong wheel variant historically |
| Teacher succession encoding | Over-rigid vs C1-U5 Whis Mode linger |
| Separating money from advisory | Original product may have blended UX — still refuse autonomous betting |
| Event vocabulary | Becomes accidental bus / over-integration with Z-Family |

Preserve dissent into R2 gating notes.

---

## 18. Hard non-goals (R1)

NO:

- Flutter initialization / `pubspec.yaml` / `lib/`
- Application source generation
- Dependency installation
- Firebase
- AI runtime
- Database implementation
- UI implementation
- Registry / Doorway edits
- RDA / OMNI / hub code copying
- Project merge / deploy / push
- Opening R2 automatically

---

## 19. R1 report card

| Check | Result |
| --- | --- |
| Design-only | **PASS** |
| Provenance law retained | **PASS** |
| FACT / DERIVED / ADVISORY separation | **PASS** |
| Unknown formula / executable gate | **PASS** |
| Teacher authority limits | **PASS** |
| Multi-table without false “6” history | **PASS** |
| Money ≠ prediction engines | **PASS** |
| Analytical output envelope | **PASS** |
| Events ≠ authority; no new Sanctuary bus | **PASS** |
| Adapters documented only | **PASS** |
| Accessibility foundational | **PASS** |
| Security/privacy boundaries | **PASS** |
| Twin Roots | **PASS** |
| Runtime / deps / registry / Pro App / Census | **UNCHANGED** |

---

## 20. Artifact control

| Item | Value |
| --- | --- |
| This file | `docs/amk-goku-steward-ai/SSR_RECONSTRUCTION_R1_ARCHITECTURE_AND_DATA_CONTRACTS.md` |
| R0 commit | `ad286e8ef0f545f0d9da1cdad919627b8723df1d` |
| Census 0 / 1 | **Unchanged** |
| Canonical Pro App | **Unchanged** |
| Recommended next gate | **R2 — FLUTTER FOUNDATION** or **HOLD** |
| Auto-open R2 | **NO** |

---

*End of SSR-RECONSTRUCTION-R1 — HARD STOP. Do not open R2 automatically.*
