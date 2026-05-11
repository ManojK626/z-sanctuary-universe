// Z: scripts\create_release_snapshot.js
import { cpSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const releaseDate = process.argv[2] || new Date().toISOString().slice(0, 10);
const base = join(process.cwd(), 'releases', releaseDate);

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function copyFiles(files, targetDir) {
  files.forEach((file) => {
    const name = file.split(/[/\\]/).pop();
    cpSync(file, join(targetDir, name), { recursive: true });
  });
}

ensureDir(base);
ensureDir(join(base, 'docs'));
ensureDir(join(base, 'assets'));
ensureDir(join(base, 'bots'));
ensureDir(join(base, 'handoff'));

const docs = [
  'docs/Living-Workspace-Brief.md',
  'docs/executive_living_workspace_summary.md',
  'docs/technical_living_workspace_summary.md',
  'docs/living_workspace_manifest.json',
];
copyFiles(docs, join(base, 'docs'));

cpSync(
  join(process.cwd(), 'packages', 'living-workspace-package'),
  join(base, 'assets', 'living-workspace-package'),
  { recursive: true }
);

writeFileSync(
  join(base, 'bots', 'README.md'),
  `# AI & MiniAI Inventory

Included in this release:
- \`/miniai/scribe_bot.js\`, \`navigator_bot.js\`, \`protector_bot.js\`, \`designer_bot.js\`: core assistants.
- \`core/ai_tower/z_super_ghost.js\`: super ghost observer.
- \`core/z_autobranch.js\`, \`z_priority_board.js\`: workflow controllers.

Each component is referenced in the Living Workspace manifest with tags describing their responsibilities.
`
);

writeFileSync(
  join(base, 'README.md'),
  [
    `# Z-Sanctuary Release Snapshot — ${releaseDate}`,
    '',
    'This snapshot captures the current living workspace state for secure sharing.',
    '',
    '## Includes',
    '',
    '- Living Workspace brief + tagged manifest (docs/)',
    '- Harisha/World Pulse insights plus the living package (assets/)',
    '- AI/miniai inventory summary (bots/)',
    '',
    'Place the exported reflection JSON inside the `handoff/` folder before giving this bundle to collaborators.',
    '',
    'To regenerate: run `npm run package:living-workspace`, then `npm run release:create <date>`.',
    '',
  ].join('\n')
);

console.log(`Release snapshot created at ${base}`);
