// Z: Amk_Goku Worldwide Loterry\ui\lottery_vault\checklist.js
const registryPath = '../../data/lottery_vault/registry.json';

async function loadJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fileExists(path) {
  try {
    const res = await fetch(path, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}

function rowTemplate(entry, status) {
  const chipClass = status === 'present' ? 'chip ok' : 'chip missing';
  const label = status === 'present' ? 'present' : 'missing';
  const name = `${entry.name} (${entry.id})`;
  const rawPath = `../../data/lottery_vault/${entry.vault_path}/raw/${entry.id}.csv`;
  const rawDir = `../../data/lottery_vault/${entry.vault_path}/raw/`;
  return `
    <div class="row">
      <div>
        <div>${name}</div>
        <div class="small">${entry.region} · ${entry.update_method}</div>
        <div class="small">${rawPath}</div>
        <div class="small">
          <button class="copy-path" data-path="${rawDir}">Copy raw folder path</button>
        </div>
      </div>
      <span class="chip ${chipClass}">${label}</span>
    </div>
  `;
}

async function renderChecklist() {
  const root = document.getElementById('checklist');
  const summary = document.getElementById('summary');
  if (!root) return;

  const registry = await loadJSON(registryPath);
  if (!registry || !registry.lotteries) {
    root.innerHTML = '<div class="muted">Registry not found.</div>';
    return;
  }

  const manual = registry.lotteries.filter((l) => l.update_method === 'manual_drop');
  if (!manual.length) {
    root.innerHTML = '<div class="muted">No manual-drop sources listed.</div>';
    return;
  }

  const rows = [];
  let presentCount = 0;
  for (const entry of manual) {
    const rawPath = `../../data/lottery_vault/${entry.vault_path}/raw/${entry.id}.csv`;
    const ok = await fileExists(rawPath);
    if (ok) presentCount += 1;
    rows.push(rowTemplate(entry, ok ? 'present' : 'missing'));
  }

  root.innerHTML = rows.join('');
  if (summary) {
    const health = await loadJSON('../../data/lottery_vault/health.json');
    const status = await loadJSON('../../data/reports/system_status.json');
    const stamp = health?.generated_at ? ` · Updated ${health.generated_at}` : '';
    const runId = status?.trust_bundle ? status.trust_bundle.split('/').pop() : '';
    const runStamp = runId
      ? ` · Last run ${runId.replace('trust_bundle_', '').replace('.json', '')}`
      : '';
    const rhythm = status?.rhythm_state ? ` · Rhythm ${status.rhythm_state}` : '';
    summary.textContent = `Manual sources ready: ${presentCount}/${manual.length}${stamp}${runStamp}${rhythm}`;
  }

  root.querySelectorAll('.copy-path').forEach((btn) => {
    btn.addEventListener('click', async (event) => {
      const path = event.currentTarget.getAttribute('data-path');
      if (!path) return;
      try {
        await navigator.clipboard.writeText(path);
        event.currentTarget.textContent = 'Copied';
        setTimeout(() => {
          event.currentTarget.textContent = 'Copy raw folder path';
        }, 1500);
      } catch {
        event.currentTarget.textContent = 'Copy failed';
        setTimeout(() => {
          event.currentTarget.textContent = 'Copy raw folder path';
        }, 1500);
      }
    });
  });
}

(async function main() {
  await renderChecklist();
  setInterval(renderChecklist, 120000);
})();
