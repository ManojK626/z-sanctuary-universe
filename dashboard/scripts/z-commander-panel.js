/**
 * AMK-Goku Commander panel — daily view: status strip, verifier-driven comm-flow chip,
 * local/mock receipts, watcher scroll. Advisory-only; Zuno Pause delegates to pause control.
 */
(function () {
  var LEDGER_URL = '../../data/reports/z_autonomous_ledger.jsonl';
  var COMMFLOW_VERIFIER_URL = '../../data/reports/z_ecosystem_commflow_verifier.json';
  var SAGE_SIGNALS_URL = '../../data/reports/z_sage_signals.json';

  var MOCK_RECEIPTS = [
    '2026-04-30 · sovereign-products — LANE PAUSED · review Registry Lite panel + JSON — IndustryBot notes deferred (no generated fields yet)',
    '2026-04-29 15:44 · eco:commflow — verify refresh (stub when ledger empty)',
    '2026-04-29 14:57 · commander panel — daily surfaces v2 (mock)',
    '2026-04-29 14:57 · IDE comm-flow guard — advisory amber (routing convention)',
    '2026-04-29 · staging DB watcher — IDLE · no bind (mock)',
    '2026-04-29 · Morph strip — DISPLAY tokens ready (operator UI)',
  ];

  function text(el, fallback) {
    if (!el) return fallback || '—';
    var t = el.textContent || '';
    return t.replace(/\s+/g, ' ').trim() || fallback || '—';
  }

  function syncBadgeStrip() {
    var tr = document.getElementById('zTwinRootsBadge');
    var zh = document.getElementById('zZunoHandBadge');

    var twin = text(tr, 'TwinRoots: —').replace(/^TwinRoots:\s*/i, '');
    var hand = text(zh, 'ZunoHand: —').replace(/^ZunoHand:\s*/i, '');

    var elTwin = document.getElementById('zCmdTwinRoots');
    var elHand = document.getElementById('zCmdZunoHand');
    if (elTwin) elTwin.textContent = twin || '—';
    if (elHand)
      elHand.textContent =
        'OBSERVE · ' +
        (hand || 'placeholder');
  }

  function lastLinesJsonl(raw, n) {
    var lines = raw.split(/\r?\n/).filter(function (l) {
      return l.trim().length > 0;
    });
    return lines.slice(Math.max(0, lines.length - n));
  }

  function shortenLedgerLine(jsonLine) {
    try {
      var o = JSON.parse(jsonLine);
      var ev = o.event || 'event';
      var st = o.status || '';
      var ts = o.ts || '';
      return (ts ? ts.replace('T', ' ').slice(0, 19) + ' · ' : '') + ev + (st ? ' · ' + st : '');
    } catch (e) {
      return jsonLine.length > 96 ? jsonLine.slice(0, 93) + '…' : jsonLine;
    }
  }

  function populateReceipts(lines) {
    var ul = document.getElementById('zCommanderReceiptsList');
    if (!ul) return;

    ul.innerHTML = '';
    var use = lines && lines.length ? lines.slice(-5) : MOCK_RECEIPTS.slice(0, 5);

    use.forEach(function (ln) {
      var li = document.createElement('li');
      li.textContent =
        typeof ln === 'string' && ln.trim().startsWith('{') ? shortenLedgerLine(ln) : String(ln);
      ul.appendChild(li);
    });
  }

  function fetchLedger() {
    fetch(LEDGER_URL, { cache: 'no-store' })
      .then(function (r) {
        return r.ok ? r.text() : '';
      })
      .then(function (txt) {
        populateReceipts(txt ? lastLinesJsonl(txt, 5) : []);
      })
      .catch(function () {
        populateReceipts([]);
      });
  }

  function isValidSageSignalsV1(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
    if (data.schema !== 'Z_SAGE_SIGNALS_V1') return false;
    if (data.posture !== 'observe_only') return false;
    if (data.actions_allowed !== false) return false;
    if (!Array.isArray(data.pulse)) return false;
    if (!Array.isArray(data.upgrades)) return false;
    if (!Array.isArray(data.drift)) return false;
    if (typeof data.generated_at !== 'string' || !String(data.generated_at).trim()) return false;
    return true;
  }

  function formatSageItemLine(item, kind) {
    if (!item || typeof item !== 'object') return '';
    var parts = [];
    if (kind === 'pulse' || kind === 'drift') {
      if (item.level) parts.push(String(item.level));
      if (item.title) parts.push(String(item.title));
      if (item.summary) parts.push(String(item.summary));
    } else if (kind === 'upgrade') {
      if (item.title) parts.push(String(item.title));
      if (item.status) parts.push(String(item.status));
      if (item.summary) parts.push(String(item.summary));
      if (Array.isArray(item.links) && item.links.length) {
        parts.push(item.links.map(String).join(', '));
      }
    }
    return parts.length ? parts.join(' · ') : '';
  }

  function fillSageSection(ul, items, emptyNote, maxn, kind) {
    if (!ul) return;
    ul.innerHTML = '';
    var list = Array.isArray(items) ? items.slice(0, maxn || 5) : [];
    if (!list.length) {
      var li0 = document.createElement('li');
      li0.textContent = emptyNote;
      ul.appendChild(li0);
      return;
    }
    list.forEach(function (item) {
      var li = document.createElement('li');
      var line = formatSageItemLine(item, kind);
      li.textContent = line || JSON.stringify(item).slice(0, 120);
      ul.appendChild(li);
    });
  }

  function formatSageFreshness(iso) {
    if (!iso || typeof iso !== 'string') return 'Report time not specified in file.';
    var ms = Date.parse(iso);
    if (Number.isNaN(ms)) return 'Report timestamp unreadable.';
    var d = new Date(ms);
    return (
      'Last updated: ' +
      d.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC')
    );
  }

  function fetchSageSignals() {
    var statusEl = document.getElementById('zCommanderSageStatus');
    var pulseUl = document.getElementById('zCommanderSagePulseList');
    var freshnessEl = document.getElementById('zCommanderSageFreshness');
    var upEl = document.getElementById('zCommanderSageUpgrades');
    var drEl = document.getElementById('zCommanderSageDrift');

    function setStatus(msg) {
      if (statusEl) statusEl.textContent = msg || '';
    }

    function setFreshness(line) {
      if (freshnessEl) freshnessEl.textContent = line || '';
    }

    function emptySageLists() {
      if (pulseUl) pulseUl.innerHTML = '';
      if (upEl) upEl.innerHTML = '';
      if (drEl) drEl.innerHTML = '';
    }

    function sageFallback(msg) {
      setStatus(msg);
      setFreshness('');
      fillSageSection(pulseUl, [], '—', 5, 'pulse');
      fillSageSection(upEl, [], '—', 5, 'upgrade');
      fillSageSection(drEl, [], '—', 5, 'drift');
    }

    setStatus('Loading…');
    setFreshness('');
    emptySageLists();

    fetch(SAGE_SIGNALS_URL, { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) return null;
        return r.json().catch(function () {
          return { __sageInvalidJson: true };
        });
      })
      .then(function (data) {
        if (data && data.__sageInvalidJson) {
          sageFallback('Malformed JSON in z_sage_signals.json — fix or replace file (see bridge doc).');
          return;
        }

        if (!data || typeof data !== 'object') {
          sageFallback(
            'No SAGE file — copy docs/z-sage/z_sage_signals.example.json to data/reports/z_sage_signals.json (see bridge doc).',
          );
          return;
        }

        if (!isValidSageSignalsV1(data)) {
          sageFallback(
            'Invalid SAGE schema v1 — need schema Z_SAGE_SIGNALS_V1, posture observe_only, actions_allowed false, and pulse, upgrades, drift arrays (see docs/Z-SAGE-SIGNAL-SCHEMA-V1.md).',
          );
          return;
        }

        setStatus('');
        setFreshness(formatSageFreshness(data.generated_at));

        fillSageSection(pulseUl, data.pulse, 'No pulse rows.', 5, 'pulse');
        fillSageSection(upEl, data.upgrades, 'No upgrade rows.', 5, 'upgrade');
        fillSageSection(drEl, data.drift, 'No drift rows.', 5, 'drift');
      })
      .catch(function () {
        sageFallback('Offline — open dashboard via hub static server to load z_sage_signals.json.');
      });
  }

  function fetchCommflowBrief() {
    var el = document.getElementById('zCmdCommflowBrief');
    var chip = document.getElementById('zCmdCommflowChip');
    if (!el && !chip) return;

    function setBrief(msg, hint) {
      if (el) el.textContent = msg;
      if (chip && hint) chip.setAttribute('title', hint);
    }

    setBrief('loading…', 'Fetching ecosystem comm-flow verifier JSON');

    fetch(COMMFLOW_VERIFIER_URL, { cache: 'no-store' })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (data) {
        if (!data || !data.summary) {
          setBrief('offline', 'Verifier JSON missing or unreachable from this browser context');
          return;
        }

        var ov = String(data.overall_status || 'unknown').toUpperCase();
        var ide = null;
        var nodes = data.nodes || [];
        for (var i = 0; i < nodes.length; i++) {
          if (nodes[i].system_id === 'ide_commflow_guard') {
            ide = nodes[i];
            break;
          }
        }

        var ideBit = ide
          ? String(ide.status_color || '').toUpperCase() +
            ' IDE · ' +
            (ide.details ? String(ide.details).slice(0, 32) : 'advisory')
          : 'IDE lane ?';

        setBrief(ov + ' · ' + ideBit,
          'Eco: ' +
            ov +
            '; nodes green/amber/red = ' +
            (data.summary.colors
              ? data.summary.colors.green +
                '/' +
                data.summary.colors.amber +
                '/' +
                data.summary.colors.red
              : '—'));
      })
      .catch(function () {
        setBrief('offline (mock)', 'Open data/reports from hub static server');
      });
  }

  function wireActions() {
    document.querySelectorAll('[data-z-commander-action]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var action = btn.getAttribute('data-z-commander-action');

        if (action === 'run-watcher') {
          var toggle = document.getElementById('zStatusRailToggleBtn');
          if (toggle && document.body.classList.contains('z-status-rail-collapsed')) {
            toggle.click();
          }
          try {
            var pan = document.getElementById('zCycleIndicatorPanel');
            if (pan) pan.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } catch (_) {
            var fallback = document.getElementById('zAutoRunAuditBtn');
            if (fallback) fallback.focus();
          }
          return;
        }

        if (action === 'pause-ai') {
          var p = document.getElementById('zunoHandPauseBtn');
          if (p) {
            p.click();
          } else if (window.console && console.warn) {
            console.warn('[Commander] Zuno Hand pause control not in DOM.');
          }
          return;
        }
      });
    });
  }

  function refreshLoop() {
    syncBadgeStrip();
    fetchLedger();
    fetchCommflowBrief();
    fetchSageSignals();
  }

  function boot() {
    var root = document.getElementById('zCommanderPanel');
    if (!root) return;
    syncBadgeStrip();
    fetchLedger();
    fetchCommflowBrief();
    fetchSageSignals();
    wireActions();
    document.addEventListener(
      'visibilitychange',
      function () {
        if (!document.hidden) refreshLoop();
      },
      false,
    );
    setInterval(function () {
      syncBadgeStrip();
    }, 8000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
