/**
 * Passive AnyDevice evidence panel for AMK-Goku Main Control.
 * GET registry JSON only. No status writes, tests, or deployment actions.
 */
(function () {
  var view = window.ZAnyDeviceEvidenceView;
  var root = document.getElementById('zAnyDeviceEvidenceMount');
  if (!view || !root) return;

  var FILTERS = ['ALL', 'GREEN', 'AMBER', 'RED', 'NOT_TESTED', 'LEGACY', 'EXEMPT', 'HAS P0', 'HAS P1', 'HAS P2'];
  var state = { rows: [], filter: 'ALL', selected: '' };
  var recordedMain = root.getAttribute('data-current-canonical-sha') || 'UNKNOWN';

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function line(label, value) {
    var row = el('p', 'z-ade-line');
    row.appendChild(el('span', 'z-ade-label', label + ': '));
    row.appendChild(el('span', 'z-ade-value', value));
    return row;
  }

  function statusChip(status) {
    var chip = el('span', 'z-ade-status', status);
    chip.setAttribute('data-status', status);
    return chip;
  }

  function render() {
    root.replaceChildren();
    var summary = view.platformSummary(state.rows);
    var header = el('div', 'z-ade-summary');
    header.appendChild(el('h3', 'z-ade-title', 'Adaptive Platform'));
    header.appendChild(line('Platform', summary.capability));
    header.appendChild(line('Canonical', summary.canonicalOnMain));
    header.appendChild(line('Ecosystem-wide GREEN', summary.ecosystemWideGreen));
    header.appendChild(line('GREEN Hosts', String(summary.greenHosts)));
    header.appendChild(line('Open P0', String(summary.openP0)));
    header.appendChild(line('Open P1', String(summary.openP1)));
    header.appendChild(line('Open P2', String(summary.openP2)));
    header.appendChild(
      el(
        'p',
        'z-ade-law',
        'Observation only. Adaptive status is not device trust. Drift is not failure. This panel does not adopt, deploy, approve, or write the registry.'
      )
    );
    root.appendChild(header);

    var filters = el('div', 'z-ade-filters');
    filters.setAttribute('role', 'group');
    filters.setAttribute('aria-label', 'Filter AnyDevice evidence');
    FILTERS.forEach(function (name) {
      var button = el('button', 'z-ade-filter', name);
      button.type = 'button';
      button.setAttribute('aria-pressed', name === state.filter ? 'true' : 'false');
      button.addEventListener('click', function () {
        state.filter = name;
        render();
      });
      filters.appendChild(button);
    });
    root.appendChild(filters);

    var list = el('div', 'z-ade-list');
    view.filterRows(state.rows, state.filter).forEach(function (row) {
      var card = el('article', 'z-ade-card');
      var title = el('h4', 'z-ade-project');
      title.appendChild(document.createTextNode(row.project + ' '));
      title.appendChild(statusChip(row.status));
      card.appendChild(title);
      card.appendChild(line('Canonical surface', row.surface));
      card.appendChild(line('Tested SHA', row.testedSha));
      card.appendChild(line('Recorded canonical SHA', recordedMain));
      card.appendChild(line('Drift', view.driftLabel(row.testedSha, recordedMain)));
      card.appendChild(line('Synthetic viewport evidence', row.syntheticEvidence));
      card.appendChild(line('Browser family evidence', row.browserFamilyEvidence));
      card.appendChild(line('Physical device evidence', row.physicalDevice));
      var detailButton = el('button', 'z-ade-detail-btn', 'Show evidence detail');
      detailButton.type = 'button';
      detailButton.setAttribute('aria-expanded', state.selected === row.project ? 'true' : 'false');
      detailButton.addEventListener('click', function () {
        state.selected = state.selected === row.project ? '' : row.project;
        render();
      });
      card.appendChild(detailButton);
      if (state.selected === row.project) {
        var detail = el('div', 'z-ade-detail');
        detail.setAttribute('role', 'region');
        detail.setAttribute('aria-label', 'Evidence detail for ' + row.project);
        [
          ['Contract version', row.contractVersion],
          ['Adaptive runtime', row.runtimeVersion],
          ['Last tested', row.lastTested],
          ['Chromium', row.chromium],
          ['Firefox', row.firefox],
          ['WebKit', row.webkit],
          ['Viewport coverage', row.viewportCoverage],
          ['Pointer fine', row.pointerFine],
          ['Pointer coarse', row.pointerCoarse],
          ['Hover', row.hover],
          ['No hover', row.noHover],
          ['Keyboard', row.keyboard],
          ['Reduced motion', row.reducedMotion],
          ['Safe area', row.safeArea],
          ['Dynamic viewport', row.dynamicViewport],
          ['Business truth parity', row.businessTruth],
          ['Open P0', row.openP0.length ? row.openP0.join(', ') : 'NONE'],
          ['Open P1', row.openP1.length ? row.openP1.join(', ') : 'NONE'],
          ['Open P2', row.openP2.length ? row.openP2.join(', ') : 'NONE'],
          ['Evidence receipt', row.receipt],
        ].forEach(function (pair) {
          detail.appendChild(line(pair[0], pair[1]));
        });
        card.appendChild(detail);
      }
      list.appendChild(card);
    });
    root.appendChild(list);
  }

  fetch('../../data/z_anydevice_adaptive_adoption_registry.json', { method: 'GET', cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) throw new Error('registry unavailable');
      return response.json();
    })
    .then(function (registry) {
      state.rows = view.rowsFromRegistry(registry);
      render();
    })
    .catch(function () {
      root.replaceChildren();
      root.appendChild(el('p', 'z-ade-law', 'AnyDevice evidence registry: UNKNOWN. Serve the hub over HTTP.'));
    });
})();
