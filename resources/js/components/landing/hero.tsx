import * as React from 'react';
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Profile } from '@/types/portfolio';

interface HeroProps {
    profile?: Profile | null;
}

export function Hero({ profile }: HeroProps) {
    const headline = profile?.headline || 'Full-Stack Software Engineer | Laravel, React & Cloud Enthusiast';
    const name = profile?.name || 'M FAUZAN HANIF';
    const email = profile?.email || 'fauzanhanif2112@gmail.com';
    const sosmed = profile?.sosmed || {};

    return (
        <section id="hero" className="relative w-full pt-12 pb-16 md:pt-20 md:pb-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
                    {/* Left Column: Introductions & CTAs (7 cols) */}
                    <div className="lg:col-span-7 flex flex-col items-start gap-6">
                        {/* Status Sticker Badge */}
                        <div className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-main px-3 py-1 text-xs font-heading text-main-foreground shadow-[2px_2px_0px_0px_var(--border)]">
                            <span className="relative flex size-2">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-black opacity-75"></span>
                                <span className="relative inline-flex size-2 rounded-full bg-black"></span>
                            </span>
                            <span>Tersedia untuk Peluang Rekrutmen & Proyek</span>
                        </div>

                        {/* Title & Name */}
                        <div className="space-y-3">
                            <p className="font-heading text-sm uppercase tracking-wider text-foreground/80 md:text-base">
                                Halo, saya
                            </p>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading tracking-tight leading-none text-foreground">
                                {name}
                            </h1>
                            <p className="text-lg sm:text-xl md:text-2xl font-heading text-foreground/90">
                                {headline}
                            </p>
                        </div>

                        {/* Brief Intro */}
                        <p className="max-w-xl text-base md:text-lg font-base leading-relaxed text-foreground/80">
                            Mengembangkan aplikasi web performa tinggi dengan perpaduan arsitektur backend yang kokoh berbasis Laravel dan pengalaman pengguna responsif, estetis, dan modern dengan React & Tailwind CSS.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <a href="#projects">
                                <Button variant="default" size="lg" className="gap-2">
                                    <span>Lihat Proyek Unggulan</span>
                                    <ArrowDown className="size-4" />
                                </Button>
                            </a>
                            <a href="#contact">
                                <Button variant="neutral" size="lg" className="gap-2">
                                    <span>Hubungi Saya</span>
                                    <ArrowUpRight className="size-4" />
                                </Button>
                            </a>
                        </div>

                        {/* Social Quick Bar */}
                        <div className="flex items-center gap-2.5 pt-2">
                            {sosmed.github && (
                                <a
                                    href={sosmed.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex size-10 items-center justify-center rounded-base border-2 border-border bg-secondary-background text-foreground shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                                    aria-label="GitHub Profile"
                                >
                                    <Github className="size-4.5" />
                                </a>
                            )}
                            {sosmed.linkedin && (
                                <a
                                    href={sosmed.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex size-10 items-center justify-center rounded-base border-2 border-border bg-secondary-background text-foreground shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                                    aria-label="LinkedIn Profile"
                                >
                                    <Linkedin className="size-4.5" />
                                </a>
                            )}
                            <a
                                href={`mailto:${email}`}
                                className="inline-flex size-10 items-center justify-center rounded-base border-2 border-border bg-secondary-background text-foreground shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                                aria-label="Kirim Email"
                            >
                                <Mail className="size-4.5" />
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Profile Photo with Neobrutalism Frame & SVG Fallback (5 cols) */}
                    <div className="lg:col-span-5 flex justify-center lg:justify-end">
                        <div className="relative group">
                            {/* Decorative Background Offset Card */}
                            <div className="absolute -inset-2 rounded-base border-2 border-border bg-main -rotate-3 transition-transform group-hover:rotate-0"></div>

                            {/* Main Photo Container */}
                            <div className="relative size-64 sm:size-72 md:size-80 rounded-base border-2 border-border bg-secondary-background shadow-shadow overflow-hidden flex items-center justify-center">
                                {profile?.photo ? (
                                    <img
                                        src={profile.photo}
                                        alt={name}
                                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        loading="eager"
                                    />
                                ) : (
                                    /* Neobrutalism High-Aesthetic Avatar Fallback */
                                    <div className="size-full bg-gradient-to-br from-main/30 via-secondary-background to-main/20 flex flex-col items-center justify-center p-6 text-center select-none">
                                        <div className="size-24 rounded-base border-2 border-border bg-main flex items-center justify-center shadow-shadow mb-4">
                                            <span className="font-heading text-3xl text-main-foreground">MFH</span>
                                        </div>
                                        <span className="font-heading text-base text-foreground tracking-tight">
                                            {name}
                                        </span>
                                        <span className="text-xs font-base text-foreground/75 mt-1">
                                            Software Engineer
                                        </span>
                                        <div className="mt-4 inline-flex items-center gap-1.5 rounded-base border-2 border-border bg-secondary-background px-2.5 py-0.5 text-[11px] font-heading shadow-[1px_1px_0px_0px_var(--border)]">
                                            <Sparkles className="size-3 text-amber-500" />
                                            <span>Web Craftsman</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
