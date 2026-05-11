<!-- Z: Amk_Goku Worldwide Loterry\docs\Z_EDITOR_COVENANT.md -->

# Z-Editor Covenant (v1.0)

Purpose:
To prevent tool conflicts, formatter wars, and silent corruption by clearly
defining which tool has authority over which file types in Z-Sanctuary.

---

## Authority Map

### VS Code (Editor Authority)

Owns:

- `.vscode/settings.json`
- `.vscode/extensions.json`
- `.vscode/tasks.json`
- `.vscode/launch.json`

Rules:

- Managed manually or via VS Code UI
- Excluded from Prettier and ESLint
- No JavaScript syntax allowed
- JSON only

---

### Prettier (Formatting Authority)

Owns:

- `.js`, `.ts`, `.json` (non-.vscode)
- `.md`
- `.html`
- `.css`

Rules:

- Style only (no logic changes)
- Obeys `.prettierrc`
- Skips ignored paths explicitly

---

### ESLint (Code Safety Authority)

Owns:

- `.js`, `.ts`

Rules:

- Enforces correctness and consistency
- May auto-fix safe issues only
- Never formats `.json` or `.md`

---

### Python Tooling (pytest, black if added)

Owns:

- `.py`

Rules:

- Python-only domain
- No cross-language assumptions

---

## Non-Negotiables

- No formatter touches files it does not own
- File extension defines authority
- Editor config != application code
- Stability > cleverness

---

Status: ACTIVE
Locked by: Z-Sanctuary Core
Version: 1.0
