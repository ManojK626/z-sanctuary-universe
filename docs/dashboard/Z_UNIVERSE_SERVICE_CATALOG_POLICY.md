# Z Universe Service Catalog — Policy

## Schema

| Field | Meaning |
| -------------------- | ----------------------------------------------------------------------- |
| `schema` | `z_universe_service_catalog_v1` |
| `posture` | Must remain `read_only_metadata` for NAV-1 |
| `bridge_status` | Hub-wide default `not_connected` unless chartered |
| `memory_folder_gate` | Describes future user/project memory — **not implemented** in navigator |

## Service entries

Each service SHOULD include:

| Field | Notes |
| ---------------------------------- | ------------------------------------------------------------------- |
| `id` | Stable snake_case |
| `category` | Matches `categories[].id` |
| `drp_gate` | `always`, `required_for_live_bridge`, or equivalent honesty |
| `memory_status` | `none`, `local_opt_in_only_inside_app`, `future_gated`, … |
| `workflow_summary` | Ordered plain-language steps (education, not automation) |
| `allowed_next_actions` | Human/terminal actions — **not** dashboard buttons that run scripts |
| `forbidden_until_gate` | Explicit guardrails |
| `related_docs` / `related_reports` | Paths relative to repo root |

## Governance

- **14 DRP / safety habits:** Navigator surfaces docs (e.g. `docs/Z_SANCTUARY_SAFETY_INDEX.md`); it does not replace human gates, release enforcer, or MAOS charter.
- **XL2 / high-risk lanes:** Marked `reference_only` until explicit charter (see catalog row `xl2_reference_lane`).

## Editing rules

1. Prefer adding links to existing truth (registry JSON, reports) over inventing new URLs.
2. After editing catalog JSON, reload dashboard and spot-check links.
3. Do not add execution hooks, telemetry, or cloud endpoints to navigator scripts.
