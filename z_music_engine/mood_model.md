# Mood model (Z-SME)

## States (user-facing language)

| State | Maps to mode (default) |
| ---------- | ---------------------- |
| calm | `alignment` |
| focused | `power` |
| intense | `power` |
| reflective | `journey` |

## Inference order

1. If **user selected mode** → use it.
2. Else if `context === 'training'` → `power` (unless **kids** guardian: see below).
3. Else if `context === 'reflection'` → `journey`.
4. Else → `alignment`.

## Guardian (kids)

When `age_mode === 'kids'` and the user did **not** explicitly choose POWER:

- `context === 'training'` still defaults to **`alignment`** (calmer training soundtrack policy).
- User can always tap **POWER** to opt in.

This is a **product default**, not medical advice.
