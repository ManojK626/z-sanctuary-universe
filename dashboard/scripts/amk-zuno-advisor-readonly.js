/**
 * AAL-1 — Zuno Advisor Console (read-only, deterministic, local JSON + optional report fetch).
 * No LLM/API/voice/deploy/bridge/billing/task execution. localStorage "mark reviewed" is browser-only.
 */
(function () {
  var LS_REVIEW = 'amkZunoAdvisorReviewed_v1';

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
    return rootPrefix() + '/' + r.split('/').join('/');
  }

  function pillForLaneType(lt) {
    var s = String(lt || '').toLowerCase();
    if (s === 'auto_candidate') return 'amk-aal-pill amk-aal-pill--green';
    if (s === 'amk_required') return 'amk-aal-pill amk-aal-pill--blue';
    if (s === 'blocked') return 'amk-aal-pill amk-aal-pill--red';
    if (s === 'future_gated') return 'amk-aal-pill amk-aal-pill--purple';
    if (s === 'sealed') return 'amk-aal-pill amk-aal-pill--gold';
    return 'amk-aal-pill amk-aal-pill--yellow';
  }

  function pillForSignal(sig) {
    var s = String(sig || '').toUpperCase();
    if (s === 'GREEN') return 'amk-aal-pill amk-aal-pill--green';
    if (s === 'BLUE') return 'amk-aal-pill amk-aal-pill--blue';
    if (s === 'RED') return 'amk-aal-pill amk-aal-pill--red';
    if (s === 'PURPLE') return 'amk-aal-pill amk-aal-pill--purple';
    if (s === 'GOLD') return 'amk-aal-pill amk-aal-pill--gold';
    if (s === 'YELLOW') return 'amk-aal-pill amk-aal-pill--yellow';
    return 'amk-aal-pill amk-aal-pill--yellow';
  }

  function renderTasks(tasks) {
    if (!Array.isArray(tasks) || !tasks.length) return '<p class="amk-aal-meta">No tasks.</p>';
    var html = [];
    tasks.forEach(function (t) {
      html.push('<article class="amk-aal-task" data-aal-id="' + esc(t.id) + '">');
      html.push('<div class="amk-aal-task-head">');
      html.push('<span class="amk-aal-task-title">' + esc(t.title) + '</span>');
      html.push('<span class="' + pillForSignal(t.current_signal) + '">' + esc(t.current_signal) + '</span>');
      html.push('<span class="' + pillForLaneType(t.lane_type) + '">' + esc(t.lane_type) + '</span>');
      html.push('</div>');
      html.push(
        '<div class="amk-aal-meta">' +
          esc(t.domain) +
          ' · autonomy ' +
          esc(t.autonomy_level) +
          (t.growth_percent != null ? ' · growth ' + esc(t.growth_percent) + '% (internal only)' : '') +
          '</div>',
      );
      html.push('<div class="amk-aal-meta">Next state: ' + esc(t.allowed_next_state) + '</div>');
      if (Array.isArray(t.required_checks) && t.required_checks.length) {
        html.push('<div class="amk-aal-meta">Checks: ' + esc(t.required_checks.join('; ')) + '</div>');
      }
      html.push('<div class="amk-aal-meta">Rollback: ' + esc(t.rollback_note || '—') + '</div>');
      html.push('<div class="amk-aal-meta">One-click policy: ' + esc(t.one_click_policy || '—') + '</div>');
      html.push('<div class="amk-aal-links">');
      (t.related_docs || []).forEach(function (d) {
        html.push('<a href="' + esc(docHref(d)) + '" target="_blank" rel="noopener noreferrer">' + esc(d) + '</a>');
      });
      html.push('</div></article>');
    });
    return html.join('');
  }

  function renderLadderMount(mount, ladder) {
    if (!mount || !ladder || !Array.isArray(ladder.autonomy_ladder_levels)) return;
    var levels = ladder.autonomy_ladder_levels;
    var items = levels
      .map(function (L) {
        return (
          '<li><strong>' +
          esc(L.level) +
          ' ' +
          esc(L.name) +
          ':</strong> ' +
          esc(L.allowed_summary) +
          ' <em>e.g.</em> ' +
          esc(L.example) +
          '</li>'
        );
      })
      .join('');
    mount.innerHTML =
      '<h3>Autonomy ladder (L0–L5)</h3><p class="amk-aal-meta">Growth % on cards is internal readiness, not certification.</p><ul>' +
      items +
      '</ul>';
  }

  function buildContext(ladder, traffic, indicators) {
    var sig = 'UNKNOWN';
    var advice = '';
    if (traffic && traffic.traffic_chief) {
      sig = traffic.traffic_chief.overall_signal || sig;
      advice = traffic.traffic_chief.recommended_action || '';
    }
    var cf = { hold: true, label: 'NO_GO_FOR_DEPLOY', summary: '' };
    if (indicators && indicators.cloudflare_go_no_go) {
      cf.hold = String(indicators.cloudflare_go_no_go.deployment_status || '').toUpperCase() === 'HOLD';
      cf.label = indicators.cloudflare_go_no_go.go_no_go_label || cf.label;
      cf.summary = indicators.cloudflare_go_no_go.summary || '';
    }
    var redAuto = 0;
    var greenAuto = 0;
    var autoTasks = (ladder.sanctuary_auto_lane && ladder.sanctuary_auto_lane.tasks) || [];
    autoTasks.forEach(function (t) {
      if (String(t.current_signal).toUpperCase() === 'RED') redAuto += 1;
      if (String(t.current_signal).toUpperCase() === 'GREEN') greenAuto += 1;
    });
    return {
      trafficSignal: sig,
      trafficAdvice: advice,
      cloudflare: cf,
      autoTasks: autoTasks,
      sacredTasks: (ladder.amk_physical_sacred_lane && ladder.amk_physical_sacred_lane.tasks) || [],
      redAuto: redAuto,
      greenAuto: greenAuto,
    };
  }

  function answerQuery(raw, ladder, ctx) {
    var q = String(raw || '')
      .toLowerCase()
      .trim();
    if (!q) {
      return 'Type a question and choose Get guidance. This console uses local rules and optional report JSON only — no AI API.';
    }

    function listTitles(arr, pred) {
      return arr
        .filter(pred)
        .map(function (t) {
          return '• ' + t.title + ' [' + t.current_signal + ', ' + t.lane_type + ']';
        })
        .join('\n');
    }

    if (/what should i do next|do next|next\?/i.test(raw)) {
      var lines = ['Traffic chief signal: ' + ctx.trafficSignal + '.'];
      if (ctx.trafficAdvice) lines.push('Traffic note: ' + ctx.trafficAdvice);
      if (String(ctx.trafficSignal).toUpperCase() === 'RED') {
        lines.push('Fix failing required minibots (see z_traffic_minibots_status.md), then re-run z:traffic.');
      } else {
        lines.push('Safe rhythm: pick one Turtle slice, run verify:md + z:traffic after edits, then AMK chooses scope outside this UI.');
        lines.push('Auto-lane GREEN rows: ' + ctx.greenAuto + ' (see list below). Sacred lane still needs you for deploy/bill/bridge.');
      }
      return lines.join('\n');
    }

    if (/blocked|what is blocked|blockers/i.test(raw)) {
      var blocked = listTitles(ctx.autoTasks, function (t) {
        return String(t.current_signal).toUpperCase() === 'RED' || t.lane_type === 'blocked';
      });
      var sacredBlocked = listTitles(ctx.sacredTasks, function (t) {
        return String(t.current_signal).toUpperCase() === 'RED' || t.lane_type === 'blocked';
      });
      return (
        'Blocked / heavy gates (from ladder JSON + posture):\n' +
        (blocked || '(no auto-lane rows marked RED/blocked)') +
        '\nSacred / blocked:\n' +
        (sacredBlocked || '(see sacred list)')
      );
    }

    if (/auto[- ]?advance|safe to batch|batch safely/i.test(raw)) {
      var ok = listTitles(ctx.autoTasks, function (t) {
        return t.lane_type === 'auto_candidate' && /GREEN|YELLOW/i.test(String(t.current_signal));
      });
      return (
        'Auto-lane candidates (internal, reversible — you still run commands in terminal/CI):\n' +
        (ok || '—') +
        '\n\nNone of these deploy, bill, bridge, or merge from the dashboard.'
      );
    }

    if (/amk approval|human approval|sacred|need.*approval/i.test(raw)) {
      var need = listTitles(ctx.sacredTasks, function (t) {
        return t.human_confirmation_required || t.lane_type === 'amk_required';
      });
      return (
        'AMK / human gate typical for:\n' +
        need +
        '\n\nUse AMK notifications + external PR/terminal for real approval — not this page.'
      );
    }

    if (/cloudflare|deploy ready|edge ready/i.test(raw)) {
      return (
        'Cloudflare / edge (from indicators JSON when loaded):\n' +
        'deployment_status: ' +
        (ctx.cloudflare.hold ? 'HOLD' : 'see indicators') +
        '\ngo_no_go_label: ' +
        ctx.cloudflare.label +
        '\n' +
        (ctx.cloudflare.summary ? ctx.cloudflare.summary + '\n' : '') +
        'Treat as NO-GO for deploy until a chartered deployment lane exists.'
      );
    }

    return (
      'No deterministic template matched that exact wording. Try one of:\n' +
      (ladder.advisor_supported_prompts || []).map(function (p) {
        return '• ' + p;
      }).join('\n')
    );
  }

  function loadReviewNote() {
    try {
      var raw = window.localStorage.getItem(LS_REVIEW);
      if (!raw) return '';
      var o = JSON.parse(raw);
      return o && o.at ? 'Last local review mark: ' + o.at : '';
    } catch (_) {
      return '';
    }
  }

  function boot() {
    var ladderMount = document.getElementById('amkZunoAdvisorLadderMount');
    var autoMount = document.getElementById('amkZunoAutoLaneMount');
    var sacredMount = document.getElementById('amkZunoSacredLaneMount');
    var out = document.getElementById('amkZunoAdvisorOutput');
    var input = document.getElementById('amkZunoAdvisorInput');
    var btn = document.getElementById('amkZunoAdvisorAskBtn');
    var ackBtn = document.getElementById('amkZunoAdvisorAckBtn');
    var ackNote = document.getElementById('amkZunoAdvisorAckNote');
    if (!ladderMount || !autoMount || !sacredMount) return;

    var prefix = rootPrefix();
    var ladderUrl = prefix + '/dashboard/data/amk_autonomous_approval_ladder.json';

    fetch(ladderUrl, { credentials: 'same-origin' })
      .then(function (r) {
        if (!r.ok) throw new Error('ladder ' + r.status);
        return r.json();
      })
      .then(function (ladder) {
        var lawEl = document.getElementById('amkAalLawMount');
        if (lawEl && ladder.law_note) {
          lawEl.innerHTML = '<strong>Law:</strong> ' + esc(ladder.law_note);
        }
        renderLadderMount(ladderMount, ladder);
        autoMount.innerHTML =
          '<p class="amk-aal-lane-desc">' + esc((ladder.sanctuary_auto_lane && ladder.sanctuary_auto_lane.description) || '') + '</p>' +
          renderTasks((ladder.sanctuary_auto_lane && ladder.sanctuary_auto_lane.tasks) || []);
        sacredMount.innerHTML =
          '<p class="amk-aal-lane-desc">' + esc((ladder.amk_physical_sacred_lane && ladder.amk_physical_sacred_lane.description) || '') + '</p>' +
          renderTasks((ladder.amk_physical_sacred_lane && ladder.amk_physical_sacred_lane.tasks) || []);

        var trafficP = fetch(prefix + '/data/reports/z_traffic_minibots_status.json', { credentials: 'same-origin' })
          .then(function (r) {
            return r.ok ? r.json() : null;
          })
          .catch(function () {
            return null;
          });
        var indP = fetch(prefix + '/dashboard/data/amk_project_indicators.json', { credentials: 'same-origin' })
          .then(function (r) {
            return r.ok ? r.json() : null;
          })
          .catch(function () {
            return null;
          });

        return Promise.all([trafficP, indP]).then(function (pair) {
          var ctx = buildContext(ladder, pair[0], pair[1]);
          function runAsk() {
            if (!out || !input) return;
            out.textContent = answerQuery(input.value, ladder, ctx);
          }
          if (btn) btn.addEventListener('click', runAsk);
          if (ackBtn) {
            ackBtn.addEventListener('click', function () {
              try {
                window.localStorage.setItem(
                  LS_REVIEW,
                  JSON.stringify({ at: new Date().toISOString(), schema: 'amk_zuno_advisor_ack_v1' }),
                );
              } catch (_) {}
              if (ackNote) ackNote.textContent = loadReviewNote();
            });
          }
          if (ackNote) ackNote.textContent = loadReviewNote();
          if (out) {
            out.textContent =
              'Voice input is future-gated (consent, privacy policy, 14 DRP review). One-click in later phases prepares a review bundle only — it does not deploy, bill, bridge, or execute tasks.\n\n' +
              loadReviewNote();
          }
        });
      })
      .catch(function () {
        var msg =
          'Could not load dashboard/data/amk_autonomous_approval_ladder.json. Serve the hub from repo root over HTTP (e.g. npx http-server) and refresh.';
        ladderMount.innerHTML = '<p class="amk-aal-meta">' + msg + '</p>';
        autoMount.innerHTML = '';
        sacredMount.innerHTML = '';
        if (out) out.textContent = msg;
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
