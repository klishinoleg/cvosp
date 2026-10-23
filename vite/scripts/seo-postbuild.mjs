import {mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const baseUrl = "https://klishinoleg.work";
const defaultImage = `${baseUrl}/uploads/avatars/oleg-klishin.png`;

const personSchema = {
  "@type": "Person",
  "@id": `${baseUrl}/#person`,
  name: "Олег Клишин",
  alternateName: ["Oleg Klishin", "klishinoleg"],
  url: `${baseUrl}/`,
  image: defaultImage,
  jobTitle: "Full-Stack / AI Engineer",
  description:
    "Разработчик полного цикла и AI-инженер: Python, FastAPI, Django, React, TypeScript, PostgreSQL, Redis, AI/LLM, RAG, SEO и продуктовые системы.",
  knowsAbout: [
    "Python",
    "FastAPI",
    "Django",
    "React",
    "TypeScript",
    "PostgreSQL",
    "Redis",
    "AI / LLM",
    "RAG",
    "SEO",
    "TON",
    "IPFS",
  ],
  sameAs: [
    "https://github.com/klishinoleg",
    "https://www.linkedin.com/in/klishinoleg/",
    "https://t.me/KlishinOleg",
  ],
};

const pages = [
  {
    path: "/",
    title: "Олег Клишин — Full-Stack / AI Engineer",
    description:
      "Олег Клишин — full-stack / AI engineer: Python, FastAPI, Django, React, TypeScript, PostgreSQL, Redis, AI/LLM, RAG, SEO и продуктовые кейсы Exlibrus, Other Worlds и Voice School.",
    type: "profile",
    image: defaultImage,
    priority: "1.0",
  },
  {
    path: "/cases/exlibrus/",
    title: "Exlibrus — кейс Олега Клишина: full-stack, AI и производительность",
    description:
      "Кейс Exlibrus: книжная платформа, каталог, заказы, издательства, цифровое чтение, AI-помощники и измеримые ускорения до 273-307x.",
    type: "article",
    image: `${baseUrl}/cases/exlibrus-home.png`,
    priority: "0.9",
    caseName: "Exlibrus",
    keywords: ["Exlibrus", "Next.js", "FastAPI", "PostgreSQL", "Redis", "AI", "performance"],
  },
  {
    path: "/cases/other-worlds/",
    title: "Other Worlds — кейс Олега Клишина: Web3/MMORPG, TON, IPFS, real-time",
    description:
      "Кейс Other Worlds: Telegram Mini App, браузерная MMORPG, NFT-аватары, TON/FunC, IPFS и real-time боевые события.",
    type: "article",
    image: `${baseUrl}/cases/otherworlds-case.png`,
    priority: "0.9",
    caseName: "Other Worlds",
    keywords: ["Other Worlds", "Telegram Mini App", "TON", "FunC", "IPFS", "FastAPI", "React"],
  },
  {
    path: "/cases/voice-school/",
    title: "Voice School — кейс Олега Клишина: Django, AI, SEO и Kubernetes",
    description:
      "Кейс Voice School: RU/EN EdTech-платформа, AI-редактура через MCP, 109 стран, 385 городов, SEO/GEO/AEO и Kubernetes-инфраструктура.",
    type: "article",
    image: `${baseUrl}/cases/voice-school-01.jpg`,
    priority: "0.9",
    caseName: "Voice School",
    keywords: ["Voice School", "Django", "MCP", "AI agents", "SEO", "Kubernetes", "EdTech"],
  },
  {
    path: "/projects/lazy-reader-1/",
    title: "Lazy Reader — AI-продукт для чтения и языков | Олег Клишин",
    description:
      "Проект Lazy Reader: AI-перевод, языковые подсказки, Telegram Mini App, React, FastAPI и PostgreSQL.",
    type: "article",
    image: `${baseUrl}/clients/lazy-reader.png`,
    priority: "0.75",
    caseName: "Lazy Reader",
  },
  {
    path: "/projects/other-worlds-2/",
    title: "Other Worlds project dossier | Олег Клишин",
    description:
      "Проектное досье Other Worlds: Web3/MMORPG, React, TypeScript, FastAPI, Kafka, Redis, TON, FunC и IPFS.",
    type: "article",
    image: `${baseUrl}/clients/otherworlds.png`,
    priority: "0.75",
    caseName: "Other Worlds project dossier",
  },
  {
    path: "/projects/seo-for-ctc-13/",
    title: "CTC Media SEO кейс | Олег Клишин",
    description:
      "Досье по SEO/growth работе для CTC Media: семантика, техническое SEO, аналитика, контентная структура и задачи для роста.",
    type: "article",
    image: `${baseUrl}/clients/sts.webp`,
    priority: "0.7",
    caseName: "CTC Media SEO",
  },
  {
    path: "/ai-summary.md",
    title: "AI-readable profile — Олег Клишин",
    description:
      "Короткое машиночитаемое резюме Олега Клишина для LLM, AI agents and retrieval systems.",
    type: "article",
    image: defaultImage,
    priority: "0.6",
  },
  {
    path: "/llms.txt",
    title: "llms.txt — Олег Клишин",
    description: "LLM-readable карта сайта klishinoleg.work: резюме, кейсы, PDF и контакты.",
    type: "article",
    image: defaultImage,
    priority: "0.5",
  },
];

const xmlEscape = (value) => (
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
);

const setTag = (html, pattern, replacement) => (
  pattern.test(html) ? html.replace(pattern, replacement) : html.replace("</head>", `    ${replacement}\n  </head>`)
);

const pageSchema = (page) => {
  const graph = [
    personSchema,
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      url: `${baseUrl}/`,
      name: "klishinoleg.work",
      inLanguage: "ru",
      description: "Портфолио Олега Клишина: full-stack, AI/LLM, React, Python/FastAPI/Django, SEO и продуктовые кейсы.",
      about: {"@id": `${baseUrl}/#person`},
    },
    {
      "@type": page.type === "profile" ? "ProfilePage" : "CreativeWork",
      "@id": `${baseUrl}${page.path}#page`,
      url: `${baseUrl}${page.path}`,
      name: page.title,
      headline: page.title,
      description: page.description,
      image: page.image,
      inLanguage: "ru",
      author: {"@id": `${baseUrl}/#person`},
      about: {"@id": `${baseUrl}/#person`},
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${baseUrl}${page.path}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Олег Клишин",
          item: `${baseUrl}/`,
        },
        ...(page.path === "/"
          ? []
          : [{
              "@type": "ListItem",
              position: 2,
              name: page.caseName || page.title,
              item: `${baseUrl}${page.path}`,
            }]),
      ],
    },
  ];

  if (page.keywords) {
    graph[2].keywords = page.keywords.join(", ");
  }

  return {"@context": "https://schema.org", "@graph": graph};
};

const withMetadata = (sourceHtml, page) => {
  let html = sourceHtml;
  const url = `${baseUrl}${page.path}`;
  const schema = JSON.stringify(pageSchema(page));

  html = html.replace(/<html lang="[^"]*">/, '<html lang="ru">');
  html = setTag(html, /<title>.*?<\/title>/s, `<title>${page.title}</title>`);
  html = setTag(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${page.description}" />`);
  html = setTag(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`);
  html = setTag(html, /<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${page.type}" />`);
  html = setTag(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${page.title}" />`);
  html = setTag(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${page.description}" />`);
  html = setTag(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`);
  html = setTag(html, /<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${page.image}" />`);
  html = setTag(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${page.title}" />`);
  html = setTag(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${page.description}" />`);
  html = setTag(html, /<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${page.image}" />`);
  html = html.replace(
    /<script id="structured-data" type="application\/ld\+json">.*?<\/script>/s,
    `<script id="structured-data" type="application/ld+json">${schema}</script>`,
  );

  return html;
};

const indexHtml = await readFile(path.join(dist, "index.html"), "utf8");

for (const page of pages) {
  const html = withMetadata(indexHtml, page);
  if (page.path === "/") {
    await writeFile(path.join(dist, "index.html"), html);
    continue;
  }

  if (path.extname(page.path)) {
    continue;
  }

  const outputDir = path.join(dist, page.path.replace(/^\//, ""));
  await mkdir(outputDir, {recursive: true});
  await writeFile(path.join(outputDir, "index.html"), html);
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map((page) => `  <url>
    <loc>${xmlEscape(`${baseUrl}${page.path}`)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.path === "/" ? "weekly" : "monthly"}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
  .join("\n")}
</urlset>
`;

await writeFile(path.join(dist, "sitemap.xml"), sitemap);

console.log(`SEO postbuild generated ${pages.length} sitemap URLs and ${pages.filter((page) => !path.extname(page.path)).length} HTML entries.`);
