# DRP Middleware Architecture

**Authority:** [Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md](../Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md)

## Requirement

**Every HTTP/gRPC endpoint** and **every agent invocation** passes through DRP middleware before business logic.

## Middleware flow

```text
Request
  → authenticate (zuno-identity)
  → DRP evaluate (zuno-drp)
  → audit log (immutable)
  → handler OR blocked response
```

## Design principles

| Principle | Detail |
| --------- | ------ |
| Central engine | One `zuno-drp` — no per-app copies |
| Expandable | Support future protocols beyond 14 without breaking callers |
| Explicit decisions | `ZDRPDecision` typed allow / deny / escalate |
| Human escalation | Sacred moves always escalate — no auto-merge/deploy/payment |

## Endpoint categories

| Category | DRP posture |
| -------- | ----------- |
| Public read (destinations) | Standard + content safety |
| Booking / payment intents | **HOLD** — extra gates |
| Health / child data | Maximum restriction + human review |
| Government export | Audit + AMK charter |
| Agent orchestration | Full pipeline + Shadow |

## Phase 1 deliverable

- Middleware **interface** documented  
- Mapping table: endpoint class → DRP checks  
- **No** production middleware deployed  

## Reports (phase completion)

DRP validation report must list:

- Endpoints covered  
- Protocols applied  
- Known gaps  
- Rollback plan  
