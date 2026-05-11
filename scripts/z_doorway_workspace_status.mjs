#!/usr/bin/env node
/**
 * Z-DOORWAY-2 — SSWS doorway workspace registry: read-only status + reports.
 * Does not open IDEs, enumerate arbitrary disks, mutate git, touch NAS, or run npm.
 *
 * Usage (hub root):
 *   node scripts/z_doorway_workspace_status.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.cwd();
const REG_PATH = path.join(ROOT, 'data', 'z_doorway_workspace_registry.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_doorway_workspace_status.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_doorway_workspace_status.md');
const SCHEMA = 'z_doorway_workspace_status_v1';
const REG_SCHEMA = 'z_doorway_workspace_registry_v1';

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function normPath(p) {
  if (p == null) return '';
  return String(p).trim().replace(/\\/g, '/');
}

function existsSafe(p) {
  const n = normPath(p);
  if (!n) return false;
  try {
    return fs.existsSync(n);
  } catch {
    return false;
  }
}

function cursorCliProbe() {
  const isWin = process.platform === 'win32';
  const cmd = isWin ? 'where' : 'which';
  const res = spawnSync(cmd, ['cursor'], {
    shell: isWin,
    encoding: 'utf8',
    windowsHide: true,
  });
  const ok = res.status === 0 && String(res.stdout || '').trim().length > 0;
  return {
    available: ok,
    command: `${cmd} cursor`,
    exitCode: res.status === null ? -1 : res.status,
    stdout_tail: String(res.stdout || '').trim().slice(0, 400),
    stderr_tail: String(res.stderr || '').trim().slice(0, 400),
  };
}

/** Worst-first for exit hint (DISABLED rows do not worsen overall). */
const SIGNAL_ORDER = { RED: 5, HOLD: 4, NAS_WAIT: 3, YELLOW: 2, GREEN: 1, DISABLED: 0, SKIPPED: 0 };

function maxSignal(a, b) {
  const sa = SIGNAL_ORDER[a] ?? 0;
  const sb = SIGNAL_ORDER[b] ?? 0;
  return sa >= sb ? a : b;
}

function validType(t) {
  return t === 'workspace' || t === 'folder';
}

function main() {
  const generated_at = new Date().toISOString();
  let reg;
  try {
    reg = readJson(REG_PATH);
  } catch (e) {
    const payload = {
      schema: SCHEMA,
      generated_at,
      overall_signal: 'RED',
      exit_hint: 1,
      error: `Cannot read registry: ${e?.message || e}`,
    };
    fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
    fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2), 'utf8');
    fs.writeFileSync(
      OUT_MD,
      `# Z-DOORWAY-2 workspace status\n\n**Signal:** RED\n\n${payload.error}\n`,
      'utf8',
    );
    console.error(payload.error);
    process.exit(1);
  }

  if (reg.schema !== REG_SCHEMA) {
    const msg = `Unexpected registry schema (want ${REG_SCHEMA})`;
    const payload = { schema: SCHEMA, generated_at, overall_signal: 'RED', exit_hint: 1, error: msg };
    fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
    fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2), 'utf8');
    console.error(msg);
    process.exit(1);
  }

  const entries = Array.isArray(reg.entries) ? reg.entries : [];
  const cursor = cursorCliProbe();
  const rows = [];
  let worst = 'GREEN';

  for (const e of entries) {
    const id = String(e.id || '').trim();
    const name = String(e.name || id);
    const pPath = normPath(e.path);
    const typ = String(e.type || '').toLowerCase();
    const enabled = Boolean(e.enabled);
    const status = String(e.status || '').toUpperCase();
    const tags = Array.isArray(e.tags) ? e.tags.map(String) : [];
    const preferred = String(e.preferred_entry || 'cursor').toLowerCase();
    const nasRequired = Boolean(e.nas_required);

    const base = {
      id,
      name,
      path: pPath,
      type: typ,
      enabled,
      status,
      tags,
      preferred_entry: preferred,
      nas_required: nasRequired,
      path_exists: pPath ? existsSafe(pPath) : false,
      open_eligible: false,
      row_signal: 'GREEN',
      issues: [],
    };

    if (!enabled) {
      base.row_signal = 'DISABLED';
      base.issues.push('Registry entry disabled — skip for open planning.');
      rows.push(base);
      continue;
    }

    if (!id) {
      base.row_signal = 'RED';
      base.issues.push('Missing id.');
      worst = maxSignal(worst, 'RED');
      rows.push(base);
      continue;
    }

    if (!validType(typ)) {
      base.row_signal = 'RED';
      base.issues.push(`Invalid type "${typ}" (expect workspace|folder).`);
      worst = maxSignal(worst, 'RED');
      rows.push(base);
      continue;
    }

    if (status === 'RED') {
      base.row_signal = 'RED';
      base.issues.push('Status RED — blocked.');
      worst = maxSignal(worst, 'RED');
      rows.push(base);
      continue;
    }

    if (status === 'HOLD') {
      base.row_signal = 'HOLD';
      base.issues.push('HOLD — AMK / operator decision before open.');
      worst = maxSignal(worst, 'HOLD');
      rows.push(base);
      continue;
    }

    if (status === 'NAS_WAIT') {
      base.row_signal = 'NAS_WAIT';
      base.issues.push(
        existsSafe(pPath)
          ? 'NAS_WAIT — path present but status not cleared for open.'
          : 'NAS_WAIT — path missing; no NAS writes from doorway.',
      );
      worst = maxSignal(worst, 'NAS_WAIT');
      rows.push(base);
      continue;
    }

    if (!pPath) {
      base.row_signal = 'RED';
      base.issues.push('Empty path on enabled entry.');
      worst = maxSignal(worst, 'RED');
      rows.push(base);
      continue;
    }

    if (!existsSafe(pPath)) {
      if (nasRequired) {
        base.row_signal = 'NAS_WAIT';
        base.issues.push('nas_required — path missing (treat as NAS_WAIT).');
        worst = maxSignal(worst, 'NAS_WAIT');
      } else {
        base.row_signal = 'RED';
        base.issues.push('Path missing on disk.');
        worst = maxSignal(worst, 'RED');
      }
      rows.push(base);
      continue;
    }

    if (typ === 'workspace' && !pPath.toLowerCase().endsWith('.code-workspace')) {
      base.row_signal = 'YELLOW';
      base.issues.push('YELLOW: type=workspace but path does not end with .code-workspace.');
      worst = maxSignal(worst, 'YELLOW');
    }

    if (preferred === 'none') {
      base.row_signal = maxSignal(base.row_signal, 'YELLOW');
      base.issues.push('preferred_entry=none — opener will not launch IDE for this row.');
      worst = maxSignal(worst, base.row_signal === 'GREEN' ? 'YELLOW' : base.row_signal);
    }

    if (status === 'YELLOW') {
      if (base.row_signal === 'GREEN') base.row_signal = 'YELLOW';
      base.issues.push('Registry status YELLOW — open only after operator review.');
      worst = maxSignal(worst, 'YELLOW');
    }

    const pathOk = existsSafe(pPath);
    const ideOk = preferred !== 'none';
    if (status === 'GREEN' && pathOk && ideOk && base.row_signal === 'GREEN') {
      base.open_eligible = true;
    } else if (status === 'YELLOW' && pathOk && ideOk && (base.row_signal === 'GREEN' || base.row_signal === 'YELLOW')) {
      base.open_eligible = true;
    }

    worst = maxSignal(worst, base.row_signal);
    rows.push(base);
  }

  if (!cursor.available) worst = maxSignal(worst, 'YELLOW');

  const exitCode = worst === 'RED' ? 1 : 0;
  const payload = {
    schema: SCHEMA,
    generated_at,
    phase: reg.phase || 'Z-DOORWAY-2',
    registry_schema: reg.schema,
    overall_signal: worst,
    cursor_cli: cursor,
    entries: rows,
    law: 'Doorway metadata only. Open workspace ≠ run project. No npm / git / deploy / NAS write / services.',
    exit_hint: exitCode,
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2), 'utf8');

  const md = [
    '# Z-DOORWAY-2 workspace doorway status',
    '',
    `**Generated:** ${generated_at}`,
    '',
    `**Overall signal:** ${worst}`,
    '',
    '## Cursor CLI',
    '',
    `- **Available:** ${cursor.available}`,
    '',
    '## Entries',
    '',
    '| id | enabled | status | type | path_exists | open_eligible | signal | first issue |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map((r) => {
      const issue = (r.issues && r.issues[0]) || '—';
      return `| ${r.id} | ${r.enabled} | ${r.status} | ${r.type} | ${r.path_exists} | ${r.open_eligible} | ${r.row_signal} | ${String(issue).replace(/\|/g, '/')} |`;
    }),
    '',
    '## Law',
    '',
    payload.law,
    '',
  ].join('\n');
  fs.writeFileSync(OUT_MD, md, 'utf8');

  console.log(JSON.stringify({ ok: true, overall_signal: worst, out_json: OUT_JSON, out_md: OUT_MD }, null, 2));
  process.exit(exitCode);
}

main();
