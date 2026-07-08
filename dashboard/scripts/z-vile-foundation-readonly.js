// Z-VILE-FOUNDATION-READINESS-1 — read-only Track A foundation card (no execution).
(function () {
  function esc(x) {
    return String(x ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function pill(label, tone) {
    var bg =
      tone === 'green'
        ? 'rgba(34,197,94,0.22)'
        : tone === 'yellow'
          ? 'rgba(251,191,36,0.18)'
          : tone === 'red'
            ? 'rgba(248,113,113,0.2)'
            : tone === 'hold'
              ? 'rgba(251,191,36,0.22)'
              : tone === 'blue'
                ? 'rgba(96,165,250,0.18)'
                : 'rgba(148,163,184,0.18)';
    var border =
      tone === 'green'
        ? 'rgba(34,197,94,0.45)'
        : tone === 'yellow'
          ? 'rgba(251,191,36,0.4)'
          : tone === 'red'
            ? 'rgba(248,113,113,0.45)'
            : tone === 'hold'
              ? 'rgba(251,191,36,0.5)'
              : tone === 'blue'
                ? 'rgba(96,165,250,0.45)'
                : 'rgba(148,163,184,0.35)';
    return (
      '<span class="z-vile-pill" style="background:' +
      bg +
      ';border-color:' +
      border +
      '">' +
      esc(label) +
      '</span>'
    );
  }

  function signalTone(s) {
    var u = String(s || '').toLowerCase();
    if (u === 'green') return 'green';
    if (u === 'yellow') return 'yellow';
    if (u === 'red') return 'red';
    if (u === 'hold') return 'hold';
    if (u === 'blue') return 'blue';
    return 'neutral';
  }

  function row(k, vHtml) {
    return (
      '<tr><td class="z-vile-k">' + esc(k) + '</td><td class="z-vile-v">' + vHtml + '</td></tr>'
    );
  }

  function reasonList(items) {
    if (!items || !items.length) return '<span class="z-vile-muted">—</span>';
    return (
      '<ul class="z-vile-reasons">' +
      items
        .map(function (r) {
          return '<li>' + esc(r) + '</li>';
        })
        .join('') +
      '</ul>'
    );
  }

  function rootPrefix() {
    var el = document.getElementById('zVileFoundationMount');
    var base = (el && el.getAttribute('data-z-reports-base')) || '../../data/reports';
    return base.replace(/\/+$/, '');
  }

  function docHref(rel) {
    return '../../' + String(rel || '').replace(/^\/+/, '');
  }

  async function run() {
    var el = document.getElementById('zVileFoundationMount');
    if (!el) return;

    el.innerHTML = '<p class="z-vile-muted">Loading foundation readiness…</p>';
    var base = rootPrefix();

    try {
      var r = await fetch(base + '/z_vile_foundation_readiness_status.json', { cache: 'no-store' });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      var data = await r.json();

      var pkgRows = (data.packages || [])
        .map(function (p) {
          return (
            '<tr>' +
            '<td>' +
            esc(p.npm_name) +
            '</td>' +
            '<td>' +
            pill(String(p.signal).toUpperCase(), signalTone(p.signal)) +
            '</td>' +
            '<td>' +
            (p.on_main ? '✓' : '—') +
            '</td>' +
            '<td>' +
            pill(p.documentation.status.toUpperCase(), signalTone(p.documentation.status)) +
            '</td>' +
            '<td>' +
            esc(
              p.tests.receipt_pass != null
                ? p.tests.receipt_pass + '/' + p.tests.expected
                : 'receipt'
            ) +
            '</td>' +
            '</tr>'
          );
        })
        .join('');

      var next = data.recommended_next_human_action || {};
      var pipeline = data.readiness_pipeline || {};
      var ledger = data.foundation_evidence_ledger || [];

      var pipelineHtml = (pipeline.stages || [])
        .map(function (s) {
          var active = s.id === pipeline.current_stage_id;
          var st = (pipeline.stage_status && pipeline.stage_status[s.id]) || '';
          return (
            '<div class="z-vile-pipe-step' +
            (active ? ' z-vile-pipe-step--here' : '') +
            '">' +
            '<span class="z-vile-pipe-label">' +
            esc(s.label) +
            '</span>' +
            (active ? '<span class="z-vile-pipe-here">◄ here</span>' : '') +
            (st ? '<span class="z-vile-pipe-st">' + esc(st) + '</span>' : '') +
            '</div>'
          );
        })
        .join('<div class="z-vile-pipe-arrow">▼</div>');

      var ledgerRows = ledger
        .map(function (row) {
          return (
            '<tr>' +
            '<td>' +
            esc(row.package_short_name) +
            '</td>' +
            '<td><code>' +
            esc(row.branch) +
            '</code></td>' +
            '<td>' +
            esc(row.review_status) +
            '</td>' +
            '<td>' +
            esc(row.merge_status) +
            '</td>' +
            '<td>' +
            pill(row.merge_hold, row.merge_hold === 'Active' ? 'hold' : 'yellow') +
            '</td>' +
            '<td>' +
            esc(row.evidence_summary) +
            '</td>' +
            '</tr>'
          );
        })
        .join('');

      var whyRows = ledger
        .map(function (row) {
          return '<li><strong>' + esc(row.package_short_name) + ':</strong> ' + esc(row.not_merged_reason) + '</li>';
        })
        .join('');

      var mainNote = (data.summary && data.summary.packages_on_main_note) || '';

      el.innerHTML =
        '<div class="z-vile-root">' +
        '<div class="z-vile-header">' +
        '<h3>🏗️ Track A — VILE Foundation Readiness</h3>' +
        pill(
          'P0 · ' + String(data.overall_signal || 'UNKNOWN').toUpperCase(),
          signalTone(data.overall_signal)
        ) +
        '</div>' +
        '<p class="z-vile-law">Read-only engineering counterpart to Universe Census. No merge, deploy, or test execution from this panel.</p>' +
        '<div class="z-vile-panel">' +
        '<h4>📊 Readiness pipeline</h4>' +
        '<p class="z-vile-muted"><strong>Stage:</strong> ' +
        esc(pipeline.current_stage_label || '—') +
        '</p>' +
        '<div class="z-vile-pipeline">' +
        pipelineHtml +
        '</div>' +
        '<p class="z-vile-pipeline-why">' +
        esc(pipeline.why_waiting || '') +
        '</p>' +
        '</div>' +
        '<div class="z-vile-panel">' +
        '<h4>📜 Foundation evidence ledger</h4>' +
        '<p class="z-vile-muted">' +
        esc(mainNote) +
        '</p>' +
        '<div class="z-vile-table-wrap"><table class="z-vile-table">' +
        '<thead><tr><th>Package</th><th>Branch</th><th>Review</th><th>Merge</th><th>Hold</th><th>Evidence</th></tr></thead>' +
        '<tbody>' +
        ledgerRows +
        '</tbody></table></div>' +
        '<ul class="z-vile-reasons">' +
        whyRows +
        '</ul>' +
        '</div>' +
        '<div class="z-vile-grid">' +
        '<div class="z-vile-panel">' +
        '<h4>📦 VILE Packages 1–3</h4>' +
        '<div class="z-vile-table-wrap"><table class="z-vile-table">' +
        '<thead><tr><th>Package</th><th>Status</th><th>Main</th><th>Docs</th><th>Tests</th></tr></thead>' +
        '<tbody>' +
        pkgRows +
        '</tbody></table></div>' +
        reasonList((data.packages && data.packages[0] && data.packages[0].reasons) || []) +
        '</div>' +
        '<div class="z-vile-panel">' +
        '<h4>🛡️ zuno-drp</h4>' +
        '<table class="z-vile-kv">' +
        row('Status', pill(data.zuno_drp.status_label, signalTone(data.zuno_drp.signal))) +
        row(
          'Charter',
          data.zuno_drp.charter_present ? pill('present', 'green') : pill('missing', 'red')
        ) +
        row(
          'Package',
          data.zuno_drp.package_present
            ? pill('folder exists', 'yellow')
            : pill('not started', 'blue')
        ) +
        '</table>' +
        reasonList(data.zuno_drp.reasons) +
        '</div>' +
        '</div>' +
        '<div class="z-vile-grid">' +
        '<div class="z-vile-panel">' +
        '<h4>✅ Verification</h4>' +
        '<table class="z-vile-kv">' +
        row(
          'Signal',
          pill(String(data.verification.signal).toUpperCase(), signalTone(data.verification.signal))
        ) +
        row(
          'Documented tests',
          esc(data.verification.documented_test_total + '/' + data.verification.expected_test_total)
        ) +
        row(
          'Integration docs',
          data.verification.integration_docs_present
            ? pill('present', 'green')
            : pill('incomplete', 'red')
        ) +
        '</table>' +
        reasonList(data.verification.reasons) +
        '</div>' +
        '<div class="z-vile-panel">' +
        '<h4>🔒 Governance · 🐢 Posture</h4>' +
        '<table class="z-vile-kv">' +
        row(
          'Merge Hold',
          data.merge_hold_status.active ? pill('ACTIVE', 'hold') : pill('review', 'yellow')
        ) +
        row('Turtle Mode', pill(data.turtle_mode_status.label, 'hold')) +
        row(
          'DRP referenced',
          data.governance.drp_referenced ? pill('yes', 'green') : pill('no', 'red')
        ) +
        '</table>' +
        reasonList(data.governance.reasons) +
        '</div>' +
        '</div>' +
        '<div class="z-vile-panel z-vile-next">' +
        '<h4>🧭 Recommended next human action</h4>' +
        '<p><strong>' +
        esc(next.priority || 'P0') +
        ':</strong> ' +
        esc(next.action || 'Review Track A foundation') +
        '</p>' +
        '<p class="z-vile-muted"><em>Derived from registry — not invented. Human gate required.</em></p>' +
        '</div>' +
        '<p class="z-vile-links">' +
        '<a href="' +
        esc(docHref('docs/vile/TRACK_A_VILE_FOUNDATION_INTEGRATION.md')) +
        '">Track A mission</a> · ' +
        '<a href="' +
        esc(docHref('docs/vile/PHASE_2A_FOUNDATION_INTEGRATION_REPORT.md')) +
        '">Integration report</a> · ' +
        '<a href="' +
        esc(base + '/z_vile_foundation_readiness_status.md') +
        '">Full readiness report</a>' +
        '</p>' +
        '</div>';
    } catch (err) {
      el.innerHTML =
        '<p class="z-vile-muted">Foundation readiness not loaded. Run <code>npm run z:vile:foundation:readiness</code> and serve hub over HTTP. ' +
        esc(err.message) +
        '</p>';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
