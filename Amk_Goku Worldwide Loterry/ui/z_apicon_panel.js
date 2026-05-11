// Z: Amk_Goku Worldwide Loterry\ui\z_apicon_panel.js
// Z-APICON Panel (read-only, fetch registry)
(async function () {
  const PANEL_ID = 'zApiConPanel';

  function createPanel() {
    if (document.getElementById(PANEL_ID)) return;

    const panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.style.cssText = [
      'position: fixed',
      'right: 12px',
      'bottom: 12px',
      'width: 360px',
      'max-height: 60vh',
      'overflow-y: auto',
      'background: rgba(18, 22, 30, 0.9)',
      'color: #e6e8ee',
      'font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      'font-size: 12px',
      'border-radius: 12px',
      'padding: 10px 12px',
      'box-shadow: 0 8px 30px rgba(0,0,0,0.4)',
      'z-index: 9999',
    ].join(';');

    panel.innerHTML = [
      '<div style="font-weight:600; margin-bottom:8px;">',
      'Z-API Conductor — Source Status',
      '</div>',
      '<div id="zApiConContent"></div>',
    ].join('');

    document.body.appendChild(panel);
  }

  async function loadRegistry() {
    try {
      const res = await fetch('/core-engine/api_conductor/registry/api_registry.json');
      return await res.json();
    } catch {
      return null;
    }
  }

  function render(registry) {
    const container = document.getElementById('zApiConContent');
    if (!container) return;
    if (!registry) {
      container.textContent = 'Registry unavailable.';
      return;
    }

    const rows = [];
    Object.entries(registry).forEach(([groupName, group]) => {
      if (groupName === '_meta') return;
      rows.push(
        `<div style="margin-top:8px; font-weight:600; opacity:0.8;">${groupName.replace(/_/g, ' ').toUpperCase()}</div>`
      );
      Object.entries(group).forEach(([name, cfg]) => {
        const statusColor =
          cfg.status === 'ok' || cfg.status === 'ok_with_normalization'
            ? '#6ee7a8'
            : cfg.status === 'manual_required'
              ? '#facc15'
              : cfg.status === 'degraded'
                ? '#fb7185'
                : '#94a3b8';

        rows.push(`
          <div style="display:flex; justify-content:space-between; margin:2px 0;">
            <span>${name}</span>
            <span style="color:${statusColor}">${cfg.status}</span>
          </div>
          <div style="opacity:0.6; font-size:11px; margin-left:6px;">
            tier ${cfg.tier}${cfg.notes ? ' · ' + cfg.notes : ''}
          </div>
        `);
      });
    });

    container.innerHTML = rows.join('');
  }

  window.ZApiConPanel = {
    async init() {
      createPanel();
      const registry = await loadRegistry();
      render(registry);
      console.info('[Z-APICON] Panel initialized');
    },
  };
})();
