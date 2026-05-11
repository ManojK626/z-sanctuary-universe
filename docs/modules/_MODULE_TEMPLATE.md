# Module Name (human title)

## Registry Identity

| Field | Value |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| **ID** | `module_id` |
| **Category** | `category_slug` |
| **Registry status** | `implemented` / `partial` / `planned_stub` / `doctrine_only` / `safety_hold` / `decision_required` |
| **Safety class** | `low` / `medium` / `high` |
| **Z registry ZID** | optional |

## Purpose

Short explanation of what this module is for.

## Current Evidence

Only real paths:

- `relative/path/from/repo/root`

If no evidence exists:

> No implementation evidence currently declared. This module is registry or doctrine only until `expected_paths` are added and files exist.

## Current Build Posture

One of: implemented, partial, planned, safety-hold, decision-required — match registry and audit.

## Safety Boundaries

Link to relevant files under `docs/safety/` when applicable.

## Allowed Next Steps

Safe actions only (docs, registry, narrow refactors inside evidence).

## Forbidden Until Gate

Actions Cursor must not take without AMK / governance / boundary review.

## Cursor Builder Notes

- Do not invent files.
- Do not activate production features or sensitive modalities without gates.
- Default deployment posture: HOLD.

## Zuno Verdict

One of: `READY_FOR_DOCS_ONLY`, `READY_FOR_UI_STUB`, `READY_FOR_SAFE_REFACTOR`, `SAFETY_HOLD`, `NEEDS_AMK_DECISION`.
