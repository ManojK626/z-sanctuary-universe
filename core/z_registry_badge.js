(function () {
  const paths = ['/data/Z_module_registry.json', '/core/data/Z_module_registry.json'];
  async function fetchRegistry() {
    for (const path of paths) {
      try {
        const res = await fetch(path, { cache: 'no-store' });
        if (!res.ok) continue;
        const data = await res.json();
        if (data && typeof data.completion_percent === 'number') {
          renderBadge(data);
          return data;
        }
      } catch (e) {
        /* ignore */
      }
    }
    renderBadge({ indicator: 'gray', completion_percent: 0, modules_completed: [] });
  }
  function renderBadge(state) {
    const badge = document.createElement('div');
    badge.id = 'z-registry-badge';
    badge.style.position = 'fixed';
    badge.style.top = '12px';
    badge.style.right = '12px';
    badge.style.zIndex = '9999';
    badge.style.padding = '6px 12px';
    badge.style.borderRadius = '20px';
    badge.style.background =
      state.indicator === 'green'
        ? 'rgba(45,255,146,0.9)'
        : state.indicator === 'yellow'
          ? 'rgba(255,196,0,0.95)'
          : 'rgba(128,128,128,0.9)';
    badge.style.color = '#050505';
    badge.style.fontWeight = '700';
    badge.style.fontFamily = 'monospace';
    badge.style.boxShadow = '0 0 12px rgba(0,0,0,0.6)';
    badge.innerHTML = `Z-Registry <b>${state.completion_percent ?? 0}%</b>`;
    badge.title = `Completed: ${state.completion_percent ?? 0}%\nModules: ${state.modules_completed?.join(', ') || 'none'}`;
    const existing = document.getElementById('z-registry-badge');
    if (existing) existing.replaceWith(badge);
    else document.body.appendChild(badge);
  }
  fetchRegistry();
})();
