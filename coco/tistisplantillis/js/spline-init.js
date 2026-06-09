/* ============================================================
   SPLINE-INIT.JS — Spline viewer lifecycle (home only)
   ============================================================ */

'use strict';

import { $ } from './utils.js';

function initSpline(container = document) {
  const shell = $('.spline-shell', container);
  if (!shell) return;

  const viewer = $('spline-viewer', shell);
  if (!viewer) return;

  shell.classList.add('loading');

  const reveal = () => shell.classList.remove('loading');

  viewer.addEventListener('load', reveal, { once: true });
  setTimeout(reveal, 10000);
}

export { initSpline };
