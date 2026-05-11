# Z-CAR² similarity report (Phase 1 — read-only)

Generated: 2026-05-11T20:18:47.977Z

## Summary

| Metric | Value |
| --- | ---: |
| Files scanned | 3260 |
| Bytes scanned | 12699824 |
| Files skipped | 3 |
| Duplicate line groups (capped) | 120 |
| Duplicate window groups (capped) | 100 |
| Risk mix (line groups) | GREEN:0, YELLOW:52, ORANGE:67, RED:0, BLACK:1 |
| Risk mix (window groups) | GREEN:0, YELLOW:2, ORANGE:98, RED:0, BLACK:0 |
| Safe auto-fix candidates | 0 |

## Posture

- **No files were modified.** Advisory scan only.
- **RED / BLACK** clusters stay report-only until explicit human policy.
- Ritual pairing: `npm run zuno:coverage && npm run zuno:phase3-plan && npm run z:car2`.

## Registry / manifest ID drift

- Z_module_registry ZIds: **44**
- z_module_manifest ZIds: **44**
- Only in registry: **0** · Only in manifest: **0**

## Sample duplicate line groups

| Group | Files | Risk | Category | Preview |
| --- | ---: | --- | --- | --- |
| line_1972632326 | 10 | ORANGE | registry | "phase": "Observe",… |
| line_4100795049 | 10 | ORANGE | registry | "confidence": 0.77,… |
| line_448886420 | 10 | ORANGE | registry | "authority": "observational-only",… |
| line_3561897584 | 10 | YELLOW | unknown | border-radius: 14px;… |
| line_3375927765 | 10 | YELLOW | unknown | font-size: 13px;… |
| line_3462076781 | 10 | YELLOW | unknown | justify-content: space-between;… |
| line_2886161801 | 10 | YELLOW | unknown | align-items: center;… |
| line_948110143 | 10 | YELLOW | unknown | padding: 2px 8px;… |
| line_4053077371 | 10 | YELLOW | unknown | background: rgba(255, 255, 255, 0.06);… |
| line_2410436178 | 10 | ORANGE | script | if (!el) return;… |
| line_355683639 | 10 | YELLOW | unknown | const reasons = [];… |
| line_3860078856 | 10 | YELLOW | unknown | <html lang="en">… |
| line_3542070688 | 10 | YELLOW | unknown | <meta charset="utf-8" />… |
| line_262487116 | 10 | YELLOW | unknown | <meta name="viewport" content="width=device-width, initial-scale=1" />… |
| line_1287844092 | 10 | YELLOW | unknown | text-decoration: none;… |
| line_1095149868 | 10 | YELLOW | unknown | <script src="/interface/z_accessibility.js"></script>… |
| line_3329823360 | 10 | YELLOW | unknown | <meta charset="UTF-8" />… |
| line_1892573074 | 10 | YELLOW | unknown | <meta name="viewport" content="width=device-width, initial-scale=1.0" />… |
| line_3376029104 | 10 | YELLOW | unknown | font-size: 16px;… |
| line_2940769429 | 10 | YELLOW | unknown | background: #0f1218;… |
| line_3359413706 | 10 | YELLOW | unknown | max-width: 900px;… |
| line_3374912951 | 10 | YELLOW | unknown | font-size: 22px;… |
| line_4053079545 | 10 | YELLOW | unknown | background: rgba(255, 255, 255, 0.04);… |
| line_3562108854 | 10 | YELLOW | unknown | border-radius: 12px;… |
| line_1081585051 | 10 | YELLOW | unknown | src="./z_bootstrap.js"… |

## Sample duplicate window groups

| Group | Files | Risk | Category | Preview |
| --- | ---: | --- | --- | --- |
| win_4235972410 | 10 | ORANGE | registry | "phase": "Impact", · "micro_cell": "Expanse Cell", · "orientation": "Sto… |
| win_2613839844 | 10 | ORANGE | dashboard | <html lang="en"> · <head> · <meta charset="utf-8" /> · <meta name="viewp… |
| win_2766738602 | 10 | YELLOW | unknown | <meta name="viewport" content="width=device-width, initial-scale=1" /> ·… |
| win_3191415458 | 10 | YELLOW | unknown | data-z-rhythm="true" · data-z-feeling="true" · ></script> · <script src=… |
| win_435552690 | 10 | ORANGE | registry | "format": "5+2", · "draw_schedule": ["Friday"], · "notes": "European jac… |
| win_4107612981 | 10 | ORANGE | registry | "format": "5+2", · "draw_schedule": ["Tuesday", "Friday"], · "notes": "U… |
| win_3857721491 | 10 | ORANGE | registry | "format": "5+2", · "draw_schedule": ["Wednesday", "Sunday"], · "notes": … |
| win_3196443231 | 10 | ORANGE | registry | "format": "6+1", · "draw_schedule": ["Thursday", "Saturday"], · "notes":… |
| win_4039827732 | 10 | ORANGE | registry | "format": "5+2 (extracted from the 7-number draw)", · "draw_schedule": [… |
| win_1784709146 | 10 | ORANGE | registry | "format": "5+1", · "draw_schedule": ["Tuesday", "Friday"], · "notes": "U… |
| win_2035101197 | 10 | ORANGE | registry | "draw_schedule": ["Tuesday", "Friday"], · "notes": "US multi-state draw … |
| win_2036891503 | 10 | ORANGE | registry | "notes": "US multi-state draw with a Mega Ball between 1 and 25.", · "hi… |
| win_3528229160 | 10 | ORANGE | registry | "history": "data/histories/mega-millions.csv", · "history_file": "data\\… |
| win_2743391426 | 10 | ORANGE | registry | "format": "5+1", · "draw_schedule": ["Wednesday", "Saturday"], · "notes"… |
| win_1327615509 | 10 | ORANGE | registry | "draw_schedule": ["Wednesday", "Saturday"], · "notes": "One of the large… |
| win_807766485 | 10 | ORANGE | registry | "notes": "One of the largest jackpots worldwide; features one red Powerb… |
| win_1528092143 | 10 | ORANGE | registry | "history": "data/histories/powerball.csv", · "history_file": "data\\hist… |
| win_2572422181 | 10 | ORANGE | registry | "format": "6+1", · "draw_schedule": ["Wednesday", "Saturday"], · "notes"… |
| win_2052677975 | 10 | ORANGE | registry | "summary": "This commentary describes what was measured: entropy-based s… |
| win_4141325982 | 10 | ORANGE | registry | "what_the_data_shows": [ · "Historical draws were analyzed with frequenc… |

Full JSON: `data/reports/z_car2_similarity_report.json`.
