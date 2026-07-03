// ==================== MADE IN NODO — scroll narrative + demo ====================

function initMadeInNodo() {
    const section = document.querySelector('.nodo-made-section');
    if (!section || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const story = section.querySelector('.made-in-nodo__story');
    const pinTarget = section.querySelector('.made-in-nodo__story-pin');
    const steps = section.querySelectorAll('.made-in-step');
    const scenes = section.querySelectorAll('.made-in-demo__scene');
    const eventRows = section.querySelectorAll('[data-event-row]');
    const designSwatches = section.querySelectorAll('.made-in-design__swatch');
    const barcelonaReveal = section.querySelector('#made-in-barcelona-reveal');
    const barcelonaCaption = section.querySelector('#made-in-barcelona-caption');

    let activeIndex = -1;

    function updateBarcelonaReveal(amount) {
        if (!barcelonaReveal) return;
        const t = Math.max(0, Math.min(1, amount));
        const inset = 100 - t * 100;
        barcelonaReveal.style.clipPath = `inset(${inset}% 0 0 0)`;
        barcelonaCaption?.classList.toggle('is-visible', t > 0.35);
    }

    function setActive(index) {
        if (index === activeIndex) return;
        activeIndex = index;

        steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
        scenes.forEach((scene, i) => scene.classList.toggle('is-active', i === index));

        if (index === 2) {
            gsap.fromTo(eventRows, { x: -12, opacity: 0 }, {
                x: 0,
                opacity: 1,
                duration: 0.35,
                stagger: 0.06,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        }

        if (index === 3 && designSwatches.length) {
            gsap.fromTo(designSwatches, { scale: 0.6, opacity: 0 }, {
                scale: 1,
                opacity: 1,
                duration: 0.4,
                stagger: 0.08,
                ease: 'back.out(2)',
                overwrite: 'auto'
            });
        }
    }

    function handleStoryProgress(progress) {
        const scaled = progress * steps.length;
        const idx = Math.min(steps.length - 1, Math.floor(scaled));
        const within = scaled - idx;

        setActive(idx);

        if (idx === 0) updateBarcelonaReveal(within);
        else if (barcelonaCaption) barcelonaCaption.classList.remove('is-visible');
    }

    gsap.from(section.querySelector('.made-in-nodo__intro'), {
        opacity: 0,
        y: 36,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            once: true
        }
    });

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.matchMedia('(min-width: 960px)').matches;

    if (isDesktop && !prefersReduced && story && pinTarget && steps.length) {
        ScrollTrigger.create({
            trigger: story,
            start: 'top top',
            end: () => `+=${steps.length * (window.innerHeight * 0.72)}`,
            pin: pinTarget,
            scrub: 0.45,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => handleStoryProgress(self.progress)
        });

        ScrollTrigger.addEventListener('refreshInit', () => {
            if (pinTarget) {
                pinTarget.style.width = `${pinTarget.parentElement?.offsetWidth || pinTarget.offsetWidth}px`;
            }
        });
    } else {
        steps.forEach((step, index) => {
            ScrollTrigger.create({
                trigger: step,
                start: 'top 65%',
                end: 'bottom 35%',
                onEnter: () => {
                    setActive(index);
                    if (index === 0) updateBarcelonaReveal(1);
                },
                onEnterBack: () => {
                    setActive(index);
                    if (index === 0) updateBarcelonaReveal(1);
                }
            });
        });

        if (barcelonaReveal) {
            ScrollTrigger.create({
                trigger: barcelonaReveal,
                start: 'top 85%',
                end: 'top 40%',
                scrub: 0.6,
                onUpdate: (self) => updateBarcelonaReveal(self.progress)
            });
        }
    }

    section.querySelectorAll('.made-in-sector').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 28,
            duration: 0.55,
            delay: i * 0.08,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 92%',
                once: true
            }
        });
    });

    const prism = section.querySelector('.made-in-prism');
    if (prism && !prefersReduced) {
        gsap.to(prism, {
            rotationY: 360,
            rotationX: 12,
            duration: 18,
            repeat: -1,
            ease: 'none'
        });
    }

    setActive(0);
    updateBarcelonaReveal(0);
    ScrollTrigger.refresh();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMadeInNodo);
} else {
    initMadeInNodo();
}
