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
                                className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-main px-4 py-2 font-heading text-xs text-main-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all cursor-pointer"
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
