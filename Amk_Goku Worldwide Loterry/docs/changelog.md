<!-- Z: Amk_Goku Worldwide Loterry\docs\changelog.md -->

# Changelog

## [v1.0.0] - 2026-01-26

### Added

- Full pipeline release with downloader → ingest → prediction → trust bundle → commentary → world observer.

- KAIROCELL advisory layer summarizing entropy metrics into phases, micro-cells, and ring averages stored in `data/kairocell`.

- UI overlay (`ui/kairocell_overlay.html`) exposing the KAIROCELL view plus release notes & overlay context in `release_notes.md`.

- Validation helpers (`scripts/validate_inspection.py`), root cause logging (`data/root_causes/root_causes.json`), drift watch outputs (`data/drift_watch/`), deployment helper (`scripts/deploy_zsanctuary.py`), reliability scripts (`scripts/dual_run.py`, `scripts/offline_rebuild.py`), and guardrail tests (`tests/test_kairocell_*.py`, `tests/test_root_cause.py`).

- Release documentation locked in `release_notes.md`, `docs/release_notes.md`, and the new `docs/deployment.md`.
