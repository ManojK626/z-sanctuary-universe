# Z-MCBURB — Multi-Cores Backups Reconverge Booster

**Purpose:** Keep Z-Sanctuary **resilient** when files, reports, registries, dashboards, or project spines **drift, duplicate, break, disappear, or split** across folders — using **authorized, read-only** posture in Phase MCBURB-1 (doctrine + metadata only).

## What Z-MCBURB should do (conceptual)

- Scan **backup health** (where scripts and humans already produce artifacts).
- Compare **core registries** to manifests and expectations (via existing hub validators where present).
- Detect **missing reports** or stale receipts (cadence-aware in later phases).
- Flag **duplicate or damaged** patterns (align with **Z-CAR²** and structure verify scripts).
- Verify **manifest / catalog alignment** (registry omni, dashboard registry verify, entitlement catalog).
- Record **backup provenance** when humans or approved jobs create official backup artifacts.
- **Suggest** reconvergence steps in **reports only** until a human gate opens.
- **Never silently overwrite** canonical source truth.

## Planned machine outputs (later phase)

When chartered beyond Phase 1, a status script may emit:

- `data/reports/z_mcburb_backup_reconvergence_status.json`
- `data/reports/z_mcburb_backup_reconvergence_status.md`

Phase MCBURB-1 **does not** add that script; it defines policy in `data/z_mcburb_backup_policy.json` and this doctrine.

## Related systems (floating map)

| System | Role in Z-MCBURB |
| ---------------- | ------------------------------------------------------------------ |
| Superpower Shell | Command/check layer for scripted resilience |
| Whales Bus | Large data or event movement spine (**charter-gated**) |
| AI Tower | Project and service awareness |
| Floating Spines | Docs, reports, registries, cross-project links |
| Ghost Core | Backup and reflection trail (receipts + human ritual) |
| Alien Core | Anomaly signals — **advisory**, not autonomous enforcement |
| Z-CAR² | Duplicate / drift scan |
| Z-Traffic | Proceed / hold / RED advisory |
| ZAG | Autonomy limits — MCBURB stays **L0–L1 style** until explicit gate |

## Forbidden (all phases unless charter says otherwise)

- Silent overwrite, auto-restore, destructive merge, or delete without human confirmation and rollback plan.
- **Network surveillance**, hidden tracking, or **VPN bypass / deanonymization**.
- Bridge execution, deploy, billing, or entitlement **enforcement** from this slice.

## Metadata

- **Policy:** [data/z_mcburb_backup_policy.json](../../data/z_mcburb_backup_policy.json)

## Companion protocol

- **Z-FBAP** (Fire Backs Awareness Protocol): [Z_FBAP_FIRE_BACKS_AWARENESS_PROTOCOL.md](./Z_FBAP_FIRE_BACKS_AWARENESS_PROTOCOL.md)
- **Z-VH100** (defensive posture attitude): [Z_VH100_VEGETA_HARISHA_SECURITY_CORE.md](./Z_VH100_VEGETA_HARISHA_SECURITY_CORE.md)

## Phase receipt

- [PHASE_MCBURB_1_GREEN_RECEIPT.md](./PHASE_MCBURB_1_GREEN_RECEIPT.md)
