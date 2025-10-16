// 🎯 FEATURES SECTION - PROFESSIONAL REVEAL ANIMATION
// Scroll-triggered reveal with staggered animations

export function setupFeaturesReveal() {
    const featuresCards = document.querySelectorAll('.features-card');
    const featuresSection = document.getElementById('features');

    if (!featuresCards.length || !featuresSection) return;

    // Create timeline for the entire section
    const tl = window.gsap.timeline({
        scrollTrigger: {
            trigger: featuresSection,
            start: 'top center',
            end: 'bottom center',
            scrub: 0.5,
            markers: false,
            onEnter: () => {
                // Trigger animations when entering
                animateFeaturesIn();
            }
        }
    });

    function animateFeaturesIn() {
        const cardTimeline = window.gsap.timeline();

        featuresCards.forEach((card, index) => {
            const isMiddleCard = index === 1;
            const startY = isMiddleCard ? 100 : (index === 0 ? 50 : 50);

            cardTimeline.fromTo(
                card,
                {
                    y: startY,
                    opacity: 0,
                    scale: 0.95,
                    rotationY: -10
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    rotationY: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                },
                index * 0.15 // Stagger
            );

            // Animate icon on hover
            card.addEventListener('mouseenter', () => {
                window.gsap.to(card.querySelector('.w-20'), {
                    scale: 1.15,
                    rotationZ: 5,
                    duration: 0.4,
                    ease: 'back.out(1.7)'
                });
            });

            card.addEventListener('mouseleave', () => {
                window.gsap.to(card.querySelector('.w-20'), {
                    scale: 1,
                    rotationZ: 0,
                    duration: 0.4,
                    ease: 'back.out(1.7)'
                });
            });
        });

        return cardTimeline;
    }
}

// Counter animation for metrics (if added)
export function animateFeatureCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const duration = 2;

        window.gsap.from(counter, {
            textContent: 0,
            duration,
            snap: { textContent: 1 },
            onUpdate: function() {
                counter.textContent = Math.ceil(this.targets()[0].textContent) + '%';
            },
            scrollTrigger: {
                trigger: counter,
                start: 'top 80%',
                once: true
            }
        });
    });
}
