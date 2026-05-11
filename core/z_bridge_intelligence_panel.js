(function () {
  const REPORT_PATH = '/data/reports/z_bridge_intelligence_summary.json';
  const bodyEl = document.getElementById('zBridgeIntelligenceBody');
  const badgeEl = document.getElementById('zBridgeIntelligenceBadge');

  function toneFrom(payload) {
    if (!payload) return 'warn';
    if ((payload.allocations_blocked || 0) > 0 || (payload.users_flagged || 0) > 0) return 'warn';
    if ((payload.allocations_reduced || 0) > 0) return 'good';
    return 'good';
  }

  function setBadgeTone(tone) {
    if (!badgeEl) return;
    badgeEl.classList.remove('edge-status-good', 'edge-status-warn', 'edge-status-bad');
    badgeEl.classList.add(tone === 'good' ? 'edge-status-good' : tone === 'warn' ? 'edge-status-warn' : 'edge-status-bad');
  }

  function render(payload) {
    if (bodyEl) {
      bodyEl.innerHTML = `
        <div>Users ${payload.users_total ?? '--'} · Flagged ${payload.users_flagged ?? '--'} · Heavy ${payload.users_heavy_daily ?? '--'}</div>
        <div>Success ${payload.allocations_success ?? '--'} · Reduced ${payload.allocations_reduced ?? '--'} · Blocked ${payload.allocations_blocked ?? '--'}</div>
        <div>Priority avg ${payload.priority_score_avg != null ? payload.priority_score_avg.toFixed(2) : '--'} (min ${payload.priority_score_min ?? '--'} / max ${payload.priority_score_max ?? '--'})</div>
      `;
    }
    if (badgeEl) {
      badgeEl.textContent = `Bridge IQ: ${payload.priority_score_avg != null ? payload.priority_score_avg.toFixed(2) : '--'}`;
      setBadgeTone(toneFrom(payload));
    }
  }

  async function refresh() {
    try {
      const res = await fetch(REPORT_PATH, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = await res.json();
      render(payload);
    } catch {
      if (bodyEl) {
        bodyEl.innerHTML = '<div class="z-muted">Run task <b>Z: Bridge Intelligence Summary</b>.</div>';
      }
      if (badgeEl) {
        badgeEl.textContent = 'Bridge IQ: --';
        setBadgeTone('warn');
      }
    }
  }

  refresh();
  setInterval(refresh, 60000);
})();
