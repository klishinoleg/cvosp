import {ProjectSchema} from "../schemas/project/Project.ts";
import {UserSchema} from "../schemas/user/User.ts";

const skillNames = [
  "Python",
  "Django",
  "FastAPI",
  "JavaScript",
  "TypeScript",
  "React",
  "React Native",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "MongoDB",
  "REST API",
  "WebSocket",
  "Docker",
  "CI/CD",
  "AI / LLM",
  "Облачные сервисы",
  "Мониторинг",
  "Тестирование",
  "TON",
  "SEO / рост",
];

const projectIcon = "/uploads/projects_icons/imia.webp";
const defaultProjectImage = "/cases/otherworlds-case.png";

const getProjectImage = (id: number): string => {
  if (id === 2) return "/cases/otherworlds-case.png";
  if (id === 17) return "/cases/exlibrus-home.png";
  if (id === 18) return "/cases/voice-school-01.jpg";
  return defaultProjectImage;
};

const project = (
  id: number,
  name: string,
  description: string,
  skills: string[],
  site?: string,
  icon = projectIcon,
): ProjectSchema => ({
  id,
  name,
  description,
  icon,
  site,
  skills: skills.map((name, index) => ({id: id * 100 + index, name})),
  images: [
    {
      id: id * 10,
      image: getProjectImage(id),
      thumbnail: getProjectImage(id),
    },
  ],
});

export const fallbackProjects: Record<number, ProjectSchema> = {
  17: project(
    17,
    "Exlibrus",
    "Боевая платформа для книжного каталога, заказов, издательств, цифрового чтения, импортов, рассылок, AI-помощников и оптимизации скорости.",
    ["Next.js", "React", "FastAPI", "PostgreSQL", "Redis", "Celery", "Docker", "AI / LLM"],
    "https://exlibrus.net/",
    "/cases/exlibrus-home.png",
  ),
  18: project(
    18,
    "Voice School",
    "RU/EN production-платформа онлайн-школы вокала: продуктовые страницы, лиды, AI-редактура через MCP, SEO/GEO/AEO и Kubernetes-инфраструктура.",
    ["Django", "PostgreSQL", "AI / LLM", "MCP", "Docker", "Kubernetes", "SEO"],
    "https://voice-school.com/",
    "/cases/voice-school-logo.png",
  ),
  1: project(
    1,
    "Lazy Reader",
    "AI-приложение для чтения и изучения языков: переводы, этимология, субтитры, Telegram Mini App, 100+ языков и многоязычный интерфейс.",
    ["FastAPI", "PostgreSQL", "React", "AI / LLM", "Google Cloud", "Telegram Mini App"],
  ),
  2: project(
    2,
    "Other Worlds",
    "MMORPG/Web3 экосистема с Telegram Mini App, браузерной игрой, NFT-персонажами, TON-контрактами, IPFS и боями в реальном времени.",
    ["React", "TypeScript", "FastAPI", "PostgreSQL", "Redis", "Kafka", "TON", "IPFS"],
    "https://other-worlds.io/",
    "/cases/otherworlds-case.png",
  ),
  3: project(
    3,
    "Maplz",
    "Агрегатор недвижимости с парсингом HTML/XML/JSON, картами, региональными показателями, мультиязычностью и SEO-контуром.",
    ["Django", "PostgreSQL", "Parsing", "Maps", "SEO", "AI translation"],
  ),
  4: project(
    4,
    "Админ-панель Maplz",
    "Админ-панель для управления объектами, регионами, импортами, качеством данных и контентом агрегатора недвижимости.",
    ["React", "Django REST", "PostgreSQL", "Админ-интерфейс"],
  ),
  5: project(
    5,
    "Base Beauty",
    "Каталог beauty-сервисов с карточками организаций, поиском, контентом и административными процессами.",
    ["Django", "MySQL", "SEO", "Управление контентом"],
  ),
  6: project(
    6,
    "Админ-панель Base Beauty",
    "Операционная админка для каталога beauty-сервисов: управление сущностями, контентом и проверкой данных.",
    ["React", "Django", "REST API", "Админ-интерфейс"],
  ),
  7: project(
    7,
    "RuVUZ",
    "Образовательный каталог вузов и программ с поиском, структурированными данными и SEO-страницами.",
    ["Django", "PostgreSQL", "SEO", "Моделирование данных"],
  ),
  8: project(
    8,
    "Админ-панель RuVUZ",
    "Админ-панель для образовательного каталога: сущности, справочники, контент и управление данными.",
    ["React", "Django REST", "Админ-интерфейс", "PostgreSQL"],
  ),
  9: project(
    9,
    "Справочник телефонных номеров",
    "Сервис поиска информации по телефонным номерам и пользовательским данным.",
    ["Django", "MySQL", "Поиск", "SEO"],
  ),
  10: project(
    10,
    "Каталог цитат",
    "Каталог цитат с контентной структурой, поиском и SEO-страницами.",
    ["Django", "Контент", "SEO"],
    undefined,
    "/uploads/projects_icons/tsitaty.png",
  ),
  11: project(
    11,
    "KosmetikaPoisk",
    "Каталог косметики и поисковые страницы для товарного/информационного трафика.",
    ["Django", "SEO", "Каталог"],
  ),
  12: project(
    12,
    "Каталоги скидок",
    "Каталоги скидок сетевых магазинов: структура данных, карточки, категории и SEO.",
    ["Django", "Parsing", "SEO"],
  ),
  13: project(
    13,
    "CTC Media",
    "SEO и контентная стратегия для крупного медийного проекта.",
    ["SEO", "Analytics", "Content strategy"],
  ),
  14: project(
    14,
    "more.tv",
    "Поисковая оптимизация, аналитика и рост органического трафика для медиаплатформы.",
    ["SEO", "Analytics", "Growth"],
  ),
  15: project(
    15,
    "Домашний",
    "Поисковая оптимизация, технический аудит и контентная работа для телеканального сайта.",
    ["SEO", "Technical audit", "Content"],
  ),
  16: project(
    16,
    "Че",
    "Техническое SEO, семантика, аналитика и поддержка роста органического поиска.",
    ["SEO", "Analytics", "Technical SEO"],
  ),
};

const fallbackProjectList = Object.values(fallbackProjects).map((item) => ({
  id: item.id,
  name: item.name,
  thumb: item.icon,
}));

export const fallbackUser: UserSchema = {
  id: 1,
  firstName: "Олег",
  lastName: "Клишин",
  description: "Разработчик полного цикла / AI-инженер",
  username: "klishinoleg",
  isSuperuser: true,
  picture: "/uploads/avatars/oleg-klishin.png",
  thumbnail: "/uploads/avatars/cache/oleg-klishin_png/300x300-center.webp",
  location: "Europe",
  married: true,
  text:
    "Разработчик полного цикла с продуктовым мышлением: Python/FastAPI/Django, React/TypeScript, PostgreSQL/Redis, AI-интеграции, системы реального времени и поддержка боевых сервисов.",
  keyQualities: [
    {id: 1, name: "Продуктовое мышление", description: "Связываю инженерные решения с измеримым пользовательским и бизнес-результатом.", ordering: 1},
    {id: 2, name: "Поставка полного цикла", description: "Могу пройти путь от идеи и модели данных до интерфейса, деплоя и мониторинга.", ordering: 2},
    {id: 3, name: "AI-процессы", description: "Использую LLM там, где они дают рычаг: автоматизация, RAG, перевод, анализ и агенты.", ordering: 3},
  ],
  skills: skillNames.map((name, index) => ({
    id: index + 1,
    name,
    competitionLevel: 8,
    group: Math.floor(index / 6),
    ordering: index + 1,
    skill: {id: index + 1, name},
  })),
  profiles: [
    {
      id: 1,
      name: "Серверная разработка",
      description: "Python, FastAPI, Django, PostgreSQL, MySQL, Redis, MongoDB.",
      icon: "/uploads/profile_icons/backend.webp",
      year: 2019,
    },
    {
      id: 2,
      name: "Интерфейсы",
      description: "React, TypeScript, React Native, Telegram Mini Apps.",
      icon: "/uploads/profile_icons/frontend.webp",
      year: 2021,
    },
    {
      id: 3,
      name: "API и данные",
      description: "REST, WebSocket, парсеры, AI-интеграции и пайплайны данных.",
      icon: "/uploads/profile_icons/api-data-processing.webp",
      year: 2021,
    },
    {
      id: 4,
      name: "Инфраструктура",
      description: "Linux, Nginx, Docker, CI/CD, автоматизация, мониторинг.",
      icon: "/uploads/profile_icons/devops-infrastructure.webp",
      year: 2023,
    },
    {
      id: 5,
      name: "Блокчейн",
      description: "TON, FunC, NFT, IPFS и децентрализованные продуктовые механики.",
      icon: "/uploads/profile_icons/blockchain.webp",
      year: 2024,
    },
  ],
  jobs: [
    {
      id: 1,
      name: "Demis Group",
      profession: "SEO-специалист",
      description: "Поисковая оптимизация, аналитика и продвижение коммерческих веб-проектов.",
      startDate: "2009-01-01",
      endDate: "2011-01-01",
      icon: "/uploads/jobs_icons/demis-grupp.webp",
      projects: [fallbackProjects[13], fallbackProjects[14]].map(({id, name, icon}) => ({id, name, thumb: icon})),
    },
    {
      id: 2,
      name: "Skobeev & Partners",
      profession: "SEO-тимлид",
      description: "Управление командой, технические аудиты, контентная стратегия и измеримый органический рост.",
      startDate: "2011-01-01",
      endDate: "2017-01-01",
      icon: "/uploads/jobs_icons/skobeev-i-partnery.webp",
      projects: [fallbackProjects[15], fallbackProjects[16]].map(({id, name, icon}) => ({id, name, thumb: icon})),
    },
    {
      id: 3,
      name: "CTC Media",
      profession: "SEO-менеджер",
      description: "SEO для крупных медийных продуктов, аналитика, редакционные процессы и эксперименты роста.",
      startDate: "2017-01-01",
      endDate: "2019-01-01",
      icon: "/uploads/jobs_icons/sts-media.webp",
      projects: [fallbackProjects[13], fallbackProjects[14], fallbackProjects[15], fallbackProjects[16]].map(({id, name, icon}) => ({id, name, thumb: icon})),
    },
    {
      id: 4,
      name: "Фриланс / продуктовая разработка",
      profession: "Разработчик полного цикла",
      description: "Продуктовая разработка на стыке интерфейса, серверной логики, AI, интеграций, инфраструктуры и поддержки боевых сервисов.",
      startDate: "2019-01-01",
      icon: "/uploads/jobs_icons/frilans.webp",
      projects: fallbackProjectList.filter((item) => item.id <= 12 || item.id === 17 || item.id === 18),
    },
  ],
  educations: [
    {
      id: 1,
      name: "Тамбовский государственный технический университет",
      profession: "Техническое образование в сфере компьютерных систем",
      description: "Инженерная база и прикладной технический фундамент.",
      startDate: "2003-01-01",
      endDate: "2006-01-01",
      icon: "/uploads/education_icon_images/6a8f5170-1567-4a81-98ea-243677a024d7.webp",
    },
    {
      id: 2,
      name: "Coursera",
      profession: "ООП и паттерны проектирования на Python",
      description: "Архитектура Python и объектно-ориентированное проектирование.",
      startDate: "2019-01-01",
      icon: "/uploads/education_icon_images/80e60fdd-6d9b-4aba-ba9f-31e205466764.webp",
    },
  ],
  contacts: [
    {
      id: 1,
      title: "Telegram",
      link: "https://t.me/KlishinOleg",
      contactInfo: {id: 1, name: "Telegram", icon: "/uploads/contacts_info/telegram.webp"},
    },
    {
      id: 2,
      title: "GitHub",
      link: "https://github.com/klishinoleg",
      contactInfo: {id: 2, name: "GitHub", icon: "/uploads/contacts_info/github.webp"},
    },
  ],
};
