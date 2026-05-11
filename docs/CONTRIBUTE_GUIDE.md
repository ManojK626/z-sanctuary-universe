<!-- Z: docs\CONTRIBUTE_GUIDE.md -->

# Z-Sanctuary Contributor Guide

This short guide keeps every newcomer in the same calm flow you designed.

## 1. Open the cockpit

- File → Open Workspace → `ZSanctuary.code-workspace`
- Code sees:
  - Hosted extensions (`.vscode/extensions.json`)
  - Settings + profiles (`.vscode/settings.json`, `.vscode/profiles.json`)
  - Tasks (`.vscode/tasks.json`)

Everything starts from one workspace file — no guesswork.

## 2. Prepare your station

- Run the doctor script `Ctrl+Shift+P` → `Run Task` → `🟢 Z-Sanctuary: Install`.
- Follow the output from `scripts/doctor.js`: it checks Node, data/raw, and module manifest.
- If the doctor flags a piece, resolve it (Node on PATH, run `npm install`, or ensure `data/raw` contains spreadsheets).

## 3. Boot & observe

- Use the `🟢 Z-Sanctuary: Boot Everything` task. It executes:
  1. `npm install`
  2. `npm run lint`
  3. `npm run build`
  4. `node scripts/import_history.js --auto=data/raw`
- After the task completes:
  - Safe Pack panel shows actions taken.
  - Insight cards summarize module statuses + upcoming tasks.
  - Super Ghost writes to the Chronicle and updates `zInsightReflection`.

## 4. Running modules

- Use `🟢 Launch: Roulette` or `🟢 Launch: Lottery` from the task runner.
- The Module Registry UI (Panel Directory) lists each module with READY/PARTIAL/BLOCKED status badges.
- Click `Launch` to run the VS Code task or `Open` to reveal the panel. Roulette opens externally by design (openMode: `external`).

## 5. Safe Pack workflow

- The Safe Pack panel (in the dashboard edge) shows:
  - Suggestions loaded from `data/safe_pack_candidates.json`.
  - A log of auto-applied packs (`data/safe_packs.json`).
  - Rollback buttons for each entry.
- Insight cards display Safe Pack health, module registry summary, and upcoming tasks.
- Safe packs auto-log to the Chronicle (`z.safe_pack.applied` / `rollback`).

## 6. Reporting & thinking

- The weekly reflection text in Insight Lab updates once per minute, reporting safe pack activity.
- Module readiness and health badges refresh every 90 seconds.
- Super Ghost continues to watch micro-signals and publishes Insight cards automatically.

## 7. When in doubt

1. Run the doctor task.
2. Check the Safe Pack panel (rollback if something feels off).
3. Verify Chronicle events (new entries appear in Insight cards and the Chronicle pane).
4. Use the edge buttons to open the correct panel and pulse it via the Safe Pack UI.

This guide captures the calm architecture you built. Keep it under the docs folder so anyone entering the Sanctuary can follow the exact same flow. If you want a README or script version later, just let me know.
