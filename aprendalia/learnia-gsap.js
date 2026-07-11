/** Aprendalia — motion con GSAP (Nodo indigo) */
(function (global) {
  const reduced = global.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function hasGsap() {
    return typeof global.gsap !== 'undefined';
  }

  function enterLesson(root) {
    if (!root || reduced || !hasGsap()) return;
    const blocks = root.querySelectorAll('[data-block-animate]');
    global.gsap.set(blocks, { opacity: 0, y: 18 });
    global.gsap.to(blocks, {
      opacity: 1,
      y: 0,
      duration: 0.55,
      stagger: 0.08,
      ease: 'power2.out',
      delay: 0.12
    });
    const card = document.getElementById('lesson-content-card');
    if (card) {
      global.gsap.fromTo(
        card,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
      );
    }
  }

  function enterTopicVoice(el) {
    if (!el || reduced || !hasGsap()) return;
    global.gsap.fromTo(
      el,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.15 }
    );
  }

  function celebrateLesson() {
    if (reduced || !hasGsap()) return;
    const btn = document.getElementById('complete-lesson-btn');
    if (!btn) return;
    global.gsap.fromTo(
      btn,
      { scale: 1 },
      { scale: 1.04, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out' }
    );
    const flash = document.createElement('div');
    flash.className = 'learnia-celebrate-flash';
    document.body.appendChild(flash);
    global.gsap.fromTo(
      flash,
      { opacity: 0.35 },
      {
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        onComplete: () => flash.remove()
      }
    );
  }

  function celebrateExam() {
    if (reduced || !hasGsap()) return;
    celebrateLesson();
  }

  global.AprendaliaMotion = {
    enterLesson,
    enterTopicVoice,
    celebrateLesson,
    celebrateExam
  };
})(typeof window !== 'undefined' ? window : globalThis);
