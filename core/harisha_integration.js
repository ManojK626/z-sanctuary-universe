// Z: core\harisha_integration.js
/**
 * Living Workspace Tag: Harisha Automation Overlay
 * Description: updates the automation overlay badge + tooltips and binds Harisha-aware shortcuts.
 */
import { refreshHarishaTooltips, buildHarishaTooltip } from './harisha_tooltips.js';
import { bindHarishaShortcuts } from './harisha_shortcuts.js';

const OVERLAY_ID = 'harishaAutomationOverlay';
const TOOLTIP_ACTION_SELECTOR = '[data-harisha-action]';
const STYLE_ID = 'harisha-integration-style';

function createStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .z-harisha-overlay {
      position: fixed;
      bottom: 12px;
      right: 12px;
      padding: 4px 10px;
      font-size: 11px;
      border-radius: 12px;
      background: rgba(12, 14, 20, 0.9);
      color: #fdfdfd;
      border: 1px solid rgba(255, 255, 255, 0.2);
      font-family: Inter, Segoe UI, sans-serif;
      pointer-events: none;
      z-index: 9998;
    }
    .z-harisha-overlay.alert {
      border-color: rgba(255, 165, 0, 0.6);
    }
    .z-harisha-overlay.tense {
      border-color: rgba(255, 99, 132, 0.6);
    }
    .z-harisha-overlay.critical {
      border-color: rgba(255, 59, 48, 0.8);
    }
  `;
  document.head.appendChild(style);
}

function ensureOverlay() {
  let overlay = document.getElementById(OVERLAY_ID);
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.className = 'z-harisha-overlay';
    overlay.textContent = 'Harisha overlay preparing…';
    document.body.appendChild(overlay);
  }
  return overlay;
}

function setOverlayState(score, state, action = 'Automation rail') {
  const overlay = ensureOverlay();
  overlay.textContent = buildHarishaTooltip(action, score, state);
  overlay.className = `z-harisha-overlay harisha-${state}`;
}

function scanAutomationButtons() {
  const { score, state } = refreshHarishaTooltips();
  document.querySelectorAll(TOOLTIP_ACTION_SELECTOR).forEach((el) => {
    const action = el.dataset.harishaAction;
    if (!action) return;
    el.title = buildHarishaTooltip(action, score, state);
  });
  setOverlayState(score, state);
}

function bindHarishaAutomation() {
  const observer = new MutationObserver(() => scanAutomationButtons());
  observer.observe(document.body, { childList: true, subtree: true });
}

function initHarishaIntegration() {
  createStyle();
  scanAutomationButtons();
  bindHarishaAutomation();
  document.addEventListener('harisha:update', () => scanAutomationButtons());
  bindHarishaShortcuts();
}

window.ZHarishaIntegration = {
  init: initHarishaIntegration,
};

document.addEventListener('DOMContentLoaded', () => {
  initHarishaIntegration();
});
