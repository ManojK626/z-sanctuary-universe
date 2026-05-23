/**
 * Z-SMA-1 — True Human Experience Sanctuary (read-only Turtle seed).
 * GET local seed JSON only. No save, upload, API, voice, or external network.
 */
(function () {
  'use strict';

  var SEED_URL = '../../data/z_sma_story_seed.json';

  var I18N = {
    moris_kreol: {
      title: 'Z-SMA — Sanctuère Experians Imen Vre',
      subtitle: 'Semans privé · famil · pa exploitasion · pa terapi',
      purpose:
        'Z-SMA pa enn chatbot ni platform trauma. Li enn hub dignité pou partaz lived wisdom — an Moris Kreol dabord — avek consent ek respect.',
      sisters_h: 'Kat lane sœur / cousine',
      group_h: 'Lane group ansam',
      modes_h: 'Mode istwar',
      consent_h: 'Consent ek privacy',
      consent_intro: 'Default toule tan: private_only. Pa save depi sa page.',
      draft_h: 'Draft viewer (read-only)',
      draft_note: 'Pa ena vre trauma text dan seed. Stories vini later avek consent.',
      drp_h: '14 DRP safety checklist',
      admin_h: 'Admin review (seed read-only)',
      admin_note: 'Human review obligatoire avan any display beyond family.',
      export_h: 'Export receipt',
      export_note: 'Seed JSON path — pa auto-export depi browser.',
      footer:
        'Z-SMA preserve lived wisdom san volé dignity. AI assist selman — pa replace heartbeat imen.',
      hint: 'GET selman · pa save · pa upload · pa API',
      lang_label: 'Langaz',
      refresh: 'Refresh data',
      privacy_default: 'Default privacy',
      consent: 'Consent',
      lane: 'Lane',
    },
    english: {
      title: 'Z-SMA — True Human Experience Sanctuary',
      subtitle: 'Private seed · family-reviewed posture · not therapy · not exploitation',
      purpose:
        'Z-SMA is not a chatbot, trauma show, or therapy replacement. It is a dignity-first hub where real people may share lived wisdom — in their own words — with consent, privacy, and care.',
      sisters_h: 'Four sister story lanes',
      group_h: 'Group story lane',
      modes_h: 'Story modes',
      consent_h: 'Consent & privacy',
      consent_intro: 'Default is always private_only. This page does not save stories.',
      draft_h: 'Story draft viewer',
      draft_note: 'No real trauma text in seed. Stories arrive later with explicit consent.',
      drp_h: '14 DRP safety checklist',
      admin_h: 'Admin review dashboard (read-only seed)',
      admin_note: 'Human review required before any display beyond approved audience.',
      export_h: 'Export receipt panel',
      export_note: 'Seed JSON path reference — no auto-export from browser.',
      footer:
        'Z-SMA preserves real human lived wisdom without stealing the dignity of those who carried it.',
      hint: 'GET only · no save · no upload · no API',
      lang_label: 'Language',
      refresh: 'Refresh data',
      privacy_default: 'Default privacy',
      consent: 'Consent',
      lane: 'Lane',
    },
    french: {
      title: 'Z-SMA — Sanctuaire de l’expérience humaine vécue',
      subtitle: 'Graine privée · revue familiale · pas thérapie · pas exploitation',
      purpose:
        'Z-SMA n’est ni chatbot, ni spectacle de trauma, ni remplacement thérapeutique. C’est un hub de dignité pour partager la sagesse vécue — avec consentement et respect.',
      sisters_h: 'Quatre lanes sœurs / cousines',
      group_h: 'Lane de groupe',
      modes_h: 'Modes d’histoire',
      consent_h: 'Consentement et vie privée',
      consent_intro: 'Par défaut : private_only. Cette page n’enregistre rien.',
      draft_h: 'Visionneuse de brouillon',
      draft_note:
        'Aucun texte trauma réel dans la graine. Les histoires viendront avec consentement.',
      drp_h: 'Checklist sécurité 14 DRP',
      admin_h: 'Revue admin (graine lecture seule)',
      admin_note: 'Revue humaine obligatoire avant toute diffusion au-delà du public approuvé.',
      export_h: 'Panneau reçu export',
      export_note: 'Chemin JSON graine — pas d’export auto depuis le navigateur.',
      footer: 'Z-SMA préserve la sagesse vécue sans voler la dignité de celles qui l’ont portée.',
      hint: 'GET seulement · pas sauvegarde · pas upload · pas API',
      lang_label: 'Langue',
      refresh: 'Refresh data',
      privacy_default: 'Confidentialité par défaut',
      consent: 'Consentement',
      lane: 'Lane',
    },
  };

  var STORY_MODE_LABELS = {
    individual_story: {
      en: 'Individual story',
      fr: 'Histoire individuelle',
      kreol: 'Istwar endividiel',
    },
    sisters_together: { en: 'Sisters together', fr: 'Sœurs ensemble', kreol: 'Sœur ansam' },
    life_lessons: { en: 'Life lessons', fr: 'Leçons de vie', kreol: 'Leson lavi' },
    behind_the_smile: { en: 'Behind the smile', fr: 'Derrière le sourire', kreol: 'Dèyir souri' },
    what_society_never_saw: {
      en: 'What society never saw',
      fr: 'Ce que la société n’a jamais vu',
      kreol: 'Sa ki sosyete pa finn wè',
    },
    how_we_coped: {
      en: 'How we coped',
      fr: 'Comment nous avons tenu',
      kreol: 'Ki nou finn debouye',
    },
    what_life_taught_us: {
      en: 'What life taught us',
      fr: 'Ce que la vie nous a appris',
      kreol: 'Sa lavi finn anseign nou',
    },
    message_to_young_people: {
      en: 'Message to young people',
      fr: 'Message aux jeunes',
      kreol: 'Mesaz pou zenn',
    },
    healing_through_memory: {
      en: 'Healing through memory',
      fr: 'Guérison par la mémoire',
      kreol: 'Gerizon par memwar',
    },
    family_roots: { en: 'Family roots', fr: 'Racines familiales', kreol: 'Rasin fami' },
  };

  var state = { seed: null, lang: 'english' };

  function $(id) {
    return document.getElementById(id);
  }

  function t(key) {
    var pack = I18N[state.lang] || I18N.english;
    return pack[key] || I18N.english[key] || key;
  }

  function modeLabel(modeId) {
    var m = STORY_MODE_LABELS[modeId];
    if (!m) return modeId;
    if (state.lang === 'french') return m.fr;
    if (state.lang === 'moris_kreol') return m.kreol;
    return m.en;
  }

  function fetchSeed() {
    return fetch(SEED_URL, { credentials: 'same-origin', cache: 'no-store' }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + SEED_URL);
      return res.json();
    });
  }

  function applyStaticLabels() {
    document.body.setAttribute('data-lang', state.lang);
    $('zsmaTitle').textContent = t('title');
    $('zsmaSubtitle').textContent = t('subtitle');
    $('zsmaPurposeH').textContent =
      state.lang === 'french' || state.lang === 'moris_kreol' ? 'Objectif' : 'Purpose';
    $('zsmaPurposeText').textContent = t('purpose');
    $('zsmaSistersH').textContent = t('sisters_h');
    $('zsmaGroupH').textContent = t('group_h');
    $('zsmaModesH').textContent = t('modes_h');
    $('zsmaConsentH').textContent = t('consent_h');
    $('zsmaConsentIntro').textContent = t('consent_intro');
    $('zsmaDraftH').textContent = t('draft_h');
    $('zsmaDraftNote').textContent = t('draft_note');
    $('zsmaDrpH').textContent = t('drp_h');
    $('zsmaAdminH').textContent = t('admin_h');
    $('zsmaAdminNote').textContent = t('admin_note');
    $('zsmaExportH').textContent = t('export_h');
    $('zsmaExportNote').textContent = t('export_note');
    $('zsmaFooterLaw').textContent = t('footer');
    $('zsmaHint').textContent = t('hint');
    $('zsmaLangLabel').textContent = t('lang_label');
    $('zsmaRefresh').textContent = t('refresh');
  }

  function renderSeed(seed) {
    state.seed = seed;
    $('zsmaGoldenLaw').textContent = seed.golden_law || t('footer');

    var cards = $('zsmaSisterCards');
    cards.textContent = '';
    (seed.sisters || []).forEach(function (s) {
      var card = document.createElement('article');
      card.className = 'zsma-sister-card';
      card.innerHTML =
        '<h3>' +
        (s.display_name_placeholder || s.sister_id) +
        '</h3>' +
        '<p class="zsma-mono">' +
        s.sister_id +
        '</p>' +
        '<p><strong>' +
        t('consent') +
        ':</strong> ' +
        (s.consent_status || 'not_recorded') +
        '</p>' +
        '<p><strong>privacy:</strong> <span class="zsma-privacy">' +
        (s.privacy_level || 'private_only') +
        '</span></p>' +
        '<p class="zsma-hint">' +
        (s.emotional_boundaries_note || '') +
        '</p>';
      cards.appendChild(card);
    });

    var group = seed.group_lane || {};
    $('zsmaGroupLane').innerHTML =
      '<h3>' +
      (group.label || 'Group lane') +
      '</h3>' +
      '<p><strong>privacy:</strong> <span class="zsma-privacy">' +
      (group.privacy_level || 'private_only') +
      '</span></p>' +
      '<p><strong>' +
      t('consent') +
      ':</strong> ' +
      (group.consent_status || 'not_recorded') +
      '</p>';

    var modes = $('zsmaStoryModes');
    modes.textContent = '';
    (seed.story_modes || []).forEach(function (m) {
      var li = document.createElement('li');
      li.textContent = modeLabel(m);
      modes.appendChild(li);
    });

    var dl = $('zsmaPrivacyDl');
    dl.textContent = '';
    var dt1 = document.createElement('dt');
    dt1.textContent = t('privacy_default');
    var dd1 = document.createElement('dd');
    dd1.innerHTML =
      '<span class="zsma-privacy">' + (seed.default_privacy_level || 'private_only') + '</span>';
    dl.appendChild(dt1);
    dl.appendChild(dd1);
    (seed.privacy_levels || []).forEach(function (p) {
      var dt = document.createElement('dt');
      dt.textContent = p;
      var dd = document.createElement('dd');
      dd.textContent = p === 'private_only' ? 'Default — safest' : 'Requires human gate';
      dl.appendChild(dt);
      dl.appendChild(dd);
    });

    var entries = seed.story_entries || [];
    $('zsmaDraftViewer').textContent =
      entries.length === 0
        ? 'No stories in seed — placeholders only.'
        : JSON.stringify(entries, null, 2);

    var drp = $('zsmaDrpList');
    drp.textContent = '';
    (seed.drp_guardian_rules || []).forEach(function (rule) {
      var li = document.createElement('li');
      li.textContent = rule;
      drp.appendChild(li);
    });

    $('zsmaAdminSummary').innerHTML =
      '<p><strong>Public status:</strong> ' +
      (seed.public_status || 'private') +
      '</p>' +
      '<p><strong>Sisters:</strong> ' +
      (seed.sisters || []).length +
      '</p>' +
      '<p><strong>Story entries:</strong> ' +
      entries.length +
      ' (seed empty by design)</p>' +
      '<p><strong>Forbidden runtime:</strong> ' +
      (seed.forbidden_runtime || []).join(', ') +
      '</p>';
  }

  function showError(msg) {
    var el = $('zsmaError');
    if (!el) return;
    if (msg) {
      el.textContent = msg;
      el.hidden = false;
    } else {
      el.textContent = '';
      el.hidden = true;
    }
  }

  function load() {
    showError('');
    return fetchSeed()
      .then(function (seed) {
        applyStaticLabels();
        renderSeed(seed);
      })
      .catch(function (err) {
        showError(
          (err && err.message ? err.message : String(err)) +
            ' — Serve hub over http:// and ensure data/z_sma_story_seed.json exists.'
        );
      });
  }

  function init() {
    var sel = $('zsmaLangSelect');
    if (sel) {
      sel.addEventListener('change', function () {
        state.lang = sel.value;
        applyStaticLabels();
        if (state.seed) renderSeed(state.seed);
      });
    }
    var btn = $('zsmaRefresh');
    if (btn) btn.addEventListener('click', load);
    load();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
