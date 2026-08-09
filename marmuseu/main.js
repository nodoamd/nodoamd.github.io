/* ================================================
   LA MAR DE MUSEUS | GSAP + ScrollTrigger + Barba
   ================================================ */

document.documentElement.classList.add("js");

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const MUSEUMS = [
  { id: "taller-barques", name: "Taller de les barques", place: "Port-Vendres, Rosselló", region: "Rosselló", desc: "Ofici i fusta viva al Rosselló: on es repara la memòria de les barques tradicionals.", img: "https://museusmaritims.mmb.cat/wp-content/uploads/2024/04/museu-polilles-01.jpg" },
  { id: "mediterrania", name: "Museu de la Mediterrània", place: "Torroella de Montgrí", region: "Costa Brava", desc: "Cultura, paisatge i comunitat al massís del Montgrí.", img: "https://museusmaritims.mmb.cat/wp-content/uploads/2024/04/museu-torroella-01.jpg" },
  { id: "anxova-sal", name: "Museu de l'Anxova i de la Sal", place: "L'Escala", region: "Costa Brava", desc: "La sal i l'anxova com a ofici, sabor i economia d'un port.", img: "https://museusmaritims.mmb.cat/wp-content/uploads/2024/04/museu-anxova-escala-01.jpg" },
  { id: "pesca", name: "Museu de la Pesca", place: "Palamós", region: "Costa Brava", desc: "La cultura pesquera en primera persona: barques, arts i el peix.", img: "https://museusmaritims.mmb.cat/wp-content/uploads/2024/04/museu-palamos-01.jpg" },
  { id: "historia-guixols", name: "Museu d'Història", place: "Sant Feliu de Guíxols", region: "Costa Brava", desc: "Història local lligada al port i la vida marítima.", img: "https://museusmaritims.mmb.cat/wp-content/uploads/2024/04/museu-st-feliu-guixols-01.jpg" },
  { id: "mar-lloret", name: "Museu del Mar", place: "Lloret de Mar", region: "Costa Brava", desc: "Navegació, indianos i el llegat d'una vila de cara a la mar.", img: "https://museusmaritims.mmb.cat/wp-content/uploads/2024/04/museu-lloret-01.jpg" },
  { id: "mataro", name: "Museu de Mataró", place: "Mataró", region: "Maresme", desc: "Patrimoni i memòria d'una ciutat costanera del Maresme.", img: "https://museusmaritims.mmb.cat/wp-content/uploads/2024/04/museu-mataro-01.jpg" },
  { id: "nautica-masnou", name: "Museu Municipal de Nàutica del Masnou", place: "El Masnou", region: "Maresme", desc: "Instruments, cartes i oficis de la navegació.", img: "https://museusmaritims.mmb.cat/wp-content/uploads/2024/04/museu-nautica-masnou-01.jpg" },
  { id: "maritim-bcn", name: "Museu Marítim de Barcelona", place: "Barcelona", region: "Barcelona", desc: "Les Drassanes Reials: cultura marítima catalana.", img: "https://museusmaritims.mmb.cat/wp-content/uploads/2024/04/mmb-01.jpg" },
  { id: "sitges", name: "Museus de Sitges", place: "Sitges", region: "Garraf", desc: "Art, costa i modernisme davant del Mediterrani.", img: "https://museusmaritims.mmb.cat/wp-content/uploads/2024/04/museu-sitges-01.jpg" },
  { id: "espai-far", name: "Espai Far", place: "Vilanova i la Geltrú", region: "Garraf", desc: "El far, el port i la mirada contemporània al patrimoni marítim.", img: "assets/img/vilanovafaro.jpg" },
  { id: "confraria", name: "Centre d'Interpretació La Confraria", place: "Calafell", region: "Costa Daurada", desc: "La confraria i la vida de pescadors.", img: "https://museusmaritims.mmb.cat/wp-content/uploads/2024/03/museu-confraria-calafell-01.jpg" },
  { id: "historia-cambrils", name: "Museu d'Història de Cambrils", place: "Cambrils", region: "Costa Daurada", desc: "Història local i memòria portuària.", img: "https://museusmaritims.mmb.cat/wp-content/uploads/2024/03/museu-historia-cambrils-01.jpg" },
  { id: "port-tarragona", name: "Museu del Port de Tarragona", place: "Tarragona", region: "Costa Daurada", desc: "El port com a motor i porta marítima del sud.", img: "https://museusmaritims.mmb.cat/wp-content/uploads/2024/04/20220514_195946.jpg" },
  { id: "terres-ebre", name: "Museu de les Terres de l'Ebre", place: "Amposta", region: "Terres de l'Ebre", desc: "El delta, on el riu i la mar es troben.", img: "https://museusmaritims.mmb.cat/wp-content/uploads/2024/04/museu-ebre-01.jpg" },
  { id: "maritim-mallorca", name: "Museu Marítim de Mallorca", place: "Mallorca", region: "Illes Balears", desc: "Patrimoni marítim balear amb mirada contemporània.", img: "https://museusmaritims.mmb.cat/wp-content/uploads/2024/04/museu-mallorca-01.jpg" },
];

window.MUSEUMS = MUSEUMS;

function museumById(id) {
  return MUSEUMS.find((m) => m.id === id);
}

function killAllScrollTriggers() {
  ScrollTrigger.getAll().forEach((t) => t.kill());
}

function animateHero(scope = document) {
  const hero = scope.querySelector("[data-hero]") || scope.querySelector(".hero");
  if (!hero) return;

  const parts = hero.querySelectorAll("[data-anim]");
  const media = hero.querySelector("[data-hero-media]");
  const netPaths = hero.querySelectorAll("[data-hero-net] path");

  if (prefersReducedMotion) {
    gsap.set(parts, { opacity: 1, y: 0 });
    if (media) gsap.set(media, { scale: 1 });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  if (media) {
    gsap.set(media, { scale: 1.12 });
    tl.to(media, { scale: 1, duration: 2.2, ease: "power2.out" }, 0);
  }

  if (netPaths.length) {
    netPaths.forEach((path) => {
      let length = 160;
      try {
        length = path.getTotalLength ? path.getTotalLength() : 160;
      } catch (_) {}
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });
    tl.to(
      netPaths,
      { strokeDashoffset: 0, duration: 1.4, stagger: 0.05, ease: "power2.out" },
      0.15
    );
  }

  if (parts.length) {
    gsap.set(parts, { opacity: 0, y: 28 });
    tl.to(parts, { opacity: 1, y: 0, duration: 0.9, stagger: 0.11 }, 0.25);
  }

  if (media) {
    gsap.to(media, {
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }
}

function animateScrollCue(scope = document) {
  const cue = scope.querySelector("[data-scroll-cue]");
  const hero = scope.querySelector(".hero");
  if (!cue || !hero || prefersReducedMotion) return;
  gsap.to(cue, {
    opacity: 0,
    y: 12,
    ease: "none",
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "+=35%",
      scrub: true,
    },
  });
}

function animateOnScroll(scope = document) {
  scope.querySelectorAll("[data-anim-scroll]").forEach((el) => {
    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }
    gsap.set(el, { opacity: 0, y: 28 });
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.75, ease: "power2.out" });
      },
    });
  });
}

function animateMotifs(scope = document) {
  scope.querySelectorAll("[data-motif]").forEach((motif) => {
    const paths = motif.querySelectorAll("path, circle, ellipse, line, polyline");
    if (prefersReducedMotion) return;
    paths.forEach((path) => {
      let length = 120;
      try {
        length = path.getTotalLength ? path.getTotalLength() : 120;
      } catch (_) {}
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });
    ScrollTrigger.create({
      trigger: motif,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(paths, {
          strokeDashoffset: 0,
          duration: 1.35,
          ease: "power2.out",
          stagger: 0.06,
        });
      },
    });
  });
}

/** Hub voyage: pin + ScrollTrigger · un museu per pas de scroll */
const VOYAGE_ORDER = [
  "taller-barques",
  "anxova-sal",
  "mediterrania",
  "pesca",
  "historia-guixols",
  "mar-lloret",
  "mataro",
  "nautica-masnou",
  "maritim-bcn",
  "sitges",
  "espai-far",
  "confraria",
  "port-tarragona",
  "historia-cambrils",
  "terres-ebre",
  "maritim-mallorca",
];

/* Coords sobre costa-line.svg (lat → t al llarg del path; Mallorca a mar) */
const VOYAGE_XY = {
  "taller-barques": { x: 782.35, y: 42.76 },
  "anxova-sal": { x: 599.04, y: 82.61 },
  "mediterrania": { x: 611.5, y: 132.89 },
  "pesca": { x: 557.26, y: 201.55 },
  "historia-guixols": { x: 519.03, y: 221.47 },
  "mar-lloret": { x: 471.79, y: 237.74 },
  "mataro": { x: 387.41, y: 275.06 },
  "nautica-masnou": { x: 379.38, y: 296.27 },
  "maritim-bcn": { x: 345.91, y: 324.29 },
  "sitges": { x: 290.97, y: 396.51 },
  "espai-far": { x: 291.9, y: 398.21 },
  "confraria": { x: 290.99, y: 405.89 },
  "port-tarragona": { x: 327.24, y: 452.01 },
  "historia-cambrils": { x: 333.12, y: 467.42 },
  "terres-ebre": { x: 179.72, y: 582.89 },
  "maritim-mallorca": { x: 560, y: 480 },
};

/* Ruta museu→museu seguint la costa (no cordes pel mar) */
const VOYAGE_TRACE_D =
  "M782.4,42.8 L775.9,35.6 L767.3,33.4 L764.3,35.7 L769.1,38.1 L750.7,40.7 L739.8,34.7 L721.3,31.3 L701.2,29.3 L697.5,24.8 L683.6,22.6 L668.6,31.0 L656.4,36.5 L640.8,47.8 L622.9,49.4 L607.0,60.9 L600.4,71.3 L599.0,82.6 L598.3,86.9 L597.8,106.6 L606.2,117.4 L609.2,127.5 L611.5,132.9 L617.8,133.6 L619.6,138.1 L610.5,140.7 L607.4,153.5 L612.8,164.7 L609.4,176.6 L597.0,184.6 L580.3,191.8 L562.4,199.8 L557.2,201.6 L546.2,205.5 L528.7,213.0 L519.6,220.9 L519.0,221.5 L517.8,226.8 L500.5,231.5 L483.8,235.0 L471.9,237.7 L468.5,238.1 L450.5,241.9 L432.6,246.9 L429.6,247.7 L415.7,249.9 L399.2,260.3 L387.3,271.9 L387.4,275.1 L386.6,274.7 L397.9,280.9 L386.5,291.1 L379.3,296.4 L377.7,293.8 L380.7,289.8 L370.1,294.8 L360.2,307.7 L349.6,321.8 L345.9,324.2 L335.1,334.7 L322.3,348.0 L319.4,354.4 L306.8,366.6 L300.6,379.9 L292.2,388.8 L291.0,396.5 L292.8,396.9 L291.9,398.2 L290.5,400.2 L291.0,405.9 L295.1,414.3 L300.0,430.4 L309.0,443.2 L325.5,451.6 L327.2,452.0 L336.8,457.3 L333.8,467.3 L333.1,467.5 L320.3,472.5 L308.0,481.3 L290.3,487.1 L278.9,497.1 L272.3,506.1 L262.5,515.9 L257.0,533.3 L250.1,545.5 L244.3,552.4 L252.3,563.9 L245.2,568.7 L231.9,570.1 L223.0,568.5 L210.3,569.7 L193.1,573.5 L179.7,582.9";

const VW = 817.53;
const VH = 610.77;

function initVoyage(scope = document) {
  const root = scope.querySelector("[data-voyage]");
  if (!root) return;

  const stage = root.querySelector("[data-voyage-pin]") || root;
  const camera = root.querySelector("[data-voyage-camera]");
  const mapwrap = root.querySelector(".voyage__mapwrap");
  const mediaWrap = root.querySelector("[data-voyage-media]");
  const imgEl = root.querySelector("[data-voyage-img]");
  const tracePath = root.querySelector("[data-voyage-trace]");
  const pointsEl = root.querySelector("[data-voyage-points]");
  const activeEl = root.querySelector("[data-voyage-active]");
  const hintEl = root.querySelector("[data-voyage-hint]");
  const listEl = root.querySelector("[data-voyage-list]");
  const counterEl = root.querySelector("[data-voyage-counter]");
  const counterN = root.querySelector("[data-voyage-n]");
  const counterRest = root.querySelector("[data-voyage-rest]");
  const placeEl = root.querySelector("[data-voyage-place]");
  const nameEl = root.querySelector("[data-voyage-name]");
  const descEl = root.querySelector("[data-voyage-desc]");
  const ctaEl = root.querySelector("[data-voyage-cta]");
  const cta2El = root.querySelector("[data-voyage-cta2]");
  const infoEl = root.querySelector("[data-voyage-info]");
  const ns = "http://www.w3.org/2000/svg";

  if (!pointsEl || !listEl) return;

  const overview = { x: 470, y: 310, scale: 1.08 };
  const focusScale = 1.32;

  const stops = VOYAGE_ORDER.map((id) => {
    const meta = museumById(id);
    const xy = VOYAGE_XY[id] || { x: 400, y: 300 };
    return { id, meta, ...xy };
  });

  // Preload imatges perquè l’acordeó no “salti”
  stops.forEach((s) => {
    if (s.meta?.img) {
      const im = new Image();
      im.src = s.meta.img;
    }
  });

  if (tracePath) tracePath.setAttribute("d", VOYAGE_TRACE_D);

  pointsEl.innerHTML = "";
  if (activeEl) activeEl.innerHTML = "";

  const iniciBtn = listEl.querySelector('[data-voyage-item="inici"]');
  listEl.querySelectorAll('[data-voyage-item]:not([data-voyage-item="inici"])').forEach((el) => el.remove());

  const listBtns = [];
  if (iniciBtn) listBtns.push(iniciBtn);

  const dots = [];
  stops.forEach((s, i) => {
    const g = document.createElementNS(ns, "g");
    g.setAttribute("transform", `translate(${s.x} ${s.y})`);
    g.setAttribute("class", "voyage-dot");
    g.style.cursor = "pointer";
    g.innerHTML =
      '<circle r="11" fill="transparent" class="vd-hit"/>' +
      '<circle r="6.5" fill="rgba(224,122,95,0.22)" class="vd-halo"/>' +
      '<circle r="3.2" fill="#0f5c6e" stroke="#fff" stroke-width="1.1" class="vd-dot"/>';
    pointsEl.appendChild(g);
    dots.push(g);

    const m = s.meta;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "voyage__list-item";
    btn.dataset.voyageItem = String(i);
    btn.innerHTML =
      `<span class="voyage__list-i">${String(i + 1).padStart(2, "0")}</span>` +
      `<span class="voyage__list-label">` +
      `<span class="voyage__list-place">${m ? (m.region || m.place) : ""}</span>` +
      `<span class="voyage__list-name">${m ? m.name : s.id}</span>` +
      `</span>`;
    listEl.appendChild(btn);
    listBtns.push(btn);
  });

  const activeG = document.createElementNS(ns, "g");
  activeG.setAttribute("opacity", "0");
  activeG.innerHTML =
    '<circle r="11" fill="none" stroke="rgba(224,122,95,0.35)" stroke-width="1"/>' +
    '<circle r="7" fill="none" stroke="#e07a5f" stroke-width="1.4"/>' +
    '<circle r="2.6" fill="#e07a5f"/>';
  activeEl.appendChild(activeG);

  let current = -2;
  let cardTl = null;
  let mediaOpen = false;
  let pinST = null;

  const slots = stops.length + 1; // Inici + 16

  function setCounter(index) {
    if (counterN) counterN.textContent = String(index < 0 ? 0 : index + 1);
    if (counterRest) counterRest.hidden = false;
    counterEl?.classList.toggle("is-inici", index < 0);
  }

  function setTrace(progress) {
    if (!tracePath) return;
    const u = Math.max(0, Math.min(1, progress));
    if (prefersReducedMotion) {
      tracePath.style.strokeDashoffset = String(1 - u);
      return;
    }
    gsap.to(tracePath, {
      strokeDashoffset: 1 - u,
      duration: 0.45,
      ease: "power2.out",
      overwrite: true,
    });
  }

  function cameraTarget(x, y, scale) {
    const w = camera.offsetWidth || mapwrap?.clientWidth || 1;
    const h = camera.offsetHeight || mapwrap?.clientHeight || 1;
    if (w < 10 || h < 10) return null;
    const fit = Math.min(w / VW, h / VH);
    const drawW = VW * fit;
    const drawH = VH * fit;
    const offX = (w - drawW) / 2;
    const offY = (h - drawH) / 2;
    const px = offX + (x / VW) * drawW;
    const py = offY + (y / VH) * drawH;
    return {
      transformOrigin: "0% 0%",
      x: w * 0.5 - px * scale,
      y: h * 0.5 - py * scale,
      scale,
    };
  }

  function frameCamera(x, y, scale, mode = "soft") {
    if (!camera) return;
    const props = cameraTarget(x, y, scale);
    if (!props) return;
    gsap.killTweensOf(camera);
    if (mode === "set" || prefersReducedMotion) {
      gsap.set(camera, props);
      return;
    }
    gsap.to(camera, {
      ...props,
      duration: mode === "scrub" ? 0.2 : 0.55,
      ease: "power2.out",
      overwrite: "auto",
    });
  }

  function syncList(index) {
    listBtns.forEach((btn) => {
      const key = btn.dataset.voyageItem;
      const on = index === -1 ? key === "inici" : key === String(index);
      btn.classList.toggle("is-active", on);
      if (on) {
        const top = btn.offsetTop - listEl.clientHeight * 0.35;
        listEl.scrollTo({ top: Math.max(0, top), behavior: prefersReducedMotion ? "auto" : "smooth" });
      }
    });
    dots.forEach((d, i) => {
      d.classList.toggle("is-hot", i === index);
      d.setAttribute("opacity", index < 0 ? "1" : i === index ? "1" : "0.55");
    });
  }

  function openCard(withMedia, { swap = false } = {}) {
    if (!mediaWrap) return;

    if (prefersReducedMotion) {
      mediaWrap.hidden = !withMedia;
      mediaOpen = withMedia;
      if (infoEl) gsap.set(infoEl, { opacity: 1, y: 0 });
      return;
    }

    if (cardTl) cardTl.kill();
    cardTl = gsap.timeline({ defaults: { ease: "power2.out" } });

    if (withMedia) {
      mediaWrap.hidden = false;
      if (!mediaOpen) {
        gsap.set(mediaWrap, { height: 0, opacity: 0 });
        cardTl.to(mediaWrap, { height: "auto", opacity: 1, duration: 0.5 }, 0);
      } else if (swap && imgEl) {
        cardTl.fromTo(
          imgEl,
          { opacity: 0.2, y: 10, scale: 1.03 },
          { opacity: 1, y: 0, scale: 1, duration: 0.45 },
          0
        );
      }
      mediaOpen = true;
    } else if (mediaOpen) {
      cardTl.to(
        mediaWrap,
        {
          height: 0,
          opacity: 0,
          duration: 0.35,
          onComplete: () => {
            mediaWrap.hidden = true;
          },
        },
        0
      );
      mediaOpen = false;
    }

    if (infoEl) {
      cardTl.fromTo(infoEl, { opacity: 0.4, y: 12 }, { opacity: 1, y: 0, duration: 0.4 }, 0.06);
    }
  }

  function applyContent(index) {
    if (index < 0) {
      setCounter(-1);
      if (placeEl) placeEl.textContent = "La xarxa";
      if (nameEl) nameEl.textContent = "Inici";
      if (descEl) {
        descEl.textContent =
          "Setze museus al fil de la costa. Desplaça’t per anar-los revelant un a un.";
      }
      if (ctaEl) {
        ctaEl.href = "museus.html";
        ctaEl.removeAttribute("data-barba-prevent");
        ctaEl.textContent = "Veure la xarxa";
      }
      if (cta2El) {
        cta2El.href = "#espai-far";
        cta2El.removeAttribute("data-barba-prevent");
        cta2El.textContent = "Espai Far";
      }
      if (imgEl) {
        imgEl.removeAttribute("src");
        imgEl.alt = "";
      }
      activeG.setAttribute("opacity", "0");
      setTrace(0);
      openCard(false);
      if (hintEl) hintEl.hidden = false;
      return;
    }

    const stop = stops[index];
    const m = stop.meta;
    const swapping = mediaOpen;
    setCounter(index);
    if (placeEl) placeEl.textContent = m ? (m.region || m.place) : "";
    if (nameEl) nameEl.textContent = m ? m.name : stop.id;
    if (descEl) descEl.textContent = m ? m.desc : "";
    if (ctaEl && m) {
      ctaEl.href = `museus/${m.id}.html`;
      ctaEl.setAttribute("data-barba-prevent", "");
      ctaEl.textContent = "Atracar-hi";
    }
    if (cta2El && m) {
      cta2El.href = `museus/${m.id}.html`;
      cta2El.setAttribute("data-barba-prevent", "");
      cta2El.textContent = "Saber-ne més";
    }
    if (imgEl && m?.img) {
      imgEl.src = m.img;
      imgEl.alt = m.name;
    }
    activeG.setAttribute("transform", `translate(${stop.x} ${stop.y})`);
    activeG.setAttribute("opacity", "1");
    const coastCount = stops.length - 1;
    const tr =
      stop.id === "maritim-mallorca"
        ? 1
        : Math.min(1, index / Math.max(1, coastCount - 1));
    setTrace(tr);
    openCard(true, { swap: swapping });
    if (hintEl) hintEl.hidden = true;
  }

  function goTo(index, { mode = "soft" } = {}) {
    if (index === current) return;
    current = index;
    applyContent(index);
    syncList(index);

    if (index < 0) {
      frameCamera(overview.x, overview.y, overview.scale, mode);
    } else {
      const stop = stops[index];
      frameCamera(stop.x, stop.y, focusScale, mode);
    }
  }

  function progressToIndex(progress) {
    const slot = Math.round(progress * (slots - 1));
    return Math.min(stops.length - 1, Math.max(-1, slot - 1));
  }

  function indexToProgress(index) {
    const slot = index + 1; // -1 → 0, 0 → 1, …
    return slot / (slots - 1);
  }

  function scrollToIndexSafe(index) {
    if (!pinST) {
      goTo(index, { mode: "soft" });
      return;
    }
    const p = indexToProgress(index);
    const y = pinST.start + (pinST.end - pinST.start) * p;
    window.scrollTo({ top: y, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  listBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.voyageItem;
      const idx = key === "inici" ? -1 : Number(key);
      scrollToIndexSafe(idx);
    });
  });

  dots.forEach((g, i) => {
    g.addEventListener("click", () => scrollToIndexSafe(i));
  });

  goTo(-1, { mode: "set" });

  if (prefersReducedMotion) {
    return;
  }

  // Pin + scrub: un museu per “pas” de scroll
  pinST = ScrollTrigger.create({
    id: "voyage-pin",
    trigger: root,
    start: "top top",
    end: () => `+=${Math.round(slots * window.innerHeight * 0.58)}`,
    pin: stage,
    scrub: 0.65,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    snap: {
      snapTo: (value) => {
        const step = 1 / (slots - 1);
        return Math.round(value / step) * step;
      },
      duration: { min: 0.12, max: 0.35 },
      ease: "power1.inOut",
      delay: 0.02,
    },
    onUpdate: (self) => {
      const idx = progressToIndex(self.progress);
      if (idx !== current) goTo(idx, { mode: "scrub" });
    },
    onEnter: () => root.classList.add("is-pinned"),
    onEnterBack: () => root.classList.add("is-pinned"),
    onLeave: () => root.classList.remove("is-pinned"),
    onLeaveBack: () => root.classList.remove("is-pinned"),
  });

  const onResize = () => {
    if (current < 0) frameCamera(overview.x, overview.y, overview.scale, "set");
    else frameCamera(stops[current].x, stops[current].y, focusScale, "set");
  };
  window.addEventListener("resize", onResize, { passive: true });
}

function initVoyageExit(scope = document) {
  const voyage = scope.querySelector("[data-voyage]");
  const far = scope.querySelector("[data-far]");
  if (!voyage || !far || prefersReducedMotion) return;

  const panel = voyage.querySelector(".voyage__panel");
  const mapwrap = voyage.querySelector(".voyage__mapwrap");

  gsap.fromTo(
    far,
    { opacity: 0.4, y: 70 },
    {
      opacity: 1,
      y: 0,
      ease: "none",
      scrollTrigger: {
        trigger: far,
        start: "top 95%",
        end: "top 45%",
        scrub: 0.75,
      },
    }
  );

  // Suau handoff quan el pin ja ha deixat anar
  if (mapwrap) {
    gsap.to(mapwrap, {
      opacity: 0.85,
      ease: "none",
      scrollTrigger: {
        trigger: voyage,
        start: "bottom 70%",
        end: "bottom 30%",
        scrub: true,
      },
    });
  }
  if (panel) {
    gsap.to(panel, {
      y: 20,
      opacity: 0.9,
      ease: "none",
      scrollTrigger: {
        trigger: voyage,
        start: "bottom 70%",
        end: "bottom 30%",
        scrub: true,
      },
    });
  }
}

function initFar(scope = document) {
  const root = scope.querySelector("[data-far]");
  if (!root) return;

  const media = root.querySelector("[data-far-media]");
  const parts = root.querySelectorAll("[data-far-anim]");

  if (prefersReducedMotion) {
    gsap.set(parts, { opacity: 1, y: 0 });
    return;
  }

  gsap.set(parts, { opacity: 0, y: 40 });

  if (media) {
    gsap.fromTo(
      media,
      { scale: 1.14, yPercent: 8 },
      {
        scale: 1,
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.9,
        },
      }
    );
  }

  gsap.to(parts, {
    opacity: 1,
    y: 0,
    stagger: 0.05,
    ease: "none",
    scrollTrigger: {
      trigger: root,
      start: "top 75%",
      end: "top 35%",
      scrub: 0.8,
    },
  });
}

function initHeaderTheme(scope = document) {
  const header = document.querySelector(".header");
  const voyage = scope.querySelector("[data-voyage]");
  if (!header || !voyage) return;

  const sync = () => {
    const r = voyage.getBoundingClientRect();
    const on = r.top < window.innerHeight * 0.2 && r.bottom > window.innerHeight * 0.25;
    header.classList.toggle("is-on-light", on);
  };

  ScrollTrigger.create({
    trigger: voyage,
    start: "top 12%",
    end: "bottom 20%",
    onEnter: () => header.classList.add("is-on-light"),
    onEnterBack: () => header.classList.add("is-on-light"),
    onLeave: () => header.classList.remove("is-on-light"),
    onLeaveBack: () => header.classList.remove("is-on-light"),
    onRefresh: sync,
  });
  sync();
}

function initPage(scope = document) {
  killAllScrollTriggers();
  scope.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
  animateHero(scope);
  animateScrollCue(scope);
  animateOnScroll(scope);
  animateMotifs(scope);
  initVoyage(scope);
  initVoyageExit(scope);
  initHeaderTheme(scope);
  initFar(scope);
  ScrollTrigger.refresh();
}

function initBarba() {
  if (typeof barba === "undefined") {
    initPage(document);
    return;
  }

  function updateNavActive(namespace) {
    document.querySelectorAll(".nav-link").forEach((link) => link.classList.remove("active"));
    const href = namespace === "museus" ? "museus.html" : "index.html";
    const active = document.querySelector(`.nav-link[href="${href}"]`);
    if (active) active.classList.add("active");
  }

  barba.init({
    prevent: ({ el, href }) =>
      (el && el.hasAttribute("data-barba-prevent")) ||
      (href && href.includes("/museus/")) ||
      (href && href.includes("#")),
    transitions: [
      {
        name: "fade",
        async leave({ current }) {
          killAllScrollTriggers();
          if (prefersReducedMotion) return;
          await gsap.to(current.container, { opacity: 0, duration: 0.35, ease: "power2.in" });
        },
        async enter({ next }) {
          window.scrollTo(0, 0);
          gsap.set(next.container, { opacity: 0 });
          if (prefersReducedMotion) {
            gsap.set(next.container, { opacity: 1 });
            return;
          }
          await gsap.to(next.container, { opacity: 1, duration: 0.45, ease: "power2.out" });
        },
        after({ next }) {
          updateNavActive(next.container.getAttribute("data-barba-namespace") || "home");
          initPage(next.container);
        },
      },
    ],
  });

  initPage(document);
}

document.addEventListener("DOMContentLoaded", initBarba);
