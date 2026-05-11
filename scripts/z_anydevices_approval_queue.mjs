#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const QUEUE_JSON = path.join(ROOT, 'data', 'reports', 'z_anydevices_approval_queue.json');
const QUEUE_MD = path.join(ROOT, 'data', 'reports', 'z_anydevices_approval_queue.md');
const SECURITY_SCAN_JSON = path.join(ROOT, 'data', 'reports', 'z_anydevices_security_scan.json');
const SECURITY_SCAN_MAX_AGE_MIN = 30;

function nowIso() {
  return new Date().toISOString();
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readQueue() {
  try {
    if (!fs.existsSync(QUEUE_JSON)) return null;
    return JSON.parse(fs.readFileSync(QUEUE_JSON, 'utf8'));
  } catch {
    return null;
  }
}

function readSecurityScan() {
  try {
    if (!fs.existsSync(SECURITY_SCAN_JSON)) return null;
    return JSON.parse(fs.readFileSync(SECURITY_SCAN_JSON, 'utf8'));
  } catch {
    return null;
  }
}

function minutesSince(ts) {
  if (!ts) return Number.POSITIVE_INFINITY;
  const ms = Date.parse(ts);
  if (Number.isNaN(ms)) return Number.POSITIVE_INFINITY;
  return Math.floor((Date.now() - ms) / 60000);
}

function writeQueue(data) {
  ensureDir(QUEUE_JSON);
  const payload = {
    generated_at: data.generated_at || nowIso(),
    mode: 'approval-required',
    policy: {
      auto_connect: false,
      auto_execute: false,
      approval_required: true,
      note: 'No device action runs without explicit human approval.',
    },
    approvals: Array.isArray(data.approvals) ? data.approvals : [],
  };
  fs.writeFileSync(QUEUE_JSON, JSON.stringify(payload, null, 2));
  writeMarkdown(payload);
}

function writeMarkdown(payload) {
  const approvals = payload.approvals || [];
  const pending = approvals.filter((x) => x.status === 'pending');
  const approved = approvals.filter((x) => x.status === 'approved');
  const rejected = approvals.filter((x) => x.status === 'rejected');
  const lines = [
    '# Z AnyDevices Approval Queue',
    '',
    `Generated: ${payload.generated_at}`,
    `Mode: ${payload.mode}`,
    '',
    '## Policy',
    `- auto_connect: ${payload.policy.auto_connect}`,
    `- auto_execute: ${payload.policy.auto_execute}`,
    `- approval_required: ${payload.policy.approval_required}`,
    `- note: ${payload.policy.note}`,
    '',
    '## Counts',
    `- pending: ${pending.length}`,
    `- approved: ${approved.length}`,
    `- rejected: ${rejected.length}`,
    '',
    '## Pending',
    ...(pending.length
      ? pending.map((x) => `- ${x.id}: ${x.device_label} · ${x.intent} · requested_by=${x.requested_by}`)
      : ['- none']),
    '',
  ];
  fs.writeFileSync(QUEUE_MD, lines.join('\n'));
}

function initQueue() {
  const existing = readQueue();
  if (existing) {
    writeQueue({ ...existing, generated_at: nowIso() });
    console.log(`Queue refreshed: ${QUEUE_JSON}`);
    return;
  }
  writeQueue({ generated_at: nowIso(), approvals: [] });
  console.log(`Queue initialized: ${QUEUE_JSON}`);
}

function nextId(approvals) {
  const prefix = 'ZAD';
  const nums = approvals
    .map((x) => String(x.id || ''))
    .filter((id) => id.startsWith(`${prefix}-`))
    .map((id) => Number(id.slice(prefix.length + 1)))
    .filter((n) => Number.isFinite(n));
  const n = nums.length ? Math.max(...nums) + 1 : 1;
  return `${prefix}-${String(n).padStart(4, '0')}`;
}

function parseArgs(rest) {
  const out = {};
  let i = 0;
  while (i < rest.length) {
    const token = rest[i];
    if (token.startsWith('--')) {
      const key = token.slice(2);
      const value = rest[i + 1];
      out[key] = value === undefined || value.startsWith('--') ? true : value;
      i += value === undefined || value.startsWith('--') ? 1 : 2;
    } else {
      out._ = out._ || [];
      out._.push(token);
      i += 1;
    }
  }
  return out;
}

function listQueue(queue) {
  const approvals = queue.approvals || [];
  if (!approvals.length) {
    console.log('No AnyDevices approvals found.');
    return;
  }
  approvals.forEach((x) => {
    console.log(`${x.id} ${x.status.toUpperCase()} ${x.device_label} | ${x.intent} | by=${x.requested_by}`);
  });
}

function requestApproval(queue, options) {
  const approvals = queue.approvals || [];
  const deviceLabel = String(options.device || options.device_label || '').trim();
  const intent = String(options.intent || '').trim();
  const requestedBy = String(options.by || options.requested_by || 'operator').trim();
  if (!deviceLabel || !intent) {
    console.log(
      'Usage: node scripts/z_anydevices_approval_queue.mjs request --device "USB Camera" --intent "telemetry_read" --by "zuno" [--risk low]'
    );
    return;
  }
  const item = {
    id: nextId(approvals),
    status: 'pending',
    device_label: deviceLabel,
    intent,
    risk: String(options.risk || 'low'),
    requested_by: requestedBy,
    requested_at: nowIso(),
    approved_by: null,
    approved_at: null,
    decision_note: '',
  };
  approvals.push(item);
  writeQueue({ generated_at: nowIso(), approvals });
  console.log(`Requested approval: ${item.id}`);
}

function decide(queue, id, status, options) {
  const approvals = queue.approvals || [];
  const item = approvals.find((x) => x.id === id);
  if (!item) {
    console.log(`Approval not found: ${id}`);
    return;
  }
  if (item.status !== 'pending') {
    console.log(`Approval already decided: ${id} (${item.status})`);
    return;
  }
  if (status === 'approved' && options.override !== true) {
    const scan = readSecurityScan();
    const scanStatus = String(scan?.status || 'unknown').toLowerCase();
    const ageMin = minutesSince(scan?.generated_at);
    if (scanStatus !== 'green' || ageMin > SECURITY_SCAN_MAX_AGE_MIN) {
      console.log(
        `Approval blocked: security scan must be green and <= ${SECURITY_SCAN_MAX_AGE_MIN}m old (status=${scanStatus}, age=${ageMin}m).`
      );
      console.log('Run: node scripts/z_anydevices_security_scan.mjs');
      console.log('If intentional exception is required, re-run with: --override true');
      return;
    }
  }
  item.status = status;
  item.approved_by = String(options.by || 'operator');
  item.approved_at = nowIso();
  item.decision_note = String(options.note || '');
  item.security_scan_ref =
    status === 'approved'
      ? {
          generated_at: readSecurityScan()?.generated_at || null,
          status: readSecurityScan()?.status || 'unknown',
        }
      : null;
  writeQueue({ generated_at: nowIso(), approvals });
  console.log(`${status === 'approved' ? 'Approved' : 'Rejected'}: ${id}`);
}

function usage() {
  console.log('Z AnyDevices Approval Queue');
  console.log('Commands:');
  console.log('  node scripts/z_anydevices_approval_queue.mjs init');
  console.log('  node scripts/z_anydevices_approval_queue.mjs list');
  console.log(
    '  node scripts/z_anydevices_approval_queue.mjs request --device "USB Camera" --intent "telemetry_read" --by "zuno" --risk low'
  );
  console.log('  node scripts/z_anydevices_approval_queue.mjs approve ZAD-0001 --by "zuno" --note "safe read-only"');
  console.log('  node scripts/z_anydevices_approval_queue.mjs reject ZAD-0001 --by "zuno" --note "scope too broad"');
}

const [command, ...rest] = process.argv.slice(2);
const options = parseArgs(rest);
if (!command) {
  usage();
  process.exit(0);
}

if (command === 'init') {
  initQueue();
  process.exit(0);
}

const queue = readQueue() || { generated_at: nowIso(), approvals: [] };

if (command === 'list') {
  listQueue(queue);
} else if (command === 'request') {
  requestApproval(queue, options);
} else if (command === 'approve') {
  decide(queue, options._?.[0], 'approved', options);
} else if (command === 'reject') {
  decide(queue, options._?.[0], 'rejected', options);
} else {
  usage();
}
