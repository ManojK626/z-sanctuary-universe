# Z-Paradigm — Module Map (Future Lanes)

**Phase:** Z-PARADIGM-1 — **concepts only**  
**Status:** All modules `doctrine_only` until a chartered phase assigns prototypes.

---

## Module overview

| Module ID | Name | Future purpose | Z-PARADIGM-1 status |
| --------- | ---- | -------------- | ------------------- |
| `z_mind` | **Z-Mind** | Privacy-respecting **knowledge assistant** — intake organization, summarization, gentle suggestions | Doctrine only |
| `z_mimics` | **Z-Mimics** | Low-power **physical / IoT concept** — optional environmental sensing with consent | Doctrine only |
| `z_atlas` | **Z-Atlas** | **Ecological / community map** — stewardship visibility, not people tracking | Doctrine only |

---

## Z-Mind (future knowledge assistant)

**May become (with charter):**

- Local-first notes and reading lists  
- Session-scoped summarization user approves before save  
- Links to hub docs and registries (read-only)

**Must not become without charter:**

- Always-on memory across users  
- Vector DB / RAG pipeline to external providers  
- Lie detection, emotion certainty, or «awakening» narratives  
- Autonomous actions on user accounts or devices

**Tech assumptions:** None locked in Phase 1. No Pinecone, no OpenAI, no LangChain requirement in doctrine.

---

## Z-Mimics (future IoT concept)

**May become (with charter):**

- Documented sensor **types** (temperature, humidity, air quality class) as **optional** aids  
- Low-power, local gateway mock in lab only

**Must not become without charter:**

- Covert home surveillance  
- Always-on microphone by default  
- Firmware flashed to production hardware from this repo without hardware charter  
- Cloud exfiltration of raw sensor streams

**Safety law:** IoT concept ≠ deployed device.

---

## Z-Atlas (future ecological / community map)

**May become (with charter):**

- Static maps of **community projects**, gardens, repair cafes, rescue partners (human-curated)  
- Educational layers: habitat notes, seasonal rhythms (non-authoritative)

**Must not become without charter:**

- Real-time tracking of individuals  
- Predictive policing or «risk territory» scoring  
- Surveillance integration (CCTV, facial recognition)  
- Property value manipulation narratives

**Safety law:** Map ≠ surveillance.

---

## Cross-module rules

| Rule | Detail |
| ---- | ------ |
| **No default coupling** | Z-Mind, Z-Mimics, and Z-Atlas do not imply each other at runtime. |
| **Cite hub lanes** | May reference Z-UIL, Z-EXL, Z-FUTURE safety law, Z-OPS coherence docs — **no live bridge claim**. |
| **One prototype at a time** | Z-PARADIGM-2 picks **one** module for static/local prototype. |

---

## Suggested Z-PARADIGM-2 decision order (human choice)

1. **Z-Mind** — if knowledge organization is the urgent learning need.  
2. **Z-Atlas** — if community visibility maps are the urgent learning need.  
3. **Z-Mimics** — only after privacy and hardware charters exist (highest risk).

---

## Registry

Machine-readable posture: `data/z_paradigm_capability_seed.json`

---

## Related

- [Z_PARADIGM_PROJECT_CHARTER.md](Z_PARADIGM_PROJECT_CHARTER.md)
- [PHASE_Z_PARADIGM_1_GREEN_RECEIPT.md](PHASE_Z_PARADIGM_1_GREEN_RECEIPT.md)
