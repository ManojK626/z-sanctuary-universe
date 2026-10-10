# Z-Connect Contract Change Policy

**Owner:** AMK-Goku  
**Posture:** Merge Hold on all contract changes until human review

## Change classes

| Class | Examples | Gate |
| ----- | -------- | ---- |
| **Patch** | Description text, examples, non-breaking optional fields | Docs PR + validate script |
| **Minor** | New optional properties, new schemas in new files | Docs PR + inventory update |
| **Major** | Required field changes, forbidden field removal, v2 schemas | AMK ADR + migration doc |

## Forbidden additions (any class)

- `percentCompatible` or any compatibility percentage  
- `soulmateCertainty`, `destinyScore`, `brainRank`  
- Astrology or numerology as scored matching inputs  
- Clinical diagnosis or medical claim fields  

## Required on every change

1. Update [CONTRACT_INVENTORY.md](CONTRACT_INVENTORY.md)  
2. Run `node docs/z-connect/platform-contracts/scripts/validate_contracts.mjs`  
3. Update [DEPENDENCY_MAP.md](DEPENDENCY_MAP.md) if references change  
4. Note in domain README if behaviour meaning shifts  

## AI Constitution check

All changes must remain compliant with [Z_CONNECT_AI_CONSTITUTION_V1.md](../Z_CONNECT_AI_CONSTITUTION_V1.md).

## Runtime

Contract changes **do not** authorize API, database, or deployment work.
