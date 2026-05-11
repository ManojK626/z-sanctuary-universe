// Z: core/z_cycle_indicator_panel.js
// Read-only indication cycles panel (stabilization posture).
(function () {
  const body = document.getElementById('zCycleIndicatorBody');
  if (!body) return;
  const GUARD_METRICS_KEY = 'zUiGuardMetrics';

  function badgeClass(attitude) {
    const v = String(attitude || '').toLowerCase();
    if (v === 'calm') return 'z-autorun-ok';
    if (v === 'caution' || v === 'drift') return 'z-autorun-warn';
    if (v === 'blocked') return 'z-autorun-critical';
    return 'z-autorun-unknown';
  }

  async function loadJson(url) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  function readGuardMetrics() {
    try {
      const raw = localStorage.getItem(GUARD_METRICS_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function render(summary) {
    if (!summary) {
      body.innerHTML = '<div class="z-muted">Cycle indicator: report will appear after stabilization cycle runs.</div>';
      return;
    }

    const latest = summary.latest_cycle || {};
    const attitude = latest.attitude || 'unknown';
    const recent = Array.isArray(summary.recent_attitudes) ? summary.recent_attitudes : [];
    const guardMetrics = readGuardMetrics();
    const totals = guardMetrics?.totals || {};
    const blockedSignals =
      Number(totals.ghost_click_blocked || 0) +
      Number(totals.stale_click_blocked || 0) +
      Number(totals.drag_misfire_blocked || 0);
    const quickActionsUsed =
      Number(totals.quick_action_collapse || 0) +
      Number(totals.quick_action_minimize || 0) +
      Number(totals.quick_action_maximize || 0) +
      Number(totals.quick_action_popout || 0);
    const singleTapReveal = Number(totals.single_tap_reveal || 0);

    const pollAt = new Date().toLocaleString();
    body.innerHTML = `
      <div>
        Attitude:
        <span class="z-autorun-badge ${badgeClass(attitude)}">${attitude}</span>
      </div>
      <div class="z-muted">Dashboard poll: ${pollAt}</div>
      <div class="z-muted">Report: ${summary.generated_at || '—'}</div>
      <div>Total cycles: <b>${summary.total_cycles ?? '—'}</b> · Calm streak: <b>${summary.calm_streak ?? 0}</b></div>
      <div>Calm rate: <b>${summary.calm_rate_pct ?? 0}%</b></div>
      <div>State: <b>${latest.operating_state || 'unknown'}</b></div>
      <div>Input guard blocks: <b>${blockedSignals}</b> · Quick actions: <b>${quickActionsUsed}</b></div>
      <div class="z-muted">Single-tap reveals: ${singleTapReveal} · Metrics updated: ${guardMetrics?.updated_at || '—'}</div>
      <div class="z-muted" style="margin-top:0.25rem;">Recent: ${recent.length ? recent.join(' → ') : '—'}</div>
      <div class="z-muted" style="margin-top:0.25rem;">
        <a href="/data/reports/z_cycle_indicator.json" target="_blank">Open report JSON</a>
      </div>
    `;
  }

  async function refresh() {
    const summary = await loadJson('/data/reports/z_cycle_indicator.json');
    render(summary);
  }

  refresh();
  setInterval(refresh, 60_000);
})();
