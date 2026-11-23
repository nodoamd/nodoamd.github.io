/* Destilado de las dos plantillas de Nodo.
   De la web: loader corto y cortinilla entre páginas (Barba). Lenis no va: allí está apagado.
   Del starter: entrada del hero y reveals con data-animate / data-stagger (GSAP).
   El texto del cliente vive en el HTML. Este archivo no se cambia al duplicar la carpeta. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function q(sel, root) { return (root || document).querySelector(sel); }
  function qa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function setNav(namespace) {
    qa("[data-nav]").forEach(function (link) {
      var on = link.getAttribute("data-nav") === namespace;
      link.classList.toggle("is-on", on);
      if (on) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function closeNav() {
    document.body.classList.remove("nav-open");
    var burger = q(".burger");
    if (burger) burger.setAttribute("aria-expanded", "false");
  }

  function initMenu() {
    var burger = q(".burger");
    if (!burger) return;
    burger.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function initDelegates() {
    document.addEventListener("click", function (event) {
      var mould = event.target.closest("[data-mould]");
      if (mould) {
        var root = mould.closest("[data-moulder]") || document;
        var frame = q("[data-frame]", root);
        if (frame) frame.setAttribute("data-frame", mould.getAttribute("data-mould"));
        qa("[data-mould]", root).forEach(function (button) {
          button.setAttribute("aria-pressed", button === mould ? "true" : "false");
        });
        return;
      }

      var filter = event.target.closest("[data-filter]");
      if (filter) {
        var section = filter.closest("section") || document;
        var kind = filter.getAttribute("data-filter");
        qa("[data-filter]", section).forEach(function (button) {
          button.setAttribute("aria-pressed", button === filter ? "true" : "false");
        });
        qa(".piece", section).forEach(function (piece) {
          piece.hidden = kind !== "todo" && piece.getAttribute("data-kind") !== kind;
        });
        if (window.ScrollTrigger) ScrollTrigger.refresh();
        return;
      }

      if (event.target.closest(".nav a")) closeNav();
    });

    document.addEventListener("submit", function (event) {
      var form = event.target.closest("[data-mail]");
      if (!form) return;
      event.preventDefault();
      var data = new FormData(form);
      var body = "Pieza: " + (data.get("pieza") || "") + "\nMedida: " + (data.get("medida") || "") + "\n\n" + (data.get("nota") || "");
      window.location.href = "mailto:" + form.getAttribute("data-mail") + "?subject=" + encodeURIComponent("Enmarcado") + "&body=" + encodeURIComponent(body);
    });
  }

  function hideLoader() {
    var loader = q(".loader");
    if (!loader) return Promise.resolve();
    if (reduce || !window.gsap) {
      loader.remove();
      return Promise.resolve();
    }
    return new Promise(function (resolve) {
      window.setTimeout(function () {
        gsap.to(loader, {
          opacity: 0,
          duration: 0.35,
          ease: "power2.out",
          onComplete: function () { loader.remove(); resolve(); }
        });
      }, 380);
    });
  }

  function panel(show) {
    var wipe = q(".wipe");
    if (!wipe || reduce || !window.gsap) return Promise.resolve();
    return gsap.to(wipe, {
      scaleY: show ? 1 : 0,
      duration: show ? 0.32 : 0.4,
      ease: show ? "power3.in" : "power3.out",
      transformOrigin: show ? "top" : "bottom"
    });
  }

  function hero(container) {
    if (reduce || !window.gsap || !container) return;
    var bits = [".hero__eyebrow", ".hero__title", ".hero__subtitle", ".hero__actions", ".hero__visual"]
      .map(function (sel) { return q(sel, container); })
      .filter(Boolean);
    if (!bits.length) return;
    gsap.fromTo(bits, { opacity: 0, y: 18 }, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: "power3.out",
      clearProps: "opacity,transform"
    });
  }

  function bind(container) {
    if (!window.gsap || !window.ScrollTrigger) return;
    ScrollTrigger.getAll().forEach(function (trigger) { trigger.kill(); });
    if (reduce || !container) return;

    qa("[data-animate]", container).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 22 }, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        clearProps: "opacity,transform",
        immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });

    qa("[data-stagger]", container).forEach(function (group) {
      gsap.fromTo(group.children, { opacity: 0, y: 18 }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.07,
        ease: "power3.out",
        clearProps: "opacity,transform",
        immediateRender: false,
        scrollTrigger: { trigger: group, start: "top 86%", once: true }
      });
    });
    ScrollTrigger.refresh();
  }

  function prepare(container) {
    if (!container) return;
    setNav(container.getAttribute("data-barba-namespace"));
    bind(container);
    if (container.focus) container.focus({ preventScroll: true });
  }

  document.addEventListener("DOMContentLoaded", async function () {
    if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    initMenu();
    initDelegates();
    var container = q("[data-barba='container']");
    prepare(container);
    hero(container);
    await hideLoader();

    if (!window.barba) return;
    barba.init({
      preventRunning: true,
      transitions: [{
        name: "wipe",
        async leave() { await panel(1); },
        async enter(data) {
          window.scrollTo(0, 0);
          closeNav();
          prepare(data.next.container);
          await panel(0);
          hero(data.next.container);
        }
      }]
    });
  });
})();
