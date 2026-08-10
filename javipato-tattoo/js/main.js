/* ==========================================================
   Javi Pato Tattoo — shared front-end logic
   GSAP (animation) + Barba.js (page transitions / pjax)
   ========================================================== */

if(typeof ScrollTrigger !== 'undefined'){
  gsap.registerPlugin(ScrollTrigger);
}

let heroScrollTl = null;
let refreshRevealSequence = null;

const STYLE_SHOWCASE = {
  realismo: {
    title: 'Realismo',
    lead: 'Piezas con profundidad, luz y detalle. El estilo que define el estudio.',
    featured: './img/starwarspato.jpg',
    shots: ['./img/javivalkiria.jpg', './img/javipatoazteca.jpg']
  },
  oriental: {
    title: 'Oriental',
    lead: 'Tradición, budismo y composición japonesa. Piezas con peso simbólico y flujo.',
    featured: './img/javimanovalkiria.jpg',
    shots: ['./img/javipatoazteca.jpg', './img/javioriental.jpg']
  },
  anime: {
    title: 'Anime',
    lead: 'Personajes, color y línea limpia. Energía pop con acabado de estudio.',
    featured: './img/espaldapato.jpg',
    shots: ['./img/javigatosamurai.jpg', './img/starwarspato.jpg']
  }
};

const STYLE_ORDER = ['realismo', 'oriental', 'anime'];

function getRevealSequence(currentMood){
  return STYLE_ORDER.filter(mood => mood !== currentMood);
}

function fillShowcasePanel(panel, mood){
  const data = STYLE_SHOWCASE[mood];
  if(!panel || !data) return;

  panel.dataset.styleMood = mood;
  const title = panel.querySelector('.reveal-title');
  const lead = panel.querySelector('.reveal-lead');
  const featured = panel.querySelector('[data-showcase-img="featured"]');
  const shot0 = panel.querySelector('[data-showcase-img="shot-0"]');
  const shot1 = panel.querySelector('[data-showcase-img="shot-1"]');
  const cta = panel.querySelector('.reveal-cta');

  if(title) title.textContent = data.title;
  if(lead) lead.textContent = data.lead;
  if(featured && data.featured){
    featured.src = data.featured;
    featured.alt = data.title;
  }
  if(shot0 && data.shots[0]) shot0.src = data.shots[0];
  if(shot1 && data.shots[1]) shot1.src = data.shots[1];
  if(cta) cta.href = `gallery.html#${mood}`;
}

function syncRevealPanels(scope = document){
  const current = document.documentElement.getAttribute('data-style') || 'realismo';
  const sequence = getRevealSequence(current);
  const panels = scope.querySelectorAll('.style-showcase');

  panels.forEach((panel, i) => {
    fillShowcasePanel(panel, sequence[i] || sequence[0]);
  });

  return sequence;
}

/* ---------- 0. HOME CINEMATIC STAGE ----------
   Arm stays FIXED in the viewport.
   Scroll scrubs the video + lifts hero UI out + fades style showcases in.
   Showcase sequence always skips the active mood.
*/
function destroyHeroVideoScroll(){
  if(heroScrollTl){
    heroScrollTl.scrollTrigger?.kill();
    heroScrollTl.kill();
    heroScrollTl = null;
  }
  refreshRevealSequence = null;
}

function initHeroVideoScroll(scope = document){
  destroyHeroVideoScroll();

  if(typeof ScrollTrigger === 'undefined') return;

  const stage = scope.querySelector('.home-stage');
  const video = scope.querySelector('.hero-video');
  const armLayer = scope.querySelector('.stage-arm');
  const armStage = scope.querySelector('.stage-arm-stage');
  const exitLayer = scope.querySelector('.stage-exit');
  const enterLayer = scope.querySelector('.stage-enter');
  const slideCue = scope.querySelector('.hero-slide-cue');
  if(!stage || !video || !exitLayer || !enterLayer) return;

  const panelA = enterLayer.querySelector('.style-showcase.is-primary');
  const panelB = enterLayer.querySelector('.style-showcase.is-secondary');
  const galleryLayer = stage.querySelector('.stage-gallery');
  const galleryTiles = galleryLayer ? galleryLayer.querySelectorAll('.bento-tile') : [];

  syncRevealPanels(scope);
  refreshRevealSequence = () => syncRevealPanels(scope);

  video.muted = true;
  video.playsInline = true;
  video.pause();

  function setActivePanel(panel){
    if(panelA) panelA.classList.toggle('is-active', panelA === panel);
    if(panelB) panelB.classList.toggle('is-active', panelB === panel);
  }

  function buildTimeline(){
    const dur = video.duration;
    if(!dur || !Number.isFinite(dur)) return;

    const mobile = window.matchMedia('(max-width: 900px)').matches;

    video.pause();
    // Stable visible frame — avoid black opening
    const frameStart = Math.min(0.22, Math.max(dur * 0.04, 0.08));
    // En móvil el scrub parte desde aquí (tras el nudge de entrada)
    const mobileHold = frameStart + Math.min(Math.max(dur * 0.12, 0.55), Math.max(dur * 0.22, 0.7));
    video.currentTime = frameStart;

    // Móvil: al entrar, avanza un poco el vídeo para que el brazo gire de verdad
    if(mobile){
      gsap.fromTo(video,
        { currentTime: frameStart },
        { currentTime: mobileHold, duration: 1.5, ease: 'power1.out', overwrite: true }
      );
    }
    gsap.set(enterLayer, { autoAlpha: 0, y: mobile ? 24 : 48 });
    gsap.set(exitLayer, { autoAlpha: 1, y: 0 });
    if(armLayer){
      // No pisar la entrada si aún está fading in
      if(!gsap.isTweening(armLayer)){
        gsap.set(armLayer, { autoAlpha: 1, clearProps: 'filter' });
      } else {
        gsap.set(armLayer, { clearProps: 'filter' });
      }
    }
    if(armStage && !mobile){
      gsap.set(armStage, { clearProps: 'transform' });
    }
    if(panelA) gsap.set(panelA, { autoAlpha: 0, y: mobile ? 16 : 28 });
    if(panelB) gsap.set(panelB, { autoAlpha: 0, y: mobile ? 16 : 28 });
    if(galleryLayer) gsap.set(galleryLayer, { autoAlpha: 0, y: 40 });
    if(galleryTiles.length) gsap.set(galleryTiles, { autoAlpha: 0, y: 24, scale: 0.97 });
    setActivePanel(null);
    stage.classList.remove('is-arm-clear', 'is-styles', 'is-gallery');
    // is-alive lo activa playEntrance al terminar el fade del cue

    // Mobile: short pin so the page actually moves on (not stuck scrubbing)
    const scrollLength = () => mobile
      ? Math.round(Math.max(window.innerHeight * 1.85, 1400))
      : Math.round(Math.max(window.innerHeight * 3.05, 2400));

    const beats = mobile
      ? {
          // Scrub corto: el brazo gira un poco como en el vídeo (sin alargar el pin)
          videoEnd: 0.2,
          stylesStart: 0.2,
          galleryStart: 0.62,
          exit: 0.06,
          armFade: 0.1,
          enter: 0.14,
          panelA: 0.16,
          holdA: 0.28,
          panelAOut: 0.36,
          panelB: 0.38,
          holdB: 0.48,
          enterOut: 0.54,
          gallery: 0.56,
          galleryTiles: 0.58,
          holdGallery: 0.7
        }
      : {
          videoEnd: 0.28,
          stylesStart: 0.1,
          galleryStart: 0.74,
          exit: 0,
          armFade: 0.04,
          enter: 0.1,
          panelA: 0.11,
          holdA: 0.2,
          panelAOut: 0.32,
          panelB: 0.36,
          holdB: 0.46,
          enterOut: 0.56,
          gallery: 0.6,
          galleryTiles: 0.62,
          holdGallery: 0.74
        };

    heroScrollTl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: () => `+=${scrollLength()}`,
        pin: true,
        pinSpacing: true,
        scrub: mobile ? 0.3 : 0.55,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate(self){
          const p = self.progress;

          // Scrub del vídeo: en móvil solo un tramo corto (giro del brazo)
          if(beats.videoEnd != null){
            const videoProgress = gsap.utils.clamp(0, 1, p / beats.videoEnd);
            const startT = mobile ? mobileHold : frameStart;
            const span = mobile
              ? Math.min(Math.max(dur * 0.28, 0.7), Math.max(dur - startT - 0.05, 0.5))
              : Math.max(dur - startT - 0.05, 0);
            const t = startT + videoProgress * span;
            if(Math.abs(video.currentTime - t) > 0.04){
              video.currentTime = t;
            }
          }

          stage.classList.remove('is-arm-clear');

          // Fantasma “Desliza”: se apaga en cuanto empiezas a deslizar
          if(slideCue){
            slideCue.classList.toggle('is-alive', p < 0.04);
          }

          const inStyles = p > beats.stylesStart && p < beats.galleryStart;
          const inGallery = p > beats.galleryStart;
          enterLayer.classList.toggle('is-live', inStyles);
          stage.classList.toggle('is-styles', inStyles);
          stage.classList.toggle('is-gallery', inGallery);
          if(galleryLayer){
            galleryLayer.classList.toggle('is-live', inGallery);
            galleryLayer.setAttribute('aria-hidden', inGallery ? 'false' : 'true');
          }

          const mid = (beats.panelAOut + beats.panelB) / 2;
          if(p < mid) setActivePanel(panelA);
          else if(p < beats.galleryStart) setActivePanel(panelB);
          else setActivePanel(null);
        }
      }
    });

    /* ACT 1 — hero fades up & out */
    heroScrollTl.to(exitLayer, {
      y: () => -(window.innerHeight * (mobile ? 0.3 : 0.72)),
      autoAlpha: 0,
      duration: mobile ? 0.18 : 0.12
    }, beats.exit);

    if(armLayer){
      // Smooth black fade between states — never pop-clear the vignette
      if(mobile){
        heroScrollTl.to(armLayer, {
          autoAlpha: 0,
          duration: 0.24
        }, beats.armFade);
      } else {
        heroScrollTl.to(armLayer, { autoAlpha: 0.28, duration: 0.12 }, beats.armFade);
        heroScrollTl.to(armLayer, { autoAlpha: 0.12, duration: 0.1 }, beats.panelAOut);
        heroScrollTl.to(armLayer, { autoAlpha: 0, duration: 0.08 }, beats.enterOut);
      }
    }

    /* ACT 2 — first style fades in (crossfade with arm) */
    heroScrollTl.to(enterLayer, {
      y: 0,
      autoAlpha: 1,
      duration: mobile ? 0.2 : 0.1
    }, beats.enter);

    if(panelA){
      heroScrollTl.to(panelA, {
        autoAlpha: 1,
        y: 0,
        duration: mobile ? 0.2 : 0.1
      }, beats.panelA);
    }

    heroScrollTl.to({}, { duration: mobile ? 0.06 : 0.1 }, beats.holdA);

    /* ACT 3 — crossfade to second style */
    if(panelA && panelB){
      heroScrollTl.to(panelA, {
        autoAlpha: 0,
        y: mobile ? -10 : -24,
        duration: mobile ? 0.14 : 0.08
      }, beats.panelAOut);

      heroScrollTl.to(panelB, {
        autoAlpha: 1,
        y: 0,
        duration: mobile ? 0.18 : 0.1
      }, beats.panelB);
    }

    heroScrollTl.to({}, { duration: mobile ? 0.06 : 0.1 }, beats.holdB);

    /* ACT 4 — gallery */
    heroScrollTl.to(enterLayer, {
      autoAlpha: 0,
      y: mobile ? -12 : -28,
      duration: mobile ? 0.14 : 0.08
    }, beats.enterOut);

    if(galleryLayer){
      heroScrollTl.to(galleryLayer, {
        autoAlpha: 1,
        y: 0,
        duration: mobile ? 0.16 : 0.1
      }, beats.gallery);
    }

    if(galleryTiles.length){
      heroScrollTl.to(galleryTiles, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.1,
        stagger: mobile ? 0.01 : 0.015
      }, beats.galleryTiles);
    }

    heroScrollTl.to({}, { duration: 0.1 }, beats.holdGallery);

    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  function primeVideo(){
    video.pause();
    video.currentTime = 0;

    const start = () => {
      video.pause();
      video.currentTime = 0;
      buildTimeline();
    };

    if(video.readyState >= 3) start();
    else video.addEventListener('canplaythrough', start, { once: true });
  }

  video.addEventListener('play', () => video.pause());

  if(video.readyState >= 1) primeVideo();
  else video.addEventListener('loadedmetadata', primeVideo, { once: true });

  video.load();

  // Rebuild cinematic beats when crossing mobile ↔ desktop
  const mq = window.matchMedia('(max-width: 900px)');
  let lastMobile = mq.matches;
  const onModeChange = () => {
    if(mq.matches === lastMobile) return;
    lastMobile = mq.matches;
    if(video.readyState < 2) return;
    destroyHeroVideoScroll();
    syncRevealPanels(scope);
    refreshRevealSequence = () => syncRevealPanels(scope);
    buildTimeline();
  };
  if(typeof mq.addEventListener === 'function') mq.addEventListener('change', onModeChange);
  else if(typeof mq.addListener === 'function') mq.addListener(onModeChange);
}

/* ---------- 1. STYLE MOOD SWITCHER (Realismo / Anime / Oriental) ---------- */
function initStyleSwitcher(scope = document){
  const buttons = scope.querySelectorAll('.hero-styles [data-mood]');
  if(!buttons.length) return;

  const fadeTargets = scope.querySelectorAll(
    '.hero-content h1, .hero-tattoo, .hero-lead, .hero-styles, .page-head h1, .page-head p, .split h2, .split p'
  );

  function setActive(mood){
    buttons.forEach(b => b.classList.toggle('is-active', b.dataset.mood === mood));
  }

  function applyMood(mood){
    if(document.documentElement.getAttribute('data-style') === mood) return;

    const tl = gsap.timeline();
    tl.to(fadeTargets, { opacity: 0, y: 8, duration: .22, ease: 'power2.in', stagger: .02 })
      .add(() => {
        document.documentElement.setAttribute('data-style', mood);
        setActive(mood);
        if(typeof refreshRevealSequence === 'function') refreshRevealSequence();
      })
      .to(fadeTargets, { opacity: 1, y: 0, duration: .45, ease: 'power2.out', stagger: .02 });

    gsap.fromTo('.thumb.is-active, .card.is-visible, .showcase-featured',
      { filter: 'saturate(1)' },
      { filter: 'saturate(1.4)', duration: .3, yoyo: true, repeat: 1, ease: 'sine.inOut' });
  }

  buttons.forEach(btn => {
    if(btn.dataset.moodBound === '1') return;
    btn.dataset.moodBound = '1';
    btn.addEventListener('click', () => applyMood(btn.dataset.mood));
  });
  setActive(document.documentElement.getAttribute('data-style') || 'realismo');
}

/* ---------- 2. HERO thumbnail strip ---------- */
let thumbLightboxBound = false;
let thumbLightboxIndex = 0;
let thumbLightboxItems = [];

function getThumbLightboxEl(){
  return document.getElementById('media-lightbox');
}

function collectThumbLightboxItems(scope = document){
  const thumbs = scope.querySelectorAll('.thumb-strip .thumb');
  return Array.from(thumbs).map(thumb => {
    const img = thumb.querySelector('img');
    const video = thumb.querySelector('video');
    return {
      alt: (img && img.alt) || '',
      poster: img ? img.getAttribute('src') : '',
      video: video ? video.getAttribute('src') : ''
    };
  }).filter(item => item.poster || item.video);
}

function showThumbLightboxItem(index){
  const lb = getThumbLightboxEl();
  if(!lb || !thumbLightboxItems.length) return;

  thumbLightboxIndex = (index + thumbLightboxItems.length) % thumbLightboxItems.length;
  const item = thumbLightboxItems[thumbLightboxIndex];
  const img = lb.querySelector('.lb-img');
  const video = lb.querySelector('.lb-video');
  if(!img || !video) return;

  video.pause();
  video.removeAttribute('src');
  video.load();

  if(item.video){
    img.hidden = true;
    img.removeAttribute('src');
    video.hidden = false;
    video.poster = item.poster || '';
    video.src = item.video;
    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    const p = video.play();
    if(p && typeof p.catch === 'function') p.catch(() => {});
  } else {
    video.hidden = true;
    img.hidden = false;
    img.alt = item.alt;
    img.src = item.poster;
  }
}

function closeThumbLightbox(){
  const lb = getThumbLightboxEl();
  if(!lb) return;
  const video = lb.querySelector('.lb-video');
  if(video){
    video.pause();
    video.removeAttribute('src');
    video.load();
  }
  lb.classList.remove('is-open');
  lb.setAttribute('hidden', '');
  lb.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('is-lightbox-open');
}

function openMediaLightbox(items, index = 0){
  const lb = getThumbLightboxEl();
  if(!lb || !items || !items.length) return;

  thumbLightboxItems = items;
  lb.removeAttribute('hidden');
  lb.setAttribute('aria-hidden', 'false');
  document.body.classList.add('is-lightbox-open');
  void lb.offsetWidth;
  lb.classList.add('is-open');
  showThumbLightboxItem(index);
}

function openThumbLightbox(index, scope = document){
  openMediaLightbox(collectThumbLightboxItems(scope), index);
}

const SHOWCASE_VIDEO_BY_POSTER = {
  './img/javimanovalkiria.jpg': './img/javimanovalkiria.mp4',
  './img/javivalkiria.jpg': './img/javimanovalkiria.mp4',
  './img/javipatoazteca.jpg': './img/javiazteca.mp4',
  './img/javioriental.jpg': './img/javioriental.mp4',
  './img/javigatosamurai.jpg': './img/javigatosamurai.mp4',
  './img/starwarspato.jpg': './img/starwarspato.mp4',
  './img/patopierna.jpg': './img/patopierna.mp4',
  './img/javisamuraibrazo.jpeg': './img/javisamuraibrazo.mp4',
  './img/espaldapato.jpg': ''
};

function collectShowcaseLightboxItems(panel){
  if(!panel) return [];
  const nodes = panel.querySelectorAll('[data-showcase-img]');
  return Array.from(nodes).map(img => {
    const poster = img.getAttribute('src') || '';
    return {
      alt: img.alt || '',
      poster,
      video: SHOWCASE_VIDEO_BY_POSTER[poster] || ''
    };
  }).filter(item => item.poster);
}

function initShowcaseLightbox(scope = document){
  // Roles a11y; el click va por delegación global (una sola vez)
  scope.querySelectorAll('.style-showcase').forEach(panel => {
    [panel.querySelector('.showcase-featured'), ...panel.querySelectorAll('.showcase-shot')]
      .filter(Boolean)
      .forEach(el => {
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.setAttribute('aria-label', 'Ver imagen');
      });
  });
}

function bindThumbLightboxChrome(){
  if(thumbLightboxBound) return;
  const lb = getThumbLightboxEl();
  if(!lb) return;
  thumbLightboxBound = true;

  const closeBtn = lb.querySelector('.lb-close');
  const prevBtn = lb.querySelector('.lb-prev');
  const nextBtn = lb.querySelector('.lb-next');

  if(closeBtn) closeBtn.addEventListener('click', closeThumbLightbox);
  if(prevBtn) prevBtn.addEventListener('click', () => showThumbLightboxItem(thumbLightboxIndex - 1));
  if(nextBtn) nextBtn.addEventListener('click', () => showThumbLightboxItem(thumbLightboxIndex + 1));

  lb.addEventListener('click', (e) => {
    if(e.target === lb) closeThumbLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if(!lb.classList.contains('is-open')) return;
    if(e.key === 'Escape') closeThumbLightbox();
    if(e.key === 'ArrowLeft') showThumbLightboxItem(thumbLightboxIndex - 1);
    if(e.key === 'ArrowRight') showThumbLightboxItem(thumbLightboxIndex + 1);
  });

  let touchX = null;
  lb.addEventListener('touchstart', (e) => {
    touchX = e.changedTouches[0].clientX;
  }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if(touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if(Math.abs(dx) < 50) return;
    if(dx > 0) showThumbLightboxItem(thumbLightboxIndex - 1);
    else showThumbLightboxItem(thumbLightboxIndex + 1);
  }, { passive: true });

  // Delegación: thumbs + showcase (sobrevive a Barba sin duplicar listeners)
  document.addEventListener('click', (e) => {
    const thumb = e.target.closest('.thumb-strip .thumb');
    if(thumb){
      const strip = thumb.closest('.thumb-strip');
      const thumbs = strip ? [...strip.querySelectorAll('.thumb')] : [];
      const i = thumbs.indexOf(thumb);
      thumbs.forEach(o => o.classList.remove('is-active'));
      thumb.classList.add('is-active');
      if(typeof gsap !== 'undefined'){
        gsap.fromTo(thumb, { scale: .96 }, { scale: 1, duration: .35, ease: 'power2.out' });
      }
      if(window.matchMedia('(max-width: 900px)').matches && i >= 0){
        openThumbLightbox(i, document);
      }
      return;
    }

    const shot = e.target.closest('.showcase-featured, .showcase-shot');
    if(shot){
      const panel = shot.closest('.style-showcase');
      if(!panel) return;
      e.preventDefault();
      const targets = [
        panel.querySelector('.showcase-featured'),
        ...panel.querySelectorAll('.showcase-shot')
      ].filter(Boolean);
      const i = targets.indexOf(shot);
      const items = collectShowcaseLightboxItems(panel);
      if(items.length && i >= 0) openMediaLightbox(items, i);
    }
  });

  document.addEventListener('keydown', (e) => {
    if(e.key !== 'Enter' && e.key !== ' ') return;
    const shot = e.target.closest('.showcase-featured, .showcase-shot');
    if(!shot) return;
    e.preventDefault();
    shot.click();
  });
}

function initHeroThumbs(scope = document){
  // Thumbs se manejan por delegación en bindThumbLightboxChrome
  if(!scope.querySelector('.thumb-strip')) return;
  bindThumbLightboxChrome();
}

/* ---------- 2b. Hover → play tattoo video (poster on leave) ---------- */
function initMediaHover(scope = document){
  const tiles = scope.querySelectorAll('.media-tile.has-video');
  if(!tiles.length) return;

  tiles.forEach(tile => {
    if(tile.dataset.hoverBound === '1') return;
    tile.dataset.hoverBound = '1';

    const video = tile.querySelector('video');
    if(!video) return;

    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    const play = () => {
      tile.classList.add('is-playing');
      const p = video.play();
      if(p && typeof p.catch === 'function') p.catch(() => {});
    };

    const stop = () => {
      tile.classList.remove('is-playing');
      video.pause();
      try{ video.currentTime = 0; }catch(e){ /* ignore seek errors */ }
    };

    tile.addEventListener('pointerenter', play);
    tile.addEventListener('pointerleave', stop);
    tile.addEventListener('focusin', play);
    tile.addEventListener('focusout', stop);
  });
}

/* ---------- 3. GALLERY filter ---------- */
function initGalleryFilter(scope = document){
  const cards = scope.querySelectorAll('.gallery-grid .card');
  const filterBtns = scope.querySelectorAll('.style-filter [data-mood]');
  if(!cards.length || !filterBtns.length) return;

  function filterTo(mood){
    filterBtns.forEach(b => b.classList.toggle('is-active', b.dataset.mood === mood));

    const styleMood = mood === 'all' ? 'realismo' : mood;
    document.documentElement.setAttribute('data-style', styleMood);

    const tl = gsap.timeline();
    tl.to(cards, { opacity: 0, scale: .97, duration: .18, stagger: .012, ease: 'power2.in' })
      .add(() => {
        cards.forEach(c => {
          const show = mood === 'all' || c.dataset.mood === mood;
          c.style.display = show ? '' : 'none';
          c.classList.toggle('is-visible', show);
        });
      })
      .to(cards, {
        opacity: 1,
        scale: 1,
        duration: .35,
        stagger: .035,
        ease: 'power2.out',
        clearProps: 'opacity,scale'
      });
  }

  filterBtns.forEach(btn => {
    if(btn.dataset.filterBound === '1') return;
    btn.dataset.filterBound = '1';
    btn.addEventListener('click', () => filterTo(btn.dataset.mood));
  });
}

/* ---------- 4. Entrance animation ---------- */
function collectEntranceTargets(container){
  const targets = [];
  const push = (list) => list && list.forEach(el => targets.push(el));

  const hero = container.querySelector('.hero-content');
  if(hero) push(hero.querySelectorAll('.hero-styles, h1, p, .btn-outline'));

  // .hero-slide-cue is opacity-only — its CSS transform (scale) must not be touched

  push(container.querySelectorAll('.stage-exit .thumb'));

  const head = container.querySelector('.page-head');
  if(head) push(head.querySelectorAll('.eyebrow, h1, p'));

  const portrait = container.querySelector('.about-portrait');
  if(portrait) targets.push(portrait);

  const aboutCopy = container.querySelector('.about-copy');
  if(aboutCopy) push(aboutCopy.children);

  push(container.querySelectorAll('.gallery-grid .card'));
  push(container.querySelectorAll('.style-filter'));
  // home-flow-card: only via scroll reveal (entrance was leaving them stuck at opacity 0)

  return targets;
}

function playEntrance(container){
  const targets = collectEntranceTargets(container);
  const cue = container.querySelector('.hero-slide-cue');
  const armLayer = container.querySelector('.stage-arm');
  if(!targets.length && !cue && !armLayer) return null;

  const mobile = window.matchMedia('(max-width: 900px)').matches;
  const tl = gsap.timeline({ overwrite: true });

  if(armLayer){
    gsap.killTweensOf(armLayer);
    gsap.set(armLayer, { autoAlpha: 0 });
    tl.to(armLayer, {
      autoAlpha: 1,
      duration: 1.15,
      ease: 'power2.out'
    }, 0);
  }

  if(targets.length){
    gsap.killTweensOf(targets);
    gsap.set(targets, { opacity: 0, y: mobile ? 16 : 22 });
    tl.to(targets, {
      opacity: 1,
      y: 0,
      duration: mobile ? 0.78 : 0.7,
      stagger: mobile ? 0.045 : 0.05,
      ease: 'power3.out',
      clearProps: 'opacity,transform'
    }, mobile ? 0.12 : 0.08);
  }

  if(cue){
    gsap.killTweensOf(cue);
    cue.classList.remove('is-alive');
    // Opacity only — CSS lleva el transform + ghost loop
    gsap.set(cue, { opacity: 0 });
    tl.to(cue, {
      opacity: 1,
      duration: 0.85,
      ease: 'power2.out',
      clearProps: 'opacity',
      onComplete: () => cue.classList.add('is-alive')
    }, mobile ? 0.28 : 0.18);
  }

  return tl;
}

/* ---------- 5. Init page (logic vs entrance separated) ---------- */
function cleanupPage(){
  destroyHeroVideoScroll();
  closeThumbLightbox();
  if(typeof ScrollTrigger !== 'undefined'){
    ScrollTrigger.getAll().forEach(st => st.kill());
  }
}

function initPageLogic(container){
  initStyleSwitcher(container);
  initHeroThumbs(container);
  initShowcaseLightbox(container);
  initMediaHover(container);
  initHeroVideoScroll(container);
  initGalleryFilter(container);
  initHomeFlowReveal(container);
  syncNavActive();
}

function initHomeFlowReveal(scope = document){
  if(typeof ScrollTrigger === 'undefined') return;
  const flow = scope.querySelector('.home-flow');
  if(!flow) return;

  const targets = flow.querySelectorAll('.home-flow-head > *, .home-flow-card');
  if(!targets.length) return;

  gsap.fromTo(targets,
    { opacity: 0, y: 36 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.08,
      ease: 'power3.out',
      clearProps: 'opacity,transform',
      scrollTrigger: {
        trigger: flow,
        start: 'top 85%',
        once: true,
        invalidateOnRefresh: true
      }
    }
  );
}

function onceComplete(tween){
  return new Promise(resolve => {
    if(!tween) return resolve();
    if(typeof tween.totalProgress === 'function' && tween.totalProgress() >= 1){
      return resolve();
    }
    tween.eventCallback('onComplete', resolve);
  });
}

async function whenFontsReady(){
  try{
    if(document.fonts && document.fonts.ready){
      await Promise.race([
        document.fonts.ready,
        new Promise(r => setTimeout(r, 1200))
      ]);
    }
  }catch(e){ /* ignore */ }
}

function syncNavActive(){
  const path = (location.pathname.split('/').pop() || 'index.html').replace(/^\//, '');
  const file = path || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    a.classList.toggle('active', href === file);
  });
}

/* ---------- 6. BARBA — cortina cream bottom → top ---------- */
document.addEventListener('DOMContentLoaded', async () => {
  const firstContainer = document.querySelector('[data-barba="container"]') || document;

  await whenFontsReady();

  const bootTargets = collectEntranceTargets(firstContainer);
  const bootCue = firstContainer.querySelector('.hero-slide-cue');
  if(bootTargets.length) gsap.set(bootTargets, { opacity: 0, y: 22 });
  if(bootCue) gsap.set(bootCue, { opacity: 0 });

  document.documentElement.classList.add('is-fonts-ready');

  bindThumbLightboxChrome();
  initPageLogic(firstContainer);
  const entranceTl = playEntrance(firstContainer);
  if(entranceTl){
    entranceTl.eventCallback('onComplete', () => {
      if(typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  } else if(typeof ScrollTrigger !== 'undefined'){
    ScrollTrigger.refresh();
  }

  if(typeof barba === 'undefined') return;

  const overlay = document.querySelector('.transition-overlay');
  if(!overlay) return;

  gsap.set(overlay, { yPercent: 100, autoAlpha: 0, force3D: true });

  if(location.protocol === 'file:'){
    console.warn('[JaviPato] Abre el sitio con un servidor local. Con file:// Barba no puede hacer PJAX y la cortina falla.');
  }

  barba.init({
    preventRunning: true,
    timeout: 8000,
    transitions: [{
      name: 'curtain-wipe',
      sync: false,

      async leave(data){
        document.documentElement.classList.add('is-changing');
        cleanupPage();

        await onceComplete(
          gsap.timeline({ defaults: { force3D: true } })
            .set(overlay, {
              autoAlpha: 1,
              yPercent: 100,
              pointerEvents: 'all',
              zIndex: 99999
            })
            .to(overlay, {
              yPercent: 0,
              duration: 0.62,
              ease: 'power4.inOut'
            })
        );

        gsap.set(data.current.container, { autoAlpha: 0 });
      },

      async enter(data){
        window.scrollTo(0, 0);

        gsap.set(data.next.container, {
          autoAlpha: 1,
          clearProps: 'transform'
        });

        // Prep entrance under the curtain (no flash)
        const nextTargets = collectEntranceTargets(data.next.container);
        const nextCue = data.next.container.querySelector('.hero-slide-cue');
        const nextArm = data.next.container.querySelector('.stage-arm');
        if(nextTargets.length) gsap.set(nextTargets, { opacity: 0, y: 18 });
        if(nextCue) gsap.set(nextCue, { opacity: 0 });
        if(nextArm) gsap.set(nextArm, { autoAlpha: 0 });

        initPageLogic(data.next.container);

        await onceComplete(
          gsap.timeline({ defaults: { force3D: true } })
            .to(overlay, {
              yPercent: -100,
              duration: 0.68,
              ease: 'power4.inOut'
            })
            .set(overlay, {
              autoAlpha: 0,
              yPercent: 100,
              pointerEvents: 'none'
            })
        );

        document.documentElement.classList.remove('is-changing');
        gsap.set(data.next.container, { clearProps: 'position,top,left,width,minHeight' });

        const tl = playEntrance(data.next.container);
        if(tl){
          await onceComplete(tl);
        }
        if(typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      }
    }]
  });
});
