#!/usr/bin/env node
/**
 * Phase 8.1 — Z-DSR (Duplicate / Similar / Redundant Intelligence)
 * Read-only advisory analyzer over capability registry.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const REGISTRY_PATH = path.join(ROOT, 'data', 'z_garage_capability_registry.json');
const POLICY_PATH = path.join(ROOT, 'data', 'z_dsr_policy.json');
const OUTPUT_JSON = path.join(ROOT, 'data', 'reports', 'z_dsr_analysis.json');
const OUTPUT_MD = path.join(ROOT, 'data', 'reports', 'z_dsr_analysis.md');

function readJsonSafe(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function normalizeName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[-_\s]/g, '');
}

function similarity(a, b) {
  const aNorm = normalizeName(a);
  const bNorm = normalizeName(b);
  if (!aNorm || !bNorm) return 0;
  if (aNorm === bNorm) return 1;
  let matches = 0;
  for (let i = 0; i < Math.min(aNorm.length, bNorm.length); i += 1) {
    if (aNorm[i] === bNorm[i]) matches += 1;
  }
  return matches / Math.max(aNorm.length, bNorm.length);
}

function compileNameRegex(patterns) {
  const out = [];
  for (const p of patterns || []) {
    try {
      out.push(new RegExp(p, 'i'));
    } catch {
      // ignore invalid regex
    }
  }
  return out;
}

function shouldExcludeEntry(entry, policy, nameRegexList) {
  const p = String(entry?.path || '').toLowerCase();
  const n = String(entry?.name || '').toLowerCase();
  const pathExclude = (policy?.exclude_path_substrings || []).some((sub) =>
    p.includes(String(sub).toLowerCase())
  );
  if (pathExclude) return true;
  return nameRegexList.some((re) => re.test(n));
}

function analyzeRegistry(registry, policy) {
  const entries = Array.isArray(registry?.registry) ? registry.registry : [];
  const nameRegexList = compileNameRegex(policy?.exclude_name_regex);
  const excludedEntries = entries.filter((e) => shouldExcludeEntry(e, policy, nameRegexList));
  const filteredEntries = entries.filter((e) => !shouldExcludeEntry(e, policy, nameRegexList));

  const duplicates = [];
  const similar = [];
  const conflicts = [];
  const redundant_data = [];

  // Duplicates by normalized name
  const byName = {};
  for (const e of filteredEntries) {
    const key = normalizeName(e?.name || '');
    if (!key) continue;
    if (!byName[key]) byName[key] = [];
    byName[key].push(e);
  }
  for (const group of Object.values(byName)) {
    if (group.length <= 1) continue;
    duplicates.push({
      type: 'module',
      items: group.map((x) => x.path).filter(Boolean),
      confidence: 'high',
      reason: 'Identical normalized names',
    });
  }

  // Similar names (excluding exact duplicates)
  for (let i = 0; i < filteredEntries.length; i += 1) {
    for (let j = i + 1; j < filteredEntries.length; j += 1) {
      const a = filteredEntries[i];
      const b = filteredEntries[j];
      const s = similarity(a?.name, b?.name);
      if (s > 0.7 && s < 1) {
        similar.push({
          type: 'module',
          items: [a?.path, b?.path].filter(Boolean),
          confidence: s > 0.85 ? 'high' : 'medium',
          score: Number(s.toFixed(3)),
          reason: 'High name similarity',
        });
      }
    }
  }

  // Capability overlap conflicts (responsibility signal)
  const byCapability = {};
  for (const e of filteredEntries) {
    const caps = Array.isArray(e?.capabilities) ? e.capabilities : [];
    for (const cap of caps) {
      if (!byCapability[cap]) byCapability[cap] = [];
      byCapability[cap].push(e);
    }
  }
  for (const [capability, group] of Object.entries(byCapability)) {
    if (group.length > 2) {
      conflicts.push({
        type: 'capability_overlap',
        capability,
        items: group.map((x) => x.path).filter(Boolean),
        reason: 'Multiple modules share same capability',
      });
    }
  }

  // Redundant data signal: repeated export-style module names
  const exportLike = entries.filter((e) => /exports?\//i.test(String(e?.path || '')));
  if (exportLike.length > 3) {
    redundant_data.push({
      type: 'export_archive_overlap',
      count: exportLike.length,
      reason: 'Many export-like folders present in capability registry',
      sample_items: exportLike.slice(0, 8).map((e) => e.path),
    });
  }

  return {
    duplicates,
    similar,
    conflicts,
    redundant_data,
    total_entries: entries.length,
    analyzed_entries: filteredEntries.length,
    excluded_entries: entries.length - filteredEntries.length,
    excluded_paths_sample: excludedEntries.slice(0, 10).map((e) => e.path).filter(Boolean),
  };
}

function recommendations(result) {
  const rec = [];
  if (result.duplicates.length > 0) {
    rec.push('Resolve duplicate modules: choose canonical source, then merge or isolate alternatives.');
  }
  if (result.similar.length > 5) {
    rec.push('Review naming and role boundaries for highly similar modules to avoid confusion drift.');
  }
  if (result.conflicts.length > 0) {
    rec.push('Clarify ownership where capabilities overlap; assign one owner and mark extensions.');
  }
  if (result.redundant_data.length > 0) {
    rec.push('Consider archive policy for export-style folders to reduce redundant registry noise.');
  }
  if (rec.length === 0) rec.push('No major duplication or overlap risk detected.');
  return rec;
}

function statusFromSummary(summary) {
  if (summary.conflicts > 0) return 'attention';
  if (summary.similar > 5 || summary.duplicates > 0) return 'watch';
  return 'ok';
}

function main() {
  const registry = readJsonSafe(REGISTRY_PATH);
  const policy = readJsonSafe(POLICY_PATH, null) || {};
  if (!registry) {
    console.log('ℹ️ Z-DSR: capability registry missing; skipping.');
    return;
  }

  const result = analyzeRegistry(registry, policy);
  const summary = {
    duplicates: result.duplicates.length,
    similar: result.similar.length,
    conflicts: result.conflicts.length,
    redundant_data: result.redundant_data.length,
    analyzed_entries: result.analyzed_entries,
    excluded_entries: result.excluded_entries,
  };
  const status = statusFromSummary(summary);

  const out = {
    generated_at: new Date().toISOString(),
    summary,
    status,
    duplicates: result.duplicates,
    similar: result.similar,
    conflicts: result.conflicts,
    redundant_data: result.redundant_data,
    recommendations: recommendations(result),
    policy_hints: {
      excluded_entries: summary.excluded_entries,
      excluded_paths_sample: result.excluded_paths_sample,
      note: 'Excluded by data/z_dsr_policy.json to reduce archive/export noise.',
    },
    policy: {
      file: 'data/z_dsr_policy.json',
      applied: true,
    },
    governance_note: 'Advisory only — no auto-merge, no auto-delete, no execution override.',
  };

  fs.mkdirSync(path.dirname(OUTPUT_JSON), { recursive: true });
  fs.writeFileSync(OUTPUT_JSON, `${JSON.stringify(out, null, 2)}\n`, 'utf8');

  const md = [
    '# Z-DSR Analysis Report',
    '',
    `- Generated: ${out.generated_at}`,
    `- Status: **${out.status.toUpperCase()}**`,
    '',
    '## Summary',
    `- Duplicates: ${summary.duplicates}`,
    `- Similar: ${summary.similar}`,
    `- Conflicts: ${summary.conflicts}`,
    `- Redundant data: ${summary.redundant_data}`,
    `- Analyzed entries: ${summary.analyzed_entries} (excluded ${summary.excluded_entries} by policy)`,
    '',
    '## Recommendations',
    ...out.recommendations.map((r) => `- ${r}`),
    '',
    out.governance_note,
    '',
  ];
  fs.writeFileSync(OUTPUT_MD, md.join('\n'), 'utf8');
  console.log(`✅ Z-DSR Analysis: ${OUTPUT_JSON} status=${out.status}`);
}

main();
