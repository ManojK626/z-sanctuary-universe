<!-- Z: interface\README.md -->

# Interface

UI assets and HUD styles for the Sanctuary live here.

Key items:

- `z_style.css` — design tokens and console styles. See CSS variables `--z-primary`, `--z-accent`, `--z-harmony`, and `--z-dark`.
- Add HUD HTML/JS here and control it from `core/z_chronicle_hud.js`.

Notes:

- Keep visual state in CSS variables and avoid hardcoding colors in JS.
- Prefer DOM-first updates: `#zConsole` is the primary display element used by `ZStatusConsole`.
