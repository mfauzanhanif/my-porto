import * as React from 'react';
import { Server, Layout, Wrench, Star, Code } from 'lucide-react';
import type { Skill } from '@/types/portfolio';

interface SkillsGridProps {
    skills: Skill[];
}

export function SkillsGrid({ skills }: SkillsGridProps) {
    // Group skills by category (Backend, Frontend, Tools, etc.)
    const groupedSkills = React.useMemo(() => {
        const groups: Record<string, Skill[]> = {
            Backend: [],
            Frontend: [],
            Tools: [],
        };

        skills.forEach((skill) => {
            const cat = skill.category || 'Tools';
            if (!groups[cat]) {
                groups[cat] = [];
            }
            groups[cat].push(skill);
        });

        return groups;
    }, [skills]);

    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'backend':
                return Server;
            case 'frontend':
                return Layout;
            case 'tools':
                return Wrench;
            default:
                return Code;
        }
    };

    return (
        <section id="skills" className="w-full py-16 md:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-10 space-y-3">
                    <div className="inline-flex items-center rounded-base border-2 border-border bg-main px-3 py-1 text-xs font-heading text-main-foreground shadow-[1px_1px_0px_0px_var(--border)]">
                        KEAHLIAN TEKNIS
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-heading tracking-tight text-foreground">
                        Stack Teknologi & Peralatan Kerja
                    </h2>
                    <p className="text-base font-base text-foreground/80 max-w-2xl">
                        Keahlian teknis yang dikuasai untuk merancang, membangun, dan memelihara aplikasi web modern dari backend hingga antarmuka pengguna.
                    </p>
                </div>

                {/* Categorized Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {Object.entries(groupedSkills).map(([category, categorySkills]) => {
                        const Icon = getCategoryIcon(category);

                        return (
                            <div
                                key={category}
                                className="rounded-base border-2 border-border bg-secondary-background p-6 shadow-shadow flex flex-col justify-between"
                            >
                                <div>
                                    {/* Category Title Header */}
                                    <div className="flex items-center gap-3 border-b-2 border-border pb-4 mb-5">
                                        <div className="size-10 rounded-base border-2 border-border bg-main flex items-center justify-center shadow-[1px_1px_0px_0px_var(--border)]">
                                            <Icon className="size-5 text-main-foreground" />
                                        </div>
                                        <div>
                                            <h3 className="font-heading text-xl text-foreground">
                                                {category}
                                            </h3>
                                            <span className="text-xs font-base text-foreground/70">
                                                {categorySkills.length} keahlian
                                            </span>
                                        </div>
                                    </div>

                                    {/* Skills List Badges */}
                                    <div className="flex flex-wrap gap-2.5">
                                        {categorySkills.length === 0 ? (
                                             <p className="text-sm font-base text-foreground/60 italic">
                                                Belum ada keahlian terdaftar.
                                            </p>
                                        ) : (
                                            categorySkills.map((skill) => (
                                                <div
                                                    key={skill.id}
                                                    className={`inline-flex items-center gap-1.5 rounded-base border-2 border-border px-3 py-1.5 text-xs font-heading transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none ${
                                                        skill.is_featured
                                                            ? 'bg-main text-main-foreground shadow-[2px_2px_0px_0px_var(--border)]'
                                                            : 'bg-background text-foreground shadow-[1px_1px_0px_0px_var(--border)]'
                                                    }`}
                                                >
                                                    {skill.is_featured && (
                                                        <Star className="size-3 fill-current text-foreground shrink-0" />
                                                    )}
                                                    <span>{skill.name}</span>
                                                    {skill.level && (
                                                        <span className="ml-1 opacity-75 font-base text-[10px]">
                                                            ({skill.level})
                                                        </span>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
