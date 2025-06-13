gsap.registerPlugin(ScrollTrigger, ScrollSmoother, DrawSVGPlugin);

// Crear el efecto de scroll suave
let smoother = ScrollSmoother.create({
  smooth: 2,
  effects: true
});

// Animación de trazado SVG
if (document.querySelector('.draw') && document.querySelector('.heading')) {
  gsap.from('.draw', {
    drawSVG: "0%",
    ease: "expo.out",
    scrollTrigger: {
      trigger: '.heading',
      start: "clamp(center center)",
      scrub: true,
      pin: '.pin',
      pinSpacing: false,
    }
  });
}

// Setup visual
gsap.set(".logo svg", { opacity: 1 });