(function () {
  const data = window.GW11_GATEWAY;
  if (!data || !data.content) return;

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function list(id, items) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = (items || []).map(function (x) {
      return "<li>" + escapeHtml(typeof x === "string" ? x : x.meaning || x.summary || "") + "</li>";
    }).join("");
  }

  function text(id, value) {
    const el = document.getElementById(id);
    if (el && value) el.textContent = value;
  }

  const c = data.content;
  const qa = data.qa || { investor_qa: [], partner_qa: [] };
  text("gw-gateway-title", c.title);
  text("gw-gateway-sub", c.subtitle);
  text("gw-gateway-opening", c.opening);
  text("gw-gateway-ladder-note", c.readiness_ladder_note);
  text("gw-gateway-capital-note", c.capital_use_note);
  text("gw-gateway-roles-note", c.public_value_note);
  text("gw-gateway-diligence-note", c.diligence_note);

  const paths = document.getElementById("gw-gateway-pathways");
  if (paths) {
    paths.innerHTML = (c.pathways || [])
      .map(function (p) {
        return (
          '<article class="glass"><h3>' +
          escapeHtml(p.name) +
          "</h3><p>" +
          escapeHtml(p.summary) +
          "</p></article>"
        );
      })
      .join("");
  }

  list("gw-gateway-notices", c.notices);
  const ladder = document.getElementById("gw-gateway-ladder");
  if (ladder) {
    ladder.innerHTML = (c.readiness_ladder || []).map(function (x) {
      return "<li>" + escapeHtml(x) + "</li>";
    }).join("");
  }
  list("gw-gateway-proving", c.what_still_needs_proving);
  list("gw-gateway-capital", c.capital_use_categories);
  list("gw-gateway-ai", c.ai_builder_strong);
  list("gw-gateway-human", c.human_validation_important);

  const partners = document.getElementById("gw-gateway-partners");
  if (partners) {
    partners.innerHTML = (c.partner_classes || [])
      .map(function (p) {
        return (
          "<article class=\"glass\"><h3>" +
          escapeHtml(p.id) +
          "</h3><ul><li>Why: " +
          escapeHtml(p.why) +
          "</li><li>Public evidence: " +
          escapeHtml(p.public_evidence) +
          "</li><li>Additional review: " +
          escapeHtml(p.additional_review) +
          "</li><li>Not promised: " +
          escapeHtml(p.not_promised) +
          "</li></ul></article>"
        );
      })
      .join("");
  }

  const roles = document.getElementById("gw-gateway-roles");
  if (roles) {
    roles.innerHTML = (c.public_value_roles || [])
      .map(function (r) {
        return (
          "<article class=\"glass\"><h3>" +
          escapeHtml(r.id.replace(/_/g, " ")) +
          "</h3><p>" +
          escapeHtml(r.meaning) +
          "</p></article>"
        );
      })
      .join("");
  }

  const dil = document.getElementById("gw-gateway-diligence");
  if (dil) {
    dil.innerHTML = (c.diligence_flow || []).map(function (x) {
      return "<li>" + escapeHtml(x) + "</li>";
    }).join("");
  }

  function renderQa(id, rows) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = (rows || [])
      .map(function (row) {
        return "<article class=\"glass\"><h3>" + escapeHtml(row.q) + "</h3><p>" + escapeHtml(row.a) + "</p></article>";
      })
      .join("");
  }
  renderQa("gw-gateway-iqa", qa.investor_qa);
  renderQa("gw-gateway-pqa", qa.partner_qa);
})();
