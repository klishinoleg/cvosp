export interface CaseStudySection {
  title: string;
  body: string;
}

export interface CaseStudySlide {
  title: string;
  kicker: string;
  body: string;
  image?: string;
  facts: string[];
}

export interface CaseStudy {
  slug: string;
  projectId?: number;
  title: string;
  label: string;
  role: string;
  summary: string;
  heroImage: string;
  detailImage: string;
  pdfUrl: string;
  siteUrl?: string;
  accent: "red" | "teal" | "blue";
  metrics: string[];
  stack: string[];
  sections: CaseStudySection[];
  slides: CaseStudySlide[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "exlibrus",
    projectId: 17,
    title: "Exlibrus",
    label: "Книжная платформа / цифровое чтение / AI",
    role: "Полный цикл разработки, продуктовые системы, производительность, AI",
    summary:
      "Боевая платформа для книжного каталога, заказов, издательств, цифрового чтения, импортов, почтовых сценариев и AI-помощников.",
    heroImage: "/cases/exlibrus-home.png",
    detailImage: "/cases/exlibrus-architecture.png",
    pdfUrl: "/cases/Oleg_Klishin_Exlibrus_Case.pdf",
    siteUrl: "https://exlibrus.net/",
    accent: "red",
    metrics: [
      "123 298 активных книг",
      "1 315 издательств",
      "547 094 строк кода в 4 продуктах",
      "2.96M HTTP-запросов за 7 дней",
      "22-32x ускорение кешированной главной",
      "273-307x ускорение поиска в админке",
    ],
    stack: [
      "Next.js",
      "React",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "Celery",
      "Docker",
      "Nginx",
      "PayPal",
      "Brevo",
      "Ollama",
      "Playwright",
    ],
    sections: [
      {
        title: "Бизнес-задача",
        body:
          "Поддерживать и развивать книжную платформу, где каталог, заказы, издательства, импорт, цифровое чтение, письма и админка работают как один продуктовый контур.",
      },
      {
        title: "Моя зона ответственности",
        body:
          "Брал задачи от интерфейса до серверной логики: Next.js, FastAPI, SQL, кеширование, фоновые задачи, платежи, письма, проверки в браузере и диагностика боевого сервиса.",
      },
      {
        title: "Результат для продукта",
        body:
          "Команда получила более быстрые пользовательские и админские сценарии, понятные технические метрики и основу для развития AI-инструментов вокруг реального каталога.",
      },
    ],
    slides: [
      {
        title: "Книжная платформа как операционная система",
        kicker: "Контекст",
        body:
          "Exlibrus объединяет каталог, издательства, заказы, цифровое чтение, рассылки и админ-процессы. Моя роль - связывать эти части в устойчивый продукт, который можно развивать без ручного хаоса.",
        image: "/cases/exlibrus-home.png",
        facts: ["123 298 активных книг", "1 315 издательств", "каталог, заказы, импорт, рассылки"],
      },
      {
        title: "Архитектура и интеграции",
        kicker: "Решение",
        body:
          "Интерфейс, серверная логика, фоновые задачи, кеши, платежи, почтовые провайдеры, AI-инструменты и проверки в браузере сведены в понятный рабочий контур.",
        image: "/cases/exlibrus-architecture.png",
        facts: ["Next.js + FastAPI", "PostgreSQL + Redis + Celery", "PayPal, Brevo, Ollama"],
      },
      {
        title: "Ускорение, которое можно проверить",
        kicker: "Результат",
        body:
          "Улучшения фиксировались через реальные данные, логи, проверки в браузере и конкретные пользовательские сценарии. Это снижает риск и помогает принимать технические решения по фактам.",
        image: "/cases/exlibrus-home.png",
        facts: ["22-32x кешированная главная", "273-307x поиск в админке", "2.96M HTTP-запросов за 7 дней"],
      },
      {
        title: "Что я закрывал как инженер",
        kicker: "Роль",
        body:
          "Домен, данные, пользовательские маршруты, интеграции, качество и производительность. Для заказчика это означает одного человека, который может держать продукт целиком, а не только отдельную задачу.",
        image: "/cases/exlibrus-architecture.png",
        facts: ["ответственность за продукт целиком", "диагностика боевого сервиса", "критичные бизнес-сценарии"],
      },
    ],
  },
  {
    slug: "other-worlds",
    projectId: 2,
    title: "Other Worlds",
    label: "Игра / реальное время / TON",
    role: "Полный цикл разработки, игровые системы, блокчейн, реальное время",
    summary:
      "Web3/MMORPG экосистема с Telegram Mini App, браузерной игрой, NFT-аватарами, TON-контрактом, IPFS-пайплайном, боями в реальном времени и инструментами для рынка.",
    heroImage: "/cases/otherworlds-case.png",
    detailImage: "/cases/otherworlds-stack.png",
    pdfUrl: "/cases/Oleg_Klishin_Otherworlds_Case.pdf",
    siteUrl: "https://other-worlds.io/",
    accent: "teal",
    metrics: [
      "123/123 IPFS-объектов проверены",
      "41 NFT в проверках коллекции",
      "~0.278s до первого события боя",
      "11 раундов / 71 событие боя в боевой проверке",
      "стартовый JS до ~13.77KB + React chunk",
      "обмен 0.2 TON -> 1 983 MAT",
    ],
    stack: [
      "React",
      "Vite",
      "TypeScript",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "Kafka",
      "WebSocket",
      "Docker",
      "TON",
      "FunC",
      "IPFS",
    ],
    sections: [
      {
        title: "Бизнес-задача",
        body:
          "Собрать игровую инфраструктуру, где NFT становится игровым персонажем, а состояние боя, рынка и экономики проходит через сервисы реального времени.",
      },
      {
        title: "Моя зона ответственности",
        body:
          "Связывал React/Vite интерфейс, Telegram Mini App, FastAPI-сервер, Kafka/Redis/WebSocket, TON/FunC контракт, IPFS-медиа и проверки боевого контура.",
      },
      {
        title: "Результат для продукта",
        body:
          "Команда получила проверяемый игровой контур: персонажи, события боя, ассеты, on-chain механики и smoke-тесты работают как части одной системы.",
      },
    ],
    slides: [
      {
        title: "Web3/MMORPG как продуктовая система",
        kicker: "Контекст",
        body:
          "Other Worlds - это Telegram Mini App, браузерная игра, NFT-персонажи, бои в реальном времени, TON-экономика и инструменты вокруг рынка. Ценность не в отдельном экране, а в связке этих частей.",
        image: "/cases/otherworlds-case.png",
        facts: ["Telegram Mini App", "браузерная игра", "NFT как игровой персонаж"],
      },
      {
        title: "Серверная логика боя и игровой цикл",
        kicker: "Решение",
        body:
          "Состояния боя и игровые события проходят через серверный контур, где важны задержка, воспроизводимость, очереди, кеши и проверяемые сценарии.",
        image: "/cases/otherworlds-stack.png",
        facts: ["~0.278s до первого события боя", "11 раундов / 71 событие", "Kafka, Redis, WebSocket"],
      },
      {
        title: "TON, FunC, NFT и IPFS",
        kicker: "Blockchain",
        body:
          "NFT и токеновая экономика связаны с игровым опытом: ассеты проходят через IPFS, коллекция проверяется, а on-chain механики становятся частью продукта.",
        image: "/cases/otherworlds-case.png",
        facts: ["123/123 IPFS-объектов проверены", "41 NFT в проверках коллекции", "TON / FunC / IPFS"],
      },
      {
        title: "Что я закрывал как инженер",
        kicker: "Роль",
        body:
          "Интерфейс, серверные события, блокчейн, производительность, деплой, проверки и продуктовая логика. Для заказчика это означает меньше разрывов между идеей, кодом и живым сервисом.",
        image: "/cases/otherworlds-stack.png",
        facts: ["полный цикл + блокчейн", "игровые системы", "проверка боевого контура"],
      },
    ],
  },
];

export const resumePdfUrl = "/cases/Oleg_Klishin_FullStack_AI_RU.pdf";
