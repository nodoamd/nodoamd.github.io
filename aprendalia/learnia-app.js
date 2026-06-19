/* Learnia — progreso local, sin servidor */
(function () {
  const STORAGE_KEY = 'learnia-progress-v1';
  const PREFS_KEY = 'learnia-prefs-v1';
  const TAB_SCREENS = ['home', 'explore', 'routes', 'profile'];
  const DETAIL_SCREENS = ['topic', 'journey-stats', 'journey', 'lesson'];
  const FONT_MIN = 0.85;
  const FONT_MAX = 1.35;
  const FONT_STEP = 0.05;

  let state = defaultState();
  let prefs = defaultPrefs();
  let lastTab = 'home';
  let currentTopicId = null;
  let currentLessonId = null;
  let lessonStartedAt = null;
  let quizAnswered = false;
  let currentQuizIndex = 0;
  let quizCorrectSet = new Set();
  let quizPickedMap = new Map();
  let quizReviewMode = false;
  let quizAwaitingNext = false;
  let speechSpeaking = false;
  let sheetPrimaryHandler = null;
  let homeSearchQuery = '';
  let exploreFilter = 'all';
  let exploreSearchQuery = '';

  const SPEECH_RATES = [0.78, 0.92, 1.08];

  const EXPLORE_ROUTES = [
    { id: 'cultura-espanola', title: 'Cultura Española', tags: ['historia', 'arte'], topics: 6, level: 'intermedio', hero: true, available: true },
    {
      id: 'filosofia',
      title: 'Filosofía Moderna',
      tags: ['filosofia'],
      topics: 8,
      level: 'avanzado',
      image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988a5?q=80&w=500&auto=format&fit=crop',
      available: false
    },
    {
      id: 'arte-universal',
      title: 'Historia del Arte Universal',
      tags: ['arte'],
      topics: 12,
      level: 'intermedio',
      image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=500&auto=format&fit=crop',
      available: false,
      locked: true
    },
    {
      id: 'mitologia',
      title: 'Mitología Griega',
      tags: ['historia'],
      topics: 10,
      level: 'inicial',
      image: 'https://images.unsplash.com/photo-1564399580075-5dfe19c205f3?q=80&w=500&auto=format&fit=crop',
      available: false,
      badge: 'Próximamente'
    },
    {
      id: 'ciencia',
      title: 'Ciencia y Tecnología',
      tags: ['ciencia'],
      topics: 9,
      level: 'avanzado',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=500&auto=format&fit=crop',
      available: false
    }
  ];

  const allLessons = () =>
    RUTA_ESPAÑOLA.topics.flatMap((t) => t.lessons.map((l) => ({ ...l, topicId: t.id })));

  const totalLessons = () => allLessons().length;

  function defaultPrefs() {
    return {
      version: 2,
      theme: 'learnia',
      fontScale: 1,
      focusMode: false,
      speechRate: 0.92,
      hints: { fontSize: false }
    };
  }

  function loadPrefs() {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (!raw) return defaultPrefs();
      const parsed = JSON.parse(raw);
      if (!parsed) return defaultPrefs();
      const theme = ['learnia', 'dark', 'classic'].includes(parsed.theme) ? parsed.theme : 'learnia';
      const fontScale = Math.min(FONT_MAX, Math.max(FONT_MIN, Number(parsed.fontScale) || 1));
      const speechRate = SPEECH_RATES.reduce(
        (best, r) => (Math.abs(r - (Number(parsed.speechRate) || 0.92)) < Math.abs(best - (Number(parsed.speechRate) || 0.92)) ? r : best),
        0.92
      );
      return {
        ...defaultPrefs(),
        theme,
        fontScale,
        speechRate,
        focusMode: parsed.focusMode === true,
        hints: { ...defaultPrefs().hints, ...(parsed.hints || {}) }
      };
    } catch {
      return defaultPrefs();
    }
  }

  function savePrefs() {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    applyPrefs();
  }

  function applyPrefs() {
    document.documentElement.setAttribute('data-theme', prefs.theme);
    document.documentElement.style.setProperty('--font-scale', String(prefs.fontScale));
    document.body.classList.toggle('focus-mode', !!prefs.focusMode);
    document.querySelectorAll('[data-theme-pick]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.themePick === prefs.theme);
    });
    document.querySelectorAll('[data-speech-rate]').forEach((btn) => {
      btn.classList.toggle('active', Number(btn.dataset.speechRate) === prefs.speechRate);
    });
    const focusEl = document.getElementById('pref-focus-mode');
    if (focusEl) focusEl.checked = !!prefs.focusMode;
    updateFontControls();
  }

  window.disableFocusMode = function () {
    prefs.focusMode = false;
    savePrefs();
    renderAll();
    toast('Modo foco desactivado');
  };

  window.togglePref = function (key, value) {
    if (!(key in prefs)) return;
    prefs[key] = !!value;
    savePrefs();
    if (key === 'focusMode') renderAll();
    toast(value ? 'Modo enfoque activado' : 'Progreso visible de nuevo');
  };

  window.setSpeechRate = function (rate) {
    const n = Number(rate);
    if (!SPEECH_RATES.includes(n)) return;
    prefs.speechRate = n;
    savePrefs();
  };

  function fontScaleLabel(scale) {
    if (scale <= 0.9) return 'Texto pequeño';
    if (scale >= 1.2) return 'Texto grande';
    return 'Tamaño normal';
  }

  function updateFontControls() {
    const dec = document.getElementById('font-dec');
    const inc = document.getElementById('font-inc');
    const decS = document.getElementById('font-dec-settings');
    const incS = document.getElementById('font-inc-settings');
    [dec, decS].forEach((b) => {
      if (b) b.disabled = prefs.fontScale <= FONT_MIN + 0.001;
    });
    [inc, incS].forEach((b) => {
      if (b) b.disabled = prefs.fontScale >= FONT_MAX - 0.001;
    });
    const label = document.getElementById('font-scale-label');
    if (label) label.textContent = fontScaleLabel(prefs.fontScale);
  }

  window.setTheme = function (theme) {
    if (!['learnia', 'dark', 'classic'].includes(theme)) return;
    prefs.theme = theme;
    savePrefs();
    toast(theme === 'classic' ? 'Tema cartográfico activado' : theme === 'dark' ? 'Modo oscuro activado' : 'Tema Learnia activado');
  };

  window.changeFontScale = function (delta) {
    const next = Math.round((prefs.fontScale + delta * FONT_STEP) * 100) / 100;
    prefs.fontScale = Math.min(FONT_MAX, Math.max(FONT_MIN, next));
    if (!prefs.hints.fontSize) {
      prefs.hints.fontSize = true;
    }
    savePrefs();
  };

  window.dismissFontHint = function () {
    prefs.hints.fontSize = true;
    savePrefs();
    const hint = document.getElementById('font-hint');
    if (hint) hint.remove();
  };

  function getLessonQuestions(lesson) {
    if (!lesson) return [];
    if (lesson.questions && lesson.questions.length) return lesson.questions;
    if (lesson.quiz) return [lesson.quiz];
    return [];
  }

  function buildLessonSpeech(lesson) {
    const parts = [lesson.title];
    lesson.blocks.forEach((b) => parts.push(b.text));
    getLessonQuestions(lesson).forEach((q, n) => {
      parts.push('Pregunta ' + (n + 1) + '. ' + q.question);
      q.options.forEach((opt, i) => parts.push('Opción ' + (i + 1) + '. ' + opt));
    });
    return parts.join('. ');
  }

  function speakText(text) {
    if (!('speechSynthesis' in window)) {
      toast('Tu navegador no soporta lectura en voz alta');
      return;
    }
    stopSpeech();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'es-ES';
    utter.rate = prefs.speechRate || 0.92;
    utter.onend = () => {
      speechSpeaking = false;
      document.querySelectorAll('.listen-btn').forEach((btn) => btn.classList.remove('speaking'));
    };
    utter.onerror = () => {
      speechSpeaking = false;
      document.querySelectorAll('.listen-btn').forEach((btn) => btn.classList.remove('speaking'));
    };
    speechSpeaking = true;
    document.querySelectorAll('.listen-btn').forEach((btn) => btn.classList.add('speaking'));
    speechSynthesis.speak(utter);
  }

  window.stopSpeech = function () {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    speechSpeaking = false;
    document.querySelectorAll('.listen-btn').forEach((btn) => btn.classList.remove('speaking'));
  };

  window.toggleListen = function () {
    if (speechSpeaking) {
      stopSpeech();
      return;
    }
    const lesson = getLesson(currentLessonId);
    if (!lesson) return;
    speakText(buildLessonSpeech(lesson));
  };

  window.showAppSheet = function ({ title, message, primaryLabel, onPrimary, secondaryLabel }) {
    const sheet = document.getElementById('app-sheet');
    document.getElementById('app-sheet-title').textContent = title;
    document.getElementById('app-sheet-msg').textContent = message;
    const primary = document.getElementById('app-sheet-primary');
    primary.textContent = primaryLabel;
    sheetPrimaryHandler = onPrimary;
    primary.onclick = () => {
      closeAppSheet();
      if (sheetPrimaryHandler) sheetPrimaryHandler();
    };
    const secondary = document.getElementById('app-sheet-secondary');
    secondary.textContent = secondaryLabel || 'Quedarme aquí';
    sheet.classList.add('open');
    sheet.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.closeAppSheet = function () {
    const sheet = document.getElementById('app-sheet');
    sheet.classList.remove('open');
    sheet.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    sheetPrimaryHandler = null;
  };

  window.showTopicCompletePrompt = function (completedTopic, nextTopic) {
    const firstLesson = nextTopic.lessons.find((l) => !isDone(l.id)) || nextTopic.lessons[0];
    showAppSheet({
      title: '¡Tema completado!',
      message: 'Has terminado «' + completedTopic.title + '». ¿Pasamos a «' + nextTopic.title + '»?',
      primaryLabel: 'Siguiente tema',
      secondaryLabel: 'Quedarme aquí',
      onPrimary: () => openLesson(firstLesson.id)
    });
  };

  window.showRouteCompletePrompt = function () {
    showAppSheet({
      title: '¡Ruta completada!',
      message: 'Has recorrido todos los temas de Cultura Española. ¡Enhorabuena!',
      primaryLabel: 'Ver mi progreso',
      secondaryLabel: 'Quedarme aquí',
      onPrimary: () => showScreen('journey-stats')
    });
  };

  window.showRouteCompletePrompt = function () {
    showAppSheet({
      title: '¡Ruta completada!',
      message: 'Has recorrido todos los temas de Cultura Española. ¡Enhorabuena!',
      primaryLabel: 'Ver mi progreso',
      secondaryLabel: 'Quedarme aquí',
      onPrimary: () => showScreen('journey-stats')
    });
  };

  window.showNotifications = function () {
    toast('No tienes notificaciones nuevas');
  };

  window.showComingSoon = function (name) {
    toast('«' + name + '» estará disponible pronto');
  };

  window.openExploreRoute = function (id) {
    const route = EXPLORE_ROUTES.find((r) => r.id === id);
    if (!route) return;
    if (route.available) showScreen('journey');
    else showComingSoon(route.title);
  };

  window.setExploreFilter = function (filter) {
    exploreFilter = filter;
    document.querySelectorAll('.explore-chip').forEach((btn) => {
      const active = btn.dataset.filter === filter;
      btn.classList.toggle('bg-[var(--brand-700)]', active);
      btn.classList.toggle('text-white', active);
      btn.classList.toggle('bg-white', !active);
      btn.classList.toggle('border', !active);
      btn.classList.toggle('border-slate-200', !active);
      btn.classList.toggle('text-slate-500', !active);
    });
    renderExplore();
  };

  function normSearch(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function renderStreakUi() {
    const show = state.streak > 0;
    ['home-streak-badge', 'sidebar-streak-card', 'drawer-streak-card', 'stat-streak-row', 'profile-streak-box'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('hidden', !show);
    });
    const profileGrid = document.getElementById('profile-stats-grid');
    if (profileGrid) {
      profileGrid.classList.toggle('grid-cols-2', !show);
      profileGrid.classList.toggle('grid-cols-3', show);
    }
    if (show) {
      document.getElementById('streak-count').textContent = state.streak;
      document.getElementById('sidebar-streak').textContent = state.streak;
      document.getElementById('drawer-streak').textContent = state.streak;
      document.getElementById('stat-streak').textContent = state.streak + ' días';
      document.getElementById('profile-streak').textContent = state.streak;
    }
  }

  function renderExplore() {
    const grid = document.getElementById('explore-grid');
    if (!grid) return;
    const q = normSearch(exploreSearchQuery);
    const items = EXPLORE_ROUTES.filter((r) => {
      if (exploreFilter !== 'all' && !r.tags.includes(exploreFilter)) return false;
      if (q && !normSearch(r.title).includes(q)) return false;
      return true;
    });
    if (!items.length) {
      grid.innerHTML =
        '<p class="col-span-full text-center text-[13px] text-slate-400 font-medium py-10">No hay rutas con ese criterio.</p>';
      return;
    }
    const done = completedCount();
    const total = totalLessons();
    const routePct = total ? Math.round((done / total) * 100) : 0;
    grid.innerHTML = items
      .map((r) => {
        if (r.hero) {
          const badge = done >= total ? 'Completada' : done > 0 ? 'En progreso' : 'Disponible';
          return `<button type="button" onclick="openExploreRoute('${r.id}')" class="topic-card tap text-left bg-white rounded-2xl overflow-hidden soft-shadow border border-slate-100 w-full">
            <div class="relative h-32 hero-gradient">
              <span class="absolute top-3 right-3 bg-white/90 text-[var(--brand-700)] text-[10.5px] font-extrabold px-2.5 py-1 rounded-full">${badge}</span>
            </div>
            <div class="p-4">
              <p class="text-[14px] font-bold text-slate-900">${escapeHtml(r.title)}</p>
              <p class="text-[11.5px] text-slate-400 font-semibold mt-1">${r.topics} temas · Nivel ${r.level}</p>
              <div class="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div class="bg-[var(--brand-700)] h-full rounded-full" style="width:${routePct}%"></div>
              </div>
            </div>
          </button>`;
        }
        const lock = r.locked
          ? '<span class="absolute inset-0 bg-white/40 flex items-center justify-center"><i data-lucide="lock" class="w-6 h-6 text-slate-600"></i></span>'
          : '';
        const badge = r.badge
          ? `<span class="absolute top-3 right-3 bg-white/90 text-slate-600 text-[10.5px] font-extrabold px-2.5 py-1 rounded-full">${escapeHtml(r.badge)}</span>`
          : '<span class="absolute top-3 right-3 bg-white/90 text-slate-500 text-[10.5px] font-extrabold px-2.5 py-1 rounded-full">Próximamente</span>';
        return `<button type="button" onclick="openExploreRoute('${r.id}')" class="topic-card tap text-left bg-white rounded-2xl overflow-hidden soft-shadow border border-slate-100 w-full${r.locked ? ' opacity-90' : ''}">
          <div class="relative h-32">
            <img src="${r.image}" class="w-full h-full object-cover" alt="">
            ${lock}
            ${badge}
          </div>
          <div class="p-4">
            <p class="text-[14px] font-bold text-slate-900">${escapeHtml(r.title)}</p>
            <p class="text-[11.5px] text-slate-400 font-semibold mt-1">${r.topics} temas · Nivel ${r.level}</p>
            <div class="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div class="bg-slate-300 h-full rounded-full" style="width:0%"></div>
            </div>
          </div>
        </button>`;
      })
      .join('');
    lucide.createIcons();
  }

  function fontToolbarHtml() {
    return `<div class="font-toolbar shrink-0" aria-label="Tamaño del texto">
      <button type="button" id="font-dec" onclick="changeFontScale(-1)" aria-label="Reducir texto">A−</button>
      <button type="button" id="font-inc" onclick="changeFontScale(1)" aria-label="Aumentar texto">A+</button>
    </div>`;
  }

  function defaultState() {
    return {
      version: 1,
      name: 'Aprendiz',
      completedLessons: [],
      studyMinutes: 0,
      points: 0,
      lastStudyDate: null,
      streak: 0
    };
  }

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.completedLessons)) {
        return defaultState();
      }
      return { ...defaultState(), ...parsed, completedLessons: [...parsed.completedLessons] };
    } catch {
      return defaultState();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    renderAll();
  }

  function isDone(lessonId) {
    return state.completedLessons.includes(lessonId);
  }

  function completedCount() {
    return state.completedLessons.length;
  }

  function topicProgress(topic) {
    const done = topic.lessons.filter((l) => isDone(l.id)).length;
    return { done, total: topic.lessons.length };
  }

  function getTopic(id) {
    return RUTA_ESPAÑOLA.topics.find((t) => t.id === id);
  }

  function getLesson(id) {
    return allLessons().find((l) => l.id === id);
  }

  function isTopicComplete(topicId) {
    const topic = getTopic(topicId);
    if (!topic) return false;
    return topic.lessons.every((l) => isDone(l.id));
  }

  function getNextTopic() {
    return RUTA_ESPAÑOLA.topics.find((t) => !isTopicComplete(t.id)) || null;
  }

  function getNextLesson() {
    return allLessons().find((l) => !isDone(l.id)) || null;
  }

  function getCurrentTopicId() {
    const next = getNextLesson();
    if (next) return next.topicId;
    const last = allLessons().filter((l) => isDone(l.id)).pop();
    return last ? last.topicId : RUTA_ESPAÑOLA.topics[0].id;
  }

  function updateStreak() {
    const today = todayStr();
    if (state.lastStudyDate === today) return;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().slice(0, 10);
    if (state.lastStudyDate === yStr) state.streak += 1;
    else state.streak = 1;
    state.lastStudyDate = today;
  }

  function calcLevel() {
    return Math.floor(state.points / 100) + 1;
  }

  function levelTitle(level) {
    if (level >= 10) return 'Maestro cultural';
    if (level >= 5) return 'Aprendiz avanzado';
    if (level >= 3) return 'Explorador';
    return 'Aprendiz';
  }

  function formatTime(mins) {
    if (mins < 60) return mins + 'm';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? h + 'h ' + m + 'm' : h + 'h';
  }

  function ringOffset(done, total) {
    const circ = 439.8;
    const pct = total ? done / total : 0;
    return circ - circ * pct;
  }

  function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('show'), 2800);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ——— Render ——— */

  function renderAll() {
    const done = completedCount();
    const total = totalLessons();
    const pct = total ? Math.round((done / total) * 100) : 0;
    const level = calcLevel();
    const name = state.name || 'Aprendiz';

    document.getElementById('user-greeting').textContent = name;
    document.getElementById('sidebar-name').textContent = name;
    document.getElementById('drawer-streak').textContent = state.streak;
    document.getElementById('hero-progress-text').textContent = done + ' / ' + total;
    document.querySelector('.hero-bar').style.width = pct + '%';
    document.getElementById('home-ring-text').textContent = done + ' / ' + total;
    document.getElementById('ring-home').setAttribute('stroke-dashoffset', ringOffset(done, total));

    const complete = done >= total;
    document.getElementById('home-congrats').classList.toggle('hidden', !complete);
    document.getElementById('home-congrats-msg').classList.toggle('hidden', !complete);
    document.getElementById('home-keep-going').classList.toggle('hidden', complete);

    const intro = document.getElementById('home-progress-intro');
    if (intro) {
      if (done === 0) {
        intro.textContent = 'Cuando quieras, aquí verás cómo vas. Por ahora, elige un tema y empieza a leer.';
        intro.classList.remove('hidden');
      } else if (complete) {
        intro.classList.add('hidden');
      } else {
        intro.textContent = 'Vas bien — el progreso es solo una guía, no una carrera.';
        intro.classList.remove('hidden');
      }
    }

    document.getElementById('stat-time').textContent = formatTime(state.studyMinutes);
    document.getElementById('stat-lessons').textContent = done;
    document.getElementById('stat-points').textContent = state.points.toLocaleString('es-ES');
    renderStreakUi();

    document.getElementById('sidebar-level').textContent = level;
    document.getElementById('sidebar-level-bar').style.width = (state.points % 100) + '%';

    const initials = name.trim().charAt(0).toUpperCase() || 'A';
    document.getElementById('profile-initials').textContent = initials;
    const nameInput = document.getElementById('profile-name-input');
    if (document.activeElement !== nameInput) nameInput.value = name;
    document.getElementById('profile-level').textContent = level;
    document.getElementById('profile-title').textContent = levelTitle(level);
    document.getElementById('profile-lessons').textContent = done;
    document.getElementById('profile-points').textContent = state.points.toLocaleString('es-ES');

    renderTopicsGrid();
    renderRoutes();
    renderExplore();
    renderAchievements();
    renderHomeAchievements();
    if (currentTopicId) renderTopic(currentTopicId);
    lucide.createIcons();
  }

  function topicFooterHtml(topic, done, total, complete, isCurrent) {
    if (prefs.focusMode) {
      if (complete) {
        return `<div class="topic-card__footer border-t-2 mt-3 pt-2.5 flex items-center gap-1.5" style="border-color:var(--divider)">
          <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-[var(--green)]"></i>
          <span class="text-[11px] font-bold text-[var(--brand-700)]">Completado</span>
        </div>`;
      }
      if (isCurrent) {
        return `<div class="topic-card__footer flex items-center justify-center">
          <span class="text-[11px] font-bold">En curso</span>
        </div>`;
      }
      return `<div class="topic-card__footer border-t-2 mt-3 pt-2.5 flex items-center gap-1.5" style="border-color:var(--divider)">
        <span class="text-[11px] font-bold text-slate-400">Explorar</span>
      </div>`;
    }
    if (complete) {
      return `<div class="topic-card__footer border-t-2 mt-3 pt-2.5 flex items-center gap-1.5" style="border-color:var(--divider)">
        <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-[var(--green)]"></i>
        <span class="text-[11px] font-bold text-[var(--brand-700)]">Completado</span>
      </div>`;
    }
    if (isCurrent) {
      return `<div class="topic-card__footer flex items-center justify-center">
        <span class="text-[11px] font-bold">${done} / ${total} lecciones</span>
      </div>`;
    }
    return `<div class="topic-card__footer border-t-2 mt-3 pt-2.5 flex items-center gap-1.5" style="border-color:var(--divider)">
      <span class="text-[11px] font-bold text-slate-400">${done} / ${total}</span>
    </div>`;
  }

  function renderTopicsGrid() {
    const grid = document.getElementById('topics-grid');
    const currentId = getCurrentTopicId();
    const q = normSearch(homeSearchQuery);
    const topics = RUTA_ESPAÑOLA.topics.filter((topic) => {
      if (!q) return true;
      const hay = normSearch(topic.title + ' ' + topic.description);
      return hay.includes(q);
    });
    if (!topics.length) {
      grid.innerHTML = '<p class="col-span-full text-center text-[13px] text-slate-400 py-6">Ningún tema coincide con tu búsqueda.</p>';
      return;
    }
    grid.innerHTML = topics
      .map((topic) => {
        const { done, total } = topicProgress(topic);
        const complete = done >= total;
        const isCurrent = topic.id === currentId && !complete;
        const activeClass = isCurrent ? ' topic-card--active' : '';
        const footer = topicFooterHtml(topic, done, total, complete, isCurrent);
        return `<div role="button" tabindex="0" onclick="openTopic('${topic.id}')" class="topic-card relative bg-white rounded-2xl border border-slate-100 soft-shadow h-full${activeClass}${isCurrent ? '' : ' p-4'}">
          <div class="relative w-12 h-12 rounded-2xl bg-[var(--brand-50)] flex items-center justify-center mb-3">
            <i data-lucide="${topic.icon}" class="w-5 h-5 text-[var(--brand-700)] stroke-[2]"></i>
            <span class="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-[var(--brand-700)] text-white text-[11px] font-extrabold flex items-center justify-center ring-2 ring-white">${topic.num}</span>
          </div>
          <h4 class="text-[13.5px] font-bold text-slate-900 leading-tight">${escapeHtml(topic.title)}</h4>
          <p class="text-[11.5px] text-slate-400 font-medium mt-1 leading-snug">${escapeHtml(topic.description)}</p>
          ${footer}
        </div>`;
      })
      .join('');
  }

  function renderRoutes() {
    const done = completedCount();
    const total = totalLessons();
    const pct = total ? Math.round((done / total) * 100) : 0;
    const label = done >= total ? 'Completada' : 'En progreso';
    const sub = prefs.focusMode
      ? '6 módulos · Cultura Española'
      : `${done} / ${total} lecciones · 6 módulos`;
    const barHtml = prefs.focusMode
      ? ''
      : `<div class="w-full bg-white/20 h-1.5 rounded-full mt-3 overflow-hidden focus-hide">
          <div class="bg-white h-full rounded-full" style="width:${pct}%"></div>
        </div>`;
    document.getElementById('routes-list').innerHTML = `
      <button type="button" onclick="showScreen('journey')" class="tap text-left hero-gradient rounded-[22px] p-5 accent-shadow w-full">
        <p class="text-[11px] uppercase tracking-[0.14em] font-bold text-violet-200/85">${label}</p>
        <p class="text-[18px] font-extrabold text-white mt-1">${RUTA_ESPAÑOLA.title} ${RUTA_ESPAÑOLA.flag}</p>
        <p class="text-[12px] text-violet-100/80 font-medium mt-1">${sub}</p>
        ${barHtml}
      </button>`;
  }

  const ACHIEVEMENTS = [
    { id: 'first', icon: 'sparkles', title: 'Primer paso', desc: 'Completa tu primera lección', test: () => completedCount() >= 1 },
    { id: 'five', icon: 'shield', title: 'Explorador', desc: 'Completa 5 lecciones', test: () => completedCount() >= 5 },
    { id: 'streak3', icon: 'flame', title: 'Racha de fuego', desc: '3 días seguidos', test: () => state.streak >= 3 },
    { id: 'route', icon: 'landmark', title: 'Maestro cultural', desc: 'Termina Cultura Española', test: () => completedCount() >= totalLessons() }
  ];

  function renderHomeAchievements() {
    const el = document.getElementById('home-achievements');
    if (!el) return;
    const recent = ACHIEVEMENTS.filter((a) => a.test()).slice(-2);
    if (!recent.length) {
      el.innerHTML = 'Aún no hay logros — ¡completa tu primera lección!';
      return;
    }
    el.innerHTML = recent
      .map(
        (a) => `<div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[var(--brand-50)] flex items-center justify-center shrink-0">
            <i data-lucide="${a.icon}" class="w-5 h-5 text-[var(--brand-700)]"></i>
          </div>
          <div><p class="text-[13px] font-bold text-slate-900">${escapeHtml(a.title)}</p>
          <p class="text-[11px] text-slate-400 font-semibold">${escapeHtml(a.desc)}</p></div>
        </div>`
      )
      .join('');
  }

  function renderAchievements() {
    const unlocked = ACHIEVEMENTS.filter((a) => a.test()).length;
    document.getElementById('achievements-subtitle').textContent =
      unlocked + ' de ' + ACHIEVEMENTS.length + ' logros desbloqueados';
    document.getElementById('achievements-grid').innerHTML = ACHIEVEMENTS.map((a) => {
      const ok = a.test();
      return `<div class="bg-white rounded-2xl border border-slate-100 soft-shadow p-5 flex flex-col items-center text-center${ok ? '' : ' opacity-50'}">
        <div class="w-14 h-14 rounded-2xl ${ok ? 'bg-[var(--brand-50)]' : 'bg-slate-100'} flex items-center justify-center">
          <i data-lucide="${a.icon}" class="w-6 h-6 ${ok ? 'text-[var(--brand-700)]' : 'text-slate-400'}"></i>
        </div>
        <p class="text-[13px] font-bold text-slate-900 mt-3">${escapeHtml(a.title)}</p>
        <p class="text-[11px] text-slate-400 font-semibold mt-1">${escapeHtml(a.desc)}</p>
      </div>`;
    }).join('');
  }

  function renderTopic(topicId) {
    const topic = getTopic(topicId);
    if (!topic) return;
    const { done, total } = topicProgress(topic);
    const pct = total ? Math.round((done / total) * 100) : 0;
    const progressHtml = prefs.focusMode
      ? ''
      : `<div class="mt-5">
            <div class="flex justify-between text-[11.5px] font-bold mb-2">
              <span class="text-slate-400 font-semibold">Progreso del tema</span>
              <span class="text-[var(--brand-700)] font-extrabold">${done} / ${total}</span>
            </div>
            <div class="w-full bg-[var(--brand-50)] h-[7px] rounded-full overflow-hidden">
              <div class="bar-progress bg-[var(--brand-700)] h-full rounded-full" style="width:${pct}%"></div>
            </div>
          </div>`;
    const lessonsHtml = topic.lessons
      .map((lesson) => {
        const doneL = isDone(lesson.id);
        return `<button type="button" onclick="openLesson('${lesson.id}')" class="lesson-row tap w-full text-left bg-white rounded-2xl border border-slate-100 p-4 soft-shadow flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[var(--brand-50)] flex items-center justify-center shrink-0">
            <i data-lucide="${lesson.icon}" class="w-[18px] h-[18px] text-[var(--brand-700)]"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[13.5px] font-bold text-slate-900">${escapeHtml(lesson.title)}</p>
            <p class="text-[11px] text-slate-400 font-semibold">${doneL ? 'Completado' : 'Pendiente'}</p>
          </div>
          ${
            doneL
              ? '<div class="w-7 h-7 rounded-full bg-[var(--brand-700)] flex items-center justify-center shrink-0"><i data-lucide="check" class="w-3.5 h-3.5 text-white stroke-[3]"></i></div>'
              : '<i data-lucide="chevron-right" class="w-5 h-5 text-slate-300 shrink-0"></i>'
          }
        </button>`;
      })
      .join('');

    document.getElementById('topic-root').innerHTML = `
      <div class="relative hero-photo" style="background-image:url('${topic.image}')">
        <div class="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/10"></div>
        <div class="relative px-5 pt-5 flex items-center justify-between" style="padding-top:max(20px, env(safe-area-inset-top))">
          <button type="button" onclick="showScreen('home')" class="tap w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center">
            <i data-lucide="arrow-left" class="w-5 h-5 text-slate-800"></i>
          </button>
        </div>
      </div>
      <div class="px-5 -mt-10 relative z-10 pb-28 lg:pb-10">
        <div class="bg-white rounded-3xl border border-slate-100 p-5 soft-shadow-lg">
          <div class="flex items-start gap-3">
            <span class="w-8 h-8 rounded-full bg-[var(--brand-700)] text-white text-[13px] font-extrabold flex items-center justify-center shrink-0">${topic.num}</span>
            <div class="flex-1 min-w-0">
              <h1 class="text-[20px] font-extrabold text-slate-900 tracking-tight leading-tight">${escapeHtml(topic.title)}</h1>
              <p class="text-[12.5px] text-slate-400 font-medium mt-1 leading-relaxed">${escapeHtml(topic.description)}</p>
            </div>
          </div>
          ${progressHtml}
        </div>
        <div class="mt-6 flex flex-col gap-2.5">${lessonsHtml}</div>
        <div class="sticky-cta lg:static lg:mt-6">
          <button type="button" onclick="openNextInTopic('${topic.id}')" class="tap w-full bg-[var(--brand-700)] text-white font-bold text-[14px] py-3.5 pill-btn soft-shadow-lg">
            ${done >= total ? 'Repasar tema' : 'Continuar tema'}
          </button>
        </div>
      </div>`;
    lucide.createIcons();
  }

  function quizProgressHtml(index, total) {
    if (total <= 1) return '';
    const dots = Array.from({ length: total }, (_, i) => {
      let cls = 'quiz-dot';
      const answered = quizCorrectSet.has(i) || quizPickedMap.has(i);
      if (answered || i < index) cls += ' quiz-dot--done';
      else if (i === index) cls += ' quiz-dot--active';
      if (i === index) return `<span class="${cls}" aria-current="step"></span>`;
      const canJump = quizReviewMode || quizCorrectSet.has(i) || i < index;
      if (canJump) {
        return `<button type="button" class="${cls} quiz-dot-btn tap" onclick="goQuizTo(${i})" aria-label="Ver pregunta ${i + 1}"></button>`;
      }
      return `<span class="${cls}" aria-hidden="true"></span>`;
    }).join('');
    return `<div class="flex items-center justify-between gap-3 mb-3">
      <span class="text-[11px] font-bold text-slate-400">Pregunta ${index + 1} de ${total}</span>
      <div class="quiz-dots flex gap-1.5">${dots}</div>
    </div>`;
  }

  function buildSourcesHtml(lesson) {
    if (!lesson.sources?.length) return '';
    const items = lesson.sources
      .map((s) => {
        const label = escapeHtml(s.title || s.label || '');
        if (s.url) {
          return `<li><a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" class="lesson-source-link tap">${label}</a></li>`;
        }
        return `<li class="lesson-source-text">${label}</li>`;
      })
      .join('');
    return `<details class="lesson-sources-fold">
      <summary class="lesson-sources-summary tap">Fuentes</summary>
      <ul class="lesson-sources-list">${items}</ul>
    </details>`;
  }

  function buildQuizNavHtml(lesson, questionIndex) {
    const total = getLessonQuestions(lesson).length;
    if (total <= 1) return '';
    const hasPrev = questionIndex > 0;
    const hasNext = questionIndex < total - 1;
    const solved = quizCorrectSet.has(questionIndex);
    const showNext = hasNext && (quizReviewMode || solved);
    if (!hasPrev && !showNext) return '';
    return `<div class="quiz-nav">
      ${hasPrev ? '<button type="button" onclick="goQuizPrev()" class="tap quiz-nav-btn quiz-nav-btn--ghost">← Anterior</button>' : '<span class="quiz-nav-spacer"></span>'}
      ${showNext ? '<button type="button" onclick="confirmQuizNext()" class="tap quiz-nav-btn quiz-nav-btn--primary">Siguiente →</button>' : '<span class="quiz-nav-spacer"></span>'}
    </div>`;
  }

  function renderQuizOptionState(q, questionIndex) {
    const picked = quizPickedMap.get(questionIndex);
    const solved = !quizReviewMode && quizCorrectSet.has(questionIndex);
    const frozen = solved || (quizReviewMode && picked !== undefined);
    const optionsHtml = q.options
      .map((opt, i) => {
        let extra = '';
        if (picked !== undefined) {
          if (i === picked) extra = picked === q.correct ? ' correct' : ' wrong';
          else if (i === q.correct && picked !== q.correct) extra = ' correct';
        } else if (solved && i === q.correct) {
          extra = ' correct';
        }
        return `<button type="button" data-idx="${i}" onclick="pickQuiz(${i})" class="quiz-option tap text-left w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-700${extra}"${frozen ? ' disabled' : ''}>${escapeHtml(opt)}</button>`;
      })
      .join('');
    let feedback = '';
    if (picked !== undefined) {
      feedback = picked === q.correct ? 'Respuesta correcta ✓' : 'Respuesta incorrecta';
    } else if (solved) {
      feedback = 'Respuesta correcta ✓';
    }
    const feedbackClass =
      picked !== undefined && picked !== q.correct
        ? 'text-[12px] font-semibold mt-3 text-red-500'
        : 'text-[12px] font-semibold mt-3 text-green-600';
    return {
      optionsHtml,
      feedbackHtml: feedback
        ? `<p id="quiz-feedback" class="${feedbackClass}">${feedback}</p>`
        : '<p id="quiz-feedback" class="text-[12px] font-semibold mt-3 hidden"></p>',
    };
  }

  function buildQuizInnerHtml(lesson, questionIndex) {
    const questions = getLessonQuestions(lesson);
    if (!questions.length) return '';
    const q = questions[questionIndex];
    if (!q) return '';
    const total = questions.length;
    const { optionsHtml, feedbackHtml } = renderQuizOptionState(q, questionIndex);
    return `
      <p class="text-[13px] font-extrabold text-slate-900 mb-1">Comprueba lo aprendido</p>
      ${quizProgressHtml(questionIndex, total)}
      <p class="text-[13.5px] font-semibold text-slate-700 mb-3" id="quiz-question">${escapeHtml(q.question)}</p>
      <div class="flex flex-col gap-2" id="quiz-options">${optionsHtml}</div>
      ${feedbackHtml}
      ${buildQuizNavHtml(lesson, questionIndex)}`;
  }

  function updateQuizStep() {
    const lesson = getLesson(currentLessonId);
    const box = document.getElementById('quiz-box');
    if (!lesson || !box) return;
    box.innerHTML = buildQuizInnerHtml(lesson, currentQuizIndex);
    lucide.createIcons();
  }

  function renderLesson(lessonId) {
    const lesson = getLesson(lessonId);
    if (!lesson) return;
    const topic = getTopic(lesson.topicId);
    const done = isDone(lessonId);
    currentQuizIndex = 0;
    quizReviewMode = done;
    quizCorrectSet = new Set();
    quizPickedMap = new Map();
    quizAwaitingNext = false;
    quizAnswered = done;

    const blocksHtml = lesson.blocks
      .map((b) => {
        if (b.type === 'tip') return `<div class="lesson-tip">${escapeHtml(b.text)}</div>`;
        return `<p>${escapeHtml(b.text)}</p>`;
      })
      .join('');

    const questions = getLessonQuestions(lesson);
    const sourcesHtml = buildSourcesHtml(lesson);

    const quizHtml = questions.length
      ? `<div class="mt-6 theme-card bg-white rounded-2xl border border-slate-100 p-5 soft-shadow" id="quiz-box">
          ${buildQuizInnerHtml(lesson, 0)}
        </div>`
      : '';

    const showFontHint = !prefs.hints.fontSize;
    const fontHintHtml = showFontHint
      ? `<div id="font-hint" class="font-hint">
          <span>💡 Puedes agrandar el texto con <strong>A+</strong> arriba, o en Ajustes.</span>
          <button type="button" onclick="dismissFontHint()">Entendido</button>
        </div>`
      : '';

    document.getElementById('lesson-root').innerHTML = `
      <div class="flex items-center justify-between gap-3 mb-4">
        <button type="button" onclick="openTopic('${lesson.topicId}')" class="tap flex items-center gap-2 text-[13px] font-bold text-slate-500 min-w-0">
          <i data-lucide="arrow-left" class="w-4 h-4 shrink-0"></i>
          <span class="truncate">${escapeHtml(topic.title)}</span>
        </button>
        <div class="flex items-center gap-2 shrink-0">
          ${fontToolbarHtml()}
          <button type="button" onclick="toggleListen()" class="listen-btn tap w-[42px] h-[42px] rounded-xl flex items-center justify-center border border-slate-200 bg-white soft-shadow text-slate-600" aria-label="Escuchar lección">
            <i data-lucide="headphones" class="w-[18px] h-[18px]"></i>
          </button>
        </div>
      </div>
      ${fontHintHtml}
      <div id="lesson-content-card" class="theme-card bg-white rounded-3xl border border-slate-100 p-5 soft-shadow-lg">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-[11px] font-bold text-[var(--brand-700)] uppercase tracking-wide">Lección</span>
          ${done ? '<span class="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-full">Completada</span>' : ''}
        </div>
        <h1 class="text-[22px] font-extrabold text-slate-900 tracking-tight">${escapeHtml(lesson.title)}</h1>
        <div class="lesson-content mt-4">${blocksHtml}</div>
      </div>
      ${quizHtml}
      <button type="button" id="complete-lesson-btn" onclick="completeLesson()" disabled
        class="tap mt-6 w-full bg-[var(--brand-700)] text-white font-bold text-[14px] py-3.5 pill-btn soft-shadow-lg opacity-40 cursor-not-allowed">
        ${done ? 'Lección completada ✓' : 'Completar lección'}
      </button>
      ${sourcesHtml}`;

    if (done) enableCompleteButton(true);
    lessonStartedAt = Date.now();
    stopSpeech();
    updateFontControls();
    lucide.createIcons();
  }

  function renderJourneyStats() {
    const done = completedCount();
    const total = totalLessons();
    const complete = done >= total;
    document.getElementById('journey-stats-root').innerHTML = `
      <div class="flex items-center justify-between">
        <button type="button" onclick="showScreen('home')" class="tap w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white soft-shadow border border-slate-100">
          <i data-lucide="arrow-left" class="w-5 h-5 text-slate-700"></i>
        </button>
        <h1 class="text-[16px] font-extrabold text-slate-900 tracking-tight">${RUTA_ESPAÑOLA.title} ${RUTA_ESPAÑOLA.flag}</h1>
        <span class="w-10"></span>
      </div>
      <div class="bg-white rounded-3xl border border-slate-100 p-6 soft-shadow text-center mt-6">
        <div class="relative w-[190px] h-[190px] mx-auto">
          <svg class="w-full h-full -rotate-90" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="70" fill="none" stroke="var(--brand-50)" stroke-width="12"/>
            <circle id="ring-journey" class="ring-progress" cx="80" cy="80" r="70" fill="none" stroke="var(--brand-700)" stroke-width="12" stroke-linecap="round" stroke-dasharray="439.8" stroke-dashoffset="${ringOffset(done, total)}"/>
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center px-4">
            <span class="text-[28px] font-extrabold text-slate-900 tracking-tight leading-none">${done} / ${total}</span>
            <span class="text-[11px] text-slate-400 font-bold mt-1">Lecciones completadas</span>
            ${complete ? '<span class="text-[22px] mt-2">🏆</span><span class="text-[12px] font-bold text-[var(--amber)] mt-0.5">¡Felicidades!</span>' : ''}
          </div>
        </div>
        <button type="button" onclick="continueLearning()" class="tap mt-6 w-full bg-[var(--brand-700)] text-white font-bold text-[14px] py-3.5 pill-btn">
          ${complete ? 'Repasar ruta' : 'Continuar aprendiendo'}
        </button>
      </div>
      <div class="bg-white rounded-3xl border border-slate-100 p-5 soft-shadow mt-5">
        <h3 class="text-[14.5px] font-extrabold text-slate-900 tracking-tight mb-4">Estadísticas</h3>
        <div class="flex flex-col gap-4 text-[13px]">
          <div class="flex justify-between"><span class="text-slate-500">Tiempo de estudio</span><span class="font-extrabold">${formatTime(state.studyMinutes)}</span></div>
          <div class="flex justify-between"><span class="text-slate-500">Lecciones aprendidas</span><span class="font-extrabold">${done}</span></div>
          <div class="flex justify-between"><span class="text-slate-500">Puntos</span><span class="font-extrabold">${state.points}</span></div>
          ${state.streak > 0 ? `<div class="flex justify-between"><span class="text-slate-500">Racha</span><span class="font-extrabold">${state.streak} días</span></div>` : ''}
        </div>
      </div>
      <button type="button" onclick="showScreen('journey')" class="tap mt-5 w-full text-[13px] font-bold text-[var(--brand-700)] flex items-center justify-center gap-1">
        Ver módulos de la ruta <i data-lucide="chevron-right" class="w-4 h-4"></i>
      </button>`;
    lucide.createIcons();
  }

  function renderJourney() {
    const done = completedCount();
    const total = totalLessons();
    const items = RUTA_ESPAÑOLA.topics
      .map((topic) => {
        const p = topicProgress(topic);
        const complete = p.done >= p.total;
        return `<button type="button" onclick="openTopic('${topic.id}')" class="tap w-full bg-white rounded-2xl border border-slate-100 soft-shadow p-4 flex items-center justify-between text-left">
          <div>
            <p class="text-[13.5px] font-bold text-slate-900">${escapeHtml(topic.title)}</p>
            <p class="text-[11.5px] text-slate-400 font-semibold mt-0.5">${p.done} / ${p.total} lecciones${complete ? ' · Completado' : ''}</p>
          </div>
          <i data-lucide="${topic.icon}" class="w-5 h-5 text-[var(--brand-700)]"></i>
        </button>`;
      })
      .join('');

    document.getElementById('journey-root').innerHTML = `
      <button type="button" onclick="showScreen('home')" class="tap flex items-center gap-2 text-[13px] font-bold text-slate-500">
        <i data-lucide="arrow-left" class="w-4 h-4"></i> Volver
      </button>
      <div class="hero-gradient rounded-[26px] p-6 mt-4 accent-shadow">
        <span class="text-[11px] tracking-[0.16em] uppercase font-bold text-violet-200/85">Ruta completa</span>
        <h1 class="text-[24px] font-extrabold text-white mt-1.5">${RUTA_ESPAÑOLA.title} ${RUTA_ESPAÑOLA.flag}</h1>
        <p class="text-[13px] text-violet-100/80 font-medium mt-1.5">${done} de ${total} lecciones completadas</p>
      </div>
      <div class="flex flex-col gap-3 mt-6 mb-8">${items}</div>`;
    lucide.createIcons();
  }

  function enableCompleteButton(done) {
    const btn = document.getElementById('complete-lesson-btn');
    if (!btn) return;
    btn.disabled = !quizAnswered && !done;
    btn.classList.toggle('opacity-40', btn.disabled);
    btn.classList.toggle('cursor-not-allowed', btn.disabled);
    if (done) {
      btn.textContent = 'Lección completada ✓';
      btn.classList.remove('opacity-40', 'cursor-not-allowed');
      btn.disabled = true;
    }
  }

  /* ——— Actions ——— */

  window.openTopic = function (topicId) {
    currentTopicId = topicId;
    renderTopic(topicId);
    showScreen('topic');
  };

  window.openLesson = function (lessonId) {
    currentLessonId = lessonId;
    currentTopicId = getLesson(lessonId).topicId;
    renderLesson(lessonId);
    showScreen('lesson');
  };

  window.openNextInTopic = function (topicId) {
    const topic = getTopic(topicId);
    const next = topic.lessons.find((l) => !isDone(l.id));
    openLesson(next ? next.id : topic.lessons[0].id);
  };

  window.continueLearning = function () {
    const next = getNextLesson();
    if (next) openLesson(next.id);
    else showScreen('journey-stats');
  };

  window.goQuizPrev = function () {
    if (currentQuizIndex <= 0) return;
    quizAwaitingNext = false;
    currentQuizIndex -= 1;
    updateQuizStep();
  };

  window.goQuizTo = function (index) {
    const lesson = getLesson(currentLessonId);
    if (!lesson) return;
    const total = getLessonQuestions(lesson).length;
    if (index < 0 || index >= total || index === currentQuizIndex) return;
    if (!quizReviewMode && index > currentQuizIndex && !quizCorrectSet.has(index)) return;
    quizAwaitingNext = false;
    currentQuizIndex = index;
    updateQuizStep();
  };

  window.confirmQuizNext = function () {
    const lesson = getLesson(currentLessonId);
    if (!lesson) return;
    const total = getLessonQuestions(lesson).length;
    if (currentQuizIndex >= total - 1) return;
    if (!quizReviewMode && !quizCorrectSet.has(currentQuizIndex)) return;
    quizAwaitingNext = false;
    currentQuizIndex += 1;
    updateQuizStep();
  };

  window.pickQuiz = function (idx) {
    if (!quizReviewMode) {
      if (quizAnswered) return;
      if (quizCorrectSet.has(currentQuizIndex)) return;
    } else if (quizPickedMap.has(currentQuizIndex)) {
      return;
    }
    const lesson = getLesson(currentLessonId);
    if (!lesson) return;
    const questions = getLessonQuestions(lesson);
    const q = questions[currentQuizIndex];
    if (!q) return;
    const correct = q.correct;
    const feedback = document.getElementById('quiz-feedback');
    if (!feedback) return;
    document.querySelectorAll('#quiz-options .quiz-option').forEach((btn, i) => {
      btn.classList.remove('selected', 'correct', 'wrong');
      if (i === idx) btn.classList.add(idx === correct ? 'correct' : 'wrong');
      else if (i === correct) btn.classList.add('correct');
    });
    if (idx === correct) {
      quizPickedMap.set(currentQuizIndex, idx);
      if (!quizReviewMode) {
        quizCorrectSet.add(currentQuizIndex);
        const allCorrect = quizCorrectSet.size >= questions.length;
        if (allCorrect) {
          quizAnswered = true;
          quizAwaitingNext = false;
          feedback.textContent = '¡Todas correctas! Ya puedes completar la lección.';
          feedback.className = 'text-[12px] font-semibold mt-3 text-green-600';
          feedback.classList.remove('hidden');
          enableCompleteButton(false);
        } else {
          quizAwaitingNext = true;
          feedback.textContent = '¡Correcto! Pasa a la siguiente cuando quieras.';
          feedback.className = 'text-[12px] font-semibold mt-3 text-green-600';
          feedback.classList.remove('hidden');
        }
        document.querySelectorAll('#quiz-options .quiz-option').forEach((btn) => {
          btn.disabled = true;
        });
        updateQuizStep();
      } else {
        feedback.textContent = '¡Correcto!';
        feedback.className = 'text-[12px] font-semibold mt-3 text-green-600';
        feedback.classList.remove('hidden');
        document.querySelectorAll('#quiz-options .quiz-option').forEach((btn) => {
          btn.disabled = true;
        });
      }
    } else {
      if (quizReviewMode) quizPickedMap.set(currentQuizIndex, idx);
      feedback.textContent = 'Casi — inténtalo de nuevo.';
      feedback.className = 'text-[12px] font-semibold mt-3 text-red-500';
      feedback.classList.remove('hidden');
      if (quizReviewMode) {
        document.querySelectorAll('#quiz-options .quiz-option').forEach((btn) => {
          btn.disabled = true;
        });
      }
    }
  };

  window.completeLesson = function () {
    if (!currentLessonId || !quizAnswered) return;
    if (isDone(currentLessonId)) return;

    if (lessonStartedAt) {
      const mins = Math.max(1, Math.round((Date.now() - lessonStartedAt) / 60000));
      state.studyMinutes += Math.min(mins, 15);
    }
    state.completedLessons.push(currentLessonId);
    state.points += 50;
    updateStreak();
    const completedTopicId = getLesson(currentLessonId).topicId;
    saveState();
    toast('¡Lección completada! +50 puntos');
    renderLesson(currentLessonId);

    const completedTopic = getTopic(completedTopicId);
    if (!isTopicComplete(completedTopicId)) return;

    const nextTopic = getNextTopic();
    if (nextTopic && nextTopic.id !== completedTopicId) {
      setTimeout(() => showTopicCompletePrompt(completedTopic, nextTopic), 500);
    } else if (completedCount() >= totalLessons()) {
      setTimeout(() => showRouteCompletePrompt(), 500);
    }
  };

  window.exportProgress = function () {
    const payload = {
      ...state,
      exportedAt: new Date().toISOString(),
      app: 'Aprendarnia',
      route: RUTA_ESPAÑOLA.id
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    const safeName = (state.name || 'aprendiz').replace(/[^a-z0-9áéíóúñ]/gi, '_').toLowerCase();
    a.download = 'learnia-progreso-' + safeName + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
    toast('Progreso descargado');
  };

  window.resetPrefs = function () {
    showAppSheet({
      title: '¿Restablecer ajustes?',
      message: 'Volverás al tema, tamaño de texto y preferencias por defecto.',
      primaryLabel: 'Restablecer',
      secondaryLabel: 'Cancelar',
      onPrimary: () => {
        prefs = defaultPrefs();
        savePrefs();
        renderAll();
        toast('Ajustes restablecidos');
      }
    });
  };

  window.resetProgress = function () {
    showAppSheet({
      title: '¿Borrar progreso?',
      message: 'Se borrará todo el progreso de este dispositivo. Puedes descargarlo antes si lo guardaste.',
      primaryLabel: 'Borrar progreso',
      secondaryLabel: 'Cancelar',
      onPrimary: () => {
        state = defaultState();
        saveState();
        toast('Progreso borrado');
        showScreen('home');
      }
    });
  };

  function importProgress(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || data.version !== 1 || !Array.isArray(data.completedLessons)) {
          toast('Archivo no válido');
          return;
        }
        const validIds = new Set(allLessons().map((l) => l.id));
        state = {
          ...defaultState(),
          name: typeof data.name === 'string' ? data.name.slice(0, 24) : 'Aprendiz',
          completedLessons: data.completedLessons.filter((id) => validIds.has(id)),
          studyMinutes: Math.max(0, Number(data.studyMinutes) || 0),
          points: Math.max(0, Number(data.points) || 0),
          streak: Math.max(0, Number(data.streak) || 0),
          lastStudyDate: data.lastStudyDate || null
        };
        saveState();
        toast('Progreso importado correctamente');
        showScreen('home');
      } catch {
        toast('No se pudo leer el archivo');
      }
    };
    reader.readAsText(file);
  }

  /* ——— Navigation ——— */

  function paintSidebar(target) {
    document.querySelectorAll('.sidebar-link').forEach((btn) => {
      if (!btn.dataset.target) return;
      const isActive = btn.dataset.target === target;
      btn.style.background = isActive ? 'var(--brand-50)' : '';
      btn.style.color = isActive ? 'var(--brand-700)' : '#475569';
    });
  }

  function paintDrawer(target) {
    document.querySelectorAll('.drawer-link').forEach((btn) => {
      const isActive = btn.dataset.target === target;
      btn.style.background = isActive ? 'var(--brand-50)' : '';
      btn.style.color = isActive ? 'var(--brand-700)' : '#475569';
    });
  }

  function paintBottomNav(target) {
    const navTarget = TAB_SCREENS.includes(target) ? target : lastTab;
    document.querySelectorAll('.bottom-link').forEach((btn) => {
      const isActive = btn.dataset.target === navTarget;
      const icon = btn.querySelector('.tab-icon');
      const label = btn.querySelector('.tab-label');
      icon.style.color = isActive ? 'var(--brand-700)' : '#94a3b8';
      label.style.color = isActive ? 'var(--brand-700)' : '#94a3b8';
      icon.style.transform = isActive ? 'translateY(-1px) scale(1.06)' : 'none';
    });
  }

  function closeDrawer() {
    document.getElementById('drawer-backdrop').classList.remove('open');
    document.getElementById('mobile-drawer').classList.remove('open');
    document.body.style.overflow = '';
  }

  function openDrawer() {
    document.getElementById('drawer-backdrop').classList.add('open');
    document.getElementById('mobile-drawer').classList.add('open');
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
  }

  window.showScreen = function (target) {
    stopSpeech();
    closeAppSheet();
    if (target === 'journey-stats') renderJourneyStats();
    if (target === 'journey') renderJourney();

    document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
    const screen = document.getElementById('screen-' + target);
    if (!screen) return;
    screen.classList.add('active');
    if (TAB_SCREENS.includes(target)) lastTab = target;
    document.body.classList.toggle('detail-view', DETAIL_SCREENS.includes(target));
    paintSidebar(target);
    paintDrawer(target);
    paintBottomNav(target);
    document.querySelector('main').scrollTo({ top: 0, behavior: 'instant' });
    closeDrawer();
    history.replaceState(null, '', '#' + target);
    lucide.createIcons();
  };

  /* ——— Init ——— */

  document.querySelectorAll('[data-target]').forEach((btn) => {
    btn.addEventListener('click', () => showScreen(btn.dataset.target));
  });

  document.getElementById('menu-toggle').addEventListener('click', openDrawer);
  document.getElementById('menu-close').addEventListener('click', closeDrawer);
  document.getElementById('drawer-backdrop').addEventListener('click', closeDrawer);

  document.getElementById('profile-name-input').addEventListener('change', (e) => {
    state.name = e.target.value.trim().slice(0, 24) || 'Aprendiz';
    saveState();
  });

  document.getElementById('import-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) importProgress(file);
    e.target.value = '';
  });

  const homeSearch = document.getElementById('home-search');
  if (homeSearch) {
    homeSearch.addEventListener('input', (e) => {
      homeSearchQuery = e.target.value.trim();
      renderTopicsGrid();
    });
  }

  const exploreSearch = document.getElementById('explore-search');
  if (exploreSearch) {
    exploreSearch.addEventListener('input', (e) => {
      exploreSearchQuery = e.target.value.trim();
      renderExplore();
    });
  }

  document.querySelectorAll('.explore-chip').forEach((btn) => {
    btn.addEventListener('click', () => setExploreFilter(btn.dataset.filter));
  });

  document.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('[data-action]');
    if (!actionBtn) return;
    const action = actionBtn.dataset.action;
    if (action === 'reset-prefs') window.resetPrefs();
    if (action === 'reset-progress') window.resetProgress();
  });

  window.addEventListener('DOMContentLoaded', () => {
    prefs = loadPrefs();
    applyPrefs();
    state = loadState();
    renderAll();

    document.querySelectorAll('[data-theme-pick]').forEach((btn) => {
      btn.addEventListener('click', () => setTheme(btn.dataset.themePick));
    });

    document.querySelectorAll('[data-speech-rate]').forEach((btn) => {
      btn.addEventListener('click', () => setSpeechRate(btn.dataset.speechRate));
    });

    const hash = location.hash.replace('#', '');
    const valid = ['home', 'explore', 'routes', 'profile', 'settings', 'journey', 'journey-stats', 'topic', 'lesson', 'achievements'];
    if (valid.includes(hash)) showScreen(hash);
    else {
      paintSidebar('home');
      paintDrawer('home');
      paintBottomNav('home');
    }
    lucide.createIcons();
  });
})();
