# Z-Twin Roots Architecture

Z-Twin Roots Architecture is the living routing-memory layer of the Z-Sanctuary AI ecosystem.

It contains:

- **Mango Tree Core**: memory, receipts, identity, and activity references.
- **Tarzan Tree Core**: pathways, routing guidance, allowed touch-zones, helper matching.
- **Z-Fusion Grove**: temporary collaboration zone when one bot needs another.

This module is Phase 1 (mock/local): visual structure and data contracts only.

## Purpose

Prevent ecosystem confusion at scale:

- duplicate work
- wrong-folder edits
- lost receipts
- broken communication flow
- role drift and boundary violations

## Core model

### Mango Tree Core (Memory / Receipts)

Tracks references for:

- bot identity + home module
- folder/module ownership
- script-to-module relationships
- receipt pointers
- activity summary
- active/paused/blocked status

### Tarzan Tree Core (Pathway / Routing)

Guides:

- where bots can route
- what they can touch
- blocked/risk paths
- helper-bot suggestions
- recovery guidance when route fails

### Z-Fusion Grove

Collaboration contract:

1. Bot A requests support.
2. Tarzan Tree resolves compatible helper(s).
3. Mango Tree confirms history and ownership context.
4. Fusion workspace opens (advisory).
5. Work completes and receipt references are logged.
6. Bots return to primary roles.

## Phase 1 outputs

- `data/z_twin_roots_phase1_mock.json`
- `dashboard/panels/z_twin_roots_architecture.html`
- `data/reports/z_twin_roots_status.json`
- `data/reports/z_twin_roots_status.md`

## Governance rule

AI reads guidance and prepares actions. Humans approve critical operations.

Authority posture:

`advisory_only_no_auto_execution`

## Visual language

- dark future base
- emerald + gold + deep green + soft purple accents
- tree nodes as cards
- glowing links / vines
- mycelium strip for mini-bot / container / script flow

## Panels (planned)

- Ecosystem Map
- AI Identity Registry
- Bot Pathway Guide
- Fusion Grove
- Receipt Memory
- Folder/Module Ownership
- Risk/Blocked Paths
- Latest Activity

---

Phase 1 is architecture-first. Real logs and live routing bind in later phases.
