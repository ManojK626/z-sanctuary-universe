/**
 * Z-SMA-1 / Z-SMA-1A — True Human Experience Sanctuary (read-only Turtle seed).
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
      private_strip:
        'Tou lane default private_only. Pa save istwar depi sa page. Consent imen dabord.',
      export_preview_title: 'Preview receipt (read-only)',
      consent_not_recorded: 'Consent pa ankor anrezistre',
      consent_pending: 'Consent an atant review',
      consent_granted: 'Consent anrezistre',
      consent_declined: 'Consent refize',
      consent_revoked: 'Consent revoke',
      privacy_private_only: 'Private selman — default, pli sir',
      privacy_family_only: 'Family selman — human gate obligatoire',
      privacy_review_candidate: 'Review candidate — admin selman',
      privacy_public_candidate: 'Public candidate — pa approve',
      privacy_approved_public: 'Approved public — sign-off imen eksplisit',
      display_lang: 'Langaz display',
      draft_empty: 'Pa ena istwar dan seed — placeholder selman.',
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
      private_strip:
        'All lanes default to private_only. No stories are saved from this page. Human consent comes first.',
      export_preview_title: 'Receipt preview (read-only)',
      consent_not_recorded: 'Consent not yet recorded',
      consent_pending: 'Consent pending review',
      consent_granted: 'Consent recorded',
      consent_declined: 'Consent declined',
      consent_revoked: 'Consent revoked',
      privacy_private_only: 'Private only — default, safest',
      privacy_family_only: 'Family only — human gate required',
      privacy_review_candidate: 'Review candidate — admin only',
      privacy_public_candidate: 'Public candidate — not approved',
      privacy_approved_public: 'Approved public — explicit human sign-off',
      display_lang: 'Display language',
      draft_empty: 'No stories in seed — placeholders only.',
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
      private_strip:
        'Toutes les lanes sont private_only par défaut. Aucune histoire n’est enregistrée ici. Le consentement humain d’abord.',
      export_preview_title: 'Aperçu du reçu (lecture seule)',
      consent_not_recorded: 'Consentement pas encore enregistré',
      consent_pending: 'Consentement en attente de revue',
      consent_granted: 'Consentement enregistré',
      consent_declined: 'Consentement refusé',
      consent_revoked: 'Consentement révoqué',
      privacy_private_only: 'Privé seulement — défaut, le plus sûr',
      privacy_family_only: 'Famille seulement — gate humain requis',
      privacy_review_candidate: 'Candidat revue — admin seulement',
      privacy_public_candidate: 'Candidat public — non approuvé',
      privacy_approved_public: 'Public approuvé — sign-off humain explicite',
      display_lang: 'Langue d’affichage',
      draft_empty: 'Aucune histoire dans la graine — placeholders seulement.',
    },
  };

  var LANG_OPTION_LABELS = {
    moris_kreol: 'Moris Kreol — lang maternel',
    english: 'English — display language',
    french: 'Français — langue d’affichage',
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

  var CONSENT_LABEL_KEYS = {
    not_recorded: 'consent_not_recorded',
    pending: 'consent_pending',
    pending_review: 'consent_pending',
    granted: 'consent_granted',
    recorded: 'consent_granted',
    declined: 'consent_declined',
    revoked: 'consent_revoked',
  };

  var PRIVACY_LABEL_KEYS = {
    private_only: 'privacy_private_only',
    family_only: 'privacy_family_only',
    review_candidate: 'privacy_review_candidate',
    public_candidate: 'privacy_public_candidate',
    approved_public: 'privacy_approved_public',
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

  function consentBadge(status) {
    var key = status || 'not_recorded';
    var labelKey = CONSENT_LABEL_KEYS[key] || 'consent_not_recorded';
    var safeClass = key.replace(/[^a-z0-9_]/gi, '_');
    return (
      '<span class="zsma-consent-badge zsma-consent-' +
      safeClass +
      '">' +
      t(labelKey) +
      '</span>'
    );
  }

  function privacyBadgeShort(level) {
    var key = level || 'private_only';
    return '<span class="zsma-privacy-badge zsma-privacy-' + key + '">' + key + '</span>';
  }

  function privacyRow(level) {
    var key = level || 'private_only';
    var labelKey = PRIVACY_LABEL_KEYS[key] || 'privacy_private_only';
    return (
      privacyBadgeShort(key) + '<span class="zsma-privacy-desc">' + t(labelKey) + '</span>'
    );
  }

  function buildExportReceiptPreview(seed) {
    var entries = seed.story_entries || [];
    return {
      receipt_type: 'z_sma_export_preview_readonly',
      phase: 'Z-SMA-1A',
      preview_only: true,
      auto_export: false,
      storage: false,
      ai_calls: false,
      generated_at_display: new Date().toISOString(),
      seed_schema: seed.schema,
      seed_phase: seed.phase,
      default_privacy_level: seed.default_privacy_level || 'private_only',
      public_status: seed.public_status,
      sisters_count: (seed.sisters || []).length,
      story_entries_count: entries.length,
      export_path: 'data/z_sma_story_seed.json',
      forbidden_runtime: seed.forbidden_runtime || [],
      note: 'Preview only — no download, no storage, no AI, no real stories',
    };
  }

  function updateLangSelectLabels() {
    var sel = $('zsmaLangSelect');
    if (!sel) return;
    Array.prototype.forEach.call(sel.options, function (opt) {
      if (LANG_OPTION_LABELS[opt.value]) opt.textContent = LANG_OPTION_LABELS[opt.value];
    });
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
    $('zsmaLangLabel').textContent = t('lang_label') + ' · ' + t('display_lang');
    $('zsmaRefresh').textContent = t('refresh');
    var strip = $('zsmaPrivateStripText');
    if (strip) strip.textContent = t('private_strip');
    updateLangSelectLabels();
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
        '<div class="zsma-card-badges">' +
        consentBadge(s.consent_status) +
        privacyBadgeShort(s.privacy_level) +
        '</div>' +
        '<h3>' +
        (s.display_name_placeholder || s.sister_id) +
        '</h3>' +
        '<p class="zsma-mono">' +
        s.sister_id +
        '</p>' +
        '<p class="zsma-hint">' +
        (s.emotional_boundaries_note || '') +
        '</p>';
      cards.appendChild(card);
    });

    var group = seed.group_lane || {};
    $('zsmaGroupLane').innerHTML =
      '<div class="zsma-card-badges">' +
      consentBadge(group.consent_status) +
      privacyBadgeShort(group.privacy_level) +
      '</div>' +
      '<h3>' +
      (group.label || 'Group lane') +
      '</h3>';

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
    dd1.innerHTML = privacyRow(seed.default_privacy_level || 'private_only');
    dl.appendChild(dt1);
    dl.appendChild(dd1);
    (seed.privacy_levels || []).forEach(function (p) {
      var dt = document.createElement('dt');
      dt.textContent = p;
      var dd = document.createElement('dd');
      dd.innerHTML = privacyRow(p);
      dl.appendChild(dt);
      dl.appendChild(dd);
    });

    var entries = seed.story_entries || [];
    $('zsmaDraftViewer').textContent =
      entries.length === 0 ? t('draft_empty') : JSON.stringify(entries, null, 2);

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

    var preview = $('zsmaExportPreview');
    if (preview) {
      preview.textContent = JSON.stringify(buildExportReceiptPreview(seed), null, 2);
    }
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
