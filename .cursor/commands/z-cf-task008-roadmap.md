# Cloudflare Task 008 — operator roadmap (Wrangler-only)

**Source of truth:** [MONOREPO_GUIDE.md](../../MONOREPO_GUIDE.md) → section **“Cloudflare (Task 008) — step-by-step roadmap”** (starts ~line 84).

## When the user invokes this command

1. Point them to **MONOREPO_GUIDE.md** for the full phased checklist (Phases 1–7 + checkpoints).
2. Remind: **Wrangler direct upload** only for soft launch; **GitHub** optional mirror; hub **governance** (`data/z_release_control.json`, enforcer) is separate from Cloudflare “production” URL.

## Commands to run from `ZSanctuary_Universe` root (PowerShell)

**Once per machine (browser login):**

```powershell
npx wrangler login
```

**Safe first path (demo data + preview deploy):**

```powershell
npm run deploy:cf-z-bridge:bundle:demo
npm run deploy:cf-z-bridge:pages
```

**After explicit review of copied hub JSON:**

```powershell
npm run deploy:cf-z-bridge:bundle
npm run deploy:cf-z-bridge:pages
```

**Production Pages URL (only when intentional):**

```powershell
npm run deploy:cf-z-bridge:pages:production
```

**Optional hub checks before a meaningful deploy:**

```powershell
npm run readiness:gate
node scripts/z_zuno_state_report.mjs
node scripts/z_execution_enforcer.mjs
```

## VS Code / Cursor tasks (this repo)

- **Z: CF Task 008 — bundle (demo)**
- **Z: CF Task 008 — pages deploy (preview)**
- **Z: CF Task 008 — bundle demo then pages preview** (runs both in sequence)

## Cloudflare “Ask AI”

Use for navigation and Wrangler how-to only. Do not paste vault secrets or proprietary internals. Cross-check with [rules/Z_SANCTUARY_SECURITY_POLICY.md](../../rules/Z_SANCTUARY_SECURITY_POLICY.md).
