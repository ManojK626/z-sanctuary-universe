/**
 * LAWGRID-1A — read-only governance observatory.
 * Fetches hub JSON only. No APIs, orchestration, deploy, billing, or legal conclusions.
 */
(function () {
  function esc(x) {
    return String(x ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function docHref(rel) {
    var r = String(rel || '').replace(/^\//, '');
    return '../../' + r;
  }

  function pillClass(sig) {
    var s = String(sig || '').toUpperCase();
    if (s === 'GREEN') return 'amk-ind-pill amk-ind-pill--green';
    if (s === 'YELLOW') return 'amk-ind-pill amk-ind-pill--yellow';
    if (s === 'BLUE') return 'amk-ind-pill amk-ind-pill--blue';
    if (s === 'RED') return 'amk-ind-pill amk-ind-pill--red';
    if (s === 'PURPLE') return 'amk-ind-pill amk-ind-pill--purple';
    if (s === 'GOLD') return 'amk-ind-pill amk-ind-pill--gold';
    return 'amk-ind-pill amk-ind-pill--unknown';
  }

  function fetchJson(url) {
    return fetch(url, { credentials: 'same-origin' }).then(function (r) {
      if (!r.ok) return null;
      return r.json();
    });
  }

  function countBridge(catalog) {
    var tally = {};
    (catalog.services || []).forEach(function (s) {
      var k = String(s.bridge_status || 'UNKNOWN');
      tally[k] = (tally[k] || 0) + 1;
    });
    return tally;
  }

  function signalTallyBench(bench) {
    var tally = {};
    (bench.categories || []).forEach(function (c) {
      var k = String(c.signal || 'UNKNOWN').toUpperCase();
      tally[k] = (tally[k] || 0) + 1;
    });
    return tally;
  }

  function renderSpine(el, registry) {
    if (!el) return;
    el.innerHTML = '';
    (registry.universe_spine || []).forEach(function (row) {
      var d = document.createElement('div');
      d.className = 'z-lawgrid-spine-item';
      d.innerHTML =
        '<strong>' + esc(row.label) + '</strong><span>' + esc(row.meaning || '') + '</span>';
      el.appendChild(d);
    });
  }

  function renderLawStrip(el, registry) {
    if (!el) return;
    var lines = registry.law_strip || [];
    el.innerHTML = '<ul>' + lines.map(function (L) { return '<li>' + esc(L) + '</li>'; }).join('') + '</ul>';
  }

  function renderCards(el, catalog, bench, cross, magical, sswns, amkInd) {
    if (!el) return;
    el.innerHTML = '';
    function addCard(title, body, metricHtml) {
      var c = document.createElement('article');
      c.className = 'z-lawgrid-card';
      c.setAttribute('aria-label', title);
      c.innerHTML =
        '<h3>' + esc(title) + '</h3><p>' + esc(body) + '</p>' +
        (metricHtml != null && metricHtml !== ''
          ? '<div class="z-lawgrid-card-metric">' + metricHtml + '</div>'
          : '');
      el.appendChild(c);
    }

    var svcN = catalog && catalog.services ? catalog.services.length : '—';
    var bridges = catalog ? countBridge(catalog) : {};
    var bridgeBits = Object.keys(bridges)
      .slice(0, 3)
      .map(function (k) { return k + ': ' + bridges[k]; })
      .join(' · ');
    addCard(
      'Universe catalogue',
      'Services listed in workstation catalogue — visibility only.',
      '<span>' + esc(String(svcN) + ' services · ' + (bridgeBits || 'no bridge rollup')) + '</span>'
    );

    var benchTally = bench ? signalTallyBench(bench) : {};
    var benchStr = bench
      ? Object.keys(benchTally)
          .map(function (k) { return k + ': ' + benchTally[k]; })
          .join(' · ')
      : 'not loaded';
    addCard(
      'Legal readiness (BENCH)',
      'Internal benchmark signals — not certification or launch permission.',
      '<span>' + esc(benchStr || '—') + '</span>'
    );

    var capN =
      cross && cross.capabilities ? cross.capabilities.length : '—';
    addCard(
      'Cross-project capability (ZSX)',
      (cross && cross.posture) || 'metadata_reference_only — source projects own entitlement truth.',
      '<span>' + esc(String(capN) + ' capability rows') + '</span>'
    );

    var zmvN = magical && magical.capabilities ? magical.capabilities.length : '—';
    var gl =
      magical && magical.golden_law
        ? magical.golden_law.length > 160
          ? magical.golden_law.slice(0, 160) + '…'
          : magical.golden_law
        : 'visual_language_metadata_only';
    addCard(
      'Magical visual (ZMV)',
      gl,
      '<span>' + esc(String(zmvN) + ' registered paths') + '</span>'
    );

    var oss = sswns && sswns.overall_signal ? String(sswns.overall_signal).toUpperCase() : 'UNKNOWN';
    var projN = sswns && sswns.projects ? sswns.projects.length : 0;
    var ssNote =
      sswns && sswns.law_note
        ? sswns.law_note.length > 120
          ? sswns.law_note.slice(0, 120) + '…'
          : sswns.law_note
        : 'Launch requirement ≠ permission.';
    addCard(
      'Workspace launch posture (SSWS)',
      ssNote,
      '<span class="' +
        esc(pillClass(oss)) +
        '">' +
        esc(oss) +
        '</span> <span aria-hidden="true">·</span> ' +
        esc(String(projN) + ' projects')
    );

    var inds = amkInd && amkInd.indicators ? amkInd.indicators : [];
    var danger = inds.filter(function (i) {
      var sg = String(i.signal || '').toUpperCase();
      return sg === 'RED' || sg === 'BLUE';
    }).length;
    var amkNote =
      amkInd && amkInd.law_note
        ? amkInd.law_note.length > 130
          ? amkInd.law_note.slice(0, 130) + '…'
          : amkInd.law_note
        : 'Indicator ≠ deployment permission.';
    addCard(
      'AMK indicators',
      amkNote,
      '<span>' + esc(String(inds.length) + ' indicators · ' + danger + ' BLUE/RED') + '</span>'
    );
  }

  function renderConstellation(wrapCap, svgEl, labelsEl, registry) {
    var cc = registry.constellation || {};
    wrapCap.textContent = cc.caption || '';
    if (!svgEl || !labelsEl) return;

    svgEl.innerHTML = '';
    labelsEl.innerHTML = '';

    var vb = cc.viewBox || '0 0 100 100';
    svgEl.setAttribute('viewBox', vb);
    svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    var nodes = cc.nodes || [];
    var edges = cc.edges || [];

    edges.forEach(function (e) {
      var a = nodes.find(function (n) { return n.id === e.from; });
      var b = nodes.find(function (n) { return n.id === e.to; });
      if (!a || !b) return;
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', String(a.x));
      line.setAttribute('y1', String(a.y));
      line.setAttribute('x2', String(b.x));
      line.setAttribute('y2', String(b.y));
      line.setAttribute('vector-effect', 'non-scaling-stroke');
      svgEl.appendChild(line);
    });

    nodes.forEach(function (n) {
      var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', String(n.x));
      c.setAttribute('cy', String(n.y));
      c.setAttribute('r', '1.85');
      svgEl.appendChild(c);

      var sp = document.createElement('span');
      sp.textContent = n.label || n.id;
      sp.style.left = n.x + '%';
      sp.style.top = n.y + '%';
      labelsEl.appendChild(sp);
    });
  }

  function renderQueue(el, bench, sswns, amkInd) {
    if (!el) return;
    el.innerHTML = '';
    function add(title, subtitle, pill, tier) {
      var d = document.createElement('div');
      d.className = 'z-lawgrid-queue-item' + (tier === 'RED' ? ' z-lawgrid-queue-item--red' : '') +
        (tier === 'BLUE' ? ' z-lawgrid-queue-item--blue' : '');
      d.innerHTML =
        '<span class="' + esc(pillClass(pill || 'UNKNOWN')) + '">' +
        esc(String(pill || '').toUpperCase()) +
        '</span> · <strong>' + esc(title) + '</strong>' +
        '<div class="z-lawgrid-queue-meta">' + esc(subtitle || '') + '</div>';
      el.appendChild(d);
    }

    (sswns && sswns.notification_candidates_red_blue_only
      ? sswns.notification_candidates_red_blue_only
      : []).forEach(function (n) {
      add(n.title || 'SSWS candidate', n.detail || '', n.signal, String(n.signal || '').toUpperCase());
    });

    (sswns && sswns.issues ? sswns.issues : []).forEach(function (iss) {
      var sev = String(iss.severity || '').toUpperCase();
      if (sev !== 'BLUE' && sev !== 'RED') return;
      add(
        'SSWS · ' + (iss.project_id || '?'),
        iss.message || iss.code || '',
        sev,
        sev
      );
    });

    (bench && bench.categories ? bench.categories : []).forEach(function (c) {
      var sg = String(c.signal || '').toUpperCase();
      if (sg !== 'BLUE' && sg !== 'RED') return;
      add('Benchmark · ' + (c.title || c.id), esc(c.measure || '').slice(0, 220), sg, sg);
    });

    var inds = amkInd && amkInd.indicators ? amkInd.indicators : [];
    var ct = 0;
    inds.forEach(function (i) {
      var sg = String(i.signal || '').toUpperCase();
      if ((sg !== 'BLUE' && sg !== 'RED') || ct >= 8) return;
      ct++;
      add(
        i.name || i.id || 'Indicator',
        (i.readiness_label || i.go_no_go || '').slice(0, 200),
        sg,
        sg
      );
    });

    if (el.children.length === 0) {
      el.innerHTML =
        '<p class="z-lawgrid-queue-meta">No BLUE/RED merge rows surfaced from current JSON — still not approval to proceed.</p>';
    }
  }

  function renderLegend(el, bench) {
    if (!el) return;
    el.innerHTML = '';
    var leg = bench && bench.signal_legend ? bench.signal_legend : [];
    if (leg.length === 0) {
      el.innerHTML = '<li>Load legal benchmark JSON for full legend.</li>';
      return;
    }
    leg.forEach(function (L) {
      var li = document.createElement('li');
      var code = String(L.code || '').toUpperCase();
      li.innerHTML = '<span class="' + esc(pillClass(code)) + '">' + esc(code) + '</span> — ' +
        esc(L.meaning || '');
      el.appendChild(li);
    });
  }

  function renderFoot(el, registry) {
    if (!el) return;
    var chunks = [];
    (registry.related_docs || []).forEach(function (L) {
      chunks.push('<a href="' + esc(docHref(L.path)) + '">' + esc(L.label) + '</a>');
    });
    (registry.related_surfaces_html || []).forEach(function (L) {
      chunks.push('<a href="' + esc(docHref(L.path)) + '">' + esc(L.label) + '</a>');
    });
    el.innerHTML = chunks.length ? '<div class="z-lawgrid-foot-links">' + chunks.join('') + '</div>' : '';
  }

  function main() {
    var titleEl = document.getElementById('zLawgridTitle');
    var subEl = document.getElementById('zLawgridSub');
    var stripEl = document.getElementById('zLawgridLawStrip');
    var statEl = document.getElementById('zLawgridStatus');
    var spineEl = document.getElementById('zLawgridSpine');
    var cardsEl = document.getElementById('zLawgridCards');
    var wrapCap = document.getElementById('zLawgridConstellationCap');
    var svgEl = document.getElementById('zLawgridSvg');
    var labEl = document.getElementById('zLawgridNodeLabels');
    var queueEl = document.getElementById('zLawgridQueue');
    var legEl = document.getElementById('zLawgridLegend');
    var footLinks = document.getElementById('zLawgridFootLinks');

    if (!statEl) return;

    statEl.textContent = 'Loading observatory inputs…';

    var base = '../../';
    var paths = [
      base + 'dashboard/data/z_lawgrid_observatory_registry.json',
      base + 'dashboard/data/z_universe_service_catalog.json',
      base + 'dashboard/data/z_legal_benchmark_readiness.json',
      base + 'data/z_cross_project_capability_index.json',
      base + 'data/z_magical_visual_capability_registry.json',
      base + 'data/reports/z_ssws_launch_requirements_report.json',
      base + 'dashboard/data/amk_project_indicators.json'
    ];

    Promise.all(paths.map(fetchJson)).then(function (rows) {
      var registry = rows[0] || {};
      var catalog = rows[1];
      var bench = rows[2];
      var cross = rows[3];
      var magical = rows[4];
      var sswns = rows[5];
      var amkInd = rows[6];

      if (titleEl) titleEl.textContent = registry.title || 'LAWGRID Observatory';
      if (subEl) subEl.textContent = registry.subtitle || 'Governance observatory · read-only';

      renderLawStrip(stripEl, registry);
      renderSpine(spineEl, registry);
      renderCards(cardsEl, catalog, bench, cross, magical, sswns, amkInd);
      renderConstellation(wrapCap, svgEl, labEl, registry);
      renderQueue(queueEl, bench, sswns, amkInd);
      renderLegend(legEl, bench);
      renderFoot(footLinks, registry);

      var ok = catalog && bench && sswns;
      statEl.textContent =
        (ok ? 'Loaded — observatory refreshed — ' : 'Partial load — some JSON missing — ') +
        'no execution lanes opened.';
      if (!catalog) statEl.textContent += ' Catalog missing.';
      if (!bench) statEl.textContent += ' Benchmark missing.';
    }).catch(function (err) {
      statEl.textContent = 'Observatory error: ' + esc(err && err.message ? err.message : err);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();
