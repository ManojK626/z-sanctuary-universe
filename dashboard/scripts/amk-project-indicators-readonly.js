/**
 * AMK-INDICATOR-1 — Unified readiness indicators + Cloudflare Go/No-Go card (read-only).
 * Optional JSON overlays from hub reports; never fabricates GREEN when data is missing.
 * Local acknowledgement uses localStorage only — does not run tasks, npm, deploy, or bridges.
 */
(function () {
  var LS_ACK = 'amkIndicatorLocalAck_v1';

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

  function barClass(sig) {
    var s = String(sig || '').toUpperCase();
    if (s === 'GREEN') return 'amk-ind-bar amk-ind-bar--green';
    if (s === 'YELLOW') return 'amk-ind-bar amk-ind-bar--yellow';
    if (s === 'BLUE') return 'amk-ind-bar amk-ind-bar--blue';
    if (s === 'RED') return 'amk-ind-bar amk-ind-bar--red';
    if (s === 'PURPLE') return 'amk-ind-bar amk-ind-bar--purple';
    if (s === 'GOLD') return 'amk-ind-bar amk-ind-bar--gold';
    return 'amk-ind-bar';
  }

  function signalRank(sig) {
    var s = String(sig || 'UNKNOWN').toUpperCase();
    if (s === 'RED') return 0;
    if (s === 'BLUE') return 1;
    if (s === 'YELLOW') return 2;
    if (s === 'GREEN') return 3;
    if (s === 'GOLD') return 4;
    if (s === 'PURPLE') return 5;
    return 6;
  }

  function docHref(rel) {
    var r = String(rel || '').replace(/^\//, '');
    return rootPrefix() + '/' + r.split('/').join('/');
  }

  function parseHist(line, key) {
    if (!line || typeof line !== 'string') return null;
    var re = new RegExp(key + ':(\\d+)', 'i');
    var m = line.match(re);
    return m ? parseInt(m[1], 10) : null;
  }

  function car2SignalFromReport(rep) {
    if (!rep || !rep.summary) return null;
    var line = rep.summary.risk_histogram_line || '';
    var win = rep.summary.risk_histogram_window || '';
    var black = (parseHist(line, 'BLACK') || 0) + (parseHist(win, 'BLACK') || 0);
    var red = (parseHist(line, 'RED') || 0) + (parseHist(win, 'RED') || 0);
    if (red > 0) return 'RED';
    if (black > 0) return 'YELLOW';
    var orange = (parseHist(line, 'ORANGE') || 0) + (parseHist(win, 'ORANGE') || 0);
    if (orange > 80) return 'YELLOW';
    return 'GREEN';
  }

  function zunoSignalFromReport(rep) {
    if (!rep || !rep.summary_counts) return null;
    var sc = rep.summary_counts;
    if ((sc.NEEDS_SAFETY_REVIEW || 0) > 0) return 'YELLOW';
    if ((sc.NEEDS_DECISION || 0) > 0) return 'BLUE';
    var h = (rep.ancillary && rep.ancillary.master_registry_status_histogram) || {};
    if ((h.safety_hold || 0) > 0) return 'YELLOW';
    if ((h.decision_required || 0) > 0) return 'BLUE';
    return 'GREEN';
  }

  function cloneRow(r) {
    return JSON.parse(JSON.stringify(r));
  }

  function applyOverlays(rows, overlays) {
    return rows.map(function (r) {
      var row = cloneRow(r);
      var o = row.dynamic_overlay;
      if (o === 'z_traffic' && overlays.traffic && overlays.traffic.traffic_chief) {
        row.signal = overlays.traffic.traffic_chief.overall_signal || row.signal;
        row.last_known_basis =
          (row.last_known_basis || '') +
          ' · Live: z_traffic_minibots_status.json traffic_chief.overall_signal';
      }
      if (o === 'z_susbv_overseer' && overlays.susbv) {
        row.signal = overlays.susbv.overseer_signal || row.signal;
        row.last_known_basis =
          (row.last_known_basis || '') + ' · Live: z_susbv_overseer_report.json overseer_signal';
      }
      if (o === 'z_car2' && overlays.car2) {
        row.signal = car2SignalFromReport(overlays.car2);
        row.last_known_basis =
          (row.last_known_basis || '') + ' · Live: z_car2_similarity_report.json histogram-derived';
      }
      if (o === 'zuno' && overlays.zuno) {
        row.signal = zunoSignalFromReport(overlays.zuno);
        row.last_known_basis =
          (row.last_known_basis || '') + ' · Live: z_zuno_coverage_audit.json summary_counts';
      }
      if (o === 'dashboard_registry' && overlays.dash) {
        var st = String(overlays.dash.status || '').toLowerCase();
        if (st === 'green') row.signal = 'GREEN';
        else if (st === 'hold') row.signal = 'YELLOW';
        else row.signal = 'RED';
        row.last_known_basis =
          (row.last_known_basis || '') +
          ' · Live: z_dashboard_registry_verify.json status=' +
          esc(st);
      }
      if (
        o === 'z_deployment_readiness' &&
        overlays.deploymentReadiness &&
        overlays.deploymentReadiness.rollups
      ) {
        var drs = String(overlays.deploymentReadiness.rollups.ecosystem_signal || '').toUpperCase();
        if (drs) {
          row.signal = drs;
          var hpr = overlays.deploymentReadiness.rollups.hub_indicator_readiness_percent;
          if (typeof hpr === 'number' && !Number.isNaN(hpr)) row.growth_percent = hpr;
        }
        row.last_known_basis =
          (row.last_known_basis || '') +
          ' · Live: z_deployment_readiness_status.json rollups (advisory posture only; not deploy permission)';
      }
      if (o === 'z_ecosystem_awareness' && overlays.ecosystem) {
        var es = String(overlays.ecosystem.overall_signal || '').toUpperCase();
        if (es) {
          row.signal = es;
          row.last_known_basis =
            (row.last_known_basis || '') +
            ' · Live: z_ecosystem_awareness_report.json overall_signal=' +
            esc(es);
        }
      }
      if (o === 'z_api_spine' && overlays.apiSpine) {
        var as = String(overlays.apiSpine.overall_signal || '').toUpperCase();
        if (as) {
          row.signal = as;
          row.last_known_basis =
            (row.last_known_basis || '') +
            ' · Live: z_api_spine_report.json overall_signal=' +
            esc(as);
        }
      }
      if (o === 'z_ssws' && overlays.ssws) {
        var zs = String(overlays.ssws.overall_signal || '').toUpperCase();
        if (zs) {
          row.signal = zs;
          row.last_known_basis =
            (row.last_known_basis || '') +
            ' · Live: z_ssws_launch_requirements_report.json overall_signal=' +
            esc(zs);
        }
      }
      if (o === 'amk_workspace_doorway' && overlays.doorway && overlays.doorway.overall_signal) {
        var ds = String(overlays.doorway.overall_signal || '').toUpperCase();
        if (ds) {
          row.signal = ds;
          row.last_known_basis =
            (row.last_known_basis || '') +
            ' · Live: amk_workspace_doorway_status.json overall_signal=' +
            esc(ds);
        }
      }
      if (
        o === 'amk_cursor_workspace_profiles' &&
        overlays.wsProfiles &&
        overlays.wsProfiles.overall_signal
      ) {
        var ws = String(overlays.wsProfiles.overall_signal || '').toUpperCase();
        if (ws) {
          row.signal = ws;
          row.last_known_basis =
            (row.last_known_basis || '') +
            ' · Live: amk_cursor_workspace_profiles_report.json overall_signal=' +
            esc(ws);
        }
      }
      if (o === 'z_amk_gtai_strategy_council' && overlays.gtai && overlays.gtai.overall_signal) {
        var gt = String(overlays.gtai.overall_signal || '').toUpperCase();
        if (gt) {
          row.signal = gt;
          row.last_known_basis =
            (row.last_known_basis || '') +
            ' · Live: z_amk_gtai_strategy_report.json overall_signal=' +
            esc(gt);
        }
      }
      if (
        o === 'z_logical_brains_cadence_cycle' &&
        overlays.cadence &&
        overlays.cadence.overall_signal
      ) {
        var cs = String(overlays.cadence.overall_signal || '').toUpperCase();
        if (cs) {
          row.signal = cs;
          row.last_known_basis =
            (row.last_known_basis || '') +
            ' · Live: z_cadence_cycle_report.json overall_signal=' +
            esc(cs);
        }
      }
      if (o === 'z_mod_dist' && overlays.modDist && overlays.modDist.signal) {
        var ms = String(overlays.modDist.signal || '').toUpperCase();
        if (ms && ms !== 'UNKNOWN') {
          row.signal = ms;
          row.last_known_basis =
            (row.last_known_basis || '') +
            ' · Live: z_mod_dist_report.json signal=' +
            esc(ms) +
            ' (advisory router validator only)';
        }
      }
      if (o === 'z_replica_fabric' && overlays.replicaFabric && overlays.replicaFabric.signal) {
        var rf = String(overlays.replicaFabric.signal || '').toUpperCase();
        if (rf && rf !== 'UNKNOWN') {
          row.signal = rf;
          row.last_known_basis =
            (row.last_known_basis || '') +
            ' · Live: z_replica_fabric_report.json signal=' +
            esc(rf) +
            ' (doctrine-only fabric validator)';
        }
      }
      if (o === 'z_ultra_mage' && overlays.ultraMage && overlays.ultraMage.signal) {
        var um = String(overlays.ultraMage.signal || '').toUpperCase();
        if (um && um !== 'UNKNOWN') {
          row.signal = um;
          row.last_known_basis =
            (row.last_known_basis || '') +
            ' · Live: z_ultra_mage_formula_report.json signal=' +
            esc(um) +
            ' (formula codex validator)';
        }
      }
      if (o === 'z_mu_truth' && overlays.muTruth && overlays.muTruth.signal) {
        var mx = String(overlays.muTruth.signal || '').toUpperCase();
        if (mx && mx !== 'UNKNOWN') {
          row.signal = mx;
          row.last_known_basis =
            (row.last_known_basis || '') +
            ' · Live: z_mu_truth_report.json signal=' +
            esc(mx) +
            ' (civic truth engine validator)';
        }
      }
      if (o === 'z_mu_advisor' && overlays.muAdvisor && overlays.muAdvisor.signal) {
        var madv = String(overlays.muAdvisor.signal || '').toUpperCase();
        if (madv && madv !== 'UNKNOWN') {
          row.signal = madv;
          row.last_known_basis =
            (row.last_known_basis || '') +
            ' · Live: z_mu_advisor_report.json signal=' +
            esc(madv) +
            ' (civic knowledge advisor validator)';
        }
      }
      if (o === 'z_pattern_safe' && overlays.patternSafe && overlays.patternSafe.signal) {
        var psz = String(overlays.patternSafe.signal || '').toUpperCase();
        if (psz && psz !== 'UNKNOWN') {
          row.signal = psz;
          row.last_known_basis =
            (row.last_known_basis || '') +
            ' · Live: z_pattern_safe_report.json signal=' +
            esc(psz) +
            ' (pattern governance validator)';
        }
      }
      if (o === 'amk_ai_team_sync' && overlays.amkAiTeamSync && overlays.amkAiTeamSync.signal) {
        var aks = String(overlays.amkAiTeamSync.signal || '').toUpperCase();
        if (aks && aks !== 'UNKNOWN') {
          row.signal = aks;
          row.last_known_basis =
            (row.last_known_basis || '') +
            ' · Live: amk_ai_team_sync_report.json signal=' +
            esc(aks) +
            ' (indicator sync observer — read-only)';
        }
      }
      if (o === 'z_ai_fusion_map' && overlays.zAiFusionMap && overlays.zAiFusionMap.signal) {
        var zfm = String(overlays.zAiFusionMap.signal || '').toUpperCase();
        if (zfm && zfm !== 'UNKNOWN') {
          row.signal = zfm;
          row.last_known_basis =
            (row.last_known_basis || '') +
            ' · Live: z_ai_fusion_map_report.json signal=' +
            esc(zfm) +
            ' (fusion governance map)';
        }
      }
      if (
        o === 'z_stillness_learning' &&
        overlays.zStillnessLearning &&
        overlays.zStillnessLearning.signal
      ) {
        var zsl = String(overlays.zStillnessLearning.signal || '').toUpperCase();
        if (zsl && zsl !== 'UNKNOWN') {
          row.signal = zsl;
          row.last_known_basis =
            (row.last_known_basis || '') +
            ' · Live: z_stillness_learning_report.json signal=' +
            esc(zsl) +
            ' (stillness pathway validator)';
        }
      }
      if (o === 'z_legal_ops' && overlays.zLegalOps && overlays.zLegalOps.signal) {
        var zlo = String(overlays.zLegalOps.signal || '').toUpperCase();
        if (zlo && zlo !== 'UNKNOWN') {
          row.signal = zlo;
          row.last_known_basis =
            (row.last_known_basis || '') +
            ' · Live: z_legal_ops_report.json signal=' +
            esc(zlo) +
            ' (legal ops governance validator)';
        }
      }
      if (
        o === 'z_legal_product_ops' &&
        overlays.zLegalProductOps &&
        overlays.zLegalProductOps.signal
      ) {
        var zlp = String(overlays.zLegalProductOps.signal || '').toUpperCase();
        if (zlp && zlp !== 'UNKNOWN') {
          row.signal = zlp;
          row.last_known_basis =
            (row.last_known_basis || '') +
            ' · Live: z_legal_product_ops_report.json signal=' +
            esc(zlp) +
            ' (legal product/IP workstation validator)';
        }
      }
      if (
        o === 'z_legal_workstation_stack' &&
        overlays.zLegalWorkstationStack &&
        overlays.zLegalWorkstationStack.signal
      ) {
        var zlw = String(overlays.zLegalWorkstationStack.signal || '').toUpperCase();
        if (zlw && zlw !== 'UNKNOWN') {
          row.signal = zlw;
          row.last_known_basis =
            (row.last_known_basis || '') +
            ' · Live: z_legal_workstation_stack_report.json signal=' +
            esc(zlw) +
            ' (legal workstation full-stack governance validator)';
        }
      }
      if (o === 'z_legal_toolbelt') {
        row.last_known_basis =
          (row.last_known_basis || '') +
          ' · Toolbelt metadata lane (no runtime overlay required in Phase 1).';
      }
      if (o === 'z_xbus_gate' && overlays.xbus && overlays.xbus.overall_signal) {
        var xb = String(overlays.xbus.overall_signal || '').toUpperCase();
        if (xb && xb !== 'UNKNOWN') {
          row.signal = xb;
          row.last_known_basis =
            (row.last_known_basis || '') +
            ' · Live: z_xbus_connector_gate_report.json overall_signal=' +
            esc(xb);
        }
      }
      if (o === 'z_ssws_cockpit' && overlays.sswsCockpit && overlays.sswsCockpit.overall_signal) {
        var sc = String(overlays.sswsCockpit.overall_signal || '').toUpperCase();
        if (sc && sc !== 'UNKNOWN') {
          row.signal = sc;
          row.last_known_basis =
            (row.last_known_basis || '') +
            ' · Live: z_ssws_cockpit_report.json overall_signal=' +
            esc(sc);
        }
      }
      if (
        o === 'omnai_core_overlay' &&
        overlays.omnaiCoreOverlay &&
        overlays.omnaiCoreOverlay.signal
      ) {
        var oco = String(overlays.omnaiCoreOverlay.signal || '').toUpperCase();
        if (oco && oco !== 'UNKNOWN') {
          row.signal = oco;
          row.last_known_basis =
            (row.last_known_basis || '') +
            ' · Live: z_omnai_core_engine_indicator_overlay.json signal=' +
            esc(oco) +
            ' (deterministic OMNAI core)';
        }
      }
      return row;
    });
  }

  function renderPostureChips(row, html) {
    if (!Array.isArray(row.posture_chips) || !row.posture_chips.length) return;
    html.push('<div class="amk-ind-chip-row" role="group" aria-label="Posture chips">');
    row.posture_chips.forEach(function (c) {
      html.push('<span class="amk-ind-posture-chip">' + esc(c) + '</span>');
    });
    html.push('</div>');
  }

  function renderAdvisoryLawLines(row, html) {
    if (!Array.isArray(row.advisory_law_lines) || !row.advisory_law_lines.length) return;
    html.push('<ul class="amk-ind-advisory-law">');
    row.advisory_law_lines.forEach(function (line) {
      html.push('<li>' + esc(line) + '</li>');
    });
    html.push('</ul>');
  }

  function sortedRows(rows) {
    return rows.slice().sort(function (a, b) {
      var ra = signalRank(a.signal);
      var rb = signalRank(b.signal);
      if (ra !== rb) return ra - rb;
      return String(a.id).localeCompare(String(b.id));
    });
  }

  function linkList(prefix, items) {
    if (!Array.isArray(items) || !items.length) return '';
    var bits = ['<ul class="amk-ind-links">'];
    items.forEach(function (p) {
      bits.push(
        '<li><a href="' +
          esc(docHref(p)) +
          '" target="_blank" rel="noopener noreferrer">' +
          esc(p) +
          '</a></li>'
      );
    });
    bits.push('</ul>');
    return bits.join('');
  }

  function renderIndicators(mount, payload, ackNote) {
    if (!mount) return;
    if (!payload || !Array.isArray(payload.indicators)) {
      mount.innerHTML = '<p class="amk-ind-meta">No indicators payload.</p>';
      return;
    }
    var law = esc(payload.law_note || '');
    var sorted = sortedRows(payload.indicators);
    var html = [];
    html.push('<p class="amk-ind-law"><strong>Law:</strong> ' + law + '</p>');
    html.push('<div class="amk-ind-list">');
    sorted.forEach(function (row) {
      var sig = row.signal == null ? 'UNKNOWN' : String(row.signal).toUpperCase();
      var pct = row.growth_percent;
      var pctLabel = pct == null || pct === '' ? 'UNKNOWN' : String(pct) + '%';
      html.push('<article class="amk-ind-card" data-indicator-id="' + esc(row.id) + '">');
      html.push('<div class="amk-ind-card-head">');
      html.push('<span class="amk-ind-name">' + esc(row.name) + '</span>');
      html.push(
        '<span class="' + pillClass(sig === 'UNKNOWN' ? null : sig) + '">' + esc(sig) + '</span>'
      );
      html.push('<span class="amk-ind-pill amk-ind-pill--unknown">' + esc(pctLabel) + '</span>');
      html.push('</div>');
      html.push(
        '<div class="amk-ind-go"><strong>Go/No-Go:</strong> ' + esc(row.go_no_go) + '</div>'
      );
      if (pct != null && pct !== '') {
        var w = Math.max(0, Math.min(100, Number(pct)));
        html.push('<div class="amk-ind-bar-wrap" aria-hidden="true">');
        html.push(
          '<div class="' +
            barClass(sig === 'UNKNOWN' ? null : sig) +
            '" style="width:' +
            w +
            '%"></div>'
        );
        html.push('</div>');
      }
      html.push('<p class="amk-ind-label">' + esc(row.readiness_label) + '</p>');
      renderPostureChips(row, html);
      renderAdvisoryLawLines(row, html);
      html.push(
        '<div class="amk-ind-next"><strong>Next:</strong> ' +
          esc(row.recommended_next_action) +
          '</div>'
      );
      html.push(
        '<div class="amk-ind-meta">' +
          esc(row.project_or_system) +
          ' · ' +
          esc(row.domain) +
          ' · autonomy ' +
          esc(row.autonomy_level) +
          (row.human_confirmation_required ? ' · human gate' : '') +
          '</div>'
      );
      if (Array.isArray(row.blocked_until) && row.blocked_until.length) {
        html.push(
          '<div class="amk-ind-meta"><strong>Blocked until:</strong> ' +
            esc(row.blocked_until.join('; ')) +
            '</div>'
        );
      }
      if (Array.isArray(row.forbidden_actions) && row.forbidden_actions.length) {
        html.push(
          '<div class="amk-ind-meta"><strong>Forbidden:</strong> ' +
            esc(row.forbidden_actions.join(', ')) +
            '</div>'
        );
      }
      html.push('<div class="amk-ind-meta">' + esc(row.last_known_basis || '') + '</div>');
      html.push(linkList('doc', row.related_docs));
      html.push(linkList('rep', row.related_reports));
      html.push('</article>');
    });
    html.push('</div>');
    html.push('<div class="amk-ind-ack">');
    html.push(
      '<strong>Local acknowledgement only.</strong> The button below does not execute npm, Cursor tasks, deploy, bridges, or billing. It stores a timestamp in this browser.'
    );
    html.push(
      '<div><button type="button" data-amk-ind-ack="1">I reviewed this board (browser only)</button></div>'
    );
    if (ackNote) html.push('<div class="amk-ind-meta">' + esc(ackNote) + '</div>');
    html.push('</div>');
    mount.innerHTML = html.join('');
    mount.querySelectorAll('[data-amk-ind-ack]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        try {
          window.localStorage.setItem(
            LS_ACK,
            JSON.stringify({ at: new Date().toISOString(), schema: 'amk_indicator_ack_v1' })
          );
        } catch (e) {
          void e;
        }
        renderIndicators(mount, payload, ackLoadNote());
      });
    });
  }

  function ackLoadNote() {
    try {
      var raw = window.localStorage.getItem(LS_ACK);
      if (!raw) return '';
      var o = JSON.parse(raw);
      return o && o.at ? 'Last local acknowledgement recorded: ' + o.at : '';
    } catch (_) {
      return '';
    }
  }

  function renderCloudflare(mount, cf) {
    if (!mount) return;
    if (!cf || typeof cf !== 'object') {
      mount.innerHTML = '<p class="amk-ind-meta">No Cloudflare Go/No-Go metadata.</p>';
      return;
    }
    var rows = [
      ['Deployment posture', String(cf.deployment_status || 'HOLD')],
      ['Go/No-Go label', String(cf.go_no_go_label || '—')],
      ['Human approval', cf.human_approval_required ? 'Required' : 'Not flagged'],
    ];
    var html = [];
    html.push('<div class="amk-ind-cf">');
    html.push('<h4>Cloudflare / edge Go/No-Go (advisory)</h4>');
    html.push('<p class="amk-ind-label">' + esc(cf.summary || '') + '</p>');
    html.push('<table><tbody>');
    rows.forEach(function (pair) {
      html.push('<tr><th>' + esc(pair[0]) + '</th><td>' + esc(pair[1]) + '</td></tr>');
    });
    html.push('</tbody></table>');
    if (Array.isArray(cf.required_gates) && cf.required_gates.length) {
      html.push('<p class="amk-ind-meta"><strong>Required gates</strong></p><ul>');
      cf.required_gates.forEach(function (g) {
        html.push('<li>' + esc(g) + '</li>');
      });
      html.push('</ul>');
    }
    if (Array.isArray(cf.blocked_categories) && cf.blocked_categories.length) {
      html.push('<p class="amk-ind-meta"><strong>Blocked categories</strong></p><ul>');
      cf.blocked_categories.forEach(function (g) {
        html.push('<li>' + esc(g) + '</li>');
      });
      html.push('</ul>');
    }
    html.push(linkList('cf', cf.related_docs || []));
    html.push('</div>');
    mount.innerHTML = html.join('');
  }

  function fetchJson(path) {
    return fetch(path, { credentials: 'same-origin' }).then(function (r) {
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    });
  }

  function loadOverlays(prefix) {
    var o = {};
    return Promise.all([
      fetchJson(prefix + '/data/reports/z_traffic_minibots_status.json').then(function (d) {
        o.traffic = d;
      }),
      fetchJson(prefix + '/data/reports/z_susbv_overseer_report.json').then(function (d) {
        o.susbv = d;
      }),
      fetchJson(prefix + '/data/reports/z_car2_similarity_report.json').then(function (d) {
        o.car2 = d;
      }),
      fetchJson(prefix + '/data/reports/z_zuno_coverage_audit.json').then(function (d) {
        o.zuno = d;
      }),
      fetchJson(prefix + '/data/reports/z_dashboard_registry_verify.json').then(function (d) {
        o.dash = d;
      }),
      fetch(prefix + '/data/reports/z_deployment_readiness_status.json', {
        credentials: 'same-origin',
      })
        .then(function (r) {
          if (!r.ok) return null;
          return r.json();
        })
        .then(function (d) {
          o.deploymentReadiness = d;
        })
        .catch(function () {
          o.deploymentReadiness = null;
        }),
      fetchJson(prefix + '/data/reports/z_ecosystem_awareness_report.json').then(function (d) {
        o.ecosystem = d;
      }),
      fetchJson(prefix + '/data/reports/z_api_spine_report.json').then(function (d) {
        o.apiSpine = d;
      }),
      fetchJson(prefix + '/data/reports/z_ssws_launch_requirements_report.json').then(function (d) {
        o.ssws = d;
      }),
      fetch(prefix + '/data/reports/amk_workspace_doorway_status.json', {
        credentials: 'same-origin',
      })
        .then(function (r) {
          if (!r.ok) return null;
          return r.json();
        })
        .then(function (d) {
          o.doorway = d;
        })
        .catch(function () {
          o.doorway = null;
        }),
      fetch(prefix + '/data/reports/amk_cursor_workspace_profiles_report.json', {
        credentials: 'same-origin',
      })
        .then(function (r) {
          if (!r.ok) return null;
          return r.json();
        })
        .then(function (d) {
          o.wsProfiles = d;
        })
        .catch(function () {
          o.wsProfiles = null;
        }),
      fetch(prefix + '/data/reports/z_amk_gtai_strategy_report.json', {
        credentials: 'same-origin',
      })
        .then(function (r) {
          if (!r.ok) return null;
          return r.json();
        })
        .then(function (d) {
          o.gtai = d;
        })
        .catch(function () {
          o.gtai = null;
        }),
      fetch(prefix + '/data/reports/z_cadence_cycle_report.json', { credentials: 'same-origin' })
        .then(function (r) {
          if (!r.ok) return null;
          return r.json();
        })
        .then(function (d) {
          o.cadence = d;
        })
        .catch(function () {
          o.cadence = null;
        }),
      fetch(prefix + '/data/reports/z_mod_dist_report.json', { credentials: 'same-origin' })
        .then(function (r) {
          if (!r.ok) return null;
          return r.json();
        })
        .then(function (d) {
          o.modDist = d;
        })
        .catch(function () {
          o.modDist = null;
        }),
      fetch(prefix + '/data/reports/z_replica_fabric_report.json', { credentials: 'same-origin' })
        .then(function (r) {
          if (!r.ok) return null;
          return r.json();
        })
        .then(function (d) {
          o.replicaFabric = d;
        })
        .catch(function () {
          o.replicaFabric = null;
        }),
      fetch(prefix + '/data/reports/z_ultra_mage_formula_report.json', {
        credentials: 'same-origin',
      })
        .then(function (r) {
          if (!r.ok) return null;
          return r.json();
        })
        .then(function (d) {
          o.ultraMage = d;
        })
        .catch(function () {
          o.ultraMage = null;
        }),
      fetch(prefix + '/data/reports/z_mu_truth_report.json', { credentials: 'same-origin' })
        .then(function (r) {
          if (!r.ok) return null;
          return r.json();
        })
        .then(function (d) {
          o.muTruth = d;
        })
        .catch(function () {
          o.muTruth = null;
        }),
      fetch(prefix + '/data/reports/z_mu_advisor_report.json', { credentials: 'same-origin' })
        .then(function (r) {
          if (!r.ok) return null;
          return r.json();
        })
        .then(function (d) {
          o.muAdvisor = d;
        })
        .catch(function () {
          o.muAdvisor = null;
        }),
      fetch(prefix + '/data/reports/z_pattern_safe_report.json', { credentials: 'same-origin' })
        .then(function (r) {
          if (!r.ok) return null;
          return r.json();
        })
        .then(function (d) {
          o.patternSafe = d;
        })
        .catch(function () {
          o.patternSafe = null;
        }),
      fetch(prefix + '/data/reports/amk_ai_team_sync_report.json', { credentials: 'same-origin' })
        .then(function (r) {
          if (!r.ok) return null;
          return r.json();
        })
        .then(function (d) {
          o.amkAiTeamSync = d;
        })
        .catch(function () {
          o.amkAiTeamSync = null;
        }),
      fetch(prefix + '/data/reports/z_ai_fusion_map_report.json', { credentials: 'same-origin' })
        .then(function (r) {
          if (!r.ok) return null;
          return r.json();
        })
        .then(function (d) {
          o.zAiFusionMap = d;
        })
        .catch(function () {
          o.zAiFusionMap = null;
        }),
      fetch(prefix + '/data/reports/z_stillness_learning_report.json', {
        credentials: 'same-origin',
      })
        .then(function (r) {
          if (!r.ok) return null;
          return r.json();
        })
        .then(function (d) {
          o.zStillnessLearning = d;
        })
        .catch(function () {
          o.zStillnessLearning = null;
        }),
      fetch(prefix + '/data/reports/z_legal_ops_report.json', { credentials: 'same-origin' })
        .then(function (r) {
          if (!r.ok) return null;
          return r.json();
        })
        .then(function (d) {
          o.zLegalOps = d;
        })
        .catch(function () {
          o.zLegalOps = null;
        }),
      fetch(prefix + '/data/reports/z_legal_product_ops_report.json', {
        credentials: 'same-origin',
      })
        .then(function (r) {
          if (!r.ok) return null;
          return r.json();
        })
        .then(function (d) {
          o.zLegalProductOps = d;
        })
        .catch(function () {
          o.zLegalProductOps = null;
        }),
      fetch(prefix + '/data/reports/z_legal_workstation_stack_report.json', {
        credentials: 'same-origin',
      })
        .then(function (r) {
          if (!r.ok) return null;
          return r.json();
        })
        .then(function (d) {
          o.zLegalWorkstationStack = d;
        })
        .catch(function () {
          o.zLegalWorkstationStack = null;
        }),
      fetch(prefix + '/data/reports/z_xbus_connector_gate_report.json', {
        credentials: 'same-origin',
      })
        .then(function (r) {
          if (!r.ok) return null;
          return r.json();
        })
        .then(function (d) {
          o.xbus = d;
        })
        .catch(function () {
          o.xbus = null;
        }),
      fetch(prefix + '/data/reports/z_ssws_cockpit_report.json', { credentials: 'same-origin' })
        .then(function (r) {
          if (!r.ok) return null;
          return r.json();
        })
        .then(function (d) {
          o.sswsCockpit = d;
        })
        .catch(function () {
          o.sswsCockpit = null;
        }),
      fetch(prefix + '/data/reports/z_omnai_core_engine_indicator_overlay.json', {
        credentials: 'same-origin',
      })
        .then(function (r) {
          if (!r.ok) return null;
          return r.json();
        })
        .then(function (d) {
          o.omnaiCoreOverlay = d;
        })
        .catch(function () {
          o.omnaiCoreOverlay = null;
        }),
    ])
      .then(function () {
        return o;
      })
      .catch(function () {
        return {};
      });
  }

  function bootPair(indMount, cfMount) {
    if (!indMount && !cfMount) return;
    var prefix = rootPrefix();
    var url = prefix + '/dashboard/data/amk_project_indicators.json';
    fetch(url, { credentials: 'same-origin' })
      .then(function (r) {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then(function (data) {
        return loadOverlays(prefix).then(function (ov) {
          var indicators = applyOverlays(data.indicators || [], ov);
          var payload = Object.assign({}, data, { indicators: indicators });
          if (indMount) renderIndicators(indMount, payload, ackLoadNote());
          if (cfMount) renderCloudflare(cfMount, data.cloudflare_go_no_go);
        });
      })
      .catch(function () {
        var msg =
          'Could not load <code>dashboard/data/amk_project_indicators.json</code> or overlays. Serve the hub from repo root over HTTP and retry.';
        if (indMount) indMount.innerHTML = '<p class="amk-ind-meta">' + msg + '</p>';
        if (cfMount) cfMount.innerHTML = '<p class="amk-ind-meta">' + msg + '</p>';
      });
  }

  function init() {
    bootPair(
      document.getElementById('zAmkIndicatorsMount'),
      document.getElementById('zAmkCloudflareGoNoGoMount')
    );
    bootPair(
      document.getElementById('amkProjectIndicatorsMount'),
      document.getElementById('amkCloudflareGoNoGoMount')
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
