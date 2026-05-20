# Z-WORK-PULSE — Background Work Witness (Phase 0)

**Formal lane:** Z-WORK-PULSE-0  
**Alias:** Background Work Witness  
**Hub:** Z-Sanctuary Universe

## Mission

Z-WORK-PULSE gives the ecosystem a **read-only pulse** for work that is **in flight** on the PC or in operator-started pipelines — step labels, optional percent complete, and traffic-style signals — so **AMK indicators**, **AI assistants**, and **Z-Cycle Observe** stay aware **without** treating progress as permission to merge, deploy, or auto-run the task queue.

## Non-mission

Z-WORK-PULSE is **not**:

- a daemon, scheduler, or auto-starter
- a deployment or Cloudflare control plane
- a GitHub merge/PR bot
- payment, legal, or billing automation
- an executor for `task_queue` rows from Z-Cycle Observe
- a replacement for `growth_percent` on AMK indicators (readiness vs live job)

**Standing law:**

```text
observe → witness → suggest → human decides
Progress ≠ permission
Work % ≠ certification
Witness ≠ executor
```

Machine policy: `data/z_background_work_policy.json`.

---

## Z-WORK-PULSE identity

| Term | Meaning |
| --- | --- |
| **Z-WORK** | Any **bounded** operator- or CI-started job (npm script, verify chain, background_run, explicit VS Code task) that may emit a witness receipt |
| **Pulse** | A time-stamped update to the witness artifact (`updated_at`, optional `progress_pct`) |
| **Witness** | Read-only evidence file; consumers poll or fetch over HTTP — no callback into execution |

Phase 0 defines **doctrine and policy only**. Phase 1+ may add producers and dashboard overlay **after** human approval.

---

## Dual percentage model

| Field | Scope | Authority |
| --- | --- | --- |
| `growth_percent` | Project/system **maturity** (AMK-INDICATOR-1 bands) | Human receipts + registry |
| `work_progress_pct` | **This run only** (0–100) | Witness producers (L1/L2 jobs) |

Never use `work_progress_pct` to flip amber to green, certify release, or auto-merge.

---

## Phase 0 artifacts

| Artifact | Phase 0 status |
| --- | --- |
| `docs/Z_BACKGROUND_WORK_WITNESS.md` | **This document** |
| `data/z_background_work_policy.json` | Schema, signals, forbidden actions, consumer hints |
| `data/reports/z_background_work_status.json` | **Reserved** — not written by hub automation in Phase 0 |
| `data/reports/z_background_work_status.md` | **Reserved** — optional human summary in Phase 1 |

---

## Witness receipt shape (Phase 1 target)

When chartered, producers write **only** under `data/reports/`:

```json
{
  "schema": "z_background_work_status_v1",
  "posture": "witness_only",
  "overall_signal": "YELLOW",
  "active_jobs": [
    {
      "job_id": "verify-md-example",
      "title": "markdown verify",
      "source": "npm",
      "autonomy_level": "L1_REPORT",
      "signal": "YELLOW",
      "work_progress_pct": 40,
      "step": "lint:md",
      "step_index": 2,
      "step_total": 5,
      "started_at": "2026-05-20T12:00:00.000Z",
      "updated_at": "2026-05-20T12:04:00.000Z",
      "forbidden_auto_actions": ["merge", "deploy", "push", "secrets_write"],
      "human_gate": false
    }
  ],
  "recent_completed": []
}
```

Prefer **step_index / step_total** when steps are known; use `work_progress_pct` only when the producer can compute it honestly.

---

## Autonomy levels (aligned with guardian policy)

Maps to `data/z_autonomy_task_policy.json`:

| Level | Witness posture | Typical jobs |
| --- | --- | --- |
| **L0** | Observe-only scans | Directory/registry read |
| **L1** | Report refresh | `verify:md`, `z:traffic`, `z:car2`, registry verify |
| **L2** | Hygiene (opt-in) | `lint:md:fix` when **explicitly** invoked |
| **L3** | Patch suggestion | Cursor PR prep — witness may show **idle** or **human_gate** |
| **L4** | Human-approved apply | Control-link apply, manifest PR — **BLUE** default |
| **L5** | Charter-only | Deploy, payment, NAS, secrets — **RED** or **BLOCKED** witness |

Witness must **not** downgrade L4/L5 to L1 because a bar moved.

---

## Signals while work runs

| Signal | Meaning |
| --- | --- |
| **GREEN** | Idle or last job completed without failure |
| **YELLOW** | L1/L2 job in progress — awareness, not failure |
| **BLUE** | Job touches sacred-preview scope or needs AMK glance |
| **RED** | Job failed or forbidden action detected |

**YELLOW in progress ≠** “fix urgently” unless paired with RED on the same job.

---

## Inputs (read-only consumers)

| Consumer | Use |
| --- | --- |
| AMK indicators | Future row `z_work_pulse` overlays `overall_signal` + optional bar |
| `core/z_autorun_monitor.js` | Prefer witness JSON over log tail inference |
| `core/z_cycle_indicator_panel.js` | Optional pulse line beside cycle calm stats |
| **Z-Cycle Observe** | Optional input: enrich `task_queue` with `blocked_by_work` metadata — **no execution** |
| Cursor / AI Builder | Summarize pulse in chat; never grant merge/deploy |

Existing log witness (Phase 0 unchanged): `logs/background_run.log`, `logs/background_run.last` — Phase 1 may map log steps to witness rows.

---

## Producers (Phase 1+ — operator-started only)

| Producer | Charter |
| --- | --- |
| `scripts/background_run.py` | Step lines → pulse rows |
| Allowlisted `npm run …` wrappers | Start / step / complete receipts |
| VS Code tasks | Optional end-of-task receipt refresh (**human runs task**) |
| Cursor Background Agent | May write witness on `cursor/zsanctuary/*` only — **no merge** |

**Forbidden producers in all phases:** silent cron, hub auto-scheduler, Cycle Observe self-trigger, Cloudflare Workers, payment webhooks.

---

## Growth mode (Calm / Normal)

Respect `core/z_growth_mode.js`:

| Mode | Client poll of witness JSON | UX |
| --- | --- | --- |
| **Normal** | Base interval (e.g. 30–60s when panel open) | Smooth bar updates |
| **Calm** | `ZGrowthMode.mult()` (~2.5× slower) | Coarser updates; label “Calm — pulse slowed” |

Witness slowing is **not** hiding failure: RED/BLUE still shown on next poll.

---

## Relationship to peer systems

| System | Relationship |
| --- | --- |
| **Z-CYCLE-OBSERVE-1** | Observer suggests queue; witness reports **work in flight** — observer must not run queue because progress is non-zero |
| **AMK-INDICATOR-1** | `growth_percent` stays readiness; witness adds **work_progress_pct** overlay |
| **Z-ECO-MAP** | Maps which project a job belongs to (`project_id` on job row) |
| **Z-MDE / Z-FUSION** | Unrelated to live %; fusion still human-gated |
| **Z-Traffic** | Traffic rollup + witness pulse are complementary evidence |
| **Turtle Mode** | One domain per PR; witness on branch work does not imply merge |

---

## Forbidden actions

Z-WORK-PULSE must **never**:

- auto-start jobs because the queue or indicator is YELLOW
- auto-merge, auto-push, or open PRs when `work_progress_pct` reaches 100
- mutate Cloudflare, GitHub settings, or payment registries
- move secrets or legal/evidence files
- execute `task_queue` items from Z-Cycle Observe
- conflate witness GREEN with deploy GREEN

---

## Phase roadmap

| Phase | Scope |
| --- | --- |
| **0 (now)** | This doctrine + `z_background_work_policy.json` |
| **1** | Manual or scripted writes to `z_background_work_status.json`; 1–3 producers |
| **2** | AMK indicator row + `z_autorun_monitor` reads witness |
| **3** | Z-Cycle Observe ingests witness into `task_queue` metadata |
| **4** | Optional read-only dashboard strip / topology link |

---

## Operator checklist (Phase 1 prep)

1. Confirm job is **L1 or L2** and explicitly started by AMK or CI.
2. Assign `job_id` and `autonomy_level` before run.
3. On complete, clear `active_jobs` or move row to `recent_completed`.
4. If job touched deploy/payment/legal topics, set `human_gate: true` and **BLUE**.
5. Re-run `npm run z:cycle:observe` only when **you** choose — not triggered by witness.

---

## Verdict template

```text
VERDICT: SAFE | NEEDS HUMAN DECISION | BLOCKED

Phase: 0 doctrine only?

Summary: <one paragraph>

Active jobs: <count or none>

Sacred moves implied: yes/no
```

| Verdict | When |
| --- | --- |
| **SAFE** | Phase 0 docs/policy; read-only awareness design |
| **NEEDS HUMAN DECISION** | Phase 1+ producers, indicator overlay, Cycle Observe coupling |
| **BLOCKED** | Auto-run on progress, auto-merge at 100%, deploy/payment from witness |

---

## Related

- [Z_CYCLE_OBSERVE_SYSTEM.md](./Z_CYCLE_OBSERVE_SYSTEM.md)
- [AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md](./AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md)
- [Z_CYCLE_DASHBOARD_SYSTEM.md](./Z_CYCLE_DASHBOARD_SYSTEM.md)
- [data/z_autonomy_task_policy.json](../data/z_autonomy_task_policy.json)
- [data/z_background_work_policy.json](../data/z_background_work_policy.json)
