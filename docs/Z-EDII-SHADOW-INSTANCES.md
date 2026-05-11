# Z-EDII Shadow Instances

**Purpose:** Reuse Z-EDII **patterns** across projects, companies, and industries **without** cross-contaminating data, permissions, or memory.

## Main vs Shadow

| Layer | Role |
| ----------------- | ---------------------------------------------------- |
| **Main Z-EDII** | Doctrine, standards, shared design language |
| **Shadow Z-EDII** | Local instance inside one project or tenant boundary |

## Golden rule

```text
Shadow instances serve their own domain.
Core Sanctuary receives summaries, not raw private data.
```

## Architecture (conceptual)

```text
Z-EDII Core Standard
├── UI rules
├── panel rules
├── AI assistant rules
├── accessibility rules
├── trust labels
└── approval gates

Project Shadow Instance
├── local panel registry
├── local role permissions
├── local data adapters
├── local assistant memory (scoped)
├── local receipts
└── safe summary export only
```

## Required fields (every Shadow instance)

```text
instance_id
project_or_company_owner
allowed_data_scope
forbidden_data_scope
role_views
local_assistant_rules
export_summary_rules
receipt_log
human_approval_gate
pause_or_kill_switch
```

## Status levels

| Status | Meaning |
| --------- | ------------------------------------ |
| `DRAFT` | Design only |
| `MOCK` | Static / demo |
| `LOCAL` | One project only |
| `STAGING` | Test with fake or customer-safe data |
| `LIVE` | Approved production |
| `PAUSED` | Disabled |

## Tenant safety

- No shared private memory across tenants.
- Assistant **cannot** see another tenant’s raw workspace.
- Summary exports to Sanctuary Core are **aggregated and non-identifying** unless explicit charter.

## AI assistant memory boundaries

Each Shadow assistant knows **only** its instance scope. Wider context arrives as **Commander / Zuno summary**, not vault or raw peer-project files.

## Examples (doctrine tags)

- Z-ANIMA Shadow Dashboard — animal/compassion scope only.
- Product Registry Shadow Dashboard — catalogue lane only.
- Company Partner Dashboard — that partner’s tasks only.
- Investor View Dashboard — approved metrics pack only.

## Forbidden

Shared private memory across tenants, hidden tracking, auto payments, auto submissions, uncontrolled agent execution, raw Sovereign Vault access from Shadow assistants.

## Future phase

Read-only instance manifest validator (schema check, no runtime execution).

## Related

- [Z-EDII-EXPERT-DASHBOARDS-INTELLIGENCE-INTERFACES.md](Z-EDII-EXPERT-DASHBOARDS-INTELLIGENCE-INTERFACES.md)
- [Z-RPWC-REPLICABLE-POWER-WITHOUT-CHAOS.md](Z-RPWC-REPLICABLE-POWER-WITHOUT-CHAOS.md)
