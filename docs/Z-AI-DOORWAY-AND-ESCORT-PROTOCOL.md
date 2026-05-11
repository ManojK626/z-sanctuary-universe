# Z-AI Doorway & Escort Protocol

**Purpose:** Define what happens **after** an AI passes identity handshake — secure entry, guided movement, and logged exit. Handshake answers _who_ and _limits_; this protocol answers _where it may walk_ and _what receipt it leaves_.

## Golden law

```text
Handshake opens identity.
Doorway assigns permission.
Escort keeps direction.
Receipt proves what happened.
Human remains final authority.
```

## Lifecycle

```text
1. Handshake → AI identifies itself (role, limits, Sanctuary awareness).
2. Doorway Approval → human/system decides if it may enter.
3. Escort Assignment → Mango Tree / Tarzan Tree / AI Tower define pathway metaphors.
4. Work Lane Boundaries → exact allowed files, task scope, limits.
5. Activity Logging → meaningful actions produce receipts.
6. Completion Check → verify work against task goal.
7. Exit Receipt → session closes with summary + rollback hints.
8. Archive → Mango Tree remembers receipts; Tarzan Tree updates safe routes (doctrine).
```

## Security status levels

| Level | Meaning |
| ------------ | ------------------------------------ |
| `GUEST` | Read-only observer |
| `GUIDED` | May suggest changes; no silent apply |
| `WORKER` | May edit **approved lane only** |
| `SPECIALIST` | One domain, explicit approval |
| `LOCKED` | Blocked / no access |

**Default for any new AI:** `GUEST`. No AI starts as `WORKER`.

## Escort roles (doctrine)

| Metaphor | Role |
| --------------- | ---------------------------------------------------------------- |
| **Mango Tree** | Memory and receipts — what was done, when, by whom |
| **Tarzan Tree** | Routing and safe pathways — which lane, which repo |
| **AI Tower** | Role alignment and capability awareness — what this AI may claim |

## Doorway record (example shape)

```json
{
  "doorway_id": "z-ai-doorway-2026-05-02-001",
  "ai_name": "Cursor Agent",
  "role": "UI helper",
  "entry_status": "GUIDED",
  "approved_by": "AMK-Goku",
  "allowed_lane": "dashboard UI only",
  "allowed_files": ["dashboard/panels/example.html"],
  "forbidden": ["secrets", "deployment", "payments", "registry unless approved"],
  "escort": {
    "mango_tree": "memory receipt",
    "tarzan_tree": "safe route",
    "ai_tower": "role alignment"
  },
  "exit_required": true
}
```

## Allowed vs forbidden (summary)

**Allowed (when status permits):** Read docs, propose patches in scope, run **named** verify commands the operator approved.

**Forbidden:** Silent execution of merges/deploys, payment or pricing changes, secret material in chat output, cross-project edits without charter, unapproved external APIs, skipping exit receipt.

## Internal vs external AI

- **Internal:** Hub Cursor session with repo rules and Turtle Mode — still needs doorway lane for serious moves.
- **External:** Third-party or cloud agents — treat as `GUEST` until explicitly elevated; no vault or raw tenant data.

## API / industry / future integration

- No automatic connector enablement from AI sessions.
- Precautions live in hub comms docs; humans whitelist network and secrets.

## Related doctrine

- Z-AI Handshake Protocol (identity layer — pair with this doc).
- [Z-RPWC-REPLICABLE-POWER-WITHOUT-CHAOS.md](Z-RPWC-REPLICABLE-POWER-WITHOUT-CHAOS.md) — cross-boundary power sharing.
- [Z-SAGE-CORE-OBSERVATION-PROTOCOL.md](Z-SAGE-CORE-OBSERVATION-PROTOCOL.md) — observer-only signals (no escort execution).
