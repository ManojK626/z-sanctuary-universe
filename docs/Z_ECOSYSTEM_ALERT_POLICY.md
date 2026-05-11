# Z — Ecosystem alert policy (human-readable)

**Machine source of truth:** [`data/z_ecosystem_alert_policy.json`](../data/z_ecosystem_alert_policy.json).

## Summary

- **GREEN / GOLD:** dashboard evidence only; **no** AMK interrupt from this policy.
- **YELLOW:** advisory; **quiet** on notifications unless you explicitly escalate or add a future repeat-threshold.
- **BLUE:** **AMK decision** — eligible for notification candidates in `z_ecosystem_awareness_report.json`.
- **RED:** **blocker** — eligible for urgent notification candidates.
- **PURPLE:** future-gated; no alert.
- **UNKNOWN:** dashboard only unless the project is **required** for daily status.

## Forbidden auto-actions (listed in JSON)

Deploy, billing/pricing mutation, secrets/API keys, provider calls, public launch, bridge execution, child data collection, feedback without consent, voice/camera/GPS capture, auto-merge — **none** may be triggered by the awareness validator or dashboard read-only surfaces.

## Related

- [Z_ECOSYSTEM_AWARENESS_SPINE.md](./Z_ECOSYSTEM_AWARENESS_SPINE.md)
- [AMK_GOKU_NOTIFICATIONS_PANEL.md](./AMK_GOKU_NOTIFICATIONS_PANEL.md)
