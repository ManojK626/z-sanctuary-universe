# Z-OTF — Meta Idea Reconciliation Ledger

**Phase:** 0 · **Mutation class:** `DOCS_ONLY`
**Purpose:** preserve useful concepts from the prior Meta AI conversation without preserving invented certainty
**Status of this document:** idea ledger · **not** evidence that any feature exists, is implemented, or is authorized

Preservation rule:

> Move forward while retaining learning.

Nothing in this ledger is a claim about the world. A row records what an idea is, what state it is in, and what evidence would be needed to advance it.

---

## 1. State vocabulary

Each imported concept receives exactly one primary state:

| State | Meaning |
| --- | --- |
| `KEEP` | Concept is valuable and survives into Z-OTF thinking as designed |
| `REUSE_EXISTING` | A Z-Sanctuary capability already covers this; consume it rather than rebuild |
| `REBUILD` | The idea is useful but its original form was misleading and must be reframed |
| `FUTURE_DECLARED` | Recorded for a later closed phase; no design authority now |
| `QUARANTINE` | Retained as lineage only; must not become a canonical fact without evidence |
| `REJECT` | Technically or ethically unsound as stated |
| `UNKNOWN` | Cannot be assessed on available evidence |

Three further dimensions stay **independent** and must never be collapsed into one GREEN. Evidence posture: `KNOWN`, `SUPPORTED`, `UNVERIFIED`, `CONTRADICTED`, `UNKNOWN`, `STALE`. Implementation posture: `CONCEPT`, `MOCK`, `DOCUMENTED`, `IMPLEMENTED`, `TESTED`, `DEPLOYED`. Authority posture: see [Evidence and State Doctrine](Z_OTF_EVIDENCE_AND_STATE_DOCTRINE.md).

Every row below is at implementation posture `CONCEPT` unless a specific canonical surface is named, in which case the existing surface carries its own posture.

---

## 2. Product and business concepts

| Concept from the Meta thread | State | Reason and destination |
| --- | --- | --- |
| Two business lanes (local and global operations) | `KEEP` | Useful product segmentation. Pricing remains evidence-gated by Z-SUSBV. |
| Buyer / seller / supplier / customer perspectives | `FUTURE_DECLARED` | Domain model and server-enforced access belong to Phase 7. A role switcher is a demo, not security. |
| Comparator interface | `REUSE_EXISTING` | Any interface consumes Z-SUSBV evidence. Z-OTF does not become a comparator authority. |
| Dual-lane pricing tiers | `FUTURE_DECLARED` | Requires documented cost-to-serve and human commercial approval. |
| Free digital gifts | `FUTURE_DECLARED` | Ordinary marketing feature; requires consent and terms. |
| Referral engine | `FUTURE_DECLARED` | Must comply with disclosure, anti-spam and platform rules. |
| Overnight or "while you sleep" positioning | `KEEP` | Allowed only if operationally true; implies no service level without a measured guard. |
| Google reviews "10 included" | `REBUILD` | Becomes a review-request workflow. Reviews cannot be guaranteed or purchased as a deliverable. |
| Scraper bot for lead generation | `QUARANTINE` | Terms-of-service, privacy and anti-spam review required before the idea may be revisited. |
| Fourteen marketing rules | `REUSE_EXISTING` | Map to existing 14 DRP and Z-SUSBV commercial policy plus applicable law; do not create a parallel ethics code. |

---

## 3. Brand and naming lineage

| Concept | State | Reason |
| --- | --- | --- |
| `VERIDIAN` public brand | `QUARANTINE` | No clearance evidence. See [Public Brand Hold](Z_OTF_PUBLIC_BRAND_HOLD.md). |
| `VERIDIAN CORE` | `REBUILD` | Becomes a future Z-OTF knowledge interface with honest data-mode declaration. |
| `VERIDIAN Studio` | `FUTURE_DECLARED` | Existing Z-Sanctuary media and creative engines should be reused instead. |
| `VERICOM` comparator | `REUSE_EXISTING` | Interface only, over Z-SUSBV evidence. |
| `FACT-TRACE` | `REBUILD` | The provenance idea is good; the public mark is not cleared and the state model must be evidence-driven. |
| `SCOUT` / `SHIELD` / `SIGNAL` minibots | `REUSE_EXISTING` | Map to existing minibot governance and Traffic MiniBots. No autonomous authority, no new minibot architecture. |
| Trademark symbol usage | `REJECT` | No registration evidence exists. |

---

## 4. Truth, quality and evidence concepts

| Concept | State | Reason |
| --- | --- | --- |
| CAAS rubric (clarity, accuracy process, actionability, safety) | `KEEP` | Retained strictly as a content-quality rubric. Never a truth or verification authority. |
| "20/20 GREEN" as universal verification | `REJECT` | A single score cannot describe quality, truth, implementation, deployment, compliance, security, provenance, freshness and commercial authorization at once. |
| "20/20" as a content-quality score | `KEEP` | Valid only alongside an independent claim state. |
| Source / date / status badges | `KEEP` | Must reflect real evidence, not a display default. |
| Proof Recipes | `REBUILD` | Become future Operational Provenance Records (`OPR`). Not legal evidence. No blockchain implication. |
| Hash receipts | `REBUILD` | Require canonical serialization and an approved digest. Hash is not signature. |
| Public certificate verification | `REBUILD` | May verify issuance authenticity only; may never imply external accreditation. |
| "ZCTT doctrine" | `REUSE_EXISTING` | Learning doctrine aligns to Z-LIC and Z-PoT rather than creating a new authority. |
| Automatic legal compliance score | `REJECT` | A system cannot self-certify broad legal compliance. |
| Numeric truth or confidence score | `REJECT` | Prohibited as epistemic authority by Z-PoT section 8. |

---

## 5. Technical and platform concepts

| Concept | State | Reason |
| --- | --- | --- |
| Local-first storage in the browser | `FUTURE_DECLARED` | Must define encryption, sync and cloud modes before any claim is made. |
| "Your data never leaves your device" | `QUARANTINE` | May not be stated unless the runtime provably operates in `LOCAL_ONLY` mode. |
| WhatsApp quick replies, manual | `FUTURE_DECLARED` | A manual Business App workflow is legitimate and clearly labelled as manual. |
| WhatsApp autonomous order bot without a platform API | `REJECT` | Technically misleading as described. |
| AI assistant | `KEEP` | Must disclose AI interaction where required and carry no hidden authority. |
| Self-learning model retraining | `FUTURE_DECLARED` | Feedback may inform proposals. Authority changes need a human gate, per Z-LIC laws 3 and 5. |
| AI voice, image and video tools | `FUTURE_DECLARED` | Separate capability lane; existing media engines are the reuse candidates. |
| Live media interface | `FUTURE_DECLARED` | Only after core operations demonstrate value. |
| Kafka / Kubernetes as a default stack | `REJECT` | Premature infrastructure for an unbuilt product. |
| Supabase / R2 / Vercel as assumed providers | `UNKNOWN` | Provider choice follows requirements. Any external provider must pass the existing Z-XBUS connector gate. |
| Stripe as an assumed merchant stack | `UNKNOWN` | Legal entity and country support must be verified first. |
| A `.edu` public academy domain | `REJECT` | Domain eligibility and availability are not established. |
| Global tax engine | `REBUILD` | High risk. Decision support with professional review only; never fabricated certainty. |
| "Compliance Specialist Level III" title | `REBUILD` | Must not imply a professional qualification or accreditation. |

---

## 6. Learning and community concepts

| Concept | State | Reason |
| --- | --- | --- |
| Academy and free knowledge | `FUTURE_DECLARED` | Certificate of completion only, unless a real accrediting relationship exists. |
| Personalized learning paths | `KEEP` | User self-selection only. No covert profiling. |
| Brain and focus learning tools | `KEEP` | Productivity framing only. No medical or diagnostic claims. |
| Feedback loop | `FUTURE_DECLARED` | Governed by Z-LIC. Feedback may not silently broaden autonomy, rewrite policy, alter prices, or redefine truth. |
| Human-approved AI assistance | `KEEP` | This is the canonical Z-Sanctuary pattern: observe, verify, suggest, human decides. |

---

## 7. Unsupported claim quarantine

None of the following may become a canonical fact, appear in public copy, or be treated as evidence. They are retained as creative lineage only.

| Quarantined claim | Evidence posture | What would be required to revive it |
| --- | --- | --- |
| `BLOCKCHAIN VERIFIED` / `ON-CHAIN VERIFIED` | `UNVERIFIED` | A real chain, a real anchoring model, and a verifiable transaction |
| Block numbers, transaction hashes, Merkle roots, IPFS records | `UNVERIFIED` | Real anchored records; demonstration placeholders can never be promoted |
| "EU Blockchain Registry" listing | `UNVERIFIED` | Documented registration from the named body |
| `immutable` | `UNVERIFIED` | A storage or anchoring model that technically supports the word |
| Insurance policies, including €500k and €2m coverage | `UNVERIFIED` | A real policy document, insurer, policy number, scope and effective dates |
| `99.99% uptime` | `UNVERIFIED` | A measured service with a real denominator; see `scripts/z_slo_guard.mjs` |
| `98.7% compliant` | `UNVERIFIED` | A defined standard, scope, denominator and qualified review |
| `12,400+ learners` | `UNVERIFIED` | Real enrolment records from a real service |
| Existing paying clients or orders | `UNVERIFIED` | Real contracts or transaction records |
| Revenue, ROI or savings figures | `UNVERIFIED` | Source, model, assumptions, date and Z-SUSBV review |
| Benchmark superiority, "best", "#1" | `UNVERIFIED` | Sourced, dated, like-for-like comparison under Z-SUSBV policy |
| Customer counts, delivery metrics, sales results | `UNVERIFIED` | Real operational records |
| "cannot be copied" | `CONTRADICTED` | Not achievable as stated for published digital content |
| "legally bulletproof" | `UNVERIFIED` | Not a statement any system may make |
| "Palantir-level verification" | `UNVERIFIED` | Defined comparison criteria and evidence |
| Accreditation or recognized-authority status | `UNVERIFIED` | A real accrediting relationship |
| Stripe or Wise fee assertions | `UNVERIFIED` | Current published provider schedules with retrieval date |
| Domain ownership or availability | `UNVERIFIED` | Registrar records |
| `VERIDIAN™` and related marks | `UNVERIFIED` | Completed clearance; see Public Brand Hold |
| "only platform in Mauritius" | `UNVERIFIED` | Market survey with source and date |

---

## 8. Placeholder quarantine law

Any imported string resembling a fake customer name, payment identifier, insurance policy number, hash, block, verification URL, learner metric, revenue metric or delivery metric must be labelled:

`DEMO_PLACEHOLDER · NOT EVIDENCE · NOT FOR PUBLICATION`

or removed. A mock may demonstrate a user experience. A mock may never prove adoption, revenue, uptime, compliance, insurance, accreditation, deployment or performance.

No automated scanner for unsupported textual claims was located on the Phase 0 audit base. Quarantine in this phase is therefore documentary and human-reviewed, and must not be described as enforced by tooling.

---

## 9. Reconciliation applied to the intake pack itself

The doctrine applies to the Z-OTF intake pack as well as to the Meta thread.

| Statement in the intake pack | Finding | Disposition |
| --- | --- | --- |
| The name "Veridian" is already used by multiple active technology businesses and appears in current trademark activity in software classes | No trademark, registry or market search was performed in this phase, and no source was supplied | Restated in [Public Brand Hold](Z_OTF_PUBLIC_BRAND_HOLD.md) as `UNVERIFIED` rationale for caution, not as an established fact |
| Pack references `docs/Z_TRAFFIC_MINIBOTS.md`, `data/z_autonomy_task_policy.json`, `docs/COMMERCIAL-READINESS.md`, `docs/pricing-and-benchmarks.md`, `docs/QUARTERLY-MARKET-AND-FACTS-REVIEW.md` and the entitlement policy | All verified present and tracked on the audit base | Cited as canonical |
| Pack asserts its evidence states are Z-PoT compatible | Verified against Z-PoT section 7; the nine states match exactly | Confirmed and adopted |
| Pack refers to "existing composed / cross-project awareness surfaces" as a single reuse target | Cross-project and ecosystem awareness surfaces exist; a distinct "Z-Composed Awareness" surface is named by Z-PoT and Z-LIC but is not tracked on this base | Split into `REUSE_CANONICAL` and `UNKNOWN` rows in the matrix |
| Pack file `00_CURSOR_START_HERE.md` is listed in the pack manifest | The file was absent from the delivered staging folder | Authored from the pack README and execution instructions; recorded as a pack gap, not silently ignored |

---

## 10. Preservation rule

Do not delete creative history merely because a claim is unverified. Preserve the idea, its lineage, why it was interesting, its current evidence state, and what evidence would be needed to revive it.

Z-OTF is allowed to say: **we do not know yet.**
