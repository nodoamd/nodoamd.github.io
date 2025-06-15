gsap.registerPlugin(ScrollTrigger, ScrollSmoother, DrawSVGPlugin);

let scrollControl;
let lastScrollTime = Date.now();
const SCROLL_TIMEOUT = 2000; // 2 segundos de inactividad antes de considerar que el scroll está quieto

// Detectar si es móvil
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Configuración más ligera para móviles
const smootherConfig = {
  smooth: isMobile ? 0.8 : 1.2, // Menos suavizado en móvil
  effects: true,
  smoothTouch: 0.1, // Valor más bajo para mejor rendimiento
  touchInertia: 0.5,
  ignoreMobileResize: true,
  preventDefault: true
};

// Prevenir el scroll automático no deseado
document.addEventListener('scroll', () => {
  lastScrollTime = Date.now();
}, { passive: true });

// Inicializar solo si no es móvil o es un dispositivo de gama alta
if (!isMobile || window.devicePixelRatio > 1) {
  scrollControl = ScrollTrigger.create({
    snap: {
      snapTo: [0, 0.33, 0.66],
      duration: {min: 0.2, max: 0.4}, // Duración más corta
      delay: 0,
      ease: "power1.inOut"
    },
    end: "+=200%",
    onUpdate: self => {
      const currentTime = Date.now();
      
      // Si el usuario no ha hecho scroll en los últimos 2 segundos, no permitir scroll automático
      if (currentTime - lastScrollTime > SCROLL_TIMEOUT) {
        return;
      }

      // Desactivar el snap después de "En España"
      if (document.querySelector('#en-espana').getBoundingClientRect().top < window.innerHeight * 0.5) {
        self.disable();
      }
    }
  });
}

// Crear el efecto de scroll suave optimizado para móvil
let smoother = ScrollSmoother.create({
    smooth: isMobile ? 1.2 : 2, // Ajuste más natural para móvil
    effects: true,
    smoothTouch: 0.8, // Suavizado específico para touch
    normalizeScroll: true,
    ignoreMobileResize: true,
    preventDefault: true
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

// Mostrar "En España." cuando el pin está activo
ScrollTrigger.create({
    trigger: ".hero",
    start: "center center",
    end: "bottom top",
    onEnter: () => document.getElementById('en-espana').classList.add('visible'),
    onLeaveBack: () => document.getElementById('en-espana').classList.remove('visible')
});

// Setup visual
gsap.set(".logo svg", { opacity: 1 });

// Animación para las tarjetas de texto
gsap.from(".text-card", {
    scrollTrigger: {
        trigger: ".text-card",
        start: "top bottom-=100",
        toggleActions: "play none none reverse"
    },
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.3,
    ease: "power3.out"
});

// Animación para los textos dentro de las tarjetas
gsap.from([".overline", ".about-title, .exp-title", ".about-desc, .exp-desc", ".highlight-text"], {
    scrollTrigger: {
        trigger: ".text-card",
        start: "top bottom-=100",
        toggleActions: "play none none reverse"
    },
    y: 20,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out"
});


