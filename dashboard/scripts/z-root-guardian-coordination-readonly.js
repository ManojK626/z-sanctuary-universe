/**
 * Z-ROOT-7 + Z-ROOT-7B — Guardian coordination (3D-lite constellation, read-only).
 * CSS perspective + optional orbit + parallax — no WebGL, no APIs, no execution.
 */
(function () {
  var ORBIT_LS = 'z7_orbit_pref';
  var GLYPHS = {
    amk_goku: '✦',
    zuno_ai: '🦉',
    at_franed_ai: '📖',
    princess_ai: '🐾',
    blackie_ai: '🐱',
    jb_z_irish_fox_ai: '🦊',
    sister_aisling_sol_ai: '☘',
    ethical_root_law: '◎',
  };

  var NODE_CLASS = {
    amk_goku: 'z-root7-amk',
    zuno_ai: 'z-root7-zuno',
    at_franed_ai: 'z-root7-at',
    princess_ai: 'z-root7-princess',
    blackie_ai: 'z-root7-blackie',
    jb_z_irish_fox_ai: 'z-root7-fox',
    sister_aisling_sol_ai: 'z-root7-aisling',
    ethical_root_law: 'z-root7-rootlaw',
  };

  function esc(x) {
    return String(x ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function hubHref(rel) {
    var r = String(rel || '').replace(/\\/g, '/');
    if (!r) return '#';
    var path = String(window.location.pathname || '').replace(/\\/g, '/');
    var prefix = path.indexOf('/Html/shadow/') !== -1 ? '../../..' : '../..';
    return prefix + (r.startsWith('/') ? r : '/' + r);
  }

  async function fetchJson(url) {
    var res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(String(res.status));
    return res.json();
  }

  function parseViewBox(vb) {
    var p = String(vb || '0 0 920 500').trim().split(/\s+/).map(Number);
    return { w: p[2] || 920, h: p[3] || 500 };
  }

  function lineClass(style) {
    var s = String(style || '');
    if (s === 'neon_primary') return 'z-root7-line z-root7-line--primary';
    if (s === 'neon_secondary') return 'z-root7-line z-root7-line--secondary';
    if (s === 'neon_muted') return 'z-root7-line z-root7-line--muted';
    return 'z-root7-line z-root7-line--roots z-root7-line--deep';
  }

  function guardianById(reg, id) {
    var list = Array.isArray(reg.guardians) ? reg.guardians : [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function pos(g) {
    var s = g && g.svg ? g.svg : {};
    var tz = s.tz !== undefined && s.tz !== null ? Number(s.tz) : 0;
    return {
      cx: s.cx || 0,
      cy: s.cy || 0,
      r: s.r || 24,
      tz: tz,
    };
  }

  function pct(n, dim) {
    if (!dim) return '0%';
    return (100 * (n / dim)).toFixed(4) + '%';
  }

  function isKidLens(viewId) {
    return viewId === 'kids' || viewId === 'public_visitor';
  }

  function prefersReducedMotion() {
    try {
      return Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (_) {
      return false;
    }
  }

  function readOrbitPref(reduceMotion) {
    if (reduceMotion) return false;
    try {
      return window.sessionStorage.getItem(ORBIT_LS) !== '0';
    } catch (_) {
      return true;
    }
  }

  function saveOrbitPref(on) {
    try {
      window.sessionStorage.setItem(ORBIT_LS, on ? '1' : '0');
    } catch (_) {}
  }

  function renderCardStripHTML(reg, kid) {
    var list = Array.isArray(reg.guardians) ? reg.guardians : [];
    var html =
      '<p class="z-root7-strip-title">' +
      esc(kid ? 'Guardian friends on this map' : 'Council roster — tap for detail') +
      '</p>';
    html += '<div class="z-root7-card-strip" role="list">';
    list.forEach(function (g) {
      var gid = esc(g.id);
      var nc = NODE_CLASS[g.id] || '';
      var glyph = GLYPHS[g.id] || '●';
      var name = esc(String(g.display_name || g.id));
      var sub = kid ? esc(g.public_lens_one_liner || g.personality_summary) : esc(g.role || '');
      html +=
        '<button type="button" role="listitem" class="z-root7-card-chip ' +
        nc +
        '" data-gid="' +
        gid +
        '" aria-label="' +
        name +
        ': ' +
        esc(g.role || '') +
        '"><span class="z-root7-chip-glyph" aria-hidden="true">' +
        glyph +
        '</span><span class="z-root7-chip-copy"><strong class="z-root7-chip-name">' +
        name +
        '</strong><span class="z-root7-chip-role">' +
        sub +
        '</span></span></button>';
    });
    html += '</div>';
    return html;
  }

  function wireChipStrip(stripMount, reg, guardians, kid, detailMountId, mount, cons) {
    if (!stripMount) return;
    stripMount.innerHTML = renderCardStripHTML(reg, kid);

    function groupNodes() {
      return mount.querySelectorAll('.z-root7-node-3d');
    }

    function hotLineForGid(gid) {
      var group = mount.querySelector('.z-root7-lines-g');
      if (!group) return;
      group.classList.add('z-root7-lines-g--dim');
      cons.forEach(function (c, idx) {
        if (c.from === gid || c.to === gid) {
          var line = group.querySelector('line[data-conn="' + idx + '"]');
          if (line) line.classList.add('z-root7-line--hot');
        }
      });
    }

    function clearHotLines() {
      var group = mount.querySelector('.z-root7-lines-g');
      if (!group) return;
      group.classList.remove('z-root7-lines-g--dim');
      group.querySelectorAll('.z-root7-line--hot').forEach(function (ln) {
        ln.classList.remove('z-root7-line--hot');
      });
    }

    function syncNodeHighlight(gid, on) {
      groupNodes().forEach(function (n) {
        if (n.getAttribute('data-gid') === gid) {
          n.classList.toggle('z-root7-node-3d--strip-active', on);
        }
      });
    }

    stripMount.querySelectorAll('.z-root7-card-chip').forEach(function (btn) {
      var gid = btn.getAttribute('data-gid');
      var gObj = guardians[gid];
      btn.addEventListener('click', function () {
        renderDetail(document.getElementById(detailMountId), gObj, kid);
        syncNodeHighlight(gid, true);
        groupNodes().forEach(function (n) {
          if (n.getAttribute('data-gid') !== gid) {
            syncNodeHighlight(n.getAttribute('data-gid'), false);
          }
        });
        hotLineForGid(gid);
      });
      btn.addEventListener('focus', function () {
        renderDetail(document.getElementById(detailMountId), gObj, kid);
        hotLineForGid(gid);
        syncNodeHighlight(gid, true);
      });
      btn.addEventListener('blur', function () {
        clearHotLines();
        syncNodeHighlight(gid, false);
        renderDetail(document.getElementById(detailMountId), null, kid);
      });
    });

  }

  function fallbackGuardiansStatic() {
    return [
      { id: 'amk_goku', display_name: 'AMK-Goku', role: 'Human sacred decision holder', public_lens_one_liner: 'The human heart of the map.', personality_summary: 'Human sacred decision holder — council advises.' },
      { id: 'zuno_ai', display_name: 'Zuno AI', role: 'Strategy narrator', public_lens_one_liner: 'A wise guide.', personality_summary: 'Strategy narrator.' },
      { id: 'at_franed_ai', display_name: 'AT / Franed AI', role: 'Ask-why compass', public_lens_one_liner: 'Checks facts kindly when adults enable careful mode.', personality_summary: 'Research compass bridge.' },
      { id: 'princess_ai', display_name: 'Princess AI', role: 'Gentle companion', public_lens_one_liner: 'Soft, curious friend energy.', personality_summary: 'Gentle companion.' },
      { id: 'blackie_ai', display_name: 'Blackie AI', role: 'Night-watch calm', public_lens_one_liner: 'Quiet friend for steady nights.', personality_summary: 'Protective calm.' },
      {
        id: 'jb_z_irish_fox_ai',
        display_name: 'JB Z-Irish Fox AI',
        role: 'Fox guide',
        public_lens_one_liner: 'Clever helper who rests.',
        personality_summary: 'Clever bounded guide.',
      },
      {
        id: 'sister_aisling_sol_ai',
        display_name: 'Sister Aisling-Sol AI',
        role: 'Soft companion light',
        public_lens_one_liner: 'Gentle light.',
        personality_summary: 'Energy boundaries companion.',
      },
      {
        id: 'ethical_root_law',
        display_name: 'Ethical Root Law anchor',
        role: 'Shared non-execution promise',
        public_lens_one_liner: 'We try to protect life and help kindly.',
        personality_summary: 'Ethical framing anchor.',
      },
    ];
  }

  function renderDetail(mount, g, kid) {
    if (!mount) return;
    if (!g) {
      mount.innerHTML =
        '<p class="z-root7-copy z-root7-copy--placeholder" style="opacity:0.8">Hover, focus a guardian, or tap a roster card below. Symbolic visuals only — no tasks, scraping, deploy, or live AI from this panel.</p>';
      return;
    }
    var title = esc(g.display_name);
    var role = esc(g.role);
    var body = kid ? esc(g.public_lens_one_liner || g.personality_summary) : esc(g.personality_summary);
    var boundary = kid ? '' : esc(g.boundary_note || '');
    var tagline = esc(g.copy_tagline || '');
    var html =
      '<h3>' +
      title +
      '</h3><p class="z-root7-role">' +
      role +
      '</p><p class="z-root7-copy"><strong>' +
      esc(kid ? 'Kind note:' : 'Advisory copy:') +
      '</strong> ' +
      body +
      '</p>';
    if (!kid && tagline) {
      html += '<p class="z-root7-copy">' + tagline + '</p>';
    }
    if (!kid && boundary) {
      html += '<p class="z-root7-boundary">' + boundary + '</p>';
    }
    mount.innerHTML = html;
  }

  function wireParallax(stage, tiltEl, enabled) {
    if (!enabled || !stage || !tiltEl) return function () {};
    var maxDeg = 4;
    function onMove(ev) {
      var r = stage.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      var px = ((ev.clientX - r.left) / r.width) * 2 - 1;
      var py = ((ev.clientY - r.top) / r.height) * 2 - 1;
      tiltEl.style.setProperty('--z7-tilt-y', (px * maxDeg).toFixed(3) + 'deg');
      tiltEl.style.setProperty('--z7-tilt-x', (-py * maxDeg).toFixed(3) + 'deg');
    }
    function onLeave() {
      tiltEl.style.setProperty('--z7-tilt-y', '0deg');
      tiltEl.style.setProperty('--z7-tilt-x', '0deg');
    }
    stage.addEventListener('mousemove', onMove);
    stage.addEventListener('mouseleave', onLeave);
    return function () {
      stage.removeEventListener('mousemove', onMove);
      stage.removeEventListener('mouseleave', onLeave);
    };
  }

  /**
   * @param {string} prefix Hub root URL prefix e.g. '../..'
   * @param {string} [viewId] Domain lens ('amk_operator', 'kids', …)
   * @param {{ mountId?: string, leadId?: string, detailMountId?: string, orbitToggleId?: string, cardsMountId?: string }} [targets]
   *        Omit to use AMK main control defaults (single instance IDs). cardsMountId: optional sibling strip (unified hub).
   */
  window.initZRoot7GuardianPanel = async function initZRoot7GuardianPanel(prefix, viewId, targets) {
    targets = targets || {};
    var mountId = targets.mountId || 'zRoot7GuardianMount';
    var leadId = targets.leadId || 'zRoot7Lead';
    var detailMountId = targets.detailMountId || 'zRoot7DetailMount';
    var orbitToggleId = targets.orbitToggleId || 'zRoot7OrbitToggle';
    var cardsMountId = targets.cardsMountId || '';

    var mount = document.getElementById(mountId);
    var cardsMountOuter = cardsMountId ? document.getElementById(cardsMountId) : null;
    var lead = document.getElementById(leadId || '');
    if (!mount) return;

    viewId = viewId || 'amk_operator';
    var kid = isKidLens(viewId);
    var reduceMotion = prefersReducedMotion();
    var orbitOn = readOrbitPref(reduceMotion);

    if (typeof mount.__zRoot7UnmountParallax === 'function') {
      mount.__zRoot7UnmountParallax();
      mount.__zRoot7UnmountParallax = null;
    }

    try {
      var reg = await fetchJson(prefix + '/data/z_root_guardian_coordination.json');

      var vbRaw = reg.svg && reg.svg.viewBox ? reg.svg.viewBox : '0 0 920 500';
      var vbDims = parseViewBox(vbRaw);
      var vb = vbRaw;

      if (lead) {
        lead.textContent =
          kid ?
            String(reg.kids_public_intro || reg.panel_summary || '')
          : String(reg.panel_summary || '');
      }

      var guardians = {};
      var nodesHtml = '';

      (reg.guardians || []).forEach(function (g) {
        guardians[g.id] = g;
        var p = pos(g);
        var nc = NODE_CLASS[g.id] || '';
        var glyph = GLYPHS[g.id] || '●';
        var shortLabel = esc(String(g.display_name || g.id).split('—')[0].trim());
        nodesHtml +=
          '<div role="button" tabindex="0" class="z-root7-node-3d ' +
          nc +
          '" data-gid="' +
          esc(g.id) +
          '" aria-label="' +
          esc(g.display_name + ': ' + (g.role || '')) +
          '" style="left:' +
          pct(p.cx, vbDims.w) +
          ';top:' +
          pct(p.cy, vbDims.h) +
          ';transform:translate(-50%,-50%) translateZ(' +
          p.tz +
          'px)">' +
          '<div class="z-root7-card-inner"><span class="z-root7-glyph" aria-hidden="true">' +
          glyph +
          '</span><span class="z-root7-node-label">' +
          shortLabel +
          '</span></div></div>';
      });

      var connHtml = '<g class="z-root7-lines-g">';
      var cons = Array.isArray(reg.connections) ? reg.connections : [];
      cons.forEach(function (c, idx) {
        var a = guardianById(reg, c.from);
        var b = guardianById(reg, c.to);
        if (!a || !b) return;
        var pa = pos(a);
        var pb = pos(b);
        var dz = (Math.abs(pa.tz) + Math.abs(pb.tz)) * 0.5;
        var depthClass = dz > 44 ? ' z-root7-line--far' : '';
        connHtml +=
          '<line data-conn="' +
          idx +
          '" class="' +
          lineClass(c.style) +
          depthClass +
          '" x1="' +
          pa.cx +
          '" y1="' +
          pa.cy +
          '" x2="' +
          pb.cx +
          '" y2="' +
          pb.cy +
          '" />';
      });
      connHtml += '</g>';

      var lawBlock;
      if (kid) {
        lawBlock =
          '<div class="z-root7-law-box"><p class="z-root7-law-title">Kind reminders</p><ul class="z-root7-law-list">' +
          '<li>Be gentle with living things.</li>' +
          '<li>Protect nature and speak kindly.</li>' +
          '<li>Help stays soft — rests and boundaries matter.</li>' +
          '</ul></div>';
      } else {
        lawBlock =
          '<div class="z-root7-law-box"><p class="z-root7-law-title">Root promise (Sanctuary wording)</p><ul class="z-root7-law-list">' +
          (reg.root_laws || [])
            .map(function (L) {
              return '<li>' + esc(L) + '</li>';
            })
            .join('') +
          '</ul><p class="z-root7-law-note">For broader audiences: ethical promise to protect life, reduce harm, respect boundaries, and keep help kind and sustainable. Not certification or doctrine.</p></div>';
      }

      var toggleDisabled = reduceMotion ? ' disabled aria-disabled="true"' : '';
      var togglePressed = orbitOn ? 'true' : 'false';
      var toggleLabel = orbitOn ? 'Orbit drift: on' : 'Orbit drift: off';

      mount.innerHTML =
        '<div class="z-root7-wrap">' +
        '<div class="z-root7-controls">' +
        '<button type="button" class="z-root7-orbit-toggle" id="' +
        esc(orbitToggleId) +
        '" aria-pressed="' +
        togglePressed +
        '"' +
        toggleDisabled +
        '>' +
        esc(toggleLabel) +
        '</button>' +
        '<p class="z-root7-visual-law">' +
        esc(
          '3D constellation view is symbolic and advisory. It does not execute tasks, research the web, or control systems.'
        ) +
        '</p>' +
        (reduceMotion ?
          '<p class="z-root7-motion-note">' +
          esc('Reduced motion is on — orbit drift and pointer parallax stay still.') +
          '</p>'
        : '') +
        '</div>' +
        '<div class="z-root7-stage">' +
        '<div class="z-root7-parallax">' +
        '<div class="z-root7-stars-far" aria-hidden="true"></div>' +
        '<div class="z-root7-stars-mid" aria-hidden="true"></div>' +
        '<div class="z-root7-mist" aria-hidden="true"></div>' +
        '<div class="z-root7-orbit-spin' +
        (orbitOn && !reduceMotion ? ' z-root7-orbit-spin--animate' : '') +
        '">' +
        '<div class="z-root7-orbit-rings" aria-hidden="true">' +
        '<div class="z-root7-el z-root7-el--lg"></div>' +
        '<div class="z-root7-el z-root7-el--md"></div>' +
        '<div class="z-root7-el z-root7-el--sm"></div>' +
        '</div>' +
        '<div class="z-root7-chart">' +
        '<div class="z-root7-svg-layer">' +
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' +
        esc(vb) +
        '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
        connHtml +
        '</svg></div>' +
        '<div class="z-root7-nodes-layer">' +
        nodesHtml +
        '</div></div></div></div></div>' +
        '<div id="' +
        esc(detailMountId) +
        '" class="z-root7-detail" role="region" aria-live="polite"></div>' +
        lawBlock +
        '</div>' +
        '<p class="z-root7-doc-link"><a href="' +
        esc(hubHref('docs/Z_ROOT_7_GUARDIAN_COORDINATION_LAYER.md')) +
        '">Full Z-ROOT-7 doc</a> · <a href="' +
        esc(hubHref('docs/PHASE_Z_ROOT_7B_3D_GREEN_RECEIPT.md')) +
        '">Z-ROOT-7B receipt</a></p>';

      function applyOrbit(on) {
        var spin = mount.querySelector('.z-root7-orbit-spin');
        if (!spin || reduceMotion) return;
        if (on) {
          spin.classList.add('z-root7-orbit-spin--animate');
        } else {
          spin.classList.remove('z-root7-orbit-spin--animate');
        }
      }

      var btn = document.getElementById(orbitToggleId);
      if (btn && !reduceMotion) {
        btn.addEventListener('click', function () {
          orbitOn = !orbitOn;
          saveOrbitPref(orbitOn);
          btn.setAttribute('aria-pressed', orbitOn ? 'true' : 'false');
          btn.textContent = orbitOn ? 'Orbit drift: on' : 'Orbit drift: off';
          applyOrbit(orbitOn);
        });
      }

      var detailMountEl = document.getElementById(detailMountId);
      renderDetail(detailMountEl, null, kid);

      var undoParallax = wireParallax(
        mount.querySelector('.z-root7-stage'),
        mount.querySelector('.z-root7-parallax'),
        !reduceMotion
      );

      mount.__zRoot7UnmountParallax = undoParallax || null;

      function hotLineForGid(gid) {
        var group = mount.querySelector('.z-root7-lines-g');
        if (!group) return;
        group.classList.add('z-root7-lines-g--dim');
        cons.forEach(function (c, idx) {
          if (c.from === gid || c.to === gid) {
            var line = group.querySelector('line[data-conn="' + idx + '"]');
            if (line) line.classList.add('z-root7-line--hot');
          }
        });
      }

      function clearHotLines() {
        var group = mount.querySelector('.z-root7-lines-g');
        if (!group) return;
        group.classList.remove('z-root7-lines-g--dim');
        group.querySelectorAll('.z-root7-line--hot').forEach(function (ln) {
          ln.classList.remove('z-root7-line--hot');
        });
      }

      mount.querySelectorAll('.z-root7-node-3d').forEach(function (node) {
        var gid = node.getAttribute('data-gid');
        var gObj = guardians[gid];
        function activate() {
          renderDetail(document.getElementById(detailMountId), gObj, kid);
          hotLineForGid(gid);
        }
        function deactivate() {
          clearHotLines();
        }
        node.addEventListener('mouseenter', activate);
        node.addEventListener('mouseleave', function () {
          renderDetail(document.getElementById(detailMountId), null, kid);
          deactivate();
        });
        node.addEventListener('focus', activate);
        node.addEventListener('blur', function () {
          renderDetail(document.getElementById(detailMountId), null, kid);
          deactivate();
        });
        node.addEventListener('keydown', function (ev) {
          if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            activate();
          }
        });
      });

      if (cardsMountOuter) {
        wireChipStrip(cardsMountOuter, reg, guardians, kid, detailMountId, mount, cons);
      }
    } catch (e) {
      console.warn('[Z-ROOT-7] Could not load z_root_guardian_coordination.json', e);

      var regFB = { guardians: fallbackGuardiansStatic() };
      var gfb = {};
      regFB.guardians.forEach(function (gx) {
        gfb[gx.id] = gx;
      });

      if (lead) {
        lead.textContent = kid ?
          String('Friendly guardian story map paused — roster below lists everyone gently.')
        : String('Guardian coordination data unavailable until JSON loads. Card roster stays visible.');
      }

      mount.innerHTML =
        '<div class="z-root7-wrap z-root7-wrap--degraded">' +
        '<p class="z-root7-error">' +
        esc(
          kid ?
            'The picture didn’t load. Names below still work — tap each for kind notes.'
          : 'Guardian data unavailable — serve the hub over HTTP from the repo root. Card roster stays visible.'
        ) +
        '</p>' +
        '<div id="' +
        esc(detailMountId) +
        '" class="z-root7-detail" role="region" aria-live="polite"></div>' +
        '</div>';

      var chipStripTarget = cardsMountOuter;
      if (!chipStripTarget) {
        mount.innerHTML +=
          '<div id="zRoot7EmbeddedChipHost" class="z-root7-embedded-chip-host" aria-label="Guardian roster"></div>';
        chipStripTarget = document.getElementById('zRoot7EmbeddedChipHost');
      }

      wireChipStrip(chipStripTarget, regFB, gfb, kid, detailMountId, mount, []);
    }
  };
})();
