function narrate(reflection) {
  return {
    title: reflection.tone === 'calm' ? 'Weekly Peace' : reflection.tone === 'alert' ? 'Weekly Guard' : 'Weekly Restraint',
    message: reflection.narrative,
    stats: reflection.summary,
    generatedAt: new Date().toISOString(),
  };
}

module.exports = { narrate };
