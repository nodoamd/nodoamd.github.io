/*
 ┌────────────────────────────────────────────────────────────┐
 │  NODO STUDIO — main.js                                     │
 │  Barba.js · GSAP · Spline · Formulario                     │
 │  Edita NODO_CONFIG para personalizar la plantilla          │
 └────────────────────────────────────────────────────────────┘
*/

/* ═══════════════════════════════════════════════════
   CONFIG — personaliza aquí cada proyecto
═══════════════════════════════════════════════════ */
const NODO_CONFIG = {
  brand: 'Nodo',
  splineScript: 'https://unpkg.com/@splinetool/viewer@1.12.97/build/spline-viewer.js',
  splineModels: [
    {
      label: 'Nodo',
      url: 'https://prod.spline.design/413yij0subdFPRs9/scene.splinecode',
    },
    {
      label: 'Abstracto',
      url: 'https://prod.spline.design/cCCDBbMgwxIsMr8b/scene.splinecode',
    },
  ],
  // Pon tu endpoint real: 'https://formspree.io/f/TU_ID'
  formEndpoint: '',
};

/* ═══════════════════════════════════════════════════
   GLOBALS
═══════════════════════════════════════════════════ */
if (typeof gsap === 'undefined') console.error('[Nodo] GSAP no cargado');
if (typeof barba === 'undefined') console.error('[Nodo] Barba.js no cargado');

gsap.registerPlugin(ScrollTrigger);
if (typeof ScrollToPlugin !== 'undefined') gsap.registerPlugin(ScrollToPlugin);

let isFirstLoad = true;
let splineScriptPromise = null;

const PAGE_META = {
  home: { label: 'Inicio', index: '01', accent: 'home' },
  work: { label: 'Trabajos', index: '02', accent: 'work' },
  about: { label: 'Nosotros', index: '03', accent: 'about' },
  contact: { label: 'Contacto', index: '04', accent: 'contact' },
};

/* ═══════════════════════════════════════════════════
   TRANSICIÓN PREMIUM — panel translateY (estable)
═══════════════════════════════════════════════════ */
const Transition = (() => {
  function els() {
    return {
      root: document.getElementById('nodo-transition'),
      panel: document.querySelector('.nodo-transition-panel'),
      lead: document.querySelector('.nodo-transition-lead'),
      ui: document.querySelector('.nodo-transition-ui'),
      dest: document.querySelector('.transition-destination'),
      destWrap: document.querySelector('.transition-destination-wrap'),
      index: document.querySelector('.transition-index'),
      progress: document.querySelector('.transition-progress-fill'),
    };
  }

  function setMeta(namespace) {
    const meta = PAGE_META[namespace] || PAGE_META.home;
    const { root, dest, index } = els();
    if (dest) dest.textContent = meta.label;
    if (index) index.textContent = meta.index;
    if (root) {
      root.classList.remove('accent-home', 'accent-work', 'accent-about', 'accent-contact');
      root.classList.add(`accent-${meta.accent}`);
    }
  }

  function resetPanel() {
    const { panel, lead, ui, progress, dest, root } = els();
    gsap.killTweensOf([panel, lead, ui, progress, dest]);
    if (panel) gsap.set(panel, { yPercent: 100, force3D: true });
    if (lead) gsap.set(lead, { yPercent: 100, force3D: true });
    if (ui) gsap.set(ui, { opacity: 0, y: 0, visibility: 'hidden', clearProps: 'transform' });
    if (progress) gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' });
    if (dest) gsap.set(dest, { yPercent: 0 });
    if (root) {
      root.classList.remove('is-active');
      root.classList.add('is-idle');
    }
    document.body.classList.remove('is-transitioning');
  }

  function lock() {
    const { root, ui } = els();
    document.body.classList.add('is-transitioning');
    if (root) {
      root.classList.add('is-active');
      root.classList.remove('is-idle');
    }
    if (ui) gsap.set(ui, { visibility: 'visible' });
  }

  function runTimeline(build) {
    return new Promise(resolve => {
      const tl = gsap.timeline({ onComplete: resolve });
      build(tl);
    });
  }

  const panelEase = 'power4.inOut';
  const uiEase = 'power3.out';

  /* Barba — leave */
  function leave({ current }) {
    lock();
    const { panel, lead, ui, progress } = els();
    gsap.killTweensOf([current.container, panel, lead, ui, progress]);

    return runTimeline(tl => {
      tl.to(ui, { opacity: 0, y: 6, duration: 0.16, ease: 'power2.in' }, 0);
      tl.to(current.container, {
        opacity: 0,
        y: -20,
        duration: 0.36,
        ease: 'power2.in',
      }, 0);
      tl.to(progress, { scaleX: 1, duration: 0.55, ease: 'power2.inOut' }, 0.04);
      tl.fromTo(panel,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.68, ease: panelEase, force3D: true },
        0.06
      );
      tl.fromTo(lead,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.52, ease: 'power3.in', force3D: true },
        0.02
      );
    });
  }

  /* Barba — enter: etiqueta solo con panel cubriendo, luego revela página limpia */
  function enter({ next }) {
    lock();
    const { panel, lead, ui, progress, dest } = els();
    gsap.killTweensOf([next.container, panel, lead, ui, progress, dest]);

    setMeta(next.namespace);
    gsap.set(panel, { yPercent: 0, force3D: true });
    gsap.set(lead, { yPercent: 0, force3D: true });
    gsap.set(ui, { opacity: 0, y: 20, visibility: 'visible' });
    gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(dest, { yPercent: 100 });
    gsap.set(next.container, { opacity: 0, y: 24, pointerEvents: 'none' });

    return runTimeline(tl => {
      tl.to(ui, { opacity: 1, y: 0, duration: 0.32, ease: uiEase }, 0);
      tl.to(dest, { yPercent: 0, duration: 0.48, ease: uiEase }, 0.06);
      tl.to(progress, { scaleX: 1, duration: 0.38, ease: 'power2.out' }, 0.06);
      tl.to(ui, { opacity: 0, y: -10, duration: 0.22, ease: 'power2.in' }, 0.4);
      tl.set(ui, { visibility: 'hidden' }, 0.62);
      tl.to(panel, { yPercent: -100, duration: 0.88, ease: panelEase, force3D: true }, 0.58);
      tl.to(lead, { yPercent: -100, duration: 0.74, ease: 'power3.inOut', force3D: true }, 0.62);
      tl.to(next.container, { opacity: 1, y: 0, duration: 0.72, ease: uiEase }, 0.6);
      tl.to(progress, { scaleX: 0, transformOrigin: 'right center', duration: 0.45, ease: 'power2.in' }, 0.58);
    }).then(() => {
      gsap.set(next.container, { clearProps: 'y', pointerEvents: 'auto' });
      resetPanel();
    });
  }

  /* Primera carga en páginas secundarias */
  function initialReveal(namespace) {
    lock();
    const { panel, lead, ui, progress, dest } = els();
    const container = document.querySelector('[data-barba="container"]');

    setMeta(namespace);
    gsap.set(panel, { yPercent: 0, force3D: true });
    gsap.set(lead, { yPercent: 0, force3D: true });
    gsap.set(ui, { opacity: 0, y: 20, visibility: 'visible' });
    gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(dest, { yPercent: 100 });
    gsap.set(container, { opacity: 0, y: 24 });

    return runTimeline(tl => {
      tl.to(ui, { opacity: 1, y: 0, duration: 0.32, ease: uiEase }, 0.04);
      tl.to(dest, { yPercent: 0, duration: 0.48, ease: uiEase }, 0.08);
      tl.to(progress, { scaleX: 1, duration: 0.38, ease: 'power2.out' }, 0.08);
      tl.to(ui, { opacity: 0, y: -10, duration: 0.22, ease: 'power2.in' }, 0.42);
      tl.set(ui, { visibility: 'hidden' }, 0.64);
      tl.to(panel, { yPercent: -100, duration: 0.92, ease: panelEase, force3D: true }, 0.58);
      tl.to(lead, { yPercent: -100, duration: 0.78, ease: 'power3.inOut', force3D: true }, 0.62);
      tl.to(container, { opacity: 1, y: 0, duration: 0.75, ease: uiEase }, 0.6);
      tl.to(progress, { scaleX: 0, transformOrigin: 'right center', duration: 0.45 }, 0.58);
    }).then(() => {
      gsap.set(container, { clearProps: 'y' });
      resetPanel();
    });
  }

  return { leave, enter, initialReveal, resetPanel };
})();

/* ═══════════════════════════════════════════════════
   LOADER — solo index (primera visita)
═══════════════════════════════════════════════════ */
const Loader = (() => {
  const el = {
    loader: document.getElementById('nodo-loader'),
    logo: document.querySelector('.loader-logo'),
    fill: document.querySelector('.loader-bar-fill'),
    counter: document.querySelector('.loader-counter'),
  };

  function simulateProgress(onComplete) {
    const counter = { val: 0 };
    const steps = [
      { target: 25, duration: 0.35 },
      { target: 55, duration: 0.45 },
      { target: 80, duration: 0.35 },
      { target: 100, duration: 0.4 },
    ];
    const tl = gsap.timeline({ onComplete });
    steps.forEach(step => {
      tl.to(counter, {
        val: step.target,
        duration: step.duration,
        ease: 'power1.inOut',
        onUpdate() {
          const v = Math.round(counter.val);
          if (el.counter) el.counter.textContent = v + '%';
          if (el.fill) gsap.set(el.fill, { scaleX: v / 100 });
        },
      });
    });
    return tl;
  }

  function hide(onComplete) {
    return gsap.timeline({ onComplete })
      .to(el.loader, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' })
      .set(el.loader, { display: 'none' });
  }

  function init(onComplete) {
    if (!el.loader) { onComplete?.(); return; }
    gsap.set(el.loader, { display: 'flex' });
    const tl = gsap.timeline();
    tl.to(el.logo, { opacity: 1, duration: 0.5, ease: 'expo.out' });
    tl.add(simulateProgress(() => {
      gsap.delayedCall(0.15, () => hide(onComplete));
    }));
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════
   SPLINE
═══════════════════════════════════════════════════ */
const Spline = (() => {
  let activeIndex = 0;
  let switching = false;

  function models() {
    return NODO_CONFIG.splineModels?.length
      ? NODO_CONFIG.splineModels
      : [{ label: '3D', url: '' }];
  }

  function loadScript() {
    if (splineScriptPromise) return splineScriptPromise;
    if (document.querySelector('script[data-nodo-spline]')) {
      splineScriptPromise = Promise.resolve();
      return splineScriptPromise;
    }
    splineScriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.type = 'module';
      s.src = NODO_CONFIG.splineScript;
      s.dataset.nodoSpline = '';
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Spline script failed'));
      document.head.appendChild(s);
    });
    return splineScriptPromise;
  }

  function mountViewer(shell, url) {
    const loader = shell.querySelector('.spline-loader');
    shell.querySelector('#hero-spline')?.remove();

    const viewer = document.createElement('spline-viewer');
    viewer.id = 'hero-spline';
    viewer.setAttribute('url', url);
    shell.insertBefore(viewer, loader);

    return viewer;
  }

  function waitForViewer(viewer, shell) {
    return new Promise(resolve => {
      const done = () => {
        shell.classList.remove('loading');
        gsap.to(viewer, { opacity: 1, duration: 0.45, ease: 'power2.out' });
        resolve();
      };

      if (viewer.shadowRoot?.querySelector('canvas')) {
        done();
        return;
      }

      viewer.addEventListener('load', done, { once: true });
      setTimeout(done, 12000);
    });
  }

  function updateSwitcher(scope, index) {
    const root = scope || document;
    root.querySelectorAll('.spline-switch-btn').forEach(btn => {
      const on = parseInt(btn.dataset.splineIndex, 10) === index;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function bindSwitcher(scope) {
    const root = scope || document;
    const switcher = root.querySelector('.spline-switcher');
    if (!switcher || switcher.dataset.bound) return;
    switcher.dataset.bound = 'true';

    switcher.querySelectorAll('.spline-switch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.splineIndex, 10);
        switchModel(index, root);
      });
    });
  }

  function switchModel(index, scope) {
    const list = models();
    if (switching || index === activeIndex || !list[index]) return;

    const root = scope || document;
    const shell = root.querySelector('#spline-shell');
    const viewer = root.querySelector('#hero-spline');
    if (!shell || !viewer) return;

    switching = true;
    activeIndex = index;
    updateSwitcher(root, index);
    shell.classList.add('loading');

    gsap.to(viewer, {
      opacity: 0,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => {
        const next = mountViewer(shell, list[index].url);
        waitForViewer(next, shell).finally(() => { switching = false; });
      },
    });
  }

  function init(scope) {
    const root = scope || document;
    const shell = root.querySelector('#spline-shell');
    if (!shell) return Promise.resolve();

    const list = models();
    shell.classList.add('loading');

    return loadScript().then(() => {
      let viewer = root.querySelector('#hero-spline');
      if (!viewer) {
        viewer = mountViewer(shell, list[0].url);
        activeIndex = 0;
      } else {
        const url = viewer.getAttribute('url');
        const idx = list.findIndex(m => m.url === url);
        activeIndex = idx >= 0 ? idx : 0;
      }

      bindSwitcher(root);
      updateSwitcher(root, activeIndex);
      return waitForViewer(viewer, shell);
    }).catch(() => {
      shell.classList.remove('loading');
    });
  }

  return { init, switchModel };
})();

/* ═══════════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════════ */
const Nav = (() => {
  const nav = document.getElementById('nodo-nav');
  const links = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  const burger = document.querySelector('.nav-burger');
  const menu = document.querySelector('.nav-links');

  function updateScroll() {
    nav?.classList.toggle('scrolled', window.scrollY > 40);
  }

  function setActive() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(a => {
      const href = a.getAttribute('href') || '';
      const match = href === path
        || href === './' + path
        || (path === 'index.html' && (href === '/' || href === 'index.html' || href === './'));
      a.classList.toggle('active', match);
    });
  }

  function initBurger() {
    if (!burger || !menu) return;
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
      const spans = burger.querySelectorAll('span');
      gsap.to(spans[0], { rotation: open ? 45 : 0, y: open ? 6.5 : 0, duration: 0.3 });
      gsap.to(spans[1], { opacity: open ? 0 : 1, duration: 0.2 });
      gsap.to(spans[2], { rotation: open ? -45 : 0, y: open ? -6.5 : 0, duration: 0.3 });
    });
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function animateIn() {
    if (!nav) return;
    gsap.fromTo(nav,
      { yPercent: -100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.8, ease: 'expo.out', delay: 0.1 }
    );
  }

  function init() {
    if (!nav) return;
    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();
    setActive();
    initBurger();
  }

  return { init, animateIn, setActive };
})();

/* ═══════════════════════════════════════════════════
   SCROLL ANIMATIONS
═══════════════════════════════════════════════════ */
const ScrollAnimations = (() => {
  function init(container) {
    const ctx = container || document;

    ctx.querySelectorAll('.will-fade').forEach(el => {
      gsap.fromTo(el, { opacity: 0 }, {
        opacity: 1, duration: 0.8, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      });
    });

    ctx.querySelectorAll('.will-slide').forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      });
    });

    ctx.querySelectorAll('.will-scale').forEach(el => {
      gsap.fromTo(el, { opacity: 0, scale: 0.92 }, {
        opacity: 1, scale: 1, duration: 0.9, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      });
    });

    ctx.querySelectorAll('[data-stagger]').forEach(group => {
      gsap.fromTo(group.children, { opacity: 0, y: 35 }, {
        opacity: 1, y: 0, duration: 0.75, ease: 'expo.out',
        stagger: parseFloat(group.dataset.stagger) || 0.1,
        scrollTrigger: { trigger: group, start: 'top 88%', once: true },
      });
    });

    ctx.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter() {
          gsap.to({ val: 0 }, {
            val: target,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate() {
              const v = Math.round(this.targets()[0].val);
              el.textContent = v + (el.dataset.suffix || (target === 100 ? '%' : '+'));
            },
          });
        },
      });
    });
  }

  return { init, refresh: () => ScrollTrigger.refresh() };
})();

/* ═══════════════════════════════════════════════════
   BARBA — una sola transición fiable
═══════════════════════════════════════════════════ */
function setPageTheme() {
  document.body.classList.add('theme-light');
}

function finishBoot() {
  document.body.classList.remove('is-loading');
  gsap.to('#nodo-nav', { opacity: 1, duration: 0.5, ease: 'power2.out' });
}

barba.init({
  preventRunning: true,
  transitions: [{
    name: 'nodo-premium',
    leave(data) {
      return Transition.leave(data);
    },
    enter(data) {
      return Transition.enter(data);
    },
  }],
  prefetchIgnore: true,
  timeout: 8000,
  hooks: {
    before() {
      ScrollTrigger.getAll().forEach(st => st.kill());
      document.querySelector('.nav-links')?.classList.remove('open');
    },
    beforeLeave({ current }) {
      gsap.set(current.container, { pointerEvents: 'none' });
    },
    beforeEnter({ next }) {
      window.scrollTo(0, 0);
      setPageTheme();
      gsap.set(next.container, { opacity: 0, pointerEvents: 'none' });
    },
    afterEnter({ next }) {
      Transition.resetPanel();
      Nav.setActive();
      initMagnetic(next.container);
      initSmoothScroll(next.container);
      ScrollAnimations.init(next.container);
      ScrollTrigger.refresh();
      pageInit(next.namespace, next.container, true);
    },
  },
});

/* ═══════════════════════════════════════════════════
   PAGE INIT
═══════════════════════════════════════════════════ */
function pageInit(namespace, container, fromBarba = false) {
  switch (namespace) {
    case 'home': initHome(container, fromBarba); break;
    case 'work': initWork(fromBarba); break;
    case 'about': initAbout(fromBarba); break;
    case 'contact': initContact(); break;
  }
}

function initHome(container, fromBarba) {
  if (fromBarba) {
    Spline.init(container || document);
    return;
  }

  Spline.init(container || document);

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  if (!document.querySelector('.hero-e-eyebrow')) return;

  tl.fromTo('.hero-e-eyebrow', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 })
    .fromTo('.hero-e-title', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.85 }, '-=0.15')
    .fromTo('.hero-e-sub', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.45')
    .fromTo('.hero-e-ctas > *', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, '-=0.35')
    .fromTo('.hero-e-social', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.25')
    .fromTo('.hero-e-visual', { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: 1 }, '-=0.5')
    .fromTo('.hero-e-scroll', { opacity: 0 }, { opacity: 0.45, duration: 0.5 }, '-=0.4');
}

function initWork(fromBarba) {
  if (fromBarba) return;
  const cards = document.querySelectorAll('.work-card');
  if (!cards.length) return;
  gsap.fromTo(cards, { opacity: 0, y: 50 }, {
    opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.12, delay: 0.15,
  });
}

function initAbout(fromBarba) {
  if (fromBarba) return;
  const img = document.querySelector('.about-img');
  if (!img) return;
  gsap.to(img, {
    yPercent: -12, ease: 'none',
    scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
  });
}

function initContact() {
  initContactForm();
}

/* ═══════════════════════════════════════════════════
   FORMULARIO
═══════════════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('nodo-form');
  if (!form || form.dataset.bound) return;
  form.dataset.bound = 'true';

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const status = form.querySelector('.form-status');
    const btn = form.querySelector('.form-submit');
    let valid = true;

    form.querySelectorAll('[required]').forEach(field => {
      const err = field.closest('.form-group')?.querySelector('.form-error');
      if (!field.value.trim()) {
        valid = false;
        if (err) err.textContent = 'Campo obligatorio';
        field.style.borderColor = '#f87171';
      } else {
        if (err) err.textContent = '';
        field.style.borderColor = '';
      }
    });

    const email = form.querySelector('[type="email"]');
    if (email?.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      valid = false;
      const err = email.closest('.form-group')?.querySelector('.form-error');
      if (err) err.textContent = 'Email no válido';
    }

    if (!valid) return;

    const original = btn.textContent;
    btn.textContent = 'Enviando…';
    btn.disabled = true;
    if (status) status.textContent = '';

    if (!NODO_CONFIG.formEndpoint) {
      await new Promise(r => setTimeout(r, 900));
      btn.textContent = '✓ Enviado (modo demo)';
      if (status) status.textContent = 'Configura formEndpoint en js/main.js para envío real.';
      form.reset();
      setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 3000);
      return;
    }

    try {
      const res = await fetch(NODO_CONFIG.formEndpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) throw new Error('Error al enviar');

      btn.textContent = '✓ Enviado';
      if (status) status.textContent = 'Gracias. Te respondemos en menos de 24h.';
      form.reset();
      setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 3000);
    } catch {
      btn.textContent = original;
      btn.disabled = false;
      if (status) status.textContent = 'Error al enviar. Escríbenos a hola@nodostudio.es';
    }
  });
}

/* ═══════════════════════════════════════════════════
   UTILS
═══════════════════════════════════════════════════ */
function initMagnetic(scope) {
  const root = scope || document;

  root.querySelectorAll('[data-magnetic-group]').forEach(group => {
    if (group.dataset.magneticBound) return;
    group.dataset.magneticBound = '1';

    const items = [...group.querySelectorAll('.magnetic')];
    if (items.length < 2) return;

    const STRENGTH = 0.24;
    const MIN_GAP = 12;
    const offsets = items.map(() => ({ x: 0, y: 0 }));

    function measure(el) {
      const rect = el.getBoundingClientRect();
      const x = gsap.getProperty(el, 'x') || 0;
      const y = gsap.getProperty(el, 'y') || 0;
      return {
        left: rect.left - x,
        top: rect.top - y,
        width: rect.width,
        height: rect.height,
      };
    }

    function separate() {
      for (let pass = 0; pass < 5; pass++) {
        for (let i = 0; i < items.length; i++) {
          for (let j = i + 1; j < items.length; j++) {
            const a = measure(items[i]);
            const b = measure(items[j]);
            const aL = a.left + offsets[i].x;
            const aR = aL + a.width;
            const bL = b.left + offsets[j].x;
            const bR = bL + b.width;
            const aT = a.top + offsets[i].y;
            const aB = aT + a.height;
            const bT = b.top + offsets[j].y;
            const bB = bT + b.height;

            const overlapX = Math.min(aR, bR) - Math.max(aL, bL);
            const overlapY = Math.min(aB, bB) - Math.max(aT, bT);

            if (overlapX > -MIN_GAP && overlapY > 0) {
              const push = (overlapX + MIN_GAP) * 0.55;
              const aCenter = aL + a.width / 2;
              const bCenter = bL + b.width / 2;
              if (aCenter <= bCenter) {
                offsets[i].x -= push;
                offsets[j].x += push;
              } else {
                offsets[i].x += push;
                offsets[j].x -= push;
              }
            }
          }
        }
      }
    }

    group.addEventListener('mousemove', e => {
      items.forEach((el, i) => {
        const base = measure(el);
        const cx = base.left + base.width / 2;
        const cy = base.top + base.height / 2;
        offsets[i].x = (e.clientX - cx) * STRENGTH;
        offsets[i].y = (e.clientY - cy) * STRENGTH;
      });
      separate();
      items.forEach((el, i) => {
        gsap.to(el, { x: offsets[i].x, y: offsets[i].y, duration: 0.38, ease: 'power2.out', overwrite: 'auto' });
      });
    });

    group.addEventListener('mouseleave', () => {
      items.forEach(el => gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.55)' }));
    });
  });

  root.querySelectorAll('.magnetic').forEach(el => {
    if (el.closest('[data-magnetic-group]')) return;
    if (el.dataset.magnetic) return;
    el.dataset.magnetic = '1';
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

function initSmoothScroll(scope) {
  const root = scope || document;
  root.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (anchor.dataset.scroll) return;
    anchor.dataset.scroll = '1';
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (typeof ScrollToPlugin !== 'undefined') {
        gsap.to(window, { scrollTo: { y: target, offsetY: 80 }, duration: 1.2, ease: 'expo.inOut' });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ═══════════════════════════════════════════════════
   ARRANQUE
═══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  if (location.protocol === 'file:') {
    console.warn('[Nodo] Barba.js no funciona con file:// — usa un servidor: python3 -m http.server 8090');
  }

  const container = document.querySelector('[data-barba="container"]');
  const namespace = container?.dataset.barbaNamespace || '';

  Nav.init();
  setPageTheme();
  Transition.resetPanel();
  initMagnetic();
  initSmoothScroll();

  const loaderEl = document.getElementById('nodo-loader');
  if (namespace !== 'home' && loaderEl) {
    gsap.set(loaderEl, { display: 'none' });
  }

  const startApp = (fromBarba = false) => {
    finishBoot();
    Nav.animateIn();
    ScrollAnimations.init(document);
    pageInit(namespace, container, fromBarba);
    isFirstLoad = false;
  };

  if (namespace === 'home') {
    Promise.all([
      new Promise(r => Loader.init(r)),
      Spline.init(document),
    ]).then(() => startApp(false));
  } else {
    Transition.initialReveal(namespace).then(() => startApp(false));
  }
});
