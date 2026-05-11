<!-- Z: docs\SAFE_PACK_WEBHOOK.md -->

# Safe Pack Webhook Bridge

If you want Safe Pack events to travel outside Z-Sanctuary (for governance, audit, or external dashboards), drop the webhook URL into `data/safe_pack_webhook.json`:

```json
{
  "enabled": true,
  "url": "https://hooks.zuno.ai/safe-packs"
}
```

When enabled, every auto-applied pack/rollback sends `POST` JSON payloads, for example:

```json
{
  "event": "safe_pack.applied",
  "pack": {
    "id": "safe.docs.md022",
    "rule": "MD022",
    "family": "markdownlint",
    "file": "docs/Z_AUTO_CODEX.md",
    "status": "applied",
    "ts": "2026-01-23T12:00:00Z"
  }
}
```

Use this file to control delivery and keep the Safe Pack channel optional.
