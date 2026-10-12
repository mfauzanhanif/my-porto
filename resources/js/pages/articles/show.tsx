import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Check,
    Clock,
    Copy,
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
