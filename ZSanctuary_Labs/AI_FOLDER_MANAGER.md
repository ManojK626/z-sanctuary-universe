# AI Folder + Files Manager

## Goal

Keep every AI-related folder, file, and guard artifact aligned across CORE, LAB, and NAS spaces so nothing drifts, glows, or freezes when we re-open VS Code or re-run automation.

## Recommended Folder Structure

- ZSanctuary_Universe/ � CORE runtime + governance apps (keep this inventory read-only inside LAB windows).
- Z_LAB_Dashboard_Copy/ + Z_LAB_SSWS_Copy/ � LAB surfaces and snapshots. Treat these as observational copies; never cross-write from CORE.
- data/reports/ � store maturity benchmarks, readiness outputs, and auto-sweep evidence; keep the latest filenames pinned in Z_LAB_TASK_STRUCTURE.md.
- AI/ (create inside ZSanctuary root) � a single directory for the AI briefings, modules, and config you�re building; keep README.md referencing the lane assignment plus autop-run checklists.

## Folder + File Manager Checklist

1. **Lock windows** � run launch_4_windows.ps1 via the new VS Code task ( Start 4-window maintenance) whenever a VS Code restart drops a pane. That script tiles CORE_A, CORE_B, LAB_A, and LAB_B so navigation stays organized.
2. **Guard autop-run tasks** � use the .vscode/tasks.json tasks to keep cycle:routine, workspace:auto-sweep, and incident:notify running inside dedicated terminals; these tasks inherit the correct CWD (ZSanctuary_Universe) so they never execute in the copy dock. Start each once and let them run in the background for constant telemetry.
3. **AI file registry** � update this file when you add new AI modules / docs; add a row per folder and note which lane (correspondence, inaccordance, chat) owns it.
4. **Auto terminal triggers** � the tasks already expose a dedicated terminal per workflow; do not run other user scripts inside those terminals. If you need a one-off command, open a new terminal via the palette so the dedicated autop-run terminals can stay unmuted.
5. **SLO and readiness** � keep your forced fail verification in the ZSanctuary_Universe workspace (use
pm run slo:guard + workspace:auto-sweep). Record the artifact names in AI_FOLDER_MANAGER.md so you can cross-check in the future.

## Memory

- Chats stay inside the CHAT_ONLY lane until NAS readiness is achieved (documented in Z_LAB_TASK_STRUCTURE.md).
- Four VS Code windows must always start together; if one fails to launch, rerun the Start 4-window maintenance task and note the slot in this file.

## Monitoring Badges & Alerts

- Surface the Z Top Industries Watch badge states whenever workspace:auto-sweep runs; copy the latest status span values into this file after every cycle so the panel stays lawful and transparent.
- Use the dedicated autop-run terminals to watch incident_notifications.log and the SLO guard output; any badge change should get a timestamped line here before you triage.
- When a badge turns warning/red, capture the related incident file name and webhook payload (if available) in this doc so the AI folder map keeps its provenance.

## Z-Formula GUI + Link Checks

- Execute
pm run html:open-cores from C:\ZSanctuary_Universe to open every GUI link that backs the formulas, dashboards, and panels; treat the browser as a proof of the link map.
- After opening, ensure the Z Formula Registry panel lists the current formulas and that each Open Registry link resolves; refresh the panel, then verify core_index.snapshot.html still contains the zFormulaRegistryPanel markup and the Z Formula data-title.
- Document every formula referenced in the panel inside docs/Z_FORMULA_INTEGRATED.md; include a short description of the formula, the DOM selector (e.g., #zFormulaRegistryList), and whether it points to TOP_INDUSTRY_RESEARCH.md or other guard docs.
- Capture the GUI checks (screenshots or terminal log) in a new entry inside this file so we can prove the Z-Formula integration hasn�t drifted.

## References

- Z_LAB_TASK_STRUCTURE.md (lanes + reminders)
- launch_4_windows.ps1 (window tiling)
- .vscode/tasks.json (autop-run terminals)
- TOP_INDUSTRY_RESEARCH.md (AI/Science/Medical guard rails)
