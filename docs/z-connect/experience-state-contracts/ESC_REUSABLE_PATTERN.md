# Experience State Contract — Reusable Pattern (Z-Sanctuary Universal)

**Version:** 1.0 · Architecture only · no runtime  
**Scope:** Z-Connect **and** any future Z-Sanctuary experience-driven service.

## Why universal

An "experience" is any user-facing lifecycle with meaningful states — a journey, a request, a session, a subscription, a case. The **shape** of a good state contract is the same everywhere, even when the **states** differ per project.

```text
Domain Contracts   → What data exists?
Interaction        → How do participants interact?
Experience State   → What states can an experience move through?
```

## The pattern (copy this shape)

Every ESC document contains:

1. **Header** — experience name, owning project, aligned domain schema(s), aligned flow(s)
2. **State diagram** — mermaid `stateDiagram-v2`
3. **State table** — each state: meaning, who can act, is it terminal
4. **Transition table** — from → to, trigger, **gates** (Consent / Security / DRP / Shadow / Human)
5. **Governance notes** — which transitions change rights, privacy, payment, or shared content
6. **Out of scope** — what this contract does not decide (runtime, retries, storage)

## Minimal template

A conforming ESC document contains these sections in order:

```text
Title:        <Experience> State Contract
Project:      <Z-Connect | ZILWA | Z-Legal | ...>
Domain:       <schemas>      Flows: <flows>

Section 1 — State diagram   (mermaid stateDiagram-v2)
Section 2 — States table     | State | Meaning | Actor | Terminal |
Section 3 — Transitions      | From | To | Trigger | Gates |
Section 4 — Governance notes (why each gated transition is gated)
Section 5 — Out of scope     (runtime, retries, storage)
```

See [DISCOVERY_JOURNEY_STATE.md](states/DISCOVERY_JOURNEY_STATE.md) for a full worked example.

## Gate vocabulary (shared)

| Gate | Meaning |
| ---- | ------- |
| Consent | user permission required |
| Security | trust-boundary classification |
| DRP | sacred / child / payment / bulk |
| Shadow | AI output validation |
| Human | AMK/operator sign-off |

## Adoption by other projects

| Project | Example experiences (future, their own states) |
| ------- | ----------------------------------------------- |
| Compassion Platform | support request · aid session · volunteer match |
| ZILWA | booking · stay · experience session · review |
| Z-Legal | case · document · consent · review cycle |
| Zuno Intelligence | observation · analysis · recommendation |

Each project **defines its own states** but inherits this law and diagram convention. No shared runtime is implied — this is a **design blueprint**, not a coupling.

## Non-goals

- No shared state engine or library
- No cross-project runtime bridge
- No auto-generated code from these docs (Phase 1.6+ decision, gated)
