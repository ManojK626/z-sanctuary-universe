#!/usr/bin/env node
/**
 * Z-PC-ACTIVATION-AWARENESS-1 — Manual operator activation receipt (PowerShell / hub route awareness).
 * Writes only data/reports/z_pc_activation_receipt.{json,md}.
 * Does not run verify pipelines, npm scripts, deploy, merge, scan disks, or touch NAS/secrets.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.cwd();

const POLICY = path.join(ROOT, 'data', 'z_pc_activation_awareness_policy.json');
const PKG = path.join(ROOT, 'package.json');
const GROWTH = path.join(ROOT, 'data', 'z_ecosystem_growth_stage_registry.json');
const R_TRAFFIC = path.join(ROOT, 'data', 'reports', 'z_traffic_minibots_status.json');
const R_CYCLE = path.join(ROOT, 'data', 'reports', 'z_cycle_observe_status.json');
const R_DRIFT = path.join(ROOT, 'data', 'reports', 'z_crystal_dna_drift_report.json');
const R_ANY = path.join(ROOT, 'data', 'reports', 'z_anydevice_simulation_report.json');

const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_pc_activation_receipt.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_pc_activation_receipt.md');
const SCHEMA = 'z_pc_activation_receipt_v1';

function readJsonSafe(p) {
  try {
    return { ok: true, data: JSON.parse(fs.readFileSync(p, 'utf8')), path: p };
  } catch (e) {
    return { ok: false, error: String(e?.message || e), path: p };
  }
}

function git(args) {
  const r = spawnSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 4 * 1024 * 1024,
  });
  return {
    ok: r.status === 0,
    stdout: String(r.stdout || '').trim(),
    stderr: String(r.stderr || '').trim(),
    status: r.status,
  };
}

function summarizePorcelain(text) {
  const lines = String(text || '')
    .split(/\r?\n/)
    .filter(Boolean);
  return {
    line_count: lines.length,
    first_paths: lines.slice(0, 12).map((l) => (l.length > 3 ? l.slice(3).trim() : l)),
  };
}

function listPhaseReceipts() {
  const docsDir = path.join(ROOT, 'docs');
  if (!fs.existsSync(docsDir)) return [];
  const names = fs.readdirSync(docsDir);
  return names
    .filter((n) => /^PHASE_.*GREEN_RECEIPT\.md$/i.test(n))
    .map((n) => {
      const p = path.join(docsDir, n);
      const st = fs.statSync(p);
      return { file: `docs/${n}`, mtime: st.mtime.toISOString(), bytes: st.size };
    })
    .sort((a, b) => (a.mtime < b.mtime ? 1 : -1))
    .slice(0, 48);
}

function verifyScriptSample(pkg) {
  const scripts = pkg?.scripts && typeof pkg.scripts === 'object' ? pkg.scripts : {};
  const keys = Object.keys(scripts);
  const pick = keys.filter((n) => {
    const c = String(scripts[n] || '');
    if (/^verify:/i.test(n)) return true;
    if (
      [
        'z:traffic',
        'z:car2',
        'z:crystal:dna:drift',
        'z:anydevice:simulate',
        'z:cycle:observe',
        'z:pc:activation',
        'z:deployment:readiness',
      ].includes(n)
    )
      return true;
    if (/z_registry_omni_verify|z_sanctuary_structure_verify|dashboard:registry-verify/i.test(c))
      return true;
    return false;
  });
  return pick.sort().slice(0, 80);
}

function signalSummary() {
  const traffic = readJsonSafe(R_TRAFFIC);
  const cycle = readJsonSafe(R_CYCLE);
  const drift = readJsonSafe(R_DRIFT);
  const anyd = readJsonSafe(R_ANY);
  return {
    z_traffic_minibots_status: traffic.ok
      ? { overall_signal: traffic.data.overall_signal ?? null, ok: traffic.data.ok ?? null }
      : { missing: true },
    z_cycle_observe_status: cycle.ok
      ? {
          overall_observer_signal: cycle.data.overall_observer_signal ?? null,
          task_queue_length: Array.isArray(cycle.data.task_queue)
            ? cycle.data.task_queue.length
            : null,
        }
      : { missing: true },
    z_crystal_dna_drift_report: drift.ok
      ? {
          overall_signal: drift.data.overall_signal ?? null,
          findings_count: drift.data.findings_count ?? null,
        }
      : { missing: true },
    z_anydevice_simulation_report: anyd.ok
      ? {
          simulations: anyd.data.simulations?.length ?? 0,
          warnings: anyd.data.warnings?.length ?? 0,
        }
      : { missing: true },
  };
}

function main() {
  const generated_at = new Date().toISOString();
  const policyR = readJsonSafe(POLICY);
  if (!policyR.ok) {
    console.error(JSON.stringify({ ok: false, error: policyR.error }));
    process.exit(1);
  }
  const policy = policyR.data;

  const branch = git(['branch', '--show-current']);
  const head = git(['rev-parse', 'HEAD']);
  const porcelain = git(['status', '--porcelain']);

  const pkgR = readJsonSafe(PKG);
  const growthR = readJsonSafe(GROWTH);
  const growth = growthR.ok ? growthR.data : null;
  const sealed = Array.isArray(growth?.sealed_systems) ? growth.sealed_systems : [];
  const sealed_labels = sealed.map((s) => s.phase_label || s.id).filter(Boolean);

  const receipt = {
    schema: SCHEMA,
    phase: 'Z-PC-ACTIVATION-AWARENESS-1',
    generated_at,
    law: 'Manual activation receipt only. No watcher, no auto-verify, no deploy, no merge, no secrets, no NAS mutation.',
    policy_ref: 'data/z_pc_activation_awareness_policy.json',
    git: {
      branch_ok: branch.ok,
      branch: branch.ok ? branch.stdout : null,
      head_ok: head.ok,
      head: head.ok ? head.stdout : null,
      status_ok: porcelain.ok,
      porcelain_raw: porcelain.ok ? porcelain.stdout : null,
      porcelain_summary: porcelain.ok ? summarizePorcelain(porcelain.stdout) : null,
    },
    phase_receipt_files: listPhaseReceipts(),
    verify_scripts_sample: pkgR.ok ? verifyScriptSample(pkgR.data) : [],
    latest_report_signals: signalSummary(),
    sealed_systems_summary: {
      count: sealed.length,
      labels: sealed_labels.slice(0, 24),
    },
    turtle_mode_posture: policy.turtle_mode_posture || '',
    future_symbolic_metaphors_docs_only: policy.future_symbolic_metaphors_docs_only || {},
    warnings: [],
  };

  if (!branch.ok)
    receipt.warnings.push({ code: 'git_branch', detail: branch.stderr || 'git branch failed' });
  if (!head.ok)
    receipt.warnings.push({ code: 'git_head', detail: head.stderr || 'git rev-parse failed' });
  if (!porcelain.ok)
    receipt.warnings.push({ code: 'git_status', detail: porcelain.stderr || 'git status failed' });

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(receipt, null, 2), 'utf8');

  const md = [
    '# Z-PC activation receipt',
    '',
    `**Generated:** ${generated_at}`,
    `**Schema:** \`${SCHEMA}\``,
    '',
    '## Law',
    '',
    receipt.law,
    '',
    '## Git (local hub)',
    '',
    `- **branch:** \`${receipt.git.branch || '—'}\` ${receipt.git.branch_ok ? '' : '(unavailable)'}`,
    `- **HEAD:** \`${receipt.git.head ? receipt.git.head.slice(0, 12) : '—'}\` ${receipt.git.head_ok ? '' : '(unavailable)'}`,
    `- **working tree:** ${receipt.git.porcelain_summary ? receipt.git.porcelain_summary.line_count + ' porcelain line(s)' : '—'}`,
    '',
    '## Phase receipts (latest first, sample)',
    '',
    ...receipt.phase_receipt_files.slice(0, 15).map((p) => `- \`${p.file}\` · ${p.mtime}`),
    '',
    '## Report signals (read from disk at receipt time; script did not run verify)',
    '',
    '```json',
    JSON.stringify(receipt.latest_report_signals, null, 2),
    '```',
    '',
    '## Sealed systems (from growth registry)',
    '',
    `- **count:** ${receipt.sealed_systems_summary.count}`,
    `- **sample:** ${receipt.sealed_systems_summary.labels.join(', ') || '—'}`,
    '',
    '## Turtle Mode posture',
    '',
    receipt.turtle_mode_posture || '_See policy JSON._',
    '',
    '## Future symbolic metaphors (docs/registry only)',
    '',
    '- **Mango Tree** — fruitful project knowledge and growth receipts (metaphor only).',
    '- **Starzan Tree** — star-map / cosmic relation memory (metaphor only).',
    '',
    'Full JSON: `data/reports/z_pc_activation_receipt.json`',
    '',
  ].join('\n');

  fs.writeFileSync(OUT_MD, md, 'utf8');

  console.log(
    JSON.stringify(
      {
        ok: true,
        branch: receipt.git.branch,
        warnings: receipt.warnings.length,
        out_json: OUT_JSON,
        out_md: OUT_MD,
      },
      null,
      2
    )
  );
}

main();
