// Z: Amk_Goku Worldwide Loterry\ui\education_mode_toggle.js
// Education Mode Toggle (UI only)
(function () {
  function createToggle() {
    if (document.getElementById('zEducationToggle')) return;

    const btn = document.createElement('button');
    btn.id = 'zEducationToggle';
    btn.style.cssText = [
      'padding: 6px 10px',
      'border-radius: 8px',
      'border: 1px solid rgba(255,255,255,0.15)',
      'background: rgba(20,25,35,0.8)',
      'color: #e6e8ee',
      'font-size: 12px',
      'cursor: pointer',
    ].join(';');

    btn.onclick = () => {
      window.ZEducationMode.toggle();
      render(btn);
    };

    render(btn);
    document.body.appendChild(btn);
  }

  function render(btn) {
    const on = window.ZEducationMode.isEnabled();
    btn.textContent = on ? 'Education Mode: ON' : 'Education Mode: OFF';
    btn.style.opacity = on ? '1' : '0.7';
  }

  document.addEventListener('DOMContentLoaded', createToggle);
})();
