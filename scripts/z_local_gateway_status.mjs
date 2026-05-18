#!/usr/bin/env node
/**
 * Z-LOCAL-GATEWAY-DIRECTORY — read-only status report (no start/kill/deploy).
 * Writes data/reports/z_local_gateway_status.{json,md}
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import net from 'node:net';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const registryPath = path.join(repoRoot, 'data/z_local_gateway_registry.json');
const reportsDir = path.join(repoRoot, 'data/reports');

function loadRegistry() {
  const raw = fs.readFileSync(registryPath, 'utf8');
  return JSON.parse(raw);
}

function tcpPortOpen(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host }, () => {
      socket.end();
      resolve(true);
    });
    socket.setTimeout(800);
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => resolve(false));
  });
}

async function probeHealth(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    return { ok: true, status: res.status };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

async function evaluateProject(project) {
  const root = project.root?.replace(/\//g, path.sep);
  const pathExists = root ? fs.existsSync(root) : false;
  const row = {
    id: project.id,
    name: project.name,
    status: project.status,
    root: project.root,
    path_exists: pathExists,
    frontend: null,
    api: null,
    open_url: null,
    start_command: null,
  };

  if (project.frontend) {
    const fe = project.frontend;
    const port = fe.port_default;
    const listening = port ? await tcpPortOpen(Number(port)) : false;
    row.frontend = {
      port_default: port ?? null,
      url_default: fe.url_default ?? null,
      listening,
    };
    row.open_url = fe.url_default ?? null;
    row.start_command = fe.command ?? fe.command_default ?? null;
  }

  if (project.api) {
    const api = project.api;
    const opPort = api.port_operator;
    const defPort = api.port_repo_default;
    const opListening = opPort ? await tcpPortOpen(Number(opPort)) : false;
    const defListening = defPort ? await tcpPortOpen(Number(defPort)) : false;
    let health = null;
    const healthUrl = opListening
      ? api.health_url_operator
      : defListening
        ? api.health_url_repo_default
        : (api.health_url_operator ?? api.health_url_repo_default);
    if (healthUrl) {
      health = await probeHealth(healthUrl);
    }
    row.api = {
      port_operator: opPort ?? null,
      port_repo_default: defPort ?? null,
      operator_listening: opListening,
      repo_default_listening: defListening,
      health_url: healthUrl ?? null,
      health,
    };
    if (!row.start_command) {
      row.start_command = api.command_powershell ?? api.command ?? api.command_default ?? null;
    }
  }

  return row;
}

async function main() {
  const registry = loadRegistry();
  const projects = [];
  for (const p of registry.projects ?? []) {
    projects.push(await evaluateProject(p));
  }

  const displayReady = projects.filter(
    (p) => p.path_exists && p.frontend?.listening && (p.api?.health?.ok ?? !p.api)
  );
  const needsStart = projects.filter(
    (p) => p.status === 'active' && p.path_exists && p.frontend && !p.frontend.listening
  );

  let overall = 'SAFE';
  if (projects.some((p) => !p.path_exists)) overall = 'NEEDS HUMAN DECISION';
  else if (needsStart.length > 0) overall = 'NEEDS HUMAN DECISION';

  const report = {
    schema: 'z.local.gateway.status.v1',
    generated_at: new Date().toISOString(),
    golden_law: registry.golden_law,
    overall_verdict: overall,
    display_ready_count: displayReady.length,
    projects,
    operator_notes: [
      'Gateway observes only — does not auto-start services.',
      'For Roulette: API on 18080 + VITE_API_URL + dev:dashboard for display on 5190.',
      'Do not use VS Code Live Server on index.html.',
    ],
  };

  fs.mkdirSync(reportsDir, { recursive: true });
  const jsonPath = path.join(reportsDir, 'z_local_gateway_status.json');
  const mdPath = path.join(reportsDir, 'z_local_gateway_status.md');
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2) + '\n');

  const lines = [
    '# Z-Local Gateway Status',
    '',
    `Generated: ${report.generated_at}`,
    `Verdict: **${overall}**`,
    '',
    report.golden_law,
    '',
    '## Projects',
    '',
  ];
  for (const p of projects) {
    lines.push(`### ${p.name} (\`${p.id}\`)`);
    lines.push(`- Path: ${p.path_exists ? 'OK' : 'MISSING'}`);
    if (p.frontend) {
      lines.push(
        `- Frontend port ${p.frontend.port_default}: ${p.frontend.listening ? 'LISTENING' : 'not listening'}`
      );
      lines.push(`- Open: ${p.frontend.url_default ?? '—'}`);
    }
    if (p.api) {
      lines.push(
        `- API operator ${p.api.port_operator}: ${p.api.operator_listening ? 'LISTENING' : 'not listening'}`
      );
      if (p.api.health) {
        lines.push(
          `- Health: ${p.api.health.ok ? `HTTP ${p.api.health.status}` : `fail — ${p.api.health.error ?? 'unknown'}`}`
        );
      }
    }
    if (p.start_command) lines.push(`- Start hint: \`${p.start_command}\``);
    lines.push('');
  }
  fs.writeFileSync(mdPath, lines.join('\n'));

  console.log(`Wrote ${path.relative(repoRoot, jsonPath)}`);
  console.log(`Wrote ${path.relative(repoRoot, mdPath)}`);
  console.log(`VERDICT: ${overall}`);
  process.exit(overall === 'BLOCKED' ? 2 : overall === 'NEEDS HUMAN DECISION' ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
