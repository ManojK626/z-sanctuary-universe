# Z-SMA — True Human Experience Sanctuary

**Phase:** Z-SMA-1 — Turtle Mode seed
**Runtime:** Static HTML + local seed JSON only
**Public status:** Private / family-reviewed only
**Receipt:** [PHASE_Z_SMA_1_GREEN_RECEIPT.md](PHASE_Z_SMA_1_GREEN_RECEIPT.md)

## Core meaning

Z-SMA is **not** a chatbot, trauma show, therapy replacement, or exploitation platform.

It is a **dignity-first human experience hub** where real people may share, in their own words and language, what life taught them through suffering, survival, family pain, society, silence, and resilience.

| Language             | Role                             |
| -------------------- | -------------------------------- |
| **Mauritius Creole** | Primary voice language           |
| **English / French** | Display and future assist labels |

## Golden law

```text
The human heartbeat is more important than the AI.
```

AI may **assist**, translate, summarize, subtitle, organize, and protect.
AI must **never** replace, imitate, pressure, expose, diagnose, or judge the sisters.

## People structure

Four sisters/cousins from the mother branch. Each has:

- Her own story lane
- Her own voice and consent status
- Her own privacy level
- Topics allowed / forbidden
- Display name or private name (by consent)
- Emotional boundaries

A **group lane** exists for shared stories when all consent.

## Story modes (vocabulary)

1. Individual story
2. Sisters together
3. Life lessons
4. Behind the smile
5. What society never saw
6. How we coped
7. What life taught us
8. Message to young people
9. Healing through memory
10. Family roots

## 14 DRP guardian rules

Before any story is saved, displayed, translated, summarized, or shared:

1. Consent must be clear
2. Person must be able to say no
3. Person must be able to remove content later
4. No shame language
5. No blame language
6. No forced trauma detail
7. No public release without human approval
8. No AI pretending to be the person
9. No diagnosis
10. No legal/medical claims
11. No monetization until separate governance
12. No exposing family secrets without consent
13. No child-sensitive content without extra gate
14. No sharing beyond approved audience

## AI assistant role (future — not in Z-SMA-1)

**Allowed later (with charter):** translate, structure, subtitles, gentle summaries, risky wording detection, privacy tagging.

**Forbidden:** impersonation, training public models without consent, diagnosis, pressure to speak, pain as entertainment, marketing suffering, publish without review.

## Z-SMA-1 prototype scope

| Artifact  | Path                                                |
| --------- | --------------------------------------------------- |
| Hub page  | `dashboard/Html/z-sma-true-life-hub.html`           |
| Script    | `dashboard/scripts/z-sma-true-life-hub-readonly.js` |
| Styles    | `dashboard/styles/z-sma-true-life-hub.css`          |
| Seed data | `data/z_sma_story_seed.json`                        |

Open over **http://** (same-origin GET to seed JSON). **Refresh data** = GET only.

### Explicitly not in Z-SMA-1

| Forbidden                           |
| ----------------------------------- |
| Backend, database                   |
| Live translation or external AI API |
| Voice recording, upload             |
| Public sharing, payment, deploy     |
| Real personal trauma text in repo   |

## Data model seed (reference)

Each future story entry may include: `story_id`, `sister_id`, `display_name`, `language`, `title`, `raw_story_text`, `translated_text`, `summary`, `privacy_level`, `consent_status`, `allowed_use`, `forbidden_use`, `emotional_risk_level`, `review_status`, `created_at`, `updated_at`.

**Default privacy:** `private_only`.

## Locked doctrine line

```text
Z-SMA preserves real human lived wisdom without stealing the dignity of the people who carried it.
```
