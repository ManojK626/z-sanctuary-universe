// Z: Amk_Goku Worldwide Loterry\ui\notebook\basic_notebook.js
const STORAGE_KEY = 'zNotebook.basic.v1';
const GENTLE_KEY = 'zNotebook.gentle';
const PRIVATE_KEY = 'zNotebook.private';
const STATUS_PATH = '../../data/reports/system_status.json';
const LEARNING_HIDE_KEY = 'zNotebook.learning.hide';
const NOTE_TO_LEARNING = {
  rhythm: ['learning.rhythm.basics'],
  feeling: ['learning.feeling.basics'],
  trust: ['learning.trust.basics'],
  jailcell: ['learning.jailcell.basics'],
  kairocell: ['learning.kairocell.basics'],
};

function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveNotes(notes) {
  if (localStorage.getItem(PRIVATE_KEY) === 'true') {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function renderNotes() {
  const list = document.getElementById('notesList');
  if (!list) return;
  if (localStorage.getItem(PRIVATE_KEY) === 'true') {
    list.innerHTML = '<div class="muted">Private Mode is ON. Notes are not stored.</div>';
    return;
  }
  const notes = loadNotes().slice(-20).reverse();
  if (!notes.length) {
    list.innerHTML = '<div class="muted">No notes yet.</div>';
    return;
  }
  list.innerHTML = notes
    .map(
      (n) => `
    <div class="note">
      <div>${escapeHtml(n.text)}</div>
      <small>${n.ts}</small>
    </div>
  `
    )
    .join('');
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('\'', '&#039;');
}

function addNote(text) {
  const notes = loadNotes();
  notes.push({ text, ts: new Date().toISOString() });
  saveNotes(notes);
}

document.addEventListener('DOMContentLoaded', () => {
  renderNotes();
  window.ZNotebookRhythm?.onNotebookOpen?.();

  const gentleToggle = document.getElementById('gentleToggle');
  if (gentleToggle) {
    gentleToggle.checked = localStorage.getItem(GENTLE_KEY) === 'true';
    gentleToggle.addEventListener('change', () => {
      const on = gentleToggle.checked;
      localStorage.setItem(GENTLE_KEY, on ? 'true' : 'false');
      document.dispatchEvent(new Event(on ? 'z:gentle:on' : 'z:gentle:off'));
    });
  }

  const privateToggle = document.getElementById('privateToggle');
  if (privateToggle) {
    privateToggle.checked = localStorage.getItem(PRIVATE_KEY) === 'true';
    privateToggle.addEventListener('change', () => {
      const on = privateToggle.checked;
      localStorage.setItem(PRIVATE_KEY, on ? 'true' : 'false');
      if (on) {
        localStorage.removeItem(STORAGE_KEY);
        renderNotes();
      }
    });
  }

  const trustBtn = document.getElementById('trustPackBtn');
  if (trustBtn) {
    trustBtn.addEventListener('click', () => {
      alert(
        'Trust Pack (read-only):\n' +
          '- Notes are never used for predictions or enforcement.\n' +
          '- Gentle Mode is display-only.\n' +
          '- Private Mode disables storage.'
      );
      window.ZChronicle?.record?.({ source: 'notebook', type: 'TRUST_PACK_VIEWED' });
    });
  }

  updateRhythmPill();

  const btn = document.getElementById('addNoteBtn');
  const input = document.getElementById('noteInput');
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;
    addNote(text);
    input.value = '';
    renderNotes();
    window.ZNotebookRhythm?.onNotebookOpen?.();
    renderLearningForNote(text);
  });

  setupCircleView();
  setupLearningSidebar();
});

async function updateRhythmPill() {
  const pill = document.getElementById('rhythmPill');
  if (!pill) return;
  try {
    const res = await fetch(STATUS_PATH, { cache: 'no-store' });
    const status = await res.json();
    pill.textContent = `Rhythm: ${status?.rhythm_state || '—'}`;
  } catch {
    pill.textContent = 'Rhythm: —';
  }
}

function setupLearningSidebar() {
  const hideBtn = document.getElementById('learningHideBtn');
  const sidebar = document.getElementById('learningSidebar');
  if (!hideBtn || !sidebar) return;

  const hidden = localStorage.getItem(LEARNING_HIDE_KEY) === 'true';
  sidebar.style.display = hidden ? 'none' : 'block';

  hideBtn.addEventListener('click', () => {
    const isHidden = sidebar.style.display === 'none';
    sidebar.style.display = isHidden ? 'block' : 'none';
    localStorage.setItem(LEARNING_HIDE_KEY, isHidden ? 'false' : 'true');
  });
}

async function renderLearningForNote(text) {
  const container = document.getElementById('learningCards');
  if (!container) return;

  const tags = extractTags(text);
  const cards = new Set();
  tags.forEach((tag) => {
    (NOTE_TO_LEARNING[tag] || []).forEach((id) => cards.add(id));
  });

  if (!cards.size) {
    container.innerHTML = 'No related cards yet.';
    return;
  }

  await window.ZLearningRegistryLoad?.();
  const items = [...cards]
    .slice(0, 3)
    .map((id) => window.ZLearningRegistryGet?.(id) || window.ZLearningRegistry?.[id])
    .filter(Boolean);
  container.innerHTML = items
    .map(
      (card) => `
    <div class="note">
      <div><strong>${card.title}</strong></div>
      <div class="muted">${card.summary}</div>
      <div><a href="#" onclick="openLearningCard('${card.id}')">Why?</a></div>
    </div>
  `
    )
    .join('');
}

function extractTags(text) {
  const out = new Set();
  const lower = (text || '').toLowerCase();
  if (lower.includes('rhythm')) out.add('rhythm');
  if (lower.includes('feel')) out.add('feeling');
  if (lower.includes('trust')) out.add('trust');
  if (lower.includes('jail')) out.add('jailcell');
  if (lower.includes('kairo')) out.add('kairocell');
  return [...out];
}

async function setupCircleView() {
  const circleBox = document.getElementById('circleBox');
  const select = document.getElementById('circleSelect');
  const notesEl = document.getElementById('circleNotes');
  const learningEl = document.getElementById('circleLearning');
  const promptEl = document.getElementById('circlePrompt');
  const syncBtn = document.getElementById('circleSyncBtn');
  if (!circleBox || !select || !notesEl || !syncBtn || !learningEl || !promptEl) return;

  if (!window.ZCircles?.bootstrap) {
    notesEl.textContent = 'Circles not available.';
    return;
  }

  await window.ZCircles.bootstrap();
  const circles = window.ZCircles.listCircles?.() || [];
  if (!circles.length) {
    notesEl.textContent = 'No circles available.';
    return;
  }

  select.innerHTML = circles.map((c) => `<option value="${c.id}">${c.name}</option>`).join('');
  select.value = circles[0].id;
  syncBtn.disabled = false;

  const renderCircleNotes = () => {
    const circleId = select.value;
    const notes = window.ZCircles.listNotes?.(circleId) || [];
    if (!notes.length) {
      notesEl.innerHTML = '<div class="muted">No circle notes yet.</div>';
      return;
    }
    notesEl.innerHTML = notes
      .slice(-10)
      .reverse()
      .map(
        (n) => `
      <div class="note">
        <div>${escapeHtml(n.text || '')}</div>
        <small>${n.ts} · ${n.author || 'circle'}</small>
      </div>
    `
      )
      .join('');
  };

  const renderCircleLearning = async () => {
    const circleId = select.value;
    const pack = window.ZCircles.getLearningPack?.(circleId);
    if (!pack) {
      learningEl.innerHTML = '<div class="muted">No learning pack attached.</div>';
      promptEl.textContent = '';
      return;
    }

    await window.ZLearningRegistryLoad?.();
    const cards = (pack.learning_pack || [])
      .map((id) => window.ZLearningRegistryGet?.(id) || window.ZLearningRegistry?.[id])
      .filter(Boolean);

    learningEl.innerHTML = cards
      .map(
        (card) => `
      <div class="note">
        <div><strong>${card.title}</strong></div>
        <div class="muted">${card.summary}</div>
        <div><a href="#" onclick="openLearningCard('${card.id}')">Why?</a></div>
      </div>
    `
      )
      .join('');

    const prompt = await loadCirclePrompt();
    promptEl.textContent = prompt ? `Prompt: ${prompt.text}` : '';
  };

  select.addEventListener('change', renderCircleNotes);
  select.addEventListener('change', renderCircleLearning);
  renderCircleNotes();
  renderCircleLearning();

  syncBtn.addEventListener('click', () => {
    const notes = loadNotes();
    const last = notes[notes.length - 1];
    if (!last) return;
    const circleId = select.value;
    window.ZCircles.addNote?.(circleId, last.text, 'AMK', 'reflection', ['#gentle']);
    renderCircleNotes();
  });
}

async function loadCirclePrompt() {
  try {
    const res = await fetch('../../data/learning/circle_prompts.json', { cache: 'no-store' });
    if (!res.ok) return null;
    const payload = await res.json();
    const prompts = payload.prompts || [];
    return prompts[0] || null;
  } catch {
    return null;
  }
}
