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

/* Proyectos — edita para el modal en work.html */
const WORK_PROJECTS = {
  hitachi: {
    title: 'Clínica Hitachi',
    tag: 'Dental · GSAP · ScrollTrigger',
    year: '2025',
    desc: 'Rediseño completo de la presencia digital de la clínica. Animaciones scroll con intención, arquitectura de conversión y campañas Google integradas en el flujo del usuario.',
    stack: ['WordPress', 'GSAP', 'ScrollTrigger', 'Google Ads'],
    results: ['+38% solicitudes de cita', 'LCP < 1.8s', '100 Lighthouse SEO'],
    link: 'contact.html',
  },
  chiquitana: {
    title: 'La Chiquitana',
    tag: 'E-commerce · Barba.js',
    year: '2025',
    desc: 'Tienda online con transiciones Barba entre categorías, micro-interacciones en carrito y una experiencia de marca que se siente artesanal, no genérica.',
    stack: ['Shopify', 'Barba.js', 'GSAP', 'Meta Pixel'],
    results: ['+22% conversión móvil', 'Transiciones sin recarga', 'Brand system unificado'],
    link: 'contact.html',
  },
  dentale: {
    title: 'Dentale BCN',
    tag: 'Corporate · Spline 3D',
    year: '2024',
    desc: 'Web corporativa premium con modelo 3D interactivo en el hero, storytelling visual y formulario de contacto optimizado para leads cualificados.',
    stack: ['HTML/CSS', 'Spline', 'GSAP', 'Formspree'],
    results: ['Hero 3D interactivo', 'Diseño minimalista', 'Leads +45%'],
    link: 'contact.html',
  },
  noir: {
    title: 'Studio Noir',
    tag: 'Branding · Web · Motion',
    year: '2024',
    desc: 'Identidad visual y one-page editorial con tipografía display, motion design sutil y una narrativa que posiciona el estudio como referente creativo.',
    stack: ['Figma', 'GSAP', 'Barba.js', 'Custom CMS'],
    results: ['Sistema de marca completo', 'One-page premiada', 'Scroll storytelling'],
    link: 'contact.html',
  },
  balmes: {
    title: 'Balmes Legal',
    tag: 'Legal · SEO · Performance',
    year: '2024',
    desc: 'Presencia digital para despacho boutique: autoridad, claridad y SEO local sin sacrificar estética. Cada página responde a una intención de búsqueda real.',
    stack: ['WordPress', 'SEO técnico', 'Schema.org', 'GSAP'],
    results: ['Top 3 keywords locales', 'Core Web Vitals verdes', 'Blog automatizado'],
    link: 'contact.html',
  },
  arco: {
    title: 'Arco RE',
    tag: 'Real Estate · Filtros avanzados',
    year: '2023',
    desc: 'Plataforma inmobiliaria con filtros en tiempo real, fichas de propiedad inmersivas y un diseño que transmite confianza desde el primer scroll.',
    stack: ['React', 'GSAP', 'ScrollTrigger', 'Mapbox'],
    results: ['Filtros < 100ms', 'Tiempo en página +60%', 'Diseño de confianza'],
    link: 'contact.html',
  },
};

/* ═══════════════════════════════════════════════════
   GLOBALS
═══════════════════════════════════════════════════ */
if (typeof gsap === 'undefined') console.error('[Nodo] GSAP no cargado');
if (typeof barba === 'undefined') console.error('[Nodo] Barba.js no cargado');

gsap.registerPlugin(ScrollTrigger);
if (typeof ScrollToPlugin !== 'undefined') gsap.registerPlugin(ScrollToPlugin);
gsap.defaults({ ease: 'power2.out' });

let isFirstLoad = true;
let splineScriptPromise = null;
let scrollCtx = null;

const PAGE_ACCENTS = {
  home: 'home',
  work: 'work',
  about: 'about',
  contact: 'contact',
};

/* ═══════════════════════════════════════════════════
   TRANSICIÓN — barrido limpio, sin texto
═══════════════════════════════════════════════════ */
const Transition = (() => {
  const panelEase = 'expo.inOut';

  function els() {
    return {
      root:  document.getElementById('nodo-transition'),
      panel: document.querySelector('.nodo-transition-panel'),
    };
  }

  function setAccent(namespace) {
    const accent = PAGE_ACCENTS[namespace] || PAGE_ACCENTS.home;
    const { root } = els();
    if (!root) return;
    root.classList.remove('accent-home', 'accent-work', 'accent-about', 'accent-contact');
    root.classList.add(`accent-${accent}`);
  }

  function resetPanel() {
    const { panel, root } = els();
    gsap.killTweensOf(panel);
    if (panel) gsap.set(panel, { yPercent: 100, force3D: true });
    if (root) {
      root.classList.remove('is-active');
      root.classList.add('is-idle');
    }
    document.body.classList.remove('is-transitioning');
  }

  function lock() {
    const { root } = els();
    document.body.classList.add('is-transitioning');
    if (root) {
      root.classList.add('is-active');
      root.classList.remove('is-idle');
    }
  }

  function runTimeline(build) {
    return new Promise(resolve => {
      const tl = gsap.timeline({ onComplete: resolve });
      build(tl);
    });
  }

  function pageEnterTargets(container) {
    const ctx = container || document;
    const hero = ctx.querySelector('.page-hero, .hero-e');
    const targets = [];

    if (hero) {
      targets.push(
        ...hero.querySelectorAll('.badge, .hero-e-eyebrow, .hero-title-line'),
        hero.querySelector('h1, .hero-e-title, .t-display'),
        ...hero.querySelectorAll('.t-body, .hero-e-sub, .hero-e-ctas, .hero-e-social, .hero-e-visual')
      );
    }

    targets.push(...ctx.querySelectorAll('.work-card, .about-split, .form-section'));
    return targets.filter(Boolean);
  }

  function prepareContent(container) {
    const targets = pageEnterTargets(container);
    gsap.set(targets, { opacity: 0, y: 18 });
    return targets;
  }

  function revealContent(container, tl, position = 0.42) {
    const targets = pageEnterTargets(container);
    if (!targets.length) return;
    tl.to(targets, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.05,
      ease: 'power2.out',
      clearProps: 'y',
    }, position);
  }

  function leave({ current }) {
    lock();
    const { panel } = els();
    gsap.killTweensOf([current.container, panel]);

    return runTimeline(tl => {
      tl.to(current.container, {
        opacity: 0,
        scale: 0.985,
        duration: 0.38,
        ease: 'power2.inOut',
      }, 0);
      tl.fromTo(panel,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.72, ease: panelEase, force3D: true },
        0.06
      );
    });
  }

  function enter({ next }) {
    lock();
    const { panel } = els();
    gsap.killTweensOf([next.container, panel]);

    setAccent(next.namespace);
    gsap.set(panel, { yPercent: 0, force3D: true });
    gsap.set(next.container, { opacity: 1, scale: 1, pointerEvents: 'none' });
    prepareContent(next.container);

    return runTimeline(tl => {
      tl.to(panel, { yPercent: -100, duration: 0.88, ease: panelEase, force3D: true }, 0.04);
      revealContent(next.container, tl, 0.36);
      tl.set(next.container, { pointerEvents: 'auto' }, 0.5);
    }).then(resetPanel);
  }

  function initialReveal(namespace) {
    lock();
    const { panel } = els();
    const container = document.querySelector('[data-barba="container"]');

    setAccent(namespace);
    gsap.set(panel, { yPercent: 0, force3D: true });
    gsap.set(container, { opacity: 1 });
    prepareContent(container);

    return runTimeline(tl => {
      tl.to(panel, { yPercent: -100, duration: 0.92, ease: panelEase, force3D: true }, 0.08);
      revealContent(container, tl, 0.38);
    }).then(resetPanel);
  }

  return { leave, enter, initialReveal, resetPanel };
})();

/* ═══════════════════════════════════════════════════
   LOADER — solo index (primera visita)
═══════════════════════════════════════════════════ */
const Loader = (() => {
  const el = {
    loader: document.getElementById('nodo-loader'),
    brand: document.querySelector('.loader-brand'),
    word: document.querySelector('.loader-word'),
    icon: document.querySelector('.loader-brand-icon'),
    ring: document.querySelector('.loader-icon-ring'),
    fill: document.querySelector('.loader-bar-fill'),
    counter: document.querySelector('.loader-counter'),
  };

  let loaderTweens = [];

  function killLoaderTweens() {
    loaderTweens.forEach(t => t.kill());
    loaderTweens = [];
  }

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
    killLoaderTweens();
    gsap.set(el.loader, { display: 'flex' });
    gsap.set([el.brand, el.word], { opacity: 0, y: 10 });
    gsap.set(el.icon, { opacity: 0, scale: 0.82, rotateY: -40, rotateX: 12 });
    if (el.ring) gsap.set(el.ring, { rotation: 0, opacity: 0, scale: 0.85 });

    const tl = gsap.timeline();
    tl.to(el.brand, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' })
      .to(el.icon, { opacity: 1, scale: 1, rotateY: 0, rotateX: 0, duration: 0.7, ease: 'back.out(1.5)' }, '-=0.35')
      .to(el.ring, { opacity: 0.75, scale: 1, duration: 0.55, ease: 'power2.out' }, '-=0.5')
      .to(el.word, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.35');

    loaderTweens.push(
      gsap.to(el.word, {
        opacity: 0.5,
        duration: 1.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 0.6,
      })
    );

    loaderTweens.push(
      gsap.timeline({ repeat: -1, delay: 0.4 })
        .to(el.icon, { rotateY: 24, rotateX: -12, duration: 2.1, ease: 'sine.inOut' })
        .to(el.icon, { rotateY: -20, rotateX: 10, duration: 2.4, ease: 'sine.inOut' })
        .to(el.icon, { rotateY: 8, rotateX: -5, duration: 1.9, ease: 'sine.inOut' })
    );

    if (el.ring) {
      loaderTweens.push(gsap.to(el.ring, {
        rotation: 360,
        duration: 3.6,
        ease: 'none',
        repeat: -1,
      }));
    }

    tl.add(simulateProgress(() => {
      killLoaderTweens();
      gsap.timeline()
        .to(el.word, { opacity: 0, duration: 0.32, ease: 'power2.in' })
        .to(el.icon, { opacity: 0, rotateY: 48, rotateX: -18, scale: 0.78, duration: 0.45, ease: 'power2.in' }, '<')
        .to(el.ring, { opacity: 0, scale: 1.15, duration: 0.4, ease: 'power2.in' }, '<')
        .to(el.brand, { opacity: 0, y: -6, duration: 0.3, ease: 'power2.in' }, '-=0.15')
        .add(() => hide(onComplete));
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
   MODAL PROYECTOS (work)
═══════════════════════════════════════════════════ */
const WorkModal = (() => {
  let open = false;

  const MARKUP = `
<div id="work-modal" class="work-modal" aria-hidden="true" role="dialog" aria-labelledby="work-modal-title">
  <div class="work-modal-backdrop"></div>
  <div class="work-modal-panel">
    <div class="work-modal-top">
      <div class="work-modal-meta">
        <span class="work-modal-tag"></span>
        <span class="work-modal-year"></span>
      </div>
      <button type="button" class="work-modal-close" aria-label="Cerrar">×</button>
    </div>
    <h2 id="work-modal-title" class="work-modal-title"></h2>
    <p class="work-modal-desc"></p>
    <div class="work-modal-cols">
      <div>
        <h3 class="work-modal-label">Stack</h3>
        <ul class="work-modal-stack"></ul>
      </div>
      <div>
        <h3 class="work-modal-label">Resultados</h3>
        <ul class="work-modal-results"></ul>
      </div>
    </div>
    <a href="contact.html" class="btn btn-primary work-modal-link magnetic">Hablemos del proyecto →</a>
  </div>
</div>`;

  function ensure() {
    if (!document.getElementById('work-modal')) {
      document.body.insertAdjacentHTML('beforeend', MARKUP);
    }
  }

  function els() {
    ensure();
    return {
      modal:   document.getElementById('work-modal'),
      backdrop: document.querySelector('.work-modal-backdrop'),
      panel:   document.querySelector('.work-modal-panel'),
      tag:     document.querySelector('.work-modal-tag'),
      title:   document.querySelector('.work-modal-title'),
      desc:    document.querySelector('.work-modal-desc'),
      stack:   document.querySelector('.work-modal-stack'),
      results: document.querySelector('.work-modal-results'),
      year:    document.querySelector('.work-modal-year'),
      link:    document.querySelector('.work-modal-link'),
      close:   document.querySelector('.work-modal-close'),
    };
  }

  function fill(project) {
    const el = els();
    if (!el.modal || !project) return;
    if (el.tag) el.tag.textContent = project.tag;
    if (el.title) el.title.textContent = project.title;
    if (el.desc) el.desc.textContent = project.desc;
    if (el.year) el.year.textContent = project.year;
    if (el.link) el.link.href = project.link || 'contact.html';
    if (el.stack) {
      el.stack.innerHTML = project.stack.map(s => `<li>${s}</li>`).join('');
    }
    if (el.results) {
      el.results.innerHTML = project.results.map(r => `<li>${r}</li>`).join('');
    }
  }

  function show(id) {
    const el = els();
    const project = WORK_PROJECTS[id];
    if (!el.modal || !project || open) return;

    fill(project);
    open = true;
    el.modal.classList.add('is-open');
    el.modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.set(el.modal, { pointerEvents: 'auto' })
      .fromTo(el.backdrop, { opacity: 0 }, { opacity: 1, duration: 0.35 }, 0)
      .fromTo(el.panel, { opacity: 0, y: 32, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.55 }, 0.05);
    el.close?.focus();
  }

  function hide() {
    const el = els();
    if (!el.modal || !open) return Promise.resolve();

    return new Promise(resolve => {
      gsap.timeline({
        defaults: { ease: 'power2.in' },
        onComplete() {
          open = false;
          el.modal.classList.remove('is-open');
          el.modal.setAttribute('aria-hidden', 'true');
          el.modal.style.pointerEvents = '';
          document.body.classList.remove('modal-open');
          resolve();
        },
      })
        .to(el.panel, { opacity: 0, y: 20, scale: 0.98, duration: 0.34 }, 0)
        .to(el.backdrop, { opacity: 0, duration: 0.32 }, 0);
    });
  }

  function navigateFromModal(href) {
    if (!href) return;
    hide().then(() => {
      if (typeof barba !== 'undefined' && barba.go) {
        barba.go(href);
      } else {
        window.location.assign(href);
      }
    });
  }

  function init(scope) {
    ensure();
    const root = scope || document;
    const el = els();
    if (!el.modal) return;

    if (!el.modal.dataset.bound) {
      el.modal.dataset.bound = 'true';
      el.close?.addEventListener('click', () => { hide(); });
      el.backdrop?.addEventListener('click', () => { hide(); });
      el.link?.addEventListener('click', e => {
        if (!open) return;
        const href = el.link.getAttribute('href');
        if (!href || href.startsWith('#')) return;
        e.preventDefault();
        navigateFromModal(href);
      });
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && open) hide();
      });
    }

    root.querySelectorAll('.work-card[data-project]').forEach(card => {
      if (card.dataset.modalBound) return;
      card.dataset.modalBound = '1';
      card.addEventListener('click', () => show(card.dataset.project));
    });
  }

  return { init, hide, show };
})();

/* ═══════════════════════════════════════════════════
   MORPH TEXT — transiciones suaves compartidas
═══════════════════════════════════════════════════ */
const MorphText = (() => {
  const pool = new Map();

  function create(container, opts = {}) {
    if (!container) return null;
    const items = gsap.utils.toArray('.morph-item', container);
    if (!items.length) return null;

    const duration = opts.duration ?? 0.62;
    const interval = opts.interval ?? 3400;
    let idx = items.findIndex(el => el.classList.contains('is-active'));
    if (idx < 0) idx = 0;

    let busy = false;
    let loopCall = null;

    function layout() {
      items.forEach((el, i) => {
        gsap.set(el, {
          yPercent: i === idx ? 0 : 110,
          opacity: i === idx ? 1 : 0,
          filter: i === idx ? 'blur(0px)' : 'blur(8px)',
          scale: i === idx ? 1 : 0.98,
        });
      });
    }

    layout();

    function goTo(nextIdx) {
      if (busy || nextIdx === idx || !items[nextIdx]) return;
      busy = true;
      const curr = items[idx];
      const next = items[nextIdx];

      items.forEach(el => el.classList.remove('is-active'));
      next.classList.add('is-active');

      gsap.set(next, { yPercent: 110, opacity: 0, filter: 'blur(8px)', scale: 0.98 });

      gsap.timeline({
        onComplete: () => {
          gsap.set(curr, { yPercent: 110, opacity: 0, filter: 'blur(8px)', scale: 0.98 });
          idx = nextIdx;
          busy = false;
        },
      })
        .to(curr, {
          yPercent: -110,
          opacity: 0,
          filter: 'blur(10px)',
          scale: 1.02,
          duration: duration * 0.5,
          ease: 'power3.in',
        })
        .to(next, {
          yPercent: 0,
          opacity: 1,
          filter: 'blur(0px)',
          scale: 1,
          duration: duration * 0.62,
          ease: 'power3.out',
        }, '-=0.12');
    }

    function goToWord(word) {
      const i = items.findIndex(el => el.dataset.word === word || el.textContent.trim() === word);
      if (i >= 0) goTo(i);
    }

    function next() {
      goTo((idx + 1) % items.length);
    }

    function start() {
      stop();
      if (items.length < 2) return;
      const tick = () => {
        next();
        loopCall = gsap.delayedCall(interval / 1000, tick);
      };
      loopCall = gsap.delayedCall(interval / 1000, tick);
    }

    function stop() {
      loopCall?.kill();
      loopCall = null;
    }

    function kill() {
      stop();
      items.forEach(el => gsap.set(el, { clearProps: 'all' }));
      pool.delete(container);
    }

    const api = { goTo, goToWord, next, start, stop, kill, layout };
    pool.set(container, api);
    return api;
  }

  function get(container) {
    return pool.get(container) || null;
  }

  function kill(container) {
    pool.get(container)?.kill();
  }

  return { create, get, kill };
})();

/* ═══════════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════════ */
const Nav = (() => {
  const nav = document.getElementById('nodo-nav');
  const links = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  const burger = document.querySelector('.nav-burger');
  const menu = document.querySelector('.nav-links');
  const navMorphEl = document.getElementById('navMorph');
  let morphCtx = null;
  let navMorph = null;

  const HOME_WORDS = [
    { selector: '#hero', word: 'Nodo' },
    { selector: '#resultados', word: 'Nodo' },
    { selector: '#servicios', word: 'Conecta' },
    { selector: '#testimonios', word: 'Mejora' },
    { selector: '#precios', word: 'Reinventa' },
    { selector: '#cta', word: 'Crece' },
  ];

  function setNavWord(next) {
    navMorph?.goToWord(next);
  }

  function killMorph() {
    morphCtx?.revert();
    morphCtx = null;
    if (navMorph) {
      MorphText.kill(navMorphEl);
      navMorph = null;
    }
  }

  function initMorph(container, namespace = 'home') {
    killMorph();
    if (!navMorphEl) return;

    navMorph = MorphText.create(navMorphEl, { duration: 0.58 });

    const root = container || document;
    const sections = namespace === 'home'
      ? HOME_WORDS
      : [{ selector: 'main', word: 'Nodo' }];

    morphCtx = gsap.context(() => {
      sections.forEach(({ selector, word }) => {
        const trigger = root.querySelector(selector);
        if (!trigger) return;
        ScrollTrigger.create({
          trigger,
          start: 'top 58%',
          end: 'bottom 42%',
          onEnter: () => setNavWord(word),
          onEnterBack: () => setNavWord(word),
        });
      });
    }, root);

    setNavWord(sections[0].word);
  }

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

  return { init, animateIn, setActive, initMorph, killMorph, updateScroll };
})();

/* ═══════════════════════════════════════════════════
   SCROLL HELPERS — Lenis desactivado (laggy/pegajoso)
   Para re-probar: descomentar bloque LENIS abajo + script en HTML
═══════════════════════════════════════════════════ */
const SmoothScroll = (() => {
  function init() {
    /* scroll nativo */
  }

  function kill() {}

  function stop() {}

  function start() {}

  function resize() {
    ScrollTrigger.refresh();
  }

  function scrollTop(immediate = false) {
    window.scrollTo({ top: 0, left: 0, behavior: immediate ? 'auto' : 'smooth' });
  }

  function scrollTo(target, opts = {}) {
    const offset = opts.offset ?? -80;
    const duration = opts.duration ?? 1.2;

    if (typeof ScrollToPlugin !== 'undefined') {
      gsap.to(window, {
        scrollTo: { y: target, offsetY: -offset },
        duration,
        ease: 'expo.inOut',
      });
      return;
    }

    const el = typeof target === 'string' ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: 'smooth' });
  }

  return { init, kill, stop, start, resize, scrollTop, scrollTo };
})();

/*
const SmoothScroll = (() => {
  let lenis = null;
  let tickerFn = null;

  function init() {
    if (typeof Lenis === 'undefined') return;
    kill();
    lenis = new Lenis({
      duration: 1.15,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.15,
    });
    document.documentElement.classList.add('lenis', 'lenis-smooth');
    lenis.on('scroll', ScrollTrigger.update);
    tickerFn = time => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);
    requestAnimationFrame(time => lenis.raf(time));
  }
  // ...
})();
*/

/* ═══════════════════════════════════════════════════
   SCROLL — parallax, scrub, pin (gsap.context)
═══════════════════════════════════════════════════ */
const ScrollFX = (() => {
  function kill() {
    scrollCtx?.revert();
    scrollCtx = null;
  }

  function init(container) {
    kill();
    const root = container || document;
    if (!root.querySelector) return;

    scrollCtx = gsap.context(() => {
      root.querySelectorAll('[data-scrub]').forEach(el => {
        const dist = parseFloat(el.dataset.scrub) || 40;
        gsap.fromTo(el,
          { y: dist * 0.5 },
          {
            y: -dist * 0.5,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: parseFloat(el.dataset.scrubSmooth) || 1.4,
            },
          }
        );
      });

      root.querySelectorAll('.will-fade').forEach(el => {
        gsap.fromTo(el, { opacity: 0 }, {
          opacity: 1, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });

      root.querySelectorAll('.will-slide').forEach(el => {
        gsap.fromTo(el, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });

      root.querySelectorAll('.will-scale').forEach(el => {
        gsap.fromTo(el, { opacity: 0, scale: 0.96 }, {
          opacity: 1, scale: 1, duration: 0.95, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });

      root.querySelectorAll('[data-stagger]').forEach(group => {
        gsap.fromTo(group.children, { opacity: 0, y: 28 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          stagger: parseFloat(group.dataset.stagger) || 0.08,
          scrollTrigger: { trigger: group, start: 'top 85%', once: true },
        });
      });

      root.querySelectorAll('[data-count]').forEach(el => {
        if (el.closest('#perfPanel')) return;
        const target = parseInt(el.dataset.count, 10);
        const suffix = 'suffix' in el.dataset ? el.dataset.suffix : '';
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter() {
            gsap.to({ val: 0 }, {
              val: target,
              duration: 2,
              ease: 'power2.out',
              onUpdate() {
                const v = Math.round(this.targets()[0].val);
                el.textContent = suffix ? v + suffix : String(v);
              },
            });
          },
        });
      });

      root.querySelectorAll('.perf-bar-fill, .ba-meter-fill').forEach(el => {
        if (el.closest('#perfPanel')) return;
        const w = parseFloat(el.dataset.width) || 0;
        gsap.set(el, { width: '0%' });
        ScrollTrigger.create({
          trigger: el.closest('.perf-bars, .ba-meter, .perf-showcase, .ba-card') || el,
          start: 'top 82%',
          once: true,
          onEnter() {
            gsap.to(el, { width: `${w}%`, duration: 1.5, ease: 'power2.out' });
          },
        });
      });

      const gscCards = root.querySelector('.gsc-cards');
      if (gscCards) {
        gsap.fromTo(gscCards.children, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: gscCards, start: 'top 85%', once: true },
        });
      }

      initNodoMarquee(root);

      root.querySelectorAll('.work-card-img').forEach(img => {
        gsap.fromTo(img,
          { scale: 1.08 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: img,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      });

      const services = root.querySelector('#servicios .cards-grid');
      if (services) {
        gsap.fromTo(services.children, { y: 60 }, {
          y: -30,
          ease: 'none',
          stagger: 0.08,
          scrollTrigger: {
            trigger: services,
            start: 'top 90%',
            end: 'bottom 20%',
            scrub: 1.8,
          },
        });
      }

      const hero = root.querySelector('.hero-e');
      if (hero) {
        const visual = hero.querySelector('.hero-e-visual');
        const copy = hero.querySelector('.hero-e-copy');
        if (visual) {
          gsap.fromTo(visual, { y: 20 }, {
            y: -40,
            ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.8 },
          });
        }
        if (copy) {
          gsap.fromTo(copy, { y: 0 }, {
            y: -16,
            ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 2.2 },
          });
        }
      }

      root.querySelectorAll('.about-img').forEach(img => {
        gsap.to(img, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: 1.6 },
        });
      });
    }, root);
  }

  return { init, kill, refresh: () => ScrollTrigger.refresh() };
})();

/* ═══════════════════════════════════════════════════
   MARQUEE — loop infinito + reverse al scroll (Hayler-style)
═══════════════════════════════════════════════════ */
function initNodoMarquee(root) {
  const track = root?.querySelector('.marquee-track');
  if (!track || track.dataset.marqueeInit) return;

  track.dataset.marqueeInit = '1';
  track.classList.add('is-gsap');

  const loop = gsap.to(track, {
    xPercent: -50,
    duration: 28,
    ease: 'none',
    repeat: -1,
  });

  let paused = false;
  const section = track.closest('.marquee-section');

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate(self) {
      if (paused) return;
      const vel = self.getVelocity();
      if (vel < -30) loop.timeScale(-1);
      else if (vel > 30) loop.timeScale(1);
    },
  });

  if (window.matchMedia('(hover: hover)').matches) {
    section?.addEventListener('mouseenter', () => {
      paused = true;
      gsap.to(loop, { timeScale: 0, duration: 0.35, ease: 'power2.out' });
    });
    section?.addEventListener('mouseleave', () => {
      paused = false;
      gsap.to(loop, { timeScale: 1, duration: 0.45, ease: 'power2.out' });
    });
  }
}

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
  prefetch: true,
  transitions: [{
    name: 'nodo-premium',
    leave(data) {
      return Transition.leave(data);
    },
    enter(data) {
      return Transition.enter(data);
    },
  }],
  timeout: 8000,
  hooks: {
    before() {
      SmoothScroll.stop();
      ScrollFX.kill();
      Nav.killMorph();
      MorphText.kill(document.getElementById('heroTitleMorph'));
      heroMotionCtx?.revert();
      heroMotionCtx = null;
      WorkModal.hide();
      sistemaShowcaseCtx?.revert();
      document.querySelector('.nav-links')?.classList.remove('open');
    },
    beforeLeave({ current }) {
      gsap.set(current.container, { pointerEvents: 'none' });
    },
    beforeEnter({ next }) {
      SmoothScroll.scrollTop(true);
      setPageTheme();
      gsap.set(next.container, { opacity: 1, pointerEvents: 'none' });
    },
    afterEnter({ next }) {
      Transition.resetPanel();
      Nav.setActive();
      SmoothScroll.resize();
      SmoothScroll.start();
      initPointerFX(next.container);
      initSmoothScroll(next.container);
      ScrollFX.init(next.container);
      ScrollTrigger.refresh();
      pageInit(next.namespace, next.container, true);
    },
  },
});

/* ═══════════════════════════════════════════════════
   PAGE INIT
═══════════════════════════════════════════════════ */
function pageInit(namespace, container, fromBarba = false) {
  Nav.initMorph(container || document, namespace);
  ScrollTrigger.refresh();
  switch (namespace) {
    case 'home': initHome(container, fromBarba); break;
    case 'work': initWork(container, fromBarba); break;
    case 'about': initAbout(); break;
    case 'contact': initContact(); break;
  }
}

function initHome(container, fromBarba) {
  Spline.init(container || document);
  initHeroMotion(container || document);
  initSistemaShowcase(container || document);
  if (fromBarba) return;

  const root = container || document;
  const titleLines = root.querySelectorAll('.hero-title-line');
  if (!titleLines.length) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo(titleLines,
    { yPercent: 108, opacity: 0 },
    { yPercent: 0, opacity: 1, duration: 0.92, stagger: 0.16, ease: 'power3.out' }
  )
    .fromTo('.hero-e-sub', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.72 }, '-=0.42')
    .fromTo('.hero-e-ctas > *', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.09 }, '-=0.4')
    .fromTo('.hero-e-trust', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.32')
    .fromTo('.hero-e-social', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.58 }, '-=0.35')
    .fromTo('.hero-e-visual', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.88 }, '-=0.48');
}

let heroMotionCtx;
let sistemaShowcaseCtx;

const SISTEMA_METRICS = {
  web: { val: '94', lbl: 'Lighthouse' },
  branding: { val: '×2.8', lbl: 'Recuerdo de marca' },
  ads: { val: '3.2×', lbl: 'ROAS medio' },
  '3d': { val: '+68%', lbl: 'Tiempo en página' },
};

function initSistemaShowcase(root) {
  document.getElementById('service-preview')?.remove();

  sistemaShowcaseCtx?.revert();
  sistemaShowcaseCtx = null;

  const section = (root || document).querySelector('.sistema-scroll');
  if (!section) return;

  const pin = section.querySelector('.sistema-scroll-pin');
  const body = section.querySelector('.sistema-scroll-body');
  const track = section.querySelector('.sistema-scroll-track');
  const steps = gsap.utils.toArray('.sistema-step', section);
  const slides = gsap.utils.toArray('.sistema-visual-slide', section);
  const metricVal = section.querySelector('.sistema-metric-val');
  const metricLbl = section.querySelector('.sistema-metric-lbl');
  const meterFill = section.querySelector('.sistema-scroll-meter-fill');
  const meterCurrent = section.querySelector('.sistema-meter-current');
  const total = steps.length;
  let activeIndex = 0;
  let activeId = steps[0]?.dataset.service || 'web';

  const clampIndex = i => gsap.utils.clamp(0, total - 1, i);

  function setMetric(id) {
    const m = SISTEMA_METRICS[id];
    if (!m || !metricVal || !metricLbl) return;
    metricVal.textContent = m.val;
    metricLbl.textContent = m.lbl;
  }

  function setProgress(index) {
    const pct = ((index + 1) / total) * 100;
    track?.style.setProperty('--sistema-progress', `${pct}%`);
    if (meterFill) meterFill.style.width = `${pct}%`;
    if (meterCurrent) meterCurrent.textContent = String(index + 1).padStart(2, '0');
  }

  function activate(index, { animate = false, force = false } = {}) {
    const i = clampIndex(index);
    const step = steps[i];
    if (!step) return;
    const id = step.dataset.service;
    if (!force && i === activeIndex && id === activeId) return;

    const prevSlide = slides.find(s => s.dataset.service === activeId);
    const nextSlide = slides.find(s => s.dataset.service === id);

    steps.forEach((s, idx) => s.classList.toggle('is-active', idx === i));
    slides.forEach(s => s.classList.toggle('is-active', s.dataset.service === id));

    activeIndex = i;
    activeId = id;
    setProgress(i);

    if (!animate) {
      setMetric(id);
      slides.forEach(slide => {
        const on = slide.dataset.service === id;
        gsap.set(slide, { opacity: on ? 1 : 0, scale: on ? 1 : 1.04 });
      });
      return;
    }

    if (metricVal && metricLbl) {
      gsap.to([metricVal, metricLbl], {
        opacity: 0,
        y: -6,
        duration: 0.14,
        ease: 'power2.in',
        onComplete: () => {
          setMetric(id);
          gsap.fromTo([metricVal, metricLbl],
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.28, ease: 'power3.out' }
          );
        },
      });
    } else {
      setMetric(id);
    }

    if (prevSlide && nextSlide) {
      gsap.killTweensOf(slides);
      gsap.to(prevSlide, { opacity: 0, scale: 1.03, duration: 0.38, ease: 'power2.in' });
      gsap.to(nextSlide, { opacity: 1, scale: 1, duration: 0.52, ease: 'power3.out' });
    }
  }

  function scrubVisuals(progress) {
    const raw = gsap.utils.clamp(0, total - 1, progress * (total - 1));
    const fromIdx = Math.floor(raw);
    const toIdx = Math.min(fromIdx + 1, total - 1);
    const frac = raw - fromIdx;
    const rounded = Math.round(raw);

    steps.forEach((step, idx) => {
      let opacity = 0.28;
      if (idx === fromIdx) opacity = 1 - frac * 0.72;
      else if (idx === toIdx) opacity = 0.28 + frac * 0.72;
      gsap.set(step, { opacity, y: idx === rounded ? 0 : 8 });
      step.classList.toggle('is-active', idx === rounded);
    });

    slides.forEach(slide => {
      const idx = steps.findIndex(s => s.dataset.service === slide.dataset.service);
      let opacity = 0;
      let scale = 1.04;
      if (idx === fromIdx) {
        opacity = 1 - frac;
        scale = 1 + frac * 0.03;
      } else if (idx === toIdx) {
        opacity = frac;
        scale = 1.04 - frac * 0.04;
      }
      gsap.set(slide, { opacity, scale });
      slide.classList.toggle('is-active', idx === rounded);
    });

    if (rounded !== activeIndex) {
      activeIndex = rounded;
      activeId = steps[rounded].dataset.service;
      setProgress(rounded);
      setMetric(activeId);
    }
  }

  sistemaShowcaseCtx = gsap.context(() => {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 901px)', () => {
      const scrollDistance = () => window.innerHeight * 0.82 * Math.max(1, total - 1);

      ScrollTrigger.create({
        trigger: body,
        start: 'top 72px',
        end: () => `+=${scrollDistance()}`,
        pin: pin,
        scrub: 0.7,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: total > 1 ? {
          snapTo: value => {
            const step = 1 / (total - 1);
            return gsap.utils.clamp(0, 1, Math.round(value / step) * step);
          },
          duration: { min: 0.15, max: 0.4 },
          delay: 0.04,
          ease: 'power2.out',
        } : false,
        onUpdate(self) {
          scrubVisuals(self.progress);
        },
        onLeave: () => activate(total - 1, { force: true }),
        onEnterBack: () => activate(0, { force: true }),
      });

      activate(0, { force: true });
    });

    mm.add('(max-width: 900px)', () => {
      steps.forEach(step => step.classList.remove('is-active'));
      if (steps[0]) steps[0].classList.add('is-active');

      steps.forEach(step => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 58%',
          end: 'bottom 42%',
          onEnter: () => step.classList.add('is-active'),
          onLeave: () => step.classList.remove('is-active'),
          onEnterBack: () => step.classList.add('is-active'),
          onLeaveBack: () => step.classList.remove('is-active'),
        });

        gsap.from(step.querySelector('.sistema-step-copy'), {
          opacity: 0,
          y: 22,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 82%',
            once: true,
          },
        });

        gsap.from(step.querySelector('.sistema-step-media'), {
          opacity: 0,
          scale: 0.97,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 78%',
            once: true,
          },
        });
      });
    });

    gsap.from(section.querySelector('.sistema-scroll-header'), {
      opacity: 0,
      y: 28,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 78%',
        once: true,
      },
    });
  }, section);
}

function initHeroMotion(root) {
  const titleMorph = root.querySelector('#heroTitleMorph');
  if (!titleMorph) return;

  MorphText.kill(titleMorph);
  heroMotionCtx?.revert();
  heroMotionCtx = null;

  heroMotionCtx = gsap.context(() => {
    const morph = MorphText.create(titleMorph, { interval: 4000, duration: 0.64 });
    gsap.delayedCall(2.4, () => morph?.start());
  }, root);
}

/* ─── Sistema Nodo — horizontal containerAnimation ─── */
function directionalSnap(increment) {
  const snapFunc = gsap.utils.snap(increment);
  return (raw, self) => {
    const n = snapFunc(raw);
    return Math.abs(n - raw) < 1e-4 || (n < raw) === self.direction < 0
      ? n
      : self.direction < 0 ? n - increment : n + increment;
  };
}

function initSistemaPin(root) {
  const section = root.querySelector('.sistema-section');
  if (!section) return;

  const panels = gsap.utils.toArray('.sp-panel', section);
  const fill = section.querySelector('#sistemaFill');
  const counter = section.querySelector('#sistemaCounter');
  const TOTAL = panels.length;

  const mm = gsap.matchMedia();

  mm.add('(min-width: 769px)', () => {
    gsap.set(section, { clearProps: 'height' });
    gsap.set(panels, { clearProps: 'transform,xPercent' });

    panels.forEach((panel, i) => {
      if (i === 0) return;
      const items = panel.querySelectorAll('.sp-eyebrow, .sp-headline, .sp-body, .sp-tension, .sp-pills, .sp-cta');
      gsap.set(items, { opacity: 0, y: 28 });
    });

    const scrollTween = gsap.to(panels, {
      xPercent: -100 * (TOTAL - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        pin: true,
        anticipatePin: 1,
        scrub: 1,
        snap: {
          snapTo: directionalSnap(1 / (TOTAL - 1)),
          duration: { min: 0.3, max: 0.7 },
          delay: 0.1,
          ease: 'power1.inOut',
        },
        end: () => `+=${window.innerHeight * TOTAL}`,
        invalidateOnRefresh: true,
        onUpdate(self) {
          if (fill) fill.style.width = `${self.progress * 100}%`;
          const idx = Math.min(Math.round(self.progress * (TOTAL - 1)), TOTAL - 1);
          if (counter) counter.textContent = String(idx + 1).padStart(2, '0');
        },
      },
    });

    panels.forEach((panel, i) => {
      if (i === 0) return;
      const items = panel.querySelectorAll('.sp-eyebrow, .sp-headline, .sp-body, .sp-tension, .sp-pills, .sp-cta');
      gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          containerAnimation: scrollTween,
          start: 'left center',
          toggleActions: 'play none none reset',
        },
      }).to(items, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.09,
        ease: 'power2.out',
      });
    });

    return () => {
      gsap.set(panels, { clearProps: 'all' });
      panels.forEach(panel => {
        panel.querySelectorAll('.sp-eyebrow, .sp-headline, .sp-body, .sp-tension, .sp-pills, .sp-cta').forEach(el => {
          gsap.set(el, { clearProps: 'all' });
        });
      });
      if (fill) fill.style.width = '0%';
      if (counter) counter.textContent = '01';
    };
  });

  mm.add('(max-width: 768px)', () => {
    const container = section.querySelector('.sp-container');
    const dots = gsap.utils.toArray('.sp-m-dot', section);
    if (!container) return;

    section.classList.add('is-mobile-ready');
    gsap.set(section, { clearProps: 'height' });
    gsap.set(container, { clearProps: 'all' });
    gsap.set(panels, { clearProps: 'all' });

    panels.forEach(panel => {
      panel.querySelectorAll('.sp-eyebrow, .sp-headline, .sp-body, .sp-tension, .sp-pills, .sp-cta').forEach(el => {
        gsap.set(el, { clearProps: 'all', opacity: 1, y: 0 });
      });
    });

    const ac = new AbortController();
    const { signal } = ac;
    let activeIdx = 0;

    function panelWidth() {
      return container.clientWidth || window.innerWidth;
    }

    function setActive(idx) {
      activeIdx = Math.max(0, Math.min(idx, TOTAL - 1));
      const progress = TOTAL > 1 ? activeIdx / (TOTAL - 1) : 0;
      if (fill) fill.style.width = `${progress * 100}%`;
      if (counter) counter.textContent = String(activeIdx + 1).padStart(2, '0');
      dots.forEach((dot, i) => {
        const on = i === activeIdx;
        dot.classList.toggle('is-active', on);
        dot.setAttribute('aria-selected', on ? 'true' : 'false');
      });
    }

    function animatePanel(panel) {
      const items = panel.querySelectorAll('.sp-eyebrow, .sp-headline, .sp-body, .sp-tension, .sp-pills, .sp-cta');
      gsap.fromTo(items,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out', overwrite: 'auto' }
      );
    }

    function onScroll() {
      const idx = Math.round(container.scrollLeft / panelWidth());
      if (idx !== activeIdx) {
        setActive(idx);
        animatePanel(panels[idx]);
      }
    }

    container.addEventListener('scroll', onScroll, { passive: true, signal });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = Number(dot.dataset.slide);
        container.scrollTo({ left: idx * panelWidth(), behavior: 'smooth' });
        setActive(idx);
        animatePanel(panels[idx]);
      }, { signal });
    });

    setActive(0);
    animatePanel(panels[0]);

    return () => {
      ac.abort();
      section.classList.remove('is-mobile-ready');
      if (fill) fill.style.width = '0%';
      if (counter) counter.textContent = '01';
      dots.forEach(dot => {
        dot.classList.remove('is-active');
        dot.setAttribute('aria-selected', 'false');
      });
      if (dots[0]) {
        dots[0].classList.add('is-active');
        dots[0].setAttribute('aria-selected', 'true');
      }
    };
  });
}

/* ─── Acordeón rendimiento ─── */
function initPerfAccordion(root) {
  const accordion = root.querySelector('#perfAccordion');
  const trigger = root.querySelector('#perfTrigger');
  const panel = root.querySelector('#perfPanel');
  if (!accordion || !trigger || !panel || accordion.dataset.bound) return;
  accordion.dataset.bound = 'true';

  let open = false;

  function setOpen(next) {
    open = next;
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    accordion.classList.toggle('is-open', open);

    if (open) {
      panel.hidden = false;
      gsap.fromTo(panel, { height: 0, opacity: 0 }, {
        height: 'auto',
        opacity: 1,
        duration: 0.45,
        ease: 'power2.out',
        onComplete: () => ScrollTrigger.refresh(),
      });
      panel.querySelectorAll('[data-count]').forEach(el => {
        if (el.dataset.counted) return;
        el.dataset.counted = 'true';
        const target = parseInt(el.dataset.count, 10);
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate() {
            el.textContent = String(Math.round(this.targets()[0].val));
          },
        });
      });
      panel.querySelectorAll('.perf-bar-fill').forEach(el => {
        const w = parseFloat(el.dataset.width) || 0;
        gsap.fromTo(el, { width: '0%' }, { width: `${w}%`, duration: 1.2, ease: 'power2.out' });
      });
    } else {
      gsap.to(panel, {
        height: 0,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          panel.hidden = true;
          gsap.set(panel, { clearProps: 'height' });
          ScrollTrigger.refresh();
        },
      });
    }
  }

  trigger.addEventListener('click', () => setOpen(!open));
}

/* ─── Casos slider ─── */
function initCasesSlider(root) {
  const wrap = root.querySelector('#casesSlider');
  if (!wrap) return;

  const slides = Array.from(wrap.querySelectorAll('.cs-card'));
  const dots = Array.from(wrap.querySelectorAll('.cs-dot'));
  const prev = root.querySelector('#casesPrev');
  const next = root.querySelector('#casesNext');
  let current = 0;

  function goTo(i) {
    slides[current].classList.remove('is-active');
    dots[current]?.classList.remove('is-active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    dots[current]?.classList.add('is-active');
    gsap.fromTo(slides[current],
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
  }

  prev?.addEventListener('click', () => goTo(current - 1));
  next?.addEventListener('click', () => goTo(current + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
}

function initWork(container, fromBarba) {
  WorkModal.init(container || document);
}

function initAbout() {}

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
   POINTER FX — botones hero + magnetic suave
═══════════════════════════════════════════════════ */
function initPointerFX(scope) {
  const root = scope || document;

  root.querySelectorAll('.btn-breathe').forEach(btn => {
    if (btn.dataset.breathe) return;
    btn.dataset.breathe = '1';

    gsap.set(btn, { transformPerspective: 900, transformStyle: 'preserve-3d' });
    const rotX = gsap.quickTo(btn, 'rotateX', { duration: 0.85, ease: 'power3.out' });
    const rotY = gsap.quickTo(btn, 'rotateY', { duration: 0.85, ease: 'power3.out' });
    const lift = gsap.quickTo(btn, 'y', { duration: 0.9, ease: 'power3.out' });

    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rotY(px * 14);
      rotX(-py * 10);
      lift(-3 + py * -2);
      btn.style.setProperty('--spot-x', `${(px + 0.5) * 100}%`);
      btn.style.setProperty('--spot-y', `${(py + 0.5) * 100}%`);
    });

    btn.addEventListener('mouseleave', () => {
      rotX(0);
      rotY(0);
      lift(0);
    });
  });

  root.querySelectorAll('.magnetic').forEach(el => {
    if (el.dataset.magnetic) return;
    el.dataset.magnetic = '1';
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3.out' });

    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.18);
      yTo((e.clientY - r.top - r.height / 2) * 0.18);
    });
    el.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
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
      SmoothScroll.scrollTo(target, { offset: -80, duration: 1.25 });
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
  SmoothScroll.init();
  setPageTheme();
  Transition.resetPanel();
  initPointerFX();
  initSmoothScroll();

  const loaderEl = document.getElementById('nodo-loader');
  if (namespace !== 'home' && loaderEl) {
    gsap.set(loaderEl, { display: 'none' });
  }

  const startApp = (fromBarba = false) => {
    finishBoot();
    Nav.animateIn();
    SmoothScroll.resize();
    ScrollFX.init(document);
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
