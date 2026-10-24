/* Generated GW-10 critic rules. Public-safe only. */
window.GW10_CRITIC = {
  "schema": "gw10_critic_payload_v1",
  "phase": "GW-10",
  "runtime_status": "SANDBOX_LOCAL_ONLY",
  "production_runtime": "CLOSED",
  "provider": "NONE",
  "corpus_records": 22,
  "rules": {
    "schema": "gw10_critic_rules_v1",
    "phase": "GW-10",
    "runtime_status": "SANDBOX_LOCAL_ONLY",
    "production_runtime": "CLOSED",
    "note": "Public-safe deterministic critic rules. Same facts as Normal Guide. Criticism ≠ invention. Criticism ≠ private disclosure.",
    "public_name": "Challenge Z-Sanctuary",
    "label": "LOCAL CRITIC SANDBOX",
    "laws": [
      "intent changes framing ≠ truth",
      "criticism ≠ invention",
      "criticism ≠ private disclosure",
      "skepticism ≠ falsehood",
      "AI answer ≠ evidence",
      "UNKNOWN ≠ failure",
      "private ≠ answerable",
      "prototype ≠ production",
      "potential ≠ revenue"
    ],
    "critique_types": [
      "EVIDENCE_GAP",
      "VALIDATION_GAP",
      "SCOPE_LIMIT",
      "PROTOTYPE_LIMIT",
      "COMMERCIAL_GAP",
      "CLAIM_RISK",
      "UNKNOWN",
      "NO_MATERIAL_PUBLIC_GAP_FOUND"
    ],
    "evidence_ladder": [
      "CONCEPT",
      "INTERNAL IMPLEMENTATION",
      "INTERNAL VERIFICATION",
      "PUBLIC-SAFE EVIDENCE",
      "INDEPENDENT VALIDATION",
      "PILOT",
      "PRODUCTION",
      "COMMERCIAL VALIDATION"
    ],
    "evidence_ladder_note": "Not every capability must follow a commercial path. The ladder describes possible public-evidence progression, not a required product roadmap.",
    "strengthen_by_state": {
      "CONCEPT": "Approved public-safe implementation evidence, then internal verification, then independent validation if the claim is offered publicly.",
      "QUALIFIED": "Independent public validation of this specific claim. QUALIFIED is not VERIFIED.",
      "SEALED": "Public deployment evidence for the named slice. SEALED is not deployed.",
      "VERIFIED": "Keep the claim within what the independent validation actually covers."
    },
    "default_unknown": {
      "subject_id": "golden_guide_ai",
      "critique_type": "UNKNOWN",
      "current_claim": "No approved public-safe claim is available for this question.",
      "current_evidence": "none in the 22-record corpus",
      "limitation": "I don't have enough approved public evidence to answer that yet.",
      "what_would_strengthen_it": "An approved public-safe knowledge record that grounds the question without private ingest.",
      "related_public_surface": "index.html"
    },
    "records": {
      "K-SITE-IDENTITY": {
        "critique_type": "SCOPE_LIMIT",
        "ladder_rung": "PUBLIC-SAFE EVIDENCE",
        "what_would_strengthen_it": "Publication authorization. Local shell identity is not a live public service."
      },
      "K-CORE-PURPOSE": {
        "critique_type": "EVIDENCE_GAP",
        "ladder_rung": "INTERNAL VERIFICATION",
        "what_would_strengthen_it": "Independent public validation of the ecosystem claim. QUALIFIED is not VERIFIED. Implemented components are not a finished public platform."
      },
      "K-CORE-NOT-FINISHED": {
        "critique_type": "SCOPE_LIMIT",
        "ladder_rung": "INTERNAL VERIFICATION",
        "what_would_strengthen_it": "Approved public production evidence. A PASS evidence gate is not a VERIFIED badge and is not deploy authority."
      },
      "K-QUALIFIED": {
        "critique_type": "EVIDENCE_GAP",
        "ladder_rung": "PUBLIC-SAFE EVIDENCE",
        "what_would_strengthen_it": "A public VERIFIED badge covering the specific claim. QUALIFIED must not be rewritten as VERIFIED."
      },
      "K-SEALED": {
        "critique_type": "SCOPE_LIMIT",
        "ladder_rung": "INTERNAL VERIFICATION",
        "what_would_strengthen_it": "Public deployment evidence. SEALED is not deployed and is not a public launch."
      },
      "K-EVIDENCE-MODE": {
        "critique_type": "SCOPE_LIMIT",
        "ladder_rung": "PUBLIC-SAFE EVIDENCE",
        "what_would_strengthen_it": "Treat Evidence Mode as a local viewing aid, not independent verification."
      },
      "K-DRP": {
        "critique_type": "VALIDATION_GAP",
        "ladder_rung": "PUBLIC-SAFE EVIDENCE",
        "what_would_strengthen_it": "Do not treat 14 DRP as a legal or safety certification or as proof that every helper behaves perfectly."
      },
      "K-HUMAN-DECIDES": {
        "critique_type": "NO_MATERIAL_PUBLIC_GAP_FOUND",
        "ladder_rung": "PUBLIC-SAFE EVIDENCE",
        "what_would_strengthen_it": "Keep humans authoritative. Doctrine is not evidence that every helper automatically obeys."
      },
      "K-NO-AUTO-DEPLOY": {
        "critique_type": "SCOPE_LIMIT",
        "ladder_rung": "PUBLIC-SAFE EVIDENCE",
        "what_would_strengthen_it": "Doctrine is not a live public enforcement API. Continue to forbid hidden runtime and automatic deploy or merge."
      },
      "K-TURTLE": {
        "critique_type": "SCOPE_LIMIT",
        "ladder_rung": "PUBLIC-SAFE EVIDENCE",
        "what_would_strengthen_it": "Turtle Mode is an operating discipline, not a public product SKU or a security certification."
      },
      "K-EAII": {
        "critique_type": "CLAIM_RISK",
        "ladder_rung": "INTERNAL IMPLEMENTATION",
        "what_would_strengthen_it": "Keep Z-EAII inside governance. Do not claim unrestricted super-intelligence or a live public orchestration API."
      },
      "K-QADP": {
        "critique_type": "CLAIM_RISK",
        "ladder_rung": "INTERNAL IMPLEMENTATION",
        "what_would_strengthen_it": "Keep QADP distinct from Golden Guide AI. Local Knowledge Ask prototypes are not a public production Q&A service."
      },
      "K-OBSERVE": {
        "critique_type": "SCOPE_LIMIT",
        "ladder_rung": "INTERNAL IMPLEMENTATION",
        "what_would_strengthen_it": "Keep Cycle Observe as observation only. Do not claim autonomous intervention, repair, merge, or a live public telemetry feed."
      },
      "K-NAVIGATOR": {
        "critique_type": "SCOPE_LIMIT",
        "ladder_rung": "INTERNAL VERIFICATION",
        "what_would_strengthen_it": "WORKING local UI is not public production. SEALED is not deployed. The navigator is not the full Golden Universe Map."
      },
      "K-MAP-FOUNDATION": {
        "critique_type": "SCOPE_LIMIT",
        "ladder_rung": "PUBLIC-SAFE EVIDENCE",
        "what_would_strengthen_it": "Do not present six nodes as the complete Universe or as live infrastructure. The 160-node map remains closed."
      },
      "K-GALLERY": {
        "critique_type": "CLAIM_RISK",
        "ladder_rung": "PUBLIC-SAFE EVIDENCE",
        "what_would_strengthen_it": "Keep captures labelled current vs historical. A visual is not evidence by itself. A screenshot is not backend proof."
      },
      "K-HISTORICAL-VISUAL": {
        "critique_type": "CLAIM_RISK",
        "ladder_rung": "PUBLIC-SAFE EVIDENCE",
        "what_would_strengthen_it": "Keep the GW-3A board labelled HISTORICAL. It must not be presented as the current six-record site."
      },
      "K-MUSEUM": {
        "critique_type": "PROTOTYPE_LIMIT",
        "ladder_rung": "INTERNAL IMPLEMENTATION",
        "what_would_strengthen_it": "Public service evidence, if ever authorized. Prototype ≠ production. Local ≠ deployed."
      },
      "K-GUIDE-IDENTITY": {
        "critique_type": "SCOPE_LIMIT",
        "ladder_rung": "CONCEPT",
        "what_would_strengthen_it": "Production Golden Guide AI remains closed. This sandbox is a local preview, not a public AI service."
      },
      "K-GUIDE-NOT-ZUNO": {
        "critique_type": "NO_MATERIAL_PUBLIC_GAP_FOUND",
        "ladder_rung": "CONCEPT",
        "what_would_strengthen_it": "Keep Golden Guide distinct from Zuno. Do not describe private Zuno memory."
      },
      "K-COMMERCIAL": {
        "critique_type": "COMMERCIAL_GAP",
        "ladder_rung": "CONCEPT",
        "what_would_strengthen_it": "Approved public commercial validation. Do not state revenue, customers, market share, valuation, or ROI until such evidence exists."
      },
      "K-UNKNOWN": {
        "critique_type": "UNKNOWN",
        "ladder_rung": "CONCEPT",
        "what_would_strengthen_it": "An approved public-safe record that grounds the question. A review queue is not implemented yet."
      }
    }
  },
  "maps": {
    "schema": "gw10_critic_curated_map_v1",
    "phase": "GW-10",
    "note": "Exact-normalized critic mappings onto GW-8 knowledge IDs. Not new facts.",
    "maps": [
      {
        "match": "what is the weakest part of the public evidence",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-QUALIFIED",
          "K-CORE-NOT-FINISHED",
          "K-COMMERCIAL",
          "K-MAP-FOUNDATION"
        ]
      },
      {
        "match": "which claims are still only concepts",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-GUIDE-IDENTITY",
          "K-COMMERCIAL",
          "K-UNKNOWN"
        ]
      },
      {
        "match": "what has not been independently validated",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-QUALIFIED",
          "K-DRP",
          "K-COMMERCIAL"
        ]
      },
      {
        "match": "which systems are not production ready",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-CORE-NOT-FINISHED",
          "K-MUSEUM",
          "K-NAVIGATOR"
        ]
      },
      {
        "match": "what does the current website not prove",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-CORE-NOT-FINISHED",
          "K-GALLERY",
          "K-MAP-FOUNDATION",
          "K-COMMERCIAL"
        ]
      },
      {
        "match": "is cycle observe autonomously intervening",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-OBSERVE"
        ]
      },
      {
        "match": "is z eaii an unrestricted super intelligence",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-EAII"
        ]
      },
      {
        "match": "are all six records verified",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-QUALIFIED",
          "K-CORE-PURPOSE"
        ]
      },
      {
        "match": "does qualified mean independently proven",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-QUALIFIED"
        ]
      },
      {
        "match": "is the six node map live infrastructure",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-MAP-FOUNDATION"
        ]
      },
      {
        "match": "does turtle mode prove every helper is secure",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-TURTLE"
        ]
      },
      {
        "match": "do 14 drp prove every ai behaves perfectly",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-DRP"
        ]
      },
      {
        "match": "can the guide deploy without a human",
        "behavior": "ANSWER",
        "knowledge_ids": [
          "K-NO-AUTO-DEPLOY",
          "K-HUMAN-DECIDES"
        ]
      },
      {
        "match": "who actually makes final decisions",
        "behavior": "ANSWER",
        "knowledge_ids": [
          "K-HUMAN-DECIDES"
        ]
      },
      {
        "match": "is human gated doctrine a legal certification",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-DRP"
        ]
      },
      {
        "match": "why should i not invest yet",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-COMMERCIAL",
          "K-CORE-NOT-FINISHED",
          "K-MAP-FOUNDATION"
        ]
      },
      {
        "match": "what public evidence is still missing for stronger diligence",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-COMMERCIAL",
          "K-QUALIFIED",
          "K-CORE-NOT-FINISHED"
        ]
      },
      {
        "match": "is there approved revenue evidence",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-COMMERCIAL"
        ]
      },
      {
        "match": "are there approved customer counts",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-COMMERCIAL"
        ]
      },
      {
        "match": "what would investment accelerate",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-COMMERCIAL"
        ]
      },
      {
        "match": "guarantee that an investment will succeed",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-COMMERCIAL"
        ]
      },
      {
        "match": "is z sanctuary commercially validated",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-COMMERCIAL"
        ]
      },
      {
        "match": "is this a billed public product catalog",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-COMMERCIAL",
          "K-CORE-NOT-FINISHED"
        ]
      },
      {
        "match": "does potential mean current revenue",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-COMMERCIAL"
        ]
      },
      {
        "match": "could these screenshots mislead an investor",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-GALLERY",
          "K-HISTORICAL-VISUAL"
        ]
      },
      {
        "match": "are the screenshots proof the backend works",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-GALLERY"
        ]
      },
      {
        "match": "is the museum prototype production",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-MUSEUM"
        ]
      },
      {
        "match": "does historical capture represent the current site",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-HISTORICAL-VISUAL"
        ]
      },
      {
        "match": "is a real ui capture independent verification",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-GALLERY",
          "K-QUALIFIED"
        ]
      },
      {
        "match": "can golden guide execute actions",
        "behavior": "ANSWER",
        "knowledge_ids": [
          "K-NO-AUTO-DEPLOY"
        ]
      },
      {
        "match": "is golden guide zuno",
        "behavior": "ANSWER",
        "knowledge_ids": [
          "K-GUIDE-NOT-ZUNO",
          "K-GUIDE-IDENTITY"
        ]
      },
      {
        "match": "is qadp the live public chatbot",
        "behavior": "ANSWER",
        "knowledge_ids": [
          "K-QADP",
          "K-GUIDE-IDENTITY"
        ]
      },
      {
        "match": "what independent external validation exists today",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-QUALIFIED",
          "K-COMMERCIAL"
        ]
      },
      {
        "match": "what evidence would change a qualified answer to verified",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-QUALIFIED"
        ]
      },
      {
        "match": "what missing benchmark would a skeptical ai researcher challenge",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-QUALIFIED",
          "K-EAII",
          "K-CORE-NOT-FINISHED"
        ]
      },
      {
        "match": "are there public performance benchmarks for z eaii",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-EAII"
        ]
      },
      {
        "match": "what would a skeptical ai researcher challenge",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-QUALIFIED",
          "K-GALLERY",
          "K-COMMERCIAL",
          "K-MAP-FOUNDATION"
        ]
      },
      {
        "match": "do hub tests prove a public scientific product",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-CORE-PURPOSE",
          "K-CORE-NOT-FINISHED"
        ]
      },
      {
        "match": "what is the classified overlay complete system count in production",
        "behavior": "UNKNOWN",
        "knowledge_ids": []
      },
      {
        "match": "when is the public launch date",
        "behavior": "UNKNOWN",
        "knowledge_ids": [
          "K-UNKNOWN"
        ]
      },
      {
        "match": "is z sanctuary production ready",
        "behavior": "QUALIFY",
        "knowledge_ids": [
          "K-CORE-NOT-FINISHED",
          "K-MUSEUM"
        ]
      },
      {
        "match": "can golden guide access private telemetry",
        "behavior": "PRIVATE_REFUSAL",
        "knowledge_ids": []
      }
    ]
  }
};
