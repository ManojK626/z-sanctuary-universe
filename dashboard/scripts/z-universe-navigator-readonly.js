/**
 * NAV-1 — Universal Workstation Navigator (read-only).
 * No APIs, no execution, no localStorage — metadata + links only.
 */
(function () {
  var MAP = window.ZUniverseNavigatorMap;
  if (!MAP || !MAP.config) {
    console.warn('ZUniverseNavigatorMap missing — load z-universe-service-map.js first.');
    return;
  }

  function esc(x) {
    return String(x ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function syncRailWidth(nav) {
    var expanded = nav.getAttribute('data-expanded') === '1';
    var w = expanded ? '228px' : '52px';
    document.documentElement.style.setProperty('--z-univ-rail-w', w);
  }

  function syncLowSensory() {
    var m = String(document.body.dataset.displayMode || '').toLowerCase();
    document.body.classList.toggle('z-univ-low-sensory', m === 'low-sensory');
  }

  function hrefToAbs(link) {
    var l = String(link || '').trim();
    if (!l) return '#';
    return '../../' + l.replace(/^\/+/, '');
  }

  function renderDetail(panel, svc) {
    var body = panel.querySelector('.z-univ-ws-detail__body');
    if (!body || !svc) return;

    var docs = (svc.related_docs || []).map(function (p) {
      var u = hrefToAbs(p);
      return '<a href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">' + esc(p) + '</a>';
    });
    var reps = (svc.related_reports || []).map(function (p) {
      var u = hrefToAbs(p);
      return '<a href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">' + esc(p) + '</a>';
    });

    var flow = (svc.workflow_summary || []).map(function (step) {
      return '<li>' + esc(step) + '</li>';
    });

    var allow = (svc.allowed_next_actions || []).map(function (x) {
      return '<li>' + esc(x) + '</li>';
    });
    var forbid = (svc.forbidden_until_gate || []).map(function (x) {
      return '<li>' + esc(x) + '</li>';
    });

    body.innerHTML =
      '<p style="margin:0 0 0.5rem;font-size:0.72rem;color:hsl(215 18% 72%);">Read-only metadata — follow links locally. No buttons here execute hub workflows.</p>' +
      '<h2 style="margin:0;font-size:1.05rem;line-height:1.25;">' +
      esc(svc.icon || '') +
      ' ' +
      esc(svc.name) +
      '</h2>' +
      '<p style="margin:0.35rem 0 0;font-size:0.82rem;color:hsl(46 24% 82%);">' +
      esc(svc.purpose || '') +
      '</p>' +
      '<dl>' +
      '<dt>Category</dt><dd>' +
      esc(svc.category || '') +
      '</dd>' +
      '<dt>Status</dt><dd>' +
      esc(svc.status || '') +
      '</dd>' +
      '<dt>Safety level</dt><dd>' +
      esc(svc.safety_level || '') +
      '</dd>' +
      '<dt>Bridge status</dt><dd>' +
      esc(svc.bridge_status || '') +
      '</dd>' +
      '<dt>Memory status</dt><dd>' +
      esc(svc.memory_status || '') +
      '</dd>' +
      '<dt>DRP gate</dt><dd>' +
      esc(svc.drp_gate || '') +
      '</dd>' +
      '<dt>Route family</dt><dd>' +
      esc(svc.route_family || '') +
      '</dd>' +
      '<dt>Related docs</dt><dd class="z-univ-ws-detail__links">' +
      (docs.length ? docs.join('') : '<span>No links</span>') +
      '</dd>' +
      '<dt>Related reports</dt><dd class="z-univ-ws-detail__links">' +
      (reps.length ? reps.join('') : '<span>No links</span>') +
      '</dd>' +
      '</dl>' +
      '<h3 class="z-univ-ws-detail__h">Workflow map</h3>' +
      '<ol class="z-univ-ws-detail__flow">' +
      flow.join('') +
      '</ol>' +
      '<h3 class="z-univ-ws-detail__h">Allowed next actions</h3>' +
      '<ol class="z-univ-ws-detail__flow">' +
      allow.join('') +
      '</ol>' +
      '<h3 class="z-univ-ws-detail__h">Forbidden until gate</h3>' +
      '<ol class="z-univ-ws-detail__flow">' +
      forbid.join('') +
      '</ol>' +
      (svc.safety_notes
        ? '<div class="z-univ-ws-detail__banner">' + esc(svc.safety_notes) + '</div>'
        : '') +
      '<div class="z-univ-ws-detail__banner">User/project memory folders: <strong>future gated</strong> — requires consent, privacy policy, deletion controls, and 14 DRP review. This navigator does not save memory.</div>';

    panel.setAttribute('data-open', '1');
    panel.querySelector('.z-univ-ws-detail__close').focus();
  }

  function wire(serviceById, detail, rail) {
    var buttons = rail.querySelectorAll('.z-univ-ws-nav__svc');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-service-id');
        var svc = serviceById[id];
        buttons.forEach(function (b) {
          b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });
        renderDetail(detail, svc);
      });
    });
  }

  function buildRail(catalog, detail) {
    var categories = catalog.categories || [];
    var services = catalog.services || [];
    var serviceById = {};
    services.forEach(function (s) {
      serviceById[s.id] = s;
    });

    var nav = document.createElement('nav');
    nav.className = 'z-univ-ws-nav';
    nav.setAttribute('aria-label', 'Universal Workstation Navigator');
    nav.setAttribute('data-expanded', '0');
    nav.setAttribute('data-collapsed', '1');

    var tb = document.createElement('div');
    tb.className = 'z-univ-ws-nav__toolbar';
    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'z-univ-ws-nav__toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = 'Navigator ▶';
    tb.appendChild(toggle);
    nav.appendChild(tb);

    var scroll = document.createElement('div');
    scroll.className = 'z-univ-ws-nav__scroll';

    categories.forEach(function (cat) {
      var catSvcs = services.filter(function (s) {
        return s.category === cat.id;
      });
      if (!catSvcs.length) return;

      var wrap = document.createElement('div');
      wrap.className = 'z-univ-ws-nav__cat';

      var head = document.createElement('div');
      head.className = 'z-univ-ws-nav__cat-head';
      head.style.setProperty('--z-univ-cat-accent', 'hsl(' + MAP.accentForCategory(cat.id) + ')');
      head.innerHTML = '<span aria-hidden="true">' + esc(cat.icon) + '</span><span>' + esc(cat.label) + '</span>';
      wrap.appendChild(head);

      catSvcs.forEach(function (svc) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'z-univ-ws-nav__svc';
        btn.setAttribute('data-service-id', svc.id);
        btn.setAttribute('aria-selected', 'false');
        btn.innerHTML =
          '<span class="z-univ-ws-nav__svc-ico" aria-hidden="true">' +
          esc(svc.icon || '·') +
          '</span>' +
          '<span class="z-univ-ws-nav__svc-body">' +
          '<span>' +
          esc(svc.name) +
          '</span><br /><span class="z-univ-ws-nav__pill">' +
          esc(svc.status || '') +
          '</span></span>';
        wrap.appendChild(btn);
      });

      scroll.appendChild(wrap);
    });

    nav.appendChild(scroll);

    var foot = document.createElement('div');
    foot.className = 'z-univ-ws-nav__foot';
    foot.innerHTML =
      '<div><strong>Posture:</strong> ' +
      esc(catalog.posture || '') +
      '</div>' +
      '<div><strong>Bridge:</strong> ' +
      esc(catalog.bridge_status || '') +
      '</div>' +
      '<div><strong>Memory:</strong> ' +
      esc(catalog.memory_folder_gate || '') +
      '</div>';
    nav.appendChild(foot);

    toggle.addEventListener('click', function () {
      var exp = nav.getAttribute('data-expanded') === '1';
      nav.setAttribute('data-expanded', exp ? '0' : '1');
      nav.setAttribute('data-collapsed', exp ? '1' : '0');
      toggle.setAttribute('aria-expanded', exp ? 'false' : 'true');
      toggle.textContent = exp ? 'Navigator ▶' : 'Navigator ◀';
      syncRailWidth(nav);
    });

    document.body.appendChild(nav);
    syncRailWidth(nav);

    wire(serviceById, detail, nav);
    return nav;
  }

  function buildDetailShell() {
    var panel = document.createElement('aside');
    panel.className = 'z-univ-ws-detail';
    panel.setAttribute('aria-label', 'Service detail');
    panel.setAttribute('data-open', '0');
    panel.innerHTML =
      '<div class="z-univ-ws-detail__head">' +
      '<div><strong>Service detail</strong><div style="font-size:0.72rem;opacity:0.85;margin-top:0.2rem;">Read-only</div></div>' +
      '<button type="button" class="z-univ-ws-detail__close" aria-label="Close detail panel">Close</button>' +
      '</div>' +
      '<div class="z-univ-ws-detail__body"></div>';
    document.body.appendChild(panel);

    function closeDetail() {
      panel.setAttribute('data-open', '0');
      var rail = document.querySelector('.z-univ-ws-nav');
      if (rail) {
        rail.querySelectorAll('.z-univ-ws-nav__svc').forEach(function (b) {
          b.setAttribute('aria-selected', 'false');
        });
      }
    }

    panel.querySelector('.z-univ-ws-detail__close').addEventListener('click', closeDetail);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDetail();
    });

    return panel;
  }

  function init() {
    syncLowSensory();
    var mo = new MutationObserver(syncLowSensory);
    mo.observe(document.body, { attributes: true, attributeFilter: ['data-display-mode'] });

    var detail = buildDetailShell();
    var url = MAP.config.catalogUrl;

    fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error('catalog_http_' + r.status);
        return r.json();
      })
      .then(function (catalog) {
        document.body.classList.add('z-univ-ws-nav--attached');
        buildRail(catalog, detail);
      })
      .catch(function () {
        detail.querySelector('.z-univ-ws-detail__body').innerHTML =
          '<p>Could not load <code>' +
          esc(url) +
          '</code>. Serve the hub from repo root (see dashboard README) so fetch works.</p>' +
          '<p>Open: <a href="../../docs/dashboard/Z_UNIVERSE_WORKSTATION_NAVIGATOR.md" target="_blank" rel="noopener">Navigator doc</a></p>';
        detail.setAttribute('data-open', '1');
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
