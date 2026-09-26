(function () {
  const data = window.GW12_INTEGRITY;
  if (!data || !data.content) return;
  const c = data.content;

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function text(id, value) {
    const el = document.getElementById(id);
    if (el && value) el.textContent = value;
  }

  function list(id, items) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = (items || [])
      .map(function (x) {
        return "<li>" + escapeHtml(typeof x === "string" ? x : x.meaning || "") + "</li>";
      })
      .join("");
  }

  text("gw-int-title", c.title);
  text("gw-int-sub", c.subtitle);
  text("gw-int-opening", c.opening);
  text("gw-int-credible", c.credible_answer);
  text("gw-int-metaphor", c.metaphor_law);
  text("gw-int-self", c.self_criticism_law);
  list("gw-int-failures", c.failure_facts);
  list("gw-int-proving", c.what_still_needs_proving);

  const stack = document.getElementById("gw-int-stack");
  if (stack) {
    stack.innerHTML = (c.defense_stack || [])
      .map(function (x) {
        return "<li>" + escapeHtml(x) + "</li>";
      })
      .join("");
  }

  const classes = document.getElementById("gw-int-classes");
  if (classes) {
    classes.innerHTML = (c.challenge_classes || [])
      .map(function (row) {
        return (
          '<article class="glass"><h3>' +
          escapeHtml(row.id.replace(/_/g, " ")) +
          "</h3><p>" +
          escapeHtml(row.meaning) +
          "</p></article>"
        );
      })
      .join("");
  }

  const qa = document.getElementById("gw-int-qa");
  if (qa) {
    qa.innerHTML = (c.qa || [])
      .map(function (row) {
        return "<article class=\"glass\"><h3>" + escapeHtml(row.q) + "</h3><p>" + escapeHtml(row.a) + "</p></article>";
      })
      .join("");
  }
})();
