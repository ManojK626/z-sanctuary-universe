# Explainability contract (Z-SME)

Every recommendation surfaced to the user **must** include this shape (playlist-level or per-track where specified):

```ts
{
  what_changed: string
  signals_considered: string[]
  reason: string
  confidence: number  // 0..1
  next_action?: string
}
```

## Rules

- `confidence` is **not** a health metric. Label it as “match confidence” in UI.
- `signals_considered` must list **actual** inputs used (even if the list is `{ user_explicit_only }`).
- If the system falls back to defaults, `what_changed` must say so.
- Optional `next_action` may suggest “log reflection” or “open training” — **never** executes automatically.
