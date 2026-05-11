#!/usr/bin/env node
/**
 * Pre-import verification for ChatGPT → hub handoff.
 * - Detects duplicate hub_doc_path claims
 * - Warns when manifest (z_module_manifest) may already cover a topic
 * - Lists rename history (previous_names) for Folder Manager / operator alignment
 * - Scans docs/chatgpt_exports/: optional .z-chatgpt-tracking.json sidecars, drift vs export_folder,
 *   orphan folders, fuzzy link hints; writes z_chatgpt_export_folder_index.json
 * Does not modify ChatGPT; read-only.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TRACKING = path.join(ROOT, 'data', 'z_chatgpt_projects_tracking.json');
const MANIFEST = path.join(ROOT, 'data', 'z_module_manifest.json');
const EXPORTS = path.join(ROOT, 'docs', 'chatgpt_exports');
const SIDECAR = '.z-chatgpt-tracking.json';
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_chatgpt_integration_verify.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_chatgpt_integration_verify.md');
const OUT_EXPORT_INDEX = path.join(ROOT, 'data', 'reports', 'z_chatgpt_export_folder_index.json');

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

const TOKEN_STOP = new Set([
  'sanctuary',
  'module',
  'dashboard',
  'planned',
  'core',
  'governance',
  'layer',
  'zstatus',
  'zdescription'
]);

function tokens(s) {
  return String(s || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 4 && !TOKEN_STOP.has(w));
}

function exportSlugs() {
  if (!fs.existsSync(EXPORTS)) return [];
  return fs
    .readdirSync(EXPORTS, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function readSidecar(folderAbs) {
  const p = path.join(folderAbs, SIDECAR);
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return { _parse_error: true };
  }
}

function normalizeKey(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  const row = new Array(n + 1);
  for (let j = 0; j <= n; j += 1) row[j] = j;
  for (let i = 1; i <= m; i += 1) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= n; j += 1) {
      const cur = row[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = cur;
    }
  }
  return row[n];
}

function similarityStrings(a, b) {
  const na = normalizeKey(a);
  const nb = normalizeKey(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return 0.85;
  const dist = levenshtein(na, nb);
  const max = Math.max(na.length, nb.length);
  return max ? 1 - dist / max : 0;
}

/** Best fuzzy score between a folder basename and an entry (id, display_name, previous_names). */
function entryFolderScore(folderName, entry) {
  const candidates = [
    entry.id,
    entry.display_name,
    ...(Array.isArray(entry.previous_names) ? entry.previous_names : [])
  ].filter(Boolean);
  let best = 0;
  for (const c of candidates) {
    const s = similarityStrings(folderName, c);
    if (s > best) best = s;
  }
  return best;
}

/**
 * Export folder alignment: sidecars, drift vs export_folder, orphans, fuzzy link hints.
 */
function analyzeExportFolders(entries, diskFolders) {
  const byId = new Map(entries.map((e) => [e.id, e]));
  const exportFolderDrift = [];
  const sidecarUnknownId = [];
  const missingExportFolder = [];
  const sidecarFoldersById = new Map();

  for (const folder of diskFolders) {
    const abs = path.join(EXPORTS, folder);
    const sc = readSidecar(abs);
    if (!sc || sc._parse_error) continue;
    const sid = sc.id != null ? String(sc.id).trim() : '';
    if (!sid) continue;
    const ent = byId.get(sid);
    if (!ent) {
      sidecarUnknownId.push({ folder, sidecar_id: sid, note: 'No tracking entry with this id — fix sidecar or add row.' });
      continue;
    }
    if (!sidecarFoldersById.has(sid)) sidecarFoldersById.set(sid, []);
    sidecarFoldersById.get(sid).push(folder);
    const tracked = ent.export_folder != null ? String(ent.export_folder).trim() : '';
    if (tracked && tracked !== folder) {
      exportFolderDrift.push({
        entry_id: sid,
        tracked_export_folder: tracked,
        actual_folder_on_disk: folder,
        note:
          'Sidecar id matches entry but folder name differs from export_folder — update data/z_chatgpt_projects_tracking.json export_folder to the actual folder name (and append old folder name to previous_names if it was a ChatGPT rename).'
      });
    } else if (!tracked) {
      exportFolderDrift.push({
        entry_id: sid,
        tracked_export_folder: null,
        actual_folder_on_disk: folder,
        note: 'Sidecar links this folder to entry — set export_folder in tracking JSON to this folder name for clarity.'
      });
    }
  }

  const sidecarDuplicateId = [];
  for (const [sid, folders] of sidecarFoldersById) {
    if (folders.length > 1) {
      sidecarDuplicateId.push({
        entry_id: sid,
        folders: [...folders].sort(),
        note: 'Multiple export folders use the same sidecar id — keep one folder + sidecar; remove or fix the others.'
      });
    }
  }

  for (const e of entries) {
    const ef = e.export_folder != null ? String(e.export_folder).trim() : '';
    if (!ef) continue;
    if (!diskFolders.includes(ef)) {
      missingExportFolder.push({
        entry_id: e.id,
        export_folder: ef,
        note: 'Tracking export_folder missing on disk — folder renamed/removed or typo. Check sidecars in other folders or add export.'
      });
    }
  }

  const linkedByExportField = new Set(
    entries
      .map((e) => (e.export_folder != null ? String(e.export_folder).trim() : ''))
      .filter(Boolean)
  );
  const orphanFolders = diskFolders.filter((f) => {
    if (linkedByExportField.has(f)) return false;
    const abs = path.join(EXPORTS, f);
    const sc = readSidecar(abs);
    const sid = sc && !sc._parse_error && sc.id != null ? String(sc.id).trim() : '';
    if (sid && byId.has(sid)) return false;
    return true;
  });

  const suggestions = [];
  for (const folder of orphanFolders) {
    let best = { entry_id: null, score: 0 };
    for (const e of entries) {
      if (e.export_folder && String(e.export_folder).trim()) continue;
      const sc = readSidecar(path.join(EXPORTS, folder));
      if (sc && !sc._parse_error && sc.id) continue;
      const s = entryFolderScore(folder, e);
      if (s > best.score) best = { entry_id: e.id, score: s };
    }
    if (best.entry_id && best.score >= 0.45) {
      suggestions.push({
        folder,
        suggested_entry_id: best.entry_id,
        score: Math.round(best.score * 1000) / 1000,
        note: 'Possible match — confirm, add export_folder + optional sidecar, or ignore if unrelated.'
      });
    }
  }

  suggestions.sort((a, b) => b.score - a.score);

  return {
    export_folder_drift: exportFolderDrift,
    sidecar_unknown_id: sidecarUnknownId,
    missing_export_folder: missingExportFolder,
    orphan_export_folders: orphanFolders,
    fuzzy_suggested_links: suggestions.slice(0, 20),
    sidecar_duplicate_id: sidecarDuplicateId,
    counts: {
      drift: exportFolderDrift.length,
      sidecar_unknown_id: sidecarUnknownId.length,
      sidecar_duplicate_id: sidecarDuplicateId.length,
      missing_export_folder: missingExportFolder.length,
      orphans: orphanFolders.length,
      fuzzy_suggestions: Math.min(suggestions.length, 20)
    }
  };
}

function buildExportFolderIndex(entries, diskFolders) {
  const byExportFolder = new Map();
  for (const e of entries) {
    const ef = e.export_folder != null ? String(e.export_folder).trim() : '';
    if (ef) byExportFolder.set(ef, e.id);
  }
  const folders = diskFolders.map((folder) => {
    const abs = path.join(EXPORTS, folder);
    const sc = readSidecar(abs);
    const ok = sc && !sc._parse_error ? sc : null;
    const sid = ok?.id != null ? String(ok.id).trim() : '';
    return {
      folder,
      sidecar_id: sid || null,
      tracking_export_folder_for_entry: byExportFolder.get(folder) ?? null
    };
  });
  return { folders };
}

function main() {
  const tracking = readJson(TRACKING);
  const manifest = readJson(MANIFEST);
  const modules = Array.isArray(manifest?.ZModules) ? manifest.ZModules : [];
  const entries = Array.isArray(tracking?.entries) ? tracking.entries : [];

  const duplicatePaths = [];
  const pathCount = new Map();
  for (const e of entries) {
    const hp = e.hub_doc_path ? String(e.hub_doc_path).trim() : '';
    if (!hp) continue;
    pathCount.set(hp, (pathCount.get(hp) || 0) + 1);
  }
  for (const [p, n] of pathCount) {
    if (n > 1) duplicatePaths.push({ hub_doc_path: p, count: n });
  }

  const pathExists = [];
  const pathMissing = [];
  for (const e of entries) {
    const hp = e.hub_doc_path ? String(e.hub_doc_path).trim() : '';
    if (!hp) continue;
    const abs = path.join(ROOT, hp.replace(/^\//, ''));
    if (fs.existsSync(abs)) pathExists.push({ id: e.id, hub_doc_path: hp });
    else pathMissing.push({ id: e.id, hub_doc_path: hp });
  }

  const manifestWarnings = [];
  const seenWarn = new Set();
  for (const e of entries) {
    const name = `${e.display_name || ''} ${e.id || ''}`;
    const tk = tokens(name);
    if (tk.length === 0) continue;
    for (const m of modules) {
      const blob = `${m.ZId || ''} ${m.ZDescription || ''}`.toLowerCase();
      const hit = tk.filter((t) => blob.includes(t));
      if (hit.length >= 2 && e.status !== 'integrated') {
        const key = `${e.id}::${m.ZId}`;
        if (seenWarn.has(key)) continue;
        seenWarn.add(key);
        manifestWarnings.push({
          entry_id: e.id,
          display_name: e.display_name,
          manifest_zid: m.ZId,
          matched_tokens: hit.slice(0, 5),
          note: 'Possible overlap — confirm before duplicating work in docs.'
        });
        if (manifestWarnings.length >= 25) break;
      }
    }
    if (manifestWarnings.length >= 25) break;
  }

  const renameNotes = [];
  for (const e of entries) {
    const prev = Array.isArray(e.previous_names) ? e.previous_names : [];
    if (prev.length > 0) {
      renameNotes.push({
        entry_id: e.id,
        current_display_name: e.display_name,
        previous_names: prev,
        note: 'When ChatGPT renames a project folder, append the old label here and update display_name. Folder Manager + Cursor use this file — run folder:align after hub path changes if policy says so.'
      });
    }
  }

  const slugs = exportSlugs();
  const exportAnalysis = analyzeExportFolders(entries, slugs);
  const exportIndex = {
    generated_at: new Date().toISOString(),
    exports_root: 'docs/chatgpt_exports',
    sidecar_filename: SIDECAR,
    ...buildExportFolderIndex(entries, slugs)
  };

  const readyToProcess = entries.filter(
    (e) => e.status === 'not_started' && !e.hub_doc_path && duplicatePaths.length === 0
  );
  const skipRedundant = entries.filter((e) => e.status === 'integrated' || (e.hub_doc_path && pathExists.some((p) => p.id === e.id)));

  const payload = {
    generated_at: new Date().toISOString(),
    tracking_file: 'data/z_chatgpt_projects_tracking.json',
    counts: {
      entries: entries.length,
      duplicate_hub_paths: duplicatePaths.length,
      manifest_similarity_warnings: manifestWarnings.length,
      rename_tracked: renameNotes.length,
      chatgpt_export_folders: slugs.length,
      export_folder_drift: exportAnalysis.counts.drift,
      export_sidecar_unknown_id: exportAnalysis.counts.sidecar_unknown_id,
      export_sidecar_duplicate_id: exportAnalysis.counts.sidecar_duplicate_id,
      export_folder_missing_on_disk: exportAnalysis.counts.missing_export_folder,
      export_orphan_folders: exportAnalysis.counts.orphans,
      export_fuzzy_suggestions: exportAnalysis.counts.fuzzy_suggestions
    },
    duplicate_hub_paths: duplicatePaths,
    hub_path_exists: pathExists,
    hub_path_missing: pathMissing,
    manifest_similarity_warnings: manifestWarnings.slice(0, 40),
    rename_notes: renameNotes,
    export_folders: slugs,
    export_folder_alignment: {
      export_folder_drift: exportAnalysis.export_folder_drift,
      sidecar_unknown_id: exportAnalysis.sidecar_unknown_id,
      sidecar_duplicate_id: exportAnalysis.sidecar_duplicate_id,
      missing_export_folder: exportAnalysis.missing_export_folder,
      orphan_export_folders: exportAnalysis.orphan_export_folders,
      fuzzy_suggested_links: exportAnalysis.fuzzy_suggested_links
    },
    suggested_order: [
      'Fix duplicate hub_doc_path entries before importing.',
      'Fix invalid sidecar ids (unknown id) or duplicate sidecar ids on disk.',
      'Resolve export_folder drift: update data/z_chatgpt_projects_tracking.json so export_folder matches the folder name (sidecar id is stable across renames).',
      'Resolve manifest overlap warnings by linking entry.manifest_zid or skipping redundant docs.',
      'After ChatGPT UI rename: update display_name + previous_names in tracking JSON.',
      'Run npm run folder:align or Z: Folder Manager tasks when docs/ tree changes per policy.'
    ],
    ready_to_process_ids: readyToProcess.map((e) => e.id).slice(0, 30),
    likely_skip_ids: skipRedundant.map((e) => e.id).slice(0, 30),
    export_folder_index_file: 'data/reports/z_chatgpt_export_folder_index.json'
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.writeFileSync(OUT_EXPORT_INDEX, `${JSON.stringify(exportIndex, null, 2)}\n`, 'utf8');

  const ex = exportAnalysis;
  const md = [
    '# ChatGPT integration verify',
    '',
    `Generated: ${payload.generated_at}`,
    '',
    '## Summary',
    '',
    `- Entries tracked: **${payload.counts.entries}**`,
    `- Duplicate hub paths: **${payload.counts.duplicate_hub_paths}**`,
    `- Manifest similarity warnings: **${payload.counts.manifest_similarity_warnings}**`,
    `- Rename history rows: **${payload.counts.rename_tracked}**`,
    `- Folders under docs/chatgpt_exports/: **${payload.counts.chatgpt_export_folders}**`,
    `- Export folder drift (sidecar vs \`export_folder\`): **${payload.counts.export_folder_drift}**`,
    `- Sidecar unknown id: **${payload.counts.export_sidecar_unknown_id}** · duplicate id: **${payload.counts.export_sidecar_duplicate_id}**`,
    `- Tracking \`export_folder\` missing on disk: **${payload.counts.export_folder_missing_on_disk}** · orphan export folders: **${payload.counts.export_orphan_folders}**`,
    '',
    '## Export folders (automatic alignment)',
    '',
    'Sidecar file per folder: `docs/chatgpt_exports/<folder>/.z-chatgpt-tracking.json` with `{ "ZFormat": "v1", "id": "<entry id>" }`. After a **rename on disk**, update **`export_folder`** in tracking to match; the sidecar **id** stays the same so verify can detect drift.',
    '',
    '### Drift / alignment',
    ex.export_folder_drift.length
      ? ex.export_folder_drift
          .map(
            (d) =>
              `- **${d.entry_id}**: tracked \`${d.tracked_export_folder ?? '∅'}\` → actual \`${d.actual_folder_on_disk}\` — ${d.note}`
          )
          .join('\n')
      : '- none',
    '',
    '### Sidecar errors',
    (() => {
      const lines = [
        ...ex.sidecar_unknown_id.map((x) => `- folder \`${x.folder}\`: unknown id \`${x.sidecar_id}\``),
        ...ex.sidecar_duplicate_id.map(
          (x) => `- **${x.entry_id}**: ${x.folders.map((f) => `\`${f}\``).join(', ')}`
        )
      ];
      return lines.length ? lines.join('\n') : '- none';
    })(),
    '### Missing export folder on disk',
    ex.missing_export_folder.length
      ? ex.missing_export_folder.map((m) => `- **${m.entry_id}**: \`${m.export_folder}\``).join('\n')
      : '- none',
    '',
    '### Orphan export folders (no export_folder + no valid sidecar link)',
    ex.orphan_export_folders.length ? ex.orphan_export_folders.map((f) => `- \`${f}\``).join('\n') : '- none',
    '',
    '### Fuzzy link suggestions (confirm manually)',
    ex.fuzzy_suggested_links.length
      ? ex.fuzzy_suggested_links
          .map((s) => `- \`${s.folder}\` → **${s.suggested_entry_id}** (score ${s.score})`)
          .join('\n')
      : '- none',
    '',
    '## Duplicate hub_doc_path (must fix)',
    duplicatePaths.length ? duplicatePaths.map((d) => `- \`${d.hub_doc_path}\` (${d.count}×)`).join('\n') : '- none',
    '',
    '## Manifest overlap warnings (sample)',
    manifestWarnings.length
      ? manifestWarnings
          .slice(0, 15)
          .map((w) => `- **${w.entry_id}** ↔ \`${w.manifest_zid}\` (${w.matched_tokens.join(', ')})`)
          .join('\n')
      : '- none',
    '',
    '## Rename tracking',
    renameNotes.length
      ? renameNotes.map((r) => `- **${r.entry_id}**: was ${r.previous_names.join(' · ')}`).join('\n')
      : '- none (add previous_names when ChatGPT renames a folder)',
    '',
    '## Suggested operator order',
    ...payload.suggested_order.map((s) => `- ${s}`),
    '',
    `Full JSON: \`${path.relative(ROOT, OUT_JSON).replace(/\\/g, '/')}\``,
    `Export folder index: \`${path.relative(ROOT, OUT_EXPORT_INDEX).replace(/\\/g, '/')}\``,
    ''
  ].join('\n');

  fs.writeFileSync(OUT_MD, md, 'utf8');
  process.stdout.write(`ChatGPT integration verify → ${OUT_JSON}\n`);
  process.stdout.write(`ChatGPT export folder index → ${OUT_EXPORT_INDEX}\n`);

  const badSidecar =
    exportAnalysis.sidecar_unknown_id.length > 0 || exportAnalysis.sidecar_duplicate_id.length > 0;
  const bad = duplicatePaths.length > 0 || badSidecar;
  process.exitCode = bad ? 1 : 0;
  if (duplicatePaths.length > 0) {
    process.stderr.write('[chatgpt:verify] Duplicate hub_doc_path entries — fix tracking JSON before bulk import.\n');
  }
  if (badSidecar) {
    process.stderr.write(
      '[chatgpt:verify] Invalid export sidecars — fix .z-chatgpt-tracking.json (unknown id or duplicate id per entry).\n'
    );
  }
}

main();
