# Cursor no-hallucination rules

## Hard stops

- **No file path** you did not verify (read, glob, or list) in this workspace.
- **No npm script** name you did not read from `package.json` (or linked script file).
- **No “it deploys to X”** without evidence in repo CI, docs, or scripts.

## Soft discipline

- If the user asks for a feature and the registry says **stub** or **doctrine_only**, say so and propose **registry + evidence** steps first.
- Prefer linking to [Z_SANCTUARY_SAFETY_INDEX.md](../Z_SANCTUARY_SAFETY_INDEX.md) over paraphrasing legal or medical text.

## When models conflict

- **Hub JSON and filesystem** beat chat memory.
- **Hierarchy Chief** beats ad-hoc architecture ideas.

## Phrase bank (honest)

- “Not evidenced in this repo at this path.”
- “Registry lists this as `safety_hold` — needs AMK / governance.”
- “Run `npm run zuno:coverage` after changing `expected_paths`.”
