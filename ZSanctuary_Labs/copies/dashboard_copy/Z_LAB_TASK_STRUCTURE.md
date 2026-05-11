# Z LAB Task Structure

Use three strict lanes so nothing gets mixed:

1. `CORRESPONDENCE`
2. `INACCORDANCE`
3. `CHAT_ONLY`

## Rules

- Put every actionable item in either `CORRESPONDENCE` or `INACCORDANCE`.
- Keep `CHAT_ONLY` for discussion/log notes only, never execution tasks.
- Do not duplicate the same item across lanes.
- If a chat message creates an action, move that action into one task lane and keep the chat as reference only.

## Task Template

```text
[LANE] [DOMAIN] [PRIORITY] Short title
Owner:
Source:
Definition of done:
Status: TODO | DOING | BLOCKED | DONE
```

## Example

```text
[CORRESPONDENCE] [CORE] [P1] Align panel sizing across split windows
Owner: Codex
Source: UI compare screenshot (Window A vs Window B)
Definition of done: Same zoom, sidebars, and panel width behavior in both windows.
Status: DOING
```

```text
[INACCORDANCE] [CORE] [P1] Chat/task stream mixed in one lane
Owner: Codex
Source: Current workspace behavior
Definition of done: Chat notes separated from execution tasks with no cross-mixing.
Status: TODO
```

## Operational Reminders

- Keep all four VS Code windows surfaced via `launch_4_windows.ps1`; if a restart drops one, run the script immediately so the CORE/LAB split and slot alignment stays deterministic.
- Keep chats trapped inside the `CHAT_ONLY` lane until NAS readiness is confirmed; do not let chat or exploratory notes cross into CORRESPONDENCE or INACCORDANCE lanes until the command center agrees, ensuring we maintain the planned isolation.
