import { generateSwitchingReport } from '../mirror_decision_engine/engine_esm/mde_switching.mjs';
import {
  computeWeightedSwitchScore,
  decideActionFromWeightedScore,
} from '../mirror_decision_engine/engine_esm/mde_weighted.mjs';
import { suggestWeights } from '../mirror_decision_engine/engine_esm/mde_adaptive_weights.mjs';
import { suggestProfile } from '../mirror_decision_engine/engine_esm/mde_profile_suggester.mjs';
import { forecastDecisionImpact } from '../mirror_decision_engine/engine_esm/mde_forecast.mjs';
import { computeStability } from '../mirror_decision_engine/engine_esm/mde_stability.mjs';
import { buildDecisionNarrative } from '../mirror_decision_engine/engine_esm/mde_narrative.mjs';
import { getPartnerLink } from '../mirror_decision_engine/engine_esm/partner_router.mjs';
import { buildFallbackPricingBundle } from '../mirror_decision_engine/engine_esm/pricing_router.mjs';

const LS = {
  user: 'zgm_user',
  admin: 'zgm_admin_mode',
  adaptive: 'zgm_adaptive_weights_enabled',
  profileOverrides: 'zgm_profile_overrides',
  weightHistory: 'zgm_weight_history',
  customProfiles: 'zgm_custom_profiles',
  decisionMemory: 'zgm_decision_memory_v1',
  sealLedger: 'zgm_seal_ledger_v1',
  history: (userId) => `zgm_history_${userId}`,
};

const GOVERNANCE_STATE = {
  deterministicEngineLocked: true,
  adaptiveSuggestionsManual: true,
  localModeActive: true,
  cloudSyncEnabled: false,
  sealSystemEnabled: true,
};

const BUILTIN_PROFILES = {
  balanced: {
    name: 'Balanced',
    weights: { cost: 6, privacy: 5, durability: 5, sustainability: 7, freedom: 4 },
  },
  creator: {
    name: 'Creator Mode',
    weights: { cost: 5, privacy: 6, durability: 6, sustainability: 6, freedom: 8 },
  },
  enterprise: {
    name: 'Enterprise Mode',
    weights: { cost: 6, privacy: 9, durability: 7, sustainability: 5, freedom: 4 },
  },
  gaming: {
    name: 'Gaming Mode',
    weights: { cost: 6, privacy: 4, durability: 7, sustainability: 4, freedom: 7 },
  },
  sustainability: {
    name: 'Sustainability Mode',
    weights: { cost: 5, privacy: 6, durability: 8, sustainability: 10, freedom: 5 },
  },
  privacy: {
    name: 'Privacy Mode',
    weights: { cost: 6, privacy: 10, durability: 6, sustainability: 6, freedom: 6 },
  },
};

const FORECAST_SCENARIOS = {
  normal: { name: 'Normal Usage', holdingYears: 2, repairMultiplier: 1, lockInMultiplier: 1 },
  annual_upgrade: {
    name: 'Annual Upgrade',
    holdingYears: 1,
    repairMultiplier: 0.8,
    lockInMultiplier: 0.7,
  },
  long_term_keeper: {
    name: 'Long-Term Keeper (4y)',
    holdingYears: 4,
    repairMultiplier: 1.3,
    lockInMultiplier: 1.2,
  },
  high_risk: {
    name: 'High Accident Risk',
    holdingYears: 2,
    repairMultiplier: 1.6,
    lockInMultiplier: 1,
  },
  enterprise_critical: {
    name: 'Enterprise Critical',
    holdingYears: 3,
    repairMultiplier: 1.2,
    lockInMultiplier: 1.4,
  },
};

const PHASE_STATUS = [
  { phase: 'P4.3', label: 'Profiles', enabled: true },
  { phase: 'P5', label: 'Behavior Suggestion', enabled: true },
  { phase: 'P6.1', label: 'Forecast Scenarios', enabled: true },
  { phase: 'P7', label: 'Stability Index', enabled: true },
  { phase: 'P7.1', label: 'Heatmap', enabled: true },
  { phase: 'P7.2', label: 'Narrative', enabled: true },
  { phase: 'P7.3', label: 'Mitigations', enabled: true },
  { phase: 'P8', label: 'Decision Memory', enabled: true },
];

let baseProfiles = [];
let profiles = [];
let baseline = null;
let lastSuggestion = null;
let lastProfileSuggestion = null;
let lastReport = null;
let lastPlaybook = null;
let lastSeal = null;
let suppressWeightSnapshot = false;
let decisionMeta = { mitigations: [], profileLoaded: null, playbookRule: null };

const $ = (id) => document.getElementById(id);
const parseJson = (s, fallback) => {
  try {
    return JSON.parse(s);
  } catch {
    return fallback;
  }
};
const clone = (obj) => JSON.parse(JSON.stringify(obj));

function countBy(arr, keyFn) {
  const map = {};
  for (const x of arr || []) {
    const key = String(keyFn(x) ?? 'unknown');
    map[key] = (map[key] || 0) + 1;
  }
  return map;
}

function topKey(countMap) {
  const entries = Object.entries(countMap || {});
  if (!entries.length) return null;
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

function canonicalize(value) {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(canonicalize);
  const out = {};
  Object.keys(value)
    .sort()
    .forEach((k) => {
      out[k] = canonicalize(value[k]);
    });
  return out;
}

function canonicalJSONStringify(obj) {
  return JSON.stringify(canonicalize(obj));
}

async function sha256Hex(text) {
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function loadJson(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  return res.json();
}

function getUser() {
  return parseJson(localStorage.getItem(LS.user), null);
}
function setUser(v) {
  localStorage.setItem(LS.user, JSON.stringify(v));
}
function clearUser() {
  localStorage.removeItem(LS.user);
}
function isAdmin() {
  return localStorage.getItem(LS.admin) === '1';
}
function setAdmin(v) {
  localStorage.setItem(LS.admin, v ? '1' : '0');
}
function isAdaptive() {
  return localStorage.getItem(LS.adaptive) === '1';
}
function setAdaptive(v) {
  localStorage.setItem(LS.adaptive, v ? '1' : '0');
}
function getProfileOverrides() {
  return parseJson(localStorage.getItem(LS.profileOverrides), []);
}
function setProfileOverrides(v) {
  localStorage.setItem(LS.profileOverrides, JSON.stringify(v));
}
function getCustomProfiles() {
  return parseJson(localStorage.getItem(LS.customProfiles), {});
}
function saveCustomProfiles(v) {
  localStorage.setItem(LS.customProfiles, JSON.stringify(v));
}
function getHistory(userId) {
  return parseJson(localStorage.getItem(LS.history(userId)), []);
}
function setHistory(userId, reports) {
  localStorage.setItem(LS.history(userId), JSON.stringify(reports));
}
function getWeightHistory() {
  return parseJson(localStorage.getItem(LS.weightHistory), []);
}
function setWeightHistory(v) {
  localStorage.setItem(LS.weightHistory, JSON.stringify(v));
}
function getDecisionMemory() {
  return parseJson(localStorage.getItem(LS.decisionMemory), []);
}
function saveDecisionMemory(mem) {
  localStorage.setItem(LS.decisionMemory, JSON.stringify(mem));
}
function getSealLedger() {
  return parseJson(localStorage.getItem(LS.sealLedger), []);
}
function saveSealLedger(ledger) {
  localStorage.setItem(LS.sealLedger, JSON.stringify(ledger));
}

function profileLabel(p) {
  return `${p.brand} • ${p.ecosystem} • ${p.category} • ${p.model_name || p.id}`;
}
function mergeProfiles(base) {
  const map = new Map(base.map((p) => [p.id, p]));
  for (const o of getProfileOverrides()) map.set(o.id, o);
  return Array.from(map.values()).sort((a, b) => profileLabel(a).localeCompare(profileLabel(b)));
}
function option(text, value) {
  const el = document.createElement('option');
  el.value = value;
  el.textContent = text;
  return el;
}
function currentUserId() {
  const user = getUser();
  return user ? user.id : 'guest';
}

function getCurrentScope() {
  const user = getUser?.() || null;
  return {
    scope_type: 'user',
    scope_id: 'local_default',
    owner_id: user?.id || 'guest',
    visibility: 'private',
  };
}

function renderHeaderChips() {
  const user = getUser();
  $('userChip').textContent = user ? user.name : 'Guest';
  $('adminChip').textContent = isAdmin() ? 'Admin: ON' : 'Admin: OFF';
  $('adaptChip').textContent = isAdaptive() ? 'Adaptive: ON' : 'Adaptive: OFF';
}

function renderPhaseStatusRail() {
  const rail = $('phaseStatusRail');
  if (!rail) return;
  rail.innerHTML = PHASE_STATUS.map(
    (p) =>
      `<span class="phase-chip ${p.enabled ? 'enabled' : 'hold'}">${p.phase}: ${p.label} - ${
        p.enabled ? 'ENABLED' : 'HOLD'
      }</span>`
  ).join('');
}

function computeExecutiveState() {
  const mem = getDecisionMemory();
  const ledger = getSealLedger();
  const sessions = mem.length;
  const sealCount = ledger.length;
  const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);
  const st = mem.map((x) => x.stabilityIndex).filter((v) => Number.isFinite(v));
  const fl = mem.map((x) => x.flipRate).filter((v) => Number.isFinite(v));
  const avgStability = st.length ? Math.round(avg(st)) : null;
  const avgFlipRatePct = fl.length ? Math.round(avg(fl) * 100) : null;
  const driverCounts = countBy(
    mem.flatMap((x) => (x.topDrivers || []).map((d) => d.driver)),
    (x) => x
  );
  const mitigationCounts = countBy(
    mem.flatMap((x) => x.mitigations || []),
    (x) => x
  );
  const topDriver = topKey(driverCounts);
  const topMitigation = topKey(mitigationCounts);
  const verifiedCount = ledger.filter((l) => Boolean(l.hash)).length;
  const tamperedCount = ledger.filter((l) => l.verify_status === 'tampered').length;
  const integrityRatio = sealCount ? verifiedCount / sealCount : 1;
  const mitigationEffectiveness = topMitigation ? 10 : 5;
  let health = 0;
  health += (avgStability ?? 60) * 0.5;
  health += (avgFlipRatePct != null ? 100 - avgFlipRatePct : 70) * 0.2;
  health += integrityRatio * 100 * 0.2;
  health += mitigationEffectiveness * 0.1;
  const healthScore = Math.round(Math.max(0, Math.min(100, health)));
  const lastRule = mem[mem.length - 1]?.playbookRule || null;

  return {
    sessions,
    sealCount,
    verifiedCount,
    tamperedCount,
    avgStability,
    avgFlipRatePct,
    topDriver,
    topMitigation,
    lastRule,
    healthScore,
  };
}

function renderGuardrailRow() {
  const row = $('zgmGuardrailRow');
  if (!row) return;
  const chips = [
    {
      label: 'Deterministic Engine',
      value: GOVERNANCE_STATE.deterministicEngineLocked ? 'LOCKED' : 'UNLOCKED',
      ok: GOVERNANCE_STATE.deterministicEngineLocked,
    },
    {
      label: 'Adaptive Suggestions',
      value: GOVERNANCE_STATE.adaptiveSuggestionsManual ? 'MANUAL' : 'AUTO',
      ok: GOVERNANCE_STATE.adaptiveSuggestionsManual,
    },
    {
      label: 'Local Mode',
      value: GOVERNANCE_STATE.localModeActive ? 'ACTIVE' : 'REMOTE',
      ok: GOVERNANCE_STATE.localModeActive,
    },
    {
      label: 'Cloud Sync',
      value: GOVERNANCE_STATE.cloudSyncEnabled ? 'ENABLED' : 'DISABLED',
      ok: !GOVERNANCE_STATE.cloudSyncEnabled,
    },
    {
      label: 'Seal System',
      value: GOVERNANCE_STATE.sealSystemEnabled ? 'ENABLED' : 'DISABLED',
      ok: GOVERNANCE_STATE.sealSystemEnabled,
    },
  ];
  row.innerHTML = chips
    .map(
      (c) =>
        `<span class="guard-chip ${c.ok ? 'guard-ok' : 'guard-neutral'}">${c.label}: ${c.value}</span>`
    )
    .join('');
}

function renderExecutivePanel() {
  const card = $('zgmExecutiveCard');
  const output = $('zgmExecutiveOutput');
  if (!card || !output) return;
  const state = computeExecutiveState();
  const shouldShow = isAdmin() || state.sessions > 0 || Boolean(lastReport);
  card.style.display = shouldShow ? 'block' : 'none';
  if (!shouldShow) return;
  output.textContent = [
    `System Health: ${state.healthScore}/100`,
    `Sessions: ${state.sessions}`,
    `Seals: ${state.sealCount} (Verified: ${state.verifiedCount}, Tampered: ${state.tamperedCount})`,
    '',
    `Avg Stability: ${state.avgStability ?? 'N/A'}`,
    `Avg Flip Rate: ${state.avgFlipRatePct ?? 'N/A'}%`,
    '',
    `Top Risk Driver: ${state.topDriver ?? 'N/A'}`,
    `Top Mitigation: ${state.topMitigation ?? 'N/A'}`,
    `Last Rule Used: ${state.lastRule ?? 'N/A'}`,
  ].join('\n');
}

function getCurrentWeightsObject() {
  return {
    cost: Number($('w_cost').value),
    privacy: Number($('w_privacy').value),
    durability: Number($('w_durability').value),
    sustainability: Number($('w_sustainability').value),
    freedom: Number($('w_freedom').value),
  };
}

function readWeights() {
  const w = getCurrentWeightsObject();
  $('weightsPreview').textContent =
    `Weights → cost:${w.cost} privacy:${w.privacy} durability:${w.durability} sustainability:${w.sustainability} freedom:${w.freedom}`;
  return w;
}

function pushWeightSnapshot(weights, source) {
  const history = getWeightHistory();
  history.push({ timestamp: new Date().toISOString(), source, weights });
  setWeightHistory(history.slice(-300));
  renderWeightHistory();
  renderWeightEvolution();
}

function applyWeights(weights, source = 'manual') {
  suppressWeightSnapshot = true;
  $('w_cost').value = String(weights.cost);
  $('w_privacy').value = String(weights.privacy);
  $('w_durability').value = String(weights.durability);
  $('w_sustainability').value = String(weights.sustainability);
  $('w_freedom').value = String(weights.freedom);
  readWeights();
  suppressWeightSnapshot = false;
  pushWeightSnapshot(weights, source);
}

function setWeightListeners() {
  ['w_cost', 'w_privacy', 'w_durability', 'w_sustainability', 'w_freedom'].forEach((id) => {
    $(id).addEventListener('input', readWeights);
    $(id).addEventListener('change', () => {
      if (!suppressWeightSnapshot) pushWeightSnapshot(readWeights(), 'manual');
    });
  });
  readWeights();
}

function renderProfileDropdown() {
  const select = $('profileSelect');
  select.innerHTML = '';
  Object.entries(BUILTIN_PROFILES).forEach(([key, p]) => {
    select.appendChild(option(`Built-in: ${p.name}`, key));
  });
  const custom = getCustomProfiles();
  Object.entries(custom).forEach(([key, p]) => {
    select.appendChild(option(`Custom: ${p.name}`, `custom:${key}`));
  });
}

function renderScenarioDropdown() {
  const select = $('forecastScenario');
  select.innerHTML = '';
  Object.entries(FORECAST_SCENARIOS).forEach(([key, s]) => select.appendChild(option(s.name, key)));
  select.value = 'normal';
}

function renderProfiles() {
  const from = $('fromProfile');
  const to = $('toProfile');
  const edit = $('editProfile');
  from.innerHTML = '';
  to.innerHTML = '';
  edit.innerHTML = '';
  profiles.forEach((p) => {
    const label = profileLabel(p);
    from.appendChild(option(label, p.id));
    to.appendChild(option(label, p.id));
    edit.appendChild(option(label, p.id));
  });
  if (profiles.length >= 2) {
    from.value = profiles[0].id;
    to.value = profiles[1].id;
  }
}

function renderObservatory(reports) {
  const panel = $('observatoryPanel');
  if (!reports?.length) {
    panel.innerHTML = 'Generate reports to view local analytics.';
    return;
  }
  const stats = {
    total: reports.length,
    actions: {},
    roles: {},
    reasons: {},
    weighted: [],
    friction: [],
    cost: [],
    tco: [],
    repairProb: [],
  };
  for (const r of reports) {
    const action = r.recommendation?.action || 'unknown';
    stats.actions[action] = (stats.actions[action] || 0) + 1;
    const role = r.inputs?.primary_role || 'unknown';
    stats.roles[role] = (stats.roles[role] || 0) + 1;
    for (const code of r.recommendation?.reason_codes || [])
      stats.reasons[code] = (stats.reasons[code] || 0) + 1;
    if (Number.isFinite(r._weighted?.final_score)) stats.weighted.push(r._weighted.final_score);
    if (Number.isFinite(r.scores?.friction_score)) stats.friction.push(r.scores.friction_score);
    if (Number.isFinite(r.scores?.cost_delta_eur)) stats.cost.push(r.scores.cost_delta_eur);
    if (Number.isFinite(r.forecast?.tco?.total_eur)) stats.tco.push(r.forecast.tco.total_eur);
    if (Number.isFinite(r.forecast?.repair?.annual_repair_probability))
      stats.repairProb.push(r.forecast.repair.annual_repair_probability * 100);
  }
  const avg = (arr) =>
    arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 'N/A';
  const lines = (obj) =>
    Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `<div>${k}: ${v}</div>`)
      .join('');
  panel.innerHTML = `
    <div><strong>Total Reports:</strong> ${stats.total}</div>
    <div><strong>Average Weighted Score:</strong> ${avg(stats.weighted)}</div>
    <div><strong>Average Friction Score:</strong> ${avg(stats.friction)}</div>
    <div><strong>Average Cost Delta:</strong> EUR ${avg(stats.cost)}</div>
    <div><strong>Average TCO:</strong> EUR ${avg(stats.tco)}</div>
    <div><strong>Average Repair Probability:</strong> ${avg(stats.repairProb)}%</div>
    <hr style="margin:10px 0;border:1px solid #243245" />
    <div><strong>Action Distribution</strong></div>${lines(stats.actions)}
    <div style="margin-top:8px;"><strong>Primary Roles</strong></div>${lines(stats.roles)}
    <div style="margin-top:8px;"><strong>Top Reason Codes</strong></div>${lines(stats.reasons)}
  `;
}

function renderHistory() {
  const box = $('history');
  const user = getUser();
  if (!user) {
    box.innerHTML = '<div class="muted">Login to keep local history.</div>';
    renderObservatory([]);
    return;
  }
  const history = getHistory(user.id);
  if (!history.length) {
    box.innerHTML = '<div class="muted">No reports yet.</div>';
    renderObservatory([]);
    return;
  }
  box.innerHTML = '';
  history
    .slice()
    .reverse()
    .forEach((r) => {
      const row = document.createElement('div');
      row.className = 'histItem';
      row.innerHTML = `<div><strong>${r.recommendation?.action || 'report'}</strong> • ${new Date(r.created_at).toLocaleString()}</div><div class="muted">${r.recommendation?.plain_summary || ''}</div>`;
      row.addEventListener('click', () => {
        lastReport = r;
        $('output').textContent = JSON.stringify(r, null, 2);
        $('narrativePanel').textContent = r.narrative || '';
        renderStability(r);
        renderHeatmap(r);
      });
      box.appendChild(row);
    });
  renderObservatory(history);
}

function renderWeightHistory() {
  const panel = $('weightHistoryPanel');
  const history = getWeightHistory();
  if (!history.length) {
    panel.innerHTML = '<div class="muted">No weight history yet.</div>';
    return;
  }
  panel.innerHTML = '';
  history
    .slice()
    .reverse()
    .forEach((entry, idx) => {
      const originalIndex = history.length - 1 - idx;
      const row = document.createElement('div');
      row.className = 'histItem';
      row.innerHTML = `
      <div><strong>${String(entry.source || 'manual').toUpperCase()}</strong> • ${new Date(entry.timestamp).toLocaleString()}</div>
      <div class="muted">cost:${entry.weights.cost} privacy:${entry.weights.privacy} durability:${entry.weights.durability} sustainability:${entry.weights.sustainability} freedom:${entry.weights.freedom}</div>
      <button class="ghost" data-revert="${originalIndex}">Revert</button>
    `;
      panel.appendChild(row);
    });
  panel.querySelectorAll('[data-revert]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const snap = getWeightHistory()[Number(btn.getAttribute('data-revert'))];
      if (snap) applyWeights(snap.weights, 'rollback');
    });
  });
}

function spark(values, width = 250, height = 44) {
  if (!values || values.length < 2) return '<div class="muted">Not enough data.</div>';
  const pad = 4;
  const xStep = (width - pad * 2) / (values.length - 1);
  const y = (v) => pad + (1 - v / 10) * (height - pad * 2);
  let pts = '';
  values.forEach((v, i) => {
    pts += `${(pad + i * xStep).toFixed(2)},${y(Number(v)).toFixed(2)} `;
  });
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect x="0" y="0" width="${width}" height="${height}" rx="8" ry="8" fill="transparent" stroke="#243245"></rect><polyline fill="none" stroke="#6ee7ff" stroke-width="2" points="${pts.trim()}"></polyline></svg>`;
}

function renderWeightEvolution() {
  const panel = $('weightVizPanel');
  const history = getWeightHistory();
  if (!history.length) {
    panel.innerHTML = '<div class="muted">No history yet.</div>';
    return;
  }
  const windowSize = Number($('weightWindow').value || 50);
  const recent = history.slice(-windowSize);
  const series = { cost: [], privacy: [], durability: [], sustainability: [], freedom: [] };
  let manual = 0;
  let adaptive = 0;
  for (const e of recent) {
    series.cost.push(Number(e.weights.cost));
    series.privacy.push(Number(e.weights.privacy));
    series.durability.push(Number(e.weights.durability));
    series.sustainability.push(Number(e.weights.sustainability));
    series.freedom.push(Number(e.weights.freedom));
    if (e.source === 'adaptive') adaptive += 1;
    else manual += 1;
  }
  panel.innerHTML = `
    <div class="muted" style="margin-bottom:10px;">Samples: <strong>${recent.length}</strong> • Manual: <strong>${manual}</strong> • Adaptive: <strong>${adaptive}</strong></div>
    <div><strong>Cost</strong>${spark(series.cost)}</div>
    <div><strong>Privacy</strong>${spark(series.privacy)}</div>
    <div><strong>Durability</strong>${spark(series.durability)}</div>
    <div><strong>Sustainability</strong>${spark(series.sustainability)}</div>
    <div><strong>Freedom</strong>${spark(series.freedom)}</div>
  `;
}

function adminPanelVisible() {
  $('adminPanel').style.display = isAdmin() ? 'block' : 'none';
}

function loadProfileToEditor(p) {
  if (!p) return;
  $('p_id').value = p.id || '';
  $('p_brand').value = p.brand || '';
  $('p_ecosystem').value = p.ecosystem || 'Other';
  $('p_category').value = p.category || 'other';
  $('p_model').value = p.model_name || '';
  $('p_year').value = p.released_year || new Date().getFullYear();
  const m = p.metrics || {};
  $('m_customization').value = m.customization ?? 5;
  $('m_lockin').value = m.lock_in ?? 5;
  $('m_repair').value = m.repairability ?? 5;
  $('m_resale').value = m.resale_retention ?? 50;
  $('m_privacy').value = m.privacy_posture ?? 'unknown';
  $('m_durability').value = m.durability ?? 5;
  $('m_support').value = m.software_support_years ?? 4;
  $('m_access').value = m.accessibility ?? 5;
  $('m_enterprise').value = m.enterprise_readiness ?? 5;
}

function readProfileFromEditor() {
  const id = $('p_id').value.trim();
  if (!id) throw new Error('Profile id is required');
  return {
    id,
    brand: $('p_brand').value.trim() || 'Unknown',
    ecosystem: $('p_ecosystem').value,
    category: $('p_category').value,
    model_name: $('p_model').value.trim(),
    released_year: Number($('p_year').value || new Date().getFullYear()),
    notes_public: 'Local override profile',
    metrics: {
      customization: Number($('m_customization').value || 5),
      lock_in: Number($('m_lockin').value || 5),
      repairability: Number($('m_repair').value || 5),
      resale_retention: Number($('m_resale').value || 50),
      privacy_posture: $('m_privacy').value,
      durability: Number($('m_durability').value || 5),
      software_support_years: Number($('m_support').value || 4),
      accessibility: Number($('m_access').value || 5),
      enterprise_readiness: Number($('m_enterprise').value || 5),
    },
    role_strengths: {
      creator: 7,
      enterprise: 7,
      student: 7,
      gaming: 7,
      family: 7,
      health: 7,
      travel: 7,
    },
  };
}

function downloadJson(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

function getSelectedScenario() {
  return FORECAST_SCENARIOS[$('forecastScenario').value || 'normal'] || FORECAST_SCENARIOS.normal;
}

function renderStability(report) {
  const el = $('stabilityPanel');
  const s = report?.stability;
  if (!s) {
    el.innerHTML = '<div class="muted">No stability analysis yet.</div>';
    return;
  }
  const badge =
    s.riskLevel === 'rock_solid'
      ? 'ROCK SOLID'
      : s.riskLevel === 'stable'
        ? 'STABLE'
        : s.riskLevel === 'sensitive'
          ? 'SENSITIVE'
          : 'FRAGILE';
  el.innerHTML = `
    <div style="font-weight:900; font-size:16px;">${badge} • Stability Index: ${s.stabilityIndex}/100</div>
    <div class="muted" style="margin-top:6px;">Base Action: <strong>${s.baseAction}</strong> • Runs: ${s.runs} • Flips: ${s.flips} • Flip rate: ${(s.flipRate * 100).toFixed(0)}%</div>
    <div style="margin-top:10px;">
      <div style="font-weight:800;">Top Risk Drivers</div>
      ${(s.topDrivers || []).map((d) => `<div class="muted">• ${d.driver} (flip signals: ${d.flipCount})</div>`).join('')}
    </div>
  `;
}

function renderHeatmap(report) {
  const container = $('heatmapContainer');
  const s = report?.stability;
  if (!s?.grid?.length) {
    container.innerHTML = '<div class="muted">No heatmap data available.</div>';
    return;
  }
  const grid = s.grid;
  const priceFactors = [...new Set(grid.map((g) => g.priceFactor))].sort((a, b) => a - b);
  const holdingYears = [...new Set(grid.map((g) => g.holdingYears))].sort((a, b) => a - b);
  let html = `<div style="overflow-x:auto;"><table style="border-collapse:collapse;font-size:12px;"><tr><th style="padding:6px;">Years \\ Price</th>${priceFactors.map((p) => `<th style="padding:6px;">${Math.round((p - 1) * 100)}%</th>`).join('')}</tr>`;
  for (const y of holdingYears) {
    html += `<tr><td style="padding:6px;font-weight:700;">${y}y</td>`;
    for (const p of priceFactors) {
      const cell = grid.find((g) => g.holdingYears === y && g.priceFactor === p);
      html += `<td style="padding:8px;text-align:center;background:${cell?.flipped ? '#c62828' : '#2e7d32'};color:white;border:1px solid #1e293b;">${cell?.flipped ? 'FLIP' : 'OK'}</td>`;
    }
    html += '</tr>';
  }
  html +=
    '</table></div><div class="muted" style="margin-top:6px;">Green = stable • Red = recommendation flips under stress</div>';
  container.innerHTML = html;
}

function computeDecisionInsights(mem) {
  const topK = (map, k = 3) =>
    Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, k);
  const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);
  const st = mem.map((x) => x.stabilityIndex).filter((v) => Number.isFinite(v));
  const tco = mem.map((x) => x.tcoTotal).filter((v) => Number.isFinite(v));
  const flip = mem.map((x) => x.flipRate).filter((v) => Number.isFinite(v));
  const actions = countBy(mem, (x) => x.action);
  const scenarios = countBy(mem, (x) => x.scenario);
  const riskLevels = countBy(mem, (x) => x.riskLevel);
  const mitigations = countBy(
    mem.flatMap((x) => x.mitigations || []),
    (x) => x
  );
  const drivers = countBy(
    mem.flatMap((x) => (x.topDrivers || []).map((d) => d.driver)),
    (x) => x
  );

  const insight = {
    sessions: mem.length,
    avgStability: st.length ? Math.round(avg(st)) : null,
    avgFlipRatePct: flip.length ? Math.round(avg(flip) * 100) : null,
    avgTco: tco.length ? Math.round(avg(tco)) : null,
    topActions: topK(actions, 3),
    topScenarios: topK(scenarios, 3),
    topRiskLevels: topK(riskLevels, 3),
    topDrivers: topK(drivers, 3),
    topMitigations: topK(mitigations, 4),
  };

  const primaryMitigation = insight.topMitigations?.[0]?.[0];
  const style = [];
  if ((insight.avgStability ?? 100) >= 80) style.push('You tend to land on stable decisions.');
  else style.push('You frequently explore sensitive edges; mitigation is important.');
  if (primaryMitigation === 'increase_holding')
    style.push('Your favorite lever is time (holding period).');
  if (primaryMitigation === 'refurb_path')
    style.push('You often control risk through refurb pricing.');
  if (primaryMitigation === 'reduce_lockin')
    style.push('You regularly prioritize ecosystem freedom.');
  if (primaryMitigation === 'raise_durability')
    style.push('You boost durability when uncertainty rises.');
  insight.decisionStyle = style.join(' ');
  return insight;
}

function renderDecisionInsights() {
  const mem = getDecisionMemory();
  if (!mem.length) {
    $('insightsSummary').textContent =
      'No decision memory yet. Run a few reports to build insights.';
    $('insightsDetail').textContent = '';
    return;
  }
  const insight = computeDecisionInsights(mem);
  $('insightsSummary').innerHTML = `
    Sessions: <strong>${insight.sessions}</strong> •
    Avg Stability: <strong>${insight.avgStability ?? 'N/A'}</strong>/100 •
    Avg Flip Rate: <strong>${insight.avgFlipRatePct ?? 'N/A'}%</strong> •
    Avg TCO: <strong>${insight.avgTco != null ? `EUR ${insight.avgTco}` : 'N/A'}</strong>
    <div style="margin-top:8px;"><strong>Decision Style:</strong> ${insight.decisionStyle}</div>
  `;
  $('insightsDetail').textContent = JSON.stringify(insight, null, 2);
}

function buildPlaybook(mem) {
  if (!mem?.length) {
    return {
      version: 'zgm_playbook_v1',
      generated_at: new Date().toISOString(),
      note: 'No sessions yet — run a few reports to generate a personalized playbook.',
      rules: [],
    };
  }

  const recent = mem.slice(-80);
  const stabilityVals = recent.map((x) => x.stabilityIndex).filter((v) => Number.isFinite(v));
  const avgStability = stabilityVals.length
    ? Math.round(stabilityVals.reduce((a, b) => a + b, 0) / stabilityVals.length)
    : null;

  const driversFlat = recent.flatMap((x) => (x.topDrivers || []).map((d) => d.driver));
  const driverCounts = countBy(driversFlat, (x) => x);
  const mitigationCounts = countBy(
    recent.flatMap((x) => x.mitigations || []),
    (x) => x
  );
  const scenarioCounts = countBy(recent, (x) => x.scenario);
  const actionCounts = countBy(recent, (x) => x.action);

  const topDriver = topKey(driverCounts);
  const topMitigation = topKey(mitigationCounts);
  const topScenario = topKey(scenarioCounts);
  const topAction = topKey(actionCounts);

  const rules = [
    {
      id: 'fragile_stability_guard',
      trigger: 'stabilityIndex < 70',
      recommended_actions: [
        'run_scenario_compare',
        'use_mitigation_buttons',
        'prefer_refurb_if_price_volatility',
      ],
      suggested_profile: topDriver === 'lock_in_risk' ? 'creator' : 'balanced',
      suggested_scenario: 'long_term_keeper',
      why: 'When decisions are sensitive, stability improves by testing scenarios and applying mitigation levers.',
    },
    {
      id: 'price_volatility_protocol',
      trigger: 'topDriver == price_volatility',
      recommended_actions: ['mitigate_refurb_path', 'set_price_cap', 'rerun_stability'],
      suggested_profile: 'balanced',
      suggested_scenario: 'normal',
      why: 'Price volatility is best controlled by shifting to refurbished pricing or delaying until prices stabilize.',
    },
    {
      id: 'repair_risk_protocol',
      trigger: 'topDriver == repair_risk',
      recommended_actions: [
        'mitigate_raise_durability',
        'use_protection',
        'budget_repair_buffer',
        'rerun_forecast',
      ],
      suggested_profile: 'sustainability',
      suggested_scenario: 'high_risk',
      why: 'Repair risk stabilizes when durability and repairability are prioritized.',
    },
    {
      id: 'lockin_protocol',
      trigger: 'topDriver == lock_in_risk',
      recommended_actions: [
        'mitigate_reduce_lockin',
        'switch_to_creator_profile',
        'rerun_stability',
      ],
      suggested_profile: 'creator',
      suggested_scenario: 'normal',
      why: 'Lock-in sensitivity stabilizes when freedom weight increases.',
    },
    {
      id: 'holding_period_protocol',
      trigger: 'topDriver == holding_period_sensitivity',
      recommended_actions: [
        'increase_holding_years',
        'compare_annual_upgrade_vs_keeper',
        'rerun_forecast',
      ],
      suggested_profile: 'balanced',
      suggested_scenario: 'annual_upgrade',
      why: 'Holding-period sensitivity improves when strategy matches real upgrade cadence.',
    },
  ];

  const notes = [`Observed avg stability (recent): ${avgStability ?? 'N/A'}/100.`];
  if (topDriver) notes.push(`Most common risk driver: ${topDriver}.`);
  if (topMitigation) notes.push(`Most used mitigation: ${topMitigation}.`);
  if (topScenario) notes.push(`Most used scenario: ${topScenario}.`);
  if (topAction) notes.push(`Most common action outcome: ${topAction}.`);

  return {
    version: 'zgm_playbook_v1',
    generated_at: new Date().toISOString(),
    summary: { avgStability, topDriver, topMitigation, topScenario, topAction },
    notes,
    rules,
  };
}

function applyPlaybookRule(ruleId) {
  if (!lastPlaybook) return;
  const rule = (lastPlaybook.rules || []).find((r) => r.id === ruleId);
  if (!rule) return;

  decisionMeta = decisionMeta || { mitigations: [], profileLoaded: null };
  decisionMeta.playbookRule = ruleId;
  window.__LAST_DECISION_META__ = decisionMeta;

  if (rule.suggested_profile && BUILTIN_PROFILES[rule.suggested_profile]) {
    applyWeights(BUILTIN_PROFILES[rule.suggested_profile].weights, 'playbook_profile');
    decisionMeta.profileLoaded = BUILTIN_PROFILES[rule.suggested_profile].name;
  }

  if (rule.suggested_scenario && FORECAST_SCENARIOS[rule.suggested_scenario]) {
    $('forecastScenario').value = rule.suggested_scenario;
  }

  for (const action of rule.recommended_actions || []) {
    switch (action) {
      case 'mitigate_refurb_path':
        decisionMeta.mitigations.push('refurb_path');
        break;
      case 'mitigate_raise_durability': {
        const d = Number($('w_durability').value);
        $('w_durability').value = String(Math.min(d + 2, 10));
        break;
      }
      case 'mitigate_reduce_lockin': {
        const f = Number($('w_freedom').value);
        $('w_freedom').value = String(Math.min(f + 2, 10));
        decisionMeta.mitigations.push('reduce_lockin');
        break;
      }
      case 'increase_holding_years':
        $('forecastScenario').value = 'long_term_keeper';
        decisionMeta.mitigations.push('increase_holding');
        break;
      default:
        break;
    }
  }
  readWeights();
  runDecision().catch((err) => window.alert(`Apply Rule failed: ${err.message}`));
}

function buildDecisionSeal(report) {
  const user = getUser() || null;
  const scope = getCurrentScope();
  const weights = getCurrentWeightsObject();
  const meta = decisionMeta || {};
  const scenarioKey = $('forecastScenario')?.value || 'normal';

  return {
    artifact_type: 'zgm_decision_seal',
    artifact_version: 'v1',
    created_at: new Date().toISOString(),
    subject: { user_id: user?.id || 'guest' },
    scope,
    inputs: { weights, scenario_key: scenarioKey },
    pricing: report?.pricing || null,
    recommendation: report?.recommendation || null,
    scores: report?.scores || null,
    weighted: report?._weighted || null,
    forecast: report?.forecast || null,
    stability: report?.stability || null,
    narrative: report?.narrative || null,
    decision_meta: {
      mitigations: meta.mitigations || [],
      profileLoaded: meta.profileLoaded || null,
      playbookRule: meta.playbookRule || null,
    },
    assumptions: {
      pricing_policy: 'Compliant APIs or transparent fallback estimator; source + timestamp shown.',
      adaptive_weights_policy: 'Suggestions only; never auto-applied.',
      forecast_policy: 'Deterministic heuristics; assumptions listed in forecast.assumptions.',
      stability_policy: 'Stress test sweep with bounded runs; index derived from flip rate.',
    },
  };
}

function addSealToLedger(seal) {
  const ledger = getSealLedger();
  const scope = seal.scope || getCurrentScope();
  ledger.push({
    id: crypto?.randomUUID?.() || `${Date.now()}`,
    created_at: seal.created_at,
    action: seal.recommendation?.action || 'unknown',
    stability: seal.stability?.stabilityIndex ?? null,
    scenario: seal.inputs?.scenario_key ?? 'unknown',
    playbookRule: seal.decision_meta?.playbookRule ?? null,
    hash: seal.seal?.canonical_json_sha256 ?? null,
    scope,
    verify_status: 'unverified',
  });
  saveSealLedger(ledger.slice(-500));
  renderExecutivePanel();
}

function renderLedger(filterText = '') {
  const ledger = getSealLedger();
  const normalized = String(filterText || '').toLowerCase();
  const filtered = ledger.filter((entry) =>
    JSON.stringify(entry).toLowerCase().includes(normalized)
  );
  $('ledgerPanel').textContent = filtered.length
    ? JSON.stringify(filtered, null, 2)
    : 'No ledger entries.';
  renderExecutivePanel();
}

async function verifySealObject(sealObj) {
  if (!sealObj?.seal?.canonical_json_sha256) {
    return { status: 'invalid_format', message: 'Seal does not contain canonical_json_sha256.' };
  }
  const originalHash = sealObj.seal.canonical_json_sha256;
  const payloadWithoutSeal = { ...sealObj };
  delete payloadWithoutSeal.seal;
  const recomputedHash = await sha256Hex(canonicalJSONStringify(payloadWithoutSeal));
  const verified = originalHash === recomputedHash;
  return { status: verified ? 'verified' : 'tampered', originalHash, recomputedHash, verified };
}

async function exportAuditBundle() {
  const mem = getDecisionMemory();
  const ledger = getSealLedger();
  const playbook = lastPlaybook || buildPlaybook(mem);
  const latestSeal = lastSeal || null;

  const files = {
    decision_memory: mem,
    seal_ledger: ledger,
    latest_playbook: playbook,
    latest_seal: latestSeal,
  };

  const manifest = {
    artifact_type: 'zgm_audit_bundle',
    version: 'v1',
    generated_at: new Date().toISOString(),
    scope: getCurrentScope(),
    file_hashes: {},
  };

  for (const [name, value] of Object.entries(files)) {
    manifest.file_hashes[name] = await sha256Hex(canonicalJSONStringify(value));
  }

  const bundle = { manifest, files };
  downloadJson(`zgm_audit_bundle_${new Date().toISOString().slice(0, 10)}.json`, bundle);
}

function recordDecisionSession(report, meta = {}) {
  const memory = getDecisionMemory();
  const scope = getCurrentScope();
  memory.push({
    id: `${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    action: report?.recommendation?.action || 'unknown',
    confidence: report?.recommendation?.confidence ?? null,
    stabilityIndex: report?.stability?.stabilityIndex ?? null,
    flipRate: report?.stability?.flipRate ?? null,
    riskLevel: report?.stability?.riskLevel ?? null,
    topDrivers: report?.stability?.topDrivers || [],
    scenario: report?.forecast?.scenario || 'unknown',
    holdingYears: report?.forecast?.tco?.holding_years ?? null,
    tcoTotal: report?.forecast?.tco?.total_eur ?? null,
    priceUsed:
      report?.pricing?.selected?.price ??
      report?.pricing?.fallback_estimator?.estimated_price ??
      null,
    priceSource: report?.pricing?.selected?.source || 'fallback_estimator',
    mitigations: meta.mitigations || [],
    profileLoaded: meta.profileLoaded || null,
    playbookRule: meta.playbookRule || null,
    scope,
  });
  saveDecisionMemory(memory.slice(-200));
  renderDecisionInsights();
  renderExecutivePanel();
}

async function buildReport(context, overrides = {}) {
  const { fromDevice, fromProfile, toProfile, inputs } = context;
  let pricingBundle = clone(
    overrides.pricingBundleOverride || buildFallbackPricingBundle(toProfile)
  );
  if (overrides.forceRefurb && Number.isFinite(pricingBundle?.selected?.price)) {
    pricingBundle.selected.price = Math.round(pricingBundle.selected.price * 0.85);
    pricingBundle.selected.source = 'refurb_override';
    pricingBundle.selected.strategy = 'mitigation_refurb';
  }

  const report = generateSwitchingReport({
    userId: currentUserId(),
    fromDevice,
    fromProfile,
    toProfile,
    baseline,
    inputs,
    pricingBundle,
  });

  const weighted = computeWeightedSwitchScore({
    baseReport: report,
    fromProfile,
    toProfile,
    baseline,
    inputs,
  });
  const decision = decideActionFromWeightedScore({ weightedScore: weighted, baseReport: report });
  report._weighted = weighted;
  report.partner_link = getPartnerLink(toProfile);
  report.recommendation.action = decision.action;
  report.recommendation.confidence = decision.confidence;
  report.recommendation.reason_codes = Array.from(
    new Set([...(report.recommendation.reason_codes || []), ...(decision.reason_codes || [])])
  );
  report.recommendation.plain_summary += ` • Weighted score: ${weighted.final_score}/100`;

  report.forecast = forecastDecisionImpact({
    pricingBundle: report.pricing,
    toProfile,
    baseReport: report,
    scenario: overrides.scenarioOverride || getSelectedScenario(),
  });

  if (!overrides.skipStability) {
    report.stability = await computeStability({
      baseReport: report,
      maxRuns: 60,
      recomputeFn: async ({ pricingBundleOverride, scenarioOverride }) =>
        buildReport(context, { pricingBundleOverride, scenarioOverride, skipStability: true }),
    });
  }

  report.narrative = buildDecisionNarrative(report);
  return report;
}

async function runDecision(overrides = {}) {
  const fromProfile = profiles.find((p) => p.id === $('fromProfile').value);
  const toProfile = profiles.find((p) => p.id === $('toProfile').value);
  if (!fromProfile || !toProfile) return;

  const fromDevice = {
    id: `device_${Date.now()}`,
    estimated_price_eur: Number($('paid').value || 0),
    usage: {
      intensity: $('intensity').value,
      battery_health_percent: Number($('battery').value || 100),
    },
  };
  const inputs = {
    budget_eur: Number($('budget').value || 0),
    time_horizon_months: 12,
    primary_role: $('primaryRole').value,
    priority_weights: readWeights(),
  };

  const report = await buildReport({ fromDevice, fromProfile, toProfile, inputs }, overrides);
  lastReport = report;
  window.__LAST_REPORT__ = report;
  $('output').textContent = JSON.stringify(report, null, 2);
  $('narrativePanel').textContent = report.narrative || '';
  renderStability(report);
  renderHeatmap(report);
  renderExecutivePanel();

  const user = getUser();
  if (user) {
    const history = getHistory(user.id);
    history.push(report);
    setHistory(user.id, history.slice(-300));
  }

  recordDecisionSession(report, decisionMeta);
  decisionMeta = { mitigations: [], profileLoaded: null, playbookRule: null };
  window.__LAST_DECISION_META__ = decisionMeta;
  renderHistory();
  renderExecutivePanel();
}

function wireEvents() {
  $('loginBtn').addEventListener('click', () => {
    const name = $('loginName').value.trim();
    if (!name) return;
    setUser({ id: `user_${name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`, name });
    renderHeaderChips();
    renderHistory();
    renderExecutivePanel();
  });

  $('logoutBtn').addEventListener('click', () => {
    clearUser();
    renderHeaderChips();
    $('output').textContent = '';
    $('narrativePanel').textContent = '';
    renderHistory();
    renderExecutivePanel();
  });

  $('toggleAdminBtn').addEventListener('click', () => {
    setAdmin(!isAdmin());
    renderHeaderChips();
    adminPanelVisible();
    renderExecutivePanel();
  });

  $('adaptToggleBtn').addEventListener('click', () => {
    setAdaptive(!isAdaptive());
    renderHeaderChips();
    $('adaptLog').textContent = isAdaptive() ? 'Adaptive mode enabled.' : 'Adaptive mode disabled.';
  });

  $('suggestBtn').addEventListener('click', () => {
    if (!isAdaptive()) {
      $('adaptLog').textContent = 'Enable Adaptive mode first.';
      return;
    }
    const user = getUser();
    const reports = user
      ? getHistory(user.id)
          .slice()
          .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
      : [];
    lastSuggestion = suggestWeights({ reports, currentWeights: readWeights() });
    $('adaptLog').textContent = JSON.stringify(lastSuggestion, null, 2);
  });

  $('applySuggestionBtn').addEventListener('click', () => {
    if (!lastSuggestion?.weights) {
      $('adaptLog').textContent = 'No suggestion available.';
      return;
    }
    applyWeights(lastSuggestion.weights, 'adaptive');
  });

  $('clearWeightHistoryBtn').addEventListener('click', () => {
    localStorage.removeItem(LS.weightHistory);
    renderWeightHistory();
    renderWeightEvolution();
  });
  $('refreshWeightVizBtn').addEventListener('click', renderWeightEvolution);
  $('weightWindow').addEventListener('change', renderWeightEvolution);

  $('loadProfileBtn').addEventListener('click', () => {
    const val = $('profileSelect').value;
    const profile = val.startsWith('custom:')
      ? getCustomProfiles()[val.replace('custom:', '')]
      : BUILTIN_PROFILES[val];
    if (!profile) return;
    applyWeights(profile.weights, 'profile');
    decisionMeta.profileLoaded = profile.name;
    window.__LAST_DECISION_META__ = decisionMeta;
    $('profileInfo').textContent = `Loaded profile: ${profile.name} (snapshot saved)`;
  });

  $('saveCustomProfileBtn').addEventListener('click', () => {
    const name = $('customProfileName').value.trim();
    if (!name) return;
    const custom = getCustomProfiles();
    const key = name.toLowerCase().replace(/\s+/g, '_');
    custom[key] = { name, weights: getCurrentWeightsObject() };
    saveCustomProfiles(custom);
    renderProfileDropdown();
    $('profileInfo').textContent = `Saved custom profile: ${name}`;
  });

  $('analyzeBehaviorBtn').addEventListener('click', () => {
    const user = getUser();
    const reports = user
      ? getHistory(user.id)
          .slice()
          .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
      : [];
    lastProfileSuggestion = suggestProfile({ reports });
    $('behaviorLog').textContent = JSON.stringify(lastProfileSuggestion, null, 2);
  });

  $('applySuggestedProfileBtn').addEventListener('click', () => {
    const profile = BUILTIN_PROFILES[lastProfileSuggestion?.suggestion];
    if (!profile) {
      $('behaviorLog').textContent = 'No suggestion available.';
      return;
    }
    applyWeights(profile.weights, 'behavior_profile');
    decisionMeta.profileLoaded = profile.name;
    window.__LAST_DECISION_META__ = decisionMeta;
    $('behaviorLog').textContent += '\n\nProfile applied.';
  });

  $('editProfile').addEventListener('change', () =>
    loadProfileToEditor(profiles.find((x) => x.id === $('editProfile').value))
  );

  $('newProfileBtn').addEventListener('click', () => {
    if (!isAdmin()) return;
    loadProfileToEditor({
      id: `local_profile_${Date.now()}`,
      brand: 'Local',
      ecosystem: 'Other',
      category: 'other',
      model_name: 'New Profile',
      released_year: new Date().getFullYear(),
      metrics: {
        customization: 5,
        lock_in: 5,
        repairability: 5,
        resale_retention: 50,
        privacy_posture: 'unknown',
        durability: 5,
        software_support_years: 4,
        accessibility: 5,
        enterprise_readiness: 5,
      },
    });
  });

  $('saveProfileBtn').addEventListener('click', () => {
    if (!isAdmin()) return;
    const p = readProfileFromEditor();
    const overrides = getProfileOverrides();
    const idx = overrides.findIndex((x) => x.id === p.id);
    if (idx >= 0) overrides[idx] = p;
    else overrides.push(p);
    setProfileOverrides(overrides);
    profiles = mergeProfiles(baseProfiles);
    renderProfiles();
    $('editProfile').value = p.id;
    loadProfileToEditor(p);
    window.alert('Saved locally.');
  });

  $('deleteProfileBtn').addEventListener('click', () => {
    if (!isAdmin()) return;
    setProfileOverrides(getProfileOverrides().filter((x) => x.id !== $('p_id').value.trim()));
    profiles = mergeProfiles(baseProfiles);
    renderProfiles();
    loadProfileToEditor(profiles[0]);
  });

  $('exportProfilesBtn').addEventListener('click', () => {
    if (!isAdmin()) return;
    downloadJson('zgm_profiles_export.json', { exported_at: new Date().toISOString(), profiles });
  });

  $('importProfilesFile').addEventListener('change', async (event) => {
    if (!isAdmin()) return;
    const file = event.target.files?.[0];
    if (!file) return;
    const parsed = parseJson(await file.text(), null);
    const imported = Array.isArray(parsed) ? parsed : parsed?.profiles;
    if (!Array.isArray(imported)) {
      window.alert('Import failed. Expected array or {profiles:[...]}');
      return;
    }
    setProfileOverrides(imported);
    profiles = mergeProfiles(baseProfiles);
    renderProfiles();
    loadProfileToEditor(profiles[0]);
  });

  $('runBtn').addEventListener('click', async () => {
    $('runBtn').disabled = true;
    try {
      await runDecision();
    } finally {
      $('runBtn').disabled = false;
    }
  });

  $('clearBtn').addEventListener('click', () => {
    const user = getUser();
    if (!user) return;
    setHistory(user.id, []);
    $('output').textContent = '';
    $('narrativePanel').textContent = '';
    renderHistory();
  });

  $('exportPdfBtn').addEventListener('click', () => {
    const content = $('output').textContent;
    if (!content) {
      window.alert('No report to export.');
      return;
    }
    const popup = window.open('', '_blank');
    if (!popup) return;
    popup.document.write(`
      <html><head><title>Z-Mirror Report</title>
      <style>body{font-family:Consolas,monospace;padding:20px;}pre{white-space:pre-wrap;}</style>
      </head><body><h2>Z-Gadget Mirrors - Switching Report</h2><pre>${content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre></body></html>`);
    popup.document.close();
    popup.print();
  });

  $('mitigateRefurbBtn').addEventListener('click', async () => {
    decisionMeta.mitigations.push('refurb_path');
    window.__LAST_DECISION_META__ = decisionMeta;
    $('runBtn').disabled = true;
    try {
      await runDecision({ forceRefurb: true });
    } finally {
      $('runBtn').disabled = false;
    }
  });
  $('mitigateHoldingBtn').addEventListener('click', async () => {
    decisionMeta.mitigations.push('increase_holding');
    window.__LAST_DECISION_META__ = decisionMeta;
    $('forecastScenario').value = 'long_term_keeper';
    $('runBtn').disabled = true;
    try {
      await runDecision();
    } finally {
      $('runBtn').disabled = false;
    }
  });
  $('mitigateLockInBtn').addEventListener('click', async () => {
    decisionMeta.mitigations.push('reduce_lockin');
    window.__LAST_DECISION_META__ = decisionMeta;
    const current = Number($('w_freedom').value);
    applyWeights(
      { ...getCurrentWeightsObject(), freedom: Math.min(current + 2, 10) },
      'mitigation_lockin'
    );
    $('runBtn').disabled = true;
    try {
      await runDecision();
    } finally {
      $('runBtn').disabled = false;
    }
  });
  $('mitigateDurabilityBtn').addEventListener('click', async () => {
    decisionMeta.mitigations.push('raise_durability');
    window.__LAST_DECISION_META__ = decisionMeta;
    const current = Number($('w_durability').value);
    applyWeights(
      { ...getCurrentWeightsObject(), durability: Math.min(current + 2, 10) },
      'mitigation_durability'
    );
    $('runBtn').disabled = true;
    try {
      await runDecision();
    } finally {
      $('runBtn').disabled = false;
    }
  });

  $('refreshInsightsBtn').addEventListener('click', renderDecisionInsights);
  $('clearDecisionMemoryBtn').addEventListener('click', () => {
    localStorage.removeItem(LS.decisionMemory);
    renderDecisionInsights();
  });
  $('exportDecisionMemoryBtn').addEventListener('click', () => {
    downloadJson(
      `zgm_decision_memory_${new Date().toISOString().slice(0, 10)}.json`,
      getDecisionMemory()
    );
  });

  $('generatePlaybookBtn').addEventListener('click', () => {
    lastPlaybook = buildPlaybook(getDecisionMemory());
    const ruleSelect = $('playbookRuleSelect');
    ruleSelect.innerHTML = '';
    (lastPlaybook.rules || []).forEach((rule) => {
      ruleSelect.appendChild(option(rule.id, rule.id));
    });
    $('playbookPanel').textContent = JSON.stringify(lastPlaybook, null, 2);
  });

  $('exportPlaybookBtn').addEventListener('click', () => {
    if (!lastPlaybook) {
      $('playbookPanel').textContent = 'Generate the playbook first.';
      return;
    }
    downloadJson(`zgm_playbook_${new Date().toISOString().slice(0, 10)}.json`, lastPlaybook);
  });

  $('applyPlaybookRuleBtn').addEventListener('click', () => {
    const ruleId = $('playbookRuleSelect').value;
    applyPlaybookRule(ruleId);
  });

  $('generateSealBtn').addEventListener('click', async () => {
    if (!lastReport) {
      $('sealPanel').textContent = 'Run a decision first to generate a seal.';
      return;
    }
    const payload = buildDecisionSeal(lastReport);
    const hash = await sha256Hex(canonicalJSONStringify(payload));
    lastSeal = { ...payload, seal: { algorithm: 'SHA-256', canonical_json_sha256: hash } };
    $('sealPanel').textContent = JSON.stringify(lastSeal, null, 2);
    addSealToLedger(lastSeal);
    renderLedger($('ledgerSearchInput')?.value || '');
  });

  $('exportSealBtn').addEventListener('click', () => {
    if (!lastSeal) {
      $('sealPanel').textContent = 'Generate the seal first.';
      return;
    }
    downloadJson(`zgm_decision_seal_${new Date().toISOString().slice(0, 10)}.json`, lastSeal);
  });

  $('refreshLedgerBtn').addEventListener('click', () =>
    renderLedger($('ledgerSearchInput')?.value || '')
  );
  $('ledgerSearchInput').addEventListener('input', (e) => renderLedger(e.target.value));
  $('clearLedgerBtn').addEventListener('click', () => {
    localStorage.removeItem(LS.sealLedger);
    renderLedger();
  });
  $('exportLedgerBtn').addEventListener('click', () => {
    downloadJson(`zgm_seal_ledger_${new Date().toISOString().slice(0, 10)}.json`, getSealLedger());
  });

  $('verifySealBtn').addEventListener('click', async () => {
    const fileInput = $('verifySealInput');
    const panel = $('verifySealPanel');
    if (!fileInput.files.length) {
      panel.textContent = 'Please select a seal JSON file.';
      return;
    }
    const text = await fileInput.files[0].text();
    try {
      const parsed = JSON.parse(text);
      const result = await verifySealObject(parsed);
      if (result.status === 'verified') {
        panel.textContent = `✅ VERIFIED\n\nOriginal Hash:   ${result.originalHash}\nRecomputed Hash: ${result.recomputedHash}`;
      } else if (result.status === 'tampered') {
        panel.textContent = `❌ TAMPERED OR MODIFIED\n\nOriginal Hash:   ${result.originalHash}\nRecomputed Hash: ${result.recomputedHash}`;
      } else {
        panel.textContent = result.message || 'Invalid seal format.';
      }

      if (parsed?.seal?.canonical_json_sha256) {
        const hash = parsed.seal.canonical_json_sha256;
        const ledger = getSealLedger();
        let changed = false;
        const updated = ledger.map((entry) => {
          if (entry.hash === hash) {
            changed = true;
            return { ...entry, verify_status: result.status };
          }
          return entry;
        });
        if (changed) {
          saveSealLedger(updated);
          renderLedger($('ledgerSearchInput')?.value || '');
        } else {
          renderExecutivePanel();
        }
      } else {
        renderExecutivePanel();
      }
    } catch (err) {
      panel.textContent = `Error parsing file: ${err.message}`;
    }
  });

  $('exportAuditBundleBtn').addEventListener('click', () => {
    exportAuditBundle().catch((err) => {
      window.alert(`Audit bundle export failed: ${err.message}`);
    });
  });
}

async function init() {
  baseProfiles = await loadJson('../mirror_decision_engine/data/device_profiles.sample.json');
  baseline = await loadJson('../mirror_decision_engine/data/sustainability_baselines.sample.json');
  profiles = mergeProfiles(baseProfiles);
  renderProfiles();
  renderProfileDropdown();
  renderScenarioDropdown();
  setWeightListeners();
  wireEvents();
  renderHeaderChips();
  renderPhaseStatusRail();
  renderGuardrailRow();
  adminPanelVisible();
  loadProfileToEditor(profiles[0]);
  renderHistory();
  renderWeightHistory();
  renderWeightEvolution();
  renderDecisionInsights();
  lastPlaybook = buildPlaybook(getDecisionMemory());
  $('playbookPanel').textContent = JSON.stringify(lastPlaybook, null, 2);
  $('playbookRuleSelect').innerHTML = '';
  (lastPlaybook.rules || []).forEach((rule) =>
    $('playbookRuleSelect').appendChild(option(rule.id, rule.id))
  );
  renderLedger();
  renderExecutivePanel();
  window.__LAST_REPORT__ = lastReport;
  window.__LAST_DECISION_META__ = decisionMeta;
}

init().catch((err) => {
  console.error(err);
  window.alert(`Init error: ${err.message}`);
});
