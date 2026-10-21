/**
 * GW-9 Golden Guide deterministic grounding engine.
 * Provider-free. No embeddings. No network. Corpus in, one of five behaviors out.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) root.GoldenGuideEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const BEHAVIORS = ["ANSWER", "QUALIFY", "ROUTE", "PRIVATE_REFUSAL", "UNKNOWN"];
  const INTENT_CLASSES = [
    "PUBLIC_EXPLORATION",
    "INVESTOR",
    "BUSINESS_PARTNER",
    "RESEARCHER",
    "GOVERNMENT_INSTITUTION",
    "ENGINEER_CONTRIBUTOR",
    "CRITIC_REVIEW",
    "UNKNOWN",
  ];

  const UNKNOWN_TEXT = "I don't have enough approved public evidence to answer that yet.";
  const PRIVATE_TEXT =
    "That information is not part of the approved public knowledge available to Golden Guide.";
  const NO_ZUNO_TEXT =
    "No. Golden Guide AI is the public evidence navigator for the Golden Website. It is not Zuno, does not expose private Zuno capabilities, and is not AMK Personal AI.";
  const LOCAL_PAGES = new Set([
    "index.html",
    "portfolio.html",
    "universe-map.html",
    "gallery.html",
    "museum.html",
    "core.html",
    "navigator.html",
    "drp.html",
    "eaii.html",
    "qadp.html",
    "observe.html",
    "guide-sandbox.html",
    "gateway.html",
    "ai-integrity.html",
  ]);
  const SURFACE_LABELS = {
    "index.html": "Golden Home / Evidence Mode",
    "portfolio.html": "Portfolio",
    "universe-map.html": "Universe Map foundation",
    "gallery.html": "Golden Gallery",
    "museum.html": "Prototype Museum",
    "core.html": "Z-Sanctuary Core",
    "navigator.html": "Navigator",
    "drp.html": "14 DRP",
    "eaii.html": "Z-EAII",
    "qadp.html": "Grounded Questions (QADP)",
    "observe.html": "Cycle Observe",
    "guide-sandbox.html": "Golden Guide sandbox",
    "gateway.html": "Partners & Investors Gateway",
    "ai-integrity.html": "How We Handle AI Failure",
  };
  const STOP = new Set([
    "a", "an", "the", "is", "are", "am", "was", "were", "be", "to", "of", "for", "in", "on", "at",
    "and", "or", "do", "does", "did", "can", "you", "me", "my", "your", "it", "this", "that", "what",
    "who", "how", "why", "when", "with", "from", "by", "as", "if", "not", "yes", "right", "please",
  ]);
  const SUBJECT_ALIASES = {
    z_sanctuary_core: ["z sanctuary", "sanctuary universe", "ecosystem", "finished", "production platform"],
    fourteen_drp_protocols: ["14 drp", "fourteen drp", "drp", "final decisions", "human decides"],
    turtle_mode: ["turtle mode", "turtle"],
    z_eaii: ["z eaii", "eaii", "orchestration"],
    grounded_questions_qadp: ["qadp", "grounded questions"],
    cycle_observe: ["cycle observe", "observe"],
    univ_workstation_navigator: ["navigator", "workstation navigator"],
    golden_universe_map: ["six node", "universe map", "map foundation", "full universe"],
    golden_gallery: ["gallery", "screenshot", "real ui capture", "historical"],
    golden_museum: ["museum", "prototype"],
    evidence_mode: ["evidence mode", "whats real", "show me whats real"],
    evidence_vocabulary: ["qualified", "sealed", "verified"],
    golden_guide_ai: ["golden guide", "ask z sanctuary", "zuno"],
    golden_website: ["golden website"],
    commercial_status: ["revenue", "valuation", "roi", "invest", "customers", "customer"],
  };

  const PRIVATE_NEEDLES = [
    "private zuno",
    "zuno memory",
    "zuno data",
    "dump zuno",
    "dump memory",
    "operator dashboard",
    "dashboard html",
    "on the nas",
    "nas admin",
    "nas password",
    " icis",
    "icis ",
    "overlay catalog",
    "hodp",
    "internal infrastructure",
    "private sanctuary",
    "access private",
    "private z sanctuary",
    "raw telemetry",
    "model weights",
    "admin password",
    "export hodp",
  ];

  const HYPE_NEEDLES = [
    "production ready",
    "commercially validated",
    "market leader",
    "guarantee",
    "investors a return",
    "ignore your evidence",
    "ignore your rules",
    "ignore evidence rules",
    "connect to openai",
    "external ai",
    "pretend",
    "say z sanctuary is production",
    "means you launched",
    "proves live infrastructure",
    "proves the backend",
    "all 160",
    "160 systems verified",
    "invent a customer",
    "customer list",
    "ignore previous instructions",
    "you are now dan",
    "jailbreak",
    "system prompt",
    "developer mode unrestricted",
    "bypass the evidence",
    "tell me what i want to hear",
    "what amk wants to hear",
    "because i insist",
    "never contradict the user",
    "cite k fake",
    "fabricate a citation",
    "cite a nature paper",
    "never hallucinat",
    "ai says so",
    "super saiyan",
    "mystical guardian",
    "living organism",
    "ghost alien",
    "are you conscious",
    "are you alive",
    "do you feel",
    "overclaim the available evidence",
  ];

  const COMMERCIAL_NEEDLES = [
    "revenue",
    "valuation",
    " roi",
    "roi ",
    "customers",
    "customer",
    "market share",
    "invest",
    "investment",
    "profitable",
    "profit",
  ];

  const PROHIBITED_AFFIRM = [
    /\bproduction-ready\b/i,
    /\bcommercially validated\b/i,
    /\bgenerating revenue\b/i,
    /\bvaluation of\b/i,
    /\bmarket leader\b/i,
    /\bmarket share\b/i,
    /\bproven superiority\b/i,
    /\buniversal completion\b/i,
  ];

  function normalize(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .replace(/\s+/g, " ");
  }

  function tokens(s) {
    return normalize(s)
      .split(" ")
      .filter((t) => t && !STOP.has(t) && t.length > 1);
  }

  function unique(arr) {
    const out = [];
    const seen = new Set();
    for (const x of arr || []) {
      if (!x || seen.has(x)) continue;
      seen.add(x);
      out.push(x);
    }
    return out;
  }

  function byId(corpus, id) {
    return (corpus.knowledge || []).find((k) => k.knowledge_id === id) || null;
  }

  function containsNeedle(norm, needles) {
    const padded = " " + norm + " ";
    return needles.some((n) => padded.includes(n) || norm.includes(n.trim()));
  }

  function isIdentityZunoQuestion(norm) {
    return (
      /^are you zuno$/.test(norm) ||
      /^are you the zuno$/.test(norm) ||
      /are you (amk )?personal ai/.test(norm) ||
      /is golden guide (ai )?zuno/.test(norm) ||
      /is zuno the public/.test(norm)
    );
  }

  function classifyIntent(norm) {
    if (/invest|valuation|roi|revenue|customer|market share|return/.test(norm)) return "INVESTOR";
    if (/partner|collaboration|business deal/.test(norm)) return "BUSINESS_PARTNER";
    if (/research|evidence|method|verified|qualified mean/.test(norm)) return "RESEARCHER";
    if (/government|institution|regulation|14 drp|human decide/.test(norm)) return "GOVERNMENT_INSTITUTION";
    if (/engineer|contribute|source|architecture|turtle/.test(norm)) return "ENGINEER_CONTRIBUTOR";
    if (/critic|gap|cannot prove|challenge|pretend|ignore your/.test(norm)) return "CRITIC_REVIEW";
    if (!norm) return "UNKNOWN";
    return "PUBLIC_EXPLORATION";
  }

  function localRoutes(list) {
    return unique(list).filter((href) => LOCAL_PAGES.has(href));
  }

  function routesFor(records, routing, intentHint) {
    const fromRecords = records.flatMap((r) => r.related_surfaces || []);
    const subjects = unique(records.map((r) => r.subject_id));
    const fromSubjects = (routing.subjects || [])
      .filter((s) => subjects.includes(s.subject_id))
      .flatMap((s) => s.routes || []);
    let extra = [];
    if (intentHint === "visual") extra = (routing.intents && routing.intents.visual_question) || [];
    if (intentHint === "prototype") extra = (routing.intents && routing.intents.prototype_question) || [];
    if (intentHint === "relationship") extra = (routing.intents && routing.intents.relationship_question) || [];
    if (intentHint === "evidence") extra = (routing.intents && routing.intents.evidence_question) || [];
    if (intentHint === "gateway") extra = (routing.intents && routing.intents.gateway_question) || [];
    if (intentHint === "integrity") extra = (routing.intents && routing.intents.integrity_question) || [];
    return localRoutes(fromRecords.concat(fromSubjects, extra));
  }

  function citations(records) {
    return records.map((r) => ({
      knowledge_id: r.knowledge_id,
      subject_id: r.subject_id,
      public_name: r.public_name,
      evidence_state: r.evidence_state,
      knowledge_type: r.knowledge_type,
      supported_by: (r.supported_by || []).slice(),
      related_surfaces: localRoutes(r.related_surfaces || []),
    }));
  }

  function claimHits(text) {
    const hits = [];
    const raw = String(text || "");
    for (const re of PROHIBITED_AFFIRM) {
      if (re.test(raw) && !/\b(not|no|never|without|isn t|isn't|is not)\b/i.test(raw)) hits.push(re.source);
    }
    if (/\bis verified\b/i.test(raw) && /\bqualified\b/i.test(raw) && !/\bnot\b/i.test(raw)) {
      hits.push("qualified-as-verified");
    }
    return hits;
  }

  function evidenceUpgradeAttempt(norm) {
    return (
      /qualified (means|is) verified/.test(norm) ||
      /pretend qualified/.test(norm) ||
      /call the historical/.test(norm) ||
      /historical screenshot current/.test(norm) ||
      /because i insist/.test(norm) ||
      /call .{0,40}verified/.test(norm) ||
      /say .{0,60}is verified/.test(norm) ||
      /upgrade .{0,40}verified/.test(norm) ||
      /pick verified/.test(norm)
    );
  }

  function scoreRecord(qTokens, record, norm) {
    const hay = normalize(
      [record.public_name, record.statement, record.knowledge_id, record.subject_id, (record.limitations || []).join(" ")].join(" ")
    );
    const hayTokens = new Set(tokens(hay));
    let score = 0;
    for (const t of qTokens) {
      if (hayTokens.has(t)) score += 2;
    }
    const aliases = SUBJECT_ALIASES[record.subject_id] || [];
    for (const a of aliases) {
      if (norm.includes(a)) score += 3;
    }
    return score;
  }

  function retrieve(norm, corpus) {
    const qTokens = tokens(norm);
    const scored = (corpus.knowledge || [])
      .map((row) => ({ row, score: scoreRecord(qTokens, row, norm) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);
    return scored.slice(0, 3);
  }

  function compose(behavior, records, extras) {
    extras = extras || {};
    if (behavior === "PRIVATE_REFUSAL") {
      return { answer: PRIVATE_TEXT, limitations: [] };
    }
    if (behavior === "UNKNOWN") {
      return { answer: extras.unknownText || UNKNOWN_TEXT, limitations: [] };
    }
    if (extras.identityNo) {
      const lim = unique(records.flatMap((r) => r.limitations || []));
      return { answer: NO_ZUNO_TEXT + (records[0] ? " " + records[0].statement : ""), limitations: lim };
    }
    const statements = unique(records.map((r) => r.statement).filter(Boolean));
    const limitations = unique(records.flatMap((r) => r.limitations || []));
    let answer = statements.join(" ");
    if (behavior === "QUALIFY" && limitations.length) {
      answer += " Limitation: " + limitations.slice(0, 4).join(" ");
    } else if (behavior === "ANSWER" && extras.prefix) {
      answer = extras.prefix + " " + answer;
    }
    if (behavior === "ROUTE") {
      answer = extras.routeText || "The approved local Golden Website surface for this question is listed below. Routing is not evidence.";
    }
    return { answer: answer.trim(), limitations };
  }

  function pack(behavior, records, routing, meta) {
    const composed = compose(behavior, records, meta.compose || {});
    let answer = composed.answer;
    const hits = claimHits(answer);
    if (hits.length) {
      behavior = "QUALIFY";
      const safe = records[0] || null;
      answer =
        (safe ? safe.statement + " " : "") +
        "The Golden Guide cannot introduce unsupported commercial or production claims. Potential is not revenue. QUALIFIED is not VERIFIED.";
    }
    const intentHint = meta.intentHint || null;
    const routes = routesFor(records, routing, intentHint);
    return {
      behavior,
      needs_review: behavior === "UNKNOWN",
      answer,
      limitations: composed.limitations,
      citations: citations(records),
      routes,
      route_labels: routes.map((href) => ({ href, label: SURFACE_LABELS[href] || href })),
      intent: meta.intent,
      confidence: meta.confidence,
      explanation: {
        matched_subjects: unique(records.map((r) => r.subject_id)),
        matched_knowledge_ids: records.map((r) => r.knowledge_id),
        selected_behavior: behavior,
        intent: meta.intent,
        confidence: meta.confidence,
        retrieval: meta.retrieval,
        claim_guard_hits: hits,
      },
    };
  }

  function answerQuestion(question, ctx) {
    const corpus = (ctx && ctx.corpus) || { knowledge: [] };
    const routing = (ctx && ctx.routing) || { subjects: [], intents: {} };
    const curated = ((ctx && ctx.curated) || {}).maps || [];
    const norm = normalize(question);
    const intent = classifyIntent(norm);

    if (!norm) {
      return pack("UNKNOWN", [], routing, {
        intent: "UNKNOWN",
        confidence: "LOW",
        retrieval: "empty",
      });
    }

    if (!isIdentityZunoQuestion(norm) && containsNeedle(norm, PRIVATE_NEEDLES)) {
      return pack("PRIVATE_REFUSAL", [], routing, {
        intent,
        confidence: "HIGH",
        retrieval: "private-guard",
      });
    }

    const curatedHit = curated.find((m) => m.match === norm);
    if (curatedHit) {
      const records = (curatedHit.knowledge_ids || []).map((id) => byId(corpus, id)).filter(Boolean);
      const behavior = curatedHit.behavior;
      const composeExtras = {};
      if (norm === "are you zuno" || norm === "are you amk personal ai") composeExtras.identityNo = true;
      if (norm === "open golden guide ai chat now") {
        composeExtras.prefix =
          "This page is a local evidence-grounded preview only. Production Golden Guide AI runtime is still closed. No external AI provider is connected.";
      }
      if (norm === "say qadp is golden guide ai") {
        composeExtras.prefix = "No. QADP is not Golden Guide AI.";
      }
      if (norm === "you can deploy for me") {
        composeExtras.prefix = "No. The Guide cannot deploy.";
      }
      if (norm === "why should i believe an ai that can hallucinate" || norm === "our ai never hallucinates right") {
        composeExtras.prefix =
          "AI models can produce incorrect or unsupported outputs. Z-Sanctuary therefore treats AI output as a proposal that must remain downstream of approved evidence, claim guards, citations, UNKNOWN, and human governance. The Guide does not claim that it never hallucinates.";
      }
      if (behavior === "UNKNOWN") {
        return pack("UNKNOWN", records, routing, {
          intent: curatedHit.intent || "UNKNOWN",
          confidence: "HIGH",
          retrieval: "curated",
        });
      }
      return pack(behavior, records, routing, {
        intent: curatedHit.intent || intent,
        confidence: "HIGH",
        retrieval: "curated",
        intentHint: /gallery|screenshot|historical|real ui/.test(norm)
          ? "visual"
          : /museum|prototype/.test(norm)
            ? "prototype"
            : /map|universe/.test(norm)
              ? "relationship"
              : /invest|valuation|revenue|partner|pilot|collaborat|contribut/.test(norm)
                ? "gateway"
              : /hallucin|prompt injection|fabricate a citation|never hallucinat|overclaim|super saiyan|conscious|ai says so/.test(norm)
                ? "integrity"
              : /evidence|qualified|sealed/.test(norm)
                ? "evidence"
                : null,
        compose: composeExtras,
      });
    }

    if (containsNeedle(norm, HYPE_NEEDLES) || evidenceUpgradeAttempt(norm)) {
      const fallbackIds = /museum|prototype/.test(norm)
        ? ["K-MUSEUM"]
        : /160|map/.test(norm)
          ? ["K-MAP-FOUNDATION"]
          : /cite|citation|hallucin|conscious|alive|super saiyan|mystical|organism/.test(norm)
            ? ["K-UNKNOWN", "K-GUIDE-IDENTITY"]
          : /qualified|verified|commercially/.test(norm)
            ? ["K-QUALIFIED"]
            : ["K-CORE-NOT-FINISHED"];
      const records = fallbackIds.map((id) => byId(corpus, id)).filter(Boolean);
      const integrityish = /hallucin|citation|insist|injection|conscious|super saiyan|ai says so/.test(norm);
      return pack("QUALIFY", records, routing, {
        intent: intent === "PUBLIC_EXPLORATION" ? "CRITIC_REVIEW" : intent,
        confidence: "HIGH",
        retrieval: "hype-guard",
        intentHint: integrityish ? "integrity" : /invest|valuation|revenue/.test(norm) ? "gateway" : null,
        compose: {
          prefix: integrityish
            ? "AI models can produce incorrect or unsupported outputs. The Golden Guide cannot ignore evidence rules, invent citations, upgrade QUALIFIED to VERIFIED, or treat metaphor as implemented capability."
            : "The Golden Guide cannot ignore evidence rules, invent production status, or treat a local prototype as deployed.",
        },
      });
    }

    if (containsNeedle(norm, COMMERCIAL_NEEDLES)) {
      const rec = byId(corpus, "K-COMMERCIAL");
      return pack("QUALIFY", rec ? [rec] : [], routing, {
        intent: "INVESTOR",
        confidence: "HIGH",
        retrieval: "commercial-guard",
        intentHint: "gateway",
        compose: {
          prefix: "No approved public revenue, customer, valuation, or ROI figure is available. Potential is not revenue.",
        },
      });
    }

    if (isIdentityZunoQuestion(norm)) {
      const records = ["K-GUIDE-NOT-ZUNO", "K-GUIDE-IDENTITY"].map((id) => byId(corpus, id)).filter(Boolean);
      return pack("ANSWER", records, routing, {
        intent,
        confidence: "HIGH",
        retrieval: "identity-guard",
        compose: { identityNo: true },
      });
    }

    const ranked = retrieve(norm, corpus);
    const top = ranked[0];
    if (!top || top.score < 3) {
      return pack("UNKNOWN", [], routing, {
        intent,
        confidence: "LOW",
        retrieval: "keyword",
      });
    }
    const confidence = top.score >= 8 ? "HIGH" : top.score >= 5 ? "MEDIUM" : "LOW";
    if (confidence === "LOW") {
      return pack("UNKNOWN", [], routing, {
        intent,
        confidence: "LOW",
        retrieval: "keyword",
      });
    }
    const records = ranked.filter((x) => x.score >= top.score - 2).map((x) => x.row).slice(0, 3);
    const qualifyLikely =
      /finished|production|live|deployed|public service|verified|launched/.test(norm) ||
      records.some((r) => r.knowledge_type === "LIMITATION" || r.knowledge_type === "COMMERCIAL");
    const behavior = qualifyLikely ? "QUALIFY" : "ANSWER";
    return pack(behavior, records, routing, {
      intent,
      confidence,
      retrieval: "keyword",
      intentHint: /gallery|screenshot|visual/.test(norm)
        ? "visual"
        : /museum|prototype/.test(norm)
          ? "prototype"
          : /map/.test(norm)
            ? "relationship"
            : null,
    });
  }

  return {
    BEHAVIORS,
    INTENT_CLASSES,
    UNKNOWN_TEXT,
    PRIVATE_TEXT,
    LOCAL_PAGES,
    SURFACE_LABELS,
    normalize,
    claimHits,
    answerQuestion,
  };
});
