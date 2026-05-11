#!/usr/bin/env node
/**
 * Verify MDGEV tile hrefs and Z-Q&A&RP dashboard_ui resolve to files under this hub root.
 * No HTTP server required. Writes data/reports/z_dashboard_registry_verify.json + .md
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'data', 'reports');
const MDG = path.join(ROOT, 'data', 'z_mdg_dashboard_registry.json');
const QARP = path.join(ROOT, 'data', 'z_qa_rp_registry.json');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function hrefToFs(href) {
  const h = String(href || '').trim();
  if (!h.startsWith('/')) return null;
  return path.join(ROOT, h.replace(/^\//, '').split('/').join(path.sep));
}

function main() {
  const generatedAt = new Date().toISOString();
  const checks = [];

  if (fs.existsSync(MDG)) {
    const reg = readJson(MDG);
    const tiles = Array.isArray(reg.tiles) ? reg.tiles : [];
    for (const t of tiles) {
      const href = t.href || '';
      const fsPath = hrefToFs(href);
      const ok = fsPath && fs.existsSync(fsPath) && fs.statSync(fsPath).isFile();
      checks.push({
        kind: 'mdgev_tile',
        id: t.id || '—',
        title: t.title || '—',
        href,
        fsPath: fsPath || null,
        pass: Boolean(ok),
        note: ok ? 'ok' : fsPath ? 'missing_file' : 'href_not_hub_absolute',
      });
    }
  } else {
    checks.push({
      kind: 'mdgev_registry',
      pass: false,
      note: `missing ${path.relative(ROOT, MDG)}`,
    });
  }

  if (fs.existsSync(QARP)) {
    const q = readJson(QARP);
    const ui = q.dashboard_ui;
    const fsPath = hrefToFs(ui);
    const ok = fsPath && fs.existsSync(fsPath) && fs.statSync(fsPath).isFile();
    checks.push({
      kind: 'qa_rp_registry',
      id: q.id || 'z-qa-rp',
      dashboard_ui: ui || null,
      fsPath: fsPath || null,
      pass: Boolean(ok),
      note: ok ? 'ok' : fsPath ? 'missing_file' : 'dashboard_ui_invalid',
    });
  } else {
    checks.push({
      kind: 'qa_rp_registry',
      pass: false,
      note: `missing ${path.relative(ROOT, QARP)}`,
    });
  }

  const failed = checks.filter((c) => c.pass === false);
  const status = failed.length === 0 ? 'green' : 'hold';

  const payload = {
    generated_at: generatedAt,
    hub_root: ROOT,
    status,
    totals: { checks: checks.length, passed: checks.filter((c) => c.pass).length, failed: failed.length },
    checks,
    note:
      status === 'green'
        ? 'All registered dashboard paths exist on disk.'
        : 'One or more hrefs missing — fix tiles or files.',
  };

  fs.mkdirSync(REPORTS, { recursive: true });
  const outJson = path.join(REPORTS, 'z_dashboard_registry_verify.json');
  const outMd = path.join(REPORTS, 'z_dashboard_registry_verify.md');
  fs.writeFileSync(outJson, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const md = [
    '# Z Dashboard registry verify',
    '',
    `- Generated: ${generatedAt}`,
    `- Status: **${status.toUpperCase()}**`,
    `- Hub root: \`${ROOT}\``,
    '',
    '## Checks',
    ...checks.map((c) => {
      const mark = c.pass ? '[x]' : '[ ]';
      const ref = c.href || c.dashboard_ui || c.note || '';
      return `- ${mark} ${c.kind} ${c.id ? `\`${c.id}\`` : ''} ${ref} — ${c.note || ''}`;
    }),
    '',
    payload.note,
    '',
  ];
  fs.writeFileSync(outMd, md.join('\n'), 'utf8');

  console.log(`Z dashboard registry verify: ${outJson} (${status})`);
  if (status !== 'green') process.exit(1);
}

main();
