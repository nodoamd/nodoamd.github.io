// ==================== GSAP HERO ANIMATIONS - VERSIÓN PROFESIONAL ====================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 Preparando hero para animaciones...');
    
    // Ocultar elementos INMEDIATAMENTE (antes de que se vean)
    gsap.set(".author", { opacity: 0, y: 24, scale: 0.92 });
    gsap.set(".hero h1", { opacity: 0, y: 40 });
    gsap.set(".hero-lead", { opacity: 0, y: 28, filter: "blur(10px)" });
    gsap.set(".hero-buttons .btn", { opacity: 0, y: 20, scale: 0.94 });
    gsap.set(".hero-microcopy", { opacity: 0, y: 16 });
    // Subrayado del highlight empieza en 0
    gsap.set(".highlight", { backgroundSize: "0% 0.58em" });
    
    // El contador debe estar invisible pero sin opacity total para evitar parpadeos
    gsap.set(".users-count", {
        opacity: 0,
        y: 30,
        pointerEvents: "none"
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
            ease: "expo.out",
            force3D: true
        },
        onComplete: () => {
            console.log('✅ Timeline completado');
            initContinuousAnimations();
            // NO se crean partículas — eliminadas por rendimiento
        }
    });

    // 1. LOGO — rápido, sin rebote
    masterTimeline.to(".author", {
        opacity: 1, y: 0, scale: 1,
        duration: 0.7,
        onStart: () => console.log('1️⃣ Logo')
    });

    // 2. TÍTULO — palabras en cascada, arranca antes de que termine el logo
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
                wordSpan.style.marginRight = '0.35em';
                highlightSpan.appendChild(wordSpan);
            });

            // Inicializar palabras invisibles
            gsap.set(".word-span", { opacity: 0, y: 18, rotationX: -30, transformOrigin: "center bottom" });

            masterTimeline.to(".hero h1", {
                opacity: 1, y: 0,
                duration: 0.4,
                onStart: () => console.log('2️⃣ Título')
            }, "-=0.45");

            masterTimeline.to(".word-span", {
                opacity: 1, y: 0, rotationX: 0,
                stagger: 0.045,
                duration: 0.55,
            }, "-=0.3");

            // Subrayado
            masterTimeline.to(".highlight", {
                backgroundSize: "100% 0.58em",
                duration: 0.7,
                ease: "expo.inOut"
            }, "-=0.35");
        }
    }

    // 3. PÁRRAFO — blur reveal
    masterTimeline.to(".hero-lead", {
        opacity: 1, y: 0,
        filter: "blur(0px)",
        duration: 0.75,
        onStart: () => console.log('3️⃣ Párrafo')
    }, "-=0.45");

    // 4. BOTONES — los dos juntos casi a la vez
    masterTimeline.to(".hero-buttons .btn", {
        opacity: 1, y: 0, scale: 1,
        stagger: 0.07,
        duration: 0.6,
        onStart: () => console.log('4️⃣ Botones'),
    }, "-=0.45");

    // 5. MICROCOPY + AVATARES + CONTADOR — todo el bloque social proof llega junto
    masterTimeline.to(".hero-microcopy", {
        opacity: 1, y: 0,
        duration: 0.5,
        onStart: () => console.log('5️⃣ Microcopy')
    }, "-=0.35");

    // 6. AVATARES
    const avatars = document.querySelectorAll(".users-avatars img");
    console.log(`👥 ${avatars.length} avatares`);
    
    if (avatars.length > 0) {
        gsap.set(avatars, { scale: 0, opacity: 0 });
        
        masterTimeline.to(avatars, {
            scale: 1, opacity: 1,
            stagger: 0.03,
            duration: 0.45,
            ease: "back.out(2)",
            onStart: () => console.log('6️⃣ Avatares')
        }, "-=0.3");
    }

    // 7 + 8. USERS COUNT + CONTADOR — llegan muy pegados a los avatares
    const counterElement = document.querySelector(".users-count .count");
    console.log('🔢 Counter:', counterElement ? 'SÍ' : 'NO');

    masterTimeline.to(".users-count", {
        opacity: 1, y: 0,
        pointerEvents: "auto",
        duration: 0.45,
        onStart: () => {
            if (counterElement) counterElement.textContent = '0';
            console.log('7️⃣ Sección usuarios');
        }
    }, "-=0.25");

    if (counterElement) {
        masterTimeline.to(counterElement, {
            textContent: 2141,
            duration: 1.4,
            ease: "power2.out",
            snap: { textContent: 1 },
            onStart: () => console.log('8️⃣ Contador 0 → 2.141'),
            onUpdate: function() {
                const value = Math.ceil(parseFloat(this.targets()[0].textContent));
                counterElement.textContent = value.toLocaleString('es-ES');
            },
            onComplete: () => {
                counterElement.textContent = '2.141';
                console.log('✅ Contador finalizado: 2.141');
            }
        }, "-=0.1");
    }
}

// ========== ANIMACIONES CONTINUAS ==========
function initContinuousAnimations() {
    console.log('🔄 Animaciones continuas...');

    // GLOW del logo — muy sutil, periodo largo para no cargar el hilo principal
    gsap.to(".author img", {
        filter: "drop-shadow(0 0 12px rgba(78, 83, 190, 0.45))",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // FLOTACIÓN de avatares — eliminada (consumía tweens en loop por cada avatar)
    // Se mantiene solo en hover

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
        y: 120,
        opacity: 0.6,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 2,
            invalidateOnRefresh: true
        }
    });

    gsap.to(".hero h1", {
        y: 70,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
            invalidateOnRefresh: true
        }
    });

    gsap.to(".hero-lead", {
        y: 45,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
            invalidateOnRefresh: true
        }
    });

    // PARTÍCULAS eliminadas — afectaban al rendimiento
}

// ========== PARTÍCULAS (desactivadas) ==========
function createFloatingParticles() {
    // Eliminadas: consumían demasiada CPU con muchos tweens en loop
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
