import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const POLICY_PATH = path.join(ROOT, 'config', 'z_anydevices_policy.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_anydevices_analyzer.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_anydevices_analyzer.md');

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function normalizeArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function parseJsonLoose(raw) {
  const text = String(raw || '').trim();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    const idxObj = text.indexOf('{');
    const idxArr = text.indexOf('[');
    const idx = [idxObj, idxArr].filter((n) => n >= 0).sort((a, b) => a - b)[0];
    if (idx >= 0) {
      try {
        return JSON.parse(text.slice(idx));
      } catch {
        return null;
      }
    }
    return null;
  }
}

function runPowerShellJson(command) {
  const exec = spawnSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', command],
    { encoding: 'utf8', timeout: 15000 }
  );
  if (exec.error || exec.status !== 0) {
    return { ok: false, data: null, error: exec.error?.message || exec.stderr || 'powershell_failed' };
  }
  return { ok: true, data: parseJsonLoose(exec.stdout), error: null };
}

function detectDeviceClasses() {
  if (process.platform !== 'win32') return { ok: false, data: [] };
  const cmd = [
    '$ErrorActionPreference="SilentlyContinue";',
    '$rows = Get-CimInstance Win32_PnPEntity | Select-Object PNPClass;',
    '$rows | Group-Object PNPClass | Select-Object Name,Count | ConvertTo-Json -Compress',
  ].join(' ');
  return runPowerShellJson(cmd);
}

function detectStorage() {
  if (process.platform !== 'win32') return { ok: false, data: [] };
  const cmd = [
    '$ErrorActionPreference="SilentlyContinue";',
    'Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" |',
    'Select-Object DeviceID,Size,FreeSpace,FileSystem | ConvertTo-Json -Compress',
  ].join(' ');
  return runPowerShellJson(cmd);
}

function detectAdapters() {
  if (process.platform !== 'win32') return { ok: false, data: [] };
  const cmd = [
    '$ErrorActionPreference="SilentlyContinue";',
    'Get-NetAdapter | Select-Object Name,Status,LinkSpeed,InterfaceDescription | ConvertTo-Json -Compress',
  ].join(' ');
  return runPowerShellJson(cmd);
}

function detectGpu() {
  if (process.platform !== 'win32') return { ok: false, data: [] };
  const cmd = [
    '$ErrorActionPreference="SilentlyContinue";',
    'Get-CimInstance Win32_VideoController |',
    'Select-Object Name,AdapterRAM,DriverVersion | ConvertTo-Json -Compress',
  ].join(' ');
  return runPowerShellJson(cmd);
}

function detectTpm() {
  if (process.platform !== 'win32') return { ok: false, data: null };
  const cmd = [
    '$ErrorActionPreference="SilentlyContinue";',
    'Get-CimInstance -Namespace "Root\\CIMV2\\Security\\MicrosoftTpm" -ClassName Win32_Tpm |',
    'Select-Object IsEnabled_InitialValue,IsActivated_InitialValue,SpecVersion | ConvertTo-Json -Compress',
  ].join(' ');
  return runPowerShellJson(cmd);
}

function detectCpuArch() {
  const cpus = os.cpus() || [];
  const model = cpus[0]?.model || 'unknown';
  const speedMHz = cpus[0]?.speed || null;
  return {
    cores_logical: cpus.length,
    model,
    speed_mhz: speedMHz,
    arch: os.arch(),
  };
}

function classifyCapabilities(snapshot, policy) {
  const minRamGb = Number(policy?.thresholds?.min_ram_gb_for_local_ai || 16);
  const minCpuCores = Number(policy?.thresholds?.min_cpu_cores_for_parallel || 8);
  const minStorageGb = Number(policy?.thresholds?.min_free_storage_gb || 120);
  const totalRamGb = snapshot?.host?.memory_gb?.total || 0;
  const freeStorageGb = snapshot?.storage?.total_free_gb || 0;
  const cpuCores = snapshot?.host?.cpu?.cores_logical || 0;
  const adapters = snapshot?.network?.adapters || [];
  const deviceClasses = snapshot?.devices?.class_counts || [];
  const tpm = snapshot?.security?.tpm || {};
  const gpus = snapshot?.compute?.gpus || [];

  const hasBluetooth = adapters.some((a) =>
    String(a?.InterfaceDescription || a?.Name || '')
      .toLowerCase()
      .includes('bluetooth')
  );
  const hasWifi = adapters.some((a) =>
    String(a?.InterfaceDescription || a?.Name || '')
      .toLowerCase()
      .includes('wi-fi')
  );
  const hasTenGb = adapters.some((a) => /10\s*gbps/i.test(String(a?.LinkSpeed || '')));
  const hasUsb = deviceClasses.some((c) => String(c?.Name || '').toLowerCase() === 'usb');
  const hasCamera = deviceClasses.some((c) =>
    ['camera', 'image'].includes(String(c?.Name || '').toLowerCase())
  );
  const gpuReady = gpus.length > 0;

  const capabilities = [
    {
      id: 'local_ai_parallel_ready',
      pass: totalRamGb >= minRamGb && cpuCores >= minCpuCores,
      note: `ram=${totalRamGb}GB (>=${minRamGb}), cpu_cores=${cpuCores} (>=${minCpuCores})`,
    },
    {
      id: 'storage_headroom_ready',
      pass: freeStorageGb >= minStorageGb,
      note: `free_storage=${freeStorageGb}GB (>=${minStorageGb})`,
    },
    {
      id: 'secure_vault_ready',
      pass: Boolean(tpm.enabled) || Boolean(tpm.activated),
      note: `tpm_enabled=${Boolean(tpm.enabled)}, tpm_activated=${Boolean(tpm.activated)}`,
    },
    {
      id: 'high_speed_sync_candidate',
      pass: hasTenGb,
      note: `10GbE_detected=${hasTenGb}`,
    },
    {
      id: 'wearable_bridge_candidate',
      pass: hasBluetooth,
      note: `bluetooth_detected=${hasBluetooth}`,
    },
    {
      id: 'iot_bridge_candidate',
      pass: hasUsb || hasWifi,
      note: `usb_detected=${hasUsb}, wifi_detected=${hasWifi}`,
    },
    {
      id: 'vision_input_candidate',
      pass: hasCamera,
      note: `camera_or_image_class_detected=${hasCamera}`,
    },
    {
      id: 'gpu_accel_candidate',
      pass: gpuReady,
      note: `gpus_detected=${gpus.length}`,
    },
  ];

  const status = capabilities.every((c) => c.pass || c.id.endsWith('_candidate'))
    ? 'green'
    : 'amber';

  return { status, capabilities };
}

function compactAdapters(rows) {
  return normalizeArray(rows).map((x) => ({
    Name: x?.Name || null,
    Status: x?.Status || null,
    LinkSpeed: x?.LinkSpeed || null,
    InterfaceDescription: x?.InterfaceDescription || null,
  }));
}

function compactGpu(rows) {
  return normalizeArray(rows).map((x) => ({
    Name: x?.Name || null,
    AdapterRAM: x?.AdapterRAM || null,
    DriverVersion: x?.DriverVersion || null,
  }));
}

function run() {
  const policy = readJson(POLICY_PATH, {
    mode: 'audit-only',
    privacy: { local_only: true, include_device_names: false, redact_host_identity: true },
    thresholds: {
      min_ram_gb_for_local_ai: 16,
      min_cpu_cores_for_parallel: 8,
      min_free_storage_gb: 120,
    },
  });

  const hostName = os.hostname();
  const redactHost = Boolean(policy?.privacy?.redact_host_identity);
  const memoryTotalGb = Number((os.totalmem() / 1024 / 1024 / 1024).toFixed(2));
  const memoryFreeGb = Number((os.freemem() / 1024 / 1024 / 1024).toFixed(2));

  const classResp = detectDeviceClasses();
  const storageResp = detectStorage();
  const adapterResp = detectAdapters();
  const gpuResp = detectGpu();
  const tpmResp = detectTpm();

  const classCounts = normalizeArray(classResp.data)
    .filter((x) => x && x.Name)
    .map((x) => ({ Name: x.Name, Count: Number(x.Count || 0) }))
    .sort((a, b) => b.Count - a.Count);

  const storageRows = normalizeArray(storageResp.data);
  const storageSummary = storageRows.reduce(
    (acc, row) => {
      const size = Number(row?.Size || 0);
      const free = Number(row?.FreeSpace || 0);
      acc.total_size_bytes += size;
      acc.total_free_bytes += free;
      acc.volumes.push({
        device: row?.DeviceID || null,
        fs: row?.FileSystem || null,
        size_gb: Number((size / 1024 / 1024 / 1024).toFixed(2)),
        free_gb: Number((free / 1024 / 1024 / 1024).toFixed(2)),
      });
      return acc;
    },
    { total_size_bytes: 0, total_free_bytes: 0, volumes: [] }
  );

  const snapshot = {
    generated_at: new Date().toISOString(),
    mode: policy.mode || 'audit-only',
    status: 'green',
    privacy: {
      local_only: Boolean(policy?.privacy?.local_only),
      redacted_identity: redactHost,
      note: 'No serial numbers, no PNP instance IDs, and no cloud upload in analyzer.',
    },
    host: {
      platform: process.platform,
      release: os.release(),
      hostname: redactHost ? 'redacted' : hostName,
      cpu: detectCpuArch(),
      memory_gb: {
        total: memoryTotalGb,
        free: memoryFreeGb,
      },
    },
    devices: {
      class_counts: classCounts,
    },
    network: {
      adapters: compactAdapters(adapterResp.data),
    },
    compute: {
      gpus: compactGpu(gpuResp.data),
    },
    security: {
      tpm: {
        enabled: Boolean(tpmResp?.data?.IsEnabled_InitialValue),
        activated: Boolean(tpmResp?.data?.IsActivated_InitialValue),
        spec_version: tpmResp?.data?.SpecVersion || null,
      },
    },
    storage: {
      volumes: storageSummary.volumes,
      total_size_gb: Number((storageSummary.total_size_bytes / 1024 / 1024 / 1024).toFixed(2)),
      total_free_gb: Number((storageSummary.total_free_bytes / 1024 / 1024 / 1024).toFixed(2)),
    },
    diagnostics: {
      collectors: {
        class_counts: classResp.ok ? 'ok' : classResp.error || 'unavailable',
        storage: storageResp.ok ? 'ok' : storageResp.error || 'unavailable',
        adapters: adapterResp.ok ? 'ok' : adapterResp.error || 'unavailable',
        gpu: gpuResp.ok ? 'ok' : gpuResp.error || 'unavailable',
        tpm: tpmResp.ok ? 'ok' : tpmResp.error || 'unavailable',
      },
    },
  };

  const classified = classifyCapabilities(snapshot, policy);
  snapshot.status = classified.status;
  snapshot.capabilities = classified.capabilities;

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(snapshot, null, 2));

  const md = [
    '# Z AnyDevices Analyzer',
    '',
    `Generated: ${snapshot.generated_at}`,
    `Mode: ${snapshot.mode}`,
    `Status: ${snapshot.status.toUpperCase()}`,
    '',
    '## Privacy',
    `- local_only: ${snapshot.privacy.local_only}`,
    `- redacted_identity: ${snapshot.privacy.redacted_identity}`,
    `- note: ${snapshot.privacy.note}`,
    '',
    '## Host',
    `- platform: ${snapshot.host.platform} ${snapshot.host.release}`,
    `- cpu: ${snapshot.host.cpu.model} (${snapshot.host.cpu.cores_logical} logical cores)`,
    `- memory: ${snapshot.host.memory_gb.total} GB total, ${snapshot.host.memory_gb.free} GB free`,
    `- storage free: ${snapshot.storage.total_free_gb} GB`,
    '',
    '## Capability Mapping',
    ...snapshot.capabilities.map((c) => `- [${c.pass ? 'x' : ' '}] ${c.id}: ${c.note}`),
    '',
    '## Device Class Counts (top)',
    ...snapshot.devices.class_counts.slice(0, 12).map((c) => `- ${c.Name}: ${c.Count}`),
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'));

  console.log(`✅ AnyDevices analyzer report written: ${OUT_JSON}`);
}

run();
