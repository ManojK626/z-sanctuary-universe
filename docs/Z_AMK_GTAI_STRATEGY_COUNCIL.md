# Z-AMK-GTAI — AMK-Goku TeamS AI Strategy Council

## Purpose

**Z-AMK-GTAI** is a **read-only strategy council** layer: it **reads existing hub reports** (traffic, SSWS, doorway, workspace profiles, OMNAI, SUSBV, CAR², and optional others) and emits **one consolidated strategy report** so AMK-Goku sees **what happened**, **why a signal is RED/BLUE/YELLOW/GREEN/GOLD**, **what is safe next**, **what must stay human-gated**, and the **smallest reversible step** — **before** opening the next build or deploy lane.

It is **not** another noisy executor, **not** a live AI provider, and **not** permission to run sacred moves.

## Registry and command

| Artifact | Role |
| --------------------------------------------------- | --------------------------------------------------------- |
| `data/z_amk_gtai_strategy_council.json` | Council doctrine, roles, report paths, laws, alert policy |
| `scripts/z_amk_gtai_strategy_report.mjs` | Read-only generator: `npm run z:amk:strategy` |
| `data/reports/z_amk_gtai_strategy_report.{json,md}` | Evidence for AMK and Zuno-style narration |

## Core roles (conceptual)

| Role | Job |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| **Zuno AI** | Final strategy narrator posture — human and Zuno still judge; council output is **input** to judgment |
| **AMK Super Ghost** | Hidden drift / repeated warnings — **read-only** hints in council JSON; not an executor |
| **High Architecture Chief Overseer** | Fit with Hierarchy Chief / Overseer — **doctrine alignment**, not repo moves |
| **Z-Traffic Minibots** | RED / BLUE / YELLOW / GREEN evidence tower |
| **Z-AAL Advisor** | Auto-safe vs AMK-sacred classification (see AAL doc) |
| **Z-SUSBV / Z-OMNAI** | Commercial and creative readiness **interpretation** from existing reports only |
| **Z-SSWS / Doorway / Lab** | Workspace and local PC readiness from SSWS + doorway + LAB reports |
| **VH100 / MCBURB / FBAP** | Security / backup / fire-backs **doctrine references** — no tooling execution here |
| **Z-Sage Warrior / EagleEye** | Advisory wording in council spec — still **L1 report** posture |

## Signal interpretation

| Signal | Meaning | Council output |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **RED** | Broken, unsafe, missing, or gate-failed in aggregated evidence | RED summary, smallest fix hints, verify commands — **blocks treating the week as clear** |
| **BLUE** | System may be “fine” technically but **AMK/human** must own deploy, billing, secrets, public, legal, bridges, Cloudflare, providers | BLUE decision brief fields |
| **YELLOW** | Caution, optional gap, advisory drift | Observation note — **quiet** unless repeated (see weekly observation doc) |
| **GREEN** | Safe internal baseline for next **normal** evidence lane | Receipt-style summary — **does not deploy** |
| **GOLD** | Sealed / rest baseline | Hold and breathe |

## Law

```text
Strategy report ≠ execution.
Recommendation ≠ permission.
BLUE requires AMK.
RED blocks movement.
GREEN does not deploy.
YELLOW stays quiet unless escalated.
AMK-Goku owns sacred moves.
```

## Related

- [AMK_AUTONOMOUS_APPROVAL_LADDER.md](AMK_AUTONOMOUS_APPROVAL_LADDER.md)
- [Z_TRAFFIC_MINIBOTS.md](Z_TRAFFIC_MINIBOTS.md)
- [ZUNO_WEEKLY_FULL_RUN_AND_OBSERVATION.md](ZUNO_WEEKLY_FULL_RUN_AND_OBSERVATION.md)
- [PHASE_Z_AMK_GTAI_1_GREEN_RECEIPT.md](PHASE_Z_AMK_GTAI_1_GREEN_RECEIPT.md)
