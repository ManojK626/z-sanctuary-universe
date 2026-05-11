// Z: Amk_Goku Worldwide Loterry\ui\role_badge.js
// Role Badge (trust visibility only)
(function () {
  const BADGE_ID = 'zRoleBadge';

  const ROLE_LABELS = {
    public: 'Public',
    verified: 'Verified',
    high_trust: 'High Trust',
  };

  function createBadge() {
    if (document.getElementById(BADGE_ID)) return;

    const badge = document.createElement('div');
    badge.id = BADGE_ID;
    badge.style.cssText = [
      'position: fixed',
      'bottom: 10px',
      'right: 10px',
      'padding: 4px 8px',
      'font-size: 11px',
      'border-radius: 999px',
      'background: rgba(255,255,255,0.08)',
      'color: #e6e8ee',
      'font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      'z-index: 999',
      'opacity: 0.85',
      'pointer-events: none',
    ].join(';');

    document.body.appendChild(badge);
    render(badge);
  }

  function render(badge) {
    const role = window.ZTrustBond ? window.ZTrustBond.role() : 'public';
    badge.textContent = ROLE_LABELS[role] || 'Public';
  }

  document.addEventListener('trustbond:accepted', () => {
    const badge = document.getElementById(BADGE_ID);
    if (badge) render(badge);
  });

  document.addEventListener('DOMContentLoaded', createBadge);
})();
