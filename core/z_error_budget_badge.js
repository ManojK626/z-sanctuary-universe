(function () {
  const badgeEl = document.getElementById('zErrorBudgetBadge');
  if (!badgeEl) return;

  function tone(status) {
    const normalized = String(status || 'unknown').toLowerCase();
    badgeEl.classList.remove('edge-status-good', 'edge-status-warn', 'edge-status-bad');
    if (normalized === 'green') badgeEl.classList.add('edge-status-good');
    else if (normalized === 'warn') badgeEl.classList.add('edge-status-warn');
    else badgeEl.classList.add('edge-status-bad');
  }

  async function refresh() {
    try {
      const response = await fetch(`/data/reports/z_error_budget.json?ts=${Date.now()}`, {
        cache: 'no-store',
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      const status = String(payload?.overall_status || 'unknown').toUpperCase();
      badgeEl.textContent = `BUDGET: ${status}`;
      badgeEl.title = `Error budget overall status: ${status}`;
      tone(payload?.overall_status);
    } catch (error) {
      badgeEl.textContent = 'BUDGET: --';
      badgeEl.title = 'Error budget report unavailable';
      tone('unknown');
      console.debug('z_error_budget_badge:', error?.message);
    }
  }

  refresh();
  setInterval(refresh, 60000);
})();
