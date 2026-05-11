#!/usr/bin/env node
/**
 * Z-MAOS task router — maps a keyword to a mini-bot lane (read-only suggestion).
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());

function main() {
  const kw = process.argv.slice(2).join(' ').trim().toLowerCase();
  if (!kw) {
    console.log('Usage: npm run z:maos-route -- <keyword>');
    console.log('Examples: workspace, extension, health, phase, consent, risk');
    process.exitCode = 1;
    return;
  }
  let data;
  try {
    data = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools', 'z-maos', 'mini_bot_routes.json'), 'utf8'));
  } catch {
    console.error('Missing tools/z-maos/mini_bot_routes.json');
    process.exitCode = 1;
    return;
  }
  const hit = (data.routes || []).find((r) => kw.includes(r.keyword) || r.keyword.includes(kw));
  if (!hit) {
    console.log(`No route match for "${kw}". See docs/z-maos/MINI_BOT_DISPATCH_RULES.md`);
    return;
  }
  console.log('Z-MAOS route suggestion (doctrine only):');
  console.log(`  Keyword match: ${hit.keyword}`);
  console.log(`  Bot lane: ${hit.bot}`);
  console.log(`  Doc: ${hit.doc}`);
}

main();
