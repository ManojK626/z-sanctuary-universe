import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_anydevices_security_scan.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_anydevices_security_scan.md');

function runPowerShellJson(command) {
  const exec = spawnSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', command],
    { encoding: 'utf8', timeout: 20000 }
  );
  if (exec.error || exec.status !== 0) {
    return { ok: false, data: null, error: exec.error?.message || exec.stderr || 'powershell_failed' };
  }
  try {
    return { ok: true, data: JSON.parse(String(exec.stdout || 'null').trim() || 'null'), error: null };
  } catch {
    return { ok: false, data: null, error: 'json_parse_failed' };
  }
}

function normalizeArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function scanRemovableRoots() {
  if (process.platform !== 'win32') {
    return { ok: false, data: [], error: 'non_windows' };
  }
  const cmd = [
    '$ErrorActionPreference="SilentlyContinue";',
    '$drives = Get-CimInstance Win32_LogicalDisk -Filter "DriveType=2" | Select-Object DeviceID,VolumeName,FileSystem,FreeSpace,Size;',
    '$out=@();',
    'foreach ($d in $drives) {',
    '  $root = "$($d.DeviceID)\\";',
    '  $auto = Test-Path (Join-Path $root "autorun.inf");',
    '  $exe = Get-ChildItem -Path $root -File -ErrorAction SilentlyContinue | Where-Object { $_.Extension -match "^\\.(exe|bat|cmd|ps1|vbs|js|scr)$" } | Select-Object -First 20 -ExpandProperty Name;',
    '  $out += [pscustomobject]@{ DeviceID=$d.DeviceID; VolumeName=$d.VolumeName; FileSystem=$d.FileSystem; FreeSpace=$d.FreeSpace; Size=$d.Size; AutorunInf=$auto; RootExecutables=$exe };',
    '}',
    '$out | ConvertTo-Json -Depth 5 -Compress',
  ].join(' ');
  return runPowerShellJson(cmd);
}

function scanDefenderPosture() {
  if (process.platform !== 'win32') {
    return { ok: false, data: null, error: 'non_windows' };
  }
  const cmd = [
    '$ErrorActionPreference="SilentlyContinue";',
    '$s = Get-MpComputerStatus | Select-Object AMServiceEnabled,AntivirusEnabled,AntispywareEnabled,RealTimeProtectionEnabled,QuickScanAge,FullScanAge,NISEnabled,AntivirusSignatureAge;',
    '$s | ConvertTo-Json -Compress',
  ].join(' ');
  return runPowerShellJson(cmd);
}

function classify(defender, drives) {
  const warnings = [];
  const severe = [];

  if (!defender?.AMServiceEnabled) severe.push('Defender service disabled');
  if (!defender?.AntivirusEnabled) severe.push('Antivirus disabled');
  if (!defender?.RealTimeProtectionEnabled) severe.push('Real-time protection disabled');
  if (Number.isFinite(defender?.AntivirusSignatureAge) && defender.AntivirusSignatureAge > 7) {
    warnings.push(`Antivirus signatures old (${defender.AntivirusSignatureAge} days)`);
  }
  if (Number.isFinite(defender?.QuickScanAge) && defender.QuickScanAge > 7) {
    warnings.push(`Quick scan stale (${defender.QuickScanAge} days)`);
  }

  for (const d of drives) {
    if (d.AutorunInf) warnings.push(`autorun.inf present on ${d.DeviceID}`);
    if (Array.isArray(d.RootExecutables) && d.RootExecutables.length) {
      warnings.push(`root executables on ${d.DeviceID}: ${d.RootExecutables.join(', ')}`);
    }
  }

  if (severe.length) return { status: 'blocked', severe, warnings };
  if (warnings.length) return { status: 'warn', severe, warnings };
  return { status: 'green', severe: [], warnings: [] };
}

function run() {
  const scanAt = new Date().toISOString();
  const defenderResp = scanDefenderPosture();
  const driveResp = scanRemovableRoots();

  const drives = normalizeArray(driveResp.data).map((d) => ({
    device: d.DeviceID || null,
    volume_name: d.VolumeName || null,
    fs: d.FileSystem || null,
    free_gb: Number.isFinite(Number(d.FreeSpace))
      ? Number((Number(d.FreeSpace) / 1024 / 1024 / 1024).toFixed(2))
      : null,
    size_gb: Number.isFinite(Number(d.Size))
      ? Number((Number(d.Size) / 1024 / 1024 / 1024).toFixed(2))
      : null,
    autorun_inf: Boolean(d.AutorunInf),
    root_executables: normalizeArray(d.RootExecutables),
  }));

  const defender = defenderResp.data || {};
  const posture = classify(defender, drives);
  const payload = {
    generated_at: scanAt,
    mode: 'local-read-only',
    status: posture.status,
    collectors: {
      defender: defenderResp.ok ? 'ok' : defenderResp.error,
      removable_drives: driveResp.ok ? 'ok' : driveResp.error,
    },
    defender: {
      service_enabled: Boolean(defender.AMServiceEnabled),
      antivirus_enabled: Boolean(defender.AntivirusEnabled),
      antispyware_enabled: Boolean(defender.AntispywareEnabled),
      realtime_enabled: Boolean(defender.RealTimeProtectionEnabled),
      quick_scan_age_days: Number.isFinite(defender.QuickScanAge) ? defender.QuickScanAge : null,
      full_scan_age_days: Number.isFinite(defender.FullScanAge) ? defender.FullScanAge : null,
      signature_age_days: Number.isFinite(defender.AntivirusSignatureAge) ? defender.AntivirusSignatureAge : null,
      nis_enabled: Boolean(defender.NISEnabled),
    },
    removable_drives: drives,
    findings: {
      severe: posture.severe,
      warnings: posture.warnings,
    },
    notes:
      posture.status === 'green'
        ? 'Device security posture is clear for read-only monitoring.'
        : 'Review findings before approving any device-level action.',
  };

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const md = [
    '# Z AnyDevices Security Scan',
    '',
    `Generated: ${payload.generated_at}`,
    `Mode: ${payload.mode}`,
    `Status: ${payload.status.toUpperCase()}`,
    '',
    '## Defender',
    `- service_enabled: ${payload.defender.service_enabled}`,
    `- antivirus_enabled: ${payload.defender.antivirus_enabled}`,
    `- realtime_enabled: ${payload.defender.realtime_enabled}`,
    `- quick_scan_age_days: ${payload.defender.quick_scan_age_days ?? 'n/a'}`,
    `- signature_age_days: ${payload.defender.signature_age_days ?? 'n/a'}`,
    '',
    '## Removable Drives',
    ...(payload.removable_drives.length
      ? payload.removable_drives.map(
          (d) =>
            `- ${d.device}: fs=${d.fs || 'n/a'}, free=${d.free_gb ?? 'n/a'}GB, autorun_inf=${d.autorun_inf}, root_executables=${d.root_executables.length}`
        )
      : ['- none detected']),
    '',
    '## Findings',
    ...(payload.findings.severe.length ? payload.findings.severe.map((x) => `- [SEVERE] ${x}`) : ['- no severe findings']),
    ...(payload.findings.warnings.length ? payload.findings.warnings.map((x) => `- [WARN] ${x}`) : ['- no warnings']),
    '',
  ];
  fs.writeFileSync(OUT_MD, `${md.join('\n')}\n`, 'utf8');

  console.log(`✅ AnyDevices security scan written: ${OUT_JSON}`);
}

run();
