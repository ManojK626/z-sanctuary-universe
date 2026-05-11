# Z — Project awareness capsule policy

**Purpose:** Define the **small** JSON capsule each project may ship so the hub can aggregate awareness **without** copying full Markdown doctrine into every repository.

## Rules

- Capsule schema: `z_project_awareness_capsule_v1` (see [`data/examples/z_project_awareness_capsule.example.json`](../data/examples/z_project_awareness_capsule.example.json)).
- **Hub remains canonical** for law, security policy, and long-form doctrine.
- Capsule fields are **posture and pointers**: signals, checks, gates, autonomy, doc/report links — not a second bible.
- **Sibling projects** may store `z_project_awareness_capsule.json` under their tree; the hub registry points with `capsule_path`.
- **External / placeholder** projects use `capsule_path: ""` and `known_hold_reason` explaining why the hub clone has no file.

## Required fields (summary)

`project_id`, `project_name`, `primary_domain`, `current_signal`, `growth_percent`, `required_checks`, `api_health`, `smoke_gate`, `build_gate`, `docs_gate`, `autonomy_level`, `allowed_auto_checks`, `human_gated_actions`, `related_docs`, `related_reports`, `notes`.

## Related

- [Z_ECOSYSTEM_AWARENESS_SPINE.md](./Z_ECOSYSTEM_AWARENESS_SPINE.md)
- [data/z_ecosystem_awareness_registry.json](../data/z_ecosystem_awareness_registry.json)
