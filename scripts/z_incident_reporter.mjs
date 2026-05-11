import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const INCIDENT_DIR = path.join(REPORTS_DIR, 'incidents');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeIncident(target) {
  ensureDir(INCIDENT_DIR);
  const filename = `${new Date().toISOString().replace(/[:.]/g, '-')}-${target.id}.md`;
  const pathFile = path.join(INCIDENT_DIR, filename);
  const body = [
    `# Incident (${target.id})`,
    '',
    `- Detected at: ${new Date().toISOString()}`,
    `- Status: ${target.status}`,
    `- Required: ${target.expected_status}`,
    `- Actual: ${target.actual_status}`,
    `- Age (minutes): ${target.age_minutes}`,
    `- Max age minutes: ${target.max_age_minutes}`,
    `- Note: ${target.note}`,
    '',
    '### Mitigation',
    '- ',
  ].join('\n');
  fs.writeFileSync(pathFile, body, 'utf8');
  return pathFile;
}

function reportIncidents(payload) {
  const incidents = payload.checks.filter((c) => !c.pass);
  if (!incidents.length) return null;
  return incidents.map((target) => writeIncident(target));
}

export function createIncidentReport(payload) {
  const generated = reportIncidents(payload);
  if (!generated) return null;
  return generated;
}
