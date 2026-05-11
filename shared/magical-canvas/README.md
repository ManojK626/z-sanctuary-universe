# Z Magical Canvas PlayKit (ZMC-1)

**Free local visual joy layer** — aurora, fairy orbs, Celtic rings, optional angel outlines, optional sketch + PNG export. **No uploads, accounts, AI, APIs, payments, or Sanctuary bridge.**

## Themes

| id | Display |
| ----------------- | -------------------------------- |
| `eirmind` | ÉirMind Aurora |
| `princess_blacky` | Princess & Blacky Magical Garden |
| `z_questra` | Questra PlayGarden |
| `sanctuary_gold` | Sanctuary Gold Light |

## Usage snippet

Serve your page over HTTP (or open from static host). Paths below assume PlayKit lives at `shared/magical-canvas/` under the hub root.

```html
<link rel="stylesheet" href="/shared/magical-canvas/z-magical-canvas-kit.css" />
<div id="magical-play-root" style="max-width: 720px"></div>
<script src="/shared/magical-canvas/z-magical-canvas-kit.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function () {
    initMagicalCanvasKit({
      root: '#magical-play-root',
      theme: 'princess_blacky',
      enableSketch: true,
      enableAngelOutlines: true,
      safetyMode: 'comfort_first',
    });
  });
</script>
```

Relative path from `dashboard/Html/`: `../../shared/magical-canvas/z-magical-canvas-kit.css` (adjust per host).

## API

- **`initMagicalCanvasKit(options)`** — `root` (element or selector), `theme`, `enableSketch`, `enableAngelOutlines`, `safetyMode` (`comfort_first` lowers glow).
- Returns `{ destroy() }` to tear down listeners (experimental).

## Governance

Read **`docs/cross-project/Z_MAGICAL_CANVAS_PLAYKIT_POLICY.md`** and hub **`data/z_magical_visual_capability_registry.json`** — visual reuse does not grant paid service access.
