# Z-SEIF Phase 1 Thin Slice 2

**Gate:** `Z-SEIF-1-GITHUB-EVIDENCE-READER-THIN-SLICE-2`  
**Posture:** PUBLIC GITHUB EVIDENCE ONLY · GET · UNAUTHENTICATED · OPT-IN

```text
PHASE_0_5: CLOSED
PRODUCTION_AUTHORITY: NONE
NEW_SECRET_REQUIRED: NO
PERSISTENCE_REQUIRED: NO
```

GitHub proves what GitHub currently observes. It does not define what project GitHub belongs to.

## Commands

- Local only (default, no network): `npm run z:seif:observe`
- Public GitHub GET opt-in: `npm run z:seif:observe -- --github-public`

## Allowlist

Probe target (authorized, not canonical identity): `ManojK626/z-sanctuary-universe`

Local origin is parsed first. A GET happens only if that origin matches the allowlist. Other remotes are not queried (`GITHUB_API_READ: NOT_ATTEMPTED`).

## Endpoints (GET only)

1. `/repos/ManojK626/z-sanctuary-universe`
2. `/repos/.../branches/{default_branch}`
3. `/repos/.../commits/{local HEAD}`
4. `/repos/.../actions/runs?head_sha={local HEAD}`

No pulls, releases, issues, tags, search, or account enumeration.

## Authority split (required)

Provider consistency may be `MATCH` when local origin and GitHub `full_name` agree.

Canonical relationship remains:

```text
EXPECTED_REPOSITORY: UNKNOWN
REPOSITORY_MATCH: UNKNOWN
```

until an existing canonical owner names the hub repository. GitHub GET cannot supply that expectation.

All API facts are `OBSERVED_PROVIDER_EVIDENCE`, discarded after the report. No token, Authorization header, private repo, ZWheel, or Cloudflare read.
