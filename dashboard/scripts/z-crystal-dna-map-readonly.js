/**
 * Z-CRYSTAL-DNA-2 / DNA-3 — read-only Crystal DNA ecosystem map.
 * Fetches JSON only (GET). No writes, deploy, git, repair, NAS, or secrets.
 * DNA-3: optional drift overlay from z_crystal_dna_drift_report.json (GET only).
 */
(function () {
  'use strict';

  var DATA = {
    crystal: '../../data/z_crystal_dna_asset_manifest.json',
    satellite: '../../data/z_satellite_control_link_manifest.json',
    doorway: '../../data/z_doorway_workspace_registry.json',
    indicators: '../data/amk_project_indicators.json',
    drift: '../../data/reports/z_crystal_dna_drift_report.json',
  };

  /** Worst-signal merge (aligned with drift script rollup). */
  var DRIFT_RANK = { RED: 6, QUARANTINE: 5, HOLD: 4, BLUE: 4, NAS_WAIT: 3, YELLOW: 2, GREEN: 1 };

  var MAX_INDICATORS = 28;
  var COL_W = 210;
  var ROW_H = 40;
  var PAD_X = 100;
  var PAD_Y = 96;

  var state = {
    nodes: [],
    edges: [],
    positions: {},
    scale: 1,
    tx: 0,
    ty: 0,
    panning: false,
    panSX: 0,
    panSY: 0,
    panPX: 0,
    panPY: 0,
    filter: '',
    selectedId: null,
    crystal: null,
    indicators: null,
  };

  function $(id) {
    return document.getElementById(id);
  }

  function statusClass(st) {
    var s = String(st || '')
      .trim()
      .toUpperCase();
    if (s === 'GREEN') return 'status-green';
    if (s === 'YELLOW') return 'status-yellow';
    if (s === 'BLUE') return 'status-blue';
    if (s === 'RED') return 'status-red';
    if (s === 'HOLD') return 'status-hold';
    if (s === 'NAS_WAIT') return 'status-nas_wait';
    if (s === 'QUARANTINE') return 'status-quarantine';
    if (s === 'DISABLED' || s === '') return 'status-disabled';
    return 'status-yellow';
  }

  function fetchJson(url) {
    return fetch(url, { credentials: 'same-origin' }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + url);
      return res.json();
    });
  }

  function worseDriftSignal(a, b) {
    var ra = DRIFT_RANK[String(a || '').toUpperCase()] || 0;
    var rb = DRIFT_RANK[String(b || '').toUpperCase()] || 0;
    return ra >= rb ? String(a || 'YELLOW').toUpperCase() : String(b || 'YELLOW').toUpperCase();
  }

  /** Apply DNA-3 drift classes to shard nodes by report refs (read-only overlay). */
  function applyDriftOverlay(report) {
    var hint = $('zCdnaDriftHint');
    if (!report || !Array.isArray(report.findings)) {
      if (hint) hint.textContent = '';
      return;
    }
    var worstByRef = {};
    report.findings.forEach(function (f) {
      var sig = String(f.signal || 'YELLOW').toUpperCase();
      (f.refs || []).forEach(function (r) {
        var key = String(r || '');
        if (!key) return;
        worstByRef[key] = worstByRef[key] ? worseDriftSignal(worstByRef[key], sig) : sig;
      });
    });
    document.querySelectorAll('.shard-node').forEach(function (el) {
      el.classList.remove(
        'z-cdna-drift--green',
        'z-cdna-drift--yellow',
        'z-cdna-drift--blue',
        'z-cdna-drift--hold',
        'z-cdna-drift--red',
        'z-cdna-drift--quarantine',
        'z-cdna-drift--nas_wait'
      );
      var id = el.getAttribute('data-id');
      if (!id || !worstByRef[id]) return;
      el.classList.add('z-cdna-drift--' + String(worstByRef[id]).toLowerCase());
    });
    if (hint) {
      var n = report.findings_count != null ? report.findings_count : report.findings.length;
      hint.textContent =
        'Drift overlay: ' +
        n +
        ' finding(s) · overall ' +
        String(report.overall_signal || '—') +
        ' (read-only)';
    }
  }

  function buildNodes(crystal, sat, door, ind) {
    var nodes = [];
    state.crystal = crystal;
    state.indicators = ind;

    if (crystal && Array.isArray(crystal.shards)) {
      crystal.shards.forEach(function (sh) {
        nodes.push({
          id: 'crystal:' + sh.id,
          nid: sh.id,
          kind: 'crystal',
          label: sh.id,
          cluster: sh.owner_layer || 'hub',
          status: sh.status || 'YELLOW',
          type: sh.type || 'shard',
          path: sh.path || '',
          risk: sh.risk || '',
          raw: sh,
        });
      });
    }

    if (sat && Array.isArray(sat.satellites)) {
      sat.satellites.forEach(function (s) {
        var st = s.status || 'YELLOW';
        if (s.enabled === false) st = 'DISABLED';
        nodes.push({
          id: 'sat:' + s.id,
          nid: s.id,
          kind: 'satellite',
          label: s.name || s.id,
          cluster: 'satellite_control_link',
          status: st,
          type: 'satellite',
          path: s.bridge_path || '',
          risk: s.nas_required ? 'nas' : 'low',
          raw: s,
        });
      });
    }

    if (door && Array.isArray(door.entries)) {
      door.entries.forEach(function (e) {
        var st = e.status || 'YELLOW';
        if (e.enabled === false) st = 'DISABLED';
        nodes.push({
          id: 'door:' + e.id,
          nid: e.id,
          kind: 'doorway',
          label: e.name || e.id,
          cluster: 'ssws_doorway',
          status: st,
          type: e.type || 'entry',
          path: '',
          risk: e.nas_required ? 'nas' : 'low',
          raw: e,
        });
      });
    }

    if (ind && Array.isArray(ind.indicators)) {
      ind.indicators.slice(0, MAX_INDICATORS).forEach(function (x) {
        nodes.push({
          id: 'ind:' + x.id,
          nid: x.id,
          kind: 'indicator',
          label: x.name || x.id,
          cluster: x.domain || 'indicator',
          status: x.signal || 'YELLOW',
          type: 'indicator',
          path: '',
          risk: '',
          raw: x,
        });
      });
    }

    return nodes;
  }

  function buildEdges(crystal) {
    var edges = [];
    var have = {};
    if (!crystal || !Array.isArray(crystal.shards)) return edges;
    crystal.shards.forEach(function (sh) {
      have['crystal:' + sh.id] = true;
    });
    crystal.shards.forEach(function (sh) {
      var deps = Array.isArray(sh.dependencies) ? sh.dependencies : [];
      deps.forEach(function (d) {
        var from = 'crystal:' + sh.id;
        var to = 'crystal:' + d;
        if (have[from] && have[to]) edges.push({ from: from, to: to, kind: 'dna' });
      });
    });
    return edges;
  }

  function layout(nodes) {
    var byCluster = {};
    nodes.forEach(function (n) {
      var c = n.cluster || 'other';
      if (!byCluster[c]) byCluster[c] = [];
      byCluster[c].push(n);
    });
    var clusters = Object.keys(byCluster).sort();
    var positions = {};
    clusters.forEach(function (cl, ci) {
      var x = PAD_X + ci * COL_W;
      byCluster[cl].forEach(function (n, ri) {
        var jitter = (ri % 3) * 6 - 6;
        var y = PAD_Y + ri * ROW_H + jitter;
        positions[n.id] = { x: x, y: y, cx: x, cy: y };
      });
    });
    return { positions: positions, clusters: clusters, byCluster: byCluster };
  }

  function truncate(s, max) {
    s = String(s || '');
    if (s.length <= max) return s;
    return s.slice(0, max - 1) + '…';
  }

  function render(layoutInfo) {
    var gEdges = $('zCdnaEdges');
    var gCl = $('zCdnaClusters');
    var gNodes = $('zCdnaNodes');
    gEdges.textContent = '';
    gCl.textContent = '';
    gNodes.textContent = '';

    var NS = 'http://www.w3.org/2000/svg';
    state.positions = layoutInfo.positions;

    layoutInfo.clusters.forEach(function (cl, ci) {
      var tx = PAD_X + ci * COL_W;
      var te = document.createElementNS(NS, 'text');
      te.setAttribute('x', String(tx - 40));
      te.setAttribute('y', String(PAD_Y - 28));
      te.setAttribute('class', 'z-cdna-cluster-label');
      te.textContent = truncate(cl, 22);
      gCl.appendChild(te);
    });

    state.edges.forEach(function (e) {
      var pa = state.positions[e.from];
      var pb = state.positions[e.to];
      if (!pa || !pb) return;
      var path = document.createElementNS(NS, 'path');
      var mx = (pa.x + pb.x) / 2;
      var my = (pa.y + pb.y) / 2 - 24;
      var d = 'M ' + pa.x + ' ' + pa.y + ' Q ' + mx + ' ' + my + ' ' + pb.x + ' ' + pb.y;
      path.setAttribute('d', d);
      path.setAttribute('class', 'z-cdna-edge');
      path.setAttribute('data-from', e.from);
      path.setAttribute('data-to', e.to);
      gEdges.appendChild(path);
    });

    state.nodes.forEach(function (n) {
      var p = state.positions[n.id];
      if (!p) return;
      var g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'shard-node ' + statusClass(n.status));
      g.setAttribute('data-id', n.id);
      g.setAttribute('transform', 'translate(' + p.x + ',' + p.y + ')');

      var glow = document.createElementNS(NS, 'circle');
      glow.setAttribute('class', 'shard-glow');
      glow.setAttribute('r', '22');
      glow.setAttribute('fill', 'rgba(120,200,255,0.25)');
      glow.setAttribute('filter', 'url(#zCdnaSoftGlow)');

      var core = document.createElementNS(NS, 'circle');
      core.setAttribute('class', 'shard-core');
      core.setAttribute('r', '11');
      core.setAttribute('cx', '0');
      core.setAttribute('cy', '0');

      var label = document.createElementNS(NS, 'text');
      label.setAttribute('class', 'shard-label');
      label.setAttribute('x', '18');
      label.setAttribute('y', '4');
      label.textContent = truncate(n.label, 18);

      g.appendChild(glow);
      g.appendChild(core);
      g.appendChild(label);
      gNodes.appendChild(g);
    });

    var maxX = PAD_X + layoutInfo.clusters.length * COL_W + 80;
    var maxY = PAD_Y + 520;
    $('zCdnaSvg').setAttribute('viewBox', '0 0 ' + maxX + ' ' + maxY);
  }

  function applyTransform() {
    var w = $('zCdnaWorld');
    w.setAttribute(
      'transform',
      'translate(' + state.tx + ',' + state.ty + ') scale(' + state.scale + ')'
    );
  }

  function nodeMatches(n, q) {
    if (!q) return true;
    var hay = (
      n.id +
      ' ' +
      n.label +
      ' ' +
      n.cluster +
      ' ' +
      n.status +
      ' ' +
      n.kind +
      ' ' +
      n.type
    ).toLowerCase();
    return hay.indexOf(q) !== -1;
  }

  function applyFilter() {
    var q = state.filter;
    var show = {};
    state.nodes.forEach(function (n) {
      show[n.id] = nodeMatches(n, q);
    });
    document.querySelectorAll('.shard-node').forEach(function (el) {
      var id = el.getAttribute('data-id');
      el.classList.toggle('is-dim', !show[id]);
    });
    document.querySelectorAll('.z-cdna-edge').forEach(function (el) {
      var a = el.getAttribute('data-from');
      var b = el.getAttribute('data-to');
      var dim = !show[a] || !show[b];
      el.classList.toggle('is-dim', dim);
    });
  }

  function setInspector(n) {
    var body = $('zCdnaInspectorBody');
    if (!n) {
      body.textContent = '{}';
      return;
    }
    var out = {
      id: n.id,
      kind: n.kind,
      cluster: n.cluster,
      status: n.status,
      type: n.type,
      risk: n.risk,
    };
    if (n.kind === 'crystal') {
      out.dependencies = n.raw.dependencies || [];
      out.rebuild_rule = n.raw.rebuild_rule || '';
      out.path = n.raw.path || '';
    }
    if (n.kind === 'doorway') {
      out.enabled = n.raw.enabled;
      out.tags = n.raw.tags || [];
      out.notes = n.raw.notes || '';
    }
    if (n.kind === 'satellite') {
      out.enabled = n.raw.enabled;
      out.nas_required = n.raw.nas_required;
      out.notes = n.raw.notes || '';
    }
    if (n.kind === 'indicator') {
      out.signal = n.raw.signal;
      out.growth_percent = n.raw.growth_percent;
      out.go_no_go = n.raw.go_no_go;
      out.autonomy_level = n.raw.autonomy_level;
    }
    body.textContent = JSON.stringify(out, null, 2);
  }

  function fillGovernance(crystal, ind) {
    var allow = $('zCdnaGovAllow');
    var forbid = $('zCdnaGovForbid');
    allow.innerHTML = '';
    forbid.innerHTML = '';
    if (!crystal) {
      allow.textContent = 'Crystal manifest not loaded.';
      return;
    }
    var aTitle = document.createElement('strong');
    aTitle.textContent = 'Allowed';
    allow.appendChild(aTitle);
    var ulA = document.createElement('ul');
    (crystal.allowed_actions || []).forEach(function (x) {
      var li = document.createElement('li');
      li.textContent = String(x);
      ulA.appendChild(li);
    });
    allow.appendChild(ulA);

    var fTitle = document.createElement('strong');
    fTitle.textContent = 'Forbidden';
    forbid.appendChild(fTitle);
    var ulF = document.createElement('ul');
    (crystal.forbidden_actions || []).forEach(function (x) {
      var li = document.createElement('li');
      li.textContent = String(x);
      ulF.appendChild(li);
    });
    forbid.appendChild(ulF);

    if (ind && ind.law_note) {
      var p = document.createElement('p');
      p.className = 'z-cdna-hint';
      p.textContent = String(ind.law_note);
      forbid.appendChild(p);
    }
  }

  function wireHoverEdges() {
    var nodes = document.querySelectorAll('.shard-node');
    nodes.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        var id = el.getAttribute('data-id');
        document.querySelectorAll('.z-cdna-edge').forEach(function (edge) {
          if (edge.getAttribute('data-from') === id || edge.getAttribute('data-to') === id) {
            edge.classList.add('is-hot');
          }
        });
      });
      el.addEventListener('mouseleave', function () {
        document.querySelectorAll('.z-cdna-edge').forEach(function (edge) {
          edge.classList.remove('is-hot');
        });
        if (state.selectedId) {
          document.querySelectorAll('.z-cdna-edge').forEach(function (edge) {
            if (
              edge.getAttribute('data-from') === state.selectedId ||
              edge.getAttribute('data-to') === state.selectedId
            ) {
              edge.classList.add('is-hot');
            }
          });
        }
      });
    });
  }

  function wireUi() {
    var wrap = $('zCdnaWrap');
    $('zCdnaZoomIn').addEventListener('click', function () {
      state.scale = Math.min(2.5, state.scale * 1.12);
      applyTransform();
    });
    $('zCdnaZoomOut').addEventListener('click', function () {
      state.scale = Math.max(0.35, state.scale / 1.12);
      applyTransform();
    });
    $('zCdnaZoomReset').addEventListener('click', function () {
      state.scale = 1;
      state.tx = 0;
      state.ty = 0;
      applyTransform();
    });
    $('zCdnaGovToggle').addEventListener('click', function () {
      var g = $('zCdnaGov');
      g.hidden = !g.hidden;
    });
    $('zCdnaSearch').addEventListener('input', function (e) {
      state.filter = String(e.target.value || '')
        .trim()
        .toLowerCase();
      applyFilter();
    });

    wrap.addEventListener(
      'wheel',
      function (e) {
        e.preventDefault();
        var f = 1 + -e.deltaY * 0.001;
        state.scale = Math.max(0.35, Math.min(2.5, state.scale * f));
        applyTransform();
      },
      { passive: false }
    );

    wrap.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.shard-node')) return;
      if (e.target.closest('button')) return;
      state.panning = true;
      wrap.classList.add('is-panning');
      state.panSX = state.tx;
      state.panSY = state.ty;
      state.panPX = e.clientX;
      state.panPY = e.clientY;
      wrap.setPointerCapture(e.pointerId);
    });

    wrap.addEventListener('pointermove', function (e) {
      if (!state.panning) return;
      state.tx = state.panSX + (e.clientX - state.panPX) / state.scale;
      state.ty = state.panSY + (e.clientY - state.panPY) / state.scale;
      applyTransform();
    });

    function endPan(e) {
      if (!state.panning) return;
      state.panning = false;
      wrap.classList.remove('is-panning');
      try {
        wrap.releasePointerCapture(e.pointerId);
      } catch (err) {
        /* ignore */
      }
    }
    wrap.addEventListener('pointerup', endPan);
    wrap.addEventListener('pointercancel', endPan);

    wrap.addEventListener('click', function (e) {
      var node = e.target.closest('.shard-node');
      document.querySelectorAll('.shard-node').forEach(function (el) {
        el.classList.remove('is-hot');
      });
      document.querySelectorAll('.z-cdna-edge').forEach(function (el) {
        el.classList.remove('is-hot');
      });
      if (!node) {
        state.selectedId = null;
        setInspector(null);
        return;
      }
      var id = node.getAttribute('data-id');
      state.selectedId = id;
      node.classList.add('is-hot');
      document.querySelectorAll('.z-cdna-edge').forEach(function (el) {
        if (el.getAttribute('data-from') === id || el.getAttribute('data-to') === id) {
          el.classList.add('is-hot');
        }
      });
      var found = state.nodes.filter(function (n) {
        return n.id === id;
      })[0];
      setInspector(found || null);
    });
  }

  function main() {
    wireUi();
    applyTransform();
    Promise.all([
      fetchJson(DATA.crystal).catch(function () {
        return null;
      }),
      fetchJson(DATA.satellite).catch(function () {
        return null;
      }),
      fetchJson(DATA.doorway).catch(function () {
        return null;
      }),
      fetchJson(DATA.indicators).catch(function () {
        return null;
      }),
    ])
      .then(function (parts) {
        var crystal = parts[0];
        var sat = parts[1];
        var door = parts[2];
        var ind = parts[3];
        state.nodes = buildNodes(crystal, sat, door, ind);
        state.edges = buildEdges(crystal);
        var L = layout(state.nodes);
        render(L);
        applyFilter();
        fillGovernance(crystal, ind);
        wireHoverEdges();
        return fetchJson(DATA.drift)
          .then(function (drift) {
            applyDriftOverlay(drift);
          })
          .catch(function () {
            applyDriftOverlay(null);
          });
      })
      .catch(function (err) {
        $('zCdnaInspectorBody').textContent = JSON.stringify(
          { error: String(err && err.message ? err.message : err) },
          null,
          2
        );
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();
