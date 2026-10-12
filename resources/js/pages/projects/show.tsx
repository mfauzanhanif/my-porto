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
