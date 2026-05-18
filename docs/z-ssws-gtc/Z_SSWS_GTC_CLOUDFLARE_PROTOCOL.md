# Z-SSWS-GTC — Cloudflare protocol

Cloudflare is **future edge / access posture** — not production bind in Phase 0.

## Phasing law

```text
Pages → Zero Trust review → Workers only with charter
```

Phase 0 GTC: **doctrine only**. No Workers deploy, no tunnel creation, no API tokens in repo.

## Cloudflare may later help with (chartered phases)

- static docs and demos (Pages)
- access posture review (Zero Trust concepts)
- edge research and protected surface planning
- contingency dashboard Ask AI per hub policy (optional)

## Cloudflare must not

- expose NAS publicly
- expose raw RDP
- create tunnels automatically
- bind production without explicit charter and human gate
- become sole governance source over hub doctrine
- host AI runtime that bypasses AMK approval

## Canonical hub references

[Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md](../Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md)

Contingency identity JSON: `data/z_cloudflare_contingency_identity.json` (read policy before any future use)

Do not duplicate long Cloudflare doctrine here.

## Relationship to satellites

Roulette and other apps may document Cloudflare Pages + Containers in **their** repos. GTC cites hub posture only; satellite deploy remains operator-gated per Turtle Mode.

## Law

```text
Cloudflare posture ≠ production bind
readiness ≠ deploy
```

## Related

- [Z_SSWS_GTC_MASTER_DOCTRINE.md](./Z_SSWS_GTC_MASTER_DOCTRINE.md)
- [Z_SSWS_GTC_COMMAND_BOUNDARIES.md](./Z_SSWS_GTC_COMMAND_BOUNDARIES.md)
