# Z-SSWS-GTC — Command boundaries

Who may **surface** vs **execute** across the tri-layer spine.

## Boundary matrix

| Action type | Cursor | GitHub | Cloudflare (future) | AMK human |
| --- | --- | --- | --- | --- |
| Draft branch / diff | Suggest | Store | — | Approve scope |
| Open PR | Suggest | Host | — | Open / review |
| Run CI checks | — | Run | — | Interpret |
| Merge to `main` | Must not | Gate only | — | **Sacred** |
| Deploy production | Must not | Must not | Charter only | **Sacred** |
| Edge bind / tunnel | Must not | Must not | Charter only | **Sacred** |
| Read receipts / reports | Suggest interpretation | Store history | Future review | Decide |
| NAS / RDP exposure | Must not | Must not | **Forbidden** | — |

## Tool ownership (advisory)

| Tool owns… | Does not own… |
| --- | --- |
| **Cursor** — plan, edit, verify suggestions, Turtle branches | Merge, deploy, secrets, production truth |
| **GitHub** — version history, PR review, checks, releases as receipts | Autonomous merge, deploy permission, operator judgment |
| **Cloudflare** (future) — static docs/demos, access posture research | NAS public exposure, auto tunnels, sole governance |

## Z-SSWS-GTC tracking posture (Phase 0)

Phase 0 **describes** what may be tracked later. No live tracker JSON or dashboard in this lane.

| Track item | Posture |
| --- | --- |
| Open PR queue | Read-only awareness |
| Failed CI checks | Advisory; not merge block unless human agrees |
| Branch map | Documentation / operator notes |
| Cloudflare phase | Future-phased label only |
| Operator queue | Aligns with PGMO / Turtle order when present |
| Receipt status | Pointer to green receipts and reports |
| Tool action owner | This boundary doc |

## Core laws (repeat)

```text
command spine ≠ execution authority
GitHub status ≠ merge permission
Cursor plan ≠ approved work
Cloudflare posture ≠ production bind
```

## Related

- [Z_SSWS_GTC_MASTER_DOCTRINE.md](./Z_SSWS_GTC_MASTER_DOCTRINE.md)
- [Z_SSWS_GTC_GITHUB_PROTOCOL.md](./Z_SSWS_GTC_GITHUB_PROTOCOL.md)
- [Z_SSWS_GTC_CURSOR_PROTOCOL.md](./Z_SSWS_GTC_CURSOR_PROTOCOL.md)
- [Z_SSWS_GTC_CLOUDFLARE_PROTOCOL.md](./Z_SSWS_GTC_CLOUDFLARE_PROTOCOL.md)
