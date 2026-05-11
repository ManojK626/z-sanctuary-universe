// Z: core\co_autopilot_preview.js
(function () {
  const STORAGE_KEY = 'zCoAutopilotPreview';
  const button = document.getElementById('coAutopilotPreviewBtn');
  const statusEl = document.getElementById('coAutopilotPreviewStatus');
  const badgeEl = document.getElementById('coAutopilotPreviewBadge');

  if (!button || !statusEl) return;

  function setState(active) {
    const next = Boolean(active);
    localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off');
    statusEl.textContent = `Co-Autopilot Preview: ${next ? 'On' : 'Off'}`;
    statusEl.style.color = next ? '#7ad3ff' : '#9aa1b3';
    button.textContent = next ? 'Preview Enabled' : 'Co-Autopilot Preview';
    button.dataset.active = next ? 'true' : 'false';
    if (badgeEl) {
      badgeEl.style.opacity = next ? '1' : '0.4';
    }

    if (window.ZChronicle?.record) {
      window.ZChronicle.record({
        source: 'co_autopilot_preview',
        type: 'toggle',
        active: next,
        ts: new Date().toISOString(),
      });
    }
  }

  function getState() {
    return localStorage.getItem(STORAGE_KEY) === 'on';
  }

  button.addEventListener('click', () => {
    setState(!getState());
  });

  setState(getState());
})();
