# Steward Decision Receipt — EMK-REHOME (Sister Aisling Sol / ÉirMind)

**Posture:** Decision receipt only · **no registry mutation in this pass** · **no hub runtime** · **no auto-merge of rows**
**Date:** 2026-08-08
**Steward:** AMK-Goku
**Branch:** `cursor/zsanctuary/amk-goku-control-panel-reconciliation`
**Audit commit:** `fad4f56`
**Prior alignment doc:** [root-discovery-audit/EIRMIND_ALIGNMENT_DECISION.md](root-discovery-audit/EIRMIND_ALIGNMENT_DECISION.md)
**Source audit:** [AMK_GOKU_CONTROL_PANEL_RECONCILIATION.md](AMK_GOKU_CONTROL_PANEL_RECONCILIATION.md) · [PROJECT_IDENTITY_RECONCILIATION.md](PROJECT_IDENTITY_RECONCILIATION.md)
**Prior Steward gate:** [STEWARD_DECISION_D2_HOLD.md](STEWARD_DECISION_D2_HOLD.md) — `D2-HOLD`

---

## Evidence

| Layer                   | Finding                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| Disk root               | `C:/Cursor Projects Organiser/Z-Sister Aisling Sol` **present**                          |
| Package                 | `z-sister-aisling-sol`                                                                   |
| Family AI               | `sister-aisling-sol` — Family / ÉirMind lineage companion                                |
| Nested monorepo         | `Z-Sister Aisling Sol/eirmind/` **present** (ÉirMind “Living Island”)                    |
| Former path             | `Ireland Projects` **absent** · stub id `eirmind-ireland-projects-missing`               |
| Hub indicator           | `eirmind` — PURPLE / NO_GO_FOR_DEPLOY / sibling_reference                                |
| Hub canvas              | ÉirMind dashed reference lane                                                            |
| Runnable ÉirMind in hub | **None**                                                                                 |
| Prior default           | EMK-HOLD with EMK-REHOME as working recommendation (**not executed** until this receipt) |

---

## Decision

**Code:** `EMK-REHOME`

**Meaning:** Sister Aisling Sol is the **canonical ÉirMind disk home**. The nested `eirmind/` monorepo is the on-disk product/lineage carrier. ÉirMind remains a **brand / subsystem / hub reference**, not a second Organiser root folder to invent.

```text
identity_relation = SUBSYSTEM (+ lineage for missing Ireland Projects stub)
canonical_disk    = Sister Aisling Sol  (id: sister-aisling-sol)
aliases           = ÉirMind / Eirmind (brand + nested path + indicator)
Ireland Projects  = former path; stub retained for history (no delete)
```

---

## Consequence

| Action                                       | This pass        | Later (only after full Steward Pass + verified text pass)               |
| -------------------------------------------- | ---------------- | ----------------------------------------------------------------------- |
| Auto-merge / delete registry rows            | **No**           | Still no destructive merge without explicit follow-up                   |
| Invent `Ireland Projects` folder             | **No**           | Only if a future **EMK-RESTORE** with verified path                     |
| Hub ÉirMind runtime / deploy / billing       | **No**           | Requires separate charter                                               |
| Identity map / notes acknowledging rehome    | Receipt only now | Non-destructive registry/indicator **wording** allowed in verified pass |
| Keep stub `eirmind-ireland-projects-missing` | **Yes**          | May add notes pointing to Aisling as disk home                          |

**Does not authorize:** product launch, API bridge, silent price inheritance, or treating awareness as launch permission.

---

## Chain

```text
evidence → decision → consequence → receipt
     ✓        EMK-REHOME   identity only / no mutate   this file
```

---

## Steward Pass progress

| Gate       | State                    |
| ---------- | ------------------------ |
| D2-\*      | **Decided** — D2-HOLD    |
| EMK-\*     | **Decided** — EMK-REHOME |
| REP-STATUS | Open (next)              |

**Next:** REP-STATUS — Z-Sanctuary Replit (receipt only after Steward signs).
