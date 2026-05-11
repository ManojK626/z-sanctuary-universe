// Z: core\social_ui.js
// Social UI interactions
(function () {
  const panel = document.getElementById('zSocialPanel');
  if (!panel || !window.ZSocial) return;
  const profilesEl = document.getElementById('zSocialProfiles');
  const chatEl = document.getElementById('zSocialChat');
  const messageInput = document.getElementById('zSocialMessage');
  const sendBtn = document.getElementById('zSocialSend');
  const tipBtn = document.getElementById('zSocialTip');
  const tipAmount = document.getElementById('zSocialTipAmount');
  const tipNote = document.getElementById('zSocialTipNote');
  const streamStatus = document.getElementById('zSocialStreamStatus');
  const streamBtn = document.getElementById('zSocialStreamToggle');

  function renderProfiles() {
    if (!profilesEl) return;
    const profiles = window.ZSocial.getProfiles();
    profilesEl.innerHTML = '<div class="z-section-title">Profiles</div>';
    profiles.forEach((profile) => {
      const entry = document.createElement('div');
      entry.className = 'z-social-profile';
      entry.innerHTML = `<strong>${profile.name}</strong><span>${profile.bio || 'Quiet warrior'}</span>`;
      profilesEl.appendChild(entry);
    });
    if (!profiles.length) {
      profilesEl.innerHTML += '<div class="z-muted">No teammates yet.</div>';
    }
  }

  function renderChat() {
    if (!chatEl) return;
    const chat = window.ZSocial.getChat();
    chatEl.innerHTML = '';
    chat.slice(-20).forEach((entry) => {
      const row = document.createElement('div');
      row.className = 'z-social-chat-row';
      row.innerHTML = `<span class="z-social-chat-user">${entry.sender}</span><span class="z-social-chat-text">${entry.message}</span>`;
      chatEl.appendChild(row);
    });
    chatEl.scrollTop = chatEl.scrollHeight;
  }

  function sendMessage() {
    const text = messageInput?.value.trim();
    if (!text) return;
    const message = { sender: 'You', message: text, tone: 'positive' };
    window.ZSocial.logChat(message);
    messageInput.value = '';
    renderChat();
  }

  function sendTip() {
    const amount = Number(tipAmount?.value || 0);
    if (!amount || !tipNote?.value.trim()) return;
    window.ZSocial.logTip({ amount, note: tipNote.value.trim(), to: 'community' });
    tipAmount.value = '';
    tipNote.value = '';
    const tipMessage = `+${amount} tipped!`;
    personalToast(tipMessage);
  }

  function personalToast(message) {
    const toast = document.createElement('div');
    toast.className = 'z-social-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2200);
  }

  let streamActive = false;
  function toggleStream() {
    streamActive = !streamActive;
    const state = streamActive ? 'live' : 'offline';
    if (streamStatus) {
      streamStatus.textContent = streamActive
        ? 'Streaming live: Super Saiyan table'
        : 'Stream paused';
    }
    window.ZSocial.setStream({ table: 'Roulette 01', state, viewers: streamActive ? 12 : 0 });
  }

  sendBtn?.addEventListener('click', sendMessage);
  tipBtn?.addEventListener('click', sendTip);
  streamBtn?.addEventListener('click', toggleStream);

  panel.addEventListener('zSocialChatUpdate', renderChat);
  panel.addEventListener('zSocialTip', () => personalToast('Thanks for the tip!'));
  panel.addEventListener('zSocialStreamUpdate', (event) => {
    const detail = event.detail || {};
    streamStatus.textContent = detail.state === 'live' ? 'Live stream active' : 'Stream paused';
  });

  window.addEventListener('zRouletteAlert', (event) => {
    const detail = event.detail || {};
    window.ZSocial.logChat({
      sender: 'Super Ghost',
      message: `${detail.key} ${detail.type} triggered (${detail.count}/${detail.threshold})`,
      tone: 'calm',
      system: true,
    });
  });
  window.addEventListener('zRouletteHistoryImported', (event) => {
    const detail = event.detail || {};
    personalToast(`History ${detail.datasets?.map((d) => d.source).join(', ')} imported.`);
  });

  renderProfiles();
  renderChat();
})();
