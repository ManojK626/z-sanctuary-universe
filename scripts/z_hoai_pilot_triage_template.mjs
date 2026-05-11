#!/usr/bin/env node
/**
 * Z-HOAI — blank pilot triage template (JSON + optional Markdown).
 * Hub-local; consumer projects (e.g. XL2 on disk) copy output or run equivalent locally.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());

function parseArgs(argv) {
  const out = { write: false, id: null, reporter: '', domain: '' };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--write') out.write = true;
    else if (a === '--id') out.id = argv[++i] ?? null;
    else if (a === '--reporter') out.reporter = argv[++i] ?? '';
    else if (a === '--domain') out.domain = argv[++i] ?? '';
  }
  return out;
}

function makeTemplate(args) {
  const now = new Date().toISOString();
  const id =
    args.id ||
    `hoai-${now.slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    schema: 'z_hoai_pilot_triage/v1',
    id,
    date: now,
    reporter: args.reporter || 'anonymous',
    severity: 'P2',
    domain: args.domain || 'UX',
    affected_route_or_module: '',
    feedback_text: '',
    repro_steps: [],
    expected: '',
    actual: '',
    risk: '',
    suggested_minimal_fix: '',
    human_review_required: false,
    human_review_reason: '',
    assigned_shadows: [],
    verification_commands: [
      '# Set per consumer repo, e.g. pilot-patch-gate, lint, build, test',
    ],
    consumer_repo_notes:
      'Tracker path and product scripts live in the pilot app repository, not the hub.',
    links: {
      doctrine: 'docs/ai-hand/Z_HOAI_PILOT_INTELLIGENCE_PLAN.md',
      hierarchy_chief: 'docs/Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md',
      comms_flow: 'docs/Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md',
    },
  };
}

function toMarkdown(row) {
  const lines = [
    `# Pilot triage (blank) — ${row.id}`,
    '',
    '| Field | Value |',
    '| ----- | ----- |',
    `| date | ${row.date} |`,
    `| reporter | ${row.reporter} |`,
    `| severity | ${row.severity} |`,
    `| domain | ${row.domain} |`,
    `| affected route/module | ${row.affected_route_or_module || '—'} |`,
    `| human review required | ${row.human_review_required} |`,
    '',
    '## Feedback',
    '',
    row.feedback_text || '—',
    '',
    '## Repro steps',
    '',
    ...(row.repro_steps.length ? row.repro_steps.map((s, i) => `${i + 1}. ${s}`) : ['—']),
    '',
    '## Expected / actual',
    '',
    `- Expected: ${row.expected || '—'}`,
    `- Actual: ${row.actual || '—'}`,
    '',
    '## Risk',
    '',
    row.risk || '—',
    '',
    '## Suggested minimal fix',
    '',
    row.suggested_minimal_fix || '—',
    '',
    '## Verification commands',
    '',
    ...row.verification_commands.map((c) => `- ${c}`),
    '',
  ];
  return `${lines.join('\n')}\n`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const payload = makeTemplate(args);
  const json = `${JSON.stringify(payload, null, 2)}\n`;

  if (!args.write) {
    process.stdout.write(json);
    return;
  }

  const dir = path.join(ROOT, 'data', 'reports');
  fs.mkdirSync(dir, { recursive: true });
  const jsonPath = path.join(dir, 'z_hoai_pilot_triage_template.json');
  const mdPath = path.join(dir, 'z_hoai_pilot_triage_template.md');
  fs.writeFileSync(jsonPath, json, 'utf8');
  fs.writeFileSync(mdPath, toMarkdown(payload), 'utf8');
  console.log(`Written:\n  ${jsonPath}\n  ${mdPath}`);
}

main();
