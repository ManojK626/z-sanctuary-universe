#!/usr/bin/env node
// scripts/z_zuno_coverage_audit.mjs — read-only audit: master registry ↔ repo files ↔ optional doc tokens.
// No network. Evidence only — paths are checked with fs.existsSync.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const PATHS = {
  master: path.join(ROOT, 'data', 'z_master_module_registry.json'),
  zuno_report: path.join(ROOT, 'docs', 'Z-ZUNO-AI-FULL-REPORT.md'),
  master_module_index_suggested: path.join(ROOT, 'docs', 'Z-SANCTUARY-MASTER-MODULE-INDEX.md'),
  z_modules_registry_alt: path.join(ROOT, 'data', 'z_modules_registry.json'),
  z_module_registry_canon: path.join(ROOT, 'data', 'Z_module_registry.json'),
  sovereign: path.join(ROOT, 'data', 'z_sovereign_products_registry.json'),
  out_json: path.join(ROOT, 'data', 'reports', 'z_zuno_coverage_audit.json'),
  out_md: path.join(ROOT, 'data', 'reports', 'z_zuno_coverage_audit.md')
};

const STATUSES = [
  'FOUND_FULL',
  'FOUND_PARTIAL',
  'MISSING',
  'DUPLICATE_OR_CONFLICT',
  'NEEDS_SAFETY_REVIEW',
  'NEEDS_DECISION'
];

function readJson(relPath) {
  const p = path.isAbsolute(relPath) ? relPath : path.join(ROOT, relPath);
  try {
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function readText(relPath) {
  const p = path.isAbsolute(relPath) ? relPath : path.join(ROOT, relPath);
  try {
    if (!fs.existsSync(p)) return null;
    return fs.readFileSync(p, 'utf8');
  } catch {
    return null;
  }
}

function existsRel(rel) {
  if (!rel || typeof rel !== 'string') return false;
  return fs.existsSync(path.join(ROOT, rel.replace(/\\/g, '/')));
}

function loadModules(raw) {
  if (!raw || typeof raw !== 'object') return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.modules)) return raw.modules;
  return [];
}

function mentionsInPlainText(body, tokens) {
  if (!body || !Array.isArray(tokens) || !tokens.length) return { ok: false, matched: [], reason: 'no_tokens' };
  const lower = body.toLowerCase();
  const matched = [];
  for (const t of tokens) {
    const s = String(t).trim();
    if (!s) continue;
    if (lower.includes(s.toLowerCase())) matched.push(s);
  }
  return {
    ok: matched.length > 0,
    matched,
    reason: matched.length ? 'matched' : 'no_match'
  };
}

/** Final status precedence (single label per module). Evidence first; `registry_status` can elevate governance/safety. */
function classifyModule({
  hasDuplicateConflict,
  requiredStatus,
  registryStatus,
  safetyFlagsLen,
  foundCount,
  totalPaths,
  docFailed,
  registryLinkMissing
}) {
  if (hasDuplicateConflict) return 'DUPLICATE_OR_CONFLICT';
  if (requiredStatus === 'needs_decision' || registryStatus === 'decision_required') return 'NEEDS_DECISION';
  /** Declared safety hold — queue even when no filesystem evidence yet */
  if (registryStatus === 'safety_hold') return 'NEEDS_SAFETY_REVIEW';

  const anyEvidenceOnDisk = totalPaths === 0 ? false : foundCount > 0;
  /** Safety queue: flags + at least one expected path resolves */
  if (safetyFlagsLen > 0 && anyEvidenceOnDisk) return 'NEEDS_SAFETY_REVIEW';

  if (totalPaths === 0) return 'FOUND_PARTIAL';

  if (foundCount === 0) return 'MISSING';

  /** Partial coverage or doc/token contract failed */
  if (foundCount < totalPaths || docFailed || (registryLinkMissing && anyEvidenceOnDisk)) return 'FOUND_PARTIAL';

  return 'FOUND_FULL';
}

function summarizeCounts(entries) {
  const o = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  for (const e of entries) {
    if (o[e.status] !== undefined) o[e.status] += 1;
  }
  return o;
}

function orphanRegistryIds(masterIds, linkedZIds, registry) {
  const zmods = registry?.ZModules || registry?.modules || [];
  if (!Array.isArray(zmods)) return [];
  const out = [];
  for (const m of zmods) {
    const id = m?.ZId || m?.id;
    const sid = String(id || '');
    if (!sid) continue;
    if (masterIds.has(sid) || linkedZIds.has(sid)) continue;
    out.push(sid);
  }
  return out.slice(0, 500);
}

function buildMarkdown(summary, modules, orphans, presence) {
  const lines = [];
  lines.push('# Z-Zuno coverage audit');
  lines.push('');
  lines.push('Generated (UTC hint): machinery local time · commit not inferred.');
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push('| Status | Count |');
  lines.push('| --- | ---: |');
  for (const s of STATUSES) {
    lines.push(`| ${s} | ${summary.counts[s] ?? 0} |`);
  }
  lines.push('');

  lines.push('## Reference files presence');
  lines.push('');
  lines.push('| File | Exists |');
  lines.push('| --- | :---: |');
  for (const [k, v] of Object.entries(presence)) {
    lines.push(`| \`${v.path}\` | ${v.exists ? 'yes' : 'no'} |`);
  }
  lines.push('');

  if (orphans.length) {
    lines.push('## Z_module_registry IDs not listed in master (informational)');
    lines.push('');
    lines.push('_First rows only — reconcile by expanding `data/z_master_module_registry.json` or dropping stale registry rows._');
    lines.push('');
    for (const id of orphans.slice(0, 40)) lines.push(`- \`${id}\``);
    if (orphans.length > 40) lines.push(`- _… ${orphans.length - 40} more_`);
    lines.push('');
  }

  for (const s of STATUSES) {
    const group = modules.filter((m) => m.status === s);
    if (!group.length) continue;
    lines.push(`## ${s.replace(/_/g, ' ')}`);
    lines.push('');
    lines.push('| id | registry | evidence (found) | missing paths | notes |');
    lines.push('| --- | --- | --- | --- | --- |');
    for (const m of group) {
      const found = (m.evidence_paths_found || []).map((x) => `\`${x}\``).join('<br>');
      const miss = (m.missing_expected_paths || []).map((x) => `\`${x}\``).join('<br>');
      const reg = m.registry_status || '—';
      const notes = [m.registry_note, ...(m.doc_mention_notes || [])].filter(Boolean).join(' · ');
      lines.push(
        `| ${m.id} | ${String(reg).replace(/\|/g, '\\|')} | ${found || '—'} | ${miss || '—'} | ${notes || '—'} |`
      );
    }
    lines.push('');
  }

  lines.push('## Suggested manual follow-ups');
  lines.push('');
  lines.push('- If `FOUND_PARTIAL` / `MISSING`: add/adjust paths in `data/z_master_module_registry.json` (truth list must stay grounded).');
  lines.push('- `NEEDS_SAFETY_REVIEW`: add boundary docs / gates before UX or automation expands.');
  lines.push('- `docs/Z-ZUNO-AI-FULL-REPORT.md`: extend with summaries from this audit; do not let AI invent file paths there.');
  lines.push('');
  return lines.join('\n');
}

// ─── main ────────────────────────────────────────────────────────────────────

function main() {
  const rawMaster = readJson(PATHS.master);
  const modulesRaw = loadModules(rawMaster);

  const zunoBody = readText(PATHS.zuno_report);

  const regCanon = readJson(PATHS.z_module_registry_canon);
  const regAlt = fs.existsSync(PATHS.z_modules_registry_alt)
    ? readJson(PATHS.z_modules_registry_alt)
    : null;

  const registryZIds = new Set();
  const regList = regCanon?.ZModules || regCanon?.modules || [];
  if (Array.isArray(regList)) {
    for (const m of regList) {
      const id = m?.ZId || m?.id;
      if (id) registryZIds.add(String(id));
    }
  }

  const presence = {
    master: { path: 'data/z_master_module_registry.json', exists: fs.existsSync(PATHS.master) },
    zuno_report: { path: 'docs/Z-ZUNO-AI-FULL-REPORT.md', exists: fs.existsSync(PATHS.zuno_report) },
    master_index_md: {
      path: 'docs/Z-SANCTUARY-MASTER-MODULE-INDEX.md',
      exists: fs.existsSync(PATHS.master_module_index_suggested)
    },
    Z_module_registry: {
      path: 'data/Z_module_registry.json',
      exists: fs.existsSync(PATHS.z_module_registry_canon)
    },
    z_modules_registry: {
      path: 'data/z_modules_registry.json',
      exists: fs.existsSync(PATHS.z_modules_registry_alt)
    },
    sovereign_products: {
      path: 'data/z_sovereign_products_registry.json',
      exists: fs.existsSync(PATHS.sovereign)
    }
  };

  const pathOwners = new Map();
  const moduleRows = [];

  for (const mod of modulesRaw) {
    const id = mod?.id ?? mod?.ZId ?? 'unknown_id';
    const expected_paths = Array.isArray(mod.expected_paths) ? mod.expected_paths : [];
    for (const rel of expected_paths) {
      const norm = String(rel || '').replace(/\\/g, '/');
      if (!norm) continue;
      if (!pathOwners.has(norm)) pathOwners.set(norm, []);
      pathOwners.get(norm).push(id);
    }
  }

  const masterIds = new Set(modulesRaw.map((m) => String(m?.id ?? m?.ZId ?? '')).filter(Boolean));
  const linkedZIds = new Set();
  for (const m of modulesRaw) {
    const lz = m?.z_registry_zid;
    if (lz != null && String(lz).trim()) linkedZIds.add(String(lz).trim());
  }
  const orphans = orphanRegistryIds(masterIds, linkedZIds, regCanon).sort();

  for (const mod of modulesRaw) {
    const id = mod?.id ?? mod?.ZId ?? 'unknown_id';
    const name = mod?.name ?? mod?.ZName ?? id;
    const category = mod?.category ?? '';
    const required_status = mod?.required_status ?? 'planned_or_active';
    const registry_status = mod?.registry_status ?? null;
    const safety_class = mod?.safety_class ?? null;
    const tags = Array.isArray(mod.tags) ? mod.tags : [];
    const notes = typeof mod.notes === 'string' ? mod.notes : '';
    const safety_flags = Array.isArray(mod.safety_flags) ? mod.safety_flags : [];

    const expected_paths = Array.isArray(mod.expected_paths) ? [...mod.expected_paths] : [];

    const evidence_paths_found = [];
    const missing_expected_paths = [];

    for (const rel of expected_paths) {
      const norm = String(rel || '').replace(/\\/g, '/');
      if (!norm) continue;
      const owners = pathOwners.get(norm) || [];
      if (owners.length > 1 && new Set(owners).size > 1) {
        /** duplicate flagged per path below */
      }
      if (existsRel(norm)) evidence_paths_found.push(norm);
      else missing_expected_paths.push(norm);
    }

    const dupForModule = [];
    for (const rel of expected_paths) {
      const norm = String(rel || '').replace(/\\/g, '/');
      const owners = pathOwners.get(norm);
      if (owners && new Set(owners).size > 1) dupForModule.push({ path: norm, owners: [...new Set(owners)] });
    }
    const hasDuplicateConflict = dupForModule.length > 0;

    const docRows = [];
    const docPairs = Array.isArray(mod.doc_mentions) ? mod.doc_mentions : [];
    let docFailed = false;
    for (const dm of docPairs) {
      const docPath = String(dm?.path || dm?.file || '').trim();
      if (!docPath) continue;
      const tokens = Array.isArray(dm.tokens) ? dm.tokens : [];
      const full = path.join(ROOT, docPath);
      const txt = readText(full);
      if (!txt) {
        docRows.push({
          path: docPath,
          present: false,
          ok: false,
          matched: [],
          note: 'doc_file_missing'
        });
        docFailed = true;
        continue;
      }
      const chk = mentionsInPlainText(txt, tokens);
      docRows.push({
        path: docPath,
        present: true,
        ok: chk.ok,
        matched: chk.matched,
        note: chk.reason
      });
      if (tokens.length && !chk.ok) docFailed = true;
    }

    const zidLink = mod.z_registry_zid != null ? String(mod.z_registry_zid) : null;
    let registry_note = null;
    let registryLinkMissing = false;
    if (zidLink && registryZIds.size) {
      if (!registryZIds.has(zidLink)) {
        registryLinkMissing = true;
        registry_note = `z_registry_zid "${zidLink}" not found in Z_module_registry.json`;
      }
    }

    /** Zuno-report coarse mention — advisory only when doc exists */
    let zuno_mention = null;
    if (zunoBody) {
      const blob = `${id} ${name}`.toLowerCase();
      const hit =
        zunoBody.toLowerCase().includes(id.toLowerCase()) ||
        zunoBody.toLowerCase().includes(String(name).toLowerCase());
      zuno_mention = { scanned: PATHS.zuno_report, matched: !!hit };
    } else zuno_mention = { scanned: PATHS.zuno_report, matched: null, note: 'zuno_report_missing' };

    const status = classifyModule({
      hasDuplicateConflict,
      requiredStatus: required_status,
      registryStatus: registry_status,
      safetyFlagsLen: safety_flags.filter(Boolean).length,
      foundCount: evidence_paths_found.length,
      totalPaths: expected_paths.length,
      docFailed,
      registryLinkMissing
    });

    const doc_mention_notes =
      docPairs.length ?
        docRows.map((d) =>
          `${d.path}: ${d.present ? (d.ok ? `ok (${d.matched.join(', ')})` : 'token_miss') : 'missing_file'}`
        )
      : [];

    let recommended_next_action =
      status === 'MISSING'
        ? 'Restore or relocate files; trim expected_paths if the module sun-set.'
      : status === 'FOUND_PARTIAL'
        ? 'Add missing paths or update master registry to match intentional layout.'
      : status === 'DUPLICATE_OR_CONFLICT'
        ? 'Deduplicate expected_paths ownership — one canonical module per path.'
      : status === 'NEEDS_DECISION'
        ? 'Governance: rename as active, deprecate registry row, or add data/core engine file.'
      : status === 'NEEDS_SAFETY_REVIEW'
        ? 'Safety gate doc + disclaimers before user-facing rollout.'
      : 'None — keep synced on registry/manifest churn.';

    moduleRows.push({
      module_id: id,
      module_name: name,
      category,
      registry_status,
      safety_class,
      tags,
      notes,
      status,
      required_status,
      safety_flags,
      evidence_paths_found,
      missing_expected_paths,
      duplicate_path_conflicts: dupForModule,
      doc_checks: docRows,
      doc_mention_notes,
      registry_note,
      zuno_doc_coarse_mention: zuno_mention,
      recommended_next_action
    });
  }

  /** If safety flags but zero paths → still surface as NEEDS_DECISION-like — user prefers safety queue */

  moduleRows.sort((a, b) => a.module_id.localeCompare(b.module_id));

  const counts = summarizeCounts(moduleRows);

  const byReg = {};
  for (const row of moduleRows) {
    const k = row.registry_status || 'unspecified';
    byReg[k] = (byReg[k] || 0) + 1;
  }

  const payload = {
    generated_at: new Date().toISOString(),
    root: ROOT,
    reference_presence: Object.fromEntries(
      Object.entries(presence).map(([k, v]) => [
        k,
        { repo_relative_path: v.path.replace(/\\/g, '/'), exists: v.exists }
      ])
    ),
    ancillary: {
      z_modules_registry_duplicate_check: !!regAlt,
      registry_module_count: registryZIds.size,
      master_module_count: moduleRows.length,
      master_registry_status_histogram: byReg,
      orphaned_registry_ids_sample: orphans.slice(0, 120)
    },
    summary_counts: counts,
    modules: moduleRows,
    readme:
      'Read-only audit. statuses are deterministic from master JSON + filesystem + optional doc tokens. No invented completions.'
  };

  fs.mkdirSync(path.dirname(PATHS.out_json), { recursive: true });
  fs.writeFileSync(PATHS.out_json, JSON.stringify(payload, null, 2), 'utf8');

  const md = buildMarkdown(
    { counts, generated_at: payload.generated_at },
    moduleRows.map((x) => {
      const dupN =
        x.duplicate_path_conflicts?.length ?
          x.duplicate_path_conflicts.map((d) => `${d.path} ← ${d.owners.join(', ')}`).join(' · ')
        : '';
      return {
        id: x.module_id,
        name: x.module_name,
        status: x.status,
        registry_status: x.registry_status,
        evidence_paths_found: x.evidence_paths_found,
        missing_expected_paths: x.missing_expected_paths,
        registry_note: [x.registry_note, dupN ? `duplicate: ${dupN}` : null].filter(Boolean).join(' · ') || null,
        doc_mention_notes: x.doc_mention_notes
      };
    }),
    orphans,
    presence
  );
  fs.writeFileSync(PATHS.out_md, md, 'utf8');

  console.log(JSON.stringify({ ok: true, report_json: PATHS.out_json.replace(ROOT + path.sep, ''), counts }, null, 2));

  /** Default exit 0 (report-only). Optional: node scripts/z_zuno_coverage_audit.mjs --strict-exit */
  if (process.argv.includes('--strict-exit')) {
    const bad = (counts.MISSING || 0) + (counts.DUPLICATE_OR_CONFLICT || 0);
    if (bad > 0) process.exitCode = 1;
  }
}

main();
