// Z: core\z_wisdom_ring_panel.js
// Wisdom Ring panel: timeline, acknowledgements, exports.
(function () {
  const listEl = document.getElementById('zWisdomList');
  const refreshBtn = document.getElementById('zWisdomRefreshBtn');
  const exportWeekBtn = document.getElementById('zWisdomExportWeekBtn');
  const exportAllBtn = document.getElementById('zWisdomExportAllBtn');

  if (!listEl) return;

  const ACK_KEY = 'zWisdomAcknowledged';

  function loadAck() {
    try {
      const raw = localStorage.getItem(ACK_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      return {};
    }
  }

  function saveAck(ack) {
    try {
      localStorage.setItem(ACK_KEY, JSON.stringify(ack));
    } catch (err) {
      // ignore
    }
  }

  function noteId(note) {
    return String(note.t || note.timestamp || '');
  }

  function formatTime(ts) {
    if (!ts) return '';
    return new Date(ts).toLocaleString();
  }

  function getNotes() {
    const notes = window.ZWisdomRing?.getNotes?.() || [];
    return notes.slice().sort((a, b) => (b.t || 0) - (a.t || 0));
  }

  function render() {
    const notes = getNotes();
    const ack = loadAck();
    listEl.innerHTML = '';

    if (!notes.length) {
      const empty = document.createElement('div');
      empty.className = 'z-muted';
      empty.textContent = 'No wisdom notes yet.';
      listEl.appendChild(empty);
      return;
    }

    notes.slice(0, 12).forEach((note) => {
      const item = document.createElement('div');
      item.className = 'z-wisdom-item';
      const id = noteId(note);
      const isAcked = !!ack[id];

      item.innerHTML = `
        <div class="z-wisdom-meta">
          <span class="z-wisdom-context">${note.context || 'wisdom'}</span>
          <span class="z-wisdom-time">${formatTime(note.t)}</span>
        </div>
        <div class="z-wisdom-lesson">${note.lesson || 'Wisdom noted.'}</div>
        <div class="z-wisdom-footer">
          <span class="z-wisdom-confidence">Confidence: ${Math.round((note.confidence || 0) * 100)}%</span>
        </div>
      `;

      const actionRow = document.createElement('div');
      actionRow.className = 'z-wisdom-actions-row';

      if (isAcked) {
        const tag = document.createElement('span');
        tag.className = 'z-wisdom-ack';
        tag.textContent = 'Acknowledged';
        actionRow.appendChild(tag);
      } else {
        const ackBtn = document.createElement('button');
        ackBtn.type = 'button';
        ackBtn.className = 'z-wisdom-action';
        ackBtn.textContent = 'Acknowledge';
        ackBtn.addEventListener('click', () => {
          const next = loadAck();
          next[id] = true;
          saveAck(next);
          render();
        });
        actionRow.appendChild(ackBtn);
      }

      item.appendChild(actionRow);
      listEl.appendChild(item);
    });
  }

  function exportNotes(notes, filename) {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportWeekly() {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const notes = getNotes().filter((note) => (note.t || 0) >= weekAgo);
    exportNotes(notes, 'z_wisdom_weekly.json');
  }

  function exportAll() {
    exportNotes(getNotes(), 'z_wisdom_notes.json');
  }

  if (refreshBtn) refreshBtn.addEventListener('click', render);
  if (exportWeekBtn) exportWeekBtn.addEventListener('click', exportWeekly);
  if (exportAllBtn) exportAllBtn.addEventListener('click', exportAll);

  render();
  setInterval(render, 30000);
})();
