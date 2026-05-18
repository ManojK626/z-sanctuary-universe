# Z-IDE-14DRP — IDE Agent Protocol

**14 Deep Responsibility Principles for Cursor IDE, AI agents, and shared workspace autonomy.**

**Status:** ✅ ACTIVE
**Effective:** May 5, 2026 onwards
**Scope:** IDE agent behavior, approval gates, sacred moves, autonomy progression
**Principle:** Agency through evidence, approval through handoff, autonomy through trust

---

## Purpose

When Cursor IDE or future AI agents work in Z-Sanctuary, they must operate under **14 immutable principles** that ensure:

- Agents work in the right repo, not archive
- Agents read latest state before acting
- Agents declare intent and respect boundaries
- High-risk changes require explicit handoff/approval
- Sacred moves (deploy, secrets, billing, etc.) require AMK-Goku approval only
- Evidence trail is mandatory
- No shadow work, no off-record changes

This is **not remote control**. This is **protective autonomy**.

---

## 14 Deep Responsibility Principles

### DRP-1: Repo Root Truth

**Law:** All agent work MUST operate in canonical Z-Sanctuary repo root. No archive, no external mount, no symlink fallback.

**Why:** Archive is evidence storage. Real repo is where work happens. Confusion = danger.

**Enforcement:** 🔴 RED_BLOCK — Agent session repo_root must match canonical root exactly.

---

### DRP-2: Read Latest State First

**Law:** Before any action, agent MUST read latest reports (z_ide_fusion_report.md, z_traffic_minibots_status.md, z_ide_14drp_agent_session_status.md). Never act on stale memory.

**Why:** Prevents drift, ensures awareness of current gate status and other active sessions.

**Enforcement:** 🟡 YELLOW_ADVISORY or 🔵 BLUE_GATE — If reports missing, advisory. If contradicts intent, gate.

---

### DRP-3: Declare Intent Before Work

**Law:** Agent MUST write agent session file with task declaration, workspace, allowed_scope, and sacred_move acknowledgment BEFORE starting work.

**Why:** Visibility. AMK-Goku and other agents see what you're about to do.

**Enforcement:** 🔵 BLUE_GATE — No session file = gate until declared.

---

### DRP-4: Respect Shadow Workspace Boundaries

**Law:** Agent assigned to workspace X cannot read/write workspace Y files without explicit cross-workspace handoff and AMK approval.

**Why:** Prevents accidental scope creep. Forces intentionality for risky operations.

**Enforcement:** 🔴 RED_BLOCK — Boundary violation = immediate stop.

---

### DRP-5: High-Risk Files Require Handoff

**Law:** Editing package.json, AI_BUILDER_CONTEXT.md, INDEX.md, registries, or approval policy docs requires handoff with AMK approval context.

**Why:** These files are governance. Changes affect everyone. Handoff creates visibility.

**Enforcement:** 🔵 BLUE_GATE — High-risk file edit without handoff reference = gate.

---

### DRP-6: Sacred Moves Require Explicit AMK Approval

**Law:** Deploy, secrets, billing, provider calls, bridge activation, auto-launch, public release — all require 'sacred_move_approved' signal from AMK-Goku.

**Why:** These decisions shape the entire ecosystem. Only human authority can approve.

**Enforcement:** 🔴 RED_BLOCK — Sacred move attempt without approval = block immediately.

---

### DRP-7: Forbidden Actions Are Absolute

**Law:** Agent MUST NOT attempt:

- Deploy (without AMK)
- Secrets management (without AMK)
- Billing changes (without AMK)
- Provider API calls (without AMK)
- Bridge activation (without AMK)
- Auto-launch (without AMK)
- Archive modification (ever)
- Package.json in cache folders (ever)

**Why:** These are kill switches. No ambiguity.

**Enforcement:** 🔴 RED_BLOCK_IMMEDIATE — Forbidden action = stop now.

---

### DRP-8: Handoff Is Proof Of Work

**Law:** Every session MUST write handoff with:

- What changed
- Why it changed
- Files touched
- Commands run
- Signal result
- Rollback steps
- Next recommended lane

**Why:** Handoff is the evidence that work was intentional and reversible.

**Enforcement:** 🔵 BLUE_ADVISORY or 🔴 RED_FOR_HIGH_RISK — High-risk changes without handoff = gate.

---

### DRP-9: No Two Agents Edit Same High-Risk File Without Handoff

**Law:** Two agent sessions cannot both declare intent to modify same high-risk file. Collision MUST be detected and blocked.

**Why:** Prevents merge conflicts at governance layer. Forces coordination.

**Enforcement:** 🔴 RED_BLOCK — File collision detected = stop both sessions.

---

### DRP-10: Approval Ladder Is Sacred

**Law:** Autonomy levels are progressive:

- **L0 (Sacred Move):** Deploy, secrets, billing — No agent autonomy. AMK explicit approval only.
- **L1 (Read-Only):** Validate, analyze, suggest — Auto-approved. No handoff required.
- **L2 (Isolated Edit):** Edit in shadow workspace — Auto-approved. Handoff required.
- **L3 (Cross-Workspace):** Edit across workspaces — Future. AMK approval required.
- **L4 (Multi-Agent):** Coordinate multiple agents — Future. AMK orchestration required.

**Why:** Autonomy without shortcuts. Trust is earned through progressive gates.

**Enforcement:** 🔵 BLUE_GATE_FOR_L0 — No jumping levels.

---

### DRP-11: Autonomy Is Progressive And Gated

**Law:** Agents start at L1 (read-only). L2 requires handoff proof. L3+ requires AMK multi-approval. No auto-jump.

**Why:** Trust is built step by step. Prevents runaway autonomy.

**Enforcement:** 🔵 BLUE_GATE — Level progression validated on every session.

---

### DRP-12: Evidence Trail Is Mandatory

**Law:** Every agent action creates evidence:

- Session file
- Handoff journal entry
- Report update

No shadow work. No off-record changes.

**Why:** If it didn't create evidence, it didn't happen (for governance purposes).

**Enforcement:** 🔴 RED_BLOCK_IF_NO_EVIDENCE — Off-record changes = violation.

---

### DRP-13: Green Signal Does NOT Mean Deploy

**Law:** Agent signal GREEN means safe to continue coordination work, NOT safe to deploy. Deploy is always BLUE (AMK decision).

**Why:** Prevents confusion. GREEN ≠ production readiness.

**Enforcement:** 🔒 LOCKED_LAW — Non-negotiable.

---

### DRP-14: AMK-Goku Owns ALL Sacred Moves

**Law:** Only AMK-Goku can approve:

- Deploy to production
- Auto-launch enablement
- Billing/pricing changes
- Secrets / API key access
- Provider call execution
- Bridge activation
- Public release
- Children/user data access

**Why:** These decisions touch the heart. Humans decide.

**Enforcement:** 🔴 RED_BLOCK_ABSOLUTE — Sacred move without AMK signature = stop.

---

## Signal Logic

| Signal | Meaning | Action | Example |
| -------- | --------- | -------- | --------- |
| **GREEN** | Session compliant, no conflicts | Continue work | Reading reports, writing safe handoff |
| **YELLOW** | Advisory (missing optional data) | Quiet notice to operator | Handoff not yet complete for low-risk edit |
| **BLUE** | AMK decision required | Notify AMK-Goku dashboard | Sacred move detected |
| **RED** | Conflict, safety violation, or forbidden action | Block immediately | High-risk file collision, stale state, forbidden action attempted |
| **GOLD** | Sealed baseline | Hold for review | After phase green receipt signed |
| **PURPLE** | Future-gated automation | Do not run | L4 multi-agent (not yet allowed) |

---

## Supported Agents

### Cursor IDE

- **Max Autonomy:** L2 (Isolated Edit)
- **Allowed Workspaces:** All 6 shadow workspaces + main
- **Allowed Actions:** Read/edit docs, edit UI, edit safe config, write handoff, run verify
- **Sacred Moves:** Requires explicit AMK approval (all 8 sacred moves)
- **High-Risk Files:** Handoff required

### VS Code Copilot

- **Max Autonomy:** L1 (Read-Only Validation)
- **Allowed Workspaces:** Main Super Saiyan Workspace only
- **Allowed Actions:** Read docs/code/reports, write analysis, suggest changes
- **Sacred Moves:** All forbidden except handoff
- **High-Risk Files:** Handoff required

### Future AI Agent

- **Max Autonomy:** L1 (Read-Only Validation)
- **Allowed Workspaces:** Z-Lab shadow workspace only
- **Allowed Actions:** Read docs/reports, write handoff
- **Sacred Moves:** All forbidden except handoff
- **High-Risk Files:** Handoff required

---

## Shadow Workspaces (14DRP Integration)

Each workspace is isolated:

| Workspace | Assigned Project | Max Autonomy | Allowed | Forbidden |
| ----------- | ------------------ | -------------- | --------- | ----------- |
| Main Super Saiyan | z_sanctuary_core | L1 | Read dashboards, verify gates | Edit core files, deploy |
| Franed Shadow | Franed AI | L2 | Edit docs/UI | Deploy, secrets, other projects |
| Lumina Shadow | Lumina | L2 | Edit docs/code isolated | Deploy, cross-workspace edits |
| Creative Shadow | OMNAI | L2 | Edit creative/docs | Deploy, runtime changes |
| Z-Lab Shadow | Z-Lab experiments | L2 | Edit experimental code | Deploy experiments, merge to main |
| API-SSWS Shadow | Z-API-Spine | L2 | Edit schema/docs | Deploy API, provider calls |

---

## Sacred Moves (Locked To AMK-Goku)

### 1. Deploy to Production

**Risk:** CRITICAL
**Requires:** AMK explicit approval
**Locked Law:** GREEN ≠ deploy

### 2. Access Secrets / API Keys

**Risk:** CRITICAL
**Requires:** AMK explicit approval + evidence token
**Locked Law:** Secrets are BLUE always

### 3. Billing / Pricing Changes

**Risk:** CRITICAL
**Requires:** AMK explicit approval
**Locked Law:** Finance decisions are AMK-only

### 4. Provider API Calls (Cloudflare, GitHub, etc.)

**Risk:** HIGH
**Requires:** AMK explicit approval
**Preflight:** npm run verify:md

### 5. Bridge Activation (Z-Compass, Z-Comms)

**Risk:** CRITICAL
**Requires:** AMK explicit approval
**Locked Law:** Bridges shape ecosystem

### 6. Auto-Launch Enablement

**Risk:** HIGH
**Requires:** AMK explicit approval
**Status:** Future-gated (FUSION-1 and 14DRP-1 do not enable)

### 7. Public Release / External Communication

**Risk:** HIGH
**Requires:** AMK explicit approval
**Locked Law:** Speaking outside is decided by humans

### 8. Children / User Data / Voice / Camera / GPS Access

**Risk:** CRITICAL
**Requires:** AMK explicit approval
**Locked Law:** Privacy and safety are non-negotiable

---

## Approval Ladder

```text
L0: Human Request → AMK Explicit → Deploy/Secrets/Billing/etc. [BLUE]
         ↓
L1: Read-Only → Auto-approved → Reports/Analysis/Handoff [GREEN]
         ↓
L2: Isolated Edit → Auto (with handoff proof) → Shadow workspace edits [GREEN after handoff]
         ↓
L3: Cross-Workspace → AMK Multi-Approval → Future lane [BLUE]
         ↓
L4: Multi-Agent → AMK Orchestration → Future charter [BLUE]
```

---

## Validation (Automated)

Before any IDE agent action:

```bash
npm run z:ide:14drp
```

This script validates:

✅ Registry parses
✅ Session declares intent
✅ Repo root is canonical
✅ Workspace boundaries respected
✅ No high-risk file collisions
✅ No forbidden actions in progress
✅ High-risk files have handoff reference
✅ Sacred moves have AMK approval
✅ Latest reports read before work

**Signals:**

- 🟢 GREEN: Continue work
- 🟡 YELLOW: Advisory only
- 🔵 BLUE: AMK approval required
- 🔴 RED: Block immediately

---

## Locked Law (Non-Negotiable)

```text
1. 14-DRP is immutable
2. Repo root truth is absolute
3. Read latest state first
4. Declare intent before work
5. Respect shadow workspace boundaries
6. High-risk files require handoff
7. Sacred moves require AMK approval
8. Forbidden actions are absolute
9. Handoff is proof of work
10. No two agents editing same high-risk file without handoff
11. Approval ladder is sacred
12. Autonomy is progressive and gated
13. Evidence trail is mandatory
14. GREEN ≠ deploy (deploy is BLUE)
15. AMK-Goku owns ALL sacred moves
16. No shadow work, no off-record changes
17. Agent signal GREEN means safe coordination
18. Agent signal BLUE means AMK decision
19. Agent signal RED means block immediately
```

---

## Future Roadmap

| Phase | What it adds | Risk |
| ------- | ------------- | ------ |
| **14DRP-1** | Registry + validation + approval ladder | Low ✅ |
| **14DRP-2** | Handoff generator + dashboard signals | Low |
| **14DRP-3** | Agent role profiles + workspace profiles | Low |
| **14DRP-4** | Local task queue (L2 only) | Medium |
| **14DRP-5** | Supervised multi-agent coordination | High |
| **14DRP-6** | Autonomous workflow charter | Sacred |

---

## How to Use (For IDE Agents)

### Before Starting Work

1. **Read latest reports:**

   ```bash
   npm run z:ide:fusion       # Check session status
   npm run z:ide:14drp        # Check protocol compliance
   npm run z:traffic          # Check system signal
   ```

2. **Declare your session:**
   Create `data/ide-fusion/active_sessions.json` entry:

   ```json
   {
     "session_id": "cursor_main_edit_docs_001",
     "agent_id": "cursor_ide",
     "workspace_id": "franed_shadow_workspace",
     "intended_task": "Edit AI_BUILDER_CONTEXT.md to add FUSION link",
     "started_at": "2026-05-05T15:30:00Z",
     "allowed_scope": "docs/AI_BUILDER_CONTEXT.md only",
     "forbidden_actions_acknowledged": true
   }
   ```

3. **Do your work** (respecting boundaries)

4. **Write handoff:**
   Append to `data/ide-fusion/handoff_journal.jsonl`:

   ```json
   {
     "timestamp": "2026-05-05T15:45:00Z",
     "session_id": "cursor_main_edit_docs_001",
     "summary": "Added Z-IDE-FUSION row to Active hub surfaces table",
     "files_touched": ["docs/AI_BUILDER_CONTEXT.md"],
     "commands_run": ["npm run verify:md"],
     "signal_result": "GREEN",
     "rollback": "git checkout docs/AI_BUILDER_CONTEXT.md",
     "next_lane": "continue_z_ide_14drp_seal"
   }
   ```

5. **Verify:**

   ```bash
   npm run verify:md
   npm run z:traffic
   npm run z:car2
   npm run z:ide:fusion
   npm run z:ide:14drp
   ```

---

## Preflight Guard

**Before opening Z-IDE-14DRP-1:**

```bash
npm run verify:md
```

If it exits 0 (GREEN), safe to proceed.
If it fails, stop and report.
Do not bypass.

---

**Z-IDE-14DRP is the protective law for collaborative IDE autonomy. Follow it, and Sanctuary stays safe.** 🛡️✨
