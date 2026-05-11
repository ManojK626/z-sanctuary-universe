import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const INCIDENT_DIR = path.join(REPORTS_DIR, 'incidents');
const STATE_PATH = path.join(REPORTS_DIR, 'z_incident_triage_state.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_incident_triage.md');
const LOG_PATH = path.join(REPORTS_DIR, 'incident_notifications.log');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readState() {
  try {
    if (!fs.existsSync(STATE_PATH)) return { processed: [] };
    return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
  } catch {
    return { processed: [] };
  }
}

function writeState(state) {
  fs.writeFileSync(STATE_PATH, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
}

function summarizeFile(filename) {
  const full = path.join(INCIDENT_DIR, filename);
  const raw = fs.readFileSync(full, 'utf8');
  const firstLine = raw.split('\n')[0] || '';
  return firstLine.replace(/^#\s*/, '').trim() || filename;
}

function render(newFiles) {
  const header = [
    '# Incident Digest',
    '',
    `- Generated: ${new Date().toISOString()}`,
    `- New incidents: ${newFiles.length}`,
    '',
    '## Details',
  ];
  const rows = newFiles.length
    ? newFiles.map((file) => `- ${summarizeFile(file)} (${file})`)
    : ['- none'];
  ensureDir(REPORTS_DIR);
  fs.writeFileSync(OUT_MD, header.concat(rows, ['']).join('\n'), 'utf8');
}

function notifyChannels(newFiles) {
  const payload = newFiles.map((file) => summarizeFile(file));
  const line = `${new Date().toISOString()} · New incidents: ${payload.length} · ${payload.join(' | ')}`;
  fs.appendFileSync(LOG_PATH, `${line}\n`, 'utf8');
  console.log(`[incident-triage] notified Chronicle/Slack: ${line}`);
}

function findIncidents() {
  if (!fs.existsSync(INCIDENT_DIR)) return [];
  return fs
    .readdirSync(INCIDENT_DIR)
    .filter((file) => file.endsWith('.md'))
    .sort();
}

function main() {
  ensureDir(INCIDENT_DIR);
  const state = readState();
  const existing = findIncidents();
  const newFiles = existing.filter((file) => !state.processed.includes(file));
  if (newFiles.length) {
    state.processed = [...state.processed, ...newFiles];
    writeState(state);
    notifyChannels(newFiles);
  }
  render(newFiles);
  console.log(`Incident triage complete: ${newFiles.length} new`);
}

main();
