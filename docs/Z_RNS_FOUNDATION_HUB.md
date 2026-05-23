# Z-RNS-FOUNDATION-1 — Timeline & Evidence Vault Hub

**Phase:** Z-RNS-FOUNDATION-1
**Parent:** [Z_REALITY_NAVIGATION_SYSTEM.md](Z_REALITY_NAVIGATION_SYSTEM.md)
**UI:** `dashboard/Html/z-rns-foundation-hub.html`

---

## Purpose

Local-first **chronology + evidence discipline** — the skeleton everything else depends on.

Not legal advice. Not cloud sync. Not AI API calls.

---

## Core UI (this phase)

| Component | Role | Runtime |
| --------- | ---- | ------- |
| Timeline Builder | Chronological event chain | IndexedDB — device local |
| Evidence Vault | Local file storage | IndexedDB blobs — device local |
| Evidence Metadata | Tags, timestamps, categories | IndexedDB |
| Evidence Cards | Preview + metadata surface | DOM — escaped |
| Export Pack | Manifest receipt (JSON) | Preview + optional local download |
| AI Summary | **Local mock only** | Template from local counts — no API |
| Rights Tracker | GDPR / CCTV / deadline awareness | IndexedDB checklist |
| Voice Notes | Emotional recall | **Blocked** — charter placeholder |
| Cause → Effect map | Root link between events | Event `cause_event_id` field |

---

## Future (not this phase)

- Cloud sync, AI APIs, PDF/ZIP binary bundles, 3D constellation, WebGPU
- Voice capture runtime (consent charter)
- Court filing, email, lawyer automation

Visual stack order (when chartered): Canvas → Framer Motion → Three.js → R3F → WebGPU.

---

## Tone law (critical)

The platform stays:

- awareness, organisation, preparation, education, emotional regulation, documentation

It must **never** promote vigilante energy, anti-law rhetoric, or “beat the system” framing.

---

## Data posture

- Database: `z_rns_foundation_v1` (IndexedDB, browser profile)
- Schema: `data/z_rns_foundation_schema.json`
- No data leaves the device unless the operator exports a manifest
- Export manifest contains **metadata only** — not file blobs by default

---

## Verification

```bash
npm run z:rns:foundation
npm run verify:md
```

Open: `dashboard/Html/z-rns-foundation-hub.html` via hub static server.

---

*Structured chronology first. Everything else follows.*
