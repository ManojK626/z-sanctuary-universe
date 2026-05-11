# Z-Build Gate Matrix (Zuno build-phase process)

**Purpose:** Answer **how Cursor and autonomous AI build safely** without shipping the wrong things too early. Every new module gets a **single label** before heavy coding: **BUILD NOW**, **PREPARE ONLY**, **WAIT**, **ARCHIVE**, or **REJECT / BLOCK**.

**Authority when unsure:** [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md). **Registry and modules:** [Z-MASTER-MODULES-REGISTER.md](Z-MASTER-MODULES-REGISTER.md). **Completions and comms:** [Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md](Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md).

**See also (discipline, not more features):** [Z-TRUTH-CHAIN-AND-OPERATOR-DISCIPLINE.md](Z-TRUTH-CHAIN-AND-OPERATOR-DISCIPLINE.md) — truth chain, stop feature explosion, learning cycles, backup ritual, Cursor vs authority, dashboard rail grouping, privacy rule, public slice 1.

---

## 1. Pipeline (every project / module)

Use this order from idea to ship:

```text
Idea / Monolith
        ↓
Slice Map
        ↓
Usefulness Gate  ← classify here (this document)
        ↓
Build Plan
        ↓
Cursor Builder Task
        ↓
Autonomous AI Checks
        ↓
Mini-bot / QOSMEI / Zuno Review
        ↓
Human GO / HOLD
        ↓
Deploy or Archive
```

---

## 2. Usefulness gate: build, wait, or reject

Classify **before** large code investment:

| Status | Meaning |
| ------------------ | --------------------------------------------------------------------------- |
| **BUILD NOW** | Needed for slice 1–2, supports real users, low risk. |
| **PREPARE ONLY** | Useful later; docs, schema, mocks, staging surfaces only. |
| **WAIT** | Good idea; blocked on identity, payments, NAS, legal, or upstream maturity. |
| **ARCHIVE** | Visionary; not useful in the current horizon. |
| **REJECT / BLOCK** | Unsafe, illegal, confusing, or governance risk too high. |

### Example module labels (Zuno-style advice — refresh as strategy shifts)

| Module / theme | Suggested gate (as of matrix authoring) |
| ------------------------------------------------- | -------------------------------------------------------------------------------- |
| MirrorSoul (slice 1) | **BUILD NOW** |
| ZES trust stub | **BUILD NOW** |
| Z-SUC reader visibility | **BUILD NOW** |
| Z-Add On staging dashboard | **BUILT** (staging path); extend as **PREPARE ONLY** until promoted to main HODP |
| Content library (podcasts / ebooks / media cards) | **PREPARE ONLY** → light mocks before full library |
| Website builder | **PREPARE ONLY** (templates + blocks; no marketplace yet) |
| Video / movie platform (full) | **WAIT** |
| Payment / commerce | **WAIT** |
| Social / love matching | **WAIT** until safety + identity + moderation |
| Z-HeartPulse Engine v1.0 | **PREPARE ONLY** (reflection + storytelling only; no person scoring) |
| Casino / real-money gaming | **WAIT** / **HIGH GOVERNANCE** (if ever in scope) |

---

## 3. Cursor AI: builder crew, not final authority

**Cursor may safely:**

```text
generate files
refactor small modules
write tests
wire pages / API routes
update docs (when asked or per register)
prepare mock data
```

**Cursor must not do silently (human / overseer first):**

```text
delete folders
move project roots
change governance gates
edit release control
touch payment / security rules without explicit policy
deploy live
```

---

## 4. Autonomous AI: checks and advice, not uncontrolled execution

| Layer | Question |
| ---------- | ----------------------------------------- |
| Guardian | Did files move? Hygiene and policy drift? |
| SPI | Did structure drift? |
| QOSMEI | What matters most right now? |
| Predictive | What might fail next? |
| Validation | Was the prediction useful / accurate? |
| Zuno | Final reflection and state for operators |

**Suggested check loop (from hub root, `ZSanctuary_Universe`):**

```powershell
npm run bot:awareness:plus
npm run spi:analyze
npm run qosmei:signal
npm run predictive:intel
npm run prediction:validate
npm run zuno:state
```

Interpret outputs with the usefulness gate: lean toward **BUILD NOW**, **WAIT**, or **BLOCK** for the _next_ slice, not for every dream feature at once.

---

## 5. Safe build phases (big all-in-one platform)

Order for a future unified surface (video, podcasts, site builder, tools):

| Phase | Scope |
| --------------------------------------- | --------------------------------------------------------------------------------------------- |
| **A — Core shell** | One dashboard, auth later, module registry, safe routing. |
| **B — MirrorSoul + ZES** | Human signal + trust foundation. |
| **C — Content library** | Podcasts, ebooks, songs, videos as **stored media cards**; not a full streaming platform yet. |
| **D — Website builder lite** | Templates + page blocks only; no marketplace. |
| **E — Creator tools** | Upload, metadata, collections. |
| **F — Payments / commerce** | Only after identity, privacy, legal, refunds are ready. |
| **G — Social / matching / global feed** | Only after moderation and safeguarding exist. |

---

## 6. Decision rule (before any module build)

Ask:

```text
Does this help the first public slice?
Does it reduce risk?
Does it create real user signal?
Can we test it safely?
Can we undo it?
```

- Mostly **yes** → **BUILD NOW** (still use human GO for deploy).
- Mixed → **PREPARE ONLY** or **WAIT**.
- **No** on safety / undo → **BLOCK** or **ARCHIVE**.

---

## 7. Zuno recommendation (near-term stack)

Priority order for continued work:

1. MirrorSoul slice 1
2. ZES trust stub
3. Continuation / Z-SUC reader visibility
4. Content library **mock**
5. Website builder **mock**

Do **not** rush full movies, global social, or payments until governance, storage, and identity layers match the phase table above.

---

## 8. Living matrix (fill in)

Add rows as modules appear. One label per row; change only after gate review.

| Module or initiative | Gate | Owner / notes | Last reviewed |
| ------------------------------ | ------------ | ------------------------------------------------------------------------------- | ------------- |
| _(example)_ MirrorSoul slice 1 | BUILD NOW | | |
| _(example)_ ZES trust stub | BUILD NOW | | |
| Z-HeartPulse Engine v1.0 | PREPARE ONLY | Reflection-only; consent + dignity boundary; no relationship prediction/control | 2026-04-27 |
| | | | |

---

_Zuno build-phase process — Z-Sanctuary hub. Aligns with Z-Super Overseer, Z-HODP, Z-EAII, and Zuno reflection (no execution authority on Zuno alone)._
