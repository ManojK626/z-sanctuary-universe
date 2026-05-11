# Z-MAOS — Friction Removal Protocol

**Purpose:** Reduce operator cognitive load with **one smallest safe step** per interaction.

---

## 1. Rules

- Prefer **print command** over **run command** when verify cost is high or intent unclear.
- Always show **cwd** and **active registry id** in MAOS status output.
- If multiple failures: surface **first** root cause, not a wall of stack traces in default output.

---

## 2. “Next safe action” heuristic (hub)

When in hub with clean unknowns:

1. `npm run z:maos-status`
2. `node scripts/z_sanctuary_structure_verify.mjs`
3. If doc work: `npm run lint:md` scoped to touched paths

Adjust per operator playbook—MAOS does not mandate long pipelines daily.

---

## 3. Stop conditions

If consent or phase guardian says HOLD—friction protocol **stops** suggesting deeper automation ([FAILURE_ESCALATION_RULES.md](FAILURE_ESCALATION_RULES.md)).
