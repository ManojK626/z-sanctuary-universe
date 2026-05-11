# ZALS Deliverable 2

## Vendor-Ranked Buy Order + Procurement Timeline

Prepared: 2026-02-11
Scope: execute Z-Vault hardware procurement with low risk, staged cash flow, and operational continuity.

## 1) Procurement Strategy

1. Buy in stages, not all-at-once.
2. Prioritize integrity path first (`NAS + UPS + NVMe`).
3. Delay HDD quantity expansion until burn-in checks pass.
4. Keep at least one fallback vendor for every critical item.

## 2) Vendor Ranking Method

Rank each offer by:

- `Final price (with VAT + shipping)`
- `Warranty length and RMA reputation`
- `Return policy (14+ days preferred)`
- `In-stock certainty`
- `Delivery reliability to your region`

Score model:

- Price 40%
- Warranty/RMA 25%
- Stock certainty 20%
- Return policy 10%
- Delivery speed 5%

## 3) Ranked Buy Order (Execution Sequence)

### Wave A: Infrastructure Lock (Day 1-3)

Buy now:

1. `UGREEN NASync DXP4800 Plus` (x1)
2. `CyberPower CP1600EPFCLCD` UPS (x1) or Eaton fallback
3. `WD Black SN850X 1TB` NVMe (x2)
4. `QNAP QXG-10G1T` 10GbE card (x1)
5. `Cat6A S/FTP cable` (x1)

Reason:

- Enables secure local build and encrypted Z-Vault baseline before large data disk spend.

### Wave B: Array Build (Day 4-10)

Buy after Wave A passes:

1. `WD Red Plus 8TB WD80EFPX` (x4 for RAID 6)
   - or x3 for initial RAID 5 budget path.

Reason:

- Avoids buying all HDDs before NAS/UPS/NVMe compatibility is validated.

### Wave C: Capacity / Comfort (Week 3+)

Optional:

1. RAM expansion kit (only if telemetry shows memory pressure)
2. Extra HDD for hot spare (recommended if uptime target is strict)

## 4) Burn-In and Acceptance Gates

Do not progress to the next wave unless current wave passes:

Wave A gate:

- NAS boots stable
- UPS clean switchover test passes
- NVMe recognized and cache/index role assignable
- 10GbE direct-link negotiates expected speed

Wave B gate:

- RAID creation successful
- Encrypted volume `Z-Vault` created
- Snapshot schedule active
- 24-hour SMART and I/O sanity checks pass

Wave C gate:

- Observe real workload for 7 days
- Upgrade only on measured bottlenecks

## 5) Weekly Timeline (Practical)

Week 1:

- Place Wave A orders
- Rack/desk setup
- Local-only NAS mode

Week 2:

- Place Wave B orders
- Build RAID 6
- Enable snapshots + offsite sync target definition

Week 3:

- Deploy Docker jobs:
  - `reports_vault_refresh`
  - `core_engine_audit`
- Map NVMe cache for SSWS exports
- Validate restore workflow

Week 4:

- Optional Wave C
- Freeze baseline
- Start signed read-only mirror pipeline planning

## 6) Risk Controls

- Always keep one unopened spare drive during deployment window.
- Capture invoice + serial + warranty in one registry file.
- Never enable public access before restore test succeeds.
- Keep Cloudflare Pages mirror read-only and signed artifacts only.

## 7) Deliverable Outputs to Maintain

Create/update after each wave:

- `data/reports/z_procurement_status.json`
- `data/reports/z_vault_burnin.md`
- `data/reports/z_restore_test.md`

## 8) Recommended Default Path

If you want the safest standard path:

1. Wave A full
2. Wave B RAID 6 (4x HDD)
3. Wave C optional only after telemetry

This gives best integrity for Z-Vault and clean growth runway for 100+ modules.

## 9) Sanctuary NAS Architecture (Blueprint)

For PC vs NAS capability match, folder layout on NAS, backup/snapshot strategy, and **AI auto-management** (Zuno, module registry, folder manager, Docker jobs): see **[Z-SANCTUARY-NAS-ARCHITECTURE-BLUEPRINT.md](Z-SANCTUARY-NAS-ARCHITECTURE-BLUEPRINT.md)**.
