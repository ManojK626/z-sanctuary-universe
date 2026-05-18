# Z-Continuous Verification Protocol

**Living real-time monitoring of Z-Sanctuary ecosystem state.**

**Status:** ✅ ACTIVE
**Effective:** May 5, 2026 onwards
**Scope:** Continuous awareness, real-time gates, living timeline, immediate alerts
**Principle:** No stale information. Everything visible. Know what's happening NOW.

---

## Purpose

When Z-IDE-FUSION-1 and Z-IDE-14DRP-1 are running, you need **real-time awareness** of:

- ✅ Latest state of all gates (verify:md, z:traffic, z:car2, z:ide:fusion, z:ide:14drp)
- ✅ Active IDE sessions and their status
- ✅ Registry integrity and high-risk file changes
- ✅ Archive isolation maintained
- ✅ Immediate alerts on RED conditions
- ✅ Complete timeline of what changed when
- ✅ AMK-Goku dashboard always knows the latest

**No surprises. No stale memory. Just facts.**

---

## How It Works

### **Continuous Verification Loop**

```text
Every 2 minutes (default):
  1. Run critical gates (z:ide:fusion, z:ide:14drp)
  2. Aggregate signals
  3. Check active sessions
  4. Detect alerts
  5. Update living status
  6. Append to timeline
  7. Feed to AMK dashboard
  8. Expose "what's happening NOW"
```

### **The Gates Being Monitored**

| Gate | Purpose | Check Interval | Critical |
| ---------------- | --------------------- | -------------- | -------- |
| **verify:md** | Markdown verification | 5 min | Yes |
| **z:traffic** | System health signal | 5 min | Yes |
| **z:car2** | Code analysis | 60 min | No |
| **z:ide:fusion** | IDE coordination | 2 min | Yes |
| **z:ide:14drp** | 14 DRP compliance | 2 min | Yes |

### **Signal Aggregation**

```text
All gates report: GREEN, YELLOW, BLUE, or RED

Overall signal logic:
  IF any gate is RED → Overall = RED (STOP)
  ELSE IF any gate is BLUE → Overall = BLUE (need AMK)
  ELSE IF any gate is YELLOW → Overall = YELLOW (monitor)
  ELSE → Overall = GREEN (continue)
```

### **Health Categories**

- **Documentation Health:** From verify:md
- **IDE Health:** From z:ide:fusion + z:ide:14drp
- **System Health:** From z:traffic
- **Code Health:** From z:car2
- **Compliance Health:** From z:ide:14drp + registry checks

---

## Real-Time Reports

### **Living Status (Every 2 minutes)**

```bash
npm run z:cv:monitor
```

Generates:

- `data/reports/z_continuous_verification_status.json` (machine-readable)
- `data/reports/z_continuous_verification_status.md` (human-readable)

Shows:

- Current overall signal
- Status of each gate
- Active IDE sessions
- Latest alerts (RED/BLUE/YELLOW)
- Next recommended action

### **Timeline (Append-Only Evidence)**

```text
data/ide-fusion/continuous_verification_timeline.jsonl
```

Every check creates a line:

```json
{
  "timestamp": "2026-05-05T15:30:00Z",
  "event": "verification_check_completed",
  "overall_signal": "GREEN",
  "gates_checked": 5,
  "gates_passed": 5,
  "gates_failed": 0,
  "active_sessions": 1,
  "alert_count": 0
}
```

**No overwrites. No deletions. Pure audit trail.**

---

## Verification Modes

### **Mode 1: Quick Check** (2 minutes)

Checks: z:ide:fusion, z:ide:14drp

Use: Real-time IDE awareness

Output: Fast feedback

### **Mode 2: Full Verification** (10 minutes)

Checks: verify:md, z:traffic, z:car2, z:ide:fusion, z:ide:14drp

Use: Comprehensive system health

Output: All categories

### **Mode 3: Compliance Audit** (60 minutes)

Checks: z:ide:14drp, registry integrity, archive safety

Use: Daily governance check

Output: Compliance evidence

---

## Alert Logic

### **RED Alert** 🔴

**Condition:** Any critical gate fails OR DRP violation detected
**Action:** STOP and report immediately
**Notification:** Immediate alert to AMK-Goku dashboard
**Example:** z:ide:14drp returns RED (forbidden action attempted)

### **BLUE Alert** 🔵

**Condition:** AMK decision required (sacred move, conflict, etc.)
**Action:** Hold and notify AMK
**Notification:** Alert with context to AMK dashboard
**Example:** Deploy requested

### **YELLOW Alert** 🟡

**Condition:** Advisory (slow gate, optional data missing)
**Action:** Monitor situation
**Notification:** Quiet advisory (not an alarm)
**Example:** verify:md slow due to many files

### **GREEN Signal** 🟢

**Condition:** All gates pass
**Action:** Continue normal operations
**Notification:** None (optional digest)

---

## Living Dashboard Integration

The Continuous Verification Monitor feeds the AMK-Goku dashboard:

```json
{
  "overall_signal": "GREEN",
  "gate_status": {
    "verify_md": "GREEN",
    "z_traffic": "GREEN",
    "z_car2": "GREEN",
    "z_ide_fusion": "GREEN",
    "z_ide_14drp": "GREEN"
  },
  "active_sessions": 1,
  "health": {
    "documentation": "GREEN",
    "ide": "GREEN",
    "system": "GREEN",
    "compliance": "GREEN"
  },
  "latest_alerts": [],
  "last_check": "2026-05-05T15:30:00Z"
}
```

**Dashboard always shows NOW, not yesterday.**

---

## Archive Monitoring

Continuous verification also monitors:

```text
✅ .cursor/projects is NOT modified
✅ NO package.json in archive
✅ NO node_modules in archive
✅ Archive remains read-only evidence storage
```

Checked every 60 minutes. RED alert if violated.

---

## Timeline Events

Every event is tracked:

- `verification_check_started`
- `verification_check_completed`
- `gate_check_passed`
- `gate_check_failed`
- `signal_changed`
- `high_risk_file_modified`
- `session_started`
- `session_ended`
- `handoff_written`
- `amk_alert_triggered`

Timeline stored in:

```text
data/ide-fusion/continuous_verification_timeline.jsonl
```

---

## Performance Metrics

Continuous verification also tracks:

- **Gate execution time** — Is z:ide:fusion slow?
- **Gate success rate** — How reliable is verify:md?
- **Average system signal** — What's normal state?
- **Anomaly detection** — Unexpected pattern?
- **File change frequency** — How much is changing?

Reported hourly.

---

## Usage

### **Run Quick Check (2 min gates)**

```bash
npm run z:cv:monitor
```

Output:

```json
{
  "ok": true,
  "overall_signal": "GREEN",
  "out_json": "data/reports/z_continuous_verification_status.json",
  "out_md": "data/reports/z_continuous_verification_status.md",
  "gates_checked": 5,
  "gates_passed": 5,
  "gates_failed": 0,
  "active_sessions": 1,
  "alert_count": 0
}
```

### **Run Full Verification (all gates)**

```bash
npm run z:cv:full
```

### **Check Timeline**

```bash
tail -n 20 data/ide-fusion/continuous_verification_timeline.jsonl
```

### **Read Latest Status**

```bash
cat data/reports/z_continuous_verification_status.md
```

---

## For AMK-Goku Dashboard

The continuous verification monitor produces files your dashboard can consume:

```javascript
// Load latest status
const status = JSON.parse(fs.readFileSync('data/reports/z_continuous_verification_status.json'));

// show:
// - status.overall_signal
// - status.gate_status_summary
// - status.health_categories
// - status.active_sessions
// - status.latest_alerts
// - status.next_recommended_action
```

**Dashboard integration is built-in. Just point to the JSON.**

---

## Locked Law

```text
✅ Continuous verification is mandatory
✅ Stale information is dangerous
✅ All signals aggregate to single overall_signal
✅ RED blocks movement
✅ BLUE requires AMK
✅ YELLOW is quiet advisory
✅ GREEN is safe to continue
✅ Archive is always monitored
✅ High-risk files are always tracked
✅ Timeline is append-only
✅ No bypassing verification
```

---

## Future Enhancement Ladder

| Phase | What it adds | Status |
| -------- | ---------------------------------------- | --------- |
| **CV-1** | Real-time monitoring + timeline + alerts | ✅ Active |
| **CV-2** | Predictive alerts (learning patterns) | 🎯 Next |
| **CV-3** | Multi-workspace awareness | 🎯 Later |
| **CV-4** | Anomaly detection engine | 🎯 Future |
| **CV-5** | Self-healing recommendations | 🎯 Sacred |

---

## Example: What "NOW" Looks Like

```text
Timestamp: 2026-05-05 15:30:00
Overall Signal: GREEN

Gates:
  ✅ verify:md — PASS (234ms)
  ✅ z:traffic — PASS (156ms)
  ⏱️  z:car2 — SKIPPED (not due until 16:30)
  ✅ z:ide:fusion — PASS (89ms)
  ✅ z:ide:14drp — PASS (91ms)

Health:
  📄 Documentation: GREEN
  🔧 IDE: GREEN
  🖥️ System: GREEN
  ✔️ Compliance: GREEN

Active Sessions:
  - cursor_main_edit_docs (Cursor IDE in franed_shadow_workspace)

Alerts:
  (none)

Timeline events in last 10 minutes:
  15:20:00 — Verification check completed (GREEN)
  15:22:00 — Verification check completed (GREEN)
  15:24:00 — Verification check completed (GREEN)
  15:26:00 — Verification check completed (GREEN)
  15:28:00 — Verification check completed (GREEN)
  15:30:00 — Verification check completed (GREEN)

Next Action: Continue normal operations
```

**That's what "continuous verification" means. You always know what's happening RIGHT NOW.**

---

**Z-Continuous Verification keeps Z-Sanctuary awake and aware.** 🦉✨
