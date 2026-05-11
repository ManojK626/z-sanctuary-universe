# Z-Dashboard Merge Record

Date: 2026-02-08

## Summary

- Consolidated duplicated dashboard logic into core sanctuary engine.
- UI remains under `dashboard/`.
- Guard logic relocated under `core/sanctuary-engine/guards/`.
- Legacy `dashboards/` folder removed after merge.

## Moved Files

- dashboards/SKK/ethics-monitor.js -> core/sanctuary-engine/guards/skk-ethics-monitor.js
- dashboards/RKPK/balance-check.js -> core/sanctuary-engine/guards/rkpk-balance-check.js

## Updated Imports

- core/sanctuary-engine/lifecycle.js now references the new guard paths.

## Canonical Locations

- UI: /dashboard
- Logic: /core/sanctuary-engine/guards

## Reason

Single source of truth, no duplication, all requirements preserved.
