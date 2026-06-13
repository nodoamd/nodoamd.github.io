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
  splineUrl: 'https://prod.spline.design/413yij0subdFPRs9/scene.splinecode',
  splineScript: 'https://unpkg.com/@splinetool/viewer@1.9.66/build/spline-viewer.js',
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

const PAGE_LABELS = {
  home: 'Inicio',
  work: 'Trabajos',
  about: 'Nosotros',
  contact: 'Contacto',
};

/* ═══════════════════════════════════════════════════
   LOADER — solo index (primera visita)
═══════════════════════════════════════════════════ */
const Loader = (() => {
  const el = {
    loader:  document.getElementById('nodo-loader'),
    logo:    document.querySelector('.loader-logo'),
    fill:    document.querySelector('.loader-bar-fill'),
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
   PAGE REVEAL — barrido al entrar en páginas secundarias
═══════════════════════════════════════════════════ */
const PageReveal = (() => {
  function reveal(namespace, onComplete) {
    const sweep = document.querySelector('.nodo-sweep');
    const label = document.querySelector('.transition-label');
    const container = document.querySelector('[data-barba="container"]');

    setSweepAccent(sweep, namespace);
    if (label) label.textContent = PAGE_LABELS[namespace] || '';

    gsap.set(sweep, { scaleY: 1, transformOrigin: 'top' });
    gsap.set(container, { opacity: 0, y: 30 });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(sweep, { scaleY: 0, transformOrigin: 'bottom' });
        gsap.set(label, { opacity: 0 });
        onComplete?.();
      },
    });

    tl.to(label, { opacity: 1, duration: 0.35, ease: 'power2.out' }, 0)
      .to(sweep, { scaleY: 0, duration: 0.85, ease: 'expo.inOut' }, 0.1)
      .to(container, { opacity: 1, y: 0, duration: 0.65, ease: 'expo.out' }, '-=0.55')
      .to(label, { opacity: 0, y: -12, duration: 0.3, ease: 'power2.in' }, '-=0.35');
  }

  return { reveal };
})();

/* ═══════════════════════════════════════════════════
   SPLINE
═══════════════════════════════════════════════════ */
const Spline = (() => {
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

  function init(container) {
    const shell = (container || document).querySelector('#spline-shell');
    const viewer = (container || document).querySelector('#hero-spline');
    if (!shell || !viewer) return Promise.resolve();

    shell.classList.add('loading');

    return loadScript().then(() => new Promise(resolve => {
      const done = () => {
        shell.classList.remove('loading');
        resolve();
      };

      if (viewer.shadowRoot || viewer.querySelector('canvas')) {
        done();
        return;
      }

      viewer.addEventListener('load', done, { once: true });
      setTimeout(done, 10000);
    })).catch(() => {
      shell.classList.remove('loading');
    });
  }

  return { init, loadScript };
})();

/* ═══════════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════════ */
const Nav = (() => {
  const nav    = document.getElementById('nodo-nav');
  const links  = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  const burger = document.querySelector('.nav-burger');
  const menu   = document.querySelector('.nav-links');

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
      gsap.to(spans[0], { rotation: open ? 45 : 0,  y: open ? 6.5 : 0,  duration: 0.3 });
      gsap.to(spans[1], { opacity:  open ? 0 : 1, duration: 0.2 });
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
   TRANSICIONES BARBA
═══════════════════════════════════════════════════ */
function killScrollTriggers() {
  ScrollTrigger.getAll().forEach(st => st.kill());
}

function setSweepAccent(sweep, namespace) {
  if (!sweep) return;
  sweep.classList.remove('sweep-home', 'sweep-work', 'sweep-about', 'sweep-contact');
  sweep.classList.add(`sweep-${namespace || 'home'}`);
}

function getSweepElements() {
  return {
    sweep: document.querySelector('.nodo-sweep'),
    label: document.querySelector('.transition-label'),
  };
}

/* Barrido premium — sube desde abajo y revela la nueva página */
function createSweepTransition(namespace) {
  return {
    name: `sweep-${namespace}`,

    leave({ current }) {
      return new Promise(resolve => {
        const { sweep, label } = getSweepElements();
        setSweepAccent(sweep, current.namespace);
        if (label) {
          label.textContent = PAGE_LABELS[current.namespace] || '';
          gsap.set(label, { opacity: 0, y: 10 });
        }
        gsap.set(sweep, { scaleY: 0, transformOrigin: 'bottom' });

        const tl = gsap.timeline({ onComplete: resolve });
        tl.to(current.container, { opacity: 0, y: -24, duration: 0.35, ease: 'power2.in' }, 0)
          .to(sweep, { scaleY: 1, duration: 0.6, ease: 'expo.inOut' }, 0.05)
          .to(label, { opacity: 0.35, y: 0, duration: 0.4, ease: 'power2.out' }, 0.15);
      });
    },

    enter({ next }) {
      return new Promise(resolve => {
        const { sweep, label } = getSweepElements();
        setSweepAccent(sweep, next.namespace);
        if (label) label.textContent = PAGE_LABELS[next.namespace] || '';

        gsap.set(next.container, { opacity: 0, y: 48 });
        gsap.set(sweep, { transformOrigin: 'top' });

        const tl = gsap.timeline({
          onComplete: () => {
            gsap.set(sweep, { scaleY: 0, transformOrigin: 'bottom' });
            gsap.set(label, { opacity: 0 });
            gsap.set(next.container, { clearProps: 'y' });
            resolve();
          },
        });

        tl.to(label, { opacity: 1, y: 0, duration: 0.4, ease: 'expo.out' }, 0)
          .to(sweep, { scaleY: 0, duration: 0.75, ease: 'expo.inOut' }, 0.05)
          .to(next.container, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, '-=0.55')
          .to(label, { opacity: 0, y: -16, duration: 0.35, ease: 'power2.in' }, '-=0.3');
      });
    },
  };
}

const transitionSweepHome    = createSweepTransition('home');
const transitionSweepWork    = createSweepTransition('work');
const transitionSweepAbout   = createSweepTransition('about');
const transitionSweepContact = createSweepTransition('contact');

const transitionRules = [
  { to: { namespace: 'home' },    use: transitionSweepHome },
  { to: { namespace: 'work' },    use: transitionSweepWork },
  { to: { namespace: 'about' },   use: transitionSweepAbout },
  { to: { namespace: 'contact' }, use: transitionSweepContact },
];

const barbaTransitions = transitionRules.map(rule => ({
  ...(rule.from ? { from: rule.from } : {}),
  ...(rule.to ? { to: rule.to } : {}),
  ...rule.use,
}));

function setPageTheme() {
  document.body.classList.add('theme-light');
}

function finishBoot() {
  document.body.classList.remove('is-loading');
  gsap.to('#nodo-nav', { opacity: 1, duration: 0.5, ease: 'power2.out' });
  gsap.to('[data-barba="container"]', { opacity: 1, duration: 0.01 });
}

barba.init({
  transitions: [...barbaTransitions, { ...transitionSweepWork }],
  prefetchIgnore: false,
  hooks: {
    before() {
      killScrollTriggers();
      document.querySelector('.nav-links')?.classList.remove('open');
    },
    beforeEnter({ next }) {
      window.scrollTo(0, 0);
      setPageTheme();
    },
    afterEnter({ next }) {
      Nav.setActive();
      initMagnetic(next.container);
      initSmoothScroll(next.container);
      ScrollAnimations.init(next.container);
      ScrollAnimations.refresh();
      pageInit(next.namespace, next.container, true);
    },
  },
});

/* ═══════════════════════════════════════════════════
   PAGE INIT
═══════════════════════════════════════════════════ */
function pageInit(namespace, container, fromBarba = false) {
  switch (namespace) {
    case 'home':  initHome(container, fromBarba); break;
    case 'work':  initWork(fromBarba); break;
    case 'about': initAbout(fromBarba); break;
    case 'contact': initContact(); break;
  }
}

function initHome(container, fromBarba) {
  Spline.init(container || document);

  if (fromBarba) {
    const copy = (container || document).querySelector('.hero-e-copy');
    if (copy) {
      gsap.fromTo(copy, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' });
    }
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  if (!document.querySelector('.hero-e-eyebrow')) return;

  tl.fromTo('.hero-e-eyebrow', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 })
    .fromTo('.hero-e-title span', { opacity: 0, y: 80, skewY: 5 }, { opacity: 1, y: 0, skewY: 0, duration: 0.9, stagger: 0.15 }, '-=0.2')
    .fromTo('.hero-e-sub', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .fromTo('.hero-e-ctas > *', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, '-=0.4')
    .fromTo('.hero-e-clients', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
    .fromTo('.spline-shell', { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 1 }, '-=0.8')
    .fromTo('.hero-e-scroll', { opacity: 0 }, { opacity: 0.45, duration: 0.5 }, '-=0.5');
}

function initWork(fromBarba) {
  const cards = document.querySelectorAll('.work-card');
  if (!cards.length) return;
  if (fromBarba) {
    gsap.fromTo(cards, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.1,
    });
    return;
  }
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
  root.querySelectorAll('.magnetic').forEach(el => {
    if (el.dataset.magnetic) return;
    el.dataset.magnetic = '1';
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * 0.35, y: y * 0.35, duration: 0.4, ease: 'power2.out' });
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
  const container = document.querySelector('[data-barba="container"]');
  const namespace = container?.dataset.barbaNamespace || '';

  Nav.init();
  setPageTheme();
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
    PageReveal.reveal(namespace, () => startApp(false));
  }
});
