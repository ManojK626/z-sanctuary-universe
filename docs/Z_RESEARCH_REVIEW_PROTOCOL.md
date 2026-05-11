# Z Research Review Protocol (Auto Intake, Manual Adoption)

## Objective

Continuously collect useful external research signals while preventing uncontrolled drift or unsafe copying into core systems.

## Rules

- Source collection can be automated.
- Strategy adoption is always manual and reviewed.
- Only allowlisted domains are collected.
- No automatic code/model replacement from external sources.

## Pipeline

1. Add URLs to `data/research/z_research_queue.json`.
2. Run `node scripts/z_research_intake.mjs`.
3. Review `data/reports/z_research_intake.json`.
4. Promote only approved findings into specs/backlog.

## Adoption Gate

- `approved = false` means insight is informational only.
- Any operational change must reference a human-reviewed ticket or note.
