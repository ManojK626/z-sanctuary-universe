# Z-SEIF Platform Capability Atlas

**Gate:** `Z-SEIF-0`  
**Posture:** CONCEPTUAL — NOT RUNTIME  
**Do not provision** any Cloudflare, GitHub, or Cursor resource from this document.

Cloud capability ≠ permission to use it.

## Cloudflare

Classify Cloudflare as **OPERATIONS** — runtime, edge, Access, and future observers. Not source authority.

| Capability | Purpose | Best Z-SEIF use | Data class allowed | Authority | Risks | Duplication | Phase |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Workers | Edge compute / static assets | Per-product private staging, later Steward control Worker | PUBLIC / INTERNAL / STEWARD_ONLY | Runtime only after Steward gate | Public leak if Access absent | Product Workers ≠ Sanctuary Worker | 5+ product; 6 control plane |
| Workers AI | Inference at edge | Optional later specialist, never formula authority | INTERNAL only after review | Advisory | Cost, data egress | Zuno / MiniBots already observe | 5 |
| Agents | Long-running agent runtime | Bounded observer pilots only | INTERNAL | Observe → recommend | Autonomous mutation | Zuno / Tower overlap | 5 |
| AI Gateway | Routed model access + logs | Governed routing / observability | No raw PRIVATE_USER | Routing | Prompt leak | Not a second AI brain | 4.5 |
| Durable Objects | Strongly consistent edge state | Future session/coordination **if** no local engine exists | INTERNAL | None now | Hidden global state | Do not replace PID/Atlas | 4+ |
| D1 | SQL | Product-local only if required | INTERNAL / PRIVATE_PRODUCT conditional | None now | Cross-product join temptation | Not a universal DB | 4+ |
| KV | Low-latency config/cache | Non-secret flags | PUBLIC / INTERNAL | None now | Stale config as “truth” | Not identity registry | 3+ |
| R2 | Object storage | Lifeboat / dual custody **already designed** | INTERNAL / recovery | Custody ≠ truth | Treating R2 as authority | Reuse Lifeboat / R2 recon | existing design |
| Queues | Async events | Future event fabric transport | INTERNAL | Event ≠ authority | Auto-exec on consume | HAM + awareness spine | 3.5 |
| Workflows | Durable human-in-the-loop | Deploy WAIT → Steward → staging → WAIT → prod | INTERNAL | Steward at waits | Skipping WAIT | Z-OTF / gates | 4 |
| Vectorize / AI Search | Embeddings | Only sanitized INTERNAL knowledge | Never CREATOR_VAULT / SECRET | None now | Private formula ingest | Z-LIC / local knowledge | 5+ if ever |
| Browser Rendering | Headless page | Rare evidence capture | No PRIVATE_USER photos by default | None now | Cost, PII | Playwright stays local | 8+ |
| Access / Zero Trust | Identity wall | Steward-only internals; product private staging | STEWARD_ONLY | Access is perimeter, not product law | email_domain vs exact EMAIL | Existing ZWheel pattern | 3+ observers; products as authorized |
| Containers | Longer jobs | Last resort | INTERNAL | None now | Always-on cost | Prefer Workers | 8+ |
| Bindings | Least-capability attach | `LEAST_CAPABILITY_BINDING` | Per worker | Explicit allow | Universal binding | New | 3+ |
| Secrets management | Credential store | SECRET class only | SECRET | No receipt values | Shared secrets | Existing leak detector | 3+ |
| Analytics / observability | Traffic/error/cost | Feed Z-Cost / health observers | INTERNAL | Observe | Treating dashboards as GREEN | Guardian / SLO | 3 |
| Custom domains / routing | Hostname attach | Per-product; never wild apex by convenience | PUBLIC / STEWARD_ONLY | Steward | Accidental production bind | Product deploy doctrine | product gates |

No Worker, D1, KV, R2, Queue, Workflow, Vectorize, Agent, Gateway, or Container is created in Phase 0.

## GitHub

Classify GitHub as **SOURCE + CUSTODY + ENGINEERING EVIDENCE**. Not runtime authority.

| Capability | Purpose | Best Z-SEIF use | Authority | Risks | Phase |
| --- | --- | --- | --- | --- | --- |
| Repositories | Source custody | One repo per sovereign product + Sanctuary hub | Custody | Hub absorbing product source | existing |
| Branches / tags | Lineage | Annotated release tags as evidence | Evidence | Tag ≠ production | existing |
| Pull Requests | Human review | Merge Hold; human merge | Review | Merge ≠ production | existing |
| Issues / Projects | Work tracking | Optional evidence, not identity | None | Shadow registry | 2.5 |
| GitHub Apps | Automation identity | Avoid until least-privilege design | None now | Broad org power | 8+ |
| Webhooks | Event ingress | Future GitHub event integration | Event ≠ authority | Secret in webhook | 2.5 |
| Actions / CI | Verify | Sanctuary already has verify lanes | Test evidence | Auto-deploy | **do not add CI/CD in this phase** |
| Environments | Deploy protection | Future production HOLD | Steward | Skipping reviewers | 4 |
| Releases / artifacts | Immutable evidence | Pair with receipts | Evidence | Artifact as runtime | 2.5 |
| Security scanning | Advisory | Compose with data-leak / sentinel | Observe | False GREEN | 2.5 |
| Branch protections | Mutation friction | Protect `main` | Custody | Bypass tokens | existing / harden later |

`MERGE ≠ PRODUCTION DEPLOYMENT`

## Cursor

Classify Cursor as **ENGINEERING EXECUTION**. Not canonical project identity authority.

| Capability | Purpose | Best Z-SEIF use | Authority | Risks | Phase |
| --- | --- | --- | --- | --- | --- |
| Project Rules / AGENTS.md | Local law | Load Atlas + SEIF doctrine before mutation | Guidance | Ignoring wrong-root | 2 |
| Hooks | Pre-command guard | Future preflight on `git push`, `wrangler deploy` | Guard, not identity | Implementing in Phase 0 | **CLOSED now** |
| MCP | Tool access | Future read-only observers only | None now | Secretful MCP | **no MCP in Phase 0** |
| Agents / cloud agents | Parallel research | Architecture / verify lanes | Observe | Writing to dirty trees | 1+ |
| Commands | Repeatable gates | Named Steward gates | Gate text | Command as deploy | existing |
| Worktrees | Isolated slices | This Phase 0 pattern | Execution hygiene | Dirty Creator tree | existing |
| Testing / review | Evidence | Playwright, AAFRTC, md lint | Evidence | Test pass ≠ deploy | existing |
| Evidence reports | Receipts | Phase receipts | Evidence | Secrets in reports | existing |

Cursor must load Z-Atlas preflight before risky mutation. Cursor does not become PID.

## Atlas verdicts

`CLOUDFLARE_CAPABILITY_ATLAS: COMPLETE`  
`GITHUB_CAPABILITY_ATLAS: COMPLETE`  
`CURSOR_CAPABILITY_ATLAS: COMPLETE`
