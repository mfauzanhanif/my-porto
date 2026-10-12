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
