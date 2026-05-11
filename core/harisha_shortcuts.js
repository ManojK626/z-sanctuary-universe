// Z: core\harisha_shortcuts.js
import { refreshHarishaTooltips, tooltipForAction } from './harisha_tooltips.js';

/**
 * Living Workspace Tag: Harisha Shortcut Guard
 * Description: logs Harisha-aware shortcut usage and decorates shortcuts with Harisha guidance.
 */
const SHORTCUT_ATTR = 'data-harisha-shortcut';

function normalizeKey(event) {
  const parts = [];
  if (event.ctrlKey) parts.push('ctrl');
  if (event.shiftKey) parts.push('shift');
  if (event.metaKey) parts.push('meta');
  if (event.altKey) parts.push('alt');
  const key = event.key?.toLowerCase?.();
  if (key && !['control', 'shift', 'alt', 'meta'].includes(key)) {
    parts.push(key);
  }
  return parts.join('+');
}

function logShortcut(action, score, state) {
  window.ZChronicle?.log('harisha.shortcut', {
    action,
    score,
    state,
    ts: new Date().toISOString(),
  });
}

function bindHarishaShortcuts() {
  const map = new Map();

  function refreshShortcuts() {
    const { score, state } = refreshHarishaTooltips();
    document.querySelectorAll(`[${SHORTCUT_ATTR}]`).forEach((el) => {
      const action = el.dataset.harishaAction;
      const combo = el.dataset.harishaShortcut;
      if (combo) {
        map.set(combo.toLowerCase(), el);
      }
      if (action) {
        el.title = tooltipForAction(action, score, state);
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    const combo = normalizeKey(event);
    if (!map.has(combo)) return;
    const el = map.get(combo);
    const action = el.dataset.harishaAction || 'automation shortcut';
    const { score, state } = refreshHarishaTooltips();
    logShortcut(action, score, state);
  });

  const observer = new MutationObserver(() => refreshShortcuts());
  observer.observe(document.body, { childList: true, subtree: true });
  refreshShortcuts();
}

export { bindHarishaShortcuts };
