# Z-SEIF Event and Approval Model

**Gate:** `Z-SEIF-0`  
**Posture:** CONCEPTUAL — NOT RUNTIME

`EVENT ≠ AUTHORITY`

An event may trigger observation, diagnosis, workflow, HOLD, or Steward review. It must not automatically authorize sensitive mutation.

## Future event vocabulary

| Event | Typical consumer | May auto-do | Must not auto-do |
| --- | --- | --- | --- |
| `PROJECT_DISCOVERED` | Atlas Scout | Observe / propose registry review | Ingest source |
| `IDENTITY_CHANGED` | PID / Atlas | HOLD if conflict | Rewrite identity |
| `BRANCH_CHANGED` | Evidence Keeper | Record | Merge / deploy |
| `BUILD_STARTED` | Deployment Sentinel | Observe | |
| `BUILD_PASSED` | Evidence Keeper | Record evidence | Deploy |
| `BUILD_FAILED` | Health / Steward Agent | Diagnose | “Fix formulas” |
| `DEPLOY_REQUESTED` | Workflow | WAIT | Deploy |
| `DEPLOY_APPROVED` | Workflow after Steward | Proceed to named target only | Change target |
| `DEPLOY_COMPLETED` | Evidence Keeper | Receipt | Open production |
| `DEPLOY_FAILED` | Recovery / Sentinel | HOLD + diagnose | Retry production |
| `HEALTH_DEGRADED` | Guardian / HAM | PRE_ALERT candidate | Declare RED product law |
| `PRE_ALERT` | HAM (when present) | Correlate | Page as incident without review rules |
| `INCIDENT` | HAM / Steward | Document | Autonomous “repair” of engines |
| `RECOVERY_STARTED` | Recovery Guardian | Observe | Destroy evidence |
| `RECOVERY_VERIFIED` | Evidence Keeper | Receipt | Lift HOLD automatically |
| `BACKUP_STALE` | Recovery Guardian | Recommend | Upload CREATOR_VAULT |
| `SECRET_RISK` | Security Sentinel | HOLD + redact | Print secret |
| `COST_THRESHOLD` | Cost Guardian | Recommend | Disable product |
| `POLICY_DRIFT` | Atlas Scout / PID | HOLD | Auto-merge |

Transport for these events is a **future** Cloudflare Queue / Workflow candidate. Existing Guardian / awareness / HAM producers remain the semantic source.

## Human-in-the-loop deployment workflow

Design only:

```text
GitHub
  → build / test evidence
  → Z-SEIF interpretation (observe / correlate / recommend)
  → Cloudflare Workflow
  → WAIT
  → Steward approval
  → private staging
  → verification
  → WAIT
  → Steward approval
  → production
```

Locks:

```text
MERGE ≠ PRODUCTION DEPLOYMENT
TEST PASS ≠ DEPLOY AUTHORITY
AI APPROVAL ≠ STEWARD APPROVAL
```

Do not implement this workflow in Phase 0.

## Cursor preflight concept

Before risky commands (`git push`, `git merge`, `wrangler deploy`, production deploy, database migration, secret changes), future Z-SEIF + Atlas should answer:

```text
YOU ARE HERE
PROJECT:
ROOT:
REPO:
BRANCH:
TARGET:
DEPLOYMENT AUTHORITY:
NEXT GATE:
SAFE TO MUTATE:
```

This is the [ZAtlasPreflightContext](../z_atlas/Z_ATLAS_AI_PREFLIGHT_CONTEXT.md) contract plus SEIF target/authority fields.

No Hook implementation in Z-SEIF-0.

`EVENT_MODEL: DEFINED`  
`STEWARD_APPROVAL_MODEL: DEFINED`
