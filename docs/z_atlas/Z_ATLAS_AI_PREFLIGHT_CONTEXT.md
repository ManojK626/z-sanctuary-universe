# Z-Atlas AI Preflight Context

**Gate:** `Z-ATLAS-0-LIVING-MULTI-PROJECT-TOPOLOGY-CONSTITUTION`  
**Schema:** [z_atlas_preflight_context_v1.schema.json](../../schemas/z_atlas_preflight_context_v1.schema.json)  
**Runtime:** none. Do **not** wire this into Cursor, dashboards, or product apps in this gate.

---

## Purpose

Before an AI mutates, imports, deploys, or “helps” across trees, it must load a **ZAtlasPreflightContext.v1** so that:

- identity is known
- path is proven against canonical authority
- allowed vs forbidden actions are explicit
- related **distinct** products are not collapsed

This is navigational context. It does not grant power.

---

## ZAtlasPreflightContext.v1 fields

| Field | Meaning |
| --- | --- |
| `currentRoot` | Filesystem root the agent is actually in |
| `currentProject` | Project name if proven |
| `currentProduct` | Product identity if proven (may differ from project/folder name) |
| `canonicalAuthority` | Proven authority path / class for the active subject |
| `repository` | Git remote/repo if proven; else none / UNKNOWN |
| `branch` | Current branch if proven |
| `worktree` | Current worktree if not the primary checkout |
| `environment` | e.g. `LOCAL_CANONICAL`, hub, archival |
| `openGate` | Active named gate, if any |
| `allowedActions` | Explicit allow list (default empty) |
| `forbiddenActions` | Explicit deny list |
| `relatedDistinctProducts` | Names that must **not** be treated as the current product |
| `dependencies` | Proven dependencies only |
| `health` | Overlay from existing observers (`UNKNOWN` if none) |
| `evidenceFreshness` | `CURRENT` · `AGING` · `STALE` · `UNKNOWN` |
| `deploymentState` | Independent of health |

Also permitted as identity helpers (illustrative, not required for every payload): `identity`, `classification`, `authority`, `build`.

---

## Illustrative example (not wired)

```json
{
  "currentRoot": "C:\\Z-Wheel Cracker",
  "identity": "ZWheel Cracker",
  "classification": "CANONICAL_INDEPENDENT_PRODUCT",
  "authority": "EXTERNAL_SOVEREIGN",
  "environment": "LOCAL_CANONICAL",
  "build": "ZW-v37",
  "openGate": "PD14_PHYSICAL_DEVICE_PROOF",
  "allowedActions": ["OBSERVE"],
  "forbiddenActions": ["IMPORT_INTO_ZSANCTUARY", "DEPLOY_CLOUDFLARE"],
  "relatedDistinctProducts": [
    "Super-Saiyan Roulette Pro App",
    "Roulette-Data-Analyzer"
  ]
}
```

`PD14_PHYSICAL_DEVICE_PROOF` is an **illustrative gate name** in this constitution. Physical-device proof for ZWheel remains **UNVERIFIED / HOLD** in hub deployment overlays and must not be treated as an opened gate.

---

## Wrong-path guard (spec only)

```text
IF currentRoot ≠ canonicalAuthority expected by the active gate
THEN PATH_AUTHORITY_MISMATCH
THEN proposed mutation = HOLD
```

The agent may observe and report. It must not continue a mutation on the wrong tree.

Examples that must trip the guard if a gate names ZWheel canonical authority:

- working in hub `Z_Sanctuary_Universe` and proposing ZWheel product edits
- working in `C:\Z-Wheel-Cracker-PRE-ORGANISER-BACKUP` and treating it as current v37 authority
- working in Super-Saiyan or RDA trees and importing/merging into ZWheel or hub `apps/roulette`

---

## ZContextEnvelope.v1 (spec only)

Envelope for any later message that cites Atlas context. Not implemented here.

| Field | Meaning |
| --- | --- |
| `ecosystemId` | Organism id |
| `projectId` | Project id |
| `productId` | Product id |
| `rootId` | Root id |
| `repositoryId` | Repository id |
| `branchId` | Branch id |
| `gateId` | Active gate |
| `taskId` | Task / work id |
| `sender` | Who emitted |
| `receiver` | Who should receive |
| `authority` | Authority vocabulary |
| `evidenceRefs` | Fact / report ids |
| `timestamp` | Emission time |
| `mutationScope` | `NONE` · `DOCS` · `HUB_METADATA` · `PRODUCT` · etc. |

Default `mutationScope` for Atlas Phase 0 work: `DOCS` on the evidence worktree only.

---

## Human view modes (UX / IA only — no dashboard)

These are **information-architecture names**, not a runtime:

`UNIVERSE VIEW` · `CATEGORY VIEW` · `PRODUCT VIEW` · `AI TOWER VIEW` · `ROOT / PATH VIEW` · `GIT / WORKTREE VIEW` · `HEALTH VIEW` · `COMMUNICATION VIEW` · `DEPLOYMENT VIEW` · `COMMERCIAL VIEW` · `EVIDENCE VIEW`

See [Z_ATLAS_GRAPHICAL_VISION.md](Z_ATLAS_GRAPHICAL_VISION.md).

---

## Verdict

```text
Z_ATLAS_AI_PREFLIGHT_CONTEXT: PASS
Z_ATLAS_WRONG_PATH_GUARD_SPEC: PASS
```
