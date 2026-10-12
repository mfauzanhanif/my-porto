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
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground cursor-pointer"
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
                            className={`rounded-base border-2 border-border px-3.5 py-1.5 text-xs font-heading transition-all cursor-pointer ${
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
                                    className={`rounded-base border-2 border-border px-3.5 py-1.5 text-xs font-heading transition-all cursor-pointer ${
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
                                className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-main px-4 py-2 font-heading text-xs text-main-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all cursor-pointer"
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
