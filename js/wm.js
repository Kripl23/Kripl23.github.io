/* ==========================================================================
   wm.js — оконный менеджер
   --------------------------------------------------------------------------
   Отвечает за всё, что связано с окнами: создание, перетаскивание, изменение
   размера, фокус и z-порядок, сворачивание/разворачивание/закрытие.
   О содержимом окон не знает ничего — приложения регистрируются снаружи
   через WM.register() и отдают готовый DOM-узел.

   На узких экранах и на тач-устройствах окна всегда развёрнуты на весь
   экран: перетаскивание там бесполезно, а попытка его сохранить ломает
   прокрутку внутри окна.
   ========================================================================== */

const WM = (() => {
  'use strict';

  const apps = new Map();   // appId -> конфигурация приложения
  const open = new Map();   // winId -> { el, appId, minimized, saved }
  const listeners = [];

  let layer = null;         // контейнер окон (#desktop)
  let zTop = 100;
  let seq = 0;              // счётчик для уникальных id окон
  let cascade = 0;          // смещение каждого следующего окна

  const MOBILE = '(max-width: 720px), (pointer: coarse)';
  const isMobile = () => window.matchMedia(MOBILE).matches;

  /* ── Масштаб ───────────────────────────────────────────────────────── */
  /* Вся оболочка увеличена через CSS zoom на <html>. Из-за этого координаты
     событий мыши, getBoundingClientRect и innerWidth приходят в экранных
     пикселях, а style.left, offsetWidth и прочая геометрия элементов — в
     «локальных», до масштабирования. Все расчёты ведём в локальных:
     экранные значения делим на Z. */

  const Z = () => {
    const z = parseFloat(getComputedStyle(document.documentElement).zoom);
    return z > 0 ? z : 1;
  };
  /** Прямоугольник элемента в локальных пикселях. */
  const rect = node => {
    const r = node.getBoundingClientRect(), z = Z();
    return { left: r.left / z, top: r.top / z, right: r.right / z, bottom: r.bottom / z,
             width: r.width / z, height: r.height / z };
  };
  /** Координаты указателя в локальных пикселях. */
  const ptr = e => { const z = Z(); return { x: e.clientX / z, y: e.clientY / z }; };
  const vw = () => window.innerWidth / Z();
  const vh = () => window.innerHeight / Z();

  /* ── Служебное ─────────────────────────────────────────────────────── */

  function emit() { listeners.forEach(fn => fn(list())); }

  function list() {
    return [...open.entries()].map(([id, w]) => ({
      id,
      appId: w.appId,
      title: w.el.querySelector('.win-caption').textContent,
      icon: apps.get(w.appId)?.icon || null,
      minimized: w.minimized,
      active: w.el.classList.contains('active'),
    }));
  }

  /** Заголовок приложения может быть строкой или функцией — чтобы он
      пересчитывался при смене языка и учитывал параметры запуска
      (например, имя открытого в «Блокноте» файла). */
  const resolve = (v, params) => (typeof v === 'function' ? v(params) : v);

  /* ── Публичный API ─────────────────────────────────────────────────── */

  /**
   * Зарегистрировать приложение.
   * @param {string} appId
   * @param {object} cfg
   *   title      строка или функция — подпись в заголовке и на таскбаре
   *   icon       путь к иконке 16×16
   *   body       функция, возвращающая DOM-узел с содержимым окна
   *   menubar    строка меню: массив (или функция, его возвращающая) из
   *              строк — тогда пункты декоративные — либо объектов
   *              { label, items: [{ label, action, checked, sep }] }
   *              для настоящего выпадающего меню
   *   status     массив строк строки состояния, или функция (необязательно)
   *   width      начальная ширина, px
   *   height     начальная высота, px
   *   resizable  можно ли менять размер (по умолчанию true)
   *   singleton  если true — второй экземпляр не создаётся, фокусируется
   *              уже открытый (по умолчанию true)
   *   flush      убрать отступы у тела окна (для списков и таблиц)
   *   fill       содержимое растягивается на всю высоту окна
   *   onMount    колбэк после вставки окна в DOM, получает (body, winEl)
   */
  function register(appId, cfg) {
    apps.set(appId, Object.assign({
      icon: 'img/icons/app.svg',
      width: 520,
      height: 380,
      resizable: true,
      singleton: true,
      flush: false,
    }, cfg));
  }

  function launch(appId, params) {
    const cfg = apps.get(appId);
    if (!cfg) { console.warn('WM: неизвестное приложение', appId); return null; }

    if (cfg.singleton) {
      for (const [id, w] of open) {
        if (w.appId === appId) { focus(id); return id; }
      }
    }
    return create(appId, cfg, params);
  }

  function create(appId, cfg, params) {
    const winId = `win-${++seq}`;
    const el = document.createElement('div');
    el.className = 'win';
    el.id = winId;
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', resolve(cfg.title, params));

    el.innerHTML = `
      <div class="win-title">
        <img alt="" src="${cfg.icon}">
        <span class="win-caption"></span>
        <div class="win-buttons">
          <button class="tb-btn" data-act="min" aria-label="Свернуть" title="Свернуть"></button>
          <button class="tb-btn" data-act="max" aria-label="Развернуть" title="Развернуть"></button>
          <button class="tb-btn" data-act="close" aria-label="Закрыть" title="Закрыть"></button>
        </div>
      </div>
      ${cfg.menubar ? '<div class="win-menubar"></div>' : ''}
      <div class="win-body${cfg.flush ? ' flush' : ''}${cfg.fill ? ' fill' : ''}"></div>
      ${cfg.status ? `<div class="win-status">${resolve(cfg.status).map(s => `<span>${s}</span>`).join('')}</div>` : ''}
      ${cfg.resizable ? '<div class="win-resize"></div>' : ''}
    `;

    el.querySelector('.win-caption').textContent = resolve(cfg.title, params);
    if (cfg.menubar) paintMenubar(el.querySelector('.win-menubar'), cfg.menubar);

    const body = el.querySelector('.win-body');
    const content = cfg.body ? cfg.body(params) : null;
    if (content) {
      if (typeof content === 'string') body.innerHTML = content;
      else body.appendChild(content);
    }

    placeInitial(el, cfg);
    layer.appendChild(el);

    const rec = { el, appId, minimized: false, saved: null, params };
    open.set(winId, rec);

    wireControls(winId, rec);
    wireDrag(winId, rec);
    if (cfg.resizable) wireResize(winId, rec);

    if (isMobile()) el.classList.add('maximized');

    focus(winId);
    if (cfg.onMount) cfg.onMount(body, el, params);
    emit();
    return winId;
  }

  /** Первичное размещение: по центру рабочего стола со сдвигом каскадом,
      чтобы окна не ложились друг на друга ровно. */
  function placeInitial(el, cfg) {
    const area = rect(layer);
    const w = Math.min(cfg.width, area.width - 16);
    const h = Math.min(cfg.height, area.height - 16);
    const step = (cascade % 6) * 22;
    cascade++;

    let left = Math.round((area.width - w) / 2) + step - 55;
    let top = Math.round((area.height - h) / 2) + step - 55;
    left = Math.max(8, Math.min(left, area.width - w - 8));
    top = Math.max(8, Math.min(top, area.height - h - 8));

    el.style.width = w + 'px';
    el.style.height = h + 'px';
    el.style.left = left + 'px';
    el.style.top = top + 'px';
  }

  /* ── Строка меню ───────────────────────────────────────────────────── */

  let menuOpen = null;   // открытое выпадающее меню строки меню

  function closeMenubar() {
    if (menuOpen) { menuOpen.el.remove(); menuOpen.owner.classList.remove('active'); menuOpen = null; }
  }
  document.addEventListener('pointerdown', e => {
    if (menuOpen && !e.target.closest('.menubar-drop') && !e.target.closest('.win-menubar')) closeMenubar();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenubar(); });

  function paintMenubar(bar, spec) {
    bar.innerHTML = '';
    resolve(spec).forEach(entry => {
      // Строка — декоративный пункт, объект — настоящее меню
      const label = typeof entry === 'string' ? entry : entry.label;
      const item = document.createElement('span');
      item.textContent = label;
      bar.appendChild(item);
      if (typeof entry === 'string' || !entry.items) return;

      item.addEventListener('pointerdown', e => {
        e.stopPropagation();
        const wasOpen = menuOpen && menuOpen.owner === item;
        closeMenubar();
        if (wasOpen) return;

        const drop = document.createElement('div');
        drop.className = 'menubar-drop';
        entry.items.forEach(sub => {
          if (sub.sep) { drop.appendChild(Object.assign(document.createElement('div'), { className: 'menu-sep' })); return; }
          const btn = document.createElement('button');
          btn.className = 'menubar-item' + (sub.checked ? ' checked' : '');
          btn.textContent = sub.label;
          btn.addEventListener('click', () => { closeMenubar(); if (sub.action) sub.action(); });
          drop.appendChild(btn);
        });
        document.body.appendChild(drop);

        const r = rect(item);
        drop.style.left = Math.min(r.left, vw() - drop.offsetWidth - 4) + 'px';
        drop.style.top = Math.min(r.bottom, vh() - drop.offsetHeight - 34) + 'px';
        item.classList.add('active');
        menuOpen = { el: drop, owner: item };
      });
    });
  }

  function wireControls(winId, rec) {
    rec.el.querySelector('.win-buttons').addEventListener('click', e => {
      const btn = e.target.closest('.tb-btn');
      if (!btn) return;
      e.stopPropagation();
      const act = btn.dataset.act;
      if (act === 'close') close(winId);
      else if (act === 'min') minimize(winId);
      else if (act === 'max') toggleMax(winId);
    });

    // Двойной клик по заголовку разворачивает окно
    rec.el.querySelector('.win-title').addEventListener('dblclick', e => {
      if (e.target.closest('.tb-btn')) return;
      toggleMax(winId);
    });

    // Клик в любом месте окна поднимает его наверх
    rec.el.addEventListener('pointerdown', () => focus(winId), true);
  }

  /* ── Перетаскивание ────────────────────────────────────────────────── */

  function wireDrag(winId, rec) {
    const bar = rec.el.querySelector('.win-title');
    let dx = 0, dy = 0, dragging = false;

    bar.addEventListener('pointerdown', e => {
      if (e.target.closest('.tb-btn')) return;
      if (isMobile() || rec.el.classList.contains('maximized')) return;
      if (e.button !== undefined && e.button !== 0) return;

      dragging = true;
      const r = rect(rec.el);
      const a = rect(layer);
      const p = ptr(e);
      dx = p.x - r.left;
      dy = p.y - r.top;
      try { bar.setPointerCapture(e.pointerId); } catch (err) { /* нет активного указателя */ }
      focus(winId);

      const move = ev => {
        if (!dragging) return;
        // Заголовок не должен уезжать за пределы рабочего стола —
        // иначе окно уже не поймать мышью.
        const maxLeft = a.width - 60;
        const maxTop = a.height - 24;
        const q = ptr(ev);
        const left = Math.max(60 - rec.el.offsetWidth, Math.min(q.x - a.left - dx, maxLeft));
        const top = Math.max(0, Math.min(q.y - a.top - dy, maxTop));
        rec.el.style.left = Math.round(left) + 'px';
        rec.el.style.top = Math.round(top) + 'px';
      };
      const up = () => {
        dragging = false;
        bar.removeEventListener('pointermove', move);
        bar.removeEventListener('pointerup', up);
        bar.removeEventListener('pointercancel', up);
      };
      bar.addEventListener('pointermove', move);
      bar.addEventListener('pointerup', up);
      bar.addEventListener('pointercancel', up);
    });
  }

  /* ── Изменение размера ─────────────────────────────────────────────── */

  function wireResize(winId, rec) {
    const grip = rec.el.querySelector('.win-resize');
    if (!grip) return;

    grip.addEventListener('pointerdown', e => {
      if (isMobile() || rec.el.classList.contains('maximized')) return;
      e.stopPropagation();

      const r = rect(rec.el);
      const a = rect(layer);
      const s0 = ptr(e);
      const sx = s0.x, sy = s0.y;
      const sw = r.width, sh = r.height;
      try { grip.setPointerCapture(e.pointerId); } catch (err) { /* нет активного указателя */ }
      focus(winId);

      const move = ev => {
        const q = ptr(ev);
        const w = Math.max(240, Math.min(sw + (q.x - sx), a.width - rec.el.offsetLeft));
        const h = Math.max(120, Math.min(sh + (q.y - sy), a.height - rec.el.offsetTop));
        rec.el.style.width = Math.round(w) + 'px';
        rec.el.style.height = Math.round(h) + 'px';
      };
      const up = () => {
        grip.removeEventListener('pointermove', move);
        grip.removeEventListener('pointerup', up);
        grip.removeEventListener('pointercancel', up);
      };
      grip.addEventListener('pointermove', move);
      grip.addEventListener('pointerup', up);
      grip.addEventListener('pointercancel', up);
    });
  }

  /* ── Состояния окна ────────────────────────────────────────────────── */

  function focus(winId) {
    const rec = open.get(winId);
    if (!rec) return;
    if (rec.minimized) { rec.minimized = false; rec.el.classList.remove('minimized'); }
    open.forEach(w => w.el.classList.remove('active'));
    rec.el.classList.add('active');
    rec.el.style.zIndex = ++zTop;
    emit();
  }

  function minimize(winId) {
    const rec = open.get(winId);
    if (!rec) return;
    rec.minimized = true;
    rec.el.classList.add('minimized');
    rec.el.classList.remove('active');
    // Фокус переходит к самому верхнему из оставшихся окон
    const rest = [...open.entries()].filter(([, w]) => !w.minimized);
    if (rest.length) {
      rest.sort((a, b) => (+a[1].el.style.zIndex || 0) - (+b[1].el.style.zIndex || 0));
      focus(rest[rest.length - 1][0]);
    } else emit();
  }

  function toggleMax(winId) {
    const rec = open.get(winId);
    if (!rec) return;
    const el = rec.el;
    if (el.classList.contains('maximized')) {
      el.classList.remove('maximized');
      if (rec.saved) Object.assign(el.style, rec.saved);
    } else {
      rec.saved = { left: el.style.left, top: el.style.top, width: el.style.width, height: el.style.height };
      el.classList.add('maximized');
    }
    focus(winId);
  }

  function close(winId) {
    const rec = open.get(winId);
    if (!rec) return;
    const cfg = apps.get(rec.appId);
    if (cfg && cfg.onClose) cfg.onClose(rec.el);
    rec.el.remove();
    open.delete(winId);
    const rest = [...open.entries()].filter(([, w]) => !w.minimized);
    if (rest.length) {
      rest.sort((a, b) => (+a[1].el.style.zIndex || 0) - (+b[1].el.style.zIndex || 0));
      focus(rest[rest.length - 1][0]);
    } else emit();
  }

  function closeAll() {
    [...open.keys()].forEach(close);
  }

  function toggle(winId) {
    const rec = open.get(winId);
    if (!rec) return;
    if (rec.minimized) focus(winId);
    else if (rec.el.classList.contains('active')) minimize(winId);
    else focus(winId);
  }

  /** Пересобрать заголовки и содержимое всех окон — вызывается при смене
      языка. Позиция, размер и состояние сохраняются. */
  function rebuild() {
    open.forEach((rec, winId) => {
      const cfg = apps.get(rec.appId);
      if (!cfg) return;
      rec.el.querySelector('.win-caption').textContent = resolve(cfg.title, rec.params);
      rec.el.setAttribute('aria-label', resolve(cfg.title, rec.params));

      const bar = rec.el.querySelector('.win-menubar');
      if (bar && cfg.menubar) paintMenubar(bar, cfg.menubar);

      const st = rec.el.querySelector('.win-status');
      if (st && cfg.status) st.innerHTML = resolve(cfg.status).map(s => `<span>${s}</span>`).join('');

      if (cfg.body) {
        const body = rec.el.querySelector('.win-body');
        const scroll = body.scrollTop;
        body.innerHTML = '';
        const content = cfg.body(rec.params);
        if (typeof content === 'string') body.innerHTML = content;
        else if (content) body.appendChild(content);
        if (cfg.onMount) cfg.onMount(body, rec.el, rec.params);
        body.scrollTop = scroll;
      }
    });
    emit();
  }

  /**
   * Модальное окно-сообщение в стиле MessageBox.
   * @returns {Promise<string>} идентификатор нажатой кнопки
   */
  function message({ title = 'Windows', icon = 'img/icons/msg-info.svg', text = '', buttons = [{ id: 'ok', label: 'OK', def: true }] }) {
    return new Promise(resolve => {
      const el = document.createElement('div');
      el.className = 'win active';
      el.setAttribute('role', 'alertdialog');
      el.innerHTML = `
        <div class="win-title">
          <span class="win-caption"></span>
          <div class="win-buttons">
            <button class="tb-btn" data-act="close" aria-label="Закрыть"></button>
          </div>
        </div>
        <div class="win-body">
          <div class="msgbox">
            <img alt="" src="${icon}">
            <p></p>
          </div>
          <div class="dialog-buttons"></div>
        </div>
      `;
      el.querySelector('.win-caption').textContent = title;
      el.querySelector('.msgbox p').innerHTML = text;

      const row = el.querySelector('.dialog-buttons');
      buttons.forEach(b => {
        const btn = document.createElement('button');
        btn.textContent = b.label;
        if (b.def) btn.className = 'default';
        btn.addEventListener('click', () => { el.remove(); resolve(b.id); });
        row.appendChild(btn);
      });
      el.querySelector('[data-act="close"]').addEventListener('click', () => { el.remove(); resolve('close'); });

      el.style.zIndex = ++zTop;
      el.style.width = Math.min(380, Math.round(vw() * 0.88)) + 'px';
      el.style.height = 'auto';
      el.style.minHeight = '0';
      layer.appendChild(el);

      const a = rect(layer);
      const r = rect(el);
      el.style.left = Math.max(8, Math.round((a.width - r.width) / 2)) + 'px';
      el.style.top = Math.max(8, Math.round((a.height - r.height) / 2.4)) + 'px';

      // Диалог тоже можно таскать за заголовок
      const rec = { el, appId: '__msg', minimized: false };
      wireDrag('__msg-' + (++seq), rec);

      const def = row.querySelector('.default') || row.firstElementChild;
      if (def) def.focus();
    });
  }

  function init(layerEl) {
    layer = layerEl;

    // Esc закрывает активное окно
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      const active = [...open.entries()].find(([, w]) => w.el.classList.contains('active'));
      if (active) close(active[0]);
    });

    // При переходе через мобильную границу приводим окна в нужный режим
    const mq = window.matchMedia(MOBILE);
    const sync = () => {
      open.forEach(rec => {
        if (mq.matches) rec.el.classList.add('maximized');
        else if (rec.el.classList.contains('maximized') && rec.saved) {
          rec.el.classList.remove('maximized');
          Object.assign(rec.el.style, rec.saved);
        }
      });
    };
    mq.addEventListener ? mq.addEventListener('change', sync) : mq.addListener(sync);

    // Окно браузера уменьшилось — возвращаем уехавшие окна на рабочий стол
    window.addEventListener('resize', () => {
      const a = rect(layer);
      open.forEach(rec => {
        if (rec.el.classList.contains('maximized')) return;
        const left = parseInt(rec.el.style.left, 10) || 0;
        const top = parseInt(rec.el.style.top, 10) || 0;
        rec.el.style.left = Math.min(left, Math.max(8, a.width - 80)) + 'px';
        rec.el.style.top = Math.min(top, Math.max(8, a.height - 30)) + 'px';
      });
    });
  }

  return {
    init, register, launch, close, closeAll, focus, minimize, toggle, toggleMax,
    rebuild, message, list, isMobile,
    rect, ptr, vw, vh,
    onChange: fn => listeners.push(fn),
    isOpen: appId => [...open.values()].some(w => w.appId === appId),
  };
})();
