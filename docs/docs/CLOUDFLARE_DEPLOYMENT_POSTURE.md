# Cloudflare Deployment Posture

## Current Layer

Current deployment target:

- Cloudflare Pages
- Static-only deployment (CF-A)

---

## Public Scope

Public static assets may include:

- landing pages
- documentation
- experimental interface previews
- static dashboard shells

---

## Not Public

The following are NOT currently public:

- API orchestration
- billing systems
- shared memory systems
- autonomous agents
- Workers AI orchestration
- internal runtime tooling

---

## Deployment Principles

- Static-first
- Verification before expansion
- Human-reviewed deployment
- No secrets in repository
- Governance before automation
