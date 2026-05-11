# Z OTel Shadow Status

Generated: 2026-04-17T16:54:53.715Z
Mode: shadow
Status: READY

## Checks

- PASS collector_config_exists: collector.shadow.yaml present
- PASS docker_available: docker binary detected (optional for shadow)
- WARN otelcol_available: otelcol not detected (shadow mode still valid)

Operational note: shadow mode is non-invasive and does not alter runtime pipelines.
