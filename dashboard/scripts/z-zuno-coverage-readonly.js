// Z: dashboard/scripts/z-zuno-coverage-readonly.js
// Read-only cockpit: latest hub coverage audit + Phase 3 plan metadata.
// Expects #zZunoCoverageCockpit and optional data-z-reports-base (default ../../data/reports from dashboard/Html/).
(function () {
  function esc(x) {
    return String(x ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fmtHist(h) {
    if (!h || typeof h !== 'object') return '—';
    return Object.entries(h)
      .map(([k, v]) => `${esc(k)}: ${esc(v)}`)
      .join(' · ');
  }

  async function run() {
    const el = document.getElementById('zZunoCoverageCockpit');
    if (!el) return;
    const baseRaw = el.getAttribute('data-z-reports-base') || '../../data/reports';
    const base = baseRaw.replace(/\/+$/, '') + '/';
    el.innerHTML =
      '<p class="z-muted" style="font-size:0.78rem;margin:0">Loading hub coverage audit…</p>';

    let audit = null;
    let plan = null;
    try {
      const [ra, rp] = await Promise.all([
        fetch(base + 'z_zuno_coverage_audit.json', { cache: 'no-store' }),
        fetch(base + 'z_zuno_phase3_completion_plan.json', { cache: 'no-store' })
      ]);
      if (ra.ok) audit = await ra.json();
      if (rp.ok) plan = await rp.json();
    } catch (_) {
      el.innerHTML =
        '<p class="z-muted" style="font-size:0.78rem;margin:0">Coverage JSON not reachable. Serve hub from repo root (e.g. <code>npx http-server . -p 5502</code>) per dashboard README.</p>';
      return;
    }

    if (!audit || !audit.summary_counts) {
      el.innerHTML =
        '<p class="z-muted" style="font-size:0.78rem;margin:0">Run <code>npm run zuno:coverage</code> from hub root to create <code>data/reports/z_zuno_coverage_audit.json</code>.</p>';
      return;
    }

    const c = audit.summary_counts;
    const hist = audit.ancillary && audit.ancillary.master_registry_status_histogram;
    const when = esc(audit.generated_at);
    const planWhen = plan && plan.generated_at ? esc(plan.generated_at) : '— (run npm run zuno:phase3-plan)';

    const rows = [
      ['FOUND_FULL', c.FOUND_FULL],
      ['FOUND_PARTIAL', c.FOUND_PARTIAL],
      ['MISSING', c.MISSING],
      ['DUPLICATE_OR_CONFLICT', c.DUPLICATE_OR_CONFLICT],
      ['NEEDS_SAFETY_REVIEW', c.NEEDS_SAFETY_REVIEW],
      ['NEEDS_DECISION', c.NEEDS_DECISION]
    ];
    const countsHtml = rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:2px 8px 2px 0;opacity:0.9">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`
      )
      .join('');

    el.innerHTML =
      '<div style="font-size:0.82rem;border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:0.5rem 0.65rem;background:rgba(0,0,0,0.22)">' +
      '<strong>Z-Zuno coverage (read-only)</strong>' +
      '<div class="z-muted" style="font-size:0.72rem;margin-top:0.15rem">Audit generated: ' +
      when +
      '</div>' +
      '<table style="margin-top:0.35rem;font-size:0.8rem;border-collapse:collapse">' +
      countsHtml +
      '</table>' +
      '<div class="z-muted" style="margin-top:0.35rem;font-size:0.72rem;line-height:1.35">Registry posture (master): ' +
      fmtHist(hist) +
      '</div>' +
      '<div class="z-muted" style="margin-top:0.25rem;font-size:0.72rem">Phase 3 plan generated: ' +
      planWhen +
      '</div>' +
      '<div style="margin-top:0.45rem;font-size:0.72rem;line-height:1.45">' +
      '<a href="' +
      base +
      'z_zuno_coverage_audit.md" target="_blank" rel="noopener noreferrer">Coverage MD</a> · ' +
      '<a href="' +
      base +
      'z_zuno_coverage_audit.json" target="_blank" rel="noopener noreferrer">Coverage JSON</a> · ' +
      '<a href="' +
      base +
      'z_zuno_phase3_completion_plan.md" target="_blank" rel="noopener noreferrer">Phase 3 plan MD</a> · ' +
      '<a href="' +
      base +
      'z_zuno_phase3_completion_plan.json" target="_blank" rel="noopener noreferrer">Phase 3 plan JSON</a>' +
      '</div>' +
      '<p class="z-muted" style="margin:0.4rem 0 0;font-size:0.68rem;line-height:1.35">Read-only display — no fix/build controls. Deployment HOLD.</p>' +
      '</div>';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
