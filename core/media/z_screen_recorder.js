// Z: core\media\z_screen_recorder.js
// Screen recorder with consent and audio options.
(function () {
  const consentEl = document.getElementById('zRecorderConsent');
  const includeSystemEl = document.getElementById('zRecorderIncludeSystem');
  const includeMicEl = document.getElementById('zRecorderIncludeMic');
  const requireUnlockEl = document.getElementById('zRecorderRequireUnlock');
  const unlockInputEl = document.getElementById('zRecorderUnlockInput');
  const autoStopEl = document.getElementById('zRecorderAutoStop');
  const startBtn = document.getElementById('zRecorderStartBtn');
  const stopBtn = document.getElementById('zRecorderStopBtn');
  const snapshotBtn = document.getElementById('zRecorderSnapshotBtn');
  const muteMicBtn = document.getElementById('zRecorderMuteMicBtn');
  const statusEl = document.getElementById('zRecorderStatus');
  const timerEl = document.getElementById('zRecorderTimer');

  if (!startBtn || !stopBtn || !snapshotBtn) return;

  let displayStream = null;
  let micStream = null;
  let recorder = null;
  let chunks = [];
  let audioContext = null;
  let timerId = null;
  let autoStopId = null;
  let startTime = null;
  let videoEl = null;
  let micTrack = null;

  function updateStartState() {
    const consentOk = !consentEl || consentEl.checked;
    const unlockOk =
      !requireUnlockEl || !requireUnlockEl.checked || (unlockInputEl && unlockInputEl.value.trim());
    const isRecording = recorder && recorder.state === 'recording';
    startBtn.disabled = !consentOk || !unlockOk || isRecording;
  }

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function formatTime(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const minutes = String(Math.floor(total / 60)).padStart(2, '0');
    const seconds = String(total % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  function updateTimer() {
    if (!timerEl || !startTime) return;
    timerEl.textContent = formatTime(Date.now() - startTime);
  }

  function resetTimer() {
    if (timerId) clearInterval(timerId);
    timerId = null;
    startTime = null;
    if (timerEl) timerEl.textContent = '00:00';
  }

  function stopTracks(stream) {
    if (!stream) return;
    stream.getTracks().forEach((track) => track.stop());
  }

  function pickMimeType() {
    const candidates = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
    return (
      candidates.find((type) => window.MediaRecorder && MediaRecorder.isTypeSupported(type)) || ''
    );
  }

  async function startRecording() {
    updateStartState();
    if (startBtn.disabled) {
      setStatus('Consent or unlock required.');
      return;
    }
    if (recorder && recorder.state === 'recording') return;
    if (consentEl && !consentEl.checked) {
      setStatus('Consent required.');
      return;
    }
    if (requireUnlockEl && requireUnlockEl.checked) {
      if (!unlockInputEl || !unlockInputEl.value.trim()) {
        setStatus('Unlock required.');
        return;
      }
    }

    try {
      const includeSystem = includeSystemEl && includeSystemEl.checked;
      const includeMic = includeMicEl && includeMicEl.checked;

      displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: includeSystem,
      });

      const audioTracks = [];
      if (includeSystem) {
        audioTracks.push(...displayStream.getAudioTracks());
      }

      if (includeMic) {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micTrack = micStream.getAudioTracks()[0] || null;
        if (micTrack) audioTracks.push(micTrack);
      }

      let finalStream = displayStream;
      if (audioTracks.length > 1) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const destination = audioContext.createMediaStreamDestination();
        audioTracks.forEach((track) => {
          const source = audioContext.createMediaStreamSource(new MediaStream([track]));
          source.connect(destination);
        });
        finalStream = new MediaStream([
          ...displayStream.getVideoTracks(),
          ...destination.stream.getAudioTracks(),
        ]);
      } else if (audioTracks.length === 1) {
        finalStream = new MediaStream([...displayStream.getVideoTracks(), audioTracks[0]]);
      }

      const mimeType = pickMimeType();
      recorder = new MediaRecorder(finalStream, mimeType ? { mimeType } : undefined);
      chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType || 'video/webm' });
        const url = URL.createObjectURL(blob);
        const stamp = new Date().toISOString().replace(/[:.]/g, '-');
        const link = document.createElement('a');
        link.href = url;
        link.download = `z_screen_recording_${stamp}.webm`;
        link.click();
        URL.revokeObjectURL(url);
        chunks = [];
      };

      recorder.start(1000);
      startTime = Date.now();
      timerId = setInterval(updateTimer, 1000);
      setStatus('Recording...');
      stopBtn.disabled = false;
      updateStartState();

      const autoStop = autoStopEl ? parseInt(autoStopEl.value, 10) : 0;
      if (autoStop && Number.isFinite(autoStop)) {
        if (autoStopId) clearTimeout(autoStopId);
        autoStopId = setTimeout(stopRecording, autoStop * 60 * 1000);
      }
    } catch (err) {
      setStatus('Recording failed.');
      stopRecording({ keepStatus: true });
    }
  }

  function stopRecording(options = {}) {
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    }
    stopTracks(displayStream);
    stopTracks(micStream);
    displayStream = null;
    micStream = null;
    micTrack = null;
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
    if (autoStopId) clearTimeout(autoStopId);
    autoStopId = null;
    resetTimer();
    if (!options.keepStatus) {
      setStatus('Idle');
    }
    stopBtn.disabled = true;
    updateStartState();
  }

  async function captureSnapshot() {
    if (!displayStream) {
      setStatus('Start recording to capture a snapshot.');
      return;
    }
    const videoTrack = displayStream.getVideoTracks()[0];
    if (!videoTrack) return;
    try {
      if (window.ImageCapture) {
        const capture = new ImageCapture(videoTrack);
        const bitmap = await capture.grabFrame();
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bitmap, 0, 0);
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const stamp = new Date().toISOString().replace(/[:.]/g, '-');
          const link = document.createElement('a');
          link.href = url;
          link.download = `z_snapshot_${stamp}.png`;
          link.click();
          URL.revokeObjectURL(url);
        }, 'image/png');
      } else {
        if (!videoEl) {
          videoEl = document.createElement('video');
          videoEl.srcObject = displayStream;
          videoEl.muted = true;
          await videoEl.play();
        }
        const canvas = document.createElement('canvas');
        canvas.width = videoEl.videoWidth || 1280;
        canvas.height = videoEl.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const stamp = new Date().toISOString().replace(/[:.]/g, '-');
          const link = document.createElement('a');
          link.href = url;
          link.download = `z_snapshot_${stamp}.png`;
          link.click();
          URL.revokeObjectURL(url);
        }, 'image/png');
      }
      setStatus('Snapshot saved.');
    } catch (err) {
      setStatus('Snapshot failed.');
    }
  }

  function toggleMicMute() {
    if (!micTrack) {
      setStatus('Mic not active.');
      return;
    }
    micTrack.enabled = !micTrack.enabled;
    muteMicBtn.textContent = micTrack.enabled ? 'Mute Mic' : 'Unmute Mic';
  }

  startBtn.addEventListener('click', startRecording);
  stopBtn.addEventListener('click', stopRecording);
  snapshotBtn.addEventListener('click', captureSnapshot);
  muteMicBtn.addEventListener('click', toggleMicMute);

  if (consentEl) consentEl.addEventListener('change', updateStartState);
  if (requireUnlockEl) requireUnlockEl.addEventListener('change', updateStartState);
  if (unlockInputEl) unlockInputEl.addEventListener('input', updateStartState);

  stopBtn.disabled = true;
  updateStartState();
  setStatus('Idle');

  window.ZScreenRecorder = {
    start: startRecording,
    stop: stopRecording,
    snapshot: captureSnapshot,
  };
})();
