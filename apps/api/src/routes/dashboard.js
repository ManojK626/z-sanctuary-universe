// Z: apps\api\src\routes\dashboard.js
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

const MoodSchema = z.enum(['calm', 'balanced', 'warning', 'overload', 'celebrate']);

function registryCompletion() {
  try {
    const registryPath = path.join(process.cwd(), '..', '..', 'docs', 'z_module_registry.json');
    const raw = fs.readFileSync(registryPath, 'utf8');
    const data = JSON.parse(raw);
    const modules = Array.isArray(data.modules) ? data.modules : [];
    const total = modules.reduce((sum, m) => sum + (m.weight || 0), 0);
    const done = modules.reduce((sum, m) => sum + (m.done ? m.weight || 0 : 0), 0);
    return total > 0 ? Math.round((done / total) * 100) : 0;
  } catch (err) {
    return 0;
  }
}

function computeMood({ completionPct, openIssues, failingChecks, last24hErrors }) {
  if (failingChecks > 0 || last24hErrors > 10) {
    return {
      mood: 'warning',
      message: 'Stability risk detected. Address root failures first.',
      skk: 'Stabilize: fix failing checks and recurring errors.',
      rkpk: 'Slow down. One root fix at a time. You are doing well.',
    };
  }

  if (openIssues > 25 || completionPct < 35) {
    return {
      mood: 'overload',
      message: 'System load is high. Focus on essentials and rest cycles.',
      skk: 'Reduce scope. Prioritize top root blockers.',
      rkpk: 'Gentle pace. You are building a legacy.',
    };
  }

  if (completionPct >= 80) {
    return {
      mood: 'celebrate',
      message: 'Major milestones aligned. Celebrate progress responsibly.',
      skk: 'Lock releases. Tag versions. Protect stability.',
      rkpk: 'Take a breath. Enjoy the glow you earned.',
    };
  }

  if (completionPct >= 50) {
    return {
      mood: 'balanced',
      message: 'Balanced momentum. Continue root-first improvements.',
      skk: 'Keep the chain clean: lint, tests, build, docs.',
      rkpk: 'Keep it kind and steady. Consistency beats intensity.',
    };
  }

  return {
    mood: 'calm',
    message: 'System stable. Proceed with priority roots.',
    skk: 'Advance the next root task.',
    rkpk: 'Stay gentle with yourself and the process.',
  };
}

export async function dashboardRoutes(app) {
  app.get('/dashboard/state', async () => {
    const completionPct = registryCompletion();
    const openIssues = 0;
    const failingChecks = 0;
    const last24hErrors = 0;

    const response = {
      completionPct,
      signals: { openIssues, failingChecks, last24hErrors },
      ...computeMood({ completionPct, openIssues, failingChecks, last24hErrors }),
    };

    response.mood = MoodSchema.parse(response.mood);
    return response;
  });
}
