// Z: core\module_health.js
(function () {
  const manifestUrl = 'data/Z_module_manifest.json';
  function getBadgeColor(status) {
    if (status === 'imported') return '#3bffb5';
    if (status === 'planned') return '#7f7f7f';
    if (status === 'in-review') return '#fee58b';
    if (status === 'blocked') return '#ff6f6f';
    return '#9ea8c8';
  }
  function applyStatuses(modules) {
    const map = new Map(modules.map((entry) => [entry.id, entry]));
    document.querySelectorAll('.dashboard-edge-bar button[data-module]').forEach((button) => {
      const moduleId = button.dataset.module;
      let badge = button.querySelector('.edge-status-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'edge-status-badge';
        button.appendChild(badge);
      }
      const entry = map.get(moduleId);
      if (!entry) {
        badge.textContent = 'unknown';
        badge.style.background = '#555';
        badge.style.opacity = '0.6';
        return;
      }
      badge.textContent = entry.status;
      badge.style.background = getBadgeColor(entry.status);
      badge.style.opacity = '0.9';
    });
  }
  function refreshStatuses() {
    fetch(manifestUrl)
      .then((r) =>
        r.ok ? r.json() : fetch('data/z_module_manifest.json').then((res) => res.json())
      )
      .then((data) => applyStatuses(data.ZModules || data.modules || []))
      .catch(() => {});
  }
  refreshStatuses();
  setInterval(refreshStatuses, 90000);
})();
