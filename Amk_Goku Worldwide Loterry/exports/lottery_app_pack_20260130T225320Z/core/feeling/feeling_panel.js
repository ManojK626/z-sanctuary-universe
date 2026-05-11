// Z: Amk_Goku Worldwide Loterry\exports\lottery_app_pack_20260130T225320Z\core\feeling\feeling_panel.js
// Z-Feeling Panel v1.2 (observer-only)
// Displays latest Feeling Analyzer snapshot with gentle trends.

(function () {
  const PANEL_ID = 'zFeelingPanel';
  const Z_TREND_WINDOW = 5;
  const Z_HISTORY = { alignment: [], pressure: [], stability: [] };
  let lastTrends = { a: '→', p: '→', s: '→' };
  let gentleMode = false;

  function el(tag, attrs = {}, html = '') {
    const n = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
    if (html) n.innerHTML = html;
    return n;
  }

  function pct(n) {
    return Math.max(0, Math.min(100, Math.round(n)));
  }

  function pushHist(key, val) {
    const arr = Z_HISTORY[key];
    arr.push(val);
    if (arr.length > Z_TREND_WINDOW) arr.shift();
  }

  function trendArrow(arr) {
    if (arr.length < 2) return '→';
    const d = arr[arr.length - 1] - arr[0];
    return d > 3 ? '↑' : d < -3 ? '↓' : '→';
  }

  function explain(key, arrow) {
    const map = {
      alignment: {
        '↑': 'Signals converging toward target balance.',
        '↓': 'Competing signals increased; re-centering advised.',
        '→': 'No meaningful shift detected.',
      },
      pressure: {
        '↑': 'Load or uncertainty rising.',
        '↓': 'Pressure released or distributed.',
        '→': 'Pressure stable.',
      },
      stability: {
        '↑': 'System settling into rhythm.',
        '↓': 'Transient oscillations observed.',
        '→': 'Stability unchanged.',
      },
    };
    return map[key][arrow];
  }

  function ensurePanel() {
    if (document.getElementById(PANEL_ID)) return;
    const p = el('div', { id: PANEL_ID });
    p.innerHTML = `
      <div class="zRow">
        <h3 style="margin:0;">Feeling Field</h3>
        <a href="#" id="zFeelingWhy" style="font-size:11px;opacity:.7;text-decoration:underline;">Why?</a>
      </div>

      <div class="zRow">
        <span class="zMuted">Observational only</span>
        <span class="zChip" id="zFeelingRhythm">—</span>
      </div>

      <div style="margin-top:10px;">
        <div class="zRow"><span>Alignment</span><span id="zAlignVal">—</span></div>
        <div class="zBar"><div class="zFill" id="zAlignBar" style="width:0%"></div></div>
      </div>

      <div style="margin-top:8px;">
        <div class="zRow"><span>Pressure</span><span id="zPressVal">—</span></div>
        <div class="zBar"><div class="zFill" id="zPressBar" style="width:0%"></div></div>
      </div>

      <div style="margin-top:8px;">
        <div class="zRow"><span>Stability</span><span id="zStabVal">—</span></div>
        <div class="zBar"><div class="zFill" id="zStabBar" style="width:0%"></div></div>
      </div>

      <div class="zReason" id="zFeelingReasons" style="margin-top:10px;">
        Waiting for signals…
      </div>
      <div id="zWhyNow" class="zWhyNow"></div>
    `;
    document.body.appendChild(p);
    const why = document.getElementById('zFeelingWhy');
    if (why) {
      why.addEventListener('click', (e) => {
        e.preventDefault();
        window.openLearningCard?.('learning.feeling.basics');
      });
    }
  }

  function showWhyNow(key, arrow) {
    const el = document.getElementById('zWhyNow');
    if (!el) return;
    el.textContent = `Why now: ${explain(key, arrow)}`;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 8000);
  }

  function render(evt) {
    if (!evt?.field) return;
    const f = evt.field;
    const rhythm = document.getElementById('zFeelingRhythm');
    const alignV = document.getElementById('zAlignVal');
    const pressV = document.getElementById('zPressVal');
    const stabV = document.getElementById('zStabVal');

    const alignB = document.getElementById('zAlignBar');
    const pressB = document.getElementById('zPressBar');
    const stabB = document.getElementById('zStabBar');

    const reasons = document.getElementById('zFeelingReasons');

    const a = pct(f.alignmentScore);
    const p = pct(f.pressureScore);
    const s = pct(f.stabilityScore);

    pushHist('alignment', a);
    pushHist('pressure', p);
    pushHist('stability', s);

    const aT = trendArrow(Z_HISTORY.alignment);
    const pT = trendArrow(Z_HISTORY.pressure);
    const sT = trendArrow(Z_HISTORY.stability);

    if (rhythm) rhythm.textContent = `Suggest: ${f.suggestedRhythm}`;
    if (alignV) alignV.textContent = gentleMode ? `${a}%` : `${a}% ${aT}`;
    if (pressV) pressV.textContent = gentleMode ? `${p}%` : `${p}% ${pT}`;
    if (stabV) stabV.textContent = gentleMode ? `${s}%` : `${s}% ${sT}`;

    if (alignB) alignB.style.width = `${a}%`;
    if (pressB) pressB.style.width = `${p}%`;
    if (stabB) stabB.style.width = `${s}%`;

    if (gentleMode) {
      reasons.textContent = 'System is observing and staying balanced.';
    } else {
      reasons.innerHTML = [
        `• Alignment ${aT} — ${explain('alignment', aT)}`,
        `• Pressure ${pT} — ${explain('pressure', pT)}`,
        `• Stability ${sT} — ${explain('stability', sT)}`,
      ].join('<br>');
    }

    if (aT !== lastTrends.a) showWhyNow('alignment', aT);
    if (pT !== lastTrends.p) showWhyNow('pressure', pT);
    if (sT !== lastTrends.s) showWhyNow('stability', sT);

    lastTrends = { a: aT, p: pT, s: sT };
  }

  function hookChronicle() {
    if (!window.ZChronicle?.record) return;
    const orig = window.ZChronicle.record;
    window.ZChronicle.record = function (entry) {
      orig.call(this, entry);
      const evt = entry?.event || entry;
      if (evt?.module === 'feeling_analyzer') {
        render(evt);
      }
    };
  }

  function demoCompute() {
    if (!window.ZFeelingAnalyzer?.emitEvent) return;
    const evt = window.ZFeelingAnalyzer.emitEvent({
      space: 'system',
      cellIndex: [0, 0],
      signals: {
        harishaState: window.getHarishaContext?.()?.state || 'calm',
        circleRhythm: 'ACTIVE',
        driftLevel: 0.2,
        worldPulseIntensity: 0.35,
        noteRate: 0.25,
        rootCauses: 0,
      },
      actor: 'observer',
    });
    render(evt);
  }

  document.addEventListener('z:gentle:on', () => {
    gentleMode = true;
  });
  document.addEventListener('z:gentle:off', () => {
    gentleMode = false;
  });

  window.ZFeelingPanel = {
    init() {
      ensurePanel();
      hookChronicle();
      demoCompute();
      console.info('[Z-FeelingPanel] Ready (observer-only)');
    },
  };
})();
