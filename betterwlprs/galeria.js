/* BetterWLPRS gallery — title mosaic first, then the album */
(function () {
    const ITEMS_PER_PAGE = 18;
    const MIN_STANDALONE = 2;
    const FEATURED = [
        'Crimson Desert',
        'Red Dead Redemption 2',
        'The Witcher 3',
        'Skyrim',
        'Watch Dogs 2',
        'Death Stranding',
        'Cyberpunk 2077',
        'Batman Arkham Knight',
        'Spider-Man 2',
        'AC Odyssey',
        'Uncharted 4',
        'Metro Exodus',
        'Disco Elysium',
        'Kingdom Come II',
        'Mad Max',
        'Section 9',
        'Blade Runner 2099',
        'Batman Nolan',
        'A Wind Named Amnesia',
        'Se7en',
        'Soul',
        'Treasure Hunt',
        'Love Death and Robots',
    ];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canGsap = typeof gsap !== 'undefined' && !reduceMotion;

    const state = {
        all: [],
        collections: [],
        page: 0,
        media: 'all',
        type: 'all',
        mood: null,
        search: '',
        collection: null,
        modalIndex: -1,
        playing: null,
        view: 'mosaic',
    };

    const els = {};
    let paging = false;

    function featuredRank(name) {
        if (name === 'Solitaires') return 4000;
        const index = FEATURED.findIndex((title) => title.toLowerCase() === name.toLowerCase());
        return index === -1 ? 1000 : index;
    }

    function sortCollections(list) {
        return list.sort((a, b) => {
            const featured = featuredRank(a.name) - featuredRank(b.name);
            if (featured) return featured;
            if (b.items.length !== a.items.length) return b.items.length - a.items.length;
            return a.name.localeCompare(b.name);
        });
    }

    function buildCollections(items) {
        const grouped = {};
        items.forEach((item) => {
            if (!grouped[item.game]) {
                grouped[item.game] = { name: item.game, media: item.media, items: [] };
            }
            grouped[item.game].items.push(item);
        });
        const standalones = [];
        const extras = { game: [], movie: [] };
        Object.values(grouped).forEach((collection) => {
            const keep = featuredRank(collection.name) < 1000 || collection.items.length >= MIN_STANDALONE;
            if (!keep) {
                extras[collection.media === 'movie' ? 'movie' : 'game'].push(...collection.items);
                return;
            }
            standalones.push(collection);
        });
        if (extras.game.length || extras.movie.length) {
            standalones.push({
                name: 'Solitaires',
                media: 'all',
                leftover: true,
                items: extras.game.concat(extras.movie),
            });
        }
        return sortCollections(standalones);
    }

    function $(id) {
        return document.getElementById(id);
    }

    function isGif(item) {
        return /\.gif(\?|$)/i.test(item.src);
    }

    function isVideo(item) {
        return item.type === 'video' && !isGif(item);
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function sortCatalog(items) {
        return [...items].sort((a, b) => {
            const game = a.game.localeCompare(b.game);
            if (game) return game;
            if (isVideo(a) !== isVideo(b)) return isVideo(a) ? 1 : -1;
            return a.title.localeCompare(b.title);
        });
    }

    function posterFor(item) {
        if (!isVideo(item)) return '';
        const photo = state.all.find((p) => p.game === item.game && p.type === 'image');
        return photo ? photo.src : '';
    }

    function stopPlaying() {
        const video = state.playing;
        if (!video) return;
        video.pause();
        try { video.currentTime = 0; } catch (e) { /* ignore */ }
        video.closest('.gallery-item')?.classList.remove('is-playing');
        state.playing = null;
    }

    function bindTileMedia(itemEl) {
        const video = itemEl.querySelector('video');
        if (!video) return;

        const start = () => {
            if (reduceMotion) return;
            stopPlaying();
            if (!video.getAttribute('src')) video.src = video.dataset.src;
            itemEl.classList.add('is-playing');
            state.playing = video;
            video.play().catch(() => {});
        };

        itemEl.addEventListener('pointerenter', start);
        itemEl.addEventListener('pointerleave', stopPlaying);
        itemEl.addEventListener('focusin', start);
        itemEl.addEventListener('focusout', stopPlaying);
    }

    function itemPasses(item, opts) {
        const ignoreSearch = opts && opts.ignoreSearch;
        if (state.media === 'game' && item.media !== 'game') return false;
        if (state.media === 'movie' && item.media !== 'movie') return false;
        if (state.type === 'video' && item.type !== 'video') return false;
        if (state.type === 'static' && item.type === 'video') return false;
        if (state.mood && !(item.moods || []).includes(state.mood)) return false;
        if (!ignoreSearch && state.search && state.collection) {
            const q = state.search.toLowerCase();
            const hay = (item.title + ' ' + item.game).toLowerCase();
            if (!hay.includes(q)) return false;
        }
        return true;
    }

    function filteredItems() {
        const pool = state.collection ? state.collection.items : state.all;
        return pool.filter((item) => itemPasses(item));
    }

    function visibleCollections() {
        const q = state.search.toLowerCase();
        return state.collections.filter((collection) => {
            if (!collection.leftover) {
                if (state.media === 'game' && collection.media !== 'game') return false;
                if (state.media === 'movie' && collection.media !== 'movie') return false;
            }
            const items = matchingItems(collection);
            if (!items.length) return false;
            if (q) {
                const inName = collection.name.toLowerCase().includes(q);
                const inItems = collection.leftover && items.some((item) => item.game.toLowerCase().includes(q));
                if (!inName && !inItems) return false;
            }
            return true;
        });
    }

    function matchingItems(collection) {
        return collection.items.filter((item) => itemPasses(item, { ignoreSearch: true }));
    }

    function coverFor(collection) {
        const pool = matchingItems(collection);
        return pool.find((item) => item.type === 'image')
            || collection.items.find((item) => item.type === 'image')
            || pool.find((item) => isGif(item))
            || pool[0]
            || collection.items[0];
    }

    function coverSrc(collection) {
        const cover = coverFor(collection);
        if (!cover) return '';
        if (isGif(cover)) return cover.src;
        if (isVideo(cover)) return posterFor(cover) || '';
        return cover.src;
    }

    function coverMedia(collection) {
        const src = coverSrc(collection);
        if (src) {
            return `<img src="${escapeHtml(src)}" alt="${escapeHtml(collection.name)}" loading="lazy">`;
        }
        const cover = coverFor(collection);
        if (cover && isVideo(cover)) {
            const frame = cover.src + (cover.src.includes('#') ? '' : '#t=0.8');
            return `<video muted playsinline preload="metadata" src="${escapeHtml(frame)}"></video>`;
        }
        return `<div class="gallery-fallback"><span>${escapeHtml(collection.name)}</span></div>`;
    }

    function createTile(item, index) {
        const el = document.createElement('article');
        el.className = 'gallery-item' + (isVideo(item) ? ' has-video' : '');
        el.tabIndex = 0;
        el.dataset.index = String(index);
        const badge = isVideo(item) ? 'VIDEO' : (isGif(item) ? 'GIF' : 'PHOTO');
        const poster = posterFor(item);
        let media;
        if (isVideo(item)) {
            const still = poster
                ? `<img class="gallery-poster" src="${escapeHtml(poster)}" alt="" loading="lazy">`
                : `<div class="gallery-fallback"><span>${escapeHtml(item.game)}</span></div>`;
            media = `${still}
               <video muted loop playsinline preload="none" data-src="${escapeHtml(item.src)}"></video>
               <div class="gallery-play" aria-hidden="true">▶</div>`;
        } else {
            media = `<img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.title)}" loading="lazy">`;
        }
        el.innerHTML = `
            ${media}
            <div class="gallery-badge">${badge}</div>
            <div class="gallery-info">
                <div class="gallery-title">${escapeHtml(item.title)}</div>
                <div class="gallery-category">${escapeHtml(item.game)}</div>
            </div>`;
        el.addEventListener('click', () => openModal(index));
        el.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openModal(index);
            }
        });
        if (isVideo(item)) bindTileMedia(el);
        return el;
    }

    function animateNewTiles(nodes) {
        if (!canGsap || !nodes.length) return;
        gsap.fromTo(nodes, { opacity: 0, y: 18 }, {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.03,
            ease: 'power2.out',
        });
    }

    function setView(mode) {
        state.view = mode;
        const mosaic = mode === 'mosaic';
        els.collectionsView.classList.toggle('active', mosaic);
        els.collectionsView.classList.toggle('hidden', !mosaic);
        els.galleryView.classList.toggle('hidden', mosaic);
        els.albumBar.classList.toggle('hidden', mosaic);
        els.loadMoreWrap.classList.toggle('hidden', mosaic);
        els.titleRow.classList.add('hidden');
        if (els.searchInput) {
            els.searchInput.placeholder = mosaic ? 'Search a title' : 'Search inside this title';
        }
    }

    function syncHash() {
        const next = state.collection
            ? '#title=' + encodeURIComponent(state.collection.name)
            : (location.pathname.split('/').pop() || 'galeria.html');
        if (state.collection) {
            if (location.hash !== '#title=' + encodeURIComponent(state.collection.name)) {
                history.replaceState(null, '', next);
            }
        } else if (location.hash.startsWith('#title=')) {
            history.replaceState(null, '', location.pathname + location.search);
        }
    }

    function renderAlbumBar() {
        if (!state.collection) return;
        const items = matchingItems(state.collection);
        const videos = items.filter((i) => i.type === 'video').length;
        els.albumKicker.textContent = state.collection.leftover
            ? 'Solitaires'
            : (state.collection.media === 'movie' ? 'Movie' : 'Game');
        els.albumTitle.textContent = state.collection.name;
        els.albumMeta.textContent = `${items.length} wallpapers · ${videos} live`;
        if (state.collection.leftover) {
            els.albumNote.textContent = 'Here are a few WLPRS I could not make more of, but hopefully I will when I have time to do so. Please support if you like BetterWLPRS. Thank you.';
            els.albumNote.classList.remove('hidden');
        } else {
            els.albumNote.textContent = '';
            els.albumNote.classList.add('hidden');
        }
    }

    function renderPage(reset) {
        if (state.view !== 'album') return;
        if (paging && !reset) return;
        paging = true;
        const items = filteredItems();
        if (reset) {
            stopPlaying();
            state.page = 0;
            els.grid.innerHTML = '';
        }
        if (!items.length) {
            els.grid.innerHTML = '<p class="gallery-empty">No wallpapers match these filters.</p>';
            els.loadMoreWrap.classList.add('hidden');
            els.dockCount.innerHTML = '<span>0</span> / 0';
            els.currentCount.textContent = '0';
            els.totalCount.textContent = '0';
            paging = false;
            return;
        }
        const start = state.page * ITEMS_PER_PAGE;
        const end = Math.min(start + ITEMS_PER_PAGE, items.length);
        const fragment = document.createDocumentFragment();
        const fresh = [];
        for (let i = start; i < end; i++) {
            const tile = createTile(items[i], i);
            fragment.appendChild(tile);
            fresh.push(tile);
        }
        els.grid.appendChild(fragment);
        state.page += 1;
        els.currentCount.textContent = String(end);
        els.totalCount.textContent = String(items.length);
        els.dockCount.innerHTML = `<span>${end}</span> / ${items.length}`;
        els.loadMoreWrap.classList.remove('hidden');
        els.loadMoreBtn.disabled = end >= items.length;
        els.loadMoreBtn.textContent = end >= items.length ? 'All loaded' : 'Load more';
        animateNewTiles(fresh);
        paging = false;
    }

    function openCollection(collection) {
        state.collection = collection;
        setView('album');
        renderAlbumBar();
        renderPage(true);
        syncHash();
        window.scrollTo({ top: els.controls.offsetTop - 80, behavior: reduceMotion ? 'auto' : 'smooth' });
    }

    function closeCollection() {
        state.collection = null;
        stopPlaying();
        setView('mosaic');
        renderCollections();
        syncHash();
    }

    function renderCollections() {
        $('loadingIndicator')?.classList.add('hidden');
        const list = visibleCollections();
        els.collectionsGrid.innerHTML = '';
        els.dockCount.innerHTML = `<span>${list.length}</span> titles`;
        if (!list.length) {
            els.collectionsGrid.innerHTML = '<p class="gallery-empty">No titles match these filters.</p>';
            return;
        }
        const fragment = document.createDocumentFragment();
        const cards = [];
        list.forEach((collection) => {
            const items = matchingItems(collection);
            const videos = items.filter((i) => i.type === 'video').length;
            const photos = items.length - videos;
            const kind = collection.leftover ? 'ONE-SHOTS' : (collection.media === 'movie' ? 'FILM' : 'GAME');
            const card = document.createElement('article');
            card.className = 'collection-card';
            card.tabIndex = 0;
            card.innerHTML = `
                <div class="collection-preview">
                    ${coverMedia(collection)}
                    <div class="collection-kind">${kind}</div>
                    <div class="collection-count">${items.length}</div>
                </div>
                <div class="collection-info">
                    <div class="collection-title">${escapeHtml(collection.name)}</div>
                    <div class="collection-description">${collection.leftover ? 'A few I could not make more of — yet' : `${photos} photos · ${videos} videos`}</div>
                </div>`;
            const open = () => openCollection(collection);
            card.addEventListener('click', open);
            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    open();
                }
            });
            fragment.appendChild(card);
            cards.push(card);
        });
        els.collectionsGrid.appendChild(fragment);
        animateNewTiles(cards);
    }

    function refresh() {
        if (state.view === 'mosaic') renderCollections();
        else {
            renderAlbumBar();
            renderPage(true);
        }
    }

    function currentModalItem() {
        return filteredItems()[state.modalIndex] || null;
    }

    function paintModal() {
        const item = currentModalItem();
        if (!item) return;
        els.modalTitle.textContent = item.title;
        els.modalKicker.textContent = `${item.game} · ${isVideo(item) ? 'Video' : 'Photo'}`;
        if (isVideo(item)) {
            els.modalImage.style.display = 'none';
            els.modalVideo.style.display = 'block';
            els.modalVideo.src = item.src;
            els.modalVideo.play().catch(() => {});
        } else {
            els.modalVideo.pause();
            els.modalVideo.removeAttribute('src');
            els.modalVideo.style.display = 'none';
            els.modalImage.style.display = 'block';
            els.modalImage.src = item.src;
            els.modalImage.alt = item.title;
        }
    }

    function openModal(index) {
        state.modalIndex = index;
        stopPlaying();
        els.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        paintModal();
        if (canGsap) {
            gsap.fromTo('.modal-shell', { opacity: 0, y: 24, scale: 0.98 }, {
                opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out',
            });
        }
    }

    function closeModal() {
        els.modal.classList.remove('active');
        document.body.style.overflow = '';
        els.modalVideo.pause();
        els.modalVideo.removeAttribute('src');
        state.modalIndex = -1;
    }

    function stepModal(delta) {
        const items = filteredItems();
        if (!items.length) return;
        state.modalIndex = (state.modalIndex + delta + items.length) % items.length;
        paintModal();
    }

    function updateCounts() {
        const games = state.collections.filter((c) => c.media === 'game').length;
        const movies = state.collections.filter((c) => c.media === 'movie').length;
        $('countAll').textContent = state.collections.length;
        $('countGames').textContent = games;
        $('countMovies').textContent = movies;
        $('statTotal').textContent = state.all.length;
        $('statGames').textContent = state.collections.length;
        $('statVideos').textContent = state.all.filter((i) => i.type === 'video').length;
    }

    function bindChrome() {
        window.addEventListener('scroll', () => {
            $('navbar')?.classList.toggle('scrolled', window.scrollY > 50);
            els.controls.classList.toggle('elevated', window.scrollY > 80);
        });

        const hamburger = $('hamburger');
        const mobileMenu = $('mobileMenu');
        hamburger?.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
        document.querySelectorAll('.mobile-menu .nav-item').forEach((item) => {
            item.addEventListener('click', () => {
                hamburger?.classList.remove('active');
                mobileMenu?.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        function setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            const isLight = theme === 'light';
            [$('themeToggle'), $('themeToggleMobile')].forEach((btn) => {
                if (btn) btn.innerHTML = isLight ? '<span>🌙</span>' : '<span>☀️</span>';
            });
            localStorage.setItem('theme', theme);
        }
        function toggleTheme() {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            setTheme(current === 'dark' ? 'light' : 'dark');
        }
        $('themeToggle')?.addEventListener('click', toggleTheme);
        $('themeToggleMobile')?.addEventListener('click', toggleTheme);
        setTheme(document.documentElement.getAttribute('data-theme') || 'dark');

        document.querySelectorAll('.cat-tab').forEach((btn) => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.cat-tab').forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');
                state.media = btn.dataset.media;
                state.collection = null;
                setView('mosaic');
                renderCollections();
                syncHash();
            });
        });

        document.querySelectorAll('.type-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.type-btn').forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');
                state.type = btn.dataset.type;
                refresh();
            });
        });

        document.querySelectorAll('.mood-chip').forEach((btn) => {
            btn.addEventListener('click', () => {
                const mood = btn.dataset.mood || null;
                state.mood = state.mood === mood ? null : mood;
                document.querySelectorAll('.mood-chip').forEach((b) => {
                    b.classList.toggle('active', b.dataset.mood === state.mood);
                });
                refresh();
            });
        });

        els.albumBack.addEventListener('click', closeCollection);
        els.searchInput.addEventListener('input', (event) => {
            state.search = event.target.value.trim();
            refresh();
        });
        els.loadMoreBtn.addEventListener('click', () => renderPage(false));
        $('closeModal').addEventListener('click', closeModal);
        $('modalPrev').addEventListener('click', (event) => { event.stopPropagation(); stepModal(-1); });
        $('modalNext').addEventListener('click', (event) => { event.stopPropagation(); stepModal(1); });
        els.modal.addEventListener('click', (event) => { if (event.target === els.modal) closeModal(); });
        $('downloadModal').addEventListener('click', () => {
            const item = currentModalItem();
            if (!item) return;
            const link = document.createElement('a');
            link.href = item.src;
            link.target = '_blank';
            link.rel = 'noopener';
            link.download = item.title;
            link.click();
        });
        document.addEventListener('keydown', (event) => {
            if (els.modal.classList.contains('active')) {
                if (event.key === 'Escape') closeModal();
                if (event.key === 'ArrowLeft') stepModal(-1);
                if (event.key === 'ArrowRight') stepModal(1);
                return;
            }
            if (event.key === 'Escape' && state.collection) closeCollection();
        });

        window.addEventListener('hashchange', () => {
            if (!location.hash.startsWith('#title=') && state.collection) closeCollection();
        });

        const sentinelObserver = new IntersectionObserver((entries) => {
            if (!entries[0].isIntersecting) return;
            if (state.view !== 'album') return;
            if (els.loadMoreBtn.disabled) return;
            renderPage(false);
        }, { rootMargin: '600px 0px' });
        sentinelObserver.observe(els.sentinel);
    }

    async function init() {
        els.controls = $('galleryControls');
        els.grid = $('galleryGrid');
        els.galleryView = $('galleryView');
        els.collectionsView = $('collectionsView');
        els.collectionsGrid = $('collectionsGrid');
        els.loadMoreWrap = $('loadMoreContainer');
        els.loadMoreBtn = $('loadMoreBtn');
        els.currentCount = $('currentCount');
        els.totalCount = $('totalCount');
        els.dockCount = $('dockCount');
        els.titleRow = $('subChipsRow');
        els.albumBar = $('albumBar');
        els.albumBack = $('albumBack');
        els.albumTitle = $('albumTitle');
        els.albumNote = $('albumNote');
        els.albumKicker = $('albumKicker');
        els.albumMeta = $('albumMeta');
        els.searchInput = $('searchInput');
        els.modal = $('previewModal');
        els.modalTitle = $('modalTitle');
        els.modalKicker = $('modalKicker');
        els.modalImage = $('modalImage');
        els.modalVideo = $('modalVideo');
        els.sentinel = $('infiniteSentinel');

        bindChrome();

        try {
            state.all = sortCatalog(await loadWallpapers());
        } catch (err) {
            els.collectionsGrid.innerHTML = '<p class="gallery-empty">Could not load the wallpaper catalog.</p>';
            console.warn(err);
            return;
        }

        state.collections = buildCollections(state.all);

        $('loadingIndicator')?.classList.add('hidden');
        els.grid.classList.remove('hidden');
        updateCounts();
        setView('mosaic');

        const hashTitle = location.hash.startsWith('#title=')
            ? decodeURIComponent(location.hash.slice(7))
            : '';
        const opened = hashTitle
            ? state.collections.find((c) => c.name.toLowerCase() === hashTitle.toLowerCase())
            : null;
        if (opened) openCollection(opened);
        else renderCollections();

        if (canGsap) {
            gsap.from('.gallery-intro > *', { opacity: 0, y: 16, duration: 0.5, stagger: 0.08, ease: 'power2.out' });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}());
