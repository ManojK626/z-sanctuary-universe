/**
 * Z-LEGAL-WORKSTATION-UX-2 compact protector prototype + UX-1 tabs.
 * Synthetic demo data only. No uploads, no client data intake, no legal advice runtime.
 */
(function () {
  var PROTECTOR_LS = 'zLegalWorkstationProtectorView';
  var workstationPaintRef = null;
  function rootPrefix() {
    var path = String(window.location.pathname || '').replace(/\\/g, '/');
    if (path.indexOf('/Html/shadow/') !== -1) return '../../..';
    return '../..';
  }

  function esc(x) {
    return String(x ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
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

  function docHref(rel) {
    var r = String(rel || '').replace(/^\//, '');
    return rootPrefix() + '/' + r;
  }

  function fetchJson(url) {
    return fetch(url, { credentials: 'same-origin' }).then(function (r) {
      if (!r.ok) return null;
      return r.json();
    });
  }

  function sig(obj, fallback) {
    if (!obj) return fallback || 'UNKNOWN';
    if (obj.overall_signal) return String(obj.overall_signal).toUpperCase();
    if (obj.signal) return String(obj.signal).toUpperCase();
    if (obj.status) return String(obj.status).toUpperCase();
    return fallback || 'UNKNOWN';
  }

  function blueRows(rep) {
    if (!rep || !Array.isArray(rep.sample_results)) return [];
    return rep.sample_results.filter(function (r) {
      return String(r.signal || '').toUpperCase() === 'BLUE';
    });
  }

  function readProtectorMode() {
    try {
      var v = localStorage.getItem(PROTECTOR_LS);
      if (v === 'julianne' || v === 'tom' || v === 'graph') return v;
    } catch (e) { /* noop */ }
    return 'julianne';
  }

  function writeProtectorMode(m) {
    if (m !== 'julianne' && m !== 'tom' && m !== 'graph') m = 'julianne';
    try {
      localStorage.setItem(PROTECTOR_LS, m);
    } catch (e) { /* noop */ }
  }

  function currentProtectorMode() {
    var sel = document.getElementById('zLegalProtectorMode');
    if (sel && sel.value) return sel.value;
    return readProtectorMode();
  }

  function initProtectorToggle() {
    var sel = document.getElementById('zLegalProtectorMode');
    if (!sel) return;
    sel.value = readProtectorMode();
    document.body.dataset.protectorView = sel.value;
    sel.addEventListener('change', function () {
      writeProtectorMode(sel.value);
      document.body.dataset.protectorView = sel.value;
      if (workstationPaintRef) workstationPaintRef();
    });
  }

  function wireReceiptDrawer(renderDrawerContent) {
    var openBtn = document.getElementById('zLegalOpenReceiptDrawer');
    var closeBtn = document.getElementById('zLegalDrawerClose');
    var drawer = document.getElementById('zLegalReceiptDrawer');
    var backdrop = document.getElementById('zLegalDrawerBackdrop');
    var bodyEl = document.getElementById('zLegalDrawerBody');
    if (!openBtn || !closeBtn || !drawer || !backdrop || !bodyEl) return;

    function loadBody() {
      if (typeof renderDrawerContent === 'function') renderDrawerContent(bodyEl);
    }

    function open() {
      loadBody();
      drawer.classList.add('z-receipt-drawer--open');
      backdrop.hidden = false;
      drawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('z-legal-drawer-open');
      window.setTimeout(function () {
        try {
          closeBtn.focus();
        } catch (e) { /* noop */ }
      }, 10);
    }

    function close() {
      drawer.classList.remove('z-receipt-drawer--open');
      backdrop.hidden = true;
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('z-legal-drawer-open');
      try {
        openBtn.focus();
      } catch (e) { /* noop */ }
    }

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && drawer.classList.contains('z-receipt-drawer--open')) {
        close();
      }
    });
  }

  function renderReceiptStrip(mount, legalOps, legalProductOps, traffic, dashboardRegistry) {
    if (!mount) return;
    var rows = [
      ['Legal ops', sig(legalOps)],
      ['Legal product ops', sig(legalProductOps)],
      ['Traffic', sig(traffic)],
      ['Dashboard registry', sig(dashboardRegistry)]
    ];
    var html = '<strong>Receipt strip:</strong> ';
    rows.forEach(function (r) {
      html += '<span style="margin-right:0.5rem">' + esc(r[0]) + ' <span class="' + pillClass(r[1]) + '">' + esc(r[1]) + '</span></span>';
    });
    mount.innerHTML = html;
  }

  function renderTopMetrics(mount, legalOps, legalProductOps, traffic, dashboardRegistry) {
    if (!mount) return;
    var rows = [
      ['LEGAL OPS', sig(legalOps), 'Governance gate', '⚖'],
      ['PRODUCT OPS', sig(legalProductOps), 'Product/IP review', '⬢'],
      ['TRAFFIC', sig(traffic), 'System signal', '⚡'],
      ['REGISTRY', sig(dashboardRegistry), 'Dashboard index', '🧭']
    ];
    var html = '';
    rows.forEach(function (r) {
      html += '<article class="z-metric-card">';
      html += '<div class="z-metric-k"><span class="z-metric-ico">' + esc(r[3]) + '</span>' + esc(r[0]) + '</div>';
      html += '<div class="z-metric-v"><span class="' + pillClass(r[1]) + '">' + esc(r[1]) + '</span></div>';
      html += '<div class="z-meta">' + esc(r[2]) + '</div>';
      html += '</article>';
    });
    mount.innerHTML = html;
  }

  function renderCommandStrip(mount, legalOps, legalProductOps, traffic, dashboardRegistry) {
    if (!mount) return;
    var html = '';
    html += '<span class="z-pill">Legal Ops ' + esc(sig(legalOps)) + '</span>';
    html += '<span class="z-pill">Product Ops ' + esc(sig(legalProductOps)) + '</span>';
    html += '<span class="z-pill">Traffic ' + esc(sig(traffic)) + '</span>';
    html += '<span class="z-pill">Registry ' + esc(sig(dashboardRegistry)) + '</span>';
    html += '<span class="z-pill">NO LEGAL ADVICE</span>';
    html += '<span class="z-pill">NO CLIENT DATA</span>';
    html += '<span class="z-pill">NO PRODUCT LAUNCH</span>';
    html += '<span class="z-pill">CONTRACT REQUIRED</span>';
    mount.innerHTML = html;
  }

  var TABS = [
    { id: 'overview', label: 'Overview', icon: '⌂' },
    { id: 'evidence', label: 'Evidence Timeline', icon: '◫' },
    { id: 'products_ip', label: 'Product/IP Matrix', icon: '⬢' },
    { id: 'ai_ecosystem', label: 'AI Ecosystem Map', icon: '◉' },
    { id: 'risk_queue', label: 'Risk Queue', icon: '⚠' },
    { id: 'global_benchmark', label: 'Global Benchmark', icon: '◈' },
    { id: 'contracts', label: 'Contract/IP Review', icon: '✎' },
    { id: 'canvas_map', label: 'Canvas World Map', icon: '◌' },
    { id: 'legal_ai', label: 'Legal AI Assistant', icon: '✦' },
    { id: 'reports', label: 'Reports / Receipts', icon: '▣' }
  ];

  var DEMO_TIMELINE = [
    ['2026-05-01', 'Synthetic evidence packet indexed', 'Timeline entry'],
    ['2026-05-03', 'Mock product-claim review gate opened', 'BLUE decision gate'],
    ['2026-05-05', 'Synthetic contract clause compare completed', 'Review note'],
    ['2026-05-07', 'Draft export concept prepared', 'No filing action']
  ];

  var PRODUCT_ROWS = [
    ['Z-Octave', 'BLUE', 'YELLOW', 'Legal/IP review'],
    ['Z-Neuro Matrix', 'BLUE', 'HIGH', 'Health claim gate'],
    ['Z-Ankle Water Weight', 'YELLOW', 'MEDIUM', 'Safety review'],
    ['Z-Natural Inhaler', 'BLUE', 'HIGH', 'Medical claim gate'],
    ['Z-Gadget Mirrors', 'YELLOW', 'MEDIUM', 'IP/design review'],
    ['Z-Connected Devices', 'YELLOW', 'MEDIUM', 'Data protection'],
    ['Wearables / Headsets', 'YELLOW', 'MEDIUM', 'AI and safety review']
  ];

  var SIMULATION_TIMELINE = [
    ['2019-Q4', 'Synthetic lineage note seeded (workflow drill only)', 'Past-phase mock'],
    ['2024-06', 'Internal governance checkpoint (demo narrative)', 'Non-evidential'],
    ['2026-05', 'Protector cockpit exercise (present)', 'Knowledge-alignment drill']
  ];

  function dualSpineCompactHtml() {
    return (
      '<div class="z-spine-compact" role="presentation">' +
      '<div class="z-spine-compact-col"><span class="z-chip z-chip--sanctuary">Z-Sanctuary: DRP · XBUS · SEC · MAGE · Pattern Safe · Legal Core · AMK signals</span></div>' +
      '<div class="z-spine-compact-col"><span class="z-chip z-chip--law">Law spine: process · evidence · consent · privacy · safety · IP · professional review</span></div>' +
      '<div class="z-spine-compact-bridge"><span class="z-chip z-chip--bridge">Bridge: AI maps & checklists · Human lawyers decide legal advice · AMK owns sacred moves</span></div>' +
      '</div>'
    );
  }

  function historicalSimulationHtml(mode, tableDenseClass) {
    var note = '';
    if (mode === 'tom') {
      note = '<p class="z-meta">Structured synthetic narrative for cockpit drills.</p>';
    } else if (mode === 'graph') {
      note = '<p class="z-meta">Graph view links this spine to posture maps only — still demo text.</p>';
    }
    var tbl = 'z-matrix' + (tableDenseClass || '');
    var rows = '';
    SIMULATION_TIMELINE.forEach(function (r) {
      rows +=
        '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>';
    });
    return (
      '<div class="z-card z-sim-case-card">' +
      '<h4>Historical Simulation Case — Demo Only</h4>' +
      '<ul class="z-sim-rules">' +
      '<li>Past toward present timeline is synthetic governance text only.</li>' +
      '<li>Not real case data · not reusable as evidence.</li>' +
      '<li>Used only to test workflows, checklists, and dashboard behavior.</li>' +
      '</ul>' +
      note +
      '<table class="' + tbl + '"><thead><tr><th>Phase</th><th>Narrative (demo)</th><th>Tag</th></tr></thead><tbody>' +
      rows +
      '</tbody></table></div>'
    );
  }

  function radarPanelHtml(extraClass) {
    var boxCls = 'z-radar-box' + (extraClass ? ' ' + esc(extraClass) : '');
    return (
      '<div class="' + boxCls + '">' +
      '<svg viewBox="0 0 320 230" role="img" aria-label="Risk radar demo">' +
      '<polygon points="160,20 245,58 285,130 252,195 160,218 70,196 35,130 73,58" fill="rgba(57,88,160,0.18)" stroke="rgba(120,178,255,0.6)" />' +
      '<polygon points="160,45 225,74 256,130 229,180 160,198 95,180 66,130 96,74" fill="rgba(210,69,190,0.2)" stroke="rgba(220,90,240,0.7)" />' +
      '<line x1="160" y1="20" x2="160" y2="218" stroke="rgba(140,181,255,0.35)" />' +
      '<line x1="35" y1="130" x2="285" y2="130" stroke="rgba(140,181,255,0.35)" />' +
      '<text x="156" y="14" fill="#bfe7ff" font-size="11">Legal</text>' +
      '<text x="263" y="58" fill="#bfe7ff" font-size="11">IP</text>' +
      '<text x="286" y="134" fill="#bfe7ff" font-size="11">Safety</text>' +
      '<text x="250" y="210" fill="#bfe7ff" font-size="11">Contracts</text>' +
      '<text x="137" y="228" fill="#bfe7ff" font-size="11">Manufacturing</text>' +
      '<text x="12" y="133" fill="#bfe7ff" font-size="11">Data</text>' +
      '<text x="66" y="50" fill="#bfe7ff" font-size="11">AI Risk</text>' +
      '</svg>' +
      '<p class="z-radar-cap">DEMO / GOVERNANCE MOCK — advisory risk shape only.</p>' +
      '</div>'
    );
  }

  function matrixRowsHtml(rows) {
    var h = '';
    rows.forEach(function (r) {
      h += '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td><td>' + esc(r[3]) + '</td></tr>';
    });
    return h;
  }

  function centerPanelHtml(tabId, legalOps, legalProductOps, protectorMode, benchmarkData) {
    var pm = protectorMode || currentProtectorMode();
    var denseCls = pm === 'tom' ? ' z-matrix-dense' : '';
    var b1 = blueRows(legalOps);
    var b2 = blueRows(legalProductOps);
    if (tabId === 'evidence') {
      var html = '<div class="z-card"><h4>Evidence Timeline (Mock)</h4><table class="z-matrix' + denseCls + '"><thead><tr><th>Date</th><th>Event</th><th>Status</th></tr></thead><tbody>';
      DEMO_TIMELINE.forEach(function (r) {
        html += '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>';
      });
      html += '</tbody></table></div>';
      html += '<div class="z-card"><h4>Evidence Viewer Placeholder</h4><p class="z-meta">Document/image/video viewer posture only. Viewer != evidence intake.</p></div>';
      return html;
    }
    if (tabId === 'products_ip') {
      var h =
        '<div class="z-card"><h4>Product Families Status Matrix (Mock)</h4><table class="z-matrix' + denseCls + '"><thead><tr><th>Product family</th><th>Status</th><th>Risk level</th><th>Review gate</th></tr></thead><tbody>';
      PRODUCT_ROWS.forEach(function (r) {
        h += '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td><td>' + esc(r[3]) + '</td></tr>';
      });
      h += '</tbody></table></div>';
      h += '<div class="z-card"><h4>Contract/IP Tracker</h4><p class="z-meta">No filing claim, no contract claim, no supplier execution in this phase.</p></div>';
      return h;
    }
    if (tabId === 'ai_ecosystem') {
      var ego = '';
      if (pm === 'graph') {
        ego += dualSpineCompactHtml();
      }
      ego +=
        '<div class="z-card"><h4>AI Ecosystem Graph (Mock)</h4><p class="z-meta">Legal ops, product ops, stack, toolbelt, and traffic nodes shown as read-only governance edges.</p>' +
        (pm === 'graph' ? radarPanelHtml('z-radar-box--lite') : '') +
        '</div>' +
        '<div class="z-card"><h4>Citation Binder</h4><p class="z-meta">Claim to source to report pathways, report links only.</p></div>';
      return ego;
    }
    if (tabId === 'risk_queue') {
      b1 = blueRows(legalOps);
      b2 = blueRows(legalProductOps);
      var radarBig = pm === 'graph' ? radarPanelHtml('z-radar-box--xl') : radarPanelHtml();
      var q = '<div class="z-card"><h4>Risk Heatmap (Demo)</h4><p class="z-meta">RED/BLUE/YELLOW/GREEN legal-review posture map. Advisory only.</p>' + radarBig + '</div>';
      q += '<div class="z-card"><h4>BLUE review queue</h4><ul>';
      b1.forEach(function (r) { q += '<li>Legal ops: ' + esc(r.sample_id) + '</li>'; });
      b2.forEach(function (r) { q += '<li>Product ops: ' + esc(r.sample_id) + '</li>'; });
      if (b1.length === 0 && b2.length === 0) q += '<li>No BLUE rows loaded from reports.</li>';
      q += '</ul></div>';
      return q;
    }
    if (tabId === 'global_benchmark') {
      var benchGlobal = typeof window !== 'undefined' ? window.zLegalBenchReadonly : null;
      if (benchGlobal && typeof benchGlobal.panelHtml === 'function') {
        return benchGlobal.panelHtml(benchmarkData, { docHref: docHref, pillClass: pillClass });
      }
      return (
        '<div class="z-card"><h4>Global Benchmark</h4>' +
        '<p class="z-meta">Load <code>z-legal-benchmark-readonly.js</code> before the workstation script.</p>' +
        '</div>'
      );
    }
    if (tabId === 'contracts') {
      return '<div class="z-card"><h4>Contract/IP Review</h4><p class="z-meta">Clause compare, contract status, IP candidate checklist — mock review surface only.</p></div><div class="z-card"><h4>Consent Tracker</h4><p class="z-meta">Sharing posture metadata only. No client-data intake runtime.</p></div>';
    }
    if (tabId === 'canvas_map') {
      return (
        '<div class="z-card"><h4>Canvas World Map Placeholder</h4>' +
        dualSpineCompactHtml() +
        '<p class="z-meta">Visual governance map only. Canvas map != live tracking.</p>' +
        '</div>' +
        historicalSimulationHtml(pm, denseCls) +
        '<div class="z-card"><h4>Export Pack Builder (Mock)</h4><p class="z-meta">Draft concept queue only. Export draft != court filing.</p></div>'
      );
    }
    if (tabId === 'legal_ai') {
      return '<div class="z-card"><h4>Legal AI Assistant Mock</h4><p>I can explain reports, map risks, and prepare review checklists. I do not provide legal advice.</p><p class="z-meta">No real AI provider call; deterministic mock posture only.</p></div>';
    }
    if (tabId === 'reports') {
      return '<div class="z-card"><h4>Reports and Receipts</h4><p><a href="' + esc(docHref('data/reports/z_legal_ops_report.json')) + '">z_legal_ops_report.json</a></p><p><a href="' + esc(docHref('data/reports/z_legal_product_ops_report.json')) + '">z_legal_product_ops_report.json</a></p><p><a href="' + esc(docHref('docs/PHASE_Z_LEGAL_TOOLBELT_1_GREEN_RECEIPT.md')) + '">Toolbelt receipt</a></p></div>';
    }
    if (tabId === 'overview') {
      var overview = '';
      overview +=
        '<div class="z-overview-kpis">' +
        '<div class="z-kpi"><div class="z-kpi-l">Legal evidence core</div><div class="z-kpi-v">ACTIVE</div><div class="z-meta">Read-only visibility</div><div class="z-kpi-bar"><span style="width:92%"></span></div></div>' +
        '<div class="z-kpi"><div class="z-kpi-l">Lawyer workstation</div><div class="z-kpi-v">ACTIVE</div><div class="z-meta">Governance-only</div><div class="z-kpi-bar"><span style="width:96%"></span></div></div>' +
        '<div class="z-kpi"><div class="z-kpi-l">Product compliance</div><div class="z-kpi-v">BLUE</div><div class="z-meta">Review required</div><div class="z-kpi-bar"><span style="width:78%"></span></div></div>' +
        '<div class="z-kpi"><div class="z-kpi-l">Product families</div><div class="z-kpi-v">' + esc(String(PRODUCT_ROWS.length)) + '</div><div class="z-meta">Families tracked</div><div class="z-kpi-bar"><span style="width:100%"></span></div></div>' +
        '<div class="z-kpi"><div class="z-kpi-l">Risk queue</div><div class="z-kpi-v">' + esc(String(b1.length + b2.length)) + '</div><div class="z-meta">Needs review</div><div class="z-kpi-bar"><span style="width:66%"></span></div></div>' +
        '</div>';
      overview += dualSpineCompactHtml();
      overview += historicalSimulationHtml(pm, denseCls);
      overview +=
        '<div class="z-mock-banner z-mock-banner--tight">' +
        '<strong>SYNTHETIC DEMO DATA</strong> — No client data · Mentor personas internal · Simulation not usable as evidence · No privileged vault.</div>';

      if (pm === 'graph') {
        overview += '<div class="z-card z-graph-hero"><h4>Risk octagon emphasis (demo)</h4>' + radarPanelHtml('z-radar-box--xl') + '</div>';
        overview += '<div class="z-overview-graph-split">';
        overview +=
          '<div class="z-card"><h4>AI ecosystem / dual spine linkage (illustrative)</h4><p class="z-meta">Shows how governance hubs connect visually; still read-only doctrine text.</p>' +
          dualSpineCompactHtml() +
          '</div>';
        overview +=
          '<div class="z-card"><h4>Canvas / world-map slot</h4><p class="z-meta">Placeholder frame for Zuno-style map — no GIS, tracking, or live feeds.</p></div>';
        overview += '</div>';
        overview += '<div class="z-card z-matrix-tight-wrap"><h4>Product / IP lattice (emphasis)</h4>';
        overview += '<div class="z-matrix-scroll"><table class="z-matrix">';
        overview += '<thead><tr><th>Product family</th><th>Status</th><th>Risk</th><th>Gate</th></tr></thead><tbody>';
        overview += matrixRowsHtml(PRODUCT_ROWS);
        overview += '</tbody></table></div></div>';
      } else if (pm === 'tom') {
        overview += '<div class="z-overview-tom-stack">';
        overview += '<div class="z-card"><h4>Legal Review Timeline</h4><table class="z-matrix z-matrix-dense"><thead><tr><th>Date</th><th>Event</th><th>Status</th></tr></thead><tbody>';
        DEMO_TIMELINE.forEach(function (r) {
          overview += '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>';
        });
        overview += '</tbody></table></div>';
        overview += '<div class="z-card"><h4>Product Families Matrix</h4><table class="z-matrix z-matrix-dense"><thead><tr><th>Product family</th><th>Status</th><th>Risk</th><th>Gate</th></tr></thead><tbody>';
        overview += matrixRowsHtml(PRODUCT_ROWS);
        overview += '</tbody></table></div>';
        overview += '<div class="z-card z-overview-radar"><h4>Risk posture snapshot</h4>' + radarPanelHtml() + '</div>';
        overview += '</div>';
      } else {
        overview += '<div class="z-overview-main-grid">';
        overview += '<div class="z-card"><h4>Legal Review Timeline (Demo)</h4><table class="z-matrix"><thead><tr><th>Date</th><th>Event</th><th>Status</th></tr></thead><tbody>';
        DEMO_TIMELINE.forEach(function (r) {
          overview += '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>';
        });
        overview += '</tbody></table></div>';
        overview += '<div class="z-card"><h4>Product Families Status Matrix</h4><table class="z-matrix"><thead><tr><th>Product family</th><th>Status</th><th>Risk</th><th>Gate</th></tr></thead><tbody>';
        overview += matrixRowsHtml(PRODUCT_ROWS);
        overview += '</tbody></table></div>';
        overview += '<div class="z-card z-overview-radar"><h4>Risk Heatmap (Demo)</h4>' + radarPanelHtml() + '</div>';
        overview += '</div>';
      }
      return overview;
    }

    return (
      '<div class="z-overview-kpis">' +
      '<div class="z-kpi"><div class="z-kpi-l">Legal evidence core</div><div class="z-kpi-v">ACTIVE</div><div class="z-meta">Read-only visibility</div></div>' +
      '<div class="z-kpi"><div class="z-kpi-l">Lawyer workstation</div><div class="z-kpi-v">ACTIVE</div><div class="z-meta">Governance-only</div></div>' +
      '<div class="z-kpi"><div class="z-kpi-l">Product compliance</div><div class="z-kpi-v">BLUE</div><div class="z-meta">Review required</div></div>' +
      '<div class="z-kpi"><div class="z-kpi-l">Product families</div><div class="z-kpi-v">7</div><div class="z-meta">Tracked</div></div>' +
      '<div class="z-kpi"><div class="z-kpi-l">Risk queue</div><div class="z-kpi-v">LIVE</div><div class="z-meta">Contained panel</div></div>' +
      '</div>' +
      '<div class="z-card"><h4>Overview</h4><p class="z-meta">Proof map + legal tool dock + AI assistant + risk queue + product/IP map.</p></div>' +
      '<div class="z-card"><h4>Functional prototype posture</h4><p class="z-meta">Interactive UI with synthetic demo data, governance-only and no runtime legal actions.</p></div>'
    );
  }

  function rightPanelHtml(legalOps, legalProductOps) {
    var b1 = blueRows(legalOps);
    var b2 = blueRows(legalProductOps);
    var html = '';
    html += '<div class="z-card z-cockpit-card">';
    html += '<h4>Legal Intelligence Cockpit</h4>';
    html += '<p class="z-meta">AI can explain, map, and prepare review checklists. Human lawyers decide legal advice. AMK owns sacred moves.</p>';
    html += '<span class="z-queue-tag">SYNTHETIC / READ-ONLY</span>';
    html += '</div>';

    html += '<div class="z-card z-mentor-card z-mentor-card--tom">';
    html += '<h4>Z-Tom Legal Mentor AI</h4>';
    html += '<p class="z-meta"><strong>Role:</strong> Structured legal-risk and product/IP review persona.</p>';
    html += '<p class="z-meta"><strong>Focus:</strong> Contracts, governance discipline, evidence structure, portfolio/IP readiness, escalation clarity.</p>';
    html += '<p class="z-meta">Synthetic internal mentor persona only. Not a real lawyer. No legal advice.</p>';
    html += '</div>';

    html += '<div class="z-card z-mentor-card z-mentor-card--julianne">';
    html += '<h4>Z-Julianne Legal Mentor AI</h4>';
    html += '<p class="z-meta"><strong>Role:</strong> Dignity, evidence clarity, consent, review-packet flow persona.</p>';
    html += '<p class="z-meta"><strong>Focus:</strong> Respectful narration, coherent timelines, sharing posture summaries, reviewer-friendly packets.</p>';
    html += '<p class="z-meta">Synthetic internal mentor persona only. Not a real lawyer. No endorsement.</p>';
    html += '</div>';

    html += '<div class="z-card z-spine-card">';
    html += '<h4>Dual Knowledge Spine</h4>';
    html += '<div class="z-spine-grid">';
    html += '<div><h5>Z-Sanctuary Spine</h5><ul>';
    html += '<li>14 DRP / People Protocol</li><li>Z-XBUS</li><li>Z-SEC</li><li>Z-Ultra MAGE</li><li>Z-Pattern Safe</li><li>Z-Legal Evidence Core</li><li>AMK dashboard signals</li>';
    html += '</ul></div>';
    html += '<div><h5>Real-World Law / Justice Spine</h5><ul>';
    html += '<li>legal process awareness</li><li>evidence standards</li><li>contracts and consent</li><li>data protection / privacy</li><li>product safety</li><li>IP review</li><li>professional legal review</li>';
    html += '</ul></div>';
    html += '</div>';
    html += '<p class="z-meta">Bridge law: AI assists with mapping/checklists; human legal professionals decide legal advice.</p>';
    html += '</div>';

    html += '<div class="z-card"><h4>Lawyer Review Queue</h4>';
    b1.forEach(function (r) {
      html += '<div class="z-queue-card"><div class="z-queue-id">Legal: ' + esc(r.sample_id) + '</div><span class="z-queue-tag">LEGAL</span></div>';
    });
    b2.forEach(function (r) {
      html += '<div class="z-queue-card"><div class="z-queue-id">Product/IP: ' + esc(r.sample_id) + '</div><span class="z-queue-tag">PRODUCT</span></div>';
    });
    if (b1.length === 0 && b2.length === 0) html += '<div class="z-queue-card"><div class="z-queue-id">No BLUE rows loaded.</div><span class="z-queue-tag">INFO</span></div>';
    html += '</div>';
    html += '<div class="z-card"><h4>Next Action</h4><p class="z-meta">Route BLUE lanes to AMK/legal/human review; keep runtime closed. No launch.</p></div>';
    html += '<div class="z-card"><h4>AI Cockpit Mock Actions</h4><div class="z-ai-action-strip">';
    html += '<button type="button" class="z-ai-action-btn" disabled aria-disabled="true">Prepare Review Checklist</button>';
    html += '<button type="button" class="z-ai-action-btn" disabled aria-disabled="true">Summarize Evidence Packet</button>';
    html += '<button type="button" class="z-ai-action-btn" disabled aria-disabled="true">Map Legal Risk</button>';
    html += '<button type="button" class="z-ai-action-btn" disabled aria-disabled="true">Compare Product/IP Gate</button>';
    html += '<button type="button" class="z-ai-action-btn" disabled aria-disabled="true">Ask Human Lawyer Review</button>';
    html += '</div></div>';
    html += '<div class="z-mock-banner"><strong>SYNTHETIC DEMO DATA — NO CLIENT DATA</strong><br />Legal AI mock != legal adviser.</div>';
    return html;
  }

  function renderWorkstation(mount, legalOps, legalProductOps, benchmarkData) {
    if (!mount) return;
    var active = 'overview';
    var html = '';
    html += '<div class="z-workstation-grid">';
    html += '<section class="z-panel z-panel-left"><h3 class="z-panel-h">Tool Dock</h3><div class="z-tool-dock" id="zLegalToolDock"></div></section>';
    html += '<section class="z-panel z-panel-center"><h3 class="z-panel-h" id="zLegalCenterTitle">Overview</h3><div class="z-center-body" id="zLegalCenterBody"></div></section>';
    html += '<section class="z-panel z-panel-right"><h3 class="z-panel-h">AI & Review Center</h3><div class="z-right-body" id="zLegalRightBody"></div></section>';
    html += '</div>';
    mount.innerHTML = html;

    var dock = document.getElementById('zLegalToolDock');
    var centerTitle = document.getElementById('zLegalCenterTitle');
    var centerBody = document.getElementById('zLegalCenterBody');
    var rightBody = document.getElementById('zLegalRightBody');
    if (!dock || !centerBody || !rightBody || !centerTitle) return;

    function paint() {
      dock.innerHTML = '';
      TABS.forEach(function (t) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'z-tool-btn' + (t.id === active ? ' z-tool-btn--on' : '');
        btn.setAttribute('data-tool-id', t.id);
        btn.setAttribute('aria-pressed', t.id === active ? 'true' : 'false');
        btn.setAttribute(
          'aria-label',
          esc(t.label) + ' workstation view. Switches cockpit center panel.'
        );
        btn.innerHTML = '<span class="z-tool-ico">' + esc(t.icon) + '</span><span class="z-tool-lab">' + esc(t.label) + '</span>';
        btn.addEventListener('click', function () {
          active = t.id;
          paint();
        });
        dock.appendChild(btn);
      });
      var tdef = TABS.find(function (t) { return t.id === active; }) || TABS[0];
      centerTitle.textContent = tdef.label;
      centerBody.innerHTML =
        centerPanelHtml(active, legalOps, legalProductOps, currentProtectorMode(), benchmarkData) +
        '<div class="z-mock-banner z-mock-banner--tight">' +
        '<strong>DEMO / GOVERNANCE MOCK</strong> · No uploads · No intake · No legal advice runtime.</div>';
      rightBody.innerHTML = rightPanelHtml(legalOps, legalProductOps);
    }

    paint();
    workstationPaintRef = paint;
  }

  function renderBottomQueue(mount, legalOps, legalProductOps) {
    if (!mount) return;
    var b1 = blueRows(legalOps);
    var b2 = blueRows(legalProductOps);
    var html = '';
    html += '<p class="z-meta">Draft queue posture only · No court filing, mailout, billing, APIs, uploads, dispatch, exports, launch, privileged storage.</p>';
    html += '<h4 class="z-drawer-sub">Synthetic draft packet list</h4><ul class="z-drawer-list">';
    b1.forEach(function (r) { html += '<li>Draft packet: Legal ops / ' + esc(r.sample_id) + '</li>'; });
    b2.forEach(function (r) { html += '<li>Draft packet: Product ops / ' + esc(r.sample_id) + '</li>'; });
    if (b1.length === 0 && b2.length === 0) html += '<li>No BLUE draft packets listed from overlays.</li>';
    html += '</ul>';
    html += '<h4 class="z-drawer-sub">Report / doctrine links (read-only)</h4>';
    html += '<ul class="z-drawer-list z-drawer-links">';
    html += '<li><a href="' + esc(docHref('data/reports/z_legal_ops_report.json')) + '">z_legal_ops_report.json</a></li>';
    html += '<li><a href="' + esc(docHref('data/reports/z_legal_product_ops_report.json')) + '">z_legal_product_ops_report.json</a></li>';
    html += '<li><a href="' + esc(docHref('docs/Z_LEGAL_WORKSTATION_TOOLBELT.md')) + '">Z-Legal workstation toolbelt</a></li>';
    html += '<li><a href="' + esc(docHref('docs/PHASE_Z_LEGAL_WORKSTATION_UX_2_GREEN_RECEIPT.md')) + '">UX-2 governance receipt</a></li>';
    html +=
      '<li><a href="' + esc(docHref('docs/Z_LEGAL_GLOBAL_BENCHMARK_READINESS_PANEL.md')) + '">Global benchmark panel doctrine</a></li>';
    html +=
      '<li><a href="' + esc(docHref('docs/PHASE_Z_LEGAL_BENCH_1_GREEN_RECEIPT.md')) + '">Z-LEGAL-BENCH-1 green receipt</a></li>';
    html += '</ul>';
    html += '<h4 class="z-drawer-sub">Rollback note</h4>';
    html +=
      '<p class="z-meta">Restore prior HTML/CSS/JS from Git or backup. Optional: clear <code>localStorage</code> key <strong>zLegalWorkstationProtectorView</strong> to reset protector mode.</p>';
    html += '<h4 class="z-drawer-sub">Mock exporter controls (disabled)</h4>';
    html += '<div class="z-action-strip z-action-strip--drawer">';
    html += '<button class="z-action-btn" type="button" disabled title="Mock only">Build Export Pack (Draft)</button>';
    html += '<button class="z-action-btn" type="button" disabled title="Mock only">Generate Review Checklist</button>';
    html += '<button class="z-action-btn" type="button" disabled title="Mock only">Evidence Summary (Draft)</button>';
    html += '<button class="z-action-btn" type="button" disabled title="Mock only">Risk Report (Draft)</button>';
    html += '<button class="z-action-btn" type="button" disabled title="Mock only">System Map (Canvas)</button>';
    html += '<button class="z-action-btn" type="button" disabled title="Mock only">Open Reports Folder</button>';
    html += '</div>';
    html +=
      '<p class="z-meta z-drawer-safety-final"><strong>No runtime authority.</strong> This drawer organizes governance mock UX only.</p>';
    mount.innerHTML = html;
  }

  function init() {
    initProtectorToggle();
    var wsMount = document.getElementById('zLegalWorkstationStandaloneMount');
    var strip = document.getElementById('zLegalReceiptStrip');
    var topMetrics = document.getElementById('zLegalTopMetrics');
    var cmdStrip = document.getElementById('zLegalCommandStrip');
    var prefix = rootPrefix();

    Promise.all([
      fetchJson(prefix + '/data/reports/z_legal_ops_report.json'),
      fetchJson(prefix + '/data/reports/z_legal_product_ops_report.json'),
      fetchJson(prefix + '/data/reports/z_traffic_minibots_status.json'),
      fetchJson(prefix + '/data/reports/z_dashboard_registry_verify.json'),
      fetchJson(prefix + '/dashboard/data/z_legal_benchmark_readiness.json')
    ]).then(function (rows) {
      var legalOps = rows[0];
      var legalProductOps = rows[1];
      var traffic = rows[2];
      var dashboardRegistry = rows[3];
      var benchmarkData = rows[4];
      renderReceiptStrip(strip, legalOps, legalProductOps, traffic, dashboardRegistry);
      renderTopMetrics(topMetrics, legalOps, legalProductOps, traffic, dashboardRegistry);
      renderCommandStrip(cmdStrip, legalOps, legalProductOps, traffic, dashboardRegistry);
      renderWorkstation(wsMount, legalOps, legalProductOps, benchmarkData);

      wireReceiptDrawer(function refillDrawer(drawerMount) {
        renderBottomQueue(drawerMount, legalOps, legalProductOps);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
