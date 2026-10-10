# GW-2 — Publication proof threshold

**Phase:** Golden Website GW-2
**Date:** 2026-08-27
**Authority:** GW-1 accepted · GW-2 open as **sanitization / evidence prep only**

No record may enter the Public Knowledge Twin, and none may be labelled `APPROVED_PUBLIC_SAFE`, until **all five gates** pass **and** Steward approval is explicit.

## Path (locked)

```text
Candidate
  → sanitized public capsule
  → evidence package
  → human approval queue
  → (only then) Public Knowledge Twin
```

Not: Candidate → website.

## Five gates

| Gate | Pass means | Fail means |
| ---- | ---------- | ---------- |
| 1. Identity clear | Canonical ID stable; public name ≠ colliding brand; temporary IDs not used as catalog numbers | Ambiguous name, alias unresolved, or Zuno/Universe 2 confusion |
| 2. Claim wording safe | Copy obeys [GW_1_CLAIM_POLICY.md](GW_1_CLAIM_POLICY.md) | QUALIFIED said as proven; WORKING HTML said as production; SEALED said as deployed |
| 3. Evidence attached | Public-safe references exist for every positive claim | Registry listing alone treated as public proof |
| 4. Security sanitization green | Capsule has no secrets, IPs, internal paths, personal data, topology, or raw telemetry | Any of those remain in the public-facing capsule |
| 5. Human approval explicit | Steward records `APPROVED` on the approval-queue item | Pending, implied, or automated |

## Allowed transition

```text
CANDIDATE_AFTER_SANITIZATION
        ↓  (all five gates + Steward)
APPROVED_PUBLIC_SAFE
        ↓  (explicit Twin insert — not GW-2)
Public Knowledge Twin records[]
```

GW-2 does **not** perform the last two arrows.

## First-public journey (intent, not UI)

If both capsules later pass:

1. **Z-Sanctuary Core** — What is Z-Sanctuary?
2. **Universal Workstation Navigator** — How do visitors explore it? (feeds future Golden Universe Map; is not that map yet)

Start with the **clearest** anchor, not the most spectacular project.

## GW-2 scoring rule

A gate may be `PASS`, `PARTIAL`, or `PENDING` / `FAIL`.

`PARTIAL` evidence is **not** enough for `APPROVED_PUBLIC_SAFE`.
`PENDING` human approval is **not** enough for Twin insert.
