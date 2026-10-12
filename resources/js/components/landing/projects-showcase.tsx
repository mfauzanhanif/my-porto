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
