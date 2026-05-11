(function () {
  const body = document.getElementById('zErrorBudgetBody');
  if (!body) return;

  function formatSeconds(value) {
    if (!Number.isFinite(value)) return '0s';
    const seconds = Math.max(0, Math.round(value));
    if (seconds < 60) return seconds + 's';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + 'm';
    const hours = Math.floor(minutes / 60);
    const remMinutes = minutes % 60;
    return hours + 'h ' + remMinutes + 'm';
  }

  function renderProfile(profile) {
    const lines = [];
    lines.push('<div class="z-section-title">' + profile.profile + '</div>');
    lines.push(
      '<div class="z-muted">Status: ' +
        String(profile.overall_status || 'unknown').toUpperCase() +
        '</div>'
    );
    for (const window of profile.windows) {
      lines.push(
        '<div class="z-error-budget-window">' +
          '<strong>' +
          window.window_days +
          'd</strong> · ' +
          window.status.toUpperCase() +
          ' · Remaining ' +
          formatSeconds(window.remaining_downtime_seconds) +
          '</div>'
      );
    }
    lines.push('<hr />');
    return lines.join('\n');
  }

  async function load() {
    try {
      const response = await fetch('/data/reports/z_error_budget.json?_=' + Date.now(), {
        cache: 'no-store',
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const report = await response.json();
      const status = String(report?.overall_status || 'unknown').toUpperCase();
      const summary = [
        '<div class="z-section-title">Overall</div>',
        '<div class="z-muted">Status: ' + status + '</div>',
        '<div class="z-muted">Profiles: ' + (report?.profiles?.length || 0) + '</div>',
      ];
      const profileMarkup = (report?.profiles || []).map(renderProfile).join('\n');
      const pollAt = new Date().toLocaleString();
      body.innerHTML = `<div class="z-muted">Dashboard poll: ${pollAt}</div>${summary.join(
        ''
      )}<div class="z-error-budget-profiles">${profileMarkup}</div>`;
    } catch (error) {
      body.innerHTML = '<div class="z-muted">Error budget: run SLO/error-budget task to generate report.</div>';
      console.debug('z_error_budget_panel:', error?.message);
    }
  }

  load();
  setInterval(load, 60000);
})();
