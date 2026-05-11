// Z: core/z_module_health_panel.js
// Populates Z Module Health panel from module registry audit (Online / Active / Total).
(function () {
  const onlineEl = document.getElementById('zModulesOnline');
  const activeEl = document.getElementById('zModulesActive');
  const totalEl = document.getElementById('zModulesTotal');
  const listEl = document.getElementById('zModuleList');
  if (!onlineEl && !totalEl) return;

  async function refresh() {
    try {
      const res = await fetch('/data/reports/z_module_registry_audit.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('not found');
      const audit = await res.json();
      const total = Number(audit.total) || 0;
      const counts = audit.status_counts || {};
      const ready = Number(counts.ready) || 0;
      const imported = Number(counts.imported) || 0;
      const online = ready + imported;
      if (totalEl) totalEl.textContent = String(total);
      if (onlineEl) onlineEl.textContent = String(online);
      if (activeEl) activeEl.textContent = String(online);
      if (listEl && listEl.innerHTML === '' && total > 0) {
        listEl.innerHTML = '<div class="z-muted">From registry audit. Open Module Registry panel for list.</div>';
      }
    } catch {
      if (totalEl) totalEl.textContent = '0';
      if (onlineEl) onlineEl.textContent = '0';
      if (activeEl) activeEl.textContent = '0';
    }
  }

  refresh();
  setInterval(refresh, 60_000);
})();
