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
    featured: './img/tatu4.png',
    shots: ['./img/tatu2.png', './img/tatu3.png']
  },
  oriental: {
    title: 'Oriental',
    lead: 'Tradición, budismo y composición japonesa. Piezas con peso simbólico y flujo.',
    featured: './img/tatu3.png',
    shots: ['./img/tatu1.png', './img/kiki.png']
  },
  anime: {
    title: 'Anime',
    lead: 'Personajes, color y línea limpia. Energía pop con acabado de estudio.',
    featured: './img/tatuanime.png',
    shots: ['./img/tatuanime.png', './img/tatu4.png']
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

  const slideCue = exitLayer.querySelector('.hero-slide-cue');
  const panelA = enterLayer.querySelector('.style-showcase.is-primary');
  const panelB = enterLayer.querySelector('.style-showcase.is-secondary');
  const galleryLayer = stage.querySelector('.stage-gallery');
  const galleryTiles = galleryLayer ? galleryLayer.querySelectorAll('.bento-tile') : [];

  syncRevealPanels(scope);
  refreshRevealSequence = () => syncRevealPanels(scope);

  video.muted = true;
  video.playsInline = true;
  video.pause();

  function buildTimeline(){
    const dur = video.duration;
    if(!dur || !Number.isFinite(dur)) return;

    video.pause();
    video.currentTime = 0;

    gsap.set(enterLayer, { opacity: 0, y: 48 });
    gsap.set(exitLayer, { opacity: 1, y: 0 });
    if(armLayer) gsap.set(armLayer, { opacity: 1, filter: 'blur(0px)' });
    if(panelA) gsap.set(panelA, { opacity: 0, y: 28 });
    if(panelB) gsap.set(panelB, { opacity: 0, y: 28 });
    if(galleryLayer) gsap.set(galleryLayer, { opacity: 0, y: 40 });
    if(galleryTiles.length) gsap.set(galleryTiles, { opacity: 0, y: 24, scale: 0.97 });

    // Extra room for gallery beat
    const scrollLength = () => Math.round(Math.max(window.innerHeight * 6.4, 5600));

    heroScrollTl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: () => `+=${scrollLength()}`,
        pin: true,
        pinSpacing: true,
        scrub: 1.15,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate(self){
          const videoProgress = gsap.utils.clamp(0, 1, self.progress / 0.48);
          const t = videoProgress * Math.max(dur - 0.05, 0);
          if(Math.abs(video.currentTime - t) > 0.04){
            video.currentTime = t;
          }
          if(slideCue){
            gsap.set(slideCue, { opacity: Math.max(0, 1 - self.progress * 10) });
          }
          enterLayer.classList.toggle('is-live', self.progress > 0.16 && self.progress < 0.72);
          if(galleryLayer){
            galleryLayer.classList.toggle('is-live', self.progress > 0.74);
            galleryLayer.setAttribute('aria-hidden', self.progress > 0.74 ? 'false' : 'true');
          }
        }
      }
    });

    /* ACT 1 — hero lifts, arm stays */
    heroScrollTl.to(exitLayer, {
      y: () => -(window.innerHeight * 0.78),
      opacity: 0,
      duration: 0.18
    }, 0);

    /* ACT 2 — first style (Oriental if on Realismo) */
    heroScrollTl.to(enterLayer, {
      y: 0,
      opacity: 1,
      duration: 0.14
    }, 0.1);

    if(panelA){
      heroScrollTl.to(panelA, {
        opacity: 1,
        y: 0,
        duration: 0.14
      }, 0.12);
    }

    /* HOLD oriental */
    heroScrollTl.to({}, { duration: 0.16 }, 0.26);

    /* ACT 3 — crossfade to anime + arm starts dissolving */
    if(panelA && panelB){
      heroScrollTl.to(panelA, {
        opacity: 0,
        y: -36,
        duration: 0.12
      }, 0.42);

      heroScrollTl.to(panelB, {
        opacity: 1,
        y: 0,
        duration: 0.14
      }, 0.42);
    }

    if(armLayer){
      heroScrollTl.to(armLayer, {
        opacity: 0.55,
        filter: 'blur(6px)',
        duration: 0.16
      }, 0.44);
    }

    /* HOLD anime while arm keeps fading */
    heroScrollTl.to({}, { duration: 0.12 }, 0.56);

    if(armLayer){
      heroScrollTl.to(armLayer, {
        opacity: 0.18,
        filter: 'blur(14px)',
        duration: 0.12
      }, 0.58);
    }

    /* ACT 4 — styles out, arm gone, gallery in */
    heroScrollTl.to(enterLayer, {
      opacity: 0,
      y: -40,
      duration: 0.1
    }, 0.68);

    if(armLayer){
      heroScrollTl.to(armLayer, {
        opacity: 0,
        filter: 'blur(22px)',
        duration: 0.12
      }, 0.68);
    }

    if(galleryLayer){
      heroScrollTl.to(galleryLayer, {
        opacity: 1,
        y: 0,
        duration: 0.14
      }, 0.72);
    }

    if(galleryTiles.length){
      heroScrollTl.to(galleryTiles, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.14,
        stagger: 0.02
      }, 0.74);
    }

    /* HOLD curated gallery */
    heroScrollTl.to({}, { duration: 0.16 }, 0.88);

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
}

/* ---------- 1. STYLE MOOD SWITCHER (Realismo / Anime / Oriental) ---------- */
function initStyleSwitcher(scope = document){
  const buttons = scope.querySelectorAll('.hero-styles [data-mood]');
  if(!buttons.length) return;

  const fadeTargets = scope.querySelectorAll(
    '.hero-content h1, .hero-content p, .hero-styles, .page-head h1, .page-head p, .split h2, .split p'
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

  const cue = container.querySelector('.hero-slide-cue');
  if(cue) targets.push(cue);

  push(container.querySelectorAll('.stage-exit .thumb'));

  const head = container.querySelector('.page-head');
  if(head) push(head.querySelectorAll('.eyebrow, h1, p'));

  const portrait = container.querySelector('.about-portrait');
  if(portrait) targets.push(portrait);

  const aboutCopy = container.querySelector('.about-copy');
  if(aboutCopy) push(aboutCopy.children);

  push(container.querySelectorAll('.gallery-grid .card'));
  push(container.querySelectorAll('.home-flow-card'));
  push(container.querySelectorAll('.style-filter'));

  return targets;
}

function playEntrance(container){
  const targets = collectEntranceTargets(container);
  if(!targets.length) return null;

  gsap.killTweensOf(targets);
  gsap.set(targets, { opacity: 0, y: 22 });

  return gsap.to(targets, {
    opacity: 1,
    y: 0,
    duration: 0.7,
    stagger: 0.05,
    ease: 'power3.out',
    clearProps: 'opacity,transform',
    overwrite: true
  });
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
        start: 'top 78%',
        once: true
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
