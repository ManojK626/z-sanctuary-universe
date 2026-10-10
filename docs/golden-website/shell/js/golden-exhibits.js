(function () {
  const data = window.GW_EXHIBITS;
  if (!data || !Array.isArray(data.visuals)) return;

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const grid = document.getElementById("gw-gallery");
  const dialog = document.getElementById("gw-gallery-dialog");
  const dialogBody = document.getElementById("gw-gallery-dialog-body");
  const closeBtn = document.getElementById("gw-gallery-close");
  const protoMount = document.getElementById("gw-museum-exhibit");
  if (!grid && !protoMount) return;

  const pages = data.record_pages || {};

  function recordLinks(ids) {
    return (ids || [])
      .map(function (id) {
        const p = pages[id];
        if (!p) return escapeHtml(id);
        return '<a href="' + escapeHtml(p.href) + '">' + escapeHtml(p.name) + "</a>";
      })
      .join(", ");
  }

  if (grid) {
    grid.innerHTML = data.visuals
      .map(function (v) {
        const historical = v.time_posture === "historical";
        const related = (v.related_links || [])
          .map(function (l) {
            return '<a class="cta secondary" href="' + escapeHtml(l.href) + '">' + escapeHtml(l.label) + "</a>";
          })
          .join(" ");
        return (
          '<article class="gallery-card' +
          (historical ? " gallery-card--historical" : "") +
          '" id="' +
          escapeHtml(v.id) +
          '"><p class="notice">' +
          escapeHtml(v.truth_label) +
          (historical ? " · historical" : " · current") +
          "</p><h3>" +
          escapeHtml(v.title) +
          "</h3><p class=\"notice\">Related: " +
          recordLinks(v.related_records) +
          (v.evidence_state ? " · Evidence: " + escapeHtml(v.evidence_state) : "") +
          "</p><button type=\"button\" class=\"gallery-open\" data-id=\"" +
          escapeHtml(v.id) +
          '" aria-haspopup="dialog" aria-controls="gw-gallery-dialog"><img src="' +
          escapeHtml(v.src) +
          '" alt="' +
          escapeHtml(v.alt) +
          '" width="640" height="400"></button><p>' +
          escapeHtml(v.explanation) +
          "</p><p><strong>Demonstrates:</strong> " +
          escapeHtml(v.demonstrates) +
          "</p><p><strong>Does not prove:</strong> " +
          escapeHtml(v.does_not_prove) +
          "</p><p class=\"notice\">Scope: " +
          escapeHtml(v.scope) +
          '</p><p class="ctas">' +
          related +
          "</p></article>"
        );
      })
      .join("");
  }

  function exhibitById(id) {
    return data.visuals.find(function (v) {
      return v.id === id;
    });
  }

  function closeDialog() {
    if (!dialog) return;
    dialog.hidden = true;
    dialog.setAttribute("aria-hidden", "true");
    const restore = dialog.dataset.restoreId;
    const btn = grid && grid.querySelector('.gallery-open[data-id="' + restore + '"]');
    if (btn) btn.focus();
  }

  function openDialog(id) {
    const v = exhibitById(id);
    if (!v || !dialog || !dialogBody) return;
    dialogBody.innerHTML =
      "<h3 id=\"gw-gallery-dialog-title\">" +
      escapeHtml(v.title) +
      "</h3><p class=\"notice\">" +
      escapeHtml(v.truth_label) +
      "</p><img src=\"" +
      escapeHtml(v.src) +
      '" alt="' +
      escapeHtml(v.alt) +
      '"><p>' +
      escapeHtml(v.explanation) +
      "</p><p><strong>Does not prove:</strong> " +
      escapeHtml(v.does_not_prove) +
      "</p>";
    dialog.hidden = false;
    dialog.setAttribute("aria-hidden", "false");
    dialog.dataset.restoreId = id;
    dialog.setAttribute("tabindex", "-1");
    dialog.focus();
  }

  if (grid) {
    grid.addEventListener("click", function (ev) {
      const btn = ev.target.closest(".gallery-open");
      if (!btn) return;
      openDialog(btn.getAttribute("data-id"));
    });
    grid.addEventListener("keydown", function (ev) {
      const btn = ev.target.closest(".gallery-open");
      if (!btn) return;
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        openDialog(btn.getAttribute("data-id"));
      }
    });
  }

  function focusables() {
    if (!dialog) return [];
    return Array.from(dialog.querySelectorAll("a[href], button:not([disabled])"));
  }

  document.addEventListener("keydown", function (ev) {
    if (!dialog || dialog.hidden) return;
    if (ev.key === "Escape") {
      ev.preventDefault();
      closeDialog();
      return;
    }
    if (ev.key !== "Tab") return;
    const items = focusables();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (ev.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
      ev.preventDefault();
      last.focus();
    } else if (!ev.shiftKey && document.activeElement === last) {
      ev.preventDefault();
      first.focus();
    }
  });

  if (closeBtn) closeBtn.addEventListener("click", closeDialog);

  if (protoMount && data.prototypes && data.prototypes[0]) {
    const p = data.prototypes[0];
    const links = (p.interact_links || [])
      .map(function (l) {
        return '<a class="cta" href="' + escapeHtml(l.href) + '">' + escapeHtml(l.label) + "</a>";
      })
      .join(" ");
    protoMount.innerHTML =
      "<h2>" +
      escapeHtml(p.title) +
      '</h2><dl class="truth-panel"><div><dt>TYPE</dt><dd>' +
      escapeHtml(p.type) +
      "</dd></div><div><dt>PUBLIC SERVICE</dt><dd>" +
      escapeHtml(p.public_service) +
      "</dd></div><div><dt>PRODUCTION</dt><dd>" +
      escapeHtml(p.production) +
      "</dd></div><div><dt>DEPLOYED</dt><dd>" +
      escapeHtml(p.deployed) +
      "</dd></div><div><dt>PUBLICATION</dt><dd>" +
      escapeHtml(p.publication) +
      "</dd></div><div><dt>DATA</dt><dd>" +
      escapeHtml(p.data) +
      "</dd></div><div><dt>TWIN LIVE RECORDS</dt><dd>" +
      escapeHtml(String(p.twin_live_records)) +
      "</dd></div></dl><p>" +
      escapeHtml(p.explanation) +
      '</p><p class="notice">Related approved records: ' +
      recordLinks(p.related_records) +
      '</p><p class="notice">Interact by opening the existing local shell. This page does not iframe the application.</p><p class="ctas">' +
      links +
      "</p>";
  }
})();
