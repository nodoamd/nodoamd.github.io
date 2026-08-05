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
    shots: ['./img/espaldapato.jpg', './img/patopierna.jpg']
  },
  oriental: {
    title: 'Oriental',
    lead: 'Tradición, budismo y composición japonesa. Piezas con peso simbólico y flujo.',
    featured: './img/tatu3.png',
    shots: ['./img/tatu1.png', './img/espaldapato.jpg']
  },
  anime: {
    title: 'Anime',
    lead: 'Personajes, color y línea limpia. Energía pop con acabado de estudio.',
    featured: './img/tatuanime.png',
    shots: ['./img/tatuanime.png', './img/tatu2.png']
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
  const exitLayer = scope.querySelector('.stage-exit');
  const enterLayer = scope.querySelector('.stage-enter');
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
    video.currentTime = Math.min(0.22, Math.max(dur * 0.04, 0.08));

    gsap.set(enterLayer, { autoAlpha: 0, y: mobile ? 24 : 48 });
    gsap.set(exitLayer, { autoAlpha: 1, y: 0 });
    if(armLayer) gsap.set(armLayer, { autoAlpha: 1, clearProps: 'filter' });
    if(panelA) gsap.set(panelA, { autoAlpha: 0, y: mobile ? 16 : 28 });
    if(panelB) gsap.set(panelB, { autoAlpha: 0, y: mobile ? 16 : 28 });
    if(galleryLayer) gsap.set(galleryLayer, { autoAlpha: 0, y: 40 });
    if(galleryTiles.length) gsap.set(galleryTiles, { autoAlpha: 0, y: 24, scale: 0.97 });
    setActivePanel(null);
    stage.classList.remove('is-arm-clear', 'is-styles', 'is-gallery');

    // Mobile: short pin so the page actually moves on (not stuck scrubbing)
    const scrollLength = () => mobile
      ? Math.round(Math.max(window.innerHeight * 1.85, 1400))
      : Math.round(Math.max(window.innerHeight * 3.05, 2400));

    const beats = mobile
      ? {
          // No video scrub on mobile — frame stays put (no sudden enlarge)
          videoEnd: null,
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

          // Desktop only: scrub video. Mobile keeps a still frame.
          if(beats.videoEnd != null){
            const videoProgress = gsap.utils.clamp(0, 1, p / beats.videoEnd);
            const startT = Math.min(0.22, Math.max(dur * 0.04, 0.08));
            const t = startT + videoProgress * Math.max(dur - startT - 0.05, 0);
            if(Math.abs(video.currentTime - t) > 0.04){
              video.currentTime = t;
            }
          }

          stage.classList.remove('is-arm-clear');

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

  buttons.forEach(btn => btn.addEventListener('click', () => applyMood(btn.dataset.mood)));
  setActive(document.documentElement.getAttribute('data-style') || 'realismo');
}

/* ---------- 2. HERO thumbnail strip ---------- */
function initHeroThumbs(scope = document){
  const thumbs = scope.querySelectorAll('.thumb');
  if(!thumbs.length) return;

  thumbs.forEach(t => t.addEventListener('click', () => {
    thumbs.forEach(o => o.classList.remove('is-active'));
    t.classList.add('is-active');
    gsap.fromTo(t, { scale: .96 }, { scale: 1, duration: .35, ease: 'power2.out' });
  }));
}

/* ---------- 2b. Hover → play tattoo video (poster on leave) ---------- */
function initMediaHover(scope = document){
  const tiles = scope.querySelectorAll('.media-tile.has-video');
  if(!tiles.length) return;

  tiles.forEach(tile => {
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
  if(!targets.length && !cue) return null;

  const tl = gsap.timeline({ overwrite: true });

  if(targets.length){
    gsap.killTweensOf(targets);
    // Use yPercent-safe translate via y only on elements without layout transforms
    gsap.set(targets, { opacity: 0, y: 22 });
    tl.to(targets, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.05,
      ease: 'power3.out',
      // Never clear transform on nodes that rely on CSS transform (parent hero-content is fine;
      // children get inline translate cleared so we don't leave stale GSAP transforms)
      clearProps: 'opacity,transform'
    }, 0);
  }

  if(cue){
    gsap.killTweensOf(cue);
    // Opacity only — preserves translateY(-50%) scale(1.3) from CSS
    gsap.set(cue, { opacity: 0 });
    tl.to(cue, {
      opacity: 1,
      duration: 0.7,
      ease: 'power3.out',
      clearProps: 'opacity'
    }, 0.1);
  }

  return tl;
}

/* ---------- 5. Init page (logic vs entrance separated) ---------- */
function cleanupPage(){
  destroyHeroVideoScroll();
  if(typeof ScrollTrigger !== 'undefined'){
    ScrollTrigger.getAll().forEach(st => st.kill());
  }
}

function initPageLogic(container){
  initStyleSwitcher(container);
  initHeroThumbs(container);
  initMediaHover(container);
  initHeroVideoScroll(container);
  initGalleryFilter(container);
  initHomeFlowReveal(container);

  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === path);
  });
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

/* ---------- 6. BARBA — white curtain bottom → top ---------- */
document.addEventListener('DOMContentLoaded', async () => {
  const firstContainer = document.querySelector('[data-barba="container"]') || document;

  await whenFontsReady();

  // Hide before revealing fonts — prevents 1-frame FOUT / layout pop
  const bootTargets = collectEntranceTargets(firstContainer);
  const bootCue = firstContainer.querySelector('.hero-slide-cue');
  if(bootTargets.length) gsap.set(bootTargets, { opacity: 0, y: 22 });
  if(bootCue) gsap.set(bootCue, { opacity: 0 });

  document.documentElement.classList.add('is-fonts-ready');

  initPageLogic(firstContainer);
  playEntrance(firstContainer);

  if(typeof barba === 'undefined') return;

  const overlay = document.querySelector('.transition-overlay');
  if(!overlay) return;

  gsap.set(overlay, { yPercent: 100, autoAlpha: 0 });

  // file:// breaks Barba fetch — warn once in console
  if(location.protocol === 'file:'){
    console.warn('[JaviPato] Abre el sitio con un servidor local. Con file:// Barba no puede hacer PJAX y la cortina falla.');
  }

  barba.init({
    preventRunning: true,
    transitions: [{
      name: 'curtain-wipe',
      sync: false,

      async leave(data){
        document.documentElement.classList.add('is-changing');
        cleanupPage();

        // Curtain rises from bottom and fully covers (including header)
        await onceComplete(
          gsap.timeline()
            .set(overlay, {
              autoAlpha: 1,
              yPercent: 100,
              pointerEvents: 'all',
              zIndex: 99999
            })
            .to(overlay, {
              yPercent: 0,
              duration: 0.68,
              ease: 'power4.inOut'
            })
        );

        // Hide leaving page under the curtain so it cannot ghost with the next one
        gsap.set(data.current.container, { autoAlpha: 0 });
      },

      async enter(data){
        window.scrollTo(0, 0);

        // Next page is ready under the curtain — single visible container
        gsap.set(data.next.container, {
          autoAlpha: 1,
          clearProps: 'transform'
        });
        gsap.set(collectEntranceTargets(data.next.container), {
          clearProps: 'opacity,transform'
        });

        initPageLogic(data.next.container);

        // Curtain continues upward and reveals the new page
        await onceComplete(
          gsap.timeline()
            .to(overlay, {
              yPercent: -100,
              duration: 0.72,
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

        if(typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      }
    }]
  });
});
