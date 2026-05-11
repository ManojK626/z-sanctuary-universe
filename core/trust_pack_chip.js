// Z: core\trust_pack_chip.js
(function () {
  const CHIP_ID = 'trustPackChip';
  const STATUS_URLS = [
    '../exports/trust_pack_2026-01/TRUST_PACK_STATUS.json',
    '../exports/trust_pack_2026-01/TRUST_PACK_STATUS.json'.replace(' ', '%20'),
    '../exports/trust_pack_2026-01/TRUST_PACK_STATUS.json',
    '../exports/trust_pack_2026-01/TRUST_PACK_STATUS.json'.replace(' ', '%20'),
  ];

  async function fetchStatus() {
    for (const url of STATUS_URLS) {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) continue;
        const json = await res.json();
        return json;
      } catch {
        // try next
      }
    }
    return null;
  }

  function setChip(status) {
    const chip = document.getElementById(CHIP_ID);
    if (!chip) return;
    if (!status) {
      chip.textContent = 'Trust Pack: n/a';
      chip.classList.remove('active');
      chip.title = 'Trust Pack status unavailable';
      if (window.ZQuietModeChip?.setTrustPack) {
        window.ZQuietModeChip.setTrustPack('Trust Pack: n/a', 'Trust Pack status unavailable');
      }
      return;
    }

    const label = `Trust Pack: ${status.core_version || 'v1.0'}`;
    const title = `Status: ${status.status || 'reference'}\nLearning spine: ${status.learning_spine || 'active'}\nMutation: ${status.mutation_policy || 'append-only'}`;
    chip.textContent = label;
    chip.classList.add('active');
    chip.title = title;
    if (window.ZQuietModeChip?.setTrustPack) {
      window.ZQuietModeChip.setTrustPack(label, title);
    }
  }

  async function refresh() {
    const status = await fetchStatus();
    setChip(status);
  }

  window.ZTrustPackChip = { refresh };

  refresh();
  setInterval(refresh, 120000);
})();
