import fs from 'node:fs';
import path from 'node:path';

const p = path.join(process.cwd(), 'data', 'mirrorSoul', 'adaptive_fuel.jsonl');
if (!fs.existsSync(p)) {
  console.log('(no adaptive_fuel file yet; run a reflect first)');
  process.exit(0);
}
const lines = fs
  .readFileSync(p, 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean);
lines.slice(-12).forEach((x) => console.log(x));
