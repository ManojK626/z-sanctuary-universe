// Z: core/signal-bus/audit-log.js
import fs from 'node:fs';
import path from 'node:path';

const AUDIT_DIR = process.env.Z_AUDIT_DIR || path.join(process.cwd(), 'data', 'vaults');
const AUDIT_FILE = path.join(AUDIT_DIR, 'sanctuary_audit.jsonl');

function ensureDir() {
  fs.mkdirSync(AUDIT_DIR, { recursive: true });
}

export function appendAudit(signal) {
  ensureDir();
  fs.appendFileSync(AUDIT_FILE, JSON.stringify(signal) + '\n', 'utf8');
}
