// Z: scripts\package_living_workspace.js
import { copyFileSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(process.cwd(), 'packages', 'living-workspace-package');
const DOCS = [
  join(process.cwd(), 'docs', 'Living-Workspace-Brief.md'),
  join(process.cwd(), 'docs', 'living_workspace_manifest.json'),
];

mkdirSync(OUTPUT_DIR, { recursive: true });

DOCS.forEach((file) => {
  const target = join(OUTPUT_DIR, file.split(/[/\\]/).pop());
  copyFileSync(file, target);
});

writeFileSync(
  join(OUTPUT_DIR, 'README.txt'),
  `Living Workspace Package
Includes:
- Living-Workspace-Brief.md (executive summary)
- living_workspace_manifest.json (script tags)

Run the reflection export inside the dashboard (Insight card → Export reflection) to refresh the JSON snapshot.
You can also zip this folder if you need to share it externally.
`
);

console.log(`Living workspace package created at ${OUTPUT_DIR}`);
