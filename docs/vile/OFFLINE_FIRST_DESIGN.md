# Offline-First Design

**Mission:** Travellers retain critical access **without internet**.

## Offline bundle (minimum)

| Asset | Requirement |
| ----- | ----------- |
| Maps | Cached regions + last-sync timestamp |
| Tickets | Signed QR / barcode vault |
| QR codes | Verifiable offline where possible |
| Emergency contacts | Local + embassy + regional |
| Translations | Phrase packs for priority languages |
| Medical guidance | **Static approved content only** — not live AI diagnosis |

## Architecture pattern

```text
zuno-travel (sync engine)
    → encrypted device vault (mobile / PWA)
    → conflict resolution on reconnect
    → audit log of sync events
```

## Constraints

- Offline AI recommendations: **degraded mode** — pre-approved packs only  
- No silent background sync without user consent  
- Clear “last updated” indicators  

## Phase

**Phase 2** — after foundation packages chartered. ZILWA exhibits may inform content; they are not offline engines today.

## Testing

Integration tests must simulate aeroplane mode, partial sync, and clock skew.
