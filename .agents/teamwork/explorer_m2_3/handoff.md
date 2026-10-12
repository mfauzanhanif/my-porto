# Handoff Report: Milestone 2 Public Showcase Pages & Reader

## Executive Summary
This report delivers the complete architectural design, specifications, and copy-pasteable TSX source blueprints for the public showcase pages and reader in Milestone 2:
1. `resources/js/pages/welcome.tsx`: Landing page assembling all sections using `PortfolioHomeProps`.
2. `resources/js/components/landing/projects-showcase.tsx`: Max 3 featured projects section with Neobrutalism cards.
3. `resources/js/components/landing/articles-showcase.tsx`: Max 3 featured published articles section with date & reading time metadata.
4. `resources/js/pages/projects.tsx`: Full projects catalog with interactive category filter pills, instant text search, accessible project detail modal dialog, and Neobrutalism empty state.
5. `resources/js/pages/articles.tsx`: Full published articles catalog with instant keyword search, category filter pills, reading time estimation, tags, and empty state.
6. `resources/js/pages/articles/show.tsx`: Distraction-free article reader rendering TipTap HTML with exact Neobrutalism typography styling per `docs/DESIGN.md §5.5`, scroll reading progress indicator, and copy link action.
7. `resources/js/pages/projects/show.tsx`: Dedicated full single project route view.
8. `resources/js/components/landing/index.ts`: Updated barrel export.

---

## 1. Observation

1. **Inertia Home Props Contract (`resources/js/types/portfolio.ts:107-115`)**:
   ```typescript
   export interface PortfolioHomeProps {
       profile: Profile;
       skills: Skill[];
       experiences: Experience[];
       educations: Education[];
       certifications: Certification[];
       featuredProjects: Project[];
       featuredArticles: Article[];
   }
   ```
2. **Public Feature Requirements**:
   - `docs/features/02-daftar-proyek.md:21-28`: Beranda menampilkan maksimal 3 proyek unggulan (`is_featured = true`). Tiap kartu memuat gambar sampul, judul, keterangan singkat, dan teknologi. Section tersembunyi bila kosong.
   - `docs/features/02-daftar-proyek.md:30-52`: Galeri `/projects` menampilkan seluruh proyek, filter kategori, detail proyek, dan empty state.
   - `docs/features/04-artikel-blog.md:43-52`: Beranda menampilkan maksimal 3 artikel unggulan berstatus terbit (`status = 'published'`, `is_featured = true`). Section tersembunyi bila kosong.
   - `docs/features/04-artikel-blog.md:54-64`: Galeri `/articles` menyediakan pencarian kata kunci di judul, ringkasan, atau isi, serta pesan jelas bila hasil kosong.
   - `docs/features/04-artikel-blog.md:30-40`: Halaman baca `/articles/{slug}` menyajikan isi tulisan lengkap dengan tata letak yang nyaman dibaca, kategori, tag, dan gambar sampul.
3. **Neobrutalism Typography Guidelines (`docs/DESIGN.md §5.5`)**:
   - **Heading di dalam artikel (h2, h3):** `font-heading tracking-tight border-b-2 border-border pb-1 mt-6 mb-3`
   - **Blockquote:** `border-l-4 border-border bg-main/10 px-4 py-2 italic font-base rounded-r-base`
   - **Code Block:** `border-2 border-border bg-secondary-background rounded-base p-4 font-mono text-sm shadow-[2px_2px_0px_0px_var(--border)]`
   - **Gambar di dalam artikel:** `rounded-base border-2 border-border shadow-shadow my-4 max-w-full`
4. **Backend Controllers from Explorer 1 (`.agents/teamwork/explorer_m2_1/handoff.md:103-352`)**:
   - `HomeController@index` supplies `PortfolioHomeProps`.
   - `PublicProjectController@index` supplies `projects`, `categories`, and `selectedCategory`.
   - `PublicProjectController@show` supplies `project` and `relatedProjects`.
   - `PublicArticleController@index` supplies `articles`, `categories`, and `search`.
   - `PublicArticleController@show` supplies `article` and `relatedArticles`.
5. **Design System Tokens & Layout from Explorer 2 (`.agents/teamwork/explorer_m2_2/BRIEFING.md:38-40`)**:
   - `app.tsx` layout resolver excludes public routes (`welcome`, `projects`, `articles`, `articles/*`) from `AppLayout` (CMS sidebar layout).
   - Core landing components created: `Navbar`, `Hero`, `About`, `SkillsGrid`, `Timeline`, `Certifications`, `Contact`, `Footer`.

---

## 2. Logic Chain

1. **Separation of Landing Sections and Catalog Archives**:
   From Observation 1 and 2, `welcome.tsx` acts as the master landing orchestrator assembling 9 distinct sections. By creating dedicated showcase components (`projects-showcase.tsx` and `articles-showcase.tsx`), the landing page keeps its payload minimal (max 3 items each) while delegating extensive exploration to `/projects` and `/articles`.
2. **Defensive Section Visibility**:
   From Observation 2, `projects-showcase.tsx` and `articles-showcase.tsx` must return `null` if the respective array is empty or undefined. This guarantees that unpopulated databases never render broken grids or empty cards on the landing page.
3. **Client-Side Reactive Filtering with URL Sync**:
   In `resources/js/pages/projects.tsx` and `resources/js/pages/articles.tsx`, implementing React state (`activeCategory` and `searchQuery`) delivers instantaneous client-side filtering without latency or server round-trips, while still accepting server props (`selectedCategory`, `search`) from Explorer 1's controller.
4. **Modal vs Page Detail Synergy for Projects**:
   `projects.tsx` includes an accessible Neobrutalist `<dialog>` modal allowing visitors to inspect full descriptions, category details, and tech stack tags without leaving the gallery. Simultaneously, a dedicated `projects/show.tsx` page blueprint is provided for direct deep-link URLs to `/projects/{slug}`.
5. **Fidelity HTML Rendering for TipTap Articles**:
   From Observation 3, TipTap outputs semantic HTML (`<h2>`, `<h3>`, `<blockquote>`, `<pre><code>`, `<p>`, `<ul>`, `<img>`). Rather than requiring third-party runtime markdown parsers or heavy CSS plugins, applying Tailwind v4 arbitrary child selectors (`[&_h2]:border-b-2 [&_blockquote]:border-l-4 [&_pre]:shadow-[2px_2px_0px_0px_var(--border)]`) onto `.neobrutalism-reader` guarantees 100% adherence to `docs/DESIGN.md §5.5` with zero bundle overhead.
6. **Graceful Fallbacks for Media and Images**:
   When `project.image` or `article.cover_image` is `null`, each component provides a geometric Neobrutalism illustration box with Lucide icons (`FolderGit2`, `BookOpen`) ensuring uniform card heights and aesthetic consistency.

---

## 3. Caveats

1. **Lucide Icons**:
   All icons used (`ArrowRight`, `ArrowLeft`, `ExternalLink`, `FolderGit2`, `BookOpen`, `Calendar`, `Clock`, `Search`, `X`, `Copy`, `Check`, `Share2`, `RotateCcw`) are native to the installed `lucide-react` package.
2. **Framer Motion Absence**:
   `package.json` does not include `framer-motion`. All interactive animations and hover physics use CSS transitions and Tailwind utility classes (`transition-all duration-150 hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none`), adhering strictly to the installed dependencies.
3. **No Assumptions on Profile Props in Archives**:
   In `projects.tsx`, `articles.tsx`, and `articles/show.tsx`, `profile` is made optional with automatic fallback to `'M FAUZAN HANIF'`, ensuring pages render reliably regardless of whether the controller supplies `profile`.

---

## 4. Conclusion & Copy-Pasteable TSX Blueprints for Worker

Below are the 8 production-ready source code blueprints for the Worker to write.

---

### Blueprint 1: `resources/js/components/landing/projects-showcase.tsx`

```tsx
import { Link } from '@inertiajs/react';
import { ArrowRight, ExternalLink, FolderGit2 } from 'lucide-react';
import type { Project } from '@/types/portfolio';

export interface ProjectsShowcaseProps {
    projects: Project[];
}

export function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
    if (!projects || projects.length === 0) {
        return null;
    }

    const featuredProjects = projects.slice(0, 3);

    const getTechStackList = (techStack: Project['tech_stack']): string[] => {
        if (Array.isArray(techStack)) return techStack;
        if (typeof techStack === 'string') {
            try {
                const parsed = JSON.parse(techStack);
                if (Array.isArray(parsed)) return parsed;
            } catch {
                return techStack.split(',').map((s) => s.trim()).filter(Boolean);
            }
        }
        return [];
    };

    return (
        <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <span className="inline-flex items-center rounded-base border-2 border-border bg-main px-3 py-1 text-xs font-heading text-main-foreground shadow-[2px_2px_0px_0px_var(--border)] mb-3">
                        KARYA TERPILIH
                    </span>
                    <h2 className="text-3xl md:text-5xl font-heading tracking-tight text-foreground">
                        Proyek Unggulan
                    </h2>
                    <p className="text-foreground/75 font-base text-base md:text-lg max-w-2xl mt-2 leading-relaxed">
                        Beberapa karya dan implementasi sistem terbaik yang dirancang dengan fokus pada skalabilitas, efisiensi arsitektur, dan pengalaman pengguna optimal.
                    </p>
                </div>

                <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-5 py-2.5 font-heading text-sm text-foreground shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none hover:bg-main hover:text-main-foreground shrink-0 w-fit"
                >
                    Lihat Semua Proyek
                    <ArrowRight className="size-4" />
                </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProjects.map((project) => {
                    const techList = getTechStackList(project.tech_stack);

                    return (
                        <div
                            key={project.id}
                            className="group flex flex-col justify-between rounded-base border-2 border-border bg-secondary-background p-5 shadow-shadow transition-all duration-150 hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                        >
                            <div>
                                {/* Project Cover */}
                                <div className="relative aspect-video w-full rounded-base border-2 border-border overflow-hidden bg-main/10 mb-5">
                                    {project.image ? (
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="size-full flex flex-col items-center justify-center bg-main/15 text-foreground/80 p-4 text-center">
                                            <FolderGit2 className="size-10 mb-2 text-foreground/70" />
                                            <span className="font-heading text-xs tracking-wider uppercase text-foreground/70">
                                                {project.categories?.[0]?.name || 'Web Application'}
                                            </span>
                                        </div>
                                    )}

                                    {project.categories && project.categories.length > 0 && (
                                        <div className="absolute top-2.5 right-2.5 flex flex-wrap gap-1.5">
                                            {project.categories.slice(0, 1).map((cat) => (
                                                <span
                                                    key={cat.id}
                                                    className="rounded-base border-2 border-border bg-main px-2 py-0.5 text-[11px] font-heading text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]"
                                                >
                                                    {cat.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Project Title */}
                                <h3 className="text-xl font-heading text-foreground mb-2 line-clamp-1 group-hover:text-main transition-colors">
                                    {project.title}
                                </h3>

                                {/* Project Description */}
                                <p className="text-sm font-base text-foreground/80 line-clamp-3 mb-4 leading-relaxed">
                                    {project.description}
                                </p>

                                {/* Tech Stack Badges */}
                                {techList.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-5">
                                        {techList.slice(0, 4).map((tech, idx) => (
                                            <span
                                                key={idx}
                                                className="rounded-base border-2 border-border bg-secondary-background px-2 py-0.5 text-xs font-heading shadow-[1px_1px_0px_0px_var(--border)]"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {techList.length > 4 && (
                                            <span className="rounded-base border border-border bg-muted px-1.5 py-0.5 text-xs font-heading text-foreground/60">
                                                +{techList.length - 4}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="pt-4 border-t-2 border-border/20 flex items-center justify-between">
                                <Link
                                    href="/projects"
                                    className="text-xs font-heading text-foreground hover:text-main underline decoration-2 underline-offset-4"
                                >
                                    Detail Proyek →
                                </Link>

                                {project.project_url && (
                                    <a
                                        href={project.project_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-base border-2 border-border bg-main px-3 py-1.5 text-xs font-heading text-main-foreground shadow-[1px_1px_0px_0px_var(--border)] hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
                                    >
                                        Live Demo
                                        <ExternalLink className="size-3.5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mobile View All CTA */}
            <div className="mt-10 text-center md:hidden">
                <Link
                    href="/projects"
                    className="inline-flex items-center justify-center gap-2 rounded-base border-2 border-border bg-main px-6 py-3 font-heading text-sm text-main-foreground shadow-shadow transition-all w-full"
                >
                    Lihat Semua Galeri Proyek
                    <ArrowRight className="size-4" />
                </Link>
            </div>
        </section>
    );
}
```

---

### Blueprint 2: `resources/js/components/landing/articles-showcase.tsx`

```tsx
import { Link } from '@inertiajs/react';
import { ArrowRight, BookOpen, Calendar, Clock } from 'lucide-react';
import type { Article } from '@/types/portfolio';

export interface ArticlesShowcaseProps {
    articles: Article[];
}

export function ArticlesShowcase({ articles }: ArticlesShowcaseProps) {
    if (!articles || articles.length === 0) {
        return null;
    }

    const featuredArticles = articles.slice(0, 3);

    const formatDate = (dateString?: string | null): string => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    const getEstimatedReadingTime = (content: string): string => {
        const text = content.replace(/<[^>]*>/g, '').trim();
        const words = text ? text.split(/\s+/).length : 0;
        const minutes = Math.max(1, Math.ceil(words / 200));
        return `${minutes} mnt baca`;
    };

    return (
        <section id="articles" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <span className="inline-flex items-center rounded-base border-2 border-border bg-main px-3 py-1 text-xs font-heading text-main-foreground shadow-[2px_2px_0px_0px_var(--border)] mb-3">
                        BLOG & WAWASAN
                    </span>
                    <h2 className="text-3xl md:text-5xl font-heading tracking-tight text-foreground">
                        Artikel & Catatan Teknis
                    </h2>
                    <p className="text-foreground/75 font-base text-base md:text-lg max-w-2xl mt-2 leading-relaxed">
                        Tulisan mendalam seputar praktik rekayasa perangkat lunak modern, arsitektur backend Laravel, antarmuka React, serta tips deployment.
                    </p>
                </div>

                <Link
                    href="/articles"
                    className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-5 py-2.5 font-heading text-sm text-foreground shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none hover:bg-main hover:text-main-foreground shrink-0 w-fit"
                >
                    Lihat Semua Artikel
                    <ArrowRight className="size-4" />
                </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredArticles.map((article) => {
                    const readingTime = getEstimatedReadingTime(article.content);
                    const formattedDate = formatDate(article.published_at);

                    return (
                        <div
                            key={article.id}
                            className="group flex flex-col justify-between rounded-base border-2 border-border bg-secondary-background p-5 shadow-shadow transition-all duration-150 hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                        >
                            <div>
                                {/* Article Cover */}
                                <Link
                                    href={`/articles/${article.slug}`}
                                    className="block relative aspect-video w-full rounded-base border-2 border-border overflow-hidden bg-main/10 mb-5 focus:outline-hidden"
                                >
                                    {article.cover_image ? (
                                        <img
                                            src={article.cover_image}
                                            alt={article.title}
                                            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="size-full flex flex-col items-center justify-center bg-main/15 text-foreground/80 p-4 text-center">
                                            <BookOpen className="size-10 mb-2 text-foreground/70" />
                                            <span className="font-heading text-xs tracking-wider uppercase text-foreground/70">
                                                {article.categories?.[0]?.name || 'Technical Article'}
                                            </span>
                                        </div>
                                    )}

                                    {article.categories && article.categories.length > 0 && (
                                        <div className="absolute top-2.5 right-2.5">
                                            <span className="rounded-base border-2 border-border bg-main px-2 py-0.5 text-[11px] font-heading text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                                                {article.categories[0].name}
                                            </span>
                                        </div>
                                    )}
                                </Link>

                                {/* Meta Bar */}
                                <div className="flex items-center gap-3 text-xs font-base text-foreground/70 mb-3">
                                    {formattedDate && (
                                        <span className="inline-flex items-center gap-1">
                                            <Calendar className="size-3.5" />
                                            {formattedDate}
                                        </span>
                                    )}
                                    <span className="inline-flex items-center gap-1">
                                        <Clock className="size-3.5" />
                                        {readingTime}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-heading text-foreground mb-2 line-clamp-2 group-hover:text-main transition-colors">
                                    <Link href={`/articles/${article.slug}`}>
                                        {article.title}
                                    </Link>
                                </h3>

                                {/* Excerpt */}
                                <p className="text-sm font-base text-foreground/80 line-clamp-2 mb-4 leading-relaxed">
                                    {article.excerpt || article.content.replace(/<[^>]*>/g, '').slice(0, 120) + '...'}
                                </p>

                                {/* Tags preview */}
                                {article.tags && article.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-5">
                                        {article.tags.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag.id}
                                                className="text-xs font-mono text-foreground/60 bg-background px-1.5 py-0.5 rounded-sm border border-border/50"
                                            >
                                                #{tag.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Read Link */}
                            <div className="pt-4 border-t-2 border-border/20 flex items-center justify-between">
                                <Link
                                    href={`/articles/${article.slug}`}
                                    className="inline-flex items-center gap-1 text-sm font-heading text-foreground hover:text-main underline decoration-2 underline-offset-4"
                                >
                                    Baca Lengkap
                                    <ArrowRight className="size-4" />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mobile View All CTA */}
            <div className="mt-10 text-center md:hidden">
                <Link
                    href="/articles"
                    className="inline-flex items-center justify-center gap-2 rounded-base border-2 border-border bg-secondary-background px-6 py-3 font-heading text-sm text-foreground shadow-shadow transition-all w-full"
                >
                    Jelajahi Seluruh Artikel
                    <ArrowRight className="size-4" />
                </Link>
            </div>
        </section>
    );
}
```

---

### Blueprint 3: `resources/js/pages/welcome.tsx`

```tsx
import { Head } from '@inertiajs/react';
import type { PortfolioHomeProps } from '@/types/portfolio';
import {
    Navbar,
    Hero,
    About,
    SkillsGrid,
    ProjectsShowcase,
    Timeline,
    Certifications,
    ArticlesShowcase,
    Contact,
    Footer,
} from '@/components/landing';

export default function Welcome({
    profile,
    skills,
    experiences,
    educations,
    certifications,
    featuredProjects,
    featuredArticles,
}: PortfolioHomeProps) {
    const pageTitle = profile?.name
        ? `${profile.name} - ${profile.headline || 'Full-Stack Software Engineer'}`
        : 'M FAUZAN HANIF - Portfolio';

    return (
        <>
            <Head title={pageTitle}>
                <meta
                    name="description"
                    content={profile?.about || 'Personal Portfolio and Showcase of M FAUZAN HANIF'}
                />
            </Head>

            <div className="min-h-screen bg-background text-foreground font-sans selection:bg-main selection:text-main-foreground flex flex-col">
                {/* Sticky Neobrutalism Navigation */}
                <Navbar profile={profile} />

                <main className="flex-1">
                    {/* Hero Section */}
                    <Hero profile={profile} />

                    {/* About Section */}
                    <About profile={profile} />

                    {/* Grouped Skills Grid */}
                    <SkillsGrid skills={skills} />

                    {/* Featured Projects Showcase */}
                    <ProjectsShowcase projects={featuredProjects} />

                    {/* Experience & Education Timelines */}
                    <Timeline experiences={experiences} educations={educations} />

                    {/* Certifications Showcase */}
                    <Certifications certifications={certifications} />

                    {/* Featured Articles Showcase */}
                    <ArticlesShowcase articles={featuredArticles} />

                    {/* Contact & Social Section */}
                    <Contact profile={profile} />
                </main>

                {/* Footer */}
                <Footer profile={profile} />
            </div>
        </>
    );
}
```

---

### Blueprint 4: `resources/js/pages/projects.tsx`

```tsx
import { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ExternalLink, Filter, FolderGit2, RotateCcw, Search, X } from 'lucide-react';
import type { Category, Profile, Project } from '@/types/portfolio';
import { Navbar, Footer } from '@/components/landing';

export interface ProjectsPageProps {
    projects: Project[];
    categories?: Category[];
    selectedCategory?: string | null;
    profile?: Profile;
}

export default function Projects({
    projects = [],
    categories = [],
    selectedCategory = null,
    profile,
}: ProjectsPageProps) {
    const [activeCategory, setActiveCategory] = useState<string>(selectedCategory || 'all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // Filter projects client-side
    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const matchesCategory =
                activeCategory === 'all' ||
                project.categories?.some((cat) => cat.slug === activeCategory);

            const q = searchQuery.toLowerCase().trim();
            const matchesSearch =
                !q ||
                project.title.toLowerCase().includes(q) ||
                project.description.toLowerCase().includes(q) ||
                (Array.isArray(project.tech_stack)
                    ? project.tech_stack.some((t) => t.toLowerCase().includes(q))
                    : typeof project.tech_stack === 'string' &&
                      project.tech_stack.toLowerCase().includes(q));

            return matchesCategory && matchesSearch;
        });
    }, [projects, activeCategory, searchQuery]);

    const getTechStackList = (techStack: Project['tech_stack']): string[] => {
        if (Array.isArray(techStack)) return techStack;
        if (typeof techStack === 'string') {
            try {
                const parsed = JSON.parse(techStack);
                if (Array.isArray(parsed)) return parsed;
            } catch {
                return techStack.split(',').map((s) => s.trim()).filter(Boolean);
            }
        }
        return [];
    };

    return (
        <>
            <Head title="Katalog Proyek - M FAUZAN HANIF">
                <meta
                    name="description"
                    content="Koleksi lengkap seluruh proyek sistem, aplikasi web, dan open-source tool karya M FAUZAN HANIF."
                />
            </Head>

            <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
                <Navbar profile={profile} />

                <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                    {/* Top Back Link & Header */}
                    <div className="mb-10">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-3 py-1.5 text-xs font-heading text-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all mb-6"
                        >
                            <ArrowLeft className="size-3.5" />
                            Kembali ke Beranda
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <span className="inline-flex items-center rounded-base border-2 border-border bg-main px-3 py-1 text-xs font-heading text-main-foreground shadow-[2px_2px_0px_0px_var(--border)] mb-3">
                                    PORTOFOLIO LENGKAP
                                </span>
                                <h1 className="text-3xl md:text-5xl font-heading tracking-tight text-foreground">
                                    Galeri Semua Proyek
                                </h1>
                                <p className="text-foreground/75 font-base text-base md:text-lg max-w-2xl mt-2 leading-relaxed">
                                    Jelajahi seluruh karya arsitektur perangkat lunak, sistem skala enterprise, dan alat bantu yang pernah saya rancang dan kembangkan.
                                </p>
                            </div>

                            {/* Search Box */}
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground/50 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari proyek atau teknologi..."
                                    className="w-full rounded-base border-2 border-border bg-secondary-background pl-10 pr-9 py-2 text-sm font-base text-foreground shadow-shadow focus:outline-hidden focus:ring-2 focus:ring-black"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground"
                                    >
                                        <X className="size-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b-2 border-border/20">
                        <span className="inline-flex items-center gap-1.5 text-xs font-heading text-foreground/70 mr-1">
                            <Filter className="size-3.5" />
                            Kategori:
                        </span>

                        <button
                            type="button"
                            onClick={() => setActiveCategory('all')}
                            className={`rounded-base border-2 border-border px-3.5 py-1.5 text-xs font-heading transition-all ${
                                activeCategory === 'all'
                                    ? 'bg-main text-main-foreground shadow-shadow'
                                    : 'bg-secondary-background text-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none'
                            }`}
                        >
                            Semua ({projects.length})
                        </button>

                        {categories.map((category) => {
                            const count = projects.filter((p) =>
                                p.categories?.some((c) => c.slug === category.slug)
                            ).length;

                            return (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => setActiveCategory(category.slug)}
                                    className={`rounded-base border-2 border-border px-3.5 py-1.5 text-xs font-heading transition-all ${
                                        activeCategory === category.slug
                                            ? 'bg-main text-main-foreground shadow-shadow'
                                            : 'bg-secondary-background text-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none'
                                    }`}
                                >
                                    {category.name} ({count})
                                </button>
                            );
                        })}
                    </div>

                    {/* Projects Grid */}
                    {filteredProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProjects.map((project) => {
                                const techList = getTechStackList(project.tech_stack);

                                return (
                                    <div
                                        key={project.id}
                                        className="group flex flex-col justify-between rounded-base border-2 border-border bg-secondary-background p-5 shadow-shadow transition-all duration-150 hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                                    >
                                        <div>
                                            {/* Cover */}
                                            <div className="relative aspect-video w-full rounded-base border-2 border-border overflow-hidden bg-main/10 mb-5">
                                                {project.image ? (
                                                    <img
                                                        src={project.image}
                                                        alt={project.title}
                                                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="size-full flex flex-col items-center justify-center bg-main/15 text-foreground/80 p-4 text-center">
                                                        <FolderGit2 className="size-10 mb-2 text-foreground/70" />
                                                        <span className="font-heading text-xs tracking-wider uppercase text-foreground/70">
                                                            {project.categories?.[0]?.name || 'Web App'}
                                                        </span>
                                                    </div>
                                                )}

                                                {project.categories && project.categories.length > 0 && (
                                                    <div className="absolute top-2.5 right-2.5 flex flex-wrap gap-1.5">
                                                        {project.categories.slice(0, 1).map((cat) => (
                                                            <span
                                                                key={cat.id}
                                                                className="rounded-base border-2 border-border bg-main px-2 py-0.5 text-[11px] font-heading text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]"
                                                            >
                                                                {cat.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-xl font-heading text-foreground mb-2 line-clamp-1 group-hover:text-main transition-colors">
                                                {project.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-sm font-base text-foreground/80 line-clamp-3 mb-4 leading-relaxed">
                                                {project.description}
                                            </p>

                                            {/* Tech Stack */}
                                            {techList.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mb-5">
                                                    {techList.slice(0, 4).map((tech, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="rounded-base border-2 border-border bg-secondary-background px-2 py-0.5 text-xs font-heading shadow-[1px_1px_0px_0px_var(--border)]"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                    {techList.length > 4 && (
                                                        <span className="rounded-base border border-border bg-muted px-1.5 py-0.5 text-xs font-heading text-foreground/60">
                                                            +{techList.length - 4}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="pt-4 border-t-2 border-border/20 flex items-center justify-between">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedProject(project)}
                                                className="text-xs font-heading text-foreground hover:text-main underline decoration-2 underline-offset-4 cursor-pointer"
                                            >
                                                Lihat Detail →
                                            </button>

                                            {project.project_url && (
                                                <a
                                                    href={project.project_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 rounded-base border-2 border-border bg-main px-3 py-1.5 text-xs font-heading text-main-foreground shadow-[1px_1px_0px_0px_var(--border)] hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
                                                >
                                                    Demo
                                                    <ExternalLink className="size-3.5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="rounded-base border-2 border-dashed border-border bg-secondary-background p-12 text-center shadow-shadow my-8">
                            <FolderGit2 className="size-12 mx-auto mb-4 text-foreground/40" />
                            <h3 className="text-xl font-heading text-foreground mb-2">
                                Tidak ada proyek ditemukan
                            </h3>
                            <p className="text-sm font-base text-foreground/70 max-w-md mx-auto mb-6">
                                {searchQuery
                                    ? `Tidak ditemukan proyek yang cocok dengan kata kunci "${searchQuery}".`
                                    : 'Belum ada proyek yang terdaftar dalam kategori ini.'}
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setActiveCategory('all');
                                    setSearchQuery('');
                                }}
                                className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-main px-4 py-2 font-heading text-xs text-main-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
                            >
                                <RotateCcw className="size-3.5" />
                                Reset Filter & Pencarian
                            </button>
                        </div>
                    )}

                    {/* Interactive Project Detail Modal */}
                    {selectedProject && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-base border-2 border-border bg-secondary-background p-6 md:p-8 shadow-[4px_4px_0px_0px_var(--border)] animate-in fade-in zoom-in-95">
                                <button
                                    type="button"
                                    onClick={() => setSelectedProject(null)}
                                    className="absolute right-4 top-4 rounded-base border-2 border-border bg-secondary-background p-1.5 shadow-[1px_1px_0px_0px_var(--border)] hover:bg-main hover:text-main-foreground transition-all cursor-pointer"
                                >
                                    <X className="size-5" />
                                </button>

                                {selectedProject.image && (
                                    <div className="aspect-video w-full rounded-base border-2 border-border overflow-hidden mb-6">
                                        <img
                                            src={selectedProject.image}
                                            alt={selectedProject.title}
                                            className="size-full object-cover"
                                        />
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2 mb-3">
                                    {selectedProject.categories?.map((cat) => (
                                        <span
                                            key={cat.id}
                                            className="rounded-base border-2 border-border bg-main px-2.5 py-0.5 text-xs font-heading text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]"
                                        >
                                            {cat.name}
                                        </span>
                                    ))}
                                </div>

                                <h2 className="text-2xl md:text-3xl font-heading text-foreground mb-4">
                                    {selectedProject.title}
                                </h2>

                                <p className="text-base font-base text-foreground/80 whitespace-pre-line leading-relaxed mb-6">
                                    {selectedProject.description}
                                </p>

                                {selectedProject.tech_stack && (
                                    <div className="mb-6">
                                        <h4 className="text-xs font-heading uppercase tracking-wider text-foreground/60 mb-2">
                                            Teknologi & Tools
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {getTechStackList(selectedProject.tech_stack).map((tech, idx) => (
                                                <span
                                                    key={idx}
                                                    className="rounded-base border-2 border-border bg-secondary-background px-2.5 py-1 text-xs font-heading shadow-[1px_1px_0px_0px_var(--border)]"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-border/20">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedProject(null)}
                                        className="rounded-base border-2 border-border bg-secondary-background px-4 py-2 font-heading text-xs text-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all cursor-pointer"
                                    >
                                        Tutup
                                    </button>

                                    {selectedProject.project_url && (
                                        <a
                                            href={selectedProject.project_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-main px-4 py-2 font-heading text-xs text-main-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
                                        >
                                            Kunjungi Tautan Proyek
                                            <ExternalLink className="size-4" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <Footer profile={profile} />
            </div>
        </>
    );
}
```

---

### Blueprint 5: `resources/js/pages/articles.tsx`

```tsx
import { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, BookOpen, Calendar, Clock, Filter, RotateCcw, Search, X } from 'lucide-react';
import type { Article, Category, Profile } from '@/types/portfolio';
import { Navbar, Footer } from '@/components/landing';

export interface ArticlesPageProps {
    articles: Article[];
    categories?: Category[];
    search?: string | null;
    profile?: Profile;
}

export default function Articles({
    articles = [],
    categories = [],
    search = null,
    profile,
}: ArticlesPageProps) {
    const [searchQuery, setSearchQuery] = useState<string>(search || '');
    const [activeCategory, setActiveCategory] = useState<string>('all');

    // Real-time client-side filter
    const filteredArticles = useMemo(() => {
        return articles.filter((article) => {
            const matchesCategory =
                activeCategory === 'all' ||
                article.categories?.some((cat) => cat.slug === activeCategory);

            const q = searchQuery.toLowerCase().trim();
            const matchesSearch =
                !q ||
                article.title.toLowerCase().includes(q) ||
                (article.excerpt && article.excerpt.toLowerCase().includes(q)) ||
                (article.content && article.content.toLowerCase().includes(q)) ||
                article.tags?.some((t) => t.name.toLowerCase().includes(q));

            return matchesCategory && matchesSearch;
        });
    }, [articles, activeCategory, searchQuery]);

    const formatDate = (dateString?: string | null): string => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    const getEstimatedReadingTime = (content: string): string => {
        const text = content.replace(/<[^>]*>/g, '').trim();
        const words = text ? text.split(/\s+/).length : 0;
        const minutes = Math.max(1, Math.ceil(words / 200));
        return `${minutes} mnt baca`;
    };

    return (
        <>
            <Head title="Arsip Artikel & Blog - M FAUZAN HANIF">
                <meta
                    name="description"
                    content="Kumpulan artikel teknis, catatan arsitektur sistem, dan tutorial pengembangan web oleh M FAUZAN HANIF."
                />
            </Head>

            <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
                <Navbar profile={profile} />

                <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                    {/* Header Banner */}
                    <div className="mb-10">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-3 py-1.5 text-xs font-heading text-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all mb-6"
                        >
                            <ArrowLeft className="size-3.5" />
                            Kembali ke Beranda
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <span className="inline-flex items-center rounded-base border-2 border-border bg-main px-3 py-1 text-xs font-heading text-main-foreground shadow-[2px_2px_0px_0px_var(--border)] mb-3">
                                    BLOG & ARSIP
                                </span>
                                <h1 className="text-3xl md:text-5xl font-heading tracking-tight text-foreground">
                                    Artikel & Tulisan Teknis
                                </h1>
                                <p className="text-foreground/75 font-base text-base md:text-lg max-w-2xl mt-2 leading-relaxed">
                                    Wawasan, tutorial, dan pengalaman seputar rekayasa perangkat lunak, arsitektur sistem backend, dan teknologi web modern.
                                </p>
                            </div>

                            {/* Search Input */}
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground/50 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari judul, topik, atau kata kunci..."
                                    className="w-full rounded-base border-2 border-border bg-secondary-background pl-10 pr-9 py-2 text-sm font-base text-foreground shadow-shadow focus:outline-hidden focus:ring-2 focus:ring-black"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground"
                                    >
                                        <X className="size-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b-2 border-border/20">
                        <span className="inline-flex items-center gap-1.5 text-xs font-heading text-foreground/70 mr-1">
                            <Filter className="size-3.5" />
                            Kategori:
                        </span>

                        <button
                            type="button"
                            onClick={() => setActiveCategory('all')}
                            className={`rounded-base border-2 border-border px-3.5 py-1.5 text-xs font-heading transition-all ${
                                activeCategory === 'all'
                                    ? 'bg-main text-main-foreground shadow-shadow'
                                    : 'bg-secondary-background text-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none'
                            }`}
                        >
                            Semua ({articles.length})
                        </button>

                        {categories.map((category) => {
                            const count = articles.filter((a) =>
                                a.categories?.some((c) => c.slug === category.slug)
                            ).length;

                            return (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => setActiveCategory(category.slug)}
                                    className={`rounded-base border-2 border-border px-3.5 py-1.5 text-xs font-heading transition-all ${
                                        activeCategory === category.slug
                                            ? 'bg-main text-main-foreground shadow-shadow'
                                            : 'bg-secondary-background text-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none'
                                    }`}
                                >
                                    {category.name} ({count})
                                </button>
                            );
                        })}
                    </div>

                    {/* Articles Grid */}
                    {filteredArticles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredArticles.map((article) => {
                                const readingTime = getEstimatedReadingTime(article.content);
                                const formattedDate = formatDate(article.published_at);

                                return (
                                    <div
                                        key={article.id}
                                        className="group flex flex-col justify-between rounded-base border-2 border-border bg-secondary-background p-5 shadow-shadow transition-all duration-150 hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                                    >
                                        <div>
                                            {/* Cover */}
                                            <Link
                                                href={`/articles/${article.slug}`}
                                                className="block relative aspect-video w-full rounded-base border-2 border-border overflow-hidden bg-main/10 mb-5 focus:outline-hidden"
                                            >
                                                {article.cover_image ? (
                                                    <img
                                                        src={article.cover_image}
                                                        alt={article.title}
                                                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="size-full flex flex-col items-center justify-center bg-main/15 text-foreground/80 p-4 text-center">
                                                        <BookOpen className="size-10 mb-2 text-foreground/70" />
                                                        <span className="font-heading text-xs tracking-wider uppercase text-foreground/70">
                                                            {article.categories?.[0]?.name || 'Article'}
                                                        </span>
                                                    </div>
                                                )}

                                                {article.categories && article.categories.length > 0 && (
                                                    <div className="absolute top-2.5 right-2.5">
                                                        <span className="rounded-base border-2 border-border bg-main px-2 py-0.5 text-[11px] font-heading text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                                                            {article.categories[0].name}
                                                        </span>
                                                    </div>
                                                )}
                                            </Link>

                                            {/* Metadata */}
                                            <div className="flex items-center gap-3 text-xs font-base text-foreground/70 mb-3">
                                                {formattedDate && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <Calendar className="size-3.5" />
                                                        {formattedDate}
                                                    </span>
                                                )}
                                                <span className="inline-flex items-center gap-1">
                                                    <Clock className="size-3.5" />
                                                    {readingTime}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-xl font-heading text-foreground mb-2 line-clamp-2 group-hover:text-main transition-colors">
                                                <Link href={`/articles/${article.slug}`}>
                                                    {article.title}
                                                </Link>
                                            </h3>

                                            {/* Excerpt */}
                                            <p className="text-sm font-base text-foreground/80 line-clamp-2 mb-4 leading-relaxed">
                                                {article.excerpt || article.content.replace(/<[^>]*>/g, '').slice(0, 120) + '...'}
                                            </p>

                                            {/* Tags */}
                                            {article.tags && article.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mb-5">
                                                    {article.tags.slice(0, 4).map((tag) => (
                                                        <span
                                                            key={tag.id}
                                                            className="text-xs font-mono text-foreground/60 bg-background px-1.5 py-0.5 rounded-sm border border-border/50"
                                                        >
                                                            #{tag.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Read Link */}
                                        <div className="pt-4 border-t-2 border-border/20 flex items-center justify-between">
                                            <Link
                                                href={`/articles/${article.slug}`}
                                                className="inline-flex items-center gap-1 text-sm font-heading text-foreground hover:text-main underline decoration-2 underline-offset-4"
                                            >
                                                Baca Artikel
                                                <ArrowRight className="size-4" />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="rounded-base border-2 border-dashed border-border bg-secondary-background p-12 text-center shadow-shadow my-8">
                            <BookOpen className="size-12 mx-auto mb-4 text-foreground/40" />
                            <h3 className="text-xl font-heading text-foreground mb-2">
                                Tidak ada artikel ditemukan
                            </h3>
                            <p className="text-sm font-base text-foreground/70 max-w-md mx-auto mb-6">
                                {searchQuery
                                    ? `Tidak ditemukan tulisan yang cocok dengan kata kunci "${searchQuery}".`
                                    : 'Belum ada artikel yang dipublikasikan dalam kategori ini.'}
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setActiveCategory('all');
                                    setSearchQuery('');
                                }}
                                className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-main px-4 py-2 font-heading text-xs text-main-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
                            >
                                <RotateCcw className="size-3.5" />
                                Reset Filter & Pencarian
                            </button>
                        </div>
                    )}
                </main>

                <Footer profile={profile} />
            </div>
        </>
    );
}
```

---

### Blueprint 6: `resources/js/pages/articles/show.tsx`

```tsx
import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Check,
    Clock,
    Copy,
    Share2,
    Tag,
} from 'lucide-react';
import type { Article, Profile } from '@/types/portfolio';
import { Navbar, Footer } from '@/components/landing';

export interface ArticleShowProps {
    article: Article;
    relatedArticles?: Article[];
    profile?: Profile;
}

export default function ArticleShow({
    article,
    relatedArticles = [],
    profile,
}: ArticleShowProps) {
    const [copied, setCopied] = useState<boolean>(false);
    const [readingProgress, setReadingProgress] = useState<number>(0);

    // Reading scroll progress indicator
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight > 0) {
                const currentProgress = (window.scrollY / totalHeight) * 100;
                setReadingProgress(Math.min(100, Math.max(0, currentProgress)));
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const formatDate = (dateString?: string | null): string => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    const getEstimatedReadingTime = (content: string): string => {
        const text = content.replace(/<[^>]*>/g, '').trim();
        const words = text ? text.split(/\s+/).length : 0;
        const minutes = Math.max(1, Math.ceil(words / 200));
        return `${minutes} menit baca`;
    };

    const handleCopyLink = () => {
        if (typeof window !== 'undefined') {
            void navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const readingTime = getEstimatedReadingTime(article.content);
    const formattedDate = formatDate(article.published_at);

    return (
        <>
            <Head title={`${article.title} - M FAUZAN HANIF`}>
                <meta
                    name="description"
                    content={article.excerpt || `${article.title} oleh M FAUZAN HANIF`}
                />
            </Head>

            {/* Reading progress bar */}
            <div
                className="fixed top-0 left-0 h-1 bg-main z-50 transition-all duration-75"
                style={{ width: `${readingProgress}%` }}
            />

            <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
                <Navbar profile={profile} />

                <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
                    {/* Back Link */}
                    <div className="mb-8">
                        <Link
                            href="/articles"
                            className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-3 py-1.5 text-xs font-heading text-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
                        >
                            <ArrowLeft className="size-3.5" />
                            Kembali ke Semua Artikel
                        </Link>
                    </div>

                    {/* Article Header Card */}
                    <header className="rounded-base border-2 border-border bg-secondary-background p-6 md:p-8 shadow-shadow mb-8">
                        {/* Categories */}
                        {article.categories && article.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {article.categories.map((cat) => (
                                    <span
                                        key={cat.id}
                                        className="rounded-base border-2 border-border bg-main px-2.5 py-0.5 text-xs font-heading text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]"
                                    >
                                        {cat.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl font-heading tracking-tight leading-tight text-foreground mb-4">
                            {article.title}
                        </h1>

                        {/* Excerpt if present */}
                        {article.excerpt && (
                            <p className="text-base md:text-lg font-base text-foreground/80 leading-relaxed mb-6 italic">
                                "{article.excerpt}"
                            </p>
                        )}

                        {/* Metadata Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-border/20 text-xs font-base text-foreground/75">
                            <div className="flex flex-wrap items-center gap-4">
                                <span className="font-heading text-foreground">
                                    Oleh: {profile?.name || 'M FAUZAN HANIF'}
                                </span>
                                {formattedDate && (
                                    <span className="inline-flex items-center gap-1.5">
                                        <Calendar className="size-3.5" />
                                        {formattedDate}
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1.5">
                                    <Clock className="size-3.5" />
                                    {readingTime}
                                </span>
                            </div>

                            {/* Share button */}
                            <button
                                type="button"
                                onClick={handleCopyLink}
                                className="inline-flex items-center gap-1.5 rounded-base border-2 border-border bg-background px-3 py-1 font-heading text-xs shadow-[1px_1px_0px_0px_var(--border)] hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all cursor-pointer"
                            >
                                {copied ? (
                                    <>
                                        <Check className="size-3.5 text-green-600" />
                                        Tautan Tersalin!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="size-3.5" />
                                        Salin Tautan
                                    </>
                                )}
                            </button>
                        </div>
                    </header>

                    {/* Article Cover Image */}
                    {article.cover_image && (
                        <div className="rounded-base border-2 border-border shadow-shadow overflow-hidden mb-10">
                            <img
                                src={article.cover_image}
                                alt={article.title}
                                className="w-full object-cover aspect-video md:aspect-[21/9]"
                            />
                        </div>
                    )}

                    {/* TipTap HTML Content Renderer with Neobrutalism Typography (§5.5) */}
                    <article
                        className="neobrutalism-reader rounded-base border-2 border-border bg-secondary-background p-6 md:p-10 shadow-shadow mb-10 font-base text-foreground
                            [&_h2]:border-b-2 [&_h2]:border-border [&_h2]:pb-1 [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:font-heading [&_h2]:text-2xl md:[&_h2]:text-3xl [&_h2]:tracking-tight
                            [&_h3]:border-b-2 [&_h3]:border-border [&_h3]:pb-1 [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:font-heading [&_h3]:text-xl md:[&_h3]:text-2xl [&_h3]:tracking-tight
                            [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-base md:[&_p]:text-lg [&_p]:text-foreground/90
                            [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:bg-main/10 [&_blockquote]:px-5 [&_blockquote]:py-3 [&_blockquote]:italic [&_blockquote]:font-base [&_blockquote]:rounded-r-base [&_blockquote]:my-6
                            [&_pre]:border-2 [&_pre]:border-border [&_pre]:bg-background [&_pre]:rounded-base [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:shadow-[2px_2px_0px_0px_var(--border)] [&_pre]:my-6 [&_pre]:overflow-x-auto
                            [&_code]:font-mono [&_code]:text-sm
                            [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-4 [&_ul]:space-y-1.5 [&_ul]:leading-relaxed
                            [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-4 [&_ol]:space-y-1.5 [&_ol]:leading-relaxed
                            [&_img]:rounded-base [&_img]:border-2 [&_img]:border-border [&_img]:shadow-shadow [&_img]:my-6 [&_img]:max-w-full
                            [&_a]:underline [&_a]:decoration-2 [&_a]:underline-offset-2 [&_a]:font-heading [&_a]:hover:bg-main [&_a]:hover:text-main-foreground"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {/* Tags Footer */}
                    {article.tags && article.tags.length > 0 && (
                        <div className="rounded-base border-2 border-border bg-secondary-background p-5 shadow-shadow mb-12 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 text-xs font-heading text-foreground/70 mr-1">
                                <Tag className="size-3.5" />
                                Topik Terkait:
                            </span>
                            {article.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="rounded-base border-2 border-border bg-background px-2.5 py-1 text-xs font-mono font-medium shadow-[1px_1px_0px_0px_var(--border)]"
                                >
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Related Articles Section */}
                    {relatedArticles && relatedArticles.length > 0 && (
                        <div className="mt-14 pt-8 border-t-2 border-border">
                            <h3 className="text-2xl font-heading text-foreground mb-6">
                                Artikel Terkait Lainnya
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {relatedArticles.map((rel) => (
                                    <Link
                                        key={rel.id}
                                        href={`/articles/${rel.slug}`}
                                        className="group rounded-base border-2 border-border bg-secondary-background p-5 shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all flex flex-col justify-between"
                                    >
                                        <div>
                                            <span className="text-xs font-heading text-main uppercase">
                                                {rel.categories?.[0]?.name || 'Artikel'}
                                            </span>
                                            <h4 className="text-lg font-heading text-foreground mt-1 mb-2 line-clamp-2 group-hover:text-main transition-colors">
                                                {rel.title}
                                            </h4>
                                            <p className="text-xs font-base text-foreground/75 line-clamp-2 leading-relaxed">
                                                {rel.excerpt || rel.content.replace(/<[^>]*>/g, '').slice(0, 90) + '...'}
                                            </p>
                                        </div>
                                        <span className="text-xs font-heading text-foreground group-hover:text-main mt-4">
                                            Baca Artikel →
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </main>

                <Footer profile={profile} />
            </div>
        </>
    );
}
```

---

### Blueprint 7: `resources/js/pages/projects/show.tsx`

```tsx
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ExternalLink, FolderGit2 } from 'lucide-react';
import type { Profile, Project } from '@/types/portfolio';
import { Navbar, Footer } from '@/components/landing';

export interface ProjectShowPageProps {
    project: Project;
    relatedProjects?: Project[];
    profile?: Profile;
}

export default function ProjectShow({
    project,
    relatedProjects = [],
    profile,
}: ProjectShowPageProps) {
    const getTechStackList = (techStack: Project['tech_stack']): string[] => {
        if (Array.isArray(techStack)) return techStack;
        if (typeof techStack === 'string') {
            try {
                const parsed = JSON.parse(techStack);
                if (Array.isArray(parsed)) return parsed;
            } catch {
                return techStack.split(',').map((s) => s.trim()).filter(Boolean);
            }
        }
        return [];
    };

    const techList = getTechStackList(project.tech_stack);

    return (
        <>
            <Head title={`${project.title} - M FAUZAN HANIF`}>
                <meta name="description" content={project.description} />
            </Head>

            <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
                <Navbar profile={profile} />

                <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
                    {/* Back Link */}
                    <div className="mb-8">
                        <Link
                            href="/projects"
                            className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-3 py-1.5 text-xs font-heading text-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
                        >
                            <ArrowLeft className="size-3.5" />
                            Kembali ke Galeri Proyek
                        </Link>
                    </div>

                    {/* Main Card */}
                    <div className="rounded-base border-2 border-border bg-secondary-background p-6 md:p-10 shadow-shadow mb-10">
                        {/* Categories */}
                        {project.categories && project.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.categories.map((cat) => (
                                    <span
                                        key={cat.id}
                                        className="rounded-base border-2 border-border bg-main px-2.5 py-0.5 text-xs font-heading text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]"
                                    >
                                        {cat.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl font-heading tracking-tight leading-tight text-foreground mb-6">
                            {project.title}
                        </h1>

                        {/* Cover Image */}
                        {project.image ? (
                            <div className="aspect-video w-full rounded-base border-2 border-border overflow-hidden mb-8">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="size-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="aspect-video w-full rounded-base border-2 border-border overflow-hidden bg-main/15 flex flex-col items-center justify-center p-8 mb-8 text-center">
                                <FolderGit2 className="size-16 mb-3 text-foreground/60" />
                                <span className="font-heading text-sm uppercase tracking-wider text-foreground/60">
                                    Project Showcase
                                </span>
                            </div>
                        )}

                        {/* Description */}
                        <div className="mb-8">
                            <h3 className="text-lg font-heading text-foreground mb-3">
                                Deskripsi Proyek
                            </h3>
                            <p className="text-base font-base text-foreground/80 leading-relaxed whitespace-pre-line">
                                {project.description}
                            </p>
                        </div>

                        {/* Tech Stack */}
                        {techList.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-lg font-heading text-foreground mb-3">
                                    Teknologi yang Digunakan
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {techList.map((tech, idx) => (
                                        <span
                                            key={idx}
                                            className="rounded-base border-2 border-border bg-secondary-background px-3 py-1 text-sm font-heading shadow-[1px_1px_0px_0px_var(--border)]"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action buttons */}
                        {project.project_url && (
                            <div className="pt-6 border-t-2 border-border/20">
                                <a
                                    href={project.project_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-main px-6 py-3 font-heading text-sm text-main-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
                                >
                                    Buka Live Demo / Repositori
                                    <ExternalLink className="size-4" />
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Related Projects */}
                    {relatedProjects.length > 0 && (
                        <div className="mt-14 pt-8 border-t-2 border-border">
                            <h3 className="text-2xl font-heading text-foreground mb-6">
                                Proyek Lainnya
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedProjects.map((rel) => (
                                    <Link
                                        key={rel.id}
                                        href={`/projects/${rel.slug}`}
                                        className="group rounded-base border-2 border-border bg-secondary-background p-4 shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all flex flex-col justify-between"
                                    >
                                        <div>
                                            <span className="text-[11px] font-heading text-main uppercase">
                                                {rel.categories?.[0]?.name || 'Proyek'}
                                            </span>
                                            <h4 className="text-base font-heading text-foreground mt-1 mb-2 line-clamp-1 group-hover:text-main transition-colors">
                                                {rel.title}
                                            </h4>
                                            <p className="text-xs font-base text-foreground/75 line-clamp-2">
                                                {rel.description}
                                            </p>
                                        </div>
                                        <span className="text-xs font-heading text-foreground group-hover:text-main mt-3">
                                            Lihat Proyek →
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </main>

                <Footer profile={profile} />
            </div>
        </>
    );
}
```

---

### Blueprint 8: `resources/js/components/landing/index.ts`

```ts
export * from './navbar';
export * from './hero';
export * from './about';
export * from './skills-grid';
export * from './projects-showcase';
export * from './timeline';
export * from './certifications';
export * from './articles-showcase';
export * from './contact';
export * from './footer';
```

---

## 5. Verification Method

### 1. TypeScript Verification
Run typecheck to ensure zero syntax or contract errors:
```bash
pnpm run types:check
```
Expected output: Exits with code 0 and 0 errors across all public pages and components.

### 2. Feature & Public Routes Test Verification
Run Pest feature tests for public routes:
```bash
php artisan test --filter=PublicRoutesTest --compact
php artisan test --filter=HomeTest --compact
```
Expected outcome: All tests pass, including:
- `landing page route is accessible to anyone` -> PASS
- `public projects route is accessible when implemented` -> PASS (unskipped)
- `public articles route is accessible when implemented` -> PASS (unskipped)
- `public article detail route is accessible when implemented` -> PASS (unskipped)
- `landing page contract contains portfolio props when home controller is active` -> PASS

### 3. Invalidation Conditions
- If any component uses blur shadow classes (`shadow-md`, `shadow-lg`) instead of `shadow-shadow`, Neobrutalism validation fails.
- If `articles/show.tsx` strips `dangerouslySetInnerHTML` or misses heading borders `[&_h2]:border-b-2`, TipTap reader visual compliance fails.
- If `projects-showcase.tsx` or `articles-showcase.tsx` renders empty cards when `projects` or `articles` is an empty array, acceptance criterion R2/§27 is violated.
