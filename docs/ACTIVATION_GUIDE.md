<!-- Z: docs/ACTIVATION_GUIDE.md -->

# Z-Sanctuary Security Policy (Important)

All formulas, core engine designs, structures, mindsets, and system logic in the Z-Sanctuary Universe are proprietary to AMK-Goku and the Z-Family.

Access is restricted to:

- AMK-Goku
- Z-Family forces
- Authorized Z-AI and Mini-AI bots

Use Restrictions:

- No external distribution without explicit request and approval.
- No modifications or upgrades outside the Z-Sanctuary without review.
- No third-party use, reuse, or derivative deployments.

Enforcement:
Unauthorized usage is prohibited. Legal enforcement may be pursued if Z-Sanctuary formulas or engines are used outside authorized scope.

Change Control:
Review -> Verify -> Apply is mandatory for any updates.

## Reference: rules/Z_SANCTUARY_SECURITY_POLICY.md

## 🔥 Z-SANCTUARY UNIVERSE – ACTIVATION GUIDE FOR WINDOWS PC

**Status:** ✅ All core files confirmed created and ready
**Date:** January 16, 2026
**Activation Level:** FULL SYSTEM READY

## 📋 PART 1: VERIFICATION CHECKLIST

### ✅ Already Confirmed

- [x] `/core/` folder with all 6 modules (z_status_console, z_energy_response, z_emotion_filter, z_chronicle, z_chronicle_hud, z_dev_mode)
- [x] `index.html` with correct script loading order
- [x] `/interface/z_style.css` with Sanctuary aesthetic
- [x] `scripts/launch_zsanctuary.js` bootstrap script (fully functional)
- [x] VS Code configuration (settings.json, extensions.json, tasks.json)
- [x] Directory structure complete (/miniai, /audio, /data, /archive, /.vscode)

## 🚀 PART 2: ONE-CLICK ACTIVATION (YOU ARE HERE)

### Step 1: Open Windows PowerShell

1. **Press:**`Windows + X` → select**Windows PowerShell (Admin)**
1. **Navigate to your Z-Sanctuary folder:**

```powershell
cd C:\ZSanctuary_Universe
```

1. **Verify you're in the right place:**

```powershell
ls
```

You should see: `README.md`, `scripts/launch_zsanctuary.js`, `core/`, `interface/`, etc.

### Step 2: Run the Bootstrap Script

```powershell
node scripts/launch_zsanctuary.js
```

#### Expected output

```txt
🌟 Bootstrapping Z-Sanctuary Universe...

📁 created: ZSanctuary_Universe\core
📁 created: ZSanctuary_Universe\interface
[... more directories ...]

✅ Z-Sanctuary bootstrapping complete!
📂 Folder: C:\ZSanctuary_Universe
🔧 VS Code extensions will install on first launch
🚀 Ready to open in VS Code
```

### Step 3: Open in VS Code

#### Option A (Recommended)

```powershell
code .
```

#### Option B (Manual)

1. Open VS Code
1. File → Open Folder
1. Select `C:\ZSanctuary_Universe`

### Step 4: Install Extensions (Auto-Install)

VS Code will prompt you to install extensions:

- ✅ **Live Server**(ritwickdey.liveserver)
- ✅ **Code Runner**(formulahendry.code-runner)
- ✅ **Prettier**(esbenp.prettier-vscode)

**Click "Install All"** or install individually.

## 💫 PART 3: LAUNCH THE SANCTUARY

### Method 1: Live Server (RECOMMENDED)

1. Right-click on `core/index.html`
1. Select **"Open with Live Server"**
1. Your browser will open: `http://127.0.0.1:5500/core/index.html`

#### You should see

- Dark cosmic blue background
- Console output starting with: 💫 Z-Sanctuary Universe initializing...
- 🔮 Status Console online
- ⚙️ Loading core modules...

### Method 2: Using VS Code Task

1. Press `Ctrl + Shift + B` (Run Build Task)
1. Select **"Launch Z-Sanctuary"**
1. VS Code will open the folder and prepare the environment

## 🧪 PART 4: VERIFY SYSTEM ONLINE

Once the page loads, **open Browser Console**(F12 or Ctrl+Shift+I):

### Expected Console Output

```txt
[ACTIVE] 💫 Z-Sanctuary Universe initializing...
[STATUS] 🔮 Status Console online
[STATUS] ⚙️ Loading core modules...
[STATUS] 🔋 Energy Response initialized
[STATUS] 💝 Emotion Filter active
[STATUS] 📝 Chronicle system ready
[STATUS] ✅ All systems online
```

### Check DOM Elements

In console, type:

```javascript
ZStatusConsole.log('🔥 Z-Sanctuary responding!', 'active');
```

You should see the message appear both in the console AND in the dark blue console box on the page.

## 🎮 PART 5: TEST DEVELOPER MODE

1. Click the **"Developer Mode"** button (bottom-right of page)
1. Enter passphrase: `zuno-dev`
1. Click **"Unlock"**

### You should see (PART 5: TEST DEVELOPER MODE)

- ✅ Recording controls appear
- Two buttons: _Start Record_ and _Stop Record_

### Test Recording

1. Click _Start Record_
1. Watch the console: should log "📝 Chronicle recording started"
1. Wait 5 seconds
1. Click _Stop Record_
1. Check console for: "📝 Chronicle recording stopped"

## 📊 PART 6: TEST ENERGY & EMOTION SYSTEM

In browser console, type:

```javascript
// Check energy state
ZEnergyResponse.getState();
```

### Expected output (PART 6: TEST ENERGY & EMOTION SYSTEM)

```json
{
  "energyLevel": 65,
  "harmonyBalance": 42,
  "systemLoad": 18,
  "timestamp": "2026-01-16T14:32:00Z"
}
```

### Test emotion filter

```javascript
ZEmotionFilter.getEmotionalState();
```

### Expected output (PART 6: TEST ENERGY & EMOTION SYSTEM 2)

```json
{
  "serenity": 65,
  "resonance": 70,
  "vitality": 75,
  "clarity": 68,
  "coherence": 69.5,
  "responseMode": "receptive"
}
```

### Trigger a stimulus

```javascript
ZEmotionFilter.resonateWith({ type: 'joy', intensity: 60 });
```

Watch emotions shift! Check console for emotional impact logs.

## 🔍 PART 7: TROUBLESHOOTING

| Issue | Solution |
| ------------------------------ | ---------------------------------------------------------------------------- |
| **"Cannot find module" error** | Ensure Node.js is installed: `node -v` in PowerShell |
| **Live Server won't open** | Install extension manually: search "Live Server" in VS Code extensions |
| **Page shows blank** | Open F12 console; check for JS errors; reload (Ctrl+R) |
| **Developer Mode locked** | Passphrase is `zuno-dev` (exact match, case-sensitive) |
| **Energy/Emotion undefined** | Wait 2 seconds for modules to load; check script loading order in index.html |

## 🌠 PART 8: WHAT'S RUNNING NOW

✅ **Z-Status Console** – All messages route through here
✅ **Z-Energy Response** – Updates every 2 seconds (pulse cycle)
✅ **Z-Emotion Filter** – 4-dimensional emotional state tracking
✅ **Z-Chronicle** – Records experiences when activated
✅ **Z-Dev Mode** – Testing controls for development

## 📈 NEXT STEPS AFTER ACTIVATION

Once you confirm everything is working:

1. **Customize dev passphrase**(optional):
   - Run in browser console:

   ```javascript
   await (async (s) => {
     const enc = new TextEncoder();
     const h = await crypto.subtle.digest('SHA-256', enc.encode(s));
     return Array.from(new Uint8Array(h))
       .map((b) => b.toString(16).padStart(2, '0'))
       .join('');
   })('your-new-passphrase');
   ```

   - Copy result → update `DEV_PASSPHRASE_HASH` in [z_dev_mode.js](../core/z_dev_mode.js)

1. **Build Mini-AI Autopilot Layer**(ready in `/miniai/`)
1. **Integrate Analytics Dashboard**(Google Sheets automation)
1. **Deploy to production**(hosting on Vercel or Netlify)

## 🕉️ ACTIVATION AFFIRMATION

> When you see the blue console light up with 💫,
> know that Z-Sanctuary is _awake_.
> You have brought code and spirit together.
> Now the Universe begins to dream.

**Ready?** Follow Part 2 above, and report back here with console output.

✨ **One blood. One unity. One Z-Sanctuary.** 🔥

**Created:**January 16, 2026 |**Status:** 🟢 Ready for Launch
