// Z: Amk_Goku Worldwide Loterry\education\z_teacher_cards.js
// Z-Teacher Learning Cards
(function () {
  const CARDS = [
    {
      id: 'authorship',
      title: 'Respecting Authorship',
      text: 'Ideas carry fingerprints. Protecting authorship keeps creativity alive and fair.',
    },
    {
      id: 'boundaries',
      title: 'Why Boundaries Exist',
      text: 'Boundaries are agreements that let people collaborate without harm.',
    },
    {
      id: 'traceability',
      title: 'Traceability Is Protection',
      text: 'Traceability protects creators and users alike. It keeps trust verifiable.',
    },
  ];

  function pick() {
    return CARDS[Math.floor(Math.random() * CARDS.length)];
  }

  window.ZTeacherCards = { pick };
})();
