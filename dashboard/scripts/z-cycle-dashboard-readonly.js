/**
 * Z-CYCLE-DASHBOARD-1 — read-only ecosystem nervous system UI.
 * GET JSON only (same-origin). No POST, no script execution, no deploy, no branch creation.
 */
(function () {
  'use strict';

  var DATA = {
    observe: '../../data/reports/z_cycle_observe_status.json',
    traffic: '../../data/reports/z_traffic_minibots_status.json',
    drift: '../../data/reports/z_crystal_dna_drift_report.json',
    anydevice: '../../data/reports/z_anydevice_simulation_report.json',
    car2: '../../data/reports/z_car2_similarity_report.json',
  };

  function $(id) {
    return document.getElementById(id);
  }

  function fetchJson(url) {
    return fetch(url, { credentials: 'same-origin' }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + url);
      return res.json();
    });
  }

  function sigClass(s) {
    var u = String(s || '').toUpperCase();
    if (u === 'GREEN') return 'sig-green';
    if (u === 'YELLOW') return 'sig-yellow';
    if (u === 'BLUE' || u === 'HOLD') return 'sig-blue';
    if (u === 'RED' || u === 'QUARANTINE') return 'sig-red';
    return 'sig-yellow';
  }

  function truncate(s, n) {
    s = String(s || '');
    if (s.length <= n) return s;
    return s.slice(0, n - 1) + '…';
  }

  function setText(id, text) {
    var el = $(id);
    if (el) el.textContent = text == null ? '' : String(text);
  }

  function renderObserve(ob) {
    if (!ob) return;
    var stage = ob.current_ecosystem_stage || {};
    setText('zcdStageLabel', stage.label || '—');
    setText('zcdStageId', stage.id || '');
    setText('zcdStageSummary', stage.summary || '');

    var rollup = String(ob.overall_observer_signal || '—').toUpperCase();
    var sigEl = $('zcdObserverSignal');
    if (sigEl) {
      sigEl.textContent = rollup;
      sigEl.className = 'zcd-signal ' + sigClass(rollup);
    }

    setText('zcdGenerated', ob.generated_at || '—');

    var sigs = ob.latest_report_signals || {};
    setText('zcdSigTraffic', JSON.stringify(sigs.z_traffic_minibots_status || {}));
    setText('zcdSigDrift', JSON.stringify(sigs.z_crystal_dna_drift_report || {}));
    setText('zcdSigAny', JSON.stringify(sigs.z_anydevice_simulation_report || {}));
    setText('zcdSigCar2', JSON.stringify(sigs.z_car2_similarity_report || {}));

    var cov = ob.project_folder_coverage || {};
    setText('zcdCovCrystal', String(cov.crystal_shards != null ? cov.crystal_shards : '—'));
    setText('zcdCovDoor', String(cov.doorway_entries != null ? cov.doorway_entries : '—'));
    setText('zcdCovSat', String(cov.satellites != null ? cov.satellites : '—'));
    setText('zcdCovSynth', String(cov.synthetic_devices != null ? cov.synthetic_devices : '—'));

    var ul = $('zcdSealedList');
    if (ul) {
      ul.textContent = '';
      (ob.sealed_systems || []).forEach(function (s) {
        var li = document.createElement('li');
        li.textContent = (s.phase_label || s.id || '') + ' — ' + truncate(s.role, 120);
        ul.appendChild(li);
      });
    }

    var tb = $('zcdTaskBody');
    if (tb) {
      tb.textContent = '';
      (ob.task_queue || []).forEach(function (t) {
        var tr = document.createElement('tr');
        [
          ['td', 'zcd-mono', t.task_id],
          ['td', '', t.category],
          ['td', '', t.signal],
          ['td', '', t.requires_human ? 'yes' : 'no'],
          ['td', 'zcd-mono', truncate(t.recommended_next_action, 140)],
        ].forEach(function (col) {
          var td = document.createElement(col[0]);
          if (col[1]) td.className = col[1];
          td.textContent = col[2] == null ? '' : String(col[2]);
          tr.appendChild(td);
        });
        tb.appendChild(tr);
      });
    }

    var tu = $('zcdTurtleLanes');
    if (tu) {
      tu.textContent = '';
      (ob.next_recommended_turtle_mode_lanes || []).forEach(function (lane) {
        var li = document.createElement('li');
        li.textContent = String(lane);
        tu.appendChild(li);
      });
    }

    var inputs = ob.inputs_ok || {};
    setText('zcdInPkg', inputs.package_json ? 'ok' : 'miss');
    setText('zcdInGrowth', inputs.growth_registry ? 'ok' : 'miss');
    setText('zcdInCrystal', inputs.crystal_manifest ? 'ok' : 'miss');
    setText('zcdInTraffic', inputs.report_traffic ? 'ok' : 'miss');
  }

  function renderSupplemental(label, data, err) {
    var host = $('zcdSupplemental');
    if (!host) return;
    var p = document.createElement('p');
    p.className = 'zcd-mono';
    p.style.margin = '0.25rem 0';
    if (err) {
      p.textContent = label + ': ' + err;
      p.className = 'zcd-error';
    } else {
      p.textContent = label + ': loaded (' + (data && typeof data === 'object' ? 'json' : '') + ')';
    }
    host.appendChild(p);
  }

  function load() {
    $('zcdError').textContent = '';
    var sup = $('zcdSupplemental');
    if (sup) sup.textContent = '';

    fetchJson(DATA.observe)
      .then(function (ob) {
        renderObserve(ob);
        return Promise.all([
          fetchJson(DATA.traffic).catch(function (e) {
            return { __err: e };
          }),
          fetchJson(DATA.drift).catch(function (e) {
            return { __err: e };
          }),
          fetchJson(DATA.anydevice).catch(function (e) {
            return { __err: e };
          }),
          fetchJson(DATA.car2).catch(function (e) {
            return { __err: e };
          }),
        ]).then(function (parts) {
          var names = ['traffic', 'drift', 'anydevice', 'car2'];
          parts.forEach(function (part, i) {
            if (part && part.__err)
              renderSupplemental(
                names[i],
                null,
                String(part.__err && part.__err.message ? part.__err.message : part.__err)
              );
            else renderSupplemental(names[i], part, null);
          });
        });
      })
      .catch(function (err) {
        setText(
          'zcdError',
          'Primary observe report missing or unreadable: ' +
            (err && err.message ? err.message : err)
        );
      });
  }

  function main() {
    var btn = $('zcdRefresh');
    if (btn)
      btn.addEventListener('click', function () {
        load();
      });
    load();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', main);
  else main();
})();
