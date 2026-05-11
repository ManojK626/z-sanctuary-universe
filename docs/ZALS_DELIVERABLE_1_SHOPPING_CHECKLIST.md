# ZALS Deliverable 1

## Z-Vault Upgrade Shopping Checklist (Exact Models + EUR Pricing)

Prepared: 2026-02-11  
Scope: local-first NAS hardening for Z-Sanctuary (`cache + index + RAID + UPS + 10GbE`)

Prices are live-market snapshots and can move daily.

## 1) Core Components (Recommended)

1. NAS chassis

- Model: `UGREEN NASync DXP4800 Plus`
- Qty: `1`
- Price (EUR): `699.99`
- Why: 4-bay NAS, 10GbE + 2.5GbE, 2x M.2 NVMe for cache/index
- Source: https://nas-eu.ugreen.com/en-eufr/products/ugreen-nasync-dxp4800-plus-nas-storage

2. NVMe SSD (cache + index)

- Model: `WD Black SN850X 1TB (WDS100T2X0E)`
- Qty: `2`
- Price (EUR each): `164.89` (range seen 159.89-174+)
- Why: high random I/O, stable PCIe Gen4 NVMe for cache/index lanes
- Source: https://www.idealo.de/preisvergleich/OffersOfProduct/202070634_-black-sn850x-1tb-western-digital.html

3. NAS HDD option A (primary recommendation)

- Model: `WD Red Plus 8TB (WD80EFPX)`
- Qty: `4` (RAID 6) or `3` (RAID 5)
- Price (EUR each): `247.00` (range depends on vendor)
- Why: NAS-tuned firmware, good fit for 4-bay arrays
- Source: https://www.idealo.de/preisvergleich/OffersOfProduct/203695758_-red-plus-8tb-wd80efpx-western-digital.html

4. NAS HDD option B (alternate)

- Model: `Seagate IronWolf 8TB (ST8000VN004)`
- Qty: `4` (RAID 6) or `3` (RAID 5)
- Price (EUR each): `259.00` (typical)
- Why: strong NAS workload profile, widely available
- Source: https://www.idealo.de/preisvergleich/OffersOfProduct/6639979_-ironwolf-8tb-st8000vn004-seagate.html

5. UPS (pure sine target, EU)

- Model: `CyberPower CP1600EPFCLCD` (EU equivalent line for 1500/1600 class pure sine)
- Qty: `1`
- Price (EUR): `298.41` (range up to ~378)
- Why: protects RAID rebuild/window, snapshot integrity, shutdown safety
- Source: https://www.idealo.de/preisvergleich/OffersOfProduct/204280576_-cp1600epfclcd-cyberpower-systems.html

6. 10GbE direct-link card (PC side)

- Model: `QNAP QXG-10G1T`
- Qty: `1`
- Price (EUR): `154.24` (range ~154-177+)
- Why: stable 10GBase-T for PC <-> NAS direct path
- Source: https://www.idealo.de/preisvergleich/OffersOfProduct/6274110_-qxg-10g1t-qnap.html

7. 10GbE cable

- Model: `Cat6A S/FTP 10m (LSFRZH)`
- Qty: `1`
- Price (EUR): `12.74`
- Why: shielded, adequate for 10GbE direct link
- Source: https://www.daycomp.eu/en/utp-ftp-direct-patch/19890-xtendlan-patch-cable-cat-6a-sftp-lsfrzh-10m-gray-8592457141068.html

## 2) Optional Components

1. NAS RAM expansion (if needed by workload)

- Model: `Crucial 64GB Kit DDR5-5600 (CT2K32G56C46S5)`
- Qty: `1`
- Price (EUR): `529.90` (high volatility in current market)
- Source: https://www.idealo.de/preisvergleich/OffersOfProduct/203006824_-64gb-kit-ddr5-5600-cl46-ct2k32g56c46s5-crucial.html

2. UPS fallback model (if CyberPower stock is weak)

- Model: `Eaton Ellipse PRO 1600 IEC (ELP1600IEC)`
- Price (EUR): `390.90` to `396+`
- Source: https://www.idealo.de/preisvergleich/OffersOfProduct/4783637_-ellipse-pro-1600-iec-eaton.html

## 3) Budget Snapshots (EUR)

### A) RAID 6 path (4x HDD, recommended for integrity)

- NAS: `699.99`
- NVMe (2x): `329.78`
- HDD WD Red Plus (4x): `988.00`
- UPS CyberPower: `298.41`
- 10GbE NIC: `154.24`
- Cat6A cable: `12.74`
- Total: `2483.16`

### B) RAID 5 path (3x HDD, lower cost)

- NAS: `699.99`
- NVMe (2x): `329.78`
- HDD WD Red Plus (3x): `741.00`
- UPS CyberPower: `298.41`
- 10GbE NIC: `154.24`
- Cat6A cable: `12.74`
- Total: `2236.16`

### C) Optional RAM add-on

- Add `+529.90` if 64GB RAM upgrade is required.

## 4) Integration Roadmap (Execution Order)

1. Set NAS in local-only mode (no internet exposure).
2. Build RAID set and encrypted volume: `Z-Vault`.
3. Enable snapshots and offsite sync policy (signed, read-only target).
4. Install Docker workloads:

- `reports_vault_refresh`
- `core_engine_audit`

5. Assign one NVMe as SSWS export/cache acceleration.
6. Wire PC to NAS using 10GbE direct link.
7. Later mirror signed reports to Cloudflare Pages (read-only).

## 5) Procurement Checklist (Tick-Off)

- [ ] Order NAS: `UGREEN DXP4800 Plus`
- [ ] Order NVMe x2: `WD SN850X 1TB`
- [ ] Order HDD x3 or x4: `WD80EFPX` or `ST8000VN004`
- [ ] Order UPS: `CP1600EPFCLCD` (or Eaton fallback)
- [ ] Order 10GbE NIC: `QXG-10G1T`
- [ ] Order Cat6A S/FTP cable
- [ ] Confirm seller warranty + return policy + VAT handling

## 6) Queueing Model Note (Usefulness for Z-Sanctuary)

The M/M/n/K non-homogeneous queue model is useful for:

- capacity planning of SSWS/autopilot jobs,
- sizing worker pools/containers,
- choosing fastest-free-server vs random dispatch policy.

Recommendation: apply it after storage upgrade as a planning layer, not before.
