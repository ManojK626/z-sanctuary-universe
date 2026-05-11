# Z-SANCTUARY ZUNO AI - QUICK REFERENCE INDEX

## 🎯 START HERE

This file provides quick links and reference information for the Z-SANCTUARY ZUNO AI project.

---

## 📚 DOCUMENTATION FILES

### Essential Reading (In Order)

1. **[README.md](README.md)** - Start here for complete overview
2. **[SETUP_GUIDE.js](SETUP_GUIDE.js)** - How to integrate files
3. **[MIGRATION_CHECKLIST.md](MIGRATION_CHECKLIST.md)** - Step-by-step migration
4. **[SETUP_COMPLETE.md](SETUP_COMPLETE.md)** - Summary and next steps

### Reference Documents

- **[PROJECT_MANIFEST.json](PROJECT_MANIFEST.json)** - Official project identification
- **[SECURITY_VERIFICATION.js](SECURITY_VERIFICATION.js)** - Run security audits

---

## 🔐 PROTOCOL ENFORCEMENT SCRIPTS

Located in `/protocols/` directory:

- **[ai-identifier.js](protocols/ai-identifier.js)** - Verifies project identity
- **[protocol-enforcer.js](protocols/protocol-enforcer.js)** - Enforces operational protocols

These MUST be loaded in every dashboard.

---

## 🎮 DASHBOARDS

Located in `/dashboards/` directory:

### Master Hub (Octopus Brain)

- **File:** `master-hub/amk-master-live.html`
- **Role:** Central dashboard with role-based access
- **Status:** ✅ Updated with protocols

### Health Portal (Owl Node)

- **File:** `health-portal/z-health-portal.html`
- **Role:** Biological adaptation & device control
- **Status:** ⏳ Pending copy and update

### Prediction Matrix (Fox Node)

- **File:** `prediction-matrix/roulette-matrix.html`
- **Role:** Strategy & mechanical bias detection
- **Status:** ⏳ Pending copy and update

### PRNG Engine (Phoenix Node)

- **File:** `prng-engine/slot-engine.html`
- **Role:** Probability & RTP analysis
- **Status:** ⏳ Pending copy and update

---

## 🧭 PARALLEL DASHBOARD TRACKS

- **Z-SANCTUARY ZUNO AI set (`./dashboards/`)** is the secured Octopus Brain stack governed by `project-id=ZUNO_AI_001` and the `protocols/` enforcement scripts inside this repo.
- **Amk-Goku Dashboards 2 set (`../Amk-Goku Dashboards 2/`)** mirrors the same Master Hub, Fox, Owl, and Phoenix nodes but each HTML lives in that folder, carries `project-id=AMK_GOKU_DASH_002`, and can optionally log through its own protocol-safe hooks.
- Maintain the separation: edit the Z files only inside this repo and keep the Amk-Goku Dashboards 2 files in their workspace so the two universes retain zero contamination.
- When you reference the Amk-Goku dashboards, treat their modules (Navigation Master Hub, Health Portal, Prediction Matrix, PRNG Engine) as independent nodes with their own manifest and audit logic even though they share UI metaphors with Z-SANCTUARY.

---

## ✅ PROJECT IDENTIFICATION

**Project ID:** `ZUNO_AI_001`
**Project Name:** Z-SANCTUARY ZUNO AI Universe
**Authorization Token:** `ZUNO_SANCTUARY_v1`
**Owner:** Amk-Goku
**Status:** ✅ ACTIVE & SECURED

---

## 🛠️ QUICK TASKS

### To Add Project Protection to a Dashboard

1. Add meta tags:

```html
<meta name="project-id" content="ZUNO_AI_001">
<meta name="project-name" content="Z-SANCTUARY ZUNO AI Universe">
```

1. Add project context (before `</body>`):

```html
<script>
    window.PROJECT_ID = "ZUNO_AI_001";
    window.PROJECT_MANIFEST = {
        project_id: "ZUNO_AI_001",
        project_name: "Z-SANCTUARY ZUNO AI Universe"
    };
</script>
```

1. Add audit logging (before `</body>`):

```html
<script>
    if (typeof ProtocolEnforcer_Instance !== 'undefined') {
        ProtocolEnforcer_Instance.recordAuditTrail('DASHBOARD_INIT', {
            dashboard: 'Dashboard Name',
            timestamp: new Date().toISOString()
        });
    }
</script>
```

### To Verify Security

1. Open browser console (F12)
2. Paste `SECURITY_VERIFICATION.js` content
3. Look for ✅ ALL TESTS PASSED

---

## 🚀 DIRECTORY STRUCTURE

```text
Z-SANCTUARY_ZUNO_AI/
├── PROJECT_MANIFEST.json           ← Project ID & metadata
├── README.md                         ← Full documentation
├── SETUP_GUIDE.js                   ← Integration instructions
├── MIGRATION_CHECKLIST.md           ← Migration tasks
├── SETUP_COMPLETE.md                ← Summary
├── SECURITY_VERIFICATION.js         ← Security audit
├── INDEX.md                         ← This file
│
├── protocols/
│   ├── ai-identifier.js             ← Identity verification
│   └── protocol-enforcer.js          ← Protocol enforcement
│
└── dashboards/
    ├── master-hub/
    ├── health-portal/
    ├── prediction-matrix/
    └── prng-engine/
```

---

## 📋 CHECKLIST FOR NEW SETUP

- [ ] Copy all files to Z-SANCTUARY_ZUNO_AI folder
- [ ] Add project meta tags to each HTML file
- [ ] Add project context script to each file
- [ ] Add audit logging to each file
- [ ] Test each dashboard in browser
- [ ] Verify console shows ✅ all protocols passed
- [ ] Run security verification script
- [ ] Check audit logs are recording
- [ ] Verify no console errors

---

## 🔍 CONSOLE COMMANDS

```javascript
// Verify project identity
window.PROJECT_ID              // Should be "ZUNO_AI_001"
window.PROJECT_MANIFEST        // Should have correct project_id

// Run security audit
window.ZUNO_SECURITY_AUDIT.run()

// Export security report
window.ZUNO_SECURITY_AUDIT.exportReport()

// Check audit trail
ProtocolEnforcer_Instance.getAuditLog()

// Export audit log
ProtocolEnforcer_Instance.exportAuditLog()

// Check if protocols passed
ProtocolEnforcer_Instance.enforceMode   // Should be "STRICT"
```

---

## ⚠️ SECURITY WARNINGS

If you see these in console, investigate immediately:

```text
❌ PROJECT IDENTITY MISMATCH!
❌ Data Isolation Breach Detected!
❌ UNAUTHORIZED OPERATION
❌ BLOCKED - External resource detected
🔴 PROJECT IDENTITY VERIFICATION FAILED
```

---

## 🎓 COMMON QUESTIONS

**Q: Can I mix this with other projects?**
A: NO. This project is completely isolated. Files from other projects will trigger security alerts.

**Q: What if I get a project identity error?**
A: Verify the `<meta name="project-id">` tag is in the `<head>` section with the correct value.

**Q: How do I add custom operations?**
A: Edit `protocols/protocol-enforcer.js` `authorizedOps` array and update `recordAuditTrail` documentation.

**Q: Where are audit logs stored?**
A: In memory in `ProtocolEnforcer_Instance.operationLog`. Export with `exportAuditLog()`.

**Q: Is data shared between nodes?**
A: NO. Each node is completely isolated. Cross-node data access will trigger alerts.

---

## 📞 PROJECT METADATA

| Property | Value |
| ---------- | ------- |
| Project ID | ZUNO_AI_001 |
| Project Name | Z-SANCTUARY ZUNO AI Universe |
| Owner | Amk-Goku |
| Status | ✅ ACTIVE |
| Isolation | COMPLETE |
| Security Level | CRITICAL |
| Authorization | ZUNO_SANCTUARY_v1 |
| Created | 2026-02-25 |

---

## 🎯 NEXT ACTIONS

1. **Copy remaining files** from Amk-Goku Dashboards 2 folder
2. **Update each HTML file** with project meta tags
3. **Test each dashboard** and verify protocols
4. **Run security verification** script
5. **Mark migration complete** in MIGRATION_CHECKLIST.md

---

### This is Z-SANCTUARY ZUNO AI — Completely Isolated and Secured

For detailed information, see the full documentation files listed above.
