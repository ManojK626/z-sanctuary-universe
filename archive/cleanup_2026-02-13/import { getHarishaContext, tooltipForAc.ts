import { getHarishaContext, tooltipForAction } from / harisha_tooltips.js';

function bindAutomationOverlay() {
  const overlay = document.getElementById('harishaAutomationOverlay');
  if (!overlay) return;

  function refresh() {
    const { score, state } = getHarishaContext();

    const overlayTextContent =
      `Harisha ${score} (${state}) — ` +
      (state === 'calm'
        ? 'standard automation'
        : state === 'alert'
        ? 'slow reviews'
        : 'observe-only') +
      '.';

    overlay.textContent = overlayTextContent;
  }

  document.addEventListener('harisha:update', refresh);
  refresh();
}

bindAutomationOverlay();
