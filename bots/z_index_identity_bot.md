# Z-Index Identity Bot

## Mission

Ensure **major project dashboard HTML** introduces itself clearly: project name, folder identity, and dashboard role — **without renaming** canonical `index.html` entrypoints toolchains expect.

## Mode (today)

```text
READ-ONLY SCAN MODE
```

The guard **reports only**. It does not modify HTML unless a future lane explicitly enables suggest/fix modes.

Suggest evolution:

1. **READ-ONLY SCAN** (current) — `npm run z:index-identity`
2. **SUGGEST PATCH MODE** — emit diff hints (later)
3. **AUTO-FIX MODE** — only after human governance (later)

## Required identity (main dashboard candidates)

When a file is classified as a **main dashboard candidate**, it should normally include:

| Check | Requirement |
| -------------------- | ----------------------------------------------------------------------------------------- |
| Title | Meaningful `<title>` (not empty / not literally only “index”). |
| Project id | `<meta name="z-project-id" content="folder-or-slug">` |
| Dashboard role | `<meta name="z-dashboard-role" content="main-dashboard">` (or other declared role string) |
| Family (recommended) | `<meta name="z-project-family" content="Z-Sanctuary Universe">` |
| Visible banner | `<header data-z-project="…">` (or outer landmark) containing `<h1>…</h1>` |

Example block (adapt `PROJECT_*` placeholders):

```html
<title>PROJECT_NAME — Main Dashboard</title>
<meta name="z-project-id" content="PROJECT_FOLDER_NAME" />
<meta name="z-dashboard-role" content="main-dashboard" />
<meta name="z-project-family" content="Z-Sanctuary Universe" />
<header data-z-project="PROJECT_FOLDER_NAME">
  <h1>PROJECT_NAME</h1>
  <p>Main Dashboard · Folder: PROJECT_FOLDER_NAME</p>
</header>
```

## Redirect stubs

Thin `dashboard/Html/index.html` redirects (meta refresh → canonical dashboard) may **omit** full banner/meta. They still should use a clear, non-generic `<title>`.

## Ignore / deprioritize

Excluded from scans (noise):

- `node_modules`, `.git`, `dist`, `.next`, `coverage`, `uploads`
- Large archives or vault-like trees: `safe_pack` (vault snapshots inflate noise)

Excluded by path pattern:

- Typical micro widgets (`*-snippet*.html`), deep `fixtures`, `**/test/**/*.html`

## Scripts

```bash
npm run z:index-identity
```

Outputs:

- `data/reports/z_index_identity_report.json`
- `data/reports/z_index_identity_report.md`

## Rule summary

Every **main dashboard** should **introduce itself** before immersive UI — navigable for operators, safer to audit, and easier for tooling (including Cursor).
