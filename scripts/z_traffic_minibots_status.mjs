#!/usr/bin/env node
/**
 * ZTR-1 — Z-Traffic Minibots: read-only readiness tower (advisory only).
 * Runs existing hub checks, aggregates signals, writes JSON + MD reports.
 * No auto-fix, no deploy, no bridge execution, no provider calls.
 *
 * Usage (hub root):
 *   node scripts/z_traffic_minibots_status.mjs
 *   node scripts/z_traffic_minibots_status.mjs --deep
 *   node scripts/z_traffic_minibots_status.mjs --with-questra
 *   node scripts/z_traffic_minibots_status.mjs --next-lane=registry-json
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_traffic_minibots_status.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_traffic_minibots_status.md');
const SCHEMA = 'z_traffic_minibots_status_v1';

/** Governance-sensitive themes → human / AMK decision (BLUE), not automatic proceed. */
const RISKY_LANE_RULES = [
  { re: /pricing|sku|subscription|tier|billing|payment|checkout/i, category: 'pricing_billing' },
  { re: /entitlement|charter|bridge|live\s*api|provider|oauth|secret/i, category: 'entitlement_bridge_provider' },
  { re: /deploy|production\s*push|cloud\s*publish|cdn|edge\s*worker/i, category: 'deployment' },
  { re: /memory|persistence|cross[\s-]*project[\s-]*memory|user\s*storage|gallery\s*sync/i, category: 'memory_persistence' },
  { re: /voice|gps|geolocation|children|minor|privacy[\s-]*law|deep\s*research/i, category: 'sensitive_surface' },
];

function parseArgs(argv) {
  const args = { deep: false, withQuestra: false, nextLane: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--deep') args.deep = true;
    else if (a === '--with-questra') args.withQuestra = true;
    else if (a.startsWith('--next-lane=')) args.nextLane = a.slice('--next-lane='.length).trim();
  }
  return args;
}

function readPackageScripts() {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
    return pkg.scripts || {};
  } catch {
    return {};
  }
}

function runNpm(scriptName, cwd = ROOT) {
  const t0 = Date.now();
  const res = spawnSync('npm', ['run', scriptName], {
    cwd,
    shell: true,
    encoding: 'utf8',
    maxBuffer: 24 * 1024 * 1024,
  });
  const ms = Date.now() - t0;
  const exitCode = res.status === null ? -1 : res.status;
  const ok = exitCode === 0;
  return {
    command: `npm run ${scriptName}`,
    cwd: path.relative(ROOT, cwd) || '.',
    exitCode,
    ok,
    duration_ms: ms,
    stderr_tail: String(res.stderr || '').slice(-3500),
    stdout_tail: String(res.stdout || '').slice(-3500),
    spawn_error: res.error?.message || null,
  };
}

function runQuestraTests() {
  const questra = path.join(ROOT, 'z-questra');
  if (!fs.existsSync(path.join(questra, 'package.json'))) {
    return {
      id: 'project_test_questra',
      role: 'Project Test Bot (z-questra)',
      command: 'npm test',
      cwd: 'z-questra',
      status: 'unknown',
      signal_contribution: 'YELLOW',
      duration_ms: 0,
      reason: 'z-questra workspace not found; skipped.',
      exitCode: null,
      stderr_tail: '',
      stdout_tail: '',
      spawn_error: null,
    };
  }
  const r = runNpm('test', questra);
  return {
    id: 'project_test_questra',
    role: 'Project Test Bot (z-questra)',
    command: 'npm test',
    cwd: 'z-questra',
    status: r.ok ? 'pass' : 'fail',
    signal_contribution: r.ok ? 'GREEN' : 'YELLOW',
    duration_ms: r.duration_ms,
    reason: r.ok ? 'Vitest suite passed.' : 'Tests failed or npm error — advisory; fix before relying on Questra lane.',
    exitCode: r.exitCode,
    stderr_tail: r.stderr_tail,
    stdout_tail: r.stdout_tail,
    spawn_error: r.spawn_error,
  };
}

function analyzeNextLane(hint) {
  if (!hint) {
    return {
      human_decision_required: false,
      blocked_categories: [],
      reason: 'No --next-lane hint. Operator still confirms Turtle scope before opening a lane.',
    };
  }
  const blocked = [];
  for (const { re, category } of RISKY_LANE_RULES) {
    if (re.test(hint)) blocked.push(category);
  }
  const unique = [...new Set(blocked)];
  return {
    human_decision_required: unique.length > 0,
    blocked_categories: unique,
    reason:
      unique.length > 0
        ? 'Hint matches governance-sensitive themes; AMK/human decision required before proceeding.'
        : 'Hint did not match automated risky patterns; still confirm single-domain scope and rollback.',
  };
}

function minimabotFromNpm(id, role, scriptName, scripts, required) {
  if (!scripts[scriptName]) {
    return {
      id,
      role,
      command: `npm run ${scriptName}`,
      cwd: '.',
      status: required ? 'unknown' : 'skipped',
      signal_contribution: required ? 'RED' : 'skipped',
      duration_ms: 0,
      reason: required ? `Script "${scriptName}" missing from package.json.` : 'Not configured.',
      exitCode: null,
      stderr_tail: '',
      stdout_tail: '',
      spawn_error: null,
    };
  }
  const r = runNpm(scriptName);
  const ok = r.ok && !r.spawn_error;
  return {
    id,
    role,
    command: r.command,
    cwd: r.cwd,
    status: ok ? 'pass' : 'fail',
    signal_contribution: ok ? 'GREEN' : 'RED',
    duration_ms: r.duration_ms,
    reason: ok
      ? 'Check passed.'
      : r.spawn_error || `Exit code ${r.exitCode}. See stderr_tail in JSON.`,
    exitCode: r.exitCode,
    stderr_tail: r.stderr_tail,
    stdout_tail: r.stdout_tail,
    spawn_error: r.spawn_error,
  };
}

function buildDrpMinibot(nextLaneAnalysis) {
  const { human_decision_required, blocked_categories, reason } = nextLaneAnalysis;
  return {
    id: 'drp_gate',
    role: 'DRP Gate Bot',
    command: '(next-lane hint analysis — read-only)',
    cwd: '.',
    status: 'advisory',
    signal_contribution: human_decision_required ? 'BLUE' : 'GREEN',
    duration_ms: 0,
    reason,
    human_decision_required,
    blocked_categories,
    exitCode: null,
    stderr_tail: '',
    stdout_tail: '',
    spawn_error: null,
  };
}

function buildAiBuilderMinibot(deep, scripts) {
  if (!deep) {
    return {
      id: 'ai_builder',
      role: 'AI Builder Bot',
      command: 'npm run z:ai-builder:refresh',
      cwd: '.',
      status: 'skipped',
      signal_contribution: 'skipped',
      duration_ms: 0,
      reason: 'Default mode: not run (regenerates many docs). Use --deep to execute.',
      exitCode: null,
      stderr_tail: '',
      stdout_tail: '',
      spawn_error: null,
    };
  }
  if (!scripts['z:ai-builder:refresh']) {
    return {
      id: 'ai_builder',
      role: 'AI Builder Bot',
      command: 'npm run z:ai-builder:refresh',
      cwd: '.',
      status: 'unknown',
      signal_contribution: 'YELLOW',
      duration_ms: 0,
      reason: 'Script z:ai-builder:refresh not found.',
      exitCode: null,
      stderr_tail: '',
      stdout_tail: '',
      spawn_error: null,
    };
  }
  const r = runNpm('z:ai-builder:refresh');
  const ok = r.ok && !r.spawn_error;
  return {
    id: 'ai_builder',
    role: 'AI Builder Bot',
    command: r.command,
    cwd: r.cwd,
    status: ok ? 'pass' : 'fail',
    signal_contribution: ok ? 'GREEN' : 'YELLOW',
    duration_ms: r.duration_ms,
    reason: ok ? 'AI Builder refresh passed.' : 'Deep refresh failed — review logs before treating docs as current.',
    exitCode: r.exitCode,
    stderr_tail: r.stderr_tail,
    stdout_tail: r.stdout_tail,
    spawn_error: r.spawn_error,
  };
}

function computeChief(requiredBots, laneAnalysis, optionalBots) {
  const requiredFailed = requiredBots.some((b) => b.status === 'fail' || b.status === 'unknown');
  const optionalYellow = optionalBots.some((b) => b.signal_contribution === 'YELLOW' && b.status === 'fail');

  const blocked_categories = [...laneAnalysis.blocked_categories];
  const hintNeedsHuman = laneAnalysis.human_decision_required;

  let overall_signal = 'GREEN';
  let recommended_action = 'Required checks passed. You may open the next Turtle lane after human scope choice.';
  let next_lane_advice = 'Pick one domain; document rollback; run this report again after edits.';

  if (requiredFailed) {
    overall_signal = 'RED';
    recommended_action = 'Stop: fix failing required checks before opening a new lane.';
    next_lane_advice =
      'Run failing scripts individually; restore green markdown, CAR², dashboard registry, and cross-project sync.';
    if (hintNeedsHuman) {
      next_lane_advice += ` Hint also flagged governance themes (${blocked_categories.join(', ') || 'see DRP row'}); resolve checks first, then AMK/human gate if still applicable.`;
    }
  } else if (hintNeedsHuman) {
    overall_signal = 'BLUE';
    recommended_action =
      'Tower is clear on automation, but the hinted lane needs AMK/human governance sign-off before proceed.';
    next_lane_advice = `Review categories: ${blocked_categories.join(', ') || 'governance'}. Charter / policy as appropriate.`;
  } else if (optionalYellow) {
    overall_signal = 'YELLOW';
    recommended_action =
      'Core runway is green; optional/deep checks reported issues — proceed with caution or re-run with fixes.';
    next_lane_advice = 'Re-run failed optional steps or drop optional flags until they pass.';
  }

  return {
    overall_signal,
    recommended_action,
    next_lane_advice,
    blocked_categories,
    human_decision_required: hintNeedsHuman,
    manual_operator_note:
      'Minibots do not replace UI/manual acceptance. Reload Cursor if Problems panel looks stale.',
  };
}

function writeMarkdown(payload) {
  const { timestamp, traffic_chief, minibots, posture } = payload;
  const lines = [
    '# Z-Traffic Minibots — status report',
    '',
    `**Generated:** ${timestamp}`,
    '',
    '## Traffic Chief',
    '',
    `| Field | Value |`,
    `|----|----|`,
    `| **Overall signal** | **${traffic_chief.overall_signal}** |`,
    `| Human decision required | ${traffic_chief.human_decision_required ? 'yes' : 'no'} |`,
    `| Blocked categories (hint) | ${traffic_chief.blocked_categories.length ? traffic_chief.blocked_categories.join(', ') : '—'} |`,
    '',
    '### Recommended action',
    '',
    traffic_chief.recommended_action,
    '',
    '### Next lane advice',
    '',
    traffic_chief.next_lane_advice,
    '',
    `*${traffic_chief.manual_operator_note}*`,
    '',
    '## Minibots',
    '',
    '| MiniBot | Command | Status | Signal | Duration (ms) |',
    '|----|----|----|----|----:|',
  ];
  for (const b of minibots) {
    const cmd = b.command.replace(/\|/g, '\\|');
    lines.push(`| ${b.role} | \`${cmd}\` | ${b.status} | ${b.signal_contribution} | ${b.duration_ms} |`);
  }
  lines.push('', '## Reason detail (per bot)', '');
  for (const b of minibots) {
    lines.push(`### ${b.role}`, '', b.reason, '');
    if (b.status === 'fail' && (b.stderr_tail || b.stdout_tail)) {
      lines.push('<details><summary>Output tail</summary>', '', '```text', (b.stderr_tail || b.stdout_tail).slice(0, 2500), '```', '</details>', '');
    }
  }
  lines.push('---', '', `*${posture}*`, '');
  return lines.join('\n');
}

function main() {
  const args = parseArgs(process.argv);
  const scripts = readPackageScripts();
  const timestamp = new Date().toISOString();

  const requiredBots = [
    minimabotFromNpm('markdown', 'Markdown Traffic Bot', 'verify:md', scripts, true),
    minimabotFromNpm('car2', 'CAR² Traffic Bot', 'z:car2', scripts, true),
    minimabotFromNpm('dashboard', 'Dashboard Traffic Bot', 'dashboard:registry-verify', scripts, true),
    minimabotFromNpm('cross_project', 'Cross-Project Bot', 'z:cross-project:sync', scripts, true),
    minimabotFromNpm('ecosystem_awareness', 'Z-AWARE-1 Ecosystem Awareness Bot', 'z:ecosystem:awareness', scripts, true),
    minimabotFromNpm('api_spine', 'Z-API-SPINE-1 Power Cell Bot', 'z:api:spine', scripts, true),
    minimabotFromNpm('ssws_requirements', 'Z-SSWS-LINK-1 Launch Requirements Bot', 'z:ssws:requirements', scripts, true),
  ];

  const nextLaneAnalysis = analyzeNextLane(args.nextLane);
  const drpMinibot = buildDrpMinibot(nextLaneAnalysis);

  const optionalBots = [buildAiBuilderMinibot(args.deep, scripts)];
  if (args.withQuestra) optionalBots.push(runQuestraTests());

  const allMinibots = [...requiredBots, drpMinibot, ...optionalBots];
  const traffic_chief = computeChief(requiredBots, nextLaneAnalysis, optionalBots);

  const payload = {
    schema: SCHEMA,
    posture:
      'Read-only advisory tower: no auto-fix, no deploy, no bridge execution. AMK/human chooses the next lane.',
    timestamp,
    traffic_chief,
    minibots: allMinibots,
    cli: {
      deep: args.deep,
      with_questra: args.withQuestra,
      next_lane_hint: args.nextLane,
    },
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.writeFileSync(OUT_MD, writeMarkdown({ ...payload, traffic_chief }), 'utf8');

  console.log(JSON.stringify({ ok: true, overall_signal: traffic_chief.overall_signal, out_json: OUT_JSON, out_md: OUT_MD }, null, 2));

  const exitCode = traffic_chief.overall_signal === 'RED' ? 1 : 0;
  process.exit(exitCode);
}

main();
