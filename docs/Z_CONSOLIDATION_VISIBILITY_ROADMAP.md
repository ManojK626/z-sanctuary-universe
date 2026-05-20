# Z-Consolidation + visibility roadmap (pre-Mauritius)

**Lane:** Z-CONSOLIDATE-0  
**Posture:** **stability > expansion** — merge, visibility, resilience discipline; **no** new runtime power.

---

## Do not (now)

- Giant runtime engines, autonomous swarms, self-modifying deploy
- Uncontrolled AI mesh execution or “infinite AGI” chasing
- Public formula / ROI / certainty marketing
- Merge to `main` without green CI and AMK review

---

## Focus lanes (ordered)

### 1. Merge governance safely

| Step | Action |
| ---- | --------------------------------------------------------------------------------------- |
| A | CI green: ESLint (done on branch), workspace `lint`, `hygiene:autofix` ignore alignment |
| B | `sanctuary-github-pr` pass on governance PR |
| C | AMK review → merge `cursor/zsanctuary/*` docs PRs to `main` |
| D | Rebase follow-on branches (ESLint-only, PGMO, etc.) per stack order |

Turtle Mode: one domain per PR; human merge on `main`.

---

### 2. Read-only dashboard lenses (Phase 1–2 — not executors)

| Lens | Data source | Phase |
| ---------------------- | ------------------------------------------------ | ----- |
| Z-ATE trust chip | `z_autonomy_trust_policy.json` + future report | 2 |
| Z-ECO-MAP graph | `z_eco_map_topology_registry.json` | 2 |
| Z-WORK-PULSE panel | `z_background_work_status.json` (when chartered) | 2 |
| Topology relationships | registry `relationships[]` | 2 |
| Trust badges | AMK indicators overlay | 2 |
| Deployment posture | `npm run z:deployment:readiness` report | 1 |

**Law:** GET JSON / fetch reports only — **no** execute, deploy, or queue run from UI.

---

### 3. Cloudflare readiness discipline (not mass deploy)

- Repeatable builds, stable ports, clean routing
- Secrets in dashboard only — never hub repo
- [Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md](./Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md)
- [Z_DEPLOYMENT_READINESS_OVERSEER.md](./Z_DEPLOYMENT_READINESS_OVERSEER.md) — `npm run z:deployment:readiness`
- Production bind remains **HOLD** until AMK charter

---

### 4. Backup sovereignty

- Enforce [Z_SAFE_BACKUP_AND_SOURCE_ARCHIVE_POLICY.md](./Z_SAFE_BACKUP_AND_SOURCE_ARCHIVE_POLICY.md)
- Code → GitHub; private → NAS; edge → Cloudflare charter only
- Restore drills documented before trusting NAS rows

---

### 5. Qualified operator structure

- [Z_QUALIFIED_OPERATOR_ACCESS_LADDER.md](./Z_QUALIFIED_OPERATOR_ACCESS_LADDER.md)
- Train contributors: public outcomes only; full stack for core guardians + AMK

---

## CI hygiene note (infrastructure)

`scripts/z_hygiene_autofix.mjs` markdownlint `--fix` steps must use the **same** `--ignore` list as `npm run lint:md` (`**/node_modules/**`, etc.) so PR verify does not lint dependency READMEs.

---

## Verdict

| Phase | Verdict |
| -------------------------- | --------------------------- |
| This roadmap (docs) | **SAFE** |
| Dashboard lenses / runtime | **NEEDS HUMAN DECISION** |
| Production deploy | **BLOCKED** without charter |

---

## Related

- [Z_GOVERNANCE_CIVILIZATION_STACK.md](./Z_GOVERNANCE_CIVILIZATION_STACK.md)
- [Z_CYCLE_OBSERVE_SYSTEM.md](./Z_CYCLE_OBSERVE_SYSTEM.md)
- [AGENTS.md](../AGENTS.md)
