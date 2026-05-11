#!/usr/bin/env node
/**
 * Z-SPI decision advisor (Phase 2, advisory-only).
 * Merges SPI decision_suggestions with pending governance rows for human clarity.
 * Emits data/reports/z_spi_decision_advice.{json,md}
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS, 'z_spi_decision_advice.json');
const OUT_MD = path.join(REPORTS, 'z_spi_decision_advice.md');

function readJson(p, fb = null) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fb;
  }
}

function main() {
  const spi = readJson(path.join(REPORTS, 'z_structural_patterns.json'), null);
  const decisions = readJson(path.join(REPORTS, 'z_bot_decisions.json'), {});
  const pending = Array.isArray(decisions?.decisions)
    ? decisions.decisions.filter((d) => String(d?.status || '').toLowerCase() === 'pending')
    : [];

  const generated_at = new Date().toISOString();

  if (!spi?.schema_version) {
    const payload = {
      schema_version: 1,
      generated_at,
      advisory_only: true,
      present: false,
      note: 'Run npm run spi:analyze first to emit z_structural_patterns.json.',
      suggestions: [],
      pending_decisions: pending.map((d) => ({ id: d?.id, title: d?.title ?? null })),
    };
    fs.mkdirSync(REPORTS, { recursive: true });
    fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    fs.writeFileSync(OUT_MD, `# Z-SPI decision advice\n\n${payload.note}\n`, 'utf8');
    console.log(`Z-SPI decision advisor: ${OUT_JSON} (SPI missing — stub only)`);
    return;
  }

  const fromSpi = Array.isArray(spi.decision_suggestions) ? spi.decision_suggestions : [];
  const suggestions = fromSpi.map((s) => ({
    target: s.target,
    suggested_action: s.suggested_action,
    confidence: s.confidence,
    reason: s.reason,
    source: 'spi',
  }));

  for (const p of pending) {
    const id = String(p?.id || '');
    if (!id) continue;
    const already = suggestions.some((s) => String(s.target) === id);
    if (already) continue;
    suggestions.push({
      target: id,
      suggested_action: 'ack',
      confidence: 0.45,
      reason: 'Pending governance item — review against SPI phase and catalog diff before resolve.',
      source: 'pending_fallback',
    });
  }

  const payload = {
    schema_version: 1,
    generated_at,
    advisory_only: true,
    drp_note: 'Suggestions do not execute bot:decision:act; operator confirms actions.',
    spi_generated_at: spi.generated_at ?? null,
    spi_phase: spi.system_phase ?? null,
    spi_evolution_phase: spi.evolution_phase ?? null,
    pending_decisions: pending.map((d) => ({ id: d?.id, title: d?.title ?? null, status: d?.status })),
    suggestions,
  };

  fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  const md = [
    '# Z-SPI decision advice',
    '',
    `Generated: ${generated_at}`,
    `SPI phase: **${payload.spi_phase ?? 'n/a'}** · evolution: **${payload.spi_evolution_phase ?? 'n/a'}**`,
    '',
    '## Suggestions',
    ...(payload.suggestions.length
      ? payload.suggestions.map(
          (s) =>
            `- **${s.target}** · ${s.suggested_action} (${((s.confidence || 0) * 100).toFixed(0)}%) — ${s.reason} _(${s.source})_`
        )
      : ['- (none)']),
    '',
    '## Panel',
    'Open `dashboard/panels/z_decision_panel.html` (hub root Live Server) to view alongside `z_bot_decisions.json`.',
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');
  console.log(`Z-SPI decision advisor: ${OUT_JSON} suggestions=${suggestions.length}`);
}

main();
