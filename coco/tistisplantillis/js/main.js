/* ============================================================
   MAIN.JS — Orchestrator / Entry point
   ============================================================ */

'use strict';

import { showLoader, hideLoader }                     from './page-loader.js';
import { initBarba, runPageInit }                     from './barba-setup.js';
import { animatePageIn }                                from './gsap-animations.js';
import { initHeaderScroll, initCursorGlow, initCardGlow, initMobileMenu, updateActiveNav } from './utils.js';

/* ── Config ─────────────────────────────────────────────────── */
const CONFIG = {
  loaderDuration:          2500,   // ms — minimum loader display
  pageTransitionDuration:  0.4,    // s  — default page fade
  staggerDelay:            0.1,    // s  — between staggered children
  enableScrollAnimations:  true,
  enableCursorGlow:        true,
  enablePrefetch:          true,
  cachePolicy:             'aggressive',
};

/* ── Boot ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {

  // 1. Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // 2. Show initial loader
  showLoader();

  // 3. Init persistent UI (runs once, survives Barba transitions)
  initHeaderScroll();
  initMobileMenu();
  if (CONFIG.enableCursorGlow) initCursorGlow();
  updateActiveNav();

  // 4. Init Barba (handles all subsequent navigations)
  initBarba();

  // 5. Hide loader (respects minimum duration) + animate first page
  await hideLoader();
  const container = document.querySelector('[data-barba="container"]');
  if (container) {
    await animatePageIn(container);
    runPageInit(container);
  }

  console.log('%c[Nodo Template] Barba.js + GSAP initialized ✓', 'color:#6c72e5;font-weight:700;');
});
