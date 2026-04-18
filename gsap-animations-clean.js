// ==================== GSAP HERO ANIMATIONS - VERSIÓN PROFESIONAL ====================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 Preparando hero para animaciones...');
    
    // Ocultar elementos INMEDIATAMENTE (antes de que se vean)
    gsap.set([".author", ".hero h1", ".hero-lead", ".hero-buttons .btn", ".hero-microcopy"], {
        opacity: 0,
        y: 30
    });
    
    // El contador debe estar invisible pero sin opacity total para evitar parpadeos
    gsap.set(".users-count", {
        opacity: 0,
        y: 30,
        pointerEvents: "none"  // Evitar interacciones durante la animación
    });
    
    // Esperar a que el loader desaparezca (4 segundos exactos)
    setTimeout(() => {
        console.log('✨ Loader desapareciendo - Iniciando animaciones');
        initHeroAnimations();
        initStatsCounters();
    }, 4000); // Iniciar exactamente cuando empieza el fade del loader
});

function initHeroAnimations() {
    console.log('✨ initHeroAnimations ejecutándose...');
    
    if (typeof gsap === 'undefined') {
        console.error('❌ GSAP no disponible');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // ========== TIMELINE PRINCIPAL ==========
    const masterTimeline = gsap.timeline({
        defaults: {
            ease: "power3.out",
            duration: 0.8
        },
        onComplete: () => {
            console.log('✅ Timeline completado');
            initContinuousAnimations();
        }
    });

    // 1. LOGO - Entrada con bounce
    masterTimeline.to(".author", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "back.out(1.7)",
        onStart: () => console.log('1️⃣ Logo')
    });

    // 2. TÍTULO - Efecto de palabras en cascada
    const h1Element = document.querySelector(".hero h1");
    if (h1Element) {
        const highlightSpan = h1Element.querySelector('.highlight');
        if (highlightSpan) {
            const text = highlightSpan.textContent;
            highlightSpan.innerHTML = '';
            
            // Dividir en palabras
            const words = text.split(' ');
            words.forEach((word, index) => {
                const wordSpan = document.createElement('span');
                wordSpan.className = 'word-span';
                wordSpan.textContent = word;
                wordSpan.style.display = 'inline-block';
                wordSpan.style.opacity = '0';
                wordSpan.style.marginRight = '0.35em'; // ESPACIO entre palabras
                highlightSpan.appendChild(wordSpan);
            });

            masterTimeline.to(".hero h1", {
                opacity: 1,
                y: 0,
                duration: 0.6,
                onStart: () => console.log('2️⃣ Título container')
            }, "-=0.5");

            masterTimeline.to(".word-span", {
                opacity: 1,
                y: 0,
                rotationX: 0,
                stagger: 0.08,
                duration: 0.6,
                ease: "back.out(1.2)",
                onStart: () => console.log('2️⃣ Palabras animando')
            }, "-=0.4");

            // Animar el subrayado
            masterTimeline.to(".highlight", {
                backgroundSize: "100% 0.58em",
                duration: 0.8,
                ease: "power2.inOut"
            }, "-=0.3");
        }
    }

    // 3. PÁRRAFO
    masterTimeline.to(".hero-lead", {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        ease: "power2.out",
        onStart: () => console.log('3️⃣ Párrafo')
    }, "-=0.4");

    // 4. BOTONES
    masterTimeline.to(".hero-buttons .btn", {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.12,
        duration: 0.7,
        ease: "back.out(1.5)",
        onStart: () => console.log('4️⃣ Botones'),
        onComplete: function() {
            gsap.to(this.targets(), {
                boxShadow: "0 4px 20px rgba(78, 83, 190, 0.2)",
                duration: 0.3
            });
        }
    }, "-=0.3");

    // 5. MICROCOPY
    masterTimeline.to(".hero-microcopy", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        onStart: () => console.log('5️⃣ Microcopy')
    }, "-=0.4");

    // 6. AVATARES
    const avatars = document.querySelectorAll(".users-avatars img");
    console.log(`👥 ${avatars.length} avatares`);
    
    if (avatars.length > 0) {
        gsap.set(avatars, { scale: 0, opacity: 0 });
        
        masterTimeline.to(avatars, {
            scale: 1,
            opacity: 1,
            stagger: 0.05,
            duration: 0.5,
            ease: "back.out(2.5)",
            onStart: () => console.log('6️⃣ Avatares')
        }, "-=0.3");
    }

    // 7. TEXTO DE USUARIOS + CONTADOR
    const counterElement = document.querySelector(".users-count .count");
    console.log('🔢 Counter:', counterElement ? 'SÍ' : 'NO');

    masterTimeline.to(".users-count", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        onStart: () => console.log('7️⃣ Sección usuarios')
    }, "0.2");  // Comienza casi inmediatamente después de que comienza la timeline

    // 8. CONTADOR ANIMADO - Comienza sin delay
    if (counterElement) {
        counterElement.textContent = '0';
        
        masterTimeline.to(counterElement, {
            textContent: 2141,
            duration: 2.0,  // Reducido a 2 segundos para que sea fluido
            ease: "power2.out",
            snap: { textContent: 1 },
            onStart: () => console.log('8️⃣ Contador 0 → 2.141'),
            onUpdate: function() {
                const value = Math.ceil(this.targets()[0].textContent);
                counterElement.textContent = value.toLocaleString('es-ES');
            },
            onComplete: () => console.log(`✅ Contador: ${counterElement.textContent}`)
        }, "0.3");  // Comienza casi inmediatamente junto con la sección de usuarios
    }
}

// ========== ANIMACIONES CONTINUAS ==========
function initContinuousAnimations() {
    console.log('🔄 Animaciones continuas...');

    // GLOW del logo
    gsap.to(".author img", {
        filter: "drop-shadow(0 0 20px rgba(78, 83, 190, 0.5))",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // FLOTACIÓN de avatares
    const avatars = document.querySelectorAll(".users-avatars img");
    avatars.forEach((avatar, i) => {
        gsap.to(avatar, {
            y: `random(-10, 10)`,
            duration: `random(2.5, 3.5)`,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.1
        });
    });

    // HOVER - Botones
    const buttons = document.querySelectorAll(".hero-buttons .btn");
    buttons.forEach(btn => {
        btn.addEventListener("mouseenter", () => {
            gsap.to(btn, {
                scale: 1.08,
                y: -3,
                boxShadow: "0 15px 40px rgba(78, 83, 190, 0.4)",
                duration: 0.3,
                ease: "power2.out"
            });
        });

        btn.addEventListener("mouseleave", () => {
            gsap.to(btn, {
                scale: 1,
                y: 0,
                boxShadow: "0 4px 20px rgba(78, 83, 190, 0.2)",
                duration: 0.3
            });
        });
    });

    // HOVER - Avatares
    avatars.forEach(avatar => {
        avatar.addEventListener("mouseenter", () => {
            gsap.to(avatar, {
                scale: 1.2,
                y: -12,
                rotation: 5,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                duration: 0.3,
                ease: "back.out(1.7)"
            });
        });

        avatar.addEventListener("mouseleave", () => {
            gsap.to(avatar, {
                scale: 1,
                y: 0,
                rotation: 0,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                duration: 0.3
            });
        });
    });

    // PARALLAX
    gsap.to("#spline-shell", {
        y: 150,
        opacity: 0.8,
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.5
        }
    });

    gsap.to(".hero h1", {
        y: 80,
        opacity: 0.3,
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });

    gsap.to(".hero-lead", {
        y: 50,
        opacity: 0.5,
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.2
        }
    });

    // PARTÍCULAS
    createFloatingParticles();
}

// ========== PARTÍCULAS ==========
function createFloatingParticles() {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const particleCount = window.innerWidth < 768 ? 10 : 20;
    console.log(`🫧 ${particleCount} partículas`);

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "floating-particle";
        
        const size = Math.random() * 8 + 4;
        const opacity = Math.random() * 0.15 + 0.05;
        
        Object.assign(particle.style, {
            position: "absolute",
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(78, 83, 190, ${opacity * 1.5}) 0%, rgba(78, 83, 190, ${opacity}) 100%)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            pointerEvents: "none",
            zIndex: "0",
            boxShadow: `0 0 ${size * 2}px rgba(78, 83, 190, ${opacity})`
        });

        hero.appendChild(particle);

        // Flotación
        gsap.to(particle, {
            x: `random(-120, 120)`,
            y: `random(-180, 180)`,
            scale: `random(0.8, 1.4)`,
            duration: `random(10, 18)`,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: Math.random() * 3
        });

        // Fade
        gsap.to(particle, {
            opacity: Math.random() * 0.5 + 0.3,
            duration: `random(4, 7)`,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: Math.random() * 2
        });
    }

    console.log('✅ Partículas creadas');
}

// ========== CONTADORES STATS ==========
function initStatsCounters() {
    console.log('📊 Stats counters...');
    
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        return;
    }

    // Servicios
    const servicesCounter = document.getElementById('services-counter');
    if (servicesCounter) {
        gsap.from(servicesCounter, {
            textContent: 0,
            duration: 2,
            ease: "power1.out",
            snap: { textContent: 1 },
            scrollTrigger: {
                trigger: ".nodo-stats-section",
                start: "top 80%",
                once: true
            },
            onUpdate: function() {
                servicesCounter.textContent = '+' + Math.ceil(this.targets()[0].textContent);
            }
        });
    }

    // Retención
    const retentionCounter = document.getElementById('retention-counter');
    if (retentionCounter) {
        gsap.from(retentionCounter, {
            textContent: 0,
            duration: 2,
            ease: "power1.out",
            snap: { textContent: 1 },
            scrollTrigger: {
                trigger: ".nodo-stats-section",
                start: "top 80%",
                once: true
            },
            onUpdate: function() {
                retentionCounter.textContent = Math.ceil(this.targets()[0].textContent) + '%';
            }
        });
    }
}
