async function loadJSON(path) {
  try {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? '—';
}

async function render() {
  const status = await loadJSON('../../data/reports/system_status.json');
  const zOctave = await loadJSON('../../data/reports/z_octave_readiness.json');
  const autoAudit = await loadJSON('../../data/reports/z_autorun_audit.json');
  const pending = await loadJSON('../../data/reports/z_pending_audit.json');

  setText('snapGenerated', status?.generated_at || zOctave?.generated_at || '—');
  setText('snapMode', status?.rhythm_state || '—');

  setText('quietModeStatus', status?.quiet_mode?.active ? 'active' : 'inactive');
  setText('quietModeReason', status?.quiet_mode?.reason || '—');

  setText('octaveReady', zOctave?.ready ? 'yes' : 'no');
  setText('octavePilotSeed', zOctave?.pilot_seed ? 'present' : 'missing');

  setText('autoTasksSetting', autoAudit?.auto_tasks_setting || '—');
  setText('autoTasksList', autoAudit?.auto_tasks?.length ? autoAudit.auto_tasks.join(', ') : '—');

  setText('pendingTotal', pending?.total ?? '—');
  setText('pendingUpdated', pending?.generated_at || '—');
}

render();
