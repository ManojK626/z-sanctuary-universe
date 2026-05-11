// Z: interface/z_accessibility.js
// Lightweight TTS + multilingual UI toggle (label-based).
(function () {
  const LANG_KEY = 'zLang';
  const VOICE_KEY = 'zVoiceSettings';
  const BAR_ID = 'zAccessibilityBar';
  const DEFAULT_LANG = 'en';
  const LANGS = [
    { id: 'en', label: 'English' },
    { id: 'fr', label: 'Français' },
    { id: 'es', label: 'Español' },
    { id: 'pt', label: 'Português' },
    { id: 'ar', label: 'العربية' },
    { id: 'hi', label: 'हिन्दी' },
    { id: 'sw', label: 'Kiswahili' },
  ];
  const speechTranslationCache = new Map();
  let translationStatus = 'idle';

  const DICT = {
    en: {},
    fr: {
      'Master Control': 'Contrôle maître',
      'Autopilot Status': 'Statut Autopilot',
      'Insight Lab': 'Laboratoire d’analyse',
      'Panel Directory': 'Répertoire des panneaux',
      'Chronicle Feed': 'Fil Chronique',
      'Social Arena': 'Arène sociale',
      'Trust Certificate': 'Certificat de confiance',
      'Health Certificate': 'Certificat de santé',
      'Z Sanctuary Safety & Care': 'Sécurité et soin Z‑Sanctuary',
    },
    es: {
      'Master Control': 'Control maestro',
      'Autopilot Status': 'Estado de Autopiloto',
      'Insight Lab': 'Laboratorio de análisis',
      'Panel Directory': 'Directorio de paneles',
      'Chronicle Feed': 'Registro crónica',
      'Social Arena': 'Arena social',
      'Trust Certificate': 'Certificado de confianza',
      'Health Certificate': 'Certificado de salud',
      'Z Sanctuary Safety & Care': 'Seguridad y cuidado Z‑Sanctuary',
    },
    pt: {
      'Master Control': 'Controle mestre',
      'Autopilot Status': 'Status do Autopilot',
      'Insight Lab': 'Laboratório de análise',
      'Panel Directory': 'Diretório de painéis',
      'Chronicle Feed': 'Feed da crônica',
      'Social Arena': 'Arena social',
      'Trust Certificate': 'Certificado de confiança',
      'Health Certificate': 'Certificado de saúde',
      'Z Sanctuary Safety & Care': 'Segurança e cuidado Z‑Sanctuary',
    },
    ar: {
      'Master Control': 'التحكم الرئيسي',
      'Autopilot Status': 'حالة الطيار الآلي',
      'Insight Lab': 'مختبر التحليل',
      'Panel Directory': 'دليل اللوحات',
      'Chronicle Feed': 'سجل اليوميات',
      'Social Arena': 'الساحة الاجتماعية',
      'Trust Certificate': 'شهادة الثقة',
      'Health Certificate': 'شهادة الصحة',
      'Z Sanctuary Safety & Care': 'رعاية وأمان ملاذ Z',
    },
    hi: {
      'Master Control': 'मास्टर कंट्रोल',
      'Autopilot Status': 'ऑटोपायलट स्थिति',
      'Insight Lab': 'इनसाइट लैब',
      'Panel Directory': 'पैनल डायरेक्टरी',
      'Chronicle Feed': 'क्रॉनिकल फीड',
      'Social Arena': 'सामाजिक क्षेत्र',
      'Trust Certificate': 'विश्वास प्रमाणपत्र',
      'Health Certificate': 'स्वास्थ्य प्रमाणपत्र',
      'Z Sanctuary Safety & Care': 'Z‑Sanctuary सुरक्षा और देखभाल',
    },
    sw: {
      'Master Control': 'Udhibiti Mkuu',
      'Autopilot Status': 'Hali ya Autopilot',
      'Insight Lab': 'Maabara ya uchambuzi',
      'Panel Directory': 'Saraka ya paneli',
      'Chronicle Feed': 'Mlisho wa kumbukumbu',
      'Social Arena': 'Uwanja wa jamii',
      'Trust Certificate': 'Cheti cha Uaminifu',
      'Health Certificate': 'Cheti cha Afya',
      'Z Sanctuary Safety & Care': 'Usalama na Uangalizi wa Z‑Sanctuary',
    },
  };

  function getLang() {
    try {
      return localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
    } catch (err) {
      return DEFAULT_LANG;
    }
  }

  function setLang(lang) {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (err) {
      // ignore
    }
  }

  function pageKey() {
    return `${VOICE_KEY}:${window.location.pathname}`;
  }

  function getVoiceSettings() {
    try {
      const raw = localStorage.getItem(pageKey());
      if (!raw) return { enabled: true, rate: 1.0, pitch: 1.0 };
      return JSON.parse(raw);
    } catch (err) {
      return { enabled: true, rate: 1.0, pitch: 1.0 };
    }
  }

  function setVoiceSettings(next) {
    try {
      localStorage.setItem(pageKey(), JSON.stringify(next));
    } catch (err) {
      // ignore
    }
  }

  function translateNode(node, lang) {
    const key = node.dataset.i18n || node.textContent.trim();
    if (!key) return;
    const map = DICT[lang] || {};
    node.textContent = map[key] || key;
  }

  function applyTranslations(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n], button, label, h1, h2, h3, h4').forEach((node) => {
      translateNode(node, lang);
    });
  }

  function resolveSpeechLang(lang) {
    const map = {
      en: 'en-US',
      fr: 'fr-FR',
      es: 'es-ES',
      pt: 'pt-PT',
      ar: 'ar-SA',
      hi: 'hi-IN',
      sw: 'sw-KE',
    };
    return map[lang] || 'en-US';
  }

  function pickVoiceForLang(langCode) {
    if (!window.speechSynthesis?.getVoices) return null;
    const voices = window.speechSynthesis.getVoices() || [];
    if (!voices.length) return null;
    const short = String(langCode || '')
      .toLowerCase()
      .split('-')[0];
    return (
      voices.find(
        (v) => String(v.lang || '').toLowerCase() === String(langCode || '').toLowerCase()
      ) ||
      voices.find((v) =>
        String(v.lang || '')
          .toLowerCase()
          .startsWith(`${short}-`)
      ) ||
      voices.find((v) =>
        String(v.lang || '')
          .toLowerCase()
          .startsWith(short)
      ) ||
      voices.find((v) =>
        String(v.lang || '')
          .toLowerCase()
          .startsWith('en-')
      ) ||
      voices[0]
    );
  }

  function baseLang(lang) {
    return String(lang || '')
      .toLowerCase()
      .split('-')[0];
  }

  function likelyNonEnglishText(text) {
    const sample = String(text || '').slice(0, 500);
    if (!sample) return false;
    let nonAscii = 0;
    for (const ch of sample) {
      if ((ch.charCodeAt(0) || 0) > 127) nonAscii += 1;
    }
    return nonAscii / sample.length > 0.08;
  }

  function splitForTranslation(text, maxLen = 420) {
    const normalized = String(text || '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!normalized) return [];
    if (normalized.length <= maxLen) return [normalized];
    const parts = [];
    let current = '';
    normalized.split(/([.!?]\s+)/).forEach((piece) => {
      if (!piece) return;
      if ((current + piece).length <= maxLen) {
        current += piece;
        return;
      }
      if (current) parts.push(current.trim());
      if (piece.length <= maxLen) {
        current = piece;
        return;
      }
      for (let i = 0; i < piece.length; i += maxLen) {
        parts.push(piece.slice(i, i + maxLen).trim());
      }
      current = '';
    });
    if (current.trim()) parts.push(current.trim());
    return parts.filter(Boolean);
  }

  async function fetchWithTimeout(url, timeoutMs = 4000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }

  async function translateChunk(text, targetLang) {
    const to = baseLang(targetLang);
    if (!text || !to || to === 'en') return text;
    const cacheKey = `${to}|${text}`;
    if (speechTranslationCache.has(cacheKey)) return speechTranslationCache.get(cacheKey);
    try {
      const query = encodeURIComponent(text);
      const url = `https://api.mymemory.translated.net/get?q=${query}&langpair=en|${encodeURIComponent(to)}`;
      const resp = await fetchWithTimeout(url, 4200);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      const translated = String(data?.responseData?.translatedText || '').trim();
      const next = translated || text;
      translationStatus = translated && translated !== text ? 'on' : 'fallback';
      speechTranslationCache.set(cacheKey, next);
      return next;
    } catch {
      translationStatus = 'fallback';
      return text;
    }
  }

  async function translateForSpeech(text, targetLang) {
    const to = baseLang(targetLang);
    if (!text || to === 'en') {
      translationStatus = 'idle';
      return text;
    }
    if (likelyNonEnglishText(text)) {
      translationStatus = 'native';
      return text;
    }
    const chunks = splitForTranslation(text, 420).slice(0, 8);
    if (!chunks.length) {
      translationStatus = 'fallback';
      return text;
    }
    const translated = await Promise.all(chunks.map((chunk) => translateChunk(chunk, to)));
    const joined = translated.join(' ').trim();
    if (!joined) {
      translationStatus = 'fallback';
      return text;
    }
    return joined;
  }

  function renderTranslationStatus() {
    const chip = document.querySelector('[data-role="translate-status"]');
    if (!chip) return;
    chip.classList.remove('is-on', 'is-fallback', 'is-idle', 'is-native');
    let label = 'Translate: --';
    if (translationStatus === 'on') {
      label = 'Translate: On';
      chip.classList.add('is-on');
    } else if (translationStatus === 'fallback') {
      label = 'Translate: Fallback';
      chip.classList.add('is-fallback');
    } else if (translationStatus === 'native') {
      label = 'Translate: Native';
      chip.classList.add('is-native');
    } else {
      label = 'Translate: Idle';
      chip.classList.add('is-idle');
    }
    chip.textContent = label;
  }

  async function speak(text) {
    if (!text || !window.speechSynthesis) return;
    const settings = getVoiceSettings();
    if (!settings.enabled) return;
    const selectedLang = getLang();
    const spokenText = await translateForSpeech(text, selectedLang);
    const utter = new SpeechSynthesisUtterance(spokenText);
    const speechLang = resolveSpeechLang(selectedLang);
    const voice = pickVoiceForLang(speechLang);
    utter.lang = speechLang;
    if (voice) utter.voice = voice;
    utter.rate = Math.max(0.6, Math.min(2.0, Number(settings.rate) || 1.0));
    utter.pitch = Math.max(0.75, Math.min(1.4, Number(settings.pitch) || 1.0));
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    renderTranslationStatus();
  }

  function ensureHlmsStyles() {
    if (!document.head) return;
    const existing = document.head.querySelector('link[href="/interface/z_hlms_bundle.css"]');
    if (!existing) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/interface/z_hlms_bundle.css';
      document.head.appendChild(link);
    }
    document.body?.classList.add('hlms-page');
  }

  function readSelection() {
    const selection = window.getSelection()?.toString();
    if (selection) {
      void speak(selection);
    } else {
      void speak(document.body.innerText.slice(0, 1200));
    }
  }

  function readPage() {
    void speak(document.body.innerText.slice(0, 2000));
  }

  function buildBar() {
    if (document.getElementById(BAR_ID)) return;
    const voiceSettings = getVoiceSettings();
    const bar = document.createElement('div');
    bar.id = BAR_ID;
    bar.className = 'z-accessibility-bar';
    bar.innerHTML = `
      <span class="z-accessibility-label">Voice</span>
      <label class="z-accessibility-toggle"><input type="checkbox" data-act="voice" />On</label>
      <button type="button" data-act="read">Read Page</button>
      <button type="button" data-act="select">Read Selection</button>
      <button type="button" data-act="stop">Stop</button>
      <span class="z-accessibility-chip is-idle" data-role="translate-status">Translate: Idle</span>
      <span class="z-accessibility-label">Speed</span>
      <select data-act="rate">
        <option value="0.75">0.75x</option>
        <option value="0.9">0.9x</option>
        <option value="1">1x</option>
        <option value="1.15">1.15x</option>
        <option value="1.3">1.3x</option>
        <option value="1.5">1.5x</option>
      </select>
      <select data-act="pitch">
        <option value="0.85">Soft</option>
        <option value="1">Normal</option>
        <option value="1.15">Bright</option>
      </select>
      <span class="z-accessibility-label">Lang</span>
      <select data-act="lang"></select>
    `;
    const langSelect = bar.querySelector('[data-act="lang"]');
    LANGS.forEach((item) => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = item.label;
      langSelect.appendChild(option);
    });
    langSelect.value = getLang();
    const rateSelect = bar.querySelector('[data-act="rate"]');
    const pitchSelect = bar.querySelector('[data-act="pitch"]');
    if (rateSelect.querySelector(`option[value="${voiceSettings.rate}"]`)) {
      rateSelect.value = String(voiceSettings.rate);
    } else {
      rateSelect.value = '1';
    }
    if (pitchSelect.querySelector(`option[value="${voiceSettings.pitch}"]`)) {
      pitchSelect.value = String(voiceSettings.pitch);
    } else {
      pitchSelect.value = '1';
    }
    const voiceToggle = bar.querySelector('[data-act="voice"]');
    voiceToggle.checked = voiceSettings.enabled;
    bar.addEventListener('click', (event) => {
      const btn = event.target.closest('button[data-act]');
      if (!btn) return;
      const action = btn.dataset.act;
      if (action === 'read') readPage();
      if (action === 'select') readSelection();
      if (action === 'stop' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    });
    langSelect.addEventListener('change', () => {
      const lang = langSelect.value;
      setLang(lang);
      applyTranslations(lang);
      translationStatus = baseLang(lang) === 'en' ? 'idle' : 'native';
      renderTranslationStatus();
    });
    voiceToggle.addEventListener('change', () => {
      const next = { ...getVoiceSettings(), enabled: voiceToggle.checked };
      setVoiceSettings(next);
    });
    rateSelect.addEventListener('change', () => {
      const next = { ...getVoiceSettings(), rate: parseFloat(rateSelect.value) };
      setVoiceSettings(next);
    });
    pitchSelect.addEventListener('change', () => {
      const next = { ...getVoiceSettings(), pitch: parseFloat(pitchSelect.value) };
      setVoiceSettings(next);
    });
    document.body.appendChild(bar);
    renderTranslationStatus();
  }

  function init() {
    ensureHlmsStyles();
    // Auto-load pointer compass navigator unless page explicitly opts out.
    if (!document.body?.hasAttribute('data-disable-auto-compass')) {
      const existing = Array.from(document.scripts || []).some((s) =>
        String(s.src || '').includes('/interface/z_auto_compass.js')
      );
      if (!existing) {
        const script = document.createElement('script');
        script.src = '/interface/z_auto_compass.js';
        script.defer = true;
        document.body.appendChild(script);
      }
    }
    buildBar();
    applyTranslations(getLang());
    if (window.speechSynthesis && 'onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Keep voices refreshed so selected language can resolve correctly.
        pickVoiceForLang(resolveSpeechLang(getLang()));
      };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
