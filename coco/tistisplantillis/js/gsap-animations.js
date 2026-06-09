/* ============================================================
   GSAP-ANIMATIONS.JS — Timelines, ScrollTrigger, page anims
   ============================================================ */

'use strict';

import { Device, $$, $ } from './utils.js';

/* ── Animate page in (called after Barba loads new content) ─── */
function animatePageIn(container) {
  const dur = Device.animDurations();
  if (dur.base === 0) {
    container.classList.add('is-visible');
    gsap.set(container, { opacity: 1, y: 0, clearProps: 'all' });
    return Promise.resolve();
  }

  return new Promise(resolve => {
    gsap.fromTo(container,
      { opacity: 0, y: 24 },
      {
        opacity: 1, y: 0,
        duration: dur.base,
        ease: 'power3.out',
        clearProps: 'transform',
        onComplete: () => {
          container.classList.add('is-visible');
          resolve();
        }
      }
    );
  });
}

/* ── Animate page out (called before Barba removes content) ─── */
function animatePageOut(container) {
  const dur = Device.animDurations();
  if (dur.base === 0) return Promise.resolve();

  return new Promise(resolve => {
    gsap.to(container, {
      opacity: 0,
      y: -16,
      duration: dur.fast,
      ease: 'power2.in',
      onComplete: resolve
    });
  });
}

/* ── Hero entrance timeline ─────────────────────────────────── */
function animateHero(container) {
  const dur = Device.animDurations();

  const tl = gsap.timeline();

  const eyebrow  = $(  '.hero__eyebrow',  container);
  const title    = $(  '.hero__title',    container);
  const subtitle = $(  '.hero__subtitle', container);
  const actions  = $(  '.hero__actions',  container);
  const visual   = $(  '.hero__visual, .spline-shell', container);

  if (eyebrow)  tl.fromTo(eyebrow,  { opacity:0, y:16 }, { opacity:1, y:0, duration:dur.fast, ease:'power3.out' }, 0);
  if (title)    tl.fromTo(title,    { opacity:0, y:30 }, { opacity:1, y:0, duration:dur.base, ease:'power3.out' }, dur.fast * 0.6);
  if (subtitle) tl.fromTo(subtitle, { opacity:0, y:20 }, { opacity:1, y:0, duration:dur.base, ease:'power3.out' }, '-=0.35');
  if (actions)  tl.fromTo(actions,  { opacity:0, y:16 }, { opacity:1, y:0, duration:dur.fast, ease:'power3.out' }, '-=0.3');
  if (visual)   tl.fromTo(visual,   { opacity:0, scale:0.94 }, { opacity:1, scale:1, duration:dur.slow, ease:'power3.out' }, '-=0.5');

  const hero = $('.hero', container);
  if (hero) tl.add(() => hero.classList.add('is-animated'));

  return tl;
}

/* ── ScrollTrigger animations ───────────────────────────────── */
function initScrollAnimations(container = document) {
  // Kill all existing ScrollTrigger instances first
  ScrollTrigger.getAll().forEach(t => t.kill());

  const dur = Device.animDurations();
  if (dur.base === 0) {
    // Reduced motion: just show everything
    $$('[data-animate]', container).forEach(el => {
      el.classList.add('is-animated');
      gsap.set(el, { opacity:1, x:0, y:0, scale:1, clearProps:'all' });
    });
    $$('[data-stagger] > *', container).forEach(el => {
      el.classList.add('is-animated');
      gsap.set(el, { opacity:1, y:0, clearProps:'all' });
    });
    return;
  }

  /* ── Single elements with [data-animate] ──────────────────── */
  $$('[data-animate]', container).forEach(el => {
    const type = el.dataset.animate || 'default';
    let fromVars   = { opacity: 0, y: 30 };
    let toVars     = { opacity: 1, y: 0 };

    if (type === 'fade')        { fromVars = { opacity:0 };          toVars = { opacity:1 }; }
    if (type === 'slide-left')  { fromVars = { opacity:0, x:-30 };   toVars = { opacity:1, x:0 }; }
    if (type === 'slide-right') { fromVars = { opacity:0, x:30 };    toVars = { opacity:1, x:0 }; }
    if (type === 'scale')       { fromVars = { opacity:0, scale:0.9 }; toVars = { opacity:1, scale:1 }; }

    gsap.fromTo(el, fromVars, {
      ...toVars,
      duration: dur.base,
      ease: 'power3.out',
      clearProps: 'transform',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
        once: true
      },
      onComplete: () => el.classList.add('is-animated')
    });
  });

  /* ── Staggered groups with [data-stagger] ─────────────────── */
  $$('[data-stagger]', container).forEach(group => {
    const children = [...group.children];
    const delay = parseFloat(group.dataset.stagger) || 0.1;

    gsap.fromTo(children,
      { opacity:0, y:24 },
      {
        opacity:1, y:0,
        duration: dur.base,
        ease: 'power3.out',
        stagger: delay,
        clearProps: 'transform',
        scrollTrigger: {
          trigger: group,
          start: 'top 86%',
          toggleActions: 'play none none none',
          once: true
        },
        onComplete: () => children.forEach(child => child.classList.add('is-animated'))
      }
    );
  });

  /* ── Refresh after DOM settle ─────────────────────────────── */
  ScrollTrigger.refresh();
}

/* ── Number counter ─────────────────────────────────────────── */
function animateCounters(container = document) {
  $$('[data-counter]', container).forEach(el => {
    const target = parseFloat(el.dataset.counter);
    const suffix = el.dataset.suffix || '';
    gsap.fromTo({ val: 0 }, { val: target }, {
      duration: 1.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true
      },
      onUpdate() {
        el.textContent = Math.round(this.targets()[0].val) + suffix;
      }
    });
  });
}

export {
  animatePageIn,
  animatePageOut,
  animateHero,
  initScrollAnimations,
  animateCounters
};
