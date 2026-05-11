function tone(score) {
  if (score >= 80) return 'calm';
  if (score >= 60) return 'alert';
  if (score >= 40) return 'tense';
  return 'critical';
}

function render(score) {
  const chip = document.getElementById('harishaChip');
  if (!chip) return;
  chip.textContent = `Harisha Score: ${score}`;
  chip.className = `harisha-chip harisha-${tone(score)}`;
}

module.exports = { tone, render };
