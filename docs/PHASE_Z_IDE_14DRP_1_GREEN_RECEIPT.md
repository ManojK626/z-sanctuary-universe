# PHASE Z-IDE-14DRP-1 — Green Receipt

## 14 Deep Responsibility Principles for IDE Agent Protocol

---

## Scope Delivered

- 14 immutable DRP laws (repo root, read latest, declare intent, boundaries, handoff, sacred moves, forbidden actions, autonomy levels, approval ladder, evidence trail, locked law, AMK ownership)
- IDE agent protocol registry with supported agents, autonomy levels, sacred moves, approval ladder
- Validator script detecting compliance violations (DRP-1 through DRP-14)
- Session management (declare before work, workspace boundaries, high-risk file tracking)
- Handoff requirement enforcement (what changed, why, rollback steps)
- File collision detection (two agents same high-risk file = RED)
- Sacred move gating (all 8 sacred moves require AMK approval)
- Locked law enforcement (no shortcuts, no shadow work)
- Report generation (JSON + markdown with signals)
- Integration with Z-IDE-FUSION-1 and VS-FALLBACK-1

**No runtime IDE control, no remote execution, no bridge activation, no provider calls, no deployment, no secrets access, no billing changes, no auto-launch.**

---

## Core Artifacts

- `data/z_ide_14drp_agent_protocol_registry.json` — 14 DRP law registry with all principles, agents, autonomy levels, sacred moves, approval ladder
- `scripts/z_ide_14drp_validator.mjs` — Compliance validator script
- `docs/Z_IDE_14DRP_AGENT_PROTOCOL.md` — Full documentation with locked law
- `data/examples/z_ide_14drp_agent_session.example.json` — Example agent session
- `data/reports/z_ide_14drp_agent_session_status.json` — Generated compliance report (JSON)
- `data/reports/z_ide_14drp_agent_session_status.md` — Generated compliance report (markdown)

---

## Locked Law

```text
✅ Repo root truth is absolute
✅ Read latest state first before acting
✅ Declare intent before work (DRP-3)
✅ Respect shadow workspace boundaries (DRP-4)
✅ High-risk files require handoff (DRP-5)
✅ Sacred moves require AMK approval (DRP-6 & DRP-14)
✅ Forbidden actions are absolute (DRP-7)
✅ Handoff is proof of work (DRP-8)
✅ No two agents same high-risk file without handoff (DRP-9)
✅ Approval ladder is sacred (DRP-10)
✅ Autonomy is progressive and gated (DRP-11)
✅ Evidence trail is mandatory (DRP-12)
✅ GREEN ≠ deploy (DRP-13)
✅ AMK-Goku owns sacred moves (DRP-14)
```

---

## Commands

```bash
# Validate 14 DRP compliance
npm run z:ide:14drp

# With other gates
npm run verify:md
npm run z:traffic
npm run z:car2
npm run z:ide:fusion
npm run z:ide:14drp
```

---

## Acceptance

- ✅ Registry JSON parses
- ✅ `npm run z:ide:14drp` exits 0 (unless RED violation)
- ✅ 14 DRP principles defined and locked
- ✅ Supported agents: Cursor IDE (L2), VS Code Copilot (L1), Future AI Agent (L1)
- ✅ Autonomy levels L0-L4 defined with progressive gating
- ✅ 8 sacred moves locked to AMK-Goku approval
- ✅ Session validation rules enforce all 14 DRP
- ✅ File collision detection active
- ✅ Workspace boundary validation active
- ✅ Evidence trail enforcement active
- ✅ Reports generated (JSON + markdown)
- ✅ `npm run verify:md` exits 0
- ✅ `npm run z:traffic` exits 0
- ✅ `npm run z:car2` exits 0
- ✅ `npm run z:ide:fusion` exits 0
- ✅ `.cursor/projects` untouched

---

## Signal Logic

| Signal | Meaning | Action |
| --------- | -------------------------------- | ----------------- |
| 🟢 GREEN | Compliant, safe to continue | Continue work |
| 🟡 YELLOW | Advisory (missing optional data) | Quiet notice |
| 🔵 BLUE | AMK decision required | Notify AMK-Goku |
| 🔴 RED | Violation detected | Block immediately |

---

## Rollback

To revert PHASE Z-IDE-14DRP-1:

```bash
# Remove 14 DRP files
rm data/z_ide_14drp_agent_protocol_registry.json
rm scripts/z_ide_14drp_validator.mjs
rm docs/Z_IDE_14DRP_AGENT_PROTOCOL.md
rm data/examples/z_ide_14drp_agent_session.example.json

# Revert package.json (remove z:ide:14drp script)
# Edit package.json and remove "z:ide:14drp": "node scripts/z_ide_14drp_validator.mjs"

# Re-verify gates
npm run verify:md
npm run z:traffic
npm run z:car2
npm run z:ide:fusion
```

All should still pass (14DRP-1 adds, doesn't break).

---

## Next Phase

After 14DRP-1 seals:

- 14DRP-2: Handoff generator + dashboard signals
- 14DRP-3: Agent role profiles + workspace profiles
- 14DRP-4: Local task queue (L2 agents only)
- 14DRP-5: Multi-agent coordination (future)
- 14DRP-6: Autonomous workflow charter (sacred)

---

**Z-IDE-14DRP-1 locked and sealed.** 🛡️✨
