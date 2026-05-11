// Z: core\quiet_mode_chip.js
(function () {
  const CHIP_ID = 'quietModeChip';
  const STATUS_ID = 'quietModeStatus';
  const PANEL_ID = 'quietModePanelStatus';
  const BADGE_ID = 'quietModeBadge';
  const TRUST_BADGE_ID = 'trustPackBadge';
  const OVERRIDE_KEY = 'zQuietModeOverride';
  const STATUS_URLS = [
    '/data/reports/system_status.json',
    '../Amk_Goku Worldwide Loterry/data/reports/system_status.json',
    '../Amk_Goku%20Worldwide%20Loterry/data/reports/system_status.json',
    '../data/reports/system_status.json',
  ];

  const QUIET_TITLES = {
    on: 'Quiet mode active — run observe-only unless explicitly approved.',
    off: 'Quiet mode inactive — standard operations allowed with governance.',
  };

  function applyOverride(status) {
    const override = localStorage.getItem(OVERRIDE_KEY);
    if (!override) return status;
    return {
      ...status,
      quiet_mode: {
        ...(status?.quiet_mode || {}),
        active: override === 'on',
        reason: 'dev override',
        next_review: 'manual',
      },
    };
  }

  function updateAutopilotTooltips(active, reason, nextReview) {
    const suffix = active ? QUIET_TITLES.on : QUIET_TITLES.off;
    const detail = `Quiet: ${active ? 'active' : 'inactive'} · ${reason} · next ${nextReview}`;
    const ids = [
      'autopilotStartBtn',
      'autopilotStopBtn',
      'governanceCheckBtn',
      'summonCompanionBtn',
      'toggleAutocompleteBtn',
      'toggleSuggestionsBtn',
      'viewAuditBtn',
    ];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.title = `${el.textContent.trim()}: ${suffix}\n${detail}`;
    });
  }

  function setChip(state) {
    const chip = document.getElementById(CHIP_ID);
    const line = document.getElementById(STATUS_ID);
    const panel = document.getElementById(PANEL_ID);
    const badge = document.getElementById(BADGE_ID);
    if (!chip && !line && !panel && !badge) return;

    const active = Boolean(state?.quiet_mode?.active);
    const reason = state?.quiet_mode?.reason || 'n/a';
    const nextReview = state?.quiet_mode?.next_review || 'n/a';

    if (chip) {
      chip.textContent = active ? 'Quiet: On' : 'Quiet: Off';
      chip.classList.toggle('active', active);
      chip.title = `Quiet mode: ${active ? 'active' : 'inactive'}\nReason: ${reason}\nNext review: ${nextReview}`;
    }

    if (line) {
      line.textContent = `Quiet mode: ${active ? 'active' : 'inactive'}`;
      line.title = `Reason: ${reason} · Next review: ${nextReview}`;
    }

    if (panel) {
      panel.textContent = active ? 'Active' : 'Inactive';
      panel.title = `Reason: ${reason} · Next review: ${nextReview}`;
    }

    if (badge) {
      badge.textContent = `Quiet: ${active ? 'active' : 'inactive'}`;
      badge.title = `Reason: ${reason} · Next review: ${nextReview}`;
    }

    updateAutopilotTooltips(active, reason, nextReview);
  }

  async function fetchStatus() {
    for (const url of STATUS_URLS) {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) continue;
        const json = await res.json();
        return json;
      } catch {
        // try next url
      }
    }
    return null;
  }

  async function refresh() {
    const status = await fetchStatus();
    if (status) {
      setChip(applyOverride(status));
    }
  }

  window.ZQuietModeChip = {
    refresh,
    setOverride(mode) {
      if (!mode) {
        localStorage.removeItem(OVERRIDE_KEY);
      } else if (mode === 'on' || mode === 'off') {
        localStorage.setItem(OVERRIDE_KEY, mode);
      }
      refresh();
    },
    setTrustPack(label, title) {
      const badge = document.getElementById(TRUST_BADGE_ID);
      if (!badge) return;
      badge.textContent = label;
      if (title) badge.title = title;
    },
  };

  refresh();
  setInterval(refresh, 60000);
})();
