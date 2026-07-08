# Track A — VILE Foundation Integration

**Priority:** P0 (highest engineering)
**Status:** In progress
**Posture:** No runtime · no deployment · no application implementation · no payments · no API expansion · no new features

**Doctrine:**

> Strong foundations make future development faster.

> Freeze. Protect. Review. Build deliberately.

---

## Objective

Safely complete the shared engineering foundation before any public-facing application runtime begins.

---

## Mission checklist

| #   | Step                                | Status                                             |
| --- | ----------------------------------- | -------------------------------------------------- |
| 1   | Review VILE Packages 1–3            | **Ready for human review** (30/30 GREEN on branch) |
| 2   | Verify package boundaries           | **Done** (integration report)                      |
| 3   | Review package documentation        | **Done** per green receipts                        |
| 4   | Confirm governance compliance       | **Merge Hold ACTIVE**                              |
| 5   | Merge into `main` only after review | **Pending — human gate**                           |
| 6   | Implement `zuno-drp`                | **Charter only — blocked until step 5**            |
| 7   | Run full technical verification     | **After merge** — `npm run verify:full:technical`  |
| 8   | Produce Foundation Readiness Report | **`npm run z:vile:foundation:readiness`**          |

---

## Packages

| #   | Package                           | Path                          | Tests (receipt) |
| --- | --------------------------------- | ----------------------------- | --------------- |
| 1   | `@z-sanctuary/zuno-observability` | `packages/zuno-observability` | 8/8             |
| 2   | `@z-sanctuary/zuno-security`      | `packages/zuno-security`      | 12/12           |
| 3   | `@z-sanctuary/zuno-shadow`        | `packages/zuno-shadow`        | 10/10           |
| 4   | `@z-sanctuary/zuno-drp`           | charter only                  | —               |

Integration: [PHASE_2A_FOUNDATION_INTEGRATION_REPORT.md](PHASE_2A_FOUNDATION_INTEGRATION_REPORT.md)

---

## Ecosystem priority order (AMK 2026-07-08)

| Track                             | Priority | When                                          |
| --------------------------------- | -------- | --------------------------------------------- |
| **A** 🏗️ VILE Foundation          | **P0**   | Now                                           |
| **MC** 🌍 Mission Control         | P2       | MC-0.8 after Track A stable                   |
| **B** ❤️ Soulmates B2.1           | P3       | After Track A green                           |
| **C** 🌍 MC merge                 | Pause    | After MC-0.6/MC-1 review — not before Track A |
| **D** 📖 Foundation Consolidation | P4       | After holiday                                 |

---

## Foundation Readiness Dashboard

Read-only panel on AMK-Goku Main Control Dashboard + machine report:

- Command: `npm run z:vile:foundation:readiness`
- Report: `data/reports/z_vile_foundation_readiness_status.md`
- Overseer: [Z_VILE_FOUNDATION_READINESS_OVERSEER.md](Z_VILE_FOUNDATION_READINESS_OVERSEER.md)

---

## Hard boundaries

- No runtime wiring into apps until foundation on `main`
- No deploy, Cloudflare bind, or payment systems
- Mission Control observes — human approves every merge

---

## Related

- [Z_VILE_FOUNDATION_READINESS_OVERSEER.md](Z_VILE_FOUNDATION_READINESS_OVERSEER.md)
- [IMPLEMENTATION_PHASES.md](IMPLEMENTATION_PHASES.md)
- [PHASE_2A_PACKAGE_4_ZUNO_DRP_CHARTER.md](PHASE_2A_PACKAGE_4_ZUNO_DRP_CHARTER.md)
