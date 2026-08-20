# Z-Sanctuary Steward Diagnostic Core — Phase 0 Architecture

**Identity:** `Z-SANCTUARY-STEWARD-DIAGNOSTIC-CORE-0` · working name **Z-SDC**
**Status:** `Z_SDC_STATUS: BLUE` · `OBSERVE_ONLY` · `NO_PROJECT_AUTHORITY`
**Model version:** `Z_SDC_MODEL_VERSION: 0` (architecture only; runtime would start at `1` only after separate authorization)
**Date:** 2026-08-20
**Authority:** AMK-Goku + Zuno (architecture gate)
**Parents:** Consolidation Era · Z-CPU Phase 0 evidence · Twin Roots challenge · Z-DIAG architectural lessons
**Companions:** [Z_SDC_EXISTING_ORGAN_MAP.md](Z_SDC_EXISTING_ORGAN_MAP.md) · [Z_SDC_Z_DIAG_LESSONS_TRANSFER.md](Z_SDC_Z_DIAG_LESSONS_TRANSFER.md)
**Separation:** `ARCHITECTURAL DESCENDANT · NOT SOURCE-CODE CHILD` of ZWheel / Z-DIAG

---

## 1. Purpose

> Learn descriptive operational patterns across Z-Sanctuary **without** gaining authority over the projects it observes.

Diagnostic questions (examples) — **not** commands:

- What is unusual across the ecosystem right now?
- Which projects sit outside their normal (derived) baseline?
- Which validation failures recur together?
- Which dependencies recur across affected projects?
- Which Steward interventions recur?
- Which indicators degrade together?
- Which projects are dormant beyond usual cadence?
- Have we seen a similar ecosystem fingerprint before?
- How much evidence supports this diagnostic?
- Project-local vs ecosystem-wide?

---

## 2. Constitutional doctrine (permanent)

```text
PROJECT CANON REMAINS PROJECT AUTHORITY
Z-SDC OBSERVES · IT DOES NOT OWN PROJECTS
RELATIONSHIP DOES NOT IMPLY AUTHORITY
CORRELATION DOES NOT IMPLY CAUSATION
LEARNED DIAGNOSTICS ARE DERIVED / REBUILDABLE
DIAGNOSTIC ADVICE DOES NOT AUTHORIZE IMPLEMENTATION
NO DIAGNOSTIC MODEL MAY AUTO-MERGE, AUTO-DEPLOY, AUTO-PROMOTE OR ALTER GOVERNANCE
STEWARD REVIEW IS REQUIRED BEFORE CANONICAL CHANGE
OBSERVE → VERIFY → SUGGEST → HUMAN DECIDES
COMMUNICATION DOES NOT CONFER CITIZENSHIP
```

**Operational mode (V0):** OBSERVE_ONLY · Runtime **NOT AUTHORIZED** · Canonical mutation **NONE** · Deployment **NONE** · Cross-project writes **NONE** · Automatic remediation **NONE** · Automatic canon promotion **NONE**

---

## 3. Non-goals (Phase 0 / V0)

- No runtime diagnostic engine
- No background observer / cron Z-SDC
- No self-healing / auto-fix / auto-reopen gates
- No ZWheel coupling or roulette inheritance
- No OpenAI / cloud telemetry
- No dashboard rewrite this gate
- No universal health score invented here (use existing governance signals only)
- No replacement of Cycle Observe, Awareness, AAFRTC, enforcer, XBUS, or Steward court

---

## 4. Architecture sketch (conceptual)

```text
PROJECTS / MODULES / ENGINES / AI / GOVERNANCE
                    │
                    ▼
          CANONICAL PROJECT STATES  (registries + reports + receipts)
                    │
                    ▼
                  Z-SDC
           READ-ONLY OBSERVER   ← NO project-write arrow
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
   BASELINES    RELATIONSHIPS   DIAGNOSTICS
       │            │            │
       └────────────┼────────────┘
                    ▼
         STEWARD DIAGNOSTIC LEDGER  (derived / rebuildable)
                    │
              ┌─────┴─────┐
              ▼           ▼
             ZUNO       Z-TEAM   (read-only context later)
              │           │
              └─────┬─────┘
                    ▼
              HUMAN STEWARD
```

---

## 5. Scopes (mandatory declaration)

| Scope                     | Meaning                                   |
| ------------------------- | ----------------------------------------- |
| **PROJECT**               | One canonical project id                  |
| **PROJECT_FAMILY**        | Related projects/modules (typed relation) |
| **SHARED_ENGINE_FAMILY**  | Consumers of a shared engine/service      |
| **GOVERNANCE_FAMILY**     | Artifacts under same policy/gate          |
| **Z_SANCTUARY_ECOSYSTEM** | Whole local hub ecosystem                 |

No silent cross-scope merging. Every diagnostic declares scope.

---

## 6. Existing-organ integration

See [Z_SDC_EXISTING_ORGAN_MAP.md](Z_SDC_EXISTING_ORGAN_MAP.md).

**Prefer:** CONSUME Cycle Observe, Awareness, freshness, indicators, deployment readiness, PC activation, health reports, Steward receipts.
**Never duplicate:** AAFRTC, execution enforcer, release control, XBUS, Steward decision authority, Doorway opener, Main Control as product.

### Duplication audit (summary)

| Capability idea                           | Classification                                                 |
| ----------------------------------------- | -------------------------------------------------------------- |
| Point-in-time health / indicators         | **ALREADY_EXISTS**                                             |
| Freshness / report age                    | **ALREADY_EXISTS**                                             |
| Observation queue (non-executing)         | **ALREADY_EXISTS** (Cycle Observe)                             |
| Awareness capsules                        | **ALREADY_EXISTS**                                             |
| Deployment readiness rollup               | **ALREADY_EXISTS**                                             |
| Steward receipts / decision log           | **ALREADY_EXISTS**                                             |
| Twin Roots challenge principle            | **ALREADY_EXISTS** (discipline) · mock product **LEAVE_ALONE** |
| Multi-plane identity map                  | **ALREADY_EXISTS** (partial; Z-CPU / Triple Audit)             |
| Derived cross-cycle baselines             | **NEW** (descriptive) · **EXTEND_EXISTING** feeds              |
| Ecosystem fingerprint + similar-state     | **NEW**                                                        |
| Rebuildable Steward Diagnostic Ledger     | **NEW** (extends receipt culture)                              |
| Knowledge-gap / governance-gap candidates | **NEW** observation types · **FEDERATE** to Steward            |
| Autonomic remediation                     | **DO_NOT_DUPLICATE** / forbidden                               |
| Shadow governance court                   | **DO_NOT_DUPLICATE**                                           |

---

## 7. Project health baselines (derived, descriptive)

Future Z-SDC may learn **derived** baselines from canonical evidence, e.g.:

- indicator distribution over time
- validation / report success cadence
- freshness patterns
- modification cadence (from activation / git metadata when present — never secrets)
- lifecycle / dormant periods
- recurring dependency states
- documentation / readiness transition patterns

**Not** a new universal score. Existing signals (GREEN/YELLOW/BLUE/PURPLE/NO_GO/UNKNOWN) remain owned by their planes.

---

## 8. Relationship graph (transparent, typed)

**Nodes (examples):** project · module · engine · AI · registry · indicator · validator · governance artifact · dependency · deployment surface · backup/continuity surface

**Edges (examples — never one ambiguous “related”):**

`depends_on` · `governed_by` · `validated_by` · `shares_engine` · `registered_in` · `observed_with` · `frequently_changes_with` · `recurring_failure_with` · `upstream_of` · `downstream_of`

### Relationship constitution

```text
RELATIONSHIP != OWNERSHIP
CORRELATION != CAUSATION
DEPENDENCY != AUTHORIZATION
FEDERATION != CONTROL
```

UI/AI must not convert edges into authority.

---

## 9. Ecosystem state fingerprint

**Deterministic, versioned** fingerprint ingredients (design):

- project / indicator / validator / freshness states
- open Steward gates (documented)
- dormant / missing-path citizens
- shared dependency postures when known

**Exclude:** arbitrary UI state · secrets · uncontrolled free-text blobs

Version fingerprints when schema changes.

---

## 10. Similar ecosystem states

V1 methods (future): exact fingerprint match · Jaccard overlap · typed-state overlap.
**No embeddings** in first implementation.

Answer format must show: prior date/state · shared signals · differing signals · method · evidence scope.

---

## 11. Recurrence · persistence · transitions

| Concept         | Design                                                       | Forbidden wording                            |
| --------------- | ------------------------------------------------------------ | -------------------------------------------- |
| **Recurrence**  | Count prior cycles for warning/failure/intervention families | “Will happen again”                          |
| **Persistence** | Duration YELLOW / dormant / open gate                        | Auto-escalate unless existing policy says so |
| **Transitions** | Count bounded lifecycle transitions (e.g. DORMANT→REOPENED)  | Treat counts as destiny                      |

Example allowed: _This validation-warning family appeared on four previous project cycles._

---

## 12. Evidence sufficiency

Classes (descriptive): `INSUFFICIENT` · `LIMITED` · `MODERATE` · `STRONG_SAMPLE`

Basis for Sanctuary (document, don’t copy ZWheel numbers): cycles · reports · project observations · validation runs · time windows · comparable Steward events.

Sufficiency ≠ prediction confidence.

---

## 13. Unusualness terminology

Allowed: `NORMAL_FOR_PROJECT` · `LESS_COMMON` · `UNUSUAL_IN_RECORDED_HISTORY` · `INSUFFICIENT_EVIDENCE`

Avoid: invented “risk probability” unless a canonical risk engine already defines it.

---

## 14. Steward Diagnostic Ledger (rebuildable)

Potential fields: diagnostic ID · model version · scope · source project/engine/evidence IDs · sample size · created/updated · algorithm · finding · sufficiency · limitations · rebuildable · Steward state

Steward states: `OBSERVED` · `REVIEWED` · `ACCEPTED_AS_DIAGNOSTIC` · `REJECTED` · `PROMOTION_CANDIDATE`

**No automatic promotion.**

### Diagnostic proposals (foresight only)

`ZDiagnosticProposal` reserved. V0: `GENERATED: NO`. Schema only — no generation.

---

## 15. AI context contract (read-only, future)

Compact fields: scope · observation · supporting evidence · relationship evidence · recurrence · persistence · similarity · sufficiency · provenance · limitations

Flow: project AI → project canon (primary) → Z-SDC context (supplementary) → provenance → explanation

**No write authority** via contract. Zuno / Z-Team / specialist copilots consume later phases only.

---

## 16. Knowledge-gap & governance-gap observation

| Candidate                            | Flow                               | May not                 |
| ------------------------------------ | ---------------------------------- | ----------------------- |
| `KNOWLEDGE_GAP_CANDIDATE`            | Observe → group → report → Steward | Auto-edit docs/AI canon |
| `GOVERNANCE_CLARIFICATION_CANDIDATE` | Observe → group → report → Steward | Rewrite governance      |

---

## 17. Project separation & privacy

Citizenship classes remain: Sanctuary member · affiliated · external · reference-only · excluded.
Filesystem proximity ≠ membership. Observation ≠ membership.

**Privacy:** `LOCAL_ONLY` default · no cloud telemetry · no secret ingestion · no cross-user aggregation · no external AI requirement.

---

## 18. Rebuildability

```text
CANONICAL PROJECT EVIDENCE > DERIVED DIAGNOSTIC MEMORY
```

Derived state must be rebuildable from registries/reports/receipts. No opaque irrecoverable learning blob.

---

## 19. Risk register

| Risk                              | Mitigation                                                                   |
| --------------------------------- | ---------------------------------------------------------------------------- |
| Observer becomes shadow authority | BLUE / NO_PROJECT_AUTHORITY · ledger ≠ court · Steward promotion only        |
| Duplicate health systems          | Organ map · EXTEND Cycle Observe/Awareness · NEVER_DUPLICATE enforcer/AAFRTC |
| Correlation → causation           | Typed edges · relationship constitution · wording bans                       |
| Over-centralization               | Scopes mandatory · federate project-local health                             |
| Privacy leakage                   | LOCAL_ONLY · no secrets · no free-text dumps in fingerprints                 |
| Stale diagnostics                 | Freshness cadence · version fingerprints · sufficiency classes               |
| False confidence (small n)        | INSUFFICIENT/LIMITED · no prediction language                                |
| Self-modification pressure        | Explicit NO self-heal · Consolidation Era roof                               |
| Unbounded graph growth            | Pairwise first · typed edges · Steward-bounded ingest                        |
| AI over-reliance                  | Canon primary · context supplementary · limitations field                    |
| Project separation erosion        | Citizenship classes · XBUS · communication ≠ citizenship                     |
| Governance bypass                 | No auto-merge/deploy/promote · AAFRTC/enforcer remain SoT gates              |

---

## 20. Future phases (design only — none auto-open)

| Phase   | Content                                         | Default authority                                               |
| ------- | ----------------------------------------------- | --------------------------------------------------------------- |
| **0**   | Architecture / organ map (this gate)            | Docs only                                                       |
| **0.5** | Registry citizenship / observer identity record | Docs / optional registry **row proposal** only if Steward opens |
| **1**   | Single-project read-only observer               | Separate charter                                                |
| **2**   | Multi-project baselines                         | Separate                                                        |
| **3**   | Cross-project relationship graph                | Separate                                                        |
| **4**   | Zuno / Z-Team read-only context                 | Separate                                                        |
| **5**   | Steward-reviewed DiagnosticProposal generation  | Separate                                                        |
| **6**   | Controlled improvement experiments              | Only if justified · still human-gated                           |

**Phase 1 opened this gate?** **NO**

---

## 21. Hard stop checklist

| Item                                           | Status |
| ---------------------------------------------- | ------ |
| Runtime built                                  | **NO** |
| Cross-project reader built                     | **NO** |
| Zuno runtime modified                          | **NO** |
| Dashboards modified                            | **NO** |
| Background services                            | **NO** |
| External AI                                    | **NO** |
| Deployment                                     | **NO** |
| ZWheel root touched                            | **NO** |
| Project files mutated (except authorized docs) | **NO** |

---

## 22. Recommended next Steward decision

1. Accept Phase 0 architecture docs (`PASS` if criteria met).
2. Keep Consolidation Era / Turtle hold.
3. Optionally commit these docs when Steward requests (governance: commit not auto-required).
4. Do **not** open Phase 1 until explicit charter after organ-map acceptance.
5. If anything is built later: start with **single-project read-only observer** consuming existing reports — never a new health monarchy.
