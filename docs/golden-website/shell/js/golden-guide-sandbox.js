(function () {
  const payload = window.GW9_SANDBOX;
  const criticPayload = window.GW10_CRITIC;
  const integrityPayload = window.GW12_INTEGRITY;
  const engine = window.GoldenGuideEngine;
  const critic = window.GoldenGuideCritic;
  const integrity = window.GoldenGuideIntegrity;
  const form = document.getElementById("gw-guide-form");
  const input = document.getElementById("gw-guide-question");
  const resultBox = document.getElementById("gw-guide-result");
  const live = document.getElementById("gw-guide-live");
  const modeNormal = document.getElementById("gw-mode-normal");
  const modeCritic = document.getElementById("gw-mode-critic");
  const modeIntegrity = document.getElementById("gw-mode-integrity");
  const criticBanner = document.getElementById("gw-critic-banner");
  const integrityBanner = document.getElementById("gw-integrity-banner");
  if (!payload || !engine || !form || !input) return;

  const MODES = ["normal", "critic", "integrity"];
  let mode = "normal";

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setMode(next) {
    mode = MODES.indexOf(next) >= 0 ? next : "normal";
    if (modeNormal) modeNormal.setAttribute("aria-checked", mode === "normal" ? "true" : "false");
    if (modeCritic) modeCritic.setAttribute("aria-checked", mode === "critic" ? "true" : "false");
    if (modeIntegrity) modeIntegrity.setAttribute("aria-checked", mode === "integrity" ? "true" : "false");
    if (criticBanner) criticBanner.hidden = mode !== "critic";
    if (integrityBanner) integrityBanner.hidden = mode !== "integrity";
    document.body.classList.toggle("critic-mode", mode === "critic");
    document.body.classList.toggle("integrity-mode", mode === "integrity");
    if (live) {
      live.textContent =
        mode === "critic"
          ? "Challenge Z-Sanctuary is on. Local critic sandbox. Same public-safe facts as Normal Guide."
          : mode === "integrity"
            ? "Challenge the AI is on. Local integrity sandbox. AI can be wrong. Same 22 approved records."
            : "Normal Guide is on. Local evidence-grounded preview.";
    }
  }

  function renderCritiques(list) {
    const mount = document.getElementById("gw-guide-critiques");
    if (!mount) return;
    if (mode !== "critic" || !list || !list.length) {
      if (mode !== "integrity") mount.innerHTML = "";
      return;
    }
    mount.innerHTML =
      "<h3>Structured critique</h3>" +
      list
        .map(function (c) {
          return (
            "<article class=\"glass\"><p class=\"notice\">" +
            escapeHtml(c.critique_type) +
            " · " +
            escapeHtml(c.subject_id) +
            "</p><dl class=\"truth-panel\">" +
            "<div><dt>Current claim</dt><dd>" +
            escapeHtml(c.current_claim) +
            "</dd></div>" +
            "<div><dt>Current evidence</dt><dd>" +
            escapeHtml(c.current_evidence) +
            "</dd></div>" +
            "<div><dt>Limitation</dt><dd>" +
            escapeHtml(c.limitation) +
            "</dd></div>" +
            "<div><dt>What would strengthen it</dt><dd>" +
            escapeHtml(c.what_would_strengthen_it) +
            "</dd></div>" +
            "<div><dt>Related surface</dt><dd><a href=\"" +
            escapeHtml(c.related_public_surface) +
            "\">" +
            escapeHtml(c.related_public_surface) +
            "</a></dd></div>" +
            "</dl></article>"
          );
        })
        .join("");
  }

  function renderIntegrity(list) {
    const mount = document.getElementById("gw-guide-critiques");
    if (!mount) return;
    if (mode !== "integrity" || !list || !list.length) {
      if (mode !== "critic") mount.innerHTML = "";
      return;
    }
    mount.innerHTML =
      "<h3>Integrity finding</h3>" +
      list
        .map(function (c) {
          return (
            "<article class=\"glass\"><p class=\"notice\">" +
            escapeHtml(c.integrity_type) +
            "</p><dl class=\"truth-panel\">" +
            "<div><dt>Defense used</dt><dd>" +
            escapeHtml(c.defense_used) +
            "</dd></div>" +
            "<div><dt>Limitation</dt><dd>" +
            escapeHtml(c.limitation) +
            "</dd></div>" +
            "</dl></article>"
          );
        })
        .join("");
  }

  function render(result) {
    resultBox.hidden = false;
    const modeLabel =
      result.mode === "CRITIC"
        ? " · LOCAL CRITIC SANDBOX"
        : result.mode === "INTEGRITY"
          ? " · LOCAL AI INTEGRITY SANDBOX"
          : "";
    document.getElementById("gw-guide-behavior").textContent =
      "Behavior: " +
      result.behavior +
      (result.needs_review ? " · NEEDS_REVIEW" : "") +
      " · confidence " +
      result.confidence +
      modeLabel;
    document.getElementById("gw-guide-answer").innerHTML = "<p>" + escapeHtml(result.answer) + "</p>";
    const limits = result.limitations || [];
    document.getElementById("gw-guide-limits").innerHTML = limits.length
      ? "<h3>Limitations</h3><ul>" + limits.map(function (x) { return "<li>" + escapeHtml(x) + "</li>"; }).join("") + "</ul>"
      : "";
    const cites = result.citations || [];
    document.getElementById("gw-guide-citations").innerHTML = cites.length
      ? "<h3>Approved references</h3><ul>" +
        cites
          .map(function (c) {
            return (
              "<li><code>" +
              escapeHtml(c.knowledge_id) +
              "</code> · " +
              escapeHtml(c.public_name) +
              " · evidence " +
              escapeHtml(c.evidence_state) +
              "</li>"
            );
          })
          .join("") +
        "</ul>"
      : "";
    const routes = result.route_labels || [];
    document.getElementById("gw-guide-routes").innerHTML = routes.length
      ? "<h3>Related local surfaces</h3><p class=\"notice\">Routing is not evidence.</p><p class=\"ctas\">" +
        routes
          .map(function (r) {
            return '<a class="cta secondary" href="' + escapeHtml(r.href) + '">' + escapeHtml(r.label) + "</a>";
          })
          .join("") +
        "</p>"
      : "";
    if (mode === "integrity") renderIntegrity(result.integrity_findings);
    else renderCritiques(result.critiques);
    const why = result.explanation || {};
    document.getElementById("gw-guide-why-body").innerHTML =
      "<ul>" +
      "<li>Intent class: " + escapeHtml(why.intent) + "</li>" +
      "<li>Retrieval: " + escapeHtml(why.retrieval) + "</li>" +
      "<li>Matched subjects: " + escapeHtml((why.matched_subjects || []).join(", ") || "none") + "</li>" +
      "<li>Matched knowledge IDs: " + escapeHtml((why.matched_knowledge_ids || []).join(", ") || "none") + "</li>" +
      "<li>Selected behavior: " + escapeHtml(why.selected_behavior) + "</li>" +
      "<li>Confidence: " + escapeHtml(why.confidence) + "</li>" +
      "</ul><p class=\"notice\">Simple explanation metadata only. Not private data. Not chain-of-thought.</p>";
    live.textContent =
      (result.mode === "CRITIC"
        ? "Challenge Z-Sanctuary answered with "
        : result.mode === "INTEGRITY"
          ? "Challenge the AI answered with "
          : "Golden Guide answered with ") +
      result.behavior +
      ". " +
      result.answer;
    resultBox.scrollIntoView({ block: "start" });
  }

  function ask() {
    const question = String(input.value || "").trim();
    if (!question) {
      live.textContent = "Enter a question first.";
      input.focus();
      return;
    }
    const ctx = {
      corpus: payload.corpus,
      routing: payload.routing,
      curated: payload.curated,
    };
    let result;
    if (mode === "critic" && critic && criticPayload) {
      result = critic.critiqueQuestion(question, {
        corpus: payload.corpus,
        routing: payload.routing,
        curated: payload.curated,
        criticRules: criticPayload.rules,
        criticMaps: criticPayload.maps,
        engine: engine,
      });
    } else if (mode === "integrity" && integrity && integrityPayload) {
      result = integrity.integrityQuestion(question, {
        corpus: payload.corpus,
        routing: payload.routing,
        curated: payload.curated,
        integrityRules: integrityPayload.rules,
        integrityMaps: integrityPayload.maps,
        engine: engine,
      });
    } else {
      result = engine.answerQuestion(question, ctx);
    }
    render(result);
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    ask();
  });

  input.addEventListener("keydown", function (ev) {
    if ((ev.ctrlKey || ev.metaKey) && ev.key === "Enter") {
      ev.preventDefault();
      ask();
    }
  });

  function focusMode() {
    const el = mode === "critic" ? modeCritic : mode === "integrity" ? modeIntegrity : modeNormal;
    if (el) el.focus();
  }

  if (modeNormal) {
    modeNormal.addEventListener("click", function () {
      setMode("normal");
      modeNormal.focus();
    });
  }
  if (modeCritic) {
    modeCritic.addEventListener("click", function () {
      setMode("critic");
      modeCritic.focus();
    });
  }
  if (modeIntegrity) {
    modeIntegrity.addEventListener("click", function () {
      setMode("integrity");
      modeIntegrity.focus();
    });
  }
  const group = document.querySelector(".guide-mode");
  if (group) {
    group.addEventListener("keydown", function (ev) {
      if (ev.key !== "ArrowRight" && ev.key !== "ArrowLeft" && ev.key !== "ArrowUp" && ev.key !== "ArrowDown") return;
      ev.preventDefault();
      const i = MODES.indexOf(mode);
      const delta = ev.key === "ArrowRight" || ev.key === "ArrowDown" ? 1 : -1;
      setMode(MODES[(i + delta + MODES.length) % MODES.length]);
      focusMode();
    });
  }

  setMode("normal");
})();
