import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const REGISTRY_PATH = path.join(ROOT, 'data', 'z_garage_capability_registry.json');
const OUTPUT_PATH = path.join(ROOT, 'data', 'reports', 'z_ci_intelligence.json');

const registryData = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
const projects = registryData.registry;

function scoreProject(project) {
  let score = 100;

  if (project.weaknesses.includes('no_scripts')) score -= 40;
  if (project.weaknesses.includes('no_tests')) score -= 20;
  if (project.weaknesses.includes('no_lint')) score -= 15;
  if (project.type === 'unknown') score -= 25;

  return Math.max(score, 0);
}

function getPriority(score) {
  if (score >= 85) return 'HIGH';
  if (score >= 60) return 'MEDIUM';
  return 'LOW';
}

function generateRecommendations(project) {
  const recs = [];

  if (project.weaknesses.includes('no_scripts')) {
    recs.push('Add basic npm scripts (start/build/test/lint)');
  }

  if (project.weaknesses.includes('no_tests')) {
    recs.push('Introduce a minimal test suite');
  }

  if (project.weaknesses.includes('no_lint')) {
    recs.push('Add ESLint or equivalent linting');
  }

  if (project.type === 'unknown') {
    recs.push('Clarify project role (frontend/backend/ai/infra)');
  }

  return recs;
}

const intelligence = projects.map((p) => {
  const score = scoreProject(p);

  return {
    name: p.name,
    path: p.path,
    type: p.type,
    score,
    priority: getPriority(score),
    weaknesses: p.weaknesses,
    recommendations: generateRecommendations(p),
  };
});

const summary = {
  total_projects: intelligence.length,
  high_priority: intelligence.filter((p) => p.priority === 'HIGH').length,
  medium_priority: intelligence.filter((p) => p.priority === 'MEDIUM').length,
  low_priority: intelligence.filter((p) => p.priority === 'LOW').length,
};

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });

fs.writeFileSync(
  OUTPUT_PATH,
  JSON.stringify(
    {
      generated_at: new Date().toISOString(),
      summary,
      projects: intelligence,
    },
    null,
    2,
  ),
  'utf8',
);

console.log('ZCI Core analysis complete');
console.log(`Output: ${OUTPUT_PATH}`);
