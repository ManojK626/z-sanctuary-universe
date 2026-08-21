# Formula semantic goldens (hub)

**Gate:** `Z-SANCTUARY-FORMULA-SEMANTIC-GOLDENS-1`  
**Mode:** Permanent regression evidence only — **no formula rewrites**

## Law

Shared vocabulary does not imply shared implementation.

| Pack | Lineage | Entrypoint |
| --- | --- | --- |
| `data/formula_semantic_goldens/ggaesp_v11_v19_goldens.json` | GGAESP v11→v19 advisory | `core_engine/browser/ggaesp_pipeline.js` |
| `data/formula_semantic_goldens/omnai_omega_rsi_goldens.json` | OMNAI RSI simulation | `core/omnai/omega_formula.js` |

OMNAI omega goldens are **not** Ultra Ω proof.

## Command

```bash
npm run z:formula:semantic-goldens
```

## Success criterion

If GGAESP (or OMNAI omega RSI) semantic behavior changes tomorrow, this repository asserts the drift via exit code `1` and a per-vector diff — without inventing new expected values beyond sealed vectors.
