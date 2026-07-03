/* Nodo Connect Loader — el logo se monta, las personas conectan */
(function () {
  const LOADER_ID = 'loader-nodo';
  const MIN_VISIBLE_MS = 2400;
  const startedAt = performance.now();

  const loader = document.getElementById(LOADER_ID);
  if (!loader) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pieces = loader.querySelectorAll('.nodo-connect-loader__piece');
  const people = loader.querySelectorAll('.nodo-connect-loader__person');
  const lines = loader.querySelectorAll('.nodo-connect-loader__lines line');
  const copy = loader.querySelector('.nodo-connect-loader__copy');
  const verb = loader.querySelector('.nodo-connect-loader__verb');
  const tag = loader.querySelector('.nodo-connect-loader__tag');
  const glow = loader.querySelector('.nodo-connect-loader__glow');
  const progress = loader.querySelector('.nodo-connect-loader__progress');
  const progressFill = loader.querySelector('.nodo-connect-loader__progress-fill');

  let finished = false;

  function dispatchDone() {
    document.dispatchEvent(new CustomEvent('nodo:loader:done'));
  }

  function hideLoader() {
    if (finished) return;
    finished = true;

    if (!window.gsap) {
      loader.style.opacity = '0';
      loader.style.transition = 'opacity 0.45s ease';
      setTimeout(() => {
        loader.style.display = 'none';
        loader.setAttribute('aria-hidden', 'true');
        dispatchDone();
      }, 450);
      return;
    }

    loader.classList.add('is-exiting');
    gsap.timeline({
      onComplete: () => {
        loader.style.display = 'none';
        loader.setAttribute('aria-hidden', 'true');
        dispatchDone();
      }
    }).to(loader, { opacity: 0, duration: 0.48, ease: 'power2.inOut' });
  }

  function waitAndHide() {
    const elapsed = performance.now() - startedAt;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
    setTimeout(hideLoader, remaining);
  }

  function setupLines() {
    lines.forEach((line) => {
      const len = line.getTotalLength();
      line.style.strokeDasharray = String(len);
      line.style.strokeDashoffset = String(len);
    });
  }

  function runReducedMotion() {
    setupLines();
    pieces.forEach((p) => {
      p.style.opacity = '1';
      p.style.transform = 'none';
    });
    people.forEach((p) => {
      p.style.opacity = '1';
      p.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    lines.forEach((l) => {
      l.style.strokeDashoffset = '0';
    });
    if (copy) copy.style.opacity = '1';
    if (verb) {
      verb.style.opacity = '1';
      verb.style.transform = 'none';
    }
    if (tag) tag.style.opacity = '1';
    if (progress) progress.style.opacity = '1';
    if (progressFill) progressFill.style.transform = 'scaleX(1)';

    setTimeout(waitAndHide, 1200);
  }

  function runGsapLoader() {
    setupLines();

    const pieceOffsets = [
      { x: -42, y: 38, rotation: -28, el: pieces[0] },
      { x: -52, y: -8, rotation: 18, el: pieces[1] },
      { x: 36, y: -44, rotation: 24, el: pieces[2] }
    ];

    pieceOffsets.forEach(({ el, x, y, rotation }) => {
      if (!el) return;
      gsap.set(el, { opacity: 0, x, y, rotation, scale: 0.72 });
    });

    gsap.set(people, { opacity: 0, scale: 0, xPercent: -50, yPercent: -50, transformOrigin: '50% 50%' });
    gsap.set(copy, { opacity: 0, y: 12 });
    gsap.set(verb, { opacity: 0, y: 10 });
    gsap.set(tag, { opacity: 0, y: 6 });
    gsap.set(glow, { opacity: 0, scale: 0.85 });
    gsap.set(progress, { opacity: 0 });
    if (progressFill) gsap.set(progressFill, { scaleX: 0, transformOrigin: 'left center' });

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: waitAndHide
    });

    tl.to(progress, { opacity: 1, duration: 0.35 }, 0)
      .to(progressFill, { scaleX: 0.35, duration: 0.55, ease: 'power1.inOut' }, 0.05)
      .to(
        people,
        {
          opacity: 1,
          scale: 1,
          duration: 0.45,
          stagger: 0.07,
          ease: 'back.out(2)'
        },
        0.12
      )
      .to(
        lines,
        {
          strokeDashoffset: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: 'power2.inOut'
        },
        0.28
      )
      .to(progressFill, { scaleX: 0.62, duration: 0.4, ease: 'power1.inOut' }, 0.35)
      .to(
        pieceOffsets[0].el,
        { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 0.62, ease: 'back.out(1.7)' },
        0.42
      )
      .to(progressFill, { scaleX: 0.8, duration: 0.35, ease: 'power1.inOut' }, 0.55)
      .to(
        pieceOffsets[1].el,
        { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 0.68, ease: 'back.out(1.85)' },
        0.58
      )
      .to(
        pieceOffsets[2].el,
        { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 0.58, ease: 'back.out(1.6)' },
        0.72
      )
      .to(glow, { opacity: 1, scale: 1, duration: 0.5, ease: 'sine.out' }, 0.95)
      .to(
        loader.querySelector('.nodo-connect-loader__logo-wrap'),
        { scale: 1.04, duration: 0.22, yoyo: true, repeat: 1, ease: 'sine.inOut' },
        1.02
      )
      .to(copy, { opacity: 1, y: 0, duration: 0.45 }, 1.05)
      .to(verb, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.8)' }, 1.18)
      .to(tag, { opacity: 1, y: 0, duration: 0.4 }, 1.28)
      .to(progressFill, { scaleX: 1, duration: 0.45, ease: 'power2.out' }, 1.1)
      .to(
        people,
        {
          scale: 1.18,
          duration: 0.22,
          yoyo: true,
          repeat: 1,
          stagger: 0.03,
          ease: 'sine.inOut'
        },
        1.22
      );
  }

  if (prefersReduced) {
    runReducedMotion();
  } else if (window.gsap) {
    runGsapLoader();
  } else {
    runReducedMotion();
  }

  setTimeout(() => {
    if (!finished) hideLoader();
  }, 5200);
})();
