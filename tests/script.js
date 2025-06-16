gsap.registerPlugin(ScrollTrigger, ScrollSmoother, DrawSVGPlugin);

// Detectar si es dispositivo móvil
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
    // Configuración de los puntos de anclaje
    const sections = [".hero", ".heading", ".about-hero"];
    
    // Crear un ScrollTrigger principal que maneje todos los snaps
    ScrollTrigger.create({
        snap: {
            snapTo: sections.map((_, i) => i / (sections.length - 1)),
            duration: { min: 0.3, max: 0.6 },
            ease: "power1.inOut",
            inertia: true
        }
    });

    // Configurar cada sección
    sections.forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: "top center",
            end: "bottom center",
            markers: false
        });
    });
}

// Crear el efecto de scroll suave optimizado para móvil
let smoother = ScrollSmoother.create({
    smooth: isMobile ? 1.2 : 2, // Ajuste más natural para móvil
    effects: true,
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
