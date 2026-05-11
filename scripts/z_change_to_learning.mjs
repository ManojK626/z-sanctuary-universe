#!/usr/bin/env node
/**
 * Phase 7.5 — Change -> Impact Bridge (CIB)
 * Detect paired README/STATUS updates and generate a draft learning event.
 * Advisory only: does NOT append to learning log.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const REPORTS = path.join(ROOT, 'data', 'reports');
const SNAPSHOT_PATH = path.join(ROOT, 'data', 'change_snapshot.json');
const DRAFT_EVENT_PATH = path.join(ROOT, 'data', 'change_event.json');

const CANDIDATE_PROJECTS = [
  path.join(ROOT, 'projects', 'z-sanctuary-core'),
  path.join(ROOT, 'projects'),
];

function exists(filePath) {
  try {
    fs.accessSync(filePath);
    return true;
  } catch {
    return false;
  }
}

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function readJson(filePath, fallback = null) {
  try {
    if (!exists(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function getMeta(filePath) {
  if (!exists(filePath)) return null;
  const stat = fs.statSync(filePath);
  return {
    mtime_ms: stat.mtimeMs,
    size: stat.size,
  };
}

function discoverPair() {
  for (const base of CANDIDATE_PROJECTS) {
    if (!exists(base)) continue;
    // First: exact path with README.md + STATUS.md
    const directReadme = path.join(base, 'README.md');
    const directStatus = path.join(base, 'STATUS.md');
    if (exists(directReadme) && exists(directStatus)) {
      return {
        project_name: path.basename(base),
        readme: directReadme,
        status: directStatus,
      };
    }

    // Second: shallow scan under /projects/*
    if (path.basename(base) === 'projects') {
      const entries = fs.readdirSync(base, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const folder = path.join(base, entry.name);
        const readme = path.join(folder, 'README.md');
        const status = path.join(folder, 'STATUS.md');
        if (exists(readme) && exists(status)) {
          return { project_name: entry.name, readme, status };
        }
      }
    }
  }
  return null;
}

function changed(prevMeta, curMeta) {
  if (!curMeta) return false;
  if (!prevMeta) return true;
  return prevMeta.mtime_ms !== curMeta.mtime_ms || prevMeta.size !== curMeta.size;
}

function main() {
  const pair = discoverPair();
  if (!pair) {
    console.log('ℹ️ No project with README.md + STATUS.md found under expected /projects paths.');
    return;
  }

  const prev = readJson(SNAPSHOT_PATH, {});
  const current = {
    project_name: pair.project_name,
    readme: getMeta(pair.readme),
    status: getMeta(pair.status),
  };

  const readmeChanged = changed(prev.readme, current.readme);
  const statusChanged = changed(prev.status, current.status);
  const changeDetected = readmeChanged && statusChanged;

  if (changeDetected) {
    const readmePreview = readText(pair.readme).slice(0, 280);
    const statusPreview = readText(pair.status).slice(0, 280);

    const event = {
      timestamp: new Date().toISOString(),
      strategy: 'feature_update',
      domain: 'system',
      source: 'change_bridge',
      project: pair.project_name,
      change_detected: true,
      notes: `README/STATUS updated for ${pair.project_name}.`,
      previews: {
        readme: readmePreview,
        status: statusPreview,
      },
      impact_score: 0,
      successful: null,
    };

    fs.mkdirSync(path.dirname(DRAFT_EVENT_PATH), { recursive: true });
    fs.writeFileSync(DRAFT_EVENT_PATH, `${JSON.stringify(event, null, 2)}\n`, 'utf8');
    console.log(`✅ Change detected -> learning draft created: ${DRAFT_EVENT_PATH}`);
    console.log('🛡️ Advisory only: review/edit draft, then append via ai:learning:flow --apply.');
  } else {
    console.log('ℹ️ No paired README + STATUS change detected since last snapshot.');
  }

  fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(SNAPSHOT_PATH, `${JSON.stringify(current, null, 2)}\n`, 'utf8');
}

main();
