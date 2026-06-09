/* ============================================================
   PAGE-LOADER.JS — Initial loader (2.5–4s)
   ============================================================ */

'use strict';

import { $ } from './utils.js';

const LOADER_MIN_DURATION = 2500; // ms

let loaderEl     = null;
let startTime    = 0;
let isHidden     = false;

function getLoader() {
  if (!loaderEl) loaderEl = $('#page-loader');
  return loaderEl;
}

/* Show loader (used on first load only — Barba uses flash overlay) */
function showLoader() {
  const el = getLoader();
  if (!el) return;
  el.style.opacity  = '1';
  el.style.pointerEvents = 'all';
  el.style.display  = 'flex';
  startTime = Date.now();
  isHidden  = false;
}

/**
 * Hide loader after minimum duration has passed.
 * Returns a Promise that resolves when loader is gone.
 */
function hideLoader() {
  return new Promise(resolve => {
    const el = getLoader();
    if (!el || isHidden) { resolve(); return; }

    const elapsed   = Date.now() - startTime;
    const remaining = Math.max(0, LOADER_MIN_DURATION - elapsed);

    setTimeout(() => {
      isHidden = true;

      // GSAP fade out
      if (window.gsap) {
        gsap.to(el, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => {
            el.style.display = 'none';
            el.style.pointerEvents = 'none';
            resolve();
          }
        });
      } else {
        // Fallback CSS transition
        el.style.transition = 'opacity 0.5s ease';
        el.style.opacity = '0';
        setTimeout(() => {
          el.style.display = 'none';
          resolve();
        }, 500);
      }
    }, remaining);
  });
}

export { showLoader, hideLoader };
