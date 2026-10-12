import * as React from 'react';
import { Briefcase, GraduationCap, Building2 } from 'lucide-react';
import type { Experience, Education } from '@/types/portfolio';

interface TimelineProps {
    experiences: Experience[];
    educations: Education[];
}

export function Timeline({ experiences, educations }: TimelineProps) {
    const formatDate = (dateString?: string | null) => {
        if (!dateString) return 'Sekarang';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
        } catch {
            return dateString;
        }
    };

    return (
        <section id="timeline" className="w-full py-16 md:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-12 space-y-3">
                    <div className="inline-flex items-center rounded-base border-2 border-border bg-main px-3 py-1 text-xs font-heading text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                        RIWAYAT KARIER & PENDIDIKAN
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-heading tracking-tight text-foreground">
                        Pengalaman Kerja & Rekam Jejak Akademik
                    </h2>
                    <p className="text-base font-base text-foreground/80 max-w-2xl">
                        Perjalanan profesional dan pendidikan terstruktur yang membentuk fondasi keahlian rekayasa sistem.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Experiences Column */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="size-10 rounded-base border-2 border-border bg-main flex items-center justify-center shadow-[1px_1px_0px_0px_var(--border)]">
                                <Briefcase className="size-5 text-main-foreground" />
                            </div>
                            <h3 className="text-2xl font-heading text-foreground">
                                Pengalaman Kerja
                            </h3>
                        </div>

                        {experiences.length === 0 ? (
                            <div className="rounded-base border-2 border-border bg-secondary-background p-6 text-sm font-base text-foreground/70">
                                Belum ada riwayat pengalaman kerja.
                            </div>
                        ) : (
                            <div className="relative border-l-2 border-border pl-6 ml-3 space-y-8">
                                {experiences.map((exp) => (
                                    <div key={exp.id} className="relative group">
                                        {/* Neobrutalist Timeline Node */}
                                        <div className="absolute -left-[31px] top-1.5 size-4 rounded-xs border-2 border-border bg-main shadow-[1px_1px_0px_0px_var(--border)] transition-transform group-hover:scale-125"></div>

                                        {/* Card */}
                                        <div className="rounded-base border-2 border-border bg-secondary-background p-5 shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none">
                                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                                <h4 className="font-heading text-lg text-foreground">
                                                    {exp.role}
                                                </h4>
                                                <span className="rounded-base border-2 border-border bg-main px-2 py-0.5 text-xs font-heading text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                                                    {formatDate(exp.start_date)} – {formatDate(exp.end_date)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1.5 text-sm font-heading text-foreground/80 mb-3">
                                                <Building2 className="size-4" />
                                                <span>{exp.company}</span>
                                            </div>

                                            {exp.description && (
                                                <p className="text-sm font-base leading-relaxed text-foreground/85">
                                                    {exp.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Educations Column */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="size-10 rounded-base border-2 border-border bg-main flex items-center justify-center shadow-[1px_1px_0px_0px_var(--border)]">
                                <GraduationCap className="size-5 text-main-foreground" />
                            </div>
                            <h3 className="text-2xl font-heading text-foreground">
                                Riwayat Pendidikan
                            </h3>
                        </div>

                        {educations.length === 0 ? (
                            <div className="rounded-base border-2 border-border bg-secondary-background p-6 text-sm font-base text-foreground/70">
                                Belum ada riwayat pendidikan.
                            </div>
                        ) : (
                            <div className="relative border-l-2 border-border pl-6 ml-3 space-y-8">
                                {educations.map((edu) => (
                                    <div key={edu.id} className="relative group">
                                        {/* Neobrutalist Timeline Node */}
                                        <div className="absolute -left-[31px] top-1.5 size-4 rounded-xs border-2 border-border bg-secondary-background shadow-[1px_1px_0px_0px_var(--border)] transition-transform group-hover:scale-125"></div>

                                        {/* Card */}
                                        <div className="rounded-base border-2 border-border bg-secondary-background p-5 shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none">
                                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                                <h4 className="font-heading text-lg text-foreground">
                                                    {edu.degree}
                                                </h4>
                                                <span className="rounded-base border-2 border-border bg-background px-2 py-0.5 text-xs font-heading shadow-[1px_1px_0px_0px_var(--border)]">
                                                    {edu.start_year} – {edu.end_year || 'Sekarang'}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1.5 text-sm font-heading text-foreground/80 mb-3">
                                                <Building2 className="size-4" />
                                                <span>{edu.institution}</span>
                                            </div>

                                            {edu.description && (
                                                <p className="text-sm font-base leading-relaxed text-foreground/85">
                                                    {edu.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
