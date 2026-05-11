# Z-Garage — minimal Node `package.json` template

Use this **only** for folders that should be real Node packages (libraries, apps, tooling).

1. Copy or merge `package.json` into the target folder. If a file already exists, merge the `scripts` keys by hand; do not blindly overwrite unrelated fields.
2. Set `"name"` to something unique in the workspace.
3. Replace each stub script with real commands (see checklist in `docs/Z_GARAGE_TEMPLATE_AND_CHECKLIST.md`).
4. Skip pure static / data-only trees unless you deliberately want npm scripts there.

Stubs exit `0` so Z-Garage / ZCI see `start`, `build`, `test`, and `lint` without failing the tree until you wire real tools.
