/**
 * MC-1 — Universe Mission Control read-only overlay (AMK Main Control Dashboard).
 * Visualizes registry, departments, dependencies, health — no execution buttons.
 */
(function () {
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

  function docHref(rel) {
    var r = String(rel || '').replace(/^\//, '');
    if (!r) return '#';
    return rootPrefix() + '/' + r.split('/').join('/');
  }

  function fetchJson(url) {
    return fetch(url, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + url);
      return r.json();
    });
  }

  function confBadge(level) {
    var l = String(level || 'unknown').toLowerCase();
    var label = l === 'confirmed' ? '✅' : l === 'inferred' ? '🟡' : '⚪';
    return (
      '<span class="amk-umc-conf amk-umc-conf--' +
      esc(l) +
      '" title="' +
      esc(l) +
      '">' +
      label +
      '</span>'
    );
  }

  function lanePill(lane) {
    var s = String(lane || 'unknown');
    return '<span class="amk-ind-pill amk-ind-pill--blue">' + esc(s) + '</span>';
  }

  function renderSummary(reg) {
    var s = reg.summary || {};
    var cls = s.classification || {};
    var integ = s.integration || {};
    var charter = (reg.charter_projects || []).length;
    return (
      '<div class="amk-umc-summary">' +
      '<span class="amk-umc-stat">🌍 ' +
      esc((reg.projects || []).length) +
      ' disk/registry projects</span>' +
      '<span class="amk-umc-stat">📋 ' +
      esc(charter) +
      ' hub charters</span>' +
      '<span class="amk-umc-stat">Core ' +
      esc(cls.core || 0) +
      '</span>' +
      '<span class="amk-umc-stat">Growing ' +
      esc(cls.growing || 0) +
      '</span>' +
      '<span class="amk-umc-stat">MC integrated ' +
      esc(integ.integrated || 0) +
      '</span>' +
      '<span class="amk-umc-stat">🐢 Merge Hold · read-only</span>' +
      '</div>'
    );
  }

  function renderRegistryTable(projects) {
    var rows = (projects || [])
      .slice()
      .sort(function (a, b) {
        return String(a.universe_id || '').localeCompare(String(b.universe_id || ''));
      })
      .map(function (p) {
        var conf = p.confidence || {};
        return (
          '<tr data-lane="' +
          esc(p.classification_lane) +
          '" data-mc="' +
          esc(p.mission_control_status) +
          '">' +
          '<td class="amk-umc-id">' +
          esc(p.universe_id) +
          '</td>' +
          '<td>' +
          esc(p.project_name) +
          '</td>' +
          '<td>' +
          lanePill(p.classification_lane) +
          '</td>' +
          '<td>' +
          esc(p.mission_control_status) +
          '</td>' +
          '<td>' +
          confBadge((conf.documentation_status || {}).level) +
          esc(p.documentation_status) +
          '</td>' +
          '<td>' +
          esc((p.timeline || {}).last_activity || '—') +
          '</td>' +
          '<td>' +
          esc((p.timeline || {}).lifecycle_stage || '—') +
          '</td>' +
          '</tr>'
        );
      })
      .join('');

    return (
      '<div class="amk-umc-panel">' +
      '<h3>🌍 Universe Registry</h3>' +
      '<div class="amk-umc-filter">' +
      '<label>Filter <input type="search" id="amkUmcRegistryFilter" placeholder="Name or ZSU ID…" /></label>' +
      '<label>Lane <select id="amkUmcLaneFilter"><option value="">All</option>' +
      '<option value="core">core</option><option value="growing">growing</option>' +
      '<option value="research">research</option><option value="archive">archive</option>' +
      '<option value="unknown">unknown</option></select></label>' +
      '</div>' +
      '<div class="amk-umc-table-wrap">' +
      '<table class="amk-umc-table" id="amkUmcRegistryTable">' +
      '<thead><tr><th>ID</th><th>Project</th><th>Lane</th><th>MC status</th><th>Docs</th><th>Last activity</th><th>Stage</th></tr></thead>' +
      '<tbody>' +
      rows +
      '</tbody></table></div></div>'
    );
  }

  function renderCharterTable(charters) {
    if (!charters || !charters.length) return '';
    var rows = charters
      .map(function (c) {
        return (
          '<tr><td class="amk-umc-id">' +
          esc(c.universe_id) +
          '</td><td>' +
          esc(c.project_name) +
          '</td><td>' +
          esc(c.current_phase) +
          '</td><td>' +
          (c.status_doc ? '<a href="' + esc(docHref(c.status_doc)) + '">Status doc</a>' : '—') +
          '</td><td>' +
          esc(c.recommended_next_action || '') +
          '</td></tr>'
        );
      })
      .join('');
    return (
      '<div class="amk-umc-panel">' +
      '<h3>📋 Hub charter registry</h3>' +
      '<div class="amk-umc-table-wrap"><table class="amk-umc-table">' +
      '<thead><tr><th>ID</th><th>Charter</th><th>Phase</th><th>Doc</th><th>Next</th></tr></thead>' +
      '<tbody>' +
      rows +
      '</tbody></table></div></div>'
    );
  }

  function renderDepartments(deptReg, reg) {
    var depts = (deptReg && deptReg.departments) || [];
    var cards = depts
      .map(function (d) {
        var doc = d.status_doc
          ? '<a href="' + esc(docHref(d.status_doc)) + '">Open status</a>'
          : 'No status doc';
        return (
          '<div class="amk-umc-dept-card">' +
          '<strong>' +
          esc(d.emoji || '') +
          ' ' +
          esc(d.display_name) +
          '</strong>' +
          '<span>' +
          esc(d.system_id) +
          ' · ' +
          esc(d.default_phase) +
          '</span><br/>' +
          doc +
          '<br/><em>' +
          esc(d.recommended_next || '') +
          '</em></div>'
        );
      })
      .join('');
    return (
      '<div class="amk-umc-panel">' +
      '<h3>🧩 Department Map</h3>' +
      '<p class="amk-map3-disclaimer">Observability groupings only — not runtime coupling.</p>' +
      cards +
      '</div>'
    );
  }

  function renderDependencies(reg) {
    var edges = reg.dependency_map || [];
    var html = edges
      .map(function (e) {
        return (
          '<div class="amk-umc-edge">' +
          esc(e.from) +
          ' → ' +
          esc(e.to) +
          ' <em>(' +
          esc(e.type) +
          ')</em> — ' +
          esc(e.note || '') +
          '</div>'
        );
      })
      .join('');
    return (
      '<div class="amk-umc-panel">' +
      '<h3>🔗 Dependency graph (hints)</h3>' +
      (html || '<p>No dependency hints recorded.</p>') +
      '</div>'
    );
  }

  function renderHealthMatrix(projects) {
    var rows = (projects || [])
      .filter(function (p) {
        return p.classification_lane === 'core' || p.registry_id === 'zsanctuary-universe';
      })
      .concat(
        (projects || []).filter(function (p) {
          return p.classification_lane !== 'core' && p.registry_id !== 'zsanctuary-universe';
        })
      )
      .slice(0, 15)
      .map(function (p) {
        var dims = p.status_dimensions || {};
        return (
          '<tr><td class="amk-umc-id">' +
          esc(p.universe_id) +
          '</td><td>' +
          esc(p.project_name) +
          '</td><td>' +
          esc(dims.docs || p.documentation_status) +
          '</td><td>' +
          esc(dims.path || (p.path_ok ? 'ok' : 'missing')) +
          '</td><td>' +
          esc(dims.governance || (p.merge_hold ? 'merge_hold' : '—')) +
          '</td><td>' +
          (p.turtle_mode ? '🐢' : '—') +
          '</td></tr>'
        );
      })
      .join('');
    return (
      '<div class="amk-umc-panel">' +
      '<h3>📊 Health matrix (sample)</h3>' +
      '<div class="amk-umc-table-wrap"><table class="amk-umc-table">' +
      '<thead><tr><th>ID</th><th>Project</th><th>Docs</th><th>Path</th><th>Governance</th><th>Turtle</th></tr></thead>' +
      '<tbody>' +
      rows +
      '</tbody></table></div></div>'
    );
  }

  function renderCriticalPath(deptReg) {
    var vile = (deptReg.departments || []).find(function (d) {
      return d.id === 'vile';
    });
    var hub = (deptReg.departments || []).find(function (d) {
      return d.id === 'zuno_core';
    });
    return (
      '<div class="amk-umc-panel">' +
      '<h3>🚦 Critical path — Track A</h3>' +
      '<div class="amk-umc-track-a">' +
      '<p><strong>Priority:</strong> VILE Pkgs 1–3 merge → zuno-drp → verify main</p>' +
      '<p>' +
      esc((vile && vile.recommended_next) || 'Review VILE foundation merge') +
      '</p>' +
      '<p>' +
      esc((hub && hub.recommended_next) || 'Protect Merge Hold on hub') +
      '</p>' +
      '<p><a href="' +
      esc(docHref('docs/vile/PHASE_2A_FOUNDATION_INTEGRATION_REPORT.md')) +
      '">VILE Phase 2A report</a> · ' +
      '<a href="' +
      esc(docHref('docs/Z_SANCTUARY_UNIVERSE_RESOLUTION_2026_07_04.md')) +
      '">Universe resolution</a></p>' +
      '</div></div>'
    );
  }

  function renderAiConsensus() {
    return (
      '<div class="amk-umc-panel amk-umc-future">' +
      '<h3>🤖 AI consensus</h3>' +
      '<p>MC-2 future-ready placeholder. No AI attachments or execution from this panel.</p>' +
      '</div>'
    );
  }

  function renderNextActions(reg) {
    var items = [];
    (reg.missing_from_mission_control || []).slice(0, 8).forEach(function (m) {
      items.push({ who: m.project_name, action: m.recommended_next_action, kind: 'mc_gap' });
    });
    (reg.charter_projects || []).slice(0, 4).forEach(function (c) {
      items.push({ who: c.project_name, action: c.recommended_next_action, kind: 'charter' });
    });
    var hub = (reg.projects || []).find(function (p) {
      return p.registry_id === 'zsanctuary-universe';
    });
    if (hub) {
      items.unshift({
        who: hub.project_name,
        action: hub.recommended_next_action,
        kind: 'track_a',
      });
    }
    var html = items
      .map(function (it) {
        return (
          '<div class="amk-umc-action"><strong>' +
          esc(it.who) +
          '</strong> — ' +
          esc(it.action) +
          ' <em>(review workflow — no execute)</em></div>'
        );
      })
      .join('');
    return (
      '<div class="amk-umc-panel">' +
      '<h3>📋 Recommended next actions</h3>' +
      '<p class="amk-map3-disclaimer">Links and review only — dashboard does not run tasks or deploy.</p>' +
      html +
      '<p><a href="' +
      esc(docHref('docs/dashboard/Z_UNIVERSE_DISCOVERY_ARCHITECTURE.md')) +
      '">Discovery architecture</a> · ' +
      '<a href="' +
      esc(docHref('data/reports/z_universe_discovery_report.md')) +
      '">Latest discovery report</a></p>' +
      '</div>'
    );
  }

  function wireFilters() {
    var filter = document.getElementById('amkUmcRegistryFilter');
    var lane = document.getElementById('amkUmcLaneFilter');
    var table = document.getElementById('amkUmcRegistryTable');
    if (!table) return;

    function apply() {
      var q = String((filter && filter.value) || '')
        .trim()
        .toLowerCase();
      var ln = String((lane && lane.value) || '');
      var trs = table.querySelectorAll('tbody tr');
      trs.forEach(function (tr) {
        var text = tr.textContent.toLowerCase();
        var matchQ = !q || text.indexOf(q) !== -1;
        var matchL = !ln || tr.getAttribute('data-lane') === ln;
        tr.hidden = !(matchQ && matchL);
      });
    }

    if (filter) filter.addEventListener('input', apply);
    if (lane) lane.addEventListener('change', apply);
  }

  function mount(reg, deptReg) {
    var el = document.getElementById('amkUniverseMcMount');
    if (!el) return;

    el.innerHTML =
      '<div class="amk-umc-root">' +
      renderSummary(reg) +
      '<div class="amk-umc-grid">' +
      renderRegistryTable(reg.projects) +
      renderCharterTable(reg.charter_projects) +
      '</div>' +
      '<div class="amk-umc-grid">' +
      renderDepartments(deptReg, reg) +
      renderDependencies(reg) +
      '</div>' +
      '<div class="amk-umc-grid">' +
      renderHealthMatrix(reg.projects) +
      renderCriticalPath(deptReg) +
      '</div>' +
      renderAiConsensus() +
      renderNextActions(reg) +
      '</div>';

    wireFilters();
  }

  function init() {
    var base = rootPrefix();
    Promise.all([
      fetchJson(base + '/data/z_universe_project_registry.json'),
      fetchJson(base + '/data/z_universe_department_registry.json'),
    ])
      .then(function (pair) {
        mount(pair[0], pair[1]);
      })
      .catch(function (err) {
        var el = document.getElementById('amkUniverseMcMount');
        if (el) {
          el.innerHTML =
            '<p class="amk-umc-err">Mission Control overlay could not load JSON. Serve the hub over HTTP (e.g. dashboard static server) and run <code>npm run z:universe:discovery</code>. ' +
            esc(err.message) +
            '</p>';
        }
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
