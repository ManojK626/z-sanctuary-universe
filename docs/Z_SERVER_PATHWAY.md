# Z-Sanctuary: Single Server Pathway (Cursor + Free Local Server)

One pathway only: **Cursor opens the workspace → free local server runs → dashboard and HTML open.** No NAS, no external services.

---

## The pathway

**Easiest (one task):**

1. **Terminal → Run Task…** (or `Ctrl+Shift+P` → “Tasks: Run Task”).
2. Choose **Z: Start Server & Open Dashboard**.
3. The server starts and the main dashboard opens in your browser at `http://127.0.0.1:5502/dashboard/Html/index-skk-rkpk.html`.

**Or step by step:**

- **Run Task → Z: HTML Static Server (5502)** — starts the server (leave this running).
- **Run Task → Z: Open Main Dashboard (Z-Sanctuary)** — opens the main dashboard.
- **Run Task → Z: Open current HTML in browser** — opens the active HTML file (focus an HTML file first).

**Automatic (when you open the folder):**

- Ensure **Allow Automatic Tasks** is **on** (VS Code/Cursor: **File → Preferences → Settings** → search `task.allowAutomaticTasks` → set to **on**). Then **Z: SSWS Auto Boot** can start the server and open the dashboard when you open the workspace (depends on guards passing). The dashboard will not show “Z Auto-Run is blocked” when automatic tasks are allowed and the autorun audit report is present.

---

## Port and config

- **Port:** **5502** (set in `config/z_html_links_hub.json` → `baseUrl`, `serverPort`).
- **Server:** Node script `scripts/z_local_static_server.mjs` — serves files from the workspace root, no install beyond Node.
- **Security:** Listens on `127.0.0.1` only; not exposed to the network.

---

## If the site doesn’t load (“connection refused”)

1. Start the server: **Run Task → Z: HTML Static Server (5502)**.
2. Wait until the terminal shows something like: `Z static server ready at http://127.0.0.1:5502`.
3. Then run **Z: Open Main Dashboard (Z-Sanctuary)** or open `http://127.0.0.1:5502/dashboard/Html/index-skk-rkpk.html` in the browser.

Ensure **Allow Automatic Tasks** is on (VS Code/Cursor: **File → Preferences → Settings** → search `task.allowAutomaticTasks` → set to **on**) if you want the server to start when the folder opens.

---

## Summary

| What | How |
| ------------------- | ------------------------------------------------------------------------------------------------------------ |
| **One-click start** | Run task **Z: Start Server & Open Dashboard** — server + dashboard in one go. |
| Server | Free, local, secure (Z static server on 127.0.0.1:5502). |
| Open dashboard | **Z: Open Main Dashboard (Z-Sanctuary)** or open `http://127.0.0.1:5502/dashboard/Html/index-skk-rkpk.html`. |
| Open any HTML | Focus the file → task **Z: Open current HTML in browser**. |
| No NAS | Not used; local server only. |
