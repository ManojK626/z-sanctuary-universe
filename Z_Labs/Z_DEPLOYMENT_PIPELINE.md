# Z Deployment Pipeline - Lab to Sanctuary

Promotion path:

1. Build in Z_Labs (/modules_draft or /module_prototypes).
2. Review architecture/spec and security constraints.
3. Promote manually into ZSanctuary_Universe/modules as disabled.
4. Run gates:
   - npm run lint
   - npm run cycle:routine
   - npm run maintain:daily
5. Enable only after governance approval.

Safety:

- No direct runtime link from lab to production.
- No silent overwrite of Sanctuary files.
- Every promotion must leave an audit note.
