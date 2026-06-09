/* ============================================================
   UTILS.JS — Helpers, device detection, meta updater
   ============================================================ */

'use strict';

/* ── Device / Environment ───────────────────────────────────── */
const Device = {
  isMobile:  () => window.innerWidth <= 768,
  isTablet:  () => window.innerWidth > 768 && window.innerWidth <= 1024,
  isDesktop: () => window.innerWidth > 1024,
  prefersReducedMotion: () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,

  /**
   * Return animation durations scaled to device / motion preference
   */
  animDurations() {
    if (this.prefersReducedMotion()) return { fast: 0, base: 0, slow: 0 };
    if (this.isMobile())  return { fast: 0.2, base: 0.3, slow: 0.4 };
    if (this.isTablet())  return { fast: 0.25, base: 0.45, slow: 0.6 };
    return                       { fast: 0.3,  base: 0.6,  slow: 0.85 };
  }
};

/* ── Meta Tags ──────────────────────────────────────────────── */
const Meta = {
  /**
   * Update all head meta from next page's <head> content
   * Barba passes the raw HTML of the next page.
   */
  updateFromHTML(nextHTML) {
    const parser = new DOMParser();
    const nextDoc = parser.parseFromString(nextHTML, 'text/html');

    // Title
    const nextTitle = nextDoc.querySelector('title');
    if (nextTitle) document.title = nextTitle.textContent;

    // Meta tags to update
    const metas = ['description', 'og:title', 'og:description', 'og:image', 'og:url'];
    metas.forEach(name => {
      const attr = name.startsWith('og:') ? 'property' : 'name';
      const next = nextDoc.querySelector(`meta[${attr}="${name}"]`);
      const curr = document.querySelector(`meta[${attr}="${name}"]`);
      if (next && curr) curr.setAttribute('content', next.getAttribute('content'));
    });
  }
};

/* ── DOM Helpers ────────────────────────────────────────────── */
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

/* ── Event delegation ───────────────────────────────────────── */
function delegate(parent, selector, event, handler) {
  parent.addEventListener(event, e => {
    const target = e.target.closest(selector);
    if (target && parent.contains(target)) handler(e, target);
  });
}

/* ── Throttle ───────────────────────────────────────────────── */
function throttle(fn, delay = 100) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= delay) { last = now; fn(...args); }
  };
}

/* ── Debounce ───────────────────────────────────────────────── */
function debounce(fn, delay = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* ── Wait for DOM ───────────────────────────────────────────── */
function ready(fn) {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn, { once: true });
}

/* ── Smooth scroll to element ───────────────────────────────── */
function scrollTo(target, offset = 80) {
  const el = typeof target === 'string' ? $(target) : target;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

/* ── Active nav link updater ────────────────────────────────── */
function normalizePagePath(path) {
  return path
    .replace(/\/index\.html$/, '')
    .replace(/\/$/, '') || '/';
}

function updateActiveNav() {
  const current = normalizePagePath(window.location.pathname);

  $$('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const linkPath = normalizePagePath(new URL(href, window.location.href).pathname);
    const isActive =
      current === linkPath ||
      (linkPath !== '/' && current.endsWith(linkPath));

    link.classList.toggle('active', isActive);
  });
}

/* ── Re-init page-specific scripts after Barba transition ───── */
function reinitPageScripts() {
  // If any inline <script> tags come from Barba, execute them
  $$('[data-barba="container"] script').forEach(oldScript => {
    const newScript = document.createElement('script');
    [...oldScript.attributes].forEach(attr => newScript.setAttribute(attr.name, attr.value));
    newScript.textContent = oldScript.textContent;
    oldScript.replaceWith(newScript);
  });
}

/* ── Header scroll effect ───────────────────────────────────── */
function initHeaderScroll() {
  const header = $('.header');
  if (!header) return;
  const handler = throttle(() => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, 50);
  window.addEventListener('scroll', handler, { passive: true });
}

/* ── Cursor glow ────────────────────────────────────────────── */
function initCursorGlow() {
  if (Device.isMobile()) return;
  let glow = $('.cursor-glow');
  if (!glow) {
    glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
  }
  document.addEventListener('mousemove', throttle(e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, 16), { passive: true });
}

/* ── Card mouse-glow effect ─────────────────────────────────── */
function initCardGlow() {
  $$('.card:not([data-glow-init])').forEach(card => {
    card.setAttribute('data-glow-init', '');
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });
}

/* ── Mobile menu ────────────────────────────────────────────── */
function initMobileMenu() {
  const btn  = $('.hamburger');
  const menu = $('.mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('open');
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    btn.setAttribute('aria-expanded', open);
  });

  // Close on link click
  $$('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
      btn.setAttribute('aria-expanded', false);
    });
  });
}

export {
  Device, Meta,
  $, $$, delegate, throttle, debounce, ready,
  scrollTo, updateActiveNav, reinitPageScripts,
  initHeaderScroll, initCursorGlow, initCardGlow, initMobileMenu
};
