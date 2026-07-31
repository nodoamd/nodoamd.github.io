/* Nodo Reader — lector local de PDF/EPUB con notas escritas y de voz.
   Todas las librerías se sirven desde ./vendor para funcionar sin conexión. */
const pdfjsLib = window.pdfjsLib;
pdfjsLib.GlobalWorkerOptions.workerSrc = './vendor/pdf.worker.min.js';

const DB_NAME = 'nodo-reader-v1';
const DB_VER = 2;
const PREFS_KEY = 'nodo-reader-prefs';
const SAMPLE_KEY = 'nodo-reader-sample';
const WELCOME_KEY = 'nodo-reader-welcome';
// Libro de dominio público que viene con la app para poder leer desde el primer minuto
const SAMPLE_BOOK = {
  id: 'sample-lazarillo',
  url: './books/lazarillo-de-tormes.pdf',
  title: 'La vida de Lazarillo de Tormes',
  fileName: 'lazarillo-de-tormes.pdf'
};
const ZOOM_STEPS = [0.6, 0.75, 0.9, 1, 1.15, 1.35, 1.6, 1.9, 2.3];
// Ancho cómodo de lectura: sin tope, en monitores anchos la página sale gigante
const MAX_PAGE_W = 1040;
const MAX_PAGE_W_SPREAD = 760;

const state = {
  books: [],
  notes: [],
  audios: [],
  pane: 'library',
  notesFilter: 'all',
  currentId: null,
  kind: null,
  pdf: null,
  epub: null,
  page: 1,
  pageCount: 1,
  spread: false,
  zoom: 1,
  panelOpen: true,
  recording: false,
  mediaRecorder: null,
  chunks: [],
  saveRec: false,
  objectUrl: null,
  noteUrls: [],
  renderToken: 0,
  navToken: 0,
  coverUrls: new Map(),
  coverJob: false,
  coverTimer: null,
  persistTimer: null
};

const prefs = { theme: 'light', paper: 'off', font: '100' };

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------------- IndexedDB ---------------- */
function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = (event) => {
      const db = req.result;
      if (!db.objectStoreNames.contains('books')) db.createObjectStore('books', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('notes')) {
        db.createObjectStore('notes', { keyPath: 'key' }).createIndex('bookId', 'bookId', { unique: false });
      }
      if (!db.objectStoreNames.contains('audio')) {
        db.createObjectStore('audio', { keyPath: 'id' }).createIndex('bookPage', ['bookId', 'page'], { unique: false });
      }
      if (!db.objectStoreNames.contains('files')) db.createObjectStore('files', { keyPath: 'id' });

      // v2: el archivo pasa a su propia tabla. Guardado junto a los metadatos obligaba a
      // reescribir el libro entero (decenas de MB) cada vez que cambiaba de página.
      if (event.oldVersion < 2) {
        const books = req.transaction.objectStore('books');
        const files = req.transaction.objectStore('files');
        books.openCursor().onsuccess = (e) => {
          const cursor = e.target.result;
          if (!cursor) return;
          const book = cursor.value;
          if (book.blob) {
            files.put({ id: book.id, data: book.blob });
            delete book.blob;
            cursor.update(book);
          }
          cursor.continue();
        };
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbAll(store) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction(store, 'readonly').objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function idbAllByIndex(store, index, key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction(store, 'readonly').objectStore(store).index(index).getAll(key);
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function idbGet(store, key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction(store, 'readonly').objectStore(store).get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

async function idbPut(store, value) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).put(value);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbDelete(store, key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Los bytes del libro solo se leen cuando hacen falta: nunca viven en state
async function readBookFile(id) {
  const file = await idbGet('files', id);
  if (file?.data) return file.data;
  const legacy = await idbGet('books', id);
  return legacy?.blob || null;
}

/* ---------------- Utilidades ---------------- */
const noteKey = (bookId, page) => `${bookId}::${page}`;
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random()}`);

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function prettyTitle(filename) {
  let t = filename.replace(/\.(pdf|epub)$/i, '');
  t = t.split(/\s--\s|_{2,}/)[0];
  t = t.replace(/[-_]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
  if (t === t.toLowerCase()) t = t.replace(/\b\p{L}/gu, (c) => c.toUpperCase());
  return t.length > 90 ? `${t.slice(0, 90)}…` : t;
}

function fmtDate(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

function initials(title) {
  return title
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function trackUrl(blob, bucket) {
  const url = URL.createObjectURL(blob);
  state[bucket].push(url);
  return url;
}

function releaseUrls(bucket) {
  state[bucket].forEach((u) => URL.revokeObjectURL(u));
  state[bucket] = [];
}

function isNarrow() {
  return window.matchMedia('(max-width: 820px)').matches;
}

/* ---------------- Preferencias ---------------- */
function loadPrefs() {
  try {
    const saved = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
    if (saved.theme === 'light' || saved.theme === 'dark') prefs.theme = saved.theme;
    if (saved.paper === 'on' || saved.paper === 'off') prefs.paper = saved.paper;
    if (['90', '100', '115', '135'].includes(String(saved.font))) prefs.font = String(saved.font);
    if (typeof saved.zoom === 'number') state.zoom = saved.zoom;
  } catch { /* valores por defecto */ }
  applyPrefs(false);
}

function savePrefs() {
  localStorage.setItem(PREFS_KEY, JSON.stringify({ ...prefs, zoom: state.zoom }));
}

function applyPrefs(rerender = true) {
  const root = document.documentElement;
  root.dataset.theme = prefs.theme;
  root.dataset.paper = prefs.paper;
  root.dataset.font = prefs.font;
  const meta = $('meta[name="theme-color"]');
  if (meta) meta.content = prefs.theme === 'dark' ? '#0d0f1c' : '#3d28b8';
  $$('#font-seg [data-font]').forEach((b) => b.classList.toggle('is-on', b.dataset.font === prefs.font));
  $$('#theme-seg [data-theme]').forEach((b) => b.classList.toggle('is-on', b.dataset.theme === prefs.theme));
  $$('#paper-seg [data-paper]').forEach((b) => b.classList.toggle('is-on', b.dataset.paper === prefs.paper));
  if (rerender && state.currentId) renderPages();
}

/* ---------------- Arranque ---------------- */
function watchOfflineState() {
  const el = $('#offline-state');
  if (!el) return;
  if (!('serviceWorker' in navigator)) {
    el.textContent = 'Este navegador no guarda la app para uso sin conexión.';
    return;
  }
  const ready = () => { el.textContent = 'Lista para leer sin conexión.'; };
  if (navigator.serviceWorker.controller) ready();
  else navigator.serviceWorker.ready.then(ready);
}

async function boot() {
  loadPrefs();
  bindUi();
  watchOfflineState();
  await seedSampleBook();
  await refreshData();
  state.panelOpen = false;
  updateDockChrome();

  setTimeout(() => {
    const bootEl = $('#boot');
    if (!bootEl) return;
    // Si la pestaña está en segundo plano las animaciones se congelan: quítalo igualmente
    setTimeout(() => bootEl.remove(), 1400);
    const reveal = '.main-top, #continue-host, .book-grid > *, .sidebar';
    if (window.gsap && document.visibilityState === 'visible') {
      gsap.to(bootEl, { opacity: 0, duration: 0.4, onComplete: () => bootEl.remove() });
      gsap.from('.main-top, #continue-host, .book-grid > *', {
        opacity: 0,
        y: 16,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out'
      });
      gsap.from('.sidebar', { opacity: 0, x: -18, duration: 0.5, ease: 'power2.out' });
      // Si la pestaña pasa a segundo plano rAF se detiene y la entrada quedaría
      // congelada a medias: pasado el tiempo de la animación forzamos el estado final.
      setTimeout(() => {
        gsap.killTweensOf(reveal);
        gsap.set(reveal, { clearProps: 'all' });
      }, 1400);
    } else {
      bootEl.remove();
    }
  }, 520);
}

// Solo la primera vez: si el usuario lo borra no vuelve a aparecer, y si falla
// (por ejemplo sin conexión en la primera visita) se reintenta en el siguiente arranque.
async function seedSampleBook() {
  if (localStorage.getItem(SAMPLE_KEY)) return;
  try {
    if (await idbGet('books', SAMPLE_BOOK.id)) {
      localStorage.setItem(SAMPLE_KEY, 'done');
      return;
    }
    const res = await fetch(SAMPLE_BOOK.url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.arrayBuffer();
    // pdf.js se queda con el buffer que le pasas, así que va una copia
    let pageCount = 1;
    try {
      const doc = await pdfjsLib.getDocument({ data: data.slice(0) }).promise;
      pageCount = doc.numPages;
      doc.destroy();
    } catch { /* el recuento real se calcula al abrirlo */ }
    await idbPut('files', { id: SAMPLE_BOOK.id, data });
    await idbPut('books', {
      id: SAMPLE_BOOK.id,
      title: SAMPLE_BOOK.title,
      titleV2: true,
      fileName: SAMPLE_BOOK.fileName,
      kind: 'pdf',
      sample: true,
      lastPage: 1,
      pageCount,
      cover: null,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    localStorage.setItem(SAMPLE_KEY, 'done');
  } catch (err) {
    console.warn('No se pudo preparar el libro de ejemplo', err);
  }
}

async function refreshData() {
  const [books, notes, audios] = await Promise.all([idbAll('books'), idbAll('notes'), idbAll('audio')]);
  for (const book of books) {
    if (book.titleV2) continue;
    book.title = prettyTitle(book.fileName || book.title);
    book.titleV2 = true;
    await idbPut('books', book);
  }
  state.books = books.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  state.notes = notes.filter((n) => (n.text || '').trim());
  state.audios = audios;
  renderLibrary();
  renderNotesPane();
  scheduleCoverBackfill();
}

/* ---------------- Biblioteca ---------------- */
function bookStats(id) {
  return {
    notes: state.notes.filter((n) => n.bookId === id).length,
    audios: state.audios.filter((a) => a.bookId === id).length
  };
}

function blankCover(book) {
  return `<div class="cover-blank">
      <span class="cover-blank__mark">${escapeHtml(initials(book.title) || 'N')}</span>
      <span class="cover-blank__title">${escapeHtml(book.title)}</span>
      <span class="cover-blank__rule"></span>
      <span class="cover-blank__foot">Nodo Reader</span>
    </div>`;
}

function coverArt(book) {
  return book.cover ? `<img src="${coverUrl(book)}" alt="" decoding="async">` : blankCover(book);
}

function renderWelcome() {
  const host = $('#welcome-host');
  if (!host) return;
  if (localStorage.getItem(WELCOME_KEY)) {
    host.innerHTML = '';
    return;
  }
  const sample = state.books.find((b) => b.id === SAMPLE_BOOK.id);
  host.innerHTML = `
    <section class="welcome">
      <button type="button" class="welcome__close" data-welcome-close aria-label="Cerrar la bienvenida">×</button>
      <div class="welcome__text">
        <h3>Bienvenido a Nodo Reader</h3>
        <p>${sample
          ? 'Te hemos dejado <strong>El Lazarillo de Tormes</strong> en la biblioteca para que pruebes a leer y a tomar notas ahora mismo.'
          : 'Añade un PDF o un EPUB y empieza a leer. Cada página tiene su hueco para escribir y para grabar tu voz.'}</p>
      </div>
      <div class="welcome__actions">
        ${sample ? `<button type="button" class="btn btn--primary tap" data-open="${sample.id}">Empezar a leer</button>` : ''}
        <button type="button" class="btn btn--ghost tap" data-goto-guide>Ver la guía de uso</button>
      </div>
    </section>`;
}

function renderLibrary() {
  renderWelcome();
  const startBtn = $('#guide-start');
  if (startBtn) {
    startBtn.textContent = state.books.some((b) => b.id === SAMPLE_BOOK.id)
      ? 'Abrir el libro de ejemplo'
      : 'Añadir mi primer libro';
  }
  const grid = $('#book-grid');
  const host = $('#continue-host');
  const count = $('#library-count');
  if (!grid) return;
  pruneCoverUrls();

  count.textContent = `${state.books.length} libro${state.books.length === 1 ? '' : 's'}`;

  if (!state.books.length) {
    host.innerHTML = '';
    grid.innerHTML = `<div class="empty">
      <strong>Todavía no hay libros</strong>
      Añade un PDF o un EPUB y empieza a leer. Cada página tendrá su hueco para escribir y para grabar tu voz.
    </div>`;
    return;
  }

  const last = state.books[0];
  const pct = last.pageCount ? Math.round(((last.lastPage || 1) / last.pageCount) * 100) : 0;
  host.innerHTML = `
    <section class="hero">
      <div class="hero__cover${last.cover ? '' : ' is-blank'}" data-cover-for="${last.id}">${coverArt(last)}</div>
      <div>
        <p class="hero__eyebrow">Sigue leyendo</p>
        <h3>${escapeHtml(last.title)}</h3>
        <p class="hero__meta">${last.kind.toUpperCase()} · página ${last.lastPage || 1} de ${last.pageCount || '?'} · ${pct}%</p>
        <div class="hero__bar"><span style="width:${Math.max(pct, 2)}%"></span></div>
        <button type="button" class="btn btn--primary tap" data-open="${last.id}">Continuar</button>
      </div>
    </section>`;

  grid.innerHTML = state.books
    .map((b) => {
      const s = bookStats(b.id);
      return `
      <article class="book">
        <button type="button" class="book__open" data-open="${b.id}">
          <div class="book__cover${b.cover ? '' : ' is-blank'}" data-cover-for="${b.id}">
            <span class="book__kind">${b.kind.toUpperCase()}</span>
            ${coverArt(b)}
          </div>
          <div>
            <h4>${escapeHtml(b.title)}</h4>
            <p class="book__meta">Pág. ${b.lastPage || 1} / ${b.pageCount || '?'}</p>
          </div>
        </button>
        <div class="book__pills">
          <span class="pill${s.notes ? ' pill--accent' : ''}">${s.notes} nota${s.notes === 1 ? '' : 's'}</span>
          <span class="pill${s.audios ? ' pill--accent' : ''}">${s.audios} audio${s.audios === 1 ? '' : 's'}</span>
        </div>
        <div class="book__foot">
          <button type="button" class="link-btn" data-book-notes="${b.id}">Ver notas</button>
          <button type="button" class="link-btn link-btn--muted" data-del="${b.id}">Eliminar</button>
        </div>
      </article>`;
    })
    .join('');
}

function renderNotesPane() {
  const list = $('#notes-list');
  const filter = $('#notes-filter');
  if (!list || !filter) return;
  releaseUrls('noteUrls');

  const withContent = state.books.filter((b) => bookStats(b.id).notes + bookStats(b.id).audios > 0);
  filter.innerHTML = [
    `<option value="all">Todos los libros</option>`,
    ...withContent.map((b) => `<option value="${b.id}">${escapeHtml(b.title)}</option>`)
  ].join('');
  filter.value = withContent.some((b) => b.id === state.notesFilter) ? state.notesFilter : 'all';
  state.notesFilter = filter.value;

  const books = state.notesFilter === 'all' ? withContent : withContent.filter((b) => b.id === state.notesFilter);

  if (!books.length) {
    list.innerHTML = `<div class="empty">
      <strong>Sin notas todavía</strong>
      Abre un libro, pulsa Notas y escribe o graba lo que quieras recordar. Aparecerá aquí con su página.
    </div>`;
    return;
  }

  list.innerHTML = books
    .map((book) => {
      const notes = state.notes.filter((n) => n.bookId === book.id);
      const audios = state.audios.filter((a) => a.bookId === book.id);
      const pages = [...new Set([...notes.map((n) => n.page), ...audios.map((a) => a.page)])].sort((a, b) => a - b);
      const cards = pages
        .map((page) => {
          const note = notes.find((n) => n.page === page);
          const pageAudios = audios.filter((a) => a.page === page);
          const text = (note?.text || '').trim();
          return `
          <article class="note-card">
            <div class="note-card__top">
              <button type="button" class="page-chip" data-goto="${book.id}:${page}">Página ${page}</button>
              ${pageAudios.length ? `<span class="pill">${pageAudios.length} audio${pageAudios.length === 1 ? '' : 's'}</span>` : ''}
              <span class="note-card__date">${fmtDate(note?.updatedAt || pageAudios[0]?.createdAt)}</span>
            </div>
            ${text ? `<p class="note-card__text">${escapeHtml(text)}</p>` : ''}
            ${pageAudios.length
              ? `<div class="note-card__audios">${pageAudios
                  .map((a) => `<audio controls preload="none" src="${trackUrl(a.blob, 'noteUrls')}"></audio>`)
                  .join('')}</div>`
              : ''}
          </article>`;
        })
        .join('');
      return `<div class="notes-group">
        <p class="notes-group__title">${escapeHtml(book.title)} <span class="pill">${pages.length} página${pages.length === 1 ? '' : 's'}</span></p>
        ${cards}
      </div>`;
    })
    .join('');
}

function setPane(pane) {
  state.pane = pane;
  $$('[data-pane-body]').forEach((el) => {
    el.hidden = el.dataset.paneBody !== pane;
  });
  $$('.side-link[data-pane]').forEach((b) => b.classList.toggle('is-on', b.dataset.pane === pane));
  $$('#tabbar button[data-pane]').forEach((b) => b.classList.toggle('is-on', b.dataset.pane === pane));
  const titles = { notes: 'Mis notas', guia: 'Guía de uso' };
  $('#greeting').textContent = titles[pane] || 'Tu biblioteca';
  if (window.gsap) {
    gsap.fromTo(`[data-pane-body="${pane}"]`, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------------- Alta de libros ---------------- */
async function onFileChosen(e) {
  const file = e.target.files?.[0];
  e.target.value = '';
  if (!file) return;
  const name = file.name.toLowerCase();
  if (name.endsWith('.mobi') || name.endsWith('.azw3')) {
    alert('MOBI/AZW3 no se pueden leer en el navegador. Conviértelo a EPUB o PDF con Calibre y súbelo aquí.');
    return;
  }
  const kind = name.endsWith('.epub') ? 'epub' : 'pdf';
  const book = {
    id: uid(),
    title: prettyTitle(file.name),
    titleV2: true,
    fileName: file.name,
    kind,
    lastPage: 1,
    pageCount: 1,
    cover: null,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  await idbPut('files', { id: book.id, data: await file.arrayBuffer() });
  await idbPut('books', book);
  await refreshData();
  await openBook(book.id);
}

/* ---------------- Apertura y render ---------------- */
async function openBook(id) {
  const book = await idbGet('books', id);
  const data = book && (await readBookFile(id));
  if (!book || !data) {
    alert('No encuentro el archivo de este libro en este dispositivo. Vuelve a añadirlo.');
    return;
  }

  state.currentId = id;
  state.kind = book.kind;
  state.page = book.lastPage || 1;
  state.spread = false;
  $('#book-title').textContent = book.title;
  $('#pages').classList.toggle('is-epub', book.kind === 'epub');
  showReader(true);

  if (state.objectUrl) URL.revokeObjectURL(state.objectUrl);
  state.objectUrl = URL.createObjectURL(
    new Blob([data], { type: book.kind === 'pdf' ? 'application/pdf' : 'application/epub+zip' })
  );

  try {
    if (book.kind === 'pdf') {
      state.epub = null;
      state.pdf = await pdfjsLib.getDocument(state.objectUrl).promise;
      state.pageCount = state.pdf.numPages;
    } else {
      state.pdf = null;
      await loadEpub(state.objectUrl);
    }
  } catch (err) {
    console.error(err);
    alert('No se pudo abrir este archivo. Si es un PDF protegido o dañado, prueba a reconvertirlo.');
    await backToLibrary();
    return;
  }

  if (state.page > state.pageCount) state.page = 1;
  book.pageCount = state.pageCount;
  book.updatedAt = Date.now();
  await idbPut('books', book);

  state.navToken += 1;
  setPanel(false);
  await renderPages();
  updateDockChrome();
  fadePages();
  await loadNoteForPage();
}

/* ---------------- Portadas ---------------- */
async function makePdfCover(arrayBuffer) {
  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  try {
    const page = await doc.getPage(1);
    const unscaled = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: 460 / unscaled.width });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    return await new Promise((res) => canvas.toBlob(res, 'image/jpeg', 0.82));
  } finally {
    doc.destroy();
  }
}

function imageMime(path) {
  const ext = path.split('.').pop().toLowerCase();
  if (ext === 'png') return 'image/png';
  if (ext === 'gif') return 'image/gif';
  if (ext === 'svg') return 'image/svg+xml';
  if (ext === 'webp') return 'image/webp';
  return 'image/jpeg';
}

function resolvePath(base, href) {
  const clean = href.replace(/^\.\//, '').split('#')[0];
  if (clean.startsWith('/')) return clean.slice(1);
  const parts = (base + clean).split('/');
  const out = [];
  for (const part of parts) {
    if (part === '..') out.pop();
    else if (part && part !== '.') out.push(part);
  }
  return out.join('/');
}

async function findEpubCoverPath(pkg) {
  const images = Object.values(pkg.items).filter((it) => (it.type || '').startsWith('image/'));

  const byProps = images.find((it) => (it.props || '').includes('cover-image'));
  if (byProps) return resolvePath(pkg.base, byProps.href);

  const metaId = pkg.opf.match(/<meta[^>]+name="cover"[^>]+content="([^"]+)"/i)?.[1]
    || pkg.opf.match(/<meta[^>]+content="([^"]+)"[^>]+name="cover"/i)?.[1];
  const byMeta = metaId && pkg.items[metaId];
  if (byMeta && (byMeta.type || '').startsWith('image/')) return resolvePath(pkg.base, byMeta.href);

  const byName = images.find((it) => /cover/i.test(it.id) || /cover/i.test(it.href));
  if (byName) return resolvePath(pkg.base, byName.href);

  // Muchos EPUB usan una primera página xhtml que solo contiene la imagen de cubierta
  const firstDoc = pkg.spineIds.map((id) => pkg.items[id]).find((it) => it && /xhtml|html/.test(it.type || ''));
  if (firstDoc) {
    const html = await pkg.zip.file(resolvePath(pkg.base, firstDoc.href))?.async('text');
    const src = html?.match(/<img[^>]+src="([^"]+)"/i)?.[1] || html?.match(/xlink:href="([^"]+\.(?:jpe?g|png))"/i)?.[1];
    if (src) {
      const docBase = firstDoc.href.includes('/') ? firstDoc.href.slice(0, firstDoc.href.lastIndexOf('/') + 1) : '';
      return resolvePath(pkg.base + docBase, src);
    }
  }
  return null;
}

async function makeEpubCover(arrayBuffer) {
  const pkg = await readEpubPackage(arrayBuffer);
  const path = await findEpubCoverPath(pkg);
  if (!path) return null;
  const file = pkg.zip.file(path);
  if (!file) return null;
  const bytes = await file.async('uint8array');
  return new Blob([bytes], { type: imageMime(path) });
}

async function makeCover(book) {
  const data = await readBookFile(book.id);
  if (!data) return null;
  try {
    return book.kind === 'pdf' ? await makePdfCover(data.slice(0)) : await makeEpubCover(data);
  } catch (err) {
    console.warn('Sin portada para', book.title, err);
    return null;
  }
}

// Una URL por libro que vive mientras el libro exista: revocarlas en cada repintado
// dejaba imágenes a medio cargar y de ahí las cubiertas rotas.
function coverUrl(book) {
  const cached = state.coverUrls.get(book.id);
  if (cached && cached.blob === book.cover) return cached.url;
  if (cached) URL.revokeObjectURL(cached.url);
  const url = URL.createObjectURL(book.cover);
  state.coverUrls.set(book.id, { blob: book.cover, url });
  return url;
}

function dropCoverUrl(id) {
  const cached = state.coverUrls.get(id);
  if (!cached) return;
  URL.revokeObjectURL(cached.url);
  state.coverUrls.delete(id);
}

function pruneCoverUrls() {
  const alive = new Set(state.books.map((b) => b.id));
  [...state.coverUrls.keys()].forEach((id) => {
    if (!alive.has(id)) dropCoverUrl(id);
  });
}

function paintCover(book) {
  $$(`[data-cover-for="${book.id}"]`).forEach((host) => {
    if (host.querySelector('img')) return;
    const img = document.createElement('img');
    img.alt = '';
    img.decoding = 'async';
    img.addEventListener('load', () => {
      host.querySelector('.cover-blank')?.remove();
      host.classList.remove('is-blank');
      if (window.gsap) gsap.fromTo(img, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power1.out' });
    }, { once: true });
    img.src = coverUrl(book);
    host.appendChild(img);
  });
}

// Si una cubierta no llega a pintarse, la tarjeta vuelve a su versión tipográfica
function onCoverError(e) {
  const img = e.target;
  if (!(img instanceof HTMLImageElement)) return;
  const host = img.closest('[data-cover-for]');
  if (!host) return;
  img.remove();
  const book = state.books.find((b) => b.id === host.dataset.coverFor);
  if (!book) return;
  dropCoverUrl(book.id);
  if (host.querySelector('.cover-blank')) return;
  host.classList.add('is-blank');
  host.insertAdjacentHTML('beforeend', blankCover(book));
}

function scheduleCoverBackfill() {
  if (state.coverTimer) return;
  state.coverTimer = setTimeout(() => {
    state.coverTimer = null;
    backfillCovers();
  }, 800);
}

// Generar una cubierta abre otra copia del PDF, así que solo se hace desde la
// biblioteca, de uno en uno y dejando respirar al hilo principal entre libros.
async function backfillCovers() {
  if (state.coverJob) return;
  state.coverJob = true;
  try {
    for (const item of [...state.books]) {
      if (state.currentId) break;
      if (item.cover || item.coverTried) continue;
      const fresh = await idbGet('books', item.id);
      if (!fresh || fresh.cover) continue;
      const blob = await makeCover(fresh);
      fresh.coverTried = true;
      if (blob) fresh.cover = blob;
      await idbPut('books', fresh);
      const local = state.books.find((b) => b.id === item.id);
      if (local) {
        local.coverTried = true;
        if (blob) local.cover = blob;
        if (blob) paintCover(local);
      }
      await new Promise((r) => setTimeout(r, 250));
    }
  } finally {
    state.coverJob = false;
  }
}

let jszipLoader = null;

function loadJSZip() {
  if (window.JSZip) return Promise.resolve(window.JSZip);
  if (!jszipLoader) {
    jszipLoader = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = './vendor/jszip.min.js';
      script.onload = () => resolve(window.JSZip);
      script.onerror = () => reject(new Error('No se pudo cargar JSZip'));
      document.head.appendChild(script);
    });
  }
  return jszipLoader;
}

async function readEpubPackage(source) {
  const JSZip = await loadJSZip();
  const zip = await JSZip.loadAsync(source);
  const container = await zip.file('META-INF/container.xml')?.async('text');
  if (!container) throw new Error('EPUB inválido');
  const opfPath = container.match(/full-path="([^"]+)"/)?.[1];
  if (!opfPath) throw new Error('EPUB sin OPF');
  const opf = await zip.file(opfPath).async('text');
  const base = opfPath.includes('/') ? opfPath.slice(0, opfPath.lastIndexOf('/') + 1) : '';

  const items = {};
  [...opf.matchAll(/<item\b[^>]*>/g)].forEach(([tag]) => {
    const id = tag.match(/\sid="([^"]+)"/)?.[1];
    const href = tag.match(/\shref="([^"]+)"/)?.[1];
    if (!id || !href) return;
    items[id] = {
      id,
      href,
      type: tag.match(/\smedia-type="([^"]+)"/)?.[1] || '',
      props: tag.match(/\sproperties="([^"]+)"/)?.[1] || ''
    };
  });

  const spineIds = [...opf.matchAll(/<itemref[^>]+idref="([^"]+)"/g)].map((m) => m[1]);
  return { zip, opf, base, items, spineIds };
}

async function loadEpub(url) {
  const { zip, base, items, spineIds } = await readEpubPackage(await (await fetch(url)).arrayBuffer());
  const chapters = [];
  for (const id of spineIds) {
    const href = items[id]?.href;
    if (!href) continue;
    const html = await zip.file(resolvePath(base, href))?.async('text');
    if (html) chapters.push({ html });
  }
  if (!chapters.length) throw new Error('EPUB sin capítulos legibles');

  state.epub = { chapters };
  state.pageCount = chapters.length;
}

function sanitizeEpubHtml(html) {
  const dark = prefs.theme === 'dark';
  const paperBg = dark ? '#181b2b' : '#fdfaf4';
  const ink = dark ? '#e9e8f2' : '#14161f';
  const size = getComputedStyle(document.documentElement).getPropertyValue('--epub-size').trim() || '1.06rem';
  const texture = prefs.paper === 'on' && !dark
    ? 'background-image:linear-gradient(160deg,rgba(255,246,224,.6),rgba(196,172,128,.16));'
    : '';
  const body = `font-family:Georgia,'Times New Roman',serif;line-height:1.7;padding:clamp(1rem,4vw,2.4rem);color:${ink};background:${paperBg};font-size:${size};max-width:38em;margin:0 auto;${texture}`;
  const clean = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<link[^>]*>/gi, '')
    // Las imágenes viven dentro del zip y no se pueden resolver desde el iframe
    .replace(/<img[^>]*>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '');
  return clean.includes('<body')
    ? clean.replace(/<body([^>]*)>/i, `<body$1 style="${body}">`)
    : `<html><body style="${body}">${clean}</body></html>`;
}

// Se monta el iframe nuevo encima y solo se retira el anterior cuando el nuevo ya
// ha pintado, para que el cambio de capítulo no pase por un hueco en blanco.
function renderEpubInto(host, html) {
  while (host.children.length > 1) host.firstElementChild.remove();
  const iframe = document.createElement('iframe');
  iframe.title = 'Contenido del libro';
  iframe.sandbox = 'allow-same-origin';
  iframe.addEventListener('load', () => {
    [...host.children].forEach((child) => {
      if (child !== iframe) child.remove();
    });
  }, { once: true });
  iframe.srcdoc = sanitizeEpubHtml(html);
  host.appendChild(iframe);
}

function fadePages() {
  // Al abrir el libro, un fundido mínimo; al pasar página no se llama (cambio seco)
  if (!window.gsap || document.visibilityState !== 'visible') return;
  const el = $('#pages');
  if (!el) return;
  gsap.killTweensOf(el);
  gsap.fromTo(
    el,
    { opacity: 0.96 },
    { opacity: 1, duration: 0.14, ease: 'none', overwrite: 'auto', clearProps: 'opacity' }
  );
}

async function renderPages() {
  const token = ++state.renderToken;
  const useRight = state.spread && !isNarrow() && state.page < state.pageCount;
  $('#page-right').classList.toggle('is-hidden', !useRight);

  if (state.kind === 'pdf') {
    await drawPdfPage(state.page, $('#canvas-left'), token);
    if (useRight) await drawPdfPage(state.page + 1, $('#canvas-right'), token);
  } else if (state.epub) {
    renderEpubInto($('#epub-left'), state.epub.chapters[state.page - 1]?.html || '');
    if (useRight) renderEpubInto($('#epub-right'), state.epub.chapters[state.page]?.html || '');
  }
  if (token === state.renderToken) $('#stage').scrollTop = 0;
}

function pageTargetWidth() {
  const stage = $('#stage');
  const styles = getComputedStyle(stage);
  const padX = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
  const cols = state.spread && !isNarrow() ? 2 : 1;
  const gap = cols === 2 ? 16 : 0;
  const panelSpace = state.panelOpen && window.innerWidth >= 1200 ? Math.min(420, window.innerWidth * 0.34) : 0;
  const available = Math.max(260, stage.clientWidth - padX - panelSpace - gap);
  const cap = cols === 2 ? MAX_PAGE_W_SPREAD : MAX_PAGE_W;
  return Math.min(available / cols, cap) * state.zoom;
}

async function drawPdfPage(num, canvas, token) {
  if (!state.pdf || !canvas || num < 1 || num > state.pageCount) return;
  const page = await state.pdf.getPage(num);
  if (token !== state.renderToken) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const unscaled = page.getViewport({ scale: 1 });
  const viewport = page.getViewport({ scale: (pageTargetWidth() / unscaled.width) * dpr });
  const signature = `${num}@${Math.round(viewport.width)}`;
  if (canvas.dataset.signature === signature && canvas.width) return;

  if (canvas.renderTask) {
    canvas.renderTask.cancel();
    canvas.renderTask = null;
  }

  // Se dibuja fuera de pantalla: si se pintara directo, el canvas se vaciaría al
  // redimensionarlo y se vería el destello blanco antes de aparecer la página.
  const offscreen = document.createElement('canvas');
  offscreen.width = viewport.width;
  offscreen.height = viewport.height;
  const task = page.render({ canvasContext: offscreen.getContext('2d', { alpha: false }), viewport });
  canvas.renderTask = task;
  try {
    await task.promise;
  } catch (err) {
    if (err?.name !== 'RenderingCancelledException') throw err;
    return;
  } finally {
    if (canvas.renderTask === task) canvas.renderTask = null;
  }
  if (token !== state.renderToken) return;

  canvas.width = offscreen.width;
  canvas.height = offscreen.height;
  canvas.style.width = `${Math.round(offscreen.width / dpr)}px`;
  canvas.style.height = 'auto';
  canvas.getContext('2d', { alpha: false }).drawImage(offscreen, 0, 0);
  canvas.dataset.signature = signature;
}

/* ---------------- Navegación ---------------- */
async function goPage(next) {
  if (!state.currentId) return;
  const step = state.spread && !isNarrow() ? 2 : 1;
  let p = Math.max(1, Math.min(next, state.pageCount));
  if (step === 2 && p % 2 === 0 && p > 1) p -= 1;
  if (p === state.page) return;
  state.page = p;
  const nav = ++state.navToken;
  updateDockChrome();
  queuePersistPage();
  await renderPages();
  if (nav !== state.navToken) return;
  // Sin fade: el canvas se pinta fuera de pantalla y el cambio debe ser seco
  await loadNoteForPage();
}

function updateDockChrome() {
  const spread = state.spread && !isNarrow();
  const end = spread ? Math.min(state.page + 1, state.pageCount) : state.page;
  $('#page-indicator').textContent =
    spread && end !== state.page ? `${state.page}–${end} de ${state.pageCount}` : `${state.page} de ${state.pageCount}`;
  $('#panel-page').textContent = String(state.page);
  const sp = $('#btn-spread');
  sp.classList.toggle('is-on', spread);
  sp.textContent = spread ? '2 pág' : '1 pág';
  $('#zoom-level').textContent = `${Math.round(state.zoom * 100)}%`;
  $('#btn-panel').classList.toggle('is-on', state.panelOpen);
}

async function persistLastPage() {
  if (!state.currentId) return;
  const book = await idbGet('books', state.currentId);
  if (!book) return;
  book.lastPage = state.page;
  book.updatedAt = Date.now();
  await idbPut('books', book);
}

// Pasar varias páginas seguidas no debe encadenar escrituras en disco
function queuePersistPage() {
  clearTimeout(state.persistTimer);
  state.persistTimer = setTimeout(() => {
    persistLastPage().catch((err) => console.warn('No se pudo guardar la página', err));
  }, 450);
}

async function setZoom(z) {
  state.zoom = Math.min(2.3, Math.max(0.6, Number(z.toFixed(2))));
  savePrefs();
  updateDockChrome();
  await renderPages();
}

function stepZoom(dir) {
  const idx = ZOOM_STEPS.reduce((best, v, i) => (Math.abs(v - state.zoom) < Math.abs(ZOOM_STEPS[best] - state.zoom) ? i : best), 0);
  const next = ZOOM_STEPS[Math.min(ZOOM_STEPS.length - 1, Math.max(0, idx + dir))];
  setZoom(next);
}

async function toggleSpread() {
  if (isNarrow()) return;
  state.spread = !state.spread;
  if (state.spread && state.page % 2 === 0) state.page = Math.max(1, state.page - 1);
  updateDockChrome();
  await renderPages();
}

function showReader(on) {
  const lib = $('#screen-library');
  const reader = $('#screen-reader');
  if (on) {
    lib.hidden = true;
    reader.hidden = false;
    document.body.style.overflow = 'hidden';
  } else {
    reader.hidden = true;
    lib.hidden = false;
    document.body.style.overflow = '';
  }
}

async function backToLibrary() {
  if (state.recording) await stopRec(false);
  clearTimeout(state.persistTimer);
  await persistLastPage();
  setPanel(false);
  state.pdf = null;
  state.epub = null;
  state.currentId = null;
  state.kind = null;
  if (state.objectUrl) {
    URL.revokeObjectURL(state.objectUrl);
    state.objectUrl = null;
  }
  showReader(false);
  await refreshData();
}

/* ---------------- Panel de notas ---------------- */
function setPanel(open) {
  state.panelOpen = open;
  const panel = $('#panel');
  const reader = $('#screen-reader');
  if (!panel) return;
  panel.classList.toggle('is-open', open);
  panel.setAttribute('aria-hidden', open ? 'false' : 'true');
  reader.classList.toggle('has-panel', open);
  updateDockChrome();

  // Con panel abierto en pantalla ancha la página se re-encuadra
  if (state.currentId && window.innerWidth >= 1200) renderPages();
  if (open) loadNoteForPage();
}

async function loadNoteForPage() {
  if (!state.currentId) return;
  const nav = state.navToken;
  const bookId = state.currentId;
  const page = state.page;
  const note = await idbGet('notes', noteKey(bookId, page));
  if (nav !== state.navToken) return;
  $('#note-text').value = note?.text || '';

  const audios = (await idbAllByIndex('audio', 'bookPage', [bookId, page]))
    .sort((a, b) => a.createdAt - b.createdAt);
  const list = $('#audio-list');
  if (!list || nav !== state.navToken) return;
  releaseUrls('noteUrls');

  if (!audios.length) {
    list.innerHTML = '<p class="hint" style="margin:0.5rem 0 0">Sin audios en esta página.</p>';
    return;
  }
  list.innerHTML = audios
    .map(
      (a) => `<div class="audio-item">
        <audio controls preload="metadata" src="${trackUrl(a.blob, 'noteUrls')}"></audio>
        <button type="button" data-del-audio="${a.id}">Eliminar audio</button>
      </div>`
    )
    .join('');
}

async function saveNote() {
  if (!state.currentId) return;
  const text = $('#note-text').value || '';
  const key = noteKey(state.currentId, state.page);
  if (!text.trim()) {
    await idbDelete('notes', key);
  } else {
    await idbPut('notes', { key, bookId: state.currentId, page: state.page, text, updatedAt: Date.now() });
  }
  const btn = $('#btn-save-note');
  btn.textContent = 'Guardado';
  if (window.gsap) gsap.fromTo(btn, { scale: 1 }, { scale: 1.03, duration: 0.18, yoyo: true, repeat: 1 });
  setTimeout(() => { btn.textContent = 'Guardar nota'; }, 1100);
}

async function toggleRec() {
  if (state.recording) {
    await stopRec(true);
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : '';
    const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
    state.chunks = [];
    state.saveRec = false;
    rec.ondataavailable = (e) => { if (e.data.size) state.chunks.push(e.data); };
    rec.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      if (!state.saveRec) return;
      const blob = new Blob(state.chunks, { type: rec.mimeType || 'audio/webm' });
      await idbPut('audio', { id: uid(), bookId: state.currentId, page: state.page, blob, createdAt: Date.now() });
      await loadNoteForPage();
    };
    state.mediaRecorder = rec;
    state.recording = true;
    rec.start();
    $('#btn-rec').classList.add('is-recording');
    $('#rec-status').textContent = 'Grabando…';
    $('#rec-hint').textContent = 'Pulsa otra vez para detener y guardar.';
  } catch {
    alert('No se pudo acceder al micrófono. Revisa los permisos del navegador.');
  }
}

function stopRec(save) {
  return new Promise((resolve) => {
    const rec = state.mediaRecorder;
    if (!rec || rec.state === 'inactive') {
      state.recording = false;
      resolve();
      return;
    }
    state.saveRec = !!save;
    rec.addEventListener('stop', () => {
      state.recording = false;
      state.mediaRecorder = null;
      $('#btn-rec').classList.remove('is-recording');
      $('#rec-status').textContent = save ? 'Audio guardado' : 'Listo para grabar';
      $('#rec-hint').textContent = 'Pulsa y habla. Se guarda en esta página.';
      resolve();
    }, { once: true });
    rec.stop();
  });
}

/* ---------------- Exportar / importar / borrar ---------------- */
function bufToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function base64ToBytes(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function exportProgress() {
  if (!state.currentId) return;
  const book = await idbGet('books', state.currentId);
  const notes = (await idbAll('notes')).filter((n) => n.bookId === state.currentId);
  const audios = (await idbAll('audio')).filter((a) => a.bookId === state.currentId);
  const audioPayload = [];
  for (const a of audios) {
    audioPayload.push({
      id: a.id,
      page: a.page,
      createdAt: a.createdAt,
      type: a.blob.type,
      dataBase64: bufToBase64(await a.blob.arrayBuffer())
    });
  }
  const payload = {
    app: 'nodo-reader',
    version: 2,
    exportedAt: new Date().toISOString(),
    book: { id: book.id, title: book.title, kind: book.kind, lastPage: book.lastPage, pageCount: book.pageCount },
    notes: notes.map(({ page, text, updatedAt }) => ({ page, text, updatedAt })),
    audios: audioPayload
  };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload)], { type: 'application/json' }));
  a.download = `nodo-reader-${book.title.replace(/\s+/g, '-').slice(0, 40)}.json`;
  a.click();
}

async function onImportProgress(e) {
  const file = e.target.files?.[0];
  e.target.value = '';
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (data.app !== 'nodo-reader') throw new Error('Archivo no válido');

    let targetId = state.currentId;
    if (!targetId) {
      const books = await idbAll('books');
      const match =
        books.find((b) => b.id === data.book?.id) ||
        books.find((b) => b.title === data.book?.title) ||
        books.find((b) => b.fileName && b.fileName === data.book?.fileName);
      if (!match) {
        alert('Añade primero el mismo PDF/EPUB a la biblioteca y vuelve a importar.');
        return;
      }
      targetId = match.id;
      match.lastPage = data.book?.lastPage || match.lastPage || 1;
      match.updatedAt = Date.now();
      await idbPut('books', match);
    }

    for (const n of data.notes || []) {
      await idbPut('notes', {
        key: noteKey(targetId, n.page),
        bookId: targetId,
        page: n.page,
        text: n.text || '',
        updatedAt: n.updatedAt || Date.now()
      });
    }
    for (const a of data.audios || []) {
      await idbPut('audio', {
        id: a.id || uid(),
        bookId: targetId,
        page: a.page,
        blob: new Blob([base64ToBytes(a.dataBase64)], { type: a.type || 'audio/webm' }),
        createdAt: a.createdAt || Date.now()
      });
    }
    await refreshData();
    if (state.currentId === targetId) await loadNoteForPage();
    alert('Progreso importado.');
  } catch (err) {
    console.error(err);
    alert('No se pudo importar el progreso.');
  }
}

async function deleteBook(id) {
  const book = state.books.find((b) => b.id === id);
  if (!confirm(`¿Eliminar “${book?.title || 'este libro'}” con sus notas y audios de este dispositivo?`)) return;
  await idbDelete('books', id);
  await idbDelete('files', id);
  for (const n of (await idbAll('notes')).filter((x) => x.bookId === id)) await idbDelete('notes', n.key);
  for (const a of (await idbAll('audio')).filter((x) => x.bookId === id)) await idbDelete('audio', a.id);
  await refreshData();
}

/* ---------------- Ajustes ---------------- */
function setPrefsSheet(open) {
  const sheet = $('#prefs-sheet');
  if (!sheet) return;
  sheet.hidden = !open;
  sheet.setAttribute('aria-hidden', open ? 'false' : 'true');
  if (open && window.gsap) {
    gsap.fromTo('#prefs-sheet .sheet__panel', { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' });
  }
}

/* ---------------- Eventos ---------------- */
function bindUi() {
  $('#file-input').addEventListener('change', onFileChosen);
  $('#btn-import-progress').addEventListener('click', () => $('#import-progress-input').click());
  $('#import-progress-input').addEventListener('change', onImportProgress);

  $$('.side-link[data-pane], #tabbar button[data-pane]').forEach((btn) => {
    btn.addEventListener('click', () => setPane(btn.dataset.pane));
  });
  $('#side-prefs').addEventListener('click', () => setPrefsSheet(true));
  $('#tab-prefs').addEventListener('click', () => setPrefsSheet(true));

  $('#guide-start').addEventListener('click', async () => {
    const sample = state.books.find((b) => b.id === SAMPLE_BOOK.id) || state.books[0];
    if (sample) return openBook(sample.id);
    setPane('library');
    $('#file-input').click();
  });

  $('.main').addEventListener('click', async (e) => {
    if (e.target.closest('[data-welcome-close]')) {
      localStorage.setItem(WELCOME_KEY, 'done');
      return renderWelcome();
    }
    if (e.target.closest('[data-goto-guide]')) return setPane('guia');

    const del = e.target.closest('[data-del]');
    if (del) return deleteBook(del.dataset.del);

    const bookNotes = e.target.closest('[data-book-notes]');
    if (bookNotes) {
      state.notesFilter = bookNotes.dataset.bookNotes;
      renderNotesPane();
      setPane('notes');
      return;
    }

    const goto = e.target.closest('[data-goto]');
    if (goto) {
      const [bookId, page] = goto.dataset.goto.split(':');
      if (state.currentId !== bookId) await openBook(bookId);
      await goPage(Number(page));
      setPanel(true);
      return;
    }

    const open = e.target.closest('[data-open]');
    if (open) openBook(open.dataset.open);
  });

  // El evento error no burbujea: hay que escucharlo en fase de captura
  $('.main').addEventListener('error', onCoverError, true);

  $('#notes-filter').addEventListener('change', (e) => {
    state.notesFilter = e.target.value;
    renderNotesPane();
  });

  $('#btn-back').addEventListener('click', backToLibrary);
  $('#btn-prev').addEventListener('click', () => goPage(state.page - 1));
  $('#btn-next').addEventListener('click', () => goPage(state.page + 1));
  $('#dock-prev').addEventListener('click', () => goPage(state.page - 1));
  $('#dock-next').addEventListener('click', () => goPage(state.page + 1));
  $('#btn-spread').addEventListener('click', toggleSpread);
  $('#zoom-in').addEventListener('click', () => stepZoom(1));
  $('#zoom-out').addEventListener('click', () => stepZoom(-1));
  $('#zoom-level').addEventListener('click', () => setZoom(1));
  $('#btn-panel').addEventListener('click', () => setPanel(!state.panelOpen));
  $('#btn-close-panel').addEventListener('click', () => setPanel(false));
  $('#btn-save-note').addEventListener('click', saveNote);
  $('#btn-rec').addEventListener('click', toggleRec);
  $('#btn-export').addEventListener('click', exportProgress);
  $('#btn-prefs').addEventListener('click', () => setPrefsSheet(true));
  $('#btn-close-prefs').addEventListener('click', () => setPrefsSheet(false));
  $('#prefs-backdrop').addEventListener('click', () => setPrefsSheet(false));
  // Mientras lees: abre el panel de la página actual (antes te sacaba a la biblioteca)
  $('#btn-book-notes').addEventListener('click', () => setPanel(true));

  $('#audio-list').addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-del-audio]');
    if (!btn) return;
    await idbDelete('audio', btn.dataset.delAudio);
    await loadNoteForPage();
  });

  $('#font-seg').addEventListener('click', (e) => {
    const b = e.target.closest('[data-font]');
    if (!b) return;
    prefs.font = b.dataset.font;
    savePrefs();
    applyPrefs();
  });
  $('#theme-seg').addEventListener('click', (e) => {
    const b = e.target.closest('[data-theme]');
    if (!b) return;
    prefs.theme = b.dataset.theme;
    savePrefs();
    applyPrefs();
  });
  $('#paper-seg').addEventListener('click', (e) => {
    const b = e.target.closest('[data-paper]');
    if (!b) return;
    prefs.paper = b.dataset.paper;
    savePrefs();
    applyPrefs();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setPrefsSheet(false);
      if (state.panelOpen) setPanel(false);
      return;
    }
    if ($('#screen-reader').hidden) return;
    const typing = document.activeElement?.tagName === 'TEXTAREA';
    if (typing) return;
    if (e.key === 'ArrowLeft') goPage(state.page - 1);
    if (e.key === 'ArrowRight') goPage(state.page + 1);
    if (e.key === 'n' || e.key === 'N') setPanel(!state.panelOpen);
    if (e.key === '+' || e.key === '=') stepZoom(1);
    if (e.key === '-') stepZoom(-1);
  });

  // Swipe horizontal en el escenario
  let touchX = null;
  let touchY = null;
  const stage = $('#stage');
  stage.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;
    touchX = null;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6) {
      goPage(state.page + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });

  // Al salir de la app el guardado diferido puede no haber saltado todavía
  const flushPage = () => {
    clearTimeout(state.persistTimer);
    persistLastPage().catch(() => {});
  };
  window.addEventListener('pagehide', flushPage);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushPage();
  });

  window.addEventListener('resize', debounce(() => {
    if (!state.currentId) return;
    updateDockChrome();
    renderPages();
  }, 200));
}

boot().catch((err) => {
  console.error(err);
  $('#boot')?.remove();
});
