#Requires -Version 5.1
<#
.SYNOPSIS
  Z-LOCAL-GATEWAY-DIRECTORY (Phase E2) - read-only local project/service door checks.

.DESCRIPTION
  Reads data/z_local_gateway_registry.json. Verifies paths, reports ports, prints correct
  open commands. Does NOT auto-start services, kill processes, deploy, or mutate Cloudflare.

.PARAMETER Id
  Optional project id filter (e.g. roulette_data_analyzer).

.PARAMETER Probe
  Optional HTTP GET to configured health URLs (informational only).
#>
param(
  [string] $Id = "",
  [switch] $Probe
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = (Resolve-Path (Join-Path $ScriptDir "..")).Path
$RegistryPath = Join-Path $RepoRoot "data/z_local_gateway_registry.json"

$verdictSafe = "SAFE"
$verdictNeedsHuman = "NEEDS HUMAN DECISION"
$verdictBlocked = "BLOCKED"

if (-not (Test-Path -LiteralPath $RegistryPath)) {
  Write-Host "$verdictBlocked - registry not found: $RegistryPath"
  exit 2
}

$raw = Get-Content -LiteralPath $RegistryPath -Raw -Encoding UTF8
$registry = $raw | ConvertFrom-Json

$projects = @($registry.projects)
if ($Id) {
  $projects = @($projects | Where-Object { $_.id -eq $Id })
  if ($projects.Count -eq 0) {
    Write-Host "$verdictBlocked - no project with id: $Id"
    exit 2
  }
}

$overall = $verdictSafe
$issues = New-Object System.Collections.Generic.List[string]

function Write-Bot {
  param([string]$Bot, [string]$Message)
  Write-Host "[$Bot] $Message"
}

function Get-Prop {
  param($Object, [string]$Name)
  if ($null -eq $Object) { return $null }
  if ($null -eq $Object.PSObject.Properties[$Name]) { return $null }
  return $Object.$Name
}

function Test-TcpPortInUse {
  param([int]$Port)
  try {
    $conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
      Select-Object -First 1
    return $null -ne $conn
  } catch {
    return $false
  }
}

function Test-HealthUrl {
  param([string]$Url)
  try {
    $resp = Invoke-WebRequest -Uri $Url -Method GET -UseBasicParsing -TimeoutSec 5
    return @{ Ok = $true; Status = $resp.StatusCode; Error = $null }
  } catch {
    $status = $null
    if ($_.Exception.Response) {
      $status = [int]$_.Exception.Response.StatusCode
    }
    return @{ Ok = $false; Status = $status; Error = $_.Exception.Message }
  }
}

Write-Host ""
Write-Host "=== Z-LOCAL-GATEWAY-DIRECTORY (E2) ===" -ForegroundColor Cyan
Write-Host $registry.golden_law
Write-Host "Registry: $RegistryPath"
Write-Host "Mode: $($registry.mode) | Probe: $Probe"
Write-Host ""

foreach ($p in $projects) {
  Write-Host "--- $($p.name) [$($p.id)] status=$($p.status) ---" -ForegroundColor Yellow

  $root = [string]$p.root
  if (Test-Path -LiteralPath $root) {
    Write-Bot -Bot "Path Bot" -Message "OK - root exists: $root"
  } else {
    Write-Bot -Bot "Path Bot" -Message "MISSING - root not found: $root"
    $overall = $verdictNeedsHuman
    [void]$issues.Add("$($p.id): root missing")
  }

  if ($null -ne (Get-Prop $p "boundary_notes")) {
    foreach ($note in @($p.boundary_notes)) {
      Write-Bot -Bot "Boundary Bot" -Message $note
    }
  }

  if ($null -ne (Get-Prop $p "do_not_use")) {
    foreach ($bad in @($p.do_not_use)) {
      Write-Bot -Bot "HTML Bot" -Message "AVOID ($($bad.pattern)): $($bad.reason)"
      if ($bad.example) {
        Write-Bot -Bot "HTML Bot" -Message "  example: $($bad.example)"
      }
    }
  }

  if ($null -ne (Get-Prop $p "html_entrypoints")) {
    foreach ($html in @($p.html_entrypoints)) {
      Write-Bot -Bot "HTML Bot" -Message "Entry: $($html.path) - $($html.launch) - $($html.note)"
    }
  }

  $envBlock = Get-Prop $p "env"
  if ($null -ne $envBlock) {
    $viteUrl = Get-Prop $envBlock "vite_api_url_operator"
    if ($viteUrl) { Write-Bot -Bot "Env Bot" -Message "VITE_API_URL (operator): $viteUrl" }
    $viteNote = Get-Prop $envBlock "vite_api_url_note"
    if ($viteNote) { Write-Bot -Bot "Env Bot" -Message $viteNote }
  }

  $fe = Get-Prop $p "frontend"
  if ($null -ne $fe) {
    $fePort = Get-Prop $fe "port_default"
    if ($fePort) {
      $inUse = Test-TcpPortInUse -Port ([int]$fePort)
      $feState = if ($inUse) { "LISTENING" } else { "not listening" }
      Write-Bot -Bot "Port Bot" -Message "Frontend port ${fePort}: $feState"
    }
    $feUrl = Get-Prop $fe "url_default"
    if ($feUrl) { Write-Bot -Bot "Door Bot" -Message "Open: $feUrl" }
    $feNote = Get-Prop $fe "url_note"
    if ($feNote) { Write-Bot -Bot "Door Bot" -Message $feNote }
    $feCmd = Get-Prop $fe "command"
    if ($feCmd) {
      Write-Bot -Bot "Door Bot" -Message "Start (operator): cd `"$root`"; $feCmd"
    } else {
      $feCmdDefault = Get-Prop $fe "command_default"
      if ($feCmdDefault) {
        Write-Bot -Bot "Door Bot" -Message "Start: cd `"$root`"; $feCmdDefault"
      }
    }
  }

  $api = Get-Prop $p "api"
  if ($null -ne $api) {
    $apiPortOp = Get-Prop $api "port_operator"
    if ($apiPortOp) {
      $inUseOp = Test-TcpPortInUse -Port ([int]$apiPortOp)
      $apiOpState = if ($inUseOp) { "LISTENING" } else { "not listening" }
      Write-Bot -Bot "Port Bot" -Message "API port $apiPortOp (operator): $apiOpState"
    }
    $apiPortDef = Get-Prop $api "port_repo_default"
    if ($apiPortDef) {
      $inUseDef = Test-TcpPortInUse -Port ([int]$apiPortDef)
      $apiDefState = if ($inUseDef) { "LISTENING" } else { "not listening" }
      Write-Bot -Bot "Port Bot" -Message "API port $apiPortDef (repo default): $apiDefState"
    }
    $apiPs = Get-Prop $api "command_powershell"
    if ($apiPs) {
      Write-Bot -Bot "Door Bot" -Message "API start (PowerShell): cd `"$root`"; $apiPs"
    } else {
      $apiCmd = Get-Prop $api "command"
      if ($apiCmd) { Write-Bot -Bot "Door Bot" -Message "API start: cd `"$root`"; $apiCmd" }
    }

    if ($Probe) {
      $probeLabels = @("health_url_operator", "health_url_repo_default")
      $operatorPortUp = $false
      if ($apiPortOp) { $operatorPortUp = Test-TcpPortInUse -Port ([int]$apiPortOp) }
      foreach ($label in $probeLabels) {
        $url = Get-Prop $api $label
        if (-not $url) { continue }
        if ($label -eq "health_url_repo_default" -and $operatorPortUp) {
          Write-Bot -Bot "API Bot" -Message "SKIP $label (operator port in use - expected)"
          continue
        }
        $result = Test-HealthUrl -Url $url
        if ($result.Ok) {
          Write-Bot -Bot "API Bot" -Message "PROBE OK $label - $url (HTTP $($result.Status))"
        } else {
          $httpNote = ""
          if ($result.Status) { $httpNote = "(HTTP $($result.Status))" }
          Write-Bot -Bot "API Bot" -Message "PROBE FAIL $label - $url $httpNote"
          if ($result.Error) { Write-Bot -Bot "API Bot" -Message "  $($result.Error)" }
          $isCritical = ($label -eq "health_url_operator") -or (-not $operatorPortUp)
          if ($isCritical -and $overall -eq $verdictSafe) { $overall = $verdictNeedsHuman }
          if ($isCritical) { [void]$issues.Add("$($p.id): probe failed $label") }
        }
      }
    } else {
      Write-Bot -Bot "API Bot" -Message "Skipped HTTP probe (use -Probe)."
    }
  }

  Write-Bot -Bot "Smoke Bot" -Message "Operator runs project smoke manually."
  if ($p.id -eq "roulette_data_analyzer") {
    Write-Bot -Bot "Smoke Bot" -Message "Roulette: corepack pnpm run identity:check:live (with dev:dashboard up)"
  }
  if ($p.id -eq "genesis_studio") {
    Write-Bot -Bot "Smoke Bot" -Message "Genesis: npm run dev then / /script /storyboard /audio /publish"
  }

  Write-Host ""
}

Write-Host "=== NOT DEPLOYED / LOCAL-ONLY ===" -ForegroundColor DarkGray
Write-Host "Gateway does not deploy, bind Cloudflare, or restore Replit."
Write-Host ""

$color = "Green"
if ($overall -ne $verdictSafe) { $color = "Yellow" }
Write-Host "VERDICT: $overall" -ForegroundColor $color
if ($issues.Count -gt 0) {
  foreach ($i in $issues) { Write-Host "  - $i" }
}

$exitCode = 0
if ($overall -eq $verdictBlocked) { $exitCode = 2 }
elseif ($overall -eq $verdictNeedsHuman) { $exitCode = 1 }
exit $exitCode
