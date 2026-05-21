# ZCO-8 — Probe Charter Doctrine (no runtime)

**Phase:** ZCO-8 — doctrine only; defines what a **future** consented probe **may** be allowed to do
**Authority:** Z-ATE + **AMK-Goku** gate before any probe implementation (ZCO-9+)
**Parent:** [Z_COMPUTE_ORGANISM_ARCHITECTURE.md](Z_COMPUTE_ORGANISM_ARCHITECTURE.md)

## Purpose

The Z-Compute Organism lane is **observe-only** through ZCO-7:

```text
declare → validate → draft → display
```

ZCO-8 does **not** add probes, scripts, shell, network, or hardware control. It **locks the charter** for any later probe phase so expansion cannot drift into stealth admin or telemetry.

## What exists today (ZCO-1–7)

| Layer | Capability | Runtime |
| ----- | ---------- | ------- |
| ZCO-1 | Doctrine | None |
| ZCO-2 | Observer reports | Read-only JSON writers |
| ZCO-3 | Cockpit (status) | GET only |
| ZCO-4 | Intake schema | Examples only |
| ZCO-5 | Validator | Declared JSON only |
| ZCO-6 | Upgrade draft | Advisory JSON only |
| ZCO-7 | Dashboard embed | GET only |

**No probe** is authorized by this document.

## Future probe — mandatory gates (all required)

Before any ZCO-9+ probe script or integration:

1. **Explicit opt-in** — operator enables probe in a local, gitignored config; default **off**
2. **Z-ATE charter** — written phase receipt; human merge on `main`
3. **AMK gate** — sacred move approval for scope, duration, and data retention
4. **14 DRP** — non-harm, no hidden autonomy, no cross-repo coupling without charter
5. **Green receipt** — verification logs; no cosmetic GREEN

## Allowed posture (future, when chartered)

A consented probe **may** be designed only within these bounds:

| Principle | Requirement |
| --------- | ----------- |
| **Local only** | Runs on operator machine; no cloud inventory exfiltration |
| **Read-only** | No mutation of hardware state, registries, or production paths |
| **Declared scope** | File paths and report outputs named in charter — no drive sweep |
| **Receipt-backed** | Writes only named report JSON/MD under `data/reports/` |
| **Human stop** | Operator can revoke opt-in without hub auto-repair |

## Forbidden (always)

| Forbidden | Reason |
| --------- | ------ |
| Remote scanning | No LAN/WAN discovery, port scan, ARP sweep |
| BIOS / firmware access | Human-only |
| Fan / clock / voltage control | No PWM, overclock, throttle |
| Hidden telemetry | No background streams, beacons, or undeclared collection |
| Auto-cluster join | Federation stays declared-only |
| Network probing (default) | **No** unless a **separate** network charter + AMK gate |
| Shell execution from probe | Use dedicated, reviewed scripts with exit codes documented |
| Auto-install / auto-purchase | AMK + human only |
| Unified-motherboard fusion claims | Distributed organism law |
| Override intake RED | Validator blocks unsafe declared inventory |

## Relationship to ZCO-5 / ZCO-6

| Tool | Role with probes |
| ---- | ---------------- |
| `npm run z:compute:intake` | Declared inventory remains source of truth |
| `npm run z:compute:upgrade-draft` | Draft stays advisory; probe output does not auto-merge into draft |
| Future probe reports | Must be labeled **consented probe** — never replace declared fields silently |

## Z-Arelium / OMNISWARM (advisory vocabulary)

Future probe findings use MiniBot **classify** language only:

- **GREEN** — read matched declared field
- **YELLOW** — mismatch needs human clarification
- **BLUE** — AMK decides before action
- **RED** — forbidden pattern or scope violation

Probe MiniBots **must not** gain `forbidden_actions` exceptions without a new charter.

## Smallest safe next action (today)

```text
Run ZCO-1–7 only.
Do not implement probe scripts until ZCO-9+ receipt exists.
```

## Locked law

```text
ZCO-8 = charter only.
Charter ≠ permission to probe.
AMK-Goku owns every future consented probe.
```
