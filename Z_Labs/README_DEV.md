<!-- Z: README_DEV.md -->

# Z-Sanctuary Security Policy (Important)

All formulas, core engine designs, structures, mindsets, and system logic in the Z-Sanctuary Universe are proprietary to AMK-Goku and the Z-Family.

Access is restricted to:

- AMK-Goku
- Z-Family forces
- Authorized Z-AI and Mini-AI bots

Use Restrictions:

- No external distribution without explicit request and approval.
- No modifications or upgrades outside the Z-Sanctuary without review.
- No third-party use, reuse, or derivative deployments.

Enforcement:
Unauthorized usage is prohibited. Legal enforcement may be pursued if Z-Sanctuary formulas or engines are used outside authorized scope.

Change Control:
Review -> Verify -> Apply is mandatory for any updates.

## Reference: rules/Z_SANCTUARY_SECURITY_POLICY.md

## Z-Sanctuary Universe – Developer Guide

## Dev Workflow

- Use Live Server to auto-reload the frontend (right-click index.html > Open with Live Server)
- Use `npm run build` to build TypeScript packages
- Use `npm run lint` to check code style
- Use `npm run format` to auto-format code
- Use `python src/miniai/run_bots.py` to test Mini-AI bots

## Scripts

- `scripts/fix_md031.js`: Auto-fix markdown code fence spacing

## Environment

- Copy `.env.example` to `.env` and fill in secrets

## VS Code Tasks

- Launch Z-Sanctuary: runs the main setup script
- Run All Tests: (add your test runner here)
- Build & Serve: (add your build/start commands here)

## Tips

- All logs appear in both browser console and #zConsole
- Use Dev Mode for chronicle recording and testing
