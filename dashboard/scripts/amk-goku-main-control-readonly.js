/**
 * AMK-Goku Main Control Dashboard — AMK-MAP-1 + AMK-MAP-2 + AMK-MAP-3
 * Read-only: map JSON, domain lens, side catalog, readiness observatory, launch ceremony,
 * ecosystem SVG, health strip, rhythm planner. No feedback collection, analytics, or execution.
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

  function hubHref(rel) {
    var r = String(rel || '').replace(/\\/g, '/');
    if (!r) return '#';
    return rootPrefix() + (r.startsWith('/') ? r : '/' + r);
  }

  function pillClass(sig) {
    var s = String(sig || '').toUpperCase();
    if (s === 'GREEN') return 'amk-map-pill amk-map-pill--green';
    if (s === 'YELLOW' || s === 'PREPARE') return 'amk-map-pill amk-map-pill--yellow';
    if (s === 'RED') return 'amk-map-pill amk-map-pill--red';
    if (s === 'BLUE') return 'amk-map-pill amk-map-pill--blue';
    return 'amk-map-pill amk-map-pill--neutral';
  }

  function pillFromTraffic(data) {
    if (!data || typeof data !== 'object') return '';
    var sig = data.overall_signal || data.signal || '';
    var label = sig ? String(sig).toUpperCase() : 'UNKNOWN';
    return '<span class="' + pillClass(label) + '">' + esc(label) + '</span>';
  }

  function parseHistogramLine(line) {
    var out = { GREEN: 0, YELLOW: 0, ORANGE: 0, RED: 0, BLACK: 0 };
    if (!line || typeof line !== 'string') return out;
    line.split(',').forEach(function (part) {
      var m = part.trim().match(/^([A-Z]+):\s*(\d+)/i);
      if (m) {
        var k = String(m[1]).toUpperCase();
        if (out[k] !== undefined) out[k] = parseInt(m[2], 10) || 0;
      }
    });
    return out;
  }

  async function fetchJson(url) {
    var res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(String(res.status));
    return res.json();
  }

  async function tryFetch(prefix, relPath) {
    if (!relPath) return null;
    var p = relPath.replace(/^\//, '');
    try {
      return await fetchJson(prefix + '/' + p);
    } catch (_) {
      return null;
    }
  }

  function evalHealth(card, P) {
    var ev = card.evaluator;
    if (ev === 'z_traffic') {
      if (!P.traffic) return { chip: 'UNKNOWN', detail: 'Report missing — run npm run z:traffic' };
      var sig = String(P.traffic.overall_signal || P.traffic.signal || '').toUpperCase();
      if (!sig) return { chip: 'UNKNOWN', detail: 'No overall_signal in report' };
      return { chip: sig, detail: 'data/reports/z_traffic_minibots_status.json' };
    }
    if (ev === 'markdown_no_json') {
      return {
        chip: 'UNKNOWN',
        detail: 'No automated JSON receipt for markdown — run npm run verify:md from hub root when needed',
      };
    }
    if (ev === 'z_car2') {
      if (!P.car2 || !P.car2.summary) return { chip: 'UNKNOWN', detail: 'Report missing — run npm run z:car2' };
      var line = parseHistogramLine(P.car2.summary.risk_histogram_line || '');
      if (line.RED > 0) return { chip: 'RED', detail: 'CAR² line histogram shows RED groups' };
      if (line.BLACK > 0) return { chip: 'YELLOW', detail: 'CAR² line histogram shows BLACK — human triage' };
      if (line.ORANGE + line.YELLOW > 80) return { chip: 'YELLOW', detail: 'High ORANGE/YELLOW duplicate mass' };
      if (line.GREEN > 0 && line.YELLOW + line.ORANGE + line.RED + line.BLACK === 0)
        return { chip: 'GREEN', detail: 'Line histogram all GREEN' };
      return { chip: 'YELLOW', detail: 'Mixed CAR² posture — review MD report' };
    }
    if (ev === 'dashboard_verify') {
      if (!P.dashboard) return { chip: 'UNKNOWN', detail: 'Run npm run dashboard:registry-verify' };
      var st = String(P.dashboard.status || '').toLowerCase();
      if (st === 'green') return { chip: 'GREEN', detail: 'Registry verify status green' };
      return { chip: 'RED', detail: 'Registry verify not green — see report' };
    }
    if (ev === 'cross_project_index') {
      if (!P.cross) return { chip: 'UNKNOWN', detail: 'Run npm run z:cross-project:sync if catalog changed' };
      return { chip: 'GREEN', detail: 'Capability index JSON present' };
    }
    if (ev === 'ai_builder_no_report') {
      if (!P.master_registry) return { chip: 'UNKNOWN', detail: 'Master module registry not loaded' };
      return {
        chip: 'BLUE',
        detail: 'Registry artifact present — refresh rhythm is human-run (npm run z:ai-builder:refresh)',
      };
    }
    if (ev === 'zuno_coverage') {
      if (!P.zuno) return { chip: 'UNKNOWN', detail: 'Run npm run zuno:coverage' };
      var sc = P.zuno.summary_counts || {};
      if ((sc.NEEDS_SAFETY_REVIEW || 0) > 6 || (sc.NEEDS_DECISION || 0) > 0)
        return { chip: 'YELLOW', detail: 'Coverage audit shows review or decision backlog' };
      if ((sc.MISSING || 0) > 0) return { chip: 'YELLOW', detail: 'Missing modules flagged' };
      return { chip: 'GREEN', detail: 'Coverage JSON loaded — posture acceptable for snapshot' };
    }
    if (ev === 'json_presence_blue') {
      var key = (card.sources && card.sources[0]) || '';
      var blob = P.presence[key];
      if (!blob) return { chip: 'UNKNOWN', detail: 'File not loaded — check path or run sync' };
      return { chip: 'BLUE', detail: 'Policy JSON present — human doctrine review' };
    }
    if (ev === 'nav_catalog') {
      if (!P.nav_catalog) return { chip: 'UNKNOWN', detail: 'NAV catalog missing on disk' };
      return { chip: 'GREEN', detail: 'Universe service catalog JSON present' };
    }
    if (ev === 'magical_registry') {
      if (!P.magical) return { chip: 'UNKNOWN', detail: 'Magical visual registry missing' };
      return { chip: 'GREEN', detail: 'Magical visual capability registry present' };
    }
    return { chip: 'UNKNOWN', detail: 'No evaluator' };
  }

  function healthChipToStrokeClass(chip) {
    var c = String(chip || '').toUpperCase();
    if (c === 'GREEN') return 'amk-eco-stroke--green';
    if (c === 'YELLOW') return 'amk-eco-stroke--yellow';
    if (c === 'RED') return 'amk-eco-stroke--red';
    if (c === 'BLUE') return 'amk-eco-stroke--blue';
    return 'amk-eco-stroke--unknown';
  }

  function polar(cx, cy, r, deg) {
    var rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function shapeSvg(shape, strokeClass) {
    var sc = strokeClass || 'amk-eco-stroke--unknown';
    switch (shape) {
      case 'circle':
        return '<circle r="20" class="amk-eco-shape ' + sc + '" />';
      case 'square':
        return '<rect x="-18" y="-18" width="36" height="36" rx="5" class="amk-eco-shape ' + sc + '" />';
      case 'diamond':
        return '<polygon points="0,-22 16,0 0,22 -16,0" class="amk-eco-shape ' + sc + '" />';
      case 'hexagon': {
        var pts = [];
        for (var i = 0; i < 6; i++) {
          var a = (-90 + i * 60) * (Math.PI / 180);
          pts.push(Math.cos(a) * 22 + ',' + Math.sin(a) * 22);
        }
        return '<polygon points="' + pts.join(' ') + '" class="amk-eco-shape ' + sc + '" />';
      }
      case 'octagon': {
        var p2 = [];
        for (var j = 0; j < 8; j++) {
          var b = (-90 + j * 45) * (Math.PI / 180);
          p2.push(Math.cos(b) * 24 + ',' + Math.sin(b) * 24);
        }
        return '<polygon points="' + p2.join(' ') + '" class="amk-eco-shape amk-eco-core ' + sc + '" />';
      }
      case 'shield':
        return (
          '<path d="M0,-24 L20,-14 L18,12 L0,24 L-18,12 L-20,-14 Z" class="amk-eco-shape ' + sc + '" />'
        );
      case 'star': {
        var outer = 22;
        var inner = 9;
        var pts3 = [];
        for (var k = 0; k < 10; k++) {
          var rad2 = ((-90 + k * 36) * Math.PI) / 180;
          var rad3 = k % 2 === 0 ? outer : inner;
          pts3.push(Math.cos(rad2) * rad3 + ',' + Math.sin(rad2) * rad3);
        }
        return '<polygon points="' + pts3.join(' ') + '" class="amk-eco-shape ' + sc + '" />';
      }
      case 'spiral':
        return (
          '<path d="M-4,-4 C8,-12 18,0 6,10 C-6,20 -16,8 -8,-2 C0,-12 14,-6 10,8" fill="none" class="amk-eco-spiral ' +
          sc +
          '" />'
        );
      default:
        return '<circle r="16" class="amk-eco-shape ' + sc + '" />';
    }
  }

  function lineClass(style) {
    if (style === 'root') return 'amk-eco-line amk-eco-line--root';
    if (style === 'dashed') return 'amk-eco-line amk-eco-line--dashed';
    return 'amk-eco-line amk-eco-line--solid';
  }

  function renderEcosystem(svgEl, map, healthByCardId) {
    if (!svgEl || !map.ecosystem_canvas) return;
    var eco = map.ecosystem_canvas;
    var vb = eco.viewBox || '0 0 920 640';
    svgEl.setAttribute('viewBox', vb);
    svgEl.setAttribute('width', '100%');
    svgEl.setAttribute('height', 'auto');
    var cx = eco.center.x;
    var cy = eco.center.y;
    var parts = [];
    parts.push('<rect x="0" y="0" width="920" height="640" class="amk-eco-bg" />');

    (eco.nodes || []).forEach(function (node) {
      var pos = polar(cx, cy, node.radius || 200, node.angle_deg || 0);
      var edge = node.edge_to_core || 'solid';
      parts.push(
        '<line x1="' +
          cx +
          '" y1="' +
          cy +
          '" x2="' +
          pos.x +
          '" y2="' +
          pos.y +
          '" class="' +
          lineClass(edge) +
          '" />'
      );
    });

    parts.push('<g class="amk-eco-center-group" transform="translate(' + cx + ',' + cy + ')">');
    parts.push(shapeSvg(eco.center.shape || 'octagon', 'amk-eco-stroke--blue'));
    parts.push(
      '<text y="42" text-anchor="middle" class="amk-eco-label amk-eco-label--core">' +
        esc(eco.center.label) +
        '</text></g>'
    );

    (eco.nodes || []).forEach(function (node) {
      var pos = polar(cx, cy, node.radius || 200, node.angle_deg || 0);
      var bind = node.health_bind || '';
      var chip = healthByCardId[bind];
      var stroke = healthChipToStrokeClass(chip || 'UNKNOWN');
      if (bind === 'reference_lane') stroke = 'amk-eco-stroke--blue';
      parts.push('<g transform="translate(' + pos.x + ',' + pos.y + ')">');
      parts.push(shapeSvg(node.shape || 'square', stroke));
      parts.push(
        '<text y="36" text-anchor="middle" class="amk-eco-label">' + esc(node.label) + '</text></g>'
      );
    });

    svgEl.innerHTML = parts.join('');
  }

  function renderCanvasIntro(introEl, legendEl, map) {
    if (!map.ecosystem_canvas) return;
    var eco = map.ecosystem_canvas;
    if (introEl) introEl.textContent = eco.intro || '';
    if (!legendEl || !eco.shape_legend) return;
    var html = '<ul class="amk-eco-legend-list">';
    eco.shape_legend.forEach(function (row) {
      html += '<li><span class="amk-eco-legend-shape">' + esc(row.shape) + '</span> ' + esc(row.meaning) + '</li>';
    });
    html += '</ul>';
    legendEl.innerHTML = html;
  }

  function renderHealthMount(mount, map, healthResults) {
    if (!mount || !map.health_monitor_cards) return;
    var html = '<div class="amk-health-grid">';
    map.health_monitor_cards.forEach(function (card) {
      var r = healthResults[card.id] || { chip: 'UNKNOWN', detail: '' };
      html += '<article class="amk-health-card">';
      html += '<h3 class="amk-health-card-title">' + esc(card.title) + '</h3>';
      html += '<div class="amk-health-card-pill"><span class="' + pillClass(r.chip) + '">' + esc(r.chip) + '</span></div>';
      html += '<p class="amk-health-card-detail">' + esc(r.detail) + '</p>';
      html += '<div class="amk-map-links">';
      (card.sources || []).forEach(function (src) {
        html += '<a href="' + esc(hubHref(src)) + '">' + esc(src.split('/').pop()) + '</a> ';
      });
      if (card.doc) {
        html += '<a href="' + esc(hubHref(card.doc)) + '">Doc</a>';
      }
      html += '</div></article>';
    });
    html += '</div>';
    html +=
      '<p class="amk-map-foot" style="border:0;margin-top:0.85rem;padding:0">Health cards are read-only. Missing JSON shows <strong>UNKNOWN</strong> — never a fake GREEN.</p>';
    mount.innerHTML = html;
  }

  function renderRhythmMount(mount, map) {
    if (!mount || !map.rhythm_schedule) return;
    var rs = map.rhythm_schedule;
    var html =
      '<p class="amk-rhythm-disclaimer"><strong>' +
      esc(rs.disclaimer || '') +
      '</strong></p><p class="amk-rhythm-legend">' +
      esc(rs.chip_legend || '') +
      '</p><ul class="amk-rhythm-list">';
    (rs.items || []).forEach(function (it) {
      html += '<li class="amk-rhythm-row"><span class="' + pillClass(it.chip) + '">' + esc(it.chip) + '</span>';
      html += '<span class="amk-rhythm-when">' + esc(it.when) + '</span>';
      html += '<code class="amk-rhythm-cmd">' + esc(it.commands) + '</code></li>';
    });
    html += '</ul>';
    mount.innerHTML = html;
  }

  function renderTopCards(mount, map, traffic) {
    if (!mount || !map.top_cards) return;
    var cards = map.top_cards;
    var html = '<div class="amk-map-cards">';
    cards.forEach(function (c) {
      var extra = '';
      if (c.id === 'traffic' && traffic) {
        extra = '<div>' + pillFromTraffic(traffic) + '</div>';
      }
      html += '<div class="amk-map-card" id="amk-card-' + esc(c.id) + '">';
      html += '<h3>' + esc(c.title) + '</h3>';
      html += '<p>' + esc(c.body) + '</p>';
      html += extra;
      html += '</div>';
    });
    html += '</div>';
    mount.innerHTML = html;
  }

  function renderHero(mount, map) {
    if (!mount || !map.hero) return;
    var h = map.hero;
    var paths = Array.isArray(h.paths) ? h.paths : [];
    var html = '<h2 id="amk-hero-heading">' + esc(h.question) + '</h2><div class="amk-map-hero-grid">';
    paths.forEach(function (p) {
      var href = p.href || '#';
      html +=
        '<a class="amk-map-hero-path" href="' +
        esc(href) +
        '"><span class="amk-path-label">' +
        esc(p.label) +
        '</span><span class="amk-path-blurb">' +
        esc(p.blurb) +
        '</span></a>';
    });
    html += '</div>';
    mount.innerHTML = html;
  }

  function renderQueue(mount, notifPayload, map) {
    if (!mount) return;
    if (!notifPayload || !Array.isArray(notifPayload.notifications)) {
      mount.innerHTML =
        '<p class="amk-map-error">No notification queue loaded (serve hub over HTTP and ensure data/amk_operator_notifications.json exists).</p>';
      return;
    }
    var items = notifPayload.notifications.slice().sort(function (a, b) {
      var ap = a.status === 'pending' ? 0 : 1;
      var bp = b.status === 'pending' ? 0 : 1;
      if (ap !== bp) return ap - bp;
      return String(a.id).localeCompare(String(b.id));
    });
    var html = '<div class="amk-map-queue">';
    items.slice(0, 6).forEach(function (n) {
      html += '<article class="amk-map-queue-card">';
      html += '<h4>' + esc(n.title) + '</h4>';
      html += '<div class="amk-map-queue-meta">';
      html += '<span class="' + pillClass(n.signal) + '">' + esc(n.signal) + '</span>';
      html +=
        '<span class="amk-map-pill amk-map-pill--neutral">Risk: ' + esc(n.risk_class) + '</span>';
      html += '<span class="amk-map-pill amk-map-pill--neutral">' + esc(n.autonomy_level) + '</span>';
      html += '<span class="amk-map-pill amk-map-pill--neutral">' + esc(n.status) + '</span>';
      html += '</div>';
      html += '<div class="amk-map-card"><p style="font-size:0.8rem;margin:0">' + esc(n.domain) + ' · ' + esc(n.recommended_by) + '</p></div>';
      html += '</article>';
    });
    html += '</div>';
    html +=
      '<p class="amk-map-foot" style="border:0;margin-top:0.75rem;padding:0">Full panel with confirmation stubs: <a href="./index-skk-rkpk.html#zAmkNotificationsPanel">Unified dashboard — AMK notifications</a>. ' +
      esc((map && map.confirmation_notice) || '') +
      '</p>';
    mount.innerHTML = html;
  }

  function renderSealed(mount, list) {
    if (!mount || !Array.isArray(list)) return;
    var html = '<div class="amk-map-sealed-grid">';
    list.forEach(function (s) {
      html += '<div class="amk-map-sealed-item">';
      html += '<strong>' + esc(s.name) + '</strong>';
      html += '<div class="amk-sealed-status">' + esc(s.status_label) + '</div>';
      html += '<div style="color:var(--amk-muted);font-size:0.78rem">' + esc(s.summary) + '</div>';
      html += '<div class="amk-map-links">';
      if (s.doc) {
        html += '<a href="' + esc(hubHref(s.doc)) + '">Doc</a>';
      }
      if (s.report) {
        html += '<a href="' + esc(hubHref(s.report)) + '">Report JSON</a>';
      }
      if (s.data) {
        html += '<a href="' + esc(hubHref(s.data)) + '">Data JSON</a>';
      }
      html += '</div></div>';
    });
    html += '</div>';
    mount.innerHTML = html;
  }

  function renderProjectMap(mount, list) {
    if (!mount || !Array.isArray(list)) return;
    var html = '<ul class="amk-map-ul">';
    list.forEach(function (p) {
      html +=
        '<li><a href="' +
        esc(p.href || '#') +
        '">' +
        esc(p.name) +
        '</a> — ' +
        esc(p.note) +
        '</li>';
    });
    html += '</ul>';
    mount.innerHTML = html;
  }

  function renderSafeNow(mount, block) {
    if (!mount || !block) return;
    var html = '<p style="margin:0 0 0.5rem;font-size:0.85rem;color:var(--amk-muted)">' + esc(block.intro) + '</p><ul class="amk-map-ul">';
    (block.items || []).forEach(function (it) {
      html += '<li><strong style="color:var(--amk-text-soft)">' + esc(it.title) + '</strong> — ' + esc(it.note) + '</li>';
    });
    html += '</ul>';
    mount.innerHTML = html;
  }

  function renderBlocked(mount, block) {
    if (!mount || !block || !Array.isArray(block.categories)) return;
    var html = '';
    block.categories.forEach(function (cat) {
      html += '<div class="amk-map-blocked-block">';
      html += '<h4>' + esc(cat.title) + '</h4>';
      html += '<ul class="amk-map-ul">';
      (cat.items || []).forEach(function (line) {
        html += '<li>' + esc(line) + '</li>';
      });
      html += '</ul></div>';
    });
    mount.innerHTML = html;
  }

  function renderReceipts(mount, rows) {
    if (!mount || !Array.isArray(rows)) return;
    var html = '<ul class="amk-map-ul">';
    rows.forEach(function (r) {
      html += '<li>';
      html += esc(r.label);
      if (r.doc) {
        html += ' — <a href="' + esc(hubHref(r.doc)) + '">doc</a>';
      }
      if (r.report) {
        html += ' — <a href="' + esc(hubHref(r.report)) + '">report</a>';
      }
      if (r.data) {
        html += ' — <a href="' + esc(hubHref(r.data)) + '">data</a>';
      }
      html += '</li>';
    });
    html += '</ul>';
    mount.innerHTML = html;
  }

  function renderLegalWorkstation(mount, legalOps, legalProductOps) {
    if (!mount) return;
    var cards = [
      {
        title: 'Legal Evidence Core',
        blurb: 'Proof-first legal evidence concept for AI/services posture.',
        doc: 'docs/Z_LEGAL_EVIDENCE_CORE.md',
        report: legalOps,
      },
      {
        title: 'Lawyer Workstation',
        blurb: 'Private future review cockpit concept (no runtime authority).',
        doc: 'docs/Z_LAWYER_WORKSTATION_CONTROL_CENTRE.md',
        report: legalOps,
      },
      {
        title: 'Guardian Legal Circle',
        blurb: 'Real-world advisor layer only under written agreement.',
        doc: 'docs/Z_GUARDIAN_LEGAL_CIRCLE.md',
        report: legalOps,
      },
      {
        title: 'Product/IP Compliance',
        blurb: 'AI + physical product + IP + safety + supplier review worlds (concept-only).',
        doc: 'docs/Z_LEGAL_PRODUCT_IP_COMPLIANCE_WORKSTATION.md',
        report: legalProductOps,
      },
      {
        title: 'Product families',
        blurb: 'Z-Octave, Neuro-Matrix, inhaler, wearables, connected devices and future sensors.',
        doc: 'docs/Z_LEGAL_PRODUCT_SAFETY_AND_IP_POLICY.md',
        report: legalProductOps,
      },
      {
        title: 'BLUE legal review gates',
        blurb: 'Health-claim, manufacturer contact, and IP filing remain human/legal review lanes.',
        doc: 'docs/Z_LEGAL_PRODUCT_SAFETY_AND_IP_POLICY.md',
        report: legalProductOps,
      },
    ];
    var html = '<div class="amk-map-cards">';
    cards.forEach(function (card) {
      var sig = card.report && card.report.signal ? String(card.report.signal).toUpperCase() : 'UNKNOWN';
      html += '<article class="amk-map-card">';
      html += '<h3>' + esc(card.title) + '</h3>';
      html += '<p>' + esc(card.blurb) + '</p>';
      html += '<div class="amk-map-queue-meta"><span class="' + pillClass(sig) + '">' + esc(sig) + '</span></div>';
      html += '<div class="amk-map-links">';
      html += '<a href="' + esc(hubHref(card.doc)) + '">Doc</a> ';
      if (card.report === legalOps) {
        html += '<a href="' + esc(hubHref('data/reports/z_legal_ops_report.json')) + '">Report JSON</a> ';
      } else if (card.report === legalProductOps) {
        html += '<a href="' + esc(hubHref('data/reports/z_legal_product_ops_report.json')) + '">Report JSON</a> ';
      }
      html += '</div></article>';
    });
    html += '</div>';

    var chips = ['NO LEGAL ADVICE', 'NO ENDORSEMENT', 'NO CLIENT DATA', 'NO PRODUCT LAUNCH', 'LAWYER REVIEW'];
    html += '<div class="amk-map-queue-meta" style="margin-top:0.75rem">';
    chips.forEach(function (c) {
      html += '<span class="amk-map-pill amk-map-pill--neutral">' + esc(c) + '</span> ';
    });
    html += '</div>';

    var legalBlue = [];
    var productBlue = [];
    if (legalOps && Array.isArray(legalOps.sample_results)) {
      legalBlue = legalOps.sample_results.filter(function (r) {
        return String(r.signal || '').toUpperCase() === 'BLUE';
      });
    }
    if (legalProductOps && Array.isArray(legalProductOps.sample_results)) {
      productBlue = legalProductOps.sample_results.filter(function (r) {
        return String(r.signal || '').toUpperCase() === 'BLUE';
      });
    }
    html += '<div class="amk-map-blocked-block" style="margin-top:0.75rem">';
    html += '<h4>Legal review queue (BLUE rows)</h4><ul class="amk-map-ul">';
    legalBlue.forEach(function (r) {
      html += '<li>Legal ops — ' + esc(r.sample_id) + '</li>';
    });
    productBlue.forEach(function (r) {
      html += '<li>Product ops — ' + esc(r.sample_id) + '</li>';
    });
    if (legalBlue.length === 0 && productBlue.length === 0) {
      html += '<li>No BLUE rows loaded from current reports.</li>';
    }
    html += '</ul></div>';

    html +=
      '<p class="amk-map-foot" style="border:0;margin-top:0.65rem;padding:0">Visibility panel only. Lawyer dashboard ≠ endorsement. AI summary ≠ legal advice. Product map ≠ launch.</p>';
    mount.innerHTML = html;
  }

  function renderLegalToolbelt(mount, toolbeltRegistry) {
    if (!mount) return;
    if (!toolbeltRegistry || !Array.isArray(toolbeltRegistry.toolbelt_tools)) {
      mount.innerHTML = '<p class="amk-map-error">Toolbelt registry missing. Serve over HTTP and verify data/z_legal_toolbelt_registry.json exists.</p>';
      return;
    }
    var html = '<div class="amk-map-cards">';
    toolbeltRegistry.toolbelt_tools.forEach(function (tool) {
      html += '<article class="amk-map-card">';
      html += '<h3>' + esc(tool.name) + '</h3>';
      html += '<p>' + esc(tool.purpose) + '</p>';
      html += '<div class="amk-map-queue-meta"><span class="amk-map-pill amk-map-pill--neutral">' + esc(String(tool.phase_1_posture || '').toUpperCase()) + '</span></div>';
      html += '</article>';
    });
    html += '</div>';
    html += '<div class="amk-map-links" style="margin-top:0.75rem">';
    html += '<a href="' + esc(hubHref('docs/Z_LEGAL_WORKSTATION_TOOLBELT.md')) + '">Toolbelt doc</a> ';
    html += '<a href="' + esc(hubHref('data/z_legal_toolbelt_registry.json')) + '">Registry JSON</a>';
    html += '</div>';
    if (Array.isArray(toolbeltRegistry.locked_law) && toolbeltRegistry.locked_law.length) {
      html += '<div class="amk-map-blocked-block" style="margin-top:0.75rem"><h4>Locked law</h4><ul class="amk-map-ul">';
      toolbeltRegistry.locked_law.forEach(function (line) {
        html += '<li>' + esc(line) + '</li>';
      });
      html += '</ul></div>';
    }
    mount.innerHTML = html;
  }

  function renderLaw(mount, map) {
    if (!mount) return;
    var lines = Array.isArray(map.confirmation_law) ? map.confirmation_law : [];
    var html =
      '<p><strong>Confirmation law</strong> — ' + esc(map.confirmation_notice || '') + '</p><ul class="amk-map-ul">';
    lines.forEach(function (L) {
      html += '<li>' + esc(L) + '</li>';
    });
    html += '</ul>';
    mount.innerHTML = html;
  }

  function renderStrip(mount, map) {
    if (!mount || !map.status_strip) return;
    var s = map.status_strip;
    mount.innerHTML =
      '<p style="margin:0 0 0.35rem;font-size:0.82rem;color:var(--amk-muted)">' +
      esc(s.turtle_mode_line) +
      '</p><p style="margin:0;font-size:0.82rem;color:var(--amk-muted)">' +
      esc(s.runtime_line) +
      '</p>';
  }

  var FLEX_LS = {
    cat: 'amkDashFlex_category_v1',
    drawer: 'amkDashFlex_drawer_v1',
    density: 'amkDashFlex_density_v1',
    focus: 'amkDashFlex_focus_v1',
    insp: 'amkDashFlex_inspector_v1',
    read: 'amkDashFlex_read_v1',
    board: 'amkDashFlex_board_v1',
    tools: 'amkDashFlex_tools_open_v1',
  };

  var __amkDashState = {
    activeCategory: 'overview',
    layoutReg: null,
    map: null,
  };

  function flexLsGet(key, fallback) {
    try {
      var v = window.localStorage.getItem(key);
      return v || fallback;
    } catch (_) {
      return fallback;
    }
  }

  function flexLsSet(key, val) {
    try {
      window.localStorage.setItem(key, val);
    } catch (_) {}
  }

  function chipFromDashboard(d) {
    if (!d) return 'UNKNOWN';
    var st = String(d.status || '').toLowerCase();
    if (st === 'green') return 'GREEN';
    return 'RED';
  }

  function chipFromCar2(c) {
    if (!c || !c.summary) return 'UNKNOWN';
    var line = parseHistogramLine(c.summary.risk_histogram_line || '');
    if (line.RED > 0) return 'RED';
    if (line.BLACK > 0) return 'YELLOW';
    if (line.GREEN > 0 && line.YELLOW + line.ORANGE + line.RED + line.BLACK === 0) return 'GREEN';
    return 'YELLOW';
  }

  function findCategoryDef(reg, id) {
    var list = (reg && reg.categories) || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function renderInspectorChrome(reg, catId) {
    var body = document.getElementById('amkDashInspectorBody');
    if (!body || !reg) return;
    var c = findCategoryDef(reg, catId) || (reg.categories && reg.categories[0]) || {};
    var ins = c.inspector || {};
    var docs = Array.isArray(ins.docs) ? ins.docs : [];
    var docHtml = '';
    docs.forEach(function (d) {
      docHtml += '<li><a href="' + esc(hubHref(d)) + '">' + esc(d.replace(/^docs\//, '')) + '</a></li>';
    });
    body.innerHTML =
      '<p class="amk-dash-inspector-kicker">' +
      esc(c.label || catId) +
      '</p><h3 class="amk-dash-inspector-title">' +
      esc(ins.title || '') +
      '</h3><p><strong>Signal</strong> — ' +
      esc(ins.signal || '') +
      '</p><p><strong>Next safe step</strong> — ' +
      esc(ins.next_safe || '') +
      '</p><p><strong>Law</strong> — ' +
      esc(ins.law || '') +
      '</p><ul class="amk-dash-inspector-docs">' +
      docHtml +
      '</ul>';
  }

  function renderCopyMount(reg) {
    var m = document.getElementById('amkDashCopyMount');
    if (!m || !reg || !reg.copy_commands) return;
    var html = '<div class="amk-dash-copy-grid">';
    reg.copy_commands.forEach(function (row) {
      html +=
        '<button type="button" class="amk-dash-copy-btn" data-amk-copy="' +
        esc(row.command) +
        '" title="Copy only — does not run">' +
        esc(row.label) +
        '</button>';
    });
    html += '</div>';
    m.innerHTML = html;
    m.querySelectorAll('[data-amk-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var t = btn.getAttribute('data-amk-copy') || '';
        if (!t || !navigator.clipboard || !navigator.clipboard.writeText) {
          window.alert('Clipboard unavailable in this browser context.');
          return;
        }
        navigator.clipboard.writeText(t).then(
          function () {
            btn.setAttribute('aria-label', 'Copied');
            window.setTimeout(function () {
              btn.removeAttribute('aria-label');
            }, 1200);
          },
          function () {}
        );
      });
    });
  }

  function renderMiniEco(reg, onPick) {
    var el = document.getElementById('amkDashMiniEco');
    if (!el || !reg || !reg.mini_ecosphere || !reg.mini_ecosphere.nodes) return;
    var html = '<div class="amk-dash-mini-inner"><span class="amk-dash-mini-title">' + esc(reg.mini_ecosphere.title || '') + '</span>';
    html += '<div class="amk-dash-mini-nodes" role="list">';
    reg.mini_ecosphere.nodes.forEach(function (n) {
      html +=
        '<button type="button" role="listitem" class="amk-dash-mini-node" data-amk-mini-cat="' +
        esc(n.category_id) +
        '">' +
        esc(n.label) +
        '</button>';
    });
    html += '</div></div>';
    el.innerHTML = html;
    el.querySelectorAll('[data-amk-mini-cat]').forEach(function (b) {
      b.addEventListener('click', function () {
        onPick(b.getAttribute('data-amk-mini-cat'));
      });
    });
  }

  function renderStatusRail(reg, P, traffic, car2, dashboard) {
    var rail = document.getElementById('amkDashStatusRail');
    if (!rail) return;
    var sr = (reg && reg.status_rail) || {};
    var trafficSig = traffic ? String(traffic.overall_signal || traffic.signal || 'UNKNOWN').toUpperCase() : 'UNKNOWN';
    var mdChip = 'UNKNOWN';
    var carChip = chipFromCar2(car2);
    var dashChip = chipFromDashboard(dashboard);
    rail.innerHTML =
      '<div class="amk-dash-rail-inner">' +
      '<span class="amk-dash-rail-slot"><strong>verify:md</strong> ' +
      esc(mdChip) +
      '</span>' +
      '<span class="amk-dash-rail-slot"><strong>Traffic</strong> <span class="' +
      pillClass(trafficSig) +
      '">' +
      esc(trafficSig) +
      '</span></span>' +
      '<span class="amk-dash-rail-slot"><strong>CAR²</strong> <span class="' +
      pillClass(carChip) +
      '">' +
      esc(carChip) +
      '</span></span>' +
      '<span class="amk-dash-rail-slot"><strong>Dash registry</strong> <span class="' +
      pillClass(dashChip) +
      '">' +
      esc(dashChip) +
      '</span></span>' +
      '<span class="amk-dash-rail-slot"><strong>' +
      esc(sr.api_label || 'API') +
      '</strong> UNKNOWN · <a href="' +
      esc(hubHref(sr.api_doc || 'docs/Z-GITHUB-AI-COMMS-PRECAUTIONS.md')) +
      '">doc</a></span>' +
      '<span class="amk-dash-rail-slot"><strong>' +
      esc(sr.ssws_label || 'SSWS') +
      '</strong> observe-only · <a href="' +
      esc(hubHref(sr.ssws_doc || 'docs/Z-SUPER-OVERSEER-AI.md')) +
      '">doc</a></span>' +
      '<span class="amk-dash-rail-slot"><strong>' +
      esc(sr.cloudflare_label || 'Cloudflare') +
      '</strong> HOLD · <a href="' +
      esc(hubHref(sr.cloudflare_doc || 'docs/Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md')) +
      '">doc</a></span>' +
      '</div>';
  }

  function renderRibbonSignals(traffic, dashboard) {
    var el = document.getElementById('amkRibbonSignals');
    if (!el) return;
    var trafficSig = traffic ? String(traffic.overall_signal || traffic.signal || 'UNKNOWN').toUpperCase() : 'UNKNOWN';
    var dashChip = chipFromDashboard(dashboard);
    el.innerHTML =
      '<span class="amk-dash-ribbon-chip"><strong>Traffic</strong> ' +
      pillFromTraffic(traffic) +
      '</span><span class="amk-dash-ribbon-chip"><strong>Registry</strong> <span class="' +
      pillClass(dashChip) +
      '">' +
      esc(dashChip) +
      '</span></span>';
  }

  function scrollFirstInCategory(catId) {
    var main = document.getElementById('amk-main');
    if (!main || !catId) return;
    var el = main.querySelector('[data-amk-category="' + String(catId).replace(/"/g, '') + '"]');
    if (!el) return;
    if (el.tagName === 'DETAILS') {
      try {
        el.open = true;
      } catch (_) {}
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function applyPanelKeywordFilter(q) {
    var main = document.getElementById('amk-main');
    if (!main) return;
    var needle = String(q || '')
      .trim()
      .toLowerCase();
    main
      .querySelectorAll(
        'details.amk-map-section, header.amk-map-header, footer.amk-map-foot, section.amk-map-hero, div[data-amk-section][data-amk-category]'
      )
      .forEach(function (sec) {
      var blob = (sec.textContent || '').toLowerCase();
      var hit = !needle || blob.indexOf(needle) !== -1;
      sec.classList.toggle('amk-dash-search-hide', !hit);
    });
  }

  function applyCategoryFilter(map, viewId) {
    var cat = __amkDashState.activeCategory;
    var def = getViewDef(map, viewId);
    var hideLens = def.hidden_section_ids || [];
    var focusOnly = document.body.classList.contains('amk-dash-focus-mode');
    document.querySelectorAll('[data-amk-category]').forEach(function (node) {
      var sid = node.getAttribute('data-amk-section');
      var lensHide = sid && hideLens.indexOf(sid) !== -1;
      var catHide = focusOnly && node.getAttribute('data-amk-category') !== cat;
      node.classList.toggle('amk-dash-cat-hidden', catHide || lensHide);
    });
    document.querySelectorAll('#amkDrawerNavMount .amk-dash-drawer-btn').forEach(function (b) {
      var id = b.getAttribute('data-amk-cat');
      var on = id === cat;
      b.classList.toggle('amk-dash-drawer-btn--active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    document.querySelectorAll('#amkDashMiniEco .amk-dash-mini-node').forEach(function (b) {
      b.classList.toggle('amk-dash-mini-node--active', b.getAttribute('data-amk-mini-cat') === cat);
    });
  }

  function setActiveCategory(map, viewId, catId, reg) {
    __amkDashState.activeCategory = catId;
    flexLsSet(FLEX_LS.cat, catId);
    renderInspectorChrome(reg, catId);
    applyCategoryFilter(map, viewId);
    if (!document.body.classList.contains('amk-dash-focus-mode')) {
      scrollFirstInCategory(catId);
    }
  }

  function jumpToSignalPill(sig) {
    var main = document.getElementById('amk-main');
    if (!main) return;
    var sel =
      sig === 'RED' ?
        '.amk-map-pill--red'
      : sig === 'BLUE' ?
        '.amk-map-pill--blue'
      : sig === 'YELLOW' ?
        '.amk-map-pill--yellow'
      : sig === 'GREEN' ?
        '.amk-map-pill--green'
      : '.amk-map-pill--neutral';
    var el = main.querySelector(sel);
    if (!el && sig === 'UNKNOWN') {
      var mountU = document.querySelector('#amkProjectIndicatorsMount .amk-map-pill--neutral');
      if (mountU) {
        el = mountU;
      } else {
        var ind = document.getElementById('amk-indicators-section');
        if (ind) {
          try {
            ind.open = true;
          } catch (_) {}
          ind.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
      }
    }
    if (!el) return;
    var host = el.closest('details') || el.closest('section') || el.closest('[data-amk-section]') || el;
    if (host && host.tagName === 'DETAILS') {
      try {
        host.open = true;
      } catch (_) {}
    }
    host.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function setAllDetailsOpen(open) {
    var main = document.getElementById('amk-main');
    if (!main) return;
    main.querySelectorAll('details.amk-map-section').forEach(function (d) {
      try {
        d.open = open;
      } catch (_) {}
    });
  }

  function renderToolsDrawerContent(reg) {
    var m = document.getElementById('amkToolsMount');
    if (!m) return;
    var html =
      '<div class="amk-dash-tools-grid">' +
      '<button type="button" class="amk-dash-tool-btn" id="amkToolExpandAll">Expand all sections</button>' +
      '<button type="button" class="amk-dash-tool-btn" id="amkToolCollapseAll">Collapse all sections</button>' +
      '<button type="button" class="amk-dash-tool-btn" id="amkToolScrollIndicators">Jump to indicators</button>' +
      '<a class="amk-dash-tool-link" href="' +
      esc(hubHref('docs/AMK_GOKU_MAIN_CONTROL_DASHBOARD.md')) +
      '">Open operator doc</a>' +
      '<a class="amk-dash-tool-link" href="' +
      esc(hubHref('docs/AMK_GOKU_OPERATOR_CONFIRMATION_POLICY.md')) +
      '">Confirmation policy (doc)</a>' +
      '</div>';
    m.innerHTML = html;
    var ex = document.getElementById('amkToolExpandAll');
    var cl = document.getElementById('amkToolCollapseAll');
    var ji = document.getElementById('amkToolScrollIndicators');
    if (ex) ex.addEventListener('click', function () {
      setAllDetailsOpen(true);
    });
    if (cl) cl.addEventListener('click', function () {
      setAllDetailsOpen(false);
    });
    if (ji) {
      ji.addEventListener('click', function () {
        scrollFirstInCategory('indicators');
      });
    }
    if (reg && reg.copy_commands) {
      var cg = '<div class="amk-dash-tools-copyblock"><p class="amk-dash-tools-subh">Copy-only snippets</p>';
      reg.copy_commands.forEach(function (row) {
        cg +=
          '<button type="button" class="amk-dash-tool-copy" data-amk-copy="' +
          esc(row.command) +
          '">Copy only — ' +
          esc(row.label) +
          '</button>';
      });
      cg += '</div>';
      m.innerHTML += cg;
      m.querySelectorAll('.amk-dash-tool-copy').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var t = btn.getAttribute('data-amk-copy') || '';
          if (!t || !navigator.clipboard || !navigator.clipboard.writeText) return;
          navigator.clipboard.writeText(t);
        });
      });
    }
  }

  function setToolsDrawerOpen(open) {
    var dr = document.getElementById('amkToolsDrawer');
    var bd = document.getElementById('amkToolsBackdrop');
    var tg = document.getElementById('amkToolsToggle');
    if (!dr) return;
    dr.hidden = !open;
    if (bd) bd.hidden = !open;
    if (tg) tg.setAttribute('aria-expanded', open ? 'true' : 'false');
    flexLsSet(FLEX_LS.tools, open ? '1' : '0');
    document.body.classList.toggle('amk-dash-tools-open', open);
  }

  function initAmkDashFlexShell(map, bundle) {
    var reg = bundle.layoutReg;
    __amkDashState.layoutReg = reg;
    __amkDashState.map = map;
    if (!reg || !reg.categories) return;

    var viewId = loadSavedViewId(map);

    var savedCat = flexLsGet(FLEX_LS.cat, 'overview');
    if (!findCategoryDef(reg, savedCat)) savedCat = 'overview';
    __amkDashState.activeCategory = savedCat;

    var drawerMount = document.getElementById('amkDrawerNavMount');
    if (drawerMount) {
      var dh = '';
      reg.categories.forEach(function (c) {
        dh +=
          '<button type="button" class="amk-dash-drawer-btn" data-amk-cat="' +
          esc(c.id) +
          '" aria-pressed="' +
          (c.id === savedCat ? 'true' : 'false') +
          '"><span class="amk-dash-drawer-ico" aria-hidden="true">' +
          esc(c.icon || '•') +
          '</span><span class="amk-dash-drawer-lab">' +
          esc(c.label) +
          '</span></button>';
      });
      drawerMount.innerHTML = dh;
      drawerMount.querySelectorAll('[data-amk-cat]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var id = btn.getAttribute('data-amk-cat');
          setActiveCategory(map, loadSavedViewId(map), id, reg);
        });
      });
    }

    renderInspectorChrome(reg, savedCat);
    renderCopyMount(reg);
    renderMiniEco(reg, function (cid) {
      setActiveCategory(map, loadSavedViewId(map), cid, reg);
    });
    renderRibbonSignals(bundle.traffic, bundle.dashboard);
    renderStatusRail(reg, bundle.P, bundle.traffic, bundle.car2, bundle.dashboard);

    applyCategoryFilter(map, viewId);

    window.__amkDashApplyCategory = function () {
      applyCategoryFilter(map, loadSavedViewId(map));
    };

    var dens = flexLsGet(FLEX_LS.density, 'calm');
    document.body.setAttribute('data-amk-density', dens);
    document.querySelectorAll('[data-amk-density]').forEach(function (b) {
      var bon = b.getAttribute('data-amk-density') === dens;
      b.classList.toggle('amk-dash-dens-btn--on', bon);
      b.setAttribute('aria-pressed', bon ? 'true' : 'false');
      b.addEventListener('click', function () {
        var d = b.getAttribute('data-amk-density') || 'calm';
        flexLsSet(FLEX_LS.density, d);
        document.body.setAttribute('data-amk-density', d);
        document.querySelectorAll('[data-amk-density]').forEach(function (x) {
          var xon = x.getAttribute('data-amk-density') === d;
          x.classList.toggle('amk-dash-dens-btn--on', xon);
          x.setAttribute('aria-pressed', xon ? 'true' : 'false');
        });
      });
    });

    var focusCb = document.getElementById('amkDashFocus');
    if (focusCb) {
      focusCb.checked = flexLsGet(FLEX_LS.focus, '0') === '1';
      document.body.classList.toggle('amk-dash-focus-mode', focusCb.checked);
      focusCb.addEventListener('change', function () {
        flexLsSet(FLEX_LS.focus, focusCb.checked ? '1' : '0');
        document.body.classList.toggle('amk-dash-focus-mode', focusCb.checked);
        if (typeof window.__amkDashApplyCategory === 'function') window.__amkDashApplyCategory();
      });
    }

    var drawer = document.getElementById('amkDashDrawer');
    var dToggle = document.getElementById('amkDrawerToggle');
    if (drawer && dToggle) {
      var open = flexLsGet(FLEX_LS.drawer, '1') === '1';
      drawer.classList.toggle('amk-dash-drawer--collapsed', !open);
      dToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      dToggle.addEventListener('click', function () {
        var collapsed = !drawer.classList.contains('amk-dash-drawer--collapsed');
        drawer.classList.toggle('amk-dash-drawer--collapsed', collapsed);
        flexLsSet(FLEX_LS.drawer, collapsed ? '0' : '1');
        dToggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      });
    }

    var insp = document.getElementById('amkDashInspectorChrome');
    var inspT = document.getElementById('amkDashInspectorToggle');
    if (insp && inspT) {
      var inspOpen = flexLsGet(FLEX_LS.insp, '1') === '1';
      insp.classList.toggle('amk-dash-inspector-chrome--off', !inspOpen);
      inspT.setAttribute('aria-expanded', inspOpen ? 'true' : 'false');
      inspT.addEventListener('click', function () {
        var off = !insp.classList.contains('amk-dash-inspector-chrome--off');
        insp.classList.toggle('amk-dash-inspector-chrome--off', off);
        flexLsSet(FLEX_LS.insp, off ? '0' : '1');
        inspT.setAttribute('aria-expanded', off ? 'false' : 'true');
      });
    }

    var search = document.getElementById('amkDashSearch');
    if (search) {
      function runBookSearch() {
        var q = String(search.value || '')
          .trim()
          .toLowerCase();
        applyPanelKeywordFilter(q);
        if (drawerMount) {
          drawerMount.querySelectorAll('.amk-dash-drawer-btn').forEach(function (btn) {
            var id = btn.getAttribute('data-amk-cat');
            var defc = findCategoryDef(reg, id);
            var hay = defc && defc.haystack ? String(defc.haystack).toLowerCase() : '';
            var lab = btn.textContent.toLowerCase();
            var hit = !q || hay.indexOf(q) !== -1 || lab.indexOf(q) !== -1;
            btn.classList.toggle('amk-dash-drawer-btn--search-hide', !hit);
          });
        }
      }
      search.addEventListener('input', runBookSearch);
      runBookSearch();
    }

    var readCb = document.getElementById('amkDashReadMode');
    if (readCb) {
      readCb.checked = flexLsGet(FLEX_LS.read, '0') === '1';
      document.body.classList.toggle('amk-dash-read-mode', readCb.checked);
      readCb.addEventListener('change', function () {
        flexLsSet(FLEX_LS.read, readCb.checked ? '1' : '0');
        document.body.classList.toggle('amk-dash-read-mode', readCb.checked);
      });
    }
    var boardCb = document.getElementById('amkDashBoardMode');
    if (boardCb) {
      boardCb.checked = flexLsGet(FLEX_LS.board, '0') === '1';
      document.body.classList.toggle('amk-dash-board-mode', boardCb.checked);
      boardCb.addEventListener('change', function () {
        flexLsSet(FLEX_LS.board, boardCb.checked ? '1' : '0');
        document.body.classList.toggle('amk-dash-board-mode', boardCb.checked);
      });
    }

    document.querySelectorAll('[data-amk-jump-sig]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        jumpToSignalPill(btn.getAttribute('data-amk-jump-sig') || '');
      });
    });

    renderToolsDrawerContent(reg);
    var toolsOpen = flexLsGet(FLEX_LS.tools, '0') === '1';
    setToolsDrawerOpen(toolsOpen);
    var tt = document.getElementById('amkToolsToggle');
    var tc = document.getElementById('amkToolsClose');
    var tb = document.getElementById('amkToolsBackdrop');
    if (tt) {
      tt.addEventListener('click', function () {
        var dr = document.getElementById('amkToolsDrawer');
        setToolsDrawerOpen(!dr || dr.hidden);
      });
    }
    if (tc) tc.addEventListener('click', function () {
      setToolsDrawerOpen(false);
    });
    if (tb) tb.addEventListener('click', function () {
      setToolsDrawerOpen(false);
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && document.body.classList.contains('amk-dash-tools-open')) {
        setToolsDrawerOpen(false);
      }
    });
  }

  var VIEW_LS = 'amkGokuDomainView_v1';

  function getViewDef(map, id) {
    var list = map.domain_views || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return (
      list[0] || {
        id: 'amk_operator',
        allowed_sensitivity: ['none', 'learning', 'ops', 'commercial', 'admin', 'security'],
        hidden_section_ids: [],
      }
    );
  }

  function loadSavedViewId(map) {
    try {
      var v = window.localStorage.getItem(VIEW_LS);
      if (v && getViewDef(map, v).id === v) return v;
    } catch (_) {}
    return 'amk_operator';
  }

  function saveViewId(id) {
    try {
      window.localStorage.setItem(VIEW_LS, id);
    } catch (_) {}
  }

  function applyView(map, viewId) {
    document.body.setAttribute('data-amk-view', viewId);
    var def = getViewDef(map, viewId);
    var hide = def.hidden_section_ids || [];
    document.querySelectorAll('[data-amk-section]').forEach(function (el) {
      var sid = el.getAttribute('data-amk-section');
      el.hidden = hide.indexOf(sid) !== -1;
    });
    var fp = document.getElementById('amkFriendlyPanel');
    if (fp) {
      var showFriendly = viewId === 'kids' || viewId === 'public_visitor';
      fp.hidden = !showFriendly;
      if (showFriendly) {
        fp.innerHTML =
          '<p class="amk-friendly-lead">' +
          esc(def.welcome_paragraph || '') +
          '</p><p class="amk-friendly-hint">' +
          esc(def.emphasis_hint || '') +
          '</p>';
      } else {
        fp.innerHTML = '';
      }
    }
    var em = document.getElementById('amkEmphasisHint');
    if (em) em.textContent = def.emphasis_hint || '';
    if (typeof window.__amkDashApplyCategory === 'function') {
      window.__amkDashApplyCategory();
    }
  }

  function catalogAllowed(item, def) {
    var allow = def.allowed_sensitivity || [];
    var tier = item.sensitivity_tier || 'none';
    return allow.indexOf(tier) !== -1;
  }

  function renderDomainBar(map, onViewChange) {
    var mount = document.getElementById('amkDomainBarMount');
    if (!mount || !map.domain_views) return 'amk_operator';
    var cur = loadSavedViewId(map);
    var html =
      '<label class="amk-domain-label" for="amkDomainSelect">View as</label> <select id="amkDomainSelect" class="amk-domain-select" aria-label="Domain or age lens">';
    map.domain_views.forEach(function (v) {
      html +=
        '<option value="' +
        esc(v.id) +
        '"' +
        (v.id === cur ? ' selected' : '') +
        '>' +
        esc(v.label) +
        '</option>';
    });
    html += '</select> <span id="amkEmphasisHint" class="amk-emphasis-hint" aria-live="polite"></span>';
    mount.innerHTML = html;
    var sel = document.getElementById('amkDomainSelect');
    if (sel) {
      sel.addEventListener('change', function () {
        saveViewId(sel.value);
        onViewChange(sel.value);
      });
    }
    return cur;
  }

  function renderSideCatalog(mount, map, viewId) {
    if (!mount) return;
    if (!map.service_catalog_sidebar || !map.service_catalog_sidebar.length) {
      mount.innerHTML = '<p class="amk-catalog-empty">No catalog rows in map JSON.</p>';
      return;
    }
    var def = getViewDef(map, viewId);
    var html = '<div class="amk-catalog-list">';
    map.service_catalog_sidebar.forEach(function (item) {
      if (!catalogAllowed(item, def)) return;
      html +=
        '<article class="amk-catalog-card amk-catalog-card--' +
        esc(item.sensitivity_tier || 'none') +
        '">';
      html += '<div class="amk-catalog-head"><span class="amk-catalog-icon">' + esc(item.icon) + '</span> ';
      html += '<span class="amk-catalog-name">' + esc(item.display_name) + '</span></div>';
      html += '<p class="amk-catalog-desc">' + esc(item.short_description) + '</p>';
      html += '<div class="amk-catalog-meta">';
      html += '<span class="amk-map-pill amk-map-pill--neutral">' + esc(item.domain) + '</span> ';
      html += '<span class="' + pillClass(item.signal_color) + '">' + esc(item.signal_color) + '</span> ';
      html += '<span class="amk-map-pill amk-map-pill--neutral">Risk: ' + esc(item.risk_class) + '</span>';
      html += '</div>';
      html +=
        '<p class="amk-catalog-sub">Bridge: ' +
        esc(item.bridge_status) +
        ' · Ages: ' +
        esc((item.age_suitability || []).join(', ')) +
        '</p>';
      if (viewId === 'enterprise' || viewId === 'business' || viewId === 'amk_operator') {
        html +=
          '<p class="amk-catalog-sub">Pricing: ' +
          esc(item.pricing_owner) +
          ' · Entitlements: ' +
          esc(item.entitlement_owner) +
          '</p>';
      }
      html += '<div class="amk-map-links">';
      (item.related_docs || []).forEach(function (d) {
        html += '<a href="' + esc(hubHref(d)) + '">' + esc(d.replace(/^docs\//, '')) + '</a> ';
      });
      (item.related_reports || []).forEach(function (r) {
        html += '<a href="' + esc(hubHref(r)) + '">' + esc(r.split('/').pop()) + '</a> ';
      });
      html += '</div></article>';
    });
    html += '</div>';
    mount.innerHTML = html;
  }

  function scoreOrUnknown(v) {
    if (v === null || v === undefined || v === '') return 'UNKNOWN';
    return String(v);
  }

  function renderReadinessObservatory(mount, map) {
    if (!mount || !map.readiness_observatory) return;
    var html =
      '<p class="amk-obs-intro">Internal readiness metadata only — not public certification, not a ranking, not live user feedback (consent + privacy + 14 DRP gates apply before any feedback collection).</p>';
    html += '<div class="amk-obs-grid">';
    map.readiness_observatory.forEach(function (row) {
      html += '<article class="amk-obs-card"><h3>' + esc(row.display_name || row.module_id) + '</h3>';
      html += '<dl class="amk-obs-dl">';
      html += '<dt>Readiness</dt><dd>' + esc(scoreOrUnknown(row.readiness_score)) + '</dd>';
      html += '<dt>Trust</dt><dd>' + esc(scoreOrUnknown(row.trust_score)) + '</dd>';
      html += '<dt>Accessibility</dt><dd>' + esc(scoreOrUnknown(row.accessibility_score)) + '</dd>';
      html += '<dt>Benchmark</dt><dd>' + esc(row.benchmark_status || 'UNKNOWN') + '</dd>';
      html += '<dt>Maintenance</dt><dd>' + esc(row.maintenance_signal || 'UNKNOWN') + '</dd>';
      html += '<dt>Upgrade need</dt><dd>' + esc(row.upgrade_need || 'UNKNOWN') + '</dd>';
      html += '<dt>Feedback</dt><dd>' + esc(row.feedback_status || 'UNKNOWN') + '</dd>';
      html += '</dl><p class="amk-obs-note">' + esc(row.inspector_notes || '') + '</p></article>';
    });
    html += '</div>';
    mount.innerHTML = html;
  }

  function renderInspector(mount, map) {
    if (!mount || !map.inspector_advisory) return;
    var ia = map.inspector_advisory;
    var html = '<p class="amk-inspector-intro">' + esc(ia.intro || '') + '</p>';
    html += '<p class="amk-inspector-law"><strong>' + esc(ia.law_line || '') + '</strong></p><ul class="amk-inspector-list">';
    (ia.rows || []).forEach(function (r) {
      html +=
        '<li><strong>' +
        esc(r.label) +
        '</strong> — ' +
        esc(r.watches) +
        ' <span class="amk-inspector-src">(' +
        esc(r.source) +
        ')</span></li>';
    });
    html += '</ul>';
    mount.innerHTML = html;
  }

  function renderLaunchCeremony(mount, map) {
    if (!mount || !map.launch_readiness) return;
    var L = map.launch_readiness;
    var html = '<h3 class="amk-launch-title">' + esc(L.ceremony_title || 'Launch Readiness Ceremony') + '</h3>';
    html += '<p class="amk-launch-status"><span class="' + pillClass(L.status) + '">' + esc(L.status || 'UNKNOWN') + '</span></p>';
    html += '<p class="amk-launch-note">' + esc(L.status_note || '') + '</p>';
    html += '<p class="amk-launch-copy">' + esc(L.launch_key_copy || '') + '</p>';
    html += '<h4 class="amk-launch-subh">Required gates (documentation)</h4><ul class="amk-map-ul">';
    (L.required_gates || []).forEach(function (g) {
      html += '<li>' + esc(g) + '</li>';
    });
    html += '</ul>';
    if (map.blocked_until_gate && L.blocked_categories_mirror) {
      html += '<h4 class="amk-launch-subh">Blocked categories (mirror)</h4>';
      (map.blocked_until_gate.categories || []).forEach(function (cat) {
        html += '<div class="amk-map-blocked-block"><h4>' + esc(cat.title) + '</h4><ul class="amk-map-ul">';
        (cat.items || []).forEach(function (line) {
          html += '<li>' + esc(line) + '</li>';
        });
        html += '</ul></div>';
      });
    }
    html +=
      '<p class="amk-launch-human"><strong>Human approval</strong>: ' +
      (L.human_approval_required ? 'required before any deploy lane.' : 'see policy.') +
      '</p>';
    mount.innerHTML = html;
  }

  async function main() {
    var prefix = rootPrefix();
    var mapUrl = prefix + '/dashboard/data/amk_control_dashboard_map.json';
    var mapMount = document.getElementById('amkMapError');
    var map;

    try {
      map = await fetchJson(mapUrl);
    } catch (e) {
      if (mapMount) {
        mapMount.textContent =
          'Could not load control map JSON. Serve the hub from repo root over HTTP (e.g. npx http-server . -p 5502).';
      }
      return;
    }

    if (mapMount) mapMount.textContent = '';

    var titleEl = document.getElementById('amkMapPageTitle');
    if (titleEl && map.page_title) titleEl.textContent = map.page_title;

    var subEl = document.getElementById('amkMapPageSub');
    if (subEl && map.page_subtitle) subEl.textContent = map.page_subtitle;

    var ecoSum = document.getElementById('amkEcosystemSummary');
    if (ecoSum && map.ecosystem_canvas && map.ecosystem_canvas.title) {
      ecoSum.textContent = map.ecosystem_canvas.title;
    }

    var disclaim = document.getElementById('amkMap3Disclaimer');
    if (disclaim && map.map3_disclaimer) disclaim.textContent = map.map3_disclaimer;

    function onViewChange(viewId) {
      applyView(map, viewId);
      renderSideCatalog(document.getElementById('amkSideCatalogMount'), map, viewId);
      if (typeof window.initZRoot7GuardianPanel === 'function') {
        window.initZRoot7GuardianPanel(prefix, viewId);
      }
    }

    var initialView = renderDomainBar(map, onViewChange);
    onViewChange(initialView);

    var catToggle = document.getElementById('amkCatalogToggle');
    var catAside = document.getElementById('amkSideCatalog');
    if (catToggle && catAside) {
      catToggle.addEventListener('click', function () {
        catAside.classList.toggle('amk-side-catalog--open');
      });
    }

    renderLaw(document.getElementById('amkMapLaw'), map);
    renderStrip(document.getElementById('amkMapStrip'), map);

    var traffic = await tryFetch(prefix, 'data/reports/z_traffic_minibots_status.json');
    var car2 = await tryFetch(prefix, 'data/reports/z_car2_similarity_report.json');
    var zuno = await tryFetch(prefix, 'data/reports/z_zuno_coverage_audit.json');
    var dashboard = await tryFetch(prefix, 'data/reports/z_dashboard_registry_verify.json');
    var cross = await tryFetch(prefix, 'data/z_cross_project_capability_index.json');
    var autonomy = await tryFetch(prefix, 'data/z_autonomy_task_policy.json');
    var vh100 = await tryFetch(prefix, 'data/z_vh100_security_posture.json');
    var mcburb = await tryFetch(prefix, 'data/z_mcburb_backup_policy.json');
    var fbap = await tryFetch(prefix, 'data/z_fbap_event_taxonomy.json');
    var nav_catalog = await tryFetch(prefix, 'dashboard/data/z_universe_service_catalog.json');
    var magical = await tryFetch(prefix, 'data/z_magical_visual_capability_registry.json');
    var master_registry = await tryFetch(prefix, 'data/z_master_module_registry.json');
    var legalOps = await tryFetch(prefix, 'data/reports/z_legal_ops_report.json');
    var legalProductOps = await tryFetch(prefix, 'data/reports/z_legal_product_ops_report.json');
    var legalToolbelt = await tryFetch(prefix, 'data/z_legal_toolbelt_registry.json');

    var presence = {
      'data/z_vh100_security_posture.json': vh100,
      'data/z_mcburb_backup_policy.json': mcburb,
      'data/z_fbap_event_taxonomy.json': fbap,
      'data/z_autonomy_task_policy.json': autonomy,
    };

    var P = {
      traffic: traffic,
      car2: car2,
      zuno: zuno,
      dashboard: dashboard,
      cross: cross,
      master_registry: master_registry,
      presence: presence,
      nav_catalog: nav_catalog,
      magical: magical,
    };

    var healthResults = {};
    (map.health_monitor_cards || []).forEach(function (card) {
      healthResults[card.id] = evalHealth(card, P);
    });

    renderCanvasIntro(
      document.getElementById('amkCanvasIntro'),
      document.getElementById('amkEcosystemLegend'),
      map
    );
    var svgEl = document.getElementById('amkEcosystemSvg');
    if (svgEl && map.ecosystem_canvas) {
      var summary = {};
      (map.health_monitor_cards || []).forEach(function (c) {
        summary[c.id] = (healthResults[c.id] && healthResults[c.id].chip) || 'UNKNOWN';
      });
      renderEcosystem(svgEl, map, summary);
    }

    renderHealthMount(document.getElementById('amkMapHealth'), map, healthResults);
    renderRhythmMount(document.getElementById('amkMapRhythm'), map);

    renderHero(document.getElementById('amkMapHero'), map);
    renderTopCards(document.getElementById('amkMapTopCards'), map, traffic);

    var notifPath = map.notifications_fetch_path || 'data/amk_operator_notifications.json';
    var notif = await tryFetch(prefix, notifPath);
    renderQueue(document.getElementById('amkMapQueue'), notif, map);

    renderSealed(document.getElementById('amkMapSealed'), map.sealed_systems || []);
    renderProjectMap(document.getElementById('amkMapProjects'), map.project_map || []);
    renderSafeNow(document.getElementById('amkMapSafeNow'), map.safe_now);
    renderBlocked(document.getElementById('amkMapBlocked'), map.blocked_until_gate);
    renderReceipts(document.getElementById('amkMapReceipts'), map.receipts_reports || []);
    renderLegalWorkstation(document.getElementById('amkLegalWorkstationMount'), legalOps, legalProductOps);
    renderLegalToolbelt(document.getElementById('amkLegalToolbeltMount'), legalToolbelt);

    renderReadinessObservatory(document.getElementById('amkMapObservatory'), map);
    renderInspector(document.getElementById('amkMapInspector'), map);
    renderLaunchCeremony(document.getElementById('amkMapLaunch'), map);

    var layoutReg = null;
    try {
      layoutReg = await fetchJson(prefix + '/dashboard/data/amk_control_layout_registry.json');
    } catch (_) {
      layoutReg = null;
    }
    initAmkDashFlexShell(map, {
      layoutReg: layoutReg,
      P: P,
      traffic: traffic,
      car2: car2,
      dashboard: dashboard,
    });

    onViewChange(loadSavedViewId(map));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();
