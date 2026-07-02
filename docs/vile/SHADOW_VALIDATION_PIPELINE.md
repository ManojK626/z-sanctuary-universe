# Shadow Validation Pipeline

**Rule:** Never bypass Shadow.

## Pipeline stages

```text
1. Schema Validation      — structure, types, required fields
2. Safety Validation      — harm, child, medical red lines
3. Risk Validation        — travel, environmental, fraud signals
4. Compliance Validation  — DRP, privacy, regional law flags
5. Shadow Verification    — independent validator pass
6. User Response          — only after 1–5 succeed or safe degrade
```

## Failure handling

| Stage      | On fail                                                |
| ---------- | ------------------------------------------------------ |
| Schema     | Reject — return structured error to orchestrator       |
| Safety     | Block — log immutable audit event                      |
| Risk       | Degrade — human-readable caution + optional human gate |
| Compliance | Block or escalate per DRPGuardian                      |
| Shadow     | Block — never stream partial unsafe content            |

## Implementation home

`packages/zuno-shadow` — **EXISTS** (Phase 2A Pkg 3) — shared by API, agents, and dashboard Ask-AI surfaces when integrated.

## Hub alignment

- Cloudflare / edge Ask-AI: [Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md](../Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md)
- Visual automation boundary: no synthetic human approval

## Testing requirement

Every endpoint and agent path requires shadow validation tests before phase sign-off. See [TESTING_AND_VERIFICATION_GATE.md](TESTING_AND_VERIFICATION_GATE.md).
