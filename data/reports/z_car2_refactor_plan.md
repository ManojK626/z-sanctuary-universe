# Z-CAR² refactor plan (Phase 2 — plan only)

Generated: 2026-04-30T22:07:12.486Z
Source scan: 2026-04-30T21:09:13.053Z

## Posture

- **No source files modified.** No patches. No apply mode.
- **Safety docs:** never auto-refactored; RED/safety clusters stay human-only.
- **Audit outputs** (`data/reports/`) are not canonical truth — repeated lines there are usually IGNORE.

## Action histogram

| Action | Count |
| ------------------------- | ----: |
| KEEP_AS_EVIDENCE | 182 |
| IGNORE_TRIVIAL | 33 |
| MAKE_SHARED_DOC_REFERENCE | 0 |
| MAKE_SCRIPT_HELPER | 0 |
| MAKE_DASHBOARD_COMPONENT | 0 |
| MAKE_ALIAS_MAP | 2 |
| HUMAN_REVIEW_ONLY | 3 |

## Sample rows (first 25)

| Group | Action | Risk | Files | Next step |
| --------------- | ----------------- | ------ | ----: | ----------------------------------------------------------------------------------------------------- |
| line_1972632326 | KEEP_AS_EVIDENCE | ORANGE | 10 | Do not dedupe across snapshots; hub source of truth stays separate.… |
| line_4100795049 | KEEP_AS_EVIDENCE | ORANGE | 10 | Do not dedupe across snapshots; hub source of truth stays separate.… |
| line_448886420 | HUMAN_REVIEW_ONLY | ORANGE | 10 | Triage in a PR with evidence links to this plan row.… |
| line_3561897584 | IGNORE_TRIVIAL | YELLOW | 10 | Prefer design tokens or shared stylesheet variables later if needed — not driven from duplicate-line… |
| line_3375927765 | IGNORE_TRIVIAL | YELLOW | 10 | Prefer design tokens or shared stylesheet variables later if needed — not driven from duplicate-line… |
| line_3462076781 | IGNORE_TRIVIAL | YELLOW | 10 | Prefer design tokens or shared stylesheet variables later if needed — not driven from duplicate-line… |
| line_2886161801 | IGNORE_TRIVIAL | YELLOW | 10 | Prefer design tokens or shared stylesheet variables later if needed — not driven from duplicate-line… |
| line_948110143 | IGNORE_TRIVIAL | YELLOW | 10 | Prefer design tokens or shared stylesheet variables later if needed — not driven from duplicate-line… |
| line_2410436178 | MAKE_ALIAS_MAP | ORANGE | 10 | Human drafts alias rows; wire into master registry / docs index when ready — no auto-edit.… |
| line_3860078856 | IGNORE_TRIVIAL | YELLOW | 10 | None unless product owner re-prioritizes.… |
| line_3542070688 | IGNORE_TRIVIAL | YELLOW | 10 | None unless product owner re-prioritizes.… |
| line_262487116 | IGNORE_TRIVIAL | YELLOW | 10 | None unless product owner re-prioritizes.… |
| line_1287844092 | IGNORE_TRIVIAL | YELLOW | 10 | None unless product owner re-prioritizes.… |
| line_1095149868 | IGNORE_TRIVIAL | YELLOW | 10 | None unless product owner re-prioritizes.… |
| line_3329823360 | IGNORE_TRIVIAL | YELLOW | 10 | None unless product owner re-prioritizes.… |
| line_1892573074 | IGNORE_TRIVIAL | YELLOW | 10 | None unless product owner re-prioritizes.… |
| line_3376029104 | IGNORE_TRIVIAL | YELLOW | 10 | Prefer design tokens or shared stylesheet variables later if needed — not driven from duplicate-line… |
| line_967628115 | KEEP_AS_EVIDENCE | YELLOW | 10 | Do not dedupe across snapshots; hub source of truth stays separate.… |
| line_2940769429 | IGNORE_TRIVIAL | YELLOW | 10 | Prefer design tokens or shared stylesheet variables later if needed — not driven from duplicate-line… |
| line_3359413706 | IGNORE_TRIVIAL | YELLOW | 10 | Prefer design tokens or shared stylesheet variables later if needed — not driven from duplicate-line… |
| line_3374912951 | IGNORE_TRIVIAL | YELLOW | 10 | Prefer design tokens or shared stylesheet variables later if needed — not driven from duplicate-line… |
| line_4053079545 | IGNORE_TRIVIAL | YELLOW | 10 | Prefer design tokens or shared stylesheet variables later if needed — not driven from duplicate-line… |
| line_3562108854 | IGNORE_TRIVIAL | YELLOW | 10 | Prefer design tokens or shared stylesheet variables later if needed — not driven from duplicate-line… |
| line_1081585051 | IGNORE_TRIVIAL | YELLOW | 10 | None unless product owner re-prioritizes.… |
| line_1745511803 | IGNORE_TRIVIAL | YELLOW | 10 | None unless product owner re-prioritizes.… |

Full JSON: `data/reports/z_car2_refactor_plan.json`.
