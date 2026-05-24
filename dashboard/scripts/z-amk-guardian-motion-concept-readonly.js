/**
 * Z-AMK-GUARDIAN-MOTION-1 — Concept foundation dashboard (read-only).
 * Fictional / cinematic / artistic only. No combat engineering. GET seed JSON only.
 */
(function () {
  'use strict';

  var SEED_URL = '../../data/z_amk_guardian_motion_concept_seed.json';
  var FOLDERS = [
    { id: 'armor', path: '../../concepts/z-amk-guardian-motion/armor/README.md' },
    { id: 'motion', path: '../../concepts/z-amk-guardian-motion/motion/README.md' },
    { id: 'aura', path: '../../concepts/z-amk-guardian-motion/aura/README.md' },
    { id: 'guardian-hand', path: '../../concepts/z-amk-guardian-motion/guardian-hand/README.md' },
    { id: 'neck-ring', path: '../../concepts/z-amk-guardian-motion/neck-ring/README.md' },
    { id: 'cinematics', path: '../../concepts/z-amk-guardian-motion/cinematics/README.md' },
  ];

  var LAW =
    'Disciplined imagination — symbolic protection, not weapons. ' +
    'Fictional · cinematic · artistic exploration only.';

  var state = { seed: null, activeFormId: 'base_guardian' };

  function $(id) {
    return document.getElementById(id);
  }

  function fetchSeed() {
    return fetch(SEED_URL, { credentials: 'same-origin', cache: 'no-store' }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + SEED_URL);
      return res.json();
    });
  }

  function renderPoster(seed) {
    var poster = seed.poster || {};
    var title = $('zgmPosterTitle');
    var sub = $('zgmPosterSub');
    var disc = $('zgmPosterDisclaimer');
    if (title) title.textContent = poster.title || 'Z-AMK Guardian Motion';
    if (sub) sub.textContent = poster.subtitle || '';
    if (disc) disc.textContent = poster.disclaimer || '';
  }

  function renderFormDetail(form) {
    var el = $('zgmFormDetail');
    if (!el || !form) return;
    el.textContent = '';
    var h = document.createElement('h3');
    h.textContent = form.label;
    el.appendChild(h);
    var lines = [
      form.tagline,
      'Aura: ' + form.aura,
      form.motion_notes,
      'Folders: ' + (form.concept_folder_hints || []).join(', '),
    ];
    lines.forEach(function (line) {
      if (!line) return;
      var p = document.createElement('p');
      p.textContent = line;
      el.appendChild(p);
    });
  }

  function setActiveForm(formId) {
    state.activeFormId = formId;
    var form = (state.seed.forms || []).find(function (f) {
      return f.id === formId;
    });
    var rotator = $('zgmRotator');
    if (rotator) {
      rotator.className = 'zgm-rotator';
      if (formId === 'base_guardian') rotator.classList.add('form-base');
      if (formId === 'hyper_guardian') rotator.classList.add('form-hyper');
      if (formId === 'cosmic_guardian') rotator.classList.add('form-cosmic');
    }
    document.querySelectorAll('.zgm-form-tab').forEach(function (btn) {
      btn.classList.toggle('zgm-form-tab-active', btn.getAttribute('data-form') === formId);
    });
    renderFormDetail(form);
  }

  function renderForms(seed) {
    var tabs = $('zgmFormTabs');
    if (!tabs) return;
    tabs.textContent = '';
    (seed.forms || []).forEach(function (form) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'zgm-form-tab';
      btn.setAttribute('data-form', form.id);
      btn.setAttribute('role', 'tab');
      btn.textContent = form.label;
      btn.addEventListener('click', function () {
        setActiveForm(form.id);
      });
      tabs.appendChild(btn);
    });
    setActiveForm(state.activeFormId);
  }

  function renderFolders() {
    var list = $('zgmFolderList');
    if (!list) return;
    list.textContent = '';
    FOLDERS.forEach(function (f) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = f.path;
      a.textContent = f.id + '/';
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  function renderAnatomy(seed) {
    var list = $('zgmAnatomyList');
    if (!list) return;
    list.textContent = '';
    (seed.anatomy_flow_topics || []).forEach(function (topic) {
      var li = document.createElement('li');
      li.textContent = topic;
      list.appendChild(li);
    });
  }

  function renderSeed(seed) {
    state.seed = seed;
    var sub = $('zgmSubtitle');
    if (sub) sub.textContent = seed.movement_philosophy || '';
    var law = $('zgmLawText');
    if (law) law.textContent = LAW;
    renderPoster(seed);
    renderForms(seed);
    renderFolders();
    renderAnatomy(seed);
  }

  function init() {
    fetchSeed()
      .then(renderSeed)
      .catch(function (err) {
        var sub = $('zgmSubtitle');
        if (sub) sub.textContent = 'Could not load concept seed: ' + err.message;
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
