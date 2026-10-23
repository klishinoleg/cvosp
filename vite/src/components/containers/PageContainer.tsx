import {MouseEvent, ReactNode, TouchEvent, useEffect, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {UserSchema} from "../../schemas/user/User.ts";
import {clearUserError, loadUser, selectUserError, selectUser} from "../../store/slices/user.ts";
import {clearProjectError, selectProjectError} from "../../store/slices/project.ts";
import {useAppDispatch} from "../../store/hooks.ts";
import {helperImageUrl} from "../../helpers/helperImageUrl.ts";
import {ProjectListSchema, ProjectSchema} from "../../schemas/project/Project.ts";
import {Api} from "../../server/api.ts";
import {convertSnakeToCamel} from "../../helpers/helperToCamelCase.ts";
import Markdown from "react-markdown";
import {CaseStudy, caseStudies, resumePdfUrl} from "../../data/caseStudies.ts";
import {fallbackProjects, fallbackUser} from "../../data/fallbackPortfolio.ts";
import {
    BrandMark,
    getProjectMeta,
    portfolioTechStack,
    ProjectMeta,
    TechBrand,
    techBrands,
} from "../../data/portfolioMeta.ts";

type RouteState =
    | { kind: "home" }
    | { kind: "case"; slug: string }
    | { kind: "project"; slug: string };

type ProjectListWithJob = ProjectListSchema & {
    jobName: string;
    jobProfession: string;
    jobRange: string;
};

type PortfolioJob = UserSchema["jobs"][number];

const freshContacts = [
    {label: "Telegram", href: "https://t.me/KlishinOleg"},
    {label: "Email", href: "mailto:klishinoleg@gmail.com"},
    {label: "Телефон", href: "tel:+381658106140", title: "+381 65 810 6140"},
    {label: "GitHub", href: "https://github.com/klishinoleg"},
    {label: "LinkedIn", href: "https://www.linkedin.com/in/klishinoleg/"},
];

const signatureStats = [
    {value: "60+", label: "сайтов и приложений"},
    {value: "2009", label: "SEO и рост"},
    {value: "2019", label: "полный цикл"},
    {value: "2026", label: "AI-системы"},
];

const architectureLayers = [
    "резюме-витрина",
    "страницы кейсов",
    "библиотека проектов",
    "данные портфолио",
    "место под статьи",
    "PDF-презентации",
];

const parseRoute = (): RouteState => {
    const path = window.location.pathname.replace(/\/+$/, "") || "/";
    if (path.startsWith("/cases/")) {
        return {kind: "case", slug: path.replace("/cases/", "")};
    }
    if (path.startsWith("/projects/")) {
        return {kind: "project", slug: path.replace("/projects/", "")};
    }
    return {kind: "home"};
};

const slugify = (value: string): string => {
    const slug = value
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return slug || "project";
};

const projectHref = (project: ProjectListSchema): string => (
    `/projects/${slugify(project.name)}-${project.id}`
);

const caseHref = (study: CaseStudy): string => `/cases/${study.slug}`;

const getProjectIdFromSlug = (slug: string): number | null => {
    const match = slug.match(/(?:^|-)(\d+)$/);
    if (!match) {
        return null;
    }
    return Number.parseInt(match[1], 10);
};

const formatRange = (startDate: string, endDate?: string): string => {
    const start = new Date(startDate).getFullYear();
    const end = endDate ? new Date(endDate).getFullYear() : "сейчас";
    return `${start} - ${end}`;
};

const curatedJobCopy = (job: PortfolioJob): PortfolioJob => {
    const normalizedName = job.name.toLowerCase();
    const directSource = fallbackUser.jobs.find((fallbackJob) => {
        const fallbackName = fallbackJob.name.toLowerCase();
        return normalizedName.includes(fallbackName) || fallbackName.includes(normalizedName);
    });
    const keywordSource = fallbackUser.jobs.find((fallbackJob) => {
        const fallbackName = fallbackJob.name.toLowerCase();
        return (normalizedName.includes("demis") && fallbackName.includes("demis"))
            || (normalizedName.includes("skobeev") && fallbackName.includes("skobeev"))
            || (normalizedName.includes("ctc") && fallbackName.includes("ctc"))
            || (normalizedName.includes("freelance") && fallbackName.includes("фриланс"));
    });
    const source = directSource || keywordSource;

    return source ? {
        ...job,
        profession: source.profession,
        description: source.description,
    } : job;
};

const uniqueProjects = (user: UserSchema): ProjectListWithJob[] => {
    const seen = new Set<number>();
    return user.jobs.flatMap((job) => (
        job.projects.map((project) => ({
            ...project,
            jobName: job.name,
            jobProfession: job.profession,
            jobRange: formatRange(job.startDate, job.endDate),
        }))
    )).filter((project) => {
        if (seen.has(project.id)) {
            return false;
        }
        seen.add(project.id);
        return true;
    });
};

const fetchProject = async (id: number): Promise<ProjectSchema> => {
    try {
        const response = await new Api().get<ProjectSchema>(`/projects/${id}/`);
        return convertSnakeToCamel(response);
    } catch (error) {
        const fallback = fallbackProjects[id];
        if (fallback) {
            return fallback;
        }
        throw error;
    }
};

const resolveProjectImage = (project?: ProjectSchema | ProjectListSchema | null): string | undefined => {
    if (!project) {
        return undefined;
    }
    if ("icon" in project) {
        return helperImageUrl(project.icon);
    }
    return helperImageUrl(project.thumb);
};

const getStudyForProject = (projectId: number | null): CaseStudy | undefined => (
    caseStudies.find((study) => study.projectId === projectId)
);

const initials = (value: string): string => (
    value
        .split(/[\s/+-]+/)
        .filter((item) => /[a-zа-я0-9]/i.test(item))
        .slice(0, 2)
        .map((item) => item[0])
        .join("")
        .toUpperCase()
);

const splitMetric = (metric: string): { value: string; label: string } => {
    const compactMetric = metric.trim();
    const liveSwap = compactMetric.match(/^обмен\s+(.+)$/i);
    if (liveSwap) {
        const swapParts = liveSwap[1].split(/\s*->\s*/);
        if (swapParts.length === 2) {
            return {value: swapParts[1], label: `из ${swapParts[0]}, обмен токенов`};
        }
        return {value: liveSwap[1], label: "обмен токенов"};
    }

    const startupJs = compactMetric.match(/^стартовый JS до\s+([^+]+)(?:\s*\+\s*(.+))?$/i);
    if (startupJs) {
        return {
            value: startupJs[1].trim(),
            label: startupJs[2] ? `стартовый JS + ${startupJs[2].trim()}` : "стартовый JS",
        };
    }

    const fightEvents = compactMetric.match(/^(\d+)\s+раундов\s*\/\s*(\d+)\s+(.+)$/i);
    if (fightEvents) {
        return {value: `${fightEvents[1]} / ${fightEvents[2]}`, label: fightEvents[3]};
    }

    const numericPrefix = compactMetric.match(
        /^(~?(?:\d[\d.,]*(?:\s+\d{3})*|\d+\/\d+)(?:[-–]\d[\d.,]*(?:\s+\d{3})*)?(?:x|M|K|KB|MB|ms|s)?)(?:\s+(.+))?$/i,
    );
    if (numericPrefix) {
        return {value: numericPrefix[1], label: numericPrefix[2] || "результат"};
    }

    return {value: compactMetric, label: "результат"};
};

const handleInternalClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
    navigate: (href: string) => void,
) => {
    if (href.startsWith("/") && !event.metaKey && !event.ctrlKey && !event.shiftKey) {
        event.preventDefault();
        navigate(href);
    }
};

const renderHeroSummary = (caseStudy?: CaseStudy, fallback?: string): ReactNode => {
    if (caseStudy?.slug === "other-worlds") {
        return (
            <>
                Web3/MMORPG экосистема:<br/>
                Telegram Mini App, браузерная игра,<br/>
                NFT-аватары, TON, IPFS<br/>
                и бои в реальном времени.
            </>
        );
    }

    if (caseStudy?.slug === "exlibrus") {
        return (
            <>
                Боевая платформа для книг:<br/>
                каталог, заказы, издательства,<br/>
                цифровое чтение, импорты,<br/>
                почтовые сценарии и AI.
            </>
        );
    }

    return fallback || "Материалы проекта загружаются.";
};

interface SeoDescriptor {
    canonical: string;
    description: string;
    image: string;
    title: string;
    type: "article" | "profile";
}

const siteOrigin = "https://klishinoleg.work";
const defaultSeoImage = `${siteOrigin}/uploads/avatars/oleg-klishin.png`;
const defaultSeoDescription = (
    "Олег Клишин - full-stack / AI engineer: Python, FastAPI, Django, React, TypeScript, " +
    "PostgreSQL, Redis, AI/LLM, RAG, SEO и продуктовые кейсы Exlibrus, Other Worlds и Voice School."
);

const absoluteAssetUrl = (value?: string): string => {
    if (!value) {
        return defaultSeoImage;
    }
    if (/^https?:\/\//i.test(value)) {
        return value;
    }
    return `${siteOrigin}${value.startsWith("/") ? value : `/${value}`}`;
};

const setMetaContent = (selector: string, content: string) => {
    const element = document.head.querySelector<HTMLMetaElement>(selector);
    if (element) {
        element.content = content;
    }
};

const setCanonical = (href: string) => {
    const element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (element) {
        element.href = href;
    }
};

const updateStructuredData = (seo: SeoDescriptor) => {
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Person",
                "@id": `${siteOrigin}/#person`,
                name: "Олег Клишин",
                alternateName: ["Oleg Klishin", "klishinoleg"],
                url: `${siteOrigin}/`,
                image: defaultSeoImage,
                jobTitle: "Full-Stack / AI Engineer",
                description: defaultSeoDescription,
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
            },
            {
                "@type": "WebSite",
                "@id": `${siteOrigin}/#website`,
                url: `${siteOrigin}/`,
                name: "klishinoleg.work",
                inLanguage: "ru",
                description: defaultSeoDescription,
                about: {"@id": `${siteOrigin}/#person`},
            },
            {
                "@type": seo.type === "profile" ? "ProfilePage" : "CreativeWork",
                "@id": `${seo.canonical}#page`,
                url: seo.canonical,
                name: seo.title,
                headline: seo.title,
                description: seo.description,
                image: seo.image,
                inLanguage: "ru",
                author: {"@id": `${siteOrigin}/#person`},
                about: {"@id": `${siteOrigin}/#person`},
            },
        ],
    };
    const element = document.getElementById("structured-data");
    if (element) {
        element.textContent = JSON.stringify(schema);
    }
};

const applySeo = (seo: SeoDescriptor) => {
    document.title = seo.title;
    setMetaContent('meta[name="description"]', seo.description);
    setMetaContent('meta[property="og:type"]', seo.type);
    setMetaContent('meta[property="og:title"]', seo.title);
    setMetaContent('meta[property="og:description"]', seo.description);
    setMetaContent('meta[property="og:url"]', seo.canonical);
    setMetaContent('meta[property="og:image"]', seo.image);
    setMetaContent('meta[name="twitter:title"]', seo.title);
    setMetaContent('meta[name="twitter:description"]', seo.description);
    setMetaContent('meta[name="twitter:image"]', seo.image);
    setCanonical(seo.canonical);
    updateStructuredData(seo);
};

const routeSeo = (
    route: RouteState,
    caseStudy?: CaseStudy,
    meta?: ProjectMeta,
    project?: ProjectSchema | null,
): SeoDescriptor => {
    if (caseStudy) {
        return {
            canonical: `${siteOrigin}${caseHref(caseStudy)}/`,
            description: caseStudy.summary,
            image: absoluteAssetUrl(caseStudy.heroImage),
            title: `${caseStudy.title} - кейс Олега Клишина`,
            type: "article",
        };
    }

    if (route.kind === "project") {
        const projectTitle = meta?.client.name || project?.name || "Проект";
        const description = meta?.summary || project?.description || defaultSeoDescription;
        const image = absoluteAssetUrl(meta?.logo || resolveProjectImage(project));
        return {
            canonical: `${siteOrigin}/projects/${route.slug}/`,
            description,
            image,
            title: `${projectTitle} - проект Олега Клишина`,
            type: "article",
        };
    }

    return {
        canonical: `${siteOrigin}/`,
        description: defaultSeoDescription,
        image: defaultSeoImage,
        title: "Олег Клишин - Full-Stack / AI Engineer",
        type: "profile",
    };
};

export const PageContainer = (): ReactNode => {
    const loadedUser = useSelector(selectUser) as UserSchema | null
    const errorMsg = useSelector(selectUserError)
    const projectErrorMsg = useSelector(selectProjectError)
    const dispatch = useAppDispatch();
    const [route, setRoute] = useState<RouteState>(parseRoute);
    const [pageProject, setPageProject] = useState<ProjectSchema | null>(null);
    const [pageProjectLoading, setPageProjectLoading] = useState(false);
    const [previewProjectId, setPreviewProjectId] = useState<number | null>(null);
    const [previewProject, setPreviewProject] = useState<ProjectSchema | null>(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);
    const [useFallback, setUseFallback] = useState(false);
    const user = loadedUser || (useFallback ? fallbackUser : null);

    const navigate = (href: string) => {
        window.history.pushState(null, "", href);
        setRoute(parseRoute());
        window.scrollTo({top: 0, behavior: "smooth"});
    };

    useEffect(() => {
        if (errorMsg) {
            dispatch(clearUserError());
        }
    }, [errorMsg, dispatch]);

    useEffect(() => {
        if (projectErrorMsg) {
            setNotice(`Ошибка загрузки проекта: ${projectErrorMsg}`);
            dispatch(clearProjectError());
        }
    }, [projectErrorMsg, dispatch]);

    useEffect(() => {
        const load = async () => {
            const result = await dispatch(loadUser(1)) as {meta?: {requestStatus?: string}};
            setUseFallback(result.meta?.requestStatus === "rejected");
        }
        load()
    }, [dispatch]);

    useEffect(() => {
        const syncRoute = () => setRoute(parseRoute());
        window.addEventListener("popstate", syncRoute);
        return () => window.removeEventListener("popstate", syncRoute);
    }, []);

    const allProjects = useMemo(() => user ? uniqueProjects(user) : [], [user]);
    const routeProjectId = route.kind === "project" ? getProjectIdFromSlug(route.slug) : null;
    const routeCaseStudy = route.kind === "case"
        ? caseStudies.find((study) => study.slug === route.slug)
        : getStudyForProject(routeProjectId);
    const routeMeta = getProjectMeta(routeCaseStudy?.projectId || routeProjectId || pageProject?.id);
    const seo = useMemo(
        () => routeSeo(route, routeCaseStudy, routeMeta, pageProject),
        [pageProject, route, routeCaseStudy, routeMeta],
    );

    useEffect(() => {
        applySeo(seo);
    }, [seo]);

    useEffect(() => {
        const projectId = routeCaseStudy?.projectId || routeProjectId;
        if (!projectId) {
            setPageProject(null);
            return;
        }

        let isActive = true;
        setPageProjectLoading(true);
        fetchProject(projectId)
            .then((project) => {
                if (isActive) {
                    setPageProject(project);
                }
            })
            .catch((error: unknown) => {
                if (isActive) {
                    setNotice(`Ошибка загрузки проекта: ${String(error)}`);
                    setPageProject(null);
                }
            })
            .finally(() => {
                if (isActive) {
                    setPageProjectLoading(false);
                }
            });

        return () => {
            isActive = false;
        };
    }, [routeCaseStudy, routeProjectId]);

    useEffect(() => {
        if (!previewProjectId) {
            setPreviewProject(null);
            return;
        }

        let isActive = true;
        setPreviewLoading(true);
        fetchProject(previewProjectId)
            .then((project) => {
                if (isActive) {
                    setPreviewProject(project);
                }
            })
            .catch((error: unknown) => {
                if (isActive) {
                    setNotice(`Ошибка загрузки проекта: ${String(error)}`);
                }
            })
            .finally(() => {
                if (isActive) {
                    setPreviewLoading(false);
                }
            });

        return () => {
            isActive = false;
        };
    }, [previewProjectId]);

    if (!user) {
        return (
            <LoadingPanel/>
        )
    }

    if (route.kind !== "home") {
        return (
            <PortfolioFrame navigate={navigate} notice={notice} onNoticeClose={() => setNotice(null)}>
                <ProjectDetailPage
                    allProjects={allProjects}
                    caseStudy={routeCaseStudy}
                    loading={pageProjectLoading}
                    navigate={navigate}
                    project={pageProject}
                    route={route}
                    user={user}
                />
            </PortfolioFrame>
        );
    }

    return (
        <PortfolioFrame navigate={navigate} notice={notice} onNoticeClose={() => setNotice(null)}>
            <HomePage
                allProjects={allProjects}
                navigate={navigate}
                openPreview={setPreviewProjectId}
                user={user}
            />
            <ProjectPreviewModal
                loading={previewLoading}
                onClose={() => setPreviewProjectId(null)}
                project={previewProject}
            />
        </PortfolioFrame>
    )
}

interface PortfolioFrameProps {
    children: ReactNode;
    navigate: (href: string) => void;
    notice: string | null;
    onNoticeClose: () => void;
}

const PortfolioFrame = ({children, navigate, notice, onNoticeClose}: PortfolioFrameProps) => {
    return (
        <div className="portfolio-shell">
            <header className="portfolio-header">
                <a
                    className="brand-link"
                    href="/"
                    onClick={(event) => handleInternalClick(event, "/", navigate)}
                >
                    <span className="brand-mark" aria-hidden="true">
                        <img src="/brand/ok-logo.svg" alt=""/>
                    </span>
                    <span>klishinoleg.work</span>
                </a>
                <nav className="portfolio-nav" aria-label="Навигация по портфолио">
                    <a href="/#stack">Стек</a>
                    <a href="/#cases">Кейсы</a>
                    <a href="/#projects">Проекты</a>
                    <a href="/#contact">Контакты</a>
                </nav>
            </header>
            {notice && <Notice message={notice} onClose={onNoticeClose}/>}
            {children}
            <footer className="portfolio-footer">
                <span>Олег Клишин</span>
                <span>Разработчик полного цикла / AI-инженер</span>
                <span>Python, React, AI, продуктовые системы</span>
            </footer>
        </div>
    );
};

const LoadingPanel = () => (
    <div className="loading-panel" role="status">
        <span>Загрузка</span>
    </div>
);

interface NoticeProps {
    message: string;
    onClose: () => void;
}

const Notice = ({message, onClose}: NoticeProps) => (
    <div className="notice-bar" role="status">
        <span>{message}</span>
        <button onClick={onClose} type="button">Закрыть</button>
    </div>
);

interface HomePageProps {
    allProjects: ProjectListWithJob[];
    navigate: (href: string) => void;
    openPreview: (projectId: number) => void;
    user: UserSchema;
}

const HomePage = ({allProjects, navigate, openPreview, user}: HomePageProps) => {
    const portraitUrl = helperImageUrl(user.picture || user.thumbnail);
    const featuredIds = new Set(caseStudies.map((study) => study.projectId).filter(Boolean));
    const projectLibrary = [
        ...allProjects.filter((project) => featuredIds.has(project.id)),
        ...allProjects.filter((project) => !featuredIds.has(project.id)),
    ];

    return (
        <main>
            <section className="hero-section">
                <div className="hero-copy">
                    <p className="eyebrow">Разработчик полного цикла / AI-инженер</p>
                    <h1>{user.firstName} {user.lastName}</h1>
                    <p className="hero-lead">
                        Собираю продукт целиком:<br/>
                        интерфейс, API, домен, данные, AI,<br/>
                        события в реальном времени, платежи,<br/>
                        инфраструктуру и поддержку в бою.
                    </p>
                    <div className="hero-actions">
                        <a className="button primary" href="#cases">Смотреть кейсы</a>
                        <a className="button" href={resumePdfUrl}>PDF-резюме</a>
                        <a className="button ghost" href="https://t.me/KlishinOleg">Telegram</a>
                    </div>
                    <HeroTechWall/>
                </div>
                <aside className="hero-panel">
                    <div className="portrait-card">
                        {portraitUrl ? (
                            <img src={portraitUrl} alt={`${user.firstName} ${user.lastName}`}/>
                        ) : (
                            <span>OK</span>
                        )}
                    </div>
                    <div className="stats-grid">
                        {signatureStats.map((stat) => (
                            <div key={stat.label}>
                                <strong>{stat.value}</strong>
                                <span>{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </aside>
            </section>

            <section className="content-section intro-grid">
                <div className="case-hero-copy">
                    <p className="eyebrow">Позиционирование</p>
                    <h2>Инженер, который закрывает расстояние между идеей и живым сервисом.</h2>
                </div>
                <div className="rich-text">
                    <p>{fallbackUser.text}</p>
                    <p>
                        Моя сильная зона - задачи на стыке продукта, интерфейса, серверной логики,
                        данных, AI, инфраструктуры и роста. Я быстро собираю рабочий вертикальный срез,
                        проверяю его в браузере и логах, а затем превращаю в устойчивую систему.
                    </p>
                </div>
            </section>

            <section className="content-section" id="stack">
                <SectionTitle eyebrow="Компетенции" title="Не список технологий, а рабочие контуры продукта."/>
                <div className="profile-grid">
                    {fallbackUser.profiles.map((profile) => (
                        <article className="profile-card" key={profile.id}>
                            <img src={helperImageUrl(profile.icon)} alt="" aria-hidden="true"/>
                            <h3>{profile.name}</h3>
                            <p>{profile.description}</p>
                            <span>{profile.year}</span>
                        </article>
                    ))}
                </div>
                <div className="skill-cloud">
                    {user.skills
                        .slice()
                        .sort((left, right) => left.ordering - right.ordering)
                        .map((skill) => (
                            <span key={skill.id}>{skill.skill?.name || skill.name}</span>
                        ))}
                </div>
            </section>

            <section className="content-section" id="cases">
                <SectionTitle eyebrow="Главные кейсы" title="Кейсы, где видны роль, контекст, решение и результат."/>
                <div className="case-grid">
                    {caseStudies.map((study) => (
                        <article className={`feature-case accent-${study.accent}`} key={study.slug}>
                            <a
                                href={caseHref(study)}
                                onClick={(event) => handleInternalClick(event, caseHref(study), navigate)}
                            >
                                <img src={study.heroImage} alt={study.title}/>
                            </a>
                            <div>
                                <p className="case-label">{study.label}</p>
                                <h3>{study.title}</h3>
                                <p>{study.summary}</p>
                                <div className="metric-row">
                                    {study.metrics.slice(0, 4).map((metric) => (
                                        <span key={metric}>{metric}</span>
                                    ))}
                                </div>
                                <div className="card-actions">
                                    <a
                                        className="button primary"
                                        href={caseHref(study)}
                                        onClick={(event) => handleInternalClick(event, caseHref(study), navigate)}
                                    >
                                    Открыть кейс
                                    </a>
                                    <a className="button ghost" href={study.pdfUrl}>PDF</a>
                                    {study.siteUrl && <a className="button ghost" href={study.siteUrl}>Сайт ↗</a>}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="content-section" id="projects">
                <SectionTitle eyebrow="Проекты" title="Клиенты, продукты и задачи, с которыми я работал."/>
                <div className="project-grid">
                    {projectLibrary.map((project) => {
                        const meta = getProjectMeta(project.id);
                        return (
                        <article className="project-card" key={project.id}>
                            <img src={meta?.logo || resolveProjectImage(project)} alt={project.name}/>
                            <div>
                                <h3>{meta?.client.name || project.name}</h3>
                                <p>{meta?.client.name || project.jobName}</p>
                                <span>{meta?.period || project.jobRange}</span>
                                {meta && <strong className="project-card-type">{meta.category}</strong>}
                            </div>
                            <div className="project-actions">
                                <a
                                    className="small-link"
                                    href={projectHref(project)}
                                    onClick={(event) => handleInternalClick(event, projectHref(project), navigate)}
                                >
                                    Открыть
                                </a>
                                <button className="small-link" onClick={() => openPreview(project.id)} type="button">
                                    Быстрый просмотр
                                </button>
                            </div>
                        </article>
                    )})}
                </div>
            </section>

            <section className="content-section timeline-section">
                <SectionTitle eyebrow="Опыт" title="От SEO и роста к продуктовой инженерии полного цикла."/>
                <div className="timeline">
                    {user.jobs.map(curatedJobCopy).map((job) => (
                        <article className="timeline-item" key={job.id}>
                            <span>{formatRange(job.startDate, job.endDate)}</span>
                            <div>
                                <h3>{job.profession}</h3>
                                <p className="company">{job.name}</p>
                                <p>{job.description}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="content-section architecture-section">
                <SectionTitle eyebrow="Структура" title="Структура готова к расширению статьями и новыми кейсами."/>
                <div className="architecture-grid">
                    {architectureLayers.map((layer) => (
                        <span key={layer}>{layer}</span>
                    ))}
                </div>
            </section>

            <section className="content-section contact-section" id="contact">
                <div>
                    <p className="eyebrow">Контакты</p>
                    <h2>Можно отправить этот сайт вместо длинного объяснения “что я делал”.</h2>
                </div>
                <div className="contact-list">
                    {freshContacts.map((contact) => (
                        <a className="button" href={contact.href} key={contact.label}>
                            {contact.title || contact.label}
                        </a>
                    ))}
                </div>
            </section>
        </main>
    );
};

interface SectionTitleProps {
    eyebrow: string;
    title: string;
}

const SectionTitle = ({eyebrow, title}: SectionTitleProps) => (
    <div className="section-title">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
    </div>
);

interface ProjectDetailPageProps {
    allProjects: ProjectListWithJob[];
    caseStudy?: CaseStudy;
    loading: boolean;
    navigate: (href: string) => void;
    project: ProjectSchema | null;
    route: RouteState;
    user: UserSchema;
}

const ProjectDetailPage = (
    {allProjects, caseStudy, loading, navigate, project, route, user}: ProjectDetailPageProps,
) => {
    const detailProjectId = route.kind === "project" ? getProjectIdFromSlug(route.slug) : null;
    const meta = getProjectMeta(caseStudy?.projectId || detailProjectId || project?.id);
    const title = caseStudy?.title || meta?.client.name || project?.name || "Проект";
    const summary = caseStudy ? renderHeroSummary(caseStudy, project?.description) : meta?.headline || project?.description;
    const image = caseStudy?.heroImage || meta?.logo || resolveProjectImage(project);
    const relatedProjects = allProjects.slice(0, 6);

    return (
        <main>
            <section className={`case-page-hero accent-${caseStudy?.accent || "blue"}`}>
                <div>
                    <a
                        className="back-link"
                        href="/"
                        onClick={(event) => handleInternalClick(event, "/", navigate)}
                    >
                        Назад к резюме
                    </a>
                    <p className="eyebrow">{caseStudy?.label || meta?.category || "Досье проекта"}</p>
                    <h1>{title}</h1>
                    <p className="hero-lead">{summary}</p>
                    <div className="hero-actions">
                        {caseStudy?.pdfUrl && <a className="button primary" href={caseStudy.pdfUrl}>PDF-кейс</a>}
                        {caseStudy?.siteUrl && <a className="button" href={caseStudy.siteUrl}>Открыть сайт</a>}
                        {!caseStudy && project?.site && <a className="button primary" href={project.site}>Открыть сайт</a>}
                    </div>
                </div>
                <div className={`case-page-image ${!caseStudy && meta?.logo ? "logo-frame" : ""}`}>
                    {image && <img src={image} alt={title}/>}
                </div>
                {caseStudy && <CaseMetricBoard metrics={caseStudy.metrics} variant="hero"/>}
            </section>

            {loading && <LoadingPanel/>}

            {caseStudy && (
                <section className="content-section case-page-section">
                    <SectionTitle eyebrow={caseStudy.role} title="Как задача превратилась в работающую систему"/>
                    <CaseSlideDeck caseStudy={caseStudy}/>
                    <div className="case-detail-grid">
                        <div className="story-column">
                            {caseStudy.sections.map((section) => (
                                <article key={section.title}>
                                    <h3>{section.title}</h3>
                                    <p>{section.body}</p>
                                </article>
                            ))}
                        </div>
                        <aside className="case-stack-panel">
                            <p className="eyebrow">Стек и контур</p>
                            <h3>Технологии, которые держат продукт.</h3>
                            <TechLogoCloud items={caseStudy.stack}/>
                        </aside>
                    </div>
                    <img className="wide-case-image" src={caseStudy.detailImage} alt={`${caseStudy.title} detail`}/>
                </section>
            )}

            {meta && !caseStudy && (
                <ProjectDossier meta={meta}/>
            )}

            {project && !meta && (
                <section className="content-section project-db-section">
                    <SectionTitle eyebrow="Материалы проекта" title="Описание проекта и материалы"/>
                    <div className="project-description">
                        <Markdown>{project.description}</Markdown>
                    </div>
                    <TechLogoCloud items={project.skills.map((skill) => skill.name)}/>
                    {project.site && <a className="button ghost" href={project.site}>{project.site}</a>}
                    <ProjectGallery project={project}/>
                </section>
            )}

            {!caseStudy && !project && !loading && (
                <section className="content-section">
                    <SectionTitle eyebrow="Не найдено" title={`Страница ${route.kind} не найдена`}/>
                    <p className="rich-text">Вернитесь на главную страницу резюме {user.firstName} {user.lastName}.</p>
                </section>
            )}

            <section className="content-section">
                <SectionTitle eyebrow="Ещё проекты" title="Другие проекты"/>
                <div className="project-grid compact">
                    {relatedProjects.map((related) => {
                        const relatedMeta = getProjectMeta(related.id);
                        return (
                        <article className="project-card" key={related.id}>
                            <img src={relatedMeta?.logo || resolveProjectImage(related)} alt={related.name}/>
                            <div>
                                <h3>{relatedMeta?.client.name || related.name}</h3>
                                <p>{relatedMeta?.client.name || related.jobName}</p>
                            </div>
                            <a
                                className="small-link"
                                href={projectHref(related)}
                                onClick={(event) => handleInternalClick(event, projectHref(related), navigate)}
                            >
                                Открыть
                            </a>
                        </article>
                    )})}
                </div>
            </section>
        </main>
    );
};

interface BrandMarkCardProps {
    mark: BrandMark;
}

const BrandMarkCard = ({mark}: BrandMarkCardProps) => (
    <div className="brand-card">
        <div className="brand-card-logo">
            {mark.logo ? <img src={mark.logo} alt={mark.name}/> : <span>{initials(mark.name)}</span>}
        </div>
        <div>
            <strong>{mark.name}</strong>
            {mark.note && <span>{mark.note}</span>}
        </div>
    </div>
);

interface TechLogoMarkProps {
    brand: TechBrand;
}

const TechLogoMark = ({brand}: TechLogoMarkProps) => {
    const [logoFailed, setLogoFailed] = useState(false);
    const fallback = brand.mark || initials(brand.name);

    return (
        <span className="tech-logo-mark">
            {brand.logo && !logoFailed ? (
                <img src={brand.logo} alt="" onError={() => setLogoFailed(true)}/>
            ) : fallback}
        </span>
    );
};

interface TechLogoCloudProps {
    items: string[];
}

const TechLogoCloud = ({items}: TechLogoCloudProps) => (
    <div className="tech-logo-cloud">
        {items.map((item) => {
            const brand = techBrands[item] || {name: item};
            return (
                <span className="tech-logo-chip" key={item}>
                    <TechLogoMark brand={brand}/>
                    <span>{brand.name}</span>
                </span>
            );
        })}
    </div>
);

interface CaseMetricBoardProps {
    metrics: string[];
    variant?: "hero";
}

const CaseMetricBoard = ({metrics, variant}: CaseMetricBoardProps) => (
    <div className={`case-metric-board ${variant === "hero" ? "is-hero" : ""}`}>
        {metrics.map((metric) => {
            const {value, label} = splitMetric(metric);
            return (
                <article className="case-metric-card" key={metric}>
                    <strong>{value}</strong>
                    <span>{label}</span>
                </article>
            );
        })}
    </div>
);

const HeroTechWall = () => (
    <section className="hero-tech-wall" aria-label="Технологии Олега Клишина">
        <div className="hero-tech-head">
            <span>Технологии</span>
            <strong>{portfolioTechStack.length}</strong>
        </div>
        <div className="hero-tech-grid">
            {portfolioTechStack.map((item) => {
                const brand = techBrands[item] || {name: item};
                return (
                    <span className="hero-tech-item" key={item}>
                        <TechLogoMark brand={brand}/>
                        <span>{brand.name}</span>
                    </span>
                );
            })}
        </div>
    </section>
);

interface ProjectDossierProps {
    meta: ProjectMeta;
}

const ProjectDossier = ({meta}: ProjectDossierProps) => (
    <section className="content-section dossier-section">
        <div className="dossier-layout">
            <aside className="dossier-sidebar">
                <p className="eyebrow">Клиент</p>
                <BrandMarkCard mark={meta.client}/>
                {meta.partners?.map((partner) => (
                    <BrandMarkCard key={partner.name} mark={partner}/>
                ))}
                <dl className="dossier-facts">
                    <div>
                        <dt>Роль</dt>
                        <dd>{meta.role}</dd>
                    </div>
                    <div>
                        <dt>Период</dt>
                        <dd>{meta.period}</dd>
                    </div>
                    <div>
                        <dt>Фокус</dt>
                        <dd>{meta.category}</dd>
                    </div>
                </dl>
            </aside>

            <div className="dossier-main">
                <SectionTitle eyebrow="Досье проекта" title={meta.headline}/>
                <p className="dossier-summary">{meta.summary}</p>

                <div className="dossier-grid">
                    <article>
                        <h3>Контекст заказчика</h3>
                        <p>{meta.context}</p>
                    </article>
                    <article>
                        <h3>Что я делал</h3>
                        <ul>
                            {meta.contribution.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                    </article>
                    <article>
                        <h3>Что получил бизнес</h3>
                        <ul>
                            {meta.businessValue.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                    </article>
                    <article>
                        <h3>Подтверждения</h3>
                        <div className="evidence-list">
                            {meta.evidence.map((item) => <span key={item}>{item}</span>)}
                        </div>
                    </article>
                </div>

                <TechLogoCloud items={meta.technologies}/>
            </div>
        </div>
    </section>
);

interface CaseSlideDeckProps {
    caseStudy: CaseStudy;
}

const CaseSlideDeck = ({caseStudy}: CaseSlideDeckProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const activeSlide = caseStudy.slides[activeIndex];
    const totalSlides = caseStudy.slides.length;

    const move = (direction: -1 | 1) => {
        setActiveIndex((current) => (
            (current + direction + totalSlides) % totalSlides
        ));
    };

    const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
        if (touchStartX === null) {
            return;
        }

        const delta = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 42) {
            move(delta < 0 ? 1 : -1);
        }
        setTouchStartX(null);
    };

    if (!activeSlide) {
        return null;
    }

    return (
        <article
            className={`slide-deck accent-${caseStudy.accent}`}
            onTouchEnd={handleTouchEnd}
            onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
        >
            <div className="slide-copy">
                <p className="case-label">{activeSlide.kicker}</p>
                <h3>{activeSlide.title}</h3>
                <p>{activeSlide.body}</p>
                <div className="metric-row">
                    {activeSlide.facts.map((fact) => (
                        <span key={fact}>{fact}</span>
                    ))}
                </div>
            </div>
            <div className="slide-stage">
                {activeSlide.image ? (
                    <img src={activeSlide.image} alt={activeSlide.title}/>
                ) : (
                    <div className="slide-placeholder">
                        <span>{activeSlide.kicker}</span>
                        <strong>{activeSlide.title}</strong>
                        <div className="slide-placeholder-facts">
                            {activeSlide.facts.map((fact) => (
                                <i key={fact}>{fact}</i>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="slide-controls" aria-label={`Слайды кейса ${caseStudy.title}`}>
                <button className="deck-arrow" onClick={() => move(-1)} type="button" aria-label="Предыдущий слайд">
                    ←
                </button>
                <div className="deck-progress" aria-label={`Слайд ${activeIndex + 1} из ${totalSlides}`}>
                    <span>{String(activeIndex + 1).padStart(2, "0")}</span>
                    <div className="deck-progress-track">
                        <i style={{width: `${((activeIndex + 1) / totalSlides) * 100}%`}}/>
                    </div>
                    <span>{String(totalSlides).padStart(2, "0")}</span>
                </div>
                <button className="deck-arrow" onClick={() => move(1)} type="button" aria-label="Следующий слайд">
                    →
                </button>
            </div>
        </article>
    );
};

interface ProjectGalleryProps {
    project: ProjectSchema;
}

const ProjectGallery = ({project}: ProjectGalleryProps) => {
    if (!project.images.length) {
        return null;
    }

    return (
        <div className="gallery-grid">
            {project.images.map((image) => (
                <a href={helperImageUrl(image.image)} key={image.id}>
                    <img src={helperImageUrl(image.thumbnail || image.image)} alt={project.name}/>
                </a>
            ))}
        </div>
    );
};

interface ProjectPreviewModalProps {
    loading: boolean;
    onClose: () => void;
    project: ProjectSchema | null;
}

const ProjectPreviewModal = ({loading, onClose, project}: ProjectPreviewModalProps) => {
    const meta = getProjectMeta(project?.id);

    return (
    <>
        {(project || loading) && (
            <div className="modal-overlay" onMouseDown={onClose} role="presentation">
                <section
                    aria-label={meta?.client.name || project?.name || "Быстрый просмотр проекта"}
                    className="project-preview-modal"
                    onMouseDown={(event) => event.stopPropagation()}
                    role="dialog"
                >
                    <button className="modal-close" onClick={onClose} type="button">Закрыть</button>
                    {loading && <LoadingPanel/>}
                    {project && (
                        <div className="modal-project">
                            <div className="modal-head">
                                <img src={meta?.logo || resolveProjectImage(project)} alt={meta?.client.name || project.name}/>
                                <div>
                                    <h2>{meta?.client.name || project.name}</h2>
                                    {meta && <p>{meta.category}</p>}
                                    {project.site && <a href={project.site}>{project.site}</a>}
                                </div>
                            </div>
                            <TechLogoCloud items={meta?.technologies || project.skills.map((skill) => skill.name)}/>
                            {meta ? (
                                <div className="project-description">
                                    <p>{meta.summary}</p>
                                </div>
                            ) : (
                                <div className="project-description">
                                    <Markdown>{project.description}</Markdown>
                                </div>
                            )}
                            <ProjectGallery project={project}/>
                        </div>
                    )}
                </section>
            </div>
        )}
    </>
    );
};
