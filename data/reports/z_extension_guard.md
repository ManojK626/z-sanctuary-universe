# Z Extension Guard

Generated: 2026-05-02T18:16:32.941Z
Status: HOLD
Mode: audit

## Checks
- [x] setting_task_allowAutomaticTasks: expected="on" actual="on"
- [x] setting_extensions_autoCheckUpdates: expected=true actual=true
- [x] setting_extensions_autoUpdate: expected=true actual=true
- [x] setting_update_mode: expected="default" actual="default"
- [ ] setting_extensions_ignoreRecommendations: expected=false actual=true
- [x] required_recommendations_manifested: count=7
- [x] code_cli_available: VS Code CLI not found; installation audit skipped (settings/recommendations still enforced).

## Actions
- none

Note: Extension/tool posture drift detected. Run apply mode or manual correction.
