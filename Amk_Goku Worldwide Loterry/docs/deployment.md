<!-- Z: Amk_Goku Worldwide Loterry\docs\deployment.md -->

# Deployment & Reliability

## Dual-run mirroring

Use `python scripts/dual_run.py` to run the full observatory pipeline and simultaneously publish a mirrored copy of every artifact under `data/mirror/`. This ensures you always have a second run that can be inspected or audited without disrupting the live data.

## Offline rebuild pack

If you already have `data/histories/` and just need to refresh metrics/deltas/trust bundles, run:

```bash
python scripts/offline_rebuild.py
```

This runs the pipeline with `--skip-ingest` so ingestion is not repeated, which is ideal for offline audits or drift recalculations.

## Containerized deployment

Build the Docker image once:

```bash
docker build -t z-sanctuary:latest .
```

Then run it with mounted histories (optional):

```bash
docker run --rm -v $(pwd)/data:/app/data z-sanctuary:latest
```

The container installs the dependencies from `requirements.txt` and executes `scripts/deploy_zsanctuary.py`, so it contains everything needed for an air-gapped production run.
