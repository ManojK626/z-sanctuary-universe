# Registry Snapshot Automation

Use `scripts/export_registry_snapshot.py` to keep the Z-Registry state recorded, styled, and packaged for your guardians.

## What it does

- Reads both `data/Z_module_registry.json` and `core/data/Z_module_registry.json`.
- Exports a timestamped JSON + HTML summary (`exports/registry_snapshot_<timestamp>.*`) with the percent + module list.
- Rebuilds `release_snapshot.zip` to include `index.html`, `z_registry_badge.js`, the latest registry export, and metadata.

## Run once

```bash
python scripts/export_registry_snapshot.py
```

## Schedule (Windows Task Scheduler / cron)

- Example (Windows): run your nightly export + backup hook:
  `python C:\ZSanctuary_Universe\core\scripts\backup_hook.py && python C:\ZSanctuary_Universe\core\scripts\deploy_snapshot.py`
- Example (Linux/macOS): schedule the combined hook + deploy:

  ```text
  0 5 * * * cd /path/to/core && ./venv/bin/python scripts/backup_hook.py && ./venv/bin/python scripts/deploy_snapshot.py
  ```

`backup_hook.py` runs the registry snapshot, the verify helper ensures logs are kept, and `deploy_snapshot.py` copies `release_snapshot.zip` (and registry metadata) into `deployments/registry` by default (override via `Z_SNAPSHOT_DEST`). Keep the `exports/` directory and snapshot zip under backup for long-term records.
