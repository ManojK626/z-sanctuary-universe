import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const docPath = resolve('docs', 'Z_FORMULA_INTEGRATED.md');
const requiredSections = ['## Purpose', '## Pillars', '## Implementation Steps', '## Validation'];

async function main() {
  const content = await readFile(docPath, 'utf8');
  for (const section of requiredSections) {
    if (!content.includes(section)) {
      throw new Error(`Missing required section: ${section}`);
    }
  }

  const bulletCount = (content.match(/^-\s+/gm) ?? []).length;
  if (bulletCount < 3) {
    throw new Error('Document must include at least three bullet entries describing pillars or actions.');
  }

  console.log('Z Formula integration document validated successfully.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
