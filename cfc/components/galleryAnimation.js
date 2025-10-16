// 🎬 GALLERY ANIMATION - Professional Visual Experience
// Scroll-triggered reveals, parallax, and interactive effects

export function setupGalleryAnimation() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryHeroItem = document.querySelector('.gallery-hero-item');
    const gallerySection = document.getElementById('gallery');

    if (!gallerySection) return;

    // 🎯 HERO GALLERY ITEM ANIMATION
    if (galleryHeroItem) {
        window.gsap.fromTo(
            galleryHeroItem,
            {
                opacity: 0,
                scale: 0.95,
                y: 50
            },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: galleryHeroItem,
                    start: 'top 80%',
                    once: true
                }
            }
        );

        // Floating parallax effect on scroll
        window.gsap.to(galleryHeroItem, {
            y: -30,
            scrollTrigger: {
                trigger: gallerySection,
                start: 'top center',
                end: 'center center',
                scrub: 1,
                markers: false
            }
        });
    }

    // 🖼️ GALLERY ITEMS STAGGERED REVEAL
    if (galleryItems.length) {
        const tl = window.gsap.timeline({
            scrollTrigger: {
                trigger: gallerySection,
                start: 'top center',
                once: true
            }
        });

        galleryItems.forEach((item, index) => {
            tl.fromTo(
                item,
                {
                    opacity: 0,
                    y: 60,
                    scale: 0.9,
                    rotationX: -20
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotationX: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                },
                index * 0.1
            );

            // Parallax effect on individual items
            window.gsap.to(item, {
                y: index % 2 === 0 ? 20 : -20,
                scrollTrigger: {
                    trigger: item,
                    start: 'top center',
                    end: 'bottom center',
                    scrub: 1,
                    markers: false
                }
            });

            // Interactive hover animation
            item.addEventListener('mouseenter', () => {
                window.gsap.to(item, {
                    boxShadow: '0 30px 60px rgba(196, 18, 48, 0.3)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            item.addEventListener('mouseleave', () => {
                window.gsap.to(item, {
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }

    // 🎬 PLAY BUTTON ANIMATION
    const playBtn = document.querySelector('.gallery-play-btn');
    if (playBtn) {
        // Pulse animation
        window.gsap.to(playBtn, {
            boxShadow: [
                '0 0 0 0 rgba(220, 38, 38, 0.7)',
                '0 0 0 10px rgba(220, 38, 38, 0)'
            ],
            duration: 1.5,
            repeat: -1,
            ease: 'power1.out'
        });

        // Hover scale
        playBtn.addEventListener('mouseenter', () => {
            window.gsap.to(playBtn, {
                scale: 1.2,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });

        playBtn.addEventListener('mouseleave', () => {
            window.gsap.to(playBtn, {
                scale: 1,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });
    }

    // 📱 SECTION REVEAL ANIMATION
    const sectionHeader = document.querySelector('#gallery .text-center');
    if (sectionHeader) {
        window.gsap.fromTo(
            sectionHeader,
            {
                opacity: 0,
                y: 30
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: gallerySection,
                    start: 'top 85%',
                    once: true
                }
            }
        );
    }
}

// Lightbox functionality for gallery
export function setupGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item, .gallery-hero-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const img = this.querySelector('img');
            if (!img) return;

            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'fixed inset-0 bg-black/90 z-50 flex items-center justify-center cursor-pointer backdrop-blur-sm';
            lightbox.innerHTML = `
                <div class="relative max-w-5xl w-full mx-4 animate-in fade-in zoom-in">
                    <img src="${img.src}" alt="${img.alt}" class="w-full h-auto rounded-2xl shadow-2xl">
                    <button class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            `;

            document.body.appendChild(lightbox);

            // Animate in with GSAP
            window.gsap.fromTo(lightbox, {
                opacity: 0
            }, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            });

            // Close on click
            const closeHandler = () => {
                window.gsap.to(lightbox, {
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.in',
                    onComplete: () => lightbox.remove()
                });
            };

            lightbox.addEventListener('click', closeHandler);
            lightbox.querySelector('button').addEventListener('click', closeHandler);

            // Close on Escape
            const escapeHandler = (e) => {
                if (e.key === 'Escape') {
                    closeHandler();
                    document.removeEventListener('keydown', escapeHandler);
                }
            };
            document.addEventListener('keydown', escapeHandler);
        });
    });
}
