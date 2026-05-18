# Phase 3A — Project Persistence Shell — Report

## Verdict

**GREEN**

## Delivered

| Item                      | Path                                      |
| ------------------------- | ----------------------------------------- |
| Project helpers           | `lib/projects.ts`                         |
| Scene helpers             | `lib/scenes.ts`                           |
| Persistence receipt UI    | `components/persistence-receipt-card.tsx` |
| Dashboard persistence     | `app/page.tsx`                            |
| Script save flow          | `app/script/page.tsx`                     |
| Project card open handler | `components/project-card.tsx`             |
| README                    | Phase 3A section                          |

## Behavior

- **Dashboard:** lists projects; **New Project** creates draft; storage label shows Supabase vs mock fallback.
- **Mock mode:** when `NEXT_PUBLIC_SUPABASE_*` missing, or Supabase configured but user not signed in — uses localStorage (`genesis-studio-mock-store-v1`, `genesis-studio-mock-scenes-v1`).
- **Supabase mode:** when env configured and `auth.getSession()` has a user — CRUD on `projects` and `scenes` with RLS.
- **Script:** explicit **Save to Project** only (no background autosave).
- **Receipt:** storage label, save status, last saved timestamp, project id, `providerStatus: none`, `humanReviewRequired: true`.

## Forbidden (confirmed absent)

- Real text/image/audio providers
- Media uploads
- Billing / deployment
- Background sync / autosave
- External media URLs on scenes

## Verification

```bash
cd apps/genesis-studio
npm run build
```

Result: **PASS** (Next.js 14.2.35 production build).

## Risks

| Severity | Risk                                           | Mitigation                                                                                       |
| -------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Low      | No in-app Supabase Auth UI in 3A               | Operator signs in via Supabase dashboard / future auth phase; mock fallback until session exists |
| Low      | Scene save replaces all rows (delete + insert) | Acceptable for Phase 3A; upsert can follow in 3B+                                                |
| Info     | Mock ids prefixed `mock-`                      | Clear separation from UUID projects                                                              |

## Rollback

Remove Phase 3A files and revert `app/page.tsx`, `app/script/page.tsx`, `components/project-card.tsx`, `README.md`.

## Next lane

Phase **3A.1** — Smoke + merge readiness: [PHASE_3A_1_SMOKE_MERGE_READINESS.md](PHASE_3A_1_SMOKE_MERGE_READINESS.md). Phase **3B** only after merge + AMK sign-off.
