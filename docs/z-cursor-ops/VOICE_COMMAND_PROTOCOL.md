# Voice command protocol (Z-Sanctuary + Cursor voice mode)

**Purpose:** Separate **voice submit triggers** (tiny keywords) from **full operator doctrine** (this doc and Cursor rules). Speed without losing control.

## Cursor keyword box (voice submit triggers)

The Cursor voice setting that accepts **custom submit words** is **not** project memory and **not** for long instructions.

Use it **only** for **single-word** (or minimal) phrases that mean: _submit what I just said to the chat now._

Do **not** put Z-Sanctuary, XL2, or multi-project context in that field — it will not behave like persistent memory.

### Recommended keywords

Use **rare** words you are unlikely to say by accident in normal speech.

| Keyword | Meaning |
| ------- | -------------------------------------------- |
| `zgo` | Submit my spoken instruction now |
| `zsend` | Send this to Cursor |
| `zuno` | Wake or submit under Zuno-style operator cue |

**Start with one keyword only:**

```text
zgo
```

Why avoid common words like `submit`, `send`, or `go`: Cursor may **auto-submit too early** while you are still speaking.

Add `zsend` or `zuno` later only if you need distinct habits.

## Where full instructions belong

Deep ecosystem context lives in:

- **This file** (`docs/z-cursor-ops/VOICE_COMMAND_PROTOCOL.md`) for voice-mode behavior summary.
- **Cursor rules** (e.g. `.cursor/rules/`) and hub docs (`AGENTS.md`, charter docs) for ongoing alignment.

**XL2 (separate repo):** Product cockpit keeps its own copy under **`docs/cursor-ops/VOICE_COMMAND_PROTOCOL.md`** in the XL2 tree only — not required to duplicate XL2 doctrine inside Z-Sanctuary.

## Instruction block (for rules or Composer voice context)

Paste or adapt the following into a **Cursor rule** or **project prompt** so voice-submitted messages are interpreted with hub discipline — not into the keyword box:

```text
When Amk-Goku speaks through voice mode, interpret the request through the current repository doctrine, phase gates, and operator workflow.

Always identify the active project first:
- XL2 uses XL2 Control Deck, Z-HOAI, AWOS, Cursor Ops, pilot doctrine, Track A / Phase 3N rules.
- Z-Sanctuary uses Z-MAOS, Z-Cursor Ops, safety constitution, consent gates, and cross-project reference-only rules.
- Do not mix XL2 and Z-Sanctuary unless a separate approved charter explicitly allows coupling.

Before acting, classify the request as:
- documentation
- code patch
- pilot issue
- safety/legal/payment copy
- deployment
- creative/visual plan
- cross-project coordination

Respect consent gates:
- no auto-merge
- no auto-deploy
- no payment activation
- no legal/pricing/responsible-use edits without AMK approval
- no external connection
- no user data deletion
- no Z-Sanctuary ↔ XL2 coupling without charter

Prefer the smallest safe action.
Use the relevant MASTER_REQUIREMENTS_QUEUE.
If a task is blocked, say why and point to the required gate.
```

## Operator flow

```text
You speak naturally
→ say “zgo” (or your chosen keyword)
→ Cursor submits the utterance
→ Cursor applies project rules and prompts
→ Work routes through the correct workflow and gates
```

## Related

- [.cursor/rules/z_voice_command_protocol.mdc](../../.cursor/rules/z_voice_command_protocol.mdc) — always-on Cursor hook (points here + sacred-move summary).
- [README.md](README.md) — Z-Cursor Ops railway and sacred moves.
- [Z_MASTER_REQUIREMENTS_QUEUE.md](Z_MASTER_REQUIREMENTS_QUEUE.md) — queue entry when tasks are formalized.
- [docs/z-maos/Z_MAOS_CHARTER.md](../z-maos/Z_MAOS_CHARTER.md) — multi-project supervision.

## Rollback

Remove or archive this file if voice protocol changes; adjust Cursor voice keywords in settings independently.
