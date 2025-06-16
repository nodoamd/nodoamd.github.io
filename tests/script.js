gsap.registerPlugin(ScrollTrigger, ScrollSmoother, DrawSVGPlugin);




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


