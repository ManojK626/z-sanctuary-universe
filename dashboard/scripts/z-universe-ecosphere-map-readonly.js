/**
 * ZMV-1B — Living Ecosphere Map (read-only).
 * Loads hub JSON catalogs via fetch; renders metadata only. No APIs, execution, or billing.
 */
(function () {
  function esc(x) {
    return String(x ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function hrefToAbs(link) {
    var l = String(link || '').trim();
    if (!l) return '#';
    return '../../' + l.replace(/^\/+/, '');
  }

  function loadJson(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(url + ' HTTP ' + r.status);
      return r.json();
    });
  }

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function renderMagical(container, magical, filterQ) {
    var sec = el('section', 'z-eco-sec');
    sec.appendChild(el('h2', null, 'Magical Visual Bridge (ZMV)'));
    sec.appendChild(
      el(
        'p',
        'z-eco-sub',
        esc(magical.catalog_note || magical.posture || '') +
          ' Golden law: visual reuse does not grant service access.',
      ),
    );
    var grid = el('div', 'z-eco-grid z-eco-grid--2');
    (magical.capabilities || []).forEach(function (row) {
      var card = el('div', 'z-eco-card z-eco-card--magical');
      card.setAttribute('data-eco-search', (row.name + ' ' + row.id + ' ' + row.source_project).toLowerCase());
      card.innerHTML =
        '<h3>' +
        esc(row.name) +
        '</h3>' +
        '<p class="z-eco-sub" style="margin:0 0 0.35rem">' +
        esc(row.id) +
        '</p>' +
        '<dl>' +
        '<dt>Source</dt><dd>' +
        esc(row.source_project) +
        '</dd>' +
        '<dt>Bridge</dt><dd>' +
        esc(row.bridge_status) +
        '</dd>' +
        '<dt>Pricing owner</dt><dd>' +
        esc(row.pricing_owner) +
        '</dd>' +
        '<dt>Entitlement owner</dt><dd>' +
        esc(row.entitlement_owner) +
        '</dd>' +
        '</dl>' +
        '<p style="margin:0.35rem 0 0;font-size:0.68rem;opacity:0.85">' +
        esc(row.notes || '') +
        '</p>';
      grid.appendChild(card);
    });
    sec.appendChild(grid);
    container.appendChild(sec);
    applyFilter(container, filterQ);
  }

  function renderCapIndex(container, idx, filterQ) {
    var sec = el('section', 'z-eco-sec');
    sec.appendChild(el('h2', null, 'Cross-project capability index (ZSX)'));
    sec.appendChild(el('p', 'z-eco-sub', esc(idx.notes || idx.posture || '')));
    var byProject = {};
    (idx.capabilities || []).forEach(function (row) {
      var p = row.source_project || 'unknown';
      if (!byProject[p]) byProject[p] = [];
      byProject[p].push(row);
    });
    Object.keys(byProject)
      .sort()
      .forEach(function (proj) {
        var det = el('details', 'z-eco-details');
        det.open = Object.keys(byProject).length <= 4;
        det.innerHTML =
          '<summary>' +
          esc(proj) +
          ' · ' +
          byProject[proj].length +
          ' row(s)</summary>';
        var inner = el('div', 'z-eco-grid');
        byProject[proj].forEach(function (row) {
          var card = el('div', 'z-eco-card');
          card.setAttribute(
            'data-eco-search',
            (row.capability_name + ' ' + row.service_id + ' ' + row.bridge_status).toLowerCase(),
          );
          card.innerHTML =
            '<h3>' +
            esc(row.capability_name) +
            '</h3>' +
            '<span class="z-eco-pill">' +
            esc(row.bridge_status) +
            '</span>' +
            '<span class="z-eco-pill">' +
            esc(row.entitlement_status || '') +
            '</span>' +
            '<dl style="margin-top:0.35rem">' +
            '<dt>Pricing owner</dt><dd>' +
            esc(row.pricing_owner) +
            '</dd>' +
            '<dt>Memory</dt><dd>' +
            esc(row.memory_status) +
            '</dd>' +
            '</dl>';
          inner.appendChild(card);
        });
        det.appendChild(inner);
        sec.appendChild(det);
      });
    container.appendChild(sec);
    applyFilter(container, filterQ);
  }

  function renderEntitlement(container, ent, filterQ) {
    var sec = el('section', 'z-eco-sec');
    sec.appendChild(el('h2', null, 'Entitlement catalog (policy excerpts)'));
    var law = ent.law || {};
    var dlLaw = el('dl');
    Object.keys(law).forEach(function (k) {
      dlLaw.appendChild(el('dt', null, esc(k)));
      dlLaw.appendChild(el('dd', null, esc(law[k])));
    });
    sec.appendChild(dlLaw);
    var sub = el('div', 'z-eco-grid z-eco-grid--2');
    (ent.capability_entitlements || []).slice(0, 12).forEach(function (row) {
      var card = el('div', 'z-eco-card');
      card.setAttribute(
        'data-eco-search',
        (row.service_id + ' ' + row.capability_id + ' ' + row.cross_project_use).toLowerCase(),
      );
      card.innerHTML =
        '<h3>' +
        esc(row.service_id) +
        '</h3>' +
        '<dl>' +
        '<dt>Availability</dt><dd>' +
        esc(row.availability) +
        '</dd>' +
        '<dt>Reuse status</dt><dd>' +
        esc(row.reuse_status) +
        '</dd>' +
        '<dt>Cross-project</dt><dd>' +
        esc(row.cross_project_use) +
        '</dd>' +
        '<dt>Billing rule</dt><dd>' +
        esc(row.billing_conflict_rule) +
        '</dd>' +
        '</dl>';
      if (row.warning)
        card.innerHTML += '<p style="margin:0.35rem 0 0;font-size:0.66rem;color:hsl(35 70% 62%)">' + esc(row.warning) + '</p>';
      sub.appendChild(card);
    });
    sec.appendChild(sub);
    container.appendChild(sec);
    applyFilter(container, filterQ);
  }

  function renderShadow(container, shadow, filterQ) {
    var sec = el('section', 'z-eco-sec');
    sec.appendChild(el('h2', null, 'Shadow preview policy'));
    sec.appendChild(el('p', 'z-eco-sub', esc(shadow.purpose || shadow.shadow_preview_definition || '')));
    var ul = el('ul');
    ul.style.fontSize = '0.72rem';
    (shadow.required_declarations || []).forEach(function (x) {
      ul.innerHTML += '<li>' + esc(x) + '</li>';
    });
    sec.appendChild(ul);
    container.appendChild(sec);
    applyFilter(container, filterQ);
  }

  function renderCatalog(container, catalog, filterQ) {
    var sec = el('section', 'z-eco-sec');
    sec.appendChild(el('h2', null, 'Navigator services (from workstation catalog)'));
    sec.appendChild(
      el(
        'p',
        'z-eco-sub',
        'Posture: ' + esc(catalog.posture || '') + ' · Categories: ' + (catalog.categories || []).length,
      ),
    );
    var cats = catalog.categories || [];
    var svcs = catalog.services || [];
    cats.forEach(function (cat) {
      var list = svcs.filter(function (s) {
        return s.category === cat.id;
      });
      if (!list.length) return;
      var det = el('details', 'z-eco-details');
      det.innerHTML =
        '<summary>' +
        esc(cat.icon || '') +
        ' ' +
        esc(cat.label) +
        ' · ' +
        list.length +
        '</summary>';
      var grid = el('div', 'z-eco-grid z-eco-grid--2');
      list.forEach(function (svc) {
        var card = el('div', 'z-eco-card');
        card.setAttribute(
          'data-eco-search',
          (svc.name + ' ' + svc.id + ' ' + svc.bridge_status + ' ' + svc.status).toLowerCase(),
        );
        var docs = (svc.related_docs || [])
          .map(function (p) {
            return '<a href="' + esc(hrefToAbs(p)) + '" target="_blank" rel="noopener noreferrer">' + esc(p) + '</a>';
          })
          .join('<br />');
        card.innerHTML =
          '<h3>' +
          esc(svc.icon || '') +
          ' ' +
          esc(svc.name) +
          '</h3>' +
          '<span class="z-eco-pill">' +
          esc(svc.status) +
          '</span>' +
          '<span class="z-eco-pill">' +
          esc(svc.bridge_status) +
          '</span>' +
          '<p style="margin:0.35rem 0 0;font-size:0.68rem;opacity:0.88">' +
          esc(svc.purpose || '') +
          '</p>' +
          (docs ? '<div style="margin-top:0.35rem;font-size:0.68rem">' + docs + '</div>' : '');
        grid.appendChild(card);
      });
      det.appendChild(grid);
      sec.appendChild(det);
    });
    container.appendChild(sec);
    applyFilter(container, filterQ);
  }

  function applyFilter(root, q) {
    var needle = String(q || '')
      .trim()
      .toLowerCase();
    root.querySelectorAll('[data-eco-search]').forEach(function (card) {
      if (!needle || card.getAttribute('data-eco-search').indexOf(needle) !== -1) {
        card.setAttribute('data-hidden', '0');
      } else {
        card.setAttribute('data-hidden', '1');
      }
    });
  }

  function main() {
    var root = document.getElementById('zEcoMain');
    var statusEl = document.getElementById('zEcoStatus');
    var filterInput = document.getElementById('zEcoFilter');
    if (!root || !statusEl) return;

    function runFilter() {
      applyFilter(document.getElementById('zEcoMain'), filterInput ? filterInput.value : '');
    }

    if (filterInput) {
      filterInput.addEventListener('input', runFilter);
    }

    statusEl.textContent = 'Loading catalogs…';

    Promise.all([
      loadJson('../../data/z_universe_service_catalog.json'),
      loadJson('../../data/z_cross_project_capability_index.json'),
      loadJson('../../data/z_service_entitlement_catalog.json'),
      loadJson('../../data/z_magical_visual_capability_registry.json'),
      loadJson('../../data/z_shadow_preview_policy.json'),
    ])
      .then(function (results) {
        var catalog = results[0];
        var capIdx = results[1];
        var ent = results[2];
        var magical = results[3];
        var shadow = results[4];
        root.innerHTML = '';
        statusEl.textContent =
          'Loaded · ' +
          (catalog.services || []).length +
          ' services · ' +
          (capIdx.capabilities || []).length +
          ' capability rows · ' +
          (magical.capabilities || []).length +
          ' magical visual rows · read-only';
        renderMagical(root, magical, '');
        renderCatalog(root, catalog, '');
        renderCapIndex(root, capIdx, '');
        renderEntitlement(root, ent, '');
        renderShadow(root, shadow, '');
        runFilter();
      })
      .catch(function (err) {
        statusEl.textContent =
          'Could not load JSON — serve hub root over HTTP (e.g. npx http-server . -p 5502). ' + esc(err.message || err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();
