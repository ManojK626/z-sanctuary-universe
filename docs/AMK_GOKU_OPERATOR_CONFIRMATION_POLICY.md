# AMK-Goku operator confirmation policy

## Role

**AMK-Goku** (human operator) is the **final lane opener** for work that touches governance, commercial surfaces, deploy, bridges, vault, or autonomy escalation. Dashboard panels **surface** recommendations; they **do not** replace that gate in Phase AMK-NOTIFY-1.

## What confirmation means

| Statement | Meaning |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Notification** | A suggested lane with signal, risk, checks, and receipts — informational. |
| **Confirmation** | AMK decides to proceed **outside** the panel (Cursor, terminal, PR, charter) after reading gates. |
| **Execution** | Happens only through **approved** human-operated or chartered automation — never implied by a UI button in this phase. |

## Relationship to other layers

| Layer | Relationship |
| --------------------- | ------------------------------------------------------------------------------------- |
| Z-Traffic | Supplies **GREEN/YELLOW/RED/BLUE** hints; AMK reads receipts before widening scope. |
| ZAG | Caps what automation may do; panel shows **autonomy_level** per lane suggestion. |
| VH100 / MCBURB / FBAP | **Risk and resilience** language; AMK uses them to judge severity, not to auto-block. |
| Z-SSWS / shadow | **Observe and mirror** notifications; no shadow auto-run. |

## Forbidden from this panel (Phase 1)

- Running shell/Cursor tasks from web UI
- Deploy, bridge, billing, provider calls
- Auto-merge, auto-restore, auto-delete
- Silent writes to canonical JSON or MD

## Local decision stub

Browser **localStorage** records **Confirm / Hold / Needs review** for operator memory only. **Git truth** for `status` remains in `data/amk_operator_notifications.json` until you edit it or a future **gated** exporter exists.

## DRP / DOP

Sensitive paths (children, crisis, health, memory, payments, identity) require **14 DRP / 14 DOP** review in addition to AMK confirmation — the panel does not waive that.

## Related

- [AMK_GOKU_NOTIFICATIONS_PANEL.md](./AMK_GOKU_NOTIFICATIONS_PANEL.md)
