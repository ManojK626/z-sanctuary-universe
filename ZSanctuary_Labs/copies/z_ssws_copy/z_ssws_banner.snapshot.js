// Z: core\z_ssws_banner.js
// Z-SSWS banner: shows workspace active state (read-only)
(function () {
  const banner = document.getElementById('zSSWSBanner');
  if (!banner) return;

  const statusPanel = document.getElementById('zSSWSStatusBody');
  const govChip = document.getElementById('zGovSSWS');

  function setActive(active, note) {
    banner.textContent = active
      ? `Z-SSWS: active${note ? ` · ${note}` : ''}`
      : 'Z-SSWS: inactive';
    banner.classList.toggle('is-active', Boolean(active));
  }

  async function ensureReport() {
    try {
      await fetch('../data/reports/z_ssws_daily_report.json', { cache: 'no-store' });
    } catch (err) {
      // Ignore missing report; panel will show fallback.
    }
  }

  function renderStatus(payload) {
    if (!statusPanel) return;
    const quiet = payload?.quiet_mode?.active ? 'on' : 'off';
    const rhythm = payload?.rhythm_state || 'unknown';
    const vault = payload?.formula_registry?.status || 'unknown';
    statusPanel.innerHTML = `
      <div>Quiet: ${quiet}</div>
      <div>Rhythm: ${rhythm}</div>
      <div>Vault: ${vault}</div>
    `;
  }

  function updateGovChip(state) {
    if (!govChip) return;
    govChip.textContent = state || 'unknown';
    govChip.className = state === 'active'
      ? 'z-badge z-risk-low'
      : 'z-badge z-risk-unknown';
  }

  function logChronicle(payload) {
    if (!window.ZChronicle || typeof window.ZChronicle.write !== 'function') return;
    window.ZChronicle.write({
      type: 'z.ssws.status',
      payload,
      ts: new Date().toISOString()
    });
  }

  function updateInsight(payload) {
    const insight = document.getElementById('zInsightCards');
    if (!insight) return;
    const existing = document.getElementById('zSSWSInsightCard');
    const quiet = payload?.quiet_mode?.active ? 'on' : 'off';
    const rhythm = payload?.rhythm_state || 'unknown';
    const vault = payload?.formula_registry?.status || 'unknown';
    const text = `Quiet: ${quiet} · Rhythm: ${rhythm} · Vault: ${vault}`;

    if (existing) {
      existing.querySelector('.z-ssws-insight-body').textContent = text;
      return;
    }

    const card = document.createElement('div');
    card.id = 'zSSWSInsightCard';
    card.className = 'z-card z-card-subtle';
    card.innerHTML = `
      <div class="z-ssws-insight-title">Z-SSWS Status</div>
      <div class="z-ssws-insight-body">${text}</div>
    `;
    insight.appendChild(card);
  }

  function updateGovLog(payload) {
    const log = document.getElementById('zSSWSGovernanceLog');
    if (!log) return;
    const quiet = payload?.quiet_mode?.active ? 'on' : 'off';
    const rhythm = payload?.rhythm_state || 'unknown';
    const vault = payload?.formula_registry?.status || 'unknown';
    log.textContent = `Quiet: ${quiet} | Rhythm: ${rhythm} | Vault: ${vault}`;
  }

  // Heuristic: if Vault manifest and Formula Registry exist, mark active
  async function check() {
    try {
      const [vault, registry, report] = await Promise.all([
        fetch('../safe_pack/z_sanctuary_vault/VAULT_MANIFEST.md', { cache: 'no-store' }),
        fetch('../rules/Z_FORMULA_REGISTRY.json', { cache: 'no-store' }),
        fetch('../data/reports/z_ssws_daily_report.json', { cache: 'no-store' }),
      ]);
      if (vault.ok && registry.ok) {
        setActive(true, 'vault sealed');
        updateGovChip('active');
        const registryPayload = await registry.json();
        if (report.ok) {
          const payload = await report.json();
          renderStatus(payload);
          logChronicle(payload);
          updateInsight(payload);
          updateGovLog(payload);
        } else {
          renderStatus({
            formula_registry: { status: registryPayload.status || 'internal-only' },
            quiet_mode: { active: false },
            rhythm_state: 'unknown',
          });
          await ensureReport();
        }
        return;
      }
    } catch (err) {
      // Keep banner inactive on fetch failures.
    }
    setActive(false);
    updateGovChip('inactive');
  }

  const quick = document.getElementById('zSswsQuick');
  if (quick) {
    quick.addEventListener('click', () => {
      check();
    });
  }

  check();
  setInterval(check, 120000);
})();
