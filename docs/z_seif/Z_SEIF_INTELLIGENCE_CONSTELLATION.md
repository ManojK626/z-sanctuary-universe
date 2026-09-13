# Z-SEIF Intelligence Constellation

**Gate:** `Z-SEIF-0`  
**Posture:** DESIGN CANDIDATES ONLY · CONCEPTUAL — NOT RUNTIME  
**No autonomous broad authority.**

Default lifecycle for every specialist:

```text
OBSERVE → INTERPRET → CORRELATE → RECOMMEND → REQUEST APPROVAL
→ STEWARD → EXECUTE → VERIFY → RECEIPT
```

These names are **roles**, not new engines. Each must bind to an existing surface first.

## Candidates

| Candidate | Role | Reuse first | Authority |
| --- | --- | --- | --- |
| `Z-Atlas Scout` | Topology / identity observer | [Z-Atlas](../z_atlas/Z_ATLAS_CONSTITUTION.md), PID, root guards | Observe only |
| `Z-Deployment Sentinel` | Deployment-state observer | Deployment readiness scripts, future CF version API | Observe only |
| `Z-Security Sentinel` | Exposure / Access / secret posture | `z_security_sentinel`, data-leak, Access wall evidence | Observe only |
| `Z-Evidence Keeper` | Receipts / SHA / provenance | Provenance check, phase receipts, GitHub SHA, CF version IDs | Evidence only |
| `Z-Recovery Guardian` | Backup / recovery evidence | Lifeboat, R2 dual custody | Observe / recommend restore |
| `Z-Cost Guardian` | Cloudflare / AI usage observer | CF analytics (future), no billing automation | Observe only |
| `Z-Project Liaison` | One bounded interface per sovereign product | Product identity rows; never owns source | Liaison, not owner |
| `Z-Steward Agent` | Human-facing explanation and recommendation | Zuno, MiniBots, QOSMEI | Recommend only |

Do not instantiate these as Cloudflare Agents in Phase 0.

## Binding rules

- A liaison for ZWheel may **know** the external sovereign product and its Access-protected staging hostname without importing source into Sanctuary.
- A liaison must treat SSR, RDA, and Super Saiyan Roulette Pro App as **distinct** products.
- If HAM lifecycle lands, incident interpretation reuses HAM — it does not create `Z-New-Alert-Engine-99`.
- If a candidate has no existing surface, it stays `FUTURE_CANDIDATE`.

## Z-Steward Control Plane

One future Steward-facing evidence surface may display:

- ecosystem topology (from Atlas)
- project state (from PID / registries)
- GitHub custody
- Cloudflare / deployment state
- health, alerts, incidents, recovery
- cost
- AI activity
- authorization gates
- provenance receipts

The control plane **must not** become product source authority. Phase 6 only, after observers exist.

## AI Tower / Zuno / Zulu

AI Tower remains a planned coordination surface, not Atlas and not SEIF command.

Zuno remains observer / reflection.

Zulu remains conceptual persona metadata until proven otherwise.

MiniBots remain product- or hub-local specialists. SEIF does not flatten them into one super-agent.
