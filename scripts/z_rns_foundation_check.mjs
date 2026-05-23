import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve('.');
const required = [
  'docs/Z_RNS_FOUNDATION_HUB.md',
  'docs/PHASE_Z_RNS_FOUNDATION_1_GREEN_RECEIPT.md',
  'data/z_rns_foundation_schema.json',
  'dashboard/Html/z-rns-foundation-hub.html',
  'dashboard/scripts/z-rns-foundation-hub.js',
  'dashboard/styles/z-rns-foundation-hub.css',
];

async function main() {
  const missing = [];
  for (const rel of required) {
    try {
      await access(resolve(root, rel));
    } catch {
      missing.push(rel);
    }
  }

  const schema = JSON.parse(
    await readFile(resolve(root, 'data/z_rns_foundation_schema.json'), 'utf8')
  );
  const red = [];
  const passed = [];

  if (missing.length) red.push(`missing files: ${missing.join(', ')}`);
  else passed.push('all foundation hub files present');

  if (schema.schema !== 'z.rns.foundation.schema.v1')
    red.push('schema must be z.rns.foundation.schema.v1');
  else passed.push('foundation schema ok');

  if (schema.phase !== 'Z-RNS-FOUNDATION-1') red.push('schema phase must be Z-RNS-FOUNDATION-1');
  else passed.push('phase Z-RNS-FOUNDATION-1');

  const js = await readFile(resolve(root, 'dashboard/scripts/z-rns-foundation-hub.js'), 'utf8');
  if (js.includes('fetch(') && js.includes('http'))
    red.push('foundation hub must not call external HTTP fetch');
  else passed.push('no external fetch in hub script');

  if (!js.includes('indexedDB')) red.push('hub script must use IndexedDB');
  else passed.push('IndexedDB present');

  if (!js.includes('not legal advice') && !js.includes('LOCAL MOCK')) {
    red.push('hub script should include local mock / not legal advice labeling');
  } else passed.push('mock / boundary labeling present');

  const html = await readFile(resolve(root, 'dashboard/Html/z-rns-foundation-hub.html'), 'utf8');
  if (!html.includes('id="zrnsCauseCanvas"')) red.push('canvas panel id zrnsCauseCanvas missing in HTML');
  else passed.push('canvas panel present in HTML');

  if (!html.includes('data-tab="canvas"')) red.push('canvas tab missing in HTML');
  else passed.push('canvas tab present');

  if (!js.includes('renderCauseCanvasMap')) red.push('renderCauseCanvasMap missing in hub script');
  else passed.push('renderCauseCanvasMap present');

  var canvasFn = js.match(/function renderCauseCanvasMap\(\)[\s\S]*?\n  \}/);
  if (canvasFn && /put\s*\(/.test(canvasFn[0])) {
    red.push('canvas renderer must not mutate IndexedDB');
  } else if (js.includes('renderCauseCanvasMap')) {
    passed.push('canvas map is read-only (no put from renderer)');
  }

  const signal = red.length ? 'RED' : 'GREEN';
  console.log(`Z-RNS foundation signal: ${signal}`);
  passed.forEach((p) => console.log(`  ok: ${p}`));
  if (red.length) {
    red.forEach((r) => console.error(`  RED: ${r}`));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
