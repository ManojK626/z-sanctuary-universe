# Moderation Flow

**Version:** 1.0 · Interaction contract  
**Domain schemas:** `report`, `review`, `safety-action`, `user-block`, `moderation-event`

## Purpose

Safety reporting and review — protect users without surveillance culture or public shaming.

## Actors

- **Reporter** — any user  
- **Subject** — reported user or content  
- **Reviewer** — human or policy workflow (future)  
- **DRP** — elevated; child safety → mandatory human  

## Sequence

```mermaid
sequenceDiagram
  participant R as Reporter
  participant P as Platform
  participant DRP as DRP
  participant Rev as Reviewer
  participant S as Subject

  R->>P: Submit report (category + detail)
  P->>DRP: Evaluate category
  alt child_safety
    DRP-->>P: pending_human mandatory
  end
  P->>Rev: Queue review
  Rev->>P: review outcome
  alt action_taken
    P->>S: safety-action (warn/mute/suspend/ban)
    P->>R: Outcome notice (limited detail)
  else dismissed
    P->>R: Thank you — no subject detail leak
  end
  opt Subject blocked reporter
    S->>P: user-block (parallel path)
  end
```

## Consent / privacy

- Reporter identity protected from subject by default  
- No public moderation leaderboard  

## AI Constitution

- No AI auto-ban without human review path for edge cases  
- Compassionate copy to reporter and subject  

## State — report

```mermaid
stateDiagram-v2
  [*] --> submitted
  submitted --> under_review
  under_review --> dismissed
  under_review --> action_taken
  under_review --> escalated
  escalated --> action_taken
  action_taken --> [*]
  dismissed --> [*]
```

## Forbidden

- Retaliatory exposure of reporter  
- Automated permanent ban without appeal path  

## Related

- [APPEAL_FLOW.md](APPEAL_FLOW.md)  
