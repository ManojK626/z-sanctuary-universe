<!-- Z: docs\Z_NOTEBOOKS_CONTRACT.md -->

# Z-Notebooks Contract

Z-Notebooks are the living insight journals inside Z-Sanctuary. They are human reflections anchored to the systems, not predictions, orders, or bets.

Each note must include:

- **Author type**: `individual`, `team`, `family`, or `association`.
- **Linked formulas** (e.g., `Z`, `GGAESP_360`, `KAIROCELL` phase) or pipeline runs. At least one required.
- **Run or context ID** that ties the note to a specific observation or event window.
- **Perspective** describing intent (observation, learning, bias-check, question).
- **Execution authority**: always `none`. Notes can never trigger actions.
- **Dataset state** tag (e.g., `manual`, `missing`, `verified`). If no data is present, mark it explicitly.

## Usage rules

1. Notes are **context-locked**: they explain what was seen, why it matters, and how it relates to a formula or dataset. No floating assertions.
2. Notes are observational and educational. They can highlight patterns, cite bias, request clarification, or document "why we paused."
3. AI systems (Zuno, mini-AI, Co-Autopilot, Super Ghost, RKPK) may summarize, cluster, or surface notes—but never act on them.
4. Violations of these rules (e.g., using notes to drive bets) trigger the KAIROCELL learning / JAILCELL process for correction, not punishment.
5. Notes are traceable: every entry logs a Chronicle event `z_notebooks.note` and is visible through Insight cards, the World Pulse chip, and SYSTEM_STATUS reports.

This contract makes every note auditable, trustworthy, and aligned with the Trust Bond. If an entry cannot satisfy these rules, it must not be recorded. Instead, document the thought offline until it fits.
