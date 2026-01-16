// ==================== WHY NODO SECTION - GSAP ANIMATIONS ====================

function initWhyNodoAnimations() {
    console.log('🎨 Iniciando animaciones Why Nodo...');

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('❌ GSAP/ScrollTrigger no disponible');
        return;
    }

    // ========== ANIMACIÓN DE ENTRADA ==========
    
    // Header (Badge, Título, Subtítulo)
    gsap.from(".why-nodo-badge", {
        opacity: 0,
        y: 30,
        scale: 0.8,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
            trigger: ".why-nodo-section",
            start: "top 70%",
            once: true
        }
    });

    gsap.from(".why-nodo-title", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".why-nodo-section",
            start: "top 70%",
            once: true
        }
    }, "-=0.6");

    gsap.from(".why-nodo-subtitle", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".why-nodo-section",
            start: "top 70%",
            once: true
        }
    }, "-=0.7");

    // ========== CARDS - ANIMACIÓN EN CASCADA ==========
    
    const cards = document.querySelectorAll(".why-nodo-card");
    const isMobile = window.innerWidth <= 768;
    
    cards.forEach((card, index) => {
        // Animación de entrada
        gsap.from(card, {
            opacity: 0,
            y: 60,
            rotationX: -15,
            scale: 0.9,
            duration: 0.8,
            ease: "back.out(1.4)",
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                once: true
            },
            delay: index * 0.15
        });

        // Animación del número
        const cardNumber = card.querySelector('.card-number');
        if (cardNumber) {
            gsap.from(cardNumber, {
                opacity: 0,
                scale: 0,
                rotation: -180,
                duration: 1,
                ease: "elastic.out(1, 0.5)",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    once: true
                },
                delay: index * 0.15 + 0.3
            });
        }

        // Animación del icono
        const icon = card.querySelector('.card-icon');
        if (icon) {
            gsap.from(icon, {
                opacity: 0,
                scale: 0,
                rotation: 360,
                duration: 0.8,
                ease: "back.out(2)",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    once: true
                },
                delay: index * 0.15 + 0.2
            });
        }

        // Animación de los tags
        const tags = card.querySelectorAll('.tag');
        if (tags.length > 0) {
            gsap.from(tags, {
                opacity: 0,
                x: -20,
                stagger: 0.1,
                duration: 0.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    once: true
                },
                delay: index * 0.15 + 0.5
            });
        }

        // ========== ANIMACIÓN HOVER EN SCROLL (MÓVIL) ==========
        if (isMobile) {
            ScrollTrigger.create({
                trigger: card,
                start: "top 60%",
                end: "bottom 40%",
                onEnter: () => {
                    // Simular hover al entrar
                    gsap.to(card, {
                        y: -12,
                        scale: 1.02,
                        boxShadow: "0 25px 70px rgba(78, 83, 190, 0.2), 0 10px 30px rgba(78, 83, 190, 0.15)",
                        borderColor: "#c7d2fe",
                        duration: 0.5,
                        ease: "power2.out"
                    });

                    if (icon) {
                        gsap.to(icon, {
                            scale: 1.15,
                            rotation: 8,
                            duration: 0.5,
                            ease: "back.out(1.7)"
                        });
                    }

                    if (cardNumber) {
                        gsap.to(cardNumber, {
                            scale: 1.3,
                            opacity: 0.15,
                            duration: 0.5,
                            ease: "power2.out"
                        });
                    }
                },
                onLeave: () => {
                    // Volver a normal al salir
                    gsap.to(card, {
                        y: 0,
                        scale: 1,
                        boxShadow: "0 0 0 rgba(78, 83, 190, 0)",
                        borderColor: "#e2e8f0",
                        duration: 0.4,
                        ease: "power2.inOut"
                    });

                    if (icon) {
                        gsap.to(icon, {
                            scale: 1,
                            rotation: 0,
                            duration: 0.4,
                            ease: "power2.out"
                        });
                    }

                    if (cardNumber) {
                        gsap.to(cardNumber, {
                            scale: 1,
                            opacity: 1,
                            duration: 0.4,
                            ease: "power2.out"
                        });
                    }
                },
                onEnterBack: () => {
                    // Simular hover al volver a entrar desde abajo
                    gsap.to(card, {
                        y: -12,
                        scale: 1.02,
                        boxShadow: "0 25px 70px rgba(78, 83, 190, 0.2), 0 10px 30px rgba(78, 83, 190, 0.15)",
                        borderColor: "#c7d2fe",
                        duration: 0.5,
                        ease: "power2.out"
                    });

                    if (icon) {
                        gsap.to(icon, {
                            scale: 1.15,
                            rotation: 8,
                            duration: 0.5,
                            ease: "back.out(1.7)"
                        });
                    }

                    if (cardNumber) {
                        gsap.to(cardNumber, {
                            scale: 1.3,
                            opacity: 0.15,
                            duration: 0.5,
                            ease: "power2.out"
                        });
                    }
                },
                onLeaveBack: () => {
                    // Volver a normal al salir por arriba
                    gsap.to(card, {
                        y: 0,
                        scale: 1,
                        boxShadow: "0 0 0 rgba(78, 83, 190, 0)",
                        borderColor: "#e2e8f0",
                        duration: 0.4,
                        ease: "power2.inOut"
                    });

                    if (icon) {
                        gsap.to(icon, {
                            scale: 1,
                            rotation: 0,
                            duration: 0.4,
                            ease: "power2.out"
                        });
                    }

                    if (cardNumber) {
                        gsap.to(cardNumber, {
                            scale: 1,
                            opacity: 1,
                            duration: 0.4,
                            ease: "power2.out"
                        });
                    }
                }
            });

            // Animar el borde superior también en móvil
            ScrollTrigger.create({
                trigger: card,
                start: "top 60%",
                end: "bottom 40%",
                onEnter: () => {
                    gsap.to(card, {
                        "--border-scale": 1,
                        duration: 0.6,
                        ease: "power2.out"
                    });
                },
                onLeave: () => {
                    gsap.to(card, {
                        "--border-scale": 0,
                        duration: 0.4
                    });
                },
                onEnterBack: () => {
                    gsap.to(card, {
                        "--border-scale": 1,
                        duration: 0.6,
                        ease: "power2.out"
                    });
                },
                onLeaveBack: () => {
                    gsap.to(card, {
                        "--border-scale": 0,
                        duration: 0.4
                    });
                }
            });
        }
    });

    // ========== STATS - ANIMACIÓN ESPECIAL ==========
    
    gsap.from(".why-nodo-stats", {
        opacity: 0,
        y: 50,
        scale: 0.95,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".why-nodo-stats",
            start: "top 85%",
            once: true
        }
    });

    // Animación individual de cada stat
    const statItems = document.querySelectorAll(".stat-item");
    statItems.forEach((stat, index) => {
        const icon = stat.querySelector('.stat-icon');
        const number = stat.querySelector('.stat-number');
        const label = stat.querySelector('.stat-label');

        if (icon) {
            gsap.from(icon, {
                opacity: 0,
                scale: 0,
                rotation: 180,
                duration: 0.8,
                ease: "back.out(2)",
                scrollTrigger: {
                    trigger: ".why-nodo-stats",
                    start: "top 85%",
                    once: true
                },
                delay: index * 0.2
            });
        }

        if (number) {
            gsap.from(number, {
                opacity: 0,
                y: 30,
                scale: 0.5,
                duration: 0.8,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: ".why-nodo-stats",
                    start: "top 85%",
                    once: true
                },
                delay: index * 0.2 + 0.2
            });
        }

        if (label) {
            gsap.from(label, {
                opacity: 0,
                y: 20,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".why-nodo-stats",
                    start: "top 85%",
                    once: true
                },
                delay: index * 0.2 + 0.4
            });
        }
    });

    // ========== ANIMACIONES CONTINUAS ==========
    
    // Flotación suave de iconos
    document.querySelectorAll('.card-icon').forEach((icon, i) => {
        gsap.to(icon, {
            y: "random(-8, 8)",
            duration: "random(2.5, 3.5)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.2
        });
    });

    // Rotación del ícono del badge
    gsap.to('.badge-icon', {
        rotation: 360,
        duration: 10,
        repeat: -1,
        ease: "none"
    });

    // Animación de los stat icons
    document.querySelectorAll('.stat-icon').forEach((icon, i) => {
        gsap.to(icon, {
            y: -10,
            duration: 2 + i * 0.3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.3
        });
    });

    // ========== PARALLAX SUAVE ==========
    
    gsap.to(".floating-orb", {
        y: -100,
        scrollTrigger: {
            trigger: ".why-nodo-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5
        }
    });

    // Parallax en las cards
    cards.forEach((card, index) => {
        gsap.to(card, {
            y: -20 - (index % 2) * 10,
            scrollTrigger: {
                trigger: ".why-nodo-section",
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });
    });

    // ========== HOVER INTERACTIVO ==========
    
    cards.forEach(card => {
        const cardIcon = card.querySelector('.card-icon');
        const cardNumber = card.querySelector('.card-number');

        card.addEventListener('mouseenter', () => {
            gsap.to(cardIcon, {
                scale: 1.15,
                rotation: 8,
                duration: 0.4,
                ease: "back.out(1.7)"
            });

            if (cardNumber) {
                gsap.to(cardNumber, {
                    scale: 1.3,
                    opacity: 0.15,
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(cardIcon, {
                scale: 1,
                rotation: 0,
                duration: 0.4,
                ease: "power2.out"
            });

            if (cardNumber) {
                gsap.to(cardNumber, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
        });
    });

    console.log('✅ Animaciones Why Nodo iniciadas');
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhyNodoAnimations);
} else {
    // DOM ya está listo
    initWhyNodoAnimations();
}
