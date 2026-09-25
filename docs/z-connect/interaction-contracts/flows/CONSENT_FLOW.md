# Consent Flow

**Version:** 1.0 · Interaction contract  
**Domain schemas:** `consent-record`, `consent-scope`, `consent-version`, `consent-withdrawal`

## Purpose

Central **consent-first** pattern for every data use — grant, version, withdraw, audit.

## Actors

- **User**  
- **Platform** — stores append-only consent log  

## Sequence — grant

```mermaid
sequenceDiagram
  participant U as User
  participant UI as Consent UI
  participant L as Consent log

  UI->>U: Show scope + purpose + retention
  U->>UI: Accept or decline
  alt Accept
    UI->>L: consent-record (grantedAtIso)
    L-->>U: consentId
  else Decline
    UI-->>U: Feature unavailable — no penalty copy
  end
```

## Sequence — withdraw

```mermaid
sequenceDiagram
  participant U as User
  participant L as Consent log
  participant D as Data stores

  U->>L: consent-withdrawal
  L->>D: Cascade delete per scope policy
  D-->>U: Confirmation + what was removed
```

## Scope examples

| scopeId | Purpose |
| ------- | ------- |
| `discovery_journey` | AI Discovery sessions |
| `insight_generation` | Compatibility insights |
| `marketing_email` | Opt-in marketing only |
| `dream_baby_studio` | Shared creative session |

## Governance

- Consent text version tracked via `consent-version`  
- Withdrawal must complete within documented SLA (implementation)  
- DRP audit on bulk consent changes  

## Forbidden

- Pre-checked boxes for sensitive scopes  
- Bundled consent hiding optional features  
- Continued processing after withdrawal  

## Out of scope

- Legal text authoring (Stream B legal drafts)  
