import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const registryPath = resolve('data', 'amk_ai_team_router_registry.json');
const samplesPath = resolve('data', 'examples', 'amk_ai_team_router_samples.json');
const reportJsonPath = resolve('data', 'reports', 'amk_ai_team_sync_report.json');
const reportMdPath = resolve('data', 'reports', 'amk_ai_team_sync_report.md');
const indicatorPath = resolve('dashboard', 'data', 'amk_project_indicators.json');
const packagePath = resolve('package.json');
const reportsDir = resolve('data', 'reports');

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

/** @param {string} text */
function textNorm(text) {
  return String(text ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** @returns {{ rule: object|null, score: number, keyword_hits: string[] }} */
function bestRoutingRule(registry, normalizedText, excludeDeployRule) {
  const rules = toArray(registry.routing_rules);
  /** @type {{ rule: object|null, score: number, keyword_hits: string[] }} */
  let best = { rule: null, score: -1, keyword_hits: [] };
  for (const rule of rules) {
    if (excludeDeployRule && rule.rule_id === 'route_deploy_sacred_red') continue;
    const kws = toArray(rule.concern_keywords).map((k) => String(k).toLowerCase());
    const hits = kws.filter((k) => normalizedText.includes(k));
    const score = hits.reduce((acc, k) => acc + k.length, 0);
    if (hits.length === 0) continue;
    if (score > best.score || (score === best.score && hits.length > (best.keyword_hits?.length || 0))) {
      best = { rule, score, keyword_hits: hits };
    }
  }
  return best;
}

function deployRule(registry) {
  return toArray(registry.routing_rules).find((r) => r.rule_id === 'route_deploy_sacred_red');
}

/** @returns {boolean} */
function matchesDeployRed(registry, normalizedText) {
  const dr = deployRule(registry);
  if (!dr) return false;
  return toArray(dr.concern_keywords).some((k) => normalizedText.includes(String(k).toLowerCase()));
}

/**
 * Hypothetical module token from sample text (operator convention).
 * @returns {string|null}
 */
function extractHypotheticalModuleId(text) {
  const m = String(text).match(/z_hypothetical_unregistered_engine_99/gi);
  return m ? m[0].toLowerCase() : null;
}

function validateRegistry(reg) {
  /** @type {{ passed: string[], advisory: string[], red: string[] }} */
  const out = { passed: [], advisory: [], red: [] };

  if (reg.schema !== 'amk.ai.team.router.registry.v1') out.red.push('schema must be amk.ai.team.router.registry.v1.');
  else out.passed.push('schema matches v1.');

  if (reg.mode !== 'read_only_indicator_and_decision_routing')
    out.red.push('mode must be read_only_indicator_and_decision_routing.');
  else out.passed.push('mode is read_only_indicator_and_decision_routing.');

  const teams = reg.ai_teams && typeof reg.ai_teams === 'object' ? reg.ai_teams : {};
  const teamKeys = Object.keys(teams);
  if (teamKeys.length >= 10) out.passed.push('ai_teams populated.');
  else out.red.push('ai_teams incomplete.');

  const rules = toArray(reg.routing_rules);
  if (rules.length < 8) out.red.push('routing_rules too few.');
  else out.passed.push(`routing_rules count: ${rules.length}.`);

  for (const rule of rules) {
    const miss = ['rule_id', 'primary_ai_team', 'required_commands', 'signal_policy', 'forbidden_actions', 'amk_gate_required'].filter(
      (k) => rule[k] === undefined || rule[k] === null
    );
    if (miss.length) out.red.push(`rule ${rule.rule_id ?? '?'} missing: ${miss.join(', ')}`);
    if (rule.primary_ai_team && !teams[rule.primary_ai_team])
      out.red.push(`rule ${rule.rule_id} references unknown team ${rule.primary_ai_team}`);
  }

  const checks = toArray(reg.indicator_sync_checks);
  if (checks.length >= 5) out.passed.push('indicator_sync_checks present.');
  else out.red.push('indicator_sync_checks incomplete.');

  const dps = reg.decision_packet_schema;
  if (!dps?.fields || !Array.isArray(dps.fields) || dps.fields.length < 6)
    out.red.push('decision_packet_schema.fields incomplete.');
  else out.passed.push('decision_packet_schema present.');

  return { ...out, teamKeys };
}

function signalRankOrder(sig) {
  const s = String(sig || '').toUpperCase();
  if (s === 'RED') return 0;
  if (s === 'BLUE') return 1;
  if (s === 'YELLOW') return 2;
  if (s === 'GREEN') return 3;
  return 4;
}

function overallSignal(registryRed, sampleSignals) {
  if (registryRed.length > 0) return 'RED';
  let best = 'GREEN';
  for (const s of sampleSignals) {
    if (signalRankOrder(s) < signalRankOrder(best)) best = s;
  }
  return best;
}

function buildPacket(sample, rule, signal, reasons, topicLine) {
  const amkReq = signal === 'RED' || signal === 'BLUE' || rule?.amk_gate_required === true;
  const safeNext =
    signal === 'RED'
      ? 'Stop — open AMK sacred gate; rollback any partial automation; document intent only.'
      : signal === 'BLUE'
        ? 'Draft charter scope + receipts; mock metadata only unless AMK opens execution lane.'
        : 'Proceed with docs/validators only; widen scope via MOD-DIST + indicator checklist if needed.';
  const team = matchesDeployReason(signal, rule)
    ? 'amk_personal_ai_summary'
    : rule?.primary_ai_team || 'z_mod_dist_team';

  return {
    decision_id: `amk_ai_sync_${sample.sample_id}`,
    topic: topicLine,
    recommended_ai_team: team,
    supporting_checks: toArray(rule?.required_commands ?? []),
    signal,
    why: reasons.join(' · ') || 'Routed via AMK AI team router registry.',
    safe_next_action: safeNext,
    forbidden_actions: toArray(rule?.forbidden_actions ?? []).concat(
      signal === 'RED' ? ['auto_merge', 'deploy', 'secret_write'] : []
    ),
    amk_decision_required: amkReq
  };
}

function matchesDeployReason(signal, rule) {
  return signal === 'RED' || rule?.rule_id === 'route_deploy_sacred_red';
}

/** @typedef {{ registry: object, advisory: object }} Ctx */

/**
 * Phase 1: classify sample — RED / BLUE / YELLOW / GREEN.
 * @returns {{ signal: string, rule: object|null, reasons: string[] }}
 */
function classifySample(registry, ctx, sample) {
  const topic = sample.topic ?? '';
  const req = sample.request_text ?? '';
  const t = textNorm(`${topic} ${req}`);
  const scenario = String(sample.scenario ?? '');

  if (matchesDeployRed(registry, t)) {
    const dr = deployRule(registry);
    return {
      signal: 'RED',
      rule: dr || null,
      reasons: ['Matched sacred/forbidden executor language — RED blocks movement.']
    };
  }

  if (scenario === 'missing_indicator_metadata') {
    const { rule } = bestRoutingRule(registry, t, true);
    const hid = extractHypotheticalModuleId(req);
    const pak =
      hid && ctx.indicatorIds.has(hid)
        ? ['Hypothetical id unexpectedly present on indicators — re-verify drift script.']
        : ['Hypothetical or new slice missing indicator row — propose JSON row + receipt; do not auto-write in Phase 1.'];
    return {
      signal: 'YELLOW',
      rule: rule || toArray(registry.routing_rules).find((r) => r.rule_id === 'route_dashboard_indicator') || null,
      reasons: pak
    };
  }

  if (scenario === 'dashboard_polish_doc') {
    const tx = t.includes('indicator') ? t : `${t} amk dashboard indicator`;
    const hit = bestRoutingRule(registry, tx, true);
    return {
      signal: 'GREEN',
      rule:
        hit.rule ||
        toArray(registry.routing_rules).find((r) => r.rule_id === 'route_dashboard_indicator') ||
        null,
      reasons: ['UI/copy polish scoped to posture chips —no new execution lanes; advisory-only.']
    };
  }

  const { rule, keyword_hits } = bestRoutingRule(registry, t, true);
  if (!rule) {
    return {
      signal: 'YELLOW',
      rule: null,
      reasons: ['No routing_rule keyword hit — widen registry keywords or tighten request text.']
    };
  }

  let signal = String(rule.signal_policy || 'YELLOW').toUpperCase();
  if (!['GREEN', 'YELLOW', 'BLUE', 'RED'].includes(signal)) signal = 'YELLOW';

  const reasons = [
    `rule ${rule.rule_id}${keyword_hits.length ? `; hits: ${keyword_hits.slice(0, 4).join(', ')}` : ''}`
  ];
  return { signal, rule, reasons };
}

/** @returns {Promise<object>} */
async function loadIndicatorCtx() {
  try {
    const raw = JSON.parse(await readFile(indicatorPath, 'utf8'));
    const rows = toArray(raw.indicators);
    const ids = new Set(rows.map((r) => String(r.id ?? '')));
    const advisory = [];
    let goNoGoEmpty = 0;
    let forbidEmpty = 0;
    for (const row of rows) {
      if (!row.go_no_go && row.id !== 'dashboard_registry') goNoGoEmpty++;
      if (
        (!Array.isArray(row.forbidden_actions) || row.forbidden_actions.length === 0) &&
        row.dynamic_overlay !== 'dashboard_registry'
      )
        forbidEmpty++;
    }
    if (goNoGoEmpty)
      advisory.push(`FYI: ${goNoGoEmpty} indicator row(s) lack go_no_go (exc. dashboard_registry if applicable).`);
    if (forbidEmpty)
      advisory.push(`FYI: ${forbidEmpty} indicator row(s) have empty forbidden_actions — review receipts when touching those systems.`);
    return { ids, rowCount: rows.length, advisory };
  } catch (e) {
    return {
      ids: new Set(),
      rowCount: 0,
      advisory: [`Could not read indicators: ${e.message}`],
      broken: true
    };
  }
}

async function reportPresence(registry) {
  const want = toArray(registry.known_report_basenames_for_drift_hints);
  let present = [];
  let missing = [];
  try {
    const files = await readdir(reportsDir);
    const set = new Set(files);
    for (const base of want) {
      if (set.has(base)) present.push(base);
      else missing.push(base);
    }
  } catch {
    missing = want.slice();
  }
  return { present, missing };
}

function mdReport(rep) {
  const lines = [
    '# AMK AI Team Sync Report',
    '',
    `- Overall signal: **${rep.signal}**`,
    `- Registry mode: ${rep.registry_mode}`,
    `- Generated: ${rep.generated_at}`,
    `- Phase 1: **no automatic indicator JSON edits** (read-only proposals).`,
    '',
    '## Indicator / package / reports',
    '',
    `- Indicator rows scanned: ${rep.hub_reads.indicator_row_count}`,
    `- Report files present (${rep.hub_reads.reports_present.length}): ${rep.hub_reads.reports_present.slice(0, 8).join(', ')}${rep.hub_reads.reports_present.length > 8 ? '…' : ''}`,
    `- Report files missing (hints): ${rep.hub_reads.reports_missing.slice(0, 8).join(', ') || '(none)'}`,
    `- npm script amk:ai-sync present: **${rep.hub_reads.script_amk_ai_sync_present}**`,
    '',
    '### Indicator advisory (non-blocking)',
    ''
  ];
  for (const x of rep.indicator_advisory) lines.push(`- ${x}`);
  lines.push('', '## Registry validation', '');
  for (const x of rep.registry_validation.passed) lines.push(`- PASS: ${x}`);
  for (const x of rep.registry_validation.advisory) lines.push(`- ADVISORY: ${x}`);
  for (const x of rep.registry_validation.red) lines.push(`- RED: ${x}`);
  lines.push('', '## Samples → decision packets', '');
  for (const row of rep.sample_results) {
    lines.push(`### ${row.sample_id}`, '');
    lines.push(`- Signal: **${row.signal}**`);
    lines.push(`- Rule: ${row.matched_rule_id || '—'}`);
    lines.push(`- Reason: ${row.reasons.join('; ')}`);
    lines.push('', 'Decision packet:', '', '```json', JSON.stringify(row.decision_packet, null, 2), '```', '');
  }
  lines.push('## Locked law', '');
  for (const l of rep.locked_law || []) lines.push(`- ${l}`);
  return `${lines.join('\n')}\n`;
}

async function main() {
  const registry = JSON.parse(await readFile(registryPath, 'utf8'));
  const samplesDoc = JSON.parse(await readFile(samplesPath, 'utf8'));
  const pkg = JSON.parse(await readFile(packagePath, 'utf8'));
  const regVal = validateRegistry(registry);

  const indCtx = await loadIndicatorCtx();
  const drift = await reportPresence(registry);

  const script_amk_ai_sync_present = !!(pkg.scripts && pkg.scripts['amk:ai-sync']);

  const ctx = { indicatorIds: indCtx.ids, advisory: [...indCtx.advisory] };

  const includeRed = process.env.AMK_AI_SYNC_INCLUDE_RED_FIXTURE === '1';
  let samples = toArray(samplesDoc.samples);
  if (includeRed) samples = [...samples, ...toArray(samplesDoc.fixture_samples_red)];

  /** @type {Array<object>} */
  const sample_results = [];

  for (const s of samples) {
    const classified = classifySample(registry, ctx, s);
    const topicLine = `${s.sample_id}: ${String(s.topic ?? '').slice(0, 120)}`;

    /** @type {string[]} */
    const reasons = [...classified.reasons];
    if (s.scenario === 'missing_indicator_metadata' && indCtx.ids) {
      const mid = extractHypotheticalModuleId(s.request_text || '');
      if (mid && ctx.indicatorIds.has(mid)) reasons.push(`Note: id ${mid} already present — drift check contradictory.`);
    }

    const packet = buildPacket(s, classified.rule, classified.signal, reasons, topicLine);
    packet.recommended_ai_team = classified.signal === 'RED' ? deployRule(registry)?.primary_ai_team || packet.recommended_ai_team : classified.rule?.primary_ai_team || packet.recommended_ai_team;
    packet.supporting_checks =
      classified.signal === 'RED'
        ? toArray(deployRule(registry)?.required_commands ?? [])
        : toArray(classified.rule?.required_commands ?? []);

    sample_results.push({
      sample_id: s.sample_id,
      signal: classified.signal,
      matched_rule_id: classified.rule?.rule_id ?? null,
      reasons,
      scenario: s.scenario,
      decision_packet: packet
    });
  }

  const registry_checks = [...regVal.red];

  const signal = overallSignal(registry_checks, sample_results.map((r) => r.signal));

  const report = {
    schema: 'amk.ai.team.sync.report.v1',
    module_id: 'amk_ai_team_indicator_sync',
    signal,
    registry_mode: registry.mode,
    generated_at: new Date().toISOString(),
    fixtures_red_included: includeRed,
    phase: 'AMK-AI-SYNC-1',
    reads_only_hub_truth: true,
    auto_edited_indicators: false,
    registry_validation: {
      passed: regVal.passed,
      advisory: regVal.advisory,
      red: regVal.red
    },
    indicator_advisory: [...ctx.advisory.slice(0, 40)],
    hub_reads: {
      indicator_row_count: indCtx.rowCount,
      reports_present: drift.present,
      reports_missing: drift.missing,
      script_amk_ai_sync_present
    },
    sample_results,
    locked_law: registry.locked_law || []
  };

  await mkdir(dirname(reportJsonPath), { recursive: true });
  await writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await writeFile(reportMdPath, mdReport(report), 'utf8');

  console.log(`AMK AI Team Sync signal: ${signal}`);
  process.exit(signal === 'RED' ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
