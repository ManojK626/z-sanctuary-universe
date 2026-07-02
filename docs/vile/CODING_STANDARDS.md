# VILE Coding Standards

## Language & typing

- **TypeScript** preferred for packages and API  
- Strict typing — no implicit `any` in production paths  
- Shared types from `zuno-orchestrator-contracts`  

## Structure

| Rule | Detail |
| ---- | ------ |
| Small services | Single responsibility |
| Dependency injection | Testable boundaries |
| Clear interfaces | Ports and adapters for IO |
| No magic values | Constants + enums in shared packages |
| Reusable components | DRY across `apps/*` via packages |

## Security

- No hardcoded secrets  
- No placeholder “TODO” in production payment or health paths  
- Validate at boundaries  

## Repositories

- Turtle branches: `cursor/zsanctuary/*`  
- One domain per PR  
- Match existing hub conventions (`*.mjs` scripts, workspace layout)  

## Documentation per package

- README  
- Architecture link to `docs/vile/`  
- API doc or typed exports  
- Sequence diagram for non-trivial flows  
- ADR for significant decisions  

## Optimisation priority

```text
Correctness → Maintainability → Security → Evolution → Speed
```
