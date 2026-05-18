# Phase E2 — Z-LOCAL-GATEWAY DIRECTORY

Formal lane: **Z-LOCAL-GATEWAY-DIRECTORY** (read-only first).

## Verdict (hub check)

**SAFE** — registry parses; Roulette + Genesis + hub roots exist; gateway script exits 0. Ports not listening are informational only (operator starts services manually).

```bash
npm run z:local:gateway:check
```

## Purpose

Give minibots and operators a **controlled map** of local projects — folders, commands, ports, URLs, HTML entrypoints — so nothing guesses paths or crosses wires between apps.

```text
project → folder path → app type → command → port → URL → safe status
```

## Golden law

```text
Gateway observes and guides.
It does not auto-launch the universe.
```

| Layer                                         | Role                                                      |
| --------------------------------------------- | --------------------------------------------------------- |
| `data/z_local_gateway_registry.json`          | Truth map (projects, ports, commands, forbidden patterns) |
| `scripts/z-local-gateway-directory-check.ps1` | Read-only checks + printed open commands                  |
| Minibot labels                                | Path, Port, HTML, API, Env, Door, Boundary, Smoke         |
| Reports                                       | Status only — stdout / optional future JSON report        |
| Human (AMK)                                   | Decides what to start and open                            |

## Minibot roles

| Bot              | Responsibility                                                                 |
| ---------------- | ------------------------------------------------------------------------------ |
| **Path Bot**     | Verifies `root` exists on disk; warns if missing                               |
| **Port Bot**     | Reports whether expected TCP ports appear in use (informational)               |
| **HTML Bot**     | Warns when Live Server or wrong host patterns are used                         |
| **API Bot**      | Optional HTTP GET to `/api/healthz` when `-Probe` is set                       |
| **Env Bot**      | Prints required env (e.g. `VITE_API_URL`, `PORT`)                              |
| **Door Bot**     | Prints correct URLs and start commands for the operator                        |
| **Boundary Bot** | Prevents cross-project confusion (Roulette vs Genesis vs XL2/5173)             |
| **Smoke Bot**    | Suggests project-local smoke commands (does not run them unless operator does) |

## Registry

Machine roster: [`data/z_local_gateway_registry.json`](../data/z_local_gateway_registry.json)

First **active** entry: **Roulette Data Analyzer**

- Root: `C:/Cursor Projects Organiser/Z-Sanctuary_Replit/Roulette-Data-Analyzer`
- Dashboard: `corepack pnpm run dev:dashboard` → Vite **5190** default (`http://127.0.0.1:5190/`)
- API: `corepack pnpm run dev:api` — repo default port **8080**; operator lane **18080** when `PORT=18080`
- Health: `GET /api/healthz` (public route)
- **Do not use:** VS Code Live Server on `index.html`; do not assume port **5173** is Roulette

## Operator check (read-only)

From hub root:

```powershell
.\scripts\z-local-gateway-directory-check.ps1
.\scripts\z-local-gateway-directory-check.ps1 -Id roulette_data_analyzer
.\scripts\z-local-gateway-directory-check.ps1 -Id roulette_data_analyzer -Probe
```

Or:

```bash
npm run z:local:gateway:check
```

Flags:

- **Default:** path + port + door commands (no HTTP, no start, no kill)
- **`-Probe`:** optional health URL GET (may fail if services not running — informational)

**Not supported in E2:** `-Start`, process kill, Cloudflare mutation, deploy, secrets write.

## Forbidden (phase scope)

- Auto-start all services
- Background daemons
- Deployment / Cloudflare mutation
- Secrets write
- Billing changes
- Database migration
- Replit restoration
- Arbitrary PC folder scan beyond registry `root` paths

## Not deployed / local-only receipt

| Item            | Posture                                                    |
| --------------- | ---------------------------------------------------------- |
| Deployment      | **Not in scope** — local directory only                    |
| Cloudflare      | **No mutation** from this lane                             |
| Production URLs | **Not authoritative** here                                 |
| Registry        | **Operator machine paths** — update when PC layout changes |

## Verification

```bash
node -e "JSON.parse(require('fs').readFileSync('data/z_local_gateway_registry.json','utf8')); console.log('registry OK')"
npm run verify:md
npm run z:local:gateway:check
```

Roulette repo build (operator, separate):

```bash
cd "C:/Cursor Projects Organiser/Z-Sanctuary_Replit/Roulette-Data-Analyzer"
corepack pnpm run build
```

## Verdict codes

| Code                     | Meaning                                                                       |
| ------------------------ | ----------------------------------------------------------------------------- |
| **SAFE**                 | Registry valid; paths exist; no blocker for using gateway                     |
| **NEEDS HUMAN DECISION** | Path missing, ports down, or health probe failed — operator chooses next step |
| **BLOCKED**              | Registry parse failure or policy violation                                    |

## Next lanes (not E2)

- Controlled `-Start` flag per project (separate charter)
- JSON report under `data/reports/`
- Additional registry entries from `z_pc_root_projects.json` sync (human-reviewed)

## Related

- [Z_SANCTUARY_CANONICAL_CONTROL_ROOT.md](Z_SANCTUARY_CANONICAL_CONTROL_ROOT.md)
- [AMK_PROJECT_DOORWAY_LAUNCHER.md](AMK_PROJECT_DOORWAY_LAUNCHER.md)
- Roulette: `Z-Sanctuary_Replit/Roulette-Data-Analyzer/docs/PORT_AND_LAUNCH_RULES.md`
