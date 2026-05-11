// Z: core\z_formula_registry_panel.js
// Private Formula Registry Panel (read-only)
(function () {
  const panel = document.getElementById('zFormulaRegistryPanel');
  if (!panel) return;

  const listEl = document.getElementById('zFormulaRegistryList');
  const statusEl = document.getElementById('zFormulaRegistryStatus');
  const refreshBtn = document.getElementById('zFormulaRegistryRefresh');
  const openBtn = document.getElementById('zFormulaRegistryOpen');
  const govChip = document.getElementById('zGovFormulaVault');

  function render(registry) {
    if (!listEl) return;
    listEl.innerHTML = '';
    if (!registry || !registry.formulas || registry.formulas.length === 0) {
      listEl.textContent = 'No formulas registered.';
      return;
    }
    registry.formulas.forEach((formula) => {
      const row = document.createElement('div');
      row.className = 'z-formula-row';
      row.textContent = `${formula.id} — ${formula.name || 'Formula'} (${formula.exposure || 'internal'})`;
      listEl.appendChild(row);
    });
  }

  async function loadRegistry() {
    if (statusEl) statusEl.textContent = 'Loading…';
    try {
      const resp = await fetch('rules/Z_FORMULA_REGISTRY.json', { cache: 'no-store' });
      if (!resp.ok) throw new Error('Registry unavailable');
      const registry = await resp.json();
      render(registry);
      const state = registry.status || 'internal-only';
      if (statusEl) statusEl.textContent = `Status: ${state}`;
      if (govChip) {
        govChip.textContent = state;
        govChip.className =
          state === 'internal-only' ? 'z-badge z-risk-low' : 'z-badge z-risk-unknown';
      }
    } catch (err) {
      if (statusEl) statusEl.textContent = 'Status: unavailable';
      if (govChip) {
        govChip.textContent = 'unavailable';
        govChip.className = 'z-badge z-risk-high';
      }
      render(null);
    }
  }

  refreshBtn?.addEventListener('click', loadRegistry);
  openBtn?.addEventListener('click', () => {
    window.open('rules/Z_FORMULA_REGISTRY.json', '_blank', 'noopener,noreferrer');
  });
  loadRegistry();

  window.ZFormulaRegistryPanel = { refresh: loadRegistry };
})();
