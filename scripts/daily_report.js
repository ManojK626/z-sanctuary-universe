// Z: scripts\daily_report.js
// Node.js script to generate and archive a daily analytics report
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const src = path.join(__dirname, '../core/z_dashboard_data.json');
const archiveDir = path.join(__dirname, '../archive/');
const date = new Date().toISOString().slice(0, 10);
const dest = path.join(archiveDir, `analytics_${date}.json`);
if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir);
if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('[OK] Daily analytics archived:', dest);
} else {
  console.log('[WARN] No dashboard data found to archive.');
}
