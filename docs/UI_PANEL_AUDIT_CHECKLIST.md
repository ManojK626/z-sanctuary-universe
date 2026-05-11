<!-- Z: docs\UI_PANEL_AUDIT_CHECKLIST.md -->

# UI Panel Audit Checklist

## Scope

Verify panel behavior across collapse, minimize, maximize, close, dock, and popout actions.

## Checks

- Collapse: body hides, header stays visible.
- Minimize: body hides, panel remains in layout.
- Maximize: panel fills viewport, restore returns to prior size/position.
- Close: panel hides and is reflected in Panel Directory.
- Dock: panel returns to column layout.
- Popout: panel opens in new window with correct title.
- Locked panels: action buttons disabled.
- Focus mode: hidden panels remain hidden.

## Shortcuts

- Alt+C → Collapse/Expand (active panel)
- Alt+M → Minimize/Restore (active panel)
- Alt+X → Maximize/Restore (active panel)
- Alt+W → Close (active panel)

## Notes

- Active panel is the last clicked panel.
- Shortcuts do not run if no panel is focused.
