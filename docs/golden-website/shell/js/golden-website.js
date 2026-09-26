(function () {
  const data = window.GW_APPROVED;
  if (!data) return;

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function record(id) {
    return data.records.find((r) => r.canonical_id === id);
  }

  const evidenceBtn = document.getElementById("gw-evidence-toggle");
  const locked = document.getElementById("gw-locked");
  const vocab = document.getElementById("gw-vocab");
  const evidenceBoard = document.getElementById("gw-evidence-board");
  const previewRail = document.getElementById("gw-preview-rail");
  const previewPanel = document.getElementById("gw-preview-panel");
  const evidenceStatus = document.getElementById("gw-evidence-status");
  const evidenceCta = document.getElementById("gw-evidence-cta");
  const portfolio = document.getElementById("gw-portfolio");
  const rel = document.getElementById("gw-relationships");
  const disclaimer = document.getElementById("gw-portfolio-disclaimer");

  function setEvidenceMode(on, opts) {
    const options = opts || {};
    document.body.classList.toggle("evidence-mode", on);
    if (evidenceBtn) {
      evidenceBtn.setAttribute("aria-pressed", on ? "true" : "false");
      evidenceBtn.setAttribute("aria-expanded", on ? "true" : "false");
      evidenceBtn.textContent = on ? "Evidence mode on" : "Show Me What's Real";
    }
    if (evidenceBoard) {
      evidenceBoard.setAttribute("aria-hidden", on ? "false" : "true");
    }
    if (evidenceStatus) {
      evidenceStatus.textContent = on
        ? "Evidence mode on. Six approved records are shown with their evidence states. QUALIFIED is not VERIFIED. Working local UI is not public production."
        : "Evidence mode off.";
    }
    try {
      sessionStorage.setItem("gwEvidenceMode", on ? "1" : "0");
    } catch {
      /* ignore */
    }
    if (on && evidenceBoard && options.scroll !== false) {
      const page = document.body.getAttribute("data-gw-page");
      if (page !== "map" && page !== "gallery" && page !== "museum" && page !== "guide-sandbox" && page !== "gateway" && page !== "ai-integrity") {
        evidenceBoard.scrollIntoView({ block: "start" });
      }
    }
  }

  const saved = (function () {
    try {
      return sessionStorage.getItem("gwEvidenceMode") === "1";
    } catch {
      return false;
    }
  })();
  setEvidenceMode(saved, { scroll: false });

  if (evidenceBtn) {
    evidenceBtn.addEventListener("click", function () {
      setEvidenceMode(!document.body.classList.contains("evidence-mode"));
    });
  }

  if (evidenceCta) {
    evidenceCta.addEventListener("click", function () {
      if (!document.body.classList.contains("evidence-mode")) {
        setEvidenceMode(true);
      } else if (evidenceBoard) {
        evidenceBoard.scrollIntoView({ block: "start" });
      }
    });
  }

  if (disclaimer && data.portfolio_disclaimer) {
    disclaimer.textContent = data.portfolio_disclaimer;
  }

  if (vocab) {
    vocab.innerHTML = data.evidence_vocabulary
      .map(function (v) {
        return "<div><dt>" + escapeHtml(v.id) + "</dt><dd>" + escapeHtml(v.meaning) + "</dd></div>";
      })
      .join("");
  }

  if (locked) {
    locked.innerHTML = data.locked_surfaces
      .map(function (s) {
        return (
          "<li><span>" +
          escapeHtml(s.name) +
          "</span><small>" +
          escapeHtml(data.locked_label) +
          "</small></li>"
        );
      })
      .join("");
  }

  if (portfolio && data.portfolio_groups) {
    portfolio.innerHTML = data.portfolio_groups
      .map(function (g) {
        const cards = g.record_ids
          .map(function (id) {
            const r = record(id);
            if (!r) return "";
            return (
              '<article class="glass"><h3>' +
              escapeHtml(r.public_name) +
              '</h3><p class="notice">Evidence: ' +
              escapeHtml(r.evidence_state) +
              "</p><p>" +
              escapeHtml(r.approved_public_description) +
              '</p><p><a class="cta secondary" href="' +
              escapeHtml(r.page) +
              '">Open ' +
              escapeHtml(r.public_name) +
              "</a></p></article>"
            );
          })
          .join("");
        return "<h3>" + escapeHtml(g.name) + "</h3><div class=\"portfolio-grid\">" + cards + "</div>";
      })
      .join("");
  }

  if (rel && data.relationships) {
    const edges = data.relationships.edges
      .map(function (e) {
        const to = record(e.to);
        const name = to ? to.public_name : e.to;
        const href = to ? to.page : "#";
        return (
          "<li><span>" +
          escapeHtml(e.role) +
          '</span> <a href="' +
          escapeHtml(href) +
          '">' +
          escapeHtml(name) +
          "</a></li>"
        );
      })
      .join("");
    rel.innerHTML =
      "<p><strong>" +
      escapeHtml(data.relationships.from_name) +
      "</strong></p><ul class=\"rel-list\">" +
      edges +
      '</ul><p class="notice">' +
      escapeHtml(data.relationships.note) +
      "</p>";
  }

  if (evidenceBoard) {
    evidenceBoard.innerHTML =
      "<h2>Show Me What's Real</h2><p class=\"notice\">Evidence over spectacle. Only Steward-approved records appear here. QUALIFIED is not VERIFIED.</p>" +
      data.records
        .map(function (r) {
          let extra = "";
          if (r.public_evidence_gate) extra += "<li>Evidence gate: " + escapeHtml(r.public_evidence_gate) + "</li>";
          if (r.prototype_class === "WORKING") {
            extra += "<li>Prototype/UI status: WORKING LOCAL</li><li>Public production: NO</li>";
          }
          return (
            '<article class="glass"><h3>' +
            escapeHtml(r.public_name) +
            "</h3><ul><li>Evidence: " +
            escapeHtml(r.evidence_state) +
            "</li>" +
            extra +
            '</ul><p><a class="cta secondary" href="' +
            escapeHtml(r.page) +
            '">Open ' +
            escapeHtml(r.public_name) +
            "</a></p></article>"
          );
        })
        .join("");
  }

  function renderPreview(id) {
    if (!previewPanel) return;
    const r = record(id);
    if (!r) return;
    previewPanel.innerHTML =
      "<h3>" +
      escapeHtml(r.public_name) +
      "</h3><p>" +
      escapeHtml(r.approved_public_description) +
      '</p><p class="notice">Read-only preview of approved public-safe records only. No execution authority. Not Golden Universe Map. Not the operator dashboard. Not a public production service.</p><p><a class="cta secondary" href="' +
      escapeHtml(r.page) +
      '">Open public-safe page</a></p>';
    if (previewRail) {
      previewRail.querySelectorAll("button").forEach(function (b) {
        const selected = b.getAttribute("data-id") === id;
        b.setAttribute("aria-selected", selected ? "true" : "false");
        b.setAttribute("aria-pressed", selected ? "true" : "false");
      });
    }
  }

  if (previewRail && previewPanel) {
    previewRail.innerHTML = data.records
      .map(function (r) {
        return (
          '<button type="button" role="tab" data-id="' +
          escapeHtml(r.canonical_id) +
          '">' +
          escapeHtml(r.public_name) +
          "</button>"
        );
      })
      .join("");
    previewRail.addEventListener("click", function (ev) {
      const btn = ev.target.closest("button");
      if (!btn) return;
      renderPreview(btn.getAttribute("data-id"));
    });
    previewRail.addEventListener("keydown", function (ev) {
      if (ev.key !== "ArrowDown" && ev.key !== "ArrowUp" && ev.key !== "ArrowRight" && ev.key !== "ArrowLeft") return;
      const buttons = Array.from(previewRail.querySelectorAll("button"));
      const i = buttons.indexOf(document.activeElement);
      if (i < 0) return;
      ev.preventDefault();
      const next =
        ev.key === "ArrowDown" || ev.key === "ArrowRight"
          ? (i + 1) % buttons.length
          : (i - 1 + buttons.length) % buttons.length;
      buttons[next].focus();
      renderPreview(buttons[next].getAttribute("data-id"));
    });
    renderPreview(data.records[0].canonical_id);
  }

  const coreMounts = {
    desc: document.getElementById("gw-core-desc"),
    exists: document.getElementById("gw-core-exists"),
    not: document.getElementById("gw-core-not"),
    gov: document.getElementById("gw-core-gov"),
    refs: document.getElementById("gw-core-refs"),
    posture: document.getElementById("gw-core-posture"),
  };
  const core = record("z_sanctuary_core");
  if (core && coreMounts.desc) {
    coreMounts.desc.textContent = core.approved_public_description;
    if (coreMounts.exists) {
      coreMounts.exists.innerHTML = core.what_exists.map(function (x) {
        return "<li>" + escapeHtml(x) + "</li>";
      }).join("");
    }
    if (coreMounts.not) {
      coreMounts.not.innerHTML = core.not_claimed.map(function (x) {
        return "<li>" + escapeHtml(x) + "</li>";
      }).join("");
    }
    if (coreMounts.gov) coreMounts.gov.textContent = core.governance_summary || "";
    if (coreMounts.posture) coreMounts.posture.textContent = core.development_posture;
    if (coreMounts.refs) {
      coreMounts.refs.innerHTML = core.evidence_refs
        .map(function (ref) {
          return (
            "<li><strong>" +
            escapeHtml(ref.title) +
            "</strong> — supports: " +
            escapeHtml(ref.supports) +
            " Does not support: " +
            escapeHtml(ref.does_not_support) +
            "</li>"
          );
        })
        .join("");
    }
  }

  const navMounts = {
    desc: document.getElementById("gw-nav-desc"),
    exists: document.getElementById("gw-nav-exists"),
    not: document.getElementById("gw-nav-not"),
    posture: document.getElementById("gw-nav-posture"),
  };
  const nav = record("univ_workstation_navigator");
  if (nav && navMounts.desc) {
    navMounts.desc.textContent = nav.approved_public_description;
    if (navMounts.exists) {
      navMounts.exists.innerHTML = nav.what_exists.map(function (x) {
        return "<li>" + escapeHtml(x) + "</li>";
      }).join("");
    }
    if (navMounts.not) {
      navMounts.not.innerHTML = nav.not_claimed.map(function (x) {
        return "<li>" + escapeHtml(x) + "</li>";
      }).join("");
    }
    if (navMounts.posture) navMounts.posture.textContent = nav.development_posture;
  }

  const recId = document.body.getAttribute("data-gw-record");
  if (recId) {
    const r = record(recId);
    const purpose = document.getElementById("gw-record-purpose");
    const exists = document.getElementById("gw-record-exists");
    const not = document.getElementById("gw-record-not");
    const refs = document.getElementById("gw-record-refs");
    const impl = document.getElementById("gw-record-impl");
    const coreRel = document.getElementById("gw-record-core-rel");
    const next = document.getElementById("gw-record-next");
    if (r && purpose) {
      purpose.textContent = r.approved_public_description;
      if (exists) {
        exists.innerHTML = r.what_exists.map(function (x) {
          return "<li>" + escapeHtml(x) + "</li>";
        }).join("");
      }
      if (not) {
        not.innerHTML = r.not_claimed.map(function (x) {
          return "<li>" + escapeHtml(x) + "</li>";
        }).join("");
      }
      if (refs) {
        refs.innerHTML = r.evidence_refs
          .map(function (ref) {
            return (
              "<li><strong>" +
              escapeHtml(ref.title) +
              "</strong> — supports: " +
              escapeHtml(ref.supports) +
              " Does not support: " +
              escapeHtml(ref.does_not_support) +
              "</li>"
            );
          })
          .join("");
      }
      if (impl) impl.textContent = r.development_posture || r.implementation_state || "";
      if (coreRel) coreRel.textContent = r.core_relationship || "";
      if (next) next.textContent = r.next_evidence_gate || "";
    }
  }
})();
