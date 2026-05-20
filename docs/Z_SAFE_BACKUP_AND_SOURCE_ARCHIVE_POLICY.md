# Z-SAFE-BACKUP — Protected backup and source archive policy

**Lane:** Z-SAFE-BACKUP (doctrine + policy registry)  
**Hub:** Z-Sanctuary Universe

## Purpose

Define **where** source and backups may live across GitHub, Cloudflare, local PC, Synology NAS, and optional emergency cloud — and what must **never** enter version control or public edge storage.

Backup lanes are **not** interchangeable. Each lane has allowed and forbidden content.

## Standing law

```text
backup ≠ deploy permission
archive ≠ public exposure
encrypted private backup ≠ GitHub commit
NAS truth ≠ hub auto-sync without charter
```

Human operator owns restore drills, NAS mount verification, and sacred moves.

## Lane overview

| Lane | Role | Authority |
| --- | --- | --- |
| GitHub | Versioned source + docs + receipts | PR + human merge on `main` |
| Cloudflare | Deployed runtime / edge posture | Charter + human; secrets in dashboard only |
| Local PC | Working tree + operator snapshots | AMK; not auto-uploaded by hub scripts |
| Synology NAS | Private full backups + DB archives | AMK; `NAS_WAIT` until mounted and verified |
| Emergency cloud | Encrypted off-site archives only | Explicit policy + encryption; no public buckets |

Machine policy: `data/z_backup_lane_policy.json`.

---

## GitHub lane

### Allowed in repo (via PR)

- source code
- documentation
- registries and manifests (no secrets)
- scripts and verification receipts
- configuration **templates** (`.env.example`, documented keys only)

### Forbidden in repo (never commit)

- `.env` and live env files
- API tokens, PATs, private keys
- Stripe / PayPal / banking secrets
- database dumps and production user data
- personal files (family, health, vault raw exports)
- large binary archives and full PC disk images
- NAS snapshot images
- unencrypted emergency cloud bundles

Use `.gitignore`, pre-commit review, and [rules/Z_SANCTUARY_SECURITY_POLICY.md](../rules/Z_SANCTUARY_SECURITY_POLICY.md).

### GitHub is not

- a NAS replacement
- a database backup vault for production PII
- permission to auto-sync PC folders

---

## Cloudflare lane

### Allowed (when chartered)

- deployed static apps (Pages)
- containerized API (Containers)
- Workers **only** with explicit charter
- runtime env and secrets **only** via Cloudflare secure dashboard / secrets store

### Cloudflare forbidden

- using Cloudflare as raw PC backup or NAS mirror
- storing unencrypted private archives without written policy
- committing production tokens to the hub repo
- binding production without dry-run receipts

See [Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md](./Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md) and [Z-GITHUB-SANCTUARY-GATE.md](./Z-GITHUB-SANCTUARY-GATE.md).

---

## Local PC lane

### Allowed (operator-controlled)

- active working copies under `C:\Cursor Projects Organiser\…`
- local-only reports under `data/reports/` (many gitignored)
- manual zip snapshots **outside** repo when needed
- restore drills from NAS **to** PC paths after verification

### Forbidden (automation from hub)

- auto-upload of arbitrary PC folders to cloud
- hub scripts scanning drives outside manifest paths
- treating Desktop/Downloads as backup targets without charter

---

## NAS lane (Synology)

### Allowed

- full private project backups
- versioned project archives
- database backups (encrypted at rest where policy requires)
- encrypted snapshots
- documented restore drills

### Posture

- `NAS_WAIT` in gateway and control-link manifests until path is mounted, verified, and intentionally enabled
- NAS is **authoritative for private cold storage**, not for live hub governance JSON unless human-synced via PR

See [Z_CRYSTAL_DNA_MESH.md](./Z_CRYSTAL_DNA_MESH.md), [Z_SANCTUARY_CANONICAL_CONTROL_ROOT.md](./Z_SANCTUARY_CANONICAL_CONTROL_ROOT.md).

---

## Emergency cloud backup lane

### Allowed only when

- archives are **encrypted** (operator-chosen tooling)
- no raw secrets inside archive payload
- no public buckets or world-readable ACLs
- upload is **audited** (who, when, what manifest)
- restore drill documented before relying on archive

### Emergency cloud forbidden

- unaudited uploads
- plaintext vault or DB dumps
- sharing links without access control
- substituting emergency cloud for GitHub source truth

---

## Module work + backup interaction

Before **building** a new module:

1. Run **Z-MDE** classification ([Z_MODULE_DEDUPLICATION_EVOLUTION_ENGINE.md](./Z_MODULE_DEDUPLICATION_EVOLUTION_ENGINE.md)).
2. Confirm backup lane for any artefacts (code → GitHub; private dumps → NAS only).
3. Turtle branch + PR; never commit forbidden classes above.

## Related

- [Z_MODULE_DEDUPLICATION_EVOLUTION_ENGINE.md](./Z_MODULE_DEDUPLICATION_EVOLUTION_ENGINE.md)
- [Z_OPERATIONAL_TECHNOLOGY_LAYERS.md](./Z_OPERATIONAL_TECHNOLOGY_LAYERS.md)
- [data/z_backup_lane_policy.json](../data/z_backup_lane_policy.json)
- [vault/Vault_Policy_Sheet.md](./vault/Vault_Policy_Sheet.md)
