// Z: Amk_Goku Worldwide Loterry\ui\bias_lens.js
// Bias Lens (Education Mode only)
(function () {
  const PANEL_ID = 'zBiasLens';

  const BIASES = {
    GAMBLERS_FALLACY: {
      title: 'Gambler’s Fallacy',
      text: 'The feeling that a number is due because it has not appeared recently. Random systems have no memory.',
    },
    CLUSTER_ILLUSION: {
      title: 'Clustering Illusion',
      text: 'Seeing patterns in streaks or groups that naturally occur in random data. Randomness often looks uneven.',
    },
    HOT_HAND: {
      title: 'Hot Hand Bias',
      text: 'Believing a streak will continue because it already has. In random systems, streaks do not self-reinforce.',
    },
  };

  function createPanel() {
    if (document.getElementById(PANEL_ID)) return;

    const panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.style.cssText = [
      'position: absolute',
      'bottom: 8px',
      'left: 8px',
      'max-width: 280px',
      'padding: 10px 12px',
      'background: rgba(18, 22, 32, 0.92)',
      'color: #e6e8ee',
      'font-size: 12px',
      'line-height: 1.4',
      'border-radius: 10px',
      'border: 1px solid rgba(255,255,255,0.12)',
      'display: none',
      'z-index: 50',
    ].join(';');

    panel.innerHTML = [
      '<div style="font-weight:600; margin-bottom:6px;">Bias Lens</div>',
      '<div id="zBiasLensContent" style="opacity:0.85;">',
      'Hover or pause on a chart to reflect.',
      '</div>',
    ].join('');

    document.body.appendChild(panel);
  }

  function showBias(key) {
    const panel = document.getElementById(PANEL_ID);
    const content = document.getElementById('zBiasLensContent');
    if (!panel || !content) return;

    const bias = BIASES[key];
    if (!bias) return;

    content.innerHTML = [
      `<div style="font-weight:600; margin-bottom:4px;">${bias.title}</div>`,
      `<div>${bias.text}</div>`,
    ].join('');
  }

  function setVisible(visible) {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;
    panel.style.display = visible ? 'block' : 'none';
  }

  document.addEventListener('education:toggle', (e) => {
    setVisible(e.detail.enabled);
  });

  window.ZBiasLens = {
    show: showBias,
    hide() {
      const content = document.getElementById('zBiasLensContent');
      if (content) content.innerHTML = 'Hover or pause on a chart to reflect.';
    },
  };

  document.addEventListener('DOMContentLoaded', () => {
    createPanel();
    if (window.ZEducationMode && window.ZEducationMode.isEnabled()) {
      setVisible(true);
    }
  });
})();
