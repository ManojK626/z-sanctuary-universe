/**
 * Z Magical Canvas PlayKit (ZMC-1)
 * Local-only visual joy: aurora, orbs, rings, angel outlines, optional sketch + PNG export.
 * No network, accounts, AI, payments, or Sanctuary bridge.
 */
(function (global) {
  var THEMES = {
    eirmind: { name: 'ÉirMind Aurora', hints: ['gold', 'emerald', 'indigo'] },
    princess_blacky: {
      name: 'Princess & Blacky Magical Garden',
      hints: ['roseGold', 'moonBlue', 'softViolet', 'pawAmber'],
    },
    z_questra: { name: 'Questra PlayGarden', hints: ['aqua', 'mint', 'lavender', 'sky'] },
    sanctuary_gold: { name: 'Sanctuary Gold Light', hints: ['gold', 'amber', 'deepBlue'] },
  };

  var DISCLAIMER =
    'Local visual play layer. Nothing uploads. No payment, account, AI, API, or Sanctuary bridge is active.';

  function resolveRoot(root) {
    if (!root) return null;
    if (root.nodeType === 1) return root;
    var el = document.querySelector(String(root));
    return el || null;
  }

  function prefersReducedMotion() {
    try {
      return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (_) {
      return false;
    }
  }

  function photophobiaSoft() {
    var b = document.body;
    if (!b) return false;
    if (b.classList.contains('z-morph-low-sensory-active')) return true;
    if (String(b.dataset.displayMode || '').toLowerCase() === 'low-sensory') return true;
    if (String(b.dataset.zPhotophobia || '').toLowerCase() === 'soft') return true;
    return false;
  }

  function orbMarkup(seed, themeKey) {
    var frag = '';
    var positions = [
      { l: 10, t: 18, s: 14, d: 0, tx: 8, ty: -10 },
      { l: 78, t: 22, s: 11, d: 1.2, tx: -10, ty: 6 },
      { l: 22, t: 72, s: 13, d: 2.1, tx: 12, ty: 8 },
      { l: 62, t: 58, s: 10, d: 0.8, tx: -6, ty: -12 },
      { l: 44, t: 38, s: 9, d: 3.4, tx: 5, ty: 5 },
      { l: 85, t: 78, s: 12, d: 2.8, tx: -8, ty: -6 },
      { l: 14, t: 48, s: 8, d: 4.5, tx: 10, ty: -4 },
      { l: 52, t: 14, s: 11, d: 1.7, tx: -5, ty: 10 },
    ];
    if (themeKey === 'princess_blacky') {
      positions.push({ l: 33, t: 28, s: 9, d: 5.1, tx: 6, ty: 6 });
      positions.push({ l: 70, t: 40, s: 9, d: 5.6, tx: -6, ty: -6 });
    }
    positions.forEach(function (p, i) {
      var x = (seed + i * 17) % 7;
      frag +=
        '<div class="z-mck-orb" style="left:' +
        p.l +
        '%;top:' +
        p.t +
        '%;--s:' +
        (p.s + (x % 3)) +
        'px;--d:' +
        p.d +
        's;--tx:' +
        p.tx +
        'px;--ty:' +
        p.ty +
        'px"></div>';
    });
    return frag;
  }

  function ringsSvg() {
    return (
      '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" stroke-opacity="0.35" />' +
      '<circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" stroke-opacity="0.28" />' +
      '<circle cx="100" cy="100" r="38" fill="none" stroke="currentColor" stroke-opacity="0.22" />' +
      '</svg>'
    );
  }

  function angelSvg() {
    return (
      '<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path d="M100 102 C 72 88 48 72 38 52 C 52 62 76 78 100 88 C 124 78 148 62 162 52 C 152 72 128 88 100 102 Z" />' +
      '<path d="M100 88 L 100 28 M 82 40 Q 100 22 118 40" stroke-linecap="round" />' +
      '</svg>'
    );
  }

  function initMagicalCanvasKit(opts) {
    opts = opts || {};
    var root = resolveRoot(opts.root);
    if (!root) {
      console.warn('initMagicalCanvasKit: missing root element');
      return null;
    }

    var theme = opts.theme && THEMES[opts.theme] ? opts.theme : 'eirmind';
    var enableSketch = opts.enableSketch !== false;
    var angelsOn = opts.enableAngelOutlines !== false;
    var safety = opts.safetyMode === 'comfort_first' ? 'comfort_first' : 'standard';

    root.classList.add('z-mck-root');
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-pixel', '0');
    root.setAttribute('data-sharp', '0');
    root.setAttribute('data-aurora', '1');
    root.setAttribute('data-orbs', '1');
    root.setAttribute('data-rings', '1');
    root.setAttribute('data-angels', angelsOn ? '1' : '0');
    root.setAttribute('data-sketch', enableSketch ? '1' : '0');

    if (prefersReducedMotion()) root.classList.add('z-mck-reduced');
    if (photophobiaSoft() || safety === 'comfort_first') {
      root.classList.add('z-mck-photophobia');
      root.style.setProperty('--mck-aurora-opacity', '0.38');
    }

    var seed = Math.floor(Math.random() * 997);

    root.innerHTML =
      '<div class="z-mck-disclaimer" role="note">' +
      DISCLAIMER +
      '</div>' +
      '<div class="z-mck-toolbar" role="group" aria-label="Magical canvas layers">' +
      '<label><input type="checkbox" data-mck="pixel" /> Pixel enhance</label>' +
      '<label><input type="checkbox" data-mck="sharp" /> Sharp clarity</label>' +
      '<label><input type="checkbox" data-mck="aurora" checked /> Aurora</label>' +
      '<label><input type="checkbox" data-mck="orbs" checked /> Fairy orbs</label>' +
      '<label><input type="checkbox" data-mck="rings" checked /> Celtic rings</label>' +
      '<label><input type="checkbox" data-mck="angels" ' +
      (angelsOn ? 'checked' : '') +
      ' /> Angel outlines</label>' +
      '</div>' +
      '<div class="z-mck-stage-wrap">' +
      '<div class="z-mck-stage">' +
      '<div class="z-mck-filter-host">' +
      '<div class="z-mck-aurora" aria-hidden="true"></div>' +
      '<div class="z-mck-orbs" aria-hidden="true">' +
      orbMarkup(seed, theme) +
      '</div>' +
      '<div class="z-mck-rings" aria-hidden="true">' +
      ringsSvg() +
      '</div>' +
      '<div class="z-mck-angels" aria-hidden="true">' +
      angelSvg() +
      '</div>' +
      '</div>' +
      '<canvas class="z-mck-sketch" aria-label="Sketch canvas"></canvas>' +
      '</div>' +
      '</div>' +
      '<div class="z-mck-sketch-tools">' +
      '<label>Color <input type="color" data-mck-color value="#f9e7c8" /></label>' +
      '<label>Size <input type="range" data-mck-size min="1" max="24" value="4" /></label>' +
      '<button type="button" data-mck-clear>Clear</button>' +
      '<button type="button" data-mck-png>Download PNG</button>' +
      (theme === 'princess_blacky'
        ? '<span style="opacity:0.75">Hints: paws · hearts · stars · gentle notes</span>'
        : '') +
      '</div>';

    var pixelCb = root.querySelector('[data-mck="pixel"]');
    var sharpCb = root.querySelector('[data-mck="sharp"]');
    var auroraCb = root.querySelector('[data-mck="aurora"]');
    var orbsCb = root.querySelector('[data-mck="orbs"]');
    var ringsCb = root.querySelector('[data-mck="rings"]');
    var angelsCb = root.querySelector('[data-mck="angels"]');

    function bindToggle(cb, attr) {
      if (!cb) return;
      cb.addEventListener('change', function () {
        root.setAttribute(attr, cb.checked ? '1' : '0');
      });
    }
    bindToggle(pixelCb, 'data-pixel');
    bindToggle(sharpCb, 'data-sharp');
    bindToggle(auroraCb, 'data-aurora');
    bindToggle(orbsCb, 'data-orbs');
    bindToggle(ringsCb, 'data-rings');
    bindToggle(angelsCb, 'data-angels');

    var canvas = root.querySelector('.z-mck-sketch');
    var ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;

    function resizeCanvas() {
      if (!canvas || !ctx) return;
      var wrap = root.querySelector('.z-mck-stage-wrap');
      if (!wrap) return;
      var dpr = global.devicePixelRatio || 1;
      var w = wrap.clientWidth;
      var h = wrap.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }

    var drawing = false;
    var lastPt = null;
    var colorInput = root.querySelector('[data-mck-color]');
    var sizeInput = root.querySelector('[data-mck-size]');

    function pos(ev) {
      var rect = canvas.getBoundingClientRect();
      return { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
    }

    if (enableSketch && canvas && ctx) {
      resizeCanvas();
      global.addEventListener('resize', resizeCanvas);

      function start(ev) {
        if (root.getAttribute('data-sketch') !== '1') return;
        drawing = true;
        lastPt = pos(ev);
      }
      function move(ev) {
        if (!drawing || root.getAttribute('data-sketch') !== '1' || !lastPt) return;
        var p = pos(ev);
        ctx.strokeStyle = colorInput ? colorInput.value : '#fff';
        ctx.lineWidth = sizeInput ? Number(sizeInput.value) : 4;
        ctx.beginPath();
        ctx.moveTo(lastPt.x, lastPt.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        lastPt = p;
      }
      function end() {
        drawing = false;
        lastPt = null;
      }

      canvas.addEventListener('mousedown', start);
      canvas.addEventListener('mousemove', move);
      canvas.addEventListener('mouseup', end);
      canvas.addEventListener('mouseleave', end);
      canvas.addEventListener(
        'touchstart',
        function (e) {
          e.preventDefault();
          var t = e.touches[0];
          start({ clientX: t.clientX, clientY: t.clientY });
        },
        { passive: false },
      );
      canvas.addEventListener(
        'touchmove',
        function (e) {
          e.preventDefault();
          var t = e.touches[0];
          move({ clientX: t.clientX, clientY: t.clientY });
        },
        { passive: false },
      );
      canvas.addEventListener('touchend', end);
    }

    var clearBtn = root.querySelector('[data-mck-clear]');
    if (clearBtn && ctx) {
      clearBtn.addEventListener('click', function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      });
    }

    var pngBtn = root.querySelector('[data-mck-png]');
    if (pngBtn && canvas) {
      pngBtn.addEventListener('click', function () {
        try {
          var a = document.createElement('a');
          a.download = 'magical-canvas-memento.png';
          a.href = canvas.toDataURL('image/png');
          a.click();
        } catch (e) {
          console.warn('PNG export failed', e);
        }
      });
    }

    return {
      root: root,
      theme: theme,
      themes: THEMES,
      destroy: function () {
        global.removeEventListener('resize', resizeCanvas);
        root.innerHTML = '';
        root.className = '';
        root.removeAttribute('data-theme');
      },
    };
  }

  global.initMagicalCanvasKit = initMagicalCanvasKit;
  global.Z_MAGICAL_CANVAS_THEMES = THEMES;
})(typeof window !== 'undefined' ? window : globalThis);
