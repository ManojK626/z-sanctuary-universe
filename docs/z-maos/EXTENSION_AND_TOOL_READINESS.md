# Z-MAOS — Extension and Tool Readiness

**Purpose:** How MAOS treats VS Code / Cursor extensions and CLI tools.

---

## 1. Recommendations only

- `.vscode/extensions.json` may list **recommended** extensions.
- **No auto-install** from MAOS scripts or npm hooks unless AMK explicitly approves a documented exception.

---

## 2. What MAOS may report

Examples (not exhaustive):

- Missing Markdown tooling (`markdownlint` workflow).
- Missing Prettier / ESLint where repo scripts expect them.
- Python / Node engine version hints from `engines` in `package.json`.

---

## 3. Launch requirements manifest

`tools/z-maos/launch_requirements.json` lists per-project:

- `requiredExtensions` (extension IDs)
- `openingChecks` (command strings)
- `safeReports` (paths under `data/reports/` or docs)
- `forbiddenWithoutConsent` (categories)

Scripts **compare** presence of recommendation files; they do **not** mutate user profile.

---

## 4. Operator install commands

If documented, prefix with **Manual (operator):** in runbooks—never imply unattended install.
