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
  chiquitana: {
    title: 'La Chiquitana',
    tag: 'Panadería · Código a mano',
    year: '2024–26',
    desc: 'Web a mano para panadería en Pubilla Cases. En ~2 años la han encontrado más de 30.000 veces en Google, en primera página, sin anuncios.',
    stack: ['HTML/CSS/JS', 'GSAP', 'SEO técnico', 'Hecho a mano'],
    results: ['+30.000 hallazgos en Google', 'Primera página sin ads', 'Marca con alma'],
    link: 'https://lachiquitana.com',
    img: 'img/reveal/chiquitana.jpg',
  },
  hitachi: {
    title: 'Clínica Dental Hitachi',
    tag: 'Dental · L\'Hospitalet',
    year: '2025',
    desc: 'Presencia digital clara para la clínica: confianza desde el primer segundo y camino claro a pedir cita.',
    stack: ['HTML/CSS/JS', 'GSAP', 'Conversión', 'SEO local'],
    results: ['Web profesional', 'Clínica Can Vidalet', 'Hecha a mano'],
    link: 'https://clinicadentalhitachi.com',
    img: 'img/reveal/hitachi.webp',
  },
  javipato: {
    title: 'Javi Pato Tattoo',
    tag: 'Tattoo · Realismo · Anime',
    year: '2025',
    desc: 'Sitio de tatuador con peso visual: galería, estilo y reserva sin ruido.',
    stack: ['HTML/CSS/JS', 'GSAP', 'Galería', 'Mobile-first'],
    results: ['Look de estudio', 'Galería protagonista', 'Hecho a mano'],
    link: 'https://nodoamd.github.io/javipato-tattoo/',
    img: 'img/reveal/javipato.jpg',
  },
  betterwlprs: {
    title: 'BetterWLPRS',
    tag: 'Galería · Wallpapers',
    year: '2025',
    desc: 'Galería de wallpapers capturados in-game: hero con presencia y acceso libre a la library.',
    stack: ['HTML/CSS/JS', 'GSAP', 'Galería', 'Dark UI'],
    results: ['Hero con punch', '1000+ escenas', 'Sin signup para mirar'],
    link: 'https://nodoamd.github.io/betterwlprs/',
    img: 'img/reveal/betterwlprs.jpg',
  },
  aprendalia: {
    title: 'Aprendalia',
    tag: 'Edu · Producto by Nodo',
    year: '2025',
    desc: 'Producto de aprendizaje: rutas, lecciones y progreso — UI limpia para estudiar de verdad.',
    stack: ['HTML/CSS/JS', 'UI producto', 'Rutas', 'Mobile app feel'],
    results: ['Home de aprendiz', 'Rutas España', 'By Nodo'],
    link: 'https://nodoamd.github.io/aprendalia/learnia.html#home',
    img: 'img/reveal/aprendalia.jpg',
  },
  entorno: {
    title: 'Entorno',
    tag: 'Naturaleza · L\'Hospitalet',
    year: '2025',
    desc: 'App para conectar con especies cerca de ti: atlas local, cámara y cuaderno.',
    stack: ['HTML/CSS/JS', 'UI dark', 'Local-first', 'Producto'],
    results: ['Especies cerca', 'L\'Hospitalet', 'By Nodo'],
    link: 'https://nodoamd.github.io/nodo-entorno/',
    img: 'img/reveal/entorno.jpg',
  },
  reader: {
    title: 'Nodo Reader',
    tag: 'Producto · Lectura',
    year: '2025',
    desc: 'Pieza de producto Nodo orientada a lectura y foco.',
    stack: ['HTML/CSS/JS', 'UI', 'Producto'],
    results: ['Hecho en Nodo', 'Experiencia limpia'],
    link: 'https://nodoamd.github.io/nodo-reader/',
    img: 'img/work/reader.jpg',
  },
  sakura: {
    title: 'Sakura Candles',
    tag: 'Producto · Velas',
    year: '2025',
    desc: 'Web de marca para velas: atmósfera, producto y sensación premium desde el primer scroll.',
    stack: ['HTML/CSS/JS', 'GSAP', 'Producto', 'Mobile-first'],
    results: ['Marca con presencia', 'Hecho a mano'],
    link: 'https://nodoamd.github.io/sakura-candles/',
    img: 'img/work/sakura.jpg',
  },
  cfc: {
    title: 'CFC Barcelona',
    tag: 'Academia de fútbol · Barcelona & EE. UU.',
    year: '2025',
    desc: 'Web en inglés para una academia de fútbol con entrenadores UEFA Pro: programas, tours de desarrollo en Barcelona y captación de jugadores en Estados Unidos.',
    stack: ['HTML/CSS/JS', 'Landing de captación', 'Formulario', 'Mercado USA'],
    results: ['Web en inglés', 'Captación internacional', 'Hecha a mano'],
    link: 'https://nodoamd.github.io/cfc/',
    img: 'img/work/cfc.jpg',
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
  const q = s => document.querySelector(`#nodo-loader ${s}`);

  function splitWord(word) {
    if (word.dataset.split) return;
    word.dataset.split = '1';
    const parts = word.textContent.trim().split(/\s+/);
    const from = [0x6c, 0x63, 0xff];
    const to = [0xd9, 0x46, 0xef];
    word.textContent = '';
    parts.forEach((part, wi) => {
      const w = document.createElement('span');
      w.className = 'ld-w';
      [...part].forEach((ch, ci) => {
        const c = document.createElement('span');
        c.className = 'ld-ch';
        c.textContent = ch;
        if (wi > 0) {
          const t = part.length > 1 ? ci / (part.length - 1) : 0;
          c.style.color = `rgb(${from.map((v, k) => Math.round(v + (to[k] - v) * t)).join(',')})`;
        }
        w.appendChild(c);
      });
      word.appendChild(w);
    });
  }

  function init(onComplete) {
    const loader = document.getElementById('nodo-loader');
    if (!loader) { onComplete?.(); return; }

    const word = q('[data-ld-word]');
    splitWord(word);
    const el = {
      halves: [q('.ld-half--top'), q('.ld-half--bot')],
      chars: loader.querySelectorAll('.ld-ch'),
      line: q('.ld-line i'),
      tag: q('.ld-tag span'),
      count: q('[data-ld-count]'),
    };
    const page = document.querySelector('[data-barba="container"]');

    let seen = false;
    try {
      seen = sessionStorage.getItem('nodoLoaderSeen') === '1';
      sessionStorage.setItem('nodoLoaderSeen', '1');
    } catch (e) { /* private mode */ }

    const done = () => {
      gsap.set(loader, { display: 'none' });
      if (page) gsap.set(page, { clearProps: 'transform,filter,transformOrigin' });
      onComplete?.();
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el.chars, { yPercent: 0 });
      gsap.to(loader, { opacity: 0, duration: 0.5, delay: 0.5, onComplete: done });
      return;
    }

    gsap.set(loader, { display: 'block', opacity: 1 });
    gsap.set(el.halves, { yPercent: 0 });
    gsap.set(el.chars, { yPercent: 115 });
    gsap.set(el.line, { scaleX: 0, opacity: 1 });
    gsap.set(el.tag, { yPercent: 110, opacity: 0 });
    gsap.set(el.count, { opacity: 0 });

    const progress = { v: 0 };
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: done });
    tl.timeScale(seen ? 1.8 : 1);

    tl.to(el.chars, { yPercent: 0, duration: 1.3, stagger: 0.035 }, 0.15)
      .to(el.tag, { yPercent: 0, opacity: 1, duration: 1.1 }, 0.75)
      .to(el.count, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.4)
      .to(progress, {
        v: 1,
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate() {
          gsap.set(el.line, { scaleX: progress.v * 0.42 });
          if (el.count) el.count.textContent = String(Math.round(progress.v * 100)).padStart(2, '0');
        },
      }, 0.3)

      .addLabel('out', 1.8)
      .to(el.chars, { yPercent: -115, duration: 0.75, stagger: 0.022, ease: 'power4.in' }, 'out')
      .to([el.tag, el.count], { opacity: 0, duration: 0.4, ease: 'power2.in' }, 'out')
      .to(el.line, { scaleX: 1, duration: 0.9, ease: 'expo.inOut' }, 'out+=0.25')

      .addLabel('open', 'out+=0.8')
      .to(el.halves[0], { yPercent: -101, duration: 1.15, ease: 'expo.inOut' }, 'open')
      .to(el.halves[1], { yPercent: 101, duration: 1.15, ease: 'expo.inOut' }, 'open')
      .to(el.line, { opacity: 0, duration: 0.35, ease: 'power2.out' }, 'open+=0.15')
      .add(() => gsap.set(loader, { pointerEvents: 'none' }), 'open');

    if (page) {
      const blur = window.matchMedia('(min-width: 900px) and (hover: hover)').matches;
      gsap.set(page, { transformOrigin: '50% 30vh' });
      tl.fromTo(page,
        { scale: 1.06, filter: blur ? 'blur(6px)' : 'none' },
        { scale: 1, filter: blur ? 'blur(0px)' : 'none', duration: 1, ease: 'expo.out', immediateRender: true },
        'open+=0.15');
    }
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

  // The "Built with Spline" badge lives in the viewer's shadow DOM and is re-inserted on load.
  function hideBadge(viewer) {
    let tries = 0;
    const tick = () => {
      const sr = viewer.shadowRoot;
      if (sr && !sr.querySelector('style[data-nodo]')) {
        const st = document.createElement('style');
        st.dataset.nodo = '';
        st.textContent = '#logo, a[href*="spline.design"] { display: none !important; }';
        sr.appendChild(st);
      }
      sr?.querySelectorAll('#logo, a[href*="spline.design"]').forEach(el => el.remove());
      if (++tries < 40 && viewer.isConnected) setTimeout(tick, 250);
    };
    tick();
  }

  function mountViewer(shell, url) {
    const loader = shell.querySelector('.spline-loader');
    shell.querySelector('#hero-spline')?.remove();

    const viewer = document.createElement('spline-viewer');
    viewer.id = 'hero-spline';
    viewer.setAttribute('url', url);
    shell.insertBefore(viewer, loader);
    hideBadge(viewer);

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
      hideBadge(viewer);

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
    <figure class="work-modal-shot"><div class="np-browser-bar"><i></i><i></i><i></i><span class="work-modal-url"></span></div><img alt="" /></figure>
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
    <div class="work-modal-actions">
      <a href="contact.html" class="btn btn-primary work-modal-link magnetic">Hablemos del proyecto →</a>
      <a href="contact.html" class="np-link work-modal-want">Quiero una así →</a>
    </div>
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
      shot:    document.querySelector('.work-modal-shot'),
      want:    document.querySelector('.work-modal-want'),
    };
  }

  function fill(project) {
    const el = els();
    if (!el.modal || !project) return;
    if (el.tag) el.tag.textContent = project.tag;
    if (el.title) el.title.textContent = project.title;
    if (el.desc) el.desc.textContent = project.desc;
    if (el.year) el.year.textContent = project.year;
    if (el.shot) {
      el.shot.hidden = !project.img;
      const img = el.shot.querySelector('img');
      if (img && project.img) { img.src = project.img; img.alt = project.title; }
      const url = el.shot.querySelector('.work-modal-url');
      if (url) url.textContent = (project.link || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
    }
    if (el.want) {
      el.want.href = `https://wa.me/34622494800?text=${encodeURIComponent(`Hola Nodo, he visto ${project.title} y quiero una web así para mi negocio.`)}`;
      el.want.target = '_blank';
      el.want.rel = 'noopener';
    }
    if (el.link) {
      const href = project.link || 'contact.html';
      el.link.href = href;
      const external = /^https?:\/\//i.test(href);
      el.link.textContent = external ? 'Visitar web ↗' : 'Hablemos del proyecto →';
      if (external) {
        el.link.setAttribute('target', '_blank');
        el.link.setAttribute('rel', 'noopener');
      } else {
        el.link.removeAttribute('target');
        el.link.removeAttribute('rel');
      }
    }
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
      if (location.protocol !== 'file:' && typeof barba !== 'undefined' && barba.go) {
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
        if (/^https?:\/\//i.test(href)) {
          // externo: deja que el navegador abra (target=_blank)
          return;
        }
        e.preventDefault();
        navigateFromModal(href);
      });
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && open) hide();
      });
    }

    root.querySelectorAll('.work-card[data-project], .np-card[data-project]').forEach(card => {
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

    let pending = null;

    function goTo(nextIdx) {
      if (!items[nextIdx]) return;
      if (busy) { pending = nextIdx; return; }
      pending = null;
      if (nextIdx === idx) return;
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
          if (pending !== null) goTo(pending);
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
    { selector: '#resultados', word: 'Aumenta' },
    { selector: '#nodo-conecta', word: 'Conecta' },
    { selector: '#servicios', word: 'Transforma' },
    { selector: '#testimonios', word: 'Mejora' },
    { selector: '#precios', word: 'Crece' },
    { selector: '#contacto-final', word: 'Conecta' },
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
    const tagged = namespace === 'home' ? [] : [...root.querySelectorAll('[data-nav-word]')];
    const sections = namespace === 'home'
      ? HOME_WORDS
      : tagged.length
        ? tagged.map((el, i) => {
          if (!el.id) el.id = `nav-word-${i}`;
          return { selector: `#${el.id}`, word: el.dataset.navWord };
        })
        : [{ selector: 'main', word: 'Nodo' }];

    morphCtx = gsap.context(() => {
      const entries = [];
      const sync = () => {
        const active = entries.filter(e => e.st.isActive).pop();
        if (active) setNavWord(active.word);
      };
      sections.forEach(({ selector, word }) => {
        const trigger = root.querySelector(selector);
        if (!trigger) return;
        const st = ScrollTrigger.create({
          trigger,
          start: 'top 58%',
          end: 'bottom 42%',
          onToggle: () => gsap.delayedCall(0, sync),
        });
        entries.push({ st, word });
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
    if (nodoClockTimer) {
      clearInterval(nodoClockTimer);
      nodoClockTimer = null;
    }
    if (ncVisitTimer) {
      clearInterval(ncVisitTimer);
      ncVisitTimer = null;
    }
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
      initNodoConecta(root);
      initNodoPages(root);
      initNcVoices(root);
      initNcVisit(root);

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
const NC_VOICES = [
  { url: 'clinicadentalhitachi.com', metric: '×3', label: 'llamadas al mes' },
  { url: 'lachiquitana.com', metric: '+30.000', label: 'impresiones en Google' },
];

function initNcVoices(root) {
  const section = root.querySelector('[data-voices]');
  if (!section) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tabs = [...section.querySelectorAll('[data-voice-tab]')];
  const quotes = [...section.querySelectorAll('[data-voice]')];
  const shots = [...section.querySelectorAll('[data-voice-shot]')];
  const url = section.querySelector('[data-voice-url]');
  const metric = section.querySelector('[data-voice-metric]');
  const label = section.querySelector('[data-voice-label]');
  const sticker = section.querySelector('.nc-voices-sticker');
  const browser = section.querySelector('.nc-voices-browser');
  const HOLD = 7;

  quotes.forEach(q => {
    const p = q.querySelector('p');
    if (!p || p.dataset.split) return;
    p.dataset.split = '1';
    const walk = (node) => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement('span');
            w.className = 'nc-vw';
            w.textContent = part;
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(p);
  });

  let current = 0;
  let bar = null;
  let inView = false;
  let hovered = false;
  let played = false;

  const runBar = () => {
    bar?.kill();
    const fill = tabs[current]?.querySelector('i');
    tabs.forEach(t => gsap.set(t.querySelector('i'), { scaleX: 0 }));
    if (!fill || reduce) return;
    bar = gsap.fromTo(fill, { scaleX: 0 }, {
      scaleX: 1, duration: HOLD, ease: 'none',
      onComplete: () => show((current + 1) % quotes.length),
    });
    if (!inView || hovered) bar.pause();
  };

  const show = (i, instant = false) => {
    const prev = current;
    current = i;
    tabs.forEach((t, k) => {
      t.classList.toggle('is-active', k === i);
      t.setAttribute('aria-selected', k === i ? 'true' : 'false');
    });
    quotes.forEach((q, k) => q.setAttribute('aria-hidden', k === i ? 'false' : 'true'));
    const data = NC_VOICES[i] || {};
    const d = instant || reduce ? 0 : 1;

    if (prev !== i) {
      const out = quotes[prev];
      gsap.to(out.querySelectorAll('.nc-vw, footer'), {
        opacity: 0, y: -18, duration: 0.35 * d, stagger: 0.008 * d, ease: 'power2.in',
        onComplete: () => out.classList.remove('is-active'),
      });
    }
    const inQ = quotes[i];
    inQ.classList.add('is-active');
    gsap.fromTo(inQ.querySelectorAll('.nc-vw'),
      { opacity: 0, y: 40, rotate: 3 },
      { opacity: 1, y: 0, rotate: 0, duration: 0.9 * d, stagger: 0.035 * d, ease: 'expo.out', delay: prev !== i ? 0.3 * d : 0 });
    gsap.fromTo(inQ.querySelector('footer'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 * d, delay: 0.6 * d, ease: 'power3.out' });

    shots.forEach((s, k) => {
      if (k === i) {
        s.style.zIndex = 2;
        gsap.fromTo(s, { clipPath: 'inset(0% 0% 100% 0%)', scale: 1.08 },
          { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.1 * d, ease: 'expo.inOut',
            onComplete: () => shots.forEach((o, j) => { if (j !== i) gsap.set(o, { clipPath: 'inset(0% 0% 100% 0%)' }); }) });
      } else {
        s.style.zIndex = 1;
      }
    });

    if (browser && prev !== i) gsap.fromTo(browser, { rotate: -2 }, { rotate: i % 2 ? 1.5 : -2, duration: 1.2 * d, ease: 'elastic.out(1, 0.6)' });
    if (url) url.textContent = data.url || '';
    if (sticker) {
      gsap.timeline()
        .to(sticker, { scale: 0.6, opacity: 0, duration: 0.25 * d, ease: 'power2.in' })
        .add(() => { if (metric) metric.textContent = data.metric || ''; if (label) label.textContent = data.label || ''; })
        .to(sticker, { scale: 1, opacity: 1, rotate: i % 2 ? -4 : 4, duration: 0.8 * d, ease: 'back.out(2.2)' });
    }
    runBar();
  };

  section._voicesAbort?.abort();
  const ac = new AbortController();
  section._voicesAbort = ac;
  const on = { signal: ac.signal };
  const stage = section.querySelector('.nc-voices-stage');
  tabs.forEach((t, k) => t.addEventListener('click', () => { if (k !== current) show(k); }, on));
  stage?.addEventListener('pointerenter', () => { hovered = true; bar?.pause(); }, on);
  stage?.addEventListener('pointerleave', () => { hovered = false; if (inView) bar?.resume(); }, on);

  gsap.set(quotes.filter((_, k) => k !== 0).map(q => q.querySelectorAll('.nc-vw, footer')), { opacity: 0 });
  gsap.set(quotes[0].querySelectorAll('.nc-vw'), { opacity: 0, y: 40 });

  ScrollTrigger.create({
    trigger: section,
    start: 'top 70%',
    end: 'bottom 20%',
    onEnter: () => { inView = true; if (!played) { played = true; show(0); } else if (!hovered) bar?.resume(); },
    onEnterBack: () => { inView = true; if (!hovered) bar?.resume(); },
    onLeave: () => { inView = false; bar?.pause(); },
    onLeaveBack: () => { inView = false; bar?.pause(); },
  });

  if (!reduce) {
    gsap.fromTo(section.querySelector('.nc-voices-visual'), { y: 60 }, {
      y: -40, ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
    });
  }
}

let ncVisitTimer = null;

function initNcVisit(root) {
  const body = root.querySelector('.nc-foot-body');
  if (!body) return;
  let block = body.querySelector('.nc-visit');
  if (!block) {
    block = document.createElement('div');
    block.className = 'nc-visit';
    block.innerHTML = `<p class="nc-visit-row"><span class="nc-live-dot"></span><span class="nc-visit-time" aria-hidden="true"></span></p>`;
    body.prepend(block);
  }
  const timeEl = block.querySelector('.nc-visit-time');
  const fmtFull = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  timeEl.innerHTML = '';
  const boxes = [];
  fmtFull.format(new Date()).split('').forEach(ch => {
    if (ch === ':') {
      const c = document.createElement('span');
      c.className = 'nc-visit-colon';
      c.textContent = ':';
      timeEl.appendChild(c);
      boxes.push(null);
      return;
    }
    const box = document.createElement('span');
    box.className = 'nc-dg';
    box.innerHTML = `<span>${ch}</span>`;
    timeEl.appendChild(box);
    boxes.push(box);
  });
  let last = fmtFull.format(new Date());

  const roll = (box, ch) => {
    const old = box.lastElementChild;
    const next = document.createElement('span');
    next.textContent = ch;
    box.appendChild(next);
    gsap.fromTo(next, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: 'expo.out' });
    gsap.to(old, { yPercent: -100, duration: 0.7, ease: 'expo.out', onComplete: () => old.remove() });
  };

  const tick = () => {
    const now = fmtFull.format(new Date());
    now.split('').forEach((ch, i) => {
      if (boxes[i] && ch !== last[i]) roll(boxes[i], ch);
    });
    last = now;
  };
  if (ncVisitTimer) clearInterval(ncVisitTimer);
  ncVisitTimer = setInterval(tick, 1000);
}

const NcReach = (() => {
  let el = null;
  function init() {
    if (el || document.querySelector('.nc-reach')) return;
    el = document.createElement('div');
    el.className = 'nc-reach';
    el.innerHTML = `
      <div class="nc-reach-menu" id="nc-reach-menu">
        <a href="https://wa.me/34622494800?text=Hola%20Nodo%2C%20he%20visto%20vuestra%20web%20y%20quiero%20la%20m%C3%ADa." target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.2-.8-2.7-1.1-4.4-3.9-4.6-4.1-.1-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.2 1.3Z"/></svg>
          <span>WhatsApp<small>Te responde quien hará tu web</small></span>
        </a>
        <a href="tel:+34622494800">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2Z"/></svg>
          <span>Llamar<small>+34 622 494 800</small></span>
        </a>
      </div>
      <button type="button" class="nc-reach-toggle" aria-expanded="false" aria-controls="nc-reach-menu">
        <img src="img/nodedos.png" alt="" width="26" height="26" />
        <span class="nc-live-dot"></span>
        <em>¿Hablamos?</em>
        <b aria-hidden="true">+</b>
      </button>`;
    document.body.appendChild(el);

    const toggle = el.querySelector('.nc-reach-toggle');
    const setOpen = (open) => {
      el.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    toggle.addEventListener('click', () => setOpen(!el.classList.contains('is-open')));
    document.addEventListener('click', (e) => { if (!el.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    el.querySelectorAll('.nc-reach-menu a').forEach(a => a.addEventListener('click', () => setOpen(false)));

    const update = () => {
      const foot = document.querySelector('.nc-foot-body');
      const nearFoot = foot && foot.getBoundingClientRect().top < window.innerHeight;
      const past = window.scrollY > window.innerHeight * 0.6;
      const show = past && !nearFoot;
      el.classList.toggle('is-shown', show);
      if (!show) setOpen(false);
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
  return { init };
})();

function initNodoMarquee(root) {
  const track = root?.querySelector('.marquee-track');
  if (!track) return;

  // Always re-bind: ScrollFX.kill() destroys the tween but left a flag that
  // blocked re-init, so the strip froze after Barba / a failed first pass.
  if (track._marqueeScroll) window.removeEventListener('scroll', track._marqueeScroll);
  if (track._marqueeSettle) clearTimeout(track._marqueeSettle);
  gsap.killTweensOf(track);
  track.classList.add('is-gsap');
  gsap.set(track, { xPercent: 0, force3D: true });

  const loop = gsap.to(track, {
    xPercent: -50,
    duration: 28,
    ease: 'none',
    repeat: -1,
  });

  let paused = false;
  let lastY = window.scrollY;
  let lastT = performance.now();
  const section = track.closest('.marquee-section');
  const setScale = gsap.quickTo(loop, 'timeScale', { duration: 0.35, ease: 'power2.out' });

  const onScroll = () => {
    if (paused) return;
    const now = performance.now();
    const y = window.scrollY;
    const dt = Math.max(16, now - lastT);
    const vel = ((y - lastY) / dt) * 1000;
    lastY = y;
    lastT = now;

    clearTimeout(track._marqueeSettle);
    if (vel < -60) setScale(-1);
    else if (vel > 60) setScale(1);
    // On release (no more scroll events), return to the normal forward course.
    track._marqueeSettle = setTimeout(() => { if (!paused) setScale(1); }, 220);
  };
  track._marqueeScroll = onScroll;
  window.addEventListener('scroll', onScroll, { passive: true });

  if (window.matchMedia('(hover: hover)').matches) {
    section?.addEventListener('mouseenter', () => {
      paused = true;
      clearTimeout(track._marqueeSettle);
      setScale(0);
    });
    section?.addEventListener('mouseleave', () => {
      paused = false;
      setScale(1);
    });
  }
}

/* ═══════════════════════════════════════════════════
   NODO CONECTA — reveal / cylinder / stretch / footer
   Vive dentro de ScrollFX (Barba lo mata con scrollCtx.revert)
═══════════════════════════════════════════════════ */
function splitNodoLine(el) {
  if (el.dataset.nodoSplit === '1') {
    return [...el.querySelectorAll('.nodo-word > span')];
  }
  const parts = [];
  el.childNodes.forEach((node) => {
    if (node.nodeType === 3) {
      node.textContent.trim().split(/\s+/).filter(Boolean).forEach((w) => {
        parts.push({ t: w, em: false });
      });
    } else if (node.nodeName === 'EM') {
      parts.push({ t: node.textContent, em: true });
    }
  });
  el.textContent = '';
  parts.forEach((p, i) => {
    const wrap = document.createElement('span');
    wrap.className = 'nodo-word';
    const inner = document.createElement('span');
    inner.textContent = p.t;
    if (p.em) inner.classList.add('nodo-word-em');
    wrap.appendChild(inner);
    el.appendChild(wrap);
    if (i < parts.length - 1) el.appendChild(document.createTextNode(' '));
  });
  el.dataset.nodoSplit = '1';
  return [...el.querySelectorAll('.nodo-word > span')];
}

function splitNodoChars(el, { accent } = {}) {
  if (el.dataset.nodoSplit === '1') {
    return [...el.querySelectorAll('.nodo-ch')];
  }
  const text = el.textContent;
  el.textContent = '';
  const chars = [];
  [...text].forEach((ch, i) => {
    const wrap = document.createElement('span');
    wrap.className = 'nodo-ch';
    if (accent && accent.includes(i)) wrap.classList.add('is-accent');
    const inner = document.createElement('span');
    inner.className = 'nodo-ch-inner';
    inner.textContent = ch === ' ' ? '\u00A0' : ch;
    wrap.appendChild(inner);
    el.appendChild(wrap);
    chars.push(wrap);
  });
  el.dataset.nodoSplit = '1';
  return chars;
}

let nodoClockTimer = null;

function initNodoConecta(root) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const reveal = root.querySelector('#sistema-reveal');
  if (reveal) {
    const lines = [...reveal.querySelectorAll('.nc-reveal-line')];
    lines.forEach((line) => splitNodoLine(line));
    const first = lines[0] ? [...lines[0].querySelectorAll('.nodo-word > span')] : [];
    gsap.set(reveal.querySelectorAll('.nodo-word > span'), { yPercent: -110 });
    gsap.set(first, { yPercent: 0 });

    const shots = [...reveal.querySelectorAll('.nc-shot')];
    const metaCount = reveal.querySelector('.nc-stage-count b');
    const metaName = reveal.querySelector('.nc-stage-name');
    const metaTag = reveal.querySelector('.nc-stage-tag');
    let activeShot = 0;

    const setMeta = (i) => {
      if (i === activeShot || !shots[i]) return;
      activeShot = i;
      const shot = shots[i];
      gsap.to([metaName, metaTag], {
        opacity: 0,
        y: -6,
        duration: 0.18,
        overwrite: true,
        onComplete() {
          if (metaCount) metaCount.textContent = String(i + 1).padStart(2, '0');
          if (metaName) metaName.textContent = shot.dataset.name || '';
          if (metaTag) metaTag.textContent = shot.dataset.tag || '';
          gsap.fromTo([metaName, metaTag], { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.04 });
        },
      });
    };

    if (shots.length) {
      gsap.set(shots, { zIndex: (i) => i + 1 });
      gsap.set(shots.slice(1), { opacity: 0, yPercent: 14, rotate: 4, scale: 0.94 });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: reveal,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.7,
        onUpdate(self) {
          if (!shots.length) return;
          const i = Math.min(shots.length - 1, Math.floor(self.progress * shots.length));
          setMeta(i);
        },
      },
    });
    lines.slice(1).forEach((line, i) => {
      tl.to([...line.querySelectorAll('.nodo-word > span')], {
        yPercent: 0,
        duration: 1,
        stagger: 0.08,
        ease: 'quint.out',
      }, i === 0 ? 0 : '<25%');
    });

    if (shots.length > 1) {
      const span = tl.duration();
      const step = span / shots.length;
      shots.slice(1).forEach((shot, idx) => {
        const i = idx + 1;
        const at = step * i;
        tl.to(shot, {
          opacity: 1, yPercent: 0, rotate: 0, scale: 1,
          duration: step * 0.7, ease: 'power3.out',
        }, at);
        tl.to(shots[i - 1], {
          yPercent: -5, scale: 0.9, rotate: -3, opacity: 0.45,
          duration: step * 0.7, ease: 'power2.out',
        }, at);
        if (shots[i - 2]) {
          tl.to(shots[i - 2], { opacity: 0, duration: step * 0.5 }, at);
        }
      });
    }
  }

  initNcSearch(root);
  initNcNet(root);
  initNcFooter(root);
  initNcRoi(root);
}

/* ─── Buscador en vivo: la web de Nodo sube al #1 ─── */
const NC_SEARCHES = [
  {
    q: 'panadería boliviana barcelona',
    title: 'La Chiquitana — Panadería boliviana artesana',
    url: 'lachiquitana.com',
    desc: 'Salteñas, cuñapés y pan hecho a mano en Pubilla Cases.',
    icon: 'img/clientes/chiquitana.png',
  },
  {
    q: "dentista l'hospitalet",
    title: 'Clínica Dental Hitachi — Tu dentista en Can Vidalet',
    url: 'clinicadentalhitachi.com',
    desc: 'Tratamientos, equipo y cita en un toque.',
    icon: 'img/clientes/hitachi.webp',
  },
  {
    q: 'tatuador realismo barcelona',
    title: 'Javi Pato Tattoo — Realismo · Anime · Oriental',
    url: 'javipato-tattoo',
    desc: 'Tatuajes personalizados. Galería y reserva directa.',
    icon: 'img/clientes/javipato.png',
  },
];

let ncSearchState = null;

function initNcSearch(root) {
  ncSearchState?.kill();
  ncSearchState = null;

  const ui = root.querySelector('.nc-search-ui');
  if (!ui) return;
  const queryEl = ui.querySelector('.nc-search-query');
  const list = ui.querySelector('.nc-search-results');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let idx = 0;
  let tl = null;
  let alive = true;

  const skel = '<li class="nc-res nc-res--skel"><span class="nc-res-fav"></span><div class="nc-res-body"><i></i><i></i><i></i></div></li>';
  const render = (s) => {
    list.innerHTML = skel + skel + skel +
      `<li class="nc-res nc-res--nodo">
        <img class="nc-res-fav" src="${s.icon}" alt="" width="28" height="28" />
        <div class="nc-res-body">
          <span class="nc-res-url">${s.url}</span>
          <strong class="nc-res-title">${s.title}</strong>
          <span class="nc-res-desc">${s.desc}</span>
        </div>
        <em class="nc-res-badge">Hecha por Nodo</em>
      </li>`;
    return [...list.children];
  };

  const rowStep = (rows) => rows[0].offsetHeight + 10;

  const cycle = () => {
    if (!alive) return;
    const s = NC_SEARCHES[idx % NC_SEARCHES.length];
    idx += 1;
    const rows = render(s);
    const step = rowStep(rows);
    const nodo = rows[3];
    const others = rows.slice(0, 3);
    list.style.height = `${step * 4 - 10}px`;
    gsap.set(rows, { y: (i) => i * step, opacity: 0 });
    queryEl.textContent = '';
    const typed = { n: 0 };

    tl = gsap.timeline();
    tl.to(typed, {
      n: s.q.length,
      duration: s.q.length * 0.05,
      ease: 'none',
      onUpdate() { queryEl.textContent = s.q.slice(0, Math.round(typed.n)); },
    })
      .to(rows, { opacity: 1, duration: 0.35, stagger: 0.07, ease: 'power2.out' }, '+=0.3')
      .to(nodo, { y: 0, duration: 1, ease: 'expo.inOut' }, '+=0.4')
      .to(others, { y: (i) => (i + 1) * step, duration: 1, ease: 'expo.inOut' }, '<')
      .add(() => nodo.classList.add('is-top'), '-=0.25')
      .to({}, { duration: 2.4 })
      .to(rows, { opacity: 0, y: '-=8', duration: 0.3, stagger: 0.03 })
      .add(cycle);
  };

  if (reduce) {
    const rows = render(NC_SEARCHES[0]);
    const step = rowStep(rows);
    list.style.height = `${step * 4 - 10}px`;
    gsap.set(rows[3], { y: 0 });
    gsap.set(rows.slice(0, 3), { y: (i) => (i + 1) * step });
    rows[3].classList.add('is-top');
    queryEl.textContent = NC_SEARCHES[0].q;
    return;
  }

  const st = ScrollTrigger.create({
    trigger: ui,
    start: 'top 85%',
    end: 'bottom 10%',
    onToggle(self) {
      if (self.isActive) {
        if (tl) tl.resume();
        else cycle();
      } else {
        tl?.pause();
      }
    },
  });

  ncSearchState = {
    kill() {
      alive = false;
      tl?.kill();
      st.kill();
    },
  };
}

/* ─── Red Nodo: tu negocio en el centro, todo conectado ─── */
function initNcNet(root) {
  const sec = root.querySelector('.nc-net');
  if (!sec) return;
  const map = sec.querySelector('.nc-net-map');
  const svg = sec.querySelector('.nc-net-svg');
  const core = sec.querySelector('.nc-net-core');
  const countEl = sec.querySelector('.nc-net-count b');
  const nodes = [...sec.querySelectorAll('.nc-net-node')];
  const NS = 'http://www.w3.org/2000/svg';

  svg.innerHTML = '';
  const paths = nodes.map(() => {
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('pathLength', '1');
    path.setAttribute('class', 'nc-net-link');
    svg.appendChild(path);
    return path;
  });

  const centerOf = (el, box) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
  };

  const layout = () => {
    const box = map.getBoundingClientRect();
    if (!box.width) return;
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    const c = centerOf(core, box);
    nodes.forEach((n, i) => {
      const p = centerOf(n, box);
      const bend = i % 2 ? 0.16 : -0.16;
      const qx = (c.x + p.x) / 2 - (p.y - c.y) * bend;
      const qy = (c.y + p.y) / 2 + (p.x - c.x) * bend;
      paths[i].setAttribute('d', `M${c.x.toFixed(1)} ${c.y.toFixed(1)} Q${qx.toFixed(1)} ${qy.toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
    });
  };
  layout();

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    sec.classList.add('is-live');
    if (countEl) countEl.textContent = String(nodes.length);
    return;
  }

  gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set(nodes, { scale: 0.5, opacity: 0 });
  gsap.set(core, { scale: 0.75, opacity: 0 });

  let lastCount = -1;
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sec,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      onRefresh: layout,
      onUpdate(self) {
        sec.classList.toggle('is-live', self.progress > 0.9);
        const count = nodes.filter((n) => gsap.getProperty(n, 'opacity') > 0.5).length;
        if (count !== lastCount && countEl) {
          lastCount = count;
          countEl.textContent = String(count);
        }
      },
    },
  });

  tl.to(core, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.6)' });
  nodes.forEach((n, i) => {
    const at = 0.45 + i * 0.3;
    tl.to(paths[i], { strokeDashoffset: 0, duration: 0.5, ease: 'none' }, at)
      .to(n, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2.2)' }, at + 0.4);
  });
  tl.to({}, { duration: 0.8 });
}

/* ─── Footer: Nodo y Conecta se juntan al llegar ─── */
function initNcFooter(root) {
  const foot = root.querySelector('.nc-foot');
  if (!foot) return;
  const join = foot.querySelector('.nc-foot-join');
  const a = foot.querySelector('.nc-foot-word--a');
  const b = foot.querySelector('.nc-foot-word--b');
  const dot = foot.querySelector('.nc-foot-dot');
  const kicker = foot.querySelector('.nc-foot-join-kicker');
  const hint = foot.querySelector('.nc-foot-join-hint');
  const pin = foot.querySelector('.nc-foot-join-pin');
  const svg = foot.querySelector('.nc-foot-thread');
  const threadPaths = svg ? [...svg.querySelectorAll('path')] : [];

  if (join && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const narrow = () => window.innerWidth < 700;
    const spread = () => Math.min(window.innerWidth * (narrow() ? 0.34 : 0.32), 560);
    const row = foot.querySelector('.nc-foot-join-row');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: join,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.9,
        invalidateOnRefresh: true,
        onUpdate(self) { join.classList.toggle('is-joined', self.progress > 0.9); },
        onToggle(self) { self.isActive ? gsap.ticker.add(drawThread) : gsap.ticker.remove(drawThread); },
      },
    })
      .fromTo(row, { scale: () => (narrow() ? 0.62 : 1) }, { scale: 1, ease: 'power2.inOut' }, 0)
      .fromTo(a, { x: () => -spread() }, { x: 0, ease: 'power3.inOut' }, 0)
      .fromTo(b, { x: () => spread() }, { x: 0, ease: 'power3.inOut' }, 0)
      .fromTo(dot, { scale: 0.7 }, { scale: 1, ease: 'back.out(2)' }, 0.6)
      .fromTo(kicker, { opacity: 0, y: 12 }, { opacity: 1, y: 0, ease: 'power2.out' }, 0.62)
      .to(hint, { opacity: 0, ease: 'none', duration: 0.25 }, 0.6);

    // A string with a knot (the "nodo") in the middle: slack sags, the pointer plucks it.
    const pluck = { x: 0, amp: 0, vel: 0 };
    let lastY = null;
    let threadY = 0;

    function impulse(px, py, dy) {
      const r = svg.getBoundingClientRect();
      const x = px - r.left;
      const y = py - r.top;
      if (lastY !== null && Math.sign(lastY - threadY) !== Math.sign(y - threadY)) {
        pluck.x = x;
        pluck.vel += gsap.utils.clamp(-14, 14, dy * 0.9 || 8);
      }
      lastY = y;
    }
    let prevPY = null;
    const onMove = (e) => {
      const p = e.touches ? e.touches[0] : e;
      impulse(p.clientX, p.clientY, prevPY === null ? 0 : p.clientY - prevPY);
      prevPY = p.clientY;
    };
    const onDown = (e) => {
      const p = e.touches ? e.touches[0] : e;
      const r = svg.getBoundingClientRect();
      if (Math.abs(p.clientY - r.top - threadY) < 70) {
        pluck.x = p.clientX - r.left;
        pluck.vel += 12;
      }
    };
    pin.addEventListener('pointermove', onMove, { passive: true });
    pin.addEventListener('touchmove', onMove, { passive: true });
    pin.addEventListener('pointerdown', onDown, { passive: true });
    pin.addEventListener('pointerleave', () => { lastY = null; prevPY = null; });

    function segment(x1, x2, y, slack, t, out) {
      const n = 22;
      for (let i = 0; i <= n; i++) {
        const u = i / n;
        const x = x1 + (x2 - x1) * u;
        const env = Math.sin(Math.PI * u);
        const sag = slack * env;
        const wave = Math.sin(u * Math.PI * 2 + t * 1.4) * slack * 0.08 * env;
        const d = (x - pluck.x) / 110;
        const pl = pluck.amp * Math.exp(-d * d) * env;
        out.push(`${i === 0 && !out.length ? 'M' : 'L'}${x.toFixed(1)} ${(y + sag + wave + pl).toFixed(1)}`);
      }
    }

    function drawThread(time) {
      if (!svg.isConnected) { gsap.ticker.remove(drawThread); return; }
      pluck.vel += -0.09 * pluck.amp - 0.07 * pluck.vel;
      pluck.amp += pluck.vel;

      const sr = svg.getBoundingClientRect();
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      const rd = dot.getBoundingClientRect();
      const xd = rd.left + rd.width / 2 - sr.left;
      threadY = rd.top + rd.height / 2 - sr.top;
      const x1 = ra.right - sr.left + 10;
      const x2 = rb.left - sr.left - 10;
      const p = tl.progress();
      const tension = 1 - p;
      const pts = [];
      if (xd - x1 > 6) segment(x1, xd, threadY, Math.min(90, (xd - x1) * 0.28) * tension, time, pts);
      if (x2 - xd > 6) segment(xd, x2, threadY, Math.min(90, (x2 - xd) * 0.28) * tension, time + 1.3, pts);
      const d = pts.join(' ');
      threadPaths.forEach(el => el.setAttribute('d', d));
      if (threadPaths[1]) threadPaths[1].style.strokeDashoffset = (-time * 18).toFixed(1);
      svg.style.opacity = p > 0.93 ? 0 : 1;
    }
    gsap.delayedCall(0.05, () => drawThread(0));
  } else {
    join?.classList.add('is-joined');
  }

  const ring = foot.querySelector('.nc-top-ring');
  if (ring) {
    gsap.set(ring, { strokeDasharray: 1, strokeDashoffset: 1 });
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => gsap.set(ring, { strokeDashoffset: 1 - self.progress }),
    });
  }
  const topBtn = foot.querySelector('.nc-top');
  if (topBtn && !topBtn.dataset.bound) {
    topBtn.dataset.bound = '1';
    topBtn.addEventListener('click', () => {
      if (typeof ScrollToPlugin !== 'undefined') {
        gsap.to(window, { scrollTo: 0, duration: 1.4, ease: 'expo.inOut', overwrite: true });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  const timeEls = [...root.querySelectorAll('[data-clock] [data-clock-time]')];
  if (timeEls.length) {
    if (nodoClockTimer) clearInterval(nodoClockTimer);
    const fmt = new Intl.DateTimeFormat('es-ES', {
      timeZone: 'Europe/Madrid',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const tick = () => {
      const [h, m] = fmt.format(new Date()).split(':');
      timeEls.forEach(el => { el.innerHTML = `${h}<span class="nc-clock-colon">:</span>${m}`; });
    };
    tick();
    nodoClockTimer = setInterval(tick, 10000);
  }
}

function initNcRoi(root) {
  root.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    }, { passive: true });
  });

  const box = root.querySelector('[data-roi]');
  if (!box) return;
  const range = box.querySelector('.nc-roi-range');
  const valueEl = box.querySelector('[data-roi-value]');
  const nEl = box.querySelector('[data-roi-n]');
  const wordEl = box.querySelector('[data-roi-word]');
  const dotsEl = box.querySelector('[data-roi-dots]');
  const PACK = 1500;
  const max = Math.ceil(PACK / Number(range.min));
  dotsEl.innerHTML = Array.from({ length: max }, () => '<i></i>').join('');
  const dots = [...dotsEl.children];
  const counter = { n: 0 };
  let prev = -1;

  function update(animate) {
    const v = Number(range.value);
    const n = Math.ceil(PACK / v);
    valueEl.textContent = `${v.toLocaleString('es-ES')} €`;
    range.style.setProperty('--fill', `${((v - range.min) / (range.max - range.min)) * 100}%`);
    wordEl.textContent = n === 1 ? 'cliente' : 'clientes';
    gsap.to(counter, {
      n,
      duration: animate ? 0.5 : 0,
      ease: 'power2.out',
      onUpdate: () => { nEl.textContent = Math.round(counter.n); },
    });
    if (n === prev) return;
    dots.forEach((d, i) => d.classList.toggle('is-on', i < n));
    if (animate) {
      const fresh = n > prev ? dots.slice(Math.max(prev, 0), n) : [];
      gsap.fromTo(fresh, { scale: 0.2 }, { scale: 1, duration: 0.4, ease: 'back.out(3)', stagger: 0.008 });
    }
    prev = n;
  }

  range.addEventListener('input', () => update(true));
  update(false);
}

/* ═══════════════════════════════════════════════════
   PÁGINAS — Trabajos · Nosotros · Contacto
═══════════════════════════════════════════════════ */
let npResizeObserver = null;

function initNodoPages(root) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  npResizeObserver?.disconnect();
  npResizeObserver = null;

  root.querySelectorAll('[data-np-title]').forEach(title => {
    const spans = title.querySelectorAll('.np-line > span');
    if (reduce) return;
    gsap.fromTo(spans, { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out', delay: 0.15 });
    const hero = title.closest('.np-hero');
    gsap.fromTo(hero.querySelectorAll('.np-kicker, .np-lead, .np-stats, .np-constellation'),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', delay: 0.35 });
  });

  root.querySelectorAll('[data-np-count]').forEach(el => {
    const end = Number(el.dataset.npCount);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const fmt = v => `${prefix}${el.dataset.sep ? Math.round(v).toLocaleString('es-ES') : Math.round(v)}${suffix}`;
    if (reduce || !end) { el.textContent = fmt(end); return; }
    const o = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 95%',
      once: true,
      onEnter: () => gsap.fromTo(o, { v: 0 }, { v: end, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = fmt(o.v); } }),
    });
  });

  initNpConstellation(root, reduce);
  initNpWork(root, reduce);
  initNpStrip(root, reduce);
  initNpManifesto(root, reduce);
  initNpProcess(root, reduce);
  initNpCompare(root);
  initNpBrief(root);
}

function initNpConstellation(root, reduce) {
  const box = root.querySelector('[data-constellation]');
  if (!box) return;
  const svg = box.querySelector('svg');
  const core = box.querySelector('[data-core]');
  const stars = [...box.querySelectorAll('.np-star')];
  gsap.set(core, { xPercent: -50, yPercent: -50 });
  const ns = 'http://www.w3.org/2000/svg';
  svg.innerHTML = '';
  const paths = stars.map(() => {
    const p = document.createElementNS(ns, 'path');
    p.setAttribute('pathLength', '1');
    p.setAttribute('class', 'np-constellation-link');
    svg.appendChild(p);
    return p;
  });

  const layout = () => {
    const b = box.getBoundingClientRect();
    const c = core.getBoundingClientRect();
    const cx = c.left + c.width / 2 - b.left;
    const cy = c.top + c.height / 2 - b.top;
    svg.setAttribute('viewBox', `0 0 ${b.width} ${b.height}`);
    stars.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const x = r.left + r.width / 2 - b.left;
      const y = r.top + r.height / 2 - b.top;
      const mx = (x + cx) / 2 + (y - cy) * 0.18;
      const my = (y + cy) / 2 - (x - cx) * 0.18;
      paths[i].setAttribute('d', `M${cx.toFixed(1)} ${cy.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`);
    });
  };
  layout();
  npResizeObserver = new ResizeObserver(layout);
  npResizeObserver.observe(box);

  stars.forEach((s, i) => {
    s.addEventListener('pointerenter', () => paths[i].classList.add('is-hot'));
    s.addEventListener('pointerleave', () => paths[i].classList.remove('is-hot'));
  });

  if (reduce) { box.classList.add('is-live'); return; }
  gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set(stars, { scale: 0 });
  gsap.timeline({ delay: 0.6, onComplete: () => box.classList.add('is-live') })
    .fromTo(core, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(2)' })
    .to(paths, { strokeDashoffset: 0, duration: 0.9, stagger: 0.07, ease: 'power3.inOut' }, '-=0.3')
    .to(stars, { scale: 1, duration: 0.6, stagger: 0.07, ease: 'back.out(2.4)' }, '<0.3');
  stars.forEach((s, i) => {
    gsap.to(s, { y: gsap.utils.random(-7, 7), x: gsap.utils.random(-5, 5), duration: gsap.utils.random(2.4, 3.6), ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.13 });
  });
  const tick = () => {
    if (!box.isConnected) { gsap.ticker.remove(tick); return; }
    layout();
  };
  ScrollTrigger.create({
    trigger: box,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: self => (self.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)),
  });
}

function initNpWork(root, reduce) {
  const grid = root.querySelector('[data-work-grid]');
  if (!grid) return;
  const cards = [...grid.querySelectorAll('.np-card')];
  const section = grid.closest('.np-work');

  if (!reduce) {
    ScrollTrigger.batch(cards, {
      start: 'top 90%',
      once: true,
      onEnter: batch => gsap.fromTo(batch,
        { opacity: 0, y: 60, clipPath: 'inset(12% 0 0 0 round 24px)' },
        { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0 round 24px)', duration: 1, stagger: 0.12, ease: 'expo.out', clearProps: 'clipPath' }),
    });
  }

  const filters = [...section.querySelectorAll('.np-filter')];
  filters.forEach(btn => btn.addEventListener('click', () => {
    if (btn.classList.contains('is-active')) return;
    filters.forEach(f => {
      const on = f === btn;
      f.classList.toggle('is-active', on);
      f.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    const cat = btn.dataset.filter;
    const show = cards.filter(c => cat === 'all' || c.dataset.cat === cat);
    const visible = cards.filter(c => !c.hidden);
    gsap.to(visible, {
      opacity: 0, y: 24, duration: 0.25, stagger: 0.03, ease: 'power2.in',
      onComplete: () => {
        cards.forEach(c => { c.hidden = !show.includes(c); });
        gsap.fromTo(show, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: 'expo.out' });
        ScrollTrigger.refresh();
      },
    });
  }));

  const cursor = section.querySelector('.np-cursor');
  if (!cursor || !window.matchMedia('(hover: hover)').matches) return;
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.45, ease: 'power3.out' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.45, ease: 'power3.out' });
  grid.addEventListener('pointermove', e => { xTo(e.clientX); yTo(e.clientY); });
  cards.forEach(card => {
    card.addEventListener('pointerenter', () => cursor.classList.add('is-on'));
    card.addEventListener('pointerleave', () => cursor.classList.remove('is-on'));
  });
}

function initNpStrip(root, reduce) {
  const row = root.querySelector('[data-strip-row]');
  if (!row || reduce) return;
  gsap.fromTo(row, { x: () => window.innerWidth * 0.1 }, {
    x: () => -(row.scrollWidth - window.innerWidth * 0.9),
    ease: 'none',
    scrollTrigger: { trigger: row.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.8, invalidateOnRefresh: true },
  });
}

function initNpManifesto(root, reduce) {
  const text = root.querySelector('[data-manifesto-text]');
  if (!text) return;
  if (!text.dataset.split) {
    text.dataset.split = '1';
    const walk = (node) => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement('span');
            w.className = 'np-mw';
            w.textContent = part;
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) {
          walk(n);
        }
      });
    };
    walk(text);
  }
  const words = text.querySelectorAll('.np-mw');
  if (reduce) { gsap.set(words, { opacity: 1 }); return; }
  gsap.fromTo(words, { opacity: 0.14 }, {
    opacity: 1,
    stagger: 0.1,
    ease: 'none',
    scrollTrigger: { trigger: text, start: 'top 78%', end: 'bottom 45%', scrub: 0.6 },
  });
}

function initNpProcess(root, reduce) {
  const wrap = root.querySelector('.np-steps-wrap');
  if (!wrap) return;
  const svg = wrap.querySelector('svg');
  const track = svg.querySelector('.np-steps-track');
  const line = svg.querySelector('.np-steps-line');
  const steps = [...wrap.querySelectorAll('.np-step')];
  let len = 0;

  const layout = () => {
    const b = wrap.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${b.width} ${b.height}`);
    const pts = steps.map(s => {
      const n = s.querySelector('.np-step-node').getBoundingClientRect();
      return [n.left + n.width / 2 - b.left, n.top + n.height / 2 - b.top];
    });
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      const xm = (x0 + x1) / 2;
      d += Math.abs(x1 - x0) > Math.abs(y1 - y0)
        ? ` C${xm} ${y0} ${xm} ${y1} ${x1} ${y1}`
        : ` L${x1} ${y1}`;
    }
    track.setAttribute('d', d);
    line.setAttribute('d', d);
    len = line.getTotalLength();
    line.style.strokeDasharray = `${len}`;
  };
  layout();
  const ro = new ResizeObserver(() => { layout(); ScrollTrigger.refresh(); });
  ro.observe(wrap);
  const prevObs = npResizeObserver;
  npResizeObserver = { disconnect() { prevObs?.disconnect(); ro.disconnect(); } };

  if (reduce) { steps.forEach(s => s.classList.add('is-on')); line.style.strokeDashoffset = '0'; return; }
  ScrollTrigger.create({
    trigger: wrap,
    start: 'top 70%',
    end: 'bottom 60%',
    scrub: 0.6,
    onUpdate(self) {
      line.style.strokeDashoffset = `${len * (1 - self.progress)}`;
      steps.forEach((s, i) => s.classList.toggle('is-on', self.progress >= i / (steps.length - 1) - 0.02));
    },
  });
}

function initNpCompare(root) {
  const box = root.querySelector('[data-compare]');
  if (!box) return;
  const btns = [...box.querySelectorAll('.np-switch-btn')];
  const list = box.querySelector('.np-compare-list');
  const items = [...list.children];
  const set = (side) => {
    if (list.dataset.sideCurrent === side) return;
    list.dataset.sideCurrent = side;
    box.dataset.side = side;
    btns.forEach(b => {
      const on = b.dataset.side === side;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    items.forEach((li, i) => {
      const txt = li.querySelector('.np-compare-txt');
      gsap.timeline({ delay: i * 0.06 })
        .to(txt, { yPercent: -60, opacity: 0, duration: 0.2, ease: 'power2.in' })
        .add(() => { txt.textContent = li.dataset[side]; })
        .fromTo(txt, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4, ease: 'expo.out' });
    });
  };
  btns.forEach(b => b.addEventListener('click', () => set(b.dataset.side)));
  box.dataset.side = 'nodo';
}

function initNpBrief(root) {
  const form = root.querySelector('[data-brief-form]');
  if (!form) return;
  const preview = root.querySelector('[data-brief-preview]');
  const wa = form.querySelector('[data-brief-wa]');
  const mail = form.querySelector('[data-brief-mail]');

  const compose = () => {
    const f = new FormData(form);
    const name = (f.get('name') || '').toString().trim();
    const business = (f.get('business') || '').toString().trim();
    const extra = (f.get('extra') || '').toString().trim();
    const parts = [`Hola Nodo${name ? `, soy ${name}` : ''}.`];
    parts.push(`${f.get('need')}${business ? ` para mi negocio (${business})` : ''}.`);
    parts.push(f.get('when'));
    if (extra) parts.push(extra);
    return parts.join(' ');
  };

  const update = () => {
    const msg = compose();
    preview.textContent = msg;
    wa.href = `https://wa.me/34622494800?text=${encodeURIComponent(msg)}`;
    mail.href = `mailto:nodoagenciadigital@hotmail.com?subject=${encodeURIComponent('Web para mi negocio')}&body=${encodeURIComponent(msg)}`;
  };

  form.addEventListener('input', update);
  form.addEventListener('change', (e) => {
    update();
    if (e.target.type === 'radio') {
      gsap.fromTo(preview, { scale: 0.97 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
    }
  });
  form.addEventListener('submit', e => { e.preventDefault(); wa.click(); });
  update();
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

// Barba 2 ignores a `hooks` key in barba.init(); global hooks must go through barba.hooks.*
const BARBA_HOOKS = {
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
      const hash = next.url?.hash ? `#${next.url.hash.replace(/^#/, '')}` : location.hash;
      if (hash) gsap.delayedCall(0.35, () => scrollToHash(hash, true));
    },
};

// file:// can't fetch pages, and a throw here would stop the rest of the script from booting.
if (location.protocol !== 'file:' && typeof barba !== 'undefined') {
  try {
    Object.entries(BARBA_HOOKS).forEach(([name, fn]) => barba.hooks[name](fn));
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
    });
  } catch (err) {
    console.warn('[Nodo] Barba desactivado:', err);
  }
}

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
      const lastStep = steps[steps.length - 1];

      ScrollTrigger.create({
        trigger: body,
        start: 'top 72px',
        endTrigger: lastStep || body,
        end: 'bottom bottom',
        pin: pin,
        pinSpacing: false,
        scrub: 0.7,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate(self) {
          scrubVisuals(self.progress);
        },
        onLeave: () => activate(total - 1, { force: true }),
        onEnterBack(self) {
          scrubVisuals(self.progress);
        },
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

const samePage = (a) => {
  const norm = p => p.replace(/\/index\.html$/, '/');
  return a.origin === location.origin && norm(a.pathname) === norm(location.pathname);
};

function scrollToHash(hash, instant) {
  if (!hash || hash === '#') return;
  let target = null;
  try { target = document.querySelector(hash); } catch (e) { return; }
  if (!target) return;
  if (instant) {
    ScrollTrigger.refresh();
    window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - 80);
  } else {
    SmoothScroll.scrollTo(target, { offset: -80, duration: 1.25 });
  }
}

document.addEventListener('click', (e) => {
  const a = e.target.closest?.('a[href*="#"]');
  if (!a || a.target === '_blank' || a.getAttribute('href').startsWith('#')) return;
  if (!samePage(a) || !a.hash) return;
  e.preventDefault();
  e.stopPropagation();
  document.querySelector('.nav-links')?.classList.remove('open');
  scrollToHash(a.hash);
}, true);

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
  NcReach.init();
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

    if (location.hash) gsap.delayedCall(0.4, () => scrollToHash(location.hash, true));

    const jump = Number(new URLSearchParams(location.search).get('jump'));
    if (!Number.isNaN(jump) && jump > 0) {
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, jump);
      ScrollTrigger.refresh();
    }
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
