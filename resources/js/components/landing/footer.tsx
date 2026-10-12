import * as React from 'react';
import { ArrowUp, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Profile } from '@/types/portfolio';

interface FooterProps {
    profile?: Profile | null;
}

export function Footer({ profile }: FooterProps) {
    const currentYear = new Date().getFullYear();
    const name = profile?.name || 'M FAUZAN HANIF';

    return (
        <footer className="w-full border-t-2 border-border bg-secondary-background py-10 mt-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Brand & Attribution */}
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <div className="inline-flex items-center gap-2 font-heading text-base text-foreground">
                            <span className="rounded-base border-2 border-border bg-main px-2 py-0.5 text-xs text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                                MFH
                            </span>
                            <span>{name}</span>
                        </div>
                        <p className="text-xs font-base text-foreground/75 text-center md:text-left">
                            Personal Portfolio & Content Management System.
                        </p>
                    </div>

                    {/* Quick Section Links */}
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-heading">
                        <a href="/#hero" className="hover:underline">Beranda</a>
                        <a href="/#about" className="hover:underline">Tentang</a>
                        <a href="/#skills" className="hover:underline">Keahlian</a>
                        <a href="/#projects" className="hover:underline">Proyek</a>
                        <a href="/#timeline" className="hover:underline">Riwayat</a>
                        <a href="/#certifications" className="hover:underline">Sertifikat</a>
                        <a href="/#articles" className="hover:underline">Artikel</a>
                        <a href="/#contact" className="hover:underline">Kontak</a>
                    </div>

                    {/* Back to Top & CMS Admin Login */}
                    <div className="flex items-center gap-3">
                        <a
                            href="/login"
                            className="inline-flex items-center gap-1.5 rounded-base border-2 border-border bg-background px-2.5 py-1 text-xs font-heading shadow-[1px_1px_0px_0px_var(--border)] transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                            title="Akses CMS Admin"
                        >
                            <Lock className="size-3" />
                            <span>CMS</span>
                        </a>

                        <a href="#hero">
                            <Button variant="neutral" size="icon-xs" title="Kembali ke atas">
                                <ArrowUp className="size-3.5" />
                            </Button>
                        </a>
                    </div>
                </div>

                {/* Bottom Legal Notice */}
                <div className="mt-8 border-t-2 border-border/40 pt-4 text-center text-xs font-base text-foreground/70">
                    © {currentYear} {name}. Seluruh hak cipta dilindungi. Dibangun dengan Laravel 13, React 19, Inertia.js v3, dan Tailwind CSS v4.
                </div>
            </div>
        </footer>
    );
}
