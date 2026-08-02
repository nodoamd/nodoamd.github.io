/* Entorno by Nodo — progreso local, sin cuentas */
const STORAGE_KEY = 'nodo-entorno-v1';
const ENTER_KEY = 'entorno-in-app';
const GOAL = 20;
const DESKTOP_MQ = '(min-width: 900px)';
const PLACES = [
  { id: 'barcelona', label: 'Barcelona', hint: 'Ciutat Vella · Eixample · parques · frente marítimo' },
  { id: 'hospitalet', label: "L'Hospitalet de Llobregat", hint: 'Calles densas · parques · Collserola a un salto' },
  { id: 'metro', label: 'Área metropolitana', hint: 'Si vives entre medias: mismo atlas piloto' }
];

const GUILD_LABEL = {
  arboles: 'Árbol',
  plantas: 'Planta',
  aves: 'Ave',
  otros: 'Otro'
};

const GUILD_EMOJI = {
  arboles: '🌳',
  plantas: '🌿',
  aves: '🪶',
  otros: '✨'
};

const state = {
  placeId: null,
  postal: '',
  known: {}, // id -> { kinds: ['vi'|'oi'], at: number, photo?, whereNote? }
  guild: 'all',
  screen: 'home',
  detailId: null,
  toastTimer: null,
  query: '',
  atlasQuery: '',
  register: { speciesId: null, photo: null, where: '' },
  pendingScreen: null
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (raw.placeId) state.placeId = raw.placeId;
    if (raw.postal) state.postal = String(raw.postal);
    if (raw.known && typeof raw.known === 'object') state.known = raw.known;
  } catch { /* defaults */ }
}

function save() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      placeId: state.placeId,
      postal: state.postal,
      known: state.known,
      savedAt: Date.now()
    })
  );
}

function knownCount() {
  return Object.keys(state.known).length;
}

function isKnown(id) {
  return Boolean(state.known[id]);
}

function placeLabel() {
  return PLACES.find((p) => p.id === state.placeId)?.label || 'Tu zona';
}

function speciesById(id) {
  return window.ENTORNO_SPECIES.find((s) => s.id === id);
}

function todaySpecies() {
  const list = window.ENTORNO_SPECIES;
  const day = Math.floor(Date.now() / 86400000);
  return list[day % list.length];
}

function praise(n) {
  if (n <= 0) return 'El barrio todavía es anónimo. Vamos a por el primero.';
  if (n < 5) return 'Buen arranque. Ya no miras igual la acera.';
  if (n < 10) return 'Vas cogiendo ojo. El parque te habla más claro.';
  if (n < GOAL) return `Quedan ${GOAL - n}. Cuando cierres 20, el flex es real.`;
  if (n === GOAL) return '20. Objetivo cumplido. Ahora el resto es vicio bueno.';
  return `${n} seres. Nivel vecindario desbloqueado.`;
}

function levelLabel(n) {
  if (n <= 0) return 'Nivel 1 · Mirando la acera';
  if (n < 5) return 'Nivel 2 · Ojo de barrio';
  if (n < 10) return 'Nivel 3 · Oreja afinada';
  if (n < GOAL) return 'Nivel 4 · Explorador urbano';
  return 'Nivel 5 · Vecino que nombra';
}

function matchesQuery(s, q) {
  if (!q) return true;
  const hay = `${s.name} ${s.alias} ${s.latin} ${s.guild}`.toLowerCase();
  return hay.includes(q.trim().toLowerCase());
}

function markLabels(kinds = []) {
  const map = { vi: 'Lo vi', oi: 'Lo oí' };
  return kinds.map((k) => map[k] || k).join(' · ') || 'Marcado';
}

/* ---------- screens ---------- */
function wantsAppDirect() {
  const q = new URLSearchParams(location.search);
  if (q.get('app') === '1') return true;
  if (sessionStorage.getItem(ENTER_KEY) === '1') return true;
  return !window.matchMedia(DESKTOP_MQ).matches;
}

function showLanding() {
  document.documentElement.classList.remove('show-app');
  document.documentElement.classList.add('show-landing');
  document.body.classList.remove('is-app');
  $('#landing')?.classList.remove('hidden');
  $('#app-root')?.classList.add('hidden');
  $('#boot')?.classList.add('hidden');
}

function enterApp({ skipBoot = false, screen = null } = {}) {
  sessionStorage.setItem(ENTER_KEY, '1');
  document.documentElement.classList.remove('show-landing');
  document.documentElement.classList.add('show-app');
  document.body.classList.add('is-app');
  $('#landing')?.classList.add('hidden');
  $('#app-root')?.classList.remove('hidden');
  if (screen) state.pendingScreen = screen;
  if (skipBoot) {
    $('#boot')?.classList.add('hidden');
    const next = state.pendingScreen || 'home';
    state.pendingScreen = null;
    if (!state.placeId) showOnboard();
    else showApp(next);
    return;
  }
  showBootThen();
}

function showBootThen() {
  const boot = $('#boot');
  boot?.classList.remove('hidden');
  boot?.setAttribute('aria-hidden', 'false');
  setTimeout(() => {
    boot?.classList.add('hidden');
    boot?.setAttribute('aria-hidden', 'true');
    const next = state.pendingScreen || 'home';
    state.pendingScreen = null;
    if (!state.placeId) showOnboard();
    else showApp(next);
  }, 1100);
}

function showOnboard() {
  $('#screen-onboard').classList.remove('hidden');
  $('#screen-home').classList.add('hidden');
  $('#screen-atlas').classList.add('hidden');
  $('#screen-log').classList.add('hidden');
  $('#screen-profile')?.classList.add('hidden');
  $('#tabbar').classList.add('hidden');
  renderPlaces();
}

function showApp(screen) {
  state.screen = screen;
  $('#screen-onboard').classList.add('hidden');
  $('#screen-home').classList.toggle('hidden', screen !== 'home');
  $('#screen-atlas').classList.toggle('hidden', screen !== 'atlas');
  $('#screen-log').classList.toggle('hidden', screen !== 'log');
  $('#screen-profile')?.classList.toggle('hidden', screen !== 'profile');
  $('#tabbar').classList.remove('hidden');
  $$('#tabbar [data-screen]').forEach((b) => b.classList.toggle('is-on', b.dataset.screen === screen));
  if (screen === 'home') renderHome();
  if (screen === 'atlas') renderAtlas();
  if (screen === 'log') renderLog();
  if (screen === 'profile') renderProfile();
}

function renderPlaces() {
  const host = $('#place-list');
  host.innerHTML = PLACES.map(
    (p) => `<button type="button" class="place${state.placeId === p.id ? ' is-on' : ''}" data-place="${p.id}">
      <strong>${p.label}</strong>
      <span>${p.hint}</span>
    </button>`
  ).join('');
  $('#postal').value = state.postal || '';
}

function renderHome() {
  const n = knownCount();
  const place = state.postal ? `${placeLabel()} · ${state.postal}` : placeLabel();
  const placeLabelEl = $('#home-place-label');
  if (placeLabelEl) placeLabelEl.textContent = place;
  $('#home-hi').textContent = n > 0 ? '¡Hola de nuevo!' : '¡Hola, aprendiz!';
  $('#home-sub').textContent = '¿Qué quieres explorar hoy?';
  $('#progress-level').textContent = levelLabel(n);
  $('#progress-xp').textContent = `${n} / ${GOAL}`;
  $('#hero-bar').style.width = `${Math.min(100, (n / GOAL) * 100)}%`;
  $('#hero-lead').textContent = praise(n);

  const today = todaySpecies();
  $('#today-card').innerHTML = `
    ${today.image ? `<img class="feature__img" src="${today.image}" alt="" loading="lazy" decoding="async">` : ''}
    <div class="feature__veil"></div>
    <div class="feature__body">
      <p class="feature__kicker">Hoy en tu zona</p>
      <h3>${today.name}</h3>
      <p>${today.hook}</p>
    </div>
    <span class="feature__go" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    </span>`;
  $('#today-card').onclick = () => openDetail(today.id);

  const q = state.query;
  let list = window.ENTORNO_SPECIES.filter((s) => matchesQuery(s, q));
  list = [...list].sort((a, b) => Number(isKnown(a.id)) - Number(isKnown(b.id)));
  const rail = list.slice(0, 12);
  $('#home-rail').innerHTML = rail
    .map(
      (s) => `<button type="button" class="rail-card" data-id="${s.id}">
        <div class="rail-card__photo">${s.image ? `<img src="${s.image}" alt="" loading="lazy" decoding="async">` : ''}</div>
        <div class="rail-card__body">
          <h4>${s.name}</h4>
          <p class="rail-card__latin">${s.latin}</p>
          <p class="rail-card__guild">${GUILD_LABEL[s.guild] || s.guild}</p>
        </div>
      </button>`
    )
    .join('') || `<p class="lede">Nada con esa búsqueda. Prueba “mirlo” o “plátano”.</p>`;
}

function renderProfile() {
  const n = knownCount();
  $('#profile-level').textContent = levelLabel(n);
  $('#profile-xp').textContent = `${n} / ${GOAL}`;
  $('#profile-bar').style.width = `${Math.min(100, (n / GOAL) * 100)}%`;
  $('#profile-lead').textContent = praise(n);
  $('#profile-place').textContent = state.postal ? `${placeLabel()} · ${state.postal}` : placeLabel();
}

function renderAtlas() {
  const filters = $('#filters');
  filters.innerHTML = window.ENTORNO_GUILDS.map(
    (g) => `<button type="button" class="chip${state.guild === g.id ? ' is-on' : ''}" data-guild="${g.id}">${g.label}</button>`
  ).join('');

  let list =
    state.guild === 'all'
      ? window.ENTORNO_SPECIES
      : window.ENTORNO_SPECIES.filter((s) => s.guild === state.guild);
  list = list.filter((s) => matchesQuery(s, state.atlasQuery));

  const known = list.filter((s) => isKnown(s.id)).length;
  $('#atlas-count').textContent = `${known}/${list.length}`;

  $('#species-grid').innerHTML = list
    .map((s) => {
      const on = isKnown(s.id);
      const photo = s.image
        ? `<div class="being__photo"><img src="${s.image}" alt="" loading="lazy" decoding="async"></div>`
        : `<div class="being__photo"></div>`;
      return `<button type="button" class="being${on ? ' is-known' : ''}" data-id="${s.id}">
        ${photo}
        <div class="being__body">
          <span class="being__guild">${GUILD_LABEL[s.guild] || s.guild}</span>
          <h4>${s.name}</h4>
          <p class="being__alias">${s.alias}</p>
          <span class="being__status">${on ? markLabels(state.known[s.id].kinds) : 'Por conocer'}</span>
        </div>
      </button>`;
    })
    .join('') || `<p class="empty">Sin resultados en el atlas.</p>`;
}

function renderLog() {
  const ids = Object.keys(state.known).sort((a, b) => (state.known[b].at || 0) - (state.known[a].at || 0));
  const host = $('#log-list');
  if (!ids.length) {
    host.innerHTML = `<div class="empty">Aún vacío — y no pasa nada.<br>Pulsa la cámara, sube una foto y elige qué viste.</div>`;
    return;
  }
  host.innerHTML = ids
    .map((id) => {
      const s = speciesById(id);
      if (!s) return '';
      const rec = state.known[id];
      const when = rec.at ? new Date(rec.at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : '';
      const whereBit = rec.whereNote ? ` · ${rec.whereNote}` : '';
      const thumb = rec.photo
        ? `<img src="${rec.photo}" alt="" style="width:52px;height:52px;border-radius:12px;object-fit:cover">`
        : s.image
          ? `<img src="${s.image}" alt="" style="width:52px;height:52px;border-radius:12px;object-fit:cover;opacity:.85">`
          : `<span>${GUILD_EMOJI[s.guild] || ''}</span>`;
      return `<button type="button" class="log-item" data-id="${id}">
        <div>
          <strong>${s.name}</strong>
          <span>${markLabels(rec.kinds)}${when ? ` · ${when}` : ''}${rec.photo ? ' · con foto' : ''}${whereBit}</span>
        </div>
        ${thumb}
      </button>`;
    })
    .join('');
}

/* ---------- detail ---------- */
function openDetail(id) {
  const s = speciesById(id);
  if (!s) return;
  state.detailId = id;
  const sheet = $('#detail');
  sheet.classList.remove('hidden');
  sheet.setAttribute('aria-hidden', 'false');
  $('#detail-guild').textContent = GUILD_LABEL[s.guild] || s.guild;
  $('#detail-title').textContent = s.name;
  $('#detail-alias').textContent = s.alias;
  $('#detail-latin').textContent = s.latin;
  const photoWrap = $('#detail-photo-wrap');
  const photo = $('#detail-photo');
  const credit = $('#detail-credit');
  if (s.image) {
    photo.src = s.image;
    photo.alt = s.name;
    photoWrap.classList.remove('hidden');
    const meta = window.ENTORNO_CREDITS?.[s.id];
    if (meta?.commons) {
      const who = meta.artist ? ` · ${meta.artist}` : '';
      const lic = meta.license ? ` · ${meta.license}` : '';
      credit.innerHTML = meta.page
        ? `<a href="${meta.page}" target="_blank" rel="noopener">Wikimedia Commons</a>${lic}${who}`
        : `Wikimedia Commons${lic}${who}`;
      credit.classList.remove('hidden');
    } else {
      credit.textContent = 'Wikimedia Commons';
      credit.classList.remove('hidden');
    }
  } else {
    photo.removeAttribute('src');
    photoWrap.classList.add('hidden');
    credit.classList.add('hidden');
  }
  $('#detail-hook').textContent = s.hook;
  $('#detail-where').textContent = s.where;
  $('#detail-season').textContent = s.season;
  $('#detail-tip').textContent = s.tip;
  const local = $('#detail-local');
  if (s.localNote) {
    local.textContent = s.localNote;
    local.classList.remove('hidden');
  } else {
    local.textContent = '';
    local.classList.add('hidden');
  }
  $('#detail-signals').innerHTML = s.signals.map((x) => `<li>${x}</li>`).join('');
  $('#detail-toast').textContent = '';

  const current = state.known[id]?.kinds || [];
  const kinds = s.markKinds?.length ? s.markKinds : ['vi'];
  $('#detail-marks').innerHTML = kinds
    .map((k) => {
      const label = k === 'oi' ? 'Lo oí' : 'Lo vi';
      return `<button type="button" class="mark-btn${current.includes(k) ? ' is-on' : ''}" data-mark="${k}">${label}</button>`;
    })
    .concat(`<button type="button" class="mark-btn" data-mark="clear">Quitar marca</button>`)
    .join('');

  renderSightingBox(id);
}

function renderSightingBox(id) {
  const box = $('#sighting-box');
  const rec = state.known[id];
  if (!rec) {
    box.classList.add('hidden');
    return;
  }
  box.classList.remove('hidden');
  const wrap = $('#sighting-preview-wrap');
  const img = $('#sighting-preview');
  if (rec.photo) {
    img.src = rec.photo;
    wrap.classList.remove('hidden');
  } else {
    img.removeAttribute('src');
    wrap.classList.add('hidden');
  }
}

function closeDetail() {
  state.detailId = null;
  const sheet = $('#detail');
  sheet.classList.add('hidden');
  sheet.setAttribute('aria-hidden', 'true');
  if (state.screen === 'home') renderHome();
  if (state.screen === 'atlas') renderAtlas();
  if (state.screen === 'log') renderLog();
  if (state.screen === 'profile') renderProfile();
}

/* ---------- register (camera → cuaderno) ---------- */
function openRegister() {
  state.register = { speciesId: null, photo: null, where: '' };
  const sheet = $('#register');
  sheet.classList.remove('hidden');
  sheet.setAttribute('aria-hidden', 'false');
  $('#register-search').value = '';
  $('#register-where').value = '';
  $('#register-preview').classList.add('hidden');
  $('#register-preview').removeAttribute('src');
  $('#register-photo-hint').classList.remove('hidden');
  $('#register-picked').classList.add('hidden');
  $('#register-picked').textContent = '';
  $('#register-save').disabled = true;
  renderRegisterPicks('');
}

function closeRegister() {
  $('#register').classList.add('hidden');
  $('#register').setAttribute('aria-hidden', 'true');
}

function renderRegisterPicks(q) {
  const host = $('#register-picks');
  if (state.register.speciesId) {
    host.innerHTML = '';
    return;
  }
  const list = window.ENTORNO_SPECIES.filter((s) => matchesQuery(s, q)).slice(0, 8);
  host.innerHTML = list
    .map(
      (s) => `<button type="button" class="reg-pick" data-pick="${s.id}">
        ${s.image ? `<img src="${s.image}" alt="">` : '<span></span>'}
        <div><strong>${s.name}</strong><span>${s.latin}</span></div>
      </button>`
    )
    .join('') || `<p class="lede">Nada con esa búsqueda.</p>`;
}

function pickRegisterSpecies(id) {
  const s = speciesById(id);
  if (!s) return;
  state.register.speciesId = id;
  $('#register-picked').textContent = `Elegido: ${s.name}`;
  $('#register-picked').classList.remove('hidden');
  $('#register-search').value = s.name;
  $('#register-picks').innerHTML = '';
  $('#register-save').disabled = false;
}

async function attachRegisterPhoto(file) {
  if (!file) return;
  try {
    const dataUrl = await compressImage(file);
    state.register.photo = dataUrl;
    const img = $('#register-preview');
    img.src = dataUrl;
    img.classList.remove('hidden');
    $('#register-photo-hint').classList.add('hidden');
  } catch {
    alert('No pude leer esa foto. Prueba con otra.');
  }
}

function saveRegister() {
  const id = state.register.speciesId;
  if (!id) return;
  const hadPhoto = Boolean(state.register.photo);
  const prev = state.known[id] || { kinds: [] };
  const kinds = new Set(prev.kinds || []);
  kinds.add('vi');
  state.known[id] = {
    kinds: [...kinds],
    at: Date.now(),
    photo: state.register.photo || prev.photo || null,
    whereNote: (state.register.where || prev.whereNote || '').trim()
  };
  save();
  closeRegister();
  showApp('log');
  openDetail(id);
  flash(hadPhoto ? 'Encuentro guardado en el cuaderno.' : 'Marcado. Si quieres, súbele foto después.');
}

function toggleMark(kind) {
  const id = state.detailId;
  if (!id) return;
  if (kind === 'clear') {
    delete state.known[id];
    save();
    openDetail(id);
    flash('Sin marca. Cuando vuelva a cruzarse, aquí estaremos.');
    return;
  }
  const prev = state.known[id]?.kinds || [];
  const photo = state.known[id]?.photo || null;
  const whereNote = state.known[id]?.whereNote || '';
  const set = new Set(prev);
  if (set.has(kind)) set.delete(kind);
  else set.add(kind);
  if (!set.size) {
    delete state.known[id];
    save();
    openDetail(id);
    flash('Ok, lo dejamos para otro paseo.');
    return;
  }
  const wasKnown = Boolean(state.known[id]);
  const first = !wasKnown;
  state.known[id] = { kinds: [...set], at: Date.now(), photo, whereNote };
  save();
  const n = knownCount();
  openDetail(id);
  if (first && n === GOAL) flash('¡Ostras! 20. El barrio ya no es anónimo.');
  else if (first && kind === 'vi') flash('¡Ostras! Lo viste. ¿Le pones cara con una foto?');
  else if (first) flash('¡Ostras! Anotado al oído. Buen radar.');
  else flash('Actualizado.');
}

function flash(msg) {
  const el = $('#detail-toast');
  el.textContent = msg;
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => {
    if (el.textContent === msg) el.textContent = '';
  }, 3800);
}

function compressImage(file, maxSide = 960, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No pude leer la imagen'));
    };
    img.src = url;
  });
}

async function attachSightingPhoto(file) {
  const id = state.detailId;
  if (!id || !state.known[id] || !file) return;
  try {
    const dataUrl = await compressImage(file);
    state.known[id] = { ...state.known[id], photo: dataUrl, at: Date.now() };
    save();
    renderSightingBox(id);
    flash('Foto guardada en tu cuaderno. Ahora puedes contarlo.');
  } catch {
    flash('No pude guardar esa foto. Prueba con otra.');
  }
}

function removeSightingPhoto() {
  const id = state.detailId;
  if (!id || !state.known[id]) return;
  const { photo, ...rest } = state.known[id];
  state.known[id] = rest;
  save();
  renderSightingBox(id);
  flash('Foto quitada.');
}

function loadImg(src) {
  return new Promise((resolve, reject) => {
    if (!src) return reject(new Error('sin src'));
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

async function drawTellCard(id) {
  const s = speciesById(id);
  const rec = state.known[id];
  if (!s || !rec) return null;
  const canvas = $('#tell-canvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#2f9e6a');
  g.addColorStop(0.45, '#4f35c1');
  g.addColorStop(1, '#1a1050');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = 'rgba(255,255,255,0.14)';
  roundRect(ctx, 64, 72, W - 128, H - 160, 48);
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = '700 36px Poppins, system-ui, sans-serif';
  ctx.fillText('ENTORNO · NODO', 108, 150);

  ctx.fillStyle = '#fff';
  ctx.font = '700 72px Poppins, system-ui, sans-serif';
  const verb = rec.kinds?.includes('oi') && !rec.kinds?.includes('vi') ? 'He oído' : 'He visto';
  ctx.fillText(`${verb} un`, 108, 250);

  ctx.font = '700 86px Poppins, system-ui, sans-serif';
  const name = s.name;
  // simple wrap
  const maxW = W - 220;
  if (ctx.measureText(name).width > maxW) {
    ctx.font = '700 64px Poppins, system-ui, sans-serif';
  }
  ctx.fillText(name, 108, 350);

  ctx.font = '600 40px DM Sans, system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.88)';
  ctx.fillText(`en ${placeLabel()}`, 108, 420);

  const photoSrc = rec.photo || s.image;
  const frameX = 108;
  const frameY = 470;
  const frameW = W - 216;
  const frameH = 560;
  roundRect(ctx, frameX, frameY, frameW, frameH, 36);
  ctx.save();
  ctx.clip();
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(frameX, frameY, frameW, frameH);
  try {
    const img = await loadImg(photoSrc);
    const scale = Math.max(frameW / img.width, frameH / img.height);
    const iw = img.width * scale;
    const ih = img.height * scale;
    ctx.drawImage(img, frameX + (frameW - iw) / 2, frameY + (frameH - ih) / 2, iw, ih);
  } catch {
    ctx.fillStyle = '#fff';
    ctx.font = '600 42px DM Sans, system-ui, sans-serif';
    ctx.fillText(s.alias || s.name, frameX + 40, frameY + frameH / 2);
  }
  ctx.restore();

  const n = knownCount();
  ctx.fillStyle = '#fff';
  ctx.font = '700 44px Poppins, system-ui, sans-serif';
  ctx.fillText(`${n} de ${GOAL} seres de mi entorno`, 108, 1120);
  ctx.font = '600 36px DM Sans, system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.82)';
  ctx.fillText('¿Y tú?  #EntornoNodo', 108, 1185);

  return canvas;
}

async function openTell() {
  const id = state.detailId;
  if (!id || !state.known[id]) {
    flash('Marca Lo vi o Lo oí antes de contarlo.');
    return;
  }
  $('#tell-sheet').classList.remove('hidden');
  $('#tell-sheet').setAttribute('aria-hidden', 'false');
  await drawTellCard(id);
}

function closeTell() {
  $('#tell-sheet').classList.add('hidden');
  $('#tell-sheet').setAttribute('aria-hidden', 'true');
}

function tellText(id) {
  const s = speciesById(id);
  const rec = state.known[id];
  if (!s || !rec) return '';
  const verb = rec.kinds?.includes('oi') && !rec.kinds?.includes('vi') ? 'He oído' : 'He visto';
  return `${verb} un ${s.name} en ${placeLabel()}.\nSé ${knownCount()} de ${GOAL} seres de mi entorno. ¿Y tú?\n#EntornoNodo — Entorno by Nodo`;
}

async function shareTell() {
  const id = state.detailId;
  const canvas = await drawTellCard(id);
  if (!canvas) return;
  const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', 0.92));
  const file = new File([blob], `entorno-${id}.jpg`, { type: 'image/jpeg' });
  const text = tellText(id);
  try {
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], text, title: 'Entorno' });
      return;
    }
  } catch {
    /* user cancel or unsupported */
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = file.name;
  a.click();
  URL.revokeObjectURL(a.href);
  try {
    await navigator.clipboard.writeText(text);
  } catch { /* ok */ }
}

function downloadTell() {
  const canvas = $('#tell-canvas');
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/jpeg', 0.92);
  a.download = `entorno-${state.detailId || 'encuentro'}.jpg`;
  a.click();
}

async function copyTellText() {
  const text = tellText(state.detailId);
  try {
    await navigator.clipboard.writeText(text);
    $('#tell-copy').textContent = 'Copiado';
    setTimeout(() => {
      $('#tell-copy').textContent = 'Copiar texto';
    }, 1400);
  } catch {
    prompt('Copia esto:', text);
  }
}

/* ---------- share / export ---------- */
async function copyChallenge() {
  const n = knownCount();
  const text =
    n >= GOAL
      ? `Sé ${n} seres vivos de mi entorno (${placeLabel()}). ¿Y tú?\n#EntornoNodo — Entorno by Nodo`
      : `Voy ${n} de ${GOAL} seres de mi entorno (${placeLabel()}). El reto: nombrar 20.\n#EntornoNodo — Entorno by Nodo`;
  try {
    await navigator.clipboard.writeText(text);
    $('#btn-share').textContent = 'Copiado';
    setTimeout(() => {
      $('#btn-share').textContent = 'Copiar el reto';
    }, 1600);
  } catch {
    prompt('Copia el reto:', text);
  }
}

function exportProgress() {
  const payload = {
    app: 'Entorno',
    version: 1,
    placeId: state.placeId,
    postal: state.postal,
    known: state.known,
    exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `entorno-progreso-${state.placeId || 'zona'}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

async function importProgress(file) {
  try {
    const data = JSON.parse(await file.text());
    if (!data || typeof data.known !== 'object') throw new Error('formato');
    state.known = data.known || {};
    if (data.placeId) state.placeId = data.placeId;
    if (data.postal) state.postal = String(data.postal);
    save();
    showApp(state.screen || 'home');
    alert('Progreso importado. Bienvenido de nuevo al barrio.');
  } catch {
    alert('No pude leer ese archivo. ¿Es un export de Entorno?');
  }
}

/* ---------- bind ---------- */
function bind() {
  $$('[data-enter-app]').forEach((b) => {
    b.addEventListener('click', () => enterApp({ screen: b.dataset.enterScreen || null }));
  });

  $$('[data-screen-jump]').forEach((b) => {
    b.addEventListener('click', () => showApp(b.dataset.screenJump));
  });

  $('#place-list').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-place]');
    if (!btn) return;
    state.placeId = btn.dataset.place;
    renderPlaces();
  });

  $('#btn-start').addEventListener('click', () => {
    if (!state.placeId) state.placeId = 'barcelona';
    state.postal = ($('#postal').value || '').trim();
    save();
    showApp('home');
  });

  $('#btn-place').addEventListener('click', showOnboard);
  $('#btn-place-profile')?.addEventListener('click', showOnboard);

  $('#filters').addEventListener('click', (e) => {
    const chip = e.target.closest('[data-guild]');
    if (!chip) return;
    state.guild = chip.dataset.guild;
    renderAtlas();
  });

  $('#species-grid').addEventListener('click', (e) => {
    const card = e.target.closest('[data-id]');
    if (card) openDetail(card.dataset.id);
  });

  $('#log-list').addEventListener('click', (e) => {
    const item = e.target.closest('[data-id]');
    if (item) openDetail(item.dataset.id);
  });

  $('#detail-close').addEventListener('click', closeDetail);
  $('#detail').addEventListener('click', (e) => {
    if (e.target.id === 'detail') closeDetail();
  });
  $('#detail-marks').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-mark]');
    if (btn) toggleMark(btn.dataset.mark);
  });

  $('#sighting-file').addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) attachSightingPhoto(file);
  });
  $('#sighting-remove').addEventListener('click', removeSightingPhoto);
  $('#btn-tell').addEventListener('click', openTell);
  $('#tell-close').addEventListener('click', closeTell);
  $('#tell-sheet').addEventListener('click', (e) => {
    if (e.target.id === 'tell-sheet') closeTell();
  });
  $('#tell-share').addEventListener('click', shareTell);
  $('#tell-download').addEventListener('click', downloadTell);
  $('#tell-copy').addEventListener('click', copyTellText);

  $$('#tabbar [data-screen]').forEach((b) => {
    b.addEventListener('click', () => showApp(b.dataset.screen));
  });

  $('#btn-register').addEventListener('click', openRegister);
  $('#btn-log-add')?.addEventListener('click', openRegister);
  $('#register-close').addEventListener('click', closeRegister);
  $('#register').addEventListener('click', (e) => {
    if (e.target.id === 'register') closeRegister();
  });
  $('#register-file').addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) attachRegisterPhoto(file);
  });
  $('#register-search').addEventListener('input', () => {
    state.register.speciesId = null;
    $('#register-picked').classList.add('hidden');
    $('#register-save').disabled = true;
    renderRegisterPicks($('#register-search').value || '');
  });
  $('#register-picks').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-pick]');
    if (btn) pickRegisterSpecies(btn.dataset.pick);
  });
  $('#register-where').addEventListener('input', () => {
    state.register.where = $('#register-where').value || '';
  });
  $('#register-save').addEventListener('click', saveRegister);

  $$('[data-go-atlas]').forEach((b) => {
    b.addEventListener('click', () => showApp('atlas'));
  });

  $('#home-rail').addEventListener('click', (e) => {
    const card = e.target.closest('[data-id]');
    if (card) openDetail(card.dataset.id);
  });

  const onSearch = (el, key) => {
    el.addEventListener('input', () => {
      state[key] = el.value || '';
      if (key === 'query') renderHome();
      else renderAtlas();
    });
  };
  onSearch($('#search-input'), 'query');
  onSearch($('#atlas-search'), 'atlasQuery');

  $('#btn-share').addEventListener('click', copyChallenge);
  $('#btn-export').addEventListener('click', exportProgress);
  $('#import-file').addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) importProgress(file);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!$('#tell-sheet').classList.contains('hidden')) return closeTell();
    if (!$('#register').classList.contains('hidden')) return closeRegister();
    if (!$('#detail').classList.contains('hidden')) closeDetail();
  });

  window.matchMedia(DESKTOP_MQ).addEventListener('change', (e) => {
    if (e.matches && sessionStorage.getItem(ENTER_KEY) !== '1') {
      showLanding();
    } else if (!e.matches && $('#app-root').classList.contains('hidden')) {
      enterApp({ skipBoot: Boolean(state.placeId) });
    }
  });
}

function hydrateLanding() {
  const total = window.ENTORNO_SPECIES?.length || 29;
  const unknown = Math.max(0, total - knownCount());
  const nearEl = $('#land-near-count');
  const speciesEl = $('#land-stat-species');
  if (nearEl) nearEl.textContent = String(unknown || total);
  if (speciesEl) speciesEl.textContent = String(total);
}

load();
bind();
hydrateLanding();
if (wantsAppDirect()) enterApp({ skipBoot: false });
else showLanding();
