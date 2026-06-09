/* ============================================================
   BARBA-SETUP.JS — Barba.js initialization + transitions
   ============================================================ */

'use strict';

import { animatePageIn, animatePageOut, animateHero, initScrollAnimations, animateCounters } from './gsap-animations.js';
import { Meta, updateActiveNav, reinitPageScripts, initCardGlow } from './utils.js';
import { initSpline } from './spline-init.js';

/* ── Transition overlay (flash screen) ──────────────────────── */
const overlay = document.getElementById('transition-overlay');

function overlayIn() {
  return gsap.to(overlay, { opacity: 1, duration: 0.25, ease: 'power2.in' });
}

function overlayOut() {
  return gsap.to(overlay, { opacity: 0, duration: 0.35, ease: 'power2.out' });
}

/* ── Barba transitions ──────────────────────────────────────── */
const defaultTransition = {
  name: 'default',
  async leave({ current }) {
    await animatePageOut(current.container);
    await overlayIn();
  },
  async enter({ next }) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    await overlayOut();
    await animatePageIn(next.container);
  },
  async after({ next }) {
    runPageInit(next.container);
  }
};

/* ── Per-namespace custom transitions (optional) ────────────── */
const heroTransition = {
  name: 'hero-fade',
  from: { namespace: ['home'] },
  async leave({ current }) {
    await gsap.to(current.container, { opacity: 0, duration: 0.3, ease: 'power2.in' });
  },
  async enter({ next }) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    gsap.set(next.container, { opacity: 0 });
    await gsap.to(next.container, { opacity: 1, duration: 0.5, ease: 'power2.out' });
    next.container.classList.add('is-visible');
  },
  async after({ next }) {
    runPageInit(next.container);
  }
};

/* ── Run after every page transition ────────────────────────── */
function runPageInit(container) {
  initScrollAnimations(container);
  animateCounters(container);
  initCardGlow();
  reinitPageScripts();
  updateActiveNav();
  initSpline(container);

  if (container.querySelector('.hero')) {
    animateHero(container);
  }
}

/* ── Barba Views (page-specific hooks) ──────────────────────── */
const views = [
  {
    namespace: 'home',
    beforeEnter({ next }) {
      document.body.dataset.page = 'home';
    },
    afterEnter({ next }) {
      // Home-specific initializations here
    }
  },
  {
    namespace: 'servicios',
    afterEnter({ next }) {
      document.body.dataset.page = 'servicios';
    }
  },
  {
    namespace: 'proyectos',
    afterEnter({ next }) {
      document.body.dataset.page = 'proyectos';
    }
  },
  {
    namespace: 'contacto',
    afterEnter({ next }) {
      document.body.dataset.page = 'contacto';
      initContactForm(next.container);
    }
  }
];

/* ── Contact form init ──────────────────────────────────────── */
function initContactForm(container) {
  const form = container.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    // Simulate send (replace with real fetch)
    await new Promise(r => setTimeout(r, 1500));
    btn.textContent = 'Enviado ✓';
    form.reset();
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Enviar mensaje';
    }, 3000);
  });
}

/* ── Main Barba init ────────────────────────────────────────── */
function initBarba() {
  barba.init({
    transitions: [heroTransition, defaultTransition],
    views,
    prefetchIgnore: false,
    cacheIgnore: false,
    debug: false,

    // Prevent Barba from handling external links, anchors, etc.
    prevent: ({ el }) => {
      const href = el.getAttribute('href') || '';
      return (
        href.startsWith('mailto:') ||
        href.startsWith('tel:')    ||
        href.startsWith('#')       ||
        el.hasAttribute('target')  ||
        el.hasAttribute('download')
      );
    }
  });

  /* ── Global Barba hooks ─────────────────────────────────────── */
  barba.hooks.before(() => {
    // Optional: cancel any running GSAP animations on the page
    gsap.killTweensOf('[data-barba="container"]');
  });

  barba.hooks.afterLeave(() => {
    // Clean up ScrollTrigger before new content loads
    ScrollTrigger.getAll().forEach(t => t.kill());
  });

  barba.hooks.after(({ next }) => {
    if (next?.html) Meta.updateFromHTML(next.html);
  });
}

export { initBarba, runPageInit };
