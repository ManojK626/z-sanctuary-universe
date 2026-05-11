// Z: core/z_formula_posture_panel.js
// Reads formula_posture from guardian report (DRP-reinforced posture for ecosystem services).
(function () {
  const GUARDIAN_PATH = '/data/reports/z_guardian_report.json';
  const bodyEl = document.getElementById('zFormulaPostureBody');
  const badgeEl = document.getElementById('zFormulaPostureBadge');
  const STALE_MINUTES = 240;

  function appendIndicatorLog(panel, ok, detail) {
    const root = window;
    if (!root.ZIndicatorLog) root.ZIndicatorLog = [];
    root.ZIndicatorLog.push({ ts: new Date().toISOString(), panel, ok: Boolean(ok), detail });
    if (root.ZIndicatorLog.length > 200) root.ZIndicatorLog.shift();
  }

  function minutesSince(iso) {
    const t = Date.parse(String(iso || ''));
    if (Number.isNaN(t)) return null;
    return Math.floor((Date.now() - t) / 60000);
  }

  function freshnessBadge(ageMin) {
    if (ageMin === null) return '<span class="z-autorun-badge z-autorun-unknown">unknown</span>';
    if (ageMin <= STALE_MINUTES) return `<span class="z-autorun-badge z-autorun-ok">${ageMin}m</span>`;
    if (ageMin <= STALE_MINUTES * 2) return `<span class="z-autorun-badge z-autorun-warn">${ageMin}m</span>`;
    return `<span class="z-autorun-badge z-autorun-critical">${ageMin}m</span>`;
  }

  function setBadgeTone(tone) {
    if (!badgeEl) return;
    badgeEl.classList.remove('edge-status-good', 'edge-status-warn', 'edge-status-bad');
    badgeEl.classList.add(tone === 'good' ? 'edge-status-good' : tone === 'warn' ? 'edge-status-warn' : 'edge-status-bad');
  }

  function toneFromPosture(posture) {
    const p = String(posture || '').toLowerCase();
    if (p === 'green') return 'good';
    if (p === 'watch') return 'warn';
    return 'bad';
  }

  async function loadJson(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  function render(fp, generatedAt) {
    if (!bodyEl) return;
    const posture = String(fp?.posture || 'unknown').toUpperCase();
    const s = fp?.scores || {};
    const interp = fp?.interpretation || {};
    const tone = toneFromPosture(fp?.posture);

    if (badgeEl) {
      badgeEl.textContent = `Ω: ${posture}`;
      badgeEl.title = `Omega ${s.omega_index ?? '--'} · DRP ${s.drp_filter ?? '--'} · Z-UI ${s.z_ui_readiness ?? '--'}`;
      setBadgeTone(tone);
    }

    const labelClass =
      tone === 'good' ? 'z-autorun-ok' : tone === 'warn' ? 'z-autorun-warn' : 'z-autorun-critical';

    bodyEl.innerHTML = `
      <div><span class="z-autorun-badge ${labelClass}">POSTURE ${posture}</span></div>
      <div>Omega index: <strong>${s.omega_index ?? '--'}</strong> · DRP filter: <strong>${s.drp_filter ?? '--'}</strong> · Z-UI readiness: <strong>${s.z_ui_readiness ?? '--'}</strong></div>
      <div class="z-muted" style="margin-top:0.25rem;">K ${s.K ?? '--'} · D ${s.D ?? '--'} · P ${s.P ?? '--'} · E ${s.E ?? '--'} · R ${s.R ?? '--'}</div>
      <div style="margin-top:0.35rem;"><strong>Governance</strong>: ${interp.governance || '--'}</div>
      <div><strong>Media</strong>: ${interp.media || '--'}</div>
      <div><strong>Business</strong>: ${interp.business || '--'}</div>
      <div><strong>Q&amp;A / Criticism AI</strong>: ${interp.qa_criticism_ai || '--'}</div>
      <div class="z-muted" style="margin-top:0.25rem;">Guardian generated: ${generatedAt || '--'} · age ${freshnessBadge(minutesSince(generatedAt))}</div>
      <div class="z-muted" style="margin-top:0.35rem;font-size:0.78rem;">Source: data/reports/z_guardian_report.json · Run <code>npm run guardian:report</code> after freshness.</div>
    `;
    appendIndicatorLog('z_formula_posture_panel', true, `posture=${posture}`);
  }

  async function refresh() {
    try {
      const guardian = await loadJson(GUARDIAN_PATH);
      const fp = guardian?.formula_posture;
      if (!fp) throw new Error('missing_formula_posture');
      render(fp, guardian?.generated_at);
    } catch {
      if (bodyEl) {
        bodyEl.innerHTML =
          '<div class="z-muted">Run <code>npm run freshness:refresh</code> then <code>npm run guardian:report</code> to populate formula posture.</div>';
      }
      if (badgeEl) {
        badgeEl.textContent = 'Ω: --';
        setBadgeTone('warn');
      }
      appendIndicatorLog('z_formula_posture_panel', false, 'load_failed');
    }
  }

  refresh();
  setInterval(refresh, 60_000);
})();
