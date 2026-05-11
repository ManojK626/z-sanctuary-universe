#!/usr/bin/env node
/**
 * ZUNO-A2b — Truth-layer alignment: Monster Project registry vs ingested snapshot.
 * Read-only. Writes data/reports/zuno_truth_layer_alignment.{json,md}.
 * No auto-fix, no phase advancement.
 *
 * Signals:
 * - registry_vs_snapshot_echo: live required_entry_ids checksum vs snapshot.truth_alignment_ref
 * - narrative_presence: heuristic mention of each required id in snapshot JSON (MD-derived body)
 *
 * Exit 1 only if snapshot or registry JSON is missing or invalid. Otherwise exit 0 (YELLOW is informational).
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SNAP = path.join(ROOT, 'data', 'zuno_state_snapshot.json');
const REG = path.join(ROOT, 'data', 'z_sanctuary_monster_project_registry.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'zuno_truth_layer_alignment.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'zuno_truth_layer_alignment.md');

const SCHEMA = 'zuno_truth_layer_alignment_v1';

/**
 * @param {string} id
 * @param {string} [label]
 * @param {string} hay
 */
function narrativeTier(id, label, hay) {
  const idl = id.toLowerCase();
  if (hay.includes(idl)) return 'id_literal';
  const spaced = idl.replace(/_/g, ' ');
  if (hay.includes(spaced)) return 'id_spaced';
  const collapsed = idl.replace(/_/g, '');
  if (collapsed.length >= 4 && hay.includes(collapsed)) return 'id_collapsed';

  const words =
    (label || '')
      .toLowerCase()
      .match(/[a-z][a-z0-9]{2,}/g) || [];
  const hits = words.filter((w) => hay.includes(w));
  if (words.length >= 2 && hits.length >= 2) return 'label_words';
  if (words.length === 1 && hits.length === 1) return 'label_words';
  return 'none';
}

/** @param {Record<string, unknown>} snap */
function buildHaystack(snap) {
  return JSON.stringify(snap).toLowerCase();
}

/**
 * @param {unknown} data
 * @returns {{ ids: string[], sha: string, count: number } | null}
 */
function liveRegistryChecksum(data) {
  const meta = data?._meta;
  const ids = [...(meta?.required_entry_ids || [])].filter((x) => typeof x === 'string' && x.trim()).sort();
  if (!ids.length) return null;
  const sha = crypto.createHash('sha256').update(JSON.stringify(ids)).digest('hex');
  return { ids, sha, count: ids.length };
}

/** @param {Record<string, unknown>} payload */
function writeMarkdown(payload) {
  const echo = payload.registry_vs_snapshot_echo;
  const nar = payload.narrative_presence;
  const lines = [
    '# Zuno truth-layer alignment',
    '',
    `**Generated:** ${payload.generated_at}`,
    '',
    '| Field | Value |',
    '| ---- | ---- |',
    `| Status | ${payload.status} |`,
    `| Snapshot | ${payload.snapshot_path} |`,
    `| Registry | ${payload.registry_path} |`,
    '',
    '## Registry vs snapshot echo',
    '',
    '| Check | Value |',
    '| ---- | ---- |',
    `| echo_in_sync | ${echo.echo_in_sync} |`,
    `| live_required_count | ${echo.live_required_count ?? '—'} |`,
    `| snapshot_ref_present | ${echo.snapshot_ref_present} |`,
    `| reason | ${(echo.reason || '—').replace(/\|/g, '\\|')} |`,
    '',
    '## Narrative presence (heuristic)',
    '',
    `| missing_narrative_count | ${nar.missing_ids.length} |`,
    '',
  ];
  if (nar.missing_ids.length) {
    lines.push('### Missing narrative signal', '', '| id | label |', '| ---- | ---- |');
    for (const row of nar.rows.filter((r) => r.tier === 'none')) {
      lines.push(`| ${row.id} | ${String(row.label || '').replace(/\|/g, '\\|')} |`);
    }
    lines.push('');
  } else {
    lines.push('_All required ids have a narrative signal in the snapshot body._', '');
  }
  lines.push('---', '', '*Read-only report — no auto-fix or phase advancement.*', '');
  return lines.join('\n');
}

function main() {
  if (!fs.existsSync(SNAP)) {
    console.error('Missing data/zuno_state_snapshot.json — run npm run zuno:snapshot first.');
    process.exit(1);
  }
  if (!fs.existsSync(REG)) {
    console.error('Missing data/z_sanctuary_monster_project_registry.json');
    process.exit(1);
  }

  let snap;
  let reg;
  try {
    snap = JSON.parse(fs.readFileSync(SNAP, 'utf8'));
  } catch (e) {
    console.error('Invalid snapshot JSON:', e instanceof Error ? e.message : e);
    process.exit(1);
  }
  try {
    reg = JSON.parse(fs.readFileSync(REG, 'utf8'));
  } catch (e) {
    console.error('Invalid monster registry JSON:', e instanceof Error ? e.message : e);
    process.exit(1);
  }

  const live = liveRegistryChecksum(reg);
  if (!live) {
    console.error('Monster registry has no _meta.required_entry_ids');
    process.exit(1);
  }

  const ref = snap.truth_alignment_ref;
  const snapshotSha =
    ref && typeof ref === 'object' && ref.present === true && typeof ref.monster_required_ids_sha256 === 'string'
      ? ref.monster_required_ids_sha256
      : null;
  const snapshotRefPresent = Boolean(snapshotSha);
  const echoInSync = snapshotRefPresent && snapshotSha === live.sha;

  /** @type {{ echo_in_sync: boolean, snapshot_ref_present: boolean, live_required_count: number, snapshot_required_count?: number, reason?: string }} */
  const echoBlock = {
    echo_in_sync: echoInSync,
    snapshot_ref_present: snapshotRefPresent,
    live_required_count: live.count,
    snapshot_required_count:
      ref && typeof ref === 'object' && typeof ref.monster_required_count === 'number'
        ? ref.monster_required_count
        : undefined,
  };

  if (!ref || typeof ref !== 'object') {
    echoBlock.reason = 'snapshot_missing_truth_alignment_ref — run npm run zuno:snapshot';
  } else if (ref.present === false) {
    echoBlock.reason = typeof ref.reason === 'string' ? ref.reason : 'truth_alignment_ref_not_embedded';
  } else if (!snapshotRefPresent) {
    echoBlock.reason = 'snapshot_truth_alignment_ref_incomplete — run npm run zuno:snapshot';
  } else if (!echoInSync) {
    echoBlock.reason = 'registry_required_ids_changed_since_snapshot — run npm run zuno:snapshot';
  }

  const hay = buildHaystack(snap);
  /** @type {Record<string, string>} */
  const labelById = {};
  if (Array.isArray(reg.entries)) {
    for (const e of reg.entries) {
      if (e && typeof e.id === 'string' && typeof e.label === 'string') {
        labelById[e.id] = e.label;
      }
    }
  }

  /** @type {{ id: string, label: string, tier: string }[]} */
  const rows = [];
  for (const id of live.ids) {
    const label = labelById[id] || '';
    const tier = narrativeTier(id, label, hay);
    rows.push({ id, label, tier });
  }
  const missingNarrative = rows.filter((r) => r.tier === 'none').map((r) => r.id);

  const needsAttention = !echoInSync || missingNarrative.length > 0;
  const status = needsAttention ? 'YELLOW' : 'GREEN';

  const payload = {
    schema: SCHEMA,
    generated_at: new Date().toISOString(),
    status,
    snapshot_path: path.relative(ROOT, SNAP).replace(/\\/g, '/'),
    registry_path: path.relative(ROOT, REG).replace(/\\/g, '/'),
    registry_vs_snapshot_echo: echoBlock,
    narrative_presence: {
      missing_ids: missingNarrative,
      rows,
    },
    note: 'YELLOW means refresh snapshot and/or deepen technology snapshot MD so registry cores are visible in narrative. No automatic mutation.',
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.writeFileSync(OUT_MD, writeMarkdown(payload), 'utf8');

  console.log(
    JSON.stringify(
      {
        ok: true,
        status,
        echo_in_sync: echoInSync,
        narrative_missing_count: missingNarrative.length,
        out_json: path.relative(ROOT, OUT_JSON).replace(/\\/g, '/'),
        out_md: path.relative(ROOT, OUT_MD).replace(/\\/g, '/'),
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

main();
