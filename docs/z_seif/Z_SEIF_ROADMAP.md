# Z-SEIF Roadmap

**Gate:** `Z-SEIF-0`  
**Posture:** CONSERVATIVE · DO NOT AUTO-OPEN THE NEXT PHASE

```text
PHASE_0_5: CLOSED
```

| Phase | Intent | Depends on | Must not |
| --- | --- | --- | --- |
| 0 | Constitution + capability reconciliation | This document set | Runtime, provision, Hooks |
| 0.5 | Machine-readable Z-SEIF registry/schema | Phase 0 GREEN | Auto-open; implementation |
| 1 | Read-only cross-platform observers | Atlas + existing reports | Writers, Workers |
| 1.5 | Z-Atlas preflight context use | Existing preflight schema | Cursor Hook wiring |
| 2 | Cursor pre-mutation guard integration | 1.5 | Secretful MCP |
| 2.5 | GitHub event / evidence integration | GitHub as custody | Actions auto-deploy |
| 3 | Cloudflare deployment-state observer | Existing CF auth only | New CF resources |
| 3.5 | Event correlation fabric | HAM (if merged) + Queues **if** later authorized | Event-as-deploy |
| 4 | Human-approved durable workflows | Steward WAIT design | Skip WAIT |
| 4.5 | AI Gateway governance | Data classes | Raw PRIVATE_USER |
| 5 | Bounded Cloudflare AI / Agent pilots | All prior observers | Broad autonomy |
| 6 | Internal Z-Steward Control Plane | Observers + Access | Source authority |
| 7 | Cross-project operational intelligence | 6 + product liaisons | Product monolith |
| 8+ | Selective automation | Evidence that humans are the bottleneck | Silent production |

Phase 0.5 remains closed even if Phase 0 is GREEN.

No Cloudflare Worker, Agent, Gateway, D1, KV, R2, Queue, Workflow, Vectorize, Browser Rendering, Container, GitHub App, GitHub Action, MCP, or Cursor Hook is authorized by opening this file.
