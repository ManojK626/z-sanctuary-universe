// Z: core\vault_status.js
(() => {
  const statusEl = document.getElementById('zVaultStatusValue');
  const unlockedAtEl = document.getElementById('zVaultUnlockedAt');
  const mirrorQuiet = document.getElementById('zMirrorQuiet');
  const mirrorStability = document.getElementById('zMirrorStability');
  const mirrorAlignment = document.getElementById('zMirrorAlignment');
  const mirrorEthics = document.getElementById('zMirrorEthics');

  if (!statusEl || !unlockedAtEl) return;

  const unlockPath = '../safe_pack/z_sanctuary_vault/.unlock';

  function setLocked() {
    statusEl.textContent = 'Locked';
    unlockedAtEl.textContent = '--';
  }

  function setUnlocked(ts) {
    statusEl.textContent = 'Unlocked';
    unlockedAtEl.textContent = ts || '--';
  }

  function setMirrorDefaults() {
    if (!mirrorQuiet || !mirrorStability || !mirrorAlignment || !mirrorEthics) return;
    mirrorQuiet.textContent = 'Quiet';
    mirrorStability.textContent = 'Stable';
    mirrorAlignment.textContent = 'Aligned';
    mirrorEthics.textContent = 'Clear';
  }

  async function refresh() {
    try {
      const res = await fetch(unlockPath, { cache: 'no-store' });
      if (!res.ok) {
        setLocked();
        setMirrorDefaults();
        return;
      }
      const data = await res.json();
      setUnlocked(data.unlocked_at_utc);
      setMirrorDefaults();
    } catch {
      setLocked();
      setMirrorDefaults();
    }
  }

  setMirrorDefaults();
  refresh();
  setInterval(refresh, 30000);
})();
