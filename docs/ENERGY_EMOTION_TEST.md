<!-- Z: docs/ENERGY_EMOTION_TEST.md -->

# Energy & Emotion Layer – Test Checklist

## Run this after opening `core/index.html` with Live Server

---

## ✅ Browser Console Checks

### Module Initialization (should see these messages immediately)

- [ ] `💝 Z-Emotion Filter initialized`
- [ ] `🔋 Energy Response System initialized`

### Pulse Output (check every 2 seconds)

- [ ] See lines like: `⚡ Energy: 82% | Harmony: 58% | Load: 42% | Coherence: 68%`
- [ ] Emoji changes based on coherence: ⚡💫🌙❄️
- [ ] Coherence value varies (40-80% typical range)

### No Errors

- [ ] No red error messages in console
- [ ] No undefined reference errors for window.ZEmotionFilter or window.ZEnergyResponse

---

## ✅ DOM Console (`#zConsole`) Checks

### Initial Activation

- [ ] `💫 Z-Sanctuary Universe initializing...`
- [ ] `🔮 Status Console online`
- [ ] `⚙️ Loading core modules...`

### Continuous Status Updates

- [ ] Every 2 seconds: `🔋 E:82% H:58% L:42% | Coherence: 68%`
- [ ] Numbers change (energy/harmony oscillate naturally)
- [ ] Coherence included in output

---

## ✅ Console API Tests

Run these in **DevTools Console** while Live Server is running:

### Test 1: Check Emotional State

```javascript
ZEmotionFilter.getEmotionalState();
```

**Expected:** Object with `serenity`, `resonance`, `vitality`, `clarity`, `mode`, `coherence` (all 0-100)

```javascript
// Example output:
{
  serenity: 68,
  resonance: 72,
  vitality: 76,
  clarity: 65,
  mode: "receptive",
  coherence: 70
}
```

### Test 2: Apply Joy Stimulus

```javascript
ZEmotionFilter.resonateWith({ type: 'joy', intensity: 70 });
```

**Expected:** Vitality and Serenity increase noticeably
**Verify:** Call `ZEmotionFilter.getEmotionalState()` again, numbers should be higher

### Test 3: Apply Energy Surge

```javascript
ZEnergyResponse.stimulate({ type: 'surge', intensity: 80 });
```

**Expected:** Energy level jumps to near 100
**Verify:** `ZEnergyResponse.getEnergy()` returns ~90+

### Test 4: Check Response Mode

```javascript
ZEmotionFilter.evaluateResponseMode();
```

**Expected:** Returns one of: `'amplified'`, `'receptive'`, `'damped'`, `'neutral'`

### Test 5: View Emotional History

```javascript
ZEmotionFilter.getHistory(3);
```

**Expected:** Array of 3 most recent emotional state snapshots, each with timestamp

### Test 6: View Energy Trends

```javascript
ZEnergyResponse.getTrend(3);
```

**Expected:** Array of 3 most recent energy pulses with energy, harmony, load, and emotion object

---

## 📊 Example Full Test Run

```javascript
// 1. Get initial state
ZEmotionFilter.getEmotionalState();
// → { serenity: 65, resonance: 72, vitality: 75, clarity: 62, mode: 'receptive', coherence: 68 }

// 2. Trigger joy
ZEmotionFilter.resonateWith({ type: 'joy', intensity: 80 });

// 3. Check change
ZEmotionFilter.getEmotionalState();
// → { serenity: 79, resonance: 72, vitality: 95, clarity: 65, mode: 'amplified', coherence: 78 }

// 4. Apply system surge
ZEnergyResponse.stimulate({ type: 'surge', intensity: 60 });

// 5. Verify energy spike
ZEnergyResponse.getState();
// → { energy: 92, harmony: 48, load: 65, resonance: 0.42 }

// 6. Check trend
ZEnergyResponse.getTrend(1);
// → [{ timestamp: 1705416897234, energy: 92, harmony: 48, load: 65, emotion: {...} }]
```

---

## 🚨 Troubleshooting

### "ZEmotionFilter is not defined"

→ Check that `z_emotion_filter.js` loads **before** `z_energy_response.js` in index.html ✓ (fixed)

### Energy/Harmony not changing

→ Live Server may need refresh. Try: `Ctrl+Shift+R` (hard refresh)

### Coherence always same value

→ Check that `filterEnergy()` is being called. Look for emotional history with different timestamps:

```javascript
ZEmotionFilter.getHistory(5).map((h) => ({ t: h.timestamp, c: h.clarity }));
```

### No DOM console output

→ Check that `#zConsole` div exists in HTML ✓ (present)
→ Verify `ZStatusConsole.log()` is being called (look for [STATUS] prefix in browser console)

---

## ✅ Sign-Off

Once all tests pass:

- [ ] Module initialization logged
- [ ] Pulse output every 2 seconds with coherence
- [ ] Console API tests respond correctly
- [ ] Stimuli cause observable state changes
- [ ] History/trends accessible

### Status: Ready for next layer
