/**
 * Z-RNS-FOUNDATION-1 — Timeline & Evidence Vault (local-first IndexedDB).
 * No cloud sync, no AI API, no legal advice. Device-local only.
 */
(function () {
  'use strict';

  var DB_NAME = 'z_rns_foundation_v1';
  var DB_VERSION = 1;
  var AWARENESS =
    'Awareness · organisation · preparation · education · emotional regulation · documentation. ' +
    'Not vigilante energy. Not anti-law rhetoric. Not “beat the system.”';

  var state = { db: null, events: [], evidence: [], rights: [], objectUrls: [] };

  function $(id) {
    return document.getElementById(id);
  }

  function uuid() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return 'zrns-' + Date.now() + '-' + Math.random().toString(16).slice(2);
  }

  function parseTags(raw) {
    if (!raw || !String(raw).trim()) return [];
    return String(raw)
      .split(',')
      .map(function (t) {
        return t.trim();
      })
      .filter(Boolean);
  }

  function showError(msg) {
    var el = $('zrnsError');
    if (!el) return;
    el.textContent = msg || '';
    el.hidden = !msg;
  }

  function setStatus(msg) {
    var el = $('zrnsStatus');
    if (el) el.textContent = msg || '';
  }

  function openDb() {
    return new Promise(function (resolve, reject) {
      if (!window.indexedDB) {
        reject(new Error('IndexedDB not available in this browser'));
        return;
      }
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onerror = function () {
        reject(req.error || new Error('IndexedDB open failed'));
      };
      req.onupgradeneeded = function (ev) {
        var db = ev.target.result;
        if (!db.objectStoreNames.contains('timeline_events')) {
          var evStore = db.createObjectStore('timeline_events', { keyPath: 'id' });
          evStore.createIndex('occurred_at', 'occurred_at', { unique: false });
          evStore.createIndex('category', 'category', { unique: false });
        }
        if (!db.objectStoreNames.contains('evidence_items')) {
          var eviStore = db.createObjectStore('evidence_items', { keyPath: 'id' });
          eviStore.createIndex('category', 'category', { unique: false });
          eviStore.createIndex('captured_at', 'captured_at', { unique: false });
        }
        if (!db.objectStoreNames.contains('rights_requests')) {
          var rStore = db.createObjectStore('rights_requests', { keyPath: 'id' });
          rStore.createIndex('deadline_at', 'deadline_at', { unique: false });
          rStore.createIndex('request_type', 'request_type', { unique: false });
        }
      };
      req.onsuccess = function () {
        resolve(req.result);
      };
    });
  }

  function txStore(storeName, mode) {
    return state.db.transaction(storeName, mode || 'readonly').objectStore(storeName);
  }

  function getAll(storeName) {
    return new Promise(function (resolve, reject) {
      var req = txStore(storeName, 'readonly').getAll();
      req.onsuccess = function () {
        resolve(req.result || []);
      };
      req.onerror = function () {
        reject(req.error);
      };
    });
  }

  function put(storeName, record) {
    return new Promise(function (resolve, reject) {
      var req = txStore(storeName, 'readwrite').put(record);
      req.onsuccess = function () {
        resolve(record);
      };
      req.onerror = function () {
        reject(req.error);
      };
    });
  }

  function remove(storeName, id) {
    return new Promise(function (resolve, reject) {
      var req = txStore(storeName, 'readwrite').delete(id);
      req.onsuccess = function () {
        resolve();
      };
      req.onerror = function () {
        reject(req.error);
      };
    });
  }

  function revokeObjectUrls() {
    state.objectUrls.forEach(function (url) {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {
        /* ignore */
      }
    });
    state.objectUrls = [];
  }

  function eventLabel(ev) {
    return (ev.occurred_at || '?') + ' — ' + (ev.title || ev.id);
  }

  function refreshData() {
    return Promise.all([
      getAll('timeline_events'),
      getAll('evidence_items'),
      getAll('rights_requests'),
    ]).then(function (results) {
      state.events = (results[0] || []).sort(function (a, b) {
        return String(a.occurred_at).localeCompare(String(b.occurred_at));
      });
      state.evidence = results[1] || [];
      state.rights = (results[2] || []).sort(function (a, b) {
        return String(a.deadline_at || '').localeCompare(String(b.deadline_at || ''));
      });
    });
  }

  function fillEventSelects() {
    var selects = [
      $('zrnsEvidenceLinkEvent'),
      $('zrnsCauseEffect'),
      $('zrnsCauseRoot'),
    ].filter(Boolean);

    selects.forEach(function (sel) {
      var current = sel.value;
      var keepBlank = sel.id === 'zrnsEvidenceLinkEvent';
      sel.textContent = '';
      if (keepBlank) {
        var opt0 = document.createElement('option');
        opt0.value = '';
        opt0.textContent = '— none —';
        sel.appendChild(opt0);
      }
      state.events.forEach(function (ev) {
        var opt = document.createElement('option');
        opt.value = ev.id;
        opt.textContent = eventLabel(ev);
        sel.appendChild(opt);
      });
      if (current) sel.value = current;
    });
  }

  function renderTimeline() {
    var list = $('zrnsTimelineList');
    if (!list) return;
    list.textContent = '';
    if (state.events.length === 0) {
      var empty = document.createElement('p');
      empty.className = 'zrns-hint';
      empty.textContent = 'No events yet — add your first timeline entry above.';
      list.appendChild(empty);
      return;
    }
    state.events.forEach(function (ev) {
      var li = document.createElement('li');
      li.className = 'zrns-timeline-item';

      var header = document.createElement('header');
      var h3 = document.createElement('h3');
      h3.textContent = ev.title || '(untitled)';
      header.appendChild(h3);
      var meta = document.createElement('span');
      meta.className = 'zrns-meta';
      meta.textContent = (ev.occurred_at || '') + ' · ' + (ev.category || 'other');
      header.appendChild(meta);
      li.appendChild(header);

      if (ev.tags && ev.tags.length) {
        var tagWrap = document.createElement('p');
        ev.tags.forEach(function (tag) {
          var span = document.createElement('span');
          span.className = 'zrns-tag';
          span.textContent = tag;
          tagWrap.appendChild(span);
        });
        li.appendChild(tagWrap);
      }

      if (ev.notes) {
        var notes = document.createElement('p');
        notes.textContent = ev.notes;
        li.appendChild(notes);
      }

      if (ev.cause_event_id) {
        var cause = state.events.find(function (e) {
          return e.id === ev.cause_event_id;
        });
        var causeP = document.createElement('p');
        causeP.className = 'zrns-meta';
        causeP.textContent = 'Cause link: ' + (cause ? cause.title : ev.cause_event_id);
        li.appendChild(causeP);
      }

      var actions = document.createElement('div');
      actions.className = 'zrns-card-actions';
      var del = document.createElement('button');
      del.type = 'button';
      del.className = 'zrns-danger';
      del.textContent = 'Delete';
      del.addEventListener('click', function () {
        if (!window.confirm('Delete this timeline event?')) return;
        remove('timeline_events', ev.id)
          .then(loadAll)
          .catch(function (err) {
            showError(err.message);
          });
      });
      actions.appendChild(del);
      li.appendChild(actions);
      list.appendChild(li);
    });
  }

  function renderEvidence() {
    revokeObjectUrls();
    var grid = $('zrnsEvidenceGrid');
    if (!grid) return;
    grid.textContent = '';

    if (state.evidence.length === 0) {
      var empty = document.createElement('p');
      empty.className = 'zrns-hint';
      empty.textContent = 'Vault empty — add files above (stored locally in this browser).';
      grid.appendChild(empty);
      return;
    }

    state.evidence.forEach(function (item) {
      var card = document.createElement('article');
      card.className = 'zrns-evidence-card';

      var preview = document.createElement('div');
      preview.className = 'zrns-evidence-preview';
      if (item.blob && item.mime_type && item.mime_type.indexOf('image/') === 0) {
        var url = URL.createObjectURL(item.blob);
        state.objectUrls.push(url);
        var img = document.createElement('img');
        img.src = url;
        img.alt = item.filename || 'Evidence image';
        preview.appendChild(img);
      } else if (item.blob && item.mime_type && item.mime_type.indexOf('video/') === 0) {
        var vurl = URL.createObjectURL(item.blob);
        state.objectUrls.push(vurl);
        var video = document.createElement('video');
        video.src = vurl;
        video.controls = true;
        video.preload = 'metadata';
        preview.appendChild(video);
      } else {
        preview.textContent = item.mime_type || 'file';
      }
      card.appendChild(preview);

      var body = document.createElement('div');
      body.className = 'zrns-evidence-body';
      var h4 = document.createElement('h4');
      h4.textContent = item.filename || 'Untitled';
      body.appendChild(h4);
      var meta = document.createElement('p');
      meta.className = 'zrns-meta';
      meta.textContent =
        (item.category || 'other') +
        ' · ' +
        (item.captured_at || 'no date') +
        ' · ' +
        (item.size_bytes != null ? Math.round(item.size_bytes / 1024) + ' KB' : '');
      body.appendChild(meta);

      if (item.tags && item.tags.length) {
        var tagP = document.createElement('p');
        item.tags.forEach(function (tag) {
          var span = document.createElement('span');
          span.className = 'zrns-tag';
          span.textContent = tag;
          tagP.appendChild(span);
        });
        body.appendChild(tagP);
      }

      var actions = document.createElement('div');
      actions.className = 'zrns-card-actions';
      var del = document.createElement('button');
      del.type = 'button';
      del.className = 'zrns-danger';
      del.textContent = 'Delete';
      del.addEventListener('click', function () {
        if (!window.confirm('Delete this evidence item from local vault?')) return;
        remove('evidence_items', item.id)
          .then(loadAll)
          .catch(function (err) {
            showError(err.message);
          });
      });
      actions.appendChild(del);
      body.appendChild(actions);
      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  function renderCauseLinks() {
    var list = $('zrnsCauseList');
    if (!list) return;
    list.textContent = '';
    var linked = state.events.filter(function (e) {
      return e.cause_event_id;
    });
    if (linked.length === 0) {
      var empty = document.createElement('p');
      empty.className = 'zrns-hint';
      empty.textContent = 'No cause → effect links yet.';
      list.appendChild(empty);
      return;
    }
    linked.forEach(function (effect) {
      var cause = state.events.find(function (e) {
        return e.id === effect.cause_event_id;
      });
      var li = document.createElement('li');
      li.textContent =
        (cause ? cause.title : effect.cause_event_id) +
        ' → ' +
        (effect.title || effect.id) +
        ' (' +
        (effect.occurred_at || '') +
        ')';
      list.appendChild(li);
    });
  }

  function renderRights() {
    var list = $('zrnsRightsList');
    if (!list) return;
    list.textContent = '';
    var today = new Date().toISOString().slice(0, 10);

    if (state.rights.length === 0) {
      var empty = document.createElement('p');
      empty.className = 'zrns-hint';
      empty.textContent = 'No rights tracker items yet.';
      list.appendChild(empty);
      return;
    }

    state.rights.forEach(function (r) {
      var li = document.createElement('li');
      if (r.deadline_at && r.deadline_at < today && r.status !== 'closed') {
        li.className = 'zrns-overdue';
      }
      var line =
        (r.request_type || 'other').toUpperCase() +
        ' · ' +
        (r.title || '') +
        ' · deadline ' +
        (r.deadline_at || '—') +
        ' · ' +
        (r.status || 'draft');
      li.appendChild(document.createTextNode(line));
      if (r.notes) {
        var note = document.createElement('p');
        note.className = 'zrns-meta';
        note.textContent = r.notes;
        li.appendChild(note);
      }
      list.appendChild(li);
    });
  }

  function buildManifest() {
    return {
      receipt_type: 'z_rns_export_manifest_v1',
      phase: 'Z-RNS-FOUNDATION-1',
      generated_at: new Date().toISOString(),
      includes_blobs: false,
      not_legal_advice: true,
      timeline_count: state.events.length,
      evidence_count: state.evidence.length,
      rights_count: state.rights.length,
      timeline_events: state.events.map(function (e) {
        return {
          id: e.id,
          title: e.title,
          occurred_at: e.occurred_at,
          category: e.category,
          tags: e.tags,
          cause_event_id: e.cause_event_id || null,
        };
      }),
      evidence_items: state.evidence.map(function (e) {
        return {
          id: e.id,
          filename: e.filename,
          mime_type: e.mime_type,
          size_bytes: e.size_bytes,
          category: e.category,
          tags: e.tags,
          captured_at: e.captured_at,
          timeline_event_ids: e.timeline_event_ids || [],
        };
      }),
      rights_requests: state.rights.map(function (r) {
        return {
          id: r.id,
          request_type: r.request_type,
          title: r.title,
          deadline_at: r.deadline_at,
          status: r.status,
        };
      }),
      note: 'Metadata-only manifest for human review. Not legal advice. Blobs stay local unless a future chartered export adds them.',
    };
  }

  function renderExportPreview() {
    var pre = $('zrnsExportPreview');
    if (pre) pre.textContent = JSON.stringify(buildManifest(), null, 2);
  }

  function generateMockSummary() {
    var causeLinks = state.events.filter(function (e) {
      return e.cause_event_id;
    }).length;
    var lines = [
      'LOCAL MOCK SUMMARY (no AI API — not legal advice)',
      '================================================',
      '',
      'Timeline events: ' + state.events.length,
      'Evidence items: ' + state.evidence.length,
      'Rights tracker items: ' + state.rights.length,
      'Cause→effect links: ' + causeLinks,
      '',
      'Earliest event: ' + (state.events[0] ? state.events[0].occurred_at + ' — ' + state.events[0].title : 'none'),
      'Latest event: ' +
        (state.events.length
          ? state.events[state.events.length - 1].occurred_at +
            ' — ' +
            state.events[state.events.length - 1].title
          : 'none'),
      '',
      'Reminder: This template is for organisation only. Consult qualified humans for legal, medical, or therapeutic decisions.',
    ];
    var out = $('zrnsMockOutput');
    if (out) out.textContent = lines.join('\n');
  }

  function loadAll() {
    return refreshData()
      .then(function () {
        fillEventSelects();
        renderTimeline();
        renderEvidence();
        renderCauseLinks();
        renderRights();
        renderExportPreview();
        showError('');
        setStatus('Local data loaded (' + state.events.length + ' events, ' + state.evidence.length + ' evidence).');
      })
      .catch(function (err) {
        showError(err.message || String(err));
      });
  }

  function switchTab(tabId) {
    document.querySelectorAll('.zrns-tab').forEach(function (btn) {
      btn.classList.toggle('zrns-tab-active', btn.getAttribute('data-tab') === tabId);
    });
    var panels = {
      timeline: $('zrnsPanelTimeline'),
      vault: $('zrnsPanelVault'),
      cause: $('zrnsPanelCause'),
      rights: $('zrnsPanelRights'),
      export: $('zrnsPanelExport'),
      mock: $('zrnsPanelMock'),
    };
    Object.keys(panels).forEach(function (key) {
      var panel = panels[key];
      if (!panel) return;
      var active = key === tabId;
      panel.hidden = !active;
      panel.classList.toggle('zrns-panel-active', active);
    });
  }

  function bindForms() {
    var timelineForm = $('zrnsTimelineForm');
    if (timelineForm) {
      timelineForm.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var now = new Date().toISOString();
        var record = {
          id: uuid(),
          title: $('zrnsEventTitle').value.trim(),
          notes: $('zrnsEventNotes').value.trim(),
          occurred_at: $('zrnsEventDate').value,
          category: $('zrnsEventCategory').value,
          tags: parseTags($('zrnsEventTags').value),
          cause_event_id: null,
          created_at: now,
          updated_at: now,
        };
        put('timeline_events', record)
          .then(function () {
            timelineForm.reset();
            return loadAll();
          })
          .catch(function (err) {
            showError(err.message);
          });
      });
    }

    var evidenceForm = $('zrnsEvidenceForm');
    if (evidenceForm) {
      evidenceForm.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var fileInput = $('zrnsEvidenceFile');
        var file = fileInput.files && fileInput.files[0];
        if (!file) return;
        var linkId = $('zrnsEvidenceLinkEvent').value;
        var now = new Date().toISOString();
        var record = {
          id: uuid(),
          filename: file.name,
          mime_type: file.type || 'application/octet-stream',
          size_bytes: file.size,
          category: $('zrnsEvidenceCategory').value,
          tags: parseTags($('zrnsEvidenceTags').value),
          captured_at: $('zrnsEvidenceDate').value || now.slice(0, 10),
          added_at: now,
          timeline_event_ids: linkId ? [linkId] : [],
          blob: file,
        };
        put('evidence_items', record)
          .then(function () {
            evidenceForm.reset();
            fileInput.value = '';
            return loadAll();
          })
          .catch(function (err) {
            showError(err.message);
          });
      });
    }

    var causeForm = $('zrnsCauseForm');
    if (causeForm) {
      causeForm.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var effectId = $('zrnsCauseEffect').value;
        var rootId = $('zrnsCauseRoot').value;
        if (effectId === rootId) {
          showError('Cause and effect must be different events.');
          return;
        }
        var effect = state.events.find(function (e) {
          return e.id === effectId;
        });
        if (!effect) return;
        effect.cause_event_id = rootId;
        effect.updated_at = new Date().toISOString();
        put('timeline_events', effect)
          .then(function () {
            causeForm.reset();
            showError('');
            return loadAll();
          })
          .catch(function (err) {
            showError(err.message);
          });
      });
    }

    var rightsForm = $('zrnsRightsForm');
    if (rightsForm) {
      rightsForm.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var record = {
          id: uuid(),
          request_type: $('zrnsRightsType').value,
          title: $('zrnsRightsTitle').value.trim(),
          deadline_at: $('zrnsRightsDeadline').value || null,
          status: $('zrnsRightsStatus').value,
          notes: $('zrnsRightsNotes').value.trim(),
          created_at: new Date().toISOString(),
        };
        put('rights_requests', record)
          .then(function () {
            rightsForm.reset();
            return loadAll();
          })
          .catch(function (err) {
            showError(err.message);
          });
      });
    }

    var refreshExport = $('zrnsRefreshExport');
    if (refreshExport) refreshExport.addEventListener('click', renderExportPreview);

    var downloadBtn = $('zrnsDownloadManifest');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', function () {
        var manifest = buildManifest();
        var blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'z-rns-manifest-' + new Date().toISOString().slice(0, 10) + '.json';
        a.click();
        URL.revokeObjectURL(url);
        setStatus('Manifest downloaded (metadata only).');
      });
    }

    var mockBtn = $('zrnsGenerateMock');
    if (mockBtn) mockBtn.addEventListener('click', generateMockSummary);
  }

  function bindTabs() {
    document.querySelectorAll('.zrns-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchTab(btn.getAttribute('data-tab'));
      });
    });
  }

  function init() {
    var awareness = $('zrnsAwarenessText');
    if (awareness) awareness.textContent = AWARENESS;

    var dateInput = $('zrnsEventDate');
    if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);

    bindTabs();
    bindForms();

    openDb()
      .then(function (db) {
        state.db = db;
        return loadAll();
      })
      .catch(function (err) {
        showError(err.message || 'Could not open local database.');
      });

    window.addEventListener('beforeunload', revokeObjectUrls);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
