import * as React from 'react';
import { Cpu, Database, Layout } from 'lucide-react';
import type { Profile } from '@/types/portfolio';

interface AboutProps {
    profile?: Profile | null;
}

export function About({ profile }: AboutProps) {
    const aboutText = profile?.about ||
        'Passionate software engineer specializing in building high-performance web applications and maintainable systems. Dedicated to clean code, domain-driven design, and performant backends with Laravel, paired with responsive, accessible user interfaces built on React, Inertia.js, and Tailwind CSS. Enthusiastic about continuous learning, open source contribution, and solving complex architectural challenges.';

    const highlights = [
        {
            title: 'Arsitektur Bersih & Teruji',
            description: 'Menulis kode backend modular dengan validasi ketat, relasi database optimal, dan cakupan automated testing Pest PHP.',
            icon: Database,
        },
        {
            title: 'Antarmuka Responsif & Cepat',
            description: 'Membangun SPA interaktif berbasis React 19 dan Inertia.js v3 dengan estetika Neobrutalism berkarakter tegas.',
            icon: Layout,
        },
        {
            title: 'Deployment Siap Produksi',
            description: 'Ramah terhadap shared hosting cPanel tanpa memerlukan symlink SSH, serta kompatibel dengan pipeline cloud modern.',
            icon: Cpu,
        },
    ];

    return (
        <section id="about" className="w-full py-16 md:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="rounded-base border-2 border-border bg-secondary-background p-6 sm:p-8 md:p-12 shadow-shadow">
                    {/* Header Badge */}
                    <div className="inline-flex items-center rounded-base border-2 border-border bg-main px-3 py-1 text-xs font-heading text-main-foreground shadow-[1px_1px_0px_0px_var(--border)] mb-4">
                        TENTANG SAYA
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading tracking-tight text-foreground mb-6">
                        Mendedikasikan Diri untuk Kualitas Perangkat Lunak & Rekayasa Web Handal
                    </h2>

                    {/* Narrative Bio */}
                    <div className="prose max-w-none text-base md:text-lg font-base leading-relaxed text-foreground/85 mb-10">
                        <p>{aboutText}</p>
                    </div>

                    {/* 3 Value Proposition Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t-2 border-border">
                        {highlights.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={idx}
                                    className="rounded-base border-2 border-border bg-background p-5 shadow-[2px_2px_0px_0px_var(--border)] transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                                >
                                    <div className="size-10 rounded-base border-2 border-border bg-main flex items-center justify-center shadow-[1px_1px_0px_0px_var(--border)] mb-4">
                                        <Icon className="size-5 text-main-foreground" />
                                    </div>
                                    <h3 className="font-heading text-lg text-foreground mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm font-base text-foreground/80 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
