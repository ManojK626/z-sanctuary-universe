import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(process.cwd());
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const CONFIG_PATH = path.join(ROOT, 'observability', 'otel', 'collector.shadow.yaml');
const STATUS_PATH = path.join(REPORTS_DIR, 'z_otel_shadow_status.json');
const STATUS_MD_PATH = path.join(REPORTS_DIR, 'z_otel_shadow_status.md');

fs.mkdirSync(REPORTS_DIR, { recursive: true });

function hasBinary(command) {
  try {
    execSync(command, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

const now = new Date().toISOString();
const configExists = fs.existsSync(CONFIG_PATH);
const dockerAvailable = hasBinary('docker --version');
const otelcolAvailable = hasBinary('otelcol --version');

const status = {
  generated_at: now,
  mode: 'shadow',
  runtime_mutation: false,
  config_path: path.relative(ROOT, CONFIG_PATH).replace(/\\/g, '/'),
  checks: [
    {
      id: 'collector_config_exists',
      pass: configExists,
      note: configExists ? 'collector.shadow.yaml present' : 'missing collector.shadow.yaml',
    },
    {
      id: 'docker_available',
      pass: dockerAvailable,
      note: dockerAvailable
        ? 'docker binary detected (optional for shadow)'
        : 'docker not detected (shadow mode still valid)',
    },
    {
      id: 'otelcol_available',
      pass: otelcolAvailable,
      note: otelcolAvailable
        ? 'otelcol binary detected (optional for shadow)'
        : 'otelcol not detected (shadow mode still valid)',
    },
  ],
};

status.status = status.checks.find((c) => c.id === 'collector_config_exists' && !c.pass)
  ? 'attention'
  : 'ready';

fs.writeFileSync(STATUS_PATH, `${JSON.stringify(status, null, 2)}\n`, 'utf8');

const md = [
  '# Z OTel Shadow Status',
  '',
  `Generated: ${now}`,
  `Mode: ${status.mode}`,
  `Status: ${status.status.toUpperCase()}`,
  '',
  '## Checks',
  ...status.checks.map((item) => `- ${item.pass ? 'PASS' : 'WARN'} ${item.id}: ${item.note}`),
  '',
  'Operational note: shadow mode is non-invasive and does not alter runtime pipelines.',
  '',
].join('\n');

fs.writeFileSync(STATUS_MD_PATH, md, 'utf8');
console.log('Z OTel shadow status written.');
