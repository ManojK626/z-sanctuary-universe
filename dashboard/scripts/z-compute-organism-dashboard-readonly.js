/**
 * ZCO-3 + ZCO-7 — read-only Compute Organism dashboard.
 * GET JSON only (same-origin). No POST, shell, hardware control, scan, or orchestration.
 */
(function () {
  'use strict';

  var STATUS_URL = '../../data/reports/z_compute_organism_status.json';
  var INTAKE_URL = '../../data/reports/z_compute_intake_validation.json';
  var DRAFT_URL = '../../data/reports/z_compute_upgrade_plan_draft.json';

  var DOC_LINKS = [
    {
      label: 'Builder spine (Z-SSWS + AI Tower)',
      href: '../../docs/compute-organism/Z_SSWS_AI_TOWER_BUILDER_INSTRUCTIONS.md',
    },
    {
      label: 'Architecture',
      href: '../../docs/compute-organism/Z_COMPUTE_ORGANISM_ARCHITECTURE.md',
    },
    {
      label: 'Arelium Shield role',
      href: '../../docs/compute-organism/Z_ARELIUM_SHIELD_INFRASTRUCTURE_ROLE.md',
    },
    {
      label: 'OMNISWARM MiniBots',
      href: '../../docs/compute-organism/Z_OMNISWARM_CLUSTER_MINIBOTS.md',
    },
    {
      label: 'Formula infrastructure',
      href: '../../docs/compute-organism/Z_FORMULA_INFRASTRUCTURE_ENGINE.md',
    },
    {
      label: 'ZCO-1 green receipt',
      href: '../../docs/compute-organism/PHASE_ZCO_1_GREEN_RECEIPT.md',
    },
    {
      label: 'ZCO-2 green receipt',
      href: '../../docs/compute-organism/PHASE_ZCO_2_GREEN_RECEIPT.md',
    },
    {
      label: 'ZCO-3 green receipt',
      href: '../../docs/compute-organism/PHASE_ZCO_3_GREEN_RECEIPT.md',
    },
    {
      label: 'ZCO-7 dashboard embed (intake + draft)',
      href: '../../docs/compute-organism/ZCO_7_DASHBOARD_INTAKE_DRAFT_EMBED.md',
    },
    {
      label: 'Dashboard system doc',
      href: '../../docs/compute-organism/Z_COMPUTE_ORGANISM_DASHBOARD_SYSTEM.md',
    },
    {
      label: 'ZCO-4 hardware intake policy',
      href: '../../docs/compute-organism/ZCO_4_HARDWARE_INTAKE_POLICY.md',
    },
    {
      label: 'ZCO-4 hardware schema',
      href: '../../docs/compute-organism/ZCO_4_HARDWARE_SCHEMA.md',
    },
    {
      label: 'ZCO-4 upgrade planning',
      href: '../../docs/compute-organism/ZCO_4_UPGRADE_PLANNING_GUIDE.md',
    },
    {
      label: 'ZCO-4 green receipt',
      href: '../../docs/compute-organism/PHASE_ZCO_4_GREEN_RECEIPT.md',
    },
    {
      label: 'ZCO-5 intake validator',
      href: '../../docs/compute-organism/ZCO_5_LOCAL_INTAKE_VALIDATOR.md',
    },
    {
      label: 'ZCO-5 green receipt',
      href: '../../docs/compute-organism/PHASE_ZCO_5_GREEN_RECEIPT.md',
    },
    {
      label: 'ZCO-6 upgrade plan draft',
      href: '../../docs/compute-organism/ZCO_6_AI_ASSISTED_UPGRADE_PLAN_DRAFT.md',
    },
    {
      label: 'ZCO-6 green receipt',
      href: '../../docs/compute-organism/PHASE_ZCO_6_GREEN_RECEIPT.md',
    },
    {
      label: 'ZCO-7 green receipt',
      href: '../../docs/compute-organism/PHASE_ZCO_7_GREEN_RECEIPT.md',
    },
  ];

  function $(id) {
    return document.getElementById(id);
  }

  function setText(id, text) {
    var el = $(id);
    if (el) el.textContent = text == null ? '' : String(text);
  }

  function sigClass(s) {
    var u = String(s || '').toUpperCase();
    if (u === 'GREEN' || u === 'PASS' || u === 'PRESENT') return 'sig-green';
    if (u === 'YELLOW' || u === 'FAIL') return 'sig-yellow';
    if (u === 'BLUE') return 'sig-blue';
    if (u === 'RED' || u === 'MISSING') return 'sig-red';
    if (u === 'CLOSED' || u === 'DISABLED') return '';
    return 'sig-yellow';
  }

  function applySignalEl(el, signal) {
    if (!el) return;
    var u = String(signal || '—').toUpperCase();
    el.textContent = u;
    el.className = 'zco-signal zco-signal-sm ' + sigClass(u);
  }

  function postureClass(value) {
    var u = String(value || '').toUpperCase();
    if (u === 'CLOSED' || u === 'DISABLED') return 'zco-posture-closed';
    return '';
  }

  function fetchJson(url) {
    return fetch(url, { credentials: 'same-origin', cache: 'no-store' }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + url);
      return res.json();
    });
  }

  function fetchJsonOptional(url) {
    return fetchJson(url)
      .then(function (data) {
        return { ok: true, data: data };
      })
      .catch(function (err) {
        return { ok: false, error: err && err.message ? err.message : String(err) };
      });
  }

  function renderList(ulId, items, emptyText) {
    var ul = $(ulId);
    if (!ul) return;
    ul.textContent = '';
    if (!items || !items.length) {
      var li = document.createElement('li');
      li.className = 'zco-findings-empty';
      li.textContent = emptyText || 'None';
      ul.appendChild(li);
      return;
    }
    items.forEach(function (item) {
      var li = document.createElement('li');
      li.textContent = item;
      ul.appendChild(li);
    });
  }

  function renderDocsList() {
    var ul = $('zcoDocList');
    if (!ul) return;
    ul.textContent = '';
    DOC_LINKS.forEach(function (d) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = d.href;
      a.textContent = d.label;
      a.setAttribute('rel', 'noopener');
      li.appendChild(a);
      ul.appendChild(li);
    });
  }

  function renderStatus(data) {
    var posture = data.posture || {};
    var readiness = data.readiness || {};

    setText('zcoMode', data.mode || '—');
    setText('zcoRuntime', posture.runtime_orchestration || '—');
    setText('zcoHardware', posture.hardware_control || '—');
    setText('zcoDeploy', posture.deploy_authority || '—');
    setText('zcoNetwork', posture.network_scan || '—');

    setText('zcoArelium', readiness.arelium_shield_doctrine || '—');
    setText('zcoOmniswarm', readiness.swarm_doctrine || '—');
    setText('zcoBuilder', readiness.builder_instructions || '—');
    setText('zcoFormulas', readiness.formula_infrastructure_doctrine || '—');
    setText('zcoExamples', (data.examples && data.examples.examples_validated) || '—');

    var hub = data.global_hub_signal || {};
    setText('zcoHubTraffic', hub.traffic_overall || '—');

    var rollup = String(data.overall_signal || '—').toUpperCase();
    var sigEl = $('zcoGlobalSignal');
    if (sigEl) {
      sigEl.textContent = rollup;
      sigEl.className = 'zco-signal ' + sigClass(rollup);
    }

    setText('zcoGenerated', data.generated_at || '—');
    setText('zcoNextAction', data.smallest_safe_next_action || '—');

    var ns = data.node_summary;
    if (ns) {
      setText('zcoNodeCount', String(ns.node_count != null ? ns.node_count : '—'));
      setText('zcoNodeIds', (ns.node_ids || []).join(', ') || '—');
    } else {
      setText('zcoNodeCount', '—');
      setText('zcoNodeIds', '—');
    }

    var fr = data.forbidden_runtime || {};
    setText('zcoForbiddenRuntime', fr.absent ? 'PASS (absent)' : 'REVIEW');

    ['zcoRuntime', 'zcoHardware', 'zcoDeploy', 'zcoNetwork'].forEach(function (id) {
      var el = $(id);
      if (el) el.className = 'zco-status-line ' + postureClass(el.textContent);
    });
  }

  function renderIntake(data) {
    applySignalEl($('zcoIntakeSignal'), data.overall_signal);
    setText('zcoIntakePath', data.inventory_path || '—');
    var c = data.counts || {};
    setText(
      'zcoIntakeCounts',
      'RED ' + (c.red != null ? c.red : 0) + ' · YELLOW ' + (c.yellow != null ? c.yellow : 0)
    );
    setText('zcoIntakeGenerated', data.generated_at || '—');
    setText('zcoIntakeNext', data.smallest_safe_next_action || '—');

    var findings = (data.findings || []).slice(0, 8).map(function (f) {
      return (f.severity || '?') + ' ' + (f.code || '') + ': ' + (f.message || '');
    });
    renderList(
      'zcoIntakeFindings',
      findings,
      'No findings — declared inventory passed validation rules.'
    );
  }

  function renderDraft(data) {
    applySignalEl($('zcoDraftSignal'), data.overall_signal);
    setText('zcoDraftBlocked', data.blocked ? 'yes' : 'no');
    setText('zcoDraftPhaseCount', String(data.phase_count != null ? data.phase_count : '—'));
    var iv = data.intake_validation || {};
    setText('zcoDraftIntakeRef', iv.overall_signal || '—');
    setText('zcoDraftGenerated', data.generated_at || '—');
    setText('zcoDraftNext', data.smallest_safe_next_action || '—');

    var limits = (data.limitations || []).slice(0, 6);
    if (data.blocked && data.blocked_reason) {
      limits = ['BLOCKED: ' + data.blocked_reason].concat(limits);
    }
    renderList('zcoDraftLimitations', limits, 'No limitations listed.');

    var phaseLines = [];
    (data.node_advisories || []).forEach(function (na) {
      (na.phases || []).slice(0, 4).forEach(function (p) {
        phaseLines.push(
          '#' +
            p.order +
            ' ' +
            (na.node_id || '?') +
            ' · ' +
            (p.phase || '?') +
            ' — ' +
            (p.item || '')
        );
      });
      if ((na.phases || []).length > 4) {
        phaseLines.push('… ' + na.node_id + ' has ' + na.phases.length + ' phases (see JSON)');
      }
    });
    if (!phaseLines.length && data.blocked) {
      phaseLines = ['Draft blocked — fix intake RED before phases appear.'];
    }
    renderList('zcoDraftPhases', phaseLines.slice(0, 12), 'No phases drafted.');
  }

  function showError(id, msg) {
    var el = $(id);
    if (!el) return;
    if (msg) {
      el.textContent = msg;
      el.classList.add('visible');
    } else {
      el.textContent = '';
      el.classList.remove('visible');
    }
  }

  function load() {
    showError('zcoError', '');
    showError('zcoChainError', '');

    return fetchJson(STATUS_URL)
      .then(function (status) {
        renderStatus(status);
        return Promise.all([fetchJsonOptional(INTAKE_URL), fetchJsonOptional(DRAFT_URL)]);
      })
      .then(function (results) {
        var intakeRes = results[0];
        var draftRes = results[1];
        var chainHints = [];

        if (intakeRes.ok) {
          renderIntake(intakeRes.data);
        } else {
          renderIntake({});
          chainHints.push('Intake: ' + intakeRes.error + ' — run npm run z:compute:intake');
        }

        if (draftRes.ok) {
          renderDraft(draftRes.data);
        } else {
          renderDraft({ blocked: true, phase_count: 0 });
          chainHints.push('Draft: ' + draftRes.error + ' — run npm run z:compute:upgrade-draft');
        }

        if (chainHints.length) {
          showError('zcoChainError', chainHints.join(' · '));
        }
      })
      .catch(function (err) {
        showError(
          'zcoError',
          (err && err.message ? err.message : String(err)) +
            ' — Run npm run z:compute:organism from hub root, then serve dashboard over http (same-origin GET).'
        );
      });
  }

  function init() {
    renderDocsList();
    var btn = $('zcoRefresh');
    if (btn) {
      btn.addEventListener('click', function () {
        load();
      });
    }
    load();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
