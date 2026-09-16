/* ==========================================================================
   content.js — весь текст сайта и переключение языков
   --------------------------------------------------------------------------
   Здесь лежит ВСЁ содержимое: подписи интерфейса, тексты окон, описания
   технологий и записи об опыте. Логики тут нет — только данные.
   Правки контента делаются в этом файле и больше нигде.

   Структура: DICT — строки интерфейса на трёх языках, STACK — технологии,
   DOCS — документы («Мои документы»), LINKS — контакты, BIOS_LINES — текст
   экрана загрузки.
   ========================================================================== */

/* ── Словарь интерфейса ──────────────────────────────────────────────────── */

const DICT = {
  ru: {
    /* Общие кнопки и подписи */
    ok: 'OK', cancel: 'Отмена', apply: 'Применить', close: 'Закрыть',
    change: 'Изменить', remove: 'Удалить', send: 'Отправить', open: 'Открыть',
    yes: 'Да', no: 'Нет', properties: 'Свойства',
    unitGb: 'ГБ', unitMb: 'МБ', unitKb: 'КБ',
    menuFile: 'Файл', menuEdit: 'Правка', menuView: 'Вид', menuHelp: 'Справка',
    menuFavorites: 'Избранное', menuTools: 'Сервис', menuMessage: 'Сообщение',

    /* Загрузка системы */
    biosSkip: 'Нажмите любую клавишу, чтобы пропустить загрузку',
    splashEdition: 'Профессиональная версия разработчика',
    splashNote: 'Загрузка личного профиля...',
    splashFoot: 'Собрано на технологии Python',
    logonTitle: 'Вход в систему',
    logonWelcome: 'Добро пожаловать',
    logonHint: 'Введите имя пользователя и пароль для входа.',
    logonUser: 'Пользователь:',
    logonPass: 'Пароль:',
    logonDomain: 'Домен:',
    logonEnter: 'ОК',
    logonShutdown: 'Завершение работы',

    /* Рабочий стол */
    iconAbout: 'Мой компьютер',
    iconStack: 'Установка и удаление программ',
    iconDocs: 'Мои документы',
    iconMail: 'Написать письмо',
    iconGithub: 'GitHub',
    iconLinkedin: 'LinkedIn',
    iconBin: 'Корзина',
    iconNetwork: 'Сетевое окружение',

    /* Меню «Пуск» */
    start: 'Пуск',
    startPrograms: 'Программы',
    startDocuments: 'Документы',
    startSettings: 'Настройка',
    startFind: 'Найти',
    startHelp: 'Справка',
    startRun: 'Выполнить...',
    startShutdown: 'Завершение работы...',
    startBannerName: 'Roman Kolchin',
    startBannerEdition: '2000',
    subAccessories: 'Стандартные',
    subGames: 'Игры',
    subLanguage: 'Язык и стандарты',
    subDisplay: 'Свойства экрана',
    itemNotepad: 'Блокнот',
    itemCommand: 'Командная строка',
    itemCalc: 'Калькулятор',
    itemMinesweeper: 'Сапёр',
    itemResume: 'Резюме.txt',

    /* Окно «Свойства системы» */
    sysTitle: 'Свойства системы',
    tabGeneral: 'Общие',
    tabUser: 'Пользователь',
    tabHardware: 'Оборудование',
    sysRegistered: 'Система зарегистрирована на имя:',
    sysName: 'Роман Колчин',
    sysRole: 'Python-разработчик',
    sysLocation: 'Россия',
    sysComputer: 'Компьютер:',
    sysHead: 'Система',
    sysVersion: 'Личный сайт 2000',
    sysBuild: 'Сборка 5.00.2195',
    sysHi: 'Привет!',
    sysBio1: 'Я Роман — backend-разработчик на Python. Пишу серверную часть: REST API, телеграм-боты, сбор и обработка данных, сопровождение сервисов на Linux.',
    sysBio2: 'С февраля 2024 работаю в компании РуСтат — это спортивные данные. Люблю задачи, где нужно разобраться, как система работает изнутри, а не просто дописать ещё один обработчик.',
    sysBio3: 'Здесь нет ссылок на репозитории: почти всё, что я делал, писалось для работодателя и в открытый доступ не выкладывается. Поэтому вместо ссылок — список технологий и то, как именно я их применял. Он в окне «Установка и удаление программ».',
    hwProcessor: 'Процессор:',
    hwProcessorV: 'Python 3.12, асинхронный',
    hwMemory: 'Память:',
    hwMemoryV: 'Достаточно, чтобы держать в голове всю схему БД',
    hwStorage: 'Накопитель:',
    hwStorageV: 'Документация, вкладки браузера, чужой код',
    hwUptime: 'Время работы:',
    hwUptimeV: 'В разработке с 2021 года',
    hwStatus: 'Состояние:',
    hwStatusV: 'Устройство работает нормально.',
    hwNote: 'Все устройства работают нормально. Конфликтов не обнаружено.',

    /* Окно «Установка и удаление программ» */
    stackTitle: 'Установка и удаление программ',
    stackHeadTitle: 'Установленные компоненты',
    stackHeadNote: 'Сейчас установлены следующие программы. Чтобы посмотреть, как они применялись, выберите компонент из списка.',
    stackSize: 'Размер:',
    stackFreq: 'Используется:',
    stackLast: 'Последний запуск:',
    stackTotal: 'Объектов: 11',
    stackHint: 'Выберите компонент, чтобы увидеть описание',
    freqDaily: 'ежедневно',
    freqVeryOften: 'очень часто',
    freqOften: 'часто',
    freqSometimes: 'иногда',
    freqRarely: 'редко',
    lastNow: 'сейчас',
    lastToday: 'сегодня',
    lastWeek: 'на этой неделе',
    lastMonth: 'в этом месяце',
    lastQuarter: 'в этом квартале',
    lastLongAgo: 'давно',
    changeTitle: 'Изменение компонента',
    changeText: 'Компонент обновляется сам по мере практики. Отдельная установка не требуется.',
    removeTitle: 'Удаление компонента',
    removeCore: 'Этот компонент необходим для работы системы и не может быть удалён.',
    removeOther: 'Компонент «%s» используется в работе. Удаление может привести к неработоспособности системы.',

    /* Окно «Свойства: Подключение по локальной сети» (HTTP) */
    netTitle: 'Свойства: Подключение по локальной сети',
    netHead: 'Отмеченные компоненты используются этим подключением:',
    netProto: 'Протокол HTTP/1.1 (TCP/IP)',
    netProtoDesc: 'Протокол передачи гипертекста. Основной протокол взаимодействия между сервисами.',
    netDetail: 'Знаю, как это устроено:',
    netItems: [
      'методы и семантика REST: что должно быть идемпотентным, а что нет',
      'коды состояния и что клиент должен делать с каждым из них',
      'заголовки: content negotiation, авторизация, управление кэшем',
      'куки, сессии и хранение состояния между запросами',
      'редиректы, таймауты, повторные попытки и их подводные камни',
      'что происходит между отправкой запроса и получением ответа',
    ],

    /* Окно «Мои документы» */
    docsTitle: 'Мои документы',
    colName: 'Имя', colSize: 'Размер', colType: 'Тип', colModified: 'Изменён',
    typeDoc: 'Документ', typeTxt: 'Текстовый документ',
    docsHint: 'Двойной щелчок открывает документ',
    docsCount: 'Объектов: 3',

    /* Окно «Написать письмо» */
    mailTitle: 'Создать сообщение',
    mailTo: 'Кому:', mailSubject: 'Тема:',
    mailSubjectValue: 'Вакансия / проект',
    mailBody: 'Здравствуйте, Роман!\n\n',
    mailNote: 'Кнопка «Отправить» откроет ваш почтовый клиент.',
    mailLinks: 'Другие способы связи',

    /* Служебное */
    runTitle: 'Запуск программы',
    runHint: 'Введите имя программы, папки или документа, и Windows откроет их.',
    runLabel: 'Открыть:',
    runNotFound: 'Не удаётся найти «%s». Проверьте правильность имени и повторите попытку.',
    runError: 'Ошибка',
    binTitle: 'Корзина',
    binEmpty: 'Корзина пуста.',
    binItem: 'предыдущий_дизайн_сайта.html',
    binRestore: 'Восстановить объект',
    binRestored: 'Старая версия сайта никуда не делась — она лежит по адресу /old/.',
    shutdownTitle: 'Завершение работы Windows',
    shutdownHint: 'Что должен сделать компьютер?',
    shutdownOpt1: 'Завершить работу',
    shutdownOpt2: 'Перезагрузить компьютер',
    shutdownOpt3: 'Остаться и посмотреть ещё',
    winverTitle: 'О программе',
    winverText: 'Личный сайт Романа Колчина<br>Версия 2000 (сборка 5.00.2195)<br><br>Написан вручную: HTML, CSS и JavaScript без единой зависимости.<br>Работает на GitHub Pages.',
    aboutMemory: 'Доступно памяти: достаточно',
    statusReady: 'Готово',
  },

  en: {
    ok: 'OK', cancel: 'Cancel', apply: 'Apply', close: 'Close',
    change: 'Change', remove: 'Remove', send: 'Send', open: 'Open',
    yes: 'Yes', no: 'No', properties: 'Properties',
    unitGb: 'GB', unitMb: 'MB', unitKb: 'KB',
    menuFile: 'File', menuEdit: 'Edit', menuView: 'View', menuHelp: 'Help',
    menuFavorites: 'Favorites', menuTools: 'Tools', menuMessage: 'Message',

    biosSkip: 'Press any key to skip startup',
    splashEdition: 'Developer Professional',
    splashNote: 'Loading personal profile...',
    splashFoot: 'Built on Python Technology',
    logonTitle: 'Log On to Windows',
    logonWelcome: 'Welcome',
    logonHint: 'Type a user name and password to log on.',
    logonUser: 'User name:',
    logonPass: 'Password:',
    logonDomain: 'Log on to:',
    logonEnter: 'OK',
    logonShutdown: 'Shut Down',

    iconAbout: 'My Computer',
    iconStack: 'Add/Remove Programs',
    iconDocs: 'My Documents',
    iconMail: 'Send a message',
    iconGithub: 'GitHub',
    iconLinkedin: 'LinkedIn',
    iconBin: 'Recycle Bin',
    iconNetwork: 'My Network Places',

    start: 'Start',
    startPrograms: 'Programs',
    startDocuments: 'Documents',
    startSettings: 'Settings',
    startFind: 'Search',
    startHelp: 'Help',
    startRun: 'Run...',
    startShutdown: 'Shut Down...',
    startBannerName: 'Roman Kolchin',
    startBannerEdition: '2000',
    subAccessories: 'Accessories',
    subGames: 'Games',
    subLanguage: 'Regional Options',
    subDisplay: 'Display Properties',
    itemNotepad: 'Notepad',
    itemCommand: 'Command Prompt',
    itemCalc: 'Calculator',
    itemMinesweeper: 'Minesweeper',
    itemResume: 'Resume.txt',

    sysTitle: 'System Properties',
    tabGeneral: 'General',
    tabUser: 'User',
    tabHardware: 'Hardware',
    sysRegistered: 'This system is registered to:',
    sysName: 'Roman Kolchin',
    sysRole: 'Python Developer',
    sysLocation: 'Russia',
    sysComputer: 'Computer:',
    sysHead: 'System',
    sysVersion: 'Personal Site 2000',
    sysBuild: 'Build 5.00.2195',
    sysHi: 'Hi there!',
    sysBio1: "I'm Roman, a Python backend developer. I build the server side: REST APIs, Telegram bots, data collection and processing, and I keep services running on Linux.",
    sysBio2: 'Since February 2024 I have been working at RuStat, a sports data company. I like problems where you have to understand how the system actually works, not just add one more handler.',
    sysBio3: 'There are no repository links here: almost everything I have built was written for an employer and is not published. So instead of links you get the list of technologies and exactly how I used them — it is in the Add/Remove Programs window.',
    hwProcessor: 'Processor:',
    hwProcessorV: 'Python 3.12, asynchronous',
    hwMemory: 'Memory:',
    hwMemoryV: 'Enough to hold a whole database schema in my head',
    hwStorage: 'Storage:',
    hwStorageV: 'Documentation, browser tabs, other people’s code',
    hwUptime: 'Uptime:',
    hwUptimeV: 'In development since 2021',
    hwStatus: 'Device status:',
    hwStatusV: 'This device is working properly.',
    hwNote: 'All devices are working properly. No conflicts detected.',

    stackTitle: 'Add/Remove Programs',
    stackHeadTitle: 'Currently installed components',
    stackHeadNote: 'The following components are installed. Select one to see how it was used.',
    stackSize: 'Size:',
    stackFreq: 'Used:',
    stackLast: 'Last used on:',
    stackTotal: '11 items',
    stackHint: 'Select a component to see its description',
    freqDaily: 'daily',
    freqVeryOften: 'very often',
    freqOften: 'often',
    freqSometimes: 'occasionally',
    freqRarely: 'rarely',
    lastNow: 'right now',
    lastToday: 'today',
    lastWeek: 'this week',
    lastMonth: 'this month',
    lastQuarter: 'this quarter',
    lastLongAgo: 'a while ago',
    changeTitle: 'Change Component',
    changeText: 'This component updates itself as the practice continues. No separate installation is required.',
    removeTitle: 'Remove Component',
    removeCore: 'This component is required for the system to run and cannot be removed.',
    removeOther: '"%s" is currently in use. Removing it may make the system unstable.',

    netTitle: 'Local Area Connection Properties',
    netHead: 'Components checked are used by this connection:',
    netProto: 'HTTP/1.1 Protocol (TCP/IP)',
    netProtoDesc: 'The Hypertext Transfer Protocol. The default protocol for service-to-service communication.',
    netDetail: 'What I actually know about it:',
    netItems: [
      'REST methods and semantics: what has to be idempotent and what does not',
      'status codes and what a client is supposed to do with each of them',
      'headers: content negotiation, authorization, cache control',
      'cookies, sessions and carrying state between requests',
      'redirects, timeouts, retries and the traps that come with them',
      'what actually happens between sending a request and getting a response',
    ],

    docsTitle: 'My Documents',
    colName: 'Name', colSize: 'Size', colType: 'Type', colModified: 'Modified',
    typeDoc: 'Document', typeTxt: 'Text Document',
    docsHint: 'Double-click to open a document',
    docsCount: '3 items',

    mailTitle: 'New Message',
    mailTo: 'To:', mailSubject: 'Subject:',
    mailSubjectValue: 'Role / project',
    mailBody: 'Hi Roman,\n\n',
    mailNote: 'The Send button opens your own mail client.',
    mailLinks: 'Other ways to reach me',

    runTitle: 'Run',
    runHint: 'Type the name of a program, folder or document, and Windows will open it for you.',
    runLabel: 'Open:',
    runNotFound: 'Cannot find "%s". Make sure you typed the name correctly, and then try again.',
    runError: 'Error',
    binTitle: 'Recycle Bin',
    binEmpty: 'The Recycle Bin is empty.',
    binItem: 'previous_site_design.html',
    binRestore: 'Restore this item',
    binRestored: 'The old version is still around — you can find it at /old/.',
    shutdownTitle: 'Shut Down Windows',
    shutdownHint: 'What do you want the computer to do?',
    shutdownOpt1: 'Shut down',
    shutdownOpt2: 'Restart',
    shutdownOpt3: 'Stay and keep looking around',
    winverTitle: 'About',
    winverText: "Roman Kolchin's personal site<br>Version 2000 (Build 5.00.2195)<br><br>Hand-written HTML, CSS and JavaScript with zero dependencies.<br>Hosted on GitHub Pages.",
    aboutMemory: 'Physical memory available: enough',
    statusReady: 'Ready',
  },

  ja: {
    ok: 'OK', cancel: 'キャンセル', apply: '適用', close: '閉じる',
    change: '変更', remove: '削除', send: '送信', open: '開く',
    yes: 'はい', no: 'いいえ', properties: 'プロパティ',
    unitGb: 'GB', unitMb: 'MB', unitKb: 'KB',
    menuFile: 'ファイル', menuEdit: '編集', menuView: '表示', menuHelp: 'ヘルプ',
    menuFavorites: 'お気に入り', menuTools: 'ツール', menuMessage: 'メッセージ',

    biosSkip: '起動をスキップするには任意のキーを押してください',
    splashEdition: '開発者向けプロフェッショナル版',
    splashNote: 'プロフィールを読み込んでいます...',
    splashFoot: 'Python テクノロジ搭載',
    logonTitle: 'Windows へのログオン',
    logonWelcome: 'ようこそ',
    logonHint: 'ユーザー名とパスワードを入力してください。',
    logonUser: 'ユーザー名:',
    logonPass: 'パスワード:',
    logonDomain: 'ログオン先:',
    logonEnter: 'OK',
    logonShutdown: 'シャットダウン',

    iconAbout: 'マイ コンピュータ',
    iconStack: 'アプリケーションの追加と削除',
    iconDocs: 'マイ ドキュメント',
    iconMail: 'メールを書く',
    iconGithub: 'GitHub',
    iconLinkedin: 'LinkedIn',
    iconBin: 'ごみ箱',
    iconNetwork: 'マイ ネットワーク',

    start: 'スタート',
    startPrograms: 'プログラム',
    startDocuments: '最近使ったファイル',
    startSettings: '設定',
    startFind: '検索',
    startHelp: 'ヘルプ',
    startRun: 'ファイル名を指定して実行...',
    startShutdown: 'シャットダウン...',
    startBannerName: 'Roman Kolchin',
    startBannerEdition: '2000',
    subAccessories: 'アクセサリ',
    subGames: 'ゲーム',
    subLanguage: '地域と言語',
    subDisplay: '画面のプロパティ',
    itemNotepad: 'メモ帳',
    itemCommand: 'コマンド プロンプト',
    itemCalc: '電卓',
    itemMinesweeper: 'マインスイーパ',
    itemResume: '履歴書.txt',

    sysTitle: 'システムのプロパティ',
    tabGeneral: '全般',
    tabUser: 'ユーザー',
    tabHardware: 'ハードウェア',
    sysRegistered: 'このシステムの使用者:',
    sysName: 'ロマン・コルチン',
    sysRole: 'Python 開発者',
    sysLocation: 'ロシア',
    sysComputer: 'コンピュータ:',
    sysHead: 'システム',
    sysVersion: '個人サイト 2000',
    sysBuild: 'ビルド 5.00.2195',
    sysHi: 'はじめまして！',
    sysBio1: 'ロマンと申します。Python のバックエンド開発者です。REST API、Telegram ボット、データの収集と処理を担当し、Linux 上でサービスを運用しています。',
    sysBio2: '2024年2月からスポーツデータの会社 RuStat で働いています。ハンドラを一つ追加するだけでなく、システムの仕組みそのものを理解する必要がある仕事が好きです。',
    sysBio3: 'ここにリポジトリへのリンクはありません。これまでの成果物はほとんどが業務で書いたもので、公開していないためです。代わりに、使用した技術とその使い方を「アプリケーションの追加と削除」ウィンドウにまとめました。',
    hwProcessor: 'プロセッサ:',
    hwProcessorV: 'Python 3.12（非同期）',
    hwMemory: 'メモリ:',
    hwMemoryV: 'データベースのスキーマを丸ごと記憶できる程度',
    hwStorage: 'ストレージ:',
    hwStorageV: 'ドキュメント、ブラウザのタブ、他人のコード',
    hwUptime: '稼働時間:',
    hwUptimeV: '2021年から開発中',
    hwStatus: 'デバイスの状態:',
    hwStatusV: 'このデバイスは正常に動作しています。',
    hwNote: 'すべてのデバイスは正常に動作しています。競合は検出されませんでした。',

    stackTitle: 'アプリケーションの追加と削除',
    stackHeadTitle: 'インストールされているコンポーネント',
    stackHeadNote: '現在インストールされているコンポーネントです。使い方を見るには一覧から選択してください。',
    stackSize: 'サイズ:',
    stackFreq: '使用頻度:',
    stackLast: '最終使用日:',
    stackTotal: '11 個のオブジェクト',
    stackHint: 'コンポーネントを選択すると説明が表示されます',
    freqDaily: '毎日',
    freqVeryOften: '非常に頻繁',
    freqOften: '頻繁',
    freqSometimes: '時々',
    freqRarely: 'まれ',
    lastNow: '使用中',
    lastToday: '今日',
    lastWeek: '今週',
    lastMonth: '今月',
    lastQuarter: '今四半期',
    lastLongAgo: 'かなり前',
    changeTitle: 'コンポーネントの変更',
    changeText: 'このコンポーネントは実務を重ねるごとに自動的に更新されます。個別のインストールは不要です。',
    removeTitle: 'コンポーネントの削除',
    removeCore: 'このコンポーネントはシステムの動作に必要なため、削除できません。',
    removeOther: '「%s」は現在使用中です。削除するとシステムが不安定になる可能性があります。',

    netTitle: 'ローカル エリア接続のプロパティ',
    netHead: 'この接続は次の項目を使用します:',
    netProto: 'HTTP/1.1 プロトコル (TCP/IP)',
    netProtoDesc: 'ハイパーテキスト転送プロトコル。サービス間通信の基本プロトコルです。',
    netDetail: '理解している内容:',
    netItems: [
      'REST のメソッドと意味論：何が冪等であるべきか',
      'ステータスコードと、クライアントが取るべき挙動',
      'ヘッダー：コンテントネゴシエーション、認可、キャッシュ制御',
      'Cookie、セッション、リクエスト間の状態保持',
      'リダイレクト、タイムアウト、リトライとその落とし穴',
      'リクエスト送信から応答受信までに実際に起きていること',
    ],

    docsTitle: 'マイ ドキュメント',
    colName: '名前', colSize: 'サイズ', colType: '種類', colModified: '更新日時',
    typeDoc: 'ドキュメント', typeTxt: 'テキスト ドキュメント',
    docsHint: 'ダブルクリックで開きます',
    docsCount: '3 個のオブジェクト',

    mailTitle: 'メッセージの作成',
    mailTo: '宛先:', mailSubject: '件名:',
    mailSubjectValue: '求人 / プロジェクト',
    mailBody: 'ロマンさん\n\n',
    mailNote: '「送信」を押すとお使いのメールソフトが開きます。',
    mailLinks: 'その他の連絡先',

    runTitle: 'ファイル名を指定して実行',
    runHint: '実行するプログラム名、フォルダ名、ドキュメント名を入力してください。',
    runLabel: '名前:',
    runNotFound: '「%s」が見つかりません。名前を確認してもう一度やり直してください。',
    runError: 'エラー',
    binTitle: 'ごみ箱',
    binEmpty: 'ごみ箱は空です。',
    binItem: '旧サイトデザイン.html',
    binRestore: 'この項目を元に戻す',
    binRestored: '旧バージョンは消えていません。/old/ にあります。',
    shutdownTitle: 'Windows のシャットダウン',
    shutdownHint: 'コンピュータをどうしますか?',
    shutdownOpt1: 'シャットダウン',
    shutdownOpt2: '再起動',
    shutdownOpt3: 'もう少し見ていく',
    winverTitle: 'バージョン情報',
    winverText: 'ロマン・コルチンの個人サイト<br>バージョン 2000 (ビルド 5.00.2195)<br><br>依存関係ゼロの手書き HTML / CSS / JavaScript。<br>GitHub Pages で動作しています。',
    aboutMemory: '使用可能なメモリ: 十分',
    statusReady: '準備完了',
  },
};

/* ── Данные: технологии ──────────────────────────────────────────────────── */
/* sizeMb — «вес» компонента: чем увереннее владение, тем больше число.
   freq / last — ключи из словаря выше; они и есть честный уровень владения.
   core: true — компонент, который «нельзя удалить» (пасхалка на кнопке). */

const STACK = [
  {
    id: 'python', name: 'Python 3.12', icon: 'python', sizeMb: 4300,
    freq: 'freqVeryOften', last: 'lastToday', core: true,
    desc: {
      ru: 'Основной язык с 2021 года. ООП и асинхронность (asyncio), типизация и аннотации, работа с окружениями и зависимостями. Пишу сервисы и утилиты с нуля — от разбора требований до запуска в продакшене.',
      en: 'My main language since 2021. OOP and async (asyncio), typing and annotations, environments and dependency management. I build services and utilities from scratch — from reading the requirements to running them in production.',
      ja: '2021年からのメイン言語。オブジェクト指向と非同期処理（asyncio）、型注釈、仮想環境と依存関係の管理。要件の整理から本番稼働まで、サービスやユーティリティをゼロから作ります。',
    },
  },
  {
    id: 'fastapi', name: 'FastAPI', icon: 'fastapi', sizeMb: 1840,
    freq: 'freqVeryOften', last: 'lastToday',
    desc: {
      ru: 'Асинхронные REST API: маршрутизация и система зависимостей, схемы и валидация на Pydantic, фоновые задачи, автодокументация OpenAPI, аутентификация и разграничение прав.',
      en: 'Async REST APIs: routing and the dependency system, Pydantic schemas and validation, background tasks, OpenAPI documentation, authentication and access control.',
      ja: '非同期 REST API：ルーティングと依存性注入、Pydantic によるスキーマ定義とバリデーション、バックグラウンドタスク、OpenAPI ドキュメント生成、認証と権限管理。',
    },
  },
  {
    id: 'django', name: 'Django', icon: 'django', sizeMb: 1620,
    freq: 'freqOften', last: 'lastWeek',
    desc: {
      ru: 'Серверные приложения и админка: модели и миграции ORM, представления и формы, права доступа, сигналы. Django REST Framework для API поверх существующих моделей.',
      en: 'Server applications and admin panels: ORM models and migrations, views and forms, permissions, signals. Django REST Framework for APIs on top of existing models.',
      ja: 'サーバーアプリケーションと管理画面：ORM のモデルとマイグレーション、ビューとフォーム、権限、シグナル。既存モデル上の API 構築には Django REST Framework を使用。',
    },
  },
  {
    id: 'aiogram', name: 'aiogram', icon: 'bot', sizeMb: 980,
    freq: 'freqOften', last: 'lastWeek',
    desc: {
      ru: 'Телеграм-боты: FSM-сценарии диалогов, инлайн-клавиатуры и коллбэки, вебхуки и long polling, рассылки, уведомления по событиям и регулярные задачи по расписанию.',
      en: 'Telegram bots: FSM dialog flows, inline keyboards and callbacks, webhooks and long polling, broadcasts, event-driven notifications and scheduled jobs.',
      ja: 'Telegram ボット：FSM による会話フロー、インラインキーボードとコールバック、Webhook と long polling、一斉配信、イベント通知、定期実行タスク。',
    },
  },
  {
    id: 'scraping', name: 'requests · BeautifulSoup · lxml', icon: 'web', sizeMb: 740,
    freq: 'freqOften', last: 'lastToday',
    desc: {
      ru: 'Сбор данных с сайтов и из чужих API: HTTP-сессии и заголовки, прокси и повторные попытки, разбор HTML через CSS-селекторы и XPath, приведение результата в структуры, пригодные для базы.',
      en: 'Pulling data from web pages and third-party APIs: HTTP sessions and headers, proxies and retries, HTML parsing via CSS selectors and XPath, normalising the result into database-ready structures.',
      ja: 'Web サイトや外部 API からのデータ収集：HTTP セッションとヘッダー、プロキシとリトライ、CSS セレクタと XPath による HTML 解析、DB に格納できる構造への正規化。',
    },
  },
  {
    id: 'linux', name: 'Linux · Ubuntu', icon: 'linux', sizeMb: 2400,
    freq: 'freqDaily', last: 'lastNow', core: true,
    desc: {
      ru: 'Рабочая и боевая среда. Развёртывание сервисов, пользователи и права, cron, systemd, работа с логами, диагностика штатными утилитами. Уверенно живу в терминале.',
      en: 'My working and production environment. Deploying services, users and permissions, cron, systemd, log handling, diagnosing problems with standard tooling. I am at home in a terminal.',
      ja: '開発・本番の両方の環境。サービスのデプロイ、ユーザーと権限、cron、systemd、ログの取り扱い、標準ツールによる問題調査。ターミナルでの作業が日常です。',
    },
  },
  {
    id: 'git', name: 'Git', icon: 'git', sizeMb: 320,
    freq: 'freqDaily', last: 'lastNow', core: true,
    desc: {
      ru: 'Ветки и слияния, разбор конфликтов, ревью через merge request, откаты и разбор истории. Понимаю, что произошло с репозиторием, а не просто нажимаю кнопки.',
      en: 'Branches and merges, resolving conflicts, review through merge requests, reverts and digging through history. I understand what happened to the repository rather than just pressing buttons.',
      ja: 'ブランチとマージ、コンフリクトの解消、マージリクエストによるレビュー、リバートと履歴の調査。ボタンを押すだけでなく、リポジトリで何が起きたかを理解しています。',
    },
  },
  {
    id: 'supervisor', name: 'supervisor', icon: 'gear', sizeMb: 210,
    freq: 'freqOften', last: 'lastWeek',
    desc: {
      ru: 'Управление долгоживущими процессами: конфигурация программ и групп, автоперезапуск при падении, разделение окружений, сбор stdout и stderr в логи.',
      en: 'Keeping long-running processes alive: program and group configuration, automatic restart on failure, separate environments, collecting stdout and stderr into logs.',
      ja: '常駐プロセスの管理：プログラムとグループの設定、異常終了時の自動再起動、環境の分離、stdout と stderr のログ収集。',
    },
  },
  {
    id: 'pyrogram', name: 'pyrogram', icon: 'bot', sizeMb: 460,
    freq: 'freqSometimes', last: 'lastMonth',
    desc: {
      ru: 'Работа с Telegram на уровне пользовательского клиента (MTProto): чтение и обработка сообщений, работа с чатами и аккаунтами, задачи, которые недоступны обычному боту.',
      en: 'Working with Telegram at the user-client level (MTProto): reading and processing messages, handling chats and accounts, tasks a regular bot account cannot do.',
      ja: 'ユーザークライアント（MTProto）としての Telegram 操作：メッセージの取得と処理、チャットとアカウントの管理、通常のボットでは行えない処理。',
    },
  },
  {
    id: 'keycloak', name: 'Keycloak', icon: 'key', sizeMb: 890,
    freq: 'freqSometimes', last: 'lastQuarter',
    desc: {
      ru: 'Интеграция сервисов с внешним провайдером аутентификации: realm и клиенты, потоки OAuth2 и OIDC, роли и группы, проверка и обновление токенов на стороне сервиса.',
      en: 'Wiring services up to an external identity provider: realms and clients, OAuth2 and OIDC flows, roles and groups, validating and refreshing tokens on the service side.',
      ja: '外部認証プロバイダとの連携：レルムとクライアント、OAuth2 と OIDC のフロー、ロールとグループ、サービス側でのトークン検証とリフレッシュ。',
    },
  },
  {
    id: 'js', name: 'JavaScript', icon: 'js', sizeMb: 180,
    freq: 'freqRarely', last: 'lastLongAgo',
    desc: {
      ru: 'Точечные правки на фронте, когда это нужно задаче: запросы к API, работа с DOM, мелкие интерфейсные доработки. Задач было мало, практики давно не было — пишу редко и честно об этом говорю. Этот сайт, впрочем, написан на нём вручную.',
      en: 'Front-end work when a task calls for it: API calls, DOM manipulation, small interface fixes. There have not been many such tasks and I am out of practice — I write it rarely and I would rather say so. This site, however, is hand-written in it.',
      ja: '必要に応じたフロントエンドの修正：API 呼び出し、DOM 操作、細かな UI の調整。該当する業務が少なく、実践から離れているため、使用頻度は低いと正直に書いておきます。ただしこのサイト自体は手書きの JavaScript で動いています。',
    },
  },
];

/* ── Данные: опыт и образование («Мои документы») ─────────────────────────── */

const DOCS = [
  {
    id: 'rustat',
    file: { ru: 'РуСтат.doc', en: 'RuStat.doc', ja: 'RuStat.doc' },
    sizeKb: 18,
    type: 'typeDoc',
    modified: { ru: 'сегодня', en: 'today', ja: '今日' },
    icon: 'doc',
    title: {
      ru: 'Февраль 2024 — настоящее время\nPython-разработчик · РуСтат',
      en: 'February 2024 — present\nPython Developer · RuStat',
      ja: '2024年2月 — 現在\nPython 開発者 · RuStat',
    },
    body: {
      ru: `Компания занимается спортивными данными.

Чем занимаюсь:

  · backend продуктовых сервисов на Python;
  · REST API: проектирование эндпоинтов, схемы данных,
    авторизация, документация;
  · сбор и обработка данных из внешних источников,
    приведение их к единому виду и запись в базу;
  · телеграм-боты для внутренних задач: уведомления,
    мониторинг, регулярные отчёты;
  · развёртывание и сопровождение сервисов на Linux,
    разбор инцидентов и чтение логов;
  · работа в команде: merge request'ы, ревью,
    обсуждение задач до того, как они уедут в код.

Код коммерческих проектов не публикуется, поэтому ссылок
на репозитории на этом сайте нет. Технологии и то, как
именно они применялись, — в окне «Установка и удаление
программ».`,
      en: `The company works with sports data.

What I do:

  · Python backend for product services;
  · REST APIs: endpoint design, data schemas,
    authorization, documentation;
  · collecting and processing data from external
    sources, normalising it and storing it;
  · Telegram bots for internal needs: notifications,
    monitoring, recurring reports;
  · deploying and maintaining services on Linux,
    investigating incidents and reading logs;
  · working in a team: merge requests, code review,
    discussing a task before it turns into code.

Commercial code is not published, which is why there are
no repository links on this site. The technologies and how
I used them are in the Add/Remove Programs window.`,
      ja: `スポーツデータを扱う会社です。

担当業務:

  · Python によるプロダクトサービスのバックエンド
  · REST API：エンドポイント設計、データスキーマ、
    認可、ドキュメント作成
  · 外部ソースからのデータ収集と加工、正規化、
    データベースへの保存
  · 社内向け Telegram ボット：通知、監視、定期レポート
  · Linux 上でのサービスのデプロイと運用、
    障害調査とログの確認
  · チーム開発：マージリクエスト、コードレビュー、
    実装前の仕様の擦り合わせ

業務コードは公開していないため、本サイトにリポジトリへの
リンクはありません。使用技術とその使い方は「アプリケー
ションの追加と削除」ウィンドウにまとめてあります。`,
    },
  },
  {
    id: 'education',
    file: { ru: 'Образование.doc', en: 'Education.doc', ja: '学歴.doc' },
    sizeKb: 6,
    type: 'typeDoc',
    modified: { ru: '01.02.2024', en: '01.02.2024', ja: '2024/02/01' },
    icon: 'doc',
    title: {
      ru: 'Образование\nКолледж связи №54',
      en: 'Education\nCollege of Communications No. 54',
      ja: '学歴\n第54通信カレッジ',
    },
    body: {
      ru: `  Специальность
    Информационные системы и программирование

  Квалификация
    Техник по компьютерным системам

  Дипломная работа
    «Настройка туннелей site-to-site VPN»

Специальность сетевая, и это до сих пор помогает:
когда сервис отваливается, вопрос «а дошёл ли вообще
пакет» задаётся раньше, чем «что не так с кодом».`,
      en: `  Programme
    Information systems and programming

  Qualification
    Computer systems technician

  Diploma thesis
    "Configuring site-to-site VPN tunnels"

It was a networking programme, and that still pays off:
when a service goes quiet, "did the packet even arrive"
gets asked before "what is wrong with the code".`,
      ja: `  専攻
    情報システムとプログラミング

  資格
    コンピュータシステム技術者

  卒業論文
    「サイト間 VPN トンネルの構築」

ネットワーク系の専攻で、それが今も役に立っています。
サービスが応答しなくなったとき、「コードの問題か」より先に
「そもそもパケットは届いたのか」を確認する癖がつきました。`,
    },
  },
  {
    id: 'resume',
    file: { ru: 'Резюме.txt', en: 'Resume.txt', ja: '履歴書.txt' },
    sizeKb: 4,
    type: 'typeTxt',
    modified: { ru: 'сегодня', en: 'today', ja: '今日' },
    icon: 'txt',
    title: { ru: 'Резюме.txt', en: 'Resume.txt', ja: '履歴書.txt' },
    body: {
      ru: `РОМАН КОЛЧИН
Python-разработчик · Россия

КОНТАКТЫ
  Почта      krippi22322@gmail.com
  Telegram   @Kripl2232
  GitHub     github.com/Kripl23
  LinkedIn   linkedin.com/in/roman-kolchin

ОПЫТ
  Февраль 2024 — настоящее время
  Python-разработчик, РуСтат (спортивные данные)
  Backend продуктовых сервисов: REST API, сбор и обработка
  данных, телеграм-боты, сопровождение сервисов на Linux.

СТЕК
  Уверенно   Python, FastAPI, Django, aiogram, requests/
             BeautifulSoup/lxml, Linux (Ubuntu), Git,
             supervisor, HTTP и REST
  Знаком     pyrogram, Keycloak (OAuth2 / OIDC)
  Редко      JavaScript

ОБРАЗОВАНИЕ
  Колледж связи №54
  Информационные системы и программирование,
  техник по компьютерным системам.
  Диплом: «Настройка туннелей site-to-site VPN».

ЯЗЫКИ
  Русский      родной
  Английский   свободно
  Японский     JLPT N5 (начальный)`,
      en: `ROMAN KOLCHIN
Python Developer · Russia

CONTACTS
  Email      krippi22322@gmail.com
  Telegram   @Kripl2232
  GitHub     github.com/Kripl23
  LinkedIn   linkedin.com/in/roman-kolchin

EXPERIENCE
  February 2024 — present
  Python Developer, RuStat (sports data)
  Backend for product services: REST APIs, data collection
  and processing, Telegram bots, running services on Linux.

STACK
  Confident  Python, FastAPI, Django, aiogram, requests/
             BeautifulSoup/lxml, Linux (Ubuntu), Git,
             supervisor, HTTP and REST
  Familiar   pyrogram, Keycloak (OAuth2 / OIDC)
  Rarely     JavaScript

EDUCATION
  College of Communications No. 54
  Information systems and programming,
  computer systems technician.
  Thesis: "Configuring site-to-site VPN tunnels".

LANGUAGES
  Russian      native
  English      fluent
  Japanese     JLPT N5 (beginner)`,
      ja: `ロマン・コルチン
Python 開発者 · ロシア

連絡先
  メール     krippi22322@gmail.com
  Telegram   @Kripl2232
  GitHub     github.com/Kripl23
  LinkedIn   linkedin.com/in/roman-kolchin

職務経歴
  2024年2月 — 現在
  Python 開発者、RuStat（スポーツデータ）
  プロダクトサービスのバックエンド：REST API、データの収集と
  加工、Telegram ボット、Linux でのサービス運用。

技術スタック
  得意       Python, FastAPI, Django, aiogram, requests/
             BeautifulSoup/lxml, Linux (Ubuntu), Git,
             supervisor, HTTP と REST
  経験あり   pyrogram, Keycloak (OAuth2 / OIDC)
  使用頻度低 JavaScript

学歴
  第54通信カレッジ
  情報システムとプログラミング専攻、
  コンピュータシステム技術者。
  卒業論文：「サイト間 VPN トンネルの構築」

言語
  ロシア語     母語
  英語         流暢
  日本語       JLPT N5（初級）`,
    },
  },
];

/* ── Данные: экран BIOS ──────────────────────────────────────────────────── */
/* Печатается построчно при загрузке. Правь свободно — это чистая декорация. */

const BIOS_LINES = {
  ru: [
    'Kolchin Systems BIOS v2.00.4  (C) 2000-2026',
    '',
    'Основная память ..................... 640K  OK',
    'Расширенная память .............. 16 лет опыта работы с кодом',
    '',
    'Опрос устройств IDE:',
    '  Primary Master   ... Python 3.12',
    '  Primary Slave    ... PostgreSQL',
    '  Secondary Master ... Ubuntu Server',
    '  Secondary Slave  ... кофеварка (не отвечает)',
    '',
    'Проверка портов ..................... OK',
    'Обнаружен сетевой адаптер ........... HTTP/1.1',
    'Синдром самозванца .................. отключён в настройках BIOS',
    '',
    'Загрузка с диска C: ...',
  ],
  en: [
    'Kolchin Systems BIOS v2.00.4  (C) 2000-2026',
    '',
    'Base Memory ......................... 640K  OK',
    'Extended Memory ................. several years of writing code',
    '',
    'Detecting IDE drives:',
    '  Primary Master   ... Python 3.12',
    '  Primary Slave    ... PostgreSQL',
    '  Secondary Master ... Ubuntu Server',
    '  Secondary Slave  ... coffee machine (not responding)',
    '',
    'Port check .......................... OK',
    'Network adapter detected ............ HTTP/1.1',
    'Impostor syndrome ................... disabled in BIOS setup',
    '',
    'Booting from drive C: ...',
  ],
  ja: [
    'Kolchin Systems BIOS v2.00.4  (C) 2000-2026',
    '',
    'ベースメモリ ........................ 640K  OK',
    '拡張メモリ ...................... コードを書いてきた年数',
    '',
    'IDE ドライブの検出:',
    '  Primary Master   ... Python 3.12',
    '  Primary Slave    ... PostgreSQL',
    '  Secondary Master ... Ubuntu Server',
    '  Secondary Slave  ... コーヒーメーカー (応答なし)',
    '',
    'ポートチェック ...................... OK',
    'ネットワークアダプタ検出 ............ HTTP/1.1',
    'インポスター症候群 .................. BIOS で無効化済み',
    '',
    'ドライブ C: から起動しています ...',
  ],
};

/* ── Контакты ────────────────────────────────────────────────────────────── */
const LINKS = [
  { label: 'E-mail',   value: 'krippi22322@gmail.com',              href: 'mailto:krippi22322@gmail.com', icon: 'mail' },
  { label: 'GitHub',   value: 'github.com/Kripl23',                 href: 'https://github.com/Kripl23', icon: 'github' },
  { label: 'LinkedIn', value: 'linkedin.com/in/roman-kolchin',      href: 'https://www.linkedin.com/in/roman-kolchin/', icon: 'linkedin' },
  { label: 'Telegram', value: '@Kripl2232',                   href: 'https://t.me/Kripl2232', icon: 'telegram' },
];

/* ── Переключение языка ──────────────────────────────────────────────────── */

const I18N = (() => {
  const SUPPORTED = ['ru', 'en', 'ja'];
  const STORE_KEY = 'rk.lang';
  const listeners = [];
  let lang = 'ru';

  /** Язык берётся из сохранённого выбора, иначе из настроек браузера. */
  function detect() {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (saved && SUPPORTED.includes(saved)) return saved;
    } catch (e) { /* приватный режим — просто идём дальше */ }
    const nav = (navigator.language || 'ru').slice(0, 2).toLowerCase();
    return SUPPORTED.includes(nav) ? nav : 'en';
  }

  /** Перевод по ключу. Неизвестный ключ возвращается как есть — так его
      сразу видно в интерфейсе, а не приходится искать молчаливую дыру. */
  function t(key) {
    const d = DICT[lang] || DICT.ru;
    if (key in d) return d[key];
    if (key in DICT.ru) return DICT.ru[key];
    return key;
  }

  /** Выбор значения из объекта вида { ru, en, ja }. */
  function tx(obj) {
    if (!obj) return '';
    return obj[lang] || obj.en || obj.ru || '';
  }

  function set(next) {
    if (!SUPPORTED.includes(next) || next === lang) return;
    lang = next;
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) { /* не критично */ }
    document.documentElement.lang = lang;
    listeners.forEach(fn => fn(lang));
  }

  /** Следующий язык по кругу — трей переключает именно так. */
  function cycle() {
    set(SUPPORTED[(SUPPORTED.indexOf(lang) + 1) % SUPPORTED.length]);
  }

  /** Размер документа в килобайтах на текущем языке. */
  function sizeKb(kb) { return `${kb} ${t('unitKb')}`; }

  /** Размер компонента в единицах текущего языка. */
  function size(mb) {
    if (mb >= 1024) {
      const gb = mb / 1024;
      const num = lang === 'ru' ? gb.toFixed(1).replace('.', ',') : gb.toFixed(1);
      return `${num} ${t('unitGb')}`;
    }
    return `${mb} ${t('unitMb')}`;
  }

  return {
    t, tx, set, cycle, size, sizeKb,
    get lang() { return lang; },
    get supported() { return [...SUPPORTED]; },
    init: () => { lang = detect(); document.documentElement.lang = lang; },
    onChange: fn => listeners.push(fn),
  };
})();
