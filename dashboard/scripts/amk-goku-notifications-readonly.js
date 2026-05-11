/**
 * AMK-Goku Notifications Panel — Phase AMK-NOTIFY-1
 * Read-only lane cards + local operator decision stub (localStorage only).
 * Does not run Cursor tasks, npm, deploy, bridges, or billing.
 */
(function () {
  var LS_KEY = 'amkGokuNotificationDecision_v1';

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

  function loadDecisions() {
    try {
      var raw = window.localStorage.getItem(LS_KEY);
      if (!raw) return {};
      var o = JSON.parse(raw);
      return o && typeof o === 'object' && o.decisions ? o.decisions : {};
    } catch (_) {
      return {};
    }
  }

  function saveDecision(id, status) {
    var all = loadDecisions();
    all[id] = { status: status, decided_at_iso: new Date().toISOString() };
    try {
      window.localStorage.setItem(LS_KEY, JSON.stringify({ decisions: all, schema: 'amk_local_decision_stub_v1' }));
    } catch (_) {}
  }

  function pillClass(sig) {
    var s = String(sig || '').toUpperCase();
    if (s === 'GREEN') return 'z-amk-pill z-amk-pill--green';
    if (s === 'YELLOW') return 'z-amk-pill z-amk-pill--yellow';
    if (s === 'RED') return 'z-amk-pill z-amk-pill--red';
    if (s === 'BLUE') return 'z-amk-pill z-amk-pill--blue';
    return 'z-amk-pill z-amk-pill--risk';
  }

  function render(mount, data) {
    if (!mount || !data || !Array.isArray(data.notifications)) {
      mount.innerHTML = '<p class="z-amk-notify-local">No notifications payload.</p>';
      return;
    }
    var decisions = loadDecisions();
    var items = data.notifications.slice().sort(function (a, b) {
      var ap = a.status === 'pending' ? 0 : 1;
      var bp = b.status === 'pending' ? 0 : 1;
      if (ap !== bp) return ap - bp;
      return String(a.id).localeCompare(String(b.id));
    });
    var html = [];
    items.forEach(function (n, idx) {
      var eff = decisions[n.id] ? decisions[n.id].status : n.status;
      var pendingFirst = eff === 'pending' && idx === 0 ? '1' : '0';
      html.push('<article class="z-amk-notify-card" data-id="' + esc(n.id) + '" data-pending-first="' + pendingFirst + '">');
      html.push('<div class="z-amk-notify-title">' + esc(n.title) + '</div>');
      html.push('<div class="z-amk-notify-meta">');
      html.push('<span class="' + pillClass(n.signal) + '">' + esc(n.signal) + '</span>');
      html.push('<span class="z-amk-pill z-amk-pill--risk">Risk: ' + esc(n.risk_class) + '</span>');
      html.push('<span class="z-amk-pill z-amk-pill--zag">' + esc(n.autonomy_level) + '</span>');
      html.push('<span class="z-amk-pill z-amk-pill--risk">Local: ' + esc(eff) + '</span>');
      html.push('</div>');
      html.push('<div class="z-amk-notify-local">Domain: ' + esc(n.domain) + ' · By: ' + esc(n.recommended_by) + '</div>');
      if (n.human_confirmation_required) {
        html.push('<div class="z-amk-notify-local"><strong>Human gate:</strong> required</div>');
      }
      if (Array.isArray(n.required_checks) && n.required_checks.length) {
        html.push('<ul class="z-amk-notify-checks">');
        n.required_checks.forEach(function (c) {
          html.push('<li><code>' + esc(c) + '</code></li>');
        });
        html.push('</ul>');
      }
      if (n.rollback_note) {
        html.push('<div class="z-amk-notify-local">Rollback: ' + esc(n.rollback_note) + '</div>');
      }
      html.push('<div class="z-amk-notify-actions">');
      html.push(
        '<button type="button" class="z-amk-notify-btn" data-amk-action="confirm" data-amk-id="' +
          esc(n.id) +
          '">Confirm next lane</button>',
      );
      html.push('<button type="button" class="z-amk-notify-btn" data-amk-action="hold" data-amk-id="' + esc(n.id) + '">Hold</button>');
      html.push(
        '<button type="button" class="z-amk-notify-btn" data-amk-action="review" data-amk-id="' +
          esc(n.id) +
          '">Needs review</button>',
      );
      html.push('</div>');
      if (decisions[n.id]) {
        html.push(
          '<div class="z-amk-notify-local">Browser record: ' +
            esc(decisions[n.id].status) +
            ' @ ' +
            esc(decisions[n.id].decided_at_iso) +
            '</div>',
        );
      }
      html.push('</article>');
    });
    mount.innerHTML = html.join('');
    mount.querySelectorAll('[data-amk-action]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-amk-id');
        var act = btn.getAttribute('data-amk-action');
        var st = act === 'confirm' ? 'confirmed' : act === 'hold' ? 'held' : 'review_required';
        saveDecision(id, st);
        render(mount, data);
      });
    });
  }

  function init() {
    var mount = document.getElementById('zAmkNotificationsMount');
    if (!mount) return;
    var url = rootPrefix() + '/data/amk_operator_notifications.json';
    fetch(url, { credentials: 'same-origin' })
      .then(function (r) {
        if (!r.ok) throw new Error('fetch ' + r.status);
        return r.json();
      })
      .then(function (data) {
        render(mount, data);
      })
      .catch(function () {
        mount.innerHTML =
          '<p class="z-amk-notify-local">Could not load <code>data/amk_operator_notifications.json</code>. Serve hub from repo root (e.g. <code>npx http-server . -p 5502</code>) and open this dashboard over HTTP.</p>';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
