// Z: Amk_Goku Worldwide Loterry\core\z_trust_bond.js
// Z-Trust Bond (MVP consent gate, local only)
(function () {
  const KEY = 'zTrustBond.accepted';
  const ROLE_KEY = 'zTrustBond.role';

  function accepted() {
    return localStorage.getItem(KEY) === 'true';
  }

  function role() {
    return localStorage.getItem(ROLE_KEY) || 'public';
  }

  function accept(selectedRole = 'verified') {
    localStorage.setItem(KEY, 'true');
    localStorage.setItem(ROLE_KEY, selectedRole);

    const event = {
      source: 'trust_bond',
      accepted: true,
      role: selectedRole,
      ts: new Date().toISOString(),
    };

    if (window.ZChronicle) {
      window.ZChronicle.record(event);
    }
    if (window.ZSuperGhost) {
      window.ZSuperGhost.ingest(event);
    }

    document.dispatchEvent(new CustomEvent('trustbond:accepted', { detail: event }));
  }

  window.ZTrustBond = { accepted, role, accept };
})();
