/* Learnia — progreso local, sin servidor */
(function () {
  const STORAGE_KEY = 'learnia-progress-v1';
  const TAB_SCREENS = ['home', 'explore', 'routes', 'profile'];
  const DETAIL_SCREENS = ['topic', 'journey-stats', 'journey', 'lesson'];

  let state = defaultState();
  let lastTab = 'home';
  let currentTopicId = null;
  let currentLessonId = null;
  let lessonStartedAt = null;
  let quizAnswered = false;

  const allLessons = () =>
    RUTA_ESPAÑOLA.topics.flatMap((t) => t.lessons.map((l) => ({ ...l, topicId: t.id })));

  const totalLessons = () => allLessons().length;

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
    document.getElementById('sidebar-streak').textContent = state.streak;
    document.getElementById('drawer-streak').textContent = state.streak;
    document.getElementById('streak-count').textContent = state.streak;
    document.getElementById('hero-progress-text').textContent = done + ' / ' + total;
    document.querySelector('.hero-bar').style.width = pct + '%';
    document.getElementById('home-ring-text').textContent = done + ' / ' + total;
    document.getElementById('ring-home').setAttribute('stroke-dashoffset', ringOffset(done, total));

    const complete = done >= total;
    document.getElementById('home-congrats').classList.toggle('hidden', !complete);
    document.getElementById('home-congrats-msg').classList.toggle('hidden', !complete);
    document.getElementById('home-keep-going').classList.toggle('hidden', complete);

    document.getElementById('stat-streak').textContent = state.streak + ' días';
    document.getElementById('stat-time').textContent = formatTime(state.studyMinutes);
    document.getElementById('stat-lessons').textContent = done;
    document.getElementById('stat-points').textContent = state.points.toLocaleString('es-ES');

    document.getElementById('sidebar-level').textContent = level;
    document.getElementById('sidebar-level-bar').style.width = (state.points % 100) + '%';

    const initials = name.trim().charAt(0).toUpperCase() || 'A';
    document.getElementById('profile-initials').textContent = initials;
    const nameInput = document.getElementById('profile-name-input');
    if (document.activeElement !== nameInput) nameInput.value = name;
    document.getElementById('profile-level').textContent = level;
    document.getElementById('profile-title').textContent = levelTitle(level);
    document.getElementById('profile-lessons').textContent = done;
    document.getElementById('profile-streak').textContent = state.streak;
    document.getElementById('profile-points').textContent = state.points.toLocaleString('es-ES');

    renderTopicsGrid();
    renderRoutes();
    renderAchievements();
    renderHomeAchievements();
    if (currentTopicId) renderTopic(currentTopicId);
    lucide.createIcons();
  }

  function renderTopicsGrid() {
    const grid = document.getElementById('topics-grid');
    const currentId = getCurrentTopicId();
    grid.innerHTML = RUTA_ESPAÑOLA.topics
      .map((topic) => {
        const { done, total } = topicProgress(topic);
        const complete = done >= total;
        const isCurrent = topic.id === currentId && !complete;
        const activeClass = isCurrent ? ' topic-card--active' : '';
        const footer = complete
          ? `<div class="topic-card__footer border-t-2 mt-3 pt-2.5 flex items-center gap-1.5" style="border-color:var(--divider)">
              <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-[var(--green)]"></i>
              <span class="text-[11px] font-bold text-[var(--brand-700)]">Completado</span>
            </div>`
          : isCurrent
            ? `<div class="topic-card__footer flex items-center justify-center">
                <span class="text-[11px] font-bold">${done} / ${total} lecciones</span>
              </div>`
            : `<div class="topic-card__footer border-t-2 mt-3 pt-2.5 flex items-center gap-1.5" style="border-color:var(--divider)">
                <span class="text-[11px] font-bold text-slate-400">${done} / ${total}</span>
              </div>`;
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
    document.getElementById('routes-list').innerHTML = `
      <button type="button" onclick="showScreen('journey')" class="tap text-left hero-gradient rounded-[22px] p-5 accent-shadow w-full">
        <p class="text-[11px] uppercase tracking-[0.14em] font-bold text-violet-200/85">${label}</p>
        <p class="text-[18px] font-extrabold text-white mt-1">${RUTA_ESPAÑOLA.title} ${RUTA_ESPAÑOLA.flag}</p>
        <p class="text-[12px] text-violet-100/80 font-medium mt-1">${done} / ${total} lecciones · 6 módulos</p>
        <div class="w-full bg-white/20 h-1.5 rounded-full mt-3 overflow-hidden">
          <div class="bg-white h-full rounded-full" style="width:${pct}%"></div>
        </div>
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
          <div class="mt-5">
            <div class="flex justify-between text-[11.5px] font-bold mb-2">
              <span class="text-slate-400 font-semibold">Progreso del tema</span>
              <span class="text-[var(--brand-700)] font-extrabold">${done} / ${total}</span>
            </div>
            <div class="w-full bg-[var(--brand-50)] h-[7px] rounded-full overflow-hidden">
              <div class="bar-progress bg-[var(--brand-700)] h-full rounded-full" style="width:${pct}%"></div>
            </div>
          </div>
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

  function renderLesson(lessonId) {
    const lesson = getLesson(lessonId);
    if (!lesson) return;
    const topic = getTopic(lesson.topicId);
    const done = isDone(lessonId);
    quizAnswered = done;

    const blocksHtml = lesson.blocks
      .map((b) => {
        if (b.type === 'tip') return `<div class="lesson-tip">${escapeHtml(b.text)}</div>`;
        return `<p>${escapeHtml(b.text)}</p>`;
      })
      .join('');

    const quizHtml = lesson.quiz
      ? `<div class="mt-6 bg-white rounded-2xl border border-slate-100 p-5 soft-shadow" id="quiz-box">
          <p class="text-[13px] font-extrabold text-slate-900 mb-3">Comprueba lo aprendido</p>
          <p class="text-[13.5px] font-semibold text-slate-700 mb-3">${escapeHtml(lesson.quiz.question)}</p>
          <div class="flex flex-col gap-2" id="quiz-options">
            ${lesson.quiz.options
              .map(
                (opt, i) =>
                  `<button type="button" data-idx="${i}" onclick="pickQuiz(${i})" class="quiz-option tap text-left w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-700">${escapeHtml(opt)}</button>`
              )
              .join('')}
          </div>
          <p id="quiz-feedback" class="text-[12px] font-semibold mt-3 hidden"></p>
        </div>`
      : '';

    document.getElementById('lesson-root').innerHTML = `
      <button type="button" onclick="openTopic('${lesson.topicId}')" class="tap flex items-center gap-2 text-[13px] font-bold text-slate-500 mb-4">
        <i data-lucide="arrow-left" class="w-4 h-4"></i> ${escapeHtml(topic.title)}
      </button>
      <div class="bg-white rounded-3xl border border-slate-100 p-5 soft-shadow-lg">
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
      </button>`;

    if (done) enableCompleteButton(true);
    lessonStartedAt = Date.now();
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
          <div class="flex justify-between"><span class="text-slate-500">Racha</span><span class="font-extrabold">${state.streak} días</span></div>
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

  window.pickQuiz = function (idx) {
    if (quizAnswered) return;
    const lesson = getLesson(currentLessonId);
    if (!lesson || !lesson.quiz) return;
    const correct = lesson.quiz.correct;
    const feedback = document.getElementById('quiz-feedback');
    document.querySelectorAll('.quiz-option').forEach((btn, i) => {
      btn.classList.remove('selected', 'correct', 'wrong');
      if (i === idx) btn.classList.add(idx === correct ? 'correct' : 'wrong');
      else if (i === correct) btn.classList.add('correct');
    });
    if (idx === correct) {
      quizAnswered = true;
      feedback.textContent = '¡Correcto! Ya puedes completar la lección.';
      feedback.className = 'text-[12px] font-semibold mt-3 text-green-600';
      enableCompleteButton(false);
    } else {
      feedback.textContent = 'Casi — léelo otra vez e inténtalo de nuevo.';
      feedback.className = 'text-[12px] font-semibold mt-3 text-red-500';
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
    saveState();
    toast('¡Lección completada! +50 puntos');
    renderLesson(currentLessonId);

    const next = getNextLesson();
    if (next) {
      setTimeout(() => {
        if (confirm('¿Siguiente lección?')) openLesson(next.id);
      }, 400);
    }
  };

  window.exportProgress = function () {
    const payload = {
      ...state,
      exportedAt: new Date().toISOString(),
      app: 'Learnia',
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

  window.resetProgress = function () {
    if (!confirm('¿Borrar todo el progreso de este dispositivo? Puedes importarlo antes si lo guardaste.')) return;
    state = defaultState();
    saveState();
    toast('Progreso borrado');
    showScreen('home');
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

  window.addEventListener('DOMContentLoaded', () => {
    state = loadState();
    renderAll();

    const hash = location.hash.replace('#', '');
    const valid = ['home', 'explore', 'routes', 'profile', 'journey', 'journey-stats', 'topic', 'lesson', 'achievements'];
    if (valid.includes(hash)) showScreen(hash);
    else {
      paintSidebar('home');
      paintDrawer('home');
      paintBottomNav('home');
    }
    lucide.createIcons();
  });
})();
