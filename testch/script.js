gsap.registerPlugin(ScrollTrigger, ScrollSmoother, DrawSVGPlugin);

// // Detectar si es dispositivo móvil
// const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// if (isMobile) {
//     // Configuración de los puntos de anclaje
//     const sections = [".hero", ".heading", ".about-hero"];

//     // Crear un ScrollTrigger principal que maneje todos los snaps
//     ScrollTrigger.create({
//         snap: {
//             snapTo: sections.map((_, i) => i / (sections.length - 1)),
//             duration: { min: 0.3, max: 0.6 },
//             ease: "power1.inOut",
//             inertia: true
//         }
//     });

//     // Configurar cada sección
//     sections.forEach(section => {
//         ScrollTrigger.create({
//             trigger: section,
//             start: "top center",
//             end: "bottom center",
//             markers: false
//         });
//     });
// }

// Loading animation
window.addEventListener('load', () => {
    const loading = document.getElementById('loading');
    setTimeout(() => {
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500);
    }, 1000);
});


// Crear el efecto de scroll suave optimizado para móvil
let smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 0.1,
    effects: true,
    // normalizeScroll: true, // PRueba
    // ignoreMobileResize: true, // PRueba
    // preventDefault: true, // PRueba
    // lockAxis: true,    // bloquea el eje para evitar saltos
    // renderFixed: false // ayuda con elementos fijos
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


document.addEventListener('DOMContentLoaded', function () {
    const menuNav = document.querySelector('.menu-nav');
    const menuToggle = document.querySelector('.menu-toggle');
    const menuList = document.querySelector('.menu-list');

    menuToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        menuNav.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', menuNav.classList.contains('open'));
    });

    // Cierra el menú al hacer clic fuera
    document.addEventListener('click', function (e) {
        if (!menuNav.contains(e.target)) {
            menuNav.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Cierra el menú al seleccionar una opción
    menuList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuNav.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu-list');
    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            menu.classList.toggle('open');
            // Opcional: cambia el icono o aria-expanded
            toggle.setAttribute('aria-expanded', menu.classList.contains('open'));
        });
    }
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if (target) {
            e.preventDefault();
            smoother.scrollTo(target, true, "top top");
            // Opcional: actualiza el hash en la URL
            history.replaceState(null, null, '#' + targetId);
        }
    });
});
