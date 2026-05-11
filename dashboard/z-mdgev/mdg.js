/**
 * Z-MDGEV — registry + PC roster + cross-project discovery; grid / grouped / split / modal.
 */
(function () {
  const REGISTRY = '../../data/z_mdg_dashboard_registry.json';
  const PC_PROJECTS = '../../data/z_pc_root_projects.json';
  const DISCOVERY = '../../data/reports/z_mdg_dashboard_discovery.json';

  const el = (id) => document.getElementById(id);

  function simpleHash(s) {
    let h = 0;
    const str = String(s);
    for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
    return (h >>> 0).toString(16).slice(0, 8);
  }

  function normalizeHref(href) {
    if (!href) return '#';
    if (href.startsWith('http://') || href.startsWith('https://')) return href;
    if (href.startsWith('/')) return href;
    return `/${href.replace(/^\/+/, '')}`;
  }

  function tileFromProject(p) {
    const url = (p.dashboard_url || '').trim();
    if (!url) return null;
    const role = p.role || 'member';
    const category =
      role === 'external' ? 'external' : role === 'hub' ? 'hub' : 'member';
    const isHttp = /^https?:\/\//i.test(url);
    return {
      id: `pc-${p.id}`,
      title: p.name || p.id,
      category,
      projectGroup: p.name,
      description: p.notes || `PC roster · path: ${p.path || 'n/a'}`,
      href: url,
      open_mode: 'new',
      allow_preview: false,
      external: isHttp,
      source: 'roster',
    };
  }

  function tilesFromDiscovery(doc) {
    const out = [];
    if (!doc?.projects) return out;
    for (const p of doc.projects) {
      for (const h of p.html_files || []) {
        out.push({
          id: `d-${p.id}-${simpleHash(h.rel)}`,
          title: h.title || h.rel,
          category: 'discovered',
          projectGroup: p.name,
          description: h.rel,
          href: h.href,
          open_mode: 'same',
          allow_preview: true,
          external: false,
          source: 'discovery',
        });
      }
    }
    return out;
  }

  async function loadJson(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`${url} → ${res.status}`);
    return res.json();
  }

  async function tryLoadJson(url) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  function mergeBase(registry, pcDoc) {
    const base = Array.isArray(registry.tiles) ? registry.tiles.map((t) => ({ ...t, projectGroup: t.projectGroup || 'Hub registry' })) : [];
    const seen = new Set(base.map((t) => t.id));
    for (const p of Array.isArray(pcDoc?.projects) ? pcDoc.projects : []) {
      const t = tileFromProject(p);
      if (t && !seen.has(t.id)) {
        seen.add(t.id);
        base.push(t);
      }
    }
    return base;
  }

  let allTiles = [];
  let discoveryMeta = null;
  let filterCat = 'all';
  let searchQ = '';
  let groupByProject = false;
  let splitMode = null;

  function matches(tile) {
    if (filterCat !== 'all' && tile.category !== filterCat) return false;
    if (!searchQ) return true;
    const q = searchQ.toLowerCase();
    return (
      (tile.title || '').toLowerCase().includes(q) ||
      (tile.description || '').toLowerCase().includes(q) ||
      (tile.href || '').toLowerCase().includes(q) ||
      (tile.projectGroup || '').toLowerCase().includes(q)
    );
  }

  function groupedSections(list) {
    const map = new Map();
    for (const t of list) {
      const g = t.projectGroup || 'Hub registry';
      if (!map.has(g)) map.set(g, []);
      map.get(g).push(t);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }

  function renderCard(tile) {
    const card = document.createElement('article');
    card.className = 'mdg-card';
    card.dataset.category = tile.category || 'hub';

    const head = document.createElement('div');
    head.className = 'mdg-card-head';

    const h3 = document.createElement('h3');
    h3.className = 'mdg-card-title';
    h3.textContent = tile.title || tile.id;

    const badge = document.createElement('span');
    badge.className = 'mdg-badge' + (tile.external ? ' external' : '');
    badge.textContent = tile.category || 'hub';

    head.appendChild(h3);
    head.appendChild(badge);

    const desc = document.createElement('p');
    desc.className = 'mdg-card-desc';
    desc.textContent = tile.description || '';

    const actions = document.createElement('div');
    actions.className = 'mdg-card-actions';

    const href = normalizeHref(tile.href);
    const openSame = tile.open_mode !== 'new' && tile.open_mode !== 'new_tab';

    const aOpen = document.createElement('a');
    aOpen.className = 'mdg-btn mdg-btn-primary';
    aOpen.href = href;
    aOpen.textContent = tile.external ? 'Open (external)' : 'Open';
    if (!openSame) aOpen.target = '_blank';
    aOpen.rel = tile.external ? 'noopener noreferrer' : '';
    actions.appendChild(aOpen);

    const popIn = document.createElement('button');
    popIn.type = 'button';
    popIn.className = 'mdg-btn';
    popIn.textContent = 'Pop-in';
    popIn.addEventListener('click', () => openModal(href, tile.title));
    actions.appendChild(popIn);

    const popOut = document.createElement('button');
    popOut.type = 'button';
    popOut.className = 'mdg-btn';
    popOut.textContent = 'Pop-out';
    popOut.addEventListener('click', () => window.open(href, '_blank', 'noopener,noreferrer'));
    actions.appendChild(popOut);

    if (tile.allow_preview && !tile.external) {
      const prevId = `pv-${tile.id.replace(/[^a-z0-9_-]/gi, '-')}`;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mdg-btn';
      btn.textContent = 'Inline';
      btn.addEventListener('click', () => toggleInline(prevId));
      actions.appendChild(btn);

      const wrap = document.createElement('div');
      wrap.className = 'mdg-preview-wrap';
      wrap.id = prevId;
      wrap.dataset.open = 'false';
      const iframe = document.createElement('iframe');
      iframe.title = `Preview: ${tile.title}`;
      iframe.loading = 'lazy';
      iframe.src = href;
      wrap.appendChild(iframe);
      card.appendChild(head);
      card.appendChild(desc);
      card.appendChild(actions);
      card.appendChild(wrap);
      return card;
    }

    card.appendChild(head);
    card.appendChild(desc);
    card.appendChild(actions);
    return card;
  }

  function toggleInline(wrapId) {
    const wrap = document.getElementById(wrapId);
    if (!wrap) return;
    wrap.dataset.open = wrap.dataset.open === 'true' ? 'false' : 'true';
  }

  function render() {
    const grid = el('mdg-grid');
    const status = el('mdg-status');
    if (!grid) return;

    const list = allTiles.filter(matches);
    grid.replaceChildren();

    if (!list.length) {
      status.textContent = allTiles.length
        ? 'No dashboards match filter / search.'
        : 'No tiles — run discovery: npm run dashboard:mdgev-discover';
      return;
    }
    status.textContent = `${list.length} visible · ${allTiles.length} total`;

    if (groupByProject) {
      grid.className = 'mdg-grouped-root';
      for (const [groupName, tiles] of groupedSections(list)) {
        const h2 = document.createElement('h2');
        h2.className = 'mdg-section-title';
        h2.textContent = groupName;
        grid.appendChild(h2);
        const sub = document.createElement('div');
        sub.className = 'mdg-grid';
        for (const t of tiles) sub.appendChild(renderCard(t));
        grid.appendChild(sub);
      }
    } else {
      grid.className = 'mdg-grid';
      for (const t of list) grid.appendChild(renderCard(t));
    }
  }

  function openModal(href, title) {
    const back = el('mdg-modal-backdrop');
    const frame = el('mdg-modal-frame');
    const tit = el('mdg-modal-title');
    if (!back || !frame) return;
    frame.src = href;
    if (tit) tit.textContent = title || href;
    back.dataset.open = 'true';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const back = el('mdg-modal-backdrop');
    const frame = el('mdg-modal-frame');
    if (back) back.dataset.open = 'false';
    if (frame) frame.src = 'about:blank';
    document.body.style.overflow = '';
  }

  function wireModal() {
    el('mdg-modal-close')?.addEventListener('click', closeModal);
    el('mdg-modal-backdrop')?.addEventListener('click', (e) => {
      if (e.target === el('mdg-modal-backdrop')) closeModal();
    });
    el('mdg-modal-tab')?.addEventListener('click', () => {
      const f = el('mdg-modal-frame');
      if (f?.src) window.open(f.src, '_blank', 'noopener,noreferrer');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  function fillSplitSelects(n) {
    const list = allTiles.filter(matches);
    const pool = list.length ? list : allTiles;
    for (let i = 0; i < n; i++) {
      const sel = el(`mdg-slot-${i}`);
      if (!sel) continue;
      sel.replaceChildren();
      const ph = document.createElement('option');
      ph.value = '';
      ph.textContent = '— Pick a dashboard —';
      sel.appendChild(ph);
      for (const t of pool) {
        const o = document.createElement('option');
        o.value = normalizeHref(t.href);
        o.textContent = `${t.projectGroup ? `${t.projectGroup} · ` : ''}${t.title}`;
        sel.appendChild(o);
      }
      const pick = pool[i] ? normalizeHref(pool[i].href) : '';
      if (pick) sel.value = pick;
      sel.onchange = () => {
        const ifr = document.getElementById(`mdg-slot-if-${i}`);
        if (ifr && sel.value) ifr.src = sel.value;
      };
      const ifr = document.getElementById(`mdg-slot-if-${i}`);
      if (ifr && sel.value) ifr.src = sel.value;
      else if (ifr && pool[i]) ifr.src = normalizeHref(pool[i].href);
    }
  }

  function setSplitMode(mode) {
    splitMode = mode;
    const wrap = el('mdg-split-wrap');
    const flow = el('mdg-main-flow');
    const gridEl = el('mdg-split-grid');
    if (!wrap || !flow) return;

    el('mdg-layout-grid')?.setAttribute('aria-pressed', mode ? 'false' : 'true');
    el('mdg-btn-split-2')?.setAttribute('aria-pressed', mode === 2 ? 'true' : 'false');
    el('mdg-btn-split-4')?.setAttribute('aria-pressed', mode === 4 ? 'true' : 'false');

    if (!mode) {
      wrap.dataset.active = 'false';
      flow.dataset.hidden = 'false';
      return;
    }

    wrap.dataset.active = 'true';
    flow.dataset.hidden = 'true';
    if (gridEl) {
      gridEl.className = 'mdg-split-grid cols-' + mode;
    }

    for (let i = 0; i < 4; i++) {
      const panel = document.querySelector(`[data-split-panel="${i}"]`);
      if (panel) panel.hidden = i >= mode;
    }

    fillSplitSelects(mode);
  }

  function wireLayout() {
    el('mdg-layout-grid')?.addEventListener('click', () => {
      setSplitMode(null);
    });
    el('mdg-layout-group')?.addEventListener('click', () => {
      groupByProject = !groupByProject;
      el('mdg-layout-group')?.setAttribute('aria-pressed', groupByProject ? 'true' : 'false');
      render();
    });
    el('mdg-btn-split-2')?.addEventListener('click', () => setSplitMode(2));
    el('mdg-btn-split-4')?.addEventListener('click', () => setSplitMode(4));
  }

  function setBanner() {
    const b = el('mdg-banner');
    if (!b) return;
    const path = window.location.pathname || '';
    const fromOrganiser = /ZSanctuary_Universe/i.test(path) && path.split('/').filter(Boolean).length >= 2;
    if (discoveryMeta && discoveryMeta.totals?.html_indexed > 0) {
      b.dataset.level = fromOrganiser ? 'ok' : 'warn';
      b.innerHTML = fromOrganiser
        ? `<strong>Eagle Eyes:</strong> ${discoveryMeta.totals.html_indexed} HTML surfaces indexed across projects. Split view embeds work when served from Organiser root.`
        : `<strong>Serve from Organiser root</strong> for cross-project iframes: <code>${discoveryMeta.serve_instructions || 'cd .. && npx serve .'}</code> then open <code>${discoveryMeta.mega_dashboard_url || ''}</code>`;
    } else {
      b.dataset.level = 'warn';
      b.innerHTML =
        '<strong>Discovery not loaded.</strong> From hub run <code>npm run dashboard:mdgev-discover</code>, refresh this page.';
    }
  }

  function wireFilters() {
    document.querySelectorAll('.mdg-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        filterCat = chip.dataset.filter || 'all';
        document.querySelectorAll('.mdg-chip').forEach((c) => {
          c.setAttribute('aria-pressed', c.dataset.filter === filterCat ? 'true' : 'false');
        });
        render();
        if (splitMode) fillSplitSelects(splitMode);
      });
    });

    el('mdg-search')?.addEventListener('input', () => {
      searchQ = el('mdg-search').value.trim();
      render();
      if (splitMode) fillSplitSelects(splitMode);
    });
  }

  async function init() {
    const status = el('mdg-status');
    wireModal();
    wireLayout();

    try {
      const registry = await loadJson(REGISTRY);
      el('mdg-registry-title').textContent = registry.title || 'Z-MDGEV';
      const sub = el('mdg-registry-sub');
      if (sub) {
        sub.textContent =
          (registry.subtitle || '') +
          ' · Discovery: data/reports/z_mdg_dashboard_discovery.json';
      }

      let pc = { projects: [] };
      try {
        pc = await loadJson(PC_PROJECTS);
      } catch {
        /* optional */
      }

      let merged = mergeBase(registry, pc);

      const disc = await tryLoadJson(DISCOVERY);
      if (disc) {
        discoveryMeta = disc;
        merged = merged.concat(tilesFromDiscovery(disc));
      }

      allTiles = merged;
      setBanner();
      wireFilters();
      render();
    } catch (e) {
      if (status) {
        status.textContent =
          'Could not load registry. Serve hub or Organiser root so ../../data is reachable.';
      }
      console.error(e);
    }
  }

  init();
})();
