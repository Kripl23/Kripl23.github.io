/* ==========================================================================
   app.js — оболочка: рабочий стол, таскбар, меню «Пуск» и все приложения
   --------------------------------------------------------------------------
   Тексты берутся из content.js, окна создаёт wm.js. Здесь — только сборка
   интерфейса и поведение конкретных окон.
   ========================================================================== */

(() => {
  'use strict';

  const t = k => I18N.t(k);
  const tx = o => I18N.tx(o);
  const icon = name => `img/icons/${name}.svg`;

  /** Мини-помощник для сборки DOM: el('div#id.cls.cls2', {attr}, ...дети) */
  function el(spec, attrs, ...kids) {
    const [head, ...cls] = spec.split('.');
    const [tag, id] = head.split('#');
    const node = document.createElement(tag || 'div');
    if (id) node.id = id;
    if (cls.length) node.className = cls.join(' ');
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (v === null || v === undefined || v === false) continue;
      if (k === 'html') node.innerHTML = v;
      else if (k === 'text') node.textContent = v;
      else if (k.startsWith('on')) node.addEventListener(k.slice(2).toLowerCase(), v);
      else node.setAttribute(k, v);
    }
    kids.flat().forEach(c => {
      if (c === null || c === undefined || c === false) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  const img16 = name => el('img', { src: icon(name), alt: '', width: 16, height: 16 });

  /* ══ Приложение: Мой компьютер (свойства системы) ═══════════════════════ */

  function buildAbout() {
    const wrap = el('div', { style: 'display:flex;flex-direction:column;min-height:0' });
    const names = ['tabGeneral', 'tabUser', 'tabHardware'];
    const tabs = el('div.tabs', { role: 'tablist', style: 'flex:none' });
    const panel = el('div.tab-panel');
    let current = 0;

    const panes = [paneGeneral, paneUser, paneHardware];

    function draw() {
      tabs.innerHTML = '';
      names.forEach((n, i) => {
        tabs.appendChild(el('button.tab', {
          role: 'tab',
          'aria-selected': String(i === current),
          onclick: () => { current = i; draw(); },
        }, t(n)));
      });
      panel.innerHTML = '';
      panel.appendChild(panes[current]());
    }

    draw();
    wrap.append(tabs, panel);
    return wrap;
  }

  function paneGeneral() {
    return el('div', null,
      el('div', { style: 'display:flex;gap:16px;align-items:flex-start' },
        el('img', { src: icon('my-computer'), alt: '', width: 48, height: 48 }),
        el('div', null,
          el('p', null, el('b', { text: t('sysHead') })),
          el('p', { text: t('sysVersion') }),
          el('p', { text: t('sysBuild') }),
        ),
      ),
      el('hr', { style: 'border:0;border-top:1px solid #808080;border-bottom:1px solid #fff;margin:12px 0' }),
      el('p', { text: t('sysRegistered') }),
      el('p', { style: 'margin-left:16px' },
        el('b', { text: t('sysName') }), el('br'),
        t('sysRole'), el('br'),
        t('sysLocation'),
      ),
      el('hr', { style: 'border:0;border-top:1px solid #808080;border-bottom:1px solid #fff;margin:12px 0' }),
      el('p', { style: 'color:#444', text: t('aboutMemory') }),
    );
  }

  function paneUser() {
    const photo = el('img', {
      src: 'img/photo.jpg', alt: '', width: 96, height: 120,
      style: 'width:96px;height:120px;object-fit:cover;display:block',
    });
    const frame = el('div.sunken', { style: 'padding:3px;flex:none;background:#fff' }, photo);
    photo.addEventListener('error', () => {
      frame.innerHTML = '';
      frame.appendChild(el('div', {
        style: 'width:96px;height:120px;display:grid;place-items:center;text-align:center;color:#808080;font-size:11px;padding:6px',
        text: 'img/photo.jpg',
      }));
    });

    return el('div', null,
      el('div', { style: 'display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap' },
        frame,
        el('div', { style: 'flex:1;min-width:200px' },
          el('h3', null, t('sysHi')),
          el('p.selectable', { text: t('sysBio1') }),
          el('p.selectable', { text: t('sysBio2') }),
        ),
      ),
      el('p.selectable', { style: 'margin-top:10px', text: t('sysBio3') }),
      el('div', { style: 'margin-top:12px' },
        el('button', { onclick: () => WM.launch('stack') }, t('iconStack')),
      ),
    );
  }

  function paneHardware() {
    const rows = [
      ['hwProcessor', 'hwProcessorV'],
      ['hwMemory', 'hwMemoryV'],
      ['hwStorage', 'hwStorageV'],
      ['hwUptime', 'hwUptimeV'],
      ['hwStatus', 'hwStatusV'],
    ];
    return el('div', null,
      el('fieldset.group', null,
        el('legend', { text: t('tabHardware') }),
        el('dl', { style: 'display:grid;grid-template-columns:max-content 1fr;gap:6px 14px;margin:0' },
          rows.flatMap(([k, v]) => [
            el('dt', { style: 'color:#333', text: t(k) }),
            el('dd', { style: 'margin:0', text: t(v) }),
          ]),
        ),
      ),
      el('p', { style: 'color:#444', text: t('hwNote') }),
    );
  }

  /* ══ Приложение: Установка и удаление программ (стек) ═══════════════════ */

  function buildStack() {
    const root = el('div#pane-stack');

    root.appendChild(el('div.pane-head', null,
      el('img', { src: icon('add-remove'), alt: '' }),
      el('div', null,
        el('b', { text: t('stackHeadTitle') }),
        el('span', { text: t('stackHeadNote') }),
      ),
    ));

    const list = el('div.stack-list.sunken');

    STACK.forEach(item => {
      const row = el('div.stack-row', null,
        img16(item.icon),
        el('span', { text: item.name }),
        el('span.stack-freq', { text: `${t('stackFreq')} ${t(item.freq)}` }),
      );

      const detail = el('div.stack-detail', null,
        el('p.selectable', { text: tx(item.desc) }),
        el('dl.stack-meta', null,
          el('dt', { text: t('stackSize') }), el('dd', { text: I18N.size(item.sizeMb) }),
          el('dt', { text: t('stackLast') }), el('dd', { text: t(item.last) }),
        ),
        el('div.stack-actions', null,
          el('button', { onclick: e => { e.stopPropagation(); changeDialog(); } }, t('change')),
          el('button', { onclick: e => { e.stopPropagation(); removeDialog(item); } }, t('remove')),
        ),
      );

      const box = el('div.stack-item', null, row, detail);
      if (item === STACK[0]) box.classList.add('open');
      row.addEventListener('click', () => {
        const wasOpen = box.classList.contains('open');
        list.querySelectorAll('.stack-item.open').forEach(n => n.classList.remove('open'));
        if (!wasOpen) box.classList.add('open');
      });
      list.appendChild(box);
    });

    root.appendChild(list);
    return root;
  }

  function changeDialog() {
    WM.message({
      title: t('changeTitle'), icon: icon('msg-info'), text: t('changeText'),
      buttons: [{ id: 'ok', label: t('ok'), def: true }],
    });
  }

  function removeDialog(item) {
    WM.message({
      title: t('removeTitle'),
      icon: icon(item.core ? 'msg-stop' : 'msg-warn'),
      text: item.core ? t('removeCore') : t('removeOther').replace('%s', item.name),
      buttons: [{ id: 'ok', label: t('ok'), def: true }],
    });
  }

  /* ══ Приложение: Свойства подключения (HTTP) ════════════════════════════ */

  function buildNetwork() {
    const items = DICT[I18N.lang]?.netItems || DICT.ru.netItems;
    return el('div', null,
      el('p', { text: t('netHead') }),
      el('div.sunken', { style: 'padding:5px 7px;margin-bottom:10px;display:flex;gap:7px;align-items:center' },
        el('span', { style: 'font-family:monospace', text: '☑' }),
        img16('web'),
        el('span', { text: t('netProto') }),
      ),
      el('fieldset.group', null,
        el('legend', { text: t('properties') }),
        el('p.selectable', { text: t('netProtoDesc') }),
        el('p', { style: 'margin-top:10px', text: t('netDetail') }),
        el('ul.selectable', { style: 'margin:4px 0 0;padding-left:20px' },
          items.map(x => el('li', { style: 'margin-bottom:3px', text: x })),
        ),
      ),
    );
  }

  /* ══ Приложение: Мои документы ══════════════════════════════════════════ */

  function buildDocs() {
    const table = el('table.listview');
    table.appendChild(el('thead', null, el('tr', null,
      el('th', { text: t('colName') }),
      el('th', { text: t('colSize') }),
      el('th', { text: t('colType') }),
      el('th', { text: t('colModified') }),
    )));

    const body = el('tbody');
    DOCS.forEach(doc => {
      const tr = el('tr', { tabindex: '0' },
        el('td.icon-cell', null, img16(doc.icon), el('span', { text: tx(doc.file) })),
        el('td', { text: I18N.sizeKb(doc.sizeKb) }),
        el('td', { text: t(doc.type) }),
        el('td', { text: tx(doc.modified) }),
      );
      const select = () => {
        body.querySelectorAll('tr.selected').forEach(n => n.classList.remove('selected'));
        tr.classList.add('selected');
      };
      const open = () => WM.launch('notepad', { docId: doc.id });
      tr.addEventListener('click', select);
      tr.addEventListener('dblclick', open);
      // На тач-устройствах двойного клика нет — открываем одним касанием
      tr.addEventListener('click', e => { if (WM.isMobile()) open(); });
      tr.addEventListener('keydown', e => { if (e.key === 'Enter') open(); });
      body.appendChild(tr);
    });

    table.appendChild(body);
    return el('div.table-scroll', { style: 'height:100%;background:#fff' }, table);
  }

  /* ══ Приложение: Блокнот ════════════════════════════════════════════════ */

  function buildNotepad(params) {
    const doc = DOCS.find(d => d.id === (params && params.docId)) || DOCS[0];
    return el('div.notepad-body.selectable', null,
      el('div', { style: 'font-weight:700;margin-bottom:10px', text: tx(doc.title) }),
      el('div', { text: tx(doc.body) }),
    );
  }

  /* ══ Приложение: Создать сообщение ══════════════════════════════════════ */

  function buildMail() {
    const subject = el('input.field', { type: 'text', value: t('mailSubjectValue') });
    const message = el('textarea.field', { rows: '7', style: 'width:100%' });
    message.value = t('mailBody');

    const send = () => {
      const href = 'mailto:krippi22322@gmail.com'
        + '?subject=' + encodeURIComponent(subject.value)
        + '&body=' + encodeURIComponent(message.value);
      window.location.href = href;
    };

    return el('div', null,
      el('div.mail-toolbar', null,
        el('button', { onclick: send, class: 'default' }, t('send')),
      ),
      el('div.mail-head', null,
        el('div.mail-row', null,
          el('label', { text: t('mailTo') }),
          el('div.field.selectable', { style: 'flex:1', text: 'krippi22322@gmail.com' }),
        ),
        el('div.mail-row', null,
          el('label', { text: t('mailSubject') }),
          subject,
        ),
      ),
      message,
      el('p', { style: 'color:#444;margin-top:8px', text: t('mailNote') }),
      el('fieldset.group', { style: 'margin-top:12px' },
        el('legend', { text: t('mailLinks') }),
        el('div', { style: 'display:grid;gap:6px' },
          LINKS.map(link => el('div', { style: 'display:flex;gap:8px;align-items:center' },
            img16(link.icon),
            el('span', { style: 'min-width:70px;color:#444', text: link.label }),
            el('a.selectable', { href: link.href, target: '_blank', rel: 'noopener' }, link.value),
          )),
        ),
      ),
    );
  }

  /* ══ Приложение: Корзина ════════════════════════════════════════════════ */

  function buildBin() {
    return el('div', null,
      el('div.sunken', { style: 'padding:8px;margin-bottom:10px;min-height:70px' },
        el('div', {
          style: 'display:inline-flex;flex-direction:column;align-items:center;gap:4px;width:92px;text-align:center',
        },
          el('img', { src: icon('app'), alt: '', width: 32, height: 32 }),
          el('span', { style: 'font-size:11px', text: t('binItem') }),
        ),
      ),
      el('button', {
        onclick: () => WM.message({
          title: t('binTitle'), icon: icon('msg-info'), text: t('binRestored'),
          buttons: [{ id: 'ok', label: t('ok'), def: true }],
        }),
      }, t('binRestore')),
    );
  }

  /* ══ Приложение: Выполнить ══════════════════════════════════════════════ */

  function buildRun() {
    const input = el('input.field', { type: 'text', style: 'flex:1', placeholder: '' });

    const go = () => {
      const cmd = input.value.trim().toLowerCase();
      if (!cmd) return;
      if (!runCommand(cmd)) {
        WM.message({
          title: t('runError'), icon: icon('msg-error'),
          text: t('runNotFound').replace('%s', input.value.trim()),
          buttons: [{ id: 'ok', label: t('ok'), def: true }],
        });
      }
    };

    input.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    setTimeout(() => input.focus(), 30);

    return el('div', null,
      el('div', { style: 'display:flex;gap:12px;align-items:flex-start' },
        el('img', { src: icon('run'), alt: '', width: 32, height: 32 }),
        el('p', { text: t('runHint') }),
      ),
      el('div', { style: 'display:flex;gap:8px;align-items:center;margin-top:12px' },
        el('label', { text: t('runLabel') }),
        input,
      ),
      el('div.dialog-buttons', null,
        el('button.default', { onclick: go }, t('ok')),
      ),
    );
  }

  /** Команды, которые понимает диалог «Выполнить». */
  function runCommand(cmd) {
    const map = {
      'notepad': () => WM.launch('notepad', { docId: 'resume' }),
      'winver': () => WM.launch('winver'),
      'control': () => WM.launch('stack'),
      'appwiz.cpl': () => WM.launch('stack'),
      'explorer': () => WM.launch('docs'),
      'sysdm.cpl': () => WM.launch('about'),
      'ncpa.cpl': () => WM.launch('network'),
      'mail': () => WM.launch('mail'),
      'python': () => WM.launch('stack'),
      'winmine': () => WM.launch('minesweeper'),
      'format c:': () => blueScreen(),
      'format c': () => blueScreen(),
    };
    if (map[cmd]) { map[cmd](); return true; }
    return false;
  }

  /* ══ Синий экран ════════════════════════════════════════════════════════ */

  function blueScreen() {
    const box = el('div#bsod', {
      html: `
        <p>A problem has been detected and Windows has been shut down to prevent
        damage to your computer.</p>
        <p><b>DEVELOPER_PORTFOLIO_FAULT</b></p>
        <p>If this is the first time you've seen this stop error screen,
        restart your computer. If this screen appears again, follow these steps:</p>
        <p>Check to make sure you did not try to format the drive that stores
        every project this person has ever written.</p>
        <p>Technical information:</p>
        <p>*** STOP: 0x000000C0FFEE (0x00000001, 0xDEADBEEF, 0x00000000, 0xCAFEBABE)</p>
        <p style="margin-top:2em">Restarting in <span id="bsod-count">5</span>...</p>
      `,
    });
    document.body.appendChild(box);

    let left = 5;
    const counter = box.querySelector('#bsod-count');
    const iv = setInterval(() => {
      left -= 1;
      if (counter) counter.textContent = String(left);
      if (left <= 0) { clearInterval(iv); box.remove(); }
    }, 1000);
    box.addEventListener('click', () => { clearInterval(iv); box.remove(); });
  }

  /* ══ Приложение: О программе ════════════════════════════════════════════ */

  function buildWinver() {
    return el('div', null,
      el('div', { style: 'display:flex;gap:14px;align-items:flex-start' },
        el('img', { src: icon('flag'), alt: '', width: 48, height: 48 }),
        el('div.selectable', { html: t('winverText') }),
      ),
      el('div.dialog-buttons', null,
        el('button.default', { onclick: () => WM.launch('mail') }, t('iconMail')),
      ),
    );
  }

  /* ══ Приложение: Завершение работы ══════════════════════════════════════ */

  function buildShutdown() {
    const opts = ['shutdownOpt1', 'shutdownOpt2', 'shutdownOpt3'];
    let chosen = 2;

    const radios = el('div', { style: 'display:grid;gap:6px;margin:10px 0 0' },
      opts.map((key, i) => {
        const input = el('input', { type: 'radio', name: 'shutdown', id: 'sd' + i });
        if (i === 2) input.checked = true;
        input.addEventListener('change', () => { chosen = i; });
        return el('label', { for: 'sd' + i, style: 'display:flex;gap:7px;align-items:center' },
          input, el('span', { text: t(key) }));
      }),
    );

    return el('div', null,
      el('div', { style: 'display:flex;gap:14px;align-items:flex-start' },
        el('img', { src: icon('shutdown'), alt: '', width: 32, height: 32 }),
        el('div', null, el('p', { text: t('shutdownHint') }), radios),
      ),
      el('div.dialog-buttons', null,
        el('button.default', {
          onclick: () => {
            if (chosen === 0) { WM.closeAll(); Boot.replay('shutdown'); }
            else if (chosen === 1) { WM.closeAll(); Boot.replay('restart'); }
            else WM.closeAll();
          },
        }, t('ok')),
      ),
    );
  }

  /* ══ Приложение: Сапёр ══════════════════════════════════════════════════ */
  /* Классические правила: первый щелчок никогда не попадает на мину, пустые
     клетки раскрываются волной, щелчок по открытой цифре с расставленными
     вокруг флажками открывает соседей. Партия хранится вне функции сборки,
     чтобы смена языка не сбрасывала начатую игру. */

  const MINE_LEVELS = {
    beginner:     { w: 9,  h: 9,  mines: 10, key: 'mineBeginner' },
    intermediate: { w: 16, h: 16, mines: 40, key: 'mineIntermediate' },
    expert:       { w: 30, h: 16, mines: 99, key: 'mineExpert' },
  };

  const COVERED = 0, OPEN = 1, FLAG = 2, QUESTION = 3;

  let mine = null;        // текущая партия
  let mineLevel = 'beginner';
  let mineFlagMode = false;

  function mineReset(level) {
    if (level) mineLevel = level;
    const L = MINE_LEVELS[mineLevel];
    if (mine && mine.timer) clearInterval(mine.timer);
    mine = {
      w: L.w, h: L.h, total: L.mines,
      bomb: new Uint8Array(L.w * L.h),
      near: new Uint8Array(L.w * L.h),
      state: new Uint8Array(L.w * L.h),
      placed: false, dead: false, won: false,
      opened: 0, time: 0, timer: null,
      cells: [],
    };
  }

  const mineIdx = (x, y) => y * mine.w + x;

  function mineNeighbours(i) {
    const x = i % mine.w, y = (i / mine.w) | 0;
    const out = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= mine.w || ny >= mine.h) continue;
        out.push(mineIdx(nx, ny));
      }
    }
    return out;
  }

  /** Мины расставляются после первого щелчка — по нему промахнуться нельзя. */
  function minePlace(safe) {
    const size = mine.w * mine.h;
    let left = mine.total;
    while (left > 0) {
      const i = Math.floor(Math.random() * size);
      if (i === safe || mine.bomb[i]) continue;
      mine.bomb[i] = 1;
      left--;
    }
    for (let i = 0; i < size; i++) {
      if (mine.bomb[i]) continue;
      mine.near[i] = mineNeighbours(i).reduce((n, j) => n + mine.bomb[j], 0);
    }
    mine.placed = true;
  }

  function mineStartTimer() {
    if (mine.timer) return;
    mine.timer = setInterval(() => {
      if (mine.time >= 999) return;
      mine.time++;
      minePaintHead();
    }, 1000);
  }

  function mineStopTimer() {
    if (mine.timer) { clearInterval(mine.timer); mine.timer = null; }
  }

  function mineOpen(i) {
    if (mine.dead || mine.won) return;
    if (mine.state[i] === FLAG || mine.state[i] === OPEN) return;
    if (!mine.placed) { minePlace(i); mineStartTimer(); }

    if (mine.bomb[i]) { mineLose(i); return; }

    // Волна раскрытия: пустые клетки тянут за собой соседей
    const stack = [i];
    while (stack.length) {
      const j = stack.pop();
      if (mine.state[j] === OPEN || mine.state[j] === FLAG) continue;
      mine.state[j] = OPEN;
      mine.opened++;
      if (mine.near[j] === 0) mineNeighbours(j).forEach(n => stack.push(n));
    }

    if (mine.opened === mine.w * mine.h - mine.total) mineWin();
    minePaint();
  }

  /** Щелчок по открытой цифре открывает соседей, если флажков вокруг ровно
      столько, сколько показывает цифра. */
  function mineChord(i) {
    if (mine.dead || mine.won || mine.state[i] !== OPEN || !mine.near[i]) return;
    const around = mineNeighbours(i);
    const flags = around.filter(j => mine.state[j] === FLAG).length;
    if (flags !== mine.near[i]) return;
    around.forEach(j => { if (mine.state[j] !== FLAG) mineOpen(j); });
  }

  function mineMark(i) {
    if (mine.dead || mine.won || mine.state[i] === OPEN) return;
    mine.state[i] = mine.state[i] === COVERED ? FLAG
                  : mine.state[i] === FLAG ? QUESTION
                  : COVERED;
    minePaint();
  }

  function mineLose(hit) {
    mine.dead = true;
    mine.hit = hit;
    mineStopTimer();
    minePaint();
  }

  function mineWin() {
    mine.won = true;
    mineStopTimer();
    for (let i = 0; i < mine.bomb.length; i++) if (mine.bomb[i]) mine.state[i] = FLAG;
  }

  const mineFlagsLeft = () => {
    let f = 0;
    for (let i = 0; i < mine.state.length; i++) if (mine.state[i] === FLAG) f++;
    return mine.total - f;
  };

  const mineLcd = n => (n < 0 ? '-' + String(Math.min(99, -n)).padStart(2, '0')
                              : String(Math.min(999, n)).padStart(3, '0'));

  function minePaintHead() {
    if (!mine.head) return;
    mine.head.left.textContent = mineLcd(mineFlagsLeft());
    mine.head.time.textContent = mineLcd(mine.time);
    const face = mine.dead ? 'face-dead' : mine.won ? 'face-cool' : 'face-smile';
    mine.head.face.src = icon(face);
  }

  function minePaint() {
    minePaintHead();
    for (let i = 0; i < mine.cells.length; i++) {
      const cell = mine.cells[i];
      if (!cell) continue;
      cell.className = 'mine-cell';
      cell.textContent = '';

      const st = mine.state[i];
      const reveal = mine.dead && mine.bomb[i] && st !== FLAG;
      const wrongFlag = mine.dead && !mine.bomb[i] && st === FLAG;

      if (st === FLAG && !wrongFlag) { cell.appendChild(mineImg('mine-flag')); continue; }
      if (wrongFlag) { cell.className = 'mine-cell open'; cell.appendChild(mineImg('mine-wrong')); continue; }
      if (st === QUESTION) { cell.textContent = '?'; continue; }
      if (reveal) {
        cell.className = 'mine-cell open' + (i === mine.hit ? ' boom' : '');
        cell.appendChild(mineImg('mine-bomb'));
        continue;
      }
      if (st === OPEN) {
        cell.className = 'mine-cell open' + (mine.near[i] ? ' n' + mine.near[i] : '');
        if (mine.near[i]) cell.textContent = String(mine.near[i]);
      }
    }
  }

  const mineImg = name => el('img', { src: icon(name), alt: '' });

  function buildMinesweeper() {
    if (!mine) mineReset();
    mine.cells = [];

    const left = el('span.mine-lcd');
    const time = el('span.mine-lcd');
    const faceImg = el('img', { src: icon('face-smile'), alt: '' });
    const face = el('button.mine-face', {
      title: t('mineNew'),
      onclick: () => { mineReset(); WM.rebuild(); },
    }, faceImg);
    mine.head = { left, time, face: faceImg };

    const grid = el('div.mine-grid', {
      style: `grid-template-columns: repeat(${mine.w}, max-content)`,
      oncontextmenu: e => e.preventDefault(),
    });

    for (let i = 0; i < mine.w * mine.h; i++) {
      const cell = el('button.mine-cell', { type: 'button' });
      // Пока кнопка нажата — смайлик «ой»
      cell.addEventListener('pointerdown', () => {
        if (!mine.dead && !mine.won) faceImg.src = icon('face-oh');
      });
      cell.addEventListener('pointerup', () => minePaintHead());
      cell.addEventListener('pointercancel', () => minePaintHead());
      cell.addEventListener('click', () => {
        if (mineFlagMode) mineMark(i);
        else if (mine.state[i] === OPEN) mineChord(i);
        else mineOpen(i);
      });
      cell.addEventListener('contextmenu', e => { e.preventDefault(); mineMark(i); });
      mine.cells.push(cell);
      grid.appendChild(cell);
    }

    const flagBtn = el('button', {
      class: mineFlagMode ? 'on' : '',
      onclick: e => {
        mineFlagMode = !mineFlagMode;
        e.currentTarget.classList.toggle('on', mineFlagMode);
        e.currentTarget.textContent = mineFlagMode ? t('mineFlagMode') : t('mineDigMode');
      },
    }, mineFlagMode ? t('mineFlagMode') : t('mineDigMode'));

    const root = el('div.mine-app', null,
      el('div.mine-head', null, left, face, time),
      grid,
      el('div.mine-flagmode', null, flagBtn),
    );

    minePaint();
    return root;
  }

  function mineMenubar() {
    const levels = Object.entries(MINE_LEVELS).map(([id, L]) => ({
      label: `${t(L.key)} — ${L.w}×${L.h}, ${L.mines}`,
      checked: mineLevel === id,
      action: () => { mineReset(id); WM.rebuild(); mineFit(); },
    }));
    return [
      { label: t('mineMenuGame'), items: [
        { label: t('mineNew'), action: () => { mineReset(); WM.rebuild(); } },
        { sep: true },
        ...levels,
      ] },
      { label: t('menuHelp'), items: [
        { label: t('mineHelp'), action: () => WM.message({
          title: t('itemMinesweeper'), icon: icon('msg-info'), text: t('mineHelpText'),
          buttons: [{ id: 'ok', label: t('ok'), def: true }],
        }) },
      ] },
    ];
  }

  /** Окно подгоняется под доску: у каждого уровня свой размер. */
  function mineFit(winEl) {
    const el2 = winEl || (mine.cells[0] && mine.cells[0].closest('.win'));
    if (!el2 || el2.classList.contains('maximized') || WM.isMobile()) return;
    const body = el2.querySelector('.win-body');
    const board = el2.querySelector('.mine-app');
    if (!body || !board) return;
    const chromeW = el2.offsetWidth - body.clientWidth;
    const chromeH = el2.offsetHeight - body.clientHeight;
    const w = board.offsetWidth + chromeW;
    const h = board.offsetHeight + chromeH;
    // min-width/min-height у .win рассчитаны на обычные окна и не дают доске
    // новичка сжаться до своего размера — снимаем их для этого окна
    el2.style.minWidth = w + 'px';
    el2.style.minHeight = h + 'px';
    el2.style.width = w + 'px';
    el2.style.height = h + 'px';

    // Окно могло вырасти за край рабочего стола при смене уровня
    const area = WM.rect(el2.parentElement);
    el2.style.left = Math.max(4, Math.min(parseInt(el2.style.left, 10) || 0, area.width - w - 4)) + 'px';
    el2.style.top = Math.max(4, Math.min(parseInt(el2.style.top, 10) || 0, area.height - h - 4)) + 'px';
  }

  /* ══ Регистрация приложений ═════════════════════════════════════════════ */

  function registerApps() {
    WM.register('about', {
      title: () => t('sysTitle'), icon: icon('my-computer'),
      width: 470, height: 400, fill: true, body: buildAbout,
    });

    WM.register('stack', {
      title: () => t('stackTitle'), icon: icon('add-remove'),
      width: 620, height: 470, flush: true, body: buildStack,
      status: () => [t('stackHint'), t('stackTotal')],
    });

    WM.register('network', {
      title: () => t('netTitle'), icon: icon('network'),
      width: 460, height: 400, body: buildNetwork,
    });

    WM.register('docs', {
      title: () => t('docsTitle'), icon: icon('folder'),
      width: 560, height: 320, flush: true, body: buildDocs,
      menubar: () => ['menuFile', 'menuEdit', 'menuView', 'menuFavorites', 'menuHelp'].map(t),
      status: () => [t('docsHint'), t('docsCount')],
    });

    WM.register('notepad', {
      title: params => {
        const doc = DOCS.find(d => d.id === (params && params.docId));
        return doc ? `${tx(doc.file)} \u2014 ${t('itemNotepad')}` : t('itemNotepad');
      },
      icon: icon('txt'),
      width: 560, height: 440, flush: true, singleton: false, body: buildNotepad,
      menubar: () => ['menuFile', 'menuEdit', 'menuView', 'menuHelp'].map(t),
    });

    WM.register('mail', {
      title: () => t('mailTitle'), icon: icon('mail'),
      width: 520, height: 460, body: buildMail,
      menubar: () => ['menuFile', 'menuEdit', 'menuView', 'menuMessage'].map(t),
    });

    WM.register('bin', {
      title: () => t('binTitle'), icon: icon('bin'),
      width: 420, height: 240, body: buildBin,
    });

    WM.register('run', {
      title: () => t('runTitle'), icon: icon('run'),
      width: 390, height: 190, resizable: false, body: buildRun,
    });

    WM.register('winver', {
      title: () => t('winverTitle'), icon: icon('flag'),
      width: 400, height: 240, resizable: false, body: buildWinver,
    });

    WM.register('minesweeper', {
      title: () => t('itemMinesweeper'), icon: icon('minesweeper'),
      width: 260, height: 330, resizable: false, flush: true,
      menubar: mineMenubar, body: buildMinesweeper,
      onMount: (body, winEl) => mineFit(winEl),
      onClose: () => { mineStopTimer(); mine = null; },
    });

    WM.register('shutdown', {
      title: () => t('shutdownTitle'), icon: icon('shutdown'),
      width: 380, height: 230, resizable: false, body: buildShutdown,
    });
  }

  /* ══ Рабочий стол ═══════════════════════════════════════════════════════ */

  const DESKTOP_ICONS = [
    { key: 'iconAbout',   img: 'my-computer', app: 'about' },
    { key: 'iconStack',   img: 'add-remove',  app: 'stack' },
    { key: 'iconDocs',    img: 'folder',      app: 'docs' },
    { key: 'iconNetwork', img: 'network',     app: 'network' },
    { key: 'iconMail',    img: 'mail',        app: 'mail' },
    { key: 'iconGithub',  img: 'github',      href: 'https://github.com/Kripl23' },
    { key: 'iconLinkedin',img: 'linkedin',    href: 'https://www.linkedin.com/in/roman-kolchin/' },
    { key: 'iconBin',     img: 'bin',         app: 'bin' },
  ];

  function renderDesktopIcons() {
    const host = document.getElementById('desktop-icons');
    host.innerHTML = '';

    DESKTOP_ICONS.forEach(def => {
      const isLink = Boolean(def.href);
      const node = el(isLink ? 'a.desktop-icon.shortcut' : 'button.desktop-icon',
        isLink ? { href: def.href, target: '_blank', rel: 'noopener' } : { type: 'button' },
        el('img', { src: icon(def.img), alt: '', width: 32, height: 32 }),
        el('span', { text: t(def.key) }),
      );

      const select = () => {
        host.querySelectorAll('.desktop-icon.selected').forEach(n => n.classList.remove('selected'));
        node.classList.add('selected');
      };

      node.addEventListener('click', e => {
        select();
        if (isLink) return;               // ссылка открывается сама
        // На тач-устройствах двойной клик недоступен — открываем сразу
        if (WM.isMobile()) { e.preventDefault(); WM.launch(def.app); }
      });
      if (!isLink) {
        node.addEventListener('dblclick', () => WM.launch(def.app));
        node.addEventListener('keydown', e => { if (e.key === 'Enter') WM.launch(def.app); });
      }

      host.appendChild(node);
    });
  }

  /* ══ Таскбар ════════════════════════════════════════════════════════════ */

  function renderTasklist(windows) {
    const host = document.getElementById('tasklist');
    host.innerHTML = '';
    windows.forEach(w => {
      const btn = el('button.task-btn' + (w.active && !w.minimized ? '.active' : ''), {
        onclick: () => WM.toggle(w.id),
        title: w.title,
      },
        w.icon ? el('img', { src: w.icon, alt: '' }) : null,
        el('span', { text: w.title }),
      );
      host.appendChild(btn);
    });
  }

  function startClock() {
    const clock = document.getElementById('tray-clock');
    const tick = () => {
      const d = new Date();
      clock.textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
      clock.title = d.toLocaleDateString(I18N.lang === 'ja' ? 'ja-JP' : I18N.lang === 'en' ? 'en-GB' : 'ru-RU',
        { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };
    tick();
    setInterval(tick, 1000 * 20);
  }

  /* ══ Меню «Пуск» ════════════════════════════════════════════════════════ */

  let openSubmenu = null;

  /* Подменю переключается и закрывается с небольшой задержкой. Без неё курсор
     по дороге к выпавшему меню задевает соседние пункты, и оно подменяется
     или исчезает. В оригинальной оболочке была ровно такая же пауза. */
  const HOVER_DELAY = 250;
  let hoverTimer = null;
  const scheduleMenu = fn => { clearTimeout(hoverTimer); hoverTimer = setTimeout(fn, HOVER_DELAY); };
  const cancelMenu = () => clearTimeout(hoverTimer);

  function closeSubmenu() {
    cancelMenu();
    if (openSubmenu) { openSubmenu.remove(); openSubmenu = null; }
    document.querySelectorAll('.menu-item.open').forEach(n => n.classList.remove('open'));
  }

  function closeStart() {
    closeSubmenu();
    document.getElementById('start-menu').hidden = true;
    document.getElementById('start-btn').setAttribute('aria-expanded', 'false');
  }

  function menuItem({ label, img, small, action, submenu }) {
    const node = el('button.menu-item' + (small ? '.small' : ''), {
      type: 'button',
      'data-submenu': submenu ? '1' : null,
    },
      img ? el('img', { src: icon(img), alt: '' }) : el('span', { style: 'width:24px' }),
      el('span', { text: label }),
    );

    if (submenu) {
      const show = () => {
        closeSubmenu();
        node.classList.add('open');
        const menu = el('div.submenu');
        submenu().forEach(child => menu.appendChild(menuItem(child)));
        menu.addEventListener('mouseenter', cancelMenu);
        document.body.appendChild(menu);
        const r = WM.rect(node);
        const mh = menu.offsetHeight;
        menu.style.left = Math.min(r.right - 2, WM.vw() - menu.offsetWidth - 4) + 'px';
        menu.style.top = Math.max(4, Math.min(r.top, WM.vh() - mh - 34)) + 'px';
        openSubmenu = menu;
      };
      node.addEventListener('mouseenter', () => {
        cancelMenu();
        if (node.classList.contains('open')) return;   // это подменю уже открыто
        if (openSubmenu) scheduleMenu(show);           // переключаемся не сразу
        else show();
      });
      node.addEventListener('mouseleave', cancelMenu);
      node.addEventListener('click', () => { cancelMenu(); show(); });
    } else {
      // Пункт закрывает чужое подменю, но не то, в котором сам находится —
      // иначе меню исчезало ровно в тот момент, когда до него доводили мышь.
      node.addEventListener('mouseenter', () => {
        if (node.closest('.submenu')) { cancelMenu(); return; }
        if (openSubmenu) scheduleMenu(closeSubmenu);
      });
      node.addEventListener('click', () => { closeStart(); if (action) action(); });
    }
    return node;
  }

  function startMenuItems() {
    return [
      { label: t('startPrograms'), img: 'programs', submenu: () => [
        { label: t('stackTitle'), img: 'add-remove', small: true, action: () => WM.launch('stack') },
        { label: t('itemNotepad'), img: 'txt', small: true, action: () => WM.launch('notepad', { docId: 'resume' }) },
        { label: t('sysTitle'), img: 'my-computer', small: true, action: () => WM.launch('about') },
        { label: t('netTitle'), img: 'network', small: true, action: () => WM.launch('network') },
        { label: t('itemMinesweeper'), img: 'minesweeper', small: true, action: () => WM.launch('minesweeper') },
      ] },
      { label: t('startDocuments'), img: 'documents', submenu: () => DOCS.map(d => ({
        label: tx(d.file), img: d.icon, small: true,
        action: () => WM.launch('notepad', { docId: d.id }),
      })) },
      { label: t('startSettings'), img: 'settings', submenu: () => [
        { label: 'Русский', small: true, action: () => I18N.set('ru') },
        { label: 'English', small: true, action: () => I18N.set('en') },
        { label: '日本語', small: true, action: () => I18N.set('ja') },
      ] },
      { label: t('startFind'), img: 'find', action: () => WM.message({
        title: t('startFind'), icon: icon('msg-info'),
        text: `${t('sysName')} — ${t('sysRole')}`,
        buttons: [{ id: 'ok', label: t('iconMail'), def: true }],
      }).then(() => WM.launch('mail')) },
      { label: t('startHelp'), img: 'help', action: () => WM.launch('winver') },
      { sep: true },
      { label: t('startRun'), img: 'run', action: () => WM.launch('run') },
      { sep: true },
      { label: t('startShutdown'), img: 'shutdown', action: () => WM.launch('shutdown') },
    ];
  }

  function renderStartMenu() {
    const banner = document.getElementById('start-banner');
    banner.innerHTML = '';
    banner.appendChild(el('span', null,
      el('b', { text: t('startBannerName') }), ' ', t('startBannerEdition')));

    const host = document.getElementById('start-items');
    host.innerHTML = '';
    startMenuItems().forEach(item => {
      host.appendChild(item.sep ? el('div.menu-sep') : menuItem(item));
    });
  }

  function wireStart() {
    const btn = document.getElementById('start-btn');
    const menu = document.getElementById('start-menu');

    btn.addEventListener('click', e => {
      e.stopPropagation();
      const willOpen = menu.hidden;
      if (willOpen) renderStartMenu();
      menu.hidden = !willOpen;
      btn.setAttribute('aria-expanded', String(willOpen));
      if (!willOpen) closeSubmenu();
    });

    document.addEventListener('click', e => {
      if (menu.hidden) return;
      if (e.target.closest('#start-menu') || e.target.closest('.submenu') || e.target.closest('#start-btn')) return;
      closeStart();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !menu.hidden) closeStart();
    });
  }

  /* ══ Контекстное меню рабочего стола ════════════════════════════════════ */

  function wireContextMenu() {
    const desktop = document.getElementById('desktop');
    let menu = null;
    const kill = () => { if (menu) { menu.remove(); menu = null; } };

    document.addEventListener('contextmenu', e => {
      // Родное меню браузера остаётся только там, где оно нужно:
      // в полях ввода, на ссылках и в выделяемом тексте (скопировать).
      if (e.target.closest('input, textarea, a[href], .selectable')) return;
      e.preventDefault();
      kill();
      // Своё меню показываем только на пустом рабочем столе
      if (e.target.closest('.win, #taskbar, #start-menu, .submenu, .menubar-drop, #boot')) return;
      menu = el('div#context-menu');
      [
        { label: t('startRun'), img: 'run', small: true, action: () => WM.launch('run') },
        { label: t('subLanguage'), img: 'settings', small: true, action: () => I18N.cycle() },
        { sep: true },
        { label: t('properties'), img: 'my-computer', small: true, action: () => WM.launch('about') },
      ].forEach(item => {
        if (item.sep) { menu.appendChild(el('div.menu-sep')); return; }
        const node = menuItem(item);
        node.addEventListener('click', kill);
        menu.appendChild(node);
      });
      document.body.appendChild(menu);
      const p = WM.ptr(e);
      menu.style.left = Math.min(p.x, WM.vw() - menu.offsetWidth - 4) + 'px';
      menu.style.top = Math.min(p.y, WM.vh() - menu.offsetHeight - 34) + 'px';
    });

    document.addEventListener('click', kill);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') kill(); });

    // Клик по пустому месту снимает выделение с иконок
    desktop.addEventListener('pointerdown', e => {
      if (e.target.closest('.desktop-icon') || e.target.closest('.win')) return;
      document.querySelectorAll('.desktop-icon.selected').forEach(n => n.classList.remove('selected'));
    });
  }

  /* ══ Язык ═══════════════════════════════════════════════════════════════ */

  function wireLanguage() {
    const badge = document.getElementById('lang-indicator');
    const startLabel = document.querySelector('#start-btn span');
    const paint = () => {
      badge.textContent = I18N.lang.toUpperCase();
      startLabel.textContent = t('start');
    };

    badge.addEventListener('click', e => { e.stopPropagation(); I18N.cycle(); });

    I18N.onChange(() => {
      paint();
      renderDesktopIcons();
      WM.rebuild();
      if (!document.getElementById('start-menu').hidden) renderStartMenu();
    });
    paint();
  }

  /* ══ Запуск ═════════════════════════════════════════════════════════════ */

  /** Адрес вида /#stack открывает нужное окно сразу — такой ссылкой удобно
      делиться, а заодно её можно положить в резюме. */
  const DEEP_LINKS = ['about', 'stack', 'docs', 'network', 'mail', 'bin', 'winver', 'minesweeper'];

  function openFromHash() {
    const id = decodeURIComponent(location.hash.replace('#', '')).toLowerCase();
    if (DEEP_LINKS.includes(id)) { WM.launch(id); return; }
    // Ссылка на конкретный документ: #resume, #rustat
    const doc = DOCS.find(d => d.id === id);
    if (doc) WM.launch('notepad', { docId: doc.id });
  }

  function boot() {
    I18N.init();
    WM.init(document.getElementById('desktop'));
    registerApps();
    renderDesktopIcons();
    wireStart();
    wireContextMenu();
    wireLanguage();
    startClock();
    WM.onChange(renderTasklist);
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
  }

  // Приветственное окно после входа в систему
  window.Shell = {
    boot,
    /** Есть ли в адресе ссылка на конкретное окно — тогда загрузку показывать
        не нужно: человек пришёл по ссылке за содержимым. */
    hasDeepLink: () => {
      const id = decodeURIComponent(location.hash.replace('#', '')).toLowerCase();
      return DEEP_LINKS.includes(id) || DOCS.some(d => d.id === id);
    },
  };
})();
