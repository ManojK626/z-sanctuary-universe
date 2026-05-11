// Z: Amk_Goku Worldwide Loterry\ui\z_rhythm_indicator.js
// Z-RHYTHM Indicator (observer-only)

(function () {
  const ID = 'zRhythmIndicator';
  const STATUS_PATH = 'data/reports/system_status.json';

  function colorFor(state) {
    switch (state) {
      case 'CALM':
        return '#4CAF50';
      case 'ADAPTIVE':
        return '#FFC107';
      case 'REGENERATION':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  }

  function labelFor(state) {
    switch (state) {
      case 'CALM':
        return 'Calm';
      case 'ADAPTIVE':
        return 'Adaptive';
      case 'REGENERATION':
        return 'Regenerating';
      default:
        return 'Unknown';
    }
  }

  function ensure() {
    if (document.getElementById(ID)) return;

    const el = document.createElement('div');
    el.id = ID;
    el.style.cssText = `
      position: fixed;
      bottom: 14px;
      right: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      background: rgba(20,20,28,0.85);
      border-radius: 999px;
      font-family: system-ui, sans-serif;
      font-size: 12px;
      color: #e6e8ee;
      z-index: 9999;
    `;

    el.innerHTML = `
      <span id="${ID}-dot"
        style="width:10px;height:10px;border-radius:50%;background:#9E9E9E;">
      </span>
      <span id="${ID}-label">Rhythm: —</span>
      <a href="#" id="${ID}-why" style="font-size:11px;opacity:.7;text-decoration:underline;">Why?</a>
    `;

    document.body.appendChild(el);
    const link = document.getElementById(`${ID}-why`);
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.openLearningCard?.('learning.rhythm.basics');
      });
    }
  }

  function update(state) {
    ensure();
    const dot = document.getElementById(`${ID}-dot`);
    const label = document.getElementById(`${ID}-label`);
    if (!dot || !label) return;

    dot.style.background = colorFor(state);
    label.textContent = `Rhythm: ${labelFor(state)}`;
  }

  async function refresh() {
    try {
      const res = await fetch(STATUS_PATH, { cache: 'no-store' });
      const status = await res.json();
      const state = status.rhythm_state || 'CALM';
      update(state);
    } catch {
      update('UNKNOWN');
    }
  }

  refresh();
  setInterval(refresh, 60000);

  window.ZRhythmIndicator = { refresh };
})();
