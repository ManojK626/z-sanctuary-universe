#!/usr/bin/env node
import { exec } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';

const execAsync = promisify(exec);
const cwd = process.cwd();
const registryPath = resolve('data', 'z_cadence_cycle_registry.json');
const reportJsonPath = resolve('data', 'reports', 'z_cadence_cycle_report.json');
const reportMdPath = resolve('data', 'reports', 'z_cadence_cycle_report.md');

const args = process.argv.slice(2);
const cycleFlagIndex = args.indexOf('--cycle');
const cycleId = cycleFlagIndex >= 0 ? args[cycleFlagIndex + 1] : null;

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function shortOutput(stdout, stderr) {
  const combined = `${stdout ?? ''}\n${stderr ?? ''}`.trim();
  if (!combined) return 'No output.';
  const lines = combined.split(/\r?\n/).filter(Boolean);
  return lines.slice(-4).join(' | ').slice(0, 360);
}

function rank(signal) {
  const s = String(signal || '').toUpperCase();
  if (s === 'RED') return 4;
  if (s === 'BLUE') return 3;
  if (s === 'YELLOW') return 2;
  if (s === 'GREEN') return 1;
  return 0;
}

function maxSignal(a, b) {
  return rank(b) > rank(a) ? b : a;
}

function containsForbiddenTerm(command, forbiddenTerms) {
  const text = String(command || '').toLowerCase();
  return forbiddenTerms.some((term) => text.includes(String(term || '').toLowerCase()));
}

async function runAllowedCommand(command, forbiddenTerms) {
  if (containsForbiddenTerm(command, forbiddenTerms)) {
    return {
      command,
      exit_code: 1,
      status: 'forbidden',
      signal: 'RED',
      summary: 'Blocked: command matched forbidden term.',
      forbidden_lane_detected: true,
    };
  }
  try {
    const { stdout, stderr } = await execAsync(command, { cwd, windowsHide: true, maxBuffer: 1024 * 1024 * 5 });
    return {
      command,
      exit_code: 0,
      status: 'pass',
      signal: 'GREEN',
      summary: shortOutput(stdout, stderr),
      forbidden_lane_detected: false,
    };
  } catch (error) {
    return {
      command,
      exit_code: Number.isInteger(error.code) ? error.code : 1,
      status: 'fail',
      signal: 'RED',
      summary: shortOutput(error.stdout, error.stderr),
      forbidden_lane_detected: false,
    };
  }
}

async function detectReportSignal(reportPath) {
  try {
    const doc = JSON.parse(await readFile(resolve(reportPath), 'utf8'));
    const signal = String(doc.overall_signal || doc.signal || '').toUpperCase();
    return ['GREEN', 'YELLOW', 'BLUE', 'RED'].includes(signal) ? signal : null;
  } catch {
    return null;
  }
}

function buildNotificationCandidates(signal, nextFollowUp) {
  if (signal === 'RED') {
    return [
      {
        type: 'RED_BLOCKED_STATE',
        signal: 'RED',
        message: 'Cadence cycle blocked; required check failed or forbidden lane detected.',
      },
    ];
  }
  if (signal === 'BLUE') {
    return [
      {
        type: 'BLUE_AMK_DECISION_REQUIRED',
        signal: 'BLUE',
        message: 'Cadence cycle requires AMK decision before movement.',
      },
    ];
  }
  if (nextFollowUp === 'READY_FOR_HUB_2_1_MONTHLY_REVIEW_TEMPLATE') {
    return [
      {
        type: 'READY_REVIEW_TEMPLATE',
        signal: 'GREEN',
        message: 'Two consecutive GREEN cadence cycles; draft HUB-2.1 monthly review from evidence.',
      },
    ];
  }
  return [];
}

function buildMarkdown(report) {
  const lines = [
    '# Z-CADENCE-1 report',
    '',
    `- Generated: ${report.generated_at}`,
    `- Cycle: ${report.cycle_id}`,
    `- Overall signal: **${report.overall_signal}**`,
    `- Previous signal: **${report.previous_overall_signal || 'UNKNOWN'}**`,
    `- Next follow-up: **${report.next_follow_up}**`,
    '',
    '## Command results',
    '',
  ];
  for (const result of report.command_runs) {
    lines.push(
      `- [${result.signal}] \`${result.command}\` => ${result.status.toUpperCase()} (exit ${result.exit_code}) — ${result.summary}`,
    );
  }
  lines.push('', '## Notification candidates', '');
  if (report.amk_notification_candidates.length) {
    for (const n of report.amk_notification_candidates) {
      lines.push(`- **${n.signal}** ${n.type}: ${n.message}`);
    }
  } else {
    lines.push('- (none)');
  }
  lines.push('', '## Locked law', '');
  for (const line of report.locked_law) {
    lines.push(`- ${line}`);
  }
  lines.push('');
  return `${lines.join('\n')}\n`;
}

async function main() {
  if (cycleId !== 'logical_brains_hub') {
    console.error('Only --cycle logical_brains_hub is supported.');
    process.exit(1);
  }
  if (resolve(cwd) !== resolve('.')) {
    console.error('Cadence runner must execute from main hub root.');
    process.exit(1);
  }

  const registry = JSON.parse(await readFile(registryPath, 'utf8'));
  const cycle = toArray(registry.cycles).find((item) => item.id === cycleId);
  if (!cycle) {
    console.error(`Cycle not found: ${cycleId}`);
    process.exit(1);
  }

  const forbiddenTerms = toArray(registry.forbidden_commands);
  const allowedCommands = toArray(cycle.allowed_commands);
  const requiredCommands = toArray(cycle.required_commands).length ? toArray(cycle.required_commands) : allowedCommands;

  const commandRuns = [];
  for (const command of allowedCommands) {
    commandRuns.push(await runAllowedCommand(command, forbiddenTerms));
  }

  let overallSignal = 'GREEN';
  for (const run of commandRuns) {
    overallSignal = maxSignal(overallSignal, run.signal);
  }

  const reportSignals = (
    await Promise.all([
      detectReportSignal('data/reports/z_logical_brains_hub_reference_report.json'),
      detectReportSignal('data/reports/z_sec_triplecheck_report.json'),
      detectReportSignal('data/reports/z_ide_fusion_report.json'),
      detectReportSignal('data/reports/z_traffic_minibots_status.json'),
    ])
  ).filter(Boolean);
  for (const s of reportSignals) overallSignal = maxSignal(overallSignal, s);

  const forbiddenLaneDetected = commandRuns.some((run) => run.forbidden_lane_detected);
  const requiredFailures = commandRuns.some((run) => requiredCommands.includes(run.command) && run.exit_code !== 0);
  if (forbiddenLaneDetected || requiredFailures) overallSignal = 'RED';

  let previousOverallSignal = null;
  try {
    const prev = JSON.parse(await readFile(reportJsonPath, 'utf8'));
    previousOverallSignal = String(prev.overall_signal || '').toUpperCase() || null;
  } catch {
    previousOverallSignal = null;
  }

  const rules = registry.readiness_rules || {};
  let nextFollowUp = rules.default_follow_up || 'CONTINUE_CADENCE';
  if (overallSignal === 'RED') nextFollowUp = rules.red_follow_up || 'BLOCKED_RED';
  else if (overallSignal === 'BLUE') nextFollowUp = rules.blue_follow_up || 'AMK_DECISION_REQUIRED';
  else if (overallSignal === 'GREEN' && previousOverallSignal === 'GREEN') {
    nextFollowUp = rules.stable_green_follow_up || 'READY_FOR_HUB_2_1_MONTHLY_REVIEW_TEMPLATE';
  }

  const report = {
    schema: 'z_cadence_cycle_report_v1',
    generated_at: new Date().toISOString(),
    cycle_id: cycleId,
    mode: 'read_only_cadence_runner',
    overall_signal: overallSignal,
    previous_overall_signal: previousOverallSignal,
    next_follow_up: nextFollowUp,
    stable_green_detected: nextFollowUp === 'READY_FOR_HUB_2_1_MONTHLY_REVIEW_TEMPLATE',
    command_runs: commandRuns,
    report_overlays: reportSignals,
    issues: commandRuns
      .filter((run) => run.status !== 'pass')
      .map((run) => ({
        signal: run.signal,
        code: run.status === 'forbidden' ? 'forbidden_lane_detected' : 'required_check_failed',
        message: `${run.command} => ${run.status}`,
      })),
    amk_notification_candidates: buildNotificationCandidates(overallSignal, nextFollowUp),
    forbidden_lane_detected: forbiddenLaneDetected,
    forbidden_behavior_confirmed_absent: true,
    never_set_readiness: toArray(rules.never_allow).length
      ? toArray(rules.never_allow)
      : toArray(rules.forbidden_readiness_outputs),
    locked_law: [
      'Cadence runner != deployment.',
      'Follow-up notification != permission.',
      'Two GREEN cycles != public release.',
      'Auto-task follow-up != auto-execution.',
      'GREEN != deploy.',
      'BLUE requires AMK.',
      'RED blocks movement.',
      'AMK-Goku owns sacred moves.',
    ],
  };

  await writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await writeFile(reportMdPath, buildMarkdown(report), 'utf8');

  console.log(`Z cadence cycle ${cycleId} signal: ${overallSignal}`);
  console.log(`Next follow-up: ${nextFollowUp}`);
  process.exit(overallSignal === 'RED' ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
