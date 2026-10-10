# Appeal Flow

**Version:** 1.0 · Interaction contract  
**Domain schemas:** `appeal`, `review`, `safety-action`

## Purpose

Allow users to **appeal** moderation decisions with human review — proportional, transparent process.

## Actors

- **Appellant** — subject of moderation action  
- **Reviewer** — human (required for ban/suspend)  
- **DRP** — elevated  

## Preconditions

- Valid `review` exists with `action_taken`  
- Appeal window open (policy TBD in legal draft)  

## Sequence

```mermaid
sequenceDiagram
  participant A as Appellant
  participant P as Platform
  participant DRP as DRP
  participant Rev as Reviewer

  A->>P: Submit appeal (statement)
  P->>DRP: Evaluate
  DRP-->>P: pass / pending_human
  P->>Rev: Human review queue
  Rev->>P: Uphold or overturn action
  alt overturn
    P->>A: Restore access + explanation
  else uphold
    P->>A: Decision upheld + next steps
  end
```

## Consent / fairness

- Appellant sees their statement and outcome summary  
- No AI-generated legal advice  

## State

```mermaid
stateDiagram-v2
  [*] --> submitted
  submitted --> under_review
  under_review --> upheld
  under_review --> overturned
  upheld --> [*]
  overturned --> [*]
```

## Forbidden

- Infinite appeal loops without policy  
- AI-only appeal decisions for permanent bans  

## Out of scope

- Court/law enforcement process  
