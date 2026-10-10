# Experience State Contract Law

**Applies to:** All state machines in `experience-state-contracts/states/`  
**Version:** 1.0 · Locked with B1.6

## Principles

1. **One authoritative machine per experience** — every experience has exactly one canonical state contract. APIs, DB, analytics, and AI defer to it.
2. **Explicit states only** — no implicit or undocumented states. If a state exists in runtime, it exists here first.
3. **Named transitions** — every arrow has a trigger (actor + action). No silent state changes.
4. **Gated transitions are marked** — any transition that changes rights, privacy, payments, or shared content carries a governance gate.
5. **Terminal states are final** — archived / closed / deleted states do not silently reopen; reopening is an explicit new transition.
6. **No runtime** — these are specifications, not implementations. No state libraries, no code.

## Governance gate taxonomy

| Gate | Applied when a transition… |
| ---- | -------------------------- |
| **Consent** | captures, shares, or reuses user data |
| **Security** | crosses a trust boundary (future `zuno-security`) |
| **DRP** | is a sacred move, child data, payment, or bulk action |
| **Shadow** | produces or reveals AI-generated content |
| **Human** | is a sacred move requiring AMK/operator sign-off |

A transition may carry **multiple** gates. All marked gates must pass before the transition is allowed (when runtime exists).

## Canonical decision pipeline (per gated transition)

```text
Human Action
  → Consent Verification
    → Security Classification
      → DRP Governance
        → AI Processing (if AI)
          → Shadow Validation (if AI output)
            → Human Review (if required)
              → New State + Audit (correlationId)
```

This mirrors the AMK-approved pipeline and the interaction contract law — no new authority, just applied to state transitions.

## Diagram convention

- Use mermaid `stateDiagram-v2`
- `[*]` = create/start and terminal
- Gated transitions annotated in the transition table beneath each diagram
- Notes call out consent/DRP/Shadow where a label is not enough

## Forbidden in every state contract

- Auto-transition through a gated state without its gate
- Payment state change without DRP + Human gate (sacred)
- Sharing state without all-party consent
- AI-generated content reaching a user-visible state without Shadow
- Deleting shared content states without governance record

## Alignment references

- Domain status enums: [platform-contracts/CONTRACT_INVENTORY.md](../platform-contracts/CONTRACT_INVENTORY.md)
- Behavioural flows: [interaction-contracts/FLOW_INDEX.md](../interaction-contracts/FLOW_INDEX.md)
- AI moral law: [Z_CONNECT_AI_CONSTITUTION_V1.md](../Z_CONNECT_AI_CONSTITUTION_V1.md)
