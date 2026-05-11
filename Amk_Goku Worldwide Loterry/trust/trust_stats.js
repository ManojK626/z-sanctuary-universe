// Z: Amk_Goku Worldwide Loterry\trust\trust_stats.js
// Trust Stats (anonymized aggregation)
(function () {
  function aggregate(events = []) {
    const stats = {
      trustBondAccepted: 0,
      educationModeOn: 0,
      teacherPauses: 0,
    };

    events.forEach((e) => {
      if (e.source === 'trust_bond' && e.accepted) stats.trustBondAccepted++;
      if (e.source === 'education_mode' && e.enabled) stats.educationModeOn++;
      if (e.source === 'z_teacher' && e.action === 'cooldown_set') stats.teacherPauses++;
    });

    return stats;
  }

  window.ZTrustStats = {
    snapshot() {
      const events = window.ZChronicle && window.ZChronicle.all ? window.ZChronicle.all() : [];
      return aggregate(events);
    },
  };
})();
