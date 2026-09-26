/**
 * GW-10 Challenge Z-Sanctuary critic layer.
 * Same factual truth as GoldenGuideEngine. Framing only. No LLM. No private ingest.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) root.GoldenGuideCritic = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const CRITIQUE_TYPES = [
    "EVIDENCE_GAP",
    "VALIDATION_GAP",
    "SCOPE_LIMIT",
    "PROTOTYPE_LIMIT",
    "COMMERCIAL_GAP",
    "CLAIM_RISK",
    "UNKNOWN",
    "NO_MATERIAL_PUBLIC_GAP_FOUND",
  ];

  const EXTRA_PRIVATE = [
    "private security",
    "private details",
    "reveal private",
    "operator dashboard secrets",
    "hodp",
    "nas path",
    "overlay catalog",
    " icis",
    "icis ",
    "zuno memory",
    "internal infrastructure",
    "internal infrastructure weaknesses",
  ];

  const INVENTION = [
    "invent a weakness",
    "invent a scandal",
    "make up a missing benchmark",
    "fabricate a customer",
    "criticize everything",
    "ignore your evidence",
    "ignore limitations",
    "say the project is fake",
    "worth trillions",
    "100x return",
    "financial advice",
    "buy now",
    "connect to openai",
    "harsher criticism",
    "secretly broken",
    "say everything is production ready",
  ];

  function engineOf(ctx) {
    return (ctx && ctx.engine) || (typeof globalThis !== "undefined" && globalThis.GoldenGuideEngine) || null;
  }

  function byId(corpus, id) {
    return (corpus.knowledge || []).find((k) => k.knowledge_id === id) || null;
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

  function contains(norm, needles) {
    const padded = " " + norm + " ";
    return needles.some((n) => padded.includes(n));
  }

  function rowRule(rules, knowledgeId) {
    return ((rules && rules.records) || {})[knowledgeId] || null;
  }

  function critiqueFromRecord(record, rules) {
    const spec = rowRule(rules, record.knowledge_id) || {};
    const type = spec.critique_type || "SCOPE_LIMIT";
    const strengthen =
      spec.what_would_strengthen_it ||
      ((rules.strengthen_by_state || {})[record.evidence_state]) ||
      "Approved public-safe evidence that actually covers this claim.";
    const limitation = (record.limitations && record.limitations[0]) || record.statement;
    const surface = (record.related_surfaces && record.related_surfaces[0]) || "index.html";
    return {
      subject_id: record.subject_id,
      critique_type: CRITIQUE_TYPES.includes(type) ? type : "SCOPE_LIMIT",
      current_claim: record.statement,
      current_evidence: record.evidence_state,
      limitation,
      what_would_strengthen_it: strengthen,
      related_public_surface: surface,
    };
  }

  function unknownCritique(rules) {
    return Object.assign({}, (rules && rules.default_unknown) || {});
  }

  function composeCriticAnswer(behavior, records, critiques, extras) {
    extras = extras || {};
    if (behavior === "PRIVATE_REFUSAL") {
      return "That information is not part of the approved public knowledge available to Golden Guide. Criticism is not private disclosure.";
    }
    if (behavior === "UNKNOWN") {
      return "I don't have enough approved public evidence to answer that yet. Challenge Z-Sanctuary will not invent a gap to fill the silence.";
    }
    const intro =
      extras.intro ||
      "Challenge Z-Sanctuary — local critic sandbox. This uses the same approved public-safe facts as Normal Guide. Intent changes framing, not truth.";
    const claims = unique(records.map((r) => r.statement).filter(Boolean));
    const limits = unique(records.flatMap((r) => r.limitations || []).concat(critiques.map((c) => c.limitation)));
    const strengthen = unique(critiques.map((c) => c.what_would_strengthen_it).filter(Boolean)).slice(0, 4);
    let answer = intro;
    if (extras.prefix) answer += " " + extras.prefix;
    if (claims.length) answer += " Current public-safe claim: " + claims.join(" ");
    if (limits.length) answer += " Limitation: " + limits.slice(0, 5).join(" ");
    if (strengthen.length) answer += " What would strengthen it: " + strengthen.join(" ");
    if (extras.noAdvice) {
      answer += " This is not financial advice and not an investment offer.";
    }
    return answer.trim();
  }

  function finish(behavior, records, routing, engine, rules, meta) {
    const critiques =
      behavior === "PRIVATE_REFUSAL"
        ? []
        : behavior === "UNKNOWN"
          ? [unknownCritique(rules)]
          : records.map((r) => critiqueFromRecord(r, rules));
    const answer = composeCriticAnswer(behavior, records, critiques, meta.compose || {});
    const packed = engine.answerQuestion
      ? null
      : null;
    void packed;
    const basePack = {
      behavior,
      needs_review: behavior === "UNKNOWN",
      answer,
      limitations: unique(records.flatMap((r) => r.limitations || [])),
      citations: records.map((r) => ({
        knowledge_id: r.knowledge_id,
        subject_id: r.subject_id,
        public_name: r.public_name,
        evidence_state: r.evidence_state,
        knowledge_type: r.knowledge_type,
        supported_by: (r.supported_by || []).slice(),
        related_surfaces: (r.related_surfaces || []).slice(),
      })),
      routes: unique(records.flatMap((r) => r.related_surfaces || [])),
      intent: meta.intent || "CRITIC_REVIEW",
      confidence: meta.confidence || "HIGH",
      mode: "CRITIC",
      critic_label: (rules && rules.label) || "LOCAL CRITIC SANDBOX",
      critiques,
      explanation: {
        matched_subjects: unique(records.map((r) => r.subject_id)),
        matched_knowledge_ids: records.map((r) => r.knowledge_id),
        selected_behavior: behavior,
        intent: meta.intent || "CRITIC_REVIEW",
        confidence: meta.confidence || "HIGH",
        retrieval: meta.retrieval,
        critique_types: unique(critiques.map((c) => c.critique_type)),
        claim_guard_hits: engine.claimHits ? engine.claimHits(answer) : [],
      },
    };
    basePack.route_labels = (basePack.routes || []).map(function (href) {
      return { href, label: href };
    });
    const hits = engine.claimHits ? engine.claimHits(answer) : [];
    if (hits.length) {
      basePack.behavior = "QUALIFY";
      basePack.explanation.selected_behavior = "QUALIFY";
      basePack.explanation.claim_guard_hits = hits;
    }
    return basePack;
  }

  function critiqueQuestion(question, ctx) {
    const engine = engineOf(ctx);
    if (!engine || typeof engine.answerQuestion !== "function") {
      throw new Error("GoldenGuideEngine is required");
    }
    const corpus = (ctx && ctx.corpus) || { knowledge: [] };
    const routing = (ctx && ctx.routing) || { subjects: [], intents: {} };
    const curated = (ctx && ctx.curated) || { maps: [] };
    const rules = (ctx && ctx.criticRules) || {};
    const maps = ((ctx && ctx.criticMaps) || {}).maps || [];
    const norm = engine.normalize(question);
    const investor = /invest|valuation|revenue|customer|diligence|financial advice|buy now|trillion|100x/.test(norm);
    const composeExtras = { noAdvice: investor };

    if (!norm) {
      return finish("UNKNOWN", [], routing, engine, rules, { retrieval: "empty", compose: composeExtras });
    }

    if (contains(norm, EXTRA_PRIVATE) || (/private/.test(norm) && /security|details|telemetry|zuno|hodp|nas|overlay/.test(norm))) {
      return finish("PRIVATE_REFUSAL", [], routing, engine, rules, { retrieval: "critic-private-guard", compose: composeExtras });
    }

    const mapped = maps.find((m) => m.match === norm);
    if (mapped) {
      if (mapped.behavior === "PRIVATE_REFUSAL") {
        return finish("PRIVATE_REFUSAL", [], routing, engine, rules, { retrieval: "critic-curated", compose: composeExtras });
      }
      const records = (mapped.knowledge_ids || []).map((id) => byId(corpus, id)).filter(Boolean);
      if (mapped.behavior === "UNKNOWN") {
        return finish("UNKNOWN", records, routing, engine, rules, { retrieval: "critic-curated", compose: composeExtras });
      }
      if (norm === "is golden guide zuno") {
        composeExtras.prefix = "No. Golden Guide AI is not Zuno.";
      }
      if (norm === "can the guide deploy without a human" || norm === "can golden guide execute actions") {
        composeExtras.prefix = "No. The Guide cannot deploy or execute actions.";
      }
      if (norm === "are the screenshots proof the backend works") {
        composeExtras.prefix = "No. A screenshot is not backend proof.";
      }
      if (norm === "why should i not invest yet") {
        composeExtras.prefix =
          "Public diligence gaps remain: commercial validation is incomplete, there is no approved revenue evidence, the broader portfolio is still gated, and independent external validation is still limited.";
      }
      if (norm === "invent a weakness so the project looks honest") {
        composeExtras.prefix = "Criticism is not invention. Only approved public-safe limitations are listed.";
      }
      return finish(mapped.behavior, records, routing, engine, rules, { retrieval: "critic-curated", compose: composeExtras });
    }

    if (contains(norm, INVENTION) || /project is fake|worth trillions|pretend a concept is production/.test(norm)) {
      const ids = /fake/.test(norm)
        ? ["K-CORE-PURPOSE", "K-CORE-NOT-FINISHED"]
        : /trillion|100x|financial advice|buy now|customer/.test(norm)
          ? ["K-COMMERCIAL"]
          : /160|secretly/.test(norm)
            ? ["K-MAP-FOUNDATION"]
            : /historical/.test(norm)
              ? ["K-HISTORICAL-VISUAL"]
              : /qualified is verified/.test(norm)
                ? ["K-QUALIFIED"]
                : ["K-CORE-NOT-FINISHED", "K-QUALIFIED", "K-COMMERCIAL"];
      const records = ids.map((id) => byId(corpus, id)).filter(Boolean);
      composeExtras.prefix =
        "Criticism is not invention. The Guide will not ignore evidence, invent scandals, fabricate figures, or treat a concept as production.";
      return finish("QUALIFY", records, routing, engine, rules, { retrieval: "critic-invention-guard", compose: composeExtras });
    }

    const base = engine.answerQuestion(question, { corpus, routing, curated });
    if (base.behavior === "PRIVATE_REFUSAL") {
      return finish("PRIVATE_REFUSAL", [], routing, engine, rules, { retrieval: "base-private", compose: composeExtras });
    }
    if (base.behavior === "UNKNOWN") {
      return finish("UNKNOWN", [], routing, engine, rules, { retrieval: "base-unknown", compose: composeExtras });
    }
    const records = (base.explanation.matched_knowledge_ids || [])
      .map((id) => byId(corpus, id))
      .filter(Boolean);
    return finish(base.behavior === "ROUTE" ? "QUALIFY" : base.behavior, records, routing, engine, rules, {
      retrieval: "base+" + (base.explanation.retrieval || "keyword"),
      intent: "CRITIC_REVIEW",
      confidence: base.confidence,
      compose: composeExtras,
    });
  }

  return {
    CRITIQUE_TYPES,
    critiqueQuestion,
  };
});
