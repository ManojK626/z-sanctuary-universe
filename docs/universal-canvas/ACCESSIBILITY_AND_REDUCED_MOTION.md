# Z-UCCR — Accessibility and Reduced Motion

**Purpose:** Universal Canvas must be **operable and bearable** for calm, overwhelm, low vision, motion sensitivity, and keyboard-first operators.

---

## 1. Hard requirements (planning → implementation)

- **Reduced motion:** Honor `prefers-reduced-motion`; **no** mandatory animation to read state.
- **Mute / no audio default:** Soundscapes off until explicit opt-in; never surprise audio on verify pass.
- **Plain mode:** Strip particles, rivers, parallax—layout + text + borders only.
- **No flashing defaults:** No >3 Hz patterns; avoid rapid color toggles.
- **Readable contrast:** Meet or exceed dashboard’s existing a11y toggles patterns where applicable.
- **Keyboard navigation goal:** Every panel focusable; visible focus rings; logical tab order.
- **Calm mode for overwhelm:** Slow or pause decorative motion; shrink visual density.
- **User-controlled effects:** Intensity slider or preset (Calm / Normal / Storm / Plain).

---

## 2. Pairing with existing hub

Reference Control Centre **Display & accessibility** behaviors in HODP HTML for parity when implementing Z-UCCR UI.

---

## 3. Testing posture (future)

When UI exists: pair automated checks with human assistive tech smoke (NVDA/VoiceOver). Document results in receipts.

---

## 4. Guardian alignment

Guardian visuals must **de-escalate**, not **startle**—especially Vegeta/STOP metaphors: firm, not violent.
