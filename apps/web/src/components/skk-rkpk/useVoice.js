// Z: apps\web\src\components\skk-rkpk\useVoice.js
export function speak(text, opts) {
  if (typeof window === 'undefined') return;
  if (!window.speechSynthesis) return;

  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = (opts && opts.rate) || 1.0;
  utter.pitch = (opts && opts.pitch) || 1.0;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}
