/* BetterWLPRS boot — loader waits for priority videos, then smooth play */
(function () {
    const MAX_WAIT = 10000;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function hideLoader() {
        const loader = document.getElementById('pageLoader');
        if (!loader || loader.classList.contains('is-done')) return;
        loader.classList.add('is-done');
        document.documentElement.classList.add('is-ready');
        document.body.style.overflow = '';
        setTimeout(() => loader.remove(), 480);
    }

    function whenCanPlay(video, timeoutMs) {
        return new Promise((resolve) => {
            let done = false;
            const finish = () => {
                if (done) return;
                done = true;
                resolve(video);
            };
            if (video.readyState >= 3) {
                finish();
                return;
            }
            const onReady = () => finish();
            video.addEventListener('canplaythrough', onReady, { once: true });
            video.addEventListener('canplay', onReady, { once: true });
            video.addEventListener('loadeddata', onReady, { once: true });
            video.addEventListener('error', finish, { once: true });
            setTimeout(finish, timeoutMs);
        });
    }

    function warmVideo(video) {
        if (video.dataset.warmed) return;
        video.dataset.warmed = '1';
        video.preload = 'auto';
        video.setAttribute('playsinline', '');
        bindReveal(video);
        try {
            video.load();
        } catch (_) { /* ignore */ }
        if (video.readyState >= 2) revealVideo(video);
    }

    async function startLoader() {
        const loader = document.getElementById('pageLoader');
        if (!loader) {
            document.documentElement.classList.add('is-ready');
            return;
        }
        document.body.style.overflow = 'hidden';

        const fonts = document.fonts ? document.fonts.ready.catch(() => {}) : Promise.resolve();
        const priority = [...document.querySelectorAll('video[data-boot="1"]')];
        priority.forEach(warmVideo);

        const videosReady = Promise.all(
            priority.map((video) => whenCanPlay(video, 4000))
        );

        await Promise.race([
            Promise.all([fonts, videosReady]),
            new Promise((resolve) => setTimeout(resolve, 4500)),
        ]);

        priority.forEach((video) => {
            if (video.dataset.userUnmuted !== '1') video.muted = true;
            if (!reduceMotion) video.play().catch(() => {});
            revealVideo(video);
        });

        hideLoader();
    }

    function fadeIn(el) {
        el.style.transition = 'opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
        // A poster is already on screen. Fading from 0 would hide it for a frame.
        if (reduceMotion || (el.tagName === 'VIDEO' && el.getAttribute('poster'))) {
            el.style.opacity = '1';
            return;
        }
        if (window.gsap) {
            window.gsap.fromTo(el, { opacity: 0 }, {
                opacity: 1,
                duration: 0.55,
                ease: 'power2.out',
                overwrite: true,
            });
            return;
        }
        requestAnimationFrame(() => { el.style.opacity = '1'; });
    }

    function revealVideo(video) {
        if (video.dataset.revealed) return;
        if (video.readyState < 2) return;
        video.dataset.revealed = '1';
        video.classList.add('is-ready');
        video.classList.remove('is-pending');
        const shell = video.closest('.slider-item, .card-image, .setup-card, .media-shell') || video.parentElement;
        if (shell) shell.classList.add('has-frame');
        fadeIn(video);
    }

    function sameUrl(a, b) {
        if (!a || !b) return false;
        try {
            return new URL(a, location.href).href === new URL(b, location.href).href;
        } catch (e) {
            return a === b;
        }
    }

    function bindMasterFallback(video) {
        if (video.dataset.fallbackBound) return;
        video.dataset.fallbackBound = '1';
        video.addEventListener('error', () => {
            const master = video.dataset.master;
            if (!master || video.dataset.fellback === '1') return;
            if (video.currentSrc && sameUrl(video.currentSrc, master)) return;
            video.dataset.fellback = '1';
            video.querySelectorAll('source').forEach((source) => source.remove());
            video.src = master;
            try { video.load(); } catch (e) { /* ignore */ }
            if (video.dataset.wantPlay === '1' && !reduceMotion) {
                video.play().catch(() => {});
            }
        });
    }

    function bindReveal(video) {
        if (video.dataset.revealBound) return;
        video.dataset.revealBound = '1';
        bindMasterFallback(video);
        const onFrame = () => revealVideo(video);
        video.addEventListener('loadeddata', onFrame);
        video.addEventListener('playing', onFrame);
        video.addEventListener('canplay', onFrame);
        video.addEventListener('canplaythrough', onFrame);
    }

    function playVisible(video) {
        if (reduceMotion) {
            revealVideo(video);
            return;
        }
        warmVideo(video);
        video.dataset.wantPlay = '1';
        // Keep user unmute on the live VideoWLPRS card
        if (video.dataset.userUnmuted !== '1') video.muted = true;
        const play = () => {
            video.play().then(() => revealVideo(video)).catch(() => {});
        };
        if (video.readyState >= 2) play();
        else video.addEventListener('canplay', play, { once: true });
    }

    function lazyVideos() {
        const skip = (video) => video.closest('#previewModal, .gallery-modal, .collection-preview')
            || (video.hasAttribute('data-src') && !video.getAttribute('src') && !video.currentSrc);

        const watch = (video) => {
            if (video.dataset.lazyBound) return;
            if (skip(video)) return;
            video.dataset.lazyBound = '1';
            video.autoplay = false;
            if (video.dataset.userUnmuted !== '1') video.muted = true;
            video.setAttribute('playsinline', '');
            if (!video.classList.contains('is-ready')) video.classList.add('is-pending');
            const shell = video.closest('.slider-item, .card-image, .setup-card') || video.parentElement;
            if (shell && !shell.classList.contains('media-shell')) shell.classList.add('media-shell');
            bindReveal(video);

            if (video.getAttribute('data-boot') === '1') {
                playVisible(video);
                return;
            }

            if (!('IntersectionObserver' in window)) {
                playVisible(video);
                return;
            }
            observer.observe(video);
        };

        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll('video').forEach(watch);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    playVisible(video);
                } else if (
                    video.dataset.revealed
                    && video.getAttribute('data-boot') !== '1'
                    && video.getAttribute('data-boot') !== 'warm'
                    && !video.closest('.infinite-slider')
                ) {
                    // Never pause carousel clips — the strip is always moving
                    video.pause();
                }
            });
        }, { rootMargin: '320px 280px', threshold: 0.01 });

        document.querySelectorAll('video').forEach(watch);
        const mo = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeName === 'VIDEO') watch(node);
                    else if (node.querySelectorAll) node.querySelectorAll('video').forEach(watch);
                });
            });
        });
        mo.observe(document.body, { childList: true, subtree: true });
    }

    function bindAudioToggle() {
        const video = document.getElementById('videoWLPRS');
        const btn = document.getElementById('toggleAudioBtn');
        const icon = document.getElementById('audioIcon');
        if (!video || !btn) return;
        btn.addEventListener('click', () => {
            if (video.muted || video.dataset.userUnmuted !== '1') {
                video.muted = false;
                video.dataset.userUnmuted = '1';
                video.play().catch(() => {});
                if (icon) icon.textContent = '🔊';
                btn.style.borderColor = 'rgba(143, 109, 251, 0.9)';
                btn.style.boxShadow = '0 4px 12px rgba(143, 109, 251, 0.5)';
            } else {
                video.muted = true;
                video.dataset.userUnmuted = '0';
                if (icon) icon.textContent = '🔇';
                btn.style.borderColor = 'rgba(255, 255, 255, 0.9)';
                btn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            }
        });
    }

    function deferSpline() {
        const slot = document.getElementById('splineSlot');
        if (!slot || slot.querySelector('spline-viewer')) return;
    }

    function pageHops() {
        document.querySelectorAll('a[href$="galeria.html"], a[href$="index.html"], a[href="terms.html"], a[href="privacy.html"]').forEach((link) => {
            link.addEventListener('click', (event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                const href = link.getAttribute('href');
                if (!href || href.startsWith('mailto:')) return;
                event.preventDefault();
                document.documentElement.classList.add('is-leaving');
                setTimeout(() => { window.location.href = href; }, 180);
            });
        });
        const gallery = document.createElement('link');
        gallery.rel = 'prefetch';
        gallery.href = 'galeria.html';
        document.head.appendChild(gallery);
    }

    function bindStills() {
        document.querySelectorAll('img.media-fade').forEach((img) => {
            const reveal = () => {
                if (img.naturalWidth) img.classList.add('is-ready');
            };
            const fail = () => {
                const master = img.dataset.master;
                if (master && img.dataset.fellback !== '1') {
                    img.dataset.fellback = '1';
                    const picture = img.closest('picture');
                    if (picture) picture.querySelectorAll('source').forEach((source) => source.remove());
                    img.removeAttribute('srcset');
                    img.removeAttribute('sizes');
                    img.src = master;
                    return;
                }
                img.classList.add('is-ready');
            };
            img.addEventListener('load', reveal);
            img.addEventListener('error', fail);
            if (img.complete) {
                if (img.naturalWidth) reveal();
                else fail();
            }
        });
    }

    function boot() {
        document.documentElement.classList.add('js');
        bindStills();
        lazyVideos();
        bindAudioToggle();
        deferSpline();
        pageHops();
        startLoader();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
}());
