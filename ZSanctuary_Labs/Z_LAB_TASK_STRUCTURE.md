# Z Lab Task Structure

Status: Active  
Version: 1.0.0

## Objective

Prevent task-context mixing across different operational intents.

## Lanes

### `CORRESPONDENCE`

Use for:

- formal communications
- stakeholder-ready summaries
- signed-off publication drafts

Forbidden:

- mixing with `INACCORDANCE`
- mixing with `CHAT_ONLY`

### `INACCORDANCE`

Use for:

- contradiction mapping
- exception/risk analysis
- conflict resolution design

Forbidden:

- mixing with `CORRESPONDENCE`
- mixing with `CHAT_ONLY`

### `CHAT_ONLY`

Use for:

- brainstorming
- provisional ideas
- informal exploratory discussion

Forbidden:

- mixing with `CORRESPONDENCE`
- mixing with `INACCORDANCE`

## No-Mixing Protocol

1. A task enters one lane at creation.
2. Output stays in-lane unless manually promoted.
3. Promotion between lanes requires explicit human confirmation.
4. Every promotion leaves an audit note in `data/reports/`.
5. No hidden auto-linking between lane outputs.

## Canonical Machine Policy

`config/z_lab_task_lanes.json`
