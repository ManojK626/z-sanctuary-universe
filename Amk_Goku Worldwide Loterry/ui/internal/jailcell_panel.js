// Z: Amk_Goku Worldwide Loterry\ui\internal\jailcell_panel.js
// Z-JAILCELL Panel (internal, read-only)
(function () {
  const PANEL_ID = 'zJailCellPanel';

  function createPanel() {
    if (document.getElementById(PANEL_ID)) return;

    const panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.style.cssText = [
      'position: fixed',
      'bottom: 16px',
      'right: 16px',
      'width: 420px',
      'max-height: 60vh',
      'overflow-y: auto',
      'background: rgba(12, 15, 20, 0.92)',
      'color: #e6e8ee',
      'font-family: system-ui, sans-serif',
      'font-size: 12px',
      'border-radius: 12px',
      'padding: 12px',
      'box-shadow: 0 10px 30px rgba(0,0,0,0.4)',
      'z-index: 9999',
    ].join(';');

    panel.innerHTML = `
      <div style="font-weight:600; margin-bottom:8px;">
        Z-JAILCELL (Quarantine — Read-Only)
      </div>
      <div id="zJailCellList" class="muted">
        No specimens recorded.
      </div>
    `;

    document.body.appendChild(panel);
  }

  function render(items) {
    const container = document.getElementById('zJailCellList');
    if (!container) return;

    if (!items.length) {
      container.textContent = 'No specimens recorded.';
      return;
    }

    container.innerHTML = items
      .slice(-50)
      .reverse()
      .map(
        (s) => `
        <div style="margin-bottom:8px; padding-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.08);">
          <div><b>${s.category}</b> — ${s.severity}</div>
          <div class="muted">${s.message}</div>
          <div class="muted" style="font-size:11px;">
            ${s.source || 'unknown'} · ${s.ts}
          </div>
        </div>
      `
      )
      .join('');
  }

  function refresh() {
    if (!window.ZJailCell) return;
    render(window.ZJailCell.all());
  }

  window.ZJailCellPanel = {
    init() {
      createPanel();
      refresh();
      console.info('[JAILCELL Panel] Ready');
    },
    refresh,
  };
})();
