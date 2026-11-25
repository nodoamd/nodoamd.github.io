/** Aprendalia — motion: entrada breve, sin saltos de layout */
(function (global) {
  const reduced = global.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function hasGsap() {
    return typeof global.gsap !== 'undefined';
  }

  function enterLesson(root) {
    if (!root || reduced || !hasGsap()) return;
    const blocks = root.querySelectorAll('[data-block-animate]');
    global.gsap.set(blocks, { opacity: 0, y: 8 });
    global.gsap.to(blocks, {
      opacity: 1,
      y: 0,
      duration: 0.45,
      stagger: 0.05,
      ease: 'power2.out',
      delay: 0.05
    });
    const card = document.getElementById('lesson-content-card');
    if (card) {
      global.gsap.fromTo(
        card,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }

  function enterTopicVoice(el) {
    if (!el || reduced || !hasGsap()) return;
    global.gsap.fromTo(
      el,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', delay: 0.08 }
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
