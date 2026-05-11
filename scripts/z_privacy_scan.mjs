import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const RAW_DIR = path.join(ROOT, 'uploads', 'raw');
const APPROVED_DIR = path.join(ROOT, 'uploads', 'approved');
const QUARANTINED_DIR = path.join(ROOT, 'uploads', 'quarantined');
const PERSONAL_VAULT_DIR = path.join(ROOT, 'vault', 'personal');
const REPORT_DIR = path.join(ROOT, 'data', 'reports', 'privacy');
const REPORT_PATH = path.join(REPORT_DIR, 'z_privacy_report.json');

const APPLY_ACTIONS = process.argv.includes('--apply-actions');

const PATTERNS = {
  EMAIL: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  PHONE: /\b(?:\+?\d{1,3}[\s-]?)?\d{7,15}\b/,
  IBAN: /\b[A-Z]{2}\d{2}[A-Z0-9]{1,30}\b/,
  ADDRESS: /\b\d{1,5}\s+\w+(?:\s+\w+){0,2}\s+(?:Street|St|Road|Rd|Ave|Avenue|Lane|Ln|Drive|Dr)\b/i,
  DOB: /\b(?:\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2})\b/,
  FAMILY_CONTEXT: /\b(?:mum|mother|dad|father|sister|brother|wife|husband|son|daughter)\b/i,
  RELIGION: /\b(?:islam|muslim|hindu|christian|religion|church|mosque|temple)\b/i,
  MEDICAL: /\b(?:diagnosis|treatment|hospital|medical|therapy|prescription|patient)\b/i,
};

const WEIGHTS = {
  EMAIL: 0.2,
  PHONE: 0.2,
  IBAN: 0.5,
  ADDRESS: 0.3,
  DOB: 0.2,
  FAMILY_CONTEXT: 0.2,
  RELIGION: 0.3,
  MEDICAL: 0.4,
};

const TEXT_EXTENSIONS = new Set([
  '.txt', '.md', '.json', '.js', '.mjs', '.ts', '.tsx', '.jsx', '.yml', '.yaml', '.csv', '.log', '.xml', '.html', '.htm',
]);

function ensureFolders() {
  [
    RAW_DIR,
    APPROVED_DIR,
    QUARANTINED_DIR,
    PERSONAL_VAULT_DIR,
    REPORT_DIR,
  ].forEach((dir) => fs.mkdirSync(dir, { recursive: true }));
}

function calculateRisk(tags) {
  const score = tags.reduce((sum, tag) => sum + (WEIGHTS[tag] || 0), 0);
  return Math.min(Number(score.toFixed(2)), 1);
}

function classify(riskScore) {
  if (riskScore >= 0.6) return 'HIGH_RISK';
  if (riskScore >= 0.3) return 'POSSIBLE_PERSONAL';
  return 'SAFE';
}

function suggestedAction(classification) {
  if (classification === 'SAFE') return 'MOVE_APPROVED';
  if (classification === 'HIGH_RISK') return 'MOVE_QUARANTINED';
  return 'MANUAL_REVIEW';
}

function isTextFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (TEXT_EXTENSIONS.has(ext)) return true;
  return ext === '';
}

function safeReadUtf8(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function walkFiles(folder) {
  const results = [];
  const stack = [folder];
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile()) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

function analyzeFile(filePath) {
  const relative = path.relative(ROOT, filePath).replaceAll('\\', '/');
  if (!isTextFile(filePath)) {
    return {
      file: relative,
      tags: [],
      risk_score: 0,
      classification: 'SAFE',
      suggested_action: 'MOVE_APPROVED',
      note: 'Binary or unsupported text extension; skipped content scan.',
    };
  }

  const content = safeReadUtf8(filePath);
  if (content === null) {
    return {
      file: relative,
      tags: [],
      risk_score: 0,
      classification: 'SAFE',
      suggested_action: 'MOVE_APPROVED',
      note: 'Unreadable as utf8; skipped content scan.',
    };
  }

  const tags = [];
  for (const [key, regex] of Object.entries(PATTERNS)) {
    if (regex.test(content)) tags.push(key);
  }
  const risk = calculateRisk(tags);
  const classification = classify(risk);
  return {
    file: relative,
    tags,
    risk_score: risk,
    classification,
    suggested_action: suggestedAction(classification),
  };
}

function moveTargetFor(classification) {
  if (classification === 'SAFE') return APPROVED_DIR;
  if (classification === 'HIGH_RISK') return QUARANTINED_DIR;
  return PERSONAL_VAULT_DIR;
}

function applyActions(results) {
  const moved = [];
  for (const item of results) {
    const source = path.join(ROOT, item.file);
    const targetRoot = moveTargetFor(item.classification);
    const fileName = path.basename(source);
    const target = path.join(targetRoot, fileName);
    if (!fs.existsSync(source)) continue;
    if (source === target) continue;
    fs.renameSync(source, target);
    moved.push({
      from: path.relative(ROOT, source).replaceAll('\\', '/'),
      to: path.relative(ROOT, target).replaceAll('\\', '/'),
      classification: item.classification,
    });
  }
  return moved;
}

function run() {
  ensureFolders();

  const files = walkFiles(RAW_DIR);
  const results = files.map(analyzeFile);
  const summary = {
    scanned: results.length,
    safe: results.filter((x) => x.classification === 'SAFE').length,
    possible_personal: results.filter((x) => x.classification === 'POSSIBLE_PERSONAL').length,
    high_risk: results.filter((x) => x.classification === 'HIGH_RISK').length,
  };

  const moved = APPLY_ACTIONS ? applyActions(results) : [];
  const payload = {
    generated_at: new Date().toISOString(),
    root: path.relative(ROOT, RAW_DIR).replaceAll('\\', '/'),
    apply_actions: APPLY_ACTIONS,
    summary,
    moved,
    results,
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(payload, null, 2));
  console.log(`Privacy scan complete. ${summary.scanned} files analyzed.`);
  console.log(`Report: ${REPORT_PATH}`);
}

run();
