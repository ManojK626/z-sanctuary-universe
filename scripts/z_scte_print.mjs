/**
 * Print Z-SCTE comms order and suggested commands from data/z_scte_manifest.json.
 * Usage: node scripts/z_scte_print.mjs  (from ZSanctuary_Universe root)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const MAN = path.join(ROOT, 'data', 'z_scte_manifest.json');

let raw;
try {
  raw = fs.readFileSync(MAN, 'utf8');
} catch (e) {
  console.error(`Z-SCTE: cannot read ${path.relative(ROOT, MAN)} — ${e.message}`);
  process.exit(1);
}

let m;
try {
  m = JSON.parse(raw);
} catch (e) {
  console.error(`Z-SCTE: invalid JSON — ${e.message}`);
  process.exit(1);
}

const line = (s) => console.log(s);
line('');
line('╔══════════════════════════════════════════════════════════════╗');
line('  Z-SCTE — Self Creations Test Ecosystem (comms order)');
line('╚══════════════════════════════════════════════════════════════╝');
line('');
line(m.title || m.id || 'Z-SCTE');
if (m.purpose) line(`  ${m.purpose}`);
if (m.canonical_doc) line(`  Doc: ${m.canonical_doc}`);
line('');

line('— Comms / awareness (in order) —');
const rec = Array.isArray(m.comms_recipients) ? m.comms_recipients : [];
rec.forEach((r, i) => {
  line(`  ${i + 1}. ${r.label || r.id || 'n/a'}`);
  if (r.ref) line(`     ${r.ref}`);
});
line('');

line('— Refresh comms (before heavy scans) —');
const fresh = Array.isArray(m.comms_freshness_commands) ? m.comms_freshness_commands : [];
fresh.forEach((c) => line(`  ${c}`));
line('');

if (m.approval_note) {
  line('— Approval —');
  line(`  ${m.approval_note}`);
  line('');
}

line('— Full scans (after human approval) —');
const scans = Array.isArray(m.full_scans_suggested) ? m.full_scans_suggested : [];
scans.forEach((c) => line(`  ${c}`));
line('');

if (m.completions_doc) {
  line(`Completions / comms unity: ${m.completions_doc}`);
  line('');
}

line('Manifest: data/z_scte_manifest.json');
line('');
