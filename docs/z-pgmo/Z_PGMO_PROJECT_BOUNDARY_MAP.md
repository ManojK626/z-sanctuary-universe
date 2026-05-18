# Z-PGMO — Project boundary map

Read-only map of **identity** and **must-not-cross** rules. PGMO does not claim ownership of any satellite repo.

## Phase status labels

| Label | Meaning | PGMO may suggest |
| --- | --- | --- |
| `doctrine` | Docs, receipts, registries only | Next doc or registry alignment |
| `mock` | UI/simulation without production authority | Wire-check, read-only panel review |
| `runtime` | Local dev servers under operator control | Smoke commands; never auto-start |
| `deploy_hold` | Build ready; deploy blocked by charter | Human gate checklist only |

## Hub vs satellites

| Project | Home | Type | Default phase (May 2026) | Must not |
| --- | --- | --- | --- | --- |
| Z-Sanctuary Universe | `Z_Sanctuary_Universe` | Governance hub | doctrine + selective runtime reports | Substitute for app dev servers |
| Roulette Data Analyzer | `Z-Sanctuary_Replit/Roulette-Data-Analyzer` | Dashboard + API | runtime local; deploy_hold cloud | Live Server on SPA; port 5173 confusion |
| Genesis Studio | `apps/genesis-studio` | Next.js (planned) | mock / early runtime | Confuse with Roulette Vite 5190 |
| LinguaCore | hub `docs/linguacore/` | Language cockpit lane | doctrine → mock | Merge phases without human order |
| Z-Local Gateway E2 | hub registry + panel | Read-only observe | doctrine + read-only tooling | Auto-launch universe |
| Z-ADTF | hub `docs/z-adtf/` | Framework doctrine | deploy_hold (validation) | Merge before Mauritius receipts |
| Z-CPSR | hub `docs/continuity/` (planned) | Continuity doctrine | doctrine (stash/WIP) | Runtime continuity automation |
| Z-Operational Technology Layers | hub docs + thin rules | Builder spine | doctrine | Duplicate full doctrine bibles |

## Port and display boundaries (local)

| Surface | Correct entry | Wrong pattern |
| --- | --- | --- |
| Roulette display | `http://127.0.0.1:5190/` | Live Server 5500 on `index.html` |
| Roulette API (operator) | `http://127.0.0.1:18080/` | Assuming 5173 is Roulette |
| Genesis (when running) | `http://localhost:3010/` | Treating as hub dashboard |
| Hub gateway panel | HTTP from hub root | `file://` fetch to JSON reports |

## Cross-project reference rule

References between projects must be **explicit** in docs or registry entries. PGMO flags **implicit** coupling (shared ports, shared AI persona, undeclared deploy config) as drift risk.

## Identity isolation (Roulette example)

Roulette may integrate with Z-Sanctuary governance but must not inherit unrelated dashboards, APIs, shells, personalities, or deployment configs without a documented charter.

## PGMO boundary enforcement posture

- **Observe** registry and docs truth
- **Report** overlap in improvement receipts
- **Never** rewrite satellite repos or hub `main` from PGMO Phase 0

## Related

- [Z_PGMO_MASTER_DOCTRINE.md](./Z_PGMO_MASTER_DOCTRINE.md)
- [Z_PGMO_IMPROVEMENT_RADAR.md](./Z_PGMO_IMPROVEMENT_RADAR.md)
- [../PHASE_E2_Z_LOCAL_GATEWAY_DIRECTORY.md](../PHASE_E2_Z_LOCAL_GATEWAY_DIRECTORY.md)
