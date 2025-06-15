gsap.registerPlugin(ScrollTrigger, ScrollSmoother, DrawSVGPlugin);

// Detectar si es dispositivo móvil
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Optimización: Uso de requestAnimationFrame para mejor rendimiento
let ticking = false;
let lastScrollY = 0;

// Función para manejar las animaciones de scroll de manera más eficiente
function onScroll() {
    lastScrollY = window.scrollY;
    if (!ticking) {
        requestAnimationFrame(() => {
            handleScrollAnimations(lastScrollY);
            ticking = false;
        });
        ticking = true;
    }
}

// Configuración inicial solo para la sección hero
if (isMobile) {
    const controlledSections = [".hero", ".heading"];
    let isScrollControlled = true;

    const snapControl = ScrollTrigger.create({
        snap: {
            snapTo: controlledSections.map((_, i) => i / (controlledSections.length - 1)),
            duration: { min: 0.2, max: 0.4 }, // Reducido para mejor rendimiento
            ease: "power1.out",
            inertia: false // Desactivado para mejor rendimiento
        }
    });

    // Desactivar el control del scroll después de "En España"
    ScrollTrigger.create({
        trigger: "#en-espana",
        start: "top center",
        onEnter: () => {
            if (isScrollControlled) {
                snapControl.kill();
                isScrollControlled = false;
            }
        }
    });
}

// Scroll Smoother optimizado
let smoother = ScrollSmoother.create({
    smooth: isMobile ? 0.8 : 1.5, // Valores reducidos para mejor rendimiento
    effects: true,
    smoothTouch: 0.6,
    normalizeScroll: true,
    ignoreMobileResize: true,
    preventDefault: true,
    renderByPixels: true, // Mejor rendimiento en dispositivos de alta densidad
    clearProps: true // Limpia las propiedades después de la animación
});

// Optimización: Usar will-change solo cuando sea necesario
const optimizePerformance = () => {
    const cards = document.querySelectorAll('.text-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.willChange = 'transform, opacity';
            } else {
                entry.target.style.willChange = 'auto';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => observer.observe(card));
};

// Animación SVG optimizada
if (document.querySelector('.draw') && document.querySelector('.heading')) {
    gsap.from('.draw', {
        drawSVG: "0%",
        ease: "expo.out",
        scrollTrigger: {
            trigger: '.heading',
            start: "clamp(center center)",
            scrub: 1,
            pin: '.pin',
            pinSpacing: false,
            fastScrollEnd: true, // Mejor rendimiento en scroll rápido
        }
    });
}

// Animación optimizada para "En España"
ScrollTrigger.create({
    trigger: ".hero",
    start: "center center",
    end: "bottom top",
    onEnter: () => document.getElementById('en-espana').classList.add('visible'),
    onLeaveBack: () => document.getElementById('en-espana').classList.remove('visible'),
    markers: false
});

// Batch de animaciones para mejor rendimiento
const batchAnimations = gsap.utils.batch((targets) => {
    gsap.from(targets, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: {
            each: 0.15,
            from: "start"
        }
    });
}, { once: true });

// Animaciones de tarjetas optimizadas
document.querySelectorAll('.text-card').forEach(card => {
    ScrollTrigger.create({
        trigger: card,
        start: "top bottom-=100",
        onEnter: () => batchAnimations(card.children),
        once: true // Se ejecuta solo una vez para mejor rendimiento
    });
});

// Inicializar optimizaciones
document.addEventListener('DOMContentLoaded', () => {
    optimizePerformance();
    window.addEventListener('scroll', onScroll, { passive: true });
});

// Limpieza de eventos cuando no son necesarios
window.addEventListener('beforeunload', () => {
    window.removeEventListener('scroll', onScroll);
});


