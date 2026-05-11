#!/usr/bin/env node
/**
 * Z AI Ecosphere ledger — SSWS, Z-Mega/QOSMEI formulas, AI Tower, shadow/minibots.
 * Reads existing hub reports; writes data/reports/z_ai_ecosphere_ledger.json + .md
 * Task logs (append-only): creator + business JSONL → merged stats + CSV via z_ai_task_log_export_csv.mjs.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'data', 'reports', 'z_ai_ecosphere_ledger.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_ai_ecosphere_ledger.md');

function readJson(p, fb = null) {
  try {
    if (!fs.existsSync(p)) return fb;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fb;
  }
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function bandFromPct(pct) {
  const p = Number(pct);
  if (Number.isNaN(p)) return { band: 'gray', potential_label: 'unknown', color: '#78909c' };
  if (p >= 80) return { band: 'green', potential_label: 'high potential', color: '#66bb6a' };
  if (p >= 55) return { band: 'yellow', potential_label: 'developing', color: '#ffca28' };
  return { band: 'red', potential_label: 'needs attention', color: '#ef5350' };
}

function avgScores(scores) {
  if (!scores || typeof scores !== 'object') return null;
  const vals = Object.values(scores).filter((v) => typeof v === 'number' && !Number.isNaN(v));
  if (!vals.length) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function tsSortKey(e) {
  const t = e.ts || e.timestamp;
  if (!t) return 0;
  const n = Date.parse(t);
  return Number.isNaN(n) ? 0 : n;
}

function readTaskLogFile(logPath, namespace) {
  const entries = [];
  if (!fs.existsSync(logPath)) return entries;
  const raw = fs.readFileSync(logPath, 'utf8');
  for (const line of raw.split(/\r?\n/).filter((l) => l.trim())) {
    try {
      const o = JSON.parse(line);
      if (!o.task && typeof o.rating_pct !== 'number') continue;
      entries.push({ ...o, namespace: o.namespace || namespace });
    } catch {
      /* skip */
    }
  }
  return entries;
}

function statsForEntries(entries) {
  const rated = entries.filter((e) => typeof e.rating_pct === 'number');
  const avg_rating_pct =
    rated.length > 0
      ? Number((rated.reduce((s, e) => s + e.rating_pct, 0) / rated.length).toFixed(1))
      : null;
  const by_actor_class = {};
  for (const e of entries) {
    const k = String(e.actor_class || 'unknown');
    by_actor_class[k] = (by_actor_class[k] || 0) + 1;
  }
  return {
    count: entries.length,
    avg_rating_pct,
    by_actor_class,
  };
}

function mergeTaskLogs(creatorPath, businessPath) {
  const creator = readTaskLogFile(creatorPath, 'creator');
  const business = readTaskLogFile(businessPath, 'business');
  const combined = [...creator, ...business];
  combined.sort((a, b) => tsSortKey(b) - tsSortKey(a));
  const sc = statsForEntries(combined);
  return {
    log_files: {
      creator: 'data/logs/z_ai_task_accomplishments.jsonl',
      business: 'data/logs/z_ai_task_accomplishments_business.jsonl',
      csv_export: 'data/reports/z_ai_task_accomplishments.csv',
    },
    by_namespace: {
      creator: statsForEntries(creator),
      business: statsForEntries(business),
    },
    combined: {
      total_entries: sc.count,
      avg_rating_pct: sc.avg_rating_pct,
      by_actor_class: sc.by_actor_class,
    },
    total_entries: sc.count,
    avg_rating_pct: sc.avg_rating_pct,
    by_actor_class: sc.by_actor_class,
    recent_sample: combined.slice(0, 14),
  };
}

function ringSsws(ssws) {
  if (!ssws || typeof ssws !== 'object') {
    return { sync_score: 55, notes: ['SSWS daily report missing — run Z: SSWS Daily Report'] };
  }
  const w = ssws.workspace ? 1 : 0;
  const f = ssws.formula_registry?.count > 0 ? 1 : 0;
  const base = 70 + w * 12 + f * 10;
  return {
    sync_score: clamp(base, 60, 100),
    notes: [`Workspace: ${ssws.workspace || 'n/a'}`, `Formula registry entries: ${ssws.formula_registry?.count ?? 0}`],
  };
}

function ringFormulas(guardian, qosmei) {
  const fp = guardian?.formula_posture;
  const scores = fp?.scores;
  const avg = avgScores(scores);
  const omega = typeof scores?.omega_index === 'number' ? scores.omega_index : avg;
  const pct = omega != null ? clamp(omega, 0, 100) : 62;
  const families = qosmei?.formulaFamilies && typeof qosmei.formulaFamilies === 'object'
    ? Object.keys(qosmei.formulaFamilies)
    : [];
  return {
    sync_score: clamp(pct, 0, 100),
    notes: [
      fp?.posture ? `Formula posture: ${fp.posture}` : 'No formula_posture in guardian report',
      families.length ? `QOSMEI families: ${families.join(', ')}` : 'QOSMEI manifest optional',
    ],
  };
}

function ringTower(aiStatus) {
  const t = aiStatus?.ai_tower;
  const agents = Array.isArray(aiStatus?.agents) ? aiStatus.agents : [];
  const count = typeof t?.agent_count === 'number' ? t.agent_count : agents.length;
  const planned = agents.filter((a) => String(a?.status).toLowerCase() === 'planned').length;
  const score = clamp(45 + count * 12 - planned * 3, 35, 100);
  return {
    sync_score: score,
    notes: [
      `Tower status: ${t?.status || 'n/a'} · agents: ${count}`,
      planned ? `${planned} agent(s) still planned — promote with governance` : 'Agent roster present',
    ],
  };
}

function ringShadowMini(aiStatus, qosmei) {
  const mini = Array.isArray(aiStatus?.miniai) ? aiStatus.miniai : [];
  const online = mini.filter((m) => m?.online).length;
  const miniPct = mini.length ? (online / mini.length) * 100 : 50;
  const ghost = aiStatus?.super_ghost_feed?.status || 'unknown';
  const shadowFamilies = qosmei?.formulaFamilies
    ? Object.values(qosmei.formulaFamilies).filter((f) => f?.shadow).length
    : 0;
  const base = clamp(miniPct * 0.7 + (ghost === 'green' ? 20 : ghost === 'alert' ? 5 : 12) + shadowFamilies * 2, 30, 100);
  return {
    sync_score: clamp(base, 0, 100),
    notes: [
      `Mini-bots online: ${online}/${mini.length || '0'}`,
      `Super ghost feed: ${ghost}`,
      shadowFamilies ? `${shadowFamilies} formula famil(ies) marked shadow in QOSMEI` : 'QOSMEI shadow flags n/a',
    ],
  };
}

function formatPctDelta(num) {
  const n = Number(num || 0);
  if (Number.isNaN(n)) return 'n/a';
  if (n > 0) return `+${n}%`;
  return `${n}%`;
}

function likelyCausesFromGarage(garagePlan, rings) {
  const causes = [];
  const patterns = Array.isArray(garagePlan?.patterns) ? garagePlan.patterns : [];
  const patternText = patterns
    .slice(0, 3)
    .map((p) => (p?.task ? String(p.task) : null))
    .filter(Boolean)
    .join('; ');

  for (const ring of rings) {
    if (ring.sync_score >= 85) continue;
    if (ring.id === 'ai_tower') {
      causes.push({
        ring: ring.ring_title,
        reason: patternText || 'Planned agents and limited production pulses reduce maturity.',
      });
      continue;
    }
    if (ring.id === 'shadow_minibots') {
      causes.push({
        ring: ring.ring_title,
        reason:
          patternText ||
          'Shadow lanes need clearer role/task definitions before promotion signals improve.',
      });
      continue;
    }
    causes.push({
      ring: ring.ring_title,
      reason: patternText || 'Review Z-Garage patterns and project tasks for missing structure.',
    });
  }
  if (!causes.length && patternText) {
    causes.push({
      ring: 'All rings',
      reason: `No low rings currently; track pattern watchlist: ${patternText}`,
    });
  }
  return causes;
}

function main() {
  const generatedAt = new Date().toISOString();
  const sswsPath = path.join(ROOT, 'data', 'reports', 'z_ssws_daily_report.json');
  const ssws = readJson(sswsPath, null);
  const qosmei = readJson(path.join(ROOT, 'data', 'z_qosmei_manifest.json'), null);
  const aiStatus = readJson(path.join(ROOT, 'data', 'reports', 'z_ai_status.json'), null);
  const guardian = readJson(path.join(ROOT, 'data', 'reports', 'z_guardian_report.json'), null);
  const garagePlan = readJson(path.join(ROOT, 'data', 'reports', 'z_garage_upgrade_plan.json'), null);
  const deltaReport = readJson(path.join(ROOT, 'data', 'reports', 'z_ai_ecosphere_delta.json'), null);
  const consistencyAlerts = readJson(
    path.join(ROOT, 'data', 'reports', 'z_ai_consistency_alerts.json'),
    null
  );
  const vaultManifest = readJson(path.join(ROOT, 'data', 'reports', 'z_vault_spine_manifest.json'), null);
  const vault_spine = vaultManifest
    ? {
        present: true,
        status: vaultManifest.status ?? 'unknown',
        spine_files: vaultManifest.totals?.spine_files ?? null,
        links_checked: vaultManifest.totals?.links_checked ?? null,
        broken: vaultManifest.totals?.broken ?? null,
        file: 'data/reports/z_vault_spine_manifest.json',
      }
    : {
        present: false,
        file: 'data/reports/z_vault_spine_manifest.json',
        note: 'Run npm run vault:spine:verify after editing docs/z-vault.',
      };
  const taskCreator = path.join(ROOT, 'data', 'logs', 'z_ai_task_accomplishments.jsonl');
  const taskBusiness = path.join(ROOT, 'data', 'logs', 'z_ai_task_accomplishments_business.jsonl');
  const tasks = mergeTaskLogs(taskCreator, taskBusiness);

  const r1 = ringSsws(ssws);
  const r2 = ringFormulas(guardian, qosmei);
  const r3 = ringTower(aiStatus);
  const r4 = ringShadowMini(aiStatus, qosmei);

  function ringRow(id, ringTitle, score, detail) {
    const b = bandFromPct(score);
    return {
      id,
      ring_title: ringTitle,
      band: b.band,
      potential_label: b.potential_label,
      color: b.color,
      sync_score: Math.round(score),
      detail,
    };
  }

  const rings = [
    ringRow('z_ssws', 'Z-SSWS', r1.sync_score, r1),
    ringRow('z_mega_formulas', 'Z-Mega & formulas', r2.sync_score, r2),
    ringRow('ai_tower', 'AI Tower', r3.sync_score, r3),
    ringRow('shadow_minibots', 'Shadow · mini-bots', r4.sync_score, r4),
  ];

  const overall = rings.reduce((s, x) => s + x.sync_score, 0) / rings.length;
  const ob = bandFromPct(overall);

  const payload = {
    generated_at: generatedAt,
    schema_version: 1,
    governance_note:
      'Advisory ledger only — Hierarchy Chief, DRP, and Enforcer are not overridden. Scores derive from hub JSON reports.',
    config_file: 'data/z_ai_ecosphere_config.json',
    overall: {
      sync_score: Math.round(overall),
      band: ob.band,
      potential_label: ob.potential_label,
      color: ob.color,
    },
    rings,
    task_accomplishments: tasks,
    delta: deltaReport?.delta ?? null,
    consistency_alerts: consistencyAlerts ?? null,
    vault_spine,
    likely_causes: likelyCausesFromGarage(garagePlan, rings),
    links: {
      blueprint_ssws_ai_colony: 'docs/Z-SSWS-ALL-PROJECTS-AND-AI-COLONY-BLUEPRINT.md',
      formulas: 'docs/Z-ULTRA-INSTINCTS-AND-FORMULAS.md',
      qosmei: 'data/z_qosmei_manifest.json',
      delta_report: 'data/reports/z_ai_ecosphere_delta.json',
      consistency_alerts: 'data/reports/z_ai_consistency_alerts.json',
      vault_spine_index: 'docs/z-vault/INDEX.md',
    },
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const md = [
    '# Z AI Ecosphere ledger',
    '',
    `- Generated: ${generatedAt}`,
    `- Overall sync: **${payload.overall.sync_score}%** (${payload.overall.band} — ${payload.overall.potential_label})`,
    '',
    '## Rings',
    ...rings.map(
      (r) =>
        `- **${r.ring_title}** — ${r.sync_score}% · ${r.band} · ${r.potential_label}`
    ),
    '',
    '## Task log (append-only — creator + business)',
    `- Combined: **${tasks.total_entries}** · avg rating: **${tasks.avg_rating_pct ?? 'n/a'}**`,
    `- Creator file: **${tasks.by_namespace.creator.count}** · Business file: **${tasks.by_namespace.business.count}**`,
    `- CSV: \`${tasks.log_files.csv_export}\` — run \`npm run ai:task-log:csv\``,
    '',
    '## Delta (since last run)',
    ...(deltaReport?.delta
      ? [
          deltaReport.delta.first_run
            ? `- ${deltaReport.delta.message || 'First run; no previous snapshot yet.'}`
            : `- Overall sync: **${formatPctDelta(deltaReport.delta.overall_change)}**`,
          deltaReport.delta.first_run
            ? '- New tasks logged: n/a'
            : `- New tasks logged: **${deltaReport.delta.new_tasks >= 0 ? '+' : ''}${deltaReport.delta.new_tasks}**`,
          '',
          '### Ring changes',
          ...(deltaReport.delta.first_run
            ? ['- n/a (first run)']
            : deltaReport.delta.rings
            ? Object.entries(deltaReport.delta.rings).map(
                ([ring, data]) => `- ${ring}: ${formatPctDelta(data?.change)}`
              )
            : ['- n/a']),
        ]
      : [
          '- Delta report not found yet.',
          '- Run `node scripts/z_ai_ecosphere_delta.mjs` after generating the ledger.',
        ]),
    '',
    '## Consistency Alerts',
    ...(Array.isArray(consistencyAlerts?.alerts) && consistencyAlerts.alerts.length
      ? consistencyAlerts.alerts.map(
          (a) => `- [${String(a.severity || 'info').toUpperCase()}] ${a.message}`
        )
      : ['- No consistency alerts (aligned).']),
    '',
    '## Z-Vault spine (doc link health)',
    ...(vault_spine.present
      ? [
          '- Status: **' +
            vault_spine.status +
            '** · files: **' +
            (vault_spine.spine_files ?? 'n/a') +
            '** · links checked: **' +
            (vault_spine.links_checked ?? 'n/a') +
            '** · broken: **' +
            (vault_spine.broken ?? 0) +
            '**',
          '- Index: `docs/z-vault/INDEX.md` · verify: `npm run vault:spine:verify`',
        ]
      : [
          '- ' + (vault_spine.note ?? 'n/a'),
          '- Expected: `' + vault_spine.file + '`',
        ]),
    '',
    '## Likely Causes (from Z-Garage)',
    ...(payload.likely_causes.length
      ? payload.likely_causes.map((c) => `- ${c.ring}: ${c.reason}`)
      : ['- No major pressure-linked causes detected.']),
    '',
    payload.governance_note,
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

  console.log(`✅ Z AI ecosphere ledger: ${OUT}`);
}

main();
