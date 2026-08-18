// ==================== GSAP HERO ANIMATIONS ====================

let heroInitialized = false;
let morphSplit = null;
let splineScrollInitialized = false;

function bootHeroAnimations() {
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        if (typeof SplitText !== 'undefined') {
            try { gsap.registerPlugin(SplitText); } catch (e) { /* SplitText opcional */ }
        }
    }

    function startAfterLoader() {
        if (heroInitialized) return;
        heroInitialized = true;
        initHeroAnimations();
        initStatsCounters();
    }

    document.addEventListener('nodo:loader:done', startAfterLoader, { once: true });

    const loader = document.getElementById('loader-nodo');
    const loaderDone = !loader
        || loader.style.display === 'none'
        || loader.getAttribute('aria-hidden') === 'true';

    if (loaderDone) {
        startAfterLoader();
    } else {
        setTimeout(startAfterLoader, 6000);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootHeroAnimations);
} else {
    bootHeroAnimations();
}

function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;

    document.body.classList.add('hero-animating');

    gsap.set(['.author', '.hero h1', '.hero-lead', '.hero-buttons', '.hero-microcopy', '.users-count'], {
        visibility: 'visible'
    });
    gsap.set('.author', { opacity: 0, y: 20, scale: 0.94 });
    gsap.set('.hero h1', { opacity: 0, y: 36 });
    gsap.set('.hero-lead', { opacity: 0, y: 24, filter: 'blur(8px)' });
    gsap.set('.hero-buttons .btn', { opacity: 0, y: 16, scale: 0.96 });
    gsap.set('.hero-microcopy', { opacity: 0, y: 12 });
    gsap.set('.users-count', { opacity: 0, y: 24, pointerEvents: 'none' });
    gsap.set('.highlight', { backgroundSize: '0% 0.58em' });

    gsap.set('#spline-shell', { opacity: 0, y: 20, scale: 0.97, filter: 'blur(4px)' });

    const masterTimeline = gsap.timeline({
        defaults: { ease: 'expo.out', force3D: true },
        onComplete: () => {
            document.body.classList.add('hero-ready');
            initContinuousAnimations();
            initHeroMorphWord();
        }
    });

    masterTimeline
        .to('.author', { opacity: 1, y: 0, scale: 1, duration: 0.65 })
        .to('.hero h1', { opacity: 1, y: 0, duration: 0.55 }, '-=0.4')
        .to('.highlight', { backgroundSize: '100% 0.58em', duration: 0.65, ease: 'expo.inOut' }, '-=0.35')
        .to('.hero-lead', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7 }, '-=0.4')
        .to('.hero-buttons .btn', { opacity: 1, y: 0, scale: 1, stagger: 0.06, duration: 0.45 }, '-=0.45')
        .add(() => revealSplineHero(), '-=0.3')
        .to('.hero-microcopy', { opacity: 1, y: 0, duration: 0.45 }, '-=0.3');

    const avatars = document.querySelectorAll('.users-avatars img');
    if (avatars.length) {
        gsap.set(avatars, { scale: 0, opacity: 0 });
        masterTimeline
            .to('.users-count', { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.45 }, '-=0.25')
            .to(avatars, { scale: 1, opacity: 1, stagger: 0.03, duration: 0.4, ease: 'back.out(2)' }, '-=0.3');
    }

    const counterElement = document.querySelector('.users-count .count');
    if (counterElement) {
        masterTimeline.to(counterElement, {
            textContent: 2141,
            duration: 0.85,
            ease: 'power2.out',
            snap: { textContent: 1 },
            onUpdate: function () {
                const value = Math.ceil(parseFloat(this.targets()[0].textContent));
                counterElement.textContent = value.toLocaleString('es-ES');
            },
            onComplete: () => {
                counterElement.textContent = '2.141';
            }
        }, '-=0.15');
    }
}

function initHeroMorphWord() {
    const el = document.getElementById('hero-brand-morph');
    if (!el || typeof gsap === 'undefined') return;

    const words = ['Nodo', 'Conecta'];
    let index = 0;
    let busy = false;

    if (typeof SplitText === 'undefined') {
        setInterval(() => {
            index = (index + 1) % words.length;
            el.textContent = words[index];
        }, 3400);
        return;
    }

    function splitChars() {
        morphSplit?.revert();
        morphSplit = new SplitText(el, { type: 'chars' });
        gsap.set(morphSplit.chars, { display: 'inline-block', transformOrigin: '50% 100%' });
        return morphSplit.chars;
    }

    splitChars();

    function morphNext() {
        if (busy) return;
        busy = true;
        const nextIndex = (index + 1) % words.length;
        const nextWord = words[nextIndex];
        const outChars = morphSplit?.chars || [];

        gsap.to(outChars, {
            yPercent: -110,
            opacity: 0,
            rotationX: -72,
            filter: 'blur(3px)',
            duration: 0.34,
            stagger: 0.028,
            ease: 'power2.in',
            onComplete: () => {
                morphSplit?.revert();
                el.textContent = nextWord;
                const inChars = splitChars();
                gsap.fromTo(
                    inChars,
                    { yPercent: 90, opacity: 0, rotationX: 64, filter: 'blur(3px)' },
                    {
                        yPercent: 0,
                        opacity: 1,
                        rotationX: 0,
                        filter: 'blur(0px)',
                        duration: 0.42,
                        stagger: 0.032,
                        ease: 'back.out(2)',
                        onComplete: () => {
                            index = nextIndex;
                            busy = false;
                        }
                    }
                );
            }
        });
    }

    gsap.delayedCall(1.8, () => {
        morphNext();
        setInterval(morphNext, 3600);
    });
}

function revealSplineHero() {
    const shell = document.getElementById('spline-shell');
    if (!shell || shell.dataset.revealed === 'true') return;

    const finishReveal = () => {
        if (shell.dataset.revealed === 'true') return;
        shell.dataset.revealed = 'true';
        shell.classList.remove('loading');
        shell.classList.add('spline-visible');
        const viewer = shell.querySelector('spline-viewer');
        gsap.to(shell, {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.55,
            ease: 'power2.out',
            onComplete: () => {
                initSplineScroll();
                if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
            }
        });
        if (viewer) gsap.to(viewer, { opacity: 1, duration: 0.45, ease: 'power2.out', delay: 0.08 });
    };

    if (window.__nodoSplineReady) {
        finishReveal();
        return;
    }

    const viewer = document.getElementById('hero-spline');
    if (viewer) {
        viewer.addEventListener('load', finishReveal, { once: true });
        viewer.addEventListener('error', finishReveal, { once: true });
    }
    setTimeout(finishReveal, 800);
}

function initSplineScroll() {
    const shell = document.getElementById('spline-shell');
    if (!shell || splineScrollInitialized || typeof ScrollTrigger === 'undefined') return;
    splineScrollInitialized = true;

    gsap.set(shell, { opacity: 1, y: 0, clearProps: 'filter' });

    // Parallax suave mientras el 3D está en viewport — sin tocar opacity
    gsap.fromTo(
        shell,
        { y: 0 },
        {
            y: -56,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: {
                id: 'spline-parallax',
                trigger: shell,
                start: 'top 88%',
                end: 'bottom 12%',
                scrub: 1.1,
                invalidateOnRefresh: true
            }
        }
    );

    // Fundido solo al entrar la sección siguiente (no mientras lees el hero)
    const nextSection = document.getElementById('before-after');
    if (nextSection) {
        gsap.fromTo(
            shell,
            { opacity: 1 },
            {
                opacity: 0,
                ease: 'none',
                immediateRender: false,
                scrollTrigger: {
                    id: 'spline-exit',
                    trigger: nextSection,
                    start: 'top 92%',
                    end: 'top 38%',
                    scrub: 0.85,
                    invalidateOnRefresh: true,
                    onLeaveBack: () => gsap.set(shell, { opacity: 1 })
                }
            }
        );
    }
}

function initContinuousAnimations() {
    const buttons = document.querySelectorAll('.hero-buttons .btn');
    buttons.forEach((btn) => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, { scale: 1.06, y: -2, duration: 0.28, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { scale: 1, y: 0, duration: 0.28 });
        });
    });

    const avatars = document.querySelectorAll('.users-avatars img');
    avatars.forEach((avatar) => {
        avatar.addEventListener('mouseenter', () => {
            gsap.to(avatar, { scale: 1.15, y: -8, duration: 0.28, ease: 'back.out(2)' });
        });
        avatar.addEventListener('mouseleave', () => {
            gsap.to(avatar, { scale: 1, y: 0, duration: 0.28 });
        });
    });

    gsap.to('.hero h1', {
        y: 70,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
            invalidateOnRefresh: true
        }
    });

    gsap.to('.hero-lead', {
        y: 45,
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
            invalidateOnRefresh: true
        }
    });
}

function initStatsCounters() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const servicesCounter = document.getElementById('services-counter');
    if (servicesCounter && !servicesCounter.dataset.animated) {
        servicesCounter.dataset.animated = '1';
        gsap.from(servicesCounter, {
            textContent: 0,
            duration: 2,
            ease: 'power1.out',
            snap: { textContent: 1 },
            scrollTrigger: {
                trigger: '.nodo-stats-section',
                start: 'top 80%',
                once: true
            },
            onUpdate: function () {
                servicesCounter.textContent = '+' + Math.ceil(this.targets()[0].textContent);
            }
        });
    }

    const retentionCounter = document.getElementById('retention-counter');
    if (retentionCounter && !retentionCounter.dataset.animated) {
        retentionCounter.dataset.animated = '1';
        gsap.from(retentionCounter, {
            textContent: 0,
            duration: 2,
            ease: 'power1.out',
            snap: { textContent: 1 },
            scrollTrigger: {
                trigger: '.nodo-stats-section',
                start: 'top 80%',
                once: true
            },
            onUpdate: function () {
                retentionCounter.textContent = Math.ceil(this.targets()[0].textContent) + '%';
            }
        });
    }
}
