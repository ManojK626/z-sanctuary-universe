// Z: core/z_cycle_indicator_badge.js
// Edge badge for indication cycles posture.
(function () {
  const badgeEl = document.getElementById('zCycleIndicatorBadge');
  if (!badgeEl) return;
  const GUARD_METRICS_KEY = 'zUiGuardMetrics';

  async function loadJson(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  function applyTone(attitude) {
    const v = String(attitude || '').toLowerCase();
    badgeEl.classList.remove('edge-status-good', 'edge-status-warn', 'edge-status-bad');
    if (v === 'calm') {
      badgeEl.classList.add('edge-status-good');
      return;
    }
    if (v === 'caution' || v === 'drift') {
      badgeEl.classList.add('edge-status-warn');
      return;
    }
    badgeEl.classList.add('edge-status-bad');
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
    const latest = summary?.latest_cycle || {};
    const attitude = String(latest.attitude || 'unknown').toLowerCase();
    const streak = Number(summary?.calm_streak || 0);
    const totals = readGuardMetrics()?.totals || {};
    const blockedSignals =
      Number(totals.ghost_click_blocked || 0) +
      Number(totals.stale_click_blocked || 0) +
      Number(totals.drag_misfire_blocked || 0);
    badgeEl.textContent = `Cycles: ${attitude} · S${streak}`;
    badgeEl.title = `Indication cycles: attitude=${attitude}, calm_streak=${streak}, total=${summary?.total_cycles ?? 0}, input_guard_blocks=${blockedSignals}`;
    applyTone(attitude);
  }

  async function refresh() {
    try {
      const summary = await loadJson('/data/reports/z_cycle_indicator.json');
      render(summary);
    } catch {
      badgeEl.textContent = 'Cycles: unavailable';
      badgeEl.classList.remove('edge-status-good', 'edge-status-warn');
      badgeEl.classList.add('edge-status-bad');
    }
  }

  refresh();
  setInterval(refresh, 60_000);
})();
