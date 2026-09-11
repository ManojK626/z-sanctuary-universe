# Z-Atlas Communication Topology

**Gate:** `Z-ATLAS-0-LIVING-MULTI-PROJECT-TOPOLOGY-CONSTITUTION`  
**Posture:** Conceptual map of **documented** roles and routes. No new comms runtime.

---

## Chain

```text
SOURCE → MESSAGE / EVIDENCE → ROUTE → RECEIVER → AUTHORITY → RECEIPT
```

Every later communication overlay should be expressible in this chain. Missing receipts stay `UNKNOWN`; they are not inferred as delivered.

---

## Proven conceptual roles (this worktree)

Capabilities are listed only where current hub docs support them. Experimental / planned / HOLD roles must stay labeled as such.

| Role | Evidence on this worktree | Atlas node type | Must not be treated as |
| --- | --- | --- | --- |
| **Zuno** | `docs/z_zuno_technology_snapshot.md` · VILE Zuno Core (observe · snapshot · policy) · `data/zuno_state_snapshot.json` referenced by `AGENTS.md` | `AI` | Autopilot / sacred approver |
| **Zulu** | Vault / canonical registry: persona / experimental metadata (`packages/z-sanctuary-core/ai/zulu.json`) | `AI` | World-data auto-ingest (explicitly not deployed) |
| **AI Tower** | Planned / experimental / `planned_stub` / HOLD (`docs/modules/ai_tower_agents/`, AI cooperation matrix) | `SERVICE` / coordination surface | Atlas itself; executive colony |
| **MiniBots** | Traffic minibots, markdown relay (`docs/Z-SSWS-MINI-BOT-AI-TOWER-MARKDOWN-RELAY.md`) | `MINIBOT` | Cross-repo mutators |
| **Observers** | Cycle Observe, Mission Control census/status, NAV-1 read-only cockpit | `AGENT` | Execute / deploy |
| **Supervisors / Overseer** | Hierarchy Chief · Z-Super Overseer (Z-EAII + auto-run + Z-SSWS) | `MENTOR` / governance | Bypass `manual_release` |
| **Mentors / Steward council** | Steward AI charter docs; human steward AMK-Goku | `MENTOR` | Automatic promotion of proposals |
| **Project identity systems** | `z-eaii-registry.json` · `z_pc_root_projects.json` · GitHub identity JSON · module registries | `REGISTRY` | Source ownership of external products |
| **Health systems** | Indicators, Zuno snapshots, Whale Bus / QOSMEI advisory fusion, guardian tasks | `HEALTH_SIGNAL` | Independent GREEN upgrades |
| **Deployment systems** | Readiness matrix, release control, Cloudflare **contingency docs only** | `DEPLOYMENT` | Live DNS / Cloudflare mutation |

**PID / Z-CLDO / Z-PACE:** named in the Phase 0 brief as existing classes to reuse. **No matching artifacts found on this worktree.** Status: `UNVERIFIED`. Atlas must not invent them.

---

## AI Tower boundary

```text
Atlas  = topology / navigation
Tower  = coordination / deliberation surface
```

Do **not** merge.

- Atlas may have an `AI TOWER VIEW` that **points at** Tower docs and status.
- Tower must not become a second map of roots/products.
- Atlas must not become a second swarm/council.

Existing overlap risk already documented in the spine matrix: “Swarm vs Tower naming.” Atlas records that risk; it does not resolve it by renaming.

---

## Documented routes (examples, not a complete mesh)

| Source | Message / evidence | Route | Receiver | Authority | Receipt |
| --- | --- | --- | --- | --- | --- |
| Hub verify scripts | structure / registry omni results | local npm / VS Code tasks | Steward / Overseer | Hub repo | report JSON / PASS lines |
| Pointer reconciliation | identity + path truth | `docs/reconciliation/` | Atlas / later gates | Steward | `HUB_POINTER_VALIDATION: PASS` |
| GitHub comms pack | identity + precautions | `npm run comms:github-ai` | operators | Hub outranks cloud AI | comms requirement JSON |
| Cloudflare pack | contingency only | `npm run comms:cloudflare-ai` | operators | optional; no daily requirement | contingency identity JSON |
| Whale Bus | comms + SSWS/Tower surfaces | PowerShell / npm surface reinforce | dashboards / Zuno | advisory | `z_communication_health.json` |
| NAV-1 | catalog visibility | hub dashboard | human operator | read-only | navigator green receipt (existing) |

Routes not proven as live in this gate remain `UNVERIFIED`.

---

## Envelope reuse

Later messages may wrap the chain in [ZContextEnvelope.v1](Z_ATLAS_AI_PREFLIGHT_CONTEXT.md) so sender, receiver, authority, evidence refs, and `mutationScope` travel together.

---

## Verdict

```text
Z_ATLAS_COMMUNICATION_TOPOLOGY: PASS
Z_ATLAS_AI_TOWER_BOUNDARY: PASS
```
