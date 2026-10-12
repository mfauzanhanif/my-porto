import * as React from 'react';
import { useState } from 'react';
import { Menu, X, Sun, Moon, ArrowUpRight, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import type { Profile } from '@/types/portfolio';

interface NavbarProps {
    profile?: Profile | null;
}

export function Navbar({ profile }: NavbarProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { resolvedAppearance, updateAppearance } = useAppearance();

    const isHome = typeof window !== 'undefined' ? window.location.pathname === '/' : true;
    const prefix = isHome ? '' : '/';

    const navItems = [
        { label: 'Tentang', href: `${prefix}#about` },
        { label: 'Keahlian', href: `${prefix}#skills` },
        { label: 'Proyek', href: `${prefix}#projects` },
        { label: 'Riwayat', href: `${prefix}#timeline` },
        { label: 'Sertifikat', href: `${prefix}#certifications` },
        { label: 'Artikel', href: `${prefix}#articles` },
        { label: 'Kontak', href: `${prefix}#contact` },
    ];

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8">
            <nav className="mx-auto max-w-6xl rounded-base border-2 border-border bg-secondary-background/95 px-4 py-3 shadow-shadow backdrop-blur-md transition-all">
                <div className="flex items-center justify-between gap-4">
                    {/* Brand / Logo */}
                    <a
                        href="/#hero"
                        className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-main px-3 py-1 font-heading text-sm text-main-foreground shadow-[1px_1px_0px_0px_var(--border)] transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                    >
                        <Code className="size-4 shrink-0" />
                        <span className="tracking-tight">{profile?.name || 'M FAUZAN HANIF'}</span>
                    </a>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center gap-1.5">
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="rounded-base border-2 border-transparent px-2.5 py-1 text-sm font-heading text-foreground transition-all hover:border-border hover:bg-main/20 hover:text-foreground"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden sm:flex items-center gap-2.5">
                        <Button
                            variant="neutral"
                            size="icon-sm"
                            onClick={toggleTheme}
                            aria-label="Toggle dark mode"
                            title="Ganti Tema"
                        >
                            {resolvedAppearance === 'dark' ? (
                                <Sun className="size-4 text-amber-400" />
                            ) : (
                                <Moon className="size-4 text-foreground" />
                            )}
                        </Button>

                        <a href="/#contact">
                            <Button variant="default" size="sm" className="gap-1.5">
                                <span>Hubungi Saya</span>
                                <ArrowUpRight className="size-3.5" />
                            </Button>
                        </a>
                    </div>

                    {/* Mobile Menu & Theme Toggle */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <Button
                            variant="neutral"
                            size="icon-xs"
                            onClick={toggleTheme}
                            aria-label="Toggle dark mode"
                        >
                            {resolvedAppearance === 'dark' ? (
                                <Sun className="size-3.5 text-amber-400" />
                            ) : (
                                <Moon className="size-3.5 text-foreground" />
                            )}
                        </Button>

                        <Button
                            variant="neutral"
                            size="icon-xs"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle mobile menu"
                        >
                            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {mobileOpen && (
                    <div className="mt-3 border-t-2 border-border pt-3 lg:hidden flex flex-col gap-1.5">
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className="rounded-base border-2 border-border bg-background px-3 py-2 text-sm font-heading shadow-[1px_1px_0px_0px_var(--border)] transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                            >
                                {item.label}
                            </a>
                        ))}
                        <div className="pt-2">
                            <a href="/#contact" onClick={() => setMobileOpen(false)} className="w-full">
                                <Button variant="default" size="sm" className="w-full">
                                    Hubungi Saya
                                </Button>
                            </a>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
