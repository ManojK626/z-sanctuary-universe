/**
 * Z-LEGAL-BENCH-1 — Global Benchmark & Legal Readiness panel renderer.
 * Read-only presentation of static JSON. No scoring from user input, APIs, launch, or legal conclusions.
 */
(function (global) {
  function esc(x) {
    return String(x ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function rowModifier(signal) {
    var s = String(signal || '').toUpperCase();
    if (s === 'BLUE' || s === 'RED') return ' z-bench-row--needs-review';
    return '';
  }

  /**
   * @param {object|null} data — from z_legal_benchmark_readiness.json
   * @param {{ docHref: (rel: string) => string, pillClass: (sig: string) => string }} helpers
   * @returns {string} HTML fragment
   */
  function panelHtml(data, helpers) {
    var docHref = helpers && typeof helpers.docHref === 'function' ? helpers.docHref : function (r) { return String(r || ''); };
    var pillClass = helpers && typeof helpers.pillClass === 'function' ? helpers.pillClass : function () { return 'amk-ind-pill amk-ind-pill--unknown'; };

    if (!data || typeof data !== 'object') {
      return (
        '<div class="z-card z-bench-fallback">' +
        '<h4>Global Benchmark — Legal Readiness</h4>' +
        '<p class="z-meta">Benchmark data file missing or invalid. Add <code>dashboard/data/z_legal_benchmark_readiness.json</code>.</p>' +
        '<p class="z-meta">Internal benchmark only — not legal advice or certification.</p>' +
        '</div>'
      );
    }

    var html = '<div class="z-bench-panel" role="region" aria-label="Global benchmark legal readiness">';

    html += '<div class="z-card z-bench-disclaimer">';
    html += '<h4>' + esc(data.disclaimer_heading || 'Disclaimer') + '</h4>';
    html += '<ul class="z-bench-disclaimer-list">';
    var lines = Array.isArray(data.disclaimer_lines) ? data.disclaimer_lines : [];
    lines.forEach(function (ln) {
      html += '<li>' + esc(ln) + '</li>';
    });
    html += '</ul></div>';

    html += '<div class="z-card z-bench-legend-card"><h4>Signal legend</h4>';
    html += '<div class="z-bench-legend-grid" role="list">';
    var leg = Array.isArray(data.signal_legend) ? data.signal_legend : [];
    leg.forEach(function (item) {
      var code = String(item.code || '').toUpperCase();
      html += '<div class="z-bench-legend-item" role="listitem">';
      html += '<span class="' + esc(pillClass(code)) + '">' + esc(code) + '</span>';
      html += '<span class="z-bench-legend-mean">' + esc(item.meaning || '') + '</span>';
      html += '</div>';
    });
    html += '</div></div>';

    html += '<div class="z-card z-bench-table-card">';
    html += '<h4>' + esc(data.panel_title || 'Readiness categories') + '</h4>';
    html += '<p class="z-meta z-bench-micro">Edited in JSON only — no automatic score from telemetry or users.</p>';
    html += '<div class="z-bench-table-wrap" role="table" aria-label="Readiness categories">';
    html += '<div class="z-bench-thead" role="row">';
    html += '<span role="columnheader">Area</span><span role="columnheader">Signal</span><span role="columnheader">What we measure</span><span role="columnheader">Notes &amp; links</span>';
    html += '</div>';

    var cats = Array.isArray(data.categories) ? data.categories : [];
    cats.forEach(function (c) {
      var sig = String(c.signal || 'UNKNOWN').toUpperCase();
      var links = '';
      var docLinks = Array.isArray(c.doc_links) ? c.doc_links : [];
      docLinks.forEach(function (L) {
        var path = String(L.path || '').replace(/^\//, '');
        if (!path) return;
        links +=
          '<li><a href="' + esc(docHref(path)) + '">' + esc(L.label || path) + '</a></li>';
      });
      html += '<div class="z-bench-row' + rowModifier(sig) + '" role="row">';
      html += '<div class="z-bench-cell z-bench-cell--title" role="cell"><strong>' + esc(c.title || c.id || '') + '</strong>';
      if (c.review_flag === 'legal') {
        html += ' <span class="z-bench-mini-tag">Legal review lane</span>';
      }
      html += '</div>';
      html += '<div class="z-bench-cell z-bench-cell--sig" role="cell"><span class="' + esc(pillClass(sig)) + '">' + esc(sig) + '</span></div>';
      html += '<div class="z-bench-cell" role="cell"><p class="z-bench-measure">' + esc(c.measure || '') + '</p></div>';
      html += '<div class="z-bench-cell z-bench-cell--links" role="cell">';
      if (c.notes) html += '<p class="z-meta z-bench-notes">' + esc(c.notes) + '</p>';
      if (links) html += '<ul class="z-bench-link-list">' + links + '</ul>';
      html += '</div>';
      html += '</div>';
    });

    html += '</div></div>';

    if (data.risk_queue_banner) {
      html += '<div class="z-card z-bench-risk-banner">';
      html += '<h4>Risk queue posture</h4>';
      html += '<p>' + esc(data.risk_queue_banner) + '</p>';
      html += '</div>';
    }

    if (data.external_reference_hint) {
      html += '<p class="z-meta z-bench-foot-hint">' + esc(data.external_reference_hint) + '</p>';
    }

    html +=
      '<p class="z-meta z-bench-doclink"><a href="' +
      esc(docHref('docs/Z_LEGAL_GLOBAL_BENCHMARK_READINESS_PANEL.md')) +
      '">Full panel doctrine (Markdown)</a></p>';

    html += '</div>';
    return html;
  }

  global.zLegalBenchReadonly = { panelHtml: panelHtml };
})(typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : this);
