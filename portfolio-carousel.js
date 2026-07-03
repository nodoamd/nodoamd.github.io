/* Portfolio carousel — endless loop con GSAP */
(function () {
  const FILTERS = [
    { id: 'all', label: 'Todos', icon: 'grid' },
    { id: 'web', label: 'Web', icon: 'globe' },
    { id: 'ecommerce', label: 'E-commerce', icon: 'cart' },
    { id: '3d', label: '3D / Interactivo', icon: 'cube' },
    { id: 'branding', label: 'Branding', icon: 'spark' }
  ];

  const PROJECTS = [
    {
      id: 'hitachi',
      categories: ['web'],
      tag: 'Web · Salud',
      title: 'Clínica Dental Hitachi',
      subtitle: 'Cuidamos tu sonrisa',
      image: './img/landinghitachi.webp',
      type: 'Sitio web',
      stats: [
        { value: '+890%', label: 'Clics orgánicos' },
        { value: '24/7', label: 'Reservas online' }
      ],
      desc: 'De invisible en Google a líder digital con reservas online y decenas de pacientes nuevos al mes.',
      tech: ['HTML', 'CSS', 'JS', 'SEO'],
      links: [
        { label: 'Visitar web', href: 'https://clinicadentalhitachi.com', external: true },
        { label: 'Caso completo', href: './trabajo.html#hitachi' }
      ]
    },
    {
      id: 'chiquitana',
      categories: ['web', 'ecommerce'],
      tag: 'Web · Gastronomía',
      title: 'La Chiquitana',
      subtitle: 'Sabor con historia',
      image: './img/lachiquitanahero.png',
      type: 'E-commerce',
      stats: [
        { value: 'E-commerce', label: 'Catálogo online' },
        { value: 'GSAP', label: 'Animación editorial' }
      ],
      desc: 'Marca gastronómica con catálogo, storytelling y animaciones GSAP de nivel editorial.',
      tech: ['HTML', 'GSAP', 'E-commerce'],
      links: [
        { label: 'Visitar web', href: './chiquitana/', external: true },
        { label: 'Más webs', href: './trabajo.html#webs' }
      ]
    },
    {
      id: 'betterwallpapers',
      categories: ['3d'],
      tag: '3D · Webapp',
      title: 'BetterWallpapers',
      subtitle: 'Inmersión en tiempo real',
      image: './img/betterwprshero.png',
      type: 'Experiencia 3D',
      stats: [
        { value: 'Spline', label: 'Escenas 3D' },
        { value: 'WebGL', label: 'Tiempo real' }
      ],
      desc: 'Webapp interactiva con escenas 3D en tiempo real — el nivel visual que separa a Nodo del resto.',
      tech: ['Spline', 'Three.js', 'WebGL'],
      links: [
        { label: 'Ver demo', href: './betterwlprs/', external: true },
        { label: 'Más 3D', href: './trabajo.html#3d' }
      ]
    },
    {
      id: 'universal-wristbands',
      categories: ['branding'],
      tag: 'Branding · Banderas',
      title: 'Universal Wristbands',
      subtitle: 'Una bandera por cada país',
      image: './img/universal.png',
      type: 'Diseño comisionado · 2020',
      stats: [
        { value: '+1.000', label: 'Diseños' },
        { value: '100%', label: 'Vectorial' }
      ],
      desc: 'Proyecto comisionado en 2020: más de mil diseños de banderas para pulseras y merchandising internacional.',
      tech: ['Illustrator', 'Vector', 'Print'],
      links: [{ label: 'Ver en portfolio', href: './trabajo.html#branding' }]
    },
    {
      id: 'aprendalia',
      categories: ['web', 'branding'],
      tag: 'Web · Educación · En proceso',
      title: 'Aprendalia',
      subtitle: 'Historia y cultura universal',
      image: './img/aprendaliahero.png',
      type: 'Plataforma educativa',
      stats: [
        { value: 'En curso', label: 'Desarrollo activo' },
        { value: 'España', label: 'Primera ruta' }
      ],
      desc: 'Plataforma para aprender historia y cultura universal. Por ahora empezamos con España — en proceso.',
      tech: ['HTML', 'JS', 'GSAP', 'Design'],
      links: [
        { label: 'Probar Aprendalia', href: './aprendalia/learnia.html', external: true },
        { label: 'Más proyectos', href: './trabajo.html' }
      ]
    }
  ];

  const ICONS = {
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M2 3h3l2.4 12.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6L22 7H6"/></svg>',
    cube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3 3 8v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5M12 13v8"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M7 7h10v10"/></svg>'
  };

  let filter = 'all';
  let index = 0;
  let slideCount = 0;
  let animating = false;
  let slideW = 0;
  let gap = 20;
  let touchStartX = 0;

  const track = document.getElementById('portfolio-track');
  const viewport = document.getElementById('portfolio-viewport');
  const filtersEl = document.getElementById('portfolio-filters');
  const progressEl = document.getElementById('portfolio-progress');
  const prevBtn = document.getElementById('portfolio-prev');
  const nextBtn = document.getElementById('portfolio-next');

  if (!track || !viewport) return;

  function filteredProjects() {
    if (filter === 'all') return PROJECTS;
    return PROJECTS.filter((p) => p.categories.includes(filter));
  }

  function slideHTML(p) {
    const stats = p.stats
      .map((s) => `<div class="nodo-portfolio__stat"><strong>${s.value}</strong><span>${s.label}</span></div>`)
      .join('');
    const tech = p.tech.map((t) => `<span class="nodo-portfolio__tech-pill">${t}</span>`).join('');
    const primary = p.links[0];
    const primaryAttrs = primary.external ? ' target="_blank" rel="noopener"' : '';

    return `
      <article class="nodo-portfolio__slide" data-id="${p.id}">
        <div class="nodo-portfolio__card">
          <div class="nodo-portfolio__visual" style="background-image:url('${p.image}')">
            <span class="nodo-portfolio__badge">${p.tag}</span>
            <div class="nodo-portfolio__visual-inner">
              <h3 class="nodo-portfolio__visual-title">${p.title}</h3>
              <p class="nodo-portfolio__visual-sub">${p.subtitle}</p>
              <a href="${primary.href}"${primaryAttrs} class="nodo-portfolio__visual-cta">
                Ver proyecto ${ICONS.arrow}
              </a>
            </div>
          </div>
          <div class="nodo-portfolio__detail">
            <div class="nodo-portfolio__detail-head">
              <div>
                <h3>${p.title}</h3>
                <span>${p.type}</span>
              </div>
              <a href="${primary.href}"${primaryAttrs} class="nodo-portfolio__detail-icon" aria-label="Abrir proyecto">${ICONS.ext}</a>
            </div>
            <div class="nodo-portfolio__stats">${stats}</div>
            <p class="nodo-portfolio__desc">${p.desc}</p>
            <div class="nodo-portfolio__tech">
              <span class="nodo-portfolio__tech-label">Tecnologías</span>
              <div class="nodo-portfolio__tech-list">${tech}</div>
            </div>
          </div>
        </div>
      </article>`;
  }

  function renderFilters() {
    filtersEl.innerHTML = FILTERS.map(
      (f) => `
        <button type="button" class="nodo-portfolio__filter${f.id === filter ? ' is-active' : ''}" data-filter="${f.id}">
          <span class="nodo-portfolio__filter-icon">${ICONS[f.icon]}</span>${f.label}
        </button>`
    ).join('');

    filtersEl.querySelectorAll('[data-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = btn.dataset.filter;
        if (next === filter) return;
        filter = next;
        index = 0;
        renderFilters();
        renderSlides(true);
      });
    });
  }

  function renderSlides(animateIn) {
    const list = filteredProjects();
    slideCount = list.length;
    if (!slideCount) {
      track.innerHTML = '';
      return;
    }
    const html = list.map(slideHTML).join('');
    track.innerHTML = html + html;
    index = 0;
    measure();
    setX(index, false);
    updateStates();
    renderProgress(slideCount);

    if (animateIn && window.gsap) {
      gsap.fromTo(
        track.querySelectorAll('.nodo-portfolio__slide'),
        { opacity: 0, y: 18, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.04, ease: 'power2.out' }
      );
    }
  }

  function measure() {
    const vp = viewport.clientWidth;
    slideW = Math.min(920, Math.max(280, vp - 56));
    gap = vp < 640 ? 14 : 22;
    track.querySelectorAll('.nodo-portfolio__slide').forEach((el) => {
      el.style.width = slideW + 'px';
      el.style.marginRight = gap + 'px';
    });
  }

  function centerOffset(i) {
    const vp = viewport.clientWidth;
    return (vp - slideW) / 2 - i * (slideW + gap);
  }

  function setX(i, animate, onDone) {
    const x = centerOffset(i);
    if (animate && window.gsap) {
      animating = true;
      gsap.to(track, {
        x,
        duration: 0.52,
        ease: 'power3.out',
        onComplete: () => {
          animating = false;
          onDone?.();
        }
      });
    } else if (window.gsap) {
      gsap.set(track, { x });
      onDone?.();
    } else {
      track.style.transform = `translateX(${x}px)`;
      onDone?.();
    }
  }

  function updateStates() {
    const slides = track.querySelectorAll('.nodo-portfolio__slide');
    slides.forEach((el, i) => {
      const isActive = i === index;
      el.classList.toggle('is-active', isActive);
      el.classList.toggle('is-near', Math.abs(i - index) === 1);
      if (window.gsap) {
        gsap.to(el, {
          scale: isActive ? 1 : 0.9,
          opacity: isActive ? 1 : 0.42,
          filter: isActive ? 'blur(0px)' : 'blur(1px)',
          duration: 0.45,
          ease: 'power2.out',
          overwrite: true
        });
      }
    });
    renderProgress(slideCount);
  }

  function renderProgress(total) {
    if (!progressEl || !total) return;
    const active = slideCount ? index % slideCount : 0;
    progressEl.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const bar = document.createElement('span');
      bar.className = 'nodo-portfolio__progress-seg' + (i === active ? ' is-active' : '');
      progressEl.appendChild(bar);
    }
  }

  function go(delta) {
    if (!slideCount || animating) return;

    if (delta > 0) {
      index += 1;
      updateStates();
      setX(index, true, () => {
        if (index >= slideCount) {
          index = 0;
          gsap.set(track, { x: centerOffset(0) });
          updateStates();
        }
      });
      return;
    }

    if (delta < 0) {
      if (index <= 0) {
        index = slideCount;
        gsap.set(track, { x: centerOffset(index) });
      }
      index -= 1;
      updateStates();
      setX(index, true);
    }
  }

  function bindNav() {
    prevBtn?.addEventListener('click', () => go(-1));
    nextBtn?.addEventListener('click', () => go(1));

    viewport.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.changedTouches[0].clientX;
      },
      { passive: true }
    );
    viewport.addEventListener(
      'touchend',
      (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
      },
      { passive: true }
    );

    window.addEventListener('resize', () => {
      if (slideCount && index >= slideCount) index = index % slideCount;
      measure();
      setX(index, false);
      updateStates();
    });

    document.addEventListener('keydown', (e) => {
      if (!document.getElementById('before-after')?.contains(document.activeElement) && document.activeElement !== document.body) return;
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    });
  }

  function introAnimation() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.set('.nodo-portfolio__header > *', { opacity: 0, y: 28 });
    gsap.set('.nodo-portfolio__toolbar', { opacity: 0, y: 20 });
    gsap.set('#portfolio-viewport', { opacity: 0, y: 32 });

    ScrollTrigger.create({
      trigger: '#before-after',
      start: 'top 78%',
      once: true,
      onEnter: () => {
        gsap.to('.nodo-portfolio__header > *', {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.07,
          ease: 'power2.out'
        });
        gsap.to('.nodo-portfolio__toolbar', {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          delay: 0.12
        });
        gsap.to('#portfolio-viewport', {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power3.out',
          delay: 0.18
        });
        gsap.to('.nodo-portfolio__foot', {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power2.out',
          delay: 0.28
        });
      }
    });
  }

  renderFilters();
  renderSlides(false);
  bindNav();
  introAnimation();
  if (window.gsap) {
    gsap.set('.nodo-portfolio__foot', { opacity: 0, y: 12 });
  }
})();
