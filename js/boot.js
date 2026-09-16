/* ==========================================================================
   boot.js — загрузка системы: BIOS → заставка → вход
   --------------------------------------------------------------------------
   Первые секунды на сайте. Вся последовательность пропускается кликом или
   любой клавишей, а после первого визита не показывается вовсе — иначе
   красивая заставка превращается в препятствие.
   ========================================================================== */

const Boot = (() => {
  'use strict';

  const SEEN_KEY = 'rk.booted';
  const t = k => I18N.t(k);

  let skipped = false;
  let timers = [];

  const wait = ms => new Promise(res => timers.push(setTimeout(res, ms)));
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

  function seen() {
    try { return localStorage.getItem(SEEN_KEY) === '1'; } catch (e) { return false; }
  }
  function markSeen() {
    try { localStorage.setItem(SEEN_KEY, '1'); } catch (e) { /* приватный режим */ }
  }

  function show(id) {
    document.querySelectorAll('#boot > section').forEach(s => s.classList.toggle('on', s.id === id));
  }

  /* ── Экран BIOS ────────────────────────────────────────────────────────── */

  async function bios() {
    show('bios');
    const host = document.querySelector('#bios pre');
    const hint = document.getElementById('bios-hint');
    hint.textContent = t('biosSkip');

    const lines = BIOS_LINES[I18N.lang] || BIOS_LINES.ru;
    host.textContent = '';

    for (const line of lines) {
      if (skipped) return;
      host.textContent += line + '\n';
      await wait(line === '' ? 40 : 95);
    }
    if (!skipped) await wait(350);
  }

  /* ── Заставка ──────────────────────────────────────────────────────────── */

  async function splash() {
    if (skipped) return;
    show('splash');
    document.getElementById('splash-edition').textContent = t('splashEdition');
    document.getElementById('splash-note').textContent = t('splashNote');
    document.getElementById('splash-foot').textContent = t('splashFoot');
    await wait(2200);
  }

  /* ── Экран входа ───────────────────────────────────────────────────────── */

  function logon() {
    return new Promise(resolve => {
      if (skipped) { resolve(); return; }
      show('logon');

      const host = document.getElementById('logon-box');
      host.innerHTML = `
        <div class="logon-head">
          <img src="img/icons/flag.svg" alt="" width="48" height="48">
          <div>
            <b></b>
            <p></p>
          </div>
        </div>
        <div class="logon-fields">
          <div class="logon-row">
            <label for="logon-user"></label>
            <input class="field" id="logon-user" type="text" value="Roman Kolchin" readonly>
          </div>
          <div class="logon-row">
            <label for="logon-pass"></label>
            <input class="field" id="logon-pass" type="password" value="pythonista" readonly>
          </div>
          <div class="logon-row">
            <label for="logon-domain"></label>
            <input class="field" id="logon-domain" type="text" value="RUSTAT" readonly>
          </div>
        </div>
        <div class="logon-actions">
          <button class="default" id="logon-ok"></button>
          <button id="logon-cancel"></button>
        </div>
      `;

      host.querySelector('.logon-head b').textContent = t('logonWelcome');
      host.querySelector('.logon-head p').textContent = t('logonHint');
      host.querySelector('label[for="logon-user"]').textContent = t('logonUser');
      host.querySelector('label[for="logon-pass"]').textContent = t('logonPass');
      host.querySelector('label[for="logon-domain"]').textContent = t('logonDomain');

      const ok = host.querySelector('#logon-ok');
      const cancel = host.querySelector('#logon-cancel');
      ok.textContent = t('logonEnter');
      cancel.textContent = t('cancel');

      const enter = () => { cleanup(); resolve(); };
      const cleanup = () => {
        document.removeEventListener('keydown', onKey);
        ok.removeEventListener('click', enter);
      };
      const onKey = e => { if (e.key === 'Enter') enter(); };

      ok.addEventListener('click', enter);
      cancel.addEventListener('click', () => {
        // «Отмена» на экране входа никого не выгоняет — просто шутка
        cancel.textContent = t('logonEnter') === 'OK' ? t('ok') : t('ok');
        enter();
      });
      document.addEventListener('keydown', onKey);
      setTimeout(() => ok.focus(), 50);
    });
  }

  /* ── Переход к рабочему столу ──────────────────────────────────────────── */

  function toDesktop() {
    clearTimers();
    detachSkip();
    markSeen();
    const boot = document.getElementById('boot');
    boot.style.transition = 'opacity .35s';
    boot.style.opacity = '0';
    setTimeout(() => { boot.hidden = true; boot.style.display = 'none'; }, 360);
  }

  /* ── Пропуск ───────────────────────────────────────────────────────────── */

  function onSkip(e) {
    // Клики по экрану входа пропуском не считаются — там уже есть кнопка
    if (document.getElementById('logon').classList.contains('on')) return;
    if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) return;
    skipped = true;
    clearTimers();
    toDesktop();
  }

  function attachSkip() {
    document.addEventListener('keydown', onSkip);
    document.addEventListener('pointerdown', onSkip);
  }
  function detachSkip() {
    document.removeEventListener('keydown', onSkip);
    document.removeEventListener('pointerdown', onSkip);
  }

  /* ── Завершение работы и перезагрузка ──────────────────────────────────── */

  function replay(mode) {
    const boot = document.getElementById('boot');
    boot.hidden = false;
    boot.style.display = '';
    boot.style.opacity = '1';
    skipped = false;

    show('splash');
    document.getElementById('splash-edition').textContent = '';
    document.getElementById('splash-note').textContent =
      mode === 'restart' ? t('shutdownOpt2') : t('shutdownOpt1');

    setTimeout(() => {
      if (mode === 'restart') { start(true); return; }
      // Финальный экран: тот самый чёрный фон с оранжевой надписью
      show('off');
      const host = document.getElementById('off');
      host.querySelector('p').textContent =
        I18N.lang === 'ru' ? 'Теперь питание компьютера можно отключить.'
        : I18N.lang === 'ja' ? 'コンピュータの電源を切ることができます。'
        : "It's now safe to turn off your computer.";
      const btn = host.querySelector('button');
      btn.textContent = I18N.lang === 'ru' ? 'Включить снова'
        : I18N.lang === 'ja' ? '電源を入れる' : 'Turn it back on';
      btn.onclick = () => start(true);
    }, 1600);
  }

  /* ── Точка входа ───────────────────────────────────────────────────────── */

  async function start(force) {
    const boot = document.getElementById('boot');

    // Пришли по прямой ссылке на окно или уже видели загрузку — сразу стол
    if (!force && (seen() || Shell.hasDeepLink())) {
      boot.hidden = true;
      boot.style.display = 'none';
      return;
    }

    boot.hidden = false;
    boot.style.display = '';
    boot.style.opacity = '1';
    skipped = false;
    attachSkip();

    await bios();
    if (skipped) return;
    await splash();
    if (skipped) return;
    await logon();
    if (skipped) return;
    toDesktop();
  }

  return { start, replay };
})();

/* ── Инициализация страницы ─────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  Shell.boot();
  Boot.start(false);
});
