/**
 * OMNAI core simulation reports — read-only overlay for AMK main control.
 * Loads JSON receipts from ../../data/reports (same-origin hub serve).
 */
(function () {
  function rootPrefix() {
    var path = String(window.location.pathname || '').replace(/\\/g, '/');
    if (path.indexOf('/Html/shadow/') !== -1) return '../../..';
    return '../..';
  }

  function hubHref(rel) {
    var r = String(rel || '').replace(/\\/g, '/');
    return rootPrefix() + (r.startsWith('/') ? r : '/' + r);
  }

  function esc(x) {
    return String(x ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function pillClass(plan) {
    var s = String(plan || '').toUpperCase();
    if (s === 'GREEN') return 'amk-map-pill amk-map-pill--green';
    if (s === 'YELLOW') return 'amk-map-pill amk-map-pill--yellow';
    if (s === 'RED') return 'amk-map-pill amk-map-pill--red';
    return 'amk-map-pill amk-map-pill--neutral';
  }

  async function fetchJson(url) {
    var res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(String(res.status));
    return res.json();
  }

  async function safeFetch(rel) {
    try {
      return await fetchJson(hubHref(rel));
    } catch (_) {
      return null;
    }
  }

  function rowsFromHist(hist) {
    if (!hist || typeof hist !== 'object') return '';
    return Object.keys(hist)
      .map(function (k) {
        return (
          '<tr><td>' + esc(k) + '</td><td>' + esc(String(hist[k])) + '</td></tr>'
        );
      })
      .join('');
  }

  async function render() {
    var mount = document.getElementById('zOmnaiCoreReadonlyMount');
    if (!mount) return;

    var combo = await safeFetch('data/reports/z_omnai_core_engine_combo_summary.json');
    var tick = await safeFetch('data/reports/z_omnai_core_engine_tick_report.json');
    var overlay = await safeFetch('data/reports/z_omnai_core_engine_indicator_overlay.json');
    var matrixSummary = await safeFetch('data/reports/z_omnai_core_engine_matrix_summary.json');
    var matrixLegacy = await safeFetch('data/reports/z_omnai_core_engine_matrix_report.json');
    var matrix = matrixSummary || matrixLegacy;
    var chain = await safeFetch('data/reports/z_omnai_core_engine_chain_report.json');
    var manifest = await safeFetch('data/reports/z_omnai_core_engine_manifest_report.json');

    var rollupTick = tick && tick.rollup ? tick.rollup.planning_posture : 'UNKNOWN';
    var rollup = overlay && overlay.signal ? String(overlay.signal).toUpperCase() : rollupTick;
    var mtxN = matrix && matrix.matrix_executions != null ? matrix.matrix_executions : '—';
    var mfN = manifest && manifest.count != null ? manifest.count : '—';
    var chS = chain && chain.step_count != null ? chain.step_count : '—';

    var html =
      '<details class="amk-map-section" open data-amk-section="omnai_core"' +
      ' data-amk-category="docs_receipts">' +
      '<summary>OMNAI core simulation (deterministic receipts)</summary>' +
      '<div class="amk-map-section-body">' +
      '<p class="amk-map3-disclaimer" style="margin-top:0;font-size:0.85rem;color:var(--amk-muted,#94a3b8);">' +
      'Read-only summaries from npm run omnai:core:simulate — no fleets, APIs, Docker, deploy, billing, NAS, merges, secrets, or connectors here.' +
      '</p>' +
      '<p style="margin:0.35rem 0 0.5rem;"><span class="' +
      pillClass(rollup) +
      '">' +
      esc(String(rollup)) +
      '</span> Indicator overlay (or tick) · Matrix runs: ' +
      esc(String(mtxN)) +
      ' · Manifest scenarios: ' +
      esc(String(mfN)) +
      ' · Chain steps: ' +
      esc(String(chS)) +
      '</p>' +
      '<ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;">' +
      '<li><a href="' +
      esc(hubHref('data/reports/z_omnai_core_engine_tick_report.json')) +
      '">Tick JSON</a> · <a href="' +
      esc(hubHref('data/reports/z_omnai_core_engine_tick_report.md')) +
      '">Tick MD</a></li>' +
      '<li><a href="' +
      esc(hubHref('data/reports/z_omnai_core_engine_indicator_overlay.json')) +
      '">Indicator overlay JSON</a> · <a href="' +
      esc(hubHref('data/reports/z_omnai_core_engine_matrix_summary.json')) +
      '">Matrix summary JSON</a> · <a href="' +
      esc(hubHref('data/reports/z_omnai_core_engine_matrix_summary.md')) +
      '">Matrix summary MD</a> · <span style="opacity:0.85">full dump</span> <a href="' +
      esc(hubHref('data/reports/z_omnai_core_engine_matrix_report.full.json')) +
      '">.full.json (--matrix-full)</a></li>' +
      '<li><a href="' +
      esc(hubHref('data/reports/z_omnai_core_engine_chain_report.json')) +
      '">Chain JSON</a> · <a href="' +
      esc(hubHref('data/reports/z_omnai_core_engine_chain_report.md')) +
      '">Chain MD</a></li>' +
      '<li><a href="' +
      esc(hubHref('data/reports/z_omnai_core_engine_manifest_report.json')) +
      '">Manifest batch JSON</a></li>' +
      (combo
        ? '<li><a href="' +
          esc(hubHref('data/reports/z_omnai_core_engine_combo_summary.json')) +
          '">Combo rollup JSON (--all)</a></li>'
        : '') +
      '</ul>';

    if (matrix && matrix.histograms && matrix.histograms.planning_posture) {
      html +=
        '<details style="margin-top:0.65rem;"><summary style="cursor:pointer;font-size:0.88rem;">Matrix posture histogram</summary>' +
        '<table style="font-size:0.85rem;border-collapse:collapse;width:100%;margin-top:0.35rem"><thead><tr><th style="text-align:left;border-bottom:1px solid rgba(148,163,184,0.35)">Posture</th><th style="text-align:right;border-bottom:1px solid rgba(148,163,184,0.35)">Count</th></tr></thead><tbody>' +
        rowsFromHist(matrix.histograms.planning_posture) +
        '</tbody></table>' +
        '</details>';
    }

    html +=
      '<p style="margin:0.6rem 0 0;font-size:0.8rem;color:var(--amk-muted,#94a3b8);">' +
      'Recipes: npm run omnai:core:simulate · npm run omnai:core:matrix · npm run omnai:core:matrix:full · npm run omnai:core:all' +
      '</p>' +
      '</div></details>';

    mount.innerHTML = html;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
