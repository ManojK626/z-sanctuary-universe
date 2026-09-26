(function () {
  const map = window.GW_MAP;
  if (!map || !Array.isArray(map.nodes)) return;

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const grid = document.getElementById("gw-map-nodes");
  const panel = document.getElementById("gw-map-panel");
  const panelBody = document.getElementById("gw-map-panel-body");
  const closeBtn = document.getElementById("gw-map-panel-close");
  const legend = document.getElementById("gw-map-legend");
  if (!grid || !panel || !panelBody) return;

  const incoming = {};
  (map.edges || []).forEach(function (e) {
    incoming[e.to] = e;
  });

  const nodesById = {};
  map.nodes.forEach(function (n) {
    nodesById[n.id] = n;
  });

  const ORDER = [
    "z_sanctuary_core",
    "fourteen_drp_protocols",
    "cycle_observe",
    "z_eaii",
    "grounded_questions_qadp",
    "univ_workstation_navigator",
  ];

  const ordered = ORDER.map(function (id) {
    return nodesById[id];
  }).filter(Boolean);

  grid.innerHTML = ordered
    .map(function (n, i) {
      const edge = incoming[n.id];
      const area = n.layout && n.layout.area ? n.layout.area : "";
      const center = n.id === map.center;
      let extra = "";
      if (n.implementation_state) {
        extra +=
          '<span class="map-node-impl">Implementation: ' +
          escapeHtml(n.implementation_state) +
          "</span>";
      }
      if (n.public_evidence_gate) {
        extra +=
          '<span class="map-node-gate">Evidence gate: ' +
          escapeHtml(n.public_evidence_gate) +
          "</span>";
      }
      if (edge) {
        extra +=
          '<span class="map-node-rel">from Core: ' +
          escapeHtml(edge.label) +
          "</span>";
      }
      return (
        '<li data-area="' +
        escapeHtml(area) +
        '"><button type="button" class="map-node' +
        (center ? " map-node--center" : "") +
        '" data-id="' +
        escapeHtml(n.id) +
        '" tabindex="' +
        (i === 0 ? "0" : "-1") +
        '" aria-expanded="false" aria-controls="gw-map-panel">' +
        '<span class="map-node-name">' +
        escapeHtml(n.public_name) +
        "</span>" +
        '<span class="map-node-evidence">Evidence: ' +
        escapeHtml(n.evidence_state) +
        "</span>" +
        extra +
        "</button></li>"
      );
    })
    .join("");

  if (legend) {
    legend.innerHTML = (map.edges || [])
      .map(function (e) {
        const to = nodesById[e.to];
        return (
          "<li><code>" +
          escapeHtml(e.label) +
          "</code> → " +
          escapeHtml(to ? to.public_name : e.to) +
          " — " +
          escapeHtml(e.meaning) +
          "</li>"
        );
      })
      .join("");
  }

  function buttons() {
    return Array.from(grid.querySelectorAll(".map-node"));
  }

  function setRoving(active) {
    buttons().forEach(function (b) {
      b.tabIndex = b === active ? 0 : -1;
    });
  }

  function closePanel() {
    panel.hidden = true;
    panel.setAttribute("aria-hidden", "true");
    buttons().forEach(function (b) {
      b.setAttribute("aria-expanded", "false");
    });
  }

  function openPanel(id, restoreEl) {
    const n = nodesById[id];
    if (!n) return;
    const edge = incoming[n.id];
    const rel =
      n.id === map.center
        ? "Named heart of this local preview. Connected nodes use relationship labels, not runtime control."
        : n.core_relationship +
          (edge ? " Map label: " + edge.label + ". " + edge.meaning : "");
    const exists = (n.what_exists || [])
      .slice(0, 3)
      .map(function (x) {
        return "<li>" + escapeHtml(x) + "</li>";
      })
      .join("");
    const notClaimed = (n.not_claimed || [])
      .slice(0, 3)
      .map(function (x) {
        return "<li>" + escapeHtml(x) + "</li>";
      })
      .join("");
    panelBody.innerHTML =
      "<h3 id=\"gw-map-panel-title\">" +
      escapeHtml(n.public_name) +
      "</h3><p>" +
      escapeHtml(n.purpose) +
      '</p><p class="notice">Evidence: ' +
      escapeHtml(n.evidence_state) +
      (n.implementation_state
        ? " · Implementation: " + escapeHtml(n.implementation_state)
        : "") +
      (n.public_evidence_gate
        ? " · Evidence gate: " + escapeHtml(n.public_evidence_gate)
        : "") +
      "</p><p class=\"notice\">PASS evidence gate is not VERIFIED. QUALIFIED is not VERIFIED. SEALED is not deployed.</p><h4>What exists today</h4><ul>" +
      exists +
      "</ul><h4>What is not claimed</h4><ul>" +
      notClaimed +
      "</ul><h4>Relationship to Core</h4><p>" +
      escapeHtml(rel) +
      '</p><p><a class="cta secondary" href="' +
      escapeHtml(n.page) +
      '">Open ' +
      escapeHtml(n.public_name) +
      " page</a></p>";
    panel.hidden = false;
    panel.setAttribute("aria-hidden", "false");
    panel.setAttribute("tabindex", "-1");
    buttons().forEach(function (b) {
      b.setAttribute("aria-expanded", b.getAttribute("data-id") === id ? "true" : "false");
    });
    panel.dataset.restoreId = id;
    panel.focus();
  }

  grid.addEventListener("click", function (ev) {
    const btn = ev.target.closest(".map-node");
    if (!btn) return;
    setRoving(btn);
    openPanel(btn.getAttribute("data-id"), btn);
  });

  grid.addEventListener("keydown", function (ev) {
    const btn = ev.target.closest(".map-node");
    if (!btn) return;
    const list = buttons();
    const i = list.indexOf(btn);
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      setRoving(btn);
      openPanel(btn.getAttribute("data-id"), btn);
      return;
    }
    if (ev.key !== "ArrowRight" && ev.key !== "ArrowDown" && ev.key !== "ArrowLeft" && ev.key !== "ArrowUp") {
      return;
    }
    ev.preventDefault();
    const next =
      ev.key === "ArrowRight" || ev.key === "ArrowDown"
        ? list[(i + 1) % list.length]
        : list[(i - 1 + list.length) % list.length];
    setRoving(next);
    next.focus();
  });

  function focusables() {
    return Array.from(panel.querySelectorAll("a[href], button:not([disabled])")).filter(function (el) {
      return !el.hidden;
    });
  }

  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && !panel.hidden) {
      ev.preventDefault();
      const id = panel.dataset.restoreId;
      closePanel();
      const node = grid.querySelector('.map-node[data-id="' + id + '"]');
      if (node) node.focus();
      return;
    }
    if (ev.key !== "Tab" || panel.hidden) return;
    const items = focusables();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (ev.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
      ev.preventDefault();
      last.focus();
    } else if (!ev.shiftKey && document.activeElement === last) {
      ev.preventDefault();
      first.focus();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      const id = panel.dataset.restoreId;
      closePanel();
      const node = grid.querySelector('.map-node[data-id="' + id + '"]');
      if (node) node.focus();
    });
  }

  closePanel();
})();
