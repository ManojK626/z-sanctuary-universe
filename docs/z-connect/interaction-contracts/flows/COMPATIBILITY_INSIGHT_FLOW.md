# Compatibility Insight Flow

**Version:** 1.0 · Interaction contract  
**Domain schemas:** `compatibility-insight`, `connection-confidence`, `connection-confidence-evolution`

## Purpose

When a user **requests** insight about another user, surface **Connection Confidence** observations — never percentages or destiny verdicts.

## Actors

- **Viewer** — requests insight  
- **Subject** — must have shareable approved profile per privacy settings  
- **AI guide** — composes dimension narratives  
- **Shadow** · **DRP** — gates  

## Preconditions

- Viewer consent: `allowInsightGeneration`  
- Subject profile visibility permits viewer  
- No block between users  

## Sequence

```mermaid
sequenceDiagram
  participant V as Viewer
  participant C as Consent
  participant AI as AI Guide
  participant SH as Shadow
  participant DRP as DRP
  participant R as Insight store

  V->>C: Verify insight consent
  V->>AI: Request insight (subject id)
  AI->>AI: Read approved profile fields only
  AI->>DRP: Evaluate (standard)
  DRP-->>AI: pass / pending_human / blocked
  AI->>SH: Generate insight bundle
  SH-->>AI: pass or reject
  alt pass
    AI->>V: Show dimensions + confidence + limitations
    Note over V,R: Optional persist as connection-confidence
  else reject
    AI->>V: Cannot generate — explain safely
  end
```

## Required presentation (UI contract)

Each dimension shows:

1. Narrative (plain language)  
2. Confidence: high | medium | limited | learning  
3. Source field refs (user-approved only)  
4. Disclaimer (immutable template)  
5. Conversation starter (optional)  

## Forbidden

- `percentCompatible` or rank ordering of people  
- “Soulmate” / “destined” language  
- Hidden sort score derived from confidence  

## State — confidence evolution

```mermaid
stateDiagram-v2
  [*] --> limited: Day 1 profiles
  limited --> learning: Journey in progress
  learning --> medium: Partial alignment
  medium --> high: Explicit shared fields
  high --> medium: User removes data
  any --> limited: Subject withdraws visibility
```

## Out of scope

- Auto-surfacing insights without request  
- Batch compatibility for lists  
