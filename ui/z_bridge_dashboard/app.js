/**
 * Z-Bridge Task 006 — local dashboard. Fetches JSON from hub data/ (static server from repo root).
 */
const DATA = '../../data/z_bridge';
const INTEL = '../../data/reports/z_bridge_intelligence_summary.json';
const ZCI = '../../data/reports/z_ci_intelligence.json';
const GARAGE_PLAN = '../../data/reports/z_garage_upgrade_plan.json';
const PAM_PATTERNS = '../../.zpam/patterns.json';
const PAM_RECOMMEND = '../../.zpam/recommendations.json';
const PAM_MIRROR = '../../data/reports/z_pam_mirrorsoul_bridge.json';

async function loadJSON(path) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error(`${path} → HTTP ${res.status}`);
  return res.json();
}

function el(id) {
  return document.getElementById(id);
}

function setText(id, text) {
  const n = el(id);
  if (n) n.textContent = text;
}

function fmtIso(s) {
  if (!s) return '—';
  try {
    return new Date(s).toLocaleString();
  } catch {
    return String(s);
  }
}

let selectedUserId = null;

function explainForUser(userId, logsDoc) {
  const events = Array.isArray(logsDoc?.events) ? logsDoc.events : [];
  const relevant = events
    .filter((e) => e?.meta?.userId === userId && String(e?.action || '').includes('z_bridge'))
    .slice(-12);
  if (!relevant.length) {
    return `No recent z_bridge log lines reference "${userId}".\n\nTip: run allocations or npm run z:bridge:validate to generate events.`;
  }
  return relevant
    .map((e) => {
      const m = e.meta || {};
      const head = `${e.ts || '?'} [${e.level || 'info'}] ${e.detail || e.action}`;
      const body = JSON.stringify(m, null, 2);
      return `${head}\n${body}`;
    })
    .join('\n\n—\n\n');
}

function renderUsers(usersDoc, tbody) {
  tbody.replaceChildren();
  const list = Array.isArray(usersDoc?.users) ? usersDoc.users : [];
  setText('zbUserCount', String(list.length));
  for (const u of list) {
    const tr = document.createElement('tr');
    tr.dataset.userId = u.id;
    if (u.id === selectedUserId) tr.classList.add('zb-row-active');
    [['id', u.id], ['credits', u.credits ?? '—'], ['daily_allocated', u.daily_allocated ?? '—'], ['reputation_score', u.reputation_score ?? '—'], ['flagged', u.flagged ? 'yes' : 'no']].forEach(
      ([, val]) => {
        const td = document.createElement('td');
        td.textContent = val == null ? '—' : String(val);
        tr.appendChild(td);
      }
    );
    tr.addEventListener('click', () => {
      selectedUserId = u.id;
      tbody.querySelectorAll('tr').forEach((r) => {
        r.classList.toggle('zb-row-active', r.dataset.userId === selectedUserId);
      });
      const section = el('zbExplainSection');
      const body = el('zbExplainBody');
      if (section && body) {
        body.textContent = explainForUser(u.id, window.__zb_logs_cache || { events: [] });
        section.hidden = false;
      }
    });
    tbody.appendChild(tr);
  }
}

function renderAllocFeed(allocations) {
  const ul = el('zbAllocFeed');
  if (!ul) return;
  ul.replaceChildren();
  const tail = allocations.slice(-24).reverse();
  for (const a of tail) {
    const li = document.createElement('li');
    const uid = a.userId || a.user_id || '?';
    const amt = a.amount ?? '—';
    li.textContent = `${uid} → +${amt} credits · ${a.source || 'engine'} · ${fmtIso(a.time)}`;
    ul.appendChild(li);
  }
}

function renderLogFeed(events) {
  const ul = el('zbLogFeed');
  if (!ul) return;
  ul.replaceChildren();
  const bridge = events.filter((e) => String(e?.action || '').startsWith('z_bridge'));
  const tail = bridge.slice(-14).reverse();
  for (const e of tail) {
    const li = document.createElement('li');
    const meta = e.meta || {};
    const uid = meta.userId ? ` ${meta.userId}` : '';
    let tag = '';
    if (e.detail === 'allocation_success') tag = ' [ok]';
    else if (e.detail === 'reduced_fairness' || e.detail === 'allocation_denied') tag = ' [adjust]';
    else if (e.detail === 'blocked_fairness') tag = ' [blocked]';
    li.textContent = `${e.ts || '?'}${uid} · ${e.detail || e.action || ''}${tag}`;
    ul.appendChild(li);
  }
}

function contributionImpact(pool, allocations) {
  const contrib = Number(pool?.contributions ?? 0);
  const today = new Date().toDateString();
  const helped = new Set();
  for (const a of allocations) {
    if (!a?.time) continue;
    if (new Date(a.time).toDateString() === today && Number(a.amount) > 0) {
      helped.add(a.userId || a.user_id);
    }
  }
  const n = helped.size;
  return `+${contrib} credits recorded as contributions in pool state → ${n} distinct user(s) received positive allocations today (UTC date boundary).`;
}

async function loadPAM() {
  const statusEl = el('pam-status');
  const topEl = el('pam-top-modules');
  const recentEl = el('pam-recent');
  const recEl = el('pam-recommendations');
  if (!statusEl || !topEl || !recentEl || !recEl) return;

  const [patternsRes, recRes] = await Promise.all([fetch(PAM_PATTERNS, { cache: 'no-store' }), fetch(PAM_RECOMMEND, { cache: 'no-store' })]);

  if (!patternsRes.ok) {
    throw new Error('No patterns');
  }

  const patterns = await patternsRes.json();
  const recs = recRes.ok ? await recRes.json() : null;

  statusEl.textContent = `Updated: ${fmtIso(patterns.generated_at)} | Events: ${patterns.total_events ?? '—'}`;

  topEl.replaceChildren();
  (patterns.top_modules || []).forEach((m) => {
    const li = document.createElement('li');
    li.textContent = m;
    topEl.appendChild(li);
  });

  recentEl.replaceChildren();
  Object.entries(patterns.last_7d || {}).forEach(([mod, count]) => {
    const li = document.createElement('li');
    li.textContent = `${mod}: ${count}`;
    recentEl.appendChild(li);
  });

  recEl.replaceChildren();
  (recs?.recommendations || []).forEach((r) => {
    const li = document.createElement('li');
    li.textContent = r;
    recEl.appendChild(li);
  });
}

async function loadPAMMirror() {
  const elPrompts = el('pam-mirror-prompts');
  if (!elPrompts) return;
  const res = await fetch(PAM_MIRROR, { cache: 'no-store' });
  if (!res.ok) {
    elPrompts.replaceChildren();
    return;
  }
  const data = await res.json();
  elPrompts.replaceChildren();
  (data.prompts || []).forEach((p) => {
    const li = document.createElement('li');
    li.textContent = p.text || JSON.stringify(p);
    elPrompts.appendChild(li);
  });
}

async function loadGaragePlan() {
  const res = await fetch(GARAGE_PLAN, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Z-Garage plan → HTTP ${res.status}`);
  const data = await res.json();

  const pressure = String(data.pressure || 'low').toUpperCase();
  const critical = Number(data.summary?.critical ?? 0);

  const pressureEl = el('garage-pressure');
  if (pressureEl) {
    pressureEl.textContent = `Pressure: ${pressure} | Critical: ${critical}`;
  }

  const plan = Array.isArray(data.plan) ? data.plan : [];
  const top = plan.slice(0, 5);

  const list = el('garage-top-fixes');
  if (!list) return;
  list.replaceChildren();
  for (const p of top) {
    const li = document.createElement('li');
    const risk = p.risk != null ? String(p.risk) : '—';
    const nextAction = p.next_action != null ? String(p.next_action) : '—';
    li.textContent = `${p.name} (${risk}) → ${nextAction}`;
    list.appendChild(li);
  }

  const patternRows = Array.isArray(data.patterns) ? data.patterns : [];
  const patList = el('garage-patterns');
  if (patList) {
    patList.replaceChildren();
    for (const row of patternRows) {
      const li = document.createElement('li');
      const label = row.task != null ? String(row.task) : '—';
      const n = Number(row.count);
      li.textContent = `${label} → ${Number.isFinite(n) ? n : '—'} project(s)`;
      patList.appendChild(li);
    }
  }
}

async function loadZCI() {
  const res = await fetch(ZCI, { cache: 'no-store' });
  if (!res.ok) throw new Error(`ZCI → HTTP ${res.status}`);
  const data = await res.json();
  const summary = data.summary;

  const summaryEl = el('zci-summary');
  if (summaryEl) {
    summaryEl.textContent = `Projects: ${summary.total_projects} | HIGH: ${summary.high_priority} | MED: ${summary.medium_priority} | LOW: ${summary.low_priority}`;
  }

  const weakest = [...(data.projects || [])]
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);

  const ul = el('zci-weakest');
  if (!ul) return;
  ul.replaceChildren();
  for (const p of weakest) {
    const li = document.createElement('li');
    const rec =
      Array.isArray(p.recommendations) && p.recommendations.length ? p.recommendations[0] : 'OK';
    li.textContent = `${p.name} (${p.score}) → ${rec}`;
    ul.appendChild(li);
  }
}

async function init() {
  setText('zbLoadedAt', `Loaded at ${new Date().toLocaleString()} · refreshing every 45s`);
  const tbody = document.querySelector('#zbUserTable tbody');
  if (!tbody) return;

  try {
    const [pool, usersDoc, historyDoc, logsDoc, intel] = await Promise.all([
      loadJSON(`${DATA}/pool.json`),
      loadJSON(`${DATA}/users.json`),
      loadJSON(`${DATA}/allocation_history.json`),
      loadJSON(`${DATA}/logs.json`),
      loadJSON(INTEL).catch(() => ({}))
    ]);

    window.__zb_logs_cache = logsDoc;

    setText('zbPoolTotal', String(pool.total_credits ?? '—'));
    setText('zbPoolAvailable', String(pool.available ?? '—'));
    setText('zbPoolDistributed', String(pool.distributed_credits ?? '—'));
    setText('zbPoolContributions', String(pool.contributions ?? '—'));
    setText('zbPoolStatus', String(pool.status ?? '—'));
    setText('zbPoolUpdated', fmtIso(pool.last_updated));

    const allocations = Array.isArray(historyDoc?.allocations) ? historyDoc.allocations : [];
    setText('zbImpactLine', contributionImpact(pool, allocations));
    renderAllocFeed(allocations);
    renderUsers(usersDoc, tbody);

    const ev = Array.isArray(logsDoc?.events) ? logsDoc.events : [];
    renderLogFeed(ev);

    if (intel && typeof intel === 'object' && Object.keys(intel).length) {
      setText('zbIntelUsers', `${intel.users_total ?? '—'} total · ${intel.users_flagged ?? '—'} flagged`);
      setText(
        'zbIntelAlloc',
        `${intel.allocations_success ?? '—'} ok · ${intel.allocations_reduced ?? '—'} reduced · ${intel.allocations_blocked ?? '—'} blocked`
      );
      const avg = intel.priority_score_avg != null ? intel.priority_score_avg.toFixed(3) : '—';
      setText('zbIntelPriority', `${avg} · ${intel.priority_score_min ?? '—'} · ${intel.priority_score_max ?? '—'}`);
      setText('zbIntelLast', fmtIso(intel.last_event_at));
    } else {
      setText('zbIntelUsers', '—');
      setText('zbIntelAlloc', '—');
      setText('zbIntelPriority', '—');
      setText('zbIntelLast', '—');
    }

    if (selectedUserId) {
      const body = el('zbExplainBody');
      const section = el('zbExplainSection');
      if (body && section) {
        body.textContent = explainForUser(selectedUserId, logsDoc);
      }
    }

    try {
      await loadZCI();
    } catch {
      setText(
        'zci-summary',
        'ZCI unavailable — run npm run z:garage:full-scan from hub root, then refresh.'
      );
      const zciUl = el('zci-weakest');
      if (zciUl) zciUl.replaceChildren();
    }

    try {
      await loadGaragePlan();
    } catch {
      setText(
        'garage-pressure',
        'Z-Garage plan unavailable — run npm run z:garage:full-scan from hub root, then refresh.'
      );
      const garageUl = el('garage-top-fixes');
      if (garageUl) garageUl.replaceChildren();
      const patUl = el('garage-patterns');
      if (patUl) patUl.replaceChildren();
    }

    try {
      await loadPAM();
    } catch {
      setText('pam-status', 'Z-PAM not available (run npm run pam:init and pam:patterns from hub root, or use a static server from repo root so .zpam/ is reachable).');
      const emptyIds = ['pam-top-modules', 'pam-recent', 'pam-recommendations'];
      for (const id of emptyIds) {
        const n = el(id);
        if (n) n.replaceChildren();
      }
    }
    try {
      await loadPAMMirror();
    } catch {
      const mp = el('pam-mirror-prompts');
      if (mp) mp.replaceChildren();
    }
  } catch (e) {
    setText('zbLoadedAt', `Error: ${e instanceof Error ? e.message : String(e)}`);
    tbody.replaceChildren();
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 5;
    td.textContent = 'Could not load data. Serve the repo root with a static server (e.g. npx serve .) and open /ui/z_bridge_dashboard/.';
    tr.appendChild(td);
    tbody.appendChild(tr);
  }
}

el('zbExplainClose')?.addEventListener('click', () => {
  const section = el('zbExplainSection');
  if (section) section.hidden = true;
});

init();
setInterval(init, 45_000);
