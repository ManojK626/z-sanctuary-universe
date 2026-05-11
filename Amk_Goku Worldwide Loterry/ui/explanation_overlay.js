// Z: Amk_Goku Worldwide Loterry\ui\explanation_overlay.js
// Explanation Overlay (Education Mode only)
(function () {
  const OVERLAY_ID = 'zExplanationOverlay';

  function createOverlay() {
    if (document.getElementById(OVERLAY_ID)) return;

    const box = document.createElement('div');
    box.id = OVERLAY_ID;
    box.style.cssText = [
      'position: absolute',
      'top: 8px',
      'right: 8px',
      'max-width: 260px',
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

    box.innerHTML = [
      '<div style="font-weight:600; margin-bottom:6px;">',
      'Why these charts differ',
      '</div>',
      '<div style="opacity:0.85;">',
      'Differences between real draws and simulations are normal. ',
      'Random systems naturally produce streaks, gaps, and clusters. ',
      '<br><br>',
      'This comparison is exploratory only. It explains behavior — it does not predict outcomes.',
      '</div>',
    ].join('');

    document.body.appendChild(box);
  }

  function updateVisibility(enabled) {
    const box = document.getElementById(OVERLAY_ID);
    if (!box) return;
    box.style.display = enabled ? 'block' : 'none';
  }

  document.addEventListener('education:toggle', (e) => {
    updateVisibility(e.detail.enabled);
  });

  document.addEventListener('DOMContentLoaded', () => {
    createOverlay();
    if (window.ZEducationMode && window.ZEducationMode.isEnabled()) {
      updateVisibility(true);
    }
  });
})();
