import fs from 'node:fs';
import path from 'node:path';
import { setTimeout } from 'node:timers/promises';

const ROOT = process.cwd();
const LOG_PATH = path.join(ROOT, 'data', 'reports', 'incident_notifications.log');
const OFFSET_PATH = path.join(ROOT, 'data', 'reports', 'incident_notifications.offset');
const WEBHOOK_URL = process.env.INCIDENT_WEBHOOK_URL || '';

if (!WEBHOOK_URL) {
  console.error('INCIDENT_WEBHOOK_URL missing; set it to your Chronicle/Slack webhook');
  process.exit(1);
}

async function sendNotification(line) {
  try {
    const resp = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `Z Incident: ${line}`,
      }),
    });
    if (!resp.ok) {
      console.error('Webhook delivery failed', await resp.text());
    }
  } catch (err) {
    console.error('Webhook error', err.message);
  }
}

function readOffset() {
  try {
    if (!fs.existsSync(OFFSET_PATH)) return 0;
    return Number(fs.readFileSync(OFFSET_PATH, 'utf8')) || 0;
  } catch {
    return 0;
  }
}

function writeOffset(value) {
  fs.writeFileSync(OFFSET_PATH, String(value), 'utf8');
}

async function processNewLines() {
  try {
    if (!fs.existsSync(LOG_PATH)) return;
    const stat = fs.statSync(LOG_PATH);
    let offset = readOffset();
    if (offset >= stat.size) return;
    const stream = fs.createReadStream(LOG_PATH, { start: offset, encoding: 'utf8' });
    let buffer = '';
    for await (const chunk of stream) {
      buffer += chunk;
      let idx;
      while ((idx = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, idx).trim();
        buffer = buffer.slice(idx + 1);
        if (line) await sendNotification(line);
      }
    }
    offset = stat.size;
    writeOffset(offset);
  } catch (err) {
    console.error('Incident notifier error', err.message);
  }
}

/* eslint-disable no-constant-condition */
async function watchLoop() {
  while (true) {
    await processNewLines();
    await setTimeout(3000);
  }
}
/* eslint-enable no-constant-condition */

watchLoop();
